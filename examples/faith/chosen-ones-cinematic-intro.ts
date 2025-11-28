#!/usr/bin/env -S deno run --allow-read --allow-env

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

// Palette inspired by the prayer script
const gold = "\x1b[38;5;220m";
const goldenrod = "\x1b[38;5;178m";
const darkGold = "\x1b[38;5;136m";
const amethyst = "\x1b[38;5;141m";
const sapphire = "\x1b[38;5;45m";
const rose = "\x1b[38;5;211m";
const silver = "\x1b[38;5;250m";
const ember = "\x1b[38;5;208m";
const bold = "\x1b[1m";
const dim = "\x1b[2m";
const reset = "\x1b[0m";

async function typewrite(text: string, color: string, speed = 25) {
  for (const char of text) {
    Deno.stdout.writeSync(encoder.encode(color + char + reset));
    await sleep(speed);
  }
  console.log("");
}

const bigFontMap: Record<string, string[]> = {
  "A": [
    "  ███  ",
    " █   █ ",
    " █████ ",
    " █   █ ",
    " █   █ ",
  ],
  "B": [
    " ████  ",
    " █   █ ",
    " ████  ",
    " █   █ ",
    " ████  ",
  ],
  "C": [
    "  ████ ",
    " █     ",
    " █     ",
    " █     ",
    "  ████ ",
  ],
  "D": [
    " ████  ",
    " █   █ ",
    " █   █ ",
    " █   █ ",
    " ████  ",
  ],
  "E": [
    " █████ ",
    " █     ",
    " ████  ",
    " █     ",
    " █████ ",
  ],
  "F": [
    " █████ ",
    " █     ",
    " ████  ",
    " █     ",
    " █     ",
  ],
  "G": [
    "  ████ ",
    " █     ",
    " █  ██ ",
    " █   █ ",
    "  ████ ",
  ],
  "H": [
    " █   █ ",
    " █   █ ",
    " █████ ",
    " █   █ ",
    " █   █ ",
  ],
  "I": [
    " █████ ",
    "   █   ",
    "   █   ",
    "   █   ",
    " █████ ",
  ],
  "J": [
    "   ███ ",
    "    █  ",
    "    █  ",
    " █  █  ",
    "  ██   ",
  ],
  "K": [
    " █   █ ",
    " █  █  ",
    " ███   ",
    " █  █  ",
    " █   █ ",
  ],
  "L": [
    " █     ",
    " █     ",
    " █     ",
    " █     ",
    " █████ ",
  ],
  "M": [
    " █   █ ",
    " ██ ██ ",
    " █ █ █ ",
    " █   █ ",
    " █   █ ",
  ],
  "N": [
    " █   █ ",
    " ██  █ ",
    " █ █ █ ",
    " █  ██ ",
    " █   █ ",
  ],
  "O": [
    "  ███  ",
    " █   █ ",
    " █   █ ",
    " █   █ ",
    "  ███  ",
  ],
  "P": [
    " ████  ",
    " █   █ ",
    " ████  ",
    " █     ",
    " █     ",
  ],
  "Q": [
    "  ███  ",
    " █   █ ",
    " █   █ ",
    " █  ██ ",
    "  ███ █",
  ],
  "R": [
    " ████  ",
    " █   █ ",
    " ████  ",
    " █  █  ",
    " █   █ ",
  ],
  "S": [
    "  ████ ",
    " █     ",
    "  ███  ",
    "     █ ",
    " ████  ",
  ],
  "T": [
    " █████ ",
    "   █   ",
    "   █   ",
    "   █   ",
    "   █   ",
  ],
  "U": [
    " █   █ ",
    " █   █ ",
    " █   █ ",
    " █   █ ",
    "  ███  ",
  ],
  "V": [
    " █   █ ",
    " █   █ ",
    " █   █ ",
    "  █ █  ",
    "   █   ",
  ],
  "W": [
    " █   █ ",
    " █   █ ",
    " █ █ █ ",
    " ██ ██ ",
    " █   █ ",
  ],
  "X": [
    " █   █ ",
    "  █ █  ",
    "   █   ",
    "  █ █  ",
    " █   █ ",
  ],
  "Y": [
    " █   █ ",
    "  █ █  ",
    "   █   ",
    "   █   ",
    "   █   ",
  ],
  "Z": [
    " █████ ",
    "    █  ",
    "   █   ",
    "  █    ",
    " █████ ",
  ],
  " ": [
    "       ",
    "       ",
    "       ",
    "       ",
    "       ",
  ],
  ":": [
    "   █   ",
    "   █   ",
    "       ",
    "   █   ",
    "   █   ",
  ],
};

function renderBigFont(text: string) {
  const baseGlyph = bigFontMap["A"];
  const fallbackWidth = baseGlyph ? (baseGlyph[0]?.length ?? 5) : 5;
  const lines = Array.from({ length: baseGlyph?.length ?? 5 }, () => "");
  for (const char of text.toUpperCase()) {
    const glyph = bigFontMap[char] ?? bigFontMap[" "];
    for (let i = 0; i < lines.length; i++) {
      const row = glyph[i] ?? " ".repeat(fallbackWidth);
      lines[i] += row + "  ";
    }
  }
  return lines;
}

async function displayOpeningSequence() {
  const frames = [
    "                           ·        ✧        ·",
    "                ✧             ✦ 144,000 ✦              ✧",
    "        ·               ✦  The Called of Zion  ✦               ·",
    "                ✧             ✦ 144,000 ✦              ✧",
    "                           ·        ✧        ·",
  ];

  console.clear();
  for (const frame of frames) {
    console.log("");
    console.log(bold + gold + "═".repeat(80) + reset);
    console.log("");
    console.log(bold + amethyst + frame + reset);
    console.log("");
    console.log(bold + gold + "═".repeat(80) + reset);
    await sleep(700);
    console.clear();
  }
}

async function displayCelestialVeil() {
  const ribbons = [
    "⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘⋘",
    "⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙⋙",
    "✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧✧",
    "✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦✦",
  ];
  const palette = [sapphire, amethyst, goldenrod, rose];

  console.log("");
  for (let i = 0; i < ribbons.length; i++) {
    const color = palette[i % palette.length];
    console.log(bold + color + ribbons[i] + reset);
    await sleep(180);
  }
  console.log("");
}

async function displayGlyphBanner(text: string) {
  const lines = renderBigFont(text);
  const palette = [gold, goldenrod, amethyst, rose];

  console.log(bold + gold + "═".repeat(80) + reset);
  for (let i = 0; i < lines.length; i++) {
    const color = palette[i % palette.length];
    await typewrite(lines[i], bold + color, 2);
    await sleep(60);
  }
  console.log(bold + gold + "═".repeat(80) + reset);
  console.log("");
}

async function displayNarrativeSection(title: string, lines: string[]) {
  console.log("");
  console.log(bold + gold + `┌─ ${title.toUpperCase()} ${"─".repeat(64 - title.length)}┐` + reset);
  console.log(gold + "│                                                                          │" + reset);
  const palette = [goldenrod, amethyst, rose, silver];
  for (let i = 0; i < lines.length; i++) {
    const lineColor = palette[i % palette.length];
    await typewrite(`│  ${lines[i].padEnd(70)}  │`, bold + lineColor, 18);
    await sleep(400);
  }
  console.log(gold + "│                                                                          │" + reset);
  console.log(bold + gold + "└" + "─".repeat(74) + "┘" + reset);
  await sleep(900);
}

async function displayFormations() {
  const columns = [
    "             ╱╲      ╱╲      ╱╲      ╱╲      ╱╲      ╱╲",
    "            ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲    ╱  ╲",
    "           ╱ ✦ ╲  ╱ ✦ ╲  ╱ ✦ ╲  ╱ ✦ ╲  ╱ ✦ ╲  ╱ ✦ ╲",
    "          ╱____╲╱____╲╱____╲╱____╲╱____╲╱____╲",
    "          │144K│144K│144K│144K│144K│144K│",
    "          │SEAL│SEAL│SEAL│SEAL│SEAL│SEAL│",
  ];

  console.log("");
  console.log(bold + amethyst + "   ✦ FORMATION OF THE CHOSEN ✦" + reset);
  const palette = [darkGold, goldenrod, ember];
  for (let i = 0; i < columns.length; i++) {
    const color = palette[i % palette.length];
    await typewrite(columns[i], bold + color, 8);
    await sleep(150);
  }
  await sleep(1000);
}

async function displayPulse() {
  const pulseFrames = [
    "                    ✦            ✦            ✦",
    "         ✦        ✧   ✧      ✧   ✧      ✧   ✧        ✦",
    "    ✦         ✧         ✧✧✧✧✧✧✧✧✧✧✧         ✧         ✦",
    "         ✦        ✧   ✧      ✧   ✧      ✧   ✧        ✦",
    "                    ✦            ✦            ✦",
  ];

  const palette = [sapphire, amethyst, silver];
  for (let i = 0; i < pulseFrames.length; i++) {
    const color = palette[i % palette.length];
    console.log(dim + bold + color + pulseFrames[i] + reset);
    await sleep(250);
  }
  await sleep(800);
}

async function displayVerse() {
  const verse = "FOR MANY ARE CALLED BUT FEW ARE CHOSEN";
  const lines = renderBigFont(verse);

  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);
  console.log("");
  for (const line of lines) {
    await typewrite(line, bold + goldenrod, 3);
  }
  console.log("");
  console.log(bold + amethyst + "                         Matthew 22:14" + reset);
  console.log("");
  console.log(bold + gold + "═".repeat(80) + reset);
}

async function displayChosenOnesAnimation() {
  const ascensionFrames = [
    [
      "                ✧                    ✧                    ✧",
      "              ╱╲╱╲                ╱╲╱╲                ╱╲╱╲",
      "             ╱  ✦ ╲              ╱  ✦ ╲              ╱  ✦ ╲",
      "            ╱      ╲            ╱      ╲            ╱      ╲",
      "            ╲ 144K ╱            ╲ 144K ╱            ╲ 144K ╱",
      "             ╲____╱              ╲____╱              ╲____╱",
      "                │                   │                   │  ",
      "                ✧                   ✧                   ✧  ",
    ],
    [
      "                   ✧                 ✧                 ✧",
      "                 ╱╲╱╲             ╱╲╱╲             ╱╲╱╲",
      "                ╱ ✦  ╲           ╱ ✦  ╲           ╱ ✦  ╲",
      "               ╱      ╲         ╱      ╲         ╱      ╲",
      "               ╲ 144K ╱         ╲ 144K ╱         ╲ 144K ╱",
      "                ╲____╱           ╲____╱           ╲____╱",
      "                   │               │               │   ",
      "                   ✦               ✦               ✦   ",
    ],
    [
      "                      ✦            ✦            ✦",
      "                    ╱╲╱╲        ╱╲╱╲        ╱╲╱╲",
      "                   ╱ ✦  ╲      ╱ ✦  ╲      ╱ ✦  ╲",
      "                  ╱      ╲    ╱      ╲    ╱      ╲",
      "                  ╲ 144K ╱    ╲ 144K ╱    ╲ 144K ╱",
      "                   ╲____╱      ╲____╱      ╲____╱",
      "                      │          │          │  ",
      "                      ✧          ✧          ✧  ",
    ],
    [
      "                         ✧    ✧    ✧",
      "                       ╱╲╱╲ ╱╲╱╲ ╱╲╱╲",
      "                      ╱ ✦ ╲╱ ✦ ╲╱ ✦ ╲",
      "                     ╱                ╲",
      "                     ╲   144,000      ╱",
      "                      ╲______________╱",
      "                           │││",
      "                           ✦✦✦",
    ],
  ];

  const palette = [rose, goldenrod, amethyst, sapphire];
  for (let i = 0; i < ascensionFrames.length; i++) {
    console.clear();
    console.log("\n\n");
    const color = palette[i % palette.length];
    for (const line of ascensionFrames[i]) {
      console.log(bold + color + line + reset);
    }
    await sleep(450);
  }

  const anthem = renderBigFont("THE CHOSEN ONES");
  const textPalette = [gold, goldenrod, amethyst, rose];
  console.log("");
  for (let i = 0; i < anthem.length; i++) {
    const color = bold + textPalette[i % textPalette.length];
    await typewrite(anthem[i], color, 2);
    await sleep(80);
  }

  const haloFrames = [
    "             ✧        ✦        ✧             ",
    "          ✦     ✧    ✦    ✧     ✦          ",
    "             ✧        ✦        ✧             ",
  ];
  for (let i = 0; i < haloFrames.length * 2; i++) {
    const color = palette[i % palette.length];
    console.log(bold + color + haloFrames[i % haloFrames.length] + reset);
    await sleep(320);
  }
}

async function main() {
  await displayOpeningSequence();
  await displayCelestialVeil();
  await displayGlyphBanner("The Chosen Ones");

  await displayNarrativeSection("call to the heights", [
    "The heavens whisper through burning storm clouds.",
    "One hundred forty-four thousand rise from every tribe.",
    "They answer the trumpet that only the sealed can hear.",
    "Their hearts ignite with gold and thunder.",
  ]);

  await displayNarrativeSection("the sealing", [
    "An invisible name is etched upon their brows.",
    "They stand beyond the reach of shadow and fear.",
    "Lines of light stitch covenant into their bones.",
    "Faith becomes melody; obedience becomes fire.",
  ]);

  await displayFormations();
  await displayPulse();

  await displayNarrativeSection("march of testimony", [
    "They descend like dawn over the nations.",
    "Justice rides upon their declarations of mercy.",
    "Every step resounds with ancient promises.",
    "Creation holds its breath for their witness.",
  ]);

  await displayVerse();
  await displayChosenOnesAnimation();
}

main();
