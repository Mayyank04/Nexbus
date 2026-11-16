/**
 * @file useMultimodalPlanner.ts
 * @module hooks/useMultimodalPlanner
 * @description Hook managing multimodal journey planning (Metro, DTC buses, walking transfers).
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { fetchMultimodalJourneyPlans } from '@/lib/api';
import type { MultimodalJourneyPlan } from '@/lib/multimodal/journeyEngine';

export type MultimodalPreference = 'ALL' | 'FASTEST' | 'LEAST_TRANSFERS' | 'BUS_ONLY';
export type CommuterProfile = 'MOHUA' | 'COST_SENSITIVE' | 'EXPRESS';

export function useMultimodalPlanner(
  defaultOrigin = 'stop-aiims',
  defaultDestination = 'stop-cp-regal'
) {
  const [originStop, setOriginStop] = useState<string>(defaultOrigin);
  const [destinationStop, setDestinationStop] = useState<string>(defaultDestination);
  const [preference, setPreference] = useState<MultimodalPreference>('ALL');
  const [requireStepFree, setRequireStepFree] = useState<boolean>(false);
  const [commuterProfile, setCommuterProfile] = useState<CommuterProfile>('MOHUA');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [multimodalPlans, setMultimodalPlans] = useState<MultimodalJourneyPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      const prefParam = preference === 'ALL' ? undefined : preference;
      const res = await fetchMultimodalJourneyPlans(
        originStop,
        destinationStop,
        prefParam,
        requireStepFree
      );
      if (res && res.plans && res.plans.length > 0) {
        setMultimodalPlans(res.plans);
        setSelectedPlanId(res.plans[0].id);
      } else {
        setMultimodalPlans([]);
        setHasError(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [originStop, destinationStop, preference, requireStepFree]);

  const swapStops = useCallback(() => {
    setOriginStop((prev) => {
      setDestinationStop(prev);
      return destinationStop;
    });
  }, [destinationStop]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const activePlan = multimodalPlans.find((p) => p.id === selectedPlanId) || multimodalPlans[0];

  return {
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
    fetchPlans,
    swapStops,
  };
}
