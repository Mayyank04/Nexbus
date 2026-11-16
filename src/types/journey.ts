/**
 * @file journey.ts
 * @module types/journey
 * @description Journey planning, itinerary segments, and routing criteria interfaces.
 */

export type RoutingCriterion = 'FASTEST' | 'BALANCED' | 'COMFORT FIRST';

export interface JourneyPlanSegment {
  type: 'walk' | 'bus' | 'transfer';
  title: string;
  detail: string;
  durationMin: number;
  corridorId?: string;
  fleetType?: string;
}

export interface JourneyPlanOption {
  id: string;
  type: RoutingCriterion;
  tag: string;
  routeName: string;
  routeCode: string;
  durationMin: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  crowding: 'Low' | 'Moderate' | 'High';
  crowdingScore: number;
  confidence: number;
  seatProbability: string;
  recommendationReason: string;
  segments: JourneyPlanSegment[];
}

export interface JourneyPlanQuery {
  originId: string;
  destinationId: string;
  date?: string;
  time?: string;
  preference?: RoutingCriterion;
  stepFree?: boolean;
}

export interface JourneyPlanResponse {
  success: boolean;
  query: {
    origin: string;
    originId: string;
    destination: string;
    destinationId: string;
    date: string;
    time: string;
    distanceKm: number;
  };
  plans: JourneyPlanOption[];
  metadata: {
    routingAlgorithm: string;
    paretoFrontier: string[];
    realTimeDisruptionFactored: boolean;
  };
}
