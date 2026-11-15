# NEXBUS Phase 15 — Fieldwork Execution & Observation Lifecycle Framework

**Framework Reference**: `FIELDWORK-EXEC-GOVERNANCE-2026-V1`  
**Study Corridor**: Aurobindo Marg / Janpath Central Arterial Axis (14.8 km)  
**Execution State**: `READY_FOR_FIELDWORK`  
**Ethics Approval Status**: `ETHICS_APPROVAL_STATUS = PENDING`  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Study Checkpoints & Spatial Alignment

The planned fieldwork study targets 5 discrete multimodal checkpoints along the Aurobindo Marg / Janpath transit corridor:

| Checkpoint ID | Name & Location | WGS84 Coordinates | Connecting Modes | Observation Focus |
|---|---|---|---|---|
| `CHK-01` | **AIIMS Multimodal Hub** | `28.5672° N, 77.2100° E` | Yellow Line, Bus, Walk | Transfer friction, dwell times, platform delay |
| `CHK-02` | **IIT Hauz Khas Interchange** | `28.5450° N, 77.1925° E` | Yellow & Magenta Lines, Bus | Passenger boarding tally, headway adherence |
| `CHK-03` | **Dilli Haat INA Hub** | `28.5744° N, 77.2090° E` | Yellow & Pink Lines, Bus | Multimodal transfer delay, boarding volume |
| `CHK-04` | **Mehrauli Bus Terminal Gateway** | `28.5180° N, 77.1850° E` | Arterial Bus Origin (DTC 502/505) | Dispatch headway regularity, terminal departure |
| `CHK-05` | **Connaught Place Outer Circle** | `28.6315° N, 77.2167° E` | Blue, Yellow & Airport Lines | Corridor terminal arrival, bus bunching diagnostics |

> [!NOTE]
> All coordinates are geofenced strictly within the statutory NCT of Delhi administrative boundary ($28.40^\circ\text{N} \le \text{Lat} \le 28.88^\circ\text{N}$, $76.84^\circ\text{E} \le \text{Lng} \le 77.40^\circ\text{E}$).

---

## 2. Observation Schema Specification

Every field observation record registered in the ingestion ledger adheres to the following typed schema:

```typescript
export interface SanitizedFieldObservation {
  observationId: string;               // e.g. "FLD-OBS-20261115-0001"
  pseudonymizedObserverId: string;     // e.g. "OBS-E1A470BC99" (Salted HMAC)
  observationType: MobilityObservationType; // Headway, Dwell, Tally, etc.
  collectionStatus: CollectionStatus;  // e.g. "VERIFIED_FIELD_OBSERVATION"
  lifecycleState: ObservationLifecycleState; // PLANNED -> SUBMITTED -> VERIFIED
  stopId: string;                      // GTFS stop identifier
  stopName: string;                    // Human-readable station name
  routeId: string;                     // e.g. "R-502"
  corridorId: string;                  // "corridor-aurobindo-marg"
  vehicleRegistrationMasked: string;   // e.g. "DL-1PD-48**" (Zero PII)
  truncatedLatitude: number;           // 4 decimal places (~11.1m)
  truncatedLongitude: number;          // 4 decimal places (~11.1m)
  scheduledTimeIso?: string;           // Timetable baseline
  quantizedObservedTimeIso: string;    // Quantized to 15s intervals
  delaySeconds?: number;               // Observed vs scheduled delta
  dwellTimeSeconds?: number;           // Passenger boarding dwell (0-600s)
  boardingsCount?: number;             // Boarding count tally
  alightingsCount?: number;            // Alighting count tally
  crowdingScore: 1 | 2 | 3 | 4 | 5;    // Fruin Level of Service proxy
  weatherCondition: 'CLEAR' | 'HEATWAVE' | 'RAIN_WATERLOGGED' | 'HAZE_POLLUTION';
  headwayMinutes?: number;             // Gap to previous vehicle
  journeyTimeMinutes?: number;         // Corridor transit duration
  transferTimeMinutes?: number;        // Footway walking transfer
  barrierType?: 'STAIRS_NO_RAMP' | 'BROKEN_PAVEMENT' | 'MISSING_TACTILE' | 'ROAD_ENCROACHMENT' | 'NONE';
  evidenceClassification: EvidenceClassification; // OBSERVED vs SIMULATED
  sha256Digest: string;                // Canonical record digest
  receivedAt: string;                  // Ingestion ISO 8601 timestamp
  exclusionReason?: string;            // Documented if rejected/quarantined
  verificationAudit?: {
    verifiedBy?: string;               // Auditor pseudonymous signature
    verifiedAt?: string;               // Timestamp of formal verification
    verificationMethod?: string;       // Documented audit method
  };
  privacyComplianceAudit: {
    piiPurged: boolean;
    spatialTruncated: boolean;
    temporalQuantized: boolean;
    consentVerified: boolean;
  };
}
```

---

## 3. Observation Lifecycle State Machine

Observations progress through an immutable, auditable state machine:

```
[PLANNED] ──> [COLLECTED] ──> [SUBMITTED] ──> [VALIDATED] ──> [VERIFIED]
                                                     │               ▲
                                                     ├──> [REJECTED] │ (Auditor Sign-off)
                                                     │               │
                                                     └──> [QUARANTINED]
[SIMULATED] ──────── (Permanent label; no promotion to VERIFIED) ────┘
[SYNTHETIC] ──────── (Unit test fixture; isolated from production) ──┘
```

### 3.1 State Definitions
1. **`PLANNED`**: Scheduled observation shift allocated to an authorized checkpoint.
2. **`COLLECTED`**: Raw tally recorded in field notebook or mobile logger.
3. **`SUBMITTED`**: Ingested via API; PII purged; pseudonymized salted hash applied; spatial truncation (~11m) and temporal binning (15s) enforced.
4. **`VALIDATED`**: Passed schema validation, boundary checks, duplicate detection, and physical dwell/speed reasonableness checks.
5. **`VERIFIED`**: Validated record reviewed and cryptographically signed off by an authorized independent researcher with a documented verification method.
6. **`REJECTED`**: Record failed one or more exclusion criteria (e.g. duplicate timestamp, impossible speed > 90 km/h, out-of-bounds coordinates).
7. **`QUARANTINED`**: Suspicious statistical outlier held for supervisory review.
8. **`SIMULATED`**: Synthetic parametric record generated for benchmarking. Cannot be promoted to `VERIFIED`.
9. **`SYNTHETIC`**: Hardcoded test fixture for unit testing and CI validation.

---

## 4. Automated Data Validation & Exclusion Rules

The ingestion engine enforces 10 automated validation filters:

| Rule Code | Validation Name | Threshold / Condition | Rejection Action |
|---|---|---|---|
| **VAL-01** | Geofence Boundary | $28.40 \le \text{Lat} \le 28.88$, $76.84 \le \text{Lng} \le 77.40$ | Throw `COORDINATES_OUTSIDE_NCT_DELHI` |
| **VAL-02** | Dwell Sanity | $0 \le \text{dwellSeconds} \le 600$ | Throw `DWELL_TIME_OUT_OF_BOUNDS` |
| **VAL-03** | Non-Negative Tallies | $\text{boardings} \ge 0$, $\text{alightings} \ge 0$ | Throw `NEGATIVE_PASSENGER_TALLY` |
| **VAL-04** | Duplicate Detection | Unique `(stopId, quantizedTime, vehicleRegMasked)` | Throw `DUPLICATE_OBSERVATION_DROPPED` |
| **VAL-05** | Speed Invariance | Inferred corridor speed $\le 90\text{ km/h}$ | Rejection code `EXC-02` |
| **VAL-06** | Consent Assertion | `voluntaryConsentConfirmed === true` | Throw `RESEARCH_CONSENT_UNCONFIRMED` |
| **VAL-07** | Zero PII Check | No unmasked plates, phone numbers, or names | Throw `DIRECT_PII_DETECTED_BREACH` |
| **VAL-08** | Anti-Promotion Guard | Synthetic / Simulated record cannot transition to `VERIFIED` | Rejection code `UNAUTHORIZED_PROMOTION` |
| **VAL-09** | Verification Guard | Transition to `VERIFIED` requires `verifierMethod` & signature | Reject transition request |
| **VAL-10** | Cryptographic Check | Recalculated SHA-256 matches stored digest | Quarantine record on mismatch |

---

## 5. Current Fieldwork Status

```json
{
  "projectState": "READY_FOR_FIELDWORK",
  "ethicsApprovalStatus": "PENDING",
  "ethicsProtocolId": "IRB-2026-NEXBUS-MOB-004",
  "authorizedCheckpointsCount": 5,
  "activeCorridor": "corridor-aurobindo-marg",
  "verifiedFieldObservationsCount": 0,
  "demonstrationFixturesCount": 4,
  "calibratedSimulationCount": 184,
  "dataIntegrityStatus": "BENCHMARK_DEMONSTRATION_CALIBRATED"
}
```

The system remains locked in `READY_FOR_FIELDWORK` until documentary site clearances and accredited ethics approvals are registered.
