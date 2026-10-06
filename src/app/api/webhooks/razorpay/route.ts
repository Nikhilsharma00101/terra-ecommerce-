import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import nodemailer from 'nodemailer';
import { generateOrderConfirmationHtml } from '@/lib/email/templates';
import { sendAdminTelegramNotification } from '@/lib/telegram';

/**
 * Handles incoming webhooks from Razorpay.
 * Flow:
 * 1. Reads the raw request body.
 * 2. Extracts the `x-razorpay-signature` from the headers.
 * 3. Verifies the signature using HMAC SHA-256 and a timing-safe equality check to ensure authenticity.
 * 4. Parses the event payload to extract order and payment IDs.
 * 5. If `order.paid` or `payment.captured` event is received, marks the corresponding MongoDB Order as 'Paid'.
 * 6. Sends a confirmation email to the customer.
 * 
 * @param {NextRequest} req - The incoming webhook request from Razorpay.
 * @returns {NextResponse} JSON indicating success or failure.
 */
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-razorpay-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing Razorpay signature' }, { status: 400 });
    }

    const webhookSecret = (process.env.RAZORPAY_WEBHOOK_SECRET || '').trim();
    if (!webhookSecret) {
      console.error('Webhook secret is not configured.');
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 });
    }

    // C-3: Verify the webhook signature with timing-safe comparison
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(rawBody);
    const generatedSignature = hmac.digest('hex');

    if (
      generatedSignature.length !== signature.length ||
      !crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'hex'),
        Buffer.from(signature, 'hex')
      )
    ) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // We only care about payment captured or order paid events
    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      let razorpayOrderId = null;
      let razorpayPaymentId = null;

      if (event.event === 'order.paid') {
        razorpayOrderId = event.payload.order.entity.id;
        // order.paid does not always contain payment id at the root, depending on Razorpay version
      } else if (event.event === 'payment.captured') {
        razorpayOrderId = event.payload.payment.entity.order_id;
        razorpayPaymentId = event.payload.payment.entity.id;
      }

      if (razorpayOrderId) {
        await connectToDatabase();

        const updateData: any = { paymentStatus: 'Paid' };
        if (razorpayPaymentId) {
          updateData.razorpayPaymentId = razorpayPaymentId;
        }

        let order = await Order.findOneAndUpdate(
          { razorpayOrderId: razorpayOrderId, paymentStatus: 'Pending' },
          { $set: updateData },
          { returnDocument: 'after' }
        );

        let wasAlreadyPaid = false;

        if (!order) {
          // It was already Paid. Just update the payment ID if needed.
          if (razorpayPaymentId) {
            order = await Order.findOneAndUpdate(
              { razorpayOrderId: razorpayOrderId },
              { $set: { razorpayPaymentId: razorpayPaymentId } },
              { returnDocument: 'after' }
            );
          } else {
            order = await Order.findOne({ razorpayOrderId: razorpayOrderId });
          }
          wasAlreadyPaid = true;
        }

        if (order && order.paymentStatus !== 'Refunded') {
          if (!wasAlreadyPaid) {
            // Decrement stock for Razorpay order (F-PAY-1) ONLY ONCE
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
                const Razorpay = (await import('razorpay')).default;
                const razorpayClient = new Razorpay({
                  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                  key_secret: process.env.RAZORPAY_KEY_SECRET || '',
                });
                const payId = razorpayPaymentId || order.razorpayPaymentId;
                if (payId) {
                  await razorpayClient.payments.refund(payId, { amount: Math.round(order.total * 100) });
                  await Order.updateOne({ _id: order._id }, { $set: { status: 'Cancelled', paymentStatus: 'Refunded' } });
                }
              } catch (refundError) {
                console.error('Webhook: Failed to issue automatic refund for out of stock order:', refundError);
              }
              // Do not proceed to shiprocket, but return 200 so webhook doesn't retry
              return NextResponse.json({ status: 'ok' }, { status: 200 });
            }
          }

          // Send Telegram Notification
          await sendAdminTelegramNotification(order);

          // Push to Shiprocket with Atomic Lock
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
              console.error(`Shiprocket Integration Error for Prepaid ${order.orderNumber}:`, srError);
            }
          }

          // Send confirmation email via Webhook (Fail-safe)
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
              console.error('Webhook: Failed to send payment confirmation email:', emailError);
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
