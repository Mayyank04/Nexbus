/**
 * @file useSimulation.ts
 * @module hooks/useSimulation
 * @description Custom hook isolating counterfactual simulation parameters, API calls, and scenario modeling.
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import type { SimulationResultResponse } from '@/types/simulation';
import { runSimulationEvaluation } from '@/lib/api';
import { DELHI_CORRIDORS } from '@/data/delhiTransitData';

export function useSimulation() {
  const [activeTab, setActiveTab] = useState<'corridor_counterfactual' | 'institutional_interventions'>(
    'corridor_counterfactual'
  );
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('corridor-ring-road');
  const [additionalBuses, setAdditionalBuses] = useState<number>(12);
  const [targetHeadway, setTargetHeadway] = useState<number>(6);
  const [signalPriority, setSignalPriority] = useState<boolean>(true);
  const [timeWindow, setTimeWindow] = useState<string>('evening_peak');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SimulationResultResponse['scenario'] | null>(null);

  // Institutional Scenario Planning
  const [scenarioReport, setScenarioReport] = useState<any | null>(null);
  const [selectedInterventionIds, setSelectedInterventionIds] = useState<string[]>([
    'intervention-brt-vikas-marg',
    'intervention-skywalk-sarai-kale-khan',
    'intervention-headway-synchronization',
    'intervention-feeder-fleet-periphery',
  ]);
  const [isLoadingScenarios, setIsLoadingScenarios] = useState<boolean>(false);

  const selectedCorridor =
    DELHI_CORRIDORS.find((c) => c.id === selectedCorridorId) || DELHI_CORRIDORS[0];

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      const result = await runSimulationEvaluation(
        selectedCorridorId,
        additionalBuses,
        targetHeadway,
        signalPriority
      );
      if (result && result.scenario) {
        setSimulationData(result.scenario);
      }
    } finally {
      setIsSimulating(false);
    }
  }, [selectedCorridorId, additionalBuses, targetHeadway, signalPriority]);

  const resetParameters = useCallback(() => {
    setAdditionalBuses(12);
    setTargetHeadway(6);
    setSignalPriority(true);
    setTimeWindow('evening_peak');
  }, []);

  // Fetch Institutional Scenarios
  useEffect(() => {
    setIsLoadingScenarios(true);
    fetch(`/api/simulation/scenarios?interventions=${selectedInterventionIds.join(',')}`)
      .then((r) => r.json())
      .then((res) => {
        if (res && res.report) {
          setScenarioReport(res.report);
        }
        setIsLoadingScenarios(false);
      })
      .catch(() => setIsLoadingScenarios(false));
  }, [selectedInterventionIds]);

  // Re-run simulation when selected corridor changes
  useEffect(() => {
    runSimulation();
  }, [selectedCorridorId, runSimulation]);

  return {
    activeTab,
    setActiveTab,
    selectedCorridorId,
    setSelectedCorridorId,
    selectedCorridor,
    additionalBuses,
    setAdditionalBuses,
    targetHeadway,
    setTargetHeadway,
    signalPriority,
    setSignalPriority,
    timeWindow,
    setTimeWindow,
    isSimulating,
    simulationData,
    runSimulation,
    resetParameters,
    scenarioReport,
    selectedInterventionIds,
    setSelectedInterventionIds,
    isLoadingScenarios,
  };
}
