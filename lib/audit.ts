export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  USER_CREATED = 'USER_CREATED',
  MEMBER_UPDATED = 'MEMBER_UPDATED',
  ADMIN_ACTION = 'ADMIN_ACTION',
}

export interface AuditLog {
  action: AuditAction;
  userId?: string;
  email?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  success: boolean;
}

/**
 * Log an audit event
 */
export async function logAudit(log: AuditLog): Promise<void> {
  try {
    // For now, log to console in development
    // In production, store in database or external service
    console.log(`[AUDIT] ${log.action}`, {
      userId: log.userId,
      email: log.email,
      ipAddress: log.ipAddress,
      timestamp: new Date().toISOString(),
      success: log.success,
      details: log.details,
    });

    // Optional: Store in database if AuditLog model exists
    // await prisma.auditLog.create({
    //   data: {
    //     action: log.action,
    //     userId: log.userId,
    //     email: log.email,
    //     ipAddress: log.ipAddress,
    //     userAgent: log.userAgent,
    //     details: JSON.stringify(log.details || {}),
    //     success: log.success,
    //   },
    // });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

/**
 * Extract client IP from request headers
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  return forwarded?.split(',')[0].trim() || realIp || 'unknown';
}

/**
 * Extract user agent from request
 */
export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}
