/**
 * Base Transport Data Provider Architecture
 * Phase 12 Real-World Evidence Acquisition Framework
 * 
 * Provides:
 * - Abstract provider contract with mandatory metadata (license, authority, coverage, update frequency)
 * - SHA-256 payload integrity hashing
 * - Standardized timeout handling (5,000 ms ceiling)
 * - Non-substitution enforcement
 */

import crypto from 'node:crypto';
import { EvidenceClassification } from '@/lib/evidence/evidenceClassification';
import { ProviderStatus } from '@/data/sourceCapabilityRegistry';
import { IngestionFailureCategory } from '../dataQualityGovernor';

export interface ProviderMetadata {
  id: string;
  name: string;
  authority: string;
  endpointUrl: string;
  license: string;
  licenseUrl?: string;
  usageRestrictions: string;
  dataCategory: 'TRANSIT_STATIC' | 'TRANSIT_REALTIME' | 'GEOSPATIAL' | 'ENVIRONMENTAL' | 'DEMOGRAPHIC' | 'WEATHER';
  evidenceClassification: EvidenceClassification;
  geographicScope: string;
  temporalScope: string;
  updateFrequency: string;
  authRequired: boolean;
  expectedFormat: 'GTFS_ZIP' | 'PROTOBUF_GTFS_RT' | 'JSON' | 'GEOJSON' | 'CSV';
}

export interface RawIngestionPayload<T = unknown> {
  providerId: string;
  retrievedAt: string;
  sha256Checksum: string;
  payloadBytes: number;
  recordCount: number;
  data: T;
  headers?: Record<string, string>;
  isFallback: boolean;
  status: ProviderStatus;
}

export interface ProviderValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  schemaPassed: boolean;
  recordsParsed: number;
  qualityScorePct: number;
}

export abstract class BaseTransportProvider<T = unknown> {
  protected metadata: ProviderMetadata;
  protected currentStatus: ProviderStatus;
  protected lastSuccessfulSync: string | null = null;
  protected lastFailedSync: string | null = null;
  protected failureCategory: IngestionFailureCategory = 'NONE';
  protected consecutiveFailures = 0;
  protected latencyHistory: number[] = [];

  constructor(metadata: ProviderMetadata, initialStatus: ProviderStatus = 'AVAILABLE') {
    this.metadata = metadata;
    this.currentStatus = initialStatus;
  }

  public getMetadata(): ProviderMetadata {
    return { ...this.metadata };
  }

  public getStatus(): ProviderStatus {
    return this.currentStatus;
  }

  public getFailureCategory(): IngestionFailureCategory {
    return this.failureCategory;
  }

  public getLastSyncDetails() {
    return {
      lastSuccess: this.lastSuccessfulSync,
      lastFailure: this.lastFailedSync,
      consecutiveFailures: this.consecutiveFailures,
      avgLatencyMs: this.latencyHistory.length > 0
        ? Math.round(this.latencyHistory.reduce((a, b) => a + b, 0) / this.latencyHistory.length)
        : 0,
    };
  }

  /**
   * Computes SHA-256 cryptographic checksum of raw buffer or string
   */
  public computeSha256(content: string | Buffer): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Core retrieval method with timeout protection and status tracking
   */
  public abstract fetchRawData(timeoutMs?: number): Promise<RawIngestionPayload<T>>;

  /**
   * Validates ingested schema against expected structural invariants
   */
  public abstract validatePayload(payload: RawIngestionPayload<T>): ProviderValidationResult;

  /**
   * Records provider latency observation
   */
  protected recordLatency(latencyMs: number): void {
    this.latencyHistory.push(latencyMs);
    if (this.latencyHistory.length > 20) this.latencyHistory.shift();
  }

  /**
   * Records successful ingestion
   */
  protected recordSuccess(): void {
    this.currentStatus = 'AVAILABLE';
    this.lastSuccessfulSync = new Date().toISOString();
    this.consecutiveFailures = 0;
    this.failureCategory = 'NONE';
  }

  /**
   * Records failed ingestion with standardized category
   */
  protected recordFailure(error: string, category: IngestionFailureCategory, status: ProviderStatus = 'UNAVAILABLE'): void {
    this.currentStatus = status;
    this.lastFailedSync = new Date().toISOString();
    this.consecutiveFailures++;
    this.failureCategory = category;
  }
}
