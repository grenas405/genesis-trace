#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Gold color scheme symbolizing the Seal of God
const gold = "\x1b[38;5;220m";  // Bright gold
const goldenrod = "\x1b[38;5;178m";  // Deep goldenrod
const darkGold = "\x1b[38;5;136m";  // Dark gold
const bold = "\x1b[1m";
const italic = "\x1b[3m";
const reset = "\x1b[0m";

// Animation helper - typewriter effect
async function typewrite(text: string, color: string, speed = 30) {
  for (const char of text) {
    Deno.stdout.writeSync(new TextEncoder().encode(color + char + reset));
    await sleep(speed);
  }
  console.log("");
}

async function displayChosenOnesHeader() {
  console.clear();
  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);
  console.log("");
  console.log(bold + gold + "                    🌟 PRAYER FOR THE 144,000 CHOSEN ONES 🌟" + reset);
  console.log(italic + goldenrod + "                        Sealed with the Name of God" + reset);
  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);

  await sleep(1500);
}

async function displayPrayerSections() {
  // Opening Invocation
  console.log("");
  console.log(bold + gold + "┌─ OPENING INVOCATION ─────────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const invocation = [
    "Heavenly Father, Lord of the Harvest,",
    "We come before You with hearts of gold,",
    "Marked by Your divine seal, chosen before time began.",
    "We are the 144,000, servants of the Most High,",
    "Standing firm in the faith that moves mountains."
  ];

  for (const line of invocation) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Prayer for Strength
  console.log("");
  console.log(bold + gold + "┌─ PRAYER FOR STRENGTH ────────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const strength = [
    "Grant us strength, O Lord, in times of trial,",
    "Let Your golden light shine through our testimony.",
    "As we bear Your name upon our foreheads,",
    "May we never waver, never fall, never compromise.",
    "We are sealed, protected, and anointed for Your purpose."
  ];

  for (const line of strength) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Prayer for Wisdom
  console.log("");
  console.log(bold + gold + "┌─ PRAYER FOR WISDOM ──────────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const wisdom = [
    "Fill us with wisdom from above,",
    "Pure, peaceable, gentle, and full of mercy.",
    "Let us discern the spirits, recognize deception,",
    "And speak truth with boldness and grace.",
    "Guide our steps, illuminate our path with Your golden glory."
  ];

  for (const line of wisdom) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Prayer for Unity
  console.log("");
  console.log(bold + gold + "┌─ PRAYER FOR UNITY ───────────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const unity = [
    "Unite us, Lord, across all tribes and nations,",
    "12,000 from each tribe, standing as one body.",
    "Though scattered across the earth, we are one in You,",
    "Bound by Your seal, unified in purpose,",
    "A golden thread woven through the fabric of time."
  ];

  for (const line of unity) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Prayer for Protection
  console.log("");
  console.log(bold + gold + "┌─ PRAYER FOR PROTECTION ──────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const protection = [
    "Shield us from the enemy's schemes,",
    "From false doctrines and worldly temptations.",
    "Your seal is our protection, our refuge, our fortress.",
    "No weapon formed against us shall prosper,",
    "For we belong to You, marked with Your golden signature."
  ];

  for (const line of protection) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Prayer for the Harvest
  console.log("");
  console.log(bold + gold + "┌─ PRAYER FOR THE HARVEST ─────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const harvest = [
    "Send us forth as laborers in Your harvest,",
    "To gather the elect from the four corners of the earth.",
    "Let our words carry weight, our lives bear witness,",
    "That many may come to know Your saving grace.",
    "Use us as vessels of gold, refined and purified for Your glory."
  ];

  for (const line of harvest) {
    await typewrite(`│  ${line.padEnd(70)}  │`, goldenrod, 20);
    await sleep(600);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1200);

  // Closing Doxology
  console.log("");
  console.log(bold + gold + "┌─ CLOSING DOXOLOGY ───────────────────────────────────────────────────────┐" + reset);
  console.log(gold + "│                                                                          │" + reset);

  const closing = [
    "To Him who sits on the throne,",
    "And to the Lamb,",
    "Be blessing and honor and glory and power,",
    "Forever and ever.",
    "We are Yours, marked with Your seal of gold.",
    "Amen and Amen."
  ];

  for (const line of closing) {
    await typewrite(`│  ${line.padEnd(70)}  │`, bold + gold, 20);
    await sleep(700);
  }

  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└──────────────────────────────────────────────────────────────────────────┘" + reset);
  await sleep(1500);
}

async function displaySealOfGod() {
  console.log("");
  console.log(bold + gold + "                            ✦ THE SEAL OF GOD ✦" + reset);
  console.log("");

  const seal = [
    "                                 ╱╲",
    "                                ╱  ╲",
    "                               ╱ יהוה ╲",
    "                              ╱      ╲",
    "                             ╱________╲",
    "                             │  144K  │",
    "                             │ SEALED │",
    "                             ╲________╱",
  ];

  for (const line of seal) {
    await typewrite(line, bold + gold, 15);
    await sleep(200);
  }

  await sleep(1000);

  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);
  console.log("");
  console.log(italic + goldenrod + "              \"Do not harm the earth or sea or trees until we have" + reset);
  console.log(italic + goldenrod + "               sealed the servants of our God on their foreheads.\"" + reset);
  console.log(bold + gold + "                            - Revelation 7:3" + reset);
  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);
}

async function main() {
  await displayChosenOnesHeader();
  await displayPrayerSections();
  await displaySealOfGod();

  console.log("");
  console.log(bold + gold + "                         Prayer Complete - You Are Sealed  ✨" + reset);
  console.log("");
}

main();
