'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Calendar, Search } from 'lucide-react';
import MandalaArt from '@/components/decorative/MandalaArt';

export interface HeaderProps {
  phone?: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function Header({ phone, ctaText, ctaHref }: HeaderProps = {}) {
  const displayPhone = phone || '+91 98765 43210';
  const displayCtaText = ctaText || 'Book a Visit';
  const displayCtaHref = ctaHref || '/book-a-visit';

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin'))) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change and handle scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
    setPropertiesDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Locations', href: '/locations' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-canvas-grey'
          : 'bg-white border-b border-canvas-grey/60'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
          {/* Brand Logo - Enlarged & Prominent */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center group focus:outline-none py-1">
              {/* Desktop Horizontal Logo */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="relative w-[240px] md:w-[290px] lg:w-[330px] h-[54px] md:h-[64px] lg:h-[72px] overflow-visible">
                  <Image
                    src="/brand/brand-logo.png"
                    alt="Bricks2Wall — Property, With Perspective"
                    fill
                    priority
                    className="object-contain object-left scale-[1.3] origin-left transition-transform duration-300 group-hover:scale-[1.34]"
                  />
                </div>
              </div>

              {/* Mobile Emblem Only */}
              <div className="sm:hidden flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold-champagne/40 shrink-0">
                  <Image
                    src="/brand/brand-emblem.jpg"
                    alt="Bricks2Wall Emblem"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <span className="font-serif text-base font-bold tracking-wider text-navy-midnight">
                  BRICKS<span className="text-gold-deep font-normal">2</span>WALL
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-7">
            {/* Properties Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPropertiesDropdownOpen(true)}
              onMouseLeave={() => setPropertiesDropdownOpen(false)}
            >
              <Link
                href="/properties"
                className={`flex items-center gap-1 text-sm tracking-wide font-medium transition-colors duration-200 py-2 ${pathname?.startsWith('/properties')
                    ? 'text-gold-deep font-semibold'
                    : 'text-text-ink hover:text-gold-champagne'
                  }`}
              >
                <span>Properties</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Link>

              {/* Submenu Dropdown */}
              {propertiesDropdownOpen && (
                <div className="absolute top-full left-0 w-56 bg-white rounded-xl shadow-luxury border border-canvas-grey py-2 z-50 animate-fade-in">
                  <Link
                    href="/properties"
                    className="block px-4 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted hover:bg-canvas-ivory"
                  >
                    All Listings
                  </Link>
                  <div className="border-t border-canvas-grey/50 my-1" />
                  <Link
                    href="/properties/buy"
                    className="block px-4 py-2 text-sm text-text-ink hover:bg-canvas-ivory hover:text-gold-deep"
                  >
                    Buy Residential
                  </Link>
                  <Link
                    href="/properties/rent"
                    className="block px-4 py-2 text-sm text-text-ink hover:bg-canvas-ivory hover:text-gold-deep"
                  >
                    Rentals & Serviced
                  </Link>
                  <Link
                    href="/properties/commercial"
                    className="block px-4 py-2 text-sm text-text-ink hover:bg-canvas-ivory hover:text-gold-deep"
                  >
                    Commercial & Retail
                  </Link>
                </div>
              )}
            </div>

            {navLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm tracking-wide font-medium transition-colors duration-200 ${isActive
                      ? 'text-gold-deep font-semibold'
                      : 'text-text-ink hover:text-gold-champagne'
                    }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/properties"
              className="p-2.5 text-text-slate hover:text-gold-champagne rounded-full hover:bg-canvas-ivory transition-colors"
              title="Search Properties"
            >
              <Search className="w-4 h-4" />
            </Link>

            <a
              href={`tel:${displayPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 text-xs text-text-slate hover:text-navy-midnight font-medium px-2 py-1"
            >
              <Phone className="w-3.5 h-3.5 text-gold-champagne" />
              <span>{displayPhone}</span>
            </a>

            <Link
              href={displayCtaHref}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold-champagne text-gold-deep bg-white hover:bg-gold-champagne hover:text-navy-deep transition-all duration-300 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{displayCtaText}</span>
            </Link>
          </div>

          {/* Mobile Actions & Menu Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/properties"
              className="p-2 text-text-slate hover:text-navy-midnight rounded-full hover:bg-canvas-ivory transition-colors"
              title="Search"
              aria-label="Search properties"
            >
              <Search className="w-4 h-4" />
            </Link>

            <Link
              href={displayCtaHref}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border border-gold-champagne text-gold-deep bg-white shrink-0 active:scale-95 transition-transform"
            >
              Book Visit
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 flex items-center justify-center text-navy-midnight hover:text-gold-deep rounded-xl hover:bg-canvas-ivory transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-16 bg-black/40 backdrop-blur-xs z-40 lg:hidden animate-fade-in"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative z-50 lg:hidden bg-white border-b border-canvas-grey px-4 sm:px-6 pt-4 pb-8 space-y-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto animate-fade-in">
            <div className="space-y-1 pb-3 border-b border-canvas-grey/60">
              <div className="flex items-center justify-between px-3 py-1 text-xs font-bold text-text-muted uppercase tracking-wider">
                <span>Property Categories</span>
                <Link
                  href="/properties"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gold-deep hover:underline font-semibold"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <Link
                  href="/properties/buy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-text-ink bg-canvas-ivory/60 hover:bg-canvas-ivory hover:text-gold-deep flex items-center justify-between"
                >
                  <span>Buy Residential</span>
                  <span className="text-[10px] text-text-muted">→</span>
                </Link>
                <Link
                  href="/properties/rent"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-text-ink bg-canvas-ivory/60 hover:bg-canvas-ivory hover:text-gold-deep flex items-center justify-between"
                >
                  <span>Rentals & Leases</span>
                  <span className="text-[10px] text-text-muted">→</span>
                </Link>
                <Link
                  href="/properties/commercial"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-text-ink bg-canvas-ivory/60 hover:bg-canvas-ivory hover:text-gold-deep flex items-center justify-between col-span-2"
                >
                  <span>Commercial & Corporate Suites</span>
                  <span className="text-[10px] text-text-muted">→</span>
                </Link>
              </div>
            </div>

            <div className="space-y-1">
              <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-text-muted block pb-1">
                Navigation
              </span>
              {navLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${isActive
                        ? 'bg-gold-champagne/15 text-gold-deep font-semibold'
                        : 'text-text-ink hover:bg-canvas-ivory'
                      }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-canvas-grey/60 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <a
                  href={`tel:${displayPhone.replace(/\s+/g, '')}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-canvas-grey text-xs font-semibold text-text-ink hover:bg-canvas-ivory transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-gold-deep" />
                  <span>Call {displayPhone}</span>
                </a>
                <Link
                  href={displayCtaHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider bg-navy-midnight text-white hover:bg-gold-deep transition-all shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-gold-champagne" />
                  <span>{displayCtaText}</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
