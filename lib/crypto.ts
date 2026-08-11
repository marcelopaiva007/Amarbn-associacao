import CryptoJS from 'crypto-js';

const ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'default-secret-change-in-production';

/**
 * Encrypt sensitive data (CPF, phone, etc.) using AES-256
 */
export function encryptData(plaintext: string): string {
  if (!plaintext) return '';
  return CryptoJS.AES.encrypt(plaintext, ENCRYPTION_SECRET).toString();
}

/**
 * Decrypt sensitive data
 */
export function decryptData(ciphertext: string): string {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_SECRET);
    return bytes.toString(CryptoJS.enc.Utf8);
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
  return CryptoJS.SHA256(value + ENCRYPTION_SECRET).toString();
}

/**
 * Verify hashed sensitive data
 */
export function verifySensitiveDataHash(value: string, hash: string): boolean {
  return hashSensitiveData(value) === hash;
}
