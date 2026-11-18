/**
 * NEXBUS PLAIN-LANGUAGE DICTIONARY & CONTENT GUIDE
 * Translates transport engineering terminology into intuitive, everyday language
 * understandable by a five-year-old, a first-time internet user, or a daily commuter,
 * while preserving precise technical definitions for researchers.
 */

export interface TermDefinition {
  technical: string;
  plain: string;
  childFriendly: string;
  explanation: string;
  icon: string;
}

export const PLAIN_LANGUAGE_DICTIONARY: Record<string, TermDefinition> = {
  transitNetwork: {
    technical: 'Transit Network',
    plain: 'Bus and metro routes',
    childFriendly: 'The roads and tracks where buses and trains go',
    explanation: 'The system of roads, bus corridors, and metro lines connecting different parts of Delhi.',
    icon: '🗺️',
  },
  headway: {
    technical: 'Headway',
    plain: 'Time between buses',
    childFriendly: 'How long you wait for the next bus to arrive',
    explanation: 'The number of minutes between two consecutive buses on the same route.',
    icon: '⏱️',
  },
  passengerLoad: {
    technical: 'Passenger Load Factor',
    plain: 'How full the bus is',
    childFriendly: 'Are there seats left or is everyone standing?',
    explanation: 'The percentage of a bus capacity currently filled by passengers.',
    icon: '👥',
  },
  congestion: {
    technical: 'Traffic Congestion',
    plain: 'Busy roads',
    childFriendly: 'Lots of cars and buses stuck moving slowly',
    explanation: 'Heavy traffic volume causing slow movement along road corridors.',
    icon: '🚦',
  },
  intermodalHub: {
    technical: 'Intermodal Interchange Hub',
    plain: 'Place to change buses or metro',
    childFriendly: 'A big station where you can hop off a bus and get on a train',
    explanation: 'A major station (like AIIMS or Kashmere Gate) where multiple bus routes and metro lines meet.',
    icon: '🔄',
  },
  demandPrediction: {
    technical: 'Demand Prediction (ST-GNN)',
    plain: 'How many people may travel',
    childFriendly: 'A smart computer guess of how busy it will be',
    explanation: 'A computer calculation forecasting passenger numbers based on the hour, day, and weather.',
    icon: '📈',
  },
  excessWaitingTime: {
    technical: 'Excess Waiting Time (EWT)',
    plain: 'Extra time people may wait',
    childFriendly: 'Waiting longer than the timetable said because buses bunched up',
    explanation: 'Unplanned delay caused when buses do not arrive at regular intervals.',
    icon: '⏳',
  },
  simulation: {
    technical: 'Parametric Policy Simulation',
    plain: 'Try out a possible change',
    childFriendly: 'A "what-if" game to test new ideas safely on a computer',
    explanation: 'Testing counterfactual scenarios (like cheaper fares or more electric buses) without real-world risk.',
    icon: '🧪',
  },
  provenance: {
    technical: 'Data Provenance & Lineage',
    plain: 'Where this information came from',
    childFriendly: 'Checking who wrote the facts so we know they are true',
    explanation: 'Verifying the official source, timestamp, and truthfulness of every dataset.',
    icon: '🔍',
  },
  accessibility: {
    technical: 'Barrier-Free Physical Accessibility',
    plain: 'How easy it is to reach a place',
    childFriendly: 'Can grandparents, baby strollers, and wheelchairs get in easily?',
    explanation: 'Features like ramps, lifts, low floors, and tactile paths for travelers with reduced mobility.',
    icon: '♿',
  },
};

/**
 * Crowding level visual & semantic mapping.
 * Enforces triple-encoding (Color + Text + Icon) for accessibility and clarity.
 */
export interface CrowdingDescription {
  level: 'low' | 'moderate' | 'high';
  plainTitle: string;
  childTitle: string;
  explanation: string;
  badgeClass: string;
  icon: string;
  colorHex: string;
}

export function getCrowdingDescription(percentage: number): CrowdingDescription {
  if (percentage < 65) {
    return {
      level: 'low',
      plainTitle: 'Not very crowded',
      childTitle: 'Plenty of space!',
      explanation: 'Lots of empty seats available. A very comfortable ride.',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-300',
      icon: '🟢',
      colorHex: '#10B981',
    };
  }
  if (percentage <= 85) {
    return {
      level: 'moderate',
      plainTitle: 'Getting busy',
      childTitle: 'Some seats left',
      explanation: 'Some people may need to stand. Moderate space inside.',
      badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: '🟡',
      colorHex: '#F59E0B',
    };
  }
  return {
    level: 'high',
    plainTitle: 'Very crowded',
    childTitle: 'Packed with people',
    explanation: 'Standing room only. You may want to wait for the next bus if you prefer comfort.',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-300',
    icon: '🔴',
    colorHex: '#E11D48',
  };
}
