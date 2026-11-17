# NEXBUS PHASE 20 — DATA PROVENANCE ARCHITECTURE & PROPAGATION SPECIFICATION

**Scope:** End-to-End Data Lifecycle, Lineage Tracking, and Immutability Contracts  
**Design Standard:** Swiss Transit Cartography & Editorial Monograph  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. END-TO-END DATA PROPAGATION PIPELINE

Transit data in NEXBUS flows through an 8-stage auditable pipeline. At every boundary, the data's evidence classification and lineage metadata are preserved:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        NEXBUS DATA PROPAGATION                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. External Source      (OTD, DTC, DIMTS, DMRC, OSM, CPCB, ARAI)       │
│                                    │                                   │
│ 2. Provider Adapter     (Fetch / Stream with Timeout & Circuit Breaker)│
│                                    │                                   │
│ 3. Validation Gate      (WGS84 Bounds, Schema Guard, Timestamp Sanity) │
│                                    │                                   │
│ 4. Normalization        (Canonical Stop IDs, Speed Unit Standardization│
│                                    │                                   │
│ 5. Storage / Cache      (In-Memory Partition, SW Cache, TTL Eviction)  │
│                                    │                                   │
│ 6. Model / Calculation  (ST-GNN Surrogate, Little's Law, Multimodal)   │
│                                    │                                   │
│ 7. API Route Handler    (Strict Zod Response Contracts & Freshness)    │
│                                    │                                   │
│ 8. UI Component         (Accessible ProvenanceIndicator Badge & Modal) │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. STAGE-BY-STAGE SPECIFICATION

### Stage 1: External Source Registration
- Every dataset originates from a registered institutional publisher documented in `src/data/provenanceRegistry.ts`.
- Sources are identified by stable identifiers (e.g. `prov-otd-gtfs`, `prov-dimts-avl`, `prov-arai-emissions`).
- Unverified external claims are never registered as `OBSERVED`.

### Stage 2: Provider Adapters & Ingestion
- Adapters in `src/lib/ingestion/providers/` handle network communication.
- Enforce strict 5-second timeouts and exponential backoff to prevent downstream hanging.
- If upstream authentication fails (e.g. OTD GTFS-RT token gate), the adapter returns `AUTH_REQUIRED` or `UNAVAILABLE`. It **never** silently substitutes synthetic data as observed data.

### Stage 3: Validation & Geographic Bounding
- Geographic coordinates are validated against the official National Capital Territory of Delhi bounding polygon:
  $$28.40^\circ\text{ N} \le \text{Latitude} \le 28.90^\circ\text{ N}$$
  $$76.80^\circ\text{ E} \le \text{Longitude} \le 77.45^\circ\text{ E}$$
- Timestamps are audited for clock skew. Timestamps $> 5$ minutes in the future are flagged as invalid.

### Stage 4: Normalization
- Terminal and interchange stop clusters are normalized to canonical hub identifiers (e.g. `stop-kashmere-gate`, `stop-aiims`).
- Speeds are normalized to $\text{km/h}$; emissions factors are normalized to $\text{kg CO}_2\text{e/km}$.

### Stage 5: Storage & Partitioned Caching
- Data is stored in memory or transient edge caches partitioned by evidence classification:
  - `HISTORICAL_PUBLISHED`
  - `EMPIRICAL_BENCHMARK`
  - `SYNTHETIC_FIXTURE`
- Cache partitions enforce explicit Time-To-Live (TTL) intervals. Stale data is never relabeled as fresh.

### Stage 6: Analytical Models & Calculations
- **Derived Metrics:** Multi-criteria journey times combine walking duration, wait times, and in-vehicle run times, retaining pointers to input stop pairs.
- **Model Predictions:** ST-GNN crowding predictions retain the model version identifier (`v1.4.2-stgnn`), training data window, and prediction interval coverage probability ($94\%$ PICP).
- **Simulations:** Parametric counterfactuals retain Little's Law equations and elasticity coefficients ($\varepsilon = -0.35$).

### Stage 7: API Route Serialization
- API responses embed the top-level safety invariant:
  ```json
  "safetyInvariant": "READ-ONLY + PASSIVE + ADVISORY"
  ```
- All responses include `evidenceClassification` and live `freshnessStatus`.

### Stage 8: User Interface Presentation
- Handled via `src/components/ui/ProvenanceIndicator.tsx`.
- Commuters and transport analysts see an explicit status pill (`[OBSERVED]`, `[VERIFIED EXTERNAL]`, `[PREDICTED]`, `[SYNTHETIC]`).
- Clicking the pill opens a detailed dossier with source organization, collection timestamp, confidence intervals, and known limitations.

---

## 3. IMMUTABILITY & ELEVATION PREVENTION RULES

Under `preventClassificationElevation()`, the following transitions are strictly prohibited:
1. $\text{SYNTHETIC} \to \text{OBSERVED}$ (Prohibited)
2. $\text{PREDICTED} \to \text{VERIFIED\_EXTERNAL}$ (Prohibited)
3. $\text{SIMULATED} \to \text{OBSERVED}$ (Prohibited)
4. $\text{UNAVAILABLE} \to \text{OBSERVED}$ (Prohibited)

Downstream derivation is permitted only when preserving lineage:
- $\text{OBSERVED} \to \text{DERIVED}$ (Allowed with input references)
- $\text{VERIFIED\_EXTERNAL} \to \text{DERIVED}$ (Allowed with input references)

---

## 4. CONCLUSION

The NEXBUS Data Provenance Architecture guarantees full scientific traceability from municipal source to UI pixel, preventing data laundering and false claims of real-time certainty.
