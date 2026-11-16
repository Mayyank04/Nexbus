/**
 * @file useJourneyPlanner.ts
 * @module hooks/useJourneyPlanner
 * @description Custom hook isolating journey search, itinerary computation, and route selection business logic.
 */

'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { JourneyPlanOption, JourneyPlanResponse, RoutingCriterion } from '@/types/journey';
import { computeJourneyPlans } from '@/lib/api';

export interface JourneyPlannerState {
  originId: string;
  destinationId: string;
  selectedCriterion: RoutingCriterion;
  departureTime: string;
  stepFree: boolean;
  plans: JourneyPlanOption[];
  selectedPlan: JourneyPlanOption | null;
  isLoading: boolean;
  error: string | null;
  queryDetails: JourneyPlanResponse['query'] | null;
}

export function useJourneyPlanner(defaultOrigin = 'aiims-hub', defaultDestination = 'cp-terminal') {
  const [originId, setOriginId] = useState<string>(defaultOrigin);
  const [destinationId, setDestinationId] = useState<string>(defaultDestination);
  const [selectedCriterion, setSelectedCriterion] = useState<RoutingCriterion>('FASTEST');
  const [departureTime, setDepartureTime] = useState<string>('09:15');
  const [stepFree, setStepFree] = useState<boolean>(false);
  const [plans, setPlans] = useState<JourneyPlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<JourneyPlanOption | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [queryDetails, setQueryDetails] = useState<JourneyPlanResponse['query'] | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const planJourney = useCallback(async () => {
    if (!originId || !destinationId) {
      setError('Please select both origin and destination stops.');
      return;
    }

    if (originId === destinationId) {
      setError('Origin and destination cannot be identical.');
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const response = await computeJourneyPlans(
        originId,
        destinationId,
        new Date().toISOString().split('T')[0],
        departureTime,
        abortControllerRef.current.signal
      );

      if (response && response.success && response.plans.length > 0) {
        setPlans(response.plans);
        setQueryDetails(response.query);
        // Default to selected criterion or first plan
        const matchedPlan = response.plans.find((p) => p.type === selectedCriterion) || response.plans[0];
        setSelectedPlan(matchedPlan);
      } else {
        setError('No verified transit itineraries found for this corridor.');
        setPlans([]);
        setSelectedPlan(null);
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Failed to compute journey itineraries. Please verify network status.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [originId, destinationId, departureTime, selectedCriterion]);

  const swapOriginDestination = useCallback(() => {
    setOriginId((prevOrigin) => {
      setDestinationId(prevOrigin);
      return destinationId;
    });
  }, [destinationId]);

  const selectCriterion = useCallback(
    (criterion: RoutingCriterion) => {
      setSelectedCriterion(criterion);
      if (plans.length > 0) {
        const matching = plans.find((p) => p.type === criterion);
        if (matching) setSelectedPlan(matching);
      }
    },
    [plans]
  );

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    originId,
    setOriginId,
    destinationId,
    setDestinationId,
    selectedCriterion,
    selectCriterion,
    departureTime,
    setDepartureTime,
    stepFree,
    setStepFree,
    plans,
    selectedPlan,
    setSelectedPlan,
    isLoading,
    error,
    queryDetails,
    planJourney,
    swapOriginDestination,
  };
}
