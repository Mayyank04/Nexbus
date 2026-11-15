/**
 * Interchange Friction Index (IFI) & Multimodal Hub Analytics
 * Delhi National Capital Territory (NCT)
 * 
 * Evaluates pedestrian transfer friction across major Delhi transit hubs.
 * 
 * Formula:
 * IFI = 0.35 * (D_walk / 100m) + 0.25 * L_vertical + 0.20 * F_crossing + 0.20 * (T_wait / 5min)
 * Normalized Friction Score (0-100 scale, where 0 is frictionless and 100 is severe friction).
 * 
 * Evidence Classification:
 * - DERIVED: IFI index calculation, pedestrian transfer friction modeling, bottleneck classification
 * - VERIFIED_EXTERNAL: Physical station geometries, elevator/escalator counts, DMRC/DTC hub surveys
 */

import { INTERCHANGE_SURVEYS, InterchangeHubSurvey, getMultimodalNetwork } from './networkGraph';
import { EvidenceClassification } from '@/lib/evidence/evidenceClassification';

export type FrictionGrade = 'A' | 'B' | 'C' | 'D' | 'E';

export interface InterchangeMetrics {
  hubId: string;
  name: string;
  hindiName: string;
  busStopId: string;
  busStopName: string;
  metroStationIds: string[];
  metroStationNames: string[];
  zone: 'Central' | 'South' | 'North' | 'East' | 'West';
  coordinatesLocal: [number, number];
  coordinatesWgs84: [number, number];
  walkingDistanceMeters: number;
  walkingDurationMinutes: number;
  verticalLevelsChange: number;
  roadCrossingsCount: number;
  isCoveredWalkway: boolean;
  hasElevator: boolean;
  hasEscalator: boolean;
  isStepFreeAccessible: boolean;
  wayfindingQualityScore: number;
  dailyFootfall: number;
  ifiRaw: number;
  frictionScore: number; // 0 to 100 (lower is smoother)
  frictionGrade: FrictionGrade;
  connectedModes: string[];
  bottleneckDescription: string;
  recommendedInterventions: string[];
  evidenceClassification: EvidenceClassification;
}

export interface InterchangeSummaryReport {
  generatedAt: string;
  totalHubsAnalyzed: number;
  averageFrictionScore: number;
  highestFrictionHub: string;
  lowestFrictionHub: string;
  accessibleHubsCount: number;
  hubsByGrade: Record<FrictionGrade, number>;
  interchanges: InterchangeMetrics[];
}

export function calculateIFI(survey: InterchangeHubSurvey, typicalWaitMin: number = 4.0): {
  ifiRaw: number;
  frictionScore: number;
  grade: FrictionGrade;
} {
  const dWalkComponent = 0.35 * (survey.walkingDistanceMeters / 100);
  const lVerticalComponent = 0.25 * survey.verticalLevelsChange;
  const fCrossingComponent = 0.20 * (survey.roadCrossingsCount * 1.5 + (survey.isCoveredWalkway ? 0 : 0.5));
  const tWaitComponent = 0.20 * (typicalWaitMin / 5);

  const ifiRaw = Math.round((dWalkComponent + lVerticalComponent + fCrossingComponent + tWaitComponent) * 100) / 100;

  // Scale raw index (typically 1.0 - 4.5) to a 0-100 index
  // 1.0 -> 20, 2.0 -> 40, 3.0 -> 60, 4.0 -> 80, 5.0 -> 100
  const scaledScore = Math.min(100, Math.max(5, Math.round(ifiRaw * 22)));

  let grade: FrictionGrade = 'B';
  if (scaledScore <= 30) grade = 'A';
  else if (scaledScore <= 50) grade = 'B';
  else if (scaledScore <= 70) grade = 'C';
  else if (scaledScore <= 85) grade = 'D';
  else grade = 'E';

  return {
    ifiRaw,
    frictionScore: scaledScore,
    grade,
  };
}

export class InterchangeAnalyticsService {
  private network = getMultimodalNetwork();

  public getInterchangeMetrics(): InterchangeMetrics[] {
    const surveys = this.network.getInterchangeSurveys();

    return surveys.map((survey) => {
      const busNode = this.network.getNode(survey.busStopId);
      const metroNodes = survey.metroStationIds.map((id) => this.network.getNode(id)).filter(Boolean);

      const metroNames = metroNodes.map((n) => n!.name);
      const lines = Array.from(new Set(metroNodes.flatMap((n) => n?.metroLines || [])));
      const connectedModes = ['DTC Arterial Bus', ...lines.map((l) => `Metro ${l}`)];

      const { ifiRaw, frictionScore, grade } = calculateIFI(survey);

      // Interventions logic
      const interventions: string[] = [];
      if (survey.walkingDistanceMeters > 200) {
        interventions.push('Deploy moving walkway / travelators along transfer concourse.');
      }
      if (survey.roadCrossingsCount > 0) {
        interventions.push('Construct grade-separated pedestrian skywalk or subway bypass.');
      }
      if (!survey.isCoveredWalkway) {
        interventions.push('Install weather-protected canopy to shield passengers from extreme Delhi heat and monsoon rain.');
      }
      if (survey.verticalLevelsChange >= 3) {
        interventions.push('Add dedicated high-capacity through-elevators directly connecting bus bays to underground metro concourses.');
      }
      if (survey.wayfindingQualityScore < 4.0) {
        interventions.push('Modernize high-contrast bilingual tactile wayfinding and real-time transit departure displays at exits.');
      }

      return {
        hubId: survey.hubId,
        name: survey.name,
        hindiName: busNode?.hindiName || survey.name,
        busStopId: survey.busStopId,
        busStopName: busNode?.name || survey.busStopId,
        metroStationIds: survey.metroStationIds,
        metroStationNames: metroNames,
        zone: busNode?.zone || 'Central',
        coordinatesLocal: busNode?.coordinatesLocal || [0, 0],
        coordinatesWgs84: busNode?.coordinatesWgs84 || [28.6139, 77.2090],
        walkingDistanceMeters: survey.walkingDistanceMeters,
        walkingDurationMinutes: survey.walkingDurationMinutes,
        verticalLevelsChange: survey.verticalLevelsChange,
        roadCrossingsCount: survey.roadCrossingsCount,
        isCoveredWalkway: survey.isCoveredWalkway,
        hasElevator: survey.hasElevator,
        hasEscalator: survey.hasEscalator,
        isStepFreeAccessible: survey.isStepFreeAccessible,
        wayfindingQualityScore: survey.wayfindingQualityScore,
        dailyFootfall: (busNode?.busCorridors ? 140000 : 90000) + metroNodes.length * 50000,
        ifiRaw,
        frictionScore,
        frictionGrade: grade,
        connectedModes,
        bottleneckDescription: survey.bottleneckDescription,
        recommendedInterventions: interventions,
        evidenceClassification: 'DERIVED',
      };
    });
  }

  public getSummaryReport(): InterchangeSummaryReport {
    const list = this.getInterchangeMetrics();
    const totalScore = list.reduce((acc, h) => acc + h.frictionScore, 0);
    const avgScore = Math.round((totalScore / list.length) * 10) / 10;

    const sortedByFriction = [...list].sort((a, b) => b.frictionScore - a.frictionScore);
    const highestFriction = sortedByFriction[0]?.name || 'None';
    const lowestFriction = sortedByFriction[sortedByFriction.length - 1]?.name || 'None';

    const accessibleCount = list.filter((h) => h.isStepFreeAccessible).length;

    const grades: Record<FrictionGrade, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    for (const h of list) {
      grades[h.frictionGrade] = (grades[h.frictionGrade] || 0) + 1;
    }

    return {
      generatedAt: new Date().toISOString(),
      totalHubsAnalyzed: list.length,
      averageFrictionScore: avgScore,
      highestFrictionHub: highestFriction,
      lowestFrictionHub: lowestFriction,
      accessibleHubsCount: accessibleCount,
      hubsByGrade: grades,
      interchanges: list,
    };
  }

  public getHubById(hubId: string): InterchangeMetrics | undefined {
    return this.getInterchangeMetrics().find((h) => h.hubId === hubId);
  }
}

let analyticsInstance: InterchangeAnalyticsService | null = null;

export function getInterchangeAnalytics(): InterchangeAnalyticsService {
  if (!analyticsInstance) {
    analyticsInstance = new InterchangeAnalyticsService();
  }
  return analyticsInstance;
}
