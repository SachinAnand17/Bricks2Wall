import { NextResponse } from 'next/server';
import { getDashboardMetrics } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const metrics = getDashboardMetrics();
    return NextResponse.json({ success: true, metrics });
  } catch (err: any) {
    console.error('Error fetching admin metrics:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard metrics' }, { status: 500 });
  }
}
