# NEXBUS — Municipal & Transit Authority Pilot Demonstration Package

**Prepared for:** Delhi Transport Corporation (DTC), DIMTS Ltd., and Department of Transport, Government of NCT of Delhi (GNCTD)  
**Document Classification:** Proposed Limited Pilot Specification & Stakeholder Briefing  

> [!IMPORTANT]
> **Status Notice:** This document outlines a *proposed* technical pilot specification. NEXBUS is currently operating as an independent, competition-grade research platform. No formal commercial partnership, procurement agreement, or binding governmental endorsement is currently active.

---

## 1. Executive Summary & Value Proposition

NEXBUS provides Delhi transit dispatchers, depot managers, and urban mobility planners with an evidence-backed intelligence cockpit. By fusing electronic ticketing records (ETM), vehicle location streams (AVL), and GTFS schedules, the platform provides:
1. **Ahead-of-Time Crowding Foresight:** 15-to-45-minute lookahead crowding warnings with 94% Bayesian credible intervals.
2. **Zero-Disruption Policy Counterfactuals:** Interactive scenario testing for electric fleet additions, headway compression, and signal priority before capital deployment.
3. **Multi-Criteria Commuter Routing:** Pareto routing distributing passenger load away from overcrowded bottlenecks.

---

## 2. Proposed Phase 1 Pilot Scope (Two Key Arterial Corridors)

To ensure manageable rollout, rapid verification, and zero operational risk, we propose a bounded 60-day pilot focused on two critical Delhi conduits:

### Pilot Conduit A: Aurobindo Marg / Janpath Central Axis (`corridor-radial-south`)
- **Length:** 22.4 km
- **Key Hubs:** Connaught Place, Janpath, Safdarjung, AIIMS, Saket
- **Pilot Objective:** Measure passenger wait-time compression and crowding alleviation via 12 scheduled electric bus additions during morning and evening rush hours.

### Pilot Conduit B: Mahatma Gandhi Ring Road Arterial (`corridor-ring-road`)
- **Length:** 47.8 km circular orbital spine
- **Key Hubs:** Kashmere Gate ISBT, Dhaula Kuan, AIIMS, Lajpat Nagar, Sarai Kale Khan
- **Pilot Objective:** Test automated dwell-time bottleneck alerts at Kashmere Gate and AIIMS to reduce vehicle bunching.

---

## 3. Data-Sharing & Technical Requirements

To execute the proposed pilot, the following integration feeds are required from transport authorities:

| Integration Stream | Data Format & Protocol | Update Frequency | Purpose in Pilot |
| :--- | :--- | :--- | :--- |
| **DTC ETM Ticket Transactions** | Secure SFTP / Kafka JSON Stream | Sub-minute batching | Real-time passenger boarding volume tracking |
| **Cluster & DTC AVL GPS Beacons** | HTTPS GTFS-RT VehiclePositions | 5-second streaming pings | Spatial map-matching & inter-stop velocity profiling |
| **Depot Electric Bus Readiness** | REST JSON or Daily CSV | 05:00 & 14:00 daily | Charger availability & battery state-of-charge constraints |

---

## 4. Example Policy Intervention Scenario

- **Intervention:** Inject 16 twelve-meter AC low-floor electric buses onto Mahatma Gandhi Ring Road between 16:00 and 20:00 with Transit Signal Priority (TSP) active at Dhaula Kuan and Moolchand.
- **Projected Mathematical Outcomes (via Little's Law & Elasticity):**
  - Average commuter wait time compressed by **-52%** (from 6.7 min down to 3.2 min).
  - Cabin overcrowding load factor reduced by **-62 percentage points** (from 146% crush load to 84% seated equilibrium).
  - Unallocated passengers left behind at curbs reduced by **-78%**.
  - Monthly avoided tailpipe emissions: **80.6 Tons of $\text{CO}_2$** and **1.0 Ton of $\text{NO}_x$**.

---

## 5. Demonstration Workflow for Stakeholders

1. **Step 1:** Launch the Executive Observatory at `/control`. Select "Weekday Commute" to inspect empirical ridership curves.
2. **Step 2:** Open the Scenario Simulation Lab at `/simulate`. Select "Mahatma Gandhi Ring Road Arterial".
3. **Step 3:** Adjust the "Additional Electric Buses" slider to `+16` and target headway to `5 min`. Toggle "Transit Signal Priority".
4. **Step 4:** Click "Run Simulation". Observe the 3D split-screen visual comparison: **Scenario A (Current Baseline)** vs **Scenario B (Proposed Intervention)**.
5. **Step 5:** Review the calculated impact cards, parametric sensitivity grid across demand elasticity ($\epsilon \in [-0.20, -0.65]$), and export the CSV/PDF briefing for review.
