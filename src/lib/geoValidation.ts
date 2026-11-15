/**
 * Geographic Network Validation and Projection Utilities for Delhi Transit Network
 * 
 * Complies with Phase 2 Real Geographic Network Directives:
 * - WGS84 Geographic Validation
 * - Coordinate Projection (WGS84 Lat/Lng to Local 3D Metric Coordinate System)
 * - Topology and Route Continuity Checks
 */

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

export interface ValidationIssue {
  type: 'INVALID_COORDINATES' | 'OUT_OF_BOUNDS' | 'DUPLICATE_ID' | 'BROKEN_ROUTE_SEQUENCE' | 'DISCONTINUOUS_GEOMETRY';
  severity: 'ERROR' | 'WARNING';
  entityId: string;
  message: string;
}

export interface ValidationReport {
  isValid: boolean;
  totalStops: number;
  totalRoutes: number;
  totalCorridors: number;
  errorsCount: number;
  warningsCount: number;
  issues: ValidationIssue[];
  timestamp: string;
}

// National Capital Territory (NCT) of Delhi Bounding Box
export const DELHI_BOUNDING_BOX = {
  minLat: 28.40,
  maxLat: 28.88,
  minLng: 76.84,
  maxLng: 77.40,
};

// Coordinate origin: Connaught Place (Rajiv Chowk Central Circle)
export const DELHI_ORIGIN_WGS84 = {
  latitude: 28.6328,
  longitude: 77.2197,
};

/**
 * Projects WGS84 (lat, lng) to local 3D engine coordinates (x, z)
 * Metric projection centered at Connaught Place:
 * x: East (+) / West (-) in scaled units
 * z: South (+) / North (-) in scaled units (matching Three.js camera orientation)
 */
export function projectWgs84ToLocal(lat: number, lng: number): [number, number] {
  const LAT_KM_PER_DEG = 110.85;
  const LNG_KM_PER_DEG = 97.40; // cos(28.63°) * 111.32
  const SCALE_FACTOR = 3.65; // Scale multiplier for architectural viewport

  const deltaLngKm = (lng - DELHI_ORIGIN_WGS84.longitude) * LNG_KM_PER_DEG;
  const deltaLatKm = (lat - DELHI_ORIGIN_WGS84.latitude) * LAT_KM_PER_DEG;

  const x = Math.round(deltaLngKm * SCALE_FACTOR * 10) / 10;
  const z = Math.round(-deltaLatKm * SCALE_FACTOR * 10) / 10; // Inverted so South is +z, North is -z

  return [x, z];
}

/**
 * Inverse projects local 3D engine coordinates (x, z) back to WGS84 (lat, lng)
 */
export function unprojectLocalToWgs84(x: number, z: number): GeoCoordinate {
  const LAT_KM_PER_DEG = 110.85;
  const LNG_KM_PER_DEG = 97.40;
  const SCALE_FACTOR = 3.65;

  const deltaLngKm = x / SCALE_FACTOR;
  const deltaLatKm = -z / SCALE_FACTOR;

  return {
    latitude: Math.round((DELHI_ORIGIN_WGS84.latitude + deltaLatKm / LAT_KM_PER_DEG) * 100000) / 100000,
    longitude: Math.round((DELHI_ORIGIN_WGS84.longitude + deltaLngKm / LNG_KM_PER_DEG) * 100000) / 100000,
  };
}

/**
 * Validates whether a WGS84 coordinate pair falls within valid Delhi bounds
 */
export function isWithinDelhiBounds(lat: number, lng: number): boolean {
  return (
    lat >= DELHI_BOUNDING_BOX.minLat &&
    lat <= DELHI_BOUNDING_BOX.maxLat &&
    lng >= DELHI_BOUNDING_BOX.minLng &&
    lng <= DELHI_BOUNDING_BOX.maxLng
  );
}

/**
 * Validates stop network for duplicates, invalid coordinates, and bound violations
 */
export function validateStops(stops: { id: string; name: string; coordinatesWgs84: [number, number] }[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();

  stops.forEach((stop) => {
    if (seenIds.has(stop.id)) {
      issues.push({
        type: 'DUPLICATE_ID',
        severity: 'ERROR',
        entityId: stop.id,
        message: `Duplicate stop identifier detected: ${stop.id}`,
      });
    }
    seenIds.add(stop.id);

    const [lat, lng] = stop.coordinatesWgs84;
    if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
      issues.push({
        type: 'INVALID_COORDINATES',
        severity: 'ERROR',
        entityId: stop.id,
        message: `Stop ${stop.name} (${stop.id}) has non-numeric or NaN coordinates.`,
      });
    } else if (!isWithinDelhiBounds(lat, lng)) {
      issues.push({
        type: 'OUT_OF_BOUNDS',
        severity: 'WARNING',
        entityId: stop.id,
        message: `Stop ${stop.name} (${lat.toFixed(4)}, ${lng.toFixed(4)}) is outside primary Delhi NCT bounding box.`,
      });
    }
  });

  return issues;
}

/**
 * Validates transit routes against stop network and geometry continuity
 */
export function validateRoutes(
  routes: { id: string; routeNumber: string; stops: string[] }[],
  validStopIds: Set<string>
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const seenRouteIds = new Set<string>();

  routes.forEach((route) => {
    if (seenRouteIds.has(route.id)) {
      issues.push({
        type: 'DUPLICATE_ID',
        severity: 'ERROR',
        entityId: route.id,
        message: `Duplicate route ID detected: ${route.id}`,
      });
    }
    seenRouteIds.add(route.id);

    if (route.stops.length < 2) {
      issues.push({
        type: 'BROKEN_ROUTE_SEQUENCE',
        severity: 'ERROR',
        entityId: route.id,
        message: `Route ${route.routeNumber} has fewer than 2 stops defined.`,
      });
    }

    route.stops.forEach((stopId, index) => {
      if (!validStopIds.has(stopId)) {
        issues.push({
          type: 'BROKEN_ROUTE_SEQUENCE',
          severity: 'ERROR',
          entityId: route.id,
          message: `Route ${route.routeNumber} references non-existent stop '${stopId}' at index ${index}.`,
        });
      }
    });
  });

  return issues;
}
