# Plugin Architecture

Extend GenesisTrace with a powerful plugin system that provides lifecycle hooks for custom logging destinations, transformations, and integrations.

## Table of Contents

- [Plugin Interface](#plugin-interface)
- [Built-in Plugins](#built-in-plugins)
- [Creating Custom Plugins](#creating-custom-plugins)
- [Plugin Best Practices](#plugin-best-practices)

## Plugin Interface

```typescript
interface Plugin {
  name: string; // Plugin identifier
  version: string; // Plugin version
  onInit?(config: StylerConfig): void | Promise<void>;
  onLog?(entry: LogEntry): void | Promise<void>;
  onShutdown?(): void | Promise<void>;
  extendMethods?(): Record<string, Function>;
}
```

### Lifecycle Hooks

**`onInit(config)`**

- Called when the logger is created
- Receives the complete logger configuration
- Use for initialization tasks (opening files, establishing connections)
- Can be async

**`onLog(entry)`**

- Called for every log entry that passes the level filter
- Receives the complete `LogEntry` object
- Use for processing, filtering, or sending logs
- Can be async (but consider performance)

**`onShutdown()`**

- Called when `logger.shutdown()` is invoked
- Use for cleanup (closing files, flushing buffers, closing connections)
- Should be async to ensure proper cleanup

**`extendMethods()`** (Optional)

- Returns custom methods to add to the logger instance
- Use sparingly - prefer composition over extension

### LogEntry Structure

```typescript
interface LogEntry {
  timestamp: Date; // When the log occurred
  level: LogLevel; // debug | info | success | warning | error | critical
  message: string; // The log message
  metadata?: Record<string, any>; // Optional structured data
  namespace?: string; // Namespace from child loggers
}
```

## Built-in Plugins

### FileLoggerPlugin

Write logs to the file system with rotation and formatting options.

```typescript
import { ConfigBuilder, FileLoggerPlugin, Logger } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new FileLoggerPlugin({
        filepath: "./logs/app.log",
        format: "text", // "text" or "json"
        append: true, // Append vs overwrite
        minLevel: "info", // Only log info and above
        maxFileSize: 10 * 1024 * 1024, // 10MB max (optional)
        rotate: true, // Enable rotation (optional)
      }),
    )
    .build(),
);

logger.info("Application started");
logger.error("Something went wrong", { error: "details" });

// Cleanup on shutdown
await logger.shutdown();
```

**Options:**

- `filepath` (required): Path to log file
- `format`: "text" (human-readable) or "json" (structured)
- `append`: Append to existing file (default: true)
- `minLevel`: Minimum log level to write (default: "debug")
- `maxFileSize`: Maximum file size before rotation (optional)
- `rotate`: Enable log rotation (optional)

**Text Format Example:**

```
2024-01-15 10:30:00 [INFO] Application started
2024-01-15 10:30:15 [ERROR] Something went wrong {"error":"details"}
```

**JSON Format Example:**

```json
{"timestamp":"2024-01-15T10:30:00.000Z","level":"info","message":"Application started"}
{"timestamp":"2024-01-15T10:30:15.000Z","level":"error","message":"Something went wrong","metadata":{"error":"details"}}
```

### JsonLoggerPlugin

Output structured JSON logs optimized for log aggregation services.

```typescript
import { ConfigBuilder, JsonLoggerPlugin, Logger } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new JsonLoggerPlugin({
        filepath: "./logs/app.json",
        pretty: false, // Compact JSON (one entry per line)
        includeMetadata: true, // Include all metadata fields
        minLevel: "info", // Only log info and above
      }),
    )
    .build(),
);

logger.info("User action", {
  userId: "123",
  action: "login",
  ip: "192.168.1.1",
});
```

**Options:**

- `filepath` (required): Path to JSON log file
- `pretty`: Pretty-print JSON (default: false)
- `includeMetadata`: Include metadata in output (default: true)
- `minLevel`: Minimum log level to write (default: "debug")

**Output (pretty: false):**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User action",
  "metadata": { "userId": "123", "action": "login", "ip": "192.168.1.1" }
}
```

**Output (pretty: true):**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "User action",
  "metadata": {
    "userId": "123",
    "action": "login",
    "ip": "192.168.1.1"
  }
}
```

### RemoteLoggerPlugin

Send logs to remote HTTP endpoints with batching and retry logic.

```typescript
import { ConfigBuilder, Logger, RemoteLoggerPlugin } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new RemoteLoggerPlugin({
        endpoint: "https://logs.example.com/api/logs",
        method: "POST",
        headers: {
          "Authorization": "Bearer YOUR_TOKEN",
          "Content-Type": "application/json",
        },
        batchSize: 10, // Send logs in batches of 10
        flushInterval: 5000, // Flush every 5 seconds
        minLevel: "warning", // Only send warnings and above
        retries: 3, // Retry failed requests 3 times
        timeout: 30000, // 30 second timeout
      }),
    )
    .build(),
);

// Logs are buffered and sent in batches
logger.warning("High memory usage", { memory: "85%" });
logger.error("Service unavailable", { service: "database" });

// Ensure all logs are sent before exit
await logger.shutdown();
```

**Options:**

- `endpoint` (required): HTTP endpoint URL
- `method`: HTTP method (default: "POST")
- `headers`: Custom HTTP headers (optional)
- `batchSize`: Number of logs to batch (default: 10)
- `flushInterval`: Milliseconds between flushes (default: 5000)
- `minLevel`: Minimum log level to send (default: "debug")
- `retries`: Number of retry attempts (default: 3)
- `timeout`: Request timeout in milliseconds (default: 30000)

**Behavior:**

- Logs are buffered in memory until batch size is reached or flush interval expires
- Failed requests are retried with exponential backoff
- `shutdown()` flushes all remaining logs before closing

### SlackLoggerPlugin

Send critical alerts to Slack channels via webhooks.

```typescript
import { ConfigBuilder, Logger, SlackLoggerPlugin } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new SlackLoggerPlugin({
        webhookUrl: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
        channel: "#alerts",
        username: "Production Logger",
        iconEmoji: ":rotating_light:",
        minLevel: "error", // Only send errors and critical
        includeMetadata: true, // Include metadata in Slack message
        mentionOnCritical: "@channel", // Mention @channel for critical logs
      }),
    )
    .build(),
);

// This goes to Slack
logger.error("Payment processing failed", {
  orderId: "12345",
  amount: "$299.99",
  error: "Gateway timeout",
});

// This goes to Slack with @channel mention
logger.critical("Database connection lost", {
  database: "production-db",
  retries: 5,
});
```

**Options:**

- `webhookUrl` (required): Slack webhook URL
- `channel`: Slack channel (optional, webhook default used otherwise)
- `username`: Bot username (default: "GenesisTrace")
- `iconEmoji`: Bot icon emoji (default: ":robot_face:")
- `minLevel`: Minimum log level to send (default: "error")
- `includeMetadata`: Include metadata in message (default: true)
- `mentionOnCritical`: Mention pattern for critical logs (optional)

**Slack Message Format:**

```
:red_circle: ERROR - Payment processing failed

orderId: 12345
amount: $299.99
error: Gateway timeout

Timestamp: 2024-01-15 10:30:00
```

## Creating Custom Plugins

### Basic Plugin Example

```typescript
import { LogEntry, Plugin, StylerConfig } from "jsr:@pedromdominguez/genesis-trace";

class ConsoleLoggerPlugin implements Plugin {
  name = "console-logger";
  version = "1.0.0";

  onInit(config: StylerConfig): void {
    console.log(`[${this.name}] Plugin initialized`);
  }

  onLog(entry: LogEntry): void {
    console.log(`[${entry.level.toUpperCase()}] ${entry.message}`);
    if (entry.metadata) {
      console.log("Metadata:", entry.metadata);
    }
  }

  onShutdown(): void {
    console.log(`[${this.name}] Plugin shutting down`);
  }
}
```

### Advanced Plugin: Discord Logger

````typescript
import {
  ConfigBuilder,
  LogEntry,
  Logger,
  Plugin,
  StylerConfig,
} from "jsr:@pedromdominguez/genesis-trace";

interface DiscordPluginOptions {
  webhookUrl: string;
  minLevel?: string;
  avatarUrl?: string;
  username?: string;
}

class DiscordLoggerPlugin implements Plugin {
  name = "discord-logger";
  version = "1.0.0";

  private webhookUrl: string;
  private minLevel: string;
  private avatarUrl?: string;
  private username: string;

  constructor(options: DiscordPluginOptions) {
    this.webhookUrl = options.webhookUrl;
    this.minLevel = options.minLevel || "info";
    this.avatarUrl = options.avatarUrl;
    this.username = options.username || "GenesisTrace";
  }

  onInit(config: StylerConfig): void {
    console.log(`[${this.name}] Initialized with minLevel: ${this.minLevel}`);
  }

  async onLog(entry: LogEntry): Promise<void> {
    // Filter by level
    if (!this.shouldLog(entry.level)) {
      return;
    }

    // Build Discord message
    const message = {
      username: this.username,
      avatar_url: this.avatarUrl,
      content: `**[${entry.level.toUpperCase()}]** ${entry.message}`,
      embeds: entry.metadata
        ? [{
          title: "Metadata",
          description: "```json\n" + JSON.stringify(entry.metadata, null, 2) + "\n```",
          color: this.getLevelColor(entry.level),
          timestamp: entry.timestamp.toISOString(),
        }]
        : [],
    };

    try {
      const response = await fetch(this.webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        console.error(`[${this.name}] Failed to send log:`, response.statusText);
      }
    } catch (error) {
      console.error(`[${this.name}] Error sending log:`, error);
    }
  }

  async onShutdown(): Promise<void> {
    console.log(`[${this.name}] Shutting down`);
  }

  private shouldLog(level: string): boolean {
    const levels = ["debug", "info", "success", "warning", "error", "critical"];
    const minIndex = levels.indexOf(this.minLevel);
    const levelIndex = levels.indexOf(level);
    return levelIndex >= minIndex;
  }

  private getLevelColor(level: string): number {
    const colors: Record<string, number> = {
      debug: 0x808080, // Gray
      info: 0x00BFFF, // Blue
      success: 0x00FF00, // Green
      warning: 0xFFFF00, // Yellow
      error: 0xFF0000, // Red
      critical: 0xFF00FF, // Magenta
    };
    return colors[level] || 0xFFFFFF;
  }
}

// Usage
const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new DiscordLoggerPlugin({
        webhookUrl: "https://discord.com/api/webhooks/...",
        minLevel: "error",
        username: "Production Bot",
      }),
    )
    .build(),
);

logger.error("Critical error occurred", { service: "api" });
````

### Batching Plugin Example

```typescript
import { LogEntry, Plugin, StylerConfig } from "jsr:@pedromdominguez/genesis-trace";

class BatchLoggerPlugin implements Plugin {
  name = "batch-logger";
  version = "1.0.0";

  private buffer: LogEntry[] = [];
  private batchSize: number;
  private flushInterval: number;
  private timer?: number;

  constructor(options: { batchSize: number; flushInterval: number }) {
    this.batchSize = options.batchSize;
    this.flushInterval = options.flushInterval;
  }

  onInit(config: StylerConfig): void {
    // Start periodic flush timer
    this.timer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  onLog(entry: LogEntry): void {
    this.buffer.push(entry);

    // Flush if batch size reached
    if (this.buffer.length >= this.batchSize) {
      this.flush();
    }
  }

  async onShutdown(): Promise<void> {
    // Clear timer
    if (this.timer) {
      clearInterval(this.timer);
    }

    // Flush remaining logs
    await this.flush();
  }

  private async flush(): Promise<void> {
    if (this.buffer.length === 0) return;

    const batch = [...this.buffer];
    this.buffer = [];

    console.log(`[${this.name}] Flushing ${batch.length} logs`);

    // Process batch (send to API, write to file, etc.)
    await this.processBatch(batch);
  }

  private async processBatch(entries: LogEntry[]): Promise<void> {
    // Implement your batch processing logic here
    // Example: send to remote API
    console.log("Processing batch:", entries.length);
  }
}
```

### Plugin with Extended Methods

```typescript
import { LogEntry, Logger, Plugin, StylerConfig } from "jsr:@pedromdominguez/genesis-trace";

class MetricsPlugin implements Plugin {
  name = "metrics";
  version = "1.0.0";

  private counts: Record<string, number> = {
    debug: 0,
    info: 0,
    success: 0,
    warning: 0,
    error: 0,
    critical: 0,
  };

  onInit(config: StylerConfig): void {
    console.log(`[${this.name}] Metrics tracking enabled`);
  }

  onLog(entry: LogEntry): void {
    this.counts[entry.level]++;
  }

  onShutdown(): void {
    console.log(`[${this.name}] Final metrics:`, this.counts);
  }

  // Extend logger with custom methods
  extendMethods() {
    return {
      getMetrics: () => ({ ...this.counts }),
      resetMetrics: () => {
        for (const key in this.counts) {
          this.counts[key] = 0;
        }
      },
    };
  }
}

// Usage
const logger = new Logger(
  new ConfigBuilder()
    .plugin(new MetricsPlugin())
    .build(),
) as Logger & { getMetrics: () => Record<string, number>; resetMetrics: () => void };

logger.info("Test message");
logger.error("Error message");

console.log(logger.getMetrics());
// Output: { debug: 0, info: 1, success: 0, warning: 0, error: 1, critical: 0 }

logger.resetMetrics();
```

## Plugin Best Practices

### 1. Error Handling

Always handle errors gracefully to avoid crashing the logger:

```typescript
async onLog(entry: LogEntry): Promise<void> {
  try {
    await this.sendToRemote(entry);
  } catch (error) {
    // Log error but don't throw
    console.error(`[${this.name}] Failed to send log:`, error);
  }
}
```

### 2. Performance Considerations

- Keep `onLog` fast - it's called for every log entry
- Use batching for expensive operations (network, disk I/O)
- Consider using `setTimeout(..., 0)` to defer non-critical work
- Add level filtering early

```typescript
onLog(entry: LogEntry): void {
  // Fast path: filter early
  if (entry.level !== "critical") return;

  // Defer expensive work
  setTimeout(() => {
    this.sendAlert(entry);
  }, 0);
}
```

### 3. Level Filtering

Implement level filtering in plugins:

```typescript
private shouldLog(level: string): boolean {
  const levels = ["debug", "info", "success", "warning", "error", "critical"];
  const minIndex = levels.indexOf(this.minLevel);
  const levelIndex = levels.indexOf(level);
  return levelIndex >= minIndex;
}
```

### 4. Graceful Shutdown

Always implement `onShutdown` to cleanup resources:

```typescript
async onShutdown(): Promise<void> {
  // Flush buffers
  await this.flush();

  // Close connections
  if (this.connection) {
    await this.connection.close();
  }

  // Clear timers
  if (this.timer) {
    clearInterval(this.timer);
  }
}
```

### 5. Configuration Validation

Validate options in the constructor:

```typescript
constructor(options: MyPluginOptions) {
  if (!options.endpoint) {
    throw new Error("endpoint is required");
  }

  if (options.batchSize && options.batchSize < 1) {
    throw new Error("batchSize must be positive");
  }

  this.endpoint = options.endpoint;
  this.batchSize = options.batchSize || 10;
}
```

### 6. Dynamic Plugin Registration

Add plugins at runtime:

```typescript
const logger = new Logger();

// Add plugin later
const filePlugin = new FileLoggerPlugin({ filepath: "./logs/app.log" });
logger.use(filePlugin);

// Plugin starts receiving logs immediately
logger.info("This goes to file");
```

### 7. Plugin Chaining

Use multiple plugins together:

```typescript
const logger = new Logger(
  new ConfigBuilder()
    .plugin(new FileLoggerPlugin({ filepath: "./logs/all.log" }))
    .plugin(new FileLoggerPlugin({ filepath: "./logs/errors.log", minLevel: "error" }))
    .plugin(new RemoteLoggerPlugin({ endpoint: "https://logs.example.com" }))
    .plugin(new SlackLoggerPlugin({ webhookUrl: "...", minLevel: "critical" }))
    .build(),
);
```

## Example Use Cases

### Audit Trail Plugin

```typescript
class AuditPlugin implements Plugin {
  name = "audit-trail";
  version = "1.0.0";

  async onLog(entry: LogEntry): Promise<void> {
    if (entry.metadata?.audit) {
      await Deno.writeTextFile(
        "./logs/audit.log",
        JSON.stringify({
          timestamp: entry.timestamp.toISOString(),
          action: entry.message,
          user: entry.metadata.userId,
          details: entry.metadata,
        }) + "\n",
        { append: true },
      );
    }
  }
}
```

### Rate Limiting Plugin

```typescript
class RateLimitPlugin implements Plugin {
  name = "rate-limit";
  version = "1.0.0";

  private lastLog = 0;
  private minInterval = 1000; // 1 second

  onLog(entry: LogEntry): void {
    const now = Date.now();
    if (now - this.lastLog < this.minInterval) {
      return; // Skip this log
    }
    this.lastLog = now;
  }
}
```

---

[Back to Main README](../README.md)
