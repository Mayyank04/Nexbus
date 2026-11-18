'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DelhiCityCanvas, { CameraPreset } from '@/components/3d/DelhiCityCanvas';
import { DELHI_CORRIDORS, DELHI_STOPS, TransitCorridor, BusStop } from '@/data/delhiTransitData';
import { formatPax, formatNumber } from '@/lib/utils/formatters';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';
import {
  ArrowUpRight,
  Compass,
  Layers,
  Activity,
  Clock,
  ShieldCheck,
  ChevronDown,
  Zap,
  MapPin,
  TrendingDown,
  Users,
  Cpu,
  ArrowRight,
  Bus,
  Train,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { level } = useExperienceLevel();
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white">
      <Navbar />

      {/* =========================================================================
          HERO SECTION: ARCHITECTURAL SPATIAL INTELLIGENCE EXPERIENCE
         ========================================================================= */}
      <section className="relative w-full border-b border-divider min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-6 sm:pt-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
          {/* Left Narrative Composition (45% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between z-10 py-1">
            <div className="space-y-5">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="font-mono text-xs text-ink-secondary">
                  {level === 'easy'
                    ? 'Explore Delhi Transit · Simple & Accessible'
                    : level === 'commuter'
                    ? 'Delhi Commuter Intelligence · Arterial Networks'
                    : 'Metropolitan Decision-Support System / NCT of Delhi'}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl leading-[1.0] tracking-tight text-ink font-normal">
                {level === 'easy' ? (
                  <>
                    How Delhi Moves —
                    <br />
                    <span className="text-terracotta">Explained</span> for Everyone.
                  </>
                ) : level === 'commuter' ? (
                  <>
                    Faster, Smarter
                    <br />
                    <span className="text-terracotta">Commutes</span> Across Delhi.
                  </>
                ) : (
                  <>
                    Urban Mobility
                    <br />
                    <span className="text-terracotta">Intelligence</span> for Delhi.
                  </>
                )}
              </h1>

              <p className="text-sm sm:text-base text-ink-secondary leading-relaxed max-w-lg pt-1 font-normal break-words">
                {level === 'easy'
                  ? 'Explore buses and metro trains on an interactive 3D map of our capital city. See where routes travel, check which times are crowded, and plan easy journeys without confusion.'
                  : level === 'commuter'
                  ? 'Real-time crowding insights, multimodal metro-bus transfers, and reliable schedule predictions across 3,840 connected transit vehicles.'
                  : 'Empirical digital twin and advisory decision-support for the National Capital Territory. Reconciling real-time vehicle headways, corridor crowding thresholds, and multimodal transfers across 3,840 connected buses.'}
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/twin"
                  className="inline-flex items-center space-x-2 px-5 py-3 bg-ink text-surface-white text-xs tracking-wider uppercase font-mono font-medium hover:bg-terracotta transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <span>Explore Spatial Twin</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/journey"
                  className="inline-flex items-center space-x-2 px-5 py-3 border border-ink text-ink text-xs tracking-wider uppercase font-mono font-medium bg-surface-white hover:bg-parchment transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <span>Plan A Journey</span>
                </Link>
              </div>
            </div>

            {/* Viewfinder Perspective Controls */}
            <div className="pt-6 border-t border-divider mt-6 space-y-2.5">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="uppercase tracking-wider text-ink-muted">
                  CAMERA VIEWPORT
                </span>
                <span className="text-terracotta uppercase">
                  3D SPATIAL MODEL
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full min-w-0">
                {(
                  [
                    { id: 'overview', label: '01 Macro Overview' },
                    { id: 'corridor', label: '02 Ring Spine' },
                    { id: 'street', label: '03 Radial Axis' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePreset(item.id)}
                    className={`font-mono text-xs py-2 px-2.5 text-left border transition-all truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                      activePreset === item.id
                        ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                        : 'border-divider bg-surface-white text-ink-secondary hover:text-ink hover:border-stone'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D Visual Centerpiece (55% width on desktop) */}
          <div className="lg:col-span-7 relative min-h-[460px] lg:min-h-[580px] flex items-center justify-center border border-divider bg-parchment/40 overflow-hidden shadow-inner">
            {/* Master 3D Viewport */}
            <DelhiCityCanvas
              preset={activePreset}
              activeCorridorId={selectedCorridor?.id}
              activeStopId={selectedStop?.id}
              onSelectStop={(stop) => setSelectedStop(stop)}
              interactive={true}
              className="w-full h-full min-h-[460px] lg:min-h-[580px]"
            />

            {/* Restrained Hairline Annotations */}
            <div className="hidden sm:block absolute top-4 left-4 pointer-events-none">
              <div className="bg-surface-white/95 border border-divider px-3 py-1.5 shadow-sm space-y-0.5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  NETWORK TOPOLOGY
                </div>
                <div className="font-mono text-xs font-semibold text-ink">
                  DELHI METROPOLITAN ARTERIALS
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute top-4 right-4 pointer-events-none">
              <div className="bg-surface-white/95 border border-divider px-3 py-1.5 shadow-sm text-right space-y-0.5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  PEAK HOURLY FLOW
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  48,200 PAX / HOUR
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 left-4 pointer-events-none">
              <div className="bg-ivory/95 px-3 py-1.5 space-y-0.5">
                <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  ACTIVE CORRIDOR
                </div>
                <div className="font-serif text-sm font-medium text-ink">
                  {selectedCorridor?.name}
                </div>
              </div>
            </div>

            <div className="absolute bottom-3 right-4 pointer-events-none">
              <div className="bg-ivory/95 px-3 py-1.5 flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span className="font-mono text-[11px] text-ink-muted tracking-tight">
                  DRAG TO ROTATE • WHEEL TO ZOOM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Masthead */}
        <div className="border-t border-divider bg-surface-white py-3 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs text-ink-muted font-mono">
            <div className="flex items-center space-x-3">
              <span>FIG. 01 / CALIBRATED TRANSIT TOPOLOGY</span>
              <span className="text-divider">/</span>
              <span>10,800 SENSOR NODES</span>
            </div>
            <div className="flex items-center space-x-2 text-ink-secondary">
              <span className="tracking-widest uppercase text-[11px]">SCROLL FOR TRANSIT ANALYSIS</span>
            </div>
            <div>
              <span>HEADWAY CALIBRATION: 94.8% CI</span>
            </div>
          </div>
        </div>
      </section>

      {/* Friendly Three-Card Onboarding Anchor */}
      <section className="py-12 border-b border-divider bg-surface-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-divider pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                FIRST-TIME VISITOR GUIDE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-ink mt-1">
                Three Simple Things You Can Do on NEXBUS
              </h2>
            </div>
            <p className="text-xs text-ink-muted font-mono">
              CLICK ANY CARD TO GET STARTED
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/twin"
              className="border border-divider p-6 bg-parchment/20 hover:border-terracotta hover:bg-parchment/40 transition-all group block shadow-xs"
            >
              <div className="text-2xl mb-3">🗺️</div>
              <h3 className="font-serif text-xl text-ink group-hover:text-terracotta transition-colors leading-snug">
                1. Explore the 3D City Map
              </h3>
              <p className="text-xs text-ink-secondary mt-2 leading-relaxed font-normal">
                Watch simulated buses travel through Delhi. Tap on any bus stop or road line to discover where it goes and how busy it gets.
              </p>
              <div className="mt-4 font-mono text-xs text-terracotta flex items-center gap-1 font-medium">
                <span>Open Digital Twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/journey"
              className="border border-divider p-6 bg-parchment/20 hover:border-terracotta hover:bg-parchment/40 transition-all group block shadow-xs"
            >
              <div className="text-2xl mb-3">🧭</div>
              <h3 className="font-serif text-xl text-ink group-hover:text-terracotta transition-colors leading-snug">
                2. Plan an Easy Journey
              </h3>
              <p className="text-xs text-ink-secondary mt-2 leading-relaxed font-normal">
                Choose where you start and where you want to go. Get clear step-by-step instructions, ticket prices in Rupees, and crowd estimates.
              </p>
              <div className="mt-4 font-mono text-xs text-terracotta flex items-center gap-1 font-medium">
                <span>Plan a Route</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/simulate"
              className="border border-divider p-6 bg-parchment/20 hover:border-terracotta hover:bg-parchment/40 transition-all group block shadow-xs"
            >
              <div className="text-2xl mb-3">🔬</div>
              <h3 className="font-serif text-xl text-ink group-hover:text-terracotta transition-colors leading-snug">
                3. Test &quot;What-If&quot; Ideas
              </h3>
              <p className="text-xs text-ink-secondary mt-2 leading-relaxed font-normal">
                Curious what happens if we add 10 more electric buses or if a road gets flooded? Run instant computer tests to see the answers.
              </p>
              <div className="mt-4 font-mono text-xs text-terracotta flex items-center gap-1 font-medium">
                <span>Try Simulation Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          01: ARTERIAL GEOGRAPHY & CORRIDOR MATRIX
         ========================================================================= */}
      <section className="py-20 border-b border-divider bg-parchment/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight font-normal">
                A city of 32 million souls, carved into radial arteries.
              </h2>
              <div className="w-12 h-[1.5px] bg-terracotta my-3" />
              <p className="text-ink-secondary leading-relaxed font-normal text-sm sm:text-base">
                Delhi does not operate on a simple Euclidean grid. The network combines concentric ring roads, historic walled settlements, and radial avenues converging on Connaught Place and the Central Secretariat.
              </p>
              <div className="pt-2">
                <Link
                  href="/methodology"
                  className="inline-flex items-center space-x-1.5 font-mono text-xs text-terracotta hover:text-terracotta-dark font-medium uppercase tracking-wider"
                >
                  <span>Review Delhi Transit Topology Dossier</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 border border-divider bg-surface-white overflow-hidden shadow-sm">
              <div className="p-4 border-b border-divider bg-parchment/40 flex items-center justify-between font-mono text-xs">
                <span className="font-semibold text-ink uppercase tracking-wider">
                  PRIMARY CORRIDOR BENCHMARK MATRIX
                </span>
                <span className="text-ink-muted text-[11px]">DATA SOURCE: DTC AVL FEED</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-divider bg-surface-white text-ink-muted text-[11px] uppercase tracking-wider">
                      <th className="py-3 px-4">Corridor</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Daily Commuters</th>
                      <th className="py-3 px-4">On-Time</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-divider/60 text-ink">
                    <tr className="hover:bg-parchment/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium">Mahatma Gandhi Ring Road</td>
                      <td className="py-3.5 px-4 text-ink-secondary">Arterial Ring Spine</td>
                      <td className="py-3.5 px-4 font-semibold">640,000 PAX</td>
                      <td className="py-3.5 px-4 text-terracotta font-medium">81.4%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[11px] uppercase font-semibold">NORMAL</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-parchment/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium">Mehrauli-Badarpur Arterial</td>
                      <td className="py-3.5 px-4 text-ink-secondary">South Connector</td>
                      <td className="py-3.5 px-4 font-semibold">380,000 PAX</td>
                      <td className="py-3.5 px-4 text-terracotta font-medium">78.2%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[11px] uppercase font-semibold">MODERATE</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-parchment/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium">Outer Ring Road Bypass</td>
                      <td className="py-3.5 px-4 text-ink-secondary">Peripheral Spine</td>
                      <td className="py-3.5 px-4 font-semibold">510,000 PAX</td>
                      <td className="py-3.5 px-4 text-terracotta font-medium">84.0%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[11px] uppercase font-semibold">NORMAL</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-parchment/20 transition-colors">
                      <td className="py-3.5 px-4 font-medium">Vikas Marg Trans-Yamuna</td>
                      <td className="py-3.5 px-4 text-ink-secondary">Radial East Axis</td>
                      <td className="py-3.5 px-4 font-semibold">420,000 PAX</td>
                      <td className="py-3.5 px-4 text-terracotta font-medium">74.6%</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[11px] uppercase font-semibold">HIGH CROWD</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02: CORRIDOR TELEMETRY & HOURLY PULSE
         ========================================================================= */}
      <section className="py-20 border-b border-divider bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-xl space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight font-normal">
                Corridors that breathe with the morning rush.
              </h2>
            </div>
            <p className="text-sm text-ink-secondary max-w-sm font-normal leading-relaxed">
              Every route follows an operational pulse. Explore arterial conduits reconstructed from conductor electronic ticketing punch data and AVL transponders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {DELHI_CORRIDORS.map((corridor, idx) => (
              <div
                key={corridor.id}
                onClick={() => setSelectedCorridor(corridor)}
                className={`border p-5 cursor-pointer transition-all ${
                  selectedCorridor?.id === corridor.id
                    ? 'border-terracotta bg-surface-white shadow-sm ring-1 ring-terracotta'
                    : 'border-divider bg-surface-white hover:border-stone hover:bg-parchment/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-semibold text-ink-muted">
                    0{idx + 1} / {corridor.code}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: corridor.color }}
                  />
                </div>
                <h3 className="font-serif text-xl text-ink font-normal mb-2 leading-snug">
                  {corridor.name}
                </h3>
                <p className="text-xs text-ink-secondary font-normal leading-relaxed mb-5 line-clamp-2">
                  {corridor.description}
                </p>
                <div className="border-t border-divider pt-3.5 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-muted text-[11px]">DAILY VOLUME</span>
                    <span className="font-semibold text-ink">
                      {formatPax(corridor.dailyPassengers)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted text-[11px]">PUNCTUALITY</span>
                    <span className="font-semibold text-terracotta">
                      {corridor.currentPunctuality}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted text-[11px]">FLEET STATUS</span>
                    <span className="uppercase text-ink font-semibold">
                      {corridor.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          03: MULTIMODAL ITINERARY PLANNER
         ========================================================================= */}
      <section className="py-20 border-b border-divider bg-parchment/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight font-normal">
                Travel planning built around commuter comfort.
              </h2>
              <p className="text-ink-secondary text-sm sm:text-base leading-relaxed font-normal">
                Traditional journey planners optimize strictly for raw travel minutes, often directing passengers into overcrowded standing-room buses.
              </p>
              <p className="text-ink-secondary text-sm sm:text-base leading-relaxed font-normal">
                NEXBUS computes Pareto-optimal itineraries across three distinct passenger priorities: <strong>Fastest</strong> (speed optimized), <strong>Balanced</strong> (reliable interchanges), and <strong>Less Crowded</strong> (guaranteed seated capacity in AC electric buses).
              </p>

              <div>
                <Link
                  href="/journey"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-surface-white text-xs tracking-wider uppercase font-mono font-medium hover:bg-terracotta transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <span>Open Multimodal Journey Planner</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 border border-divider bg-surface-white p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  SAMPLE TRIP: AIIMS INTERCHANGE → CONNAUGHT PLACE
                </span>
                <span className="font-mono text-xs text-terracotta font-medium">3 PARETO TIERS</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-surface-white border border-divider flex items-center justify-between hover:border-stone transition-colors shadow-xs">
                  <div>
                    <span className="font-mono text-[11px] uppercase font-medium text-ink bg-parchment/60 px-2 py-0.5 border border-divider">
                      FASTEST ROUTE
                    </span>
                    <h3 className="font-serif text-lg text-ink font-normal mt-1">Route 502 Radial Express</h3>
                    <p className="text-ink-secondary text-xs font-sans">Direct corridor • 6 stops • 84% cabin crowd</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink font-semibold">26 MIN</span>
                    <span className="block text-[11px] text-ink-muted">0 TRANSFERS</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-white border border-divider flex items-center justify-between hover:border-stone transition-colors shadow-xs">
                  <div>
                    <span className="font-mono text-[11px] uppercase font-medium text-ink bg-parchment/60 px-2 py-0.5 border border-divider">
                      BALANCED TRANSFER
                    </span>
                    <h3 className="font-serif text-lg text-ink font-normal mt-1">TMS Sewa + Janpath Feeder</h3>
                    <p className="text-ink-secondary text-xs font-sans">1 sheltered transfer at Moolchand • 62% cabin crowd</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink font-semibold">34 MIN</span>
                    <span className="block text-[11px] text-ink-muted">1 TRANSFER</span>
                  </div>
                </div>

                <div className="p-4 bg-surface-white border border-divider flex items-center justify-between hover:border-stone transition-colors shadow-xs">
                  <div>
                    <span className="font-mono text-[11px] uppercase font-medium text-terracotta bg-parchment/60 px-2 py-0.5 border border-divider">
                      SEATED COMFORT
                    </span>
                    <h3 className="font-serif text-lg text-ink font-normal mt-1">Electric Premium AC Shuttle</h3>
                    <p className="text-ink-secondary text-xs font-sans">94% seat availability • Terminal staging • 100% AC</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink font-semibold">38 MIN</span>
                    <span className="block text-[11px] text-ink-muted">SEATED COMMUTE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04: COUNTERFACTUAL SCENARIO SIMULATION
         ========================================================================= */}
      <section className="py-20 border-b border-divider bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <h2 className="font-serif text-3xl sm:text-5xl text-ink leading-tight font-normal">
                Test the hypothetical before spending public funds.
              </h2>
              <p className="text-ink-secondary text-sm sm:text-base leading-relaxed font-normal">
                What happens if Delhi deploys 20 additional electric feeder buses from Saket to AIIMS? What if headway along the Ring Road is compressed from 12 minutes to 6 minutes during evening rush?
              </p>
              <p className="text-ink-secondary text-sm sm:text-base leading-relaxed font-normal">
                The NEXBUS simulation laboratory executes synchronized counterfactual simulations, computing commuter delay savings, vehicle occupancy equalization, and tailpipe carbon offsets.
              </p>

              <div>
                <Link
                  href="/simulate"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-surface-white text-xs tracking-wider uppercase font-mono font-medium hover:bg-terracotta transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
                >
                  <span>Launch Simulation Laboratory</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7 border border-divider bg-surface-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-divider pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs text-terracotta uppercase tracking-wider font-semibold">
                    COUNTERFACTUAL BENCHMARK
                  </span>
                  <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                    Ring Road +15 EV Shuttles Scenario
                  </h3>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-parchment border border-divider text-ink font-medium">
                  SYNCHRONIZED TWIN
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="border border-divider p-4 bg-parchment/20 space-y-2">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    CURRENT OBSERVED STATE
                  </span>
                  <div className="font-serif text-3xl text-ink font-semibold">14.2 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE PLATFORM WAIT
                  </div>
                  <div className="w-full bg-divider h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[78%]" />
                  </div>
                </div>

                <div className="border border-terracotta/40 p-4 bg-terracotta/5 space-y-2">
                  <span className="font-mono text-[11px] text-terracotta uppercase font-semibold block">
                    SIMULATED STATE
                  </span>
                  <div className="font-serif text-3xl text-terracotta font-semibold">6.8 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE PLATFORM WAIT (-52%)
                  </div>
                  <div className="w-full bg-divider h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[36%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-5 mt-5 border-t border-divider font-mono text-xs">
                <div>
                  <span className="text-ink-muted block text-[11px]">CROWDING INDEX</span>
                  <span className="font-semibold text-ink">148% → 82%</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">CO2 OFFSET</span>
                  <span className="font-semibold text-ink">112 Tonnes/Mo</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[11px]">COMMUTER SAVINGS</span>
                  <span className="font-semibold text-terracotta">+1.8M Hrs/Yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05: EPISTEMIC DATA CLASSIFICATION
         ========================================================================= */}
      <section className="py-20 border-b border-divider bg-parchment/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-serif text-3xl sm:text-5xl text-ink font-normal">
              Scientific rigor over black-box guesswork.
            </h2>
            <p className="text-ink-secondary text-sm sm:text-base font-normal leading-relaxed">
              Every data point in NEXBUS is classified into four strict epistemological tiers to maintain complete auditability, provenance tracking, and public trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 font-mono text-xs">
            <div className="border border-divider bg-surface-white p-5 space-y-2 shadow-xs">
              <span className="text-ink font-semibold block text-[11px] uppercase tracking-wider">
                ● TIER 01: OBSERVED
              </span>
              <h3 className="font-serif text-xl text-ink font-normal">Hardware Telemetry</h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed font-normal">
                GPS AVL telemetry pings and 4.28M conductor ETM smartcard punches across 420 fare stages.
              </p>
            </div>

            <div className="border border-divider bg-surface-white p-5 space-y-2 shadow-xs">
              <span className="text-stone font-semibold block text-[11px] uppercase tracking-wider">
                ▲ TIER 02: ESTIMATED
              </span>
              <h3 className="font-serif text-xl text-ink font-normal">Trip Chaining</h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed font-normal">
                Inferring alighting drop-offs and stop dwell times via probabilistic origin-destination clustering.
              </p>
            </div>

            <div className="border border-divider bg-surface-white p-5 space-y-2 shadow-xs">
              <span className="text-ink font-semibold block text-[11px] uppercase tracking-wider">
                ◆ TIER 03: PREDICTED
              </span>
              <h3 className="font-serif text-xl text-ink font-normal">Neural Forecasts</h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed font-normal">
                Spatio-Temporal Graph Neural Networks computing lookahead crowding with 95% Bayesian bounds.
              </p>
            </div>

            <div className="border border-divider bg-surface-white p-5 space-y-2 shadow-xs">
              <span className="text-terracotta font-semibold block text-[11px] uppercase tracking-wider">
                ◇ TIER 04: COUNTERFACTUAL
              </span>
              <h3 className="font-serif text-xl text-ink font-normal">Micro-Simulation</h3>
              <p className="font-sans text-xs text-ink-secondary leading-relaxed font-normal">
                Synthetic counterfactual scenarios testing headway adjustments and new electric bus routes.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/methodology"
              className="inline-flex items-center space-x-1.5 font-mono text-xs text-terracotta hover:text-terracotta-dark uppercase tracking-wider font-medium"
            >
              <span>Read the Full Technical Methodology Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <Footer />
    </div>
  );
}
