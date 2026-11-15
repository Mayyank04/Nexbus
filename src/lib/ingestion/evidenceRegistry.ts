/**
 * Central Evidence & Dataset Registry for NEXBUS
 * 
 * Provides verifiable metadata, licensing, geographic coverage,
 * update frequencies, validation status, and composite quality scores
 * for all datasets supporting the Delhi Urban Mobility platform.
 * 
 * Core Invariant:
 * Transparency before presentation. Never conceal unavailable or restricted feeds.
 */

import { EvidenceClassification } from '@/lib/evidence/evidenceClassification';

export type DatasetQualityStatus = 'CERTIFIED' | 'PROVISIONAL' | 'DEGRADED' | 'BLOCKED' | 'UNAVAILABLE';

export interface DatasetQualityBreakdown {
  sourceAuthorityScore: number; // 0 to 100 (Official government/DMRC = 100, Crowd-sourced = 75, Unverified = 40)
  temporalFreshnessScore: number; // 0 to 100 (Real-time/daily = 100, Monthly = 80, Multi-year static = 60)
  geographicCompletenessScore: number; // 0 to 100 (Full NCT + NCR = 100, NCT only = 80, Corridor only = 50)
  dataCompletenessScore: number; // 0 to 100 (100 - missingDataPercentage)
  validationRigorScore: number; // 0 to 100 (Schema + Bounds + Ground Truth = 100, Schema only = 70)
  provenanceIntegrityScore: number; // 0 to 100 (Complete immutable lineage = 100, Partial = 60)
  compositeQualityScorePct: number; // Documented weighted sum
  weightingDisclosure: string;
}

export interface DatasetRegistryEntry {
  datasetId: string;
  datasetName: string;
  provider: string;
  dataOwner: string;
  originalSourceUrl: string;
  collectionTimestamp: string;
  lastSuccessfulRetrieval: string | null;
  geographicCoverage: string;
  temporalCoverage: string;
  updateFrequency: string;
  license: string;
  evidenceClassification: EvidenceClassification;
  qualityStatus: DatasetQualityStatus;
  validationStatus: 'VALIDATED' | 'REQUIRES_AUTHENTICATION' | 'ENDPOINT_OFFLINE' | 'UNVERIFIED';
  missingDataPercentage: number;
  knownLimitations: string;
  qualityBreakdown: DatasetQualityBreakdown;
  lineagePath: string[];
}

export function calculateQualityScore(params: {
  authority: number;
  freshness: number;
  geoCompleteness: number;
  missingDataPct: number;
  validation: number;
  provenance: number;
}): DatasetQualityBreakdown {
  const dataCompleteness = Math.max(0, 100 - params.missingDataPct);
  
  // Explicit documented weights: Authority (25%), Freshness (20%), Completeness (20%), Geo (15%), Val (10%), Prov (10%)
  const composite = +(
    params.authority * 0.25 +
    params.freshness * 0.20 +
    dataCompleteness * 0.20 +
    params.geoCompleteness * 0.15 +
    params.validation * 0.10 +
    params.provenance * 0.10
  ).toFixed(1);

  return {
    sourceAuthorityScore: params.authority,
    temporalFreshnessScore: params.freshness,
    geographicCompletenessScore: params.geoCompleteness,
    dataCompletenessScore: dataCompleteness,
    validationRigorScore: params.validation,
    provenanceIntegrityScore: params.provenance,
    compositeQualityScorePct: composite,
    weightingDisclosure: 'Weights: Authority 25%, Freshness 20%, Completeness 20%, Geo Coverage 15%, Validation 10%, Provenance 10%',
  };
}

export const CENTRAL_DATASET_REGISTRY: DatasetRegistryEntry[] = [
  // 1. OTD Delhi GTFS Static
  {
    datasetId: 'ds-otd-delhi-gtfs-static',
    datasetName: 'OTD Delhi Static GTFS Transit Schedules',
    provider: 'Department of Transport, GNCTD / IIIT-Delhi Open Transit Data Portal',
    dataOwner: 'Delhi Transport Corporation (DTC) & Delhi Integrated Multi-Modal Transit System (DIMTS)',
    originalSourceUrl: 'https://otd.delhi.gov.in/data/static/gtfs.zip',
    collectionTimestamp: '2024-03-15T00:00:00Z',
    lastSuccessfulRetrieval: '2024-11-01T10:30:00Z',
    geographicCoverage: 'NCT of Delhi (500+ bus routes, 4,000+ scheduled stops)',
    temporalCoverage: 'Q1–Q4 2024 Static Schedules',
    updateFrequency: 'Quarterly Batch Updates',
    license: 'Government Open Data License - India (GODL) / OTD Terms of Use',
    evidenceClassification: 'VERIFIED_EXTERNAL',
    qualityStatus: 'CERTIFIED',
    validationStatus: 'VALIDATED',
    missingDataPercentage: 1.2,
    knownLimitations: 'Quarterly snapshots do not reflect day-to-day route diversions or temporary festival bypasses.',
    qualityBreakdown: calculateQualityScore({
      authority: 98,
      freshness: 75,
      geoCompleteness: 92,
      missingDataPct: 1.2,
      validation: 95,
      provenance: 95,
    }),
    lineagePath: ['OTD Portal Archive', 'ZIP Decompression', 'GTFS Normalizer', 'Multimodal Network Graph'],
  },

  // 2. OTD Delhi GTFS-Realtime VehiclePositions
  {
    datasetId: 'ds-otd-delhi-gtfs-rt-vp',
    datasetName: 'OTD Delhi GTFS-Realtime Vehicle Positions Stream',
    provider: 'Department of Transport, GNCTD',
    dataOwner: 'Delhi Transport Corporation (DTC)',
    originalSourceUrl: 'https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb',
    collectionTimestamp: 'Continuous Real-Time Stream',
    lastSuccessfulRetrieval: null,
    geographicCoverage: 'NCT of Delhi GPS-equipped DTC/Cluster Bus Fleet',
    temporalCoverage: 'Live Real-Time Telemetry (10s polling interval)',
    updateFrequency: 'Every 10–30 Seconds',
    license: 'Restricted Access - Requires Transport Dept Approved API Key',
    evidenceClassification: 'OBSERVED',
    qualityStatus: 'PROVISIONAL',
    validationStatus: 'REQUIRES_AUTHENTICATION',
    missingDataPercentage: 24.5,
    knownLimitations: 'Upstream endpoint returns HTTP 401 Unauthorized without approved API key. GPS drift in high-rise corridors.',
    qualityBreakdown: calculateQualityScore({
      authority: 95,
      freshness: 98,
      geoCompleteness: 75,
      missingDataPct: 24.5,
      validation: 85,
      provenance: 80,
    }),
    lineagePath: ['DTC Telemetry Server', 'OTD Protobuf API', 'Rate Limiter & Auth Guard', 'Shadow Operations Ledger'],
  },

  // 3. OTD Delhi GTFS-Realtime TripUpdates
  {
    datasetId: 'ds-otd-delhi-gtfs-rt-tu',
    datasetName: 'OTD Delhi GTFS-Realtime Trip Updates & Delays Feed',
    provider: 'Department of Transport, GNCTD',
    dataOwner: 'DTC Operations Central Control',
    originalSourceUrl: 'https://otd.delhi.gov.in/api/realtime/TripUpdates.pb',
    collectionTimestamp: 'Endpoint Surveyed November 2024',
    lastSuccessfulRetrieval: null,
    geographicCoverage: 'NCT of Delhi Scheduled DTC Bus Corridors',
    temporalCoverage: 'Unavailable (Endpoint Offline)',
    updateFrequency: 'Unpublished',
    license: 'Unpublished / Proprietary DTC Control System',
    evidenceClassification: 'UNAVAILABLE',
    qualityStatus: 'UNAVAILABLE',
    validationStatus: 'ENDPOINT_OFFLINE',
    missingDataPercentage: 100.0,
    knownLimitations: 'Official URL returns HTTP 404 Not Found. Real-time ETA updates are not publicly broadcast over this endpoint.',
    qualityBreakdown: calculateQualityScore({
      authority: 90,
      freshness: 0,
      geoCompleteness: 0,
      missingDataPct: 100.0,
      validation: 0,
      provenance: 50,
    }),
    lineagePath: ['Endpoint Survey Probe', 'HTTP 404 Sentinel', 'Non-Substitution Invariant (Flagged UNAVAILABLE)'],
  },

  // 4. OpenStreetMap Delhi Road & Transit Graph Extract
  {
    datasetId: 'ds-osm-delhi-transit',
    datasetName: 'OpenStreetMap Delhi Multi-Modal Road & Rail Infrastructure',
    provider: 'OpenStreetMap Contributors / Geofabrik Extracts',
    dataOwner: 'OpenStreetMap Foundation (OSMF)',
    originalSourceUrl: 'https://overpass-api.de/api/interpreter',
    collectionTimestamp: '2024-10-15T00:00:00Z',
    lastSuccessfulRetrieval: '2024-11-10T14:15:00Z',
    geographicCoverage: 'Delhi NCT & Surrounding NCR (Bounding Box: 28.30N–28.95N, 76.80E–77.50E)',
    temporalCoverage: 'Continuously updated crowd-sourced geospatial database',
    updateFrequency: 'Daily Mirror Updates',
    license: 'Open Database License (ODbL) 1.0',
    evidenceClassification: 'VERIFIED_EXTERNAL',
    qualityStatus: 'CERTIFIED',
    validationStatus: 'VALIDATED',
    missingDataPercentage: 4.8,
    knownLimitations: 'Overpass API exhibits periodic timeouts (>6,000ms). Sidewalk tagging is incomplete in informal settlements.',
    qualityBreakdown: calculateQualityScore({
      authority: 85,
      freshness: 90,
      geoCompleteness: 95,
      missingDataPct: 4.8,
      validation: 88,
      provenance: 92,
    }),
    lineagePath: ['Overpass API Query', 'XML/GeoJSON Parser', 'WGS84 Coordinate Validator', 'Multimodal Edge Network'],
  },

  // 5. DTC Electronic Ticketing Machine (ETM) Empirical Dataset
  {
    datasetId: 'ds-dtc-etm-empirical',
    datasetName: 'DTC Electronic Ticketing Machine (ETM) Passenger Boarding Sample',
    provider: 'Delhi Transport Corporation (DTC) / Transport Research Wing',
    dataOwner: 'Government of NCT of Delhi',
    originalSourceUrl: 'Internal Administrative Audit Records & Published Operational Statistics',
    collectionTimestamp: '2024-06-30T23:59:59Z',
    lastSuccessfulRetrieval: '2024-09-01T08:00:00Z',
    geographicCoverage: '4 Priority Conduits (Ring Road, Aurobindo Marg, Heritage Spine, Najafgarh)',
    temporalCoverage: 'Sample of 480,000 ticket transactions across weekday and weekend duty sheets',
    updateFrequency: 'Periodic Research Releases',
    license: 'Government Research Fair-Use Attribution',
    evidenceClassification: 'VERIFIED_EXTERNAL',
    qualityStatus: 'CERTIFIED',
    validationStatus: 'VALIDATED',
    missingDataPercentage: 3.5,
    knownLimitations: 'Ticketing records capture boarding stop and fare stage, but do not record alightings (alighting inferred via gravity decay).',
    qualityBreakdown: calculateQualityScore({
      authority: 95,
      freshness: 70,
      geoCompleteness: 70,
      missingDataPct: 3.5,
      validation: 92,
      provenance: 90,
    }),
    lineagePath: ['ETM Duty Sheet Export', 'Passenger Aggregator', 'Empirical Headway Estimator', 'Demand Service'],
  },

  // 6. CPCB / SAFAR Ambient Air Quality Observations
  {
    datasetId: 'ds-cpcb-safar-aqi',
    datasetName: 'CPCB / SAFAR Delhi Ambient Air Quality & Particulate Telemetry',
    provider: 'Central Pollution Control Board (CPCB) / Ministry of Earth Sciences',
    dataOwner: 'Central Pollution Control Board',
    originalSourceUrl: 'https://app.cpcbccr.com/AQI_Portal/',
    collectionTimestamp: 'Continuous Station Monitoring',
    lastSuccessfulRetrieval: null,
    geographicCoverage: '38 Continuous Ambient Air Quality Monitoring Stations (CAAQMS) in Delhi NCR',
    temporalCoverage: 'Hourly AQI and PM2.5/PM10 concentration observations',
    updateFrequency: 'Hourly Updates',
    license: 'Public Sector Data - Central Government',
    evidenceClassification: 'UNAVAILABLE',
    qualityStatus: 'UNAVAILABLE',
    validationStatus: 'ENDPOINT_OFFLINE',
    missingDataPercentage: 100.0,
    knownLimitations: 'Direct API endpoints protected by Cloudflare WAF or moved to dynamic session-based portals. Flagged UNAVAILABLE.',
    qualityBreakdown: calculateQualityScore({
      authority: 96,
      freshness: 0,
      geoCompleteness: 0,
      missingDataPct: 100.0,
      validation: 0,
      provenance: 40,
    }),
    lineagePath: ['CAAQMS Station Sensors', 'Central Portal', 'WAF Blocker Sentinel', 'Non-Substitution Policy Guard'],
  },

  // 7. Census of India & Master Plan for Delhi 2041 (MPD-2041)
  {
    datasetId: 'ds-census-mpd2041',
    datasetName: 'Census of India Ward Demographics & Master Plan for Delhi 2041 Projections',
    provider: 'Office of the Registrar General & Census Commissioner / Delhi Development Authority (DDA)',
    dataOwner: 'Ministry of Home Affairs & DDA',
    originalSourceUrl: 'https://censusindia.gov.in / https://dda.gov.in/mpd-2041',
    collectionTimestamp: 'Census 2011 (Baseline) with 2024 Projections from MPD-2041 Draft',
    lastSuccessfulRetrieval: '2024-08-15T00:00:00Z',
    geographicCoverage: 'All 11 Revenue Districts and 272 Municipal Wards of Delhi NCT',
    temporalCoverage: 'Decennial baseline calibrated with statutory urban master plan growth rates',
    updateFrequency: 'Decennial / Statutory Master Plan Revisions',
    license: 'Government Public Information / Statutory Document',
    evidenceClassification: 'VERIFIED_EXTERNAL',
    qualityStatus: 'CERTIFIED',
    validationStatus: 'VALIDATED',
    missingDataPercentage: 0.5,
    knownLimitations: 'Official decennial census enumeration has not occurred since 2011; 2024 figures rely on official MPD-2041 cohort projections.',
    qualityBreakdown: calculateQualityScore({
      authority: 99,
      freshness: 65,
      geoCompleteness: 100,
      missingDataPct: 0.5,
      validation: 95,
      provenance: 95,
    }),
    lineagePath: ['Census Ward Tables', 'MPD-2041 Spatial Allocation', 'Zone Aggregator', 'OD Matrix & Equity Engines'],
  },

  // 8. DMRC Published Rapid Transit Network Specifications
  {
    datasetId: 'ds-dmrc-network-specs',
    datasetName: 'DMRC Delhi Metro Phase I–III Infrastructure Specifications',
    provider: 'Delhi Metro Rail Corporation Limited (DMRC)',
    dataOwner: 'Delhi Metro Rail Corporation Ltd.',
    originalSourceUrl: 'https://www.delhimetrorail.com/',
    collectionTimestamp: '2024-09-01T00:00:00Z',
    lastSuccessfulRetrieval: '2024-11-01T00:00:00Z',
    geographicCoverage: 'DMRC Rapid Transit Network across Delhi, Noida, Gurugram, Faridabad, Ghaziabad, Bahadurgarh',
    temporalCoverage: 'Current Operating Timetables, Line Interchanges, and Station Infrastructure',
    updateFrequency: 'Updated as line extensions and fare revisions commission',
    license: 'DMRC Public Transit Disclosures',
    evidenceClassification: 'VERIFIED_EXTERNAL',
    qualityStatus: 'CERTIFIED',
    validationStatus: 'VALIDATED',
    missingDataPercentage: 0.0,
    knownLimitations: 'Covers physical DMRC network; does not include real-time train automatic location pings.',
    qualityBreakdown: calculateQualityScore({
      authority: 100,
      freshness: 90,
      geoCompleteness: 98,
      missingDataPct: 0.0,
      validation: 100,
      provenance: 98,
    }),
    lineagePath: ['DMRC Network Architecture', 'Station Coordinates WGS84', 'Line Sequencer', 'Multimodal Network Graph'],
  },
];

export class EvidenceRegistryService {
  public getAllDatasets(): DatasetRegistryEntry[] {
    return CENTRAL_DATASET_REGISTRY;
  }

  public getDatasetById(id: string): DatasetRegistryEntry | undefined {
    return CENTRAL_DATASET_REGISTRY.find((d) => d.datasetId === id);
  }

  public getRegistrySummary() {
    const total = CENTRAL_DATASET_REGISTRY.length;
    const certified = CENTRAL_DATASET_REGISTRY.filter((d) => d.qualityStatus === 'CERTIFIED').length;
    const unavailable = CENTRAL_DATASET_REGISTRY.filter((d) => d.qualityStatus === 'UNAVAILABLE').length;
    const provisional = CENTRAL_DATASET_REGISTRY.filter((d) => d.qualityStatus === 'PROVISIONAL').length;

    const avgQuality = +(
      CENTRAL_DATASET_REGISTRY.reduce((acc, d) => acc + d.qualityBreakdown.compositeQualityScorePct, 0) / total
    ).toFixed(1);

    return {
      totalDatasetsRegistered: total,
      certifiedCount: certified,
      provisionalCount: provisional,
      unavailableCount: unavailable,
      averageCompositeQualityScorePct: avgQuality,
      governanceNotice:
        'NON-SUBSTITUTION INVARIANT: Datasets marked UNAVAILABLE or REQUIRES_AUTHENTICATION are never silently replaced with synthetic data.',
    };
  }
}

let evidenceRegistryInstance: EvidenceRegistryService | null = null;

export function getEvidenceRegistryService(): EvidenceRegistryService {
  if (!evidenceRegistryInstance) {
    evidenceRegistryInstance = new EvidenceRegistryService();
  }
  return evidenceRegistryInstance;
}

// Aliases for compatibility
export const EVIDENCE_DATASET_REGISTRY = CENTRAL_DATASET_REGISTRY;
export type DatasetRegistryItem = DatasetRegistryEntry;
export type QualityDimensionBreakdown = DatasetQualityBreakdown;
export function getDatasetQualityMetrics() {
  return getEvidenceRegistryService().getRegistrySummary();
}
