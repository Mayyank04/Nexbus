/**
 * Centralized Evidence Classification & Quality Governance for NEXBUS
 * Complies strictly with Phase 8 Section 3 Directives.
 */

export type EvidenceClassification =
  | 'OBSERVED'
  | 'VERIFIED_EXTERNAL'
  | 'DERIVED'
  | 'ESTIMATED'
  | 'PREDICTED'
  | 'SIMULATED'
  | 'SYNTHETIC'
  | 'UNAVAILABLE'
  | 'AUTH_REQUIRED';

export type FreshnessStatus =
  | 'FRESH'
  | 'AGING'
  | 'STALE'
  | 'EXPIRED'
  | 'UNKNOWN'
  | 'UNAVAILABLE';

export interface DataProvenanceRecord {
  recordId: string;
  sourceId: string;
  sourceOrganization: string;
  sourceName: string;
  sourceUrl?: string | null;
  evidenceClassification: EvidenceClassification;
  collectionTimestamp?: string | null;
  sourcePublicationTimestamp?: string | null;
  lastRetrievalTimestamp?: string | null;
  validityInterval?: { start: string; end: string } | null;
  geographicCoverage?: string | null;
  spatialResolution?: string | null;
  temporalResolution?: string | null;
  transformationMethod?: string | null;
  modelId?: string | null;
  modelVersion?: string | null;
  inputRecordReferences?: string[] | null;
  confidenceScore?: number | null;
  uncertaintyInterval?: { lower: number; upper: number; confidenceLevelPct: number } | null;
  knownLimitations?: string | null;
  dataLicense?: string | null;
  validationStatus?: 'VALIDATED' | 'UNVALIDATED' | 'FLAGGED' | 'EXEMPT';
  freshnessStatus?: FreshnessStatus;
}

export type SourceFreshnessCategory =
  | 'REALTIME_TELEMETRY'
  | 'HOURLY_INFERENCE'
  | 'DAILY_AGGREGATE'
  | 'SCHEDULE_STATIC'
  | 'RESEARCH_BENCHMARK'
  | 'EMISSION_REGULATORY';

export interface FreshnessThresholdConfig {
  freshMaxSeconds: number;
  agingMaxSeconds: number;
  staleMaxSeconds: number;
}

export const DEFAULT_FRESHNESS_THRESHOLDS: Record<SourceFreshnessCategory, FreshnessThresholdConfig> = {
  REALTIME_TELEMETRY: { freshMaxSeconds: 30, agingMaxSeconds: 120, staleMaxSeconds: 600 },
  HOURLY_INFERENCE: { freshMaxSeconds: 3600, agingMaxSeconds: 7200, staleMaxSeconds: 14400 },
  DAILY_AGGREGATE: { freshMaxSeconds: 86400, agingMaxSeconds: 172800, staleMaxSeconds: 604800 },
  SCHEDULE_STATIC: { freshMaxSeconds: 5184000, agingMaxSeconds: 10368000, staleMaxSeconds: 15552000 }, // 60, 120, 180 days
  RESEARCH_BENCHMARK: { freshMaxSeconds: 31536000, agingMaxSeconds: 63072000, staleMaxSeconds: 94608000 }, // 1, 2, 3 years
  EMISSION_REGULATORY: { freshMaxSeconds: 63072000, agingMaxSeconds: 126144000, staleMaxSeconds: 189216000 },
};

export function sanitizeTimestamp(timestamp: string | null | undefined): {
  valid: boolean;
  date?: Date;
  ageSeconds?: number;
  error?: string;
} {
  if (!timestamp || typeof timestamp !== 'string' || timestamp.trim() === '') {
    return { valid: false, error: 'Timestamp is missing or empty' };
  }
  const date = new Date(timestamp);
  const timeMs = date.getTime();
  if (isNaN(timeMs)) {
    return { valid: false, error: 'Invalid ISO timestamp string' };
  }
  const now = Date.now();
  const ageSeconds = Math.round((now - timeMs) / 1000);
  if (ageSeconds < -300) {
    // Clock skew beyond 5 minutes in the future
    return { valid: false, date, ageSeconds, error: 'Future timestamp detected beyond permissible clock skew (5m)' };
  }
  return { valid: true, date, ageSeconds: Math.max(0, ageSeconds) };
}

export function evaluateFreshness(
  timestamp: string | null | undefined,
  category: SourceFreshnessCategory = 'REALTIME_TELEMETRY',
  customThresholds?: Partial<FreshnessThresholdConfig>
): { status: FreshnessStatus; ageSeconds: number | null; error?: string } {
  if (!timestamp) {
    return { status: 'UNKNOWN', ageSeconds: null, error: 'No timestamp provided; freshness cannot be fabricated' };
  }
  const sanitized = sanitizeTimestamp(timestamp);
  if (!sanitized.valid) {
    return { status: 'UNKNOWN', ageSeconds: sanitized.ageSeconds ?? null, error: sanitized.error };
  }

  const age = sanitized.ageSeconds!;
  const thresholds = {
    ...DEFAULT_FRESHNESS_THRESHOLDS[category],
    ...(customThresholds || {}),
  };

  if (age <= thresholds.freshMaxSeconds) {
    return { status: 'FRESH', ageSeconds: age };
  }
  if (age <= thresholds.agingMaxSeconds) {
    return { status: 'AGING', ageSeconds: age };
  }
  if (age <= thresholds.staleMaxSeconds) {
    return { status: 'STALE', ageSeconds: age };
  }
  return { status: 'EXPIRED', ageSeconds: age };
}

/**
 * Strict immutability rules preventing evidence classification elevation.
 * A synthetic fixture or model prediction must NEVER be elevated to an observed fact.
 */
export function preventClassificationElevation(
  current: EvidenceClassification,
  target: EvidenceClassification
): { allowed: boolean; reason?: string } {
  if (current === target) return { allowed: true };

  // Synthetic records cannot be converted to real world classifications
  if (current === 'SYNTHETIC' && target !== 'SYNTHETIC' && target !== 'UNAVAILABLE') {
    return {
      allowed: false,
      reason: `Illegal elevation: SYNTHETIC records cannot be reclassified as ${target}`,
    };
  }

  // Model-generated predictions cannot be converted to observed facts
  if ((current === 'PREDICTED' || current === 'SIMULATED') && (target === 'OBSERVED' || target === 'VERIFIED_EXTERNAL')) {
    return {
      allowed: false,
      reason: `Illegal elevation: ${current} outputs cannot be reclassified as ${target}`,
    };
  }

  // Unavailable or auth-required data cannot silently become observed
  if ((current === 'UNAVAILABLE' || current === 'AUTH_REQUIRED') && (target === 'OBSERVED' || target === 'VERIFIED_EXTERNAL')) {
    return {
      allowed: false,
      reason: `Illegal elevation: ${current} state cannot be substituted as ${target}`,
    };
  }

  return { allowed: true };
}

export type ObservationLifecycleState =
  | 'PLANNED'
  | 'COLLECTED'
  | 'SUBMITTED'
  | 'VALIDATED'
  | 'VERIFIED'
  | 'REJECTED'
  | 'QUARANTINED'
  | 'SIMULATED'
  | 'SYNTHETIC';

export type FieldworkProjectStatus =
  | 'BLOCKED_PENDING_AUTHORIZATION'
  | 'READY_FOR_FIELDWORK'
  | 'FIELDWORK_IN_PROGRESS'
  | 'FIELDWORK_COMPLETED_PENDING_AUDIT'
  | 'INDEPENDENTLY_VERIFIED'
  | 'INSUFFICIENT_EVIDENCE';

export type EthicsApprovalStatus = 'PENDING' | 'UNVERIFIED' | 'APPROVED' | 'EXEMPT';

export type CollectionStatus =
  | 'VERIFIED_FIELD_OBSERVATION'
  | 'VERIFIED_EXTERNAL_RECORD'
  | 'MANUALLY_ENTERED_UNVERIFIED'
  | 'IMPORTED_HISTORICAL_RECORD'
  | 'SYNTHETIC_TEST_RECORD'
  | 'DEMONSTRATION_FIXTURE'
  | 'INVALID_RECORD';

export type TransportMode = 'BUS' | 'METRO' | 'WALK' | 'INTERCHANGE_TRANSFER' | 'AUTO_FEEDER';

export interface ObservationMetadata {
  sourceId: string;
  sourceProvider: string;
  sourceUrl?: string;
  observationTimestamp: string;
  ingestionTimestamp: string;
  geographicCoverage: string;
  transportMode: TransportMode;
  dataType: string;
  freshnessStatus: 'FRESH' | 'AGING' | 'STALE' | 'EXPIRED';
  verificationStatus: 'VERIFIED_OFFICIAL' | 'AUDITED_BENCHMARK' | 'UNVERIFIED' | 'SYNTHETIC_TEST';
  confidenceLevelPct: number;
  evidenceClassification: EvidenceClassification;
  lineage: string[];
}

export interface DataQualityReport {
  scorePct: number;
  freshnessLagSeconds: number;
  coordinateSanityPass: boolean;
  schemaPass: boolean;
  duplicateDetected: boolean;
  flags: string[];
}

export function evaluateDataQuality(
  obs: {
    timestamp: string;
    latitude?: number;
    longitude?: number;
    sourceId: string;
    classification: EvidenceClassification;
  },
  seenHashes: Set<string>
): DataQualityReport {
  const flags: string[] = [];
  let score = 100;

  const ts = new Date(obs.timestamp).getTime();
  const now = Date.now();
  const lagSeconds = Math.max(0, Math.round((now - ts) / 1000));

  if (lagSeconds > 3600) {
    flags.push('STALE_DATA_BEYOND_1_HOUR');
    score -= 25;
  } else if (lagSeconds > 300) {
    flags.push('AGING_DATA_BEYOND_5_MIN');
    score -= 10;
  }

  // WGS84 Delhi bounds check
  let coordinateSanityPass = true;
  if (obs.latitude !== undefined && obs.longitude !== undefined) {
    if (
      obs.latitude < 28.40 ||
      obs.latitude > 28.88 ||
      obs.longitude < 76.84 ||
      obs.longitude > 77.40
    ) {
      coordinateSanityPass = false;
      flags.push('COORDINATES_OUT_OF_DELHI_BOUNDS');
      score -= 40;
    }
  }

  // Duplicate check
  const hashKey = `${obs.sourceId}|${obs.timestamp}|${obs.latitude || 0}|${obs.longitude || 0}`;
  let duplicateDetected = false;
  if (seenHashes.has(hashKey)) {
    duplicateDetected = true;
    flags.push('DUPLICATE_OBSERVATION_DROPPED');
    score -= 20;
  } else {
    seenHashes.add(hashKey);
  }

  return {
    scorePct: Math.max(0, score),
    freshnessLagSeconds: lagSeconds,
    coordinateSanityPass,
    schemaPass: true,
    duplicateDetected,
    flags,
  };
}
