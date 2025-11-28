#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Vox Silentium - Catholic Prayers for Those Who Suffer in Silence
 *
 * A GenesisTrace devotion that lifts up hidden burdens, animating a pastoral
 * flow of intercession for those who carry grief quietly. The liturgy weaves
 * listening stations, a contemplative spinner vigil, litanies rendered through
 * progress visualization, and a final commissioning to become merciful presence.
 *
 * Run with:
 *    deno run --allow-env --allow-read --allow-write examples/faith/silent-suffering-prayer.ts
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

BannerRenderer.render({
  title: "VOX SILENTIUM",
  subtitle: "Catholic prayers for hidden suffering",
  description: "Intercessory vigil powered by GenesisTrace liturgical tooling",
  version: "silent-oratory-v1",
  author: "GenesisTrace Devotional Studio",
  width: 100,
  color: ColorSystem.hexToRgb("#5E60CE"),
});
console.log("\n");

ConsoleStyler.logSection("Introit — Hearing the Quiet Cry", "brightCyan", "double");

BoxRenderer.render(
  [
    "Many disciples of Christ carry their crosses in silence: caregivers who never",
    "complain, trauma survivors unsure how to speak, workers fearing reprisal,",
    "family members who smile while their hearts tremble. This devotion asks the",
    "Church to bend low, listen deeply, and pray with those hidden wounds.",
    "",
    '"The Lord hears the cry of the afflicted." — Psalm 34:7',
  ],
  {
    style: "double",
    title: "Pastoral Focus",
    padding: 1,
    color: ColorSystem.hexToRgb("#4E9F3D"),
    maxWidth: 96,
  },
);
console.log("\n");

const hushLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(256)
    .build(),
);

ConsoleStyler.logSection("Stations of Hidden Burdens", "brightMagenta");

const silentStations = [
  {
    station: "Hospital corridor at 2 a.m.",
    silentWitness: "Mary, Mother of Sorrows",
    scripture: "John 19:25-27",
    practice: "Hold vigil with a rosary and listen more than you speak.",
  },
  {
    station: "Factory locker room",
    silentWitness: "St. Joseph the Worker",
    scripture: "Matthew 13:55",
    practice: "Affirm the dignity of laborers facing retaliation or injury.",
  },
  {
    station: "School bus seat",
    silentWitness: "Guardian Angels",
    scripture: "Matthew 18:10",
    practice: "Protect children who swallow their anxiety behind brave faces.",
  },
  {
    station: "Parish parking lot",
    silentWitness: "St. Dymphna",
    scripture: "Psalm 147:3",
    practice: "Offer gentle resources for mental health and trauma care.",
  },
  {
    station: "Immigrant shelter",
    silentWitness: "Holy Family in exile",
    scripture: "Matthew 2:13-15",
    practice: "Create safe channels for testimony without fear of reprisal.",
  },
];

TableRenderer.render(
  silentStations,
  [
    { key: "station", label: "Station", width: 28 },
    { key: "silentWitness", label: "Silent Witness", width: 24 },
    { key: "scripture", label: "Scripture", width: 14 },
    { key: "practice", label: "Pastoral Practice", width: 36 },
  ],
  { showIndex: true, maxWidth: 110 },
);
console.log("\n");

ConsoleStyler.logSection("Vigil of Listening Hearts", "brightYellow");

const vigilSpinner = new Spinner({
  message: "Lighting vigil candle for the voiceless...",
  frames: ["·", "∙", "•", "●", "•", "∙"],
  interval: 140,
});

vigilSpinner.start();
await sleep(600);
vigilSpinner.update("Let silence speak louder than our answers...");
await sleep(600);
vigilSpinner.update("Breathing the Kyrie with every heartbeat...");
await sleep(600);
vigilSpinner.update("Consecrating the night to hidden saints...");
await sleep(600);
vigilSpinner.succeed("Hearts attuned • Vigil ready for intercession");
console.log("\n");

ConsoleStyler.logSection("Litany for the Hidden Wounds", "brightGreen", "heavy");

const litanyVerses = [
  {
    invocation: "For the ones who appear composed while storms rage within,",
    response: "Christ, shelter their ache.",
  },
  {
    invocation: "For caregivers whose exhaustion is cloaked in a practiced smile,",
    response: "Christ, pour Sabbath rest.",
  },
  {
    invocation: "For immigrants and refugees who suppress their tears to survive,",
    response: "Christ, defend their dignity.",
  },
  {
    invocation: "For adolescents who mask anxiety behind humor,",
    response: "Christ, be their steady breath.",
  },
  {
    invocation: "For parishioners afraid to name abuse or depression,",
    response: "Christ, give them courageous allies.",
  },
  {
    invocation: "For all who whisper prayers into pillows soaked with fear,",
    response: "Christ, consecrate their silence.",
  },
];

const litanyProgress = new ProgressBar({
  total: litanyVerses.length,
  width: 58,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Procession through each petition:\n");

for (let i = 0; i < litanyVerses.length; i++) {
  litanyProgress.update(i + 1);
  const verse = litanyVerses[i];
  hushLogger.info(verse.invocation, { response: verse.response });
  await sleep(550);
}
litanyProgress.complete();
console.log("\n");

BoxRenderer.render(
  [
    "Prayer for Those Who Suffer in Silence",
    "",
    "Lord Jesus, Word made flesh yet gentle in quiet Nazareth,",
    "walk beside every soul who cannot yet speak their wound.",
    "Teach us to sit on the floor of another's grief without rushing",
    "to tidy it. Let our parishes be rooms where secrets become stories",
    "and stories become sacraments of healing.",
    "",
    "Mother Mary, Mater Dolorosa, cradle every fearful heart.",
    "St. Joseph, protector of the unnoticed, steady their steps.",
    "Holy Spirit, groan within us when language fails.",
    "",
    "May our listening become liberation, our presence become medicine,",
    "and our action become justice. Through Christ our Lord. Amen.",
  ],
  {
    style: "rounded",
    title: "Prayer Text",
    padding: 1,
    color: ColorSystem.hexToRgb("#A663CC"),
    maxWidth: 98,
  },
);
console.log("\n");

ConsoleStyler.logSection("Mercy Commitments", "brightBlue");

const commitments = [
  { label: "Listening Presence", value: 10 },
  { label: "Spiritual Direction", value: 8 },
  { label: "Corporal Works of Mercy", value: 9 },
  { label: "Trauma-Informed Support", value: 7 },
  { label: "Sacramental Preparation", value: 8 },
  { label: "Advocacy & Justice", value: 7 },
];

ChartRenderer.barChart(commitments, {
  showValues: true,
  width: 46,
  color: ColorSystem.hexToRgb("#6930C3"),
});
console.log("\n");

ConsoleStyler.logSection("Sending Forth", "brightWhite");

const sendingSteps = [
  {
    phase: "Contemplate",
    action: "Spend ten minutes each day naming who might need a check-in.",
  },
  {
    phase: "Accompany",
    action: "Offer sacramental resources without forcing disclosure.",
  },
  {
    phase: "Advocate",
    action: "Build parish teams skilled in trauma-informed ministries.",
  },
  {
    phase: "Consolation",
    action: "Return each story to Christ in adoration; pray hope aloud.",
  },
];

const sendingProgress = new ProgressBar({
  total: sendingSteps.length,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Commissioning timeline:\n");
for (let i = 0; i < sendingSteps.length; i++) {
  sendingProgress.update(i + 1);
  hushLogger.success(sendingSteps[i].phase, { action: sendingSteps[i].action });
  await sleep(450);
}
sendingProgress.complete();
console.log("\n");

BoxRenderer.render(
  [
    "Christ has heard the unspoken petitions.",
    "Carry this quiet fire back into schools, shelters, and supper tables.",
    "Let mercy cloak those who once walked alone.",
  ],
  {
    style: "bold",
    title: "Final Benediction",
    padding: 1,
    color: ColorSystem.hexToRgb("#FF6B6B"),
    maxWidth: 92,
  },
);
console.log("\n");
