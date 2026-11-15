'use client';

import React, { useMemo, useState, useEffect } from 'react';

export type MandalaVariant = 'gold' | 'navy' | 'white' | 'ambient' | 'champagne' | 'dark';

export interface MandalaArtProps {
  seed?: string | number;
  size?: number | string;
  symmetry?: number; // 6, 8, 10, 12, 16, 20, 24
  variant?: MandalaVariant;
  className?: string;
  spin?: boolean;
  spinDuration?: number; // in seconds
  opacity?: number;
  interactive?: boolean;
  complexity?: 'compact' | 'medium' | 'elaborate' | 'architectural';
}

// Deterministic Pseudo-Random Number Generator based on seed
function createPrng(seedStr: string | number) {
  let h = 2166136261 >>> 0;
  const str = String(seedStr);
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  let state = h;

  return function next(): number {
    state = Math.imul(state ^ (state >>> 15), 1 | state);
    state ^= state + Math.imul(state ^ (state >>> 7), 61 | state);
    return ((state ^ (state >>> 14)) >>> 0) / 4294967296;
  };
}

export default function MandalaArt({
  seed,
  size = 240,
  symmetry,
  variant = 'gold',
  className = '',
  spin = false,
  spinDuration = 120,
  opacity,
  interactive = false,
  complexity = 'elaborate',
}: MandalaArtProps) {
  // Session / runtime randomizer to ensure NEW PATTERNS on every reload
  const [runtimeSalt, setRuntimeSalt] = useState<number>(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    // Generate a fresh runtime salt per page load
    const salt = Math.floor(Math.random() * 1000000);
    setRuntimeSalt(salt);

    // Listen to global mandala regeneration events
    const handleRegen = (e: Event) => {
      const customEvt = e as CustomEvent<{ salt: number }>;
      setRuntimeSalt(customEvt.detail?.salt || Math.floor(Math.random() * 1000000));
    };

    window.addEventListener('b2w:regenerate-mandalas', handleRegen);
    return () => window.removeEventListener('b2w:regenerate-mandalas', handleRegen);
  }, []);

  const elements = useMemo(() => {
    const effectiveSeed = `${seed ?? 'mandala'}-${runtimeSalt}`;
    const rand = createPrng(effectiveSeed);

    // Symmetry: if not specified, choose from 8, 12, 16, 20, 24 based on seed
    const symOptions = [8, 10, 12, 16, 18, 24];
    const n = symmetry || symOptions[Math.floor(rand() * symOptions.length)];
    const angleStep = (2 * Math.PI) / n;
    const halfStep = angleStep / 2;

    const viewBoxSize = 600;
    const center = viewBoxSize / 2;
    const maxR = 270;

    // Distinct layer parameters
    const coreType = Math.floor(rand() * 5); // 0: lotus, 1: star, 2: diamond, 3: rosette, 4: brick-ring
    const petalStyle = Math.floor(rand() * 4); // 0: pointed arch, 1: curved leaf, 2: scalloped, 3: flame
    const hasBrickLayer = rand() > 0.25; // 75% chance of architectural brickwork rings
    const hasJaliLattice = rand() > 0.35; // Indian geometric lattice
    const hasOuterSunburst = rand() > 0.3; // radiating spokes
    const ringCount = complexity === 'compact' ? 3 : complexity === 'medium' ? 5 : 7;

    const layers: React.ReactNode[] = [];

    // --- 1. Concentric Guide Rings ---
    for (let i = 1; i <= ringCount; i++) {
      const r = (maxR / ringCount) * i;
      const ringType = rand();
      const strokeWidth = ringType > 0.7 ? 1.5 : 0.8;
      const dashArray = ringType < 0.25 ? '3 5' : ringType < 0.45 ? '1 4' : ringType < 0.6 ? '8 4 2 4' : undefined;

      layers.push(
        <circle
          key={`ring-${i}`}
          cx={center}
          cy={center}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={dashArray}
          className="transition-all duration-700"
        />
      );
    }

    // --- 2. Central Core Hub ---
    const coreR = maxR * 0.18;
    layers.push(
      <circle
        key="core-bg"
        cx={center}
        cy={center}
        r={coreR}
        fill="currentColor"
        fillOpacity={0.06}
        stroke="currentColor"
        strokeWidth={1.5}
      />
    );
    layers.push(
      <circle
        key="core-inner"
        cx={center}
        cy={center}
        r={coreR * 0.45}
        fill="currentColor"
        fillOpacity={0.15}
        stroke="currentColor"
        strokeWidth={1}
      />
    );

    // Core spokes or inner star
    for (let i = 0; i < n; i++) {
      const a = i * angleStep;
      const x1 = center + Math.cos(a) * (coreR * 0.45);
      const y1 = center + Math.sin(a) * (coreR * 0.45);
      const x2 = center + Math.cos(a) * coreR;
      const y2 = center + Math.sin(a) * coreR;

      layers.push(
        <line
          key={`core-spoke-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="currentColor"
          strokeWidth={0.9}
        />
      );

      // Core tiny pearls
      if (coreType === 0 || coreType === 3) {
        layers.push(
          <circle
            key={`core-dot-${i}`}
            cx={x2}
            cy={y2}
            r={1.8}
            fill="currentColor"
          />
        );
      }
    }

    // --- 3. Inner Floral Petals (Layer 1) ---
    const petal1Inner = coreR;
    const petal1Outer = maxR * 0.38;
    for (let i = 0; i < n; i++) {
      const a0 = i * angleStep;
      const a1 = (i + 1) * angleStep;
      const aMid = a0 + halfStep;

      const p0x = center + Math.cos(a0) * petal1Inner;
      const p0y = center + Math.sin(a0) * petal1Inner;
      const p1x = center + Math.cos(a1) * petal1Inner;
      const p1y = center + Math.sin(a1) * petal1Inner;

      const tipX = center + Math.cos(aMid) * petal1Outer;
      const tipY = center + Math.sin(aMid) * petal1Outer;

      const ctrlR = petal1Outer * 0.85;
      const c1x = center + Math.cos(a0 + halfStep * 0.5) * ctrlR;
      const c1y = center + Math.sin(a0 + halfStep * 0.5) * ctrlR;
      const c2x = center + Math.cos(a1 - halfStep * 0.5) * ctrlR;
      const c2y = center + Math.sin(a1 - halfStep * 0.5) * ctrlR;

      const pathData = `M ${p0x} ${p0y} Q ${c1x} ${c1y} ${tipX} ${tipY} Q ${c2x} ${c2y} ${p1x} ${p1y}`;

      layers.push(
        <path
          key={`petal1-${i}`}
          d={pathData}
          fill="currentColor"
          fillOpacity={i % 2 === 0 ? 0.05 : 0.02}
          stroke="currentColor"
          strokeWidth={1}
        />
      );

      // Central spine inside petal
      const spineInnerX = center + Math.cos(aMid) * (petal1Inner * 1.15);
      const spineInnerY = center + Math.sin(aMid) * (petal1Inner * 1.15);
      layers.push(
        <line
          key={`petal1-spine-${i}`}
          x1={spineInnerX}
          y1={spineInnerY}
          x2={tipX}
          y2={tipY}
          stroke="currentColor"
          strokeWidth={0.6}
          strokeDasharray="2 3"
        />
      );
    }

    // --- 4. Architectural Brickwork Band (Bricks2Wall Signature) ---
    if (hasBrickLayer) {
      const brickR1 = maxR * 0.42;
      const brickR2 = maxR * 0.54;
      const brickMid = (brickR1 + brickR2) / 2;
      const brickN = n * 2;
      const brickStep = (2 * Math.PI) / brickN;

      for (let i = 0; i < brickN; i++) {
        const bA = i * brickStep;
        // Inner arc brick line
        const xA1 = center + Math.cos(bA) * brickR1;
        const yA1 = center + Math.sin(bA) * brickR1;
        const xA2 = center + Math.cos(bA) * brickR2;
        const yA2 = center + Math.sin(bA) * brickR2;

        layers.push(
          <line
            key={`brick-${i}`}
            x1={xA1}
            y1={yA1}
            x2={xA2}
            y2={yA2}
            stroke="currentColor"
            strokeWidth={0.7}
          />
        );
      }

      // Middle dividing ring for courses
      layers.push(
        <circle
          key="brick-mid-ring"
          cx={center}
          cy={center}
          r={brickMid}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.8}
        />
      );
    }

    // --- 5. Middle Geometric Jali / Star Lattice ---
    const midR1 = maxR * 0.54;
    const midR2 = maxR * 0.74;

    for (let i = 0; i < n; i++) {
      const aCurrent = i * angleStep;
      const aNext = (i + 1) * angleStep;
      const aPeak = aCurrent + halfStep;

      // Outer diamond or chevron tip
      const base1X = center + Math.cos(aCurrent) * midR1;
      const base1Y = center + Math.sin(aCurrent) * midR1;
      const base2X = center + Math.cos(aNext) * midR1;
      const base2Y = center + Math.sin(aNext) * midR1;
      const peakX = center + Math.cos(aPeak) * midR2;
      const peakY = center + Math.sin(aPeak) * midR2;

      // Diamond or arched tip
      if (hasJaliLattice) {
        const midMidX = center + Math.cos(aPeak) * (midR1 * 1.15);
        const midMidY = center + Math.sin(aPeak) * (midR1 * 1.15);

        // Kite / Rhombus path
        const kitePath = `M ${base1X} ${base1Y} L ${midMidX} ${midMidY} L ${peakX} ${peakY} L ${base2X} ${base2Y} Z`;
        layers.push(
          <path
            key={`jali-${i}`}
            d={kitePath}
            fill="currentColor"
            fillOpacity={0.04}
            stroke="currentColor"
            strokeWidth={1}
          />
        );
      } else {
        // Pointed Gothic Arch
        const archPath = `M ${base1X} ${base1Y} Q ${center + Math.cos(aCurrent + halfStep * 0.3) * (midR2 * 0.9)} ${center + Math.sin(aCurrent + halfStep * 0.3) * (midR2 * 0.9)} ${peakX} ${peakY} Q ${center + Math.cos(aNext - halfStep * 0.3) * (midR2 * 0.9)} ${center + Math.sin(aNext - halfStep * 0.3) * (midR2 * 0.9)} ${base2X} ${base2Y}`;
        layers.push(
          <path
            key={`arch-${i}`}
            d={archPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.1}
          />
        );
      }

      // Small diamond rosette at peak
      layers.push(
        <circle
          key={`peak-jewel-${i}`}
          cx={peakX}
          cy={peakY}
          r={2.5}
          fill="currentColor"
        />
      );
    }

    // --- 6. Outer Grand Lotus / Sunburst Flourish ---
    const outR1 = midR2;
    const outR2 = maxR * 0.94;

    for (let i = 0; i < n; i++) {
      const a0 = i * angleStep;
      const a1 = (i + 1) * angleStep;
      const aMid = a0 + halfStep;

      const p0x = center + Math.cos(a0) * outR1;
      const p0y = center + Math.sin(a0) * outR1;
      const p1x = center + Math.cos(a1) * outR1;
      const p1y = center + Math.sin(a1) * outR1;

      const crownX = center + Math.cos(aMid) * outR2;
      const crownY = center + Math.sin(aMid) * outR2;

      // Outer ornate petal
      const c1x = center + Math.cos(a0 + halfStep * 0.4) * (outR2 * 0.88);
      const c1y = center + Math.sin(a0 + halfStep * 0.4) * (outR2 * 0.88);
      const c2x = center + Math.cos(a1 - halfStep * 0.4) * (outR2 * 0.88);
      const c2y = center + Math.sin(a1 - halfStep * 0.4) * (outR2 * 0.88);

      const crownPath = `M ${p0x} ${p0y} Q ${c1x} ${c1y} ${crownX} ${crownY} Q ${c2x} ${c2y} ${p1x} ${p1y}`;
      layers.push(
        <path
          key={`outer-petal-${i}`}
          d={crownPath}
          fill="currentColor"
          fillOpacity={i % 2 === 0 ? 0.03 : 0.01}
          stroke="currentColor"
          strokeWidth={1.2}
        />
      );

      // Finial spear or teardrop extending outward
      if (hasOuterSunburst) {
        const finialTipX = center + Math.cos(aMid) * (maxR * 0.99);
        const finialTipY = center + Math.sin(aMid) * (maxR * 0.99);

        layers.push(
          <line
            key={`sunburst-${i}`}
            x1={crownX}
            y1={crownY}
            x2={finialTipX}
            y2={finialTipY}
            stroke="currentColor"
            strokeWidth={1}
          />
        );

        layers.push(
          <circle
            key={`sunburst-tip-${i}`}
            cx={finialTipX}
            cy={finialTipY}
            r={1.8}
            fill="currentColor"
          />
        );
      }
    }

    // --- 7. Perimeter Beaded Border (Mala / Royal Pearls) ---
    const beadR = maxR * 0.97;
    const beadN = n * 4;
    const beadStep = (2 * Math.PI) / beadN;

    for (let i = 0; i < beadN; i++) {
      const bAngle = i * beadStep;
      const bx = center + Math.cos(bAngle) * beadR;
      const by = center + Math.sin(bAngle) * beadR;

      layers.push(
        <circle
          key={`bead-${i}`}
          cx={bx}
          cy={by}
          r={i % 4 === 0 ? 1.6 : 0.9}
          fill="currentColor"
          fillOpacity={0.8}
        />
      );
    }

    return layers;
  }, [seed, symmetry, complexity, runtimeSalt]);

  // Color styles
  const colorClasses = {
    gold: 'text-[#C8A45D] stroke-[#C8A45D]',
    champagne: 'text-[#C8A45D]/85 stroke-[#C8A45D]/85',
    navy: 'text-[#10243A] stroke-[#10243A]',
    white: 'text-white/80 stroke-white/80',
    ambient: 'text-[#C8A45D]/40 stroke-[#C8A45D]/40',
    dark: 'text-[#18212B] stroke-[#18212B]',
  }[variant];

  const effectiveOpacity = opacity !== undefined ? opacity : variant === 'ambient' ? 0.12 : 1;

  return (
    <div
      className={`relative inline-block select-none pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        opacity: effectiveOpacity,
      }}
      onMouseEnter={() => interactive && setHovered(true)}
      onMouseLeave={() => interactive && setHovered(false)}
    >
      <svg
        viewBox="0 0 600 600"
        className={`w-full h-full ${colorClasses} ${
          spin ? 'animate-[spin_var(--spin-dur)_linear_infinite]' : ''
        } ${hovered ? 'scale-105 transition-transform duration-500' : 'transition-transform duration-500'}`}
        style={
          {
            '--spin-dur': `${spinDuration}s`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          {elements}
        </g>
      </svg>
    </div>
  );
}
