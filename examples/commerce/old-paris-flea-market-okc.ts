#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Old Paris Flea Market - Oklahoma City
 * Enterprise Operations Platform Demo
 *
 * A comprehensive demonstration of GenesisTrace capabilities for retail operations,
 * vendor management, inventory tracking, and sales analytics at Oklahoma City's
 * premier antique and vintage destination.
 *
 * Features demonstrated:
 *   - Advanced logger configuration with theming and file logging
 *   - Tables for vendor management, inventory, and sales tracking
 *   - Charts for revenue analytics and foot traffic visualization
 *   - Progress indicators for daily operations workflows
 *   - Banners and boxes for status dashboards
 *   - Currency, number, and percentage formatting
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  draculaTheme,
  FileLoggerPlugin,
  Formatter,
  Logger,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

console.clear();
console.log("\n");

// =============================================================================
// 1. MARKETPLACE WELCOME BANNER
// =============================================================================

BannerRenderer.render({
  title: "OLD PARIS FLEA MARKET",
  subtitle: "Oklahoma City's Premier Antique & Vintage Destination",
  description: "Enterprise Operations Platform - Powered by GenesisTrace",
  version: "v2.4.1",
  author: "OKC Retail Systems",
  width: 94,
  color: ColorSystem.codes.brightYellow,
});
console.log("\n");

// =============================================================================
// 2. OPERATIONS LOGGER CONFIGURATION
// =============================================================================

console.log(ColorSystem.colorize("  SYSTEM INITIALIZATION", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));

const opsLogger = new Logger(
  new ConfigBuilder()
    .theme(draculaTheme)
    .logLevel("debug")
    .enableHistory(true)
    .plugin(new FileLoggerPlugin({ filepath: "./logs/old-paris-ops.log" }))
    .build(),
);

opsLogger.info("Old Paris Flea Market operations platform initialized");
opsLogger.success("Database connection established - PostgreSQL 15.2");
opsLogger.success("POS integration online - Square Terminal v4.8");
opsLogger.info("Loading vendor configurations...", { vendors: 127 });
opsLogger.warning("Weather advisory: High winds expected (35mph) - outdoor sections may close early");
opsLogger.debug("Cache warmed: inventory index, vendor lookup, pricing rules");
console.log("\n");

// =============================================================================
// 3. TODAY'S MARKET STATUS DASHBOARD
// =============================================================================

console.log(ColorSystem.colorize("  TODAY'S MARKET STATUS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const marketDate = new Date();
const marketStatus = {
  date: Formatter.timestamp(marketDate, "YYYY-MM-DD"),
  day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][marketDate.getDay()],
  openTime: "9:00 AM",
  closeTime: "6:00 PM",
  expectedFootTraffic: marketDate.getDay() === 0 || marketDate.getDay() === 6 ? "High" : "Moderate",
};

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightYellow}OLD PARIS FLEA MARKET - DAILY OPERATIONS${ColorSystem.codes.reset}`,
    "",
    `Date: ${marketStatus.date} (${marketStatus.day})`,
    `Hours: ${marketStatus.openTime} - ${marketStatus.closeTime}`,
    `Expected Traffic: ${marketStatus.expectedFootTraffic}`,
    "",
    `${ColorSystem.codes.brightGreen}STATUS: OPEN FOR BUSINESS${ColorSystem.codes.reset}`,
  ],
  {
    style: "double",
    color: ColorSystem.codes.brightCyan,
    padding: 1,
    title: "Market Dashboard",
  },
);
console.log("\n");

// =============================================================================
// 4. VENDOR DIRECTORY & BOOTH ASSIGNMENTS
// =============================================================================

console.log(ColorSystem.colorize("  VENDOR DIRECTORY - FEATURED MERCHANTS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const vendors = [
  { booth: "A-101", vendor: "Vintage Visions", category: "Mid-Century Furniture", since: 2018, rating: 4.9, monthlyRent: 450 },
  { booth: "A-205", vendor: "Oklahoma Antiques Co.", category: "Estate Jewelry", since: 2015, rating: 4.8, monthlyRent: 525 },
  { booth: "B-112", vendor: "Prairie Rose Collectibles", category: "Americana", since: 2019, rating: 4.7, monthlyRent: 375 },
  { booth: "B-318", vendor: "Route 66 Relics", category: "Automotive Memorabilia", since: 2016, rating: 4.9, monthlyRent: 400 },
  { booth: "C-001", vendor: "The Dusty Attic", category: "Vintage Clothing", since: 2020, rating: 4.6, monthlyRent: 350 },
  { booth: "C-215", vendor: "Frontier Finds", category: "Western Antiques", since: 2017, rating: 4.8, monthlyRent: 425 },
  { booth: "D-108", vendor: "Crystal & China", category: "Fine Glassware", since: 2014, rating: 4.9, monthlyRent: 500 },
  { booth: "D-322", vendor: "Sooner State Salvage", category: "Architectural Pieces", since: 2021, rating: 4.5, monthlyRent: 475 },
];

TableRenderer.render(
  vendors,
  [
    { key: "booth", label: "Booth", width: 8, align: "center" },
    { key: "vendor", label: "Vendor Name", width: 24 },
    { key: "category", label: "Specialty", width: 24 },
    { key: "since", label: "Since", width: 6, align: "center" },
    { key: "rating", label: "Rating", width: 8, align: "center", formatter: (v) => `${v.toFixed(1)}` },
    { key: "monthlyRent", label: "Rent", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
  ],
  { showIndex: true, sortBy: "booth" },
);
console.log("\n");

opsLogger.info("Vendor directory loaded", { activeVendors: vendors.length, totalBooths: 127 });

// =============================================================================
// 5. LIVE INVENTORY HIGHLIGHTS
// =============================================================================

console.log(ColorSystem.colorize("  INVENTORY HIGHLIGHTS - HIGH-VALUE ITEMS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const inventoryHighlights = [
  { sku: "VV-2847", item: "Danish Modern Teak Credenza", vendor: "Vintage Visions", price: 2850, condition: "Excellent", daysListed: 12 },
  { sku: "OA-1923", item: "Art Deco Diamond Brooch", vendor: "Oklahoma Antiques Co.", price: 4200, condition: "Mint", daysListed: 5 },
  { sku: "R66-445", item: "1950s Phillips 66 Porcelain Sign", vendor: "Route 66 Relics", price: 1875, condition: "Good", daysListed: 28 },
  { sku: "FF-0892", item: "Vintage Navajo Silver Concho Belt", vendor: "Frontier Finds", price: 1650, condition: "Excellent", daysListed: 8 },
  { sku: "CC-3301", item: "Lalique Frosted Crystal Vase", vendor: "Crystal & China", price: 3400, condition: "Mint", daysListed: 3 },
  { sku: "DA-7721", item: "1940s Swing Era Beaded Gown", vendor: "The Dusty Attic", price: 895, condition: "Very Good", daysListed: 15 },
];

TableRenderer.render(
  inventoryHighlights,
  [
    { key: "sku", label: "SKU", width: 10 },
    { key: "item", label: "Item Description", width: 32 },
    { key: "vendor", label: "Vendor", width: 22 },
    { key: "price", label: "Price", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
    { key: "condition", label: "Condition", width: 12, align: "center" },
    { key: "daysListed", label: "Days", width: 6, align: "center" },
  ],
  { showIndex: false },
);
console.log("\n");

const totalInventoryValue = inventoryHighlights.reduce((sum, item) => sum + item.price, 0);
opsLogger.info("High-value inventory loaded", { items: inventoryHighlights.length, totalValue: Formatter.currency(totalInventoryValue) });

// =============================================================================
// 6. SALES ANALYTICS - WEEKLY PERFORMANCE
// =============================================================================

console.log(ColorSystem.colorize("  WEEKLY SALES ANALYTICS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const weeklySales = [
  { day: "Monday", revenue: 4250, transactions: 34 },
  { day: "Tuesday", revenue: 3890, transactions: 28 },
  { day: "Wednesday", revenue: 5120, transactions: 41 },
  { day: "Thursday", revenue: 4780, transactions: 38 },
  { day: "Friday", revenue: 7340, transactions: 56 },
  { day: "Saturday", revenue: 12850, transactions: 98 },
  { day: "Sunday", revenue: 11200, transactions: 87 },
];

console.log(ColorSystem.colorize("Daily Revenue Performance:", ColorSystem.codes.dim));
ChartRenderer.barChart(
  weeklySales.map((d) => ({ label: d.day.padEnd(10), value: d.revenue })),
  { showValues: true, width: 45, color: ColorSystem.codes.brightGreen },
);
console.log("\n");

const weeklyTotal = weeklySales.reduce((sum, d) => sum + d.revenue, 0);
const totalTransactions = weeklySales.reduce((sum, d) => sum + d.transactions, 0);
const avgTransaction = weeklyTotal / totalTransactions;

BoxRenderer.render(
  [
    "Weekly Sales Summary",
    "",
    `Total Revenue: ${Formatter.currency(weeklyTotal)}`,
    `Total Transactions: ${Formatter.number(totalTransactions)}`,
    `Average Transaction: ${Formatter.currency(avgTransaction)}`,
    `Best Day: Saturday (${Formatter.currency(12850)})`,
  ],
  {
    style: "rounded",
    color: ColorSystem.codes.brightGreen,
    padding: 1,
    title: "Revenue Report",
  },
);
console.log("\n");

// Revenue sparkline trend
const revenueData = weeklySales.map((d) => d.revenue);
console.log(
  `${ColorSystem.codes.brightBlue}Revenue Trend:${ColorSystem.codes.reset} ${ChartRenderer.sparkline(revenueData)} (Mon-Sun)`,
);
console.log("\n");

// =============================================================================
// 7. CATEGORY PERFORMANCE BREAKDOWN
// =============================================================================

console.log(ColorSystem.colorize("  SALES BY CATEGORY", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const categoryPerformance = [
  { category: "Furniture", sales: 18450, percentage: 0.28 },
  { category: "Jewelry & Watches", sales: 14200, percentage: 0.22 },
  { category: "Collectibles", sales: 11800, percentage: 0.18 },
  { category: "Vintage Clothing", sales: 8950, percentage: 0.14 },
  { category: "Art & Decor", sales: 7100, percentage: 0.11 },
  { category: "Other", sales: 4930, percentage: 0.07 },
];

TableRenderer.render(
  categoryPerformance,
  [
    { key: "category", label: "Category", width: 20 },
    { key: "sales", label: "Weekly Sales", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
    { key: "percentage", label: "% of Total", width: 12, align: "right", formatter: (v) => Formatter.percentage(v, 1) },
  ],
  { showIndex: false },
);
console.log("\n");

ChartRenderer.pieChart(
  categoryPerformance.map((c) => ({ label: c.category, value: c.sales })),
);
console.log("\n");

// =============================================================================
// 8. FOOT TRAFFIC ANALYSIS
// =============================================================================

console.log(ColorSystem.colorize("  HOURLY FOOT TRAFFIC - SATURDAY PEAK", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const hourlyTraffic = [
  { hour: "9 AM", visitors: 45 },
  { hour: "10 AM", visitors: 78 },
  { hour: "11 AM", visitors: 124 },
  { hour: "12 PM", visitors: 156 },
  { hour: "1 PM", visitors: 168 },
  { hour: "2 PM", visitors: 142 },
  { hour: "3 PM", visitors: 118 },
  { hour: "4 PM", visitors: 89 },
  { hour: "5 PM", visitors: 52 },
];

ChartRenderer.barChart(
  hourlyTraffic.map((h) => ({ label: h.hour.padEnd(6), value: h.visitors })),
  { showValues: true, width: 50, color: ColorSystem.codes.brightCyan },
);
console.log("\n");

const peakHour = hourlyTraffic.reduce((max, h) => h.visitors > max.visitors ? h : max);
const totalVisitors = hourlyTraffic.reduce((sum, h) => sum + h.visitors, 0);

opsLogger.info("Foot traffic analysis complete", {
  peakHour: peakHour.hour,
  peakVisitors: peakHour.visitors,
  totalVisitors
});

// =============================================================================
// 9. DAILY OPERATIONS CHECKLIST
// =============================================================================

console.log(ColorSystem.colorize("  DAILY OPERATIONS WORKFLOW", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const operationsTasks = [
  "Opening cash drawer audit",
  "Security system check",
  "HVAC verification",
  "Lighting inspection",
  "Vendor booth status check",
  "POS system sync",
  "Signage and displays",
  "Customer service station",
  "Restroom inspection",
  "Emergency exits verified",
];

const opsProgress = new ProgressBar({
  total: operationsTasks.length,
  width: 50,
  showValue: true,
  colorize: true,
});

for (let i = 0; i < operationsTasks.length; i++) {
  opsProgress.update(i + 1);
  opsLogger.debug(`Task completed: ${operationsTasks[i]}`);
  await new Promise((resolve) => setTimeout(resolve, 150));
}
opsProgress.complete();
console.log("\n");

opsLogger.success("All daily operations tasks completed");

// =============================================================================
// 10. VENDOR PAYMENT PROCESSING
// =============================================================================

console.log(ColorSystem.colorize("  MONTHLY VENDOR PAYMENT PROCESSING", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const vendorPayments = [
  { vendor: "Vintage Visions", grossSales: 8450, commission: 0.15, payout: 0 },
  { vendor: "Oklahoma Antiques Co.", grossSales: 12200, commission: 0.12, payout: 0 },
  { vendor: "Route 66 Relics", grossSales: 5890, commission: 0.15, payout: 0 },
  { vendor: "Frontier Finds", grossSales: 7340, commission: 0.15, payout: 0 },
  { vendor: "Crystal & China", grossSales: 9100, commission: 0.10, payout: 0 },
];

// Calculate payouts
vendorPayments.forEach((v) => {
  v.payout = v.grossSales * (1 - v.commission);
});

const paymentSpinner = new Spinner({ message: "Processing vendor payouts..." });
paymentSpinner.start();
await new Promise((resolve) => setTimeout(resolve, 2000));
paymentSpinner.update("Generating payment reports...");
await new Promise((resolve) => setTimeout(resolve, 1000));
paymentSpinner.succeed("Vendor payments processed successfully");
console.log("\n");

TableRenderer.render(
  vendorPayments,
  [
    { key: "vendor", label: "Vendor", width: 24 },
    { key: "grossSales", label: "Gross Sales", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
    { key: "commission", label: "Commission", width: 12, align: "right", formatter: (v) => Formatter.percentage(v, 0) },
    { key: "payout", label: "Net Payout", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
  ],
  { showIndex: true },
);
console.log("\n");

const totalPayouts = vendorPayments.reduce((sum, v) => sum + v.payout, 0);
const totalCommissions = vendorPayments.reduce((sum, v) => sum + (v.grossSales * v.commission), 0);

opsLogger.info("Vendor payouts processed", {
  vendorCount: vendorPayments.length,
  totalPayouts: Formatter.currency(totalPayouts),
  totalCommissions: Formatter.currency(totalCommissions),
});

// =============================================================================
// 11. MARKET INSIGHTS & ALERTS
// =============================================================================

console.log(ColorSystem.colorize("  MARKET INSIGHTS & ALERTS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightGreen}TRENDING UP${ColorSystem.codes.reset}`,
    "",
    "Mid-Century Modern furniture (+23% this month)",
    "Native American jewelry & artifacts (+18%)",
    "Vintage Route 66 memorabilia (+15%)",
  ],
  {
    style: "rounded",
    color: ColorSystem.codes.brightGreen,
    padding: 1,
    title: "Hot Categories",
  },
);
console.log();

BoxRenderer.render(
  [
    `${ColorSystem.codes.brightYellow}ATTENTION REQUIRED${ColorSystem.codes.reset}`,
    "",
    "Booth C-108 rent overdue (14 days)",
    "Fire extinguisher inspection due (Building D)",
    "Parking lot striping scheduled for Tuesday",
    "Insurance renewal deadline: Dec 15",
  ],
  {
    style: "bold",
    color: ColorSystem.codes.brightYellow,
    padding: 1,
    title: "Action Items",
  },
);
console.log();

opsLogger.warning("Overdue rent notice", { booth: "C-108", daysOverdue: 14 });

// =============================================================================
// 12. UPCOMING EVENTS & PROMOTIONS
// =============================================================================

console.log(ColorSystem.colorize("  UPCOMING EVENTS & PROMOTIONS", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const upcomingEvents = [
  { date: "Dec 7-8", event: "Holiday Vintage Market", expectedAttendance: 2500, status: "Confirmed" },
  { date: "Dec 14", event: "Antique Appraisal Day", expectedAttendance: 800, status: "Confirmed" },
  { date: "Dec 21", event: "Last-Minute Gift Fair", expectedAttendance: 1500, status: "Planning" },
  { date: "Jan 4-5", event: "New Year Estate Sale", expectedAttendance: 1200, status: "Planning" },
];

TableRenderer.render(
  upcomingEvents,
  [
    { key: "date", label: "Date", width: 12 },
    { key: "event", label: "Event", width: 28 },
    { key: "expectedAttendance", label: "Expected", width: 10, align: "right", formatter: (v) => Formatter.number(v) },
    { key: "status", label: "Status", width: 12, align: "center" },
  ],
  { showIndex: false },
);
console.log("\n");

// =============================================================================
// 13. SYSTEM HEALTH & METRICS
// =============================================================================

console.log(ColorSystem.colorize("  SYSTEM HEALTH & PERFORMANCE", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

TableRenderer.renderKeyValue([
  { label: "Database Connections", value: "12/100 active" },
  { label: "POS Response Time", value: "45ms avg" },
  { label: "API Uptime (30d)", value: "99.97%" },
  { label: "Storage Used", value: Formatter.bytes(2.4 * 1024 * 1024 * 1024) },
  { label: "Cache Hit Rate", value: "94.2%" },
  { label: "Active Sessions", value: Formatter.number(8) },
]);
console.log("\n");

// System metrics sparklines
const cpuHistory = [32, 28, 35, 42, 38, 45, 52, 48, 41, 36, 33, 29];
const memoryHistory = [58, 59, 61, 64, 62, 65, 68, 66, 63, 61, 59, 58];
const networkHistory = [12, 15, 18, 22, 28, 35, 42, 38, 25, 18, 14, 11];

console.log(
  `${ColorSystem.codes.brightBlue}CPU Usage:${ColorSystem.codes.reset}     ${ChartRenderer.sparkline(cpuHistory)} (${cpuHistory[cpuHistory.length - 1]}%)`,
);
console.log(
  `${ColorSystem.codes.brightBlue}Memory Usage:${ColorSystem.codes.reset}  ${ChartRenderer.sparkline(memoryHistory)} (${memoryHistory[memoryHistory.length - 1]}%)`,
);
console.log(
  `${ColorSystem.codes.brightBlue}Network I/O:${ColorSystem.codes.reset}   ${ChartRenderer.sparkline(networkHistory)} (${networkHistory[networkHistory.length - 1]} MB/s)`,
);
console.log("\n");

// =============================================================================
// 14. END OF DAY SUMMARY
// =============================================================================

console.log(ColorSystem.colorize("  END OF DAY SUMMARY", ColorSystem.codes.bright));
console.log(ColorSystem.colorize("  ────────────────────────────────────────────────", ColorSystem.codes.dim));
console.log();

const logHistory = opsLogger.getHistory();
const warnings = opsLogger.getHistory({ level: "warning" });
const errors = opsLogger.getHistory({ level: "error" });

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}OLD PARIS FLEA MARKET - OKLAHOMA CITY${ColorSystem.codes.reset}`,
    `${ColorSystem.codes.dim}Enterprise Operations Platform${ColorSystem.codes.reset}`,
    "",
    `${ColorSystem.codes.brightGreen}Session Summary${ColorSystem.codes.reset}`,
    `  Total Log Entries: ${Formatter.number(logHistory.length)}`,
    `  Warnings: ${Formatter.number(warnings.length)}`,
    `  Errors: ${Formatter.number(errors.length)}`,
    "",
    `${ColorSystem.codes.brightCyan}Business Metrics${ColorSystem.codes.reset}`,
    `  Weekly Revenue: ${Formatter.currency(weeklyTotal)}`,
    `  Active Vendors: ${Formatter.number(vendors.length)} featured / 127 total`,
    `  Avg Transaction: ${Formatter.currency(avgTransaction)}`,
    "",
    `${ColorSystem.codes.brightYellow}Location${ColorSystem.codes.reset}`,
    "  1001 N Pennsylvania Ave",
    "  Oklahoma City, OK 73107",
    "",
    `Last Updated: ${new Date().toLocaleString()}`,
  ],
  {
    style: "double",
    color: ColorSystem.codes.brightYellow,
    padding: 1,
    title: "Old Paris Flea Market",
    minWidth: 50,
  },
);

console.log("\n");

// Final success message
opsLogger.success("Operations platform demo completed successfully");
console.log(
  ColorSystem.colorize(
    "\n  Thank you for exploring Old Paris Flea Market's enterprise platform!\n",
    ColorSystem.codes.brightCyan,
  ),
);
