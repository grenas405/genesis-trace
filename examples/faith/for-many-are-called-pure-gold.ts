#!/usr/bin/env -S deno run --allow-env

/**
 * Pure Gold Animation – "For many are called, but few are chosen."
 *
 * Uses the AnimationLoop and ColorSystem utilities to paint a shimmering,
 * gold plated proclamation of Matthew 22:14. The halo, border, and text
 * all breathe at different speeds to keep the declaration alive.
 *
 * Run with:
 *   deno run --allow-env examples/faith/for-many-are-called-pure-gold.ts
 */

import { AnimationLoop, BannerRenderer, ColorSystem, TerminalDetector } from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PHRASE = "FOR MANY ARE CALLED, BUT FEW ARE CHOSEN";
const INNER_WIDTH = 54;
const TOTAL_WIDTH = INNER_WIDTH + 4;
const BLOCK_LINES = 7;
const DURATION_MS = 16000;

type RGB = [number, number, number];

const moltenGold: RGB = [205, 155, 29];
const deepGold: RGB = [161, 114, 21];
const pureGold: RGB = [255, 243, 176];
const highlightGold: RGB = [255, 255, 215];
const edgeGold = ColorSystem.rgb(255, 227, 168);

const haloSymbols = ["✷", "⋆", "✶", "•", "·", " "];
const glowSymbols = ["·", "•", "·", " "];

function mix(a: RGB, b: RGB, t: number): RGB {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

function createHaloLine(frame: number, phase = 0): string {
  const cells: string[] = [];

  for (let i = 0; i < TOTAL_WIDTH; i++) {
    const symbol = haloSymbols[(i + frame) % haloSymbols.length];
    const wave = (Math.sin(frame * 0.15 + i * 0.28 + phase) + 1) / 2;
    const rgb = mix(deepGold, pureGold, 0.35 + wave * 0.45);
    if (symbol === " ") {
      cells.push(" ");
    } else {
      cells.push(ColorSystem.colorize(symbol, ColorSystem.rgb(rgb[0], rgb[1], rgb[2])));
    }
  }

  return cells.join("");
}

function createGlowLine(frame: number, phase = 0): string {
  const cells: string[] = [];

  for (let i = 0; i < INNER_WIDTH; i++) {
    const symbol = glowSymbols[(i + Math.floor(frame / 2)) % glowSymbols.length];
    const wave = (Math.sin(frame * 0.2 + i * 0.33 + phase) + 1) / 2;
    const rgb = mix(moltenGold, highlightGold, 0.25 + wave * 0.55);

    if (symbol === " ") {
      cells.push(" ");
    } else {
      cells.push(ColorSystem.colorize(symbol, ColorSystem.rgb(rgb[0], rgb[1], rgb[2])));
    }
  }

  return cells.join("");
}

function renderBorderLine(frame: number, type: "top" | "bottom"): string {
  const cap = type === "top" ? ["╔", "╗"] : ["╚", "╝"];
  const wave = (Math.sin(frame * 0.18 + (type === "top" ? 0 : Math.PI / 2)) + 1) / 2;
  const rgb = mix(moltenGold, pureGold, 0.3 + wave * 0.5);
  const span = `${cap[0]}${"═".repeat(INNER_WIDTH + 2)}${cap[1]}`;
  return ColorSystem.colorize(span, ColorSystem.rgb(rgb[0], rgb[1], rgb[2]));
}

function renderInnerGlow(frame: number, phase: number): string {
  const left = ColorSystem.colorize("║", edgeGold);
  const right = ColorSystem.colorize("║", edgeGold);
  return `${left} ${createGlowLine(frame, phase)} ${right}`;
}

function renderTextLine(frame: number): string {
  const leftPad = Math.floor((INNER_WIDTH - PHRASE.length) / 2);
  const rightPad = INNER_WIDTH - PHRASE.length - leftPad;
  const paddingLeft = " ".repeat(leftPad);
  const paddingRight = " ".repeat(rightPad);

  const colored = PHRASE.split("").map((char, index) => {
    if (char === " ") return " ";
    const wave = (Math.sin(frame * 0.24 + index * 0.4) + 1) / 2;
    const rgb = mix(moltenGold, highlightGold, 0.45 + wave * 0.45);
    return ColorSystem.colorize(char, ColorSystem.rgb(rgb[0], rgb[1], rgb[2]));
  }).join("");

  const left = ColorSystem.colorize("║", edgeGold);
  const right = ColorSystem.colorize("║", edgeGold);

  return `${left} ${paddingLeft}${colored}${paddingRight} ${right}`;
}

function buildGoldenFrame(frame: number): string {
  const lines = [
    createHaloLine(frame, 0),
    renderBorderLine(frame, "top"),
    renderInnerGlow(frame, 0),
    renderTextLine(frame),
    renderInnerGlow(frame, Math.PI / 2),
    renderBorderLine(frame, "bottom"),
    createHaloLine(frame, Math.PI),
  ];

  return lines.join("\n");
}

async function runPureGoldAnimation() {
  console.clear();
  console.log("");
  BannerRenderer.render({
    title: "PURE GOLD DECLARATION",
    subtitle: "For many are called, but few are chosen",
    description: "Matthew 22:14 rendered as a shimmering gold proclamation",
    width: 86,
    color: ColorSystem.rgb(255, 214, 120),
    author: "GenesisTrace Animation Lab",
  });
  console.log("");
  console.log(
    ColorSystem.colorize(
      "Animating sacred text in pure gold. Press Ctrl+C to exit early.",
      ColorSystem.codes.brightYellow,
    ),
  );
  console.log("");

  const loop = new AnimationLoop({ fps: 24 });
  let firstFrame = true;

  loop.add((frame) => {
    const block = buildGoldenFrame(frame);
    if (!firstFrame) {
      TerminalDetector.cursorUp(BLOCK_LINES);
    } else {
      firstFrame = false;
    }
    return `${block}\n`;
  });

  loop.start();
  await sleep(DURATION_MS);
  loop.stop();

  console.log(
    ColorSystem.colorize(
      "\nMatthew 22:14 — remain faithful, remain in gold.",
      ColorSystem.rgb(255, 230, 180),
    ),
  );
}

if (import.meta.main) {
  await runPureGoldAnimation();
}
