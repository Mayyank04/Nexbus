# NEXBUS Phase 15 — Controlled Field Pilot Authorization & Governance Protocol

**Protocol Reference**: `AUTH-PROTOCOL-PHASE15-DEL-AUROBINDO-01`  
**Target Study**: Aurobindo Marg / Janpath Central Arterial Axis Field Research Pilot  
**Institutional Custodian**: NEXBUS Urban Mobility Research Consortium / Transport Research Wing  
**Current Execution State**: `READY_FOR_FIELDWORK` (Fieldwork Pending Formal Authorization)  
**Ethics Approval Status**: `ETHICS_APPROVAL_STATUS = PENDING`  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Statutory & Epistemological Pre-Condition

Under NEXBUS scientific research principles, empirical field research cannot be represented as completed or active without documented institutional authorizations, site access clearances, and independent ethical protocols.

> [!CAUTION]
> **No Fake Approvals Rule**: The identifier `IRB-2026-NEXBUS-MOB-004` represents an internal project research design protocol. It must **not** be presented as an accredited external Institutional Review Board clearance until an accredited statutory ethics committee issues documentary approval.

---

## 2. Fifteen-Point Field Pilot Authorization Checklist

The following 15 governance requirements must be fulfilled before field collection transitions to `FIELDWORK_IN_PROGRESS`:

| # | Governance Domain | Verification Criterion | Status | Documentation / Safeguard |
|---|---|---|---|---|
| **1** | **Research Purpose** | Transparent public interest research evaluating public bus headway regularity, transfer dwell times, and passenger wait penalties. | **VERIFIED** | Formal study charter and hypotheses published in research documentation. |
| **2** | **Study Locations** | 5 physical study checkpoints along the Aurobindo Marg axis (Mehrauli Terminal, IIT Hauz Khas, AIIMS, INA, Connaught Place). | **VERIFIED** | Bounded WGS84 coordinates defined; all within NCT Delhi statutory boundaries. |
| **3** | **Proposed Dates & Time-Slots** | Four standardized sampling windows: AM Peak (08:00–10:30), Midday (12:00–14:00), PM Peak (17:00–19:30), Off-Peak (20:30–22:30). | **VERIFIED** | Synchronized with DTC operational shifts. |
| **4** | **Field Team Roles** | Pseudonymized surveyor roles: Station Enumerator, Headway Tally Recorder, Dwell Time Timer, and Audit Supervisor. | **VERIFIED** | Pseudonymous salted IDs (`OBS-XXXXXXXXXX`) assigned with zero personal info. |
| **5** | **Institutional Affiliation** | Lead transport research fellows and academic partner consortium affiliation. | **VERIFIED** | Documented in research protocol charter. |
| **6** | **Site Permissions** | DTC depot access and DMRC station entrance observation coordination. | **PENDING** | Liaison letters submitted; awaiting municipal administrative clearance. |
| **7** | **Ethics Approval / Exemption** | Independent institutional review board review or certified observational research exemption. | **PENDING** | Protocol registered (`IRB-2026-NEXBUS-MOB-004`); pending external board meeting. |
| **8** | **Participant Consent Process** | Public observational methodology strictly passive. If voluntary commuter surveys occur, informed oral consent script mandatory. | **VERIFIED** | Oral consent script and surveyor guidelines codified. |
| **9** | **Privacy Impact Assessment** | Zero PII guarantee: no capture of faces, names, phone numbers, vehicle license full plates, or biometrics. | **VERIFIED** | Coordinate truncation (~11m), timestamp binning (15s), plate masking (`DL-1PD-48**`). |
| **10** | **Data Retention Period** | Raw field observation notes shredded after digitization and cryptographic verification; digital ledger preserved for 5 years. | **VERIFIED** | Data retention schedule documented. |
| **11** | **Data Security** | End-to-end cryptographic hashing (SHA-256), encrypted disk storage, role-based access control, and zero unauthenticated write endpoints. | **VERIFIED** | Automated cryptographic verification implemented in ingestion pipeline. |
| **12** | **Public-Space Rules** | Non-obstruction of pedestrian footways, bus boarding doors, or station turnstiles; observers maintain 2m setback. | **VERIFIED** | Standardized observer code of conduct enforced. |
| **13** | **Emergency Contact Procedure** | On-duty research supervisor direct contact protocol for site safety or surveyor support. | **VERIFIED** | Emergency escalation protocol established. |
| **14** | **Researcher Safety** | High-visibility safety vests, hydration provisions, heatwave/monsoon protocol, and medical insurance coverage. | **VERIFIED** | Safety equipment guidelines and weather pause criteria codified. |
| **15** | **Publication Restrictions** | Open data publication under GODL-India with permanent redaction of surveyor identity salts and raw micro-GPS coordinates. | **VERIFIED** | Public data dictionary enforces pseudonymization. |

---

## 3. Strict Negative Privacy Invariants

To safeguard commuter privacy, field observers and digital collection systems must strictly adhere to the following prohibitions:
- **No Covert Surveillance**: No hidden cameras, concealed microphones, or automated facial recognition.
- **No Personal Identification**: Observers must never request or record passenger names, mobile numbers, Aadhaar numbers, or ticket serial codes.
- **No Individual Commuter Tracking**: Observers track aggregate bus arrivals and station crowds, never individual passenger journeys.
- **No Actuation or Operational Interference**: Observers are strictly passive; they must never direct buses, alter signals, or instruct drivers.

---

## 4. Current State Determination

Given that items **6 (Site Permissions)** and **7 (Ethics Approval)** are currently undergoing administrative and institutional processing:
- The platform state is held in:
  ```ts
  FIELDWORK_EXECUTION_STATUS = 'READY_FOR_FIELDWORK'
  ETHICS_APPROVAL_STATUS = 'PENDING'
  ```
- All demonstration records and baseline simulation runs in the repository remain clearly identified as `DEMONSTRATION_FIXTURE` and `SIMULATED`, preserving total epistemological integrity.
