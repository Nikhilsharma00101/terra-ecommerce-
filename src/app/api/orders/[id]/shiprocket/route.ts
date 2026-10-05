import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { getAuthUser } from '@/lib/auth';
import { shiprocket } from '@/lib/shiprocket';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authUser = await getAuthUser();
    if (!authUser || authUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    await connectToDatabase();
    const { id } = await params;
    const orderId = id;
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const { action } = await req.json();

    if (action === 'push') {
      if (order.shiprocketOrderId) {
        return NextResponse.json({ error: 'Order already pushed to Shiprocket' }, { status: 400 });
      }

      const paymentMethod = order.paymentMethod === 'cod' ? 'COD' : 'Prepaid';
      const srResponse = await shiprocket.createOrder(order, paymentMethod);
      
      if (srResponse && srResponse.order_id) {
        order.shiprocketOrderId = srResponse.order_id;
        order.shiprocketShipmentId = srResponse.shipment_id;
        order.shipmentStatus = srResponse.status;
        await order.save();
        return NextResponse.json({ success: true, message: 'Order pushed successfully', data: srResponse });
      } else {
        throw new Error('Failed to create order in Shiprocket');
      }
    } 
    
    if (action === 'assign_awb') {
      if (!order.shiprocketShipmentId) {
        return NextResponse.json({ error: 'No shipment ID found. Push order first.' }, { status: 400 });
      }

      const srResponse = await shiprocket.assignCourier(order.shiprocketShipmentId);
      if (srResponse && srResponse.response?.data?.awb_code) {
        order.awbCode = srResponse.response.data.awb_code;
        order.courierName = srResponse.response.data.courier_name;
        order.courierId = srResponse.response.data.courier_company_id;
        await order.save();
        return NextResponse.json({ success: true, message: 'AWB assigned successfully', data: srResponse.response.data });
      } else {
        throw new Error('Failed to assign AWB');
      }
    }

    if (action === 'generate_label') {
      if (!order.shiprocketShipmentId) {
        return NextResponse.json({ error: 'No shipment ID found.' }, { status: 400 });
      }
      const srResponse = await shiprocket.generateLabel([order.shiprocketShipmentId]);
      if (srResponse && srResponse.label_created) {
        order.labelUrl = srResponse.label_url;
        await order.save();
        return NextResponse.json({ success: true, message: 'Label generated successfully', url: srResponse.label_url });
      } else {
        throw new Error('Failed to generate label');
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('Shiprocket Admin API Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
