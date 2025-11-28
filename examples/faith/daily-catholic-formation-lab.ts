#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Daily Catholic Formation Animation Lab
 *
 * Inspiring console storytelling that encourages small, daily steps toward
 * holiness. Highlights:
 *   • Banner + scripture meditations in gold, green, and rose hues
 *   • Neon logger timeline for daily examen checkpoints
 *   • Spinner playlists for prayer, mercy, and examen rhythms
 *   • Progress bar tracking the five Ignatian examen movements
 *   • Tables for routines, virtues, and corporal works of mercy plans
 *   • Gentle lectio divina pulse animation rendered directly to stdout
 *
 *   deno run --allow-env --allow-read --allow-write examples/faith/daily-catholic-formation-lab.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

const palette = {
  gold: ColorSystem.hexToRgb("#FFD275"),
  green: ColorSystem.hexToRgb("#88C057"),
  rose: ColorSystem.hexToRgb("#E68E9B"),
  blue: ColorSystem.hexToRgb("#7FB3D5"),
};

const bright = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightYellow);
const gentle = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.dim);
const hopeful = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightGreen);

console.clear();
console.log("\n");

// =============================================================================
// 1. OPENING BANNER + SCRIPTURE
// =============================================================================

BannerRenderer.render({
  title: "✝ DAILY CATHOLIC FORMATION LAB",
  subtitle: "Everyday holiness with GenesisTrace animation beats",
  description: "Prayer • Scripture • Virtue • Mercy • Mission",
  version: "A.D. 2025",
  author: "GenesisTrace – Inspiring Faith Mode",
  width: 92,
  color: palette.gold,
});
console.log("\n");

BoxRenderer.render(
  [
    bright("“Holiness consists simply in doing God's will,"),
    bright("and being just what God wants us to be.”"),
    "",
    hopeful("— St. Thérèse of Lisieux"),
    gentle("Little Way Institute • Formation Notes"),
  ],
  {
    style: "double",
    title: "Daily Intention",
    padding: 1,
    color: palette.rose,
    maxWidth: 86,
  },
);
console.log("\n");

// =============================================================================
// 2. LOGGER INITIALIZATION
// =============================================================================

console.log(bright("◈ Initializing formation instrumentation"));

const formationLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(400)
    .build(),
);

formationLogger.info("Rule of life telemetry active", {
  director: "Local parish priest",
  examen: "Nightly Ignatian rhythm",
  scripture: "Gospel of the day",
});
formationLogger.success("Virtue scorecards synchronized across devices");
formationLogger.debug("Mercy queue primed", {
  familiesEncouraged: 2,
  coworkersBlessed: 1,
  communityActs: ["Meal train", "Rosary for the sick"],
});
console.log("\n");

// =============================================================================
// 3. DAILY RHYTHM TABLES
// =============================================================================

console.log(bright("◈ Daily Rhythm Map"));
console.log(gentle("  Anchoring prayer, study, and mission moments across the day.\n"));

const dailyRhythm = [
  {
    moment: "Dawn Offering",
    focus: "Surrender the schedule to the Sacred Heart",
    anchor: "Morning Offering + gratitude list",
  },
  {
    moment: "Midday Pause",
    focus: "Invite Christ into work and lunch conversations",
    anchor: "Pray the Angelus & name one blessing",
  },
  {
    moment: "Afternoon Mercy",
    focus: "Choose a hidden sacrifice for someone else",
    anchor: "Send a note • take the humble task",
  },
  {
    moment: "Evening Scripture",
    focus: "Lectio Divina with the Gospel of the day",
    anchor: "Read • Meditate • Pray • Contemplate",
  },
  {
    moment: "Night Examen",
    focus: "Notice consolations and offer contrition",
    anchor: "Ignatian examen + Act of Contrition",
  },
];

TableRenderer.render(
  dailyRhythm,
  [
    { key: "moment", label: "Moment", width: 18 },
    { key: "focus", label: "Spiritual Focus", width: 44 },
    { key: "anchor", label: "Anchor Practice", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

console.log(bright("◈ Virtue Habit Scorecard"));
console.log(gentle("  Track tiny habits that keep faith, hope, and charity fresh.\n"));

const virtueHabits = [
  { virtue: "Faith", habit: "Read Gospel + journaling insight", metric: "Days streak" },
  { virtue: "Hope", habit: "List 3 resurrections glimpsed today", metric: "Hope meter" },
  { virtue: "Charity", habit: "Offer hidden sacrifice before dinner", metric: "Neighbors loved" },
  { virtue: "Humility", habit: "Apologize quickly & bless the other", metric: "Attachments surrendered" },
  { virtue: "Joy", habit: "Smile intentionally + share holy humor", metric: "Joy sparks" },
];

TableRenderer.render(
  virtueHabits,
  [
    { key: "virtue", label: "Virtue", width: 12 },
    { key: "habit", label: "Habit Practice", width: 50 },
    { key: "metric", label: "Metric", width: 26 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 4. PRAYER + MERCY SPINNER PLAYLISTS
// =============================================================================

console.log(bright("◈ Prayer Warmup"));

const prayerSpinner = new Spinner({
  message: "Waking the heart with Morning Offering...",
  frames: ["✝", "✝", "✝", "☩", "✝", "✝", "✝", "☩"],
  interval: 150,
});

prayerSpinner.start();
await sleep(500);
prayerSpinner.update("Reading today's Gospel slowly...");
await sleep(600);
prayerSpinner.update("Breathing with the Holy Name...");
await sleep(600);
prayerSpinner.update("Consecrating emails and meetings to Mary...");
await sleep(600);
prayerSpinner.succeed("Prayer foundation steady • Go live with love");
console.log("\n");

console.log(bright("◈ Mercy Dispatch"));

const mercySpinner = new Spinner({
  message: "Packing sandwiches for the mercy run...",
  frames: ["·", "∙", "●", "∙"],
  interval: 90,
});

mercySpinner.start();
await sleep(400);
mercySpinner.update("Checking on a lonely friend...");
await sleep(400);
mercySpinner.update("Sending rosary intentions via text...");
await sleep(400);
mercySpinner.update("Offering small fast for peace at home...");
await sleep(400);
mercySpinner.succeed("Mercy queue cleared • Hearts encouraged");
console.log("\n");

// =============================================================================
// 5. DAILY EXAMEN PROGRESS BAR
// =============================================================================

console.log(bright("◈ Ignatian Examen Flightpath"));
console.log(gentle("  Let the Lord highlight grace and growth edges.\n"));

const examenStages = [
  { label: "Gratitude", increment: 18, meditation: "Thank God for gifts received", delay: 200 },
  { label: "Petition", increment: 22, meditation: "Ask for light and clarity", delay: 220 },
  { label: "Review", increment: 18, meditation: "Replay scenes with Jesus", delay: 220 },
  { label: "Conversion", increment: 20, meditation: "Name missteps + receive mercy", delay: 240 },
  { label: "Hope", increment: 22, meditation: "Plan concrete love for tomorrow", delay: 260 },
];

const examenBar = new ProgressBar({
  total: 100,
  width: 60,
  showPercentage: true,
  showValue: false,
  colorize: true,
});

let examenProgress = 0;
for (const stage of examenStages) {
  examenProgress = Math.min(100, examenProgress + stage.increment);
  examenBar.update(examenProgress);
  formationLogger.info(`Examen stage: ${stage.label}`, { meditation: stage.meditation });
  await sleep(stage.delay);
}
examenBar.complete();
formationLogger.success("Examen concluded with peace");
console.log("\n");

// =============================================================================
// 6. LECTIO DIVINA PULSE ANIMATION
// =============================================================================

console.log(bright("◈ Lectio Divina Pulse"));
console.log(gentle("  Let scripture move like a gentle tide.\n"));

const pulseFrames = [
  "✝──╮        ╭──✝    ",
  " ✝─╮  LECTIO  ╭─✝   ",
  "  ✝╮  MEDITATIO ╭✝  ",
  " ✝─╯  ORATIO  ╰─✝   ",
  "✝──╯        ╰──✝    ",
  " ✝  CONTEMPLATIO ✝  ",
];

for (let cycle = 0; cycle < 3; cycle++) {
  for (const frame of pulseFrames) {
    const colored = ColorSystem.colorize(frame, ColorSystem.codes.brightMagenta);
    await Deno.stdout.write(encoder.encode(`\r${colored}`));
    await sleep(160);
  }
}
await Deno.stdout.write(encoder.encode("\r                          \r"));
console.log("\n");

// =============================================================================
// 7. CORPORAL WORKS OF MERCY TABLE
// =============================================================================

console.log(bright("◈ Mercy Commitments Tracker"));
console.log(gentle("  Simple, local, doable ways to become love for neighbors.\n"));

const mercyCommitments = [
  { work: "Feed the Hungry", action: "Join parish meal train", cadence: "Weekly", notes: "Deliver on Thursdays" },
  { work: "Visit the Sick", action: "Hospital rosary visit", cadence: "Bi-weekly", notes: "Bring Eucharistic reflections" },
  { work: "Clothe the Naked", action: "Donate gently used coats", cadence: "Seasonal", notes: "Pair with prayer card" },
  { work: "Comfort the Sorrowful", action: "Write letters to grieving families", cadence: "Monthly", notes: "Include scripture promise" },
  { work: "Instruct the Ignorant", action: "Lead RCIA small group", cadence: "Weekly", notes: "Share testimony of mercy" },
];

TableRenderer.render(
  mercyCommitments.map((item) => ({
    work: item.work,
    action: item.action,
    cadence: item.cadence,
    notes: item.notes,
  })),
  [
    { key: "work", label: "Work of Mercy", width: 22 },
    { key: "action", label: "Action", width: 34 },
    { key: "cadence", label: "Cadence", width: 12, align: "center" },
    { key: "notes", label: "Notes", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 8. FINAL COMMISSION
// =============================================================================

BoxRenderer.render(
  [
    hopeful("Daily Benediction Script"),
    "",
    " • Receive the Eucharistic glow and bring it to your calendar.",
    " • When you stumble, confess quickly and restart with hope.",
    " • Evangelize through coffee conversations, good work, and joy.",
    " • Protect silence, bless those who annoy you, celebrate grace.",
    "",
    bright("Tomorrow is another chance to become a better Catholic."),
  ],
  {
    title: "Mission Charge",
    style: "rounded",
    padding: 1,
    color: palette.green,
    maxWidth: 94,
  },
);
console.log("\n");

formationLogger.success("Daily Catholic Formation Animation Lab complete");
formationLogger.info("Go forth • Love boldly • Pray without ceasing");
console.log("\n");
