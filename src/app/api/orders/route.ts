import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { Product } from '@/models/Product';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Please sign in to view orders.' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query: any = {};

    // If admin, can see all orders or filter by status
    if (user.role === 'admin') {
      if (status && status !== 'All') {
        query.status = status;
      }
    } else {
      // Standard user can only see their own orders
      query.$or = [{ userId: user.userId }, { customerEmail: user.email.toLowerCase() }];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();

    // Ensure order items are populated with live DB Cloudinary product images
    const allDbProducts = await Product.find({}).lean();
    if (allDbProducts.length > 0) {
      for (const order of orders) {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const matchedProduct = allDbProducts.find(
              (p: any) =>
                p._id.toString() === item.productId ||
                p.slug === item.productId ||
                (item.name && p.name && p.name.toLowerCase().trim() === item.name.toLowerCase().trim()) ||
                (item.name && p.slug && item.name.toLowerCase().includes(p.slug.replace('terra-', ''))) ||
                (item.name?.toLowerCase().includes('face') && p.category === 'Face') ||
                (item.name?.toLowerCase().includes('beard') && p.category === 'Beard')
            );
            if (matchedProduct) {
              const liveDbImg =
                matchedProduct.featuredImage ||
                (matchedProduct.images && matchedProduct.images.length > 0 ? matchedProduct.images[0]?.url : '') ||
                matchedProduct.secondaryImage ||
                '';
              if (liveDbImg && liveDbImg.trim() !== '') {
                item.image = liveDbImg;
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ orders, count: orders.length });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerEmail,
      customerName,
      customerPhone,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      shippingAddress,
    } = body;

    if (!customerEmail || !customerName || !items || !items.length || !shippingAddress) {
      return NextResponse.json(
        { error: 'Missing required order fields.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user is logged in
    const authUser = await getAuthUser();

    // Generate unique order number
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `TR-IN-${randomDigits}`;

    const newOrder = await Order.create({
      orderNumber,
      userId: authUser?.userId ? authUser.userId : undefined,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: customerName.trim(),
      customerPhone: customerPhone?.trim(),
      items: items.map((item: any) => ({
        productId: item.productId || item.id || item.product?.id || 'unknown',
        name: item.name || item.product?.name || 'Terra Product',
        price: item.price || item.product?.price || 0,
        quantity: item.quantity || 1,
        image:
          item.image ||
          item.product?.featuredImage ||
          '',
      })),
      subtotal: Number(subtotal),
      shipping: Number(shipping || 0),
      tax: Number(tax || 0),
      total: Number(total),
      status: 'Processing',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      paymentMethod: paymentMethod || 'upi',
      shippingAddress: {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        address1: shippingAddress.address1,
        address2: shippingAddress.address2 || '',
        city: shippingAddress.city,
        state: shippingAddress.state || 'Maharashtra',
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'India',
      },
    });

    return NextResponse.json(
      {
        message: 'Order created successfully',
        order: newOrder,
        orderNumber: newOrder.orderNumber,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to place order.' },
      { status: 500 }
    );
  }
}
