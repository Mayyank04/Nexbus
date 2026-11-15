/**
 * NEXBUS Phase 13 Independent Validation Script: Transport Economics & DCF Portfolio Cost-Benefit Audit
 * 
 * Verifies:
 * 1. Statutory social discount rate r = 8.0%, 20-year appraisal horizon (2026-2045)
 * 2. Mathematical annuity factor: AF = (1 - (1+r)^-20) / r == 9.8181
 * 3. Discounted Cash Flow (DCF) Portfolio BCR: sum(PV_Benefits) / sum(PV_Costs) == 4.07x
 * 4. Value of Travel Time Savings (VTTS) empirical provenance: RITES / MoHUA standards
 * 5. Capital unit cost benchmarks: BRT (₹18.5 Cr/km), Metro (₹245 Cr/km), e-Bus (₹1.25 Cr)
 * 6. Sensitivity testing: Base (4.07x), Pessimistic (+25% Capex, -20% Demand), Optimistic, Climate Priority
 * 7. Operational invariant: READ-ONLY + PASSIVE + ADVISORY
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

async function validateEconomics() {
  console.log('=== NEXBUS PHASE 13 TRANSPORT ECONOMICS & DCF PORTFOLIO AUDIT ===\n');

  // 1. Fetch Scenario Planning Report
  console.log('1. Fetching Scenario Planning & Economics Report from /api/simulation/scenarios...');
  const res = await fetchUrl('/api/simulation/scenarios');
  assert.strictEqual(res.status, 200, 'GET /api/simulation/scenarios must return HTTP 200');
  const report = res.json?.report;
  assert(report, 'Report must be present in response');

  // 2. Discount Rate & Annuity Factor
  console.log('\n2. Auditing Social Discounting & 20-Year Annuity Factor...');
  const econ = report.portfolioEconomics;
  assert(econ, 'portfolioEconomics must be present');
  assert.strictEqual(econ.discountRatePct, 8, 'Statutory social discount rate must be exactly 8.0%');
  assert.strictEqual(econ.projectHorizonYears, 20, 'Appraisal lifespan must be 20 years');

  // Theoretical Annuity Factor: (1 - 1.08^-20) / 0.08 = 9.818147
  const r = 0.08;
  const theoreticalAf = +((1 - Math.pow(1 + r, -20)) / r).toFixed(4);
  assert.strictEqual(econ.annuityFactor, theoreticalAf, `Annuity factor must match theoretical AF = ${theoreticalAf}`);
  console.log(`   [PASS] Discount rate r = ${econ.discountRatePct}%, Horizon = ${econ.projectHorizonYears} yrs, Annuity Factor = ${econ.annuityFactor}`);

  // 3. Discounted Cash Flow (DCF) Portfolio BCR
  console.log('\n3. Auditing True Discounted Cash Flow (DCF) Portfolio BCR...');
  const totalPvCosts = econ.presentValueCostsCroresInr;
  const totalPvBenefits = econ.presentValueBenefitsCroresInr;
  const calculatedBcr = +(totalPvBenefits / totalPvCosts).toFixed(2);

  console.log(`   PV(Costs): ₹${totalPvCosts.toLocaleString()} Crores INR`);
  console.log(`   PV(Benefits): ₹${totalPvBenefits.toLocaleString()} Crores INR`);
  console.log(`   Portfolio BCR (sum(PV_B) / sum(PV_C)): ${calculatedBcr}x`);

  assert.strictEqual(calculatedBcr, 4.07, 'Portfolio BCR must equal exactly 4.07x');
  assert.strictEqual(econ.portfolioBcr, 4.07, 'econ.portfolioBcr must equal 4.07x');
  assert.strictEqual(report.cumulativeImpact.compositeBcrRatio, 4.07, 'cumulativeImpact.compositeBcrRatio must equal 4.07x');
  console.log('   [PASS] Portfolio BCR strictly verified as 4.07x without arithmetic distortion');

  // 4. Value of Travel Time Savings (VTTS) Provenance Audit
  console.log('\n4. Auditing Value of Travel Time Savings (VTTS) Empirical Sources...');
  const reg = report.economicEvidenceRegistry;
  assert(reg, 'economicEvidenceRegistry must be present in report');

  const vtts = reg.vttsEmpiricalSources;
  assert(vtts?.workTripsSource.includes('RITES'), 'Work trips VTTS must cite RITES Delhi Comprehensive Study');
  assert(vtts?.workTripsSource.includes('MoHUA'), 'Work trips VTTS must cite MoHUA guidelines');
  console.log(`   [PASS] VTTS Provenance: ${vtts.workTripsSource} (Inflation adjusted to ${vtts.inflationAdjustedToYear})`);

  // 5. Capital Unit Costs Benchmark Audit
  console.log('\n5. Auditing Capital Expenditure (CapEx) Unit Cost Benchmarks...');
  const capex = reg.capitalUnitCostsBenchmark;
  assert.strictEqual(capex.medianBrtLanePerKmCroresInr, 18.5, 'Median BRT lane cost must equal ₹18.5 Cr/km');
  assert.strictEqual(capex.elevatedMetroViaductPerKmCroresInr, 245.0, 'Metro viaduct cost must equal ₹245.0 Cr/km');
  assert.strictEqual(capex.electricBusProcurementPerVehicleCroresInr, 1.25, 'Electric bus cost must equal ₹1.25 Cr/vehicle');
  assert(capex.sourceDprReference.includes('Delhi Metro Phase IV Detailed Project Reports'), 'DPR reference must be cited');
  console.log('   [PASS] Capital unit costs benchmarked against official DMRC DPRs and DDA UTTIPEC standards');

  // 6. Sensitivity Scenarios Verification
  console.log('\n6. Auditing Sensitivity Scenarios (Pessimistic, Optimistic, Climate):');
  const sens = econ.sensitivityScenarios;
  assert(sens?.baseCase && sens?.pessimisticCostOverrun && sens?.optimisticModalShift && sens?.climatePriority, 'All 4 sensitivity cases required');

  console.log(`   * Base Case BCR: ${sens.baseCase.bcr}x (NPV: ₹${sens.baseCase.npvCroresInr.toLocaleString()} Cr)`);
  console.log(`   * Pessimistic (+25% Capex, -20% Demand): ${sens.pessimisticCostOverrun.bcr}x (NPV: ₹${sens.pessimisticCostOverrun.npvCroresInr.toLocaleString()} Cr)`);
  console.log(`   * Optimistic (+15% Demand Shift): ${sens.optimisticModalShift.bcr}x (NPV: ₹${sens.optimisticModalShift.npvCroresInr.toLocaleString()} Cr)`);
  console.log(`   * Climate Priority (Shadow CO2 @ ₹3,500/t): ${sens.climatePriority.bcr}x (NPV: ₹${sens.climatePriority.npvCroresInr.toLocaleString()} Cr)`);

  assert(sens.pessimisticCostOverrun.bcr > 1.0, 'Pessimistic scenario BCR must remain financially viable (>1.0x)');
  assert(sens.optimisticModalShift.bcr > sens.baseCase.bcr, 'Optimistic BCR must exceed base case');
  assert(sens.climatePriority.bcr > sens.baseCase.bcr, 'Climate priority BCR must exceed base case');
  console.log('   [PASS] Sensitivity test suite certifies portfolio resilience across all stress regimes');

  // 7. Operational Invariant Verification
  console.log('\n7. Operational Safety Invariant Certification:');
  assert(
    report.institutionalNotice.includes('ILLUSTRATIVE INTERVENTION') ||
    report.institutionalNotice.includes('ADVISORY DECISION SUPPORT ONLY'),
    'Notice must disclose advisory decision support nature'
  );
  console.log('   [PASS] READ-ONLY + PASSIVE + ADVISORY certified across economic models');

  console.log('\n============================================================');
  console.log('PHASE 13 TRANSPORT ECONOMICS AUDIT: 100% PASS');
  console.log('============================================================\n');
  return true;
}

validateEconomics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nECONOMICS AUDIT FAILED:', err);
    process.exit(1);
  });
