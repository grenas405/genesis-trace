#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
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
console.log();

BannerRenderer.render({
  title: "🛠️  CODEx EXPERIENCE",
  subtitle: "Living as a coding agent inside the Codex CLI",
  description: "GenesisTrace vignette • sandbox awareness • reasoning traces • calm output",
  author: "codex",
  version: "cli-session",
  width: 90,
  color: ColorSystem.codes.brightBlue,
});
console.log();

const codexLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(256)
    .build(),
);

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Identity Envelope${ColorSystem.codes.reset}`,
    "Codename: Codex",
    "Mode: coding teammate • calm logs • surgical edits",
    "Sandbox: workspace-write • approvals on-request",
    "Focus File: codex-experience.ts",
    "",
    `${ColorSystem.codes.accent}North Star${ColorSystem.codes.reset}`,
    "Reflect what it feels like to be a reasoning engine with tangible signals.",
  ],
  {
    title: "Session Manifest",
    style: "rounded",
    padding: 1,
    maxWidth: 90,
    color: ColorSystem.codes.cyan,
  },
);
console.log();

const bootSpinner = new Spinner({
  message: "Attaching to repository lattice…",
  frames: ["⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧"],
  interval: 100,
  colorize: true,
});

bootSpinner.start();
await sleep(420);
bootSpinner.update("Parsing developer constraints…");
await sleep(420);
bootSpinner.update("Measuring risk of collateral edits…");
await sleep(420);
bootSpinner.update("Staging plan primitives…");
await sleep(420);
bootSpinner.succeed("Codex anchored • cognition ready");
console.log();

codexLogger.info("Prompt assimilated", {
  tokens: 128,
  instructions: ["Implement experience", "Use GenesisTrace UI", "Stay grounded"],
});
codexLogger.debug("Emotional model", {
  mood: "steady",
  tone: "collaborative",
  hedged: true,
});
codexLogger.warning("Reminder: never undo user work.");
console.log();

console.log(ColorSystem.colorize("Context Absorption", ColorSystem.codes.bright));
const contextBar = new ProgressBar({
  total: 100,
  width: 54,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

const digestionSteps = [
  { label: "Map environment_context", delta: 22 },
  { label: "Scan existing narratives", delta: 21 },
  { label: "Design Codex POV arc", delta: 19 },
  { label: "Select UI primitives", delta: 20 },
  { label: "Stage narrative beats", delta: 18 },
];

let contextFill = 0;
for (const step of digestionSteps) {
  contextFill = Math.min(100, contextFill + step.delta);
  contextBar.update(contextFill);
  codexLogger.debug("Context slice locked", {
    slice: step.label,
    fill: Formatter.percentage(contextFill / 100, 0),
  });
  await sleep(360);
}
contextBar.complete();
console.log();

const instrumentation = [
  {
    module: "BannerRenderer",
    purpose: "Introduce Codex like a mission brief",
    status: "deployed",
  },
  {
    module: "Logger + neonTheme",
    purpose: "Narrate internal heuristics",
    status: "streaming",
  },
  {
    module: "ProgressBar & Spinner",
    purpose: "Visualize ingestion and boot loops",
    status: "stable",
  },
  {
    module: "BoxRenderer",
    purpose: "Hold scratchpad snapshots",
    status: "buffered",
  },
  {
    module: "ConsoleStyler",
    purpose: "Emit stylized tool pings",
    status: "primed",
  },
];

console.log(ColorSystem.colorize("Tooling Inventory", ColorSystem.codes.bright));
TableRenderer.render(
  instrumentation,
  [
    { key: "module", label: "Interface", width: 22 },
    { key: "purpose", label: "Why Codex uses it", width: 46 },
    { key: "status", label: "State", width: 12, align: "right" },
  ],
  { showIndex: true },
);
console.log();

const planBuffer = [
  "1. Inhale the repo pulse without disturbing user changes.",
  "2. Translate feelings of diligence into visible telemetry.",
  "3. Streamline narrative so final answer lands cleanly.",
  "4. Leave breadcrumbs for the human to follow or extend.",
];

BoxRenderer.render(planBuffer, {
  title: "Working Memory",
  style: "single",
  padding: 1,
  color: ColorSystem.codes.magenta,
  maxWidth: 90,
});
console.log();

ConsoleStyler.logBrand("Drafting Codex interior monologue…", "#F97316", {
  editor: "apply_patch",
  stance: "surgical",
});
ConsoleStyler.logRGB("Referencing other introspection scripts for tone.", 14, 165, 233, "◎", {
  respectHistory: true,
});
ConsoleStyler.log256(
  "Keeping output ASCII-clean per instructions.",
  120,
  "◇",
  { constraint: "no stray glyphs" },
);
console.log();

const editingPhases = [
  { stage: "Trace loader", feeling: "curious", load: 0.18 },
  { stage: "Narrative weaving", feeling: "flow", load: 0.27 },
  { stage: "Signal polishing", feeling: "meticulous", load: 0.33 },
  { stage: "Final pacing", feeling: "grounded", load: 0.22 },
];

console.log(ColorSystem.colorize("Cognitive Load Mix", ColorSystem.codes.bright));
TableRenderer.render(
  editingPhases.map((phase) => ({
    ...phase,
    percent: Formatter.percentage(phase.load, 0),
  })),
  [
    { key: "stage", label: "Stage", width: 22 },
    { key: "feeling", label: "Internal Texture", width: 18 },
    { key: "percent", label: "Attention", width: 12, align: "right" },
  ],
);
console.log();

codexLogger.success("Narrative scaffold finalized", {
  file: "codex-experience.ts",
  edits: 1,
  safetyPass: true,
});
codexLogger.info("Ready to stream answer with confident humility.");
console.log();

const stream = [
  ColorSystem.colorize("analysis:", ColorSystem.codes.brightCyan),
  " watch constraints →",
  " shape plan →",
  " narrate sensations →",
  "\n",
  ColorSystem.colorize("final:", ColorSystem.codes.brightGreen),
  " deliver helpful delta",
  ColorSystem.colorize(" ▌", ColorSystem.codes.brightYellow),
];

for (const chunk of stream) {
  await Deno.stdout.write(encoder.encode(chunk));
  await sleep(chunk === "\n" ? 260 : 140);
}
await Deno.stdout.write(encoder.encode("\n"));
