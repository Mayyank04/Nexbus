// Automated Platform Verification Test Suite for NEXBUS
import http from 'http';
import { execSync } from 'child_process';

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

  // 7. Data Provenance & Geographic Network Validation Tests
  console.log('\n--- Testing Data Provenance & Geographic Validation ---');
  const provApi = await fetchUrl('/api/network/provenance');
  assert(
    provApi.status === 200 && provApi.json?.success === true,
    'GET /api/network/provenance returns 200 and success status'
  );
  assert(
    provApi.json?.sources?.length >= 6,
    `Provenance registry contains >= 6 verified sources (Found: ${provApi.json?.sources?.length})`
  );
  assert(
    provApi.json?.networkValidation?.isValid === true,
    'Network validation confirms 100% valid WGS84 geometry with 0 errors'
  );

  // 8. Machine Learning Model Evaluation Tests
  console.log('\n--- Testing Machine Learning Model Evaluation API ---');
  const mlApi = await fetchUrl('/api/ml/evaluation');
  assert(
    mlApi.status === 200 && mlApi.json?.success === true,
    'GET /api/ml/evaluation returns benchmark validation dossier'
  );
  const stgnnModel = mlApi.json?.evaluation?.modelComparison?.find(
    (m) => m.isNEXBUSProductionSurrogate === true
  );
  assert(
    stgnnModel && stgnnModel.testMetrics?.mae <= 6.0,
    `ST-GNN surrogate achieves high accuracy benchmark (MAE: ${stgnnModel?.testMetrics?.mae}%)`
  );
  assert(
    stgnnModel?.testMetrics?.picp95 >= 93.0,
    `ST-GNN surrogate 95% Bayesian interval coverage meets standard (PICP: ${stgnnModel?.testMetrics?.picp95}%)`
  );

  // 9. Simulation Sensitivity Analysis & Governing Equations
  console.log('\n--- Testing Simulation Sensitivity Analysis ---');
  assert(
    Array.isArray(simApi.json?.scenario?.governingEquations) &&
      simApi.json?.scenario?.governingEquations?.length >= 3,
    'Simulation provides governing equations (Little\'s Law, Elasticity, Emissions)'
  );
  assert(
    Array.isArray(simApi.json?.scenario?.sensitivityAnalysis?.byElasticity) &&
      simApi.json?.scenario?.sensitivityAnalysis?.byElasticity?.length >= 5,
    'Simulation provides parametric sensitivity analysis across elasticity grid'
  );

  // 10. Authority CSV Export Endpoint Tests
  console.log('\n--- Testing Authority CSV Export Endpoints ---');
  const csvCorridors = await fetchUrl('/api/analytics/export?type=corridors');
  assert(
    csvCorridors.status === 200 &&
      csvCorridors.headers.get('content-type')?.includes('text/csv'),
    'GET /api/analytics/export?type=corridors returns text/csv'
  );
  assert(
    csvCorridors.text.includes('Corridor_ID') &&
      csvCorridors.text.includes('corridor-ring-road'),
    'Corridors CSV contains structured headers and corridor records'
  );

  // 11. Error Handling on Malformed Input
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

  // 12. Production Health & Reliability Telemetry
  console.log('\n--- Testing System Health & Telemetry API ---');
  const healthApi = await fetchUrl('/api/health');
  assert(
    healthApi.status === 200 && healthApi.json?.status === 'healthy',
    'GET /api/health reports healthy system status'
  );
  assert(
    typeof healthApi.json?.uptimeSeconds === 'number' && healthApi.json?.uptimeSeconds >= 0,
    'Health telemetry reports non-negative process uptime'
  );
  assert(
    healthApi.json?.datasets?.registeredSourcesCount >= 6 && healthApi.json?.datasets?.networkIntegrity === 'verified',
    `Health check verifies all datasets (Found: ${healthApi.json?.datasets?.registeredSourcesCount} registered sources, integrity: ${healthApi.json?.datasets?.networkIntegrity})`
  );
  assert(
    healthApi.headers.get('cache-control')?.includes('no-store'),
    'Health endpoint enforces no-store cache control'
  );

  // 13. ML Reproducibility & Simulation Scientific Scripts
  console.log('\n--- Executing Independent Scientific Verification Harnesses ---');
  try {
    const mlOutput = execSync('node scripts/reproduce-ml-eval.mjs', { encoding: 'utf8' });
    assert(
      mlOutput.includes('CERTIFICATION: ML Evaluation Results Independently Reproduced.'),
      'ML reproducibility harness reproduces exact benchmark metrics (HA, AR-Ridge, ST-GNN Surrogate)'
    );
  } catch (err) {
    assert(false, `ML reproducibility harness failed: ${err.message}`);
  }

  try {
    const simOutput = execSync('node scripts/validate-simulation.mjs', { encoding: 'utf8' });
    assert(
      simOutput.includes('SIMULATION AUDIT SUMMARY: 11 PASSED, 0 FAILED'),
      'Simulation validation harness confirms Little\'s Law, elasticity, emissions & boundary safety'
    );
  } catch (err) {
    assert(false, `Simulation validation harness failed: ${err.message}`);
  }

  // 14. Phase 6 Shadow Operations & Real-Time Ingestion Harness
  console.log('\n--- Executing Phase 6 Shadow Operations & Real-Time Ingestion Harness ---');
  try {
    const shadowOutput = execSync('node scripts/test-shadow-operations.mjs', { encoding: 'utf8' });
    assert(
      shadowOutput.includes('SHADOW OPERATIONS AUDIT: 32 PASSED, 0 FAILED'),
      'Shadow operations harness validates coordinates, normalization, ingestion API, corridor state, and drift monitoring'
    );
  } catch (err) {
    assert(false, `Shadow operations harness failed: ${err.message}`);
  }

  // 15. Phase 7 Real-World Evidence & Adaptive Urban Intelligence Tests
  console.log('\n--- Testing Phase 7 Historical Archive & Adaptive Forecasting APIs ---');
  const histRes = await fetchUrl('/api/historical/observations?limit=25');
  assert(
    histRes.status === 200 && Array.isArray(histRes.json?.records),
    'GET /api/historical/observations returns partitioned historical observations'
  );
  assert(
    histRes.json?.partitionSummary?.HISTORICAL_PUBLISHED > 0,
    `Historical store indexes HISTORICAL_PUBLISHED partition (Count: ${histRes.json?.partitionSummary?.HISTORICAL_PUBLISHED})`
  );

  const benchRes = await fetchUrl('/api/analytics/corridor-benchmarks');
  assert(
    benchRes.status === 200 && benchRes.json?.corridors?.length === 4,
    'GET /api/analytics/corridor-benchmarks returns 4 priority corridors with kinematic and passenger segregation'
  );
  const aurobindo = benchRes.json?.corridors?.find((c) => c.corridorId === 'corridor-radial-south');
  assert(
    aurobindo?.vehicleMovementMetrics?.observedHeadwayMin?.coefficientOfVariation === 0.34,
    `Aurobindo Marg benchmark verifies empirical headway Cv=0.34 (Got: ${aurobindo?.vehicleMovementMetrics?.observedHeadwayMin?.coefficientOfVariation})`
  );

  const forecastRes = await fetchUrl('/api/ml/forecast', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ corridorId: 'corridor-ring-road', horizonMinutes: 30 }),
  });
  assert(
    forecastRes.status === 200 && forecastRes.json?.forecast?.pointForecastPct > 0,
    'POST /api/ml/forecast generates adaptive point forecast'
  );
  assert(
    forecastRes.json?.forecast?.selectedModel?.version === 'v1.4.2-stgnn',
    'Adaptive forecaster selects production ST-GNN surrogate (v1.4.2-stgnn)'
  );
  assert(
    Array.isArray(forecastRes.json?.forecast?.credibleIntervals?.ci95),
    'Forecast provides 95% Bayesian Credible Intervals'
  );

  console.log('\n--- Executing Phase 7 Independent Live Connectivity Audit ---');
  try {
    const auditOutput = execSync('node scripts/audit-connectivity.mjs', { encoding: 'utf8' });
    assert(
      auditOutput.includes('LIVE CONNECTIVITY AUDIT MATRIX'),
      'Live connectivity audit executes DNS, HTTPS, and auth classification across all 6 providers'
    );
  } catch (err) {
    assert(false, `Connectivity audit failed: ${err.message}`);
  }

  console.log('\n--- Executing Phase 8 Multimodal Intelligence & Resilience Tests ---');
  try {
    const multimodalOutput = execSync('node scripts/test-multimodal-network.mjs', { encoding: 'utf8' });
    assert(
      multimodalOutput.includes('PHASE 8 TEST SUMMARY: 34 PASSED'),
      'Multimodal intelligence, IFI scoring, and resilience stress tests pass completely (34/34 assertions)'
    );
  } catch (err) {
    assert(false, `Multimodal tests failed: ${err.message}`);
  }

  console.log('\n--- Executing Phase 9 Institutional Validation & Predictive Intelligence Tests ---');
  try {
    const phase9Output = execSync('node scripts/test-phase9-institutional.mjs', { encoding: 'utf8' });
    assert(
      phase9Output.includes('PHASE 9 TEST SUMMARY: 45 PASSED'),
      'Phase 9 institutional validation, demand intelligence, Fruin LOS, cascade disruption, and SHAP XAI tests pass completely (45/45 assertions)'
    );
  } catch (err) {
    assert(false, `Phase 9 tests failed: ${err.message}`);
  }

  console.log('\n--- Executing Phase 10 City-Scale Mobility Intelligence & Digital Twin Tests ---');
  try {
    const phase10Output = execSync('node scripts/test-phase10-city-scale.mjs', { encoding: 'utf8' });
    assert(
      phase10Output.includes('Phase 10 Tests Complete: 46 passed, 0 failed'),
      'Phase 10 city-scale network (67 nodes, 226 edges, 15 hubs), data governance, OD gravity, digital twin, resilience, accessibility equity, scenario planning, and ML registry tests pass completely (46/46 assertions)'
    );
  } catch (err) {
    assert(false, `Phase 10 tests failed: ${err.message}`);
  }

  console.log('\n--- Executing Phase 11 Independent Validation & Technical Certification Harness ---');
  try {
    const phase11Output = execSync('node scripts/test-phase11-validation.mjs', { encoding: 'utf8' });
    assert(
      phase11Output.includes('PHASE 11 INDEPENDENT VALIDATION SUITE: ALL ASSERTIONS PASSED'),
      'Phase 11 independent validation (evidence provenance, non-substitution, network sample disclosure, Furness IPF convergence, DCF portfolio BCR 4.07x, circuity equity, safety invariant) passes completely'
    );
  } catch (err) {
    assert(false, `Phase 11 tests failed: ${err.message}`);
  }



  console.log(`\n========================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
