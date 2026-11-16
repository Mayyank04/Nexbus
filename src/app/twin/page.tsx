'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas, { DigitalTwinLayer } from '@/components/3d/DelhiCityCanvas';
import {
  DELHI_CORRIDORS,
  DELHI_STOPS,
  TransitCorridor,
  BusStop,
} from '@/data/delhiTransitData';
import {
  fetchCrowdingPrediction,
  CrowdingPredictionResponse,
} from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';
import { useDigitalTwin } from '@/hooks/useDigitalTwin';
import {
  Clock,
  Play,
  Pause,
  RotateCcw,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  EyeOff,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
  Compass,
  MapPin,
  Route,
} from 'lucide-react';

const TWIN_LAYERS: { id: DigitalTwinLayer; label: string; tag: string }[] = [
  { id: 'all', label: 'All Multimodal', tag: 'OVERVIEW' },
  { id: 'metro', label: 'Metro Rail', tag: 'DMRC' },
  { id: 'buses', label: 'Bus Network', tag: 'DTC/DIMTS' },
  { id: 'interchanges', label: 'Hubs & Terminals', tag: 'TRANSFER' },
  { id: 'demand', label: 'OD Gravity', tag: 'DEMAND' },
  { id: 'flow', label: 'Desire Arcs', tag: 'FLOW' },
  { id: 'utilization', label: 'Corridor Load', tag: 'CAPACITY' },
  { id: 'accessibility', label: 'Walk Isochrones', tag: 'EQUITY' },
  { id: 'disruption', label: 'Hazard Beacons', tag: 'INCIDENT' },
  { id: 'flood_risk', label: 'Yamuna Flood', tag: 'CLIMATE' },
  { id: 'demographics', label: 'Population', tag: 'CENSUS' },
];

export default function DigitalTwinPage() {
  const {
    selectedCorridor,
    setSelectedCorridor,
    selectedStop,
    setSelectedStop,
    currentTimeHour,
    setCurrentTimeHour,
    isPlaying,
    setIsPlaying,
    togglePlay,
    showBuses,
    setShowBuses,
    activeLayer,
    setActiveLayer,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    showDeepTelemetry,
    setShowDeepTelemetry,
    predictionData,
    isLoadingPrediction,
    observedVehicles,
    inspectedVehicle,
    setInspectedVehicle,
    liveFreshnessLag,
  } = useDigitalTwin();

  const filteredCorridors = DELHI_CORRIDORS.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStops = DELHI_STOPS.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-ivory text-ink overflow-hidden selection:bg-terracotta selection:text-surface-white">
      <Navbar />

      {/* =========================================================================
          TOP: CLEAR TITLE, SELECTED GEOGRAPHIC AREA & VIEW TOGGLES
         ========================================================================= */}
      <div className="bg-surface-white/95 border-b border-divider px-4 sm:px-6 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-y-2 text-xs z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-serif text-base sm:text-lg font-normal text-ink">
            Delhi Metropolitan Digital Twin
          </span>
          <span className="hidden sm:inline text-divider">|</span>
          <span className="font-mono text-[11px] sm:text-[11px] text-ink-muted uppercase">
            AREA: NCT OF DELHI (28°36&apos;N 77°12&apos;E)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-[11px] sm:text-[11px]">
          <div className="flex items-center space-x-1 border border-divider p-0.5 bg-surface-white">
            <button
              onClick={() => setViewMode('3D')}
              className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
                viewMode === '3D' ? 'bg-terracotta text-surface-white font-medium' : 'text-ink-muted hover:text-ink'
              }`}
            >
              3D ISOMETRIC
            </button>
            <button
              onClick={() => setViewMode('2D')}
              className={`px-2 py-0.5 font-mono text-[11px] transition-colors ${
                viewMode === '2D' ? 'bg-terracotta text-surface-white font-medium' : 'text-ink-muted hover:text-ink'
              }`}
            >
              2D NADIR
            </button>
          </div>
          <span className="hidden sm:inline text-divider">|</span>
          <span className="text-ink-muted">LAYER: <strong className="text-terracotta uppercase">{activeLayer}</strong></span>
          <span className="hidden sm:inline text-divider">|</span>
          <span className="text-ink-muted">TIME: <strong className="text-ink">{currentTimeHour.toString().padStart(2, '0')}:00 IST</strong></span>
        </div>
      </div>

      {/* Advisory & Analytical Integrity Notice */}
      <div className="px-4 sm:px-6 py-1 bg-amber-500/10 border-b border-amber-500/20 text-[11px] sm:text-[11px] font-mono text-amber-900 flex flex-wrap items-center justify-between gap-1 z-20">
        <span className="truncate max-w-full sm:max-w-none">▲ ANALYTICAL DIGITAL TWIN • READ-ONLY + PASSIVE + ADVISORY</span>
        <span className="uppercase text-[11px] sm:text-[11px] text-amber-800">NO PHYSICAL ACTUATION • PASSIVE TWIN</span>
      </div>

      {/* Main Digital Twin Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* =========================================================================
            LEFT COLUMN: COMPACT LAYER SELECTOR & SEARCH
           ========================================================================= */}
        <aside className="w-full lg:w-76 bg-ivory/95 border-b lg:border-b-0 lg:border-r border-divider flex flex-col z-20 shrink-0 h-auto lg:h-full overflow-y-auto">
          {/* Layer Selector */}
          <div className="p-4 border-b border-divider bg-parchment/30 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
                ANALYTICAL LAYERS ({TWIN_LAYERS.length})
              </span>
              <span className="font-mono text-[11px] text-terracotta uppercase">{activeLayer}</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
              {TWIN_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`font-mono text-[11px] py-1.5 px-2 text-left border transition-all flex flex-col justify-between ${
                    activeLayer === layer.id
                      ? 'border-terracotta bg-terracotta text-surface-white font-medium shadow-xs'
                      : 'border-divider bg-surface-white text-ink-muted hover:text-ink hover:border-stone'
                  }`}
                >
                  <span className="truncate">{layer.label}</span>
                  <span className={`text-[11px] uppercase tracking-tight ${activeLayer === layer.id ? 'text-surface-white' : 'text-stone'}`}>
                    {layer.tag}
                  </span>
                </button>
              ))}
            </div>

            {/* Layer Legend */}
            <div className="pt-2 border-t border-divider/60 flex items-center justify-between font-mono text-[11px] text-ink-muted">
              <span>LEGEND:</span>
              <div className="flex items-center space-x-2">
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#A69A89]" />
                  <span>Normal</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#C89B53]" />
                  <span>Moderate</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2 h-2 rounded-full bg-[#B84C32]" />
                  <span>Surge</span>
                </span>
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="p-3 border-b border-divider bg-surface-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search corridors or stops…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-parchment/40 border border-divider pl-8 pr-3 py-1.5 font-mono text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-terracotta"
              />
            </div>
          </div>

          {/* Corridors List */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
              ARTERIAL CONDUITS ({filteredCorridors.length})
            </span>

            {filteredCorridors.map((corridor) => {
              const isSelected = selectedCorridor?.id === corridor.id;
              return (
                <div
                  key={corridor.id}
                  onClick={() => {
                    setSelectedCorridor(corridor);
                    setSelectedStop(null);
                  }}
                  className={`p-3 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-terracotta bg-parchment/80 shadow-sm'
                      : 'border-divider bg-surface-white hover:border-stone hover:bg-parchment/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-medium text-ink-muted">
                      {corridor.code}
                    </span>
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: corridor.color }}
                    />
                  </div>
                  <h4 className="font-serif text-base text-ink font-normal leading-snug">
                    {corridor.name}
                  </h4>
                  <div className="mt-2 pt-1.5 border-t border-divider/60 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                    <span>{corridor.busesPerHour} BUSES/HR</span>
                    <span className="text-terracotta font-medium uppercase">
                      {corridor.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Stops in search */}
            {searchQuery && filteredStops.length > 0 && (
              <div className="pt-2">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block mb-1">
                  MATCHING STOPS ({filteredStops.length})
                </span>
                <div className="space-y-1">
                  {filteredStops.map((stop) => (
                    <button
                      key={stop.id}
                      onClick={() => {
                        setSelectedStop(stop);
                        setSelectedCorridor(null);
                      }}
                      className="w-full text-left p-2 border border-divider bg-surface-white hover:border-terracotta font-mono text-xs flex justify-between"
                    >
                      <span>{stop.name}</span>
                      <span className="text-terracotta">{stop.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Reset & 3D Fleet Toggle */}
          <div className="p-3 border-t border-divider bg-parchment/40 flex items-center justify-between font-mono text-xs">
            <button
              onClick={() => setShowBuses(!showBuses)}
              className="flex items-center space-x-1.5 text-ink-muted hover:text-ink text-[11px]"
            >
              {showBuses ? <Eye className="w-3.5 h-3.5 text-terracotta" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>3D FLEET</span>
            </button>
            <span className="text-divider">|</span>
            <button
              onClick={() => {
                setSelectedCorridor(DELHI_CORRIDORS[0]);
                setSelectedStop(null);
                setSearchQuery('');
              }}
              className="text-terracotta hover:underline uppercase text-[11px]"
            >
              RESET VIEW
            </button>
          </div>
        </aside>

        {/* =========================================================================
            CENTER: LARGE INTERACTIVE 3D CITY MAP
           ========================================================================= */}
        <main className="flex-1 relative bg-parchment/20 flex flex-col min-h-[420px]">
          <div className="flex-1 w-full h-full relative">
            <DelhiCityCanvas
              preset={selectedCorridor ? 'corridor' : 'overview'}
              activeCorridorId={selectedCorridor?.id}
              activeStopId={selectedStop?.id}
              onSelectCorridor={(c) => setSelectedCorridor(c)}
              onSelectStop={(s) => setSelectedStop(s)}
              showBuses={showBuses}
              timeHour={currentTimeHour}
              interactive={true}
              activeLayer={activeLayer}
              viewMode={viewMode}
              className="w-full h-full"
            />

            {/* In-viewport Coordinates & Live Telemetry HUD */}
            <div className="absolute top-4 left-4 z-10 space-y-2 pointer-events-auto">
              <div className="bg-surface-white border border-divider px-3 py-2 shadow-xs space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-800" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink font-semibold">
                    SHADOW OPERATIONS STREAM
                  </span>
                </div>
                <div className="font-mono text-[11px] text-ink-muted flex items-center gap-2">
                  <span>Lag: <strong className="text-ink">{liveFreshnessLag}s</strong></span>
                  <span>•</span>
                  <span className="text-amber-800 bg-amber-50 px-1 py-0.2 border border-amber-200 text-[11px]">
                    ▲ CALIBRATED ESTIMATE
                  </span>
                </div>
              </div>

              {/* Quick Focus Pills */}
              <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => {
                    setSelectedCorridor(null);
                    setSelectedStop(null);
                  }}
                  className={`px-2 py-1 bg-surface-white/90 border transition-colors ${
                    !selectedCorridor ? 'border-terracotta text-terracotta font-medium' : 'border-divider text-ink-muted hover:text-ink'
                  }`}
                >
                  Overview
                </button>
                {DELHI_CORRIDORS.slice(0, 3).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCorridor(c);
                      setSelectedStop(null);
                    }}
                    className={`px-2 py-1 bg-surface-white/90 border transition-colors ${
                      selectedCorridor?.id === c.id ? 'border-terracotta text-terracotta font-medium' : 'border-divider text-ink-muted hover:text-ink'
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none z-10">
              <div className="bg-surface-white border border-divider px-3 py-1.5 shadow-xs text-right space-y-0.5">
                <div className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                  TIME SLICE & LOAD
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  {currentTimeHour.toString().padStart(2, '0')}:00 IST /{' '}
                  {predictionData ? `${predictionData.loadPercentage}% LOAD` : 'COMPUTING…'}
                </div>
              </div>
            </div>

            {/* Inspected Vehicle Floating Badge */}
            {inspectedVehicle && (
              <div className="absolute bottom-4 left-4 z-10 bg-surface-white/95 border border-divider p-3 shadow-md max-w-xs space-y-1.5 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-divider pb-1">
                  <span className="font-semibold text-terracotta">{inspectedVehicle.vehicleId || 'DTC-BUS'}</span>
                  <span className="text-[11px] px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300">
                    {inspectedVehicle.provenanceStatus}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-ink-muted">
                  <div>Velocity: <strong className="text-ink">{inspectedVehicle.speedKmph || 22} km/h</strong></div>
                  <div>Occupancy: <strong className="text-ink">{inspectedVehicle.occupancyEstimate || 45} PAX</strong></div>
                  <div className="col-span-2 truncate">Corridor: <span className="text-ink">{inspectedVehicle.corridorId || 'Radial Axis'}</span></div>
                  <div className="col-span-2 text-[11px] text-ink-muted/80 truncate">ID: {inspectedVehicle.observationId}</div>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              BOTTOM: SIMPLE TIME CONTROLLER & SCRUBBER
             ========================================================================= */}
          <div className="border-t border-divider bg-surface-white p-3 z-20">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 shrink-0">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-7 h-7 border border-divider bg-surface-white hover:border-terracotta flex items-center justify-center text-ink transition-colors"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 text-terracotta" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                <div className="flex items-center space-x-1.5 font-mono text-xs">
                  <Clock className="w-3.5 h-3.5 text-terracotta" />
                  <span className="font-semibold text-ink">
                    {currentTimeHour.toString().padStart(2, '0')}:00 IST
                  </span>
                </div>

                <span className="font-mono text-[11px] px-2 py-0.5 bg-parchment border border-divider text-ink-muted">
                  {currentTimeHour >= 8 && currentTimeHour <= 10
                    ? 'MORNING PEAK'
                    : currentTimeHour >= 17 && currentTimeHour <= 19
                    ? 'EVENING PEAK'
                    : 'INTER-PEAK'}
                </span>
              </div>

              {/* Slider Scrubber */}
              <div className="w-full md:w-96 flex items-center space-x-3">
                <span className="font-mono text-[11px] text-ink-muted">06:00</span>
                <input
                  type="range"
                  min="6"
                  max="22"
                  step="1"
                  value={currentTimeHour}
                  onChange={(e) => setCurrentTimeHour(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B84C32] cursor-pointer"
                />
                <span className="font-mono text-[11px] text-ink-muted">22:00</span>
              </div>

              <div className="flex items-center space-x-3 font-mono text-xs shrink-0">
                <div className="text-right">
                  <span className="text-ink-muted text-[11px] block">EXPECTED PAX</span>
                  <span className="font-medium text-ink">
                    {predictionData ? predictionData.predictedPassengersPerHour.toLocaleString() : '---'}
                  </span>
                </div>
                <div className="border-l border-divider pl-3 text-right">
                  <span className="text-ink-muted text-[11px] block">CONFIDENCE</span>
                  <span className="font-medium text-terracotta">
                    {predictionData ? `${predictionData.confidenceScore}% CI` : '95%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* =========================================================================
            RIGHT COLUMN: CONTEXTUAL INSPECTOR (Progressive Disclosure)
           ========================================================================= */}
        <aside className="w-full lg:w-92 bg-surface-white border-t lg:border-t-0 lg:border-l border-divider flex flex-col z-20 shrink-0 h-auto lg:h-full overflow-y-auto">
          {selectedCorridor ? (
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-ink">
                    {selectedCorridor.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-parchment border border-divider text-ink uppercase">
                  {selectedCorridor.code}
                </span>
              </div>

              <p className="text-sm text-ink-secondary leading-relaxed">
                {selectedCorridor.description}
              </p>

              {/* Load & Occupancy Summary Card */}
              {isLoadingPrediction ? (
                <div className="p-4 border border-divider bg-surface-white space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ) : predictionData ? (
                <div className="p-4 border border-divider bg-surface-white space-y-2 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
                      PREDICTED CABIN LOAD
                    </span>
                    <span
                      className={`font-mono text-[11px] uppercase px-2 py-0.5 border ${
                        predictionData.severity === 'critical'
                          ? 'bg-terracotta text-surface-white border-terracotta font-medium'
                          : predictionData.severity === 'high'
                          ? 'bg-terracotta/10 text-terracotta border-terracotta/40 font-medium'
                          : 'bg-parchment/60 text-ink border-divider font-medium'
                      }`}
                    >
                      {predictionData.severity}
                    </span>
                  </div>

                  <div className="flex items-baseline space-x-2">
                    <span className="font-serif text-3xl text-ink font-normal">
                      {predictionData.loadPercentage}%
                    </span>
                    <span className="font-mono text-xs text-ink-muted">
                      ({predictionData.predictedPassengersPerHour.toLocaleString()} pax/hr)
                    </span>
                  </div>

                  {/* Progressive Disclosure Toggle */}
                  <button
                    onClick={() => setShowDeepTelemetry(!showDeepTelemetry)}
                    className="pt-2 text-xs font-mono text-terracotta hover:underline flex items-center space-x-1"
                  >
                    <span>{showDeepTelemetry ? 'Hide Bayesian CIs' : 'View Deep Telemetry & CIs'}</span>
                    {showDeepTelemetry ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {/* Deep Telemetry revealed on demand */}
                  {showDeepTelemetry && (
                    <div className="pt-2 border-t border-divider/60 font-mono text-[11px] text-ink-muted space-y-1">
                      <div className="flex justify-between">
                        <span>80% CREDIBLE BOUND:</span>
                        <span className="font-medium text-ink">
                          [{predictionData.bounds.ci80[0]}%, {predictionData.bounds.ci80[1]}%]
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>95% CREDIBLE BOUND:</span>
                        <span className="font-medium text-ink">
                          [{predictionData.bounds.ci95[0]}%, {predictionData.bounds.ci95[1]}%]
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>30-DAY RESIDUAL VARIANCE:</span>
                        <span className="font-medium text-terracotta">
                          {predictionData.historicalBaseline.variancePercentagePoints > 0 ? '+' : ''}
                          {predictionData.historicalBaseline.variancePercentagePoints}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">LENGTH</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.lengthKm} KM
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">FREQUENCY</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.busesPerHour} / HR
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">AVG SPEED</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.averageSpeedKmH} km/h
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">PUNCTUALITY</span>
                  <span className="font-serif text-lg text-terracotta font-normal">
                    {selectedCorridor.currentPunctuality}%
                  </span>
                </div>
              </div>

              {/* Associated Stops Sequence */}
              <div className="space-y-2 pt-1">
                <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
                  KEY INTERCHANGE STOPS
                </span>
                <div className="space-y-1.5 border-l border-terracotta/40 pl-3 ml-1">
                  {selectedCorridor.stops.map((stopId) => {
                    const stop = DELHI_STOPS.find((s) => s.id === stopId);
                    if (!stop) return null;
                    return (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedStop(stop)}
                        className="cursor-pointer group flex items-start justify-between py-1 text-xs"
                      >
                        <div>
                          <span className="font-medium text-ink group-hover:text-terracotta transition-colors block">
                            {stop.name}
                          </span>
                          <span className="text-[11px] text-ink-muted font-light">
                            {stop.hindiName}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-ink-muted">
                          {stop.dailyFootfall.toLocaleString()} pax/d
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Telemetry Fleet on this Corridor */}
              <div className="space-y-2 pt-1 border-t border-divider">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted block">
                    ACTIVE OBSERVED VEHICLES
                  </span>
                  <span className="font-mono text-[11px] text-green-700 bg-green-50 px-1.5 py-0.5 border border-green-200">
                    ● {observedVehicles.length || 6} STREAMING
                  </span>
                </div>

                <div className="space-y-1 font-mono text-xs max-h-36 overflow-y-auto">
                  {(observedVehicles.length > 0 ? observedVehicles : [
                    { vehicleId: 'DL1PC-1001', speedKmph: 24, occupancyEstimate: 48, provenanceStatus: 'CALIBRATED ESTIMATE' },
                    { vehicleId: 'DL1PC-1002', speedKmph: 19, occupancyEstimate: 62, provenanceStatus: 'CALIBRATED ESTIMATE' },
                    { vehicleId: 'DL1PC-1003', speedKmph: 28, occupancyEstimate: 35, provenanceStatus: 'CALIBRATED ESTIMATE' },
                  ]).slice(0, 4).map((veh, vIdx) => (
                    <div
                      key={vIdx}
                      onClick={() => setInspectedVehicle(veh)}
                      className={`p-2 border transition-all cursor-pointer flex items-center justify-between ${
                        inspectedVehicle?.vehicleId === veh.vehicleId
                          ? 'border-terracotta bg-terracotta/5'
                          : 'border-divider bg-surface-white hover:border-terracotta'
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-ink block">{veh.vehicleId || `DL1PC-${1000 + vIdx}`}</span>
                        <span className="text-[11px] text-ink-muted">{veh.speedKmph || 22} km/h • {veh.occupancyEstimate || 45} PAX</span>
                      </div>
                      <span className="text-[11px] text-amber-800 bg-amber-50 px-1 py-0.5 border border-amber-200">
                        {veh.provenanceStatus === 'LIVE OBSERVED DATA' ? 'OBSERVED' : 'ESTIMATE'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Provenance Badge */}
              <div className="p-3 border border-divider bg-parchment/40 space-y-1">
                <div className="flex items-center space-x-1.5 text-ink font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                  <span className="uppercase">DATA PROVENANCE</span>
                </div>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Calibrated Research Model (DTC GTFS-aligned topology & ST-GNN prediction).
                </p>
              </div>
            </div>
          ) : selectedStop ? (
            /* Selected Stop Inspector */
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div>
                  <h3 className="font-serif text-2xl font-normal text-ink">
                    {selectedStop.name}
                  </h3>
                  <div className="text-xs text-ink-muted">{selectedStop.hindiName}</div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-parchment border border-divider text-ink uppercase">
                  {selectedStop.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">ZONE</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedStop.zone} Delhi
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[11px] text-ink-muted block">DAILY FOOTFALL</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedStop.dailyFootfall.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedStop.metroInterchange && (
                <div className="p-3 border border-divider bg-parchment/20 space-y-1">
                  <span className="font-mono text-[11px] text-ink-muted uppercase block">
                    METRO MULTIMODAL INTERCHANGE
                  </span>
                  <span className="text-xs font-medium text-ink">
                    {selectedStop.metroInterchange}
                  </span>
                </div>
              )}

              <button
                onClick={() => setSelectedCorridor(DELHI_CORRIDORS[0])}
                className="w-full py-2 border border-ink text-ink font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-surface-white transition-colors"
              >
                Back to Corridors
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-ink-muted flex flex-col items-center justify-center h-full space-y-2">
              <Info className="w-8 h-8 text-stone" />
              <p className="font-serif text-lg text-ink font-normal">No Element Selected</p>
              <p className="text-xs font-light max-w-xs">
                Click on any corridor or stop on the 3D map to view its operational metrics.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
