# NEXBUS Phase 9 — REST API Reference Manual

**Document Version**: 2.0.0-institutional  
**Classification**: `DERIVED` / `ESTIMATED`  
**Base URL**: `http://localhost:3000`

This manual documents the production REST API endpoints introduced and enhanced in Phase 9 of NEXBUS.

---

## 1. Passenger Demand Intelligence API

### `GET /api/demand/corridor-demand`
Retrieves temporal passenger demand profiles, directional imbalance ratios, Peak Hour Factors (PHF), and Gini concentration coefficients.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `corridorId` | `string` | No | Specific corridor ID to analyze | `corridor-ring-road` |
| `dayType` | `string` | No | Operational day type (`weekday`, `weekend`) | `weekday` |
| `synthetic` | `boolean` | No | Force synthetic test data mode (`true`, `false`) | `false` |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "demand": {
    "corridorId": "corridor-ring-road",
    "corridorName": "Mahatma Gandhi Ring Road Arterial",
    "dayType": "weekday",
    "totalDailyPassengers": 642000,
    "morningPeakPaxPerHour": 59064,
    "eveningPeakPaxPerHour": 56496,
    "peakHourFactor": 0.84,
    "directionalImbalanceRatio": 0.74,
    "giniPassengerConcentration": 0.38,
    "dominantDirection": "Inbound to Central Commercial Spine",
    "busiestStops": [
      {
        "stopId": "stop-kashmere-gate",
        "stopName": "Kashmere Gate ISBT",
        "shareOfCorridorDemandPct": 24.2
      }
    ],
    "hourlyProfiles": [
      {
        "hour": 9,
        "timeLabel": "09:00",
        "expectedPaxPerHour": 59064,
        "lowerCi95PaxPerHour": 51976,
        "upperCi95PaxPerHour": 66152,
        "loadFactorPercentage": 133,
        "isPeak": true,
        "directionalSplitRatio": 0.74
      }
    ],
    "evidenceClassification": "DERIVED",
    "privacyComplianceNotice": "PRIVACY COMPLIANT: Aggregated under k-anonymity (k >= 15). Individual passenger transaction records and geolocation pings are excluded."
  }
}
```

---

## 2. Interchange Congestion & Fruin LOS API

### `GET /api/multimodal/interchanges/congestion`
Evaluates pedestrian flow rates, Volume-to-Capacity ratios, and Fruin Level of Service (LOS) across multimodal hubs.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `hubId` | `string` | No | Filter by specific interchange hub ID | `hub-kashmere-gate` |
| `timePeriod` | `string` | No | Operational time window (`AM_PEAK`, `PM_PEAK`, `OFF_PEAK`) | `AM_PEAK` |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "generatedAt": "2026-11-15T09:48:00.000Z",
  "timePeriod": "AM_PEAK",
  "totalHubsAnalyzed": 11,
  "networkAverageICI": 68,
  "diagnostics": [
    {
      "hubId": "hub-kashmere-gate",
      "name": "Kashmere Gate Multimodal Hub (ISBT + Red/Yellow/Violet Lines)",
      "zone": "North",
      "timePeriod": "AM_PEAK",
      "peakArrivalIntensityPaxPerMin": 618,
      "volumeToCapacityRatio": 1.47,
      "concourseFlowRatePaxPerMinPerMeter": 112.4,
      "fruinLevelOfService": "LOS_E",
      "fruinDescription": "Severe congestion; shuffling flow; intermittent stoppages at stairwells.",
      "averageTransferDelaySeconds": 195,
      "verticalBottleneckConstraint": "Deep escalator queue at platform descent",
      "interchangeCongestionIndex": 98,
      "capacity": {
        "clearConcourseWidthMeters": 5.5,
        "availableThroughputCapacityPaxPerMin": 412,
        "stairwellWidthMeters": 2.4,
        "escalatorThroughputPaxPerMin": 120,
        "liftCycleCapacityPaxPerHour": 450
      },
      "evidenceClassification": "DERIVED"
    }
  ]
}
```

---

## 3. Model Explainability & SHAP Feature Attribution API

### `GET /api/ml/explainability`
Generates cooperative game-theoretic SHAP feature attribution waterfalls and global importance rankings for deployed predictive mobility surrogates.

#### Query Parameters
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `corridorId` | `string` | No | Corridor ID to explain | `corridor-ring-road` |
| `horizon` | `number` | No | Forecast lead time in minutes | `30` |
| `isPeak` | `boolean` | No | Evaluation under peak commute conditions | `true` |

#### Response Schema (`200 OK`)
```json
{
  "success": true,
  "explanation": {
    "corridorId": "corridor-ring-road",
    "corridorName": "Mahatma Gandhi Ring Road Arterial",
    "forecastHorizonMinutes": 30,
    "modelVersion": "v2.0.0-institutional",
    "baselinePredictionMinutes": 8.5,
    "finalPredictedDelayMinutes": 16.4,
    "pointForecastCrowdingPct": 117,
    "uncertaintyInterval95": [103, 132],
    "uncertaintyDecomposition": {
      "aleatoricUncertaintyPct": 76.5,
      "epistemicUncertaintyPct": 23.5
    },
    "globalFeatureImportance": [
      {
        "featureName": "headway_variance_lag15m",
        "meanAbsoluteShapMinutes": 3.8,
        "importanceRank": 1
      },
      {
        "featureName": "time_of_day_peak_multiplier",
        "meanAbsoluteShapMinutes": 3.2,
        "importanceRank": 2
      }
    ],
    "localFeatureWaterfall": [
      {
        "featureName": "time_of_day_peak_multiplier",
        "featureValue": "09:00 AM (Peak AM Commute)",
        "shapValueContributionMinutes": 4.2,
        "attributionPercentage": 38.5,
        "description": "Tidal morning commuter volume converging on Central Secretariat and Connaught Place.",
        "category": "TEMPORAL"
      },
      {
        "featureName": "headway_variance_lag15m",
        "featureValue": "Cv = 0.38 (Elevated Bunching)",
        "shapValueContributionMinutes": 2.8,
        "attributionPercentage": 25.7,
        "description": "Observed irregular bus headway arrivals propagating downstream delay waves.",
        "category": "KINEMATIC"
      }
    ],
    "explanationNarrative": [
      "The model forecasts an expected travel delay of +16.4 minutes relative to free-flow timetable.",
      "Peak commute timing and observed headway variance (Cv=0.38) are the primary positive drivers contributing +7.0 minutes of delay."
    ],
    "limitationsNotice": "EXPLAINABILITY NOTICE: Feature importances quantify statistical predictive association in the model surrogate. They do not constitute clinical causal proofs of transit system behavior.",
    "evidenceClassification": "DERIVED"
  }
}
```
