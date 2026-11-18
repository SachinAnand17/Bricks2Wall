'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LayoutDashboard, Building2, Users, FileText, Shield, ExternalLink, X, BookOpen } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  leadsCount?: number;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  leadsCount = 0,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard & Metrics', icon: LayoutDashboard },
    { id: 'properties', label: 'Property Portfolio', icon: Building2 },
    { id: 'blogs', label: 'Blog & Insights', icon: BookOpen },
    { id: 'leads', label: 'Lead CRM & Inquiries', icon: Users },
    { id: 'content', label: 'Content & Announcement', icon: FileText },
    { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  ];

  const handleItemClick = (id: string) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <Link href="/" className="block group focus:outline-none">
            <div className="relative w-[180px] sm:w-[210px] h-[50px] sm:h-[60px] overflow-visible">
              <Image
                src="/brand/brand-logo-white.png"
                alt="Bricks2Wall Logo"
                fill
                priority
                className="object-contain object-left scale-[1.2] sm:scale-[1.25] origin-left transition-transform duration-300 group-hover:scale-[1.3]"
              />
            </div>
          </Link>

          {/* Close button for mobile drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-2 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5 text-gold-champagne" />
            </button>
          )}
        </div>

        <div className="px-6 py-2.5 flex items-center justify-between bg-white/5 border-b border-white/5">
          <span className="text-[10px] tracking-widest uppercase font-semibold text-gold-champagne">
            Advisory Admin
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/70 font-mono">
            v1.0
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 sm:p-4 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${isActive
                  ? 'bg-gold-champagne text-navy-deep shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-navy-deep' : 'text-gold-champagne'}`} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'leads' && leadsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {leadsCount}
                  </span>
                )}
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
    </>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 bg-navy-midnight text-white flex-col justify-between border-r border-white/10 shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <aside className="fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-navy-midnight text-white flex flex-col justify-between z-50 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
