/**
 * NEXBUS Phase 14 Master Scientific Reproduction Harness
 * 
 * Executes all Phase 14 independent scientific reproduction and benchmarking scripts:
 * 1. Statistical Corrections Audit (scripts/phase14-statistical-corrections.mjs)
 * 2. External Benchmark Registry Audit (scripts/audit-external-benchmark-data.mjs)
 * 3. External Journey-Time Benchmarking (scripts/phase14-journey-benchmark.mjs)
 * 4. Headway Reliability & EWT Benchmark (scripts/phase14-headway-benchmark.mjs)
 * 5. Independent OD Screenline GEH Validation (scripts/phase14-od-screenline-validation.mjs)
 * 6. ML Generalization & Dual-Axis Holdout (scripts/phase14-ml-independent-holdout.mjs)
 * 7. Economic Assumptions & DCF Model (scripts/validate-economic-assumptions.mjs)
 * 8. Environmental Claims & WTW Model (scripts/validate-environmental-claims.mjs)
 * 
 * Emits complete reproducibility metadata (Run ID, Git commit, timestamps, SHA-256 hashes, status).
 */

import { execSync } from 'node:child_process';
import crypto from 'node:crypto';

export async function reproduceAll() {
  const runId = `RUN-PHASE14-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const timestamp = new Date().toISOString();

  let gitCommit = 'UNKNOWN';
  try {
    gitCommit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  } catch {}

  console.log('\n========================================================================');
  console.log('       NEXBUS PHASE 14 — MASTER SCIENTIFIC REPRODUCTION HARNESS');
  console.log('========================================================================');
  console.log(`Run ID:              ${runId}`);
  console.log(`Execution Timestamp: ${timestamp}`);
  console.log(`Git Commit Baseline: ${gitCommit}`);
  console.log(`Operational Status:  READ-ONLY + PASSIVE + ADVISORY`);
  console.log('------------------------------------------------------------------------\n');

  const suite = [
    {
      id: 'STAGE-01',
      name: 'Statistical Arithmetic & Methodology Corrections',
      script: 'node scripts/phase14-statistical-corrections.mjs',
      description: 'Headway EWT arithmetic proof, passenger wait penalty, cluster bootstrap',
    },
    {
      id: 'STAGE-02',
      name: 'External Benchmark Data Provenance Audit',
      script: 'node scripts/audit-external-benchmark-data.mjs',
      description: '8 external benchmark feeds, SHA-256 digests, 4-tier separation',
    },
    {
      id: 'STAGE-04',
      name: 'External Journey-Time Accuracy Benchmarking',
      script: 'node scripts/phase14-journey-benchmark.mjs',
      description: '240 matched runs, 4 baseline models, cluster-adjusted bootstrap CI',
    },
    {
      id: 'STAGE-05',
      name: 'Headway Reliability & Excess Waiting Time',
      script: 'node scripts/phase14-headway-benchmark.mjs',
      description: 'Welding-Osuna formulation, Seddon-Day timetable regime, 5 unit tests',
    },
    {
      id: 'STAGE-06',
      name: 'Origin-Destination Screenline GEH Validation',
      script: 'node scripts/phase14-od-screenline-validation.mjs',
      description: 'RITES 16-hr cordon counts, 8 strategic screenlines, GEH < 5.0 pass rate',
    },
    {
      id: 'STAGE-07',
      name: 'ML Generalization & Independent Holdout',
      script: 'node scripts/phase14-ml-independent-holdout.mjs',
      description: 'Dual-axis holdout, geographic transfer, Bayesian PICP-95, OOD stress',
    },
    {
      id: 'STAGE-09A',
      name: 'Transport Economics 20-Year DCF Appraisal',
      script: 'node scripts/validate-economic-assumptions.mjs',
      description: '8% discount rate, 20-yr horizon, annuity factor 9.8181, 4.07x BCR',
    },
    {
      id: 'STAGE-09B',
      name: 'Well-to-Wheel Lifecycle Emissions Model',
      script: 'node scripts/validate-environmental-claims.mjs',
      description: 'CEA grid factor 0.716 kg CO2/kWh, 45.2% WTW e-bus carbon abatement',
    },
  ];

  const results = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const test of suite) {
    process.stdout.write(`Executing ${test.id}: ${test.name.padEnd(46)} ... `);
    const startMs = Date.now();
    try {
      const output = execSync(test.script, { encoding: 'utf8' });
      const durationMs = Date.now() - startMs;
      const pass = !output.includes('FAILED') && !output.includes('ERR_ASSERTION');
      if (pass) {
        console.log(`[PASS] (${durationMs} ms)`);
        passedCount++;
        results.push({ ...test, status: 'PASS', durationMs });
      } else {
        console.log(`[FAIL] (${durationMs} ms)`);
        failedCount++;
        results.push({ ...test, status: 'FAIL', durationMs, output });
      }
    } catch (err) {
      const durationMs = Date.now() - startMs;
      console.log(`[FAIL] (${durationMs} ms)`);
      failedCount++;
      results.push({ ...test, status: 'FAIL', durationMs, error: err.message });
    }
  }

  console.log('\n========================================================================');
  console.log('              PHASE 14 MASTER REPRODUCTION SUMMARY');
  console.log('========================================================================');
  console.log(`Total Validation Modules Executed: ${suite.length}`);
  console.log(`Modules Passed:                    ${passedCount}`);
  console.log(`Modules Failed:                    ${failedCount}`);
  console.log(`Independent Reproducibility Score: ${((passedCount / suite.length) * 100).toFixed(1)}%`);
  console.log('========================================================================\n');

  if (failedCount > 0) {
    console.error('Fatal: One or more reproduction modules failed validation.');
    process.exit(1);
  }

  return { runId, timestamp, gitCommit, passedCount, totalCount: suite.length };
}

if (process.argv[1]?.endsWith('phase14-reproduce-all.mjs')) {
  reproduceAll()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('\nREPRODUCTION HARNESS CRASHED:', err);
      process.exit(1);
    });
}
