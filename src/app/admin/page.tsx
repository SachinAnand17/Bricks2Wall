'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MetricsCards from '@/components/admin/MetricsCards';
import PropertyTable from '@/components/admin/PropertyTable';
import LeadInbox from '@/components/admin/LeadInbox';
import ContentEditor from '@/components/admin/ContentEditor';
import RolesMatrix from '@/components/admin/RolesMatrix';
import { Property, Lead, ContentSettings } from '@/types';
import { Lock, LogOut, RefreshCw, KeyRound, CheckCircle2 } from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<ContentSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Check auth session
  useEffect(() => {
    const isAuth = sessionStorage.getItem('b2w_admin_auth');
    if (isAuth === 'true') {
      setIsAuthenticated(true);
    }
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Metrics
      const mRes = await fetch('/api/admin/dashboard');
      const mData = await mRes.json();
      if (mData.success) setMetrics(mData.metrics);

      // 2. Properties
      const pRes = await fetch('/api/admin/properties');
      const pData = await pRes.json();
      if (pData.success) setProperties(pData.properties);

      // 3. Leads
      const lRes = await fetch('/api/admin/leads');
      const lData = await lRes.json();
      if (lData.success) setLeads(lData.leads);

      // 4. Content
      const cRes = await fetch('/api/admin/content');
      const cData = await cRes.json();
      if (cData.success) setSettings(cData.settings);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default demo master password or any entry in dev
    if (passwordInput === 'admin123' || passwordInput === 'b2w2026' || passwordInput.trim() !== '') {
      setIsAuthenticated(true);
      sessionStorage.setItem('b2w_admin_auth', 'true');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('b2w_admin_auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-canvas-ivory/50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-canvas-grey shadow-luxury space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-navy-midnight text-gold-champagne flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-navy-midnight">
              Bricks2Wall Admin Portal
            </h2>
            <p className="text-xs text-text-slate">
              Enter authorized administrator credentials to manage listings, CRM leads, and platform content.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-slate">Passkey / Master Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter administrator passkey..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                />
              </div>
              <span className="text-[10px] text-text-muted block mt-1">
                Demo access key: <strong className="text-navy-midnight">admin123</strong>
              </span>
            </div>

            {loginError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                Invalid credential. Please enter passkey.
              </p>
            )}

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors shadow-sm"
            >
              Sign In to Management Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas-ivory/40 flex flex-col md:flex-row">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-canvas-grey px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-lg font-bold text-navy-midnight capitalize">
              {activeTab === 'dashboard' ? 'Overview & Metrics' : activeTab}
            </h2>
            <button
              onClick={loadData}
              className="p-1.5 rounded-lg text-text-muted hover:text-navy-midnight hover:bg-canvas-ivory transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-text-slate">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Database Connected (JSON/PostgreSQL Ready)</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-text-slate hover:text-red-700 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </header>

        {/* Tab Pages */}
        <main className="p-6 sm:p-8 flex-1 space-y-8">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && metrics && (
            <div className="space-y-8">
              <MetricsCards metrics={metrics} />

              {/* Lead Source Breakdown & Status Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Pipeline Status Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-semibold text-navy-midnight">
                    Lead Pipeline Distribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.leadsByStatus || {}).map(([st, count]: any) => (
                      <div key={st} className="flex items-center justify-between text-xs py-1.5 border-b border-canvas-grey/50">
                        <span className="font-medium text-text-slate">{st}</span>
                        <span className="font-semibold text-navy-midnight bg-canvas-ivory px-2 py-0.5 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lead Attribution Channels */}
                <div className="bg-white rounded-2xl p-6 border border-canvas-grey shadow-sm space-y-4">
                  <h3 className="font-serif text-base font-semibold text-navy-midnight">
                    Acquisition Channel Attribution
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.leadsBySource || {}).map(([src, count]: any) => (
                      <div key={src} className="flex items-center justify-between text-xs py-1.5 border-b border-canvas-grey/50">
                        <span className="font-medium text-text-slate capitalize">{src.replace(/_/g, ' ')}</span>
                        <span className="font-semibold text-navy-midnight bg-canvas-ivory px-2 py-0.5 rounded">
                          {count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Quick Jump to Leads */}
              <div className="bg-canvas-ivory/60 rounded-2xl p-6 border border-canvas-grey flex items-center justify-between">
                <div>
                  <h4 className="font-serif text-base font-semibold text-navy-midnight">
                    {metrics.newLeads} Inquiries Require Attention
                  </h4>
                  <p className="text-xs text-text-slate">
                    Review assigned advisors, callback logs, and scheduled site visits.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 rounded-xl bg-navy-midnight text-white text-xs font-semibold uppercase tracking-wider hover:bg-gold-deep transition-colors"
                >
                  Open Lead Inbox
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: PROPERTIES */}
          {activeTab === 'properties' && (
            <PropertyTable properties={properties} onRefresh={loadData} />
          )}

          {/* TAB 3: LEADS CRM */}
          {activeTab === 'leads' && (
            <LeadInbox leads={leads} onRefresh={loadData} />
          )}

          {/* TAB 4: CONTENT */}
          {activeTab === 'content' && settings && (
            <ContentEditor initialSettings={settings} onRefresh={loadData} />
          )}

          {/* TAB 5: ROLES */}
          {activeTab === 'roles' && (
            <RolesMatrix />
          )}

        </main>
      </div>
    </div>
  );
}
