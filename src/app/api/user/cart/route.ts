import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { getAuthUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(authUser.userId).lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ cart: user.cart || [] });
  } catch (error: any) {
    console.error('Failed to fetch user cart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user cart' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cart } = await req.json();

    if (!Array.isArray(cart)) {
      return NextResponse.json({ error: 'Invalid cart format' }, { status: 400 });
    }

    // Validate cart items
    const validCart = cart.filter(
      (item) =>
        item &&
        typeof item.productId === 'string' &&
        typeof item.quantity === 'number' &&
        item.quantity > 0
    ).map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    await connectToDatabase();
    
    // Update user cart
    const user = await User.findByIdAndUpdate(
      authUser.userId,
      { $set: { cart: validCart } },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cart: user.cart });
  } catch (error: any) {
    console.error('Failed to update user cart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update user cart' },
      { status: 500 }
    );
  }
}
