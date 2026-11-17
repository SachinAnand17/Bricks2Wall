'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
      className={`absolute ${positionStyles} pointer-events-none select-none z-0 transition-opacity duration-500 ${className}`}
      style={{
        width: size,
        height: size,
        opacity,
      }}
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 300 300"
        className="w-full h-full overflow-visible"
        animate={spin ? { rotate: position.includes('right') ? 360 : -360 } : undefined}
        transition={
          spin
            ? {
                repeat: Infinity,
                duration: spinDuration,
                ease: 'linear',
              }
            : undefined
        }
      >
        <defs>
          <linearGradient id={`mandala-grad-${position}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E6CA85" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#C8A45D" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#9B783A" stopOpacity="0.5" />
          </linearGradient>
          <radialGradient id={`mandala-glow-${position}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C8A45D" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#C8A45D" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C8A45D" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Soft Radial Ambient Aura */}
        <circle cx="150" cy="150" r="145" fill={`url(#mandala-glow-${position})`} />

        {/* Central Bindu & Core Sacred Rings */}
        <circle cx="150" cy="150" r="8" fill={strokeColor} opacity="0.8" />
        <circle cx="150" cy="150" r="16" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.6" />
        <circle cx="150" cy="150" r="28" stroke={strokeColor} strokeWidth="1.2" strokeDasharray="3 3" fill="none" opacity="0.7" />
        <circle cx="150" cy="150" r="42" stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.65" />

        {/* Layer 1: 8 Inner Sacred Petals */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 360) / 8;
          return (
            <g key={`l1-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 150 122 C 144 132, 144 142, 150 150 C 156 142, 156 132, 150 122 Z"
                stroke={strokeColor}
                strokeWidth="1.2"
                fill="none"
                opacity="0.8"
              />
              <circle cx="150" cy="120" r="2" fill={strokeColor} opacity="0.9" />
            </g>
          );
        })}

        {/* Mid Ring with Micro Pearls */}
        <circle cx="150" cy="150" r="64" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.7" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const cx = 150 + 64 * Math.cos(rad);
          const cy = 150 + 64 * Math.sin(rad);
          return (
            <circle key={`pearl-${i}`} cx={cx} cy={cy} r="1.5" fill={strokeColor} opacity="0.75" />
          );
        })}

        {/* Layer 2: 16 Star Rays with Chevron Arrows */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`l2-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 144 86 L 150 68 L 156 86 L 150 82 Z"
                stroke={strokeColor}
                strokeWidth="1"
                fill={strokeColor}
                fillOpacity="0.25"
                opacity="0.75"
              />
              <line x1="150" y1="86" x2="150" y2="106" stroke={strokeColor} strokeWidth="1" opacity="0.5" />
            </g>
          );
        })}

        {/* Concentric Dividing Band */}
        <circle cx="150" cy="150" r="92" stroke={strokeColor} strokeWidth="1.4" fill="none" opacity="0.8" />
        <circle cx="150" cy="150" r="97" stroke={strokeColor} strokeWidth="0.8" strokeDasharray="4 2" fill="none" opacity="0.6" />

        {/* Layer 3: 16 Architectural Jharokha (Cusped Lotus Arches) */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          return (
            <g key={`l3-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 132 97 C 138 78, 144 65, 150 56 C 156 65, 162 78, 168 97"
                stroke={strokeColor}
                strokeWidth="1.3"
                fill="none"
                opacity="0.85"
              />
              <circle cx="150" cy="54" r="2.2" fill={strokeColor} opacity="0.9" />
              <line x1="150" y1="58" x2="150" y2="88" stroke={strokeColor} strokeWidth="0.8" opacity="0.5" />
            </g>
          );
        })}

        {/* Outer Ring with Micro-Beads */}
        <circle cx="150" cy="150" r="120" stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.75" />
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 360) / 48;
          const rad = (angle * Math.PI) / 180;
          const cx = 150 + 120 * Math.cos(rad);
          const cy = 150 + 120 * Math.sin(rad);
          return (
            <circle key={`outer-pearl-${i}`} cx={cx} cy={cy} r="1.2" fill={strokeColor} opacity="0.7" />
          );
        })}

        {/* Layer 4: 32 Radiating Finials & Diamond Spires */}
        {Array.from({ length: 32 }).map((_, i) => {
          const angle = (i * 360) / 32;
          return (
            <g key={`l4-${i}`} transform={`rotate(${angle} 150 150)`}>
              <path
                d="M 148 120 L 150 138 L 152 120 Z"
                stroke={strokeColor}
                strokeWidth="0.9"
                fill="none"
                opacity="0.6"
              />
              {i % 2 === 0 && (
                <circle cx="150" cy="142" r="1.8" fill={strokeColor} opacity="0.8" />
              )}
            </g>
          );
        })}

        {/* Outer Boundary Halo Rim */}
        <circle cx="150" cy="150" r="142" stroke={strokeColor} strokeWidth="1" strokeDasharray="6 4" fill="none" opacity="0.5" />
        <circle cx="150" cy="150" r="146" stroke={strokeColor} strokeWidth="0.6" fill="none" opacity="0.35" />
      </motion.svg>
    </div>
  );
}
