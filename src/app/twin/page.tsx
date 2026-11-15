'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
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

export default function DigitalTwinPage() {
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [currentTimeHour, setCurrentTimeHour] = useState<number>(9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showBuses, setShowBuses] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<'volume' | 'crowding' | 'speed' | 'routes' | 'stops'>('volume');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDeepTelemetry, setShowDeepTelemetry] = useState<boolean>(false);

  const [predictionData, setPredictionData] = useState<CrowdingPredictionResponse['prediction'] | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);

  // Playback timer
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentTimeHour((prev) => (prev >= 22 ? 6 : prev + 1));
      }, 1800);
    } else {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  // Fetch prediction when corridor or time changes
  useEffect(() => {
    if (!selectedCorridor) return;
    setIsLoadingPrediction(true);
    fetchCrowdingPrediction(selectedCorridor.id, currentTimeHour)
      .then((res) => {
        if (res && res.prediction) {
          setPredictionData(res.prediction);
        }
        setIsLoadingPrediction(false);
      })
      .catch(() => setIsLoadingPrediction(false));
  }, [selectedCorridor, currentTimeHour]);

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
          TOP: CLEAR TITLE & SELECTED GEOGRAPHIC AREA
         ========================================================================= */}
      <div className="bg-surface-white/95 border-b border-divider px-6 py-2.5 flex items-center justify-between text-xs z-30 shrink-0">
        <div className="flex items-center space-x-3">
          <span className="font-serif text-lg font-normal text-ink">
            Delhi Metropolitan Digital Twin
          </span>
          <span className="text-divider">|</span>
          <span className="font-mono text-[11px] text-ink-muted uppercase">
            AREA: NCT OF DELHI (28°36&apos;N 77°12&apos;E)
          </span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-[11px]">
          <span className="text-ink-muted">LAYER: <strong className="text-terracotta uppercase">{activeLayer}</strong></span>
          <span className="text-divider">|</span>
          <span className="text-ink-muted">TIME: <strong className="text-ink">{currentTimeHour.toString().padStart(2, '0')}:00 IST</strong></span>
        </div>
      </div>

      {/* Main Digital Twin Workbench */}
      <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
        {/* =========================================================================
            LEFT COLUMN: COMPACT LAYER SELECTOR & SEARCH
           ========================================================================= */}
        <aside className="w-full lg:w-76 bg-ivory/95 border-b lg:border-b-0 lg:border-r border-divider flex flex-col z-20 shrink-0 h-auto lg:h-full overflow-y-auto">
          {/* Layer Selector */}
          <div className="p-4 border-b border-divider bg-parchment/30 space-y-2.5">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              NETWORK LAYERS
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'volume', label: 'Volume' },
                  { id: 'crowding', label: 'Crowding' },
                  { id: 'speed', label: 'Speed' },
                  { id: 'routes', label: 'Routes' },
                ] as const
              ).map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`font-mono text-xs py-1.5 px-2 text-center border transition-all ${
                    activeLayer === layer.id
                      ? 'border-terracotta bg-terracotta text-surface-white font-medium'
                      : 'border-divider bg-surface-white text-ink-muted hover:text-ink'
                  }`}
                >
                  {layer.label}
                </button>
              ))}
            </div>

            {/* Layer Legend */}
            <div className="pt-2 border-t border-divider/60 flex items-center justify-between font-mono text-[10px] text-ink-muted">
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
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted block mb-1">
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
                    <span className="font-mono text-[10px] font-medium text-ink-muted">
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
                  <div className="mt-2 pt-1.5 border-t border-divider/60 flex items-center justify-between font-mono text-[9px] text-ink-muted">
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
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted block mb-1">
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
              className="text-terracotta hover:underline uppercase text-[10px]"
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
              className="w-full h-full"
            />

            {/* In-viewport Coordinates */}
            <div className="absolute top-4 left-4 pointer-events-none">
              <div className="bg-surface-white/90 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  GEODETIC DATUM
                </div>
                <div className="font-mono text-xs text-ink font-medium">
                  DELHI METRO AREA / WGS84
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 pointer-events-none">
              <div className="bg-surface-white/90 border border-divider px-3 py-1.5 backdrop-blur-sm shadow-sm text-right space-y-0.5">
                <div className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
                  TIME SLICE & LOAD
                </div>
                <div className="font-mono text-xs font-semibold text-terracotta">
                  {currentTimeHour.toString().padStart(2, '0')}:00 IST /{' '}
                  {predictionData ? `${predictionData.loadPercentage}% LOAD` : 'COMPUTING…'}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              BOTTOM: SIMPLE TIME CONTROLLER & SCRUBBER
             ========================================================================= */}
          <div className="border-t border-divider bg-surface-white/95 p-3 z-20 backdrop-blur-sm">
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

                <span className="font-mono text-[9px] px-2 py-0.5 bg-parchment border border-divider text-ink-muted">
                  {currentTimeHour >= 8 && currentTimeHour <= 10
                    ? 'MORNING PEAK'
                    : currentTimeHour >= 17 && currentTimeHour <= 19
                    ? 'EVENING PEAK'
                    : 'INTER-PEAK'}
                </span>
              </div>

              {/* Slider Scrubber */}
              <div className="w-full md:w-96 flex items-center space-x-3">
                <span className="font-mono text-[9px] text-ink-muted">06:00</span>
                <input
                  type="range"
                  min="6"
                  max="22"
                  step="1"
                  value={currentTimeHour}
                  onChange={(e) => setCurrentTimeHour(parseInt(e.target.value, 10))}
                  className="w-full accent-[#B84C32] cursor-pointer"
                />
                <span className="font-mono text-[9px] text-ink-muted">22:00</span>
              </div>

              <div className="flex items-center space-x-3 font-mono text-xs shrink-0">
                <div className="text-right">
                  <span className="text-ink-muted text-[9px] block">EXPECTED PAX</span>
                  <span className="font-medium text-ink">
                    {predictionData ? predictionData.predictedPassengersPerHour.toLocaleString() : '---'}
                  </span>
                </div>
                <div className="border-l border-divider pl-3 text-right">
                  <span className="text-ink-muted text-[9px] block">CONFIDENCE</span>
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
                  <span className="font-mono text-[9px] uppercase tracking-widest text-terracotta">
                    CORRIDOR TELEMETRY
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
                    {selectedCorridor.name}
                  </h3>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-parchment border border-divider text-ink uppercase">
                  {selectedCorridor.code}
                </span>
              </div>

              <p className="text-xs text-ink-muted leading-relaxed font-light">
                {selectedCorridor.description}
              </p>

              {/* Load & Occupancy Summary Card */}
              {predictionData && (
                <div className="p-4 border border-divider bg-parchment/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                      PREDICTED CABIN LOAD
                    </span>
                    <span
                      className={`font-mono text-[10px] uppercase px-2 py-0.5 ${
                        predictionData.severity === 'critical'
                          ? 'bg-red-100 text-red-900 border border-red-300'
                          : predictionData.severity === 'high'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-green-100 text-green-900 border border-green-300'
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
                    <div className="pt-2 border-t border-divider/60 font-mono text-[10px] text-ink-muted space-y-1">
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
              )}

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[9px] text-ink-muted block">LENGTH</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.lengthKm} KM
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[9px] text-ink-muted block">FREQUENCY</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.busesPerHour} / HR
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[9px] text-ink-muted block">AVG SPEED</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedCorridor.averageSpeedKmH} km/h
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[9px] text-ink-muted block">PUNCTUALITY</span>
                  <span className="font-serif text-lg text-terracotta font-normal">
                    {selectedCorridor.currentPunctuality}%
                  </span>
                </div>
              </div>

              {/* Associated Stops Sequence */}
              <div className="space-y-2 pt-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-ink-muted block">
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

              {/* Data Provenance Badge */}
              <div className="p-3 border border-divider bg-parchment/40 space-y-1">
                <div className="flex items-center space-x-1.5 text-ink font-mono text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-terracotta" />
                  <span className="uppercase">DATA PROVENANCE</span>
                </div>
                <p className="text-[10px] text-ink-muted leading-relaxed font-light">
                  Calibrated Research Model (DTC GTFS-aligned topology & ST-GNN prediction).
                </p>
              </div>
            </div>
          ) : selectedStop ? (
            /* Selected Stop Inspector */
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-divider pb-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-terracotta">
                    INTERCHANGE NODE
                  </span>
                  <h3 className="font-serif text-2xl font-normal text-ink mt-0.5">
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
                  <span className="font-mono text-[9px] text-ink-muted block">ZONE</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedStop.zone} Delhi
                  </span>
                </div>
                <div className="p-2.5 border border-divider bg-surface-white">
                  <span className="font-mono text-[9px] text-ink-muted block">DAILY FOOTFALL</span>
                  <span className="font-serif text-lg text-ink font-normal">
                    {selectedStop.dailyFootfall.toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedStop.metroInterchange && (
                <div className="p-3 border border-divider bg-parchment/20 space-y-1">
                  <span className="font-mono text-[9px] text-ink-muted uppercase block">
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
