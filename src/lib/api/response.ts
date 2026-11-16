/**
 * @file response.ts
 * @module lib/api/response
 * @description Standardized API response builder functions.
 */

import { NextResponse } from 'next/server';
import type { ApiResponse, ApiMetadata } from '@/types/api';

/**
 * Standard security and caching headers for NEXBUS APIs.
 */
export const DEFAULT_API_HEADERS: Record<string, string> = {
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'Cache-Control': 'no-store, no-cache, must-revalidate',
};

/**
 * Creates a standardized successful JSON response.
 */
export function apiSuccess<T>(
  data: T,
  metadata?: ApiMetadata,
  init?: ResponseInit
): NextResponse<ApiResponse<T>> {
  const body: ApiResponse<T> = {
    success: true,
    data,
    ...(metadata ? { metadata } : {}),
  };

  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      ...DEFAULT_API_HEADERS,
      ...(init?.headers || {}),
    },
  });
}

/**
 * Creates a standardized error JSON response.
 */
export function apiError(
  message: string,
  statusCode = 400,
  errorCode = 'API_ERROR',
  details?: Record<string, unknown> | unknown[]
): NextResponse<ApiResponse<never>> {
  const body: ApiResponse<never> = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details ? { details } : {}),
      timestamp: new Date().toISOString(),
    },
  };

  return NextResponse.json(body, {
    status: statusCode,
    headers: DEFAULT_API_HEADERS,
  });
}
