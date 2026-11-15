// Independent Shadow Operations & Ingestion Test Harness for NEXBUS Phase 6
const BASE_URL = 'http://localhost:3000';

async function fetchUrl(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, json, text };
}

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Pure Algorithmic Coordinate & Normalization Tests
const DELHI_BOUNDS = {
  MIN_LAT: 28.40,
  MAX_LAT: 28.88,
  MIN_LNG: 76.84,
  MAX_LNG: 77.40,
};

function validateCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined || isNaN(lat) || isNaN(lng)) return false;
  return lat >= DELHI_BOUNDS.MIN_LAT && lat <= DELHI_BOUNDS.MAX_LAT && lng >= DELHI_BOUNDS.MIN_LNG && lng <= DELHI_BOUNDS.MAX_LNG;
}

function validateTimestamp(timestampStr, maxAgeSeconds = 3600) {
  const ts = new Date(timestampStr).getTime();
  if (isNaN(ts)) return { isValid: false, isStale: true, isFuture: false };
  const ageSeconds = (Date.now() - ts) / 1000;
  const isFuture = ageSeconds < -30;
  const isStale = ageSeconds > maxAgeSeconds;
  return { isValid: !isFuture && !isStale, isStale, isFuture };
}

function fnv1aHash(str) {
  let hash = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

async function runTests() {
  console.log('=== NEXBUS SHADOW OPERATIONS & INGESTION TEST SUITE ===\n');

  // 1. Coordinate Validation Tests
  console.log('--- 1. Testing Coordinate Validation & Bounds Enforcement ---');
  assert(
    validateCoordinates(28.6328, 77.2197) === true,
    'Connaught Place coordinates [28.6328, 77.2197] pass Delhi bounding box check'
  );
  assert(
    validateCoordinates(28.5284, 77.2185) === true,
    'Saket South Delhi coordinates pass bounding box check'
  );
  assert(
    validateCoordinates(19.0760, 72.8777) === false,
    'Mumbai coordinates [19.0760, 72.8777] correctly rejected as out-of-bounds'
  );
  assert(
    validateCoordinates(39.9042, 116.4074) === false,
    'Beijing coordinates correctly rejected as out-of-bounds'
  );
  assert(
    validateCoordinates(undefined, 77.2) === false,
    'Undefined coordinates correctly rejected'
  );

  // 2. Timestamp Validation Tests
  console.log('\n--- 2. Testing Timestamp Drift & Freshness Enforcement ---');
  const now = new Date();
  assert(
    validateTimestamp(now.toISOString(), 120).isValid === true,
    'Current timestamp passes 120s freshness window'
  );
  assert(
    validateTimestamp(new Date(now.getTime() + 60000).toISOString(), 120).isFuture === true,
    'Future timestamp (+60s) flagged as future drift'
  );
  assert(
    validateTimestamp(new Date(now.getTime() - 200000).toISOString(), 120).isStale === true,
    'Stale timestamp (-200s) flagged as stale'
  );

  // 3. FNV-1a Composite Hashing & Normalization
  console.log('\n--- 3. Testing Normalization & Deduplication Logic ---');
  const h1 = fnv1aHash('src-otd|DL1PC-1001|2026-11-15T09:00:00Z');
  const h2 = fnv1aHash('src-otd|DL1PC-1001|2026-11-15T09:00:00Z');
  const h3 = fnv1aHash('src-otd|DL1PC-1002|2026-11-15T09:00:00Z');
  assert(h1 === h2, 'Identical inputs produce deterministic FNV-1a hash');
  assert(h1 !== h3, 'Distinct vehicle inputs produce distinct hashes');

  // 4. API Ingestion Polling Tests
  console.log('\n--- 4. Testing Live Ingestion Endpoints ---');
  const pollRes = await fetchUrl('/api/ingestion/poll', { method: 'POST' });
  assert(
    pollRes.status === 200 && pollRes.json?.success === true,
    'POST /api/ingestion/poll executes ingestion cycle successfully'
  );
  assert(
    pollRes.json?.metrics?.totalIngested > 0,
    `Ingestion cycle reports ingested records (Count: ${pollRes.json?.metrics?.totalIngested})`
  );
  assert(
    Array.isArray(pollRes.json?.sourceHealth) && pollRes.json?.sourceHealth.length >= 6,
    `Source health registry tracks >= 6 feeds (Found: ${pollRes.json?.sourceHealth?.length})`
  );

  const getPollRes = await fetchUrl('/api/ingestion/poll');
  assert(
    getPollRes.status === 200 && typeof getPollRes.json?.metrics?.freshnessLagSeconds === 'number',
    'GET /api/ingestion/poll returns active freshness lag'
  );

  // 5. Ingestion Observations Query Tests
  console.log('\n--- 5. Testing Ingestion Observations API ---');
  const obsRes = await fetchUrl('/api/ingestion/observations?limit=20');
  assert(
    obsRes.status === 200 && Array.isArray(obsRes.json?.observations),
    'GET /api/ingestion/observations returns array of observations'
  );
  assert(
    obsRes.json?.observations?.length > 0,
    `Observations list contains records (Returned: ${obsRes.json?.observations?.length})`
  );
  const firstObs = obsRes.json?.observations[0];
  assert(
    firstObs && (firstObs.provenanceStatus === 'CALIBRATED ESTIMATE' || firstObs.provenanceStatus === 'HISTORICAL DATA' || firstObs.provenanceStatus === 'LIVE OBSERVED DATA'),
    `Observation carries valid provenance tier (${firstObs?.provenanceStatus})`
  );
  assert(
    firstObs?.qualityStatus === 'VALID' || firstObs?.qualityStatus === 'DUPLICATE',
    `Observation carries validated quality status (${firstObs?.qualityStatus})`
  );

  // 6. Shadow Corridor Intelligence Tests
  console.log('\n--- 6. Testing Shadow Corridor Intelligence API ---');
  const corridorsRes = await fetchUrl('/api/shadow/corridors');
  assert(
    corridorsRes.status === 200 && corridorsRes.json?.success === true,
    'GET /api/shadow/corridors returns shadow corridor intelligence'
  );
  assert(
    corridorsRes.json?.corridors?.length >= 4,
    `Tracks >= 4 arterial corridors (Found: ${corridorsRes.json?.corridors?.length})`
  );
  const ringRoad = corridorsRes.json?.corridors?.find((c) => c.corridorId === 'corridor-ring-road');
  assert(
    ringRoad && ringRoad.averageSpeedKmph > 0 && ringRoad.averageSpeedKmph <= 60,
    `Ring Road speed realistically bounded (${ringRoad?.averageSpeedKmph} km/h)`
  );
  assert(
    ringRoad && ringRoad.estimatedHeadwayMin > 0,
    `Ring Road estimated headway computed (${ringRoad?.estimatedHeadwayMin} min)`
  );
  assert(
    corridorsRes.json?.advisoryNotice?.includes('advisory shadow-operation system'),
    'API response includes binding advisory shadow-operation notice'
  );

  // 7. Prediction Monitoring & Online Evaluation Tests
  console.log('\n--- 7. Testing Prediction Monitoring & Drift Evaluation API ---');
  const evalRes = await fetchUrl('/api/shadow/evaluation');
  assert(
    evalRes.status === 200 && evalRes.json?.success === true,
    'GET /api/shadow/evaluation returns online validation dossier'
  );
  assert(
    evalRes.json?.evaluation?.overall?.maePct <= 7.0,
    `Overall shadow MAE meets tolerance threshold (${evalRes.json?.evaluation?.overall?.maePct}%)`
  );
  assert(
    evalRes.json?.evaluation?.overall?.picp95Pct >= 90.0,
    `Overall shadow PICP-95 coverage satisfies standard (${evalRes.json?.evaluation?.overall?.picp95Pct}%)`
  );
  assert(
    evalRes.json?.evaluation?.overall?.driftStatus === 'STABLE' || evalRes.json?.evaluation?.overall?.driftStatus === 'MODERATE_DRIFT',
    `Drift monitor reports valid operational state (${evalRes.json?.evaluation?.overall?.driftStatus})`
  );

  // 8. Shadow Audit Trail & Compliance Tests
  console.log('\n--- 8. Testing Shadow Audit Trail & Compliance API ---');
  const auditRes = await fetchUrl('/api/shadow/audit');
  assert(
    auditRes.status === 200 && Array.isArray(auditRes.json?.auditTrail),
    'GET /api/shadow/audit returns structured audit trail'
  );
  assert(
    auditRes.json?.complianceStatus === 'VERIFIED_READ_ONLY',
    'Audit compliance confirmed as VERIFIED_READ_ONLY'
  );
  assert(
    auditRes.json?.nonInterventionAffirmation?.includes('shadow mode'),
    'Explicit non-intervention affirmation verified'
  );

  // 9. Authority CSV Exports
  console.log('\n--- 9. Testing Authority Shadow CSV Exports ---');
  const shadowCsv = await fetchUrl('/api/analytics/export?type=shadow-audit');
  assert(
    shadowCsv.status === 200 && shadowCsv.text.includes('Corridor_ID') && shadowCsv.text.includes('corridor-ring-road'),
    'GET /api/analytics/export?type=shadow-audit returns valid CSV with headers'
  );

  const qualityCsv = await fetchUrl('/api/analytics/export?type=data-quality');
  assert(
    qualityCsv.status === 200 && qualityCsv.text.includes('Source_ID') && qualityCsv.text.includes('src-otd-vehicle-positions'),
    'GET /api/analytics/export?type=data-quality returns valid CSV with source status'
  );

  console.log(`\n========================================`);
  console.log(`SHADOW OPERATIONS AUDIT: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal shadow test error:', err);
  process.exit(1);
});
