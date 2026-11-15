// Multimodal Journey Intelligence, Interchange Analytics & Network Resilience Test Suite
// Complies with Phase 8 Validation Specifications

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

async function runMultimodalTests() {
  console.log('=== PHASE 8 MULTIMODAL INTELLIGENCE & RESILIENCE VERIFICATION ===\n');
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

  // 1. Multimodal Plan API: AIIMS to Connaught Place
  console.log('--- 1. Testing Multimodal Journey Planning ---');
  const planRes = await fetchUrl('/api/multimodal/plan?origin=stop-aiims&destination=stop-cp-regal');
  assert(planRes.status === 200, `GET /api/multimodal/plan returns HTTP 200 (Got: ${planRes.status})`);
  assert(planRes.json?.success === true, 'Journey plan returns success=true');
  assert(Array.isArray(planRes.json?.plans) && planRes.json.plans.length > 0, 'Returns at least 1 valid journey plan');

  const fastestPlan = planRes.json?.plans[0];
  assert(fastestPlan?.totalDurationMinutes > 0 && fastestPlan?.totalDurationMinutes < 60, `Fastest plan duration is realistic (${fastestPlan?.totalDurationMinutes} min)`);
  assert(fastestPlan?.legs?.length >= 1, `Itinerary contains structured legs (Found: ${fastestPlan?.legs?.length})`);
  assert(fastestPlan?.estimatedFareInr > 0, `Fare estimated accurately (₹${fastestPlan?.estimatedFareInr})`);
  assert(fastestPlan?.carbonSavedKg > 0, `CO2 savings estimated (${fastestPlan?.carbonSavedKg} kg)`);

  // Test Bus-Only Preference
  const busOnlyRes = await fetchUrl('/api/multimodal/plan?origin=stop-aiims&destination=stop-cp-regal&preference=BUS_ONLY');
  assert(busOnlyRes.status === 200, 'GET /api/multimodal/plan with BUS_ONLY preference succeeds');
  const busOnlyPlan = busOnlyRes.json?.plans?.find((p) => p.preference === 'BUS_ONLY');
  assert(busOnlyPlan !== undefined, 'Found BUS_ONLY itinerary option');
  const hasMetroLeg = busOnlyPlan?.legs?.some((l) => l.mode === 'METRO');
  assert(!hasMetroLeg, 'BUS_ONLY plan strictly excludes METRO mode legs');

  // 2. Interchange Analytics API
  console.log('\n--- 2. Testing Interchange Analytics & Friction Index (IFI) ---');
  const hubsRes = await fetchUrl('/api/multimodal/interchanges');
  assert(hubsRes.status === 200, `GET /api/multimodal/interchanges returns HTTP 200`);
  assert(hubsRes.json?.totalHubsAnalyzed >= 7, `Analyzes >= 7 key multimodal hubs (Found: ${hubsRes.json?.totalHubsAnalyzed})`);
  assert(hubsRes.json?.averageFrictionScore > 0, `Computes network-wide average friction score (${hubsRes.json?.averageFrictionScore}/100)`);

  const kgHubRes = await fetchUrl('/api/multimodal/interchanges?hubId=hub-kashmere-gate');
  assert(kgHubRes.status === 200 && kgHubRes.json?.hub?.hubId === 'hub-kashmere-gate', 'Querying specific hub (Kashmere Gate) returns detailed metrics');
  const kg = kgHubRes.json?.hub;
  assert(kg?.walkingDistanceMeters > 0, `Kashmere Gate walking distance measured (${kg?.walkingDistanceMeters}m)`);
  assert(kg?.verticalLevelsChange === 3, `Kashmere Gate vertical level change verified (3 levels)`);
  assert(kg?.frictionGrade !== undefined, `Kashmere Gate assigned friction grade (${kg?.frictionGrade})`);
  assert(kg?.recommendedInterventions?.length > 0, 'Kashmere Gate includes actionable authority recommendations');

  // 3. Network Resilience Simulator API
  console.log('\n--- 3. Testing Network Resilience & Disruption Simulator ---');
  const resilienceBase = await fetchUrl('/api/multimodal/resilience');
  assert(resilienceBase.status === 200, 'GET /api/multimodal/resilience returns HTTP 200');
  assert(Array.isArray(resilienceBase.json?.availableScenarios), 'Returns list of preset disruption scenarios');

  const scenarioRes = await fetchUrl('/api/multimodal/resilience?scenarioId=ring-road-waterlogging');
  assert(scenarioRes.status === 200, 'GET /api/multimodal/resilience with scenarioId returns evaluation');
  const evalData = scenarioRes.json?.evaluation;
  assert(evalData?.scenarioId === 'ring-road-waterlogging', 'Evaluates requested scenario (ring-road-waterlogging)');
  assert(evalData?.vulnerabilityIndexPct > 0, `Computes network vulnerability index (${evalData?.vulnerabilityIndexPct}%)`);
  assert(evalData?.efficiencyLossPct > 0, `Quantifies network efficiency loss (${evalData?.efficiencyLossPct}%)`);
  assert(evalData?.criticalCutVertices?.length >= 2, `Identifies critical cut-vertices (Found: ${evalData?.criticalCutVertices?.length})`);
  assert(evalData?.sampleDetourImpacts?.length >= 2, 'Computes OD pair detour delay penalties');
  assert(
    evalData?.nonInterventionSafetyNotice?.includes('NEXBUS does not control physical railway signaling'),
    'Enforces explicit Non-Intervention Safety Guarantee notice'
  );

  // 4. Geographic Accessibility & Coverage Service API
  console.log('\n--- 4. Testing Geographic Accessibility & Catchment Isochrones ---');
  const accessRes = await fetchUrl('/api/multimodal/accessibility');
  assert(accessRes.status === 200, 'GET /api/multimodal/accessibility returns HTTP 200');
  assert(accessRes.json?.overallTerritoryCoverage800mPct > 70, `Territory 800m coverage verified (${accessRes.json?.overallTerritoryCoverage800mPct}%)`);
  assert(accessRes.json?.overallTerritoryCoverage400mPct > 60, `Territory 400m coverage verified (${accessRes.json?.overallTerritoryCoverage400mPct}%)`);
  assert(accessRes.json?.zones?.length === 5, 'Contains 5 administrative zones (Central, South, North, West, East)');
  assert(accessRes.json?.transitGaps?.length >= 3, `Identifies urban transit desert areas (Found: ${accessRes.json?.transitGaps?.length})`);

  // Nearest transit coordinate lookup
  const nearestRes = await fetchUrl('/api/multimodal/accessibility?lat=28.6328&lng=77.2197'); // Connaught Place
  assert(nearestRes.status === 200, 'Coordinate lookup returns nearest transit node');
  assert(nearestRes.json?.nearestTransit?.distanceKm < 1.0, `Finds nearest transit within walking distance (${nearestRes.json?.nearestTransit?.distanceKm} km)`);

  console.log(`\n======================================================`);
  console.log(`PHASE 8 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) process.exit(1);
}

runMultimodalTests().catch((err) => {
  console.error('Fatal error running multimodal tests:', err);
  process.exit(1);
});
