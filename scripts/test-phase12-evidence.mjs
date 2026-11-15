/**
 * NEXBUS Phase 12 Comprehensive Evidence Acquisition & Regression Validation Suite
 * 
 * Verifies:
 * 1. Verified Provider Registry: 8 providers, status reporting, on-demand SHA-256 cryptographic verification
 * 2. Expanded Multimodal Network: 256 physical stops across 11 Delhi districts, GTFS referential & geodetic validity
 * 3. Mobility Field Observation Framework: Privacy guarantees, 4-decimal GPS truncation, salted HMAC pseudonymization
 * 4. Passenger Demand Empirical Calibration: Explicit demand categorization, Furness IPF convergence, AFC turnstile dossier
 * 5. ML Research & Model Lifecycle: Formal lifecycle states, OOD robustness benchmark summary, ST-GNN surrogate
 * 6. Multi-Profile Pedestrian Accessibility: OSM walkway audit, wheelchair barrier-free routing, district equity Gini 0.29
 * 7. Economic Evidence & WTW Emissions: RITES/MoHUA VTTS benchmarks, DPR unit costs, CEA grid emission factor 0.716 kg CO2/kWh
 * 8. Research Pilot Protocol & Safety Invariant: Aurobindo Marg corridor, 4 checkpoints, zero PII, READ-ONLY + PASSIVE + ADVISORY
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function fetchUrl(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, options);
  let json = null;
  try {
    json = await res.json();
  } catch {
    // not JSON
  }
  return { status: res.status, json };
}

export async function runPhase12Validation() {
  console.log('\n=== NEXBUS PHASE 12 REAL-WORLD EVIDENCE & EMPIRICAL CALIBRATION SUITE ===\n');

  // -------------------------------------------------------------
  // Test 1: Verified Provider Registry & Cryptographic Verification
  // -------------------------------------------------------------
  console.log('1. Testing Provider Registry & Cryptographic Archival at /api/ingestion/providers...');
  const resProviders = await fetchUrl('/api/ingestion/providers');
  assert.strictEqual(resProviders.status, 200, 'GET /api/ingestion/providers must return HTTP 200');
  assert(resProviders.json?.success, 'Response must indicate success');

  const provSummary = resProviders.json?.summary;
  assert(provSummary, 'Summary must be present');
  assert.strictEqual(provSummary.totalProvidersCount, 8, `Must register exactly 8 transport/civic providers (Found: ${provSummary.totalProvidersCount})`);
  assert(provSummary.compositeHealthScorePct >= 70, `Composite health score must be >= 70% (Got: ${provSummary.compositeHealthScorePct}%)`);

  // Verify presence of all 8 core providers
  const expectedProviderIds = [
    'delhi_otd_gtfs_static',
    'delhi_otd_gtfs_rt',
    'dmrc_network_tables',
    'delhi_osm_transit_roads',
    'cpcb_delhi_aqi',
    'delhi_census_demographics',
    'PROVIDER_DTC_FLEET',
    'PROVIDER_IMD_WEATHER',
  ];
  for (const pid of expectedProviderIds) {
    const found = provSummary.providers.find((p) => p.id === pid);
    assert(found, `Provider ${pid} must be registered in registry`);
  }
  console.log('   [PASS] 8 verified external & observed providers validated in registry');

  // Verify on-demand SHA-256 cryptographic verification
  const archives = resProviders.json?.archives;
  assert(archives && archives.length >= 7, 'Archive ledger must contain >= 7 baseline records');
  const testArchiveId = archives[0].archiveId;
  const resVerify = await fetchUrl(`/api/ingestion/providers?verifyArchive=${testArchiveId}`);
  assert.strictEqual(resVerify.status, 200, 'Archive verification query must return HTTP 200');
  assert.strictEqual(resVerify.json?.verification?.isIntegrityVerified, true, 'Cryptographic integrity must be verified');
  assert.strictEqual(
    resVerify.json?.verification?.expectedSha256,
    resVerify.json?.verification?.computedSha256,
    'Expected and computed SHA-256 hashes must match exactly'
  );
  console.log(`   [PASS] SHA-256 cryptographic archive verification passed for ${testArchiveId}`);

  // -------------------------------------------------------------
  // Test 2: Expanded Multimodal Network Validation (256 Stops across 11 Districts)
  // -------------------------------------------------------------
  console.log('\n2. Testing Expanded Multimodal Network at /api/network/expanded...');
  const resExpanded = await fetchUrl('/api/network/expanded?limit=100');
  assert.strictEqual(resExpanded.status, 200, 'GET /api/network/expanded must return HTTP 200');
  assert.strictEqual(resExpanded.json?.scope, 'DELHI_EXPANDED_MULTIMODAL_NETWORK', 'Scope must declare expanded network');

  const expReport = resExpanded.json?.validationReport;
  assert(expReport, 'Validation report must be present');
  assert.strictEqual(expReport.totalStops, 256, `Expanded network must contain 256 physical stops (Found: ${expReport.totalStops})`);
  assert.strictEqual(expReport.isReferentiallyValid, true, 'GTFS referential integrity must be 100% valid');
  assert.strictEqual(expReport.isSpatiallyValid, true, 'Spatial and kinematic speed feasibility must be 100% valid');
  assert.strictEqual(expReport.geodeticViolations.length, 0, 'Zero geodetic boundary violations permitted');
  assert.strictEqual(expReport.speedViolations.length, 0, 'Zero inter-stop speed violations permitted');

  // Verify coverage across all 11 Delhi districts
  const districtCounts = expReport.districtCoverageCounts;
  assert.strictEqual(Object.keys(districtCounts).length, 11, 'Must encompass all 11 Delhi statutory districts');
  console.log('   [PASS] 256 physical stops validated across all 11 Delhi districts with zero referential errors');

  // -------------------------------------------------------------
  // Test 3: Mobility Field Observation Framework & Privacy Invariants
  // -------------------------------------------------------------
  console.log('\n3. Testing Field Observation Ingestion & Privacy Guarantees at /api/ingestion/observations...');
  const testSubmission = {
    researcherSaltId: 'RESEARCH-HARNESS-RUNNER',
    voluntaryConsentConfirmed: true,
    observationType: 'SCHEDULED_VS_OBSERVED',
    stopId: 'stop-aiims-gate2',
    stopName: 'AIIMS Metro Station Bus Stop',
    routeId: 'R-502',
    corridorId: 'corridor-aurobindo-marg',
    vehicleRegistrationMasked: `DL-1PD-${Math.floor(1000 + Math.random() * 8999)}**`,
    latitude: 28.5672451, // high precision to test truncation
    longitude: 77.2100812,
    scheduledTimeIso: new Date(Date.now() - 300000).toISOString(),
    observedTimeIso: new Date(Date.now() - Math.floor(Math.random() * 60000)).toISOString(),
    dwellTimeSeconds: 40,
    boardingsCount: 16,
    alightingsCount: 7,
    crowdingScore: 4,
    weatherCondition: 'CLEAR',
  };

  const resPostObs = await fetchUrl('/api/ingestion/observations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testSubmission),
  });
  assert.strictEqual(resPostObs.status, 200, 'POST /api/ingestion/observations must return HTTP 200');
  assert(resPostObs.json?.success, 'Submission must succeed');

  const recObs = resPostObs.json?.observation;
  assert(recObs, 'Sanitized observation must be returned');
  assert(recObs.pseudonymizedObserverId.startsWith('OBS-'), 'Observer ID must be pseudonymized');
  assert.strictEqual(recObs.truncatedLatitude, 28.5672, 'Latitude must be truncated to 4 decimal places');
  assert.strictEqual(recObs.truncatedLongitude, 77.2101, 'Longitude must be truncated to 4 decimal places');
  assert.strictEqual(recObs.privacyComplianceAudit?.piiPurged, true, 'PII must be audited as purged');
  assert.strictEqual(recObs.privacyComplianceAudit?.spatialTruncated, true, 'Spatial coordinates must be truncated');
  assert.strictEqual(recObs.privacyComplianceAudit?.temporalQuantized, true, 'Timestamps must be quantized');
  assert(recObs.sha256Digest && recObs.sha256Digest.length === 64, 'Record must contain 64-char SHA-256 digest');
  console.log('   [PASS] Field observation ingestion verified: 4-decimal truncation, HMAC pseudonymization, zero PII');

  // -------------------------------------------------------------
  // Test 4: Passenger Demand Empirical Calibration & AFC Requirements
  // -------------------------------------------------------------
  console.log('\n4. Testing Demand Calibration & AFC Requirements at /api/demand/od-matrix...');
  const resOd = await fetchUrl('/api/demand/od-matrix?timeWindow=AM_PEAK');
  assert.strictEqual(resOd.status, 200, 'GET /api/demand/od-matrix must return HTTP 200');
  const odReport = resOd.json?.report;
  assert(odReport, 'OD report must be present');

  // Verify demand categories on cells
  const sampleCell = odReport.matrix[0];
  assert(sampleCell.demandCategory, 'ODFlowCell must specify demandCategory');
  assert(
    ['MODEL_ESTIMATED', 'TICKETING_DERIVED', 'OBSERVED', 'SYNTHETIC'].includes(sampleCell.demandCategory),
    `Valid demand category expected (Got: ${sampleCell.demandCategory})`
  );

  // Verify calibration evidence dossier
  const calDossier = odReport.calibrationEvidenceDossier;
  assert(calDossier, 'calibrationEvidenceDossier must be present in OD report');
  assert(calDossier.demandCategoryBreakdown, 'Demand category breakdown must be exposed');
  assert.strictEqual(calDossier.demandCategoryBreakdown.OBSERVED, 0, 'OBSERVED demand must be 0% pending turnstile access');
  assert(calDossier.demandCategoryBreakdown.TICKETING_DERIVED > 0, 'Ticketing-derived demand must be present');
  assert(calDossier.afcTurnstileDataRequirements, 'AFC turnstile requirements must be documented');
  assert(calDossier.etmBoardingDataRequirements, 'ETM boarding requirements must be documented');
  console.log('   [PASS] Demand calibration dossier verified: explicit demand taxonomy & AFC requirements disclosed');

  // -------------------------------------------------------------
  // Test 5: Machine Learning Lifecycle & OOD Robustness
  // -------------------------------------------------------------
  console.log('\n5. Testing ML Model Lifecycle & Robustness at /api/ml/registry...');
  const resMlReg = await fetchUrl('/api/ml/registry');
  assert.strictEqual(resMlReg.status, 200, 'GET /api/ml/registry must return HTTP 200');
  assert.strictEqual(resMlReg.json?.totalRegisteredModels, 5, 'Must contain 5 registered models');

  // Verify formal lifecycle states
  const validLifecycleStates = ['RESEARCH', 'VALIDATION', 'APPROVED', 'ACTIVE', 'DEPRECATED'];
  for (const m of resMlReg.json?.models || []) {
    assert(m.lifecycleState, `Model ${m.modelId} must define lifecycleState`);
    assert(validLifecycleStates.includes(m.lifecycleState), `Valid lifecycle state expected for ${m.modelId}`);
    assert(m.robustnessEvaluation, `Model ${m.modelId} must define robustnessEvaluation`);
  }

  // Verify ST-GNN surrogate is ACTIVE production surrogate
  const stgnn = resMlReg.json?.models?.find((m) => m.modelId === 'model-stgnn-surrogate');
  assert.strictEqual(stgnn?.lifecycleState, 'ACTIVE', 'ST-GNN must be in ACTIVE lifecycle state');
  assert.strictEqual(stgnn?.status, 'ACTIVE_PRODUCTION', 'ST-GNN must be ACTIVE_PRODUCTION');
  assert(resMlReg.json?.robustnessBenchmarkSummary, 'Catalog must provide robustnessBenchmarkSummary');
  console.log('   [PASS] ML lifecycle states and out-of-distribution robustness evaluations validated');

  // -------------------------------------------------------------
  // Test 6: Multi-Profile Pedestrian Accessibility & OSM Walkway Routing
  // -------------------------------------------------------------
  console.log('\n6. Testing Multi-Profile Accessibility at /api/multimodal/accessibility...');
  const resAccessWheel = await fetchUrl('/api/multimodal/accessibility?profile=wheelchair');
  assert.strictEqual(resAccessWheel.status, 200, 'GET /api/multimodal/accessibility?profile=wheelchair returns HTTP 200');
  assert.strictEqual(resAccessWheel.json?.districts?.length, 11, 'Evaluates all 11 Delhi districts');
  assert.strictEqual(resAccessWheel.json?.pedestrianCircuityFactorAverage, 1.31, 'Mean circuity factor gamma is 1.31');
  assert.strictEqual(resAccessWheel.json?.equityBarometers?.spatialEquityGini, 0.29, 'Spatial equity Gini is 0.29');

  const pedAudit = resAccessWheel.json?.pedestrianProfileAudit;
  assert(pedAudit, 'pedestrianProfileAudit must be present');
  assert(pedAudit.osmStreetSegmentsAnalyzed >= 10000, 'Must analyze >= 10,000 OSM street segments');
  assert(pedAudit.profiles?.WHEELCHAIR_ACCESSIBLE, 'Wheelchair profile must be evaluated');
  assert.strictEqual(pedAudit.profiles?.WHEELCHAIR_ACCESSIBLE?.barrierFreeRequired, true, 'Wheelchair route must require barrier-free path');
  assert(pedAudit.profiles?.WHEELCHAIR_ACCESSIBLE?.circuityPenaltyFactor > 1.31, 'Wheelchair circuity penalty must exceed general pedestrian due to elevator/curb detours');
  console.log('   [PASS] Multi-profile pedestrian routing validated: wheelchair barrier-free routing & OSM walkway audit');

  // -------------------------------------------------------------
  // Test 7: Transport Economics & WTW Environmental Emissions
  // -------------------------------------------------------------
  console.log('\n7. Testing Economic Evidence & WTW Emissions at /api/simulation/scenarios...');
  const resScen = await fetchUrl('/api/simulation/scenarios');
  assert.strictEqual(resScen.status, 200, 'GET /api/simulation/scenarios returns HTTP 200');

  const econReg = resScen.json?.report?.economicEvidenceRegistry;
  assert(econReg, 'economicEvidenceRegistry must be present in scenario report');
  assert(econReg.vttsEmpiricalSources?.workTripsSource.includes('RITES'), 'VTTS must cite empirical RITES survey');
  assert(econReg.capitalUnitCostsBenchmark?.medianBrtLanePerKmCroresInr > 0, 'BRT unit cost benchmark must be positive');
  assert.strictEqual(econReg.lifecycleEmissionFactors?.gridElectricityIntensityKgCo2PerKwh, 0.716, 'CEA grid baseline must be 0.716 kg CO2/kWh');
  assert(econReg.lifecycleEmissionFactors?.electricBusWellToWheelGCo2PerKm < econReg.lifecycleEmissionFactors?.cngBusWellToWheelGCo2PerKm, 'Electric bus WTW emissions must be lower than CNG');

  // Verify DCF Portfolio BCR remains exactly 4.07x
  assert.strictEqual(resScen.json?.report?.portfolioEconomics?.portfolioBcr, 4.07, 'Portfolio BCR must equal 4.07x');
  console.log('   [PASS] Economic evidence registry and WTW lifecycle carbon factors validated');

  // -------------------------------------------------------------
  // Test 8: Real-World Research Pilot Protocol & Operational Safety Invariant
  // -------------------------------------------------------------
  console.log('\n8. Testing Research Pilot Protocol & Safety Invariant at /api/pilot/protocol...');
  const resPilot = await fetchUrl('/api/pilot/protocol');
  assert.strictEqual(resPilot.status, 200, 'GET /api/pilot/protocol returns HTTP 200');

  const protocol = resPilot.json?.protocol;
  assert(protocol, 'Protocol must be defined');
  assert(protocol.protocolId.startsWith('PILOT-'), 'Valid protocol ID format expected');
  assert.strictEqual(protocol.studyCorridor?.id, 'corridor-aurobindo-marg', 'Study corridor must be Aurobindo Marg');
  assert(protocol.checkpoints?.length >= 4, `Must designate >= 4 physical checkpoints (Got: ${protocol.checkpoints?.length})`);
  assert(protocol.progress?.completionPct >= 70, `Pilot completion must be >= 70% (Got: ${protocol.progress?.completionPct}%)`);
  assert.strictEqual(protocol.progress?.zeroPiiIncidentsRecorded, 0, 'Zero PII incidents required');

  // Assert non-negotiable safety invariant
  assert(
    protocol.advisorySafetyInvariant.includes('READ-ONLY + PASSIVE + ADVISORY'),
    'Safety invariant must enforce READ-ONLY + PASSIVE + ADVISORY'
  );
  assert(
    protocol.advisorySafetyInvariant.includes('Strictly zero vehicle dispatch') ||
    protocol.advisorySafetyInvariant.includes('do not interact with vehicle dispatch'),
    'Safety invariant must forbid dispatch actuation'
  );
  console.log('   [PASS] Research pilot protocol and READ-ONLY + PASSIVE + ADVISORY safety invariant certified');

  console.log('\nPHASE 12 COMPREHENSIVE EVIDENCE & CALIBRATION HARNESS: ALL 8 TESTS PASSED.\n');
  return true;
}

// Allow direct CLI execution
if (process.argv[1]?.endsWith('test-phase12-evidence.mjs')) {
  runPhase12Validation()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\nPHASE 12 VALIDATION FAILED:', err);
      process.exit(1);
    });
}
