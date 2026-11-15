'use client';

import React from 'react';
import MandalaArt, { MandalaVariant } from './MandalaArt';

interface MandalaWatermarkProps {
  seed: string | number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center' | 'center-right' | 'center-left';
  size?: number;
  variant?: MandalaVariant;
  opacity?: number;
  spin?: boolean;
  spinDuration?: number;
  className?: string;
}

export default function MandalaWatermark({
  seed,
  position = 'top-right',
  size = 520,
  variant = 'ambient',
  opacity = 0.42,
  spin = true,
  spinDuration = 180,
  className = '',
}: MandalaWatermarkProps) {
  const positionClasses = {
    'top-right': 'absolute -top-32 -right-32 pointer-events-none',
    'top-left': 'absolute -top-32 -left-32 pointer-events-none',
    'bottom-right': 'absolute -bottom-32 -right-32 pointer-events-none',
    'bottom-left': 'absolute -bottom-32 -left-32 pointer-events-none',
    'center': 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none',
    'center-right': 'absolute top-1/2 -right-40 -translate-y-1/2 pointer-events-none',
    'center-left': 'absolute top-1/2 -left-40 -translate-y-1/2 pointer-events-none',
  }[position];

  return (
    <div className={`overflow-hidden ${positionClasses} ${className}`} aria-hidden="true">
      <MandalaArt
        seed={seed}
        size={size}
        variant={variant}
        opacity={opacity}
        spin={spin}
        spinDuration={spinDuration}
        complexity="architectural"
      />
    </div>
  );
}
