import { NextRequest, NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/db';
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
    const metrics = getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    console.error('Error fetching admin metrics:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
