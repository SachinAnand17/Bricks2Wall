'use client';

import React, { useState, useEffect, Suspense } from 'react';
import PropertyCard from '@/components/home/PropertyCard';
import PropertyFilters from '@/components/property/PropertyFilters';
import PropertyMap from '@/components/property/PropertyMap';
import { Property } from '@/types';

interface PropertiesClientProps {
  initialProperties: Property[];
  title?: string;
  subtitle?: string;
}

export default function PropertiesClient({
  initialProperties,
  title = 'Curated Property Portfolio',
  subtitle = 'Explore verified residential residences, luxury penthouses, and commercial opportunities.',
}: PropertiesClientProps) {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.properties) && isMounted) {
            setProperties(data.properties);
          }
        }
      } catch (e) {
        // Fallback silently to initialProperties
      }
    }
    fetchLiveProperties();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-8 sm:py-12 bg-canvas-ivory/30 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">

        {/* Page Header */}
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Verified Portfolio
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            {title}
          </h1>
          <p className="text-text-slate text-sm sm:text-base max-w-3xl">
            {subtitle}
          </p>
        </div>

        {/* Filter Controls & View Toggle wrapped in Suspense for CSR Bailout */}
        <Suspense fallback={
          <div className="bg-white rounded-2xl border border-canvas-grey p-5 text-center text-xs text-text-muted">
            Loading filters...
          </div>
        }>
          <PropertyFilters
            totalCount={properties.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </Suspense>

        {/* Main Content Area: Grid or Map */}
        {viewMode === 'grid' ? (
          properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-canvas-grey space-y-4">
              <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                No matching properties found
              </h3>
              <p className="text-sm text-text-slate max-w-md mx-auto">
                No active listings match your current filter parameters. Try adjusting your price bracket, bedrooms, or category filter.
              </p>
            </div>
          )
        ) : (
          <PropertyMap properties={properties} />
        )}

      </div>
    </div>
  );
}
