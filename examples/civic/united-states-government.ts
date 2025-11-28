#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * United States Government Showcase
 *
 * A comprehensive scenario demonstrating how GenesisTrace can orchestrate
 * complex governmental telemetry, strategy dashboards, and ceremonial moments.
 *
 * Features:
 *   • Banner + box renderers for national branding and constitutional text
 *   • Logger with theme + file plugin for structured institutional logging
 *   • Spinners and multi-stage progress bars for policy lifecycles
 *   • Tables highlighting branches, cabinet agencies, and readiness signals
 *   • Bar, line, and pie charts for budget, readiness, and strategic metrics
 *   • Extensive use of the color system and formatter utilities
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  FileLoggerPlugin,
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
// 1. NATIONAL BANNER
// =============================================================================

BannerRenderer.render({
  title: "🇺🇸 UNITED STATES GOVERNMENT LAB",
  subtitle: "E pluribus unum • From many, one",
  description: "Coordinating the executive, legislative, and judicial instruments of the republic",
  version: "Est. 1789 • Constitution in Force",
  author: "Office of the Federal Chief Information Officer",
  width: 120,
  color: ColorSystem.codes.brightBlue,
});
console.log("\n");

// =============================================================================
// 2. LOGGER INITIALIZATION
// =============================================================================

console.log(ColorSystem.colorize("━━━ Federal Telemetry Activation ━━━", ColorSystem.codes.bright));
console.log();

const federalLogger = new Logger(
  new ConfigBuilder()
    .namespace("usa.gov")
    .theme(neonTheme)
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(75)
    .plugin(new FileLoggerPlugin({
      filepath: "./logs/united-states-government.log",
      format: "text",
    }))
    .build(),
);

federalLogger.info("National governance showcase initialized");
federalLogger.success("Neon theme + file logging configured for institutional telemetry");
federalLogger.debug("Operational Context", {
  capital: "Washington, DC",
  states: 50,
  federalEmployees: "4.2M (civilian + uniformed)",
  motto: "In God We Trust",
});
console.log("\n");

// =============================================================================
// 3. CONSTITUTIONAL VALUES SPINNER + BOX
// =============================================================================

console.log(ColorSystem.colorize("━━━ Constitutional Foundations ━━━", ColorSystem.codes.bright));
console.log();

const oathSpinner = new Spinner({
  message: "Affirming Article II oath...",
  frames: ["🦅", "⭐", "⚖️", "🛡️"],
  interval: 140,
});

const foundingPrinciples = [
  "Establish Justice across all jurisdictions",
  "Insure domestic Tranquility between the states",
  "Provide for the common Defence across land, sea, and space",
  "Promote the general Welfare with resilient infrastructure",
  "Secure the Blessings of Liberty for every generation",
];

oathSpinner.start();
for (const principle of foundingPrinciples) {
  oathSpinner.update(principle);
  federalLogger.debug("Foundational principle affirmed", { principle });
  await sleep(700);
}
oathSpinner.succeed("Constitutional oath affirmed and archived in journal");
console.log();

BoxRenderer.render(
  [
    "We the People of the United States, in Order to form a more perfect Union,",
    "establish Justice, insure domestic Tranquility, provide for the common defence,",
    "promote the general Welfare, and secure the Blessings of Liberty to ourselves",
    "and our Posterity, do ordain and establish this Constitution for the United",
    "States of America.",
  ].join("\n"),
  {
    title: "Preamble",
    style: "double",
    padding: 1,
    color: ColorSystem.codes.brightBlue,
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 4. COORDINATED BRANCH OVERVIEW
// =============================================================================

console.log(ColorSystem.colorize("━━━ Federal Branch Alignment ━━━", ColorSystem.codes.bright));
console.log();

const branches = [
  {
    branch: "Executive",
    leadership: "President & Vice President",
    mission: "Executes laws, commands Armed Forces, deploys agencies + EO's",
  },
  {
    branch: "Legislative",
    leadership: "Congress (House 435 • Senate 100)",
    mission: "Drafts, debates, and passes legislation; confirms appointments; power of the purse",
  },
  {
    branch: "Judicial",
    leadership: "Supreme Court + Federal Judiciary",
    mission: "Interprets laws, ensures constitutional alignment, resolves federal disputes",
  },
];

TableRenderer.render(branches, [
  { key: "branch", label: "Branch", formatter: (value) => Formatter.truncate(value, 18) },
  { key: "leadership", label: "Leadership", formatter: (value) => Formatter.truncate(value, 38) },
  { key: "mission", label: "Core Mission", formatter: (value) => Formatter.truncate(value, 60) },
], { maxWidth: 120 });
console.log("\n");

// =============================================================================
// 5. FEDERAL BUDGET SIGNALS
// =============================================================================

console.log(ColorSystem.colorize("━━━ National Budget Landscape ━━━", ColorSystem.codes.bright));
console.log();

const discretionaryBudget = [
  { label: "Defense", value: 842 },
  { label: "Health & Human Svcs", value: 137 },
  { label: "Transportation", value: 105 },
  { label: "Homeland Security", value: 60 },
  { label: "State & USAID", value: 58 },
  { label: "Energy", value: 52 },
  { label: "Education", value: 90 },
  { label: "Justice", value: 49 },
];

console.log(ColorSystem.colorize("Discretionary Budget (Billions USD)", ColorSystem.codes.brightWhite));
ChartRenderer.barChart(discretionaryBudget, {
  width: 60,
  showValues: true,
  color: ColorSystem.codes.brightBlue,
});
console.log();

console.log(ColorSystem.colorize("Strategic Investment Mix", ColorSystem.codes.brightWhite));
ChartRenderer.pieChart([
  { label: "Defense + Security", value: 902 },
  { label: "Science & Infrastructure", value: 160 },
  { label: "Health & Education", value: 227 },
  { label: "Diplomacy & Development", value: 74 },
]);
console.log("\n");

// =============================================================================
// 6. CABINET AGENCY PERFORMANCE BOARD
// =============================================================================

console.log(ColorSystem.colorize("━━━ Cabinet-Level Executive Dashboard ━━━", ColorSystem.codes.bright));
console.log();

const cabinetAgencies = [
  {
    name: "Department of Defense",
    secretary: "Sec. Lloyd Austin III",
    workforce: 2900000,
    budget: 842,
    readiness: 0.92,
  },
  {
    name: "Department of State",
    secretary: "Sec. Antony Blinken",
    workforce: 77000,
    budget: 58,
    readiness: 0.88,
  },
  {
    name: "Department of Homeland Security",
    secretary: "Sec. Alejandro Mayorkas",
    workforce: 260000,
    budget: 60,
    readiness: 0.86,
  },
  {
    name: "Department of Energy",
    secretary: "Sec. Jennifer Granholm",
    workforce: 140000,
    budget: 52,
    readiness: 0.84,
  },
  {
    name: "Department of Health & Human Services",
    secretary: "Sec. Xavier Becerra",
    workforce: 85000,
    budget: 137,
    readiness: 0.9,
  },
  {
    name: "Department of Transportation",
    secretary: "Sec. Pete Buttigieg",
    workforce: 58000,
    budget: 105,
    readiness: 0.87,
  },
];

TableRenderer.render(
  cabinetAgencies,
  [
    { key: "name", label: "Agency", formatter: (value) => Formatter.truncate(value, 32) },
    { key: "secretary", label: "Cabinet Secretary", formatter: (value) => Formatter.truncate(value, 28) },
    {
      key: "workforce",
      label: "Workforce",
      formatter: (value) => `${Formatter.number(value)} staff`,
    },
    {
      key: "budget",
      label: "Budget FY24",
      formatter: (value) => Formatter.currency(value * 1_000_000_000),
    },
    {
      key: "readiness",
      label: "Readiness",
      formatter: (value) => Formatter.percentage(value),
    },
  ],
  { maxWidth: 140, sortBy: "budget", sortOrder: "desc" },
);
console.log("\n");

// =============================================================================
// 7. NATIONAL READINESS TRENDLINE
// =============================================================================

console.log(ColorSystem.colorize("━━━ Strategic Readiness Trend ━━━", ColorSystem.codes.bright));
console.log();

const readinessTrend = [83, 85, 84, 86, 88, 89, 90, 92];
console.log("Combined Joint Readiness Index (Quarterly)");
ChartRenderer.lineChart(readinessTrend, { width: readinessTrend.length, height: 8 });
console.log(
  ColorSystem.colorize(
    `Sparkline • ${ChartRenderer.sparkline(readinessTrend)} • Last reading: ${readinessTrend.slice(-1)[0]}%`,
    ColorSystem.codes.cyan,
  ),
);
console.log("\n");

// =============================================================================
// 8. LEGISLATIVE LIFECYCLE PROGRESS
// =============================================================================

console.log(ColorSystem.colorize("━━━ Legislative Production Run ━━━", ColorSystem.codes.bright));
console.log();

const legislativeStages = [
  { label: "Committee Drafting (House)", progress: 15 },
  { label: "Floor Debate & Vote (House)", progress: 35 },
  { label: "Senate Committee & Markup", progress: 55 },
  { label: "Senate Vote & Conference", progress: 75 },
  { label: "Presidential Signature", progress: 100 },
];

const legislationBar = new ProgressBar({
  total: 100,
  width: 70,
  showPercentage: true,
  colorize: true,
});

let currentProgress = 0;
for (const stage of legislativeStages) {
  currentProgress = Math.max(currentProgress, stage.progress);
  legislationBar.update(currentProgress);
  federalLogger.info("Legislative stage advanced", stage);
  await sleep(600);
}

legislationBar.complete();
console.log();

const emergencyBar = new ProgressBar({
  total: 100,
  width: 70,
  showValue: true,
  showPercentage: true,
  colorize: true,
});

const responsePhases = [
  { label: "FEMA Activation", progress: 25 },
  { label: "Interagency Coordination", progress: 50 },
  { label: "National Guard Deployment", progress: 70 },
  { label: "Stabilization & Relief", progress: 90 },
  { label: "Recovery Funding Obligations", progress: 100 },
];

currentProgress = 0;
for (const phase of responsePhases) {
  currentProgress = Math.max(currentProgress, phase.progress);
  emergencyBar.update(currentProgress);
  federalLogger.warning("Emergency response phase updated", phase);
  await sleep(550);
}
emergencyBar.complete();
console.log("\n");

// =============================================================================
// 9. NATIONAL SECURITY COUNCIL SNAPSHOT
// =============================================================================

console.log(ColorSystem.colorize("━━━ NSC Situation Room Snapshot ━━━", ColorSystem.codes.bright));
console.log();

const nscFocus = [
  "Cyber Shield 24: Coordinated defense of civilian critical infrastructure grids",
  "Pacific Assurance: Combined operations with allies across INDOPACOM AOR",
  "Space Surveillance Delta 2: Tracking 34,000+ objects in orbit for collision avoidance",
  "Continuity of Government drills across CONUS relocation sites",
];

BoxRenderer.render(nscFocus.join("\n"), {
  title: "Top Priorities",
  style: "bold",
  padding: 1,
  color: ColorSystem.codes.brightRed,
  maxWidth: 96,
});
console.log();

TableRenderer.renderKeyValue([
  { label: "Threat Level", value: "Guarded (HSAS Level 2)" },
  { label: "Cyber Readiness", value: Formatter.percentage(0.91) },
  { label: "Defense Condition", value: "DEFCON 4 (double-checking communication chains)" },
  { label: "Diplomatic Sprints", value: "NATO Article V tabletop • Quad trade forum" },
]);
console.log("\n");

// =============================================================================
// 10. CLOSING LOGS
// =============================================================================

federalLogger.success("United States Government showcase complete", {
  timestamp: new Date().toISOString(),
  totalSections: 10,
  utilizedComponents: [
    "BannerRenderer",
    "BoxRenderer",
    "Logger",
    "Spinner",
    "ProgressBar",
    "TableRenderer",
    "ChartRenderer",
    "Formatter",
    "ColorSystem",
  ],
});

federalLogger.info("Structured logs persisted to ./logs/united-states-government.log");
console.log(ColorSystem.colorize("\nHonor, service, and fidelity — United States Government readiness check complete.\n", ColorSystem.codes.brightWhite));
