'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';
import GlassSelect from '@/components/ui/GlassSelect';

interface ScheduleViewingFormProps {
  propertyId?: string;
  propertyTitle?: string;
  onSuccess?: () => void;
}

export default function ScheduleViewingForm({
  propertyId,
  propertyTitle,
  onSuccess,
}: ScheduleViewingFormProps) {
  const router = useRouter();

  // Tomorrow's date default
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    visitorEmail: '',
    preferredDate: minDate,
    timeSlot: '11:00 AM – 1:00 PM (Morning)',
    notes: '',
    consent: true,
    website_hp: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.visitorName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.visitorPhone.trim() || formData.visitorPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.preferredDate) {
      setErrorMsg('Please select a visit date.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/viewings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          propertyId,
          propertyTitle: propertyTitle || 'General Site Walkthrough',
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        analytics.viewingRequest(propertyId || 'general', formData.timeSlot);
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/thank-you?type=viewing');
        }
      } else {
        setErrorMsg(data.error || 'Failed to schedule viewing. Please call our desk.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-canvas-ivory/80 rounded-2xl p-6 sm:p-7 border border-gold-champagne/30 shadow-sm">
      <div className="pb-4 border-b border-canvas-grey mb-5">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-deep mb-1">
          <Calendar className="w-3.5 h-3.5 text-gold-champagne" />
          <span>Private Walkthrough</span>
        </div>
        <h3 className="font-serif text-xl font-semibold text-navy-midnight">
          Schedule an On-Site Viewing
        </h3>
        <p className="text-xs text-text-slate mt-1">
          Experience the property in person with a knowledgeable property advisor
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
          <label className="text-xs font-semibold text-text-slate">Your Name *</label>
          <input
            type="text"
            required
            placeholder="Full Name"
            value={formData.visitorName}
            onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
            style={{ color: '#10243A', backgroundColor: '#FFFFFF' }}
            className="w-full h-10 px-3 text-base sm:text-sm !text-[#10243A] !bg-white border border-[#C8A45D]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 focus:border-[#C8A45D] font-medium placeholder:text-[#717D8A] shadow-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate">Phone Number *</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 00000"
              value={formData.visitorPhone}
              onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
              style={{ color: '#10243A', backgroundColor: '#FFFFFF' }}
              className="w-full h-10 px-3 text-base sm:text-sm !text-[#10243A] !bg-white border border-[#C8A45D]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 focus:border-[#C8A45D] font-medium placeholder:text-[#717D8A] shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate">Email Address</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={formData.visitorEmail}
              onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
              style={{ color: '#10243A', backgroundColor: '#FFFFFF' }}
              className="w-full h-10 px-3 text-base sm:text-sm !text-[#10243A] !bg-white border border-[#C8A45D]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 focus:border-[#C8A45D] font-medium placeholder:text-[#717D8A] shadow-xs"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate">Preferred Date *</label>
            <input
              type="date"
              required
              min={minDate}
              value={formData.preferredDate}
              onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
              style={{ color: '#10243A', backgroundColor: '#FFFFFF' }}
              className="w-full h-10 px-3 text-base sm:text-sm !text-[#10243A] !bg-white border border-[#C8A45D]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 focus:border-[#C8A45D] font-medium shadow-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-slate block">Preferred Time Slot</label>
            <GlassSelect
              value={formData.timeSlot}
              onChange={(val) => setFormData({ ...formData, timeSlot: val })}
              options={[
                { value: '10:00 AM – 12:00 PM', label: '10:00 AM – 12:00 PM (Morning)' },
                { value: '12:00 PM – 2:00 PM', label: '12:00 PM – 2:00 PM (Midday)' },
                { value: '2:00 PM – 4:00 PM', label: '2:00 PM – 4:00 PM (Afternoon)' },
                { value: '4:00 PM – 6:30 PM', label: '4:00 PM – 6:30 PM (Evening)' },
              ]}
              size="sm"
              variant="glass"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-text-slate">Visiting Notes (Optional)</label>
          <textarea
            rows={2}
            placeholder="e.g., Accompanied by family, interested in parking bays and club amenities..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ color: '#10243A', backgroundColor: '#FFFFFF' }}
            className="w-full p-2.5 text-base sm:text-xs !text-[#10243A] !bg-white border border-[#C8A45D]/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A45D]/40 focus:border-[#C8A45D] resize-none placeholder:text-[#717D8A] shadow-xs"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-gold-champagne text-navy-deep text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep hover:text-white transition-all duration-300 shadow-sm disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Confirming Schedule...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Viewing Appointment</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
