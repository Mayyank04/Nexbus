/**
 * @file errorHandler.ts
 * @module lib/api/errorHandler
 * @description Safe API error parsing, logging, and normalization.
 */

import { NextResponse } from 'next/server';
import { apiError } from './response';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: Record<string, unknown> | unknown[];

  constructor(
    message: string,
    statusCode = 500,
    code = 'INTERNAL_ERROR',
    details?: Record<string, unknown> | unknown[]
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

/**
 * Handles errors caught in Next.js API routes with structured output.
 */
export function handleApiError(err: unknown): NextResponse {
  if (err instanceof AppError) {
    return apiError(err.message, err.statusCode, err.code, err.details);
  }

  if (err instanceof Error) {
    if (err.name === 'SyntaxError') {
      return apiError('Malformed JSON payload', 400, 'INVALID_JSON');
    }

    console.error('[API_ERROR]', err.message, err.stack);
    return apiError(err.message || 'An unexpected error occurred', 500, 'INTERNAL_SERVER_ERROR');
  }

  console.error('[UNKNOWN_ERROR]', err);
  return apiError('Internal server error', 500, 'UNKNOWN_ERROR');
}
