'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
  linkText?: string;
  linkHref?: string;
}

export default function AnnouncementBar({
  text = 'A considered approach to finding your next property. Contact the team for current availability.',
  linkText = 'Talk to an Advisor',
  linkHref = '/contact',
}: AnnouncementBarProps) {
  const pathname = usePathname();
  if (pathname && (pathname.startsWith('/sachin') || pathname.startsWith('/admin'))) {
    return null;
  }

  return (
    <div className="bg-[#10243A] text-white/90 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-gold-champagne/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        <p className="tracking-wide text-left sm:text-left flex-1 font-light truncate sm:whitespace-normal">
          <span className="text-gold-champagne mr-1.5 font-medium shrink-0">B2W Advisory •</span>
          <span>{text}</span>
        </p>
        <Link
          href={linkHref}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-gold-champagne hover:text-white transition-colors duration-200 shrink-0 font-medium whitespace-nowrap"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </Link>
      </div>
    </div>
  );
}
