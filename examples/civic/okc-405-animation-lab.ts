#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * OKC 405 Animation Lab
 *
 * A dynamic terminal visualization celebrating the 405 corridor in Oklahoma City—
 * the pulsing artery of commerce, culture, and community in the heartland.
 *
 * Features:
 *   • Cinematic highway corridor visualization
 *   • Traffic flow animations with real-time metrics
 *   • District-by-district progress tracking
 *   • Cultural landmark pulse animations
 *   • Economic vitality metrics and projections
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

// 405 Corridor coordinates and key landmarks
const CORRIDOR_405 = {
  name: "Interstate 405 Corridor",
  location: "Oklahoma City Metro",
  length: "8.7 miles",
  landmarks: ["Will Rogers Airport", "Meridian Ave", "Lake Hefner", "NW Expressway"],
};

const NEOVIM_KEY_TRANSLATIONS = [
  {
    key: "Esc",
    corridorAction: "Stabilize telemetry & exit manual overrides",
    plainCue: "Hands off, breathe, say \"Safe Mode ON\"",
  },
  {
    key: "i",
    corridorAction: "Inject live corridor notes",
    plainCue: "Lean in and say \"Typing mode\"",
  },
  {
    key: ":w",
    corridorAction: "Write corridor log for archive",
    plainCue: "Seal the data, confirm \"Logged\"",
  },
  {
    key: "u",
    corridorAction: "Undo a wrong turn in narrative",
    plainCue: "Roll back calmly, narrate the fix",
  },
  {
    key: "/405",
    corridorAction: "Search the corridor feed for incidents",
    plainCue: "Ask it to highlight the next hotspot",
  },
];

console.clear();
console.log("\n");

// =============================================================================
// 1. CORRIDOR OPENING SEQUENCE
// =============================================================================

const dimText = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.dim);
const brightCyan = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightCyan);
const brightMagenta = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightMagenta);
const brightYellow = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightYellow);
const brightWhite = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightWhite);
const brightGreen = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightGreen);
const brightRed = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightRed);

// Dramatic highway opening
const openingLines = [
  "",
  dimText("    ════════════════════════════════════════════════════════════════════"),
  "",
  brightYellow("                    ┃┃  T H E   4 0 5   ┃┃"),
  "",
  brightCyan("             O K L A H O M A   C I T Y ' S   A R T E R Y"),
  "",
  dimText("    ════════════════════════════════════════════════════════════════════"),
  "",
];

for (const line of openingLines) {
  console.log(line);
  await sleep(100);
}
await sleep(350);

BannerRenderer.render({
  title: "🛣️  405 CORRIDOR LAB",
  subtitle: `${CORRIDOR_405.length} of Urban Vitality`,
  description: "Real-time visualization of Oklahoma City's dynamic northern gateway",
  version: "v2025.11",
  author: "OKC Transit Authority",
  width: 82,
  color: ColorSystem.codes.brightYellow,
});
console.log("\n");

// =============================================================================
// 2. LOGGER INITIALIZATION
// =============================================================================

console.log(ColorSystem.colorize("◈ System Initialization", ColorSystem.codes.bright));

const corridorLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(300)
    .build(),
);

corridorLogger.info("405 Corridor monitoring systems online", { location: CORRIDOR_405.location });
corridorLogger.success("Traffic sensors synchronized across all segments");
corridorLogger.debug("Landmark tracking enabled", {
  monitoring: CORRIDOR_405.landmarks,
});
console.log("\n");

// =============================================================================
// 3. NEOVIM CONTROL OVERLAY
// =============================================================================

console.log(brightWhite("◈ NEOVIM CONTROL OVERLAY"));
console.log(dimText("  Translating corridor rituals into Neovim muscle memory...\n"));

TableRenderer.render(NEOVIM_KEY_TRANSLATIONS, [
  { key: "key", label: "Key", width: 10 },
  { key: "corridorAction", label: "Corridor Control", width: 34 },
  { key: "plainCue", label: "Plain Language Cue", width: 34 },
]);

const neovimDrill = new ProgressBar({
  total: NEOVIM_KEY_TRANSLATIONS.length,
  width: 46,
  label: "Neovim Control Loop",
  showPercentage: true,
  colorize: true,
});

for (let i = 0; i < NEOVIM_KEY_TRANSLATIONS.length; i++) {
  await sleep(320);
  neovimDrill.update(i + 1, { suffix: ` ${NEOVIM_KEY_TRANSLATIONS[i].key} → ${NEOVIM_KEY_TRANSLATIONS[i].plainCue}` });
}
neovimDrill.complete();

BoxRenderer.render(
  [
    ColorSystem.colorize("Coach Ritual", ColorSystem.codes.brightMagenta),
    "",
    ...Formatter.wrap(
      "Esc → i → :w → u becomes the safety mantra for the 405 lab. Narrate each key, match it with the traffic action, and log the breath you take between steps.",
      78,
    ).map((line) => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "rounded",
    color: ColorSystem.codes.brightMagenta,
    padding: 1,
    margin: 1,
  },
);

corridorLogger.info("Neovim control keys drilled", { keys: NEOVIM_KEY_TRANSLATIONS.length });
console.log("\n");

// =============================================================================
// 4. HIGHWAY TRAFFIC FLOW ANIMATION
// =============================================================================

console.log(brightWhite("◈ TRAFFIC FLOW VISUALIZATION"));
console.log(dimText("  Monitoring northbound and southbound lanes...\n"));

const trafficSpinner = new Spinner({
  message: "Initializing traffic sensors...",
  frames: ["▱▱▱▱▱▱▱", "▰▱▱▱▱▱▱", "▰▰▱▱▱▱▱", "▰▰▰▱▱▱▱", "▰▰▰▰▱▱▱", "▰▰▰▰▰▱▱", "▰▰▰▰▰▰▱", "▰▰▰▰▰▰▰"],
  interval: 100,
});

trafficSpinner.start();
await sleep(800);
trafficSpinner.update("Calibrating speed detectors...");
await sleep(600);
trafficSpinner.update("Linking emergency response systems...");
await sleep(600);
trafficSpinner.succeed("All traffic systems operational • 24 sensors active");
console.log("\n");

// =============================================================================
// 5. ANIMATED HIGHWAY VISUALIZATION
// =============================================================================

console.log(brightWhite("◈ LIVE HIGHWAY ANIMATION"));
console.log(dimText("  Real-time vehicle flow on I-405...\n"));

const highwayFrames = [
  [
    brightCyan("   ╔═══════════════════════════════════════════════════════╗"),
    brightCyan("   ║") + "                    NORTHBOUND ▲                   " + brightCyan("║"),
    brightCyan("   ║") + "  " + brightYellow("→→→") + "               " + brightYellow("→→→") + "                " + brightYellow("→→→") + "    " + brightCyan("║"),
    brightCyan("   ╠═══════════════════════════════════════════════════════╣"),
    brightCyan("   ║") + "                    SOUTHBOUND ▼                   " + brightCyan("║"),
    brightCyan("   ║") + "      " + brightMagenta("←←←") + "                " + brightMagenta("←←←") + "           " + brightMagenta("←←←") + "    " + brightCyan("║"),
    brightCyan("   ╚═══════════════════════════════════════════════════════╝"),
  ],
  [
    brightCyan("   ╔═══════════════════════════════════════════════════════╗"),
    brightCyan("   ║") + "                    NORTHBOUND ▲                   " + brightCyan("║"),
    brightCyan("   ║") + "      " + brightYellow("→→→") + "               " + brightYellow("→→→") + "            " + brightYellow("→→→") + "    " + brightCyan("║"),
    brightCyan("   ╠═══════════════════════════════════════════════════════╣"),
    brightCyan("   ║") + "                    SOUTHBOUND ▼                   " + brightCyan("║"),
    brightCyan("   ║") + "  " + brightMagenta("←←←") + "           " + brightMagenta("←←←") + "                " + brightMagenta("←←←") + "        " + brightCyan("║"),
    brightCyan("   ╚═══════════════════════════════════════════════════════╝"),
  ],
  [
    brightCyan("   ╔═══════════════════════════════════════════════════════╗"),
    brightCyan("   ║") + "                    NORTHBOUND ▲                   " + brightCyan("║"),
    brightCyan("   ║") + "          " + brightYellow("→→→") + "               " + brightYellow("→→→") + "        " + brightYellow("→→→") + "    " + brightCyan("║"),
    brightCyan("   ╠═══════════════════════════════════════════════════════╣"),
    brightCyan("   ║") + "                    SOUTHBOUND ▼                   " + brightCyan("║"),
    brightCyan("   ║") + "      " + brightMagenta("←←←") + "       " + brightMagenta("←←←") + "                    " + brightMagenta("←←←") + "    " + brightCyan("║"),
    brightCyan("   ╚═══════════════════════════════════════════════════════╝"),
  ],
  [
    brightCyan("   ╔═══════════════════════════════════════════════════════╗"),
    brightCyan("   ║") + "                    NORTHBOUND ▲                   " + brightCyan("║"),
    brightCyan("   ║") + "              " + brightYellow("→→→") + "               " + brightYellow("→→→") + "    " + brightYellow("→→→") + "    " + brightCyan("║"),
    brightCyan("   ╠═══════════════════════════════════════════════════════╣"),
    brightCyan("   ║") + "                    SOUTHBOUND ▼                   " + brightCyan("║"),
    brightCyan("   ║") + "  " + brightMagenta("←←←") + "   " + brightMagenta("←←←") + "                        " + brightMagenta("←←←") + "        " + brightCyan("║"),
    brightCyan("   ╚═══════════════════════════════════════════════════════╝"),
  ],
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l")); // Hide cursor

for (let cycle = 0; cycle < 4; cycle++) {
  for (const frame of highwayFrames) {
    if (cycle > 0 || highwayFrames.indexOf(frame) > 0) {
      Deno.stdout.writeSync(encoder.encode("\x1B[7A")); // Move up
    }
    for (const line of frame) {
      console.log(line);
    }
    await sleep(150);
  }
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h")); // Show cursor
console.log(brightGreen("\n  ✓ Traffic flowing smoothly • Average speed: 62 mph\n"));

// =============================================================================
// 6. DISTRICT DEVELOPMENT PROGRESS
// =============================================================================

console.log(brightWhite("◈ CORRIDOR DISTRICTS DEVELOPMENT"));
console.log(dimText("  Tracking growth across key zones...\n"));

const districts = [
  {
    name: "Airport District",
    icon: "✈",
    description: "Aviation hub and gateway infrastructure",
    progress: [15, 20, 18, 22, 25],
    delay: 110,
    metrics: { businesses: 347, employment: 8420 },
  },
  {
    name: "Meridian Corridor",
    icon: "🏢",
    description: "Commercial and retail center",
    progress: [18, 22, 20, 20, 20],
    delay: 95,
    metrics: { businesses: 892, employment: 14650 },
  },
  {
    name: "Lake Hefner Recreation",
    icon: "🌊",
    description: "Waterfront dining and leisure zone",
    progress: [20, 18, 22, 20, 20],
    delay: 100,
    metrics: { businesses: 156, employment: 2840 },
  },
  {
    name: "Northwest Expressway",
    icon: "🛍",
    description: "Premium shopping and entertainment district",
    progress: [16, 20, 24, 22, 18],
    delay: 105,
    metrics: { businesses: 624, employment: 11230 },
  },
];

for (const district of districts) {
  console.log(
    `\n${ColorSystem.colorize(`  ${district.icon} ${district.name}`, ColorSystem.codes.brightCyan)}`,
  );
  console.log(dimText(`     ${district.description}`));

  const districtBar = new ProgressBar({
    total: 100,
    width: 48,
    showValue: false,
    showPercentage: true,
    colorize: true,
  });

  let progress = 0;
  for (const step of district.progress) {
    progress = Math.min(100, progress + step);
    districtBar.update(progress);
    corridorLogger.debug("District progress", {
      district: district.name,
      progress,
      ...district.metrics,
    });
    await sleep(district.delay);
  }

  districtBar.complete();
  corridorLogger.info(`${district.name} vitality assessed`, district.metrics);
}
console.log("\n");

// =============================================================================
// 7. CULTURAL PULSE VISUALIZATION
// =============================================================================

console.log(brightWhite("◈ CULTURAL LANDMARK PULSE"));
console.log(dimText("  Monitoring community heartbeat...\n"));

const landmarkSpinner = new Spinner({
  message: "Scanning cultural activity at Will Rogers Airport...",
  frames: ["◐", "◓", "◑", "◒"],
  interval: 115,
});

const culturalMessages = [
  "Tracking events at Quail Springs Mall...",
  "Monitoring dining traffic around Lake Hefner...",
  "Analyzing retail flow on Memorial Road...",
  "Measuring community engagement at parks & recreation...",
];

landmarkSpinner.start();
for (const message of culturalMessages) {
  landmarkSpinner.update(message);
  await sleep(800);
}
landmarkSpinner.succeed("Cultural vitality strong • 12 major events this week");
console.log("\n");

// =============================================================================
// 8. ECONOMIC VITALITY WAVEFORM
// =============================================================================

console.log(brightWhite("◈ ECONOMIC VITALITY WAVEFORM"));
console.log(dimText("  Measuring corridor prosperity index...\n"));

const waveColors = [
  ColorSystem.codes.brightYellow,
  ColorSystem.codes.brightGreen,
  ColorSystem.codes.brightCyan,
  ColorSystem.codes.brightMagenta,
];

const wavePatterns = [
  "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█",
  "▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇",
  "▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆",
  "▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅",
  "▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄",
  "▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃",
  "▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂",
  "█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁",
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l"));

for (let i = 0; i < 36; i++) {
  const pattern = wavePatterns[i % wavePatterns.length];
  const color = waveColors[Math.floor(i / 9) % waveColors.length];
  const coloredWave = ColorSystem.colorize(pattern, color);
  Deno.stdout.writeSync(encoder.encode(`\r  ${coloredWave}   `));
  await sleep(85);
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h"));
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(50) + "\r"));
console.log(brightGreen("  ✓ Economic vitality: 89.4% of maximum capacity\n"));

// =============================================================================
// 9. CORRIDOR METRICS TABLE
// =============================================================================

console.log(brightWhite("◈ 405 CORRIDOR VITAL STATISTICS"));
console.log(dimText("  Real-time performance indicators...\n"));

TableRenderer.render(
  [
    {
      metric: "Daily Traffic Volume",
      value: Formatter.number(147800) + " vehicles",
      trend: "↑ +4.2%",
      status: "Optimal",
    },
    {
      metric: "Average Speed",
      value: "62 mph",
      trend: "↔ steady",
      status: "Green",
    },
    {
      metric: "Business Activity",
      value: Formatter.number(2019) + " establishments",
      trend: "↑ +7.8%",
      status: "Growing",
    },
    {
      metric: "Employment Index",
      value: Formatter.number(37140) + " jobs",
      trend: "↑ +5.3%",
      status: "Strong",
    },
    {
      metric: "Development Projects",
      value: "18 active",
      trend: "↑ +12.5%",
      status: "Booming",
    },
    {
      metric: "Public Transit Access",
      value: "8 routes",
      trend: "↔ stable",
      status: "Connected",
    },
  ],
  [
    { key: "metric", label: "Metric", width: 24 },
    { key: "value", label: "Current Value", width: 18, align: "right" },
    { key: "trend", label: "Trend", width: 12, align: "center" },
    { key: "status", label: "Status", width: 14 },
  ],
  { showIndex: true },
);
console.log("");

// =============================================================================
// 10. FUTURE PROJECTION SPINNER
// =============================================================================

console.log(brightWhite("◈ CORRIDOR FUTURE PROJECTION"));
console.log(dimText("  Forecasting 5-year development trajectory...\n"));

const projectionSpinner = new Spinner({
  message: "Analyzing growth models...",
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 85,
});

projectionSpinner.start();
await sleep(1400);
projectionSpinner.succeed("Projections complete • Strong growth expected through 2030");
console.log("");

// =============================================================================
// 11. CLOSING DECLARATION
// =============================================================================

const closingSpinner = new Spinner({
  message: "Finalizing corridor assessment...",
  frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"],
  interval: 95,
});

closingSpinner.start();
await sleep(950);
closingSpinner.succeed("Assessment complete • Data archived");
console.log("");

BoxRenderer.render(
  [
    "",
    brightYellow("  The 405 Corridor represents Oklahoma City's dynamic"),
    brightYellow("  northern gateway—a thriving artery of commerce, culture,"),
    brightYellow("  and community connecting diverse districts and opportunities."),
    "",
    dimText("                 Where the heartland moves forward."),
    "",
  ],
  {
    style: "double",
    title: "◆ CORRIDOR DECLARATION ◆",
    color: ColorSystem.codes.brightCyan,
    padding: 1,
  },
);

console.log("\n");

// Final summary
BoxRenderer.render(
  [
    brightCyan("✓") + " Traffic systems: All green",
    brightCyan("✓") + " District vitality: Thriving across all zones",
    brightCyan("✓") + " Economic indicators: Strong upward momentum",
    brightCyan("✓") + " Future outlook: Continued expansion & prosperity",
  ],
  {
    style: "rounded",
    title: "System Status",
    color: ColorSystem.codes.brightGreen,
    padding: 1,
  },
);

console.log("\n");

const finalLines = [
  dimText("    ════════════════════════════════════════════════════════════════════"),
  "",
  brightYellow("                          4 0 5   C O R R I D O R"),
  brightCyan("                   Oklahoma City's Pulse  ◆  Always Moving"),
  "",
  dimText("    ════════════════════════════════════════════════════════════════════"),
];

for (const line of finalLines) {
  console.log(line);
  await sleep(120);
}

console.log("\n");
corridorLogger.success("405 Corridor animation lab sequence complete");
corridorLogger.info("All monitoring systems nominal • Terminal restored");
