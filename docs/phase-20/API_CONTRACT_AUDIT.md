# NEXBUS PHASE 20 — API CONTRACT AUDIT & RUNTIME INTEGRITY SPECIFICATION

**Scope:** 34 Production RESTful API Endpoints (`src/app/api/`)  
**Validation Engine:** Zod Schemas & TypeScript Type Guards  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. COMPREHENSIVE API ROUTE INVENTORY

Every API route handler in NEXBUS was audited for input validation, schema enforcement, rate-limiting behavior, error contracts, and data classification:

| Route Path | Method | Purpose | Input Schema | Auth | Rate Limit | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/gtfs/routes` | `GET` | Priority corridors | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/gtfs/stops` | `GET` | 256 stop nodes | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/prediction/crowding` | `GET` | Crowding forecast | `corridorId`, `hour` | Public | 120 req/min | `PREDICTED` |
| `/api/journey/plan` | `POST` | Multi-criteria routing | Origin, Dest, Time | Public | 120 req/min | `DERIVED` |
| `/api/simulation/evaluate` | `POST` | Counterfactual model | Delta params | Public | 120 req/min | `SIMULATED` |
| `/api/simulation/scenarios`| `GET` | Saved scenarios | None | Public | 120 req/min | `SIMULATED` |
| `/api/network/provenance` | `GET` | Provenance registry | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/network/expanded` | `GET` | 67-node city network | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/ml/evaluation` | `GET` | ML model benchmarks | None | Public | 120 req/min | `DERIVED` |
| `/api/ml/forecast` | `POST` | ST-GNN point forecast | Stop, Horizon | Public | 120 req/min | `PREDICTED` |
| `/api/ml/registry` | `GET` | Model artifact index | None | Public | 120 req/min | `DERIVED` |
| `/api/ml/explainability` | `GET` | SHAP feature weights | `modelId` | Public | 120 req/min | `DERIVED` |
| `/api/historical/observations`| `GET` | Binned historical data| `corridorId` | Public | 120 req/min | `OBSERVED` |
| `/api/analytics/corridor-benchmarks`| `GET` | Kinematic benchmarks | None | Public | 120 req/min | `DERIVED` |
| `/api/analytics/export` | `GET` | Civic CSV download | `type=corridors` | Public | 120 req/min | `DERIVED` |
| `/api/analytics/summary`| `GET` | High-level KPIs | None | Public | 120 req/min | `DERIVED` |
| `/api/demand/corridor-demand`| `GET` | Passenger density | `corridorId` | Public | 120 req/min | `ESTIMATED` |
| `/api/demand/od-matrix` | `GET` | Gravity OD matrix | None | Public | 120 req/min | `ESTIMATED` |
| `/api/multimodal/plan` | `POST` | Metro/Bus intermodal | Origin, Dest | Public | 120 req/min | `DERIVED` |
| `/api/multimodal/interchanges`| `GET` | 15 hub walk sheds | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/multimodal/interchanges/congestion`| `GET` | Fruin LOS scores | `hubId` | Public | 120 req/min | `ESTIMATED` |
| `/api/multimodal/accessibility`| `GET` | Wheelchair audits | None | Public | 120 req/min | `OBSERVED` |
| `/api/multimodal/resilience`| `GET` | Network stress tests | None | Public | 120 req/min | `SIMULATED` |
| `/api/ingestion/governance`| `GET` | Ingestion state | None | Public | 120 req/min | `DERIVED` |
| `/api/ingestion/observations`| `GET`| Raw observation logs | `sourceId` | Public | 120 req/min | `OBSERVED` |
| `/api/ingestion/poll` | `POST` | Trigger feed poll | `providerId` | Public | 120 req/min | `DERIVED` |
| `/api/ingestion/provenance`| `GET` | Upstream feeds status| None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/ingestion/providers`| `GET` | Provider capability | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/shadow/audit` | `GET` | Shadow feed telemetry| None | Public | 120 req/min | `DERIVED` |
| `/api/shadow/corridors`| `GET` | Shadow corridor state| None | Public | 120 req/min | `DERIVED` |
| `/api/shadow/evaluation`| `GET`| Drift & latency audit| None | Public | 120 req/min | `DERIVED` |
| `/api/pilot/protocol` | `GET` | Controlled study doc | None | Public | 120 req/min | `VERIFIED_EXTERNAL` |
| `/api/reconstruction/pipeline`| `GET` | Network synthesis | None | Public | 120 req/min | `DERIVED` |
| `/api/health` | `GET` | Telemetry & datasets | None | Public | None | `DERIVED` |

---

## 2. RUNTIME INPUT VALIDATION & ADVERSARIAL TESTING

All mutating POST endpoints were tested against adversarial inputs in `scripts/test-phase20-governance.mjs` and `scripts/verify-platform.mjs`:

1. **Malformed JSON Payloads:**
   - Sending `POST /api/journey/plan` with unparseable string bodies immediately returns `HTTP 400 Bad Request` with structured error `{ success: false, error: "Invalid JSON format" }`.
   - Node.js runtime process does not crash or leak stack traces.
2. **Out-of-Bounds Geographic Coordinates:**
   - Coordinates outside Delhi ($28.40^\circ\text{ N} - 28.90^\circ\text{ N}$, $76.80^\circ\text{ E} - 77.45^\circ\text{ E}$) are caught by `validateStops()` and rejected.
3. **Negative & Out-of-Range Simulation Parameters:**
   - Negative bus increments or headways are clamped to valid physical intervals ($[0, 60]$ min).
4. **Zero Information Leakage:**
   - Database connection strings, server file paths, stack traces, and environment variables are completely suppressed in all error envelopes.

---

## 3. STRICT ABSENCE OF SILENT SYNTHETIC SUBSTITUTION

Under Section 5.3 of Phase 20:
- When an external upstream provider is unavailable (e.g. OTD GTFS-RT connection timeout), the API returns a structured degradation response:
  ```json
  {
    "success": false,
    "degraded": true,
    "evidenceClassification": "UNAVAILABLE",
    "error": "UPSTREAM_UNAVAILABLE",
    "message": "OTD GTFS-RT feed could not be reached. Telemetry is paused."
  }
  ```
- It **never** silently replaces the missing feed with a synthetic mock and marks it as "OBSERVED".

---

## 4. CONCLUSION

All 34 API endpoints adhere to strict validation contracts, predictable error envelopes, and honest evidence classifications.
