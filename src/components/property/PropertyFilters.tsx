'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, LayoutGrid, Map, RotateCcw } from 'lucide-react';
import { TransactionType } from '@/types';

interface PropertyFiltersProps {
  totalCount: number;
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export default function PropertyFilters({
  totalCount,
  viewMode,
  onViewModeChange,
}: PropertyFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get('type') || 'all';
  const currentPropertyType = searchParams.get('propertyType') || 'all';
  const currentLocality = searchParams.get('locality') || 'all';
  const currentBedrooms = searchParams.get('bedrooms') || 'all';
  const currentSort = searchParams.get('sortBy') || 'newest';
  const currentSearch = searchParams.get('q') || '';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    router.push(pathname);
  };

  // Determine active filter chips
  const activeChips: { key: string; label: string }[] = [];
  if (currentType !== 'all') activeChips.push({ key: 'type', label: `Intent: ${currentType}` });
  if (currentPropertyType !== 'all') activeChips.push({ key: 'propertyType', label: `Type: ${currentPropertyType}` });
  if (currentLocality !== 'all') activeChips.push({ key: 'locality', label: `Locality: ${currentLocality}` });
  if (currentBedrooms !== 'all') activeChips.push({ key: 'bedrooms', label: `${currentBedrooms} BHK` });
  if (currentSearch) activeChips.push({ key: 'q', label: `"${currentSearch}"` });

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey p-5 shadow-sm space-y-4">
      {/* Top Filter Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gold-champagne absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by locality, keyword, or title..."
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateParam('q', (e.target as HTMLInputElement).value);
              }
            }}
            className="w-full h-10 pl-10 pr-4 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
          />
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* Sorting Dropdown */}
          <select
            value={currentSort}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="h-10 px-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl text-text-slate focus:outline-none focus:border-gold-champagne"
          >
            <option value="newest">Sort: Newest Listed</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="featured">Featured First</option>
          </select>

          {/* Grid / Map Toggle */}
          <div className="flex items-center p-1 bg-canvas-ivory rounded-xl border border-canvas-grey">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-navy-midnight text-white shadow-sm'
                  : 'text-text-slate hover:text-navy-midnight'
              }`}
              title="List & Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-navy-midnight text-white shadow-sm'
                  : 'text-text-slate hover:text-navy-midnight'
              }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">Map</span>
            </button>
          </div>
        </div>

      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-canvas-grey/60">
        
        {/* Transaction Type */}
        <select
          value={currentType}
          onChange={(e) => updateParam('type', e.target.value)}
          className="h-9 px-2.5 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-lg text-text-ink focus:outline-none focus:border-gold-champagne"
        >
          <option value="all">All Intent (Buy/Rent)</option>
          <option value="buy">Buy</option>
          <option value="rent">Rent</option>
          <option value="commercial">Commercial</option>
        </select>

        {/* Property Category */}
        <select
          value={currentPropertyType}
          onChange={(e) => updateParam('propertyType', e.target.value)}
          className="h-9 px-2.5 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-lg text-text-ink focus:outline-none focus:border-gold-champagne"
        >
          <option value="all">All Property Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Penthouse">Sky Villa / Penthouse</option>
          <option value="Office Suite">Office Suite</option>
          <option value="Retail Frontage">Retail Frontage</option>
        </select>

        {/* Locality */}
        <select
          value={currentLocality}
          onChange={(e) => updateParam('locality', e.target.value)}
          className="h-9 px-2.5 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-lg text-text-ink focus:outline-none focus:border-gold-champagne"
        >
          <option value="all">All Localities</option>
          <option value="North Greens">North Greens</option>
          <option value="Central Boulevard">Central Boulevard</option>
          <option value="Financial District">Financial District</option>
          <option value="Golf Links">Golf Links Estate</option>
        </select>

        {/* Bedrooms */}
        <select
          value={currentBedrooms}
          onChange={(e) => updateParam('bedrooms', e.target.value)}
          className="h-9 px-2.5 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-lg text-text-ink focus:outline-none focus:border-gold-champagne"
        >
          <option value="all">Any Bedrooms</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>

      </div>

      {/* Active Filter Chips & Result Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-muted font-medium">
            Showing <strong className="text-navy-midnight">{totalCount}</strong> verified properties
          </span>

          {activeChips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-canvas-ivory border border-gold-champagne/40 text-gold-deep text-[11px] font-semibold"
            >
              <span>{chip.label}</span>
              <button
                onClick={() => updateParam(chip.key, 'all')}
                className="hover:text-navy-midnight"
                aria-label={`Remove filter ${chip.label}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>

        {activeChips.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-[11px] text-text-slate hover:text-gold-deep font-semibold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>
    </div>
  );
}
