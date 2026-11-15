import crypto from 'crypto';

// 256-bit encryption key derived from environment or secure deterministic salt
const ENCRYPTION_SECRET =
  process.env.DATABASE_ENCRYPTION_KEY ||
  process.env.SESSION_SECRET ||
  'b2w-database-aes-256-gcm-master-key-salt-9911899110';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 12 bytes recommended for GCM
const AUTH_TAG_LENGTH = 16; // 16 bytes auth tag

// Derive a 32-byte key using SHA-256
function getDerivedKey(): Buffer {
  return crypto.createHash('sha256').update(ENCRYPTION_SECRET).digest();
}

/**
 * Encrypts a plaintext string using AES-256-GCM authenticated encryption.
 * Output format: base64url(iv:authTag:encryptedData)
 */
export function encryptData(plaintext: string): string {
  if (!plaintext) return '';

  const key = getDerivedKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  const combined = `${iv.toString('hex')}:${authTag}:${encrypted}`;
  return Buffer.from(combined).toString('base64url');
}

/**
 * Decrypts an AES-256-GCM encrypted string.
 * Returns decrypted plaintext, or original string if not in encrypted format.
 */
export function decryptData(ciphertext: string): string {
  if (!ciphertext) return '';

  try {
    const raw = Buffer.from(ciphertext, 'base64url').toString('utf-8');
    const parts = raw.split(':');
    if (parts.length !== 3) {
      // Not encrypted with this scheme, return original safely
      return ciphertext;
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getDerivedKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
      authTagLength: AUTH_TAG_LENGTH,
    });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    // Return original string if decryption fails or was not encrypted
    return ciphertext;
  }
}
