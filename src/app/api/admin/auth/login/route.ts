import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminSessionToken, buildSessionCookie } from '@/lib/auth';
import { checkRateLimit, resetRateLimit } from '@/lib/rate-limiter';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // 1. Rate Limiting by IP (Max 5 failed attempts per 15 minutes)
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown-ip';

    const rateKey = `login-attempt:${clientIp}`;
    const rateCheck = checkRateLimit(rateKey, 5, 15 * 60 * 1000);

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please try again in ${rateCheck.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { username, password } = body;

    // 2. Validate Credentials Server-Side in Constant-Time
    const isValid = validateAdminCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid User ID or Password. Access denied.' },
        { status: 401 }
      );
    }

    // 3. Reset rate limiter on successful authentication
    resetRateLimit(rateKey);

    // 4. Generate signed session token and set HTTP-only cookie
    const token = createAdminSessionToken(username || 'Sachin');
    const cookieHeader = buildSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      user: username || 'Sachin',
      message: 'Authentication successful',
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (err) {
    console.error('Error during admin login:', err);
    return NextResponse.json(
      { success: false, error: 'Authentication service temporarily unavailable' },
      { status: 500 }
    );
  }
}
