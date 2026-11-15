'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '@/types';
import PropertyCard from './PropertyCard';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';
import MandalaArt from '@/components/decorative/MandalaArt';

interface FeaturedPropertiesProps {
  properties: Property[];
  eyebrow?: string;
  heading?: string;
  copy?: string;
  ctaText?: string;
}

export default function FeaturedProperties({
  properties,
  eyebrow = 'Curated Opportunities',
  heading = 'A closer look at selected properties.',
  copy = 'Explore a curated selection of current opportunities. Listing details and availability are subject to confirmation.',
  ctaText = 'Explore Complete Catalogue',
}: FeaturedPropertiesProps) {
  const [filter, setFilter] = useState<'all' | 'buy' | 'rent' | 'commercial'>('all');

  const filteredProperties = properties.filter((p) => {
    if (filter === 'all') return true;
    return p.transactionType === filter;
  });

  return (
    <section className="relative overflow-hidden py-24 bg-gradient-to-b from-[#10243A] via-[#0D1D2E] to-[#091522] text-white">
      {/* Unique Distinctive Bold Mandala Watermarks */}
      <MandalaWatermark seed="featured-mandala-main" position="top-right" size={640} variant="white" opacity={0.38} spinDuration={160} />
      <MandalaWatermark seed="featured-mandala-ambient" position="bottom-left" size={500} variant="gold" opacity={0.35} spinDuration={200} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C8A45D]/40 text-xs font-semibold tracking-widest uppercase text-[#C8A45D]">
              <MandalaArt seed="featured-banner-icon" size={18} variant="gold" spin={true} spinDuration={35} />
              <span>{eyebrow}</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-medium tracking-tight">
              {heading}
            </h2>
            <p className="text-white/70 text-sm sm:text-base leading-relaxed">
              {copy}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            {(['all', 'buy', 'rent', 'commercial'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  filter === tab
                    ? 'bg-[#C8A45D] text-navy-deep shadow-luxury font-bold'
                    : 'bg-white/10 border border-white/20 text-white/80 hover:border-[#C8A45D] hover:text-white'
                }`}
              >
                {tab === 'all' ? 'All Curated' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.slice(0, 6).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {/* View All Footer CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/properties"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full border border-[#C8A45D] text-navy-deep bg-[#C8A45D] hover:bg-white hover:text-navy-midnight text-xs font-bold tracking-widest uppercase transition-all duration-300 shadow-luxury group"
          >
            <span>{ctaText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
