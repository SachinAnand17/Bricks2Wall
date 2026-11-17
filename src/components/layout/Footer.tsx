'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, Clock, ShieldCheck } from 'lucide-react';

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
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin'))) {
    return null;
  }

  const displayBrand = brandDescription || 'A premium, trustworthy property discovery and brokerage advisory. We present verified residential and commercial opportunities with architectural clarity, transparent documentation, and informed personal guidance.';
  const displayAddress = address || 'Level 5, Signature Tower, Central Business Avenue, Demo City, India';
  const displayPhone = phone || '+91 98765 43210';
  const displayEmail = email || 'enquiry@bricks2wall.com';
  const displayHours = businessHours || 'Mon – Sat: 9:30 AM – 7:00 PM IST (Site visits available on Sundays by appointment)';
  const displayCompliance = complianceNotice || 'Regulatory & Integrity Notice: Bricks2Wall operates as a dedicated property advisory and real estate brokerage. Listing details, prices, floor measurements, and availability states are published subject to physical verification and owner confirmation. Please verify all individual state RERA project registrations and legal title documentation before entering into formal binding transactions.';
  const displayDemo = demoNotice || 'Demo property records displayed during testing are explicitly designated with a DEMO label and represent illustrative sample listings rather than live proprietary inventory.';
  const displayCopyright = copyrightText || 'Bricks2Wall Real Estate Advisory. All rights reserved.';

  return (
    <footer className="relative overflow-hidden bg-white text-[#8C6D2D] pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-[#C8A45D]/30 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-[#C8A45D]/25">
          
          {/* Brand & Mission Column */}
          <div className="sm:col-span-2 space-y-5">
            <Link href="/" className="inline-block group focus:outline-none">
              <div className="relative w-[220px] sm:w-[280px] md:w-[320px] h-[55px] sm:h-[70px] md:h-[80px]">
                <Image
                  src="/brand/brand-logo.png"
                  alt="Bricks2Wall Logo"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <p className="text-[#8C6D2D] text-xs sm:text-sm leading-relaxed max-w-sm font-medium">
              {displayBrand}
            </p>

            <div className="pt-1 flex items-center gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF6EE] border border-[#C8A45D]/40 text-xs font-semibold text-[#9E782F] shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#B38A38]" />
                <span>Verified Listings Advisory</span>
              </div>
            </div>
          </div>

          {/* Properties Column */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-[#9E782F] font-bold">
              Properties
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8C6D2D] font-medium">
              <li>
                <Link href="/properties" className="hover:text-[#B8860B] transition-colors inline-block">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/properties/buy" className="hover:text-[#B8860B] transition-colors inline-block">
                  Buy Residential
                </Link>
              </li>
              <li>
                <Link href="/properties/rent" className="hover:text-[#B8860B] transition-colors inline-block">
                  Rentals & Serviced
                </Link>
              </li>
              <li>
                <Link href="/properties/commercial" className="hover:text-[#B8860B] transition-colors inline-block">
                  Commercial & Offices
                </Link>
              </li>
              <li>
                <Link href="/book-a-visit" className="hover:text-[#B8860B] transition-colors inline-block">
                  Schedule Site Viewing
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Guides */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-[#9E782F] font-bold">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#8C6D2D] font-medium">
              <li>
                <Link href="/locations" className="hover:text-[#B8860B] transition-colors inline-block">
                  Location Guides
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-[#B8860B] transition-colors inline-block">
                  Advisory Services
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-[#B8860B] transition-colors inline-block">
                  Our Advisors
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-[#B8860B] transition-colors inline-block">
                  Market Insights & RERA
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#B8860B] transition-colors inline-block">
                  About Bricks2Wall
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="font-serif text-sm tracking-widest uppercase text-[#9E782F] font-bold">
              Contact Advisory
            </h4>
            <ul className="space-y-3.5 text-sm text-[#8C6D2D] font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B38A38] shrink-0 mt-0.5" />
                <span className="text-xs leading-relaxed text-[#8C6D2D]">
                  {displayAddress}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B38A38] shrink-0" />
                <a href={`tel:${displayPhone.replace(/\s+/g, '')}`} className="hover:text-[#B8860B] text-xs font-semibold text-[#8C6D2D] transition-colors">
                  {displayPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B38A38] shrink-0" />
                <a href={`mailto:${displayEmail}`} className="hover:text-[#B8860B] text-xs font-semibold text-[#8C6D2D] transition-colors">
                  {displayEmail}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#B38A38] shrink-0 mt-0.5" />
                <span className="text-xs text-[#9E782F]">
                  {displayHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Disclaimer Band */}
        <div className="pt-8 pb-6 border-b border-[#C8A45D]/25 text-xs text-[#9E782F] space-y-2 leading-relaxed">
          <p>
            {displayCompliance}
          </p>
          <p>
            {displayDemo}
          </p>
        </div>

        {/* Copyright and Legal Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E782F] text-center sm:text-left">
          <p className="font-medium">© {new Date().getFullYear()} {displayCopyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/privacy-policy" className="hover:text-[#B8860B] font-medium transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#B8860B] font-medium transition-colors">
              Terms of Use
            </Link>
            <Link href="/disclaimer" className="hover:text-[#B8860B] font-medium transition-colors">
              Disclaimer
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
