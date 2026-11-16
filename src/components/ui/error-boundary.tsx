'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[COMPONENT_BOUNDARY_CATCH]', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 border border-divider bg-surface-white text-ink space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              SUBSYSTEM RECOVERY NOTICE
            </span>
          </div>
          <h3 className="font-serif text-lg text-ink font-normal">
            {this.props.fallbackTitle || 'Component Disrupted'}
          </h3>
          <p className="text-xs text-ink-secondary leading-relaxed font-normal">
            {this.props.fallbackMessage ||
              'A rendering disruption occurred within this sub-panel. Other system features remain operational.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-3 py-1.5 border border-divider font-mono text-xs text-ink hover:bg-parchment/40 transition-colors uppercase tracking-wider"
          >
            Retry Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
