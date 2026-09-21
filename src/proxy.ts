import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

// H-4: Simple in-memory rate limiter (per-IP, resets every window)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

// Clean up stale entries periodically (every 5 minutes)
if (typeof globalThis !== 'undefined') {
  const CLEANUP_INTERVAL = 5 * 60 * 1000;
  const cleanupKey = '__rateLimitCleanupRegistered__';
  if (!(globalThis as any)[cleanupKey]) {
    (globalThis as any)[cleanupKey] = true;
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetAt) {
          rateLimitMap.delete(key);
        }
      }
    }, CLEANUP_INTERVAL);
  }
}

// Rate-limited routes with their limits
const rateLimitedRoutes: { pattern: string; limit: number; windowMs: number }[] = [
  { pattern: '/api/orders', limit: 10, windowMs: 60_000 },
  { pattern: '/api/coupons/validate', limit: 5, windowMs: 60_000 },
  { pattern: '/api/auth/register', limit: 5, windowMs: 60_000 },
  { pattern: '/api/auth/forgot-password', limit: 3, windowMs: 3_600_000 },
  { pattern: '/api/auth/reset-password', limit: 5, windowMs: 3_600_000 },
];

/**
 * Next.js Edge Proxy (Middleware).
 * Executes on the edge before a request is completed.
 * 
 * Responsibilities:
 * 1. Rate-limiting for sensitive API endpoints (e.g. login, checkout) to prevent brute-force and DoS.
 * 2. High-level route guarding for `/admin` paths (redirects to home if not admin).
 * 3. Checking authenticated sessions for generic `/api/` mutations.
 * 
 * Note: This provides Defense in Depth. Individual API routes must still enforce their own strict authorization.
 * 
 * @param {NextRequest} req - The incoming HTTP request.
 * @returns {NextResponse | undefined} A redirect/error response, or undefined to allow the request to proceed.
 */
export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  // H-4: Rate limiting on sensitive API routes
  for (const route of rateLimitedRoutes) {
    if (pathname.startsWith(route.pattern)) {
      const key = `${ip}:${route.pattern}`;
      if (!rateLimit(key, route.limit, route.windowMs)) {
        return NextResponse.json(
          { error: 'Too many requests. Please try again later.' },
          { status: 429 }
        );
      }
      break;
    }
  }

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

  // I-3: Centralized auth enforcement for mutating API routes
  if (pathname.startsWith('/api/')) {
    const publicApiPrefixes = ['/api/webhooks/', '/api/auth/', '/api/products', '/api/reviews'];
    const isPublic = publicApiPrefixes.some((prefix) => pathname.startsWith(prefix));

    if (!isPublic && !userPayload && req.method !== 'GET') {
      return NextResponse.json(
        { error: 'Authentication required.' },
        { status: 401 }
      );
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

  // 3. Guard Checkout Page
  if (pathname === '/checkout') {
    if (!userPayload) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirect', '/checkout');
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. If already logged in and visiting /login, steer to appropriate portal
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
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

