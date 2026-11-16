import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Swiss Editorial Transit Skeleton Loader
 * Employs a calm parchment tone that harmonizes with warm ivory (#F5F0E6)
 * without jarring white flashes or artificial saturation.
 */
export function Skeleton({ className = '', ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-[#E8DFC9]/70 border border-divider/30 ${className}`}
      {...props}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`p-5 border border-divider bg-surface-white space-y-3 shadow-xs ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <div className="pt-3 border-t border-divider/50 flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}

export function SkeletonTelemetryStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 border border-divider bg-surface-white">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-2.5 w-24" />
        </div>
      ))}
    </div>
  );
}
