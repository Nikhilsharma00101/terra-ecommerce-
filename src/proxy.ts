import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET;

// Fallback in-memory rate limiter for local development
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function fallbackRateLimit(ip: string, limit: number, windowStr: string): boolean {
  const windowMs = parseInt(windowStr.split(' ')[0]) * 1000;
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Clean up stale entries periodically
if (typeof globalThis !== 'undefined') {
  const cleanupKey = '__rateLimitCleanupRegistered__';
  if (!(globalThis as any)[cleanupKey]) {
    (globalThis as any)[cleanupKey] = true;
    setInterval(() => {
      const now = Date.now();
      for (const [key, value] of rateLimitMap.entries()) {
        if (now > value.resetAt) rateLimitMap.delete(key);
      }
    }, 5 * 60 * 1000);
  }
}

// Initialize Upstash Redis if available
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  ? Redis.fromEnv()
  : null;

const limiters = new Map<string, Ratelimit>();
function getUpstashLimiter(limit: number, windowStr: string) {
  const key = `${limit}-${windowStr}`;
  if (!limiters.has(key)) {
    limiters.set(key, new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(limit, windowStr as any),
      analytics: false,
    }));
  }
  return limiters.get(key)!;
}

const rateLimitedRoutes: { pattern: string; limit: number; window: string }[] = [
  { pattern: '/api/orders', limit: 10, window: '60 s' },
  { pattern: '/api/coupons/validate', limit: 5, window: '60 s' },
  { pattern: '/api/auth/register', limit: 5, window: '60 s' },
  { pattern: '/api/auth/callback/credentials', limit: 5, window: '60 s' },
  { pattern: '/api/auth/forgot-password', limit: 3, window: '3600 s' },
  { pattern: '/api/auth/reset-password', limit: 5, window: '3600 s' },
];

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown';

  for (const route of rateLimitedRoutes) {
    if (pathname.startsWith(route.pattern)) {
      const key = `${ip}:${route.pattern}`;
      let allowed = true;
      if (redis) {
        const limiter = getUpstashLimiter(route.limit, route.window);
        const { success } = await limiter.limit(key);
        allowed = success;
      } else {
        allowed = fallbackRateLimit(key, route.limit, route.window);
      }
      
      if (!allowed) {
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
      const isRelative = redirectParam?.startsWith('/') && !redirectParam.startsWith('//');
      const target = (isRelative ? redirectParam : null) || defaultTarget;
      return NextResponse.redirect(new URL(target, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

