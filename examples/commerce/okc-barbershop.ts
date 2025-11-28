#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Thunder Cuts Barbershop - Oklahoma City
 *
 * Traditional barbershop operations and customer experience demo powered by GenesisTrace.
 *
 * Features demonstrated:
 *   - Banner, box, and table renderers for classic service menus
 *   - Bar charts for weekly appointment volume
 *   - Progress bars for grooming rituals and service workflows
 *   - Spinner-driven async moments to simulate customer satisfaction tracking
 *   - Formatter helpers for OKC revenue targets and shop utilization
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

const runDemo = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. SHOP BRANDING
  // ===========================================================================
  BannerRenderer.render({
    title: "THUNDER CUTS BARBERSHOP",
    subtitle: "Oklahoma City • Bricktown • Downtown Corridor",
    description: "Classic cuts, modern grooming, and traditional hot towel shaves",
    version: "v2.1.0",
    author: "OKC Barbershop Excellence",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightCyan,
  });
  console.log("");

  // ===========================================================================
  // 2. OPERATIONS LOGGER
  // ===========================================================================
  const shopLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  shopLogger.info("Bricktown shop systems online", {
    chairsReady: 8,
    barbersOnDuty: 6,
  });
  shopLogger.success("Daily operations dashboard initialized with morning walk-ins");
  shopLogger.debug("Integrations synced: Square POS, Google Calendar, SMS reminders");
  console.log("");

  // ===========================================================================
  // 3. DAILY SNAPSHOT
  // ===========================================================================
  console.log(ColorSystem.colorize("  DAILY OPERATIONS SNAPSHOT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const now = new Date();
  const walkInRate = 0.42;

  BoxRenderer.render(
    [
      `Date: ${Formatter.timestamp(now, "YYYY-MM-DD")} (${now.toLocaleDateString("en-US", { weekday: "long" })})`,
      `Shop Status: ${ColorSystem.colorize("Open", ColorSystem.codes.brightGreen)} · Hours 8:00 AM – 7:00 PM`,
      `Walk-In Rate: ${Formatter.percentage(walkInRate, 0)} · ${walkInRate > 0.3 ? "High traffic mode" : "Standard scheduling"}`,
      `Game Day: ${ColorSystem.colorize("OKC Thunder home game tonight at 7PM", ColorSystem.codes.brightCyan)}`,
      `Focus Services: ${ColorSystem.colorize("Classic fades + hot towel shaves", ColorSystem.codes.brightYellow)}`,
    ],
    {
      title: "Shop Rhythm",
      style: "rounded",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. SERVICE MENU
  // ===========================================================================
  console.log(ColorSystem.colorize("  SIGNATURE SERVICES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────", ColorSystem.codes.dim));
  console.log("");

  const serviceMenu = [
    { name: "Thunder Fade Classic", duration: 35, price: 35, description: "High/mid/low fade with crisp lineup" },
    { name: "Executive Haircut", duration: 40, price: 45, description: "Precision cut with hot lather neck shave" },
    { name: "Traditional Hot Towel Shave", duration: 45, price: 50, description: "Straight razor shave with pre-shave oil" },
    { name: "Beard Sculpting + Trim", duration: 25, price: 28, description: "Shape, trim, and oil treatment" },
    { name: "Young Thunder (12 & Under)", duration: 25, price: 22, description: "Kids cut with cape and lollipop" },
    { name: "Bricktown Deluxe Package", duration: 75, price: 85, description: "Cut, shave, beard trim, hot towel" },
  ];

  TableRenderer.render(
    serviceMenu,
    [
      { key: "name", label: "Service", width: 28 },
      { key: "duration", label: "Time (min)", width: 12, align: "center" },
      { key: "price", label: "Price", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "description", label: "Description", width: 42 },
    ],
    { showIndex: false },
  );
  console.log("");
  shopLogger.info("Service menu loaded", { offerings: serviceMenu.length });

  // ===========================================================================
  // 5. BARBER ROSTER
  // ===========================================================================
  console.log(ColorSystem.colorize("  MASTER BARBERS - OKC CREW", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const barberRoster = [
    { barber: "Marcus Johnson", specialty: "Master fade artist", neighborhood: "Bricktown", cutsToday: 12, utilization: 0.95, signature: "Zero-gap skin fades" },
    { barber: "Carlos Ramirez", specialty: "Traditional shave master", neighborhood: "Downtown", cutsToday: 9, utilization: 0.88, signature: "Straight razor hot towel" },
    { barber: "Damon Wright", specialty: "Beard & grooming expert", neighborhood: "Film Row", cutsToday: 11, utilization: 0.92, signature: "Sculptural beard designs" },
    { barber: "Tony Mitchell", specialty: "Classic cuts specialist", neighborhood: "Deep Deuce", cutsToday: 10, utilization: 0.84, signature: "Executive precision cuts" },
    { barber: "Jordan Lee", specialty: "Youth & family barber", neighborhood: "Midtown", cutsToday: 14, utilization: 0.97, signature: "Fast, friendly kids cuts" },
    { barber: "Ahmed Hassan", specialty: "Textures & styles", neighborhood: "Plaza District", cutsToday: 8, utilization: 0.76, signature: "Ethnic hair specialist" },
  ];

  TableRenderer.render(
    barberRoster,
    [
      { key: "barber", label: "Barber", width: 20 },
      { key: "specialty", label: "Specialty", width: 24 },
      { key: "neighborhood", label: "OKC Area", width: 16 },
      { key: "cutsToday", label: "Cuts Today", width: 12, align: "center" },
      {
        key: "utilization",
        label: "Chair Time",
        width: 12,
        align: "center",
        formatter: (value) => Formatter.percentage(value, 0),
      },
      { key: "signature", label: "Signature Work", width: 26 },
    ],
  );
  console.log("");
  shopLogger.success("Barber crew ready", {
    averageUtilization: Formatter.percentage(
      barberRoster.reduce((sum, barber) => sum + barber.utilization, 0) / barberRoster.length,
      1,
    ),
  });

  // ===========================================================================
  // 6. WEEKLY APPOINTMENT VOLUME
  // ===========================================================================
  console.log(ColorSystem.colorize("  WEEKLY APPOINTMENT VOLUME", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const weeklyVolume = [
    { label: "Mon", value: 42 },
    { label: "Tue", value: 48 },
    { label: "Wed", value: 55 },
    { label: "Thu", value: 62 },
    { label: "Fri", value: 78 },
    { label: "Sat", value: 95 },
    { label: "Sun", value: 34 },
  ];

  ChartRenderer.barChart(weeklyVolume, {
    width: 58,
    showValues: true,
    color: ColorSystem.codes.brightCyan,
    title: "Completed Appointments",
  });
  console.log("");

  const totalCuts = weeklyVolume.reduce((sum, day) => sum + day.value, 0);
  shopLogger.info("Weekly volume analyzed", {
    cutsThisWeek: totalCuts,
    avgPerDay: (totalCuts / weeklyVolume.length).toFixed(1),
  });

  // ===========================================================================
  // 7. TODAY'S SCHEDULE
  // ===========================================================================
  console.log(ColorSystem.colorize("  TODAY'S CHAIR SCHEDULE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────", ColorSystem.codes.dim));
  console.log("");

  const todaysSchedule = [
    { time: "08:30 AM", customer: "James M.", service: "Thunder Fade Classic", barber: "Marcus Johnson", status: "Complete" },
    { time: "09:15 AM", customer: "Robert P.", service: "Traditional Hot Towel Shave", barber: "Carlos Ramirez", status: "In Chair" },
    { time: "10:00 AM", customer: "Kevin T.", service: "Executive Haircut", barber: "Tony Mitchell", status: "Prepping" },
    { time: "11:30 AM", customer: "Walk-In", service: "Beard Sculpting + Trim", barber: "Damon Wright", status: "Waiting" },
    { time: "01:00 PM", customer: "Tyler S.", service: "Bricktown Deluxe Package", barber: "Marcus Johnson", status: "Scheduled" },
    { time: "02:30 PM", customer: "Lucas (10)", service: "Young Thunder", barber: "Jordan Lee", status: "Scheduled" },
    { time: "03:45 PM", customer: "David K.", service: "Executive Haircut", barber: "Ahmed Hassan", status: "Scheduled" },
  ];

  TableRenderer.render(
    todaysSchedule,
    [
      { key: "time", label: "Time", width: 10 },
      { key: "customer", label: "Customer", width: 16 },
      { key: "service", label: "Service", width: 28 },
      { key: "barber", label: "Barber", width: 18 },
      { key: "status", label: "Status", width: 12 },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 8. PRODUCT INVENTORY
  // ===========================================================================
  console.log(ColorSystem.colorize("  PRODUCT INVENTORY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const productInventory = [
    { sku: "OKC-POMADE-01", product: "Thunder Matte Clay", brand: "Layrite", stock: 24, velocity: "Fast", price: 22 },
    { sku: "OKC-OIL-05", product: "Beard Oil - Cedarwood", brand: "Honest Amish", stock: 18, velocity: "Fast", price: 18 },
    { sku: "OKC-RAZOR-03", product: "Safety Razor Kit", brand: "Merkur", stock: 8, velocity: "Steady", price: 45 },
    { sku: "OKC-TONIC-12", product: "Pre-Shave Oil", brand: "Proraso", stock: 15, velocity: "Steady", price: 16 },
    { sku: "OKC-BALM-07", product: "Aftershave Balm", brand: "Baxter of CA", stock: 12, velocity: "Fast", price: 24 },
    { sku: "OKC-COMB-02", product: "Pocket Comb - Metal", brand: "Chicago", stock: 30, velocity: "Low", price: 8 },
  ];

  TableRenderer.render(
    productInventory,
    [
      { key: "sku", label: "SKU", width: 14 },
      { key: "product", label: "Product", width: 24 },
      { key: "brand", label: "Brand", width: 16 },
      { key: "stock", label: "Stock", width: 8, align: "center" },
      { key: "velocity", label: "Movement", width: 10, align: "center" },
      { key: "price", label: "Price", width: 8, align: "right", formatter: (v) => Formatter.currency(v) },
    ],
    { showIndex: false },
  );
  console.log("");

  const inventoryValue = productInventory.reduce((sum, item) => sum + item.price * item.stock, 0);
  BoxRenderer.render(
    [
      `Retail Inventory Value: ${Formatter.currency(inventoryValue)}`,
      `Monthly Product Sales: ${Formatter.currency(3450)} / month`,
      `Top Mover: ${productInventory.find((item) => item.velocity === "Fast")?.product ?? "N/A"}`,
      `Restock Alert: Safety Razor Kit (8 units remaining)`,
    ],
    {
      title: "Inventory Metrics",
      style: "single",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 9. SERVICE PROGRESSION
  // ===========================================================================
  console.log(ColorSystem.colorize("  ACTIVE SERVICE PROGRESSION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const activeServices = [
    { title: "Morning Rush (Fades & Cuts)", completion: 0.82, detail: "8 of 10 appointments complete" },
    { title: "Hot Towel Shave Station", completion: 0.65, detail: "Traditional shaves in progress" },
    { title: "Afternoon Walk-Ins", completion: 0.38, detail: "Queue building for evening rush" },
  ];

  for (const stage of activeServices) {
    const bar = new ProgressBar({
      total: 100,
      width: 45,
      colorize: true,
      showValue: true,
    });
    bar.update(Math.round(stage.completion * 100));
    bar.complete();
    console.log(`${ColorSystem.colorize(stage.title, ColorSystem.codes.brightCyan)} → ${stage.detail}`);
    console.log("");
  }

  // ===========================================================================
  // 10. MEMBERSHIP & LOYALTY
  // ===========================================================================
  console.log(ColorSystem.colorize("  VIP MEMBERSHIP & LOYALTY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const membershipStats = [
    { label: "Thunder VIP Members", value: "168 (↑9 this week)" },
    { label: "Monthly Membership Revenue", value: Formatter.currency(168 * 65) },
    { label: "Loyalty Points Redeemed", value: "42 free cuts this month" },
    { label: "SMS Reminder Success Rate", value: "94% (show rate improvement)" },
  ];

  TableRenderer.renderKeyValue(membershipStats);
  console.log("");

  const feedbackSpinner = new Spinner({ message: "Analyzing customer feedback..." });
  feedbackSpinner.start();
  await sleep(900);
  feedbackSpinner.succeed("Customer satisfaction synced (127 recent reviews analyzed)");
  console.log(
    ColorSystem.colorize(
      "Top mentions: 'friendly service', 'clean shop', 'best fades in OKC', 'convenient Bricktown location'",
      ColorSystem.codes.brightCyan,
    ),
  );
  console.log("");

  // ===========================================================================
  // 11. REVENUE DASHBOARD
  // ===========================================================================
  console.log(ColorSystem.colorize("  DAILY REVENUE DASHBOARD", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const serviceCuts = barberRoster.reduce((sum, barber) => sum + barber.cutsToday, 0);
  const avgServicePrice = 38;
  const serviceRevenue = serviceCuts * avgServicePrice;
  const productRevenue = 450;
  const totalRevenue = serviceRevenue + productRevenue;

  const revenueBreakdown = [
    { category: "Haircuts & Services", amount: serviceRevenue, percentage: (serviceRevenue / totalRevenue) },
    { category: "Product Sales", amount: productRevenue, percentage: (productRevenue / totalRevenue) },
  ];

  TableRenderer.render(
    revenueBreakdown,
    [
      { key: "category", label: "Category", width: 24 },
      { key: "amount", label: "Revenue", width: 12, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "percentage", label: "% of Total", width: 12, align: "right", formatter: (v) => Formatter.percentage(v, 1) },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      `Total Daily Revenue: ${Formatter.currency(totalRevenue)}`,
      `Services Completed: ${serviceCuts} cuts`,
      `Average Ticket: ${Formatter.currency(totalRevenue / serviceCuts)}`,
      `Projected Weekly: ${Formatter.currency(totalRevenue * 6)}`,
      `Monthly Target Progress: ${Formatter.percentage(totalRevenue / (65000 / 26), 0)}`,
    ],
    {
      title: "Revenue Summary",
      style: "double",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 12. OPERATIONAL INSIGHTS
  // ===========================================================================
  console.log(ColorSystem.colorize("  OPERATIONAL INSIGHTS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────", ColorSystem.codes.dim));
  console.log("");

  const insights = [
    "Saturday peak performance: 95 appointments (shop record this month)",
    "Jordan Lee leading daily volume at 97% chair utilization",
    "Walk-in traffic up 18% due to Thunder game day proximity",
    "Hot towel shave bookings increased 23% after Instagram campaign",
    "Membership conversion rate at 31% (target: 35%)",
  ];

  for (let i = 0; i < insights.length; i++) {
    console.log(`  ${ColorSystem.colorize(`${i + 1}.`, ColorSystem.codes.brightCyan)} ${insights[i]}`);
  }
  console.log("");

  // ===========================================================================
  // 13. WRAP-UP
  // ===========================================================================
  shopLogger.success("Oklahoma City barbershop operations showcase complete", {
    appointmentsToday: todaysSchedule.length,
    totalRevenue: Formatter.currency(totalRevenue),
    barberUtilization: Formatter.percentage(
      barberRoster.reduce((sum, b) => sum + b.utilization, 0) / barberRoster.length,
      0,
    ),
  });
  console.log(ColorSystem.colorize("\n  Demo complete – Thunder Up and stay fresh, OKC! ✂️\n", ColorSystem.codes.brightCyan));
};

await runDemo();
