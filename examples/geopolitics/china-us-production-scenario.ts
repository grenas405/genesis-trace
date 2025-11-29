#!/usr/bin/env -S deno run --allow-read

/**
 * China vs. United States Production System Simulation
 *
 * This presentation stitches together multiple GenesisTrace components to
 * explore a synthetic scenario where China assembles a better coordinated
 * production system than the United States by the early 2030s. It mixes
 * structured logging, banners, tables, charts, boxes, progress indicators,
 * spinners, guardrails, and adaptive pacing so you can see how the library
 * can be orchestrated for storytelling-grade analysis.
 */

import {
  AdaptivePacingController,
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  CognitiveGuardrailsPlugin,
  ColorSystem,
  ConfigBuilder,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

interface ProductionPillar {
  pillar: string;
  chinaScore: number;
  usScore: number;
  delta: number;
  effect: string;
}

interface SupplyChainStage {
  stage: string;
  chinaControl: number;
  usControl: number;
  chokePoint: string;
}

interface TimelineEvent {
  window: string;
  chinaMove: string;
  usSignal: string;
  warning: string;
}

interface OutputTrajectory {
  year: number;
  chinaShare: number;
  usShare: number;
  productivityGap: number;
  automationIndex: number;
}

const RAW_PRODUCTION_PILLARS: Omit<ProductionPillar, "delta">[] = [
  {
    pillar: "Autonomous Factories",
    chinaScore: 92,
    usScore: 64,
    effect: "Lights-out giga-factories cut cycle time by 45%",
  },
  {
    pillar: "Industrial Software Stack",
    chinaScore: 88,
    usScore: 71,
    effect: "Unified MES/SCADA layer cleared in digital yuan",
  },
  {
    pillar: "Energy System Integration",
    chinaScore: 86,
    usScore: 62,
    effect: "Heat-pump & storage clusters stabilize heavy industry",
  },
  {
    pillar: "Supply Chain Finance",
    chinaScore: 84,
    usScore: 58,
    effect: "State working capital at 1% reaches tier-3 suppliers",
  },
  {
    pillar: "Logistics & Ports",
    chinaScore: 90,
    usScore: 65,
    effect: "Autonomous inland ports locked to Belt & Road corridors",
  },
  {
    pillar: "Talent Pipeline",
    chinaScore: 79,
    usScore: 69,
    effect: "10M new technicians/year via AI vocational tutors",
  },
];

const PRODUCTION_PILLARS: ProductionPillar[] = RAW_PRODUCTION_PILLARS.map(
  (pillar) => ({
    ...pillar,
    delta: pillar.chinaScore - pillar.usScore,
  }),
);

const SUPPLY_CHAIN_PRESSURE: SupplyChainStage[] = [
  {
    stage: "Critical Minerals → Anodes/Cathodes",
    chinaControl: 72,
    usControl: 14,
    chokePoint: "Graphite & rare earth processing clusters",
  },
  {
    stage: "Power Electronics & Drives",
    chinaControl: 65,
    usControl: 22,
    chokePoint: "SiC/GaN module co-packaging",
  },
  {
    stage: "Advanced Machine Tools",
    chinaControl: 58,
    usControl: 28,
    chokePoint: "State-owned tool firms bundle financing",
  },
  {
    stage: "Logistics Orchestration",
    chinaControl: 69,
    usControl: 31,
    chokePoint: "Integrated rail-port control towers",
  },
];

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    window: "2025-2026",
    chinaMove:
      "Standing up National Production Board linking fiscal + industrial nets",
    usSignal: "State-level subsidies stay fragmented; slow permitting relief",
    warning: "Procurement lead times stretch to 180 days for key inputs",
  },
  {
    window: "2027-2028",
    chinaMove: "Provincial digital twins benchmark all suppliers nightly",
    usSignal: "Data standards debates delay cross-industry telemetry sharing",
    warning: "Operational visibility gap exceeds 20 percentage points",
  },
  {
    window: "2029-2030",
    chinaMove: "Sovereign supply-chain cloud automates trade finance",
    usSignal: "Dollar clearing remains manual for mid-market exporters",
    warning: "Working capital cost gap jumps to 350 bps",
  },
  {
    window: "2031-2033",
    chinaMove: "AI vocational system recycles displaced workers in 90 days",
    usSignal: "Reskilling tax incentives underutilized (<40% take rate)",
    warning: "Regional unemployment spikes in aerospace + auto belts",
  },
];

const OUTPUT_TRAJECTORY: OutputTrajectory[] = [
  { year: 2024, chinaShare: 32, usShare: 27, productivityGap: 5, automationIndex: 54 },
  { year: 2025, chinaShare: 33.5, usShare: 26.2, productivityGap: 7, automationIndex: 59 },
  { year: 2026, chinaShare: 35, usShare: 25, productivityGap: 8, automationIndex: 63 },
  { year: 2028, chinaShare: 38, usShare: 23, productivityGap: 11, automationIndex: 71 },
  { year: 2030, chinaShare: 41.5, usShare: 21.5, productivityGap: 14, automationIndex: 79 },
  { year: 2032, chinaShare: 44.7, usShare: 19.2, productivityGap: 18, automationIndex: 87 },
  { year: 2033, chinaShare: 46, usShare: 18.5, productivityGap: 19, automationIndex: 90 },
  { year: 2034, chinaShare: 47.2, usShare: 17.4, productivityGap: 21, automationIndex: 92 },
];

const READINESS_STAGES = [
  {
    name: "Automation blueprinting",
    pct: 12,
    insight: "Digital twins align 30,000 suppliers on takt times",
  },
  {
    name: "Capital velocity lock-in",
    pct: 30,
    insight: "Development banks pre-fund tool makers with green credit",
  },
  {
    name: "Supply pod localization",
    pct: 58,
    insight: "Modular fabs cluster around Tier-2 cities with shared utilities",
  },
  {
    name: "Services monetization",
    pct: 74,
    insight: "AI co-pilots resell optimization playbooks globally",
  },
  {
    name: "Global export dominance",
    pct: 100,
    insight: "Renminbi-settled manufacturing OS becomes default",
  },
];

const SHOCK_PHASES = [
  { message: "Scoring subsidy efficiency...", complexity: 0.65 },
  { message: "Routing exports through Belt & Road nodes...", complexity: 0.7 },
  { message: "Repricing downstream industries...", complexity: 0.82 },
  { message: "Modeling US employment shock...", complexity: 0.9 },
];

const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 20 * 60 * 1000,
  breakInterval: 6 * 60 * 1000,
  maxComplexityScore: 85,
  maxInformationDensity: 15,
  enableWarnings: true,
  enableAdaptivePacing: true,
});

const config = new ConfigBuilder()
  .theme(neonTheme)
  .logLevel("info")
  .enableHistory(true)
  .plugin(guardrails)
  .build();

const logger = new Logger(config);

const pacing = new AdaptivePacingController({
  baseSpeed: 1.0,
  minSpeed: 0.5,
  maxSpeed: 1.4,
  showPacingIndicators: true,
  allowAutoAdjust: true,
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function renderScenarioBanner(): void {
  BannerRenderer.render({
    title: "Sino-American Production System Simulation",
    subtitle: "What happens when China out-executes the US in manufacturing?",
    author: "GenesisTrace Narrative Lab",
    version: "v0.1 synthetic outlook",
    description: "Full-spectrum terminal presentation leveraging GenesisTrace",
    width: 100,
    style: "bold",
    color: ColorSystem.codes.magenta,
  });
}

function renderPrimer(): void {
  BoxRenderer.render([
    ColorSystem.colorize("Scenario Highlights", ColorSystem.codes.bright),
    "",
    "• Coordinated state-market system compresses product cycles to <8 weeks.",
    "• Belt & Road + digital yuan provides end-to-end clearing + logistics.",
    "• US firms face price discovery collapse on key capital goods.",
    "• Exported operating model pressures allies to pick standards.",
  ], {
    title: "📡 Strategic Primer",
    style: "rounded",
    padding: 1,
    color: ColorSystem.codes.cyan,
    maxWidth: 96,
  });
}

function renderProductionPillars(): void {
  logger.info("Comparing production pillars across both systems", {
    dataset: "Production Pillars",
    entries: PRODUCTION_PILLARS.length,
  });

  TableRenderer.render(
    PRODUCTION_PILLARS,
    [
      { key: "pillar", label: "Pillar", width: 26 },
      {
        key: "chinaScore",
        label: "China",
        align: "right",
        formatter: (value) => `${value}/100`,
      },
      {
        key: "usScore",
        label: "US",
        align: "right",
        formatter: (value) => `${value}/100`,
      },
      {
        key: "delta",
        label: "Advantage",
        align: "right",
        formatter: (value) =>
          value >= 0
            ? ColorSystem.colorize(`+${value}`, ColorSystem.codes.green)
            : ColorSystem.colorize(`${value}`, ColorSystem.codes.red),
      },
      { key: "effect", label: "Systemic Effect", width: 60 },
    ],
    {
      maxWidth: 120,
      padding: 1,
      rowSeparators: true,
      uppercaseHeaders: true,
    },
  );
}

function renderSupplyChainMatrix(): void {
  logger.info("Mapping supply chain control points", {
    dataset: "Supply Chain Pressure",
    chokepoints: SUPPLY_CHAIN_PRESSURE.length,
  });

  TableRenderer.render(
    SUPPLY_CHAIN_PRESSURE,
    [
      { key: "stage", label: "Stack Layer", width: 32 },
      {
        key: "chinaControl",
        label: "China Control",
        align: "right",
        formatter: (value) => `${value}%`,
      },
      {
        key: "usControl",
        label: "US Control",
        align: "right",
        formatter: (value) => `${value}%`,
      },
      { key: "chokePoint", label: "Chokepoint Dynamic", width: 45 },
    ],
    {
      maxWidth: 110,
      padding: 1,
      zebraStripes: true,
    },
  );
}

function renderTimeline(): void {
  logger.info("Simulating timeline pivots");
  TableRenderer.render(
    TIMELINE_EVENTS,
    [
      { key: "window", label: "Window" },
      { key: "chinaMove", label: "China Move", width: 45 },
      { key: "usSignal", label: "US Signal", width: 40 },
      {
        key: "warning",
        label: "Warning",
        width: 40,
        formatter: (value) =>
          ColorSystem.colorize(value, ColorSystem.codes.yellow),
      },
    ],
    {
      padding: 1,
      rowSeparators: true,
      uppercaseHeaders: true,
    },
  );
}

function renderTrajectoryCharts(): void {
  logger.info("Rendering share trajectories and productivity gap visuals", {
    years: OUTPUT_TRAJECTORY.length,
  });

  console.log(
    ColorSystem.colorize(
      "\nGlobal advanced manufacturing share (% of value-add)",
      ColorSystem.codes.magenta,
    ),
  );

  ChartRenderer.barChart(
    [
      { label: "China 2024", value: OUTPUT_TRAJECTORY[0].chinaShare },
      { label: "China 2034", value: OUTPUT_TRAJECTORY.at(-1)!.chinaShare },
      { label: "US 2024", value: OUTPUT_TRAJECTORY[0].usShare },
      { label: "US 2034", value: OUTPUT_TRAJECTORY.at(-1)!.usShare },
    ],
    {
      width: 40,
      color: ColorSystem.codes.green,
    },
  );

  console.log(
    ColorSystem.colorize(
      "\nProductivity gap index (China minus US)",
      ColorSystem.codes.cyan,
    ),
  );

  ChartRenderer.lineChart(
    OUTPUT_TRAJECTORY.map((entry) => entry.productivityGap),
    { colorize: true, width: 48, height: 10 },
  );

  const automationSparkline = ChartRenderer.sparkline(
    OUTPUT_TRAJECTORY.map((entry) => entry.automationIndex),
  );

  BoxRenderer.render([
    "Automation Uptake Sparkline",
    automationSparkline,
    "",
    `2024 index: ${OUTPUT_TRAJECTORY[0].automationIndex}`,
    `2034 index: ${OUTPUT_TRAJECTORY.at(-1)!.automationIndex}`,
  ], {
    title: "🤖 Automation Momentum",
    style: "rounded",
    color: ColorSystem.codes.blue,
  });

  console.log(
    ColorSystem.colorize(
      "\nSupply chain control share (synthetic)",
      ColorSystem.codes.yellow,
    ),
  );

  ChartRenderer.pieChart(
    [
      { label: "China Controlled Flow", value: 66 },
      { label: "US Controlled Flow", value: 24 },
      { label: "Neutral/3rd Countries", value: 10 },
    ],
  );
}

async function simulateReadinessRace(): Promise<void> {
  logger.info("Running readiness race with adaptive pacing");
  const progress = new ProgressBar({ total: 100, width: 50 });

  for (const stage of READINESS_STAGES) {
    progress.update(stage.pct);

    pacing.updateComprehension({
      progressMade: true,
      interactionCount: 3,
      complexityScore: Math.min(stage.pct / 100 + 0.5, 0.95),
    });

    logger.debug("Stage advanced", {
      stage: stage.name,
      completion: `${stage.pct}%`,
      insight: stage.insight,
    });

    await sleep(pacing.calculateDelay(900));
  }

  progress.complete();
}

async function simulateShockPropagation(): Promise<void> {
  logger.info("Running shock propagation drill");
  const spinner = new Spinner({ message: "Initializing simulation..." });
  spinner.start();

  try {
    for (const phase of SHOCK_PHASES) {
      spinner.update(phase.message);
      pacing.updateDifficulty(phase.complexity);
      pacing.updateComprehension({
        timeOnContent: 1200,
        complexityScore: phase.complexity,
      });
      await sleep(pacing.calculateDelay(1100));
    }

    spinner.succeed("Shock propagation model complete");
  } catch (error) {
    spinner.fail("Shock model interrupted");
    throw error;
  }
}

function renderAlerts(): void {
  BoxRenderer.message(
    "Price parity flips in electric vehicles and heavy machinery exports",
    "warning",
  );
  BoxRenderer.message(
    "Allied economies need interoperable production networks by 2028",
    "info",
  );
  BoxRenderer.message(
    "Dollar funding premium widens beyond 400 bps for manufacturing SMEs",
    "error",
  );
}

async function runPresentation(): Promise<void> {
  renderScenarioBanner();
  renderPrimer();
  await sleep(pacing.calculateDelay(800));

  renderProductionPillars();
  await sleep(pacing.calculateDelay(600));

  renderSupplyChainMatrix();
  await sleep(pacing.calculateDelay(600));

  renderTimeline();
  await sleep(pacing.calculateDelay(600));

  renderTrajectoryCharts();
  await sleep(pacing.calculateDelay(600));

  await simulateReadinessRace();
  await simulateShockPropagation();

  renderAlerts();

  logger.success("Scenario rendering complete", {
    sections: 7,
    guardrailsActive: true,
  });
}

if (import.meta.main) {
  runPresentation()
    .then(async () => {
      await logger.shutdown();
      Deno.exit(0);
    })
    .catch(async (error) => {
      console.error("Scenario failed:", error);
      await logger.shutdown();
      Deno.exit(1);
    });
}
