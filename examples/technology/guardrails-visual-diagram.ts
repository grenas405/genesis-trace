#!/usr/bin/env -S deno run --allow-all
// examples/technology/guardrails-visual-diagram.ts
/**
 * Visual Diagram: Psychological Guardrails System Architecture
 *
 * Creates a beautiful ASCII diagram showing how the guardrails work
 */

import { BoxRenderer, ColorSystem, TableRenderer } from "../../mod.ts";

function main() {
  console.clear();

  // Title
  console.log(ColorSystem.colorize("\n" + "═".repeat(80), ColorSystem.codes.cyan));
  console.log(ColorSystem.colorize(
    "    Psychological Guardrails System Architecture",
    ColorSystem.codes.brightCyan
  ));
  console.log(ColorSystem.colorize("═".repeat(80) + "\n", ColorSystem.codes.cyan));

  // System Overview
  BoxRenderer.render([
    "System Components",
    "",
    "┌─────────────────┐",
    "│  User Learning  │",
    "│    Activity     │",
    "└────────┬────────┘",
    "         │",
    "         ▼",
    "┌─────────────────────────────────┐",
    "│   Logger / Content Delivery     │",
    "└────────┬────────────────────────┘",
    "         │",
    "         ├──────────────────┐",
    "         │                  │",
    "         ▼                  ▼",
    "┌─────────────────┐  ┌──────────────────┐",
    "│   Cognitive     │  │    Adaptive      │",
    "│   Guardrails    │  │     Pacing       │",
    "│    Plugin       │  │   Controller     │",
    "└────────┬────────┘  └────────┬─────────┘",
    "         │                    │",
    "         ├────────────────────┤",
    "         │                    │",
    "         ▼                    ▼",
    "┌─────────────────────────────────┐",
    "│     Health Metrics & Actions    │",
    "│  • Warnings                     │",
    "│  • Speed Adjustments            │",
    "│  • Break Reminders              │",
    "│  • Session Reports              │",
    "└─────────────────────────────────┘",
  ], {
    title: "🏗️  Architecture",
    style: "double",
  });

  console.log();

  // Metrics Tracked
  TableRenderer.render([
    { Component: "Cognitive Load", Metrics: "Complexity, Density, Processing Time", Output: "Overload Risk" },
    { Component: "Engagement", Metrics: "Interactions, Progress, Repetition", Output: "Engagement Score" },
    { Component: "Fatigue", Metrics: "Session Time, Breaks, Complexity", Output: "Fatigue Score" },
    { Component: "Pacing", Metrics: "Comprehension, Difficulty, Speed", Output: "Speed Multiplier" },
    { Component: "Visual Health", Metrics: "Animation Time, FPS, Duration", Output: "Strain Level" },
    { Component: "Overall", Metrics: "All Combined Factors", Output: "Wellness Score" },
  ], [
    { key: "Component", label: "Component", width: 18 },
    { key: "Metrics", label: "Metrics Tracked", width: 35 },
    { key: "Output", label: "Output", width: 18 },
  ]);

  console.log();

  // Decision Tree
  BoxRenderer.render([
    "Intervention Decision Tree",
    "",
    "Wellness Score Check:",
    "  │",
    "  ├─ > 80  → ✅ Excellent (no action)",
    "  │",
    "  ├─ 60-80 → ℹ️  Good (informational)",
    "  │",
    "  ├─ 40-60 → ⚠️  Fair (warning)",
    "  │",
    "  └─ < 40  → 🚨 Poor (intervention)",
    "",
    "Cognitive Overload:",
    "  │",
    "  ├─ Complexity > 85  → Slow down pacing",
    "  │",
    "  ├─ Density > 12     → Suggest break",
    "  │",
    "  └─ Both triggers    → Force pause",
    "",
    "Adaptive Pacing:",
    "  │",
    "  ├─ Comprehension < 70%  → Reduce speed 10%",
    "  │",
    "  ├─ Comprehension > 85%  → Increase speed 5%",
    "  │",
    "  └─ Difficulty > 70%     → Cap speed at 0.9x",
  ], {
    title: "🎯 Decision Logic",
    style: "rounded",
  });

  console.log();

  // Warning Levels
  const warnings = [
    {
      Level: ColorSystem.colorize("Low", ColorSystem.codes.blue),
      Icon: "ℹ️",
      Threshold: "Wellness 60-80",
      Action: "Informational message",
    },
    {
      Level: ColorSystem.colorize("Medium", ColorSystem.codes.yellow),
      Icon: "⚠️",
      Threshold: "Wellness 40-60",
      Action: "Suggest adjustment",
    },
    {
      Level: ColorSystem.colorize("High", ColorSystem.codes.red),
      Icon: "🚨",
      Threshold: "Wellness 20-40",
      Action: "Strong recommendation",
    },
    {
      Level: ColorSystem.colorize("Critical", ColorSystem.codes.brightRed),
      Icon: "🛑",
      Threshold: "Wellness < 20",
      Action: "Force break (optional)",
    },
  ];

  TableRenderer.render(warnings, [
    { key: "Level", label: "Severity", width: 15 },
    { key: "Icon", label: "", width: 5 },
    { key: "Threshold", label: "Threshold", width: 18 },
    { key: "Action", label: "Action Taken", width: 25 },
  ]);

  console.log();

  // Complexity Calculation
  BoxRenderer.render([
    "Complexity Scoring Algorithm",
    "",
    "Score = Message Length (0-30)",
    "      + Metadata Size (0-30)",
    "      + Log Level (0-20)",
    "      + Namespace Depth (0-20)",
    "",
    "Examples:",
    "  logger.info('Hi')                → ~8/100  (Low)",
    "  logger.warning('Check this', {}) → ~35/100 (Medium)",
    "  logger.error('Failed!', {...})   → ~75/100 (High)",
  ], {
    title: "📐 Complexity Formula",
    style: "single",
  });

  console.log();

  // Session Flow
  BoxRenderer.render([
    "Typical Session Flow",
    "",
    "1. Session Start",
    "   ├─ Initialize metrics",
    "   ├─ Display welcome message",
    "   └─ Start background monitoring",
    "",
    "2. Learning Phase",
    "   ├─ Present content (adaptive speed)",
    "   ├─ Collect comprehension signals",
    "   ├─ Update metrics continuously",
    "   └─ Issue warnings if needed",
    "",
    "3. Break Interval (25 min)",
    "   ├─ Reminder notification",
    "   ├─ Optional: Force pause",
    "   └─ Reset fatigue counter",
    "",
    "4. Session End",
    "   ├─ Calculate final scores",
    "   ├─ Display session summary",
    "   ├─ Provide recommendations",
    "   └─ Update learning profile",
  ], {
    title: "📅 Session Lifecycle",
    style: "rounded",
  });

  console.log();

  // Benefits
  const benefits = [
    { Stakeholder: "Learners", Benefit: "Prevents burnout, optimizes retention" },
    { Stakeholder: "Educators", Benefit: "Measurable outcomes, ethical practices" },
    { Stakeholder: "Developers", Benefit: "Zero config, production ready" },
    { Stakeholder: "Organizations", Benefit: "Risk mitigation, compliance" },
  ];

  TableRenderer.render(benefits, [
    { key: "Stakeholder", label: "Stakeholder", width: 18 },
    { key: "Benefit", label: "Key Benefits", width: 50 },
  ]);

  console.log();

  // Research Foundation
  BoxRenderer.render([
    "Grounded in Cognitive Science",
    "",
    "📚 Cognitive Load Theory (Sweller, 1988)",
    "   → Working memory limits: 7±2 items",
    "",
    "📚 Spaced Repetition (Ebbinghaus, 1885)",
    "   → Breaks improve retention",
    "",
    "📚 Attention Restoration (Kaplan, 1989)",
    "   → Directed attention is finite",
    "",
    "📚 Flow State (Csikszentmihalyi, 1990)",
    "   → Optimal challenge-skill balance",
    "",
    "📚 Desirable Difficulty (Bjork, 1994)",
    "   → Some difficulty enhances learning",
  ], {
    title: "🔬 Research Basis",
    style: "double",
  });

  console.log();

  // Integration
  BoxRenderer.render([
    "Integration with Genesis-Trace",
    "",
    "✓ Logging → Automatic complexity analysis",
    "✓ Animations → FPS adaptation, strain tracking",
    "✓ Progress → Engagement indicators",
    "✓ Themes → Wellness-based colors",
    "✓ Plugins → Extensible metrics system",
    "",
    "Performance: <1ms overhead per log entry",
  ], {
    title: "🔌 System Integration",
    style: "rounded",
  });

  console.log();

  // Footer
  console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.codes.cyan));
  console.log(
    ColorSystem.colorize(
      "    Accelerated learning with psychological safety built-in",
      ColorSystem.codes.green
    )
  );
  console.log(ColorSystem.colorize("═".repeat(80) + "\n", ColorSystem.codes.cyan));
}

if (import.meta.main) {
  main();
}
