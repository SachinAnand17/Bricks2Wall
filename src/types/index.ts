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
  // 1. Top Announcement Bar
  announcementActive: boolean;
  announcementText: string;
  announcementLinkText: string;
  announcementLinkHref: string;

  // 2. Navigation & Header
  headerPhone: string;
  headerCtaText: string;
  headerCtaHref: string;

  // 3. Hero Section
  heroEyebrow: string;
  heroHeadline: string;
  heroHeadlineHighlight: string;
  heroCopy: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  heroStat1Value: string;
  heroStat1Label: string;
  heroStat2Value: string;
  heroStat2Label: string;
  heroStat3Value: string;
  heroStat3Label: string;
  heroImageUrl: string;
  heroCardBadge: string;
  heroCardTitle: string;
  heroCardSubtitle: string;
  heroCardHref: string;
  heroBadgeTopTitle: string;
  heroBadgeTopSubtitle: string;

  // 4. Property Search Module
  searchTitle: string;
  searchSubtitle: string;
  searchButtonText: string;

  // 5. Featured Properties Section
  featuredEyebrow: string;
  featuredHeading: string;
  featuredCopy: string;
  featuredCtaText: string;

  // 6. Property Category Discovery Tiles
  categoriesEyebrow: string;
  categoriesHeading: string;
  categoriesCopy: string;
  category1Title: string;
  category1Subtitle: string;
  category1Badge: string;
  category1Image: string;
  category1Href: string;
  category2Title: string;
  category2Subtitle: string;
  category2Badge: string;
  category2Image: string;
  category2Href: string;
  category3Title: string;
  category3Subtitle: string;
  category3Badge: string;
  category3Image: string;
  category3Href: string;
  category4Title: string;
  category4Subtitle: string;
  category4Badge: string;
  category4Image: string;
  category4Href: string;

  // 7. Why Work With Us / The Bricks2Wall Standard
  whyEyebrow: string;
  whyHeading: string;
  whyCopy: string;
  whyStoryLinkText: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;

  // 8. Process Section (A Clearer Way to Move Forward)
  processEyebrow: string;
  processHeading: string;
  processCopy: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  step4Title: string;
  step4Desc: string;
  processCtaText: string;

  // 9. Locations Section
  locationsEyebrow: string;
  locationsHeading: string;
  locationsCopy: string;
  locationsLinkText: string;

  // 10. Trust & Regulatory Rigor Section
  trustEyebrow: string;
  trustHeading: string;
  trustCopy: string;
  trustPoint1Title: string;
  trustPoint1Desc: string;
  trustPoint2Title: string;
  trustPoint2Desc: string;
  trustPoint3Title: string;
  trustPoint3Desc: string;
  trustGuaranteeTitle: string;
  trustGuaranteeSubtitle: string;
  trustGuaranteePoint1: string;
  trustGuaranteePoint2: string;
  trustHotlineText: string;
  trustCtaText: string;

  // 11. Testimonials Section
  testimonialsEyebrow: string;
  testimonialsHeading: string;
  testimonialsCopy: string;

  // 12. Insights Section
  insightsEyebrow: string;
  insightsHeading: string;
  insightsCopy: string;
  insightsLinkText: string;

  // 13. Consultation / Lead Capture Section
  leadCtaEyebrow: string;
  leadCtaHeading: string;
  leadCtaCopy: string;
  leadFormTitle: string;
  leadFormSubtitle: string;
  leadSubmitButtonText: string;
  leadConsentText: string;

  // 14. Contact & Business Details
  phoneContact: string;
  whatsappContact: string;
  emailContact: string;
  officeAddress: string;
  businessHours: string;
  reraDisclaimerText: string;

  // 15. Footer Section
  footerBrandDescription: string;
  footerComplianceNotice: string;
  footerDemoNotice: string;
  footerCopyrightText: string;
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
