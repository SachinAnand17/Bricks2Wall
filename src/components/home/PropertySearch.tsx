'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee, Bed } from 'lucide-react';
import { TransactionType } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';

interface PropertySearchProps {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export default function PropertySearch({
  title = 'Find a property that fits your plans.',
  subtitle = 'Explore verified residential and commercial opportunities',
  buttonText = 'Find Properties',
}: PropertySearchProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TransactionType | 'all'>('buy');
  const [locality, setLocality] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [budgetRange, setBudgetRange] = useState('all');
  const [bedrooms, setBedrooms] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (activeTab !== 'all') params.set('type', activeTab);
    if (locality !== 'all') params.set('locality', locality);
    if (propertyType !== 'all') params.set('propertyType', propertyType);
    if (bedrooms !== 'all') params.set('bedrooms', bedrooms);

    if (budgetRange === 'under-1cr') {
      params.set('maxPrice', '10000000');
    } else if (budgetRange === '1cr-2cr') {
      params.set('minPrice', '10000000');
      params.set('maxPrice', '20000000');
    } else if (budgetRange === 'above-2cr') {
      params.set('minPrice', '20000000');
    } else if (budgetRange === 'rental-budget') {
      params.set('maxPrice', '50000');
    }

    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div className="relative -mt-8 sm:-mt-12 z-20 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="relative bg-white rounded-2xl shadow-luxury border border-canvas-grey p-4 sm:p-6 lg:p-7 overflow-hidden">
        
        {/* Subtle Ambient Mandala Background */}
        <div className="absolute -top-24 -right-24 pointer-events-none opacity-[0.06]">
          <MandalaArt seed="search-bg" size={320} variant="gold" spin={true} spinDuration={140} />
        </div>

        {/* Top Header & Intent Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-canvas-grey gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-canvas-ivory border border-gold-champagne/30 flex items-center justify-center shrink-0">
              <MandalaArt seed="search-icon" size={24} variant="gold" spin={true} spinDuration={45} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-navy-midnight">
                {title}
              </h3>
              <p className="text-xs text-text-slate">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center p-1 bg-canvas-ivory rounded-full border border-canvas-grey self-start sm:self-auto">
            {(['all', 'buy', 'rent', 'commercial'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-navy-midnight text-white shadow-sm'
                    : 'text-text-slate hover:text-navy-midnight'
                }`}
              >
                {tab === 'all' ? 'All' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Search Controls Form */}
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-5 items-end">
          
          {/* Location Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <MapPin className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Location</span>
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full h-11 px-3 text-sm text-text-ink bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne transition-colors"
            >
              <option value="all">All Prime Localities</option>
              <option value="North Greens">North Greens & Forest Enclaves</option>
              <option value="Central Boulevard">Central Boulevard & Quarter</option>
              <option value="Financial District">Financial District & Tech Park</option>
              <option value="Golf Links">Golf Links Estate</option>
            </select>
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <Home className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Property Type</span>
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full h-11 px-3 text-sm text-text-ink bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="Apartment">Apartment</option>
              <option value="Penthouse">Sky Villa / Penthouse</option>
              <option value="Office Suite">Office Suite</option>
              <option value="Retail Frontage">Retail Frontage</option>
            </select>
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <IndianRupee className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Budget</span>
            </label>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="w-full h-11 px-3 text-sm text-text-ink bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne transition-colors"
            >
              <option value="all">Any Price</option>
              <option value="under-1cr">Under ₹1.00 Cr</option>
              <option value="1cr-2cr">₹1.00 Cr – ₹2.00 Cr</option>
              <option value="above-2cr">Above ₹2.00 Cr</option>
              <option value="rental-budget">Rentals Under ₹50K</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <Bed className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Bedrooms</span>
            </label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full h-11 px-3 text-sm text-text-ink bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne transition-colors"
            >
              <option value="all">Any Configuration</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>

          {/* Submit Search */}
          <div className="space-y-1.5">
            <button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-navy-midnight text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-deep transition-all duration-300 shadow-md group"
            >
              <Search className="w-4 h-4 text-gold-champagne group-hover:scale-110 transition-transform" />
              <span>{buttonText}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
