'use client';

import React from 'react';

export interface HalfMandalaProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: number;
  className?: string;
  spin?: boolean;
  spinDuration?: number;
  opacity?: number;
  variant?: 'gold' | 'champagne' | 'navy' | 'light';
}

export default function HalfMandala({
  position = 'top-right',
  size = 180,
  className = '',
  spin = true,
  spinDuration = 90,
  opacity = 0.55,
  variant = 'gold',
}: HalfMandalaProps) {
  // Color configuration based on variant
  const strokeColor =
    variant === 'gold'
      ? '#C8A45D'
      : variant === 'champagne'
      ? '#D8B878'
      : variant === 'navy'
      ? '#10243A'
      : '#EBD5A0';

  // Corner anchoring styles
  const positionStyles = {
    'top-right': 'top-0 right-0 -translate-y-1/3 translate-x-1/3',
    'top-left': 'top-0 left-0 -translate-y-1/3 -translate-x-1/3',
    'bottom-right': 'bottom-0 right-0 translate-y-1/3 translate-x-1/3',
    'bottom-left': 'bottom-0 left-0 translate-y-1/3 -translate-x-1/3',
  }[position];

  return (
    <div
      className={`absolute ${positionStyles} pointer-events-none select-none z-0 transition-opacity duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full overflow-visible"
        style={
          spin
            ? {
                animation: `mandala-spin ${spinDuration}s linear infinite`,
                transformOrigin: 'center center',
                willChange: 'transform',
              }
            : undefined
        }
      >
        <defs>
          <style>{`
            @keyframes mandala-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
          <radialGradient id={`mandala-glow-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8A45D" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#C8A45D" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#C8A45D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Aura */}
        <circle cx="150" cy="150" r="145" fill={`url(#mandala-glow-${position})`} />

        {/* Central Bindu & Concentric Sacred Circles */}
        <circle cx="150" cy="150" r="8" fill={strokeColor} opacity="0.8" />
        <circle cx="150" cy="150" r="18" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="150" cy="150" r="30" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" fill="none" opacity="0.7" />
        <circle cx="150" cy="150" r="45" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.65" />

        {/* Layer 1: 8 Inner Petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={`l1-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 150 120 C 144 132, 144 142, 150 150 C 156 142, 156 132, 150 120 Z"
                stroke={strokeColor}
                strokeWidth="1.2"
                fill="none"
                opacity="0.8"
              />
              <circle cx="150" cy="118" r="2" fill={strokeColor} opacity="0.9" />
            </g>
          );
        })}

        {/* Mid Ring with Micro Pearls */}
        <circle cx="150" cy="150" r="66" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.7" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const cx = 150 + 66 * Math.cos(rad);
          const cy = 150 + 66 * Math.sin(rad);
          return (
            <circle key={`pearl-${i}`} cx={cx} cy={cy} r="1.5" fill={strokeColor} opacity="0.75" />
          );
        })}

        {/* Layer 2: 16 Geometric Star Points */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`l2-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 145 86 L 150 68 L 155 86 Z"
                stroke={strokeColor}
                strokeWidth="1"
                fill={strokeColor}
                fillOpacity="0.25"
                opacity="0.75"
              />
            </g>
          );
        })}

        {/* Dividing Concentric Band */}
        <circle cx="150" cy="150" r="94" stroke={strokeColor} strokeWidth="1.3" fill="none" opacity="0.8" />
        <circle cx="150" cy="150" r="99" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="4 2" fill="none" opacity="0.6" />

        {/* Layer 3: 16 Architectural Jharokha Cusped Arches */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`l3-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 134 98 C 140 80, 145 68, 150 58 C 155 68, 160 80, 166 98"
                stroke={strokeColor}
                strokeWidth="1.2"
                fill="none"
                opacity="0.85"
              />
              <circle cx="150" cy="56" r="2" fill={strokeColor} opacity="0.9" />
            </g>
          );
        })}

        {/* Outer Ring with Micro-Beads */}
        <circle cx="150" cy="150" r="122" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.75" />

        {/* Layer 4: 32 Radiating Diamond Finials */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          return (
            <g key={`l4-${i}`} transform={`rotate(${angle} 150 150)`}>
              <line x1="150" y1="122" x2="150" y2="136" stroke={strokeColor} strokeWidth="0.9" opacity="0.6" />
              {i % 2 === 0 && (
                <circle cx="150" cy="138" r="1.5" fill={strokeColor} opacity="0.8" />
              )}
            </g>
          );
        })}

        {/* Outer Halo Rim */}
        <circle cx="150" cy="150" r="142" stroke={strokeColor} strokeWidth="1" strokeDasharray="6 4" fill="none" opacity="0.5" />
      </svg>
    </div>
  );
}
