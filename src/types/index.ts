export type TransactionType = 'buy' | 'rent' | 'commercial';

export type PropertyType = 
  | 'Apartment' 
  | 'Penthouse' 
  | 'Villa' 
  | 'Office Suite' 
  | 'Retail Frontage' 
  | 'Plot' 
  | 'Commercial Floor';

export type PropertyStatus = 'active' | 'under_offer' | 'reserved' | 'sold' | 'draft' | 'archived';

export interface PropertyMedia {
  id: string;
  url: string;
  caption?: string;
  altText: string;
  isPrimary: boolean;
  order: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number; // in INR
  priceDisplay: string; // e.g. "₹85,00,000" or "₹38,000 / month"
  contactForPrice?: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  isDemo: boolean; // Marks clearly that this is a sample/demo record
  status: PropertyStatus;
  
  // Location
  city: string;
  locality: string;
  subLocality?: string;
  addressSummary: string; // privacy-conscious locality address
  coordinates?: {
    lat: number;
    lng: number;
  };

  // Specifications
  builtUpAreaSqFt: number;
  carpetAreaSqFt?: number;
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  parkingSpaces?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  possessionStatus?: 'Ready to Move' | 'Under Construction' | 'Immediate';
  possessionDate?: string;
  facing?: 'North' | 'East' | 'North-East' | 'South' | 'West';
  floorNumber?: string;
  totalFloors?: number;

  // Commercial specific
  suitableFor?: string[];
  maintenanceCharges?: string;

  // Content
  description: string;
  highlights: string[];
  amenities: string[];
  media: PropertyMedia[];
  
  // Legal & RERA
  reraRegistrationNumber?: string;
  reraApproved?: boolean;
  projectDeveloper?: string;
  
  // Timestamps & Meta
  createdAt: string;
  updatedAt: string;
  availabilityConfirmedAt: string;
  assignedAgentId?: string;
}

export type LeadStatus = 
  | 'New' 
  | 'Assigned' 
  | 'Contacted' 
  | 'Qualified' 
  | 'Viewing scheduled' 
  | 'Negotiation / follow-up' 
  | 'Converted' 
  | 'Closed / not interested' 
  | 'Spam / duplicate';

export type EnquiryType = 'property' | 'viewing' | 'callback' | 'general' | 'valuation';

export interface LeadActivity {
  id: string;
  leadId: string;
  type: 'status_change' | 'note' | 'call' | 'email' | 'whatsapp' | 'viewing_scheduled';
  author: string;
  description: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: EnquiryType;
  propertyId?: string;
  propertyTitle?: string;
  status: LeadStatus;
  preferredContactMethod?: 'phone' | 'email' | 'whatsapp';
  preferredTime?: string;
  viewingDate?: string;
  viewingTimeSlot?: string;
  message?: string;
  source: 'organic' | 'direct' | 'property_page' | 'hero_search' | 'contact_page' | 'book_visit';
  assignedToAgentId?: string;
  notes: LeadActivity[];
  consentGiven: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ViewingAppointment {
  id: string;
  leadId: string;
  propertyId: string;
  propertyTitle: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail: string;
  preferredDate: string;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  assignedAgentName?: string;
  notes?: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  slug: string;
  role: string;
  licenseNumber?: string;
  email: string;
  phone: string;
  whatsapp: string;
  photoUrl: string;
  bio: string;
  specializations: string[];
  languages: string[];
  activeListingsCount: number;
}

export interface LocationGuide {
  id: string;
  slug: string;
  name: string;
  city: string;
  tagline: string;
  overview: string;
  keyConnectivity: string[];
  lifestyleAmenities: string[];
  averagePricePerSqFt: string;
  heroImageUrl: string;
  featuredPropertyCount: number;
}

export interface InsightArticle {
  id: string;
  slug: string;
  title: string;
  category: 'Buying Guide' | 'Market Trends' | 'Documentation' | 'Investment';
  readTime: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  heroImageUrl: string;
  authorName: string;
  authorRole: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  transactionType: string;
  propertyReference: string;
  quote: string;
  rating: number;
  isVerified: boolean;
  published: boolean;
}

export interface ContentSettings {
  announcementText: string;
  announcementActive: boolean;
  heroEyebrow: string;
  heroHeadline: string;
  heroCopy: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  phoneContact: string;
  whatsappContact: string;
  emailContact: string;
  officeAddress: string;
  businessHours: string;
  reraDisclaimerText: string;
}

export interface FilterState {
  transactionType?: TransactionType | 'all';
  propertyType?: string;
  locality?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: string;
  furnishing?: string;
  possession?: string;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
  searchQuery?: string;
}
