import React from 'react';
import { Building2, Users, Calendar, AlertCircle, ArrowUpRight } from 'lucide-react';

interface MetricsCardsProps {
  metrics: {
    totalProperties: number;
    activeProperties: number;
    totalLeads: number;
    newLeads: number;
    scheduledViewings: number;
    awaitingResponse: number;
  };
}

export default function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Active Portfolio Listings',
      value: metrics.activeProperties,
      subtext: `${metrics.totalProperties} total records`,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Enquiries Captured',
      value: metrics.totalLeads,
      subtext: 'Verified CRM leads',
      icon: Users,
      color: 'text-gold-deep',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'New Unassigned Leads',
      value: metrics.newLeads,
      subtext: 'Requires advisor response',
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Site Viewings Scheduled',
      value: metrics.scheduledViewings,
      subtext: 'Walkthrough appointments',
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-canvas-grey shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-slate uppercase tracking-wider">
                {c.title}
              </span>
              <div className={`w-9 h-9 rounded-xl ${c.bgColor} ${c.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="font-serif text-3xl font-bold text-navy-midnight">
                {c.value}
              </div>
              <p className="text-xs text-text-muted mt-1">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
