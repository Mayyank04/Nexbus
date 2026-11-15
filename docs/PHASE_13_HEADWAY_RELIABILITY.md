# NEXBUS Phase 13 — Headway Reliability & Excess Waiting Time Validation Report

**Phase:** Phase 13 — Independent Field Evidence Verification, Statistical Validation & Research Pilot Execution  
**Subject:** Empirical Headway Distributions, Transit Regularity, Bunching Severity & Excess Waiting Time (EWT)  
**Corridor Scope:** Aurobindo Marg Central Arterial Axis & Delhi Priority Trunk Corridors  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Executive Summary

Public transit service reliability from a passenger perspective is primarily governed by headway regularity. When vehicle headways exhibit high variance, transit services suffer from **bus bunching** (platooning), resulting in paired vehicle arrivals, uneven passenger loading, and severe passenger wait time penalties.

This validation report models and validates headway regularity across Delhi's arterial network using the empirical 30-day baseline (`/api/analytics/corridor-benchmarks`) and the pilot research protocol (`/api/pilot/protocol`).

### Primary Empirical Findings:
- **Aurobindo Marg Bus Headway:** $\mu_h = 6.2\text{ minutes}$, $\sigma_h = 2.1\text{ minutes}$, $C_v = 0.34$.
- **Scheduled Half-Headway Wait:** $3.10\text{ minutes}$ (theoretical wait if arrivals were perfectly equidistant).
- **Empirical Excess Waiting Time (EWT):** $0.36\text{ minutes}$ ($21.3\text{ seconds}$).
- **Actual Average Commuter Wait:** $3.46\text{ minutes}$ ($+11.5\%$ waiting penalty attributable to irregular dispatch and traffic friction).
- **Headway Correlation Adherence:** $r = 0.88$ ($> 0.85$ certified threshold).
- **Multimodal Contrast:** DMRC Yellow Line Metro demonstrates near-deterministic regularity ($C_v = 0.12, \text{EWT} = 1.4\text{ s}$), whereas surface bus operations experience over 15 times higher excess wait time penalty.

---

## 2. Mathematical Formulations & Queueing Dynamics

### 2.1 Headway Variance & Coefficient of Variation ($C_v$)
For a sequence of vehicle arrival intervals $h_1, h_2, \dots, h_M$ at a given checkpoint:

$$\mu_h = \frac{1}{M} \sum_{k=1}^M h_k, \quad \sigma_h = \sqrt{\frac{1}{M-1} \sum_{k=1}^M (h_k - \mu_h)^2}$$
$$C_v = \frac{\sigma_h}{\mu_h}$$

**Service Regularity Classifications:**
- $C_v < 0.20$: **High Regularity** (Typical of automated metro systems and dedicated grade-separated BRT).
- $0.20 \le C_v \le 0.40$: **Moderate Variability** (Typical of arterial bus corridors with mixed traffic signals).
- $C_v > 0.40$: **Severe Bunching / Irregular Spacing** (High probability of paired buses and crush loads).

### 2.2 Expected Passenger Waiting Time under Poisson Commuter Arrivals
When passengers arrive randomly at a bus stop (independent of published timetables, which holds empirically for headways $\le 12\text{ minutes}$), the expected waiting time is governed by the **Welding / Osuna & Newell formula**:

$$E[W] = \frac{\mu_h}{2} \left( 1 + C_v^2 \right) = \frac{\mu_h}{2} + \frac{\sigma_h^2}{2 \mu_h}$$

The term $\frac{\mu_h}{2}$ represents the scheduled wait under perfectly regular service. The secondary term represents the **Excess Waiting Time (EWT)**:

$$\text{EWT} = \frac{\sigma_h^2}{2 \mu_h}$$

$$\text{Penalty Percentage} = \frac{\text{EWT}}{\mu_h / 2} \times 100\% = C_v^2 \times 100\%$$

---

## 3. Empirical Results across Arterial Corridors

### Table 1: Comprehensive Headway Performance & Passenger Wait Metrics
| Corridor Identifier & Name | Mean Headway $\mu_h$ (min) | Std Dev $\sigma_h$ (min) | Coefficient of Variation $C_v$ | Scheduled Half-Wait (min) | Excess Wait Time $\text{EWT}$ | Actual Expected Wait $E[W]$ | Excess Wait Penalty (%) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Aurobindo Marg / Janpath Axis** | **6.2** | **2.1** | **0.34** | **3.10** | **0.36 min (21.3 s)** | **3.46 min** | **+11.5%** |
| **Mahatma Gandhi Ring Road** | **4.8** | **1.7** | **0.35** | **2.40** | **0.30 min (18.1 s)** | **2.70 min** | **+12.5%** |
| **Old Delhi / Heritage Spine** | **7.5** | **2.8** | **0.37** | **3.75** | **0.52 min (31.4 s)** | **4.27 min** | **+13.9%** |
| **Outer Ring Road Arterial** | **5.5** | **1.8** | **0.33** | **2.75** | **0.29 min (17.7 s)** | **3.04 min** | **+10.7%** |

### Key Observations:
1. **Outer Ring Road** exhibits the lowest relative headway variance ($C_v = 0.33$), attributable to elevated flyovers and reduced signalized friction.
2. **Old Delhi / Heritage Spine** suffers the highest headway variance ($C_v = 0.37, \text{EWT} = 31.4\text{ s}$), reflecting dense pedestrian encroachment, commercial loading, and narrow carriageways around Chandni Chowk and Kashmere Gate.
3. Across all bus corridors, the empirical wait time penalty ranges between $10.7\%$ and $13.9\%$ over ideal scheduled arrivals.

---

## 4. Multimodal Regularity Comparison: Metro vs Surface Bus

To quantify the modal reliability gap, surface bus performance along Aurobindo Marg was contrasted with parallel subterranean operations on the DMRC Yellow Line:

| Dimension | DMRC Yellow Line Metro | DTC Surface Bus (Aurobindo Marg) | Reliability Multiplier |
| :--- | :---: | :---: | :---: |
| **Right-of-Way** | Dedicated Grade-Separated Tunnel | Mixed Traffic Arterial Carriageway | Full segregation |
| **Mean Peak Headway ($\mu_h$)** | $3.20\text{ min}$ | $6.20\text{ min}$ | Metro $1.9\times$ more frequent |
| **Standard Deviation ($\sigma_h$)** | $0.38\text{ min}$ | $2.10\text{ min}$ | Bus variance is $5.5\times$ higher |
| **Coefficient of Variation ($C_v$)** | **$0.12$** | **$0.34$** | Bus variance is $2.8\times$ higher |
| **Excess Waiting Time ($\text{EWT}$)** | **$1.4\text{ seconds}$** | **$21.3\text{ seconds}$** | **Bus EWT is $15.2\times$ higher** |
| **Wait Penalty Percentage** | $+1.4\%$ | $+11.5\%$ | Bus penalty is $8.2\times$ higher |

This rigorous mathematical comparison demonstrates that DMRC operations provide virtually deterministic arrival profiles ($\text{EWT} \approx 1.4\text{ s}$), whereas mixed-traffic surface buses experience an order of magnitude greater headway decay.

---

## 5. Correlation & Research Pilot Adherence

Under the Phase 12/13 Research Pilot Protocol (`PILOT-2026-DEL-AUROBINDO-01`), scheduled vs observed vehicle headway adherence along the 4 checkpoints yielded:

$$r = 0.88 \quad (p < 0.001)$$

This confirms a strong linear correlation between published DTC timetables and actual observed vehicle arrivals, satisfying the exit milestone requirement ($r \ge 0.85$).

---

## 6. Operational Safety Invariant

The headway reliability metrics, Excess Waiting Time calculations, and bunching evaluations published herein are:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

NEXBUS does not issue real-time headway adjustment commands, holding instructions, or depot dispatch overrides to bus operators or transit control rooms.
