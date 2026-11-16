import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  deltaPositive?: boolean;
  subtext?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaPositive,
  subtext,
  className = '',
}: StatCardProps) {
  return (
    <div className={`border border-divider bg-surface-white p-4 space-y-2 shadow-xs ${className}`}>
      <div className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        {label}
      </div>
      <div className="flex items-baseline space-x-1.5">
        <span className="font-mono text-2xl sm:text-3xl font-medium text-ink tracking-tight">
          {value}
        </span>
        {unit && <span className="font-mono text-xs text-ink-muted">{unit}</span>}
      </div>
      {(delta || subtext) && (
        <div className="flex items-center space-x-2 font-mono text-xs">
          {delta && (
            <span
              className={
                deltaPositive === true
                  ? 'text-emerald-800'
                  : deltaPositive === false
                  ? 'text-terracotta'
                  : 'text-ink-secondary'
              }
            >
              {delta}
            </span>
          )}
          {subtext && <span className="text-ink-muted text-[11px]">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
