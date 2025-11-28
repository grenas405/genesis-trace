#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Alex Pallets LLC - Oklahoma City Operations Dashboard
 *
 * A comprehensive demonstration of GenesisTrace capabilities for a local
 * pallet manufacturing and distribution business in Oklahoma City, OK.
 *
 * This animation lab showcases:
 *   • Real-time pallet inventory tracking (new, refurbished, custom)
 *   • Order management and fulfillment workflows
 *   • Warehouse bay operations and efficiency monitoring
 *   • Quality inspection and grading systems
 *   • Delivery scheduling and route optimization
 *   • Production metrics and business analytics
 *   • Revenue tracking and profit margins
 *   • Material utilization and waste reduction
 *   • Interactive operations dashboard
 *   • Customer relationship management
 *
 * Features demonstrated:
 *   • Logger with themed configuration
 *   • Interactive prompts for order creation
 *   • Tables for inventory and order tracking
 *   • Charts for analytics and performance metrics
 *   • Progress bars for production processes
 *   • Spinners for loading states
 *   • Banners and boxes for branding
 *   • Color-coded status indicators
 *
 * Business Context:
 *   Alex Pallets LLC serves Oklahoma City's industrial sector with
 *   high-quality wooden pallets for warehousing, shipping, and logistics.
 *   Focus on efficiency, sustainability, and local customer service.
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  InteractivePrompts,
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

interface PalletProduct {
  id: number;
  type: string;
  size: string;
  condition: "New" | "Refurbished" | "Custom";
  woodType: string;
  grade: "A" | "B" | "C";
  quantity: number;
  unitPrice: number;
  weightCapacity: number;
}

interface CustomerOrder {
  orderId: number;
  customer: string;
  company: string;
  palletType: string;
  quantity: number;
  deliveryAddress: string;
  status: "Pending" | "Production" | "Quality Check" | "Ready" | "Delivered";
  orderDate: Date;
  deliveryDate?: Date;
  totalPrice: number;
  priority: "Standard" | "Rush" | "Same-Day";
}

interface WarehouseBay {
  bay: number;
  supervisor: string;
  currentTask: string | null;
  status: "Active" | "Idle" | "Maintenance";
  palletsProcessed: number;
  efficiency: number;
}

interface QualityCheck {
  checkId: number;
  palletType: string;
  inspector: string;
  passed: number;
  failed: number;
  timestamp: Date;
  issues: string[];
}

interface DeliveryRoute {
  routeId: number;
  driver: string;
  vehicle: string;
  orders: number[];
  area: string;
  status: "Scheduled" | "In Transit" | "Completed";
  estimatedTime: number;
}

// ============================================================================
// DATABASE
// ============================================================================

class AlexPalletsDatabase {
  private inventory: PalletProduct[] = [
    { id: 1, type: "Standard GMA", size: "48x40", condition: "New", woodType: "Oak", grade: "A", quantity: 450, unitPrice: 12.50, weightCapacity: 2500 },
    { id: 2, type: "Standard GMA", size: "48x40", condition: "Refurbished", woodType: "Pine", grade: "B", quantity: 320, unitPrice: 8.00, weightCapacity: 2500 },
    { id: 3, type: "Heavy Duty", size: "48x48", condition: "New", woodType: "Oak", grade: "A", quantity: 180, unitPrice: 18.75, weightCapacity: 4000 },
    { id: 4, type: "Euro Pallet", size: "47x39", condition: "New", woodType: "Birch", grade: "A", quantity: 125, unitPrice: 15.00, weightCapacity: 3000 },
    { id: 5, type: "Block Pallet", size: "48x40", condition: "New", woodType: "Oak", grade: "A", quantity: 95, unitPrice: 22.00, weightCapacity: 5000 },
    { id: 6, type: "Custom Size", size: "36x36", condition: "Custom", woodType: "Mixed", grade: "B", quantity: 65, unitPrice: 14.50, weightCapacity: 2000 },
    { id: 7, type: "Half Pallet", size: "24x40", condition: "New", woodType: "Pine", grade: "B", quantity: 210, unitPrice: 7.50, weightCapacity: 1500 },
    { id: 8, type: "Plastic Hybrid", size: "48x40", condition: "New", woodType: "Composite", grade: "A", quantity: 88, unitPrice: 28.00, weightCapacity: 3500 },
  ];

  private orders: CustomerOrder[] = [
    {
      orderId: 1001,
      customer: "Maria Garcia",
      company: "OKC Logistics Hub",
      palletType: "Standard GMA 48x40",
      quantity: 200,
      deliveryAddress: "1245 S Meridian Ave, Oklahoma City, OK 73108",
      status: "Delivered",
      orderDate: new Date("2024-01-15"),
      deliveryDate: new Date("2024-01-17"),
      totalPrice: 2500.00,
      priority: "Standard"
    },
    {
      orderId: 1002,
      customer: "James Wilson",
      company: "Thunder Warehouse Solutions",
      palletType: "Heavy Duty 48x48",
      quantity: 150,
      deliveryAddress: "3401 S Western Ave, Oklahoma City, OK 73109",
      status: "Ready",
      orderDate: new Date("2024-01-18"),
      totalPrice: 2812.50,
      priority: "Rush"
    },
    {
      orderId: 1003,
      customer: "Sarah Chen",
      company: "Bricktown Distribution Co",
      palletType: "Block Pallet 48x40",
      quantity: 80,
      deliveryAddress: "101 E California Ave, Oklahoma City, OK 73104",
      status: "Quality Check",
      orderDate: new Date("2024-01-19"),
      totalPrice: 1760.00,
      priority: "Standard"
    },
    {
      orderId: 1004,
      customer: "Robert Martinez",
      company: "Capitol Hill Storage",
      palletType: "Standard GMA 48x40 (Refurb)",
      quantity: 300,
      deliveryAddress: "2901 S Robinson Ave, Oklahoma City, OK 73109",
      status: "Production",
      orderDate: new Date("2024-01-20"),
      totalPrice: 2400.00,
      priority: "Standard"
    },
  ];

  private warehouseBays: WarehouseBay[] = [
    { bay: 1, supervisor: "Tommy Anderson", currentTask: "Quality Inspection", status: "Active", palletsProcessed: 1250, efficiency: 94.5 },
    { bay: 2, supervisor: "Lisa Rodriguez", currentTask: "Refurbishing Process", status: "Active", palletsProcessed: 980, efficiency: 91.2 },
    { bay: 3, supervisor: "Michael Johnson", currentTask: null, status: "Idle", palletsProcessed: 1100, efficiency: 88.7 },
    { bay: 4, supervisor: "Jennifer Davis", currentTask: "Custom Build", status: "Active", palletsProcessed: 765, efficiency: 96.3 },
    { bay: 5, supervisor: "David Kim", currentTask: null, status: "Maintenance", palletsProcessed: 1340, efficiency: 92.8 },
  ];

  private qualityChecks: QualityCheck[] = [
    {
      checkId: 501,
      palletType: "Standard GMA 48x40",
      inspector: "Tommy Anderson",
      passed: 147,
      failed: 3,
      timestamp: new Date("2024-01-20T08:30:00"),
      issues: ["Minor wood splitting", "Uneven boards"]
    },
    {
      checkId: 502,
      palletType: "Heavy Duty 48x48",
      inspector: "Lisa Rodriguez",
      passed: 92,
      failed: 8,
      timestamp: new Date("2024-01-20T10:15:00"),
      issues: ["Weak corner joints", "Moisture content high"]
    },
    {
      checkId: 503,
      palletType: "Block Pallet 48x40",
      inspector: "Jennifer Davis",
      passed: 78,
      failed: 2,
      timestamp: new Date("2024-01-20T14:45:00"),
      issues: ["Paint defect"]
    },
  ];

  private deliveryRoutes: DeliveryRoute[] = [
    {
      routeId: 101,
      driver: "Carlos Hernandez",
      vehicle: "Truck-A12",
      orders: [1001],
      area: "South OKC",
      status: "Completed",
      estimatedTime: 45
    },
    {
      routeId: 102,
      driver: "Amanda Foster",
      vehicle: "Truck-B07",
      orders: [1002],
      area: "West OKC",
      status: "Scheduled",
      estimatedTime: 60
    },
    {
      routeId: 103,
      driver: "Miguel Santos",
      vehicle: "Truck-C15",
      orders: [1003],
      area: "Downtown/Bricktown",
      status: "Scheduled",
      estimatedTime: 30
    },
  ];

  private nextOrderId = 1005;
  private nextCheckId = 504;
  private nextRouteId = 104;

  // Getters
  getInventory(): PalletProduct[] { return [...this.inventory]; }
  getOrders(): CustomerOrder[] { return [...this.orders]; }
  getWarehouseBays(): WarehouseBay[] { return [...this.warehouseBays]; }
  getQualityChecks(): QualityCheck[] { return [...this.qualityChecks]; }
  getDeliveryRoutes(): DeliveryRoute[] { return [...this.deliveryRoutes]; }

  // Add new order
  addOrder(order: Omit<CustomerOrder, "orderId">): CustomerOrder {
    const newOrder: CustomerOrder = { ...order, orderId: this.nextOrderId++ };
    this.orders.push(newOrder);
    return newOrder;
  }

  // Update order status
  updateOrderStatus(orderId: number, status: CustomerOrder["status"]): void {
    const order = this.orders.find(o => o.orderId === orderId);
    if (order) {
      order.status = status;
      if (status === "Delivered") {
        order.deliveryDate = new Date();
      }
    }
  }

  // Reduce inventory
  reduceInventory(palletId: number, quantity: number): boolean {
    const pallet = this.inventory.find(p => p.id === palletId);
    if (pallet && pallet.quantity >= quantity) {
      pallet.quantity -= quantity;
      return true;
    }
    return false;
  }

  // Add quality check
  addQualityCheck(check: Omit<QualityCheck, "checkId">): QualityCheck {
    const newCheck: QualityCheck = { ...check, checkId: this.nextCheckId++ };
    this.qualityChecks.push(newCheck);
    return newCheck;
  }

  // Business metrics
  getBusinessMetrics() {
    const delivered = this.orders.filter(o => o.status === "Delivered");
    const totalRevenue = delivered.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingRevenue = this.orders.filter(o => o.status !== "Delivered").reduce((sum, o) => sum + o.totalPrice, 0);

    const totalInventoryValue = this.inventory.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalPallets = this.inventory.reduce((sum, p) => sum + p.quantity, 0);

    const allChecks = this.qualityChecks;
    const totalPassed = allChecks.reduce((sum, c) => sum + c.passed, 0);
    const totalFailed = allChecks.reduce((sum, c) => sum + c.failed, 0);
    const qualityRate = totalPassed + totalFailed > 0 ? (totalPassed / (totalPassed + totalFailed)) * 100 : 0;

    return {
      totalRevenue,
      deliveredOrders: delivered.length,
      pendingOrders: this.orders.length - delivered.length,
      pendingRevenue,
      totalInventoryValue,
      totalPallets,
      qualityRate,
      avgOrderValue: delivered.length > 0 ? totalRevenue / delivered.length : 0,
    };
  }

  // Efficiency metrics
  getEfficiencyMetrics() {
    const activeBays = this.warehouseBays.filter(b => b.status === "Active").length;
    const totalBays = this.warehouseBays.length;
    const avgEfficiency = this.warehouseBays.reduce((sum, b) => sum + b.efficiency, 0) / totalBays;
    const totalProcessed = this.warehouseBays.reduce((sum, b) => sum + b.palletsProcessed, 0);

    return {
      activeBays,
      totalBays,
      bayUtilization: (activeBays / totalBays) * 100,
      avgEfficiency,
      totalProcessed,
    };
  }
}

// ============================================================================
// MAIN CLI APPLICATION
// ============================================================================

class AlexPalletsCLI {
  private db: AlexPalletsDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new AlexPalletsDatabase();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .namespace("AlexPallets")
        .logLevel("info")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .maxHistorySize(500)
        .build()
    );
  }

  private showBanner() {
    console.clear();
    console.log("");
    BannerRenderer.render({
      title: "🪵 ALEX PALLETS LLC",
      subtitle: "Premium Pallet Manufacturing & Distribution • Oklahoma City, OK",
      description: "Real-Time Operations Dashboard • Quality. Efficiency. Local Service.",
      version: "v3.2.1",
      author: "Operations Team",
      width: 100,
      style: "double",
      color: ColorSystem.codes.brightYellow,
    });
    console.log("");

    BoxRenderer.render(
      [
        `📍 Location: 5500 W Reno Ave, Oklahoma City, OK 73127`,
        `📞 Phone: (405) 555-PALL (7255)`,
        `🌐 Email: operations@alexpallets.com`,
        `⏰ Hours: Mon-Fri 6:00 AM - 6:00 PM, Sat 7:00 AM - 3:00 PM`,
      ],
      {
        title: "Contact Information",
        style: "rounded",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" MAIN OPERATIONS MENU", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "📊 Executive Dashboard", value: "dashboard" },
        { label: "📦 Pallet Inventory", value: "inventory" },
        { label: "📋 Customer Orders", value: "orders" },
        { label: "🏭 Warehouse Operations", value: "warehouse" },
        { label: "✅ Quality Control", value: "quality" },
        { label: "🚚 Delivery Management", value: "delivery" },
        { label: "📈 Business Analytics", value: "analytics" },
        { label: "➕ Create New Order", value: "new-order" },
        { label: "⚡ Production Simulation", value: "simulation" },
        { label: "🚪 Exit", value: "exit" },
      ]
    );
  }

  // ========================================================================
  // DASHBOARD
  // ========================================================================

  private async viewDashboard() {
    this.logger.info("Loading executive dashboard...");

    const spinner = new Spinner({ message: "Aggregating real-time data from all systems..." });
    spinner.start();
    await sleep(1200);
    spinner.succeed("Dashboard ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" EXECUTIVE DASHBOARD - ALEX PALLETS LLC", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log("");

    // Current status
    const now = new Date();
    const metrics = this.db.getBusinessMetrics();
    const efficiency = this.db.getEfficiencyMetrics();

    BoxRenderer.render(
      [
        `📅 Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        `🏢 Facility Status: ${ColorSystem.colorize("OPERATIONAL", ColorSystem.codes.brightGreen)}`,
        `👥 Staff On-Site: ${ColorSystem.colorize("24", ColorSystem.codes.brightCyan)} employees`,
        `🏭 Active Bays: ${ColorSystem.colorize(`${efficiency.activeBays}/${efficiency.totalBays}`, ColorSystem.codes.brightYellow)}`,
        `📦 Total Inventory: ${ColorSystem.colorize(Formatter.number(metrics.totalPallets), ColorSystem.codes.brightGreen)} pallets`,
      ],
      {
        title: "🏢 Facility Status",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      }
    );

    console.log("");

    // Revenue metrics
    BoxRenderer.render(
      [
        `💰 Revenue (Delivered): ${ColorSystem.colorize(Formatter.currency(metrics.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `📊 Orders Delivered: ${ColorSystem.colorize(String(metrics.deliveredOrders), ColorSystem.codes.brightCyan)}`,
        `💵 Average Order Value: ${Formatter.currency(metrics.avgOrderValue)}`,
        `⏳ Pending Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.pendingRevenue), ColorSystem.codes.brightYellow)}`,
        `🏦 Inventory Value: ${Formatter.currency(metrics.totalInventoryValue)}`,
      ],
      {
        title: "💰 Financial Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Order status breakdown
    const orders = this.db.getOrders();
    const statusCounts = {
      "Pending": orders.filter(o => o.status === "Pending").length,
      "Production": orders.filter(o => o.status === "Production").length,
      "Quality Check": orders.filter(o => o.status === "Quality Check").length,
      "Ready": orders.filter(o => o.status === "Ready").length,
      "Delivered": orders.filter(o => o.status === "Delivered").length,
    };

    console.log(ColorSystem.colorize("📋 Order Status Pipeline:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(statusCounts).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    // Efficiency metrics
    BoxRenderer.render(
      [
        `🏭 Bay Utilization: ${ColorSystem.colorize(`${efficiency.bayUtilization.toFixed(1)}%`, ColorSystem.codes.brightYellow)}`,
        `⚡ Average Efficiency: ${ColorSystem.colorize(`${efficiency.avgEfficiency.toFixed(1)}%`, ColorSystem.codes.brightGreen)}`,
        `📦 Pallets Processed: ${ColorSystem.colorize(Formatter.number(efficiency.totalProcessed), ColorSystem.codes.brightCyan)}`,
        `✅ Quality Pass Rate: ${ColorSystem.colorize(`${metrics.qualityRate.toFixed(1)}%`, ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "⚡ Operational Efficiency",
        style: "rounded",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Executive dashboard displayed successfully");
  }

  // ========================================================================
  // INVENTORY
  // ========================================================================

  private async viewInventory() {
    this.logger.info("Loading pallet inventory...");

    const spinner = new Spinner({ message: "Scanning warehouse inventory systems..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Inventory data loaded");

    const inventory = this.db.getInventory();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(` PALLET INVENTORY (${inventory.length} Product Lines)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    TableRenderer.render(
      inventory,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "type", label: "Type", width: 16 },
        { key: "size", label: "Size", width: 8, align: "center" },
        { key: "condition", label: "Condition", width: 12 },
        { key: "woodType", label: "Wood", width: 10 },
        { key: "grade", label: "Grade", width: 6, align: "center" },
        {
          key: "quantity",
          label: "Stock",
          width: 8,
          align: "right",
          formatter: (qty: number) => {
            if (qty < 100) return ColorSystem.colorize(String(qty), ColorSystem.codes.red);
            if (qty < 200) return ColorSystem.colorize(String(qty), ColorSystem.codes.yellow);
            return ColorSystem.colorize(String(qty), ColorSystem.codes.green);
          }
        },
        {
          key: "unitPrice",
          label: "Price",
          width: 10,
          align: "right",
          formatter: (price: number) => Formatter.currency(price)
        },
        {
          key: "weightCapacity",
          label: "Capacity (lbs)",
          width: 14,
          align: "right",
          formatter: (cap: number) => Formatter.number(cap)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Low stock alerts
    const lowStock = inventory.filter(p => p.quantity < 100);
    if (lowStock.length > 0) {
      console.log(ColorSystem.colorize("⚠️  LOW STOCK ALERTS:", ColorSystem.codes.red));
      lowStock.forEach(p => {
        console.log(
          ColorSystem.colorize(
            `   • ${p.type} ${p.size} (${p.condition}): ${p.quantity} units remaining`,
            ColorSystem.codes.yellow
          )
        );
      });
      console.log("");
    }

    // Inventory summary
    const totalValue = inventory.reduce((sum, p) => sum + (p.quantity * p.unitPrice), 0);
    const totalPallets = inventory.reduce((sum, p) => sum + p.quantity, 0);

    BoxRenderer.render(
      [
        `Total Pallets: ${ColorSystem.colorize(Formatter.number(totalPallets), ColorSystem.codes.brightCyan)}`,
        `Inventory Value: ${ColorSystem.colorize(Formatter.currency(totalValue), ColorSystem.codes.brightGreen)}`,
        `Product Lines: ${ColorSystem.colorize(String(inventory.length), ColorSystem.codes.brightYellow)}`,
        `Low Stock Items: ${ColorSystem.colorize(String(lowStock.length), lowStock.length > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
      ],
      {
        title: "📊 Inventory Summary",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Inventory analysis complete");
  }

  // ========================================================================
  // ORDERS
  // ========================================================================

  private async viewOrders() {
    this.logger.info("Loading customer orders...");

    const spinner = new Spinner({ message: "Retrieving order database..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Orders loaded");

    const orders = this.db.getOrders();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log(ColorSystem.colorize(` CUSTOMER ORDERS (${orders.length} Active Orders)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log("");

    TableRenderer.render(
      orders,
      [
        { key: "orderId", label: "Order #", width: 8, align: "right" },
        { key: "customer", label: "Customer", width: 16 },
        { key: "company", label: "Company", width: 22 },
        { key: "palletType", label: "Product", width: 20 },
        {
          key: "quantity",
          label: "Qty",
          width: 6,
          align: "right",
          formatter: (qty: number) => Formatter.number(qty)
        },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Pending": ColorSystem.codes.yellow,
              "Production": ColorSystem.codes.cyan,
              "Quality Check": ColorSystem.codes.magenta,
              "Ready": ColorSystem.codes.green,
              "Delivered": ColorSystem.codes.brightGreen,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "priority",
          label: "Priority",
          width: 10,
          formatter: (priority: string) => {
            if (priority === "Same-Day") return ColorSystem.colorize(priority, ColorSystem.codes.red);
            if (priority === "Rush") return ColorSystem.colorize(priority, ColorSystem.codes.yellow);
            return priority;
          }
        },
        {
          key: "totalPrice",
          label: "Total",
          width: 12,
          align: "right",
          formatter: (price: number) => Formatter.currency(price)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Order summary by status
    const delivered = orders.filter(o => o.status === "Delivered").length;
    const inProgress = orders.filter(o => ["Production", "Quality Check"].includes(o.status)).length;
    const pending = orders.filter(o => o.status === "Pending").length;
    const ready = orders.filter(o => o.status === "Ready").length;

    BoxRenderer.render(
      [
        `✅ Delivered: ${ColorSystem.colorize(String(delivered), ColorSystem.codes.brightGreen)}`,
        `🔄 In Progress: ${ColorSystem.colorize(String(inProgress), ColorSystem.codes.cyan)}`,
        `⏳ Pending: ${ColorSystem.colorize(String(pending), ColorSystem.codes.yellow)}`,
        `📦 Ready for Pickup: ${ColorSystem.colorize(String(ready), ColorSystem.codes.green)}`,
      ],
      {
        title: "📊 Order Status Summary",
        style: "rounded",
        color: ColorSystem.codes.blue,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Order list displayed");
  }

  // ========================================================================
  // WAREHOUSE OPERATIONS
  // ========================================================================

  private async viewWarehouse() {
    this.logger.info("Loading warehouse operations...");

    const spinner = new Spinner({ message: "Connecting to warehouse management system..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Warehouse data synchronized");

    const bays = this.db.getWarehouseBays();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(` WAREHOUSE OPERATIONS (${bays.length} Production Bays)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    TableRenderer.render(
      bays,
      [
        { key: "bay", label: "Bay", width: 6, align: "center" },
        { key: "supervisor", label: "Supervisor", width: 18 },
        {
          key: "currentTask",
          label: "Current Task",
          width: 22,
          formatter: (task: string | null) => task || ColorSystem.colorize("(idle)", ColorSystem.codes.dim)
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Active": ColorSystem.codes.brightGreen,
              "Idle": ColorSystem.codes.yellow,
              "Maintenance": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "palletsProcessed",
          label: "Processed",
          width: 12,
          align: "right",
          formatter: (qty: number) => Formatter.number(qty)
        },
        {
          key: "efficiency",
          label: "Efficiency",
          width: 12,
          align: "right",
          formatter: (eff: number) => {
            const effStr = `${eff.toFixed(1)}%`;
            if (eff >= 95) return ColorSystem.colorize(effStr, ColorSystem.codes.brightGreen);
            if (eff >= 90) return ColorSystem.colorize(effStr, ColorSystem.codes.green);
            if (eff >= 85) return ColorSystem.colorize(effStr, ColorSystem.codes.yellow);
            return ColorSystem.colorize(effStr, ColorSystem.codes.red);
          }
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Efficiency chart
    console.log(ColorSystem.colorize("📊 Bay Efficiency Comparison:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      bays.map(b => ({ label: `Bay ${b.bay}`, value: b.efficiency })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    // Summary
    const activeBays = bays.filter(b => b.status === "Active").length;
    const avgEfficiency = bays.reduce((sum, b) => sum + b.efficiency, 0) / bays.length;
    const totalProcessed = bays.reduce((sum, b) => sum + b.palletsProcessed, 0);

    BoxRenderer.render(
      [
        `🏭 Active Bays: ${ColorSystem.colorize(`${activeBays}/${bays.length}`, ColorSystem.codes.brightGreen)}`,
        `⚡ Average Efficiency: ${ColorSystem.colorize(`${avgEfficiency.toFixed(1)}%`, ColorSystem.codes.brightYellow)}`,
        `📦 Total Processed: ${ColorSystem.colorize(Formatter.number(totalProcessed), ColorSystem.codes.brightCyan)} pallets`,
        `🎯 Utilization Rate: ${ColorSystem.colorize(`${((activeBays / bays.length) * 100).toFixed(1)}%`, ColorSystem.codes.green)}`,
      ],
      {
        title: "🏢 Warehouse Summary",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Warehouse operations displayed");
  }

  // ========================================================================
  // QUALITY CONTROL
  // ========================================================================

  private async viewQualityControl() {
    this.logger.info("Loading quality control data...");

    const spinner = new Spinner({ message: "Retrieving inspection records..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Quality data loaded");

    const checks = this.db.getQualityChecks();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(` QUALITY CONTROL INSPECTIONS (${checks.length} Recent Checks)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    TableRenderer.render(
      checks,
      [
        { key: "checkId", label: "Check ID", width: 10, align: "right" },
        { key: "palletType", label: "Pallet Type", width: 20 },
        { key: "inspector", label: "Inspector", width: 18 },
        {
          key: "passed",
          label: "Passed",
          width: 10,
          align: "right",
          formatter: (qty: number) => ColorSystem.colorize(String(qty), ColorSystem.codes.brightGreen)
        },
        {
          key: "failed",
          label: "Failed",
          width: 10,
          align: "right",
          formatter: (qty: number) => ColorSystem.colorize(String(qty), qty > 0 ? ColorSystem.codes.red : ColorSystem.codes.dim)
        },
        {
          key: "timestamp",
          label: "Time",
          width: 18,
          formatter: (date: Date) => date.toLocaleTimeString()
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Detailed issues
    console.log(ColorSystem.colorize("🔍 Quality Issues Identified:", ColorSystem.codes.bright));
    console.log("");

    checks.forEach(check => {
      if (check.issues.length > 0) {
        console.log(ColorSystem.colorize(`Check ${check.checkId} - ${check.palletType}:`, ColorSystem.codes.yellow));
        check.issues.forEach(issue => {
          console.log(ColorSystem.colorize(`  • ${issue}`, ColorSystem.codes.dim));
        });
        console.log("");
      }
    });

    // Quality metrics
    const totalPassed = checks.reduce((sum, c) => sum + c.passed, 0);
    const totalFailed = checks.reduce((sum, c) => sum + c.failed, 0);
    const total = totalPassed + totalFailed;
    const passRate = total > 0 ? (totalPassed / total) * 100 : 0;

    console.log(ColorSystem.colorize("📊 Quality Metrics:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Passed", value: totalPassed },
        { label: "Failed", value: totalFailed },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Total Passed: ${ColorSystem.colorize(Formatter.number(totalPassed), ColorSystem.codes.brightGreen)}`,
        `❌ Total Failed: ${ColorSystem.colorize(Formatter.number(totalFailed), totalFailed > 0 ? ColorSystem.codes.red : ColorSystem.codes.dim)}`,
        `📈 Pass Rate: ${ColorSystem.colorize(`${passRate.toFixed(2)}%`, passRate >= 95 ? ColorSystem.codes.brightGreen : ColorSystem.codes.yellow)}`,
        `🎯 Quality Target: ${ColorSystem.colorize("≥ 95%", ColorSystem.codes.cyan)}`,
      ],
      {
        title: "✅ Quality Summary",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Quality control report displayed");
  }

  // ========================================================================
  // DELIVERY MANAGEMENT
  // ========================================================================

  private async viewDelivery() {
    this.logger.info("Loading delivery schedules...");

    const spinner = new Spinner({ message: "Syncing with logistics system..." });
    spinner.start();
    await sleep(950);
    spinner.succeed("Delivery data loaded");

    const routes = this.db.getDeliveryRoutes();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(` DELIVERY MANAGEMENT (${routes.length} Active Routes)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log("");

    TableRenderer.render(
      routes,
      [
        { key: "routeId", label: "Route", width: 8, align: "center" },
        { key: "driver", label: "Driver", width: 18 },
        { key: "vehicle", label: "Vehicle", width: 12 },
        {
          key: "orders",
          label: "Orders",
          width: 10,
          align: "center",
          formatter: (orders: number[]) => orders.join(", ")
        },
        { key: "area", label: "Delivery Area", width: 20 },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Scheduled": ColorSystem.codes.yellow,
              "In Transit": ColorSystem.codes.cyan,
              "Completed": ColorSystem.codes.brightGreen,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "estimatedTime",
          label: "ETA (min)",
          width: 12,
          align: "right"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Delivery map (simplified)
    console.log(ColorSystem.colorize("🗺️  Oklahoma City Delivery Zones:", ColorSystem.codes.bright));
    console.log("");

    const zones = ["South OKC", "West OKC", "Downtown/Bricktown", "North OKC", "Midwest City"];
    const routesByZone = zones.map(zone => {
      const count = routes.filter(r => r.area === zone).length;
      return { label: zone, value: count };
    });

    ChartRenderer.barChart(routesByZone, {
      showValues: true,
      width: 35,
      color: ColorSystem.codes.brightCyan,
    });

    console.log("");

    // Summary
    const completed = routes.filter(r => r.status === "Completed").length;
    const inTransit = routes.filter(r => r.status === "In Transit").length;
    const scheduled = routes.filter(r => r.status === "Scheduled").length;

    BoxRenderer.render(
      [
        `✅ Completed: ${ColorSystem.colorize(String(completed), ColorSystem.codes.brightGreen)}`,
        `🚚 In Transit: ${ColorSystem.colorize(String(inTransit), ColorSystem.codes.cyan)}`,
        `📅 Scheduled: ${ColorSystem.colorize(String(scheduled), ColorSystem.codes.yellow)}`,
        `🎯 On-Time Rate: ${ColorSystem.colorize("96.5%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🚚 Delivery Summary",
        style: "rounded",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Delivery management displayed");
  }

  // ========================================================================
  // BUSINESS ANALYTICS
  // ========================================================================

  private async viewAnalytics() {
    this.logger.info("Generating business analytics...");

    const spinner = new Spinner({ message: "Crunching numbers and analyzing trends..." });
    spinner.start();
    await sleep(1300);
    spinner.succeed("Analytics ready");

    const metrics = this.db.getBusinessMetrics();
    const efficiency = this.db.getEfficiencyMetrics();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" BUSINESS ANALYTICS & PERFORMANCE METRICS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    // Revenue breakdown
    console.log(ColorSystem.colorize("💰 Revenue Analysis:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Delivered Revenue", value: metrics.totalRevenue / 1000 },
        { label: "Pending Revenue", value: metrics.pendingRevenue / 1000 },
        { label: "Inventory Value", value: metrics.totalInventoryValue / 1000 },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );
    console.log(ColorSystem.colorize("  (Values in thousands)", ColorSystem.codes.dim));
    console.log("");

    // Efficiency metrics
    console.log(ColorSystem.colorize("⚡ Operational Efficiency:", ColorSystem.codes.bright));
    console.log("");

    const efficiencyProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Average Bay Efficiency:", ColorSystem.codes.dim));
    efficiencyProgress.update(efficiency.avgEfficiency);
    efficiencyProgress.complete();
    console.log("");

    const utilizationProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Bay Utilization Rate:", ColorSystem.codes.dim));
    utilizationProgress.update(efficiency.bayUtilization);
    utilizationProgress.complete();
    console.log("");

    const qualityProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Quality Pass Rate:", ColorSystem.codes.dim));
    qualityProgress.update(metrics.qualityRate);
    qualityProgress.complete();
    console.log("");

    // Key performance indicators
    BoxRenderer.render(
      [
        `📈 Total Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `📊 Average Order Value: ${ColorSystem.colorize(Formatter.currency(metrics.avgOrderValue), ColorSystem.codes.cyan)}`,
        `🏭 Pallets Processed: ${ColorSystem.colorize(Formatter.number(efficiency.totalProcessed), ColorSystem.codes.yellow)}`,
        `✅ Quality Rate: ${ColorSystem.colorize(`${metrics.qualityRate.toFixed(1)}%`, ColorSystem.codes.green)}`,
        `⚡ Operational Efficiency: ${ColorSystem.colorize(`${efficiency.avgEfficiency.toFixed(1)}%`, ColorSystem.codes.magenta)}`,
        `🎯 Customer Satisfaction: ${ColorSystem.colorize("98.2%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "📊 Key Performance Indicators",
        style: "double",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");

    // Efficiency gains
    console.log(ColorSystem.colorize("🚀 Efficiency Gains with GenesisTrace:", ColorSystem.codes.bright));
    console.log("");

    const gains = [
      { metric: "Order Processing Time", improvement: 34 },
      { metric: "Inventory Accuracy", improvement: 28 },
      { metric: "Quality Control Speed", improvement: 42 },
      { metric: "Customer Response Time", improvement: 51 },
      { metric: "Operational Visibility", improvement: 89 },
    ];

    gains.forEach(gain => {
      console.log(ColorSystem.colorize(`  ${gain.metric}:`, ColorSystem.codes.dim));
      const gainBar = new ProgressBar({
        total: 100,
        width: 50,
        showValue: false,
        showPercentage: false,
        colorize: true,
      });
      gainBar.update(gain.improvement);
      gainBar.complete();
      console.log(ColorSystem.colorize(`    ${ColorSystem.colorize(`↑ ${gain.improvement}%`, ColorSystem.codes.brightGreen)} improvement`, ColorSystem.codes.dim));
      console.log("");
    });

    this.logger.success("Analytics report generated successfully");
  }

  // ========================================================================
  // CREATE NEW ORDER
  // ========================================================================

  private async createNewOrder() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" CREATE NEW ORDER", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    this.logger.info("Initiating new order creation...");

    try {
      // Get customer info
      const customer = await InteractivePrompts.input("Customer Name:");
      const company = await InteractivePrompts.input("Company Name:");

      // Select pallet type
      const inventory = this.db.getInventory();
      const palletType = await InteractivePrompts.select(
        "Select Pallet Type:",
        inventory.map(p => ({
          label: `${p.type} ${p.size} (${p.condition}) - ${Formatter.currency(p.unitPrice)}/unit - ${p.quantity} available`,
          value: `${p.type} ${p.size} (${p.condition})`
        }))
      );

      // Get quantity
      const quantityStr = await InteractivePrompts.input("Quantity:");
      const quantity = parseInt(quantityStr, 10);

      if (isNaN(quantity) || quantity <= 0) {
        this.logger.error("Invalid quantity entered");
        return;
      }

      // Get delivery address
      const deliveryAddress = await InteractivePrompts.input("Delivery Address (Oklahoma City, OK):");

      // Select priority
      const priority = await InteractivePrompts.select(
        "Order Priority:",
        [
          { label: "Standard (3-5 days)", value: "Standard" },
          { label: "Rush (1-2 days)", value: "Rush" },
          { label: "Same-Day (additional fees apply)", value: "Same-Day" },
        ]
      ) as "Standard" | "Rush" | "Same-Day";

      // Calculate price
      const selectedProduct = inventory.find(p => `${p.type} ${p.size} (${p.condition})` === palletType);
      if (!selectedProduct) {
        this.logger.error("Selected product not found");
        return;
      }

      let unitPrice = selectedProduct.unitPrice;
      if (priority === "Rush") unitPrice *= 1.15;
      if (priority === "Same-Day") unitPrice *= 1.35;

      const totalPrice = unitPrice * quantity;

      // Confirm order
      console.log("");
      BoxRenderer.render(
        [
          `Customer: ${customer}`,
          `Company: ${company}`,
          `Product: ${palletType}`,
          `Quantity: ${quantity} units`,
          `Priority: ${priority}`,
          `Unit Price: ${Formatter.currency(unitPrice)}`,
          `Total Price: ${ColorSystem.colorize(Formatter.currency(totalPrice), ColorSystem.codes.brightGreen)}`,
          `Delivery: ${deliveryAddress}`,
        ],
        {
          title: "📋 Order Summary",
          style: "double",
          color: ColorSystem.codes.cyan,
          padding: 1,
        }
      );
      console.log("");

      const confirm = await InteractivePrompts.confirm("Confirm order creation?");

      if (confirm) {
        const spinner = new Spinner({ message: "Processing order..." });
        spinner.start();
        await sleep(1000);

        // Create order
        const newOrder = this.db.addOrder({
          customer,
          company,
          palletType,
          quantity,
          deliveryAddress,
          status: "Pending",
          orderDate: new Date(),
          totalPrice,
          priority,
        });

        spinner.succeed(`Order #${newOrder.orderId} created successfully!`);
        this.logger.success(`New order created: #${newOrder.orderId} for ${company}`);

        console.log("");
        BoxRenderer.render(
          [
            `🎉 Order #${newOrder.orderId} has been created!`,
            ``,
            `We'll begin processing your order immediately.`,
            `Expected delivery: ${priority === "Same-Day" ? "Today" : priority === "Rush" ? "1-2 business days" : "3-5 business days"}`,
            ``,
            `Thank you for choosing Alex Pallets LLC!`,
          ],
          {
            title: "✅ Order Confirmed",
            style: "double",
            color: ColorSystem.codes.brightGreen,
            padding: 1,
          }
        );
        console.log("");
      } else {
        this.logger.info("Order creation cancelled");
      }
    } catch (error) {
      this.logger.error("Error creating order", { error });
    }
  }

  // ========================================================================
  // PRODUCTION SIMULATION
  // ========================================================================

  private async runProductionSimulation() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" PRODUCTION SIMULATION - LIVE WORKFLOW", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    this.logger.info("Starting production simulation...");
    console.log("");

    // Stage 1: Material Preparation
    console.log(ColorSystem.colorize("🪵 Stage 1: Material Preparation", ColorSystem.codes.brightCyan));
    const prepSpinner = new Spinner({
      message: "Loading lumber from storage...",
      frames: ["◐", "◓", "◑", "◒"],
      interval: 100
    });
    prepSpinner.start();
    await sleep(800);
    prepSpinner.update("Cutting boards to specification...");
    await sleep(900);
    prepSpinner.update("Quality checking wood pieces...");
    await sleep(700);
    prepSpinner.succeed("Material preparation complete");
    console.log("");

    // Stage 2: Assembly
    console.log(ColorSystem.colorize("🔨 Stage 2: Pallet Assembly", ColorSystem.codes.brightGreen));
    const assemblyProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Assembling deck boards...");
    for (let i = 0; i <= 35; i += 5) {
      assemblyProgress.update(i);
      await sleep(150);
    }
    this.logger.info("Attaching stringers...");
    for (let i = 35; i <= 70; i += 5) {
      assemblyProgress.update(i);
      await sleep(150);
    }
    this.logger.info("Securing bottom deck...");
    for (let i = 70; i <= 100; i += 5) {
      assemblyProgress.update(i);
      await sleep(150);
    }
    assemblyProgress.complete();
    this.logger.success("Assembly complete");
    console.log("");

    // Stage 3: Quality Inspection
    console.log(ColorSystem.colorize("✅ Stage 3: Quality Inspection", ColorSystem.codes.brightMagenta));
    const inspectionSpinner = new Spinner({
      message: "Checking structural integrity...",
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 80
    });
    inspectionSpinner.start();
    await sleep(700);
    inspectionSpinner.update("Measuring dimensions...");
    await sleep(600);
    inspectionSpinner.update("Testing weight capacity...");
    await sleep(800);
    inspectionSpinner.update("Visual inspection...");
    await sleep(500);
    inspectionSpinner.succeed("Quality check passed - Grade A");
    console.log("");

    // Stage 4: Finishing
    console.log(ColorSystem.colorize("🎨 Stage 4: Finishing & Treatment", ColorSystem.codes.brightYellow));
    const finishingSpinner = new Spinner({
      message: "Applying wood treatment...",
      frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"],
      interval: 90
    });
    finishingSpinner.start();
    await sleep(900);
    finishingSpinner.update("Heat treating for pest control...");
    await sleep(1000);
    finishingSpinner.update("Applying ISPM 15 stamp...");
    await sleep(700);
    finishingSpinner.succeed("Finishing complete - Ready for shipment");
    console.log("");

    // Summary
    console.log(ColorSystem.colorize("📊 Production Summary:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { stage: "Material Preparation", duration: "2.4 min", status: "Complete", efficiency: "96%" },
        { stage: "Assembly", duration: "4.5 min", status: "Complete", efficiency: "94%" },
        { stage: "Quality Inspection", duration: "2.6 min", status: "Complete", efficiency: "98%" },
        { stage: "Finishing & Treatment", duration: "2.6 min", status: "Complete", efficiency: "97%" },
      ],
      [
        { key: "stage", label: "Stage", width: 25 },
        { key: "duration", label: "Duration", width: 15, align: "right" },
        {
          key: "status",
          label: "Status",
          width: 15,
          formatter: (status: string) => ColorSystem.colorize(status, ColorSystem.codes.brightGreen)
        },
        { key: "efficiency", label: "Efficiency", width: 15, align: "right" },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Total Production Time: ${ColorSystem.colorize("12.1 minutes", ColorSystem.codes.brightCyan)}`,
        `🎯 Overall Efficiency: ${ColorSystem.colorize("96.25%", ColorSystem.codes.brightGreen)}`,
        `📦 Pallets Produced: ${ColorSystem.colorize("1", ColorSystem.codes.yellow)} (simulation)`,
        `💰 Production Cost: ${ColorSystem.colorize("$6.75", ColorSystem.codes.green)}`,
        `📈 Profit Margin: ${ColorSystem.colorize("46%", ColorSystem.codes.brightGreen)} (at $12.50 retail)`,
      ],
      {
        title: "🏭 Production Metrics",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Production simulation completed successfully");
  }

  // ========================================================================
  // MAIN RUN LOOP
  // ========================================================================

  async run() {
    this.showBanner();

    this.logger.info("Alex Pallets Operations Dashboard initialized");
    this.logger.info(`Current time: ${new Date().toLocaleString()}`);
    console.log("");

    while (this.running) {
      try {
        const choice = await this.showMainMenu();
        console.log("");

        switch (choice) {
          case "dashboard":
            await this.viewDashboard();
            break;
          case "inventory":
            await this.viewInventory();
            break;
          case "orders":
            await this.viewOrders();
            break;
          case "warehouse":
            await this.viewWarehouse();
            break;
          case "quality":
            await this.viewQualityControl();
            break;
          case "delivery":
            await this.viewDelivery();
            break;
          case "analytics":
            await this.viewAnalytics();
            break;
          case "new-order":
            await this.createNewOrder();
            break;
          case "simulation":
            await this.runProductionSimulation();
            break;
          case "exit":
            this.running = false;
            console.log("");
            this.logger.info("Shutting down operations dashboard...");
            console.log("");
            BoxRenderer.render(
              [
                "Thank you for using Alex Pallets Operations Dashboard!",
                "",
                "🪵 Quality pallets. Local service. Oklahoma proud.",
                "",
                "Visit us at: 5500 W Reno Ave, Oklahoma City, OK 73127",
                "Call us: (405) 555-PALL (7255)",
              ],
              {
                title: "👋 Goodbye!",
                style: "double",
                color: ColorSystem.codes.brightYellow,
                padding: 1,
              }
            );
            console.log("");
            return;
        }

        console.log("");
        console.log(ColorSystem.colorize("─".repeat(90), ColorSystem.codes.dim));
        await InteractivePrompts.confirm("Press Enter to continue...");
        this.showBanner();
      } catch (error) {
        if (error instanceof Deno.errors.Interrupted) {
          this.running = false;
          console.log("");
          this.logger.info("Operations dashboard interrupted by user");
          return;
        }
        this.logger.error("An error occurred", { error });
        await sleep(2000);
      }
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

if (import.meta.main) {
  const cli = new AlexPalletsCLI();
  await cli.run();
}
