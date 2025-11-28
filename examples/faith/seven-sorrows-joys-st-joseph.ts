#!/usr/bin/env -S deno run --allow-env

/**
 * Seven Sorrows and Seven Joys of St. Joseph
 *
 * A GenesisTrace demonstration of this traditional Catholic devotion
 * to St. Joseph, featuring animated meditations on each sorrow and joy
 * from his life as guardian of the Holy Family.
 *
 * Features:
 *   - Animated meditation sequences with spinners and progress bars
 *   - Paired sorrow/joy meditations from Scripture
 *   - Colorized liturgical themes (purple for sorrow, gold for joy)
 *   - Wave animations for contemplative pauses
 *   - Tables and charts of the devotion structure
 *
 * Run with:
 *    deno run --allow-env examples/faith/seven-sorrows-joys-st-joseph.ts
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
// 1. DEVOTION BANNER
// =============================================================================

BannerRenderer.render({
  title: "SEPTEM DOLORES ET GAUDIA",
  subtitle: "Seven Sorrows and Seven Joys of St. Joseph",
  description: "A Traditional Devotion for Wednesdays and the Month of March",
  version: "traditio-catholica",
  author: "GenesisTrace Catholic Devotions",
  width: 98,
  color: ColorSystem.hexToRgb("#6B3FA0"), // Royal purple
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION TO THE DEVOTION
// =============================================================================

ConsoleStyler.logSection("About This Devotion", "brightCyan", "double");

BoxRenderer.render(
  [
    "The devotion of the Seven Sorrows and Seven Joys of St. Joseph",
    "originated in the 15th century and was popularized by",
    "two Franciscan friars who were saved from shipwreck",
    "after invoking St. Joseph under these seven titles.",
    "",
    "This devotion pairs each sorrow St. Joseph experienced",
    "with a corresponding joy, showing how God's providence",
    "transforms our trials into occasions of grace.",
    "",
    "It is traditionally prayed on Wednesdays and during",
    "the month of March, dedicated to St. Joseph.",
  ],
  {
    style: "double",
    title: "Historical Origin",
    padding: 1,
    color: ColorSystem.hexToRgb("#5DADE2"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. PREPARATION FOR MEDITATION
// =============================================================================

ConsoleStyler.logSection("Preparation for Meditation", "brightYellow");

const meditationLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const prepSpinner = new Spinner({
  message: "Entering into prayer...",
  frames: [".", "..", "...", "....", "....."],
  interval: 180,
});

prepSpinner.start();
await sleep(600);
prepSpinner.update("In nomine Patris, et Filii, et Spiritus Sancti...");
await sleep(600);
prepSpinner.update("Placing ourselves in the presence of God...");
await sleep(600);
prepSpinner.update("Invoking the intercession of St. Joseph...");
await sleep(600);
prepSpinner.succeed("Heart prepared for meditation");
console.log("\n");

// =============================================================================
// 4. OPENING PRAYER
// =============================================================================

ConsoleStyler.logSection("Opening Prayer", "brightMagenta");

BoxRenderer.render(
  [
    "O glorious St. Joseph, faithful follower of Jesus Christ,",
    "to thee do we raise our hearts and hands",
    "to implore thy powerful intercession",
    "in obtaining from the benign Heart of Jesus",
    "all the helps and graces necessary",
    "for our spiritual and temporal welfare,",
    "particularly the grace of a happy death,",
    "and the special favor we now implore.",
    "",
    "(Here mention your intention)",
  ],
  {
    style: "rounded",
    title: "Invocation",
    padding: 1,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// THE SEVEN SORROWS AND JOYS - DATA
// =============================================================================

const sorrowsAndJoys = [
  {
    number: 1,
    sorrow: {
      title: "The Doubt of St. Joseph",
      description: "St. Joseph's anguish upon discovering Mary's pregnancy",
      scripture: "Matthew 1:19",
      text: "Joseph, being a just man and unwilling to put her to shame, resolved to divorce her quietly.",
    },
    joy: {
      title: "The Angelic Message",
      description: "The angel reveals the divine mystery to Joseph",
      scripture: "Matthew 1:20-21",
      text: "Joseph, son of David, do not fear to take Mary as your wife, for that which is conceived in her is of the Holy Spirit.",
    },
  },
  {
    number: 2,
    sorrow: {
      title: "The Poverty of the Nativity",
      description: "St. Joseph's sorrow at the humble birth of Jesus",
      scripture: "Luke 2:7",
      text: "She laid him in a manger, because there was no place for them in the inn.",
    },
    joy: {
      title: "The Birth of the Savior",
      description: "The joy of witnessing the Incarnate Word",
      scripture: "Luke 2:10-11",
      text: "Behold, I bring you good news of great joy... For unto you is born this day in the city of David a Savior.",
    },
  },
  {
    number: 3,
    sorrow: {
      title: "The Circumcision",
      description: "St. Joseph's sorrow at the first shedding of Jesus' blood",
      scripture: "Luke 2:21",
      text: "And at the end of eight days, when he was circumcised, he was called Jesus.",
    },
    joy: {
      title: "The Name of Jesus",
      description: "The joy of giving the Holy Name to the Child",
      scripture: "Matthew 1:21",
      text: "You shall call his name Jesus, for he will save his people from their sins.",
    },
  },
  {
    number: 4,
    sorrow: {
      title: "Simeon's Prophecy",
      description: "St. Joseph hears of the sword that will pierce Mary's heart",
      scripture: "Luke 2:34-35",
      text: "A sword will pierce through your own soul also, that thoughts from many hearts may be revealed.",
    },
    joy: {
      title: "The Salvation of Many",
      description: "The joy of knowing Jesus brings salvation to all nations",
      scripture: "Luke 2:30-32",
      text: "My eyes have seen your salvation... a light for revelation to the Gentiles.",
    },
  },
  {
    number: 5,
    sorrow: {
      title: "The Flight into Egypt",
      description: "St. Joseph's anguish fleeing Herod's persecution",
      scripture: "Matthew 2:13-14",
      text: "Rise, take the child and his mother, and flee to Egypt... for Herod is about to search for the child to destroy him.",
    },
    joy: {
      title: "The Overthrow of Idols",
      description: "The joy of Christ's triumph over Egyptian idolatry",
      scripture: "Isaiah 19:1 (Tradition)",
      text: "Behold, the Lord rides on a swift cloud and comes to Egypt; and the idols of Egypt will tremble at his presence.",
    },
  },
  {
    number: 6,
    sorrow: {
      title: "Fear of Archelaus",
      description: "St. Joseph's fear returning from Egypt",
      scripture: "Matthew 2:22",
      text: "When he heard that Archelaus was reigning over Judea... he was afraid to go there.",
    },
    joy: {
      title: "Life in Nazareth",
      description: "The joy of dwelling peacefully with Jesus and Mary",
      scripture: "Matthew 2:23",
      text: "He went and dwelt in a city called Nazareth, that what was spoken by the prophets might be fulfilled.",
    },
  },
  {
    number: 7,
    sorrow: {
      title: "The Loss of Jesus in the Temple",
      description: "St. Joseph's three days of anguished searching",
      scripture: "Luke 2:44-45",
      text: "Supposing him to be in the group they went a day's journey, but then they began to search for him among their relatives.",
    },
    joy: {
      title: "Finding Jesus in the Temple",
      description: "The joy of finding Jesus teaching the doctors",
      scripture: "Luke 2:46",
      text: "After three days they found him in the temple, sitting among the teachers, listening to them and asking them questions.",
    },
  },
];

// =============================================================================
// 5-11. THE SEVEN MEDITATIONS
// =============================================================================

for (const meditation of sorrowsAndJoys) {
  // Section header
  ConsoleStyler.logSection(
    `${meditation.number}. ${meditation.sorrow.title} / ${meditation.joy.title}`,
    "brightWhite",
  );

  // Sorrow meditation
  const sorrowColor = ColorSystem.hexToRgb("#8E44AD"); // Purple for sorrow

  BoxRenderer.render(
    [
      `SORROW: ${meditation.sorrow.description}`,
      "",
      `"${meditation.sorrow.text}"`,
      "",
      `— ${meditation.sorrow.scripture}`,
    ],
    {
      style: "bold",
      title: `Sorrow ${meditation.number}: ${meditation.sorrow.title}`,
      padding: 1,
      color: sorrowColor,
      maxWidth: 94,
    },
  );

  // Animated sorrow contemplation
  const sorrowSpinner = new Spinner({
    message: "Contemplating this sorrow...",
    frames: [".", "..", "...", "..."],
    interval: 200,
  });

  sorrowSpinner.start();
  await sleep(800);
  sorrowSpinner.succeed("Sorrow contemplated");

  // Transition animation
  const transitionFrames = [
    "    |    ",
    "    V    ",
    "   \\|/   ",
    "  --+--  ",
    "   /|\\   ",
    "    ^    ",
  ];

  console.log("");
  for (let i = 0; i < transitionFrames.length; i++) {
    Deno.stdout.writeSync(encoder.encode(`\r  ${ColorSystem.colorize(transitionFrames[i], ColorSystem.codes.dim)}`));
    await sleep(150);
  }
  Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(20) + "\r"));
  console.log("");

  // Joy meditation
  const joyColor = ColorSystem.hexToRgb("#F1C40F"); // Gold for joy

  BoxRenderer.render(
    [
      `JOY: ${meditation.joy.description}`,
      "",
      `"${meditation.joy.text}"`,
      "",
      `— ${meditation.joy.scripture}`,
    ],
    {
      style: "double",
      title: `Joy ${meditation.number}: ${meditation.joy.title}`,
      padding: 1,
      color: joyColor,
      maxWidth: 94,
    },
  );

  // Animated joy contemplation
  const joySpinner = new Spinner({
    message: "Rejoicing in this grace...",
    frames: ["*", "+", "*", "+"],
    interval: 150,
  });

  joySpinner.start();
  await sleep(700);
  joySpinner.succeed("Joy embraced");

  // Prayer after each meditation
  console.log("");
  meditationLogger.info("Our Father... Hail Mary... Glory Be...");

  // Progress indication
  const progressBar = new ProgressBar({
    total: 7,
    width: 35,
    colorize: true,
    showValue: false,
    showPercentage: true,
  });
  progressBar.update(meditation.number);
  if (meditation.number === 7) {
    progressBar.complete();
  }
  console.log("\n");

  // Pause between meditations
  await sleep(400);
}

// =============================================================================
// 12. SUMMARY TABLE
// =============================================================================

ConsoleStyler.logSection("Summary of the Seven Sorrows and Joys", "brightCyan");

TableRenderer.render(
  sorrowsAndJoys.map((m) => ({
    num: m.number,
    sorrow: m.sorrow.title,
    joy: m.joy.title,
  })),
  [
    { key: "num", label: "#", width: 4 },
    {
      key: "sorrow",
      label: "Sorrow",
      width: 36,
      formatter: (val: string) => ColorSystem.colorize(val, ColorSystem.codes.magenta),
    },
    {
      key: "joy",
      label: "Joy",
      width: 36,
      formatter: (val: string) => ColorSystem.colorize(val, ColorSystem.codes.yellow),
    },
  ],
);
console.log("\n");

// =============================================================================
// 13. VISUAL REPRESENTATION
// =============================================================================

ConsoleStyler.logSection("The Pattern of Grace", "brightYellow");

BoxRenderer.render(
  [
    "In each sorrow, God was preparing a greater joy.",
    "In each trial, Joseph trusted in Providence.",
    "In each darkness, light was dawning.",
    "",
    "This is the pattern of the spiritual life:",
    "Through the Cross to the Crown,",
    "Through death to Resurrection,",
    "Through sorrow to eternal Joy.",
  ],
  {
    style: "rounded",
    title: "Meditation",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"),
    maxWidth: 94,
  },
);
console.log("\n");

// Chart showing sorrow-to-joy transformation
const gracePattern = [
  { label: "Doubt to Revelation", value: 10 },
  { label: "Poverty to Salvation", value: 10 },
  { label: "Blood to Holy Name", value: 10 },
  { label: "Prophecy to Light", value: 10 },
  { label: "Flight to Victory", value: 10 },
  { label: "Fear to Peace", value: 10 },
  { label: "Loss to Finding", value: 10 },
];

ChartRenderer.barChart(gracePattern, {
  showValues: false,
  width: 30,
  color: ColorSystem.hexToRgb("#27AE60"),
});
console.log("\n");

// =============================================================================
// 14. CLOSING PRAYER
// =============================================================================

ConsoleStyler.logSection("Closing Prayer", "brightGreen");

const closingPrayer = [
  "O glorious St. Joseph,",
  "spouse of the Immaculate Virgin,",
  "obtain for me a pure, humble, and charitable mind,",
  "and perfect resignation to the divine Will.",
  "",
  "Be my guide, my father, and my model",
  "through life that I may merit to die",
  "as thou didst in the arms of Jesus and Mary.",
  "Amen.",
];

const closingBar = new ProgressBar({
  total: closingPrayer.length,
  width: 46,
  colorize: true,
  showValue: false,
});

for (let i = 0; i < closingPrayer.length; i++) {
  closingBar.update(i + 1);
  if (closingPrayer[i]) {
    meditationLogger.success(closingPrayer[i]);
  } else {
    console.log("");
  }
  await sleep(350);
}
closingBar.complete();
console.log("\n");

// =============================================================================
// 15. TRADITIONAL CONCLUDING VERSICLE
// =============================================================================

ConsoleStyler.logSection("Concluding Versicles", "brightMagenta");

console.log(`  V. ${ColorSystem.colorize("Pray for us, O holy St. Joseph,", ColorSystem.codes.brightWhite)}`);
await sleep(300);
console.log(`  R. ${ColorSystem.colorize("That we may be made worthy of the promises of Christ.", ColorSystem.codes.brightGreen)}`);
console.log("");
await sleep(300);
console.log(`  V. ${ColorSystem.colorize("Ora pro nobis, Sancte Ioseph,", ColorSystem.codes.dim)}`);
await sleep(300);
console.log(`  R. ${ColorSystem.colorize("Ut digni efficiamur promissionibus Christi.", ColorSystem.codes.dim)}`);
console.log("\n");

// =============================================================================
// 16. INDULGENCE AND PRACTICE
// =============================================================================

ConsoleStyler.logSection("Devotional Practice", "brightWhite");

BoxRenderer.render(
  [
    "How to Pray This Devotion:",
    "",
    "1. Make the Sign of the Cross",
    "2. Recite the Opening Prayer",
    "3. For each of the Seven Sorrows and Joys:",
    "   - Meditate on the Sorrow",
    "   - Meditate on the corresponding Joy",
    "   - Pray: Our Father, Hail Mary, Glory Be",
    "4. Recite the Closing Prayer",
    "5. Make the Sign of the Cross",
    "",
    "Traditional Days: Wednesdays, March (Month of St. Joseph)",
    "Special: Seven consecutive Sundays before March 19",
  ],
  {
    style: "double",
    title: "Instructions",
    padding: 1,
    color: ColorSystem.hexToRgb("#34495E"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 17. FINAL BLESSING
// =============================================================================

const finalSpinner = new Spinner({
  message: "Concluding the devotion...",
  frames: ["+", "x", "+", "x"],
  interval: 140,
});

finalSpinner.start();
await sleep(500);
finalSpinner.update("In nomine Patris, et Filii, et Spiritus Sancti...");
await sleep(500);
finalSpinner.succeed("Amen.");
console.log("\n");

BoxRenderer.render(
  [
    "May the Seven Sorrows and Seven Joys of St. Joseph",
    "bring you closer to the Holy Family",
    "and obtain for you every grace you need.",
    "",
    "St. Joseph, Terror of Demons, protect us!",
    "St. Joseph, Patron of the Dying, pray for us!",
    "St. Joseph, Hope of the Sick, intercede for us!",
  ],
  {
    style: "double",
    title: "Final Blessing",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B4513"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Ite ad Ioseph! - Go to Joseph!",
  [142, 68, 173],
  [241, 196, 15],
  50,
);
console.log("\n");

meditationLogger.success("Seven Sorrows and Seven Joys completed - Deo Gratias!");
console.log("\n");
