import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-options';
import { User as NextAuthUser } from 'next-auth';

// Define the payload type correctly
export interface UserJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  tier?: string;
}

/**
 * Securely hashes a plain text password using bcrypt with salt rounds = 12
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

/**
 * Compares a plain text password against a stored bcrypt hash
 */
export async function verifyPassword(
  plainText: string,
  hashed: string
): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

/**
 * Extracts and verifies the authenticated user from cookies in Next.js Server Components or Route Handlers using NextAuth
 */
export async function getAuthUser(): Promise<UserJwtPayload | null> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return null;
    
    // Map NextAuth user to our legacy UserJwtPayload format for compatibility
    return {
      userId: (session.user as NextAuthUser).id,
      email: session.user.email || '',
      name: session.user.name || '',
      role: (session.user as NextAuthUser).role,
      tier: (session.user as NextAuthUser).tier,
    };
  } catch {
    return null;
  }
}

/**
 * Route protection helper: Ensures request has a valid logged in user
 */
export async function requireAuth(): Promise<
  { user: UserJwtPayload; errorResponse?: never } | { user?: never; errorResponse: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Authentication required. Please sign in to continue.' },
        { status: 401 }
      ),
    };
  }
  return { user };
}

/**
 * Route protection helper: Ensures request is from an authorized Administrator
 */
export async function requireAdmin(): Promise<
  { user: UserJwtPayload; errorResponse?: never } | { user?: never; errorResponse: NextResponse }
> {
  const user = await getAuthUser();
  if (!user) {
    return {
      errorResponse: NextResponse.json(
        { error: 'Authentication required. Please sign in as an admin.' },
        { status: 401 }
      ),
    };
  }
  if (user.role !== 'admin') {
    return {
      errorResponse: NextResponse.json(
        { error: 'Forbidden. Admin privileges required.' },
        { status: 403 }
      ),
    };
  }
  return { user };
}
