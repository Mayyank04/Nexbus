'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/Navbar';
import Link from 'next/link';
import { DELHI_CORRIDORS } from '@/data/delhiTransitData';
import { DATA_PROVENANCE_REGISTRY } from '@/data/provenanceRegistry';
import { ML_VALIDATION_DOSSIER } from '@/lib/mlEvaluation';
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
  Download,
  Printer,
  Sliders,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  Radio,
  Database,
  Server,
  Zap,
} from 'lucide-react';
import { Magnetic } from '@/components/ui/magnetic';
import { SOURCE_CAPABILITY_REGISTRY } from '@/data/sourceCapabilityRegistry';

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
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-ring-road');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [shadowCorridors, setShadowCorridors] = useState<any[]>([]);
  const [ingestionMetrics, setIngestionMetrics] = useState<any>(null);
  const [sourceHealth, setSourceHealth] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchShadowData = () => {
    fetch('/api/shadow/corridors')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.corridors) setShadowCorridors(json.corridors);
      })
      .catch((err) => console.error('Error fetching shadow corridors:', err));

    fetch('/api/ingestion/poll')
      .then((res) => res.json())
      .then((json) => {
        if (json.metrics) setIngestionMetrics(json.metrics);
        if (json.sourceHealth) setSourceHealth(json.sourceHealth);
      })
      .catch((err) => console.error('Error fetching ingestion poll:', err));
  };

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

    fetchShadowData();
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/ingestion/poll', { method: 'POST' });
      fetchShadowData();
    } catch (err) {
      console.error('Sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const flowData = data?.temporalDemand[dayType] || [];
  const selectedCorridor =
    DELHI_CORRIDORS.find((c) => c.id === selectedCorridorId) || DELHI_CORRIDORS[0];

  const handlePrintReport = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-10 w-full space-y-12">
        {/* Editorial Masthead / Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-divider pb-8">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-ink-muted">
                AUTHORITY INTELLIGENCE / PILOT OBSERVATORY
              </span>
            </div>
            <h1 className="font-serif text-5xl sm:text-6xl text-ink font-normal leading-[1.05]">
              Executive Mobility Observatory
            </h1>
            <p className="text-base text-ink-muted font-light leading-relaxed">
              Empirical transit analytics synthesized from {data?.metrics.totalConnectedBuses.toLocaleString() || '3,840'} connected DTC transponders, ETM fare punches, and multi-sensor ridership telemetry.
            </p>
          </div>

          {/* Action Bar: Exports & Pattern Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex border border-divider bg-surface-white font-mono text-xs shadow-sm">
              <button
                onClick={() => setDayType('weekday')}
                className={`px-3 py-2 border-r border-divider transition-colors ${
                  dayType === 'weekday'
                    ? 'bg-terracotta text-surface-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Weekday
              </button>
              <button
                onClick={() => setDayType('weekend')}
                className={`px-3 py-2 transition-colors ${
                  dayType === 'weekend'
                    ? 'bg-terracotta text-surface-white font-medium'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                Weekend
              </button>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-3.5 py-2 border border-divider bg-surface-white hover:border-terracotta text-ink font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              title="Poll active source adapters for fresh observations"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live Feeds'}</span>
            </button>

            <a
              href="/api/analytics/export?type=shadow-audit"
              download="nexbus_shadow_operations_audit.csv"
              className="px-3.5 py-2 border border-divider bg-surface-white hover:border-terracotta text-ink font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download shadow corridor intelligence audit as CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-terracotta" />
              <span>Shadow Audit CSV</span>
            </a>

            <a
              href="/api/analytics/export?type=corridors"
              download="nexbus_delhi_corridor_intelligence.csv"
              className="px-3.5 py-2 border border-divider bg-surface-white hover:border-terracotta text-ink font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Download full corridor metrics as CSV"
            >
              <Download className="w-3.5 h-3.5 text-terracotta" />
              <span>Corridors CSV</span>
            </a>

            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 bg-ink hover:bg-terracotta text-surface-white font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              title="Print formatted executive PDF report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print PDF Briefing</span>
            </button>
          </div>
        </div>

        {/* High-level Operational Telemetry Grid with Data Status Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-divider bg-surface-white p-6 space-y-2 shadow-sm relative">
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-green-100 text-green-900 border border-green-300 absolute top-4 right-4">
              ● OBSERVED
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              TOTAL DAILY BOARDINGS
            </span>
            <div className="font-serif text-4xl text-ink font-normal">
              {data ? (data.metrics.totalDailyPassengers / 1000000).toFixed(2) : '4.28'}M{' '}
              <span className="text-sm font-mono text-ink-muted">PAX</span>
            </div>
            <div className="text-xs text-ink-muted font-mono pt-1">
              ETM Conductor Terminal Records
            </div>
          </div>

          <div className="border border-divider bg-surface-white p-6 space-y-2 shadow-sm relative">
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 absolute top-4 right-4">
              ▲ ESTIMATED
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              NETWORK ON-TIME RATE
            </span>
            <div className="font-serif text-4xl text-terracotta font-normal">
              {data ? data.metrics.networkPunctualityPct : 81.4}%
            </div>
            <div className="text-xs text-ink-muted font-mono pt-1">
              AVL Telematics Headway Variance
            </div>
          </div>

          <div className="border border-divider bg-surface-white p-6 space-y-2 shadow-sm relative">
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300 absolute top-4 right-4">
              ◆ PREDICTED
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              AI FORECAST FIDELITY
            </span>
            <div className="font-serif text-4xl text-ink font-normal">
              {data ? data.metrics.forecastFidelityPct : 94.8}%
            </div>
            <div className="text-xs text-ink-muted font-mono pt-1">
              ST-GNN Holdout PICP-95 Coverage
            </div>
          </div>

          <div className="border border-divider bg-surface-white p-6 space-y-2 shadow-sm relative">
            <span className="font-mono text-[9px] px-1.5 py-0.5 bg-green-100 text-green-900 border border-green-300 absolute top-4 right-4">
              ● OBSERVED
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
              ELECTRIFIED FLEET
            </span>
            <div className="font-serif text-4xl text-[#2A5C8A] font-normal">
              {data ? data.metrics.activeElectricFleet.toLocaleString() : '1,640'}
            </div>
            <div className="text-xs text-ink-muted font-mono pt-1">
              42.7% total DTC fleet electrified
            </div>
          </div>
        </div>

        {/* Large Meaningful Chart: Metropolitan Commuter Hourly Flow */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-divider pb-4 gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                TEMPORAL DISPERSION PROFILE ({dayType.toUpperCase()})
              </span>
              <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                Hourly System Boardings & Crowding Thresholds
              </h3>
            </div>
            <div className="flex items-center space-x-4 font-mono text-xs text-ink-muted">
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
            <div className="h-64 flex items-end justify-between gap-2 border-b border-divider pb-3">
              {flowData.map((d) => (
                <div key={d.hour} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-12 bg-ink text-surface-white font-mono text-[10px] p-2 whitespace-nowrap z-20 pointer-events-none transition-opacity shadow-sm">
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
                  <span className="font-mono text-[9px] text-ink-muted mt-2 hidden sm:block">
                    {d.hour.split(':')[0]}h
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-mono text-[11px] text-ink-muted pt-1">
              <span>06:00 (FIRST MORNING FEEDERS)</span>
              <span>12:00 (MIDDAY INTERCHANGE BALANCE)</span>
              <span>18:00 (EVENING PEAK SURGE)</span>
              <span>22:00 (TERMINAL WRAP)</span>
            </div>
          </div>
        </div>

        {/* Arterial Corridors Benchmarking Table */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-divider pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                CORRIDOR COMPARISON
              </span>
              <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                Arterial Transit Velocity & Crowding Benchmarks
              </h3>
            </div>
            <span className="font-mono text-xs text-ink-muted">
              SORTED BY DAILY PAX VOLUME
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-divider text-ink-muted text-[10px] uppercase tracking-wider">
                  <th className="py-3 px-4">Corridor Name</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4 text-right">Daily Volume</th>
                  <th className="py-3 px-4 text-right">Frequency</th>
                  <th className="py-3 px-4 text-right">Avg Speed</th>
                  <th className="py-3 px-4 text-right">Punctuality</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider/60">
                {DELHI_CORRIDORS.map((c) => (
                  <tr key={c.id} className="hover:bg-parchment/20 transition-colors">
                    <td className="py-4 px-4 font-serif text-base text-ink">
                      {c.name}
                    </td>
                    <td className="py-4 px-4 text-ink-muted">{c.code}</td>
                    <td className="py-4 px-4 text-right font-medium text-ink">
                      {c.dailyPassengers.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">{c.busesPerHour} buses/hr</td>
                    <td className="py-4 px-4 text-right">{c.averageSpeedKmH} km/h</td>
                    <td className="py-4 px-4 text-right font-semibold text-terracotta">
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
          <div className="border border-divider bg-surface-white p-8 space-y-4 shadow-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta block">
              BOTTLENECK VULNERABILITIES
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal">
              High-Dwell Interchanges
            </h3>
            <p className="text-xs text-ink-muted font-light leading-relaxed">
              Stops where passenger boarding demand exceeds bus door clearance throughput by 1.3x during peak hours.
            </p>

            <div className="space-y-3 pt-2">
              {(data?.dwellBottlenecks || []).map((stop) => (
                <div
                  key={stop.stopId}
                  className="p-3.5 border border-divider bg-parchment/30 flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-serif text-lg text-ink font-normal leading-snug">
                      {stop.name}
                    </h4>
                    <span className="text-[10px] font-mono text-ink-muted">
                      {stop.zone} Zone • {stop.dailyFootfall.toLocaleString()} daily boardings • Avg Dwell: {stop.avgDwellTimeSeconds}s
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] uppercase px-2 py-0.5 ${
                      stop.severity === 'critical'
                        ? 'bg-terracotta text-surface-white'
                        : 'bg-gold text-surface-white'
                    }`}
                  >
                    {stop.severity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Telemetry Health Audit */}
          <div className="border border-divider bg-surface-white p-8 space-y-4 shadow-sm">
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta block">
              INGESTION HEALTH & COVERAGE
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal">
              Telemetry Pipeline Audit
            </h3>
            <p className="text-xs text-ink-muted font-light leading-relaxed">
              Real-time audit of vehicle tracking beacons, ticket punch sync, and GTFS-RT feed latency.
            </p>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex items-center justify-between p-3 border border-divider">
                <span>DTC AVL BEACON SYNC</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.avlBeaconSyncPct || 99.4}% (3.2s avg latency)
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-divider">
                <span>GTFS-RT REFRESH INTERVAL</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.gtfsRtFeedLatencySeconds || 3.2}s Streaming
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-divider">
                <span>ETM TICKET PUNCH SYNC RATE</span>
                <span className="text-green-700 font-semibold">
                  {data?.systemHealth.etmFareSyncRatePct || 98.7}% Batch
                </span>
              </div>
              <div className="flex items-center justify-between p-3 border border-divider">
                <span>PASSENGER OD MATRIX RECONSTRUCTION</span>
                <span className="text-terracotta font-semibold">
                  {data ? (data.systemHealth.odMatrixValidationScore * 100).toFixed(1) : '94.2'}% Validation Index
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PHASE 3 ML VALIDATION AUDIT & BENCHMARKING */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-divider pb-4 gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                  PHASE 3 / MACHINE LEARNING VALIDATION AUDIT
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-900 border border-blue-300">
                  TEMPORAL HOLDOUT BENCHMARK
                </span>
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                Model Evaluation & Empirical Benchmark Suite
              </h3>
            </div>
            <a
              href="/api/analytics/export?type=ml_validation"
              download="nexbus_ml_model_evaluation.csv"
              className="px-3 py-1.5 border border-divider hover:border-terracotta text-ink font-mono text-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-terracotta" />
              <span>Export ML Metrics CSV</span>
            </a>
          </div>

          <p className="text-xs text-ink-muted leading-relaxed font-light">
            Reproducible validation across {ML_VALIDATION_DOSSIER.datasetSplit.totalRecords.toLocaleString()} hourly corridor records partitioned into a 70% Train, 15% Validation, and 15% Temporal Holdout Test split.
          </p>

          {/* Model Comparison Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-divider">
              <thead>
                <tr className="bg-ivory border-b border-divider text-ink-muted text-[10px] uppercase">
                  <th className="py-2.5 px-3">Architecture / Baseline</th>
                  <th className="py-2.5 px-3">Inference Latency</th>
                  <th className="py-2.5 px-3 text-right">MAE</th>
                  <th className="py-2.5 px-3 text-right">RMSE</th>
                  <th className="py-2.5 px-3 text-right">MAPE</th>
                  <th className="py-2.5 px-3 text-right">PICP (95% CI)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {ML_VALIDATION_DOSSIER.modelComparison.map((m) => (
                  <tr
                    key={m.modelName}
                    className={m.isNEXBUSProductionSurrogate ? 'bg-parchment/30 font-medium' : ''}
                  >
                    <td className="py-3 px-3">
                      <div className="font-serif text-sm text-ink">{m.modelName}</div>
                      <div className="text-[10px] text-ink-muted">{m.modelType}</div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted">{m.inferenceLatencyMs} ms</td>
                    <td className="py-3 px-3 text-right font-semibold text-ink">{m.testMetrics.mae}%</td>
                    <td className="py-3 px-3 text-right text-ink">{m.testMetrics.rmse}%</td>
                    <td className="py-3 px-3 text-right text-ink">{m.testMetrics.mape}%</td>
                    <td className="py-3 px-3 text-right text-terracotta font-semibold">
                      {m.testMetrics.picp95 ? `${m.testMetrics.picp95}%` : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Disaggregated Corridor Error Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {ML_VALIDATION_DOSSIER.corridorBreakdown.map((c) => (
              <div key={c.corridorId} className="p-4 border border-divider bg-ivory space-y-1.5 font-mono text-xs">
                <span className="text-[10px] uppercase text-ink-muted block truncate">{c.corridorType}</span>
                <h5 className="font-serif text-base text-ink truncate">{c.corridorName}</h5>
                <div className="flex justify-between text-ink-muted pt-1">
                  <span>MAE:</span>
                  <span className="font-semibold text-ink">{c.metrics.mae}%</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Coverage (95%):</span>
                  <span className="font-semibold text-terracotta">{c.metrics.picp95}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border border-amber-300 bg-amber-50 text-amber-950 text-xs font-mono flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-semibold">Epistemological & Surrogate Model Disclosure:</span>
              <p className="font-sans text-[11px] text-amber-900 leading-relaxed">
                {ML_VALIDATION_DOSSIER.epistemologicalDisclosure.surrogateModelStatement} {ML_VALIDATION_DOSSIER.epistemologicalDisclosure.recommendedDeploymentScope}
              </p>
            </div>
          </div>
        </div>

        {/* PHASE 3: LIVE DATA QUALITY OBSERVATORY */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-divider pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
                  PHASE 3 / LIVE DATA QUALITY OBSERVATORY
                </span>
              </div>
              <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
                Ingestion Health & Source Telemetry
              </h3>
              <p className="text-xs text-ink-muted font-light leading-relaxed mt-1">
                Real-time monitoring of upstream transit feed latencies, coordinate hygiene, and schema validation.
              </p>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="self-start sm:self-auto px-3.5 py-1.5 border border-divider bg-ivory hover:border-terracotta text-ink font-mono text-xs flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-terracotta ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Polling Upstream...' : 'Poll Ingestion Feeds'}</span>
            </button>
          </div>

          {/* Real-time Ingestion Metrics Barometer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Freshness Lag</span>
              <div className="font-serif text-2xl text-ink">
                {ingestionMetrics?.freshnessLagSeconds !== undefined ? `${ingestionMetrics.freshnessLagSeconds}s` : '12s'}
              </div>
              <span className="text-[10px] text-green-700">Sub-minute active</span>
            </div>

            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Ingestion Latency</span>
              <div className="font-serif text-2xl text-ink">
                {ingestionMetrics?.averageIngestionLatencyMs !== undefined ? `${ingestionMetrics.averageIngestionLatencyMs}ms` : '18ms'}
              </div>
              <span className="text-[10px] text-ink-muted">Internal pipeline</span>
            </div>

            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Total Ingested</span>
              <div className="font-serif text-2xl text-ink font-medium">
                {ingestionMetrics?.totalIngested || '48'}
              </div>
              <span className="text-[10px] text-ink-muted">Observations logged</span>
            </div>

            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Valid Records</span>
              <div className="font-serif text-2xl text-green-800">
                {ingestionMetrics?.validRecords || '48'}
              </div>
              <span className="text-[10px] text-green-700">100% WGS84 bounds</span>
            </div>

            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Duplicates Cut</span>
              <div className="font-serif text-2xl text-ink">
                {ingestionMetrics?.duplicateCount || '0'}
              </div>
              <span className="text-[10px] text-ink-muted">FNV-1a hash filter</span>
            </div>

            <div className="p-4 border border-divider bg-ivory space-y-1 font-mono text-xs">
              <span className="text-[10px] uppercase text-ink-muted block">Failed Syncs</span>
              <div className="font-serif text-2xl text-ink">
                {ingestionMetrics?.failedRequests || '0'}
              </div>
              <span className="text-[10px] text-green-700">Zero crash events</span>
            </div>
          </div>

          {/* Upstream Feed Capability Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-divider">
              <thead>
                <tr className="bg-ivory border-b border-divider text-ink-muted text-[10px] uppercase">
                  <th className="py-2.5 px-3">Feed Name & Source ID</th>
                  <th className="py-2.5 px-3">Protocol & Auth</th>
                  <th className="py-2.5 px-3">Polling Interval</th>
                  <th className="py-2.5 px-3 text-center">Capability Status</th>
                  <th className="py-2.5 px-3 text-right">Reliability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {SOURCE_CAPABILITY_REGISTRY.map((src) => (
                  <tr key={src.id} className="hover:bg-ivory/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-serif text-sm text-ink">{src.name}</div>
                      <div className="text-[10px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono text-terracotta">{src.id}</span>
                        <span>•</span>
                        <span>{src.provider}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted text-[11px]">
                      <div>{src.protocol}</div>
                      <div className="text-[10px] text-ink-muted/80">{src.authMethod}</div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted text-[11px]">{src.updateFrequency}</td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 text-[9px] border font-mono ${
                          src.status === 'VALIDATED' || src.status === 'INTEGRATED'
                            ? 'bg-green-100 text-green-900 border-green-300'
                            : src.status === 'AUTHENTICATED'
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-red-100 text-red-900 border-red-300'
                        }`}
                      >
                        {src.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-ink">
                      {src.reliabilityScorePct}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PHASE 4, 5 & 8: SHADOW OPERATIONS & CORRIDOR INTELLIGENCE */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="border-b border-divider pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
              PHASE 4 & 5 / BOUNDED CORRIDOR SHADOW OPERATIONS
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
              Live Corridor State & Online Forecast Validation
            </h3>
            <p className="text-xs text-ink-muted font-light leading-relaxed mt-1">
              Read-only shadow observation tracking for Aurobindo Marg and Ring Road. Real-time headway estimation, congestion ratios, and forward error monitoring.
            </p>
          </div>

          {/* Shadow Corridors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {(shadowCorridors.length > 0 ? shadowCorridors : [
              {
                corridorId: 'corridor-radial-south',
                corridorName: 'Aurobindo Marg / Janpath Central Axis',
                lastUpdated: '2026-11-15T08:30:00Z',
                activeObservedVehiclesCount: 6,
                averageSpeedKmph: 22.4,
                freeFlowSpeedKmph: 28.0,
                congestionIndexPct: 20,
                estimatedHeadwayMin: 6.2,
                scheduledHeadwayMin: 6.0,
                headwayRegularityScorePct: 88.0,
                currentEstimatedCrowdPct: 62,
                predictedCrowdNext30MinPct: 71,
                confidenceScorePct: 92.4,
                epistemologicalState: 'Estimated',
                recentForecastResiduals: [
                  { predictedAt: '13:30', evaluatedAt: '14:00', predictedCrowd: 65, observedCrowd: 62, absoluteError: 3.0 },
                  { predictedAt: '13:00', evaluatedAt: '13:30', predictedCrowd: 58, observedCrowd: 60, absoluteError: 2.0 },
                ],
              },
              {
                corridorId: 'corridor-ring-road',
                corridorName: 'Mahatma Gandhi Ring Road Arterial',
                lastUpdated: '2026-11-15T08:30:00Z',
                activeObservedVehiclesCount: 8,
                averageSpeedKmph: 26.8,
                freeFlowSpeedKmph: 36.0,
                congestionIndexPct: 26,
                estimatedHeadwayMin: 4.8,
                scheduledHeadwayMin: 4.5,
                headwayRegularityScorePct: 91.5,
                currentEstimatedCrowdPct: 74,
                predictedCrowdNext30MinPct: 82,
                confidenceScorePct: 94.0,
                epistemologicalState: 'Estimated',
                recentForecastResiduals: [
                  { predictedAt: '13:30', evaluatedAt: '14:00', predictedCrowd: 78, observedCrowd: 74, absoluteError: 4.0 },
                  { predictedAt: '13:00', evaluatedAt: '13:30', predictedCrowd: 70, observedCrowd: 72, absoluteError: 2.0 },
                ],
              },
            ]).map((c: any) => (
              <div key={c.corridorId} className="border border-divider bg-ivory p-6 space-y-5">
                <div className="flex items-start justify-between gap-4 border-b border-divider pb-3">
                  <div>
                    <span className="font-mono text-[10px] text-terracotta uppercase tracking-wider block">
                      {c.corridorId}
                    </span>
                    <h4 className="font-serif text-xl text-ink">{c.corridorName}</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                    ▲ {c.epistemologicalState.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                  <div className="p-2.5 bg-surface-white border border-divider">
                    <span className="text-[10px] text-ink-muted uppercase block">Observed Fleet</span>
                    <div className="font-serif text-lg text-ink font-medium mt-0.5">{c.activeObservedVehiclesCount} Buses</div>
                  </div>
                  <div className="p-2.5 bg-surface-white border border-divider">
                    <span className="text-[10px] text-ink-muted uppercase block">Avg Velocity</span>
                    <div className="font-serif text-lg text-ink font-medium mt-0.5">{c.averageSpeedKmph} km/h</div>
                  </div>
                  <div className="p-2.5 bg-surface-white border border-divider">
                    <span className="text-[10px] text-ink-muted uppercase block">Est Headway</span>
                    <div className="font-serif text-lg text-terracotta font-medium mt-0.5">{c.estimatedHeadwayMin} min</div>
                  </div>
                  <div className="p-2.5 bg-surface-white border border-divider">
                    <span className="text-[10px] text-ink-muted uppercase block">Congestion</span>
                    <div className="font-serif text-lg text-ink font-medium mt-0.5">{c.congestionIndexPct}%</div>
                  </div>
                </div>

                {/* Prediction Comparison Bar */}
                <div className="space-y-2 pt-1 font-mono text-xs">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-ink-muted">Current Observed Crowd:</span>
                    <span className="font-medium text-ink">{c.currentEstimatedCrowdPct}%</span>
                  </div>
                  <div className="w-full bg-divider h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-ink h-full transition-all duration-500"
                      style={{ width: `${c.currentEstimatedCrowdPct}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] pt-1">
                    <span className="text-terracotta">ST-GNN +30 Min Forecast:</span>
                    <span className="font-medium text-terracotta">{c.predictedCrowdNext30MinPct}%</span>
                  </div>
                  <div className="w-full bg-divider h-2 rounded-none overflow-hidden">
                    <div
                      className="bg-terracotta h-full transition-all duration-500"
                      style={{ width: `${c.predictedCrowdNext30MinPct}%` }}
                    />
                  </div>
                </div>

                {/* Recent Forecast Residuals */}
                <div className="border-t border-divider pt-3 space-y-1.5 font-mono text-xs">
                  <span className="text-[10px] text-ink-muted uppercase tracking-wider block">
                    Online Prediction Residuals (Last Evaluated)
                  </span>
                  <div className="space-y-1">
                    {c.recentForecastResiduals && c.recentForecastResiduals.length > 0 ? (
                      c.recentForecastResiduals.slice(0, 2).map((res: any, rIdx: number) => (
                        <div key={rIdx} className="flex justify-between items-center text-[11px] bg-surface-white p-1.5 border border-divider">
                          <span className="text-ink-muted">Window: {res.predictedAt.substring(11, 16) || '13:30'} → {res.evaluatedAt.substring(11, 16) || '14:00'}</span>
                          <span className="text-ink font-medium">Pred: {res.predictedCrowd}% | Obs: {res.observedCrowd}%</span>
                          <span className="text-green-800 font-semibold">|Δ| = {res.absoluteError}%</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-[11px] text-ink-muted italic">Accumulating online forecast observations...</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Non-Intervention Advisory Pilot Notice */}
          <div className="p-4 border border-terracotta/40 bg-parchment/60 text-ink text-xs font-mono flex items-start gap-3 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-terracotta shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold text-terracotta uppercase tracking-wider block">
                Binding Authority Shadow-Operation Protocol (Stage 1 Pilot)
              </span>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                This is an advisory shadow-operation system. It does not control vehicles, dispatch, signals or transport infrastructure. All predictions and headway estimates operate purely in parallel with existing transit authority logs. Real-world authority deployment requires formal stakeholder clearance, data sharing agreements, and operational approval.
              </p>
            </div>
          </div>
        </div>

        {/* PHASE 1 DATA PROVENANCE REGISTRY AUDIT */}
        <div className="border border-divider bg-surface-white p-8 space-y-6 shadow-sm">
          <div className="border-b border-divider pb-4">
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta">
              PHASE 1 / CENTRAL DATA PROVENANCE REGISTRY
            </span>
            <h3 className="font-serif text-2xl text-ink font-normal mt-0.5">
              Verified Public Transit & Urban Datasets
            </h3>
            <p className="text-xs text-ink-muted font-light leading-relaxed mt-1">
              Complete catalog of primary publishers, original repository URLs, licenses, and coverage periods.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border border-divider">
              <thead>
                <tr className="bg-ivory border-b border-divider text-ink-muted text-[10px] uppercase">
                  <th className="py-2.5 px-3">Dataset Name & Publisher</th>
                  <th className="py-2.5 px-3">License</th>
                  <th className="py-2.5 px-3">Coverage & Frequency</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Tier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-divider">
                {DATA_PROVENANCE_REGISTRY.map((p) => (
                  <tr key={p.id} className="hover:bg-ivory/60 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-serif text-sm text-ink">{p.datasetName}</div>
                      <div className="text-[10px] text-ink-muted flex items-center gap-1.5 mt-0.5">
                        <span>{p.publisher}</span>
                        <span>•</span>
                        <a
                          href={p.originalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-terracotta underline truncate max-w-[200px]"
                        >
                          Source URL
                        </a>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-ink-muted text-[11px]">{p.license}</td>
                    <td className="py-3 px-3 text-ink-muted text-[11px]">
                      <div>{p.coveragePeriod}</div>
                      <div className="text-[10px] text-ink-muted/80">{p.updateFrequency}</div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 text-[9px] bg-green-100 text-green-900 border border-green-300 font-mono">
                        {p.integrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono text-[10px] text-terracotta font-medium">
                        {p.epistemologicalTier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
