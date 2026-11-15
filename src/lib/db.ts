import fs from 'fs';
import path from 'path';
import { 
  Property, 
  Lead, 
  ViewingAppointment, 
  Agent, 
  LocationGuide, 
  InsightArticle, 
  Testimonial, 
  ContentSettings, 
  FilterState, 
  LeadStatus,
  LeadActivity
} from '../types';
import { 
  INITIAL_PROPERTIES, 
  INITIAL_AGENTS, 
  INITIAL_LOCATIONS, 
  INITIAL_ARTICLES, 
  INITIAL_TESTIMONIALS, 
  INITIAL_CONTENT_SETTINGS, 
  INITIAL_LEADS 
} from './seed-data';

interface DatabaseSchema {
  properties: Property[];
  leads: Lead[];
  viewings: ViewingAppointment[];
  agents: Agent[];
  locations: LocationGuide[];
  articles: InsightArticle[];
  testimonials: Testimonial[];
  contentSettings: ContentSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'database.json');

function ensureDatabase(): DatabaseSchema {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: DatabaseSchema = {
      properties: INITIAL_PROPERTIES,
      leads: INITIAL_LEADS,
      viewings: [
        {
          id: 'view-1',
          leadId: 'lead-1',
          propertyId: 'prop-1',
          propertyTitle: 'DEMO — Contemporary 2-Bed Residence',
          visitorName: 'Aravind Swaminathan',
          visitorPhone: '+91 98111 22334',
          visitorEmail: 'aravind.s@example.com',
          preferredDate: '2026-11-20',
          timeSlot: '11:00 AM',
          status: 'confirmed',
          assignedAgentName: 'Vikramaditya Sengupta',
          notes: 'Spouse accompanying. Needs floor plan and basement parking confirmation.',
          createdAt: '2026-11-13T10:15:00Z'
        }
      ],
      agents: INITIAL_AGENTS,
      locations: INITIAL_LOCATIONS,
      articles: INITIAL_ARTICLES,
      testimonials: INITIAL_TESTIMONIALS,
      contentSettings: INITIAL_CONTENT_SETTINGS,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    parsed.contentSettings = {
      ...INITIAL_CONTENT_SETTINGS,
      ...(parsed.contentSettings || {}),
    };
    return parsed;
  } catch (err) {
    console.error('Error reading database file, resetting to fallback:', err);
    return {
      properties: INITIAL_PROPERTIES,
      leads: INITIAL_LEADS,
      viewings: [],
      agents: INITIAL_AGENTS,
      locations: INITIAL_LOCATIONS,
      articles: INITIAL_ARTICLES,
      testimonials: INITIAL_TESTIMONIALS,
      contentSettings: INITIAL_CONTENT_SETTINGS,
    };
  }
}

function saveDatabase(data: DatabaseSchema): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ---------------- PROPERTIES ---------------- //

export function getProperties(filters?: FilterState): Property[] {
  const db = ensureDatabase();
  let list = [...db.properties];

  if (!filters) return list;

  if (filters.transactionType && filters.transactionType !== 'all') {
    list = list.filter(p => p.transactionType === filters.transactionType);
  }

  if (filters.propertyType && filters.propertyType !== 'all') {
    list = list.filter(p => p.propertyType.toLowerCase() === filters.propertyType?.toLowerCase());
  }

  if (filters.locality && filters.locality !== 'all') {
    const loc = filters.locality.toLowerCase();
    list = list.filter(p => 
      p.locality.toLowerCase().includes(loc) || 
      p.city.toLowerCase().includes(loc)
    );
  }

  if (filters.minPrice !== undefined && filters.minPrice > 0) {
    list = list.filter(p => p.price >= (filters.minPrice ?? 0));
  }

  if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
    list = list.filter(p => p.price <= (filters.maxPrice ?? Infinity));
  }

  if (filters.bedrooms && filters.bedrooms !== 'all') {
    const beds = parseInt(filters.bedrooms, 10);
    if (!isNaN(beds)) {
      list = list.filter(p => p.bedrooms === beds);
    }
  }

  if (filters.furnishing && filters.furnishing !== 'all') {
    list = list.filter(p => p.furnishingStatus?.toLowerCase() === filters.furnishing?.toLowerCase());
  }

  if (filters.possession && filters.possession !== 'all') {
    list = list.filter(p => p.possessionStatus?.toLowerCase() === filters.possession?.toLowerCase());
  }

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(p => 
      p.title.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q) ||
      p.propertyType.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sorting
  if (filters.sortBy === 'price_asc') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'price_desc') {
    list.sort((a, b) => b.price - a.price);
  } else if (filters.sortBy === 'featured') {
    list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  } else {
    // Default newest
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  return list;
}

export function getPropertyBySlug(slug: string): Property | undefined {
  const db = ensureDatabase();
  return db.properties.find(p => p.slug === slug);
}

export function getPropertyById(id: string): Property | undefined {
  const db = ensureDatabase();
  return db.properties.find(p => p.id === id);
}

export function createProperty(data: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>): Property {
  const db = ensureDatabase();
  const now = new Date().toISOString();
  const newProperty: Property = {
    ...data,
    id: `prop-${Date.now()}`,
    createdAt: now,
    updatedAt: now,
  };
  db.properties.unshift(newProperty);
  saveDatabase(db);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const db = ensureDatabase();
  const index = db.properties.findIndex(p => p.id === id);
  if (index === -1) return null;

  db.properties[index] = {
    ...db.properties[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  return db.properties[index];
}

export function deleteProperty(id: string): boolean {
  const db = ensureDatabase();
  const prevLen = db.properties.length;
  db.properties = db.properties.filter(p => p.id !== id);
  if (db.properties.length !== prevLen) {
    saveDatabase(db);
    return true;
  }
  return false;
}

// ---------------- LEADS ---------------- //

export function getLeads(statusFilter?: string, query?: string): Lead[] {
  const db = ensureDatabase();
  let list = [...db.leads];

  if (statusFilter && statusFilter !== 'all') {
    list = list.filter(l => l.status === statusFilter);
  }

  if (query) {
    const q = query.toLowerCase().trim();
    list = list.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q) ||
      (l.propertyTitle && l.propertyTitle.toLowerCase().includes(q))
    );
  }

  // Sort by newest
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getLeadById(id: string): Lead | undefined {
  const db = ensureDatabase();
  return db.leads.find(l => l.id === id);
}

export function createLead(data: {
  name: string;
  email: string;
  phone: string;
  enquiryType: Lead['enquiryType'];
  propertyId?: string;
  propertyTitle?: string;
  preferredContactMethod?: 'phone' | 'email' | 'whatsapp';
  preferredTime?: string;
  viewingDate?: string;
  viewingTimeSlot?: string;
  message?: string;
  source?: Lead['source'];
  consentGiven: boolean;
}): Lead {
  const db = ensureDatabase();
  const now = new Date().toISOString();
  const leadId = `lead-${Date.now()}`;

  const initialNote: LeadActivity = {
    id: `act-${Date.now()}`,
    leadId,
    type: 'status_change',
    author: 'System',
    description: `New ${data.enquiryType} enquiry received from ${data.source || 'website'}`,
    timestamp: now,
  };

  const newLead: Lead = {
    id: leadId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    enquiryType: data.enquiryType,
    propertyId: data.propertyId,
    propertyTitle: data.propertyTitle,
    status: 'New',
    preferredContactMethod: data.preferredContactMethod || 'phone',
    preferredTime: data.preferredTime,
    viewingDate: data.viewingDate,
    viewingTimeSlot: data.viewingTimeSlot,
    message: data.message,
    source: data.source || 'direct',
    consentGiven: data.consentGiven,
    notes: [initialNote],
    createdAt: now,
    updatedAt: now,
  };

  db.leads.unshift(newLead);

  // If this was a viewing request, also create a viewing appointment entry
  if (data.enquiryType === 'viewing' && data.propertyId && data.viewingDate) {
    const viewing: ViewingAppointment = {
      id: `view-${Date.now()}`,
      leadId: newLead.id,
      propertyId: data.propertyId,
      propertyTitle: data.propertyTitle || 'Property Viewing',
      visitorName: data.name,
      visitorPhone: data.phone,
      visitorEmail: data.email,
      preferredDate: data.viewingDate,
      timeSlot: data.viewingTimeSlot || '11:00 AM',
      status: 'pending',
      notes: data.message,
      createdAt: now,
    };
    db.viewings.unshift(viewing);
  }

  saveDatabase(db);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus, author: string = 'Admin'): Lead | null {
  const db = ensureDatabase();
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return null;

  const now = new Date().toISOString();
  const oldStatus = lead.status;
  lead.status = status;
  lead.updatedAt = now;

  lead.notes.unshift({
    id: `act-${Date.now()}`,
    leadId: lead.id,
    type: 'status_change',
    author,
    description: `Status updated from "${oldStatus}" to "${status}"`,
    timestamp: now,
  });

  saveDatabase(db);
  return lead;
}

export function assignLead(id: string, agentId: string, author: string = 'Admin'): Lead | null {
  const db = ensureDatabase();
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return null;

  const agent = db.agents.find(a => a.id === agentId);
  const now = new Date().toISOString();
  lead.assignedToAgentId = agentId;
  lead.status = lead.status === 'New' ? 'Assigned' : lead.status;
  lead.updatedAt = now;

  lead.notes.unshift({
    id: `act-${Date.now()}`,
    leadId: lead.id,
    type: 'note',
    author,
    description: `Assigned to ${agent ? agent.name : agentId}`,
    timestamp: now,
  });

  saveDatabase(db);
  return lead;
}

export function addLeadNote(id: string, author: string, description: string, type: LeadActivity['type'] = 'note'): Lead | null {
  const db = ensureDatabase();
  const lead = db.leads.find(l => l.id === id);
  if (!lead) return null;

  const now = new Date().toISOString();
  lead.notes.unshift({
    id: `act-${Date.now()}`,
    leadId: lead.id,
    type,
    author,
    description,
    timestamp: now,
  });
  lead.updatedAt = now;

  saveDatabase(db);
  return lead;
}

// ---------------- VIEWINGS ---------------- //

export function getViewings(): ViewingAppointment[] {
  const db = ensureDatabase();
  return db.viewings;
}

export function updateViewingStatus(id: string, status: ViewingAppointment['status']): ViewingAppointment | null {
  const db = ensureDatabase();
  const view = db.viewings.find(v => v.id === id);
  if (!view) return null;

  view.status = status;
  saveDatabase(db);
  return view;
}

// ---------------- AGENTS, LOCATIONS, ARTICLES, CONTENT ---------------- //

export function getAgents(): Agent[] {
  const db = ensureDatabase();
  return db.agents;
}

export function getAgentBySlug(slug: string): Agent | undefined {
  const db = ensureDatabase();
  return db.agents.find(a => a.slug === slug);
}

export function getLocations(): LocationGuide[] {
  const db = ensureDatabase();
  return db.locations;
}

export function getLocationBySlug(slug: string): LocationGuide | undefined {
  const db = ensureDatabase();
  return db.locations.find(l => l.slug === slug);
}

export function getArticles(): InsightArticle[] {
  const db = ensureDatabase();
  return db.articles;
}

export function getArticleBySlug(slug: string): InsightArticle | undefined {
  const db = ensureDatabase();
  return db.articles.find(a => a.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  const db = ensureDatabase();
  return db.testimonials.filter(t => t.published);
}

export function getContentSettings(): ContentSettings {
  const db = ensureDatabase();
  return db.contentSettings;
}

export function updateContentSettings(updates: Partial<ContentSettings>): ContentSettings {
  const db = ensureDatabase();
  db.contentSettings = {
    ...db.contentSettings,
    ...updates,
  };
  saveDatabase(db);
  return db.contentSettings;
}

// ---------------- DASHBOARD METRICS ---------------- //

export function getDashboardMetrics() {
  const db = ensureDatabase();
  
  const totalProperties = db.properties.length;
  const activeProperties = db.properties.filter(p => p.status === 'active').length;
  const totalLeads = db.leads.length;
  const newLeads = db.leads.filter(l => l.status === 'New').length;
  const scheduledViewings = db.viewings.filter(v => v.status === 'confirmed' || v.status === 'pending').length;
  const awaitingResponse = db.leads.filter(l => l.status === 'New' || l.status === 'Assigned').length;

  const leadsByStatus: Record<string, number> = {};
  db.leads.forEach(l => {
    leadsByStatus[l.status] = (leadsByStatus[l.status] || 0) + 1;
  });

  const leadsBySource: Record<string, number> = {};
  db.leads.forEach(l => {
    leadsBySource[l.source] = (leadsBySource[l.source] || 0) + 1;
  });

  return {
    totalProperties,
    activeProperties,
    totalLeads,
    newLeads,
    scheduledViewings,
    awaitingResponse,
    leadsByStatus,
    leadsBySource,
    recentLeads: db.leads.slice(0, 5),
    upcomingViewings: db.viewings.slice(0, 5),
  };
}
