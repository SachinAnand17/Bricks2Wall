'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, SlidersHorizontal, X, LayoutGrid, Map, RotateCcw } from 'lucide-react';
import { TransactionType } from '@/types';
import GlassSelect from '@/components/ui/GlassSelect';

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">

        {/* Search Input */}
        <div className="relative flex-1 w-full lg:max-w-md">
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
            className="w-full h-10 pl-10 pr-4 text-xs sm:text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
          />
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
          {/* Sorting Dropdown */}
          <GlassSelect
            value={currentSort}
            onChange={(val) => updateParam('sortBy', val)}
            options={[
              { value: 'newest', label: 'Sort: Newest Listed' },
              { value: 'price_asc', label: 'Price: Low to High' },
              { value: 'price_desc', label: 'Price: High to Low' },
              { value: 'featured', label: 'Featured First' },
            ]}
            size="md"
            variant="glass"
            className="flex-1 sm:w-48"
          />

          {/* Grid / Map Toggle */}
          <div className="flex items-center p-1 bg-canvas-ivory rounded-xl border border-canvas-grey shrink-0">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${viewMode === 'grid'
                  ? 'bg-navy-midnight text-white shadow-sm font-semibold'
                  : 'text-text-slate hover:text-navy-midnight'
                }`}
              title="List & Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="inline">Grid</span>
            </button>
            <button
              onClick={() => onViewModeChange('map')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${viewMode === 'map'
                  ? 'bg-navy-midnight text-white shadow-sm font-semibold'
                  : 'text-text-slate hover:text-navy-midnight'
                }`}
              title="Interactive Map View"
            >
              <Map className="w-4 h-4" />
              <span className="inline">Map</span>
            </button>
          </div>
        </div>

      </div>

      {/* Filter Selectors Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-canvas-grey/60">

        {/* Transaction Type */}
        <GlassSelect
          value={currentType}
          onChange={(val) => updateParam('type', val)}
          options={[
            { value: 'all', label: 'All Intent (Buy/Rent)' },
            { value: 'buy', label: 'Buy' },
            { value: 'rent', label: 'Rent' },
            { value: 'commercial', label: 'Commercial' },
          ]}
          size="sm"
          variant="glass"
        />

        {/* Property Category */}
        <GlassSelect
          value={currentPropertyType}
          onChange={(val) => updateParam('propertyType', val)}
          options={[
            { value: 'all', label: 'All Property Types' },
            { value: 'Apartment', label: 'Apartment' },
            { value: 'Penthouse', label: 'Sky Villa / Penthouse' },
            { value: 'Office Suite', label: 'Office Suite' },
            { value: 'Retail Frontage', label: 'Retail Frontage' },
          ]}
          size="sm"
          variant="glass"
        />

        {/* Locality */}
        <GlassSelect
          value={currentLocality}
          onChange={(val) => updateParam('locality', val)}
          options={[
            { value: 'all', label: 'All Localities' },
            { value: 'North Greens', label: 'North Greens' },
            { value: 'Central Boulevard', label: 'Central Boulevard' },
            { value: 'Financial District', label: 'Financial District' },
            { value: 'Golf Links', label: 'Golf Links Estate' },
          ]}
          size="sm"
          variant="glass"
        />

        {/* Bedrooms */}
        <GlassSelect
          value={currentBedrooms}
          onChange={(val) => updateParam('bedrooms', val)}
          options={[
            { value: 'all', label: 'Any Bedrooms' },
            { value: '2', label: '2 BHK' },
            { value: '3', label: '3 BHK' },
            { value: '4', label: '4+ BHK' },
          ]}
          size="sm"
          variant="glass"
        />
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
