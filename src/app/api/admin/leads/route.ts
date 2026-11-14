import { NextRequest, NextResponse } from 'next/server';
import { getLeads, updateLeadStatus, assignLead, addLeadNote } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const query = searchParams.get('q') || undefined;

    const leads = getLeads(status, query);
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, status, agentId, note, author = 'Admin' } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    let updatedLead = null;

    if (status) {
      updatedLead = updateLeadStatus(leadId, status, author);
    }

    if (agentId) {
      updatedLead = assignLead(leadId, agentId, author);
    }

    if (note) {
      updatedLead = addLeadNote(leadId, author, note);
    }

    if (!updatedLead) {
      return NextResponse.json({ success: false, error: 'Lead not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updatedLead });
  } catch (err: any) {
    console.error('Error updating lead:', err);
    return NextResponse.json({ success: false, error: 'Failed to update lead' }, { status: 500 });
  }
}
