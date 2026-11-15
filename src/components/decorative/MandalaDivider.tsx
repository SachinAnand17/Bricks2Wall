'use client';

import React from 'react';
import MandalaArt, { MandalaVariant } from './MandalaArt';

interface MandalaDividerProps {
  seed?: string | number;
  variant?: MandalaVariant;
  className?: string;
  size?: number;
}

export default function MandalaDivider({
  seed = 'divider',
  variant = 'gold',
  className = '',
  size = 46,
}: MandalaDividerProps) {
  return (
    <div className={`relative flex items-center justify-center my-8 max-w-5xl mx-auto px-4 ${className}`}>
      {/* Left Hairline with fading gradient */}
      <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#C8A45D]/40 to-[#C8A45D]/80" />

      {/* Central Rotating Mandala Medallion */}
      <div className="mx-4 relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8A45D] absolute -left-3" />
        <MandalaArt
          seed={seed}
          size={size}
          variant={variant}
          spin={true}
          spinDuration={90}
          opacity={0.85}
          complexity="medium"
        />
        <div className="w-1.5 h-1.5 rounded-full bg-[#C8A45D] absolute -right-3" />
      </div>

      {/* Right Hairline with fading gradient */}
      <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#C8A45D]/40 to-[#C8A45D]/80" />
    </div>
  );
}
