import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { ContentSettings } from '@/types';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

interface PropertyTypeGridProps {
  settings?: ContentSettings;
}

export default function PropertyTypeGrid({ settings }: PropertyTypeGridProps) {
  const eyebrow = settings?.categoriesEyebrow || 'Tailored Portfolios';
  const heading = settings?.categoriesHeading || 'Explore by Property Category';
  const copy = settings?.categoriesCopy || 'Whether seeking an enduring family residence or an institutional commercial asset, our advisory spans verified property verticals.';

  const categories = [
    {
      title: settings?.category1Title || 'Modern Apartments',
      subtitle: settings?.category1Subtitle || '2 & 3 Bedroom city residences',
      count: settings?.category1Badge || 'Curated Collection',
      href: settings?.category1Href || '/properties?propertyType=Apartment',
      imageUrl: settings?.category1Image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: settings?.category2Title || 'Sky Villas & Penthouses',
      subtitle: settings?.category2Subtitle || 'High-floor architectural statements',
      count: settings?.category2Badge || 'Exclusive',
      href: settings?.category2Href || '/properties?propertyType=Penthouse',
      imageUrl: settings?.category2Image || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: settings?.category3Title || 'Turnkey Rentals',
      subtitle: settings?.category3Subtitle || 'Furnished executive homes',
      count: settings?.category3Badge || 'Ready to Occupy',
      href: settings?.category3Href || '/properties/rent',
      imageUrl: settings?.category3Image || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    },
    {
      title: settings?.category4Title || 'Grade-A Office Suites',
      subtitle: settings?.category4Subtitle || 'Corporate occupier solutions',
      count: settings?.category4Badge || 'Commercial',
      href: settings?.category4Href || '/properties/commercial',
      imageUrl: settings?.category4Image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <section className="relative overflow-hidden py-24 bg-[#F5F1E8] border-y border-[#DDD6C8]">
      {/* Background Architectural Mandala */}
      <MandalaWatermark seed="category-section-bg" position="bottom-left" size={620} opacity={0.09} spinDuration={180} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-2xl mx-auto pb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 border border-gold-champagne/40 text-xs font-semibold tracking-widest uppercase text-gold-deep shadow-sm">
            <MandalaArt seed="category-banner-icon" size={18} variant="gold" spin={true} spinDuration={32} />
            <span>{eyebrow}</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            {heading}
          </h2>
          <p className="text-text-slate text-sm sm:text-base">
            {copy}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 border border-canvas-grey"
            >
              <Image
                src={cat.imageUrl}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-midnight/90 via-navy-midnight/30 to-transparent" />

              {/* Distinctive Unique Card Mandala Motif */}
              <div className="absolute -top-10 -right-10 pointer-events-none opacity-25 group-hover:opacity-40 transition-opacity duration-300">
                <MandalaArt
                  seed={`category-tile-${idx}`}
                  size={140}
                  variant="white"
                  spin={true}
                  spinDuration={80 + idx * 25}
                  complexity="medium"
                />
              </div>

              <div className="absolute bottom-5 left-5 right-5 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-champagne">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-lg font-medium text-white group-hover:text-gold-light transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-white/70">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="p-2 rounded-full bg-white/20 backdrop-blur-md group-hover:bg-gold-champagne group-hover:text-navy-deep transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
