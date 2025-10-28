// core/RemoteLogger.ts
// ================================================================================
// 🌐 Remote Logger - Production-Ready Remote Logging System
// Features: Circuit Breaker, Retry Logic, Compression, Health Monitoring
// ================================================================================

import { LogEntry, LogLevel } from "./config.ts";

// ================================================================================
// Types and Interfaces
// ================================================================================

export interface RemoteDestination {
  name: string;
  url: string;
  apiKey?: string;
  headers?: Record<string, string>;
  method?: "POST" | "PUT";
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface RemoteLoggerConfig {
  destinations: RemoteDestination[];
  minLevel?: LogLevel;
  batchSize?: number;
  maxBatchSize?: number;
  flushInterval?: number;
  maxRetries?: number;
  enableCompression?: boolean;
  enableCircuitBreaker?: boolean;
  circuitBreakerThreshold?: number;
  circuitBreakerTimeout?: number;
  onError?: (error: Error, destination: RemoteDestination) => void;
  onSuccess?: (destination: RemoteDestination, logCount: number) => void;
  transformPayload?: (logs: LogEntry[]) => any;
}

export interface LogBatch {
  logs: LogEntry[];
  timestamp: Date;
  attemptCount: number;
}

export interface CircuitBreakerState {
  failures: number;
  lastFailure?: Date;
  isOpen: boolean;
  nextRetry?: Date;
}

export interface DestinationHealth {
  name: string;
  isHealthy: boolean;
  lastSuccess?: Date;
  lastFailure?: Date;
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number;
  circuitBreakerState: CircuitBreakerState;
}

export interface RemoteLoggerStats {
  bufferSize: number;
  totalDestinations: number;
  healthyDestinations: number;
  unhealthyDestinations: number;
  openCircuitBreakers: number;
  totalRequestsAcrossDestinations: number;
  totalSuccessfulRequests: number;
  totalFailedRequests: number;
  averageLatencyAcrossDestinations: number;
}

// ================================================================================
// Remote Logger Class
// ================================================================================

export class RemoteLogger {
  private buffer: LogEntry[] = [];
  private flushTimer?: number;
  private circuitBreakers: Map<string, CircuitBreakerState> = new Map();
  private healthStats: Map<string, DestinationHealth> = new Map();
  private isShuttingDown = false;
  private pendingFlushes: Promise<void>[] = [];
  private latencyHistory: Map<string, number[]> = new Map();

  constructor(private config: RemoteLoggerConfig) {
    this.initializeDefaults();
    this.initializeDestinations();
    this.startPeriodicFlush();
  }

  // ================================================================================
  // Initialization
  // ================================================================================

  private initializeDefaults(): void {
    this.config.minLevel = this.config.minLevel || "info";
    this.config.batchSize = this.config.batchSize || 10;
    this.config.maxBatchSize = this.config.maxBatchSize || 100;
    this.config.flushInterval = this.config.flushInterval || 5000;
    this.config.maxRetries = this.config.maxRetries || 3;
    this.config.enableCompression = this.config.enableCompression ?? false;
    this.config.enableCircuitBreaker = this.config.enableCircuitBreaker ?? true;
    this.config.circuitBreakerThreshold = this.config.circuitBreakerThreshold || 5;
    this.config.circuitBreakerTimeout = this.config.circuitBreakerTimeout || 60000;
  }

  private initializeDestinations(): void {
    this.config.destinations.forEach((dest) => {
      this.healthStats.set(dest.name, {
        name: dest.name,
        isHealthy: true,
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageLatency: 0,
        circuitBreakerState: {
          failures: 0,
          isOpen: false,
        },
      });

      this.circuitBreakers.set(dest.name, {
        failures: 0,
        isOpen: false,
      });

      this.latencyHistory.set(dest.name, []);
    });
  }

  // ================================================================================
  // Public API
  // ================================================================================

  /**
   * Log an entry (add to buffer)
   */
  log(entry: LogEntry): void {
    if (this.isShuttingDown) {
      console.warn("[RemoteLogger] Shutting down, log entry ignored");
      return;
    }

    if (!this.shouldLog(entry.level)) {
      return;
    }

    this.buffer.push(entry);

    // Auto-flush if buffer reaches batch size
    if (this.buffer.length >= this.config.batchSize!) {
      this.flush().catch((err) => {
        console.error("[RemoteLogger] Auto-flush failed:", err);
      });
    }

    // Emergency flush if buffer is too large
    if (this.buffer.length >= this.config.maxBatchSize!) {
      console.warn("[RemoteLogger] Buffer overflow, forcing emergency flush");
      this.flush().catch((err) => {
        console.error("[RemoteLogger] Emergency flush failed:", err);
      });
    }
  }

  /**
   * Manually flush buffer to all destinations
   */
  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    // Get logs to send and clear buffer
    const logsToSend = [...this.buffer];
    this.buffer = [];

    // Create batch
    const batch: LogBatch = {
      logs: logsToSend,
      timestamp: new Date(),
      attemptCount: 0,
    };

    // Send to all destinations
    const promises = this.config.destinations.map((dest) => this.sendBatch(dest, batch));

    const flushPromise = Promise.allSettled(promises).then(() => {});
    this.pendingFlushes.push(flushPromise);

    // Clean up completed flushes
    flushPromise.finally(() => {
      const index = this.pendingFlushes.indexOf(flushPromise);
      if (index > -1) {
        this.pendingFlushes.splice(index, 1);
      }
    });

    await flushPromise;
  }

  /**
   * Get buffer size
   */
  getBufferSize(): number {
    return this.buffer.length;
  }

  /**
   * Clear buffer (discard all pending logs)
   */
  clearBuffer(): void {
    this.buffer = [];
  }

  /**
   * Get health status of all destinations
   */
  getHealth(): Map<string, DestinationHealth> {
    return new Map(this.healthStats);
  }

  /**
   * Get health status of a specific destination
   */
  getDestinationHealth(name: string): DestinationHealth | undefined {
    return this.healthStats.get(name);
  }

  /**
   * Get statistics
   */
  getStats(): RemoteLoggerStats {
    let totalRequests = 0;
    let totalSuccessful = 0;
    let totalFailed = 0;
    let totalLatency = 0;
    let healthyCount = 0;
    let unhealthyCount = 0;
    let openCircuits = 0;

    for (const health of this.healthStats.values()) {
      totalRequests += health.totalRequests;
      totalSuccessful += health.successfulRequests;
      totalFailed += health.failedRequests;
      totalLatency += health.averageLatency;

      if (health.isHealthy) healthyCount++;
      else unhealthyCount++;

      if (health.circuitBreakerState.isOpen) openCircuits++;
    }

    const destCount = this.healthStats.size;

    return {
      bufferSize: this.buffer.length,
      totalDestinations: destCount,
      healthyDestinations: healthyCount,
      unhealthyDestinations: unhealthyCount,
      openCircuitBreakers: openCircuits,
      totalRequestsAcrossDestinations: totalRequests,
      totalSuccessfulRequests: totalSuccessful,
      totalFailedRequests: totalFailed,
      averageLatencyAcrossDestinations: destCount > 0 ? totalLatency / destCount : 0,
    };
  }

  /**
   * Reset circuit breaker for a destination
   */
  resetCircuitBreaker(destinationName: string): void {
    const circuit = this.circuitBreakers.get(destinationName);
    if (circuit) {
      circuit.failures = 0;
      circuit.isOpen = false;
      circuit.nextRetry = undefined;
      circuit.lastFailure = undefined;
    }

    const health = this.healthStats.get(destinationName);
    if (health && circuit) {
      health.circuitBreakerState = circuit;
    }
  }

  /**
   * Reset all circuit breakers
   */
  resetAllCircuitBreakers(): void {
    for (const name of this.circuitBreakers.keys()) {
      this.resetCircuitBreaker(name);
    }
  }

  /**
   * Add a new destination dynamically
   */
  addDestination(destination: RemoteDestination): void {
    // Check if already exists
    if (this.config.destinations.some((d) => d.name === destination.name)) {
      throw new Error(`Destination ${destination.name} already exists`);
    }

    this.config.destinations.push(destination);

    // Initialize health tracking
    this.healthStats.set(destination.name, {
      name: destination.name,
      isHealthy: true,
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      circuitBreakerState: {
        failures: 0,
        isOpen: false,
      },
    });

    this.circuitBreakers.set(destination.name, {
      failures: 0,
      isOpen: false,
    });

    this.latencyHistory.set(destination.name, []);
  }

  /**
   * Remove a destination
   */
  removeDestination(name: string): void {
    this.config.destinations = this.config.destinations.filter(
      (dest) => dest.name !== name,
    );
    this.healthStats.delete(name);
    this.circuitBreakers.delete(name);
    this.latencyHistory.delete(name);
  }

  /**
   * Update destination configuration
   */
  updateDestination(name: string, updates: Partial<RemoteDestination>): void {
    const destination = this.config.destinations.find((d) => d.name === name);
    if (!destination) {
      throw new Error(`Destination ${name} not found`);
    }

    Object.assign(destination, updates);
  }

  /**
   * Test connection to a destination
   */
  async testConnection(destinationName: string): Promise<boolean> {
    const destination = this.config.destinations.find((d) => d.name === destinationName);
    if (!destination) {
      throw new Error(`Destination ${destinationName} not found`);
    }

    try {
      const testBatch: LogBatch = {
        logs: [{
          timestamp: new Date(),
          level: "info",
          message: "Connection test",
          metadata: { test: true },
        }],
        timestamp: new Date(),
        attemptCount: 0,
      };

      await this.sendBatch(destination, testBatch);
      return true;
    } catch (error) {
      console.error(`[RemoteLogger] Connection test failed for ${destinationName}:`, error);
      return false;
    }
  }

  /**
   * Test all destinations
   */
  async testAllConnections(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>();

    const promises = this.config.destinations.map(async (destination) => {
      const success = await this.testConnection(destination.name);
      results.set(destination.name, success);
    });

    await Promise.allSettled(promises);
    return results;
  }

  /**
   * Update configuration
   */
  updateConfig(updates: Partial<RemoteLoggerConfig>): void {
    this.config = { ...this.config, ...updates };

    // Restart flush timer if interval changed
    if (updates.flushInterval !== undefined) {
      this.stopPeriodicFlush();
      this.startPeriodicFlush();
    }
  }

  /**
   * Gracefully shutdown logger
   */
  async shutdown(): Promise<void> {
    console.log("[RemoteLogger] Initiating shutdown...");
    this.isShuttingDown = true;
    this.stopPeriodicFlush();

    // Flush any remaining logs
    if (this.buffer.length > 0) {
      console.log(`[RemoteLogger] Flushing ${this.buffer.length} remaining logs...`);
      await this.flush();
    }

    // Wait for all pending flushes
    if (this.pendingFlushes.length > 0) {
      console.log(`[RemoteLogger] Waiting for ${this.pendingFlushes.length} pending flushes...`);
      await Promise.allSettled(this.pendingFlushes);
    }

    console.log("[RemoteLogger] Shutdown complete");
  }

  // ================================================================================
  // Private Methods - Core Functionality
  // ================================================================================

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ["debug", "info", "success", "warning", "error", "critical"];
    const minIndex = levels.indexOf(this.config.minLevel!);
    const levelIndex = levels.indexOf(level);
    return levelIndex >= minIndex;
  }

  private startPeriodicFlush(): void {
    this.flushTimer = setInterval(() => {
      if (this.buffer.length > 0) {
        this.flush().catch((err) => {
          console.error("[RemoteLogger] Periodic flush failed:", err);
        });
      }
    }, this.config.flushInterval);
  }

  private stopPeriodicFlush(): void {
    if (this.flushTimer !== undefined) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  // ================================================================================
  // Private Methods - Sending & Retry Logic
  // ================================================================================

  // core/RemoteLogger.ts - Fix around line 295

  private async sendBatch(destination: RemoteDestination, batch: LogBatch): Promise<void> {
    // Check circuit breaker
    if (this.config.enableCircuitBreaker && this.isCircuitOpen(destination.name)) {
      console.warn(`[RemoteLogger] Circuit breaker open for ${destination.name}, skipping`);
      return;
    }

    const startTime = performance.now();
    batch.attemptCount++;

    try {
      // Prepare payload
      const payload = this.preparePayload(batch.logs);

      // Prepare headers
      const headers: HeadersInit = { // ✅ Use HeadersInit type
        "Content-Type": "application/json",
        ...destination.headers,
      };

      if (destination.apiKey) {
        headers["Authorization"] = `Bearer ${destination.apiKey}`;
      }

      // Prepare body - explicitly type it
      let body: BodyInit; // ✅ Use BodyInit type

      if (this.config.enableCompression) {
        headers["Content-Encoding"] = "gzip";
        const compressed = await this.compress(JSON.stringify(payload));
        body = compressed; // Uint8Array is valid BodyInit
      } else {
        body = JSON.stringify(payload); // string is valid BodyInit
      }

      // Send request with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, destination.timeout || 10000);

      // ✅ Now TypeScript knows body is BodyInit
      const response = await fetch(destination.url, {
        method: destination.method || "POST",
        headers: headers,
        body: body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Success!
      const duration = performance.now() - startTime;
      this.recordSuccess(destination.name, duration);
      this.config.onSuccess?.(destination, batch.logs.length);
    } catch (error) {
      const duration = performance.now() - startTime;
      this.recordFailure(destination.name, error as Error);

      // Retry logic
      const maxRetries = destination.retryAttempts || this.config.maxRetries!;
      if (batch.attemptCount < maxRetries) {
        const delay = this.calculateRetryDelay(
          batch.attemptCount,
          destination.retryDelay || 1000,
        );

        console.warn(
          `[RemoteLogger] Failed to send logs to ${destination.name}, ` +
            `retrying in ${delay}ms (attempt ${batch.attemptCount}/${maxRetries})`,
        );

        await this.sleep(delay);
        return this.sendBatch(destination, batch);
      } else {
        // Max retries exceeded
        console.error(
          `[RemoteLogger] Failed to send logs to ${destination.name} ` +
            `after ${batch.attemptCount} attempts:`,
          error,
        );
        this.config.onError?.(error as Error, destination);

        // Put logs back in buffer if not too old
        const age = Date.now() - batch.timestamp.getTime();
        const maxAge = 60000; // 1 minute
        if (age < maxAge && this.buffer.length < this.config.maxBatchSize!) {
          this.buffer.push(...batch.logs);
        }
      }
    }
  }

  private preparePayload(logs: LogEntry[]): any {
    // Use custom transform if provided
    if (this.config.transformPayload) {
      return this.config.transformPayload(logs);
    }

    // Default payload format
    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      count: logs.length,
      logs: logs.map((entry) => ({
        timestamp: entry.timestamp.toISOString(),
        level: entry.level,
        message: entry.message,
        metadata: entry.metadata,
        category: entry.category,
        requestId: entry.requestId,
        namespace: entry.namespace,
      })),
    };
  }

  private async compress(data: string): Promise<Uint8Array> {
    try {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(data));
          controller.close();
        },
      });

      const compressed = stream.pipeThrough(new CompressionStream("gzip"));
      const reader = compressed.getReader();
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }

      // Combine chunks
      const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    } catch (error) {
      console.warn("[RemoteLogger] Compression failed, sending uncompressed:", error);
      return new TextEncoder().encode(data);
    }
  }

  private calculateRetryDelay(attempt: number, baseDelay: number): number {
    // Exponential backoff: delay = baseDelay * 2^(attempt - 1)
    const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);

    // Add jitter (random 0-1000ms) to prevent thundering herd
    const jitter = Math.random() * 1000;

    // Cap at 30 seconds
    return Math.min(exponentialDelay + jitter, 30000);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ================================================================================
  // Private Methods - Circuit Breaker
  // ================================================================================

  private isCircuitOpen(destinationName: string): boolean {
    const state = this.circuitBreakers.get(destinationName);
    if (!state || !state.isOpen) return false;

    // Check if it's time to retry (half-open state)
    if (state.nextRetry && Date.now() >= state.nextRetry.getTime()) {
      console.log(`[RemoteLogger] Circuit breaker entering half-open state for ${destinationName}`);
      state.isOpen = false;
      state.failures = 0;
      return false;
    }

    return true;
  }

  // ================================================================================
  // Private Methods - Health Tracking
  // ================================================================================

  private recordSuccess(destinationName: string, duration: number): void {
    const health = this.healthStats.get(destinationName);
    if (!health) return;

    health.totalRequests++;
    health.successfulRequests++;
    health.lastSuccess = new Date();
    health.isHealthy = true;

    // Update latency tracking
    const history = this.latencyHistory.get(destinationName) || [];
    history.push(duration);

    // Keep only last 100 measurements
    if (history.length > 100) {
      history.shift();
    }

    this.latencyHistory.set(destinationName, history);

    // Calculate moving average
    const sum = history.reduce((a, b) => a + b, 0);
    health.averageLatency = sum / history.length;

    // Reset circuit breaker on success
    const circuit = this.circuitBreakers.get(destinationName);
    if (circuit) {
      circuit.failures = 0;
      circuit.isOpen = false;
      circuit.nextRetry = undefined;
      circuit.lastFailure = undefined;
    }

    if (circuit) {
      health.circuitBreakerState = { ...circuit };
    }
  }

  private recordFailure(destinationName: string, error: Error): void {
    const health = this.healthStats.get(destinationName);
    if (!health) return;

    health.totalRequests++;
    health.failedRequests++;
    health.lastFailure = new Date();

    // Calculate health status
    const failureRate = health.failedRequests / health.totalRequests;
    health.isHealthy = failureRate < 0.5; // Unhealthy if >50% failure rate

    // Update circuit breaker
    if (this.config.enableCircuitBreaker) {
      const circuit = this.circuitBreakers.get(destinationName);
      if (circuit) {
        circuit.failures++;
        circuit.lastFailure = new Date();

        // Open circuit breaker if threshold exceeded
        if (circuit.failures >= this.config.circuitBreakerThreshold!) {
          circuit.isOpen = true;
          circuit.nextRetry = new Date(
            Date.now() + this.config.circuitBreakerTimeout!,
          );

          console.warn(
            `[RemoteLogger] Circuit breaker opened for ${destinationName}, ` +
              `will retry at ${circuit.nextRetry.toISOString()}`,
          );
        }

        health.circuitBreakerState = { ...circuit };
      }
    }
  }
}

// ================================================================================
// Convenience Functions
// ================================================================================

/**
 * Create a remote logger instance
 */
export function createRemoteLogger(config: RemoteLoggerConfig): RemoteLogger {
  return new RemoteLogger(config);
}

// ================================================================================
// Common Destination Configurations
// ================================================================================

export const commonDestinations = {
  /**
   * Logtail (BetterStack)
   */
  logtail: (sourceToken: string): RemoteDestination => ({
    name: "logtail",
    url: "https://in.logtail.com",
    headers: {
      "Authorization": `Bearer ${sourceToken}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),

  /**
   * Datadog
   */
  datadog: (apiKey: string, site = "datadoghq.com"): RemoteDestination => ({
    name: "datadog",
    url: `https://http-intake.logs.${site}/v1/input`,
    headers: {
      "DD-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),

  /**
   * Elasticsearch
   */
  elasticsearch: (url: string, index: string, apiKey?: string): RemoteDestination => ({
    name: "elasticsearch",
    url: `${url}/${index}/_doc`,
    headers: apiKey
      ? {
        "Authorization": `ApiKey ${apiKey}`,
        "Content-Type": "application/json",
      }
      : {
        "Content-Type": "application/json",
      },
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),

  /**
   * Splunk HEC (HTTP Event Collector)
   */
  splunk: (url: string, token: string): RemoteDestination => ({
    name: "splunk",
    url: `${url}/services/collector/event`,
    headers: {
      "Authorization": `Splunk ${token}`,
      "Content-Type": "application/json",
    },
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),

  /**
   * Loki (Grafana)
   */
  loki: (url: string, username?: string, password?: string): RemoteDestination => ({
    name: "loki",
    url: `${url}/loki/api/v1/push`,
    headers: username && password
      ? {
        "Authorization": `Basic ${btoa(`${username}:${password}`)}`,
        "Content-Type": "application/json",
      }
      : {
        "Content-Type": "application/json",
      },
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),

  /**
   * Custom HTTP endpoint
   */
  custom: (
    name: string,
    url: string,
    apiKey?: string,
    headers?: Record<string, string>,
  ): RemoteDestination => ({
    name,
    url,
    apiKey,
    headers,
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),
};
