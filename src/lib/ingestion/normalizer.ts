import { TransportObservation, QualityStatus, ProvenanceStatus } from './types';

// Strict WGS84 Delhi Metropolitan Bounding Box
export const DELHI_BOUNDS = {
  MIN_LAT: 28.40,
  MAX_LAT: 28.88,
  MIN_LNG: 76.84,
  MAX_LNG: 77.40,
};

// Simple deterministic hash for string content (32-bit FNV-1a)
export function fnv1aHash(str: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function validateCoordinates(lat?: number, lng?: number): boolean {
  if (lat === undefined || lng === undefined) return false;
  if (isNaN(lat) || isNaN(lng)) return false;
  return (
    lat >= DELHI_BOUNDS.MIN_LAT &&
    lat <= DELHI_BOUNDS.MAX_LAT &&
    lng >= DELHI_BOUNDS.MIN_LNG &&
    lng <= DELHI_BOUNDS.MAX_LNG
  );
}

export function validateTimestamp(timestampStr: string, maxAgeSeconds: number = 3600): {
  isValid: boolean;
  isStale: boolean;
  isFuture: boolean;
  ageSeconds: number;
} {
  const ts = new Date(timestampStr).getTime();
  if (isNaN(ts)) {
    return { isValid: false, isStale: true, isFuture: false, ageSeconds: Infinity };
  }

  const now = Date.now();
  const ageSeconds = (now - ts) / 1000;

  const isFuture = ageSeconds < -30; // More than 30s in future
  const isStale = ageSeconds > maxAgeSeconds;

  return {
    isValid: !isFuture && !isStale,
    isStale,
    isFuture,
    ageSeconds: Math.round(ageSeconds),
  };
}

export function normalizeRawObservation(
  raw: {
    sourceId: string;
    rawId?: string;
    timestamp?: string;
    vehicleId?: string;
    routeId?: string;
    corridorId?: string;
    latitude?: number;
    longitude?: number;
    speedKmph?: number;
    bearingDeg?: number;
    occupancyEstimate?: number;
    dataType?: 'VEHICLE_POSITION' | 'PASSENGER_BOARDING' | 'HEADWAY_MEASUREMENT' | 'AIR_QUALITY_METRIC';
    provenanceStatus?: ProvenanceStatus;
  },
  seenHashRegistry: Set<string>
): TransportObservation {
  const nowIso = new Date().toISOString();
  const timestamp = raw.timestamp || nowIso;
  const rawId = raw.rawId || `obs-${Math.random().toString(36).substring(2, 9)}`;

  // Construct composite hash key for deduplication
  const compositeKey = `${raw.sourceId}|${raw.vehicleId || rawId}|${timestamp}`;
  const payloadHash = fnv1aHash(compositeKey);

  let quality: QualityStatus = 'VALID';

  // Check duplicates
  if (seenHashRegistry.has(payloadHash)) {
    quality = 'DUPLICATE';
  } else {
    seenHashRegistry.add(payloadHash);
  }

  // Coordinate check if coordinates are present
  if (raw.latitude !== undefined || raw.longitude !== undefined) {
    if (!validateCoordinates(raw.latitude, raw.longitude)) {
      quality = 'FLAGGED_OUT_OF_BOUNDS';
    }
  }

  // Timestamp check
  const tsCheck = validateTimestamp(timestamp, 86400); // 24h window for historical/batch, tighter for live
  if (!tsCheck.isValid && quality === 'VALID') {
    quality = 'FLAGGED_STALE_TIMESTAMP';
  }

  // Crowd level mapping
  let crowdLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | undefined;
  if (raw.occupancyEstimate !== undefined) {
    if (raw.occupancyEstimate < 35) crowdLevel = 'LOW';
    else if (raw.occupancyEstimate < 65) crowdLevel = 'MEDIUM';
    else if (raw.occupancyEstimate < 95) crowdLevel = 'HIGH';
    else crowdLevel = 'CRITICAL';
  }

  return {
    sourceId: raw.sourceId,
    observationId: `OBS-${raw.sourceId.replace('src-', '')}-${payloadHash}`,
    timestamp,
    receivedAt: nowIso,
    vehicleId: raw.vehicleId,
    routeId: raw.routeId,
    corridorId: raw.corridorId,
    latitude: raw.latitude !== undefined ? +raw.latitude.toFixed(5) : undefined,
    longitude: raw.longitude !== undefined ? +raw.longitude.toFixed(5) : undefined,
    speedKmph: raw.speedKmph !== undefined ? Math.max(0, Math.min(100, Math.round(raw.speedKmph))) : undefined,
    bearingDeg: raw.bearingDeg !== undefined ? Math.round(raw.bearingDeg) % 360 : undefined,
    occupancyEstimate: raw.occupancyEstimate,
    crowdLevel,
    dataType: raw.dataType || 'VEHICLE_POSITION',
    provenanceStatus: raw.provenanceStatus || 'HISTORICAL DATA',
    qualityStatus: quality,
    rawPayloadHash: payloadHash,
  };
}
