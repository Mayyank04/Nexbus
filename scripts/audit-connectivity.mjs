// Independent Live Connectivity Audit Script for NEXBUS Phase 7
import dns from 'dns/promises';

const PROVIDERS = [
  {
    id: 'prov-otd-static',
    name: 'OTD Delhi Static GTFS Schedule Feed',
    host: 'otd.delhi.gov.in',
    url: 'https://otd.delhi.gov.in/data/static/',
    expectedProtocol: 'HTTPS / HTML Form Gated',
  },
  {
    id: 'prov-otd-vehicle-positions',
    name: 'OTD Delhi GTFS-Realtime VehiclePositions.pb',
    host: 'otd.delhi.gov.in',
    url: 'https://otd.delhi.gov.in/api/realtime/VehiclePositions.pb',
    expectedProtocol: 'GTFS-RT Protobuf (Auth Required)',
  },
  {
    id: 'prov-otd-trip-updates',
    name: 'OTD Delhi GTFS-Realtime TripUpdates.pb',
    host: 'otd.delhi.gov.in',
    url: 'https://otd.delhi.gov.in/api/realtime/TripUpdates.pb',
    expectedProtocol: 'GTFS-RT Protobuf (Unpublished)',
  },
  {
    id: 'prov-osm-overpass',
    name: 'OpenStreetMap Overpass API',
    host: 'overpass-api.de',
    url: 'https://overpass-api.de/api/status',
    expectedProtocol: 'HTTPS / REST',
  },
  {
    id: 'prov-cpcb-aqi',
    name: 'CPCB / SAFAR Ambient Air Quality Portal',
    host: 'app.cpcbccr.com',
    url: 'https://app.cpcbccr.com/AQI_Portal/',
    expectedProtocol: 'HTTPS / Cloudflare Protected',
  },
  {
    id: 'prov-dtc-portal',
    name: 'DTC Official Portal & Ridership Reports',
    host: 'dtc.delhi.gov.in',
    url: 'https://dtc.delhi.gov.in/',
    expectedProtocol: 'HTTPS / Public Government Web',
  },
];

export async function runConnectivityAudit() {
  console.log('=== NEXBUS INDEPENDENT LIVE CONNECTIVITY AUDIT ===\n');
  const results = [];

  for (const prov of PROVIDERS) {
    console.log(`Auditing: ${prov.name} (${prov.host})...`);
    const record = {
      id: prov.id,
      name: prov.name,
      host: prov.host,
      url: prov.url,
      dnsResolvedIp: null,
      dnsLatencyMs: 0,
      httpStatus: null,
      httpLatencyMs: 0,
      contentType: null,
      connectionState: 'UNAVAILABLE',
      failureReason: null,
      authModel: 'NONE',
    };

    // 1. DNS Resolution Test
    const dnsStart = Date.now();
    try {
      const addresses = await dns.resolve4(prov.host);
      record.dnsResolvedIp = addresses[0] || null;
      record.dnsLatencyMs = Date.now() - dnsStart;
      console.log(`  [DNS] Resolved: ${record.dnsResolvedIp} in ${record.dnsLatencyMs}ms`);
    } catch (dnsErr) {
      record.dnsLatencyMs = Date.now() - dnsStart;
      record.failureReason = `DNS resolution failed: ${dnsErr.message}`;
      record.connectionState = 'UNAVAILABLE';
      console.log(`  [DNS] FAIL: ${dnsErr.message}`);
      results.push(record);
      continue;
    }

    // 2. HTTPS Connectivity & Header Inspection
    const httpStart = Date.now();
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(prov.url, {
        method: 'GET',
        headers: {
          'User-Agent': 'NEXBUS-Connectivity-Auditor/1.0 (Transportation Research; Delhi Network Evaluation)',
        },
        signal: controller.signal,
      });
      clearTimeout(timeout);

      record.httpStatus = res.status;
      record.httpLatencyMs = Date.now() - httpStart;
      record.contentType = res.headers.get('content-type') || 'unknown';

      console.log(`  [HTTP] Status: ${record.httpStatus} (${res.statusText}) in ${record.httpLatencyMs}ms | Type: ${record.contentType}`);

      // 3. Classify Explicit Connection State
      if (res.status === 200) {
        if (prov.id === 'prov-otd-static') {
          // Webpage returns 200 but downloads are gated behind registration modal
          record.connectionState = 'AUTHENTICATION_REQUIRED';
          record.authModel = 'REGISTRATION_MODAL_SURVEY';
        } else if (prov.id === 'prov-dtc-portal' || prov.id === 'prov-cpcb-aqi') {
          record.connectionState = 'CONNECTED';
          record.authModel = 'PUBLIC_DOMAIN';
        } else {
          record.connectionState = 'CONNECTED';
        }
      } else if (res.status === 401 || res.status === 403) {
        record.connectionState = 'AUTHENTICATION_REQUIRED';
        record.authModel = 'API_KEY_QUERY_PARAMETER';
      } else if (res.status === 404) {
        record.connectionState = 'UNAVAILABLE';
        record.failureReason = 'Endpoint path returned 404 Not Found (Unpublished or decommissioned)';
      } else if (res.status === 406 || res.status === 429) {
        record.connectionState = 'RATE_LIMITED';
        record.failureReason = `Upstream rate limiting or crawler filter triggered (HTTP ${res.status})`;
      } else {
        record.connectionState = 'INVALID_RESPONSE';
        record.failureReason = `Unexpected status HTTP ${res.status}`;
      }

    } catch (httpErr) {
      record.httpLatencyMs = Date.now() - httpStart;
      record.failureReason = `HTTP fetch error: ${httpErr.message}`;
      record.connectionState = 'UNAVAILABLE';
      console.log(`  [HTTP] FAIL: ${httpErr.message}`);
    }

    console.log(`  [STATE] => ${record.connectionState}\n`);
    results.push(record);
  }

  console.log('============================================================');
  console.log('LIVE CONNECTIVITY AUDIT MATRIX:');
  console.table(
    results.map((r) => ({
      Provider: r.name,
      Status: r.httpStatus || 'N/A',
      Latency: `${r.httpLatencyMs}ms`,
      State: r.connectionState,
      Auth: r.authModel,
    }))
  );
  console.log('============================================================\n');

  return results;
}

// Execute directly if run via node
if (process.argv[1]?.endsWith('audit-connectivity.mjs')) {
  runConnectivityAudit()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Fatal audit error:', err);
      process.exit(1);
    });
}
