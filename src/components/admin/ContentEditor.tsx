'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { ContentSettings } from '@/types';

interface ContentEditorProps {
  initialSettings: ContentSettings;
  onRefresh: () => void;
}

export default function ContentEditor({ initialSettings, onRefresh }: ContentEditorProps) {
  const [settings, setSettings] = useState<ContentSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(false);

    try {
      const res = await fetch('/api/admin/content', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccessMsg(true);
        onRefresh();
        setTimeout(() => setSuccessMsg(false), 3000);
      }
    } catch (err) {
      console.error('Failed to update content:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey p-6 shadow-sm max-w-4xl">
      <div className="pb-4 border-b border-canvas-grey mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            Website Content & Brand Messaging CMS
          </h3>
          <p className="text-xs text-text-slate">
            Update homepage copy, announcement bar, and business contact information without code changes
          </p>
        </div>

        {successMsg && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Changes published live!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        
        {/* Announcement Strip */}
        <div className="p-4 rounded-xl bg-canvas-ivory/60 border border-canvas-grey space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-navy-midnight uppercase tracking-wider text-xs">
              Top Announcement Banner
            </h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.announcementActive}
                onChange={(e) => setSettings({ ...settings, announcementActive: e.target.checked })}
                className="rounded text-gold-deep"
              />
              <span className="font-medium">Active on Public Site</span>
            </label>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">Announcement Text</label>
            <input
              type="text"
              value={settings.announcementText}
              onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
              className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
            />
          </div>
        </div>

        {/* Hero Section Copy */}
        <div className="p-4 rounded-xl bg-canvas-ivory/60 border border-canvas-grey space-y-4">
          <h4 className="font-semibold text-navy-midnight uppercase tracking-wider text-xs">
            Homepage Hero Copy
          </h4>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">Hero Eyebrow</label>
            <input
              type="text"
              value={settings.heroEyebrow}
              onChange={(e) => setSettings({ ...settings, heroEyebrow: e.target.value })}
              className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">Hero Main Headline</label>
            <input
              type="text"
              value={settings.heroHeadline}
              onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
              className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">Hero Supporting Copy</label>
            <textarea
              rows={3}
              value={settings.heroCopy}
              onChange={(e) => setSettings({ ...settings, heroCopy: e.target.value })}
              className="w-full p-3 border border-canvas-grey rounded-lg bg-white resize-none"
            />
          </div>
        </div>

        {/* Contact Numbers & Legal Disclaimers */}
        <div className="p-4 rounded-xl bg-canvas-ivory/60 border border-canvas-grey space-y-4">
          <h4 className="font-semibold text-navy-midnight uppercase tracking-wider text-xs">
            Business Contact & Statutory Disclosures
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-medium text-text-slate">Direct Phone Line</label>
              <input
                type="text"
                value={settings.phoneContact}
                onChange={(e) => setSettings({ ...settings, phoneContact: e.target.value })}
                className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-text-slate">Advisory Email</label>
              <input
                type="email"
                value={settings.emailContact}
                onChange={(e) => setSettings({ ...settings, emailContact: e.target.value })}
                className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">Physical Office Address</label>
            <input
              type="text"
              value={settings.officeAddress}
              onChange={(e) => setSettings({ ...settings, officeAddress: e.target.value })}
              className="w-full h-10 px-3 border border-canvas-grey rounded-lg bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="font-medium text-text-slate">RERA & Property Regulatory Disclaimer</label>
            <textarea
              rows={3}
              value={settings.reraDisclaimerText}
              onChange={(e) => setSettings({ ...settings, reraDisclaimerText: e.target.value })}
              className="w-full p-3 border border-canvas-grey rounded-lg bg-white resize-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm disabled:opacity-60"
        >
          <Save className="w-4 h-4 text-gold-champagne" />
          <span>{saving ? 'Publishing Updates...' : 'Publish Content Changes'}</span>
        </button>

      </form>
    </div>
  );
}
