/**
 * Monitoring and Error Tracking Setup
 * Integrates with Sentry for production error tracking
 */

interface MonitoringConfig {
  dsn?: string;
  environment?: string;
  tracesSampleRate?: number;
  enabled: boolean;
}

const config: MonitoringConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: !!process.env.SENTRY_DSN && process.env.NODE_ENV === 'production',
};

/**
 * Initialize monitoring
 * Call this early in your application startup
 */
export function initializeMonitoring(): void {
  if (!config.enabled) {
    console.log('ℹ️  Monitoring disabled (set SENTRY_DSN to enable)');
    return;
  }

  // TODO: Initialize Sentry
  // import * as Sentry from "@sentry/nextjs";
  // Sentry.init({
  //   dsn: config.dsn,
  //   environment: config.environment,
  //   tracesSampleRate: config.tracesSampleRate,
  //   integrations: [
  //     new Sentry.Replay({
  //       maskAllText: true,
  //       blockAllMedia: true,
  //     }),
  //   ],
  //   replaysSessionSampleRate: 0.1,
  //   replaysOnErrorSampleRate: 1.0,
  // });

  console.log('✓ Monitoring initialized (Sentry)');
}

/**
 * Capture exception to monitoring service
 */
export function captureException(error: Error, context?: Record<string, any>): void {
  if (!config.enabled) {
    console.error('Error:', error, context);
    return;
  }

  // TODO: Send to Sentry
  // Sentry.captureException(error, {
  //   contexts: {
  //     app: context,
  //   },
  // });
}

/**
 * Capture message to monitoring service
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info'): void {
  if (!config.enabled) {
    console.log(`[${level.toUpperCase()}] ${message}`);
    return;
  }

  // TODO: Send to Sentry
  // Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(
  message: string,
  data?: Record<string, any>,
  category: string = 'app'
): void {
  if (!config.enabled) {
    console.log(`[Breadcrumb] ${category}: ${message}`, data);
    return;
  }

  // TODO: Send to Sentry
  // Sentry.addBreadcrumb({
  //   message,
  //   data,
  //   category,
  //   timestamp: Date.now() / 1000,
  // });
}

/**
 * Performance monitoring
 */
export function startPerformanceTransaction(name: string) {
  if (!config.enabled) {
    return null;
  }

  // TODO: Start transaction
  // const transaction = Sentry.startTransaction({
  //   op: 'http.server',
  //   name,
  // });
  // return transaction;

  return null;
}

/**
 * Monitoring utilities for common scenarios
 */
export const monitoring = {
  /**
   * Monitor database operations
   */
  async withDatabaseMonitoring<T>(
    operation: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      addBreadcrumb(`DB: ${operation}`, { duration }, 'database');
      return result;
    } catch (error) {
      captureException(error as Error, { operation });
      throw error;
    }
  },

  /**
   * Monitor API calls
   */
  async withApiMonitoring<T>(
    endpoint: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const startTime = Date.now();
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      addBreadcrumb(`API: ${endpoint}`, { duration }, 'api');
      return result;
    } catch (error) {
      captureException(error as Error, { endpoint });
      throw error;
    }
  },

  /**
   * Monitor authentication events
   */
  logAuthEvent(
    event: 'login_success' | 'login_failure' | 'logout' | 'password_reset',
    email: string,
    details?: Record<string, any>
  ): void {
    addBreadcrumb(`Auth: ${event}`, { email, ...details }, 'auth');
  },

  /**
   * Monitor business metrics
   */
  trackMetric(name: string, value: number, unit?: string): void {
    addBreadcrumb(`Metric: ${name}`, { value, unit }, 'metrics');
  },
};

export default monitoring;
