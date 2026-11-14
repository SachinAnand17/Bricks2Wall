'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Bed, Bath, Maximize2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Property } from '@/types';
import { formatINR, formatArea } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
  onEnquire?: (property: Property) => void;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('b2w_saved_properties') || '[]');
      setIsSaved(saved.includes(property.id));
    } catch {
      // Ignore localStorage errors
    }
  }, [property.id]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      let saved = JSON.parse(localStorage.getItem('b2w_saved_properties') || '[]');
      if (saved.includes(property.id)) {
        saved = saved.filter((id: string) => id !== property.id);
        setIsSaved(false);
      } else {
        saved.push(property.id);
        setIsSaved(true);
      }
      localStorage.setItem('b2w_saved_properties', JSON.stringify(saved));
    } catch {
      // Ignore
    }
  };

  const primaryImage = property.media.find(m => m.isPrimary) || property.media[0] || {
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    altText: property.title,
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col h-full">
      
      {/* Property Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-canvas-ivory">
        <Link href={`/properties/${property.slug}`} className="block w-full h-full">
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText || property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>

        {/* Gradient Overlay for badges */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />

        {/* Badges Top Left */}
        <div className="absolute top-3.5 left-3.5 flex flex-wrap gap-1.5 z-10">
          {property.isDemo && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-amber-500/90 text-navy-deep shadow-sm">
              SAMPLE DEMO
            </span>
          )}
          {property.isFeatured && (
            <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-navy-midnight text-white shadow-sm border border-gold-champagne/40">
              Featured
            </span>
          )}
          <span className="px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase bg-white/90 text-navy-midnight backdrop-blur-sm shadow-sm">
            {property.transactionType === 'commercial' ? 'Commercial' : property.transactionType.toUpperCase()}
          </span>
        </div>

        {/* Top Right Save Button */}
        <button
          onClick={toggleSave}
          aria-label={isSaved ? 'Remove from saved' : 'Save property'}
          className="absolute top-3.5 right-3.5 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-navy-midnight transition-colors shadow-sm focus:outline-none"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-navy-midnight'
            }`}
          />
        </button>

        {/* Bottom Banner on Image: Price & Status */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white z-10">
          <div>
            <p className="text-xl font-serif font-bold tracking-tight text-white drop-shadow-md">
              {property.contactForPrice
                ? 'Contact for Price'
                : property.transactionType === 'rent' || (property.transactionType === 'commercial' && property.price < 500000)
                ? `${formatINR(property.price)} / mo`
                : formatINR(property.price)}
            </p>
          </div>
          {property.isVerified && (
            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-semibold text-navy-midnight uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-deep" />
              <span>Verified</span>
            </div>
          )}
        </div>
      </div>

      {/* Property Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          
          {/* Locality */}
          <div className="flex items-center gap-1.5 text-xs text-text-slate">
            <MapPin className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
            <span className="truncate">{property.locality}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors line-clamp-1">
            <Link href={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-text-slate line-clamp-2 leading-relaxed">
            {property.tagline || property.description}
          </p>
        </div>

        {/* Specifications Strip */}
        <div className="pt-3 border-t border-canvas-grey grid grid-cols-3 gap-2 text-xs text-text-ink">
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
            <span className="truncate">{formatArea(property.builtUpAreaSqFt)}</span>
          </div>

          {property.bedrooms ? (
            <div className="flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
              <span>{property.bedrooms} Beds</span>
            </div>
          ) : (
            <div className="text-xs text-text-muted truncate">
              {property.propertyType}
            </div>
          )}

          {property.bathrooms ? (
            <div className="flex items-center gap-1.5">
              <Bath className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
              <span>{property.bathrooms} Baths</span>
            </div>
          ) : (
            <div className="text-xs text-text-muted truncate">
              {property.possessionStatus || 'Immediate'}
            </div>
          )}
        </div>

        {/* Card Actions Bottom */}
        <div className="pt-3 border-t border-canvas-grey/60 flex items-center justify-between gap-3">
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider bg-canvas-ivory hover:bg-gold-champagne hover:text-navy-deep text-navy-midnight transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/contact?property=${property.slug}&title=${encodeURIComponent(property.title)}`}
            className="flex items-center justify-center p-2 rounded-lg text-navy-midnight hover:text-gold-deep hover:bg-canvas-ivory transition-colors"
            title="Enquire About Property"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
