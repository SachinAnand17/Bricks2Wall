import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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
    if (!cleanedPhone || cleanedPhone.length < 10) {
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

    // Persist lead first before any side-effects
    const newLead = createLead({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: cleanedPhone,
      enquiryType,
      propertyId,
      propertyTitle,
      preferredContactMethod,
      preferredTime,
      viewingDate,
      viewingTimeSlot,
      message: message?.trim(),
      source,
      consentGiven: true,
    });

    // Enqueue transactional notification (Simulated async queue / SES / SMS dispatcher)
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
