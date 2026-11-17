'use client';

import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode already
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  if (!deferredPrompt || isDismissed || isInstalled) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div
      role="banner"
      aria-label="Install App"
      className="fixed bottom-4 right-4 z-50 bg-surface-white border-2 border-ink p-3.5 shadow-xl max-w-sm flex items-center justify-between gap-3 text-ink"
    >
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 bg-ink flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 text-surface-white" />
        </div>
        <div className="space-y-0.5">
          <div className="font-serif text-sm font-normal text-ink leading-tight">
            Install NEXBUS App
          </div>
          <div className="font-mono text-[10px] text-ink-muted">
            Instant offline transit intelligence
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1.5 shrink-0">
        <button
          onClick={handleInstall}
          className="px-2.5 py-1.5 bg-terracotta text-surface-white font-mono text-[11px] uppercase hover:bg-ink transition-colors font-medium"
        >
          Install
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss install prompt"
          className="p-1 text-ink-muted hover:text-ink transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
