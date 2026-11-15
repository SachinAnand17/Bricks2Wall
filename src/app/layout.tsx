import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnnouncementBar from '@/components/layout/AnnouncementBar';
import IntroVideoOverlay from '@/components/motion/IntroVideoOverlay';
import MandalaControl from '@/components/decorative/MandalaControl';
import { getContentSettings } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Bricks2Wall — Property, With Perspective | Verified Real Estate Advisory',
  description: 'A premium, trustworthy property discovery and brokerage service. Explore verified residential and commercial properties in India with architectural clarity and personal advisory.',
  metadataBase: new URL('https://bricks2wall.com'),
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '192x192',
        url: '/android-chrome-192x192.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '512x512',
        url: '/android-chrome-512x512.png',
      },
    ],
  },
  openGraph: {
    title: 'Bricks2Wall — Property, With Perspective',
    description: 'Explore verified residential and commercial opportunities with clear information, local insight and personal guidance from first enquiry to final decision.',
    url: 'https://bricks2wall.com',
    siteName: 'Bricks2Wall',
    images: [
      {
        url: '/brand/brand-logo.jpg',
        width: 1600,
        height: 893,
        alt: 'Bricks2Wall Real Estate Advisory',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bricks2Wall — Property, With Perspective',
    description: 'Verified property discovery and brokerage advisory in India.',
    images: ['/brand/brand-logo.jpg'],
  },
};

export const dynamic = 'force-dynamic';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = getContentSettings();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Bricks2Wall',
    description: 'A premium real-estate brokerage and property advisory brand.',
    url: 'https://bricks2wall.com',
    logo: 'https://bricks2wall.com/brand/brand-logo.jpg',
    telephone: settings.phoneContact || '+91-98765-43210',
    email: settings.emailContact || 'enquiry@bricks2wall.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.officeAddress || 'Level 5, Signature Tower, Central Business Avenue',
      addressLocality: 'Noida / NCR',
      addressCountry: 'IN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '19:00',
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preload" href="/brand/intro-video.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/brand/brand-logo.png" as="image" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-text-ink antialiased">
        {/* Intro Full-Screen Overlay (Plays 5.1s MP4 on first entry, then glides up) */}
        <IntroVideoOverlay />

        {/* Announcement Bar */}
        {settings.announcementActive && (
          <AnnouncementBar
            text={settings.announcementText}
            linkText={settings.announcementLinkText}
            linkHref={settings.announcementLinkHref}
          />
        )}

        {/* Primary Navigation Header */}
        <Header
          phone={settings.phoneContact || settings.headerPhone}
          ctaText={settings.headerCtaText}
          ctaHref={settings.headerCtaHref}
        />

        {/* Main Body */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <Footer
          brandDescription={settings.footerBrandDescription}
          address={settings.officeAddress}
          phone={settings.phoneContact}
          email={settings.emailContact}
          businessHours={settings.businessHours}
          complianceNotice={settings.footerComplianceNotice}
          demoNotice={settings.footerDemoNotice}
          copyrightText={settings.footerCopyrightText}
        />

        {/* Floating Mandala Art Pattern Regenerator */}
        <MandalaControl />
      </body>
    </html>
  );
}
