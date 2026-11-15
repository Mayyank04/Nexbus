# NEXBUS — TRANSIT AUTHORITY DEMONSTRATION DOSSIER
**Document Reference:** NEXBUS-DEMO-AUROBINDO-V1  
**Demonstration Target:** Aurobindo Marg / Janpath Central Radial Corridor (`corridor-radial-south`)  
**Target Authority Context:** Delhi Transport Corporation (DTC) / Delhi Integrated Multi-Modal Transit System (DIMTS)  
**Legal Disclaimer:** Advisory demonstration scenario only. Does not imply an existing commercial contract or formal institutional endorsement.  

---

## 1. Executive Demonstration Problem Statement

Aurobindo Marg serves as the vital south-central transit artery connecting Saket District Centre, IIT Delhi, AIIMS Medical Interchange, and Connaught Place. During evening peak hours (17:00–20:00 IST), buses experience heavy bunching and significant speed degradation ($-36.6\%$), pushing cabin occupancy past $90\%$ capacity.

A transit authority scheduling department requires decision support to evaluate whether deploying **+12 dedicated electric low-floor feeder buses** and tightening scheduled headways from **6.2 minutes to 4.5 minutes** will alleviate peak congestion without creating depot queuing backlogs.

---

## 2. Step-by-Step Demonstration Workflow

```
1. Historical Demand Profile (12,500 Boardings Base)
   ↓
2. Current Telemetry Availability (OTD 401 Auth + Empirical Benchmarks)
   ↓
3. Corridor Kinematics (22.4 km/h median speed, Cv = 0.34)
   ↓
4. ST-GNN Forward Crowding Prediction (Next 30m: 71% load, 95% CI: [62%, 80%])
   ↓
5. Counterfactual Scenario Evaluation (+12 Buses, 4.5m Target Headway)
   ↓
6. Expected Passenger Waiting Time Impact (-48% reduction)
   ↓
7. Environmental & Carbon Abatement (52.4 Tons CO2 / Month)
   ↓
8. Operational Safety Bounds & Non-Intervention Verification
```

---

## 3. Measured Empirical Baseline vs. Hypothetical Counterfactual

| Dimension | Measured Empirical Baseline (Status: `Observed` / `Estimated`) | Counterfactual Scenario (Status: `Hypothetical Simulation`) | Net Operational Delta |
|---|---|---|---|
| **Fleet Allocation** | 18 standard buses | **30 buses** (+12 electric additions) | $+66.7\%$ fleet capacity |
| **Scheduled Headway** | 6.2 minutes | **4.5 minutes** | $-27.4\%$ headway reduction |
| **Headway Irregularity ($C_v$)** | 0.34 | **0.25** (with TSP / headway regulation) | $-26.5\%$ bunching variance |
| **Average Passenger Waiting Time** | 6.8 minutes | **3.5 minutes** (clamped to physical min) | **$-48.5\%$ waiting time** |
| **Induced Commuter Demand ($\epsilon=-0.38$)** | Baseline (84,000 PAX/day) | **+18.4% ridership shift** | $+15,450$ daily car/auto trips displaced |
| **Tailpipe $\text{CO}_2$ Avoided** | Regulatory baseline | **52.4 Tons $\text{CO}_2$ / Month** | Verified ARAI factor ($1.15\text{ kg/km}$) |
| **Tailpipe $\text{PM}_{2.5}$ Avoided** | Regulatory baseline | **67.2 kg $\text{PM}_{2.5}$ / Month** | CPCB urban standard ($1.48\text{ g/km}$) |

---

## 4. Uncertainty & Boundary Limitations

1. **Uncertainty Bounds:** Waiting time improvements assume consistent bus-lane clearance. If private vehicles encroach onto the bus lane at AIIMS Flyover, headway irregularity may revert to $C_v \ge 0.38$, dampening waiting time savings from $-48.5\%$ to $-32.0\%$.
2. **Terminal Turnaround Constraint:** Adding 12 buses requires Saket Terminal to accommodate an extra 3.2 bus departures per 15-minute slot. Depot managers must verify platform berth capacity before dispatching additional vehicles.
3. **Non-Intervention Affirmation:** NEXBUS outputs these deltas purely as an advisory decision support briefing. All vehicle allocations remain subject to human depot supervisor override.
