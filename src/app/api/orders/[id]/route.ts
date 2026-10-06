import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { requireAdmin, getAuthUser } from '@/lib/auth';
import nodemailer from 'nodemailer';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { orderNumber: id };

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Standard user can only see their own order
    if (
      user.role !== 'admin' &&
      order.userId?.toString() !== user.userId &&
      order.customerEmail.toLowerCase() !== user.email.toLowerCase()
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    const { id } = await context.params;
    const body = await req.json();
    const { status, trackingNumber, paymentStatus } = body;

    await connectToDatabase();

    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    const query = isMongoId ? { _id: id } : { orderNumber: id };

    const order = await Order.findOne(query);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const validTransitions: Record<string, string[]> = {
      'Confirmation': ['Packed', 'Cancelled'],
      'Packed': ['Dispatched', 'Cancelled'],
      'Dispatched': ['Out for delivery'], // Cannot be cancelled once shipped
      'Out for delivery': ['Delivered'], // Cannot be cancelled once shipped
      'Delivered': [], // Can't cancel once delivered
      'Cancelled': [],
    };

    if (status && order.status !== status) {
      const allowedNextStates = validTransitions[order.status] || [];
      if (!allowedNextStates.includes(status)) {
        if (status === 'Cancelled' && (order.status === 'Dispatched' || order.status === 'Out for delivery')) {
          return NextResponse.json(
            { error: 'Orders that have already been shipped cannot be cancelled. Please process this as an RTO/Return.' },
            { status: 400 }
          );
        }
        return NextResponse.json(
          { error: `Invalid status transition from ${order.status} to ${status}` },
          { status: 400 }
        );
      }
    }

    const updateFields: any = {};
    if (status) updateFields.status = status;
    if (trackingNumber !== undefined) updateFields.trackingNumber = trackingNumber;
    if (paymentStatus) updateFields.paymentStatus = paymentStatus;

    const queryWithLock = { ...query, status: order.status };
    const updated = await Order.findOneAndUpdate(queryWithLock, updateFields, {
      returnDocument: 'after',
      runValidators: true,
    });

    if (!updated) {
      // If it fails with the lock, it means the order state changed concurrently
      const currentOrder = await Order.findOne(query);
      if (!currentOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json({ error: 'Order status was modified by another request. Please refresh and try again.' }, { status: 409 });
    }

    // F-INV-1: Restore stock on order cancellation
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      if (updated.items && updated.items.length > 0) {
        const bulkOperations = updated.items.map((item: any) => ({
          updateOne: {
            filter: {
              $or: [
                { _id: item.productId.length === 24 ? item.productId : null },
                { slug: item.productId }
              ]
            },
            update: { $inc: { stock: item.quantity } },
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

      // E-1: Cancel Shiprocket order if it exists
      if (order.shiprocketOrderId) {
        try {
          const { shiprocket } = await import('@/lib/shiprocket');
          await shiprocket.cancelOrder([order.shiprocketOrderId]);
        } catch (srError) {
          console.error('Failed to cancel Shiprocket order:', srError);
        }
      }

      // F-PAY-4: Process Razorpay Refund
      if (order.paymentStatus === 'Paid' && order.razorpayPaymentId) {
        try {
          const Razorpay = (await import('razorpay')).default;
          const razorpay = new Razorpay({
            key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
            key_secret: process.env.RAZORPAY_KEY_SECRET || '',
          });
          await razorpay.payments.refund(order.razorpayPaymentId, { amount: Math.round(order.total * 100) });
          updated.paymentStatus = 'Refunded';
          await Order.updateOne({ _id: order._id }, { $set: { paymentStatus: 'Refunded' } });
        } catch (refundError) {
          console.error('Failed to process Razorpay refund on cancellation:', refundError);
        }
      }
    }

    // --- SEND STATUS UPDATE EMAIL ---
    if (status) {
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

        const statusMessages: Record<string, string> = {
          'Confirmation': 'Your order has been confirmed and is being processed.',
          'Packed': 'Your order has been packed and is ready to be shipped.',
          'Dispatched': 'Your order has been dispatched and is on its way to you.',
          'Out for delivery': 'Your order is out for delivery today!',
          'Delivered': 'Your order has been delivered. Thank you for shopping with us!',
          'Cancelled': 'Your order has been cancelled.',
          'Refund_Pending': 'Your refund request is being processed.',
          'Refunded': 'Your order has been refunded.',
        };

        const message = statusMessages[status] || `Your order status has been updated to: ${status}`;
        
        const escapeHtml = (str: string) => str.replace(/[&<>'"]/g, 
          tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
          }[tag as string] || tag)
        );

        let trackingHtml = '';
        const tracking = trackingNumber || updated.trackingNumber;
        if (tracking) {
          trackingHtml = `<p style="color: #181817;"><strong>Tracking Number:</strong> ${escapeHtml(tracking)}</p>`;
        }

        const safeFirstName = escapeHtml(updated.shippingAddress?.firstName || 'Customer');

        const mailOptions = {
          from: '"Terra Men\'s Co." <' + (process.env.EMAIL_FROM || 'info@terramensco.com') + '>',
          to: updated.customerEmail,
          subject: `Terra Men's Co - Order Status Update (${updated.orderNumber})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #DDD8CF; background-color: #FBF9F5;">
              <div style="text-align: center; margin-bottom: 20px;"><img src="https://www.terramensco.com/images/logo/logo-dark.png" alt="Terra Men's Co." style="max-height: 40px; width: auto;" /></div><h2 style="color: #181817; text-align: center;">Order Status Update</h2>
              <p style="color: #181817;">Hi ${safeFirstName},</p>
              <p style="color: #181817;">${message}</p>
              ${trackingHtml}
              <div style="text-align: center; margin: 30px 0;">
                <p style="color: #181817; font-size: 14px; font-weight: bold;">Order Number: ${updated.orderNumber}</p>
              </div>
              <hr style="border: none; border-top: 1px solid #DDD8CF; margin: 30px 0;" />
              <p style="color: #8C887B; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Terra Men's Co.</p>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
      }
    }

    return NextResponse.json({
      message: 'Order updated successfully',
      order: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
