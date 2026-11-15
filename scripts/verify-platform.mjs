// Automated Platform Verification Test Suite for NEXBUS
import http from 'http';

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

async function runTests() {
  console.log('=== NEXBUS AUTOMATED PLATFORM VERIFICATION ===\n');
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

  // 1. Frontend Route Health Checks
  const routes = [
    '/',
    '/twin',
    '/journey',
    '/simulate',
    '/control',
    '/methodology',
    '/about',
  ];

  console.log('--- Testing Frontend Routes ---');
  for (const route of routes) {
    const res = await fetchUrl(route);
    assert(
      res.status === 200,
      `Route "${route}" returns HTTP 200 (Got: ${res.status})`
    );
    assert(
      res.text.includes('NEXBUS'),
      `Route "${route}" contains NEXBUS branding`
    );
  }

  // 2. Security Headers Check
  console.log('\n--- Testing Security Headers ---');
  const homeRes = await fetchUrl('/');
  assert(
    homeRes.headers.get('x-frame-options') === 'SAMEORIGIN',
    'Security Header: X-Frame-Options is SAMEORIGIN'
  );
  assert(
    homeRes.headers.get('x-content-type-options') === 'nosniff',
    'Security Header: X-Content-Type-Options is nosniff'
  );

  // 3. API Route Tests: GTFS Routes & Stops
  console.log('\n--- Testing GTFS API Endpoints ---');
  const routesApi = await fetchUrl('/api/gtfs/routes');
  assert(
    routesApi.status === 200 && routesApi.json?.success === true,
    'GET /api/gtfs/routes returns valid route list'
  );
  assert(
    routesApi.json?.data?.length >= 4,
    `Routes list contains >= 4 arterial corridors (Found: ${routesApi.json?.data?.length})`
  );

  const stopsApi = await fetchUrl('/api/gtfs/stops');
  assert(
    stopsApi.status === 200 && stopsApi.json?.success === true,
    'GET /api/gtfs/stops returns valid stop network'
  );
  assert(
    stopsApi.json?.data?.some((s) => s.id === 'stop-aiims'),
    'Stops list includes AIIMS hub'
  );

  // 4. API Route Tests: Crowding Prediction & Confidence Bounds
  console.log('\n--- Testing Crowding Prediction API ---');
  const predApi = await fetchUrl(
    '/api/prediction/crowding?corridorId=corridor-ring-road&hour=9'
  );
  assert(
    predApi.status === 200 && predApi.json?.prediction?.loadPercentage > 0,
    'GET /api/prediction/crowding calculates load percentage'
  );
  assert(
    Array.isArray(predApi.json?.prediction?.bounds?.ci95) &&
      predApi.json?.prediction?.bounds?.ci95.length === 2,
    'Crowding prediction includes 95% Bayesian Confidence Interval'
  );
  assert(
    predApi.json?.prediction?.confidenceScore >= 90,
    `Confidence score meets high-reliability threshold (Score: ${predApi.json?.prediction?.confidenceScore}%)`
  );

  // 5. API Route Tests: Journey Planning (3 Pareto Recommendation Tiers)
  console.log('\n--- Testing Multi-Criteria Journey Planning API ---');
  const journeyApi = await fetchUrl('/api/journey/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      originId: 'stop-aiims',
      destinationId: 'stop-cp-regal',
      date: '2026-11-15',
      time: '09:15',
    }),
  });
  assert(
    journeyApi.status === 200 && journeyApi.json?.success === true,
    'POST /api/journey/plan successfully computes multi-criteria route'
  );
  const planTypes = journeyApi.json?.plans?.map((p) => p.type) || [];
  assert(
    planTypes.includes('FASTEST') &&
      planTypes.includes('BALANCED') &&
      planTypes.includes('COMFORT FIRST'),
    'Journey planner generates all 3 required tiers: FASTEST, BALANCED, COMFORT FIRST'
  );

  // 6. API Route Tests: Counterfactual Simulation
  console.log('\n--- Testing Scenario Simulation API ---');
  const simApi = await fetchUrl('/api/simulation/evaluate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      corridorId: 'corridor-ring-road',
      additionalBuses: 16,
      targetHeadwayMin: 5,
      signalPriority: true,
    }),
  });
  assert(
    simApi.status === 200 && simApi.json?.scenario?.deltas?.waitTimeDeltaPct < 0,
    'POST /api/simulation/evaluate returns positive wait time reduction'
  );
  assert(
    simApi.json?.scenario?.environmentalImpact?.monthlyCo2OffsetTons > 0,
    'Simulation computes verified tailpipe CO2 reduction tonnage'
  );
  assert(
    Array.isArray(simApi.json?.scenario?.modelAssumptions),
    'Simulation explicitly lists empirical model assumptions'
  );

  // 7. Error Handling on Malformed Input
  console.log('\n--- Testing API Input Validation & Error Handling ---');
  const badJourney = await fetchUrl('/api/journey/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: 'invalid-json-body-string',
  });
  assert(
    badJourney.status === 400 && badJourney.json?.success === false,
    'POST /api/journey/plan rejects malformed JSON with HTTP 400'
  );

  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
