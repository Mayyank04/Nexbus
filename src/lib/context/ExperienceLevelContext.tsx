'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ExperienceLevel = 'easy' | 'commuter' | 'advanced';

export interface ExperienceLevelContextType {
  level: ExperienceLevel;
  setLevel: (level: ExperienceLevel) => void;
  isEasy: boolean;
  isCommuter: boolean;
  isAdvanced: boolean;
  onboardingOpen: boolean;
  setOnboardingOpen: (open: boolean) => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

const ExperienceLevelContext = createContext<ExperienceLevelContextType | undefined>(undefined);

const STORAGE_KEY = 'nexbus_user_experience_level';

export function ExperienceLevelProvider({ children }: { children: ReactNode }) {
  // Always default to 'easy' on initial render for 100% deterministic SSR/Client hydration
  const [level, setLevelState] = useState<ExperienceLevel>('easy');
  const [onboardingOpen, setOnboardingOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ExperienceLevel;
      if (saved && (saved === 'easy' || saved === 'commuter' || saved === 'advanced')) {
        setLevelState(saved);
      }
    } catch {
      // LocalStorage unavailable (e.g. incognito or private browsing)
    }
  }, []);

  const setLevel = (newLevel: ExperienceLevel) => {
    setLevelState(newLevel);
    try {
      localStorage.setItem(STORAGE_KEY, newLevel);
    } catch {
      // LocalStorage write error fallback
    }
  };

  const openOnboarding = () => setOnboardingOpen(true);
  const closeOnboarding = () => setOnboardingOpen(false);

  return (
    <ExperienceLevelContext.Provider
      value={{
        level,
        setLevel,
        isEasy: level === 'easy',
        isCommuter: level === 'commuter',
        isAdvanced: level === 'advanced',
        onboardingOpen,
        setOnboardingOpen,
        openOnboarding,
        closeOnboarding,
      }}
    >
      {children}
    </ExperienceLevelContext.Provider>
  );
}

export function useExperienceLevel(): ExperienceLevelContextType {
  const context = useContext(ExperienceLevelContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      level: 'easy',
      setLevel: () => {},
      isEasy: true,
      isCommuter: false,
      isAdvanced: false,
      onboardingOpen: false,
      setOnboardingOpen: () => {},
      openOnboarding: () => {},
      closeOnboarding: () => {},
    };
  }
  return context;
}
