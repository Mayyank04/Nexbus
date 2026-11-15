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
