import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface UserJwtPayload {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  tier?: string;
}

const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'terra-botanical-luxury-secret-key-2026-secure-token';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);
export const COOKIE_NAME = 'terra_token';
export const TOKEN_EXPIRATION = '7d'; // 7 days
export const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

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
 * Generates an encrypted JWT signed with HMAC-SHA256
 */
export async function signToken(payload: UserJwtPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT token and returns the decoded payload
 */
export async function verifyJwtToken(token: string): Promise<UserJwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as UserJwtPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the authenticated user from cookies in Next.js Server Components or Route Handlers
 */
export async function getAuthUser(): Promise<UserJwtPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJwtToken(token);
  } catch {
    return null;
  }
}

/**
 * Attaches the auth cookie to a NextResponse
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Clears the auth cookie from a NextResponse
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set({
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
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
