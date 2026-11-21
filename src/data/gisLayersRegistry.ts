/**
 * NEXBUS GIS LAYERS REGISTRY & SPATIAL EXPLAINABILITY DOSSIER
 * 
 * Provides comprehensive explainability metadata for all 11 Geospatial Information System (GIS)
 * vector and surface layers in the NEXBUS Digital Twin.
 * 
 * Target Standard: Universal understandability for first-time commuters combined with
 * full provenance, units, mathematical bounds, and explicit limitation disclosures for transport researchers.
 */

export type DigitalTwinLayer =
  | 'all'
  | 'metro'
  | 'buses'
  | 'interchanges'
  | 'accessibility'
  | 'demand'
  | 'flow'
  | 'utilization'
  | 'disruption'
  | 'flood_risk'
  | 'demographics';

export type EvidenceClassification =
  | 'OBSERVED'
  | 'VERIFIED_EXTERNAL'
  | 'DERIVED'
  | 'ESTIMATED'
  | 'PREDICTED'
  | 'SIMULATED'
  | 'SYNTHETIC'
  | 'UNAVAILABLE'
  | 'AUTH_REQUIRED';

export type FreshnessStatus =
  | 'FRESH'
  | 'AGING'
  | 'STALE'
  | 'EXPIRED'
  | 'UNKNOWN'
  | 'UNAVAILABLE';

export interface GisLayerMetadata {
  id: DigitalTwinLayer;
  label: string;
  plainTitle: string;
  tag: string;
  description: string;
  sourceClassification: EvidenceClassification;
  freshnessState: FreshnessStatus;
  units: string;
  legend: string;
  doesNotProve: string;
}

export const GIS_LAYERS_REGISTRY: GisLayerMetadata[] = [
  {
    id: 'all',
    label: 'All Multimodal Spines',
    plainTitle: 'Everything Combined (Metro + Bus Network)',
    tag: 'OVERVIEW',
    description: 'Composite geospatial layer projecting the complete multimodal transit network across the National Capital Territory of Delhi.',
    sourceClassification: 'VERIFIED_EXTERNAL',
    freshnessState: 'FRESH',
    units: 'Multimodal Network Graph (67 nodes, 226 edges, 15 interchange hubs)',
    legend: 'Blue = Metro Rail Spines | Red/Amber = Arterial Bus Corridors | Concentric Dots = Interchange Hubs',
    doesNotProve: 'Does not prove zero transfer friction or immediate vehicle boarding availability at this exact second.',
  },
  {
    id: 'metro',
    label: 'Metro Rail Network Spines',
    plainTitle: 'Delhi Metro Train Lines & Stations',
    tag: 'DMRC',
    description: 'Track alignments, underground tunnels, elevated viaducts, and stations operated across Delhi by DMRC.',
    sourceClassification: 'VERIFIED_EXTERNAL',
    freshnessState: 'FRESH',
    units: 'Stations & Track Segments (WGS84 Projected Coordinates)',
    legend: 'Yellow Line = North-South Axis | Blue Line = East-West Spine | Violet Line = Heritage Axis',
    doesNotProve: 'Does not prove underground passenger crowd density inside individual train coaches.',
  },
  {
    id: 'buses',
    label: 'Arterial Bus Network',
    plainTitle: 'City Bus Routes & Roadway Corridors',
    tag: 'DTC/DIMTS',
    description: 'Roadway bus paths, stops, and scheduled vehicle circulation across Delhi’s four primary transit corridors.',
    sourceClassification: 'OBSERVED',
    freshnessState: 'FRESH',
    units: 'Scheduled Buses per Hour (buses/hr)',
    legend: 'Red = Mahatma Gandhi Ring Road | Orange = Outer Ring Road | Purple = MB Road | Blue = Radial Axis',
    doesNotProve: 'Does not prove live satellite GPS coordinates; vehicle positions follow calibrated schedule velocities.',
  },
  {
    id: 'interchanges',
    label: 'Intermodal Interchange Hubs',
    plainTitle: 'Stations to Switch Between Bus and Metro',
    tag: 'TRANSFER',
    description: '15 primary multimodal exchange terminals connecting bus stops and metro stations (e.g. AIIMS, Kashmere Gate, Anand Vihar).',
    sourceClassification: 'OBSERVED',
    freshnessState: 'FRESH',
    units: 'Pedestrian Transfer Walking Distance (meters) & Friction Score',
    legend: 'Concentric Rings = Validated Multi-Platform Terminal | Pulsing Beacon = Major Intermodal Hub',
    doesNotProve: 'Does not guarantee step-free elevator or escalator operation during equipment maintenance cycles.',
  },
  {
    id: 'demand',
    label: 'Origin-Destination Gravity Density',
    plainTitle: 'Where Most People Travel In Delhi',
    tag: 'DEMAND',
    description: 'Spatial gravity model projecting passenger trip density moving between residential wards and employment clusters.',
    sourceClassification: 'DERIVED',
    freshnessState: 'AGING',
    units: 'Hourly Passenger Trips (pax/hr/km²)',
    legend: 'Dense Warm Glow = High Travel Demand Area | Faint Ambient Glow = Low Demand Peripheral Ward',
    doesNotProve: 'Does not identify individual travelers or track personal smartphone location telemetry.',
  },
  {
    id: 'flow',
    label: 'Desire Line Flow Arcs',
    plainTitle: 'City-Wide Commuter Travel Paths',
    tag: 'FLOW',
    description: 'Directional 3D parabolic arcs connecting top passenger origins and destinations across Delhi mobility zones.',
    sourceClassification: 'DERIVED',
    freshnessState: 'AGING',
    units: 'Directional Passenger Trips per Hour',
    legend: 'Arc Height = Geographic Travel Distance | Arc Thickness = Commuter Flow Volume',
    doesNotProve: 'Does not imply vehicles travel in a straight aerial line across the sky; reflects aggregate movement desire.',
  },
  {
    id: 'utilization',
    label: 'Corridor Capacity Utilization',
    plainTitle: 'How Full Each Bus Corridor Is',
    tag: 'CAPACITY',
    description: 'Ratio of hourly passenger demand to total seat and standing capacity along priority corridors.',
    sourceClassification: 'ESTIMATED',
    freshnessState: 'FRESH',
    units: 'Passenger Load Factor Percentage (%)',
    legend: '🟢 Green < 65% (Seats Available) | 🟡 Yellow 65-85% (Moderate Standing) | 🔴 Red > 85% (Rush Crush Load)',
    doesNotProve: 'Does not prove that every single bus arriving at a stop has identical cabin occupancy.',
  },
  {
    id: 'accessibility',
    label: 'Pedestrian Walk Isochrones',
    plainTitle: 'How Far Commuters Can Walk in 5 to 15 Minutes',
    tag: 'EQUITY',
    description: 'Walkability catchment contours around transit stops based on standard 1.2 m/s pedestrian speed.',
    sourceClassification: 'DERIVED',
    freshnessState: 'FRESH',
    units: 'Walking Isochrone Time Catchment (5 min, 10 min, 15 min)',
    legend: 'Inner Shading = 5 min walk (400m) | Middle = 10 min walk (800m) | Outer = 15 min walk (1200m)',
    doesNotProve: 'Does not guarantee continuous concrete footpaths or absence of street-level construction hurdles.',
  },
  {
    id: 'disruption',
    label: 'Operational Hazard Beacons',
    plainTitle: 'Road Bottlenecks, Construction & Delays',
    tag: 'INCIDENT',
    description: 'Advisory incident markers highlighting construction bottlenecks, corridor diversions, and speed restrictions.',
    sourceClassification: 'OBSERVED',
    freshnessState: 'FRESH',
    units: 'Delay Impact (minutes added to nominal running time)',
    legend: 'Amber Marker = Moderate Speed Restriction | Crimson Marker = Severe Choke Point',
    doesNotProve: 'Does not dispatch municipal emergency services or issue automated road redirection mandates.',
  },
  {
    id: 'flood_risk',
    label: 'Yamuna Floodplain Vulnerability',
    plainTitle: 'Monsoon Water Risk Areas Near Transit Roads',
    tag: 'CLIMATE',
    description: 'Hydrological inundation contours along the Yamuna floodplains intersecting low-lying arterial transit roads.',
    sourceClassification: 'VERIFIED_EXTERNAL',
    freshnessState: 'FRESH',
    units: 'Water Level Elevation (meters AMSL relative to 205.33m warning level)',
    legend: 'Cyan Inundation Mesh = Low-Lying River Basin | High-Contrast Boundary = Arterial Embankment',
    doesNotProve: 'Does not predict hyper-local waterlogging caused by sudden localized stormwater drain blockage.',
  },
  {
    id: 'demographics',
    label: 'Census Population Density',
    plainTitle: 'Where Families & Commuters Live in Delhi',
    tag: 'CENSUS',
    description: 'Ward-level residential population density across Delhi NCT districts.',
    sourceClassification: 'VERIFIED_EXTERNAL',
    freshnessState: 'FRESH',
    units: 'Persons per square kilometer (persons/km²)',
    legend: 'Light Cream = Suburban Density (<10k/km²) | Deep Terracotta = Dense Urban Core (>25k/km²)',
    doesNotProve: 'Does not represent daytime floating commuter populations in commercial offices or market zones.',
  },
];

export function getGisLayerMetadata(layerId: DigitalTwinLayer): GisLayerMetadata {
  const match = GIS_LAYERS_REGISTRY.find((l) => l.id === layerId);
  return match || GIS_LAYERS_REGISTRY[0];
}
