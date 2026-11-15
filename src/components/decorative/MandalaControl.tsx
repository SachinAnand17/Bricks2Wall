'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sparkles, RefreshCw } from 'lucide-react';
import MandalaArt from './MandalaArt';

export default function MandalaControl() {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin'))) {
    return null;
  }

  const [isRotating, setIsRotating] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const handleRegenerate = () => {
    setIsRotating(true);
    const newSalt = Math.floor(Math.random() * 10000000);
    window.dispatchEvent(
      new CustomEvent('b2w:regenerate-mandalas', {
        detail: { salt: newSalt },
      })
    );
    setPulseKey((prev) => prev + 1);

    setTimeout(() => {
      setIsRotating(false);
    }, 600);
  };

  return (
    <aside
      aria-label="Mandala Art Controls"
      className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 group"
    >
      <button
        onClick={handleRegenerate}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#C8A45D]/40 shadow-luxury hover:border-[#C8A45D] hover:bg-canvas-ivory transition-all duration-300 text-navy-midnight text-xs font-medium"
        title="Generate brand new architectural mandala patterns across the entire website"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <MandalaArt
            key={pulseKey}
            seed={`btn-${pulseKey}`}
            size={20}
            variant="gold"
            spin={true}
            spinDuration={20}
          />
        </div>
        <span className="text-[11px] font-serif font-semibold tracking-wide text-navy-midnight">
          Generate New Mandalas
        </span>
        <RefreshCw
          className={`w-3 h-3 text-[#C8A45D] transition-transform duration-500 ${
            isRotating ? 'rotate-180' : 'group-hover:rotate-45'
          }`}
        />
      </button>
    </aside>
  );
}
