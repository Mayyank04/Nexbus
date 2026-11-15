'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import { DELHI_STOPS } from '@/data/delhiTransitData';
import {
  computeJourneyPlans,
  JourneyPlanOption,
} from '@/lib/api';
import {
  MapPin,
  ArrowRight,
  Clock,
  Users,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Route as RouteIcon,
} from 'lucide-react';

export default function JourneyPlannerPage() {
  const [originStop, setOriginStop] = useState<string>('stop-aiims');
  const [destinationStop, setDestinationStop] = useState<string>('stop-cp-regal');
  const [departureDate, setDepartureDate] = useState<string>('2026-11-15');
  const [departureTime, setDepartureTime] = useState<string>('09:15');

  useEffect(() => {
    // Set actual date on mount in client
    setDepartureDate(new Date().toISOString().split('T')[0]);
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [journeyOptions, setJourneyOptions] = useState<JourneyPlanOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('fastest');
  const [selectedSegmentIdx, setSelectedSegmentIdx] = useState<number | null>(null);

  // Fetch real journey plans from API
  const handleFetchPlans = async () => {
    setIsLoading(true);
    const result = await computeJourneyPlans(
      originStop,
      destinationStop,
      departureDate,
      departureTime
    );
    if (result && result.plans) {
      setJourneyOptions(result.plans);
      setSelectedOptionId(result.plans[0]?.id || 'fastest');
      setSelectedSegmentIdx(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    handleFetchPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originStop, destinationStop]);

  const activeOption =
    journeyOptions.find((o) => o.id === selectedOptionId) || journeyOptions[0];

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Editorial Heading */}
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              JOURNEY PLANNER / MULTI-CRITERIA TRANSIT ENGINE
            </span>
          </div>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal leading-[1.05]">
            Find your way across the city.
          </h1>
          <p className="text-base text-ink-light font-light leading-relaxed">
            Multi-criteria journey optimization analyzing velocity, interchange friction, and predicted passenger crowding across Delhi&apos;s bus grid.
          </p>
        </div>

        {/* Origin / Destination / Date / Time Form Bar */}
        <div className="border border-stone-light bg-parchment/40 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Origin Stop */}
            <div className="md:col-span-4 bg-ivory border border-stone-light p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-terracotta" />
                ORIGIN STOP
              </span>
              <select
                value={originStop}
                onChange={(e) => setOriginStop(e.target.value)}
                className="w-full bg-transparent font-serif text-lg text-ink focus:outline-none cursor-pointer"
              >
                {DELHI_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Direction Arrow */}
            <div className="md:col-span-1 flex justify-center">
              <div className="w-8 h-8 rounded-full border border-stone-light bg-ivory flex items-center justify-center text-ink-muted">
                <ArrowRight className="w-4 h-4 text-terracotta" />
              </div>
            </div>

            {/* Destination Stop */}
            <div className="md:col-span-4 bg-ivory border border-stone-light p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gold" />
                DESTINATION STOP
              </span>
              <select
                value={destinationStop}
                onChange={(e) => setDestinationStop(e.target.value)}
                className="w-full bg-transparent font-serif text-lg text-ink focus:outline-none cursor-pointer"
              >
                {DELHI_STOPS.map((stop) => (
                  <option key={stop.id} value={stop.id}>
                    {stop.name} ({stop.zone})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time */}
            <div className="md:col-span-3 grid grid-cols-2 gap-2">
              <div className="bg-ivory border border-stone-light p-2.5 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                  <Calendar className="w-2.5 h-2.5 text-stone" />
                  DATE
                </span>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-ink focus:outline-none"
                />
              </div>

              <div className="bg-ivory border border-stone-light p-2.5 space-y-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5 text-stone" />
                  DEPARTURE
                </span>
                <input
                  type="time"
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-ink focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Presets & Re-Compute Button */}
          <div className="pt-3 border-t border-stone-light/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">
                TRANSIT PAIRS:
              </span>
              <button
                onClick={() => {
                  setOriginStop('stop-aiims');
                  setDestinationStop('stop-cp-regal');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
              >
                AIIMS → Connaught Place
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-kashmere-gate');
                  setDestinationStop('stop-nehru-place');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
              >
                Kashmere Gate → Nehru Place
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-dhaula-kuan');
                  setDestinationStop('stop-anand-vihar');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
              >
                Dhaula Kuan → Anand Vihar
              </button>
            </div>

            <button
              onClick={handleFetchPlans}
              disabled={isLoading}
              className="px-5 py-2 bg-ink text-ivory font-mono text-xs uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Computing RAPTOR…' : 'Update Itineraries'}
            </button>
          </div>
        </div>

        {/* Recommendations & 3D Route Inspection */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The 3 Core Recommendation Types */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                PARETO-OPTIMAL RECOMMENDATIONS (3)
              </span>
              <span className="font-mono text-[10px] text-terracotta">
                RAPTOR ALGORITHM v2.1
              </span>
            </div>

            {journeyOptions.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              const isFastest = opt.type === 'FASTEST';
              const isBalanced = opt.type === 'BALANCED';
              const isComfort = opt.type === 'COMFORT FIRST';

              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    setSelectedOptionId(opt.id);
                    setSelectedSegmentIdx(null);
                  }}
                  className={`border p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-terracotta bg-ivory shadow-sm ring-1 ring-terracotta/20'
                      : 'border-stone-light bg-parchment/20 hover:border-stone hover:bg-ivory'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 border ${
                            isFastest
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isBalanced
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          {opt.type} • {opt.tag}
                        </span>
                      </div>
                      <h3 className="font-serif text-xl text-ink font-normal mt-1.5">
                        {opt.routeName}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-serif text-3xl text-ink font-normal">
                        {opt.durationMin}
                      </span>
                      <span className="text-xs font-mono text-ink-muted ml-1">MIN</span>
                    </div>
                  </div>

                  {/* Horizontal Journey Timeline */}
                  <div className="my-3 py-2 border-y border-stone-light/60 flex items-center space-x-2 font-mono text-xs">
                    <span className="font-semibold text-ink">{opt.departureTime}</span>
                    <div className="flex-1 h-[2px] bg-stone-light relative flex items-center">
                      <div
                        className="h-[2px] bg-terracotta"
                        style={{ width: `${100 - opt.transfers * 20}%` }}
                      />
                    </div>
                    <span className="font-semibold text-ink">{opt.arrivalTime}</span>
                  </div>

                  {/* Operational Telemetry Grid */}
                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-muted mb-3">
                    <div>
                      <span className="block text-[9px]">TRANSFERS</span>
                      <span className="font-medium text-ink">
                        {opt.transfers === 0 ? '0 (Direct)' : `${opt.transfers} Transfer`}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px]">CROWDING</span>
                      <span
                        className={`font-medium ${
                          opt.crowding === 'Low'
                            ? 'text-green-700'
                            : opt.crowding === 'Moderate'
                            ? 'text-amber-700'
                            : 'text-terracotta'
                        }`}
                      >
                        {opt.crowding} ({opt.crowdingScore}%)
                      </span>
                    </div>
                    <div>
                      <span className="block text-[9px]">SEAT PROBABILITY</span>
                      <span className="font-medium text-ink">{opt.seatProbability}</span>
                    </div>
                  </div>

                  {/* "Why this route" Explanation */}
                  <div className="p-2.5 bg-parchment/40 border border-stone-light/70 text-xs text-ink-light font-light leading-relaxed">
                    <strong className="font-mono text-[10px] text-ink uppercase tracking-wider block mb-0.5">
                      WHY THIS RECOMMENDATION:
                    </strong>
                    {opt.recommendationReason}
                  </div>
                </div>
              );
            })}

            {/* Step-by-Step Itinerary Breakdown */}
            {activeOption && (
              <div className="border border-stone-light bg-ivory p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-light pb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    STEP-BY-STEP ITINERARY
                  </span>
                  <span className="font-mono text-[11px] text-terracotta">
                    {activeOption.segments.length} LEGS
                  </span>
                </div>

                <div className="space-y-3">
                  {activeOption.segments.map((seg, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={() => setSelectedSegmentIdx(sIdx)}
                      className={`p-2.5 border cursor-pointer transition-all flex items-start space-x-3 text-xs ${
                        selectedSegmentIdx === sIdx
                          ? 'border-terracotta bg-parchment/50'
                          : 'border-stone-light/50 bg-ivory hover:border-stone'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <div className="w-5 h-5 rounded-full border border-stone-light bg-parchment flex items-center justify-center font-mono text-[10px] text-ink">
                          0{sIdx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-ink text-sm">{seg.title}</h4>
                        <p className="text-ink-muted font-light mt-0.5">{seg.detail}</p>
                        {seg.fleetType && (
                          <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 bg-parchment border border-stone/30 text-ink-muted">
                            FLEET: {seg.fleetType}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[11px] text-ink-muted shrink-0">
                        {seg.durationMin} min
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: 3D Trajectory Viewer */}
          <div className="lg:col-span-7 border border-stone-light bg-parchment/30 relative min-h-[580px] flex flex-col justify-between">
            <div className="p-4 border-b border-stone-light bg-ivory/85 backdrop-blur-sm flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="font-mono text-xs text-ink tracking-wider uppercase">
                  3D JOURNEY CORRIDOR PREVIEW
                </span>
              </div>
              <span className="font-mono text-[11px] text-ink-muted">
                LIVE TRAJECTORY ALIGNMENT
              </span>
            </div>

            <div className="flex-1 w-full min-h-[480px] relative">
              <DelhiCityCanvas
                preset="journey"
                activeCorridorId="corridor-radial-south"
                activeStopId={originStop}
                interactive={true}
                className="w-full h-full"
              />

              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-ivory/95 border border-stone-light p-4 backdrop-blur-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="font-mono text-xs text-ink">
                    <span className="text-terracotta uppercase">ACTIVE SELECTION: </span>
                    <span>{activeOption?.routeName} ({activeOption?.type})</span>
                  </div>
                  <div className="font-mono text-xs text-ink-muted">
                    TOTAL TRIP ESTIMATE: {activeOption?.durationMin} MIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
