import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const CATEGORIES = [
  {
    title: 'Modern Apartments',
    subtitle: '2 & 3 Bedroom city residences',
    count: 'Curated Collection',
    href: '/properties?propertyType=Apartment',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Sky Villas & Penthouses',
    subtitle: 'High-floor architectural statements',
    count: 'Exclusive',
    href: '/properties?propertyType=Penthouse',
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Turnkey Rentals',
    subtitle: 'Furnished executive homes',
    count: 'Ready to Occupy',
    href: '/properties/rent',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Grade-A Office Suites',
    subtitle: 'Corporate occupier solutions',
    count: 'Commercial',
    href: '/properties/commercial',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PropertyTypeGrid() {
  return (
    <section className="py-20 bg-canvas-ivory/60 border-y border-canvas-grey/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto pb-12 space-y-3">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
            Tailored Portfolios
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Explore by Property Category
          </h2>
          <p className="text-text-slate text-sm sm:text-base">
            Whether seeking an enduring family residence or an institutional commercial asset, our advisory spans verified property verticals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.title}
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
