import React from 'react';
import { Metadata } from 'next';
import { BookOpen } from 'lucide-react';
import { getArticles } from '@/lib/db';
import InsightsFeed from './InsightsFeed';

export const metadata: Metadata = {
  title: 'Market Insights & Property Guides | Bricks2Wall',
  description: 'Practical guides on property searches, neighbourhoods, RERA legal documentation, and commercial leasing in India.',
};

export default function InsightsPage() {
  const articles = getArticles();

  return (
    <div className="py-10 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">

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

        <InsightsFeed initialArticles={articles} />

      </div>
    </div>
  );
}
