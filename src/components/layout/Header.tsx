'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown, Phone, Calendar, Search } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [propertiesDropdownOpen, setPropertiesDropdownOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setPropertiesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Locations', href: '/locations' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Insights', href: '/insights' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-canvas-grey'
          : 'bg-white border-b border-canvas-grey/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center group focus:outline-none">
              {/* Desktop Horizontal Logo */}
              <div className="hidden sm:block relative w-[210px] h-[52px]">
                <Image
                  src="/brand/brand-logo.jpg"
                  alt="Bricks2Wall — Property, With Perspective"
                  fill
                  priority
                  className="object-contain object-left"
                />
              </div>

              {/* Mobile Emblem Only */}
              <div className="sm:hidden flex items-center gap-2">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-gold-champagne/30">
                  <Image
                    src="/brand/brand-emblem.jpg"
                    alt="Bricks2Wall Emblem"
                    fill
                    priority
                    className="object-contain"
                  />
                </div>
                <span className="font-serif text-lg font-bold tracking-wider text-navy-midnight">
                  BRICKS<span className="text-gold-champagne font-light">2</span>WALL
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-7">
            {/* Properties Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPropertiesDropdownOpen(true)}
              onMouseLeave={() => setPropertiesDropdownOpen(false)}
            >
              <Link
                href="/properties"
                className={`flex items-center gap-1 text-sm tracking-wide font-medium transition-colors duration-200 py-2 ${
                  pathname?.startsWith('/properties')
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
                  className={`text-sm tracking-wide font-medium transition-colors duration-200 ${
                    isActive
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
              href="tel:+919876543210"
              className="flex items-center gap-1.5 text-xs text-text-slate hover:text-navy-midnight font-medium px-2 py-1"
            >
              <Phone className="w-3.5 h-3.5 text-gold-champagne" />
              <span>+91 98765 43210</span>
            </a>

            <Link
              href="/book-a-visit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider uppercase border border-gold-champagne text-gold-deep bg-white hover:bg-gold-champagne hover:text-navy-deep transition-all duration-300 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book a Visit</span>
            </Link>

            <Link
              href="/admin"
              className="text-xs text-text-muted hover:text-navy-midnight border-l border-canvas-grey pl-3 py-1"
              title="Admin CRM Portal"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/book-a-visit"
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-gold-champagne text-gold-deep"
            >
              Book Visit
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-navy-midnight hover:text-gold-champagne focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-canvas-grey px-4 pt-3 pb-6 space-y-3 shadow-lg animate-fade-in">
          <div className="space-y-1 pb-3 border-b border-canvas-grey/50">
            <div className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 py-1">
              Property Search
            </div>
            <Link
              href="/properties"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-ink hover:bg-canvas-ivory"
            >
              All Properties
            </Link>
            <Link
              href="/properties/buy"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-ink hover:bg-canvas-ivory"
            >
              Buy Residential
            </Link>
            <Link
              href="/properties/rent"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-ink hover:bg-canvas-ivory"
            >
              Rentals & Leases
            </Link>
            <Link
              href="/properties/commercial"
              className="block px-3 py-2 rounded-lg text-sm font-medium text-text-ink hover:bg-canvas-ivory"
            >
              Commercial Opportunities
            </Link>
          </div>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-text-ink hover:bg-canvas-ivory"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-canvas-grey/60 space-y-3">
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-sm text-text-slate px-3"
            >
              <Phone className="w-4 h-4 text-gold-champagne" />
              <span>+91 98765 43210</span>
            </a>
            <div className="flex gap-2 pt-2">
              <Link
                href="/book-a-visit"
                className="flex-1 text-center py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-gold-champagne text-navy-deep shadow-sm"
              >
                Schedule Site Visit
              </Link>
              <Link
                href="/admin"
                className="px-4 py-2.5 rounded-full text-xs font-semibold text-text-slate border border-canvas-grey"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
