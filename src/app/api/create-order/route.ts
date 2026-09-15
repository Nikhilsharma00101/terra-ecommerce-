import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = 'INR', receipt = 'receipt_' + Date.now() } = body;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Invalid amount. Minimum amount is 100 paise.' },
        { status: 400 }
      );
    }

    const options = {
      amount,
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return NextResponse.json(
        { error: 'Failed to create order on Razorpay' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Create Razorpay order error:', error);
    
    // Attempt to handle auth failures specifically if raised by the Razorpay SDK
    if (error.statusCode === 401) {
      return NextResponse.json(
        { error: 'Razorpay authentication failed.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error while creating Razorpay order' },
      { status: 500 }
    );
  }
}
