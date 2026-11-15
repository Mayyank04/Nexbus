'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import {
  DELHI_CORRIDORS,
  DELHI_STOPS,
  DELHI_ROUTES,
  HOURLY_FLOW_DATA,
  TransitCorridor,
  BusStop,
  TransitRoute,
} from '@/data/delhiTransitData';
import {
  Layers,
  Clock,
  Info,
  Maximize2,
  Compass,
  Activity,
  ShieldCheck,
  ChevronRight,
  Filter,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function DigitalTwinPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<TransitRoute | null>(DELHI_ROUTES[1]); // Ring Sewa
  const [currentTimeHour, setCurrentTimeHour] = useState<number>(9);
  const [showBuses, setShowBuses] = useState<boolean>(true);
  const [showStops, setShowStops] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<'flow' | 'crowding' | 'punctuality'>('flow');

  const currentHourData = HOURLY_FLOW_DATA.find(
    (h) => parseInt(h.hour.split(':')[0], 10) === currentTimeHour
  ) || HOURLY_FLOW_DATA[3];

  return (
    <div className="h-screen flex flex-col bg-ivory text-ink overflow-hidden selection:bg-terracotta selection:text-ivory">
      <Navbar />

      {/* Main Digital Twin Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* =========================================================================
            LEFT COLUMN: COMPACT ROUTE & LAYER SELECTOR
           ========================================================================= */}
        <aside className="w-full lg:w-80 bg-ivory/95 border-b lg:border-b-0 lg:border-r border-stone-light flex flex-col z-20 shrink-0 h-auto lg:h-full overflow-y-auto">
          {/* Header */}
          <div className="p-5 border-b border-stone-light">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
                GEOSPATIAL TWIN / DELHI
              </span>
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-ink mt-1">
              Corridor Explorer
            </h1>
            <p className="text-xs text-ink-muted mt-1 font-light leading-relaxed">
              Arterial routes reconstructed from automated fare collection & GPS feeds.
            </p>
          </div>

          {/* Layer Mode Selector */}
          <div className="p-4 border-b border-stone-light bg-parchment/30">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-2">
              HEATMAP LAYER
            </span>
            <div className="grid grid-cols-3 gap-1">
              {(
                [
                  { id: 'flow', label: 'Volume' },
                  { id: 'crowding', label: 'Crowd' },
                  { id: 'punctuality', label: 'Speed' },
                ] as const
              ).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`font-mono text-xs py-1.5 px-2 text-center border transition-all ${
                    activeLayer === layer.id
                      ? 'border-terracotta bg-terracotta text-ivory font-medium'
                      : 'border-stone/40 bg-ivory text-ink-muted hover:text-ink'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corridors List */}
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
              ACTIVE CORRIDORS ({DELHI_CORRIDORS.length})
            </span>

            {DELHI_CORRIDORS.map((corridor) => {
              const isSelected = selectedCorridor?.id === corridor.id;
              return (
                <div
                  key={corridor.id}
                  onClick={() => {
                    setSelectedCorridor(corridor);
                    setSelectedStop(null);
                  }}
                  className={`p-3.5 border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-terracotta bg-parchment/80 shadow-sm'
                      : 'border-stone-light bg-ivory hover:border-stone hover:bg-parchment/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
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
                  <div className="mt-2.5 pt-2 border-t border-stone-light/60 flex items-center justify-between font-mono text-[10px] text-ink-muted">
                    <span>{corridor.busesPerHour} BUSES/HR</span>
                    <span className="text-terracotta font-medium uppercase">
                      {corridor.status}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Stops Filter */}
            <div className="pt-4">
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-2">
                CRITICAL INTERCHANGES
              </span>
              <div className="space-y-1.5">
                {DELHI_STOPS.slice(0, 4).map((stop) => (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setSelectedStop(stop);
                      setSelectedCorridor(null);
                    }}
                    className={`w-full text-left p-2 border font-mono text-xs flex items-center justify-between transition-colors ${
                      selectedStop?.id === stop.id
                        ? 'border-terracotta bg-terracotta/10 text-terracotta font-medium'
                        : 'border-stone-light bg-ivory text-ink-light hover:border-stone'
                    }`}
                  >
                    <span>{stop.name}</span>
                    <span className="text-[10px] text-ink-muted">{stop.code}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Toggle Controls */}
          <div className="p-4 border-t border-stone-light bg-parchment/40 flex items-center justify-between font-mono text-xs">
            <button
              onClick={() => setShowBuses(!showBuses)}
              className="flex items-center space-x-1.5 text-ink-light hover:text-ink"
            >
              {showBuses ? <Eye className="w-3.5 h-3.5 text-terracotta" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>3D FLEET</span>
            </button>
            <span className="text-stone">|</span>
            <button
              onClick={() => {
                setSelectedCorridor(DELHI_CORRIDORS[0]);
                setSelectedStop(null);
              }}
              className="text-terracotta hover:underline uppercase text-[11px]"
            >
              RESET VIEW
            </button>
          </div>
        </aside>

        {/* =========================================================================
            CENTER: 3D CITY AND TRANSPORT NETWORK VIEWPORT
           ========================================================================= */}
        <main className="flex-1 relative bg-parchment/30 flex flex-col min-h-[400px]">
          {/* Main 3D Canvas */}
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
              className="w-full h-full"
            />

            {/* In-viewport Compass & Spatial Coordinates */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-ivory/90 border border-stone-light px-3 py-1.5 backdrop-blur-sm shadow-sm space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  GEODETIC SYSTEM
                </div>
                <div className="font-mono text-xs text-ink font-medium">
                  DELHI METRO AREA / WGS84
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-ivory/90 border border-stone-light px-3 py-1.5 backdrop-blur-sm shadow-sm text-right space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  CURRENT TIME WINDOW
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  {currentHourData.hour} IST / {currentHourData.load}% LOAD
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM: REFINED TIME EXPLORER & TELEMETRY SCRUBBER
             ========================================================================= */}
          <div className="border-t border-stone-light bg-ivory/95 p-4 z-20 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-3 shrink-0">
                <Clock className="w-4 h-4 text-terracotta" />
                <span className="font-mono text-xs uppercase tracking-wider text-ink font-medium">
                  TIME EXPLORER: {currentHourData.hour}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-parchment border border-stone/40 text-ink-muted">
                  {currentTimeHour >= 8 && currentTimeHour <= 11
                    ? 'MORNING PEAK'
                    : currentTimeHour >= 17 && currentTimeHour <= 20
                    ? 'EVENING PEAK'
                    : 'INTER-PEAK'}
                </span>
              </div>

              {/* Slider Scrubber */}
              <div className="w-full md:w-96 flex items-center space-x-3">
                <span className="font-mono text-[10px] text-ink-muted">06:00</span>
                <input
                  type="range"
                  min="6"
                  max="22"
                  step="1"
                  value={currentTimeHour}
                  onChange={(e) => setCurrentTimeHour(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B84C32] cursor-pointer"
                />
                <span className="font-mono text-[10px] text-ink-muted">22:00</span>
              </div>

              {/* Real-time Confidence */}
              <div className="flex items-center space-x-4 font-mono text-xs shrink-0">
                <div className="text-right">
                  <span className="text-ink-muted text-[10px] block">PREDICTED PAX</span>
                  <span className="font-medium text-ink">
                    {currentHourData.passengers.toLocaleString()}
                  </span>
                </div>
                <div className="border-l border-stone-light pl-4 text-right">
                  <span className="text-ink-muted text-[10px] block">CONFIDENCE</span>
                  <span className="font-medium text-terracotta">
                    {currentHourData.confidence}% CI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* =========================================================================
            RIGHT COLUMN: CONTEXTUAL INFORMATION INSPECTOR
           ========================================================================= */}
        <aside className="w-full lg:w-96 bg-ivory border-t lg:border-t-0 lg:border-l border-stone-light flex flex-col z-20 shrink-0 h-auto lg:h-full overflow-y-auto">
          {selectedCorridor ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-light pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
                    CORRIDOR TELEMETRY
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
                    {selectedCorridor.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-parchment border border-stone/40 text-ink uppercase">
                  {selectedCorridor.code}
                </span>
              </div>

              <p className="text-xs text-ink-light leading-relaxed font-light">
                {selectedCorridor.description}
              </p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">LENGTH</span>
                  <span className="font-serif text-xl text-ink font-normal">
                    {selectedCorridor.lengthKm} KM
                  </span>
                </div>
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">FREQUENCY</span>
                  <span className="font-serif text-xl text-ink font-normal">
                    {selectedCorridor.busesPerHour} / HR
                  </span>
                </div>
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">AVG SPEED</span>
                  <span className="font-serif text-xl text-ink font-normal">
                    {selectedCorridor.averageSpeedKmH} km/h
                  </span>
                </div>
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">PUNCTUALITY</span>
                  <span className="font-serif text-xl text-terracotta font-normal">
                    {selectedCorridor.currentPunctuality}%
                  </span>
                </div>
              </div>

              {/* Associated Stops Sequence */}
              <div className="space-y-3 pt-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
                  CORRIDOR STOPS SEQUENCE
                </span>
                <div className="space-y-2 border-l border-terracotta/40 pl-3 ml-1">
                  {selectedCorridor.stops.map((stopId, sIdx) => {
                    const stop = DELHI_STOPS.find((s) => s.id === stopId);
                    if (!stop) return null;
                    return (
                      <div
                        key={stop.id}
                        onClick={() => setSelectedStop(stop)}
                        className="cursor-pointer group flex items-start justify-between py-1"
                      >
                        <div>
                          <span className="text-xs font-medium text-ink group-hover:text-terracotta transition-colors block">
                            {stop.name}
                          </span>
                          <span className="text-[10px] text-ink-muted font-light">
                            {stop.hindiName}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-ink-muted">
                          {stop.dailyFootfall.toLocaleString()} pax/d
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Data Provenance & Confidence */}
              <div className="p-4 border border-stone-light bg-parchment/40 space-y-2">
                <div className="flex items-center space-x-2 text-ink">
                  <ShieldCheck className="w-4 h-4 text-terracotta" />
                  <span className="font-mono text-xs uppercase tracking-wider">
                    DATA PROVENANCE
                  </span>
                </div>
                <p className="text-[11px] text-ink-muted leading-relaxed font-light">
                  Ingested from DTC AVL (Automated Vehicle Location) GPS beacons @ 5-second intervals and electronic ticketing ETM transactions.
                </p>
                <div className="font-mono text-[10px] text-ink-light pt-1">
                  SAMPLE SIZE: 184,200 RECORDS / 95% CONFIDENCE
                </div>
              </div>
            </div>
          ) : selectedStop ? (
            /* Selected Stop Inspector */
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-stone-light pb-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-terracotta">
                    INTERCHANGE NODE
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
                    {selectedStop.name}
                  </h3>
                  <div className="text-xs text-ink-muted">{selectedStop.hindiName}</div>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-parchment border border-stone/40 text-ink uppercase">
                  {selectedStop.code}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">ZONE</span>
                  <span className="font-serif text-xl text-ink font-normal">
                    {selectedStop.zone} Delhi
                  </span>
                </div>
                <div className="p-3 border border-stone-light bg-parchment/30">
                  <span className="font-mono text-[10px] text-ink-muted block">DAILY FOOTFALL</span>
                  <span className="font-serif text-xl text-ink font-normal">
                    {selectedStop.dailyFootfall.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedStop.metroInterchange && (
                <div className="p-4 border border-stone-light bg-parchment/20 space-y-1">
                  <span className="font-mono text-[10px] text-ink-muted uppercase block">
                    METRO MULTIMODAL INTERCHANGE
                  </span>
                  <span className="text-xs font-medium text-ink">
                    {selectedStop.metroInterchange}
                  </span>
                </div>
              )}

              <button
                onClick={() => setSelectedCorridor(DELHI_CORRIDORS[0])}
                className="w-full py-2.5 border border-ink text-ink font-mono text-xs uppercase tracking-wider hover:bg-ink hover:text-ivory transition-colors"
              >
                Back to Corridors
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-ink-muted flex flex-col items-center justify-center h-full space-y-2">
              <Info className="w-8 h-8 text-stone" />
              <p className="font-serif text-lg text-ink font-normal">No Element Selected</p>
              <p className="text-xs font-light max-w-xs">
                Click on any 3D corridor or bus stop in the viewport to inspect its operational metrics.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
