'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas, { CameraPreset } from '@/components/3d/DelhiCityCanvas';
import { DELHI_CORRIDORS, DELHI_STOPS, TransitCorridor, BusStop, HOURLY_FLOW_DATA } from '@/data/delhiTransitData';
import {
  ArrowUpRight,
  Compass,
  Layers,
  Activity,
  Clock,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Zap,
  MapPin,
  TrendingDown,
  Users,
  Cpu,
} from 'lucide-react';

export default function HomePage() {
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-ivory">
      <Navbar />

      {/* =========================================================================
          HERO SECTION — ART-DIRECTED EDITORIAL COMPOSITION (62% 3D FOCUS)
         ========================================================================= */}
      <section className="relative w-full border-b border-stone-light min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
        {/* Architectural grain overlay */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-60" />

        <div className="max-w-7xl mx-auto px-6 w-full pt-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
          {/* Left Editorial Narrative (38% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between z-10 py-4">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
                  DELHI / URBAN MOBILITY INTELLIGENCE
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight text-ink font-normal">
                Every journey
                <br />
                <span className="italic font-normal text-terracotta">shapes</span> a city.
              </h1>

              <p className="text-base sm:text-lg text-ink-light leading-relaxed max-w-md pt-2 font-light">
                Understand how people move through Delhi. Explore passenger flows, discover crowded corridors and imagine a better-connected transport network.
              </p>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/twin"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-ivory text-sm tracking-wide font-medium hover:bg-terracotta transition-colors"
                >
                  <span>Explore the City</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/journey"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 border border-ink text-ink text-sm tracking-wide font-medium hover:bg-parchment transition-colors"
                >
                  <span>Plan a Journey</span>
                </Link>
              </div>
            </div>

            {/* Viewfinder Perspective Controls */}
            <div className="pt-8 border-t border-stone-light mt-8 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                  VIEWFINDER PERSPECTIVE
                </span>
                <span className="font-mono text-[11px] text-terracotta">
                  3D GEOSPATIAL MINIATURE
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
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
                    className={`font-mono text-xs py-2 px-2 text-left border transition-all ${
                      activePreset === item.id
                        ? 'border-terracotta bg-terracotta/10 text-terracotta font-medium'
                        : 'border-stone/40 bg-parchment/30 text-ink-muted hover:text-ink hover:border-stone'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D Delhi Architectural Experience (62% width on desktop) */}
          <div className="lg:col-span-7 relative min-h-[520px] lg:min-h-[640px] flex items-center justify-center border border-stone-light bg-parchment/40">
            {/* Master 3D Viewport */}
            <DelhiCityCanvas
              preset={activePreset}
              activeCorridorId={selectedCorridor?.id}
              activeStopId={selectedStop?.id}
              onSelectStop={(stop) => setSelectedStop(stop)}
              interactive={true}
              className="w-full h-full min-h-[520px] lg:min-h-[640px]"
            />

            {/* Editorial Architectural Interface Annotations */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-ivory/90 border border-stone/40 px-3.5 py-2 backdrop-blur-sm shadow-sm space-y-0.5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  NETWORK / DELHI METROPOLIS
                </div>
                <div className="font-mono text-xs font-medium text-ink">
                  DTC ARTERIAL GRID (RADIAL & RING)
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-ivory/90 border border-stone/40 px-3.5 py-2 backdrop-blur-sm shadow-sm text-right space-y-0.5">
                <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                  PASSENGER FLOW (09:00 IST)
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  48,200 PAX / HOUR
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 max-w-xs pointer-events-auto">
              <div className="bg-ivory/95 border border-stone/40 p-3.5 backdrop-blur-md shadow-sm space-y-2">
                <div className="flex items-center justify-between border-b border-stone/30 pb-1.5">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    SELECTED CORRIDOR
                  </span>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 bg-terracotta/15 text-terracotta uppercase">
                    {selectedCorridor?.status}
                  </span>
                </div>
                <div>
                  <h4 className="font-serif text-base text-ink font-medium leading-snug">
                    {selectedCorridor?.name}
                  </h4>
                  <p className="text-xs text-ink-muted line-clamp-2 mt-1 font-light leading-relaxed">
                    {selectedCorridor?.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[11px] text-ink-light">
                  <div>
                    <span className="text-ink-muted block text-[9px]">BUSES/HR</span>
                    <span className="font-medium text-ink">{selectedCorridor?.busesPerHour}</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[9px]">TIME PERIOD</span>
                    <span className="font-medium text-ink">PEAK MORNING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="bg-ivory/90 border border-stone/40 px-3 py-1.5 backdrop-blur-sm shadow-sm flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span className="font-mono text-[10px] text-ink-light tracking-tight">
                  DRAG TO ROTATE / WHEEL TO ZOOM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Masthead & Scroll Cue */}
        <div className="border-t border-stone-light bg-ivory py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted font-mono">
            <div className="flex items-center space-x-3">
              <span>FIG. 01 — RECONSTRUCTED DELHI TRANSIT TOPOLOGY</span>
              <span className="text-stone">/</span>
              <span>10,800 SENSOR NODES</span>
            </div>
            <div className="flex items-center space-x-2 text-ink-light">
              <ChevronDown className="w-3.5 h-3.5 text-terracotta animate-bounce" />
              <span className="tracking-widest uppercase text-[10px]">SCROLL FOR TRANSIT CHOREOGRAPHY</span>
            </div>
            <div>
              <span>SURVEY ACCURACY: 94.8% CI</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          01 — A CITY IN MOTION (Introduce the transport network)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-parchment/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                01 / A CITY IN MOTION
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                A city of 32 million souls, carved into radial arteries.
              </h2>
              <div className="w-12 h-[1px] bg-terracotta my-4" />
              <p className="text-ink-light leading-relaxed font-light text-base">
                Delhi does not operate on a simple Euclidean grid. It is an intricate palimpsest of colonial radiocentric circles, high-density historic walled settlements, and vast arterial peripheral bypasses.
              </p>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="border border-stone-light p-6 bg-ivory space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-1</span>
                <h3 className="font-serif text-2xl text-ink font-normal">47.8 Kilometers</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  The primary Mahatma Gandhi Ring Road serves as the backbone carrying 640,000 daily bus commuters across 14 administrative zones.
                </p>
              </div>

              <div className="border border-stone-light p-6 bg-ivory space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-2</span>
                <h3 className="font-serif text-2xl text-ink font-normal">Connaught Place</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Radial epicentre where 12 radial avenues converge, forming the highest interchange transfer volume in northern India.
                </p>
              </div>

              <div className="border border-stone-light p-6 bg-ivory space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-3</span>
                <h3 className="font-serif text-2xl text-ink font-normal">Micro-Elevation</h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Grade separators, flyover underpasses, and dedicated high-occupancy corridors modeled down to the meter for precise journey estimation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 — UNDERSTAND THE FLOW (Show passenger movement & reconstructed demand)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                02 / UNDERSTAND THE FLOW
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Corridors that breathe with the morning rush.
              </h2>
            </div>
            <p className="text-sm text-ink-muted max-w-sm font-light leading-relaxed">
              Every route has an operational pulse. Here we map the high-frequency arterial conduits reconstructed from millions of automated fare collections and GPS telemetry pings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DELHI_CORRIDORS.map((corridor, idx) => (
              <div
                key={corridor.id}
                onClick={() => setSelectedCorridor(corridor)}
                className={`border p-6 cursor-pointer transition-all ${
                  selectedCorridor?.id === corridor.id
                    ? 'border-terracotta bg-parchment/60 shadow-sm'
                    : 'border-stone-light bg-ivory hover:border-stone hover:bg-parchment/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-medium text-ink-muted">
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
                <p className="text-xs text-ink-light font-light leading-relaxed mb-6">
                  {corridor.description}
                </p>
                <div className="border-t border-stone-light pt-4 space-y-2 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-ink-muted">DAILY VOLUME</span>
                    <span className="font-medium text-ink">
                      {corridor.dailyPassengers.toLocaleString()} PAX
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">PUNCTUALITY</span>
                    <span className="font-medium text-terracotta">
                      {corridor.currentPunctuality}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-ink-muted">STATUS</span>
                    <span className="uppercase text-ink font-medium">
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
          03 — PREDICT THE PRESSURE (Show how crowding predictions work)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-parchment/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              03 / PREDICT THE PRESSURE
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Anticipating congestion before the bottleneck forms.
            </h2>
            <p className="text-ink-light text-base font-light leading-relaxed">
              By coupling spatio-temporal graph neural networks with live ETM ticketing machine tap streams, NEXBUS identifies passenger crowding surges up to 45 minutes ahead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-stone-light p-8 bg-ivory space-y-4 shadow-sm">
              <div className="w-10 h-10 border border-stone/40 bg-parchment/40 flex items-center justify-center font-mono text-sm text-terracotta">
                01
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Multi-Hop Graph Convolutions
              </h3>
              <p className="text-sm text-ink-light font-light leading-relaxed">
                Bus stops are nodes; road networks are edges. The model propagates spatial demand outward from high-dwell stations like Kashmere Gate and AIIMS.
              </p>
              <div className="pt-2 font-mono text-xs text-ink-muted border-t border-stone-light">
                LATENCY: &lt;140ms INFERENCE
              </div>
            </div>

            <div className="border border-stone-light p-8 bg-ivory space-y-4 shadow-sm">
              <div className="w-10 h-10 border border-stone/40 bg-parchment/40 flex items-center justify-center font-mono text-sm text-terracotta">
                02
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Bayesian Confidence Bounds
              </h3>
              <p className="text-sm text-ink-light font-light leading-relaxed">
                Rather than single-point guesses, we provide calibrated 80% and 95% Bayesian credible intervals so authorities understand real forecast certainty.
              </p>
              <div className="pt-2 font-mono text-xs text-ink-muted border-t border-stone-light">
                CALIBRATION: 94.8% VALIDATION SCORE
              </div>
            </div>

            <div className="border border-stone-light p-8 bg-ivory space-y-4 shadow-sm">
              <div className="w-10 h-10 border border-stone/40 bg-parchment/40 flex items-center justify-center font-mono text-sm text-terracotta">
                03
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal">
                Crowding Early-Warning
              </h3>
              <p className="text-sm text-ink-light font-light leading-relaxed">
                Automated alerts triggered when segment passenger capacity factor breaches 120%, giving depot managers time to dispatch supplementary short-loop shuttles.
              </p>
              <div className="pt-2 font-mono text-xs text-ink-muted border-t border-stone-light">
                ALERT WINDOW: 35–50 MINS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          04 — EXPLORE THE JOURNEY (Introduce crowd-aware travel planning)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                04 / EXPLORE THE JOURNEY
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Crowd-aware routing tailored to how you travel.
              </h2>
              <p className="text-ink-light text-base leading-relaxed font-light">
                Ordinary map apps only optimize for raw travel minutes, cramming passengers into overcrowded standing-room buses.
              </p>
              <p className="text-ink-light text-base leading-relaxed font-light">
                NEXBUS computes Pareto-optimal itineraries across three distinct passenger priorities: <strong>Fastest</strong> (speed optimized), <strong>Balanced</strong> (reliable interchanges), and <strong>Comfort First</strong> (guaranteed seated capacity in AC electric buses).
              </p>

              <Link
                href="/journey"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-ivory text-sm font-medium hover:bg-terracotta transition-colors"
              >
                <span>Try the Journey Planner</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 border border-stone-light bg-parchment/30 p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-light pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  SAMPLE TRIP: AIIMS → CONNAUGHT PLACE
                </span>
                <span className="font-mono text-xs text-terracotta">3 RECOMMENDATION TIERS</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-ivory border border-stone-light flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-900 bg-amber-100 px-2 py-0.5 border border-amber-300">
                      FASTEST
                    </span>
                    <h4 className="font-serif text-lg text-ink font-normal mt-1">Route 502 Radial Express</h4>
                    <p className="text-ink-muted text-[11px] font-sans">Direct link • 6 stops • 84% cabin crowd</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink">26 MIN</span>
                  </div>
                </div>

                <div className="p-4 bg-ivory border border-stone-light flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-900 bg-green-100 px-2 py-0.5 border border-green-300">
                      BALANCED
                    </span>
                    <h4 className="font-serif text-lg text-ink font-normal mt-1">TMS Sewa + Janpath Feeder</h4>
                    <p className="text-ink-muted text-[11px] font-sans">1 sheltered transfer at Moolchand • 62% cabin crowd</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink">34 MIN</span>
                  </div>
                </div>

                <div className="p-4 bg-ivory border border-stone-light flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100 px-2 py-0.5 border border-blue-300">
                      COMFORT FIRST
                    </span>
                    <h4 className="font-serif text-lg text-ink font-normal mt-1">Electric Premium AC Shuttle</h4>
                    <p className="text-ink-muted text-[11px] font-sans">94% seat availability • Terminal staging • 100% AC</p>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-2xl text-ink">38 MIN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 — REIMAGINE THE NETWORK (Introduce hypothetical interventions)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-parchment/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                05 / REIMAGINE THE NETWORK
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Test the hypothetical before spending public funds.
              </h2>
              <p className="text-ink-light text-base leading-relaxed font-light">
                What happens if Delhi deploys 20 additional electric feeder buses from Saket to AIIMS? What if headway along the Ring Road is compressed from 12 minutes to 6 minutes during evening rush?
              </p>
              <p className="text-ink-light text-base leading-relaxed font-light">
                The NEXBUS simulation laboratory runs synchronized counterfactual micro-simulations, calculating commuter delay savings, vehicle occupancy equalization, and tailpipe emission reductions.
              </p>

              <Link
                href="/simulate"
                className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-ivory text-sm font-medium hover:bg-terracotta transition-colors"
              >
                <span>Launch Scenario Simulator</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="lg:col-span-7 border border-stone-light bg-ivory p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-light pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs text-terracotta uppercase tracking-wider">
                    COUNTERFACTUAL BENCHMARK
                  </span>
                  <h4 className="font-serif text-2xl text-ink font-normal mt-0.5">
                    Ring Road +15 EV Shuttles Scenario
                  </h4>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-parchment border border-stone/40 text-ink">
                  SYNCHRONIZED TWIN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border border-stone-light p-4 bg-parchment/20 space-y-2">
                  <span className="font-mono text-[10px] text-ink-muted uppercase block">
                    CURRENT STATE
                  </span>
                  <div className="font-serif text-3xl text-ink">14.2 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE COMMUTER PLATFORM WAIT
                  </div>
                  <div className="w-full bg-stone-light h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[78%]" />
                  </div>
                </div>

                <div className="border border-terracotta/40 p-4 bg-terracotta/5 space-y-2">
                  <span className="font-mono text-[10px] text-terracotta uppercase font-medium block">
                    SIMULATED STATE
                  </span>
                  <div className="font-serif text-3xl text-terracotta">6.8 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE COMMUTER PLATFORM WAIT (-52%)
                  </div>
                  <div className="w-full bg-stone-light h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[36%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-stone-light font-mono text-xs">
                <div>
                  <span className="text-ink-muted block text-[10px]">CROWDING INDEX</span>
                  <span className="font-medium text-ink">148% → 82%</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">CO2 OFFSET</span>
                  <span className="font-medium text-ink">112 Tonnes/Mo</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">ANNUAL COMMUTER HRS</span>
                  <span className="font-medium text-terracotta">+1.8M Saved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          06 — THE INTELLIGENCE BEHIND IT (Technical methodology & data provenance)
         ========================================================================= */}
      <section className="py-24 border-b border-stone-light bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              06 / THE INTELLIGENCE BEHIND IT
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Scientific rigor over black-box guesswork.
            </h2>
            <p className="text-ink-light text-base font-light leading-relaxed">
              Every data point in NEXBUS is classified into four strict epistemological tiers to maintain complete auditability and public trust.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
            <div className="border border-green-300 bg-green-50/50 p-6 space-y-2">
              <span className="text-green-900 font-bold block text-[10px] uppercase">
                ● TIER 01: OBSERVED
              </span>
              <h4 className="font-serif text-xl text-ink font-normal">Hardware Beacons</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed font-light">
                Direct GPS telemetry pings every 5s from 3,840 buses and 4.28M conductor ETM smartcard punches.
              </p>
            </div>

            <div className="border border-amber-300 bg-amber-50/50 p-6 space-y-2">
              <span className="text-amber-900 font-bold block text-[10px] uppercase">
                ▲ TIER 02: ESTIMATED
              </span>
              <h4 className="font-serif text-xl text-ink font-normal">Trip Chaining</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed font-light">
                Inferring alighting drop-offs and stop dwell times via probabilistic origin-destination clustering.
              </p>
            </div>

            <div className="border border-blue-300 bg-blue-50/50 p-6 space-y-2">
              <span className="text-blue-900 font-bold block text-[10px] uppercase">
                ◆ TIER 03: PREDICTED
              </span>
              <h4 className="font-serif text-xl text-ink font-normal">Neural Forecasts</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed font-light">
                Spatio-Temporal Graph Neural Networks computing 45-minute lookahead crowding with 95% Bayesian bounds.
              </p>
            </div>

            <div className="border border-purple-300 bg-purple-50/50 p-6 space-y-2">
              <span className="text-purple-900 font-bold block text-[10px] uppercase">
                ★ TIER 04: HYPOTHETICAL
              </span>
              <h4 className="font-serif text-xl text-ink font-normal">Micro-Simulation</h4>
              <p className="font-sans text-xs text-ink-muted leading-relaxed font-light">
                Synthetic counterfactual scenarios testing headway adjustments and new electric bus routes.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/methodology"
              className="inline-flex items-center space-x-1.5 font-mono text-xs text-terracotta hover:underline uppercase tracking-wider"
            >
              <span>Read the Full 9-Stage Technical Methodology Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          07 — EXPLORE NEXBUS (A strong final CTA)
         ========================================================================= */}
      <section className="py-28 bg-parchment/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="border border-stone-light p-10 sm:p-16 bg-ivory relative overflow-hidden shadow-sm">
            <div className="max-w-2xl space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
                07 / ENTER THE PLATFORM
              </span>
              <h2 className="font-serif text-5xl sm:text-6xl text-ink leading-none font-normal">
                Step into Delhi&apos;s living digital twin.
              </h2>
              <p className="text-ink-light text-base sm:text-lg leading-relaxed font-light">
                Explore individual routes, track passenger heatmaps in real-time, compute optimal multi-leg journeys, or run policy simulations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <Link
                  href="/twin"
                  className="p-5 border border-ink bg-ivory hover:bg-ink hover:text-ivory transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-ink-muted group-hover:text-parchment">
                      01 / OPERATIONAL
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-terracotta group-hover:text-ivory" />
                  </div>
                  <h4 className="font-serif text-2xl font-normal">Digital Twin</h4>
                  <p className="text-xs text-ink-muted group-hover:text-parchment/80 mt-1 font-light">
                    Full spatial exploration with contextual inspectors and 24-hour time scrubbers.
                  </p>
                </Link>

                <Link
                  href="/journey"
                  className="p-5 border border-stone-light bg-ivory hover:border-terracotta transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-ink-muted">02 / PASSENGER</span>
                    <ArrowUpRight className="w-4 h-4 text-terracotta" />
                  </div>
                  <h4 className="font-serif text-2xl text-ink font-normal">Journey Planner</h4>
                  <p className="text-xs text-ink-muted mt-1 font-light">
                    Fastest, Balanced, and Comfort First routing with 3D trajectory alignment.
                  </p>
                </Link>

                <Link
                  href="/simulate"
                  className="p-5 border border-stone-light bg-ivory hover:border-terracotta transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-ink-muted">03 / POLICY</span>
                    <ArrowUpRight className="w-4 h-4 text-terracotta" />
                  </div>
                  <h4 className="font-serif text-2xl text-ink font-normal">Simulation Lab</h4>
                  <p className="text-xs text-ink-muted mt-1 font-light">
                    Synchronized counterfactual network testing with live impact metrics.
                  </p>
                </Link>

                <Link
                  href="/control"
                  className="p-5 border border-stone-light bg-ivory hover:border-terracotta transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-ink-muted">04 / INTELLIGENCE</span>
                    <ArrowUpRight className="w-4 h-4 text-terracotta" />
                  </div>
                  <h4 className="font-serif text-2xl text-ink font-normal">Executive Control</h4>
                  <p className="text-xs text-ink-muted mt-1 font-light">
                    Authority dashboards, corridor crowding indices, and fleet reliability scores.
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Footer */}
      <footer className="border-t border-stone-light bg-parchment/40 py-16 text-ink">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="font-serif text-2xl tracking-tight text-ink">NEXBUS</span>
            <p className="text-xs text-ink-muted leading-relaxed font-light max-w-sm">
              An architectural public mobility intelligence project for the National Capital Territory of Delhi. Conceived with editorial restraint and computational precision.
            </p>
            <div className="font-mono text-[10px] text-ink-muted">
              DELHI TRANSPORT CORPORATION &copy; 2026. DATA HARMONIZED UNDER OPEN MOBILITY ACCORD.
            </div>
          </div>

          <div className="md:col-span-2 space-y-2 font-mono text-xs">
            <span className="text-terracotta uppercase tracking-wider block mb-2">PLATFORM</span>
            <div><Link href="/twin" className="hover:text-terracotta">Digital Twin</Link></div>
            <div><Link href="/journey" className="hover:text-terracotta">Journey Planner</Link></div>
            <div><Link href="/simulate" className="hover:text-terracotta">Simulation Lab</Link></div>
            <div><Link href="/control" className="hover:text-terracotta">Intelligence</Link></div>
          </div>

          <div className="md:col-span-2 space-y-2 font-mono text-xs">
            <span className="text-terracotta uppercase tracking-wider block mb-2">SCIENCE</span>
            <div><Link href="/methodology" className="hover:text-terracotta">Methodology</Link></div>
            <div><Link href="/about" className="hover:text-terracotta">Manifesto</Link></div>
            <div><span className="text-ink-muted">GTFS-RT Feeds</span></div>
            <div><span className="text-ink-muted">Privacy Model</span></div>
          </div>

          <div className="md:col-span-3 space-y-3 font-mono text-xs">
            <span className="text-terracotta uppercase tracking-wider block">COORDINATE REFERENCE</span>
            <p className="text-ink-muted text-[11px] leading-relaxed">
              EPSG:7761 WGS 84 / UTM Zone 43N.<br />
              Central Node: Connaught Place Radial Center (28.6315° N, 77.2167° E).
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
