import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Briefcase, 
  Scale, 
  LineChart, 
  ArrowRight,
  PhoneCall
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Brokerage & Advisory Services | Bricks2Wall',
  description: 'Comprehensive property acquisition, corporate leasing, valuation, and legal due diligence advisory.',
};

const SERVICES = [
  {
    icon: Building2,
    title: 'Residential Acquisition & Advisory',
    description: 'Bespoke search and advisory for discerning homebuyers. We verify carpet area metrics, compare builder track records, and negotiate optimal transaction terms.',
    features: ['Exclusive inventory access', 'Independent valuation comparison', 'Title & RERA checks'],
  },
  {
    icon: KeyRound,
    title: 'Luxury Residences & Penthouses',
    description: 'Private representation for high-value architectural homes, sky villas, and signature penthouses with utmost confidentiality and discrete scheduling.',
    features: ['Private appointment viewings', 'Off-market opportunity access', 'Architectural specification review'],
  },
  {
    icon: Briefcase,
    title: 'Corporate Leasing & Office Spaces',
    description: 'Corporate occupier strategies for enterprises and startups. We source Grade-A commercial floorplates, manage lease negotiations, and audit CAM costs.',
    features: ['Workstation yield optimization', 'Lock-in and rent-free negotiation', 'LEED compliance checks'],
  },
  {
    icon: Scale,
    title: 'Legal Due Diligence & RERA Vetting',
    description: 'In-depth legal scrutiny before executing agreements. Our legal team examines title search reports, encumbrance certificates, and sanctioned municipal plans.',
    features: ['30-year title verification', 'Escrow payment compliance', 'Occupancy certificate checks'],
  },
  {
    icon: LineChart,
    title: 'Commercial Capital & Investment Yields',
    description: 'Quantitative analytics for private investors and family offices looking to deploy capital into pre-leased commercial assets and high-street retail.',
    features: ['Pre-leased asset analysis', 'Cap rate & internal rate of return (IRR)', 'Tenant covenant review'],
  },
  {
    icon: ShieldCheck,
    title: 'Turnkey Executive Relocation',
    description: 'High-amenity, fully furnished apartments for executives and multinational expatriates seeking hassle-free immediate occupancy.',
    features: ['High-speed connectivity ready', 'Society registration handling', 'Managed lease renewals'],
  },
];

export default function ServicesPage() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Specialized Advisory
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium">
            Brokerage with Architectural Clarity & Integrity
          </h1>
          <p className="text-text-slate text-base sm:text-lg leading-relaxed">
            We provide structured, institutional-grade guidance across residential purchases, corporate leasing, and legal verification.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-canvas-ivory/50 rounded-2xl p-8 border border-canvas-grey hover:border-gold-champagne/40 transition-all duration-300 shadow-sm hover:shadow-luxury flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-gold-deep border border-canvas-grey shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                    {s.title}
                  </h3>
                  <p className="text-xs text-text-slate leading-relaxed">
                    {s.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-canvas-grey/60 space-y-2">
                  {s.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-ink">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold-champagne" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <div className="bg-navy-midnight text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-luxury">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gold-champagne/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-champagne">
              Have a Specific Mandate?
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium">
              Consult with a Designated Advisory Principal
            </h2>
            <p className="text-sm text-white/75 leading-relaxed">
              Whether you are acquiring a flagship home or leasing a 20,000 sq ft corporate office, our senior partners are at your service.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gold-champagne text-navy-deep text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors"
              >
                <span>Request Consultation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/30 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/10 transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-gold-champagne" />
                <span>Call +91 98765 43210</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
