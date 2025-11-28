#!/usr/bin/env -S deno run --allow-env

/**
 * Proverbs Discernment Loop - Knowing When to Keep Silence or Speak
 *
 * This GenesisTrace example meditates on passages from the Book of Proverbs
 * that teach discernment in speech. It loops through scriptures emphasizing
 * restraint, prudence, and timely words, demonstrating banners, boxes, tables,
 * looping spinners, progress bars, and structured logging.
 *
 * Run with:
 *    deno run --allow-env examples/faith/proverbs-speech-discernment.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

// ============================================================================
// 1. BANNER
// ============================================================================

BannerRenderer.render({
  title: "PROVERBS DISCERNMENT LOOP",
  subtitle: "Wisdom on Silence and Speech",
  description: "Meditations from the Book of Proverbs",
  version: "wisdom-cycle-1.0",
  author: "GenesisTrace Sacred Wisdom Studio",
  width: 96,
  color: ColorSystem.hexToRgb("#8A2BE2"),
});
console.log("\n");

// ============================================================================
// 2. OVERVIEW
// ============================================================================

ConsoleStyler.logSection("Portrait of Wisdom", "brightYellow", "double");

BoxRenderer.render(
  [
    "The ancient sages of Proverbs speak directly to the discipline of speech:",
    "knowing when to be silent, when to pause, and when a word must be spoken.",
    "",
    "This loop explores alternating scriptures that highlight silence",
    "and proclamation. Proverbs teaches that both restraint and clarity",
    "honor God and protect community when discerned through reverent fear.",
  ],
  {
    style: "double",
    title: "Silence & Speech",
    padding: 1,
    color: ColorSystem.hexToRgb("#FFD700"),
    maxWidth: 92,
  },
);
console.log("\n");

// ============================================================================
// 3. TABLE OF THEMES
// ============================================================================

ConsoleStyler.logSection("Guiding Passages", "brightCyan");

const passages = [
  {
    theme: "Silence",
    verse: "Proverbs 17:28",
    text:
      "Even a fool who keeps silent is considered wise; when he closes his lips, he is deemed intelligent.",
  },
  {
    theme: "Silence",
    verse: "Proverbs 10:19",
    text:
      "When words are many, transgression is not lacking, but whoever restrains his lips is prudent.",
  },
  {
    theme: "Silence",
    verse: "Proverbs 21:23",
    text: "Whoever keeps his mouth and his tongue keeps himself out of trouble.",
  },
  {
    theme: "Speech",
    verse: "Proverbs 25:11",
    text: "A word fitly spoken is like apples of gold in a setting of silver.",
  },
  {
    theme: "Speech",
    verse: "Proverbs 15:1",
    text: "A soft answer turns away wrath, but a harsh word stirs up anger.",
  },
  {
    theme: "Speech",
    verse: "Proverbs 31:8-9",
    text:
      "Open your mouth for the mute, for the rights of all who are destitute… defend the rights of the poor and needy.",
  },
];

TableRenderer.render(
  passages,
  [
    { key: "theme", label: "Theme", width: 10 },
    { key: "verse", label: "Verse", width: 16 },
    { key: "text", label: "Teaching", width: 64 },
  ],
  { showIndex: true },
);
console.log("\n");

// ============================================================================
// 4. DISCERNMENT LOOP
// ============================================================================

ConsoleStyler.logSection("Looping Scriptures", "brightGreen");

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .namespace("proverbs.loop")
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const silenceAndSpeechCycle = [
  {
    type: "Silence",
    verse: "Proverbs 17:27",
    meditation: "Whoever restrains his words has knowledge.",
  },
  {
    type: "Speech",
    verse: "Proverbs 15:23",
    meditation: "To make an apt answer is a joy to a man.",
  },
  {
    type: "Silence",
    verse: "Proverbs 12:23",
    meditation: "A prudent man conceals knowledge; fools broadcast folly.",
  },
  {
    type: "Speech",
    verse: "Proverbs 24:11",
    meditation: "Rescue those being dragged to death; advocacy is demanded.",
  },
  {
    type: "Silence",
    verse: "Proverbs 26:4",
    meditation: "Answer not a fool according to his folly, lest you be like him.",
  },
  {
    type: "Speech",
    verse: "Proverbs 26:5",
    meditation: "Answer a fool according to his folly, lest he be wise in his own eyes.",
  },
];

const discernmentSpinner = new Spinner({
  message: "Listening for wisdom...",
  frames: ["·", "··", "···", "····"],
  interval: 200,
});

const discernmentBar = new ProgressBar({
  total: silenceAndSpeechCycle.length,
  width: 48,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

discernmentSpinner.start();
console.log("Sensing when silence or speech becomes obedience:\n");

for (let i = 0; i < silenceAndSpeechCycle.length; i++) {
  const entry = silenceAndSpeechCycle[i];
  discernmentSpinner.update(`${entry.type}: ${entry.verse}`);
  discernmentBar.update(i + 1);
  logger.info(entry.meditation, { type: entry.type, verse: entry.verse });
  await sleep(500);
}

discernmentSpinner.succeed("Discernment loop complete");
discernmentBar.complete();
console.log("\n");

// ============================================================================
// 5. FINAL EXHORTATION
// ============================================================================

ConsoleStyler.logSection("Closing Charge", "brightWhite");

BoxRenderer.render(
  [
    "Lord, set a watch before my mouth, keep the door of my lips (cf. Ps 141:3).",
    "Grant me the courage to speak when justice cries out,",
    "and give me the humility to be silent when only ego is loud.",
    "Teach us, as Proverbs teaches, that silence and speech are both holy",
    "when governed by Your wisdom and offered for the healing of others.",
  ],
  {
    style: "classic",
    title: "Prayer for Discernment",
    padding: 1,
    color: ColorSystem.hexToRgb("#708090"),
    maxWidth: 92,
  },
);
console.log("\n");

await logger.shutdown();
