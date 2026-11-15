'use client';

import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Link from 'next/link';
import { ArrowUpRight, Compass, ShieldCheck, Cpu, Terminal, Eye, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 w-full space-y-16">
        {/* Editorial Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              ABOUT NEXBUS / MANIFESTO & ARCHITECTURE
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-ink font-normal leading-[1.05] tracking-tight">
            Designing for a city that never stops moving.
          </h1>
          <p className="text-base sm:text-lg text-ink-secondary font-normal leading-relaxed pt-1">
            NEXBUS was created out of a simple conviction: public transportation in one of the world&apos;s most populous metropolises deserves software crafted with the same architectural dignity as the city itself.
          </p>
        </div>

        {/* Section 01: The Visual Philosophy */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-divider pt-10 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              01 / AESTHETIC INTEGRITY
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
              Against the Generic AI Aesthetic
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6 text-ink-secondary leading-relaxed font-normal text-sm sm:text-base">
            <p>
              Contemporary software has fallen into an unfortunate trap: dark navy gradients, glowing cyan borders, floating glass cards, and meaningless three-column feature grids that look assembled by an algorithm in seconds.
            </p>
            <p>
              NEXBUS is built on a radically different tradition:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
              <div className="border border-divider p-5 sm:p-6 bg-surface-white shadow-sm space-y-2">
                <h4 className="font-serif text-xl text-ink font-normal">
                  Architectural Visualization
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Treating 3D geometry not as a decorative canvas gimmick, but as an authentic spatial scale model photographed under soft natural sunlight.
                </p>
              </div>

              <div className="border border-divider p-5 sm:p-6 bg-surface-white shadow-sm space-y-2">
                <h4 className="font-serif text-xl text-ink font-normal">
                  Swiss Editorial Composition
                </h4>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  Deliberate asymmetric typography, generous whitespace, sharp hairline dividers, and disciplined information hierarchy inspired by classic urban monographs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 02: Computational Methodology */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-divider pt-10 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              02 / DATA PIPELINE
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
              Reconstructing Delhi&apos;s Origin-Destination Matrix
            </h2>
          </div>

          <div className="lg:col-span-8 space-y-6 text-ink-secondary leading-relaxed font-normal text-sm sm:text-base">
            <p>
              How do you know where people are going when only a fraction tap an exit turnstile? Unlike closed metro systems, Delhi&apos;s extensive DTC bus fleet operates with open boarding.
            </p>
            <p>
              Our reconstruction engine fuses three primary streams:
            </p>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-4 sm:p-5 border border-divider bg-surface-white shadow-sm space-y-1">
                <div className="text-terracotta uppercase font-semibold">STREAM 01: ETM TRANSACTIONS</div>
                <p className="text-ink-secondary font-sans text-xs leading-relaxed">
                  Every electronic ticket punch records route number, boarding stop ID, timestamp, and fare stage, yielding exact temporal boarding curves across 420 fare stages.
                </p>
              </div>

              <div className="p-4 sm:p-5 border border-divider bg-surface-white shadow-sm space-y-1">
                <div className="text-terracotta uppercase font-semibold">STREAM 02: AVL GPS TELEMETRY</div>
                <p className="text-ink-secondary font-sans text-xs leading-relaxed">
                  5-second vehicle tracking pings measuring speed gradients, intersection hold times, and bottleneck congestion points across Outer Ring and Mathura Road.
                </p>
              </div>

              <div className="p-4 sm:p-5 border border-divider bg-surface-white shadow-sm space-y-1">
                <div className="text-terracotta uppercase font-semibold">STREAM 03: INTERMODAL BAYESIAN PROBABILITIES</div>
                <p className="text-ink-secondary font-sans text-xs leading-relaxed">
                  Alighting estimation via trip chaining algorithms: reconciling passenger morning boardings with evening return origin locations to infer alighting stops with 94.2% accuracy.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Platform Standards */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-t border-divider pt-10 items-start">
          <div className="lg:col-span-4 space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              03 / ENGINEERING STANDARDS
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-normal">
              Built for Scale & Accessibility
            </h2>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="border border-divider p-5 sm:p-6 bg-surface-white shadow-sm space-y-2">
              <span className="font-mono text-xs text-terracotta font-semibold">PERFORMANCE</span>
              <h4 className="font-serif text-xl text-ink font-normal">Instanced 3D Rendering</h4>
              <p className="text-xs text-ink-secondary leading-relaxed font-normal">
                60 FPS WebGL execution using Three.js instanced geometry and hardware draw call batching, with automated 2D vector fallback when acceleration is unsupported.
              </p>
            </div>

            <div className="border border-divider p-5 sm:p-6 bg-surface-white shadow-sm space-y-2">
              <span className="font-mono text-xs text-terracotta font-semibold">RESPONSIVENESS</span>
              <h4 className="font-serif text-xl text-ink font-normal">Fluid Layouts</h4>
              <p className="text-xs text-ink-secondary leading-relaxed font-normal">
                Carefully adapted touch states, responsive typography scales, and legible interfaces across laptops, tablets, and mobile devices.
              </p>
            </div>
          </div>
        </section>

        {/* Call to action */}
        <div className="border border-divider p-6 sm:p-10 bg-surface-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-normal">Ready to explore Delhi?</h3>
            <p className="text-xs text-ink-secondary font-normal">
              Enter the interactive digital twin and inspect live transit corridors.
            </p>
          </div>
          <Link
            href="/twin"
            className="px-6 py-3 bg-ink text-surface-white text-xs font-mono uppercase tracking-wider hover:bg-terracotta transition-colors shrink-0 shadow-sm inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
          >
            Launch Digital Twin
          </Link>
        </div>
      </main>
    </div>
  );
}
