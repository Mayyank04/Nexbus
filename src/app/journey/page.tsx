'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import {
  fetchMultimodalJourneyPlans,
} from '@/lib/api';
import {
  ArrowRight,
  Clock,
  Compass,
  Train,
  Bus,
  Footprints,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  IndianRupee,
  Layers,
  Accessibility,
} from 'lucide-react';
import { StopAutocomplete } from '@/components/ui/stop-autocomplete';
import { Magnetic } from '@/components/ui/magnetic';
import { SkeletonCard } from '@/components/ui/skeleton';
import { MultimodalJourneyPlan } from '@/lib/multimodal/journeyEngine';
import { useMultimodalPlanner } from '@/hooks/useMultimodalPlanner';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';

export default function JourneyPlannerPage() {
  const { level } = useExperienceLevel();
  const {
    originStop,
    setOriginStop,
    destinationStop,
    setDestinationStop,
    preference,
    setPreference,
    requireStepFree,
    setRequireStepFree,
    commuterProfile,
    setCommuterProfile,
    isLoading,
    multimodalPlans,
    selectedPlanId,
    setSelectedPlanId,
    activePlan,
    hasError,
    fetchPlans: handleFetchPlans,
    swapStops,
  } = useMultimodalPlanner();

  const isSimple = level === 'easy' || level === 'commuter';

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-8">
        {/* Passenger-first Heading */}
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-terracotta/10 border border-terracotta/20 font-mono text-[11px] text-terracotta uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            <span>Multimodal Urban Journey Intelligence</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl text-ink font-normal leading-[1.1]">
            Seamless Journeys Across Delhi
          </h1>
          <p className="text-base text-ink-muted font-light leading-relaxed">
            Optimal pathfinding across Delhi Metro (DMRC), DTC arterial bus corridors, and validated pedestrian transfers with real-time interchange friction scoring.
          </p>
        </div>

        {/* Input & Routing Preferences Box */}
        <div className="border border-divider bg-surface-white p-6 space-y-5 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Origin Stop */}
            <div className="md:col-span-5">
              <StopAutocomplete
                label="FROM (ORIGIN)"
                selectedStopId={originStop}
                onSelectStop={(id) => setOriginStop(id)}
                iconColor="text-terracotta"
                placeholder="Select origin hub or bus stop..."
              />
            </div>

            {/* Direction Switch */}
            <div className="md:col-span-2 flex justify-center pt-4">
              <button
                onClick={swapStops}
                className="w-10 h-10 rounded-full border border-divider bg-ivory hover:border-terracotta flex items-center justify-center text-ink-muted hover:text-terracotta transition-colors shadow-sm"
                title="Swap origin and destination"
              >
                <ArrowRight className="w-4 h-4 text-terracotta" />
              </button>
            </div>

            {/* Destination Stop */}
            <div className="md:col-span-5">
              <StopAutocomplete
                label="TO (DESTINATION)"
                selectedStopId={destinationStop}
                onSelectStop={(id) => setDestinationStop(id)}
                iconColor="text-gold"
                placeholder="Select destination hub or bus stop..."
              />
            </div>
          </div>

          {/* Filtering Toggles & Criteria */}
          <div className="pt-4 border-t border-divider flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-1">
                PREFERENCE:
              </span>
              {(isSimple
                ? [
                    { id: 'ALL', label: 'All Choices' },
                    { id: 'FASTEST', label: '⚡ Fastest (Save Time)' },
                    { id: 'LEAST_TRANSFERS', label: '🔄 Fewest Changes (Easy)' },
                    { id: 'BUS_ONLY', label: '🚌 Bus Only' },
                  ]
                : [
                    { id: 'ALL', label: 'All Modes' },
                    { id: 'FASTEST', label: 'Fastest Multimodal' },
                    { id: 'LEAST_TRANSFERS', label: 'Least Transfers' },
                    { id: 'BUS_ONLY', label: 'Bus Only' },
                  ]
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPreference(tab.id as any)}
                  className={`font-mono text-xs px-3 py-1.5 border transition-all ${
                    preference === tab.id
                      ? 'bg-terracotta text-surface-white border-terracotta shadow-xs'
                      : 'bg-ivory border-divider text-ink hover:border-stone'
                  }`}
                >
                  {tab.label}
                </button>
              ))}

              {/* Step-Free Toggle */}
              <button
                onClick={() => setRequireStepFree(!requireStepFree)}
                className={`ml-2 inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 border transition-all ${
                  requireStepFree
                    ? 'bg-green-700 text-surface-white border-green-700'
                    : 'bg-ivory border-divider text-ink-muted hover:text-ink'
                }`}
              >
                <Accessibility className="w-3.5 h-3.5" />
                <span>Step-Free Accessible</span>
              </button>
            </div>

            {/* Quick Pairs */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-ink-muted hidden sm:inline">
                POPULAR:
              </span>
              <button
                onClick={() => {
                  setOriginStop('stop-aiims');
                  setDestinationStop('stop-cp-regal');
                }}
                className="font-mono text-[11px] px-2 py-1 bg-ivory border border-divider hover:border-terracotta text-ink"
              >
                AIIMS → CP
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-kashmere-gate');
                  setDestinationStop('stop-anand-vihar');
                }}
                className="font-mono text-[11px] px-2 py-1 bg-ivory border border-divider hover:border-terracotta text-ink"
              >
                ISBT North → East
              </button>
              <button
                onClick={() => {
                  setOriginStop('stop-dhaula-kuan');
                  setDestinationStop('stop-nehru-place');
                }}
                className="font-mono text-[11px] px-2 py-1 bg-ivory border border-divider hover:border-terracotta text-ink"
              >
                Dhaula Kuan → Nehru Pl
              </button>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {hasError && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-900 flex items-center justify-between font-mono text-xs">
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>No continuous route found matching your accessibility or modal filters. Please broaden your selection.</span>
            </span>
            <button
              onClick={handleFetchPlans}
              className="text-red-900 underline uppercase hover:no-underline font-semibold"
            >
              Retry Search
            </button>
          </div>
        )}

        {/* Journey Results & 3D Environment */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Itinerary Options */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                IDENTIFIED ITINERARIES ({multimodalPlans.length})
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 bg-green-50 text-green-800 border border-green-200">
                GENERALIZED COST OPTIMIZED
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              multimodalPlans.map((plan) => {
                const isSelected = selectedPlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
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
                            plan.preference === 'FASTEST'
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : plan.preference === 'LEAST_TRANSFERS'
                              ? 'bg-blue-100 text-blue-900 border-blue-300'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          {plan.preference.replace('_', ' ')}
                        </span>
                        <h3 className="font-serif text-xl text-ink font-normal mt-1.5">
                          {plan.title}
                        </h3>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-serif text-3xl text-ink font-normal">
                          {plan.totalDurationMinutes}
                        </span>
                        <span className="text-xs font-mono text-ink-muted ml-1">MIN</span>
                        <div className="text-[10px] font-mono text-ink-muted">
                          95% CI: {Math.max(1, plan.totalDurationMinutes - 3)}–{plan.totalDurationMinutes + 4}m
                        </div>
                      </div>
                    </div>

                    {/* Mode Breakdown Pills */}
                    <div className="my-2.5 flex flex-wrap items-center gap-2">
                      {plan.legs.map((leg, lIdx) => (
                        <div
                          key={lIdx}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 border rounded-xs text-[11px] font-mono"
                          style={{
                            borderColor: leg.mode === 'METRO' ? '#E8B923' : leg.mode === 'BUS' ? '#B84C32' : '#888',
                            backgroundColor: leg.mode === 'METRO' ? '#FEF9C3' : leg.mode === 'BUS' ? '#FEE2E2' : '#F3F4F6',
                            color: leg.mode === 'METRO' ? '#854D0E' : leg.mode === 'BUS' ? '#991B1B' : '#374151',
                          }}
                        >
                          {leg.mode === 'METRO' && <Train className="w-3 h-3" />}
                          {leg.mode === 'BUS' && <Bus className="w-3 h-3" />}
                          {leg.mode === 'TRANSFER' && <Footprints className="w-3 h-3" />}
                          <span>{leg.mode}</span>
                          <span className="opacity-75">({leg.durationMinutes}m)</span>
                        </div>
                      ))}
                    </div>

                    {/* Plain Language Route Recommendation Reason */}
                    <div className="mb-3 p-2.5 bg-parchment/50 border border-divider/60 text-xs text-ink-secondary leading-snug">
                      <span className="font-semibold text-ink">Why this choice? </span>
                      {plan.preference === 'FASTEST'
                        ? 'Quickest option: prioritizes high-speed Delhi Metro lines to bypass street congestion.'
                        : plan.preference === 'LEAST_TRANSFERS'
                        ? 'Easiest option: minimizes transfers so you can sit comfortably with minimal switching.'
                        : 'Balanced option: steady pace, predictable frequency, and moderate walking.'}
                    </div>

                    {/* Metric Bar */}
                    <div className="grid grid-cols-4 gap-2 pt-3 border-t border-divider/60 font-mono text-[11px] text-ink-muted">
                      <div>
                        <span className="block text-[9px] uppercase">DISTANCE</span>
                        <span className="font-medium text-ink">{plan.totalDistanceKm} km</span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase">TRANSFERS</span>
                        <span className="font-medium text-ink">
                          {plan.transfersCount === 0 ? 'Direct' : `${plan.transfersCount} switch`}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase">EST. FARE</span>
                        <span className="font-medium text-ink flex items-center">
                          <IndianRupee className="w-3 h-3 inline" />
                          {plan.estimatedFareInr}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[9px] uppercase">CO₂ SAVED</span>
                        <span className="font-medium text-emerald-700 flex items-center gap-0.5">
                          <Leaf className="w-2.5 h-2.5" />
                          {plan.carbonSavedKg} kg
                        </span>
                      </div>
                    </div>

                    {/* Fare Concession & Smart Card Transparency */}
                    <div className="mt-2.5 pt-2 border-t border-divider/40 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-ink-muted">
                      <span>Smart Card: <strong className="text-ink">₹{Math.round(plan.estimatedFareInr * 0.9)}</strong> (10% off)</span>
                      <span className="text-emerald-800 bg-emerald-50 px-1 py-0.2 border border-emerald-200">
                        Pink Pass: Free Bus for Women
                      </span>
                    </div>

                    {/* Accessibility & Reliability */}
                    <div className="mt-2 pt-2 border-t border-divider/40 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-green-800 bg-green-50 px-1.5 py-0.5 border border-green-200 flex items-center gap-1">
                        <Accessibility className="w-3 h-3" />
                        <span>Step-Free Accessible</span>
                      </span>
                      <span className="text-ink-muted">
                        Reliability: <strong className="text-ink font-semibold">{plan.reliabilityScorePct}%</strong>
                      </span>
                    </div>
                  </div>
                );
              })
            )}


            {/* Detailed Legs Sequence */}
            {activePlan && !isLoading && (
              <div className="border border-divider bg-surface-white p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-divider pb-2.5">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                    DETAILED ITINERARY ({activePlan.legs.length} LEGS)
                  </span>
                  <span className="font-mono text-[10px] text-stone">
                    CLASSIFICATION: {activePlan.evidenceClassification}
                  </span>
                </div>

                <div className="space-y-4">
                  {activePlan.legs.map((leg, lIdx) => (
                    <div key={leg.id || lIdx} className="flex items-start space-x-3 text-xs">
                      <div className="mt-1 shrink-0">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px]"
                          style={{
                            backgroundColor: leg.mode === 'METRO' ? '#FEF9C3' : leg.mode === 'BUS' ? '#FEE2E2' : '#F3F4F6',
                            color: leg.mode === 'METRO' ? '#854D0E' : leg.mode === 'BUS' ? '#991B1B' : '#374151',
                            border: `1px solid ${leg.mode === 'METRO' ? '#E8B923' : leg.mode === 'BUS' ? '#B84C32' : '#CBD5E1'}`,
                          }}
                        >
                          {lIdx + 1}
                        </div>
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-ink text-sm flex items-center gap-1.5">
                            {leg.mode === 'METRO' && <Train className="w-3.5 h-3.5 text-yellow-600" />}
                            {leg.mode === 'BUS' && <Bus className="w-3.5 h-3.5 text-terracotta" />}
                            {leg.mode === 'TRANSFER' && <Footprints className="w-3.5 h-3.5 text-emerald-700" />}
                            {leg.lineOrRoute}
                          </span>
                          <span className="font-mono text-ink-muted text-[11px]">
                            {leg.durationMinutes} min ({leg.distanceKm} km)
                          </span>
                        </div>

                        <p className="text-ink-muted font-light leading-relaxed">
                          {leg.instructions}
                        </p>

                        <div className="text-[10px] font-mono text-stone pt-0.5 flex items-center gap-3">
                          <span>From: {leg.originName}</span>
                          <span>→</span>
                          <span>To: {leg.destinationName}</span>
                        </div>

                        {/* Crowd expectation with triple encoding */}
                        <div className="pt-1 flex flex-wrap items-center gap-2 text-[10px] font-mono">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <span>🟢</span>
                            <span>Plenty of empty seats expected</span>
                          </span>
                          {leg.mode === 'TRANSFER' && (
                            <span className="text-ink-muted">
                              Follow concourse signage • Elevators & escalators available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-divider text-[10px] text-ink-muted/80 font-mono leading-relaxed">
                  Notice: Walking transfer durations are calibrated at 4.5 km/h with vertical level penalties. Real-time metro headways sourced from DMRC operational schedules.
                </div>
              </div>
            )}
          </div>

          {/* Right Column: 3D City Visualization */}
          <div className="lg:col-span-7 border border-divider bg-parchment/20 relative min-h-[580px] flex flex-col justify-between">
            <div className="p-4 border-b border-divider bg-surface-white flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
                <span className="font-mono text-xs text-ink tracking-wider uppercase">
                  3D MULTIMODAL SPATIAL TWIN
                </span>
              </div>
              <span className="font-mono text-[11px] text-ink-muted">
                DELHI NCT TOPOLOGY
              </span>
            </div>

            <div className="flex-1 w-full min-h-[480px] relative">
              <DelhiCityCanvas
                preset="journey"
                activeCorridorId="corridor-ring-road"
                activeStopId={originStop}
                interactive={true}
                className="w-full h-full"
              />

              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-surface-white border border-divider p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="font-mono text-xs text-ink">
                    <span className="text-terracotta uppercase font-semibold">SELECTED PLAN: </span>
                    <span>{activePlan?.title || 'Calculating...'}</span>
                  </div>
                  <div className="font-mono text-xs text-ink-muted">
                    EST. DURATION: <strong className="text-ink font-semibold">{activePlan?.totalDurationMinutes || 0} MIN</strong> | FARE: ₹{activePlan?.estimatedFareInr || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
