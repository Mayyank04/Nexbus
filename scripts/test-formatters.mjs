/**
 * NEXBUS DETERMINISTIC FORMATTER REGRESSION TEST SUITE
 * Validates deterministic output across Indian and international numbering formats
 * and guarantees zero server/client hydration divergences.
 */

import assert from 'node:assert';
import {
  formatNumber,
  formatIndianNumber,
  formatPax,
  formatPercent,
  formatDateUtc,
  formatDateTimeUtc,
  formatCurrencyInr
} from '../src/lib/utils/formatters.ts';

console.log('=== TESTING NEXBUS DETERMINISTIC FORMATTING UTILITIES ===\n');

// 1. Core hydration mismatch reproduction & fix test
console.log('--- 1. Testing Core Hydration Mismatch Fix (642,000 vs 6,42,000) ---');
const testVal = 642000;
const intlFormatted = formatNumber(testVal);
const indianFormatted = formatIndianNumber(testVal);

console.log(`Input: ${testVal}`);
console.log(`International (formatNumber): "${intlFormatted}"`);
console.log(`Indian (formatIndianNumber): "${indianFormatted}"`);

assert.strictEqual(intlFormatted, '642,000', 'formatNumber must strictly produce "642,000"');
assert.strictEqual(indianFormatted, '6,42,000', 'formatIndianNumber must strictly produce "6,42,000"');
console.log('[PASS] formatNumber and formatIndianNumber produce deterministic strings\n');

// 2. formatPax test
console.log('--- 2. Testing formatPax ---');
assert.strictEqual(formatPax(642000), '642,000 PAX');
assert.strictEqual(formatPax(642000, 'pax/hr'), '642,000 pax/hr');
assert.strictEqual(formatPax(0), '0 PAX');
assert.strictEqual(formatPax(null), '0 PAX');
assert.strictEqual(formatPax(undefined), '0 PAX');
console.log('[PASS] formatPax handles valid and edge values correctly\n');

// 3. formatPercent test
console.log('--- 3. Testing formatPercent ---');
assert.strictEqual(formatPercent(87), '87%');
assert.strictEqual(formatPercent(87.456, 1), '87.5%');
assert.strictEqual(formatPercent(0), '0%');
assert.strictEqual(formatPercent(null), '0%');
console.log('[PASS] formatPercent handles decimals and falsy values\n');

// 4. Deterministic Date / Time Tests
console.log('--- 4. Testing Date / Time UTC Determinism ---');
const testIso = '2026-11-18T10:30:00.000Z';
const dateStr = formatDateUtc(testIso);
const dateTimeStr = formatDateTimeUtc(testIso);

console.log(`ISO Date: ${testIso}`);
console.log(`formatDateUtc: "${dateStr}"`);
console.log(`formatDateTimeUtc: "${dateTimeStr}"`);

assert.strictEqual(dateStr, 'Nov 18, 2026', 'formatDateUtc must be deterministic Nov 18, 2026');
assert.strictEqual(dateTimeStr, 'Nov 18, 2026, 10:30 UTC', 'formatDateTimeUtc must enforce UTC hours');
assert.strictEqual(formatDateUtc(null), 'N/A');
assert.strictEqual(formatDateUtc('invalid-date'), 'N/A');
console.log('[PASS] Date and DateTime formatters enforce UTC determinism\n');

// 5. Currency format test
console.log('--- 5. Testing Currency Formatting ---');
assert.strictEqual(formatCurrencyInr(450), '₹450 Cr');
assert.strictEqual(formatCurrencyInr(1250, 'Lakh'), '₹1,250 Lakh');
assert.strictEqual(formatCurrencyInr(null), '₹0 Cr');
console.log('[PASS] Currency formatting is deterministic\n');

console.log('========================================');
console.log('ALL FORMATTER TESTS PASSED DETERMINISTICALLY');
console.log('========================================\n');
