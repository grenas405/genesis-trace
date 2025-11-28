#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * La Zeta 92.1 FM / 106.9 FM Oklahoma City - Broadcast Operations Demo
 *
 * A comprehensive GenesisTrace showcase for the leading Spanish-language radio
 * station serving Oklahoma City’s Hispanic community. This scenario models the
 * entire broadcast day: programming grid, tower telemetry, automation health,
 * revenue mix, community remotes, and emergency alert readiness.
 *
 * Highlights:
 *   • Banner + box renderers for station identity and mission framing
 *   • Tables for programming clocks, host bios, advertisers, field events,
 *     tower telemetry, and public safety drills
 *   • Charts for streaming demand, digital platform reach, and music mix
 *   • Progress bars to simulate automation + compliance sweeps
 *   • Spinner to represent remote uplink verification
 *   • Structured logging with namespaces for on-air + engineering teams
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
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface BroadcastShow {
  slot: string;
  program: string;
  host: string;
  format: string;
  focus: string;
  sponsor: string;
}

interface HostProfile {
  name: string;
  persona: string;
  segment: string;
  neighborhood: string;
  languages: string[];
  communityAnchor: string;
}

interface AdvertiserFlight {
  brand: string;
  category: string;
  weeklySpots: number;
  spend: number;
  format: string;
  representative: string;
  kpiFocus: string;
}

interface FieldActivation {
  title: string;
  location: string;
  date: string;
  type: string;
  expectedReach: number;
  engineer: string;
}

interface TowerReading {
  site: string;
  erpKw: number;
  modulation: string;
  backupReady: boolean;
  engineer: string;
  wind: number;
  notes: string;
}

interface AlertDrill {
  code: string;
  scenario: string;
  lastRun: string;
  lead: string;
  status: "Ready" | "Needs refresh" | "In progress";
}

const laZetaPalette = {
  orange: ColorSystem.rgb(255, 111, 0),
  teal: ColorSystem.rgb(0, 183, 164),
  magenta: ColorSystem.rgb(217, 35, 139),
};

const programmingGrid: BroadcastShow[] = [
  {
    slot: "5:00 – 7:00 AM",
    program: "Arriba Oklahoma",
    host: "Lupita “La Voz” Ramírez",
    format: "Regional Mexican + News",
    focus: "traffic, corridos del día, OKC alerts",
    sponsor: "Supermercados Morelos",
  },
  {
    slot: "7:00 – 10:00 AM",
    program: "El Despertador 405",
    host: "El Gallo & La Tía Rosa",
    format: "Morning show",
    focus: "call-ins, prizes, school closings",
    sponsor: "Payne’s Tires · Metro Tech",
  },
  {
    slot: "10:00 AM – 1:00 PM",
    program: "La Zeta Hits",
    host: "DJ Nico “El Ingeniero”",
    format: "Banda + cumbia power",
    focus: "live mixing, dedications, WhatsApp board",
    sponsor: "Homeland + OG&E",
  },
  {
    slot: "1:00 – 4:00 PM",
    program: "Tardes con Jazmín",
    host: "Jazmín Herrera",
    format: "Lifestyle + community voices",
    focus: "city hall, wellness, nonprofit spotlights",
    sponsor: "OU Health · Variety Care",
  },
  {
    slot: "4:00 – 7:00 PM",
    program: "Drive Home Norteño",
    host: "“Paquito” Rivera",
    format: "Norteño drive time",
    focus: "live remotes, traffic ops, high-energy sets",
    sponsor: "Eskridge Auto Group",
  },
  {
    slot: "7:00 – 12:00 AM",
    program: "La Noche Z",
    host: "Carolina Vega",
    format: "Románticas + throwbacks",
    focus: "dedication walls, bilingual ministry partners",
    sponsor: "Santa Fe South Schools",
  },
];

const hostProfiles: HostProfile[] = [
  {
    name: "Lupita “La Voz” Ramírez",
    persona: "Morning anchor & corrido historian",
    segment: "Arriba Oklahoma",
    neighborhood: "Capitol Hill",
    languages: ["Spanish", "English"],
    communityAnchor: "OKCPS parent councils",
  },
  {
    name: "El Gallo",
    persona: "Comedy-first caller hype",
    segment: "El Despertador 405",
    neighborhood: "South OKC",
    languages: ["Spanish"],
    communityAnchor: "Futsal leagues & Fiestas Patrias",
  },
  {
    name: "Jazmín Herrera",
    persona: "Lifestyle journalist",
    segment: "Tardes con Jazmín",
    neighborhood: "Paseo",
    languages: ["Spanish", "English"],
    communityAnchor: "Latina leaders council",
  },
  {
    name: "DJ Nico “El Ingeniero”",
    persona: "Live mix show + automation lead",
    segment: "La Zeta Hits",
    neighborhood: "Midtown",
    languages: ["Spanish", "English"],
    communityAnchor: "OKC club residencies",
  },
  {
    name: "Carolina Vega",
    persona: "Románticas curator & chaplain partner",
    segment: "La Noche Z",
    neighborhood: "Moore",
    languages: ["Spanish", "English"],
    communityAnchor: "Parish outreach + hospitals",
  },
];

const advertiserFlights: AdvertiserFlight[] = [
  {
    brand: "Supermercados Morelos",
    category: "Grocery",
    weeklySpots: 42,
    spend: 8700,
    format: "Live reads + :30s",
    representative: "Claudia Avila",
    kpiFocus: "Weekend basket +11%",
  },
  {
    brand: "Eskridge Auto Group",
    category: "Automotive",
    weeklySpots: 35,
    spend: 10400,
    format: "Drive-time :60s",
    representative: "Marco Zapien",
    kpiFocus: "Bilingual leads",
  },
  {
    brand: "Variety Care",
    category: "Healthcare",
    weeklySpots: 26,
    spend: 6200,
    format: "Community vignettes",
    representative: "Carmen Lara",
    kpiFocus: "Wellness sign-ups",
  },
  {
    brand: "OG&E",
    category: "Utilities",
    weeklySpots: 18,
    spend: 5600,
    format: "Energy tips + promos",
    representative: "Russell Hicks",
    kpiFocus: "Program enrollment",
  },
  {
    brand: "Santa Fe South Schools",
    category: "Education",
    weeklySpots: 22,
    spend: 4100,
    format: "Enrollment capsules",
    representative: "Sandra Beltran",
    kpiFocus: "Open house RSVPs",
  },
  {
    brand: "Plaza Fiesta Markets",
    category: "Retail",
    weeklySpots: 30,
    spend: 5300,
    format: "Live remote stack",
    representative: "Luis Porter",
    kpiFocus: "Saturday traffic",
  },
];

const remoteActivations: FieldActivation[] = [
  {
    title: "Carnaval Oklahomeño",
    location: "State Fair Park",
    date: "Mar 22",
    type: "Concert remote",
    expectedReach: 5400,
    engineer: "Pablo Medina",
  },
  {
    title: "Plaza District Block Party",
    location: "NW 16th & Blackwelder",
    date: "Mar 29",
    type: "Retail takeover",
    expectedReach: 2100,
    engineer: "Isaiah Gutierrez",
  },
  {
    title: "South OKC Vaccine Drive",
    location: "Variety Care · SW 44th",
    date: "Apr 5",
    type: "Health remote",
    expectedReach: 1800,
    engineer: "Alicia Cano",
  },
  {
    title: "Thunder Alley Watch Party",
    location: "Paycom Center",
    date: "Apr 9",
    type: "Sports crossover",
    expectedReach: 3200,
    engineer: "Nico Delgado",
  },
];

const towerReadings: TowerReading[] = [
  {
    site: "Blanchard Peak 92.1 FM",
    erpKw: 50,
    modulation: "HD1 + HD2 locked",
    backupReady: true,
    engineer: "Marisol Vega",
    wind: 18,
    notes: "STL A primary, fiber backup hot",
  },
  {
    site: "NW OKC 106.9 FM",
    erpKw: 11,
    modulation: "Translator clean",
    backupReady: true,
    engineer: "Victor Serrano",
    wind: 12,
    notes: "Ice sensors green",
  },
  {
    site: "Downtown Studio STL",
    erpKw: 0.5,
    modulation: "Digital aux patch",
    backupReady: false,
    engineer: "Lucia Navarro",
    wind: 0,
    notes: "RF exciter swap scheduled 02/21",
  },
];

const alertDrills: AlertDrill[] = [
  {
    code: "EAS-OKC-305",
    scenario: "Severe weather bilingual simulcast",
    lastRun: "02/14 11:05",
    lead: "Carlos Ruiz",
    status: "Ready",
  },
  {
    code: "AMBER-TRI-410",
    scenario: "Amber Alert autopatch",
    lastRun: "01/28 09:40",
    lead: "Daniela Ortiz",
    status: "Ready",
  },
  {
    code: "IPAWS-HEAT-212",
    scenario: "Heat advisory automation",
    lastRun: "12/18 15:20",
    lead: "FCC liaison",
    status: "Needs refresh",
  },
];

const streamingHours = [
  { label: "05h", value: 480 },
  { label: "07h", value: 650 },
  { label: "09h", value: 720 },
  { label: "12h", value: 840 },
  { label: "15h", value: 910 },
  { label: "18h", value: 1050 },
  { label: "20h", value: 980 },
  { label: "22h", value: 610 },
];

const platformReach = [
  { label: "Facebook", value: 43000 },
  { label: "TikTok", value: 52000 },
  { label: "La Zeta App", value: 18200 },
  { label: "WhatsApp Clubs", value: 9600 },
  { label: "Email VIP", value: 12750 },
];

const musicMix = [
  { label: "Banda / Sierreño", value: 38 },
  { label: "Norteño", value: 22 },
  { label: "Cumbia Tropical", value: 16 },
  { label: "Reggaetón throwbacks", value: 12 },
  { label: "Lowrider classics", value: 12 },
];

const retentionSamples = [0.94, 0.93, 0.96, 0.92, 0.9, 0.95, 0.97, 0.93, 0.91, 0.92];
const stlLatency = [95, 88, 79, 71, 66, 63, 61, 59, 62, 74];

const section = (title: string, color = laZetaPalette.orange) => {
  console.log(ColorSystem.colorize(`  ${title}`, color));
  console.log(ColorSystem.colorize(`  ${"─".repeat(title.length)}`, ColorSystem.codes.dim));
  console.log("");
};

const runLaZetaDemo = async () => {
  console.clear();
  console.log("");

  BannerRenderer.render({
    title: "LA ZETA RADIO · OKLAHOMA CITY",
    subtitle: "92.1 FM · 106.9 FM · Streaming · WhatsApp Studios",
    description: "Regional Mexican powerhouse for the 405 — powered by GenesisTrace",
    version: "Ops Console v4.2.1",
    author: "La Zeta Innovation Lab",
    width: 96,
    color: laZetaPalette.orange,
    style: "double",
  });
  console.log("");

  const laZetaLogger = new Logger(
    new ConfigBuilder()
      .namespace("LA-ZETA-OKC")
      .theme(neonTheme)
      .logLevel("debug")
      .enableHistory(true)
      .build(),
  );

  laZetaLogger.info("Studio transport online", {
    fm92PowerKw: 50,
    fm106Translator: "Sync'd",
    streamingListeners: streamingHours.reduce((sum, block) => sum + block.value, 0),
  });
  laZetaLogger.success("Music log + traffic merged", {
    programs: programmingGrid.length,
    adFlights: advertiserFlights.length,
  });
  console.log("");

  section("Station Identity & Mission");
  BoxRenderer.render(
    [
      `City: Oklahoma City, Midwest City, Moore, Edmond`,
      `Studios: Historic Capitol Hill · Remote pods @ Plaza District`,
      `Audience: ${Formatter.number(167000)} weekly listeners · ${Formatter.number(54200)} digital MAUs`,
      `Mission: ${ColorSystem.colorize("Celebrate la cultura, inform families, power bilingual commerce", laZetaPalette.orange)}`,
      `Coverage: 92.1 FM ERP 50kW · Translator 106.9 FM · HD streaming · WhatsApp dedications`,
    ],
    {
      title: "La Zeta Fact Sheet",
      style: "rounded",
      padding: 1,
      margin: 1,
      color: laZetaPalette.teal,
    },
  );
  console.log("");

  section("Programming Clock & Signature Sponsors");
  TableRenderer.render(
    programmingGrid,
    [
      { key: "slot", label: "Slot", width: 18 },
      { key: "program", label: "Program", width: 22 },
      { key: "host", label: "Host", width: 22 },
      { key: "format", label: "Format", width: 22 },
      { key: "focus", label: "Mission", width: 32 },
      { key: "sponsor", label: "Sponsor Pod", width: 26 },
    ],
    { maxWidth: 140 },
  );
  console.log("");
  laZetaLogger.info("Programming grid rendered", { blocks: programmingGrid.length });

  section("Host Profiles & Community Connectors");
  TableRenderer.render(
    hostProfiles,
    [
      { key: "name", label: "Talent", width: 24 },
      { key: "persona", label: "Persona", width: 28 },
      { key: "segment", label: "Segment", width: 20 },
      { key: "neighborhood", label: "Neighborhood", width: 14 },
      {
        key: "languages",
        label: "Languages",
        width: 14,
        formatter: (langs: string[]) => langs.join(" / "),
      },
      { key: "communityAnchor", label: "Community Anchor", width: 28 },
    ],
    { maxWidth: 150 },
  );
  console.log("");
  laZetaLogger.success("Talent roster ready", {
    bilingualHosts: hostProfiles.filter((host) => host.languages.length > 1).length,
  });

  section("Advertising Flights & Monetization Mix");
  TableRenderer.render(
    advertiserFlights,
    [
      { key: "brand", label: "Brand", width: 20 },
      { key: "category", label: "Category", width: 14 },
      { key: "weeklySpots", label: "Spots / Week", width: 14 },
      {
        key: "spend",
        label: "Weekly Spend",
        width: 16,
        formatter: (value: number) => Formatter.currency(value),
      },
      { key: "format", label: "Format", width: 22 },
      { key: "representative", label: "Rep", width: 16 },
      { key: "kpiFocus", label: "Focus KPI", width: 20 },
    ],
    { maxWidth: 150 },
  );
  console.log("");

  const totalWeeklySpend = advertiserFlights.reduce((sum, flight) => sum + flight.spend, 0);
  const spendByCategory = advertiserFlights.reduce<Record<string, number>>((map, flight) => {
    map[flight.category] = (map[flight.category] || 0) + flight.spend;
    return map;
  }, {});
  ChartRenderer.pieChart(
    Object.entries(spendByCategory).map(([label, value]) => ({ label, value })),
  );
  console.log("");
  laZetaLogger.info("Ad mix analyzed", {
    totalWeeklySpend: Formatter.currency(totalWeeklySpend),
    avgSpotValue: Formatter.currency(totalWeeklySpend / advertiserFlights.reduce((sum, f) => sum + f.weeklySpots, 0)),
  });

  section("Digital Pulse & Streaming Demand");
  ChartRenderer.barChart(streamingHours, {
    width: 60,
    showValues: true,
    color: laZetaPalette.orange,
  });
  console.log("");

  ChartRenderer.barChart(platformReach, {
    width: 58,
    showValues: true,
    color: laZetaPalette.magenta,
  });
  console.log("");

  ChartRenderer.pieChart(musicMix);
  console.log("");

  const retentionSpark = ChartRenderer.sparkline(retentionSamples.map((value) => value * 100));
  console.log(
    `Minute-by-minute retention: ${
      ColorSystem.colorize(retentionSpark, laZetaPalette.teal)
    } avg hold ${Formatter.percentage(
      retentionSamples.reduce((sum, value) => sum + value, 0) / retentionSamples.length,
      1,
    )}`,
  );
  console.log("");

  ChartRenderer.lineChart(stlLatency, { width: stlLatency.length, height: 6 });
  console.log(
    ColorSystem.colorize(
      "STL latency trace (ms) — goal < 70ms during remotes",
      ColorSystem.codes.dim,
    ),
  );
  console.log("");

  section("Tower Federation & Signal Health");
  const readyRatio = towerReadings.filter((tower) => tower.backupReady).length / towerReadings.length;
  BoxRenderer.render(
    [
      `Sites monitored: ${towerReadings.length} · Backup ready: ${Formatter.percentage(readyRatio, 0)}`,
      `Engineering rotation: Marisol · Victor · Lucia`,
      `Wind load window: ${Math.max(...towerReadings.map((tower) => tower.wind))} mph max gust`,
    ],
    {
      title: "RF Snapshot",
      style: "double",
      color: laZetaPalette.teal,
      padding: 1,
      margin: 1,
    },
  );
  TableRenderer.render(
    towerReadings,
    [
      { key: "site", label: "Site", width: 28 },
      { key: "erpKw", label: "ERP kW", width: 10 },
      { key: "modulation", label: "Modulation", width: 22 },
      {
        key: "backupReady",
        label: "Backup",
        width: 10,
        formatter: (value: boolean) =>
          value
            ? ColorSystem.colorize("Ready", ColorSystem.codes.brightGreen)
            : ColorSystem.colorize("Action", ColorSystem.codes.brightRed),
      },
      { key: "engineer", label: "Engineer", width: 16 },
      { key: "wind", label: "Wind mph", width: 12 },
      { key: "notes", label: "Notes", width: 28 },
    ],
    { maxWidth: 150 },
  );
  console.log("");

  section("Automation & Compliance Sweep");
  const automationPhases = [
    "MusicMaster ingest",
    "NexGen stack validation",
    "Commercial reconciliation",
    "EAS slate verification",
    "WhatsApp queue export",
    "Podcast capture + sync",
  ];
  const automationBar = new ProgressBar({
    total: automationPhases.length,
    width: 48,
    showValue: false,
  });
  for (let i = 0; i < automationPhases.length; i++) {
    automationBar.update(i + 1);
    await sleep(180);
  }
  automationBar.complete();
  console.log("");
  automationPhases.forEach((phase) =>
    console.log(
      `${ColorSystem.colorize("•", laZetaPalette.orange)} ${phase}`,
    ));
  console.log("");
  laZetaLogger.success("Automation sweep finished", { phases: automationPhases.length });

  section("Community Remotes & Field Activations");
  TableRenderer.render(
    remoteActivations,
    [
      { key: "title", label: "Activation", width: 26 },
      { key: "location", label: "Location", width: 24 },
      { key: "date", label: "Date", width: 10 },
      { key: "type", label: "Type", width: 16 },
      {
        key: "expectedReach",
        label: "Reach (est.)",
        width: 14,
        formatter: (value: number) => Formatter.number(value),
      },
      { key: "engineer", label: "Engineer", width: 18 },
    ],
    { maxWidth: 140 },
  );
  console.log("");

  const uplinkSpinner = new Spinner({
    message: "Arming Plaza District remote kit...",
    colorize: true,
  });
  uplinkSpinner.start();
  await sleep(700);
  uplinkSpinner.update("Bonded cellular bootstrapping…");
  await sleep(700);
  uplinkSpinner.update("Return IFB confidence tone");
  await sleep(700);
  uplinkSpinner.succeed("Remote uplink locked · Latency 58 ms");
  console.log("");

  section("Emergency Alert Desk");
  TableRenderer.render(
    alertDrills,
    [
      { key: "code", label: "Code", width: 14 },
      { key: "scenario", label: "Scenario", width: 32 },
      { key: "lastRun", label: "Last Drill", width: 14 },
      { key: "lead", label: "Lead", width: 16 },
      {
        key: "status",
        label: "Readiness",
        width: 14,
        formatter: (value: AlertDrill["status"]) =>
          value === "Ready"
            ? ColorSystem.colorize(value, ColorSystem.codes.brightGreen)
            : ColorSystem.colorize(value, ColorSystem.codes.brightYellow),
      },
    ],
    { maxWidth: 120 },
  );
  console.log("");

  const alertDesk = laZetaLogger.child("AlertDesk");
  alertDesk.warning("Heat advisory drill needs refresh", {
    action: "Update IPAWS template + bilingual copy",
    due: "02/28 12:00",
  });
  alertDesk.success("Severe weather script rehearsed with Jazmín + Paquito");
  console.log("");

  laZetaLogger.success("La Zeta orchestration complete", {
    totalSections: 8,
    readySites: towerReadings.filter((tower) => tower.backupReady).length,
    remotesScheduled: remoteActivations.length,
  });
};

if (import.meta.main) {
  await runLaZetaDemo();
}
