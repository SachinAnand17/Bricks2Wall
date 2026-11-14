import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Check, Train, Trees, ArrowRight } from 'lucide-react';
import { getLocationBySlug, getProperties } from '@/lib/db';
import PropertyCard from '@/components/home/PropertyCard';

interface LocationDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const loc = getLocationBySlug(params.slug);
  if (!loc) return { title: 'Locality Not Found' };
  return {
    title: `${loc.name} Neighbourhood Guide | Bricks2Wall`,
    description: loc.overview,
  };
}

export default function LocationDetailPage({ params }: LocationDetailPageProps) {
  const loc = getLocationBySlug(params.slug);
  if (!loc) notFound();

  const allProps = getProperties();
  const matchingProperties = allProps.filter((p) =>
    p.locality.toLowerCase().includes(loc.slug.replace(/-/g, ' ')) ||
    p.locality.toLowerCase().includes(loc.name.toLowerCase().split(' ')[0])
  );

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-text-slate">
          <Link href="/" className="hover:text-gold-deep">Home</Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-gold-deep">Locations</Link>
          <span>/</span>
          <span className="text-navy-midnight font-medium">{loc.name}</span>
        </div>

        {/* Hero Banner */}
        <div className="relative h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-luxury">
          <Image
            src={loc.heroImageUrl}
            alt={loc.name}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-midnight/90 via-navy-midnight/40 to-transparent" />

          <div className="absolute bottom-8 left-6 sm:left-10 right-6 sm:right-10 text-white space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-gold-champagne font-semibold">
              <MapPin className="w-4 h-4" />
              <span>{loc.city}</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-medium">
              {loc.name}
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-2xl font-light">
              {loc.tagline}
            </p>
          </div>
        </div>

        {/* Overview & Connectivity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-serif text-2xl font-semibold text-navy-midnight">
              Neighbourhood Character & Overview
            </h2>
            <p className="text-text-slate text-sm sm:text-base leading-relaxed">
              {loc.overview}
            </p>

            <div className="p-6 rounded-2xl bg-canvas-ivory/80 border border-canvas-grey space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-deep block">
                Price Valuation Benchmark
              </span>
              <div className="font-serif text-2xl font-bold text-navy-midnight">
                {loc.averagePricePerSqFt} <span className="text-sm font-normal text-text-slate">per sq ft</span>
              </div>
              <p className="text-xs text-text-muted">
                Based on verified Grade-A residential and commercial transactions over the trailing 12 months.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Transit */}
            <div className="p-6 rounded-2xl bg-white border border-canvas-grey shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-midnight">
                <Train className="w-4 h-4 text-gold-champagne" />
                <span>Transit & Connectivity</span>
              </div>
              <ul className="space-y-2 text-xs text-text-slate">
                {loc.keyConnectivity.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-gold-champagne shrink-0 mt-0.5" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifestyle */}
            <div className="p-6 rounded-2xl bg-white border border-canvas-grey shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-navy-midnight">
                <Trees className="w-4 h-4 text-gold-champagne" />
                <span>Civic Amenities & Culture</span>
              </div>
              <ul className="space-y-2 text-xs text-text-slate">
                {loc.lifestyleAmenities.map((a, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-gold-champagne shrink-0 mt-0.5" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Matching Properties Section */}
        <div className="pt-8 border-t border-canvas-grey space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-semibold text-navy-midnight">
              Current Properties in {loc.name}
            </h3>
            <Link
              href="/properties"
              className="text-xs font-semibold text-gold-deep hover:text-navy-midnight uppercase tracking-wider"
            >
              All Listings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(matchingProperties.length > 0 ? matchingProperties : allProps.slice(0, 3)).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
