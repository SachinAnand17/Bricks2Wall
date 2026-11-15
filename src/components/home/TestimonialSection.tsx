'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Star, Quote, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial, ContentSettings } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  settings?: ContentSettings;
}

export default function TestimonialSection({ testimonials, settings }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  const eyebrow = settings?.testimonialsEyebrow || 'Client Experiences';
  const heading = settings?.testimonialsHeading || 'Perspective from Those We Have Guided';
  const copy = settings?.testimonialsCopy || 'Verified feedback from clients who acquired residences or commercial spaces through our advisory.';

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Combine items to ensure seamless infinite looping carousel
  const carouselItems = [...testimonials, ...testimonials, ...testimonials];

  // Auto-scroll from right to left smoothly
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let animId: number;
    const speed = 1.2; // pixels per frame

    const scrollStep = () => {
      if (!isPaused && container) {
        container.scrollLeft += speed;
        // If scrolled past half, reset seamlessly
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animId);
  }, [isPaused]);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 380;
      scrollContainerRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#0E2034] via-[#10243A] to-[#0A1726] text-white">
      {/* Background Majestic Mandalas */}
      <MandalaWatermark seed="testimonials-royal-mandala" position="top-right" size={640} variant="white" opacity={0.38} spinDuration={180} />
      <MandalaWatermark seed="testimonials-ambient-mandala" position="bottom-left" size={520} variant="gold" opacity={0.35} spinDuration={210} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Banner Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C8A45D]/40 text-xs font-semibold tracking-widest uppercase text-[#C8A45D]">
              <MandalaArt seed="testimonial-banner-icon" size={18} variant="gold" spin={true} spinDuration={30} />
              <span>{eyebrow}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              {heading}
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              {copy}
            </p>
          </div>

          {/* Carousel Navigation Buttons & Live Status */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-[#C8A45D]/80 font-serif tracking-wider uppercase hidden sm:inline">
              Continuous Sliding Carousel
            </span>
            <button
              onClick={() => handleManualScroll('left')}
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C8A45D] hover:text-navy-deep transition-all duration-300"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleManualScroll('right')}
              className="p-2.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-[#C8A45D] hover:text-navy-deep transition-all duration-300"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sliding Infinite Carousel Track */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-6 overflow-x-hidden select-none py-4 cursor-grab active:cursor-grabbing no-scrollbar scroll-smooth"
        >
          {carouselItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className="w-[340px] sm:w-[420px] shrink-0 bg-white/95 text-navy-midnight rounded-3xl p-7 border border-[#C8A45D]/40 shadow-2xl relative overflow-hidden flex flex-col justify-between space-y-5 hover:-translate-y-1.5 transition-all duration-300 group"
            >
              {/* Unique Distinctive Card Mandala Motif */}
              <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
                <MandalaArt
                  seed={`testimonial-crousel-${item.id}-${idx}`}
                  size={140}
                  variant="gold"
                  spin={true}
                  spinDuration={90 + (idx % 4) * 20}
                  complexity="medium"
                />
              </div>

              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8A45D] text-[#C8A45D]" />
                  ))}
                </div>
                <Quote className="w-7 h-7 text-[#C8A45D]/40" />
              </div>

              <p className="font-serif text-sm sm:text-base text-navy-midnight leading-relaxed italic relative z-10">
                "{item.quote}"
              </p>

              <div className="pt-4 border-t border-canvas-grey flex items-center justify-between relative z-10">
                <div>
                  <h4 className="text-sm font-bold text-navy-midnight">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-text-slate">
                    {item.clientRole} • {item.transactionType}
                  </p>
                </div>

                {item.isVerified && (
                  <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-[#9B783A] bg-canvas-ivory px-2.5 py-1 rounded-full border border-canvas-grey">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C8A45D]" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Carousel indicator footer note */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-white/50">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8A45D] animate-ping" />
          <span>Hover anywhere on the cards to pause the carousel</span>
        </div>

      </div>
    </section>
  );
}
