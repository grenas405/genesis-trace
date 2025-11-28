#!/usr/bin/env -S deno run --allow-env

/**
 * Vita Sancti Iudae - Life of St. Judas (St. Jude Thaddeus)
 *
 * This GenesisTrace demonstration narrates the life, mission, and devotion
 * to St. Judas Thaddeus, apostle of persevering hope. It blends storytelling
 * with structured data to showcase banners, boxes, tables, progress bars,
 * charts, spinners, and logging—illustrating how the library can be used to
 * present rich historical or devotional narratives.
 *
 * Run with:
 *    deno run --allow-env examples/faith/st-judas-life.ts
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

console.clear();
console.log("\n");

// ============================================================================
// 1. BANNER
// ============================================================================

BannerRenderer.render({
  title: "SANCTUS IUDA THADDAEUS",
  subtitle: "Apostle of Persevering Hope",
  description: "A visual chronicle of the life and mission of St. Judas (St. Jude)",
  version: "apostolic-era-1.0",
  author: "GenesisTrace Hagiography Studio",
  width: 96,
  color: ColorSystem.hexToRgb("#4B0082"),
});
console.log("\n");

// ============================================================================
// 2. INTRODUCTORY PORTRAIT
// ============================================================================

ConsoleStyler.logSection("Portrait of the Apostle", "brightMagenta", "double");

BoxRenderer.render(
  [
    "St. Judas—called Jude, Thaddeus, Lebbaeus—was kin to the Lord",
    "through St. Mary of Clopas. Remembered with St. Simon the Zealot,",
    "he served as a steadfast apostle who summoned early Christians",
    "to persevere in fidelity amidst confusion and persecution.",
    "",
    "His symbol is a staff or halberd, recalling missionary journeys",
    "across Judea, Syria, Mesopotamia, and Persia. Devotion to St. Jude",
    "grew from the conviction that no cause is too lost for God's mercy.",
  ],
  {
    style: "double",
    title: "Faithful Witness",
    padding: 1,
    color: ColorSystem.hexToRgb("#7A288A"),
    maxWidth: 92,
  },
);
console.log("\n");

// ============================================================================
// 3. BIOGRAPHICAL TIMELINE
// ============================================================================

ConsoleStyler.logSection("Chronicon Vitae", "brightYellow");

const timeline = [
  {
    period: "c. 1st century",
    location: "Galilee",
    event: "Born in a devout Jewish household; relative of Jesus through Mary of Clopas.",
  },
  {
    period: "AD 30-33",
    location: "Galilee • Jerusalem",
    event: "Called by Christ among the Twelve; receives Pentecost fire in the Upper Room.",
  },
  {
    period: "AD 34-44",
    location: "Judea • Samaria",
    event: "Preaches Resurrection hope alongside the nascent Church amid persecution.",
  },
  {
    period: "AD 45-60",
    location: "Mesopotamia • Armenia",
    event: "Journeys with St. Simon; heals, casts out spirits, and establishes young churches.",
  },
  {
    period: "AD 60-65",
    location: "Jerusalem (trad.)",
    event: "Composes the Epistle of Jude urging believers to contend for the faith.",
  },
  {
    period: "AD 65-70",
    location: "Beirut or Edessa",
    event: "Sealed his witness in martyrdom, bearing a halberd or club in sacred art.",
  },
];

TableRenderer.render(
  timeline,
  [
    { key: "period", label: "Period", width: 16 },
    { key: "location", label: "Geography", width: 22 },
    { key: "event", label: "Historical Highlight", width: 52 },
  ],
  { showIndex: true },
);
console.log("\n");

// ============================================================================
// 4. MISSIONARY EXPEDITION LOG
// ============================================================================

ConsoleStyler.logSection("Itinerarium Apostolicum", "brightCyan");

const missionLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .namespace("apostolic-chronicle")
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const missionaryPhases = [
  {
    region: "Jerusalem",
    emphasis: "Interceded for the confused and wavering faithful after Pentecost.",
    scripture: "John 14:22",
  },
  {
    region: "Syria & Mesopotamia",
    emphasis: "Announced reconciliation and healed households in Edessa traditions.",
    scripture: "Acts 1:13",
  },
  {
    region: "Armenia",
    emphasis: "Traveled with St. Bartholomew; strengthened communities through courage.",
    scripture: "Eph 2:19-20",
  },
  {
    region: "Persia",
    emphasis: "Joined St. Simon against idol worship; endured imprisonments and hunger.",
    scripture: "Jude 1:20-21",
  },
  {
    region: "Martyrdom",
    emphasis: "Witnessed to unwavering hope; tradition names Beirut as the site.",
    scripture: "2 Tim 4:7",
  },
];

const missionBar = new ProgressBar({
  total: missionaryPhases.length,
  width: 50,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

console.log("Tracing the apostolic journeys of St. Judas:\n");

for (let i = 0; i < missionaryPhases.length; i++) {
  const phase = missionaryPhases[i];
  missionBar.update(i + 1);
  missionLogger.info(`Mission in ${phase.region}`, {
    emphasis: phase.emphasis,
    scripture: phase.scripture,
  });
  await sleep(450);
}
missionBar.complete();
console.log("\n");

// ============================================================================
// 5. THE EPISTLE OF JUDE
// ============================================================================

ConsoleStyler.logSection("Epistola Iudae Apostoli", "brightGreen");

BoxRenderer.render(
  [
    '"Beloved, build yourselves up on your most holy faith; pray in the Holy Spirit; keep yourselves',
    'in the love of God; look for the mercy of our Lord Jesus Christ unto eternal life."',
    "",
    "The brief yet potent Epistle of Jude defends orthodox teaching, exposing false shepherds,",
    "recalling the Exodus, and rejoicing in the doxology that God is able to keep us from falling.",
    "It stands as one of the earliest pastoral letters aimed at preserving unity and courage.",
  ],
  {
    style: "bold",
    title: "Epistle Highlights",
    padding: 1,
    color: ColorSystem.hexToRgb("#2E8B57"),
    maxWidth: 92,
  },
);
console.log("\n");

// ============================================================================
// 6. DEVOTIONS AND INTERCESSIONS
// ============================================================================

ConsoleStyler.logSection("Cultus et Patronatus", "brightWhite");

const patronageData = [
  { label: "Impossible Causes", value: 10 },
  { label: "Courage in Trials", value: 8 },
  { label: "Unity of the Church", value: 7 },
  { label: "Families in Distress", value: 7 },
  { label: "Missionaries", value: 6 },
  { label: "Healing & Consolation", value: 8 },
];

ChartRenderer.barChart(
  patronageData,
  {
    showValues: true,
    width: 48,
    color: ColorSystem.hexToRgb("#C71585"),
  },
);
console.log("\n");

// ============================================================================
// 7. NOVENA RHYTHM
// ============================================================================

ConsoleStyler.logSection("Novena Cordis", "brightBlue");

const novenaSpinner = new Spinner({
  message: "Beginning the nine-day devotion to St. Jude...",
  frames: ["✢", "✹", "✣", "✹"],
  interval: 180,
});

const novenaIntentions = [
  "Day 1: Renewed trust in God",
  "Day 2: Strength for persecuted Christians",
  "Day 3: Healing of families",
  "Day 4: Courage in illness",
  "Day 5: Conversion of the lost",
  "Day 6: Release from addictions",
  "Day 7: Unity within the Church",
  "Day 8: Zeal for mission",
  "Day 9: Thanksgiving for answered prayer",
];

novenaSpinner.start();
for (const intention of novenaIntentions) {
  novenaSpinner.update(intention);
  await sleep(420);
}
novenaSpinner.succeed("Novena entrusted to the care of St. Judas");
console.log("\n");

// ============================================================================
// 8. FINAL DOXOLOGY
// ============================================================================

ConsoleStyler.logSection("Doxologia", "brightRed");

BoxRenderer.render(
  [
    "To Him who is able to keep you from falling and to present you without blemish",
    "before the presence of His glory with rejoicing, to the only God, our Savior,",
    "through Jesus Christ our Lord, be glory, majesty, dominion, and authority,",
    "before all time and now and forever. Amen. (Jude 24-25)",
  ],
  {
    style: "single",
    title: "Blessing from the Apostle",
    padding: 1,
    color: ColorSystem.hexToRgb("#B22222"),
    maxWidth: 92,
  },
);
console.log("\n");

await missionLogger.shutdown();
