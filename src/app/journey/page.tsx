'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navigation/Navbar';
import DelhiCityCanvas from '@/components/3d/DelhiCityCanvas';
import { DELHI_STOPS, DELHI_CORRIDORS, BusStop } from '@/data/delhiTransitData';
import {
  MapPin,
  ArrowRight,
  Clock,
  Users,
  Compass,
  CornerDownRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface JourneyOption {
  id: string;
  routeName: string;
  routeCode: string;
  durationMin: number;
  transfers: number;
  departureTime: string;
  arrivalTime: string;
  crowding: 'Low' | 'Moderate' | 'High';
  crowdingScore: number; // 0-100
  confidence: number;
  segments: {
    type: 'walk' | 'bus' | 'transfer';
    title: string;
    detail: string;
    durationMin: number;
    corridorId?: string;
  }[];
}

const PRESET_JOURNEYS: Record<string, JourneyOption[]> = {
  'aiims-cp': [
    {
      id: 'opt-1',
      routeName: 'Direct Route 502 (Electric AC)',
      routeCode: '502 EXP',
      durationMin: 26,
      transfers: 0,
      departureTime: '09:12',
      arrivalTime: '09:38',
      crowding: 'Moderate',
      crowdingScore: 68,
      confidence: 96,
      segments: [
        { type: 'walk', title: 'Walk to AIIMS Main Gate Shelter', detail: '140 m • 2 min', durationMin: 2 },
        {
          type: 'bus',
          title: 'Board Route 502 toward Old Delhi',
          detail: 'Aurobindo Marg Corridor • 6 stops • 22 min',
          durationMin: 22,
          corridorId: 'corridor-radial-south',
        },
        { type: 'walk', title: 'Arrive at Connaught Place Regal Circle', detail: '80 m • 2 min', durationMin: 2 },
      ],
    },
    {
      id: 'opt-2',
      routeName: 'Ring Road TMS + Janpath Feeder',
      routeCode: 'TMS-11',
      durationMin: 34,
      transfers: 1,
      departureTime: '09:15',
      arrivalTime: '09:49',
      crowding: 'Low',
      crowdingScore: 42,
      confidence: 94,
      segments: [
        { type: 'bus', title: 'Ring Road Arterial to Moolchand', detail: '3 stops • 11 min', durationMin: 11, corridorId: 'corridor-ring-road' },
        { type: 'transfer', title: 'Interchange at Moolchand Underpass', detail: 'Sheltered transfer • 4 min', durationMin: 4 },
        { type: 'bus', title: 'Board 419 to Connaught Place', detail: '5 stops • 19 min', durationMin: 19, corridorId: 'corridor-radial-south' },
      ],
    },
  ],
  'kashmere-nehru': [
    {
      id: 'opt-3',
      routeName: 'Outer Ring Rapid Bypass',
      routeCode: 'TMS-CL',
      durationMin: 48,
      transfers: 0,
      departureTime: '09:20',
      arrivalTime: '10:08',
      crowding: 'High',
      crowdingScore: 88,
      confidence: 92,
      segments: [
        { type: 'walk', title: 'ISBT Platform 4', detail: '50 m • 1 min', durationMin: 1 },
        {
          type: 'bus',
          title: 'Board TMS Clockwise Ring Sewa',
          detail: 'Ring Road Arterial • 14 stops • 45 min',
          durationMin: 45,
          corridorId: 'corridor-ring-road',
        },
        { type: 'walk', title: 'Arrive Nehru Place Terminal', detail: '120 m • 2 min', durationMin: 2 },
      ],
    },
  ],
};

export default function JourneyPlannerPage() {
  const [originStop, setOriginStop] = useState<string>('stop-aiims');
  const [destinationStop, setDestinationStop] = useState<string>('stop-cp-regal');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('opt-1');

  const origin = DELHI_STOPS.find((s) => s.id === originStop) || DELHI_STOPS[1];
  const destination = DELHI_STOPS.find((s) => s.id === destinationStop) || DELHI_STOPS[0];

  // Lookup options or fallback
  const journeyPairKey = `${originStop.replace('stop-', '')}-${destinationStop.replace('stop-', '')}`;
  const options = PRESET_JOURNEYS['aiims-cp'];
  const activeOption = options.find((o) => o.id === selectedOptionId) || options[0];

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full">
        {/* Editorial Heading */}
        <div className="mb-10 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
            JOURNEY INTELLIGENCE / PREDICTIVE ROUTING
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal mt-2 leading-[1.05]">
            Find your way across the city.
          </h1>
          <p className="text-base text-ink-light mt-3 font-light leading-relaxed">
            Multi-leg journeys calculated with real-time seat availability heuristics, historical transfer delays, and 3D spatial alignment.
          </p>
        </div>

        {/* Origin / Destination Formulation Bar */}
        <div className="border border-stone-light bg-parchment/40 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Origin */}
            <div className="md:col-span-5 bg-ivory border border-stone-light p-3.5 space-y-1">
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
            <div className="md:col-span-2 flex justify-center">
              <div className="w-9 h-9 rounded-full border border-stone-light bg-ivory flex items-center justify-center text-ink-muted">
                <ArrowRight className="w-4 h-4 text-terracotta" />
              </div>
            </div>

            {/* Destination */}
            <div className="md:col-span-5 bg-ivory border border-stone-light p-3.5 space-y-1">
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
          </div>

          {/* Quick Presets */}
          <div className="mt-4 pt-4 border-t border-stone-light/70 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted mr-2">
              FREQUENT COMMUTES:
            </span>
            <button
              onClick={() => {
                setOriginStop('stop-aiims');
                setDestinationStop('stop-cp-regal');
              }}
              className="font-mono text-xs px-3 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
            >
              AIIMS → Connaught Place
            </button>
            <button
              onClick={() => {
                setOriginStop('stop-kashmere-gate');
                setDestinationStop('stop-nehru-place');
              }}
              className="font-mono text-xs px-3 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
            >
              Kashmere Gate → Nehru Place
            </button>
            <button
              onClick={() => {
                setOriginStop('stop-dhaula-kuan');
                setDestinationStop('stop-anand-vihar');
              }}
              className="font-mono text-xs px-3 py-1 bg-ivory border border-stone/40 hover:border-terracotta text-ink"
            >
              Dhaula Kuan → Anand Vihar
            </button>
          </div>
        </div>

        {/* Layout: Options & 3D Spatial Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Journey Options List */}
          <div className="lg:col-span-5 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block">
              RECOMMENDED TRAJECTORIES ({options.length})
            </span>

            {options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedOptionId(opt.id)}
                  className={`border p-5 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-terracotta bg-ivory shadow-sm ring-1 ring-terracotta/20'
                      : 'border-stone-light bg-parchment/20 hover:border-stone hover:bg-ivory'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-terracotta font-medium">
                        {opt.routeCode}
                      </span>
                      <h3 className="font-serif text-xl text-ink font-normal mt-0.5">
                        {opt.routeName}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-serif text-2xl text-ink font-normal">
                        {opt.durationMin}
                      </span>
                      <span className="text-xs font-mono text-ink-muted ml-1">MIN</span>
                    </div>
                  </div>

                  {/* Horizontal Journey Timeline Summary */}
                  <div className="my-4 py-2 border-y border-stone-light flex items-center space-x-2 font-mono text-xs text-ink-light">
                    <span className="font-semibold text-ink">{opt.departureTime}</span>
                    <div className="flex-1 h-[2px] bg-stone-light relative flex items-center">
                      <div
                        className="h-[2px] bg-terracotta"
                        style={{ width: `${100 - opt.transfers * 20}%` }}
                      />
                    </div>
                    <span className="font-semibold text-ink">{opt.arrivalTime}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-ink-muted">
                    <div>
                      <span>TRANSFERS: </span>
                      <span className="font-medium text-ink">
                        {opt.transfers === 0 ? 'Direct' : `${opt.transfers} Transfer`}
                      </span>
                    </div>
                    <div>
                      <span>CROWDING: </span>
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
                    <div className="text-right">
                      <span>CONFIDENCE: </span>
                      <span className="font-medium text-ink">{opt.confidence}%</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Detailed Timeline Breakdown for Active Option */}
            <div className="border border-stone-light bg-ivory p-5 space-y-4">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted block border-b border-stone-light pb-2">
                STEP-BY-STEP ITINERARY
              </span>

              <div className="space-y-4">
                {activeOption.segments.map((seg, sIdx) => (
                  <div key={sIdx} className="flex items-start space-x-3 text-xs">
                    <div className="mt-0.5">
                      <div className="w-5 h-5 rounded-full border border-stone-light bg-parchment flex items-center justify-center font-mono text-[10px] text-ink">
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
          </div>

          {/* Right: 3D Trajectory Viewer */}
          <div className="lg:col-span-7 border border-stone-light bg-parchment/30 relative min-h-[540px] flex flex-col justify-between">
            <div className="p-4 border-b border-stone-light bg-ivory/80 backdrop-blur-sm flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-terracotta" />
                <span className="font-mono text-xs text-ink tracking-wider uppercase">
                  3D JOURNEY CORRIDOR PREVIEW
                </span>
              </div>
              <span className="font-mono text-[11px] text-ink-muted">
                LIVE TRAJECTORY SIMULATION
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
                <div className="bg-ivory/95 border border-stone-light p-3.5 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="font-mono text-xs text-ink">
                    <span className="text-terracotta uppercase">ACTIVE LEG: </span>
                    <span>AIIMS → CONNAUGHT PLACE (AUROBINDO MARG AXIS)</span>
                  </div>
                  <div className="font-mono text-xs text-ink-muted">
                    ESTIMATED BOARDING IN: 4 MIN
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
