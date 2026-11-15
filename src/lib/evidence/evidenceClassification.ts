/**
 * Centralized Evidence Classification & Quality Governance for NEXBUS
 * Complies strictly with Phase 8 Section 3 Directives.
 */

export type EvidenceClassification =
  | 'OBSERVED'
  | 'VERIFIED_EXTERNAL'
  | 'DERIVED'
  | 'ESTIMATED'
  | 'SIMULATED'
  | 'SYNTHETIC'
  | 'UNAVAILABLE';

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
