// core/remote-logger.ts
import { LogEntry, LogLevel } from "./config.ts";
import { RemoteLogger } from "./RemoteLogger.ts";

export interface RemoteDestination {
  name: string;
  url: string;
  apiKey?: string;
  headers?: HeadersInit;
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

// Convenience function to create a remote logger
export function createRemoteLogger(config: RemoteLoggerConfig): RemoteLogger {
  return new RemoteLogger(config);
}

// Example destination configurations
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
   * Splunk HEC
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
   * Custom HTTP endpoint
   */
  custom: (name: string, url: string, apiKey?: string): RemoteDestination => ({
    name,
    url,
    apiKey,
    timeout: 10000,
    retryAttempts: 3,
    retryDelay: 1000,
  }),
};
