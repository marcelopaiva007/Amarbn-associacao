import { z } from 'zod';

export const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });
export function initials(name: string) { return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

// Zod Schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

// Rate limiting store
const rateLimitStore = new Map<string, Array<number>>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const attempts = rateLimitStore.get(key) || [];

  // Clean old attempts outside the window
  const validAttempts = attempts.filter(timestamp => now - timestamp < windowMs);

  if (validAttempts.length >= maxAttempts) {
    return false;
  }

  validAttempts.push(now);
  rateLimitStore.set(key, validAttempts);
  return true;
}

export function getRateLimitRemaining(key: string, maxAttempts: number): number {
  const attempts = rateLimitStore.get(key) || [];
  return Math.max(0, maxAttempts - attempts.length);
}

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    formatted[path] = issue.message;
  }
  return formatted;
}
