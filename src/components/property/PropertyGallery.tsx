'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyMedia } from '@/types';

interface PropertyGalleryProps {
  media: PropertyMedia[];
  title: string;
}

export default function PropertyGallery({ media, title }: PropertyGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const images = media && media.length > 0 ? media : [
    {
      id: 'default-1',
      url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80',
      caption: title,
      altText: title,
      isPrimary: true,
      order: 1,
    }
  ];

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Main Large Hero Image */}
      <div className="relative h-[250px] sm:h-[400px] lg:h-[500px] w-full rounded-2xl overflow-hidden bg-canvas-ivory border border-canvas-grey shadow-sm group">
        <Image
          src={images[activeIdx].url}
          alt={images[activeIdx].altText || title}
          fill
          priority
          className="object-cover transition-all duration-300"
        />

        {/* Gradient shadow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Caption */}
        {images[activeIdx].caption && (
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-10 bg-navy-midnight/80 backdrop-blur-md px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-lg text-white text-[10px] sm:text-xs">
            {images[activeIdx].caption}
          </div>
        )}

        {/* Fullscreen Expand Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-white/90 backdrop-blur-md text-navy-midnight hover:bg-white text-[11px] sm:text-xs font-medium shadow-md transition-all"
        >
          <Maximize2 className="w-3.5 h-3.5 text-gold-deep" />
          <span className="hidden xs:inline">Fullscreen</span>
        </button>

        {/* Previous / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-navy-midnight flex items-center justify-center shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-navy-midnight flex items-center justify-center shadow-md transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${activeIdx === idx
                  ? 'border-gold-champagne shadow-gold-glow scale-105'
                  : 'border-canvas-grey opacity-70 hover:opacity-100'
                }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full bg-white/10 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={images[activeIdx].url}
              alt={images[activeIdx].altText || title}
              fill
              className="object-contain"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="mt-4 text-center text-white/70 text-xs">
            {activeIdx + 1} of {images.length} • {images[activeIdx].caption || title}
          </div>
        </div>
      )}
    </div>
  );
}
