import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { getAgents } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Our Property Advisors | Bricks2Wall',
  description: 'Connect with certified property advisors specializing in luxury residential acquisitions, Grade-A commercial leasing, and portfolio structuring.',
};

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Licensed Advisory Team
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium">
            Personal Guidance from Seasoned Professionals
          </h1>
          <p className="text-text-slate text-sm sm:text-base leading-relaxed">
            Our advisors bring legal diligence, architectural acumen, and deep local market data to every transaction.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-canvas-ivory/60 rounded-2xl p-8 border border-canvas-grey hover:border-gold-champagne/40 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-gold-champagne/40">
                    <Image
                      src={agent.photoUrl}
                      alt={agent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-champagne" />
                      <span>{agent.licenseNumber || 'Certified Advisor'}</span>
                    </div>
                    <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                      {agent.name}
                    </h3>
                    <p className="text-xs text-text-slate">
                      {agent.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-text-slate leading-relaxed">
                  {agent.bio}
                </p>

                <div className="space-y-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted block">
                    Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {agent.specializations.map((spec, i) => (
                      <span key={i} className="text-[11px] px-2.5 py-1 rounded-md bg-white border border-canvas-grey text-text-ink">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-[11px] text-text-muted">
                  Languages: <strong className="text-navy-midnight">{agent.languages.join(', ')}</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-canvas-grey/70 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${agent.phone}`}
                    className="p-2 rounded-lg bg-white border border-canvas-grey hover:bg-gold-champagne hover:text-navy-deep text-navy-midnight transition-colors"
                    title="Direct Phone Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${agent.whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 transition-colors"
                    title="WhatsApp Chat"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>
                  <a
                    href={`mailto:${agent.email}`}
                    className="p-2 rounded-lg bg-white border border-canvas-grey hover:bg-gold-champagne hover:text-navy-deep text-navy-midnight transition-colors"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>

                <Link
                  href={`/agents/${agent.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-navy-midnight"
                >
                  <span>View Profile & Listings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
