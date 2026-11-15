'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BusStop, DELHI_STOPS } from '@/data/delhiTransitData';
import { MapPin, Search, X, Check } from 'lucide-react';

interface StopAutocompleteProps {
  label: string;
  selectedStopId: string;
  onSelectStop: (stopId: string) => void;
  iconColor?: string;
  placeholder?: string;
}

export function StopAutocomplete({
  label,
  selectedStopId,
  onSelectStop,
  iconColor = 'text-terracotta',
  placeholder = 'Search stop or metro hub...',
}: StopAutocompleteProps) {
  const selectedStop = DELHI_STOPS.find((s) => s.id === selectedStopId);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredStops = DELHI_STOPS.filter((stop) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      stop.name.toLowerCase().includes(q) ||
      stop.hindiName.includes(q) ||
      stop.zone.toLowerCase().includes(q) ||
      (stop.metroInterchange && stop.metroInterchange.toLowerCase().includes(q)) ||
      stop.code.toLowerCase().includes(q)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full">
      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted flex items-center gap-1.5 mb-1">
        <MapPin className={`w-3 h-3 ${iconColor}`} />
        {label}
      </span>

      {/* Selected Box / Search Input */}
      <div
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        className={`w-full p-2.5 border transition-all cursor-pointer bg-surface-white flex items-center justify-between ${
          isOpen ? 'border-terracotta ring-1 ring-terracotta/20 shadow-sm' : 'border-divider hover:border-stone'
        }`}
      >
        <div className="flex-1 min-w-0 pr-2">
          {isOpen ? (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={selectedStop ? selectedStop.name : placeholder}
              className="w-full bg-transparent font-serif text-lg text-ink focus:outline-none placeholder:text-ink-muted/50"
              autoFocus
            />
          ) : (
            <div className="truncate">
              <span className="font-serif text-lg text-ink block leading-snug">
                {selectedStop ? selectedStop.name : 'Select bus stop'}
              </span>
              {selectedStop?.metroInterchange && (
                <span className="font-mono text-[10px] text-ink-muted block truncate">
                  Interchange: {selectedStop.metroInterchange}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 shrink-0">
          {searchQuery && isOpen ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSearchQuery('');
              }}
              className="p-1 text-ink-muted hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <Search className="w-3.5 h-3.5 text-ink-muted" />
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 overflow-y-auto bg-surface-white border border-divider shadow-lg divide-y divide-divider/40">
          {filteredStops.length === 0 ? (
            <div className="p-3 text-center font-mono text-xs text-ink-muted">
              No matching transit stops found
            </div>
          ) : (
            filteredStops.map((stop) => {
              const isCurrent = stop.id === selectedStopId;
              return (
                <div
                  key={stop.id}
                  onClick={() => {
                    onSelectStop(stop.id);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className={`p-2.5 cursor-pointer transition-colors flex items-center justify-between text-left ${
                    isCurrent ? 'bg-parchment/40 text-terracotta' : 'hover:bg-ivory'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-serif text-base text-ink font-normal truncate">
                        {stop.name}
                      </span>
                      <span className="font-mono text-[9px] px-1.5 py-0.5 border border-divider bg-ivory text-ink-muted shrink-0">
                        {stop.zone}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-0.5 font-mono text-[10px] text-ink-muted truncate">
                      <span>{stop.hindiName}</span>
                      {stop.metroInterchange && (
                        <span>• {stop.metroInterchange}</span>
                      )}
                    </div>
                  </div>

                  {isCurrent && <Check className="w-4 h-4 text-terracotta shrink-0" />}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
