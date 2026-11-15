'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, PlayCircle, ShieldCheck } from 'lucide-react';
import MandalaArt from '@/components/decorative/MandalaArt';
import MandalaWatermark from '@/components/decorative/MandalaWatermark';

export interface FooterProps {
  brandDescription?: string;
  address?: string;
  phone?: string;
  email?: string;
  businessHours?: string;
  complianceNotice?: string;
  demoNotice?: string;
  copyrightText?: string;
}

export default function Footer({
  brandDescription,
  address,
  phone,
  email,
  businessHours,
  complianceNotice,
  demoNotice,
  copyrightText,
}: FooterProps = {}) {
  const displayBrand = brandDescription || 'A premium, trustworthy property discovery and brokerage advisory. We present verified residential and commercial opportunities with architectural clarity, transparent documentation, and informed personal guidance.';
  const displayAddress = address || 'Level 5, Signature Tower, Central Business Avenue, Demo City, India';
  const displayPhone = phone || '+91 98765 43210';
  const displayEmail = email || 'enquiry@bricks2wall.com';
  const displayHours = businessHours || 'Mon – Sat: 9:30 AM – 7:00 PM IST';
  const displayCompliance = complianceNotice || 'Regulatory & Integrity Notice: Bricks2Wall operates as a dedicated property advisory and real estate brokerage. Listing details, prices, floor measurements, and availability states are published subject to physical verification and owner confirmation. Please verify all individual state RERA project registrations and legal title documentation before entering into formal binding transactions.';
  const displayDemo = demoNotice || 'Demo property records displayed during testing are explicitly designated with a DEMO label and represent illustrative sample listings rather than live proprietary inventory.';
  const displayCopyright = copyrightText || 'Bricks2Wall Real Estate Advisory. All rights reserved.';

  const handleReplayIntro = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('b2w_intro_seen');
      window.location.href = '/?replay=1';
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#10243A] to-[#0B1827] text-white pt-16 pb-12 border-t border-gold-champagne/20">
      {/* Background Majestic Architectural Mandala Watermark */}
      <MandalaWatermark seed="footer-tapestry-mandala" position="bottom-right" size={820} variant="white" opacity={0.06} spinDuration={260} />
      <MandalaWatermark seed="footer-ambient-mandala-left" position="top-left" size={540} variant="gold" opacity={0.05} spinDuration={220} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block bg-white p-2 rounded-lg">
              <div className="relative w-[190px] h-[46px]">
                <Image
                  src="/brand/brand-logo.jpg"
                  alt="Bricks2Wall Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              {displayBrand}
            </p>

            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={handleReplayIntro}
                className="inline-flex items-center gap-2 text-xs text-gold-champagne hover:text-white transition-colors"
                title="Replay Brand Intro Video"
              >
                <PlayCircle className="w-4 h-4" />
                <span>Replay Brand Intro</span>
              </button>

              <div className="h-3 w-[1px] bg-white/20" />

              <div className="inline-flex items-center gap-1.5 text-xs text-white/50">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-champagne" />
                <span>Verified Listings Advisory</span>
              </div>
            </div>
          </div>

          {/* Properties Column */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider uppercase text-gold-champagne font-semibold">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75 font-light">
              <li>
                <Link href="/properties" className="hover:text-gold-champagne transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/properties/buy" className="hover:text-gold-champagne transition-colors">
                  Buy Residential
                </Link>
              </li>
              <li>
                <Link href="/properties/rent" className="hover:text-gold-champagne transition-colors">
                  Rentals & Serviced
                </Link>
              </li>
              <li>
                <Link href="/properties/commercial" className="hover:text-gold-champagne transition-colors">
                  Commercial & Offices
                </Link>
              </li>
              <li>
                <Link href="/book-a-visit" className="hover:text-gold-champagne transition-colors">
                  Schedule Site Viewing
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Guides */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider uppercase text-gold-champagne font-semibold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-white/75 font-light">
              <li>
                <Link href="/locations" className="hover:text-gold-champagne transition-colors">
                  Location Guides
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-champagne transition-colors">
                  Advisory Services
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-gold-champagne transition-colors">
                  Our Advisors
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-gold-champagne transition-colors">
                  Market Insights & RERA
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold-champagne transition-colors">
                  About Bricks2Wall
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-wider uppercase text-gold-champagne font-semibold">
              Contact Advisory
            </h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold-champagne shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed">
                  {displayAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-champagne shrink-0" />
                <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="hover:text-white text-xs">
                  {displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-champagne shrink-0" />
                <a href={`mailto:${displayEmail}`} className="hover:text-white text-xs">
                  {displayEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold-champagne shrink-0 mt-0.5" />
                <span className="text-xs text-white/60">
                  {displayHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Disclaimer Band */}
        <div className="pt-8 pb-6 border-b border-white/10 text-xs text-white/50 space-y-2 leading-relaxed">
          <p>
            {displayCompliance}
          </p>
          <p>
            {displayDemo}
          </p>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>© {new Date().getFullYear()} {displayCopyright}</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              Disclaimer
            </Link>
            <Link href="/admin" className="text-white/30 hover:text-white transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
