import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | Bricks2Wall Real Estate Advisory',
  description: 'Bricks2Wall privacy notice, client data protection policies, and contact information handling.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="space-y-3 pb-6 border-b border-canvas-grey">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-deep">
            <Shield className="w-4 h-4 text-gold-champagne" />
            <span>Legal Notice</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-navy-midnight font-medium">
            Privacy Policy & Data Protection Notice
          </h1>
          <p className="text-xs text-text-muted">
            Last Updated: November 2026 • Effective for Bricks2Wall Real Estate Advisory Services
          </p>
        </div>

        <div className="prose prose-slate max-w-none text-xs sm:text-sm text-text-slate leading-relaxed space-y-6">
          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            1. Purpose and Scope
          </h3>
          <p>
            Bricks2Wall (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is dedicated to safeguarding the privacy and personal data of our website visitors, clients, and prospective property purchasers. This Privacy Policy outlines our procedures concerning the collection, storage, use, and protection of information obtained through our digital property discovery platform.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            2. Personal Information Collected
          </h3>
          <p>
            We collect personal data strictly when explicitly submitted through our property inquiry, viewing booking, or consultation forms, including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Full Name</li>
            <li>Direct contact phone number and WhatsApp credentials (for property dossiers)</li>
            <li>Email address</li>
            <li>Property configuration preferences and scheduling times</li>
          </ul>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            3. Use of Personal Information
          </h3>
          <p>
            Your information is utilized solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Respond to your direct inquiries and deliver verified listing documentation.</li>
            <li>Coordinate and confirm physical site viewing appointments.</li>
            <li>Connect you with our designated licensed property advisor.</li>
          </ul>
          <p>
            We strictly enforce a <strong>Zero Unsolicited Distribution</strong> policy. We do not sell, rent, or trade your contact records with third-party telemarketing networks.
          </p>

          <h3 className="font-serif text-lg font-semibold text-navy-midnight">
            4. Data Retention and Access Rights
          </h3>
          <p>
            Clients may request review, rectification, or complete deletion of their inquiry records by contacting our Data Protection Officer at <a href="mailto:privacy@bricks2wall.com" className="text-gold-deep underline">privacy@bricks2wall.com</a>.
          </p>
        </div>

      </div>
    </div>
  );
}
