#!/usr/bin/env -S deno run --allow-read --allow-write

/**
 * Orbital Satellite Operator Briefing
 *
 * Uses GenesisTrace components to produce a narrative on the companies
 * operating the bulk of active satellites along with orbital context.
 * Counts are synthetic but proportional to public filings through Q1 2025.
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  TableRenderer,
} from "../../mod.ts";

console.clear();
console.log();

BannerRenderer.render({
  title: "GLOBAL SATELLITE OPERATORS",
  subtitle: "Live orbital assets, by constellation + company",
  description: "GenesisTrace visualization of who flies what around Earth in 2025",
  version: "Orbital Catalog v2025.1",
  author: "GenesisTrace Space Systems Lab",
  width: 120,
  color: ColorSystem.codes.brightBlue,
});
console.log();

const GLOBAL_ACTIVE_SATELLITES = 9_900;
const COMMERCIAL_SHARE = 0.77;
const YEAR = 2025;

interface SatelliteOperator {
  program: string;
  company: string;
  satellitesInOrbit: number;
  orbitBand: "LEO" | "MEO" | "GEO" | "Mixed";
  altitude: string;
  service: string;
  coverage: string;
  highlight: string;
}

const SATELLITE_OPERATORS: SatelliteOperator[] = [
  {
    program: "Starlink",
    company: "SpaceX",
    satellitesInOrbit: 5_676,
    orbitBand: "LEO",
    altitude: "Shells 335-570 km",
    service: "Mass-market broadband + backhaul",
    coverage: "Global with densest beams over the Americas + Europe",
    highlight: "Launching >1,000 craft/year while rolling out Gen2 mini buses",
  },
  {
    program: "OneWeb Gen1",
    company: "Eutelsat OneWeb",
    satellitesInOrbit: 634,
    orbitBand: "LEO",
    altitude: "1,200 km polar",
    service: "Enterprise, aviation, and sovereign broadband",
    coverage: "Truly global including Arctic flight paths",
    highlight: "Eutelsat merger lets LEO data ride on GEO video distribution contracts",
  },
  {
    program: "PlanetScope + SkySat",
    company: "Planet Labs",
    satellitesInOrbit: 200,
    orbitBand: "LEO",
    altitude: "Sun-synchronous 475 km",
    service: "Daily earth imagery + analytics",
    coverage: "Every land mass each day; higher cadence over agriculture belts",
    highlight: "Imagery powers insurance, ESG, and disaster monitoring products",
  },
  {
    program: "Iridium NEXT",
    company: "Iridium Communications",
    satellitesInOrbit: 75,
    orbitBand: "LEO",
    altitude: "780 km polar",
    service: "L-band voice, safety-of-life, ADS-B, & US government relay",
    coverage: "Truly global with strong maritime + polar reliability",
    highlight: "Hosted payloads provide Aireon aviation tracking & DoD services",
  },
  {
    program: "Globalstar",
    company: "Globalstar",
    satellitesInOrbit: 48,
    orbitBand: "LEO",
    altitude: "1,414 km inclined",
    service: "IoT + Apple Emergency SOS relay",
    coverage: "North/South America focus with Atlantic corridors",
    highlight: "Apple service payments fund spare satellites through 2026",
  },
  {
    program: "Spire LEMUR",
    company: "Spire Global",
    satellitesInOrbit: 110,
    orbitBand: "LEO",
    altitude: "450-650 km varied",
    service: "Weather profiles, maritime AIS, aviation ADS-B",
    coverage: "Sun-synchronous planes for consistent revisit world-wide",
    highlight: "Radio occultation feeds NOAA, EUMETSAT, and defense users daily",
  },
  {
    program: "BlackSky Spectra",
    company: "BlackSky",
    satellitesInOrbit: 18,
    orbitBand: "LEO",
    altitude: "500 km sun-synchronous",
    service: "Rapid-revisit imaging (<1 m)",
    coverage: "Taskable for megacities and tactical sites",
    highlight: "AI tasking engine delivers 15 min revisit over hot spots",
  },
  {
    program: "Maxar WorldView + Legion",
    company: "Maxar Intelligence",
    satellitesInOrbit: 9,
    orbitBand: "LEO",
    altitude: "Sun-synchronous 500-800 km",
    service: "Very high-resolution imagery (30 cm)",
    coverage: "Global, prioritized for US/NATO tasking",
    highlight: "New Legion spacecraft double mid-latitude collection windows",
  },
  {
    program: "SES GEO + O3b mPOWER",
    company: "SES",
    satellitesInOrbit: 70,
    orbitBand: "Mixed",
    altitude: "GEO arc + 8,000 km MEO",
    service: "Video distribution + high-throughput backhaul",
    coverage: "Europe, Americas, Africa with low-latency MEO arcs",
    highlight: "O3b mPOWER adds steerable beams for cruise lines & telcos",
  },
  {
    program: "Intelsat GEO Fleet",
    company: "Intelsat",
    satellitesInOrbit: 54,
    orbitBand: "GEO",
    altitude: "35,786 km geostationary",
    service: "Media broadcast + aeronautical connectivity",
    coverage: "Global orbital slots with Atlantic/Pacific emphasis",
    highlight: "Software-defined GEO buses flex capacity toward IFC demand",
  },
  {
    program: "Hughes Jupiter",
    company: "EchoStar / Hughes",
    satellitesInOrbit: 17,
    orbitBand: "GEO",
    altitude: "GEO arc",
    service: "Consumer & enterprise broadband in the Americas",
    coverage: "North + South American beam clusters",
    highlight: "Jupiter-3 adds 500 Gbps to rural US & Latin America markets",
  },
  {
    program: "Amazon Project Kuiper (proto)",
    company: "Amazon",
    satellitesInOrbit: 2,
    orbitBand: "LEO",
    altitude: "500 km shakedown orbit",
    service: "Upcoming consumer + enterprise broadband",
    coverage: "Test region over the continental US + Latin America",
    highlight: "KuiperSat-1/2 validate phased arrays before 3K-satellite build",
  },
];

const ORBIT_LAYERS = [
  {
    orbit: "LEO (200-1,400 km)",
    share: 0.86,
    description: "Mega constellations + cubesats for broadband, imaging, IoT",
  },
  {
    orbit: "MEO (8,000-20,000 km)",
    share: 0.06,
    description: "Navigation fleets & SES O3b for low-latency enterprise links",
  },
  {
    orbit: "GEO (35,786 km)",
    share: 0.08,
    description: "Broadcast, weather, & high-throughput beams parked over regions",
  },
];

const SEGMENT_STORYLINES = [
  {
    segment: "Broadband mega-constellations",
    share: 0.70,
    customers: "Households, airlines, maritime, rural telcos",
    explanation: "Starlink, OneWeb, Kuiper anchor most new launches and dominate counts.",
  },
  {
    segment: "Earth observation & analytics",
    share: 0.11,
    customers: "Agriculture, climate teams, insurance, defense",
    explanation: "Planet, Maxar, BlackSky deliver revisit-rich imagery streams.",
  },
  {
    segment: "IoT & narrowband messaging",
    share: 0.08,
    customers: "Logistics, safety teams, emergency services",
    explanation: "Iridium, Globalstar, Orbcomm-class fleets run L-band & S-band relays.",
  },
  {
    segment: "Video & enterprise GEO/MEO",
    share: 0.07,
    customers: "Media networks, cruise lines, energy sites",
    explanation: "SES, Intelsat, and Hughes blend classical GEO with software-defined payloads.",
  },
  {
    segment: "Gov / science payload clusters",
    share: 0.04,
    customers: "Civil space agencies & classified missions",
    explanation: "Weather, ISR, and university cubes fill in remaining orbital catalog entries.",
  },
];

const orbitalLogger = new Logger(
  new ConfigBuilder()
    .namespace("orbit.watch")
    .theme(neonTheme)
    .timestampFormat("HH:mm:ss")
    .logLevel("info")
    .enableHistory(false)
    .build(),
);

const trackedSatellites = SATELLITE_OPERATORS.reduce(
  (sum, entry) => sum + entry.satellitesInOrbit,
  0,
);
const remainderSatellites = GLOBAL_ACTIVE_SATELLITES - trackedSatellites;

orbitalLogger.info("Orbital catalog loaded", {
  year: YEAR,
  estimatedActiveSatellites: Formatter.number(GLOBAL_ACTIVE_SATELLITES),
  commercialShare: Formatter.percentage(COMMERCIAL_SHARE, 0),
  operatorsProfiled: SATELLITE_OPERATORS.length,
});

orbitalLogger.success("Commercial share captured", {
  satellitesTracked: Formatter.number(trackedSatellites),
  shareOfCatalog: Formatter.percentage(trackedSatellites / GLOBAL_ACTIVE_SATELLITES, 1),
  remainingSatellites: Formatter.number(remainderSatellites),
});
console.log();

BoxRenderer.render(
  [
    `Commercial operators now control ~${Formatter.percentage(COMMERCIAL_SHARE, 0)} of all ${
      Formatter.number(GLOBAL_ACTIVE_SATELLITES)
    } active satellites.`,
    `${Formatter.number(trackedSatellites)} of those craft are in fleets highlighted below;`,
    `${Formatter.number(remainderSatellites)} additional spacecraft belong to national security,`,
    "university rideshares, and civil weather programs not broken out individually.",
  ],
  {
    title: "Orbital Context",
    style: "double",
    padding: 1,
    color: ColorSystem.codes.brightCyan,
    maxWidth: 110,
  },
);
console.log("\n");

console.log(
  ColorSystem.colorize("━━━ Commercial Constellations & Operators ━━━", ColorSystem.codes.bright),
);
console.log();

TableRenderer.render(
  SATELLITE_OPERATORS,
  [
    { key: "program", label: "Constellation" },
    { key: "company", label: "Operator" },
    {
      key: "satellitesInOrbit",
      label: "# In Orbit",
      formatter: (value) => Formatter.number(value),
    },
    { key: "orbitBand", label: "Orbit" },
    {
      key: "service",
      label: "Primary Service",
      formatter: (value) => Formatter.truncate(value, 32),
    },
    {
      key: "highlight",
      label: "2025 Momentum",
      formatter: (value) => Formatter.truncate(value, 48),
    },
  ],
  { maxWidth: 130 },
);
console.log("\n");

console.log(
  ColorSystem.colorize("Top constellations by satellite count", ColorSystem.codes.brightWhite),
);
ChartRenderer.barChart(
  SATELLITE_OPERATORS
    .slice()
    .sort((a, b) => b.satellitesInOrbit - a.satellitesInOrbit)
    .slice(0, 7)
    .map((entry) => ({
      label: entry.program,
      value: entry.satellitesInOrbit,
    })),
  {
    width: 60,
    color: ColorSystem.codes.brightBlue,
  },
);
console.log("\n");

console.log(ColorSystem.colorize("Orbit layer distribution", ColorSystem.codes.brightWhite));
ChartRenderer.pieChart(
  ORBIT_LAYERS.map((layer) => ({
    label: layer.orbit,
    value: Math.round(layer.share * 100),
  })),
);
console.log();

TableRenderer.render(
  ORBIT_LAYERS.map((layer) => ({
    orbit: layer.orbit,
    share: Formatter.percentage(layer.share, 0),
    description: layer.description,
  })),
  [
    { key: "orbit", label: "Orbit Regime" },
    { key: "share", label: "Share of Active Craft" },
    {
      key: "description",
      label: "What happens here",
      formatter: (value) => Formatter.truncate(value, 70),
    },
  ],
  { maxWidth: 120 },
);
console.log("\n");

console.log(
  ColorSystem.colorize("Use-case momentum by customer segment", ColorSystem.codes.brightWhite),
);
TableRenderer.render(
  SEGMENT_STORYLINES.map((segment) => ({
    segment: segment.segment,
    share: Formatter.percentage(segment.share, 0),
    customers: segment.customers,
    explanation: segment.explanation,
  })),
  [
    { key: "segment", label: "Segment" },
    { key: "share", label: "Share of Commercial Craft" },
    {
      key: "customers",
      label: "Key Customers",
      formatter: (value) => Formatter.truncate(value, 40),
    },
    {
      key: "explanation",
      label: "Momentum Signals",
      formatter: (value) => Formatter.truncate(value, 60),
    },
  ],
  { maxWidth: 130 },
);
console.log("\n");

BoxRenderer.render(
  [
    "Takeaways:",
    "• LEO broadband constellations provide scale but require relentless launch cadence.",
    "• Earth observation fleets stay small yet data-rich, monetizing analytics > hardware.",
    "• GEO operators are reinventing with software-defined payloads + MEO extensions.",
    "• IoT relays (Iridium/Globalstar) continue to cash-flow safety services and Apple SOS.",
  ],
  {
    title: "How to Read This Briefing",
    style: "rounded",
    padding: 1,
    color: ColorSystem.codes.brightGreen,
    maxWidth: 110,
  },
);
console.log();
