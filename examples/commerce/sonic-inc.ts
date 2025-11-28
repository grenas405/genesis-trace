#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Sonic Drive-In - Drive-In Operations Management System
 * Oklahoma City - Multi-Location Operations
 *
 * Comprehensive operations management demo powered by GenesisTrace.
 *
 * Features demonstrated:
 *   - Drive-in stall status and order tracking
 *   - Multi-location inventory management
 *   - Menu item pricing and food cost analysis
 *   - Happy Hour promotions and discounts
 *   - Employee shift management and scheduling
 *   - Real-time order queue with carhop assignments
 *   - Sales analytics by time period and location
 *   - Kitchen prep workflow and supply chain
 *   - Ice cream machine status and maintenance alerts
 *   - Revenue dashboard with profit margins
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

// ============================================================================
// DATA STRUCTURES
// ============================================================================

interface MenuItem {
  sku: string;
  name: string;
  category: string;
  price: number;
  happyHourPrice?: number;
  ingredients: { item: string; amount: number; unit: string }[];
  prepTime: number;
  popularity: number;
}

interface InventoryItem {
  sku: string;
  name: string;
  category: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  optimalStock: number;
  costPerUnit: number;
  supplier: string;
  location: string;
}

interface DriveInStall {
  stallNumber: number;
  status: "Available" | "Occupied" | "Order Pending" | "Order Ready" | "Out of Service";
  customer?: string;
  orderNumber?: number;
  orderTotal?: number;
  timeOccupied?: number;
}

interface Employee {
  id: string;
  name: string;
  role: string;
  shift: string;
  hoursToday: number;
  ordersServed: number;
  status: string;
}

// ============================================================================
// MENU DATA
// ============================================================================

const menu: MenuItem[] = [
  // Burgers
  {
    sku: "BRG-001",
    name: "Sonic Cheeseburger",
    category: "Burgers",
    price: 4.99,
    happyHourPrice: 3.99,
    ingredients: [
      { item: "Beef Patty", amount: 1, unit: "count" },
      { item: "Bun", amount: 1, unit: "count" },
      { item: "Cheese Slice", amount: 1, unit: "count" },
      { item: "Lettuce", amount: 0.5, unit: "oz" },
      { item: "Tomato", amount: 1, unit: "slice" },
    ],
    prepTime: 4,
    popularity: 92,
  },
  {
    sku: "BRG-002",
    name: "SuperSonic Double Cheeseburger",
    category: "Burgers",
    price: 6.99,
    ingredients: [
      { item: "Beef Patty", amount: 2, unit: "count" },
      { item: "Bun", amount: 1, unit: "count" },
      { item: "Cheese Slice", amount: 2, unit: "count" },
      { item: "Lettuce", amount: 1, unit: "oz" },
      { item: "Tomato", amount: 2, unit: "slice" },
      { item: "Mayo", amount: 0.5, unit: "oz" },
    ],
    prepTime: 5,
    popularity: 85,
  },
  {
    sku: "BRG-003",
    name: "Bacon Cheeseburger Toaster",
    category: "Burgers",
    price: 7.49,
    ingredients: [
      { item: "Beef Patty", amount: 1, unit: "count" },
      { item: "Texas Toast", amount: 2, unit: "slices" },
      { item: "Bacon Strips", amount: 3, unit: "count" },
      { item: "Cheese Slice", amount: 2, unit: "count" },
    ],
    prepTime: 6,
    popularity: 78,
  },

  // Hot Dogs & Sandwiches
  {
    sku: "HOT-001",
    name: "Footlong Quarter Pound Coney",
    category: "Hot Dogs",
    price: 5.49,
    happyHourPrice: 4.49,
    ingredients: [
      { item: "Footlong Hot Dog", amount: 1, unit: "count" },
      { item: "Hot Dog Bun", amount: 1, unit: "count" },
      { item: "Chili", amount: 2, unit: "oz" },
      { item: "Cheese Sauce", amount: 1, unit: "oz" },
      { item: "Onions", amount: 0.5, unit: "oz" },
    ],
    prepTime: 3,
    popularity: 73,
  },
  {
    sku: "SND-001",
    name: "Crispy Chicken Sandwich",
    category: "Sandwiches",
    price: 6.29,
    ingredients: [
      { item: "Crispy Chicken Patty", amount: 1, unit: "count" },
      { item: "Bun", amount: 1, unit: "count" },
      { item: "Lettuce", amount: 0.5, unit: "oz" },
      { item: "Mayo", amount: 0.5, unit: "oz" },
    ],
    prepTime: 5,
    popularity: 68,
  },

  // Drinks
  {
    sku: "DRK-001",
    name: "Cherry Limeade (Medium)",
    category: "Drinks",
    price: 2.99,
    happyHourPrice: 1.49,
    ingredients: [
      { item: "Sprite", amount: 20, unit: "oz" },
      { item: "Cherry Syrup", amount: 1, unit: "oz" },
      { item: "Lime Juice", amount: 0.5, unit: "oz" },
      { item: "Lime Wedge", amount: 1, unit: "count" },
      { item: "Cherry", amount: 2, unit: "count" },
    ],
    prepTime: 2,
    popularity: 96,
  },
  {
    sku: "DRK-002",
    name: "Ocean Water (Medium)",
    category: "Drinks",
    price: 2.79,
    happyHourPrice: 1.49,
    ingredients: [
      { item: "Sprite", amount: 20, unit: "oz" },
      { item: "Coconut Syrup", amount: 1, unit: "oz" },
      { item: "Blue Coloring", amount: 0.1, unit: "oz" },
    ],
    prepTime: 2,
    popularity: 88,
  },
  {
    sku: "DRK-003",
    name: "Route 44 Slush",
    category: "Drinks",
    price: 3.49,
    ingredients: [
      { item: "Slush Ice", amount: 44, unit: "oz" },
      { item: "Flavor Syrup", amount: 2, unit: "oz" },
    ],
    prepTime: 2,
    popularity: 91,
  },

  // Ice Cream & Desserts
  {
    sku: "ICE-001",
    name: "Oreo Blast",
    category: "Ice Cream",
    price: 4.29,
    ingredients: [
      { item: "Vanilla Ice Cream", amount: 12, unit: "oz" },
      { item: "Oreo Cookies", amount: 3, unit: "count" },
      { item: "Whipped Cream", amount: 1, unit: "oz" },
    ],
    prepTime: 3,
    popularity: 89,
  },
  {
    sku: "ICE-002",
    name: "Classic Vanilla Shake",
    category: "Ice Cream",
    price: 3.99,
    happyHourPrice: 2.99,
    ingredients: [
      { item: "Vanilla Ice Cream", amount: 10, unit: "oz" },
      { item: "Milk", amount: 4, unit: "oz" },
      { item: "Whipped Cream", amount: 1, unit: "oz" },
      { item: "Cherry", amount: 1, unit: "count" },
    ],
    prepTime: 3,
    popularity: 84,
  },

  // Sides
  {
    sku: "SID-001",
    name: "Tots (Medium)",
    category: "Sides",
    price: 2.49,
    happyHourPrice: 1.99,
    ingredients: [
      { item: "Tater Tots", amount: 6, unit: "oz" },
      { item: "Frying Oil", amount: 2, unit: "oz" },
    ],
    prepTime: 4,
    popularity: 93,
  },
  {
    sku: "SID-002",
    name: "Mozzarella Sticks",
    category: "Sides",
    price: 4.49,
    ingredients: [
      { item: "Mozzarella Sticks", amount: 5, unit: "count" },
      { item: "Frying Oil", amount: 2, unit: "oz" },
      { item: "Marinara Sauce", amount: 2, unit: "oz" },
    ],
    prepTime: 5,
    popularity: 71,
  },
];

// ============================================================================
// INVENTORY DATA
// ============================================================================

const inventory: InventoryItem[] = [
  // Proteins
  { sku: "PROT-001", name: "Beef Patty", category: "Proteins", currentStock: 450, unit: "count", reorderPoint: 300, optimalStock: 800, costPerUnit: 0.85, supplier: "Sysco Foods", location: "Main Kitchen" },
  { sku: "PROT-002", name: "Crispy Chicken Patty", category: "Proteins", currentStock: 180, unit: "count", reorderPoint: 120, optimalStock: 400, costPerUnit: 1.20, supplier: "Sysco Foods", location: "Main Kitchen" },
  { sku: "PROT-003", name: "Footlong Hot Dog", category: "Proteins", currentStock: 220, unit: "count", reorderPoint: 150, optimalStock: 500, costPerUnit: 0.65, supplier: "Sysco Foods", location: "Main Kitchen" },
  { sku: "PROT-004", name: "Bacon Strips", category: "Proteins", currentStock: 95, unit: "count", reorderPoint: 80, optimalStock: 300, costPerUnit: 0.15, supplier: "Sysco Foods", location: "Main Kitchen" },

  // Bread
  { sku: "BRD-001", name: "Bun", category: "Bread", currentStock: 520, unit: "count", reorderPoint: 400, optimalStock: 1000, costPerUnit: 0.18, supplier: "Bunny Bread", location: "Dry Storage" },
  { sku: "BRD-002", name: "Hot Dog Bun", category: "Bread", currentStock: 280, unit: "count", reorderPoint: 200, optimalStock: 600, costPerUnit: 0.16, supplier: "Bunny Bread", location: "Dry Storage" },
  { sku: "BRD-003", name: "Texas Toast", category: "Bread", currentStock: 145, unit: "slices", reorderPoint: 100, optimalStock: 400, costPerUnit: 0.12, supplier: "Bunny Bread", location: "Dry Storage" },

  // Dairy & Cheese
  { sku: "DRY-001", name: "Cheese Slice", category: "Dairy", currentStock: 380, unit: "count", reorderPoint: 250, optimalStock: 700, costPerUnit: 0.22, supplier: "US Foods", location: "Walk-in Cooler" },
  { sku: "DRY-002", name: "Vanilla Ice Cream", category: "Dairy", currentStock: 42, unit: "oz", reorderPoint: 20, optimalStock: 100, costPerUnit: 0.08, supplier: "Blue Bunny", location: "Ice Cream Freezer" },
  { sku: "DRY-003", name: "Milk", category: "Dairy", currentStock: 15, unit: "oz", reorderPoint: 10, optimalStock: 50, costPerUnit: 0.05, supplier: "Hiland Dairy", location: "Walk-in Cooler" },
  { sku: "DRY-004", name: "Cheese Sauce", category: "Dairy", currentStock: 8.5, unit: "oz", reorderPoint: 5, optimalStock: 20, costPerUnit: 0.15, supplier: "US Foods", location: "Walk-in Cooler" },
  { sku: "DRY-005", name: "Whipped Cream", category: "Dairy", currentStock: 6, unit: "oz", reorderPoint: 3, optimalStock: 15, costPerUnit: 0.12, supplier: "Prairie Farms", location: "Walk-in Cooler" },

  // Vegetables & Toppings
  { sku: "VEG-001", name: "Lettuce", category: "Vegetables", currentStock: 18, unit: "oz", reorderPoint: 12, optimalStock: 40, costPerUnit: 0.08, supplier: "Fresh Produce Co", location: "Walk-in Cooler" },
  { sku: "VEG-002", name: "Tomato", category: "Vegetables", currentStock: 95, unit: "slice", reorderPoint: 60, optimalStock: 200, costPerUnit: 0.06, supplier: "Fresh Produce Co", location: "Walk-in Cooler" },
  { sku: "VEG-003", name: "Onions", category: "Vegetables", currentStock: 12, unit: "oz", reorderPoint: 8, optimalStock: 25, costPerUnit: 0.05, supplier: "Fresh Produce Co", location: "Walk-in Cooler" },
  { sku: "VEG-004", name: "Lime Wedge", category: "Vegetables", currentStock: 180, unit: "count", reorderPoint: 100, optimalStock: 400, costPerUnit: 0.03, supplier: "Fresh Produce Co", location: "Walk-in Cooler" },

  // Sauces & Condiments
  { sku: "SAU-001", name: "Mayo", category: "Sauces", currentStock: 24, unit: "oz", reorderPoint: 15, optimalStock: 60, costPerUnit: 0.04, supplier: "US Foods", location: "Dry Storage" },
  { sku: "SAU-002", name: "Chili", category: "Sauces", currentStock: 42, unit: "oz", reorderPoint: 30, optimalStock: 100, costPerUnit: 0.18, supplier: "In-House", location: "Hot Hold" },
  { sku: "SAU-003", name: "Marinara Sauce", category: "Sauces", currentStock: 18, unit: "oz", reorderPoint: 12, optimalStock: 40, costPerUnit: 0.06, supplier: "US Foods", location: "Dry Storage" },

  // Beverages
  { sku: "BEV-001", name: "Sprite", category: "Beverages", currentStock: 850, unit: "oz", reorderPoint: 500, optimalStock: 2000, costPerUnit: 0.01, supplier: "Coca-Cola", location: "Beverage Station" },
  { sku: "BEV-002", name: "Cherry Syrup", category: "Beverages", currentStock: 45, unit: "oz", reorderPoint: 30, optimalStock: 100, costPerUnit: 0.08, supplier: "Coca-Cola", location: "Beverage Station" },
  { sku: "BEV-003", name: "Coconut Syrup", category: "Beverages", currentStock: 28, unit: "oz", reorderPoint: 20, optimalStock: 80, costPerUnit: 0.09, supplier: "Torani", location: "Beverage Station" },
  { sku: "BEV-004", name: "Lime Juice", category: "Beverages", currentStock: 32, unit: "oz", reorderPoint: 20, optimalStock: 80, costPerUnit: 0.07, supplier: "RealLime", location: "Beverage Station" },
  { sku: "BEV-005", name: "Flavor Syrup", category: "Beverages", currentStock: 68, unit: "oz", reorderPoint: 40, optimalStock: 150, costPerUnit: 0.06, supplier: "Coca-Cola", location: "Beverage Station" },
  { sku: "BEV-006", name: "Blue Coloring", category: "Beverages", currentStock: 8, unit: "oz", reorderPoint: 4, optimalStock: 20, costPerUnit: 0.15, supplier: "US Foods", location: "Beverage Station" },

  // Frozen Items
  { sku: "FRZ-001", name: "Tater Tots", category: "Frozen", currentStock: 125, unit: "oz", reorderPoint: 80, optimalStock: 300, costPerUnit: 0.05, supplier: "McCain Foods", location: "Walk-in Freezer" },
  { sku: "FRZ-002", name: "Mozzarella Sticks", category: "Frozen", currentStock: 95, unit: "count", reorderPoint: 60, optimalStock: 250, costPerUnit: 0.28, supplier: "McCain Foods", location: "Walk-in Freezer" },
  { sku: "FRZ-003", name: "Slush Ice", category: "Frozen", currentStock: 420, unit: "oz", reorderPoint: 300, optimalStock: 1000, costPerUnit: 0.01, supplier: "Ice-O-Matic", location: "Slush Machine" },
  { sku: "FRZ-004", name: "Oreo Cookies", category: "Frozen", currentStock: 72, unit: "count", reorderPoint: 50, optimalStock: 200, costPerUnit: 0.35, supplier: "Nabisco", location: "Dry Storage" },

  // Misc
  { sku: "MSC-001", name: "Cherry", category: "Misc", currentStock: 240, unit: "count", reorderPoint: 150, optimalStock: 500, costPerUnit: 0.04, supplier: "US Foods", location: "Walk-in Cooler" },
  { sku: "MSC-002", name: "Frying Oil", category: "Misc", currentStock: 65, unit: "oz", reorderPoint: 40, optimalStock: 150, costPerUnit: 0.03, supplier: "Sysco Foods", location: "Dry Storage" },
];

// ============================================================================
// OPERATIONAL DATA
// ============================================================================

const driveInStalls: DriveInStall[] = [
  { stallNumber: 1, status: "Occupied", customer: "Sarah M.", orderNumber: 1042, orderTotal: 18.47, timeOccupied: 8 },
  { stallNumber: 2, status: "Order Ready", customer: "Mike T.", orderNumber: 1041, orderTotal: 12.98, timeOccupied: 12 },
  { stallNumber: 3, status: "Available" },
  { stallNumber: 4, status: "Occupied", customer: "Jessica R.", orderNumber: 1043, orderTotal: 24.76, timeOccupied: 5 },
  { stallNumber: 5, status: "Available" },
  { stallNumber: 6, status: "Order Pending", customer: "David K.", orderNumber: 1044, orderTotal: 9.48, timeOccupied: 3 },
  { stallNumber: 7, status: "Available" },
  { stallNumber: 8, status: "Occupied", customer: "Amanda P.", orderNumber: 1045, orderTotal: 31.25, timeOccupied: 6 },
  { stallNumber: 9, status: "Available" },
  { stallNumber: 10, status: "Out of Service" },
  { stallNumber: 11, status: "Available" },
  { stallNumber: 12, status: "Occupied", customer: "Robert L.", orderNumber: 1046, orderTotal: 15.32, timeOccupied: 4 },
];

const employees: Employee[] = [
  { id: "EMP-001", name: "Maria Garcia", role: "Carhop", shift: "Morning", hoursToday: 6.5, ordersServed: 42, status: "On Duty" },
  { id: "EMP-002", name: "Tyler Johnson", role: "Cook", shift: "Morning", hoursToday: 7.0, ordersServed: 0, status: "On Duty" },
  { id: "EMP-003", name: "Ashley Smith", role: "Carhop", shift: "Morning", hoursToday: 6.5, ordersServed: 38, status: "Break" },
  { id: "EMP-004", name: "Brandon Lee", role: "Fountain", shift: "Afternoon", hoursToday: 4.0, ordersServed: 0, status: "On Duty" },
  { id: "EMP-005", name: "Emma Wilson", role: "Carhop", shift: "Afternoon", hoursToday: 4.0, ordersServed: 28, status: "On Duty" },
  { id: "EMP-006", name: "Carlos Rodriguez", role: "Manager", shift: "All Day", hoursToday: 8.5, ordersServed: 0, status: "On Duty" },
  { id: "EMP-007", name: "Olivia Davis", role: "Cook", shift: "Afternoon", hoursToday: 3.5, ordersServed: 0, status: "On Duty" },
  { id: "EMP-008", name: "Michael Brown", role: "Drive-Thru", shift: "Afternoon", hoursToday: 4.0, ordersServed: 35, status: "On Duty" },
];

// ============================================================================
// MAIN DEMO FUNCTION
// ============================================================================

const runDemo = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. SONIC DRIVE-IN BRANDING
  // ===========================================================================
  BannerRenderer.render({
    title: "SONIC DRIVE-IN",
    subtitle: "America's Drive-In • Oklahoma City Operations Center",
    description: "Multi-Location Operations Management System powered by GenesisTrace",
    version: "v2.4.1",
    author: "Sonic Drive-In Corporate",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightBlue,
  });
  console.log("");

  // ===========================================================================
  // 2. OPERATIONS LOGGER
  // ===========================================================================
  const sonicLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  sonicLogger.info("Sonic Drive-In operations system initialized", {
    location: "NW 23rd St & Penn Ave, OKC",
    operatingHours: "6:00 AM - 12:00 AM",
  });
  sonicLogger.success("Connected to 12 drive-in stalls + drive-thru lane");
  sonicLogger.debug("Integrations: Toast POS, Kitchen Display System, Mobile App");
  console.log("");

  // ===========================================================================
  // 3. LOCATION STATUS
  // ===========================================================================
  console.log(ColorSystem.colorize("  LOCATION STATUS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────", ColorSystem.codes.dim));
  console.log("");

  const now = new Date();
  const currentTemp = 72;
  const isHappyHour = now.getHours() >= 14 && now.getHours() < 16;

  BoxRenderer.render(
    [
      `Date: ${Formatter.timestamp(now, "YYYY-MM-DD")} (${now.toLocaleDateString("en-US", { weekday: "long" })})`,
      `Location: ${ColorSystem.colorize("NW 23rd & Penn - Flagship Location", ColorSystem.codes.brightCyan)}`,
      `Service Status: ${ColorSystem.colorize("Open", ColorSystem.codes.brightGreen)} · 6:00 AM - 12:00 AM`,
      `Weather: ${currentTemp}°F Partly Cloudy · Drive-In Fully Operational`,
      `Happy Hour: ${isHappyHour ? ColorSystem.colorize("ACTIVE - Half Price Drinks & Slushes", ColorSystem.codes.brightMagenta) : "2:00 PM - 4:00 PM Daily"}`,
      `Ice Cream Machines: ${ColorSystem.colorize("All Operational ✓", ColorSystem.codes.brightGreen)}`,
    ],
    {
      title: "Drive-In Status",
      style: "rounded",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. DRIVE-IN STALL STATUS
  // ===========================================================================
  console.log(ColorSystem.colorize("  DRIVE-IN STALL STATUS (REAL-TIME)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  TableRenderer.render(
    driveInStalls.map((stall) => ({
      ...stall,
      statusDisplay: stall.status === "Available"
        ? `${ColorSystem.codes.brightGreen}${stall.status}${ColorSystem.codes.reset}`
        : stall.status === "Occupied"
        ? `${ColorSystem.codes.brightYellow}${stall.status}${ColorSystem.codes.reset}`
        : stall.status === "Order Ready"
        ? `${ColorSystem.codes.brightCyan}${stall.status}${ColorSystem.codes.reset}`
        : stall.status === "Order Pending"
        ? `${ColorSystem.codes.brightMagenta}${stall.status}${ColorSystem.codes.reset}`
        : `${ColorSystem.codes.brightRed}${stall.status}${ColorSystem.codes.reset}`,
      customerDisplay: stall.customer || "—",
      orderDisplay: stall.orderNumber ? `#${stall.orderNumber}` : "—",
      totalDisplay: stall.orderTotal ? Formatter.currency(stall.orderTotal) : "—",
      timeDisplay: stall.timeOccupied ? `${stall.timeOccupied} min` : "—",
    })),
    [
      { key: "stallNumber", label: "Stall", width: 8, align: "center" },
      { key: "statusDisplay", label: "Status", width: 18 },
      { key: "customerDisplay", label: "Customer", width: 16 },
      { key: "orderDisplay", label: "Order #", width: 10, align: "center" },
      { key: "totalDisplay", label: "Total", width: 12, align: "right" },
      { key: "timeDisplay", label: "Time", width: 10, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  const occupiedStalls = driveInStalls.filter((s) => s.status === "Occupied" || s.status === "Order Pending" || s.status === "Order Ready").length;
  const availableStalls = driveInStalls.filter((s) => s.status === "Available").length;
  const outOfServiceStalls = driveInStalls.filter((s) => s.status === "Out of Service").length;

  sonicLogger.info("Drive-in stall utilization", {
    occupied: occupiedStalls,
    available: availableStalls,
    outOfService: outOfServiceStalls,
    utilizationRate: `${((occupiedStalls / (driveInStalls.length - outOfServiceStalls)) * 100).toFixed(1)}%`,
  });
  console.log("");

  // ===========================================================================
  // 5. EMPLOYEE SHIFT STATUS
  // ===========================================================================
  console.log(ColorSystem.colorize("  EMPLOYEE SHIFT STATUS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────", ColorSystem.codes.dim));
  console.log("");

  TableRenderer.render(
    employees,
    [
      { key: "name", label: "Employee", width: 20 },
      { key: "role", label: "Role", width: 12 },
      { key: "shift", label: "Shift", width: 12 },
      { key: "hoursToday", label: "Hours", width: 8, align: "center" },
      { key: "ordersServed", label: "Orders", width: 10, align: "center" },
      {
        key: "status",
        label: "Status",
        width: 12,
        formatter: (v) => v === "On Duty" ? `${ColorSystem.codes.brightGreen}${v}${ColorSystem.codes.reset}` : `${ColorSystem.codes.brightYellow}${v}${ColorSystem.codes.reset}`,
      },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalLaborHours = employees.reduce((sum, emp) => sum + emp.hoursToday, 0);
  const totalOrdersServed = employees.reduce((sum, emp) => sum + emp.ordersServed, 0);

  sonicLogger.info("Employee shift summary", {
    staffCount: employees.length,
    totalLaborHours,
    totalOrdersServed,
  });
  console.log("");

  // ===========================================================================
  // 6. INVENTORY OVERVIEW BY CATEGORY
  // ===========================================================================
  console.log(ColorSystem.colorize("  INVENTORY OVERVIEW BY CATEGORY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const categories = [...new Set(inventory.map((item) => item.category))];
  const categoryStats = categories.map((cat) => {
    const items = inventory.filter((item) => item.category === cat);
    const totalValue = items.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);
    const lowStockCount = items.filter((item) => item.currentStock <= item.reorderPoint).length;
    return {
      category: cat,
      itemCount: items.length,
      totalValue,
      lowStockItems: lowStockCount,
      status: lowStockCount > 0 ? "⚠ Reorder Needed" : "✓ Optimal",
    };
  });

  TableRenderer.render(
    categoryStats,
    [
      { key: "category", label: "Category", width: 18 },
      { key: "itemCount", label: "Items", width: 8, align: "center" },
      { key: "totalValue", label: "Value", width: 12, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "lowStockItems", label: "Low Stock", width: 12, align: "center" },
      { key: "status", label: "Status", width: 20 },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * item.costPerUnit, 0);
  sonicLogger.info("Inventory overview generated", {
    categories: categories.length,
    totalValue: Formatter.currency(totalInventoryValue),
  });

  // ===========================================================================
  // 7. LOW STOCK ALERTS
  // ===========================================================================
  console.log(ColorSystem.colorize("  ⚠️  LOW STOCK ALERTS - ACTION REQUIRED", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const lowStockItems = inventory.filter((item) => item.currentStock <= item.reorderPoint);

  if (lowStockItems.length > 0) {
    TableRenderer.render(
      lowStockItems.map((item) => ({
        ...item,
        stockLevel: `${item.currentStock} ${item.unit}`,
        reorderQty: item.optimalStock - item.currentStock,
        reorderCost: (item.optimalStock - item.currentStock) * item.costPerUnit,
        urgency: item.currentStock < item.reorderPoint * 0.5 ? "🔴 CRITICAL" : "🟡 LOW",
      })),
      [
        { key: "urgency", label: "Priority", width: 12 },
        { key: "name", label: "Item", width: 22 },
        { key: "stockLevel", label: "Current Stock", width: 14, align: "center" },
        { key: "reorderPoint", label: "Reorder At", width: 12, align: "center", formatter: (v) => `${v} units` },
        { key: "reorderQty", label: "Order Qty", width: 10, align: "center" },
        { key: "reorderCost", label: "Est. Cost", width: 12, align: "right", formatter: (v) => Formatter.currency(v) },
        { key: "supplier", label: "Supplier", width: 18 },
      ],
      { showIndex: true },
    );
    console.log("");

    const totalReorderCost = lowStockItems.reduce(
      (sum, item) => sum + (item.optimalStock - item.currentStock) * item.costPerUnit,
      0,
    );

    BoxRenderer.render(
      [
        `Items Requiring Restock: ${ColorSystem.colorize(lowStockItems.length.toString(), ColorSystem.codes.brightRed)}`,
        `Estimated Reorder Cost: ${Formatter.currency(totalReorderCost)}`,
        `Priority Action: Contact suppliers for next-day delivery`,
        `Impact: Some menu items may need to be temporarily unavailable`,
      ],
      {
        title: "⚠️ RESTOCK ALERT",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      },
    );
    console.log("");
  } else {
    BoxRenderer.message("All inventory levels are optimal. No immediate restocking required.", "success");
    console.log("");
  }

  // ===========================================================================
  // 8. MENU ITEM PROFITABILITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  MENU ITEM PROFITABILITY ANALYSIS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const menuWithCosts = menu.map((item) => {
    const ingredientCost = item.ingredients.reduce((sum, ing) => {
      const invItem = inventory.find((i) => i.name === ing.item);
      return sum + (invItem ? invItem.costPerUnit * ing.amount : 0);
    }, 0);
    const profitMargin = ((item.price - ingredientCost) / item.price) * 100;
    return {
      ...item,
      ingredientCost,
      profit: item.price - ingredientCost,
      profitMargin,
    };
  });

  // Show top 10 items
  const topItems = menuWithCosts.slice(0, 10);

  TableRenderer.render(
    topItems,
    [
      { key: "name", label: "Menu Item", width: 28 },
      { key: "price", label: "Price", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "ingredientCost", label: "Food Cost", width: 12, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "profit", label: "Profit", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
      {
        key: "profitMargin",
        label: "Margin %",
        width: 12,
        align: "right",
        formatter: (v) => Formatter.percentage(v / 100, 1),
      },
      { key: "popularity", label: "Popular", width: 10, align: "center", formatter: (v) => `${v}%` },
    ],
    { showIndex: false },
  );
  console.log("");

  const avgMargin = menuWithCosts.reduce((sum, item) => sum + item.profitMargin, 0) / menuWithCosts.length;
  BoxRenderer.render(
    [
      `Average Profit Margin: ${Formatter.percentage(avgMargin / 100, 1)}`,
      `Highest Margin: ${menuWithCosts.sort((a, b) => b.profitMargin - a.profitMargin)[0].name}`,
      `Most Popular: ${menuWithCosts.sort((a, b) => b.popularity - a.popularity)[0].name}`,
      `Target Food Cost: 25-30% (Industry Standard for Fast Food)`,
    ],
    {
      title: "Menu Performance",
      style: "single",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 9. KITCHEN PREP WORKFLOW
  // ===========================================================================
  console.log(ColorSystem.colorize("  KITCHEN PREP WORKFLOW", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────", ColorSystem.codes.dim));
  console.log("");

  const prepTasks = [
    { task: "Prep Burger Patties for Grill", completion: 1.0, detail: "Complete - Ready for rush" },
    { task: "Stock Fountain Drink Station", completion: 1.0, detail: "Complete - All syrups filled" },
    { task: "Prepare Ice Cream Machine", completion: 0.95, detail: "Final calibration in progress" },
    { task: "Prep Fresh Vegetables & Toppings", completion: 1.0, detail: "Complete - Salad bar stocked" },
    { task: "Heat Deep Fryers to Temp", completion: 1.0, detail: "Complete - 350°F optimal" },
    { task: "Stock Drive-Thru Window", completion: 0.88, detail: "Condiments restocking" },
  ];

  for (const task of prepTasks) {
    const bar = new ProgressBar({
      total: 100,
      width: 45,
      colorize: true,
      showValue: true,
    });
    bar.update(Math.round(task.completion * 100));
    bar.complete();
    console.log(`${ColorSystem.colorize(task.task, ColorSystem.codes.brightCyan)} → ${task.detail}`);
    console.log("");
  }

  const overallPrepProgress = prepTasks.reduce((sum, t) => sum + t.completion, 0) / prepTasks.length;
  sonicLogger.success(`Kitchen prep workflow: ${Formatter.percentage(overallPrepProgress, 0)} complete`);

  // ===========================================================================
  // 10. SALES ANALYTICS
  // ===========================================================================
  console.log(ColorSystem.colorize("  SALES ANALYTICS - TODAY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const hourlySales = [
    { label: "6am", value: 12 },
    { label: "7am", value: 24 },
    { label: "8am", value: 18 },
    { label: "9am", value: 15 },
    { label: "10am", value: 22 },
    { label: "11am", value: 35 },
    { label: "12pm", value: 48 },
    { label: "1pm", value: 42 },
    { label: "2pm", value: 38 },
    { label: "3pm", value: 52 }, // Happy Hour spike
  ];

  ChartRenderer.barChart(hourlySales, {
    width: 58,
    showValues: true,
    color: ColorSystem.codes.brightBlue,
    title: "Orders per Hour",
  });
  console.log("");

  const totalOrders = hourlySales.reduce((sum, hour) => sum + hour.value, 0);
  const avgOrderValue = 13.45;
  const totalRevenue = totalOrders * avgOrderValue;

  sonicLogger.info("Sales analytics updated", {
    ordersCompleted: totalOrders,
    revenue: Formatter.currency(totalRevenue),
    avgOrderValue: Formatter.currency(avgOrderValue),
  });

  // ===========================================================================
  // 11. REVENUE DASHBOARD
  // ===========================================================================
  console.log(ColorSystem.colorize("  REVENUE DASHBOARD", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const foodCost = menuWithCosts.reduce((sum, item) => sum + item.ingredientCost, 0) * (totalOrders / menu.length);
  const grossProfit = totalRevenue - foodCost;
  const laborCost = totalRevenue * 0.28; // Estimated 28% labor
  const overheadCost = 420; // Daily operating expenses
  const netProfit = grossProfit - laborCost - overheadCost;

  const revenueBreakdown = [
    { category: "Gross Revenue", amount: totalRevenue, percentage: 1.0 },
    { category: "Food Cost", amount: -foodCost, percentage: foodCost / totalRevenue },
    { category: "Labor Cost", amount: -laborCost, percentage: laborCost / totalRevenue },
    { category: "Overhead (Utilities, Rent, etc)", amount: -overheadCost, percentage: overheadCost / totalRevenue },
    { category: "Net Profit", amount: netProfit, percentage: netProfit / totalRevenue },
  ];

  TableRenderer.render(
    revenueBreakdown,
    [
      { key: "category", label: "Category", width: 34 },
      {
        key: "amount",
        label: "Amount",
        width: 14,
        align: "right",
        formatter: (v) => Formatter.currency(Math.abs(v)),
      },
      {
        key: "percentage",
        label: "% of Revenue",
        width: 14,
        align: "right",
        formatter: (v) => Formatter.percentage(Math.abs(v), 1),
      },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      `Daily Net Profit: ${Formatter.currency(netProfit)}`,
      `Profit Margin: ${Formatter.percentage(netProfit / totalRevenue, 1)}`,
      `Food Cost %: ${Formatter.percentage(foodCost / totalRevenue, 1)} (Target: 28%)`,
      `Projected Monthly: ${Formatter.currency(netProfit * 30)} (30 days)`,
    ],
    {
      title: "💰 Financial Summary",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 12. SYSTEM OPERATIONS
  // ===========================================================================
  console.log(ColorSystem.colorize("  SYSTEM OPERATIONS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const syncSpinner = new Spinner({ message: "Syncing with Toast POS system..." });
  syncSpinner.start();
  await sleep(1000);
  syncSpinner.succeed("POS system synchronized - all orders up to date");

  const alertSpinner = new Spinner({ message: "Checking ice cream machine status..." });
  alertSpinner.start();
  await sleep(800);
  alertSpinner.succeed("All ice cream machines operational - no maintenance needed");

  const reportSpinner = new Spinner({ message: "Generating manager reports..." });
  reportSpinner.start();
  await sleep(900);
  reportSpinner.succeed("Reports ready: Sales, Labor, Inventory, Waste");

  console.log("");

  // ===========================================================================
  // 13. WRAP-UP
  // ===========================================================================
  sonicLogger.success("Sonic Drive-In operations system demo complete", {
    stallUtilization: `${((occupiedStalls / (driveInStalls.length - outOfServiceStalls)) * 100).toFixed(1)}%`,
    ordersToday: totalOrders,
    revenue: Formatter.currency(totalRevenue),
    netProfit: Formatter.currency(netProfit),
    employeesOnDuty: employees.filter((e) => e.status === "On Duty").length,
  });

  console.log(
    ColorSystem.colorize(
      "\n  Demo complete – This is How We Sonic! 🔵🔴\n",
      ColorSystem.codes.brightBlue,
    ),
  );
};

await runDemo();
