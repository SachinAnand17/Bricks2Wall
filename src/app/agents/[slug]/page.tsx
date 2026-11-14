import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, MessageCircle, ShieldCheck, Check } from 'lucide-react';
import { getAgentBySlug, getProperties } from '@/lib/db';
import PropertyCard from '@/components/home/PropertyCard';

interface AgentDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const agent = getAgentBySlug(params.slug);
  if (!agent) return { title: 'Advisor Not Found' };
  return {
    title: `${agent.name} — ${agent.role} | Bricks2Wall`,
    description: agent.bio,
  };
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = getAgentBySlug(params.slug);
  if (!agent) notFound();

  const allProps = getProperties();
  const assignedProps = allProps.filter((p) => p.assignedAgentId === agent.id);

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-slate">
          <Link href="/" className="hover:text-gold-deep">Home</Link>
          <span>/</span>
          <Link href="/agents" className="hover:text-gold-deep">Advisors</Link>
          <span>/</span>
          <span className="text-navy-midnight font-medium">{agent.name}</span>
        </div>

        {/* Profile Card */}
        <div className="bg-canvas-ivory/60 rounded-3xl p-8 sm:p-12 border border-canvas-grey flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-3xl overflow-hidden shrink-0 border-4 border-white shadow-luxury">
            <Image
              src={agent.photoUrl}
              alt={agent.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div className="space-y-4 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-deep bg-white px-3 py-1 rounded-full border border-canvas-grey">
              <ShieldCheck className="w-4 h-4 text-gold-champagne" />
              <span>License: {agent.licenseNumber || 'Verified B2W Advisor'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
              {agent.name}
            </h1>

            <p className="text-sm font-semibold text-gold-deep">
              {agent.role}
            </p>

            <p className="text-text-slate text-sm sm:text-base leading-relaxed max-w-2xl">
              {agent.bio}
            </p>

            <div className="pt-2 flex flex-wrap gap-3 justify-center md:justify-start">
              <a
                href={`tel:${agent.phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-gold-champagne" />
                <span>{agent.phone}</span>
              </a>

              <a
                href={`https://wa.me/${agent.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 text-white text-xs font-semibold uppercase tracking-wider hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`mailto:${agent.email}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-canvas-grey text-navy-midnight text-xs font-semibold uppercase tracking-wider hover:bg-canvas-ivory transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-gold-champagne" />
                <span>Email Dossier</span>
              </a>
            </div>
          </div>
        </div>

        {/* Assigned Properties */}
        <div className="pt-8 border-t border-canvas-grey space-y-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
              Portfolio
            </span>
            <h2 className="font-serif text-2xl font-semibold text-navy-midnight">
              Properties Represented by {agent.name.split(' ')[0]}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(assignedProps.length > 0 ? assignedProps : allProps.slice(0, 3)).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
