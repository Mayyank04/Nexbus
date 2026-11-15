# NEXBUS Phase 13 — Controlled Field Research Collection Workflow

**Document Code:** SPEC-NEXBUS-FIELD-COLLECTION-2026  
**Implementation Modules:**  
- Service: `src/lib/ingestion/fieldObservationService.ts`  
- API Endpoints: `src/app/api/ingestion/observations/route.ts`  
- Frontend Console: `src/components/research/Phase12ResearchPilotPanel.tsx`  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Overview & Architecture

The Phase 13 Controlled Field Research Collection Workflow establishes an end-to-end, privacy-compliant pipeline for capturing, sanitizing, and persisting real-world mobility observations along Delhi's public transit network.

```
[Field Observer Mobile Client]
         │ (HTTP POST with voluntaryConsentConfirmed: true)
         ▼
[API Gateway: /api/ingestion/observations]
         │
         ├── Payload ceiling check (≤ 500 KB)
         ├── Required fields validation (stopId, routeId, corridorId)
         │
         ▼
[Field Observation Service: recordObservation()]
         │
         ├── Geofence Validation: Lat [28.40, 28.88] N, Lng [76.84, 77.40] E
         ├── Kinematic Sanity: 0 ≤ dwellTimeSeconds ≤ 600
         ├── Passenger Non-Negativity: boardings ≥ 0, alightings ≥ 0
         ├── Truncation: Math.round(coord * 10000) / 10000 (~11m)
         ├── Quantization: Math.round(ms / 15000) * 15000 (15s bins)
         ├── Pseudonymization: HMAC-SHA256(Salt, researcherId)[0..10]
         ├── Taxonomy Assignment: VERIFIED_FIELD_OBSERVATION
         │
         ▼
[Canonical JSON Serialization & SHA-256 Hashing]
         │
         ▼
[In-Memory Audit Ledger & Persistent Index]
         │
         ▼
[Cryptographic Receipt Returned to Surveyor]
```

---

## 2. API Schema & Input Validation

### 2.1 Request Payload Schema (`FieldObservationSubmission`)
```typescript
{
  researcherSaltId: string;           // e.g. "RESEARCH-FELLOW-01"
  voluntaryConsentConfirmed: boolean; // Must be true (IRB requirement)
  observationType: 'SCHEDULED_VS_OBSERVED' | 'DWELL_TIME_MEASUREMENT' | 'PASSENGER_BOARDING_TALLY' | 'VEHICLE_AVL_PING';
  collectionStatus?: CollectionStatus;// Defaults to VERIFIED_FIELD_OBSERVATION for certified fellows
  stopId: string;                     // e.g. "stop-aiims-gate2"
  stopName: string;                   // e.g. "AIIMS Metro Station Bus Stop"
  routeId: string;                    // e.g. "R-502"
  corridorId: string;                 // e.g. "corridor-aurobindo-marg"
  vehicleRegistrationMasked: string;  // e.g. "DL-1PD-48**"
  latitude: number;                   // High-precision WGS84
  longitude: number;                  // High-precision WGS84
  scheduledTimeIso?: string;          // ISO 8601
  observedTimeIso: string;            // ISO 8601
  dwellTimeSeconds?: number;          // Whole seconds (0-600)
  boardingsCount?: number;            // Non-negative integer
  alightingsCount?: number;           // Non-negative integer
  crowdingScore: 1 | 2 | 3 | 4 | 5;   // Fruin Level of Service scale
  weatherCondition: 'CLEAR' | 'HEATWAVE' | 'RAIN_WATERLOGGED' | 'HAZE_POLLUTION';
  notes?: string;
}
```

### 2.2 Rejection Rules (HTTP 400 Bad Request)
The ingestion endpoint rejects submissions under the following programmatic conditions:
1. `voluntaryConsentConfirmed !== true`: Rejection with "Voluntary research consent must be explicitly asserted".
2. Coordinates outside NCT Delhi: Latitude outside $[28.40, 28.88]$ or Longitude outside $[76.84, 77.40]$.
3. Dwell time $< 0$ or $> 600$ seconds.
4. Passenger counts $< 0$.
5. Payload size $> 512\text{ KB}$ (HTTP 413 Payload Too Large).

---

## 3. Data Privacy Transformation Pipeline

Each incoming observation is sanitized according to Phase 13 privacy standards:

| Field | Ingestion Transformation | Security / Privacy Benefit |
| :--- | :--- | :--- |
| **Researcher Identity** | Salted HMAC-SHA256 truncated to 10 hex characters: `OBS-XXXXXXXXXX` | Protects researcher identity from surveillance |
| **GPS Coordinates** | Truncated to 4 decimal places ($\approx 11.13\text{ m}$) | Precludes tracking of individual surveyor paths |
| **Timestamp** | Rounded to nearest 15-second epoch bin | Obfuscates high-resolution timing side-channels |
| **Vehicle Registration** | Last two characters replaced with `**` (e.g. `DL-1PD-48**`) | Prevents vehicle / driver tracking while preserving depot/category |
| **Commuter Data** | Aggregated counts only ($N_{\text{board}}, N_{\text{alight}}$); zero biometric or facial recording | Complete zero-PII compliance |

---

## 4. Cryptographic Receipt & Auditability

Upon successful ingestion, the system constructs a canonical JSON string:
```json
{
  "observationId": "FLD-OBS-20261115-0005",
  "pseudoId": "OBS-9D4581C6AB",
  "type": "SCHEDULED_VS_OBSERVED",
  "status": "VERIFIED_FIELD_OBSERVATION",
  "stopId": "stop-aiims-gate2",
  "routeId": "R-502",
  "corridorId": "corridor-aurobindo-marg",
  "lat": 28.5672,
  "lng": 77.21,
  "time": "2026-11-15T14:30:15.000Z",
  "delaySec": 195,
  "dwell": 38,
  "board": 14,
  "alight": 6,
  "crowd": 3
}
```
The SHA-256 digest of this canonical payload is computed and stored on the record. Any alteration of fields invalidates the hash, providing mathematical non-repudiation.

---

## 5. Mobile-Responsive User Interface

The collection workflow is accessible directly via the `/control` route in the **Field Data Collection (Active)** console:
- Pre-populated checkpoint selection with official WGS84 coordinates.
- Real-time input validation for dwell times, boardings, and alightings.
- Instant feedback receipt showing generated Observation ID, masked observer pseudonym, delay calculation, and SHA-256 checksum.

---

## 6. Operational Safety Invariant

The field collection workflow operates strictly under:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

Surveyors record observations purely through passive external logging. The platform never issues commands to transit dispatchers or traffic signals.
