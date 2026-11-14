'use client';

import React from 'react';
import Link from 'next/link';
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
  return (
    <div className="bg-[#10243A] text-white/90 text-xs py-2 px-4 border-b border-gold-champagne/20">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <p className="truncate tracking-wide text-center sm:text-left flex-1 font-light">
          <span className="text-gold-champagne mr-2 font-medium">B2W Advisory •</span>
          {text}
        </p>
        <Link
          href={linkHref}
          className="hidden md:inline-flex items-center gap-1.5 text-gold-champagne hover:text-white transition-colors duration-200 shrink-0 font-medium"
        >
          <span>{linkText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
