/**
 * @file useDigitalTwin.ts
 * @module hooks/useDigitalTwin
 * @description Custom hook isolating 3D spatial layer state, playback simulation, and node selection.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { TransitCorridor, BusStop } from '@/data/delhiTransitData';
import { DELHI_CORRIDORS } from '@/data/delhiTransitData';
import type { CrowdingPredictionResponse } from '@/types/prediction';
import { fetchCrowdingPrediction } from '@/lib/api';

export type DigitalTwinLayer =
  | 'all'
  | 'metro'
  | 'buses'
  | 'interchanges'
  | 'demand'
  | 'flow'
  | 'utilization'
  | 'accessibility'
  | 'disruption'
  | 'flood_risk'
  | 'demographics';

export function useDigitalTwin() {
  const [selectedCorridor, setSelectedCorridor] = useState<TransitCorridor | null>(DELHI_CORRIDORS[0]);
  const [selectedStop, setSelectedStop] = useState<BusStop | null>(null);
  const [currentTimeHour, setCurrentTimeHour] = useState<number>(9);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showBuses, setShowBuses] = useState<boolean>(true);
  const [activeLayer, setActiveLayer] = useState<DigitalTwinLayer>('all');
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('3D');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showDeepTelemetry, setShowDeepTelemetry] = useState<boolean>(false);

  const [predictionData, setPredictionData] = useState<CrowdingPredictionResponse['prediction'] | null>(null);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
  const [observedVehicles, setObservedVehicles] = useState<any[]>([]);
  const [inspectedVehicle, setInspectedVehicle] = useState<any | null>(null);
  const [liveFreshnessLag, setLiveFreshnessLag] = useState<number>(14);

  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Ingest live observations
  useEffect(() => {
    fetch('/api/ingestion/observations?limit=16')
      .then((r) => r.json())
      .then((res) => {
        if (res.observations && res.observations.length > 0) {
          setObservedVehicles(res.observations);
          setInspectedVehicle(res.observations[0]);
        }
        if (res.metrics?.freshnessLagSeconds !== undefined) {
          setLiveFreshnessLag(res.metrics.freshnessLagSeconds);
        }
      })
      .catch(() => {});
  }, []);

  // Time-of-day playback loop
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setInterval(() => {
        setCurrentTimeHour((prev) => (prev >= 22 ? 6 : prev + 1));
      }, 1800);
    } else if (playTimerRef.current) {
      clearInterval(playTimerRef.current);
    }
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying]);

  // Fetch crowding prediction when corridor or time changes
  useEffect(() => {
    if (!selectedCorridor) return;
    let isCancelled = false;

    setIsLoadingPrediction(true);
    fetchCrowdingPrediction(selectedCorridor.id, currentTimeHour)
      .then((data) => {
        if (!isCancelled && data && data.prediction) {
          setPredictionData(data.prediction);
        }
      })
      .finally(() => {
        if (!isCancelled) setIsLoadingPrediction(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedCorridor, currentTimeHour]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
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
  };
}
