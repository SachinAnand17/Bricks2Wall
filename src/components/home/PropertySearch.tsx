'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Home, IndianRupee, Bed } from 'lucide-react';
import { TransactionType } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import GlassSelect from '@/components/ui/GlassSelect';

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
    <div className="relative -mt-6 sm:-mt-10 lg:-mt-12 z-40 max-w-6xl mx-auto px-3 sm:px-6">
      <div className="relative bg-white rounded-2xl shadow-luxury border border-canvas-grey p-4 sm:p-6 lg:p-7 overflow-visible">
        
        {/* Prominent Bold Mandala Background safely contained in rounded corners without clipping dropdowns */}
        <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 opacity-30">
            <MandalaArt seed="search-bg" size={340} variant="gold" spin={true} spinDuration={120} />
          </div>
        </div>

        {/* Top Header & Intent Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 sm:pb-6 border-b border-canvas-grey gap-3 sm:gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-canvas-ivory border border-gold-champagne/30 flex items-center justify-center shrink-0">
              <MandalaArt seed="search-icon" size={20} variant="gold" spin={true} spinDuration={45} />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-semibold text-navy-midnight">
                {title}
              </h3>
              <p className="text-[11px] sm:text-xs text-text-slate">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center p-1 bg-canvas-ivory rounded-full border border-canvas-grey self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar">
            {(['all', 'buy', 'rent', 'commercial'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-all duration-200 ${
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
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 pt-4 sm:pt-5 items-end relative z-20">
          
          {/* Location Field */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <MapPin className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Location</span>
            </label>
            <GlassSelect
              value={locality}
              onChange={(val) => setLocality(val)}
              options={[
                { value: 'all', label: 'All Prime Localities' },
                { value: 'North Greens', label: 'North Greens & Forest Enclaves' },
                { value: 'Central Boulevard', label: 'Central Boulevard & Quarter' },
                { value: 'Financial District', label: 'Financial District & Tech Park' },
                { value: 'Golf Links', label: 'Golf Links Estate' },
              ]}
              variant="glass"
              size="md"
            />
          </div>

          {/* Property Type */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <Home className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Property Type</span>
            </label>
            <GlassSelect
              value={propertyType}
              onChange={(val) => setPropertyType(val)}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'Apartment', label: 'Apartment' },
                { value: 'Penthouse', label: 'Sky Villa / Penthouse' },
                { value: 'Office Suite', label: 'Office Suite' },
                { value: 'Retail Frontage', label: 'Retail Frontage' },
              ]}
              variant="glass"
              size="md"
            />
          </div>

          {/* Budget */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <IndianRupee className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Budget</span>
            </label>
            <GlassSelect
              value={budgetRange}
              onChange={(val) => setBudgetRange(val)}
              options={[
                { value: 'all', label: 'Any Price' },
                { value: 'under-1cr', label: 'Under ₹1.00 Cr' },
                { value: '1cr-2cr', label: '₹1.00 Cr – ₹2.00 Cr' },
                { value: 'above-2cr', label: 'Above ₹2.00 Cr' },
                { value: 'rental-budget', label: 'Rentals Under ₹50K' },
              ]}
              variant="glass"
              size="md"
            />
          </div>

          {/* Bedrooms */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-slate">
              <Bed className="w-3.5 h-3.5 text-gold-champagne" />
              <span>Bedrooms</span>
            </label>
            <GlassSelect
              value={bedrooms}
              onChange={(val) => setBedrooms(val)}
              options={[
                { value: 'all', label: 'Any Configuration' },
                { value: '2', label: '2 BHK' },
                { value: '3', label: '3 BHK' },
                { value: '4', label: '4+ BHK' },
              ]}
              variant="glass"
              size="md"
            />
          </div>

          {/* Submit Search */}
          <div className="space-y-1.5">
            <button
              type="submit"
              className="w-full h-11 flex items-center justify-center gap-2 px-5 rounded-xl bg-navy-midnight text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-deep transition-all duration-300 shadow-md group"
            >
              <MandalaArt seed="search-btn-icon" size={16} variant="gold" spin={true} spinDuration={25} />
              <Search className="w-4 h-4 text-gold-champagne group-hover:scale-110 transition-transform" />
              <span>{buttonText}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
