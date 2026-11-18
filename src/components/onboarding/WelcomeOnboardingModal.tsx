'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';
import {
  Sparkles,
  Map,
  Compass,
  Bus,
  Users,
  Sliders,
  CheckCircle,
  X,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from 'lucide-react';

interface OnboardingStep {
  title: string;
  sentence: string;
  icon: React.ReactNode;
  illustrationBg: string;
  badge: string;
  tip: string;
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    badge: 'Step 1 of 7',
    title: 'Welcome to NEXBUS',
    sentence: 'NEXBUS is a welcoming, easy-to-understand guide to public transport in Delhi.',
    icon: <Bus className="w-10 h-10 text-terracotta" />,
    illustrationBg: 'bg-terracotta/10 border-terracotta/30',
    tip: 'No transport engineering knowledge needed — everything is explained in plain English.',
  },
  {
    badge: 'Step 2 of 7',
    title: "Delhi's Transit Map",
    sentence: "This map shows the major roads, bridges, and paths where public transport travels.",
    icon: <Map className="w-10 h-10 text-ink" />,
    illustrationBg: 'bg-parchment border-stone/30',
    tip: 'You can explore in cinematic 3D or switch to an accessible 2D drawing at any time.',
  },
  {
    badge: 'Step 3 of 7',
    title: 'Bus and Metro Routes',
    sentence: 'These colorful lines show where buses and metro trains move across Delhi every day.',
    icon: <Compass className="w-10 h-10 text-blue-700" />,
    illustrationBg: 'bg-blue-50 border-blue-200',
    tip: 'Red, blue, orange, and purple lines trace Delhi’s four primary travel corridors.',
  },
  {
    badge: 'Step 4 of 7',
    title: 'Important Stops & Stations',
    sentence: 'These markers highlight key stations where people board buses and change to metro lines.',
    icon: <Sparkles className="w-10 h-10 text-amber-700" />,
    illustrationBg: 'bg-amber-50 border-amber-200',
    tip: 'Stations like AIIMS and Kashmere Gate let you easily switch between buses and trains.',
  },
  {
    badge: 'Step 5 of 7',
    title: 'Check How Busy Buses Are',
    sentence: 'See simple colors and labels showing if a bus has plenty of seats or is very crowded.',
    icon: <Users className="w-10 h-10 text-emerald-700" />,
    illustrationBg: 'bg-emerald-50 border-emerald-200',
    tip: '🟢 Green = plenty of space, 🟡 Yellow = getting busy, 🔴 Red = very crowded.',
  },
  {
    badge: 'Step 6 of 7',
    title: 'Plan a Comfortable Trip',
    sentence: 'Compare routes to choose between the fastest time, fewer changes, or a comfortable seat.',
    icon: <CheckCircle className="w-10 h-10 text-purple-700" />,
    illustrationBg: 'bg-purple-50 border-purple-200',
    tip: 'Comfort First routes give extra care to elderly passengers, strollers, and wheelchair riders.',
  },
  {
    badge: 'Step 7 of 7',
    title: 'Try Out Transport Ideas',
    sentence: 'Try out fun "what-if" scenarios, like seeing what happens if we add more electric buses!',
    icon: <Sliders className="w-10 h-10 text-terracotta" />,
    illustrationBg: 'bg-terracotta/10 border-terracotta/30',
    tip: 'Learn how cleaner buses help everyone breathe easier and reduce waiting times at stops.',
  },
];

export default function WelcomeOnboardingModal() {
  const { onboardingOpen, closeOnboarding } = useExperienceLevel();
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Keyboard navigation support: Esc to close, Left/Right arrows to navigate
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!onboardingOpen) return;
      if (e.key === 'Escape') {
        closeOnboarding();
      } else if (e.key === 'ArrowRight') {
        if (currentStep < ONBOARDING_STEPS.length - 1) {
          setCurrentStep((prev) => prev + 1);
        } else {
          closeOnboarding();
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
        }
      }
    },
    [onboardingOpen, currentStep, closeOnboarding]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!onboardingOpen) return null;

  const step = ONBOARDING_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      closeOnboarding();
      setCurrentStep(0);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-desc"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-surface-white border-2 border-divider shadow-2xl rounded-none p-6 sm:p-8 space-y-6 text-ink selection:bg-terracotta selection:text-surface-white">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-divider pb-4">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-parchment border border-divider text-ink uppercase tracking-wider">
              {step.badge}
            </span>
            <span className="text-xs font-mono text-ink-muted">Quick Guide</span>
          </div>

          <button
            onClick={closeOnboarding}
            aria-label="Close welcome guide"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-ink-muted hover:text-ink hover:bg-parchment/60 transition-colors border border-transparent hover:border-divider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Visual Illustration */}
        <div className={`p-6 border flex flex-col items-center justify-center space-y-3 ${step.illustrationBg}`}>
          <div className="p-4 bg-surface-white rounded-full shadow-xs border border-divider/60">
            {step.icon}
          </div>
          <h2
            id="onboarding-title"
            className="font-serif text-2xl sm:text-3xl text-ink font-normal text-center leading-snug"
          >
            {step.title}
          </h2>
        </div>

        {/* Step Plain-Language Sentence */}
        <div className="space-y-3 text-center sm:text-left">
          <p
            id="onboarding-desc"
            className="text-base sm:text-lg text-ink font-medium leading-relaxed"
          >
            {step.sentence}
          </p>

          <div className="p-3 bg-parchment/50 border border-divider text-xs text-ink-secondary leading-relaxed flex items-start space-x-2">
            <span className="text-terracotta font-bold text-sm shrink-0">💡</span>
            <span>{step.tip}</span>
          </div>
        </div>

        {/* Step Dots Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 py-1">
          {ONBOARDING_STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              aria-label={`Go to step ${idx + 1}`}
              className={`h-2.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                idx === currentStep
                  ? 'w-8 bg-terracotta'
                  : 'w-2.5 bg-divider hover:bg-ink-muted'
              }`}
            />
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-divider gap-3">
          <div className="flex items-center space-x-2">
            {!isFirst ? (
              <button
                onClick={handleBack}
                className="min-h-[44px] px-4 py-2 border border-divider bg-surface-white hover:bg-parchment text-ink font-mono text-xs uppercase flex items-center space-x-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                onClick={closeOnboarding}
                className="min-h-[44px] px-4 py-2 text-ink-muted hover:text-ink font-mono text-xs uppercase underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                Skip Tour
              </button>
            )}

            {isLast && (
              <button
                onClick={handleRestart}
                aria-label="Replay tour from beginning"
                className="min-h-[44px] px-3 py-2 border border-divider bg-surface-white hover:bg-parchment text-ink-muted hover:text-ink font-mono text-xs flex items-center space-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay</span>
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className="min-h-[44px] px-6 py-2 bg-ink hover:bg-terracotta text-surface-white font-mono text-xs uppercase font-semibold flex items-center space-x-1.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            <span>{isLast ? 'Start Exploring!' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Accessibility & Safety Footer */}
        <div className="text-[10px] font-mono text-center text-ink-muted">
          Use ← / → arrow keys to navigate • Press Esc to close anytime • Read-Only Advisory Platform
        </div>
      </div>
    </div>
  );
}
