import { z } from 'zod';

export const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const date = new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" });
export function initials(name: string) { return name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase(); }

// CPF (Brazilian taxpayer ID) validation
export function formatCPF(cpf: string): string {
  return cpf.replace(/\D/g, '');
}

export function isValidCPF(cpf: string): boolean {
  const digits = formatCPF(cpf);
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;

  const checkDigit = (length: number): number => {
    let sum = 0;
    for (let i = 0; i < length; i++) {
      sum += parseInt(digits[i], 10) * (length + 1 - i);
    }
    const result = 11 - (sum % 11);
    return result >= 10 ? 0 : result;
  };

  return checkDigit(9) === parseInt(digits[9], 10) && checkDigit(10) === parseInt(digits[10], 10);
}

// Zod Schemas
export const LoginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const RegisterSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter no mínimo 8 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório'),
  registration: z.string().min(1, 'Matrícula é obrigatória'),
  cpf: z.string().refine(isValidCPF, 'CPF inválido'),
  fullName: z.string().min(1, 'Nome completo é obrigatório'),
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
