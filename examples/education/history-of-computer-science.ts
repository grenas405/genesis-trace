#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * History of Computer Science
 *
 * An animated journey through the evolution of computing, from mechanical
 * calculators to artificial intelligence. Features:
 *   - Era-based timeline with visual progression
 *   - Tables of pioneers and their contributions
 *   - Charts showing technological growth
 *   - Animated transitions between eras
 *   - Key milestones highlighted in boxes
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  draculaTheme,
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
// TITLE BANNER
// =============================================================================

BannerRenderer.render({
  title: "HISTORY OF COMPUTER SCIENCE",
  subtitle: "From Mechanical Calculators to Artificial Intelligence",
  description: "A journey through 200 years of computational innovation",
  version: "Timeline v1.0",
  author: "GenesisTrace Chronicles",
  width: 94,
  style: "double",
  color: ColorSystem.codes.brightCyan,
});
console.log("\n");

// =============================================================================
// LOGGER INITIALIZATION
// =============================================================================

const logger = new Logger(
  new ConfigBuilder()
    .theme(draculaTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .build(),
);

logger.info("Initializing historical timeline visualization");
console.log("\n");

// =============================================================================
// ERA COLORS
// =============================================================================

const eraColors = {
  theoretical: ColorSystem.rgb(139, 90, 43), // Bronze/sepia for foundations
  dawn: ColorSystem.rgb(70, 130, 180), // Steel blue for early computers
  software: ColorSystem.codes.brightGreen, // Green for code
  personal: ColorSystem.codes.brightMagenta, // Magenta for personal computing
  internet: ColorSystem.codes.brightCyan, // Cyan for networking
  modern: ColorSystem.codes.brightYellow, // Yellow for AI/modern
};

// =============================================================================
// HELPER: ERA HEADER
// =============================================================================

function renderEraHeader(
  title: string,
  years: string,
  color: string,
): void {
  const headerLine = "═".repeat(90);
  console.log(ColorSystem.colorize(headerLine, color));
  console.log(
    ColorSystem.colorize(
      `  ${title}  •  ${years}`,
      ColorSystem.codes.bright,
    ),
  );
  console.log(ColorSystem.colorize(headerLine, color));
  console.log("");
}

// =============================================================================
// TIMELINE PROGRESS INDICATOR
// =============================================================================

const timeline = new ProgressBar({
  total: 6,
  width: 60,
  label: "Timeline Progress",
  showPercentage: true,
  colorize: true,
});

// =============================================================================
// ERA 1: THEORETICAL FOUNDATIONS (1830s - 1940s)
// =============================================================================

timeline.update(0);
await sleep(500);

renderEraHeader("ERA 1: THEORETICAL FOUNDATIONS", "1830s - 1940s", eraColors.theoretical);

const foundationsSpinner = new Spinner({
  message: "Loading foundational discoveries...",
  interval: 80,
});
foundationsSpinner.start();
await sleep(1200);
foundationsSpinner.succeed("Theoretical foundations compiled");
console.log("\n");

logger.info("The seeds of computation were planted by visionary mathematicians");

TableRenderer.render(
  [
    {
      year: 1837,
      pioneer: "Charles Babbage",
      contribution: "Analytical Engine",
      impact: "First general-purpose computer design",
    },
    {
      year: 1843,
      pioneer: "Ada Lovelace",
      contribution: "First Algorithm",
      impact: "World's first computer programmer",
    },
    {
      year: 1854,
      pioneer: "George Boole",
      contribution: "Boolean Algebra",
      impact: "Mathematical foundation for digital logic",
    },
    {
      year: 1936,
      pioneer: "Alan Turing",
      contribution: "Turing Machine",
      impact: "Theoretical model for computation",
    },
    {
      year: 1937,
      pioneer: "Claude Shannon",
      contribution: "Information Theory",
      impact: "Binary digit as unit of information",
    },
  ],
  [
    { key: "year", label: "Year", width: 8, align: "center" },
    { key: "pioneer", label: "Pioneer", width: 18 },
    { key: "contribution", label: "Contribution", width: 22 },
    { key: "impact", label: "Impact", width: 38 },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize('"We may say most aptly that the Analytical Engine', eraColors.theoretical),
    ColorSystem.colorize('weaves algebraical patterns just as the Jacquard', eraColors.theoretical),
    ColorSystem.colorize('loom weaves flowers and leaves."', eraColors.theoretical),
    "",
    ColorSystem.colorize("— Ada Lovelace, 1843", ColorSystem.codes.dim),
  ],
  {
    style: "rounded",
    title: "First Vision of Computing",
    color: eraColors.theoretical,
    padding: 1,
  },
);
console.log("\n");

timeline.update(1);
await sleep(800);

// =============================================================================
// ERA 2: DAWN OF ELECTRONIC COMPUTING (1940s - 1950s)
// =============================================================================

renderEraHeader("ERA 2: DAWN OF ELECTRONIC COMPUTING", "1940s - 1950s", eraColors.dawn);

const dawnSpinner = new Spinner({
  message: "Powering up vacuum tubes...",
  interval: 80,
});
dawnSpinner.start();
await sleep(1200);
dawnSpinner.succeed("Electronic computers online");
console.log("\n");

logger.info("The first electronic computers emerged from wartime necessity");
logger.success("ENIAC becomes operational at University of Pennsylvania");

TableRenderer.render(
  [
    {
      year: 1941,
      machine: "Z3 (Zuse)",
      location: "Germany",
      type: "Electromechanical",
      ops_sec: 5,
    },
    {
      year: 1943,
      machine: "Colossus",
      location: "UK (Bletchley Park)",
      type: "Electronic",
      ops_sec: 5000,
    },
    {
      year: 1945,
      machine: "ENIAC",
      location: "USA (UPenn)",
      type: "Electronic",
      ops_sec: 5000,
    },
    {
      year: 1949,
      machine: "EDSAC",
      location: "UK (Cambridge)",
      type: "Stored-program",
      ops_sec: 714,
    },
    {
      year: 1951,
      machine: "UNIVAC I",
      location: "USA (Commercial)",
      type: "Commercial",
      ops_sec: 1905,
    },
  ],
  [
    { key: "year", label: "Year", width: 6, align: "center" },
    { key: "machine", label: "Machine", width: 16 },
    { key: "location", label: "Location", width: 20 },
    { key: "type", label: "Type", width: 16 },
    {
      key: "ops_sec",
      label: "Ops/Sec",
      width: 10,
      align: "right",
      formatter: (v) => Formatter.number(v),
    },
  ],
  { showIndex: true },
);
console.log("\n");

logger.warning("ENIAC weighed 30 tons and consumed 150 kilowatts of power");

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightYellow}ENIAC Specifications:${ColorSystem.codes.reset}`,
    "",
    `• Weight: ${Formatter.number(30)} tons`,
    `• Vacuum tubes: ${Formatter.number(17468)}`,
    `• Power consumption: ${Formatter.number(150)} kW`,
    `• Floor space: ${Formatter.number(1800)} sq ft`,
    `• Cost: $${Formatter.number(487000)} (1946)`,
  ],
  {
    style: "double",
    title: "ENIAC (1945)",
    color: eraColors.dawn,
    padding: 1,
    minWidth: 50,
  },
);
console.log("\n");

// Von Neumann architecture diagram
console.log(ColorSystem.colorize("Von Neumann Architecture (1945):", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("┌─────────────────────────────────────────────────────────┐", eraColors.dawn));
console.log(ColorSystem.colorize("│                    CONTROL UNIT                         │", eraColors.dawn));
console.log(ColorSystem.colorize("│         ┌─────────┐    ┌─────────────────┐             │", eraColors.dawn));
console.log(ColorSystem.colorize("│         │   ALU   │◄──►│     MEMORY      │             │", eraColors.dawn));
console.log(ColorSystem.colorize("│         └─────────┘    │ (Data+Programs) │             │", eraColors.dawn));
console.log(ColorSystem.colorize("│              ▲         └─────────────────┘             │", eraColors.dawn));
console.log(ColorSystem.colorize("│              │                  ▲                      │", eraColors.dawn));
console.log(ColorSystem.colorize("│         ┌────┴────┐            │                       │", eraColors.dawn));
console.log(ColorSystem.colorize("│         │  I/O    │◄───────────┘                       │", eraColors.dawn));
console.log(ColorSystem.colorize("│         └─────────┘                                    │", eraColors.dawn));
console.log(ColorSystem.colorize("└─────────────────────────────────────────────────────────┘", eraColors.dawn));
console.log("\n");

timeline.update(2);
await sleep(800);

// =============================================================================
// ERA 3: SOFTWARE REVOLUTION (1950s - 1970s)
// =============================================================================

renderEraHeader("ERA 3: SOFTWARE REVOLUTION", "1950s - 1970s", eraColors.software);

const softwareSpinner = new Spinner({
  message: "Compiling high-level languages...",
  interval: 80,
});
softwareSpinner.start();
await sleep(1200);
softwareSpinner.succeed("Programming languages established");
console.log("\n");

logger.info("High-level languages transformed programming from art to engineering");

TableRenderer.render(
  [
    {
      year: 1957,
      language: "FORTRAN",
      creator: "John Backus (IBM)",
      paradigm: "Imperative",
      purpose: "Scientific computing",
    },
    {
      year: 1958,
      language: "LISP",
      creator: "John McCarthy (MIT)",
      paradigm: "Functional",
      purpose: "Artificial Intelligence",
    },
    {
      year: 1959,
      language: "COBOL",
      creator: "Grace Hopper et al.",
      paradigm: "Imperative",
      purpose: "Business applications",
    },
    {
      year: 1964,
      language: "BASIC",
      creator: "Kemeny & Kurtz",
      paradigm: "Imperative",
      purpose: "Education",
    },
    {
      year: 1970,
      language: "Pascal",
      creator: "Niklaus Wirth",
      paradigm: "Structured",
      purpose: "Teaching/Systems",
    },
    {
      year: 1972,
      language: "C",
      creator: "Dennis Ritchie",
      paradigm: "Procedural",
      purpose: "Systems programming",
    },
  ],
  [
    { key: "year", label: "Year", width: 6, align: "center" },
    { key: "language", label: "Language", width: 10 },
    { key: "creator", label: "Creator", width: 22 },
    { key: "paradigm", label: "Paradigm", width: 12 },
    { key: "purpose", label: "Primary Purpose", width: 22 },
  ],
  { showIndex: true },
);
console.log("\n");

logger.success("Grace Hopper coins the term 'debugging' after removing a moth from Mark II");

BoxRenderer.render(
  [
    ColorSystem.colorize('"Humans are allergic to change. They love to say,', eraColors.software),
    ColorSystem.colorize('"We\'ve always done it this way." I try to fight that.', eraColors.software),
    ColorSystem.colorize("That's why I have a clock on my wall that runs counter-clockwise.\"", eraColors.software),
    "",
    ColorSystem.colorize("— Rear Admiral Grace Hopper", ColorSystem.codes.dim),
  ],
  {
    style: "rounded",
    title: "The Queen of Code",
    color: eraColors.software,
    padding: 1,
  },
);
console.log("\n");

// Operating Systems Timeline
console.log(ColorSystem.colorize("Operating Systems Evolution:", ColorSystem.codes.bright));
ChartRenderer.barChart(
  [
    { label: "1956 GM-NAA I/O", value: 1 },
    { label: "1964 OS/360", value: 3 },
    { label: "1969 UNIX", value: 8 },
    { label: "1971 Intel 4004", value: 5 },
    { label: "1973 CP/M", value: 4 },
  ],
  { showValues: true, width: 40, color: eraColors.software },
);
console.log(ColorSystem.colorize("  (Relative historical impact score)", ColorSystem.codes.dim));
console.log("\n");

timeline.update(3);
await sleep(800);

// =============================================================================
// ERA 4: PERSONAL COMPUTING (1970s - 1990s)
// =============================================================================

renderEraHeader("ERA 4: PERSONAL COMPUTING REVOLUTION", "1970s - 1990s", eraColors.personal);

const pcSpinner = new Spinner({
  message: "Booting personal computers...",
  interval: 80,
});
pcSpinner.start();
await sleep(1200);
pcSpinner.succeed("Personal computing era initialized");
console.log("\n");

logger.info("Computers moved from data centers to desktops");
logger.success("Apple II launches the home computer revolution (1977)");

TableRenderer.render(
  [
    {
      year: 1975,
      event: "Altair 8800",
      company: "MITS",
      significance: "First personal computer kit",
    },
    {
      year: 1976,
      event: "Apple I",
      company: "Apple",
      significance: "Wozniak's hand-built computer",
    },
    {
      year: 1977,
      event: "Apple II",
      company: "Apple",
      significance: "First mass-produced PC",
    },
    {
      year: 1981,
      event: "IBM PC",
      company: "IBM",
      significance: "Established PC standard",
    },
    {
      year: 1984,
      event: "Macintosh",
      company: "Apple",
      significance: "GUI for the masses",
    },
    {
      year: 1985,
      event: "Windows 1.0",
      company: "Microsoft",
      significance: "Windows begins",
    },
    {
      year: 1991,
      event: "Linux 0.01",
      company: "Linus Torvalds",
      significance: "Open-source OS revolution",
    },
  ],
  [
    { key: "year", label: "Year", width: 6, align: "center" },
    { key: "event", label: "Event", width: 14 },
    { key: "company", label: "Company/Creator", width: 18 },
    { key: "significance", label: "Significance", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// Personal Computer Growth Chart
console.log(ColorSystem.colorize("PC Sales Growth (millions):", ColorSystem.codes.bright));
ChartRenderer.barChart(
  [
    { label: "1980", value: 1 },
    { label: "1985", value: 14 },
    { label: "1990", value: 54 },
    { label: "1995", value: 115 },
    { label: "2000", value: 282 },
  ],
  { showValues: true, width: 50, color: eraColors.personal },
);
console.log("\n");

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightMagenta}The Graphical Revolution:${ColorSystem.codes.reset}`,
    "",
    "1973: Xerox PARC develops the Alto with GUI",
    "1979: Steve Jobs visits PARC",
    "1984: Macintosh brings GUI to consumers",
    "",
    ColorSystem.colorize('"Good artists copy, great artists steal."', ColorSystem.codes.dim),
    ColorSystem.colorize("— Picasso (quoted by Steve Jobs)", ColorSystem.codes.dim),
  ],
  {
    style: "double",
    title: "The Xerox PARC Connection",
    color: eraColors.personal,
    padding: 1,
  },
);
console.log("\n");

timeline.update(4);
await sleep(800);

// =============================================================================
// ERA 5: THE INTERNET AGE (1990s - 2010s)
// =============================================================================

renderEraHeader("ERA 5: THE INTERNET AGE", "1990s - 2010s", eraColors.internet);

const internetSpinner = new Spinner({
  message: "Connecting to the World Wide Web...",
  interval: 80,
});
internetSpinner.start();
await sleep(1200);
internetSpinner.succeed("Global network established");
console.log("\n");

logger.info("Tim Berners-Lee invents the World Wide Web at CERN (1989)");
logger.success("The internet transforms human communication forever");

TableRenderer.render(
  [
    {
      year: 1969,
      milestone: "ARPANET",
      description: "First packet-switched network (4 nodes)",
    },
    {
      year: 1983,
      milestone: "TCP/IP",
      description: "Standard internet protocol adopted",
    },
    {
      year: 1989,
      milestone: "WWW Proposal",
      description: "Tim Berners-Lee's vision document",
    },
    {
      year: 1993,
      milestone: "Mosaic Browser",
      description: "First popular graphical web browser",
    },
    {
      year: 1994,
      milestone: "Amazon/Yahoo",
      description: "E-commerce and search portals emerge",
    },
    {
      year: 1995,
      milestone: "JavaScript",
      description: "Brendan Eich creates JS in 10 days",
    },
    {
      year: 1998,
      milestone: "Google",
      description: "PageRank revolutionizes search",
    },
    {
      year: 2004,
      milestone: "Facebook",
      description: "Social networking goes mainstream",
    },
    {
      year: 2007,
      milestone: "iPhone",
      description: "Mobile internet becomes ubiquitous",
    },
  ],
  [
    { key: "year", label: "Year", width: 6, align: "center" },
    { key: "milestone", label: "Milestone", width: 16 },
    { key: "description", label: "Description", width: 42 },
  ],
  { showIndex: true },
);
console.log("\n");

// Internet Growth Statistics
console.log(ColorSystem.colorize("Internet Users Worldwide (millions):", ColorSystem.codes.bright));
ChartRenderer.barChart(
  [
    { label: "1995", value: 16 },
    { label: "2000", value: 413 },
    { label: "2005", value: 1018 },
    { label: "2010", value: 1971 },
    { label: "2015", value: 3185 },
  ],
  { showValues: true, width: 50, color: eraColors.internet },
);
console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize('"The Web as I envisaged it, we have not seen yet.', eraColors.internet),
    ColorSystem.colorize("The future is still so much bigger than the past.\"", eraColors.internet),
    "",
    ColorSystem.colorize("— Sir Tim Berners-Lee", ColorSystem.codes.dim),
  ],
  {
    style: "rounded",
    title: "Father of the World Wide Web",
    color: eraColors.internet,
    padding: 1,
  },
);
console.log("\n");

timeline.update(5);
await sleep(800);

// =============================================================================
// ERA 6: THE MODERN ERA - AI & CLOUD (2010s - Present)
// =============================================================================

renderEraHeader("ERA 6: THE MODERN ERA - AI & CLOUD", "2010s - Present", eraColors.modern);

const modernSpinner = new Spinner({
  message: "Training neural networks...",
  interval: 80,
});
modernSpinner.start();
await sleep(1200);
modernSpinner.succeed("Artificial intelligence awakened");
console.log("\n");

logger.info("Deep learning and cloud computing transform every industry");
logger.success("Large Language Models achieve human-level performance on many tasks");

TableRenderer.render(
  [
    {
      year: 2006,
      breakthrough: "AWS Launch",
      field: "Cloud",
      impact: "Infrastructure as a service",
    },
    {
      year: 2012,
      breakthrough: "AlexNet",
      field: "Deep Learning",
      impact: "ImageNet breakthrough",
    },
    {
      year: 2014,
      breakthrough: "GANs",
      field: "Generative AI",
      impact: "Neural image generation",
    },
    {
      year: 2016,
      breakthrough: "AlphaGo",
      field: "Game AI",
      impact: "Defeats world Go champion",
    },
    {
      year: 2017,
      breakthrough: "Transformer",
      field: "NLP",
      impact: '"Attention Is All You Need"',
    },
    {
      year: 2020,
      breakthrough: "GPT-3",
      field: "LLMs",
      impact: "175B parameter language model",
    },
    {
      year: 2022,
      breakthrough: "ChatGPT",
      field: "Conversational AI",
      impact: "AI goes mainstream",
    },
    {
      year: 2023,
      breakthrough: "GPT-4/Claude",
      field: "Multimodal AI",
      impact: "Human-level reasoning",
    },
  ],
  [
    { key: "year", label: "Year", width: 6, align: "center" },
    { key: "breakthrough", label: "Breakthrough", width: 14 },
    { key: "field", label: "Field", width: 16 },
    { key: "impact", label: "Impact", width: 32 },
  ],
  { showIndex: true },
);
console.log("\n");

// AI Model Parameters Growth
console.log(ColorSystem.colorize("AI Model Size Growth (parameters):", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  Exponential growth in model scale:", ColorSystem.codes.dim));
console.log("");
const parameterData = [
  { label: "2018 BERT", value: "340M", bar: 2 },
  { label: "2019 GPT-2", value: "1.5B", bar: 5 },
  { label: "2020 GPT-3", value: "175B", bar: 35 },
  { label: "2023 GPT-4", value: "~1.8T", bar: 50 },
];
for (const item of parameterData) {
  const bar = "█".repeat(item.bar);
  console.log(
    `  ${ColorSystem.colorize(item.label.padEnd(14), ColorSystem.codes.bright)} ${
      ColorSystem.colorize(bar, eraColors.modern)
    } ${item.value}`,
  );
}
console.log("\n");

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightYellow}The AI Revolution in Numbers:${ColorSystem.codes.reset}`,
    "",
    `• Cloud market size (2024): $${Formatter.number(600)}+ billion`,
    `• AI market size (2024): $${Formatter.number(184)} billion`,
    `• ChatGPT users (first 2 months): ${Formatter.number(100)} million`,
    `• GitHub Copilot suggestions accepted: ${Formatter.number(30)}%+`,
    "",
    ColorSystem.colorize("We are living through a paradigm shift.", ColorSystem.codes.dim),
  ],
  {
    style: "double",
    title: "Current State of Computing",
    color: eraColors.modern,
    padding: 1,
  },
);
console.log("\n");

timeline.update(6);
timeline.complete("Timeline complete!");
console.log("\n");

// =============================================================================
// SUMMARY STATISTICS
// =============================================================================

console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.bright));
console.log(
  ColorSystem.colorize(
    "  COMPUTING EVOLUTION: KEY METRICS",
    ColorSystem.codes.bright,
  ),
);
console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.bright));
console.log("\n");

TableRenderer.renderKeyValue([
  { label: "Years Covered", value: "~200 years (1830s - 2024)" },
  { label: "Pioneers Featured", value: "30+ individuals" },
  { label: "Computing Eras", value: "6 major periods" },
  { label: "Processing Power Growth", value: "10^15x (ENIAC to modern GPU)" },
  { label: "Storage Cost Decrease", value: "10^9x per byte" },
  { label: "Internet Users", value: "5+ billion worldwide" },
  { label: "Lines of Code (all software)", value: "Trillions" },
]);
console.log("\n");

// =============================================================================
// CLOSING QUOTE
// =============================================================================

const closingQuotes = [
  {
    text: '"The computer was born to solve problems that did not exist before."',
    author: "Bill Gates",
  },
  {
    text: '"Any sufficiently advanced technology is indistinguishable from magic."',
    author: "Arthur C. Clarke",
  },
  {
    text: '"The question of whether a computer can think is no more interesting than the question of whether a submarine can swim."',
    author: "Edsger Dijkstra",
  },
];

const randomQuote = closingQuotes[Math.floor(Math.random() * closingQuotes.length)];

BoxRenderer.render(
  [
    ColorSystem.colorize(randomQuote.text, ColorSystem.codes.bright),
    "",
    ColorSystem.colorize(`— ${randomQuote.author}`, ColorSystem.codes.dim),
  ],
  {
    style: "double",
    title: "Closing Thought",
    color: ColorSystem.codes.brightCyan,
    padding: 2,
    margin: 1,
  },
);
console.log("\n");

// =============================================================================
// FINAL MESSAGE
// =============================================================================

logger.success("History of Computer Science presentation complete");
logger.info("The journey continues... What will YOU contribute?");
console.log("\n");

// Animated ending
const endMessage = "COMPUTING: FROM DREAMS TO REALITY";
for (let i = 0; i <= endMessage.length; i++) {
  const visible = endMessage.slice(0, i);
  const cursor = i < endMessage.length ? "█" : "";
  Deno.stdout.writeSync(
    new TextEncoder().encode(
      `\r  ${ColorSystem.colorize(visible + cursor, ColorSystem.codes.brightCyan)}  `,
    ),
  );
  await sleep(60);
}
console.log("\n\n");
