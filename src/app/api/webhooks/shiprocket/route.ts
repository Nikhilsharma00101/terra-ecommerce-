import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

/**
 * Handles incoming webhooks from Shiprocket.
 * Expected to receive updates about shipment tracking and status.
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Verify Authentication Header (x-api-key)
    const authToken = req.headers.get('x-api-key') || req.headers.get('authorization');
    const expectedToken = process.env.SHIPROCKET_WEBHOOK_SECRET;

    if (!expectedToken) {
      console.error('SHIPROCKET_WEBHOOK_SECRET is not configured.');
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }

    // Timing-safe comparison to prevent timing attacks
    const normalizedAuth = authToken?.replace('Bearer ', '') || '';
    if (
      normalizedAuth.length !== expectedToken.length ||
      !crypto.timingSafeEqual(Buffer.from(normalizedAuth), Buffer.from(expectedToken))
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Parse Payload
    const payload = await req.json();
    const { order_id, current_status, current_status_id, awb } = payload;

    if (!order_id) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    await connectToDatabase();

    // 3. Map Shiprocket Status to Internal Status
    let mappedStatus = null;
    const statusUpper = current_status?.toUpperCase() || '';

    // Status mapping based on standard Shiprocket codes
    if (['PACKED', 'MANIFESTED', 'READY TO SHIP', 'INVOICED', 'PICKUP SCHEDULED'].includes(statusUpper)) {
      mappedStatus = 'Packed';
    } else if (['SHIPPED', 'IN TRANSIT', 'OUT OF DELIVERY AREA'].includes(statusUpper)) {
      mappedStatus = 'Dispatched';
    } else if (['OUT FOR DELIVERY'].includes(statusUpper)) {
      mappedStatus = 'Out for delivery';
    } else if (['DELIVERED'].includes(statusUpper)) {
      mappedStatus = 'Delivered';
    } else if (['CANCELED', 'CANCELLED', 'RTO INITIATED', 'RTO DELIVERED'].includes(statusUpper)) {
      mappedStatus = 'Cancelled'; // Or a custom 'Returned' status if supported
    }

    const updateData: any = {};
    if (mappedStatus) {
      updateData.status = mappedStatus;
    }
    
    // Save Granular Shiprocket details
    if (statusUpper) updateData.shipmentStatus = statusUpper;
    if (awb) updateData.awbCode = awb;
    if (payload.courier_name) updateData.courierName = payload.courier_name;

    if (Object.keys(updateData).length > 0) {
      const existingOrder = await Order.findOne({ orderNumber: order_id });
      
      if (!existingOrder) {
        console.warn(`Shiprocket Webhook: Order ${order_id} not found in database.`);
        return NextResponse.json({ status: 'ok' }, { status: 200 });
      }

      const wasNotCancelled = existingOrder.status !== 'Cancelled';
      
      const updatedOrder = await Order.findOneAndUpdate(
        { orderNumber: order_id },
        { $set: updateData },
        { new: true }
      );

      console.log(`Shiprocket Webhook: Updated order ${order_id} to status ${mappedStatus || statusUpper}`);

      // Edge case: Restock inventory if cancelled via webhook (RTO)
      if (mappedStatus === 'Cancelled' && wasNotCancelled) {
        if (updatedOrder && updatedOrder.items && updatedOrder.items.length > 0) {
          const { Product } = await import('@/models/Product');
          const bulkOperations = updatedOrder.items.map((item: any) => ({
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
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Shiprocket Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
