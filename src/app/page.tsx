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
import MandalaDivider from '@/components/decorative/MandalaDivider';
import IntroVideoOverlay from '@/components/motion/IntroVideoOverlay';
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
      {/* Edge-to-Edge Intro Video Overlay: Instant zero-latency start, smooth upward curtain finish, always plays on Ctrl+Shift+R */}
      <IntroVideoOverlay />

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

      {/* Natural Unorganized Organic Transition: Hero Sand (#FAF8F5) -> Featured Midnight Navy (#10243A) */}
      <MandalaDivider seed="divider-hero-featured" fromBg="#FAF8F5" toBg="#10243A" />

      {/* Curated Featured Properties */}
      <FeaturedProperties
        properties={properties}
        eyebrow={settings.featuredEyebrow}
        heading={settings.featuredHeading}
        copy={settings.featuredCopy}
        ctaText={settings.featuredCtaText}
      />

      {/* Natural Unorganized Organic Transition: Featured Navy (#091522) -> Categories Warm Sand (#F5F1E8) */}
      <MandalaDivider seed="divider-featured-categories" fromBg="#091522" toBg="#F5F1E8" />

      {/* Property-Type / Service Discovery Tiles */}
      <PropertyTypeGrid settings={settings} />

      {/* Natural Unorganized Organic Transition: Categories Warm Sand (#F5F1E8) -> Why Us Pure White (#FFFFFF) */}
      <MandalaDivider seed="divider-categories-why" fromBg="#F5F1E8" toBg="#FFFFFF" />

      {/* Value Propositions / Why Work With Us */}
      <WhyWorkWithUs settings={settings} />

      {/* Natural Unorganized Organic Transition: Why Us White (#FFFFFF) -> Process Deep Midnight (#091522) */}
      <MandalaDivider seed="divider-why-process" fromBg="#FFFFFF" toBg="#091522" />

      {/* Transparent Process / How It Works */}
      <ProcessSection settings={settings} />

      {/* Natural Unorganized Organic Transition: Process Deep Midnight (#08121E) -> Locality Limestone (#F2EEE5) */}
      <MandalaDivider seed="divider-process-locations" fromBg="#08121E" toBg="#F2EEE5" />

      {/* Featured Neighbourhoods & Locality Guides */}
      <LocationShowcase locations={locations} settings={settings} />

      {/* Natural Unorganized Organic Transition: Locality Limestone (#F2EEE5) -> Trust Ivory (#FAF8F5) */}
      <MandalaDivider seed="divider-locations-trust" fromBg="#F2EEE5" toBg="#FAF8F5" />

      {/* Trust & Regulatory Due Diligence */}
      <TrustSection settings={settings} />

      {/* Natural Unorganized Organic Transition: Trust Ivory (#FAF8F5) -> Testimonials Royal Navy (#0E2034) */}
      <MandalaDivider seed="divider-trust-testimonials" fromBg="#FAF8F5" toBg="#0E2034" />

      {/* Verified Client Testimonials */}
      <TestimonialSection testimonials={testimonials} settings={settings} />

      {/* Natural Unorganized Organic Transition: Testimonials Navy (#0A1726) -> Editorial Insights Sand (#F6F4ED) */}
      <MandalaDivider seed="divider-testimonials-insights" fromBg="#0A1726" toBg="#F6F4ED" />

      {/* Market Insights & RERA Editorial */}
      <InsightsSection articles={articles} settings={settings} />

      {/* Natural Unorganized Organic Transition: Editorial Insights Sand (#F6F4ED) -> Lead CTA Midnight (#091828) */}
      <MandalaDivider seed="divider-insights-lead" fromBg="#F6F4ED" toBg="#091828" />

      {/* Consultation Request & Final CTA */}
      <LeadCtaSection settings={settings} />

      {/* Natural Unorganized Organic Transition: Lead CTA Midnight (#08121E) -> Footer Pure White (#FFFFFF) */}
      <MandalaDivider seed="divider-lead-footer" fromBg="#08121E" toBg="#FFFFFF" />
    </div>
  );
}
