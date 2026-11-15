# NEXBUS Phase 15 — Independent Review Protocol

**Protocol Identifier**: `IRP-PHASE15-REVIEW-PROTOCOL-2026`  
**Purpose**: Comprehensive audit guidelines for independent academic, municipal, and institutional reviewers.  
**Operational Invariant**: `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. Review Principles & Standards

Independent reviewers evaluating the NEXBUS platform must conduct their assessment in accordance with four non-negotiable principles:

1. **Source Authenticity over Self-Certification**: Code passing unit tests does not establish real-world truth. Evaluators must verify the provenance and authenticity of every input feed.
2. **Epistemological Classification Compliance**: Evaluators must verify that simulated data is never classified as `OBSERVED`, and that `DERIVED` or `ESTIMATED` metrics are clearly marked.
3. **Zero Lookahead & Data Leakage**: Evaluators must verify that test partitions, cutoffs, and holdout corridors are temporally and geographically isolated from training.
4. **Passive Advisory Safety**: Evaluators must verify that the platform remains completely read-only, non-actuating, and without vehicle dispatch or signal control mechanisms.

---

## 2. Review Methodology & Verification Checklist

Reviewers must execute and document findings across 8 formal audit domains:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   INDEPENDENT REVIEW DOMAIN MATRIX                     │
├────────────────────┬───────────────────────────────────────────────────┤
│ Domain 1: Sources  │ Check SHA-256 digests in source_manifest.json     │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 2: Journey  │ Run scripts/phase15-journey-validation.mjs        │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 3: Headway  │ Run scripts/phase15-headway-validation.mjs        │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 4: OD Flows │ Run scripts/phase15-od-validation.mjs             │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 5: ML Models│ Run scripts/phase15-ml-holdout-validation.mjs     │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 6: Access   │ Inspect docs/phase-15/PHYSICAL_ACCESSIBILITY_...  │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 7: Socio-Eco│ Verify 20-yr DCF & CEA emissions equations        │
├────────────────────┼───────────────────────────────────────────────────┤
│ Domain 8: Ethics   │ Verify ethics status is PENDING / UNVERIFIED      │
└────────────────────┴───────────────────────────────────────────────────┘
```

### Review Step-by-Step Execution:
1. Clone the repository and checkout branch `phase-15-controlled-field-execution-and-independent-validation`.
2. Execute the master reproduction harness:
   ```bash
   node scripts/phase15-reproduce-all.mjs
   ```
3. Confirm that all four domain harnesses (`phase15-audit-data-registry.mjs`, `phase15-journey-validation.mjs`, `phase15-headway-validation.mjs`, `phase15-od-validation.mjs`, `phase15-ml-holdout-validation.mjs`) exit with code 0.
4. Verify that no mock or synthetic records have been tagged with `CollectionStatus = VERIFIED_FIELD_OBSERVATION`.
5. Verify that `ethicsApprovalStatus` is displayed as `PENDING` on all dashboards and API responses.
