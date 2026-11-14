'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, FileText, Settings, Shield, ExternalLink } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Portfolio', icon: Building2 },
    { id: 'leads', label: 'Lead CRM & Inquiries', icon: Users },
    { id: 'content', label: 'Content & Announcement', icon: FileText },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  return (
    <aside className="w-64 bg-navy-midnight text-white flex flex-col justify-between border-r border-white/10 shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="inline-block bg-white p-2 rounded-lg">
            <div className="relative w-[150px] h-[36px]">
              <Image
                src="/brand/brand-logo.jpg"
                alt="Bricks2Wall Logo"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-champagne">
              Advisory Admin
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70">
              v1.0
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  isActive
                    ? 'bg-gold-champagne text-navy-deep shadow-md'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-deep' : 'text-gold-champagne'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom User / Site Link */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs transition-colors"
        >
          <span>View Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-gold-champagne" />
        </Link>

        <div className="px-3 text-[11px] text-white/50 leading-tight">
          Logged in as <strong className="text-white">Admin Principal</strong>
          <br />Role: Super Administrator
        </div>
      </div>
    </aside>
  );
}
