import { TransportObservation, IngestionMetrics, SourceHealthStatus } from './types';
import { pollOtdVehiclePositions } from './adapters/otdRealtimeAdapter';
import { pollEtmBoardings } from './adapters/empiricalEtmAdapter';
import { SOURCE_CAPABILITY_REGISTRY } from '@/data/sourceCapabilityRegistry';

class ObservationLedger {
  private observations: TransportObservation[] = [];
  private seenHashes = new Set<string>();
  private maxLedgerCapacity = 1000;
  
  private metrics: IngestionMetrics = {
    totalIngested: 0,
    validRecords: 0,
    outOfBoundsCount: 0,
    staleCount: 0,
    duplicateCount: 0,
    failedRequests: 0,
    lastSuccessfulSync: null,
    lastSyncDurationMs: 0,
    freshnessLagSeconds: 0,
    averageIngestionLatencyMs: 0,
  };

  private sourceHealth: Map<string, SourceHealthStatus> = new Map();

  constructor() {
    // Initialize health registry for all capabilities
    SOURCE_CAPABILITY_REGISTRY.forEach((src) => {
      this.sourceHealth.set(src.id, {
        sourceId: src.id,
        sourceName: src.name,
        status: src.status === 'UNAVAILABLE' ? 'OFFLINE' : src.authRequired ? 'AUTHENTICATION_REQUIRED' : 'ONLINE',
        lastAttemptAt: new Date().toISOString(),
        lastSuccessAt: src.status === 'UNAVAILABLE' ? null : new Date().toISOString(),
        consecutiveFailures: 0,
        totalRecordsIngested: 0,
        latencyMs: src.expectedLatencyMs,
      });
    });

    // Seed with initial certified batch
    this.syncAllSources();
  }

  public async syncAllSources(): Promise<IngestionMetrics> {
    const startTime = Date.now();
    let batchIngested = 0;

    try {
      // 1. Poll OTD
      const otdRes = await pollOtdVehiclePositions(this.seenHashes);
      this.recordObservations(otdRes.observations);
      batchIngested += otdRes.observations.length;

      const otdHealth = this.sourceHealth.get('src-otd-vehicle-positions');
      if (otdHealth) {
        otdHealth.lastAttemptAt = new Date().toISOString();
        otdHealth.lastSuccessAt = new Date().toISOString();
        otdHealth.latencyMs = otdRes.durationMs;
        otdHealth.totalRecordsIngested += otdRes.observations.length;
        otdHealth.status = otdRes.sourceStatus === 'AUTHENTICATED_LIVE' ? 'ONLINE' : 'DEGRADED';
      }

      // 2. Poll ETM
      const etmRes = pollEtmBoardings(this.seenHashes);
      this.recordObservations(etmRes.observations);
      batchIngested += etmRes.observations.length;

      const etmHealth = this.sourceHealth.get('src-dtc-etm-empirical');
      if (etmHealth) {
        etmHealth.lastAttemptAt = new Date().toISOString();
        etmHealth.lastSuccessAt = new Date().toISOString();
        etmHealth.latencyMs = etmRes.durationMs;
        etmHealth.totalRecordsIngested += etmRes.observations.length;
        etmHealth.status = 'ONLINE';
      }

      const syncDuration = Date.now() - startTime;
      this.metrics.lastSuccessfulSync = new Date().toISOString();
      this.metrics.lastSyncDurationMs = syncDuration;
      this.metrics.averageIngestionLatencyMs = Math.round(
        (this.metrics.averageIngestionLatencyMs * 0.7) + (syncDuration * 0.3)
      );

      // Compute freshness lag against the latest valid observation
      if (this.observations.length > 0) {
        const latestTs = new Date(this.observations[0].timestamp).getTime();
        this.metrics.freshnessLagSeconds = Math.max(0, Math.round((Date.now() - latestTs) / 1000));
      }

    } catch (err) {
      this.metrics.failedRequests++;
    }

    return this.getMetrics();
  }

  public recordObservations(newObs: TransportObservation[]): void {
    newObs.forEach((obs) => {
      this.metrics.totalIngested++;
      if (obs.qualityStatus === 'VALID') {
        this.metrics.validRecords++;
      } else if (obs.qualityStatus === 'FLAGGED_OUT_OF_BOUNDS') {
        this.metrics.outOfBoundsCount++;
      } else if (obs.qualityStatus === 'FLAGGED_STALE_TIMESTAMP') {
        this.metrics.staleCount++;
      } else if (obs.qualityStatus === 'DUPLICATE') {
        this.metrics.duplicateCount++;
      }

      // Add to front of observations
      this.observations.unshift(obs);
    });

    // Trim to capacity
    if (this.observations.length > this.maxLedgerCapacity) {
      this.observations = this.observations.slice(0, this.maxLedgerCapacity);
    }
  }

  public getObservations(limit: number = 50, filterCorridorId?: string): TransportObservation[] {
    if (filterCorridorId) {
      return this.observations.filter((o) => o.corridorId === filterCorridorId).slice(0, limit);
    }
    return this.observations.slice(0, limit);
  }

  public getMetrics(): IngestionMetrics {
    return { ...this.metrics };
  }

  public getSourceHealth(): SourceHealthStatus[] {
    return Array.from(this.sourceHealth.values());
  }
}

// Global Singleton in Next.js Node environment
declare global {
  var __nexbus_observation_ledger: ObservationLedger | undefined;
}

export function getObservationLedger(): ObservationLedger {
  if (!globalThis.__nexbus_observation_ledger) {
    globalThis.__nexbus_observation_ledger = new ObservationLedger();
  }
  return globalThis.__nexbus_observation_ledger;
}
