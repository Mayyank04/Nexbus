# NEXBUS PHASE 20 — APPLICATION SECURITY & STRIDE THREAT MODEL

**Target:** NEXBUS Civic Mobility Intelligence Platform  
**Methodology:** Microsoft STRIDE Threat Modeling Framework & OWASP Top 10 API Security  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. THREAT ACTORS & ASSET TAXONOMY

### 1.1 Threat Actors Identified
1. **Unauthenticated Public Commuters:** Standard users accessing public transit routes and the 3D Digital Twin.
2. **Adversarial Web Scrapers:** Automated bots attempting to overwhelm APIs or scrape GTFS data.
3. **Malicious Network Actors:** Adversaries attempting man-in-the-middle attacks or cache poisoning over public Wi-Fi.
4. **Compromised CI/CD Runners:** Build environments attempting unauthorized code injections.

### 1.2 Core Assets to Protect
1. **Public Transit Operational Safety:** Complete isolation from vehicle steering, dispatch, braking, or signal switches.
2. **Civic Commuter Privacy:** Total absence of PII, GPS surveillance, or trip-history profiling.
3. **API Availability & Integrity:** Defending against DoS and ensuring authentic data provenance.

---

## 2. STRIDE THREAT MATRIX & MITIGATION CONTROLS

| STRIDE Threat Category | Potential Attack Vector | Applied Mitigation Control in NEXBUS | Verification Status |
| :--- | :--- | :--- | :--- |
| **Spoofing** | Adversary sends `x-nexbus-internal-test: true` to bypass rate limits | Hardened `src/middleware.ts` to require verified 32-char secret in production | 🟢 **MITIGATED & TESTED** |
| **Spoofing** | Untrusted client spoofs commuter location | Platform never uses device GPS; commuters select stops manually | 🟢 **BY DESIGN** |
| **Tampering** | Cache poisoning via cross-origin fetch injection | Service worker `public/sw.js` restricts caching to `self.location.origin` | 🟢 **MITIGATED & TESTED** |
| **Tampering** | Adversary injects out-of-bounds simulation parameters | API routes use strict Zod schemas with bounded numeric limits | 🟢 **MITIGATED & TESTED** |
| **Repudiation** | Data source claims are disputed | Centralized provenance registry with official URLs and validation rules | 🟢 **MITIGATED** |
| **Information Disclosure** | Stack traces or server paths leaked on HTTP 500 | Error handlers suppress internal paths; return structured error envelopes | 🟢 **MITIGATED & TESTED** |
| **Information Disclosure** | Commuter identity or location leaked | Zero user accounts, zero cookies, zero PII collected or stored | 🟢 **BY DESIGN** |
| **Denial of Service** | Botnet floods API endpoints with requests | In-memory sliding-window rate limiter enforces 120 req/min per IP | 🟢 **MITIGATED & TESTED** |
| **Elevation of Privilege** | Adversary attempts to actuate transit vehicles | Zero actuation endpoints exist; read-only safety invariant enforced | 🟢 **IMPOSSIBLE BY DESIGN**|

---

## 3. RATE LIMITING RE-AUDIT (DEF-001 HARDENING)

In Phase 19, an automated test bypass was introduced in `src/middleware.ts` to permit rapid test execution. 

### Vulnerability Identified:
In `src/middleware.ts`, checking `request.headers.get('x-nexbus-internal-test') === 'true'` without checking `process.env.NODE_ENV === 'production'` created a risk where an attacker in production could send that header to bypass the 120 req/min rate limit.

### Remediated Architecture:
```typescript
const isProduction = process.env.NODE_ENV === 'production';
const internalSecret = process.env.NEXBUS_INTERNAL_TEST_SECRET;
const providedSecret = request.headers.get('x-nexbus-internal-secret');

let isAuthorizedTestBypass = false;
if (isProduction) {
  // In production, bypass requires a verified >= 32-character secret
  if (internalSecret && internalSecret.length >= 32 && providedSecret === internalSecret) {
    isAuthorizedTestBypass = true;
  }
} else {
  // In development/test mode, permit loopback or explicit test flags
  const isLoopback = clientIp === '127.0.0.1' || clientIp === '::1' || clientIp === 'localhost';
  if (process.env.NODE_ENV === 'test' || (isLoopback && request.headers.get('x-nexbus-internal-test') === 'true')) {
    isAuthorizedTestBypass = true;
  }
}
```

**Negative Test Proof:** Verified in `scripts/test-phase20-governance.mjs`.

---

## 4. CIVIC PRIVACY & ZERO SURVEILLANCE AUDIT

1. **No Geolocation APIs:** Audited all `.ts` and `.tsx` source files. Found $0$ references to `navigator.geolocation.getCurrentPosition()`.
2. **No Third-Party Trackers:** Audited `package.json` and `src/app/layout.tsx`. Found $0$ tracking scripts, $0$ analytics pixels, and $0$ advertising SDKs.
3. **No Commuter Accounts:** The platform requires no login, no passwords, and stores no user tokens in `localStorage` or `sessionStorage`.

---

## 5. CONCLUSION

The NEXBUS security model provides robust defensive hardening against scraping, tampering, and denial of service while strictly protecting commuter privacy and operational transit boundaries.
