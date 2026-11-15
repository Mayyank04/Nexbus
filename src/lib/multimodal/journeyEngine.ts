/**
 * Multimodal Journey Intelligence Engine
 * Computes multi-criteria Pareto-optimal routes across Bus, Metro, and Walking infrastructure.
 * 
 * Implements Generalized Urban Travel Cost:
 * C = T_in_vehicle + w_wait * T_wait + w_walk * T_walk + P_transfer + P_reliability
 * 
 * Evidence Classification:
 * - DERIVED: Journey path computation, generalized cost scoring, carbon savings
 * - VERIFIED_EXTERNAL: Underlying network graph constraints & metro timetables
 */

import {
  MultimodalNetworkGraph,
  MultimodalNode,
  MultimodalEdge,
  getMultimodalNetwork,
} from './networkGraph';
import { EvidenceClassification } from '@/lib/evidence/evidenceClassification';

export type JourneyPreference = 'FASTEST' | 'LEAST_TRANSFERS' | 'BUS_ONLY';

export interface JourneyLeg {
  id: string;
  mode: 'BUS' | 'METRO' | 'TRANSFER' | 'WALK';
  originId: string;
  originName: string;
  destinationId: string;
  destinationName: string;
  lineOrRoute: string;
  durationMinutes: number;
  distanceKm: number;
  intermediateStops: string[];
  instructions: string;
  stepFreeAccessible: boolean;
  color: string;
  evidenceClassification: EvidenceClassification;
}

export interface MultimodalJourneyPlan {
  id: string;
  preference: JourneyPreference;
  title: string;
  totalDurationMinutes: number;
  inVehicleDurationMinutes: number;
  walkingDurationMinutes: number;
  waitingDurationMinutes: number;
  totalDistanceKm: number;
  walkingDistanceMeters: number;
  transfersCount: number;
  estimatedFareInr: number;
  carbonSavedKg: number;
  reliabilityScorePct: number;
  stepFreeAccessible: boolean;
  evidenceClassification: EvidenceClassification;
  legs: JourneyLeg[];
}

export interface PlanOptions {
  originId: string;
  destinationId: string;
  departureTime?: string;
  preference?: JourneyPreference;
  requireStepFree?: boolean;
}

interface PathState {
  nodeId: string;
  generalizedCost: number;
  actualDurationMinutes: number;
  inVehicleMin: number;
  walkMin: number;
  waitMin: number;
  distanceKm: number;
  transfers: number;
  legs: JourneyLeg[];
  edgesUsed: MultimodalEdge[];
  lastMode?: string;
  stepFree: boolean;
  reliabilitySum: number;
}

export class MultimodalJourneyEngine {
  private network: MultimodalNetworkGraph;

  constructor(network?: MultimodalNetworkGraph) {
    this.network = network || getMultimodalNetwork();
  }

  /**
   * Plans up to 3 diverse routes matching passenger preferences:
   * 1. FASTEST (Multimodal balance)
   * 2. LEAST_TRANSFERS (Friction minimized)
   * 3. BUS_ONLY (Zero metro transfers, direct bus service)
   */
  public planMultimodalJourneys(options: PlanOptions): MultimodalJourneyPlan[] {
    const { originId, destinationId, requireStepFree = false } = options;

    const startNode = this.network.getNode(originId);
    const endNode = this.network.getNode(destinationId);

    if (!startNode || !endNode) {
      return [];
    }

    if (originId === destinationId) {
      return [this.createTrivialPlan(startNode)];
    }

    const plans: MultimodalJourneyPlan[] = [];

    // 1. FASTEST Multimodal Route
    const fastestPath = this.searchShortestPath(startNode.id, endNode.id, 'FASTEST', requireStepFree);
    if (fastestPath) {
      plans.push(this.formatPlan(fastestPath, 'FASTEST', 'Fastest Multimodal (Metro + Bus Arterial)'));
    }

    // 2. LEAST TRANSFERS Route
    const directPath = this.searchShortestPath(startNode.id, endNode.id, 'LEAST_TRANSFERS', requireStepFree);
    if (directPath) {
      // Avoid duplicate plans if identical to fastest
      const isDuplicate = plans.some(
        (p) =>
          p.totalDurationMinutes === Math.round(directPath.actualDurationMinutes) &&
          p.transfersCount === directPath.transfers
      );
      if (!isDuplicate) {
        plans.push(this.formatPlan(directPath, 'LEAST_TRANSFERS', 'Least Transfers (Direct & Low-Friction)'));
      }
    }

    // 3. BUS ONLY Route
    const busPath = this.searchShortestPath(startNode.id, endNode.id, 'BUS_ONLY', requireStepFree);
    if (busPath) {
      plans.push(this.formatPlan(busPath, 'BUS_ONLY', 'Direct Bus Arterial (DTC Surface Corridors)'));
    }

    return plans;
  }

  /**
   * Multi-criteria Dijkstra / Generalized Cost Search
   */
  private searchShortestPath(
    originId: string,
    destinationId: string,
    preference: JourneyPreference,
    requireStepFree: boolean
  ): PathState | null {
    // Priority queue simulation
    const queue: PathState[] = [
      {
        nodeId: originId,
        generalizedCost: 0,
        actualDurationMinutes: 0,
        inVehicleMin: 0,
        walkMin: 0,
        waitMin: 0,
        distanceKm: 0,
        transfers: 0,
        legs: [],
        edgesUsed: [],
        stepFree: true,
        reliabilitySum: 100,
      },
    ];

    const visitedCost = new Map<string, number>();

    while (queue.length > 0) {
      // Extract state with lowest generalized cost
      queue.sort((a, b) => a.generalizedCost - b.generalizedCost);
      const current = queue.shift()!;

      if (current.nodeId === destinationId) {
        return current;
      }

      const costKey = `${current.nodeId}:${current.transfers}`;
      const prevCost = visitedCost.get(costKey);
      if (prevCost !== undefined && prevCost <= current.generalizedCost) {
        continue;
      }
      visitedCost.set(costKey, current.generalizedCost);

      const outgoing = this.network.getOutgoingEdges(current.nodeId);

      for (const edge of outgoing) {
        // Enforce Bus Only mode restriction
        if (preference === 'BUS_ONLY' && (edge.mode === 'METRO' || edge.mode === 'TRANSFER')) {
          continue;
        }

        // Accessibility requirement
        if (requireStepFree && !edge.isStepFreeAccessible) {
          continue;
        }

        // Prevent immediate cycle / U-turn on the same edge
        if (current.edgesUsed.length > 0) {
          const lastEdge = current.edgesUsed[current.edgesUsed.length - 1];
          if (lastEdge.sourceNodeId === edge.targetNodeId && lastEdge.targetNodeId === edge.sourceNodeId) {
            continue;
          }
        }

        const isTransfer = current.lastMode !== undefined && current.lastMode !== edge.mode;
        const newTransfers = isTransfer ? current.transfers + 1 : current.transfers;

        // Cap transfer depth to avoid infinite wandering
        if (newTransfers > 3) continue;

        // Time calculations
        const inVehTime = edge.mode === 'BUS' || edge.mode === 'METRO' ? edge.expectedDurationMinutes : 0;
        const walkTime = edge.mode === 'TRANSFER' || edge.mode === 'WALK' ? edge.expectedDurationMinutes : 0;
        const waitTime = edge.mode === 'BUS' || edge.mode === 'METRO' ? edge.headwayMinutes / 2 : 0;

        // Weight parameters
        const wWait = 1.5;
        const wWalk = 2.0;
        let transferPenalty = 0;

        if (isTransfer) {
          transferPenalty = preference === 'LEAST_TRANSFERS' ? 25.0 : 8.0;
        }

        const reliabilityPenalty = (100 - edge.reliabilityScorePct) / 10;

        // Generalized Cost Increment
        const costIncrement =
          inVehTime +
          wWait * waitTime +
          wWalk * walkTime +
          transferPenalty +
          reliabilityPenalty;

        const targetNode = this.network.getNode(edge.targetNodeId);
        const sourceNode = this.network.getNode(edge.sourceNodeId);

        const newLeg: JourneyLeg = {
          id: `leg-${current.legs.length + 1}-${edge.id}`,
          mode: edge.mode,
          originId: edge.sourceNodeId,
          originName: sourceNode ? sourceNode.name : edge.sourceNodeId,
          destinationId: edge.targetNodeId,
          destinationName: targetNode ? targetNode.name : edge.targetNodeId,
          lineOrRoute: edge.lineOrRouteName,
          durationMinutes: Math.round((edge.expectedDurationMinutes + waitTime) * 10) / 10,
          distanceKm: edge.distanceKm,
          intermediateStops: [],
          instructions: this.generateLegInstruction(edge, sourceNode, targetNode),
          stepFreeAccessible: edge.isStepFreeAccessible,
          color: edge.color,
          evidenceClassification: edge.evidenceClassification,
        };

        const nextState: PathState = {
          nodeId: edge.targetNodeId,
          generalizedCost: current.generalizedCost + costIncrement,
          actualDurationMinutes: current.actualDurationMinutes + edge.expectedDurationMinutes + waitTime,
          inVehicleMin: current.inVehicleMin + inVehTime,
          walkMin: current.walkMin + walkTime,
          waitMin: current.waitMin + waitTime,
          distanceKm: Math.round((current.distanceKm + edge.distanceKm) * 10) / 10,
          transfers: newTransfers,
          legs: [...current.legs, newLeg],
          edgesUsed: [...current.edgesUsed, edge],
          lastMode: edge.mode,
          stepFree: current.stepFree && edge.isStepFreeAccessible,
          reliabilitySum: current.reliabilitySum * (edge.reliabilityScorePct / 100),
        };

        queue.push(nextState);
      }
    }

    return null;
  }

  private generateLegInstruction(
    edge: MultimodalEdge,
    source?: MultimodalNode,
    target?: MultimodalNode
  ): string {
    const sName = source?.name || 'Boarding Point';
    const tName = target?.name || 'Destination Point';

    if (edge.mode === 'METRO') {
      return `Board ${edge.lineOrRouteName} at ${sName}. Travel ${edge.distanceKm} km towards ${tName}.`;
    }
    if (edge.mode === 'BUS') {
      return `Take bus (${edge.lineOrRouteName}) from ${sName} to ${tName}. Estimated travel: ${edge.expectedDurationMinutes} min.`;
    }
    if (edge.mode === 'TRANSFER') {
      const levelText = edge.verticalLevelsChange
        ? ` Change ${edge.verticalLevelsChange} level(s) via elevators/escalators.`
        : '';
      const coveredText = edge.isCoveredWalkway ? ' Follow covered concourse walkway.' : '';
      return `Walk ${Math.round(edge.distanceKm * 1000)}m from ${sName} to ${tName}.${levelText}${coveredText}`;
    }
    return `Walk to ${tName} (${Math.round(edge.distanceKm * 1000)}m).`;
  }

  private formatPlan(path: PathState, preference: JourneyPreference, title: string): MultimodalJourneyPlan {
    // Fare estimation: Delhi Metro slab (10-60 INR) + DTC Bus (10-25 INR)
    let fare = 0;
    let metroDist = 0;
    let busUsed = false;

    for (const leg of path.legs) {
      if (leg.mode === 'METRO') {
        metroDist += leg.distanceKm;
      } else if (leg.mode === 'BUS') {
        busUsed = true;
      }
    }

    if (metroDist > 0) {
      if (metroDist <= 2) fare += 10;
      else if (metroDist <= 5) fare += 20;
      else if (metroDist <= 12) fare += 30;
      else if (metroDist <= 21) fare += 40;
      else if (metroDist <= 32) fare += 50;
      else fare += 60;
    }

    if (busUsed) {
      fare += 15; // Average DTC AC/Non-AC fare
    }

    // Carbon savings vs private petrol car (140g CO2 / passenger km vs 35g transit)
    const carbonSavedKg = Math.round(path.distanceKm * 0.105 * 100) / 100;

    return {
      id: `plan-${preference.toLowerCase()}-${Date.now().toString(36)}`,
      preference,
      title,
      totalDurationMinutes: Math.round(path.actualDurationMinutes),
      inVehicleDurationMinutes: Math.round(path.inVehicleMin),
      walkingDurationMinutes: Math.round(path.walkMin),
      waitingDurationMinutes: Math.round(path.waitMin),
      totalDistanceKm: path.distanceKm,
      walkingDistanceMeters: Math.round(path.walkMin * 75), // ~4.5 km/h = 75 m/min
      transfersCount: path.transfers,
      estimatedFareInr: fare,
      carbonSavedKg,
      reliabilityScorePct: Math.round(path.reliabilitySum),
      stepFreeAccessible: path.stepFree,
      evidenceClassification: 'DERIVED',
      legs: path.legs,
    };
  }

  private createTrivialPlan(node: MultimodalNode): MultimodalJourneyPlan {
    return {
      id: `plan-trivial-${node.id}`,
      preference: 'FASTEST',
      title: 'Current Location',
      totalDurationMinutes: 0,
      inVehicleDurationMinutes: 0,
      walkingDurationMinutes: 0,
      waitingDurationMinutes: 0,
      totalDistanceKm: 0,
      walkingDistanceMeters: 0,
      transfersCount: 0,
      estimatedFareInr: 0,
      carbonSavedKg: 0,
      reliabilityScorePct: 100,
      stepFreeAccessible: true,
      evidenceClassification: 'OBSERVED',
      legs: [],
    };
  }
}

// Global cached engine instance
let engineInstance: MultimodalJourneyEngine | null = null;

export function getJourneyEngine(): MultimodalJourneyEngine {
  if (!engineInstance) {
    engineInstance = new MultimodalJourneyEngine();
  }
  return engineInstance;
}
