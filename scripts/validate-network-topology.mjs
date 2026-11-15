/**
 * NEXBUS Independent Validation Script: Multimodal Network Topology & Coverage
 * 
 * Verifies:
 * 1. Network scope disclosure: Curated Arterial Multimodal Backbone Sample
 * 2. 67 nodes, 226 edges, 15 interchange hubs
 * 3. 0 isolated nodes, 0 unreachable nodes, 0 duplicate nodes, 0 duplicate edges
 * 4. Single connected component (strongly connected graph)
 * 5. Network diameter = 8 hops, average shortest path = 3.92 hops
 * 6. 100% WGS84 coordinate boundary compliance
 */

import assert from 'node:assert';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

async function testNetworkTopology() {
  console.log('=== NEXBUS INDEPENDENT MULTIMODAL NETWORK TOPOLOGY HARNESS ===\n');

  console.log(`1. Fetching Network Resilience & Graph Validation from ${BASE_URL}/api/multimodal/resilience...`);
  const res = await fetch(`${BASE_URL}/api/multimodal/resilience`);
  assert.strictEqual(res.status, 200, 'Resilience API must return HTTP 200');

  const data = await res.json();
  const val = data.graphValidation;
  assert(val, 'graphValidation must be present in response');

  // Verification 1: Network Scope & Disclosure
  assert.strictEqual(val.networkScope, 'DELHI_ARTERIAL_MULTIMODAL_BACKBONE_SAMPLE', 'Network scope must disclose curated sample');
  assert(val.coverageDisclosure && val.coverageDisclosure.includes('NOT the complete'), 'Coverage disclosure must clarify sample vs complete city');
  console.log(`   [PASS] Scope disclosure verified: "${val.networkScope}"`);

  // Verification 2: Node and Edge Counts
  assert.strictEqual(val.totalNodes, 67, 'Total nodes must equal 67');
  assert.strictEqual(val.totalEdges, 226, 'Total edges must equal 226');
  assert.strictEqual(val.metroStationsCount, 40, 'Metro stations must equal 40');
  assert.strictEqual(val.busStopsCount, 23, 'Bus stops must equal 23');
  assert.strictEqual(val.railwayStationsCount, 4, 'Railway terminals must equal 4');
  assert.strictEqual(val.interchangeHubsCount, 15, 'Interchange hubs must equal 15');
  console.log(`   [PASS] Inventory verified: 67 nodes (40 Metro, 23 Bus, 4 Rail), 226 edges, 15 interchange hubs`);

  // Verification 3: Topological Invariants
  assert.strictEqual(val.isValid, true, 'Graph validation must return isValid: true');
  assert.strictEqual(val.isolatedNodes.length, 0, 'Must have 0 isolated nodes');
  assert.strictEqual(val.unreachableNodes.length, 0, 'Must have 0 unreachable nodes');
  assert.strictEqual(val.duplicateNodes.length, 0, 'Must have 0 duplicate nodes');
  assert.strictEqual(val.duplicateEdges.length, 0, 'Must have 0 duplicate edges');
  assert.strictEqual(val.connectedComponentsCount, 1, 'Must form a single connected component');
  console.log('   [PASS] Graph invariants verified: 0 isolated, 0 unreachable, 0 duplicates, 1 connected component');

  // Verification 4: Small-World Metrics (Diameter & Path Length)
  assert.strictEqual(val.diameterHops, 8, 'Network diameter must be exactly 8 hops');
  assert(val.averagePathLengthHops >= 3.5 && val.averagePathLengthHops <= 4.5, `Average path length must be ~3.92 (Got: ${val.averagePathLengthHops})`);
  console.log(`   [PASS] Topological diameter verified: ${val.diameterHops} hops, average path length: ${val.averagePathLengthHops} hops`);

  // Verification 5: Geodetic Coordinate Bounds Compliance
  assert.strictEqual(val.coordinateErrors.length, 0, 'Must have 0 coordinate out-of-bound errors');
  console.log('   [PASS] Geodetic coordinates verified: 100% of nodes strictly within NCT / NCR boundary');

  console.log('\nMULTIMODAL NETWORK TOPOLOGY AUDIT SUMMARY: ALL 5 ASSERTIONS PASSED.\n');
}

testNetworkTopology().catch((err) => {
  console.error('\nMULTIMODAL NETWORK TOPOLOGY AUDIT FAILED:', err);
  process.exit(1);
});
