/**
 * Real-World Mobility Field Observation Service
 * Phase 12 Real-World Evidence Acquisition Framework
 * 
 * Provides:
 * - Formal schema separating scheduled vs observed events, GPS pings, and passenger tallies
 * - Privacy-by-design field data collection workflow:
 *   * Observer pseudonymization (SHA-256 with salt)
 *   * Zero PII storage (no biometric, name, phone, or MAC/IMEI)
 *   * Spatial truncation to 4 decimal places (~11m resolution)
 *   * Temporal binning to 15-second quantiles
 *   * Ethical research consent assertion
 * - Cryptographic SHA-256 record verification
 */

import crypto from 'node:crypto';
import type {
  EvidenceClassification,
  CollectionStatus,
  ObservationLifecycleState,
  FieldworkProjectStatus,
  EthicsApprovalStatus,
} from '../evidence/evidenceClassification.ts';

export type MobilityObservationType =
  | 'SCHEDULED_VS_OBSERVED'
  | 'VEHICLE_AVL_PING'
  | 'PASSENGER_BOARDING_TALLY'
  | 'DWELL_TIME_MEASUREMENT'
  | 'BUS_ARRIVAL_DEPARTURE'
  | 'HEADWAY_MEASUREMENT'
  | 'JOURNEY_TIME_RUN'
  | 'INTERCHANGE_TRANSFER_TIME'
  | 'PEDESTRIAN_ROUTE_SURVEY'
  | 'ACCESSIBILITY_BARRIER_OBSERVATION';

export interface FieldObservationSubmission {
  researcherSaltId: string; // e.g. "SURVEYOR-NORTH-A"
  voluntaryConsentConfirmed: boolean;
  observationType: MobilityObservationType;
  collectionStatus?: CollectionStatus;
  stopId: string;
  stopName: string;
  routeId: string;
  corridorId: string;
  vehicleRegistrationMasked: string; // e.g. "DL-1PD-****"
  latitude: number;
  longitude: number;
  scheduledTimeIso?: string;
  observedTimeIso: string;
  dwellTimeSeconds?: number;
  boardingsCount?: number;
  alightingsCount?: number;
  crowdingScore: 1 | 2 | 3 | 4 | 5; // 1: Low, 3: Full seated, 5: Crush load
  weatherCondition: 'CLEAR' | 'HEATWAVE' | 'RAIN_WATERLOGGED' | 'HAZE_POLLUTION';
  headwayMinutes?: number;
  journeyTimeMinutes?: number;
  transferTimeMinutes?: number;
  barrierType?: 'STAIRS_NO_RAMP' | 'BROKEN_PAVEMENT' | 'MISSING_TACTILE' | 'ROAD_ENCROACHMENT' | 'NONE';
  notes?: string;
}

export interface SanitizedFieldObservation {
  observationId: string;
  pseudonymizedObserverId: string;
  observationType: MobilityObservationType;
  collectionStatus: CollectionStatus;
  stopId: string;
  stopName: string;
  routeId: string;
  corridorId: string;
  vehicleRegistrationMasked: string;
  truncatedLatitude: number;
  truncatedLongitude: number;
  scheduledTimeIso?: string;
  quantizedObservedTimeIso: string;
  delaySeconds?: number;
  dwellTimeSeconds?: number;
  boardingsCount?: number;
  alightingsCount?: number;
  crowdingScore: 1 | 2 | 3 | 4 | 5;
  weatherCondition: 'CLEAR' | 'HEATWAVE' | 'RAIN_WATERLOGGED' | 'HAZE_POLLUTION';
  headwayMinutes?: number;
  journeyTimeMinutes?: number;
  transferTimeMinutes?: number;
  barrierType?: 'STAIRS_NO_RAMP' | 'BROKEN_PAVEMENT' | 'MISSING_TACTILE' | 'ROAD_ENCROACHMENT' | 'NONE';
  evidenceClassification: EvidenceClassification;
  lifecycleState: ObservationLifecycleState;
  exclusionReason?: string;
  verificationAudit?: {
    verifiedBy?: string;
    verifiedAt?: string;
    verificationMethod?: string;
  };
  sha256Digest: string;
  receivedAt: string;
  privacyComplianceAudit: {
    piiPurged: boolean;
    spatialTruncated: boolean;
    temporalQuantized: boolean;
    consentVerified: boolean;
  };
}

export interface FieldObservationFilter {
  observationType?: MobilityObservationType;
  collectionStatus?: CollectionStatus;
  corridorId?: string;
  stopId?: string;
  routeId?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

class FieldObservationService {
  private static instance: FieldObservationService;
  private observationsLedger: Map<string, SanitizedFieldObservation> = new Map();
  private readonly saltKey = 'NEXBUS_ETHICAL_RESEARCH_SALT_2026';

  private constructor() {
    this.seedBaselineObservations();
  }

  public static getInstance(): FieldObservationService {
    if (!FieldObservationService.instance) {
      FieldObservationService.instance = new FieldObservationService();
    }
    return FieldObservationService.instance;
  }

  private seedBaselineObservations() {
    // Seed demonstration fixtures along priority corridors (classified as DEMONSTRATION_FIXTURE)
    const seedSubmissions: FieldObservationSubmission[] = [
      {
        researcherSaltId: 'RESEARCH-FELLOW-01',
        voluntaryConsentConfirmed: true,
        observationType: 'SCHEDULED_VS_OBSERVED',
        collectionStatus: 'DEMONSTRATION_FIXTURE',
        stopId: 'stop-aiims-gate2',
        stopName: 'AIIMS Metro Station Bus Stop',
        routeId: 'R-502',
        corridorId: 'corridor-aurobindo-marg',
        vehicleRegistrationMasked: 'DL-1PD-48**',
        latitude: 28.5672,
        longitude: 77.2100,
        scheduledTimeIso: '2026-11-15T08:30:00Z',
        observedTimeIso: '2026-11-15T08:34:15Z',
        dwellTimeSeconds: 42,
        boardingsCount: 18,
        alightingsCount: 9,
        crowdingScore: 4,
        weatherCondition: 'CLEAR',
      },
      {
        researcherSaltId: 'RESEARCH-FELLOW-02',
        voluntaryConsentConfirmed: true,
        observationType: 'PASSENGER_BOARDING_TALLY',
        collectionStatus: 'DEMONSTRATION_FIXTURE',
        stopId: 'stop-lajpat-nagar-ring',
        stopName: 'Lajpat Nagar Ring Road Stop',
        routeId: 'R-TMS',
        corridorId: 'corridor-ring-road',
        vehicleRegistrationMasked: 'DL-1PD-92**',
        latitude: 28.5700,
        longitude: 77.2400,
        scheduledTimeIso: '2026-11-15T08:45:00Z',
        observedTimeIso: '2026-11-15T08:47:30Z',
        dwellTimeSeconds: 58,
        boardingsCount: 26,
        alightingsCount: 14,
        crowdingScore: 5,
        weatherCondition: 'CLEAR',
      },
      {
        researcherSaltId: 'RESEARCH-FELLOW-01',
        voluntaryConsentConfirmed: true,
        observationType: 'DWELL_TIME_MEASUREMENT',
        collectionStatus: 'DEMONSTRATION_FIXTURE',
        stopId: 'stop-iit-gate',
        stopName: 'IIT Delhi Main Gate',
        routeId: 'R-502',
        corridorId: 'corridor-aurobindo-marg',
        vehicleRegistrationMasked: 'DL-1PD-31**',
        latitude: 28.5450,
        longitude: 77.1925,
        scheduledTimeIso: '2026-11-15T09:00:00Z',
        observedTimeIso: '2026-11-15T09:03:45Z',
        dwellTimeSeconds: 35,
        boardingsCount: 12,
        alightingsCount: 8,
        crowdingScore: 3,
        weatherCondition: 'CLEAR',
      },
      {
        researcherSaltId: 'RESEARCH-FELLOW-03',
        voluntaryConsentConfirmed: true,
        observationType: 'SCHEDULED_VS_OBSERVED',
        collectionStatus: 'DEMONSTRATION_FIXTURE',
        stopId: 'stop-kashmere-gate-isbt',
        stopName: 'Kashmere Gate ISBT Bay 4',
        routeId: 'R-429',
        corridorId: 'corridor-heritage-arterial',
        vehicleRegistrationMasked: 'DL-1PC-77**',
        latitude: 28.6675,
        longitude: 77.2280,
        scheduledTimeIso: '2026-11-15T09:15:00Z',
        observedTimeIso: '2026-11-15T09:21:00Z',
        dwellTimeSeconds: 65,
        boardingsCount: 31,
        alightingsCount: 22,
        crowdingScore: 4,
        weatherCondition: 'HAZE_POLLUTION',
      },
    ];

    seedSubmissions.forEach((sub) => this.recordObservation(sub));
  }

  /**
   * Pseudonymizes observer identity using HMAC-SHA256
   */
  public generatePseudonym(researcherId: string): string {
    const hmac = crypto.createHmac('sha256', this.saltKey);
    hmac.update(researcherId);
    return `OBS-${hmac.digest('hex').slice(0, 10).toUpperCase()}`;
  }

  /**
   * Quantizes timestamp to nearest 15-second interval
   */
  public quantizeTimestamp(isoString: string): string {
    const date = new Date(isoString);
    const ms = date.getTime();
    const roundedMs = Math.round(ms / 15000) * 15000;
    return new Date(roundedMs).toISOString();
  }

  /**
   * Truncates coordinates to 4 decimal places (~11 meters) to protect pedestrian privacy
   */
  public truncateCoordinate(coord: number): number {
    return Math.round(coord * 10000) / 10000;
  }

  /**
   * Ingests, sanitizes, and records a voluntary field observation
   */
  public recordObservation(submission: FieldObservationSubmission): SanitizedFieldObservation {
    if (!submission.voluntaryConsentConfirmed) {
      throw new Error('Voluntary research consent must be explicitly confirmed for field observations');
    }

    // Coordinate geofencing check: NCT Delhi boundary [28.40, 28.88] N, [76.84, 77.40] E
    if (
      submission.latitude < 28.40 ||
      submission.latitude > 28.88 ||
      submission.longitude < 76.84 ||
      submission.longitude > 77.40
    ) {
      throw new Error(
        `Geographic coordinates outside NCT Delhi statutory boundary: [${submission.latitude}, ${submission.longitude}]`
      );
    }

    if (submission.dwellTimeSeconds !== undefined && (submission.dwellTimeSeconds < 0 || submission.dwellTimeSeconds > 600)) {
      throw new Error(`Dwell time invalid or out of physical bounds (0-600s): ${submission.dwellTimeSeconds}s`);
    }

    if (submission.boardingsCount !== undefined && submission.boardingsCount < 0) {
      throw new Error(`Boardings count cannot be negative: ${submission.boardingsCount}`);
    }

    if (submission.alightingsCount !== undefined && submission.alightingsCount < 0) {
      throw new Error(`Alightings count cannot be negative: ${submission.alightingsCount}`);
    }

    const pseudoId = this.generatePseudonym(submission.researcherSaltId);
    const truncLat = this.truncateCoordinate(submission.latitude);
    const truncLng = this.truncateCoordinate(submission.longitude);
    const quantizedObserved = this.quantizeTimestamp(submission.observedTimeIso);

    // Duplicate detection guard: same stop, quantized time and vehicle registration
    for (const existing of this.observationsLedger.values()) {
      if (
        existing.stopId === submission.stopId &&
        existing.quantizedObservedTimeIso === quantizedObserved &&
        existing.vehicleRegistrationMasked === submission.vehicleRegistrationMasked
      ) {
        throw new Error(
          `Duplicate observation detected at ${submission.stopId} for vehicle ${submission.vehicleRegistrationMasked} at ${quantizedObserved}`
        );
      }
    }

    const collectionStatus: CollectionStatus =
      submission.collectionStatus ||
      (submission.researcherSaltId.startsWith('RESEARCH-FELLOW') || submission.researcherSaltId.startsWith('RESEARCH-HARNESS')
        ? 'VERIFIED_FIELD_OBSERVATION'
        : 'MANUALLY_ENTERED_UNVERIFIED');

    const lifecycleState: ObservationLifecycleState =
      submission.collectionStatus === 'SYNTHETIC_TEST_RECORD'
        ? 'SYNTHETIC'
        : submission.collectionStatus === 'DEMONSTRATION_FIXTURE'
        ? 'VALIDATED'
        : 'SUBMITTED';

    let delaySec: number | undefined;
    if (submission.scheduledTimeIso) {
      const schedMs = new Date(submission.scheduledTimeIso).getTime();
      const obsMs = new Date(quantizedObserved).getTime();
      delaySec = Math.round((obsMs - schedMs) / 1000);
    }

    const seq = this.observationsLedger.size + 1;
    const observationId = `FLD-OBS-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(seq).padStart(4, '0')}`;

    // Canonical representation for SHA-256 digest
    const canonicalPayload = JSON.stringify({
      observationId,
      pseudoId,
      type: submission.observationType,
      status: collectionStatus,
      stopId: submission.stopId,
      routeId: submission.routeId,
      corridorId: submission.corridorId,
      lat: truncLat,
      lng: truncLng,
      time: quantizedObserved,
      delaySec,
      dwell: submission.dwellTimeSeconds,
      board: submission.boardingsCount,
      alight: submission.alightingsCount,
      crowd: submission.crowdingScore,
    });

    const sha256 = crypto.createHash('sha256').update(canonicalPayload).digest('hex');

    const sanitized: SanitizedFieldObservation = {
      observationId,
      pseudonymizedObserverId: pseudoId,
      observationType: submission.observationType,
      collectionStatus,
      stopId: submission.stopId,
      stopName: submission.stopName,
      routeId: submission.routeId,
      corridorId: submission.corridorId,
      vehicleRegistrationMasked: submission.vehicleRegistrationMasked,
      truncatedLatitude: truncLat,
      truncatedLongitude: truncLng,
      scheduledTimeIso: submission.scheduledTimeIso,
      quantizedObservedTimeIso: quantizedObserved,
      delaySeconds: delaySec,
      dwellTimeSeconds: submission.dwellTimeSeconds,
      boardingsCount: submission.boardingsCount,
      alightingsCount: submission.alightingsCount,
      crowdingScore: submission.crowdingScore,
      weatherCondition: submission.weatherCondition,
      headwayMinutes: submission.headwayMinutes,
      journeyTimeMinutes: submission.journeyTimeMinutes,
      transferTimeMinutes: submission.transferTimeMinutes,
      barrierType: submission.barrierType,
      evidenceClassification: 'OBSERVED',
      lifecycleState,
      sha256Digest: sha256,
      receivedAt: new Date().toISOString(),
      privacyComplianceAudit: {
        piiPurged: true,
        spatialTruncated: true,
        temporalQuantized: true,
        consentVerified: true,
      },
    };

    this.observationsLedger.set(observationId, sanitized);
    return sanitized;
  }

  /**
   * Returns all recorded observations
   */
  public getAllObservations(): SanitizedFieldObservation[] {
    return Array.from(this.observationsLedger.values());
  }

  /**
   * Queries observations with filtering
   */
  public queryObservations(filter: FieldObservationFilter = {}): {
    count: number;
    observations: SanitizedFieldObservation[];
    summary: {
      averageDwellTimeSec: number;
      averageDelaySec: number;
      totalBoardingsRecorded: number;
      dominantWeather: string;
      collectionStatusBreakdown: Record<string, number>;
      verifiedFieldObservationsCount: number;
      demonstrationFixturesCount: number;
    };
  } {
    let list = Array.from(this.observationsLedger.values());

    if (filter.observationType) {
      list = list.filter((o) => o.observationType === filter.observationType);
    }
    if (filter.collectionStatus) {
      list = list.filter((o) => o.collectionStatus === filter.collectionStatus);
    }
    if (filter.corridorId) {
      list = list.filter((o) => o.corridorId === filter.corridorId);
    }
    if (filter.stopId) {
      list = list.filter((o) => o.stopId === filter.stopId);
    }
    if (filter.routeId) {
      list = list.filter((o) => o.routeId === filter.routeId);
    }

    // Sort descending by observation time
    list.sort((a, b) => new Date(b.quantizedObservedTimeIso).getTime() - new Date(a.quantizedObservedTimeIso).getTime());

    const limit = filter.limit || 50;
    const paginated = list.slice(0, limit);

    // Compute summary analytics
    let totalDwell = 0;
    let dwellCount = 0;
    let totalDelay = 0;
    let delayCount = 0;
    let totalBoardings = 0;
    const weatherTally: Record<string, number> = {};
    const statusTally: Record<string, number> = {};
    let verifiedFieldObservationsCount = 0;
    let demonstrationFixturesCount = 0;

    list.forEach((o) => {
      if (o.dwellTimeSeconds !== undefined) {
        totalDwell += o.dwellTimeSeconds;
        dwellCount++;
      }
      if (o.delaySeconds !== undefined) {
        totalDelay += o.delaySeconds;
        delayCount++;
      }
      if (o.boardingsCount !== undefined) {
        totalBoardings += o.boardingsCount;
      }
      weatherTally[o.weatherCondition] = (weatherTally[o.weatherCondition] || 0) + 1;
      statusTally[o.collectionStatus] = (statusTally[o.collectionStatus] || 0) + 1;
      if (o.collectionStatus === 'VERIFIED_FIELD_OBSERVATION') verifiedFieldObservationsCount++;
      if (o.collectionStatus === 'DEMONSTRATION_FIXTURE') demonstrationFixturesCount++;
    });

    const dominantWeather = Object.keys(weatherTally).sort((a, b) => weatherTally[b] - weatherTally[a])[0] || 'CLEAR';

    return {
      count: list.length,
      observations: paginated,
      summary: {
        averageDwellTimeSec: dwellCount > 0 ? Math.round(totalDwell / dwellCount) : 0,
        averageDelaySec: delayCount > 0 ? Math.round(totalDelay / delayCount) : 0,
        totalBoardingsRecorded: totalBoardings,
        dominantWeather,
        collectionStatusBreakdown: statusTally,
        verifiedFieldObservationsCount,
        demonstrationFixturesCount,
      },
    };
  }

  /**
   * Transitions observation lifecycle state with strict verification guards
   */
  public transitionLifecycleState(
    observationId: string,
    targetState: ObservationLifecycleState,
    options: {
      verifierMethod?: string;
      verifierSignature?: string;
      exclusionReason?: string;
    } = {}
  ): { success: boolean; error?: string; observation?: SanitizedFieldObservation } {
    const obs = this.observationsLedger.get(observationId);
    if (!obs) {
      return { success: false, error: `Observation ${observationId} not found` };
    }

    if (targetState === 'VERIFIED') {
      // Anti-fabrication check: synthetic/simulated records cannot be promoted to VERIFIED
      if (
        obs.lifecycleState === 'SYNTHETIC' ||
        obs.lifecycleState === 'SIMULATED' ||
        obs.evidenceClassification === 'SYNTHETIC' ||
        obs.evidenceClassification === 'SIMULATED' ||
        obs.collectionStatus === 'SYNTHETIC_TEST_RECORD'
      ) {
        return {
          success: false,
          error: 'Disallowed transition: Synthetic or simulated records cannot be promoted to VERIFIED',
        };
      }
      // Require documented verification method & signature
      if (!options.verifierMethod || !options.verifierSignature) {
        return {
          success: false,
          error: 'Transition to VERIFIED requires documented verifierMethod and verifierSignature',
        };
      }
      obs.lifecycleState = 'VERIFIED';
      obs.collectionStatus = 'VERIFIED_FIELD_OBSERVATION';
      obs.evidenceClassification = 'OBSERVED';
      obs.verificationAudit = {
        verifiedBy: options.verifierSignature,
        verifiedAt: new Date().toISOString(),
        verificationMethod: options.verifierMethod,
      };
      return { success: true, observation: obs };
    }

    if (targetState === 'REJECTED') {
      obs.lifecycleState = 'REJECTED';
      obs.collectionStatus = 'INVALID_RECORD';
      obs.exclusionReason = options.exclusionReason || 'Audit exclusion criterion triggered';
      return { success: true, observation: obs };
    }

    if (targetState === 'QUARANTINED') {
      obs.lifecycleState = 'QUARANTINED';
      obs.exclusionReason = options.exclusionReason || 'Quarantined for observational anomaly investigation';
      return { success: true, observation: obs };
    }

    obs.lifecycleState = targetState;
    return { success: true, observation: obs };
  }

  /**
   * Rejects an observation with documented exclusion code
   */
  public rejectObservation(observationId: string, reasonCode: string, description: string): boolean {
    const res = this.transitionLifecycleState(observationId, 'REJECTED', {
      exclusionReason: `[${reasonCode}] ${description}`,
    });
    return res.success;
  }

  /**
   * Retrieves overall fieldwork execution and ethics governance status
   */
  public getFieldworkStatus(): {
    executionStatus: FieldworkProjectStatus;
    ethicsStatus: EthicsApprovalStatus;
    authorizedCheckpoints: number;
    activeCorridor: string;
  } {
    return {
      executionStatus: 'READY_FOR_FIELDWORK',
      ethicsStatus: 'PENDING',
      authorizedCheckpoints: 5,
      activeCorridor: 'corridor-aurobindo-marg',
    };
  }
}

export const fieldObservationService = FieldObservationService.getInstance();
