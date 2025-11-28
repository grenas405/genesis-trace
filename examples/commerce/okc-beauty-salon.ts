#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Lumen & Lace Beauty House - Oklahoma City
 *
 * Boutique salon operations and guest experience demo powered by GenesisTrace.
 *
 * Features demonstrated:
 *   - Banner, box, and table renderers for premium service menus
 *   - Bar charts for weekly booking cadence
 *   - Progress bars for spa rituals and guest journeys
 *   - Spinner-driven async moments to simulate social sentiment tracking
 *   - Formatter helpers for OKC revenue targets and utilization math
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
  // 1. FRONT DESK BRANDING
  // ===========================================================================
  BannerRenderer.render({
    title: "LUMEN & LACE BEAUTY HOUSE",
    subtitle: "Oklahoma City • Midtown • Plaza District Corridor",
    description: "Luxury hair, skin, and bridal services orchestrated with GenesisTrace",
    version: "v3.7.0",
    author: "OKC Salon Innovation Lab",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightMagenta,
  });
  console.log("");

  // ===========================================================================
  // 2. OPERATIONS LOGGER
  // ===========================================================================
  const salonLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  salonLogger.info("Midtown OKC switchboard online", {
    suitesReady: 6,
    stylistsOnDuty: 5,
  });
  salonLogger.success("Guest experience graph hydrated with overnight pre-checkins");
  salonLogger.debug("Integrations synced: Boulevard bookings, Shopify retail, Slack concierge");
  console.log("");

  // ===========================================================================
  // 3. DAYBOOK SNAPSHOT
  // ===========================================================================
  console.log(ColorSystem.colorize("  MIDTOWN DAYBOOK SNAPSHOT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const now = new Date();
  const humidityIndex = 0.78;

  BoxRenderer.render(
    [
      `Date: ${Formatter.timestamp(now, "YYYY-MM-DD")} (${now.toLocaleDateString("en-US", { weekday: "long" })})`,
      `Doors: ${ColorSystem.colorize("Open", ColorSystem.codes.brightGreen)} · Hours 8:00 AM – 8:30 PM`,
      `Humidity Watch: ${Formatter.percentage(humidityIndex, 0)} · ${humidityIndex > 0.6 ? "Anti-frizz protocol enabled" : "Standard finishing routine"}`,
      `Neighborhood Pulse: ${ColorSystem.colorize("Plaza District Art Walk tonight", ColorSystem.codes.brightCyan)}`,
      `Hero Focus: ${ColorSystem.colorize("Glam blowouts + bridal trials", ColorSystem.codes.brightMagenta)}`,
    ],
    {
      title: "Service Rhythm",
      style: "rounded",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. SIGNATURE SERVICE MENU
  // ===========================================================================
  console.log(ColorSystem.colorize("  SIGNATURE SERVICE MENU", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const serviceMenu = [
    { name: "Thunder Glam Blowout", duration: 55, price: 95, vibe: "Runway volume + humidity shield" },
    { name: "Plaza District Balayage", duration: 150, price: 245, vibe: "Soft copper + luminous ribbons" },
    { name: "Midtown Gloss Reset", duration: 75, price: 135, vibe: "Acidic gloss lock + shine serum" },
    { name: "Scissortail Sculpted Bob", duration: 90, price: 165, vibe: "Precision bob with dry cutting" },
    { name: "Prairie Hydrafacial Ritual", duration: 60, price: 180, vibe: "LED lymphatic + cold compress" },
    { name: "Skydance Bridal Suite Trial", duration: 120, price: 210, vibe: "Editorial upstyle + camera test" },
  ];

  TableRenderer.render(
    serviceMenu,
    [
      { key: "name", label: "Service", width: 28 },
      { key: "duration", label: "Duration (min)", width: 14, align: "center" },
      { key: "price", label: "Rate", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "vibe", label: "Experience Mood", width: 38 },
    ],
    { showIndex: false },
  );
  console.log("");
  salonLogger.info("Signature menu rendered", { offerings: serviceMenu.length });

  // ===========================================================================
  // 5. GLAM TEAM - OKC ARTISTS
  // ===========================================================================
  console.log(ColorSystem.colorize("  GLAM TEAM - OKC ARTISTS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const glamTeam = [
    { artist: "Camila Ruiz", specialty: "Dimensional color lead", neighborhood: "Plaza District", seatsToday: 7, utilization: 0.92, signature: "Copper on textured brunettes" },
    { artist: "Maya Greene", specialty: "Bridal + styling director", neighborhood: "Nichols Hills", seatsToday: 5, utilization: 0.87, signature: "Weightless upstyles" },
    { artist: "Andre Whitfield", specialty: "Precision cutting", neighborhood: "Film Row", seatsToday: 6, utilization: 0.78, signature: "Soft razor bobs" },
    { artist: "Savannah Cho", specialty: "Skin therapy lead", neighborhood: "Midtown", seatsToday: 8, utilization: 0.83, signature: "LED + sculpting facials" },
    { artist: "Ben Torres", specialty: "Mens grooming", neighborhood: "Deep Deuce", seatsToday: 4, utilization: 0.64, signature: "Classic taper + beard design" },
  ];

  TableRenderer.render(
    glamTeam,
    [
      { key: "artist", label: "Artist", width: 20 },
      { key: "specialty", label: "Craft", width: 22 },
      { key: "neighborhood", label: "OKC Base", width: 16 },
      { key: "seatsToday", label: "Guests Today", width: 14, align: "center" },
      {
        key: "utilization",
        label: "Suite Utilization",
        width: 16,
        align: "center",
        formatter: (value) => Formatter.percentage(value, 0),
      },
      { key: "signature", label: "Signature", width: 28 },
    ],
  );
  console.log("");
  salonLogger.success("Artist roster ready", {
    averageUtilization: Formatter.percentage(
      glamTeam.reduce((sum, artist) => sum + artist.utilization, 0) / glamTeam.length,
      1,
    ),
  });

  // ===========================================================================
  // 6. BOOKING VELOCITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  WEEKLY BOOKING VELOCITY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const bookingCadence = [
    { label: "Mon", value: 38 },
    { label: "Tue", value: 44 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 61 },
    { label: "Fri", value: 74 },
    { label: "Sat", value: 88 },
    { label: "Sun", value: 46 },
  ];

  ChartRenderer.barChart(bookingCadence, {
    width: 58,
    showValues: true,
    color: ColorSystem.codes.brightMagenta,
    title: "Completed Guests",
  });
  console.log("");

  const totalGuests = bookingCadence.reduce((sum, day) => sum + day.value, 0);
  salonLogger.info("Booking cadence analyzed", {
    guestsThisWeek: totalGuests,
    avgPerDay: (totalGuests / bookingCadence.length).toFixed(1),
  });

  // ===========================================================================
  // 7. TODAY'S SCHEDULE
  // ===========================================================================
  console.log(ColorSystem.colorize("  TODAY'S SUITE SCHEDULE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const todaysSchedule = [
    { time: "08:30 AM", guest: "Lauren H.", service: "Bridal Trial Suite", artist: "Maya Greene", status: "Finishing" },
    { time: "09:45 AM", guest: "Noah D.", service: "Thunder Glam Blowout", artist: "Camila Ruiz", status: "Processing" },
    { time: "11:15 AM", guest: "Priya K.", service: "Midtown Gloss Reset", artist: "Andre Whitfield", status: "Seated" },
    { time: "01:00 PM", guest: "Avery P.", service: "Prairie Hydrafacial", artist: "Savannah Cho", status: "Intake" },
    { time: "02:30 PM", guest: "Jordan M.", service: "Scissortail Sculpted Bob", artist: "Andre Whitfield", status: "Booked" },
    { time: "04:00 PM", guest: "Celeste W.", service: "Plaza District Balayage", artist: "Camila Ruiz", status: "Consult" },
  ];

  TableRenderer.render(
    todaysSchedule,
    [
      { key: "time", label: "Time", width: 10 },
      { key: "guest", label: "Guest", width: 16 },
      { key: "service", label: "Service", width: 28 },
      { key: "artist", label: "Assigned Artist", width: 18 },
      { key: "status", label: "Status", width: 12 },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 8. RETAIL SHELF INTELLIGENCE
  // ===========================================================================
  console.log(ColorSystem.colorize("  RETAIL SHELF INTELLIGENCE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const retailShelves = [
    { sku: "OKC-HAIR-001", product: "Humidity Shield Serum", brand: "R+Co Bleu", stock: 18, velocity: "Fast", price: 48 },
    { sku: "OKC-SKIN-014", product: "Prairie Cloud Cleanser", brand: "SkinBetter", stock: 12, velocity: "Steady", price: 36 },
    { sku: "OKC-HAIR-009", product: "Shine Mist No. 23", brand: "Davines", stock: 22, velocity: "Fast", price: 32 },
    { sku: "OKC-SKIN-021", product: "Desert Rose Balm", brand: "Osea", stock: 9, velocity: "Low", price: 58 },
    { sku: "OKC-HOME-002", product: "Luxe Candle - Scissortail", brand: "Local", stock: 30, velocity: "Fast", price: 42 },
  ];

  TableRenderer.render(
    retailShelves,
    [
      { key: "sku", label: "SKU", width: 12 },
      { key: "product", label: "Product", width: 26 },
      { key: "brand", label: "Brand", width: 16 },
      { key: "stock", label: "On Hand", width: 10, align: "center" },
      { key: "velocity", label: "Velocity", width: 12, align: "center" },
      { key: "price", label: "Price", width: 8, align: "right", formatter: (v) => Formatter.currency(v) },
    ],
    { showIndex: false },
  );
  console.log("");

  const shelfValue = retailShelves.reduce((sum, item) => sum + item.price * item.stock, 0);
  BoxRenderer.render(
    [
      `Retail Inventory Value: ${Formatter.currency(shelfValue)}`,
      `Glow Society Auto-Shipments: ${Formatter.currency(4280)} / month`,
      `Top Velocity: ${retailShelves.find((item) => item.velocity === "Fast")?.product ?? "N/A"}`,
    ],
    {
      title: "Retail KPIs",
      style: "single",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 9. EXPERIENCE PROGRESSION
  // ===========================================================================
  console.log(ColorSystem.colorize("  EXPERIENCE PROGRESSION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const experiences = [
    { title: "Morning Glam Lab", completion: 0.68, detail: "Live color corrections + glossing" },
    { title: "Skin Atelier", completion: 0.52, detail: "Hydrafacial stacks + LED rooms" },
    { title: "Evening Bridal Rehearsal", completion: 0.37, detail: "Trial suites + content capture" },
  ];

  for (const stage of experiences) {
    const bar = new ProgressBar({
      total: 100,
      width: 45,
      colorize: true,
      showValue: true,
    });
    bar.update(Math.round(stage.completion * 100));
    bar.complete();
    console.log(`${ColorSystem.colorize(stage.title, ColorSystem.codes.brightMagenta)} → ${stage.detail}`);
    console.log("");
  }

  // ===========================================================================
  // 10. MEMBERSHIP + SENTIMENT
  // ===========================================================================
  console.log(ColorSystem.colorize("  GUEST MEMBERSHIP + SENTIMENT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const membershipHighlights = [
    { label: "Glow Society Members", value: "214 (↑12 this week)" },
    { label: "Monthly Draft", value: Formatter.currency(214 * 89) },
    { label: "Win-Back Targets", value: "15 lapsed guests scheduled via SMS" },
    { label: "Concierge Hotline", value: "7 VIP texts awaiting follow-up" },
  ];

  TableRenderer.renderKeyValue(membershipHighlights);
  console.log("");

  const sentimentSpinner = new Spinner({ message: "Listening to OKC chatter..." });
  sentimentSpinner.start();
  await sleep(900);
  sentimentSpinner.succeed("Community sentiment synced (98 socials tracked)");
  console.log(
    ColorSystem.colorize(
      "Guests referencing Scissortail Park bridal pop-up + OKC Thunder watch parties.",
      ColorSystem.codes.brightCyan,
    ),
  );
  console.log("");

  // ===========================================================================
  // 11. WRAP-UP
  // ===========================================================================
  salonLogger.success("Oklahoma City beauty salon showcase complete", {
    guestsOnDeck: todaysSchedule.length,
    retailValue: Formatter.currency(shelfValue),
  });
  console.log(ColorSystem.colorize("\n  Demo complete – see you at Plaza District First Friday ✨\n", ColorSystem.codes.brightMagenta));
};

await runDemo();
