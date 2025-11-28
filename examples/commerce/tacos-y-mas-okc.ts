#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Tacos Y Más - Mexican Food Truck Inventory System
 * Oklahoma City - Mobile Operations
 *
 * Comprehensive inventory management demo powered by GenesisTrace.
 *
 * Features demonstrated:
 *   - Multi-category inventory tracking with real-time stock levels
 *   - Low stock alerts and automated reorder triggers
 *   - Menu item costing with ingredient tracking
 *   - Daily prep workflow with progress bars
 *   - Sales analytics and popular item tracking
 *   - Waste tracking and food cost analysis
 *   - Order queue management with live updates
 *   - Revenue dashboard with profit margins
 *   - Supplier management and restock scheduling
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
// INVENTORY DATA STRUCTURES
// ============================================================================

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
  lastRestock: string;
}

interface MenuItem {
  name: string;
  price: number;
  ingredients: { item: string; amount: number; unit: string }[];
  popularity: number;
  prepTime: number;
}

// ============================================================================
// INVENTORY DATABASE
// ============================================================================

const inventory: InventoryItem[] = [
  // Proteins
  { sku: "PROT-001", name: "Carne Asada", category: "Protein", currentStock: 12, unit: "lbs", reorderPoint: 8, optimalStock: 25, costPerUnit: 9.50, supplier: "Homeland Meats", lastRestock: "2025-11-24" },
  { sku: "PROT-002", name: "Pollo Asado", category: "Protein", currentStock: 18, unit: "lbs", reorderPoint: 10, optimalStock: 30, costPerUnit: 5.75, supplier: "Homeland Meats", lastRestock: "2025-11-24" },
  { sku: "PROT-003", name: "Carnitas", category: "Protein", currentStock: 6, unit: "lbs", reorderPoint: 8, optimalStock: 20, costPerUnit: 7.25, supplier: "Homeland Meats", lastRestock: "2025-11-23" },
  { sku: "PROT-004", name: "Al Pastor", category: "Protein", currentStock: 4, unit: "lbs", reorderPoint: 6, optimalStock: 18, costPerUnit: 8.50, supplier: "Homeland Meats", lastRestock: "2025-11-23" },
  { sku: "PROT-005", name: "Chorizo", category: "Protein", currentStock: 15, unit: "lbs", reorderPoint: 8, optimalStock: 20, costPerUnit: 6.80, supplier: "El Paraiso Market", lastRestock: "2025-11-24" },

  // Vegetables & Toppings
  { sku: "VEG-001", name: "Cilantro", category: "Vegetables", currentStock: 4, unit: "bunches", reorderPoint: 3, optimalStock: 10, costPerUnit: 1.50, supplier: "Produce Depot", lastRestock: "2025-11-25" },
  { sku: "VEG-002", name: "White Onion", category: "Vegetables", currentStock: 8, unit: "lbs", reorderPoint: 5, optimalStock: 15, costPerUnit: 1.20, supplier: "Produce Depot", lastRestock: "2025-11-25" },
  { sku: "VEG-003", name: "Tomatoes", category: "Vegetables", currentStock: 12, unit: "lbs", reorderPoint: 8, optimalStock: 20, costPerUnit: 2.30, supplier: "Produce Depot", lastRestock: "2025-11-25" },
  { sku: "VEG-004", name: "Lettuce", category: "Vegetables", currentStock: 6, unit: "heads", reorderPoint: 4, optimalStock: 12, costPerUnit: 1.80, supplier: "Produce Depot", lastRestock: "2025-11-25" },
  { sku: "VEG-005", name: "Lime", category: "Vegetables", currentStock: 20, unit: "count", reorderPoint: 15, optimalStock: 50, costPerUnit: 0.25, supplier: "Produce Depot", lastRestock: "2025-11-25" },
  { sku: "VEG-006", name: "Jalapeños", category: "Vegetables", currentStock: 3, unit: "lbs", reorderPoint: 2, optimalStock: 8, costPerUnit: 2.50, supplier: "Produce Depot", lastRestock: "2025-11-24" },
  { sku: "VEG-007", name: "Avocado", category: "Vegetables", currentStock: 24, unit: "count", reorderPoint: 20, optimalStock: 60, costPerUnit: 1.20, supplier: "Produce Depot", lastRestock: "2025-11-25" },

  // Tortillas & Bread
  { sku: "TORT-001", name: "Corn Tortillas", category: "Tortillas", currentStock: 150, unit: "count", reorderPoint: 100, optimalStock: 400, costPerUnit: 0.12, supplier: "La Oaxaqueña", lastRestock: "2025-11-25" },
  { sku: "TORT-002", name: "Flour Tortillas (8in)", category: "Tortillas", currentStock: 85, unit: "count", reorderPoint: 60, optimalStock: 200, costPerUnit: 0.18, supplier: "La Oaxaqueña", lastRestock: "2025-11-25" },
  { sku: "TORT-003", name: "Burrito Tortillas (12in)", category: "Tortillas", currentStock: 42, unit: "count", reorderPoint: 40, optimalStock: 120, costPerUnit: 0.35, supplier: "La Oaxaqueña", lastRestock: "2025-11-24" },
  { sku: "BREAD-001", name: "Telera Rolls", category: "Tortillas", currentStock: 18, unit: "count", reorderPoint: 15, optimalStock: 50, costPerUnit: 0.45, supplier: "Panadería Mexico", lastRestock: "2025-11-25" },

  // Sauces & Condiments
  { sku: "SAL-001", name: "Salsa Roja", category: "Sauces", currentStock: 3.5, unit: "qts", reorderPoint: 2, optimalStock: 8, costPerUnit: 4.50, supplier: "In-House", lastRestock: "2025-11-25" },
  { sku: "SAL-002", name: "Salsa Verde", category: "Sauces", currentStock: 2.8, unit: "qts", reorderPoint: 2, optimalStock: 8, costPerUnit: 4.80, supplier: "In-House", lastRestock: "2025-11-25" },
  { sku: "SAL-003", name: "Pico de Gallo", category: "Sauces", currentStock: 2.2, unit: "qts", reorderPoint: 2, optimalStock: 6, costPerUnit: 5.20, supplier: "In-House", lastRestock: "2025-11-25" },
  { sku: "SAL-004", name: "Guacamole", category: "Sauces", currentStock: 1.5, unit: "qts", reorderPoint: 1, optimalStock: 4, costPerUnit: 8.50, supplier: "In-House", lastRestock: "2025-11-25" },
  { sku: "CON-001", name: "Crema Mexicana", category: "Sauces", currentStock: 2, unit: "qts", reorderPoint: 1.5, optimalStock: 6, costPerUnit: 6.25, supplier: "El Paraiso Market", lastRestock: "2025-11-24" },
  { sku: "CON-002", name: "Queso Fresco", category: "Sauces", currentStock: 4, unit: "lbs", reorderPoint: 3, optimalStock: 10, costPerUnit: 5.50, supplier: "El Paraiso Market", lastRestock: "2025-11-24" },

  // Beverages
  { sku: "BEV-001", name: "Jarritos (Assorted)", category: "Beverages", currentStock: 36, unit: "bottles", reorderPoint: 24, optimalStock: 72, costPerUnit: 1.25, supplier: "Restaurant Depot", lastRestock: "2025-11-24" },
  { sku: "BEV-002", name: "Mexican Coke", category: "Beverages", currentStock: 28, unit: "bottles", reorderPoint: 24, optimalStock: 60, costPerUnit: 1.50, supplier: "Restaurant Depot", lastRestock: "2025-11-24" },
  { sku: "BEV-003", name: "Horchata Mix", category: "Beverages", currentStock: 5, unit: "lbs", reorderPoint: 3, optimalStock: 12, costPerUnit: 8.75, supplier: "El Paraiso Market", lastRestock: "2025-11-23" },
  { sku: "BEV-004", name: "Jamaica (Hibiscus)", category: "Beverages", currentStock: 2.5, unit: "lbs", reorderPoint: 2, optimalStock: 8, costPerUnit: 12.50, supplier: "El Paraiso Market", lastRestock: "2025-11-23" },

  // Dry Goods & Spices
  { sku: "DRY-001", name: "Black Beans", category: "Dry Goods", currentStock: 8, unit: "lbs", reorderPoint: 5, optimalStock: 20, costPerUnit: 1.80, supplier: "Restaurant Depot", lastRestock: "2025-11-22" },
  { sku: "DRY-002", name: "Pinto Beans", category: "Dry Goods", currentStock: 12, unit: "lbs", reorderPoint: 8, optimalStock: 25, costPerUnit: 1.50, supplier: "Restaurant Depot", lastRestock: "2025-11-22" },
  { sku: "DRY-003", name: "Rice", category: "Dry Goods", currentStock: 15, unit: "lbs", reorderPoint: 10, optimalStock: 30, costPerUnit: 1.20, supplier: "Restaurant Depot", lastRestock: "2025-11-22" },
  { sku: "SPC-001", name: "Cumin", category: "Spices", currentStock: 1.2, unit: "lbs", reorderPoint: 0.5, optimalStock: 3, costPerUnit: 12.00, supplier: "El Paraiso Market", lastRestock: "2025-11-20" },
  { sku: "SPC-002", name: "Chili Powder", category: "Spices", currentStock: 2, unit: "lbs", reorderPoint: 1, optimalStock: 5, costPerUnit: 8.50, supplier: "El Paraiso Market", lastRestock: "2025-11-20" },
];

const menu: MenuItem[] = [
  {
    name: "Street Tacos (3)",
    price: 9.00,
    ingredients: [
      { item: "Corn Tortillas", amount: 3, unit: "count" },
      { item: "Carne Asada", amount: 0.3, unit: "lbs" },
      { item: "Cilantro", amount: 0.1, unit: "bunches" },
      { item: "White Onion", amount: 0.1, unit: "lbs" },
      { item: "Lime", amount: 1, unit: "count" },
    ],
    popularity: 95,
    prepTime: 4,
  },
  {
    name: "Burrito Supreme",
    price: 12.00,
    ingredients: [
      { item: "Burrito Tortillas (12in)", amount: 1, unit: "count" },
      { item: "Carnitas", amount: 0.4, unit: "lbs" },
      { item: "Rice", amount: 0.3, unit: "lbs" },
      { item: "Black Beans", amount: 0.2, unit: "lbs" },
      { item: "Guacamole", amount: 0.1, unit: "qts" },
      { item: "Crema Mexicana", amount: 0.05, unit: "qts" },
    ],
    popularity: 88,
    prepTime: 6,
  },
  {
    name: "Torta Mexicana",
    price: 10.50,
    ingredients: [
      { item: "Telera Rolls", amount: 1, unit: "count" },
      { item: "Al Pastor", amount: 0.35, unit: "lbs" },
      { item: "Avocado", amount: 1, unit: "count" },
      { item: "Lettuce", amount: 0.1, unit: "heads" },
      { item: "Tomatoes", amount: 0.1, unit: "lbs" },
    ],
    popularity: 72,
    prepTime: 5,
  },
  {
    name: "Quesadilla Deluxe",
    price: 11.00,
    ingredients: [
      { item: "Flour Tortillas (8in)", amount: 2, unit: "count" },
      { item: "Pollo Asado", amount: 0.3, unit: "lbs" },
      { item: "Queso Fresco", amount: 0.2, unit: "lbs" },
      { item: "Pico de Gallo", amount: 0.1, unit: "qts" },
    ],
    popularity: 81,
    prepTime: 5,
  },
  {
    name: "Bowl Mexicano",
    price: 11.50,
    ingredients: [
      { item: "Rice", amount: 0.4, unit: "lbs" },
      { item: "Pinto Beans", amount: 0.3, unit: "lbs" },
      { item: "Chorizo", amount: 0.3, unit: "lbs" },
      { item: "Lettuce", amount: 0.1, unit: "heads" },
      { item: "Guacamole", amount: 0.1, unit: "qts" },
    ],
    popularity: 67,
    prepTime: 5,
  },
];

const runDemo = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. FOOD TRUCK BRANDING
  // ===========================================================================
  BannerRenderer.render({
    title: "TACOS Y MÁS",
    subtitle: "Authentic Mexican Street Food • Oklahoma City Mobile Kitchen",
    description: "Inventory Management System powered by GenesisTrace",
    version: "v1.5.2",
    author: "OKC Food Truck Operations",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightYellow,
  });
  console.log("");

  // ===========================================================================
  // 2. OPERATIONS LOGGER
  // ===========================================================================
  const truckLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  truckLogger.info("Mobile kitchen systems initialized", {
    location: "Bricktown Canal @ Mickey Mantle Dr",
    serviceHours: "11:00 AM - 9:00 PM",
  });
  truckLogger.success("Inventory database synchronized with 30 active SKUs");
  truckLogger.debug("Integrations: Square POS, FreshKDS, TruckTrack GPS");
  console.log("");

  // ===========================================================================
  // 3. DAILY OPERATIONS SNAPSHOT
  // ===========================================================================
  console.log(ColorSystem.colorize("  DAILY OPERATIONS SNAPSHOT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const now = new Date();
  const currentTemp = 78;
  const lunchRushProgress = 0.68;

  BoxRenderer.render(
    [
      `Date: ${Formatter.timestamp(now, "YYYY-MM-DD")} (${now.toLocaleDateString("en-US", { weekday: "long" })})`,
      `Location: ${ColorSystem.colorize("Bricktown Canal - High Traffic Zone", ColorSystem.codes.brightCyan)}`,
      `Service Status: ${ColorSystem.colorize("Open", ColorSystem.codes.brightGreen)} · 11:00 AM - 9:00 PM`,
      `Weather: ${currentTemp}°F Sunny · Outdoor Seating Available`,
      `Lunch Rush: ${Formatter.percentage(lunchRushProgress, 0)} complete · Dinner prep underway`,
      `Special Today: ${ColorSystem.colorize("Taco Tuesday - $2.50 per taco", ColorSystem.codes.brightMagenta)}`,
    ],
    {
      title: "Truck Status",
      style: "rounded",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. INVENTORY OVERVIEW BY CATEGORY
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
  truckLogger.info("Inventory overview generated", {
    categories: categories.length,
    totalValue: Formatter.currency(totalInventoryValue),
  });

  // ===========================================================================
  // 5. LOW STOCK ALERTS - CRITICAL
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
        { key: "name", label: "Item", width: 20 },
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
        `Priority Action: Contact suppliers for same-day delivery`,
        `Impact: Menu items may be limited if not restocked by dinner rush`,
      ],
      {
        title: "⚠️ RESTOCK ALERT",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      },
    );
    console.log("");
  }

  // ===========================================================================
  // 6. FULL INVENTORY DETAIL
  // ===========================================================================
  console.log(ColorSystem.colorize("  DETAILED INVENTORY TRACKING", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────", ColorSystem.codes.dim));
  console.log("");

  // Group by category for display
  for (const category of categories) {
    console.log(ColorSystem.colorize(`  ${category}`, ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(`  ${"─".repeat(category.length)}`, ColorSystem.codes.dim));
    console.log("");

    const categoryItems = inventory.filter((item) => item.category === category);
    TableRenderer.render(
      categoryItems.map((item) => ({
        ...item,
        stockDisplay: `${item.currentStock} ${item.unit}`,
        stockHealth: item.currentStock / item.optimalStock,
        itemValue: item.currentStock * item.costPerUnit,
      })),
      [
        { key: "sku", label: "SKU", width: 12 },
        { key: "name", label: "Item", width: 22 },
        {
          key: "stockDisplay",
          label: "Stock",
          width: 14,
          align: "right",
        },
        {
          key: "stockHealth",
          label: "Health",
          width: 12,
          align: "center",
          formatter: (v) => {
            if (v >= 0.7) return `${ColorSystem.codes.brightGreen}Optimal${ColorSystem.codes.reset}`;
            if (v >= 0.4) return `${ColorSystem.codes.brightYellow}Moderate${ColorSystem.codes.reset}`;
            return `${ColorSystem.codes.brightRed}Low${ColorSystem.codes.reset}`;
          },
        },
        { key: "itemValue", label: "Value", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
        { key: "supplier", label: "Supplier", width: 18 },
        { key: "lastRestock", label: "Last Restock", width: 12 },
      ],
      { showIndex: false },
    );
    console.log("");
  }

  // ===========================================================================
  // 7. MENU ITEM COSTING & PROFITABILITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  MENU ITEM COSTING & PROFITABILITY", ColorSystem.codes.bright));
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

  TableRenderer.render(
    menuWithCosts,
    [
      { key: "name", label: "Menu Item", width: 24 },
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
      `Target Food Cost: 28-32% (Industry Standard)`,
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
  // 8. DAILY PREP WORKFLOW
  // ===========================================================================
  console.log(ColorSystem.colorize("  DAILY PREP WORKFLOW", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────", ColorSystem.codes.dim));
  console.log("");

  const prepTasks = [
    { task: "Marinate Carne Asada & Al Pastor", completion: 1.0, detail: "Complete - Ready for service" },
    { task: "Cook & Shred Carnitas", completion: 1.0, detail: "Complete - Holding at temp" },
    { task: "Prep Fresh Salsas (Roja, Verde, Pico)", completion: 0.85, detail: "Final seasoning in progress" },
    { task: "Make Guacamole Fresh", completion: 0.65, detail: "Awaiting final batch" },
    { task: "Cook Beans & Rice", completion: 1.0, detail: "Complete - Warmer ready" },
    { task: "Chop Vegetables & Toppings", completion: 0.92, detail: "Cilantro & onions prepped" },
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
  truckLogger.success(`Daily prep workflow: ${Formatter.percentage(overallPrepProgress, 0)} complete`);

  // ===========================================================================
  // 9. LIVE ORDER QUEUE
  // ===========================================================================
  console.log(ColorSystem.colorize("  LIVE ORDER QUEUE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────", ColorSystem.codes.dim));
  console.log("");

  const orderQueue = [
    { orderNum: 47, customer: "Sarah M.", items: "3x Street Tacos (Asada)", total: 9.00, status: "Preparing", time: "2 min" },
    { orderNum: 48, customer: "Miguel R.", items: "1x Burrito Supreme, 1x Jarritos", total: 13.25, status: "Preparing", time: "4 min" },
    { orderNum: 49, customer: "Ashley P.", items: "2x Torta Mexicana", total: 21.00, status: "Pending", time: "-- " },
    { orderNum: 50, customer: "David K.", items: "1x Quesadilla Deluxe, 1x Bowl", total: 22.50, status: "Pending", time: "-- " },
  ];

  TableRenderer.render(
    orderQueue,
    [
      { key: "orderNum", label: "#", width: 6, align: "center" },
      { key: "customer", label: "Customer", width: 14 },
      { key: "items", label: "Order Items", width: 36 },
      { key: "total", label: "Total", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "status", label: "Status", width: 12 },
      { key: "time", label: "Est. Time", width: 10, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 10. SALES ANALYTICS
  // ===========================================================================
  console.log(ColorSystem.colorize("  SALES ANALYTICS - TODAY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const hourlySales = [
    { label: "11am", value: 8 },
    { label: "12pm", value: 18 },
    { label: "1pm", value: 24 },
    { label: "2pm", value: 15 },
    { label: "3pm", value: 6 },
    { label: "4pm", value: 4 },
    { label: "5pm", value: 12 },
    { label: "6pm", value: 19 },
  ];

  ChartRenderer.barChart(hourlySales, {
    width: 58,
    showValues: true,
    color: ColorSystem.codes.brightYellow,
    title: "Orders per Hour",
  });
  console.log("");

  const totalOrders = hourlySales.reduce((sum, hour) => sum + hour.value, 0);
  const avgOrderValue = 11.75;
  const totalRevenue = totalOrders * avgOrderValue;

  truckLogger.info("Sales analytics updated", {
    ordersCompleted: totalOrders,
    revenue: Formatter.currency(totalRevenue),
  });

  // ===========================================================================
  // 11. POPULAR ITEMS TRACKING
  // ===========================================================================
  console.log(ColorSystem.colorize("  POPULAR ITEMS - TODAY'S LEADERS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const itemsSold = [
    { item: "Street Tacos (3)", sold: 42, revenue: 378.00, percentOfTotal: 39.6 },
    { item: "Burrito Supreme", sold: 28, revenue: 336.00, percentOfTotal: 26.4 },
    { item: "Quesadilla Deluxe", sold: 18, revenue: 198.00, percentOfTotal: 17.0 },
    { item: "Torta Mexicana", sold: 10, revenue: 105.00, percentOfTotal: 9.4 },
    { item: "Bowl Mexicano", sold: 8, revenue: 92.00, percentOfTotal: 7.6 },
  ];

  TableRenderer.render(
    itemsSold,
    [
      { key: "item", label: "Menu Item", width: 24 },
      { key: "sold", label: "Qty Sold", width: 10, align: "center" },
      { key: "revenue", label: "Revenue", width: 12, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "percentOfTotal", label: "% of Sales", width: 12, align: "right", formatter: (v) => `${v.toFixed(1)}%` },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 12. SUPPLIER SCHEDULE
  // ===========================================================================
  console.log(ColorSystem.colorize("  SUPPLIER RESTOCK SCHEDULE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const suppliers = [
    { supplier: "Homeland Meats", deliveryDay: "Mon, Thu", nextDelivery: "Thursday 11/28", orderValue: 285.50, status: "Scheduled" },
    { supplier: "Produce Depot", deliveryDay: "Daily", nextDelivery: "Wednesday 11/27", orderValue: 142.75, status: "Confirmed" },
    { supplier: "La Oaxaqueña Tortilleria", deliveryDay: "Tue, Fri", nextDelivery: "Friday 11/29", orderValue: 98.00, status: "Pending Order" },
    { supplier: "El Paraiso Market", deliveryDay: "Wed, Sat", nextDelivery: "Wednesday 11/27", orderValue: 124.30, status: "Confirmed" },
    { supplier: "Restaurant Depot", deliveryDay: "As Needed", nextDelivery: "Self-Pickup Today", orderValue: 76.50, status: "Ready" },
  ];

  TableRenderer.render(
    suppliers,
    [
      { key: "supplier", label: "Supplier", width: 26 },
      { key: "deliveryDay", label: "Schedule", width: 14 },
      { key: "nextDelivery", label: "Next Delivery", width: 18 },
      { key: "orderValue", label: "Order Value", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "status", label: "Status", width: 16 },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 13. WASTE TRACKING
  // ===========================================================================
  console.log(ColorSystem.colorize("  WASTE TRACKING & FOOD COST CONTROL", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const wasteLog = [
    { date: "2025-11-25", item: "Cilantro", amount: "0.5 bunches", reason: "Wilted - storage issue", cost: 0.75 },
    { date: "2025-11-24", item: "Avocado", amount: "3 count", reason: "Over-ripened", cost: 3.60 },
    { date: "2025-11-24", item: "Guacamole", amount: "0.3 qts", reason: "End of day disposal", cost: 2.55 },
    { date: "2025-11-23", item: "Salsa Verde", amount: "0.2 qts", reason: "Contaminated batch", cost: 0.96 },
  ];

  TableRenderer.render(
    wasteLog,
    [
      { key: "date", label: "Date", width: 12 },
      { key: "item", label: "Item", width: 20 },
      { key: "amount", label: "Amount", width: 16 },
      { key: "reason", label: "Reason", width: 28 },
      { key: "cost", label: "Cost", width: 10, align: "right", formatter: (v) => Formatter.currency(v) },
    ],
    { showIndex: false },
  );
  console.log("");

  const totalWaste = wasteLog.reduce((sum, item) => sum + item.cost, 0);
  const wastePercentage = (totalWaste / totalRevenue) * 100;

  BoxRenderer.render(
    [
      `Total Waste This Week: ${Formatter.currency(totalWaste)}`,
      `Waste as % of Revenue: ${wastePercentage.toFixed(2)}%`,
      `Target: < 2% (Current: ${wastePercentage > 2 ? "⚠️ Above Target" : "✓ Within Target"})`,
      `Primary Issue: Storage & freshness management`,
    ],
    {
      title: "Waste Control Metrics",
      style: "single",
      color: wastePercentage > 2 ? ColorSystem.codes.brightRed : ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 14. REVENUE DASHBOARD
  // ===========================================================================
  console.log(ColorSystem.colorize("  REVENUE DASHBOARD", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const foodCost = menuWithCosts.reduce((sum, item) => sum + item.ingredientCost, 0) * (totalOrders / menu.length);
  const grossProfit = totalRevenue - foodCost;
  const laborCost = totalRevenue * 0.25; // Estimated 25% labor
  const overheadCost = 180; // Daily truck expenses
  const netProfit = grossProfit - laborCost - overheadCost;

  const revenueBreakdown = [
    { category: "Gross Revenue", amount: totalRevenue, percentage: 1.0 },
    { category: "Food Cost", amount: -foodCost, percentage: foodCost / totalRevenue },
    { category: "Labor Cost", amount: -laborCost, percentage: laborCost / totalRevenue },
    { category: "Overhead (Truck, Gas, Permits)", amount: -overheadCost, percentage: overheadCost / totalRevenue },
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
      `Food Cost %: ${Formatter.percentage(foodCost / totalRevenue, 1)} (Target: 30%)`,
      `Projected Monthly: ${Formatter.currency(netProfit * 26)} (26 service days)`,
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
  // 15. INVENTORY SYNC SIMULATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  SYSTEM OPERATIONS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const syncSpinner = new Spinner({ message: "Syncing inventory with POS system..." });
  syncSpinner.start();
  await sleep(1200);
  syncSpinner.succeed("Inventory synchronized with Square POS");

  const alertSpinner = new Spinner({ message: "Sending restock alerts to suppliers..." });
  alertSpinner.start();
  await sleep(900);
  alertSpinner.succeed(`Restock orders sent to ${lowStockItems.length > 0 ? "4 suppliers" : "suppliers (no immediate needs)"}`);

  const reportSpinner = new Spinner({ message: "Generating end-of-shift reports..." });
  reportSpinner.start();
  await sleep(800);
  reportSpinner.succeed("Reports ready: Sales, Inventory, Waste, Profitability");

  console.log("");

  // ===========================================================================
  // 16. WRAP-UP
  // ===========================================================================
  truckLogger.success("Inventory management system demo complete", {
    inventoryItems: inventory.length,
    lowStockAlerts: lowStockItems.length,
    todayRevenue: Formatter.currency(totalRevenue),
    netProfit: Formatter.currency(netProfit),
  });

  console.log(
    ColorSystem.colorize(
      "\n  Demo complete – ¡Buen provecho! Follow us at Bricktown Canal 🌮\n",
      ColorSystem.codes.brightYellow,
    ),
  );
};

await runDemo();
