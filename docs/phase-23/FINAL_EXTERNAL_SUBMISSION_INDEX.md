# NEXBUS: FINAL EXTERNAL SUBMISSION DOSSIER & DELIVERABLES INDEX

**Document ID:** `NEXBUS-FINAL-SUBMISSION-INDEX-PHASE23`  
**Evaluation Standard:** Competition Evaluation & Judge Portal Ingestion  
**Repository:** `https://github.com/Mayyank04/Nexbus`  
**Submission Branch:** `phase-23-final-external-submission-and-judge-readiness`  
**Release Baseline:** Commit `5357b1d` $\to$ Phase 23 Final Submission Commit  
**Operational Mandate:** `READ-ONLY + PASSIVE + ADVISORY` (Absolute Invariant)

---

## 1. FIVE-DELIVERABLE COMPETITION MASTER INDEX

| # | Required Deliverable | Verified Access Link / Repository Path | Access & Verification Status |
| :-: | :--- | :--- | :---: |
| **1** | **Project Proposal** | [docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md](https://github.com/Mayyank04/Nexbus/blob/phase-23-final-external-submission-and-judge-readiness/docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md)<br/>*(Local: `docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md`)* | **`COMPLETE_VERIFIED`**<br/>*(Public Markdown, KaTeX formulas verified)* |
| **2** | **Working Prototype** | [https://nexbus.vercel.app](https://nexbus.vercel.app) | **`COMPLETE_VERIFIED`**<br/>*(Live Vercel Edge, HTTP 200 on all 46 routes)* |
| **3** | **Public Source Code & README** | [https://github.com/Mayyank04/Nexbus](https://github.com/Mayyank04/Nexbus)<br/>*(Local: `README.md`)* | **`COMPLETE_VERIFIED`**<br/>*(MIT License, full setup instructions, CI badge)* |
| **4** | **Technical Note** | [docs/phase-21/NEXBUS_TECHNICAL_NOTE.md](https://github.com/Mayyank04/Nexbus/blob/phase-23-final-external-submission-and-judge-readiness/docs/phase-21/NEXBUS_TECHNICAL_NOTE.md)<br/>*(Local: `docs/phase-21/NEXBUS_TECHNICAL_NOTE.md`)* | **`COMPLETE_VERIFIED`**<br/>*(Mathematical equations, ST-GNN models, assumptions)* |
| **5** | **Demonstration Video** | **Local Repository Master:** [`docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4`](docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4)<br/>**Poster Thumbnail:** [`docs/phase-22/demo/DEMO_THUMBNAIL.png`](docs/phase-22/demo/DEMO_THUMBNAIL.png)<br/>**Validation Report:** [`docs/phase-22/demo/DEMO_VALIDATION_REPORT.md`](docs/phase-22/demo/DEMO_VALIDATION_REPORT.md)<br/>**Publication Report:** [`docs/phase-23/VIDEO_PUBLICATION_REPORT.md`](docs/phase-23/VIDEO_PUBLICATION_REPORT.md) | **`LOCALLY_VALIDATED`**<br/>*(1080p Full HD, 30fps, 160.59s, 10.75 MB; external video hosting pending portal/YouTube upload)* |

---

## 2. COMPETITION PORTAL SUBMISSION CHECKLIST

When uploading to the official competition submission portal, verify each of the following form entries:

### A. Core Project Metadata
- [ ] **Project Name:** NEXBUS — Delhi Urban Mobility Intelligence and Advisory Decision-Support Platform
- [ ] **Category / Track:** Urban Mobility / Smart Cities / Transportation Intelligence / Public Good
- [ ] **Primary Repository URL:** `https://github.com/Mayyank04/Nexbus`
- [ ] **Primary Submission Branch:** `phase-23-final-external-submission-and-judge-readiness`
- [ ] **Live Working Application URL:** `https://nexbus.vercel.app`
- [ ] **License:** MIT License (Open Source)

### B. Written Documentation Files
- [ ] **Proposal Document:** Attached as PDF or linked to `docs/phase-21/NEXBUS_COMPETITION_PROPOSAL.md`.
- [ ] **Technical Note:** Attached as PDF or linked to `docs/phase-21/NEXBUS_TECHNICAL_NOTE.md`.
- [ ] **Executive Pitch Abstract:**
  > *"NEXBUS is a Delhi-focused Urban Mobility Intelligence and Advisory Decision-Support Platform. Built on Next.js 16 and Three.js, it unites an interactive 3D digital twin with accessible 2D vector fallback, multi-criteria Pareto journey routing, and real-time parametric policy simulation. All metrics are grounded in published transport economics, an open nine-tier evidence taxonomy, and an absolute read-only safety invariant."*

### C. Demonstration Video Upload
- [ ] **Upload File:** `docs/phase-22/demo/NEXBUS_COMPETITION_DEMO.mp4` (Size: 10.75 MB, Duration: 2m 40s, 1080p H.264/AAC).
- [ ] **Upload Poster:** `docs/phase-22/demo/DEMO_THUMBNAIL.png` (1920x1080 PNG).
- [ ] **External Streaming URL (if video hosting required):** Upload to YouTube following the metadata in `docs/phase-23/VIDEO_PUBLICATION_REPORT.md` and insert the generated link.
- [ ] **Video Running Time:** Disclosed accurately as `2 minutes 40 seconds`.

### D. Verification & Safety Disclosures
- [ ] **Operational Safety Invariant Disclosed:** `READ-ONLY + PASSIVE + ADVISORY` (No physical vehicle or signal actuation).
- [ ] **Corridor Scope Disclosed:** Models 4 arterial corridors (67 nodes, 226 edges, 15 hubs), not entire 500+ bus route citywide network.
- [ ] **Predictive Model Disclosed:** Crowding forecasts computed by a pre-calibrated ST-GNN surrogate, not live infrared hardware sensors.
- [ ] **Civic Privacy Disclosed:** 100% Client-Side Privacy, Zero PII, spatial coordinate truncation to ~110m radius.

---

## 3. JUDGE EVALUATION ARTIFACT MAP

Judges reviewing the submission are directed to the following structured documents:

1. **Rehearsal & Live Walkthrough Guide:** [`docs/phase-23/JUDGE_DEMONSTRATION_GUIDE.md`](docs/phase-23/JUDGE_DEMONSTRATION_GUIDE.md)  
   *(30s pitch, 3-min walkthrough, 5-min technical review, failover instructions)*
2. **20-Question Technical Defence:** [`docs/phase-23/JUDGE_QA_AND_TECHNICAL_DEFENCE.md`](docs/phase-23/JUDGE_QA_AND_TECHNICAL_DEFENCE.md)  
   *(Evidence-grounded answers citing source code, equations, and tests)*
3. **Judge-Perspective Evaluation:** [`docs/phase-23/JUDGE_PERSPECTIVE_EVALUATION.md`](docs/phase-23/JUDGE_PERSPECTIVE_EVALUATION.md)  
   *(Objective review across Problem Clarity, Functionality, Credibility, Innovation, Impact)*
4. **Video Publication Report:** [`docs/phase-23/VIDEO_PUBLICATION_REPORT.md`](docs/phase-23/VIDEO_PUBLICATION_REPORT.md)  
   *(Stream specs, chapter markers, YouTube metadata, and publication lifecycle)*
5. **Phase 23 Baseline Audit:** [`docs/phase-23/BASELINE_REVIEW.md`](docs/phase-23/BASELINE_REVIEW.md)  
   *(Verification of ancestry, commits, deliverables, and CI runs)*
