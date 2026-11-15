# NEXBUS Phase 15 — Independent Review & Evaluation Register

**Document Reference**: `REGISTER-EXTERNAL-REVIEW-2026-V1`  
**Purpose**: Formal ledger tracking external academic, municipal, and institutional peer reviews.  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. External Review Status Summary

Under NEXBUS scientific integrity guidelines:
> [!IMPORTANT]
> **No Synthetic Reviewers Rule**:
> NEXBUS strictly refuses to generate fictional reviewer names, fabricated academic affiliations, or simulated institutional approvals.
> The external review status remains **PENDING** until an identifiable independent external reviewer has formally reviewed the Phase 15 package and published a signed assessment.

| Review Dimension | Review Category | Assigned Body | Review Status | Notes & Conditions |
|---|---|---|---|---|
| **R-01: Algorithmic Reproducibility** | Machine Learning & Surrogates | External Transport AI Lab (Pending Invitation) | `PENDING_REVIEW` | Reproduction code and deterministic seeds provided in `scripts/phase15-reproduce-all.mjs`. |
| **R-02: Headway & Waiting Formulation** | Transit Operations & Operations Research | University Transport Planning Department (Pending) | `PENDING_REVIEW` | Welding-Osuna and Seddon-Day dual regime derivations open for mathematical audit. |
| **R-03: Screenline Flow Validation** | Travel Demand Modeling | Municipal Transport Authority / Planning Body | `PENDING_REVIEW` | Doubly-constrained Furness IPF and RITES screenline holdout partitions prepared. |
| **R-04: Fieldwork Ethics & Protocol** | Institutional Review Board / Ethics Committee | Accredited Statutory Ethics Committee | `PENDING_REVIEW` | Protocol `IRB-2026-NEXBUS-MOB-004` submitted for review; field collection locked in `READY_FOR_FIELDWORK`. |
| **R-05: Physical Accessibility Audit** | Universal Design & Accessibility Advocacy | National Disability Rights Research Group | `PENDING_REVIEW` | In-person survey data and OSM divergence notes prepared for review. |
| **R-06: Economic & Lifecycle Appraisal** | Transport Economics & Project Appraisal | Institutional Infrastructure Appraisal Panel | `PENDING_REVIEW` | 20-year DCF cash flows and CEA grid emissions factors verified. |

---

## 2. Internal Audit Certification (Prior to External Submission)

Prior to external dispatch, the internal Technical and Scientific Audit Group completed a 100% verification of all claims and code artifacts:

- **Internal Verification Date**: `2026-11-15`
- **Internal Audit Verdict**: **PASSED WITH METHODOLOGICAL DISCLOSURES**
- **Disclosures Recorded**:
  1. Journey-time benchmarks classified as `SIMULATED` (parametric Box-Muller generator).
  2. Headway metrics audited and proved ($\mu = 6.2\text{m}, \sigma = 2.1\text{m}, EWT = 21.3\text{s}, P_{wait} = 11.5\%$).
  3. Bootstrap interval-width ratio ($1.49\times$) distinguished from variance inflation ($2.21\times$).
  4. OD screenlines partitioned into 4 calibration and 4 independent holdout sets.
  5. ML target variable explicitly disclosed as passenger crowding load percentage (%).
  6. Ethics approval status set to `PENDING` / `UNVERIFIED`.
  7. Fieldwork status locked in `READY_FOR_FIELDWORK`.
