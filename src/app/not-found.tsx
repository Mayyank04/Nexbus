'use client';

import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Link from 'next/link';
import { ArrowLeft, Compass, MapPin, Activity, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 w-full flex flex-col justify-center">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-terracotta" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              METROPOLITAN CARTOGRAPHY / STATUS 404
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-ink font-normal leading-[1.02] tracking-tight">
              Waypoint not found in network topology.
            </h1>
            <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase tracking-wider">
              ERROR: UNRESOLVED ROUTE PATH OR TRANSIT RECORD IN NCT OF DELHI MATRIX
            </p>
          </div>

          <p className="text-base sm:text-lg text-ink-secondary max-w-2xl font-light leading-relaxed pt-2">
            The requested terminal, station coordinate, or analytical artifact does not match any registered waypoint in the current schedule or observational ledger. Return to calibrated network coordinates below.
          </p>

          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/"
              className="p-5 border border-divider bg-surface-white hover:border-ink hover:bg-parchment/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-ink-muted uppercase">01 / PLATFORM HOME</span>
                <h3 className="font-serif text-xl text-ink font-normal flex items-center justify-between">
                  Overview
                  <ArrowRight className="w-4 h-4 text-stone group-hover:text-ink transition-colors" />
                </h3>
                <p className="text-xs text-ink-secondary font-light">
                  Metropolitan summary, headline operational metrics, and civic decision framework.
                </p>
              </div>
            </Link>

            <Link
              href="/twin"
              className="p-5 border border-divider bg-surface-white hover:border-terracotta hover:bg-parchment/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-terracotta uppercase">02 / SPATIAL MODEL</span>
                <h3 className="font-serif text-xl text-ink font-normal flex items-center justify-between">
                  Digital Twin
                  <Compass className="w-4 h-4 text-stone group-hover:text-terracotta transition-colors" />
                </h3>
                <p className="text-xs text-ink-secondary font-light">
                  3D isometric and 2D nadir network map of Delhi corridors and transit nodes.
                </p>
              </div>
            </Link>

            <Link
              href="/control"
              className="p-5 border border-divider bg-surface-white hover:border-ink hover:bg-parchment/30 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] text-ink-muted uppercase">03 / OPERATIONS</span>
                <h3 className="font-serif text-xl text-ink font-normal flex items-center justify-between">
                  Live Control
                  <Activity className="w-4 h-4 text-stone group-hover:text-ink transition-colors" />
                </h3>
                <p className="text-xs text-ink-secondary font-light">
                  Passive operational advisory, headway variance, and fleet observation stream.
                </p>
              </div>
            </Link>
          </div>

          <div className="pt-6 border-t border-divider flex items-center justify-between text-xs font-mono text-ink-muted">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-ink hover:text-terracotta transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO PREVIOUS STATION</span>
            </Link>
            <span className="hidden sm:inline">NEXBUS RESEARCH & DECISION-SUPPORT</span>
          </div>
        </div>
      </main>
    </div>
  );
}
