/**
 * Canonical Types for NEXBUS Real-Time Ingestion Architecture
 * Complies with Phase 2 Unified Transport Observation Schema Directives.
 */

export type ObservationDataType =
  | 'VEHICLE_POSITION'
  | 'PASSENGER_BOARDING'
  | 'HEADWAY_MEASUREMENT'
  | 'AIR_QUALITY_METRIC';

export type ProvenanceStatus =
  | 'LIVE OBSERVED DATA'
  | 'HISTORICAL DATA'
  | 'CALIBRATED ESTIMATE'
  | 'MODEL PREDICTION'
  | 'SIMULATION';

export type QualityStatus =
  | 'VALID'
  | 'FLAGGED_OUT_OF_BOUNDS'
  | 'FLAGGED_STALE_TIMESTAMP'
  | 'DUPLICATE'
  | 'INCOMPLETE_FIELDS';

export interface TransportObservation {
  sourceId: string;
  observationId: string;
  timestamp: string; // ISO 8601 UTC
  receivedAt: string; // Ingestion engine receipt timestamp
  vehicleId?: string;
  routeId?: string;
  corridorId?: string;
  latitude?: number;
  longitude?: number;
  speedKmph?: number;
  bearingDeg?: number;
  occupancyEstimate?: number; // 0 to 120 passengers
  crowdLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dataType: ObservationDataType;
  provenanceStatus: ProvenanceStatus;
  qualityStatus: QualityStatus;
  rawPayloadHash: string;
}

export interface IngestionMetrics {
  totalIngested: number;
  validRecords: number;
  outOfBoundsCount: number;
  staleCount: number;
  duplicateCount: number;
  failedRequests: number;
  lastSuccessfulSync: string | null;
  lastSyncDurationMs: number;
  freshnessLagSeconds: number;
  averageIngestionLatencyMs: number;
}

export interface SourceHealthStatus {
  sourceId: string;
  sourceName: string;
  status: 'ONLINE' | 'DEGRADED' | 'AUTHENTICATION_REQUIRED' | 'OFFLINE';
  lastAttemptAt: string;
  lastSuccessAt: string | null;
  consecutiveFailures: number;
  totalRecordsIngested: number;
  latencyMs: number;
  errorMessage?: string;
}
