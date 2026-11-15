'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import { DELHI_CORRIDORS } from '@/data/delhiTransitData';
import {
  TrendingUp,
  Activity,
  Calendar,
  Layers,
  Clock,
  ShieldCheck,
  Compass,
  ArrowUpRight,
  Filter,
} from 'lucide-react';

interface SummaryData {
  metrics: {
    totalDailyPassengers: number;
    networkPunctualityPct: number;
    forecastFidelityPct: number;
    activeElectricFleet: number;
    totalConnectedBuses: number;
    totalMonitoredStops: number;
  };
  temporalDemand: {
    weekday: { hour: string; load: number; passengers: number; confidence: number }[];
    weekend: { hour: string; load: number; passengers: number; confidence: number }[];
  };
  corridorRankings: typeof DELHI_CORRIDORS;
  dwellBottlenecks: {
    stopId: string;
    name: string;
    zone: string;
    dailyFootfall: number;
    avgDwellTimeSeconds: number;
    severity: string;
  }[];
  systemHealth: {
    avlBeaconSyncPct: number;
    gtfsRtFeedLatencySeconds: number;
    etmFareSyncRatePct: number;
    odMatrixValidationScore: number;
  };
}

export default function AnalyticsControlPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [dayType, setDayType] = useState<'weekday' | 'weekend'>('weekday');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/analytics/summary')
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching analytics:', err);
        setIsLoading(false);
      });
  }, []);

  const flowData =
    data?.temporalDemand[dayType] || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1D1A] selection:bg-terracotta selection:text-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-12">
        {/* Editorial Masthead / Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E2DBD0] pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#736C62]">
                AUTHORITY PLATFORM / TRANSPORT OBSERVATORY
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl text-[#1F1D1A] font-normal leading-[1.05]">
              Executive Mobility Observatory
            </h1>
            <p className="text-base text-[#4A463F] font-light leading-relaxed">
              Empirical transit analytics synthesized from {data?.metrics.totalConnectedBuses.toLocaleString() || '3,840'} connected DTC transponders, ETM fare punches, and multi-sensor ridership telemetry.
            </p>
          </div>

          {/* Weekday vs Weekend Filter */}
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[10px] uppercase text-[#736C62]">PATTERN:</span>
            <div className="flex border border-[#E2DBD0] bg-white font-mono text-xs">
              <button
                onClick={() => setDayType('weekday')}
                className={`px-3 py-2 border-r border-[#E2DBD0] transition-colors ${
                  dayType === 'weekday'
                    ? 'bg-[#B84C32] text-white font-medium'
                    : 'text-[#736C62] hover:text-[#1F1D1A]'
                }`}
              >
                Weekday Commute
              </button>
              <button
                onClick={() => setDayType('weekend')}
                className={`px-3 py-2 transition-colors ${
                  dayType === 'weekend'
                    ? 'bg-[#B84C32] text-white font-medium'
                    : 'text-[#736C62] hover:text-[#1F1D1A]'
                }`}
              >
                Weekend Pattern
              </button>
            </div>
          </div>
        </div>

        {/* High-level Operational Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-[#E2DBD0] bg-white p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#736C62] block">
              TOTAL DAILY BOARDINGS
            </span>
            <div className="font-serif text-4xl text-[#1F1D1A] font-normal">
              {data ? (data.metrics.totalDailyPassengers / 1000000).toFixed(2) : '4.28'}M{' '}
              <span className="text-sm font-mono text-[#736C62]">PAX</span>
            </div>
            <div className="flex items-center text-xs text-green-700 font-mono pt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>+4.2% vs previous fortnight</span>
            </div>
          </div>

          <div className="border border-[#E2DBD0] bg-white p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#736C62] block">
              NETWORK ON-TIME RATE
            </span>
            <div className="font-serif text-4xl text-[#B84C32] font-normal">
              {data ? data.metrics.networkPunctualityPct : 81.4}%
            </div>
            <div className="text-xs text-[#736C62] font-mono pt-1">
              Headway variance &lt;3.5 minutes
            </div>
          </div>

          <div className="border border-[#E2DBD0] bg-white p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#736C62] block">
              AI FORECAST FIDELITY
            </span>
            <div className="font-serif text-4xl text-[#1F1D1A] font-normal">
              {data ? data.metrics.forecastFidelityPct : 94.8}%
            </div>
            <div className="text-xs text-[#736C62] font-mono pt-1">
              Calibrated across 45-min lookahead
            </div>
          </div>

          <div className="border border-[#E2DBD0] bg-white p-6 space-y-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#736C62] block">
              ELECTRIFIED FLEET
            </span>
            <div className="font-serif text-4xl text-[#2A5C8A] font-normal">
              {data ? data.metrics.activeElectricFleet.toLocaleString() : '1,640'}
            </div>
            <div className="text-xs text-[#736C62] font-mono pt-1">
              42.7% total DTC fleet electrified
            </div>
          </div>
        </div>

        {/* Large Meaningful Chart: Metropolitan Commuter Hourly Flow */}
        <div className="border border-[#E2DBD0] bg-white p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#E2DBD0] pb-4 gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#B84C32]">
                TEMPORAL DISPERSION PROFILE ({dayType.toUpperCase()})
              </span>
              <h3 className="font-serif text-2xl text-[#1F1D1A] font-normal mt-0.5">
                Hourly System Boardings & Crowding Thresholds
              </h3>
            </div>
            <div className="flex items-center space-x-4 font-mono text-xs text-[#736C62]">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#A69A89]" />
                <span>Normal (&lt;65%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#C89B53]" />
                <span>Moderate (65–85%)</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 bg-[#B84C32]" />
                <span>High (&gt;85%)</span>
              </div>
            </div>
          </div>

          {/* Flow Chart */}
          <div className="space-y-3">
            <div className="h-64 flex items-end justify-between gap-2 border-b border-[#E2DBD0] pb-3">
              {flowData.map((d) => (
                <div key={d.hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-[#24211D] text-[#F5F0E6] font-mono text-[10px] p-2 whitespace-nowrap z-20 pointer-events-none transition-opacity shadow-sm">
                    <div className="font-medium">{d.hour} IST</div>
                    <div>{d.passengers.toLocaleString()} passengers ({d.load}% load)</div>
                  </div>

                  <div
                    className="w-full transition-all group-hover:opacity-90"
                    style={{
                      height: `${(d.load / 100) * 230}px`,
                      backgroundColor:
                        d.load > 85 ? '#B84C32' : d.load > 65 ? '#C89B53' : '#A69A89',
                    }}
                  />
                  <span className="font-mono text-[9px] text-[#736C62] mt-2 hidden sm:block">
                    {d.hour.split(':')[0]}h
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-mono text-[11px] text-[#736C62] pt-1">
              <span>06:00 (FIRST MORNING FEEDERS)</span>
              <span>12:00 (MIDDAY INTERCHANGE BALANCE)</span>
              <span>18:00 (EVENING PEAK SURGE)</span>
              <span>22:00 (TERMINAL WRAP)</span>
            </div>
          </div>
        </div>

        {/* Arterial Corridors Benchmarking Table */}
        <div className="border border-[#E2DBD0] bg-white p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#E2DBD0] pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#B84C32]">
                CORRIDOR COMPARISON
              </span>
              <h3 className="font-serif text-2xl text-[#1F1D1A] font-normal mt-0.5">
                Arterial Transit Velocity & Crowding Benchmarks
              </h3>
            </div>
            <span className="font-mono text-xs text-[#736C62]">
              SORTED BY DAILY PAX VOLUME
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-[#E2DBD0] text-[#736C62] text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Corridor Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4 text-right">Daily Volume</th>
                  <th className="py-3 px-4 text-right">Frequency</th>
                  <th className="py-3 px-4 text-right">Avg Speed</th>
                  <th className="py-3 px-4 text-right">Punctuality</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DBD0]/60">
                {DELHI_CORRIDORS.map((c) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-4 px-4 font-serif text-base text-[#1F1D1A]">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 text-[#736C62]">{c.code}</td>
                    <td className="py-4 px-4 text-right font-medium text-[#1F1D1A]">
                      {c.dailyPassengers.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">{c.busesPerHour} buses/hr</td>
                    <td className="py-4 px-4 text-right">{c.averageSpeedKmH} km/h</td>
                    <td className="py-4 px-4 text-right font-semibold text-[#B84C32]">
                      {c.currentPunctuality}%
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-[10px] uppercase font-medium ${
                          c.status === 'optimal'
                            ? 'bg-green-100 text-green-800'
                            : c.status === 'moderate'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Crowding Hotspots & Reliability Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Critical Crowding Hotspots */}
          <div className="border border-[#E2DBD0] bg-white p-8 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B84C32] block">
              BOTTLENECK VULNERABILITIES
            </span>
            <h3 className="font-serif text-2xl text-[#1F1D1A] font-normal">
              High-Dwell Interchanges
            </h3>
            <p className="text-xs text-[#736C62] font-light leading-relaxed">
              Stops where passenger boarding demand exceeds bus door clearance throughput by 1.3x during peak hours.
            </p>

            <div className="space-y-3 pt-2">
              {(data?.dwellBottlenecks || []).map((stop) => (
                <div
                  key={stop.stopId}
                  className="p-3.5 border border-[#E2DBD0] bg-[#FAF7F2] flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-serif text-lg text-[#1F1D1A] font-normal leading-snug">
                      {stop.name}
                    </h4>
                    <span className="text-[10px] font-mono text-[#736C62]">
                      {stop.zone} Zone • {stop.dailyFootfall.toLocaleString()} daily boardings • Avg Dwell: {stop.avgDwellTimeSeconds}s
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 ${
                      stop.severity === 'critical'
                        ? 'bg-[#B84C32] text-white'
                        : 'bg-[#C89B53] text-white'
                    }`}
                  >
                    {stop.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Coverage & System Health */}
          <div className="border border-[#E2DBD0] bg-white p-8 space-y-4">
            <span className="font-mono text-xs uppercase tracking-wider text-[#B84C32] block">
              INGESTION HEALTH & COVERAGE
            </span>
            <h3 className="font-serif text-2xl text-[#1F1D1A] font-normal">
              Telemetry Pipeline Telemetry
            </h3>
            <p className="text-xs text-[#736C62] font-light leading-relaxed">
              Real-time audit of vehicle tracking beacons, ticket punch sync, and GTFS-RT feed latency.
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex items-center justify-between p-3 border border-[#E2DBD0]">
                <span>DTC AVL BEACON SYNC</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.avlBeaconSyncPct || 99.4}% (3.2s avg latency)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#E2DBD0]">
                <span>GTFS-RT REFRESH INTERVAL</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.gtfsRtFeedLatencySeconds || 3.2}s Streaming
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#E2DBD0]">
                <span>ETM TICKET PUNCH SYNC RATE</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.etmFareSyncRatePct || 98.7}% Batch
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-[#E2DBD0]">
                <span>PASSENGER OD MATRIX RECONSTRUCTION</span>
                <span className="text-[#B84C32] font-semibold">
                  {data ? (data.systemHealth.odMatrixValidationScore * 100).toFixed(1) : '94.2'}% Validation Index
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
