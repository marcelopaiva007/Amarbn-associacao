import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword, createSessionToken, createSessionCookie } from '@/lib/auth';
import { LoginSchema, formatZodErrors, checkRateLimit, getRateLimitRemaining } from '@/lib/utils';
import { getUserByEmail, prisma } from '@/lib/db';
import { logAudit, AuditAction, getClientIp, getUserAgent } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting by IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitKey = `login-${ip}`;

    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      await logAudit({
        action: AuditAction.LOGIN_FAILURE,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
        details: { reason: 'rate_limit_exceeded' },
        success: false,
      });

      return NextResponse.json(
        {
          error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = LoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: formatZodErrors(parsed.error),
          remaining: getRateLimitRemaining(rateLimitKey, 5),
        },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await getUserByEmail(email);

    if (!user) {
      await logAudit({
        action: AuditAction.LOGIN_FAILURE,
        email,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
        details: { reason: 'user_not_found' },
        success: false,
      });

      return NextResponse.json(
        {
          error: 'Email ou senha incorretos',
          remaining: getRateLimitRemaining(rateLimitKey, 5),
        },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);

    if (!isPasswordValid) {
      await logAudit({
        action: AuditAction.LOGIN_FAILURE,
        email,
        userId: user.id,
        ipAddress: getClientIp(request),
        userAgent: getUserAgent(request),
        details: { reason: 'invalid_password' },
        success: false,
      });

      return NextResponse.json(
        {
          error: 'Email ou senha incorretos',
          remaining: getRateLimitRemaining(rateLimitKey, 5),
        },
        { status: 401 }
      );
    }

    // Create session token
    const token = createSessionToken(user.id, user.email, user.role);

    // Log successful login
    await logAudit({
      action: AuditAction.LOGIN_SUCCESS,
      userId: user.id,
      email: user.email,
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
      success: true,
    });

    // Create response
    const response = NextResponse.json(
      {
        message: 'Login bem-sucedido',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 200 }
    );

    // Set session cookie
    response.headers.set('Set-Cookie', createSessionCookie(token));

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Erro ao fazer login. Tente novamente.' },
      { status: 500 }
    );
  }
}
