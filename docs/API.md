# NEXBUS — API Specification & Integration Reference

All API endpoints in NEXBUS follow REST conventions, return standard JSON envelopes, and output typed epistemological annotations.

Base URL: `http://localhost:3000/api`

---

## 1. Network & Provenance Endpoints

### `GET /api/network/provenance`
Returns the centralized data provenance registry, publisher citations, epistemological breakdown, and automated geometric network sanity audit.

**Curl Example:**
```bash
curl -X GET "http://localhost:3000/api/network/provenance"
```

**Response Schema (Truncated):**
```json
{
  "success": true,
  "registrySummary": {
    "totalSources": 6,
    "publishers": ["Department of Transport, Govt of NCT of Delhi / IIIT-Delhi", "..."],
    "epistemologicalBreakdown": { "observed": 4, "estimated": 1, "predicted": 1, "hypothetical": 0 }
  },
  "networkValidation": {
    "isValid": true,
    "totalStopsValidated": 16,
    "totalRoutesValidated": 4,
    "totalCorridorsValidated": 4,
    "errorsCount": 0,
    "warningsCount": 0
  }
}
```

---

## 2. Transit Network (GTFS) Endpoints

### `GET /api/gtfs/stops`
Returns all verified bus stops with WGS84 coordinates, local 3D coordinates, footfall, and metro interchanges.

**Query Parameters:**
- `zone` (optional): `Central` | `South` | `North` | `East` | `West`

### `GET /api/gtfs/routes`
Returns all arterial routes with route numbers, frequency, first/last bus schedules, and stop sequences.

---

## 3. Machine Learning & Crowding Endpoints

### `GET /api/prediction/crowding`
Returns forward-looking passenger load percentages, Bayesian credible intervals (80% and 95%), and historical baselines for an arterial corridor.

**Query Parameters:**
- `corridorId` (string, required): e.g. `corridor-ring-road`
- `hour` (integer, optional): `0` to `23` (default `9`)
- `date` (string, optional): ISO Date `YYYY-MM-DD`

**Curl Example:**
```bash
curl -X GET "http://localhost:3000/api/prediction/crowding?corridorId=corridor-ring-road&hour=9"
```

### `GET /api/ml/evaluation`
Returns the empirical machine learning validation dossier, including train/validation/test holdout splits, baseline comparisons (Historical Average, AR-Ridge, ST-GNN), and disaggregated corridor error metrics.

---

## 4. Journey Planning Endpoint

### `POST /api/journey/plan`
Computes multi-criteria Pareto routes across Delhi's network, returning Fastest, Balanced, and Comfort First (Low Crowding) tiers.

**Request Payload:**
```json
{
  "originId": "stop-aiims",
  "destinationId": "stop-cp-regal",
  "date": "2026-11-15",
  "time": "09:15"
}
```

---

## 5. Counterfactual Simulation Endpoint

### `POST /api/simulation/evaluate`
Evaluates policy interventions (electric fleet additions, headway compression, transit signal priority) using Little's Law and transit elasticity equations.

**Request Payload:**
```json
{
  "corridorId": "corridor-ring-road",
  "additionalBuses": 12,
  "targetHeadwayMin": 6,
  "signalPriority": true,
  "elasticityCoefficient": -0.38,
  "depotAvailabilityRate": 0.85
}
```

---

## 6. Executive Analytics & CSV Export Endpoints

### `GET /api/analytics/summary`
Returns high-level authority observatory metrics, weekday vs weekend temporal load profiles, corridor rankings, and telemetry pipeline health.

### `GET /api/analytics/export`
Exports machine-readable CSV files for transport planners.
- `?type=corridors`: Corridor capacity and punctuality rankings.
- `?type=hourly`: 24-hour passenger load and demand profiles.
- `?type=ml_validation`: Disaggregated ML evaluation metrics by corridor.
