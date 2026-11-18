import { NextRequest, NextResponse } from 'next/server';
import { getLeads, updateLeadStatus, assignLead, addLeadNote, deleteLead, clearAllLeads } from '@/lib/db';
import { getDb } from '@/lib/mongodb';
import { getAdminSession } from '@/lib/auth';
import { Lead } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // 1. Enforce Admin Authentication
  const session = getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const query = searchParams.get('q') || undefined;

    // 1. Try fetching from live MongoDB Atlas
    try {
      const db = await getDb();
      let mongoFilter: any = {};
      if (status && status !== 'all') {
        mongoFilter.status = status;
      }

      let mongoLeads = await db
        .collection('leads')
        .find(mongoFilter)
        .sort({ createdAt: -1 })
        .toArray();

      if (mongoLeads.length > 0) {
        let list = mongoLeads.map((doc: any) => {
          const { _id, ...rest } = doc;
          return { ...rest, id: rest.id || _id.toString() } as Lead;
        });

        if (query) {
          const q = query.toLowerCase().trim();
          list = list.filter(
            (l) =>
              (l.name && l.name.toLowerCase().includes(q)) ||
              (l.email && l.email.toLowerCase().includes(q)) ||
              (l.phone && l.phone.includes(q)) ||
              (l.propertyTitle && l.propertyTitle.toLowerCase().includes(q))
          );
        }

        return NextResponse.json({
          success: true,
          count: list.length,
          leads: list,
          source: 'mongodb',
        });
      }
    } catch (mongoErr: any) {
      console.warn('MongoDB query warning in admin/leads GET, using local store:', mongoErr.message);
    }

    // 2. Fallback to local store
    const leads = getLeads(status, query);
    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
      source: 'local',
    });
  } catch (err: any) {
    console.error('Error fetching leads:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  // 1. Enforce Admin Authentication
  const session = getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { leadId, status, agentId, note, author = session.user || 'Admin' } = body;

    if (!leadId) {
      return NextResponse.json({ success: false, error: 'Lead ID is required' }, { status: 400 });
    }

    let updatedLead = null;

    if (status) {
      updatedLead = updateLeadStatus(leadId, status, author);
      try {
        const db = await getDb();
        await db.collection('leads').updateOne(
          { $or: [{ id: leadId }, { _id: leadId as any }] },
          { $set: { status, updatedAt: new Date() } }
        );
      } catch (e: any) {
        console.warn('MongoDB update status warning:', e.message);
      }
    }

    if (agentId !== undefined) {
      updatedLead = assignLead(leadId, agentId, author);
      try {
        const db = await getDb();
        await db.collection('leads').updateOne(
          { $or: [{ id: leadId }, { _id: leadId as any }] },
          { $set: { assignedToAgentId: agentId, updatedAt: new Date() } }
        );
      } catch (e: any) {
        console.warn('MongoDB assign agent warning:', e.message);
      }
    }

    if (note) {
      updatedLead = addLeadNote(leadId, author, note);
      try {
        const db = await getDb();
        await db.collection('leads').updateOne(
          { $or: [{ id: leadId }, { _id: leadId as any }] },
          {
            $push: {
              notes: {
                id: `act-${Date.now()}`,
                leadId,
                type: 'note',
                author,
                description: note,
                timestamp: new Date().toISOString(),
              },
            } as any,
            $set: { updatedAt: new Date() },
          }
        );
      } catch (e: any) {
        console.warn('MongoDB add note warning:', e.message);
      }
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

export async function DELETE(request: NextRequest) {
  // 1. Enforce Admin Authentication
  const session = getAdminSession(request);
  if (!session.authenticated) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Admin authentication required.' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const action = searchParams.get('action');

    // Purge all dummy/test leads
    if (action === 'clear_all' || action === 'purge_dummy') {
      clearAllLeads();
      try {
        const db = await getDb();
        await db.collection('leads').deleteMany({});
        await db.collection('viewings').deleteMany({});
      } catch (e: any) {
        console.warn('MongoDB clear leads warning:', e.message);
      }
      return NextResponse.json({
        success: true,
        message: 'All dummy and existing leads cleared from CRM.',
      });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID or action is required' }, { status: 400 });
    }

    deleteLead(id);

    try {
      const db = await getDb();
      await db.collection('leads').deleteOne({ $or: [{ id }, { _id: id as any }] });
      await db.collection('viewings').deleteOne({ leadId: id });
    } catch (e: any) {
      console.warn('MongoDB delete lead warning:', e.message);
    }

    return NextResponse.json({ success: true, message: 'Lead deleted successfully' });
  } catch (err: any) {
    console.error('Error deleting lead:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
  }
}
