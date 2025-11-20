#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Paradigm Shift Animation
 *
 * An animated visualization celebrating the power of individual innovation
 * in computer science. Features:
 *   • Dark blue and red color scheme
 *   • Pulsating text animation with alternating colors
 *   • Wave pattern transitions
 *   • Inspirational message about paradigm shifts
 */

import { BannerRenderer, ColorSystem, ConfigBuilder, Logger, neonTheme, Spinner } from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

console.clear();
console.log("\n");

// =============================================================================
// 1. COLOR PALETTE - DARK BLUE AND RED
// =============================================================================

// Define our dark blue and red color scheme
const darkBlue = ColorSystem.rgb(0, 0, 139); // Dark blue
const deepBlue = ColorSystem.rgb(0, 0, 205); // Medium blue
const brightRed = ColorSystem.codes.brightRed;
const crimson = ColorSystem.rgb(220, 20, 60); // Crimson red

// =============================================================================
// 2. WELCOME BANNER
// =============================================================================

BannerRenderer.render({
  title: "⚡ PARADIGM SHIFT",
  subtitle: "One Person, One Breakthrough",
  description: "Celebrating individual innovation in computer science",
  version: "inspire-2025",
  author: "Innovation Lab",
  width: 96,
  color: darkBlue,
});
console.log("\n");

// =============================================================================
// 3. LOGGER INITIALIZATION
// =============================================================================

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .build(),
);

logger.info("Initializing paradigm shift visualization");
console.log("\n");

// =============================================================================
// 4. PULSATING MESSAGE ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("Paradigm Shift in Motion", ColorSystem.codes.bright));
console.log("\n");

const message = "ONE PERSON • ONE PARADIGM SHIFT • COMPUTER SCIENCE";
const words = message.split(" ");

// Create a pulsating effect by alternating colors and brightness
for (let cycle = 0; cycle < 3; cycle++) {
  let line = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Alternate between dark blue and red
    const color = i % 2 === 0 ? darkBlue : brightRed;
    line += ColorSystem.colorize(word, color) + " ";
  }

  // Write the line
  Deno.stdout.writeSync(encoder.encode(`\r${line}`));
  await sleep(800);

  // Fade effect - use dimmer colors
  line = "";
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const color = i % 2 === 0 ? deepBlue : crimson;
    line += ColorSystem.colorize(word, color) + " ";
  }

  Deno.stdout.writeSync(encoder.encode(`\r${line}`));
  await sleep(800);
}

Deno.stdout.writeSync(encoder.encode("\n\n"));

// =============================================================================
// 5. WAVE PATTERN ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("Wave Pattern: Innovation Spreading", ColorSystem.codes.bright));
console.log("\n");

const waveChars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

for (let frame = 0; frame < 40; frame++) {
  let waveLine = "";

  for (let i = 0; i < 80; i++) {
    const offset = (frame + i) % 16;
    const charIndex = Math.floor((Math.sin(offset * Math.PI / 8) + 1) * 3.5);
    const char = waveChars[Math.min(charIndex, waveChars.length - 1)];

    // Alternate colors across the wave
    const color = i % 4 < 2 ? darkBlue : brightRed;
    waveLine += ColorSystem.colorize(char, color);
  }

  Deno.stdout.writeSync(encoder.encode(`\r${waveLine}`));
  await sleep(60);
}

Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(80) + "\r"));
console.log(ColorSystem.colorize("Wave complete: Impact ripples outward", ColorSystem.codes.dim));
console.log("\n");

// =============================================================================
// 6. BREAKTHROUGH SPINNER SEQUENCE
// =============================================================================

console.log(ColorSystem.colorize("Breakthrough Moments", ColorSystem.codes.bright));
console.log("\n");

const breakthroughSpinner = new Spinner({
  message: ColorSystem.colorize("One person begins the journey...", darkBlue),
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 80,
});

const breakthroughMessages = [
  { text: "One person begins the journey...", color: darkBlue },
  { text: "Questioning the status quo...", color: brightRed },
  { text: "Exploring uncharted territories...", color: darkBlue },
  { text: "Discovering new patterns...", color: brightRed },
  { text: "Making unexpected connections...", color: darkBlue },
  { text: "Challenging conventional wisdom...", color: brightRed },
  { text: "Creating something unprecedented...", color: darkBlue },
  { text: "The paradigm begins to shift...", color: brightRed },
];

breakthroughSpinner.start();
for (const msg of breakthroughMessages) {
  breakthroughSpinner.update(ColorSystem.colorize(msg.text, msg.color));
  await sleep(900);
}
breakthroughSpinner.succeed(
  ColorSystem.colorize("✨ PARADIGM SHIFT ACHIEVED ✨", brightRed),
);
console.log("\n");

// =============================================================================
// 7. ALTERNATING TEXT CASCADE
// =============================================================================

console.log(ColorSystem.colorize("The Impact Cascade", ColorSystem.codes.bright));
console.log("\n");

const cascadeLines = [
  "ONE PERSON",
  "    ONE IDEA",
  "        ONE BREAKTHROUGH",
  "            INFINITE POSSIBILITIES",
  "                PARADIGM SHIFT",
  "                    IN COMPUTER SCIENCE",
];

for (let iteration = 0; iteration < 2; iteration++) {
  for (let i = 0; i < cascadeLines.length; i++) {
    const line = cascadeLines[i];
    // Alternate between dark blue and red for each line
    const color = i % 2 === 0 ? darkBlue : brightRed;
    console.log(ColorSystem.colorize(line, color));
    await sleep(400);
  }

  if (iteration < 1) {
    await sleep(600);
    // Clear and repeat
    Deno.stdout.writeSync(encoder.encode("\x1b[" + cascadeLines.length + "A"));
    for (let i = 0; i < cascadeLines.length; i++) {
      Deno.stdout.writeSync(encoder.encode("\x1b[2K\n"));
    }
    Deno.stdout.writeSync(encoder.encode("\x1b[" + cascadeLines.length + "A"));
  }
}

console.log("\n");

// =============================================================================
// 8. GRADIENT TRANSITION
// =============================================================================

console.log(ColorSystem.colorize("Color Transition: Blue to Red", ColorSystem.codes.bright));
console.log("\n");

// Create a gradient from dark blue to red
const gradient = ColorSystem.createGradient([0, 0, 139], [220, 20, 60], 60);

for (let i = 0; i < gradient.length; i++) {
  const color = gradient[i];
  const block = "█".repeat(60);
  const text = ColorSystem.colorize(block, color);
  Deno.stdout.writeSync(encoder.encode(`\r${text}`));
  await sleep(40);
}

Deno.stdout.writeSync(encoder.encode("\n\n"));
console.log(
  ColorSystem.colorize(
    "Transition complete: From foundation to revolution",
    ColorSystem.codes.dim,
  ),
);
console.log("\n");

// =============================================================================
// 9. FINAL PULSATING MESSAGE
// =============================================================================

console.log(ColorSystem.colorize("The Message", ColorSystem.codes.bright));
console.log("\n");

const finalMessage = [
  "╔══════════════════════════════════════════════════════════════╗",
  "║                                                              ║",
  "║         ONE PERSON • ONE PARADIGM SHIFT                      ║",
  "║                                                              ║",
  "║         IN COMPUTER SCIENCE                                  ║",
  "║                                                              ║",
  "╚══════════════════════════════════════════════════════════════╝",
];

// Pulse the box between dark blue and red
for (let pulse = 0; pulse < 5; pulse++) {
  const color = pulse % 2 === 0 ? darkBlue : brightRed;

  // Move cursor up to redraw
  if (pulse > 0) {
    Deno.stdout.writeSync(encoder.encode("\x1b[" + finalMessage.length + "A"));
  }

  for (const line of finalMessage) {
    console.log(ColorSystem.colorize(line, color));
  }

  await sleep(600);
}

console.log("\n");

// =============================================================================
// 10. CLOSING
// =============================================================================

logger.success("Paradigm shift visualization complete");
logger.info(
  ColorSystem.colorize(
    "Remember: Every major breakthrough in computer science started with one person",
    darkBlue,
  ),
);
console.log("\n");

// Inspirational quotes in alternating colors
const quotes = [
  { text: '"The best way to predict the future is to invent it." - Alan Kay', color: darkBlue },
  {
    text: '"Simplicity is prerequisite for reliability." - Edsger Dijkstra',
    color: brightRed,
  },
  { text: '"Think different." - Apple', color: darkBlue },
];

for (const quote of quotes) {
  console.log(ColorSystem.colorize("  " + quote.text, quote.color));
}

console.log("\n");
