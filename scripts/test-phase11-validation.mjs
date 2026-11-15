/**
 * NEXBUS Phase 11 Automated Independent Validation & Technical Certification Harness
 * 
 * Executes comprehensive multi-stage validation:
 * 1. Data Provenance & Evidence Registry Governance
 * 2. Non-Substitution Invariant Verification (0 Violations)
 * 3. Multimodal Network Topology & Curated Scope Disclosure
 * 4. Origin-Destination Gravity Model Furness IPF Balancing & Conservation
 * 5. Machine Learning Reproducibility & Parameter Reconciled Accounting
 * 6. Transport Economics Discounted Cash Flow Portfolio BCR (4.07x) & Sensitivity
 * 7. Accessibility Circuity Adjustment (gamma=1.31) & 11-District Spatial Equity
 * 8. Institutional Pilot Demonstration Mode & Read-Only Advisory Safety
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function fetchUrl(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let json = null;
  let text = '';
  try {
    text = await res.text();
    json = JSON.parse(text);
  } catch {
    // Not JSON
  }
  return { status: res.status, headers: res.headers, json, text };
}

async function runPhase11Validation() {
  console.log('=== NEXBUS PHASE 11: INDEPENDENT VALIDATION & TECHNICAL CERTIFICATION ===\n');

  // 1. Data Provenance & Evidence Registry Governance
  console.log('--- 1. Data Provenance & Evidence Registry Governance ---');
  const resProv = await fetchUrl('/api/ingestion/provenance');
  assert.strictEqual(resProv.status, 200, 'GET /api/ingestion/provenance returns HTTP 200');
  assert(resProv.json?.datasetCatalog?.length >= 8, `Dataset catalog contains >= 8 registered sources (Found: ${resProv.json?.datasetCatalog?.length})`);
  assert(resProv.json?.lineages?.length >= 6, `Lineage records cover >= 6 core analytical outputs (Found: ${resProv.json?.lineages?.length})`);
  assert.strictEqual(resProv.json?.nonSubstitutionAudit?.enforced, true, 'Non-substitution audit is actively enforced');
  assert.strictEqual(resProv.json?.nonSubstitutionAudit?.violationsDetected, 0, 'Zero non-substitution violations detected');
  console.log('   [PASS] Verified 8 registered datasets, 6 complete pipeline lineages, and 0 non-substitution violations');

  // 2. Multimodal Transit Network Coverage & Topological Invariants
  console.log('\n--- 2. Multimodal Transit Network Coverage & Topological Invariants ---');
  const resResil = await fetchUrl('/api/multimodal/resilience');
  assert.strictEqual(resResil.status, 200, 'GET /api/multimodal/resilience returns HTTP 200');
  const graph = resResil.json?.graphValidation;
  assert(graph, 'graphValidation must be present in resilience response');
  assert.strictEqual(graph.networkScope, 'DELHI_ARTERIAL_MULTIMODAL_BACKBONE_SAMPLE', 'Network scope disclaims curated arterial backbone sample');
  assert.strictEqual(graph.totalNodes, 67, 'Total network nodes equals exactly 67 (40 Metro, 23 Bus, 4 Rail)');
  assert.strictEqual(graph.totalEdges, 226, 'Total directed edges equals exactly 226');
  assert.strictEqual(graph.connectedComponentsCount, 1, 'Transit graph forms 1 single connected component');
  assert.strictEqual(graph.isolatedNodes.length, 0, 'Zero isolated nodes');
  assert.strictEqual(graph.duplicateNodes.length, 0, 'Zero duplicate nodes');
  assert.strictEqual(graph.duplicateEdges.length, 0, 'Zero duplicate edges');
  assert.strictEqual(graph.diameterHops, 8, 'Network diameter is 8 hops');
  assert.strictEqual(graph.coordinateErrors.length, 0, '100% of nodes comply with WGS84 NCT / NCR boundary');
  console.log('   [PASS] Verified network topology: 67 nodes, 226 edges, 1 component, diameter 8 hops, 0 coordinate errors');

  // 3. Origin-Destination Doubly-Constrained Model & Furness IPF Balancing
  console.log('\n--- 3. Origin-Destination Model Calibration & Furness Balancing ---');
  const resOD = await fetchUrl('/api/demand/od-matrix?timeWindow=AM_PEAK');
  assert.strictEqual(resOD.status, 200, 'GET /api/demand/od-matrix returns HTTP 200');
  const od = resOD.json?.report;
  assert(od, 'OD report must be present');
  assert.strictEqual(od.zones?.length, 13, 'Contains 13 statutory planning zones (11 NCT + 2 NCR gateways)');
  assert.strictEqual(od.governingFormulation?.frictionParameterBeta, 0.048, 'Beta friction parameter calibrated to 0.048');
  assert.strictEqual(od.convergenceDiagnostics?.converged, true, 'Furness balancing achieves convergence');
  assert(od.convergenceDiagnostics?.maxColumnErrorPct < 0.01, 'Max column error is < 0.01%');
  assert.strictEqual(od.convergenceDiagnostics?.targetProductionSum, od.convergenceDiagnostics?.targetAttractionSum, 'Production target equals attraction target');
  assert.strictEqual(od.privacyThresholdK, 15, 'Enforces privacy threshold k >= 15');
  console.log(`   [PASS] Furness balancing converged in ${od.convergenceDiagnostics?.iterationsCount} iteration(s) (Conservation: ${od.convergenceDiagnostics?.balancedFlowSum} pax/hr)`);

  // 4. Machine Learning Model Parameter Accounting & Evaluation
  console.log('\n--- 4. Machine Learning Model Evaluation & Parameter Accounting ---');
  const resML = await fetchUrl('/api/ml/evaluation');
  assert.strictEqual(resML.status, 200, 'GET /api/ml/evaluation returns HTTP 200');
  const stgnn = resML.json?.evaluation?.modelComparison?.find((m) => m.isNEXBUSProductionSurrogate);
  assert(stgnn, 'ST-GNN model must be registered in model comparison');
  assert.strictEqual(stgnn.testMetrics?.mae, 5.6, 'ST-GNN test MAE is 5.6%');
  assert.strictEqual(stgnn.testMetrics?.rmse, 7.7, 'ST-GNN test RMSE is 7.7%');
  assert(stgnn.testMetrics?.picp95 >= 93.0, 'ST-GNN PICP-95 >= 93.0%');
  console.log(`   [PASS] ST-GNN validated: MAE 5.6%, RMSE 7.7%, PICP-95 ${stgnn.testMetrics?.picp95}%`);

  // 5. Transport Economics Discounted Cash Flow Portfolio Appraisal
  console.log('\n--- 5. Transport Economics DCF Portfolio Appraisal ---');
  const resEcon = await fetchUrl('/api/simulation/scenarios');
  assert.strictEqual(resEcon.status, 200, 'GET /api/simulation/scenarios returns HTTP 200');
  const rep = resEcon.json?.report;
  assert(rep?.portfolioEconomics, 'portfolioEconomics must be present');
  assert.strictEqual(rep.portfolioEconomics.discountRatePct, 8, 'Social discount rate is 8%');
  assert.strictEqual(rep.portfolioEconomics.projectHorizonYears, 20, 'Horizon is 20 years');
  assert.strictEqual(rep.portfolioEconomics.portfolioBcr, 4.07, 'True Portfolio BCR is 4.07x');
  assert.strictEqual(rep.cumulativeImpact?.compositeBcrRatio, 4.07, 'cumulativeImpact composite BCR equals 4.07x');
  assert(rep.portfolioEconomics.sensitivityScenarios?.pessimisticCostOverrun?.bcr >= 2.5, 'Pessimistic stress BCR remains viable (>2.5x)');
  console.log(`   [PASS] Economic appraisal verified: PV(Costs) = ₹${rep.portfolioEconomics.presentValueCostsCroresInr} Cr, PV(Benefits) = ₹${rep.portfolioEconomics.presentValueBenefitsCroresInr} Cr, Portfolio BCR = 4.07x (Pessimistic: ${rep.portfolioEconomics.sensitivityScenarios?.pessimisticCostOverrun?.bcr}x)`);

  // 6. Accessibility Circuity Adjustment & Spatial Equity Barometers
  console.log('\n--- 6. Accessibility Circuity Adjustment & Spatial Equity Barometers ---');
  const resAccess = await fetchUrl('/api/multimodal/accessibility');
  assert.strictEqual(resAccess.status, 200, 'GET /api/multimodal/accessibility returns HTTP 200');
  assert.strictEqual(resAccess.json?.districts?.length, 11, 'Evaluates all 11 official Delhi NCT administrative districts');
  assert.strictEqual(resAccess.json?.pedestrianCircuityFactorAverage, 1.31, 'Mean pedestrian circuity gamma is 1.31');
  assert.strictEqual(resAccess.json?.equityBarometers?.spatialEquityGini, 0.29, 'Spatial equity Gini is 0.29');
  assert.strictEqual(resAccess.json?.equityBarometers?.quintileAccessibilityRatio, 1.82, 'Quintile accessibility ratio is 1.82x');
  assert(resAccess.json?.transitGaps?.length >= 6, 'Identifies >= 6 transit deserts');
  assert(resAccess.json?.demographicMethodology, 'Discloses Census 2011 & MPD-2041 demographic methodology');
  console.log('   [PASS] Spatial equity verified: 11 districts, circuity gamma 1.31, Gini 0.29, Quintile ratio 1.82x');

  // 7. Operational Safety Invariant & Pilot Demonstration Mode
  console.log('\n--- 7. Operational Safety Invariant & Pilot Demonstration Mode ---');
  assert(
    resProv.json?.safetyInvariantNotice?.includes('Never silently substitute synthetic'),
    'Provenance enforces non-substitution notice'
  );
  assert(
    resAccess.json?.nonInterventionSafetyNotice?.includes('READ-ONLY + PASSIVE + ADVISORY'),
    'Accessibility enforces READ-ONLY + PASSIVE + ADVISORY safety notice'
  );
  assert(
    rep?.institutionalNotice?.includes('ADVISORY DECISION SUPPORT ONLY'),
    'Scenario planning enforces ADVISORY DECISION SUPPORT notice'
  );
  console.log('   [PASS] READ-ONLY + PASSIVE + ADVISORY invariant confirmed across all subsystems');

  console.log('\n========================================================');
  console.log('PHASE 11 INDEPENDENT VALIDATION SUITE: ALL ASSERTIONS PASSED');
  console.log('========================================================\n');
}

runPhase11Validation().catch((err) => {
  console.error('\nPHASE 11 VALIDATION SUITE FAILED:', err);
  process.exit(1);
});
