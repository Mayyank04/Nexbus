'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas, { CameraPreset } from '@/components/3d/DelhiCityCanvas';
import { DELHI_CORRIDORS, DELHI_STOPS, TransitCorridor, BusStop, HOURLY_FLOW_DATA } from '@/data/delhiTransitData';
import { Magnetic } from '@/components/ui/magnetic';
import { TextReveal } from '@/components/ui/text-reveal';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
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
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const [activePreset, setActivePreset] = useState<CameraPreset>('overview');
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white">
      <Navbar />

      {/* =========================================================================
          HERO SECTION — ART-DIRECTED CINEMATIC 3D DELPHI EXPERIENCE
         ========================================================================= */}
      <section className="relative w-full border-b border-divider min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
        {/* Subtle architectural grain background */}
        <div className="absolute inset-0 bg-grain pointer-events-none opacity-50" />

        <div className="max-w-7xl mx-auto px-6 w-full pt-8 pb-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-grow">
          {/* Left Narrative Composition (40% width on desktop) */}
          <div className="lg:col-span-5 flex flex-col justify-between z-10 py-2">
            <div className="space-y-6">
              <div className="flex items-center space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
                  DELHI / URBAN MOBILITY
                </span>
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[0.98] tracking-tight text-ink font-normal">
                Every journey
                <br />
                <span className="italic font-normal text-terracotta">shapes</span> a city.
              </h1>

              <p className="text-base sm:text-lg text-ink-muted leading-relaxed max-w-md pt-2 font-light">
                Explore how Delhi moves. Find better journeys, understand crowded routes and discover the patterns behind the city&apos;s transport network.
              </p>

              {/* Actions with Magnetic Polish */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Magnetic intensity={0.2} range={80}>
                  <Link
                    href="/twin"
                    className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-surface-white text-sm tracking-wide font-medium hover:bg-terracotta transition-colors shadow-sm"
                  >
                    <span>Explore Delhi</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Magnetic>

                <Magnetic intensity={0.2} range={80}>
                  <Link
                    href="/journey"
                    className="inline-flex items-center space-x-2 px-6 py-3.5 border border-ink text-ink text-sm tracking-wide font-medium bg-ivory hover:bg-parchment transition-colors"
                  >
                    <span>Plan a journey</span>
                  </Link>
                </Magnetic>
              </div>
            </div>

            {/* Viewfinder Perspective Controls */}
            <div className="pt-8 border-t border-divider mt-8 space-y-3">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="uppercase tracking-wider text-ink-muted">
                  CAMERA VIEWPORT
                </span>
                <span className="text-terracotta">
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
                        : 'border-divider bg-parchment/30 text-ink-muted hover:text-ink hover:border-stone'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 3D Visual Centerpiece (60% width on desktop, unobstructed) */}
          <div className="lg:col-span-7 relative min-h-[520px] lg:min-h-[640px] flex items-center justify-center border border-divider bg-parchment/30 overflow-hidden">
            {/* Master 3D Viewport */}
            <DelhiCityCanvas
              preset={activePreset}
              activeCorridorId={selectedCorridor?.id}
              activeStopId={selectedStop?.id}
              onSelectStop={(stop) => setSelectedStop(stop)}
              interactive={true}
              className="w-full h-full min-h-[520px] lg:min-h-[640px]"
            />

            {/* Restrained Hairline Annotations (Pinned to edges, NOT obstructing center) */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-surface-white/90 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  NETWORK
                </div>
                <div className="font-mono text-xs font-medium text-ink">
                  DELHI METROPOLITAN ARTERIALS
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-surface-white/90 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm text-right space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  PASSENGER FLOW (09:00 IST)
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  48,200 PAX / HOUR
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 pointer-events-none">
              <div className="bg-surface-white/95 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                  SELECTED CORRIDOR
                </div>
                <div className="font-serif text-sm font-medium text-ink">
                  {selectedCorridor?.name}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 pointer-events-none">
              <div className="bg-surface-white/90 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta" />
                <span className="font-mono text-[10px] text-ink-muted tracking-tight">
                  DRAG TO EXPLORE • WHEEL TO ZOOM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Editorial Masthead */}
        <div className="border-t border-divider bg-ivory py-3.5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted font-mono">
            <div className="flex items-center space-x-3">
              <span>FIG. 01 — RECONSTRUCTED DELHI TRANSIT TOPOLOGY</span>
              <span className="text-divider">/</span>
              <span>10,800 SENSOR NODES</span>
            </div>
            <div className="flex items-center space-x-2 text-ink">
              <ChevronDown className="w-3.5 h-3.5 text-terracotta animate-bounce" />
              <span className="tracking-widest uppercase text-[10px]">SCROLL FOR TRANSIT NARRATIVE</span>
            </div>
            <div>
              <span>SURVEY ACCURACY: 94.8% CI</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          01 — DELHI, IN MOTION (Introduce the transport network)
         ========================================================================= */}
      <section className="py-24 border-b border-divider bg-parchment/20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                01 — DELHI, IN MOTION.
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                A city of 32 million souls, carved into radial arteries.
              </h2>
              <div className="w-12 h-[1.5px] bg-terracotta my-4" />
              <p className="text-ink-muted leading-relaxed font-light text-base">
                Delhi does not operate on a simple Euclidean grid. It is an intricate palimpsest of colonial radiocentric circles, high-density historic walled settlements, and vast arterial peripheral bypasses.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ScrollReveal delay={0.1} className="border border-divider p-6 bg-surface-white space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-1</span>
                <h3 className="font-serif text-2xl text-ink font-normal">47.8 km Spine</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  The primary Mahatma Gandhi Ring Road serves as the backbone carrying 640,000 daily bus commuters across 14 administrative zones.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.2} className="border border-divider p-6 bg-surface-white space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-2</span>
                <h3 className="font-serif text-2xl text-ink font-normal">Connaught Place</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Radial epicentre where 8 radial avenues converge, forming the highest multimodal transfer volume in northern India.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3} className="border border-divider p-6 bg-surface-white space-y-3">
                <span className="font-mono text-xs text-ink-muted block">INDEX A-3</span>
                <h3 className="font-serif text-2xl text-ink font-normal">BRT Corridors</h3>
                <p className="text-xs text-ink-muted leading-relaxed font-light">
                  Grade separators, flyover underpasses, and dedicated bus rapid transit corridors modeled down to the meter for precise journey estimation.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          02 — UNDERSTAND THE CROWD (Show passenger movement & demand)
         ========================================================================= */}
      <section className="py-24 border-b border-divider bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl space-y-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                02 — UNDERSTAND THE CROWD.
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Corridors that breathe with the morning rush.
              </h2>
            </div>
            <p className="text-sm text-ink-muted max-w-sm font-light leading-relaxed">
              Every route has an operational pulse. Here we map high-frequency arterial conduits reconstructed from electronic ticketing transactions and GPS telemetry.
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
                    : 'border-divider bg-surface-white hover:border-stone hover:bg-parchment/20'
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
                <p className="text-xs text-ink-muted font-light leading-relaxed mb-6">
                  {corridor.description}
                </p>
                <div className="border-t border-divider pt-4 space-y-2 font-mono text-xs">
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
          03 — FIND A BETTER JOURNEY (Crowd-aware travel planning)
         ========================================================================= */}
      <section className="py-24 border-b border-divider bg-parchment/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                03 — FIND A BETTER JOURNEY.
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Travel planning built around your comfort.
              </h2>
              <p className="text-ink-muted text-base leading-relaxed font-light">
                Ordinary map apps only optimize for raw travel minutes, cramming passengers into overcrowded standing-room buses.
              </p>
              <p className="text-ink-muted text-base leading-relaxed font-light">
                NEXBUS computes Pareto-optimal itineraries across three distinct passenger priorities: <strong>Fastest</strong> (speed optimized), <strong>Balanced</strong> (reliable interchanges), and <strong>Less Crowded</strong> (guaranteed seated capacity in AC electric buses).
              </p>

              <Magnetic intensity={0.2} range={80}>
                <Link
                  href="/journey"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-surface-white text-sm font-medium hover:bg-terracotta transition-colors"
                >
                  <span>Plan your journey</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>

            <div className="lg:col-span-7 border border-divider bg-surface-white p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                  SAMPLE TRIP: AIIMS → CONNAUGHT PLACE
                </span>
                <span className="font-mono text-xs text-terracotta">3 RECOMMENDATION TIERS</span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 bg-parchment/30 border border-divider flex items-center justify-between">
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

                <div className="p-4 bg-parchment/30 border border-divider flex items-center justify-between">
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

                <div className="p-4 bg-parchment/30 border border-divider flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100 px-2 py-0.5 border border-blue-300">
                      LESS CROWDED
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
          04 — SEE WHAT COULD CHANGE (Introduce hypothetical interventions)
         ========================================================================= */}
      <section className="py-24 border-b border-divider bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-terracotta">
                04 — SEE WHAT COULD CHANGE.
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl text-ink leading-tight font-normal">
                Test the hypothetical before spending public funds.
              </h2>
              <p className="text-ink-muted text-base leading-relaxed font-light">
                What happens if Delhi deploys 20 additional electric feeder buses from Saket to AIIMS? What if headway along the Ring Road is compressed from 12 minutes to 6 minutes during evening rush?
              </p>
              <p className="text-ink-muted text-base leading-relaxed font-light">
                The NEXBUS simulation laboratory runs synchronized counterfactual micro-simulations, calculating commuter delay savings, vehicle occupancy equalization, and tailpipe emission reductions.
              </p>

              <Magnetic intensity={0.2} range={80}>
                <Link
                  href="/simulate"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 bg-ink text-surface-white text-sm font-medium hover:bg-terracotta transition-colors"
                >
                  <span>Launch Simulation Lab</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </Magnetic>
            </div>

            <div className="lg:col-span-7 border border-divider bg-surface-white p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-divider pb-4 mb-6">
                <div>
                  <span className="font-mono text-xs text-terracotta uppercase tracking-wider">
                    COUNTERFACTUAL BENCHMARK
                  </span>
                  <h4 className="font-serif text-2xl text-ink font-normal mt-0.5">
                    Ring Road +15 EV Shuttles Scenario
                  </h4>
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 bg-parchment border border-divider text-ink">
                  SYNCHRONIZED TWIN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="border border-divider p-4 bg-parchment/20 space-y-2">
                  <span className="font-mono text-[10px] text-ink-muted uppercase block">
                    CURRENT STATE
                  </span>
                  <div className="font-serif text-3xl text-ink">14.2 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE PLATFORM WAIT
                  </div>
                  <div className="w-full bg-divider h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[78%]" />
                  </div>
                </div>

                <div className="border border-terracotta/40 p-4 bg-terracotta/5 space-y-2">
                  <span className="font-mono text-[10px] text-terracotta uppercase font-medium block">
                    SIMULATED STATE
                  </span>
                  <div className="font-serif text-3xl text-terracotta">6.8 min</div>
                  <div className="text-xs text-ink-muted font-mono">
                    AVERAGE PLATFORM WAIT (-52%)
                  </div>
                  <div className="w-full bg-divider h-1.5 mt-2">
                    <div className="bg-terracotta h-1.5 w-[36%]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-divider font-mono text-xs">
                <div>
                  <span className="text-ink-muted block text-[10px]">CROWDING INDEX</span>
                  <span className="font-medium text-ink">148% → 82%</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">CO2 OFFSET</span>
                  <span className="font-medium text-ink">112 Tonnes/Mo</span>
                </div>
                <div>
                  <span className="text-ink-muted block text-[10px]">COMMUTER SAVINGS</span>
                  <span className="font-medium text-terracotta">+1.8M Hrs/Yr</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          05 — THE INTELLIGENCE BEHIND THE NETWORK (Methodology & Science)
         ========================================================================= */}
      <section className="py-24 border-b border-divider bg-parchment/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              05 — THE INTELLIGENCE BEHIND THE NETWORK.
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-normal">
              Scientific rigor over black-box guesswork.
            </h2>
            <p className="text-ink-muted text-base font-light leading-relaxed">
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
                GPS telemetry pings and 4.28M conductor ETM smartcard punches across 420 fare stages.
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

      {/* Editorial Footer */}
      <footer className="border-t border-divider bg-parchment/40 py-16 text-ink">
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
            <div><Link href="/twin" className="hover:text-terracotta">Explore</Link></div>
            <div><Link href="/journey" className="hover:text-terracotta">Journey Planner</Link></div>
            <div><Link href="/simulate" className="hover:text-terracotta">Simulation</Link></div>
            <div><Link href="/control" className="hover:text-terracotta">Intelligence</Link></div>
          </div>

          <div className="md:col-span-2 space-y-2 font-mono text-xs">
            <span className="text-terracotta uppercase tracking-wider block mb-2">SCIENCE</span>
            <div><Link href="/methodology" className="hover:text-terracotta">How it works</Link></div>
            <div><Link href="/about" className="hover:text-terracotta">About</Link></div>
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
