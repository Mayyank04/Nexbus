# NEXBUS Phase 13 — Research Ethics, Privacy & Human Participant Protections Protocol

**Protocol Identifier:** IRB-2026-NEXBUS-MOB-004  
**Title:** Empirical Headway Adherence, Interchange Friction & Passenger Demand Research Pilot  
**Institutional Custodian:** NEXBUS Urban Mobility Research Consortium / Institutional Transport Research Wing  
**Operational Invariant:** READ-ONLY + PASSIVE + ADVISORY  
**Date of Institutional Approval:** October 2026  
**Status:** Certified Active Protocol  

---

## 1. Ethical Governance & Purpose of the Study

The NEXBUS Research Pilot is designed exclusively to observe, quantify, and model public transport performance characteristics—specifically vehicle headways, dwell times, transfer walking friction, and passenger crowding patterns—along Delhi's central Aurobindo Marg / Janpath arterial corridor.

The study serves legitimate public transport research, urban planning, and academic inquiry. It operates under strict institutional oversight and adheres to the ethical standards established by the Indian Council of Medical Research (ICMR) Ethical Guidelines for Biomedical and Health Research Involving Human Participants (Social and Behavioural Sciences Section) and international research ethics principles (Declaration of Helsinki).

---

## 2. Zero Personally Identifiable Information (Zero PII) Guarantee

Public transport hubs are sensitive civic spaces. The NEXBUS protocol mandates a **Privacy-by-Design and Privacy-by-Default** architecture:

### 2.1 Prohibition of Participant Identifiers
- **No Biometric Data:** Zero facial recognition, video surveillance streams, voice recordings, or biometric logging.
- **No Pedestrian Contact Information:** Surveyors are prohibited from soliciting names, telephone numbers, Aadhaar numbers, residential addresses, email addresses, or demographic identifiers from commuters.
- **No Device Telemetry Sniffing:** No passive MAC address probing, Wi-Fi sniffing, Bluetooth beacon tracking, or IMEI capture is deployed at any checkpoint.

### 2.2 Vehicle Masking Standards
Vehicle registrations captured during headway logging must be immediately masked at the point of ingestion:
$$\text{Registration} \to \text{"DL-1P[A-Z]-"} + \text{"\*\*"}$$
Example: `DL-1PD-4819` $\to$ `DL-1PD-48**`. Only the state code, depot category, and commercial bus identifier prefix are retained for vehicle category attribution.

### 2.3 Surveyor Pseudonymization
To protect field researchers and eliminate insider surveillance risks:
- Each researcher is assigned a salt key and unique identifier.
- The platform computes an HMAC-SHA256 hash truncated to 10 hexadecimal characters:
  $$\text{Pseudonym} = \text{"OBS-"} + \text{HMAC-SHA256}(K_{\text{salt}}, \text{researcherId})[0..10]$$
- No internal dashboard or public API displays real surveyor names.

---

## 3. Spatial & Temporal Privacy Safeguards

### 3.1 Spatial Truncation
Raw GPS coordinates logged by surveyor mobile devices are truncated to 4 decimal places before persistence:
$$\text{Truncated Lat} = \frac{\lfloor \text{Lat} \times 10^4 \rfloor}{10^4}, \quad \text{Truncated Lng} = \frac{\lfloor \text{Lng} \times 10^4 \rfloor}{10^4}$$
$$\Delta \text{Distance} \approx 11.13\text{ meters}$$
This spatial precision ensures accurate stop and bay identification while preventing pedestrian track reconstruction or micromobility trajectory deanonymization.

### 3.2 Temporal Quantization
All observation timestamps are rounded to the nearest 15-second boundary:
$$t_{\text{quantized}} = \left\lfloor \frac{t_{\text{epoch}}}{15000} + 0.5 \right\rfloor \times 15000$$
This eliminates high-resolution timing side channels while maintaining 100% statistical validity for headway and dwell time modeling.

---

## 4. Informed Voluntary Researcher Consent

Field researchers participating in observation campaigns must formally assert voluntary informed consent prior to session initialization:
1. Awareness of observation goals and safety guidelines.
2. Confirmation that participation is voluntary and non-hazardous.
3. Explicit acknowledgment of data minimization policies.
4. Cryptographic consent flag (`voluntaryConsentConfirmed: true`) stored alongside each recorded batch.

---

## 5. Physical Safety Protocol for Field Researchers

Field observation in Delhi's high-density traffic corridors entails environmental and physical safety considerations:
1. **Designated Safe Observation Zones:**
   - Observers must remain strictly on raised pedestrian walkways, bus terminal passenger platforms, or demarcated refuge islands.
   - Observers must stand at least 1.5 meters behind the kerb edge and behind yellow tactile warning pavers.
   - Stepping into the carriageway, roadway lanes, or active bus maneuvering bays is **strictly prohibited**.
2. **High-Visibility Equipment:**
   - All surveyors must wear retro-reflective safety vests conforming to IS 15809 standards.
   - Visible photo research badges issued by the consortium must be worn at all times.
3. **Severe Weather & Environmental Safety:**
   - During extreme heatwaves ($\ge 42^\circ\text{C}$), observation shifts are restricted to 45-minute rotations with mandatory 15-minute hydration rests in shaded facilities.
   - During severe air pollution episodes ($\text{AQI} \ge 400$ / PM2.5 $\ge 250\,\mu\text{g/m}^3$), surveyors must wear certified N95 respirators.
   - During heavy monsoon waterlogging events, operations at low-lying stops are suspended.

---

## 6. Non-Interference & Operational Safety Invariant

The paramount operational principle of the NEXBUS platform is:

$$\mathbf{READ\text{-}ONLY} + \mathbf{PASSIVE} + \mathbf{ADVISORY}$$

Field researchers must strictly abide by the following operational constraints:
- **Zero Dispatch Interaction:** Researchers must never interact with DTC bus drivers, depot controllers, or conductors regarding vehicle departures, route modifications, or layover durations.
- **Zero Signal Tampering:** Researchers have zero physical or digital access to Delhi Traffic Police SCOOT/ITS signal controllers.
- **Zero Train Operations Interference:** At multimodal metro interchange hubs (AIIMS, INA, Hauz Khas), researchers must never enter DMRC operational rooms, track areas, or platform edge doors.
- **Passive Commuter Presence:** Researchers observe passenger movements unobtrusively without obstructing passenger flows at ticket gates, staircases, escalators, or boarding doors.

---

## 7. Data Custody, Archival & Access Control

- All observation payloads are hashed using cryptographic SHA-256 upon ingestion to establish tamper-evident immutability.
- Raw observation logs are stored in secure, encrypted-at-rest volumes.
- API access is strictly rate-limited and read-only.
- All datasets published for academic or peer review are pre-filtered to guarantee complete zero-PII compliance.
