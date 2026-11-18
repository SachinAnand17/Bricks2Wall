import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';
import { getDb } from '@/lib/mongodb';
import { checkRateLimit } from '@/lib/rate-limiter';
import { Lead } from '@/types';

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
    // 1. Rate Limiting by IP (Max 30 submissions per minute to allow testing and high volume)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateCheck = checkRateLimit(`lead-submit:${clientIp}`, 30, 60 * 1000);
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
      requirement,
      budget,
      locality,
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

    // Format rich metadata into message so CRM advisors have full context
    const extraDetails: string[] = [];
    if (requirement) extraDetails.push(`Requirement: ${sanitizeText(requirement)}`);
    if (budget) extraDetails.push(`Budget: ${sanitizeText(budget)}`);
    if (locality) extraDetails.push(`Locality: ${sanitizeText(locality)}`);

    let finalMessage = sanitizeText(message);
    if (extraDetails.length > 0) {
      finalMessage = finalMessage
        ? `${extraDetails.join(' | ')}\n\nNotes: ${finalMessage}`
        : extraDetails.join(' | ');
    }

    // 1. Persist immediately to resilient local store (in-memory + database.json)
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
      message: finalMessage || undefined,
      source: (sanitizeText(source) as any) || 'website',
      consentGiven: true,
    });

    console.log(`[CRM Lead Pipeline] New lead registered locally: ID ${newLead.id} (${newLead.name})`);

    // 2. Non-blocking asynchronous sync to MongoDB Atlas
    getDb()
      .then(async (db) => {
        await db.collection('leads').insertOne({
          ...newLead,
          requirement: requirement ? sanitizeText(requirement) : undefined,
          budget: budget ? sanitizeText(budget) : undefined,
          locality: locality ? sanitizeText(locality) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`[CRM Lead Pipeline] Lead synced to MongoDB Atlas: ID ${newLead.id}`);
      })
      .catch((mongoErr: any) => {
        console.warn('[CRM Lead Pipeline] MongoDB Atlas async sync skipped (local store intact):', mongoErr?.message);
      });

    return NextResponse.json({
      success: true,
      leadId: newLead.id,
      message: 'Your enquiry has been received successfully. Our advisory team will review and contact you shortly.',
    });
  } catch (err: any) {
    console.error('Error creating lead in /api/leads:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to process enquiry' },
      { status: 500 }
    );
  }
}
