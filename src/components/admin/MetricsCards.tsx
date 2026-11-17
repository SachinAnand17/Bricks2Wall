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
  const safeMetrics = metrics || {
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeads: 0,
    scheduledViewings: 0,
    awaitingResponse: 0,
  };

  const cards = [
    {
      title: 'Active Portfolio Listings',
      value: safeMetrics.activeProperties ?? 0,
      subtext: `${safeMetrics.totalProperties ?? 0} total records`,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Enquiries Captured',
      value: safeMetrics.totalLeads ?? 0,
      subtext: 'Verified CRM leads',
      icon: Users,
      color: 'text-gold-deep',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'New Unassigned Leads',
      value: safeMetrics.newLeads ?? 0,
      subtext: 'Requires advisor response',
      icon: AlertCircle,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
    {
      title: 'Site Viewings Scheduled',
      value: safeMetrics.scheduledViewings ?? 0,
      subtext: 'Walkthrough appointments',
      icon: Calendar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-3.5 sm:p-5 border border-canvas-grey shadow-sm flex flex-col justify-between space-y-2 sm:space-y-3"
          >
            <div className="flex items-start sm:items-center justify-between gap-1">
              <span className="text-[10px] sm:text-xs font-semibold text-text-slate uppercase tracking-wider line-clamp-1">
                {c.title}
              </span>
              <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl ${c.bgColor} ${c.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>

            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-navy-midnight">
                {c.value}
              </div>
              <p className="text-[10px] sm:text-xs text-text-muted mt-0.5 sm:mt-1 truncate">{c.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
