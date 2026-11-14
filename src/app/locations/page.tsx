import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Compass } from 'lucide-react';
import { getLocations } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Neighbourhood & Locality Guides | Bricks2Wall',
  description: 'In-depth connectivity, infrastructure, and property price benchmarks across prime urban enclaves.',
};

export default function LocationsPage() {
  const locations = getLocations();

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gold-deep">
            <Compass className="w-3.5 h-3.5 text-gold-champagne" />
            <span>Locality Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Prime Neighbourhood Guides
          </h1>
          <p className="text-text-slate text-sm sm:text-base leading-relaxed">
            Neighborhood dynamics define long-term livability and asset appreciation. Explore curated transit insights, civic infrastructure, and benchmark valuations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-canvas-ivory">
                <Image
                  src={loc.heroImageUrl}
                  alt={loc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-midnight/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>{loc.city}</span>
                  </div>
                  <span className="text-xs font-semibold bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded">
                    {loc.averagePricePerSqFt}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-text-slate line-clamp-3 leading-relaxed">
                    {loc.overview}
                  </p>
                </div>

                <div className="pt-4 border-t border-canvas-grey/60 flex items-center justify-between text-xs text-gold-deep font-semibold">
                  <span>Explore Matching Properties</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
