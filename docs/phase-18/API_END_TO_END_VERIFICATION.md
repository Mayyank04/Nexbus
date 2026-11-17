# NEXBUS PHASE 18 — API END-TO-END VERIFICATION & ERROR RESILIENCE

**Date:** 17 November 2026  
**Host Target:** `http://localhost:3000` (Next.js 16 Turbopack)  
**Total Endpoints Audited:** 28 REST Route Handlers  
**Standard Envelope:** JSON with `success`, `data`, `meta`, `timestamp`  
**Security Invariant:** Read-only methods (`GET`, read-only `POST` for calculation), strict bounds validation, no mutations to real-world infrastructure  

---

## 1. Route Verification Results

| Endpoint Family | Method | Query / Payload | Expected HTTP | Actual HTTP | Content-Type | Epistemological Classification |
|---|---|---|:---:|:---:|---|---|
| `/api/health` | `GET` | None | 200 | 200 | `application/json` | System Telemetry |
| `/api/gtfs/routes` | `GET` | None | 200 | 200 | `application/json` | Hardware-Observed (GTFS Static) |
| `/api/gtfs/stops` | `GET` | `corridorId=corridor-ring-road` | 200 | 200 | `application/json` | Hardware-Observed (GTFS Static) |
| `/api/prediction/crowding` | `GET` | `corridorId=corridor-ring-road&timeHour=9` | 200 | 200 | `application/json` | ST-GNN Bayesian Forecast |
| `/api/prediction/crowding` | `GET` | Missing `corridorId` | 400 | 400 | `application/json` | Input Validation Error |
| `/api/journey/plan` | `POST` | Valid JSON `{originId, destinationId}` | 200 | 200 | `application/json` | Graph Search / Multi-Criteria |
| `/api/journey/plan` | `POST` | Malformed JSON `{"invalid":` | 400 | 400 | `application/json` | Input Validation Error |
| `/api/multimodal/plan` | `POST` | `{originId: "stop-cp-01", destinationId: "stop-aiims-04", requireStepFree: true}` | 200 | 200 | `application/json` | Multimodal IFI Pathfinding |
| `/api/simulation/evaluate` | `POST` | `{corridorId, additionalBuses: 5, targetHeadway: 8}` | 200 | 200 | `application/json` | Little's Law / Counterfactual |
| `/api/simulation/evaluate` | `POST` | `{corridorId, additionalBuses: -10}` | 422 | 422 | `application/json` | Parameter Bounds Clamp Error |
| `/api/analytics/summary` | `GET` | None | 200 | 200 | `application/json` | Calibrated Observations |
| `/api/analytics/export` | `GET` | `type=corridors` | 200 | 200 | `text/csv` | RFC 4180 Transit CSV |
| `/api/analytics/export` | `GET` | `type=unknown_invalid` | 400 | 400 | `application/json` | Parameter Error |
| `/api/ingestion/governance` | `GET` | None | 200 | 200 | `application/json` | Hardware Telemetry (8 Providers) |
| `/api/shadow/corridors` | `GET` | None | 200 | 200 | `application/json` | Realtime Drift Monitoring |
| `/api/ml/forecast` | `POST` | `{corridorId: "corridor-ring-road", horizonMinutes: 30}` | 200 | 200 | `application/json` | ST-GNN v1.4.2 Surrogate |

---

## 2. Error Handling & Failsafe Behaviors

### 2.1 Malformed JSON Rejection
All POST routes employ strict JSON parsing guards with structured 400 envelopes:
```json
{
  "success": false,
  "error": "MALFORMED_REQUEST_BODY",
  "message": "Invalid JSON payload provided. Please supply valid request parameters."
}
```

### 2.2 Numerical Parameter Clamping
In `/api/simulation/evaluate`, counterfactual policy bounds are strictly enforced:
- `additionalBuses`: bounded to $[0, 50]$
- `targetHeadway`: bounded to $[2, 30]$ minutes
- `signalPriority`: boolean

Requests exceeding these operational domains receive structured 422 Unprocessable Entity responses rather than crashing the mathematical engine.

### 2.3 Epistemic Metadata Header & Disclaimers
Every analytical and simulation response includes explicit epistemological tier headers:
- `X-Epistemological-Tier: Hypothetical`
- `X-Model-SURROGATE: ST-GNN-v1.4.2`
- `X-Safety-Invariant: READ-ONLY-ADVISORY`
