'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, X, ArrowUpRight } from 'lucide-react';
import { Property } from '@/types';
import { formatINR } from '@/lib/utils';

interface PropertyMapProps {
  properties: Property[];
}

export default function PropertyMap({ properties }: PropertyMapProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  return (
    <div className="relative w-full h-[460px] sm:h-[600px] bg-canvas-ivory rounded-2xl overflow-hidden border border-canvas-grey shadow-inner flex flex-col items-center justify-center">
      {/* Map Graphic Canvas / Stylized Architectural Locality Grid */}
      <div className="absolute inset-0 bg-[#EFECE6] bg-[radial-gradient(#C8A45D_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40" />

      {/* Stylized Transit & Road Arterials */}
      <svg className="absolute inset-0 w-full h-full stroke-canvas-grey pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <line x1="10%" y1="20%" x2="90%" y2="80%" strokeWidth="6" stroke="#DDD7CC" strokeDasharray="10 5" />
        <line x1="30%" y1="90%" x2="70%" y2="10%" strokeWidth="8" stroke="#DDD7CC" />
        <circle cx="50%" cy="50%" r="28%" fill="none" stroke="#C8A45D22" strokeWidth="2" />
        <circle cx="50%" cy="50%" r="42%" fill="none" stroke="#C8A45D11" strokeWidth="2" />
      </svg>

      {/* Map Notice Overlay */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto sm:top-4 sm:left-4 z-20 bg-white/95 backdrop-blur-md px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-canvas-grey shadow-sm text-[11px] sm:text-xs text-text-slate">
        <span className="font-semibold text-navy-midnight block">Interactive Locality View</span>
        <span>Showing {properties.length} verified listings in protected locality zones</span>
      </div>

      {/* Property Marker Pins */}
      <div className="relative w-full h-full">
        {properties.map((prop, idx) => {
          // Calculate stylized offsets based on property coordinates or index
          const leftOffsets = ['28%', '68%', '42%', '78%', '34%', '54%'];
          const topOffsets = ['32%', '26%', '58%', '65%', '72%', '38%'];

          const left = leftOffsets[idx % leftOffsets.length];
          const top = topOffsets[idx % topOffsets.length];

          const isSelected = selectedProperty?.id === prop.id;

          return (
            <div
              key={prop.id}
              style={{ left, top }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                onClick={() => setSelectedProperty(prop)}
                className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-luxury text-xs font-semibold transition-all transform hover:scale-110 ${isSelected
                    ? 'bg-gold-deep text-white scale-110 ring-4 ring-gold-champagne/30'
                    : 'bg-navy-midnight text-white hover:bg-gold-champagne hover:text-navy-deep'
                  }`}
              >
                <MapPin className="w-3.5 h-3.5 text-gold-champagne" />
                <span>
                  {prop.price < 500000
                    ? `₹${(prop.price / 1000).toFixed(0)}k/mo`
                    : formatINR(prop.price, true)}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected Property Preview Popup Card */}
      {selectedProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-auto sm:right-6 sm:w-96 z-30 bg-white rounded-2xl p-4 shadow-luxury border border-canvas-grey animate-fade-in">
          <div className="flex items-start justify-between pb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep bg-canvas-ivory px-2 py-0.5 rounded">
              {selectedProperty.transactionType.toUpperCase()}
            </span>
            <button
              onClick={() => setSelectedProperty(null)}
              className="p-1 rounded-full text-text-muted hover:text-navy-midnight hover:bg-canvas-ivory"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-canvas-ivory">
              <Image
                src={selectedProperty.media[0]?.url || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                alt={selectedProperty.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 space-y-1">
              <h4 className="font-serif text-sm font-semibold text-navy-midnight line-clamp-1">
                {selectedProperty.title}
              </h4>
              <p className="text-xs text-text-slate line-clamp-1">
                {selectedProperty.locality}
              </p>
              <p className="font-serif text-sm font-bold text-navy-midnight pt-1">
                {formatINR(selectedProperty.price)}
              </p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-canvas-grey flex items-center justify-between">
            <span className="text-xs text-text-muted">
              {selectedProperty.builtUpAreaSqFt} sq ft • {selectedProperty.bedrooms ? `${selectedProperty.bedrooms} Beds` : selectedProperty.propertyType}
            </span>
            <Link
              href={`/properties/${selectedProperty.slug}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-gold-deep hover:text-navy-midnight"
            >
              <span>View Property</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
