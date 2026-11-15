# NEXBUS Phase 12 — Data Platform Security & Provenance Integrity

## 1. Executive Summary & Security Objectives

The NEXBUS platform ingests, processes, and disseminates urban mobility intelligence for the Delhi National Capital Territory. Protecting the integrity of external telemetry feeds, preserving citizen privacy during field research, and preventing unauthorized dispatch actuation are fundamental architectural mandates.

---

## 2. Server-Side Credential Isolation

1. **Zero Client Leakage Guarantee:**
   - Ingestion credentials such as `OTD_DELHI_API_KEY` and research anonymization salts (`NEXBUS_ETHICAL_RESEARCH_SALT_2026`) are loaded strictly on the Node.js server runtime via environment variables.
   - None of these credentials carry the `NEXT_PUBLIC_` prefix, preventing Next.js bundlers from injecting them into client JavaScript bundles.
2. **Transparent Authentication Gating:**
   - When external tokens are unconfigured, the system reports `AUTHENTICATION_REQUIRED` or `UNAVAILABLE` across institutional APIs.
   - In accordance with the **Strict Non-Substitution Principle**, the system never falls back to algorithmic synthetic coordinate simulation while masquerading as live authenticated feeds.

---

## 3. Cryptographic Archival & Tamper Detection

1. **SHA-256 Digest Ledger (`RawArchiveService`):**
   - Every ingested dataset is hashed using standard SHA-256 upon arrival:
     $$\text{Digest} = \text{SHA-256}(\text{Raw JSON Payload})$$
   - Hashes are logged in an append-only in-memory ledger and correlated with provider metadata, timestamp, payload byte size, and record count.
2. **On-Demand Auditability (`GET /api/ingestion/providers?verifyArchive=<archiveId>`):**
   - Auditors can query any historical archive ID to trigger re-computation of the cryptographic checksum and assert zero byte-level corruption or retroactive mutation.

---

## 4. Privacy-by-Design & Zero-PII Enforcement

1. **Observer Pseudonymization**:
   - Field surveyors are identified exclusively by salted HMAC-SHA256 digests (`OBS-xxxxxxxxxx`). Personal phone numbers, names, and device identifiers are stripped immediately upon submission.
2. **Geodetic Coordinate Truncation**:
   - Spatial coordinates are truncated to 4 decimal places ($\approx 11\text{ meters}$ resolution), preventing tracking of individual pedestrian trajectories.
3. **Temporal Quantization**:
   - Observation timestamps are rounded to 15-second quantiles.
4. **k-Anonymity on Demand Flows**:
   - Matrix cells with fewer than $k = 15\text{ passengers/hour}$ are suppressed ($T_{ij} = 0$).

---

## 5. Denial-of-Service & Input Sanitization Defenses

1. **Payload Size Ceilings:**
   - Ingestion APIs enforce a strict $500\text{ KB}$ request body limit (`HTTP 413 Payload Too Large`), preventing memory exhaustion attacks via oversized JSON payloads.
2. **Timeout Protection:**
   - External provider queries are wrapped in a $5,000\text{ ms}$ abort controller ceiling (`BaseTransportProvider`), preventing upstream hang cascading.
3. **HTTP Security Headers (`next.config.ts`):**
   - `Content-Security-Policy`: Restricts resource loads to trusted origins.
   - `X-Frame-Options: SAMEORIGIN`: Prevents clickjacking framing.
   - `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing attacks.
   - `Referrer-Policy: strict-origin-when-cross-origin`: Minimizes referrer leakage.
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Disables browser sensor access.

---

## 6. Operational Safety Invariant

**READ-ONLY + PASSIVE + ADVISORY**:
The platform architecture strictly isolates analytical endpoints from any physical transport actuation or signalling network. Under no circumstances can API requests trigger physical bus dispatch, signal phase changes, or automated railway route locking.
