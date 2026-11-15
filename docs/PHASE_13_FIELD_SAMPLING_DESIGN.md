# NEXBUS Phase 13 — Field Sampling Design, Statistical Power & Protocol Framework

**Protocol Identifier:** PILOT-2026-DEL-AUROBINDO-01  
**Study Corridor:** Aurobindo Marg / Janpath Central Arterial Axis (14.8 km)  
**Corridor Alignment:** Mehrauli Bus Terminal (Qutub Minar) $\leftrightarrow$ Connaught Place (Regal / Shivaji Stadium)  
**Target Sample Size:** $N = 240$ valid observations (Exit Criteria: $N \ge 200$)  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Study Corridor Selection Rationale

The Aurobindo Marg / Janpath arterial corridor represents one of the most critical multimodal passenger corridors in the National Capital Territory of Delhi.

### 1.1 Corridor Attributes
- **Total Length:** 14.8 kilometers of arterial roadway.
- **Surface Bus Operations:** DTC and DIMTS trunk routes, prominently Route 502 (Mehrauli $\to$ Mori Gate), Route 505 (Mehrauli $\to$ New Delhi Railway Station), Route 534 (Mehrauli $\to$ Anand Vihar ISBT), and Ring Road interchange feeds.
- **Parallel Rapid Transit:** DMRC Yellow Line (Samaypur Badli $\leftrightarrow$ Millennium City Centre Gurugram) running subterranean directly along the axis, with key transfer stations at Qutub Minar, Saket, Malviya Nagar, Hauz Khas, Green Park, AIIMS, INA, Jor Bagh, and Patel Chowk.
- **Estimated Daily Multimodal Corridor Ridership:** ~142,000 passenger trips per day.
- **Functional Diversity:** Traverses major institutional hospitals (AIIMS, Safdarjung), premier academic institutes (IIT Delhi, NIFT), commercial centers (INA Market, Dilli Haat, Connaught Place), and heritage residential nodes (Mehrauli, Hauz Khas Village).

### 1.2 Justification for Pilot Selection
This corridor provides an ideal empirical testbed:
1. Significant interaction between surface bus routes and high-capacity metro rail.
2. Distinct traffic regimes: signal-controlled intersections, dedicated subway underpasses, and flyover merges.
3. Pronounced peak-hour congestion with high headway variance ($C_v > 0.30$).
4. Substantial pedestrian transfer volumes at multimodal hubs.

---

## 2. Checkpoint Geography & Spatial Alignment

Four physical observation checkpoints have been designated along the corridor:

```
[CHK-04: Mehrauli Terminal] (km 0.0)
             │
             ▼ 4.6 km
[CHK-02: IIT Delhi Main Gate] (km 4.6)
             │
             ▼ 3.4 km
[CHK-01: AIIMS Interchange Hub] (km 8.0)
             │
             ▼ 1.2 km
[CHK-03: INA / Dilli Haat Hub] (km 9.2)
             │
             ▼ 5.6 km
[Connaught Place / Regal Hub] (km 14.8)
```

### Table 1: Detailed Checkpoint Metadata
| Checkpoint ID | Stop Name & Code | WGS84 Coordinates | Physical Mode Configuration | Survey Primary Focus | Daily Target Samples |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CHK-01** | AIIMS Multimodal Interchange (`stop-aiims-gate2`) | $28.5672^\circ\text{N}, 77.2100^\circ\text{E}$ | Bus Bay + DMRC Yellow Line Gate 2 + Subterranean Pedestrian Subway | Transfer Friction, Passenger Boardings, Dwell Time | 48 |
| **CHK-02** | IIT Delhi Main Gate / Hauz Khas Crossing (`stop-iit-gate`) | $28.5450^\circ\text{N}, 77.1925^\circ\text{E}$ | Curbside Bus Stop + DMRC Magenta Line interchange proximity | Dwell Time Distribution, Headway Adherence | 36 |
| **CHK-03** | INA Market / Dilli Haat (`stop-ina-colony`) | $28.5750^\circ\text{N}, 77.2085^\circ\text{E}$ | Surface Bus Bay + DMRC Yellow/Pink Dual Interchange | Passenger Boarding Tally, Crowding LOS | 40 |
| **CHK-04** | Mehrauli Bus Terminal Gateway (`stop-mehrauli-term`) | $28.5180^\circ\text{N}, 77.1850^\circ\text{E}$ | Off-street Terminal Origin / Dispatch Layover | Terminal Departure Headway Adherence, Initial Dwell | 36 |

---

## 3. Stratified Sampling Architecture

To eliminate sampling bias and capture temporal demand dynamics, the field campaign employs a **three-dimensional stratification design**:

### 3.1 Temporal Stratification (Shift Schedule)
Observations are partitioned into three non-overlapping operational time windows:

1. **Morning Peak Period (SLOT-AM-PEAK):**
   - Window: `08:00 - 10:30 IST` (2.5 hours)
   - Traffic Regime: Heavy inbound radial flow toward Central Secretariat & Connaught Place.
   - Assigned Surveyors: 8 researchers (2 per checkpoint).
   - Expected Bus Frequency: 24 buses/hour per direction across all trunk routes.
   - Target Observations: 48 samples/day.

2. **Midday Inter-Peak Period (SLOT-MIDDAY):**
   - Window: `12:00 - 14:00 IST` (2.0 hours)
   - Traffic Regime: Moderate uncongested/flowing traffic; baseline transit headway schedule.
   - Assigned Surveyors: 4 researchers (1 per checkpoint).
   - Expected Bus Frequency: 14 buses/hour.
   - Target Observations: 24 samples/day.

3. **Evening Peak Period (SLOT-PM-PEAK):**
   - Window: `17:00 - 19:30 IST` (2.5 hours)
   - Traffic Regime: Heavy outbound flow toward South Delhi residential colonies and Gurugram.
   - Assigned Surveyors: 8 researchers (2 per checkpoint).
   - Expected Bus Frequency: 22 buses/hour.
   - Target Observations: 48 samples/day.

### 3.2 Day-of-Week Stratification
- **Midweek Core (Tuesday – Thursday):** Represents steady-state commuter demand; minimum 60% of total sample target.
- **Shoulder Weekdays (Monday, Friday):** Captures weekend transition dynamics and irregular peak spikes; 20% of sample target.
- **Weekend (Saturday):** Captures non-work commercial/recreational trips to INA Market and Connaught Place; 20% of sample target.

### 3.3 Environmental & Weather Stratification
Observations are tagged under four statutory meteorological regimes:
1. `CLEAR`: Standard visibility, ambient temperature $20^\circ\text{C} - 32^\circ\text{C}$.
2. `HEATWAVE`: Ambient temperature $\ge 40^\circ\text{C}$ (impacting passenger walking speed and bus engine cooling).
3. `RAIN_WATERLOGGED`: Monsoon rain event inducing kerbside waterlogging and speed reductions.
4. `HAZE_POLLUTION`: Severe smog ($\text{AQI} \ge 350$, PM2.5 $\ge 200\,\mu\text{g/m}^3$) reducing pedestrian walking willingness.

---

## 4. Statistical Power & Sample Size Determination

### 4.1 Headway Adherence & Coefficient of Variation ($C_v$)
The primary statistical objective is estimating the empirical headway coefficient of variation:
$$C_v = \frac{\sigma_h}{\mu_h}$$
To achieve an estimation margin of error $E \le 0.05$ (5% relative precision) around the true mean headway $\mu_h \approx 8.5\text{ minutes}$ with standard deviation $\sigma_h \approx 3.2\text{ minutes}$ at a 95% confidence level ($\alpha = 0.05, z_{\alpha/2} = 1.96$):

$$N \ge \left( \frac{z_{\alpha/2} \cdot \sigma_h}{E \cdot \mu_h} \right)^2 = \left( \frac{1.96 \cdot 3.2}{0.05 \cdot 8.5} \right)^2 = \left( \frac{6.272}{0.425} \right)^2 = (14.757)^2 \approx 217.8$$

Rounding up, a minimum sample size of **$N = 218$ valid vehicle arrival observations** is required across the corridor. The pilot target of **$N = 240$** provides a 10% buffer against invalid or missing observations.

### 4.2 Dwell Time Sample Size
For bus dwell time measurements $\tau_{\text{dwell}}$ with historical standard deviation $\sigma_{\text{dwell}} \approx 14\text{ seconds}$, to achieve an absolute error margin $E \le 2.0\text{ seconds}$ at 95% confidence:

$$N_{\text{dwell}} \ge \left( \frac{1.96 \cdot 14}{2.0} \right)^2 = (13.72)^2 \approx 188.2 \implies N \ge 189\text{ observations}$$

The target of 240 samples satisfies both statistical criteria with statistical power $(1 - \beta) > 0.90$.

---

## 5. Exit Criteria & Stopping Rules

The research pilot campaign will be formally certified as complete when the following objective conditions are satisfied:
1. **Minimum Sample Size:** $\ge 200$ fully verified field observations successfully recorded and ingested.
2. **Geographic Distribution:** Minimum 40 valid samples recorded at each of the 4 checkpoints.
3. **Temporal Coverage:** Minimum 60 peak morning, 30 midday, and 60 peak evening samples.
4. **Data Integrity:** 100% cryptographic SHA-256 digest verification.
5. **Zero PII Incidents:** Zero privacy breaches recorded during the campaign.
6. **Correlation Target:** Empirical headway correlation $r \ge 0.85$ achieved between scheduled and observed arrivals.
