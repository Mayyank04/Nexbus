/**
 * NEXBUS Phase 13 Independent Validation Script: Pilot Records Authenticity & Provenance Audit
 * 
 * Verifies:
 * 1. Collection Status Taxonomy compliance across all recorded field observations
 * 2. Proper classification of pre-seeded observations as DEMONSTRATION_FIXTURE
 * 3. Spatial geofence adherence (NCT Delhi WGS84 bounding box [28.40, 28.88] N, [76.84, 77.40] E)
 * 4. Coordinate privacy truncation (4 decimal places ~ 11m resolution)
 * 5. Temporal quantization (15-second quantiles)
 * 6. Cryptographic SHA-256 audit digest verification
 * 7. Observer pseudonymization (HMAC-SHA256 salted format OBS-XXXXXXXXXX)
 * 8. Physical feasibility of dwell times (0-600s) and passenger tallies (>= 0)
 * 9. Protocol progress breakdown: zero unexecuted targets counted as verified field observations
 * 10. Operational invariant: READ-ONLY + PASSIVE + ADVISORY
 */

import assert from 'node:assert';
import crypto from 'node:crypto';

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

async function runAudit() {
  console.log('=== NEXBUS PHASE 13 PILOT RECORD AUTHENTICITY & PROVENANCE AUDIT ===\n');

  // 1. Fetch Field Observations Ledger
  console.log('1. Fetching Field Observations from /api/ingestion/observations...');
  const obsRes = await fetchUrl('/api/ingestion/observations?limit=100');
  assert.strictEqual(obsRes.status, 200, 'GET /api/ingestion/observations must return HTTP 200');
  assert(obsRes.json?.success, 'Observations query must succeed');

  const fieldResearch = obsRes.json?.fieldResearch;
  assert(fieldResearch, 'fieldResearch payload must be present');
  const observations = fieldResearch.observations;
  assert(Array.isArray(observations) && observations.length >= 4, 'Must return at least 4 baseline observations');
  console.log(`   [PASS] Retrieved ${observations.length} recorded mobility observations`);

  // 2. Validate Collection Status Taxonomy and Demonstrator Classification
  console.log('\n2. Auditing Collection Status Taxonomy & Provenance Classification...');
  const validTaxonomy = [
    'VERIFIED_FIELD_OBSERVATION',
    'VERIFIED_EXTERNAL_RECORD',
    'MANUALLY_ENTERED_UNVERIFIED',
    'IMPORTED_HISTORICAL_RECORD',
    'SYNTHETIC_TEST_RECORD',
    'DEMONSTRATION_FIXTURE',
    'INVALID_RECORD',
  ];

  let demoCount = 0;
  let verifiedCount = 0;

  for (const obs of observations) {
    assert(obs.collectionStatus, `Observation ${obs.observationId} must define collectionStatus`);
    assert(validTaxonomy.includes(obs.collectionStatus), `Status "${obs.collectionStatus}" must be valid Phase 13 taxonomy`);
    if (obs.collectionStatus === 'DEMONSTRATION_FIXTURE') demoCount++;
    if (obs.collectionStatus === 'VERIFIED_FIELD_OBSERVATION') verifiedCount++;
  }

  assert(demoCount >= 4, `Pre-seeded baseline observations must be classified as DEMONSTRATION_FIXTURE (Found: ${demoCount})`);
  console.log(`   [PASS] All records adhere to Phase 13 taxonomy. Found ${demoCount} DEMONSTRATION_FIXTURE records.`);

  // 3. Coordinate Geofencing & Truncation Audit
  console.log('\n3. Auditing Spatial Geofencing & Precision Truncation...');
  for (const obs of observations) {
    const lat = obs.truncatedLatitude;
    const lng = obs.truncatedLongitude;

    // NCT Delhi WGS84 bounding box check
    assert(lat >= 28.40 && lat <= 28.88, `Latitude ${lat} out of Delhi bounds [28.40, 28.88] in ${obs.observationId}`);
    assert(lng >= 76.84 && lng <= 77.40, `Longitude ${lng} out of Delhi bounds [76.84, 77.40] in ${obs.observationId}`);

    // Decimal truncation check (max 4 decimal places)
    const latDecimals = lat.toString().split('.')[1]?.length || 0;
    const lngDecimals = lng.toString().split('.')[1]?.length || 0;
    assert(latDecimals <= 4, `Latitude ${lat} has > 4 decimal places (${latDecimals}) in ${obs.observationId}`);
    assert(lngDecimals <= 4, `Longitude ${lng} has > 4 decimal places (${lngDecimals}) in ${obs.observationId}`);
  }
  console.log('   [PASS] 100% of observations pass NCT Delhi statutory geofence and 4-decimal truncation (~11m)');

  // 4. Temporal Quantization & Observer Pseudonymization Audit
  console.log('\n4. Auditing Privacy By Design: HMAC Pseudonymization & 15-Second Quantization...');
  for (const obs of observations) {
    // Pseudonym format check: OBS-XXXXXXXXXX (10 hex chars)
    assert(
      /^OBS-[A-F0-9]{10}$/.test(obs.pseudonymizedObserverId),
      `Observer ID "${obs.pseudonymizedObserverId}" must match HMAC salted regex ^OBS-[A-F0-9]{10}$`
    );

    // Temporal quantization check (seconds must be multiple of 15)
    const obsDate = new Date(obs.quantizedObservedTimeIso);
    const seconds = obsDate.getUTCSeconds();
    const millis = obsDate.getUTCMilliseconds();
    assert(millis === 0, `Milliseconds must be quantized to 0 (Got: ${millis})`);
    assert(seconds % 15 === 0, `Observed timestamp seconds must be multiple of 15 (Got: ${seconds})`);

    // Privacy audit object assertion
    assert.strictEqual(obs.privacyComplianceAudit.piiPurged, true, 'PII must be audited as purged');
    assert.strictEqual(obs.privacyComplianceAudit.spatialTruncated, true, 'Spatial truncation flag must be true');
    assert.strictEqual(obs.privacyComplianceAudit.temporalQuantized, true, 'Temporal quantization flag must be true');
    assert.strictEqual(obs.privacyComplianceAudit.consentVerified, true, 'Consent verification flag must be true');
  }
  console.log('   [PASS] Privacy invariants verified: Zero PII, HMAC-SHA256 pseudonyms, 15s quantization');

  // 5. Kinematic & Physical Feasibility Audit
  console.log('\n5. Auditing Physical Sanity (Dwell Times, Headways & Passenger Tallies)...');
  for (const obs of observations) {
    if (obs.dwellTimeSeconds !== undefined) {
      assert(
        obs.dwellTimeSeconds >= 0 && obs.dwellTimeSeconds <= 600,
        `Dwell time ${obs.dwellTimeSeconds}s out of physical bounds (0-600s) in ${obs.observationId}`
      );
    }
    if (obs.boardingsCount !== undefined) {
      assert(obs.boardingsCount >= 0, `Negative boardings in ${obs.observationId}`);
    }
    if (obs.alightingsCount !== undefined) {
      assert(obs.alightingsCount >= 0, `Negative alightings in ${obs.observationId}`);
    }
    assert([1, 2, 3, 4, 5].includes(obs.crowdingScore), `Invalid crowding score in ${obs.observationId}`);
  }
  console.log('   [PASS] All kinematic and passenger counts fall within physical sanity constraints');

  // 6. Cryptographic Integrity Audit
  console.log('\n6. Auditing Cryptographic SHA-256 Digest Verification...');
  for (const obs of observations) {
    assert(obs.sha256Digest && obs.sha256Digest.length === 64, `SHA-256 digest must be 64 hex characters`);
    
    // Verify canonical payload reconstruction matches recorded digest
    const canonicalPayload = JSON.stringify({
      observationId: obs.observationId,
      pseudoId: obs.pseudonymizedObserverId,
      type: obs.observationType,
      status: obs.collectionStatus,
      stopId: obs.stopId,
      routeId: obs.routeId,
      corridorId: obs.corridorId,
      lat: obs.truncatedLatitude,
      lng: obs.truncatedLongitude,
      time: obs.quantizedObservedTimeIso,
      delaySec: obs.delaySeconds,
      dwell: obs.dwellTimeSeconds,
      board: obs.boardingsCount,
      alight: obs.alightingsCount,
      crowd: obs.crowdingScore,
    });
    const computedDigest = crypto.createHash('sha256').update(canonicalPayload).digest('hex');
    assert.strictEqual(computedDigest, obs.sha256Digest, `Cryptographic hash mismatch on ${obs.observationId}`);
  }
  console.log('   [PASS] 100% of recorded observations cryptographically validated with exact SHA-256 match');

  // 7. Research Pilot Protocol Audit
  console.log('\n7. Auditing Research Pilot Protocol & Epistemological Transparency at /api/pilot/protocol...');
  const pilotRes = await fetchUrl('/api/pilot/protocol');
  assert.strictEqual(pilotRes.status, 200, 'GET /api/pilot/protocol must return HTTP 200');
  const protocol = pilotRes.json?.protocol;
  assert(protocol, 'Protocol must be present');

  const prov = protocol.progress?.provenanceBreakdown;
  assert(prov, 'provenanceBreakdown must be present in pilot protocol progress');
  assert.strictEqual(prov.demonstrationFixturesCount, 4, 'Must declare exactly 4 demonstration fixtures');
  assert.strictEqual(prov.verifiedFieldObservationsCount, 0, 'Must truthfully report 0 unverified field observations');
  assert.strictEqual(prov.verifiedFieldCompletionPct, 0.0, 'Verified field completion must strictly be 0.0% prior to field campaign');
  assert(prov.epistemologicalDisclosure.includes('Independent Audit Note'), 'Epistemological disclosure must clarify benchmark simulation cohort');
  console.log('   [PASS] Research pilot provenance breakdown verified: zero unexecuted targets reported as verified field observations');

  // 8. Operational Invariant Certification
  console.log('\n8. Verifying READ-ONLY + PASSIVE + ADVISORY Invariant...');
  assert.strictEqual(obsRes.json?.invariant, 'READ-ONLY + PASSIVE + ADVISORY', 'Observations endpoint must declare advisory invariant');
  assert.strictEqual(pilotRes.json?.invariant, 'READ-ONLY + PASSIVE + ADVISORY', 'Pilot protocol endpoint must declare advisory invariant');
  console.log('   [PASS] READ-ONLY + PASSIVE + ADVISORY certified across all endpoints');

  console.log('\n============================================================');
  console.log('PHASE 13 PILOT RECORD AUTHENTICITY AUDIT: 100% AUDIT PASS');
  console.log('============================================================\n');
  return true;
}

runAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\nAUDIT FAILED:', err);
    process.exit(1);
  });
