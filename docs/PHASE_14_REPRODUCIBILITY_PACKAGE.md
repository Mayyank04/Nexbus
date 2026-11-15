# NEXBUS PHASE 14 — INDEPENDENT SCIENTIFIC REPRODUCIBILITY PACKAGE

**Document Version:** 1.0.0  
**Phase Milestone:** Phase 14 — Independent Scientific Reproduction & Field Pilot  
**Date:** 2026-11-15  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Master Reproduction Command

An independent researcher or institutional auditor can execute the entire Phase 14 validation suite via a single, self-contained runner:

```bash
node scripts/phase14-reproduce-all.mjs
```

### Script Execution Manifest:
1. `node scripts/phase14-statistical-corrections.mjs` — Headway EWT arithmetic proof, wait penalty ($C_v^2$), cluster-aware bootstrap.
2. `node scripts/audit-external-benchmark-data.mjs` — 8 external reference datasets, 4-tier separation, SHA-256 cryptographic verification.
3. `node scripts/phase14-journey-benchmark.mjs` — 240 matched runs, 4 baseline models, cluster-adjusted bootstrap CI ($[0.80, 1.01]\text{ min}$).
4. `node scripts/phase14-headway-benchmark.mjs` — Welding-Osuna formulation, Seddon-Day timetable transition, 5 mathematical unit tests.
5. `node scripts/phase14-od-screenline-validation.mjs` — RITES 16-hr counts, 8 screenlines, GEH $< 5.0$ pass rate ($100.0\%$).
6. `node scripts/phase14-ml-independent-holdout.mjs` — Dual-axis holdout, geographic transfer, Bayesian PICP-95 calibration ($95.6\%$).
7. `node scripts/validate-economic-assumptions.mjs` — 20-year DCF model ($r = 8.0\%$, $AF = 9.8181$, $\text{BCR} = 4.07\text{x}$).
8. `node scripts/validate-environmental-claims.mjs` — Well-to-Wheel bus emissions (CEA factor $0.716\text{ kg CO}_2/\text{kWh}$, $45.2\%$ net abatement).

---

## 2. Reproducibility Metadata Schema

Every execution of `scripts/phase14-reproduce-all.mjs` records structured metadata:

```json
{
  "runId": "RUN-PHASE14-1794755374987-b4852200",
  "executionTimestamp": "2026-11-15T15:09:34.987Z",
  "gitCommitBaseline": "2be6720d471308b6fd6125d7354261a7edd437b5",
  "operationalInvariant": "READ-ONLY + PASSIVE + ADVISORY",
  "modulesExecuted": 8,
  "modulesPassed": 8,
  "reproducibilityScorePct": 100.0
}
```

---

## 3. Seven-Step Independent Reviewer Workflow

An external researcher auditing NEXBUS must follow this sequential protocol:

1. **Step 1 — Verify Repository Baseline:**
   Ensure your local checkout matches the certified Phase 14 head commit:
   ```bash
   git rev-parse HEAD
   ```
2. **Step 2 — Verify External Benchmark Hashes:**
   Run the benchmark audit script to cryptographically match SHA-256 digests:
   ```bash
   node scripts/audit-external-benchmark-data.mjs
   ```
3. **Step 3 — Execute Headway & Statistical Audits:**
   Confirm that the Welding-Osuna formula parameters ($\mu = 6.2\text{ min}$, $\sigma = 2.1\text{ min}$) yield $\text{EWT} = 21.3\text{ s}$ and wait penalty $11.5\%$:
   ```bash
   node scripts/phase14-statistical-corrections.mjs
   ```
4. **Step 4 — Evaluate Baseline Models on Journey Times:**
   Execute the journey-time benchmark to verify that the ST-GNN surrogate outperforms static timetables and moving averages:
   ```bash
   node scripts/phase14-journey-benchmark.mjs
   ```
5. **Step 5 — Inspect Screenline Flow GEH Statistics:**
   Validate Furness IPF convergence and GEH $< 5.0$ fit across all 8 strategic cordons:
   ```bash
   node scripts/phase14-od-screenline-validation.mjs
   ```
6. **Step 6 — Evaluate Bayesian Calibration & OOD Stress:**
   Verify that the 95% Bayesian credible interval achieves between $93\%$ and $97\%$ coverage:
   ```bash
   node scripts/phase14-ml-independent-holdout.mjs
   ```
7. **Step 7 — Record & Publish Deviations:**
   Compare the generated outputs against `docs/PHASE_14_FINAL_CERTIFICATION_REPORT.md` and log any hardware-dependent runtime discrepancies.

### Epistemological Integrity Assertion:
*Notice: This reproducibility package defines the standardized audit workflow for external scientific peer reviewers. NEXBUS explicitly states that an external independent auditor has not yet performed an external blind institutional review; all verifications herein reflect reproducible internal audits conducted by the multidisciplinary engineering team.*
