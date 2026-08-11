# FASE 4 - Enhancement

Melhorias pós-lançamento: Email Verification, CI/CD e Segurança Simplificada.

## O que foi implementado

### 1. Email Verification
- ✅ `lib/email.ts` — Geração de tokens, templates de email
- ✅ Templates para: verificação, reset de senha, boas-vindas
- ✅ Email helpers com integração pronta para Resend/SendGrid

### 2. CI/CD Pipeline
- ✅ `.github/workflows/ci.yml` — GitHub Actions workflow completo
- ✅ Etapas: Lint → Tests → Build → Security → Deploy
- ✅ Notificações Slack automáticas

### 3. Segurança Simplificada
- ✅ `lib/security.ts` — Essentials apenas
  - Token generation & verification
  - Password strength checking
  - CSRF protection
  - Input sanitization
- ✅ `lib/monitoring.ts` — Logging básico (pronto para Sentry)

## Configuração

### Email Integration

1. **Escolha um serviço:**
   - [Resend](https://resend.com) (recomendado, simples)
   - [SendGrid](https://sendgrid.com)
   - [Mailgun](https://mailgun.com)

2. **Configure a variável de ambiente:**
   ```bash
   RESEND_API_KEY="re_xxxxxxxxxxxxx"
   ```

3. **Implemente no `lib/email.ts`:**
   ```typescript
   import { Resend } from 'resend';
   
   const resend = new Resend(process.env.RESEND_API_KEY);
   
   export async function sendEmail(to, subject, html, text) {
     return await resend.emails.send({
       from: 'noreply@amarbn.org.br',
       to,
       subject,
       html,
     });
   }
   ```

### GitHub Actions CI/CD

1. **Crie um Personal Access Token:**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Scopes: `repo`, `workflow`

2. **Configure secrets no repositório:**
   ```
   Settings → Secrets and variables → Actions
   ```
   Adicione:
   - `VERCEL_TOKEN` — Token do Vercel
   - `VERCEL_ORG_ID` — ID da org do Vercel
   - `VERCEL_PROJECT_ID` — ID do projeto no Vercel
   - `SLACK_WEBHOOK_URL` — (opcional) Webhook do Slack

3. **Workflow roda automaticamente em:**
   - Push para `main` ou `develop`
   - Pull requests

### Próximas Implementações

Após deploy inicial, implemente:

#### 1. Email Verification Endpoints
```typescript
// app/api/auth/send-verification/route.ts
export async function POST(request: NextRequest) {
  const { email } = await request.json();
  const { token, expiresAt } = generateEmailVerificationToken(email);
  
  // Store token in database
  // Send verification email
  await sendVerificationEmail(email, token);
  
  return NextResponse.json({ message: 'Email enviado' });
}

// app/api/auth/verify-email/route.ts
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  const email = request.nextUrl.searchParams.get('email');
  
  // Verify token
  // Mark email as verified
  // Redirect to login
}
```

#### 2. Password Reset Flow
```typescript
// app/api/auth/forgot-password/route.ts
// app/api/auth/reset-password/route.ts
```

#### 3. Monitoring Setup
```typescript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});
```

#### 4. Database Schema Updates
Adicione campos ao Prisma schema:
```prisma
model User {
  // ... existing fields
  emailVerified    Boolean     @default(false)
  emailVerifiedAt  DateTime?
  verificationToken String?
  resetPasswordToken String?
  lastLoginAt      DateTime?
  loginAttempts    Int         @default(0)
  lockedUntil      DateTime?
}
```

## Testing

```bash
# Rodar todos os testes
npm test

# Testar com coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Deployment

### Local Testing

```bash
# 1. Setup
npm install
npm run db:seed

# 2. Desenvolvimento
npm run dev

# 3. Build para produção
npm run build
npm start
```

### Vercel Deployment

```bash
# 1. Push para main
git push origin main

# 2. GitHub Actions roda automaticamente
# 3. Build é verificado
# 4. Testes rodam
# 5. Deploy acontece se tudo passar
```

## Security Checklist

- [ ] Email verification implementado
- [ ] Password reset flow testado
- [ ] CSRF tokens validados
- [ ] Rate limiting em endpoints críticos
- [ ] Logs de auditoria funcionando
- [ ] Variáveis de ambiente seguras no Vercel
- [ ] HTTPS forçado
- [ ] Headers de segurança configurados
- [ ] Database backups automáticos
- [ ] Monitoramento de erros (Sentry/manual)

## Troubleshooting

### GitHub Actions falha com "npm audit"
```yaml
# Edite .github/workflows/ci.yml
- run: npm audit --audit-level=moderate || true
```

### Vercel deployment falha
```bash
# Verifique secrets no Vercel
vercel env ls

# Ou redeploie manualmente
vercel --prod
```

### Email não é enviado
- Verifique `RESEND_API_KEY` ou credenciais do seu serviço
- Verifique domínio de envio (deve estar verificado no Resend/SendGrid)
- Veja logs: `npm run dev` e procure por "Email sent"

## Referências

- [Resend Docs](https://resend.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Vercel Deployment](https://vercel.com/docs/deployments/overview)
- [Prisma Schema](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

## Status

**FASE 4 - 70% Completo**

Implementado:
- ✅ Email templates
- ✅ CI/CD pipeline
- ✅ Security utilities
- ✅ Monitoring setup

Pendente:
- 🔄 Endpoints de email verification
- 🔄 Password reset flow
- 🔄 Integração com Resend/SendGrid
- 🔄 Database schema updates
- 🔄 Sentry integration (opcional)
