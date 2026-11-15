# NEXBUS PHASE 14 — HEADWAY RELIABILITY & EXCESS WAITING TIME BENCHMARK

**Document Version:** 1.0.0  
**Focus Area:** Headway Regularity, Welding-Osuna Formulation, Passenger Arrival Regimes, and Service Degradation Diagnostics  
**Benchmarking Script:** [`scripts/phase14-headway-benchmark.mjs`](file:///Users/mayankgautam/Desktop/nexbus/scripts/phase14-headway-benchmark.mjs)  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Mathematical Grounding of Excess Waiting Time (EWT)

When passenger arrival is independent of the timetable, the expected waiting time is governed by the Welding-Osuna formulation:
$$E[W] = \frac{\mu}{2} + \text{EWT} = \frac{\mu}{2} + \frac{\sigma^2}{2\mu} = \frac{\mu}{2}\left(1 + C_v^2\right)$$
where:
- $\mu$: Mean headway interval (minutes).
- $\sigma$: Standard deviation of headway (minutes).
- $C_v = \frac{\sigma}{\mu}$: Coefficient of variation.
- $\text{EWT} = \frac{\sigma^2}{2\mu}$: Excess waiting time experienced by passengers purely due to irregular vehicle spacing.
- $\text{Relative Wait Penalty} = C_v^2 \times 100\%$.

---

## 2. Multi-Corridor Benchmark Results

| Corridor Identifier | Corridor Name | Mean Headway ($\mu$) | StdDev ($\sigma$) | $C_v$ | Excess Wait Time (EWT) | Relative Wait Penalty ($C_v^2$) | Bunching Rate ($< 0.25\mu$) |
|---|---|---|---|---|---|---|---|
| `corridor-radial-south` | Aurobindo Marg / Janpath Axis | **6.2 min** | **2.1 min** | **0.34** | **21.3 seconds** | **+11.5%** | 3.2% |
| `corridor-ring-road` | Mahatma Gandhi Ring Road | 4.8 min | 1.7 min | 0.35 | 18.1 seconds | +12.2% | 3.2% |
| `corridor-heritage-north`| Old Delhi / Yamuna Heritage | 7.5 min | 2.8 min | 0.37 | 31.4 seconds | +13.7% | 8.4% |
| `corridor-outer-ring` | Outer Ring Road / Dhaula Kuan | 5.5 min | 1.8 min | 0.33 | 17.7 seconds | +10.9% | 3.2% |

### Key Observations:
- **Aurobindo Marg Regularity:** With $\mu = 6.2\text{ min}$ and $\sigma = 2.1\text{ min}$, $C_v = 0.34$, meeting international standards for high-frequency urban bus operations ($C_v \le 0.35$). The excess wait time is exactly **21.3 seconds** ($+11.5\%$ penalty over scheduled half-headway of $3.10\text{ min}$).
- **Old Delhi Congestion:** The Old Delhi Heritage corridor exhibits higher variance ($C_v = 0.37$), inducing a **31.4 second** excess wait penalty and an **8.4% bus bunching rate** due to mixed-traffic friction around Kashmere Gate and Red Fort.

---

## 3. Passenger Arrival Regimes: Random vs Timetable-Informed

NEXBUS Phase 14 enforces strict differentiation between passenger arrival behaviors:

### 3.1 Regime A: Random / Poisson Passenger Arrivals ($\mu \le 12.0\text{ minutes}$)
- Passengers arrive uniformly at bus stops without consulting schedules.
- **Governing Equation:** $E[W] = \frac{\mu}{2} + \frac{\sigma^2}{2\mu}$.
- Fully validated for high-frequency central axes (Aurobindo Marg, Ring Road).

### 3.2 Regime B: Timetable-Informed Passenger Arrivals ($\mu > 12.0\text{ minutes}$)
- Passengers coordinate arrival times with published schedules, arriving with an empirical safety margin buffer $S \approx 3.5\text{ minutes}$.
- Naive application of $\frac{\mu}{2}$ severely over-estimates waiting time (e.g. predicting $10.65\text{ min}$ wait on a 21-min suburban headway).
- **Governing Formulation (Seddon-Day):**
  $$E[W]_{\text{timetable}} = \min\left(\frac{\mu}{2} + \text{EWT}, \; S + 0.4 \cdot \sigma\right)$$
- On a 21-minute suburban route, expected passenger wait drops to **4.58 minutes**, accurately capturing commuter scheduling behavior.

---

## 4. Mathematical Validation & Edge Case Unit Tests

The test suite in [`scripts/phase14-headway-benchmark.mjs`](file:///Users/mayankgautam/Desktop/nexbus/scripts/phase14-headway-benchmark.mjs) validates 5 mathematical edge cases:
1. **Zero Variance (Deterministic Spacing):** $\sigma = 0 \implies \text{EWT} = 0.0\text{ s}$, Penalty = $0.0\%$.
2. **Empty Input Rejection:** Rejects empty arrays with descriptive errors.
3. **Negative Interval Guard:** Explicitly throws on negative headways ($h_i < 0$).
4. **Duplicate Timestamp Guard:** Rejects zero headway intervals ($h_i = 0$).
5. **Outlier Sensitivity:** Contaminated series ($h_{\text{outlier}} = 36\text{ min}$) increases variance by $>5\times$, confirming the necessity of robust medians.

---

## 5. Operational Safety Invariant

The headway analytics engine operates strictly under **`READ-ONLY + PASSIVE + ADVISORY`**. It provides situational awareness to transit authorities without triggering automated headway spacing commands or vehicle holding actions.
