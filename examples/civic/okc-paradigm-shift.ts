#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma City: Epicenter of the Next Paradigm Shift
 *
 * An elegant terminal visualization demonstrating Oklahoma City's emergence
 * as the nexus of transformative computer science innovation.
 *
 * Features:
 *   • Cinematic banner with thematic introduction
 *   • Animated radar pulse emanating from OKC coordinates
 *   • Multi-phase paradigm emergence visualization
 *   • Continental influence propagation animation
 *   • Innovation metrics and future projections
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

// OKC coordinates: 35.4676° N, 97.5164° W
const OKC = { lat: "35.4676°N", lon: "97.5164°W", name: "Oklahoma City" };

console.clear();
console.log("\n");

// =============================================================================
// 1. CINEMATIC OPENING
// =============================================================================

const dimText = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.dim);
const brightCyan = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightCyan);
const brightMagenta = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightMagenta);
const brightYellow = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightYellow);
const brightWhite = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightWhite);
const brightGreen = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightGreen);
const brightRed = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightRed);

// Dramatic fade-in effect
const openingLines = [
  "",
  dimText("    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"),
  "",
  brightCyan("                    T H E   N E X T   P A R A D I G M"),
  "",
  brightMagenta("                         ◆  OKLAHOMA CITY  ◆"),
  "",
  dimText("    ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░"),
  "",
];

for (const line of openingLines) {
  console.log(line);
  await sleep(120);
}
await sleep(400);

BannerRenderer.render({
  title: "⊹ PARADIGM NEXUS ⊹",
  subtitle: `Coordinates: ${OKC.lat} × ${OKC.lon}`,
  description: "Where the heartland meets the horizon of computational possibility",
  version: "epoch.2025",
  author: "Genesis Protocol",
  width: 80,
  color: ColorSystem.codes.brightCyan,
});
console.log("\n");

// =============================================================================
// 2. LOGGER INITIALIZATION
// =============================================================================

const nexusLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(500)
    .build(),
);

nexusLogger.info("Paradigm detection systems initializing", { origin: OKC.name });
nexusLogger.success("Quantum coherence established with continental grid");
nexusLogger.debug("Scanning historical inflection points", {
  previous: ["MIT 1960s", "Silicon Valley 1970s", "Seattle 1990s"],
  emerging: "Oklahoma City 2025",
});
console.log("\n");

// =============================================================================
// 3. ANIMATED RADAR PULSE FROM OKC
// =============================================================================

console.log(brightWhite("◈ ORIGIN PULSE VISUALIZATION"));
console.log(dimText("  Tracing paradigm wavefront from epicenter...\n"));

const radarFrames = [
  [
    "                              ·                              ",
    "                                                             ",
    "                                                             ",
    "                             " + brightCyan("◉") + "                             ",
    "                                                             ",
    "                                                             ",
    "                              ·                              ",
  ],
  [
    "                              ·                              ",
    "                            · · ·                            ",
    "                           ·     ·                           ",
    "                          ·   " + brightCyan("◉") + "   ·                          ",
    "                           ·     ·                           ",
    "                            · · ·                            ",
    "                              ·                              ",
  ],
  [
    "                            · · ·                            ",
    "                        · ·       · ·                        ",
    "                      ·               ·                      ",
    "                     ·       " + brightCyan("◉") + "       ·                     ",
    "                      ·               ·                      ",
    "                        · ·       · ·                        ",
    "                            · · ·                            ",
  ],
  [
    "                        ·  · · · ·  ·                        ",
    "                    · ·               · ·                    ",
    "                  ·                       ·                  ",
    "                 ·           " + brightCyan("◉") + "           ·                 ",
    "                  ·                       ·                  ",
    "                    · ·               · ·                    ",
    "                        ·  · · · ·  ·                        ",
  ],
  [
    "                    ·    · · · · · ·    ·                    ",
    "                · ·                       · ·                ",
    "              ·                               ·              ",
    "             ·               " + brightCyan("◉") + "               ·             ",
    "              ·                               ·              ",
    "                · ·                       · ·                ",
    "                    ·    · · · · · ·    ·                    ",
  ],
  [
    "                ·      · · · · · · · ·      ·                ",
    "            · ·                               · ·            ",
    "          ·                                       ·          ",
    "         ·                   " + brightCyan("◉") + "                   ·         ",
    "          ·                                       ·          ",
    "            · ·                               · ·            ",
    "                ·      · · · · · · · ·      ·                ",
  ],
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l")); // Hide cursor

for (let pulse = 0; pulse < 3; pulse++) {
  for (const frame of radarFrames) {
    Deno.stdout.writeSync(encoder.encode("\x1B[7A")); // Move up 7 lines
    for (const line of frame) {
      console.log(dimText(line.replace(/·/g, "○")));
    }
    await sleep(140);
  }
  await sleep(100);
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h")); // Show cursor
console.log(brightGreen("  ✓ Paradigm wavefront mapped across 2,800 mile radius\n"));

// =============================================================================
// 4. CONTINENTAL INFLUENCE MAP
// =============================================================================

console.log(brightWhite("◈ CONTINENTAL PARADIGM PROPAGATION"));
console.log(dimText("  Visualizing innovation corridors...\n"));

const mapSpinner = new Spinner({
  message: "Rendering geospatial influence matrix...",
  frames: ["◜", "◠", "◝", "◞", "◡", "◟"],
  interval: 100,
});

mapSpinner.start();
await sleep(1200);
mapSpinner.succeed("Influence corridors calculated");

console.log("");

// ASCII Map of USA with OKC highlighted
const usMap = [
  dimText("        ╭─────────────────────────────────────────────────────────╮"),
  dimText("        │") + "    " + dimText("·····") + "                                                  " + dimText("│"),
  dimText("        │") + "  " + dimText("·········") + "   " + dimText("·····") + "                                    " + dimText("│"),
  dimText("        │") + " " + dimText("···········") + " " + dimText("·······") + "  " + dimText("···") + "                             " + dimText("│"),
  dimText("        │") + " " + dimText("·············") + dimText("·······") + " " + dimText("····") + "   " + dimText("···") + "                    " + dimText("│"),
  dimText("        │") + "  " + dimText("···········") + dimText("·······") + "  " + dimText("····") + "  " + dimText("·····") + "                   " + dimText("│"),
  dimText("        │") + "   " + dimText("·········") + dimText("·····") + "    " + brightCyan("◉") + brightYellow(" OKC") + " " + dimText("·····") + "                   " + dimText("│"),
  dimText("        │") + "    " + dimText("·······") + dimText("···") + "     " + brightMagenta("╱") + brightYellow("█████") + brightMagenta("╲") + dimText("····") + "                   " + dimText("│"),
  dimText("        │") + "      " + dimText("·····") + "      " + brightMagenta("╱") + "       " + brightMagenta("╲") + dimText("··") + "                   " + dimText("│"),
  dimText("        │") + "        " + dimText("···") + "     " + dimText("···") + "         " + dimText("··") + "                   " + dimText("│"),
  dimText("        │") + "                  " + dimText("···") + "       " + dimText("·") + "                    " + dimText("│"),
  dimText("        │") + "                    " + dimText("····") + "                           " + dimText("│"),
  dimText("        ╰─────────────────────────────────────────────────────────╯"),
];

for (const line of usMap) {
  console.log(line);
  await sleep(60);
}

console.log("");
BoxRenderer.render(
  [
    brightCyan("◉") + " Epicenter: Oklahoma City, Oklahoma",
    brightYellow("█") + " Innovation Radiation Zone (500mi radius)",
    brightMagenta("╱╲") + " Paradigm Influence Boundary",
  ],
  {
    style: "rounded",
    title: "Legend",
    color: ColorSystem.codes.brightCyan,
    padding: 1,
  },
);
console.log("\n");

// =============================================================================
// 5. PARADIGM EMERGENCE PHASES
// =============================================================================

console.log(brightWhite("◈ PARADIGM EMERGENCE PHASES"));
console.log(dimText("  Tracking transformational milestones...\n"));

const paradigmPhases = [
  {
    name: "Cognitive Infrastructure",
    icon: "◆",
    description: "Distributed reasoning networks emerge from heartland data centers",
    progress: [15, 25, 20, 25, 15],
    color: ColorSystem.codes.brightCyan,
  },
  {
    name: "Synthetic Intelligence Synthesis",
    icon: "◇",
    description: "Novel architectures born from convergent research corridors",
    progress: [20, 18, 22, 25, 15],
    color: ColorSystem.codes.brightMagenta,
  },
  {
    name: "Quantum-Classical Hybridization",
    icon: "○",
    description: "Midwest quantum labs pioneer fault-tolerant computation",
    progress: [12, 18, 25, 28, 17],
    color: ColorSystem.codes.brightYellow,
  },
  {
    name: "Autonomous Systems Convergence",
    icon: "●",
    description: "Agricultural AI expands into universal autonomy frameworks",
    progress: [18, 22, 20, 22, 18],
    color: ColorSystem.codes.brightGreen,
  },
];

for (const phase of paradigmPhases) {
  console.log(
    ColorSystem.colorize(`  ${phase.icon} ${phase.name}`, phase.color),
  );
  console.log(dimText(`    ${phase.description}`));

  const phaseBar = new ProgressBar({
    total: 100,
    width: 50,
    showValue: false,
    showPercentage: true,
    colorize: true,
  });

  let progress = 0;
  for (const step of phase.progress) {
    progress = Math.min(100, progress + step);
    phaseBar.update(progress);
    await sleep(100);
  }
  phaseBar.complete();

  nexusLogger.debug("Phase crystallized", {
    phase: phase.name,
    status: "paradigm-ready",
  });
  console.log("");
}

// =============================================================================
// 6. INNOVATION PULSE WAVEFORM
// =============================================================================

console.log(brightWhite("◈ INNOVATION PULSE WAVEFORM"));
console.log(dimText("  Real-time paradigm energy signature...\n"));

const waveColors = [
  ColorSystem.codes.brightCyan,
  ColorSystem.codes.brightMagenta,
  ColorSystem.codes.brightYellow,
  ColorSystem.codes.brightGreen,
  ColorSystem.codes.brightWhite,
];

const wavePatterns = [
  "▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁",
  "▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂",
  "▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃",
  "▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄",
  "▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅",
  "▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆",
  "▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇",
  "█▇▆▅▄▃▂▁▂▃▄▅▆▇█▇▆▅▄▃▂▁▂▃▄▅▆▇█",
];

Deno.stdout.writeSync(encoder.encode("\x1B[?25l"));

for (let i = 0; i < 40; i++) {
  const pattern = wavePatterns[i % wavePatterns.length];
  const color = waveColors[Math.floor(i / 8) % waveColors.length];
  const coloredWave = ColorSystem.colorize(pattern, color);
  Deno.stdout.writeSync(encoder.encode(`\r  ${coloredWave}   `));
  await sleep(75);
}

Deno.stdout.writeSync(encoder.encode("\x1B[?25h"));
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(60) + "\r"));
console.log(brightGreen("  ✓ Innovation frequency: 847.3 THz (paradigm-critical threshold)\n"));

// =============================================================================
// 7. TRANSFORMATIONAL METRICS
// =============================================================================

console.log(brightWhite("◈ PARADIGM SHIFT METRICS"));
console.log(dimText("  Quantifying transformational magnitude...\n"));

TableRenderer.render(
  [
    {
      metric: "Research Density Index",
      value: "2.47σ",
      trend: "↑ +340%",
      significance: "Exceeds Bay Area (2019)",
    },
    {
      metric: "Talent Convergence Rate",
      value: Formatter.number(12847) + "/yr",
      trend: "↑ +89%",
      significance: "Highest US migration",
    },
    {
      metric: "Capital Velocity",
      value: "$4.2B",
      trend: "↑ +156%",
      significance: "Q3 2025 projection",
    },
    {
      metric: "Patent Acceleration",
      value: Formatter.number(1847),
      trend: "↑ +212%",
      significance: "AI/ML category lead",
    },
    {
      metric: "Paradigm Coherence Index",
      value: "0.923",
      trend: "↑ stable",
      significance: "Critical mass achieved",
    },
  ],
  [
    { key: "metric", label: "Metric", width: 26 },
    { key: "value", label: "Value", width: 14, align: "right" },
    { key: "trend", label: "Trend", width: 12, align: "center" },
    { key: "significance", label: "Significance", width: 26 },
  ],
  { showIndex: true },
);
console.log("");

// =============================================================================
// 8. FUTURE TRAJECTORY VISUALIZATION
// =============================================================================

console.log(brightWhite("◈ TRAJECTORY PROJECTION"));
console.log(dimText("  Modeling paradigm evolution arc...\n"));

const trajectorySpinner = new Spinner({
  message: "Computing probabilistic futures...",
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 80,
});

trajectorySpinner.start();
await sleep(1500);
trajectorySpinner.succeed("Trajectory models converged");
console.log("");

const trajectoryArt = [
  dimText("     2025") + "        " + dimText("2027") + "        " + dimText("2029") + "        " + dimText("2031") + "        " + dimText("2033"),
  "       │           │           │           │           │",
  brightCyan("       ◉") + "───────────" + brightMagenta("◈") + "───────────" + brightYellow("◆") + "───────────" + brightGreen("★") + "───────────" + brightWhite("✦"),
  "       │           │           │           │           │",
  dimText("    Genesis    Expansion   Dominance   Standard    Universal"),
  dimText("     Phase      Phase       Phase      Phase       Phase"),
];

for (const line of trajectoryArt) {
  console.log("  " + line);
  await sleep(100);
}
console.log("");

// =============================================================================
// 9. CLOSING DECLARATION
// =============================================================================

const closingSpinner = new Spinner({
  message: "Sealing paradigm declaration...",
  frames: ["◐", "◓", "◑", "◒"],
  interval: 120,
});

closingSpinner.start();
await sleep(1000);
closingSpinner.succeed("Declaration inscribed in consensus ledger");
console.log("");

BoxRenderer.render(
  [
    "",
    brightYellow("  \"The next great leap in computer science will not emerge"),
    brightYellow("   from the coasts, but from the convergent heartland—"),
    brightYellow("   where pragmatism meets possibility.\""),
    "",
    dimText("                    — The Oklahoma City Thesis, 2025"),
    "",
  ],
  {
    style: "double",
    title: "◆ PARADIGM DECLARATION ◆",
    color: ColorSystem.codes.brightCyan,
    padding: 1,
  },
);

console.log("\n");

// Final flourish
const finalLines = [
  dimText("    ════════════════════════════════════════════════════════════════════"),
  "",
  brightCyan("                     O K L A H O M A   C I T Y"),
  brightMagenta("                  The Epicenter Awakens  ◆  2025"),
  "",
  dimText("    ════════════════════════════════════════════════════════════════════"),
];

for (const line of finalLines) {
  console.log(line);
  await sleep(150);
}

console.log("\n");
nexusLogger.success("Paradigm visualization sequence complete");
nexusLogger.info("Terminal state normalized • Cursor restored");
