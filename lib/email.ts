import crypto from 'crypto';

export interface EmailVerificationToken {
  token: string;
  expiresAt: Date;
  email: string;
}

/**
 * Generate email verification token
 * Token expires in 24 hours
 */
export function generateEmailVerificationToken(email: string): EmailVerificationToken {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  return {
    token,
    expiresAt,
    email,
  };
}

/**
 * Generate password reset token
 * Token expires in 1 hour
 */
export function generatePasswordResetToken(email: string): EmailVerificationToken {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  return {
    token,
    expiresAt,
    email,
  };
}

/**
 * Verify token hasn't expired
 */
export function isTokenValid(expiresAt: Date): boolean {
  return expiresAt > new Date();
}

/**
 * Email templates
 */
export const emailTemplates = {
  verifyEmail: (token: string, email: string) => ({
    subject: 'Verifique seu email - AMARBN',
    html: `
      <h2>Bem-vindo à AMARBN!</h2>
      <p>Por favor, clique no link abaixo para verificar seu email:</p>
      <a href="${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}&email=${email}">
        Verificar Email
      </a>
      <p>Este link expira em 24 horas.</p>
      <hr>
      <p>Se você não solicitou este email, ignore-o.</p>
    `,
    text: `Verifique seu email clicando no link: ${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/verify-email?token=${token}&email=${email}`,
  }),

  passwordReset: (token: string, email: string) => ({
    subject: 'Redefinir sua senha - AMARBN',
    html: `
      <h2>Pedido de redefinição de senha</h2>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/reset-password?token=${token}&email=${email}">
        Redefinir Senha
      </a>
      <p>Este link expira em 1 hora.</p>
      <hr>
      <p>Se você não solicitou este email, ignore-o.</p>
    `,
    text: `Redefinir senha: ${process.env.VERCEL_URL || 'http://localhost:3000'}/api/auth/reset-password?token=${token}&email=${email}`,
  }),

  twoFactorCode: (code: string) => ({
    subject: 'Seu código de dois fatores - AMARBN',
    html: `
      <h2>Código de dois fatores</h2>
      <p>Seu código de dois fatores é:</p>
      <h3 style="font-family: monospace; letter-spacing: 0.5em;">${code}</h3>
      <p>Este código expira em 10 minutos.</p>
      <hr>
      <p>Se você não solicitou este código, ignore-o.</p>
    `,
    text: `Seu código de dois fatores é: ${code}`,
  }),

  welcomeEmail: (name: string) => ({
    subject: 'Bem-vindo à AMARBN!',
    html: `
      <h2>Bem-vindo, ${name}!</h2>
      <p>Sua conta na AMARBN foi criada com sucesso.</p>
      <p>Agora você pode acessar o portal como associado.</p>
      <a href="${process.env.VERCEL_URL || 'http://localhost:3000'}/login">
        Fazer Login
      </a>
      <hr>
      <p>Se tiver dúvidas, entre em contato conosco.</p>
    `,
    text: `Bem-vindo à AMARBN, ${name}!`,
  }),
};

/**
 * Send email (placeholder - integrate with SendGrid, Resend, or similar)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<void> {
  // TODO: Integrate with email service
  // For now, just log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`
      📧 Email sent to ${to}
      Subject: ${subject}
      ${html}
    `);
  }

  // Example integration with Resend:
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'noreply@amarbn.org.br',
  //   to,
  //   subject,
  //   html,
  //   text,
  // });
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const template = emailTemplates.verifyEmail(token, email);
  await sendEmail(email, template.subject, template.html, template.text);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const template = emailTemplates.passwordReset(token, email);
  await sendEmail(email, template.subject, template.html, template.text);
}

/**
 * Send 2FA code email
 */
export async function send2FACodeEmail(email: string, code: string): Promise<void> {
  const template = emailTemplates.twoFactorCode(code);
  await sendEmail(email, template.subject, template.html, template.text);
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  const template = emailTemplates.welcomeEmail(name);
  await sendEmail(email, template.subject, template.html, template.text);
}
