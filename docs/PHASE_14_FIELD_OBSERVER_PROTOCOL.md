# NEXBUS PHASE 14 — FIELD OBSERVER OPERATING PROTOCOL & ETHICS MANUAL

**Protocol Reference:** `PILOT-2026-DEL-AUROBINDO-01-SOP`  
**Target Corridor:** Aurobindo Marg / Janpath Central Axis  
**Audience:** Field Surveyors, Quality Auditors, Research Coordinators  
**Safety & Ethics Status:** Approved under IRB-2026-NEXBUS-MOB-004  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Safety, Station Conduct & Observer Ethics

### 1.1 Non-Actuation Operational Invariant
Field observers act strictly as **passive, non-interfering researchers**:
- **NEVER** attempt to instruct bus drivers, conductors, or depot controllers.
- **NEVER** interfere with passenger boarding, queuing, or ticket validation gates.
- **NEVER** position yourself on active roadway carriageways or bus lanes.
- Maintain a minimum 2.0-meter safety clearance from moving bus wheels at all times.

### 1.2 Privacy-by-Design Compliance
1. **Zero Personally Identifiable Information (PII):** Do not record passenger names, mobile numbers, ticket serials, or biometric attributes.
2. **No Photography:** Photography or video recording of passenger faces, driver cabins, or identifiable individuals is strictly forbidden.
3. **Registration Masking:** Bus license plates must be recorded with the last two digits masked (e.g. `DL-1PD-48**`).
4. **Observer Pseudonymization:** Observers are identified solely by a salted cryptographic hash (`OBS-xxxxxxxxxx`).

---

## 2. Shift Scheduling & Survey Stations

| Station ID | Location Description | Surveyor Count | Morning Shift | Evening Shift |
|---|---|---|---|---|
| **CHK-01** | AIIMS Metro Gate 2 Bus Stop (Northbound) | 2 | 07:45 – 10:45 IST | 16:45 – 19:45 IST |
| **CHK-02** | IIT Main Gate / Hauz Khas Crossing | 2 | 07:45 – 10:45 IST | 16:45 – 19:45 IST |
| **CHK-03** | INA Market Bus Stop / Dilli Haat | 2 | 07:45 – 10:45 IST | 16:45 – 19:45 IST |
| **CHK-04** | Mehrauli Bus Terminal Platform 1 | 2 | 07:45 – 10:45 IST | 16:45 – 19:45 IST |
| **CHK-05** | Connaught Place Outer Circle / Regal | 2 | 07:45 – 10:45 IST | 16:45 – 19:45 IST |

---

## 3. Step-by-Step Collection Procedure

### 3.1 Bus Arrival & Headway Recording
1. Synchronize digital stopwatch / mobile device with Indian Standard Time (IST).
2. Note the route number and masked vehicle registration as the bus enters the deceleration bay.
3. Record exact **Arrival Time** when vehicle wheels come to a complete stop.
4. Record exact **Departure Time** when vehicle wheels begin forward acceleration.
5. Record **Dwell Time** (Seconds) = Departure Time - Arrival Time.
6. Calculate **Headway** = Arrival Time of current bus - Arrival Time of preceding same-route bus.

### 3.2 Passenger Boarding & Crowding Assessment
1. Tally passengers boarding via rear/middle doors.
2. Tally passengers alighting via front doors.
3. Assign Fruin Visual Crowding Score:
   - `1`: Low load (plenty of vacant seats, zero standees).
   - `2`: Medium load (most seats occupied, < 5 standees).
   - `3`: Full seated load (100% seats taken, 10–15 comfortable standees).
   - `4`: High load (dense standees, aisle movement restricted).
   - `5`: Crush load (passengers packed to the door threshold, boardings denied).

### 3.3 Interchange Transfer & Walkway Impedance
1. At multimodal stations (AIIMS, INA, CP), measure transfer times between bus curbs and metro concourses.
2. Note any physical barriers (out-of-service elevators, steep steps without ramps, broken tactile tiles, sidewalk encroachment).

---

## 4. Digital Submission & Data Reconciliation

- Observers enter records via the `/control` Field Observation Portal.
- The portal automatically:
  1. Truncates coordinates to 4 decimal places (~11 meters).
  2. Bins timestamps into 15-second quantiles.
  3. Computes SHA-256 tamper-evident digest.
  4. Stores records with `CollectionStatus: 'VERIFIED_FIELD_OBSERVATION'` (or `MANUALLY_ENTERED_UNVERIFIED` pending supervisor audit).
