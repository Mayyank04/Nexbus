# NEXBUS PHASE 14 — INSTITUTIONAL RESEARCH BENCHMARKING DASHBOARD SPECIFICATION

**Document Version:** 1.0.0  
**Phase Milestone:** Phase 14 — Independent Scientific Reproduction & Field Pilot  
**Component:** `src/components/research/Phase14BenchmarkDashboard.tsx`  
**Route:** `/control`  
**Operational Invariant:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Dashboard Architecture & User Experience

Mounted in `/control`, the **Phase 14 Research Benchmarking Console** provides transport planners, researchers, and audit committees with an interactive decision-support interface.

### Six Specialized Analytical Panes:
1. **1. Research & Pilot Status:** Displays high-level protocol status (`PREPARED_FOR_FIELDWORK`), 14.8 km corridor scope, and the 9-counter fieldwork disaggregation grid (Planned, Completed, Submitted, Valid, Verified Field, Unverified, Demonstration Fixtures, Simulations, Rejected).
2. **2. Journey-Time Baselines:** Compares the production ST-GNN Surrogate (`v1.4.2-stgnn`) against 4 conventional baselines (Scheduled Timetable, Historical Median, Time-of-Day Median, SMA-5). Displays MAE, RMSE, MedAE, bias, MAPE, and worst-case $P_{95}$ errors alongside cluster-adjusted 95% bootstrap intervals.
3. **3. Headway & EWT Formulations:** Interactively presents the Welding-Osuna formulation ($\text{EWT} = \sigma^2 / 2\mu$) for random arrivals ($\mu \le 12\text{ min}$) alongside the Seddon-Day timetable model for suburban routes ($\mu > 12\text{ min}$). Clarifies the resolution of Phase 13 transcription errors.
4. **4. OD Screenline GEH Fit:** Tabulates modeled vs observed passenger volumes across 8 strategic screenlines, demonstrating a $100.0\%$ compliance pass rate ($\text{GEH} < 5.0$) against RITES ground-truth cordon surveys.
5. **5. ML Generalization Holdout:** Summarizes dual-axis holdout performance on unvisited corridors (Outer Ring Road and GT Road North), showing a modest $1.25\times$ geographic transfer degradation and calibrated $95.6\%$ Bayesian credible interval coverage.
6. **6. Benchmark Evidence Explorer:** Allows on-demand cryptographic inspection of all 8 registered external benchmark datasets (SHA-256 digests, license terms, anti-leakage isolation, and limitations).

---

## 2. Invariant & Transparency Guarantees

- **No False Zeros:** Missing observations or gated providers are never represented as zero values; they explicitly display `UNAVAILABLE` or `AUTH GATED`.
- **Causal Temporal Integrity:** Predictions display prediction generation timestamps, input cutoff timestamps, and model version stamps to prove the absence of lookahead leakage.
- **Safety Badge:** Permanently affirms `READ-ONLY + PASSIVE + ADVISORY` across all views.
