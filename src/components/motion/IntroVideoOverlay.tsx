'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface IntroVideoOverlayProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function IntroVideoOverlay({ onComplete, forceShow = false }: IntroVideoOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceShow) {
      if (onComplete) onComplete();
      return;
    }

    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem('b2w_intro_seen');
    if (hasSeenIntro && !forceShow) {
      if (onComplete) onComplete();
      return;
    }

    setIsVisible(true);

    // Safety timeout: if video fails to play or load within 6.5s, slide up anyway
    const safetyTimer = setTimeout(() => {
      dismissIntro();
    }, 6500);

    return () => clearTimeout(safetyTimer);
  }, [forceShow, onComplete]);

  const dismissIntro = () => {
    if (isSlidingUp) return;
    setIsSlidingUp(true);
    sessionStorage.setItem('b2w_intro_seen', 'true');

    // Wait for the upward slide animation (800ms) before unmounting
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 800);
  };

  const handleVideoEnded = () => {
    dismissIntro();
  };

  const handleVideoError = () => {
    setVideoError(true);
    setTimeout(() => {
      dismissIntro();
    }, 1500);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1827] text-white transition-transform duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${
        isSlidingUp ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Bricks2Wall Introduction"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,164,93,0.18)_0%,transparent_70%)] pointer-events-none" />

      {/* Video Container */}
      <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center p-4">
        {!videoError ? (
          <video
            ref={videoRef}
            src="/brand/intro-video.mp4"
            autoPlay
            muted
            playsInline
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="w-full h-full object-contain rounded-xl shadow-2xl"
          />
        ) : (
          /* Fallback Poster in case video stream fails */
          <div className="flex flex-col items-center text-center p-8 space-y-4 animate-fade-in">
            <div className="w-32 h-32 relative mb-4">
              <Image
                src="/brand/brand-emblem.jpg"
                alt="Bricks2Wall Emblem"
                fill
                className="object-contain rounded-full shadow-gold-glow"
              />
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-gold-champagne tracking-wider">
              BRICKS2WALL
            </h1>
            <p className="text-white/70 tracking-widest text-xs uppercase">
              Property, With Perspective
            </p>
          </div>
        )}
      </div>

      {/* Skip Button & Controls */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-4">
        <button
          onClick={dismissIntro}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-gold-champagne/40 bg-navy-midnight/80 backdrop-blur-md text-white/90 text-xs tracking-widest uppercase hover:bg-gold-champagne hover:text-navy-deep hover:border-gold-champagne transition-all duration-300 shadow-luxury"
        >
          <span>Skip Intro</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      {/* Bottom subtle brand credit */}
      <div className="absolute bottom-8 left-8 hidden md:block text-white/40 text-xs tracking-wider">
        A Considered Digital Property Experience
      </div>
    </div>
  );
}
