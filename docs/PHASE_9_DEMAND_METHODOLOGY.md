# NEXBUS Phase 9 — Passenger Demand Intelligence Methodology

**Document Version**: 2.0.0-institutional  
**Classification**: `DERIVED` / `ESTIMATED`  
**Governing Service**: `PassengerDemandService` (`src/lib/demand/passengerDemandService.ts`)

---

## 1. Mathematical Formulations

### 1.1 Directional Imbalance Ratio ($\alpha$)
Metropolitan transit systems experience asymmetric directional loading during morning and evening peak intervals. The directional split ratio $\alpha(t)$ is defined as:

$$\alpha(t) = \frac{\max(V_{\text{inbound}}(t), V_{\text{outbound}}(t))}{V_{\text{inbound}}(t) + V_{\text{outbound}}(t)}$$

- $\alpha(t) \approx 0.50$: Perfect bidirectional passenger balance.
- $\alpha(t) \ge 0.65$: Acute tidal commute (requiring deadhead return trips or asymmetrical bus dispatch).
- In Delhi NCT morning peak (08:00–10:00), radial arterials into Connaught Place and Central Secretariat reach $\alpha = 0.74$.

### 1.2 Peak Hour Factor (PHF)
The Peak Hour Factor ($PHF$) measures traffic flow fluctuations within the peak hour:

$$PHF = \frac{V_{60}}{4 \times V_{15}}$$

Where:
- $V_{60}$: Total passenger volume during the peak 60 minutes.
- $V_{15}$: Maximum passenger volume during the peak 15-minute interval.
- A lower $PHF$ ($< 0.80$) indicates severe 15-minute surging and station platform congestion; a higher $PHF$ ($> 0.90$) indicates steady, well-distributed passenger throughput.

### 1.3 Spatial Passenger Concentration (Gini Coefficient)
The spatial concentration of passenger boardings across the $n$ stops of corridor $C$ is quantified using the Gini coefficient:

$$G = \frac{\sum_{i=1}^n \sum_{j=1}^n |y_i - y_j|}{2n \sum_{i=1}^n y_i}$$

Where $y_i$ is the daily boardings at stop $i$. In Delhi, $G = 0.38$, indicating that ~20% of stops account for over 55% of corridor boardings.

---

## 2. Privacy-Preserving Aggregation ($k$-Anonymity)

To safeguard commuter privacy:
1. **$k$-Anonymity ($k \ge 15$)**: All passenger demand statistics are reported only in temporal bins with $\ge 15$ commuters.
2. **Zero PII**: No smart card identifiers, phone numbers, ETM ticket sequence numbers, or individual origin-destination trip chains are persisted or exposed via APIs.
3. **Differential Uncertainty**: 95% Bayesian credible intervals are generated around aggregate expected volumes.

---

## 3. Synthetic Testing Mode Governance

When real-world empirical ticketing feeds are offline or access permissions are limited:
- The system activates `syntheticMode=true`.
- Output is explicitly classified as `SYNTHETIC`.
- The UI displays an amber advisory banner stating that figures are parametric test records and must not be used for physical fleet procurement or financial reconciliation.
