import React from 'react';
import { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Use | Bricks2Wall Real Estate Advisory',
  description: 'Terms and conditions governing the use of the Bricks2Wall digital platform and property advisory services.',
};

export default function TermsPage() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3 pb-6 border-b border-canvas-grey">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-deep">
            <FileText className="w-4 h-4 text-gold-champagne" />
            <span>Terms of Engagement</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Terms of Use
          </h1>
          <p className="text-xs text-text-muted">
            Last Updated: November 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-text-slate leading-relaxed space-y-6">
          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            1. Nature of Advisory Service
          </h3>
          <p>
            Bricks2Wall operates as an independent property brokerage and real estate consultancy. All listings, floor dimensions, photographs, architectural renderings, and pricing metrics displayed on this platform are compiled for discovery and guidance purposes only.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            2. Physical Inspection & Legal Verification
          </h3>
          <p>
            While our advisory team undertakes stringent due diligence on listed opportunities, prospective purchasers and corporate lessees are advised to conduct independent verification of all original title deeds, municipal occupancy certificates, and state RERA project registrations prior to signing binding sale agreements or remitting token disbursements.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            3. Intellectual Property Rights
          </h3>
          <p>
            All brand trademarks, trade dress, logos, video assets, architectural photography, and proprietary editorial materials published on this website are the intellectual property of Bricks2Wall and may not be reproduced without written authorization.
          </p>
        </div>

      </div>
    </div>
  );
}
