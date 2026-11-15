/**
 * Central Transport Data Provider Registry
 * Phase 12 Real-World Evidence Acquisition Framework
 * 
 * Orchestrates:
 * - 8 validated external and observed transport and civic providers
 * - Strict non-substitution invariants (no fake live telemetry)
 * - Cryptographic raw archival of ingested payloads
 * - Composite health and data freshness evaluation
 */

import { BaseTransportProvider, ProviderMetadata, RawIngestionPayload, ProviderValidationResult } from './baseProvider';
import { GtfsStaticProvider } from './gtfsStaticProvider';
import { GtfsRealtimeProvider } from './gtfsRealtimeProvider';
import { DmrcProvider } from './dmrcProvider';
import { OsmTransportProvider } from './osmTransportProvider';
import { CpcbProvider } from './cpcbProvider';
import { CensusDemographicsProvider } from './censusDemographicsProvider';
import { DtcOperationsProvider } from './dtcProvider';
import { ImdWeatherProvider } from './imdWeatherProvider';
import { rawArchiveService } from '../rawArchiveService';
import { ProviderStatus } from '@/data/sourceCapabilityRegistry';

export interface ProviderInspectionDetail {
  id: string;
  name: string;
  authority: string;
  category: string;
  evidenceClassification: string;
  status: ProviderStatus;
  authRequired: boolean;
  geographicScope: string;
  temporalScope: string;
  license: string;
  lastSync: {
    lastSuccess: string | null;
    lastFailure: string | null;
    consecutiveFailures: number;
    avgLatencyMs: number;
  };
  validation: ProviderValidationResult | null;
  sha256Digest?: string;
  recordCount?: number;
}

export interface IngestionRegistrySummary {
  timestamp: string;
  totalProvidersCount: number;
  activeAvailableCount: number;
  authRequiredCount: number;
  compositeHealthScorePct: number;
  totalIngestedRecords: number;
  providers: ProviderInspectionDetail[];
  advisoryNote: string;
}

class ProviderRegistry {
  private static instance: ProviderRegistry;
  private providers: Map<string, BaseTransportProvider<any>> = new Map();
  private lastValidationResults: Map<string, ProviderValidationResult> = new Map();
  private latestPayloads: Map<string, RawIngestionPayload<any>> = new Map();

  private constructor() {
    this.registerProvider(new GtfsStaticProvider());
    this.registerProvider(new GtfsRealtimeProvider());
    this.registerProvider(new DmrcProvider());
    this.registerProvider(new OsmTransportProvider());
    this.registerProvider(new CpcbProvider());
    this.registerProvider(new CensusDemographicsProvider());
    this.registerProvider(new DtcOperationsProvider());
    this.registerProvider(new ImdWeatherProvider());
  }

  public static getInstance(): ProviderRegistry {
    if (!ProviderRegistry.instance) {
      ProviderRegistry.instance = new ProviderRegistry();
    }
    return ProviderRegistry.instance;
  }

  private registerProvider(provider: BaseTransportProvider<any>): void {
    const meta = provider.getMetadata();
    this.providers.set(meta.id, provider);
  }

  public getProvider(id: string): BaseTransportProvider<any> | undefined {
    return this.providers.get(id);
  }

  public getAllProviders(): BaseTransportProvider<any>[] {
    return Array.from(this.providers.values());
  }

  /**
   * Synchronizes and validates a single provider, archiving the resulting payload
   */
  public async syncProvider(id: string): Promise<{
    payload: RawIngestionPayload<any>;
    validation: ProviderValidationResult;
  }> {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider ${id} not found in registry`);
    }

    const payload = await provider.fetchRawData();
    const validation = provider.validatePayload(payload);

    this.latestPayloads.set(id, payload);
    this.lastValidationResults.set(id, validation);

    // Archive payload metadata immutably
    if (payload.data !== null && payload.data !== undefined) {
      const meta = provider.getMetadata();
      rawArchiveService.archivePayload({
        providerId: meta.id,
        sourceAuthority: meta.authority,
        dataCategory: meta.dataCategory,
        evidenceClassification: meta.evidenceClassification,
        rawPayload: JSON.stringify(payload.data),
        recordCount: payload.recordCount,
        validationStatus: validation.isValid ? 'VALID' : validation.warnings.length > 0 ? 'WARNINGS' : 'INVALID',
        license: meta.license,
      });
    }

    return { payload, validation };
  }

  /**
   * Synchronizes all registered providers sequentially
   */
  public async syncAll(): Promise<IngestionRegistrySummary> {
    for (const provider of this.providers.values()) {
      try {
        await this.syncProvider(provider.getMetadata().id);
      } catch (err) {
        // Individual provider failures are handled gracefully without aborting the registry
        console.warn(`[ProviderRegistry] Sync skipped or failed for ${provider.getMetadata().id}:`, err);
      }
    }
    return this.getRegistrySummary();
  }

  /**
   * Computes composite health score across all registered feeds (0 to 100%)
   */
  public getCompositeHealthScore(): number {
    const providers = Array.from(this.providers.values());
    if (providers.length === 0) return 0;

    let scoreAccum = 0;
    providers.forEach((p) => {
      const status = p.getStatus();
      const validation = this.lastValidationResults.get(p.getMetadata().id);
      
      let providerScore = 0;
      if (status === 'AVAILABLE') {
        providerScore = 70;
        if (validation && validation.isValid) {
          providerScore += 30 * (validation.qualityScorePct / 100);
        } else {
          providerScore += 15;
        }
      } else if (status === 'AUTH_REQUIRED') {
        // Legitimate governance state for restricted endpoints (e.g. OTD API Key)
        providerScore = 50;
      } else if (status === 'RATE_LIMITED') {
        providerScore = 30;
      } else {
        providerScore = 0;
      }

      scoreAccum += providerScore;
    });

    return Math.round(scoreAccum / providers.length);
  }

  /**
   * Builds detailed inspection summary for the research and institutional portal
   */
  public getRegistrySummary(): IngestionRegistrySummary {
    const providersList: ProviderInspectionDetail[] = [];
    let totalRecords = 0;
    let activeAvailable = 0;
    let authRequired = 0;

    for (const provider of this.providers.values()) {
      const meta = provider.getMetadata();
      const status = provider.getStatus();
      const lastSync = provider.getLastSyncDetails();
      const validation = this.lastValidationResults.get(meta.id) || null;
      const latestPayload = this.latestPayloads.get(meta.id);

      if (status === 'AVAILABLE') activeAvailable++;
      if (status === 'AUTH_REQUIRED') authRequired++;

      const records = latestPayload?.recordCount || 0;
      totalRecords += records;

      providersList.push({
        id: meta.id,
        name: meta.name,
        authority: meta.authority,
        category: meta.dataCategory,
        evidenceClassification: meta.evidenceClassification,
        status,
        authRequired: meta.authRequired,
        geographicScope: meta.geographicScope,
        temporalScope: meta.temporalScope,
        license: meta.license,
        lastSync,
        validation,
        sha256Digest: latestPayload?.sha256Checksum,
        recordCount: records,
      });
    }

    return {
      timestamp: new Date().toISOString(),
      totalProvidersCount: this.providers.size,
      activeAvailableCount: activeAvailable,
      authRequiredCount: authRequired,
      compositeHealthScorePct: this.getCompositeHealthScore(),
      totalIngestedRecords: totalRecords,
      providers: providersList,
      advisoryNote: 'All provider telemetry and feeds strictly adhere to the READ-ONLY + PASSIVE + ADVISORY invariant. No automated vehicle dispatch or railway control is permitted.',
    };
  }
}

export const providerRegistry = ProviderRegistry.getInstance();
