import React from 'react';
import { Metadata } from 'next';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldCheck } from 'lucide-react';
import LeadCtaSection from '@/components/home/LeadCtaSection';

export const metadata: Metadata = {
  title: 'Contact Advisory Desk | Bricks2Wall',
  description: 'Connect with our property advisory team for current availability, scheduled site visits, or tailored search briefs.',
};

export default function ContactPage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Direct Communication
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium">
            Contact Our Property Advisory Desk
          </h1>
          <p className="text-text-slate text-sm sm:text-base leading-relaxed">
            Reach out for verified property dossiers, valuation inquiries, or confidential residential mandates.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-2">
            <Phone className="w-5 h-5 text-gold-champagne" />
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">Direct Phone</h4>
            <a href="tel:+919876543210" className="text-xs font-semibold text-text-ink hover:text-gold-deep block">
              +91 98765 43210
            </a>
            <span className="text-[10px] text-text-muted block">Direct line to advisory desk</span>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">WhatsApp Business</h4>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="text-xs font-semibold text-emerald-700 hover:underline block">
              +91 98765 43210
            </a>
            <span className="text-[10px] text-text-muted block">Instant dossier sharing</span>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-2">
            <Mail className="w-5 h-5 text-gold-champagne" />
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">Email Inquiries</h4>
            <a href="mailto:enquiry@bricks2wall.com" className="text-xs font-semibold text-text-ink hover:text-gold-deep block">
              enquiry@bricks2wall.com
            </a>
            <span className="text-[10px] text-text-muted block">Responded within 4 business hours</span>
          </div>

          <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-2">
            <Clock className="w-5 h-5 text-gold-champagne" />
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">Office Hours</h4>
            <p className="text-xs text-text-ink font-semibold">
              Mon – Sat: 9:30 AM – 7:00 PM
            </p>
            <span className="text-[10px] text-text-muted block">Sunday viewings by prior appointment</span>
          </div>
        </div>

        {/* Lead Form Section */}
        <LeadCtaSection />

      </div>
    </div>
  );
}
