#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Panadería Mexican - Familia Vargas POS System
 * 1906 S Central Ave • Oklahoma City, OK 73129
 *
 * GenesisTrace demonstration of a point-of-sale cockpit for a family-owned bakery.
 * Highlights:
 *   - Banner + boxes to frame the business narrative
 *   - Menu matrix and open ticket queue rendered as formatted tables
 *   - Drawer health snapshot with formatted currency totals
 *   - Production progress bars plus low-stock alerts
 *   - Hourly revenue chart and spinner-driven sync feedback
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

interface MenuItem {
  sku: string;
  item: string;
  category: string;
  station: string;
  price: number;
  daypart: string;
  flag?: string;
}

interface OrderTicket {
  ticket: string;
  channel: string;
  customer: string;
  items: string;
  total: number;
  status: string;
  promise: string;
  supervisor: string;
  tone: "green" | "yellow" | "magenta";
}

interface IngredientStock {
  ingredient: string;
  onHand: number;
  par: number;
  unit: string;
  nextDelivery: string;
}

const panaderiaProfile = {
  name: "Panadería Mexican",
  family: "Familia Vargas",
  address: "1906 S Central Ave, Oklahoma City, OK 73129",
  motto: "Pan dulce, café caliente, y trato familiar desde 1998.",
  hours: "4:30a – 8:00p (Daily)",
};

const menuMatrix: MenuItem[] = [
  {
    sku: "PAN-101",
    item: "Concha Rosa",
    category: "Pan Dulce",
    station: "Sweet Bench",
    price: 3.25,
    daypart: "AM Rush",
    flag: "House Favorite",
  },
  {
    sku: "PAN-135",
    item: "Empanada de Piña",
    category: "Pan Dulce",
    station: "Deck Oven",
    price: 3.85,
    daypart: "All Day",
  },
  {
    sku: "PAN-208",
    item: "Bolillo",
    category: "Savory Bread",
    station: "Oven Line",
    price: 1.6,
    daypart: "Bulk Orders",
    flag: "Sandwich Base",
  },
  {
    sku: "PAN-260",
    item: "Torta de Jamón",
    category: "Comida Rápida",
    station: "Commissary Table",
    price: 9.5,
    daypart: "Lunch",
  },
  {
    sku: "CAF-011",
    item: "Café de Olla",
    category: "Bebida Caliente",
    station: "Coffee Bar",
    price: 4.5,
    daypart: "AM Rush",
    flag: "Cinnamon Piloncillo",
  },
  {
    sku: "CAF-018",
    item: "Champurrado",
    category: "Bebida Caliente",
    station: "Stove Top",
    price: 4.95,
    daypart: "Cold Weather",
  },
  {
    sku: "DES-301",
    item: "Tres Leches Slice",
    category: "Pastel",
    station: "Cold Case",
    price: 6.75,
    daypart: "Celebrations",
  },
  {
    sku: "DES-315",
    item: "Flan Casero",
    category: "Postre",
    station: "Cold Case",
    price: 5.25,
    daypart: "Dinner",
  },
];

const openTickets: OrderTicket[] = [
  {
    ticket: "#1742",
    channel: "Front Counter",
    customer: "Drive-up SUV",
    items: "Concha + Café de Olla",
    total: 7.75,
    status: "Handoff 30s",
    promise: "Now",
    supervisor: "Noemí",
    tone: "green",
  },
  {
    ticket: "#1743",
    channel: "Curbside",
    customer: "Garcia Roofing",
    items: "8 Bolillos + Champurrado",
    total: 28.25,
    status: "Packing",
    promise: "2 min",
    supervisor: "Luis",
    tone: "yellow",
  },
  {
    ticket: "#1744",
    channel: "Delivery",
    customer: "DoorDash 55214",
    items: "Tres Leches + 2 Conchas",
    total: 24.9,
    status: "Await Driver",
    promise: "6 min",
    supervisor: "Rosa",
    tone: "magenta",
  },
  {
    ticket: "#1745",
    channel: "Dining Room",
    customer: "Mesa 4",
    items: "Torta + Café",
    total: 14.0,
    status: "Plating",
    promise: "1 min",
    supervisor: "Mateo",
    tone: "yellow",
  },
  {
    ticket: "#1746",
    channel: "Call-in",
    customer: "Iglesia del Sur",
    items: "24 Bolillos",
    total: 38.4,
    status: "Mixing Dough",
    promise: "Ready 12:15p",
    supervisor: "Clara",
    tone: "green",
  },
];

const drawerHealth = {
  openingFloat: 150,
  cashSales: 842.37,
  cardSales: 1194.58,
  mobileApps: 215.42,
  refunds: 0,
  tips: 134.21,
  promoCovers: 5,
};

const ingredientLevels: IngredientStock[] = [
  {
    ingredient: "Bolillo Dough Balls",
    onHand: 68,
    par: 120,
    unit: "pcs",
    nextDelivery: "Tonight 8:45p",
  },
  {
    ingredient: "Piloncillo Syrup",
    onHand: 1.5,
    par: 4,
    unit: "gal",
    nextDelivery: "Tomorrow 5:00a",
  },
  {
    ingredient: "Canela Sticks",
    onHand: 42,
    par: 35,
    unit: "sticks",
    nextDelivery: "In House",
  },
  {
    ingredient: "Evaporated Milk",
    onHand: 18,
    par: 24,
    unit: "cans",
    nextDelivery: "Vendor Run 3:00p",
  },
  {
    ingredient: "Abuelita Chocolate",
    onHand: 9,
    par: 25,
    unit: "tablets",
    nextDelivery: "Tomorrow 6:30a",
  },
  {
    ingredient: "Fresh Yeast",
    onHand: 5.5,
    par: 8,
    unit: "lbs",
    nextDelivery: "Weekly Drop",
  },
];

const hourlySales = [
  { label: "5a", value: 90 },
  { label: "6a", value: 180 },
  { label: "7a", value: 255 },
  { label: "8a", value: 240 },
  { label: "9a", value: 198 },
  { label: "10a", value: 175 },
  { label: "11a", value: 210 },
  { label: "12p", value: 242 },
];

const colorByTone: Record<OrderTicket["tone"], string> = {
  green: ColorSystem.codes.brightGreen,
  yellow: ColorSystem.codes.yellow,
  magenta: ColorSystem.codes.brightMagenta,
};

const printSection = (title: string) => {
  console.log(ColorSystem.colorize(title, ColorSystem.codes.bright));
};

const renderProgress = (label: string, current: number, total: number) => {
  console.log(`  ${label}`);
  const bar = new ProgressBar({
    total,
    width: 32,
    showValue: true,
    showPercentage: true,
  });
  bar.update(current);
  console.log("");
};

const renderLowStock = () => {
  const alerts = ingredientLevels
    .filter((item) => item.onHand / item.par < 0.45)
    .map((item) => {
      const coverage = Math.round((item.onHand / item.par) * 100);
      const label = `${item.ingredient}: ${coverage}% of par (${item.onHand} ${item.unit})`;
      return coverage < 30
        ? ColorSystem.colorize(label, ColorSystem.codes.red)
        : ColorSystem.colorize(label, ColorSystem.codes.yellow);
    });

  if (alerts.length === 0) return;

  BoxRenderer.render(
    alerts,
    {
      style: "rounded",
      color: ColorSystem.codes.yellow,
      title: "Prep Alerts",
      padding: 1,
    },
  );
  console.log("");
};

const renderMenuMatrix = () => {
  printSection("Menu Matrix");
  TableRenderer.render(
    menuMatrix.map((item) => ({
      ...item,
      price: Formatter.currency(item.price),
      flag: item.flag ?? "—",
    })),
    [
      { key: "sku", label: "SKU", width: 8 },
      { key: "item", label: "Item", width: 20 },
      { key: "category", label: "Category", width: 16 },
      { key: "station", label: "Station", width: 16 },
      { key: "price", label: "Price", width: 10 },
      { key: "daypart", label: "Daypart", width: 12 },
      { key: "flag", label: "Notes", width: 18 },
    ],
    { showIndex: true },
  );
  console.log("");
};

const renderTicketQueue = () => {
  printSection("Live Ticket Queue");
  TableRenderer.render(
    openTickets.map((ticket) => ({
      ...ticket,
      total: Formatter.currency(ticket.total),
      status: ColorSystem.colorize(ticket.status, colorByTone[ticket.tone]),
    })),
    [
      { key: "ticket", label: "Ticket", width: 8 },
      { key: "channel", label: "Channel", width: 12 },
      { key: "customer", label: "Customer", width: 16 },
      { key: "items", label: "Items", width: 28 },
      { key: "total", label: "Total", width: 10 },
      { key: "status", label: "Status", width: 14 },
      { key: "promise", label: "Promise", width: 12 },
      { key: "supervisor", label: "Lead", width: 8 },
    ],
    { showIndex: false },
  );
  console.log("");
};

const renderDrawerHealth = () => {
  const gross = drawerHealth.cashSales + drawerHealth.cardSales + drawerHealth.mobileApps;
  const avgTicket = gross / 146;

  printSection("Drawer & Payment Mix");
  BoxRenderer.render(
    [
      `Opening Float: ${Formatter.currency(drawerHealth.openingFloat)}`,
      `Cash Sales: ${Formatter.currency(drawerHealth.cashSales)}`,
      `Card Sales: ${Formatter.currency(drawerHealth.cardSales)}`,
      `Mobile Apps: ${Formatter.currency(drawerHealth.mobileApps)}`,
      `Tips Recorded: ${Formatter.currency(drawerHealth.tips)}`,
      `Avg Ticket (${146} orders): ${Formatter.currency(avgTicket)}`,
      `Promo Covers: ${drawerHealth.promoCovers}`,
    ],
    {
      style: "double",
      color: ColorSystem.codes.brightCyan,
      title: "Register Snapshot",
      padding: 1,
    },
  );
  console.log("");
};

const renderInventory = () => {
  printSection("Production & Inventory");
  TableRenderer.render(
    ingredientLevels.map((item) => ({
      ingredient: item.ingredient,
      onHand: `${item.onHand} ${item.unit}`,
      par: `${item.par} ${item.unit}`,
      coverage: `${Math.round((item.onHand / item.par) * 100)}%`,
      nextDelivery: item.nextDelivery,
    })),
    [
      { key: "ingredient", label: "Ingredient", width: 24 },
      { key: "onHand", label: "On Hand", width: 12 },
      { key: "par", label: "Par", width: 12 },
      { key: "coverage", label: "Coverage", width: 10 },
      { key: "nextDelivery", label: "Next Delivery", width: 18 },
    ],
  );
  console.log("");

  renderLowStock();

  printSection("Line Progress");
  renderProgress("Concha Deck • Batch #3", 78, 96);
  renderProgress("Champurrado Cauldron", 3, 5);
  renderProgress("Torta Assembly Board", 4, 7);
};

const renderSalesRhythm = () => {
  printSection("Hourly Sales Trajectory (USD)");
  ChartRenderer.barChart(
    hourlySales,
    {
      showValues: true,
      width: 40,
      color: ColorSystem.codes.brightYellow,
    },
  );
  console.log("");
};

async function main() {
  console.clear();
  console.log("\n");

  BannerRenderer.render({
    title: "Panadería Mexican POS",
    subtitle: `${panaderiaProfile.family} • ${panaderiaProfile.address}`,
    description: panaderiaProfile.motto,
    author: "GenesisTrace Retail Lab",
    version: "POS Shift HUD",
    width: 96,
    color: ColorSystem.codes.brightYellow,
  });
  console.log("");

  BoxRenderer.render(
    [
      `Hours: ${panaderiaProfile.hours}`,
      "Focus: Dawn café rush, lunch tortas, evening pastry boxes",
      "Promise: Neighborhood warmth + bilingual hospitality",
    ],
    {
      style: "rounded",
      color: ColorSystem.codes.brightYellow,
      title: "Familia Vargas House Brief",
    },
  );
  console.log("");

  const posLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );
  posLogger.info("AM shift authenticated", { clerk: "Valeria" });
  posLogger.success("Kitchen checks complete", { ovens: "540°F", espresso: "Ready" });
  posLogger.warning("Piloncillo syrup trending low", { gallons: 1.5 });
  posLogger.info("Mobile apps linked", { providers: ["Square", "DoorDash"] });
  console.log("");

  renderMenuMatrix();
  renderTicketQueue();
  renderDrawerHealth();
  renderInventory();
  renderSalesRhythm();

  printSection("Sync Activity");
  const spinner = new Spinner({ message: "Reconciling delivery app payouts..." });
  spinner.start();
  await sleep(800);
  spinner.succeed("Delivery deposits matched to ledger");

  const closeoutEtaBar = new ProgressBar({
    total: 120,
    width: 38,
    showPercentage: true,
    showValue: true,
  });
  console.log("\nCloseout checklist (minutes remaining)");
  closeoutEtaBar.update(45);
  console.log("");

  BoxRenderer.render(
    [
      "All systems green • keep cafetera topped + greet everyone en español",
      "Family legacy thrives when prep lists stay digital + guests feel at home.",
    ],
    {
      style: "single",
      color: ColorSystem.codes.brightGreen,
      title: "Operational Note",
      padding: 1,
    },
  );
}

if (import.meta.main) {
  await main();
}
