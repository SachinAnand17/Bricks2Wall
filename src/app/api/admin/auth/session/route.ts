import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = getAdminSession(request);

  if (!session.authenticated) {
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }

  return NextResponse.json({
    authenticated: true,
    user: session.user || 'Sachin',
    role: 'superadmin',
  });
}
