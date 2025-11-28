#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Internal Process Negotiation
 *
 * Demonstrates how GenesisTrace can visualize two competing internal processes
 * that initially disagree, negotiate trade-offs, and land on a resolution.
 * Each process is rendered with a distinct color and box style to make their
 * perspectives immediately recognizable.
 *
 * Run with:
 *   deno run -A examples/commerce/internal-process-negotiation.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  TableRenderer,
} from "jsr:@pedromdominguez/genesis-trace@^1.0.1";

type ProcessPersona = {
  id: "vision" | "guardian";
  name: string;
  icon: string;
  role: string;
  style: "double" | "rounded";
  color: string;
  objective: string;
  tolerance: string;
};

type Voice = {
  tone: string;
  signal: string;
  message: string;
  ask: string;
  confidence: number;
};

type NegotiationFrame = {
  stage: string;
  tension: string;
  vision: Voice;
  guardian: Voice;
  jointAction: string;
};

const processes: ProcessPersona[] = [
  {
    id: "vision",
    name: "Vision Thread",
    icon: "⚡",
    role: "Exploratory strategist pushing for bold releases",
    style: "double",
    color: ColorSystem.codes.brightCyan,
    objective: "Ship the autonomy patch tonight",
    tolerance: "High appetite for ambiguity",
  },
  {
    id: "guardian",
    name: "Guardian Thread",
    icon: "🛡️",
    role: "Reliability custodian ensuring safety margins",
    style: "rounded",
    color: ColorSystem.codes.brightYellow,
    objective: "Protect uptime and telemetry quality",
    tolerance: "Zero tolerance for silent regressions",
  },
];

const negotiation: NegotiationFrame[] = [
  {
    stage: "Conflict Detection",
    tension: "Confidence delta between fast movers and safety watchdogs",
    vision: {
      tone: "Assertive",
      signal: "Momentum spike detected",
      message: "Confidence at 91%. Every hour we wait loses real feedback loops.",
      ask: "Authorize midnight launch window.",
      confidence: 0.91,
    },
    guardian: {
      tone: "Skeptical",
      signal: "Risk meter trending crimson",
      message: "Coverage gaps on new telemetry feed. Blind spots stay blind if we rush.",
      ask: "Hold launch until sensors hit 97% capture.",
      confidence: 0.68,
    },
    jointAction: "Audit telemetry deficit and surface exact blast radius.",
  },
  {
    stage: "Negotiation",
    tension: "Need for upside vs. promise of reversibility",
    vision: {
      tone: "Diplomatic",
      signal: "Compromise packet ready",
      message: "We can bundle an automated rollback and fuse gating with canary cohorts.",
      ask: "Approve a staged push with observers online.",
      confidence: 0.84,
    },
    guardian: {
      tone: "Analytical",
      signal: "Safeguards enumerated",
      message:
        "Need proof that rollback completes within 45s and diagnostics hit cold paths first.",
      ask: "Instrument rollout timers + add circuit breaker.",
      confidence: 0.74,
    },
    jointAction: "Prototype rollback rehearsal + add live circuit breaker metrics.",
  },
  {
    stage: "Resolution",
    tension: "Shared ownership of guardrails",
    vision: {
      tone: "Committed",
      signal: "Launch plan updated",
      message: "Telemetry patch merged, runbooks rewritten, and we staffed shadow responders.",
      ask: "Green-light execution with Guardian as co-owner.",
      confidence: 0.96,
    },
    guardian: {
      tone: "Reassured",
      signal: "Risk delta neutralized",
      message: "Instrumentation coverage now 98%. Rollback rehearsals passed in 37 seconds.",
      ask: "Proceed if live metrics stay within guard band.",
      confidence: 0.93,
    },
    jointAction: "Co-sign release with shared dashboard + auto stop-loss triggers.",
  },
];

const resolutionLedger = [
  {
    axis: "Telemetry Coverage",
    decision: "Raised to 98% via extra probes & dual-stream sampling",
    owner: "Guardian",
  },
  {
    axis: "Rollback Assurance",
    decision: "Automated rollback rehearsed (37s) & wired to alerting mesh",
    owner: "Vision",
  },
  {
    axis: "Guard Band",
    decision: "Circuit breaker trips at +6% error delta for 3 consecutive samples",
    owner: "Joint Command",
  },
];

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(false)
    .build(),
  "internal-process",
);

const wrap = (text: string, width: number, color?: string) =>
  Formatter.wrap(text, width).map((line) => color ? ColorSystem.colorize(line, color) : line);

function renderVoice(process: ProcessPersona, voice: Voice): void {
  const header = `${ColorSystem.colorize(voice.tone.toUpperCase(), process.color)} • ${
    ColorSystem.colorize(voice.signal, ColorSystem.codes.bright)
  }`;
  const body = wrap(voice.message, 70, ColorSystem.codes.brightWhite);
  const ask = ColorSystem.colorize(`ASK: ${voice.ask}`, ColorSystem.codes.dim);
  const confidence = ColorSystem.colorize(
    `Confidence ${Formatter.percentage(voice.confidence, 0)}`,
    process.color,
  );

  BoxRenderer.render([header, "", ...body, "", ask, confidence], {
    style: process.style,
    color: process.color,
    padding: 1,
    margin: 1,
    title: `${process.icon} ${process.name}`,
    minWidth: 80,
    maxWidth: 90,
  });
}

function divider(): void {
  console.log(ColorSystem.colorize("─".repeat(94), ColorSystem.codes.dim));
}

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "INTERNAL PROCESS NEGOTIATION",
  subtitle: "Mapping disagreement ➜ bargaining ➜ alignment",
  description: "GenesisTrace vignette showing two inner command loops resolving tension.",
  version: "v1.2",
  author: "GenesisTrace Studio",
  width: 90,
  style: "double",
  color: ColorSystem.codes.brightMagenta,
});

console.log("\n");
TableRenderer.render(
  processes.map((process) => ({
    process: `${process.icon} ${process.name}`,
    role: process.role,
    objective: process.objective,
    tolerance: process.tolerance,
  })),
  [
    { key: "process", label: "Process", width: 18 },
    { key: "role", label: "Persona", width: 38 },
    { key: "objective", label: "Primary Objective", width: 28 },
    { key: "tolerance", label: "Risk Posture", width: 22 },
  ],
  { maxWidth: 112, showIndex: false },
);

divider();

negotiation.forEach((frame, index) => {
  logger.warning(
    `${
      ColorSystem.colorize(`Stage ${index + 1}: ${frame.stage}`, ColorSystem.codes.brightMagenta)
    } — ${frame.tension}`,
  );

  renderVoice(processes[0], frame.vision);
  renderVoice(processes[1], frame.guardian);

  BoxRenderer.render(
    wrap(frame.jointAction, 76, ColorSystem.codes.brightGreen),
    {
      style: "bold",
      color: ColorSystem.codes.brightGreen,
      title: "🤝 Joint Action",
      padding: 1,
      margin: 2,
      minWidth: 82,
    },
  );

  divider();
});

TableRenderer.render(
  resolutionLedger,
  [
    { key: "axis", label: "Axis", width: 20 },
    { key: "decision", label: "Decision", width: 60 },
    { key: "owner", label: "Owner", width: 20 },
  ],
  { maxWidth: 110 },
);

BoxRenderer.render(
  [
    ColorSystem.colorize(
      "Consensus ✅ Launch authorized under guardrails.",
      ColorSystem.codes.brightGreen,
    ),
    "",
    ColorSystem.colorize(
      "Vision Thread gets speed, Guardian Thread gets observability. Both own the flight deck.",
      ColorSystem.codes.brightWhite,
    ),
  ],
  {
    style: "minimal",
    color: ColorSystem.codes.brightGreen,
    padding: 1,
    margin: 2,
    minWidth: 80,
    title: "Resolution",
  },
);

logger.success("Conflict resolved with co-ownership of telemetry, rollback, and guard bands.");
