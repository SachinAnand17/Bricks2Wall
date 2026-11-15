import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileCheck, Award, Users, ArrowRight } from 'lucide-react';
import { ContentSettings } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

interface WhyWorkWithUsProps {
  settings?: ContentSettings;
}

export default function WhyWorkWithUs({ settings }: WhyWorkWithUsProps) {
  const eyebrow = settings?.whyEyebrow || 'The Bricks2Wall Standard';
  const heading = settings?.whyHeading || 'Guidance at every step of your property journey.';
  const copy = settings?.whyCopy || 'From understanding your exact spatial and financial requirements to arranging private viewings and navigating closing documentation, our team helps make property decisions clearer.';
  const storyLinkText = settings?.whyStoryLinkText || 'Read Our Advisory Story';

  const pillars = [
    {
      icon: ShieldCheck,
      title: settings?.pillar1Title || 'Verified Title & Due Diligence',
      description: settings?.pillar1Desc || 'Every property presented undergoes meticulous title search, RERA disclosure review, and occupancy certificate verification before reaching you.',
    },
    {
      icon: FileCheck,
      title: settings?.pillar2Title || 'Honest Carpet Area & Pricing',
      description: settings?.pillar2Desc || 'We demystify super built-up calculations. You receive transparent carpet area breakdowns, maintenance benchmarks, and realistic yield evaluations.',
    },
    {
      icon: Users,
      title: settings?.pillar3Title || 'High-Touch Advisory, Zero Pressure',
      description: settings?.pillar3Desc || 'Our licensed advisors represent your long-term interests with discretion, objectivity, and architectural perspective rather than pushy salesmanship.',
    },
    {
      icon: Award,
      title: settings?.pillar4Title || 'End-to-End Documentation Support',
      description: settings?.pillar4Desc || 'From initial agreement structuring to stamp duty calculation and registration coordination, our legal team safeguards every milestone.',
    },
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Central Grand Sacred Geometry Mandala Watermark */}
      <MandalaWatermark seed="why-us-center-mandala" position="center" size={720} opacity={0.06} spinDuration={240} />

      {/* Decorative architectural background line */}
      <div className="absolute inset-0 bg-[radial-gradient(#C8A45D_1px,transparent_1px)] [background-size:32px_32px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold-deep">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-champagne" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium leading-tight">
              {heading}
            </h2>

            <p className="text-text-slate text-base leading-relaxed">
              {copy}
            </p>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-gold-deep hover:text-navy-midnight transition-colors"
              >
                <span>{storyLinkText}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative overflow-hidden p-6 rounded-2xl bg-canvas-ivory/80 border border-canvas-grey hover:border-gold-champagne/40 transition-all duration-300 shadow-sm hover:shadow-luxury space-y-3"
                >
                  {/* Distinctive Unique Pillar Corner Mandala */}
                  <div className="absolute -top-8 -right-8 pointer-events-none opacity-20 hover:opacity-40 transition-opacity">
                    <MandalaArt seed={`pillar-mandala-${idx}`} size={110} variant="gold" spin={true} spinDuration={90 + idx * 20} complexity="compact" />
                  </div>

                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold-deep shadow-sm border border-canvas-grey relative z-10">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-base font-semibold text-navy-midnight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-slate leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
