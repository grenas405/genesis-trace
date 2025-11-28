#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * The Light of Christ: An Introduction to Catholicism
 * by Thomas Joseph White, OP
 *
 * A comprehensive GenesisTrace demonstration walking through the major themes
 * of Fr. White's systematic introduction to Catholic theology and faith.
 *
 * Features:
 *   • Themed logger with liturgical colors
 *   • Sequential exploration of theological virtues
 *   • Progressive unveiling of sacramental mysteries
 *   • Tables displaying Church teachings and traditions
 *   • Progress bars tracking theological formation
 *   • Animated spinners for meditative transitions
 *   • Box renderings with scriptural and magisterial quotations
 *
 * Run with:
 *    deno run --allow-env examples/faith/light-of-christ-intro.ts
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
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

// =============================================================================
// 1. PROLOGUE: THE LIGHT OF CHRIST
// =============================================================================

BannerRenderer.render({
  title: "✝ THE LIGHT OF CHRIST ✝",
  subtitle: "An Introduction to Catholicism",
  description: "Thomas Joseph White, OP • A Journey into the Catholic Faith",
  version: "Systematic Theology Series",
  author: "Dominican School of Philosophy & Theology",
  width: 98,
  color: ColorSystem.hexToRgb("#8B0000"), // Deep liturgical red
});
console.log("\n");

ConsoleStyler.logSection("In Lumine Tuo Videbimus Lumen", "brightYellow", "double");

BoxRenderer.render(
  [
    '"In your light we see light." (Psalm 36:9)',
    "",
    "The Catholic faith is a living encounter with Jesus Christ,",
    "the Light of the World, who illuminates the human mind and heart",
    "with divine truth. This journey explores the foundational mysteries",
    "of the Catholic tradition through the lens of Sacred Scripture,",
    "the Church Fathers, and the Magisterium.",
    "",
    "Fr. Thomas Joseph White, OP guides us through:",
    "The Theological Virtues • The Seven Sacraments • The Trinity",
    "The Incarnation • The Church • Prayer & the Spiritual Life",
  ],
  {
    style: "double",
    title: "Introduction",
    padding: 1,
    color: ColorSystem.hexToRgb("#F1C40F"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 2. THEOLOGICAL FOUNDATION
// =============================================================================

ConsoleStyler.logSection("Part I: The Theological Virtues", "brightCyan");

const theologyLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(true)
    .maxHistorySize(300)
    .build(),
);

theologyLogger.info("Initializing theological formation sequence...");
console.log("\n");

// Faith, Hope, Charity
const theologicalVirtues = [
  {
    virtue: "FIDES (Faith)",
    definition: "The theological virtue by which we believe in God",
    scripture: "Hebrews 11:1",
    gift: "Gift of Understanding",
    chapter: "Chapters 1-5",
  },
  {
    virtue: "SPES (Hope)",
    definition: "The theological virtue by which we desire eternal life",
    scripture: "Romans 8:24-25",
    gift: "Gift of Knowledge",
    chapter: "Chapters 6-9",
  },
  {
    virtue: "CARITAS (Charity)",
    definition: "The theological virtue by which we love God above all",
    scripture: "1 Corinthians 13:13",
    gift: "Gift of Wisdom",
    chapter: "Chapters 10-14",
  },
];

TableRenderer.render(
  theologicalVirtues,
  [
    { key: "virtue", label: "Theological Virtue", width: 18 },
    { key: "definition", label: "Definition", width: 32 },
    { key: "scripture", label: "Scripture", width: 16 },
    { key: "gift", label: "Holy Spirit's Gift", width: 18 },
  ],
  { showIndex: true },
);
console.log("\n");

// Animated exploration of Faith
const faithSpinner = new Spinner({
  message: "Meditating on the virtue of Faith...",
  frames: ["✦", "✧", "✶", "✷", "✸", "✹", "✺", "✻"],
  interval: 120,
});

faithSpinner.start();
await sleep(800);
faithSpinner.update("Faith: The foundation of all theological knowledge...");
await sleep(700);
faithSpinner.update("Faith seeks understanding (fides quaerens intellectum)...");
await sleep(700);
faithSpinner.succeed("Faith illuminates the intellect with divine truth");
console.log("\n");

BoxRenderer.render(
  [
    "On Faith:",
    "",
    '"Faith is the realization of what is hoped for',
    'and evidence of things not seen." (Hebrews 11:1)',
    "",
    "St. Thomas Aquinas teaches that faith is both a gift of God",
    "and a free assent of the human will. It is the beginning of",
    "eternal life in us, as we come to know God not through natural",
    "reason alone, but through divine revelation.",
    "",
    "Faith is reasonable, yet transcends reason.",
    "It is certain, yet darkly known.",
    "It is a foretaste of the Beatific Vision.",
  ],
  {
    style: "rounded",
    title: "Fr. White on the Nature of Faith",
    padding: 1,
    color: ColorSystem.hexToRgb("#3498DB"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. THE MYSTERY OF THE TRINITY
// =============================================================================

ConsoleStyler.logSection("Part II: The Holy Trinity", "brightMagenta");

const trinityLogger = theologyLogger.child("trinity");

BoxRenderer.render(
  [
    "The Central Mystery of Christian Faith:",
    "",
    "One God in Three Divine Persons",
    "  • The Father: Source and Origin",
    "  • The Son: Eternal Word, Begotten not Made",
    "  • The Holy Spirit: Love proceeding from Father and Son",
    "",
    "Three Persons, One Divine Nature",
    "Co-equal, Co-eternal, Consubstantial",
    "",
    '"Gloria Patri, et Filio, et Spiritui Sancto"',
  ],
  {
    style: "double",
    title: "The Trinity - Chapters 15-19",
    padding: 1,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("\n");

const trinityAspects = [
  {
    person: "Father",
    relation: "Unbegotten",
    mission: "Creation & Providence",
    attribute: "Power",
  },
  {
    person: "Son",
    relation: "Eternally Begotten",
    mission: "Redemption & Incarnation",
    attribute: "Wisdom",
  },
  {
    person: "Holy Spirit",
    relation: "Proceeding",
    mission: "Sanctification & Grace",
    attribute: "Love",
  },
];

TableRenderer.render(
  trinityAspects,
  [
    { key: "person", label: "Divine Person", width: 16 },
    { key: "relation", label: "Relation", width: 20 },
    { key: "mission", label: "Mission", width: 26 },
    { key: "attribute", label: "Appropriated Attribute", width: 20 },
  ],
  { showIndex: true },
);
console.log("\n");

trinityLogger.success("The Trinity: Mystery of divine communion and perfect love");
console.log("\n");

// =============================================================================
// 4. THE INCARNATION: GOD BECOMES MAN
// =============================================================================

ConsoleStyler.logSection("Part III: The Incarnation of the Word", "brightRed");

const incarnationSpinner = new Spinner({
  message: "Contemplating the mystery of the Incarnation...",
  frames: ["◐", "◓", "◑", "◒"],
  interval: 140,
});

incarnationSpinner.start();
await sleep(600);
incarnationSpinner.update("Et Verbum caro factum est...");
await sleep(600);
incarnationSpinner.update("The Word became flesh and dwelt among us...");
await sleep(600);
incarnationSpinner.succeed("The Incarnation: God's definitive self-revelation");
console.log("\n");

BoxRenderer.render(
  [
    '"And the Word became flesh and made his dwelling among us,',
    'and we saw his glory, the glory as of the Father\'s only Son,',
    'full of grace and truth." (John 1:14)',
    "",
    "The Incarnation is the central mystery of Christianity:",
    "",
    "• Jesus Christ is true God and true man",
    "• Two natures (divine and human) in one divine Person",
    "• Hypostatic Union: the person of the Word assumes human nature",
    "• Born of the Virgin Mary by the power of the Holy Spirit",
    "",
    "Through the Incarnation, God enters human history to save us.",
    "What was lost in Adam is restored in Christ, the New Adam.",
  ],
  {
    style: "bold",
    title: "Chapters 20-25: Christology",
    padding: 1,
    color: ColorSystem.hexToRgb("#E74C3C"),
    maxWidth: 94,
  },
);
console.log("\n");

const christologicalCouncils = [
  { council: "Nicaea (325)", teaching: "Christ is true God, consubstantial with the Father" },
  { council: "Constantinople I (381)", teaching: "Christ's divinity and the Holy Spirit confirmed" },
  { council: "Ephesus (431)", teaching: "Mary is Theotokos, Mother of God" },
  { council: "Chalcedon (451)", teaching: "Two natures in one Person, without confusion" },
];

TableRenderer.render(
  christologicalCouncils,
  [
    { key: "council", label: "Ecumenical Council", width: 24 },
    { key: "teaching", label: "Christological Teaching", width: 56 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. THE SEVEN SACRAMENTS
// =============================================================================

ConsoleStyler.logSection("Part IV: The Seven Sacraments", "brightGreen");

const sacramentLogger = theologyLogger.child("sacraments");

BoxRenderer.render(
  [
    "The Sacraments: Efficacious Signs of Grace",
    "",
    "Sacraments are visible signs of invisible grace,",
    "instituted by Christ and entrusted to the Church.",
    "",
    "Through the sacraments, Christ continues his saving work,",
    "communicating divine life to the faithful.",
    "",
    "Ex opere operato: They confer grace by the very fact",
    "of the action being performed.",
  ],
  {
    style: "rounded",
    title: "Chapters 26-32: Sacramental Theology",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

const sacraments = [
  {
    sacrament: "Baptism",
    category: "Initiation",
    grace: "Rebirth in Christ, forgiveness of sin",
    minister: "Priest, Deacon, or anyone in necessity",
  },
  {
    sacrament: "Confirmation",
    category: "Initiation",
    grace: "Fullness of the Holy Spirit",
    minister: "Bishop (ordinarily)",
  },
  {
    sacrament: "Eucharist",
    category: "Initiation",
    grace: "Body, Blood, Soul & Divinity of Christ",
    minister: "Priest",
  },
  {
    sacrament: "Reconciliation",
    category: "Healing",
    grace: "Forgiveness of post-baptismal sin",
    minister: "Priest",
  },
  {
    sacrament: "Anointing",
    category: "Healing",
    grace: "Spiritual & physical healing",
    minister: "Priest",
  },
  {
    sacrament: "Holy Orders",
    category: "Service",
    grace: "Configuration to Christ the High Priest",
    minister: "Bishop",
  },
  {
    sacrament: "Matrimony",
    category: "Service",
    grace: "Sanctifying grace for married life",
    minister: "The couple themselves",
  },
];

TableRenderer.render(
  sacraments,
  [
    { key: "sacrament", label: "Sacrament", width: 14 },
    { key: "category", label: "Category", width: 12 },
    { key: "grace", label: "Grace Conferred", width: 32 },
    { key: "minister", label: "Ordinary Minister", width: 24 },
  ],
  { showIndex: true },
);
console.log("\n");

// Animated progress through sacramental life
const sacramentalBar = new ProgressBar({
  total: 7,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Sacramental Journey of Christian Initiation:");
const sacramentPhases = [
  "Baptism: Incorporated into Christ...",
  "Growing in faith through catechesis...",
  "Confirmation: Sealed with the Holy Spirit...",
  "First Communion: Receiving the Bread of Life...",
  "Reconciliation: Encountering divine mercy...",
  "Deepening prayer and spiritual life...",
  "Living as witness to the Gospel...",
];

for (let i = 0; i < sacramentPhases.length; i++) {
  sacramentalBar.update(i + 1);
  sacramentLogger.info(sacramentPhases[i]);
  await sleep(350);
}
sacramentalBar.complete();
console.log("\n");

// =============================================================================
// 6. THE CHURCH: MYSTICAL BODY OF CHRIST
// =============================================================================

ConsoleStyler.logSection("Part V: The Church", "brightBlue");

const churchLogger = theologyLogger.child("ecclesiology");

BoxRenderer.render(
  [
    "The Church: Sacrament of Salvation",
    "",
    "The Catholic Church is the Mystical Body of Christ,",
    "the People of God, the Temple of the Holy Spirit.",
    "",
    "Four Marks of the Church:",
    "  • One: United in faith, sacraments, and apostolic succession",
    "  • Holy: Sanctified by Christ, source of holiness",
    "  • Catholic: Universal, for all people and times",
    "  • Apostolic: Built on the foundation of the Apostles",
    "",
    '"You are Peter, and upon this rock I will build my Church."',
    "(Matthew 16:18)",
  ],
  {
    style: "double",
    title: "Chapters 33-38: Ecclesiology",
    padding: 1,
    color: ColorSystem.hexToRgb("#3498DB"),
    maxWidth: 94,
  },
);
console.log("\n");

const churchMysteries = [
  { aspect: "Mystical Body of Christ", dimension: "Communion with Christ the Head" },
  { aspect: "People of God", dimension: "New Covenant, new Israel" },
  { aspect: "Temple of Holy Spirit", dimension: "Sanctified and animated by the Spirit" },
  { aspect: "Bride of Christ", dimension: "Spousal union with Christ" },
  { aspect: "Mother & Teacher", dimension: "Mater et Magistra" },
];

TableRenderer.render(
  churchMysteries,
  [
    { key: "aspect", label: "Image of the Church", width: 28 },
    { key: "dimension", label: "Theological Dimension", width: 44 },
  ],
  { showIndex: true },
);
console.log("\n");

churchLogger.success("The Church: Where heaven meets earth in sacramental life");
console.log("\n");

// =============================================================================
// 7. THE SPIRITUAL LIFE & PRAYER
// =============================================================================

ConsoleStyler.logSection("Part VI: Prayer & the Spiritual Life", "brightYellow");

const prayerSpinner = new Spinner({
  message: "Entering into contemplative silence...",
  frames: ["🕯", "🕯️", "🕯", "🕯️"],
  interval: 500,
});

prayerSpinner.start();
await sleep(1000);
prayerSpinner.update("Prayer: The raising of mind and heart to God...");
await sleep(1000);
prayerSpinner.succeed("Prayer: Communion with the Blessed Trinity");
console.log("\n");

BoxRenderer.render(
  [
    "Forms of Prayer:",
    "",
    "ADORATION: Acknowledging God as Creator and Lord",
    "CONTRITION: Sorrow for sin and desire for conversion",
    "THANKSGIVING: Gratitude for God's gifts and blessings",
    "SUPPLICATION: Asking for God's help and intercession",
    "",
    '"Pray without ceasing." (1 Thessalonians 5:17)',
    "",
    "The spiritual life is a journey of transformation,",
    "growing in holiness through grace, virtue, and prayer.",
  ],
  {
    style: "rounded",
    title: "Chapters 39-43: Prayer and Spiritual Growth",
    padding: 1,
    color: ColorSystem.hexToRgb("#F39C12"),
    maxWidth: 94,
  },
);
console.log("\n");

const spiritualStages = [
  { stage: "Purgative Way", focus: "Purification from sin", practices: "Repentance, mortification" },
  { stage: "Illuminative Way", focus: "Growth in virtue", practices: "Meditation, imitation of Christ" },
  { stage: "Unitive Way", focus: "Union with God", practices: "Contemplation, mystical prayer" },
];

TableRenderer.render(
  spiritualStages,
  [
    { key: "stage", label: "Stage", width: 18 },
    { key: "focus", label: "Focus", width: 24 },
    { key: "practices", label: "Spiritual Practices", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 8. THE THEOLOGICAL SYNTHESIS
// =============================================================================

ConsoleStyler.logSection("Integration: The Catholic Vision", "brightWhite");

const synthesisData = [
  { label: "Theological Virtues", value: 3 },
  { label: "Divine Persons (Trinity)", value: 3 },
  { label: "Sacraments", value: 7 },
  { label: "Gifts of the Spirit", value: 7 },
  { label: "Marks of the Church", value: 4 },
  { label: "Stages of Spiritual Life", value: 3 },
];

ChartRenderer.barChart(
  synthesisData.map((item) => ({ label: item.label, value: item.value })),
  {
    showValues: true,
    width: 40,
    color: ColorSystem.hexToRgb("#95A5A6"),
    title: "Structure of Catholic Theology",
  },
);
console.log("\n");

const integrationBar = new ProgressBar({
  total: 100,
  width: 52,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Integrating theological formation:");
const integrationSteps = [
  { name: "Faith as foundation", progress: 15 },
  { name: "Understanding the Trinity", progress: 25 },
  { name: "Encountering Christ in the Incarnation", progress: 40 },
  { name: "Receiving grace through the Sacraments", progress: 60 },
  { name: "Living in the Church", progress: 75 },
  { name: "Growing in prayer and holiness", progress: 90 },
  { name: "Union with God in charity", progress: 100 },
];

for (const step of integrationSteps) {
  integrationBar.update(step.progress);
  theologyLogger.info(`${step.name}...`);
  await sleep(280);
}
integrationBar.complete();
console.log("\n");

theologyLogger.success("Theological synthesis: Faith, sacraments, and charity unified in Christ");
console.log("\n");

// =============================================================================
// 9. CONCLUDING DOXOLOGY
// =============================================================================

ConsoleStyler.logSection("Concluding Doxology", "brightRed");

BoxRenderer.render(
  [
    "The Light of Christ Illuminates All Things",
    "",
    "Catholic theology is not abstract speculation,",
    "but a living encounter with the Triune God",
    "who has revealed himself definitively in Jesus Christ.",
    "",
    "Through faith, we receive the light of divine truth.",
    "Through the sacraments, we receive the life of grace.",
    "Through charity, we are united to God in love.",
    "",
    "The Catholic faith is a coherent vision of reality,",
    "ordered to the ultimate end: the Beatific Vision,",
    "when we shall see God face to face.",
    "",
    '"For now we see in a mirror dimly, but then face to face.',
    'Now I know in part; then I shall know fully,',
    'even as I have been fully known." (1 Corinthians 13:12)',
  ],
  {
    style: "bold",
    title: "Ad Majorem Dei Gloriam",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Gloria Patri, et Filio, et Spiritui Sancto",
  [139, 0, 0],
  [255, 215, 0],
  64,
);
console.log("\n");

ConsoleStyler.logGradient(
  "Lumen Christi - The Light of Christ",
  [255, 215, 0],
  [255, 255, 255],
  64,
);
console.log("\n");

// =============================================================================
// 10. SUMMARY & STUDY GUIDE
// =============================================================================

ConsoleStyler.logSection("Study Guide Summary", "brightGreen");

const bookStructure = [
  { part: "Part I", chapters: "1-14", topic: "Theological Virtues: Faith, Hope, Charity" },
  { part: "Part II", chapters: "15-19", topic: "The Holy Trinity" },
  { part: "Part III", chapters: "20-25", topic: "Christology & The Incarnation" },
  { part: "Part IV", chapters: "26-32", topic: "The Seven Sacraments" },
  { part: "Part V", chapters: "33-38", topic: "Ecclesiology: The Church" },
  { part: "Part VI", chapters: "39-43", topic: "Prayer & Spiritual Life" },
];

TableRenderer.render(
  bookStructure,
  [
    { key: "part", label: "Part", width: 10 },
    { key: "chapters", label: "Chapters", width: 12 },
    { key: "topic", label: "Topic", width: 48 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    "FOR FURTHER STUDY:",
    "",
    "• Catechism of the Catholic Church (CCC)",
    "• Summa Theologiae - St. Thomas Aquinas",
    "• Vatican II Documents (especially Lumen Gentium, Dei Verbum)",
    "• Papal Encyclicals (Fides et Ratio, Deus Caritas Est, Lumen Fidei)",
    "• Works of the Church Fathers (Augustine, Athanasius, Gregory)",
    "",
    "Fr. Thomas Joseph White, OP brings together:",
    "Scripture + Tradition + Magisterium + Thomistic Philosophy",
    "",
    "An accessible yet profound introduction to the Catholic faith,",
    "suitable for RCIA candidates, theology students, and all seeking",
    "to understand the coherence and beauty of Catholic doctrine.",
  ],
  {
    style: "double",
    title: "Resources for Continued Formation",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

theologyLogger.success("The Light of Christ animation lab completed successfully");
console.log("\n");

BoxRenderer.render(
  [
    "🕊",
    "",
    '"I am the light of the world. Whoever follows me will not walk',
    'in darkness, but will have the light of life." (John 8:12)',
    "",
    "May this introduction to the Catholic faith illuminate your journey",
    "toward deeper knowledge and love of God.",
    "",
    "Laus Deo Semper",
  ],
  {
    style: "rounded",
    title: "Benediction",
    padding: 1,
    color: ColorSystem.hexToRgb("#F1C40F"),
    maxWidth: 94,
  },
);
console.log("\n");
