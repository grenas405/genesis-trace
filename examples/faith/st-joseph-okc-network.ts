#!/usr/bin/env -S deno run --allow-env

/**
 * St. Joseph Catholic Church - Oklahoma City
 * Decentralized Catholic Parish Network Demo
 *
 * A GenesisTrace demonstration showcasing a decentralized network of
 * Catholic churches in the Archdiocese of Oklahoma City, featuring
 * sacramental record management, parish communication, and
 * Confirmation preparation tracking.
 *
 * Features:
 *   - Decentralized parish network topology
 *   - Sacramental records distributed ledger
 *   - Confirmation candidate tracking
 *   - Parish-to-parish secure messaging
 *   - Diocese-wide event coordination
 *
 * Run with:
 *    deno run --allow-env examples/faith/st-joseph-okc-network.ts
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
// ARCHDIOCESE OF OKLAHOMA CITY - DECENTRALIZED PARISH NETWORK
// =============================================================================

BannerRenderer.render({
  title: "ARCHDIOCESE OF OKLAHOMA CITY",
  subtitle: "Decentralized Catholic Parish Network",
  description: "St. Joseph Parish - Confirmation Preparation A.D. 2025",
  version: "genesis-v1.0",
  author: "Powered by GenesisTrace",
  width: 98,
  color: ColorSystem.hexToRgb("#8B0000"), // Deep red - liturgical color
});
console.log("\n");

// =============================================================================
// 1. PARISH NETWORK INITIALIZATION
// =============================================================================

ConsoleStyler.logSection("Network Node Initialization", "brightCyan", "double");

const networkLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const initSpinner = new Spinner({ message: "Initializing parish network nodes..." });
initSpinner.start();
await sleep(800);
initSpinner.update("Establishing secure connections to Archdiocese...");
await sleep(600);
initSpinner.update("Synchronizing sacramental records ledger...");
await sleep(700);
initSpinner.succeed("Parish network initialized successfully");
console.log("\n");

// =============================================================================
// 2. PARISH NETWORK TOPOLOGY
// =============================================================================

ConsoleStyler.logSection("Parish Network Topology", "brightYellow");

const parishes = [
  {
    name: "St. Joseph Catholic Church",
    location: "Oklahoma City, OK",
    nodeId: "STJOSEPH-OKC-001",
    status: "ACTIVE",
    role: "Primary Node",
  },
  {
    name: "Cathedral of Our Lady of Perpetual Help",
    location: "Oklahoma City, OK",
    nodeId: "CATHEDRAL-OKC-000",
    status: "ACTIVE",
    role: "Metropolitan Hub",
  },
  {
    name: "St. Francis of Assisi",
    location: "Oklahoma City, OK",
    nodeId: "STFRANCIS-OKC-002",
    status: "ACTIVE",
    role: "Peer Node",
  },
  {
    name: "St. Eugene Catholic Church",
    location: "Oklahoma City, OK",
    nodeId: "STEUGENE-OKC-003",
    status: "ACTIVE",
    role: "Peer Node",
  },
  {
    name: "Christ the King Catholic Church",
    location: "Oklahoma City, OK",
    nodeId: "CTK-OKC-004",
    status: "ACTIVE",
    role: "Peer Node",
  },
  {
    name: "St. Charles Borromeo",
    location: "Oklahoma City, OK",
    nodeId: "STCHARLES-OKC-005",
    status: "ACTIVE",
    role: "Peer Node",
  },
  {
    name: "Epiphany of the Lord",
    location: "Oklahoma City, OK",
    nodeId: "EPIPHANY-OKC-006",
    status: "SYNCING",
    role: "Peer Node",
  },
];

TableRenderer.render(
  parishes,
  [
    { key: "name", label: "Parish", width: 38 },
    { key: "location", label: "Location", width: 18 },
    { key: "nodeId", label: "Node ID", width: 20 },
    {
      key: "status",
      label: "Status",
      width: 10,
      formatter: (val: string) =>
        val === "ACTIVE"
          ? ColorSystem.colorize("ACTIVE", ColorSystem.codes.green)
          : ColorSystem.colorize("SYNCING", ColorSystem.codes.yellow),
    },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 3. ST. JOSEPH PARISH DETAILS
// =============================================================================

ConsoleStyler.logSection("St. Joseph Catholic Church - Primary Node", "brightGreen");

BoxRenderer.render(
  [
    "St. Joseph Catholic Church",
    "307 NW 4th Street",
    "Oklahoma City, OK 73102",
    "",
    "Est. 1889 - Serving the faithful for over 135 years",
    "",
    "Pastor: [Parish Pastor]",
    "Deacon: [Parish Deacon]",
    "",
    "Mass Schedule:",
    "  Sunday: 8:00 AM, 10:00 AM, 12:00 PM (Spanish)",
    "  Saturday Vigil: 5:00 PM",
    "  Weekdays: 7:30 AM, 12:10 PM",
    "",
    "Confession: Saturday 3:30 PM - 4:30 PM",
  ],
  {
    style: "double",
    title: "Parish Information",
    padding: 1,
    color: ColorSystem.hexToRgb("#1E90FF"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 4. DECENTRALIZED SACRAMENTAL RECORDS
// =============================================================================

ConsoleStyler.logSection("Distributed Sacramental Records Ledger", "brightCyan");

const sacramentalLogger = networkLogger.child("sacraments");

BoxRenderer.render(
  [
    "The Decentralized Sacramental Records System enables:",
    "",
    "  - Immutable record of Baptism, Confirmation, Marriage",
    "  - Cross-parish verification without central authority",
    "  - Privacy-preserving credential verification",
    "  - Seamless transfer of records between parishes",
    "  - Historical preservation for future generations",
  ],
  {
    style: "rounded",
    title: "System Overview",
    padding: 1,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("\n");

const sacramentTypes = [
  { sacrament: "Baptism", records: 12847, verified: 12845, pending: 2 },
  { sacrament: "First Communion", records: 9523, verified: 9521, pending: 2 },
  { sacrament: "Confirmation", records: 7892, verified: 7890, pending: 2 },
  { sacrament: "Marriage", records: 4521, verified: 4520, pending: 1 },
  { sacrament: "Holy Orders", records: 87, verified: 87, pending: 0 },
];

TableRenderer.render(
  sacramentTypes,
  [
    { key: "sacrament", label: "Sacrament", width: 18 },
    { key: "records", label: "Total Records", width: 14 },
    { key: "verified", label: "Verified", width: 12 },
    {
      key: "pending",
      label: "Pending",
      width: 10,
      formatter: (val: number) =>
        val > 0
          ? ColorSystem.colorize(String(val), ColorSystem.codes.yellow)
          : ColorSystem.colorize(String(val), ColorSystem.codes.green),
    },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 5. CONFIRMATION PREPARATION PROGRAM
// =============================================================================

ConsoleStyler.logSection("Confirmation Preparation - Class of 2025", "brightMagenta");

const confirmationLogger = networkLogger.child("confirmation");

BoxRenderer.render(
  [
    '"Be sealed with the gift of the Holy Spirit."',
    "",
    "The Sacrament of Confirmation completes Baptismal grace,",
    "strengthening the faithful with the seven gifts of the Holy Spirit:",
    "",
    "  Wisdom - Understanding - Counsel - Fortitude",
    "  Knowledge - Piety - Fear of the Lord",
  ],
  {
    style: "double",
    title: "Catechism of the Catholic Church 1302-1303",
    padding: 1,
    color: ColorSystem.hexToRgb("#E74C3C"),
    maxWidth: 94,
  },
);
console.log("\n");

const preparationModules = [
  { module: "Introduction to the Holy Spirit", status: "COMPLETE", progress: 100 },
  { module: "The Seven Gifts of the Spirit", status: "COMPLETE", progress: 100 },
  { module: "The Twelve Fruits of the Spirit", status: "COMPLETE", progress: 100 },
  { module: "History of Confirmation", status: "COMPLETE", progress: 100 },
  { module: "Choosing a Confirmation Name", status: "COMPLETE", progress: 100 },
  { module: "The Rite of Confirmation", status: "IN PROGRESS", progress: 75 },
  { module: "Living as a Confirmed Catholic", status: "PENDING", progress: 0 },
  { module: "Retreat & Final Preparation", status: "PENDING", progress: 0 },
];

confirmationLogger.info("Loading Confirmation preparation progress...");
await sleep(300);

TableRenderer.render(
  preparationModules,
  [
    { key: "module", label: "Preparation Module", width: 36 },
    {
      key: "status",
      label: "Status",
      width: 14,
      formatter: (val: string) => {
        if (val === "COMPLETE") return ColorSystem.colorize(val, ColorSystem.codes.green);
        if (val === "IN PROGRESS") return ColorSystem.colorize(val, ColorSystem.codes.cyan);
        return ColorSystem.colorize(val, ColorSystem.codes.dim);
      },
    },
    {
      key: "progress",
      label: "Progress",
      width: 12,
      formatter: (val: number) => {
        const bar = "█".repeat(Math.floor(val / 10)) + "░".repeat(10 - Math.floor(val / 10));
        return `${bar} ${val}%`;
      },
    },
  ],
  { showIndex: true },
);
console.log("\n");

// Overall progress
const totalProgress = preparationModules.reduce((sum, m) => sum + m.progress, 0);
const overallProgress = Math.round(totalProgress / preparationModules.length);

const progressBar = new ProgressBar({
  total: 100,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Overall Confirmation Preparation Progress:");
for (let i = 0; i <= overallProgress; i += 5) {
  progressBar.update(i);
  await sleep(50);
}
progressBar.complete();
console.log("\n");

confirmationLogger.success(`Preparation ${overallProgress}% complete - On track for Confirmation`);
console.log("\n");

// =============================================================================
// 6. CONFIRMATION SAINT SELECTION
// =============================================================================

ConsoleStyler.logSection("Confirmation Saint Selection", "brightYellow");

BoxRenderer.render(
  [
    "Choosing a Confirmation Name",
    "",
    "Candidates select the name of a saint who will serve as their",
    "patron and intercessor. This saint becomes a spiritual companion",
    "and model for living the Christian life.",
    "",
    "Popular Confirmation Saints in the Archdiocese:",
  ],
  {
    style: "rounded",
    title: "Tradition of the Church",
    padding: 1,
    color: ColorSystem.hexToRgb("#F1C40F"),
    maxWidth: 94,
  },
);
console.log("\n");

const confirmationSaints = [
  { saint: "St. Joseph", feast: "March 19", patronage: "Workers, Fathers, the Church" },
  { saint: "St. Therese of Lisieux", feast: "October 1", patronage: "Missions, Florists" },
  { saint: "St. Francis of Assisi", feast: "October 4", patronage: "Animals, Environment" },
  { saint: "St. John Paul II", feast: "October 22", patronage: "World Youth Day, Families" },
  { saint: "St. Thomas Aquinas", feast: "January 28", patronage: "Students, Scholars" },
  { saint: "St. Sebastian", feast: "January 20", patronage: "Athletes, Soldiers" },
  { saint: "St. Kateri Tekakwitha", feast: "July 14", patronage: "Ecology, Native Americans" },
  { saint: "St. Maximilian Kolbe", feast: "August 14", patronage: "Pro-life, Journalists" },
];

TableRenderer.render(
  confirmationSaints,
  [
    { key: "saint", label: "Saint", width: 24 },
    { key: "feast", label: "Feast Day", width: 14 },
    { key: "patronage", label: "Patronage", width: 34 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 7. PARISH NETWORK COMMUNICATION
// =============================================================================

ConsoleStyler.logSection("Parish Network Communication Protocol", "brightBlue");

const commLogger = networkLogger.child("network");

const networkMessages = [
  { from: "CATHEDRAL-OKC-000", to: "ALL NODES", type: "BROADCAST", message: "Chrism Mass scheduled - Holy Thursday" },
  { from: "STJOSEPH-OKC-001", to: "CATHEDRAL-OKC-000", type: "REQUEST", message: "Confirmation date verification request" },
  { from: "CATHEDRAL-OKC-000", to: "STJOSEPH-OKC-001", type: "CONFIRM", message: "Bishop's schedule confirmed for Confirmation" },
  { from: "STEUGENE-OKC-003", to: "STJOSEPH-OKC-001", type: "TRANSFER", message: "Baptismal record transfer - Candidate #2847" },
  { from: "STJOSEPH-OKC-001", to: "STEUGENE-OKC-003", type: "ACK", message: "Record received and verified" },
];

const msgBar = new ProgressBar({
  total: networkMessages.length,
  width: 40,
  colorize: true,
  showValue: false,
});

console.log("Network Message Log:");
console.log("");

for (let i = 0; i < networkMessages.length; i++) {
  const msg = networkMessages[i];
  const typeColor = msg.type === "BROADCAST" ? ColorSystem.codes.magenta :
                    msg.type === "REQUEST" ? ColorSystem.codes.yellow :
                    msg.type === "CONFIRM" ? ColorSystem.codes.green :
                    msg.type === "TRANSFER" ? ColorSystem.codes.cyan :
                    ColorSystem.codes.blue;

  commLogger.info(
    `[${ColorSystem.colorize(msg.type, typeColor)}] ${msg.from} -> ${msg.to}`,
    { message: msg.message }
  );
  msgBar.update(i + 1);
  await sleep(400);
}
msgBar.complete();
console.log("\n");

// =============================================================================
// 8. DIOCESE STATISTICS
// =============================================================================

ConsoleStyler.logSection("Archdiocese of Oklahoma City - Statistics", "brightWhite");

const dioceseStats = [
  { label: "Parishes", value: 108 },
  { label: "Missions", value: 26 },
  { label: "Catholic Schools", value: 21 },
  { label: "Registered Catholics", value: 125000 },
  { label: "Confirmations (2024)", value: 1847 },
  { label: "Network Nodes Active", value: 96 },
];

ChartRenderer.barChart(
  dioceseStats.map((s) => ({ label: s.label, value: s.value })),
  {
    showValues: true,
    width: 45,
    color: ColorSystem.hexToRgb("#3498DB"),
  },
);
console.log("\n");

// =============================================================================
// 9. UPCOMING CONFIRMATION CEREMONY
// =============================================================================

ConsoleStyler.logSection("Confirmation Ceremony Details", "brightRed");

BoxRenderer.render(
  [
    "SACRAMENT OF CONFIRMATION",
    "",
    "Parish: St. Joseph Catholic Church",
    "Address: 307 NW 4th Street, Oklahoma City, OK",
    "",
    "Celebrant: Most Reverend [Archbishop Name]",
    "           Archbishop of Oklahoma City",
    "",
    "The faithful are invited to join in prayer for",
    "all Confirmation candidates as they receive",
    "the fullness of the Holy Spirit.",
    "",
    "\"Come, Holy Spirit, fill the hearts of your faithful",
    "and kindle in them the fire of your love.\"",
  ],
  {
    style: "double",
    title: "Ad Majorem Dei Gloriam",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 10. NETWORK CONSENSUS & VERIFICATION
// =============================================================================

ConsoleStyler.logSection("Network Consensus Protocol", "brightGreen");

const consensusLogger = networkLogger.child("consensus");

const verificationSteps = [
  "Initiating distributed verification protocol...",
  "Querying peer nodes for sacramental record validation...",
  "Cathedral hub confirming Bishop's delegation authority...",
  "Cross-referencing baptismal records across network...",
  "Validating sponsor credentials and eligibility...",
  "Recording confirmation preparation completion status...",
  "Generating immutable confirmation certificate hash...",
  "Broadcasting verification complete to all nodes...",
];

const verifyBar = new ProgressBar({
  total: verificationSteps.length,
  width: 48,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < verificationSteps.length; i++) {
  verifyBar.update(i + 1);
  consensusLogger.info(verificationSteps[i]);
  await sleep(350);
}
verifyBar.complete();
console.log("\n");

consensusLogger.success("All network nodes have reached consensus");
console.log("\n");

// =============================================================================
// 11. CONFIRMATION RECORD PREVIEW
// =============================================================================

ConsoleStyler.logSection("Confirmation Record - Preview", "brightCyan");

BoxRenderer.render(
  [
    "SACRAMENTAL RECORD - CONFIRMATION",
    "═══════════════════════════════════════════════",
    "",
    "Record Type:        CONFIRMATION",
    "Parish:             St. Joseph Catholic Church",
    "Diocese:            Archdiocese of Oklahoma City",
    "Status:             PENDING CEREMONY",
    "",
    "Baptism Verified:   YES (Cross-parish validated)",
    "Preparation:        COMPLETE",
    "Sponsor:            VERIFIED",
    "",
    "Network Hash:       [Generated upon completion]",
    "Witnesses:          All network peer nodes",
    "",
    "═══════════════════════════════════════════════",
    "This record will be permanently inscribed upon",
    "reception of the Sacrament of Confirmation.",
  ],
  {
    style: "bold",
    title: "Distributed Ledger Record",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 12. CONCLUDING BLESSING
// =============================================================================

ConsoleStyler.logSection("Blessing of Confirmation Candidates", "brightMagenta");

const blessingLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const blessing = [
  "Almighty God, Father of our Lord Jesus Christ,",
  "who brought these your servants to new birth",
  "by water and the Holy Spirit,",
  "freeing them from sin:",
  "send upon them, O Lord, the Holy Spirit, the Paraclete;",
  "give them the spirit of wisdom and understanding,",
  "the spirit of counsel and fortitude,",
  "the spirit of knowledge and piety;",
  "fill them with the spirit of the fear of the Lord.",
  "Through Christ our Lord. Amen.",
];

const blessingBar = new ProgressBar({
  total: blessing.length,
  width: 44,
  colorize: true,
  showValue: false,
});

for (let i = 0; i < blessing.length; i++) {
  blessingBar.update(i + 1);
  blessingLogger.info(blessing[i]);
  await sleep(400);
}
blessingBar.complete();
console.log("\n");

// =============================================================================
// FINAL SUMMARY
// =============================================================================

BoxRenderer.render(
  [
    "DECENTRALIZED CATHOLIC PARISH NETWORK",
    "",
    "This demonstration showcases how modern distributed",
    "systems technology can serve the mission of the Church:",
    "",
    "  - Preserving sacramental records with integrity",
    "  - Enabling seamless parish-to-parish coordination",
    "  - Supporting candidates in sacramental preparation",
    "  - Maintaining communion across the Archdiocese",
    "",
    "\"Where two or three gather in my name,",
    " there am I with them.\" - Matthew 18:20",
    "",
    "May all who are confirmed be strengthened by the Holy Spirit",
    "to be witnesses of Christ in the world.",
    "",
    "St. Joseph, Patron of the Universal Church, pray for us!",
  ],
  {
    style: "double",
    title: "Deo Gratias",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Veni, Sancte Spiritus - Come, Holy Spirit",
  [139, 0, 0],
  [255, 215, 0],
  60,
);
console.log("\n");

networkLogger.success("Parish network demo completed successfully");
console.log("\n");
