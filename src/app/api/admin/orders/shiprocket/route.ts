import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { requireAdmin } from '@/lib/auth';
import { shiprocket } from '@/lib/shiprocket';

export async function POST(req: NextRequest) {
  let orderId: string | undefined;
  try {
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    const body = await req.json();
    orderId = body.orderId;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const order = await Order.findOneAndUpdate(
      { _id: orderId, shiprocketPushInitiated: { $ne: true }, shiprocketOrderId: { $exists: false } },
      { $set: { shiprocketPushInitiated: true } },
      { returnDocument: 'after' }
    );

    if (!order) {
      // Check why it failed
      const existingOrder = await Order.findById(orderId);
      if (!existingOrder) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      if (existingOrder.shiprocketOrderId) return NextResponse.json({ error: 'Order already pushed to Shiprocket' }, { status: 400 });
      if (existingOrder.shiprocketPushInitiated) return NextResponse.json({ error: 'Push to Shiprocket already in progress' }, { status: 400 });
      return NextResponse.json({ error: 'Failed to lock order' }, { status: 500 });
    }

    if (order.paymentMethod !== 'cod' && order.paymentStatus !== 'Paid') {
      return NextResponse.json({ error: 'Cannot push unpaid order to Shiprocket' }, { status: 400 });
    }

    // Determine payment method for Shiprocket
    const srPaymentMethod = order.paymentMethod === 'cod' ? 'COD' : 'Prepaid';

    // Push to Shiprocket
    const srResponse = await shiprocket.createOrder(order, srPaymentMethod);

    if (srResponse && srResponse.order_id) {
      const updatedOrder = await Order.findOneAndUpdate(
        { _id: order._id },
        {
          $set: {
            shiprocketOrderId: srResponse.order_id,
            shiprocketShipmentId: srResponse.shipment_id,
            shipmentStatus: srResponse.status,
            shiprocketPushInitiated: true
          }
        },
        { returnDocument: 'after' }
      );

      return NextResponse.json({ message: 'Successfully pushed to Shiprocket', order: updatedOrder });
    } else {
      await Order.updateOne({ _id: order._id }, { $set: { shiprocketPushInitiated: false } });
      return NextResponse.json({ error: 'Shiprocket API did not return an order ID' }, { status: 500 });
    }

  } catch (error: any) {
    if (error.message?.includes('Failed to lock order')) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    // Attempt to revert lock if possible
    if (orderId) {
      await Order.updateOne({ _id: orderId, shiprocketPushInitiated: true, shiprocketOrderId: { $exists: false } }, { $set: { shiprocketPushInitiated: false } });
    }
    console.error('Shiprocket Manual Push Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to push to Shiprocket' }, { status: 500 });
  }
}
