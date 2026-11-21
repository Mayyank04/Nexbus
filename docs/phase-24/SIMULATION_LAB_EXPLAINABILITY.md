# NEXBUS Phase 24 — Simulation Lab Explainability & Mathematical Model Preservation

**Route:** `/simulate`  
**Component:** `src/app/simulate/page.tsx`  
**Audit Date:** November 21, 2026  
**Screenshot Evidence:** [simulate-desktop-1440.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/simulate-desktop-1440.png), [simulate-mobile-390.png](file:///Users/mayankgautam/Desktop/nexbus/docs/phase-24/evidence/screenshots/simulate-mobile-390.png)

---

## 1. Balancing Curiosity with Mathematical Rigor

The NEXBUS Simulation Lab allows users to test policy interventions on Delhi's transit network. Previous versions displayed slider arrays and mathematical delta values ($\Delta \text{VKT}$, $\Delta \text{PPHPD}$) that bewildered students and non-technical visitors.

Phase 24 establishes a dual-layer approach:
1. **1-Click Curiosity Scenarios:** Pre-configured policy questions that a child or student can explore with one tap.
2. **4 Plain-Language Outcome Questions:** Explaining outcomes without jargon.
3. **Preservation of Governing Physical & Economic Laws:** Full mathematical formulations retained in Level 2 cards.

---

## 2. The 3 1-Click Curiosity Scenarios

| Scenario Card | Plain Policy Question | Pre-Set Levers | Projected Commuter Impact |
| :--- | :--- | :--- | :--- |
| **Fleet Expansion** | *What if Delhi adds 500 electric buses?* | Fleet: $+500$ EVs; Fare: baseline; Dedicated lanes: $+20\text{ km}$ | Wait times drop by $4.2\text{ min}$; crowding reduced by $18.4\%$. |
| **Clean Air Day** | *What if weekend bus fares are 100% free?* | Fare: $-100\%$; Frequency: $+25\%$; Fleet: full active | Ridership surges $+31.2\%$; 142 metric tons of $\text{CO}_2$ abated. |
| **Monsoon Congestion** | *What happens during heavy monsoon rain?* | Road speed: $-40\%$; Dwell times: $+35\%$; Bunching risk: $+65\%$ | Wait times spike by $8.6\text{ min}$; EWT increases across outer rings. |

---

## 3. The 4 Plain-Language Scenario Outcome Questions

Every scenario result is interpreted through 4 standardized questions:

1. **What did you change?**
   - *Plain Summary:* Identifies the user's operational inputs (e.g., adding buses, changing fares, or introducing dedicated bus lanes).
2. **What did our computer model calculate?**
   - *Plain Summary:* Highlights the primary numerical changes (e.g., "The model calculated that bus arrival gaps will shrink from 12 minutes to 8 minutes").
3. **What does this mean for everyday commuters?**
   - *Plain Summary:* Translates calculations into human terms (e.g., "Fewer people will be left waiting in the summer heat, and buses will have empty seats available").
4. **What assumptions were used?**
   - *Plain Summary:* Transparently discloses modeling parameters (e.g., "Assumes battery buses recharge overnight at depots and traffic signals do not break down").

---

## 4. Preservation of Governing Mathematical Equations

While Level 1 presents plain explanations, Level 2 preserves the exact mathematical foundations:

### A. Little's Law for Corridor Queuing
$$L = \lambda W$$
Where $L$ is the average number of passengers waiting at the stop, $\lambda$ is the passenger arrival rate, and $W$ is the mean waiting time.

### B. Price Elasticity of Demand
$$\frac{\Delta Q}{Q} = \varepsilon_p \frac{\Delta P}{P}$$
Where $\varepsilon_p = -0.32$ represents the empirical short-run transit fare elasticity for Delhi bus commuters.

### C. Emissions Abatement Equation
$$E_{\text{net}} = \sum_{m} \left( \Delta \text{VKT}_m \cdot \text{EF}_m \right) - E_{\text{grid\_charging}}$$
Where $\text{EF}_{\text{diesel}} = 2.68 \text{ kg }\text{CO}_2/\text{L}$ and grid charging is evaluated at $710\text{ g }\text{CO}_2/\text{kWh}$.
