import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const authCheck = await requireAdmin();
    if (authCheck.errorResponse) {
      return authCheck.errorResponse;
    }

    try {
      await connectToDatabase();
      const users = await User.find({}).select('-password').sort({ createdAt: -1 });

      return NextResponse.json({ users, count: users.length });
    } catch {
      return NextResponse.json({ users: [], count: 0 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
