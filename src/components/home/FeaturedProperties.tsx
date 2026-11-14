'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Property } from '@/types';
import PropertyCard from './PropertyCard';

interface FeaturedPropertiesProps {
  properties: Property[];
  heading?: string;
  copy?: string;
}

export default function FeaturedProperties({
  properties,
  heading = 'A closer look at selected properties.',
  copy = 'Explore a curated selection of current opportunities. Listing details and availability are subject to confirmation.',
}: FeaturedPropertiesProps) {
  const [filter, setFilter] = useState<'all' | 'buy' | 'rent' | 'commercial'>('all');

  const filteredProperties = properties.filter((p) => {
    if (filter === 'all') return true;
    return p.transactionType === filter;
  });

  return (
    <section className="py-20 bg-gradient-to-b from-white via-canvas-ivory/40 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-gold-deep">
              <Sparkles className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Curated Opportunities</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium tracking-tight">
              {heading}
            </h2>
            <p className="text-text-slate text-sm sm:text-base leading-relaxed">
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
                    ? 'bg-navy-midnight text-white shadow-sm'
                    : 'bg-white border border-canvas-grey text-text-slate hover:border-gold-champagne hover:text-navy-midnight'
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
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gold-champagne text-gold-deep bg-white hover:bg-gold-champagne hover:text-navy-deep text-xs font-semibold tracking-widest uppercase transition-all duration-300 shadow-luxury group"
          >
            <span>Explore Complete Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
