import React from 'react';
import Link from 'next/link';
import { ShieldAlert, CheckCircle2, ShieldCheck, Scale, PhoneCall } from 'lucide-react';

export default function TrustSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-canvas-ivory via-white to-canvas-ivory/60 border-y border-canvas-grey">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold-deep">
              <Scale className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Integrity & Regulatory Rigor</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium leading-tight">
              Clarity matters in every property decision.
            </h2>

            <p className="text-text-slate text-base leading-relaxed">
              We focus on accurate listing information, responsive communication and practical guidance. Ask our team to confirm current availability, pricing and documentation for any property before committing capital.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">Zero Fabricated Inventory</h4>
                  <p className="text-xs text-text-slate">We refuse to list fictitious demo units or phantom listings to attract leads. In development environments, sample listings are visibly watermarked DEMO.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">Dedicated Site Walkthroughs</h4>
                  <p className="text-xs text-text-slate">View properties with experienced advisors who walk you through setback limits, floor plan layouts, sunlight exposure, and construction quality.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">RERA Project Compliance Checks</h4>
                  <p className="text-xs text-text-slate">We verify state RERA registration IDs, promoter disclosures, sanctioned layouts, and possession schedules on authorized state regulatory portals.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-gold-champagne" />
                <span>Speak with an Advisor</span>
              </Link>
              <Link
                href="/disclaimer"
                className="text-xs text-text-slate hover:text-navy-midnight underline underline-offset-4"
              >
                Read Property Disclaimer
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="p-8 rounded-2xl bg-white border border-canvas-grey shadow-luxury space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-canvas-grey">
                <div className="w-12 h-12 rounded-full bg-canvas-ivory flex items-center justify-center text-gold-deep border border-gold-champagne/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                    The Bricks2Wall Guarantee
                  </h3>
                  <p className="text-xs text-text-slate">Verified Advisory Standards</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-text-slate leading-relaxed">
                <p>
                  <strong>No Hidden Surprises:</strong> All quoted property charges include breakdown of base rate, parking charges, IFMS (Interest Free Maintenance Security), and expected statutory stamp duty.
                </p>
                <p>
                  <strong>Data Privacy Assurance:</strong> Your contact details and viewing times are never sold or shared with unsolicited call centers. Only your designated Bricks2Wall advisor contacts you.
                </p>
                <div className="p-4 rounded-xl bg-canvas-ivory/80 border border-gold-champagne/20 text-text-ink text-xs">
                  <span className="font-semibold text-gold-deep block mb-1">Direct Verification Hotline</span>
                  <span>Need instant verification on any project availability? Call our senior desk at </span>
                  <a href="tel:+919876543210" className="font-semibold text-navy-midnight hover:underline">
                    +91 98765 43210
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
