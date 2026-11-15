import React from 'react';
import Link from 'next/link';
import { Calendar, Compass, Key, Search, ArrowRight } from 'lucide-react';
import { ContentSettings } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

interface ProcessSectionProps {
  settings?: ContentSettings;
}

export default function ProcessSection({ settings }: ProcessSectionProps) {
  const eyebrow = settings?.processEyebrow || 'Transparent Workflow';
  const heading = settings?.processHeading || 'A clearer way to move forward.';
  const copy = settings?.processCopy || 'We replace speculation with systematic verification and personal guidance at every milestone.';
  const ctaText = settings?.processCtaText || 'Start Your Property Conversation';

  const steps = [
    {
      step: '01',
      icon: Search,
      title: settings?.step1Title || 'Tell us what you need',
      description: settings?.step1Desc || 'Share your location preferences, space requirements, budget, and timeline with an advisor.',
    },
    {
      step: '02',
      icon: Compass,
      title: settings?.step2Title || 'Explore relevant options',
      description: settings?.step2Desc || 'Receive curated property dossiers with verified documentation, honest measurements, and video walkthroughs.',
    },
    {
      step: '03',
      icon: Calendar,
      title: settings?.step3Title || 'Arrange a viewing',
      description: settings?.step3Desc || 'Walk through shortlisted residences or commercial suites with an expert advisor who provides neighborhood insight.',
    },
    {
      step: '04',
      icon: Key,
      title: settings?.step4Title || 'Move ahead with informed guidance',
      description: settings?.step4Desc || 'Conclude agreements with legal due diligence, title clarity, registration support, and total peace of mind.',
    },
  ];

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-white via-canvas-ivory/50 to-white">
      {/* Background Section Watermark */}
      <MandalaWatermark seed="process-section-watermark" position="top-right" size={500} opacity={0.06} spinDuration={170} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto pb-16 space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            {heading}
          </h2>
          <p className="text-text-slate text-sm sm:text-base">
            {copy}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-white rounded-2xl p-6 border border-canvas-grey hover:border-gold-champagne/40 transition-all duration-300 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="relative flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center opacity-30">
                        <MandalaArt seed={`step-halo-${idx}`} size={56} variant="gold" spin={true} spinDuration={60 + idx * 15} complexity="compact" />
                      </div>
                      <span className="font-serif text-2xl font-bold text-gold-deep relative z-10 px-2 py-1">
                        {item.step}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-canvas-ivory flex items-center justify-center text-navy-midnight border border-canvas-grey/60">
                      <Icon className="w-5 h-5 text-gold-deep" />
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                    {item.title}
                  </h3>

                  <p className="text-xs text-text-slate leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-deep">
                    Step {idx + 1} of 4
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/book-a-visit"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-navy-midnight text-white text-xs font-semibold tracking-widest uppercase hover:bg-gold-deep transition-all duration-300 shadow-luxury"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 text-gold-champagne" />
          </Link>
        </div>

      </div>
    </section>
  );
}
