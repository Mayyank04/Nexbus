# NEXBUS — PHASE 10 SYSTEM LIMITATIONS & SCIENTIFIC BOUNDARIES
**Document ID:** `DOC-P10-LIMIT-001`  
**Milestone:** Phase 10 — Milestone 11 (`docs: complete phase 10 technical certification`)  
**Status:** Certified & Production Integrated  
**Operational Invariant:** Read-Only + Passive + Advisory (No physical signals, vehicle dispatch, or track interlocks)

---

## 1. Purpose & Scope of Disclosure

In compliance with the Phase 10 Non-Negotiable Safety and Data Principles, this document provides an honest, comprehensive disclosure of the technical, mathematical, and observational limitations of NEXBUS. 

A passing automated test suite proves software regression compliance; it **does not** prove complete real-world fidelity or physical infallibility. Every user, researcher, and institutional stakeholder must evaluate platform intelligence within these defined boundaries.

---

## 2. Upstream Data Source Limitations & Accessibility Audit

NEXBUS integrates six external data sources. Each carries structural limitations:

1. **Delhi Open Transit Data (OTD) — VehiclePositions (GTFS-Realtime):**
   - **Current Status:** `AUTH_REQUIRED`
   - **Limitation:** Upstream endpoint returns HTTP 401 Unauthorized without an approved, IP-whitelisted API key issued by the Delhi Transport Department. The public shadow ingestion pipeline runs on an empirical calibration model when live keys are absent.
2. **Delhi Open Transit Data (OTD) — TripUpdates (GTFS-Realtime):**
   - **Current Status:** `UNAVAILABLE`
   - **Limitation:** The official endpoint returns HTTP 404 Not Found. DTC real-time headway delay and trip cancellation feeds are currently not publicly accessible via this URL.
3. **OpenStreetMap Overpass Delhi Transit & Road Graph:**
   - **Current Status:** `DEGRADED` / Periodic Timeout
   - **Limitation:** Public Overpass API instances frequently exceed 6,000 ms response thresholds during peak query hours or return partial relations for complex transit corridors.
4. **CPCB / SAFAR Delhi Ambient Air Quality Feed:**
   - **Current Status:** `UNAVAILABLE`
   - **Limitation:** The direct portal path is protected behind Cloudflare anti-bot Web Application Firewalls (WAF) or has been migrated to dynamic session-based portals.
5. **DTC Electronic Ticketing Machine (ETM) Datasets:**
   - **Current Status:** `STATIC_SAMPLE` / `AVAILABLE`
   - **Limitation:** ETM data represents aggregated historical passenger boardings. It does not provide real-time tap-in/tap-out passenger counts or automated passenger counter (APC) sensor pings.

**Non-Substitution Policy:**
If an upstream data feed is offline or requires credentials, NEXBUS strictly marks the feed as `UNAVAILABLE` or `AUTH_REQUIRED`. The platform **never** manufactures artificial real-time GPS pings to simulate a live operational feed.

---

## 3. Mathematical Modeling & Simulation Boundaries

### 3.1 Network Topology Representation
- **Represented Graph Scope:** 67 nodes, 226 directed edges, 15 multimodal hubs.
- **Limitation:** While the represented graph is 100% connected with zero isolated nodes, it represents Delhi's **arterial trunk corridors** (DMRC Metro network, primary DTC Ring Road & Radial bus corridors, major rail terminals). It does **not** include every municipal feeder lane, informal e-rickshaw route, or local residential colony street.

### 3.2 Origin-Destination Demand Matrix ($T_{ij}$)
- **Model Type:** Doubly-Constrained Exponential Gravity Model ($\beta = 0.048$).
- **Limitation:** Trip generation estimates ($P_i$) and attractions ($A_j$) are calibrated using Census of India 2011 projected ward demographics and Delhi Master Plan 2041 employment estimates. They do not capture intraday micro-shocks (e.g. unannounced neighborhood market closures, localized police blockades).

### 3.3 Pedestrian Catchment Circuity ($\bar{\gamma} = 1.31$)
- **Limitation:** The average circuity factor $\bar{\gamma} = 1.31$ and permeability factor $\eta = 0.58$ represent city-scale empirical medians. Highly regular, planned sectors (e.g. Lutyens' Delhi or Rohini Sector grids) exhibit lower circuity ($\approx 1.18$), whereas unplanned organic settlements (e.g. Sangam Vihar, Burari) exhibit circuity exceeding $1.45$.

### 3.4 Disruption Resilience Simulation
- **Limitation:** Global efficiency loss $\Delta E/E_0$ and cascade spillover calculations assume instantaneous passenger awareness and rational deterministic rerouting. In real-world disruption events, commuter information latency and crowding anxiety create non-equilibrium panic surges at secondary stations.

### 3.5 Institutional Scenario Planning & Cost-Benefit Analysis (BCR)
- **Limitation:** Capital expenditure (CAPEX) and operating expenditure (OPEX) estimates are benchmark figures derived from standard CPWD/DMRC schedules of rates. They represent planning-level order-of-magnitude estimates and do not account for site-specific land acquisition litigation or geological tunneling anomalies.

---

## 4. Machine Learning & Epistemological Boundaries

- **Surrogate Classification:**
  The production Spatio-Temporal Graph Neural Network (`v1.4.2-stgnn`) is an offline calibrated neural surrogate. It was trained on historical validation slices and surveyed graph connectivity.
- **Correlation vs Causality:**
  SHAP feature importances measure statistical predictive association across the training distribution; they do not establish direct physical causality.
- **Extreme Domain Shift:**
  During unprecedented climate anomalies (e.g. 100-year Yamuna river deluge exceeding 208.66m), model epistemic uncertainty widens significantly.

---

## 5. Non-Intervention Safety Invariant

```
================================================================================
             MANDATORY PLATFORM NON-INTERVENTION SAFETY DIRECTIVE
================================================================================
NEXBUS is purely a PASSIVE, READ-ONLY analytical intelligence platform.

Under NO circumstances does NEXBUS:
1. Dispatch, schedule, or reroute public transport buses or trains.
2. Interface with railway signaling interlocks or automatic train supervision (ATS).
3. Actuate traffic light controllers, boom barriers, or variable message signs (VMS).
4. Issue mandatory operational directives to drivers, motormen, or controllers.

All recommendations, detour proposals, and disruption models are ADVISORY ONLY
and require independent field verification by certified human authorities.
================================================================================
```
