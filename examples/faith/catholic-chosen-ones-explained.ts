#!/usr/bin/env -S deno run --allow-env

/**
 * Who Are the Chosen Ones? - A Catholic Presentation
 *
 * An educational GenesisTrace presentation explaining the Catholic understanding
 * of "the chosen ones" - their biblical foundation, theological meaning,
 * and practical implications for the faithful.
 *
 * Features:
 *   - Biblical references and Church teaching
 *   - Theological explanations from Scripture and Tradition
 *   - Visual elements in gold (symbolizing divine election)
 *   - Progress bars, tables, and animated sections
 *   - Comprehensive exploration of Catholic doctrine
 *
 * Run with:
 *    deno run --allow-env examples/faith/catholic-chosen-ones-explained.ts
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

// Gold color palette symbolizing divine election and grace
const GOLD = ColorSystem.hexToRgb("#FFD700");      // Bright gold
const GOLDENROD = ColorSystem.hexToRgb("#DAA520");  // Deep goldenrod
const DARK_GOLD = ColorSystem.hexToRgb("#B8860B");  // Dark goldenrod
const ROYAL_BLUE = ColorSystem.hexToRgb("#4169E1"); // For Marian blue accents

console.clear();
console.log("\n");

// =============================================================================
// 1. OPENING BANNER
// =============================================================================

BannerRenderer.render({
  title: "WHO ARE THE CHOSEN ONES?",
  subtitle: "A Catholic Understanding of Divine Election",
  description: "Exploring Scripture, Tradition, and Magisterial Teaching",
  version: "v1.0.0",
  author: "GenesisTrace Catholic Formation",
  width: 98,
  color: GOLD,
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION - DEFINING THE QUESTION
// =============================================================================

ConsoleStyler.logSection("Introduction: The Question of Election", "brightYellow", "double");

BoxRenderer.render(
  [
    "Throughout salvation history, God has chosen specific individuals and peoples",
    "for His divine purposes. But what does it mean to be 'chosen'?",
    "",
    "This presentation explores the Catholic understanding of:",
    "",
    "  ✦ Biblical foundations of election and calling",
    "  ✦ The Old Covenant people: Israel as God's chosen",
    "  ✦ The New Covenant people: The Church as the elect",
    "  ✦ Individual vocation and universal call to holiness",
    "  ✦ The 144,000 in Revelation: Symbolic or literal?",
    "  ✦ Predestination and free will in Catholic teaching",
    "",
    "Let us begin this journey through Scripture and Tradition...",
  ],
  {
    style: "double",
    title: "Overview",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// Loading sequence
const introSpinner = new Spinner({
  message: "Preparing biblical foundations...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 160,
});

introSpinner.start();
await sleep(800);
introSpinner.update("Loading Church teachings...");
await sleep(800);
introSpinner.update("Gathering theological insights...");
await sleep(800);
introSpinner.succeed("Ready to explore who the chosen ones are");
console.log("\n");

// =============================================================================
// 3. PART I - OLD TESTAMENT: ISRAEL AS GOD'S CHOSEN PEOPLE
// =============================================================================

ConsoleStyler.logSection("Part I: The Old Covenant - Israel's Election", "brightYellow");

BoxRenderer.render(
  [
    "In the Old Testament, God chose the people of Israel from among all nations",
    "to be His treasured possession, a holy people set apart for His purposes.",
    "",
    '"For you are a people holy to the LORD your God. The LORD your God',
    'has chosen you out of all the peoples on the face of the earth',
    'to be his people, his treasured possession." - Deuteronomy 7:6',
    "",
    "This election was not based on Israel's merit or greatness,",
    "but purely on God's sovereign love and faithfulness to His covenant.",
  ],
  {
    style: "rounded",
    title: "Israel: The First Chosen People",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// Table of Old Testament election themes
const otElection = [
  {
    person: "Abraham",
    calling: "Father of nations",
    reference: "Genesis 12:1-3",
    purpose: "Blessing to all peoples",
  },
  {
    person: "Moses",
    calling: "Deliverer and lawgiver",
    reference: "Exodus 3:10",
    purpose: "Lead Israel from slavery",
  },
  {
    person: "David",
    calling: "King after God's heart",
    reference: "1 Samuel 16:12",
    purpose: "Establish royal covenant",
  },
  {
    person: "The Prophets",
    calling: "Messengers of God",
    reference: "Jeremiah 1:5",
    purpose: "Call Israel to faithfulness",
  },
  {
    person: "Israel (Nation)",
    calling: "Priestly kingdom",
    reference: "Exodus 19:5-6",
    purpose: "Be light to the nations",
  },
];

TableRenderer.render(
  otElection,
  [
    { key: "person", label: "Person/People", width: 18 },
    { key: "calling", label: "Calling", width: 22 },
    { key: "reference", label: "Scripture", width: 18 },
    { key: "purpose", label: "Divine Purpose", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "KEY INSIGHT:",
    "",
    "God's choice of Israel was both PARTICULAR and UNIVERSAL.",
    "",
    "Particular: He chose one nation from among all nations.",
    "Universal: Through Israel, all nations would be blessed.",
    "",
    "This pattern of election for service continues in the New Covenant.",
  ],
  {
    style: "rounded",
    title: "The Pattern of Election",
    padding: 1,
    color: DARK_GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 4. PART II - NEW TESTAMENT: THE CHURCH AS THE NEW CHOSEN PEOPLE
// =============================================================================

ConsoleStyler.logSection("Part II: The New Covenant - The Church as Elect", "brightYellow");

BoxRenderer.render(
  [
    "In Jesus Christ, the promises to Israel are fulfilled and extended",
    "to all who believe. The Church becomes the New Israel, God's chosen people.",
    "",
    '"You are a chosen people, a royal priesthood, a holy nation,',
    "God's special possession, that you may declare the praises",
    'of him who called you out of darkness into his wonderful light." - 1 Peter 2:9',
    "",
    "The Church - all baptized believers united to Christ -",
    "is collectively the chosen people of the New Covenant.",
  ],
  {
    style: "double",
    title: "The Church: The New Chosen People",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// New Testament teachings on election
const ntElection = [
  {
    theme: "Chosen in Christ",
    teaching: "Elected before the foundation of the world",
    scripture: "Ephesians 1:4",
    implication: "Divine initiative precedes our response",
  },
  {
    theme: "Called to Holiness",
    teaching: "Chosen to be holy and blameless",
    scripture: "Ephesians 1:4",
    implication: "Election includes moral transformation",
  },
  {
    theme: "Predestined for Glory",
    teaching: "Predestined to be conformed to Christ",
    scripture: "Romans 8:29-30",
    implication: "Our destiny is union with God",
  },
  {
    theme: "Sealed by the Spirit",
    teaching: "Marked with the seal of the Holy Spirit",
    scripture: "Ephesians 1:13",
    implication: "The Spirit is our guarantee",
  },
  {
    theme: "Universal Call",
    teaching: "God desires all to be saved",
    scripture: "1 Timothy 2:4",
    implication: "Election is offered to everyone",
  },
];

TableRenderer.render(
  ntElection,
  [
    { key: "theme", label: "Theme", width: 20 },
    { key: "teaching", label: "Teaching", width: 26 },
    { key: "scripture", label: "Scripture", width: 16 },
    { key: "implication", label: "Meaning", width: 24 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. PART III - WHO ARE THE 144,000 IN REVELATION?
// =============================================================================

ConsoleStyler.logSection("Part III: The 144,000 - Understanding Revelation 7 & 14", "brightYellow");

BoxRenderer.render(
  [
    '"Then I heard the number of those who were sealed: 144,000',
    'from all the tribes of Israel." - Revelation 7:4',
    "",
    "The 144,000 appear in Revelation 7:1-8 and Revelation 14:1-5.",
    "Catholic interpretation recognizes multiple layers of meaning:",
  ],
  {
    style: "double",
    title: "The Vision of the 144,000",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// Progress bar for loading interpretations
const interpretBar = new ProgressBar({
  total: 4,
  width: 50,
  colorize: true,
  showPercentage: true,
});

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

console.log("Loading Catholic interpretations of the 144,000:\n");

const interpretations = [
  "Literal Interpretation - Physical descendants of Israel",
  "Symbolic Interpretation - The fullness of God's people",
  "Ecclesial Interpretation - The complete Church",
  "Eschatological Interpretation - The faithful remnant",
];

for (let i = 0; i < interpretations.length; i++) {
  interpretBar.update(i + 1);
  logger.info(interpretations[i]);
  await sleep(500);
}
interpretBar.complete();
console.log("\n");

// Detailed explanations
const revelationInterpretations = [
  {
    view: "Symbolic/Spiritual",
    description: "144,000 = 12 tribes × 12 apostles × 1000 (completeness)",
    support: "Most common Catholic view",
    meaning: "The totality of God's people from Old and New Covenants",
  },
  {
    view: "Ecclesiological",
    description: "Represents the universal Church on earth",
    support: "Supported by Church Fathers",
    meaning: "All the baptized faithful sealed with the Holy Spirit",
  },
  {
    view: "Eschatological",
    description: "Those who remain faithful during great tribulation",
    support: "Apocalyptic literature tradition",
    meaning: "Martyrs and confessors who persevere to the end",
  },
  {
    view: "Liturgical",
    description: "The Church worshiping in heaven and on earth",
    support: "Revelation's liturgical imagery",
    meaning: "The communion of saints united in praise",
  },
];

TableRenderer.render(
  revelationInterpretations,
  [
    { key: "view", label: "Interpretation", width: 20 },
    { key: "description", label: "Description", width: 28 },
    { key: "support", label: "Support", width: 20 },
    { key: "meaning", label: "Theological Meaning", width: 18 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "CATHOLIC CONSENSUS:",
    "",
    "The 144,000 is primarily understood SYMBOLICALLY, not literally.",
    "",
    "The number represents COMPLETENESS and PERFECTION:",
    "  • 12 = The tribes of Israel (Old Covenant)",
    "  • 12 = The Apostles (New Covenant)",
    "  • 1,000 = Multitude beyond counting",
    "  • 144,000 = The COMPLETE number of God's elect",
    "",
    "This does NOT mean only 144,000 people will be saved.",
    "Rather, it symbolizes ALL who are sealed by God and saved.",
  ],
  {
    style: "rounded",
    title: "The Correct Understanding",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 6. PART IV - CATHOLIC DOCTRINE ON PREDESTINATION
// =============================================================================

ConsoleStyler.logSection("Part IV: Predestination and Free Will", "brightYellow");

BoxRenderer.render(
  [
    "Catholic teaching holds both divine sovereignty and human freedom in balance.",
    "",
    "From the Catechism of the Catholic Church (CCC 600):",
    '"To God, all moments of time are present in their immediacy.',
    "When therefore he establishes his eternal plan of 'predestination',",
    'he includes in it each person\'s free response to his grace."',
    "",
    "Key principles:",
    "  1. God desires ALL to be saved (1 Tim 2:4)",
    "  2. God's grace is offered to EVERYONE",
    "  3. We must freely cooperate with grace",
    "  4. God foreknows who will accept His grace",
    "  5. Those who respond are the 'chosen ones'",
  ],
  {
    style: "double",
    title: "Divine Election and Human Freedom",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// Comparing Catholic vs other views
const predestinationViews = [
  {
    tradition: "Catholic",
    sovereignty: "God initiates salvation",
    freedom: "Humans freely cooperate",
    result: "Synergistic - grace and free will work together",
  },
  {
    tradition: "Augustinian",
    sovereignty: "God's grace is irresistible",
    freedom: "Will is freed by grace",
    result: "Grace enables the will to choose God",
  },
  {
    tradition: "Molinist",
    sovereignty: "God knows all possibilities",
    freedom: "Genuine human freedom",
    result: "God works through middle knowledge",
  },
  {
    tradition: "Thomist",
    sovereignty: "God's grace is efficacious",
    freedom: "Grace moves the will infallibly",
    result: "Grace never fails in its effect",
  },
];

TableRenderer.render(
  predestinationViews,
  [
    { key: "tradition", label: "Tradition", width: 14 },
    { key: "sovereignty", label: "Divine Action", width: 24 },
    { key: "freedom", label: "Human Response", width: 24 },
    { key: "result", label: "How They Work Together", width: 24 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "AVOIDING ERRORS:",
    "",
    "Catholic teaching rejects two extremes:",
    "",
    "❌ PREDETERMINISM: God decides everything, humans have no real choice",
    "   (Condemned - denies human freedom and responsibility)",
    "",
    "❌ PELAGIANISM: Humans save themselves without need for grace",
    "   (Condemned - denies the necessity and priority of grace)",
    "",
    "✓ CATHOLIC TRUTH: God's grace is necessary AND human cooperation matters",
    "   Both/and, not either/or",
  ],
  {
    style: "rounded",
    title: "The Middle Path",
    padding: 1,
    color: DARK_GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 7. PART V - WHO EXACTLY ARE THE CHOSEN ONES?
// =============================================================================

ConsoleStyler.logSection("Part V: So Who Are the Chosen Ones?", "brightYellow");

const answerSpinner = new Spinner({
  message: "Synthesizing Church teaching...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 150,
});

answerSpinner.start();
await sleep(1000);
answerSpinner.update("Consulting Scripture and Tradition...");
await sleep(1000);
answerSpinner.update("Formulating the answer...");
await sleep(1000);
answerSpinner.succeed("Answer ready");
console.log("\n");

BoxRenderer.render(
  [
    "THE CHOSEN ONES ARE...",
    "",
    "1. COLLECTIVELY: The Church - All Baptized Believers",
    "   Every baptized Christian is part of God's chosen people",
    "   United to Christ through baptism and sealed by the Spirit",
    "",
    "2. INDIVIDUALLY: All Who Accept God's Call",
    "   God calls everyone to salvation",
    "   Those who respond in faith become 'the elect'",
    "   Perseverance in grace leads to final salvation",
    "",
    "3. VOCATIONALLY: Those Called to Specific Missions",
    "   Priests, religious, consecrated persons",
    "   Married couples, single persons",
    "   Every vocation is a divine calling",
    "",
    "4. ESCHATOLOGICALLY: The Saints in Heaven",
    "   Those who have finished the race and kept the faith",
    "   The Church Triumphant - fully perfected in glory",
  ],
  {
    style: "double",
    title: "The Complete Answer",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 8. PART VI - CHARACTERISTICS OF THE CHOSEN ONES
// =============================================================================

ConsoleStyler.logSection("Part VI: Marks of the Chosen", "brightYellow");

const characteristics = [
  {
    mark: "Baptized",
    description: "Incorporated into Christ's Body",
    scripture: "Galatians 3:27",
    practice: "Live out baptismal promises",
  },
  {
    mark: "Sealed by Spirit",
    description: "Confirmed in grace and mission",
    scripture: "Ephesians 1:13",
    practice: "Cultivate gifts of the Spirit",
  },
  {
    mark: "Called to Holiness",
    description: "Set apart for God's purposes",
    scripture: "1 Thessalonians 4:3",
    practice: "Pursue virtue and sanctity",
  },
  {
    mark: "Missionary Disciples",
    description: "Sent to evangelize the world",
    scripture: "Matthew 28:19",
    practice: "Share faith with others",
  },
  {
    mark: "Persevering Faith",
    description: "Remain faithful unto death",
    scripture: "Revelation 2:10",
    practice: "Stay rooted in the Church",
  },
  {
    mark: "Sacramental Life",
    description: "Nourished by Eucharist",
    scripture: "John 6:54",
    practice: "Regular Mass and confession",
  },
];

TableRenderer.render(
  characteristics,
  [
    { key: "mark", label: "Mark", width: 18 },
    { key: "description", label: "Description", width: 24 },
    { key: "scripture", label: "Scripture", width: 18 },
    { key: "practice", label: "How to Live It", width: 26 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 9. PART VII - COMMON MISUNDERSTANDINGS
// =============================================================================

ConsoleStyler.logSection("Part VII: Clearing Up Confusion", "brightYellow");

const misunderstandings = [
  {
    error: "Only 144,000 will be saved",
    truth: "The number is symbolic of ALL the saved",
    correction: "Heaven is open to all who die in God's grace",
  },
  {
    error: "The chosen are a special elite group",
    truth: "All baptized Christians are chosen",
    correction: "Election is by grace, not by merit or status",
  },
  {
    error: "If you're not chosen, you can't be saved",
    truth: "God offers salvation to EVERYONE",
    correction: "The call is universal; the response is free",
  },
  {
    error: "Election removes human freedom",
    truth: "God's grace respects and enables freedom",
    correction: "We freely cooperate with grace",
  },
  {
    error: "Being chosen means earthly success",
    truth: "We are chosen for holiness, not comfort",
    correction: "Election often involves the cross",
  },
];

TableRenderer.render(
  misunderstandings,
  [
    { key: "error", label: "❌ Misunderstanding", width: 28 },
    { key: "truth", label: "✓ Catholic Truth", width: 30 },
    { key: "correction", label: "Correction", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 10. PART VIII - PRACTICAL IMPLICATIONS
// =============================================================================

ConsoleStyler.logSection("Part VIII: Living as the Chosen Ones", "brightYellow");

BoxRenderer.render(
  [
    "What does it mean practically to live as one of God's chosen?",
    "",
    "1. GRATITUDE - Chosen by grace, not by merit",
    "   Response: Daily thanksgiving for the gift of faith",
    "",
    "2. HUMILITY - Election is for service, not status",
    "   Response: Use gifts to serve others, not for pride",
    "",
    "3. RESPONSIBILITY - Much is given, much is required",
    "   Response: Live worthy of the calling (Ephesians 4:1)",
    "",
    "4. MISSION - Chosen to be sent",
    "   Response: Evangelize and witness to the faith",
    "",
    "5. HOLINESS - Called to be saints",
    "   Response: Cooperate with grace through prayer and sacraments",
    "",
    "6. PERSEVERANCE - Remain faithful to the end",
    "   Response: Endure trials with hope in eternal life",
  ],
  {
    style: "double",
    title: "From Doctrine to Daily Life",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 11. PART IX - CHURCH FATHERS ON THE CHOSEN
// =============================================================================

ConsoleStyler.logSection("Part IX: Voices from Tradition", "brightYellow");

const fathersQuotes = [
  {
    father: "St. Augustine",
    year: "c. 400 AD",
    quote: "Many whom God has, the Church does not have; and many whom the Church has, God does not have.",
    meaning: "God's election transcends visible boundaries",
  },
  {
    father: "St. John Chrysostom",
    year: "c. 390 AD",
    quote: "God does not choose the worthy but makes worthy those He chooses.",
    meaning: "Election is pure grace and gift",
  },
  {
    father: "St. Irenaeus",
    year: "c. 180 AD",
    quote: "The Church is the choir of the chosen, singing in harmony to the glory of God.",
    meaning: "The Church is the community of the elect",
  },
  {
    father: "Origen",
    year: "c. 230 AD",
    quote: "We are chosen in Christ that we might choose Christ in return.",
    meaning: "Divine election and human choice cooperate",
  },
];

TableRenderer.render(
  fathersQuotes,
  [
    { key: "father", label: "Church Father", width: 20 },
    { key: "year", label: "Era", width: 12 },
    { key: "quote", label: "Quote", width: 32 },
    { key: "meaning", label: "Teaching", width: 22 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 12. PART X - MAGISTERIAL TEACHING
// =============================================================================

ConsoleStyler.logSection("Part X: Official Church Teaching", "brightYellow");

BoxRenderer.render(
  [
    "Catechism of the Catholic Church on Election:",
    "",
    "CCC 1: 'God... in Christ, chose us before the foundation of the world",
    "        to be holy and blameless before him in love.'",
    "",
    "CCC 1037: 'God predestines no one to go to hell; for this, a willful",
    "          turning away from God (mortal sin) is necessary, and",
    "          persistence in it until the end.'",
    "",
    "CCC 2782: 'We can invoke God as \"Father\" because the Son of God made man",
    "          has revealed him to us, and because his Spirit makes him known",
    "          to us. The vocation to eternal life is divine adoption.'",
    "",
    "Council of Trent (Session 6): Grace precedes, accompanies, and follows",
    "our cooperation; the initiative belongs to God, but our free assent matters.",
  ],
  {
    style: "double",
    title: "Authoritative Teaching",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 13. CONCLUSION - SUMMARY
// =============================================================================

ConsoleStyler.logSection("Conclusion: The Beautiful Truth", "brightYellow");

const conclusionSpinner = new Spinner({
  message: "Preparing summary...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 140,
});

conclusionSpinner.start();
await sleep(1200);
conclusionSpinner.succeed("Summary complete");
console.log("\n");

BoxRenderer.render(
  [
    "THE CHOSEN ONES IN CATHOLIC TEACHING:",
    "",
    "➤ WHO: Every baptized Christian, the whole Church, is chosen by God",
    "",
    "➤ HOW: Through God's free gift of grace, accepted by free human response",
    "",
    "➤ WHY: To be holy, to be witnesses, to be saved and glorified in Christ",
    "",
    "➤ WHEN: Chosen before the foundation of the world (Eph 1:4)",
    "",
    "➤ WHERE: In Christ - election is always 'in Him' and through Him",
    "",
    "The 144,000 in Revelation symbolizes the TOTALITY of the saved,",
    "not a limited number. God desires ALL to be saved (1 Tim 2:4).",
    "",
    "We are chosen by grace, sealed by the Spirit, called to holiness,",
    "and sent on mission. This is our identity. This is our dignity.",
    "This is the glorious truth of being among God's chosen ones.",
  ],
  {
    style: "double",
    title: "The Complete Picture",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 14. CALL TO ACTION
// =============================================================================

ConsoleStyler.logSection("Your Response", "brightYellow");

BoxRenderer.render(
  [
    "Now that you understand who the chosen ones are, ask yourself:",
    "",
    "  ✦ Have I accepted God's call in baptism?",
    "  ✦ Am I living worthy of this holy vocation?",
    "  ✦ Do I cooperate with God's grace daily?",
    "  ✦ Am I fulfilling my mission to evangelize?",
    "  ✦ Am I persevering in faith and charity?",
    "",
    "Remember:",
    "  'You did not choose me, but I chose you and appointed you",
    "   so that you might go and bear fruit—fruit that will last.' - John 15:16",
    "",
    "You are chosen. You are called. You are sent.",
    "Live as one sealed with the mark of God's love.",
  ],
  {
    style: "rounded",
    title: "Living Your Calling",
    padding: 1,
    color: GOLDENROD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 15. CLOSING PRAYER
// =============================================================================

ConsoleStyler.logSection("Closing Prayer", "brightYellow");

BoxRenderer.render(
  [
    "Heavenly Father,",
    "",
    "We thank You for choosing us in Christ",
    "before the foundation of the world.",
    "Help us to live worthy of this calling,",
    "to cooperate with Your grace each day,",
    "and to persevere in faith and love.",
    "",
    "Seal us with Your Holy Spirit,",
    "mark us as Your own,",
    "and bring us at last to the glory",
    "for which we were chosen.",
    "",
    "Through Christ our Lord.",
    "Amen.",
  ],
  {
    style: "double",
    title: "Prayer of the Elect",
    padding: 1,
    color: GOLD,
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 16. FINAL BLESSING
// =============================================================================

console.log("");
ConsoleStyler.logGradient(
  "ELECTI IN CHRISTO - Chosen in Christ",
  [255, 215, 0],   // Gold
  [184, 134, 11],  // Dark goldenrod
  50,
);
console.log("\n");

ConsoleStyler.logGradient(
  "Baptized • Sealed • Called • Sent • Chosen",
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

finalLogger.success("Presentation complete - May you live as one chosen by God!");
console.log("");
console.log(ColorSystem.colorize("✦ You are chosen. You are loved. You are called. ✦", ColorSystem.codes.brightYellow));
console.log("\n");
