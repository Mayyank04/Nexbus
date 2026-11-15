# NEXBUS Phase 8 — Data Dictionary & Type Specifications

This document defines all core interfaces, schemas, field types, units, and constraint invariants introduced in Phase 8 of NEXBUS.

---

## 1. Multimodal Graph Entities

### 1.1 `MultimodalNode`
Represents a physical transit station, bus stop, or transfer access gateway.

| Field | Type | Unit / Enum | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique identifier | Primary key (e.g., `'metro-aiims'`, `'stop-cp-regal'`). |
| `code` | `string` | Short alphanumeric code | Station/stop code (e.g., `'MST-Y11'`, `'CP-01'`). |
| `name` | `string` | UTF-8 English string | Official English station name. |
| `hindiName` | `string` | UTF-8 Devanagari string | Official Devanagari Hindi name. |
| `type` | `MultimodalNodeType` | `'BUS_STOP' \| 'METRO_STATION' \| 'INTERCHANGE_HUB'` | Physical infrastructure class. |
| `coordinatesLocal` | `[number, number]` | Meters `[x, z]` | Local 3D coordinate space for Three.js scene. |
| `coordinatesWgs84` | `[number, number]` | Degrees `[lat, lng]` | Decimal WGS84 coordinates ($28.40 \le \text{lat} \le 28.88$). |
| `zone` | `string` | `'Central' \| 'South' \| 'North' \| 'East' \| 'West'` | Delhi NCT administrative transit zone. |
| `metroLines` | `string[]?` | Line names | Names of connected metro lines (if metro station). |
| `busCorridors` | `string[]?` | Corridor codes | Names/zones of connected bus routes. |
| `isStepFreeAccessible` | `boolean` | Boolean flag | Indicates wheelchair/step-free accessibility. |
| `elevatorCount` | `number` | Count ($\ge 0$) | Number of operational through-elevators. |
| `escalatorCount` | `number` | Count ($\ge 0$) | Number of directional escalators. |
| `evidenceClassification` | `EvidenceClassification` | Enum | Epistemological evidence classification tier. |

---

### 1.2 `MultimodalEdge`
Represents a transit line segment, road link, or pedestrian transfer walkway between two nodes.

| Field | Type | Unit / Enum | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique string | Unique edge identifier. |
| `sourceNodeId` | `string` | Node ID foreign key | Origin node ID. |
| `targetNodeId` | `string` | Node ID foreign key | Destination node ID. |
| `mode` | `MultimodalEdgeType` | `'BUS' \| 'METRO' \| 'TRANSFER' \| 'WALK'` | Physical transport mode. |
| `lineOrRouteId` | `string` | Identifier | Line or corridor identifier (e.g., `'line-yellow'`). |
| `lineOrRouteName` | `string` | Display string | Official line name (e.g., `'Yellow Line'`). |
| `color` | `string` | Hex string | Line color code (e.g., `'#E8B923'`). |
| `distanceKm` | `number` | Kilometers ($\text{km}$) | Physical travel distance along link. |
| `freeFlowDurationMinutes` | `number` | Minutes | Uncongested transit time. |
| `expectedDurationMinutes` | `number` | Minutes | Expected transit time factoring average dwell/delay. |
| `headwayMinutes` | `number` | Minutes | Scheduled headway between successive services. |
| `operationalSpeedKmH` | `number` | $\text{km/h}$ | Average operating speed on segment. |
| `verticalLevelsChange` | `number?` | Level count | Level change (+ underground, - elevated). |
| `isCoveredWalkway` | `boolean?` | Boolean | True if pedestrian link is sheltered from rain/heat. |
| `roadCrossingsCount` | `number?` | Count | Number of surface-level street crossings required. |
| `isStepFreeAccessible` | `boolean` | Boolean | Wheelchair accessibility status of edge. |
| `reliabilityScorePct` | `number` | Percentage ($0 - 100$) | Historical schedule adherence score. |
| `evidenceClassification` | `EvidenceClassification` | Enum | Epistemological classification tier. |

---

## 2. Multimodal Journey Planning Entities

### 2.1 `MultimodalJourneyPlan`
Output of the generalized cost journey routing algorithm.

| Field | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `id` | `string` | Unique string | Unique journey itinerary identifier. |
| `preference` | `string` | `'FASTEST' \| 'LEAST_TRANSFERS' \| 'BUS_ONLY'` | Route optimization priority. |
| `title` | `string` | Display string | Human-readable route descriptor. |
| `totalDurationMinutes` | `number` | Minutes | Total door-to-door journey time. |
| `inVehicleDurationMinutes` | `number` | Minutes | Cumulative time aboard bus or metro train. |
| `walkingDurationMinutes` | `number` | Minutes | Cumulative walking time. |
| `waitingDurationMinutes` | `number` | Minutes | Cumulative expected waiting time at platforms/stops. |
| `totalDistanceKm` | `number` | Kilometers | Total physical trip distance. |
| `walkingDistanceMeters` | `number` | Meters | Cumulative pedestrian walking distance. |
| `transfersCount` | `number` | Count ($\ge 0$) | Number of modal or line transfers. |
| `estimatedFareInr` | `number` | Indian Rupees ($\text{INR}$) | Official integrated fare estimate. |
| `carbonSavedKg` | `number` | $\text{kg CO}_2$ | Carbon emissions saved compared to private car. |
| `reliabilityScorePct` | `number` | Percentage ($0 - 100$) | Journey reliability probability. |
| `stepFreeAccessible` | `boolean` | Boolean | True if all itinerary legs are barrier-free. |
| `legs` | `JourneyLeg[]` | Array | Sequential breakdown of journey segments. |
| `evidenceClassification` | `EvidenceClassification` | Enum | `'DERIVED'` |

---

## 3. Interchange Analytics Entities

### 3.1 `InterchangeMetrics`
Evaluates transfer friction at a multimodal station hub.

| Field | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `hubId` | `string` | Identifier | Hub unique ID (e.g., `'hub-kashmere-gate'`). |
| `name` | `string` | String | Hub title and connected lines. |
| `hindiName` | `string` | Devanagari | Devanagari Hindi translation. |
| `busStopId` | `string` | Stop ID | Connected surface bus stop ID. |
| `metroStationIds` | `string[]` | Station IDs | Connected DMRC metro station IDs. |
| `walkingDistanceMeters` | `number` | Meters | Direct walking distance between modes. |
| `walkingDurationMinutes` | `number` | Minutes | Walk duration at $4.5\text{ km/h}$. |
| `verticalLevelsChange` | `number` | Levels | Grade transitions between bus bay and platforms. |
| `roadCrossingsCount` | `number` | Count | Surface roadways that must be crossed. |
| `isCoveredWalkway` | `boolean` | Boolean | Shelter presence along transfer concourse. |
| `hasElevator` | `boolean` | Boolean | Availability of working elevators. |
| `hasEscalator` | `boolean` | Boolean | Availability of operational escalators. |
| `isStepFreeAccessible` | `boolean` | Boolean | Barrier-free status for persons with reduced mobility. |
| `wayfindingQualityScore` | `number` | Rating ($1.0 - 5.0$) | Tactile & visual signage quality audit score. |
| `dailyFootfall` | `number` | Passengers/day | Estimated daily multimodal passenger volume. |
| `ifiRaw` | `number` | Index ($\ge 0$) | Raw unscaled Interchange Friction Index. |
| `frictionScore` | `number` | Score ($0 - 100$) | Normalized friction score (lower is smoother). |
| `frictionGrade` | `string` | `'A' \| 'B' \| 'C' \| 'D' \| 'E'` | Standardized service quality grade. |
| `bottleneckDescription` | `string` | Text | Observed pinch-point or structural friction cause. |
| `recommendedInterventions` | `string[]` | Array of strings | Prioritized civil/operational interventions. |

---

## 4. Network Resilience Entities

### 4.1 `ResilienceEvaluationResult`
Results of passive graph disruption stress tests.

| Field | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `scenarioId` | `string` | Identifier | Disruption scenario ID. |
| `scenarioName` | `string` | Title | Scenario descriptive title. |
| `severity` | `string` | `'MODERATE' \| 'SEVERE' \| 'CRITICAL'` | Disruption impact severity rating. |
| `vulnerabilityIndexPct` | `number` | Percentage ($0 - 100$) | Network fragility score under disruption. |
| `baselineEfficiency` | `number` | Dimensionless | Pre-disruption harmonic graph efficiency ($E_0$). |
| `disruptedEfficiency` | `number` | Dimensionless | Post-disruption harmonic graph efficiency ($E$). |
| `efficiencyLossPct` | `number` | Percentage | Global connectivity loss $\frac{E_0 - E}{E_0} \times 100$. |
| `criticalCutVertices` | `object[]` | Array | Stations whose removal partitions the network. |
| `sampleDetourImpacts` | `object[]` | Array | Delay penalties across representative origin-destination pairs. |
| `authorityAdvisories` | `string[]` | Array | Tactical mitigation guidance for transit operators. |
| `evidenceClassification` | `EvidenceClassification` | Enum | `'SIMULATED'` |
| `nonInterventionSafetyNotice` | `string` | Advisory text | Binding notice confirming read-only operations. |
