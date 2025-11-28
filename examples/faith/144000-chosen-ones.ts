#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * The 144,000 Chosen Ones - A Catholic Animation
 *
 * An animated meditation on the 144,000 sealed servants of God from the
 * Book of Revelation, exploring themes of suffering, redemption, separation,
 * and unity in Christ. Each chosen one recognizes their calling through
 * suffering, yet finds hope in eternal life through repentance and faith.
 *
 * "Then I looked, and behold, on Mount Zion stood the Lamb, and with him
 * 144,000 who had his name and his Father's name written on their foreheads."
 * - Revelation 14:1
 *
 * Run with:
 *   deno run --allow-env --allow-read --allow-write examples/faith/144000-chosen-ones.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Formatter,
  Logger,
  ProgressBar,
  Spinner,
  TableRenderer,
  neonTheme,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

interface ChosenSoul {
  tribe: string;
  suffering: string;
  recognition: string;
  sealed: number;
}

interface GraceWave {
  mystery: string;
  scripture: string;
  redemption: string;
  souls: number[];
}

interface UnityMoment {
  moment: string;
  separated: string;
  unified: string;
  status: string;
}

const chosenTribes: ChosenSoul[] = [
  {
    tribe: "Judah - Lion of Faith",
    suffering: "Persecution for righteousness",
    recognition: "Through tears, saw the Cross",
    sealed: 12000,
  },
  {
    tribe: "Reuben - First in Repentance",
    suffering: "Weight of generational sin",
    recognition: "In brokenness, found mercy",
    sealed: 12000,
  },
  {
    tribe: "Gad - Warriors of Grace",
    suffering: "Spiritual warfare & darkness",
    recognition: "In battle, knew His strength",
    sealed: 12000,
  },
  {
    tribe: "Asher - Blessed in Poverty",
    suffering: "Material loss, spiritual hunger",
    recognition: "In emptiness, found fullness",
    sealed: 12000,
  },
  {
    tribe: "Naphtali - Set Free",
    suffering: "Bondage to sin & addiction",
    recognition: "In chains, heard His call",
    sealed: 12000,
  },
  {
    tribe: "Manasseh - Forgotten Ones",
    suffering: "Abandonment & isolation",
    recognition: "In solitude, met the Father",
    sealed: 12000,
  },
  {
    tribe: "Simeon - Hearing in Silence",
    suffering: "Unanswered prayers, doubt",
    recognition: "In silence, heard His voice",
    sealed: 12000,
  },
  {
    tribe: "Levi - Priestly Suffering",
    suffering: "Called to sacrifice all",
    recognition: "In offering, became the gift",
    sealed: 12000,
  },
  {
    tribe: "Issachar - Burden Bearers",
    suffering: "Carrying crosses for others",
    recognition: "In service, found His yoke",
    sealed: 12000,
  },
  {
    tribe: "Zebulun - Dwelling in Hope",
    suffering: "Exile from homeland & family",
    recognition: "In wandering, found home",
    sealed: 12000,
  },
  {
    tribe: "Joseph - Betrayed & Beloved",
    suffering: "Betrayal by loved ones",
    recognition: "In wounds, saw His wounds",
    sealed: 12000,
  },
  {
    tribe: "Benjamin - Youngest & Loved",
    suffering: "Childlike faith tested",
    recognition: "In surrender, became beloved",
    sealed: 12000,
  },
];

const graceWaves: GraceWave[] = [
  {
    mystery: "Baptismal Waters",
    scripture: "Jn 3:5",
    redemption: "Reborn in water and Spirit",
    souls: [2100, 3200, 5100, 8300, 12000, 18500, 27000, 38000, 52000, 71000, 95000, 144000],
  },
  {
    mystery: "Eucharistic Union",
    scripture: "Jn 6:54",
    redemption: "Body and Blood - One with Christ",
    souls: [1800, 2900, 4500, 7200, 11000, 16500, 24000, 34000, 48000, 66000, 89000, 144000],
  },
  {
    mystery: "Reconciliation's Mercy",
    scripture: "Jn 20:23",
    redemption: "Sins forgiven through confession",
    souls: [1500, 2400, 3900, 6100, 9500, 14500, 21000, 31000, 45000, 63000, 87000, 144000],
  },
  {
    mystery: "Sacred Heart Devotion",
    scripture: "Mt 11:28",
    redemption: "Rest for weary souls in His Heart",
    souls: [2000, 3100, 4800, 7500, 11500, 17000, 25000, 36000, 50000, 69000, 92000, 144000],
  },
];

const unityMoments: UnityMoment[] = [
  {
    moment: "The Recognition",
    separated: "Scattered across continents, unknown",
    unified: "Each soul awakens to their calling",
    status: "Sealing",
  },
  {
    moment: "The Suffering",
    separated: "Isolated in personal crucifixion",
    unified: "United in Christ's Passion",
    status: "Purifying",
  },
  {
    moment: "The Repentance",
    separated: "Individual confession & conversion",
    unified: "One Body in reconciliation",
    status: "Transforming",
  },
  {
    moment: "The Communion",
    separated: "Different tongues & cultures",
    unified: "One Bread, One Body, One Lord",
    status: "Sanctifying",
  },
  {
    moment: "The Mission",
    separated: "Sent to distant corners",
    unified: "One Gospel, One Church, One Faith",
    status: "Active",
  },
  {
    moment: "The Eternal Life",
    separated: "Pilgrims on different paths",
    unified: "Gathered at the Throne of the Lamb",
    status: "Promised",
  },
];

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .build(),
);

console.clear();
console.log("\n");

// =============================================================================
// 1. OPENING VISION
// =============================================================================

BannerRenderer.render({
  title: "✠ THE 144,000 CHOSEN ONES ✠",
  subtitle: "Sealed Servants of the Living God",
  description: "A Journey of Suffering, Recognition, Repentance & Eternal Life in Christ",
  version: "Revelation 7:4-8 • 14:1-5",
  author: "Catholic Meditation on the Remnant Church",
  width: 98,
  color: ColorSystem.hexToRgb("#8B0000"),
});
console.log("\n");

ConsoleStyler.logSection("The Prophetic Vision", "brightYellow", "double");

BoxRenderer.render(
  [
    '"After this I saw four angels standing at the four corners of the earth,',
    'holding back the four winds... Then I saw another angel ascending from',
    'the rising of the sun, with the seal of the living God, and he called',
    'with a loud voice to the four angels... saying,',
    '',
    '\\"Do not harm the earth or the sea or the trees, until we have sealed',
    'the servants of our God on their foreheads.\\"',
    '',
    'And I heard the number of the sealed, 144,000, sealed from every',
    'tribe of the sons of Israel." - Revelation 7:2-4',
    '',
    "You are among the chosen. Though scattered, though suffering,",
    "though unknown to one another - each of you has been marked,",
    "sealed with the sign of the living God.",
  ],
  {
    style: "double",
    title: "The Calling",
    padding: 1,
    color: ColorSystem.hexToRgb("#F39C12"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 2. THE TWELVE TRIBES - EACH SEALED THROUGH SUFFERING
// =============================================================================

ConsoleStyler.logSection("The Twelve Tribes of the Chosen", "brightCyan");

logger.info("Revealing the sealed servants from each tribe...");
console.log("\n");

TableRenderer.render(
  chosenTribes.map((soul) => ({
    tribe: soul.tribe,
    suffering: soul.suffering,
    recognition: soul.recognition,
    sealed: Formatter.number(soul.sealed),
  })),
  [
    { key: "tribe", label: "Tribe & Calling", width: 24 },
    { key: "suffering", label: "Path of Suffering", width: 28 },
    { key: "recognition", label: "Moment of Recognition", width: 26 },
    { key: "sealed", label: "Sealed", width: 10, align: "center" },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "THEY ARE SEPARATED YET UNITED",
    "",
    "• Each chosen one suffers in isolation, unknown to the others",
    "• Each carries their unique cross, tailored by Divine Providence",
    "• Each awakens alone - yet not alone, for Christ walks with them",
    "• Though continents divide them, the same seal marks their foreheads",
    "• Though languages differ, the same Spirit speaks in their hearts",
    "",
    "In suffering, they recognize they are chosen.",
    "In recognition, they find the strength to repent.",
    "In repentance, they receive eternal life.",
    "",
    '"For many are called, but few are chosen." - Matthew 22:14',
  ],
  {
    style: "bold",
    title: "The Paradox of Separation & Unity",
    padding: 1,
    color: ColorSystem.hexToRgb("#E74C3C"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. THE RECOGNITION - WAVE BY WAVE
// =============================================================================

ConsoleStyler.logSection("The Great Recognition", "brightMagenta", "double");

const recognitionSpinner = new Spinner({
  message: "One by one, souls awaken to their calling...",
  frames: ["✙", "✚", "✛", "✜", "✝", "✞", "✟", "✠"],
  interval: 150,
});

recognitionSpinner.start();
await sleep(800);
recognitionSpinner.update("Across nations, they open their eyes...");
await sleep(700);
recognitionSpinner.update("In suffering, they see the mark on their souls...");
await sleep(700);
recognitionSpinner.update("They know: 'I am one of the chosen ones'...");
await sleep(700);
recognitionSpinner.succeed("144,000 souls recognize their divine seal");
console.log("\n");

BoxRenderer.render(
  [
    "HOW DOES A CHOSEN ONE RECOGNIZE THEMSELVES?",
    "",
    "1. Through TREMENDOUS SUFFERING that no earthly comfort can ease",
    "   → Only the Cross of Christ gives meaning to the pain",
    "",
    "2. Through ISOLATION & SEPARATION from the world",
    "   → Even among crowds, a profound sense of being set apart",
    "",
    "3. Through an UNQUENCHABLE HUNGER for truth and holiness",
    "   → The world's pleasures leave them empty; only God satisfies",
    "",
    "4. Through SUPERNATURAL LOVE even for enemies",
    "   → A mercy that can only flow from Christ's own Heart",
    "",
    "5. Through the SEAL on their foreheads (invisible yet real)",
    "   → Angels see it. Demons flee from it. The soul senses it.",
    "",
    '"You did not choose me, but I chose you." - John 15:16',
  ],
  {
    style: "rounded",
    title: "Signs of the Chosen",
    padding: 1,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 4. THE WAVES OF GRACE - SACRAMENTAL SEALING
// =============================================================================

ConsoleStyler.logSection("Waves of Sanctifying Grace", "brightGreen");

console.log("Through the sacraments, souls are progressively sealed:\n");

for (const wave of graceWaves) {
  const sparkline = ChartRenderer.sparkline(wave.souls);
  const final = wave.souls[wave.souls.length - 1];

  console.log(
    `${ColorSystem.colorize(wave.mystery.padEnd(24), ColorSystem.codes.brightGreen)} ${sparkline}  ${
      ColorSystem.colorize(`→ ${Formatter.number(final)}`, ColorSystem.codes.brightWhite)
    }`,
  );
  console.log(
    `  ${ColorSystem.colorize(wave.scripture, ColorSystem.codes.cyan)} • ${
      ColorSystem.colorize(wave.redemption, ColorSystem.codes.dim)
    }`,
  );
  console.log("");
}

BoxRenderer.render(
  [
    "THE CATHOLIC PATH TO SEALING",
    "",
    "It is through the SACRAMENTS that the chosen are marked:",
    "",
    "• BAPTISM washes away original sin, births them into God's family",
    "• EUCHARIST unites them to Christ's Body and Blood",
    "• RECONCILIATION heals the wounds of personal sin through mercy",
    "• CONFIRMATION strengthens them with the seal of the Holy Spirit",
    "",
    "These are not mere symbols - they are efficacious signs of grace.",
    "Through them, Christ Himself acts, transforming suffering into",
    "sanctification, separation into communion, death into eternal life.",
    "",
    '"Unless you eat the flesh of the Son of Man and drink his blood,',
    'you have no life in you." - John 6:53',
  ],
  {
    style: "double",
    title: "Sacramental Sealing",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 5. SUFFERING & REDEMPTION
// =============================================================================

ConsoleStyler.logSection("The Path of Suffering", "brightRed");

const sufferingLogger = logger.child("passion");

BoxRenderer.render(
  [
    "WHY MUST THE CHOSEN ONES SUFFER?",
    "",
    "The chosen have suffered TREMENDOUSLY - each in their own way.",
    "Some have lost everything. Some have been betrayed. Some have",
    "walked through valleys of darkness where even hope seemed lost.",
    "",
    "But this suffering is not meaningless:",
    "",
    "• It PURIFIES the soul, burning away attachment to the world",
    "• It CONFORMS us to Christ crucified",
    "• It makes us CREDIBLE WITNESSES to redemptive love",
    "• It OPENS OUR EYES to see what others cannot see",
    "• It SEALS us with the mark that angels recognize",
    "",
    '"For as we share abundantly in Christ\'s sufferings,',
    'so through Christ we share abundantly in comfort too."',
    "- 2 Corinthians 1:5",
    "",
    "You have suffered. But through Christ, you can REPENT.",
    "And through repentance, you will have ETERNAL LIFE.",
  ],
  {
    style: "bold",
    title: "The Mystery of Redemptive Suffering",
    padding: 1,
    color: ColorSystem.hexToRgb("#C0392B"),
    maxWidth: 94,
  },
);
console.log("\n");

// Progress through stages of suffering
const sufferingStages = [
  { stage: "Darkness", message: "Walking through the valley of tears..." },
  { stage: "Abandonment", message: "Feeling forsaken even by God..." },
  { stage: "Crucifixion", message: "Nailed to the cross with Christ..." },
  { stage: "Death to Self", message: "Dying to sin and worldly attachment..." },
  { stage: "Burial", message: "Hidden in the tomb, seemingly forgotten..." },
  { stage: "Resurrection", message: "Rising with Christ in newness of life..." },
  { stage: "Glorification", message: "Transformed, sealed, sent forth..." },
];

const sufferingBar = new ProgressBar({
  total: sufferingStages.length,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("The Journey Through Suffering to Glory:\n");

for (let i = 0; i < sufferingStages.length; i++) {
  sufferingBar.update(i + 1);
  sufferingLogger.info(sufferingStages[i].stage, {
    phase: sufferingStages[i].message,
  });
  await sleep(400);
}
sufferingBar.complete();
console.log("\n");

sufferingLogger.success("From suffering to glory - the chosen are sealed");
console.log("\n");

// =============================================================================
// 6. REPENTANCE - THE TURNING POINT
// =============================================================================

ConsoleStyler.logSection("The Call to Repentance", "brightYellow", "double");

const repentanceSpinner = new Spinner({
  message: "The chosen ones turn from sin to face the Father...",
  frames: ["←", "↖", "↑", "↗", "→", "↘", "↓", "↙"],
  interval: 120,
});

repentanceSpinner.start();
await sleep(1000);
repentanceSpinner.update("In the confessional, chains break...");
await sleep(900);
repentanceSpinner.update("Tears of contrition wash the soul...");
await sleep(900);
repentanceSpinner.succeed("144,000 hearts turn back to God");
console.log("\n");

BoxRenderer.render(
  [
    "THROUGH CHRIST, WE CAN REPENT",
    "",
    "Recognition is not enough. Suffering is not enough.",
    "The chosen must REPENT - turn away from sin and toward God.",
    "",
    "This is the Catholic gift:",
    "",
    "• Not merely feeling sorry, but SACRAMENTAL CONFESSION",
    "• Not self-improvement, but DIVINE TRANSFORMATION",
    "• Not earning forgiveness, but RECEIVING MERCY",
    "",
    "In the Sacrament of Reconciliation, Christ Himself absolves:",
    '"I absolve you from your sins, in the name of the Father,',
    'and of the Son, and of the Holy Spirit."',
    "",
    "The chosen ones have walked through darkness.",
    "The chosen ones have suffered tremendously.",
    "But through Christ, they REPENT.",
    "And through repentance, they receive ETERNAL LIFE.",
    "",
    '"Repent and believe in the Gospel." - Mark 1:15',
  ],
  {
    style: "double",
    title: "Metanoia - The Great Turning",
    padding: 1,
    color: ColorSystem.hexToRgb("#F39C12"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 7. UNITY IN SEPARATION
// =============================================================================

ConsoleStyler.logSection("Separated Yet United", "brightBlue");

TableRenderer.render(
  unityMoments,
  [
    { key: "moment", label: "Moment", width: 20 },
    { key: "separated", label: "Though Separated", width: 30 },
    { key: "unified", label: "Yet Unified", width: 32 },
    { key: "status", label: "Status", width: 14, align: "center" },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "THE MYSTERY OF CATHOLIC UNITY",
    "",
    "Though the 144,000 are scattered across the earth -",
    "separated by oceans, languages, cultures, and centuries -",
    "they are ONE BODY in Christ Jesus.",
    "",
    "• ONE LORD - Jesus Christ, King of Kings",
    "• ONE FAITH - The Catholic faith handed down from the Apostles",
    "• ONE BAPTISM - Incorporation into Christ's Mystical Body",
    "• ONE BREAD - The Eucharist that makes us one",
    "• ONE CHURCH - The Catholic Church, pillar of truth",
    "",
    "A chosen one in Africa shares the SAME MASS as one in Asia.",
    "A chosen one in 2025 receives the SAME SACRAMENTS as one in 325.",
    "A chosen one speaking Spanish prays the SAME CREED as one in Latin.",
    "",
    "This is the Catholic genius: unity in diversity,",
    "communion across time and space,",
    "one family gathered at the Father's table.",
  ],
  {
    style: "rounded",
    title: "One Body, Many Members",
    padding: 1,
    color: ColorSystem.hexToRgb("#3498DB"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 8. ETERNAL LIFE - THE PROMISE
// =============================================================================

ConsoleStyler.logSection("The Promise of Eternal Life", "brightGreen");

BoxRenderer.render(
  [
    "FOREVER HAVE ETERNAL LIFE",
    "",
    "This is the promise to the chosen ones:",
    "",
    "Not merely a long life, but ETERNAL LIFE -",
    "participation in the very life of the Blessed Trinity.",
    "",
    "What awaits the 144,000:",
    "",
    "• They will see God FACE TO FACE (Beatific Vision)",
    "• They will drink from the RIVER OF LIFE",
    "• They will eat from the TREE OF LIFE in Paradise",
    "• They will reign with Christ FOREVER AND EVER",
    "• They will sing a NEW SONG before the throne",
    "• They will have God's name written on their foreheads",
    "",
    '"These are the ones who follow the Lamb wherever he goes.',
    'They have been redeemed... as firstfruits for God and the Lamb,',
    'and in their mouth no lie was found, for they are blameless."',
    "- Revelation 14:4-5",
    "",
    "The suffering was tremendous.",
    "The path was through darkness.",
    "But the promise is ETERNAL LIFE in the light of God's face.",
  ],
  {
    style: "bold",
    title: "The Eternal Promise",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

// Animated vision of heaven
const heavenFrames = ["✧", "✦", "✧", "✶", "✧", "✦"];
console.log(ColorSystem.colorize("The Heavenly Vision:", ColorSystem.codes.brightWhite));

for (let cycle = 0; cycle < 4; cycle++) {
  for (const frame of heavenFrames) {
    await sleep(100);
    Deno.stdout.writeSync(
      encoder.encode(
        `\r${ColorSystem.colorize(`  ${frame} 144,000 before the Lamb ${frame}`, ColorSystem.codes.brightYellow)}`,
      ),
    );
  }
}
Deno.stdout.writeSync(encoder.encode("\n\n"));

// =============================================================================
// 9. FINAL SEALING & COMMISSIONING
// =============================================================================

ConsoleStyler.logSection("The Sealing Complete", "brightWhite", "double");

const sealingBar = new ProgressBar({
  total: 144000,
  width: 60,
  showPercentage: true,
  showValue: true,
  colorize: true,
});

console.log("Sealing the servants of God:\n");

const increments = [12000, 24000, 36000, 48000, 60000, 72000, 84000, 96000, 108000, 120000, 132000, 144000];

for (const count of increments) {
  sealingBar.update(count);
  logger.debug("Souls sealed", {
    count: Formatter.number(count),
    completion: Formatter.percentage(count / 144000, 1),
  });
  await sleep(300);
}

sealingBar.complete();
logger.success("All 144,000 chosen ones have been sealed");
console.log("\n");

// =============================================================================
// 10. FINAL MESSAGE TO THE CHOSEN
// =============================================================================

ConsoleStyler.logSection("A Message to the Chosen", "brightMagenta", "double");

BoxRenderer.render(
  [
    "IF YOU RECOGNIZE YOURSELF IN THIS MESSAGE:",
    "",
    "You are one of the chosen ones.",
    "",
    "You have suffered TREMENDOUSLY - and you know it.",
    "The suffering set you apart, marked you, sealed you.",
    "",
    "You have felt SEPARATED - from the world, from others,",
    "even at times from God Himself in dark nights of the soul.",
    "",
    "Yet you are NOT ALONE.",
    "",
    "144,000 others carry the same seal on their foreheads.",
    "You are united with them in the Mystical Body of Christ.",
    "You are ONE in the Catholic Church, the Bride of the Lamb.",
    "",
    "Through Christ, you CAN REPENT.",
    "Through repentance, you WILL have eternal life.",
    "",
    "This is your identity: CHOSEN.",
    "This is your path: THE CROSS.",
    "This is your promise: ETERNAL LIFE.",
    "This is your unity: CATHOLIC COMMUNION.",
    "",
    "Go forth, sealed one. Your suffering has prepared you.",
    "Your recognition has awakened you.",
    "Your repentance has freed you.",
    "Your eternal life awaits you.",
  ],
  {
    style: "double",
    title: "You Are Chosen",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "✠ 144,000 Sealed Servants of the Living God ✠",
  [139, 0, 0],
  [255, 215, 0],
  64,
);
console.log("\n");

logger.success("The sealing is complete", {
  sealed: "144,000",
  tribes: 12,
  promise: "Eternal Life in Christ",
});
console.log("\n");

BoxRenderer.render(
  [
    '"Salvation belongs to our God who sits on the throne,',
    'and to the Lamb!" - Revelation 7:10',
    "",
    "The chosen ones cry out with a loud voice:",
    "",
    "WORTHY IS THE LAMB WHO WAS SLAIN,",
    "TO RECEIVE POWER AND WEALTH AND WISDOM",
    "AND MIGHT AND HONOR AND GLORY AND BLESSING!",
    "",
    "Through suffering, recognition, repentance, and faith -",
    "the 144,000 stand before the throne.",
    "",
    "Separated by earth, united in heaven.",
    "Marked by suffering, sealed by grace.",
    "Called to repentance, promised eternal life.",
    "",
    "Ad Maiorem Dei Gloriam",
    "For the Greater Glory of God",
  ],
  {
    style: "bold",
    title: "Doxology",
    padding: 1,
    color: ColorSystem.hexToRgb("#FFD700"),
    maxWidth: 94,
  },
);
console.log("\n");

logger.success("144,000 Chosen Ones animation completed", {
  message: "Through Christ, repent and have eternal life",
  unity: "One Body, One Faith, One Baptism, One Lord",
  seal: "Marked on the forehead with the seal of the living God",
});
console.log("\n");
