import React from 'react';
import { Metadata } from 'next';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Property & Legal Disclaimer | Bricks2Wall',
  description: 'Statutory disclaimer regarding property measurements, RERA verification, financial counsel, and demo listings.',
};

export default function DisclaimerPage() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3 pb-6 border-b border-canvas-grey">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Important Statutory Disclosure</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Property Information & Legal Disclaimer
          </h1>
          <p className="text-xs text-text-muted">
            Mandatory notice for visitors and prospective property buyers
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-text-slate leading-relaxed space-y-6">
          <div className="p-5 rounded-2xl bg-canvas-ivory/80 border border-gold-champagne/40 space-y-2">
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">
              1. Not Legal, Tax, or Financial Investment Advice
            </h4>
            <p>
              The content, articles, yield calculations, and market trends presented on this platform are provided for informational orientation only. They do not constitute formal legal counsel, statutory financial advice, tax planning, or investment underwriting. Prospective buyers must engage their own legal advocate, tax consultant, or financial planner.
            </p>
          </div>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            2. RERA Compliance & Project Verification
          </h3>
          <p>
            The Real Estate (Regulation and Development) Act (RERA) governs real estate transactions across India. Bricks2Wall urges all clients to independently verify promoter disclosures, sanctioned building plans, carpet area certificates, and project bank account details directly on the authorized state RERA portal prior to concluding any transaction.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            3. Dimensions and Measurements
          </h3>
          <p>
            All carpet areas, built-up measurements, floor heights, and site boundaries are published on an approximate basis according to developer specifications or architectural plans. Variations within permissible municipal tolerance limits may occur.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            4. Demo & Test Environment Notice
          </h3>
          <p>
            During system evaluation, staging, or demonstration phases, sample property records tagged with the &quot;DEMO&quot; badge represent illustrative dummy listings created to test navigation, filter algorithms, and CRM workflows. They do not represent live proprietary inventory and are excluded from public search indexing.
          </p>
        </div>

      </div>
    </div>
  );
}
