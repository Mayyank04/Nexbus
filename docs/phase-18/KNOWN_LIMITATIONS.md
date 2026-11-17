# NEXBUS PHASE 18 — KNOWN LIMITATIONS & FUTURE RESEARCH ROADMAP

**Document Version:** 1.0.0 (Phase 18 Release)  
**Classification:** Transparent Scientific Disclosure  
**Operating Boundary:** `READ-ONLY + PASSIVE + ADVISORY`  

---

## 1. Current Architectural Boundaries & Known Limitations

1. **Passive Advisory Boundary:** NEXBUS intentionally has zero automated dispatch actuators or physical traffic signal integration. This is an intentional safety invariant to protect public transit operations from software bugs or external interference.
2. **In-Memory Rate Limiting in Single-Instance Mode:** The default rate limiter in `src/middleware.ts` uses an in-memory Map. For horizontal deployments spanning multiple Kubernetes pods, an external Redis or Upstash instance is required for centralized token bucket tracking.
3. **Synthetic Holdout Calibration:** Where real-time AVL streams experience GPS multipath dropouts (e.g. dense urban canyons under metro viaducts), vehicle positions snap to scheduled GTFS waypoints using an emission-transition Hidden Markov Model (HMM) rather than raw noisy sensor pings.
4. **Desktop Native Packaging:** Desktop packages via Tauri require a local Rust toolchain (`cargo`, `rustc`) on the build machine. The web PWA is the zero-install alternative available immediately.
5. **Mobile 3D Memory Footprint:** On Android Go devices with $\le 1\text{ GB}$ of RAM, high WebGL texture allocations may trigger browser tab reclamation. NEXBUS mitigates this via automatic context loss detection and seamless fallback to the 2D vector schematic.

---

## 2. Future Engineering Roadmap

- **Phase 19:** Centralized Redis cluster integration for distributed rate limiting and persistent live observation ring buffers.
- **Phase 20:** Multilingual localization supporting Hindi (`hi-IN`) and Urdu (`ur-IN`) alongside English across all routes and the 3D twin guided tutorial.
- **Phase 21:** Real-time WebSockets / Server-Sent Events (SSE) streaming for sub-second bus beacon updates directly into the 3D digital twin.
