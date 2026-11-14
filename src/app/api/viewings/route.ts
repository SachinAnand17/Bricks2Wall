import { NextRequest, NextResponse } from 'next/server';
import { createLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

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

    if (!visitorName || visitorName.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    if (!visitorPhone || visitorPhone.replace(/\D/g, '').length < 10) {
      return NextResponse.json({ success: false, error: 'Valid 10-digit phone number is required' }, { status: 400 });
    }

    if (!preferredDate) {
      return NextResponse.json({ success: false, error: 'Please select a preferred viewing date' }, { status: 400 });
    }

    const lead = createLead({
      name: visitorName.trim(),
      email: visitorEmail?.trim() || 'viewing-request@bricks2wall.com',
      phone: visitorPhone.trim(),
      enquiryType: 'viewing',
      propertyId,
      propertyTitle,
      viewingDate: preferredDate,
      viewingTimeSlot: timeSlot || '11:00 AM',
      message: notes,
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
