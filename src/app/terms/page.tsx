import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Advisory Use : NEXBUS Delhi',
  description: 'Terms of advisory service, operational invariants, open data licensing, and research protocols for NEXBUS.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-12">
        {/* Editorial Heading */}
        <div className="space-y-4 border-b border-divider pb-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-ink-muted flex items-center gap-2">
            <Link href="/" className="hover:text-ink hover:underline">NEXBUS</Link>
            <span className="text-divider">/</span>
            <span>Legal Governance</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-normal leading-tight tracking-tight">
            Terms of Advisory Service
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal max-w-prose text-pretty">
            Operational boundaries, data licensing compliance, and analytical research protocols governing the National Capital Territory of Delhi public mobility intelligence platform.
          </p>
          <div className="font-mono text-xs text-ink-muted">
            EFFECTIVE DATE: 15 NOVEMBER 2026 · VERSION 2.4-CIVIC
          </div>
        </div>

        {/* Section 01: Core Operational Invariant */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            01. Operational Invariant: Read-Only, Passive, Advisory
          </h2>
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 font-mono text-xs space-y-1">
            <div className="font-semibold uppercase tracking-wider">
              ▲ MANDATORY OPERATIONAL SAFETY INVARIANT
            </div>
            <div className="leading-relaxed text-pretty">
              NEXBUS operates exclusively as a passive decision-support and civic intelligence layer. The platform does not possess or exercise physical actuation authority over traffic signals, automated bus dispatch systems, or vehicle routing units.
            </div>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            All analytical outputs, crowd predictions, and schedule recommendations are advisory in nature. Operational authorities, depot managers, and transport planners maintain sole responsibility for operational decisions.
          </p>
        </section>

        {/* Section 02: Open Data Licensing & Attribution */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            02. Data Provenance & Open Data Licensing
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            NEXBUS integrates and conflates open transit telemetry published under recognized public data frameworks:
          </p>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 border border-divider bg-surface-white space-y-1">
              <div className="font-semibold text-ink">GNCTD Open Transport Data (OTD)</div>
              <div className="text-ink-muted text-xs leading-relaxed text-pretty">
                Static schedules (GTFS) and real-time vehicle positions (GTFS-RT) accessed under Government Open Data License - India (GODL-India).
              </div>
            </div>
            <div className="p-3.5 border border-divider bg-surface-white space-y-1">
              <div className="font-semibold text-ink">OpenStreetMap (OSM) Road Network</div>
              <div className="text-ink-muted text-xs leading-relaxed text-pretty">
                Street centerlines and stop geometries conflated under the Open Database License (ODbL).
              </div>
            </div>
            <div className="p-3.5 border border-divider bg-surface-white space-y-1">
              <div className="font-semibold text-ink">Central Pollution Control Board (CPCB)</div>
              <div className="text-ink-muted text-xs leading-relaxed text-pretty">
                Ambient particulate air quality indices integrated via data.gov.in public API terms.
              </div>
            </div>
          </div>
        </section>

        {/* Section 03: Epistemic Classification */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            03. Epistemic Classification & Confidence Intervals
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            To prevent black-box deception, users must acknowledge the epistemic boundaries of all data presented:
          </p>
          <ul className="space-y-2 text-sm text-ink-secondary font-normal list-disc pl-5 text-pretty">
            <li><strong>Tier 01 (Observed):</strong> Verifiable hardware telemetry from conductor ETM smartcard punches and GPS transponders.</li>
            <li><strong>Tier 02 (Estimated):</strong> Statistical inferences, including trip chaining for passenger alighting and Furness OD matrix balancing.</li>
            <li><strong>Tier 03 (Predicted):</strong> Spatio-Temporal Graph Neural Network forecasts, delivered with explicit 95% Bayesian credible intervals.</li>
            <li><strong>Tier 04 (Counterfactual):</strong> Synthetic micro-simulations of policy interventions, strictly modeling hypothetical outcomes.</li>
          </ul>
        </section>

        {/* Section 04: Research Use & Citation Protocol */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            04. Research Citation & Academic Protocol
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            Scholarly publications, urban research institutes, and civic organizations using NEXBUS data, models, or evaluations are requested to cite the platform as:
          </p>
          <div className="p-4 border border-divider bg-surface-white font-mono text-xs text-ink select-all leading-relaxed text-pretty">
            NEXBUS Research Consortium (2026). Urban Mobility Intelligence & Decision-Support System for Delhi (Version 2.4). National Capital Territory of Delhi Open Transit Science Project. https://github.com/Mayyank04/Nexbus
          </div>
        </section>

        {/* Back Link */}
        <div className="pt-6 border-t border-divider">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 font-mono text-xs uppercase tracking-wider text-terracotta hover:underline font-medium"
          >
            <span>← Return to Delhi Spatial Intelligence</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
