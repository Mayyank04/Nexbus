# NEXBUS Phase 13 — Field Observer Guide & Standard Operating Procedures

**Document Code:** SOP-NEXBUS-FIELD-2026-V1  
**Project:** NEXBUS Urban Mobility Intelligence Platform  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  
**Target Audience:** Field Research Fellows, Transport Surveyors & Academic Observers  

---

## 1. Safety Rules & Legal Invariants

The safety of researchers, transit operating personnel, and commuters is paramount. Every field observer must memorize and strictly obey the following rules:

### 1.1 Non-Negotiable Safety Rules
1. **Never Step into the Carriageway:** Always remain on raised pedestrian footpaths, designated bus queue shelters, or terminal platforms. Maintain a minimum distance of **1.5 meters** from the kerb edge.
2. **Never Touch Moving Vehicles:** Do not run alongside moving buses or touch handles or doors before a bus comes to a complete standstill.
3. **High-Visibility Requirement:** Observers must wear their designated fluorescent yellow/orange retro-reflective safety vest and NEXBUS researcher photo badge at all times.
4. **Hydration and Weather Preparedness:** In summer months ($>38^\circ\text{C}$), carry minimum 1.5 liters of drinking water. In winter/smog months ($\text{AQI} > 300$), wear a sealed N95 respirator.

### 1.2 READ-ONLY + PASSIVE + ADVISORY Invariant
- **Zero Operational Interaction:** You are an observer, not a traffic warden or dispatcher.
- Do NOT instruct drivers to stop, wait, accelerate, or modify their layover.
- Do NOT attempt to alter traffic signal timings or speak to signal booth operators.
- Do NOT board vehicles to inspect ticketing unless you have purchased an official passenger ticket and are participating in an approved on-board run.
- If approached by transit staff (DTC conductor, DMRC security, Delhi Police), politely present your research credential badge and explain that you are logging vehicle arrival times for university transport research.

---

## 2. Pre-Shift Checklist

Complete this checklist 15 minutes before your shift starts:

- [ ] High-visibility reflective vest donned.
- [ ] Research credential ID badge worn visibly around neck.
- [ ] Smartphone / tablet charged to $\ge 80\%$.
- [ ] Time synchronization verified: check that device clock matches standard IST time (NTP-synchronized).
- [ ] Mobile browser opened to NEXBUS Field Collection Portal (`/control` or `/api/ingestion/observations`).
- [ ] Backup mechanical tally counter and physical survey clip-board prepared in case of device failure.
- [ ] Water bottle, weather protection, and N95 mask packed.

---

## 3. Physical Observation Methodology

### 3.1 Vehicle Arrival & Headway Recording
- **Arrival Definition:** The exact instant the front bumper of the bus comes to a complete standstill at the designated bus stop bay.
- **Timestamp Capture:** Immediately trigger the **Log Arrival** button on your mobile form. The system will automatically quantize your timestamp to the nearest 15-second boundary.
- **Route & Registration Identification:**
  * Note the route number displayed on the LED destination display or front board (e.g., `502`, `505`, `534`, `TMS`).
  * Note the commercial registration prefix and middle numerals (e.g., `DL-1PD-4819`). In the form, enter this registration—the system automatically applies cryptographic masking to store only `DL-1PD-48**`.

### 3.2 Dwell Time Measurement ($\tau_{\text{dwell}}$)
- **Timer Start:** The instant the vehicle wheels stop moving AND the front/rear doors begin to open.
- **Timer Stop:** The instant both passenger doors are completely closed AND the vehicle wheels begin forward acceleration away from the stop.
- **Recording:** Enter the elapsed time in seconds. Dwell times in Delhi typically range between 15 seconds (minor stop, few alightings) and 90 seconds (major interchange hub). Values $>600\text{ seconds}$ indicate vehicle breakdown or driver layover and must be flagged as such.

### 3.3 Boarding and Alighting Passenger Tallies
At two-door DTC standard floor and low-floor buses:
- **Boardings ($N_{\text{board}}$):** Count every passenger stepping up across the vehicle doorway threshold into the bus.
- **Alightings ($N_{\text{alight}}$):** Count every passenger stepping down from the vehicle threshold onto the curb or platform.
- *Paired Surveyor Tip:* When working in pairs, Surveyor A tracks the rear door (primarily boardings) and Surveyor B tracks the front door (primarily alightings).

### 3.4 Visual Crowding Assessment (5-Point Fruin Heuristic)
Record the interior crowding level immediately prior to departure using the following standardized 5-point scale:

| Score | Descriptive Name | Visual Criteria | Approximate Passenger Density |
| :---: | :--- | :--- | :--- |
| **1** | **Low Demand** | More than 50% of passenger seats are empty. Zero standees. | $< 0.5$ passengers / seat |
| **2** | **Moderate Seated** | Most seats occupied; 2 to 5 scattered empty seats remaining. Zero standees. | $\sim 0.8 - 0.9$ passengers / seat |
| **3** | **Full Seated** | All seats occupied. A few standees in the aisle (1 to 10 standees). Free circulation possible. | $1.0 - 1.2$ passengers / seat |
| **4** | **Dense Standees** | Heavy standing load throughout the aisle and vestibules. Minimal aisle space. Standees touching. | $1.3 - 1.8$ passengers / seat (Fruin LOS D/E) |
| **5** | **Crush Load** | Vehicle at absolute physical capacity. Passengers pressed against glass and doors. Additional boarding impossible. | $> 1.8$ passengers / seat (Fruin LOS F) |

---

## 4. Submitting Observations via Mobile Interface

1. **Verify Observer Identity:** Ensure your assigned Researcher Salt ID (e.g., `RESEARCH-FELLOW-01`) is pre-filled in your device session.
2. **Confirm Voluntary Consent:** Toggle the **Voluntary Research Consent** confirmation checkbox.
3. **Select Stop & Corridor:** Select your checkpoint (e.g., `stop-aiims-gate2`) from the drop-down menu.
4. **Input Measurements:** Enter Route ID, Masked Registration, Dwell Time, Boardings, Alightings, and Crowding Score.
5. **Weather Condition:** Select the current prevailing weather (`CLEAR`, `HEATWAVE`, `RAIN_WATERLOGGED`, or `HAZE_POLLUTION`).
6. **Submit:** Press **Submit Observation**. The system will validate the coordinates against the Delhi NCT geofence, compute the SHA-256 integrity hash, and return an instant confirmation code (`FLD-OBS-YYYYMMDD-XXXX`).

---

## 5. Incident Reporting & Shift Sign-Off

At the conclusion of your observation shift:
1. Verify that all recorded entries have a confirmation code and green checkmark.
2. Note any operational anomalies in the shift comments field (e.g., road diversion, water main break, traffic signal power failure).
3. Notify the Field Research Coordinator via the research coordination channel that your shift has concluded.
4. Return high-visibility vests and physical clip-boards to the corridor depot repository.
