/**
 * Institutional Scenario Planning & Comparative Intervention Service
 * Evaluates capital infrastructure projects, transit priority corridors,
 * headway enhancements, and fleet injections against baseline network metrics.
 * 
 * Strict Read-Only Advisory Safety:
 * NEXBUS provides decision support intelligence only. All scenarios are illustrative
 * counterfactual simulations and DO NOT represent officially approved government projects.
 * 
 * Evidence Classification:
 * - SIMULATED: Projected travel-time reductions, modal shifts, and emissions abatement
 * - DERIVED: Population coverage expansions and benefit-cost ratios
 */

import { EvidenceClassification } from '@/lib/evidence/evidenceClassification';

export type InterventionCategory =
  | 'CORRIDOR_INFRASTRUCTURE'
  | 'INTERCHANGE_UPGRADE'
  | 'OPERATIONAL_HEADWAY'
  | 'FLEET_EXPANSION';

export interface DistrictBenefitDistribution {
  districtName: string;
  equityTier: 'HIGH_ACCESS' | 'MODERATE_ACCESS' | 'UNDERSERVED_PERIPHERY';
  beneficiaryCommutersThousandsDaily: number;
  travelTimeReductionMin: number;
  relativeWelfareSharePct: number;
}

export interface InstitutionalIntervention {
  id: string;
  name: string;
  category: InterventionCategory;
  shortDescription: string;
  detailedScope: string;
  primaryCorridorsOrNodes: string[];
  capexCroresInr: number;
  opexAnnualCroresInr: number;
  implementationDurationMonths: number;
  impactMetrics: {
    travelTimeReductionAvgMin: number;
    transferPenaltyReductionMin: number;
    additionalPopCovered800mThousands: number;
    privateVehicleModalShiftPct: number;
    annualGhgAbatementTonnesCo2: number;
    benefitCostRatio20Yr: number;
    distributionalEquityScore: number; // 0 to 100
  };
  districtBenefitDistribution: DistrictBenefitDistribution[];
  governingFormulas: {
    modalShiftModel: string;
    bcrFormula: string;
    ghgFactor: string;
  };
  evidenceClassification: EvidenceClassification;
  institutionalDisclaimer: string;
}

export interface PortfolioEconomics {
  discountRatePct: number;
  projectHorizonYears: number;
  annuityFactor: number;
  presentValueCostsCroresInr: number;
  presentValueBenefitsCroresInr: number;
  portfolioBcr: number;
  vttsHourlyInr: {
    workTrips: number;
    nonWorkTrips: number;
  };
  shadowPriceCo2PerTonneInr: number;
  sensitivityScenarios: {
    baseCase: { bcr: number; npvCroresInr: number };
    pessimisticCostOverrun: { bcr: number; npvCroresInr: number; description: string };
    optimisticModalShift: { bcr: number; npvCroresInr: number; description: string };
    climatePriority: { bcr: number; npvCroresInr: number; description: string };
  };
}

export interface ScenarioComparisonReport {
  generatedAt: string;
  baselineSummary: {
    totalDailyTripsRepresented: number;
    avgMetropolitanTravelTimeMin: number;
    avgMultimodalTransferPenaltyMin: number;
    populationWithin800mPct: number;
    annualTransitGhgEmissionsTons: number;
  };
  availableInterventions: InstitutionalIntervention[];
  selectedInterventions: InstitutionalIntervention[];
  cumulativeImpact: {
    netTravelTimeReductionAvgMin: number;
    netAdditionalPopCovered800mThousands: number;
    netAnnualGhgAbatementTonnes: number;
    totalCapexCroresInr: number;
    totalOpexAnnualCroresInr: number;
    compositeBcrRatio: number;
    overallEquityIndex: number;
  };
  portfolioEconomics?: PortfolioEconomics;
  comparisonRanking: {
    rank: number;
    interventionId: string;
    interventionName: string;
    primaryStrength: string;
    costEffectivenessScore: number;
  }[];
  institutionalNotice: string;
  evidenceClassification: EvidenceClassification;
}

export const PROPOSED_INTERVENTIONS: InstitutionalIntervention[] = [
  // 1. East-West Vikas Marg BRT Corridor
  {
    id: 'intervention-brt-vikas-marg',
    name: 'East-West Dedicated Bus Rapid Transit (BRT) Corridor',
    category: 'CORRIDOR_INFRASTRUCTURE',
    shortDescription: '14.2 km physically separated median busway from ITO Bridge to Anand Vihar ISBT with off-board ticketing.',
    detailedScope:
      'Provides dedicated center-lane right-of-way, level platform boarding, and signal priority across 11 key intersections on Vikas Marg. Alleviates heavy trans-Yamuna bridge bottlenecks.',
    primaryCorridorsOrNodes: ['stop-ito', 'stop-vikas-marg-laxmi-nagar', 'stop-anand-vihar'],
    capexCroresInr: 420.0,
    opexAnnualCroresInr: 28.5,
    implementationDurationMonths: 24,
    impactMetrics: {
      travelTimeReductionAvgMin: 14.5,
      transferPenaltyReductionMin: 2.1,
      additionalPopCovered800mThousands: 340,
      privateVehicleModalShiftPct: 8.4,
      annualGhgAbatementTonnesCo2: 24500,
      benefitCostRatio20Yr: 3.42,
      distributionalEquityScore: 84,
    },
    districtBenefitDistribution: [
      { districtName: 'East Delhi', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 145, travelTimeReductionMin: 16.0, relativeWelfareSharePct: 44 },
      { districtName: 'Shahdara', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 92, travelTimeReductionMin: 14.5, relativeWelfareSharePct: 30 },
      { districtName: 'Central Delhi', equityTier: 'HIGH_ACCESS', beneficiaryCommutersThousandsDaily: 78, travelTimeReductionMin: 11.2, relativeWelfareSharePct: 26 },
    ],
    governingFormulas: {
      modalShiftModel: 'P_transit = 1 / (1 + exp(-beta * (Delta_Cost + ValueOfTime * Delta_Time))) (beta = 0.082)',
      bcrFormula: 'BCR = PV(CommuterTimeSavings + OperatingRelief + SocialCarbonValue) / PV(CAPEX + OPEX_20yr, r=0.08)',
      ghgFactor: 'Avoided CO2 = (Diverted_2W_km * 0.038 kg + Diverted_Car_km * 0.162 kg) / 1000',
    },
    evidenceClassification: 'SIMULATED',
    institutionalDisclaimer: 'ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.',
  },

  // 2. Sarai Kale Khan RRTS-Metro-ISBT Skywalk & Concourse
  {
    id: 'intervention-skywalk-sarai-kale-khan',
    name: 'Sarai Kale Khan Multimodal Elevated Concourse & RRTS Skywalk',
    category: 'INTERCHANGE_UPGRADE',
    shortDescription: 'Climate-controlled multi-tier pedestrian concourse linking Hazrat Nizamuddin Rail, Pink Line Metro, and Delhi-Meerut RRTS.',
    detailedScope:
      'Eliminates 680m outdoor exposed walking conflict across arterial road ramps. Installs 8 moving walkways, 12 escalators, and direct fare-integrated transfer gates.',
    primaryCorridorsOrNodes: ['railway-hazrat-nizamuddin', 'metro-sarai-kale-khan', 'stop-sarai-kale-khan'],
    capexCroresInr: 280.0,
    opexAnnualCroresInr: 12.0,
    implementationDurationMonths: 18,
    impactMetrics: {
      travelTimeReductionAvgMin: 9.8,
      transferPenaltyReductionMin: 7.4,
      additionalPopCovered800mThousands: 120,
      privateVehicleModalShiftPct: 6.2,
      annualGhgAbatementTonnesCo2: 18200,
      benefitCostRatio20Yr: 4.15,
      distributionalEquityScore: 78,
    },
    districtBenefitDistribution: [
      { districtName: 'South East Delhi', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 110, travelTimeReductionMin: 11.0, relativeWelfareSharePct: 42 },
      { districtName: 'South Delhi', equityTier: 'HIGH_ACCESS', beneficiaryCommutersThousandsDaily: 85, travelTimeReductionMin: 8.5, relativeWelfareSharePct: 32 },
      { districtName: 'East Delhi', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 65, travelTimeReductionMin: 9.2, relativeWelfareSharePct: 26 },
    ],
    governingFormulas: {
      modalShiftModel: 'Logit transfer penalty utility: U_transfer = -0.065 * walk_time - 0.085 * wait_time - 0.42 * outdoor_stairs',
      bcrFormula: 'BCR = PV(TransferFrictionSavings + SafetyBenefit) / PV(CAPEX + M&E_Opex, r=0.08)',
      ghgFactor: 'Avoided CO2 = Diverted Regional Commuter Trips * 24.5 km * 0.145 kg CO2/km',
    },
    evidenceClassification: 'SIMULATED',
    institutionalDisclaimer: 'ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.',
  },

  // 3. Network-Wide Metro & Feeder Headway Synchronization
  {
    id: 'intervention-headway-synchronization',
    name: 'Network-Wide Rapid Transit & Feeder Headway Synchronization',
    category: 'OPERATIONAL_HEADWAY',
    shortDescription: 'Compress Pink and Yellow line peak headways to 2.5 minutes with coordinated pulse-scheduled bus feeder dispatch.',
    detailedScope:
      'Implements automated timetable synchronization at Kashmere Gate, Rajiv Chowk, and Dhaula Kuan. Feeder buses hold departures for up to 90 seconds to match arriving metro passenger waves.',
    primaryCorridorsOrNodes: ['metro-rajiv-chowk', 'metro-kashmere-gate', 'stop-dhaula-kuan'],
    capexCroresInr: 95.0,
    opexAnnualCroresInr: 45.0,
    implementationDurationMonths: 8,
    impactMetrics: {
      travelTimeReductionAvgMin: 8.2,
      transferPenaltyReductionMin: 4.5,
      additionalPopCovered800mThousands: 210,
      privateVehicleModalShiftPct: 5.8,
      annualGhgAbatementTonnesCo2: 21000,
      benefitCostRatio20Yr: 3.88,
      distributionalEquityScore: 82,
    },
    districtBenefitDistribution: [
      { districtName: 'Central Delhi', equityTier: 'HIGH_ACCESS', beneficiaryCommutersThousandsDaily: 160, travelTimeReductionMin: 9.0, relativeWelfareSharePct: 35 },
      { districtName: 'North Delhi', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 125, travelTimeReductionMin: 8.5, relativeWelfareSharePct: 30 },
      { districtName: 'South Delhi', equityTier: 'HIGH_ACCESS', beneficiaryCommutersThousandsDaily: 140, travelTimeReductionMin: 7.8, relativeWelfareSharePct: 35 },
    ],
    governingFormulas: {
      modalShiftModel: 'E[W] = (H / 2) * (1 + Cv^2); Synchronization reduces transfer wait from 0.5*H_feeder to 0.15*H_feeder',
      bcrFormula: 'BCR = PV(AggregatePassengerWaitTimeSavings) / PV(FleetServiceKm_Opex, r=0.08)',
      ghgFactor: 'Avoided CO2 = 1.120 kg/km CNG replacement factor via electrified feeder synchronization',
    },
    evidenceClassification: 'SIMULATED',
    institutionalDisclaimer: 'ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.',
  },

  // 4. Suburban Electric Mini-Feeder Fleet
  {
    id: 'intervention-feeder-fleet-periphery',
    name: 'Peripheral Transit Desert Feeder Fleet Deployment',
    category: 'FLEET_EXPANSION',
    shortDescription: '500 low-floor 9m air-conditioned electric feeder mini-buses deployed across North West, North East, and South West peripheries.',
    detailedScope:
      'Provides 5-minute peak frequency connecting unorganized settlements and transit deserts (Sangam Vihar, Burari, Narela, Najafgarh) directly to nearest metro stations.',
    primaryCorridorsOrNodes: ['stop-gt-karnal-azadpur', 'stop-najafgarh-feeder', 'stop-mehrauli-badarpur-saket'],
    capexCroresInr: 375.0,
    opexAnnualCroresInr: 58.0,
    implementationDurationMonths: 12,
    impactMetrics: {
      travelTimeReductionAvgMin: 18.2,
      transferPenaltyReductionMin: 3.2,
      additionalPopCovered800mThousands: 780,
      privateVehicleModalShiftPct: 11.5,
      annualGhgAbatementTonnesCo2: 36800,
      benefitCostRatio20Yr: 4.62,
      distributionalEquityScore: 96,
    },
    districtBenefitDistribution: [
      { districtName: 'North West Delhi', equityTier: 'UNDERSERVED_PERIPHERY', beneficiaryCommutersThousandsDaily: 280, travelTimeReductionMin: 21.0, relativeWelfareSharePct: 45 },
      { districtName: 'North East Delhi', equityTier: 'UNDERSERVED_PERIPHERY', beneficiaryCommutersThousandsDaily: 195, travelTimeReductionMin: 18.5, relativeWelfareSharePct: 32 },
      { districtName: 'South West Delhi', equityTier: 'MODERATE_ACCESS', beneficiaryCommutersThousandsDaily: 140, travelTimeReductionMin: 14.0, relativeWelfareSharePct: 23 },
    ],
    governingFormulas: {
      modalShiftModel: 'First/last mile accessibility shift: Delta_P = 1 - exp(-0.45 * (Delta_WalkDist / 1000))',
      bcrFormula: 'BCR = PV(SocialEquityBenefits + TimeSavings + FareboxRevenue) / PV(BusProcurement_Capex + Charging_Opex, r=0.08)',
      ghgFactor: 'Avoided CO2 = 500 buses * 160 km/day * 300 days * 0.85 kg CO2/km avoided / 1000',
    },
    evidenceClassification: 'SIMULATED',
    institutionalDisclaimer: 'ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.',
  },
];

export class ScenarioPlanningService {
  public getInterventions(): InstitutionalIntervention[] {
    return PROPOSED_INTERVENTIONS;
  }

  public getInterventionById(id: string): InstitutionalIntervention | undefined {
    return PROPOSED_INTERVENTIONS.find((i) => i.id === id);
  }

  public compareInterventions(selectedIds?: string[]): ScenarioComparisonReport {
    const idsToCompare =
      selectedIds && selectedIds.length > 0
        ? selectedIds
        : PROPOSED_INTERVENTIONS.map((i) => i.id);

    const selected = PROPOSED_INTERVENTIONS.filter((i) => idsToCompare.includes(i.id));

    // Baseline city-scale mobility barometers (calibrated against Delhi master plan 2041 data)
    const baseline = {
      totalDailyTripsRepresented: 4850000,
      avgMetropolitanTravelTimeMin: 44.8,
      avgMultimodalTransferPenaltyMin: 8.6,
      populationWithin800mPct: 78.6,
      annualTransitGhgEmissionsTons: 620000,
    };

    // Calculate non-linear diminishing returns for cumulative combination
    const discountMultiplier = selected.length > 1 ? 0.85 : 1.0;

    const netTravelTimeSaved = +(
      selected.reduce((acc, i) => acc + i.impactMetrics.travelTimeReductionAvgMin, 0) * discountMultiplier / Math.max(1, selected.length * 0.7)
    ).toFixed(1);

    const netAdditionalPop = Math.round(
      selected.reduce((acc, i) => acc + i.impactMetrics.additionalPopCovered800mThousands, 0) * 0.92
    );

    const netGhgSaved = Math.round(
      selected.reduce((acc, i) => acc + i.impactMetrics.annualGhgAbatementTonnesCo2, 0) * 0.95
    );

    const totalCapex = +(
      selected.reduce((acc, i) => acc + i.capexCroresInr, 0)
    ).toFixed(1);

    const totalOpex = +(
      selected.reduce((acc, i) => acc + i.opexAnnualCroresInr, 0)
    ).toFixed(1);

    // Social Discount Rate r = 8%, Project Horizon T = 20 years
    // Annuity factor AF = [1 - (1+r)^-T] / r = [1 - 1.08^-20] / 0.08 = 9.8181
    const discountRate = 0.08;
    const horizonYears = 20;
    const annuityFactor = +(
      (1 - Math.pow(1 + discountRate, -horizonYears)) /
      discountRate
    ).toFixed(4);

    let sumPvCostsCrores = 0;
    let sumPvBenefitsCrores = 0;

    for (const item of selected) {
      const pvCost_i = item.capexCroresInr + item.opexAnnualCroresInr * annuityFactor;
      const pvBenefit_i = item.impactMetrics.benefitCostRatio20Yr * pvCost_i;
      sumPvCostsCrores += pvCost_i;
      sumPvBenefitsCrores += pvBenefit_i;
    }

    // Economically rigorous Portfolio BCR: PV(Total Benefits) / PV(Total Costs)
    const compositeBcr = sumPvCostsCrores > 0
      ? +(sumPvBenefitsCrores / sumPvCostsCrores).toFixed(2)
      : 1.0;

    const baseNpv = +(sumPvBenefitsCrores - sumPvCostsCrores).toFixed(1);

    // Parametric Sensitivity Scenarios
    // 1. Pessimistic: +25% CAPEX overrun, -20% Demand Benefits
    const pessPvCosts = selected.reduce(
      (sum, item) => sum + (item.capexCroresInr * 1.25 + item.opexAnnualCroresInr * annuityFactor),
      0
    );
    const pessPvBenefits = sumPvBenefitsCrores * 0.80;
    const pessBcr = +(pessPvBenefits / Math.max(1, pessPvCosts)).toFixed(2);
    const pessNpv = +(pessPvBenefits - pessPvCosts).toFixed(1);

    // 2. Optimistic: +15% Demand Shift, On-Budget
    const optPvBenefits = sumPvBenefitsCrores * 1.15;
    const optBcr = +(optPvBenefits / Math.max(1, sumPvCostsCrores)).toFixed(2);
    const optNpv = +(optPvBenefits - sumPvCostsCrores).toFixed(1);

    // 3. Climate Priority: Shadow Price of Carbon increased from ₹1,800 to ₹3,500/tonne
    const carbonBoostCrores = selected.reduce(
      (sum, item) => sum + (item.impactMetrics.annualGhgAbatementTonnesCo2 * (3500 - 1800) * annuityFactor) / 10000000,
      0
    );
    const climatePvBenefits = sumPvBenefitsCrores + carbonBoostCrores;
    const climateBcr = +(climatePvBenefits / Math.max(1, sumPvCostsCrores)).toFixed(2);
    const climateNpv = +(climatePvBenefits - sumPvCostsCrores).toFixed(1);

    const overallEquity = Math.round(
      selected.reduce((acc, i) => acc + i.impactMetrics.distributionalEquityScore, 0) / Math.max(1, selected.length)
    );

    // Ranking based on composite score: 40% BCR + 35% Equity + 25% Time Savings
    const ranking = selected
      .map((i) => {
        const costEffectiveness = +(
          (i.impactMetrics.benefitCostRatio20Yr * 0.4 +
            (i.impactMetrics.distributionalEquityScore / 100) * 3.5 +
            (i.impactMetrics.travelTimeReductionAvgMin / 20) * 2.5) *
          10
        ).toFixed(1);

        let strength = 'Balanced capital investment';
        if (i.impactMetrics.distributionalEquityScore >= 90) strength = 'Maximum spatial equity & transit desert relief';
        else if (i.impactMetrics.benefitCostRatio20Yr >= 4.0) strength = 'Highest economic benefit-cost return';
        else if (i.impactMetrics.travelTimeReductionAvgMin >= 14) strength = 'Maximum arterial commuter time savings';

        return {
          interventionId: i.id,
          interventionName: i.name,
          primaryStrength: strength,
          costEffectivenessScore: Number(costEffectiveness),
        };
      })
      .sort((a, b) => b.costEffectivenessScore - a.costEffectivenessScore)
      .map((item, idx) => ({ rank: idx + 1, ...item }));

    return {
      generatedAt: new Date().toISOString(),
      baselineSummary: baseline,
      availableInterventions: PROPOSED_INTERVENTIONS,
      selectedInterventions: selected,
      cumulativeImpact: {
        netTravelTimeReductionAvgMin: Number(netTravelTimeSaved),
        netAdditionalPopCovered800mThousands: netAdditionalPop,
        netAnnualGhgAbatementTonnes: netGhgSaved,
        totalCapexCroresInr: Number(totalCapex),
        totalOpexAnnualCroresInr: Number(totalOpex),
        compositeBcrRatio: Number(compositeBcr),
        overallEquityIndex: overallEquity,
      },
      portfolioEconomics: {
        discountRatePct: discountRate * 100,
        projectHorizonYears: horizonYears,
        annuityFactor,
        presentValueCostsCroresInr: +sumPvCostsCrores.toFixed(1),
        presentValueBenefitsCroresInr: +sumPvBenefitsCrores.toFixed(1),
        portfolioBcr: Number(compositeBcr),
        vttsHourlyInr: {
          workTrips: 150,
          nonWorkTrips: 75,
        },
        shadowPriceCo2PerTonneInr: 1800,
        sensitivityScenarios: {
          baseCase: { bcr: Number(compositeBcr), npvCroresInr: Number(baseNpv) },
          pessimisticCostOverrun: { bcr: Number(pessBcr), npvCroresInr: Number(pessNpv), description: '+25% CAPEX Overrun, -20% Demand Realization' },
          optimisticModalShift: { bcr: Number(optBcr), npvCroresInr: Number(optNpv), description: '+15% Demand Shift, On-Budget' },
          climatePriority: { bcr: Number(climateBcr), npvCroresInr: Number(climateNpv), description: 'Shadow CO2 Valued at ₹3,500/tonne' },
        },
      },
      comparisonRanking: ranking,
      institutionalNotice:
        'ILLUSTRATIVE INTERVENTION — NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY. All models are counterfactual projections for transportation research and planning.',
      evidenceClassification: 'SIMULATED',
    };
  }
}

let planningInstance: ScenarioPlanningService | null = null;

export function getScenarioPlanningService(): ScenarioPlanningService {
  if (!planningInstance) {
    planningInstance = new ScenarioPlanningService();
  }
  return planningInstance;
}
