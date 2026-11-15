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
  Calendar,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Armchair,
  Route as RouteIcon,
  RotateCcw,
} from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';

export default function JourneyPlannerPage() {
  const [originStop, setOriginStop] = useState<string>('stop-aiims');
  const [destinationStop, setDestinationStop] = useState<string>('stop-cp-regal');
  const [departureDate, setDepartureDate] = useState<string>('2026-11-15');
  const [departureTime, setDepartureTime] = useState<string>('09:15');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [journeyOptions, setJourneyOptions] = useState<JourneyPlanOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('fastest');
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    setDepartureDate(new Date().toISOString().split('T')[0]);
  }, []);

  const handleFetchPlans = async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const result = await computeJourneyPlans(
        originStop,
        destinationStop,
        departureDate,
        departureTime
      );
      if (result && result.plans) {
        setJourneyOptions(result.plans);
        setSelectedOptionId(result.plans[0]?.id || 'fastest');
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
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
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Passenger-first Heading */}
        <div className="max-w-2xl space-y-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
            PASSENGER TRAVEL PLANNER
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal leading-[1.05]">
            Where would you like to go?
          </h1>
          <p className="text-base text-ink-muted font-light leading-relaxed">
            Find the quickest, most balanced or least crowded bus routes across Delhi.
          </p>
        </div>

        {/* Clean, Simple Inputs */}
        <div className="border border-divider bg-surface-white p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Origin Stop */}
            <div className="md:col-span-4 bg-parchment/30 border border-divider p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-terracotta" />
                FROM (ORIGIN)
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

            {/* Switch / Direction Arrow */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={() => {
                  const temp = originStop;
                  setOriginStop(destinationStop);
                  setDestinationStop(temp);
                }}
                className="w-8 h-8 rounded-full border border-divider bg-ivory hover:border-terracotta flex items-center justify-center text-ink-muted hover:text-terracotta transition-colors"
                title="Swap origin and destination"
              >
                <ArrowRight className="w-4 h-4 text-terracotta" />
              </button>
            </div>

            {/* Destination Stop */}
            <div className="md:col-span-4 bg-parchment/30 border border-divider p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-gold" />
                TO (DESTINATION)
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

            {/* Departure Time */}
            <div className="md:col-span-3 bg-parchment/30 border border-divider p-3 space-y-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-stone" />
                DEPARTURE TIME
              </span>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full bg-transparent font-mono text-xs text-ink focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Transit Pairs Suggestions */}
          <div className="pt-3 border-t border-divider flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">
                POPULAR TRIPS:
              </span>
              <button
                onClick={() => {
                  setOriginStop('stop-aiims');
                  setDestinationStop('stop-cp-regal');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-divider hover:border-terracotta text-ink transition-colors"
              >
                AIIMS → Connaught Place
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-kashmere-gate');
                  setDestinationStop('stop-nehru-place');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-divider hover:border-terracotta text-ink transition-colors"
              >
                Kashmere Gate → Nehru Place
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-dhaula-kuan');
                  setDestinationStop('stop-anand-vihar');
                }}
                className="font-mono text-xs px-2.5 py-1 bg-ivory border border-divider hover:border-terracotta text-ink transition-colors"
              >
                Dhaula Kuan → Anand Vihar
              </button>
            </div>

            <Magnetic intensity={0.2} range={60}>
              <button
                onClick={handleFetchPlans}
                disabled={isLoading}
                className="px-5 py-2 bg-ink text-surface-white font-mono text-xs uppercase tracking-wider hover:bg-terracotta transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Finding Routes…' : 'Update Routes'}
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Error State */}
        {hasError && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-900 flex items-center justify-between font-mono text-xs">
            <span>Unable to compute routes for the selected stops. Please select another transit pair.</span>
            <button
              onClick={handleFetchPlans}
              className="text-red-900 underline uppercase"
            >
              Retry
            </button>
          </div>
        )}

        {/* Options & Map Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Journey Options */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                RECOMMENDED OPTIONS ({journeyOptions.length})
              </span>
              <span className="font-mono text-[10px] text-terracotta">
                PARETO MULTI-CRITERIA
              </span>
            </div>

            {isLoading ? (
              /* Loading Skeleton */
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-5 border border-divider bg-surface-white animate-pulse space-y-3">
                    <div className="h-4 bg-parchment w-1/3" />
                    <div className="h-6 bg-parchment w-2/3" />
                    <div className="h-3 bg-parchment w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              journeyOptions.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isFastest = opt.type === 'FASTEST';
                const isBalanced = opt.type === 'BALANCED';
                const isComfort = opt.type === 'COMFORT FIRST';

                const categoryLabel = isFastest
                  ? 'Fastest'
                  : isBalanced
                  ? 'Balanced'
                  : 'Less Crowded';

                return (
                  <div
                    key={opt.id}
                    onClick={() => setSelectedOptionId(opt.id)}
                    className={`border p-5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-terracotta bg-surface-white shadow-sm ring-1 ring-terracotta/20'
                        : 'border-divider bg-surface-white/60 hover:border-stone hover:bg-surface-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span
                          className={`font-mono text-[10px] uppercase font-semibold px-2 py-0.5 border ${
                            isFastest
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : isBalanced
                              ? 'bg-green-100 text-green-900 border-green-300'
                              : 'bg-blue-100 text-blue-900 border-blue-300'
                          }`}
                        >
                          {categoryLabel}
                        </span>
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

                    {/* Timeline summary */}
                    <div className="my-3 py-2 border-y border-divider/60 flex items-center space-x-2 font-mono text-xs">
                      <span className="font-semibold text-ink">{opt.departureTime}</span>
                      <div className="flex-1 h-[2px] bg-divider relative flex items-center">
                        <div
                          className="h-[2px] bg-terracotta"
                          style={{ width: `${100 - opt.transfers * 20}%` }}
                        />
                      </div>
                      <span className="font-semibold text-ink">{opt.arrivalTime}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-muted mb-3">
                      <div>
                        <span className="block text-[9px]">TRANSFERS</span>
                        <span className="font-medium text-ink">
                          {opt.transfers === 0 ? 'Direct' : `${opt.transfers} Transfer`}
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
                          {opt.crowding}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px]">ESTIMATED SEAT</span>
                        <span className="font-medium text-ink">{opt.seatProbability}</span>
                      </div>
                    </div>

                    {/* Reason */}
                    <div className="p-2.5 bg-parchment/40 border border-divider text-xs text-ink-muted font-light leading-relaxed">
                      <strong className="font-mono text-[10px] text-ink uppercase tracking-wider block mb-0.5">
                        WHY THIS ROUTE:
                      </strong>
                      {opt.recommendationReason}
                    </div>
                  </div>
                );
              })
            )}

            {/* Active option step-by-step route sequence */}
            {activeOption && !isLoading && (
              <div className="border border-divider bg-surface-white p-5 space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block border-b border-divider pb-2">
                  ROUTE SEQUENCE ({activeOption.segments.length} LEGS)
                </span>

                <div className="space-y-3">
                  {activeOption.segments.map((seg, sIdx) => (
                    <div key={sIdx} className="flex items-start space-x-3 text-xs">
                      <div className="mt-0.5 shrink-0">
                        <div className="w-5 h-5 rounded-full border border-divider bg-parchment flex items-center justify-center font-mono text-[10px] text-ink">
                          0{sIdx + 1}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-ink text-sm">{seg.title}</h4>
                        <p className="text-ink-muted font-light mt-0.5">{seg.detail}</p>
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

          {/* Right: Map Preview */}
          <div className="lg:col-span-7 border border-divider bg-parchment/20 relative min-h-[560px] flex flex-col justify-between">
            <div className="p-4 border-b border-divider bg-surface-white/90 backdrop-blur-sm flex items-center justify-between z-10">
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

            <div className="flex-1 w-full min-h-[460px] relative">
              <DelhiCityCanvas
                preset="journey"
                activeCorridorId="corridor-radial-south"
                activeStopId={originStop}
                interactive={true}
                className="w-full h-full"
              />

              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-surface-white/95 border border-divider p-3.5 backdrop-blur-sm shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="font-mono text-xs text-ink">
                    <span className="text-terracotta uppercase">SELECTED ROUTE: </span>
                    <span>{activeOption?.routeName}</span>
                  </div>
                  <div className="font-mono text-xs text-ink-muted">
                    TOTAL ESTIMATED TRIP: {activeOption?.durationMin} MIN
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
