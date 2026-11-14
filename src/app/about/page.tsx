import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Compass, Award, Building, ArrowRight } from 'lucide-react';
import { getAgents } from '@/lib/db';

export const metadata: Metadata = {
  title: 'About Us | Bricks2Wall Real Estate Advisory',
  description: 'Bricks2Wall was established to restore integrity, architectural clarity, and personal perspective to property decisions in India.',
};

export default function AboutPage() {
  const agents = getAgents();

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
              The Bricks2Wall Story
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium leading-tight">
              Property advisory, grounded in truth and architectural perspective.
            </h1>
            <p className="text-text-slate text-base sm:text-lg leading-relaxed">
              Real estate in India is often plagued by opacity: exaggerated super built-up areas, speculative pricing, and unverified availability. Bricks2Wall was established to provide an informed antidote.
            </p>
            <p className="text-text-slate text-sm sm:text-base leading-relaxed">
              We operate not as transactional agents, but as fiduciary advisors. We review floor plates, calculate genuine carpet areas, verify title chains at sub-registrar offices, and examine sanctioned municipal blueprints so our clients make property decisions with absolute confidence.
            </p>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-luxury border-4 border-canvas-ivory">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Bricks2Wall Architectural Philosophy"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values Strip */}
        <div className="pt-8 border-t border-canvas-grey">
          <div className="text-center max-w-2xl mx-auto pb-12 space-y-2">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
              Our Principles
            </span>
            <h2 className="font-serif text-3xl font-medium text-navy-midnight">
              Four Anchors of Trust
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold-deep shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-navy-midnight">Zero Phantom Listings</h3>
              <p className="text-xs text-text-slate leading-relaxed">We never invent listings or display speculative units. Every active property is physically inspected and owner-authorized.</p>
            </div>

            <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold-deep shadow-sm">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-navy-midnight">Carpet Area Transparency</h3>
              <p className="text-xs text-text-slate leading-relaxed">We mandate clear RERA-compliant carpet area disclosures, ensuring buyers pay for usable livable space.</p>
            </div>

            <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold-deep shadow-sm">
                <Building className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-navy-midnight">Architectural Insight</h3>
              <p className="text-xs text-text-slate leading-relaxed">Beyond aesthetics, we evaluate orientation, cross-ventilation, acoustic buffers, and structural builder pedigree.</p>
            </div>

            <div className="p-6 rounded-2xl bg-canvas-ivory/60 border border-canvas-grey space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gold-deep shadow-sm">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-base font-semibold text-navy-midnight">Fiduciary Representation</h3>
              <p className="text-xs text-text-slate leading-relaxed">We represent your best interests throughout negotiation, ensuring contract terms protect your long-term capital.</p>
            </div>
          </div>
        </div>

        {/* Advisory Leadership */}
        <div className="pt-8 border-t border-canvas-grey space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
                Leadership Team
              </span>
              <h2 className="font-serif text-3xl font-medium text-navy-midnight">
                Meet Our Principal Advisors
              </h2>
            </div>
            <Link
              href="/agents"
              className="text-xs font-semibold text-gold-deep hover:text-navy-midnight uppercase tracking-wider"
            >
              View Full Team
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-canvas-ivory/50 rounded-2xl p-6 border border-canvas-grey flex flex-col sm:flex-row items-center sm:items-start gap-5"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0 border-2 border-gold-champagne/40">
                  <Image
                    src={agent.photoUrl}
                    alt={agent.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                    {agent.name}
                  </h3>
                  <p className="text-xs text-gold-deep font-medium">
                    {agent.role}
                  </p>
                  <p className="text-xs text-text-slate leading-relaxed">
                    {agent.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
