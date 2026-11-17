'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    setIsOffline(!navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline && !showReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-4 left-4 z-50 px-3.5 py-2 border font-mono text-xs flex items-center space-x-2 shadow-md transition-all ${
        isOffline
          ? 'bg-amber-100 border-amber-300 text-amber-950'
          : 'bg-emerald-100 border-emerald-300 text-emerald-950'
      }`}
    >
      {isOffline ? (
        <>
          <WifiOff className="w-3.5 h-3.5 text-amber-800" />
          <span>Offline Mode · Showing cached transit intelligence</span>
        </>
      ) : (
        <>
          <Wifi className="w-3.5 h-3.5 text-emerald-800" />
          <span>Reconnected to Delhi Transit Stream</span>
        </>
      )}
    </div>
  );
}
