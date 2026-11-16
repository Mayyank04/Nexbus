'use client';

import React, { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('[CRITICAL_ROOT_ERROR]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F0E6] text-[#1A1815] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#E2DDD2] p-8 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-[#E2DDD2] pb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B0432B]" />
            <span className="font-mono text-xs uppercase tracking-widest text-[#7D7566]">
              CRITICAL SYSTEM FAULT
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-serif text-[#1A1815] font-normal">
              Platform Unrecoverable Error
            </h1>
            <p className="text-sm text-[#4A443B] leading-relaxed">
              The root layout encountered a critical fault. Physical actuation systems remain disconnected.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => reset()}
              className="w-full px-4 py-2.5 bg-[#1A1815] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider hover:bg-[#7D7566] transition-colors"
            >
              Reset Application State
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
