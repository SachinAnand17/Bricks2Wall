'use client';

import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Search,
  Filter,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  CheckCircle2,
  Clock,
  UserCheck,
  Send,
  Plus,
  Trash2,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';
import GlassSelect from '@/components/ui/GlassSelect';

interface LeadInboxProps {
  leads: Lead[];
  onRefresh: () => void;
}

const STATUSES: LeadStatus[] = [
  'New',
  'Assigned',
  'Contacted',
  'Qualified',
  'Viewing scheduled',
  'Negotiation / follow-up',
  'Converted',
  'Closed / not interested',
  'Spam / duplicate',
];

export default function LeadInbox({ leads, onRefresh }: LeadInboxProps) {
  const safeLeads = leads || [];
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(safeLeads[0] || null);
  const [mobileView, setMobileView] = useState<'list' | 'detail'>('list');
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (safeLeads.length > 0) {
      if (!selectedLead || !safeLeads.some((l) => l.id === selectedLead.id)) {
        setSelectedLead(safeLeads[0]);
      } else {
        const updated = safeLeads.find((l) => l.id === selectedLead.id);
        if (updated) setSelectedLead(updated);
      }
    } else {
      setSelectedLead(null);
    }
  }, [leads]);

  const filteredLeads = safeLeads.filter((lead) => {
    const matchesTab = activeTab === 'all' || lead.status === activeTab;
    const matchesSearch =
      (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone || '').includes(searchTerm) ||
      (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (res.ok) {
        onRefresh();
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAssignAgent = async (leadId: string, agentId: string) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, agentId }),
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to assign agent:', err);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !noteText.trim()) return;

    setSubmittingNote(true);
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: selectedLead.id,
          note: noteText.trim(),
          author: 'Admin Principal',
        }),
      });

      if (res.ok) {
        setNoteText('');
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleDeleteLead = async (leadId: string, leadName: string) => {
    if (!confirm(`Are you sure you want to delete the enquiry for "${leadName}"?`)) return;

    setDeletingId(leadId);
    try {
      const res = await fetch(`/api/admin/leads?id=${encodeURIComponent(leadId)}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        if (selectedLead?.id === leadId) {
          setSelectedLead(null);
        }
        onRefresh();
      } else {
        alert('Failed to delete lead.');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
      alert('Network error while deleting enquiry.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAllLeads = async () => {
    if (!confirm('Are you sure you want to clear all test/dummy enquiries from the CRM? This will reset the pipeline.')) return;

    try {
      const res = await fetch('/api/admin/leads?action=clear_all', {
        method: 'DELETE',
      });
      if (res.ok) {
        setSelectedLead(null);
        onRefresh();
      } else {
        alert('Failed to clear leads.');
      }
    } catch (err) {
      console.error('Error clearing leads:', err);
      alert('Network error while clearing leads.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

      {/* Left Column: Lead List & Status Tabs */}
      <div className={`lg:col-span-5 border-r border-canvas-grey flex flex-col ${mobileView === 'detail' ? 'hidden lg:flex' : 'flex'}`}>
        {/* Header & Search */}
        <div className="p-4 border-b border-canvas-grey space-y-3 bg-canvas-ivory/30">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-base font-semibold text-navy-midnight flex items-center gap-2">
                <span>Enquiries Inbox</span>
                <span className="px-2 py-0.5 rounded-full bg-navy-midnight text-white text-[11px] font-sans font-bold">
                  {safeLeads.length}
                </span>
              </h3>
              <p className="text-[10px] text-text-muted">Live Pipeline • Synced to Database</p>
            </div>

            <div className="flex items-center gap-2">
              {safeLeads.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearAllLeads}
                  className="px-2 py-1 rounded-lg text-[10px] font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors"
                  title="Purge all dummy enquiries"
                >
                  Clear All
                </button>
              )}
              <button
                type="button"
                onClick={onRefresh}
                className="p-1.5 rounded-lg text-text-muted hover:text-navy-midnight hover:bg-canvas-grey/50 transition-colors"
                title="Refresh enquiries"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by visitor, email, property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 text-base sm:text-xs bg-white border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
            />
          </div>

          {/* Status Tabs Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${activeTab === 'all'
                  ? 'bg-navy-midnight text-white font-semibold'
                  : 'bg-canvas-ivory text-text-slate hover:text-navy-midnight'
                }`}
            >
              All ({safeLeads.length})
            </button>
            {STATUSES.slice(0, 5).map((st) => (
              <button
                key={st}
                onClick={() => setActiveTab(st)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${activeTab === st
                    ? 'bg-gold-deep text-white font-semibold'
                    : 'bg-canvas-ivory text-text-slate hover:text-navy-midnight'
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Lead List Cards */}
        <div className="flex-1 overflow-y-auto divide-y divide-canvas-grey/60 max-h-[550px]">
          {filteredLeads.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Users className="w-8 h-8 text-text-muted/50 mx-auto" />
              <p className="text-xs font-medium text-navy-midnight">
                {safeLeads.length === 0 ? 'No Enquiries in CRM' : 'No matching enquiries'}
              </p>
              <p className="text-[11px] text-text-muted max-w-xs mx-auto">
                {safeLeads.length === 0
                  ? 'All forms on the website (Book a Visit, Property Enquiries, Contact) are active and connected. Real submissions will appear here instantly.'
                  : 'Try adjusting your search keywords or filter status.'}
              </p>
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => {
                    setSelectedLead(lead);
                    setMobileView('detail');
                  }}
                  className={`p-4 cursor-pointer transition-colors relative group ${isSelected ? 'bg-canvas-ivory/90 border-l-4 border-l-gold-deep' : 'hover:bg-canvas-ivory/40'
                    }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-navy-midnight truncate flex-1">
                      {lead.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${lead.status === 'New'
                        ? 'bg-rose-100 text-rose-800'
                        : lead.status === 'Viewing scheduled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-canvas-grey text-text-ink'
                      }`}>
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-slate truncate mt-0.5">
                    {lead.propertyTitle || (lead.enquiryType === 'viewing' ? 'Site Walkthrough Request' : 'General Advisory Enquiry')}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-text-muted mt-2">
                    <span className="font-medium">{lead.phone}</span>
                    <span>{formatDateTime(lead.createdAt).split(',')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Lead Detail & CRM Activity Tracker */}
      <div className={`lg:col-span-7 flex flex-col justify-between p-4 sm:p-6 ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'}`}>
        {selectedLead ? (
          <div className="space-y-6">

            {/* Mobile Back Button */}
            <button
              type="button"
              onClick={() => setMobileView('list')}
              className="lg:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-navy-midnight mb-1 py-1.5 px-3 rounded-xl bg-canvas-ivory border border-canvas-grey w-fit active:bg-canvas-grey transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-gold-deep" />
              <span>← Back to Enquiries List</span>
            </button>

            {/* Header / Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-canvas-grey">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-deep">
                  Enquiry ID: {selectedLead.id}
                </span>
                <h3 className="font-serif text-xl font-bold text-navy-midnight">
                  {selectedLead.name}
                </h3>
                <p className="text-xs text-text-slate">
                  Captured via {selectedLead.source} • {formatDateTime(selectedLead.createdAt)}
                </p>
              </div>

              {/* Status Selector & Delete */}
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-slate">Status:</span>
                  <GlassSelect
                    value={selectedLead.status}
                    onChange={(val) => handleStatusChange(selectedLead.id, val as any)}
                    options={STATUSES.map((st) => ({ value: st, label: st }))}
                    size="sm"
                    className="w-44"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteLead(selectedLead.id, selectedLead.name)}
                  disabled={deletingId === selectedLead.id}
                  className="p-2 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 border border-rose-200 transition-colors"
                  title="Delete this enquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-canvas-ivory/60 rounded-xl border border-canvas-grey text-xs">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-champagne shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Phone</span>
                  <a href={`tel:${selectedLead.phone}`} className="font-semibold text-navy-midnight hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-champagne shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-text-muted block">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-navy-midnight hover:underline truncate block max-w-[150px]">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gold-champagne shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-text-muted block">Assigned Advisor</span>
                  <GlassSelect
                    value={selectedLead.assignedToAgentId || ''}
                    onChange={(val) => handleAssignAgent(selectedLead.id, val)}
                    options={[
                      { value: '', label: 'Unassigned' },
                      { value: 'agent-1', label: 'Vikramaditya Sengupta' },
                      { value: 'agent-2', label: 'Ananya Deshmukh' },
                    ]}
                    size="sm"
                    className="w-full mt-0.5"
                  />
                </div>
              </div>
            </div>

            {/* Enquiry Specifics */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-slate">
                Enquiry Details & Notes
              </h4>
              <div className="p-4 rounded-xl border border-canvas-grey bg-white space-y-2 text-xs">
                {selectedLead.propertyTitle && (
                  <p>
                    <strong className="text-navy-midnight">Target Property:</strong> {selectedLead.propertyTitle}
                  </p>
                )}
                {selectedLead.viewingDate && (
                  <p>
                    <strong className="text-emerald-700">Requested Site Visit:</strong> {selectedLead.viewingDate} at {selectedLead.viewingTimeSlot || '11:00 AM'}
                  </p>
                )}
                {selectedLead.preferredContactMethod && (
                  <p>
                    <strong className="text-text-slate">Preferred Mode:</strong> <span className="capitalize">{selectedLead.preferredContactMethod}</span>
                    {selectedLead.preferredTime && ` (${selectedLead.preferredTime})`}
                  </p>
                )}
                {selectedLead.message && (
                  <div className="pt-2 border-t border-canvas-grey/50">
                    <p className="text-navy-midnight font-medium whitespace-pre-line leading-relaxed">
                      {selectedLead.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity History & Add Note */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-slate">
                Activity & Follow-Up Log
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes && selectedLead.notes.length > 0 ? (
                  selectedLead.notes.map((note) => (
                    <div key={note.id} className="p-3 rounded-lg bg-canvas-ivory/50 border border-canvas-grey text-xs flex items-start gap-2.5">
                      <Clock className="w-3.5 h-3.5 text-gold-champagne shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-[10px] text-text-muted">
                          <span className="font-semibold text-navy-midnight">{note.author}</span>
                          <span>{formatDateTime(note.timestamp)}</span>
                        </div>
                        <p className="text-text-slate mt-0.5">{note.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-canvas-ivory/30 border border-canvas-grey text-[11px] text-text-muted italic">
                    No activity notes logged yet.
                  </div>
                )}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex flex-col sm:flex-row gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Log call attempt, client requirement, or next step..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 h-10 px-3.5 text-base sm:text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !noteText.trim()}
                  className="px-4 h-10 bg-navy-midnight text-white text-xs font-semibold rounded-xl hover:bg-gold-deep transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Send className="w-3 h-3 text-gold-champagne" />
                  <span>Log Note</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-canvas-ivory flex items-center justify-center text-gold-champagne border border-canvas-grey">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-sm font-semibold text-navy-midnight">
              {safeLeads.length === 0 ? 'CRM Pipeline Ready' : 'Select an Enquiry'}
            </h4>
            <p className="text-xs text-text-muted max-w-sm">
              {safeLeads.length === 0
                ? 'All dummy records have been cleared. Any enquiry submitted via the website forms will flow into this CRM workspace.'
                : 'Choose an enquiry from the list on the left to review contact details, schedule callbacks, and update advisory status.'}
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
