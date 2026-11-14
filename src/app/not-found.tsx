import React from 'react';
import Link from 'next/link';
import { Search, Home, ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-24 bg-gradient-to-b from-white via-canvas-ivory/50 to-white min-h-[70vh] flex items-center justify-center">
      <div className="max-w-xl mx-auto px-4 sm:px-6 text-center space-y-8 animate-fade-in">
        
        <div className="space-y-3">
          <span className="font-serif text-7xl sm:text-8xl font-bold text-gold-champagne/40 block">
            404
          </span>
          <span className="text-xs font-semibold tracking-widest uppercase text-gold-deep block">
            Page Not Found
          </span>
          <h1 className="font-serif text-3xl font-medium text-navy-midnight">
            This Property or Destination Has Moved
          </h1>
          <p className="text-text-slate text-sm leading-relaxed max-w-md mx-auto">
            The page or listing you are searching for may have been archived, re-listed, or relocated.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/properties"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
          >
            <Search className="w-4 h-4 text-gold-champagne" />
            <span>Search Active Properties</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-canvas-grey bg-white text-navy-midnight text-xs font-semibold uppercase tracking-wider hover:bg-canvas-ivory transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
