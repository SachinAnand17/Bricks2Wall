'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import MandalaArt from '@/components/decorative/MandalaArt';

interface IntroVideoOverlayProps {
  onComplete?: () => void;
  forceShow?: boolean;
}

export default function IntroVideoOverlay({ onComplete, forceShow = false }: IntroVideoOverlayProps) {
  const pathname = usePathname();

  // STRICT RULE: MUST NEVER SHOW OR RUN ON ADMIN ROUTES (/sachin or /admin)
  const isClientAdmin =
    typeof window !== 'undefined' &&
    (window.location.pathname.startsWith('/sachin') ||
      window.location.pathname.startsWith('/admin'));

  const isAdminRoute = Boolean(
    isClientAdmin ||
      (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin')))
  );

  // If on admin routes, do not even render a single DOM node
  if (isAdminRoute) {
    return null;
  }

  return <IntroVideoPlayer onComplete={onComplete} forceShow={forceShow} />;
}

function IntroVideoPlayer({ onComplete, forceShow = false }: IntroVideoOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isSlidingUp, setIsSlidingUp] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const isDismissedRef = useRef(false);
  const playbackInitialized = useRef(false);

  const dismissIntro = useCallback(() => {
    if (isDismissedRef.current) return;
    isDismissedRef.current = true;
    setIsSlidingUp(true);

    try {
      sessionStorage.setItem('b2w_intro_seen', 'true');
    } catch {}

    // Smooth upward curtain glide (1200ms) before unmounting
    setTimeout(() => {
      setIsVisible(false);
      if (onComplete) onComplete();
    }, 1250);
  }, [onComplete]);

  useEffect(() => {
    // 1. Detect if current page load is a reload / hard reload (e.g. CTRL+SHIFT+R or F5)
    let isReload = false;
    try {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navType = (navEntries[0] as PerformanceNavigationTiming).type;
        isReload = navType === 'reload';
      } else if ((performance as any).navigation) {
        isReload = (performance as any).navigation.type === 1;
      }
    } catch {}

    // On browser reload or hard refresh (CTRL+SHIFT+R), always clear intro seen flag so it plays!
    if (isReload) {
      try {
        sessionStorage.removeItem('b2w_intro_seen');
      } catch {}
    }

    // 2. Keyboard listeners for Ctrl+Shift+R, Ctrl+R, F5, Cmd+Shift+R, Cmd+R
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'R' || e.key === 'r')) ||
        e.key === 'F5'
      ) {
        try {
          sessionStorage.removeItem('b2w_intro_seen');
        } catch {}
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // 3. Tab unload/pagehide listeners: Whenever the page unloads for a reload or refresh,
    // clear the flag so ANY subsequent reload (Ctrl+Shift+R, F5) always replays the intro!
    const handleUnload = () => {
      try {
        sessionStorage.removeItem('b2w_intro_seen');
      } catch {}
    };
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);

    // 4. Check if intro has already been seen in this session (bypassed on reload/forceShow)
    const hasSeenIntro = sessionStorage.getItem('b2w_intro_seen');
    if (hasSeenIntro && !forceShow && !isReload) {
      setIsVisible(false);
      if (onComplete) onComplete();
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('beforeunload', handleUnload);
        window.removeEventListener('pagehide', handleUnload);
      };
    }

    // 5. Single playback initialization (Guards against React StrictMode double-mounting)
    if (!playbackInitialized.current) {
      playbackInitialized.current = true;

      if (videoRef.current) {
        // Apply smooth cinematic playback rate (0.8x)
        videoRef.current.playbackRate = 0.8;

        // If the browser hasn't automatically started playback yet, start it now
        if (videoRef.current.paused) {
          const playPromise = videoRef.current.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Intro video autoplay blocked:', err);
            });
          }
        }
      }
    }

    // Safety timeout: dismiss after 14s maximum if video hangs
    const safetyTimer = setTimeout(() => {
      dismissIntro();
    }, 14000);

    return () => {
      clearTimeout(safetyTimer);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleUnload);
      window.removeEventListener('pagehide', handleUnload);
    };
  }, [forceShow, onComplete, dismissIntro]);

  // Track playback time directly via DOM ref to avoid 10 React re-renders/sec
  const handleTimeUpdate = () => {
    if (videoRef.current && progressBarRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      progressBarRef.current.style.width = `${pct}%`;
    }
  };

  const handleMetadataLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    try {
      e.currentTarget.playbackRate = 0.8;
    } catch {}
  };

  const handleVideoEnded = () => {
    // Hold final majestic logo frame for 500ms before sliding up smoothly
    setTimeout(() => {
      dismissIntro();
    }, 500);
  };

  const handleVideoError = () => {
    setVideoError(true);
    setTimeout(() => {
      dismissIntro();
    }, 2000);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[999999] w-screen h-screen bg-white text-navy-midnight overflow-hidden flex flex-col items-center justify-center will-change-transform select-none"
      style={{
        transform: isSlidingUp ? 'translateY(-100%)' : 'translateY(0%)',
        transition: 'transform 1200ms cubic-bezier(0.77, 0, 0.175, 1)',
      }}
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
            onLoadedMetadata={handleMetadataLoaded}
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

      {/* Bottom Progress Bar (Direct DOM update: zero re-render overhead) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-canvas-grey/40 z-30 pointer-events-none">
        <div
          ref={progressBarRef}
          className="h-full bg-gradient-to-r from-gold-deep via-gold-champagne to-gold-deep transition-all duration-100 ease-linear"
          style={{ width: '0%' }}
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
