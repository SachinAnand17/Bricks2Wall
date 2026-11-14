import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';
import { Testimonial } from '@/types';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto pb-14 space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Client Experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Perspective from Those We Have Guided
          </h2>
          <p className="text-text-slate text-sm sm:text-base">
            Verified feedback from clients who acquired residences or commercial spaces through our advisory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-canvas-ivory/50 rounded-2xl p-8 border border-canvas-grey hover:border-gold-champagne/40 transition-all duration-300 shadow-sm relative flex flex-col justify-between space-y-6"
            >
              <Quote className="w-8 h-8 text-gold-champagne/40 absolute top-6 right-6" />

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
