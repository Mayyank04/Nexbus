/**
 * @file constants.ts
 * @module config/constants
 * @description Immutable domain constants, geodetic boundaries, and epistemic tiers for NEXBUS Delhi.
 */

/**
 * National Capital Territory of Delhi Bounding Box (WGS 84 / EPSG:7761)
 */
export const DELHI_GEODETIC_BOUNDS = {
  MIN_LATITUDE: 28.40,
  MAX_LATITUDE: 28.90,
  MIN_LONGITUDE: 76.80,
  MAX_LONGITUDE: 77.45,
  CENTER: {
    lat: 28.6139,
    lng: 77.2090,
    elevationMeters: 216,
  },
  DATUM: 'EPSG:7761 / WGS 84',
} as const;

/**
 * Epistemic data classifications governing trust boundaries.
 */
export const EPISTEMIC_TIERS = {
  TIER_01: {
    code: 'TIER_01',
    label: 'Observed Telemetry',
    source: 'Hardware AVL Transponders & ETM Smartcards',
    confidenceLevel: 'Deterministic (Hardware)',
    epistemicBoundary: 'Direct measurement from physical sensors with timestamp and cryptographic hash.',
  },
  TIER_02: {
    code: 'TIER_02',
    label: 'Estimated Flow',
    source: 'Statistical Inference & OD Furness Balancing',
    confidenceLevel: 'High Statistical (Iterative Proportional Fitting)',
    epistemicBoundary: 'Algorithmic reconciliation of trip chaining and passenger boarding/alighting.',
  },
  TIER_03: {
    code: 'TIER_03',
    label: 'Predicted Demand',
    source: 'Spatio-Temporal GNN Surrogate',
    confidenceLevel: 'Probabilistic (95% Bayesian Credible Intervals)',
    epistemicBoundary: 'Neural network graph surrogate with epistemic uncertainty estimation.',
  },
  TIER_04: {
    code: 'TIER_04',
    label: 'Counterfactual Simulation',
    source: 'Micro-Simulation & Policy Interventions',
    confidenceLevel: 'Hypothetical (Synthetic Scenario)',
    epistemicBoundary: 'Mathematical projection under simulated headway and fleet policy changes.',
  },
} as const;

/**
 * Priority Arterial Corridors in Delhi
 */
export const ARTERIAL_CORRIDORS = [
  { id: 'ring-road', name: 'Inner Ring Road', code: 'IRR', lengthKm: 51.0 },
  { id: 'outer-ring-road', name: 'Outer Ring Road', code: 'ORR', lengthKm: 47.0 },
  { id: 'aurobindo-marg', name: 'Sri Aurobindo Marg', code: 'SAM', lengthKm: 14.5 },
  { id: 'mathura-road', name: 'Mathura Road Corridor', code: 'MRC', lengthKm: 18.2 },
] as const;

/**
 * Simulation Bounds & Defaults
 */
export const SIMULATION_CONSTRAINTS = {
  MIN_HEADWAY_MINUTES: 2,
  MAX_HEADWAY_MINUTES: 30,
  DEFAULT_HEADWAY_MINUTES: 8,
  MIN_ADDITIONAL_BUSES: 0,
  MAX_ADDITIONAL_BUSES: 100,
  DEFAULT_ADDITIONAL_BUSES: 20,
  BUS_CAPACITY_PAX: 65,
  AVERAGE_SPEED_KMH: 18.5,
  CO2_FACTOR_KG_PER_KM: 0.85,
  NOX_FACTOR_G_PER_KM: 1.25,
} as const;
