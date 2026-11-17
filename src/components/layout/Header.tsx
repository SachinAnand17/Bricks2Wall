'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Calendar,
  Phone,
  MessageCircle,
  Search,
  ArrowRight,
  ShieldCheck,
  Building2,
  MapPin,
  Sparkles,
} from 'lucide-react';
import HalfMandala from '@/components/decorative/HalfMandala';

export interface HeaderProps {
  phone?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function Header({ phone, ctaText, ctaHref }: HeaderProps = {}) {
  const displayPhone = phone || '+91 98765 43210';
  const displayCtaText = ctaText || 'Book A Visit';
  const displayCtaHref = ctaHref || '/book-a-visit';

  const [isOpen, setIsOpen] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLDivElement>(null);

  // Hide on admin routes
  if (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin'))) {
    return null;
  }

  // Smooth scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manage content appearance timing so text never squishes during collapse
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      // Reveal content slightly after container starts expanding
      timer = setTimeout(() => {
        setContentVisible(true);
      }, 90);
    } else {
      // Hide content immediately when closing starts
      setContentVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  // Close nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle escape key and body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
    }
  };

  const navLinks = [
    { name: 'Locations', href: '/locations', desc: 'Connectivity & prime urban enclaves' },
    { name: 'Services', href: '/services', desc: 'Bespoke acquisition & leasing advisory' },
    { name: 'About Us', href: '/about', desc: 'Our architectural heritage & mission' },
    { name: 'Advisors', href: '/agents', desc: 'Certified local market specialists' },
    { name: 'Insights', href: '/insights', desc: 'RERA legal diligence & market reports' },
    { name: 'Contact', href: '/contact', desc: 'Direct advisory consultation' },
  ];

  return (
    <>
      {/* 1. Full-Screen Dimmed Backdrop Overlay (z-[60] dims the page behind) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/65 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* 2. Floating Navbar Anchor: z-[70] sits ON TOP of backdrop so it is NEVER blurry */}
      <header className="sticky top-2 sm:top-3 z-[70] w-full h-0 overflow-visible pointer-events-none flex justify-center px-3 sm:px-6 pt-2 sm:pt-3">
        <div className="relative w-full max-w-5xl flex justify-center">
          {/* Independent Morphing Capsule Card (floats over the page, never pushes layout) */}
          <div
            ref={navRef}
            className={`pointer-events-auto absolute top-0 left-1/2 -translate-x-1/2 w-full overflow-hidden transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen
                ? 'max-w-4xl bg-[#10243A] text-white rounded-[28px] sm:rounded-[32px] border border-[#C8A45D]/50 shadow-[0_25px_65px_-12px_rgba(10,24,40,0.75)] p-5 sm:p-7 max-h-[88vh] sm:max-h-[620px]'
                : `max-w-[460px] sm:max-w-[520px] bg-[#FAF8F5] text-navy-midnight rounded-full border border-[#C8A45D]/40 shadow-[0_10px_30px_rgba(16,36,58,0.12)] px-4 sm:px-5 py-2 sm:py-2.5 max-h-[54px] sm:max-h-[58px] ${scrolled ? 'ring-1 ring-[#C8A45D]/30' : ''
                }`
              }`}
            style={{
              willChange: 'max-height, max-width, background-color, border-radius',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
            }}
          >
            {/* Half Mandala at the Corner of the Nav Bar */}
            <HalfMandala
              position="top-right"
              size={isOpen ? 250 : 170}
              variant={isOpen ? 'gold' : 'champagne'}
              opacity={isOpen ? 0.42 : 0.65}
              spin={true}
              spinDuration={90}
            />

            {/* Persistent Top Capsule Row */}
            <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-4 h-[38px] sm:h-[42px]">
              {/* Brand Logo & Name */}
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 group focus:outline-none shrink-0"
              >
                <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
                  <Image
                    src="/brand/brand-emblem.png"
                    alt="Bricks2Wall Emblem"
                    fill
                    priority
                    className="object-contain drop-shadow-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <span
                    className={`font-serif text-sm sm:text-base font-bold tracking-wider leading-none transition-colors duration-300 ${isOpen ? 'text-white' : 'text-navy-midnight'
                      }`}
                  >
                    BRICKS<span className="text-gold-champagne font-normal">2</span>WALL
                  </span>
                  <span
                    className={`text-[8px] sm:text-[9px] uppercase tracking-widest mt-0.5 font-medium transition-colors duration-300 ${isOpen ? 'text-white/60' : 'text-text-muted'
                      }`}
                  >
                    Real Estate Advisory
                  </span>
                </div>
              </Link>

              {/* Right Action Controls: "Book A Visit" + Hamburger Toggle */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* "Book A Visit" CTA Pill Button */}
                <Link
                  href={displayCtaHref}
                  onClick={() => setIsOpen(false)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-sm cursor-pointer shrink-0 ${isOpen
                    ? 'bg-gold-champagne text-navy-midnight hover:bg-white hover:text-navy-deep'
                    : 'bg-[#10243A] text-white hover:bg-gold-deep'
                    }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
                  <span className="hidden xs:inline">{displayCtaText}</span>
                  <span className="xs:hidden">Visit</span>
                </Link>

                {/* Animated Hamburger / Close Button */}
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm cursor-pointer ${isOpen
                    ? 'bg-white/10 hover:bg-white/20 text-white border border-white/25 active:scale-95'
                    : 'bg-white hover:bg-canvas-ivory text-navy-midnight border border-[#C8A45D]/40 active:scale-95'
                    }`}
                >
                  {/* Smooth Morphing Lines */}
                  <div className="w-4 h-4 flex flex-col justify-center items-center relative">
                    <span
                      className={`w-4 h-0.5 rounded-full transition-all duration-300 ${isOpen
                        ? 'rotate-45 translate-y-[2px] bg-gold-champagne'
                        : '-translate-y-1 bg-current'
                        }`}
                    />
                    <span
                      className={`w-4 h-0.5 rounded-full transition-all duration-300 ${isOpen
                        ? '-rotate-45 -translate-y-[2px] bg-gold-champagne'
                        : 'translate-y-1 bg-current'
                        }`}
                    />
                  </div>
                </button>
              </div>
            </div>

            {/* Extended Menu Content: Renders smoothly inside the expanded box */}
            {isOpen && (
              <div
                className={`relative z-10 pt-5 sm:pt-6 transition-all duration-300 overflow-y-auto no-scrollbar max-h-[calc(88vh-70px)] sm:max-h-[520px] ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                  }`}
              >
                {/* Top Subtitle Ribbon */}
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-gold-champagne/80 pb-3 border-b border-white/15">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold-champagne" />
                    <span>B2W Architectural Advisory</span>
                  </span>
                  <span className="hidden sm:inline">Verified • RERA Diligence Guaranteed</span>
                </div>

                {/* 2-Column Responsive Navigation Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start pt-5">
                  {/* Left Column: Properties & Core Navigation (7 cols) */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Featured Property Hub */}
                    <div className="p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-gold-champagne/40 transition-colors">
                      <div className="flex items-center justify-between mb-1.5">
                        <Link
                          href="/properties"
                          onClick={() => setIsOpen(false)}
                          className="font-serif text-base sm:text-lg font-bold text-white hover:text-gold-champagne transition-colors flex items-center gap-2"
                        >
                          <Building2 className="w-4 h-4 text-gold-champagne" />
                          <span>Properties Portfolio</span>
                          <ArrowRight className="w-3.5 h-3.5 text-gold-champagne" />
                        </Link>
                        <span className="text-[10px] uppercase tracking-wider text-gold-champagne/80 bg-white/10 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-white/70 mb-3">
                        Explore curated residential villas, luxury sky apartments, and prime corporate offices.
                      </p>
                      {/* Sub-Category Quick Chips */}
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href="/properties/buy"
                          onClick={() => setIsOpen(false)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold-champagne hover:text-navy-midnight text-white transition-colors border border-white/10 font-medium"
                        >
                          Buy Residential
                        </Link>
                        <Link
                          href="/properties/rent"
                          onClick={() => setIsOpen(false)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold-champagne hover:text-navy-midnight text-white transition-colors border border-white/10 font-medium"
                        >
                          Rentals & Serviced
                        </Link>
                        <Link
                          href="/properties/commercial"
                          onClick={() => setIsOpen(false)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-gold-champagne hover:text-navy-midnight text-white transition-colors border border-white/10 font-medium"
                        >
                          Commercial Floors
                        </Link>
                      </div>
                    </div>

                    {/* Main Navigation Links List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {navLinks.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/10 border border-white/5 hover:border-gold-champagne/30 transition-all flex flex-col justify-center"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-sm sm:text-base font-semibold text-white group-hover:text-gold-champagne transition-colors">
                              {item.name}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-white/40 group-hover:text-gold-champagne group-hover:translate-x-1 transition-all" />
                          </div>
                          <span className="text-[10px] text-white/60 truncate mt-0.5">
                            {item.desc}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Search & Direct Concierge (5 cols) */}
                  <div className="lg:col-span-5 space-y-3.5">
                    {/* Search Bar Input */}
                    <form onSubmit={handleSearchSubmit} className="relative">
                      <input
                        type="text"
                        placeholder="Search properties, locality, BHK..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-9 pr-9 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm focus:outline-none focus:border-gold-champagne focus:bg-white/15 transition-all"
                      />
                      <Search className="w-4 h-4 text-gold-champagne absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      {searchQuery && (
                        <button
                          type="submit"
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gold-champagne hover:text-white"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}
                    </form>

                    {/* Direct Concierge Contact Card */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-champagne">
                          Advisory Concierge
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-emerald-300 font-medium">Available</span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <a
                          href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                          className="flex items-center gap-2.5 text-xs text-white hover:text-gold-champagne transition-colors font-medium p-2 rounded-lg bg-white/5 hover:bg-white/10"
                        >
                          <Phone className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
                          <span>Call {displayPhone}</span>
                        </a>

                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2.5 text-xs text-white hover:text-gold-champagne transition-colors font-medium p-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/40 border border-emerald-500/30"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>WhatsApp Instant Advisory</span>
                        </a>
                      </div>

                      <div className="pt-1.5 border-t border-white/10 flex items-center gap-2 text-[10px] text-white/60">
                        <MapPin className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
                        <span>Expressway Corridor, Sector 128, Noida</span>
                      </div>
                    </div>

                    {/* Assurance Micro-Badge */}
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-[11px] text-white/70">
                      <ShieldCheck className="w-4 h-4 text-gold-champagne shrink-0" />
                      <span>100% RERA Diligence • Title Searches Verified</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Footer Strip inside Expanded Box */}
                <div className="mt-5 pt-3 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-white/60">
                  <span>© {new Date().getFullYear()} Bricks2Wall. Property, With Perspective.</span>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/book-a-visit"
                      onClick={() => setIsOpen(false)}
                      className="text-gold-champagne hover:underline"
                    >
                      Schedule Private Visit
                    </Link>
                    <span>•</span>
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-white"
                    >
                      Support
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
