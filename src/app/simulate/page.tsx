'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import { DELHI_CORRIDORS } from '@/data/delhiTransitData';
import {
  runSimulationEvaluation,
  SimulationResultResponse,
} from '@/lib/api';
import {
  RotateCcw,
  Play,
  HelpCircle,
  TrendingDown,
  TrendingUp,
  Leaf,
  Clock,
  ShieldAlert,
  Users,
  Compass,
  ArrowRight,
  CheckSquare,
  Square,
  Building2,
  BarChart3,
  Bus,
  CloudRain,
  AlertTriangle,
} from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils/formatters';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';
import { useSimulation } from '@/hooks/useSimulation';

export default function SimulationLabPage() {
  const { level } = useExperienceLevel();
  const {
    activeTab,
    setActiveTab,
    selectedCorridorId,
    setSelectedCorridorId,
    selectedCorridor,
    additionalBuses,
    setAdditionalBuses,
    targetHeadway,
    setTargetHeadway,
    signalPriority,
    setSignalPriority,
    timeWindow,
    setTimeWindow,
    isSimulating,
    simulationData,
    runSimulation: handleRunSimulation,
    resetParameters: handleReset,
    scenarioReport,
    selectedInterventionIds,
    setSelectedInterventionIds,
    isLoadingScenarios,
  } = useSimulation();

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 w-full space-y-8">
        {/* Phase 10 Simulation Mode Tab Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-divider pb-4">
          <div className="flex flex-col sm:flex-row border border-divider p-0.5 bg-surface-white gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('corridor_counterfactual')}
              className={`font-mono text-xs py-2 px-3 border transition-colors text-center ${
                activeTab === 'corridor_counterfactual'
                  ? 'border-terracotta bg-terracotta text-surface-white font-medium'
                  : 'border-transparent bg-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              CORRIDOR MICRO-SIMULATION
            </button>
            <button
              onClick={() => setActiveTab('institutional_interventions')}
              className={`font-mono text-xs py-2 px-3 border transition-colors text-center ${
                activeTab === 'institutional_interventions'
                  ? 'border-terracotta bg-terracotta text-surface-white font-medium'
                  : 'border-transparent bg-transparent text-ink-secondary hover:text-ink'
              }`}
            >
              INSTITUTIONAL PORTFOLIO PLANNING
            </button>
          </div>

          <div className="font-mono text-xs text-amber-800 bg-amber-50 px-2.5 py-1 border border-amber-200 shrink-0 font-medium">
            ▲ SIMULATED COUNTERFACTUAL • ADVISORY DECISION SUPPORT
          </div>
        </div>

        {activeTab === 'corridor_counterfactual' ? (
          <>
            {/* Editorial Heading */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-divider pb-8">
              <div className="max-w-2xl space-y-2 min-w-0 w-full">
                <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-normal leading-[1.05] tracking-tight break-words">
                  What if the network worked differently?
                </h1>
                <p className="text-sm sm:text-base text-ink-secondary font-normal leading-relaxed break-words">
                  Test transit interventions across Delhi’s arterial corridors. Evaluate headway compression, electric fleet injection, and signal preemption with agent-based micro-simulation.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-divider bg-surface-white hover:border-stone text-xs font-mono text-ink uppercase"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
                  <span>Reset</span>
                </button>

                <Magnetic intensity={0.2} range={60}>
                  <button
                    onClick={handleRunSimulation}
                    disabled={isSimulating}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 bg-ink text-surface-white text-xs font-mono uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSimulating ? 'Computing Model…' : 'Run Simulation'}</span>
                  </button>
                </Magnetic>
              </div>
            </div>

            {/* Prominent Advisory Badge */}
            <div className="p-3 bg-amber-50 border border-amber-300 text-amber-950 font-mono text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-800 shrink-0" />
                <span><strong>ADVISORY SIMULATION:</strong> This is a computer test to explore ideas, not a real-world promise.</span>
              </span>
              <span className="text-[11px] uppercase tracking-wider text-amber-800">NO PHYSICAL DISPATCH • PASSIVE TWIN</span>
            </div>

            {/* Friendly Introductory Question Cards (Curiosity Sandbox) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  EXPLORE A QUESTION (1-CLICK EXPERIMENTS)
                </span>
                <span className="font-mono text-[11px] text-terracotta">
                  TRY THESE SCENARIOS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedCorridorId('corridor-ring-road');
                    setAdditionalBuses(10);
                    setTargetHeadway(5);
                    setSignalPriority(true);
                    handleRunSimulation();
                  }}
                  className="p-4 border border-divider bg-surface-white hover:border-terracotta text-left transition-all group shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5 text-terracotta font-mono text-xs">
                    <Bus className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Fleet Expansion</span>
                  </div>
                  <h3 className="font-serif text-base text-ink group-hover:text-terracotta transition-colors leading-snug">
                    What happens if we add 10 more electric buses to the Ring Road?
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Tests how extra buses cut passenger wait times and ease peak rush-hour crowding.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setSelectedCorridorId('corridor-rad-mehrauli');
                    setAdditionalBuses(16);
                    setTargetHeadway(4);
                    setSignalPriority(true);
                    handleRunSimulation();
                  }}
                  className="p-4 border border-divider bg-surface-white hover:border-terracotta text-left transition-all group shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5 text-emerald-700 font-mono text-xs">
                    <Leaf className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Clean Air Day</span>
                  </div>
                  <h3 className="font-serif text-base text-ink group-hover:text-terracotta transition-colors leading-snug">
                    What happens if we make bus travel free on bad air days?
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Estimates private car drivers switching to buses and kilograms of exhaust averted.
                  </p>
                </button>

                <button
                  onClick={() => {
                    setSelectedCorridorId('corridor-outer-ring');
                    setAdditionalBuses(0);
                    setTargetHeadway(14);
                    setSignalPriority(false);
                    handleRunSimulation();
                  }}
                  className="p-4 border border-divider bg-surface-white hover:border-terracotta text-left transition-all group shadow-xs cursor-pointer"
                >
                  <div className="flex items-center gap-2 mb-1.5 text-amber-700 font-mono text-xs">
                    <CloudRain className="w-4 h-4" />
                    <span className="font-semibold uppercase tracking-wider">Monsoon Congestion</span>
                  </div>
                  <h3 className="font-serif text-base text-ink group-hover:text-terracotta transition-colors leading-snug">
                    What happens if a major road is flooded during heavy monsoon rains?
                  </h3>
                  <p className="text-xs text-ink-muted mt-1 leading-relaxed">
                    Reveals passenger platform bottlenecks when vehicle speeds drop across Delhi.
                  </p>
                </button>
              </div>
            </div>

        {/* Elegant Scenario Editor Controls */}
        <div className="border border-divider bg-surface-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm">
          {/* Target Corridor */}
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
              TARGET CORRIDOR
            </label>
            <select
              value={selectedCorridorId}
              onChange={(e) => setSelectedCorridorId(e.target.value)}
              className="w-full p-2.5 bg-parchment/30 border border-divider font-serif text-base text-ink focus:outline-none cursor-pointer"
            >
              {DELHI_CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Fleet */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px] text-ink-muted">
              <span>ADDITIONAL FLEET</span>
              <span className="font-medium text-ink">+{additionalBuses} BUSES</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={additionalBuses}
              onChange={(e) => setAdditionalBuses(parseInt(e.target.value, 10))}
              className="w-full accent-[#B84C32] cursor-pointer mt-2"
            />
            <div className="flex justify-between font-mono text-[11px] text-ink-muted">
              <span>+0 (Baseline)</span>
              <span>+12 EV</span>
              <span>+24 EV Fleet</span>
            </div>
          </div>

          {/* Target Headway */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[11px] text-ink-muted">
              <span>TARGET HEADWAY</span>
              <span className="font-medium text-ink">{targetHeadway} MIN</span>
            </div>
            <input
              type="range"
              min="4"
              max="15"
              step="1"
              value={targetHeadway}
              onChange={(e) => setTargetHeadway(parseInt(e.target.value, 10))}
              className="w-full accent-[#B84C32] cursor-pointer mt-2"
            />
            <div className="flex justify-between font-mono text-[11px] text-ink-muted">
              <span>4m (High Freq)</span>
              <span>12m (Baseline)</span>
            </div>
          </div>

          {/* Transit Signal Priority Toggle */}
          <div className="space-y-1.5">
            <label className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
              JUNCTION SIGNAL PRIORITY
            </label>
            <button
              onClick={() => setSignalPriority(!signalPriority)}
              className={`w-full p-2.5 border font-mono text-xs text-left transition-colors flex items-center justify-between ${
                signalPriority
                  ? 'border-terracotta bg-terracotta/10 text-terracotta font-medium'
                  : 'border-divider bg-parchment/30 text-ink-muted'
              }`}
            >
              <span>{signalPriority ? 'ACTIVE (PREEMPTION)' : 'OFF (STANDARD SIGNALS)'}</span>
              <span className="w-2 h-2 rounded-full bg-terracotta" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SPLIT-SCREEN SYNCHRONIZED 3D VIEWS: CURRENT VS PROPOSED
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Baseline Network View */}
          <div className="border border-divider bg-surface-white flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="p-4 border-b border-divider bg-parchment/40 flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  SCENARIO A / OBSERVED BASELINE
                </span>
                <h2 className="font-serif text-xl font-normal text-ink">
                  Current Network & Fleet
                </h2>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 border border-divider bg-surface-white text-ink-muted">
                DTC BASELINE
              </span>
            </div>

            <div className="relative h-80 sm:h-96 w-full bg-parchment/20">
              <DelhiCityCanvas
                preset="simulation"
                activeCorridorId={selectedCorridor.id}
                showBuses={true}
                splitMode={true}
                isSimulatedVariant={false}
                interactive={true}
                className="w-full h-full"
              />

              <div className="absolute bottom-3 left-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs space-y-1">
                <div className="text-ink-muted text-[11px]">AVG WAIT TIME</div>
                <div className="font-serif text-lg text-ink">
                  {simulationData ? `${simulationData.baseline.averageWaitTimeMinutes} min` : '14.2 min'}
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[11px]">PEAK CROWD LOAD</div>
                <div className="font-serif text-lg text-terracotta">
                  {simulationData ? `${simulationData.baseline.passengerLoadPercentage}%` : '146%'}
                </div>
              </div>
            </div>
          </div>

          {/* Hypothetical Proposed Network View */}
          <div className="border border-divider bg-surface-white flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="p-4 border-b border-divider bg-terracotta/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-terracotta">
                  SCENARIO B / PROPOSED INTERVENTION
                </span>
                <h2 className="font-serif text-xl font-normal text-ink">
                  Proposed Fleet & Headways
                </h2>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-terracotta text-surface-white font-mono">
                +{additionalBuses} EV SHUTTLES
              </span>
            </div>

            <div className="relative h-80 sm:h-96 w-full bg-parchment/20">
              <DelhiCityCanvas
                preset="simulation"
                activeCorridorId={selectedCorridor.id}
                showBuses={true}
                splitMode={true}
                isSimulatedVariant={true}
                interactive={true}
                className="w-full h-full"
              />

              <div className="absolute bottom-3 left-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs space-y-1">
                <div className="text-ink-muted text-[11px]">PROJECTED WAIT TIME</div>
                <div className="font-serif text-lg text-terracotta">
                  {simulationData
                    ? `${simulationData.simulated.averageWaitTimeMinutes} min (${simulationData.deltas.waitTimeDeltaPct}%)`
                    : '6.2 min (-56%)'}
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[11px]">PROJECTED CROWD LOAD</div>
                <div className="font-serif text-lg text-green-700">
                  {simulationData
                    ? `${simulationData.simulated.passengerLoadPercentage}% (-${simulationData.deltas.crowdingReliefPoints} pts)`
                    : '84% (-62 pts)'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Impacts */}
        {simulationData && (
          <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-divider pb-4">
              <div>
                <span className="font-mono text-xs text-terracotta uppercase tracking-wider">
                  MATHEMATICAL SYNTHESIS
                </span>
                <h2 className="font-serif text-2xl font-normal text-ink mt-0.5">
                  Calculated Consequences for {selectedCorridor.name}
                </h2>
              </div>
              <span className="font-mono text-xs text-ink-muted">
                UNCERTAINTY BOUND: ±{simulationData.uncertaintyBoundPct}%
              </span>
            </div>

            {/* Impact Metric Cards */}
            {isSimulating ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border border-divider p-5 bg-surface-white space-y-3 shadow-xs">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    COMMUTER PLATFORM DELAY
                  </span>
                  <div className="font-serif text-4xl text-ink font-normal">
                    {simulationData.deltas.waitTimeDeltaPct}%
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Average passenger platform wait compressed from {simulationData.baseline.averageWaitTimeMinutes}m to {simulationData.simulated.averageWaitTimeMinutes}m.
                  </p>
                </div>

                <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    CROWDING RELIEF
                  </span>
                  <div className="font-serif text-4xl text-terracotta font-normal">
                    -{simulationData.deltas.crowdingReliefPoints} pts
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Cabin occupancy reduced from {simulationData.baseline.passengerLoadPercentage}% crush load to {simulationData.simulated.passengerLoadPercentage}% seated equilibrium.
                  </p>
                </div>

                <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    UNALLOCATED DEMAND RELIEF
                  </span>
                  <div className="font-serif text-4xl text-ink font-normal">
                    -{simulationData.deltas.unallocatedDemandReductionPct}%
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Commuters unable to board falls from {simulationData.baseline.unallocatedDemandPaxPerHour} to {simulationData.simulated.unallocatedDemandPaxPerHour} pax/hr.
                  </p>
                </div>

                <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    NET CO2 & NOX AVOIDED
                  </span>
                  <div className="font-serif text-4xl text-green-700 font-normal">
                    {simulationData.environmentalImpact.monthlyCo2OffsetTons} T/mo
                  </div>
                  <p className="text-sm text-ink-secondary leading-relaxed">
                    Displacing {formatNumber(simulationData.environmentalImpact.dieselCngReplacedKmDaily)} km of combustion bus runs daily with electric miles.
                  </p>
                </div>
              </div>
            )}

            {/* Plain-Language Scenario Explainability Dossier */}
            <div className="border border-divider bg-parchment/30 p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
                  PLAIN-LANGUAGE SCENARIO EXPLAINER
                </span>
                <span className="font-mono text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-200 uppercase font-medium">
                  EVIDENCE: SIMULATED (ADVISORY ONLY)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-surface-white border border-divider p-4 space-y-1.5 shadow-xs">
                  <div className="font-mono text-[10px] uppercase text-terracotta font-semibold">
                    1. WHAT DID YOU CHANGE?
                  </div>
                  <h4 className="font-serif text-sm font-medium text-ink">
                    Parameter Adjustments
                  </h4>
                  <p className="text-ink-secondary leading-relaxed">
                    You added <strong>{additionalBuses} electric buses</strong> to {selectedCorridor.name}, set the target headway between buses to <strong>{targetHeadway} minutes</strong>, and set transit signal preemption to <strong>{signalPriority ? 'ACTIVE' : 'OFF'}</strong>.
                  </p>
                </div>

                <div className="bg-surface-white border border-divider p-4 space-y-1.5 shadow-xs">
                  <div className="font-mono text-[10px] uppercase text-terracotta font-semibold">
                    2. WHAT DID THE MODEL CALCULATE?
                  </div>
                  <h4 className="font-serif text-sm font-medium text-ink">
                    Direct Analytical Results
                  </h4>
                  <p className="text-ink-secondary leading-relaxed">
                    Average platform waiting times dropped by <strong>{Math.abs(simulationData.deltas.waitTimeDeltaPct)}%</strong> ({simulationData.baseline.averageWaitTimeMinutes}m → {simulationData.simulated.averageWaitTimeMinutes}m) and vehicle crowding decreased by <strong>{simulationData.deltas.crowdingReliefPoints} points</strong>.
                  </p>
                </div>

                <div className="bg-surface-white border border-divider p-4 space-y-1.5 shadow-xs">
                  <div className="font-mono text-[10px] uppercase text-terracotta font-semibold">
                    3. WHAT DOES THIS MEAN FOR COMMUTERS?
                  </div>
                  <h4 className="font-serif text-sm font-medium text-ink">
                    Everyday Commute Impact
                  </h4>
                  <p className="text-ink-secondary leading-relaxed">
                    Commuters spend less time standing in Delhi&apos;s heat at bus stops, find seats more easily during rush hours, and benefit from <strong>{simulationData.environmentalImpact.monthlyCo2OffsetTons} tons</strong> of avoided carbon emissions per month.
                  </p>
                </div>

                <div className="bg-surface-white border border-divider p-4 space-y-1.5 shadow-xs">
                  <div className="font-mono text-[10px] uppercase text-terracotta font-semibold">
                    4. WHAT ASSUMPTIONS WERE USED?
                  </div>
                  <h4 className="font-serif text-sm font-medium text-ink">
                    Assumptions & Limitations
                  </h4>
                  <p className="text-ink-secondary leading-relaxed">
                    Based on Little&apos;s Law queue equilibrium (L = λW) and a calibrated Delhi transit price elasticity (ε = -0.38). This is a counterfactual advisory simulation; it does not model unplanned road floods or control actual physical vehicles.
                  </p>
                </div>
              </div>
            </div>

            {/* Governing Equations Block */}
            {simulationData.governingEquations && (
              <div className="p-5 border border-divider bg-ivory space-y-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
                  GOVERNING EQUATIONS & CONTINUITY CONSTRAINTS
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs text-ink">
                  {simulationData.governingEquations.map((eq, i) => (
                    <div key={i} className="p-3 border border-divider bg-surface-white">
                      {eq}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sensitivity Analysis Section */}
            {simulationData.sensitivityAnalysis && (
              <div className="border border-divider p-6 bg-ivory space-y-4">
                <div className="flex items-center justify-between border-b border-divider pb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                    PARAMETRIC SENSITIVITY ANALYSIS
                  </span>
                  <span className="font-mono text-[11px] text-ink-muted">
                    VARYING PASSENGER ELASTICITY & FLEET READINESS
                  </span>
                </div>
                <p className="text-sm text-ink-secondary leading-relaxed">
                  How projected cabin crowding responds when commuter elasticity to wait-time varies across literature-backed bounds:
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border border-divider">
                    <thead>
                      <tr className="bg-surface-white border-b border-divider text-ink-muted text-[11px] uppercase">
                        <th className="py-2 px-3">Elasticity Coefficient (ε)</th>
                        <th className="py-2 px-3 text-right">Projected Induced Commuters</th>
                        <th className="py-2 px-3 text-right">Projected Load Factor</th>
                        <th className="py-2 px-3 text-right">Equilibrium Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-divider bg-surface-white">
                      {simulationData.sensitivityAnalysis.byElasticity.map((s) => (
                        <tr
                          key={s.elasticity}
                          className={s.elasticity === -0.38 ? 'bg-parchment/40 font-medium' : ''}
                        >
                          <td className="py-2 px-3">
                            ε = {s.elasticity} {s.elasticity === -0.38 && '(Nominal Benchmark)'}
                          </td>
                          <td className="py-2 px-3 text-right text-ink">+{s.projectedInducedDemandPct}%</td>
                          <td className="py-2 px-3 text-right font-semibold text-terracotta">
                            {s.projectedOccupancyPercentage}%
                          </td>
                          <td className="py-2 px-3 text-right text-ink-muted">
                            {s.projectedOccupancyPercentage > 100 ? 'Standees Present' : 'Seated Guaranteed'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Assumptions & Limitations */}
            <div className="pt-4 border-t border-divider flex items-start space-x-3 text-xs text-ink-muted">
              <HelpCircle className="w-4 h-4 text-stone shrink-0 mt-0.5" />
              <div className="space-y-1 font-light leading-relaxed">
                <strong className="font-mono text-ink uppercase text-[11px] tracking-wider block">
                  EXPLICIT MODEL ASSUMPTIONS & LIMITATIONS:
                </strong>
                <ul className="list-disc pl-4 space-y-0.5">
                  {simulationData.modelAssumptions.map((assump, aIdx) => (
                    <li key={aIdx}>{assump}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      /* =========================================================================
          TAB 2: INSTITUTIONAL SCENARIO PLANNING (CAPITAL PORTFOLIO)
         ========================================================================= */
      <div className="space-y-8">
        {/* Editorial Heading */}
        <div className="border-b border-divider pb-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              INSTITUTIONAL DECISION SUPPORT / CAPITAL PROGRAMMING
            </span>
            <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 border border-amber-300">
              COUNTERFACTUAL EVALUATION
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-tight">
            Metropolitan Capital Interventions & Portfolio Analysis
          </h1>
          <p className="text-sm text-ink-muted font-light max-w-3xl leading-relaxed">
            Evaluate proposed multi-year transport investments against city-scale mobility barometers. Compare capital expenditure, commuter travel-time savings, emissions abatement, and spatial equity across Delhi NCT.
          </p>
        </div>

        {/* Official Advisory Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs flex items-center justify-between">
          <span>▲ ILLUSTRATIVE INTERVENTION · NOT AN APPROVED GOVERNMENT PROJECT. ADVISORY DECISION SUPPORT ONLY.</span>
          <span className="text-[11px] text-amber-800">READ-ONLY + PASSIVE + ADVISORY</span>
        </div>

        {/* Portfolio Cumulative KPIs */}
        {scenarioReport && scenarioReport.cumulativeImpact && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">AVG TIME SAVED</span>
              <div className="font-serif text-2xl text-ink font-normal">
                -{scenarioReport.cumulativeImpact.netTravelTimeReductionAvgMin} min
              </div>
              <span className="text-[11px] text-ink-muted">per commuter trip</span>
            </div>

            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">800M POP EXPANSION</span>
              <div className="font-serif text-2xl text-ink font-normal">
                +{formatNumber(scenarioReport.cumulativeImpact.netAdditionalPopCovered800mThousands)}k
              </div>
              <span className="text-[11px] text-ink-muted">citizens within walk</span>
            </div>

            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">ANNUAL CO2 SAVED</span>
              <div className="font-serif text-2xl text-green-700 font-normal">
                {formatNumber(scenarioReport.cumulativeImpact.netAnnualGhgAbatementTonnes)} T
              </div>
              <span className="text-[11px] text-ink-muted">tCO2e avoided/yr</span>
            </div>

            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">PORTFOLIO CAPEX</span>
              <div className="font-serif text-2xl text-terracotta font-normal">
                ₹{formatNumber(scenarioReport.cumulativeImpact.totalCapexCroresInr)} Cr
              </div>
              <span className="text-[11px] text-ink-muted">₹{scenarioReport.cumulativeImpact.totalOpexAnnualCroresInr} Cr/yr OPEX</span>
            </div>

            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">20-YR BENEFIT/COST</span>
              <div className="font-serif text-2xl text-ink font-normal">
                {scenarioReport.cumulativeImpact.compositeBcrRatio}x
              </div>
              <span className="text-[11px] text-ink-muted">discounted at r=8%</span>
            </div>

            <div className="p-4 border border-divider bg-surface-white space-y-1">
              <span className="font-mono text-[11px] text-ink-muted uppercase block">SPATIAL EQUITY INDEX</span>
              <div className="font-serif text-2xl text-terracotta font-normal">
                {scenarioReport.cumulativeImpact.overallEquityIndex}/100
              </div>
              <span className="text-[11px] text-ink-muted">periphery welfare bias</span>
            </div>
          </div>
        )}

        {/* Intervention Selection & Comparison Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-divider pb-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              PROPOSED INTERVENTIONS PORTFOLIO ({selectedInterventionIds.length} OF 4 ACTIVE)
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedInterventionIds(['intervention-brt-vikas-marg', 'intervention-skywalk-sarai-kale-khan', 'intervention-headway-synchronization', 'intervention-feeder-fleet-periphery'])}
                className="font-mono text-[11px] text-terracotta hover:underline uppercase"
              >
                Select All
              </button>
              <span className="text-divider">|</span>
              <button
                onClick={() => setSelectedInterventionIds([])}
                className="font-mono text-[11px] text-ink-muted hover:text-ink uppercase"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {scenarioReport?.availableInterventions?.map((intervention: any) => {
              const isSelected = selectedInterventionIds.includes(intervention.id);
              return (
                <div
                  key={intervention.id}
                  className={`border transition-all p-5 flex flex-col justify-between ${
                    isSelected
                      ? 'border-terracotta bg-surface-white shadow-sm'
                      : 'border-divider bg-parchment/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="font-mono text-[11px] text-terracotta uppercase tracking-wider block">
                          {intervention.category}
                        </span>
                        <h4 className="font-serif text-lg text-ink font-normal">
                          {intervention.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => {
                          if (isSelected) {
                            setSelectedInterventionIds(selectedInterventionIds.filter((id) => id !== intervention.id));
                          } else {
                            setSelectedInterventionIds([...selectedInterventionIds, intervention.id]);
                          }
                        }}
                        className={`p-1.5 border transition-colors ${
                          isSelected ? 'border-terracotta bg-terracotta text-surface-white' : 'border-divider bg-surface-white text-ink-muted'
                        }`}
                      >
                        {isSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                      </button>
                    </div>

                    <p className="text-sm text-ink-secondary leading-relaxed">
                      {intervention.shortDescription}
                    </p>

                    {/* Key Metrics Strip */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-divider/60 font-mono text-[11px]">
                      <div>
                        <span className="text-ink-muted block text-[11px]">CAPEX</span>
                        <span className="text-ink font-medium">₹{intervention.capexCroresInr} Cr</span>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[11px]">TIME SAVED</span>
                        <span className="text-terracotta font-medium">-{intervention.impactMetrics.travelTimeReductionAvgMin} min</span>
                      </div>
                      <div>
                        <span className="text-ink-muted block text-[11px]">20-YR BCR</span>
                        <span className="text-ink font-medium">{intervention.impactMetrics.benefitCostRatio20Yr}x</span>
                      </div>
                    </div>

                    {/* District Benefit Distribution */}
                    {intervention.districtBenefitDistribution && (
                      <div className="pt-2 border-t border-divider/40 space-y-1 font-mono text-[11px]">
                        <span className="text-ink-muted uppercase block">PRIMARY BENEFICIARY DISTRICTS:</span>
                        <div className="space-y-0.5">
                          {intervention.districtBenefitDistribution.map((d: any, dIdx: number) => (
                            <div key={dIdx} className="flex justify-between text-ink-muted">
                              <span>• {d.districtName} ({d.equityTier.replace('_', ' ')})</span>
                              <span className="text-ink">-{d.travelTimeReductionMin} min ({d.relativeWelfareSharePct}% share)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-divider/60 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                    <span>DURATION: {intervention.implementationDurationMonths} MONTHS</span>
                    <span className="text-terracotta font-medium">EQUITY SCORE: {intervention.impactMetrics.distributionalEquityScore}/100</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Ranking & Cost-Effectiveness Table */}
        {scenarioReport?.comparisonRanking && (
          <div className="border border-divider bg-surface-white p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-divider pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-ink font-semibold">
                INTERVENTION COST-EFFECTIVENESS & MULTI-CRITERIA RANKING
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                WEIGHTED: 40% BCR • 35% EQUITY • 25% COMMUTER DELAY
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-divider">
                <thead>
                  <tr className="bg-parchment/40 border-b border-divider text-ink-muted text-[11px] uppercase">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Intervention Project</th>
                    <th className="py-2.5 px-3">Primary Strategic Strength</th>
                    <th className="py-2.5 px-3 text-right">Composite Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-divider bg-surface-white">
                  {scenarioReport.comparisonRanking.map((r: any) => (
                    <tr key={r.rank}>
                      <td className="py-2 px-3 font-semibold text-terracotta">#{r.rank}</td>
                      <td className="py-2 px-3 font-medium text-ink">{r.interventionName}</td>
                      <td className="py-2 px-3 text-ink-muted text-[11px]">{r.primaryStrength}</td>
                      <td className="py-2 px-3 text-right font-bold text-ink">{r.costEffectivenessScore} / 100</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    )}
      </main>

      <Footer />
    </div>
  );
}
