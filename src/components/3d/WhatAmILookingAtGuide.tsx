'use client';

import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Bus,
  MapPin,
  Sparkles,
  Info,
  CheckCircle2,
  Compass,
  X,
} from 'lucide-react';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';

interface QuestionAnswer {
  id: string;
  question: string;
  shortAnswer: string;
  detailedAnswer: string;
  icon: string;
  badge: string;
}

const FAQS: QuestionAnswer[] = [
  {
    id: 'q1',
    question: 'What am I looking at?',
    shortAnswer: 'A computer model of Delhi’s bus and metro routes.',
    detailedAnswer:
      'This is an interactive map showing how public transit connects different parts of Delhi — from the Ring Road in the south to Kashmiri Gate in the north. You are looking at real routes where buses and metro trains run every day.',
    icon: '🗺️',
    badge: 'DELHI MAP',
  },
  {
    id: 'q2',
    question: 'What are these moving lines and dots?',
    shortAnswer: 'Simulated buses following typical schedules (not live satellite GPS).',
    detailedAnswer:
      'The moving markers represent city buses traveling along their scheduled routes. Note: This is an analytical simulation based on published schedules and timetables — it is not real-time satellite GPS tracking of physical vehicles on the road.',
    icon: '🚌',
    badge: 'SIMULATED MOVEMENT',
  },
  {
    id: 'q3',
    question: 'What do the colors mean?',
    shortAnswer: 'Green = not crowded, Yellow = getting busy, Red = very crowded.',
    detailedAnswer:
      'Colors indicate how busy a route or station is estimated to be. 🟢 Green means plenty of seats are available. 🟡 Yellow means some passengers are standing. 🔴 Red indicates peak rush hours with packed vehicles.',
    icon: '🎨',
    badge: 'CROWD LEVEL',
  },
  {
    id: 'q4',
    question: 'Can I touch or click things?',
    shortAnswer: 'Yes! Click any bus stop or line to learn where it goes.',
    detailedAnswer:
      'Feel free to click or tap on any road, bus stop, or vehicle marker. A side card will appear showing the stop name, connecting routes, daily visitors, and metro transfer options.',
    icon: '👆',
    badge: 'INTERACTIVE',
  },
  {
    id: 'q5',
    question: 'Is this real or a simulation?',
    shortAnswer: 'A computer simulation based on real published transit data.',
    detailedAnswer:
      'The routes, stop locations, and schedules are from official public data (DTC, DIMTS, and DMRC). The vehicle movements, crowding predictions, and wait times are simulated by our computer models to help test ideas and plan journeys.',
    icon: '🔬',
    badge: 'ADVISORY MODEL',
  },
];

export default function WhatAmILookingAtGuide({
  onFlyToLandmark,
}: {
  onFlyToLandmark?: (landmark: string) => void;
}) {
  const { level } = useExperienceLevel();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [selectedQ, setSelectedQ] = useState<string | null>('q1');

  // In advanced mode, keep it collapsed by default to save screen real estate
  const isCompact = level === 'advanced';

  return (
    <div
      className="bg-surface-white border border-divider shadow-md transition-all overflow-hidden"
      role="region"
      aria-label="What Am I Looking At Guide"
    >
      {/* Header bar */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full px-4 py-2.5 bg-parchment/60 hover:bg-parchment border-b border-divider flex items-center justify-between text-left transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-full bg-terracotta text-surface-white flex items-center justify-center font-bold text-xs">
            ?
          </span>
          <span className="font-serif text-sm font-medium text-ink">
            What am I looking at?
          </span>
          <span className="font-mono text-[10px] uppercase px-1.5 py-0.5 bg-terracotta/10 text-terracotta border border-terracotta/20 hidden sm:inline">
            5 Simple Answers
          </span>
        </div>
        <div className="flex items-center space-x-1.5 text-xs font-mono text-ink-muted">
          <span>{isOpen ? 'HIDE' : 'SHOW'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Collapsible Content */}
      {isOpen && (
        <div className="p-4 space-y-3">
          {/* Simulation disclaimer notice */}
          <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xs flex items-start space-x-2 text-xs">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Simulated movement — not real-time satellite GPS</p>
              <p className="text-[11px] text-amber-800 leading-normal mt-0.5">
                Vehicles shown are moving based on mathematical models and scheduled frequencies. They show how traffic typically flows, not exact physical coordinates of individual buses right now.
              </p>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-1.5">
            {FAQS.map((faq) => {
              const isExpanded = selectedQ === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`border transition-all ${
                    isExpanded
                      ? 'border-terracotta bg-parchment/30'
                      : 'border-divider bg-surface-white hover:border-stone'
                  }`}
                >
                  <button
                    onClick={() => setSelectedQ(isExpanded ? null : faq.id)}
                    className="w-full p-2.5 text-left flex items-center justify-between gap-2"
                    aria-expanded={isExpanded}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="text-base shrink-0">{faq.icon}</span>
                      <div className="min-w-0">
                        <span className="font-medium text-xs text-ink block truncate">
                          {faq.question}
                        </span>
                        <span className="text-[11px] text-ink-muted block truncate">
                          {faq.shortAnswer}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-ink-muted shrink-0">
                      {isExpanded ? '−' : '+'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 pt-1 border-t border-divider/60 text-xs text-ink-secondary leading-relaxed bg-surface-white/60">
                      <p>{faq.detailedAnswer}</p>
                      <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-stone">
                        <span>TOPIC: {faq.badge}</span>
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Fact-Checked
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Landmark Jump button */}
          {onFlyToLandmark && (
            <div className="pt-2 border-t border-divider flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-ink-muted uppercase">
                SHOW ME SOMETHING COOL:
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => onFlyToLandmark('ring-road')}
                  className="px-2 py-1 bg-parchment border border-divider hover:border-terracotta text-[11px] font-mono text-ink transition-colors"
                >
                  Ring Road
                </button>
                <button
                  onClick={() => onFlyToLandmark('kashmere-gate')}
                  className="px-2 py-1 bg-parchment border border-divider hover:border-terracotta text-[11px] font-mono text-ink transition-colors"
                >
                  Kashmere Gate
                </button>
                <button
                  onClick={() => onFlyToLandmark('cp')}
                  className="px-2 py-1 bg-parchment border border-divider hover:border-terracotta text-[11px] font-mono text-ink transition-colors"
                >
                  Connaught Place
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
