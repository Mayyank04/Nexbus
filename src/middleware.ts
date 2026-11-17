/**
 * @file middleware.ts
 * @description Next.js edge middleware providing application-layer rate limiting and security enforcement.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// In-memory sliding window rate limiter
// For multi-instance horizontal scaling, replace with Redis / Upstash
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 120; // 120 req/min per IP

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply rate limiting to API routes
  if (pathname.startsWith('/api/')) {
    // Determine client IP
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Phase 20 Hardened Rate Limiting & Bypass Verification
    // In production, arbitrary headers like 'x-nexbus-internal-test' MUST NEVER bypass rate limits.
    // A test bypass in production requires a verified, high-entropy secret matching NEXBUS_INTERNAL_TEST_SECRET.
    const isProduction = process.env.NODE_ENV === 'production';
    const internalSecret = process.env.NEXBUS_INTERNAL_TEST_SECRET;
    const providedSecret = request.headers.get('x-nexbus-internal-secret');

    let isAuthorizedTestBypass = false;
    if (isProduction) {
      if (internalSecret && internalSecret.length >= 32 && providedSecret === internalSecret) {
        isAuthorizedTestBypass = true;
      }
    } else {
      // In development or test mode, permit localhost or explicitly flagged test suites
      const isLoopback = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost';
      if (process.env.NODE_ENV === 'test' || (isLoopback && request.headers.get('x-nexbus-internal-test') === 'true')) {
        isAuthorizedTestBypass = true;
      }
    }

    if (isAuthorizedTestBypass) {
      const response = NextResponse.next();
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
      response.headers.set('X-Nexbus-Bypass', 'authorized-test');
      return response;
    }

    const now = Date.now();
    const clientState = requestCounts.get(clientIp);

    if (!clientState || now > clientState.resetTime) {
      requestCounts.set(clientIp, {
        count: 1,
        resetTime: now + RATE_LIMIT_WINDOW_MS,
      });
    } else {
      clientState.count += 1;
      if (clientState.count > MAX_REQUESTS_PER_WINDOW) {
        return new NextResponse(
          JSON.stringify({
            success: false,
            error: {
              code: 'RATE_LIMIT_EXCEEDED',
              message: 'Too many requests. Civic rate limit threshold reached (120 req/min).',
              timestamp: new Date().toISOString(),
            },
          }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': '60',
              'X-RateLimit-Limit': String(MAX_REQUESTS_PER_WINDOW),
              'X-RateLimit-Remaining': '0',
            },
          }
        );
      }
    }
  }

  // Set default security headers on all responses
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
