# NEXBUS PHASE 20 — PWA CACHE GOVERNANCE & OFFLINE SECURITY AUDIT

**Component:** Service Worker (`public/sw.js`) & Web App Manifest (`public/manifest.json`)  
**Cache Partition:** `nexbus-offline-v2` (Legacy Partition: `nexbus-offline-v1`)  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. CACHE POLICY & RESOURCE CLASSIFICATION

NEXBUS implements a strict resource classification strategy to ensure offline resilience without compromising security or user privacy:

| Resource Archetype | Examples | Caching Strategy | Storage Location | Privacy Classification |
| :--- | :--- | :--- | :--- | :--- |
| **Static Shell Assets** | JS bundles, CSS, fonts, SVG icons | **Cache-First** | CacheStorage (`nexbus-offline-v2`) | Public / Non-Sensitive |
| **PWA Manifest & Icons**| `/manifest.json`, `/icons/*.png` | **Cache-First** | CacheStorage (`nexbus-offline-v2`) | Public / Non-Sensitive |
| **Public HTML Shells** | `/`, `/twin`, `/journey`, `/control` | **Network-First** | CacheStorage Fallback | Public / Non-Sensitive |
| **API Telemetry & Routes**| `/api/gtfs/*`, `/api/journey/plan` | **Network-First** | Degraded Offline Synthetic Response | Public Transit Data |
| **Authenticated Data** | User sessions, tokens | **DO NOT CACHE** | N/A (Platform uses zero auth/tokens)| Zero PII |

---

## 2. SERVICE WORKER SECURITY CONTROLS (`public/sw.js`)

### 2.1 Same-Origin Restriction (Anti-Poisoning Guard)
To prevent cross-origin cache poisoning and unauthorized resource interception:
```javascript
if (request.method !== 'GET' || !url.protocol.startsWith('http') || url.origin !== self.location.origin) {
  return;
}
```
Any request directed to third-party domains or non-HTTP schemes (e.g. `chrome-extension://`) immediately bypasses the service worker fetch handler.

### 2.2 Cache Partitioning & Versioned Eviction
When `public/sw.js` updates to `nexbus-offline-v2`, the `activate` event automatically iterates through existing cache names and deletes outdated partitions:
```javascript
caches.keys().then((cacheNames) => {
  return Promise.all(
    cacheNames
      .filter((name) => name !== CACHE_NAME)
      .map((name) => caches.delete(name))
  );
})
```
This guarantees that commuters never receive stale JavaScript or outdated transit schedules following a system deployment.

---

## 3. OFFLINE DEGRADATION & ERROR INTEGRITY

When an active commuter enters an underground metro tunnel or experiences cellular dropouts, requests to `/api/*` fail at the network layer.

### 3.1 Offline Degradation Envelope
The service worker intercepts failed `/api/*` calls and serves an explicit degradation envelope:
```javascript
return new Response(
  JSON.stringify({
    success: false,
    degraded: true,
    offline: true,
    evidenceClassification: 'UNAVAILABLE',
    freshnessStatus: 'UNAVAILABLE',
    error: 'OFFLINE_DEGRADATION',
    message: 'Device is offline. Live external transit telemetry is paused.',
    timestamp: new Date().toISOString(),
  }),
  {
    headers: {
      'Content-Type': 'application/json',
      'X-Nexbus-Degraded': 'true',
      'X-Nexbus-Offline': 'true',
      'X-Nexbus-Evidence-Classification': 'UNAVAILABLE',
      'Cache-Control': 'no-store, no-cache',
    },
    status: 200,
  }
);
```

### 3.2 Non-Masquerading Principle
Under Section 6.2 of Phase 20:
- The offline envelope includes `'X-Nexbus-Degraded': 'true'` and `evidenceClassification: 'UNAVAILABLE'`.
- The frontend UI uses these headers to display a subtle, non-intrusive offline status banner.
- Offline responses are **never** presented as live or observed transit updates.

---

## 4. ZERO PII & USER PRIVACY VERIFICATION

An audit of the Service Worker and CacheStorage implementations confirmed:
- Zero cookies, session identifiers, or tokens stored in CacheStorage.
- Zero commuter search queries or origin/destination pairs cached in persistent storage.
- All offline functionality relies exclusively on public, static timetable geometries.

**Audit Status:** 100% Tested and Verified in `scripts/test-phase20-governance.mjs`.
