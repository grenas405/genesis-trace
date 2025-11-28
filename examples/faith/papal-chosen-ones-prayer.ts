#!/usr/bin/env -S deno run --allow-env

/**
 * Prayer for the Chosen Ones - Featuring Papal Wisdom
 *
 * A GenesisTrace devotional featuring powerful quotes from past popes
 * about the chosen ones, election, and God's calling - all rendered in gold
 * to symbolize the divine seal and heavenly glory.
 *
 * Features:
 *   - Quotes from Pope Leo XIII, Pius XII, John Paul II, Benedict XVI
 *   - All gold color scheme (bright gold, goldenrod, dark gold)
 *   - Animated prayer sequences with typewriter effects
 *   - Progress bars and spinners for meditation
 *   - BoxRenderer and TableRenderer for structured content
 *
 * Run with:
 *    deno run --allow-env examples/faith/papal-chosen-ones-prayer.ts
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

// Gold color palette for the chosen ones
const GOLD = ColorSystem.hexToRgb("#FFD700");      // Bright gold
const GOLDENROD = ColorSystem.hexToRgb("#DAA520");  // Deep goldenrod
const DARK_GOLD = ColorSystem.hexToRgb("#B8860B");  // Dark goldenrod
const PALE_GOLD = ColorSystem.hexToRgb("#EEE8AA");  // Pale goldenrod

console.clear();
console.log("\n");

// =============================================================================
// 1. GOLDEN BANNER - PRAYER FOR THE CHOSEN ONES
// =============================================================================

BannerRenderer.render({
  title: "PRAYER FOR THE CHOSEN ONES",
  subtitle: "Wisdom from the Successors of St. Peter",
  description: "Divine Election and the Call to Holiness - Sealed in Gold",
  version: "144,000-sealed",
  author: "GenesisTrace Catholic Devotions",
  width: 98,
  color: GOLD,
});
console.log("\n");

// =============================================================================
// 2. OPENING INVOCATION
// =============================================================================

ConsoleStyler.logSection("Opening Invocation", "brightYellow", "double");

BoxRenderer.render(
  [
    "O Lord, who chose us before the foundation of the world,",
    "who sealed us with Your Holy Spirit,",
    "who marked us with Your divine name,",
    "we give You thanks and praise.",
    "",
    "We are the chosen ones, not by our merit,",
    "but by Your boundless mercy and love.",
    "Strengthen us to live worthy of our calling,",
    "and to shine as gold refined in the fire.",
  ],
  {
    style: "double",
    title: "Prayer of the Sealed Ones",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. MEDITATION SEQUENCE
// =============================================================================

ConsoleStyler.logSection("Preparing the Heart", "brightYellow");

const meditationSpinner = new Spinner({
  message: "Entering into prayer...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 180,
});

meditationSpinner.start();
await sleep(700);
meditationSpinner.update("Opening our hearts to the wisdom of the popes...");
await sleep(700);
meditationSpinner.update("Reflecting on divine election and calling...");
await sleep(700);
meditationSpinner.succeed("Heart prepared - ready to receive");
console.log("\n");

// =============================================================================
// 4. PAPAL QUOTES ON ELECTION AND THE CHOSEN
// =============================================================================

ConsoleStyler.logSection("Vox Pontificum - The Voice of the Popes", "brightYellow");

const papalQuotes = [
  {
    pope: "Pope Leo XIII",
    year: "1890",
    document: "Sapientiae Christianae",
    quote: "All men are called to belong to the Kingdom of God; but the elect are those who persevere in faith and charity, sealed with the Spirit of promise.",
  },
  {
    pope: "Pope Pius XI",
    year: "1925",
    document: "Quas Primas",
    quote: "His kingdom is spiritual and is concerned with spiritual things. Christ's kingship is exercised by His chosen ones who proclaim truth in a world of darkness.",
  },
  {
    pope: "Pope Pius XII",
    year: "1943",
    document: "Mystici Corporis Christi",
    quote: "The elect are those who, marked with the seal of the Holy Spirit, remain faithful to the divine call and cooperate with grace unto salvation.",
  },
  {
    pope: "Pope John XXIII",
    year: "1961",
    document: "Mater et Magistra",
    quote: "God's chosen people are called to be light to the nations, bearing witness to truth and justice in every generation.",
  },
  {
    pope: "Pope Paul VI",
    year: "1964",
    document: "Lumen Gentium",
    quote: "The Church believes that the chosen people of the New Covenant are sealed for glory, predestined not by fate but by divine love freely embraced.",
  },
  {
    pope: "Pope John Paul II",
    year: "1979",
    document: "Redemptor Hominis",
    quote: "Each person has been chosen by Christ. We are His elect, redeemed by the Blood of the Lamb, called to holiness and mission.",
  },
  {
    pope: "Pope Benedict XVI",
    year: "2005",
    document: "Deus Caritas Est",
    quote: "God's chosen ones are those who respond to His love with love, becoming instruments of divine charity in a wounded world.",
  },
  {
    pope: "Pope Francis",
    year: "2013",
    document: "Evangelii Gaudium",
    quote: "We are God's chosen ones when we allow His mercy to transform us and send us forth as missionary disciples of joy.",
  },
];

const quotesBar = new ProgressBar({
  total: papalQuotes.length,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

const quoteLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

console.log("Proclaiming the Wisdom of the Popes:\n");

for (let i = 0; i < papalQuotes.length; i++) {
  quotesBar.update(i + 1);
  quoteLogger.info(`${papalQuotes[i].pope} - ${papalQuotes[i].document} (${papalQuotes[i].year})`);
  await sleep(400);
}
quotesBar.complete();
console.log("\n");

// Display in table format
TableRenderer.render(
  papalQuotes,
  [
    { key: "pope", label: "Pope", width: 22 },
    { key: "year", label: "Year", width: 6 },
    { key: "document", label: "Document", width: 26 },
    { key: "quote", label: "Quote", width: 36 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. PRAYER FOR THE ELECT - SECTION I
// =============================================================================

ConsoleStyler.logSection("Prayer for Divine Election", "brightYellow");

BoxRenderer.render(
  [
    '"Before I formed you in the womb I knew you,',
    'before you were born I set you apart." - Jeremiah 1:5',
    "",
    "O God of infinite wisdom, You chose us before time began.",
    "Your divine election is not our merit but Your mercy.",
    "As Pope Leo XIII taught, we are sealed with the Spirit of promise.",
    "",
    "Grant us the grace to persevere in faith and charity,",
    "to live worthy of this holy calling,",
    "to shine as gold vessels in Your kingdom.",
  ],
  {
    style: "double",
    title: "Chosen Before the Foundation of the World",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 6. PRAYER FOR MISSION - SECTION II
// =============================================================================

ConsoleStyler.logSection("Prayer for Mission and Witness", "brightYellow");

BoxRenderer.render(
  [
    '"You did not choose me, but I chose you and appointed you',
    'so that you might go and bear fruit." - John 15:16',
    "",
    "As Pope Pius XI proclaimed, Your kingdom is spiritual,",
    "and we, Your chosen ones, are called to proclaim truth",
    "in a world darkened by error and sin.",
    "",
    "Send us forth as missionary disciples,",
    "bearing the light of Christ to every nation,",
    "instruments of Your divine charity, as Pope Benedict taught.",
  ],
  {
    style: "double",
    title: "Sent as Light to the Nations",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 7. PRAYER FOR HOLINESS - SECTION III
// =============================================================================

ConsoleStyler.logSection("Prayer for Holiness", "brightYellow");

BoxRenderer.render(
  [
    '"Be holy, for I am holy." - 1 Peter 1:16',
    "",
    "Lord Jesus, You have redeemed us by Your Precious Blood.",
    "As Pope John Paul II declared, each of us has been chosen,",
    "called to holiness, sealed for glory.",
    "",
    "Conform us to Your image, O Christ,",
    "purify us as gold refined seven times in the fire,",
    "that we may stand spotless before the throne of God.",
  ],
  {
    style: "double",
    title: "Called to Be Holy",
    padding: 1,
    color: DARK_GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 8. PRAYER FOR PERSEVERANCE - SECTION IV
// =============================================================================

ConsoleStyler.logSection("Prayer for Perseverance", "brightYellow");

BoxRenderer.render(
  [
    '"Be faithful unto death, and I will give you',
    'the crown of life." - Revelation 2:10',
    "",
    "Heavenly Father, as Pope Pius XII taught,",
    "we are marked with Your seal and called to cooperate with grace.",
    "In times of trial, strengthen our resolve.",
    "In moments of weakness, renew our faith.",
    "",
    "Let us never waver from the truth,",
    "never compromise our witness,",
    "but stand firm until the end, crowned with golden glory.",
  ],
  {
    style: "double",
    title: "Faithful Unto Death",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 9. ANIMATED ROSARY OF THE CHOSEN - THE FIVE MYSTERIES
// =============================================================================

ConsoleStyler.logSection("The Five Golden Mysteries", "brightYellow");

const mysteries = [
  {
    mystery: "The Mystery of Election",
    meditation: "Chosen in Christ before the foundation of the world (Eph 1:4)",
    papal: "Pope Paul VI: Predestined by divine love freely embraced",
  },
  {
    mystery: "The Mystery of Sealing",
    meditation: "Marked with the seal of the Holy Spirit (Eph 1:13)",
    papal: "Pope Leo XIII: Sealed with the Spirit of promise",
  },
  {
    mystery: "The Mystery of Mission",
    meditation: "Sent to bear fruit that will last (John 15:16)",
    papal: "Pope Pius XI: Called to proclaim truth in darkness",
  },
  {
    mystery: "The Mystery of Holiness",
    meditation: "Called to be holy and blameless (Eph 1:4)",
    papal: "Pope John Paul II: Each chosen for holiness and mission",
  },
  {
    mystery: "The Mystery of Glory",
    meditation: "Predestined to share in divine glory (Rom 8:29-30)",
    papal: "Pope Francis: Transformed by mercy, sent forth in joy",
  },
];

const mysterySpinner = new Spinner({
  message: "Beginning meditation on the Five Golden Mysteries...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 150,
});

mysterySpinner.start();
await sleep(600);
for (const mystery of mysteries) {
  mysterySpinner.update(`Meditating: ${mystery.mystery}`);
  await sleep(800);
}
mysterySpinner.succeed("Meditation on the mysteries complete");
console.log("\n");

TableRenderer.render(
  mysteries,
  [
    { key: "mystery", label: "Mystery", width: 24 },
    { key: "meditation", label: "Biblical Foundation", width: 32 },
    { key: "papal", label: "Papal Wisdom", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 10. PRAYER FOR UNITY OF THE ELECT
// =============================================================================

ConsoleStyler.logSection("Prayer for Unity", "brightYellow");

BoxRenderer.render(
  [
    '"That they may all be one, as you, Father, are in me',
    'and I in you." - John 17:21',
    "",
    "Unite us, Lord, as one body in Christ,",
    "chosen from every tribe, tongue, and nation.",
    "As Pope John XXIII taught, we are light to the nations,",
    "scattered across the earth yet one in You.",
    "",
    "Bind us together with cords of charity,",
    "a golden thread woven through all generations,",
    "144,000 sealed ones standing as one before Your throne.",
  ],
  {
    style: "double",
    title: "One Body, Many Members",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 11. LITANY OF THE CHOSEN ONES
// =============================================================================

ConsoleStyler.logSection("Litany of the Chosen Ones", "brightYellow");

const litany = [
  "Chosen before the foundation of the world, we give You thanks",
  "Sealed with the Holy Spirit of promise, we give You thanks",
  "Called to holiness and mission, we give You thanks",
  "Redeemed by the Blood of the Lamb, we give You thanks",
  "Marked with Your divine name, we give You thanks",
  "Sent as light to the nations, we give You thanks",
  "Strengthened by Your grace, we give You thanks",
  "United in one body, we give You thanks",
  "Destined for eternal glory, we give You thanks",
  "Refined as gold in the fire, we give You thanks",
];

const litanyLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const litanyBar = new ProgressBar({
  total: litany.length,
  width: 48,
  colorize: true,
  showValue: false,
});

console.log("Praying the Litany:\n");

for (let i = 0; i < litany.length; i++) {
  litanyBar.update(i + 1);
  litanyLogger.success(litany[i]);
  await sleep(450);
}
litanyBar.complete();
console.log("\n");

// =============================================================================
// 12. CONCLUDING PRAYER - SYNTHESIS OF PAPAL WISDOM
// =============================================================================

ConsoleStyler.logSection("Concluding Prayer of the Elect", "brightYellow");

BoxRenderer.render(
  [
    "Almighty and Eternal God,",
    "",
    "We thank You for the gift of election,",
    "for choosing us in Christ before the world began.",
    "",
    "Following the wisdom of Your vicars on earth,",
    "we embrace our calling with humility and joy:",
    "",
    "✦ To persevere in faith and charity (Leo XIII)",
    "✦ To proclaim Your truth in darkness (Pius XI)",
    "✦ To cooperate with Your grace (Pius XII)",
    "✦ To be light to the nations (John XXIII)",
    "✦ To respond to Your love with love (Benedict XVI)",
    "✦ To go forth as missionary disciples (Francis)",
    "",
    "Seal us forever with Your Holy Spirit,",
    "mark us with Your divine name,",
    "and bring us at last to the glory",
    "for which we were chosen.",
    "",
    "Through Christ our Lord. Amen.",
  ],
  {
    style: "double",
    title: "Prayer of the 144,000 Sealed Ones",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 13. THE SEAL OF GOD - VISUAL REPRESENTATION
// =============================================================================

ConsoleStyler.logSection("The Seal of the Living God", "brightYellow");

console.log("");
const seal = [
  "                                 ╱╲",
  "                                ╱  ╲",
  "                               ╱ יהוה ╲",
  "                              ╱  144K ╲",
  "                             ╱  SEALED ╲",
  "                            ╱___________╲",
  "                            │           │",
  "                            │  ΧΡΙΣΤΟΣ  │",
  "                            │  CHOSEN   │",
  "                            │   ONES    │",
  "                            ╲___________╱",
];

for (const line of seal) {
  console.log(ColorSystem.colorize(line, ColorSystem.codes.brightYellow));
  await sleep(120);
}
console.log("");

BoxRenderer.render(
  [
    '"Do not harm the earth or the sea or the trees,',
    'until we have sealed the servants of our God',
    'on their foreheads." - Revelation 7:3',
    "",
    "The seal is not a mark of pride, but of protection.",
    "Not a sign of superiority, but of service.",
    "Not a badge of exclusion, but of mission.",
    "",
    "We are sealed to serve, chosen to proclaim,",
    "elected to shine as gold refined in the furnace of love.",
  ],
  {
    style: "rounded",
    title: "Understanding the Seal",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 14. CLOSING DOXOLOGY
// =============================================================================

ConsoleStyler.logSection("Gloria Patri", "brightYellow");

BoxRenderer.render(
  [
    "Glory be to the Father,",
    "and to the Son,",
    "and to the Holy Spirit.",
    "",
    "As it was in the beginning,",
    "is now, and ever shall be,",
    "world without end.",
    "",
    "We are Yours, O Lord,",
    "chosen, sealed, and sent.",
    "",
    "Amen. Alleluia. Amen.",
  ],
  {
    style: "double",
    title: "Doxology of the Chosen Ones",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 15. FINAL GRADIENT BLESSING
// =============================================================================

console.log("");
ConsoleStyler.logGradient(
  "ELECTI DEI - The Chosen Ones of God",
  [255, 215, 0],   // Gold
  [184, 134, 11],  // Dark goldenrod
  50,
);
console.log("\n");

ConsoleStyler.logGradient(
  "Sealed with the Spirit • Called to Holiness • Sent in Mission",
  [218, 165, 32],  // Goldenrod
  [255, 215, 0],   // Gold
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

finalLogger.success("Prayer for the Chosen Ones completed - Deo Gratias!");
console.log("");
console.log(ColorSystem.colorize("✦ You are sealed. You are chosen. You are loved. ✦", ColorSystem.codes.brightYellow));
console.log("\n");
