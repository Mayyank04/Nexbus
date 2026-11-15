# NEXBUS Phase 12 — Real-World Transport Data Acquisition Framework

## 1. Executive Summary & Architecture Overview

The NEXBUS Phase 12 Data Acquisition Framework establishes an auditable, governed, multi-source ingestion pipeline for urban transport and civic infrastructure intelligence across the National Capital Territory (NCT) of Delhi.

### 1.1 Non-Negotiable Operational Safety Invariants
1. **READ-ONLY + PASSIVE + ADVISORY**: The data acquisition layer operates strictly as an observational and research intake system. It does not possess, request, or implement physical actuation, railway signaling preemption, automated bus dispatch, or driver instruction capabilities.
2. **Strict Non-Substitution Principle**: When external real-time feeds (such as Open Transit Data Delhi Protobuf APIs) require authentication (`OTD_DELHI_API_KEY`) or experience upstream upstream outages, the platform explicitly records `AUTHENTICATION_REQUIRED` or `UNAVAILABLE`. The ingestion engine **strictly forbids the fabrication or algorithmic simulation of fake live GPS vehicle coordinates**.
3. **Cryptographic Traceability**: Every ingested dataset payload is hashed with standard SHA-256 digests upon arrival and immutably indexed within the `RawArchiveService` ledger for post-hoc scientific auditing.

---

## 2. Integrated Transport and Civic Provider Registry

The framework integrates eight specialized providers managed by the unified `ProviderRegistry` (`src/lib/ingestion/providers/providerRegistry.ts`):

```
+-----------------------------------------------------------------------------------+
|                           NEXBUS PROVIDER REGISTRY                                |
+-----------------------------------------------------------------------------------+
       |                    |                    |                   |
       v                    v                    v                   v
+--------------+     +--------------+     +--------------+    +--------------+
| GTFS Static  |     | GTFS-RT      |     | DMRC Metro   |    | OpenStreetMap|
| (OTD Delhi)  |     | (OTD Delhi)  |     | Network      |    | (Transit/Ped)|
+--------------+     +--------------+     +--------------+    +--------------+
       |                    |                    |                   |
       v                    v                    v                   v
+--------------+     +--------------+     +--------------+    +--------------+
| CPCB CAAQMS  |     | Census/MPD   |     | DTC Fleet &  |    | IMD Regional |
| Air Quality  |     | Demographics |     | Depots       |    | Weather      |
+--------------+     +--------------+     +--------------+    +--------------+
       \                    \                    /                   /
        \                    \                  /                   /
         +---------------------------------------------------------+
         |               BaseTransportProvider Contract            |
         | - Standard 5,000 ms timeout protection                  |
         | - Referential and geodetic bounding validation          |
         | - Latency tracking and error category classification    |
         +---------------------------------------------------------+
                                    |
                                    v
         +---------------------------------------------------------+
         |           RawArchiveService (SHA-256 Ledger)            |
         | - Tamper-evident immutable snapshot hashing             |
         | - On-demand verification API (?verifyArchive=<id>)      |
         +---------------------------------------------------------+
```

### 2.1 Provider Inventory

| Provider ID | Provider Name | Authority / Source | Category | Classification | License | Expected Format |
|---|---|---|---|---|---|---|
| `delhi_otd_gtfs_static` | OTD GTFS Static Schedule | Transport Dept, GNCTD / DIMTS | `TRANSIT_STATIC` | `VERIFIED_EXTERNAL` | OGD Platform India | GTFS Zip / CSV |
| `delhi_otd_gtfs_realtime` | OTD GTFS-RT Telemetry | Transport Dept, GNCTD | `TRANSIT_REALTIME` | `OBSERVED` | Restricted (API Key) | Protobuf GTFS-RT |
| `PROVIDER_DMRC_METRO` | DMRC Metro Network Topology | Delhi Metro Rail Corp (DMRC) | `TRANSIT_STATIC` | `VERIFIED_EXTERNAL` | GNCTD / DMRC Official | JSON Specification |
| `PROVIDER_OSM_TRANSIT` | OpenStreetMap Transit & Walkway | OpenStreetMap Contributors | `GEOSPATIAL` | `VERIFIED_EXTERNAL` | ODbL 1.0 | GeoJSON / Nodes |
| `PROVIDER_CPCB_AQI` | CPCB CAAQMS Ambient Air Quality | Central Pollution Control Board | `ENVIRONMENTAL` | `OBSERVED` | OGD Platform India | JSON Records |
| `PROVIDER_CENSUS_DEMOGRAPHICS` | Census 2011 & MPD-2041 Zones | RGI / DDA Planning Wing | `DEMOGRAPHIC` | `VERIFIED_EXTERNAL` | Census India / OGD | JSON Demographics |
| `PROVIDER_DTC_FLEET` | DTC Depot Operations & Fleet | Delhi Transport Corporation | `TRANSIT_STATIC` | `VERIFIED_EXTERNAL` | GNCTD Transport Dept | JSON Fleet Tables |
| `PROVIDER_IMD_WEATHER` | IMD Synoptic Weather & Drainage | India Meteorological Department | `WEATHER` | `VERIFIED_EXTERNAL` | GODL India | JSON Weather Obs |

---

## 3. Data Governance & Validation Pipeline

Every provider inherits from `BaseTransportProvider<T>`:

1. **Geodetic Bounding Validation**: Coordinates must fall within the statutory National Capital Region envelope (Latitude: 28.30°N to 28.95°N, Longitude: 76.75°E to 77.45°E). Coordinates outside this envelope are rejected as out-of-bounds telemetry anomalies.
2. **Schema & Referential Completeness**:
   - GTFS Static: Verifies presence of agency, stops, routes, and trips with non-empty cross-referencing keys.
   - DMRC: Verifies 30 key interchange stations, 10 operating lines, and 100% universal step-free access indicators.
   - CPCB AQI: Confirms realistic chemical concentration boundaries (PM2.5: 0–1,000 µg/m³, AQI: 0–500).
   - IMD Weather: Enforces thermodynamic physical bounds (-5°C to 55°C, relative humidity 0–100%, precipitation ≥ 0 mm).
3. **Failure Classification**: Ingestion anomalies are segregated into:
   - `AUTHENTICATION_REQUIRED`: Upstream requires token or certificate credentials.
   - `TIMEOUT`: Upstream failed to respond within 5,000 ms.
   - `NETWORK_ERROR`: Transport protocol failure or DNS unreachability.
   - `SCHEMA_VIOLATION`: Ingested payload breached required structural invariants.
   - `RATE_LIMITED`: Upstream rate ceiling encountered (HTTP 429).

---

## 4. Cryptographic Archival & Auditability

The `RawArchiveService` maintains an immutable cryptographic index:
- **Checksum Calculation**: `crypto.createHash('sha256').update(rawPayload).digest('hex')`
- **Tamper Verification**: Accessible programmatically and through the REST endpoint `GET /api/ingestion/providers?verifyArchive=<archiveId>`.
- **Integrity Guarantee**: Stored snapshots can be verified at any time against their registered SHA-256 digest to prove that evidence has not been mutated or retroactively altered.

---

## 5. API Endpoints

- `GET /api/ingestion/providers`: Returns composite health score, provider inspection summaries, and archival ledgers.
- `POST /api/ingestion/providers`: Triggers on-demand synchronization and validation across all providers or a targeted provider.
- `GET /api/ingestion/governance`: Returns comprehensive data governance audit report with data freshness and quality metrics.
