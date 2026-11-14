import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { getArticles } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Market Insights & Property Guides | Bricks2Wall',
  description: 'Practical guides on property searches, neighbourhoods, RERA legal documentation, and commercial leasing in India.',
};

export default function InsightsPage() {
  const articles = getArticles();

  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-gold-deep">
            <BookOpen className="w-3.5 h-3.5 text-gold-champagne" />
            <span>Advisory Intelligence</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-navy-midnight font-medium">
            Property Guides & Market Insights
          </h1>
          <p className="text-text-slate text-sm sm:text-base leading-relaxed">
            Practical knowledge covering title searches, encumbrance certificates, state RERA compliance, and commercial lease structuring.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              href={`/insights/${art.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 w-full overflow-hidden bg-canvas-ivory">
                <Image
                  src={art.heroImageUrl}
                  alt={art.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute top-3.5 left-3.5 bg-navy-midnight/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                  {art.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span>{formatDate(art.publishedAt)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-text-slate line-clamp-3 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-canvas-grey/60 flex items-center justify-between text-xs text-gold-deep font-semibold">
                  <span>Read Full Guide</span>
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
