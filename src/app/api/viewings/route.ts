import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

function sanitizeText(input?: string): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, 1000);
}

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting by IP (Max 15 viewing requests per minute)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateCheck = checkRateLimit(`viewing-submit:${clientIp}`, 15, 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please wait a moment before booking another viewing.',
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    if (body.website_hp) {
      return NextResponse.json({ success: true, message: 'Viewing booked' });
    }

    const {
      propertyId,
      propertyTitle,
      visitorName,
      visitorPhone,
      visitorEmail,
      preferredDate,
      timeSlot,
      notes,
    } = body;

    if (!visitorName || typeof visitorName !== 'string' || visitorName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    const cleanedPhone = visitorPhone ? visitorPhone.replace(/[\s\-\(\)]/g, '') : '';
    if (!cleanedPhone || cleanedPhone.length < 10 || !/^\+?[0-9]{10,15}$/.test(cleanedPhone)) {
      return NextResponse.json({ success: false, error: 'Valid 10-digit phone number is required' }, { status: 400 });
    }

    if (!preferredDate) {
      return NextResponse.json({ success: false, error: 'Please select a preferred viewing date' }, { status: 400 });
    }

    const lead = createLead({
      name: sanitizeText(visitorName),
      email: visitorEmail ? visitorEmail.trim().toLowerCase() : 'viewing-request@bricks2wall.com',
      phone: cleanedPhone,
      enquiryType: 'viewing',
      propertyId: propertyId ? sanitizeText(propertyId) : undefined,
      propertyTitle: propertyTitle ? sanitizeText(propertyTitle) : undefined,
      viewingDate: sanitizeText(preferredDate),
      viewingTimeSlot: timeSlot ? sanitizeText(timeSlot) : '11:00 AM',
      message: notes ? sanitizeText(notes) : undefined,
      source: 'book_visit',
      consentGiven: true,
    });

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      message: 'Viewing appointment requested successfully. Our advisory team will confirm the schedule shortly.',
    });
  } catch (err: any) {
    console.error('Error creating viewing:', err);
    return NextResponse.json({ success: false, error: 'Failed to request viewing' }, { status: 500 });
  }
}
