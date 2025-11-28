#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Animation Showcase
 *
 * Demonstrates the real-time animation loop capabilities of GenesisTrace.
 * Features:
 *   • Real-time animation loop with FPS control
 *   • Rainbow text effects
 *   • Pulse animations
 *   • Wave animations
 *   • Particle systems
 *   • Matrix rain effect
 *   • Loading bar animations
 *   • Fade effects
 */

import {
  AnimationLoop,
  BannerRenderer,
  ColorSystem,
  FadeAnimation,
  LoadingBarAnimation,
  MatrixRainAnimation,
  ParticleSystem,
  PulseAnimation,
  RainbowAnimation,
  TerminalDetector,
  WaveAnimation,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

// =============================================================================
// 1. SHOWCASE BANNER
// =============================================================================

BannerRenderer.render({
  title: "⚡ ANIMATION SHOWCASE",
  subtitle: "Real-time animation loop with GenesisTrace",
  description: "Demonstrating FPS-controlled animations, particles, and visual effects",
  version: "v2.0",
  author: "Animation Lab",
  width: 96,
  color: ColorSystem.codes.brightMagenta,
});
console.log("\n");

// =============================================================================
// 2. RAINBOW TEXT ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("1. Rainbow Text Animation", ColorSystem.codes.bright));
console.log("");

const rainbow = new RainbowAnimation("✨ GENESIS TRACE ✨", 0.05);
const rainbowLoop = new AnimationLoop({ fps: 30, maxFrames: 90 });

rainbowLoop.add(() => {
  TerminalDetector.clearLine();
  const text = rainbow.update();
  Deno.stdout.writeSync(new TextEncoder().encode(`\r${text}`));
});

rainbowLoop.start();
await sleep(3000);
console.log("\n\n");

// =============================================================================
// 3. PULSE ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("2. Pulse Animation", ColorSystem.codes.bright));
console.log("");

const pulse = new PulseAnimation("❤️  HEARTBEAT  ❤️", ColorSystem.codes.red, 3, 0.2);
const pulseLoop = new AnimationLoop({ fps: 30, maxFrames: 90 });

pulseLoop.add((frame, deltaTime) => {
  TerminalDetector.clearLine();
  const text = pulse.update(deltaTime);
  Deno.stdout.writeSync(new TextEncoder().encode(`\r${text}`));
});

pulseLoop.start();
await sleep(3000);
console.log("\n\n");

// =============================================================================
// 4. WAVE ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("3. Wave Animation", ColorSystem.codes.bright));
console.log("");

const wave = new WaveAnimation(40, 2, ColorSystem.codes.brightCyan);
const waveLoop = new AnimationLoop({ fps: 30, maxFrames: 120 });

waveLoop.add((frame, deltaTime) => {
  TerminalDetector.clearLine();
  const text = wave.update(deltaTime);
  Deno.stdout.writeSync(new TextEncoder().encode(`\r${text}`));
});

waveLoop.start();
await sleep(4000);
console.log("\n\n");

// =============================================================================
// 5. LOADING BAR ANIMATIONS
// =============================================================================

console.log(ColorSystem.colorize("4. Loading Bar Animations", ColorSystem.codes.bright));
console.log("");

const loadingBars = [
  { name: "Fill Style", bar: new LoadingBarAnimation(30, "fill", "█", ColorSystem.codes.green) },
  { name: "Bounce Style", bar: new LoadingBarAnimation(30, "bounce", "●", ColorSystem.codes.yellow) },
  { name: "Wave Style", bar: new LoadingBarAnimation(30, "wave", "▓", ColorSystem.codes.cyan) },
];

const barLoop = new AnimationLoop({ fps: 30, maxFrames: 150 });

barLoop.add((frame, deltaTime) => {
  // Move cursor up to overwrite previous output
  if (frame > 0) {
    TerminalDetector.cursorUp(loadingBars.length);
  }

  for (const { name, bar } of loadingBars) {
    const text = bar.update(deltaTime);
    console.log(`${name.padEnd(15)}: ${text}`);
  }
});

barLoop.start();
await sleep(5000);
console.log("\n");

// =============================================================================
// 6. PARTICLE SYSTEM
// =============================================================================

console.log(ColorSystem.colorize("5. Particle System", ColorSystem.codes.bright));
console.log("");

const particles = new ParticleSystem(60, 15);
const particleLoop = new AnimationLoop({ fps: 30, maxFrames: 180 });

// Emit particles periodically
let lastEmit = 0;
particleLoop.add((frame, deltaTime) => {
  lastEmit += deltaTime;

  // Emit particles every 100ms
  if (lastEmit > 0.1) {
    const colors = [
      ColorSystem.codes.red,
      ColorSystem.codes.yellow,
      ColorSystem.codes.green,
      ColorSystem.codes.cyan,
      ColorSystem.codes.blue,
      ColorSystem.codes.magenta,
    ];

    particles.emit(
      30,
      14,
      {
        vx: (Math.random() - 0.5) * 20,
        vy: -Math.random() * 15,
        maxLife: 2 + Math.random() * 2,
        char: "•",
        color: colors[Math.floor(Math.random() * colors.length)],
      },
    );
    lastEmit = 0;
  }

  particles.update(deltaTime);

  // Move cursor up to overwrite
  if (frame > 0) {
    TerminalDetector.cursorUp(15);
  }

  const render = particles.render();
  console.log(render);
});

particleLoop.start();
await sleep(6000);
console.log("\n");

// =============================================================================
// 7. MATRIX RAIN EFFECT
// =============================================================================

console.log(ColorSystem.colorize("6. Matrix Rain Effect", ColorSystem.codes.bright));
console.log("");

const termSize = TerminalDetector.getSize();
const matrixWidth = Math.min(60, termSize.columns - 4);
const matrixHeight = 20;

const matrix = new MatrixRainAnimation(matrixWidth, matrixHeight, 0.15);
const matrixLoop = new AnimationLoop({ fps: 20, maxFrames: 100 });

matrixLoop.add((frame, deltaTime) => {
  // Move cursor up to overwrite
  if (frame > 0) {
    TerminalDetector.cursorUp(matrixHeight);
  }

  const render = matrix.update(deltaTime);
  console.log(render);
});

matrixLoop.start();
await sleep(5000);
console.log("\n");

// =============================================================================
// 8. FADE ANIMATION
// =============================================================================

console.log(ColorSystem.colorize("7. Fade In Animation", ColorSystem.codes.bright));
console.log("");

const fadeText = "✨ Fading in... ✨";
const fade = new FadeAnimation(fadeText, { duration: 2000, easing: (t) => t * t });
const fadeLoop = new AnimationLoop({ fps: 30 });

fadeLoop.add(() => {
  const time = performance.now();
  TerminalDetector.clearLine();
  const text = fade.update(time);
  Deno.stdout.writeSync(new TextEncoder().encode(`\r${text}`));

  if (fade.isComplete()) {
    fadeLoop.stop();
  }
});

fadeLoop.start();
await sleep(2500);
console.log("\n\n");

// =============================================================================
// 9. COMBINED ANIMATION SHOWCASE
// =============================================================================

console.log(ColorSystem.colorize("8. Combined Animation Loop", ColorSystem.codes.bright));
console.log("");

const combinedRainbow = new RainbowAnimation("━".repeat(50), 0.03);
const combinedWave = new WaveAnimation(50, 1.5, ColorSystem.codes.brightBlue);
const combinedPulse = new PulseAnimation("⬢ GENESIS TRACE ⬢", ColorSystem.codes.magenta, 2);

const combinedLoop = new AnimationLoop({ fps: 30, maxFrames: 180 });

combinedLoop.add((frame, deltaTime) => {
  if (frame > 0) {
    TerminalDetector.cursorUp(5);
  }

  console.log(combinedRainbow.update());
  console.log(combinedWave.update(deltaTime));
  console.log("          " + combinedPulse.update(deltaTime));
  console.log(combinedWave.update(deltaTime));
  console.log(combinedRainbow.update());
});

combinedLoop.start();
await sleep(6000);
console.log("\n");

// =============================================================================
// 10. COMPLETION
// =============================================================================

console.log(ColorSystem.colorize("Animation showcase completed!", ColorSystem.codes.brightGreen));
console.log("");
console.log(ColorSystem.colorize("Key features demonstrated:", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Real-time animation loop with FPS control", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Rainbow, pulse, and wave effects", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Particle systems with physics", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Matrix rain effect", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Loading bar variations", ColorSystem.codes.dim));
console.log(ColorSystem.colorize("  • Fade in/out animations", ColorSystem.codes.dim));
console.log("");
