import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

function sanitizeText(input?: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // Strip HTML tags
    .trim()
    .slice(0, 1000); // Enforce max string length
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting by IP (Max 15 submissions per minute to prevent bot flooding)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateCheck = checkRateLimit(`lead-submit:${clientIp}`, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before submitting again.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Honeypot spam check: hidden field 'website_hp' must be empty
    if (body.website_hp) {
      return NextResponse.json({ success: true, message: 'Enquiry received' });
    }

    const {
      name,
      email,
      phone,
      enquiryType = 'general',
      propertyId,
      propertyTitle,
      preferredContactMethod = 'phone',
      preferredTime,
      viewingDate,
      viewingTimeSlot,
      message,
      source = 'website',
      consent,
    } = body;

    // Server-side validations
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid full name.' },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Normalizing phone number (allow Indian numbers with or without +91, min 10 digits)
    const cleanedPhone = phone ? phone.replace(/[\s\-\(\)]/g, '') : '';
    if (!cleanedPhone || cleanedPhone.length < 10 || !/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid 10-digit phone number.' },
        { status: 400 }
      );
    }

    if (consent === false) {
      return NextResponse.json(
        { success: false, error: 'Consent to contact is required to submit an inquiry.' },
        { status: 400 }
      );
    }

    // Persist sanitized lead
    const newLead = createLead({
      name: sanitizeText(name),
      email: email.trim().toLowerCase(),
      phone: cleanedPhone,
      enquiryType: sanitizeText(enquiryType) as any,
      propertyId: propertyId ? sanitizeText(propertyId) : undefined,
      propertyTitle: propertyTitle ? sanitizeText(propertyTitle) : undefined,
      preferredContactMethod: sanitizeText(preferredContactMethod) as any,
      preferredTime: preferredTime ? sanitizeText(preferredTime) : undefined,
      viewingDate: viewingDate ? sanitizeText(viewingDate) : undefined,
      viewingTimeSlot: viewingTimeSlot ? sanitizeText(viewingTimeSlot) : undefined,
      message: message ? sanitizeText(message) : undefined,
      source: (sanitizeText(source) as any) || 'website',
      consentGiven: true,
    });

    console.log(`[Notification Queue] Dispatched new lead alert for lead ID: ${newLead.id} (${newLead.name}) to sales team.`);

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      message: 'Your enquiry has been received successfully.',
    });
  } catch (err: any) {
    console.error('Error creating lead:', err);
    return NextResponse.json({ success: false, error: 'Failed to process enquiry' }, { status: 500 });
  }
}
