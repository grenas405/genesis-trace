#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net

/**
 * Custom Plugin Development Example
 *
 * Demonstrates how to create custom plugins for GenesisTrace to extend
 * functionality such as metrics collection, custom formatters, and integrations.
 *
 * Features demonstrated:
 *   • Creating custom logger plugins
 *   • Implementing plugin lifecycle hooks (onInit, onLog, onShutdown)
 *   • Metrics collection and aggregation
 *   • Custom log filtering and formatting
 *   • Integration with external services
 */

import {
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  type LogEntry,
  Logger,
  type Plugin,
  type StylerConfig,
  TableRenderer,
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// EXAMPLE 1: Metrics Collection Plugin
// ============================================================================

interface MetricsSummary {
  totalLogs: number;
  byLevel: Record<string, number>;
  avgLogsPerSecond: number;
  peakLogsPerSecond: number;
  errorRate: number;
}

class MetricsCollectorPlugin implements Plugin {
  name = "metrics-collector";
  version = "1.0.0";
  private metrics: Map<string, number> = new Map();
  private startTime = 0;
  private logTimestamps: number[] = [];
  private windowSize = 60000; // 1 minute window

  onInit(_config: StylerConfig): void {
    this.startTime = Date.now();
    console.log(
      ColorSystem.colorize("📊 Metrics collector plugin initialized", ColorSystem.codes.green),
    );
  }

  onLog(entry: LogEntry): void {
    // Count by level
    const currentCount = this.metrics.get(entry.level) || 0;
    this.metrics.set(entry.level, currentCount + 1);

    // Track timestamps for rate calculation
    const now = Date.now();
    this.logTimestamps.push(now);

    // Clean old timestamps outside window
    this.logTimestamps = this.logTimestamps.filter((ts) => now - ts < this.windowSize);
  }

  getSummary(): MetricsSummary {
    const totalLogs = Array.from(this.metrics.values()).reduce((sum, count) => sum + count, 0);
    const duration = (Date.now() - this.startTime) / 1000;
    const avgLogsPerSecond = totalLogs / duration;

    // Calculate peak logs/sec in 1-second intervals
    const intervals = new Map<number, number>();
    for (const ts of this.logTimestamps) {
      const second = Math.floor(ts / 1000);
      intervals.set(second, (intervals.get(second) || 0) + 1);
    }
    const peakLogsPerSecond = Math.max(...Array.from(intervals.values()), 0);

    const errors = (this.metrics.get("error") || 0) + (this.metrics.get("critical") || 0);
    const errorRate = totalLogs > 0 ? (errors / totalLogs) * 100 : 0;

    const byLevel: Record<string, number> = {};
    for (const [level, count] of this.metrics.entries()) {
      byLevel[level] = count;
    }

    return {
      totalLogs,
      byLevel,
      avgLogsPerSecond,
      peakLogsPerSecond,
      errorRate,
    };
  }

  displaySummary(): void {
    const summary = this.getSummary();

    console.log("\n");
    BoxRenderer.render(
      ["Metrics Summary", "", `Total logs: ${Formatter.number(summary.totalLogs)}`],
      {
        title: "📊 Metrics Collection",
        style: "rounded",
        color: ColorSystem.codes.brightCyan,
      },
    );

    console.log("\n");
    TableRenderer.renderKeyValue([
      { label: "Total Logs", value: Formatter.number(summary.totalLogs) },
      { label: "Avg Logs/sec", value: summary.avgLogsPerSecond.toFixed(2) },
      { label: "Peak Logs/sec", value: String(summary.peakLogsPerSecond) },
      { label: "Error Rate", value: `${summary.errorRate.toFixed(2)}%` },
    ]);

    console.log("\n");
    console.log(ColorSystem.colorize("Logs by Level:", ColorSystem.codes.bright));
    const chartData = Object.entries(summary.byLevel).map(([label, value]) => ({
      label,
      value,
    }));
    ChartRenderer.barChart(chartData, { showValues: true, width: 40 });
  }

  async onShutdown(): Promise<void> {
    console.log(
      ColorSystem.colorize(
        "\n📊 Metrics collector plugin shutting down...",
        ColorSystem.codes.yellow,
      ),
    );
    this.displaySummary();
  }
}

// ============================================================================
// EXAMPLE 2: Filtered Logger Plugin
// ============================================================================

class FilteredLoggerPlugin implements Plugin {
  name = "filtered-logger";
  version = "1.0.0";
  private allowedLevels: Set<string>;
  private logCount = 0;

  constructor(allowedLevels: string[]) {
    this.allowedLevels = new Set(allowedLevels);
  }

  onInit(_config: StylerConfig): void {
    console.log(
      ColorSystem.colorize(
        `🔍 Filtered logger initialized (levels: ${Array.from(this.allowedLevels).join(", ")})`,
        ColorSystem.codes.green,
      ),
    );
  }

  onLog(entry: LogEntry): void {
    if (this.allowedLevels.has(entry.level)) {
      this.logCount++;
      const timestamp = new Date().toISOString();
      const formatted = `[${timestamp}] [${entry.level.toUpperCase()}] ${entry.message}`;

      // Could write to file, send to external service, etc.
      // For this example, we'll just track the count
    }
  }

  getCount(): number {
    return this.logCount;
  }

  async onShutdown(): Promise<void> {
    console.log(
      ColorSystem.colorize(
        `\n🔍 Filtered logger plugin shutting down (processed ${this.logCount} logs)`,
        ColorSystem.codes.yellow,
      ),
    );
  }
}

// ============================================================================
// EXAMPLE 3: Alert Plugin (simulated webhook)
// ============================================================================

interface AlertConfig {
  webhookUrl?: string;
  threshold: number;
  levels: string[];
}

class AlertPlugin implements Plugin {
  name = "alert-plugin";
  version = "1.0.0";
  private config: AlertConfig;
  private alertCount = 0;
  private alerts: Array<{ timestamp: Date; level: string; message: string }> = [];

  constructor(config: AlertConfig) {
    this.config = config;
  }

  onInit(_config: StylerConfig): void {
    console.log(
      ColorSystem.colorize(
        `🚨 Alert plugin initialized (threshold: ${this.config.threshold})`,
        ColorSystem.codes.green,
      ),
    );
  }

  onLog(entry: LogEntry): void {
    if (this.config.levels.includes(entry.level)) {
      this.alertCount++;
      this.alerts.push({
        timestamp: new Date(),
        level: entry.level,
        message: entry.message,
      });

      if (this.alertCount >= this.config.threshold) {
        this.sendAlert(entry);
      }
    }
  }

  private sendAlert(entry: LogEntry): void {
    // In a real implementation, this would send to Slack, PagerDuty, etc.
    console.log(
      ColorSystem.colorize(
        `\n🚨 ALERT: ${entry.level.toUpperCase()} threshold reached (${this.alertCount} alerts)`,
        ColorSystem.codes.red,
      ),
    );

    if (this.config.webhookUrl) {
      console.log(
        ColorSystem.colorize(`   Would send to: ${this.config.webhookUrl}`, ColorSystem.codes.dim),
      );
    }
  }

  getAlerts() {
    return this.alerts;
  }

  async onShutdown(): Promise<void> {
    console.log(
      ColorSystem.colorize(
        `\n🚨 Alert plugin shutting down (${this.alertCount} total alerts)`,
        ColorSystem.codes.yellow,
      ),
    );

    if (this.alerts.length > 0) {
      console.log("\nRecent Alerts:");
      TableRenderer.render(
        this.alerts.slice(-5),
        [
          {
            key: "timestamp",
            label: "Time",
            width: 20,
            formatter: (d: Date) => d.toLocaleTimeString(),
          },
          { key: "level", label: "Level", width: 10 },
          { key: "message", label: "Message", width: 40 },
        ],
      );
    }
  }
}

// ============================================================================
// EXAMPLE 4: Performance Tracking Plugin
// ============================================================================

class PerformanceTrackerPlugin implements Plugin {
  name = "performance-tracker";
  version = "1.0.0";
  private operationTimes: Map<string, number[]> = new Map();

  onInit(_config: StylerConfig): void {
    console.log(
      ColorSystem.colorize("⚡ Performance tracker plugin initialized", ColorSystem.codes.green),
    );
  }

  onLog(entry: LogEntry): void {
    // Track operations that include timing metadata
    if (entry.metadata && typeof entry.metadata.duration === "number") {
      const operation = entry.metadata.operation as string || "unknown";
      const duration = entry.metadata.duration as number;

      if (!this.operationTimes.has(operation)) {
        this.operationTimes.set(operation, []);
      }
      this.operationTimes.get(operation)!.push(duration);
    }
  }

  getStats() {
    const stats = [];
    for (const [operation, times] of this.operationTimes.entries()) {
      const avg = times.reduce((sum, t) => sum + t, 0) / times.length;
      const min = Math.min(...times);
      const max = Math.max(...times);

      stats.push({ operation, count: times.length, avg, min, max });
    }
    return stats;
  }

  async onShutdown(): Promise<void> {
    console.log(
      ColorSystem.colorize("\n⚡ Performance tracker shutting down...", ColorSystem.codes.yellow),
    );

    const stats = this.getStats();
    if (stats.length > 0) {
      console.log("\nPerformance Statistics:");
      TableRenderer.render(
        stats,
        [
          { key: "operation", label: "Operation", width: 20 },
          { key: "count", label: "Count", width: 8, align: "right" },
          {
            key: "avg",
            label: "Avg Time",
            width: 12,
            align: "right",
            formatter: (v: number) => Formatter.duration(v),
          },
          {
            key: "min",
            label: "Min",
            width: 10,
            align: "right",
            formatter: (v: number) => Formatter.duration(v),
          },
          {
            key: "max",
            label: "Max",
            width: 10,
            align: "right",
            formatter: (v: number) => Formatter.duration(v),
          },
        ],
      );
    }
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

async function demonstratePlugins() {
  console.clear();
  console.log("\n");

  BoxRenderer.render(
    [
      "Custom Plugin Development Example",
      "",
      "This example demonstrates how to create custom plugins:",
      "  • Metrics Collection Plugin",
      "  • Filtered Logger Plugin",
      "  • Alert Plugin",
      "  • Performance Tracking Plugin",
    ],
    {
      title: "🔌 Plugin System",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
    },
  );

  console.log("\n");

  // Create plugins
  const metricsPlugin = new MetricsCollectorPlugin();
  const filterPlugin = new FilteredLoggerPlugin(["error", "critical"]);
  const alertPlugin = new AlertPlugin({
    webhookUrl: "https://hooks.example.com/alerts",
    threshold: 3,
    levels: ["error", "critical"],
  });
  const perfPlugin = new PerformanceTrackerPlugin();

  // Create logger with plugins
  const logger = new Logger(
    new ConfigBuilder()
      .logLevel("debug")
      .enableHistory(true)
      .plugin(metricsPlugin)
      .plugin(filterPlugin)
      .plugin(alertPlugin)
      .plugin(perfPlugin)
      .build(),
  );

  console.log("\n");
  console.log(ColorSystem.colorize("Simulating application logs...", ColorSystem.codes.bright));
  console.log("\n");

  // Simulate various log events
  logger.debug("Application started");
  logger.info("Server listening on port 8000");
  logger.success("Connected to database");

  logger.info("Processing request", {
    operation: "http_request",
    duration: 45,
  });

  logger.warning("High memory usage detected", { usage: "78%" });

  logger.error("Failed to connect to cache server");

  logger.info("Processing batch job", {
    operation: "batch_process",
    duration: 1200,
  });

  logger.error("Database query timeout");

  logger.critical("System disk space critically low");

  logger.info("Processing request", {
    operation: "http_request",
    duration: 52,
  });

  logger.success("Batch job completed");

  logger.info("Backup started", {
    operation: "backup",
    duration: 5000,
  });

  logger.error("Failed to send email notification");

  console.log("\n");
  console.log(ColorSystem.colorize("Shutting down logger...", ColorSystem.codes.bright));

  // Shutdown will trigger plugin cleanup and reports
  await logger.shutdown();

  console.log("\n");
  BoxRenderer.message(
    "Plugin demonstration complete! Check the output above for each plugin's summary.",
    "success",
  );
  console.log("\n");
}

// Main execution
if (import.meta.main) {
  await demonstratePlugins();
}
