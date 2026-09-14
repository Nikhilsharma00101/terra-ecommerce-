import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET() {
  try {
    const authPayload = await getAuthUser();
    if (!authPayload) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    await connectToDatabase();
    const user = await User.findById(authPayload.userId).select('-password');

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          tier: user.tier,
          phone: user.phone,
          addresses: user.addresses || [],
          wishlist: user.wishlist || [],
          subscription: user.subscription || { status: 'active', frequency: '60d' },
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Session me error:', error);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
