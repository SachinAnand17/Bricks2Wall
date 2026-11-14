import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import { getArticleBySlug, getArticles } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import ShareButton from '@/components/property/ShareButton';

interface ArticleDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticleDetailPageProps): Promise<Metadata> {
  const art = getArticleBySlug(params.slug);
  if (!art) return { title: 'Article Not Found' };
  return {
    title: `${art.title} | Bricks2Wall Insights`,
    description: art.excerpt,
    openGraph: {
      title: art.title,
      description: art.excerpt,
      images: [{ url: art.heroImageUrl }],
    },
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const art = getArticleBySlug(params.slug);
  if (!art) notFound();

  const allArticles = getArticles();
  const relatedArticles = allArticles.filter((a) => a.id !== art.id).slice(0, 2);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: art.title,
    description: art.excerpt,
    image: art.heroImageUrl,
    datePublished: art.publishedAt,
    author: {
      '@type': 'Person',
      name: art.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Bricks2Wall',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bricks2wall.com/brand/brand-logo.jpg',
      },
    },
  };

  return (
    <article className="py-12 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-4 border-b border-canvas-grey">
          <Link
            href="/insights"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-deep hover:text-navy-midnight uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Insights</span>
          </Link>

          <ShareButton title={art.title} />
        </div>

        {/* Article Meta Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-canvas-ivory border border-canvas-grey text-gold-deep">
              {art.category}
            </span>
            <span className="text-xs text-text-muted flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{art.readTime}</span>
            </span>
            <span className="text-xs text-text-muted">
              {formatDate(art.publishedAt)}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy-midnight font-medium leading-tight">
            {art.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-text-slate">
            <span>Written by <strong className="text-navy-midnight">{art.authorName}</strong></span>
            <span>•</span>
            <span>{art.authorRole}</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative h-[340px] sm:h-[420px] rounded-2xl overflow-hidden shadow-luxury">
          <Image
            src={art.heroImageUrl}
            alt={art.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Content Body */}
        <div className="prose prose-slate max-w-none text-text-ink text-sm sm:text-base leading-relaxed space-y-6 pt-4">
          {art.content.split('\n\n').map((block, idx) => {
            if (block.startsWith('### ')) {
              return (
                <h3 key={idx} className="font-serif text-xl sm:text-2xl font-semibold text-navy-midnight mt-8 mb-3">
                  {block.replace('### ', '')}
                </h3>
              );
            }
            return (
              <p key={idx} className="leading-relaxed">
                {block}
              </p>
            );
          })}
        </div>

        {/* Bottom Consultation Box */}
        <div className="p-8 rounded-2xl bg-canvas-ivory/80 border border-gold-champagne/30 space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-semibold text-navy-midnight">
              Need Personalized Legal or Valuation Counsel?
            </h4>
            <p className="text-xs text-text-slate max-w-lg">
              Our in-house legal and advisory teams review property title chains, municipal sanctions, and lease covenants.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-full bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shrink-0 shadow-sm"
          >
            Schedule Consultation
          </Link>
        </div>

      </div>
    </article>
  );
}
