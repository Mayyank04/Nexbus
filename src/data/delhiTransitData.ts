// Realistic Delhi Urban Transit Network Data
// Curated based on Delhi Transport Corporation (DTC) & DIMTS arterial networks

export interface BusStop {
  id: string;
  name: string;
  hindiName: string;
  code: string;
  zone: 'Central' | 'South' | 'North' | 'East' | 'West';
  coordinates: [number, number]; // [x, z] in local 3D scale
  dailyFootfall: number;
  crowdingLevel: 'low' | 'moderate' | 'high' | 'critical';
  metroInterchange?: string;
}

export interface TransitCorridor {
  id: string;
  name: string;
  code: string;
  color: string;
  type: 'radial' | 'ring' | 'feeder' | 'express';
  lengthKm: number;
  dailyPassengers: number;
  busesPerHour: number;
  averageSpeedKmH: number;
  currentPunctuality: number; // percentage
  status: 'optimal' | 'moderate' | 'congested';
  path: [number, number, number][]; // 3D coordinates [x, y, z]
  stops: string[];
  description: string;
}

export interface TransitRoute {
  id: string;
  routeNumber: string;
  origin: string;
  destination: string;
  via: string[];
  frequencyMinutes: number;
  firstBus: string;
  lastBus: string;
  fleetSize: number;
  type: 'AC Electric' | 'Standard CNG' | 'Express';
  corridorId: string;
  stops: string[];
  peakLoadFactor: number; // e.g. 1.25 = 125% capacity
  confidenceScore: number;
}

export const DELHI_STOPS: BusStop[] = [
  {
    id: 'stop-cp-regal',
    name: 'Connaught Place (Regal)',
    hindiName: 'कनॉट प्लेस (रीगल)',
    code: 'CP-01',
    zone: 'Central',
    coordinates: [0, 0],
    dailyFootfall: 142000,
    crowdingLevel: 'high',
    metroInterchange: 'Rajiv Chowk (Yellow/Blue Line)',
  },
  {
    id: 'stop-aiims',
    name: 'AIIMS / Safdarjung Hospital',
    hindiName: 'एम्स / सफदरजंग',
    code: 'AI-04',
    zone: 'South',
    coordinates: [8, 28],
    dailyFootfall: 185000,
    crowdingLevel: 'critical',
    metroInterchange: 'AIIMS (Yellow Line)',
  },
  {
    id: 'stop-kashmere-gate',
    name: 'Kashmere Gate ISBT',
    hindiName: 'कश्मीरी गेट बस अड्डा',
    code: 'KG-02',
    zone: 'North',
    coordinates: [-6, -34],
    dailyFootfall: 210000,
    crowdingLevel: 'critical',
    metroInterchange: 'Kashmere Gate (Red/Yellow/Violet)',
  },
  {
    id: 'stop-dhaula-kuan',
    name: 'Dhaula Kuan Interchange',
    hindiName: 'धौला कुआँ',
    code: 'DK-07',
    zone: 'West',
    coordinates: [-26, 12],
    dailyFootfall: 112000,
    crowdingLevel: 'high',
    metroInterchange: 'Dhaula Kuan (Airport Express / Pink)',
  },
  {
    id: 'stop-nehru-place',
    name: 'Nehru Place Bus Terminal',
    hindiName: 'नेहरू प्लेस टर्मिनल',
    code: 'NP-09',
    zone: 'South',
    coordinates: [24, 38],
    dailyFootfall: 128000,
    crowdingLevel: 'moderate',
    metroInterchange: 'Nehru Place (Violet Line)',
  },
  {
    id: 'stop-anand-vihar',
    name: 'Anand Vihar ISBT',
    hindiName: 'आनंद विहार बस अड्डा',
    code: 'AV-03',
    zone: 'East',
    coordinates: [38, -12],
    dailyFootfall: 198000,
    crowdingLevel: 'critical',
    metroInterchange: 'Anand Vihar (Blue/Pink Line)',
  },
  {
    id: 'stop-lajpat-nagar',
    name: 'Lajpat Nagar Ring Road',
    hindiName: 'लाजपत नगर',
    code: 'LN-05',
    zone: 'South',
    coordinates: [16, 22],
    dailyFootfall: 94000,
    crowdingLevel: 'moderate',
    metroInterchange: 'Lajpat Nagar (Pink/Violet Line)',
  },
  {
    id: 'stop-moti-nagar',
    name: 'Moti Nagar Crossing',
    hindiName: 'मोती नगर',
    code: 'MN-08',
    zone: 'West',
    coordinates: [-24, -16],
    dailyFootfall: 86000,
    crowdingLevel: 'moderate',
    metroInterchange: 'Moti Nagar (Blue Line)',
  },
  {
    id: 'stop-red-fort',
    name: 'Red Fort / Old Delhi',
    hindiName: 'लाल किला / पुरानी दिल्ली',
    code: 'RF-06',
    zone: 'North',
    coordinates: [4, -26],
    dailyFootfall: 165000,
    crowdingLevel: 'high',
    metroInterchange: 'Lal Quila (Violet Line)',
  },
  {
    id: 'stop-saket',
    name: 'Saket City Centre',
    hindiName: 'साकेत',
    code: 'SK-11',
    zone: 'South',
    coordinates: [12, 46],
    dailyFootfall: 91000,
    crowdingLevel: 'low',
    metroInterchange: 'Malviya Nagar (Yellow Line)',
  },
];

export const DELHI_CORRIDORS: TransitCorridor[] = [
  {
    id: 'corridor-ring-road',
    name: 'Mahatma Gandhi Ring Road Arterial',
    code: 'COR-01',
    color: '#B84C32', // Terracotta
    type: 'ring',
    lengthKm: 47.8,
    dailyPassengers: 642000,
    busesPerHour: 74,
    averageSpeedKmH: 18.4,
    currentPunctuality: 81.2,
    status: 'congested',
    description: 'Delhi’s primary circular transit spine linking North, West, South and East districts.',
    stops: ['stop-kashmere-gate', 'stop-dhaula-kuan', 'stop-aiims', 'stop-lajpat-nagar', 'stop-anand-vihar'],
    path: [
      [-6, 0.4, -34],
      [-16, 0.4, -26],
      [-24, 0.4, -16],
      [-26, 0.4, 0],
      [-26, 0.4, 12],
      [-16, 0.4, 20],
      [-4, 0.4, 24],
      [8, 0.4, 28],
      [16, 0.4, 22],
      [26, 0.4, 10],
      [34, 0.4, -2],
      [38, 0.4, -12],
      [28, 0.4, -24],
      [12, 0.4, -30],
      [-6, 0.4, -34],
    ],
  },
  {
    id: 'corridor-radial-south',
    name: 'Aurobindo Marg / Janpath Central Axis',
    code: 'COR-02',
    color: '#C89B53', // Warm Gold
    type: 'radial',
    lengthKm: 22.4,
    dailyPassengers: 389000,
    busesPerHour: 48,
    averageSpeedKmH: 22.1,
    currentPunctuality: 87.5,
    status: 'moderate',
    description: 'Direct North-South spine connecting Lutyens’ Delhi to South Delhi tech and medical hubs.',
    stops: ['stop-cp-regal', 'stop-aiims', 'stop-saket'],
    path: [
      [0, 0.4, 0],
      [2, 0.4, 10],
      [4, 0.4, 18],
      [8, 0.4, 28],
      [10, 0.4, 38],
      [12, 0.4, 46],
    ],
  },
  {
    id: 'corridor-outer-ring',
    name: 'Outer Ring Road Rapid Corridor',
    code: 'COR-03',
    color: '#2A5C8A', // Transit Blue
    type: 'express',
    lengthKm: 58.2,
    dailyPassengers: 512000,
    busesPerHour: 56,
    averageSpeedKmH: 26.8,
    currentPunctuality: 84.0,
    status: 'optimal',
    description: 'High-speed transit bypass corridor with elevated grade separators and major bus junctions.',
    stops: ['stop-dhaula-kuan', 'stop-nehru-place', 'stop-anand-vihar'],
    path: [
      [-32, 0.4, 16],
      [-20, 0.4, 32],
      [0, 0.4, 40],
      [24, 0.4, 38],
      [38, 0.4, 20],
      [42, 0.4, -2],
      [38, 0.4, -12],
    ],
  },
  {
    id: 'corridor-heritage-spine',
    name: 'Old Delhi / Yamuna Heritage Corridor',
    code: 'COR-04',
    color: '#8B4513',
    type: 'radial',
    lengthKm: 16.5,
    dailyPassengers: 295000,
    busesPerHour: 42,
    averageSpeedKmH: 14.2,
    currentPunctuality: 73.8,
    status: 'congested',
    description: 'Historic artery with high pedestrian density and intermodal interchange at Kashmere Gate.',
    stops: ['stop-kashmere-gate', 'stop-red-fort', 'stop-cp-regal'],
    path: [
      [-6, 0.4, -34],
      [-1, 0.4, -30],
      [4, 0.4, -26],
      [2, 0.4, -14],
      [0, 0.4, 0],
    ],
  },
];

export const DELHI_ROUTES: TransitRoute[] = [
  {
    id: 'route-502',
    routeNumber: '502',
    origin: 'Mehrauli Terminal',
    destination: 'Old Delhi Railway Station',
    via: ['Saket', 'AIIMS', 'Janpath', 'Connaught Place', 'Red Fort'],
    frequencyMinutes: 8,
    firstBus: '05:30',
    lastBus: '23:15',
    fleetSize: 32,
    type: 'AC Electric',
    corridorId: 'corridor-radial-south',
    stops: ['stop-saket', 'stop-aiims', 'stop-cp-regal', 'stop-red-fort'],
    peakLoadFactor: 1.34,
    confidenceScore: 0.94,
  },
  {
    id: 'route-ring-sewa',
    routeNumber: 'TMS (+)',
    origin: 'Kashmere Gate ISBT (Clockwise Ring)',
    destination: 'Kashmere Gate ISBT',
    via: ['Dhaula Kuan', 'AIIMS', 'Lajpat Nagar', 'Anand Vihar', 'ISBT'],
    frequencyMinutes: 6,
    firstBus: '05:00',
    lastBus: '23:45',
    fleetSize: 64,
    type: 'AC Electric',
    corridorId: 'corridor-ring-road',
    stops: ['stop-kashmere-gate', 'stop-dhaula-kuan', 'stop-aiims', 'stop-lajpat-nagar', 'stop-anand-vihar'],
    peakLoadFactor: 1.48,
    confidenceScore: 0.96,
  },
  {
    id: 'route-419',
    routeNumber: '419',
    origin: 'Ambedkar Nagar Terminal',
    destination: 'Old Delhi Railway Station',
    via: ['Pushp Vihar', 'Nehru Place', 'Moolchand', 'ITO', 'Red Fort'],
    frequencyMinutes: 10,
    firstBus: '05:45',
    lastBus: '22:50',
    fleetSize: 24,
    type: 'Standard CNG',
    corridorId: 'corridor-radial-south',
    stops: ['stop-nehru-place', 'stop-lajpat-nagar', 'stop-cp-regal', 'stop-red-fort'],
    peakLoadFactor: 1.22,
    confidenceScore: 0.89,
  },
  {
    id: 'route-729',
    routeNumber: '729',
    origin: 'Kapashera Border',
    destination: 'Mori Gate Terminal',
    via: ['Mahipalpur', 'Dhaula Kuan', 'Karol Bagh', 'Pahar Ganj'],
    frequencyMinutes: 12,
    firstBus: '06:00',
    lastBus: '22:30',
    fleetSize: 20,
    type: 'Standard CNG',
    corridorId: 'corridor-ring-road',
    stops: ['stop-dhaula-kuan', 'stop-moti-nagar', 'stop-cp-regal', 'stop-kashmere-gate'],
    peakLoadFactor: 1.15,
    confidenceScore: 0.91,
  },
];

export const HOURLY_FLOW_DATA = [
  { hour: '06:00', load: 38, passengers: 42000, confidence: 98 },
  { hour: '07:00', load: 64, passengers: 95000, confidence: 97 },
  { hour: '08:00', load: 88, passengers: 168000, confidence: 95 },
  { hour: '09:00', load: 96, passengers: 215000, confidence: 94 },
  { hour: '10:00', load: 92, passengers: 198000, confidence: 93 },
  { hour: '11:00', load: 74, passengers: 132000, confidence: 96 },
  { hour: '12:00', load: 62, passengers: 104000, confidence: 97 },
  { hour: '13:00', load: 68, passengers: 118000, confidence: 96 },
  { hour: '14:00', load: 65, passengers: 110000, confidence: 96 },
  { hour: '15:00', load: 72, passengers: 125000, confidence: 95 },
  { hour: '16:00', load: 84, passengers: 160000, confidence: 94 },
  { hour: '17:00', load: 95, passengers: 220000, confidence: 92 },
  { hour: '18:00', load: 98, passengers: 242000, confidence: 91 },
  { hour: '19:00', load: 91, passengers: 194000, confidence: 93 },
  { hour: '20:00', load: 76, passengers: 145000, confidence: 95 },
  { hour: '21:00', load: 58, passengers: 92000, confidence: 97 },
  { hour: '22:00', load: 36, passengers: 48000, confidence: 98 },
];
