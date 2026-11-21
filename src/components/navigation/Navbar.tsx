'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowUpRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ExperienceLevelSelector from '@/components/ui/ExperienceLevelSelector';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/twin', label: 'Explore' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/journey', label: 'Journey Planner' },
    { href: '/simulate', label: 'Simulation' },
    { href: '/control', label: 'Intelligence' },
    { href: '/about', label: 'About' },
  ];

  const isAuthoritySurface = pathname === '/control' || pathname === '/simulate' || pathname === '/methodology';

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-ivory border-b border-divider transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Wordmark & Geographic Coordinate */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link href="/" className="group flex items-baseline space-x-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta">
              <span className="font-serif text-2xl tracking-tight text-ink font-normal group-hover:text-terracotta transition-colors">
                NEXBUS
              </span>
              <span className="font-mono text-[11px] tracking-widest text-ink-muted uppercase border-l border-divider pl-2.5 hidden sm:inline-block">
                DELHI / 28°36&apos;N 77°12&apos;E
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative text-xs tracking-wider uppercase transition-colors py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta ${
                    isActive
                      ? 'text-terracotta font-semibold'
                      : 'text-ink-secondary hover:text-ink font-medium'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-terracotta"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions & Mobile Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Experience Level Selector (Easy Explore / Commuter / Advanced) */}
            <ExperienceLevelSelector compact />

            <div className="hidden xl:flex items-center space-x-2 border border-divider px-2.5 py-1.5 bg-surface-white text-[11px] font-mono text-ink-muted">
              <span className={`w-2 h-2 rounded-full ${isAuthoritySurface ? 'bg-amber-600' : 'bg-status-green'}`} />
              <span className="tracking-wider uppercase">
                {isAuthoritySurface ? 'SHADOW AUDIT' : 'CIVIC TRANSIT'}
              </span>
            </div>

            <Link
              href={pathname === '/control' ? '/journey' : '/control'}
              className="hidden sm:inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-3.5 py-1.5 border border-ink text-ink bg-surface-white hover:bg-ink hover:text-surface-white transition-colors h-9"
            >
              {pathname === '/control' ? 'Switch to Commuter' : 'Authority Hub'}
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink hover:text-terracotta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-16 left-0 w-full bg-ivory border-b border-divider z-40 px-6 py-6 shadow-sm overflow-hidden"
          >
            <div className="flex flex-col space-y-3 font-mono text-xs">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`py-2.5 border-b border-divider/60 flex items-center justify-between uppercase tracking-wider ${
                    pathname === link.href ? 'text-terracotta font-semibold' : 'text-ink'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-stone" />
                </Link>
              ))}

              <div className="pt-2">
                <ExperienceLevelSelector />
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <Link
                  href="/twin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 bg-ink text-surface-white font-mono text-xs uppercase tracking-wider hover:bg-terracotta transition-colors"
                >
                  Explore Digital Twin
                </Link>
                <Link
                  href="/journey"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 border border-ink text-ink bg-surface-white font-mono text-xs uppercase tracking-wider hover:bg-parchment transition-colors"
                >
                  Plan A Journey
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
