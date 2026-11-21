/**
 * NEXBUS CANONICAL TERMINOLOGY REGISTRY & PLAIN-LANGUAGE CONTENT SYSTEM
 * 
 * Provides a two-level semantic translation system:
 * Level 1 — Plain-language, child-friendly, everyday explanations for ordinary commuters and students.
 * Level 2 — Rigorous technical definitions, mathematical formulas, units, data sources, assumptions,
 *           and limitations for urban transport researchers, planners, and engineers.
 * 
 * Operational Safety Invariant: READ-ONLY + PASSIVE + ADVISORY (Absolute and non-negotiable).
 */

export interface TermDefinition {
  id: string;
  technical: string;
  plain: string;
  childFriendly: string;
  explanation: string;
  icon: string;
  formula?: string;
  units?: string;
  dataSource?: string;
  assumptions?: string[];
  limitations?: string[];
}

export const PLAIN_LANGUAGE_DICTIONARY: Record<string, TermDefinition> = {
  headway: {
    id: 'headway',
    technical: 'Vehicle Headway (h)',
    plain: 'Time between buses',
    childFriendly: 'How long you wait for the next bus to arrive',
    explanation: 'The time elapsed between two consecutive transit vehicles arriving at the same stop on the same route.',
    icon: '⏱️',
    formula: 'h_i = t_{i} - t_{i-1}',
    units: 'Minutes (min) or Seconds (s)',
    dataSource: 'DTC Automated Vehicle Location (AVL) GPS telemetry & timetable schedules',
    assumptions: [
      'FIFO vehicle order along corridor without overtaking in dedicated lanes',
      'Consistent transponder ping interval (10 to 30 seconds)',
    ],
    limitations: [
      'GPS dead-zones in flyover underpasses cause temporary tracking gaps',
      'Monsoon congestion and traffic bunching inflate headway variance',
    ],
  },
  excessWaitingTime: {
    id: 'excessWaitingTime',
    technical: 'Excess Waiting Time (EWT)',
    plain: 'Extra waiting time',
    childFriendly: 'Waiting longer than the timetable said because buses bunched up',
    explanation: 'The additional time passengers wait at a stop beyond the scheduled average wait due to uneven bus spacing.',
    icon: '⏳',
    formula: 'EWT = \\frac{\\sum h_i^2}{2 \\sum h_i} - \\frac{E[h]}{2}',
    units: 'Minutes (min)',
    dataSource: 'DTC GPS headway records compared against published DIMTS timetables',
    assumptions: [
      'Random passenger arrivals at high-frequency stops (headway < 12 min)',
      'Uniform passenger boarding distribution across operating hours',
    ],
    limitations: [
      'Does not capture passengers who abandon the stop after excessive delays',
      'Does not reflect physical bus overcrowding preventing boarding',
    ],
  },
  crowdingIndex: {
    id: 'crowdingIndex',
    technical: 'Passenger Load Factor (PLF) / Crowding Index',
    plain: 'How full the bus is',
    childFriendly: 'Are there seats left or is everyone standing?',
    explanation: 'The ratio of estimated passengers on board compared to seated capacity and crush limit.',
    icon: '👥',
    formula: 'PLF = \\frac{N_{passengers}}{C_{seated} + C_{standee}} \\times 100\\%',
    units: 'Percentage (%) of vehicle capacity',
    dataSource: 'Electronic Ticketing Machine (ETM) transaction density + ST-GNN predictive model',
    assumptions: [
      'Fixed average journey length per fare tier calibrated from household surveys',
      'Standard DTC bus capacity: 35 seated, 25 standees (total 60 crush limit)',
    ],
    limitations: [
      'ETM logs record boarding tap-ins but lack tap-out GPS coordinates',
      'Free-travel women pink ticket volume estimated from depot daily reconciliation',
    ],
  },
  odMatrix: {
    id: 'odMatrix',
    technical: 'Origin-Destination (OD) Matrix',
    plain: 'Where journeys begin and end',
    childFriendly: 'A map of travel between locations across Delhi',
    explanation: 'A mathematical matrix quantifying trip volumes moving between different urban zones across Delhi.',
    icon: '🗺️',
    formula: 'T_{ij} = A_i O_i B_j D_j f(c_{ij})',
    units: 'Trips per hour (trips/hr)',
    dataSource: 'Delhi Household Travel Survey + DMRC smart card tap-in/tap-out telemetry + mobile network telemetry holdout',
    assumptions: [
      'Gravity model impedance calibrated by travel time and fare cost',
      'Peak-hour directional symmetry on arterial ring corridors',
    ],
    limitations: [
      'Informal intermediate modes (Gramin Sewa, e-rickshaws) are underrepresented',
      'Non-work spontaneous trips have higher variance than daily commutes',
    ],
  },
  modalInterchange: {
    id: 'modalInterchange',
    technical: 'Intermodal Transfer Friction',
    plain: 'Change to another type of transport',
    childFriendly: 'A big station where you can hop off a bus and get on a train',
    explanation: 'The walking, waiting, and level-change penalty experienced when transferring between bus and metro networks.',
    icon: '🔄',
    formula: 'C_{transfer} = w_{walk} T_{walk} + w_{wait} T_{wait} + P_{level\\_change}',
    units: 'Generalized Cost Units (equivalent minutes)',
    dataSource: 'Empirical pedestrian transfer audits at 15 major Delhi hubs (AIIMS, Kashmere Gate, Anand Vihar)',
    assumptions: [
      'Average pedestrian walking speed: 1.2 m/s',
      'Transfer friction penalty: 5 to 12 minutes equivalent generalized cost',
    ],
    limitations: [
      'Peak crowd surges inside transfer underpasses reduce walking speeds to < 0.8 m/s',
      'Escalator outages temporarily increase barrier index for mobility-impaired commuters',
    ],
  },
  accessibilityIndex: {
    id: 'accessibilityIndex',
    technical: 'Barrier-Free Physical Accessibility Index',
    plain: 'How easy it is to reach places',
    childFriendly: 'Can grandparents, baby strollers, and wheelchairs get in easily?',
    explanation: 'A composite score evaluating step-free access, ramps, elevators, and tactile paving at transit stations.',
    icon: '♿',
    formula: 'AI = \\frac{\\sum_{k} w_k S_k}{\\sum_k w_k}',
    units: 'Score (0 - 100) or Isochrone Reach (minutes)',
    dataSource: 'Phase 15 physical station audits + DMRC accessibility compliance logs',
    assumptions: [
      'Universal design criteria based on Harmonised Guidelines 2021',
      'Step-free path exists from street curb to vehicle floor',
    ],
    limitations: [
      'Last-mile footpath breaks outside station gates are outside transit agency control',
      'Low-floor electric bus ramp deployment depends on driver training and curb heights',
    ],
  },
  gisLayers: {
    id: 'gisLayers',
    technical: 'Geospatial Information System (GIS) Vector Layers',
    plain: 'Map information',
    childFriendly: 'Different layers of information shown on the map',
    explanation: 'Spatial thematic overlays projecting transport corridors, demand zones, and environmental hazards onto Delhi cartography.',
    icon: '📚',
    units: 'WGS84 Coordinates (EPSG:4326) projected to Cartesian 3D plane',
    dataSource: 'OpenStreetMap (OSM) + Delhi Geo-Spatial Data Infrastructure (GSDI) + DMRC',
    assumptions: [
      'Mercator projection centered at Connaught Place (28.6328° N, 77.2197° E)',
      'Topographical elevation variation across Delhi: ~200m to 300m AMSL',
    ],
    limitations: [
      'Does not represent live satellite aerial photography',
      'Temporary road diversions and construction barricades may lag by up to 14 days',
    ],
  },
  simulation: {
    id: 'simulation',
    technical: 'Parametric Policy Simulation (Little\'s Law & Elasticity)',
    plain: 'Try a possible change',
    childFriendly: 'A "what-if" game to test new ideas safely on a computer',
    explanation: 'A mathematical sandbox modeling the impact of fleet expansion, signal preemption, or fare policy changes before physical implementation.',
    icon: '🧪',
    formula: 'L = \\lambda W \\quad \\text{and} \\quad \\frac{\\Delta Q}{Q} = \\varepsilon \\left(\\frac{\\Delta P}{P}\\right)',
    units: 'Headway (min), Passenger queue (pax), Emissions (kg CO2)',
    dataSource: 'Calibrated urban transit parameters (DTC historical fleet utilization + Delhi transport elasticity curves)',
    assumptions: [
      'System reaches steady-state queue balance under Little\'s Law',
      'Price elasticity of demand constant across tested parameter ranges',
    ],
    limitations: [
      'Does not simulate extreme weather shocks or road blockages unless specifically parameterized',
      'Advisory decision-support only; zero physical actuation channels',
    ],
  },
  provenance: {
    id: 'provenance',
    technical: 'Cryptographic Data Provenance & Lineage',
    plain: 'Where the information came from',
    childFriendly: 'Checking who wrote the facts so we know they are true',
    explanation: 'An immutable audit trail linking every displayed metric to its original agency source, ingestion pipeline, timestamp, and verification hash.',
    icon: '🔍',
    formula: '\\text{SHA256}(Dataset \\parallel Timestamp \\parallel AgencyID)',
    units: 'Hexadecimal digest (256-bit)',
    dataSource: 'Internal NEXBUS Ingestion Ledger & Open Transit Data (OTD) APIs',
    assumptions: [
      'Upstream agency feeds provide authentic telemetry',
      'Cryptographic hashing detects downstream tampering or alteration',
    ],
    limitations: [
      'Does not guarantee zero sensor hardware drift at the physical vehicle level',
      'Stale feeds automatically transition to AGING or STALE classification',
    ],
  },
  prediction: {
    id: 'prediction',
    technical: 'Spatio-Temporal Graph Neural Network (ST-GNN) Forecast',
    plain: 'What the model expects',
    childFriendly: 'A computer-generated estimate of what may happen',
    explanation: 'A machine learning surrogate estimating future passenger crowding and travel times across network nodes.',
    icon: '📈',
    formula: 'Y_{t+k} = f_\\theta(G, X_t, X_{t-1}, \\dots)',
    units: 'Passenger crowding percentage (%) & Arrival delta (min)',
    dataSource: 'Trained on 6 months of historical DTC AVL and ticketing screenlines',
    assumptions: [
      'Corridor graph topology remains invariant over prediction horizon',
      'Normal commute patterns hold without unannounced disruptions',
    ],
    limitations: [
      'Prediction uncertainty expands beyond 60-minute forecast horizon',
      'Unpredicted VIP movement or protest diversions invalidate model priors',
    ],
  },
  dataFreshness: {
    id: 'dataFreshness',
    technical: 'Telemetry Freshness State',
    plain: 'How recent the information is',
    childFriendly: 'When the information was last updated',
    explanation: 'The time elapsed since the underlying sensor or agency data stream was verified by the platform.',
    icon: '📡',
    formula: '\\Delta t_{fresh} = t_{current} - t_{observation}',
    units: 'Seconds (s), Minutes (min), or Hours (h)',
    dataSource: 'Ingestion timestamp metadata from OTD and DMRC feeds',
    assumptions: [
      'Server clock synchronized via NTP',
      'Agency upstream timestamp represents actual collection time',
    ],
    limitations: [
      'Network latency between DTC bus GSM modems and central server introduces 15–45s intrinsic lag',
      'Batch feeds (e.g. CPCB air quality) update on hourly cycles',
    ],
  },
  emissionsIntensity: {
    id: 'emissionsIntensity',
    technical: 'Well-to-Wheel (WTW) Emissions Intensity',
    plain: 'Clean air impact',
    childFriendly: 'How much cleaner the air is when we ride electric buses instead of cars',
    explanation: 'The total greenhouse gas emissions generated per passenger-kilometer, accounting for electricity generation and fuel combustion.',
    icon: '🌱',
    formula: 'E_{WTW} = \\frac{\\sum (Fuel \\times EmissionFactor)}{Passenger \\cdot km}',
    units: 'Grams CO2 equivalent per passenger-km (g CO2e/pax-km)',
    dataSource: 'Central Electricity Authority (CEA) grid emission factor + CPCB tailpipe benchmarks',
    assumptions: [
      'Northern Regional Grid emission factor: ~0.71 kg CO2/kWh',
      'Average electric bus consumption: 1.15 kWh/km',
    ],
    limitations: [
      'Grid mix fluctuates diurnally with solar generation peaks',
      'Ambient AC load in extreme Delhi summer (45°C) increases consumption by up to 25%',
    ],
  },
  transitNetwork: {
    id: 'transitNetwork',
    technical: 'Transit Network Topology',
    plain: 'Bus and metro routes',
    childFriendly: 'The roads and tracks where buses and trains go',
    explanation: 'The interconnected graph of road spines, bus corridors, and metro rail tracks connecting Delhi.',
    icon: '🗺️',
    units: '67 Nodes, 226 Edges, 15 Interchange Hubs',
    dataSource: 'OpenStreetMap + DMRC Network Map + DTC Route Gazette',
    assumptions: [
      'Four priority arterial corridors modeled: Ring Road, Outer Ring Road, MB Road, Radial Axis',
    ],
    limitations: [
      'Feeder bus routes outside the four primary corridors are modeled in aggregate',
    ],
  },
  congestion: {
    id: 'congestion',
    technical: 'Corridor Congestion Index',
    plain: 'Busy roads and traffic slowdown',
    childFriendly: 'Lots of cars and buses stuck moving slowly',
    explanation: 'The ratio of actual observed transit speed to free-flow design speed along an arterial road corridor.',
    icon: '🚦',
    formula: 'CI = 1 - \\frac{v_{observed}}{v_{free\\_flow}}',
    units: 'Index (0.00 to 1.00) or Average Speed (km/h)',
    dataSource: 'DTC AVL probe vehicle speeds across corridor segments',
    assumptions: ['Free-flow speed benchmark: 40 km/h on Ring Road, 30 km/h on radial avenues'],
    limitations: ['Signal wait times at intersections are included in segment speed averages'],
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
      plainTitle: 'More space available',
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
      plainTitle: 'Some space available',
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

export function getTerm(key: string): TermDefinition | undefined {
  return PLAIN_LANGUAGE_DICTIONARY[key];
}
