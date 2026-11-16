/**
 * @file prediction.ts
 * @module types/prediction
 * @description Crowding prediction and ST-GNN inference response interfaces.
 */

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
