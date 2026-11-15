// NEXBUS Phase 9 — Institutional Validation & Predictive Mobility Test Suite
// Complies with Phase 9 Section 15 Requirements

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

async function runPhase9Tests() {
  console.log('=== PHASE 9 INSTITUTIONAL VALIDATION & PREDICTIVE INTELLIGENCE ===\n');
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

  // 1. Transport Network Expansion & Graph Integrity
  console.log('--- 1. Testing Transport Network Expansion & Connectivity ---');
  const nodesRes = await fetchUrl('/api/multimodal/plan?origin=stop-aiims&destination=stop-cp-regal');
  assert(nodesRes.status === 200, 'GET /api/multimodal/plan returns HTTP 200');
  
  // Verify Interchange Congestion & Expanded Hubs
  const hubsRes = await fetchUrl('/api/multimodal/interchanges');
  assert(hubsRes.status === 200, 'GET /api/multimodal/interchanges returns HTTP 200');
  assert(hubsRes.json?.totalHubsAnalyzed >= 11, `Network expanded to >= 11 multimodal hubs (Found: ${hubsRes.json?.totalHubsAnalyzed})`);
  
  // Verify presence of Phase 9 expanded hubs
  const hasHauzKhas = hubsRes.json?.interchanges?.some((h) => h.hubId === 'hub-hauz-khas');
  assert(hasHauzKhas, 'Network contains Hauz Khas Yellow/Magenta Deep Concourse Hub');
  const hasNSP = hubsRes.json?.interchanges?.some((h) => h.hubId === 'hub-netaji-subhash-place');
  assert(hasNSP, 'Network contains Netaji Subhash Place Red/Pink Interchange Hub');
  const hasKalkaji = hubsRes.json?.interchanges?.some((h) => h.hubId === 'hub-kalkaji-mandir');
  assert(hasKalkaji, 'Network contains Kalkaji Mandir Violet/Magenta Interchange Hub');

  // 2. Passenger Demand Intelligence API
  console.log('\n--- 2. Testing Passenger Demand Intelligence API ---');
  const demandSummaryRes = await fetchUrl('/api/demand/corridor-demand');
  assert(demandSummaryRes.status === 200, 'GET /api/demand/corridor-demand returns HTTP 200');
  assert(demandSummaryRes.json?.totalNetworkDemandPaxDaily > 500000, `Network total daily demand verified (>500k pax)`);
  assert(demandSummaryRes.json?.networkAveragePHF > 0.70 && demandSummaryRes.json?.networkAveragePHF < 1.0, `Network average Peak Hour Factor (PHF) in valid range [0.70, 1.00] (Got: ${demandSummaryRes.json?.networkAveragePHF})`);

  const corridorDemandRes = await fetchUrl('/api/demand/corridor-demand?corridorId=corridor-ring-road');
  assert(corridorDemandRes.status === 200, 'GET /api/demand/corridor-demand?corridorId=corridor-ring-road returns HTTP 200');
  const dem = corridorDemandRes.json?.demand;
  assert(dem?.directionalImbalanceRatio >= 0.50, `Directional split ratio verified (alpha = ${dem?.directionalImbalanceRatio})`);
  assert(dem?.giniPassengerConcentration > 0 && dem?.giniPassengerConcentration < 1, `Gini concentration coefficient in valid range (G = ${dem?.giniPassengerConcentration})`);
  assert(Array.isArray(dem?.hourlyProfiles) && dem.hourlyProfiles.length >= 18, `Hourly demand profile generated with >= 18 hours`);
  assert(dem?.hourlyProfiles[0]?.lowerCi95PaxPerHour <= dem?.hourlyProfiles[0]?.expectedPaxPerHour, 'Hourly profile enforces lower Bayesian 95% bound');
  assert(dem?.privacyComplianceNotice?.includes('k-anonymity'), 'Enforces explicit k-anonymity privacy notice');

  // Synthetic demand testing mode
  const syntheticDemandRes = await fetchUrl('/api/demand/corridor-demand?corridorId=corridor-ring-road&synthetic=true');
  assert(syntheticDemandRes.status === 200, 'Synthetic demand mode query succeeds');
  assert(syntheticDemandRes.json?.demand?.evidenceClassification === 'SYNTHETIC', 'Synthetic query strictly returns SYNTHETIC classification');

  // 3. Interchange Congestion & Fruin Level of Service (LOS)
  console.log('\n--- 3. Testing Interchange Congestion & Fruin LOS Analytics ---');
  const congestionRes = await fetchUrl('/api/multimodal/interchanges/congestion?timePeriod=AM_PEAK');
  assert(congestionRes.status === 200, 'GET /api/multimodal/interchanges/congestion returns HTTP 200');
  assert(congestionRes.json?.diagnostics?.length >= 11, `Congestion diagnostics computed for all ${congestionRes.json?.diagnostics?.length} hubs`);
  
  const sampleDiagnostic = congestionRes.json?.diagnostics[0];
  assert(sampleDiagnostic?.concourseFlowRatePaxPerMinPerMeter > 0, `Concourse flow rate (v_p) computed (${sampleDiagnostic?.concourseFlowRatePaxPerMinPerMeter} pax/min/m)`);
  assert(sampleDiagnostic?.fruinLevelOfService?.startsWith('LOS_'), `Classifies into Fruin Level of Service (Got: ${sampleDiagnostic?.fruinLevelOfService})`);
  assert(sampleDiagnostic?.volumeToCapacityRatio > 0, `Volume-to-Capacity ratio verified (V/C = ${sampleDiagnostic?.volumeToCapacityRatio})`);
  assert(sampleDiagnostic?.interchangeCongestionIndex >= 0 && sampleDiagnostic?.interchangeCongestionIndex <= 100, `Interchange Congestion Index (ICI) bounded in [0, 100] (Got: ${sampleDiagnostic?.interchangeCongestionIndex})`);

  // Specific hub lookup
  const hubCongestRes = await fetchUrl('/api/multimodal/interchanges/congestion?hubId=hub-kashmere-gate&timePeriod=AM_PEAK');
  assert(hubCongestRes.status === 200, 'Querying specific hub congestion (Kashmere Gate) returns HTTP 200');
  assert(hubCongestRes.json?.diagnostic?.capacity?.clearConcourseWidthMeters > 0, 'Reports physical concourse clear width in meters');

  // 4. Disruption Propagation & Cascade Recovery Analytics
  console.log('\n--- 4. Testing Disruption Cascade & Spillover Analytics ---');
  const cascadeRes = await fetchUrl('/api/multimodal/resilience?scenarioId=ring-road-waterlogging');
  assert(cascadeRes.status === 200, 'GET /api/multimodal/resilience returns HTTP 200');
  const cascadeEval = cascadeRes.json?.evaluation;
  assert(cascadeEval?.disruptionSourceType === 'HYPOTHETICAL_SIMULATION', 'Disruption explicitly classified as HYPOTHETICAL_SIMULATION');
  assert(Array.isArray(cascadeEval?.cascadeSpillover) && cascadeEval.cascadeSpillover.length >= 1, 'Cascade spillover analysis identifies parallel transit impact');
  assert(cascadeEval?.cascadeSpillover[0]?.divertedPassengerVolumePerHour > 0, `Quantifies diverted passenger volume (${cascadeEval?.cascadeSpillover[0]?.divertedPassengerVolumePerHour} pax/h)`);
  assert(cascadeEval?.estimatedRecoveryDurationHours > 0, `Estimates network recovery duration (${cascadeEval?.estimatedRecoveryDurationHours} hours)`);

  // 5. Population-Weighted Accessibility vs Land-Area Coverage
  console.log('\n--- 5. Testing Population-Weighted Accessibility Intelligence ---');
  const accessRes = await fetchUrl('/api/multimodal/accessibility');
  assert(accessRes.status === 200, 'GET /api/multimodal/accessibility returns HTTP 200');
  assert(accessRes.json?.overallPopulationWeightedAccessibilityPct > 70, `Population-weighted accessibility verified (${accessRes.json?.overallPopulationWeightedAccessibilityPct}%)`);
  assert(accessRes.json?.pedestrianCircuityFactorAverage >= 1.2, `Pedestrian circuity factor gamma verified (${accessRes.json?.pedestrianCircuityFactorAverage})`);
  assert(accessRes.json?.demographicDataSource?.includes('Census of India'), 'Cites authoritative demographic source (Census / MPD-2041)');
  
  const centralZone = accessRes.json?.zones?.find((z) => z.zoneName === 'Central');
  assert(centralZone?.populationWeightedAccessibilityPct !== undefined, 'Central zone provides population-weighted accessibility metric');
  assert(centralZone?.jobsAccessibleWithin30MinPct > 80, `Central zone evaluates 30-min job access (${centralZone?.jobsAccessibleWithin30MinPct}%)`);

  // 6. Model Explainability & SHAP Feature Attribution (XAI)
  console.log('\n--- 6. Testing Model Explainability & SHAP Feature Attribution ---');
  const explainRes = await fetchUrl('/api/ml/explainability?corridorId=corridor-ring-road&horizon=30&isPeak=true');
  assert(explainRes.status === 200, 'GET /api/ml/explainability returns HTTP 200');
  const expl = explainRes.json?.explanation;
  assert(expl?.modelVersion === 'v2.0.0-institutional', `Surrogate model version verified (${expl?.modelVersion})`);
  assert(expl?.baselinePredictionMinutes > 0, `Reports baseline expected delay E[Y] (${expl?.baselinePredictionMinutes} min)`);
  assert(expl?.finalPredictedDelayMinutes > 0, `Reports final delay prediction (${expl?.finalPredictedDelayMinutes} min)`);
  assert(Array.isArray(expl?.globalFeatureImportance) && expl.globalFeatureImportance.length >= 5, 'Provides ranked global feature importances');
  assert(expl?.globalFeatureImportance[0]?.featureName === 'headway_variance_lag15m', 'Rank 1 feature is headway variance lag (kinematic bunching)');
  assert(Array.isArray(expl?.localFeatureWaterfall) && expl.localFeatureWaterfall.length >= 4, 'Provides local SHAP attribution waterfall');
  assert(expl?.uncertaintyDecomposition?.aleatoricUncertaintyPct > 50, 'Decomposes uncertainty into aleatoric (stochastic noise) and epistemic parts');
  assert(expl?.limitationsNotice?.includes('statistical predictive association'), 'Enforces explicit non-causal interpretation warning notice');

  console.log(`\n======================================================`);
  console.log(`PHASE 9 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`======================================================\n`);

  if (failed > 0) process.exit(1);
}

runPhase9Tests().catch((err) => {
  console.error('Fatal error running Phase 9 tests:', err);
  process.exit(1);
});
