import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { hashPassword } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json().catch(() => ({}));
    const email = (body.email || 'admin@terra.com').toLowerCase().trim();
    const password = body.password || 'TerraAdmin2026!';
    const name = body.name || 'Terra Administrator';

    let user = await User.findOne({ email });

    const hashedPassword = await hashPassword(password);

    if (user) {
      user.role = 'admin';
      user.password = hashedPassword;
      user.name = name;
      await user.save();

      return NextResponse.json({
        message: 'Admin account updated successfully',
        admin: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
      tier: 'Terra Founder & Executive',
    });

    return NextResponse.json(
      {
        message: 'Admin account created successfully',
        admin: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Seed admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed admin account.' },
      { status: 500 }
    );
  }
}
