/**
 * @file transit.ts
 * @module types/transit
 * @description Domain models for stops, routes, corridors, and telemetry.
 */

export interface TransitStop {
  id: string;
  name: string;
  code: string;
  coordinates: [number, number]; // [lat, lng] or [x, z] local projection
  type: 'terminal' | 'interchange' | 'stop' | 'depot';
  routes: string[];
  zone?: string;
  isWheelchairAccessible?: boolean;
}

export interface TransitRoute {
  id: string;
  routeNumber: string;
  name: string;
  corridorId: string;
  origin: string;
  destination: string;
  type: string;
  color?: string;
  frequencyMinutes: number;
  stopsCount: number;
  stops: string[];
}

export interface Corridor {
  id: string;
  name: string;
  color: string;
  lengthKm: number;
  dailyRidership: number;
  activeFleet: number;
  averageSpeedKmH: number;
  status: 'normal' | 'congested' | 'delayed' | 'optimal';
  stopsCount: number;
  routes: string[];
}

export interface LiveVehicleTelemetry {
  vehicleId: string;
  routeId: string;
  corridorId: string;
  latitude: number;
  longitude: number;
  speedKmH: number;
  headingDegrees: number;
  passengerLoadPct: number;
  lastUpdated: string;
  epistemicTier: 'TIER_01';
}
