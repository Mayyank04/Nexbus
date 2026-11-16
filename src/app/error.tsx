'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('[UNHANDLED_PAGE_ERROR]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="max-w-lg w-full bg-surface-white border border-divider p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex items-center space-x-2 border-b border-divider pb-4">
          <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
          <span className="font-mono text-xs uppercase tracking-widest text-ink-muted">
            TELEMETRY SUBSYSTEM / ERROR RECOVERY
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl text-ink font-normal">
            Unexpected System Disruption
          </h1>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal">
            An execution failure occurred while processing the transit telemetry view. Operational safety invariant (Read-Only) remains fully engaged.
          </p>
        </div>

        {error?.message && (
          <div className="p-3 bg-amber-50/60 border border-amber-200/80 font-mono text-xs text-amber-950 break-words">
            <span className="font-semibold text-amber-900">DIAGNOSTIC:</span> {error.message}
            {error.digest && (
              <div className="text-[11px] text-amber-800/80 mt-1">
                DIGEST: {error.digest}
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 px-4 py-2.5 bg-ink text-surface-white font-mono text-xs uppercase tracking-wider hover:bg-ink-muted transition-colors text-center"
          >
            Retry Execution
          </button>
          <Link
            href="/"
            className="flex-1 px-4 py-2.5 border border-divider text-ink font-mono text-xs uppercase tracking-wider hover:bg-parchment/40 transition-colors text-center"
          >
            Return to Core
          </Link>
        </div>
      </div>
    </div>
  );
}
