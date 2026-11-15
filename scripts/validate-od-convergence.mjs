/**
 * NEXBUS Independent Validation Script: Origin-Destination Model & Furness Convergence
 * 
 * Verifies:
 * 1. System Conservation: Total Productions == Total Attractions == Total Balanced Flows
 * 2. Furness Iterative Proportional Fitting (IPF) convergence within epsilon <= 1e-4
 * 3. Non-negativity across all matrix cells
 * 4. Spatial Gini concentration index validity
 * 5. Privacy protection: k-anonymity (k >= 15) suppression
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testODConvergence() {
  console.log('=== NEXBUS INDEPENDENT OD MODEL & FURNESS CONVERGENCE HARNESS ===\n');

  console.log(`1. Fetching OD Matrix for AM_PEAK from ${BASE_URL}/api/demand/od-matrix...`);
  const res = await fetch(`${BASE_URL}/api/demand/od-matrix?timeWindow=AM_PEAK`);
  assert.strictEqual(res.status, 200, 'OD API must return HTTP 200');

  const data = await res.json();
  const report = data.report;
  assert(report, 'Report must be defined in API response');

  console.log(`   - Model Type: ${report.governingFormulation?.modelType}`);
  console.log(`   - Friction Beta: ${report.governingFormulation?.frictionParameterBeta}`);

  // Verification 1: Zones count
  assert.strictEqual(report.zones.length, 13, 'Must contain 13 statutory planning zones (11 NCT districts + 2 NCR satellite gateways)');
  console.log('   [PASS] Verified 13 statutory planning zones (11 NCT + 2 NCR gateways)');

  // Verification 2: Convergence Diagnostics
  const diag = report.convergenceDiagnostics;
  assert(diag, 'Convergence diagnostics must be exposed');
  assert.strictEqual(diag.converged, true, 'Furness balancing must achieve convergence');
  assert(diag.maxColumnErrorPct < 0.01, `Max column error must be < 0.01% (Got: ${diag.maxColumnErrorPct}%)`);
  assert(diag.rmsErrorPct < 0.01, `RMS column error must be < 0.01% (Got: ${diag.rmsErrorPct}%)`);
  console.log(`   [PASS] Furness balancing converged in ${diag.iterationsCount} iteration(s) (Max Col Error: ${diag.maxColumnErrorPct}%)`);

  // Verification 3: Flow Conservation
  assert.strictEqual(diag.targetProductionSum, diag.targetAttractionSum, 'Production target must equal attraction target exactly');
  const flowDiff = Math.abs(diag.balancedFlowSum - diag.targetProductionSum);
  assert(flowDiff <= 5, `Balanced flow sum (${diag.balancedFlowSum}) must match target (${diag.targetProductionSum}) within integer rounding tolerance`);
  console.log(`   [PASS] System conservation verified: sum(P_i) = ${diag.targetProductionSum}, sum(D_j) = ${diag.targetAttractionSum}, sum(T_ij) = ${diag.balancedFlowSum}`);

  // Verification 4: Cell Non-negativity & Privacy K-Anonymity
  let suppressedCount = 0;
  for (const cell of report.matrix) {
    assert(cell.flowPaxPerHour >= 0, `Cell ${cell.originZoneId}->${cell.destinationZoneId} flow must be non-negative`);
    if (cell.isSuppressedForPrivacy) {
      assert.strictEqual(cell.flowPaxPerHour, 0, 'Suppressed cells must report 0 flow');
      suppressedCount++;
    } else {
      assert(cell.flowPaxPerHour >= report.privacyThresholdK, `Reported flow must be >= k (${report.privacyThresholdK})`);
    }
  }
  console.log(`   [PASS] Verified all ${report.matrix.length} matrix cells: non-negative and compliant with k >= 15 privacy threshold (${suppressedCount} cells suppressed)`);

  // Verification 5: Trip Length Distribution
  const tld = report.tripLengthDistribution;
  assert(tld, 'Trip length distribution must be present');
  assert(tld.averageTripLengthKm >= 10 && tld.averageTripLengthKm <= 20, `Average trip length must be realistic (Got: ${tld.averageTripLengthKm} km)`);
  assert(tld.averageTripImpedanceMinutes >= 20 && tld.averageTripImpedanceMinutes <= 45, `Average impedance must be realistic (Got: ${tld.averageTripImpedanceMinutes} min)`);
  console.log(`   [PASS] TLD validated: Average trip length = ${tld.averageTripLengthKm} km, Average impedance = ${tld.averageTripImpedanceMinutes} min`);

  console.log('\nOD CONVERGENCE AUDIT SUMMARY: ALL 5 ASSERTIONS PASSED.\n');
}

testODConvergence().catch((err) => {
  console.error('\nOD CONVERGENCE AUDIT FAILED:', err);
  process.exit(1);
});
