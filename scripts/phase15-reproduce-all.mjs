/**
 * NEXBUS Phase 15 — Master Scientific Reproduction Runner
 * 
 * Executes all Phase 15 independent validation suites in sequence:
 * 1. Data Registry & Source Manifest Audit
 * 2. Journey-Time Metric & Baseline Model Evaluation
 * 3. Headway Variance & Passenger Waiting-Time Validation
 * 4. Origin-Destination Conservation & Screenline Holdout Validation
 * 5. Machine Learning Generalization & Geographic Holdout Validation
 * 6. Privacy, Security & Data Governance Controls
 * 
 * Operational Invariant: READ-ONLY + PASSIVE + ADVISORY
 */

import { runDataRegistryAudit } from './phase15-audit-data-registry.mjs';
import { runPhase15JourneyValidation } from './phase15-journey-validation.mjs';
import { runPhase15HeadwayValidation } from './phase15-headway-validation.mjs';
import { runPhase15OdValidation } from './phase15-od-validation.mjs';
import { runPhase15MlHoldoutValidation } from './phase15-ml-holdout-validation.mjs';
import { runPhase15GovernanceTests } from './test-phase15-governance.mjs';

export async function runAllPhase15Reproductions() {
  console.log('========================================================================');
  console.log('NEXBUS PHASE 15 — MASTER SCIENTIFIC REPRODUCTION & AUDIT RUNNER');
  console.log('Operational Invariant: READ-ONLY + PASSIVE + ADVISORY');
  console.log('========================================================================\n');

  const startTime = Date.now();
  const summary = [];

  // Suite 1: Data Registry
  console.log('>>> [1/6] Executing Independent Data & Source Registry Audit...');
  await runDataRegistryAudit();
  summary.push({ name: 'Independent Data & Source Registry Audit', status: 'PASSED' });

  // Suite 2: Journey Times
  console.log('>>> [2/6] Executing Journey-Time Baseline Comparative Validation...');
  await runPhase15JourneyValidation();
  summary.push({ name: 'Journey-Time Baseline Validation (N = 240, SIMULATED)', status: 'PASSED' });

  // Suite 3: Headway & EWT
  console.log('>>> [3/6] Executing Headway Reliability & Dual Arrival Regimes Validation...');
  await runPhase15HeadwayValidation();
  summary.push({ name: 'Headway Variance & Dual Regime Waiting-Time Validation', status: 'PASSED' });

  // Suite 4: OD Matrix & Screenlines
  console.log('>>> [4/6] Executing OD Matrix Conservation & Screenline Holdout Validation...');
  await runPhase15OdValidation();
  summary.push({ name: 'Furness IPF Conservation & Screenline Holdout Validation', status: 'PASSED' });

  // Suite 5: ML Generalization
  console.log('>>> [5/6] Executing ML Generalization & Geographic Holdout Validation...');
  await runPhase15MlHoldoutValidation();
  summary.push({ name: 'ST-GNN ML Generalization & Geographic Holdout Validation', status: 'PASSED' });

  // Suite 6: Governance & Security
  console.log('>>> [6/6] Executing Privacy, Security & Data Governance Verification...');
  await runPhase15GovernanceTests();
  summary.push({ name: 'Privacy, Security & Data Governance Verification', status: 'PASSED' });

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n========================================================================');
  console.log(`NEXBUS PHASE 15 MASTER REPRODUCTION COMPLETE: ALL SUITES PASSED (${elapsedSec}s)`);
  console.log('========================================================================');
  console.table(summary);
  return true;
}

runAllPhase15Reproductions().catch((err) => {
  console.error('\nMASTER REPRODUCTION FAILED:', err);
  process.exit(1);
});
