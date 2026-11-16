import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-divider bg-surface-white py-14 text-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Brand & Mandate */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-terracotta" />
            <span className="font-serif text-2xl tracking-tight text-ink font-medium">NEXBUS</span>
            <span className="font-mono text-xs text-ink-muted">/ NCT OF DELHI</span>
          </div>
          <p className="text-xs text-ink-secondary leading-relaxed font-normal max-w-sm">
            Public urban mobility intelligence and advisory decision-support platform for Delhi. Reconciling empirical telemetry, spatial graph models, and multimodal equity.
          </p>
          <div className="font-mono text-[11px] text-ink-muted">
            SAFETY INVARIANT: READ-ONLY + PASSIVE + ADVISORY · NO AUTOMATED DISPATCH
          </div>
        </div>

        {/* Platform Links */}
        <div className="md:col-span-2 space-y-2 font-mono text-xs">
          <span className="text-terracotta uppercase tracking-wider block mb-2 font-semibold">
            PLATFORM
          </span>
          <div><Link href="/twin" className="hover:text-terracotta text-ink-secondary transition-colors">Spatial Twin</Link></div>
          <div><Link href="/journey" className="hover:text-terracotta text-ink-secondary transition-colors">Journey Planner</Link></div>
          <div><Link href="/simulate" className="hover:text-terracotta text-ink-secondary transition-colors">Scenario Lab</Link></div>
          <div><Link href="/control" className="hover:text-terracotta text-ink-secondary transition-colors">Control Hub</Link></div>
        </div>

        {/* Research & Governance Links */}
        <div className="md:col-span-2 space-y-2 font-mono text-xs">
          <span className="text-terracotta uppercase tracking-wider block mb-2 font-semibold">
            GOVERNANCE
          </span>
          <div><Link href="/methodology" className="hover:text-terracotta text-ink-secondary transition-colors">Methodology</Link></div>
          <div><Link href="/about" className="hover:text-terracotta text-ink-secondary transition-colors">About System</Link></div>
          <div><Link href="/terms" className="hover:text-terracotta text-ink-secondary transition-colors font-medium">Terms of Use</Link></div>
          <div><Link href="/privacy" className="hover:text-terracotta text-ink-secondary transition-colors font-medium">Privacy Policy</Link></div>
        </div>

        {/* Geographic Reference */}
        <div className="md:col-span-3 space-y-2 font-mono text-xs">
          <span className="text-terracotta uppercase tracking-wider block font-semibold">
            GEODETIC REFERENCE
          </span>
          <p className="text-ink-secondary text-[11px] leading-relaxed">
            Datum: WGS 84 / UTM Zone 43N (EPSG:7761)<br />
            Reference Node: Connaught Place Radial Center (28.6315° N, 77.2167° E)<br />
            Open Mobility Accord · GODL-India / ODbL
          </p>
        </div>
      </div>
    </footer>
  );
}
