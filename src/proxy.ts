import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const COOKIE_NAME = 'terra_token';
const JWT_SECRET_STRING =
  process.env.JWT_SECRET || 'terra-botanical-luxury-secret-key-2026-secure-token';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get(COOKIE_NAME)?.value;

  // Verify JWT on protected routes
  let userPayload: { role?: string; userId?: string; email?: string } | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      userPayload = payload as { role?: string; userId?: string; email?: string };
    } catch {
      userPayload = null;
    }
  }

  // 1. Guard Admin Portal: Strictly Admin-Only
  if (pathname.startsWith('/admin')) {
    if (!userPayload || userPayload.role !== 'admin') {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('error', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Guard Client Account Portal
  if (pathname.startsWith('/account')) {
    if (!userPayload) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', '/account');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. If already logged in and visiting /login, steer to appropriate portal
  if (pathname === '/login') {
    if (userPayload) {
      const redirectParam = req.nextUrl.searchParams.get('redirect');
      const defaultTarget = userPayload.role === 'admin' ? '/admin' : '/account';
      const target = redirectParam || defaultTarget;
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*', '/login'],
};
