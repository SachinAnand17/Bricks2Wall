import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight } from 'lucide-react';
import { LocationGuide, ContentSettings } from '@/types';

interface LocationShowcaseProps {
  locations: LocationGuide[];
  settings?: ContentSettings;
}

export default function LocationShowcase({ locations, settings }: LocationShowcaseProps) {
  const eyebrow = settings?.locationsEyebrow || 'Locality Intelligence';
  const heading = settings?.locationsHeading || 'Featured Neighbourhood Guides';
  const copy = settings?.locationsCopy || 'Context shapes property value. Explore in-depth architectural and transit guides for prime enclaves.';
  const linkText = settings?.locationsLinkText || 'View All Localities';

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-12 gap-6">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
              {eyebrow}
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
              {heading}
            </h2>
            <p className="text-text-slate text-sm sm:text-base">
              {copy}
            </p>
          </div>

          <Link
            href="/locations"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gold-deep hover:text-navy-midnight transition-colors"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {locations.map((loc) => (
            <Link
              key={loc.id}
              href={`/locations/${loc.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden bg-canvas-ivory">
                <Image
                  src={loc.heroImageUrl}
                  alt={loc.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-midnight/80 via-transparent to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-1 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>{loc.city}</span>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
                    {loc.averagePricePerSqFt}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-serif text-lg font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors">
                    {loc.name}
                  </h3>
                  <p className="text-xs text-text-slate line-clamp-2 leading-relaxed">
                    {loc.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-canvas-grey/60 flex items-center justify-between text-xs text-gold-deep font-semibold">
                  <span>Explore Neighbourhood Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
