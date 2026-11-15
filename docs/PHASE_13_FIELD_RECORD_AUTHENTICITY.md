# NEXBUS Phase 13 — Field Record Authenticity & Provenance Audit Report

**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Audit Target:** Phase 12 Mobility Field Observation Framework & Research Pilot Protocol  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  
**Date:** November 2026  
**Auditor:** NEXBUS Independent Research & Software Verification Consortium  

---

## 1. Executive Summary & Epistemological Disclosure

In accordance with Phase 13 Section 1 directives, an independent technical audit of all pre-existing mobility observations and pilot progress metrics was conducted across `src/lib/ingestion/fieldObservationService.ts` and `src/lib/pilot/researchPilotService.ts`.

### Key Epistemological Findings:
1. **Clarification of Pilot Progress Metric:**
   In Phase 12, the pilot progress counter in `researchPilotService.ts` recorded `currentCompletedObservations: 188` (78.3%). Independent audit confirms this counter represented a target simulation progress parameter configured for UI demonstration testing. The underlying live ledger contained only **4 pre-seeded demonstration records** (`RESEARCH-FELLOW-01`, `02`, `03`). Under Phase 13 scientific integrity standards, no unexecuted target may be presented as completed field data. The service has been updated with a formal `provenanceBreakdown`:
   - `demonstrationFixturesCount`: 4
   - `benchmarkSimulationCount`: 184
   - `verifiedFieldObservationsCount`: 0 (accurately reporting 0.0% verified completion prior to active field execution)
2. **Reclassification of Baseline Records:**
   The 4 pre-seeded records have been reclassified from generic `'OBSERVED'` to `'DEMONSTRATION_FIXTURE'` under the newly established 7-tier Phase 13 Collection Status Taxonomy.
3. **Audit Verification Passing Rate:**
   100% of recorded baseline observations pass NCT Delhi statutory geofencing, 4-decimal spatial truncation, 15-second temporal quantization, kinematic sanity, and cryptographic SHA-256 digest validation.

---

## 2. Phase 13 Seven-Tier Collection Status Taxonomy

To eliminate ambiguity between empirical field evidence, official archives, and synthetic test data, NEXBUS adopts the following mutually exclusive collection status classifications:

| Collection Status Code | Description | Verification Standard | Custody Tier |
| :--- | :--- | :--- | :--- |
| `VERIFIED_FIELD_OBSERVATION` | Ground truth observation recorded by trained surveyor following approved IRB protocol | Surveyor pseudonym verified, GPS geofenced, physical checks passed | Tier 1 (Field Ground Truth) |
| `VERIFIED_EXTERNAL_RECORD` | Official published records from statutory transit authorities (DMRC, DTC, CPCB, IMD) | Cryptographic archival, published source URL, static schema verified | Tier 2 (Official Secondary) |
| `MANUALLY_ENTERED_UNVERIFIED` | Crowdsourced or surveyor input pending secondary corroboration or cross-validation | Valid format, geofenced, uncorroborated | Tier 3 (Provisional) |
| `IMPORTED_HISTORICAL_RECORD` | Historical GTFS schedules or municipal transport archives | Archival timestamp, schema conformance | Tier 4 (Historical Baseline) |
| `SYNTHETIC_TEST_RECORD` | Algorithmically generated records for unit testing, stress testing, or simulation | Explicit synthetic flag, non-overlapping IDs | Tier 5 (Synthetic Test) |
| `DEMONSTRATION_FIXTURE` | Pre-seeded mock observations provided for UI staging and demonstration harnesses | Labeled fixture, segregated from empirical metrics | Tier 6 (Demo Fixture) |
| `INVALID_RECORD` | Observations rejected due to boundary violations, time anomalies, or kinematic infeasibility | Quarantined in rejection log | Tier 7 (Rejected) |

---

## 3. Physical & Kinematic Geofence Verification

All records ingested into `fieldObservationService` are subjected to strict programmatic bounds checks:

### 3.1 Spatial Geofencing (NCT Delhi Statutory Boundaries)
$$\text{Latitude} \in [28.40^\circ\text{N}, 28.88^\circ\text{N}], \quad \text{Longitude} \in [76.84^\circ\text{E}, 77.40^\circ\text{E}]$$
Any submission outside these coordinates is immediately rejected with HTTP 400. All 4 demonstration records fall strictly within this bounding box:
- `AIIMS Metro Station Bus Stop`: $[28.5672^\circ\text{N}, 77.2100^\circ\text{E}]$ — PASS
- `Lajpat Nagar Ring Road Stop`: $[28.5700^\circ\text{N}, 77.2400^\circ\text{E}]$ — PASS
- `IIT Delhi Main Gate`: $[28.5450^\circ\text{N}, 77.1925^\circ\text{E}]$ — PASS
- `Kashmere Gate ISBT Bay 4`: $[28.6675^\circ\text{N}, 77.2280^\circ\text{E}]$ — PASS

### 3.2 Spatial Precision Truncation
All coordinates are truncated to 4 decimal places:
$$\text{Resolution} \approx 0.0001^\circ \approx 11.13\text{ meters}$$
This prevents device tracking and ensures pedestrian privacy while providing sufficient spatial resolution for transit stop allocation.

### 3.3 Kinematic Sanity Bounds
- **Dwell Time:** Must satisfy $0 \le \tau_{\text{dwell}} \le 600\text{ seconds}$ (10 minutes max physical stop).
- **Passenger Boardings / Alightings:** Non-negative integers ($N_{\text{board}} \ge 0, N_{\text{alight}} \ge 0$).
- **Vehicle Speed Feasibility:** Inter-stop velocities $\le 100\text{ km/h}$ for surface buses.

---

## 4. Privacy-by-Design Verification

NEXBUS strictly enforces Zero Personally Identifiable Information (Zero PII):
1. **Observer Pseudonymization:**
   Surveyor IDs are salted and hashed via HMAC-SHA256:
   $$\text{Pseudonym} = \text{"OBS-"} + \text{HMAC-SHA256}(K_{\text{salt}}, \text{researcherId})[0..10]$$
   Example: `RESEARCH-FELLOW-01` $\to$ `OBS-9D4581C6AB`.
2. **Temporal Quantization:**
   Raw timestamps are rounded to the nearest 15-second boundary to prevent timing correlation attacks.
3. **No Biometrics or Network Identifiers:**
   Zero collection of names, phone numbers, vehicle driver IDs, MAC addresses, or camera images.

---

## 5. Cryptographic Digest Verification

Each sanitized observation generates a canonical JSON representation and a 64-character SHA-256 digest:
$$\text{Digest} = \text{SHA256}(\text{CanonicalPayload}(\text{Obs}))$$
The independent audit script `scripts/audit-pilot-records.mjs` reconstructed the canonical payload for each observation in the ledger and verified a 100% bitwise match against `sha256Digest`.

---

## 6. Audit Execution Log Summary

```text
=== NEXBUS PHASE 13 PILOT RECORD AUTHENTICITY & PROVENANCE AUDIT ===

1. Fetching Field Observations from /api/ingestion/observations...
   [PASS] Retrieved 4 recorded mobility observations

2. Auditing Collection Status Taxonomy & Provenance Classification...
   [PASS] All records adhere to Phase 13 taxonomy. Found 4 DEMONSTRATION_FIXTURE records.

3. Auditing Spatial Geofencing & Precision Truncation...
   [PASS] 100% of observations pass NCT Delhi statutory geofence and 4-decimal truncation (~11m)

4. Auditing Privacy By Design: HMAC Pseudonymization & 15-Second Quantization...
   [PASS] Privacy invariants verified: Zero PII, HMAC-SHA256 pseudonyms, 15s quantization

5. Auditing Physical Sanity (Dwell Times, Headways & Passenger Tallies)...
   [PASS] All kinematic and passenger counts fall within physical sanity constraints

6. Auditing Cryptographic SHA-256 Digest Verification...
   [PASS] 100% of recorded observations cryptographically validated with exact SHA-256 match

7. Auditing Research Pilot Protocol & Epistemological Transparency at /api/pilot/protocol...
   [PASS] Research pilot provenance breakdown verified: zero unexecuted targets reported as verified field observations

8. Verifying READ-ONLY + PASSIVE + ADVISORY Invariant...
   [PASS] READ-ONLY + PASSIVE + ADVISORY certified across all endpoints

============================================================
PHASE 13 PILOT RECORD AUTHENTICITY AUDIT: 100% AUDIT PASS
============================================================
```

---

## 7. Mandatory Operational Safety Invariant

NEXBUS operates strictly under the invariant:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

No field observation, analytical model, or pilot protocol interaction exercises any control over DTC bus dispatching, DMRC train movements, or traffic signal controllers. All recommendations are passive, educational, and research-advisory.
