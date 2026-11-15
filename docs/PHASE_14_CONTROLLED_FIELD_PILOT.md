# NEXBUS PHASE 14 — CONTROLLED REAL-WORLD FIELD PILOT PROTOCOL

**Protocol ID:** `PILOT-2026-DEL-AUROBINDO-01` (Phase 14 Refinement)  
**Corridor:** Aurobindo Marg / Janpath Central Axis (Mehrauli Terminal to Connaught Place Outer Circle)  
**Corridor Distance:** 14.8 km  
**Institutional Custodian:** NEXBUS Urban Mobility Research Consortium  
**Operational Status:** `PREPARED_FOR_FIELDWORK` (Institutional gate authorizations pending; zero false field claims)  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Executive Summary & Epistemological Stance

Phase 13 audit revealed that while the software architecture, data ingestion pipelines, and protocol configurations were fully functional, **zero verified ground-truth field observations had yet been gathered**, with the 188 recorded observations reflecting demonstration fixtures and calibrated simulations.

Phase 14 establishes a **rigorous, ethical, and statistically powered controlled field pilot plan**. NEXBUS marks the pilot status explicitly as **`PREPARED_FOR_FIELDWORK`**. The platform will never promote demonstration fixtures or simulation records to `VERIFIED_FIELD_OBSERVATION` until physical surveyors gather validated field records under approved Institutional Review Board (IRB) protocols.

---

## 2. Corridor Scope & 5 Physical Checkpoints

The Aurobindo Marg / Janpath transit axis connects southern NCT Delhi to the central business district:

| Checkpoint ID | Checkpoint Name | Coordinates (WGS84) | Modes Evaluated | Primary Survey Focus | Target Daily Samples |
|---|---|---|---|---|---|
| **CHK-01** | **AIIMS Multimodal Hub** | `28.5672° N, 77.2100° E` | Bus, Metro (Yellow), Walk, Auto | Transfer Friction, Concourse Flow | 48 |
| **CHK-02** | **IIT Delhi Main Gate / Hauz Khas** | `28.5450° N, 77.1925° E` | Bus, Metro (Magenta), Walk | Headway Variance, Dwell Times | 36 |
| **CHK-03** | **INA Market / Dilli Haat** | `28.5750° N, 77.2085° E` | Bus, Metro (Yellow/Pink), Walk | Passenger Boarding / Alighting | 40 |
| **CHK-04** | **Mehrauli Bus Terminal Gateway** | `28.5180° N, 77.1850° E` | Bus (DTC/Cluster), Auto, Walk | Terminal Dispatch Intervals | 36 |
| **CHK-05** | **Connaught Place Outer Circle / Shivaji** | `28.6315° N, 77.2167° E` | Bus, Metro (Blue/Yellow/Airport) | CBD Terminal Dwells, Line Delays | 40 |

**Total Daily Target Sample Size:** 200 observation events per operational survey day.

---

## 3. Core Research Questions

The field pilot investigates six empirical transportation questions:
1. **Journey-Time Accuracy:** What is the out-of-sample MAE and RMSE of NEXBUS travel time predictions against observed bus runs?
2. **Headway Regularity:** Does empirical bus headway variance along Aurobindo Marg adhere to $C_v \le 0.35$ or exhibit severe bunching ($C_v > 0.40$)?
3. **Temporal Stratification:** How significantly do journey times vary between AM Peak (08:00-10:30), Midday (12:00-14:00), PM Peak (17:00-19:30), and Off-Peak (20:30-22:30)?
4. **Day-of-Week Sensitivity:** What is the differential in traffic impedance and travel times between weekday commuter peaks and weekend leisure flows?
5. **Transfer Friction Drivers:** Which physical elements (horizontal walking distance, vertical stair levels, or road crossings) dominate interchange friction at AIIMS and INA?
6. **Pedestrian Model Fidelity:** Does the 14,820-segment OSM pedestrian walk network accurately predict real-world barrier encounters and wheelchair detours?

---

## 4. Ten Supported Observation Types

1. `SCHEDULED_VS_OBSERVED`: Scheduled vs actual arrival/departure time deviations.
2. `VEHICLE_AVL_PING`: Independent time-stamped location check of running buses.
3. `PASSENGER_BOARDING_TALLY`: Gate-level passenger counts boarding and alighting.
4. `DWELL_TIME_MEASUREMENT`: Door-open to door-close dwell duration (seconds).
5. `BUS_ARRIVAL_DEPARTURE`: Exact arrival and departure timestamps.
6. `HEADWAY_MEASUREMENT`: Inter-arrival headway between consecutive same-route vehicles.
7. `JOURNEY_TIME_RUN`: End-to-end or checkpoint-to-checkpoint transit run times.
8. `INTERCHANGE_TRANSFER_TIME`: Physical stop-to-platform walking and transfer durations.
9. `PEDESTRIAN_ROUTE_SURVEY`: Footpath continuity, curb cuts, and sidewalk widths.
10. `ACCESSIBILITY_BARRIER_OBSERVATION`: Physical barriers (broken curbs, missing elevators, stairs).

---

## 5. Counter Disaggregation & Epistemological Transparency

The research dashboard exposes separate counters:
- Planned Sessions: **24**
- Completed Sessions: **0** (Fieldwork in preparation)
- Submitted Records: **8**
- Valid Records: **8**
- Verified Field Observations: **0**
- Unverified Records: **4**
- Demonstration Fixtures: **4**
- Simulation Benchmark Records: **184**
- Rejected Records: **0**

Simulation records are never aggregated with verified physical field observations.
