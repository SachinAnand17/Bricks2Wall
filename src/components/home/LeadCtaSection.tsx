'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Phone, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { ContentSettings } from '@/types';

interface LeadCtaSectionProps {
  settings?: ContentSettings;
}

export default function LeadCtaSection({ settings }: LeadCtaSectionProps) {
  const router = useRouter();

  const eyebrow = settings?.leadCtaEyebrow || 'Direct Advisory';
  const heading = settings?.leadCtaHeading || 'Your next property conversation starts here.';
  const copy = settings?.leadCtaCopy || 'Tell us what you are looking for and our team will help you take the next step with verified insights and personal guidance.';
  const formTitle = settings?.leadFormTitle || 'Request Property Consultation';
  const formSubtitle = settings?.leadFormSubtitle || 'Receive curated property recommendations matched to your parameters.';
  const submitButtonText = settings?.leadSubmitButtonText || 'Submit Property Enquiry';
  const consentText = settings?.leadConsentText || 'I consent to receiving verified property details and direct contact from a licensed Bricks2Wall property advisor. We respect your privacy.';

  const phone = settings?.phoneContact || '+91 98765 43210';
  const email = settings?.emailContact || 'enquiry@bricks2wall.com';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    enquiryType: 'general' as const,
    preferredContactMethod: 'phone' as const,
    preferredTime: 'Morning (10:00 AM – 1:00 PM)',
    message: '',
    consent: true,
    website_hp: '', // Honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!formData.consent) {
      setErrorMsg('Please agree to be contacted regarding your property enquiry.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'contact_page',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        analytics.generateLead('general');
        router.push('/thank-you');
      } else {
        setErrorMsg(data.error || 'Unable to submit enquiry. Please try again or call our direct line.');
      }
    } catch {
      setErrorMsg('A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-white via-canvas-ivory to-white relative overflow-hidden">
      {/* Champagne Gold Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-champagne/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold-deep">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-champagne" />
              <span>{eyebrow}</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium leading-tight">
              {heading}
            </h2>

            <p className="text-text-slate text-base leading-relaxed">
              {copy}
            </p>

            <div className="space-y-4 pt-4 border-t border-canvas-grey text-xs text-text-slate">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-canvas-ivory flex items-center justify-center text-gold-deep">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-text-muted block">Direct Advisory Line</span>
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-semibold text-navy-midnight hover:text-gold-deep">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-canvas-ivory flex items-center justify-center text-gold-deep">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-text-muted block">Advisory Desk</span>
                  <a href={`mailto:${email}`} className="text-sm font-semibold text-navy-midnight hover:text-gold-deep">
                    {email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Gold-lit Glass Panel Form */}
          <div className="lg:col-span-7">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-gold-champagne/30 shadow-luxury">
              <h3 className="font-serif text-xl font-semibold text-navy-midnight mb-2">
                {formTitle}
              </h3>
              <p className="text-xs text-text-slate mb-6">
                {formSubtitle}
              </p>

              {errorMsg && (
                <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Honeypot anti-bot */}
                <input
                  type="text"
                  name="website_hp"
                  value={formData.website_hp}
                  onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-slate">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-11 px-3.5 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-slate">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 00000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full h-11 px-3.5 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-slate">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="vikram@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-11 px-3.5 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-text-slate">Requirement Type</label>
                    <select
                      value={formData.enquiryType}
                      onChange={(e) => setFormData({ ...formData, enquiryType: e.target.value as any })}
                      className="w-full h-11 px-3 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                    >
                      <option value="general">Residential Purchase (Buy)</option>
                      <option value="property">Luxury Apartment / Villa</option>
                      <option value="callback">Commercial Leasing / Office</option>
                      <option value="viewing">Schedule Site Walkthrough</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Your Requirements or Questions</label>
                  <textarea
                    rows={3}
                    placeholder="Tell us preferred localities, budget brackets, or specific requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-3 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne resize-none"
                  />
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-1 rounded text-gold-deep focus:ring-gold-champagne"
                  />
                  <label htmlFor="consentCheck" className="text-xs text-text-slate leading-relaxed">
                    {consentText}
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-widest hover:bg-gold-deep transition-all duration-300 shadow-luxury disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-gold-champagne" />
                      <span>{submitButtonText}</span>
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
