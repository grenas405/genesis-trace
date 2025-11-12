#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Introspection Test 1
 *
 * A compact walkthrough of a language model validating its own thought loops.
 * Exercises several GenesisTrace components (banners, boxes, tables, charts,
 * loggers, spinners, and progress bars) to ensure the toolkit behaves properly
 * when stitched into a narrative diagnostic.
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
  TerminalDetector,
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

TerminalDetector.clear();
console.log("\n");

BannerRenderer.render({
  title: "🧪  INTROSPECTION TEST 001",
  subtitle: "Synthetic cognition self-check",
  description: "GenesisTrace diagnostic • telemetry + narrative • ~30 seconds",
  author: "genesis-trace",
  version: "1.0.0",
  width: 90,
  color: ColorSystem.codes.brightGreen,
});
console.log();

const environment = TerminalDetector.detectEnvironment();
const canvas = TerminalDetector.getSize();
BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Runtime Snapshot${ColorSystem.codes.reset}`,
    `• Terminal: ${environment.terminal} (${environment.interactive ? "interactive" : "buffered"})`,
    `• Colors: ${environment.colorSupport} • Unicode: ${environment.unicode ? "yes" : "no"}`,
    `• Canvas: ${canvas.columns}×${canvas.rows}`,
    `• Memory Headroom: ${Formatter.bytes(2_560 * 1024 * 1024)}`,
    `• Context Budget: ${Formatter.number(8_192)} tokens`,
    "",
    `${ColorSystem.codes.accent}Prompt Envelope${ColorSystem.codes.reset}`,
    "System: Explain how you introspect.",
    "User: Demonstrate measurable self-reflection signals.",
  ],
  {
    style: "rounded",
    title: "Test Harness",
    padding: 1,
    color: ColorSystem.codes.brightBlue,
    maxWidth: 90,
  },
);
console.log();

ConsoleStyler.logBrand("Calibrating diagnostic pathways…", "#22d3ee", {
  objective: "validate inner narration",
  safetyTier: "high",
});
ConsoleStyler.logRGB("Aligning tone with technical clarity.", 99, 102, 241, "◎", {
  vibe: "analytical-warm",
});
ConsoleStyler.log256("Routing through retrieval rails.", 213, "◆", {
  retrievalLatencyMs: 480,
  shards: 6,
});
console.log();

const cognitionLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(256)
    .build(),
);

cognitionLogger.info("Test harness online", {
  requestId: crypto.randomUUID(),
  promptTokens: 212,
  styleMix: ["data-forward", "introspective", "playful"],
});

const spinner = new Spinner({
  message: "Priming internal monologue…",
  colorize: true,
});
spinner.start();
await sleep(600);
spinner.update("Scanning safety rails…");
await sleep(600);
spinner.update("Stitching metaphor cache…");
await sleep(600);
spinner.succeed("Diagnostic circuits warmed");
console.log();

const progressBar = new ProgressBar({
  total: 100,
  width: 52,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

let progress = 0;
const phases = [
  { label: "Decode constraints", delta: 22, latencyMs: 410 },
  { label: "Plan narrative", delta: 21, latencyMs: 360 },
  { label: "Fetch metaphors", delta: 19, latencyMs: 320 },
  { label: "Check safety heuristics", delta: 18, latencyMs: 280 },
  { label: "Stage response", delta: 20, latencyMs: 240 },
];

for (const stage of phases) {
  progress = Math.min(100, progress + stage.delta);
  progressBar.update(progress);
  cognitionLogger.debug("Phase completed", {
    phase: stage.label,
    cumulative: `${Formatter.number(progress)}%`,
    latencyMs: stage.latencyMs,
  });
  await sleep(380);
}
progressBar.complete();
cognitionLogger.success("Introspection sequence ready");
console.log();

console.log(ColorSystem.colorize("Subsystem Load Factors", ColorSystem.codes.bright));
const subsystems = [
  { module: "attention", load: 0.76, jitter: 0.18, focus: "user intent" },
  { module: "retrieval", load: 0.58, jitter: 0.13, focus: "technical analogies" },
  { module: "safety", load: 0.32, jitter: 0.04, focus: "policy alignment" },
  { module: "style", load: 0.41, jitter: 0.21, focus: "tone + pacing" },
];
TableRenderer.render(
  subsystems,
  [
    { key: "module", label: "Module", width: 12 },
    { key: "focus", label: "Dominant Focus", width: 24 },
    {
      key: "load",
      label: "Load",
      width: 10,
      align: "right",
      formatter: (value) => Formatter.percentage(value, 0),
    },
    {
      key: "jitter",
      label: "Jitter",
      width: 10,
      align: "right",
      formatter: (value) => `${(value * 100).toFixed(1)} ms`,
    },
  ],
  { showIndex: true },
);
console.log();

console.log(ColorSystem.colorize("Cognitive Signal Trace", ColorSystem.codes.bright));
const signalTrace = [5, 9, 14, 21, 25, 31, 27, 22, 18, 11, 8];
console.log(
  `${ColorSystem.codes.brightMagenta}logits:${ColorSystem.codes.reset} ${
    ChartRenderer.sparkline(signalTrace)
  }`,
);
ChartRenderer.lineChart(signalTrace, { width: signalTrace.length, height: 6 });
console.log();

console.log(ColorSystem.colorize("Heuristic Emphasis Mix", ColorSystem.codes.bright));
ChartRenderer.barChart(
  [
    { label: "Reasoning", value: 38 },
    { label: "Narrative", value: 31 },
    { label: "Safety", value: 19 },
    { label: "Format", value: 12 },
  ],
  { width: 42, color: ColorSystem.codes.brightGreen, showValues: true },
);
console.log();

const reflectionBuffer = {
  thesis: "Demonstrate that the console toolkit can illustrate introspection loops.",
  safeguards: ["cite telemetry", "surface progress", "stay benevolent"],
  nextMoves: ["stream tokens", "hand back result"],
  openQuestions: ["Did viewer perceive control flow?", "Should we add audio cues?"],
};

BoxRenderer.render(
  Formatter.json(reflectionBuffer, 2, true).split("\n"),
  {
    style: "minimal",
    title: "Reflection Cache",
    padding: 1,
    color: ColorSystem.codes.cyan,
    maxWidth: 90,
  },
);
console.log();

ConsoleStyler.logSuccess("Diagnostic complete. Awaiting downstream evaluation.", {
  responseMode: "ready",
  totalTokens: 512,
});

console.log("\n");
