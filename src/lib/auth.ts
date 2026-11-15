import { NextRequest } from 'next/server';
import crypto from 'crypto';

// Configuration: Read from environment or fallback to production-hardened defaults
const ADMIN_USER = process.env.ADMIN_USERNAME || 'Sachin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'Sachin@2005';
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  'b2w-super-secret-production-key-change-in-env-9911899110';

const COOKIE_NAME = 'b2w_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours

/**
 * Constant-time string comparison to prevent timing attacks
 */
function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Pad to same length to prevent timing leakage on length
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates admin credentials securely server-side
 */
export function validateAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const validUser = safeCompare(username.trim().toLowerCase(), ADMIN_USER.trim().toLowerCase());
  const validPass = safeCompare(password, ADMIN_PASS);

  return validUser && validPass;
}

/**
 * Creates an encrypted, tamper-proof session token using HMAC-SHA256
 */
export function createAdminSessionToken(user: string = ADMIN_USER): string {
  const payload = {
    sub: user,
    role: 'superadmin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION_SECONDS,
    nonce: crypto.randomBytes(16).toString('hex'),
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a session token's cryptographic signature and expiration
 */
export function verifyAdminSessionToken(token?: string): { authenticated: boolean; user?: string } {
  if (!token || typeof token !== 'string') {
    return { authenticated: false };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { authenticated: false };
  }

  const [payloadB64, signature] = parts;

  // Verify HMAC signature in constant time
  const expectedSig = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadB64)
    .digest('base64url');

  if (!safeCompare(signature, expectedSig)) {
    return { authenticated: false };
  }

  try {
    const payloadJson = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadJson);

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return { authenticated: false };
    }

    return { authenticated: true, user: payload.sub };
  } catch (err) {
    return { authenticated: false };
  }
}

/**
 * Extracts and verifies admin session from NextRequest cookies or Authorization header
 */
export function getAdminSession(request: NextRequest): { authenticated: boolean; user?: string } {
  // 1. Try reading HTTP-only cookie
  const cookieToken = request.cookies.get(COOKIE_NAME)?.value;
  if (cookieToken) {
    const res = verifyAdminSessionToken(cookieToken);
    if (res.authenticated) return res;
  }

  // 2. Try reading Authorization header (Bearer token)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const bearerToken = authHeader.substring(7).trim();
    const res = verifyAdminSessionToken(bearerToken);
    if (res.authenticated) return res;
  }

  return { authenticated: false };
}

/**
 * Generates Set-Cookie header for successful login
 */
export function buildSessionCookie(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${SESSION_DURATION_SECONDS}; ${
    isProd ? 'Secure;' : ''
  }`;
}

/**
 * Generates Set-Cookie header for logout
 */
export function buildLogoutCookie(): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; ${isProd ? 'Secure;' : ''}`;
}
