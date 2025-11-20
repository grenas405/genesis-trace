#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Inside the LLM
 *
 * A compact animation that walks through the mental motions of a large language model.
 * Features used:
 *   • Banner introduction with theming
 *   • Logger with neon theme for narrative beats
 *   • Spinner playlist to simulate warmup routines
 *   • Progress bar showing context absorption
 *   • Token stream rendered directly to stdout
 *   • Summary table of inference vitals
 */

import {
  BannerRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

console.clear();
console.log("\n");

// =============================================================================
// 1. CORTICAL BOOT SEQUENCE
// =============================================================================

BannerRenderer.render({
  title: "🧠 INSIDE THE LLM",
  subtitle: "A blink-sized tour through synthetic cognition",
  description: "GenesisTrace Animation • context loading • attention pulsing • tokens streaming",
  version: "session-42",
  author: "GenesisTrace Lab",
  width: 90,
  color: ColorSystem.codes.brightMagenta,
});
console.log("\n");

console.log(ColorSystem.colorize("1. Cortical Boot Sequence", ColorSystem.codes.bright));

const cortexLogger = new Logger(
  new ConfigBuilder().theme(neonTheme).logLevel("debug").build(),
);

const bootSpinner = new Spinner({
  message: "Hydrating parameter tensors...",
  frames: ["⠂", "⠒", "⠤", "⠒"],
  interval: 120,
});

bootSpinner.start();
await sleep(600);
bootSpinner.update("Priming attention heads...");
await sleep(600);
bootSpinner.update("Syncing retrieval adapters...");
await sleep(600);
bootSpinner.update("Establishing safety rails...");
await sleep(600);
bootSpinner.succeed("Inference surface stable • Ready for prompts");
console.log("\n");

cortexLogger.success("Parameter hydration complete");
cortexLogger.info("Attention lattice warmed to operational temperature");
cortexLogger.debug("Adapters engaged", {
  tools: ["search", "calculator", "sandbox"],
  latencyBudgetMs: 320,
});
console.log("\n");

// =============================================================================
// 2. CONTEXT WINDOW INGESTION
// =============================================================================

console.log(ColorSystem.colorize("2. Context Window Ingestion", ColorSystem.codes.bright));

const contextBar = new ProgressBar({
  total: 100,
  width: 56,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

let progress = 0;
const contextSlices = [
  { label: "Instruction parsing", delta: 18, syllables: 120 },
  { label: "Background embeddings", delta: 24, syllables: 310 },
  { label: "Constraint alignment", delta: 21, syllables: 180 },
  { label: "Planning scaffold", delta: 19, syllables: 140 },
  { label: "Response staging", delta: 18, syllables: 95 },
];

for (const slice of contextSlices) {
  progress = Math.min(100, progress + slice.delta);
  contextBar.update(progress);
  cortexLogger.debug("Context slice absorbed", {
    stage: slice.label,
    syllables: slice.syllables,
    fill: `${Formatter.number(progress)}%`,
  });
  await sleep(420);
}

contextBar.complete();
cortexLogger.info("Context lattice stabilized at 8192 tokens");
console.log("\n");

// =============================================================================
// 3. TOKEN STREAM
// =============================================================================

console.log(ColorSystem.colorize("3. Token Stream", ColorSystem.codes.bright));

const tokenStream = [
  ColorSystem.colorize("analysis:", ColorSystem.codes.brightCyan),
  " sensing intent →",
  " mapping constraints →",
  " rehearsing plan →",
  " crafting narrative →",
  "\n",
  ColorSystem.colorize("final:", ColorSystem.codes.brightGreen),
  " delivering aligned response",
  ColorSystem.colorize(" █", ColorSystem.codes.brightYellow),
];

for (const chunk of tokenStream) {
  await Deno.stdout.write(encoder.encode(chunk));
  await sleep(chunk === "\n" ? 250 : 140);
}
await Deno.stdout.write(encoder.encode("\n\n"));

// =============================================================================
// 4. INFERENCE VITALS
// =============================================================================

console.log(ColorSystem.colorize("4. Inference Vitals", ColorSystem.codes.bright));

TableRenderer.render(
  [
    {
      phase: "Warmup",
      tokens: 512,
      tps: 0,
      latencyMs: 380,
    },
    {
      phase: "Planning",
      tokens: 1024,
      tps: 280,
      latencyMs: 142,
    },
    {
      phase: "Generation",
      tokens: 768,
      tps: 192,
      latencyMs: 96,
    },
  ],
  [
    { key: "phase", label: "Phase", width: 16 },
    {
      key: "tokens",
      label: "Tokens",
      width: 10,
      align: "right",
      formatter: (value) => Formatter.number(value),
    },
    {
      key: "tps",
      label: "Tokens/Sec",
      width: 12,
      align: "right",
      formatter: (value) => value ? Formatter.number(value) : "priming",
    },
    {
      key: "latencyMs",
      label: "Latency (ms)",
      width: 14,
      align: "right",
      formatter: (value) => Formatter.number(value),
    },
  ],
  { showIndex: true },
);
console.log("\n");

cortexLogger.success("Response shipped with alignment intact");
cortexLogger.info("Buffers flushed • awaiting next prompt");

console.log("\n");
