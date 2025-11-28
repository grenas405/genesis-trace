#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Keyboard Comfort Strategy
 *
 * A GenesisTrace-driven walkthrough that guides coordinators through a
 * structured plan for helping teams regain comfort with keyboards.
 *
 * Run with:
 *   deno run --allow-env --allow-read examples/education/keyboard-comfort-strategy.ts
 */

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
} from "../../mod.ts";

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const softPurple = ColorSystem.rgb(162, 140, 227);
const tealSignal = ColorSystem.rgb(42, 197, 197);
const amberAccent = ColorSystem.rgb(255, 196, 112);
const fernGreen = ColorSystem.rgb(112, 176, 102);

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "KEYBOARD COMFORT RESET",
  subtitle: "Six-stage onboarding strategy for teams returning to keyboards",
  description: "GenesisTrace walkthrough for ergonomic-focused facilitators.",
  author: "GenesisTrace Education Studio",
  width: 90,
  style: "double",
  color: softPurple,
});

console.log("\n");

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
  "keyboard-comfort",
);

// ===========================================================================
// SECTION 1: BASELINE ASSESSMENT
// ===========================================================================
ConsoleStyler.logSection("BASELINE ASSESSMENT", "brightMagenta", "double");

const assessmentSteps = [
  {
    activity: "Two-minute typing check",
    data: "Speed, accuracy, tension notes",
    facilitatorCue: "Narrate results as neutral data, not judgement",
  },
  {
    activity: "Comfort survey",
    data: "1-5 confidence, wrist/back pain",
    facilitatorCue: "Document phrases the participant uses",
  },
  {
    activity: "Workstation photo",
    data: "Chair height, monitor distance",
    facilitatorCue: "Log adjustments needed for next visit",
  },
];

TableRenderer.render(assessmentSteps, [
  { key: "activity", label: "Quick Check", width: 22 },
  { key: "data", label: "What You Capture", width: 30 },
  { key: "facilitatorCue", label: "Coach Reminder", width: 32 },
]);

BoxRenderer.render(
  [
    ColorSystem.colorize("Tip:", tealSignal),
    "",
    ...Formatter.wrap(
      "Write the starting stats on a visible board. Progress becomes a shared story that people want to continue.",
      76,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "rounded",
    color: tealSignal,
    padding: 1,
    margin: 1,
  },
);

logger.info("Baseline captured", {
  steps: assessmentSteps.length,
  signals: ["typing", "survey", "photo"],
});
await pause(900);
console.log("\n");

// ===========================================================================
// SECTION 2: ERGONOMICS & ENVIRONMENT
// ===========================================================================
ConsoleStyler.logSection("ERGONOMICS & SETUP", "brightCyan", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("Checklist", ColorSystem.codes.brightBlue),
    "",
    "- Forearms parallel to floor, wrists floating neutral",
    "- Screen top aligned with eye level, glare removed",
    "- Wrist rest or rolled towel for short forearms",
    "- 20-20-20 reminder posted (look 20ft away every 20 min)",
    "",
    ...Formatter.wrap(
      "Snap a photo once adjustments are complete. Use it during follow-ups as the default posture reference.",
      76,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "double",
    color: amberAccent,
    padding: 1,
    margin: 1,
    minWidth: 72,
  },
);

const calibrationSpinner = new Spinner({
  message: "Calibrating ergonomic setup...",
  color: tealSignal,
});
calibrationSpinner.start();
await pause(1400);
calibrationSpinner.succeed("Ergonomic posture locked in");

logger.info("Ergonomics tuned", { reminders: ["posture", "lighting", "breaks"] });
await pause(800);
console.log("\n");

// ===========================================================================
// SECTION 3: SKILL REBUILD PROGRAM
// ===========================================================================
ConsoleStyler.logSection("SKILL REBUILD PROGRAM", "brightGreen", "double");

const rebuildBlocks = [
  { block: "Warmup", focus: "Home-row pulse, breathing", cadence: "3 min" },
  { block: "Accuracy Loop", focus: "Single letters + narration", cadence: "5 min" },
  { block: "Word Builders", focus: "Common terms from job", cadence: "6 min" },
  { block: "Shortcut Spotlight", focus: "Esc → i → :w → u", cadence: "4 min" },
  { block: "Story Task", focus: "Email or invoice template", cadence: "7 min" },
];

TableRenderer.render(rebuildBlocks, [
  { key: "block", label: "Block", width: 18 },
  { key: "focus", label: "What Participants Hear", width: 38 },
  { key: "cadence", label: "Time Box", width: 10, align: "center" },
]);

const rebuildBar = new ProgressBar({
  total: rebuildBlocks.length,
  width: 44,
  label: "Session Flow",
  showPercentage: true,
  colorize: true,
});

for (let i = 0; i < rebuildBlocks.length; i++) {
  await pause(300);
  rebuildBar.update(i + 1, { suffix: ` ${rebuildBlocks[i].focus}` });
}
rebuildBar.complete();

logger.info("Practice loop defined", { stages: rebuildBlocks.length, anchorShortcut: ":w" });
await pause(900);
console.log("\n");

// ===========================================================================
// SECTION 4: MUSCLE MEMORY & EFFICIENCY
// ===========================================================================
ConsoleStyler.logSection("MUSCLE MEMORY BOOSTERS", "brightYellow", "double");

const muscleMemory = [
  {
    drill: "Call-and-response",
    description: "Coach says shortcut, team repeats action + phrase",
    outcome: "Auditory + kinesthetic sync",
  },
  {
    drill: "Shadow typing",
    description: "Type in air first, then keyboard",
    outcome: "Reduces tension, builds rhythm",
  },
  {
    drill: "Shortcut bingo",
    description: "Bingo card of essential keys; celebrate a row",
    outcome: "Gamified reinforcement",
  },
];

TableRenderer.render(muscleMemory, [
  { key: "drill", label: "Drill", width: 20 },
  { key: "description", label: "Execution", width: 36 },
  { key: "outcome", label: "Why It Works", width: 26 },
]);

BoxRenderer.render(
  [
    ColorSystem.colorize("Voice prompt:", ColorSystem.codes.brightMagenta),
    "",
    ...Formatter.wrap(
      "“Press Esc and say ‘Safe Mode.’ Now i, say ‘Typing Mode.’ Seal it with :w and say ‘Saved.’ The voice locks in the habit.”",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "single",
    color: softPurple,
    padding: 1,
    margin: 1,
  },
);

logger.info("Memory drills ready", { drills: muscleMemory.length });
await pause(800);
console.log("\n");

// ===========================================================================
// SECTION 5: HEALTH & GUARDRAILS
// ===========================================================================
ConsoleStyler.logSection("HEALTH & GUARDRAILS", "brightBlue", "double");

const guardrailTable = [
  {
    trigger: "20-minute timer",
    action: "Micro stretch + water sip",
    tool: "GenesisTrace reminder log",
  },
  { trigger: "Reported discomfort", action: "Pause, adjust chair/desk", tool: "Photo reference" },
  { trigger: "Drop in accuracy", action: "Slow drills, re-center breathing", tool: "Calm banner" },
];

TableRenderer.render(guardrailTable, [
  { key: "trigger", label: "Trigger", width: 22 },
  { key: "action", label: "Response", width: 30 },
  { key: "tool", label: "Support Tool", width: 26 },
]);

BoxRenderer.render(
  [
    ColorSystem.colorize("Health mantra", fernGreen),
    "",
    ...Formatter.wrap(
      "“Comfort beats speed. If your shoulders rise, we stop. If wrists tingle, we stretch. Safety unlocks learning.”",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "rounded",
    color: fernGreen,
    padding: 1,
    margin: 1,
  },
);

logger.info("Guardrails reinforced", { reminders: ["timer", "photo", "breathing"] });
await pause(800);
console.log("\n");

// ===========================================================================
// SECTION 6: SUPPORT & ACCOUNTABILITY
// ===========================================================================
ConsoleStyler.logSection("SUPPORT SYSTEMS", "brightRed", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("Support Stack", ColorSystem.codes.brightRed),
    "",
    "1. Pair up “typing buddies” who send daily check-ins.",
    "2. Shared leaderboard (accuracy % only) updated after each session.",
    "3. Weekly story share: record one win and one challenge.",
    "4. Manager pledge: 10 on-the-clock minutes per day for reps.",
    "",
    ...Formatter.wrap(
      "Keep stories tangible: a photo of a taped cheat sheet or a voice memo of someone narrating the Esc→i→:w loop.",
      76,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "double",
    color: softPurple,
    padding: 1,
    margin: 1,
  },
);

logger.info("Support framework activated", {
  buddyPairs: 4,
  leaderboardMetric: "accuracy",
  cadence: "daily",
});

console.log("\n");
ConsoleStyler.logSection("NEXT ACTION", "brightWhite", "single");

BoxRenderer.render(
  [
    ColorSystem.colorize("Pilot Launch Checklist", ColorSystem.codes.brightWhite),
    "",
    "✅ Select 4 participants for week-one pilot",
    "✅ Print key-card cheat sheets",
    "✅ Schedule three 25-minute blocks on-site",
    "⏭ Collect confidence surveys after day three",
  ],
  {
    style: "single",
    color: tealSignal,
    padding: 1,
    margin: 1,
    minWidth: 70,
  },
);

logger.info("Strategy complete", { followUp: "Launch pilot + gather feedback" });
