/**
 * Resilient Rate Limiter & Circuit Breaker for Upstream Data Adapters
 * Complies with Phase 2 & Phase 9 Security and Reliability Directives.
 */

export interface CircuitBreakerState {
  failures: number;
  lastFailureTime: number;
  isOpen: boolean;
  cooldownMs: number;
}

export class AdapterCircuitBreaker {
  private state: CircuitBreakerState = {
    failures: 0,
    lastFailureTime: 0,
    isOpen: false,
    cooldownMs: 30000, // 30s cooldown after 3 consecutive failures
  };

  private maxFailures: number;

  constructor(maxFailures: number = 3, cooldownMs: number = 30000) {
    this.maxFailures = maxFailures;
    this.state.cooldownMs = cooldownMs;
  }

  public canExecute(): boolean {
    if (!this.state.isOpen) return true;
    const now = Date.now();
    if (now - this.state.lastFailureTime > this.state.cooldownMs) {
      // Half-open state
      this.state.isOpen = false;
      this.state.failures = 0;
      return true;
    }
    return false;
  }

  public recordSuccess(): void {
    this.state.failures = 0;
    this.state.isOpen = false;
  }

  public recordFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();
    if (this.state.failures >= this.maxFailures) {
      this.state.isOpen = true;
    }
  }

  public getState(): Readonly<CircuitBreakerState> {
    return { ...this.state };
  }
}

/**
 * Execute an async operation with exponential backoff and jitter
 */
export async function executeWithRetry<T>(
  fn: () => Promise<T>,
  retries: number = 2,
  baseDelayMs: number = 300
): Promise<T> {
  let attempt = 0;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const jitter = Math.random() * 100;
      const delay = Math.pow(2, attempt) * baseDelayMs + jitter;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Exhausted retry attempts');
}
