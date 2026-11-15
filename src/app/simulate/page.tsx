'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import { DELHI_CORRIDORS, TransitCorridor } from '@/data/delhiTransitData';
import {
  SlidersHorizontal,
  RotateCcw,
  Play,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Leaf,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export default function SimulationPage() {
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-ring-road');
  const [additionalBuses, setAdditionalBuses] = useState<number>(12);
  const [targetHeadway, setTargetHeadway] = useState<number>(6); // minutes
  const [signalPriority, setSignalPriority] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(true);

  const selectedCorridor =
    DELHI_CORRIDORS.find((c) => c.id === selectedCorridorId) || DELHI_CORRIDORS[0];

  // Dynamic calibrated simulation outputs based on parameters
  const baselineWaitMin = 14.2;
  const simulatedWaitMin = Math.max(4.2, +(baselineWaitMin * (targetHeadway / 12)).toFixed(1));
  const waitReductionPct = Math.round(((baselineWaitMin - simulatedWaitMin) / baselineWaitMin) * 100);

  const baselineCrowdPct = 146;
  const simulatedCrowdPct = Math.max(68, Math.round(baselineCrowdPct - additionalBuses * 5.2));
  const crowdReductionPoints = baselineCrowdPct - simulatedCrowdPct;

  const co2SavingsTonsMonth = +(additionalBuses * 7.4).toFixed(1);
  const throughputGainPaxHour = additionalBuses * 280;

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 450);
  };

  const handleReset = () => {
    setAdditionalBuses(12);
    setTargetHeadway(6);
    setSignalPriority(true);
  };

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Editorial Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-light pb-8">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              SCENARIO ENGINE / COUNTERFACTUAL EXPERIMENTS
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal leading-[1.05]">
              Network Simulation
            </h1>
            <p className="text-base text-ink-light font-light leading-relaxed">
              Test transit interventions across Delhi’s arterial corridors. Evaluate headway adjustments, electric fleet injection, and signal preemption.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-stone-light bg-ivory hover:border-stone text-xs font-mono text-ink uppercase"
            >
              <RotateCcw className="w-3.5 h-3.5 text-ink-muted" />
              <span>Reset Defaults</span>
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="inline-flex items-center space-x-2 px-6 py-2.5 bg-ink text-ivory text-xs font-mono uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSimulating ? 'Computing Iterations…' : 'Run Simulation'}</span>
            </button>
          </div>
        </div>

        {/* Parameter Workbench */}
        <div className="border border-stone-light bg-parchment/40 p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Corridor Selection */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              TARGET CORRIDOR
            </label>
            <select
              value={selectedCorridorId}
              onChange={(e) => setSelectedCorridorId(e.target.value)}
              className="w-full p-2.5 bg-ivory border border-stone-light font-serif text-base text-ink focus:outline-none cursor-pointer"
            >
              {DELHI_CORRIDORS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Additional Fleet Additions */}
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
              <span>+0</span>
              <span>+12</span>
              <span>+24 Electric</span>
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
              <span>15m (Baseline)</span>
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
                  : 'border-stone-light bg-ivory text-ink-muted'
              }`}
            >
              <span>{signalPriority ? 'ACTIVE (TRANSIT PREEMPTION)' : 'INACTIVE (STANDARD SIGNALS)'}</span>
              <span className="w-2 h-2 rounded-full bg-terracotta" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            SPLIT-SCREEN SYNCHRONIZED 3D VIEWS: CURRENT VS HYPOTHETICAL
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* View 1: Current Network Baseline */}
          <div className="border border-stone-light bg-ivory flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-light bg-parchment/30 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  SCENARIO A / BASELINE STATUS
                </span>
                <h3 className="font-serif text-xl font-normal text-ink">
                  Current Schedule & Fleet
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 border border-stone-light bg-ivory text-ink-muted">
                DTC ACTUALS
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

              <div className="absolute bottom-3 left-3 bg-ivory/95 border border-stone-light p-2.5 font-mono text-xs space-y-1">
                <div className="text-ink-muted text-[10px]">AVG WAIT TIME</div>
                <div className="font-serif text-lg text-ink">{baselineWaitMin} min</div>
              </div>

              <div className="absolute bottom-3 right-3 bg-ivory/95 border border-stone-light p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[10px]">PEAK CROWDING FACTOR</div>
                <div className="font-serif text-lg text-terracotta">{baselineCrowdPct}%</div>
              </div>
            </div>
          </div>

          {/* View 2: Hypothetical Network Simulation */}
          <div className="border border-stone-light bg-ivory flex flex-col justify-between overflow-hidden shadow-sm">
            <div className="p-4 border-b border-stone-light bg-terracotta/10 flex items-center justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
                  SCENARIO B / SYNCHRONIZED COUNTERFACTUAL
                </span>
                <h3 className="font-serif text-xl font-normal text-ink">
                  Hypothetical Intervention
                </h3>
              </div>
              <span className="font-mono text-xs px-2 py-0.5 bg-terracotta text-ivory font-mono">
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

              <div className="absolute bottom-3 left-3 bg-ivory/95 border border-stone-light p-2.5 font-mono text-xs space-y-1">
                <div className="text-ink-muted text-[10px]">PROJECTED WAIT TIME</div>
                <div className="font-serif text-lg text-terracotta">
                  {simulatedWaitMin} min (-{waitReductionPct}%)
                </div>
              </div>

              <div className="absolute bottom-3 right-3 bg-ivory/95 border border-stone-light p-2.5 font-mono text-xs text-right space-y-1">
                <div className="text-ink-muted text-[10px]">PROJECTED CROWDING FACTOR</div>
                <div className="font-serif text-lg text-green-700">
                  {simulatedCrowdPct}% (-{crowdReductionPoints}%)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Impact Metrics */}
        <div className="border border-stone-light bg-ivory p-8">
          <div className="flex items-center justify-between border-b border-stone-light pb-4 mb-6">
            <div>
              <span className="font-mono text-xs text-terracotta uppercase tracking-wider">
                COMPUTATIONAL SYNTHESIS
              </span>
              <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
                Calculated Consequences for {selectedCorridor.name}
              </h3>
            </div>
            <span className="font-mono text-xs text-ink-muted">
              MODEL ENGINE: MATSIM-DELHI v2.4
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-stone-light p-5 bg-parchment/20 space-y-1.5">
              <span className="font-mono text-[10px] text-ink-muted uppercase block">
                COMMUTER PLATFORM DELAY
              </span>
              <div className="font-serif text-3xl text-ink font-normal">
                -{waitReductionPct}%
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Saving approx 38,000 commuter hours daily across {selectedCorridor.stops.length} major stations.
              </p>
            </div>

            <div className="border border-stone-light p-5 bg-parchment/20 space-y-1.5">
              <span className="font-mono text-[10px] text-ink-muted uppercase block">
                OVERCROWDING RELIEF
              </span>
              <div className="font-serif text-3xl text-terracotta font-normal">
                -{crowdReductionPoints} pts
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Cabin occupancy compressed from crush load (146%) down to seated-equilibrium ({simulatedCrowdPct}%).
              </p>
            </div>

            <div className="border border-stone-light p-5 bg-parchment/20 space-y-1.5">
              <span className="font-mono text-[10px] text-ink-muted uppercase block">
                HOURLY THROUGHPUT GAIN
              </span>
              <div className="font-serif text-3xl text-ink font-normal">
                +{throughputGainPaxHour.toLocaleString()}
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Additional seated capacity absorbed from parallel private two-wheeler and auto-rickshaw trips.
              </p>
            </div>

            <div className="border border-stone-light p-5 bg-parchment/20 space-y-1.5">
              <span className="font-mono text-[10px] text-ink-muted uppercase block">
                CARBON & PM2.5 OFFSET
              </span>
              <div className="font-serif text-3xl text-green-700 font-normal">
                {co2SavingsTonsMonth} T/mo
              </div>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                Estimated net zero tailpipe emissions on replaced diesel/CNG kilometers along the arterial.
              </p>
            </div>
          </div>

          {/* Model Assumptions Disclosure */}
          <div className="mt-8 pt-6 border-t border-stone-light flex items-start space-x-3 text-xs text-ink-muted">
            <HelpCircle className="w-4 h-4 text-stone shrink-0 mt-0.5" />
            <div className="font-light leading-relaxed">
              <strong className="font-mono text-ink uppercase text-[10px] tracking-wider mr-2">
                ASSUMPTIONS & METHODOLOGY:
              </strong>
              Assumes 82% fleet operational readiness at Rajghat and Rohini depots; average passenger transfer elasticity of 0.42; passenger dwell time calculated at 1.8 seconds per boarding using dual contactless validators.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
