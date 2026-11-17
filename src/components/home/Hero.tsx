'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Compass, Shield, Building2 } from 'lucide-react';
import { ContentSettings } from '@/types';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';
import MandalaArt from '@/components/decorative/MandalaArt';

interface HeroProps {
  settings?: ContentSettings;
  eyebrow?: string;
  headline?: string;
  headlineHighlight?: string;
  copy?: string;
  primaryCtaText?: string;
  primaryCtaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export default function Hero({
  settings,
  eyebrow,
  headline,
  headlineHighlight,
  copy,
  primaryCtaText,
  primaryCtaHref,
  secondaryCtaText,
  secondaryCtaHref,
}: HeroProps) {
  const currentEyebrow = eyebrow || settings?.heroEyebrow || 'PROPERTY, WITH PERSPECTIVE';
  const currentHeadline = headline || settings?.heroHeadline || 'Find a place that';
  const currentHighlight = headlineHighlight || settings?.heroHeadlineHighlight || 'moves you forward.';
  const currentCopy = copy || settings?.heroCopy || 'Explore carefully presented property opportunities with clear information, local insight and personal guidance from first enquiry to final decision.';
  const pCtaText = primaryCtaText || settings?.primaryCtaText || 'EXPLORE PROPERTIES';
  const pCtaHref = primaryCtaHref || settings?.primaryCtaHref || '/properties';
  const sCtaText = secondaryCtaText || settings?.secondaryCtaText || 'TALK TO AN ADVISOR';
  const sCtaHref = secondaryCtaHref || settings?.secondaryCtaHref || '/contact';

  const stat1Val = settings?.heroStat1Value || '100%';
  const stat1Lbl = settings?.heroStat1Label || 'Verified Titles';
  const stat2Val = settings?.heroStat2Value || 'Prime';
  const stat2Lbl = settings?.heroStat2Label || 'Curated Portfolio';
  const stat3Val = settings?.heroStat3Value || 'Direct';
  const stat3Lbl = settings?.heroStat3Label || 'Personal Advisory';

  const heroImg = settings?.heroImageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  const cardBadge = settings?.heroCardBadge || 'Featured Opportunity';
  const cardTitle = settings?.heroCardTitle || 'The Sky Villa Collection';
  const cardSubtitle = settings?.heroCardSubtitle || 'Demo Locality • Golf Links';
  const cardHref = settings?.heroCardHref || '/properties/demo-premium-4-bed-home';

  const badgeTopTitle = settings?.heroBadgeTopTitle || 'Advisory Focus';
  const badgeTopSubtitle = settings?.heroBadgeTopSubtitle || 'Clear Data. Trusted Guidance.';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE6] to-[#FAF8F5] pt-20 pb-12 sm:pt-24 sm:pb-20 lg:pt-28 lg:pb-28">
      {/* Dynamic Unique Bold Mandala Watermarks */}
      <MandalaWatermark seed="hero-mandala-main" position="top-left" size={680} opacity={0.36} spinDuration={140} />
      <MandalaWatermark seed="hero-mandala-ambient" position="bottom-right" size={540} opacity={0.32} spinDuration={180} />

      {/* Background Architectural Radial Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold-champagne/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 left-10 w-72 h-72 bg-navy-midnight/5 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* Left Column: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-7 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/90 border border-gold-champagne/40 text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-gold-deep shadow-luxury">
              <MandalaArt seed="hero-badge-live" size={18} variant="gold" spin={true} spinDuration={35} />
              <span>{currentEyebrow}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-navy-midnight font-medium tracking-tight leading-[1.15]">
              {currentHeadline}{' '}
              <span className="italic font-light text-gold-deep block sm:inline">
                {currentHighlight}
              </span>
            </h1>

            <p className="text-text-slate text-sm sm:text-lg leading-relaxed max-w-xl font-normal">
              {currentCopy}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href={pCtaHref}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full bg-navy-midnight text-white text-xs font-semibold tracking-widest uppercase hover:bg-gold-deep transition-all duration-300 shadow-luxury group"
              >
                <span>{pCtaText}</span>
                <ArrowUpRight className="w-4 h-4 text-gold-champagne group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href={sCtaHref}
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-canvas-grey bg-white text-text-ink text-xs font-semibold tracking-widest uppercase hover:border-gold-champagne hover:text-gold-deep transition-all duration-300 shadow-sm"
              >
                <span>{sCtaText}</span>
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 sm:pt-8 border-t border-canvas-grey/70 max-w-lg">
              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1 sm:gap-1.5 text-navy-midnight">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-champagne shrink-0" />
                  <span className="font-serif text-sm sm:text-base font-semibold">{stat1Val}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-text-muted truncate">{stat1Lbl}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1 sm:gap-1.5 text-navy-midnight">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-champagne shrink-0" />
                  <span className="font-serif text-sm sm:text-base font-semibold">{stat2Val}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-text-muted truncate">{stat2Lbl}</p>
              </div>

              <div className="space-y-0.5 sm:space-y-1">
                <div className="flex items-center gap-1 sm:gap-1.5 text-navy-midnight">
                  <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-champagne shrink-0" />
                  <span className="font-serif text-sm sm:text-base font-semibold">{stat3Val}</span>
                </div>
                <p className="text-[10px] sm:text-xs text-text-muted truncate">{stat3Lbl}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Photography Showcase */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative mx-auto max-w-md lg:max-w-none">

              {/* Primary Architectural Image */}
              <div className="relative h-[320px] sm:h-[460px] lg:h-[500px] w-full rounded-2xl overflow-hidden shadow-luxury border-2 sm:border-4 border-white">
                <Image
                  src={heroImg}
                  alt={cardTitle}
                  fill
                  priority
                  className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-midnight/70 via-transparent to-transparent" />

                {/* Floating Card at bottom of image */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-white/60 shadow-lg">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-wider font-semibold text-gold-deep block">
                        {cardBadge}
                      </span>
                      <h4 className="font-serif text-xs sm:text-sm font-semibold text-navy-midnight truncate">
                        {cardTitle}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-text-slate truncate">{cardSubtitle}</p>
                    </div>
                    <Link
                      href={cardHref}
                      className="p-2 rounded-full bg-canvas-ivory text-navy-midnight hover:bg-gold-champagne hover:text-white transition-colors shrink-0"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Decorative Secondary Inset Badge */}
              <div className="absolute -top-3 -right-3 bg-navy-midnight text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-xl border border-gold-champagne/30 hidden sm:block">
                <p className="text-[10px] tracking-widest uppercase text-gold-champagne font-semibold">
                  {badgeTopTitle}
                </p>
                <p className="font-serif text-xs sm:text-sm font-medium">{badgeTopSubtitle}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
