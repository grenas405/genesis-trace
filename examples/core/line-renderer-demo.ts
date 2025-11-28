#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Line Renderer Demo
 *
 * Demonstrates the LineRenderer for simpler status displays
 * and real-time updates without full screen rendering.
 *
 * Features:
 *   • Line-based updates (only update specific lines)
 *   • Batched line updates for efficiency
 *   • Perfect for status displays, logs, dashboards
 *   • Minimal terminal writes - no glitching
 */

import { ColorSystem, LineRenderer } from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Create renderer
const renderer = new LineRenderer();
renderer.setup();

// Cleanup handler
const cleanup = () => {
  renderer.cleanup();
  Deno.exit(0);
};

// Handle Ctrl+C
Deno.addSignalListener("SIGINT", cleanup);

// =============================================================================
// DEMO 1: Real-time Status Dashboard
// =============================================================================

async function statusDashboardDemo() {
  renderer.clear();

  // Header
  renderer.updateLine(1, ColorSystem.colorize("╔════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightCyan));
  renderer.updateLine(2, ColorSystem.colorize("║        📊 REAL-TIME STATUS DASHBOARD - LINE RENDERER              ║", ColorSystem.codes.brightCyan));
  renderer.updateLine(3, ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightCyan));
  renderer.updateLine(4, "");

  // Simulate real-time data updates
  for (let i = 0; i < 60; i++) {
    const timestamp = new Date().toISOString();
    const cpuUsage = (30 + Math.random() * 40).toFixed(1);
    const memUsage = (50 + Math.random() * 30).toFixed(1);
    const activeUsers = Math.floor(100 + Math.random() * 50);
    const requestsPerSec = Math.floor(500 + Math.random() * 200);

    // Update only the lines that changed
    renderer.updateLine(
      5,
      `  ${ColorSystem.colorize("Timestamp:", ColorSystem.codes.bright)} ${ColorSystem.colorize(timestamp, ColorSystem.codes.cyan)}`,
    );
    renderer.updateLine(6, "");
    renderer.updateLine(
      7,
      `  ${ColorSystem.colorize("CPU Usage:", ColorSystem.codes.bright)} ${
        ColorSystem.colorize(`${cpuUsage}%`, parseFloat(cpuUsage) > 60 ? ColorSystem.codes.red : ColorSystem.codes.green)
      } ${renderBar(parseFloat(cpuUsage), 100, 30)}`,
    );
    renderer.updateLine(
      8,
      `  ${ColorSystem.colorize("Memory Usage:", ColorSystem.codes.bright)} ${
        ColorSystem.colorize(`${memUsage}%`, parseFloat(memUsage) > 70 ? ColorSystem.codes.yellow : ColorSystem.codes.green)
      } ${renderBar(parseFloat(memUsage), 100, 30)}`,
    );
    renderer.updateLine(9, "");
    renderer.updateLine(
      10,
      `  ${ColorSystem.colorize("Active Users:", ColorSystem.codes.bright)} ${ColorSystem.colorize(activeUsers.toString(), ColorSystem.codes.brightYellow)}`,
    );
    renderer.updateLine(
      11,
      `  ${ColorSystem.colorize("Requests/sec:", ColorSystem.codes.bright)} ${ColorSystem.colorize(requestsPerSec.toString(), ColorSystem.codes.brightMagenta)}`,
    );
    renderer.updateLine(12, "");
    renderer.updateLine(
      13,
      `  ${ColorSystem.colorize("Status:", ColorSystem.codes.bright)} ${ColorSystem.colorize("● RUNNING", ColorSystem.codes.brightGreen)}`,
    );
    renderer.updateLine(14, "");
    renderer.updateLine(
      15,
      ColorSystem.colorize(`  Frame: ${i + 1}/60 - Only changed lines are updated!`, ColorSystem.codes.dim),
    );

    await sleep(100);
  }
}

function renderBar(value: number, max: number, width: number): string {
  const filled = Math.floor((value / max) * width);
  const empty = width - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);

  if (value > 70) {
    return ColorSystem.colorize(bar, ColorSystem.codes.red);
  } else if (value > 50) {
    return ColorSystem.colorize(bar, ColorSystem.codes.yellow);
  } else {
    return ColorSystem.colorize(bar, ColorSystem.codes.green);
  }
}

await statusDashboardDemo();
await sleep(1000);

// =============================================================================
// DEMO 2: Log Streaming
// =============================================================================

async function logStreamingDemo() {
  renderer.clear();

  // Header
  renderer.updateLine(1, ColorSystem.colorize("╔════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightMagenta));
  renderer.updateLine(2, ColorSystem.colorize("║              📝 LOG STREAMING - BATCHED UPDATES                    ║", ColorSystem.codes.brightMagenta));
  renderer.updateLine(3, ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightMagenta));
  renderer.updateLine(4, "");

  const logLevels = ["INFO", "DEBUG", "WARN", "ERROR", "SUCCESS"];
  const logColors = [
    ColorSystem.codes.cyan,
    ColorSystem.codes.dim,
    ColorSystem.codes.yellow,
    ColorSystem.codes.red,
    ColorSystem.codes.green,
  ];
  const logMessages = [
    "Database connection established",
    "Processing user request #",
    "Cache hit for key:",
    "API rate limit approaching",
    "Failed to connect to service",
    "Transaction completed successfully",
    "Query executed in",
    "Memory usage threshold exceeded",
  ];

  const maxLogs = 15;
  const logs: string[] = [];

  for (let i = 0; i < 50; i++) {
    const level = logLevels[Math.floor(Math.random() * logLevels.length)];
    const color = logColors[logLevels.indexOf(level)];
    const message = logMessages[Math.floor(Math.random() * logMessages.length)] + ` ${Math.floor(Math.random() * 1000)}`;
    const timestamp = new Date().toLocaleTimeString();

    const logEntry = `${ColorSystem.colorize(`[${timestamp}]`, ColorSystem.codes.dim)} ${
      ColorSystem.colorize(`[${level}]`, color)
    } ${message}`;

    logs.push(logEntry);
    if (logs.length > maxLogs) {
      logs.shift();
    }

    // Update all log lines at once (batched)
    const updates = new Map<number, string>();
    for (let j = 0; j < logs.length; j++) {
      updates.set(5 + j, `  ${logs[j]}`);
    }

    renderer.updateLines(updates);

    await sleep(200);
  }
}

await logStreamingDemo();
await sleep(1000);

// =============================================================================
// DEMO 3: Progress Tracker
// =============================================================================

async function progressTrackerDemo() {
  renderer.clear();

  // Header
  renderer.updateLine(1, ColorSystem.colorize("╔════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightGreen));
  renderer.updateLine(2, ColorSystem.colorize("║            🚀 MULTI-TASK PROGRESS TRACKER                          ║", ColorSystem.codes.brightGreen));
  renderer.updateLine(3, ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightGreen));
  renderer.updateLine(4, "");

  const tasks = [
    { name: "Downloading dependencies", progress: 0, speed: 2.5, status: "⏳" },
    { name: "Compiling TypeScript", progress: 0, speed: 1.8, status: "⏳" },
    { name: "Running tests", progress: 0, speed: 1.2, status: "⏳" },
    { name: "Building production bundle", progress: 0, speed: 0.9, status: "⏳" },
    { name: "Deploying to server", progress: 0, speed: 1.5, status: "⏳" },
  ];

  while (tasks.some((t) => t.progress < 100)) {
    const updates = new Map<number, string>();

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      // Update progress
      if (task.progress < 100) {
        task.progress = Math.min(100, task.progress + task.speed + Math.random() * 0.5);

        if (task.progress >= 100) {
          task.status = "✅";
        }
      }

      // Format line
      const barWidth = 40;
      const filled = Math.floor((task.progress / 100) * barWidth);
      const empty = barWidth - filled;
      const bar = "█".repeat(filled) + "░".repeat(empty);

      let color;
      if (task.progress >= 100) {
        color = ColorSystem.codes.green;
      } else if (task.progress >= 50) {
        color = ColorSystem.codes.yellow;
      } else {
        color = ColorSystem.codes.cyan;
      }

      const line = `  ${task.status} ${ColorSystem.colorize(task.name.padEnd(30), ColorSystem.codes.white)} ${
        ColorSystem.colorize(bar, color)
      } ${ColorSystem.colorize(`${task.progress.toFixed(1)}%`.padStart(6), ColorSystem.codes.bright)}`;

      updates.set(6 + i * 2, line);
    }

    // Update all progress lines at once
    renderer.updateLines(updates);

    await sleep(100);
  }

  // Final message
  await sleep(500);
  renderer.updateLine(18, "");
  renderer.updateLine(19, ColorSystem.colorize("  🎉 All tasks completed successfully!", ColorSystem.codes.brightGreen));
  await sleep(2000);
}

await progressTrackerDemo();

// =============================================================================
// Cleanup
// =============================================================================

await sleep(1000);
cleanup();
