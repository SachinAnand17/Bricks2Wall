'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight } from 'lucide-react';
import { InsightArticle } from '@/types';
import { formatDate } from '@/lib/utils';

export default function InsightsFeed({ initialArticles }: { initialArticles: InsightArticle[] }) {
  const [articles, setArticles] = useState<InsightArticle[]>(initialArticles);

  useEffect(() => {
    let isMounted = true;
    async function fetchLiveBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0 && isMounted) {
            setArticles(data.blogs);
          }
        }
      } catch (err) {
        // Keep initial fallback
      }
    }
    fetchLiveBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
      {articles.map((art) => (
        <Link
          key={art.id || art.slug}
          href={`/insights/${art.slug}`}
          className="group bg-white rounded-2xl overflow-hidden border border-canvas-grey hover:border-gold-champagne/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col"
        >
          <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-canvas-ivory">
            <Image
              src={art.heroImageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'}
              alt={art.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div className="absolute top-3.5 left-3.5 bg-navy-midnight/90 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
              {art.category}
            </div>
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-xs text-text-muted">
                <span>{art.publishedAt ? formatDate(art.publishedAt) : 'Recent'}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime || '5 min read'}</span>
                </div>
              </div>

              <h3 className="font-serif text-base sm:text-lg font-semibold text-navy-midnight group-hover:text-gold-deep transition-colors line-clamp-2 leading-snug">
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
  );
}
