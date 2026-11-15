// Typed API Integration Layer for NEXBUS

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CrowdingPredictionResponse {
  success: boolean;
  corridorId: string;
  corridorName: string;
  targetHour: string;
  date: string;
  prediction: {
    loadPercentage: number;
    severity: 'low' | 'moderate' | 'high' | 'critical';
    confidenceScore: number;
    predictedPassengersPerHour: number;
    bounds: {
      ci80: [number, number];
      ci95: [number, number];
    };
    historicalBaseline: {
      meanLoadPercentage: number;
      variancePercentagePoints: number;
    };
  };
  inferenceDetails: {
    modelArchitecture: string;
    leadTimeMinutes: number;
    sensorInputsCount: number;
    trainingSamples: string;
  };
}

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
  type: 'FASTEST' | 'BALANCED' | 'COMFORT FIRST';
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

export interface SimulationResultResponse {
  success: boolean;
  scenario: {
    corridorId: string;
    corridorName: string;
    interventions: {
      additionalElectricBuses: number;
      targetHeadwayMinutes: number;
      transitSignalPriorityEnabled: boolean;
      timeWindow: string;
    };
    baseline: {
      headwayMinutes: number;
      averageWaitTimeMinutes: number;
      passengerOccupancyFactor: number;
      passengerLoadPercentage: number;
      unallocatedDemandPaxPerHour: number;
      hourlyCapacityPax: number;
    };
    simulated: {
      headwayMinutes: number;
      averageWaitTimeMinutes: number;
      passengerOccupancyFactor: number;
      passengerLoadPercentage: number;
      unallocatedDemandPaxPerHour: number;
      hourlyCapacityPax: number;
    };
    deltas: {
      waitTimeDeltaPct: number;
      crowdingReliefPoints: number;
      unallocatedDemandReductionPct: number;
      capacityIncreasePaxPerHour: number;
    };
    environmentalImpact: {
      monthlyCo2OffsetTons: number;
      monthlyNoxOffsetKg: number;
      dieselCngReplacedKmDaily: number;
    };
    affectedCorridors: {
      name: string;
      spilloverReliefPct: number;
    }[];
    governingEquations?: string[];
    sensitivityAnalysis?: {
      byElasticity: {
        elasticity: number;
        projectedInducedDemandPct: number;
        projectedOccupancyFactor: number;
        projectedOccupancyPercentage: number;
      }[];
      byFleetAvailability: {
        depotAvailabilityRate: number;
        activeBusesCount: number;
        addedCapacityPaxPerHour: number;
        monthlyCo2OffsetTons: number;
      }[];
    };
    modelAssumptions: string[];
    uncertaintyBoundPct: number;
  };
}

// Client API Helper functions
export async function fetchCrowdingPrediction(
  corridorId: string,
  hour: number,
  signal?: AbortSignal
): Promise<CrowdingPredictionResponse | null> {
  try {
    const res = await fetch(`/api/prediction/crowding?corridorId=${corridorId}&hour=${hour}`, {
      signal,
    });
    if (!res.ok) throw new Error('Crowding API request failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching prediction:', err);
    return null;
  }
}

export async function computeJourneyPlans(
  originId: string,
  destinationId: string,
  date?: string,
  time?: string,
  signal?: AbortSignal
): Promise<JourneyPlanResponse | null> {
  try {
    const res = await fetch('/api/journey/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originId, destinationId, date, time }),
      signal,
    });
    if (!res.ok) throw new Error('Journey Plan API request failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error calculating journey plans:', err);
    return null;
  }
}

export async function runSimulationEvaluation(
  corridorId: string,
  additionalBuses: number,
  targetHeadwayMin: number,
  signalPriority: boolean,
  signal?: AbortSignal
): Promise<SimulationResultResponse | null> {
  try {
    const res = await fetch('/api/simulation/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        corridorId,
        additionalBuses,
        targetHeadwayMin,
        signalPriority,
      }),
      signal,
    });
    if (!res.ok) throw new Error('Simulation API request failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error running simulation:', err);
    return null;
  }
}

export async function fetchMultimodalJourneyPlans(
  origin: string,
  destination: string,
  preference?: string,
  stepFree?: boolean,
  signal?: AbortSignal
) {
  try {
    const params = new URLSearchParams({ origin, destination });
    if (preference) params.set('preference', preference);
    if (stepFree !== undefined) params.set('stepFree', String(stepFree));
    const res = await fetch(`/api/multimodal/plan?${params.toString()}`, { signal });
    if (!res.ok) throw new Error('Multimodal plan API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching multimodal plans:', err);
    return null;
  }
}

export async function fetchInterchangeHubs(hubId?: string, signal?: AbortSignal) {
  try {
    const url = hubId ? `/api/multimodal/interchanges?hubId=${hubId}` : '/api/multimodal/interchanges';
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Interchanges API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching interchange hubs:', err);
    return null;
  }
}

export async function fetchNetworkResilience(scenarioId?: string, signal?: AbortSignal) {
  try {
    const url = scenarioId ? `/api/multimodal/resilience?scenarioId=${scenarioId}` : '/api/multimodal/resilience';
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Resilience API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching resilience:', err);
    return null;
  }
}

export async function fetchAccessibilityReport(lat?: number, lng?: number, signal?: AbortSignal) {
  try {
    const url = lat !== undefined && lng !== undefined
      ? `/api/multimodal/accessibility?lat=${lat}&lng=${lng}`
      : '/api/multimodal/accessibility';
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Accessibility API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching accessibility report:', err);
    return null;
  }
}

export async function fetchCorridorDemand(
  corridorId?: string,
  dayType?: 'weekday' | 'weekend',
  synthetic?: boolean,
  signal?: AbortSignal
) {
  try {
    const params = new URLSearchParams();
    if (corridorId) params.set('corridorId', corridorId);
    if (dayType) params.set('dayType', dayType);
    if (synthetic) params.set('synthetic', 'true');
    const url = `/api/demand/corridor-demand?${params.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Demand API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching corridor demand:', err);
    return null;
  }
}

export async function fetchInterchangeCongestion(
  hubId?: string,
  timePeriod?: string,
  signal?: AbortSignal
) {
  try {
    const params = new URLSearchParams();
    if (hubId) params.set('hubId', hubId);
    if (timePeriod) params.set('timePeriod', timePeriod);
    const url = `/api/multimodal/interchanges/congestion?${params.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Congestion API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching interchange congestion:', err);
    return null;
  }
}

export async function fetchModelExplainability(
  corridorId?: string,
  horizon?: number,
  isPeak?: boolean,
  signal?: AbortSignal
) {
  try {
    const params = new URLSearchParams();
    if (corridorId) params.set('corridorId', corridorId);
    if (horizon) params.set('horizon', String(horizon));
    if (isPeak !== undefined) params.set('isPeak', String(isPeak));
    const url = `/api/ml/explainability?${params.toString()}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('Explainability API failed');
    return await res.json();
  } catch (err) {
    if ((err as Error).name === 'AbortError') return null;
    console.error('Error fetching model explainability:', err);
    return null;
  }
}


