'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import MandalaArt from '@/components/decorative/MandalaArt';

interface IntroVideoOverlayProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function IntroVideoOverlay({ onComplete, forceShow = false }: IntroVideoOverlayProps) {
  // Start visible by default so video tag renders in initial HTML with ZERO latency
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if replay is explicitly requested in URL query
    const urlParams = new URLSearchParams(window.location.search);
    const isReplay = urlParams.get('replay') === '1';

    // If prefers-reduced-motion and not forceShow/replay
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceShow && !isReplay) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Check if intro has already been shown in this session
    const hasSeenIntro = sessionStorage.getItem('b2w_intro_seen');
    if (hasSeenIntro && !forceShow && !isReplay) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return;
    }

    // Start video playback immediately
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Intro video autoplay blocked:', err);
        });
      }
    }

    // Safety timeout: dismiss after 5.5s maximum
    const safetyTimer = setTimeout(() => {
      dismissIntro();
    }, 5500);

    return () => clearTimeout(safetyTimer);
  }, [forceShow, onComplete]);

  // Track playback time to animate progress bar
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(pct);
    }
  };

  const dismissIntro = () => {
    if (isSlidingUp) return;
    setIsSlidingUp(true);
    sessionStorage.setItem('b2w_intro_seen', 'true');

    // Smooth upward curtain glide (900ms) before unmounting
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 900);
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
      className={`fixed inset-0 z-[999999] w-screen h-screen bg-white text-navy-midnight overflow-hidden flex flex-col items-center justify-center transition-transform duration-900 ease-[cubic-bezier(0.76,0,0.24,1)] will-change-transform ${
        isSlidingUp ? '-translate-y-full' : 'translate-y-0'
      }`}
      aria-label="Bricks2Wall Introduction Screen"
    >
      {/* Corner mandala architectural accents */}
      <div className="absolute top-4 left-4 pointer-events-none opacity-25">
        <MandalaArt seed="intro-tl" size={130} variant="gold" spin={true} spinDuration={90} />
      </div>
      <div className="absolute top-4 right-4 pointer-events-none opacity-25">
        <MandalaArt seed="intro-tr" size={130} variant="gold" spin={true} spinDuration={90} />
      </div>
      <div className="absolute bottom-4 left-4 pointer-events-none opacity-25">
        <MandalaArt seed="intro-bl" size={130} variant="gold" spin={true} spinDuration={90} />
      </div>
      <div className="absolute bottom-4 right-4 pointer-events-none opacity-25">
        <MandalaArt seed="intro-br" size={130} variant="gold" spin={true} spinDuration={90} />
      </div>

      {/* Full Screen Edge-to-Edge Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-white">
        {!videoError ? (
          <video
            ref={videoRef}
            src="/brand/intro-video.mp4"
            autoPlay
            muted
            playsInline
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="w-full h-full object-contain sm:object-cover"
          />
        ) : (
          /* Fallback Poster in case video stream fails */
          <div className="flex flex-col items-center text-center p-8 space-y-4 animate-fade-in">
            <div className="w-48 h-28 relative mb-2">
              <Image
                src="/brand/brand-logo.png"
                alt="Bricks2Wall Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
            <p className="text-text-slate tracking-widest text-xs uppercase font-medium">
              Property, With Perspective
            </p>
          </div>
        )}
      </div>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-canvas-grey/40 z-30">
        <div
          className="h-full bg-gradient-to-r from-gold-deep via-gold-champagne to-gold-deep transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Floating Skip Button */}
      <div className="absolute bottom-8 right-8 z-30 flex items-center gap-4">
        <button
          onClick={dismissIntro}
          className="group flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-navy-midnight text-white text-xs font-semibold tracking-widest uppercase hover:bg-gold-deep hover:text-navy-deep transition-all duration-300 shadow-luxury border border-gold-champagne/30"
        >
          <span>Skip Intro</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1 font-bold">→</span>
        </button>
      </div>

      {/* Bottom subtle brand tagline */}
      <div className="absolute bottom-8 left-8 z-30 hidden md:flex items-center gap-2 text-text-slate text-xs tracking-wider font-light">
        <span className="w-2 h-2 rounded-full bg-gold-champagne" />
        <span>A Considered Digital Property Experience</span>
      </div>
    </div>
  );
}
