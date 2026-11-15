/**
 * Structured Logging and Performance Monitoring Utility for NEXBUS
 * 
 * Complies with Phase 9 Production Reliability Directives:
 * - Structured JSON logging format with ISO timestamp
 * - Request duration tracking
 * - Safe sanitization preventing leak of sensitive credentials
 */

export interface LogPayload {
  level: 'info' | 'warn' | 'error' | 'audit';
  service: string;
  message: string;
  timestamp: string;
  durationMs?: number;
  metadata?: Record<string, unknown>;
}

export const logger = {
  info: (message: string, metadata?: Record<string, unknown>) => {
    log('info', message, metadata);
  },
  warn: (message: string, metadata?: Record<string, unknown>) => {
    log('warn', message, metadata);
  },
  error: (message: string, metadata?: Record<string, unknown>) => {
    log('error', message, metadata);
  },
  audit: (message: string, metadata?: Record<string, unknown>) => {
    log('audit', message, metadata);
  },
};

function log(level: LogPayload['level'], message: string, metadata?: Record<string, unknown>) {
  const payload: LogPayload = {
    level,
    service: 'nexbus',
    message,
    timestamp: new Date().toISOString(),
    metadata: sanitizeMetadata(metadata),
  };

  if (process.env.NODE_ENV === 'test') return;

  const serialized = JSON.stringify(payload);
  if (level === 'error') {
    console.error(serialized);
  } else if (level === 'warn') {
    console.warn(serialized);
  } else {
    console.log(serialized);
  }
}

function sanitizeMetadata(meta?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!meta) return undefined;
  const sanitized: Record<string, unknown> = {};

  for (const [key, val] of Object.entries(meta)) {
    // Redact any accidental tokens or auth keys
    if (/token|auth|key|secret|password|credential/i.test(key)) {
      sanitized[key] = '[REDACTED]';
    } else {
      sanitized[key] = val;
    }
  }

  return sanitized;
}
