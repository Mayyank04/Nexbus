'use client';

import React from 'react';
import {
  Compass,
  MapPin,
  Bus,
  Train,
  Users,
  Route,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  X,
  Sparkles,
  Info,
} from 'lucide-react';

export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  childFriendlyTip: string;
  highlightType: 'overview' | 'roads' | 'buses' | 'stops' | 'metro' | 'crowding';
  badge: string;
  cameraFocus: {
    target: [number, number, number];
    position: [number, number, number];
  };
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'This is Delhi!',
    subtitle: 'Step 1 of 6 · The Great Capital City',
    description:
      'Welcome to Delhi! Millions of people travel across our historic city every single day to go to school, visit friends, and explore monuments like India Gate and the Red Fort.',
    childFriendlyTip:
      'Did you know? Delhi is one of the oldest cities in the world and has over 30 million neighbors living and traveling together!',
    highlightType: 'overview',
    badge: 'DELHI OVERVIEW',
    cameraFocus: {
      target: [0, 0, 0],
      position: [48, 54, 62],
    },
  },
  {
    id: 2,
    title: 'These are the Big Roads',
    subtitle: 'Step 2 of 6 · Ring Roads & Grand Avenues',
    description:
      'Look at the smooth wide roads looping around the city. The Ring Road and Outer Ring Road help cars, autos, and buses travel between North, South, East, and West Delhi smoothly.',
    childFriendlyTip:
      'The Ring Road makes a big giant circle around Delhi so you can travel all around without getting stuck in tiny alleys!',
    highlightType: 'roads',
    badge: 'ARTERIAL ROADS',
    cameraFocus: {
      target: [0, 0, 0],
      position: [12, 70, 24],
    },
  },
  {
    id: 3,
    title: 'These are Delhi Buses',
    subtitle: 'Step 3 of 6 · Electric & CNG City Buses',
    description:
      'See those moving boxes on the paths? Those are city buses! Red buses run quietly on electric batteries with zero smoke. Green buses run on clean CNG natural gas.',
    childFriendlyTip:
      'Delhi has more than 7,000 public buses. Each bus can carry up to 60 passengers at once, saving space on the road!',
    highlightType: 'buses',
    badge: 'BUS NETWORK',
    cameraFocus: {
      target: [4, 0, 10],
      position: [24, 28, 36],
    },
  },
  {
    id: 4,
    title: 'This is a Bus Stop',
    subtitle: 'Step 4 of 6 · Where People Meet & Board',
    description:
      'The glowing circles on the road are bus stops. Passengers stand under the shelter to wait for their bus, check arrival times, and hop on safely.',
    childFriendlyTip:
      'Look for the big bus stop marker at AIIMS or Connaught Place. You can tap any stop to see its name and which buses visit it!',
    highlightType: 'stops',
    badge: 'BUS STOPS',
    cameraFocus: {
      target: [0, 0.5, 16],
      position: [10, 14, 24],
    },
  },
  {
    id: 5,
    title: 'Metro & Bus Connect Together',
    subtitle: 'Step 5 of 6 · Multimodal Rail & Road',
    description:
      'Delhi has super-fast Metro trains zooming underground and up on bridges. Big hubs like Kashmiri Gate and Rajiv Chowk let you hop off a train and straight onto a bus.',
    childFriendlyTip:
      'When buses and trains work together like a team, traveling across the entire city takes less than an hour!',
    highlightType: 'metro',
    badge: 'METRO + BUS HUBS',
    cameraFocus: {
      target: [0, 0, 0],
      position: [20, 32, 28],
    },
  },
  {
    id: 6,
    title: 'Busy Times & Quiet Times',
    subtitle: 'Step 6 of 6 · Smart Crowding Colors',
    description:
      'In the morning when school and offices open, buses are full. We color quiet buses green (lots of seats!), busy buses amber, and crowded buses terracotta red.',
    childFriendlyTip:
      'Congratulations, Explorer! You now know how Delhi moves. Use the Journey Planner to find the best route for your next trip!',
    highlightType: 'crowding',
    badge: 'EXPLORER GRADUATE',
    cameraFocus: {
      target: [0, 0, 0],
      position: [38, 44, 52],
    },
  },
];

interface EasyExploreTutorialProps {
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onClose: () => void;
  className?: string;
}

export default function EasyExploreTutorial({
  currentStepIndex,
  onStepChange,
  onClose,
  className = '',
}: EasyExploreTutorialProps) {
  const step = TUTORIAL_STEPS[currentStepIndex] || TUTORIAL_STEPS[0];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TUTORIAL_STEPS.length - 1;

  return (
    <div
      className={`bg-surface-white border-2 border-ink shadow-lg p-5 sm:p-6 max-w-lg w-full transition-all text-ink selection:bg-terracotta selection:text-surface-white ${className}`}
      role="region"
      aria-label="Interactive Guided Tour of Delhi Transit"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-divider pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            EXPLORE DELHI · GUIDED TOUR
          </span>
          <span className="font-mono text-[11px] px-2 py-0.5 bg-parchment text-ink border border-divider">
            {step.badge}
          </span>
        </div>
        <button
          onClick={onClose}
          aria-label="Close guided tutorial"
          className="p-1 hover:bg-parchment text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Pills */}
      <div className="flex items-center space-x-1.5 mb-4" aria-label="Tour progress">
        {TUTORIAL_STEPS.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => onStepChange(idx)}
            aria-label={`Go to ${s.title}`}
            aria-current={idx === currentStepIndex ? 'step' : undefined}
            className={`flex-1 h-2 transition-all ${
              idx === currentStepIndex
                ? 'bg-terracotta'
                : idx < currentStepIndex
                ? 'bg-ink'
                : 'bg-divider'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="font-mono text-xs text-ink-muted">{step.subtitle}</div>
        <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal leading-tight">
          {step.title}
        </h3>
        <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal">
          {step.description}
        </p>

        {/* Friendly Tip Box */}
        <div className="p-3 bg-parchment/60 border border-divider flex items-start space-x-3 text-xs sm:text-sm text-ink-secondary">
          <span className="text-base select-none shrink-0">💡</span>
          <p className="leading-snug">{step.childFriendlyTip}</p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="pt-5 mt-4 border-t border-divider flex items-center justify-between gap-3">
        <button
          onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
          disabled={isFirst}
          className={`px-3 py-2 border font-mono text-xs uppercase flex items-center space-x-1.5 transition-colors ${
            isFirst
              ? 'opacity-40 cursor-not-allowed border-divider text-ink-muted'
              : 'border-divider hover:border-ink text-ink bg-surface-white hover:bg-parchment'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center space-x-2">
          {isLast ? (
            <button
              onClick={() => onStepChange(0)}
              className="px-3 py-2 border border-divider hover:border-ink font-mono text-xs uppercase flex items-center space-x-1.5 text-ink hover:bg-parchment transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          ) : null}

          <button
            onClick={() => {
              if (isLast) {
                onClose();
              } else {
                onStepChange(currentStepIndex + 1);
              }
            }}
            className="px-4 py-2 bg-ink hover:bg-terracotta text-surface-white font-mono text-xs uppercase flex items-center space-x-1.5 transition-colors font-medium shadow-xs"
          >
            <span>{isLast ? 'Finish Tour' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
