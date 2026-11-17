# NEXBUS PHASE 20 — OBSERVABILITY, STRUCTURED LOGGING & CIVIC PRIVACY AUDIT

**Scope:** Telemetry Architecture, Diagnostic Logging, Commuter Data Protection  
**Safety Invariant:** `READ-ONLY + PASSIVE + ADVISORY`

---

## 1. PRIVACY-CONSCIOUS OBSERVABILITY ARCHITECTURE

NEXBUS implements an observability architecture designed specifically for civic platforms. It delivers comprehensive diagnostic clarity for transport engineers while strictly prohibiting the collection of personal commuter data.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   STRUCTURED OBSERVABILITY LOG                         │
├────────────────────┬───────────────────────────────────────────────────┤
│ Log Field          │ Content & Governance Rule                         │
├────────────────────┼───────────────────────────────────────────────────┤
│ `timestamp`        │ ISO-8601 UTC timestamp                            │
│ `correlationId`    │ Random UUID generated per request for tracing     │
│ `route`            │ Endpoint path (e.g. `/api/prediction/crowding`)   │
│ `operation`        │ Analytical function executed                      │
│ `providerId`       │ External source queried (e.g. `prov-otd-gtfs`)    │
│ `durationMs`       │ Execution latency in milliseconds                 │
│ `status`           │ HTTP status or internal success/fail code         │
│ `evidenceClass`    │ Classification of served payload                  │
└────────────────────┴───────────────────────────────────────────────────┘
```

---

## 2. PROHIBITED LOGGING FIELDS (ZERO PII ENFORCEMENT)

Under the NEXBUS Civic Privacy Mandate, the logging engine in `src/lib/logger.ts` enforces automated redaction of sensitive telemetry:

### Strictly Prohibited from Logs:
1. **Zero IP Addresses:** Client IP addresses used for rate limiting exist solely in memory for the 60-second sliding window and are never written to log files.
2. **Zero Precise Geolocation:** Commuter device GPS coordinates are never collected, logged, or queried (`navigator.geolocation` disabled).
3. **Zero Credentials or Headers:** `Authorization`, `Cookie`, and `x-nexbus-internal-secret` headers are stripped prior to log emission.
4. **Zero Commuter Trip Histories:** User journey queries are processed in memory only and discarded upon HTTP response completion.

---

## 3. EXTERNAL PROVIDER HEALTH & STATUS REPORTING

External data source availability is monitored honestly via `/api/health` and `/api/network/provenance`:
- **Available:** Connected, serving live data within expected latency bounds.
- **Auth Required:** Connected, but requires institutional API key (e.g. OTD GTFS-RT).
- **Degraded / Unavailable:** Temporarily unreachable or timing out.
- **Not Tested:** Endpoint unconfigured or not active on host.

**Governance Rule:** An adapter file existing on disk does **not** equal provider availability. Providers are reported as available only when live HTTP/socket connectivity is confirmed.

---

## 4. CONCLUSION

NEXBUS proves that high-performance observability and diagnostic reliability can be achieved without compromising civic privacy or subjecting commuters to digital surveillance.
