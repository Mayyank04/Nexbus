/**
 * @file simulation.ts
 * @module types/simulation
 * @description Counterfactual simulation, intervention parameters, and scenario planning interfaces.
 */

export interface SimulationIntervention {
  corridorId: string;
  additionalBuses: number;
  targetHeadwayMin: number;
  signalPriority: boolean;
  fareSubsidyPct?: number;
  timeWindow?: string;
}

export interface SimulationMetricSnapshot {
  headwayMinutes: number;
  averageWaitTimeMinutes: number;
  passengerOccupancyFactor: number;
  passengerLoadPercentage: number;
  unallocatedDemandPaxPerHour: number;
  hourlyCapacityPax: number;
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
    baseline: SimulationMetricSnapshot;
    simulated: SimulationMetricSnapshot;
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
