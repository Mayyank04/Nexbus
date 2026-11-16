import React from 'react';
import Navbar from '@/components/navigation/Navbar';
import Footer from '@/components/navigation/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy & Data Governance : NEXBUS Delhi',
  description: 'Civic privacy policy, k-anonymity guarantees, coordinate truncation, and data protection protocols for NEXBUS.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory text-ink selection:bg-terracotta selection:text-surface-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full space-y-12">
        {/* Editorial Heading */}
        <div className="space-y-4 border-b border-divider pb-8">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-ink-muted flex items-center gap-2">
            <Link href="/" className="hover:text-ink hover:underline">NEXBUS</Link>
            <span className="text-divider">/</span>
            <span>Data Governance</span>
          </nav>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-normal leading-tight tracking-tight">
            Privacy Policy & Data Governance
          </h1>
          <p className="text-sm sm:text-base text-ink-secondary leading-relaxed font-normal max-w-prose text-pretty">
            How NEXBUS enforces privacy-by-design, mathematical k-anonymity, and spatial obfuscation to protect citizens while analyzing public transport flows.
          </p>
          <div className="font-mono text-xs text-ink-muted">
            LAST REVISED: 15 NOVEMBER 2026 · AUDIT COMPLIANCE: TIER 01 PASSIVE
          </div>
        </div>

        {/* Section 01: Core Privacy Commitment */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            01. Privacy-by-Design Architecture
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            Urban transit data must never be weaponized for mass civilian surveillance or commuter behavioral tracking. NEXBUS is engineered from the protocol layer with zero Personally Identifiable Information (PII) ingestion.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 border border-divider bg-surface-white space-y-1.5 shadow-xs">
              <div className="font-semibold text-ink">ZERO PII INGESTION</div>
              <p className="text-ink-secondary text-xs leading-relaxed text-pretty">
                Smartcard numbers, payment accounts, mobile identifiers, and facial recognition data are strictly excluded.
              </p>
            </div>
            <div className="p-4 border border-divider bg-surface-white space-y-1.5 shadow-xs">
              <div className="font-semibold text-ink">NO TRACKING COOKIES</div>
              <p className="text-ink-secondary text-xs leading-relaxed text-pretty">
                No Google Analytics, Meta Pixel, advertising beacons, or canvas fingerprinting scripts exist on this domain.
              </p>
            </div>
            <div className="p-4 border border-divider bg-surface-white space-y-1.5 shadow-xs">
              <div className="font-semibold text-ink">AGGREGATED FLOWS ONLY</div>
              <p className="text-ink-secondary text-xs leading-relaxed text-pretty">
                All origin-destination matrices represent statistical aggregates, never individual passenger journeys.
              </p>
            </div>
          </div>
        </section>

        {/* Section 02: Mathematical k-Anonymity (k >= 15) */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            02. Mathematical k-Anonymity Enforcement (k ≥ 15)
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            In Origin-Destination (OD) matrix computation, sparse cells with low commuter volume pose a theoretical re-identification risk. NEXBUS enforces strict k-anonymity with cell suppression:
          </p>
          <div className="p-4 border border-divider bg-surface-white font-mono text-xs space-y-2">
            <div className="text-terracotta font-semibold uppercase">
              GOVERNING PRIVACY CONSTRAINT
            </div>
            <div className="text-ink">
              If CommuterFlow(Origin, Destination, TimeWindow) &lt; 15 pax/hr:
            </div>
            <div className="text-ink-muted pl-4">
              Cell is automatically suppressed from public API and visual layers (Flow = 0 / SUPPRESSED).
            </div>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            This mathematical guarantee ensures that no single commuter trajectory can ever be isolated or reconstructed from published platform matrices.
          </p>
        </section>

        {/* Section 03: Spatial Obfuscation */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            03. Spatial Coordinate Truncation
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            All GPS telemetry ingested from automated vehicle location (AVL) transponders and field research teams is processed through coordinate precision bounding:
          </p>
          <div className="p-4 border border-divider bg-surface-white font-mono text-xs text-ink space-y-1">
            <div>COORDINATE TRUNCATION: 4 DECIMAL PLACES (~11 METERS)</div>
            <div className="text-ink-muted text-xs">
              Raw: 28.6315284° N, 77.2167192° E → Bound: 28.6315° N, 77.2167° E
            </div>
          </div>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            Sub-meter precision is deliberately destroyed during stream normalization to prevent vehicle or driver micro-movement profiling.
          </p>
        </section>

        {/* Section 04: Public Audit & Supervisory Contact */}
        <section className="space-y-4 max-w-prose">
          <h2 className="font-serif text-2xl text-ink font-normal">
            04. Cryptographic Provenance & Inquiries
          </h2>
          <p className="text-sm text-ink-secondary leading-relaxed font-normal text-pretty">
            Every dataset, model weight checkpoint, and field observation batch is sealed with a public SHA-256 cryptographic digest registered in our open audit ledger. For data governance inquiries or independent audits, review the <Link href="/methodology" className="text-terracotta underline font-medium">Methodology Dossier</Link> or submit an institutional query through the <Link href="/control" className="text-terracotta underline font-medium">Authority Control Hub</Link>.
          </p>
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
