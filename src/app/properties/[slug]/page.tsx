import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ShieldCheck,
  Calendar,
  Building2,
  Check,
  Share2,
  ArrowLeft,
  Clock,
  FileCheck2,
  Compass,
  Car,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';
import { getPropertyBySlug, getProperties, getAgents } from '@/lib/db';
import { formatINR, formatArea, formatDate } from '@/lib/utils';
import PropertyGallery from '@/components/property/PropertyGallery';
import ShareButton from '@/components/property/ShareButton';
import PropertyEnquiryForm from '@/components/forms/PropertyEnquiryForm';
import ScheduleViewingForm from '@/components/forms/ScheduleViewingForm';
import PropertyCard from '@/components/home/PropertyCard';

interface PropertyDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const property = getPropertyBySlug(params.slug);
  if (!property) return { title: 'Property Not Found | Bricks2Wall' };

  return {
    title: `${property.title} | Bricks2Wall Real Estate`,
    description: property.tagline || property.description.slice(0, 160),
    openGraph: {
      title: property.title,
      description: property.tagline || property.description.slice(0, 160),
      images: [
        {
          url: property.media[0]?.url || '/brand/brand-logo.jpg',
          alt: property.title,
        },
      ],
    },
  };
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = getPropertyBySlug(params.slug);
  if (!property) notFound();

  const agents = getAgents();
  const assignedAgent = agents.find((a) => a.id === property.assignedAgentId) || agents[0];

  const allProperties = getProperties();
  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.transactionType === property.transactionType || p.propertyType === property.propertyType))
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: property.description,
    url: `https://bricks2wall.com/properties/${property.slug}`,
    datePosted: property.createdAt,
    price: property.price,
    priceCurrency: 'INR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.locality,
      addressRegion: property.city,
      addressCountry: 'IN',
    },
  };

  return (
    <div className="py-10 bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Navigation Breadcrumb & Back Link */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-grey">
          <div className="flex items-center gap-2 text-xs text-text-slate">
            <Link href="/" className="hover:text-gold-deep">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-gold-deep">Properties</Link>
            <span>/</span>
            <span className="text-navy-midnight font-medium truncate max-w-xs">{property.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <ShareButton title={property.title} />
          </div>
        </div>

        {/* Title & Key Price Banner */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              {property.isDemo && (
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/90 text-navy-deep">
                  SAMPLE DEMO LISTING
                </span>
              )}
              <span className="px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-canvas-ivory border border-canvas-grey text-gold-deep">
                {property.transactionType.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-navy-midnight text-white">
                {property.propertyType}
              </span>
              {property.isVerified && (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Legal Title</span>
                </span>
              )}
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl text-navy-midnight font-medium tracking-tight">
              {property.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-text-slate">
              <MapPin className="w-4 h-4 text-gold-champagne shrink-0" />
              <span>{property.addressSummary}</span>
            </div>
          </div>

          {/* Price Header Card */}
          <div className="lg:text-right bg-canvas-ivory/80 p-4 sm:p-5 rounded-2xl border border-gold-champagne/30 shrink-0 w-full lg:w-auto">
            <span className="text-xs uppercase tracking-wider text-text-muted block">
              {property.transactionType === 'rent' || (property.transactionType === 'commercial' && property.price < 500000)
                ? 'Asking Monthly Lease'
                : 'Asking Consideration'}
            </span>
            <div className="font-serif text-2xl sm:text-3xl font-bold text-navy-midnight">
              {property.contactForPrice
                ? 'Price on Request'
                : property.transactionType === 'rent' || (property.transactionType === 'commercial' && property.price < 500000)
                  ? `${formatINR(property.price)} / mo`
                  : formatINR(property.price)}
            </div>
            {property.builtUpAreaSqFt > 0 && !property.contactForPrice && (
              <span className="text-xs text-text-muted mt-1 block">
                Approx. ₹{Math.round(property.price / property.builtUpAreaSqFt).toLocaleString('en-IN')} / sq ft
              </span>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <PropertyGallery media={property.media} title={property.title} />

        {/* Core Specs Grid Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-canvas-ivory/70 border border-canvas-grey">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Built-Up Area</span>
            <div className="flex items-center gap-1.5 font-semibold text-navy-midnight text-sm">
              <Maximize2 className="w-4 h-4 text-gold-champagne" />
              <span>{formatArea(property.builtUpAreaSqFt)}</span>
            </div>
          </div>

          {property.carpetAreaSqFt && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Carpet Area</span>
              <div className="font-semibold text-navy-midnight text-sm">
                {formatArea(property.carpetAreaSqFt)}
              </div>
            </div>
          )}

          {property.bedrooms !== undefined && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Bedrooms</span>
              <div className="flex items-center gap-1.5 font-semibold text-navy-midnight text-sm">
                <Bed className="w-4 h-4 text-gold-champagne" />
                <span>{property.bedrooms} BHK</span>
              </div>
            </div>
          )}

          {property.bathrooms !== undefined && (
            <div className="space-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Bathrooms</span>
              <div className="flex items-center gap-1.5 font-semibold text-navy-midnight text-sm">
                <Bath className="w-4 h-4 text-gold-champagne" />
                <span>{property.bathrooms} Baths</span>
              </div>
            </div>
          )}

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Possession</span>
            <div className="font-semibold text-navy-midnight text-sm">
              {property.possessionStatus || 'Ready to Move'}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">Furnishing</span>
            <div className="font-semibold text-navy-midnight text-sm">
              {property.furnishingStatus || 'Unfurnished'}
            </div>
          </div>
        </div>

        {/* Content Split: Left (Details) vs Right (Enquiry Form & Agent Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* Left Column: Facts, Description, Amenities */}
          <div className="lg:col-span-8 space-y-10">

            {/* Description */}
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-semibold text-navy-midnight">
                Property Overview
              </h2>
              <p className="text-text-slate text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Highlights */}
            {property.highlights && property.highlights.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                  Architectural & Planning Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-ink p-3 rounded-xl bg-canvas-ivory/50 border border-canvas-grey">
                      <Check className="w-4 h-4 text-gold-champagne shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities List */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                  Society & Building Amenities
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-text-slate p-3 rounded-xl border border-canvas-grey bg-white">
                      <div className="w-2 h-2 rounded-full bg-gold-champagne shrink-0" />
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Specifications Table */}
            <div className="space-y-4">
              <h3 className="font-serif text-xl font-semibold text-navy-midnight">
                Detailed Property Specifications
              </h3>
              <div className="rounded-2xl border border-canvas-grey overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[320px]">
                  <tbody className="divide-y divide-canvas-grey">
                    <tr className="bg-canvas-ivory/40">
                      <td className="py-3 px-4 font-semibold text-text-slate w-1/3 min-w-[130px]">Property Category</td>
                      <td className="py-3 px-4 text-text-ink">{property.propertyType}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-text-slate">Floor / Level</td>
                      <td className="py-3 px-4 text-text-ink">{property.floorNumber || 'Middle Floor'} (Total {property.totalFloors || 14} Floors)</td>
                    </tr>
                    <tr className="bg-canvas-ivory/40">
                      <td className="py-3 px-4 font-semibold text-text-slate">Orientation / Facing</td>
                      <td className="py-3 px-4 text-text-ink">{property.facing || 'East'}</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-semibold text-text-slate">Car Parking Bays</td>
                      <td className="py-3 px-4 text-text-ink">{property.parkingSpaces || 1} Covered Dedicated Bay(s)</td>
                    </tr>
                    {property.maintenanceCharges && (
                      <tr className="bg-canvas-ivory/40">
                        <td className="py-3 px-4 font-semibold text-text-slate">Maintenance / CAM</td>
                        <td className="py-3 px-4 text-text-ink">{property.maintenanceCharges}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-text-slate">Project Developer</td>
                      <td className="py-3 px-4 text-text-ink">{property.projectDeveloper || 'Verified Developer'}</td>
                    </tr>
                    {property.reraRegistrationNumber && (
                      <tr className="bg-canvas-ivory/40">
                        <td className="py-3 px-4 font-semibold text-text-slate">RERA Project Number</td>
                        <td className="py-3 px-4 text-text-ink font-mono">{property.reraRegistrationNumber}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="py-3 px-4 font-semibold text-text-slate">Availability State</td>
                      <td className="py-3 px-4 text-text-ink">
                        Confirmed on {formatDate(property.availabilityConfirmedAt)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Schedule a Visit Box */}
            <ScheduleViewingForm propertyId={property.id} propertyTitle={property.title} />

          </div>

          {/* Right Column: Sticky Enquiry Box & Assigned Advisor Card */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick Property Enquiry Form */}
            <PropertyEnquiryForm property={property} />

            {/* Advisor Representation Card */}
            {assignedAgent && (
              <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                  Designated Advisory Lead
                </span>

                <div className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gold-champagne/40">
                    <Image
                      src={assignedAgent.photoUrl}
                      alt={assignedAgent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-semibold text-navy-midnight">
                      {assignedAgent.name}
                    </h4>
                    <p className="text-xs text-text-slate line-clamp-1">
                      {assignedAgent.role}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-text-slate leading-relaxed">
                  {assignedAgent.bio.slice(0, 130)}...
                </p>

                <div className="pt-3 border-t border-canvas-grey space-y-2 text-xs">
                  <a
                    href={`tel:${assignedAgent.phone}`}
                    className="flex items-center gap-2 text-navy-midnight hover:text-gold-deep font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>{assignedAgent.phone}</span>
                  </a>
                  <a
                    href={`mailto:${assignedAgent.email}`}
                    className="flex items-center gap-2 text-navy-midnight hover:text-gold-deep"
                  >
                    <Mail className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>{assignedAgent.email}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Verification Disclaimer Box */}
            <div className="p-4 rounded-xl bg-canvas-ivory/60 border border-canvas-grey text-[11px] text-text-slate leading-relaxed">
              <strong className="text-navy-midnight block mb-1">Listing Integrity Assurance</strong>
              Bricks2Wall does not publish fabricated or unverified listings. In staging/test environments, demo units are explicitly marked DEMO. For verified inventory, site visits are arranged directly with our licensed advisors.
            </div>

          </div>

        </div>

        {/* Similar Curated Properties */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-canvas-grey space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-gold-deep">
                  Compare Opportunities
                </p>
                <h3 className="font-serif text-2xl font-semibold text-navy-midnight">
                  Similar Properties in {property.locality.split('—')[0]}
                </h3>
              </div>
              <Link
                href="/properties"
                className="text-xs font-semibold uppercase tracking-wider text-gold-deep hover:text-navy-midnight"
              >
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((sim) => (
                <PropertyCard key={sim.id} property={sim} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
