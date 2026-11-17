import React from 'react';
import { Shield, Check, Lock } from 'lucide-react';

const ROLES_DATA = [
  {
    role: 'Owner / Super Admin',
    description: 'Complete operational control across all modules, cloud infrastructure, and sensitive customer data.',
    permissions: [
      'Manage all platform settings & integrations',
      'Create, edit, unpublish, and delete properties',
      'View, assign, and export full lead CRM records',
      'Manage system users, roles & staff credentials',
      'Access audit logs & financial performance reports',
    ],
  },
  {
    role: 'Listing Manager',
    description: 'Responsible for property portfolio fidelity, floor plans, legal verification, and RERA attributes.',
    permissions: [
      'Create and update property listing records',
      'Manage media assets, gallery ordering & alt text',
      'Toggle availability status & confirmation dates',
      'Configure listing SEO metadata and social cards',
    ],
  },
  {
    role: 'Sales Manager',
    description: 'Supervises lead conversion workflows, enquiry distribution SLAs, and viewing calendars.',
    permissions: [
      'Access full incoming lead inbox and pipeline',
      'Assign leads to individual property advisors',
      'Review viewing appointments and follow-up notes',
      'Export approved lead summaries for CRM analysis',
    ],
  },
  {
    role: 'Property Advisor / Agent',
    description: 'Field advisors handling assigned buyers, private site walk-throughs, and consultation notes.',
    permissions: [
      'View assigned leads and properties only',
      'Log call attempts, site visits, and consultation notes',
      'Update viewing appointment confirmation states',
      'Direct WhatsApp and phone client advisory',
    ],
  },
  {
    role: 'Content Editor',
    description: 'Curates public narrative, editorial articles, location profiles, and marketing announcements.',
    permissions: [
      'Edit homepage copy and top announcement bar',
      'Publish market insights, articles, and buying guides',
      'Manage location guide connectivity and lifestyle points',
      'Manage verified client testimonials',
    ],
  },
  {
    role: 'Analyst / Read-Only',
    description: 'Strategic oversight with strictly read-only inspection access without data export privileges.',
    permissions: [
      'View aggregated dashboard conversion metrics',
      'Inspect search queries and popular listing traffic',
      'Read-only access to published portfolio',
    ],
  },
];

export default function RolesMatrix() {
  return (
    <div className="bg-white rounded-2xl border border-canvas-grey p-4 sm:p-6 shadow-sm max-w-5xl space-y-6">
      <div className="pb-4 border-b border-canvas-grey">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-gold-deep mb-1">
          <Shield className="w-3.5 h-3.5 text-gold-champagne" />
          <span>Security & Governance</span>
        </div>
        <h3 className="font-serif text-lg font-semibold text-navy-midnight">
          Role-Based Access Control (RBAC) Specification
        </h3>
        <p className="text-xs text-text-slate mt-1">
          Standardized permission matrix enforcing least-privilege security across administrative operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {ROLES_DATA.map((r, i) => (
          <div
            key={i}
            className="p-5 rounded-xl bg-canvas-ivory/60 border border-canvas-grey space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-sm font-bold text-navy-midnight">
                  {r.role}
                </h4>
                <Lock className="w-3.5 h-3.5 text-gold-champagne" />
              </div>
              <p className="text-[11px] text-text-slate leading-relaxed">
                {r.description}
              </p>
            </div>

            <div className="pt-3 border-t border-canvas-grey/70 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
                Permitted Capabilities:
              </span>
              {r.permissions.map((p, idx) => (
                <div key={idx} className="flex items-start gap-1.5 text-[11px] text-text-ink">
                  <Check className="w-3 h-3 text-gold-deep shrink-0 mt-0.5" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
