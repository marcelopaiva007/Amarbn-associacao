/**
 * Simplified Security Utilities
 * Focus on essentials only
 */

import crypto from 'crypto';

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash token (for storing references without exposing the actual token)
 */
export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Verify token against hash
 */
export function verifyTokenHash(token: string, hash: string): boolean {
  return hashToken(token) === hash;
}

/**
 * Check if email is verified
 */
export async function isEmailVerified(email: string): Promise<boolean> {
  // TODO: Check in database
  // const user = await prisma.user.findUnique({ where: { email } });
  // return user?.emailVerified || false;
  return false;
}

/**
 * Mark email as verified
 */
export async function markEmailAsVerified(email: string): Promise<void> {
  // TODO: Update database
  // await prisma.user.update({
  //   where: { email },
  //   data: { emailVerified: true },
  // });
}

/**
 * Check password strength
 */
export function isStrongPassword(password: string): {
  isStrong: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Deve conter letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Deve conter letra maiúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Deve conter número');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Deve conter caractere especial (!@#$%^&*)');
  }

  return {
    isStrong: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize user input (basic)
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove HTML brackets
    .substring(0, 500); // Limit length
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, storedToken: string): boolean {
  return token === storedToken;
}
