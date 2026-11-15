import React from 'react';
import Link from 'next/link';
import { CheckCircle2, ShieldCheck, Scale, PhoneCall } from 'lucide-react';
import { ContentSettings } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

interface TrustSectionProps {
  settings?: ContentSettings;
}

export default function TrustSection({ settings }: TrustSectionProps) {
  const eyebrow = settings?.trustEyebrow || 'Integrity & Regulatory Rigor';
  const heading = settings?.trustHeading || 'Clarity matters in every property decision.';
  const copy = settings?.trustCopy || 'We focus on accurate listing information, responsive communication and practical guidance. Ask our team to confirm current availability, pricing and documentation for any property before committing capital.';
  
  const p1Title = settings?.trustPoint1Title || 'Zero Fabricated Inventory';
  const p1Desc = settings?.trustPoint1Desc || 'We refuse to list fictitious demo units or phantom listings to attract leads. In development environments, sample listings are visibly watermarked DEMO.';

  const p2Title = settings?.trustPoint2Title || 'Dedicated Site Walkthroughs';
  const p2Desc = settings?.trustPoint2Desc || 'View properties with experienced advisors who walk you through setback limits, floor plan layouts, sunlight exposure, and construction quality.';

  const p3Title = settings?.trustPoint3Title || 'RERA Project Compliance Checks';
  const p3Desc = settings?.trustPoint3Desc || 'We verify state RERA registration IDs, promoter disclosures, sanctioned layouts, and possession schedules on authorized state regulatory portals.';

  const guaranteeTitle = settings?.trustGuaranteeTitle || 'The Bricks2Wall Guarantee';
  const guaranteeSubtitle = settings?.trustGuaranteeSubtitle || 'Verified Advisory Standards';
  const guaranteePoint1 = settings?.trustGuaranteePoint1 || 'No Hidden Surprises: All quoted property charges include breakdown of base rate, parking charges, IFMS (Interest Free Maintenance Security), and expected statutory stamp duty.';
  const guaranteePoint2 = settings?.trustGuaranteePoint2 || 'Data Privacy Assurance: Your contact details and viewing times are never sold or shared with unsolicited call centers. Only your designated Bricks2Wall advisor contacts you.';
  const hotlineText = settings?.trustHotlineText || 'Need instant verification on any project availability? Call our senior desk at';
  const ctaText = settings?.trustCtaText || 'Speak with an Advisor';
  const phone = settings?.phoneContact || '+91 98765 43210';

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-canvas-ivory via-white to-canvas-ivory/60 border-y border-canvas-grey">
      {/* Background Sacred Geometry Watermark */}
      <MandalaWatermark seed="trust-mandala-bg" position="top-right" size={560} opacity={0.07} spinDuration={190} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold-deep">
              <Scale className="w-3.5 h-3.5 text-gold-champagne" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium leading-tight">
              {heading}
            </h2>

            <p className="text-text-slate text-base leading-relaxed">
              {copy}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">{p1Title}</h4>
                  <p className="text-xs text-text-slate">{p1Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">{p2Title}</h4>
                  <p className="text-xs text-text-slate">{p2Desc}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-gold-deep shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-navy-midnight">{p3Title}</h4>
                  <p className="text-xs text-text-slate">{p3Desc}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5 text-gold-champagne" />
                <span>{ctaText}</span>
              </Link>
              <Link
                href="/disclaimer"
                className="text-xs text-text-slate hover:text-navy-midnight underline underline-offset-4"
              >
                Read Property Disclaimer
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            {/* Ambient Mandala Seal behind Guarantee Card */}
            <div className="absolute -top-12 -right-12 pointer-events-none opacity-20">
              <MandalaArt seed="guarantee-seal" size={180} variant="gold" spin={true} spinDuration={80} complexity="elaborate" />
            </div>

            <div className="p-8 rounded-2xl bg-white border border-canvas-grey shadow-luxury space-y-6 relative z-10">
              <div className="flex items-center gap-3 pb-4 border-b border-canvas-grey">
                <div className="w-12 h-12 rounded-full bg-canvas-ivory flex items-center justify-center text-gold-deep border border-gold-champagne/30">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                    {guaranteeTitle}
                  </h3>
                  <p className="text-xs text-text-slate">{guaranteeSubtitle}</p>
                </div>
              </div>

              <div className="space-y-4 text-xs text-text-slate leading-relaxed">
                <p>{guaranteePoint1}</p>
                <p>{guaranteePoint2}</p>
                <div className="p-4 rounded-xl bg-canvas-ivory/80 border border-gold-champagne/20 text-text-ink text-xs">
                  <span className="font-semibold text-gold-deep block mb-1">Direct Verification Hotline</span>
                  <span>{hotlineText} </span>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="font-semibold text-navy-midnight hover:underline">
                    {phone}
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
