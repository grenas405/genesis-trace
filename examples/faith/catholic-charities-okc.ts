#!/usr/bin/env -S deno run --allow-env

/**
 * Catholic Charities of the Archdiocese of Oklahoma City
 * Community Services Management System Demo
 *
 * A GenesisTrace demonstration showcasing the comprehensive services
 * provided by Catholic Charities in Oklahoma City, including emergency
 * assistance, immigration services, refugee resettlement, and
 * community outreach programs.
 *
 * Features:
 *   - Client case management tracking
 *   - Emergency assistance distribution
 *   - Immigration and refugee services
 *   - Food pantry and utility assistance
 *   - Volunteer coordination
 *   - Donation and resource management
 *   - Community impact metrics
 *
 * Run with:
 *    deno run --allow-env examples/faith/catholic-charities-okc.ts
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
// CATHOLIC CHARITIES OF OKLAHOMA CITY - BANNER
// =============================================================================

BannerRenderer.render({
  title: "CATHOLIC CHARITIES",
  subtitle: "Archdiocese of Oklahoma City",
  description: "Serving Our Neighbors in Need Since 1944",
  version: "CMS-v2.5",
  author: "Powered by GenesisTrace",
  width: 98,
  color: ColorSystem.hexToRgb("#8B0000"), // Deep red - Catholic Charities color
});
console.log("\n");

// =============================================================================
// 1. ORGANIZATION OVERVIEW
// =============================================================================

ConsoleStyler.logSection("Organization Overview", "brightCyan", "double");

const orgLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

const initSpinner = new Spinner({ message: "Loading Catholic Charities management system..." });
initSpinner.start();
await sleep(800);
initSpinner.update("Connecting to service databases...");
await sleep(600);
initSpinner.update("Synchronizing client records...");
await sleep(700);
initSpinner.succeed("System initialized successfully");
console.log("\n");

BoxRenderer.render(
  [
    "Catholic Charities of the Archdiocese of Oklahoma City",
    "1501 N Classen Blvd",
    "Oklahoma City, OK 73106",
    "",
    "Mission: To provide loving service to those in need",
    "         and to advocate for justice in the social structures of society",
    "",
    "Guided by the Gospel mandate to love and serve our neighbors,",
    "we walk with individuals and families facing poverty, injustice,",
    "and other challenges. Through comprehensive programs, we provide",
    "immediate relief while addressing root causes of hardship.",
    "",
    "Services provided to all, regardless of race, religion, or background.",
  ],
  {
    style: "double",
    title: "Mission Statement",
    padding: 1,
    color: ColorSystem.hexToRgb("#1E90FF"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 2. CORE SERVICES PORTFOLIO
// =============================================================================

ConsoleStyler.logSection("Core Services Portfolio", "brightGreen");

const services = [
  {
    service: "Emergency Assistance",
    description: "Rent, utilities, food, prescriptions",
    status: "ACTIVE",
    clientsServed: 4823,
  },
  {
    service: "Immigration Services",
    description: "Legal assistance, citizenship classes",
    status: "ACTIVE",
    clientsServed: 2341,
  },
  {
    service: "Refugee Resettlement",
    description: "Housing, employment, cultural orientation",
    status: "ACTIVE",
    clientsServed: 892,
  },
  {
    service: "Food Pantry Network",
    description: "Nutrition assistance, senior meals",
    status: "ACTIVE",
    clientsServed: 6543,
  },
  {
    service: "Pregnancy Support",
    description: "Counseling, material assistance, parenting",
    status: "ACTIVE",
    clientsServed: 567,
  },
  {
    service: "Disaster Response",
    description: "Emergency relief, case management",
    status: "STANDBY",
    clientsServed: 234,
  },
];

TableRenderer.render(
  services,
  [
    { key: "service", label: "Service Program", width: 24 },
    { key: "description", label: "Description", width: 36 },
    {
      key: "status",
      label: "Status",
      width: 10,
      formatter: (val: string) =>
        val === "ACTIVE"
          ? ColorSystem.colorize(val, ColorSystem.codes.green)
          : ColorSystem.colorize(val, ColorSystem.codes.yellow),
    },
    {
      key: "clientsServed",
      label: "Clients (YTD)",
      width: 14,
      align: "right",
    },
  ],
  { showIndex: true },
);
console.log("\n");

orgLogger.success(`Total clients served this year: ${services.reduce((sum, s) => sum + s.clientsServed, 0).toLocaleString()}`);
console.log("\n");

// =============================================================================
// 3. EMERGENCY ASSISTANCE PROGRAM
// =============================================================================

ConsoleStyler.logSection("Emergency Assistance Program", "brightYellow");

const emergencyLogger = orgLogger.child("emergency");

BoxRenderer.render(
  [
    "EMERGENCY ASSISTANCE SERVICES",
    "",
    "Providing immediate relief to families in crisis:",
    "",
    "  - Rent & Mortgage Assistance",
    "  - Utility Payment Support (OG&E, ONG, Water)",
    "  - Food Assistance & Grocery Cards",
    "  - Prescription Medication Help",
    "  - Transportation Assistance",
    "  - Emergency Shelter Referrals",
    "",
    "Case managers work with each family to address immediate needs",
    "while connecting them to long-term support resources.",
  ],
  {
    style: "rounded",
    title: "Meeting Immediate Needs",
    padding: 1,
    color: ColorSystem.hexToRgb("#E67E22"),
    maxWidth: 94,
  },
);
console.log("\n");

const assistanceTypes = [
  { category: "Rent Assistance", requests: 1823, approved: 1654, amount: 487250 },
  { category: "Utility Assistance", requests: 2341, approved: 2156, amount: 312450 },
  { category: "Food Assistance", requests: 3456, approved: 3398, amount: 145670 },
  { category: "Prescription Help", requests: 567, approved: 542, amount: 34890 },
  { category: "Transportation", requests: 234, approved: 218, amount: 12340 },
];

TableRenderer.render(
  assistanceTypes,
  [
    { key: "category", label: "Assistance Type", width: 20 },
    { key: "requests", label: "Requests", width: 12, align: "right" },
    { key: "approved", label: "Approved", width: 12, align: "right" },
    {
      key: "amount",
      label: "Amount Distributed",
      width: 18,
      align: "right",
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
  ],
  { showIndex: true },
);
console.log("\n");

const totalAmount = assistanceTypes.reduce((sum, a) => sum + a.amount, 0);
emergencyLogger.info(`Total emergency assistance distributed: $${totalAmount.toLocaleString()}`);
console.log("\n");

// =============================================================================
// 4. IMMIGRATION AND LEGAL SERVICES
// =============================================================================

ConsoleStyler.logSection("Immigration & Legal Services", "brightMagenta");

const immigrationLogger = orgLogger.child("immigration");

BoxRenderer.render(
  [
    "IMMIGRATION SERVICES DEPARTMENT",
    "",
    "Providing compassionate, professional immigration assistance:",
    "",
    "  - Family-Based Immigration Petitions",
    "  - Citizenship & Naturalization Applications",
    "  - DACA (Deferred Action for Childhood Arrivals)",
    "  - Temporary Protected Status (TPS)",
    "  - Adjustment of Status Applications",
    "  - Work Authorization (EAD)",
    "  - Consular Processing Support",
    "  - English & Citizenship Classes",
    "",
    "Accredited by the U.S. Department of Justice",
    "DOJ Accredited Representatives on staff",
  ],
  {
    style: "double",
    title: "Welcoming the Stranger - Matthew 25:35",
    padding: 1,
    color: ColorSystem.hexToRgb("#9B59B6"),
    maxWidth: 94,
  },
);
console.log("\n");

const immigrationCases = [
  { caseType: "Citizenship Applications", active: 487, completed: 1243, successRate: 96 },
  { caseType: "Family Petitions", active: 234, completed: 567, successRate: 94 },
  { caseType: "DACA Renewals", active: 123, completed: 789, successRate: 98 },
  { caseType: "Work Authorization", active: 345, completed: 1012, successRate: 97 },
  { caseType: "Adjustment of Status", active: 156, completed: 334, successRate: 89 },
  { caseType: "TPS Applications", active: 89, completed: 245, successRate: 95 },
];

TableRenderer.render(
  immigrationCases,
  [
    { key: "caseType", label: "Case Type", width: 24 },
    { key: "active", label: "Active", width: 10, align: "right" },
    { key: "completed", label: "Completed", width: 12, align: "right" },
    {
      key: "successRate",
      label: "Success Rate",
      width: 14,
      align: "right",
      formatter: (val: number) => {
        const color = val >= 95 ? ColorSystem.codes.green :
                      val >= 90 ? ColorSystem.codes.cyan :
                      ColorSystem.codes.yellow;
        return ColorSystem.colorize(`${val}%`, color);
      },
    },
  ],
  { showIndex: true },
);
console.log("\n");

immigrationLogger.success("Immigration services maintaining 95%+ success rate across all case types");
console.log("\n");

// =============================================================================
// 5. REFUGEE RESETTLEMENT PROGRAM
// =============================================================================

ConsoleStyler.logSection("Refugee Resettlement Program", "brightBlue");

const refugeeLogger = orgLogger.child("refugee");

BoxRenderer.render(
  [
    "REFUGEE RESETTLEMENT SERVICES",
    "",
    "Welcoming refugees and helping them rebuild their lives:",
    "",
    "  - Airport Reception & Initial Housing",
    "  - Cultural Orientation & ESL Classes",
    "  - Employment Assistance & Job Placement",
    "  - School Enrollment for Children",
    "  - Health Screening & Medical Appointments",
    "  - Social Services Navigation",
    "  - Community Integration Support",
    "  - Long-term Case Management (90 days+)",
    "",
    "Partner with U.S. Department of State Reception & Placement Program",
  ],
  {
    style: "bold",
    title: "Rebuilding Hope, Restoring Dignity",
    padding: 1,
    color: ColorSystem.hexToRgb("#3498DB"),
    maxWidth: 94,
  },
);
console.log("\n");

const refugeeOrigins = [
  { country: "Afghanistan", arrivals: 234, housed: 234, employed: 187 },
  { country: "Democratic Republic of Congo", arrivals: 156, housed: 156, employed: 142 },
  { country: "Myanmar (Burma)", arrivals: 123, housed: 123, employed: 98 },
  { country: "Syria", arrivals: 98, housed: 98, employed: 76 },
  { country: "Ukraine", arrivals: 187, housed: 187, employed: 165 },
  { country: "Venezuela", arrivals: 94, housed: 94, employed: 73 },
];

TableRenderer.render(
  refugeeOrigins,
  [
    { key: "country", label: "Country of Origin", width: 32 },
    { key: "arrivals", label: "Arrivals", width: 10, align: "right" },
    { key: "housed", label: "Housed", width: 10, align: "right" },
    {
      key: "employed",
      label: "Employed",
      width: 12,
      align: "right",
      formatter: (val: number) => ColorSystem.colorize(String(val), ColorSystem.codes.green),
    },
  ],
  { showIndex: true },
);
console.log("\n");

const totalRefugees = refugeeOrigins.reduce((sum, r) => sum + r.arrivals, 0);
const totalEmployed = refugeeOrigins.reduce((sum, r) => sum + r.employed, 0);
const employmentRate = Math.round((totalEmployed / totalRefugees) * 100);

refugeeLogger.info(`Total refugees resettled this year: ${totalRefugees}`);
refugeeLogger.success(`Employment rate: ${employmentRate}% within 90 days`);
console.log("\n");

// =============================================================================
// 6. FOOD SECURITY PROGRAMS
// =============================================================================

ConsoleStyler.logSection("Food Security & Nutrition Programs", "brightGreen");

const foodLogger = orgLogger.child("food");

const foodDistribution = [
  { month: "January", households: 543, individuals: 1876, pounds: 34520 },
  { month: "February", households: 567, individuals: 1943, pounds: 36780 },
  { month: "March", households: 623, individuals: 2134, pounds: 41230 },
  { month: "April", households: 598, individuals: 2045, pounds: 38950 },
  { month: "May", households: 634, individuals: 2187, pounds: 43210 },
  { month: "June", households: 687, individuals: 2341, pounds: 47680 },
];

console.log("Monthly Food Distribution Statistics:\n");

TableRenderer.render(
  foodDistribution,
  [
    { key: "month", label: "Month", width: 12 },
    { key: "households", label: "Households", width: 14, align: "right" },
    { key: "individuals", label: "Individuals", width: 14, align: "right" },
    {
      key: "pounds",
      label: "Pounds Distributed",
      width: 20,
      align: "right",
      formatter: (val: number) => val.toLocaleString(),
    },
  ],
  { showIndex: true },
);
console.log("\n");

const totalPounds = foodDistribution.reduce((sum, f) => sum + f.pounds, 0);
foodLogger.success(`Total food distributed: ${totalPounds.toLocaleString()} pounds (${Formatter.bytes(totalPounds * 453.592)})`);
console.log("\n");

// Food pantry network partners
const pantryPartners = [
  { location: "St. James Catholic Church", zipCode: "73116", families: 234 },
  { location: "St. Eugene Catholic Church", zipCode: "73120", families: 189 },
  { location: "Christ the King Catholic Church", zipCode: "73132", families: 267 },
  { location: "Epiphany of the Lord", zipCode: "73142", families: 198 },
  { location: "Good Shepherd Catholic Church", zipCode: "73013", families: 156 },
];

console.log("Partner Food Pantry Network:\n");

TableRenderer.render(
  pantryPartners,
  [
    { key: "location", label: "Partner Parish", width: 36 },
    { key: "zipCode", label: "ZIP Code", width: 12 },
    { key: "families", label: "Families Served", width: 16, align: "right" },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 7. VOLUNTEER PROGRAM
// =============================================================================

ConsoleStyler.logSection("Volunteer Services", "brightCyan");

const volunteerLogger = orgLogger.child("volunteers");

BoxRenderer.render(
  [
    "VOLUNTEER PROGRAM",
    "",
    "Catholic Charities relies on dedicated volunteers who embody",
    "the Gospel call to serve. Our volunteers contribute thousands",
    "of hours annually across all programs.",
    "",
    "Volunteer Opportunities:",
    "  - Food Pantry Assistance",
    "  - ESL & Citizenship Tutoring",
    "  - Refugee Mentor Program",
    "  - Administrative Support",
    "  - Special Events & Fundraising",
    "  - Translation & Interpretation",
  ],
  {
    style: "rounded",
    title: "Hands in Service, Hearts for Justice",
    padding: 1,
    color: ColorSystem.hexToRgb("#1ABC9C"),
    maxWidth: 94,
  },
);
console.log("\n");

const volunteerStats = [
  { program: "Food Pantry", volunteers: 187, hours: 4532, value: 136620 },
  { program: "ESL Tutoring", volunteers: 67, hours: 2341, value: 70590 },
  { program: "Refugee Mentoring", volunteers: 45, hours: 1876, value: 56580 },
  { program: "Administrative", volunteers: 34, hours: 1234, value: 37230 },
  { program: "Special Events", volunteers: 98, hours: 876, value: 26430 },
  { program: "Translation", volunteers: 23, hours: 567, value: 17100 },
];

TableRenderer.render(
  volunteerStats,
  [
    { key: "program", label: "Program", width: 20 },
    { key: "volunteers", label: "Volunteers", width: 12, align: "right" },
    { key: "hours", label: "Hours (YTD)", width: 14, align: "right" },
    {
      key: "value",
      label: "Economic Value",
      width: 16,
      align: "right",
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
  ],
  { showIndex: true },
);
console.log("\n");

const totalVolunteers = volunteerStats.reduce((sum, v) => sum + v.volunteers, 0);
const totalHours = volunteerStats.reduce((sum, v) => sum + v.hours, 0);
const totalValue = volunteerStats.reduce((sum, v) => sum + v.value, 0);

volunteerLogger.info(`Active volunteers: ${totalVolunteers}`);
volunteerLogger.info(`Total hours contributed: ${totalHours.toLocaleString()}`);
volunteerLogger.success(`Economic value of volunteer service: $${totalValue.toLocaleString()}`);
console.log("\n");

// =============================================================================
// 8. DONOR IMPACT & STEWARDSHIP
// =============================================================================

ConsoleStyler.logSection("Donor Impact & Financial Stewardship", "brightMagenta");

const donorLogger = orgLogger.child("donors");

const fundingSources = [
  { source: "Individual Donations", amount: 1847230, percentage: 42 },
  { source: "Parish Collections", amount: 876450, percentage: 20 },
  { source: "Foundation Grants", amount: 654320, percentage: 15 },
  { source: "Government Contracts", amount: 543890, percentage: 12 },
  { source: "Special Events", amount: 345670, percentage: 8 },
  { source: "Corporate Giving", amount: 132440, percentage: 3 },
];

ChartRenderer.barChart(
  fundingSources.map((f) => ({ label: f.source, value: f.amount })),
  {
    showValues: true,
    width: 50,
    color: ColorSystem.hexToRgb("#E74C3C"),
    title: "Revenue Sources (Annual)",
  },
);
console.log("\n");

const totalRevenue = fundingSources.reduce((sum, f) => sum + f.amount, 0);
donorLogger.success(`Total annual revenue: $${totalRevenue.toLocaleString()}`);
console.log("\n");

// Expense allocation
const expenseAllocation = [
  { category: "Direct Program Services", amount: 3567890, percentage: 81 },
  { category: "Administrative Costs", amount: 526320, percentage: 12 },
  { category: "Fundraising", amount: 305790, percentage: 7 },
];

console.log("Financial Stewardship - Expense Allocation:\n");

TableRenderer.render(
  expenseAllocation,
  [
    { key: "category", label: "Category", width: 28 },
    {
      key: "amount",
      label: "Amount",
      width: 18,
      align: "right",
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
    {
      key: "percentage",
      label: "Percentage",
      width: 14,
      align: "right",
      formatter: (val: number) => {
        const color = val >= 80 ? ColorSystem.codes.green :
                      val >= 70 ? ColorSystem.codes.cyan :
                      ColorSystem.codes.yellow;
        return ColorSystem.colorize(`${val}%`, color);
      },
    },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.message(
  "81 cents of every dollar goes directly to programs serving those in need",
  "success",
);
console.log("\n");

// =============================================================================
// 9. CLIENT SUCCESS STORIES (ANONYMIZED)
// =============================================================================

ConsoleStyler.logSection("Client Outcomes & Success Metrics", "brightGreen");

const outcomesLogger = orgLogger.child("outcomes");

const progressBar = new ProgressBar({
  total: 100,
  width: 50,
  showValue: false,
  colorize: true,
  showPercentage: true,
});

console.log("Processing client outcome data...\n");

const outcomes = [
  { metric: "Housing Stability Achieved", baseline: 0, current: 87 },
  { metric: "Employment Secured", baseline: 0, current: 76 },
  { metric: "Food Security Improved", baseline: 0, current: 93 },
  { metric: "Immigration Status Resolved", baseline: 0, current: 94 },
  { metric: "Self-Sufficiency Attained", baseline: 0, current: 68 },
];

for (const outcome of outcomes) {
  console.log(`${outcome.metric}:`);
  for (let i = 0; i <= outcome.current; i += 3) {
    progressBar.update(i);
    await sleep(20);
  }
  progressBar.update(outcome.current);
  progressBar.complete();
  console.log("");
}

outcomesLogger.success("Client outcomes show significant positive impact across all service areas");
console.log("\n");

// =============================================================================
// 10. COMMUNITY IMPACT DASHBOARD
// =============================================================================

ConsoleStyler.logSection("2024 Community Impact Dashboard", "brightYellow");

const impactMetrics = [
  { label: "Individuals Served", value: "16,400+" },
  { label: "Families Assisted", value: "4,823" },
  { label: "Refugees Resettled", value: "892" },
  { label: "Meals Provided", value: "98,500+" },
  { label: "Rent Assistance Cases", value: "1,654" },
  { label: "Immigration Cases Completed", value: "4,190" },
  { label: "Volunteer Hours", value: "11,426" },
  { label: "Emergency Assistance Distributed", value: "$992,600" },
];

TableRenderer.renderKeyValue(impactMetrics);
console.log("\n");

// =============================================================================
// 11. COLLABORATION WITH ARCHDIOCESE PARISHES
// =============================================================================

ConsoleStyler.logSection("Parish Partnership Network", "brightBlue");

const parishPartners = [
  { parish: "Cathedral of Our Lady", zipCode: "73102", collections: 45670, volunteers: 23 },
  { parish: "Christ the King", zipCode: "73132", collections: 38920, volunteers: 34 },
  { parish: "St. Francis of Assisi", zipCode: "73120", collections: 32450, volunteers: 19 },
  { parish: "St. Eugene", zipCode: "73120", collections: 29870, volunteers: 28 },
  { parish: "St. James", zipCode: "73116", collections: 34560, volunteers: 31 },
  { parish: "Epiphany of the Lord", zipCode: "73142", collections: 28340, volunteers: 15 },
  { parish: "St. Charles Borromeo", zipCode: "73013", collections: 26780, volunteers: 22 },
  { parish: "Good Shepherd", zipCode: "73013", collections: 24590, volunteers: 18 },
];

TableRenderer.render(
  parishPartners,
  [
    { key: "parish", label: "Partner Parish", width: 28 },
    { key: "zipCode", label: "ZIP", width: 8 },
    {
      key: "collections",
      label: "Collections",
      width: 14,
      align: "right",
      formatter: (val: number) => `$${val.toLocaleString()}`,
    },
    { key: "volunteers", label: "Volunteers", width: 12, align: "right" },
  ],
  { showIndex: true },
);
console.log("\n");

const totalParishCollections = parishPartners.reduce((sum, p) => sum + p.collections, 0);
const totalParishVolunteers = parishPartners.reduce((sum, p) => sum + p.volunteers, 0);

orgLogger.info(`Parish collections total: $${totalParishCollections.toLocaleString()}`);
orgLogger.info(`Parish volunteers: ${totalParishVolunteers}`);
console.log("\n");

// =============================================================================
// 12. STRATEGIC PRIORITIES
// =============================================================================

ConsoleStyler.logSection("Strategic Priorities 2025", "brightWhite");

BoxRenderer.render(
  [
    "CATHOLIC CHARITIES STRATEGIC PRIORITIES",
    "",
    "1. EXPAND AFFORDABLE HOUSING INITIATIVES",
    "   Partner with developers to create sustainable housing solutions",
    "   for low-income families and refugees",
    "",
    "2. ENHANCE MENTAL HEALTH SERVICES",
    "   Integrate trauma-informed care and counseling across all programs",
    "   Address post-migration trauma and crisis-related stress",
    "",
    "3. STRENGTHEN EMPLOYMENT PATHWAYS",
    "   Develop job training and placement programs",
    "   Build employer partnerships for refugee employment",
    "",
    "4. EXPAND RURAL OUTREACH",
    "   Extend services to underserved rural communities",
    "   Mobile food pantry and case management services",
    "",
    "5. DIGITAL TRANSFORMATION",
    "   Modernize client management systems",
    "   Improve data collection for outcomes measurement",
  ],
  {
    style: "double",
    title: "Building the Kingdom of God Through Service",
    padding: 1,
    color: ColorSystem.hexToRgb("#27AE60"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 13. REAL-TIME SERVICE TRACKING
// =============================================================================

ConsoleStyler.logSection("Real-Time Service Operations", "brightCyan");

const serviceLogger = orgLogger.child("operations");

const operationsSpinner = new Spinner({ message: "Monitoring live service operations..." });
operationsSpinner.start();

await sleep(800);
operationsSpinner.update("Processing 23 active emergency assistance cases...");
await sleep(700);
operationsSpinner.update("Immigration consultations: 8 in progress...");
await sleep(600);
operationsSpinner.update("Food pantry serving 34 families today...");
await sleep(700);
operationsSpinner.update("Refugee orientation: 12 participants...");
await sleep(600);

operationsSpinner.succeed("All service operations running smoothly");
console.log("\n");

const todayStats = [
  { service: "Emergency Assistance", casesOpen: 23, casesClosed: 17, clientsHelped: 68 },
  { service: "Immigration Consult", casesOpen: 8, casesClosed: 12, clientsHelped: 20 },
  { service: "Food Pantry", casesOpen: 0, casesClosed: 34, clientsHelped: 127 },
  { service: "Refugee Services", casesOpen: 12, casesClosed: 5, clientsHelped: 47 },
  { service: "Pregnancy Support", casesOpen: 4, casesClosed: 3, clientsHelped: 7 },
];

console.log("Today's Service Activity:\n");

TableRenderer.render(
  todayStats,
  [
    { key: "service", label: "Service", width: 24 },
    { key: "casesOpen", label: "Active", width: 10, align: "right" },
    { key: "casesClosed", label: "Completed", width: 12, align: "right" },
    {
      key: "clientsHelped",
      label: "Clients Helped",
      width: 16,
      align: "right",
      formatter: (val: number) => ColorSystem.colorize(String(val), ColorSystem.codes.green),
    },
  ],
  { showIndex: true },
);
console.log("\n");

const todayTotal = todayStats.reduce((sum, s) => sum + s.clientsHelped, 0);
serviceLogger.success(`Total clients served today: ${todayTotal}`);
console.log("\n");

// =============================================================================
// 14. ADVOCACY & SOCIAL JUSTICE
// =============================================================================

ConsoleStyler.logSection("Advocacy & Social Justice Initiatives", "brightRed");

BoxRenderer.render(
  [
    "ADVOCACY FOR JUSTICE",
    "",
    "Catholic Charities advocates for systemic change to address",
    "root causes of poverty and injustice:",
    "",
    "  - Affordable Housing & Homelessness Prevention",
    "  - Immigration Reform & Refugee Protection",
    "  - Living Wage & Workers' Rights",
    "  - Access to Healthcare",
    "  - Food Security & Nutrition Programs",
    "  - Criminal Justice Reform",
    "",
    "\"The measure of any society is how it treats its most vulnerable",
    " members.\" - Pope Francis",
    "",
    "We testify before city councils, state legislature, and Congress,",
    "giving voice to those our programs serve.",
  ],
  {
    style: "bold",
    title: "Speaking Truth to Power",
    padding: 1,
    color: ColorSystem.hexToRgb("#C0392B"),
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 15. CLOSING MESSAGE
// =============================================================================

ConsoleStyler.logSection("Call to Action", "brightMagenta");

BoxRenderer.render(
  [
    "HOW YOU CAN HELP",
    "",
    "VOLUNTEER YOUR TIME",
    "  Food pantry, tutoring, mentoring, administrative support",
    "  Visit: catholiccharitiesok.org/volunteer",
    "",
    "MAKE A DONATION",
    "  One-time or monthly giving",
    "  Visit: catholiccharitiesok.org/donate",
    "",
    "ADVOCATE FOR JUSTICE",
    "  Contact your representatives on issues affecting the vulnerable",
    "  Join our advocacy network",
    "",
    "SPREAD THE WORD",
    "  Share our mission with your parish and community",
    "  Follow us on social media",
    "",
    "Together, we can build a more just and compassionate community.",
  ],
  {
    style: "double",
    title: "Join Us in Service",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"),
    maxWidth: 94,
  },
);
console.log("\n");

ConsoleStyler.logGradient(
  "Caritas Christi Urget Nos - The Love of Christ Impels Us",
  [139, 0, 0],
  [255, 215, 0],
  62,
);
console.log("\n");

orgLogger.success("Catholic Charities management system demo completed successfully");
console.log("\n");

BoxRenderer.render(
  [
    "Catholic Charities of the Archdiocese of Oklahoma City",
    "",
    "For more information:",
    "  Website: catholiccharitiesok.org",
    "  Phone: (405) 523-3000",
    "  Email: info@catholiccharitiesok.org",
    "",
    "Main Office Hours:",
    "  Monday - Friday: 8:30 AM - 4:30 PM",
    "",
    "\"Whatever you did for one of the least of these brothers",
    " and sisters of mine, you did for me.\" - Matthew 25:40",
  ],
  {
    style: "rounded",
    title: "Contact Information",
    padding: 1,
    color: ColorSystem.hexToRgb("#1E90FF"),
    maxWidth: 94,
  },
);
console.log("\n");
