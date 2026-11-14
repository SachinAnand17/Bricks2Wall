import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Phone, MessageSquare, ArrowRight, Home } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Thank You — Enquiry Received | Bricks2Wall',
  description: 'Your enquiry has been received. A member of our advisory team will review your request and contact you.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <div className="py-20 bg-gradient-to-b from-white via-canvas-ivory/50 to-white min-h-[75vh] flex items-center justify-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center space-y-8 animate-fade-in">
        
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Core Starter Copy from Section 9.2 */}
        <div className="space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            ENQUIRY CONFIRMED
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            THANK YOU
          </h1>

          <div className="p-6 rounded-2xl bg-white border border-canvas-grey shadow-sm text-text-slate text-sm sm:text-base leading-relaxed space-y-3">
            <p className="font-medium text-navy-midnight">
              Your enquiry has been received.
            </p>
            <p className="text-xs sm:text-sm text-text-slate">
              A member of our team will review your request and contact you using the details you provided. If your request is time-sensitive, use the verified contact options shown on this page.
            </p>
          </div>
        </div>

        {/* Immediate Escalation Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-xs">
          <a
            href="tel:+919876543210"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-navy-midnight text-white font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
          >
            <Phone className="w-4 h-4 text-gold-champagne" />
            <span>Call +91 98765 43210</span>
          </a>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-emerald-600 text-white font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp Advisory</span>
          </a>
        </div>

        {/* Return Button */}
        <div className="pt-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-deep hover:text-navy-midnight transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Continue Exploring Properties</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}
