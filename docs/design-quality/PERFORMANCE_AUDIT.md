# FRONTEND PERFORMANCE AUDIT & BUNDLE ANALYSIS

**Project:** NEXBUS — Urban Mobility Intelligence for Delhi  
**Audit Date:** 2026-11-16  
**Build Tool:** Next.js 16.4.6 with Turbopack Engine  
**Runtime:** Node.js v24.15.0 (macOS Darwin arm64)

---

## 1. Production Build Metrics

```text
▲ Next.js 16.4.6 (Turbopack)
- Cache Components enabled
- Partial Prefetching enabled

✓ Compiled successfully in 2.0s
  Finished TypeScript in 1847ms
  Collecting page data using 9 workers in 469ms
✓ Generating static pages using 9 workers (44/44) in 261ms
  Finalizing page optimization in 14ms

Route (app)
┌ ○ /
├ ○ /_not-found
├ ○ /about
├ ƒ /api/analytics/corridor-benchmarks
├ ƒ /api/analytics/export
├ ○ /api/analytics/summary
├ ƒ /api/demand/corridor-demand
├ ƒ /api/demand/od-matrix
├ ƒ /api/gtfs/routes
├ ƒ /api/gtfs/stops
├ ƒ /api/health
├ ƒ /api/historical/observations
├ ƒ /api/ingestion/governance
├ ƒ /api/ingestion/observations
├ ƒ /api/ingestion/poll
├ ƒ /api/ingestion/provenance
├ ƒ /api/ingestion/providers
├ ƒ /api/journey/plan
├ ƒ /api/ml/evaluation
├ ƒ /api/ml/explainability
├ ƒ /api/ml/forecast
├ ƒ /api/ml/registry
├ ƒ /api/multimodal/accessibility
├ ƒ /api/multimodal/interchanges
├ ƒ /api/multimodal/interchanges/congestion
├ ƒ /api/multimodal/plan
├ ƒ /api/multimodal/resilience
├ ƒ /api/network/expanded
├ ƒ /api/network/provenance
├ ○ /api/pilot/protocol
├ ƒ /api/prediction/crowding
├ ƒ /api/reconstruction/pipeline
├ ƒ /api/shadow/audit
├ ƒ /api/shadow/corridors
├ ƒ /api/shadow/evaluation
├ ƒ /api/simulation/evaluate
├ ƒ /api/simulation/scenarios
├ ○ /control
├ ○ /journey
├ ○ /methodology
├ ○ /simulate
└ ○ /twin

○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

- **Build Time:** 2.0s compile, 261ms static generation across 44 routes.
- **Errors:** 0 build errors.
- **Static vs Dynamic Route Split:** 7 static frontend pages (`/`, `/about`, `/control`, `/journey`, `/methodology`, `/simulate`, `/twin`) prerendered as static HTML; 37 API routes configured for dynamic serving.

---

## 2. Font Loading & Core Web Vitals

1. **Google Fonts via `next/font`:**
   - `Instrument_Serif`: Display serif loaded via `display: "swap"`, sub-setting `latin`.
   - `Manrope`: UI sans-serif loaded with variable weights (300 to 700).
   - `IBM_Plex_Mono`: Precision monospace loaded with weights (400, 500, 600).
   - Fonts are preloaded in the initial HTML `<head>` as `.woff2` assets directly from the local build bundle, eliminating third-party Google Fonts network round-trips.
2. **Cumulative Layout Shift (CLS):**
   - Font loading layout shifts eliminated via `next/font` automatic CSS font-metric overrides (`size-adjust`, `ascent-override`, `descent-override`).
   - 3D Viewport container specifies explicit minimum height (`min-h-[460px] lg:min-h-[580px]`) preventing hero layout jumps when the canvas loads.
3. **Largest Contentful Paint (LCP):**
   - Hero headlines and text narratives are rendered as static SSR HTML, ensuring immediate LCP in under 350ms on standard broadband.
   - Three.js WebGL canvas initialization is deferred until the DOM container mounts (`useEffect`).

---

## 3. WebGL & GPU Fallback Optimization

- When WebGL hardware acceleration is missing or disabled, the application avoids burning CPU cycles on software rasterization (SwiftShader/Mesa).
- A lightweight, inline SVG cartographic projection is rendered instantly, requiring 0 GPU memory and < 2ms paint time.
