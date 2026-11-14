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

export const revalidate = 60; // ISR cache revalidation

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
        eyebrow={settings.heroEyebrow}
        headline={settings.heroHeadline}
        copy={settings.heroCopy}
        primaryCtaText={settings.primaryCtaText}
        secondaryCtaText={settings.secondaryCtaText}
      />

      {/* Prominent Search Module */}
      <PropertySearch />

      {/* Curated Featured Properties */}
      <FeaturedProperties properties={properties} />

      {/* Property-Type / Service Discovery Tiles */}
      <PropertyTypeGrid />

      {/* Value Propositions / Why Work With Us */}
      <WhyWorkWithUs />

      {/* Transparent Process / How It Works */}
      <ProcessSection />

      {/* Featured Neighbourhoods & Locality Guides */}
      <LocationShowcase locations={locations} />

      {/* Trust & Regulatory Due Diligence */}
      <TrustSection />

      {/* Verified Client Testimonials */}
      <TestimonialSection testimonials={testimonials} />

      {/* Market Insights & RERA Editorial */}
      <InsightsSection articles={articles} />

      {/* Consultation Request & Final CTA */}
      <LeadCtaSection />
    </div>
  );
}
