# NEXBUS Phase 8 — REST API Reference Manual

This manual documents the production endpoints introduced in Phase 8 for Multimodal Journey Intelligence, Interchange Analytics, Network Resilience, and Geographic Accessibility.

---

## 1. Multimodal Journey Planning API

### `GET /api/multimodal/plan`
Computes generalized cost multi-criteria journey itineraries connecting bus stops, metro stations, and multimodal interchange hubs.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `origin` | `string` | **Yes** | Origin Node ID or Bus Stop ID | `stop-aiims` |
| `destination` | `string` | **Yes** | Destination Node ID or Bus Stop ID | `stop-cp-regal` |
| `preference` | `string` | No | Optimization priority (`FASTEST`, `LEAST_TRANSFERS`, `BUS_ONLY`) | `FASTEST` |
| `stepFree` | `boolean` | No | Restrict search to wheelchair / step-free accessible paths | `true` |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "query": {
    "origin": "stop-aiims",
    "destination": "stop-cp-regal",
    "preference": "FASTEST",
    "stepFree": false
  },
  "generatedAt": "2026-11-15T09:12:30.000Z",
  "planCount": 3,
  "plans": [
    {
      "id": "plan-fastest-kx92",
      "preference": "FASTEST",
      "title": "Fastest Multimodal (Metro + Bus Arterial)",
      "totalDurationMinutes": 21,
      "inVehicleDurationMinutes": 16,
      "walkingDurationMinutes": 3,
      "waitingDurationMinutes": 2,
      "totalDistanceKm": 8.1,
      "walkingDistanceMeters": 225,
      "transfersCount": 1,
      "estimatedFareInr": 30,
      "carbonSavedKg": 0.85,
      "reliabilityScorePct": 94,
      "stepFreeAccessible": true,
      "evidenceClassification": "DERIVED",
      "legs": [
        {
          "id": "leg-1-transfer",
          "mode": "TRANSFER",
          "originId": "stop-aiims",
          "originName": "AIIMS / Safdarjung Hospital",
          "destinationId": "metro-aiims",
          "destinationName": "AIIMS Metro Station",
          "lineOrRoute": "Pedestrian Transfer (AIIMS Multimodal Hub)",
          "durationMinutes": 1.3,
          "distanceKm": 0.08,
          "instructions": "Walk 75m from AIIMS / Safdarjung Hospital to AIIMS Metro Station. Change 2 level(s) via elevators/escalators. Follow covered concourse walkway.",
          "stepFreeAccessible": true,
          "color": "#4A6B5D",
          "evidenceClassification": "DERIVED"
        },
        {
          "id": "leg-2-metro-yellow",
          "mode": "METRO",
          "originId": "metro-aiims",
          "originName": "AIIMS Metro Station",
          "destinationId": "metro-rajiv-chowk",
          "destinationName": "Rajiv Chowk (Connaught Place)",
          "lineOrRoute": "Yellow Line (Samaypur Badli – HUDA City Centre)",
          "durationMinutes": 14.5,
          "distanceKm": 7.4,
          "instructions": "Board Yellow Line at AIIMS Metro Station. Travel 7.4 km towards Rajiv Chowk (Connaught Place).",
          "stepFreeAccessible": true,
          "color": "#E8B923",
          "evidenceClassification": "VERIFIED_EXTERNAL"
        }
      ]
    }
  ]
}
```

---

## 2. Interchange Analytics API

### `GET /api/multimodal/interchanges`
Retrieves network-wide interchange friction metrics, bottleneck assessments, and intervention plans.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `hubId` | `string` | No | Filter by specific interchange hub ID | `hub-kashmere-gate` |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "generatedAt": "2026-11-15T09:12:30.000Z",
  "totalHubsAnalyzed": 8,
  "averageFrictionScore": 28.5,
  "highestFrictionHub": "Dhaula Kuan Skywalk & Ring Road Interchange",
  "lowestFrictionHub": "AIIMS / Safdarjung Multimodal Health Transit Hub",
  "accessibleHubsCount": 8,
  "hubsByGrade": {
    "A": 2,
    "B": 5,
    "C": 1,
    "D": 0,
    "E": 0
  },
  "interchanges": [
    {
      "hubId": "hub-kashmere-gate",
      "name": "Kashmere Gate Multimodal Hub (ISBT + Red/Yellow/Violet Lines)",
      "hindiName": "कश्मीरी गेट बस अड्डा",
      "busStopId": "stop-kashmere-gate",
      "busStopName": "Kashmere Gate ISBT",
      "metroStationIds": ["metro-kashmere-gate"],
      "metroStationNames": ["Kashmere Gate Metro"],
      "zone": "North",
      "walkingDistanceMeters": 180,
      "walkingDurationMinutes": 3.2,
      "verticalLevelsChange": 3,
      "roadCrossingsCount": 0,
      "isCoveredWalkway": true,
      "hasElevator": true,
      "hasEscalator": true,
      "isStepFreeAccessible": true,
      "wayfindingQualityScore": 4.2,
      "dailyFootfall": 190000,
      "ifiRaw": 1.74,
      "frictionScore": 38,
      "frictionGrade": "B",
      "connectedModes": ["DTC Arterial Bus", "Metro Yellow", "Metro Red", "Metro Violet"],
      "bottleneckDescription": "Morning peak gate queues between Gate 1 & 2 concourse; deep escalator transfers.",
      "recommendedInterventions": [
        "Add dedicated high-capacity through-elevators directly connecting bus bays to underground metro concourses."
      ],
      "evidenceClassification": "DERIVED"
    }
  ]
}
```

---

## 3. Network Resilience Simulator API

### `GET /api/multimodal/resilience` / `POST /api/multimodal/resilience`
Conducts passive graph stress testing and resilience evaluation under corridor disruptions.

#### Query Parameters / Request Body
| Field | Type | Description |
| :--- | :--- | :--- |
| `scenarioId` | `string` | Disruption scenario ID (`ring-road-waterlogging`, `yellow-line-maintenance`, `ito-junction-gridlock`, `airport-express-suspension`). |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "evaluation": {
    "scenarioId": "ring-road-waterlogging",
    "scenarioName": "Ring Road Arterial Flooding (Moti Bagh / Dhaula Kuan Underpass)",
    "severity": "SEVERE",
    "vulnerabilityIndexPct": 43,
    "baselineEfficiency": 0.842,
    "disruptedEfficiency": 0.768,
    "efficiencyLossPct": 8.8,
    "criticalCutVertices": [
      {
        "nodeId": "metro-rajiv-chowk",
        "nodeName": "Rajiv Chowk (Connaught Place Central Hub)",
        "impactDescription": "Central interchange between Yellow and Blue lines; disruption severs North-South & East-West rapid transit connectivity."
      }
    ],
    "sampleDetourImpacts": [
      {
        "origin": "stop-dhaula-kuan",
        "destination": "stop-anand-vihar",
        "baselineDurationMin": 42,
        "disruptedDurationMin": 58.5,
        "delayPenaltyMin": 16.5,
        "delayPenaltyPct": 39.3,
        "recommendedDetourRoute": "Divert via Durgabai Deshmukh Pink Line + Aurobindo Marg surface bus feeder."
      }
    ],
    "authorityAdvisories": [
      "Issue passenger headway delay alerts on mobile apps and Station PIDS at feeder interchanges.",
      "Deploy 14 auxiliary CNG feeder buses along outer Ring Road relief bypass."
    ],
    "evidenceClassification": "SIMULATED",
    "nonInterventionSafetyNotice": "ADVISORY ONLY: NEXBUS does not control physical railway signaling, bus dispatch, or roadway traffic controllers. All recommendations require human review and field verification."
  }
}
```

---

## 4. Geographic Accessibility API

### `GET /api/multimodal/accessibility`
Evaluates 400m and 800m pedestrian catchment coverage across Delhi NCT and identifies underserved transit deserts.

#### Query Parameters
| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `lat` | `number` | No | Latitude for nearest transit lookup ($28.40 \le \text{lat} \le 28.88$). |
| `lng` | `number` | No | Longitude for nearest transit lookup ($76.84 \le \text{lng} \le 77.40$). |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "generatedAt": "2026-11-15T09:12:30.000Z",
  "totalTransitNodes": 37,
  "metroStationsCount": 21,
  "busStopsCount": 16,
  "overallTerritoryCoverage800mPct": 83.2,
  "overallTerritoryCoverage400mPct": 72.0,
  "zones": [
    {
      "zoneName": "Central",
      "totalAreaSqKm": 25,
      "coverage400mPct": 88.5,
      "coverage800mPct": 96.2,
      "accessibilityIndex": 94,
      "dominantTransitMode": "Delhi Metro (Yellow/Blue/Violet) & Radial Bus",
      "identifiedGaps": ["Paharganj interior dense alleys", "Barakhamba rear commercial cul-de-sacs"]
    }
  ],
  "transitGaps": [
    {
      "id": "gap-sangam-vihar",
      "name": "Sangam Vihar Informal Settlement",
      "zone": "South",
      "nearestTransitNodeName": "Saket City Centre / Metro",
      "distanceToNearestTransitKm": 3.4,
      "estimatedAffectedPopulation": 420000,
      "severity": "CRITICAL",
      "recommendedIntervention": "Deploy high-frequency electric mini-bus feeders connecting to Saket & Tuglakabad metro stations.",
      "evidenceClassification": "DERIVED"
    }
  ],
  "evidenceClassification": "DERIVED"
}
```
