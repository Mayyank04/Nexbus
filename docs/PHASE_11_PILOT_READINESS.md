# PHASE 11 — INSTITUTIONAL PILOT READINESS & STAKEHOLDER DEMO PROTOCOL

**Platform:** NEXBUS — Urban Mobility Intelligence & Decision-Support Platform  
**Target City:** National Capital Territory of Delhi (NCT)  
**Pilot Standard:** Institutional Demonstration & Advisory Decision-Support Protocol  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. EXECUTIVE MANDATE & SAFETY INVARIANT

> [!CAUTION]
> **OPERATIONAL SAFETY INVARIANT:**  
> NEXBUS operates strictly as a **READ-ONLY, PASSIVE, and ADVISORY** decision-support system.  
> The platform is explicitly prohibited from:
> 1. Dispatching buses, trains, or paratransit vehicles.
> 2. Actuating or preempting traffic signals.
> 3. Modifying railway interlocking, signal aspects, or train headways.
> 4. Issuing binding operational instructions to drivers, station controllers, or dispatchers.
> 
> All recommendations, predictive alerts, and scenario simulations require human operational review before any real-world executive action.

---

## 2. FOUR INSTITUTIONAL STAKEHOLDER WORKFLOWS

NEXBUS provides tailored analytical workflows designed for distinct urban transport stakeholders:

### 2.1 Transport Researcher & Data Scientist Workflow
- **Network Topology Audit:** Inspect the curated arterial backbone graph (67 nodes, 226 edges, 15 interchange hubs) with small-world metrics (diameter = 8 hops, average path length = 3.92 hops).
- **Origin-Destination Demand Modeling:** Access the doubly-constrained Furness IPF balanced matrix, verifying system conservation ($\sum P_i = \sum D_j = \sum T_{ij} = 331,967\text{ pax/hr}$) and spatial Gini concentration (0.28).
- **Machine Learning Reproducibility:** Inspect the model registry leaderboard comparing ST-GNN v1.4.2 against Historical Average and AR-Ridge benchmarks; execute automated verification scripts (`scripts/reproduce-ml-eval.mjs`).
- **Research Data Export:** Download sanitized corridor metrics and shadow audit logs as structured CSVs.

### 2.2 Urban Transport Planner Workflow
- **Accessibility & Equity Isochrones:** Review population-weighted accessibility across all 11 NCT districts, comparing 15, 30, 45, and 60-minute travel-time opportunities.
- **Pedestrian Circuity Analysis:** Evaluate the effect of street circuity ($\bar{\gamma} = 1.31$) on first/last-mile transit catchments.
- **Capital Scenario Planning:** Compare 4 priority interventions (BRT, elevated skywalks, headway synchronization, electric feeder mini-buses) evaluated using discounted cash flow Portfolio BCR (**4.07x**, NPV = ₹7,911.6 Cr).
- **Spatial Equity Barometers:** Audit the 1.82x quintile accessibility gap and review identified transit deserts (Sangam Vihar, Burari, Narela).

### 2.3 Transport Authority Operations (DTC / DMRC / DIMTS) Workflow
- **Real-Time Shadow Operations Monitoring:** Observe fleet operational indicators, corridor speeds, and delay indices across arterial rights-of-way.
- **Interchange Friction & Congestion:** Track passenger density and Fruin Level-of-Service across 15 high-volume transfer hubs (e.g. Kashmere Gate, Rajiv Chowk, AIIMS).
- **Disruption Stress Testing:** Evaluate hypothetical disruption scenarios (e.g. Ring Road waterlogging, Yellow Line track maintenance) to simulate passenger cascade rerouting.
- **Data Quality & Provider Reliability:** Audit active provider status, 12 ingestion failure categories, and exponential backoff retry states.

### 2.4 Commuter & Passenger Workflow
- **Multi-Criteria Trip Planning:** Generate journey itineraries across 3 distinct traveler preference tiers: *Fastest*, *Balanced*, and *Comfort First*.
- **Transfer Effort & Crowding Alerts:** Review walking transfer durations, level changes, and predicted vehicle occupancy prior to boarding.
- **Universal Accessibility Transparency:** Check step-free accessibility status (elevators, escalators, and accessible bus shelters) at each journey leg.

---

## 3. CONTROLLED INSTITUTIONAL DEMONSTRATION PRESETS

To ensure safe, reproducible demonstrations during prospective institutional pilot presentations without fabricating live telemetry, the platform integrates three pre-configured demonstration presets:

### Preset A: AM Peak Radial Commuter Surge
- **Scope:** Morning peak commuter flows from East Delhi / trans-Yamuna (`Z11`) and South Delhi (`Z03`) to Central Government & Commercial districts (`Z01`).
- **Demonstrated Engine:** Doubly-constrained Furness gravity distribution showing directional peak bias ($1.45\times$) and $331,967\text{ trips/hr}$ across arterial corridors.
- **Data Classification:** `DERIVED` / `ESTIMATED`.

### Preset B: Mahatma Gandhi Ring Road Monsoon Disruption
- **Scope:** Heavy rainfall causing severe waterlogging along the South Ring Road corridor between Dhaula Kuan and AIIMS.
- **Demonstrated Engine:** Resilience stress testing showing arterial bus speed dropping from $22\text{ km/h}$ to $14\text{ km/h}$, causing a $+16.8\text{ minute}$ delay and triggering a $28.4\%$ passenger diversion onto the Pink and Yellow metro lines, driving Kashmere Gate interchange concourse to Fruin LOS F.
- **Data Classification:** `SIMULATED`.

### Preset C: Peripheral Transit Desert Equity Intervention
- **Scope:** Deployment of 500 electric low-floor mini-feeder buses connecting transit deserts in North West (Burari, Narela) and South (Sangam Vihar) to nearest metro stations.
- **Demonstrated Engine:** Capital scenario appraisal showing $18.2\text{ min}$ average travel time reduction for 780,000 peripheral residents, achieving an equity score of 96 and an individual BCR of 4.62x.
- **Data Classification:** `SIMULATED`.

---

## 4. DEPLOYMENT & INFRASTRUCTURE READINESS

NEXBUS is architected for zero-friction demonstration deployment:
- **Runtime Environment:** Node.js 20+ / Next.js 16 (App Router with Turbopack).
- **Memory Footprint:** $< 512\text{ MB}$ RSS during peak analytical loads.
- **API Response Latency:** Mean $< 15\text{ ms}$, 99th percentile $< 40\text{ ms}$.
- **Zero Unauthenticated External Dependencies:** All fallback fixtures are pre-compiled and cryptographically validated, allowing 100% offline demonstration in air-gapped institutional environments.
