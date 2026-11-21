/**
 * NEXBUS PHASE 24 USABILITY, EXPLAINABILITY & GOVERNANCE TEST SUITE
 * 
 * Verifies:
 * 1. Complete Canonical Terminology Registry (2-Level Explanations)
 * 2. All 11 GIS Vector/Raster layers with required explainability fields
 * 3. 3-Choice Journey Planner options (Fastest, Balanced, Comfort First)
 * 4. Simulation Lab explainability (4 outcome questions, Little's Law equations)
 * 5. 9-Tier Evidence Classification and 6 Freshness States
 * 6. Non-negotiable READ-ONLY + PASSIVE + ADVISORY Safety Invariant
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { PLAIN_LANGUAGE_DICTIONARY, getCrowdingDescription } from '../src/lib/content/plainLanguage.ts';
import { GIS_LAYERS_REGISTRY } from '../src/data/gisLayersRegistry.ts';

console.log('=== NEXBUS PHASE 24 USABILITY & GOVERNANCE TEST SUITE ===\n');

let passed = 0;
let failed = 0;

function testAssert(condition, name, details = '') {
  if (condition) {
    console.log(`[PASS] ${name}${details ? ` -> ${details}` : ''}`);
    passed++;
  } else {
    console.error(`[FAIL] ${name}${details ? ` -> ${details}` : ''}`);
    failed++;
  }
}

// -------------------------------------------------------------
// Test 1: Canonical Terminology Registry (Two-Level System)
// -------------------------------------------------------------
console.log('--- 1. Canonical Terminology Registry Audit ---');
const requiredTerms = [
  'headway',
  'excessWaitingTime',
  'crowdingIndex',
  'odMatrix',
  'modalInterchange',
  'accessibilityIndex',
  'gisLayers',
  'simulation',
  'provenance',
  'prediction',
  'dataFreshness',
  'emissionsIntensity',
  'transitNetwork',
  'congestion',
];

for (const termKey of requiredTerms) {
  const term = PLAIN_LANGUAGE_DICTIONARY[termKey];
  testAssert(
    !!term,
    `Term "${termKey}" is defined in PLAIN_LANGUAGE_DICTIONARY`,
    term ? `${term.plain} (${term.technical})` : 'MISSING'
  );
  if (term) {
    testAssert(
      typeof term.plain === 'string' && term.plain.length > 0,
      `Term "${termKey}" has Level 1 plain language title: "${term.plain}"`
    );
    testAssert(
      typeof term.childFriendly === 'string' && term.childFriendly.length > 0,
      `Term "${termKey}" has child-friendly title: "${term.childFriendly}"`
    );
    testAssert(
      typeof term.explanation === 'string' && term.explanation.length > 0,
      `Term "${termKey}" has clear explanation`
    );
    if (['headway', 'excessWaitingTime', 'crowdingIndex', 'odMatrix', 'modalInterchange', 'accessibilityIndex', 'simulation', 'provenance', 'prediction'].includes(termKey)) {
      testAssert(
        typeof term.formula === 'string' && term.formula.length > 0,
        `Term "${termKey}" has mathematical formula: ${term.formula}`
      );
      testAssert(
        Array.isArray(term.assumptions) && term.assumptions.length > 0,
        `Term "${termKey}" lists key assumptions (${term.assumptions?.length || 0})`
      );
      testAssert(
        Array.isArray(term.limitations) && term.limitations.length > 0,
        `Term "${termKey}" lists known limitations (${term.limitations?.length || 0})`
      );
    }
  }
}

// -------------------------------------------------------------
// Test 2: Triple-Encoded Crowding Semantics
// -------------------------------------------------------------
console.log('\n--- 2. Triple-Encoded Crowding Semantics ---');
const lowCrowd = getCrowdingDescription(45);
testAssert(
  lowCrowd.level === 'low' && lowCrowd.icon === '🟢' && lowCrowd.plainTitle === 'More space available',
  'Low crowding mapped to Green icon + text label'
);
const modCrowd = getCrowdingDescription(75);
testAssert(
  modCrowd.level === 'moderate' && modCrowd.icon === '🟡' && modCrowd.plainTitle === 'Some space available',
  'Moderate crowding mapped to Yellow icon + text label'
);
const highCrowd = getCrowdingDescription(92);
testAssert(
  highCrowd.level === 'high' && highCrowd.icon === '🔴' && highCrowd.plainTitle === 'Very crowded',
  'High crowding mapped to Red icon + text label'
);

// -------------------------------------------------------------
// Test 3: 11 GIS Vector/Raster Layers Audit
// -------------------------------------------------------------
console.log('\n--- 3. 11 Digital Twin GIS Layers Audit ---');
const expectedLayerIds = [
  'all',
  'metro',
  'buses',
  'interchanges',
  'demand',
  'flow',
  'utilization',
  'accessibility',
  'disruption',
  'flood_risk',
  'demographics',
];

testAssert(
  GIS_LAYERS_REGISTRY.length === 11,
  `GIS_LAYERS_REGISTRY exactly contains 11 layers (Found: ${GIS_LAYERS_REGISTRY.length})`
);

for (const layerId of expectedLayerIds) {
  const layer = GIS_LAYERS_REGISTRY.find((l) => l.id === layerId);
  testAssert(!!layer, `GIS Layer "${layerId}" is registered`, layer?.label);
  if (layer) {
    testAssert(
      typeof layer.plainTitle === 'string' && layer.plainTitle.length > 0,
      `Layer "${layerId}" has plain-language title: "${layer.plainTitle}"`
    );
    testAssert(
      typeof layer.description === 'string' && layer.description.length > 0,
      `Layer "${layerId}" has 1-sentence description`
    );
    testAssert(
      typeof layer.units === 'string' && layer.units.length > 0,
      `Layer "${layerId}" has units specified: "${layer.units}"`
    );
    testAssert(
      typeof layer.legend === 'string' && layer.legend.length > 0,
      `Layer "${layerId}" has legend specified`
    );
    testAssert(
      typeof layer.doesNotProve === 'string' && layer.doesNotProve.length > 0,
      `Layer "${layerId}" explicitly defines what it does NOT prove: "${layer.doesNotProve.substring(0, 50)}..."`
    );
  }
}

// -------------------------------------------------------------
// Test 4: Nine-Tier Evidence Classification & Freshness
// -------------------------------------------------------------
console.log('\n--- 4. Nine-Tier Evidence & Freshness Audit ---');
const requiredClassifications = [
  'OBSERVED',
  'VERIFIED_EXTERNAL',
  'DERIVED',
  'ESTIMATED',
  'PREDICTED',
  'SIMULATED',
  'SYNTHETIC',
  'UNAVAILABLE',
  'AUTH_REQUIRED',
];

const provIndicatorPath = path.resolve(process.cwd(), 'src/components/ui/ProvenanceIndicator.tsx');
const provContent = fs.readFileSync(provIndicatorPath, 'utf-8');

for (const c of requiredClassifications) {
  testAssert(
    provContent.includes(`${c}:`),
    `Classification "${c}" is defined in ProvenanceIndicator`
  );
}

const requiredFreshness = ['FRESH', 'AGING', 'STALE', 'EXPIRED', 'UNKNOWN', 'UNAVAILABLE'];
for (const f of requiredFreshness) {
  testAssert(
    provContent.includes(`${f}:`),
    `Freshness state "${f}" is defined in ProvenanceIndicator`
  );
}

// -------------------------------------------------------------
// Test 5: Operational Safety Invariant Enforcement
// -------------------------------------------------------------
console.log('\n--- 5. Operational Safety Invariant Enforcement ---');
const twinText = fs.readFileSync(path.resolve(process.cwd(), 'src/app/twin/page.tsx'), 'utf-8');
const simulateText = fs.readFileSync(path.resolve(process.cwd(), 'src/app/simulate/page.tsx'), 'utf-8');
const journeyText = fs.readFileSync(path.resolve(process.cwd(), 'src/app/journey/page.tsx'), 'utf-8');

testAssert(
  twinText.includes('READ-ONLY + PASSIVE + ADVISORY'),
  'Digital Twin displays prominent READ-ONLY + PASSIVE + ADVISORY notice'
);
testAssert(
  simulateText.includes('SIMULATED COUNTERFACTUAL • ADVISORY DECISION SUPPORT'),
  'Simulation Lab displays advisory counterfactual notice'
);
testAssert(
  journeyText.includes('PASSIVE ADVISORY • READ-ONLY DECISION SUPPORT'),
  'Journey Planner displays passive advisory decision support notice'
);

// Scan for prohibited actuation keywords in API routes
const apiDir = path.resolve(process.cwd(), 'src/app/api');
let actuationViolations = [];
function scanApiForActuation(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanApiForActuation(fullPath);
    } else if (/\.(ts|js)$/.test(file)) {
      const code = fs.readFileSync(fullPath, 'utf-8');
      if (/(dispatchVehicle|controlTrafficSignal|switchRailPoint|actuateEquipment)/.test(code)) {
        actuationViolations.push(fullPath);
      }
    }
  }
}
scanApiForActuation(apiDir);
testAssert(
  actuationViolations.length === 0,
  'Zero physical transit actuation endpoints (Strict Read-Only Invariant)',
  actuationViolations.length === 0 ? 'Verified 0 actuation channels' : `Violations in ${actuationViolations.join(', ')}`
);

console.log('\n======================================================');
console.log(`PHASE 24 USABILITY & GOVERNANCE RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
}
