import { NextRequest, NextResponse } from 'next/server';
import { getContentSettings, updateContentSettings } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

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
    const settings = getContentSettings();
    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error('Error fetching content settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch content settings' }, { status: 500 });
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
    const updated = updateContentSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    console.error('Error updating content settings:', err);
    return NextResponse.json({ success: false, error: 'Failed to update content settings' }, { status: 500 });
  }
}
