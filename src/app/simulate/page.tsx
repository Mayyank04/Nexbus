'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
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
} from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';

export default function SimulationLabPage() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-ring-road');
  const [additionalBuses, setAdditionalBuses] = useState<number>(12);
  const [targetHeadway, setTargetHeadway] = useState<number>(6); // minutes
  const [signalPriority, setSignalPriority] = useState<boolean>(true);
  const [timeWindow, setTimeWindow] = useState<string>('evening_peak');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SimulationResultResponse['scenario'] | null>(null);

  const selectedCorridor =
    DELHI_CORRIDORS.find((c) => c.id === selectedCorridorId) || DELHI_CORRIDORS[0];

  const handleRunSimulation = async () => {
    setIsSimulating(true);
    const result = await runSimulationEvaluation(
      selectedCorridorId,
      additionalBuses,
      targetHeadway,
      signalPriority
    );
    if (result && result.scenario) {
      setSimulationData(result.scenario);
    }
    setIsSimulating(false);
  };

  useEffect(() => {
    handleRunSimulation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCorridorId]);

  const handleReset = () => {
    setAdditionalBuses(12);
    setTargetHeadway(6);
    setSignalPriority(true);
    setTimeWindow('evening_peak');
    handleRunSimulation();
  };

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-divider pb-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              SCENARIO LAB / COUNTERFACTUAL EXPERIMENTS
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal leading-[1.05]">
              What if the network worked differently?
            </h1>
            <p className="text-base text-ink-muted font-light leading-relaxed">
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

        {/* Elegant Scenario Editor Controls */}
        <div className="border border-divider bg-surface-white p-6 grid grid-cols-1 md:grid-cols-4 gap-6 shadow-sm">
          {/* Target Corridor */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
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
            <div className="flex justify-between font-mono text-[10px] text-ink-muted">
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
            <div className="flex justify-between font-mono text-[9px] text-ink-muted">
              <span>+0 (Baseline)</span>
              <span>+12 EV</span>
              <span>+24 EV Fleet</span>
            </div>
          </div>

          {/* Target Headway */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-[10px] text-ink-muted">
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
            <div className="flex justify-between font-mono text-[9px] text-ink-muted">
              <span>4m (High Freq)</span>
              <span>12m (Baseline)</span>
            </div>
          </div>

          {/* Transit Signal Priority Toggle */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
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
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  SCENARIO A / OBSERVED BASELINE
                </span>
                <h3 className="font-serif text-xl font-normal text-ink">
                  Current Network & Fleet
                </h3>
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
                <div className="text-ink-muted text-[10px]">AVG WAIT TIME</div>
                <div className="font-serif text-lg text-ink">
                  {simulationData ? `${simulationData.baseline.averageWaitTimeMinutes} min` : '14.2 min'}
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[10px]">PEAK CROWD LOAD</div>
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
                <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
                  SCENARIO B / PROPOSED INTERVENTION
                </span>
                <h3 className="font-serif text-xl font-normal text-ink">
                  Proposed Fleet & Headways
                </h3>
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
                <div className="text-ink-muted text-[10px]">PROJECTED WAIT TIME</div>
                <div className="font-serif text-lg text-terracotta">
                  {simulationData
                    ? `${simulationData.simulated.averageWaitTimeMinutes} min (${simulationData.deltas.waitTimeDeltaPct}%)`
                    : '6.2 min (-56%)'}
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-surface-white/95 border border-divider p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[10px]">PROJECTED CROWD LOAD</div>
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
                <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
                  Calculated Consequences for {selectedCorridor.name}
                </h3>
              </div>
              <span className="font-mono text-xs text-ink-muted">
                UNCERTAINTY BOUND: ±{simulationData.uncertaintyBoundPct}%
              </span>
            </div>

            {/* Impact Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                <span className="font-mono text-[10px] text-ink-muted uppercase block">
                  COMMUTER PLATFORM DELAY
                </span>
                <div className="font-serif text-4xl text-ink font-normal">
                  {simulationData.deltas.waitTimeDeltaPct}%
                </div>
                <p className="text-xs text-ink-muted font-light leading-relaxed">
                  Average passenger platform wait compressed from {simulationData.baseline.averageWaitTimeMinutes}m to {simulationData.simulated.averageWaitTimeMinutes}m.
                </p>
              </div>

              <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                <span className="font-mono text-[10px] text-ink-muted uppercase block">
                  CROWDING RELIEF
                </span>
                <div className="font-serif text-4xl text-terracotta font-normal">
                  -{simulationData.deltas.crowdingReliefPoints} pts
                </div>
                <p className="text-xs text-ink-muted font-light leading-relaxed">
                  Cabin occupancy reduced from {simulationData.baseline.passengerLoadPercentage}% crush load to {simulationData.simulated.passengerLoadPercentage}% seated equilibrium.
                </p>
              </div>

              <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                <span className="font-mono text-[10px] text-ink-muted uppercase block">
                  UNALLOCATED DEMAND RELIEF
                </span>
                <div className="font-serif text-4xl text-ink font-normal">
                  -{simulationData.deltas.unallocatedDemandReductionPct}%
                </div>
                <p className="text-xs text-ink-muted font-light leading-relaxed">
                  Commuters unable to board falls from {simulationData.baseline.unallocatedDemandPaxPerHour} to {simulationData.simulated.unallocatedDemandPaxPerHour} pax/hr.
                </p>
              </div>

              <div className="border border-divider p-5 bg-parchment/20 space-y-1.5">
                <span className="font-mono text-[10px] text-ink-muted uppercase block">
                  NET CO2 & NOX AVOIDED
                </span>
                <div className="font-serif text-4xl text-green-700 font-normal">
                  {simulationData.environmentalImpact.monthlyCo2OffsetTons} T/mo
                </div>
                <p className="text-xs text-ink-muted font-light leading-relaxed">
                  Displacing {simulationData.environmentalImpact.dieselCngReplacedKmDaily.toLocaleString()} km of combustion bus runs daily with electric miles.
                </p>
              </div>
            </div>

            {/* Assumptions & Limitations */}
            <div className="pt-4 border-t border-divider flex items-start space-x-3 text-xs text-ink-muted">
              <HelpCircle className="w-4 h-4 text-stone shrink-0 mt-0.5" />
              <div className="space-y-1 font-light leading-relaxed">
                <strong className="font-mono text-ink uppercase text-[10px] tracking-wider block">
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
      </main>
    </div>
  );
}
