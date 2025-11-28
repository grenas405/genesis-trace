#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Devon Energy Corporation - Operational Excellence Dashboard
 *
 * Motivational and inspiring animation lab demonstrating Devon Energy's leadership
 * in energy innovation, operational excellence, and community stewardship.
 *
 * Features demonstrated:
 *   - Executive banner with Devon Energy branding
 *   - Real-time production metrics and operational dashboards
 *   - Safety culture and performance tracking
 *   - Technology innovation and digital transformation
 *   - Environmental stewardship and sustainability initiatives
 *   - Community investment and social responsibility
 *   - Employee development and culture excellence
 *   - Basin-by-basin production analytics
 *   - Strategic vision for energy transition
 *   - Professional energy sector color scheme
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

// Helper function to format large numbers with units
const formatProduction = (amount: number, unit: string): string => {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M ${unit}`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K ${unit}`;
  } else {
    return `${amount} ${unit}`;
  }
};

const formatLargeCurrency = (amount: number): string => {
  if (amount >= 1000000000) {
    return `$${(amount / 1000000000).toFixed(2)}B`;
  } else if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  } else {
    return Formatter.currency(amount);
  }
};

const runDevonEnergyDashboard = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. DEVON ENERGY EXECUTIVE BANNER
  // ===========================================================================
  BannerRenderer.render({
    title: "DEVON ENERGY CORPORATION",
    subtitle: "Leading Energy Innovation • Operational Excellence • Responsible Resource Development",
    description: "Enterprise Operations Dashboard - Powered by GenesisTrace Technology",
    version: "Q4 2024",
    author: "Corporate Operations Center - Oklahoma City, OK",
    width: 110,
    style: "double",
    color: ColorSystem.codes.brightGreen,
  });
  console.log("");

  // ===========================================================================
  // 2. DEVON OPERATIONS LOGGER
  // ===========================================================================
  const devonLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .timestampFormat("HH:mm:ss")
      .enableHistory(true)
      .maxHistorySize(1000)
      .build(),
  );

  devonLogger.info("Devon Energy operations dashboard initializing", {
    headquarters: "Oklahoma City, OK",
    operatingBasins: 5,
    employees: 1900,
    yearFounded: 1971,
  });
  devonLogger.success("Real-time operational data streams connected");
  devonLogger.debug("Data sources: SCADA systems, field automation, production databases, safety management");
  console.log("");

  // ===========================================================================
  // 3. COMPANY MISSION & VALUES
  // ===========================================================================
  console.log(ColorSystem.colorize("  DEVON ENERGY MISSION & CORE VALUES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("MISSION:", ColorSystem.codes.brightCyan),
      "To be the premier independent oil and natural gas exploration and production company",
      "by delivering energy safely, responsibly, and efficiently while creating value for stakeholders.",
      "",
      ColorSystem.colorize("CORE VALUES:", ColorSystem.codes.brightGreen),
      "• ${ColorSystem.colorize('SAFETY FIRST', ColorSystem.codes.brightYellow)} - Protecting our people, communities, and environment",
      "• ${ColorSystem.colorize('INTEGRITY', ColorSystem.codes.brightBlue)} - Operating with honesty, transparency, and ethical standards",
      "• ${ColorSystem.colorize('RESPECT', ColorSystem.codes.brightMagenta)} - Valuing every individual and diverse perspectives",
      "• ${ColorSystem.colorize('INNOVATION', ColorSystem.codes.brightCyan)} - Driving continuous improvement through technology",
      "• ${ColorSystem.colorize('EXCELLENCE', ColorSystem.codes.brightGreen)} - Delivering superior operational and financial performance",
    ],
    {
      title: "Devon Energy - Our Purpose",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. REAL-TIME PRODUCTION DASHBOARD
  // ===========================================================================
  console.log(ColorSystem.colorize("  REAL-TIME PRODUCTION OPERATIONS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const productionSpinner = new Spinner({
    message: "Connecting to field production systems...",
    frames: ["◐", "◓", "◑", "◒"],
    interval: 120,
  });

  productionSpinner.start();
  await sleep(800);
  productionSpinner.update("Syncing SCADA telemetry from 4,200+ wells...");
  await sleep(900);
  productionSpinner.update("Aggregating basin-level production metrics...");
  await sleep(850);
  productionSpinner.update("Calculating real-time production rates...");
  await sleep(750);
  productionSpinner.succeed("Production data synchronized - All systems operational");
  console.log("");

  const q4Production = {
    oil: 342000, // barrels per day
    naturalGas: 1450000, // thousand cubic feet per day (Mcf/d)
    ngl: 87000, // barrels per day (natural gas liquids)
  };

  const totalBoePerDay = q4Production.oil + q4Production.ngl + (q4Production.naturalGas / 6); // Convert Mcf to BOE

  BoxRenderer.render(
    [
      `${ColorSystem.colorize("Q4 2024 AVERAGE DAILY PRODUCTION", ColorSystem.codes.brightCyan)}`,
      "",
      `Oil Production: ${ColorSystem.colorize(formatProduction(q4Production.oil, "barrels/day"), ColorSystem.codes.brightGreen)} ${ColorSystem.colorize("↑ 8% YoY", ColorSystem.codes.green)}`,
      `Natural Gas: ${ColorSystem.colorize(formatProduction(q4Production.naturalGas, "Mcf/day"), ColorSystem.codes.brightBlue)} ${ColorSystem.colorize("↑ 5% YoY", ColorSystem.codes.blue)}`,
      `NGLs: ${ColorSystem.colorize(formatProduction(q4Production.ngl, "barrels/day"), ColorSystem.codes.brightMagenta)} ${ColorSystem.colorize("↑ 7% YoY", ColorSystem.codes.magenta)}`,
      "",
      `Total Production: ${ColorSystem.colorize(formatProduction(Math.round(totalBoePerDay), "BOE/day"), ColorSystem.codes.brightYellow)}`,
      `Operating Wells: ${ColorSystem.colorize("4,247 active", ColorSystem.codes.cyan)} across 5 premier basins`,
      `System Uptime: ${ColorSystem.colorize("98.7%", ColorSystem.codes.brightGreen)} (Industry-leading reliability)`,
    ],
    {
      title: "Production Excellence Metrics",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  devonLogger.success("Production targets exceeded for 7th consecutive quarter", {
    dailyProduction: `${Math.round(totalBoePerDay).toLocaleString()} BOE/day`,
    wellCount: 4247,
    uptime: "98.7%",
  });
  console.log("");

  // ===========================================================================
  // 5. PRODUCTION BY BASIN
  // ===========================================================================
  console.log(ColorSystem.colorize("  PRODUCTION BY OPERATING BASIN", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const basinProduction = [
    { basin: "Delaware Basin (New Mexico & Texas)", wells: 1847, boePerDay: 287000, share: "42%", performance: "Exceeding plan" },
    { basin: "Powder River Basin (Wyoming)", wells: 892, boePerDay: 156000, share: "23%", performance: "On target" },
    { basin: "Williston Basin (North Dakota)", wells: 734, boePerDay: 124000, share: "18%", performance: "Above forecast" },
    { basin: "Eagle Ford (Texas)", wells: 487, boePerDay: 78000, share: "11%", performance: "Strong" },
    { basin: "Anadarko Basin (Oklahoma)", wells: 287, boePerDay: 42000, share: "6%", performance: "Stable" },
  ];

  TableRenderer.render(
    basinProduction,
    [
      { key: "basin", label: "Operating Basin", width: 38 },
      { key: "wells", label: "Active Wells", width: 14, align: "center", formatter: (v) => Formatter.number(v) },
      { key: "boePerDay", label: "Production (BOE/day)", width: 22, align: "right", formatter: (v) => formatProduction(v, "") },
      { key: "share", label: "Portfolio %", width: 12, align: "center" },
      { key: "performance", label: "Status", width: 18 },
    ],
    { showIndex: true },
  );
  console.log("");

  devonLogger.info("Basin-level production analytics complete", {
    topProducer: "Delaware Basin",
    totalBasins: basinProduction.length,
  });
  console.log("");

  // ===========================================================================
  // 6. SAFETY CULTURE & PERFORMANCE
  // ===========================================================================
  console.log(ColorSystem.colorize("  SAFETY CULTURE & PERFORMANCE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("SAFETY IS OUR #1 PRIORITY - EVERY DAY, EVERY OPERATION", ColorSystem.codes.brightYellow),
      "",
      `Total Recordable Incident Rate (TRIR): ${ColorSystem.colorize("0.23", ColorSystem.codes.brightGreen)} ${ColorSystem.colorize("(Top quartile industry performance)", ColorSystem.codes.green)}`,
      `Days Since Last Recordable Incident: ${ColorSystem.colorize("127 days", ColorSystem.codes.brightCyan)}`,
      `Near-Miss Reports (Q4): ${ColorSystem.colorize("1,842", ColorSystem.codes.cyan)} - ${ColorSystem.colorize("↑ 34%", ColorSystem.codes.green)} (Strong safety culture indicator)`,
      `Safety Training Hours (2024): ${ColorSystem.colorize("87,400 hours", ColorSystem.codes.brightBlue)} across all employees`,
      `HSE Audits Completed: ${ColorSystem.colorize("156 facility audits", ColorSystem.codes.brightMagenta)} with ${ColorSystem.colorize("98.2% compliance", ColorSystem.codes.brightGreen)}`,
      "",
      "Goal: Zero incidents, Zero harm to people and environment",
    ],
    {
      title: "Health, Safety & Environmental Excellence",
      style: "double",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  const safetyCultureMetrics = [
    { initiative: "Leadership Safety Engagement", completion: 96, description: "Executive field visits & safety conversations" },
    { initiative: "Contractor Safety Management", completion: 91, description: "100% contractor safety orientation compliance" },
    { initiative: "Emergency Response Readiness", completion: 89, description: "Quarterly drills & equipment certifications" },
    { initiative: "Process Safety Management", completion: 94, description: "Critical equipment integrity & maintenance" },
  ];

  for (const metric of safetyCultureMetrics) {
    console.log(`${ColorSystem.colorize(metric.initiative, ColorSystem.codes.brightYellow)}`);
    console.log(`  ${ColorSystem.colorize(metric.description, ColorSystem.codes.dim)}`);
    const bar = new ProgressBar({
      total: 100,
      width: 50,
      colorize: true,
      showPercentage: true,
      showValue: false,
    });
    bar.update(metric.completion);
    bar.complete();
    console.log("");
  }

  devonLogger.success("Safety performance continues industry-leading trajectory", {
    trir: 0.23,
    safetyHours: 87400,
    auditCompliance: "98.2%",
  });
  console.log("");

  // ===========================================================================
  // 7. TECHNOLOGY INNOVATION & DIGITAL TRANSFORMATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  TECHNOLOGY INNOVATION & DIGITAL TRANSFORMATION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const innovationSpinner = new Spinner({
    message: "Analyzing technology deployment and digital initiatives...",
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    interval: 100,
  });

  innovationSpinner.start();
  await sleep(1000);
  innovationSpinner.succeed("Technology innovation portfolio analysis complete");
  console.log("");

  const technologyInitiatives = [
    { technology: "Advanced Analytics & AI/ML", adoption: "Predictive maintenance across 2,400+ wells", impact: "$42M cost reduction annually" },
    { technology: "Automated Drilling Systems", adoption: "Deployed on 87% of active rigs", impact: "23% faster drilling, 15% cost reduction" },
    { technology: "Real-Time Production Optimization", adoption: "4,000+ wells with SCADA & edge computing", impact: "3.2% production uplift" },
    { technology: "Methane Detection Technology", adoption: "Aerial & ground-based continuous monitoring", impact: "99.7% emissions detection accuracy" },
    { technology: "Digital Twin & Simulation", adoption: "Reservoir modeling for top 12 fields", impact: "Enhanced recovery by 8-12%" },
    { technology: "Remote Operations Centers", adoption: "OKC + Midland control rooms operational", impact: "24/7 monitoring, faster response" },
  ];

  TableRenderer.render(
    technologyInitiatives,
    [
      { key: "technology", label: "Innovation Area", width: 32 },
      { key: "adoption", label: "Deployment Status", width: 38 },
      { key: "impact", label: "Business Impact", width: 32 },
    ],
    { showIndex: true },
  );
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("DIGITAL TRANSFORMATION ACHIEVEMENTS", ColorSystem.codes.brightCyan),
      "",
      `• ${ColorSystem.colorize("$240M+", ColorSystem.codes.brightGreen)} in cumulative efficiency gains from technology (2020-2024)`,
      `• ${ColorSystem.colorize("15,000+", ColorSystem.codes.brightBlue)} IoT sensors deployed across field operations`,
      `• ${ColorSystem.colorize("98.7%", ColorSystem.codes.brightMagenta)} system uptime through predictive maintenance`,
      `• ${ColorSystem.colorize("40%", ColorSystem.codes.brightYellow)} reduction in non-productive time (NPT) via automation`,
      "• Industry-leading adoption of AI/ML for production optimization",
      "",
      "Devon Energy: Pioneering the digital future of energy production",
    ],
    {
      title: "Technology Leadership",
      style: "single",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 8. ENVIRONMENTAL STEWARDSHIP & SUSTAINABILITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  ENVIRONMENTAL STEWARDSHIP & SUSTAINABILITY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const sustainabilityMetrics = [
    { metric: "GHG Emissions Intensity Reduction", baseline: "2019 baseline", progress: 65, target: "50% by 2030", status: "Ahead of schedule" },
    { metric: "Methane Emissions Intensity", current: "0.04%", progress: 92, benchmark: "Industry avg: 0.38%", status: "Leading performance" },
    { metric: "Freshwater Use Reduction", achievement: "78% recycled water", progress: 78, initiative: "Closed-loop systems", status: "Exceeding goals" },
    { metric: "Zero Routine Flaring Achievement", coverage: "99.4% of production", progress: 99, commitment: "Virtual elimination", status: "Near complete" },
  ];

  for (const metric of sustainabilityMetrics) {
    console.log(`${ColorSystem.colorize(metric.metric, ColorSystem.codes.brightGreen)}`);
    console.log(`  Status: ${ColorSystem.colorize(metric.status, ColorSystem.codes.cyan)} | ${metric.current || metric.achievement || metric.baseline}`);
    const bar = new ProgressBar({
      total: 100,
      width: 50,
      colorize: true,
      showPercentage: true,
      showValue: false,
    });
    bar.update(metric.progress);
    bar.complete();
    console.log("");
  }

  BoxRenderer.render(
    [
      ColorSystem.colorize("ENVIRONMENTAL COMMITMENTS & ACHIEVEMENTS", ColorSystem.codes.brightGreen),
      "",
      "✓ Net-zero ambition: On track for Scope 1 & 2 emissions reduction by 2050",
      "✓ Eliminated routine flaring at 99.4% of operations (industry-leading)",
      "✓ Deployed continuous methane monitoring technology across all major facilities",
      "✓ Reduced freshwater consumption by 78% through water recycling programs",
      "✓ Reclaimed and restored 12,400+ acres of land over past 5 years",
      "✓ Biodiversity protection: Partnering on sage grouse & prairie conservation",
      "",
      "Transparent reporting: Annual Sustainability Report published per TCFD & SASB frameworks",
    ],
    {
      title: "Responsible Energy Leadership",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  devonLogger.success("Environmental performance exceeding industry benchmarks", {
    ghgReduction: "65% vs 2019 baseline",
    methaneIntensity: "0.04% (industry-leading)",
    waterRecycling: "78%",
  });
  console.log("");

  // ===========================================================================
  // 9. COMMUNITY INVESTMENT & SOCIAL RESPONSIBILITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  COMMUNITY INVESTMENT & SOCIAL RESPONSIBILITY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const communityImpact2024 = [
    { category: "Education & STEM Programs", investment: 4200000, beneficiaries: "28 schools, 8,400+ students", focus: "Energy education, scholarships, lab equipment" },
    { category: "Community Health & Wellness", investment: 2800000, beneficiaries: "14 health organizations", focus: "Rural healthcare access, mental health" },
    { category: "Arts, Culture & Recreation", investment: 1900000, beneficiaries: "Oklahoma City metro", focus: "Museums, parks, community centers" },
    { category: "Workforce Development", investment: 3100000, beneficiaries: "1,200+ individuals", focus: "Trade skills, energy sector training" },
    { category: "Emergency & Disaster Relief", investment: 1500000, beneficiaries: "Regional communities", focus: "Wildfire, tornado, flood response" },
    { category: "Veterans & Military Support", investment: 980000, beneficiaries: "Veteran organizations", focus: "Transition programs, family support" },
  ];

  TableRenderer.render(
    communityImpact2024,
    [
      { key: "category", label: "Community Focus Area", width: 32 },
      { key: "investment", label: "2024 Investment", width: 18, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "beneficiaries", label: "Reach", width: 24 },
      { key: "focus", label: "Key Initiatives", width: 36 },
    ],
    { showIndex: true },
  );
  console.log("");

  const totalCommunityInvestment = communityImpact2024.reduce((sum, item) => sum + item.investment, 0);

  BoxRenderer.render(
    [
      ColorSystem.colorize("2024 COMMUNITY IMPACT SUMMARY", ColorSystem.codes.brightMagenta),
      "",
      `Total Community Investment: ${ColorSystem.colorize(formatLargeCurrency(totalCommunityInvestment), ColorSystem.codes.brightGreen)}`,
      `Employee Volunteer Hours: ${ColorSystem.colorize("14,200 hours", ColorSystem.codes.brightCyan)} (avg 7.5 hours per employee)`,
      `Matching Gift Program: ${ColorSystem.colorize("$890K matched", ColorSystem.codes.brightBlue)} for employee charitable giving`,
      `Nonprofit Partnerships: ${ColorSystem.colorize("147 organizations", ColorSystem.codes.brightYellow)} supported`,
      "",
      "Devon Energy: Deeply committed to the communities where we live, work, and operate.",
      "Making a lasting difference through strategic philanthropy and employee engagement.",
    ],
    {
      title: "Investing in Communities",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  devonLogger.info("Community investment programs delivering meaningful impact", {
    totalInvestment: formatLargeCurrency(totalCommunityInvestment),
    volunteerHours: 14200,
    nonprofitPartners: 147,
  });
  console.log("");

  // ===========================================================================
  // 10. EMPLOYEE CULTURE & DEVELOPMENT
  // ===========================================================================
  console.log(ColorSystem.colorize("  EMPLOYEE CULTURE & DEVELOPMENT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const cultureSpinner = new Spinner({
    message: "Analyzing employee engagement and development programs...",
    frames: ["◰", "◳", "◲", "◱"],
    interval: 110,
  });

  cultureSpinner.start();
  await sleep(900);
  cultureSpinner.succeed("Employee culture assessment complete - High engagement confirmed");
  console.log("");

  const employeeCulture = [
    { label: "Total Employees", value: "~1,900 team members (Devon family)" },
    { label: "Employee Engagement Score", value: "87% (Top 10% of energy sector)" },
    { label: "Leadership Development Program", value: "142 emerging leaders participating" },
    { label: "Training & Development Investment", value: formatLargeCurrency(8400000) + " in 2024" },
    { label: "Internal Promotion Rate", value: "68% of positions filled internally" },
    { label: "Diversity & Inclusion Progress", value: "38% women in workforce, 24% leadership" },
    { label: "Employee Retention Rate", value: "92% (Industry-leading retention)" },
    { label: "Wellness Program Participation", value: "78% of employees actively engaged" },
  ];

  TableRenderer.renderKeyValue(employeeCulture);
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("DEVON ENERGY CULTURE: OUR PEOPLE ARE OUR GREATEST ASSET", ColorSystem.codes.brightCyan),
      "",
      "✓ Named to America's Best Large Employers by Forbes (2024)",
      "✓ Recognized as Top Workplace in Oklahoma City (2024)",
      "✓ Comprehensive benefits: Health, retirement, equity compensation",
      "✓ Flexible work arrangements and strong work-life balance",
      "✓ Diversity, equity, inclusion: Core to our culture and values",
      "✓ Professional development: Technical training + leadership programs",
      "✓ Employee resource groups supporting diverse communities",
      "",
      "At Devon, we believe empowered employees drive innovation and operational excellence.",
    ],
    {
      title: "People Excellence",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 11. FINANCIAL PERFORMANCE & SHAREHOLDER VALUE
  // ===========================================================================
  console.log(ColorSystem.colorize("  FINANCIAL PERFORMANCE & SHAREHOLDER VALUE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const quarterlyRevenue = [
    { label: "Q1", value: 3820 },
    { label: "Q2", value: 4150 },
    { label: "Q3", value: 3940 },
    { label: "Q4", value: 4280 },
  ];

  ChartRenderer.barChart(quarterlyRevenue, {
    width: 65,
    showValues: true,
    color: ColorSystem.codes.brightGreen,
    title: "2024 Quarterly Revenue ($M)",
  });
  console.log("");

  const annualRevenue = quarterlyRevenue.reduce((sum, q) => sum + q.value, 0);

  const financialMetrics = [
    { metric: "Annual Revenue (2024)", value: formatLargeCurrency(annualRevenue * 1000000), highlight: true },
    { metric: "Operating Cash Flow", value: formatLargeCurrency(5200000000), highlight: false },
    { metric: "Free Cash Flow", value: formatLargeCurrency(2800000000), highlight: false },
    { metric: "Dividends Returned (2024)", value: formatLargeCurrency(1400000000) + " (Fixed + Variable)", highlight: true },
    { metric: "Share Buybacks (2024)", value: formatLargeCurrency(920000000), highlight: false },
    { metric: "Total Shareholder Returns", value: "$2.32B (67% of free cash flow)", highlight: true },
    { metric: "Debt-to-Capitalization", value: "17% (Investment-grade balance sheet)", highlight: false },
    { metric: "Return on Capital Employed", value: "22% (Top quartile performance)", highlight: false },
  ];

  for (const metric of financialMetrics) {
    const displayValue = metric.highlight
      ? ColorSystem.colorize(metric.value, ColorSystem.codes.brightGreen)
      : ColorSystem.colorize(metric.value, ColorSystem.codes.cyan);
    console.log(`  ${ColorSystem.colorize(metric.metric + ":", ColorSystem.codes.bright)} ${displayValue}`);
  }
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("SHAREHOLDER VALUE CREATION", ColorSystem.codes.brightGreen),
      "",
      "✓ Disciplined capital allocation: Focused on high-return projects",
      "✓ Industry-leading cash returns: Fixed + variable dividend framework",
      "✓ Strong balance sheet: Investment-grade credit rating maintained",
      "✓ Operational efficiency: Best-in-class cost structure",
      "✓ Portfolio optimization: Divested non-core assets, focused on premier basins",
      "✓ Sustainable growth: Balancing production growth with capital discipline",
      "",
      "Delivering superior returns through operational excellence and financial discipline.",
    ],
    {
      title: "Financial Excellence",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  devonLogger.success("Financial performance exceeding guidance", {
    revenue: formatLargeCurrency(annualRevenue * 1000000),
    shareholderReturns: "$2.32B",
    freeCashFlow: "$2.8B",
  });
  console.log("");

  // ===========================================================================
  // 12. STRATEGIC VISION & FUTURE INITIATIVES
  // ===========================================================================
  console.log(ColorSystem.colorize("  STRATEGIC VISION: ENERGY INNOVATION & FUTURE GROWTH", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const strategicPriorities = [
    { priority: "Operational Excellence & Cost Leadership", progress: 88, initiative: "Drive industry-leading efficiency through technology & best practices" },
    { priority: "ESG Leadership & Carbon Reduction", progress: 75, initiative: "Achieve net-zero Scope 1 & 2 emissions by 2050, near-term milestones" },
    { priority: "Technology & Digital Transformation", progress: 82, initiative: "Scale AI/ML, automation, and data analytics across operations" },
    { priority: "Portfolio Optimization", progress: 79, initiative: "Focus capital on highest-return Delaware & Powder River assets" },
    { priority: "Shareholder Value Creation", progress: 91, initiative: "Maintain disciplined capital allocation & industry-leading returns" },
    { priority: "Safety & Workforce Excellence", progress: 94, initiative: "Zero incidents culture + attract & retain top talent" },
  ];

  for (const priority of strategicPriorities) {
    console.log(`${ColorSystem.colorize(priority.priority, ColorSystem.codes.brightBlue)}`);
    console.log(`  ${ColorSystem.colorize(priority.initiative, ColorSystem.codes.dim)}`);
    const bar = new ProgressBar({
      total: 100,
      width: 52,
      colorize: true,
      showPercentage: true,
      showValue: false,
    });
    bar.update(priority.progress);
    bar.complete();
    console.log("");
  }

  // ===========================================================================
  // 13. FINAL MOTIVATIONAL SUMMARY
  // ===========================================================================
  BoxRenderer.render(
    [
      ColorSystem.colorize("DEVON ENERGY: POWERING THE FUTURE WITH INNOVATION & RESPONSIBILITY", ColorSystem.codes.brightCyan),
      "",
      ColorSystem.colorize("═══ OUR ACHIEVEMENTS ═══", ColorSystem.codes.bright),
      "✓ Industry-leading production efficiency and operational excellence",
      "✓ Top-tier safety performance protecting our people and communities",
      "✓ Environmental stewardship exceeding industry benchmarks",
      "✓ Technology innovation driving competitive advantage",
      "✓ Strong financial performance delivering shareholder value",
      "✓ Deep community investment making lasting impact",
      "✓ Employee culture recognized as best-in-class",
      "",
      ColorSystem.colorize("═══ OUR FUTURE ═══", ColorSystem.codes.bright),
      "→ Leading the energy transition with responsible resource development",
      "→ Pioneering digital transformation in oil & gas operations",
      "→ Advancing toward net-zero emissions while meeting global energy demand",
      "→ Creating opportunities for employees, communities, and stakeholders",
      "→ Delivering reliable, affordable energy that powers modern life",
      "",
      ColorSystem.colorize("Together, we're building a better energy future — safely, responsibly, and innovatively.", ColorSystem.codes.brightGreen),
      "",
      ColorSystem.colorize("Thank you to our 1,900 Devon Energy team members for your dedication and excellence!", ColorSystem.codes.brightYellow),
    ],
    {
      title: "Devon Energy - Leading Energy Innovation",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 2,
      margin: 1,
    },
  );
  console.log("");

  devonLogger.success("Devon Energy operational excellence dashboard complete");
  devonLogger.info("All systems operational - Ready to power the future");
  console.log("");
  console.log(
    ColorSystem.colorize(
      "  🌟 Devon Energy Corporation - Headquartered in Oklahoma City since 1971 🌟\n",
      ColorSystem.codes.brightGreen,
    ),
  );
  console.log(
    ColorSystem.colorize(
      "  Leading Energy Innovation • Operational Excellence • Creating Value Responsibly\n",
      ColorSystem.codes.brightCyan,
    ),
  );
};

await runDevonEnergyDashboard();
