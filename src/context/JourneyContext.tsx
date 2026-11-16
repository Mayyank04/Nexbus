/**
 * @file JourneyContext.tsx
 * @module context/JourneyContext
 * @description Centralized React Context providing global journey planning state and dispatchers.
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useJourneyPlanner } from '@/hooks/useJourneyPlanner';

type JourneyContextType = ReturnType<typeof useJourneyPlanner>;

const JourneyContext = createContext<JourneyContextType | null>(null);

export function JourneyProvider({
  children,
  defaultOrigin,
  defaultDestination,
}: {
  children: React.ReactNode;
  defaultOrigin?: string;
  defaultDestination?: string;
}) {
  const value = useJourneyPlanner(defaultOrigin, defaultDestination);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney(): JourneyContextType {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error('useJourney must be used within a JourneyProvider');
  }
  return context;
}
