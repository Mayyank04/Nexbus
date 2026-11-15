# NEXBUS Phase 15 — Research Limitations & Epistemological Boundaries

**Document Reference**: `LIMITATIONS-PHASE15-2026-V1`  
**Purpose**: Explicit disclosure of all methodological, empirical, spatial, and institutional boundaries.  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Primary Epistemological Boundaries

### 1.1 Journey-Time Simulation Benchmark vs Physical Field Observations
- **Nature of Data**: The 240 matched runs used to evaluate journey-time predictions were generated via parametric Box-Muller Gaussian sampling calibrated on empirical transit distributions.
- **Limitation**: While mathematically rigorous and reproducible, these runs **do not represent 240 physical GPS probe vehicles** tracked on the road by physical surveyors.
- **Boundary**: All journey-time accuracy claims (e.g. 79.4% error reduction) must be understood as performance on a calibrated simulation benchmark.

### 1.2 Ethics Approval & Fieldwork Authorization Status
- **Status**: Protocol `IRB-2026-NEXBUS-MOB-004` represents an internal research protocol tracking code.
- **Limitation**: NEXBUS has not received a formal documentary clearance certificate from an accredited university or institutional research ethics committee.
- **Boundary**: The platform state is held in `READY_FOR_FIELDWORK` / `BLOCKED_PENDING_AUTHORIZATION`. No live human-subject or in-vivo field survey data has been claimed or ingested without authorization.

### 1.3 Machine Learning Target Variable & Metrics
- **Target Variable**: The reported holdout MAE of 1.21% and RMSE of 1.52% measure **Bus Passenger Crowding Occupancy Load Percentage (%)**, NOT physical vehicle travel time in minutes.
- **Limitation**: Evaluators must not conflate crowding occupancy accuracy with route transit delay.

---

## 2. Technical & Domain-Specific Boundaries

### 2.1 Headway Arrival Regimes
- **Random Arrival Assumption**: The Welding-Osuna formulation ($EWT = \frac{\sigma^2}{2\mu}$) strictly assumes Poisson/random passenger arrivals, valid only for high-frequency services ($\mu \le 12\text{ minutes}$).
- **Low-Frequency Services**: On outer suburban corridors, passenger arrival coordinates with published timetables. Applying random arrival models artificially inflates wait times. NEXBUS applies the Seddon-Day timetable model to bound wait penalties.

### 2.2 Screenline Counts & Temporal Age
- **Data Source**: Screenline count benchmarks originate from the RITES Comprehensive Transport Study 2021.
- **Limitation**: Counts are five years old and have been adjusted to 2026 using a compound annual growth factor (+3.2%/yr). Direct continuous physical counting stations are not yet available across all cordons.

### 2.3 Physical Accessibility Sample Size
- **Coverage**: Physical architectural audits were conducted at four strategic multimodal hubs (Kashmere Gate, AIIMS, INA, Hauz Khas).
- **Boundary**: The physical divergence observed between ground reality and digital OSM tags (e.g. Kashmere Gate elevator outage, AIIMS vendor encroachment) demonstrates the necessity of ground surveys, but **cannot be generalized** to estimate a city-wide elevator failure rate across all 256 Metro stations.

### 2.4 Environmental Accounting Scope
- **Boundary**: The 45.2% carbon abatement reflects a modeled Well-to-Wheel (WTW) lifecycle comparison based on the Central Electricity Authority Northern Grid emission factor ($0.716\text{ kg CO2 / kWh}$).
- **Limitation**: This does not represent directly measured ambient street-level PM2.5 or NO2 reductions, which depend on urban canyon geometry, wind dispersion, and non-transport emissions.

---

## 3. Operational Safety Boundary

As an absolute platform invariant:
```
READ-ONLY + PASSIVE + ADVISORY + NON-ACTUATING
```
NEXBUS issues zero operational instructions, dispatches zero vehicles, controls zero traffic signals, and interacts with zero physical railway interlocking equipment.
