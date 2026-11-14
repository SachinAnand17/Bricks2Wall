'use client';

import React, { useState } from 'react';
import { 
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
  Plus
} from 'lucide-react';
import { Lead, LeadStatus } from '@/types';
import { formatDateTime } from '@/lib/utils';

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
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(leads[0] || null);
  const [noteText, setNoteText] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);

  const filteredLeads = leads.filter((lead) => {
    const matchesTab = activeTab === 'all' || lead.status === activeTab;
    const matchesSearch =
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
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

  return (
    <div className="bg-white rounded-2xl border border-canvas-grey shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
      
      {/* Left Column: Lead List & Status Tabs */}
      <div className="lg:col-span-5 border-r border-canvas-grey flex flex-col">
        {/* Header & Search */}
        <div className="p-4 border-b border-canvas-grey space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-base font-semibold text-navy-midnight">
              Enquiries Inbox ({leads.length})
            </h3>
            <span className="text-[10px] text-text-muted">Live Pipeline</span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by visitor, email, property..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
            />
          </div>

          {/* Status Tabs Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                activeTab === 'all'
                  ? 'bg-navy-midnight text-white font-semibold'
                  : 'bg-canvas-ivory text-text-slate hover:text-navy-midnight'
              }`}
            >
              All ({leads.length})
            </button>
            {STATUSES.slice(0, 5).map((st) => (
              <button
                key={st}
                onClick={() => setActiveTab(st)}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  activeTab === st
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
            <div className="p-8 text-center text-xs text-text-muted">
              No leads match this filter.
            </div>
          ) : (
            filteredLeads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              return (
                <div
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-canvas-ivory/90 border-l-4 border-l-gold-deep' : 'hover:bg-canvas-ivory/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-xs text-navy-midnight truncate">
                      {lead.name}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${
                      lead.status === 'New'
                        ? 'bg-rose-100 text-rose-800'
                        : lead.status === 'Viewing scheduled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-canvas-grey text-text-ink'
                    }`}>
                      {lead.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-text-slate truncate mt-0.5">
                    {lead.propertyTitle || 'General Advisory Enquiry'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-text-muted mt-2">
                    <span>{lead.phone}</span>
                    <span>{formatDateTime(lead.createdAt).split(',')[0]}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Lead Detail & CRM Activity Tracker */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6">
        {selectedLead ? (
          <div className="space-y-6">
            
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

              {/* Status Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-text-slate">Status:</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as any)}
                  className="h-9 px-2 text-xs bg-canvas-ivory border border-canvas-grey rounded-lg font-semibold text-navy-midnight"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
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
                <div>
                  <span className="text-[10px] text-text-muted block">Email</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-navy-midnight hover:underline truncate block max-w-[130px]">
                    {selectedLead.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-gold-champagne shrink-0" />
                <div>
                  <span className="text-[10px] text-text-muted block">Assigned Advisor</span>
                  <select
                    value={selectedLead.assignedToAgentId || ''}
                    onChange={(e) => handleAssignAgent(selectedLead.id, e.target.value)}
                    className="text-xs bg-transparent border-0 font-semibold text-navy-midnight p-0 focus:ring-0 cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    <option value="agent-1">Vikramaditya Sengupta</option>
                    <option value="agent-2">Ananya Deshmukh</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Enquiry Specifics */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-slate">
                Property & Notes
              </h4>
              <div className="p-4 rounded-xl border border-canvas-grey bg-white space-y-2 text-xs">
                {selectedLead.propertyTitle && (
                  <p>
                    <strong className="text-navy-midnight">Target Property:</strong> {selectedLead.propertyTitle}
                  </p>
                )}
                {selectedLead.viewingDate && (
                  <p>
                    <strong className="text-emerald-700">Requested Site Visit:</strong> {selectedLead.viewingDate} at {selectedLead.viewingTimeSlot}
                  </p>
                )}
                {selectedLead.message && (
                  <p className="text-text-slate italic">
                    "{selectedLead.message}"
                  </p>
                )}
              </div>
            </div>

            {/* Activity History & Add Note */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-text-slate">
                Activity & Notes History
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedLead.notes && selectedLead.notes.map((note) => (
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
                ))}
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Log call attempt, meeting note, or next follow-up..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs bg-canvas-ivory/60 border border-canvas-grey rounded-xl focus:outline-none focus:border-gold-champagne"
                />
                <button
                  type="submit"
                  disabled={submittingNote || !noteText.trim()}
                  className="px-4 h-9 bg-navy-midnight text-white text-xs font-semibold rounded-xl hover:bg-gold-deep transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3 text-gold-champagne" />
                  <span>Log Note</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-xs text-text-muted">
            Select an enquiry to view customer details and manage follow-ups.
          </div>
        )}
      </div>

    </div>
  );
}
