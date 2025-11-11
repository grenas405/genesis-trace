#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Real-time Dashboard Example
 *
 * Demonstrates a live-updating dashboard with metrics, charts, and status indicators.
 * Features used:
 *   • Live table updates with refreshing data
 *   • Dynamic progress bars and spinners
 *   • Real-time chart rendering
 *   • Color-coded status indicators
 *   • Box-based status panels
 */

import {
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConsoleStyler,
  Formatter,
  Logger,
  TableRenderer,
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

// Simulated metrics data
class MetricsSimulator {
  private cpu = 45;
  private memory = 62;
  private requests = 1250;
  private errors = 3;
  private activeUsers = 142;
  private responseTime = 85;

  update() {
    // Simulate realistic metric changes
    this.cpu = Math.max(10, Math.min(95, this.cpu + (Math.random() - 0.5) * 10));
    this.memory = Math.max(30, Math.min(90, this.memory + (Math.random() - 0.5) * 5));
    this.requests = Math.max(500, this.requests + Math.floor((Math.random() - 0.5) * 200));
    this.errors = Math.max(0, this.errors + Math.floor((Math.random() - 0.3) * 2));
    this.activeUsers = Math.max(50, this.activeUsers + Math.floor((Math.random() - 0.5) * 20));
    this.responseTime = Math.max(50, Math.min(300, this.responseTime + (Math.random() - 0.5) * 30));
  }

  getMetrics() {
    return {
      cpu: this.cpu,
      memory: this.memory,
      requests: this.requests,
      errors: this.errors,
      activeUsers: this.activeUsers,
      responseTime: this.responseTime,
    };
  }

  getRequestHistory(): number[] {
    const history = [];
    for (let i = 0; i < 24; i++) {
      history.push(this.requests + Math.floor((Math.random() - 0.5) * 300));
    }
    return history;
  }

  getEndpointStats() {
    return [
      { endpoint: "/api/users", requests: 1250, avgTime: 45, errors: 2 },
      { endpoint: "/api/products", requests: 890, avgTime: 62, errors: 0 },
      { endpoint: "/api/orders", requests: 634, avgTime: 120, errors: 1 },
      { endpoint: "/api/auth", requests: 445, avgTime: 35, errors: 0 },
      { endpoint: "/api/search", requests: 312, avgTime: 95, errors: 0 },
    ];
  }

  getServerStatus() {
    return [
      { server: "web-01", status: "healthy", uptime: "12d 5h", load: 0.45 },
      { server: "web-02", status: "healthy", uptime: "12d 5h", load: 0.52 },
      { server: "web-03", status: "degraded", uptime: "2d 18h", load: 0.78 },
      { server: "api-01", status: "healthy", uptime: "12d 5h", load: 0.38 },
      { server: "db-01", status: "healthy", uptime: "45d 12h", load: 0.25 },
    ];
  }
}

// Dashboard renderer
class Dashboard {
  private metrics: MetricsSimulator;
  private logger: Logger;
  private updateCount = 0;

  constructor() {
    this.metrics = new MetricsSimulator();
    this.logger = new Logger();
  }

  private clearScreen() {
    console.clear();
  }

  private renderHeader() {
    const timestamp = new Date().toLocaleString();
    const title = ColorSystem.colorize(
      "┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓",
      ColorSystem.codes.brightCyan,
    );
    const content = ColorSystem.colorize(
      "┃  🚀 REAL-TIME APPLICATION DASHBOARD                                          ┃",
      ColorSystem.codes.brightCyan,
    );
    const time = ColorSystem.colorize(
      `┃  Last Updated: ${timestamp}${" ".repeat(80 - 18 - timestamp.length)}┃`,
      ColorSystem.codes.brightCyan,
    );
    const bottom = ColorSystem.colorize(
      "┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛",
      ColorSystem.codes.brightCyan,
    );

    console.log(title);
    console.log(content);
    console.log(time);
    console.log(bottom);
    console.log("");
  }

  private renderKeyMetrics() {
    const m = this.metrics.getMetrics();

    // CPU Status
    const cpuColor = m.cpu > 80
      ? ColorSystem.codes.red
      : m.cpu > 60
      ? ColorSystem.codes.yellow
      : ColorSystem.codes.green;
    const cpuBar = "█".repeat(Math.floor(m.cpu / 2)) +
      "░".repeat(50 - Math.floor(m.cpu / 2));

    // Memory Status
    const memColor = m.memory > 80
      ? ColorSystem.codes.red
      : m.memory > 70
      ? ColorSystem.codes.yellow
      : ColorSystem.codes.green;
    const memBar = "█".repeat(Math.floor(m.memory / 2)) +
      "░".repeat(50 - Math.floor(m.memory / 2));

    console.log(ColorSystem.colorize("KEY METRICS", ColorSystem.codes.bright));
    console.log("");
    console.log(
      `CPU Usage:     ${cpuColor}${cpuBar} ${m.cpu.toFixed(1)}%${ColorSystem.codes.reset}`,
    );
    console.log(
      `Memory Usage:  ${memColor}${memBar} ${m.memory.toFixed(1)}%${ColorSystem.codes.reset}`,
    );
    console.log("");

    // Quick stats in a single line
    const stats = [
      `Requests/min: ${ColorSystem.colorize(Formatter.number(m.requests), ColorSystem.codes.brightCyan)}`,
      `Errors: ${
        ColorSystem.colorize(
          String(m.errors),
          m.errors > 5 ? ColorSystem.codes.red : ColorSystem.codes.green,
        )
      }`,
      `Active Users: ${ColorSystem.colorize(Formatter.number(m.activeUsers), ColorSystem.codes.brightMagenta)}`,
      `Avg Response: ${
        ColorSystem.colorize(
          `${m.responseTime.toFixed(0)}ms`,
          m.responseTime > 200 ? ColorSystem.codes.yellow : ColorSystem.codes.green,
        )
      }`,
    ];
    console.log(stats.join(" │ "));
    console.log("");
  }

  private renderRequestGraph() {
    const history = this.metrics.getRequestHistory();
    console.log(ColorSystem.colorize("REQUEST HISTORY (24h)", ColorSystem.codes.bright));
    console.log("");

    const sparkline = ChartRenderer.sparkline(history);
    console.log(
      `${ColorSystem.colorize("Traffic:", ColorSystem.codes.dim)} ${
        ColorSystem.colorize(sparkline, ColorSystem.codes.brightGreen)
      }`,
    );
    console.log("");
  }

  private renderEndpointTable() {
    console.log(ColorSystem.colorize("TOP ENDPOINTS", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      this.metrics.getEndpointStats(),
      [
        { key: "endpoint", label: "Endpoint", width: 20 },
        {
          key: "requests",
          label: "Requests",
          width: 12,
          align: "right",
          formatter: (v: number) => Formatter.number(v),
        },
        {
          key: "avgTime",
          label: "Avg Time",
          width: 12,
          align: "right",
          formatter: (v: number) => `${v}ms`,
        },
        {
          key: "errors",
          label: "Errors",
          width: 10,
          align: "right",
          formatter: (v: number) =>
            v > 0
              ? ColorSystem.colorize(String(v), ColorSystem.codes.red)
              : ColorSystem.colorize(String(v), ColorSystem.codes.green),
        },
      ],
    );
    console.log("");
  }

  private renderServerStatus() {
    console.log(ColorSystem.colorize("SERVER STATUS", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      this.metrics.getServerStatus(),
      [
        { key: "server", label: "Server", width: 12 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (v: string) => {
            const color = v === "healthy"
              ? ColorSystem.codes.green
              : v === "degraded"
              ? ColorSystem.codes.yellow
              : ColorSystem.codes.red;
            const symbol = v === "healthy" ? "✓" : v === "degraded" ? "⚠" : "✗";
            return ColorSystem.colorize(`${symbol} ${v}`, color);
          },
        },
        { key: "uptime", label: "Uptime", width: 12, align: "right" },
        {
          key: "load",
          label: "Load",
          width: 10,
          align: "right",
          formatter: (v: number) => {
            const color = v > 0.7
              ? ColorSystem.codes.red
              : v > 0.5
              ? ColorSystem.codes.yellow
              : ColorSystem.codes.green;
            return ColorSystem.colorize(v.toFixed(2), color);
          },
        },
      ],
    );
    console.log("");
  }

  private renderFooter() {
    console.log(
      ColorSystem.colorize(
        "─".repeat(80),
        ColorSystem.codes.dim,
      ),
    );
    console.log(
      ColorSystem.colorize(
        `Update #${this.updateCount} • Press Ctrl+C to exit • Auto-refresh every 2s`,
        ColorSystem.codes.dim,
      ),
    );
  }

  async render() {
    this.clearScreen();
    this.renderHeader();
    this.renderKeyMetrics();
    this.renderRequestGraph();
    this.renderEndpointTable();
    this.renderServerStatus();
    this.renderFooter();
    this.updateCount++;
  }

  async start() {
    // Initial render
    await this.render();

    // Set up periodic updates
    const interval = setInterval(async () => {
      this.metrics.update();
      await this.render();
    }, 2000);

    // Handle Ctrl+C gracefully
    Deno.addSignalListener("SIGINT", () => {
      clearInterval(interval);
      console.log("\n\n");
      BoxRenderer.message("Dashboard stopped", "info");
      console.log("");
      Deno.exit(0);
    });

    // Keep the process running
    await new Promise(() => {});
  }
}

// Main execution
if (import.meta.main) {
  console.clear();
  console.log("\n");

  BoxRenderer.render(
    [
      "This dashboard will refresh automatically every 2 seconds.",
      "Metrics will update with simulated real-time data.",
      "",
      "Press Ctrl+C to exit.",
    ],
    {
      title: "Real-Time Dashboard",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    },
  );

  console.log("\nStarting in 3 seconds...\n");
  await sleep(3000);

  const dashboard = new Dashboard();
  await dashboard.start();
}
