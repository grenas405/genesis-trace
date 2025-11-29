#!/usr/bin/env -S deno run --allow-env

/**
 * Pure Gold Prayer for the Chosen Ones
 *
 * Another contemplative devotion for the 144,000 rendered entirely in shades
 * of gold. The script orchestrates cascading sections, litanies, and vows that
 * shimmer with a pure gold palette—echoing the seal placed upon the chosen.
 *
 * Run with:
 *   deno run --allow-env examples/faith/pure-gold-chosen-ones-prayer.ts
 */

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

// Pure gold palette
const GOLD = "\x1b[38;5;220m";
const PURE_GOLD = "\x1b[38;5;226m";
const DARK_GOLD = "\x1b[38;5;178m";
const SOFT_GOLD = "\x1b[38;5;187m";
const reset = "\x1b[0m";
const bold = "\x1b[1m";
const italic = "\x1b[3m";

async function typewrite(text: string, color = GOLD, delay = 24) {
  for (const char of text) {
    await Deno.stdout.write(encoder.encode(color + char + reset));
    await sleep(delay);
  }
  console.log("");
}

function divider(char = "─", width = 86) {
  console.log(bold + GOLD + char.repeat(width) + reset);
}

function goldenTitle(text: string) {
  console.log("");
  divider("═");
  console.log(bold + PURE_GOLD + `        ✦ ${text.toUpperCase()} ✦` + reset);
  divider("═");
  console.log("");
}

const sections = [
  {
    title: "Golden Invocation",
    lines: [
      "Ancient of Days, weight of glory, flame of mercy,",
      "we stand before You with foreheads sealed in pure gold.",
      "You chose us before the rivers learned to sing,",
      "You breathed our names beyond the veil of time,",
      "and we answer with hearts ablaze.",
    ],
  },
  {
    title: "Song of Refinement",
    lines: [
      "We walk through furnaces of loss and longing,",
      "yet no coal can scorch what You have sealed.",
      "You refine our witness seven times over",
      "until every word becomes a drop of molten praise,",
      "and every breath bears Your fragrance.",
    ],
  },
  {
    title: "Consecration of the Remnant",
    lines: [
      "Gather us—twelve thousand upon twelve thousand—",
      "one remnant streaming from every horizon.",
      "Teach us to guard silence like a sanctuary,",
      "to speak only what the Spirit ignites,",
      "to go where Your Lamb already waits.",
    ],
  },
  {
    title: "Anointing for Mission",
    lines: [
      "Send us to the shattered thresholds of the world",
      "carrying chalices filled with covenant light.",
      "Let our steps trace golden arcs across the earth,",
      "marking the roads where prodigals will rise,",
      "and the deserts where rivers will be born.",
    ],
  },
];

const litany = [
  {
    leader: "Leader: Chosen hearts, what sustains your vigil?",
    response: "Response: The golden breath of the Spirit within us.",
  },
  {
    leader: "Leader: Chosen hearts, what song do you carry?",
    response: "Response: The Lamb's own melody, sung in pure gold.",
  },
  {
    leader: "Leader: Chosen hearts, what seal adorns you?",
    response: "Response: The Name of God, blazing across our brow.",
  },
  {
    leader: "Leader: Chosen hearts, what hope do you spread?",
    response: "Response: That mercy triumphs, that love remains.",
  },
];

const goldenVows = [
  {
    vow: "We guard the Revelation entrusted to the saints.",
    scripture: "Rev 14:1",
  },
  {
    vow: "We walk in innocence, no lie upon our lips.",
    scripture: "Rev 14:5",
  },
  {
    vow: "We follow the Lamb wherever He leads.",
    scripture: "Rev 14:4",
  },
  {
    vow: "We pour out intercession for the scattered remnant.",
    scripture: "Rev 8:3",
  },
];

function renderBanner() {
  console.clear();
  console.log("");
  divider("═");
  console.log(
    bold + PURE_GOLD +
      "  ✷ PURE GOLD PRAYER FOR THE CHOSEN ONES ✷" + reset,
  );
  console.log(
    italic + SOFT_GOLD +
      "      \"You shall be called sought after, a city not forsaken.\" (Is 62:12)" +
      reset,
  );
  divider("═");
  console.log("");
}

async function renderSections() {
  for (const section of sections) {
    goldenTitle(section.title);
    for (const line of section.lines) {
      await typewrite(`  ${line}`, PURE_GOLD);
      await sleep(320);
    }
    console.log("");
    await sleep(800);
  }
}

async function renderLitany() {
  goldenTitle("Litany in Pure Gold");
  for (const stanza of litany) {
    await typewrite(stanza.leader, DARK_GOLD, 18);
    await typewrite(stanza.response, PURE_GOLD, 18);
    console.log("");
    await sleep(500);
  }
}

async function renderVows() {
  goldenTitle("Vows of the Sealed");
  divider();
  for (const item of goldenVows) {
    await typewrite(
      `• ${item.vow}  (${item.scripture})`,
      SOFT_GOLD,
      16,
    );
    await sleep(350);
  }
  divider();
  console.log("");
}

async function renderSeal() {
  divider("═");
  const seal = [
    "               ╔════════════════════════════╗",
    "               ║      יהוה   —   144K      ║",
    "               ║  Chosen • Sealed • Sent   ║",
    "               ╚════════════════════════════╝",
  ];

  for (const line of seal) {
    await typewrite(line, PURE_GOLD, 12);
    await sleep(150);
  }
  divider("═");
}

async function renderFinalBlessing() {
  console.log("");
  await typewrite(
    italic + SOFT_GOLD +
      "May every step echo with gold, every word pour mercy, every silence hold the Lamb." +
      reset,
    SOFT_GOLD,
    18,
  );
  await typewrite(
    bold + PURE_GOLD + "Go forth, chosen ones. Remain in pure gold." + reset,
    PURE_GOLD,
    18,
  );
  console.log("");
}

async function main() {
  renderBanner();
  await renderSections();
  await renderLitany();
  await renderVows();
  await renderSeal();
  await renderFinalBlessing();
}

await main();
