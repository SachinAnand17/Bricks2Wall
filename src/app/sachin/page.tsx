'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MetricsCards from '@/components/admin/MetricsCards';
import PropertyTable from '@/components/admin/PropertyTable';
import LeadInbox from '@/components/admin/LeadInbox';
import ContentEditor from '@/components/admin/ContentEditor';
import RolesMatrix from '@/components/admin/RolesMatrix';
import BlogPublisher from '@/components/admin/BlogPublisher';
import { Property, Lead, ContentSettings } from '@/types';
import { Lock, LogOut, RefreshCw, KeyRound, CheckCircle2, ShieldCheck, User, Menu, LayoutDashboard, Building2, Users, FileText, Shield, BookOpen } from 'lucide-react';
import MandalaArt from '@/components/decorative/MandalaArt';

export default function SachinControlPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userIdInput, setUserIdInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Check persistent server-authenticated session via secure HTTP-only cookie
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/admin/auth/session');
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsAuthenticated(true);
          loadData();
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Metrics
      const mRes = await fetch('/api/admin/dashboard');
      if (mRes.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      const mData = await mRes.json();
      if (mData.success) setMetrics(mData.metrics);

      // 2. Properties (Fetch live from /api/properties with fallback to /api/admin/properties)
      try {
        const pRes = await fetch('/api/properties');
        const pData = await pRes.json();
        if (pData.success && Array.isArray(pData.properties)) {
          setProperties(pData.properties);
        } else {
          const fallbackRes = await fetch('/api/admin/properties');
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success) setProperties(fallbackData.properties);
        }
      } catch (pErr) {
        const fallbackRes = await fetch('/api/admin/properties');
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) setProperties(fallbackData.properties);
      }

      // 3. Leads
      const lRes = await fetch('/api/admin/leads');
      const lData = await lRes.json();
      if (lData.success) setLeads(lData.leads);

      // 4. Content
      const cRes = await fetch('/api/admin/content');
      const cData = await cRes.json();
      if (cData.success) setSettings(cData.settings);
    } catch (err) {
      console.error('Error loading control panel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: userIdInput,
          password: passwordInput,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
        loadData();
      } else {
        setLoginError(data.error || 'Invalid User ID or Password. Access denied.');
      }
    } catch (err) {
      setLoginError('Authentication service error. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsAuthenticated(false);
      setUserIdInput('');
      setPasswordInput('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B1827] via-[#10243A] to-[#0A1624] flex items-center justify-center p-3 sm:p-6 relative overflow-hidden text-white w-full">
        {/* Ambient Decorative Rotating Mandalas */}
        <div className="absolute -top-32 -right-32 pointer-events-none opacity-20">
          <MandalaArt seed="auth-top" size={480} variant="gold" spin={true} spinDuration={120} />
        </div>
        <div className="absolute -bottom-32 -left-32 pointer-events-none opacity-20">
          <MandalaArt seed="auth-bottom" size={480} variant="gold" spin={true} spinDuration={120} />
        </div>

        <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl border border-gold-champagne/40 text-navy-midnight">
          <div className="flex flex-col items-center text-center space-y-3 mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-navy-midnight flex items-center justify-center text-gold-champagne shadow-luxury relative">
              <MandalaArt seed="auth-icon" size={54} variant="gold" spin={true} spinDuration={40} className="absolute inset-0 opacity-40" />
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 text-gold-champagne" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-gold-deep font-bold">
                Secured Command Hub
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-navy-midnight">
                Bricks2Wall Portal
              </h1>
              <p className="text-xs text-text-slate mt-1">
                Authorized Personnel Access Only
              </p>
            </div>
          </div>

          {loginError && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs text-center font-medium">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-slate block">
                User ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter User ID"
                  value={userIdInput}
                  onChange={(e) => setUserIdInput(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-base sm:text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-medium"
                />
                <User className="w-4 h-4 text-text-slate absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-slate block">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-base sm:text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne font-medium"
                />
                <Lock className="w-4 h-4 text-text-slate absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-navy-midnight text-white text-xs font-semibold tracking-wider uppercase hover:bg-gold-deep hover:text-navy-deep transition-all duration-300 shadow-luxury flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-gold-champagne" />
              <span>Unlock Control Panel</span>
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-5 border-t border-canvas-grey text-center">
            <p className="text-[11px] text-text-muted">
              Bricks2Wall Real Estate Advisory • Internal Management System
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-ivory/50 flex flex-col lg:flex-row w-full overflow-x-hidden">
      {/* Sidebar Navigation (Desktop Persistent + Mobile Drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        leadsCount={leads.filter((l) => l.status === 'New').length}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 w-full">

        {/* Top Sticky Header */}
        <header className="h-16 bg-white border-b border-canvas-grey px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Mobile Hamburger to toggle drawer */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-navy-midnight hover:text-gold-deep hover:bg-canvas-ivory rounded-xl transition-colors shrink-0"
              aria-label="Open Admin Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <h2 className="font-serif text-sm sm:text-base lg:text-lg font-semibold text-navy-midnight capitalize truncate">
              {activeTab === 'dashboard' && 'Executive Metrics'}
              {activeTab === 'properties' && 'Property Inventory'}
              {activeTab === 'leads' && 'Lead CRM'}
              {activeTab === 'content' && 'Content Customizer'}
              {activeTab === 'roles' && 'Roles & Access'}
            </h2>

            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live • Sachin</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 text-text-slate hover:text-navy-midnight rounded-lg hover:bg-canvas-ivory transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-gold-deep' : ''}`} />
            </button>

            <div className="h-4 w-[1px] bg-canvas-grey" />

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-navy-midnight text-gold-champagne text-xs font-serif font-bold flex items-center justify-center">
                S
              </div>
              <span className="text-xs font-semibold text-navy-midnight hidden sm:inline">
                Sachin
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="p-3 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto space-y-6 sm:space-y-8 pb-24 lg:pb-8">

          {/* TAB 1: METRICS DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              <MetricsCards metrics={metrics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Leads Preview */}
                <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-canvas-grey">
                    <h3 className="font-serif text-base font-semibold text-navy-midnight">
                      Recent High-Intent Leads
                    </h3>
                    <button
                      onClick={() => setActiveTab('leads')}
                      className="text-xs text-gold-deep hover:underline font-semibold"
                    >
                      View All Leads →
                    </button>
                  </div>
                  <div className="space-y-3">
                    {(leads || []).slice(0, 4).map((l) => (
                      <div key={l.id} className="p-3 rounded-xl bg-canvas-ivory/50 border border-canvas-grey/60 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-navy-midnight">{l.name}</p>
                          <p className="text-text-slate text-[11px]">{l.phone} • {l.propertyTitle || 'General Enquiry'}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-canvas-grey">
                          {l.status}
                        </span>
                      </div>
                    ))}
                    {(!leads || leads.length === 0) && (
                      <p className="text-xs text-text-muted py-2">No leads received yet.</p>
                    )}
                  </div>
                </div>

                {/* Quick Content Shortcuts */}
                <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-canvas-grey">
                    <h3 className="font-serif text-base font-semibold text-navy-midnight">
                      Universal Content Customizer
                    </h3>
                    <button
                      onClick={() => setActiveTab('content')}
                      className="text-xs text-gold-deep hover:underline font-semibold"
                    >
                      Open Studio →
                    </button>
                  </div>
                  <p className="text-xs text-text-slate leading-relaxed">
                    Instantly customize every headline, banner ticker, why-us pillar, 4-step process, locality description, and footer disclaimer across the website without modifying code.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => setActiveTab('content')}
                      className="px-4 py-2.5 rounded-xl bg-navy-midnight text-white text-xs font-semibold hover:bg-gold-deep hover:text-navy-deep transition-all"
                    >
                      Launch Visual Customizer Studio
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY MANAGEMENT */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <PropertyTable properties={properties} onRefresh={loadData} />
            </div>
          )}

          {/* TAB: BLOG & INSIGHTS PUBLISHER */}
          {activeTab === 'blogs' && (
            <div className="space-y-6 animate-fade-in">
              <BlogPublisher onRefreshParent={loadData} />
            </div>
          )}

          {/* TAB 3: LEADS & CRM */}
          {activeTab === 'leads' && (
            <div className="space-y-6 animate-fade-in">
              <LeadInbox leads={leads} onRefresh={loadData} />
            </div>
          )}

          {/* TAB 4: UNIVERSAL CONTENT CUSTOMIZER STUDIO */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
              {settings ? (
                <ContentEditor initialSettings={settings} onSaved={loadData} onRefresh={loadData} />
              ) : (
                <div className="bg-white rounded-2xl p-12 border border-canvas-grey text-center space-y-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-gold-deep mx-auto" />
                  <p className="text-xs text-text-slate">Loading content customizer studio...</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ROLES & SECURITY */}
          {activeTab === 'roles' && (
            <div className="space-y-6 animate-fade-in">
              <RolesMatrix />
            </div>
          )}

        </main>

        {/* Mobile Fixed Bottom Navigation Bar (1-touch switching on phones) */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-navy-midnight text-white border-t border-white/10 px-2 py-2 flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[52px] cursor-pointer ${activeTab === 'dashboard' ? 'text-gold-champagne font-bold' : 'text-white/60 hover:text-white'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('properties')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[52px] cursor-pointer ${activeTab === 'properties' ? 'text-gold-champagne font-bold' : 'text-white/60 hover:text-white'
              }`}
          >
            <Building2 className="w-4 h-4" />
            <span className="text-[10px]">Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('leads')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[52px] relative cursor-pointer ${activeTab === 'leads' ? 'text-gold-champagne font-bold' : 'text-white/60 hover:text-white'
              }`}
          >
            <div className="relative">
              <Users className="w-4 h-4" />
              {leads.filter((l) => l.status === 'New').length > 0 && (
                <span className="absolute -top-1 -right-2 px-1 py-0.2 rounded-full bg-rose-500 text-white text-[8px] font-bold">
                  {leads.filter((l) => l.status === 'New').length}
                </span>
              )}
            </div>
            <span className="text-[10px]">Leads</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[52px] cursor-pointer ${activeTab === 'content' ? 'text-gold-champagne font-bold' : 'text-white/60 hover:text-white'
              }`}
          >
            <FileText className="w-4 h-4" />
            <span className="text-[10px]">Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-colors min-w-[52px] cursor-pointer ${activeTab === 'roles' ? 'text-gold-champagne font-bold' : 'text-white/60 hover:text-white'
              }`}
          >
            <Shield className="w-4 h-4" />
            <span className="text-[10px]">Roles</span>
          </button>
        </div>
      </div>
    </div>
  );
}
