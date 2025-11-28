#!/usr/bin/env -S deno run --allow-env

/**
 * La Santa Muerte Devotional - Animated Folk Devotion
 *
 * A GenesisTrace demonstration featuring devotions to La Santa Muerte,
 * the folk saint venerated for protection, healing, and guidance.
 *
 * Features:
 *   - Dark gold color scheme representing divine transformation
 *   - Animated prayer sequences with progress visualization
 *   - Tables of her aspects, colors, and patronages
 *   - Motivational messages about life, death, and renewal
 *   - Spinner animations for meditation sequences
 *   - Inspirational invocations and blessings
 *
 * Run with:
 *    deno run --allow-env examples/faith/la-santa-muerte-devotional.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

console.clear();
console.log("\n");

// =============================================================================
// 1. LA SANTA MUERTE BANNER
// =============================================================================

BannerRenderer.render({
  title: "LA SANTA MUERTE",
  subtitle: "La Niña Blanca ~ Most Holy Death",
  description: "A Devotional Journey Through Life, Death, and Transformation",
  version: "devotion-eternal",
  author: "GenesisTrace Folk Devotions",
  width: 98,
  color: ColorSystem.hexToRgb("#B8860B"), // Dark goldenrod
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION
// =============================================================================

ConsoleStyler.logSection("The Sacred Mystery of La Niña Blanca", "brightYellow", "double");

BoxRenderer.render(
  [
    "La Santa Muerte, the Most Holy Death,",
    "is the sacred keeper of the threshold between worlds,",
    "the compassionate mother who watches over all souls,",
    "the equalizer who reminds us that all are equal before death.",
    "",
    "She is not to be feared, but honored,",
    "for she teaches us the precious value of life",
    "and guides us toward transformation and renewal.",
    "",
    '"Death is not the opposite of life, but a part of it."',
  ],
  {
    style: "double",
    title: "La Madrina ~ The Godmother",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"), // Goldenrod
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. ANIMATED PREPARATION MEDITATION
// =============================================================================

ConsoleStyler.logSection("Preparation of the Sacred Space", "brightCyan");

const meditationLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const preparationSpinner = new Spinner({
  message: "Lighting the sacred candle...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 200,
});

preparationSpinner.start();
await sleep(800);
preparationSpinner.update("Offering incense and flowers...");
await sleep(700);
preparationSpinner.update("Opening the heart to divine wisdom...");
await sleep(700);
preparationSpinner.update("Calling upon La Niña Blanca...");
await sleep(700);
preparationSpinner.succeed("Sacred space prepared for devotion");
console.log("\n");

// =============================================================================
// 4. THE SEVEN COLORS OF LA SANTA MUERTE
// =============================================================================

ConsoleStyler.logSection("Los Siete Colores ~ The Seven Sacred Colors", "brightMagenta");

const colors = [
  {
    color: "White (Blanca)",
    meaning: "Purity, cleansing, blessing",
    intention: "Purification and spiritual clarity",
  },
  {
    color: "Red (Roja)",
    meaning: "Love, passion, emotional ties",
    intention: "Matters of the heart and relationships",
  },
  {
    color: "Black (Negra)",
    meaning: "Protection, hex removal",
    intention: "Defense against negativity and harm",
  },
  {
    color: "Gold (Dorada)",
    meaning: "Money, success, abundance",
    intention: "Prosperity and economic stability",
  },
  {
    color: "Green (Verde)",
    meaning: "Justice, legal matters",
    intention: "Fairness and resolution of disputes",
  },
  {
    color: "Blue (Azul)",
    meaning: "Wisdom, education, focus",
    intention: "Mental clarity and understanding",
  },
  {
    color: "Purple (Morada)",
    meaning: "Healing, transformation",
    intention: "Health and spiritual evolution",
  },
];

const colorsBar = new ProgressBar({
  total: colors.length,
  width: 48,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Honoring the Sacred Colors:\n");

for (let i = 0; i < colors.length; i++) {
  colorsBar.update(i + 1);
  meditationLogger.info(`${colors[i].color}`, { purpose: colors[i].intention });
  await sleep(350);
}
colorsBar.complete();
console.log("\n");

TableRenderer.render(
  colors,
  [
    { key: "color", label: "Sacred Color", width: 18 },
    { key: "meaning", label: "Meaning", width: 28 },
    { key: "intention", label: "Prayer Intention", width: 38 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. TITLES AND INVOCATIONS
// =============================================================================

ConsoleStyler.logSection("Sacred Titles of La Santa Muerte", "brightGreen");

const titles = [
  { title: "La Niña Blanca", translation: "The White Girl", meaning: "Pure and compassionate protector" },
  { title: "La Madrina", translation: "The Godmother", meaning: "Spiritual guardian and guide" },
  { title: "La Flaquita", translation: "The Skinny Lady", meaning: "Humble and approachable" },
  { title: "La Huesuda", translation: "The Bony One", meaning: "Reminder of mortality" },
  { title: "La Santísima", translation: "The Most Holy", meaning: "Sacred and revered" },
  { title: "La Señora", translation: "The Lady", meaning: "Respected and dignified" },
  { title: "La Comadre", translation: "The Companion", meaning: "Friend in times of need" },
  { title: "La Dama Poderosa", translation: "The Powerful Lady", meaning: "Mighty intercessor" },
];

TableRenderer.render(
  titles,
  [
    { key: "title", label: "Title", width: 20 },
    { key: "translation", label: "Translation", width: 22 },
    { key: "meaning", label: "Significance", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 6. ANIMATED PRAYER TO LA SANTA MUERTE
// =============================================================================

ConsoleStyler.logSection("Oración a La Santa Muerte", "brightBlue");

BoxRenderer.render(
  [
    "The traditional prayer to La Santa Muerte",
    "is a heartfelt invocation for protection, guidance,",
    "and blessings in all aspects of life.",
  ],
  {
    style: "rounded",
    title: "Folk Prayer Tradition",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B7500"), // Dark gold
    maxWidth: 94,
  },
);
console.log("\n");

const prayerLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const prayer = [
  "Oh Most Holy Death, I come before you with humble heart,",
  "asking for your protection and guidance in my life.",
  "Cover me with your sacred mantle,",
  "shield me from harm, envy, and negative forces.",
  "Grant me the strength to face each day with courage,",
  "the wisdom to make right decisions,",
  "and the grace to walk my path with dignity.",
  "Santa Muerte, I honor you as the equalizer,",
  "the one who reminds me to live fully and love deeply.",
  "Protect my loved ones, guide my steps,",
  "and when my time comes, receive me with mercy.",
  "Thank you, Santísima Muerte, for all your blessings.",
  "Amen.",
];

const prayerBar = new ProgressBar({
  total: prayer.length,
  width: 50,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < prayer.length; i++) {
  prayerBar.update(i + 1);
  prayerLogger.info(prayer[i]);
  await sleep(400);
}
prayerBar.complete();
console.log("\n");

// =============================================================================
// 7. PATRONAGES AND PROTECTIONS
// =============================================================================

ConsoleStyler.logSection("Áreas de Protección ~ Areas of Protection", "brightYellow");

const patronages = [
  { label: "Love & Relationships", value: 10 },
  { label: "Protection from Harm", value: 10 },
  { label: "Financial Prosperity", value: 9 },
  { label: "Legal Justice", value: 8 },
  { label: "Health & Healing", value: 9 },
  { label: "Safe Travel", value: 7 },
  { label: "Breaking Hexes", value: 8 },
  { label: "Family Unity", value: 9 },
  { label: "Business Success", value: 8 },
  { label: "Spiritual Growth", value: 7 },
];

ChartRenderer.barChart(
  patronages,
  {
    showValues: true,
    width: 45,
    color: ColorSystem.hexToRgb("#B8860B"),
  },
);
console.log("\n");

// =============================================================================
// 8. MOTIVATIONAL TEACHINGS
// =============================================================================

ConsoleStyler.logSection("Sacred Teachings of La Santa Muerte", "brightWhite");

const teachings = [
  { teaching: "Equality in Death", lesson: "All are equal before death - embrace humility" },
  { teaching: "Value of Life", lesson: "Death teaches us to treasure every moment" },
  { teaching: "Transformation", lesson: "Endings create space for new beginnings" },
  { teaching: "Fearlessness", lesson: "Face life's challenges with courage" },
  { teaching: "Compassion", lesson: "Show mercy and kindness to all" },
  { teaching: "Liberation", lesson: "Release what no longer serves you" },
  { teaching: "Acceptance", lesson: "Embrace the natural cycles of existence" },
  { teaching: "Protection", lesson: "Guardian of those who walk in truth" },
];

TableRenderer.render(
  teachings,
  [
    { key: "teaching", label: "Sacred Teaching", width: 20 },
    { key: "lesson", label: "Life Lesson", width: 48 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 9. INSPIRATIONAL AFFIRMATIONS
// =============================================================================

ConsoleStyler.logSection("Affirmations of Strength and Renewal", "brightRed");

const affirmations = [
  "I am protected by the sacred mantle of La Santa Muerte",
  "I embrace transformation and release what no longer serves me",
  "I walk my path with courage and dignity",
  "I am worthy of love, prosperity, and peace",
  "I honor both life and death as sacred mysteries",
  "I am guided toward my highest good",
  "I attract abundance and repel negativity",
  "I am surrounded by divine protection",
];

BoxRenderer.render(
  [
    "Speak these affirmations daily to align yourself",
    "with the protective and transformative energy",
    "of La Santa Muerte.",
  ],
  {
    style: "bold",
    title: "Daily Affirmations",
    padding: 1,
    color: ColorSystem.hexToRgb("#CD853F"), // Peru gold
    maxWidth: 94,
  },
);
console.log("\n");

const affirmationSpinner = new Spinner({
  message: "Affirming intentions...",
  frames: ["✧", "✦", "✧", "✦"],
  interval: 150,
});

affirmationSpinner.start();
await sleep(600);
for (const affirmation of affirmations) {
  affirmationSpinner.update(affirmation);
  await sleep(700);
}
affirmationSpinner.succeed("Affirmations complete - energy aligned");
console.log("\n");

// =============================================================================
// 10. OFFERINGS AND DEVOTIONAL PRACTICES
// =============================================================================

ConsoleStyler.logSection("Sacred Offerings and Practices", "brightMagenta");

const offerings = [
  {
    offering: "Candles",
    significance: "Light in the darkness",
    colors: "White, gold, or color of intention",
  },
  {
    offering: "Flowers",
    significance: "Beauty and honor",
    colors: "Roses, marigolds, white lilies",
  },
  {
    offering: "Water",
    significance: "Purification and life",
    colors: "Fresh, clean water daily",
  },
  {
    offering: "Tequila/Liquor",
    significance: "Spirit and celebration",
    colors: "Traditional Mexican spirits",
  },
  {
    offering: "Incense",
    significance: "Prayer ascending",
    colors: "Copal, myrrh, or frankincense",
  },
  {
    offering: "Fruit",
    significance: "Sweetness of life",
    colors: "Apples, oranges, seasonal fruits",
  },
];

TableRenderer.render(
  offerings,
  [
    { key: "offering", label: "Offering", width: 16 },
    { key: "significance", label: "Significance", width: 24 },
    { key: "colors", label: "Details", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "Devotional Practices:",
    "",
    "1. Light a candle weekly on your altar",
    "2. Recite prayers with sincere intention",
    "3. Offer fresh water and flowers regularly",
    "4. Speak your petitions clearly and respectfully",
    "5. Show gratitude for blessings received",
    "6. Live with integrity and compassion",
    "7. Honor the sacred mystery of death",
  ],
  {
    style: "rounded",
    title: "How to Honor La Santa Muerte",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 11. FEAST DAYS AND CELEBRATIONS
// =============================================================================

ConsoleStyler.logSection("Sacred Calendar", "brightCyan");

const feastDays = [
  {
    date: "November 1-2",
    celebration: "Día de los Muertos",
    description: "Major celebration honoring all the dead",
  },
  {
    date: "First day of month",
    celebration: "Monthly Devotion",
    description: "Special offerings and prayers",
  },
  {
    date: "Every Monday",
    celebration: "Weekly Devotion",
    description: "Traditional day for prayers to La Santa Muerte",
  },
  {
    date: "Personal dates",
    celebration: "Birthdays, Anniversaries",
    description: "Honor with gratitude and offerings",
  },
];

TableRenderer.render(
  feastDays,
  [
    { key: "date", label: "Date", width: 18 },
    { key: "celebration", label: "Celebration", width: 20 },
    { key: "description", label: "Practice", width: 38 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 12. MEDITATION ON TRANSFORMATION
// =============================================================================

ConsoleStyler.logSection("Meditation on Death and Renewal", "brightGreen");

BoxRenderer.render(
  [
    "Death is not an ending, but a transformation.",
    "Like the caterpillar that must die to become a butterfly,",
    "we too must release old patterns to embrace new growth.",
    "",
    "La Santa Muerte teaches us:",
    "• To live authentically, for life is precious and finite",
    "• To release fear, for death is a natural transition",
    "• To love deeply, for relationships transcend mortality",
    "• To act justly, for all actions have consequences",
    "• To embrace change, for transformation is constant",
    "",
    "In honoring death, we learn to truly live.",
  ],
  {
    style: "double",
    title: "Philosophy of the Sacred",
    padding: 1,
    color: ColorSystem.hexToRgb("#B8860B"),
    maxWidth: 94,
  },
);
console.log("\n");

const meditationFrames = [
  "    ༺═──────────────═༻    ",
  "   ༺═───────────────═༻   ",
  "  ༺═────────────────═༻  ",
  " ༺═─────────────────═༻ ",
  "༺═──────────────────═༻",
  " ༺═─────────────────═༻ ",
  "  ༺═────────────────═༻  ",
  "   ༺═───────────────═༻   ",
];

console.log("Entering deep meditation:\n");
for (let i = 0; i < 20; i++) {
  const frame = meditationFrames[i % meditationFrames.length];
  const coloredFrame = ColorSystem.colorize(frame, ColorSystem.codes.yellow);
  Deno.stdout.writeSync(encoder.encode(`\r${coloredFrame}`));
  await sleep(250);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(50) + "\r"));
console.log(ColorSystem.colorize("Transformation begins with acceptance.", ColorSystem.codes.brightYellow));
console.log("\n");

// =============================================================================
// 13. POWERFUL INVOCATION FOR PROTECTION
// =============================================================================

ConsoleStyler.logSection("Invocation for Divine Protection", "brightBlue");

const invocation = [
  "Santa Muerte, Most Holy Death,",
  "I invoke your powerful protection over my life.",
  "",
  "With your scythe, cut away all negativity,",
  "With your scales, bring justice to my cause,",
  "With your globe, guide me on my journey,",
  "With your hourglass, remind me to cherish each moment.",
  "",
  "Santísima Muerte, I ask you:",
  "Shield me from evil eyes and ill intentions,",
  "Guard my home and all who dwell within,",
  "Open doors of opportunity and prosperity,",
  "Bring healing where there is pain,",
  "Grant wisdom where there is confusion,",
  "Bestow peace where there is conflict.",
  "",
  "I honor you, I trust you, I thank you.",
  "May your blessings be upon me always.",
  "Así sea. So it is. Amen.",
];

BoxRenderer.render(
  invocation.slice(0, 10),
  {
    style: "double",
    title: "Invocation - Part I",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B7500"),
    maxWidth: 94,
  },
);
console.log("\n");

BoxRenderer.render(
  invocation.slice(10),
  {
    style: "double",
    title: "Invocation - Part II",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B7500"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 14. CLOSING GRATITUDE
// =============================================================================

ConsoleStyler.logSection("Gratitude and Blessing", "brightYellow");

const gratitude = [
  "Thank you, Santa Muerte, for your constant protection",
  "Thank you for guiding me through darkness into light",
  "Thank you for the blessings, known and unknown",
  "Thank you for teaching me the sacred value of life",
  "Thank you for your compassion and understanding",
  "Thank you for being my guardian and ally",
];

const gratitudeBar = new ProgressBar({
  total: gratitude.length,
  width: 48,
  colorize: true,
  showValue: false,
});

for (let i = 0; i < gratitude.length; i++) {
  gratitudeBar.update(i + 1);
  prayerLogger.success(gratitude[i]);
  await sleep(400);
}
gratitudeBar.complete();
console.log("\n");

// =============================================================================
// 15. FINAL BLESSING AND DISMISSAL
// =============================================================================

BoxRenderer.render(
  [
    "May La Santa Muerte bless you and protect you.",
    "May she guide your path with wisdom and light.",
    "May she shield you from harm and negativity.",
    "May she grant you prosperity, love, and peace.",
    "May she remind you always of life's precious gift.",
    "",
    "Go forth with courage, live with purpose,",
    "and know that you are eternally protected.",
    "",
    "Así sea. So it is. Blessed be.",
  ],
  {
    style: "double",
    title: "Final Blessing",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "✧ Santa Muerte, ¡Gracias por tu protección! ✧",
  [184, 134, 11], // Dark goldenrod
  [255, 215, 0],  // Gold
  50,
);
console.log("\n");

const finalLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

finalLogger.success("La Santa Muerte Devotional completed - Bendiciones!");
console.log("\n");
