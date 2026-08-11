import crypto from 'crypto';

const ENCRYPTION_SECRET = (process.env.ENCRYPTION_SECRET || 'default-secret-change-in-production').slice(0, 32);

/**
 * Encrypt sensitive data (CPF, phone, etc.) using AES-256-CBC
 */
export function encryptData(plaintext: string): string {
  if (!plaintext) return '';
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET.padEnd(32, '0')), iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data
 */
export function decryptData(ciphertext: string): string {
  if (!ciphertext) return '';
  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 2) return '';
    const iv = Buffer.from(parts[0], 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_SECRET.padEnd(32, '0')), iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
}

/**
 * Hash sensitive data one-way (for searching without decryption)
 */
export function hashSensitiveData(value: string): string {
  if (!value) return '';
  return crypto.createHash('sha256').update(value + ENCRYPTION_SECRET).digest('hex');
}

/**
 * Verify hashed sensitive data
 */
export function verifySensitiveDataHash(value: string, hash: string): boolean {
  return hashSensitiveData(value) === hash;
}
