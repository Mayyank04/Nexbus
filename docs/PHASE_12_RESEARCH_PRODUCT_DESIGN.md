# NEXBUS Phase 12 — Institutional Research Product Design & User Interface

## 1. Executive Summary & Design Vision

NEXBUS serves urban transport researchers, municipal planners, and institutional decision-makers in the Delhi National Capital Territory.

Phase 12 enhances the institutional control interface (`/control`) by integrating an interactive **Research Pilot & Empirical Evidence Console** (`Phase12ResearchPilotPanel.tsx`). The console exposes live data acquisition health, cryptographic payload verification, the 256-stop expanded network, and real-world field observation progress.

---

## 2. Interface Component Architecture

```
+-----------------------------------------------------------------------------------------+
|                  PHASE 12 INSTITUTIONAL RESEARCH PILOT CONSOLE                          |
+-----------------------------------------------------------------------------------------+
| Header: Institutional Research & Empirical Calibration Console                          |
| Safety Banner: READ-ONLY + PASSIVE + ADVISORY (Enforced Badge)                          |
+-----------------------------------------------------------------------------------------+
| Tab Selector: [ Verified Providers (8) ]  [ Research Pilot (78.3%) ]  [ Expanded Net ]  |
+-----------------------------------------------------------------------------------------+
| TAB 1: VERIFIED PROVIDERS                                                               |
| - Key Indicators: Composite Evidence Health (85%), SHA-256 Records, Non-Substitution   |
| - Provider Registry Table: Category, Classification, Live Status, SHA-256 Digest       |
| - On-Demand Cryptographic Tamper Verification: Checksum match validation               |
+-----------------------------------------------------------------------------------------+
| TAB 2: RESEARCH PILOT PROTOCOL                                                          |
| - Study Corridor: Aurobindo Marg / Janpath (14.8 km, Mehrauli to Connaught Place)       |
| - Field Quota Progress Bar: 188 / 240 records completed (78.3%)                        |
| - 4 Checkpoint Cards: AIIMS Hub, IIT Hauz Khas, INA Market, Mehrauli Gateway            |
| - Ethics & Privacy Metrics: IRB-2026-NEXBUS-MOB-004, Zero PII, r = 0.88 Headway Adh.   |
+-----------------------------------------------------------------------------------------+
| TAB 3: EXPANDED MULTIMODAL NETWORK                                                      |
| - 256 Geocoded Physical Stops across all 11 Delhi Statutory Districts                  |
| - District Distribution Grid: Central (24), New Delhi (26), South (25), etc.           |
| - GTFS Referential Integrity Certificate: 0 Key Violations, 0 Boundary Errors          |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Product Usability & Ethical Safeguards

1. **Persistent Safety Reminder**:
   - Every analytical view reinforces the invariant: `READ-ONLY + PASSIVE + ADVISORY`.
   - Clear visual indicators differentiate between `OBSERVED`, `VERIFIED_EXTERNAL`, `DERIVED`, and `SIMULATED` outputs.
2. **Cryptographic Transparency for Institutional Audits**:
   - Reviewers can click any archive ID to verify the SHA-256 checksum in real-time, confirming that historical observation snapshots have not been altered.
3. **Privacy Assurance Indicators**:
   - Field observation summaries disclose observer pseudonymization and 4-decimal coordinate truncation, ensuring full compliance with national data privacy standards (DPDP Act).
