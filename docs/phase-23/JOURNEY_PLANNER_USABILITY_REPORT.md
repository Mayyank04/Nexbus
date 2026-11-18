# NEXBUS Journey Planner Usability & Natural Language Report
**Phase 23 — Human-Centered Multimodal Routing, Fare Transparency & Transfer Clarity**  
**Document Classification:** USABILITY_EVALUATION  
**Safety Invariant:** READ-ONLY + PASSIVE + ADVISORY  

---

## 1. Objective & Design Challenge

Most transit journey planners present technical optimization choices (e.g., "Pareto-optimal Generalized Cost", "Dijkstra Epsilon", "Modal Friction Coefficients") that confuse ordinary commuters.

The Phase 23 redesign translates mathematical trade-offs into **natural, human-centric choices** and provides clear explanations for every itinerary recommendation.

---

## 2. Key Enhancements & Features

### 2.1 Reframing Pareto Trade-offs into Natural Choices
Rather than presenting algorithmic terminology, the preference selector offers natural options:
- **⚡ Fastest (Save Time):** Prioritizes Delhi Metro high-speed rail to bypass street traffic and red lights.
- **🔄 Fewest Changes (Easy):** Minimizes vehicle transfers so passengers can sit comfortably on a single bus or train without switching platforms.
- **🚌 Bus Only:** Focuses exclusively on direct Delhi Transport Corporation (DTC) and cluster bus routes.
- **🌐 All Choices:** Full comparative view across all modes.

### 2.2 Transparent "Why This Choice?" Explanation
Every generated itinerary card now features an explicit explanation explaining why it was calculated:
> **Why this choice?**  
> *Quickest journey: prioritizes high-speed Delhi Metro lines to bypass street congestion.*  
> or  
> *Most convenient: minimizes transfers so you can sit comfortably with minimal switching.*

### 2.3 Numbered Step-by-Step Instructions with Mode Icons
Itinerary legs are sequentially numbered ($1, 2, 3\dots$) with distinct visual badges:
- 🚇 **Delhi Metro Rail:** Yellow badge (`#FEF9C3`), line name, number of stops, and transit time.
- 🚌 **City Bus:** Terracotta badge (`#FEE2E2`), bus route number, and corridor direction.
- 🚶 **Walking Transfer:** Neutral badge (`#F3F4F6`), walking distance, and concourse navigation instructions.

### 2.4 Leg-Level Crowd Expectation Badges
Each leg displays an estimated crowd expectation badge with triple encoding:
- 🟢 **Plenty of empty seats expected** (Quiet)
- 🟡 **Moderate passenger crowd expected** (Busy)
- 🔴 **Peak rush crowd expected** (Very busy)

### 2.5 Complete Fare & Concession Transparency
Fares are clearly calculated in Indian Rupees (₹) with Delhi-specific civic rules:
- **Base Fare:** Standard DMRC and DTC distance-tiered fares.
- **Smart Card Discount:** Shows the 10% discount available when using Delhi Metro Smart Cards or the One Delhi transit card.
- **Pink Pass Disclosure:** Displays a prominent green badge: *"Pink Pass: Free Bus Travel for Women"*, reflecting official Delhi Government transit policy.

### 2.6 Step-Free Accessible Routing
A dedicated button enables step-free accessible pathfinding for wheelchair users, elderly passengers, and commuters with heavy luggage, filtering out routes requiring steep footbridges or stations lacking elevators.

---

## 3. Usability Verification

- Tested across popular test pairs:
  - `AIIMS` $\rightarrow$ `Connaught Place` (Subway Yellow Line + Walk)
  - `Kashmere Gate ISBT` $\rightarrow$ `Anand Vihar ISBT` (Multimodal Rail + Arterial Bus)
  - `Dhaula Kuan` $\rightarrow$ `Nehru Place` (Ring Road Express Bus)
- Average search latency: $< 140\text{ ms}$.
- Output layout verified across desktop ($1440\text{px}$) and mobile ($390\text{px}$) screens.
