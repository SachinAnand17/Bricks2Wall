import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import { InsightArticle, ContentSettings } from '@/types';
import { formatDate } from '@/lib/utils';

interface InsightsSectionProps {
  articles: InsightArticle[];
  settings?: ContentSettings;
}

export default function InsightsSection({ articles, settings }: InsightsSectionProps) {
  const eyebrow = settings?.insightsEyebrow || 'Editorial & Guides';
  const heading = settings?.insightsHeading || 'Make your next move an informed one.';
  const copy = settings?.insightsCopy || 'Read practical guides on property searches, neighbourhoods, documentation and the decisions that shape a successful move.';
  const linkText = settings?.insightsLinkText || 'Browse All Articles';

  return (
    <section className="py-20 bg-canvas-ivory/40 border-t border-canvas-grey">
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
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-gold-deep hover:text-navy-midnight transition-colors"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.slice(0, 3).map((art) => (
            <Link
              key={art.id}
              href={`/insights/${art.slug}`}
              className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 w-full overflow-hidden bg-canvas-ivory">
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

                  <h3 className="font-serif text-base font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors line-clamp-2 leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-text-slate line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-canvas-grey/60 flex items-center justify-between text-xs text-gold-deep font-semibold">
                  <span>Read Article</span>
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
