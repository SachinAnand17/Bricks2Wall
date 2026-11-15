import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
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

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background Royal Filigree Mandala Watermark */}
      <MandalaWatermark seed="testimonials-watermark" position="top-left" size={560} opacity={0.06} spinDuration={180} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto pb-14 space-y-3">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-canvas-ivory/50 rounded-2xl p-8 border border-canvas-grey hover:border-gold-champagne/40 transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col justify-between space-y-6"
            >
              {/* Subtle Ambient Card Mandala Motif */}
              <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-15">
                <MandalaArt seed={`testimonial-card-${item.id}`} size={130} variant="gold" spin={true} spinDuration={100} complexity="medium" />
              </div>

              <Quote className="w-8 h-8 text-gold-champagne/40 absolute top-6 right-6 relative z-10" />

              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-champagne text-gold-champagne" />
                  ))}
                </div>

                <p className="font-serif text-base text-navy-midnight leading-relaxed italic">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-canvas-grey flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">
                    {item.clientName}
                  </h4>
                  <p className="text-xs text-text-slate">
                    {item.clientRole} • {item.transactionType}
                  </p>
                </div>

                {item.isVerified && (
                  <div className="flex items-center gap-1 text-[10px] uppercase font-semibold text-gold-deep bg-white px-2.5 py-1 rounded-full border border-canvas-grey">
                    <CheckCircle2 className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>Verified Client</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
