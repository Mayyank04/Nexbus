import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-ink text-surface-white hover:bg-ink-muted active:bg-ink disabled:bg-divider disabled:text-ink-muted',
    secondary: 'border border-divider bg-surface-white text-ink hover:bg-parchment/40 active:bg-parchment/70 disabled:opacity-50',
    ghost: 'text-ink hover:bg-parchment/40 active:bg-parchment/60 disabled:opacity-40',
    danger: 'bg-terracotta text-surface-white hover:bg-terracotta/90 active:bg-terracotta/80 disabled:opacity-50',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-4 py-2 text-xs sm:text-sm',
    lg: 'px-6 py-3 text-sm',
  };

  return (
    <button
      className={`inline-flex items-center justify-center font-mono uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-terracotta disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>Processing</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
