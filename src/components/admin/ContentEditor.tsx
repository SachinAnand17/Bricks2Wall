'use client';

import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  RotateCcw, 
  Sliders, 
  Layout, 
  Sparkles, 
  Search, 
  Layers, 
  ShieldCheck, 
  MessageSquare, 
  Phone, 
  FileText,
  ExternalLink,
  ChevronRight,
  Eye
} from 'lucide-react';
import { ContentSettings } from '@/types';
import { INITIAL_CONTENT_SETTINGS } from '@/lib/seed-data';

interface ContentEditorProps {
  initialSettings: ContentSettings;
  onRefresh?: () => void;
  onSaved?: () => void;
}

export default function ContentEditor({ initialSettings, onRefresh, onSaved }: ContentEditorProps) {
  const [settings, setSettings] = useState<ContentSettings>({
    ...INITIAL_CONTENT_SETTINGS,
    ...initialSettings,
  });

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleChange = (key: keyof ContentSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
        if (onRefresh) onRefresh();
        if (onSaved) onSaved();
        setTimeout(() => setSuccessMsg(false), 3500);
      }
    } catch (err) {
      console.error('Failed to update content:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all website text and banner settings to original master defaults?')) {
      setSettings(INITIAL_CONTENT_SETTINGS);
    }
  };

  const sections = [
    { id: 'announcement', label: 'Top Banner', icon: Sparkles },
    { id: 'hero', label: 'Hero & Headline', icon: Layout },
    { id: 'search_featured', label: 'Search & Featured', icon: Search },
    { id: 'categories_pillars', label: 'Categories & Why Us', icon: Layers },
    { id: 'process_locations', label: 'Process & Localities', icon: Sliders },
    { id: 'trust_testimonials', label: 'Trust & Testimonials', icon: ShieldCheck },
    { id: 'lead_form', label: 'Consultation Form', icon: MessageSquare },
    { id: 'contact_footer', label: 'Contact & Footer', icon: Phone },
  ];

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey shadow-sm overflow-hidden max-w-6xl">
      
      {/* Header Bar */}
      <div className="p-6 bg-gradient-to-r from-canvas-ivory via-white to-canvas-ivory border-b border-canvas-grey flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gold-deep mb-1">
            <Sliders className="w-4 h-4 text-gold-champagne" />
            <span>Universal CMS & Visual Studio</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-navy-midnight">
            Website Customizer & Live Text Control Panel
          </h3>
          <p className="text-xs text-text-slate mt-0.5">
            Modify any text, headline, banner, button, image, or statutory disclaimer across every corner of the platform.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {successMsg && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1.5 rounded-xl font-medium animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>All changes saved & live!</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-canvas-grey hover:bg-canvas-ivory text-text-slate text-xs font-medium transition-colors"
            title="Reset to factory master defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-all shadow-md disabled:opacity-60"
          >
            <Save className="w-4 h-4 text-gold-champagne" />
            <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Section Navigator Pills */}
      <div className="flex items-center gap-2 p-4 bg-canvas-ivory/50 border-b border-canvas-grey overflow-x-auto scrollbar-none">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-navy-midnight text-white shadow-sm ring-2 ring-gold-champagne/40'
                  : 'bg-white text-text-slate hover:bg-canvas-ivory border border-canvas-grey'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-gold-champagne' : 'text-text-muted'}`} />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form Fields Container */}
      <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
        
        {/* ========================================================= */}
        {/* SECTION 1: TOP ANNOUNCEMENT BANNER */}
        {/* ========================================================= */}
        {activeSection === 'announcement' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Top Announcement Bar
              </h4>
              <p className="text-xs text-text-slate">
                The top ribbon that appears above the main header across all pages.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.announcementActive}
                  onChange={(e) => handleChange('announcementActive', e.target.checked)}
                  className="w-4 h-4 rounded text-gold-deep focus:ring-gold-champagne"
                />
                <div>
                  <span className="text-xs font-bold text-navy-midnight block">Enable Announcement Banner</span>
                  <span className="text-[11px] text-text-muted">Turn on to display global notifications or campaign alerts</span>
                </div>
              </label>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-slate">Banner Message</label>
                <input
                  type="text"
                  value={settings.announcementText}
                  onChange={(e) => handleChange('announcementText', e.target.value)}
                  className="w-full h-11 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Action Link Text</label>
                  <input
                    type="text"
                    value={settings.announcementLinkText}
                    onChange={(e) => handleChange('announcementLinkText', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Target Destination URL</label>
                  <input
                    type="text"
                    value={settings.announcementLinkHref}
                    onChange={(e) => handleChange('announcementLinkHref', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                  />
                </div>
              </div>
            </div>

            {/* Header Navigation Controls */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">
                Primary Header Navigation Callouts
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Header Direct Phone</label>
                  <input
                    type="text"
                    value={settings.headerPhone}
                    onChange={(e) => handleChange('headerPhone', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Header CTA Button Text</label>
                  <input
                    type="text"
                    value={settings.headerCtaText}
                    onChange={(e) => handleChange('headerCtaText', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Header CTA Button Link</label>
                  <input
                    type="text"
                    value={settings.headerCtaHref}
                    onChange={(e) => handleChange('headerCtaHref', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 2: HERO & HEADLINE STUDIO */}
        {/* ========================================================= */}
        {activeSection === 'hero' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Homepage Hero & Main Headline Studio
              </h4>
              <p className="text-xs text-text-slate">
                Customize the first visual statement visitors see when they enter the platform.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-slate">Eyebrow Tag (Small uppercase badge)</label>
                <input
                  type="text"
                  value={settings.heroEyebrow}
                  onChange={(e) => handleChange('heroEyebrow', e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-semibold tracking-wider text-gold-deep"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Main Headline (First Part)</label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) => handleChange('heroHeadline', e.target.value)}
                    className="w-full h-11 px-3 text-sm font-serif font-bold text-navy-midnight bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-text-slate">Italic Gold Headline Accent</label>
                  <input
                    type="text"
                    value={settings.heroHeadlineHighlight}
                    onChange={(e) => handleChange('heroHeadlineHighlight', e.target.value)}
                    className="w-full h-11 px-3 text-sm font-serif italic text-gold-deep bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-slate">Supporting Hero Paragraph</label>
                <textarea
                  rows={3}
                  value={settings.heroCopy}
                  onChange={(e) => handleChange('heroCopy', e.target.value)}
                  className="w-full p-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne resize-none leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-canvas-ivory/50 border border-canvas-grey space-y-3">
                  <span className="text-[11px] font-bold text-navy-midnight uppercase tracking-wider block">Primary Button (Dark)</span>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Button Label</label>
                    <input
                      type="text"
                      value={settings.primaryCtaText}
                      onChange={(e) => handleChange('primaryCtaText', e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Target Link</label>
                    <input
                      type="text"
                      value={settings.primaryCtaHref}
                      onChange={(e) => handleChange('primaryCtaHref', e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-canvas-ivory/50 border border-canvas-grey space-y-3">
                  <span className="text-[11px] font-bold text-navy-midnight uppercase tracking-wider block">Secondary Button (Outlined)</span>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Button Label</label>
                    <input
                      type="text"
                      value={settings.secondaryCtaText}
                      onChange={(e) => handleChange('secondaryCtaText', e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Target Link</label>
                    <input
                      type="text"
                      value={settings.secondaryCtaHref}
                      onChange={(e) => handleChange('secondaryCtaHref', e.target.value)}
                      className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* 3 Trust Metrics */}
              <div className="p-4 rounded-xl bg-canvas-ivory/50 border border-canvas-grey space-y-3">
                <span className="text-[11px] font-bold text-navy-midnight uppercase tracking-wider block">Hero Micro Statistics (3 Columns)</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Stat 1 Value & Label</label>
                    <input
                      type="text"
                      value={settings.heroStat1Value}
                      onChange={(e) => handleChange('heroStat1Value', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={settings.heroStat1Label}
                      onChange={(e) => handleChange('heroStat1Label', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg mt-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Stat 2 Value & Label</label>
                    <input
                      type="text"
                      value={settings.heroStat2Value}
                      onChange={(e) => handleChange('heroStat2Value', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={settings.heroStat2Label}
                      onChange={(e) => handleChange('heroStat2Label', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg mt-1"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Stat 3 Value & Label</label>
                    <input
                      type="text"
                      value={settings.heroStat3Value}
                      onChange={(e) => handleChange('heroStat3Value', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg font-bold"
                    />
                    <input
                      type="text"
                      value={settings.heroStat3Label}
                      onChange={(e) => handleChange('heroStat3Label', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Architectural Image & Floating Card */}
              <div className="p-4 rounded-xl bg-canvas-ivory/50 border border-canvas-grey space-y-3">
                <span className="text-[11px] font-bold text-navy-midnight uppercase tracking-wider block">Right Visual Showcase Card</span>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Hero Architectural Image URL</label>
                  <input
                    type="text"
                    value={settings.heroImageUrl}
                    onChange={(e) => handleChange('heroImageUrl', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Floating Badge</label>
                    <input
                      type="text"
                      value={settings.heroCardBadge}
                      onChange={(e) => handleChange('heroCardBadge', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Floating Title</label>
                    <input
                      type="text"
                      value={settings.heroCardTitle}
                      onChange={(e) => handleChange('heroCardTitle', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Floating Subtitle</label>
                    <input
                      type="text"
                      value={settings.heroCardSubtitle}
                      onChange={(e) => handleChange('heroCardSubtitle', e.target.value)}
                      className="w-full h-8 px-2 text-xs bg-white border border-canvas-grey rounded-lg"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 3: SEARCH MODULE & FEATURED PROPERTIES */}
        {/* ========================================================= */}
        {activeSection === 'search_featured' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Search Module & Featured Showcase Banner
              </h4>
              <p className="text-xs text-text-slate">
                Customize titles and labels for the interactive discovery bar and featured grid.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">1. Property Search Module</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Search Box Title</label>
                  <input
                    type="text"
                    value={settings.searchTitle}
                    onChange={(e) => handleChange('searchTitle', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Search Button Text</label>
                  <input
                    type="text"
                    value={settings.searchButtonText}
                    onChange={(e) => handleChange('searchButtonText', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Search Box Subtitle</label>
                <input
                  type="text"
                  value={settings.searchSubtitle}
                  onChange={(e) => handleChange('searchSubtitle', e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl"
                />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">2. Featured Properties Section</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Eyebrow Badge</label>
                  <input
                    type="text"
                    value={settings.featuredEyebrow}
                    onChange={(e) => handleChange('featuredEyebrow', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl font-semibold text-gold-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Bottom Button Label</label>
                  <input
                    type="text"
                    value={settings.featuredCtaText}
                    onChange={(e) => handleChange('featuredCtaText', e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl uppercase font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Section Main Heading</label>
                <input
                  type="text"
                  value={settings.featuredHeading}
                  onChange={(e) => handleChange('featuredHeading', e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-white border border-canvas-grey rounded-xl font-serif font-bold text-navy-midnight"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Section Supporting Description</label>
                <textarea
                  rows={2}
                  value={settings.featuredCopy}
                  onChange={(e) => handleChange('featuredCopy', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-xl resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 4: CATEGORIES & WHY WORK WITH US */}
        {/* ========================================================= */}
        {activeSection === 'categories_pillars' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Category Discovery Tiles & Core Pillars (Why Work With Us)
              </h4>
              <p className="text-xs text-text-slate">
                Manage the 4 portfolio category visual cards and the 4 trust pillars.
              </p>
            </div>

            {/* 4 Categories */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Category Cards (4 Visual Tiles)</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Tile 1 */}
                <div className="p-3.5 bg-white rounded-xl border border-canvas-grey space-y-2">
                  <span className="text-[11px] font-bold text-gold-deep block">Tile 1</span>
                  <input
                    type="text"
                    value={settings.category1Title}
                    onChange={(e) => handleChange('category1Title', e.target.value)}
                    placeholder="Title"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category1Subtitle}
                    onChange={(e) => handleChange('category1Subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category1Image}
                    onChange={(e) => handleChange('category1Image', e.target.value)}
                    placeholder="Image URL"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>

                {/* Tile 2 */}
                <div className="p-3.5 bg-white rounded-xl border border-canvas-grey space-y-2">
                  <span className="text-[11px] font-bold text-gold-deep block">Tile 2</span>
                  <input
                    type="text"
                    value={settings.category2Title}
                    onChange={(e) => handleChange('category2Title', e.target.value)}
                    placeholder="Title"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category2Subtitle}
                    onChange={(e) => handleChange('category2Subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category2Image}
                    onChange={(e) => handleChange('category2Image', e.target.value)}
                    placeholder="Image URL"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>

                {/* Tile 3 */}
                <div className="p-3.5 bg-white rounded-xl border border-canvas-grey space-y-2">
                  <span className="text-[11px] font-bold text-gold-deep block">Tile 3</span>
                  <input
                    type="text"
                    value={settings.category3Title}
                    onChange={(e) => handleChange('category3Title', e.target.value)}
                    placeholder="Title"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category3Subtitle}
                    onChange={(e) => handleChange('category3Subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category3Image}
                    onChange={(e) => handleChange('category3Image', e.target.value)}
                    placeholder="Image URL"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>

                {/* Tile 4 */}
                <div className="p-3.5 bg-white rounded-xl border border-canvas-grey space-y-2">
                  <span className="text-[11px] font-bold text-gold-deep block">Tile 4</span>
                  <input
                    type="text"
                    value={settings.category4Title}
                    onChange={(e) => handleChange('category4Title', e.target.value)}
                    placeholder="Title"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category4Subtitle}
                    onChange={(e) => handleChange('category4Subtitle', e.target.value)}
                    placeholder="Subtitle"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                  <input
                    type="text"
                    value={settings.category4Image}
                    onChange={(e) => handleChange('category4Image', e.target.value)}
                    placeholder="Image URL"
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>
              </div>
            </div>

            {/* The Bricks2Wall Standard (4 Pillars) */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">The Bricks2Wall Standard (4 Pillars)</span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Section Heading</label>
                  <input
                    type="text"
                    value={settings.whyHeading}
                    onChange={(e) => handleChange('whyHeading', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Link Text</label>
                  <input
                    type="text"
                    value={settings.whyStoryLinkText}
                    onChange={(e) => handleChange('whyStoryLinkText', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>

              {/* 4 Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-deep block">Pillar 1</label>
                  <input
                    type="text"
                    value={settings.pillar1Title}
                    onChange={(e) => handleChange('pillar1Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar1Desc}
                    onChange={(e) => handleChange('pillar1Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-deep block">Pillar 2</label>
                  <input
                    type="text"
                    value={settings.pillar2Title}
                    onChange={(e) => handleChange('pillar2Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar2Desc}
                    onChange={(e) => handleChange('pillar2Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-deep block">Pillar 3</label>
                  <input
                    type="text"
                    value={settings.pillar3Title}
                    onChange={(e) => handleChange('pillar3Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar3Desc}
                    onChange={(e) => handleChange('pillar3Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <label className="text-[10px] font-bold text-gold-deep block">Pillar 4</label>
                  <input
                    type="text"
                    value={settings.pillar4Title}
                    onChange={(e) => handleChange('pillar4Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.pillar4Desc}
                    onChange={(e) => handleChange('pillar4Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 5: PROCESS WORKFLOW & LOCALITIES */}
        {/* ========================================================= */}
        {activeSection === 'process_locations' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                4-Step Process Workflow & Locality Guide Banner
              </h4>
              <p className="text-xs text-text-slate">
                Edit the 4-step buyer journey and neighbourhood introduction copy.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">4-Step Guided Process</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Section Title</label>
                  <input
                    type="text"
                    value={settings.processHeading}
                    onChange={(e) => handleChange('processHeading', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">CTA Button Label</label>
                  <input
                    type="text"
                    value={settings.processCtaText}
                    onChange={(e) => handleChange('processCtaText', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg uppercase font-bold"
                  />
                </div>
              </div>

              {/* 4 Steps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-deep block">Step 01</span>
                  <input
                    type="text"
                    value={settings.step1Title}
                    onChange={(e) => handleChange('step1Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={settings.step1Desc}
                    onChange={(e) => handleChange('step1Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-deep block">Step 02</span>
                  <input
                    type="text"
                    value={settings.step2Title}
                    onChange={(e) => handleChange('step2Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={settings.step2Desc}
                    onChange={(e) => handleChange('step2Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-deep block">Step 03</span>
                  <input
                    type="text"
                    value={settings.step3Title}
                    onChange={(e) => handleChange('step3Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={settings.step3Desc}
                    onChange={(e) => handleChange('step3Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1.5">
                  <span className="text-[10px] font-bold text-gold-deep block">Step 04</span>
                  <input
                    type="text"
                    value={settings.step4Title}
                    onChange={(e) => handleChange('step4Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={3}
                    value={settings.step4Desc}
                    onChange={(e) => handleChange('step4Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Locality Showcase */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Neighbourhood Showcase Section</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Section Heading</label>
                  <input
                    type="text"
                    value={settings.locationsHeading}
                    onChange={(e) => handleChange('locationsHeading', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">View All Link Text</label>
                  <input
                    type="text"
                    value={settings.locationsLinkText}
                    onChange={(e) => handleChange('locationsLinkText', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Section Description</label>
                <textarea
                  rows={2}
                  value={settings.locationsCopy}
                  onChange={(e) => handleChange('locationsCopy', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 6: TRUST & TESTIMONIALS */}
        {/* ========================================================= */}
        {activeSection === 'trust_testimonials' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Trust, Regulatory Rigor & Client Testimonials
              </h4>
              <p className="text-xs text-text-slate">
                Edit the 3 verification pillars, the Bricks2Wall Guarantee card, and client review banners.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Trust & Verification Section</span>
              
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Main Heading</label>
                <input
                  type="text"
                  value={settings.trustHeading}
                  onChange={(e) => handleChange('trustHeading', e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1">
                  <label className="text-[10px] font-bold text-gold-deep block">Point 1</label>
                  <input
                    type="text"
                    value={settings.trustPoint1Title}
                    onChange={(e) => handleChange('trustPoint1Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.trustPoint1Desc}
                    onChange={(e) => handleChange('trustPoint1Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1">
                  <label className="text-[10px] font-bold text-gold-deep block">Point 2</label>
                  <input
                    type="text"
                    value={settings.trustPoint2Title}
                    onChange={(e) => handleChange('trustPoint2Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.trustPoint2Desc}
                    onChange={(e) => handleChange('trustPoint2Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>

                <div className="p-3 bg-white rounded-xl border border-canvas-grey space-y-1">
                  <label className="text-[10px] font-bold text-gold-deep block">Point 3</label>
                  <input
                    type="text"
                    value={settings.trustPoint3Title}
                    onChange={(e) => handleChange('trustPoint3Title', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                  />
                  <textarea
                    rows={2}
                    value={settings.trustPoint3Desc}
                    onChange={(e) => handleChange('trustPoint3Desc', e.target.value)}
                    className="w-full p-2 text-xs border border-canvas-grey rounded resize-none"
                  />
                </div>
              </div>

              {/* The Guarantee Box */}
              <div className="p-4 bg-white rounded-xl border border-canvas-grey space-y-3">
                <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">The Bricks2Wall Guarantee Card</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Guarantee Title</label>
                    <input
                      type="text"
                      value={settings.trustGuaranteeTitle}
                      onChange={(e) => handleChange('trustGuaranteeTitle', e.target.value)}
                      className="w-full h-8 px-2 text-xs border border-canvas-grey rounded font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted">Button CTA Label</label>
                    <input
                      type="text"
                      value={settings.trustCtaText}
                      onChange={(e) => handleChange('trustCtaText', e.target.value)}
                      className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Guarantee Point 1</label>
                  <input
                    type="text"
                    value={settings.trustGuaranteePoint1}
                    onChange={(e) => handleChange('trustGuaranteePoint1', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted">Guarantee Point 2</label>
                  <input
                    type="text"
                    value={settings.trustGuaranteePoint2}
                    onChange={(e) => handleChange('trustGuaranteePoint2', e.target.value)}
                    className="w-full h-8 px-2 text-xs border border-canvas-grey rounded"
                  />
                </div>
              </div>
            </div>

            {/* Testimonials & Insights Banners */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Testimonials & Insights Section Banners</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Testimonials Section Title</label>
                  <input
                    type="text"
                    value={settings.testimonialsHeading}
                    onChange={(e) => handleChange('testimonialsHeading', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Insights Section Title</label>
                  <input
                    type="text"
                    value={settings.insightsHeading}
                    onChange={(e) => handleChange('insightsHeading', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 7: CONSULTATION / LEAD FORM */}
        {/* ========================================================= */}
        {activeSection === 'lead_form' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Lead Capture & Consultation Form Section
              </h4>
              <p className="text-xs text-text-slate">
                Customize copy, form labels, submit button text, and consent disclaimer.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Eyebrow Tag</label>
                  <input
                    type="text"
                    value={settings.leadCtaEyebrow}
                    onChange={(e) => handleChange('leadCtaEyebrow', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-semibold text-gold-deep"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Submit Button Label</label>
                  <input
                    type="text"
                    value={settings.leadSubmitButtonText}
                    onChange={(e) => handleChange('leadSubmitButtonText', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-bold uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Section Headline</label>
                <input
                  type="text"
                  value={settings.leadCtaHeading}
                  onChange={(e) => handleChange('leadCtaHeading', e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-serif font-bold text-navy-midnight"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Section Supporting Copy</label>
                <textarea
                  rows={2}
                  value={settings.leadCtaCopy}
                  onChange={(e) => handleChange('leadCtaCopy', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Form Card Title</label>
                  <input
                    type="text"
                    value={settings.leadFormTitle}
                    onChange={(e) => handleChange('leadFormTitle', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Form Card Subtitle</label>
                  <input
                    type="text"
                    value={settings.leadFormSubtitle}
                    onChange={(e) => handleChange('leadFormSubtitle', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Consent Checkbox Disclaimer</label>
                <textarea
                  rows={2}
                  value={settings.leadConsentText}
                  onChange={(e) => handleChange('leadConsentText', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* SECTION 8: CONTACT, OFFICE & FOOTER */}
        {/* ========================================================= */}
        {activeSection === 'contact_footer' && (
          <div className="space-y-6 animate-fade-in">
            <div className="pb-3 border-b border-canvas-grey">
              <h4 className="font-serif text-lg font-semibold text-navy-midnight">
                Contact Details, Office Hours & Footer Disclaimers
              </h4>
              <p className="text-xs text-text-slate">
                Manage global phone numbers, office address, RERA legal notice, and footer compliance text.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Global Contact Channels</span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Direct Advisory Phone</label>
                  <input
                    type="text"
                    value={settings.phoneContact}
                    onChange={(e) => {
                      handleChange('phoneContact', e.target.value);
                      handleChange('headerPhone', e.target.value);
                    }}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">WhatsApp Business Number</label>
                  <input
                    type="text"
                    value={settings.whatsappContact}
                    onChange={(e) => handleChange('whatsappContact', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Advisory Email</label>
                  <input
                    type="email"
                    value={settings.emailContact}
                    onChange={(e) => handleChange('emailContact', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Physical Office Address</label>
                  <input
                    type="text"
                    value={settings.officeAddress}
                    onChange={(e) => handleChange('officeAddress', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Business Hours</label>
                  <input
                    type="text"
                    value={settings.businessHours}
                    onChange={(e) => handleChange('businessHours', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">RERA & Regulatory Disclaimer (Site-wide)</label>
                <textarea
                  rows={2}
                  value={settings.reraDisclaimerText}
                  onChange={(e) => handleChange('reraDisclaimerText', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>
            </div>

            {/* Footer Specific Content */}
            <div className="p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey space-y-4">
              <span className="text-xs font-bold text-navy-midnight uppercase tracking-wider block">Footer Text & Compliance Band</span>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Footer Brand Blurb</label>
                <textarea
                  rows={2}
                  value={settings.footerBrandDescription}
                  onChange={(e) => handleChange('footerBrandDescription', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-slate">Regulatory & Integrity Compliance Notice</label>
                <textarea
                  rows={2}
                  value={settings.footerComplianceNotice}
                  onChange={(e) => handleChange('footerComplianceNotice', e.target.value)}
                  className="w-full p-2.5 text-xs bg-white border border-canvas-grey rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Demo Listing Notice</label>
                  <input
                    type="text"
                    value={settings.footerDemoNotice}
                    onChange={(e) => handleChange('footerDemoNotice', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text-slate">Copyright Notice</label>
                  <input
                    type="text"
                    value={settings.footerCopyrightText}
                    onChange={(e) => handleChange('footerCopyrightText', e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-white border border-canvas-grey rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="pt-6 border-t border-canvas-grey flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Changes persist immediately to disk (<code>data/database.json</code>)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-4 py-2 rounded-xl border border-canvas-grey hover:bg-canvas-ivory text-text-slate text-xs font-medium"
            >
              Reset Defaults
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-md disabled:opacity-60"
            >
              <Save className="w-4 h-4 text-gold-champagne" />
              <span>{saving ? 'Publishing...' : 'Save & Publish Live'}</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
