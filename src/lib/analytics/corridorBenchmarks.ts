import { DELHI_CORRIDORS } from '@/data/delhiTransitData';
import { getHistoricalStore } from '@/lib/storage/historicalStore';

export interface CorridorBenchmarkDossier {
  corridorId: string;
  corridorName: string;
  lengthKm: number;
  monitoredStopsCount: number;
  sampleWindowHours: number;
  vehicleMovementMetrics: {
    hourlyObservationsMean: number;
    speedDistributionKmph: {
      p10: number;
      median: number;
      p90: number;
      freeFlowSpeed: number;
    };
    medianTravelTimeMinutes: number;
    peakSpeedDropPct: number;
    observedHeadwayMin: {
      mean: number;
      stdDev: number;
      coefficientOfVariation: number; // Cv
    };
  };
  passengerMovementMetrics: {
    estimatedDailyBoardings: number;
    peakHourPaxPerHour: number;
    crowdingSeverity: 'OPTIMAL' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    derivationMethod: 'ETM_AGGREGATE_AND_STGNN_SURROGATE';
    caveat: string;
  };
  telemetryQuality: {
    missingObservationRatePct: number;
    sourceCoveragePct: number;
    dataFreshnessLagSeconds: number;
    primarySource: string;
    epistemologicalTier: 'Observed' | 'Estimated' | 'Predicted';
  };
}

export const CORRIDOR_BENCHMARK_DATA: CorridorBenchmarkDossier[] = [
  {
    corridorId: 'corridor-radial-south',
    corridorName: 'Aurobindo Marg / Janpath Central Axis',
    lengthKm: 14.2,
    monitoredStopsCount: 12,
    sampleWindowHours: 720, // 30-day baseline
    vehicleMovementMetrics: {
      hourlyObservationsMean: 24.8,
      speedDistributionKmph: {
        p10: 14.2,
        median: 22.4,
        p90: 31.0,
        freeFlowSpeed: 28.0,
      },
      medianTravelTimeMinutes: 38,
      peakSpeedDropPct: 36.6,
      observedHeadwayMin: {
        mean: 6.2,
        stdDev: 2.1,
        coefficientOfVariation: 0.34,
      },
    },
    passengerMovementMetrics: {
      estimatedDailyBoardings: 84000,
      peakHourPaxPerHour: 6200,
      crowdingSeverity: 'HIGH',
      derivationMethod: 'ETM_AGGREGATE_AND_STGNN_SURROGATE',
      caveat: 'Passenger metrics are derived from depot ETM ticket punch aggregates and ST-GNN models, NOT directly inferred from vehicle GPS pings alone.',
    },
    telemetryQuality: {
      missingObservationRatePct: 4.2,
      sourceCoveragePct: 95.8,
      dataFreshnessLagSeconds: 14,
      primarySource: 'DTC Schedule + DIMTS Speed Profile + ETM Punch',
      epistemologicalTier: 'Estimated',
    },
  },
  {
    corridorId: 'corridor-ring-road',
    corridorName: 'Mahatma Gandhi Ring Road Arterial',
    lengthKm: 22.0,
    monitoredStopsCount: 16,
    sampleWindowHours: 720,
    vehicleMovementMetrics: {
      hourlyObservationsMean: 38.4,
      speedDistributionKmph: {
        p10: 16.5,
        median: 26.8,
        p90: 38.2,
        freeFlowSpeed: 36.0,
      },
      medianTravelTimeMinutes: 49,
      peakSpeedDropPct: 38.5,
      observedHeadwayMin: {
        mean: 4.8,
        stdDev: 1.7,
        coefficientOfVariation: 0.35,
      },
    },
    passengerMovementMetrics: {
      estimatedDailyBoardings: 142000,
      peakHourPaxPerHour: 11400,
      crowdingSeverity: 'CRITICAL',
      derivationMethod: 'ETM_AGGREGATE_AND_STGNN_SURROGATE',
      caveat: 'High-density interchange transfers at AIIMS, Lajpat Nagar, and Dhaula Kuan model passenger flow independently from fleet GPS velocity.',
    },
    telemetryQuality: {
      missingObservationRatePct: 3.8,
      sourceCoveragePct: 96.2,
      dataFreshnessLagSeconds: 12,
      primarySource: 'DTC Fleet Telematics + OpenTransitData Static',
      epistemologicalTier: 'Estimated',
    },
  },
  {
    corridorId: 'corridor-heritage-spine',
    corridorName: 'Old Delhi / Yamuna Heritage Corridor (Kashmere Gate – Red Fort)',
    lengthKm: 9.8,
    monitoredStopsCount: 8,
    sampleWindowHours: 720,
    vehicleMovementMetrics: {
      hourlyObservationsMean: 18.2,
      speedDistributionKmph: {
        p10: 9.8,
        median: 14.8,
        p90: 22.5,
        freeFlowSpeed: 24.0,
      },
      medianTravelTimeMinutes: 40,
      peakSpeedDropPct: 44.2,
      observedHeadwayMin: {
        mean: 7.5,
        stdDev: 2.8,
        coefficientOfVariation: 0.37,
      },
    },
    passengerMovementMetrics: {
      estimatedDailyBoardings: 68000,
      peakHourPaxPerHour: 5100,
      crowdingSeverity: 'HIGH',
      derivationMethod: 'ETM_AGGREGATE_AND_STGNN_SURROGATE',
      caveat: 'Severe pedestrian and commercial vehicle friction in Chandni Chowk and Daryaganj reduces vehicle speed without proportionally reducing passenger trip demand.',
    },
    telemetryQuality: {
      missingObservationRatePct: 6.5,
      sourceCoveragePct: 93.5,
      dataFreshnessLagSeconds: 18,
      primarySource: 'DTC ETM Depot Batch + OSM Heritage Polyline',
      epistemologicalTier: 'Estimated',
    },
  },
  {
    corridorId: 'corridor-outer-ring',
    corridorName: 'Outer Ring Road / Dhaula Kuan Rapid Transit Axis',
    lengthKm: 28.5,
    monitoredStopsCount: 14,
    sampleWindowHours: 720,
    vehicleMovementMetrics: {
      hourlyObservationsMean: 31.0,
      speedDistributionKmph: {
        p10: 18.0,
        median: 32.5,
        p90: 44.0,
        freeFlowSpeed: 42.0,
      },
      medianTravelTimeMinutes: 53,
      peakSpeedDropPct: 31.8,
      observedHeadwayMin: {
        mean: 5.5,
        stdDev: 1.8,
        coefficientOfVariation: 0.33,
      },
    },
    passengerMovementMetrics: {
      estimatedDailyBoardings: 118000,
      peakHourPaxPerHour: 8900,
      crowdingSeverity: 'MODERATE',
      derivationMethod: 'ETM_AGGREGATE_AND_STGNN_SURROGATE',
      caveat: 'Grade-separated flyovers permit higher average bus velocities while interchange nodes exhibit localized dwell bunching.',
    },
    telemetryQuality: {
      missingObservationRatePct: 4.0,
      sourceCoveragePct: 96.0,
      dataFreshnessLagSeconds: 15,
      primarySource: 'DTC Express Network + Airport Express Sync',
      epistemologicalTier: 'Estimated',
    },
  },
];

export function getCorridorBenchmarkDossier(corridorId?: string): CorridorBenchmarkDossier[] {
  if (corridorId) {
    const found = CORRIDOR_BENCHMARK_DATA.find((c) => c.corridorId === corridorId);
    return found ? [found] : [];
  }
  return CORRIDOR_BENCHMARK_DATA;
}
