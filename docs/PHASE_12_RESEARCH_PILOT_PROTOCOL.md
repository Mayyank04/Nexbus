# NEXBUS Phase 12 — Controlled Real-World Research Pilot Protocol

## 1. Study Overview & Institutional Purpose

- **Protocol Code:** `PILOT-2026-DEL-AUROBINDO-01`
- **Study Title:** Empirical Headway Adherence, Interchange Transfer Friction & Passenger Crowding Research Pilot
- **Principal Study Corridor:** Aurobindo Marg / Janpath Central Arterial Axis (14.8 km connecting Mehrauli Terminal to Connaught Place)
- **Institutional Custodian:** NEXBUS Urban Mobility Research Consortium / Transport Planning Wing
- **Ethics Approval Code:** `IRB-2026-NEXBUS-MOB-004` (Approved 2026-10-12)

---

## 2. Non-Negotiable Operational Safety Invariant

**READ-ONLY + PASSIVE + ADVISORY**:
The research pilot operates strictly as an observational study. Observers and platform agents must never:
1. Issue instructions to bus drivers, station masters, or operations controllers.
2. Interfere with physical dispatch queues or ticket counter operations.
3. Attempt automated vehicle tracking through unauthorized radio/cellular interception.
4. Compromise passenger safety or station circulation.

---

## 3. Physical Checkpoint Architecture

Four physical observation stations were designated along the corridor representing diverse transit integration conditions:

```
+-----------------------------------------------------------------------------------------+
|                  AUROBINDO MARG CORRIDOR PHYSICAL RESEARCH CHECKPOINTS                  |
+-----------------------------------------------------------------------------------------+
       |                                                                            |
       v (Northbound)                                                               v (Southbound)
[CHK-04: Mehrauli Terminal] --> [CHK-02: IIT / Hauz Khas] --> [CHK-01: AIIMS Hub] --> [CHK-03: INA Interchange]
  (Bus Terminal Gateway)          (Radial Crossroad)          (Complex MMI Hub)        (Dual-Line Transfer)
```

| Checkpoint ID | Name / Location | Coordinates | Modality | Primary Measurement Focus | Target Samples |
|---|---|---|---|---|---|
| `CHK-01` | AIIMS Multimodal Interchange Hub | 28.5672°N, 77.2100°E | Bus + Yellow Line Metro + Subway | Transfer friction, vertical level delays, concourse crowding | 48 / day |
| `CHK-02` | IIT Delhi Main Gate / Hauz Khas | 28.5450°N, 77.1925°E | Bus + Magenta Line Metro | Dwell time, headway irregularity ($C_v$), passenger queues | 36 / day |
| `CHK-03` | INA Market / Dilli Haat Station | 28.5750°N, 77.2085°E | Bus + Yellow/Pink Line Metro | Boarding/alighting tallies, platform clearance times | 40 / day |
| `CHK-04` | Mehrauli Bus Terminal Gateway | 28.5180°N, 77.1850°E | Surface Bus Terminal Spine | Terminal dispatch punctuality, crew turnaround delays | 36 / day |

---

## 4. Observation Schedule & Sampling Design

Field surveys are stratified into three daily time periods to capture peak vs off-peak kinematics:

1. **Morning Peak Slot (`08:00 - 10:30 IST`):**
   - 8 active surveyors deployed across 4 checkpoints.
   - Measures inbound commuter crush loads and bus bunching.
2. **Midday Inter-Peak Slot (`12:00 - 14:00 IST`):**
   - 4 active surveyors.
   - Measures baseline off-peak headways and free-flow commercial speeds.
3. **Evening Peak Slot (`17:00 - 19:30 IST`):**
   - 8 active surveyors.
   - Measures outbound dispersals, interchange concourse congestion, and last-mile delays.

---

## 5. Privacy, Ethics & Data Governance Protection

1. **Observer Pseudonymization**:
   - Surveyors are registered with salt-derived HMAC hashes (`OBS-xxxxxxxxxx`).
   - Field tablets never transmit surveyor personal identity.
2. **Spatial & Temporal Quantization**:
   - GPS coordinates truncated to 4 decimal places ($\approx 11\text{ meters}$ resolution).
   - Time observations rounded to 15-second bins to prevent trajectory re-identification.
3. **Zero Passenger PII Capture**:
   - No facial photography, video recording, name queries, or phone numbers.
   - Observations count aggregate tallies only (boardings, alightings, dwell seconds).

---

## 6. Pilot Exit & Empirical Success Criteria

| Evaluation Criterion | Minimum Threshold | Current Observed Status | Status |
|---|---|---|---|
| Total Verified Field Observations | $\ge 200$ records | 188 records (78.3% complete) | **ON TRACK** |
| Headway Adherence Correlation ($r$) | $r \ge 0.85$ against static GTFS | $r = 0.88$ | **ACHIEVED** |
| Maximum Continuous Data Gaps | $\le 2.0$ hours | 0.5 hours max gap | **ACHIEVED** |
| PII / Privacy Breaches | Exactly 0 breaches | 0 breaches recorded | **VERIFIED** |
| IRB Ethics Protocol Compliance | Active Approved Certification | Protocol `IRB-2026-NEXBUS-MOB-004` | **ACTIVE** |

---

## 7. API Reference

- `GET /api/pilot/protocol`: Returns the complete research pilot protocol, checkpoint catalog, sampling schedules, and live milestone progression metrics.
