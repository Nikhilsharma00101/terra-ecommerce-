import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Verify NextAuth JWT on protected routes
  const token = await getToken({ req, secret: JWT_SECRET });
  let userPayload: { role?: string; userId?: string; email?: string } | null = null;
  
  if (token) {
    userPayload = {
      role: token.role as string,
      userId: token.id as string,
      email: token.email as string,
    };
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
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
