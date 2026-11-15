'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Overview' },
    { href: '/twin', label: 'Digital Twin' },
    { href: '/journey', label: 'Journey Planner' },
    { href: '/simulate', label: 'Simulation' },
    { href: '/control', label: 'Analytics' },
    { href: '/about', label: 'About' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-ivory/92 backdrop-blur-md border-b border-stone-light transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        {/* Brand Wordmark & Metadata */}
        <div className="flex items-baseline space-x-4">
          <Link href="/" className="group flex items-baseline space-x-2">
            <span className="font-serif text-2xl tracking-tight text-ink font-normal group-hover:text-terracotta transition-colors">
              NEXBUS
            </span>
            <span className="font-mono text-[10px] tracking-widest text-ink-muted uppercase border-l border-stone/50 pl-2 hidden sm:inline-block">
              DELHI / 28°36&apos;N 77°12&apos;E
            </span>
          </Link>
        </div>

        {/* Editorial Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-sm tracking-wide transition-colors py-1 ${
                  isActive
                    ? 'text-terracotta font-medium'
                    : 'text-ink-light hover:text-ink font-normal'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-terracotta" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Live Network Pulse & Action */}
        <div className="flex items-center space-x-5">
          <div className="hidden lg:flex items-center space-x-2 border border-stone/40 px-3 py-1.5 bg-parchment/50">
            <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
            <span className="font-mono text-[11px] text-ink-light tracking-tight">
              DTC FLEET / 3,840 ACTIVE
            </span>
          </div>

          <Link
            href="/twin"
            className="inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-4 py-2 border border-ink text-ink hover:bg-ink hover:text-ivory transition-colors"
          >
            Launch Twin
          </Link>
        </div>
      </div>
    </header>
  );
}
