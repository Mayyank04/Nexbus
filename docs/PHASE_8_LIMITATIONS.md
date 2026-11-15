# NEXBUS Phase 8 — System Limitations, Modeling Assumptions & Operational Scope

## 1. Scope & Operational Boundaries

1. **Non-Intervention Safety Boundary**:
   NEXBUS operates strictly in an advisory capacity. It has no physical actuation interfaces, signal control relays, or automated train supervision dispatch hooks. All operational detours and headway adjustments require human transit authority review and field authorization.

2. **Geographic Coverage Scope**:
   Phase 8 models the National Capital Territory (NCT) of Delhi. Inter-state transit corridors extending into Haryana (Gurugram, Faridabad, Sonipat) or Uttar Pradesh (Noida, Ghaziabad) are modeled up to border interchange terminals (e.g. Anand Vihar ISBT, Dhaula Kuan) and do not include full peri-urban feeder networks.

---

## 2. Modeling Assumptions & Simplifications

1. **Walking Speed Homogeneity**:
   The generalized journey cost engine assumes a standard walking speed of $4.5\text{ km/h}$ ($75\text{ m/min}$) on horizontal pedestrian segments. While vertical transitions incorporate level penalties ($0.75\text{ min/level}$), walking speeds do not dynamically vary by commuter age, luggage weight, or ambient temperature.

2. **Poisson Passenger Arrival at High-Frequency Stations**:
   Expected waiting times are estimated as $\frac{\text{Headway}}{2}$, which assumes memoryless Poisson passenger arrivals. While accurate for high-frequency services ($\text{Headway} \le 6\text{ min}$ on DMRC Yellow and Blue lines), for low-frequency outer bus feeder lines ($\text{Headway} \ge 15\text{ min}$), schedule-synchronized arrivals may yield lower actual waiting times.

3. **Fare Structure Approximations**:
   The fare computation engine implements DMRC's published standard distance-based tariff slabs (₹10 to ₹60) and DTC's flat non-AC/AC fare structure (₹15 average). It does not model off-peak smart card discounts (10% rebate between 08:00 and 12:00 / 17:00 and 21:00) or student/concessional passes.

4. **Static Pedestrian Transfer Geometries**:
   Interchange walking distances and vertical level shifts are based on calibrated field surveys conducted at 8 major Delhi transit hubs. Real-time platform crowd density surges (e.g. Diwali shopping congestion at Rajiv Chowk) are estimated statistically rather than through live optical concourse sensors.

---

## 3. Data Feed Dependencies & Resilience Degradation

1. **Upstream OTD Delhi API Latency**:
   Real-time vehicle position updates depend on the availability and responsiveness of Open Transit Data Delhi. When upstream feeds experience latency or dropouts, NEXBUS transparently degrades to `ESTIMATED` and `VERIFIED_EXTERNAL` timetables without disrupting client sessions.

2. **Underground Metro GPS Shielding**:
   GPS signals are shielded inside underground DMRC tunnel segments. Train position tracking on underground lines relies on published timetables, dwell durations, and station departure events (`VERIFIED_EXTERNAL`) rather than live satellite AVL beacons.

---

## 4. Disruption Simulation Assumptions

1. **Passive Graph Rerouting**:
   Disruption scenarios (e.g. Ring Road waterlogging, Yellow Line maintenance) model network degradation using shortest-path rerouting across available parallel corridors. The simulator does not model behavioral panic, modal shift to private ride-hail services, or localized surge pricing.

2. **Constant Traffic Demand Assumption**:
   Resilience calculations assume constant baseline origin-destination demand matrices. In prolonged multi-day disruptions, induced demand reduction and remote work substitution would mitigate observed delay penalties.
