/**
 * @file env.ts
 * @module config/env
 * @description Centralized, type-safe environment configuration for NEXBUS.
 * Provides runtime validation with non-breaking defaults for local and production deployment.
 */

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  isProduction: boolean;
  isDevelopment: boolean;
  isTest: boolean;
  appUrl: string;
  apiBaseUrl: string;
  safetyMode: 'READ_ONLY_PASSIVE';
  privacy: {
    kAnonymityThreshold: number;
    coordinatePrecisionDecimals: number;
  };
  telemetry: {
    rateLimitPerMin: number;
    pollIntervalMs: number;
    historicalCacheTtlSec: number;
  };
  geoDefaults: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

/**
 * Validates and parses environment variables with reliable fallbacks.
 */
function createConfig(): AppConfig {
  const nodeEnv = (process.env.NODE_ENV || 'development') as 'development' | 'production' | 'test';

  return {
    env: nodeEnv,
    isProduction: nodeEnv === 'production',
    isDevelopment: nodeEnv === 'development',
    isTest: nodeEnv === 'test',
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    safetyMode: 'READ_ONLY_PASSIVE',
    privacy: {
      kAnonymityThreshold: Number(process.env.NEXBUS_K_ANONYMITY_THRESHOLD) || 15,
      coordinatePrecisionDecimals: Number(process.env.NEXBUS_COORDINATE_PRECISION_DECIMALS) || 4,
    },
    telemetry: {
      rateLimitPerMin: Number(process.env.NEXBUS_RATE_LIMIT_PER_MIN) || 120,
      pollIntervalMs: Number(process.env.NEXBUS_TELEMETRY_POLL_INTERVAL_MS) || 15000,
      historicalCacheTtlSec: Number(process.env.NEXBUS_HISTORICAL_CACHE_TTL_SEC) || 3600,
    },
    geoDefaults: {
      latitude: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT) || 28.6139,
      longitude: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LON) || 77.2090,
      zoom: Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM) || 11,
    },
  };
}

export const config: AppConfig = createConfig();
export default config;
