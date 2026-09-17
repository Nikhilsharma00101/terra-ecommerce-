import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, email } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ success: false, error: 'Coupon code is required.' }, { status: 400 });
    }

    const c = code.trim().toUpperCase();
    const validCoupons = ['WELCOME10'];

    if (!validCoupons.includes(c)) {
      return NextResponse.json({ success: false, error: 'Invalid coupon code. Try WELCOME10.' }, { status: 400 });
    }

    if (c === 'WELCOME10' && email) {
      await connectToDatabase();
      const existingOrdersCount = await Order.countDocuments({
        customerEmail: email.toLowerCase().trim()
      });

      if (existingOrdersCount > 0) {
        return NextResponse.json({
          success: false,
          error: 'This coupon is only valid for your first order.'
        }, { status: 400 });
      }
    }

    return NextResponse.json({ success: true, code: c });
  } catch (error: any) {
    console.error('Coupon validation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to validate coupon.' }, { status: 500 });
  }
}
