#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Tire Shop Management System
 *
 * A comprehensive example demonstrating how GenesisTrace can power
 * an interactive tire shop operations dashboard and management system.
 *
 * Features used:
 *   • Interactive prompts for service orders
 *   • Real-time inventory tracking
 *   • Service bay status monitoring
 *   • Revenue and performance metrics
 *   • Tables for orders and inventory
 *   • Charts for analytics
 *   • Progress bars for service completion
 *   • Banners and boxes for shop branding
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

// Data structures
interface TireProduct {
  id: number;
  brand: string;
  model: string;
  size: string;
  quantity: number;
  price: number;
  season: "All-Season" | "Summer" | "Winter";
}

interface ServiceOrder {
  orderId: number;
  customer: string;
  vehicle: string;
  service: string;
  bay: number;
  status: "Waiting" | "In Progress" | "Completed";
  estimatedTime: number;
  price: number;
}

interface WorkBay {
  bay: number;
  technician: string;
  currentOrder: number | null;
  status: "Available" | "Busy" | "Break";
  servicesCompleted: number;
}

// Tire Shop Database
class TireShopDatabase {
  private inventory: TireProduct[] = [
    { id: 1, brand: "Michelin", model: "Pilot Sport 4S", size: "225/45R17", quantity: 24, price: 189.99, season: "Summer" },
    { id: 2, brand: "Bridgestone", model: "Blizzak WS90", size: "225/45R17", quantity: 16, price: 169.99, season: "Winter" },
    { id: 3, brand: "Goodyear", model: "Assurance WeatherReady", size: "235/55R18", quantity: 32, price: 149.99, season: "All-Season" },
    { id: 4, brand: "Continental", model: "ExtremeContact DWS06", size: "245/40R19", quantity: 20, price: 199.99, season: "All-Season" },
    { id: 5, brand: "Pirelli", model: "P Zero", size: "255/35R20", quantity: 12, price: 249.99, season: "Summer" },
    { id: 6, brand: "Yokohama", model: "iceGUARD iG53", size: "215/60R16", quantity: 28, price: 139.99, season: "Winter" },
  ];

  private orders: ServiceOrder[] = [
    { orderId: 101, customer: "Sarah Johnson", vehicle: "2021 Honda Civic", service: "Tire Rotation", bay: 1, status: "Completed", estimatedTime: 30, price: 49.99 },
    { orderId: 102, customer: "Mike Davis", vehicle: "2019 Ford F-150", service: "4 Tire Replacement", bay: 2, status: "In Progress", estimatedTime: 90, price: 799.96 },
    { orderId: 103, customer: "Emma Wilson", vehicle: "2020 Toyota RAV4", service: "Wheel Alignment", bay: 3, status: "In Progress", estimatedTime: 60, price: 89.99 },
    { orderId: 104, customer: "James Brown", vehicle: "2022 Tesla Model 3", service: "Tire Balance", bay: 0, status: "Waiting", estimatedTime: 45, price: 59.99 },
  ];

  private workBays: WorkBay[] = [
    { bay: 1, technician: "Alex Rodriguez", currentOrder: null, status: "Available", servicesCompleted: 8 },
    { bay: 2, technician: "Jamie Chen", currentOrder: 102, status: "Busy", servicesCompleted: 6 },
    { bay: 3, technician: "Chris Martinez", currentOrder: 103, status: "Busy", servicesCompleted: 7 },
    { bay: 4, technician: "Taylor Kim", currentOrder: null, status: "Break", servicesCompleted: 5 },
  ];

  private nextOrderId = 105;

  getInventory(): TireProduct[] {
    return [...this.inventory];
  }

  getOrders(): ServiceOrder[] {
    return [...this.orders];
  }

  getWorkBays(): WorkBay[] {
    return [...this.workBays];
  }

  addOrder(order: Omit<ServiceOrder, "orderId">): ServiceOrder {
    const newOrder: ServiceOrder = {
      ...order,
      orderId: this.nextOrderId++,
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId: number, status: ServiceOrder["status"]): void {
    const order = this.orders.find((o) => o.orderId === orderId);
    if (order) {
      order.status = status;
    }
  }

  reduceTireInventory(tireId: number, quantity: number): boolean {
    const tire = this.inventory.find((t) => t.id === tireId);
    if (tire && tire.quantity >= quantity) {
      tire.quantity -= quantity;
      return true;
    }
    return false;
  }

  getRevenueStats() {
    const completed = this.orders.filter(o => o.status === "Completed");
    const totalRevenue = completed.reduce((sum, order) => sum + order.price, 0);
    const avgTicket = completed.length > 0 ? totalRevenue / completed.length : 0;
    return {
      totalRevenue,
      completedServices: completed.length,
      avgTicket,
      pendingRevenue: this.orders.filter(o => o.status !== "Completed").reduce((sum, o) => sum + o.price, 0),
    };
  }
}

// Main Tire Shop CLI
class TireShopCLI {
  private db: TireShopDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new TireShopDatabase();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .enableHistory(true)
        .build(),
    );
  }

  private showBanner() {
    console.clear();
    BannerRenderer.render({
      title: "🔧 PRECISION TIRE & AUTO",
      subtitle: "Professional Tire Service Center",
      description: "Real-time Operations Dashboard • Powered by GenesisTrace",
      version: "v2.1.0",
      author: "Operations Team",
      width: 90,
      style: "double",
      color: ColorSystem.codes.brightYellow,
    });
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" MAIN MENU", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightYellow));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "📊 View Dashboard", value: "📊 View Dashboard" },
        { label: "🛞 Check Tire Inventory", value: "🛞 Check Tire Inventory" },
        { label: "📋 View Service Orders", value: "📋 View Service Orders" },
        { label: "👷 Work Bay Status", value: "👷 Work Bay Status" },
        { label: "➕ Create New Service Order", value: "➕ Create New Service Order" },
        { label: "📈 Revenue Analytics", value: "📈 Revenue Analytics" },
        { label: "🚪 Exit", value: "🚪 Exit" },
      ],
    );
  }

  private async viewDashboard() {
    this.logger.info("Loading shop dashboard...");

    const spinner = new Spinner({ message: "Fetching real-time data..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Dashboard ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" LIVE OPERATIONS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightCyan));
    console.log("");

    // Current time and shop status
    const now = new Date();
    BoxRenderer.render(
      [
        `Current Time: ${now.toLocaleTimeString()}`,
        `Date: ${now.toLocaleDateString()}`,
        `Status: ${ColorSystem.colorize("OPEN", ColorSystem.codes.brightGreen)}`,
        `Active Bays: ${this.db.getWorkBays().filter(b => b.status === "Busy").length}/4`,
      ],
      {
        title: "Shop Status",
        style: "rounded",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("");

    // Service queue summary
    const orders = this.db.getOrders();
    const waiting = orders.filter(o => o.status === "Waiting").length;
    const inProgress = orders.filter(o => o.status === "In Progress").length;
    const completed = orders.filter(o => o.status === "Completed").length;

    console.log(ColorSystem.colorize("Service Queue Overview:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Waiting", value: waiting },
        { label: "In Progress", value: inProgress },
        { label: "Completed", value: completed },
      ],
      {
        showValues: true,
        width: 30,
        color: ColorSystem.codes.brightGreen
      },
    );

    console.log("");

    // Revenue snapshot
    const stats = this.db.getRevenueStats();
    BoxRenderer.render(
      [
        `Today's Revenue: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `Services Completed: ${ColorSystem.colorize(String(stats.completedServices), ColorSystem.codes.brightCyan)}`,
        `Average Ticket: ${Formatter.currency(stats.avgTicket)}`,
        `Pending Revenue: ${Formatter.currency(stats.pendingRevenue)}`,
      ],
      {
        title: "💰 Revenue Summary",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    this.logger.success("Dashboard loaded successfully");
  }

  private async viewInventory() {
    this.logger.info("Loading tire inventory...");

    const spinner = new Spinner({ message: "Checking stock levels..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Inventory loaded");

    const inventory = this.db.getInventory();

    console.log("");
    console.log(ColorSystem.colorize(`Tire Inventory (${inventory.length} products):`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      inventory,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "brand", label: "Brand", width: 12 },
        { key: "model", label: "Model", width: 22 },
        { key: "size", label: "Size", width: 12 },
        { key: "season", label: "Season", width: 12 },
        {
          key: "quantity",
          label: "Stock",
          width: 8,
          align: "right",
          formatter: (qty: number) => {
            if (qty < 10) return ColorSystem.colorize(String(qty), ColorSystem.codes.red);
            if (qty < 20) return ColorSystem.colorize(String(qty), ColorSystem.codes.yellow);
            return ColorSystem.colorize(String(qty), ColorSystem.codes.green);
          }
        },
        {
          key: "price",
          label: "Price",
          width: 10,
          align: "right",
          formatter: (price: number) => Formatter.currency(price),
        },
      ],
      { showIndex: false },
    );

    // Low stock warning
    const lowStock = inventory.filter(t => t.quantity < 15);
    if (lowStock.length > 0) {
      console.log("");
      BoxRenderer.render(
        [
          "⚠️  Low Stock Alert",
          "",
          ...lowStock.map(t => `${t.brand} ${t.model} (${t.size}): Only ${t.quantity} left`),
        ],
        {
          title: "Inventory Warning",
          style: "bold",
          color: ColorSystem.codes.yellow,
          padding: 1,
        },
      );
    }

    this.logger.success(`Displayed ${inventory.length} tire products`);
  }

  private async viewServiceOrders() {
    this.logger.info("Loading service orders...");

    const spinner = new Spinner({ message: "Fetching orders..." });
    spinner.start();
    await sleep(700);
    spinner.succeed("Orders loaded");

    const orders = this.db.getOrders();

    console.log("");
    console.log(ColorSystem.colorize(`Service Orders (${orders.length} total):`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      orders,
      [
        { key: "orderId", label: "Order #", width: 8, align: "right" },
        { key: "customer", label: "Customer", width: 18 },
        { key: "vehicle", label: "Vehicle", width: 20 },
        { key: "service", label: "Service", width: 18 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            if (status === "Completed") return ColorSystem.colorize(status, ColorSystem.codes.green);
            if (status === "In Progress") return ColorSystem.colorize(status, ColorSystem.codes.yellow);
            return ColorSystem.colorize(status, ColorSystem.codes.cyan);
          }
        },
        {
          key: "price",
          label: "Price",
          width: 10,
          align: "right",
          formatter: (price: number) => Formatter.currency(price),
        },
      ],
      { showIndex: true },
    );

    this.logger.success(`Displayed ${orders.length} service orders`);
  }

  private async viewWorkBays() {
    this.logger.info("Checking work bay status...");

    const spinner = new Spinner({ message: "Loading bay information..." });
    spinner.start();
    await sleep(600);
    spinner.succeed("Work bays loaded");

    const bays = this.db.getWorkBays();

    console.log("");
    console.log(ColorSystem.colorize("Work Bay Status:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      bays,
      [
        { key: "bay", label: "Bay", width: 5, align: "center" },
        { key: "technician", label: "Technician", width: 18 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            if (status === "Available") return ColorSystem.colorize(status, ColorSystem.codes.green);
            if (status === "Busy") return ColorSystem.colorize(status, ColorSystem.codes.red);
            return ColorSystem.colorize(status, ColorSystem.codes.yellow);
          }
        },
        {
          key: "currentOrder",
          label: "Current Order",
          width: 14,
          align: "center",
          formatter: (orderId: number | null) => orderId ? `#${orderId}` : "-",
        },
        {
          key: "servicesCompleted",
          label: "Completed",
          width: 10,
          align: "right",
          formatter: (count: number) => Formatter.number(count),
        },
      ],
      { showIndex: false },
    );

    console.log("");

    // Technician performance
    const totalServices = bays.reduce((sum, bay) => sum + bay.servicesCompleted, 0);
    console.log(ColorSystem.colorize("Technician Performance Today:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      bays.map(bay => ({
        label: bay.technician.split(" ")[0],
        value: bay.servicesCompleted,
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightMagenta
      },
    );

    console.log("");
    BoxRenderer.render(
      [
        `Total Services Today: ${ColorSystem.colorize(String(totalServices), ColorSystem.codes.brightCyan)}`,
        `Average per Technician: ${Formatter.number(totalServices / bays.length)}`,
        `Available Bays: ${bays.filter(b => b.status === "Available").length}/4`,
      ],
      {
        title: "Team Performance",
        style: "rounded",
        color: ColorSystem.codes.brightBlue,
        padding: 1,
      },
    );

    this.logger.success("Work bay status displayed");
  }

  private async createServiceOrder() {
    console.log("");
    BoxRenderer.render(
      [
        "Create a new service order for a customer.",
        "",
        "Please provide the following information:",
      ],
      {
        title: "➕ New Service Order",
        style: "rounded",
        color: ColorSystem.codes.green
      },
    );
    console.log("");

    // Customer name
    const customer = await InteractivePrompts.input("Customer Name:");
    if (!customer) {
      BoxRenderer.message("Customer name is required", "error");
      return;
    }

    // Vehicle info
    const vehicle = await InteractivePrompts.input("Vehicle (Year Make Model):");
    if (!vehicle) {
      BoxRenderer.message("Vehicle information is required", "error");
      return;
    }

    // Service type
    const service = await InteractivePrompts.select(
      "Select service type:",
      [
        { label: "Tire Rotation", value: "Tire Rotation" },
        { label: "4 Tire Replacement", value: "4 Tire Replacement" },
        { label: "2 Tire Replacement", value: "2 Tire Replacement" },
        { label: "Wheel Alignment", value: "Wheel Alignment" },
        { label: "Tire Balance", value: "Tire Balance" },
        { label: "Flat Tire Repair", value: "Flat Tire Repair" },
        { label: "TPMS Service", value: "TPMS Service" },
      ],
    );

    // Price based on service
    const prices: Record<string, number> = {
      "Tire Rotation": 49.99,
      "4 Tire Replacement": 799.96,
      "2 Tire Replacement": 399.98,
      "Wheel Alignment": 89.99,
      "Tire Balance": 59.99,
      "Flat Tire Repair": 29.99,
      "TPMS Service": 79.99,
    };

    const estimatedTimes: Record<string, number> = {
      "Tire Rotation": 30,
      "4 Tire Replacement": 90,
      "2 Tire Replacement": 60,
      "Wheel Alignment": 60,
      "Tire Balance": 45,
      "Flat Tire Repair": 30,
      "TPMS Service": 45,
    };

    const price = prices[service];
    const estimatedTime = estimatedTimes[service];

    console.log("");
    BoxRenderer.render(
      [
        `Customer: ${customer}`,
        `Vehicle: ${vehicle}`,
        `Service: ${service}`,
        `Estimated Time: ${estimatedTime} minutes`,
        `Price: ${Formatter.currency(price)}`,
      ],
      {
        title: "Order Summary",
        style: "single",
        color: ColorSystem.codes.cyan,
      },
    );

    const confirm = await InteractivePrompts.confirm(
      "Create this service order?",
      true,
    );

    if (!confirm) {
      BoxRenderer.message("Order creation cancelled", "info");
      return;
    }

    const spinner = new Spinner({ message: "Creating order..." });
    spinner.start();
    await sleep(1000);

    const newOrder = this.db.addOrder({
      customer,
      vehicle,
      service,
      bay: 0,
      status: "Waiting",
      estimatedTime,
      price,
    });

    spinner.succeed("Order created successfully!");

    console.log("");
    BoxRenderer.render(
      [
        `Order Number: ${ColorSystem.colorize(`#${newOrder.orderId}`, ColorSystem.codes.brightYellow)}`,
        `Customer: ${newOrder.customer}`,
        `Status: ${ColorSystem.colorize("Waiting in Queue", ColorSystem.codes.cyan)}`,
        "",
        "Customer has been notified. Order added to service queue.",
      ],
      {
        title: "✅ Order Confirmed",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    this.logger.success(`Created order #${newOrder.orderId} for ${customer}`);
  }

  private async viewRevenueAnalytics() {
    this.logger.info("Generating revenue analytics...");

    const spinner = new Spinner({ message: "Calculating metrics..." });
    spinner.start();
    await sleep(1200);
    spinner.succeed("Analytics ready");

    const stats = this.db.getRevenueStats();
    const orders = this.db.getOrders();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" REVENUE ANALYTICS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(70), ColorSystem.codes.brightGreen));
    console.log("");

    // Revenue summary
    BoxRenderer.render(
      [
        `Today's Revenue: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `Services Completed: ${ColorSystem.colorize(String(stats.completedServices), ColorSystem.codes.brightCyan)}`,
        `Average Ticket: ${Formatter.currency(stats.avgTicket)}`,
        `Pending Revenue: ${Formatter.currency(stats.pendingRevenue)}`,
        "",
        `Projected Daily Total: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue + stats.pendingRevenue), ColorSystem.codes.brightYellow)}`,
      ],
      {
        title: "💰 Revenue Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    console.log("");

    // Service breakdown
    const serviceRevenue: Record<string, number> = {};
    orders.filter(o => o.status === "Completed").forEach(order => {
      serviceRevenue[order.service] = (serviceRevenue[order.service] || 0) + order.price;
    });

    console.log(ColorSystem.colorize("Revenue by Service Type:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(serviceRevenue).map(([service, revenue]) => ({
        label: service,
        value: Math.round(revenue),
      })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen
      },
    );

    console.log("");

    // Performance sparkline (simulated hourly revenue)
    const hourlyRevenue = [120, 250, 180, 320, 290, 410, 380, 450];
    console.log(ColorSystem.colorize("Hourly Revenue Trend:", ColorSystem.codes.bright));
    console.log(
      `${ColorSystem.codes.brightGreen}${ChartRenderer.sparkline(hourlyRevenue)}${ColorSystem.codes.reset}  ${Formatter.currency(hourlyRevenue[hourlyRevenue.length - 1])} (current hour)`,
    );

    console.log("");

    // Key metrics
    TableRenderer.render(
      [
        { metric: "Total Orders", value: orders.length, target: 20, status: "On Track" },
        { metric: "Completion Rate", value: Math.round((stats.completedServices / orders.length) * 100), target: 90, status: "Below Target" },
        { metric: "Avg Service Time", value: 45, target: 60, status: "Excellent" },
        { metric: "Customer Satisfaction", value: 98, target: 95, status: "Excellent" },
      ],
      [
        { key: "metric", label: "Metric", width: 22 },
        { key: "value", label: "Current", width: 10, align: "right" },
        { key: "target", label: "Target", width: 10, align: "right" },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            if (status === "Excellent") return ColorSystem.colorize(status, ColorSystem.codes.brightGreen);
            if (status === "On Track") return ColorSystem.colorize(status, ColorSystem.codes.green);
            return ColorSystem.colorize(status, ColorSystem.codes.yellow);
          }
        },
      ],
      { showIndex: false },
    );

    this.logger.success("Revenue analytics displayed");
  }

  async run() {
    this.showBanner();

    BoxRenderer.render(
      [
        "Welcome to Precision Tire & Auto Management System!",
        "",
        "Manage inventory, track service orders, monitor work bays,",
        "and analyze shop performance all in one place.",
        "",
        `Current Time: ${new Date().toLocaleTimeString()}`,
      ],
      {
        title: "🏁 Welcome",
        style: "double",
        color: ColorSystem.codes.brightYellow,
        padding: 1,
      },
    );

    console.log("");
    this.logger.info("Tire Shop Management System initialized");
    await InteractivePrompts.confirm("Press Enter to continue...", true);

    while (this.running) {
      console.log("\n");
      const choice = await this.showMainMenu();

      console.log("");

      switch (choice) {
        case "📊 View Dashboard":
          await this.viewDashboard();
          break;
        case "🛞 Check Tire Inventory":
          await this.viewInventory();
          break;
        case "📋 View Service Orders":
          await this.viewServiceOrders();
          break;
        case "👷 Work Bay Status":
          await this.viewWorkBays();
          break;
        case "➕ Create New Service Order":
          await this.createServiceOrder();
          break;
        case "📈 Revenue Analytics":
          await this.viewRevenueAnalytics();
          break;
        case "🚪 Exit":
          this.running = false;
          continue;
      }

      console.log("");
      await InteractivePrompts.confirm("Press Enter to return to main menu...", true);
    }

    console.log("\n");
    BoxRenderer.render(
      [
        "Thank you for using Precision Tire & Auto Management System!",
        "",
        `Session ended at ${new Date().toLocaleTimeString()}`,
        "Have a great day!",
      ],
      {
        title: "👋 Goodbye",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      },
    );
    console.log("");

    this.logger.info("Application terminated by user");
    this.logger.success("Session completed successfully");
  }
}

// Main execution
if (import.meta.main) {
  const cli = new TireShopCLI();
  await cli.run();
}
