/**
 * NEXBUS DETERMINISTIC FORMATTING UTILITY
 * 
 * Guarantees 100% identical outputs between Server-Side Rendering (Node.js)
 * and Client-Side Hydration (Safari, Chrome, Firefox) across all OS locales.
 * 
 * Eliminates React Hydration mismatches caused by unconfigured `toLocaleString()`
 * calls diverging between `en-US` server defaults and user browser locales (e.g. `en-IN`).
 */

/**
 * Deterministic international number formatting (thousands grouping: 3-3-3).
 * e.g., 642000 -> "642,000"
 */
export function formatNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-US', options).format(value);
}

/**
 * Deterministic Indian number formatting (lakhs & crores grouping: 3-2-2).
 * e.g., 642000 -> "6,42,000"
 */
export function formatIndianNumber(
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0';
  }
  return new Intl.NumberFormat('en-IN', options).format(value);
}

/**
 * Format passenger volume deterministically with unit.
 * e.g., 642000 -> "642,000 PAX"
 */
export function formatPax(
  value: number | null | undefined,
  unit: string = 'PAX'
): string {
  return `${formatNumber(value)} ${unit}`.trim();
}

/**
 * Format percentages deterministically.
 * e.g., 87.45 -> "87%" or "87.5%"
 */
export function formatPercent(
  value: number | null | undefined,
  decimals: number = 0
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '0%';
  }
  return `${value.toFixed(decimals)}%`;
}

/**
 * Deterministic UTC date string to prevent server/client timezone drift.
 * e.g., "2026-11-18T10:00:00Z" -> "Nov 18, 2026"
 */
export function formatDateUtc(
  dateInput: string | Date | number | null | undefined
): string {
  if (!dateInput) return 'N/A';
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  } catch {
    return 'N/A';
  }
}

/**
 * Deterministic UTC date and time string.
 * e.g., "Nov 18, 2026, 10:00 UTC"
 */
export function formatDateTimeUtc(
  dateInput: string | Date | number | null | undefined
): string {
  if (!dateInput) return 'N/A';
  try {
    const d = new Date(dateInput);
    if (Number.isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d) + ' UTC';
  } catch {
    return 'N/A';
  }
}

/**
 * Format INR currency values deterministically.
 * e.g., 450 -> "₹450 Cr"
 */
export function formatCurrencyInr(
  value: number | null | undefined,
  unit: string = 'Cr'
): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return `₹0 ${unit}`;
  }
  return `₹${formatNumber(value)} ${unit}`.trim();
}
