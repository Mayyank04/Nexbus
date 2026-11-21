'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useExperienceLevel } from '@/lib/context/ExperienceLevelContext';
import {
  PLAIN_LANGUAGE_DICTIONARY,
  TermDefinition,
  getTerm,
} from '@/lib/content/plainLanguage';
import { Info, X, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';

export interface TwoLevelExplainerProps {
  termKey?: string;
  customTerm?: TermDefinition;
  label?: string;
  className?: string;
  inline?: boolean;
}

export default function TwoLevelExplainer({
  termKey,
  customTerm,
  label,
  className = '',
  inline = false,
}: TwoLevelExplainerProps) {
  const { level } = useExperienceLevel();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const term: TermDefinition | undefined =
    customTerm || (termKey ? getTerm(termKey) : undefined);

  // Close on Escape or click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!term) {
    return <span className={className}>{label}</span>;
  }

  // Display text based on experience level
  const displayedTitle =
    label ||
    (level === 'easy'
      ? term.childFriendly
      : level === 'commuter'
      ? term.plain
      : term.technical);

  return (
    <div
      ref={containerRef}
      className={`relative ${inline ? 'inline-flex items-center' : 'block'} ${className}`}
    >
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        <span className="font-medium text-ink">{displayedTitle}</span>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-parchment hover:bg-stone/20 text-ink-muted hover:text-terracotta border border-divider text-[10px] font-mono transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terracotta"
          title={`Explain ${term.plain} (${term.technical})`}
          aria-expanded={isOpen}
          aria-label={`Detailed explanation for ${displayedTitle}`}
        >
          <Info className="w-2.5 h-2.5" />
        </button>
      </div>

      {/* Accessible Expandable Level 2 Drawer / Popover */}
      {isOpen && (
        <div
          role="region"
          aria-label={`Technical explanation: ${term.technical}`}
          className="absolute z-50 left-0 top-full mt-1.5 w-80 sm:w-96 max-w-[90vw] p-4 bg-surface-white border border-stone shadow-lg text-ink font-sans text-xs space-y-3 animate-in fade-in slide-in-from-top-1"
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-divider pb-2">
            <div>
              <div className="flex items-center gap-1.5 text-terracotta font-mono text-[10px] uppercase tracking-wider">
                <span>{term.icon}</span>
                <span>{term.technical}</span>
              </div>
              <h4 className="font-serif text-base text-ink font-normal mt-0.5">
                {term.plain}
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-ink-muted hover:text-ink p-1 rounded transition-colors"
              aria-label="Close explanation"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Level 1 Simple Summary */}
          <div className="bg-ivory/80 border border-divider/60 p-2.5 space-y-1">
            <span className="font-mono text-[10px] uppercase text-ink-muted font-semibold block">
              PLAIN-LANGUAGE MEANING
            </span>
            <p className="text-ink-secondary leading-relaxed">
              {term.explanation}
            </p>
          </div>

          {/* Level 2 Mathematical Formula (if applicable) */}
          {term.formula && (
            <div className="space-y-1 font-mono text-[11px] bg-parchment/40 border border-divider p-2.5">
              <span className="text-[10px] uppercase text-ink-muted font-semibold block">
                MATHEMATICAL FORMULA
              </span>
              <code className="text-terracotta font-semibold block overflow-x-auto py-0.5">
                {term.formula}
              </code>
            </div>
          )}

          {/* Units & Data Source */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-divider/60 pt-2">
            {term.units && (
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Units:</span>
                <span className="text-ink font-medium">{term.units}</span>
              </div>
            )}
            {term.dataSource && (
              <div>
                <span className="text-[10px] text-ink-muted uppercase block">Data Source:</span>
                <span className="text-ink font-medium truncate block" title={term.dataSource}>
                  {term.dataSource}
                </span>
              </div>
            )}
          </div>

          {/* Key Assumptions */}
          {term.assumptions && term.assumptions.length > 0 && (
            <div className="space-y-1 text-[11px] border-t border-divider/60 pt-2">
              <span className="font-mono text-[10px] uppercase text-ink-muted font-semibold block">
                KEY ASSUMPTIONS
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-ink-secondary">
                {term.assumptions.map((assump, idx) => (
                  <li key={idx} className="leading-tight">
                    {assump}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Known Limitations */}
          {term.limitations && term.limitations.length > 0 && (
            <div className="space-y-1 text-[11px] border-t border-divider/60 pt-2">
              <div className="flex items-center gap-1 font-mono text-[10px] uppercase text-amber-800 font-semibold">
                <AlertCircle className="w-3 h-3" />
                <span>KNOWN LIMITATIONS</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-ink-secondary">
                {term.limitations.map((lim, idx) => (
                  <li key={idx} className="leading-tight">
                    {lim}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
