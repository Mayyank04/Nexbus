'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { Magnetic } from '@/components/ui/magnetic';
import {
  Database,
  GitBranch,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Sliders,
  Sparkles,
  BarChart,
  Network,
} from 'lucide-react';

interface MethodStage {
  step: string;
  name: string;
  category: 'Observed' | 'Estimated' | 'Predicted' | 'Hypothetical';
  categoryColor: string;
  headline: string;
  description: string;
  formula: string;
  inputs: string[];
  outputs: string[];
  latency: string;
}

const METHODOLOGY_STAGES: MethodStage[] = [
  {
    step: '01',
    name: 'Ticket Data Ingestion',
    category: 'Observed',
    categoryColor: 'bg-green-100 text-green-800 border-green-300',
    headline: 'Continuous Streaming of ETM Electronic Transactions',
    description:
      'Every DTC conductor electronic ticketing machine (ETM) generates encrypted transaction packets upon ticket issuance. Each event logs a monotonic ticket counter, stage code, route ID, fare denomination, and bus registration ID.',
    formula: 'T_{p} = \\langle ID_{ticket}, t_{stamp}, Stage_{board}, Fare, Bus_{id} \\rangle',
    inputs: ['4,280 Daily Conductor ETM Terminals', 'Depot Sync Wi-Fi Hotspots', 'NCMC Smartcard Taps'],
    outputs: ['Validated Boarding Event Stream (4.28M records/day)'],
    latency: 'Sub-minute batching (cellular + depot dock)',
  },
  {
    step: '02',
    name: 'GTFS & Spatial Alignment',
    category: 'Observed',
    categoryColor: 'bg-green-100 text-green-800 border-green-300',
    headline: 'Conflating AVL GPS Beacons to Delhi Street Graph',
    description:
      'Raw GPS pings from onboard telematics units arrive with multipath urban drift (10-30m accuracy). An emission-transition Hidden Markov Model (HMM) snaps erratic pings to Delhi OpenStreetMap road centerlines and scheduled GTFS stop sequences.',
    formula: 'P(r_{t} \\mid z_{1:T}) \\propto P(z_{t} \\mid r_{t}) \\sum_{r_{t-1}} P(r_{t} \\mid r_{t-1}) P(r_{t-1})',
    inputs: ['5-Second AVL GPS Pings', 'DTC GTFS Static Schedules', 'OSM Road Centerlines'],
    outputs: ['Snapped Spatial Vehicle Trajectory & Inter-Stop Run Times'],
    latency: '<3.2 seconds streaming latency',
  },
  {
    step: '03',
    name: 'Trip & Journey Reconstruction',
    category: 'Estimated',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    headline: 'Unsupervised Passenger Alighting Inference (Trip Chaining)',
    description:
      'Because DTC buses do not enforce tap-out upon alighting, passenger drop-off locations are unobserved. NEXBUS applies iterative trip chaining: assuming commuter return journeys start where their preceding trip concluded, inferring alighting stops.',
    formula: '\\arg\\min_{s_{alight}} \\mathcal{D}\\left(Coord(s_{alight}), Coord(s_{next\\_origin})\\right)',
    inputs: ['ETM Boarding Stream', 'Smartcard Pass Identifier Hashes', 'Historical Commuter Clusters'],
    outputs: ['Reconstructed Full Passenger Journeys (Origin-Destination Pairs)'],
    latency: 'Batch computed overnight (94.2% validation score)',
  },
  {
    step: '04',
    name: 'Passenger Load Reconstruction',
    category: 'Estimated',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    headline: 'Cumulative In-Vehicle Occupancy Tracking',
    description:
      'For each individual bus trip along a route, in-vehicle passenger load is tracked sequentially by balancing boarding counts against inferred alighting counts at each consecutive stop node.',
    formula: 'L_{k} = L_{k-1} + Boarding_{k} - Alighting_{k}, \\quad 0 \\le L_{k} \\le Cap_{max}',
    inputs: ['Stop Boarding Counts', 'Inferred Alighting Counts', 'Vehicle Seating/Standing Limits'],
    outputs: ['Segment Occupancy Factor (e.g. 1.25 = 125% capacity)'],
    latency: '15-minute rolling window aggregation',
  },
  {
    step: '05',
    name: 'Segment Aggregation & Velocity Profiling',
    category: 'Estimated',
    categoryColor: 'bg-amber-100 text-amber-800 border-amber-300',
    headline: 'Harmonizing Multi-Trip Corridors into Urban Conduits',
    description:
      'Where multiple routes share common arterial roads (such as Ring Road or Aurobindo Marg), individual vehicle runs are harmonized into unified corridor segments, computing weighted average velocity and punctuality.',
    formula: '\\bar{V}_{seg} = \\frac{\\sum_{i} d_{seg}}{\\sum_{i} \\Delta t_{i, seg}}',
    inputs: ['Individual Trip Segments', 'Corridor Topology Definitions'],
    outputs: ['Corridor Congestion Indices & Fleet Velocity Heatmaps'],
    latency: 'Hourly corridor profile refresh',
  },
  {
    step: '06',
    name: 'Crowding Prediction (ST-GNN)',
    category: 'Predicted',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-300',
    headline: 'Spatio-Temporal Graph Neural Networks for Future Demand',
    description:
      'A deep neural network models Delhi’s transit stops as nodes and roads as edges. Spatial graph convolutions capture topological spillover, while Gated Recurrent Units (GRUs) predict passenger volume across 15, 30, and 45-minute horizons.',
    formula: 'H^{(l+1)} = \\sigma\\left(\\tilde{D}^{-\\frac{1}{2}} \\tilde{A} \\tilde{D}^{-\\frac{1}{2}} H^{(l)} W^{(l)}\\right)',
    inputs: ['Rolling 2-Hour Load Graph', 'Weather / Rain Sensors', 'Event Calenders & Day-of-Week'],
    outputs: ['Forecasted Segment Load Percentage & Crowding Risk Level'],
    latency: '124 ms model forward inference',
  },
  {
    step: '07',
    name: 'Confidence Interval Estimation',
    category: 'Predicted',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-300',
    headline: 'Quantifying Uncertainty via Bayesian Calibrated Intervals',
    description:
      'Predictions are never presented as deceptive single numbers. NEXBUS generates 80% and 95% Bayesian credible intervals so dispatchers know whether high load is an expected peak or an anomalous surge.',
    formula: '\\mathcal{CI}_{95} = \\left[ \\hat{\\mu} - 1.96 \\cdot \\hat{\\sigma}_{epi}, \\; \\hat{\\mu} + 1.96 \\cdot \\hat{\\sigma}_{epi} \\right]',
    inputs: ['Monte Carlo Dropout Ensembles', 'Historical Residual Variance'],
    outputs: ['80% and 95% Expected Load Boundaries'],
    latency: 'Computed in tandem with prediction',
  },
  {
    step: '08',
    name: 'Multi-Criteria Journey Optimization',
    category: 'Predicted',
    categoryColor: 'bg-blue-100 text-blue-800 border-blue-300',
    headline: 'Pareto-Optimal Routing (Fastest, Balanced, Comfort First)',
    description:
      'Unlike classic Dijkstra routing that treats time in a vacuum, our custom RAPTOR algorithm searches the Pareto frontier across three orthogonal commuter preferences: absolute travel duration, transfer friction, and predicted cabin crowding.',
    formula: '\\min_{\\pi} \\left\\{ \\text{Duration}(\\pi), \\; \\text{Transfers}(\\pi), \\; \\mathbb{E}[\\text{Crowd}(\\pi)] \\right\\}',
    inputs: ['Real-Time Predicted Crowding', 'GTFS Timetables', 'Pedestrian Walk Speed (1.2 m/s)'],
    outputs: ['Three Distinct Recommendation Options (Fastest, Balanced, Comfort)'],
    latency: '<80 ms per origin-destination query',
  },
  {
    step: '09',
    name: 'Counterfactual Simulation Lab',
    category: 'Hypothetical',
    categoryColor: 'bg-purple-100 text-purple-800 border-purple-300',
    headline: 'Agent-Based Micro-Simulation of Transit Interventions',
    description:
      'Allows planners to test hypotheticals (e.g. adding 15 electric buses to Ring Road) using an agent-based commuter micro-simulation. Calculates passenger wait-time reduction, mode shift from private vehicles, and avoided CO2 emissions.',
    formula: '\\Delta Wait = \\frac{1}{2} \\left( \\frac{1}{f_{base}} - \\frac{1}{f_{hypo}} \\right) \\cdot (1 - \\beta_{elasticity})',
    inputs: ['Hypothetical Headway / Fleet Inputs', 'Baseline OD Demand Matrix', 'Corridor Signal Parameters'],
    outputs: ['Wait Time Deltas, Crowding Relief, CO2 Savings, Affected Corridors'],
    latency: 'Interactive scenario computation (~350 ms)',
  },
];

export default function MethodologyPage() {
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const activeStage = METHODOLOGY_STAGES[activeStageIndex];

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full space-y-16">
        {/* Editorial Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              SYSTEM METHODOLOGY / COMPUTATIONAL PIPELINE
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.02] tracking-tight">
            From ticket tap to urban foresight.
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary font-normal leading-relaxed pt-1">
            The complete 9-stage engineering architecture powering NEXBUS. We strictly categorize every datum into four epistemological tiers: Observed, Estimated, Predicted, or Hypothetical.
          </p>

          {/* Epistemological Tier Legend */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 font-mono text-xs">
            <span className="px-2.5 py-1 bg-green-50 text-green-800 border border-green-300">
              ● OBSERVED (Hardware Sensor Pings)
            </span>
            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-300">
              ▲ ESTIMATED (Statistical Imputation)
            </span>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-300">
              ◆ PREDICTED (Neural Graph Models)
            </span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-300">
              ★ HYPOTHETICAL (Counterfactual Sims)
            </span>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE PIPELINE STAGES EXPLORER
           ========================================================================= */}
        <ScrollReveal delay={0.1}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Step Index List */}
            <div className="lg:col-span-5 space-y-2 border border-[#DED5C8] bg-[#FCFAF6] p-4 shadow-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block mb-3 px-2">
                PIPELINE STAGES (01 — 09)
              </span>

              {METHODOLOGY_STAGES.map((stage, idx) => {
                const isSelected = activeStageIndex === idx;
                return (
                  <div
                    key={stage.step}
                    onClick={() => setActiveStageIndex(idx)}
                    className={`p-3.5 border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-terracotta bg-ivory shadow-sm -translate-y-0.5'
                        : 'border-[#DED5C8]/70 bg-ivory/60 hover:bg-ivory hover:border-stone'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-xs font-semibold text-terracotta">
                        {stage.step}
                      </span>
                      <div>
                        <h4 className="font-serif text-base text-ink font-normal leading-snug">
                          {stage.name}
                        </h4>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 border ${stage.categoryColor}`}
                    >
                      {stage.category}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right: Detailed Stage Inspector */}
            <div className="lg:col-span-7 border border-[#DED5C8] bg-[#FCFAF6] p-8 shadow-sm space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStage.step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between border-b border-[#DED5C8] pb-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs text-terracotta font-medium">
                          STAGE {activeStage.step} OF 09
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 border ${activeStage.categoryColor}`}
                        >
                          {activeStage.category} Data Tier
                        </span>
                      </div>
                      <h3 className="font-serif text-3xl font-normal text-ink mt-1">
                        {activeStage.headline}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-ink-light leading-relaxed font-light">
                    {activeStage.description}
                  </p>

                  {/* Mathematical Model Formula Block */}
                  <div className="p-4 border border-[#DED5C8] bg-ivory space-y-1">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                      GOVERNING MATHEMATICAL OPERATOR
                    </span>
                    <div className="font-mono text-sm text-ink font-medium overflow-x-auto py-1">
                      {activeStage.formula}
                    </div>
                  </div>

                  {/* Inputs & Outputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-[#DED5C8] bg-ivory space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                        DATA INPUTS
                      </span>
                      <ul className="space-y-1 text-xs text-ink-light">
                        {activeStage.inputs.map((inp, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone" />
                            <span>{inp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 border border-[#DED5C8] bg-ivory space-y-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                        DERIVED OUTPUTS
                      </span>
                      <ul className="space-y-1 text-xs text-ink-light">
                        {activeStage.outputs.map((out, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                            <span className="font-medium text-ink">{out}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DED5C8] flex items-center justify-between font-mono text-xs text-ink-muted">
                    <span>LATENCY: {activeStage.latency}</span>
                    <span className="text-terracotta">STANDARDS: GTFS-RT / W3C OPEN DATA</span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </ScrollReveal>

        {/* Global Architecture Diagram */}
        <ScrollReveal delay={0.2}>
          <section className="border border-[#DED5C8] bg-[#FCFAF6] p-8 sm:p-12 space-y-6 shadow-sm">
            <div className="max-w-2xl space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                SYSTEM TOPOLOGY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                End-to-End Computational Architecture
              </h2>
              <p className="text-xs text-ink-muted font-light leading-relaxed">
                How edge sensors, spatial conflation engines, and deep neural graphs interact across the NEXBUS stack.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs pt-4">
              <div className="border border-[#DED5C8] bg-ivory p-5 space-y-3">
                <span className="text-terracotta font-semibold block">01 / EDGE INGESTION</span>
                <h4 className="font-serif text-lg text-ink font-normal">DTC Hardware</h4>
                <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                  4,280 GPS AVL beacons and electronic ticketing ETMs transmit high-frequency telemetry via secure APN cellular networks.
                </p>
              </div>

              <div className="border border-[#DED5C8] bg-ivory p-5 space-y-3">
                <span className="text-terracotta font-semibold block">02 / SPATIAL GRAPH</span>
                <h4 className="font-serif text-lg text-ink font-normal">Map Conflation</h4>
                <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                  Hidden Markov Models map-match noisy trajectories to high-precision Delhi OSM centerlines and route geometries.
                </p>
              </div>

              <div className="border border-[#DED5C8] bg-ivory p-5 space-y-3">
                <span className="text-terracotta font-semibold block">03 / INFERENCE ENGINE</span>
                <h4 className="font-serif text-lg text-ink font-normal">ST-GNN Predictor</h4>
                <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                  Graph neural network computes multi-horizon crowding forecasts and Bayesian confidence bounds with &lt;140ms latency.
                </p>
              </div>

              <div className="border border-[#DED5C8] bg-ivory p-5 space-y-3">
                <span className="text-terracotta font-semibold block">04 / APPLICATION LAYER</span>
                <h4 className="font-serif text-lg text-ink font-normal">3D Digital Twin</h4>
                <p className="text-[11px] text-ink-muted leading-relaxed font-sans">
                  Hardware-accelerated Three.js viewport provides interactive exploration, multi-criteria routing, and policy simulations.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Navigation to Platform */}
        <ScrollReveal delay={0.25}>
          <div className="border border-[#DED5C8] p-8 bg-[#FCFAF6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Experience the methodology in action
              </h3>
              <p className="text-xs text-ink-muted mt-1 font-light">
                Explore Delhi&apos;s real-time digital twin or run a counterfactual policy simulation.
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Magnetic intensity={0.2}>
                <Link
                  href="/twin"
                  className="px-5 py-2.5 bg-ink text-ivory text-xs font-mono uppercase tracking-wider hover:bg-terracotta transition-colors shadow-sm inline-block"
                >
                  Launch Twin
                </Link>
              </Magnetic>
              <Magnetic intensity={0.2}>
                <Link
                  href="/simulate"
                  className="px-5 py-2.5 border border-ink text-ink text-xs font-mono uppercase tracking-wider hover:bg-parchment transition-colors inline-block"
                >
                  Simulate Network
                </Link>
              </Magnetic>
            </div>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
