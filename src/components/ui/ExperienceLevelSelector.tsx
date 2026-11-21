'use client';

import React from 'react';
import { useExperienceLevel, ExperienceLevel } from '@/lib/context/ExperienceLevelContext';
import { Compass, Bus, SlidersHorizontal, HelpCircle } from 'lucide-react';

interface ExperienceLevelSelectorProps {
  compact?: boolean;
  className?: string;
}

export default function ExperienceLevelSelector({
  compact = false,
  className = '',
}: ExperienceLevelSelectorProps) {
  const { level, setLevel, openOnboarding } = useExperienceLevel();

  const options: {
    id: ExperienceLevel;
    label: string;
    shortLabel: string;
    description: string;
    icon: React.ReactNode;
    colorClass: string;
  }[] = [
    {
      id: 'easy',
      label: 'Easy Explore',
      shortLabel: 'Easy',
      description: 'Simple words, clear navigation, and plain-language explanations for everyone.',
      icon: <Compass className="w-3.5 h-3.5 text-emerald-600" />,
      colorClass: 'border-emerald-500 bg-emerald-50/50 text-emerald-950 font-semibold',
    },
    {
      id: 'commuter',
      label: 'Commuter',
      shortLabel: 'Rider',
      description: 'Practical journey planning, connections, and bus fullness for daily travel.',
      icon: <Bus className="w-3.5 h-3.5 text-blue-600" />,
      colorClass: 'border-blue-500 bg-blue-50/50 text-blue-950 font-semibold',
    },
    {
      id: 'advanced',
      label: 'Advanced Analysis',
      shortLabel: 'Analysis',
      description: 'Full transport engineering model with 11 GIS layers, ST-GNN models, and formulas.',
      icon: <SlidersHorizontal className="w-3.5 h-3.5 text-purple-600" />,
      colorClass: 'border-purple-500 bg-purple-50/50 text-purple-950 font-semibold',
    },
  ];

  if (compact) {
    return (
      <div className={`flex items-center space-x-1.5 ${className}`}>
        <div
          role="radiogroup"
          aria-label="Select application experience level"
          className="inline-flex border border-divider bg-surface-white p-0.5 shadow-2xs"
        >
          {options.map((opt) => {
            const isSelected = level === opt.id;
            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isSelected}
                onClick={() => setLevel(opt.id)}
                title={opt.description}
                className={`min-h-[36px] px-2.5 py-1 text-xs font-mono flex items-center space-x-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                  isSelected
                    ? 'bg-ink text-surface-white font-medium shadow-xs'
                    : 'text-ink-secondary hover:text-ink hover:bg-parchment/60'
                }`}
              >
                <span>{opt.icon}</span>
                <span className="hidden sm:inline">{opt.label}</span>
                <span className="sm:hidden">{opt.shortLabel}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={openOnboarding}
          title="Open first-time guide"
          aria-label="Open first-time guide"
          className="min-h-[36px] min-w-[36px] p-2 border border-divider bg-surface-white hover:bg-parchment text-ink-secondary hover:text-ink transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <HelpCircle className="w-4 h-4 text-terracotta" />
        </button>
      </div>
    );
  }

  return (
    <div className={`p-4 border border-divider bg-surface-white shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block">
            EXPERIENCE LEVEL
          </span>
          <span className="text-xs font-medium text-ink">
            Choose how you want NEXBUS to explain things:
          </span>
        </div>
        <button
          onClick={openOnboarding}
          className="text-xs font-mono text-terracotta hover:underline flex items-center space-x-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>First time? Take the tour</span>
        </button>
      </div>

      <div
        role="radiogroup"
        aria-label="Experience level choices"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2"
      >
        {options.map((opt) => {
          const isSelected = level === opt.id;
          return (
            <button
              key={opt.id}
              role="radio"
              aria-checked={isSelected}
              onClick={() => setLevel(opt.id)}
              className={`p-3 text-left border transition-all flex flex-col justify-between space-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                isSelected
                  ? opt.colorClass + ' shadow-sm'
                  : 'border-divider bg-parchment/20 hover:bg-parchment/50 text-ink'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-1.5 font-medium text-xs">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-current" />
                )}
              </div>
              <p className="text-[11px] text-ink-secondary font-normal leading-relaxed">
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
