#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Fixed Update Renderer Demo
 *
 * Demonstrates the FixedUpdateRenderer with vsync-like timing
 * for smooth animations without glitching.
 *
 * Features:
 *   • Fixed FPS update loop
 *   • Single render callback per frame
 *   • Consistent frame timing
 *   • Perfect for games and smooth animations
 */

import {
  AnimationLoop,
  ColorSystem,
  FixedUpdateRenderer,
  RainbowAnimation,
  WaveAnimation,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// DEMO 1: Fixed Update Renderer with Custom Rendering
// =============================================================================

async function fixedUpdateDemo() {
  const renderer = new FixedUpdateRenderer(30); // 30 FPS

  let frame = 0;
  const rainbow = new RainbowAnimation("=".repeat(60), 0.05);
  const wave = new WaveAnimation(60, 2);

  // Cleanup handler
  const cleanup = () => {
    renderer.cleanup();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", cleanup);

  // Set render callback - this is called exactly at target FPS
  renderer.setRenderCallback(() => {
    const lines: string[] = [];

    // Clear screen at beginning
    if (frame === 0) {
      lines.push("\x1b[2J");
    }

    // Title
    lines.push(ColorSystem.colorize("\n╔════════════════════════════════════════════════════════════════════╗\n", ColorSystem.codes.brightCyan));
    lines.push(ColorSystem.colorize("║        ⚡ FIXED UPDATE RENDERER - SMOOTH 30 FPS                   ║\n", ColorSystem.codes.brightCyan));
    lines.push(ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╝\n", ColorSystem.codes.brightCyan));
    lines.push("\n");

    // Rainbow border
    const rainbowBorder = rainbow.update();
    lines.push(`  ╔${rainbowBorder}╗\n`);

    // Wave content
    const waveStr = wave.update(1 / 30);
    lines.push(`  ║${ColorSystem.colorize(waveStr, ColorSystem.codes.brightYellow)}║\n`);

    // Bottom border
    lines.push(`  ╚${"═".repeat(60)}╝\n`);
    lines.push("\n");

    // Info
    lines.push(ColorSystem.colorize(`  Frame: ${frame}/150\n`, ColorSystem.codes.white));
    lines.push(ColorSystem.colorize("  Fixed 30 FPS - No frame drops or glitching!\n", ColorSystem.codes.dim));
    lines.push(ColorSystem.colorize("  Using vsync-like timing for smooth rendering\n", ColorSystem.codes.dim));

    frame++;

    if (frame >= 150) {
      setTimeout(cleanup, 2000);
    }

    return lines.join("");
  });

  renderer.start();

  // Keep running until cleanup
  await new Promise(() => {});
}

// =============================================================================
// DEMO 2: Animation Loop with Batched Output
// =============================================================================

async function animationLoopBatchedDemo() {
  console.clear();
  console.log("\n");
  console.log(ColorSystem.colorize("╔════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightMagenta));
  console.log(ColorSystem.colorize("║     🎨 ANIMATION LOOP WITH BATCHED RENDERING                      ║", ColorSystem.codes.brightMagenta));
  console.log(ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╝", ColorSystem.codes.brightMagenta));
  console.log("\n");

  const loop = new AnimationLoop({ fps: 30, maxFrames: 120 });

  const rainbow = new RainbowAnimation("✨ GENESIS TRACE - NO GLITCHING! ✨", 0.05);
  const pulse = new PulseAnimation("❤️  HEARTBEAT  ❤️", 3);
  const wave = new WaveAnimation(50, 2, ColorSystem.codes.brightCyan);

  let lineNum = 6;

  // Rainbow text - returns ANSI codes for cursor positioning
  loop.add(() => {
    const text = rainbow.update();
    return `\x1b[${lineNum};1H\x1b[K  ${text}`;
  });

  lineNum += 2;

  // Pulse animation
  loop.add((_frame, deltaTime) => {
    const text = pulse.update(deltaTime);
    return `\x1b[${lineNum};1H\x1b[K  ${text}`;
  });

  lineNum += 2;

  // Wave animation
  loop.add((_frame, deltaTime) => {
    const text = wave.update(deltaTime);
    return `\x1b[${lineNum};1H\x1b[K  ${text}`;
  });

  lineNum += 2;

  // Frame counter
  loop.add((frame) => {
    return `\x1b[${lineNum};1H\x1b[K  ${ColorSystem.colorize(`Frame: ${frame + 1}/120`, ColorSystem.codes.white)}`;
  });

  // Info
  loop.add(() => {
    return `\x1b[${lineNum + 1};1H\x1b[K  ${ColorSystem.colorize("All animations batched into single write operation!", ColorSystem.codes.dim)}`;
  });

  // Cleanup handler
  const cleanup = () => {
    loop.stop();
    console.log("\n\n");
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", cleanup);

  loop.start();

  // Wait for completion
  await sleep(4000);
  cleanup();
}

class PulseAnimation {
  private time = 0;

  constructor(
    private text: string,
    private speed = 2,
    private minIntensity = 0.3,
  ) {}

  update(deltaTime: number): string {
    this.time += deltaTime;
    const intensity = (Math.sin(this.time * this.speed) + 1) / 2;
    const adjustedIntensity = this.minIntensity + intensity * (1 - this.minIntensity);

    const r = Math.round(adjustedIntensity * 255);
    const g = Math.round(adjustedIntensity * 100);
    const b = Math.round(adjustedIntensity * 100);

    return ColorSystem.colorize(this.text, ColorSystem.rgb(r, g, b));
  }
}

// =============================================================================
// DEMO 3: Game Loop Example
// =============================================================================

async function gameLoopDemo() {
  console.clear();
  console.log("\n");
  console.log(ColorSystem.colorize("╔════════════════════════════════════════════════════════════════════╗", ColorSystem.codes.brightGreen));
  console.log(ColorSystem.colorize("║          🎮 GAME LOOP EXAMPLE - 60 FPS                             ║", ColorSystem.codes.brightGreen));
  console.log(ColorSystem.colorize("╚════════════════════════════════════════════════════════════════════╝", ColorSystem.codes.brightGreen));
  console.log("\n");

  const loop = new AnimationLoop({ fps: 60, maxFrames: 300 });

  // Player position
  let playerX = 5;
  let playerY = 10;
  let velocityX = 1;
  let velocityY = 0.5;

  // Boundaries
  const minX = 5;
  const maxX = 60;
  const minY = 7;
  const maxY = 18;

  // Game loop
  loop.add((frame, deltaTime) => {
    // Update physics
    playerX += velocityX * deltaTime * 30;
    playerY += velocityY * deltaTime * 30;

    // Bounce off boundaries
    if (playerX <= minX || playerX >= maxX) {
      velocityX *= -1;
      playerX = Math.max(minX, Math.min(maxX, playerX));
    }
    if (playerY <= minY || playerY >= maxY) {
      velocityY *= -1;
      playerY = Math.max(minY, Math.min(maxY, playerY));
    }

    // Build frame output
    const output: string[] = [];

    // Clear playing field
    output.push(`\x1b[7;1H\x1b[K  ╔${"═".repeat(60)}╗`);
    for (let y = minY; y <= maxY; y++) {
      output.push(`\x1b[${y + 1};1H\x1b[K  ║${" ".repeat(60)}║`);
    }
    output.push(`\x1b[${maxY + 2};1H\x1b[K  ╚${"═".repeat(60)}╝`);

    // Draw player
    const px = Math.floor(playerX);
    const py = Math.floor(playerY);
    output.push(`\x1b[${py + 1};${px}H${ColorSystem.colorize("●", ColorSystem.codes.brightYellow)}`);

    // Info
    output.push(`\x1b[${maxY + 4};1H\x1b[K  ${ColorSystem.colorize(`FPS: 60 | Frame: ${frame + 1}/300`, ColorSystem.codes.white)}`);
    output.push(`\x1b[${maxY + 5};1H\x1b[K  ${ColorSystem.colorize(`Position: (${px}, ${py}) | Velocity: (${velocityX.toFixed(2)}, ${velocityY.toFixed(2)})`, ColorSystem.codes.dim)}`);
    output.push(`\x1b[${maxY + 6};1H\x1b[K  ${ColorSystem.colorize("Smooth 60 FPS physics simulation!", ColorSystem.codes.dim)}`);

    return output.join("");
  });

  // Cleanup handler
  const cleanup = () => {
    loop.stop();
    console.log("\n\n");
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", cleanup);

  loop.start();

  // Wait for completion
  await sleep(5000);
  cleanup();
}

// =============================================================================
// Run Demos
// =============================================================================

// Run demo 2 (batched animation loop)
await animationLoopBatchedDemo();

await sleep(1000);

// Run demo 3 (game loop)
await gameLoopDemo();

// Note: Demo 1 (fixed update renderer) runs indefinitely, so it's commented out
// Uncomment to try it:
// await fixedUpdateDemo();
