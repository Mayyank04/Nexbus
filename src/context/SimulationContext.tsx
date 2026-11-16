/**
 * @file SimulationContext.tsx
 * @module context/SimulationContext
 * @description Centralized React Context providing simulation and policy scenario state across components.
 */

'use client';

import React, { createContext, useContext } from 'react';
import { useSimulation } from '@/hooks/useSimulation';

type SimulationContextType = ReturnType<typeof useSimulation>;

const SimulationContext = createContext<SimulationContextType | null>(null);

export function SimulationProvider({ children }: { children: React.ReactNode }) {
  const value = useSimulation();

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}

export function useSimulationContext(): SimulationContextType {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulationContext must be used within a SimulationProvider');
  }
  return context;
}
