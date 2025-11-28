#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Buffered Renderer Demo
 *
 * Demonstrates the new BufferedRenderer with double buffering
 * to eliminate TUI glitching using Deno-native methods.
 *
 * Features:
 *   • Double buffering (differential rendering)
 *   • ANSI escape sequences for cursor control
 *   • Alternate screen buffer
 *   • Batched write operations
 *   • No screen flashing or glitching
 */

import {
  BufferedRenderer,
  ColorSystem,
  RainbowAnimation,
  WaveAnimation,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Terminal dimensions
const WIDTH = 80;
const HEIGHT = 24;

// Create renderer
const renderer = new BufferedRenderer(WIDTH, HEIGHT);
renderer.setup();

// Cleanup handler
const cleanup = () => {
  renderer.cleanup();
  Deno.exit(0);
};

// Handle Ctrl+C
Deno.addSignalListener("SIGINT", cleanup);

// =============================================================================
// DEMO 1: Animated Box
// =============================================================================

console.log("Demo 1: Animated Box with Rainbow Border");

async function animatedBoxDemo() {
  const rainbow = new RainbowAnimation("═".repeat(60), 0.1);

  for (let i = 0; i < 60; i++) {
    renderer.clear();

    // Top border
    const topBorder = `╔${rainbow.update()}╗`;
    renderer.write(10, 5, topBorder);

    // Sides
    for (let y = 6; y < 15; y++) {
      renderer.write(10, y, "║", ColorSystem.codes.brightCyan);
      renderer.write(71, y, "║", ColorSystem.codes.brightCyan);
    }

    // Bottom border
    renderer.write(10, 15, `╚${"═".repeat(60)}╝`, ColorSystem.codes.brightCyan);

    // Content
    renderer.write(15, 8, "✨ BUFFERED RENDERING - NO GLITCHING! ✨", ColorSystem.codes.brightYellow);
    renderer.write(15, 10, `Frame: ${i + 1}/60`, ColorSystem.codes.white);
    renderer.write(15, 11, "Double buffering updates only changed cells", ColorSystem.codes.dim);

    renderer.render();
    await sleep(50);
  }
}

await animatedBoxDemo();
await sleep(1000);

// =============================================================================
// DEMO 2: Wave Visualization
// =============================================================================

renderer.clear();
renderer.render();

console.log("\nDemo 2: Wave Visualization");

async function waveDemo() {
  const wave = new WaveAnimation(60, 2);

  for (let i = 0; i < 90; i++) {
    // Only clear the wave area, not entire screen
    renderer.fillRect(10, 8, 60, 5, " ");

    // Title
    renderer.write(10, 5, "🌊 Wave Animation", ColorSystem.codes.brightCyan);
    renderer.write(10, 6, "═".repeat(60), ColorSystem.codes.cyan);

    // Wave
    const waveStr = wave.update(1 / 30);
    renderer.write(10, 10, waveStr);

    // Info
    renderer.write(10, 13, `Frame: ${i + 1}/90`, ColorSystem.codes.white);
    renderer.write(10, 14, "Only changed cells are redrawn!", ColorSystem.codes.dim);

    renderer.render();
    await sleep(33); // ~30 FPS
  }
}

await waveDemo();
await sleep(1000);

// =============================================================================
// DEMO 3: Progress Bars
// =============================================================================

renderer.clear();
renderer.render();

console.log("\nDemo 3: Multiple Progress Bars");

async function progressBarsDemo() {
  const progressValues = [0, 0, 0];
  const speeds = [1.5, 2.0, 1.0];
  const colors = [
    ColorSystem.codes.brightGreen,
    ColorSystem.codes.brightBlue,
    ColorSystem.codes.brightMagenta,
  ];

  for (let frame = 0; frame < 100; frame++) {
    // Clear progress area
    renderer.fillRect(10, 8, 60, 12, " ");

    // Title
    renderer.write(10, 5, "📊 Progress Bars", ColorSystem.codes.brightYellow);
    renderer.write(10, 6, "═".repeat(60), ColorSystem.codes.yellow);

    // Update and render progress bars
    for (let i = 0; i < 3; i++) {
      progressValues[i] = Math.min(100, progressValues[i] + speeds[i]);

      const barWidth = 50;
      const filled = Math.floor((progressValues[i] / 100) * barWidth);
      const empty = barWidth - filled;

      const label = `Task ${i + 1}:`;
      const bar = "█".repeat(filled) + "░".repeat(empty);
      const percent = `${progressValues[i].toFixed(1)}%`;

      renderer.write(12, 8 + i * 3, label, ColorSystem.codes.white);
      renderer.write(12, 9 + i * 3, bar, colors[i]);
      renderer.write(64, 9 + i * 3, percent, ColorSystem.codes.white);
    }

    // Info
    renderer.write(10, 18, `Frame: ${frame + 1}/100`, ColorSystem.codes.white);
    renderer.write(10, 19, "Smooth updates with differential rendering", ColorSystem.codes.dim);

    renderer.render();
    await sleep(50);

    // Check if all complete
    if (progressValues.every((v) => v >= 100)) break;
  }
}

await progressBarsDemo();
await sleep(1000);

// =============================================================================
// DEMO 4: Particle System
// =============================================================================

renderer.clear();
renderer.render();

console.log("\nDemo 4: Particle System");

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  char: string;
  color: string;
  life: number;
}

async function particleSystemDemo() {
  const particles: Particle[] = [];
  const emitX = 40;
  const emitY = 12;

  for (let frame = 0; frame < 120; frame++) {
    // Clear particle area
    renderer.fillRect(0, 7, WIDTH, 15, " ");

    // Title
    renderer.write(10, 5, "✨ Particle System", ColorSystem.codes.brightMagenta);

    // Emit new particles
    if (frame % 3 === 0) {
      const chars = ["*", "·", "•", "+", "×"];
      const colors = [
        ColorSystem.codes.brightRed,
        ColorSystem.codes.brightYellow,
        ColorSystem.codes.brightCyan,
        ColorSystem.codes.brightMagenta,
      ];

      particles.push({
        x: emitX,
        y: emitY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        char: chars[Math.floor(Math.random() * chars.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 30,
      });
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * 0.5;
      p.y += p.vy * 0.5;
      p.vy += 0.2; // gravity
      p.life--;

      if (p.life <= 0 || p.y > 22 || p.y < 7 || p.x < 0 || p.x > WIDTH) {
        particles.splice(i, 1);
      }
    }

    // Render particles
    for (const p of particles) {
      const x = Math.floor(p.x);
      const y = Math.floor(p.y);
      if (x >= 0 && x < WIDTH && y >= 7 && y < 22) {
        renderer.write(x, y, p.char, p.color);
      }
    }

    // Info
    renderer.write(10, 22, `Particles: ${particles.length} | Frame: ${frame + 1}/120`, ColorSystem.codes.white);

    renderer.render();
    await sleep(33);
  }
}

await particleSystemDemo();
await sleep(1000);

// =============================================================================
// DEMO 5: Text Scroller
// =============================================================================

renderer.clear();
renderer.render();

console.log("\nDemo 5: Smooth Text Scroller");

async function textScrollerDemo() {
  const text = "    *** GENESIS TRACE - PROFESSIONAL TERMINAL RENDERING *** ".split("");
  const scrollWidth = 60;
  let offset = 0;

  for (let frame = 0; frame < 150; frame++) {
    // Clear scroll area
    renderer.fillRect(10, 8, scrollWidth, 8, " ");

    // Title
    renderer.write(10, 5, "📜 Text Scroller", ColorSystem.codes.brightGreen);
    renderer.write(10, 6, "═".repeat(60), ColorSystem.codes.green);

    // Scroll text
    const rainbow = new RainbowAnimation("", 0.05);
    let scrollText = "";

    for (let i = 0; i < scrollWidth; i++) {
      const charIndex = (offset + i) % text.length;
      scrollText += text[charIndex];
    }

    // Apply rainbow colors
    for (let i = 0; i < scrollText.length; i++) {
      const hue = (frame * 5 + i * 10) % 360;
      const color = hslToRgb(hue, 100, 50);
      const colorCode = ColorSystem.rgb(color[0], color[1], color[2]);
      renderer.write(10 + i, 10, scrollText[i], colorCode);
    }

    // Box
    renderer.write(9, 9, "┌" + "─".repeat(scrollWidth) + "┐", ColorSystem.codes.green);
    renderer.write(9, 11, "└" + "─".repeat(scrollWidth) + "┘", ColorSystem.codes.green);
    renderer.write(9, 10, "│", ColorSystem.codes.green);
    renderer.write(10 + scrollWidth, 10, "│", ColorSystem.codes.green);

    // Info
    renderer.write(10, 14, `Frame: ${frame + 1}/150`, ColorSystem.codes.white);
    renderer.write(10, 15, "No glitching with buffered rendering!", ColorSystem.codes.dim);

    offset = (offset + 1) % text.length;

    renderer.render();
    await sleep(50);
  }
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

await textScrollerDemo();

// =============================================================================
// Cleanup
// =============================================================================

await sleep(2000);
cleanup();
