#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma City Hispanic Chamber of Commerce - Crecimiento y Comunidad
 * (Growth & Community)
 *
 * Professional animation lab showcasing the impact of Hispanic/Latino business
 * community on Oklahoma City's economic development.
 *
 * Features demonstrated:
 *   - Bilingual branding and cultural celebration
 *   - Hispanic business growth metrics and entrepreneurship
 *   - Bilingual member services and programs
 *   - Latino entrepreneur pipeline animations
 *   - Cultural economic impact (festivals, events, traditions)
 *   - Industry sector participation charts
 *   - Latin America trade connections
 *   - Small business success stories
 *   - Community engagement metrics
 *   - Vibrant, warm color palette reflecting cultural richness
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

const runHispanicChamberDashboard = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. BILINGUAL CHAMBER BANNER
  // ===========================================================================
  BannerRenderer.render({
    title: "OKLAHOMA CITY HISPANIC CHAMBER OF COMMERCE",
    subtitle: "Cámara de Comercio Hispana de Oklahoma City",
    description: "Empowering Latino Businesses • Fortaleciendo Empresas Latinas • Building Economic Bridges",
    version: "2024",
    author: "Crecimiento y Comunidad Dashboard",
    width: 100,
    style: "double",
    color: ColorSystem.codes.brightRed,
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

  chamberLogger.info("Hispanic Chamber dashboard initializing", {
    location: "Oklahoma City Metro",
    hispanicBusinesses: 3200,
    activePrograms: 32,
  });
  chamberLogger.success("Bilingual economic development platform online");
  chamberLogger.debug("Data sources: Census Hispanic Business Stats, State Minority Business Registry, SBA");
  console.log("");

  // ===========================================================================
  // 3. HISPANIC BUSINESS LANDSCAPE - OKC METRO
  // ===========================================================================
  console.log(ColorSystem.colorize("  HISPANIC BUSINESS LANDSCAPE - OKC METRO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const hispanicPopulation = 0.194; // 19.4% of OKC metro
  const hispanicBusinessGrowth = 0.087; // 8.7% annual growth
  const hispanicBuyingPower = 4300000000; // $4.3B

  BoxRenderer.render(
    [
      `Hispanic Population: ${Formatter.percentage(hispanicPopulation, 1)} of OKC Metro ${ColorSystem.colorize("(~267,000 residents)", ColorSystem.codes.brightCyan)}`,
      `Hispanic-Owned Businesses: ${ColorSystem.colorize("3,200+ empresas", ColorSystem.codes.brightYellow)} ${ColorSystem.colorize("↑ " + Formatter.percentage(hispanicBusinessGrowth, 1) + " annual growth", ColorSystem.codes.brightGreen)}`,
      `Hispanic Buying Power: ${ColorSystem.colorize(formatLargeCurrency(hispanicBuyingPower), ColorSystem.codes.brightGreen)} in OKC Metro`,
      `Employment Impact: ${ColorSystem.colorize("18,400+ jobs", ColorSystem.codes.brightMagenta)} created by Hispanic businesses`,
      `Chamber Membership: ${ColorSystem.colorize("520 miembros activos", ColorSystem.codes.brightYellow)} • Fastest-growing segment`,
    ],
    {
      title: "Panorama Económico Hispano (Hispanic Economic Overview)",
      style: "double",
      color: ColorSystem.codes.brightRed,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. SERVICIOS PARA MIEMBROS (MEMBER SERVICES)
  // ===========================================================================
  console.log(ColorSystem.colorize("  SERVICIOS PARA MIEMBROS / MEMBER SERVICES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const memberServices = [
    { servicio: "Bilingual Business Counseling", participantes: 284, impact: "82% revenue growth", idioma: "ES/EN" },
    { servicio: "Networking & Conexiones", eventos: 18, asistencia: 1240, alcance: "Cross-cultural partnerships" },
    { servicio: "Export/Import to Latin America", empresas: 47, mercados: 12, volumen: "$8.2M trade facilitated" },
    { servicio: "Workforce Development", graduados: 156, colocaciones: 134, retención: "91% @ 12 months" },
    { servicio: "Access to Capital Programs", préstamos: 38, capital: "$2.1M", promedio: "$55K avg loan" },
    { servicio: "Cultural Competency Training", talleres: 22, corporativos: 14, impacto: "Diversity initiatives" },
  ];

  TableRenderer.render(
    memberServices,
    [
      { key: "servicio", label: "Servicio / Service", width: 32 },
      { key: "participantes", label: "Participants", width: 14, align: "center" },
      { key: "impact", label: "Impact Metric", width: 24 },
      { key: "idioma", label: "Language", width: 12, align: "center" },
    ],
    { showIndex: true },
  );
  console.log("");
  chamberLogger.info("Member services portfolio active", { programas: memberServices.length });

  // ===========================================================================
  // 5. LATINO ENTREPRENEUR PIPELINE
  // ===========================================================================
  console.log(ColorSystem.colorize("  LATINO ENTREPRENEUR PIPELINE / IMPULSO EMPRENDEDOR", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const pipelineSpinner = new Spinner({
    message: "Identifying aspiring Latino entrepreneurs...",
    frames: ["▰", "▱", "▰", "▱"],
    interval: 100,
  });

  pipelineSpinner.start();
  await sleep(650);
  pipelineSpinner.update("Providing bilingual business plan workshops...");
  await sleep(750);
  pipelineSpinner.update("Connecting to SBA & minority business grants...");
  await sleep(800);
  pipelineSpinner.update("Facilitating access to startup capital...");
  await sleep(700);
  pipelineSpinner.update("Launching new Hispanic-owned businesses...");
  await sleep(850);
  pipelineSpinner.succeed("2024 Pipeline: 67 new businesses launched • $3.4M capital deployed • 312 jobs created");
  console.log("");

  chamberLogger.success("Latino entrepreneur pipeline exceeding targets", {
    aspiringEntrepreneurs: 142,
    workshopsCompleted: 28,
    businessesLaunched: 67,
  });
  console.log("");

  // ===========================================================================
  // 6. CULTURAL ECONOMIC IMPACT
  // ===========================================================================
  console.log(ColorSystem.colorize("  CULTURAL ECONOMIC IMPACT / IMPACTO CULTURAL", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const culturalEvents = [
    { event: "Fiesta de las Américas", attendance: 42000, revenue: 1800000, vendors: 180 },
    { event: "Paseo Arts District Hispanic Heritage", attendance: 8500, revenue: 340000, vendors: 45 },
    { event: "Día de los Muertos Celebration", attendance: 12000, revenue: 480000, vendors: 62 },
    { event: "Hispanic Restaurant Week", attendance: 14200, revenue: 720000, vendors: 38 },
    { event: "Latino Business Expo", attendance: 3400, revenue: 1200000, vendors: 95 },
  ];

  TableRenderer.render(
    culturalEvents,
    [
      { key: "event", label: "Cultural Event", width: 38 },
      { key: "attendance", label: "Attendance", width: 12, align: "right", formatter: (v) => Formatter.number(v) },
      { key: "revenue", label: "Economic Impact", width: 16, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "vendors", label: "Vendors/Biz", width: 14, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalCulturalRevenue = culturalEvents.reduce((sum, event) => sum + event.revenue, 0);
  BoxRenderer.render(
    [
      `Total Cultural Event Revenue: ${ColorSystem.colorize(formatLargeCurrency(totalCulturalRevenue), ColorSystem.codes.brightGreen)}`,
      `Hispanic Vendors & Businesses Engaged: ${ColorSystem.colorize("420+ participantes", ColorSystem.codes.brightYellow)}`,
      `Community Attendance: ${ColorSystem.colorize("80,100+ visitors", ColorSystem.codes.brightCyan)}`,
      `Cultural Tourism Growth: ${ColorSystem.colorize("↑ 14% year-over-year", ColorSystem.codes.brightGreen)}`,
    ],
    {
      title: "Cultural Economic Contribution",
      style: "single",
      color: ColorSystem.codes.brightRed,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 7. INDUSTRY SECTOR PARTICIPATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  HISPANIC BUSINESS INDUSTRY SECTORS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const industrySectors = [
    { sector: "Construcción / Construction", businesses: 680, employees: 4200, growth: "+9.2% YoY" },
    { sector: "Restaurantes / Food Service", businesses: 520, employees: 3800, growth: "+11.4% YoY" },
    { sector: "Retail / Comercio Minorista", businesses: 410, employees: 2400, growth: "+6.8% YoY" },
    { sector: "Professional Services", businesses: 340, employees: 1900, growth: "+14.2% YoY" },
    { sector: "Healthcare / Salud", businesses: 280, employees: 2100, growth: "+8.7% YoY" },
    { sector: "Transportation / Transporte", businesses: 420, employees: 2600, growth: "+5.3% YoY" },
    { sector: "Other / Otros Sectores", businesses: 550, employees: 1400, growth: "+4.1% YoY" },
  ];

  TableRenderer.render(
    industrySectors,
    [
      { key: "sector", label: "Industry Sector", width: 36 },
      { key: "businesses", label: "Businesses", width: 12, align: "center" },
      { key: "employees", label: "Employees", width: 12, align: "right", formatter: (v) => Formatter.number(v) },
      { key: "growth", label: "Growth Rate", width: 14, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalBusinesses = industrySectors.reduce((sum, sector) => sum + sector.businesses, 0);
  const totalEmployees = industrySectors.reduce((sum, sector) => sum + sector.employees, 0);

  chamberLogger.info("Industry diversification analysis complete", {
    totalBusinesses: Formatter.number(totalBusinesses),
    totalEmployees: Formatter.number(totalEmployees),
    fastestGrowing: "Professional Services (+14.2%)",
  });
  console.log("");

  // ===========================================================================
  // 8. MONTHLY HISPANIC BUSINESS REGISTRATIONS (2024)
  // ===========================================================================
  console.log(ColorSystem.colorize("  MONTHLY HISPANIC BUSINESS REGISTRATIONS (2024)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const monthlyRegistrations = [
    { label: "Jul", value: 42 },
    { label: "Aug", value: 38 },
    { label: "Sep", value: 51 },
    { label: "Oct", value: 58 },
    { label: "Nov", value: 47 },
    { label: "Dec", value: 62 },
  ];

  ChartRenderer.barChart(monthlyRegistrations, {
    width: 60,
    showValues: true,
    color: ColorSystem.codes.brightYellow,
    title: "New Hispanic-Owned Businesses (H2 2024)",
  });
  console.log("");

  const totalRegistrations = monthlyRegistrations.reduce((sum, month) => sum + month.value, 0);
  chamberLogger.info("H2 2024 business formation trending strong", {
    newBusinesses: totalRegistrations,
    avgPerMonth: Math.round(totalRegistrations / monthlyRegistrations.length),
    trajectory: "Accelerating",
  });
  console.log("");

  // ===========================================================================
  // 9. LATIN AMERICA TRADE CONNECTIONS
  // ===========================================================================
  console.log(ColorSystem.colorize("  LATIN AMERICA TRADE CONNECTIONS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const tradeConnections = [
    { country: "México", exports: 3200000, imports: 2800000, companies: 18, productos: "Oil & Gas, Ag Equipment" },
    { country: "Colombia", exports: 840000, imports: 620000, companies: 7, productos: "Coffee, Technology" },
    { country: "Guatemala", exports: 520000, imports: 380000, companies: 5, productos: "Textiles, Food Products" },
    { country: "El Salvador", exports: 380000, imports: 290000, companies: 4, productos: "Manufacturing, Ag" },
    { country: "Perú", exports: 310000, imports: 240000, companies: 3, productos: "Mining Equipment" },
  ];

  TableRenderer.render(
    tradeConnections,
    [
      { key: "country", label: "País / Country", width: 16 },
      { key: "exports", label: "Exports", width: 12, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "imports", label: "Imports", width: 12, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "companies", label: "OKC Cos", width: 10, align: "center" },
      { key: "productos", label: "Primary Products", width: 28 },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalExports = tradeConnections.reduce((sum, country) => sum + country.exports, 0);
  const totalImports = tradeConnections.reduce((sum, country) => sum + country.imports, 0);

  BoxRenderer.render(
    [
      `Total Exports to Latin America: ${ColorSystem.colorize(formatLargeCurrency(totalExports), ColorSystem.codes.brightGreen)}`,
      `Total Imports from Latin America: ${ColorSystem.colorize(formatLargeCurrency(totalImports), ColorSystem.codes.brightCyan)}`,
      `Trade Balance: ${ColorSystem.colorize(formatLargeCurrency(totalExports - totalImports) + " surplus", ColorSystem.codes.brightGreen)}`,
      `OKC Companies Engaged: ${ColorSystem.colorize("37 active traders", ColorSystem.codes.brightYellow)}`,
      `2025 Trade Mission Target: ${ColorSystem.colorize("México & Colombia expansion", ColorSystem.codes.brightMagenta)}`,
    ],
    {
      title: "Latin America Trade Summary",
      style: "single",
      color: ColorSystem.codes.brightRed,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 10. SMALL BUSINESS SUCCESS STORIES
  // ===========================================================================
  console.log(ColorSystem.colorize("  SMALL BUSINESS SUCCESS STORIES / HISTORIAS DE ÉXITO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const successStories = [
    { business: "La Cocina de Maria", sector: "Restaurant", year: 2019, employees: 24, revenue: 1200000, story: "Family recipes to 3 locations" },
    { business: "Rodriguez Construction", sector: "Construction", year: 2015, employees: 52, revenue: 3800000, story: "Commercial projects specialist" },
    { business: "Santos Professional Services", sector: "Accounting", year: 2020, employees: 14, revenue: 890000, story: "Bilingual tax & advisory" },
    { business: "Plaza Supermarket", sector: "Retail", year: 2017, employees: 38, revenue: 2400000, story: "Latin groceries & products" },
  ];

  TableRenderer.render(
    successStories,
    [
      { key: "business", label: "Business Name", width: 28 },
      { key: "sector", label: "Sector", width: 16 },
      { key: "year", label: "Founded", width: 8, align: "center" },
      { key: "employees", label: "Jobs", width: 6, align: "center" },
      { key: "revenue", label: "Annual Revenue", width: 15, align: "right", formatter: (v) => formatLargeCurrency(v) },
      { key: "story", label: "Success Story", width: 26 },
    ],
    { showIndex: true },
  );
  console.log("");

  chamberLogger.success("Hispanic small business success stories showcased", {
    businesses: successStories.length,
    totalEmployees: successStories.reduce((sum, biz) => sum + biz.employees, 0),
    combinedRevenue: formatLargeCurrency(successStories.reduce((sum, biz) => sum + biz.revenue, 0)),
  });
  console.log("");

  // ===========================================================================
  // 11. 2024 STRATEGIC INITIATIVES
  // ===========================================================================
  console.log(ColorSystem.colorize("  2024 STRATEGIC INITIATIVES / INICIATIVAS ESTRATÉGICAS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const strategicInitiatives = [
    { initiative: "Bilingual Business Resource Center", completion: 0.88, notes: "Digital platform launched, 480+ users onboarded" },
    { initiative: "Latin America Trade Mission Program", completion: 0.72, notes: "México & Colombia delegations planned for Q1 2025" },
    { initiative: "Youth Entrepreneurship / Jóvenes Emprendedores", completion: 0.91, notes: "94 students certified, 12 businesses launched" },
    { initiative: "Access to Capital Fund Expansion", completion: 0.79, notes: "$2.1M deployed, seeking $1M additional funding" },
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
    console.log(`${ColorSystem.colorize(initiative.initiative, ColorSystem.codes.brightYellow)}`);
    console.log(`  ${ColorSystem.colorize(initiative.notes, ColorSystem.codes.dim)}`);
    console.log("");
  }

  chamberLogger.success("Strategic initiatives tracking above 77% average completion");
  console.log("");

  // ===========================================================================
  // 12. COMMUNITY ENGAGEMENT METRICS
  // ===========================================================================
  console.log(ColorSystem.colorize("  COMMUNITY ENGAGEMENT METRICS / COMPROMISO COMUNITARIO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const engagementSpinner = new Spinner({
    message: "Analyzing community engagement data...",
    frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
    interval: 90,
  });

  engagementSpinner.start();
  await sleep(850);
  engagementSpinner.succeed("Community impact assessment complete");
  console.log("");

  const communityMetrics = [
    { label: "Active Chamber Members", value: "520 miembros (↑ 18% from 2023)" },
    { label: "Bilingual Workshops Delivered", value: "56 workshops • 1,240 attendees" },
    { label: "Scholarship Program", value: "$85,000 awarded to 34 students" },
    { label: "Community Volunteer Hours", value: "2,800 hours • $78K equivalent value" },
    { label: "Networking Events", value: "18 events • 1,240 business connections" },
    { label: "Hispanic Heritage Month Impact", value: "42,000+ participants across 12 events" },
    { label: "Corporate Partnership Program", value: "24 corporate allies • Diversity initiatives" },
    { label: "Member Satisfaction", value: "96% satisfaction • 92% would recommend" },
  ];

  TableRenderer.renderKeyValue(communityMetrics);
  console.log("");

  // ===========================================================================
  // 13. HISPANIC CHAMBER IMPACT SUMMARY
  // ===========================================================================
  console.log(ColorSystem.colorize("  2024 HISPANIC CHAMBER IMPACT SUMMARY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("Oklahoma City Hispanic Chamber of Commerce - 2024 Highlights", ColorSystem.codes.brightYellow),
      "",
      "✓ 520 active member businesses serving the Latino community",
      "✓ 67 new Hispanic-owned businesses launched with Chamber support",
      "✓ $3.4M in startup capital deployed to Latino entrepreneurs",
      "✓ $5.2M in Latin America trade facilitated",
      "✓ 18,400+ jobs created/sustained by Hispanic businesses",
      "✓ $4.5M cultural event revenue benefiting local economy",
      "✓ 96% member satisfaction rating",
      "",
      ColorSystem.colorize("Looking Forward: 2025 Vision / Visión 2025", ColorSystem.codes.brightRed),
      "• Expand bilingual business resource center to serve 1,000+ entrepreneurs",
      "• Launch México & Colombia trade missions with 50+ OKC companies",
      "• Scale youth entrepreneurship program to 200 students annually",
      "• Secure $5M access to capital fund for minority-owned businesses",
      "• Strengthen cultural tourism through Hispanic Heritage initiatives",
      "",
      ColorSystem.colorize("Unidos construimos un futuro próspero.", ColorSystem.codes.brightCyan),
      ColorSystem.colorize("Together we build a prosperous future.", ColorSystem.codes.brightCyan),
    ],
    {
      title: "Resumen Ejecutivo / Executive Summary",
      style: "double",
      color: ColorSystem.codes.brightRed,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  chamberLogger.success("Oklahoma City Hispanic Chamber dashboard presentation complete");
  chamberLogger.info("Serving the Latino business community with pride and excellence");
  console.log("");
  console.log(
    ColorSystem.colorize(
      "  Cámara de Comercio Hispana de Oklahoma City – Empowering Latino Businesses Since 1989 🌟\n",
      ColorSystem.codes.brightRed,
    ),
  );
};

await runHispanicChamberDashboard();
