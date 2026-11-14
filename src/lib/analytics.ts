/**
 * Google Analytics 4 tracking helpers adhering to privacy rules
 * (Never sending PII like names, phone, email, or message contents).
 */

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === 'undefined') return;

  // Add event timestamp and unique ID
  const sanitizedParams = {
    ...params,
    event_timestamp: Date.now(),
    event_id: `evt-${Math.random().toString(36).substring(2, 9)}`,
  };

  // Strip any accidental PII keys
  const forbiddenKeys = ['name', 'phone', 'email', 'message', 'visitorName', 'visitorPhone', 'visitorEmail'];
  forbiddenKeys.forEach(k => {
    delete (sanitizedParams as any)[k];
  });

  if (window.gtag) {
    window.gtag('event', eventName, sanitizedParams);
  } else {
    // In dev or when GA4 ID is not yet connected, log to console for auditing
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 Event] ${eventName}`, sanitizedParams);
    }
  }
}

export const analytics = {
  pageView: (path: string, title?: string) => {
    trackEvent('page_view', { page_path: path, page_title: title });
  },

  propertyListView: (category: string, count: number) => {
    trackEvent('view_item_list', { item_list_name: category, items_count: count });
  },

  viewProperty: (propertyId: string, title: string, price: number, locality: string) => {
    trackEvent('view_item', {
      item_id: propertyId,
      item_name: title,
      value: price,
      currency: 'INR',
      item_category: locality,
    });
  },

  search: (query: string, filterCount: number) => {
    trackEvent('search', { search_term: query, filters_applied: filterCount });
  },

  filterApply: (filterName: string, filterValue: string) => {
    trackEvent('filter_apply', { filter_type: filterName, filter_value: filterValue });
  },

  generateLead: (enquiryType: string, propertyId?: string) => {
    trackEvent('generate_lead', {
      lead_type: enquiryType,
      property_id: propertyId || 'general',
      currency: 'INR',
    });
  },

  viewingRequest: (propertyId: string, preferredTime: string) => {
    trackEvent('viewing_request', {
      property_id: propertyId,
      time_slot: preferredTime,
    });
  },

  clickToCall: (locationSource: string) => {
    trackEvent('click_to_call', { source_location: locationSource });
  },

  clickWhatsApp: (locationSource: string) => {
    trackEvent('click_whatsapp', { source_location: locationSource });
  },
};
