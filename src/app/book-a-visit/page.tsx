import React from 'react';
import { Metadata } from 'next';
import { Calendar, ShieldCheck, MapPin } from 'lucide-react';
import ScheduleViewingForm from '@/components/forms/ScheduleViewingForm';
import { getProperties } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Book a Private Site Viewing | Bricks2Wall',
  description: 'Schedule an on-site walkthrough with a licensed Bricks2Wall property advisor.',
};

export default function BookAVisitPage() {
  const properties = getProperties();

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gold-deep bg-canvas-ivory px-3.5 py-1.5 rounded-full border border-canvas-grey">
            <Calendar className="w-3.5 h-3.5 text-gold-champagne" />
            <span>Private Property Walkthroughs</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium">
            Schedule Your Site Viewing
          </h1>
          <p className="text-text-slate text-sm sm:text-base leading-relaxed">
            Experience spatial dimensions, natural lighting, and civic infrastructure firsthand. An experienced property advisor will accompany you with complete documentation.
          </p>
        </div>

        {/* Viewing Form */}
        <div className="bg-white rounded-3xl border border-canvas-grey p-4 sm:p-8 shadow-luxury">
          <ScheduleViewingForm />
        </div>

        {/* Safety & Protocol Banner */}
        <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-2 text-xs text-text-slate">
          <div className="flex items-center gap-2 font-semibold text-navy-midnight">
            <ShieldCheck className="w-4 h-4 text-gold-champagne" />
            <span>Viewing Protocol & Client Assurance</span>
          </div>
          <p>
            Site visits are conducted strictly in compliance with society security protocols. Our advisor will greet you at the reception or visitor gate with physical architectural brochures and the sanctioned master plan.
          </p>
        </div>

      </div>
    </div>
  );
}
