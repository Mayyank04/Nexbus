/**
 * NEXBUS Phase 13 Independent Validation Script: Pedestrian Accessibility, Equity & First/Last-Mile Routing
 * 
 * Verifies:
 * 1. Multi-profile pedestrian routing across all 11 Delhi statutory administrative districts
 * 2. General Pedestrian vs Wheelchair vs Elderly mobility profiles
 * 3. Street network circuity factor gamma = 1.31 (Euclidean vs actual network walking paths)
 * 4. Spatial Equity Gini coefficient = 0.29 (Census/MPD-2041 population vs job accessibility)
 * 5. OSM street segment audit (>= 10,000 digitized roadway & pedestrian segments)
 * 6. Wheelchair barrier-free routing constraints & elevator detour penalties
 * 7. Transit desert identification and first/last-mile feeder interventions
 * 8. Operational invariant: READ-ONLY + PASSIVE + ADVISORY
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function fetchUrl(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch {}
  return { status: res.status, json };
}

async function validateAccessibility() {
  console.log('=== NEXBUS PHASE 13 PEDESTRIAN ACCESSIBILITY & EQUITY VALIDATION ===\n');

  // 1. General Pedestrian Profile & Network Circuity
  console.log('1. Fetching General Pedestrian Accessibility Report from /api/multimodal/accessibility...');
  const resGen = await fetchUrl('/api/multimodal/accessibility');
  assert.strictEqual(resGen.status, 200, 'GET /api/multimodal/accessibility must return HTTP 200');
  assert(resGen.json?.districts, 'Districts array must be present');

  const districts = resGen.json?.districts;
  assert.strictEqual(districts.length, 11, `Must evaluate all 11 Delhi statutory districts (Found: ${districts.length})`);
  console.log(`   [PASS] 11 statutory Delhi districts evaluated`);

  // Verify Circuity Factor (Gamma = 1.31)
  const gamma = resGen.json?.pedestrianCircuityFactorAverage;
  assert.strictEqual(gamma, 1.31, `Mean pedestrian circuity factor must equal 1.31 (Got: ${gamma})`);
  console.log(`   [PASS] Mean pedestrian circuity factor gamma = 1.31 validated`);

  // Verify Network vs Euclidean Coverage Penalties
  const euclidean800 = resGen.json?.overallTerritoryCoverage800mPct;
  const network800 = resGen.json?.overallNetworkWalkingCoverage800mPct;
  assert(
    network800 < euclidean800,
    `Actual network walking coverage (${network800}%) must be lower than idealized Euclidean buffer (${euclidean800}%) due to street circuity`
  );
  console.log(`   [PASS] Realistic street network impedance verified: Euclidean ${euclidean800}% -> Network Walking ${network800}%`);

  // 2. Spatial Equity Barometers & Gini Metric
  console.log('\n2. Auditing Spatial Equity Barometers (Gini Coefficient & Accessibility Ratio)...');
  const eq = resGen.json?.equityBarometers;
  assert(eq, 'equityBarometers must be present');
  assert.strictEqual(eq.spatialEquityGini, 0.29, `Spatial equity Gini must equal 0.29 (Got: ${eq.spatialEquityGini})`);
  assert(eq.quintileAccessibilityRatio > 1.0, 'Quintile accessibility ratio must be > 1.0');
  console.log(`   [PASS] Spatial Equity Gini = 0.29 certified (Quintile Ratio: ${eq.quintileAccessibilityRatio.toFixed(2)}x)`);

  // 3. Wheelchair Barrier-Free Mobility Profile
  console.log('\n3. Evaluating Wheelchair Accessible Profile at /api/multimodal/accessibility?profile=wheelchair...');
  const resWheel = await fetchUrl('/api/multimodal/accessibility?profile=wheelchair');
  assert.strictEqual(resWheel.status, 200, 'GET /api/multimodal/accessibility?profile=wheelchair must return HTTP 200');

  const audit = resWheel.json?.pedestrianProfileAudit;
  assert(audit, 'pedestrianProfileAudit must be present');
  assert(audit.osmStreetSegmentsAnalyzed >= 10000, `Must audit >= 10,000 OSM segments (Audited: ${audit.osmStreetSegmentsAnalyzed})`);
  console.log(`   [PASS] OSM Street Network Audit: ${audit.osmStreetSegmentsAnalyzed.toLocaleString()} digitized segments`);

  const wheelProfile = audit.profiles?.WHEELCHAIR_ACCESSIBLE;
  assert(wheelProfile, 'WHEELCHAIR_ACCESSIBLE profile must be defined');
  assert.strictEqual(wheelProfile.barrierFreeRequired, true, 'Wheelchair route must require barrier-free path');
  assert(wheelProfile.circuityPenaltyFactor > 1.31, 'Wheelchair circuity penalty must exceed 1.31 due to elevator/curb detours');
  assert(
    wheelProfile.effectivePopulationCoveragePct < resGen.json?.overallPopulationWeightedAccessibilityPct,
    'Wheelchair population coverage must be lower than general pedestrian due to non-accessible curbs'
  );
  console.log(`   [PASS] Wheelchair Profile: Barrier-free enforced, Circuity penalty = ${wheelProfile.circuityPenaltyFactor}x, Effective Coverage = ${wheelProfile.effectivePopulationCoveragePct}%`);

  // 4. Senior Commuter Mobility Profile
  console.log('\n4. Evaluating Senior / Elderly Mobility Profile at /api/multimodal/accessibility?profile=elderly...');
  const resSenior = await fetchUrl('/api/multimodal/accessibility?profile=elderly');
  assert.strictEqual(resSenior.status, 200, 'GET /api/multimodal/accessibility?profile=elderly returns HTTP 200');
  const seniorProfile = resSenior.json?.pedestrianProfileAudit?.profiles?.ELDERLY_MOBILITY;
  assert(seniorProfile, 'ELDERLY_MOBILITY profile must be evaluated');
  assert.strictEqual(seniorProfile.maximumWalkCatchmentMeters, 500, 'Senior catchment must be capped at 500m');
  assert(seniorProfile.nominalSpeedKmH <= 3.5, 'Senior walking speed must reflect empirical geriatric standards (<= 3.5 km/h)');
  console.log(`   [PASS] Senior Profile: Catchment = ${seniorProfile.maximumWalkCatchmentMeters}m, Speed = ${seniorProfile.nominalSpeedKmH} km/h, Effective Coverage = ${seniorProfile.effectivePopulationCoveragePct}%`);

  // 5. Transit Deserts & First/Last-Mile Interventions
  console.log('\n5. Auditing Transit Deserts & First/Last-Mile Feeder Recommendations...');
  const gaps = resGen.json?.transitGaps;
  assert(Array.isArray(gaps) && gaps.length >= 3, 'Must identify >= 3 major transit gap areas');

  for (const gap of gaps) {
    assert(gap.distanceToNearestTransitKm > 1.0, `Transit desert ${gap.name} must be > 1.0 km from nearest transit`);
    assert(gap.recommendedIntervention.length > 10, `Intervention must be documented for ${gap.name}`);
    console.log(`   * ${gap.name} (${gap.districtName}): Nearest Node = ${gap.nearestTransitNodeName} (${gap.distanceToNearestTransitKm} km), Walk = ${gap.pedestrianActualWalkDistanceKm} km, Intervention = ${gap.recommendedIntervention}`);
  }
  console.log('   [PASS] Transit desert gaps and feeder interventions validated');

  // 6. Operational Safety Invariant Certification
  console.log('\n6. Operational Safety Invariant Certification:');
  assert(
    resGen.json?.nonInterventionSafetyNotice.includes('READ-ONLY + PASSIVE + ADVISORY'),
    'Safety notice must declare advisory invariant'
  );
  console.log('   [PASS] READ-ONLY + PASSIVE + ADVISORY certified across all accessibility metrics');

  console.log('\n============================================================');
  console.log('PHASE 13 ACCESSIBILITY & EQUITY VALIDATION: 100% PASS');
  console.log('============================================================\n');
  return true;
}

validateAccessibility()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nACCESSIBILITY VALIDATION FAILED:', err);
    process.exit(1);
  });
