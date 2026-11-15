'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Magnetic } from '@/components/ui/magnetic';
import { Menu, X, ArrowUpRight, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/twin', label: 'Explore' },
    { href: '/methodology', label: 'How it works' },
    { href: '/journey', label: 'Journey Planner' },
    { href: '/simulate', label: 'Simulation' },
    { href: '/control', label: 'Intelligence' },
    { href: '/about', label: 'About' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-ivory/95 backdrop-blur-md border-b border-divider transition-colors">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          {/* Brand Wordmark & Geographic Coordinate */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="group flex items-baseline space-x-2.5">
              <span className="font-serif text-2xl tracking-tight text-ink font-normal group-hover:text-terracotta transition-colors">
                NEXBUS
              </span>
              <span className="font-mono text-[10px] tracking-widest text-ink-muted uppercase border-l border-divider pl-2.5 hidden sm:inline-block">
                DELHI / 28°36&apos;N 77°12&apos;E
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-xs tracking-wider uppercase transition-colors py-1 ${
                    isActive
                      ? 'text-terracotta font-medium'
                      : 'text-ink-muted hover:text-ink font-normal'
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
          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center space-x-2 border border-divider px-3 py-1.5 bg-parchment/40">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
              <span className="font-mono text-[10px] text-ink-muted tracking-tight uppercase">
                {pathname === '/control' || pathname === '/simulate' || pathname === '/methodology'
                  ? 'AUTHORITY SHADOW MODE'
                  : 'COMMUTER INTELLIGENCE'}
              </span>
            </div>

            <Magnetic intensity={0.25} range={60}>
              <Link
                href={pathname === '/control' ? '/journey' : '/control'}
                className="hidden sm:inline-flex items-center justify-center font-mono text-xs uppercase tracking-wider px-4 py-2 border border-ink text-ink bg-ivory hover:bg-ink hover:text-ivory transition-colors"
              >
                {pathname === '/control' ? 'Switch to Commuter' : 'Transit Authority Hub'}
              </Link>
            </Magnetic>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-ink hover:text-terracotta transition-colors"
              aria-label="Toggle navigation menu"
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden fixed top-18 left-0 w-full bg-ivory/98 border-b border-divider z-40 px-6 py-6 shadow-lg backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-sm tracking-wider uppercase font-mono py-2 border-b border-divider/60 flex items-center justify-between ${
                    pathname === link.href ? 'text-terracotta font-semibold' : 'text-ink'
                  }`}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-4 h-4 text-stone" />
                </Link>
              ))}

              <Link
                href="/twin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-ink text-ivory font-mono text-xs uppercase tracking-wider mt-2 hover:bg-terracotta transition-colors"
              >
                Open City Explorer
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
