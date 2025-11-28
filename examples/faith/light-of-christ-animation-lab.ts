#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Light of Christ: Catholic Animation Lab
 *
 * A comprehensive terminal visualization celebrating the Catholic faith
 * through dynamic animations, liturgical colors, and papal wisdom.
 *
 * Features:
 *   • Liturgical color system (Purple, White, Red, Green, Gold)
 *   • Animated grace flow visualizations
 *   • Papal quotes from across the centuries
 *   • Sacramental pulse animations
 *   • Spiritual journey progress tracking
 *   • Church history timelines
 *   • Living faith metrics and celebrations
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
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

// Liturgical Colors - Catholic Church tradition
const LITURGICAL_COLORS = {
  purple: ColorSystem.hexToRgb("#663399"), // Advent, Lent, Penance
  white: ColorSystem.hexToRgb("#FFFFFF"),  // Christmas, Easter, Joy
  red: ColorSystem.hexToRgb("#DC143C"),    // Pentecost, Martyrs, Holy Spirit
  green: ColorSystem.hexToRgb("#2E8B57"),  // Ordinary Time, Hope
  gold: ColorSystem.hexToRgb("#FFD700"),   // Glory, Divine Celebration
  deepRed: ColorSystem.hexToRgb("#8B0000"), // Sacred Heart, Divine Love
};

// Helper functions for colorized text
const purple = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightMagenta);
const white = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightWhite);
const red = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightRed);
const green = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightGreen);
const gold = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightYellow);
const dimText = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.dim);
const cyan = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightCyan);

console.clear();
console.log("\n");

// =============================================================================
// 1. OPENING SEQUENCE - THE LIGHT OF CHRIST
// =============================================================================

const openingLines = [
  "",
  dimText("    ══════════════════════════════════════════════════════════════════════"),
  "",
  gold("                    ✝  L U M E N   C H R I S T I  ✝"),
  "",
  white("                      T H E   L I G H T   O F   C H R I S T"),
  "",
  dimText("    ══════════════════════════════════════════════════════════════════════"),
  "",
];

for (const line of openingLines) {
  console.log(line);
  await sleep(120);
}
await sleep(400);

BannerRenderer.render({
  title: "✝ LIGHT OF CHRIST ANIMATION LAB ✝",
  subtitle: "An Introduction to Catholicism Through Living Color",
  description: "Papal Wisdom • Liturgical Beauty • Sacramental Grace • Living Faith",
  version: "Anno Domini 2025",
  author: "The Universal Church",
  width: 94,
  color: LITURGICAL_COLORS.gold,
});
console.log("\n");

// =============================================================================
// 2. PAPAL WISDOM - OPENING QUOTE
// =============================================================================

BoxRenderer.render(
  [
    gold('"Faith and reason are like two wings on which the human spirit'),
    gold('rises to the contemplation of truth; and God has placed in the'),
    gold('human heart a desire to know the truth—in a word, to know himself—'),
    gold('so that, by knowing and loving God, men and women may also come'),
    gold('to the fullness of truth about themselves."'),
    "",
    white("— Pope St. John Paul II"),
    dimText("Encyclical Letter Fides et Ratio (1998)"),
  ],
  {
    style: "double",
    title: "Papal Wisdom",
    padding: 1,
    color: LITURGICAL_COLORS.gold,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 3. LOGGER INITIALIZATION
// =============================================================================

console.log(gold("◈ Initiating Catholic Animation Systems"));

const catholicLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(500)
    .build(),
);

catholicLogger.info("Liturgical color systems initialized", {
  colors: ["Purple", "White", "Red", "Green", "Gold"]
});
catholicLogger.success("Sacramental grace channels opening");
catholicLogger.debug("Papal wisdom database online", {
  popes: ["John Paul II", "Benedict XVI", "Francis", "Paul VI", "Pius XII"]
});
console.log("\n");

// =============================================================================
// 4. LITURGICAL SEASONS ANIMATION
// =============================================================================

console.log(white("◈ LITURGICAL CALENDAR FLOW"));
console.log(dimText("  The rhythm of the Church year...\n"));

const liturgicalSeasons = [
  {
    season: "Advent",
    color: "Purple",
    icon: "🕯",
    message: "Preparing for the coming of Christ...",
    duration: "4 weeks",
    rgb: LITURGICAL_COLORS.purple,
  },
  {
    season: "Christmas",
    color: "White/Gold",
    icon: "⭐",
    message: "Celebrating the Incarnation of God...",
    duration: "12 days",
    rgb: LITURGICAL_COLORS.gold,
  },
  {
    season: "Ordinary Time I",
    color: "Green",
    icon: "🌱",
    message: "Growing in faith and discipleship...",
    duration: "Variable",
    rgb: LITURGICAL_COLORS.green,
  },
  {
    season: "Lent",
    color: "Purple",
    icon: "✞",
    message: "Journey of repentance and conversion...",
    duration: "40 days",
    rgb: LITURGICAL_COLORS.purple,
  },
  {
    season: "Easter",
    color: "White/Gold",
    icon: "🕊",
    message: "Christ is risen! Alleluia!",
    duration: "50 days",
    rgb: LITURGICAL_COLORS.white,
  },
  {
    season: "Pentecost",
    color: "Red",
    icon: "🔥",
    message: "The Holy Spirit descends upon the Church...",
    duration: "1 day",
    rgb: LITURGICAL_COLORS.red,
  },
  {
    season: "Ordinary Time II",
    color: "Green",
    icon: "🌿",
    message: "Living out the mission of Christ...",
    duration: "Variable",
    rgb: LITURGICAL_COLORS.green,
  },
];

const seasonSpinner = new Spinner({
  message: "Loading liturgical calendar...",
  frames: ["🕯", "🕯️", "✨", "✨", "✝", "✝️", "✨", "✨"],
  interval: 130,
});

seasonSpinner.start();
await sleep(900);
seasonSpinner.update("Synchronizing with Church universal...");
await sleep(700);
seasonSpinner.succeed("Liturgical year cycle active");
console.log("\n");

// Display liturgical seasons table
TableRenderer.render(
  liturgicalSeasons.map(s => ({
    season: s.season,
    color: s.color,
    duration: s.duration,
    icon: s.icon,
  })),
  [
    { key: "icon", label: "", width: 4 },
    { key: "season", label: "Liturgical Season", width: 18 },
    { key: "color", label: "Liturgical Color", width: 16 },
    { key: "duration", label: "Duration", width: 12 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. GRACE FLOW VISUALIZATION - ANIMATED
// =============================================================================

console.log(white("◈ SACRAMENTAL GRACE FLOW"));
console.log(dimText("  Visualizing the channels of divine grace...\n"));

const graceFrames = [
  [
    gold("        ╔══════════════════════════════════════════════╗"),
    gold("        ║") + "            " + white("DIVINE GRACE") + "                     " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "           " + cyan("✝ Sacraments ✝") + "                  " + gold("║"),
    gold("        ║") + "      " + purple("○") + "    " + red("○") + "    " + white("○") + "    " + green("○") + "    " + gold("○") + "           " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "          " + cyan("Human Hearts") + "                   " + gold("║"),
    gold("        ╚══════════════════════════════════════════════╝"),
  ],
  [
    gold("        ╔══════════════════════════════════════════════╗"),
    gold("        ║") + "            " + white("DIVINE GRACE") + "                     " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "           " + cyan("✝ Sacraments ✝") + "                  " + gold("║"),
    gold("        ║") + "          " + purple("○") + "    " + red("○") + "    " + white("○") + "    " + green("○") + "        " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "          " + cyan("Human Hearts") + "                   " + gold("║"),
    gold("        ╚══════════════════════════════════════════════╝"),
  ],
  [
    gold("        ╔══════════════════════════════════════════════╗"),
    gold("        ║") + "            " + white("DIVINE GRACE") + "                     " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "           " + cyan("✝ Sacraments ✝") + "                  " + gold("║"),
    gold("        ║") + "              " + purple("○") + "    " + red("○") + "    " + white("○") + "            " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "          " + cyan("Human Hearts") + "                   " + gold("║"),
    gold("        ╚══════════════════════════════════════════════╝"),
  ],
  [
    gold("        ╔══════════════════════════════════════════════╗"),
    gold("        ║") + "            " + white("DIVINE GRACE") + "                     " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "           " + cyan("✝ Sacraments ✝") + "                  " + gold("║"),
    gold("        ║") + "                  " + purple("○") + "    " + red("○") + "                " + gold("║"),
    gold("        ║") + "                  " + gold("↓↓↓") + "                      " + gold("║"),
    gold("        ║") + "          " + cyan("Human Hearts") + "                   " + gold("║"),
    gold("        ╚══════════════════════════════════════════════╝"),
  ],
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l")); // Hide cursor

for (let cycle = 0; cycle < 3; cycle++) {
  for (const frame of graceFrames) {
    if (cycle > 0 || graceFrames.indexOf(frame) > 0) {
      Deno.stdout.writeSync(encoder.encode("\x1B[8A")); // Move up
    }
    for (const line of frame) {
      console.log(line);
    }
    await sleep(180);
  }
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h")); // Show cursor
console.log(green("\n        ✓ Grace flowing • Sacraments active • Hearts transformed\n"));

// =============================================================================
// 6. PAPAL QUOTES - POPE BENEDICT XVI
// =============================================================================

BoxRenderer.render(
  [
    white('"Being Christian is not the result of an ethical choice or a lofty'),
    white('idea, but the encounter with an event, a person, which gives life'),
    white('a new horizon and a decisive direction."'),
    "",
    white("— Pope Benedict XVI"),
    dimText("Encyclical Letter Deus Caritas Est (2005)"),
  ],
  {
    style: "rounded",
    title: "On the Christian Life",
    padding: 1,
    color: LITURGICAL_COLORS.deepRed,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 7. THE SEVEN SACRAMENTS - ANIMATED PROGRESS
// =============================================================================

console.log(white("◈ THE SEVEN SACRAMENTS"));
console.log(dimText("  Channels of grace in the life of the Church...\n"));

const sacraments = [
  {
    sacrament: "Baptism",
    latin: "Baptismus",
    icon: "💧",
    grace: "Rebirth in Christ",
    color: LITURGICAL_COLORS.white,
    quote: "Born again of water and Spirit",
  },
  {
    sacrament: "Confirmation",
    latin: "Confirmatio",
    icon: "🔥",
    grace: "Sealed with Holy Spirit",
    color: LITURGICAL_COLORS.red,
    quote: "Strengthened for mission",
  },
  {
    sacrament: "Eucharist",
    latin: "Eucharistia",
    icon: "🍞",
    grace: "Body and Blood of Christ",
    color: LITURGICAL_COLORS.gold,
    quote: "Source and summit of faith",
  },
  {
    sacrament: "Reconciliation",
    latin: "Paenitentia",
    icon: "✝",
    grace: "Forgiveness of sins",
    color: LITURGICAL_COLORS.purple,
    quote: "Divine mercy encounters us",
  },
  {
    sacrament: "Anointing",
    latin: "Unctio Infirmorum",
    icon: "⚕",
    grace: "Healing and comfort",
    color: LITURGICAL_COLORS.green,
    quote: "Christ heals body and soul",
  },
  {
    sacrament: "Holy Orders",
    latin: "Ordo",
    icon: "🕯",
    grace: "Priestly configuration",
    color: LITURGICAL_COLORS.white,
    quote: "In persona Christi",
  },
  {
    sacrament: "Matrimony",
    latin: "Matrimonium",
    icon: "💍",
    grace: "Covenant of love",
    color: LITURGICAL_COLORS.gold,
    quote: "Two become one flesh",
  },
];

TableRenderer.render(
  sacraments,
  [
    { key: "icon", label: "", width: 4 },
    { key: "sacrament", label: "Sacrament", width: 14 },
    { key: "latin", label: "Latin Name", width: 18 },
    { key: "grace", label: "Grace Conferred", width: 24 },
    { key: "quote", label: "Essence", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

// Animated sacramental journey
const sacramentalBar = new ProgressBar({
  total: 7,
  width: 54,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Sacramental Journey:");
for (let i = 0; i < sacraments.length; i++) {
  sacramentalBar.update(i + 1);
  catholicLogger.info(`${sacraments[i].icon} ${sacraments[i].sacrament}: ${sacraments[i].grace}`);
  await sleep(420);
}
sacramentalBar.complete();
console.log("\n");

// =============================================================================
// 8. CHURCH HISTORY TIMELINE
// =============================================================================

console.log(white("◈ CHURCH HISTORY MILESTONES"));
console.log(dimText("  Two millennia of continuous witness...\n"));

const churchHistory = [
  { year: "33 AD", event: "Pentecost - Birth of the Church", significance: "Holy Spirit descends" },
  { year: "325 AD", event: "Council of Nicaea", significance: "Divinity of Christ affirmed" },
  { year: "451 AD", event: "Council of Chalcedon", significance: "Two natures of Christ defined" },
  { year: "1054 AD", event: "East-West Schism", significance: "Orthodox and Catholic divide" },
  { year: "1545-1563", event: "Council of Trent", significance: "Catholic Reformation response" },
  { year: "1962-1965", event: "Second Vatican Council", significance: "Church renewal and dialogue" },
  { year: "2013 AD", event: "Pope Francis elected", significance: "First Jesuit, first from Americas" },
];

TableRenderer.render(
  churchHistory,
  [
    { key: "year", label: "Year", width: 12 },
    { key: "event", label: "Event", width: 28 },
    { key: "significance", label: "Significance", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 9. THEOLOGICAL VIRTUES SPINNER
// =============================================================================

console.log(white("◈ THEOLOGICAL VIRTUES MEDITATION"));
console.log(dimText("  Faith, Hope, and Charity...\n"));

const virtueSpinner = new Spinner({
  message: "Contemplating Faith (Fides)...",
  frames: ["✦", "✧", "✶", "✷", "✸", "✹", "✺", "✻"],
  interval: 125,
});

virtueSpinner.start();
await sleep(850);
virtueSpinner.update("Contemplating Hope (Spes)...");
await sleep(850);
virtueSpinner.update("Contemplating Charity (Caritas)...");
await sleep(850);
virtueSpinner.succeed("Three theological virtues unite the soul to God");
console.log("\n");

BoxRenderer.render(
  [
    gold('"And now these three remain: faith, hope and love.'),
    gold('But the greatest of these is love."'),
    "",
    white("— 1 Corinthians 13:13"),
  ],
  {
    style: "bold",
    title: "The Greatest Virtue",
    padding: 1,
    color: LITURGICAL_COLORS.deepRed,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 10. PAPAL QUOTES - POPE FRANCIS
// =============================================================================

BoxRenderer.render(
  [
    green('"The Church is not a tollhouse; it is the house of the Father,'),
    green('where there is a place for everyone, with all their problems."'),
    "",
    white("— Pope Francis"),
    dimText("Interview with La Civiltà Cattolica (2013)"),
  ],
  {
    style: "double",
    title: "On Mercy and Welcome",
    padding: 1,
    color: LITURGICAL_COLORS.green,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 11. SPIRITUAL JOURNEY PROGRESS
// =============================================================================

console.log(white("◈ SPIRITUAL JOURNEY - THREE WAYS"));
console.log(dimText("  The classical path to holiness...\n"));

const spiritualWays = [
  {
    way: "Purgative Way",
    latin: "Via Purgativa",
    focus: "Purification from sin",
    practice: "Repentance, mortification, detachment",
    color: purple,
  },
  {
    way: "Illuminative Way",
    latin: "Via Illuminativa",
    focus: "Growth in virtue and prayer",
    practice: "Meditation, imitation of Christ",
    color: gold,
  },
  {
    way: "Unitive Way",
    latin: "Via Unitiva",
    focus: "Union with God in love",
    practice: "Contemplation, mystical prayer",
    color: white,
  },
];

const journeyBar = new ProgressBar({
  total: 100,
  width: 52,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Ascending the mountain of God:");
const journeySteps = [
  { name: "Purgative Way: Turning from sin...", progress: 20 },
  { name: "Growing in self-knowledge...", progress: 33 },
  { name: "Illuminative Way: Learning virtue...", progress: 50 },
  { name: "Contemplating Christ's mysteries...", progress: 66 },
  { name: "Unitive Way: Union with God begins...", progress: 80 },
  { name: "Deepening in love and prayer...", progress: 90 },
  { name: "Beatific Vision: Face to face with God", progress: 100 },
];

for (const step of journeySteps) {
  journeyBar.update(step.progress);
  catholicLogger.info(step.name);
  await sleep(380);
}
journeyBar.complete();
console.log("\n");

// =============================================================================
// 12. PAPAL QUOTES - POPE ST. JOHN XXIII
// =============================================================================

BoxRenderer.render(
  [
    cyan('"Consult not your fears but your hopes and your dreams.'),
    cyan('Think not about your frustrations, but about your unfulfilled'),
    cyan('potential. Concern yourself not with what you tried and failed'),
    cyan('in, but with what it is still possible for you to do."'),
    "",
    white("— Pope St. John XXIII"),
  ],
  {
    style: "rounded",
    title: "On Hope and Perseverance",
    padding: 1,
    color: LITURGICAL_COLORS.white,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 13. LIVING FAITH WAVEFORM
// =============================================================================

console.log(white("◈ LIVING FAITH PULSE"));
console.log(dimText("  The heartbeat of the Universal Church...\n"));

const faithColors = [
  LITURGICAL_COLORS.purple,
  LITURGICAL_COLORS.white,
  LITURGICAL_COLORS.red,
  LITURGICAL_COLORS.green,
  LITURGICAL_COLORS.gold,
];

const faithWavePatterns = [
  "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆",
  "▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅",
  "▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄",
  "▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃",
  "▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂",
  "▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁",
  "▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂",
  "█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃",
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l"));

for (let i = 0; i < 40; i++) {
  const pattern = faithWavePatterns[i % faithWavePatterns.length];
  const color = faithColors[Math.floor(i / 8) % faithColors.length];
  const coloredWave = ColorSystem.colorize(pattern, color);
  Deno.stdout.writeSync(encoder.encode(`\r      ${coloredWave}   `));
  await sleep(90);
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h"));
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(60) + "\r"));
console.log(green("      ✓ Faith pulse: Strong and vibrant • 1.3 billion hearts beating as one\n"));

// =============================================================================
// 14. PAPAL QUOTES - POPE PAUL VI
// =============================================================================

BoxRenderer.render(
  [
    purple('"Modern man listens more willingly to witnesses than to teachers,'),
    purple('and if he does listen to teachers, it is because they are witnesses."'),
    "",
    white("— Pope Paul VI"),
    dimText("Evangelii Nuntiandi (1975)"),
  ],
  {
    style: "bold",
    title: "On Witness and Evangelization",
    padding: 1,
    color: LITURGICAL_COLORS.purple,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 15. CHURCH VITALITY METRICS
// =============================================================================

console.log(white("◈ UNIVERSAL CHURCH VITALITY"));
console.log(dimText("  Global Catholic presence and mission...\n"));

TableRenderer.render(
  [
    {
      metric: "Baptized Catholics",
      value: Formatter.number(1300000000) + " souls",
      percentage: "17.7% of world",
      trend: "↑ Growing",
    },
    {
      metric: "Dioceses Worldwide",
      value: Formatter.number(3000) + " dioceses",
      percentage: "Every continent",
      trend: "↔ Stable",
    },
    {
      metric: "Parish Communities",
      value: Formatter.number(221000) + " parishes",
      percentage: "Local presence",
      trend: "↑ Expanding",
    },
    {
      metric: "Catholic Schools",
      value: Formatter.number(216000) + " institutions",
      percentage: "62M students",
      trend: "↑ Growing",
    },
    {
      metric: "Healthcare Facilities",
      value: Formatter.number(5500) + " hospitals",
      percentage: "26% of global care",
      trend: "↑ Serving",
    },
    {
      metric: "Consecrated Religious",
      value: Formatter.number(642000) + " religious",
      percentage: "Living witnesses",
      trend: "→ Dedicated",
    },
  ],
  [
    { key: "metric", label: "Metric", width: 24 },
    { key: "value", label: "Current Value", width: 20, align: "right" },
    { key: "percentage", label: "Scope", width: 16 },
    { key: "trend", label: "Trend", width: 12 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 16. MARTYRS AND SAINTS COMMEMORATION
// =============================================================================

console.log(white("◈ COMMUNION OF SAINTS"));
console.log(dimText("  The great cloud of witnesses...\n"));

const saintsSpinner = new Spinner({
  message: "Honoring the martyrs of the early Church...",
  frames: ["⭐", "✨", "⭐", "✨"],
  interval: 150,
});

saintsSpinner.start();
await sleep(800);
saintsSpinner.update("Venerating the doctors and teachers...");
await sleep(800);
saintsSpinner.update("Celebrating the mystics and contemplatives...");
await sleep(800);
saintsSpinner.update("Recognizing modern witnesses and martyrs...");
await sleep(800);
saintsSpinner.succeed("Communion of Saints: Praying with us, for us");
console.log("\n");

// =============================================================================
// 17. PAPAL QUOTES - POPE PIUS XII
// =============================================================================

BoxRenderer.render(
  [
    red('"The Church is a society of divine origin, perfect in its nature'),
    red('and in its title, supreme, absolutely supreme, in the spiritual'),
    red('order, which is that of truth and charity."'),
    "",
    white("— Pope Pius XII"),
    dimText("Address to Italian Catholic Action (1946)"),
  ],
  {
    style: "double",
    title: "On the Nature of the Church",
    padding: 1,
    color: LITURGICAL_COLORS.red,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 18. PRAYER AND CONTEMPLATION
// =============================================================================

console.log(white("◈ ENTERING CONTEMPLATIVE SILENCE"));
console.log(dimText("  Be still and know that I am God...\n"));

const prayerSpinner = new Spinner({
  message: "🕯 Lighting the candle of prayer...",
  frames: ["🕯", "🕯️", "🕯", "🕯️"],
  interval: 400,
});

prayerSpinner.start();
await sleep(1200);
prayerSpinner.update("🙏 Entering into the silence...");
await sleep(1200);
prayerSpinner.update("✝ Resting in the presence of God...");
await sleep(1200);
prayerSpinner.succeed("Prayer: The breath of the soul");
console.log("\n");

BoxRenderer.render(
  [
    gold('"Prayer is the breath of faith, the soul\'s dialogue with God."'),
    "",
    white("Through prayer, we open our hearts to receive divine grace,"),
    white("to discern God's will, and to be transformed by His love."),
    "",
    dimText("Pray without ceasing. — 1 Thessalonians 5:17"),
  ],
  {
    style: "rounded",
    title: "The Life of Prayer",
    padding: 1,
    color: LITURGICAL_COLORS.gold,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 19. EUCHARISTIC ADORATION VISUALIZATION
// =============================================================================

console.log(white("◈ EUCHARISTIC ADORATION"));
console.log(dimText("  Before the Blessed Sacrament...\n"));

const adorationFrames = [
  [
    "",
    gold("                          ___"),
    gold("                         /   \\"),
    gold("                        |  ✝  |"),
    gold("                         \\___/"),
    gold("                          | |"),
    gold("                          | |"),
    white("                    ═════════════"),
    dimText("                  'Corpus Christi'"),
    "",
  ],
  [
    "",
    gold("                          ___"),
    gold("                         /   \\"),
    gold("                     ✨ |  ✝  | ✨"),
    gold("                         \\___/"),
    gold("                          | |"),
    gold("                          | |"),
    white("                    ═════════════"),
    dimText("                  'Body of Christ'"),
    "",
  ],
];

for (let cycle = 0; cycle < 4; cycle++) {
  for (const frame of adorationFrames) {
    if (cycle > 0 || adorationFrames.indexOf(frame) > 0) {
      Deno.stdout.writeSync(encoder.encode("\x1B[10A")); // Move up
    }
    for (const line of frame) {
      console.log(line);
    }
    await sleep(500);
  }
}

console.log(gold("        'O Sacrament Most Holy, O Sacrament Divine,"));
console.log(gold("         All praise and all thanksgiving be every moment Thine!'\n"));

// =============================================================================
// 20. PAPAL QUOTES - POPE LEO XIII
// =============================================================================

BoxRenderer.render(
  [
    cyan('"The Holy Eucharist is the source and summit of the whole'),
    cyan('Christian life. In it all spiritual good is contained,'),
    cyan('namely, Christ Himself, our Pasch."'),
    "",
    white("— Pope Leo XIII"),
    dimText("Encyclical Mirae Caritatis (1902)"),
  ],
  {
    style: "bold",
    title: "On the Holy Eucharist",
    padding: 1,
    color: LITURGICAL_COLORS.gold,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 21. CATECHETICAL FORMATION CHART
// =============================================================================

console.log(white("◈ PILLARS OF CATHOLIC CATECHESIS"));
console.log(dimText("  The structure of faith formation...\n"));

const catechismData = [
  { label: "Profession of Faith (Creed)", value: 4 },
  { label: "Sacraments (Liturgy)", value: 7 },
  { label: "Commandments (Moral Life)", value: 10 },
  { label: "Our Father (Prayer)", value: 7 },
  { label: "Theological Virtues", value: 3 },
  { label: "Cardinal Virtues", value: 4 },
];

ChartRenderer.barChart(
  catechismData.map((item) => ({ label: item.label, value: item.value })),
  {
    showValues: true,
    width: 36,
    color: LITURGICAL_COLORS.deepRed,
    title: "Structure of the Catechism",
  },
);
console.log("\n");

// =============================================================================
// 22. FINAL BLESSING SEQUENCE
// =============================================================================

console.log(white("◈ CONCLUDING BLESSING"));
console.log(dimText("  In the name of the Father, and of the Son, and of the Holy Spirit...\n"));

const blessingSpinner = new Spinner({
  message: "Preparing final blessing...",
  frames: ["✝", "✞", "✝", "✞"],
  interval: 200,
});

blessingSpinner.start();
await sleep(1000);
blessingSpinner.succeed("Blessing imparted • Go in peace to love and serve the Lord");
console.log("\n");

BoxRenderer.render(
  [
    "",
    gold("✝ May the Lord bless you and keep you ✝"),
    "",
    white("May His face shine upon you and be gracious to you,"),
    white("May He look upon you with kindness and give you peace."),
    "",
    gold("In the name of the Father, ✝ and of the Son, ✝"),
    gold("and of the Holy Spirit. ✝"),
    "",
    white("Amen."),
    "",
  ],
  {
    style: "double",
    title: "✝ Apostolic Blessing ✝",
    padding: 1,
    color: LITURGICAL_COLORS.gold,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 23. FINAL PAPAL WISDOM
// =============================================================================

BoxRenderer.render(
  [
    gold('"Do not be afraid to open wide the doors to Christ.'),
    gold('To His saving power open the boundaries of States,'),
    gold('economic and political systems, the vast fields of culture,'),
    gold('civilization, and development."'),
    "",
    white("— Pope St. John Paul II"),
    dimText("Inaugural Homily, October 22, 1978"),
  ],
  {
    style: "bold",
    title: "Be Not Afraid",
    padding: 1,
    color: LITURGICAL_COLORS.deepRed,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 24. DOXOLOGY - GLORIA PATRI
// =============================================================================

console.log(gold("◈ DOXOLOGY"));
console.log("\n");

ConsoleStyler.logGradient(
  "Gloria Patri, et Filio, et Spiritui Sancto",
  [139, 0, 0],
  [255, 215, 0],
  64,
);
console.log("\n");

ConsoleStyler.logGradient(
  "As it was in the beginning, is now, and ever shall be",
  [255, 215, 0],
  [255, 255, 255],
  64,
);
console.log("\n");

ConsoleStyler.logGradient(
  "World without end. Amen.",
  [255, 255, 255],
  [46, 139, 87],
  64,
);
console.log("\n");

// =============================================================================
// 25. CLOSING SEQUENCE
// =============================================================================

const closingLines = [
  "",
  dimText("    ══════════════════════════════════════════════════════════════════════"),
  "",
  gold("                    ✝  L U M E N   C H R I S T I  ✝"),
  "",
  white("           'I am the light of the world. Whoever follows me"),
  white("            will not walk in darkness, but will have the"),
  white("                      light of life.' — John 8:12"),
  "",
  dimText("    ══════════════════════════════════════════════════════════════════════"),
  "",
];

for (const line of closingLines) {
  console.log(line);
  await sleep(110);
}

console.log("\n");

BoxRenderer.render(
  [
    green("✓") + " Liturgical color systems: All seasons illuminated",
    green("✓") + " Sacramental grace: Flowing freely to all who receive",
    green("✓") + " Papal wisdom: Centuries of teaching preserved",
    green("✓") + " Living faith: 1.3 billion Catholics worldwide",
    green("✓") + " Mission: To all nations, until the end of the age",
  ],
  {
    style: "rounded",
    title: "Animation Lab Complete",
    color: LITURGICAL_COLORS.green,
    padding: 1,
  },
);

console.log("\n");

catholicLogger.success("Light of Christ animation lab completed");
catholicLogger.info("Ad Majorem Dei Gloriam - For the Greater Glory of God");

console.log("\n");
console.log(gold("                          ✝ Laus Deo ✝"));
console.log(dimText("                        Praise be to God"));
console.log("\n");
