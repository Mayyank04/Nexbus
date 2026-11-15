'use client';

import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Link from 'next/link';
import { ScrollReveal } from '@/components/ui/scroll-reveal';
import { TextReveal } from '@/components/ui/text-reveal';
import { Magnetic } from '@/components/ui/magnetic';
import { ArrowUpRight, Compass, ShieldCheck, Cpu, Terminal, Eye, Sparkles } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-ivory flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 w-full space-y-20">
        {/* Editorial Heading */}
        <ScrollReveal>
          <div className="max-w-3xl space-y-4">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-terracotta">
              ABOUT NEXBUS / MANIFESTO & ARCHITECTURE
            </span>
            <h1 className="font-serif text-5xl sm:text-7xl text-ink font-normal leading-[0.98]">
              <TextReveal delay={0.05}>Designing for a city that never stops moving.</TextReveal>
            </h1>
            <p className="text-lg sm:text-xl text-ink-light font-light leading-relaxed pt-2">
              NEXBUS was created out of a simple conviction: public transportation in one of the world&apos;s most populous metropolises deserves software crafted with the same architectural dignity as the city itself.
            </p>
          </div>
        </ScrollReveal>

        {/* Section 01: The Visual Philosophy */}
        <ScrollReveal delay={0.1}>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#DED5C8] pt-12 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                01 / AESTHETIC INTEGRITY
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Against the Generic AI Aesthetic
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-ink-light leading-relaxed font-light text-base">
              <p>
                Contemporary software has fallen into an unfortunate trap: dark navy gradients, glowing cyan borders, floating glass cards, and meaningless three-column feature grids that look assembled by an algorithm in seconds.
              </p>
              <p>
                NEXBUS is built on a radically different tradition:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="border border-[#DED5C8] p-6 bg-[#FCFAF6] shadow-sm space-y-2">
                  <h4 className="font-serif text-xl text-ink font-normal">
                    Architectural Visualization
                  </h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Treating 3D geometry not as a decorative canvas gimmick, but as an authentic spatial scale model photographed under soft natural sunlight.
                  </p>
                </div>

                <div className="border border-[#DED5C8] p-6 bg-[#FCFAF6] shadow-sm space-y-2">
                  <h4 className="font-serif text-xl text-ink font-normal">
                    Swiss Editorial Composition
                  </h4>
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Deliberate asymmetric typography, generous whitespace, sharp hairline dividers, and disciplined information hierarchy inspired by classic urban monographs.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 02: Computational Methodology */}
        <ScrollReveal delay={0.15}>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#DED5C8] pt-12 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                02 / DATA PIPELINE
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Reconstructing Delhi&apos;s Origin-Destination Matrix
              </h2>
            </div>

            <div className="lg:col-span-8 space-y-6 text-ink-light leading-relaxed font-light text-base">
              <p>
                How do you know where people are going when only a fraction tap an exit turnstile? Unlike closed metro systems, Delhi&apos;s extensive DTC bus fleet operates with open boarding.
              </p>
              <p>
                Our reconstruction engine fuses three primary streams:
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div className="p-5 border border-[#DED5C8] bg-[#FCFAF6] shadow-sm space-y-1">
                  <div className="text-terracotta uppercase font-medium">STREAM 01: ETM TRANSACTIONS</div>
                  <p className="text-ink-muted font-sans text-xs">
                    Every electronic ticket punch records route number, boarding stop ID, timestamp, and fare stage, yielding exact temporal boarding curves across 420 fare stages.
                  </p>
                </div>

                <div className="p-5 border border-[#DED5C8] bg-[#FCFAF6] shadow-sm space-y-1">
                  <div className="text-terracotta uppercase font-medium">STREAM 02: AVL GPS TELEMETRY</div>
                  <p className="text-ink-muted font-sans text-xs">
                    5-second vehicle tracking pings measuring speed gradients, intersection hold times, and bottleneck congestion points across Outer Ring and Mathura Road.
                  </p>
                </div>

                <div className="p-5 border border-[#DED5C8] bg-[#FCFAF6] shadow-sm space-y-1">
                  <div className="text-terracotta uppercase font-medium">STREAM 03: INTERMODAL BAYESIAN PROBABILITIES</div>
                  <p className="text-ink-muted font-sans text-xs">
                    Alighting estimation via trip chaining algorithms: reconciling passenger morning boardings with evening return origin locations to infer alighting stops with 94.2% accuracy.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Section 03: Platform Standards */}
        <ScrollReveal delay={0.2}>
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-[#DED5C8] pt-12 items-start">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                03 / ENGINEERING STANDARDS
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-ink font-normal">
                Built for Scale & Accessibility
              </h2>
            </div>

            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-[#DED5C8] p-6 bg-[#FCFAF6] shadow-sm space-y-2">
                <span className="font-mono text-xs text-terracotta">PERFORMANCE</span>
                <h4 className="font-serif text-xl text-ink font-normal">Instanced 3D Rendering</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  60 FPS WebGL execution using Three.js instanced geometry and hardware draw call batching, with automated 2D vector fallback when acceleration is unsupported.
                </p>
              </div>

              <div className="border border-[#DED5C8] p-6 bg-[#FCFAF6] shadow-sm space-y-2">
                <span className="font-mono text-xs text-terracotta">RESPONSIVENESS</span>
                <h4 className="font-serif text-xl text-ink font-normal">Fluid Layouts</h4>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Carefully adapted touch states, responsive typography scales, and legible interfaces across laptops, tablets, and phones.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Call to action */}
        <ScrollReveal delay={0.25}>
          <div className="border border-[#DED5C8] p-10 bg-[#FCFAF6] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-serif text-3xl text-ink font-normal">Ready to explore Delhi?</h3>
              <p className="text-xs text-ink-muted font-light">
                Enter the interactive digital twin and inspect live transit corridors.
              </p>
            </div>
            <Magnetic intensity={0.25}>
              <Link
                href="/twin"
                className="px-6 py-3 bg-ink text-ivory text-xs font-mono uppercase tracking-wider hover:bg-terracotta transition-colors shrink-0 shadow-sm inline-block"
              >
                Launch Digital Twin
              </Link>
            </Magnetic>
          </div>
        </ScrollReveal>
      </main>
    </div>
  );
}
