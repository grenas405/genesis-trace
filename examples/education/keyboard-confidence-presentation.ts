#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Keyboard Confidence Presentation
 *
 * A guided presentation for non-technical business owners that explains
 * Neovim/keyboard shortcuts with everyday analogies using GenesisTrace.
 *
 * Run with:
 *   deno run --allow-env --allow-read examples/education/keyboard-confidence-presentation.ts
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
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const calmBlue = ColorSystem.rgb(92, 142, 204);
const neonCoral = ColorSystem.rgb(255, 105, 97);
const limeAccent = ColorSystem.rgb(118, 255, 122);

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "KEYBOARD CONFIDENCE LAB",
  subtitle: "Explaining Neovim keys with plain-language metaphors",
  description: "A GenesisTrace presentation built for local businesses and non-technical owners.",
  author: "GenesisTrace Education Studio",
  width: 90,
  style: "double",
  color: calmBlue,
});

console.log("\n");

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(false)
    .build(),
  "keyboard-confidence",
);

// ===========================================================================
// SECTION 1: WHY KEYBOARD COMFORT MATTERS
// ===========================================================================
ConsoleStyler.logSection("WHY THIS MATTERS", "brightCyan", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize(
      "Imagine your register only responds when it trusts your touch.",
      calmBlue,
    ),
    "",
    ...Formatter.wrap(
      "Neovim looks intimidating because it keeps one hand on the wheel at all times. " +
        "Once people see that every key has a simple job—just like buttons on a register—they relax.",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
    "",
    ColorSystem.colorize(
      "We translate every shortcut into a familiar action before we ever touch code.",
      ColorSystem.codes.brightBlack,
    ),
  ],
  {
    style: "double",
    color: calmBlue,
    padding: 1,
    margin: 1,
    minWidth: 80,
  },
);

await sleep(1500);
console.log("\n");

// ===========================================================================
// SECTION 2: KEY TRANSLATION TABLE
// ===========================================================================
ConsoleStyler.logSection("KEYS IN PLAIN LANGUAGE", "brightGreen", "double");

const keyMappings = [
  { key: "Esc", techName: "Normal Mode", plainSpeech: "Close the form and keep data safe" },
  { key: "i", techName: "Insert Mode", plainSpeech: "Tell it you're ready to type words" },
  {
    key: "h / j / k / l",
    techName: "Home Row Arrows",
    plainSpeech: "Left, down, up, right without moving your wrist",
  },
  { key: ":w", techName: "Write File", plainSpeech: "Stamp the page so nothing gets lost" },
  { key: "u", techName: "Undo", plainSpeech: "Pull back the last price you typed" },
  {
    key: "/word",
    techName: "Search",
    plainSpeech: "Ask it to highlight every product name you say next",
  },
];

TableRenderer.render(keyMappings, [
  { key: "key", label: "Keys", width: 12 },
  { key: "techName", label: "What Geeks Say", width: 20 },
  { key: "plainSpeech", label: "What We Say", width: 50 },
]);

logger.info("Shared Neovim key translations", {
  totalKeys: keyMappings.length,
  focus: "insert + navigation + safety",
});

await sleep(1200);
console.log("\n");

// ===========================================================================
// SECTION 3: PRACTICE LOOP WALKTHROUGH
// ===========================================================================
ConsoleStyler.logSection("PRACTICE LOOP", "brightYellow", "double");

const practiceLoop = [
  { step: "1. Map Story", focus: "Explain Esc as the safety key", duration: "2 min" },
  { step: "2. Physical Reps", focus: "Tap key + watch neon feedback", duration: "5 min" },
  { step: "3. Voice-Back", focus: "Participants read the message aloud", duration: "3 min" },
  { step: "4. Micro Goal", focus: "Save and undo with :w + u", duration: "4 min" },
];

TableRenderer.render(practiceLoop, [
  { key: "step", label: "Flow", width: 16 },
  { key: "focus", label: "What Students Hear", width: 36 },
  { key: "duration", label: "Time Box", width: 10, align: "center" },
]);

const flowBar = new ProgressBar({
  total: practiceLoop.length,
  width: 40,
  label: "Orientation Flow",
  showPercentage: true,
  colorize: true,
});

for (let i = 0; i < practiceLoop.length; i++) {
  await sleep(350);
  flowBar.update(i + 1, { suffix: ` ${practiceLoop[i].focus}` });
}
flowBar.complete();

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("Coach Prompt:", neonCoral),
    "",
    ...Formatter.wrap(
      "“Press Esc with your ring finger. See the teal banner? Say it out loud: ‘Safe Mode ON.’ " +
        "Now press i and say, ‘Typing mode.’ The voice reinforces muscle memory.”",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "rounded",
    color: neonCoral,
    padding: 1,
    margin: 1,
  },
);

await sleep(1400);
console.log("\n");

// ===========================================================================
// SECTION 4: SESSION STRUCTURE + BREAKS
// ===========================================================================
ConsoleStyler.logSection("SESSION STRUCTURE", "brightMagenta", "double");

const sessionStructure = [
  {
    phase: "Welcome Huddle",
    signal: "BoxRenderer story card",
    guardrail: "Pulse-check question",
  },
  {
    phase: "Demo Slide",
    signal: "Neon progress bar + logger callout",
    guardrail: "Shorter than 4 minutes",
  },
  {
    phase: "Hands-On Loop",
    signal: "Call-and-response cues",
    guardrail: "Break prompt after 3 loops",
  },
  {
    phase: "Confidence Report",
    signal: "TableRenderer recap",
    guardrail: "Celebrate wins + next step",
  },
];

TableRenderer.render(sessionStructure, [
  { key: "phase", label: "Phase", width: 18 },
  { key: "signal", label: "What They See", width: 36 },
  { key: "guardrail", label: "Safety Cue", width: 28 },
]);

BoxRenderer.render(
  [
    ColorSystem.colorize("Break Reminder", limeAccent),
    "",
    ...Formatter.wrap(
      "GenesisTrace guardrails nudge a 5 minute stretch break every 20 minutes. " +
        "When the warning pops up, lift hands off the keyboard and reset posture.",
      76,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "single",
    color: limeAccent,
    padding: 1,
    margin: 1,
  },
);

logger.info("Outlined guardrail backed session", {
  segments: sessionStructure.length,
  breakIntervalMinutes: 20,
});

await sleep(1200);
console.log("\n");

// ===========================================================================
// SECTION 5: CALL TO ACTION
// ===========================================================================
ConsoleStyler.logSection("CALL TO ACTION", "brightBlue", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("Your Homework", ColorSystem.codes.brightBlue),
    "",
    "1. Print the plain-language key card.",
    "2. Practice Esc → i → :w → u while narrating the action.",
    "3. Text me a picture of the cheat sheet taped to the register.",
    "",
    ...Formatter.wrap(
      "Next visit we log actual orders inside Neovim, knowing the keyboard is a familiar tool, not an obstacle.",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "double",
    color: calmBlue,
    padding: 1,
    margin: 1,
    minWidth: 70,
  },
);

logger.info("Presentation finished", { followUp: "Schedule next on-site demo" });

console.log("\n");
