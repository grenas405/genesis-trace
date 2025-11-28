#!/usr/bin/env -S deno run --allow-env

/**
 * St. Joseph Devotional - Animated Catholic Prayer Demo
 *
 * A GenesisTrace demonstration featuring devotions to St. Joseph,
 * Patron of the Universal Church, featuring his titles, virtues,
 * and traditional Catholic prayers.
 *
 * Features:
 *   - Animated prayer sequences with progress visualization
 *   - Tables of St. Joseph's titles and patronages
 *   - Boxes with traditional prayers and devotions
 *   - Spinner animations for meditation sequences
 *   - Gradient text for liturgical emphasis
 *
 * Run with:
 *    deno run --allow-env examples/faith/st-joseph-devotional.ts
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
// 1. ST. JOSEPH DEVOTIONAL BANNER
// =============================================================================

BannerRenderer.render({
  title: "SANCTE IOSEPH",
  subtitle: "Patron of the Universal Church",
  description: "A Devotional Journey Through the Life of the Foster Father of Christ",
  version: "anno-domini-mmxxv",
  author: "GenesisTrace Catholic Devotions",
  width: 98,
  color: ColorSystem.hexToRgb("#8B4513"), // Saddlebrown - carpenter's wood
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION TO ST. JOSEPH
// =============================================================================

ConsoleStyler.logSection("Vita Sancti Ioseph", "brightYellow", "double");

BoxRenderer.render(
  [
    "St. Joseph, the spouse of the Blessed Virgin Mary",
    "and foster father of Our Lord Jesus Christ,",
    "is venerated as the Patron of the Universal Church.",
    "",
    "A just man (vir iustus), a humble carpenter,",
    "chosen by God for the greatest mission in salvation history:",
    "to protect and provide for the Holy Family.",
    "",
    '"When Joseph woke from sleep, he did as the angel',
    'of the Lord commanded him." - Matthew 1:24',
  ],
  {
    style: "double",
    title: "The Just Man",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. ANIMATED MEDITATION SEQUENCE
// =============================================================================

ConsoleStyler.logSection("Meditation on St. Joseph's Virtues", "brightCyan");

const meditationLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const meditationSpinner = new Spinner({
  message: "Entering into prayerful meditation...",
  frames: [".", "..", "...", "....", "...."],
  interval: 200,
});

meditationSpinner.start();
await sleep(800);
meditationSpinner.update("Contemplating the silence of St. Joseph...");
await sleep(700);
meditationSpinner.update("Reflecting on his obedience to God's will...");
await sleep(700);
meditationSpinner.update("Meditating on his fatherly love for Jesus...");
await sleep(700);
meditationSpinner.succeed("Heart prepared for devotion");
console.log("\n");

// =============================================================================
// 4. THE SEVEN TITLES OF ST. JOSEPH
// =============================================================================

ConsoleStyler.logSection("Septem Tituli Sancti Ioseph", "brightMagenta");

const titles = [
  {
    title: "Spouse of the Mother of God",
    latin: "Sponse Matris Dei",
    significance: "United to Mary in virginal marriage",
  },
  {
    title: "Foster Father of the Son of God",
    latin: "Pater Putative Filii Dei",
    significance: "Guardian of the Incarnate Word",
  },
  {
    title: "Guardian of the Holy Family",
    latin: "Custos Sacrae Familiae",
    significance: "Protector of Jesus and Mary",
  },
  {
    title: "Patron of the Universal Church",
    latin: "Patrone Ecclesiae Universalis",
    significance: "Declared by Pope Pius IX (1870)",
  },
  {
    title: "Patron of Workers",
    latin: "Patrone Opificum",
    significance: "Model of honest labor and dignity",
  },
  {
    title: "Terror of Demons",
    latin: "Terror Daemonum",
    significance: "Mighty intercessor against evil",
  },
  {
    title: "Patron of a Happy Death",
    latin: "Patrone Morientium",
    significance: "Died in the arms of Jesus and Mary",
  },
];

const titlesBar = new ProgressBar({
  total: titles.length,
  width: 48,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Proclaiming the Titles of St. Joseph:\n");

for (let i = 0; i < titles.length; i++) {
  titlesBar.update(i + 1);
  meditationLogger.info(`${titles[i].title}`, { latin: titles[i].latin });
  await sleep(350);
}
titlesBar.complete();
console.log("\n");

TableRenderer.render(
  titles,
  [
    { key: "title", label: "Title", width: 32 },
    { key: "latin", label: "Latin", width: 28 },
    { key: "significance", label: "Significance", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. ST. JOSEPH'S VIRTUES
// =============================================================================

ConsoleStyler.logSection("Virtutes Sancti Ioseph", "brightGreen");

const virtues = [
  { virtue: "Obedience", latin: "Oboedientia", example: "Obeyed the angel's commands without question" },
  { virtue: "Faith", latin: "Fides", example: "Believed in the mystery of the Incarnation" },
  { virtue: "Humility", latin: "Humilitas", example: "Embraced his hidden role in God's plan" },
  { virtue: "Chastity", latin: "Castitas", example: "Lived in virginal union with Mary" },
  { virtue: "Prudence", latin: "Prudentia", example: "Fled to Egypt to protect the Holy Family" },
  { virtue: "Justice", latin: "Iustitia", example: "Called 'a just man' in Scripture" },
  { virtue: "Silence", latin: "Silentium", example: "No words recorded in the Gospels" },
  { virtue: "Fortitude", latin: "Fortitudo", example: "Endured hardships without complaint" },
];

TableRenderer.render(
  virtues,
  [
    { key: "virtue", label: "Virtue", width: 14 },
    { key: "latin", label: "Latin", width: 14 },
    { key: "example", label: "Example from Scripture", width: 42 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 6. ANIMATED PRAYER SEQUENCE - MEMORARE TO ST. JOSEPH
// =============================================================================

ConsoleStyler.logSection("Memorare to St. Joseph", "brightBlue");

BoxRenderer.render(
  [
    "The Memorare to St. Joseph is a traditional prayer",
    "modeled after the famous Memorare to Our Lady,",
    "invoking the powerful intercession of St. Joseph.",
  ],
  {
    style: "rounded",
    title: "Traditional Catholic Prayer",
    padding: 1,
    color: ColorSystem.hexToRgb("#4169E1"),
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

const memorare = [
  "Remember, O most chaste spouse of the Virgin Mary,",
  "that never was it known that anyone who fled to thy protection,",
  "implored thy help, or sought thy intercession was left unaided.",
  "Inspired by this confidence, I fly unto thee, my spiritual father,",
  "and beg thy protection.",
  "O foster father of the Redeemer,",
  "despise not my petitions,",
  "but in thy goodness hear and answer me.",
  "Amen.",
];

const memorareBar = new ProgressBar({
  total: memorare.length,
  width: 50,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < memorare.length; i++) {
  memorareBar.update(i + 1);
  prayerLogger.info(memorare[i]);
  await sleep(400);
}
memorareBar.complete();
console.log("\n");

// =============================================================================
// 7. FEAST DAYS OF ST. JOSEPH
// =============================================================================

ConsoleStyler.logSection("Festa Sancti Ioseph", "brightYellow");

const feasts = [
  {
    feast: "Solemnity of St. Joseph",
    date: "March 19",
    rank: "Solemnity",
    description: "Principal feast day of St. Joseph",
  },
  {
    feast: "St. Joseph the Worker",
    date: "May 1",
    rank: "Optional Memorial",
    description: "Patron of workers, instituted by Pius XII",
  },
  {
    feast: "Holy Family",
    date: "Sunday after Christmas",
    rank: "Feast",
    description: "Celebrates Jesus, Mary, and Joseph",
  },
  {
    feast: "Month of St. Joseph",
    date: "March",
    rank: "Devotional",
    description: "Entire month dedicated to St. Joseph",
  },
  {
    feast: "Wednesday",
    date: "Weekly",
    rank: "Traditional",
    description: "Day traditionally dedicated to St. Joseph",
  },
];

TableRenderer.render(
  feasts,
  [
    { key: "feast", label: "Feast", width: 24 },
    { key: "date", label: "Date", width: 20 },
    { key: "rank", label: "Liturgical Rank", width: 18 },
    {
      key: "description",
      label: "Description",
      width: 24,
    },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 8. PATRONAGES OF ST. JOSEPH
// =============================================================================

ConsoleStyler.logSection("Patrocinia Sancti Ioseph", "brightWhite");

const patronages = [
  { label: "Universal Church", value: 10 },
  { label: "Workers & Craftsmen", value: 9 },
  { label: "Fathers", value: 9 },
  { label: "Families", value: 9 },
  { label: "Dying Persons", value: 8 },
  { label: "Unborn Children", value: 8 },
  { label: "Immigrants", value: 7 },
  { label: "House Sellers", value: 6 },
  { label: "Carpenters", value: 8 },
  { label: "Engineers", value: 6 },
];

ChartRenderer.barChart(
  patronages,
  {
    showValues: true,
    width: 45,
    color: ColorSystem.hexToRgb("#8B4513"),
  },
);
console.log("\n");

// =============================================================================
// 9. ANIMATED ROSARY MEDITATION
// =============================================================================

ConsoleStyler.logSection("Rosary of St. Joseph", "brightRed");

BoxRenderer.render(
  [
    "The Rosary of St. Joseph consists of meditations",
    "on the joys and sorrows of St. Joseph,",
    "recited in a manner similar to the Holy Rosary.",
  ],
  {
    style: "bold",
    title: "Devotional Practice",
    padding: 1,
    color: ColorSystem.hexToRgb("#CD5C5C"),
    maxWidth: 94,
  },
);
console.log("\n");

const rosaryMysteries = [
  { mystery: "The Betrothal to Mary", meditation: "Joseph's joy in being chosen as Mary's spouse" },
  { mystery: "The Annunciation to Joseph", meditation: "The angel reveals Mary's divine maternity" },
  { mystery: "The Birth of Jesus", meditation: "Joseph witnesses the Nativity in Bethlehem" },
  { mystery: "The Presentation in the Temple", meditation: "Simeon's prophecy of sorrow" },
  { mystery: "The Flight into Egypt", meditation: "Protecting the Holy Family from Herod" },
];

const rosarySpinner = new Spinner({
  message: "Beginning the Rosary of St. Joseph...",
  frames: ["*", "+", "*", "+"],
  interval: 150,
});

rosarySpinner.start();
await sleep(600);
for (const mystery of rosaryMysteries) {
  rosarySpinner.update(`Meditating on: ${mystery.mystery}`);
  await sleep(800);
}
rosarySpinner.succeed("Rosary meditation complete");
console.log("\n");

TableRenderer.render(
  rosaryMysteries,
  [
    { key: "mystery", label: "Mystery", width: 32 },
    { key: "meditation", label: "Meditation", width: 44 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 10. PRAYER TO ST. JOSEPH BY POPE LEO XIII
// =============================================================================

ConsoleStyler.logSection("Prayer to St. Joseph (Leo XIII)", "brightCyan");

const leoXIIIPrayer = [
  "To thee, O blessed Joseph, we have recourse in our affliction,",
  "and having implored the help of thy most holy Spouse,",
  "we now, with hearts filled with confidence,",
  "earnestly beg thee also to take us under thy protection.",
  "",
  "By that charity wherewith thou wert united",
  "to the Immaculate Virgin Mother of God,",
  "and by that fatherly love with which thou didst cherish",
  "the Child Jesus, we beseech thee and we humbly pray",
  "that thou wilt look down with gracious eye",
  "upon that inheritance which Jesus Christ purchased by His blood,",
  "and wilt aid us in our needs by thy power and strength.",
  "",
  "Defend, O most watchful guardian of the Holy Family,",
  "the chosen offspring of Jesus Christ.",
  "Keep from us, O most loving Father,",
  "all blight of error and corruption.",
  "Aid us from on high, most valiant defender,",
  "in this conflict with the powers of darkness.",
  "",
  "And even as of old thou didst rescue the Child Jesus",
  "from the peril of death,",
  "so now defend God's Holy Church",
  "from the snares of the enemy and from all adversity.",
  "Shield us ever under thy patronage,",
  "that, following thine example and strengthened by thy help,",
  "we may live a holy life, die a happy death,",
  "and attain to everlasting bliss in Heaven. Amen.",
];

BoxRenderer.render(
  leoXIIIPrayer.slice(0, 12),
  {
    style: "double",
    title: "Quamquam Pluries - Pope Leo XIII (1889)",
    padding: 1,
    color: ColorSystem.hexToRgb("#20B2AA"),
    maxWidth: 94,
  },
);
console.log("\n");

BoxRenderer.render(
  leoXIIIPrayer.slice(12),
  {
    style: "double",
    title: "Continuation",
    padding: 1,
    color: ColorSystem.hexToRgb("#20B2AA"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 11. WAVE ANIMATION - JOSEPH'S SILENCE
// =============================================================================

ConsoleStyler.logSection("The Silence of St. Joseph", "brightMagenta");

BoxRenderer.render(
  [
    "St. Joseph speaks no words recorded in Scripture.",
    "His silence is not absence, but profound presence.",
    "In his silence, he listened. In his listening, he obeyed.",
    "In his obedience, he loved. In his love, he served.",
  ],
  {
    style: "rounded",
    title: "A Meditation",
    padding: 1,
    color: ColorSystem.hexToRgb("#9370DB"),
    maxWidth: 94,
  },
);
console.log("\n");

const silenceFrames = [
  "        .        ",
  "       ...       ",
  "      .....      ",
  "     .......     ",
  "    .........    ",
  "     .......     ",
  "      .....      ",
  "       ...       ",
];

console.log("Contemplating in silence:\n");
for (let i = 0; i < 24; i++) {
  const frame = silenceFrames[i % silenceFrames.length];
  const coloredFrame = ColorSystem.colorize(frame, ColorSystem.codes.dim);
  Deno.stdout.writeSync(encoder.encode(`\r${coloredFrame}`));
  await sleep(200);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(40) + "\r"));
console.log(ColorSystem.colorize("In silence, the heart speaks to God.", ColorSystem.codes.brightWhite));
console.log("\n");

// =============================================================================
// 12. ITE AD IOSEPH - GO TO JOSEPH
// =============================================================================

ConsoleStyler.logSection("Ite ad Ioseph", "brightYellow");

const iteAdIoseph = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

BoxRenderer.render(
  [
    '"Go to Joseph" (Genesis 41:55)',
    "",
    "As Pharaoh directed all Egypt to Joseph son of Jacob",
    "for bread during the famine, so the Church directs",
    "all her children to St. Joseph in their needs.",
    "",
    "Ite ad Ioseph, et quidquid vobis dixerit, facite.",
    "Go to Joseph, and do whatever he tells you.",
  ],
  {
    style: "double",
    title: "Biblical Foundation",
    padding: 1,
    color: ColorSystem.hexToRgb("#FFD700"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 13. CONCLUDING INVOCATION
// =============================================================================

ConsoleStyler.logSection("Concluding Invocation", "brightGreen");

const concludingPrayers = [
  "St. Joseph, Patron of the Universal Church, pray for us!",
  "St. Joseph, Protector of Families, pray for us!",
  "St. Joseph, Model of Workers, pray for us!",
  "St. Joseph, Terror of Demons, pray for us!",
  "St. Joseph, Hope of the Sick, pray for us!",
  "St. Joseph, Patron of the Dying, pray for us!",
];

const concludingBar = new ProgressBar({
  total: concludingPrayers.length,
  width: 48,
  colorize: true,
  showValue: false,
});

for (let i = 0; i < concludingPrayers.length; i++) {
  concludingBar.update(i + 1);
  iteAdIoseph.success(concludingPrayers[i]);
  await sleep(400);
}
concludingBar.complete();
console.log("\n");

// =============================================================================
// 14. FINAL BLESSING
// =============================================================================

BoxRenderer.render(
  [
    "V. Pray for us, O holy St. Joseph,",
    "R. That we may be made worthy of the promises of Christ.",
    "",
    "Let us pray:",
    "O God, who in Thy ineffable providence didst vouchsafe",
    "to choose Blessed Joseph to be the spouse of Thy most holy Mother,",
    "grant, we beseech Thee, that we may deserve to have him",
    "for our intercessor in heaven whom on earth we venerate",
    "as our protector. Who livest and reignest forever and ever.",
    "Amen.",
  ],
  {
    style: "double",
    title: "Oremus - Let Us Pray",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B4513"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Sancte Ioseph, ora pro nobis!",
  [139, 69, 19],
  [255, 215, 0],
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

finalLogger.success("St. Joseph Devotional completed - Deo Gratias!");
console.log("\n");
