#!/usr/bin/env -S deno run --allow-env

/**
 * Litany of St. Joseph - Animated Catholic Prayer
 *
 * A GenesisTrace demonstration of the traditional Litany of St. Joseph
 * with animated progress bars, spinners, and responsive logging.
 * This litany was approved by Pope Pius X in 1909.
 *
 * Features:
 *   - Full animated litany with call-and-response pattern
 *   - Progress visualization through the prayer
 *   - Colorized liturgical responses
 *   - Animated transitions between sections
 *   - Traditional Latin alongside English
 *
 * Run with:
 *    deno run --allow-env examples/faith/litany-st-joseph.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
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
// 1. LITANY BANNER
// =============================================================================

BannerRenderer.render({
  title: "LITANIAE SANCTI IOSEPH",
  subtitle: "Litany of St. Joseph",
  description: "Approved by Pope St. Pius X - August 18, 1909",
  version: "forma-traditionalis",
  author: "GenesisTrace Catholic Prayers",
  width: 98,
  color: ColorSystem.hexToRgb("#8B4513"),
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION
// =============================================================================

ConsoleStyler.logSection("Preparation for the Litany", "brightCyan", "double");

BoxRenderer.render(
  [
    "The Litany of St. Joseph is a formal prayer of the Catholic Church,",
    "consisting of invocations to St. Joseph followed by the response",
    '"pray for us" (ora pro nobis).',
    "",
    "This litany was composed to honor the many titles and virtues",
    "of St. Joseph, the foster father of Jesus Christ",
    "and spouse of the Blessed Virgin Mary.",
  ],
  {
    style: "double",
    title: "About This Litany",
    padding: 1,
    color: ColorSystem.hexToRgb("#5DADE2"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. OPENING PRAYERS
// =============================================================================

ConsoleStyler.logSection("Opening Prayers", "brightYellow");

const litanyLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const openingSpinner = new Spinner({
  message: "Preparing for prayer...",
  frames: ["+", "x", "+", "x"],
  interval: 150,
});

openingSpinner.start();
await sleep(600);
openingSpinner.update("Making the Sign of the Cross...");
await sleep(500);
openingSpinner.update("In nomine Patris, et Filii, et Spiritus Sancti...");
await sleep(600);
openingSpinner.succeed("Amen.");
console.log("\n");

const kyrie = [
  { invocation: "Lord, have mercy.", latin: "Kyrie, eleison.", response: "Lord, have mercy." },
  { invocation: "Christ, have mercy.", latin: "Christe, eleison.", response: "Christ, have mercy." },
  { invocation: "Lord, have mercy.", latin: "Kyrie, eleison.", response: "Lord, have mercy." },
  { invocation: "Christ, hear us.", latin: "Christe, audi nos.", response: "Christ, graciously hear us." },
];

const kyrieBar = new ProgressBar({
  total: kyrie.length,
  width: 40,
  colorize: true,
  showValue: false,
});

console.log("Kyrie:\n");
for (let i = 0; i < kyrie.length; i++) {
  kyrieBar.update(i + 1);
  const k = kyrie[i];
  console.log(`  V. ${ColorSystem.colorize(k.invocation, ColorSystem.codes.brightWhite)}`);
  console.log(`  R. ${ColorSystem.colorize(k.response, ColorSystem.codes.brightGreen)}`);
  await sleep(350);
}
kyrieBar.complete();
console.log("\n");

// =============================================================================
// 4. INVOCATIONS TO THE TRINITY
// =============================================================================

ConsoleStyler.logSection("Invocations to the Holy Trinity", "brightMagenta");

const trinityInvocations = [
  { invocation: "God the Father of Heaven", latin: "Deus Pater de caelis" },
  { invocation: "God the Son, Redeemer of the world", latin: "Deus Fili, Redemptor mundi" },
  { invocation: "God the Holy Spirit", latin: "Deus Spiritus Sancte" },
  { invocation: "Holy Trinity, One God", latin: "Sancta Trinitas, unus Deus" },
];

const trinityBar = new ProgressBar({
  total: trinityInvocations.length,
  width: 44,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < trinityInvocations.length; i++) {
  trinityBar.update(i + 1);
  const t = trinityInvocations[i];
  litanyLogger.info(`V. ${t.invocation}`);
  litanyLogger.success(`R. Have mercy on us. (Miserere nobis)`);
  await sleep(400);
}
trinityBar.complete();
console.log("\n");

// =============================================================================
// 5. INVOCATIONS TO ST. JOSEPH - PART I
// =============================================================================

ConsoleStyler.logSection("Invocations to St. Joseph - Part I", "brightBlue");

const josephInvocationsPart1 = [
  { invocation: "Holy Mary", latin: "Sancta Maria", category: "Our Lady" },
  { invocation: "St. Joseph", latin: "Sancte Ioseph", category: "General" },
  { invocation: "Renowned offspring of David", latin: "Proles David inclyta", category: "Lineage" },
  { invocation: "Light of Patriarchs", latin: "Lumen Patriarcharum", category: "Dignity" },
  { invocation: "Spouse of the Mother of God", latin: "Dei Genitricis sponse", category: "Vocation" },
  { invocation: "Chaste guardian of the Virgin", latin: "Custos pudice Virginis", category: "Vocation" },
  { invocation: "Foster father of the Son of God", latin: "Filii Dei nutricie", category: "Vocation" },
  { invocation: "Diligent protector of Christ", latin: "Christi defensor sedule", category: "Mission" },
];

const part1Bar = new ProgressBar({
  total: josephInvocationsPart1.length,
  width: 50,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < josephInvocationsPart1.length; i++) {
  part1Bar.update(i + 1);
  const inv = josephInvocationsPart1[i];
  console.log(`  V. ${ColorSystem.colorize(inv.invocation, ColorSystem.codes.brightCyan)}`);
  console.log(`     (${ColorSystem.colorize(inv.latin, ColorSystem.codes.dim)})`);
  console.log(`  R. ${ColorSystem.colorize("Pray for us. (Ora pro nobis)", ColorSystem.codes.brightGreen)}\n`);
  await sleep(450);
}
part1Bar.complete();
console.log("\n");

// =============================================================================
// 6. INVOCATIONS TO ST. JOSEPH - PART II (VIRTUES)
// =============================================================================

ConsoleStyler.logSection("Invocations to St. Joseph - Part II (Virtues)", "brightGreen");

const josephVirtues = [
  { invocation: "Head of the Holy Family", latin: "Caput Sacrae Familiae" },
  { invocation: "Joseph most just", latin: "Ioseph iustissime" },
  { invocation: "Joseph most chaste", latin: "Ioseph castissime" },
  { invocation: "Joseph most prudent", latin: "Ioseph prudentissime" },
  { invocation: "Joseph most strong", latin: "Ioseph fortissime" },
  { invocation: "Joseph most obedient", latin: "Ioseph obedientissime" },
  { invocation: "Joseph most faithful", latin: "Ioseph fidelissime" },
];

TableRenderer.render(
  josephVirtues.map((v, i) => ({
    num: i + 1,
    english: v.invocation,
    latin: v.latin,
    response: "Ora pro nobis",
  })),
  [
    { key: "num", label: "#", width: 4 },
    { key: "english", label: "Invocation (English)", width: 28 },
    { key: "latin", label: "Invocation (Latin)", width: 26 },
    {
      key: "response",
      label: "Response",
      width: 18,
      formatter: (val: string) => ColorSystem.colorize(val, ColorSystem.codes.green),
    },
  ],
);
console.log("\n");

// Animated recitation
const virtuesSpinner = new Spinner({
  message: "Reciting the virtues of St. Joseph...",
  frames: ["*", ".", "*", "."],
  interval: 120,
});

virtuesSpinner.start();
for (const v of josephVirtues) {
  virtuesSpinner.update(`${v.invocation}... pray for us`);
  await sleep(500);
}
virtuesSpinner.succeed("Virtues proclaimed");
console.log("\n");

// =============================================================================
// 7. INVOCATIONS TO ST. JOSEPH - PART III (TITLES)
// =============================================================================

ConsoleStyler.logSection("Invocations to St. Joseph - Part III (Titles)", "brightYellow");

const josephTitles = [
  { invocation: "Mirror of patience", latin: "Speculum patientiae" },
  { invocation: "Lover of poverty", latin: "Amator paupertatis" },
  { invocation: "Model of artisans", latin: "Exemplar opificum" },
  { invocation: "Glory of home life", latin: "Domesticae vitae decus" },
  { invocation: "Guardian of virgins", latin: "Virginum custos" },
  { invocation: "Pillar of families", latin: "Familiarum columen" },
  { invocation: "Solace of the wretched", latin: "Solamen miserorum" },
  { invocation: "Hope of the sick", latin: "Spes aegrotantium" },
  { invocation: "Patron of the dying", latin: "Patrone morientium" },
  { invocation: "Terror of demons", latin: "Terror daemonum" },
  { invocation: "Protector of Holy Church", latin: "Protector Sanctae Ecclesiae" },
];

const titlesBar = new ProgressBar({
  total: josephTitles.length,
  width: 52,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

console.log("Proclaiming the Titles:\n");
for (let i = 0; i < josephTitles.length; i++) {
  titlesBar.update(i + 1);
  const t = josephTitles[i];
  litanyLogger.info(`${t.invocation} (${t.latin})`);
  litanyLogger.success("Ora pro nobis!");
  await sleep(380);
}
titlesBar.complete();
console.log("\n");

// =============================================================================
// 8. LAMB OF GOD
// =============================================================================

ConsoleStyler.logSection("Agnus Dei", "brightRed");

BoxRenderer.render(
  [
    "V. Lamb of God, who takes away the sins of the world,",
    "R. Spare us, O Lord. (Parce nobis, Domine)",
    "",
    "V. Lamb of God, who takes away the sins of the world,",
    "R. Graciously hear us, O Lord. (Exaudi nos, Domine)",
    "",
    "V. Lamb of God, who takes away the sins of the world,",
    "R. Have mercy on us. (Miserere nobis)",
  ],
  {
    style: "bold",
    title: "Agnus Dei - Lamb of God",
    padding: 1,
    color: ColorSystem.hexToRgb("#E74C3C"),
    maxWidth: 94,
  },
);
console.log("\n");

const agnusFrames = [".", "..", "...", "....", ".....", "......"];
for (let i = 0; i < 12; i++) {
  const frame = agnusFrames[i % agnusFrames.length];
  Deno.stdout.writeSync(encoder.encode(`\r  Meditating on the Lamb of God${frame}   `));
  await sleep(200);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(60) + "\r"));
console.log("\n");

// =============================================================================
// 9. VERSICLE AND RESPONSE
// =============================================================================

ConsoleStyler.logSection("Versicle and Response", "brightCyan");

console.log(`  V. ${ColorSystem.colorize("He made him the lord of His house,", ColorSystem.codes.brightWhite)}`);
await sleep(400);
console.log(`  R. ${ColorSystem.colorize("And prince over all His possessions.", ColorSystem.codes.brightGreen)}`);
await sleep(400);
console.log("");
console.log(`  V. ${ColorSystem.colorize("Constituit eum dominum domus suae,", ColorSystem.codes.dim)}`);
await sleep(400);
console.log(`  R. ${ColorSystem.colorize("Et principem omnis possessionis suae.", ColorSystem.codes.dim)}`);
console.log("\n");

// =============================================================================
// 10. CLOSING PRAYER (OREMUS)
// =============================================================================

ConsoleStyler.logSection("Oremus - Let Us Pray", "brightMagenta");

const closingPrayer = [
  "O God, in Your ineffable providence",
  "You were pleased to choose Blessed Joseph",
  "to be the spouse of Your most holy Mother;",
  "grant, we beseech You,",
  "that we may be worthy to have him for our intercessor in heaven",
  "whom on earth we venerate as our Protector:",
  "You who live and reign forever and ever.",
];

const closingBar = new ProgressBar({
  total: closingPrayer.length,
  width: 46,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

BoxRenderer.render(
  ["Let us pray:"],
  {
    style: "rounded",
    padding: 0,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("");

for (let i = 0; i < closingPrayer.length; i++) {
  closingBar.update(i + 1);
  litanyLogger.info(closingPrayer[i]);
  await sleep(420);
}
closingBar.complete();
console.log("\n");

litanyLogger.success("R. Amen.");
console.log("\n");

// =============================================================================
// 11. SUMMARY OF INVOCATIONS
// =============================================================================

ConsoleStyler.logSection("Summary of Litany Invocations", "brightWhite");

const invocationCategories = [
  { category: "Trinity Invocations", count: 4, response: "Miserere nobis" },
  { category: "Lineage & Dignity", count: 4, response: "Ora pro nobis" },
  { category: "Vocation & Mission", count: 4, response: "Ora pro nobis" },
  { category: "Virtues", count: 7, response: "Ora pro nobis" },
  { category: "Titles & Patronages", count: 11, response: "Ora pro nobis" },
  { category: "Agnus Dei", count: 3, response: "Various" },
];

TableRenderer.render(
  invocationCategories,
  [
    { key: "category", label: "Category", width: 24 },
    { key: "count", label: "Invocations", width: 14 },
    {
      key: "response",
      label: "Response",
      width: 20,
      formatter: (val: string) =>
        val === "Ora pro nobis"
          ? ColorSystem.colorize(val, ColorSystem.codes.green)
          : ColorSystem.colorize(val, ColorSystem.codes.yellow),
    },
  ],
  { showIndex: true },
);
console.log("\n");

const totalInvocations = invocationCategories.reduce((sum, c) => sum + c.count, 0);
litanyLogger.info(`Total invocations in the Litany: ${totalInvocations}`);
console.log("\n");

// =============================================================================
// 12. INDULGENCE NOTE
// =============================================================================

ConsoleStyler.logSection("Indulgence", "brightYellow");

BoxRenderer.render(
  [
    "A partial indulgence is granted to the faithful",
    "who devoutly recite the Litany of St. Joseph.",
    "",
    "Conditions for gaining the indulgence:",
    "  - Be in the state of grace",
    "  - Have the intention to gain the indulgence",
    "  - Recite the prayers devoutly",
    "",
    "Source: Enchiridion Indulgentiarum",
  ],
  {
    style: "rounded",
    title: "Partial Indulgence",
    padding: 1,
    color: ColorSystem.hexToRgb("#F1C40F"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 13. FINAL BLESSING
// =============================================================================

ConsoleStyler.logSection("Conclusion", "brightGreen");

const finalSpinner = new Spinner({
  message: "Concluding the Litany...",
  frames: ["+", "x", "+", "x"],
  interval: 150,
});

finalSpinner.start();
await sleep(500);
finalSpinner.update("Making the Sign of the Cross...");
await sleep(500);
finalSpinner.succeed("In nomine Patris, et Filii, et Spiritus Sancti. Amen.");
console.log("\n");

BoxRenderer.render(
  [
    "V. May the divine assistance remain always with us.",
    "R. Amen.",
    "",
    "V. And may the souls of the faithful departed,",
    "   through the mercy of God, rest in peace.",
    "R. Amen.",
  ],
  {
    style: "double",
    title: "Final Versicles",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Sancte Ioseph, Patrone Ecclesiae Universalis, ora pro nobis!",
  [139, 69, 19],
  [255, 215, 0],
  65,
);
console.log("\n");

litanyLogger.success("Litany of St. Joseph completed - Deo Gratias!");
console.log("\n");
