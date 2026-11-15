'use client';

import React, { useMemo } from 'react';
import MandalaArt, { MandalaVariant } from './MandalaArt';

interface MandalaDividerProps {
  seed?: string | number;
  variant?: MandalaVariant;
  fromBg?: string;
  toBg?: string;
  className?: string;
  size?: number;
}

// Deterministic PRNG for organic, natural unorganized line generation per seed
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

// Convert points to smooth cubic bezier path
function pointsToSpline(pts: Array<[number, number]>): string {
  if (pts.length < 2) return '';
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

export default function MandalaDivider({
  seed = 'divider',
  variant = 'gold',
  fromBg = '#FFFFFF',
  toBg = '#091522',
  className = '',
  size = 54,
}: MandalaDividerProps) {
  const lineData = useMemo(() => {
    const rand = createPrng(seed);

    // X coordinates spanning 0 to 1440 across the full viewport width
    const xs = [0, 110, 230, 360, 490, 610, 720, 830, 950, 1080, 1210, 1330, 1440];

    // Primary unorganized, natural wavy points (baseline y: 45, viewBox height: 90)
    const primaryPts: Array<[number, number]> = xs.map((x, idx) => {
      if (idx === 0 || idx === xs.length - 1) {
        return [x, +(45 + (rand() - 0.5) * 16).toFixed(1)];
      }
      if (x === 720) {
        // Medallion anchor at center
        return [x, 45];
      }
      // Natural undulation between ~23 and ~67
      const jitter = (rand() - 0.5) * 44;
      return [x, +(45 + jitter).toFixed(1)];
    });

    // Secondary architectural sketch strand
    const sketchPts: Array<[number, number]> = xs.map((x, idx) => {
      const base = primaryPts[idx];
      if (idx === 0 || idx === xs.length - 1) {
        return [x, base[1]];
      }
      if (x === 720) {
        return [x, 45];
      }
      const offset = (rand() - 0.5) * 12;
      return [x, +(base[1] + offset).toFixed(1)];
    });

    const primarySpline = pointsToSpline(primaryPts);
    const sketchSpline = pointsToSpline(sketchPts);

    // Natural solid specks scattered along the peaks and valleys
    const specks: Array<{ cx: number; cy: number; r: number }> = [];
    for (let i = 0; i < 8; i++) {
      const xTarget = Math.round(60 + rand() * 1320);
      if (Math.abs(xTarget - 720) > 60) {
        // Keep clearing around central medallion
        specks.push({
          cx: xTarget,
          cy: Math.round(45 + (rand() - 0.5) * 40),
          r: +(rand() * 1.2 + 1.2).toFixed(1),
        });
      }
    }

    // Lower fill polygon connecting the natural wave to the lower section background (toBg)
    const lowerFillPath = `${primarySpline} L 1440 90 L 0 90 Z`;

    return {
      primarySpline,
      sketchSpline,
      lowerFillPath,
      specks,
    };
  }, [seed]);

  const lineColor = variant === 'white' ? '#FFFFFF' : '#C8A45D';

  // Determine badge background based on toBg
  const isDarkToBg =
    toBg.startsWith('#0') ||
    toBg.startsWith('#1') ||
    toBg.toLowerCase().includes('navy') ||
    toBg.toLowerCase().includes('08121e');

  return (
    <div
      className={`relative w-full overflow-visible select-none -mb-[1px] block z-10 ${className}`}
      style={{ backgroundColor: fromBg }}
      aria-hidden="true"
    >
      {/* Edge-to-Edge Natural Organic Unorganized Wavy Silhouette (No Straight Line, Solid Fill & Stroke) */}
      <svg
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="w-full h-14 sm:h-20 lg:h-24 block overflow-visible pointer-events-none"
      >
        {/* Solid fill for lower section meeting along the unorganized natural wave */}
        <path d={lineData.lowerFillPath} fill={toBg} stroke="none" />

        {/* Primary Solid Crisp Gold Contour Line (Not Straight, Not Blurry, Not Gradient) */}
        <path
          d={lineData.primarySpline}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Secondary Architectural Sketch Strand */}
        <path
          d={lineData.sketchSpline}
          fill="none"
          stroke={lineColor}
          strokeWidth={1.3}
          strokeLinecap="round"
          strokeDasharray="6 4"
          opacity={0.65}
        />

        {/* Solid Natural Gold Specks */}
        {lineData.specks.map((speck, i) => (
          <circle key={`sp-${i}`} cx={speck.cx} cy={speck.cy} r={speck.r} fill={lineColor} />
        ))}
      </svg>

      {/* Central Bold Rotating Mandala Medallion Nestled Directly on the Wave */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
        {/* Left Solid Gold Pearl */}
        <span
          className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shadow-md mr-2 sm:mr-3 shrink-0"
          style={{ backgroundColor: lineColor }}
        />

        {/* Mandala Medallion Disc */}
        <div
          className="p-1 sm:p-1.5 rounded-full shadow-xl border-2 flex items-center justify-center shrink-0 backdrop-blur-sm"
          style={{
            backgroundColor: isDarkToBg ? '#0A1828' : '#FFFFFF',
            borderColor: lineColor,
          }}
        >
          <MandalaArt
            seed={seed}
            size={size}
            variant="gold"
            spin={true}
            spinDuration={75}
            opacity={1}
            complexity="elaborate"
          />
        </div>

        {/* Right Solid Gold Pearl */}
        <span
          className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full shadow-md ml-2 sm:mr-3 shrink-0"
          style={{ backgroundColor: lineColor }}
        />
      </div>
    </div>
  );
}
