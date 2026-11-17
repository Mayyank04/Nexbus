# NEXBUS PHASE 18 — FEATURE FUNCTIONALITY MATRIX

**Product:** NEXBUS — Delhi Urban Mobility Intelligence Platform  
**Audit Scope:** Complete End-to-End User Journeys, APIs, Interactive Controls, and Error States  
**Status:** Certified Operational  

---

## 1. User Surface Matrix

| Route | Primary Archetype | Key Interactive Capabilities | Data Envelopes & Dependencies | Error Boundaries & Fallbacks |
|---|---|---|---|---|
| `/` | Editorial Monograph / Overview | Interactive route preview, live city stat cards, corridor focus switcher, direct deep links to simulation & twin. | `fetchAnalyticsSummary`, `DELHI_CORRIDORS` | SSR skeleton cards, error boundary with retry, static geometry fallback. |
| `/twin` | Spatial Digital Twin (Dual Mode) | **Mode A (Explore Delhi):** 6-step guided walkthrough, friendly bus symbols, big stop badges, simplified paths.<br>**Mode B (Advanced Analysis):** 11 GIS layers, 3D orbit/pan/zoom, 2D Nadir toggle, time-of-day lighting (6:00 to 22:00 IST), real-time vehicle raycasting, corridor inspect drawer. | `useDigitalTwin`, `DELHI_CORRIDORS`, `DELHI_STOPS`, `/api/prediction/crowding`, `/api/shadow/corridors` | 2D SVG vector fallback, WebGL context loss recovery, DPR clamp (max 2), reduced motion support. |
| `/journey` | Passenger Itinerary Optimizer | Origin/Destination autocomplete, 3 route criteria (Fastest, Balanced, Comfort First), Step-Free / Wheelchair accessibility toggle, commuter profile, stop swap, transfer friction breakdown. | `useMultimodalPlanner`, `/api/journey/plan`, `/api/multimodal/plan` | Client-side input validation, no-route-found informative card, step-by-step fallback guide. |
| `/simulate` | Counterfactual Policy Laboratory | Corridor selection, additional EV buses slider (0–20), headway target slider (2–20 min), signal priority toggle, time window (AM Peak / Midday / PM Peak / Night), Little's Law wait time impact, WTW CO₂ emissions reduction calculation. | `useSimulation`, `/api/simulation/evaluate`, `/api/simulation/scenarios` | Parameter bounds clamp, parameter reset button, formula documentation drawer. |
| `/control` | Municipal Executive Observatory | Temporal demand curve (Weekday vs Weekend), corridor dwell bottlenecks, system telemetry (AVL sync, GTFS-RT latency, ETM sync), CSV export for municipal planners, Phase 12-15 research validation panels. | `/api/analytics/summary`, `/api/analytics/export`, `/api/ingestion/governance`, `/api/shadow/audit` | Offline caching, CSV stream error handling, live status fallback indicators. |
| `/methodology` | Epistemological Dossier | 8-stage data pipeline monograph, mathematical formulation inspector (LaTeX equations), Observed vs Estimated vs Predicted vs Simulated epistemic classification. | Static epistemological model, benchmark registry | Pure client render, full keyboard accessibility, printable formatting. |
| `/about` | Civic Mission & Manifesto | Design philosophy monograph, anti-slop principles, open transit data governance statement, safety invariants. | Static monograph | Zero dependency, zero layout shift, instant load. |
| `/terms` | Legal & Governance Protocol | Invariant specification (`READ-ONLY + PASSIVE + ADVISORY`), API fair usage, open government data licensing, limitation of liability. | Static legal documentation | Clean typography, mobile responsive, print friendly. |
| `/privacy` | Privacy & Commuter Protection | Non-collection of PII, no GPS tracking of commuters, smartcard ticket aggregation guarantees, cookie-free analytics policy. | Static privacy documentation | Clean typography, mobile responsive, print friendly. |

---

## 2. API Endpoint Inventory & Protocol Conformance

All 28 API routes conform to the standardized response envelope:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-11-17T17:05:00.000Z",
    "version": "1.0",
    "cached": false
  }
}
```

| Route Family | Endpoint | Method | Key Parameters | Response Data | Error Code Handling |
|---|---|---|---|---|---|
| **GTFS** | `/api/gtfs/routes` | `GET` | None | 4 major arterial corridors, geometry, headway | 500 Generic Error |
| **GTFS** | `/api/gtfs/stops` | `GET` | `corridorId` (optional) | Array of bus stops with WGS84 coordinates | 400 Invalid ID |
| **Prediction** | `/api/prediction/crowding` | `GET` | `corridorId`, `timeHour` | Occupancy %, Bayesian 95% Credible Interval, confidence | 400 Missing Param |
| **Journey** | `/api/journey/plan` | `POST` | `originId`, `destinationId`, `preference` | 3 itineraries (Fastest, Balanced, Comfort), transfer nodes | 400 Malformed JSON |
| **Multimodal** | `/api/multimodal/plan` | `POST` | `originId`, `destinationId`, `requireStepFree` | Metro + Bus + Walk itinerary with interchange friction score | 400 Invalid Nodes |
| **Simulation** | `/api/simulation/evaluate` | `POST` | `corridorId`, `additionalBuses`, `targetHeadway` | Wait time delta, CO₂ delta, passenger throughput, Little's Law metrics | 422 Invalid Bounds |
| **Analytics** | `/api/analytics/summary` | `GET` | None | Network metrics, demand curves, bottlenecks | 500 Server Error |
| **Analytics** | `/api/analytics/export` | `GET` | `type=corridors\|stops` | Formatted RFC 4180 CSV attachment | 400 Invalid Type |
| **Ingestion** | `/api/ingestion/governance` | `GET` | None | 8 provider sync statuses, drift scores, freshness lag | 500 Ingestion Error |
| **Shadow** | `/api/shadow/corridors` | `GET` | None | Corridor real-time state, observed vs scheduled | 500 Shadow Error |
| **ML** | `/api/ml/forecast` | `POST` | `corridorId`, `horizonMinutes` | ST-GNN point forecast, Bayesian credible interval | 400 Missing Param |
| **Health** | `/api/health` | `GET` | None | System uptime, dataset checksums, memory usage | 503 Unhealthy |

---

## 3. Interactive Component Integrity

- **`StopAutocomplete`:**
  - Debounced input search across 256+ verified Delhi stops.
  - Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape).
  - Clear button and active selection badge.
  - Zero unhandled exceptions on empty queries.
- **`DelhiCityCanvas`:**
  - OrbitControls-style custom drag-to-rotate, pinch/wheel-to-zoom.
  - Smooth camera lerping with damped interpolation ($0.045$).
  - Raycaster click selection on bus stops and vehicles.
  - Full DPR clamping (`Math.min(window.devicePixelRatio, 2)`) to prevent mobile GPU throttling.
  - WebGL context loss detection and restoration listeners.
- **`Simulation Sliders`:**
  - Accessible range inputs with live numerical readout.
  - Discrete step increments (1 bus, 0.5 min headway).
  - Automatic debounce on counterfactual computation to prevent CPU spike.
