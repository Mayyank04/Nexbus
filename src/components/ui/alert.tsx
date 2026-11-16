import React from 'react';

export type AlertVariant = 'advisory' | 'warning' | 'info' | 'critical';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'advisory', title, children, className = '' }: AlertProps) {
  const variantStyles: Record<AlertVariant, { container: string; indicator: string; title: string }> = {
    advisory: {
      container: 'bg-amber-50/70 border-amber-200 text-amber-900',
      indicator: 'bg-amber-700',
      title: 'text-amber-950 font-semibold',
    },
    warning: {
      container: 'bg-orange-50/70 border-orange-200 text-orange-900',
      indicator: 'bg-orange-700',
      title: 'text-orange-950 font-semibold',
    },
    critical: {
      container: 'bg-rose-50/70 border-rose-200 text-rose-900',
      indicator: 'bg-rose-700',
      title: 'text-rose-950 font-semibold',
    },
    info: {
      container: 'bg-parchment/60 border-divider text-ink-secondary',
      indicator: 'bg-terracotta',
      title: 'text-ink font-semibold',
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      role="alert"
      className={`p-4 border font-mono text-xs space-y-1.5 ${current.container} ${className}`}
    >
      {title && (
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${current.indicator}`} />
          <span className={`uppercase tracking-wider ${current.title}`}>{title}</span>
        </div>
      )}
      <div className="leading-relaxed font-normal">{children}</div>
    </div>
  );
}
