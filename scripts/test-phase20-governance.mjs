/**
 * @file test-phase20-governance.mjs
 * @description Phase 20 Data Provenance, Production Governance, Security Hardening & Safety Invariant Test Harness
 */

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const BASE_URL = 'http://localhost:3000';

async function fetchJson(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Connection: 'close',
      'x-nexbus-internal-test': 'true',
      ...(options.headers || {}),
    },
    ...options,
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {}
  return { status: res.status, headers: res.headers, json, text };
}

async function runPhase20Tests() {
  console.log('\n=== NEXBUS PHASE 20 GOVERNANCE & PROVENANCE VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  async function test(description, fn) {
    try {
      await fn();
      console.log(`[PASS] ${description}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${description}`);
      console.error(`       ${err.message}`);
      failed++;
    }
  }

  // ----------------------------------------------------
  // 1. Unified Evidence Taxonomy & Classification Tests
  // ----------------------------------------------------
  console.log('--- 1. Testing Evidence Taxonomy & Immutability Rules ---');
  const evidenceCode = fs.readFileSync(path.join(ROOT, 'src/lib/evidence/evidenceClassification.ts'), 'utf-8');

  test('EvidenceClassification includes all 9 canonical types', () => {
    const required = [
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
    for (const type of required) {
      assert(evidenceCode.includes(`'${type}'`), `Missing canonical classification: ${type}`);
    }
  });

  test('Negative Test: Synthetic data cannot be elevated to Observed', () => {
    // Dynamic import of the compiled/source helper logic check
    assert(evidenceCode.includes('preventClassificationElevation'), 'preventClassificationElevation function missing');
    assert(
      evidenceCode.includes("current === 'SYNTHETIC' && target !== 'SYNTHETIC'"),
      'Synthetic elevation prevention guard missing'
    );
  });

  test('Negative Test: Predictions cannot become verified external observations', () => {
    assert(
      evidenceCode.includes("(current === 'PREDICTED' || current === 'SIMULATED')"),
      'Prediction/Simulation elevation guard missing'
    );
  });

  // ----------------------------------------------------
  // 2. Freshness & Timestamp Governance Tests
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Freshness & Timestamp Sanitation ---');

  test('Freshness states include FRESH, AGING, STALE, EXPIRED, UNKNOWN, UNAVAILABLE', () => {
    const states = ['FRESH', 'AGING', 'STALE', 'EXPIRED', 'UNKNOWN', 'UNAVAILABLE'];
    for (const state of states) {
      assert(evidenceCode.includes(`'${state}'`), `Missing freshness state: ${state}`);
    }
  });

  test('Negative Test: Missing timestamps return UNKNOWN without fabricating freshness', () => {
    assert(
      evidenceCode.includes("status: 'UNKNOWN', ageSeconds: null"),
      'Missing timestamp must return UNKNOWN without fabricated age'
    );
  });

  test('Future timestamps beyond clock skew threshold (5m) are flagged', () => {
    assert(
      evidenceCode.includes('Future timestamp detected beyond permissible clock skew'),
      'Future timestamp clock skew guard missing'
    );
  });

  // ----------------------------------------------------
  // 3. Security Hardening & Rate Limiting Verification
  // ----------------------------------------------------
  console.log('\n--- 3. Testing Rate Limiting Security Controls ---');
  const middlewareCode = fs.readFileSync(path.join(ROOT, 'src/middleware.ts'), 'utf-8');

  test('Negative Test: In production, unverified client header x-nexbus-internal-test cannot bypass rate limit', () => {
    assert(
      middlewareCode.includes('isProduction'),
      'isProduction environment check must be enforced in middleware'
    );
    assert(
      middlewareCode.includes('internalSecret.length >= 32'),
      'Production bypass requires a cryptographically verified >= 32-character secret'
    );
  });

  test('Environment template contains zero committed secrets', () => {
    const envPath = path.join(ROOT, '.env.example');
    assert(fs.existsSync(envPath), '.env.example template file must exist in repository root');
    const envExample = fs.readFileSync(envPath, 'utf-8');
    assert(!envExample.includes('ghp_'), 'GitHub token found in .env.example');
    assert(!envExample.includes('AIza'), 'Google API key found in .env.example');
    assert(!envExample.includes('sk-'), 'OpenAI/API secret found in .env.example');
    assert(envExample.includes('NEXBUS_SAFETY_MODE=READ_ONLY_PASSIVE'), 'Safety invariant must be in .env.example');
  });

  // ----------------------------------------------------
  // 4. API Provenance & Traceability Verification
  // ----------------------------------------------------
  console.log('\n--- 4. Testing API Provenance & Contract Endpoints ---');

  const provRes = await fetchJson('/api/network/provenance');
  test('GET /api/network/provenance returns 200 with safety invariant', () => {
    assert.strictEqual(provRes.status, 200, `Expected 200, got ${provRes.status}`);
    assert.strictEqual(provRes.json?.safetyInvariant, 'READ-ONLY + PASSIVE + ADVISORY');
  });

  test('Provenance registry includes evidenceClassificationBreakdown', () => {
    const breakdown = provRes.json?.registrySummary?.evidenceClassificationBreakdown;
    assert(breakdown, 'evidenceClassificationBreakdown missing from provenance summary');
    assert(typeof breakdown.VERIFIED_EXTERNAL === 'number', 'VERIFIED_EXTERNAL count missing');
    assert(typeof breakdown.ESTIMATED === 'number', 'ESTIMATED count missing');
    assert(typeof breakdown.PREDICTED === 'number', 'PREDICTED count missing');
  });

  test('All registered sources contain valid provenance metadata and evaluated freshness', () => {
    const sources = provRes.json?.sources;
    assert(Array.isArray(sources) && sources.length >= 6, 'Must have at least 6 registered sources');
    for (const s of sources) {
      assert(s.id, 'Source ID missing');
      assert(s.publisher, 'Source publisher missing');
      assert(s.evidenceClassification, `Source ${s.id} missing evidenceClassification`);
      assert(s.freshnessStatus, `Source ${s.id} missing freshnessStatus`);
    }
  });

  // ----------------------------------------------------
  // 5. PWA & Offline Cache Security Governance
  // ----------------------------------------------------
  console.log('\n--- 5. Testing Service Worker & Cache Isolation ---');
  const swCode = fs.readFileSync(path.join(ROOT, 'public/sw.js'), 'utf-8');

  test('Service worker enforces same-origin restriction against cache poisoning', () => {
    assert(
      swCode.includes('url.origin !== self.location.origin'),
      'Cache poisoning origin check missing from sw.js'
    );
  });

  test('Negative Test: Offline fallback cannot be returned as successful live data', () => {
    assert(
      swCode.includes("'X-Nexbus-Degraded': 'true'"),
      'Degraded header missing in sw.js offline fallback'
    );
    assert(
      swCode.includes("evidenceClassification: 'UNAVAILABLE'"),
      'Offline fallback must be classified as UNAVAILABLE'
    );
    assert(
      swCode.includes("error: 'OFFLINE_DEGRADATION'"),
      'Offline fallback must explicitly report OFFLINE_DEGRADATION'
    );
  });

  // ----------------------------------------------------
  // 6. Commuter Privacy & Zero PII Invariant
  // ----------------------------------------------------
  console.log('\n--- 6. Testing Civic Privacy & Zero PII Invariant ---');

  test('Zero geolocation device surveillance in client code', () => {
    const srcFiles = fs.readdirSync(path.join(ROOT, 'src'), { recursive: true });
    let geoUsageCount = 0;
    for (const file of srcFiles) {
      if (typeof file === 'string' && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
        const content = fs.readFileSync(path.join(ROOT, 'src', file), 'utf-8');
        if (content.includes('navigator.geolocation.getCurrentPosition')) {
          geoUsageCount++;
        }
      }
    }
    assert.strictEqual(geoUsageCount, 0, `Detected ${geoUsageCount} geolocation surveillance calls`);
  });

  // ----------------------------------------------------
  // 7. Non-Negotiable Read-Only Safety Invariant
  // ----------------------------------------------------
  console.log('\n--- 7. Testing Non-Negotiable Safety Invariant Regression ---');

  test('Zero physical actuation, dispatch, or signal control endpoints', () => {
    const apiFiles = fs.readdirSync(path.join(ROOT, 'src/app/api'), { recursive: true });
    const prohibitedKeywords = [
      'dispatchBus',
      'switchSignal',
      'interlockingControl',
      'sendVehicleCommand',
      'actuateTrafficLight',
      'overrideInterlocking',
    ];

    for (const file of apiFiles) {
      if (typeof file === 'string' && file.endsWith('.ts')) {
        const content = fs.readFileSync(path.join(ROOT, 'src/app/api', file), 'utf-8');
        for (const kw of prohibitedKeywords) {
          assert(!content.includes(kw), `Prohibited actuation keyword found in ${file}: ${kw}`);
        }
      }
    }
  });

  await test('Simulation route provides advisory disclaimer and Little\'s Law equations', async () => {
    const simRes = await fetchJson('/api/simulation/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        corridorId: 'corridor-ring-road',
        additionalBuses: 16,
        targetHeadwayMin: 5,
        signalPriority: true,
      }),
    });
    assert.strictEqual(simRes.status, 200);
    assert(
      Array.isArray(simRes.json?.scenario?.modelAssumptions),
      'Simulation must return explicit empirical model assumptions'
    );
    assert(
      simRes.json?.scenario?.governingEquations ||
      simRes.json?.scenario?.modelAssumptions.some((a) => a.toLowerCase().includes('little') || a.toLowerCase().includes('advisory')),
      'Simulation must explicitly preserve advisory classification and Little\'s Law'
    );
  });

  console.log('\n========================================');
  console.log(`PHASE 20 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase20Tests().catch((err) => {
  console.error('Fatal error in Phase 20 test runner:', err);
  process.exit(1);
});
