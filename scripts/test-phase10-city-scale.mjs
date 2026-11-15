// Phase 10 City-Scale Mobility Intelligence & Digital Twin Certification Test Suite

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

export async function runPhase10Tests() {
  console.log('\n============================================================');
  console.log('=== PHASE 10: CITY-SCALE MOBILITY INTELLIGENCE SUITE ===');
  console.log('============================================================\n');

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

  // -------------------------------------------------------------
  // Test 1: City-Scale Multimodal Network Topology (67 Nodes, 226 Edges, 15 Hubs)
  // -------------------------------------------------------------
  console.log('--- 1. City-Scale Multimodal Network Topology ---');
  const resGraph = await fetchUrl('/api/multimodal/resilience');
  assert(resGraph.status === 200, 'GET /api/multimodal/resilience returns HTTP 200');
  
  const gSummary = resGraph.json?.graphSummary;
  const gValidation = resGraph.json?.graphValidation;

  assert(
    gSummary?.totalNodes === 67,
    `Total network nodes is exactly 67 (Found: ${gSummary?.totalNodes})`
  );
  assert(
    gSummary?.metroStationsCount === 40,
    `Metro stations count is exactly 40 (Found: ${gSummary?.metroStationsCount})`
  );
  assert(
    gSummary?.busStopsCount === 23,
    `Bus stops count is exactly 23 (Found: ${gSummary?.busStopsCount})`
  );
  assert(
    gValidation?.railwayStationsCount === 4,
    `Intercity railway terminals is exactly 4 (Found: ${gValidation?.railwayStationsCount})`
  );
  assert(
    gSummary?.totalEdges === 226,
    `Total directed edges is exactly 226 (Found: ${gSummary?.totalEdges})`
  );
  assert(
    gSummary?.interchangeHubsCount === 15,
    `Surveyed multimodal hubs is exactly 15 (Found: ${gSummary?.interchangeHubsCount})`
  );
  assert(
    gValidation?.isValid === true,
    'Network topological validation passed: isValid is true'
  );
  assert(
    gValidation?.connectedComponentsCount === 1,
    'Network is 100% connected: connectedComponentsCount === 1'
  );
  assert(
    gValidation?.isolatedNodes?.length === 0,
    'Zero isolated nodes in represented graph'
  );

  // -------------------------------------------------------------
  // Test 2: Provider Reliability & Data Governance
  // -------------------------------------------------------------
  console.log('\n--- 2. Provider Reliability & Data Governance ---');
  const resGov = await fetchUrl('/api/ingestion/governance');
  assert(resGov.status === 200, 'GET /api/ingestion/governance returns HTTP 200');
  const gov = resGov.json?.governance;
  assert(
    gov?.totalProvidersTracked >= 6,
    `Audited upstream data providers >= 6 (Found: ${gov?.totalProvidersTracked})`
  );
  assert(
    gov?.safetyInvariantNotice?.includes('Never silently substitute'),
    'Non-substitution policy is strictly compliant (zero silent synthetic fallbacks)'
  );
  assert(
    Array.isArray(gov?.providers) && gov?.providers?.length >= 6,
    'Provider statuses matrix is exposed'
  );

  // -------------------------------------------------------------
  // Test 3: Passenger Demand & Origin-Destination Matrix Engine
  // -------------------------------------------------------------
  console.log('\n--- 3. Passenger Demand & Origin-Destination Intelligence ---');
  const resOD = await fetchUrl('/api/demand/od-matrix?timeWindow=AM_PEAK');
  assert(resOD.status === 200, 'GET /api/demand/od-matrix returns HTTP 200');
  const odReport = resOD.json?.report;
  assert(
    odReport?.zones?.length >= 13,
    `Total OD zones >= 13 (NCT districts + NCR gateways) (Found: ${odReport?.zones?.length})`
  );
  assert(
    odReport?.governingFormulation?.frictionParameterBeta === 0.048,
    'Gravity decay exponent beta is calibrated to 0.048'
  );
  assert(
    odReport?.giniDemandConcentration > 0,
    `Demand concentration Gini coefficient is computed (>0) (Got: ${odReport?.giniDemandConcentration})`
  );
  assert(
    odReport?.privacyThresholdK === 15,
    'Minimum cell privacy suppression threshold k >= 15 is enforced'
  );
  assert(
    odReport?.topDesireLines?.length === 5,
    'Top 5 passenger desire lines identified'
  );

  // -------------------------------------------------------------
  // Test 4: Predictive Disruption Scenarios & Network Resilience
  // -------------------------------------------------------------
  console.log('\n--- 4. Predictive Disruption & Resilience Scenarios ---');
  const resScen = await fetchUrl('/api/multimodal/resilience?scenarioId=monsoon-yamuna-minto-flooding');
  assert(resScen.status === 200, 'GET /api/multimodal/resilience with scenarioId returns HTTP 200');
  const evalData = resScen.json?.evaluation;
  assert(
    evalData?.archetype === 'FLOOD_HAZARD',
    'Scenario archetype is correctly classified as FLOOD_HAZARD'
  );
  assert(
    evalData?.efficiencyLossPct > 0,
    `Global efficiency loss Delta E / E0 is computed (>0) (Got: ${evalData?.efficiencyLossPct}%)`
  );
  assert(
    evalData?.displacedPaxPerHour === 32000,
    `Displaced passenger demand is 32,000 pax/hr (Got: ${evalData?.displacedPaxPerHour})`
  );
  assert(
    evalData?.criticalCutVertices?.length >= 4,
    'Critical articulation points (cut-vertices) audited'
  );
  assert(
    evalData?.priorityRestorationOrder?.length >= 4,
    'Priority restoration order ranked by marginal efficiency gain'
  );
  assert(
    evalData?.nonInterventionSafetyNotice?.includes('READ-ONLY'),
    'Non-intervention safety notice is present on resilience output'
  );

  // -------------------------------------------------------------
  // Test 5: Spatial Equity & Multimodal Accessibility Analytics
  // -------------------------------------------------------------
  console.log('\n--- 5. Spatial Equity & Multimodal Accessibility Analytics ---');
  const resAccess = await fetchUrl('/api/multimodal/accessibility');
  assert(resAccess.status === 200, 'GET /api/multimodal/accessibility returns HTTP 200');
  assert(
    resAccess.json?.districts?.length === 11,
    `All 11 official Delhi NCT administrative districts evaluated (Found: ${resAccess.json?.districts?.length})`
  );
  assert(
    resAccess.json?.pedestrianCircuityFactorAverage === 1.31,
    'Average pedestrian circuity factor gamma is 1.31'
  );
  assert(
    resAccess.json?.equityBarometers?.spatialEquityGini === 0.29,
    'Spatial equity Gini coefficient is 0.29'
  );
  assert(
    resAccess.json?.equityBarometers?.quintileAccessibilityRatio === 1.82,
    'Quintile accessibility ratio is 1.82x'
  );
  assert(
    resAccess.json?.transitGaps?.length >= 6,
    `Transit deserts identified >= 6 (Found: ${resAccess.json?.transitGaps?.length})`
  );

  // -------------------------------------------------------------
  // Test 6: Institutional Scenario Planning & Comparative Portfolio
  // -------------------------------------------------------------
  console.log('\n--- 6. Institutional Scenario Planning & Capital Interventions ---');
  const resPlanning = await fetchUrl('/api/simulation/scenarios');
  assert(resPlanning.status === 200, 'GET /api/simulation/scenarios returns HTTP 200');
  const rep = resPlanning.json?.report;
  assert(
    rep?.availableInterventions?.length === 4,
    `Four major institutional capital interventions available (Found: ${rep?.availableInterventions?.length})`
  );
  assert(
    rep?.cumulativeImpact?.compositeBcrRatio > 3.0,
    `Composite 20-year BCR ratio is favorable (>3.0x) (Got: ${rep?.cumulativeImpact?.compositeBcrRatio}x)`
  );
  assert(
    rep?.cumulativeImpact?.netAdditionalPopCovered800mThousands > 1000,
    `Over 1 million citizens brought into 800m transit walking catchment (Got: ${rep?.cumulativeImpact?.netAdditionalPopCovered800mThousands}k)`
  );
  assert(
    rep?.institutionalNotice?.includes('ILLUSTRATIVE INTERVENTION'),
    'Notice explicitly warns intervention is illustrative and not an approved project'
  );

  // -------------------------------------------------------------
  // Test 7: Machine Learning Model Registry & Leakage Governance
  // -------------------------------------------------------------
  console.log('\n--- 7. Machine Learning Model Registry & Validation ---');
  const resMl = await fetchUrl('/api/ml/registry');
  assert(resMl.status === 200, 'GET /api/ml/registry returns HTTP 200');
  assert(
    resMl.json?.totalRegisteredModels === 5,
    `Total registered models is exactly 5 (Found: ${resMl.json?.totalRegisteredModels})`
  );
  assert(
    resMl.json?.activeProductionModelId === 'model-stgnn-surrogate',
    'Active production model is Spatio-Temporal GNN surrogate'
  );
  
  const stgnn = resMl.json?.models?.find((m) => m.modelId === 'model-stgnn-surrogate');
  assert(
    stgnn?.metrics?.rSquared === 0.91,
    `ST-GNN model test R² is 0.91 (Got: ${stgnn?.metrics?.rSquared})`
  );
  assert(
    stgnn?.metrics?.mae === 5.6,
    `ST-GNN model test MAE is 5.6% (Got: ${stgnn?.metrics?.mae}%)`
  );
  assert(
    stgnn?.leakageAudit?.temporalHoldoutVerified === true,
    'ST-GNN model passes temporal holdout verification (zero future lookahead)'
  );
  assert(
    stgnn?.uncertaintyProfile?.aleatoricVariancePct > 0 && stgnn?.uncertaintyProfile?.epistemicVariancePct > 0,
    'Uncertainty is decomposed into aleatoric and epistemic components'
  );
  assert(
    stgnn?.topFeaturesShap?.length >= 5,
    'Top 5 global SHAP features exposed for explainability'
  );

  // -------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`Phase 10 Tests Complete: ${passed} passed, ${failed} failed`);
  console.log('============================================================\n');

  if (failed > 0) {
    throw new Error(`Phase 10 Test Suite failed with ${failed} failure(s)`);
  }

  return { passed, failed };
}

// Execute directly if run as main script
if (process.argv[1]?.endsWith('test-phase10-city-scale.mjs')) {
  runPhase10Tests()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
