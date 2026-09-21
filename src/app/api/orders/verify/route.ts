import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml } from '@/lib/email/templates';
import { sendAdminTelegramNotification } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    // H-1: Require authentication for payment verification
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json(
        { error: 'Authentication required.' },
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

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

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

    order.paymentStatus = 'Paid';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Send Telegram Notification
    await sendAdminTelegramNotification(order);

    // Decrement stock for Razorpay order
    if (order.items && order.items.length > 0) {
      const bulkOperations = order.items.map((item: any) => ({
        updateOne: {
          filter: {
            $or: [
              { _id: item.productId.length === 24 ? item.productId : null },
              { slug: item.productId }
            ]
          },
          update: { $inc: { stock: -item.quantity } },
        },
      }));

      bulkOperations.forEach((op: any) => {
        if (!op.updateOne.filter.$or[0]._id) {
          op.updateOne.filter.$or.shift();
        }
      });

      if (bulkOperations.length > 0) {
        await Product.bulkWrite(bulkOperations);
      }
    }

    // Send confirmation email
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
        from: process.env.EMAIL_FROM || 'Info@terramensco.com',
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
    } catch (emailError) {
      console.error('Failed to send payment confirmation email:', emailError);
    }

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
