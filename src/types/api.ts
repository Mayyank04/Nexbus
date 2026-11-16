/**
 * @file api.ts
 * @module types/api
 * @description Standardized API request and response interfaces for NEXBUS.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string | ApiErrorDetail;
  metadata?: ApiMetadata;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown> | unknown[];
  timestamp: string;
}

export interface ApiMetadata {
  source?: string;
  lastUpdated?: string;
  coverageArea?: string;
  coordinateSystem?: string;
  epistemicTier?: 'TIER_01' | 'TIER_02' | 'TIER_03' | 'TIER_04';
  version?: string;
  processTimeMs?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
