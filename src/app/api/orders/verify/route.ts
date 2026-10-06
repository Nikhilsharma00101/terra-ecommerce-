import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml } from '@/lib/email/templates';
import { sendAdminTelegramNotification } from '@/lib/telegram';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  try {
    // H-1: Require authentication for payment verification
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Please sign in to continue.' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment fields.' },
        { status: 400 }
      );
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || '').trim();

    if (!secret) {
      return NextResponse.json(
        { error: 'Payment verification is not configured.' },
        { status: 500 }
      );
    }

    // C-3: Verify HMAC with timing-safe comparison
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    // Ensure both signatures are the same length before comparison
    if (
      generated_signature.length !== razorpay_signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(generated_signature, 'hex'),
        Buffer.from(razorpay_signature, 'hex')
      )
    ) {
      return NextResponse.json(
        { error: 'Payment verification failed.', success: false },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found for this payment.', success: false },
        { status: 404 }
      );
    }

    // H-1: Verify the authenticated user owns this order
    if (
      authUser.role !== 'admin' &&
      order.userId?.toString() !== authUser.userId &&
      order.customerEmail.toLowerCase() !== authUser.email.toLowerCase()
    ) {
      return NextResponse.json(
        { error: 'Payment verification failed.', success: false },
        { status: 403 }
      );
    }

    if (order.paymentStatus === 'Paid') {
      return NextResponse.json(
        { message: 'Order is already marked as paid.', success: true },
        { status: 200 }
      );
    }

    // F-PAY-3: Verify the paid amount with Razorpay
    try {
      const razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
      });
      const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
      const expectedAmount = Math.round(order.total * 100);
      if (razorpayOrder.amount !== expectedAmount) {
        console.error(`Amount mismatch for order ${order.orderNumber}. Expected ${expectedAmount}, got ${razorpayOrder.amount}`);
        return NextResponse.json(
          { error: 'Payment amount mismatch.', success: false },
          { status: 400 }
        );
      }
    } catch (rzpError) {
      console.error('Failed to verify Razorpay order amount:', rzpError);
      return NextResponse.json(
        { error: 'Failed to verify payment with payment gateway.', success: false },
        { status: 500 }
      );
    }

    // Atomic update to avoid race conditions (F-PAY-2)
    order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id, paymentStatus: 'Pending' },
      { $set: { paymentStatus: 'Paid', razorpayPaymentId: razorpay_payment_id } },
      { returnDocument: 'after' }
    );

    if (!order) {
       // It means it was updated by webhook in the meantime
       return NextResponse.json(
         { message: 'Order is already marked as paid.', success: true },
         { status: 200 }
       );
    }

    const telegramPromise = sendAdminTelegramNotification(order).catch(err => {
      console.error('Failed to send Telegram notification:', err);
    });

    // 1. Decrement stock for Razorpay order FIRST
    let stockDeductionSuccess = true;
    const deductedItems = [];
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        let filter: any = { stock: { $gte: item.quantity } };
        if (item.productId.length === 24) {
          filter.$or = [{ _id: item.productId }, { slug: item.productId }];
        } else {
          filter.slug = item.productId;
        }

        const updatedProduct = await Product.findOneAndUpdate(
          filter,
          { $inc: { stock: -item.quantity } }
        );
        
        if (updatedProduct) {
          deductedItems.push(item);
        } else {
          stockDeductionSuccess = false;
          break;
        }
      }

      if (!stockDeductionSuccess) {
        for (const item of deductedItems) {
          let filter: any = {};
          if (item.productId.length === 24) {
            filter.$or = [{ _id: item.productId }, { slug: item.productId }];
          } else {
            filter.slug = item.productId;
          }
          await Product.updateOne(filter, { $inc: { stock: item.quantity } });
        }
      }
    }

    if (!stockDeductionSuccess) {
      try {
        const razorpayClient = new Razorpay({
          key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
          key_secret: process.env.RAZORPAY_KEY_SECRET || '',
        });
        await razorpayClient.payments.refund(razorpay_payment_id, { amount: Math.round(order.total * 100) });
        await Order.updateOne({ _id: order._id }, { $set: { status: 'Cancelled', paymentStatus: 'Refunded' } });
      } catch (refundError) {
        console.error('Failed to issue automatic refund for out of stock order:', refundError);
      }
      return NextResponse.json(
        { error: 'One or more items went out of stock during payment. Your order has been cancelled and refunded.' },
        { status: 400 }
      );
    }

    // 2. Push to Shiprocket with Atomic Lock
    const shiprocketPromise = (async () => {
      const lock = await Order.findOneAndUpdate(
        { _id: order._id, shiprocketPushInitiated: false },
        { $set: { shiprocketPushInitiated: true } }
      );
      
      if (lock && !order.shiprocketOrderId) {
        try {
          const { shiprocket } = await import('@/lib/shiprocket');
          const srResponse = await shiprocket.createOrder(order, 'Prepaid');
          
          if (srResponse && srResponse.order_id) {
            await Order.updateOne(
              { _id: order._id },
              { 
                $set: { 
                  shiprocketOrderId: srResponse.order_id,
                  shiprocketShipmentId: srResponse.shipment_id,
                  shipmentStatus: srResponse.status
                } 
              }
            );
          }
        } catch (srError) {
          console.error(`Shiprocket Integration Error for Prepaid (Verify) ${order.orderNumber}:`, srError);
        }
      }
    })();

    const emailPromise = (async () => {
      if (!order.emailSent) {
        try {
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT) || 465,
            secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
            auth: {
              user: process.env.EMAIL_SERVER_USER || 'Info@terramensco.com',
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
          });

          const mailOptions = {
            from: '"Terra Men\'s Co." <' + (process.env.EMAIL_FROM || 'info@terramensco.com') + '>',
            to: order.customerEmail,
            subject: `Terra Men's Co - Payment Received for Order ${order.orderNumber}`,
            html: generateOrderConfirmationHtml({
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              items: order.items,
              subtotal: order.subtotal,
              discountAmount: order.discountAmount,
              couponCode: order.couponCode,
              shipping: order.shipping,
              total: order.total,
              shippingAddress: {
                firstName: order.shippingAddress.firstName,
                lastName: order.shippingAddress.lastName || '',
                address1: order.shippingAddress.address1,
                address2: order.shippingAddress.address2,
                city: order.shippingAddress.city,
                state: order.shippingAddress.state,
                postalCode: order.shippingAddress.postalCode
              },
              paymentMethod: 'razorpay'
            }, true),
          };

          await transporter.sendMail(mailOptions);
          await Order.updateOne({ _id: order._id }, { $set: { emailSent: true } });
        } catch (emailError) {
          console.error('Failed to send payment confirmation email:', emailError);
        }
      }
    })();

    // Await all parallel background tasks
    await Promise.allSettled([telegramPromise, shiprocketPromise, emailPromise]);

    return NextResponse.json(
      { message: 'Payment successfully verified.', success: true },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during payment verification.' },
      { status: 500 }
    );
  }
}
