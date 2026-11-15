'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, AlertCircle, Phone, MessageSquare } from 'lucide-react';
import { Property } from '@/types';
import { analytics } from '@/lib/analytics';
import GlassSelect from '@/components/ui/GlassSelect';

interface PropertyEnquiryFormProps {
  property: Property;
}

export default function PropertyEnquiryForm({ property }: PropertyEnquiryFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    preferredContactMethod: 'phone' as const,
    preferredTime: 'Morning (10:00 AM – 1:00 PM)',
    message: `Hello, I would like more information and current availability confirmation for "${property.title}".`,
    consent: true,
    website_hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim()) {
      setErrorMsg('Please provide your name.');
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
      setErrorMsg('Please confirm your consent to be contacted.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          enquiryType: 'property',
          propertyId: property.id,
          propertyTitle: property.title,
          source: 'property_page',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        analytics.generateLead('property', property.id);
        router.push('/thank-you');
      } else {
        setErrorMsg(data.error || 'Failed to submit enquiry. Please call us directly.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm">
      <div className="pb-4 border-b border-canvas-grey mb-5">
        <h3 className="font-serif text-lg font-semibold text-navy-midnight">
          Enquire on this Property
        </h3>
        <p className="text-xs text-text-slate">
          Connect directly with the assigned advisor for verified documentation
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="website_hp"
          value={formData.website_hp}
          onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-slate">Full Name *</label>
          <input
            type="text"
            required
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-10 px-3 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
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
            className="w-full h-10 px-3 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-slate">Email Address *</label>
          <input
            type="email"
            required
            placeholder="you@domain.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full h-10 px-3 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate block">Preferred Mode</label>
            <GlassSelect
              value={formData.preferredContactMethod}
              onChange={(val) => setFormData({ ...formData, preferredContactMethod: val as any })}
              options={[
                { value: 'phone', label: 'Phone Call' },
                { value: 'whatsapp', label: 'WhatsApp' },
                { value: 'email', label: 'Email' },
              ]}
              size="sm"
              variant="glass"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate block">Best Time</label>
            <GlassSelect
              value={formData.preferredTime}
              onChange={(val) => setFormData({ ...formData, preferredTime: val })}
              options={[
                { value: 'Morning (10:00 AM – 1:00 PM)', label: 'Morning' },
                { value: 'Afternoon (1:00 PM – 4:00 PM)', label: 'Afternoon' },
                { value: 'Evening (4:00 PM – 7:00 PM)', label: 'Evening' },
              ]}
              size="sm"
              variant="glass"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-slate">Message / Specific Questions</label>
          <textarea
            rows={2}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full p-2.5 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne resize-none"
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <input
            type="checkbox"
            id="propConsent"
            checked={formData.consent}
            onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
            className="mt-0.5 rounded text-gold-deep"
          />
          <label htmlFor="propConsent" className="text-[11px] text-text-muted leading-tight">
            I consent to receiving verified documentation and a callback from Bricks2Wall.
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying & Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-gold-champagne" />
              <span>Request Listing Dossier</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
