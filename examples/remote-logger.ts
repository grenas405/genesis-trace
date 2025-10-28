// examples/remote-logger.ts
import { commonDestinations, RemoteDestination } from "../core/remote-logger.ts";
import { RemoteLogger } from "../core/RemoteLogger.ts";
import { LogEntry } from "../core/config.ts";

// Example 1: Basic usage with custom endpoint
console.log("=== Example 1: Basic Remote Logger ===\n");

const logger1 = new RemoteLogger({
  destinations: [
    {
      name: "my-logging-service",
      url: "https://logs.example.com/api/logs",
      apiKey: "your-api-key-here",
      timeout: 5000,
    },
  ],
  batchSize: 5,
  flushInterval: 10000,
  minLevel: "info",
});

// Log some entries
logger1.log({
  timestamp: new Date(),
  level: "info",
  message: "Application started",
});

logger1.log({
  timestamp: new Date(),
  level: "error",
  message: "Database connection failed",
  metadata: {
    error: "ECONNREFUSED",
    host: "localhost",
    port: 5432,
  },
});

// Wait a bit and flush
await new Promise((resolve) => setTimeout(resolve, 1000));
await logger1.flush();

console.log("Buffer size:", logger1.getBufferSize());
console.log("Stats:", logger1.getStats());
console.log("\n");

// Example 2: Multiple destinations with circuit breaker
console.log("=== Example 2: Multiple Destinations ===\n");

const logger2 = new RemoteLogger({
  destinations: [
    commonDestinations.custom("primary", "https://logs1.example.com/api/logs"),
    commonDestinations.custom("backup", "https://logs2.example.com/api/logs"),
  ],
  batchSize: 10,
  enableCircuitBreaker: true,
  circuitBreakerThreshold: 3,
  circuitBreakerTimeout: 30000,
  onSuccess: (dest, count) => {
    console.log(`✅ Successfully sent ${count} logs to ${dest.name}`);
  },
  onError: (error, dest) => {
    console.error(`❌ Failed to send logs to ${dest.name}:`, error.message);
  },
});

// Log multiple entries
for (let i = 0; i < 15; i++) {
  logger2.log({
    timestamp: new Date(),
    level: "info",
    message: `Log entry ${i + 1}`,
    metadata: { index: i },
  });
}

await logger2.flush();

// Check health
console.log("\nHealth Status:");
for (const [name, health] of logger2.getHealth()) {
  console.log(`  ${name}:`, {
    healthy: health.isHealthy,
    requests: health.totalRequests,
    successful: health.successfulRequests,
    failed: health.failedRequests,
    avgLatency: `${health.averageLatency.toFixed(2)}ms`,
    circuitOpen: health.circuitBreakerState.isOpen,
  });
}

console.log("\n");

// Example 3: With compression
console.log("=== Example 3: With Compression ===\n");

const logger3 = new RemoteLogger({
  destinations: [
    {
      name: "compressed-logs",
      url: "https://logs.example.com/api/logs",
      apiKey: "your-api-key",
    },
  ],
  enableCompression: true,
  batchSize: 20,
});

// Log large amount of data
for (let i = 0; i < 25; i++) {
  logger3.log({
    timestamp: new Date(),
    level: "info",
    message: `Large log entry with lots of metadata ${i}`,
    metadata: {
      index: i,
      data: "x".repeat(1000), // Large string
      nested: {
        field1: "value1",
        field2: "value2",
        field3: "value3",
      },
    },
  });
}

console.log("Buffer size before flush:", logger3.getBufferSize());
await logger3.flush();
console.log("Buffer size after flush:", logger3.getBufferSize());

console.log("\n");

// Example 4: Testing connections
console.log("=== Example 4: Connection Testing ===\n");

const logger4 = new RemoteLogger({
  destinations: [
    commonDestinations.custom("service-a", "https://logs-a.example.com/api/logs"),
    commonDestinations.custom("service-b", "https://logs-b.example.com/api/logs"),
    commonDestinations.custom("service-c", "https://logs-c.example.com/api/logs"),
  ],
});

// Test all connections
console.log("Testing connections...");
const results = await logger4.testAllConnections();

for (const [name, success] of results) {
  console.log(`  ${name}: ${success ? "✅ OK" : "❌ Failed"}`);
}

console.log("\n");

// Example 5: Dynamic destination management
console.log("=== Example 5: Dynamic Destinations ===\n");

const logger5 = new RemoteLogger({
  destinations: [
    commonDestinations.custom("initial", "https://logs.example.com/api/logs"),
  ],
  batchSize: 5,
});

console.log("Initial destinations:", logger5.getStats().totalDestinations);

// Add new destination
logger5.addDestination(
  commonDestinations.custom("dynamic", "https://logs-dynamic.example.com/api/logs"),
);

console.log("After adding:", logger5.getStats().totalDestinations);

// Log and flush
logger5.log({
  timestamp: new Date(),
  level: "info",
  message: "Testing dynamic destination",
});

await logger5.flush();

// Remove destination
logger5.removeDestination("initial");
console.log("After removing:", logger5.getStats().totalDestinations);

console.log("\n");

// Example 6: Graceful shutdown
console.log("=== Example 6: Graceful Shutdown ===\n");

const logger6 = new RemoteLogger({
  destinations: [
    commonDestinations.custom("shutdown-test", "https://logs.example.com/api/logs"),
  ],
  batchSize: 10,
  flushInterval: 5000,
});

// Log entries
for (let i = 0; i < 7; i++) {
  logger6.log({
    timestamp: new Date(),
    level: "info",
    message: `Shutdown test log ${i + 1}`,
  });
}

console.log("Logs in buffer:", logger6.getBufferSize());

// Shutdown (will flush automatically)
await logger6.shutdown();

console.log("Logs in buffer after shutdown:", logger6.getBufferSize());

console.log("\n");

// Example 7: Monitoring and stats
console.log("=== Example 7: Monitoring ===\n");

const logger7 = new RemoteLogger({
  destinations: [
    commonDestinations.custom("monitored", "https://logs.example.com/api/logs"),
  ],
});

// Simulate some activity
for (let i = 0; i < 30; i++) {
  logger7.log({
    timestamp: new Date(),
    level: i % 10 === 0 ? "error" : "info",
    message: `Monitored log ${i + 1}`,
  });
}

await logger7.flush();

// Get comprehensive stats
const stats = logger7.getStats();
console.log("Statistics:", {
  bufferSize: stats.bufferSize,
  destinations: stats.totalDestinations,
  healthy: stats.healthyDestinations,
  unhealthy: stats.unhealthyDestinations,
  openCircuits: stats.openCircuitBreakers,
  totalRequests: stats.totalRequestsAcrossDestinations,
  successful: stats.totalSuccessfulRequests,
  failed: stats.totalFailedRequests,
  avgLatency: `${stats.averageLatencyAcrossDestinations.toFixed(2)}ms`,
});

// Get detailed health for specific destination
const health = logger7.getDestinationHealth("monitored");
if (health) {
  console.log("\nDetailed Health:", {
    name: health.name,
    isHealthy: health.isHealthy,
    lastSuccess: health.lastSuccess?.toISOString(),
    lastFailure: health.lastFailure?.toISOString(),
    successRate: `${((health.successfulRequests / health.totalRequests) * 100).toFixed(2)}%`,
    avgLatency: `${health.averageLatency.toFixed(2)}ms`,
  });
}

console.log("\n=== All Examples Complete ===");
