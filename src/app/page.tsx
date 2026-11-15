import React from 'react';
import Hero from '@/components/home/Hero';
import PropertySearch from '@/components/home/PropertySearch';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import PropertyTypeGrid from '@/components/home/PropertyTypeGrid';
import WhyWorkWithUs from '@/components/home/WhyWorkWithUs';
import ProcessSection from '@/components/home/ProcessSection';
import LocationShowcase from '@/components/home/LocationShowcase';
import TrustSection from '@/components/home/TrustSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import InsightsSection from '@/components/home/InsightsSection';
import LeadCtaSection from '@/components/home/LeadCtaSection';
import { 
  getProperties, 
  getLocations, 
  getArticles, 
  getTestimonials, 
  getContentSettings 
} from '@/lib/db';

export const revalidate = 0; // Dynamic real-time updates from CMS

export default function HomePage() {
  const settings = getContentSettings();
  const properties = getProperties({ sortBy: 'featured' });
  const locations = getLocations();
  const articles = getArticles();
  const testimonials = getTestimonials();

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero
        settings={settings}
        eyebrow={settings.heroEyebrow}
        headline={settings.heroHeadline}
        headlineHighlight={settings.heroHeadlineHighlight}
        copy={settings.heroCopy}
        primaryCtaText={settings.primaryCtaText}
        primaryCtaHref={settings.primaryCtaHref}
        secondaryCtaText={settings.secondaryCtaText}
        secondaryCtaHref={settings.secondaryCtaHref}
      />

      {/* Prominent Search Module */}
      <PropertySearch
        title={settings.searchTitle}
        subtitle={settings.searchSubtitle}
        buttonText={settings.searchButtonText}
      />

      {/* Curated Featured Properties */}
      <FeaturedProperties
        properties={properties}
        eyebrow={settings.featuredEyebrow}
        heading={settings.featuredHeading}
        copy={settings.featuredCopy}
        ctaText={settings.featuredCtaText}
      />

      {/* Property-Type / Service Discovery Tiles */}
      <PropertyTypeGrid settings={settings} />

      {/* Value Propositions / Why Work With Us */}
      <WhyWorkWithUs settings={settings} />

      {/* Transparent Process / How It Works */}
      <ProcessSection settings={settings} />

      {/* Featured Neighbourhoods & Locality Guides */}
      <LocationShowcase locations={locations} settings={settings} />

      {/* Trust & Regulatory Due Diligence */}
      <TrustSection settings={settings} />

      {/* Verified Client Testimonials */}
      <TestimonialSection testimonials={testimonials} settings={settings} />

      {/* Market Insights & RERA Editorial */}
      <InsightsSection articles={articles} settings={settings} />

      {/* Consultation Request & Final CTA */}
      <LeadCtaSection settings={settings} />
    </div>
  );
}
