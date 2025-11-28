#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma City Chamber of Commerce - Economic Growth & Development Dashboard
 *
 * Professional animation lab demonstrating the Chamber's impact on regional economic development.
 *
 * Features demonstrated:
 *   - Executive banner with Chamber branding
 *   - Economic indicator animations with progress tracking
 *   - Member services and program showcase tables
 *   - Business pipeline spinner sequences
 *   - Regional competitiveness charts
 *   - Community impact metrics and success stories
 *   - Strategic initiative progress monitoring
 *   - Professional business-focused color scheme
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

// Helper function to format large currency values in abbreviated form
const formatLargeCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(1)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else {
    return Formatter.currency(amount);
  }
};

const runChamberDashboard = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. CHAMBER EXECUTIVE BANNER
  // ===========================================================================
  BannerRenderer.render({
    title: "OKLAHOMA CITY CHAMBER OF COMMERCE",
    subtitle: "Driving Economic Growth • Building Business Community • Advancing Regional Prosperity",
    description: "Strategic Economic Development Dashboard powered by GenesisTrace",
    version: "Q4 2024",
    author: "Economic Development Division",
    width: 100,
    style: "double",
    color: ColorSystem.codes.brightBlue,
  });
  console.log("");

  // ===========================================================================
  // 2. CHAMBER OPERATIONS LOGGER
  // ===========================================================================
  const chamberLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .timestampFormat("HH:mm:ss")
      .enableHistory(true)
      .maxHistorySize(500)
      .build(),
  );

  chamberLogger.info("Chamber dashboard initializing", {
    location: "Oklahoma City Metro",
    memberBusinesses: 2400,
    activePrograms: 48,
  });
  chamberLogger.success("Economic development analytics engine online");
  chamberLogger.debug("Data sources synced: BLS, Census Bureau, Metro Business Registry, State Commerce");
  console.log("");

  // ===========================================================================
  // 3. QUARTERLY ECONOMIC SNAPSHOT
  // ===========================================================================
  console.log(ColorSystem.colorize("  QUARTERLY ECONOMIC SNAPSHOT - OKC METRO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const quarter = "Q4 2024";
  const unemploymentRate = 0.034;
  const gdpGrowth = 0.038;
  const populationGrowth = 0.021;

  BoxRenderer.render(
    [
      `Reporting Period: ${ColorSystem.colorize(quarter, ColorSystem.codes.brightCyan)} (Oct-Dec 2024)`,
      `Metro Unemployment Rate: ${Formatter.percentage(unemploymentRate, 1)} ${ColorSystem.colorize("↓ 0.4% YoY", ColorSystem.codes.brightGreen)}`,
      `Regional GDP Growth: ${Formatter.percentage(gdpGrowth, 1)} ${ColorSystem.colorize("↑ 1.2% vs National", ColorSystem.codes.brightGreen)}`,
      `Population Growth: ${Formatter.percentage(populationGrowth, 1)} annually ${ColorSystem.colorize("(15th fastest-growing US metro)", ColorSystem.codes.brightCyan)}`,
      `Business Climate Index: ${ColorSystem.colorize("92/100", ColorSystem.codes.brightGreen)} • "Highly Competitive"`,
    ],
    {
      title: "Metro Economic Vitals",
      style: "double",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. CHAMBER MEMBER SERVICES PORTFOLIO
  // ===========================================================================
  console.log(ColorSystem.colorize("  CHAMBER MEMBER SERVICES PORTFOLIO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const memberServices = [
    { service: "Business Networking Events", q4Events: 24, attendance: 1847, engagement: "97% satisfaction" },
    { service: "Legislative Advocacy & Policy", initiatives: 12, billsSupported: 8, impact: "3 enacted into law" },
    { service: "Workforce Development Programs", participants: 542, placements: 412, retention: "89% @ 12 months" },
    { service: "Economic Research Reports", publications: 6, downloads: 3420, scope: "Metro trends & forecasts" },
    { service: "Small Business Counseling", sessions: 178, businesses: 156, outcome: "82% revenue growth" },
    { service: "International Trade Support", companies: 34, markets: 18, exports: "$24.3M facilitated" },
  ];

  TableRenderer.render(
    memberServices,
    [
      { key: "service", label: "Service Category", width: 32 },
      { key: "q4Events", label: "Q4 Activities", width: 14, align: "center" },
      { key: "attendance", label: "Reach/Volume", width: 14, align: "center" },
      { key: "engagement", label: "Impact Metric", width: 28 },
    ],
    { showIndex: true },
  );
  console.log("");
  chamberLogger.info("Member services portfolio rendered", { servicesActive: memberServices.length });

  // ===========================================================================
  // 5. ECONOMIC DEVELOPMENT PIPELINE ANIMATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  ECONOMIC DEVELOPMENT PIPELINE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const pipelineSpinner = new Spinner({
    message: "Identifying high-value business prospects...",
    frames: ["◰", "◳", "◲", "◱"],
    interval: 100,
  });

  pipelineSpinner.start();
  await sleep(700);
  pipelineSpinner.update("Conducting site tours with C-suite executives...");
  await sleep(800);
  pipelineSpinner.update("Coordinating with State Commerce & city officials...");
  await sleep(750);
  pipelineSpinner.update("Negotiating incentive packages & tax agreements...");
  await sleep(850);
  pipelineSpinner.update("Finalizing relocation & expansion commitments...");
  await sleep(900);
  pipelineSpinner.succeed("Q4 Pipeline: 7 businesses committed • $142M capital investment • 1,240 projected jobs");
  console.log("");

  chamberLogger.success("Economic development pipeline progressing on schedule", {
    activeProspects: 23,
    siteTours: 14,
    commitments: 7,
  });
  console.log("");

  // ===========================================================================
  // 6. REGIONAL BUSINESS GROWTH INDICATORS
  // ===========================================================================
  console.log(ColorSystem.colorize("  REGIONAL BUSINESS GROWTH INDICATORS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const growthIndicators = [
    { indicator: "Business Formation Rate", target: 100, current: 87, trend: "↑ 12% QoQ" },
    { indicator: "Employment Index", target: 100, current: 94, trend: "↑ 3.2% YoY" },
    { indicator: "Capital Investment Attraction", target: 100, current: 78, trend: "↑ 18% QoQ" },
    { indicator: "Member Retention & Growth", target: 100, current: 92, trend: "↑ 5% annual" },
  ];

  for (const indicator of growthIndicators) {
    console.log(
      `${ColorSystem.colorize(indicator.indicator, ColorSystem.codes.brightBlue)} ${ColorSystem.colorize(indicator.trend, ColorSystem.codes.dim)}`,
    );
    const bar = new ProgressBar({
      total: indicator.target,
      width: 50,
      colorize: true,
      showPercentage: true,
      showValue: false,
    });
    bar.update(indicator.current);
    bar.complete();
    console.log("");
  }

  // ===========================================================================
  // 7. MONTHLY JOB CREATION TRENDS
  // ===========================================================================
  console.log(ColorSystem.colorize("  MONTHLY JOB CREATION TRENDS (2024)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const jobCreationData = [
    { label: "Jul", value: 847 },
    { label: "Aug", value: 923 },
    { label: "Sep", value: 1156 },
    { label: "Oct", value: 1342 },
    { label: "Nov", value: 1289 },
    { label: "Dec", value: 1508 },
  ];

  ChartRenderer.barChart(jobCreationData, {
    width: 60,
    showValues: true,
    color: ColorSystem.codes.brightGreen,
    title: "Net New Jobs (Metro OKC)",
  });
  console.log("");

  const totalJobs = jobCreationData.reduce((sum, month) => sum + month.value, 0);
  chamberLogger.info("H2 2024 job creation analyzed", {
    totalNewJobs: Formatter.number(totalJobs),
    avgPerMonth: Math.round(totalJobs / jobCreationData.length),
    trajectory: "Accelerating",
  });
  console.log("");

  // ===========================================================================
  // 8. STRATEGIC PRIORITY INITIATIVES (2024)
  // ===========================================================================
  console.log(ColorSystem.colorize("  2024 STRATEGIC PRIORITY INITIATIVES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const strategicInitiatives = [
    { priority: "Innovation District Expansion", completion: 0.82, notes: "3 new anchor tenants secured, infrastructure 90% complete" },
    { priority: "Aerospace & Defense Cluster Growth", completion: 0.74, notes: "Tinker AFB collaboration deepened, 4 suppliers recruited" },
    { priority: "Energy Transition Hub Development", completion: 0.68, notes: "Renewables & clean tech companies engaging site selection" },
    { priority: "Talent Pipeline & Workforce Readiness", completion: 0.91, notes: "Community college partnerships expanded, 500+ certified" },
  ];

  for (const initiative of strategicInitiatives) {
    const bar = new ProgressBar({
      total: 100,
      width: 48,
      colorize: true,
      showPercentage: true,
      showValue: false,
    });
    bar.update(Math.round(initiative.completion * 100));
    bar.complete();
    console.log(`${ColorSystem.colorize(initiative.priority, ColorSystem.codes.brightCyan)}`);
    console.log(`  ${ColorSystem.colorize(initiative.notes, ColorSystem.codes.dim)}`);
    console.log("");
  }

  chamberLogger.success("Strategic initiatives tracking above 70% completion average");
  console.log("");

  // ===========================================================================
  // 9. INDUSTRY SECTOR DIVERSIFICATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  INDUSTRY SECTOR EMPLOYMENT DISTRIBUTION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const sectorDistribution = [
    { sector: "Aerospace & Defense", jobs: 42800, share: "12.4%", growth: "+3.8% YoY" },
    { sector: "Energy (Oil, Gas, Renewables)", jobs: 38200, share: "11.1%", growth: "+1.2% YoY" },
    { sector: "Healthcare & Biosciences", jobs: 67500, share: "19.6%", growth: "+4.3% YoY" },
    { sector: "Information & Technology", jobs: 28900, share: "8.4%", growth: "+7.9% YoY" },
    { sector: "Transportation & Logistics", jobs: 31400, share: "9.1%", growth: "+2.1% YoY" },
    { sector: "Finance & Professional Services", jobs: 52100, share: "15.1%", growth: "+2.9% YoY" },
    { sector: "Other Sectors", jobs: 83600, share: "24.3%", growth: "+1.5% YoY" },
  ];

  TableRenderer.render(
    sectorDistribution,
    [
      { key: "sector", label: "Industry Sector", width: 36 },
      { key: "jobs", label: "Employment", width: 14, align: "right", formatter: (v) => Formatter.number(v) },
      { key: "share", label: "Share", width: 10, align: "center" },
      { key: "growth", label: "YoY Growth", width: 14, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalEmployment = sectorDistribution.reduce((sum, sector) => sum + sector.jobs, 0);
  BoxRenderer.render(
    [
      `Total Metro Employment: ${Formatter.number(totalEmployment)} jobs`,
      `Most Diversified Sectors: Healthcare (19.6%), Finance (15.1%), Aerospace (12.4%)`,
      `Fastest Growing: ${ColorSystem.colorize("Information & Technology (+7.9% YoY)", ColorSystem.codes.brightGreen)}`,
      `Economic Diversification Index: ${ColorSystem.colorize("8.2/10", ColorSystem.codes.brightCyan)} (Excellent balance)`,
    ],
    {
      title: "Sector Analysis Summary",
      style: "single",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 10. BUSINESS RECRUITMENT SUCCESS STORIES
  // ===========================================================================
  console.log(ColorSystem.colorize("  Q4 2024 BUSINESS RECRUITMENT HIGHLIGHTS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const recruitmentStories = [
    { company: "Vanguard Aerospace Systems", industry: "Aerospace Manufacturing", investment: 28500000, jobs: 185, location: "Will Rogers Airport District" },
    { company: "Prairie Tech Solutions", industry: "Software Development", investment: 4200000, jobs: 92, location: "Innovation District" },
    { company: "Meridian Logistics Hub", industry: "Distribution & Warehousing", investment: 52000000, jobs: 340, location: "I-40 Corridor" },
    { company: "SunBridge Renewable Energy", industry: "Clean Energy", investment: 67000000, jobs: 128, location: "Energy Corridor" },
  ];

  TableRenderer.render(
    recruitmentStories,
    [
      { key: "company", label: "Company", width: 28 },
      { key: "industry", label: "Industry", width: 26 },
      { key: "investment", label: "Capital Investment", width: 18, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "jobs", label: "Jobs", width: 8, align: "center" },
      { key: "location", label: "OKC Location", width: 24 },
    ],
    { showIndex: true },
  );
  console.log("");

  const totalInvestment = recruitmentStories.reduce((sum, story) => sum + story.investment, 0);
  const totalNewJobs = recruitmentStories.reduce((sum, story) => sum + story.jobs, 0);

  chamberLogger.success("Q4 business recruitment exceeded targets", {
    companies: recruitmentStories.length,
    capitalInvestment: formatLargeCurrency(totalInvestment),
    projectedJobs: totalNewJobs,
  });
  console.log("");

  // ===========================================================================
  // 11. COMPETITIVE POSITIONING ANALYSIS
  // ===========================================================================
  console.log(ColorSystem.colorize("  REGIONAL COMPETITIVE POSITIONING", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const competitiveSpinner = new Spinner({
    message: "Analyzing regional competitiveness metrics...",
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    interval: 90,
  });

  competitiveSpinner.start();
  await sleep(900);
  competitiveSpinner.succeed("Benchmarking complete: OKC vs peer metros (Austin, Nashville, Raleigh, Denver)");
  console.log("");

  const competitiveMetrics = [
    { metric: "Cost of Living Index", okcScore: 87, peerAverage: 104, advantage: "17 points lower" },
    { metric: "Business Tax Burden", okcScore: 92, peerAverage: 88, advantage: "Competitive" },
    { metric: "Talent Availability", okcScore: 85, peerAverage: 91, advantage: "Development focus" },
    { metric: "Infrastructure Quality", okcScore: 88, peerAverage: 86, advantage: "2 points higher" },
    { metric: "Quality of Life", okcScore: 83, peerAverage: 89, advantage: "Rising rapidly" },
  ];

  TableRenderer.render(
    competitiveMetrics,
    [
      { key: "metric", label: "Competitive Factor", width: 28 },
      { key: "okcScore", label: "OKC Score", width: 12, align: "center" },
      { key: "peerAverage", label: "Peer Avg", width: 12, align: "center" },
      { key: "advantage", label: "Competitive Position", width: 26 },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 12. CHAMBER IMPACT METRICS
  // ===========================================================================
  console.log(ColorSystem.colorize("  2024 CHAMBER IMPACT METRICS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const chamberImpact = [
    { label: "Total Member Businesses", value: "2,400 companies (↑ 8% from 2023)" },
    { label: "Economic Development Wins", value: "23 business commitments facilitated" },
    { label: "Capital Investment Attracted", value: formatLargeCurrency(487000000) + " in 2024" },
    { label: "Jobs Created/Retained", value: "4,680 positions through Chamber efforts" },
    { label: "Legislative Victories", value: "12 priority bills advanced, 3 enacted" },
    { label: "Workforce Training Graduates", value: "1,247 individuals certified & placed" },
    { label: "Events & Networking", value: "142 events with 18,400+ attendees" },
    { label: "Member Satisfaction Rating", value: "94% (highest in Chamber history)" },
  ];

  TableRenderer.renderKeyValue(chamberImpact);
  console.log("");

  // ===========================================================================
  // 13. FINAL SUMMARY
  // ===========================================================================
  BoxRenderer.render(
    [
      ColorSystem.colorize("Oklahoma City Chamber of Commerce 2024 Performance Summary", ColorSystem.codes.brightCyan),
      "",
      "✓ Economic development pipeline delivering consistent wins",
      "✓ Regional job creation trending upward (+12% vs 2023)",
      "✓ Industry diversification strengthening metro resilience",
      "✓ Member services engagement at all-time high",
      "✓ Strategic initiatives 75%+ complete across all priorities",
      "",
      ColorSystem.colorize("Looking Forward: 2025 Strategic Focus", ColorSystem.codes.brightBlue),
      "• Expand innovation district with tech & biomedical clusters",
      "• Deepen aerospace supply chain integration around Tinker AFB",
      "• Launch OKC Energy Transition Hub for renewables & cleantech",
      "• Scale workforce development programs with education partners",
      "",
      "Building a stronger, more prosperous Oklahoma City together.",
    ],
    {
      title: "Executive Summary & 2025 Outlook",
      style: "double",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  chamberLogger.success("Oklahoma City Chamber of Commerce dashboard presentation complete");
  chamberLogger.info("Data refreshed and ready for executive review");
  console.log("");
  console.log(
    ColorSystem.colorize(
      "  Oklahoma City Chamber of Commerce – Advancing Regional Prosperity Since 1889 🏛️\n",
      ColorSystem.codes.brightBlue,
    ),
  );
};

await runChamberDashboard();
