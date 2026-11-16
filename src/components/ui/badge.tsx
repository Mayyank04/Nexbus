import React from 'react';

export type BadgeVariant = 'tier' | 'transit' | 'subtle' | 'outline' | 'alert';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'subtle', className = '' }: BadgeProps) {
  const variantClasses: Record<BadgeVariant, string> = {
    tier: 'bg-terracotta/10 text-terracotta border border-terracotta/30',
    transit: 'bg-emerald-950/10 text-emerald-900 border border-emerald-900/20',
    subtle: 'bg-parchment/60 text-ink-secondary border border-divider',
    outline: 'border border-divider text-ink bg-surface-white',
    alert: 'bg-amber-100/60 text-amber-900 border border-amber-300',
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
