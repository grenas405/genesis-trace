#!/usr/bin/env -S deno run --allow-read

/**
 * AI + Cloud Market Capitalization Report
 *
 * Demonstrates how to use GenesisTrace components to deliver a rich
 * market briefing that blends tables, charts, boxes, and structured
 * logging. Valuations are synthetic but proportional to March 2025
 * public disclosures so you can plug in live data sources later.
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

type SegmentName =
  | "Hyperscale Cloud Platforms"
  | "AI Compute & Accelerators"
  | "Enterprise AI SaaS"
  | "Data Infrastructure & Security";

interface CompanyValuation {
  name: string;
  ticker: string;
  segment: SegmentName;
  marketCap: number; // USD billions
  yoyGrowth: number; // decimal (e.g., 0.25 = 25%)
  aiExposure: number; // decimal share of revenue tied to AI/cloud
  focus: string;
}

interface SegmentSummary {
  name: SegmentName;
  totalCap: number;
  weightedGrowth: number;
  avgAiExposure: number;
  companies: CompanyValuation[];
}

const COMPANY_VALUATIONS: CompanyValuation[] = [
  {
    name: "Microsoft",
    ticker: "MSFT",
    segment: "Hyperscale Cloud Platforms",
    marketCap: 3150,
    yoyGrowth: 0.23,
    aiExposure: 0.38,
    focus: "Copilot + Azure AI services embedded across stack",
  },
  {
    name: "Amazon",
    ticker: "AMZN",
    segment: "Hyperscale Cloud Platforms",
    marketCap: 1900,
    yoyGrowth: 0.31,
    aiExposure: 0.33,
    focus: "AWS Bedrock, Q assistants, and Trainium/Inferentia ramp",
  },
  {
    name: "Alphabet",
    ticker: "GOOGL",
    segment: "Hyperscale Cloud Platforms",
    marketCap: 1850,
    yoyGrowth: 0.27,
    aiExposure: 0.35,
    focus: "Gemini-powered Search + Google Cloud AI platform",
  },
  {
    name: "NVIDIA",
    ticker: "NVDA",
    segment: "AI Compute & Accelerators",
    marketCap: 2250,
    yoyGrowth: 1.78,
    aiExposure: 0.92,
    focus: "Hopper/B100 systems and CUDA software moat",
  },
  {
    name: "AMD",
    ticker: "AMD",
    segment: "AI Compute & Accelerators",
    marketCap: 320,
    yoyGrowth: 0.87,
    aiExposure: 0.71,
    focus: "MI300X accelerator ramp + Ryzen AI PC attach",
  },
  {
    name: "Broadcom",
    ticker: "AVGO",
    segment: "AI Compute & Accelerators",
    marketCap: 660,
    yoyGrowth: 0.55,
    aiExposure: 0.52,
    focus: "Custom AI ASIC, switching silicon, and networking",
  },
  {
    name: "Salesforce",
    ticker: "CRM",
    segment: "Enterprise AI SaaS",
    marketCap: 320,
    yoyGrowth: 0.32,
    aiExposure: 0.41,
    focus: "Einstein Copilot woven into CRM + analytics clouds",
  },
  {
    name: "ServiceNow",
    ticker: "NOW",
    segment: "Enterprise AI SaaS",
    marketCap: 175,
    yoyGrowth: 0.47,
    aiExposure: 0.57,
    focus: "AI agents driving workflow automation and GenAI ops",
  },
  {
    name: "Adobe",
    ticker: "ADBE",
    segment: "Enterprise AI SaaS",
    marketCap: 280,
    yoyGrowth: 0.18,
    aiExposure: 0.28,
    focus: "Firefly content generation layered on Creative Cloud",
  },
  {
    name: "Snowflake",
    ticker: "SNOW",
    segment: "Enterprise AI SaaS",
    marketCap: 80,
    yoyGrowth: 0.25,
    aiExposure: 0.49,
    focus: "AI-ready data cloud + Cortex inference services",
  },
  {
    name: "Oracle",
    ticker: "ORCL",
    segment: "Data Infrastructure & Security",
    marketCap: 410,
    yoyGrowth: 0.29,
    aiExposure: 0.44,
    focus: "Autonomous DB + OCI GPU clusters",
  },
  {
    name: "Datadog",
    ticker: "DDOG",
    segment: "Data Infrastructure & Security",
    marketCap: 125,
    yoyGrowth: 0.42,
    aiExposure: 0.46,
    focus: "Observability platform with AI pattern detection",
  },
  {
    name: "CrowdStrike",
    ticker: "CRWD",
    segment: "Data Infrastructure & Security",
    marketCap: 97,
    yoyGrowth: 0.57,
    aiExposure: 0.63,
    focus: "Falcon XDR copilots automating SOC workflows",
  },
  {
    name: "Palantir",
    ticker: "PLTR",
    segment: "Data Infrastructure & Security",
    marketCap: 62,
    yoyGrowth: 0.66,
    aiExposure: 0.71,
    focus: "AI Platform (AIP) as defense + industrial operating system",
  },
];

const SEGMENT_SIGNALS: Record<SegmentName, string> = {
  "Hyperscale Cloud Platforms":
    "Copilot/Gemini workloads push >$120B annualized AI run-rate for Azure, AWS, GCP.",
  "AI Compute & Accelerators":
    "Silicon supply stays constrainted through 2026; pricing power remains with GPU vendors.",
  "Enterprise AI SaaS":
    "Workflow + creativity suites are layering copilots onto recurring ARR bases.",
  "Data Infrastructure & Security":
    "Telemetry, observability, and SOC automation monetize AI-native data exhaust.",
};

const REPORT_CONTEXT = {
  period: "March 2025 (synthetic demo data)",
  currency: "USD (billions)",
};

const formatMarketCap = (value: number): string => {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}T`;
  }
  return `$${value.toFixed(0)}B`;
};

function summarizeSegments(data: CompanyValuation[]): SegmentSummary[] {
  const map = new Map<SegmentName, {
    name: SegmentName;
    totalCap: number;
    weightedGrowthSum: number;
    aiExposureSum: number;
    companies: CompanyValuation[];
  }>();

  for (const company of data) {
    if (!map.has(company.segment)) {
      map.set(company.segment, {
        name: company.segment,
        totalCap: 0,
        weightedGrowthSum: 0,
        aiExposureSum: 0,
        companies: [],
      });
    }

    const entry = map.get(company.segment)!;
    entry.totalCap += company.marketCap;
    entry.weightedGrowthSum += company.marketCap * company.yoyGrowth;
    entry.aiExposureSum += company.marketCap * company.aiExposure;
    entry.companies.push(company);
  }

  return Array.from(map.values())
    .map((entry) => ({
      name: entry.name,
      totalCap: entry.totalCap,
      weightedGrowth: entry.weightedGrowthSum / entry.totalCap,
      avgAiExposure: entry.aiExposureSum / entry.totalCap,
      companies: entry.companies,
    }))
    .sort((a, b) => b.totalCap - a.totalCap);
}

function buildInsights(
  segments: SegmentSummary[],
  totalCap: number,
): string[] {
  const nvidia = COMPANY_VALUATIONS.find((c) => c.ticker === "NVDA");
  const hyperscale = segments.find((segment) => segment.name === "Hyperscale Cloud Platforms");
  const enterprise = segments.find((segment) => segment.name === "Enterprise AI SaaS");
  const dataSec = segments.find((segment) => segment.name === "Data Infrastructure & Security");

  const insights: string[] = [];
  if (nvidia) {
    const share = (nvidia.marketCap / totalCap) * 100;
    insights.push(
      `NVIDIA alone equals ${
        share.toFixed(1)
      }% of tracked AI + cloud value, underscoring ongoing GPU supply gating new AI budgets.`,
    );
  }
  if (hyperscale) {
    insights.push(
      `Hyperscalers control ${(hyperscale.totalCap / totalCap * 100).toFixed(1)}% of value (${
        formatMarketCap(hyperscale.totalCap)
      }), with weighted growth at ${
        (hyperscale.weightedGrowth * 100).toFixed(1)
      }% as copilots convert Microsoft 365 + AWS consumption.`,
    );
  }
  if (enterprise) {
    insights.push(
      `Enterprise AI SaaS hits ${
        (enterprise.totalCap / totalCap * 100).toFixed(1)
      }% share while averaging ${
        (enterprise.avgAiExposure * 100).toFixed(0)
      }% AI revenue mix — proof that copilots are now bundled into workflow ARR.`,
    );
  }
  if (dataSec) {
    insights.push(
      `Data infrastructure + security vendors deliver ${
        (dataSec.weightedGrowth * 100).toFixed(1)
      }% weighted YoY as observability and SOC copilots monetize AI-native telemetry.`,
    );
  }

  const top3 = [...COMPANY_VALUATIONS].sort((a, b) => b.marketCap - a.marketCap).slice(0, 3);
  const concentration = top3.reduce((sum, company) => sum + company.marketCap, 0);
  insights.push(
    `Top three names (${top3.map((c) => c.ticker).join(", ")}) capture ${
      (concentration / totalCap * 100).toFixed(1)
    }% of market cap — concentration risk remains elevated.`,
  );

  return insights;
}

async function main() {
  const config = new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build();

  const logger = new Logger(config);

  BannerRenderer.render({
    title: "AI + CLOUD MARKET CAP RADAR",
    subtitle: "Tracking how compute, hyperscale, and enterprise AI consolidate value",
    version: REPORT_CONTEXT.period,
    author: "GenesisTrace Research Desk",
    style: "double",
    width: 96,
    color: ColorSystem.codes.brightCyan,
  });

  const totalMarketCap = COMPANY_VALUATIONS.reduce((sum, company) => sum + company.marketCap, 0);
  const weightedGrowth = COMPANY_VALUATIONS.reduce(
    (sum, company) => sum + company.marketCap * company.yoyGrowth,
    0,
  ) / totalMarketCap;
  const weightedAiExposure = COMPANY_VALUATIONS.reduce(
    (sum, company) => sum + company.marketCap * company.aiExposure,
    0,
  ) / totalMarketCap;

  logger.info("Loading market capitalization snapshot", {
    companies: COMPANY_VALUATIONS.length,
    totalMarketCap: formatMarketCap(totalMarketCap),
    reportPeriod: REPORT_CONTEXT.period,
  });

  console.log();
  TableRenderer.renderKeyValue([
    { label: "Tracked Companies", value: String(COMPANY_VALUATIONS.length) },
    { label: "Aggregate Market Cap", value: formatMarketCap(totalMarketCap) },
    { label: "Weighted YoY Growth", value: `${(weightedGrowth * 100).toFixed(1)}%` },
    { label: "AI Revenue Mix", value: `${(weightedAiExposure * 100).toFixed(0)}% weighted` },
    {
      label: "Top 3 Concentration",
      value: `${
        (COMPANY_VALUATIONS.slice(0, 3).reduce((acc, company) => acc + company.marketCap, 0) /
          totalMarketCap * 100).toFixed(1)
      }%`,
    },
    { label: "Reporting Basis", value: REPORT_CONTEXT.currency },
    { label: "Period", value: REPORT_CONTEXT.period },
  ]);

  console.log();
  console.log(ColorSystem.colorize("SEGMENT BREAKDOWN", ColorSystem.codes.bright));
  console.log();

  const segmentSummaries = summarizeSegments(COMPANY_VALUATIONS);
  TableRenderer.render(
    segmentSummaries.map((segment) => ({
      segment: segment.name,
      marketCap: formatMarketCap(segment.totalCap),
      share: `${(segment.totalCap / totalMarketCap * 100).toFixed(1)}%`,
      yoy: `${(segment.weightedGrowth * 100).toFixed(1)}%`,
      ai: `${(segment.avgAiExposure * 100).toFixed(0)}%`,
      signal: SEGMENT_SIGNALS[segment.name],
    })),
    [
      { key: "segment", label: "Segment", width: 30 },
      { key: "marketCap", label: "Market Cap", width: 14, align: "right" },
      { key: "share", label: "Universe Share", width: 16, align: "right" },
      { key: "yoy", label: "Weighted YoY", width: 16, align: "right" },
      { key: "ai", label: "AI Mix", width: 10, align: "right" },
      { key: "signal", label: "Signal", width: 60 },
    ],
  );

  console.log();
  console.log(ColorSystem.colorize("TOP MARKET CAP LEADERS", ColorSystem.codes.bright));
  console.log();

  const topLeaders = [...COMPANY_VALUATIONS].sort((a, b) => b.marketCap - a.marketCap).slice(0, 8);
  ChartRenderer.barChart(
    topLeaders.map((company) => ({
      label: company.ticker,
      value: Math.round(company.marketCap),
    })),
    {
      width: 70,
      showValues: true,
      unit: "B",
      title: "Market Cap (USD billions)",
      colors: [
        ColorSystem.codes.brightCyan,
        ColorSystem.codes.cyan,
        ColorSystem.codes.brightGreen,
        ColorSystem.codes.green,
        ColorSystem.codes.brightMagenta,
        ColorSystem.codes.magenta,
        ColorSystem.codes.brightYellow,
        ColorSystem.codes.yellow,
      ],
    },
  );

  console.log();
  console.log(ColorSystem.colorize("COMPANY DETAIL", ColorSystem.codes.bright));
  console.log();

  TableRenderer.render(
    COMPANY_VALUATIONS.map((company) => ({
      company: `${company.name} (${company.ticker})`,
      segment: company.segment,
      cap: formatMarketCap(company.marketCap),
      growth: `${(company.yoyGrowth * 100).toFixed(1)}%`,
      ai: `${(company.aiExposure * 100).toFixed(0)}%`,
      focus: company.focus,
    })),
    [
      { key: "company", label: "Company", width: 26 },
      { key: "segment", label: "Segment", width: 28 },
      { key: "cap", label: "Market Cap", width: 14, align: "right" },
      { key: "growth", label: "YoY", width: 10, align: "right" },
      { key: "ai", label: "AI Mix", width: 10, align: "right" },
      { key: "focus", label: "Where AI/Cloud Value Lands", width: 64 },
    ],
  );

  console.log();
  BoxRenderer.render(buildInsights(segmentSummaries, totalMarketCap), {
    title: "Key Observations",
    style: "double",
    color: ColorSystem.codes.green,
    minWidth: 92,
  });

  console.log();
  BoxRenderer.render(
    [
      "Methodology: market caps expressed in USD billions, rounded for readability.",
      "YoY Growth represents reported/expected year-over-year change in total enterprise value.",
      "AI Mix is a weighted estimate of revenue tied directly to AI or cloud workloads.",
      "Replace the synthetic COMPANY_VALUATIONS array with live API data to operationalize.",
    ],
    {
      title: "Notes",
      style: "rounded",
      color: ColorSystem.codes.cyan,
      minWidth: 90,
    },
  );

  console.log();
  logger.success("AI + cloud market report rendered", {
    dominantSegments: segmentSummaries.slice(0, 2).map((segment) => segment.name),
    period: REPORT_CONTEXT.period,
  });
}

if (import.meta.main) {
  await main();
}
