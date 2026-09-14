import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';

// GET User Profile & Data
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    const user = await User.findById(authUser.userId).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
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
    });
  } catch (error: any) {
    console.error('Fetch profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT Update Profile Details (Name, Phone)
export async function PUT(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone } = await req.json();
    await connectToDatabase();

    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
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
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST Actions (Addresses, Subscription, Wishlist)
export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action } = body;

    await connectToDatabase();
    const user = await User.findById(authUser.userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. ADD ADDRESS
    if (action === 'add_address') {
      const { title, street, city, state, postalCode, country, phone, isDefault } = body.address;
      const newAddr = {
        id: `addr-${Date.now()}`,
        title: title || 'Home',
        fullName: user.name,
        street,
        city,
        state: state || 'Maharashtra',
        postalCode,
        country: country || 'India',
        phone: phone || user.phone || '',
        isDefault: !!isDefault || user.addresses.length === 0,
      };

      if (newAddr.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
      }

      user.addresses.push(newAddr as any);
      await user.save();

      return NextResponse.json({
        message: 'Address added successfully',
        addresses: user.addresses,
      });
    }

    // 2. SET DEFAULT ADDRESS
    if (action === 'set_default_address') {
      const { addressId } = body;
      user.addresses.forEach((a: any) => {
        a.isDefault = a.id === addressId;
      });
      await user.save();

      return NextResponse.json({
        message: 'Default address updated',
        addresses: user.addresses,
      });
    }

    // 3. DELETE ADDRESS
    if (action === 'delete_address') {
      const { addressId } = body;
      user.addresses = user.addresses.filter((a: any) => a.id !== addressId) as any;
      await user.save();

      return NextResponse.json({
        message: 'Address deleted',
        addresses: user.addresses,
      });
    }

    // 4. UPDATE SUBSCRIPTION ROUTINE
    if (action === 'update_subscription') {
      const { frequency, status } = body.subscription;
      user.subscription = {
        status: status || user.subscription?.status || 'active',
        frequency: frequency || user.subscription?.frequency || '60d',
        nextDispatchDate: new Date(Date.now() + (frequency === '30d' ? 30 : frequency === '90d' ? 90 : 60) * 24 * 60 * 60 * 1000),
        productSlug: 'terra-set',
      };
      await user.save();

      return NextResponse.json({
        message: 'Subscription updated',
        subscription: user.subscription,
      });
    }

    // 5. TOGGLE WISHLIST
    if (action === 'toggle_wishlist') {
      const { productId } = body;
      const index = user.wishlist.indexOf(productId);
      if (index > -1) {
        user.wishlist.splice(index, 1);
      } else {
        user.wishlist.push(productId);
      }
      await user.save();

      return NextResponse.json({
        message: 'Wishlist updated',
        wishlist: user.wishlist,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('User action error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
