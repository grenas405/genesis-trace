#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Quick Stop Convenience Store - Oklahoma City Operations Platform
 *
 * A comprehensive demonstration of GenesisTrace capabilities for a modern
 * convenience store chain in Oklahoma City, OK.
 *
 * This enterprise platform showcases:
 *   • Real-time inventory management across multiple categories
 *   • Point-of-Sale (POS) transaction processing
 *   • Employee scheduling and shift management
 *   • Sales analytics and revenue tracking
 *   • Vendor ordering and supply chain management
 *   • Fuel pump monitoring and gas sales
 *   • Loss prevention and security tracking
 *   • Customer loyalty program management
 *   • Interactive operations dashboard
 *   • Compliance and regulatory reporting
 *
 * Features demonstrated:
 *   • Logger with themed configuration
 *   • Interactive prompts for transactions
 *   • Tables for inventory and sales tracking
 *   • Charts for analytics and performance metrics
 *   • Progress bars for operational processes
 *   • Spinners for loading states
 *   • Banners and boxes for branding
 *   • Color-coded status indicators
 *
 * Business Context:
 *   Quick Stop serves Oklahoma City neighborhoods with 24/7 convenience,
 *   quality products, competitive fuel prices, and exceptional customer service.
 *   Focus on efficiency, profitability, and community engagement.
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

interface Product {
  id: number;
  name: string;
  category: "Beverages" | "Snacks" | "Tobacco" | "Hot Food" | "Grocery" | "Other";
  brand: string;
  sku: string;
  quantity: number;
  unitCost: number;
  retailPrice: number;
  reorderPoint: number;
  supplier: string;
}

interface Transaction {
  transactionId: number;
  timestamp: Date;
  cashier: string;
  items: Array<{ productId: number; productName: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "Credit" | "Debit" | "EBT" | "Mobile";
  loyaltyCardUsed: boolean;
}

interface Employee {
  id: number;
  name: string;
  role: "Manager" | "Assistant Manager" | "Cashier" | "Stock Clerk" | "Overnight";
  hourlyRate: number;
  hoursWorked: number;
  shiftPreference: "Morning" | "Evening" | "Night" | "Flexible";
  status: "Active" | "Off-Duty" | "On-Break";
}

interface Shift {
  shiftId: number;
  employeeId: number;
  employeeName: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  role: string;
  status: "Scheduled" | "In-Progress" | "Completed" | "Cancelled";
}

interface FuelPump {
  pumpId: number;
  grade: "Regular" | "Plus" | "Premium" | "Diesel";
  pricePerGallon: number;
  gallonsSoldToday: number;
  revenueToday: number;
  status: "Active" | "Out of Order" | "Maintenance";
}

interface VendorOrder {
  orderId: number;
  vendor: string;
  category: string;
  items: number;
  orderDate: Date;
  expectedDelivery: Date;
  totalCost: number;
  status: "Pending" | "Shipped" | "Delivered" | "Cancelled";
}

interface SecurityIncident {
  incidentId: number;
  timestamp: Date;
  type: "Theft" | "Dispute" | "Suspicious Activity" | "Emergency" | "Other";
  description: string;
  employeeReporting: string;
  resolved: boolean;
  estimatedLoss: number;
}

// ============================================================================
// DATABASE
// ============================================================================

class QuickStopDatabase {
  private inventory: Product[] = [
    { id: 1, name: "Coca-Cola 20oz", category: "Beverages", brand: "Coca-Cola", sku: "BEV-CC20", quantity: 145, unitCost: 0.85, retailPrice: 2.49, reorderPoint: 50, supplier: "Coca-Cola Bottling" },
    { id: 2, name: "Pepsi 20oz", category: "Beverages", brand: "Pepsi", sku: "BEV-PP20", quantity: 132, unitCost: 0.85, retailPrice: 2.49, reorderPoint: 50, supplier: "PepsiCo" },
    { id: 3, name: "Red Bull 8.4oz", category: "Beverages", brand: "Red Bull", sku: "BEV-RB84", quantity: 78, unitCost: 1.75, retailPrice: 3.99, reorderPoint: 30, supplier: "Red Bull Distribution" },
    { id: 4, name: "Dasani Water 20oz", category: "Beverages", brand: "Dasani", sku: "BEV-DW20", quantity: 210, unitCost: 0.45, retailPrice: 1.79, reorderPoint: 80, supplier: "Coca-Cola Bottling" },
    { id: 5, name: "Monster Energy 16oz", category: "Beverages", brand: "Monster", sku: "BEV-ME16", quantity: 42, unitCost: 1.65, retailPrice: 3.49, reorderPoint: 25, supplier: "Monster Beverage" },
    { id: 6, name: "Lay's Classic Chips", category: "Snacks", brand: "Lay's", sku: "SNK-LC01", quantity: 95, unitCost: 1.25, retailPrice: 2.99, reorderPoint: 40, supplier: "Frito-Lay" },
    { id: 7, name: "Doritos Nacho Cheese", category: "Snacks", brand: "Doritos", sku: "SNK-DN01", quantity: 88, unitCost: 1.25, retailPrice: 2.99, reorderPoint: 40, supplier: "Frito-Lay" },
    { id: 8, name: "Snickers Bar", category: "Snacks", brand: "Mars", sku: "SNK-SB01", quantity: 156, unitCost: 0.65, retailPrice: 1.79, reorderPoint: 60, supplier: "Mars Wrigley" },
    { id: 9, name: "Reese's Peanut Butter Cups", category: "Snacks", brand: "Reese's", sku: "SNK-RC01", quantity: 134, unitCost: 0.68, retailPrice: 1.89, reorderPoint: 50, supplier: "Hershey Company" },
    { id: 10, name: "Marlboro Red", category: "Tobacco", brand: "Marlboro", sku: "TOB-MR01", quantity: 65, unitCost: 5.50, retailPrice: 8.99, reorderPoint: 30, supplier: "Philip Morris" },
    { id: 11, name: "Hot Dog with Bun", category: "Hot Food", brand: "Quick Stop", sku: "HOT-HD01", quantity: 45, unitCost: 0.75, retailPrice: 2.49, reorderPoint: 20, supplier: "Sysco Foods" },
    { id: 12, name: "Pizza Slice", category: "Hot Food", brand: "Quick Stop", sku: "HOT-PS01", quantity: 32, unitCost: 1.25, retailPrice: 3.99, reorderPoint: 15, supplier: "Sysco Foods" },
    { id: 13, name: "Coffee 16oz", category: "Beverages", brand: "Quick Stop", sku: "BEV-CF16", quantity: 0, unitCost: 0.35, retailPrice: 1.99, reorderPoint: 0, supplier: "Sysco Foods" },
    { id: 14, name: "White Bread", category: "Grocery", brand: "Wonder", sku: "GRO-WB01", quantity: 28, unitCost: 1.50, retailPrice: 3.49, reorderPoint: 12, supplier: "Bimbo Bakeries" },
    { id: 15, name: "Milk Gallon", category: "Grocery", brand: "Hiland", sku: "GRO-MG01", quantity: 18, unitCost: 2.75, retailPrice: 4.99, reorderPoint: 10, supplier: "Hiland Dairy" },
  ];

  private transactions: Transaction[] = [
    {
      transactionId: 10001,
      timestamp: new Date("2025-11-28T08:15:23"),
      cashier: "Sarah Martinez",
      items: [
        { productId: 1, productName: "Coca-Cola 20oz", quantity: 2, price: 2.49 },
        { productId: 6, productName: "Lay's Classic Chips", quantity: 1, price: 2.99 }
      ],
      subtotal: 7.97,
      tax: 0.72,
      total: 8.69,
      paymentMethod: "Credit",
      loyaltyCardUsed: true
    },
    {
      transactionId: 10002,
      timestamp: new Date("2025-11-28T08:32:45"),
      cashier: "Mike Johnson",
      items: [
        { productId: 13, productName: "Coffee 16oz", quantity: 1, price: 1.99 },
        { productId: 8, productName: "Snickers Bar", quantity: 1, price: 1.79 }
      ],
      subtotal: 3.78,
      tax: 0.34,
      total: 4.12,
      paymentMethod: "Cash",
      loyaltyCardUsed: false
    },
    {
      transactionId: 10003,
      timestamp: new Date("2025-11-28T09:05:12"),
      cashier: "Sarah Martinez",
      items: [
        { productId: 10, productName: "Marlboro Red", quantity: 2, price: 8.99 },
        { productId: 3, productName: "Red Bull 8.4oz", quantity: 1, price: 3.99 }
      ],
      subtotal: 21.97,
      tax: 1.98,
      total: 23.95,
      paymentMethod: "Debit",
      loyaltyCardUsed: false
    },
  ];

  private employees: Employee[] = [
    { id: 1, name: "David Thompson", role: "Manager", hourlyRate: 22.50, hoursWorked: 42, shiftPreference: "Morning", status: "Active" },
    { id: 2, name: "Sarah Martinez", role: "Assistant Manager", hourlyRate: 18.00, hoursWorked: 38, shiftPreference: "Evening", status: "Active" },
    { id: 3, name: "Mike Johnson", role: "Cashier", hourlyRate: 14.50, hoursWorked: 35, shiftPreference: "Morning", status: "On-Break" },
    { id: 4, name: "Jessica Lee", role: "Cashier", hourlyRate: 14.50, hoursWorked: 32, shiftPreference: "Evening", status: "Off-Duty" },
    { id: 5, name: "Carlos Rodriguez", role: "Stock Clerk", hourlyRate: 15.00, hoursWorked: 40, shiftPreference: "Night", status: "Active" },
    { id: 6, name: "Amanda Chen", role: "Overnight", hourlyRate: 16.50, hoursWorked: 40, shiftPreference: "Night", status: "Off-Duty" },
  ];

  private shifts: Shift[] = [
    { shiftId: 1, employeeId: 1, employeeName: "David Thompson", date: new Date("2025-11-28"), startTime: "06:00", endTime: "14:00", duration: 8, role: "Manager", status: "In-Progress" },
    { shiftId: 2, employeeId: 3, employeeName: "Mike Johnson", date: new Date("2025-11-28"), startTime: "07:00", endTime: "15:00", duration: 8, role: "Cashier", status: "In-Progress" },
    { shiftId: 3, employeeId: 2, employeeName: "Sarah Martinez", date: new Date("2025-11-28"), startTime: "14:00", endTime: "22:00", duration: 8, role: "Assistant Manager", status: "Scheduled" },
    { shiftId: 4, employeeId: 4, employeeName: "Jessica Lee", date: new Date("2025-11-28"), startTime: "15:00", endTime: "23:00", duration: 8, role: "Cashier", status: "Scheduled" },
    { shiftId: 5, employeeId: 6, employeeName: "Amanda Chen", date: new Date("2025-11-28"), startTime: "22:00", endTime: "06:00", duration: 8, role: "Overnight", status: "Scheduled" },
  ];

  private fuelPumps: FuelPump[] = [
    { pumpId: 1, grade: "Regular", pricePerGallon: 2.89, gallonsSoldToday: 1245, revenueToday: 3598.05, status: "Active" },
    { pumpId: 2, grade: "Regular", pricePerGallon: 2.89, gallonsSoldToday: 1189, revenueToday: 3436.21, status: "Active" },
    { pumpId: 3, grade: "Plus", pricePerGallon: 3.19, gallonsSoldToday: 567, revenueToday: 1808.73, status: "Active" },
    { pumpId: 4, grade: "Premium", pricePerGallon: 3.49, gallonsSoldToday: 423, revenueToday: 1476.27, status: "Active" },
    { pumpId: 5, grade: "Diesel", pricePerGallon: 3.29, gallonsSoldToday: 892, revenueToday: 2934.68, status: "Active" },
    { pumpId: 6, grade: "Regular", pricePerGallon: 2.89, gallonsSoldToday: 0, revenueToday: 0, status: "Maintenance" },
  ];

  private vendorOrders: VendorOrder[] = [
    {
      orderId: 5001,
      vendor: "Coca-Cola Bottling",
      category: "Beverages",
      items: 240,
      orderDate: new Date("2025-11-26"),
      expectedDelivery: new Date("2025-11-29"),
      totalCost: 425.00,
      status: "Shipped"
    },
    {
      orderId: 5002,
      vendor: "Frito-Lay",
      category: "Snacks",
      items: 180,
      orderDate: new Date("2025-11-27"),
      expectedDelivery: new Date("2025-11-30"),
      totalCost: 315.50,
      status: "Pending"
    },
    {
      orderId: 5003,
      vendor: "Sysco Foods",
      category: "Hot Food",
      items: 120,
      orderDate: new Date("2025-11-27"),
      expectedDelivery: new Date("2025-11-29"),
      totalCost: 225.75,
      status: "Shipped"
    },
  ];

  private securityIncidents: SecurityIncident[] = [
    {
      incidentId: 3001,
      timestamp: new Date("2025-11-27T14:23:00"),
      type: "Theft",
      description: "Customer left without paying for beverage",
      employeeReporting: "Sarah Martinez",
      resolved: true,
      estimatedLoss: 2.49
    },
    {
      incidentId: 3002,
      timestamp: new Date("2025-11-27T22:45:00"),
      type: "Suspicious Activity",
      description: "Individual loitering in parking lot",
      employeeReporting: "Amanda Chen",
      resolved: true,
      estimatedLoss: 0
    },
  ];

  private nextTransactionId = 10004;
  private nextOrderId = 5004;
  private nextIncidentId = 3003;

  // Getters
  getInventory(): Product[] { return [...this.inventory]; }
  getTransactions(): Transaction[] { return [...this.transactions]; }
  getEmployees(): Employee[] { return [...this.employees]; }
  getShifts(): Shift[] { return [...this.shifts]; }
  getFuelPumps(): FuelPump[] { return [...this.fuelPumps]; }
  getVendorOrders(): VendorOrder[] { return [...this.vendorOrders]; }
  getSecurityIncidents(): SecurityIncident[] { return [...this.securityIncidents]; }

  // Add transaction
  addTransaction(transaction: Omit<Transaction, "transactionId">): Transaction {
    const newTransaction: Transaction = { ...transaction, transactionId: this.nextTransactionId++ };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  // Get product by ID
  getProductById(id: number): Product | undefined {
    return this.inventory.find(p => p.id === id);
  }

  // Update inventory
  updateInventory(productId: number, quantityChange: number): boolean {
    const product = this.inventory.find(p => p.id === productId);
    if (product) {
      product.quantity += quantityChange;
      return true;
    }
    return false;
  }

  // Business metrics
  getBusinessMetrics() {
    const totalRevenue = this.transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTransactions = this.transactions.length;
    const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    const inventoryValue = this.inventory.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
    const inventoryRetailValue = this.inventory.reduce((sum, p) => sum + (p.quantity * p.retailPrice), 0);
    const potentialProfit = inventoryRetailValue - inventoryValue;

    const fuelRevenue = this.fuelPumps.reduce((sum, p) => sum + p.revenueToday, 0);
    const totalGallonsSold = this.fuelPumps.reduce((sum, p) => sum + p.gallonsSoldToday, 0);

    const lowStock = this.inventory.filter(p => p.quantity <= p.reorderPoint).length;

    const loyaltyTransactions = this.transactions.filter(t => t.loyaltyCardUsed).length;
    const loyaltyRate = totalTransactions > 0 ? (loyaltyTransactions / totalTransactions) * 100 : 0;

    return {
      totalRevenue,
      totalTransactions,
      avgTransactionValue,
      inventoryValue,
      inventoryRetailValue,
      potentialProfit,
      fuelRevenue,
      totalGallonsSold,
      lowStock,
      loyaltyRate,
      totalDailyRevenue: totalRevenue + fuelRevenue,
    };
  }

  // Employee metrics
  getEmployeeMetrics() {
    const totalHours = this.employees.reduce((sum, e) => sum + e.hoursWorked, 0);
    const totalPayroll = this.employees.reduce((sum, e) => sum + (e.hoursWorked * e.hourlyRate), 0);
    const avgHourlyRate = this.employees.length > 0
      ? this.employees.reduce((sum, e) => sum + e.hourlyRate, 0) / this.employees.length
      : 0;

    const activeEmployees = this.employees.filter(e => e.status === "Active").length;

    return {
      totalEmployees: this.employees.length,
      activeEmployees,
      totalHours,
      totalPayroll,
      avgHourlyRate,
    };
  }

  // Add vendor order
  addVendorOrder(order: Omit<VendorOrder, "orderId">): VendorOrder {
    const newOrder: VendorOrder = { ...order, orderId: this.nextOrderId++ };
    this.vendorOrders.push(newOrder);
    return newOrder;
  }

  // Add security incident
  addSecurityIncident(incident: Omit<SecurityIncident, "incidentId">): SecurityIncident {
    const newIncident: SecurityIncident = { ...incident, incidentId: this.nextIncidentId++ };
    this.securityIncidents.push(newIncident);
    return newIncident;
  }
}

// ============================================================================
// MAIN CLI APPLICATION
// ============================================================================

class QuickStopCLI {
  private db: QuickStopDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new QuickStopDatabase();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .namespace("QuickStop")
        .logLevel("info")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .maxHistorySize(1000)
        .build()
    );
  }

  private showBanner() {
    console.clear();
    console.log("");
    BannerRenderer.render({
      title: "⚡ QUICK STOP CONVENIENCE STORE",
      subtitle: "Enterprise Operations Platform • Oklahoma City, OK",
      description: "Real-Time POS • Inventory • Fuel Management • 24/7 Operations",
      version: "v4.1.2",
      author: "Quick Stop Operations Team",
      width: 100,
      style: "double",
      color: ColorSystem.codes.brightCyan,
    });
    console.log("");

    BoxRenderer.render(
      [
        `📍 Location: 2401 N Classen Blvd, Oklahoma City, OK 73106`,
        `📞 Phone: (405) 555-STOP (7867)`,
        `🌐 Email: operations@quickstop-okc.com`,
        `⏰ Hours: Open 24 Hours • 7 Days a Week`,
      ],
      {
        title: "Store Information",
        style: "rounded",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" MAIN OPERATIONS MENU", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "📊 Executive Dashboard", value: "dashboard" },
        { label: "📦 Inventory Management", value: "inventory" },
        { label: "💳 POS Transactions", value: "transactions" },
        { label: "👥 Employee Management", value: "employees" },
        { label: "📅 Shift Scheduling", value: "shifts" },
        { label: "⛽ Fuel Operations", value: "fuel" },
        { label: "📋 Vendor Orders", value: "vendors" },
        { label: "🔒 Security & Loss Prevention", value: "security" },
        { label: "📈 Sales Analytics", value: "analytics" },
        { label: "➕ New Transaction", value: "new-transaction" },
        { label: "⚡ Daily Operations Simulation", value: "simulation" },
        { label: "🚪 Exit", value: "exit" },
      ]
    );
  }

  // ========================================================================
  // DASHBOARD
  // ========================================================================

  private async viewDashboard() {
    this.logger.info("Loading executive dashboard...");

    const spinner = new Spinner({ message: "Aggregating real-time operational data..." });
    spinner.start();
    await sleep(1200);
    spinner.succeed("Dashboard ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" EXECUTIVE DASHBOARD - QUICK STOP CONVENIENCE", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightCyan));
    console.log("");

    const now = new Date();
    const metrics = this.db.getBusinessMetrics();
    const empMetrics = this.db.getEmployeeMetrics();

    BoxRenderer.render(
      [
        `📅 Date: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`,
        `🏢 Store Status: ${ColorSystem.colorize("OPEN 24/7", ColorSystem.codes.brightGreen)}`,
        `👥 Employees On-Site: ${ColorSystem.colorize(`${empMetrics.activeEmployees}/${empMetrics.totalEmployees}`, ColorSystem.codes.brightCyan)}`,
        `⛽ Fuel Pumps Active: ${ColorSystem.colorize("5/6", ColorSystem.codes.brightYellow)}`,
        `💰 Today's Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.totalDailyRevenue), ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🏢 Current Status",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      }
    );

    console.log("");

    // Revenue breakdown
    BoxRenderer.render(
      [
        `💳 Store Sales: ${ColorSystem.colorize(Formatter.currency(metrics.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `⛽ Fuel Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.fuelRevenue), ColorSystem.codes.cyan)}`,
        `📊 Total Transactions: ${ColorSystem.colorize(String(metrics.totalTransactions), ColorSystem.codes.yellow)}`,
        `💵 Avg Transaction: ${Formatter.currency(metrics.avgTransactionValue)}`,
        `🎯 Loyalty Usage: ${ColorSystem.colorize(`${metrics.loyaltyRate.toFixed(1)}%`, ColorSystem.codes.magenta)}`,
      ],
      {
        title: "💰 Revenue Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Fuel sales chart
    const pumps = this.db.getFuelPumps().filter(p => p.status === "Active");
    console.log(ColorSystem.colorize("⛽ Fuel Sales by Pump:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      pumps.map(p => ({ label: `Pump ${p.pumpId} (${p.grade})`, value: p.gallonsSoldToday })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");

    // Inventory alerts
    BoxRenderer.render(
      [
        `📦 Total Inventory Value: ${ColorSystem.colorize(Formatter.currency(metrics.inventoryValue), ColorSystem.codes.cyan)}`,
        `💎 Retail Value: ${ColorSystem.colorize(Formatter.currency(metrics.inventoryRetailValue), ColorSystem.codes.green)}`,
        `📈 Potential Profit: ${ColorSystem.colorize(Formatter.currency(metrics.potentialProfit), ColorSystem.codes.brightGreen)}`,
        `⚠️  Low Stock Items: ${ColorSystem.colorize(String(metrics.lowStock), metrics.lowStock > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
      ],
      {
        title: "📦 Inventory Health",
        style: "rounded",
        color: ColorSystem.codes.magenta,
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
    this.logger.info("Loading inventory data...");

    const spinner = new Spinner({ message: "Scanning inventory database..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Inventory loaded");

    const inventory = this.db.getInventory();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(` INVENTORY MANAGEMENT (${inventory.length} Products)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    TableRenderer.render(
      inventory,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "name", label: "Product Name", width: 22 },
        { key: "category", label: "Category", width: 12 },
        { key: "sku", label: "SKU", width: 11 },
        {
          key: "quantity",
          label: "Stock",
          width: 8,
          align: "right",
          formatter: (qty: number) => {
            const qtyStr = String(qty);
            if (qty < 30) return ColorSystem.colorize(qtyStr, ColorSystem.codes.red);
            if (qty < 50) return ColorSystem.colorize(qtyStr, ColorSystem.codes.yellow);
            return ColorSystem.colorize(qtyStr, ColorSystem.codes.green);
          }
        },
        {
          key: "unitCost",
          label: "Cost",
          width: 9,
          align: "right",
          formatter: (cost: number) => Formatter.currency(cost)
        },
        {
          key: "retailPrice",
          label: "Retail",
          width: 9,
          align: "right",
          formatter: (price: number) => Formatter.currency(price)
        },
        {
          key: "reorderPoint",
          label: "Reorder",
          width: 8,
          align: "right"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Low stock alerts
    const lowStock = inventory.filter(p => p.quantity <= p.reorderPoint);
    if (lowStock.length > 0) {
      console.log(ColorSystem.colorize("⚠️  LOW STOCK ALERTS - REORDER NEEDED:", ColorSystem.codes.red));
      lowStock.forEach(p => {
        console.log(
          ColorSystem.colorize(
            `   • ${p.name} (${p.sku}): ${p.quantity} units (reorder at ${p.reorderPoint})`,
            ColorSystem.codes.yellow
          )
        );
      });
      console.log("");
    }

    // Category breakdown
    const categories = ["Beverages", "Snacks", "Tobacco", "Hot Food", "Grocery", "Other"];
    console.log(ColorSystem.colorize("📊 Inventory by Category:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      categories.map(cat => ({
        label: cat,
        value: inventory.filter(p => p.category === cat).reduce((sum, p) => sum + p.quantity, 0)
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightMagenta,
      }
    );

    console.log("");

    // Summary
    const totalValue = inventory.reduce((sum, p) => sum + (p.quantity * p.unitCost), 0);
    const totalRetail = inventory.reduce((sum, p) => sum + (p.quantity * p.retailPrice), 0);
    const totalUnits = inventory.reduce((sum, p) => sum + p.quantity, 0);

    BoxRenderer.render(
      [
        `Total Units: ${ColorSystem.colorize(Formatter.number(totalUnits), ColorSystem.codes.brightCyan)}`,
        `Inventory Cost: ${ColorSystem.colorize(Formatter.currency(totalValue), ColorSystem.codes.yellow)}`,
        `Retail Value: ${ColorSystem.colorize(Formatter.currency(totalRetail), ColorSystem.codes.brightGreen)}`,
        `Potential Margin: ${ColorSystem.colorize(Formatter.currency(totalRetail - totalValue), ColorSystem.codes.green)}`,
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
  // TRANSACTIONS
  // ========================================================================

  private async viewTransactions() {
    this.logger.info("Loading transaction history...");

    const spinner = new Spinner({ message: "Retrieving POS transactions..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Transactions loaded");

    const transactions = this.db.getTransactions();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log(ColorSystem.colorize(` POS TRANSACTIONS (${transactions.length} Today)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log("");

    TableRenderer.render(
      transactions,
      [
        { key: "transactionId", label: "Trans #", width: 8, align: "right" },
        {
          key: "timestamp",
          label: "Time",
          width: 10,
          formatter: (date: Date) => date.toLocaleTimeString()
        },
        { key: "cashier", label: "Cashier", width: 18 },
        {
          key: "items",
          label: "Items",
          width: 6,
          align: "center",
          formatter: (items: Array<unknown>) => String(items.length)
        },
        {
          key: "subtotal",
          label: "Subtotal",
          width: 10,
          align: "right",
          formatter: (amt: number) => Formatter.currency(amt)
        },
        {
          key: "tax",
          label: "Tax",
          width: 8,
          align: "right",
          formatter: (amt: number) => Formatter.currency(amt)
        },
        {
          key: "total",
          label: "Total",
          width: 10,
          align: "right",
          formatter: (amt: number) => ColorSystem.colorize(Formatter.currency(amt), ColorSystem.codes.brightGreen)
        },
        {
          key: "paymentMethod",
          label: "Payment",
          width: 10,
          formatter: (method: string) => {
            const colors: Record<string, string> = {
              "Cash": ColorSystem.codes.green,
              "Credit": ColorSystem.codes.cyan,
              "Debit": ColorSystem.codes.blue,
              "EBT": ColorSystem.codes.yellow,
              "Mobile": ColorSystem.codes.magenta,
            };
            return ColorSystem.colorize(method, colors[method] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Payment method breakdown
    const paymentMethods = ["Cash", "Credit", "Debit", "EBT", "Mobile"];
    console.log(ColorSystem.colorize("💳 Payment Method Distribution:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      paymentMethods.map(method => ({
        label: method,
        value: transactions.filter(t => t.paymentMethod === method).length
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightBlue,
      }
    );

    console.log("");

    // Summary
    const totalRevenue = transactions.reduce((sum, t) => sum + t.total, 0);
    const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);
    const avgTransaction = transactions.length > 0 ? totalRevenue / transactions.length : 0;
    const loyaltyCount = transactions.filter(t => t.loyaltyCardUsed).length;

    BoxRenderer.render(
      [
        `💰 Total Revenue: ${ColorSystem.colorize(Formatter.currency(totalRevenue), ColorSystem.codes.brightGreen)}`,
        `📊 Transactions: ${ColorSystem.colorize(String(transactions.length), ColorSystem.codes.cyan)}`,
        `💵 Avg Transaction: ${Formatter.currency(avgTransaction)}`,
        `🏛️  Tax Collected: ${Formatter.currency(totalTax)}`,
        `🎯 Loyalty Usage: ${ColorSystem.colorize(`${loyaltyCount}/${transactions.length}`, ColorSystem.codes.magenta)} (${transactions.length > 0 ? ((loyaltyCount / transactions.length) * 100).toFixed(1) : 0}%)`,
      ],
      {
        title: "💳 Transaction Summary",
        style: "rounded",
        color: ColorSystem.codes.blue,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Transaction history displayed");
  }

  // ========================================================================
  // EMPLOYEES
  // ========================================================================

  private async viewEmployees() {
    this.logger.info("Loading employee data...");

    const spinner = new Spinner({ message: "Accessing HR database..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Employee data loaded");

    const employees = this.db.getEmployees();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(` EMPLOYEE MANAGEMENT (${employees.length} Staff Members)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    TableRenderer.render(
      employees,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "name", label: "Employee Name", width: 20 },
        { key: "role", label: "Role", width: 18 },
        {
          key: "hourlyRate",
          label: "Hourly Rate",
          width: 12,
          align: "right",
          formatter: (rate: number) => Formatter.currency(rate)
        },
        {
          key: "hoursWorked",
          label: "Hours",
          width: 8,
          align: "right"
        },
        { key: "shiftPreference", label: "Shift Pref", width: 12 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Active": ColorSystem.codes.brightGreen,
              "Off-Duty": ColorSystem.codes.yellow,
              "On-Break": ColorSystem.codes.cyan,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Payroll calculation
    console.log(ColorSystem.colorize("💰 Weekly Payroll Breakdown:", ColorSystem.codes.bright));
    console.log("");

    const payroll = employees.map(e => ({
      label: e.name,
      value: e.hoursWorked * e.hourlyRate
    }));

    ChartRenderer.barChart(payroll, {
      showValues: true,
      width: 40,
      color: ColorSystem.codes.brightGreen,
    });

    console.log("");

    // Summary
    const totalHours = employees.reduce((sum, e) => sum + e.hoursWorked, 0);
    const totalPayroll = employees.reduce((sum, e) => sum + (e.hoursWorked * e.hourlyRate), 0);
    const avgHourlyRate = employees.length > 0
      ? employees.reduce((sum, e) => sum + e.hourlyRate, 0) / employees.length
      : 0;
    const activeCount = employees.filter(e => e.status === "Active").length;

    BoxRenderer.render(
      [
        `👥 Total Employees: ${ColorSystem.colorize(String(employees.length), ColorSystem.codes.cyan)}`,
        `✅ Currently Active: ${ColorSystem.colorize(String(activeCount), ColorSystem.codes.brightGreen)}`,
        `⏰ Total Hours: ${ColorSystem.colorize(Formatter.number(totalHours), ColorSystem.codes.yellow)}`,
        `💵 Weekly Payroll: ${ColorSystem.colorize(Formatter.currency(totalPayroll), ColorSystem.codes.brightGreen)}`,
        `📊 Avg Hourly Rate: ${Formatter.currency(avgHourlyRate)}`,
      ],
      {
        title: "👥 Employee Summary",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Employee data displayed");
  }

  // ========================================================================
  // SHIFTS
  // ========================================================================

  private async viewShifts() {
    this.logger.info("Loading shift schedule...");

    const spinner = new Spinner({ message: "Retrieving scheduling data..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Shift schedule loaded");

    const shifts = this.db.getShifts();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(` SHIFT SCHEDULING (${shifts.length} Shifts Today)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    TableRenderer.render(
      shifts,
      [
        { key: "shiftId", label: "Shift", width: 6, align: "center" },
        { key: "employeeName", label: "Employee", width: 20 },
        { key: "role", label: "Role", width: 18 },
        { key: "startTime", label: "Start", width: 10, align: "center" },
        { key: "endTime", label: "End", width: 10, align: "center" },
        {
          key: "duration",
          label: "Hours",
          width: 8,
          align: "right"
        },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Scheduled": ColorSystem.codes.yellow,
              "In-Progress": ColorSystem.codes.brightGreen,
              "Completed": ColorSystem.codes.green,
              "Cancelled": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Shift coverage timeline
    console.log(ColorSystem.colorize("📅 24-Hour Coverage Timeline:", ColorSystem.codes.bright));
    console.log("");
    console.log(ColorSystem.colorize("  00:00 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 24:00", ColorSystem.codes.dim));

    shifts.forEach(shift => {
      const start = parseInt(shift.startTime.split(":")[0]);
      const end = parseInt(shift.endTime.split(":")[0]);
      const spaces = " ".repeat(start * 2);
      const bars = "█".repeat((end > start ? end - start : 24 - start + end) * 2);
      console.log(ColorSystem.colorize(`  ${spaces}${bars}`, ColorSystem.codes.brightCyan) + ColorSystem.colorize(` ${shift.employeeName} (${shift.role})`, ColorSystem.codes.dim));
    });

    console.log("");

    // Summary
    const inProgress = shifts.filter(s => s.status === "In-Progress").length;
    const scheduled = shifts.filter(s => s.status === "Scheduled").length;
    const totalHours = shifts.reduce((sum, s) => sum + s.duration, 0);

    BoxRenderer.render(
      [
        `📅 Total Shifts Today: ${ColorSystem.colorize(String(shifts.length), ColorSystem.codes.cyan)}`,
        `🟢 In Progress: ${ColorSystem.colorize(String(inProgress), ColorSystem.codes.brightGreen)}`,
        `🟡 Scheduled: ${ColorSystem.colorize(String(scheduled), ColorSystem.codes.yellow)}`,
        `⏰ Total Coverage Hours: ${ColorSystem.colorize(String(totalHours), ColorSystem.codes.brightCyan)}`,
        `✅ 24/7 Coverage: ${ColorSystem.colorize("ACTIVE", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "📅 Shift Summary",
        style: "rounded",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Shift schedule displayed");
  }

  // ========================================================================
  // FUEL OPERATIONS
  // ========================================================================

  private async viewFuel() {
    this.logger.info("Loading fuel operations...");

    const spinner = new Spinner({ message: "Syncing with fuel management system..." });
    spinner.start();
    await sleep(950);
    spinner.succeed("Fuel data loaded");

    const pumps = this.db.getFuelPumps();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(` FUEL OPERATIONS (${pumps.length} Pumps)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    TableRenderer.render(
      pumps,
      [
        { key: "pumpId", label: "Pump", width: 6, align: "center" },
        { key: "grade", label: "Grade", width: 12 },
        {
          key: "pricePerGallon",
          label: "Price/Gal",
          width: 12,
          align: "right",
          formatter: (price: number) => Formatter.currency(price)
        },
        {
          key: "gallonsSoldToday",
          label: "Gallons Sold",
          width: 14,
          align: "right",
          formatter: (gal: number) => Formatter.number(gal)
        },
        {
          key: "revenueToday",
          label: "Revenue",
          width: 14,
          align: "right",
          formatter: (rev: number) => ColorSystem.colorize(Formatter.currency(rev), ColorSystem.codes.brightGreen)
        },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Active": ColorSystem.codes.brightGreen,
              "Out of Order": ColorSystem.codes.red,
              "Maintenance": ColorSystem.codes.yellow,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Fuel sales by grade
    const grades = ["Regular", "Plus", "Premium", "Diesel"];
    console.log(ColorSystem.colorize("⛽ Sales by Fuel Grade:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      grades.map(grade => ({
        label: grade,
        value: pumps.filter(p => p.grade === grade && p.status === "Active").reduce((sum, p) => sum + p.revenueToday, 0)
      })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");

    // Summary
    const activePumps = pumps.filter(p => p.status === "Active").length;
    const totalGallons = pumps.reduce((sum, p) => sum + p.gallonsSoldToday, 0);
    const totalRevenue = pumps.reduce((sum, p) => sum + p.revenueToday, 0);
    const avgPricePerGallon = totalGallons > 0 ? totalRevenue / totalGallons : 0;

    BoxRenderer.render(
      [
        `⛽ Active Pumps: ${ColorSystem.colorize(`${activePumps}/${pumps.length}`, ColorSystem.codes.brightGreen)}`,
        `🛢️  Total Gallons Sold: ${ColorSystem.colorize(Formatter.number(totalGallons), ColorSystem.codes.cyan)}`,
        `💰 Fuel Revenue: ${ColorSystem.colorize(Formatter.currency(totalRevenue), ColorSystem.codes.brightGreen)}`,
        `📊 Avg Price/Gallon: ${Formatter.currency(avgPricePerGallon)}`,
        `📈 Pump Utilization: ${ColorSystem.colorize(`${((activePumps / pumps.length) * 100).toFixed(1)}%`, ColorSystem.codes.yellow)}`,
      ],
      {
        title: "⛽ Fuel Operations Summary",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Fuel operations displayed");
  }

  // ========================================================================
  // VENDOR ORDERS
  // ========================================================================

  private async viewVendors() {
    this.logger.info("Loading vendor orders...");

    const spinner = new Spinner({ message: "Retrieving supply chain data..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Vendor orders loaded");

    const orders = this.db.getVendorOrders();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(` VENDOR ORDERS (${orders.length} Active Orders)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    TableRenderer.render(
      orders,
      [
        { key: "orderId", label: "Order #", width: 8, align: "right" },
        { key: "vendor", label: "Vendor", width: 22 },
        { key: "category", label: "Category", width: 12 },
        {
          key: "items",
          label: "Items",
          width: 8,
          align: "right"
        },
        {
          key: "orderDate",
          label: "Ordered",
          width: 12,
          formatter: (date: Date) => date.toLocaleDateString()
        },
        {
          key: "expectedDelivery",
          label: "Delivery",
          width: 12,
          formatter: (date: Date) => date.toLocaleDateString()
        },
        {
          key: "totalCost",
          label: "Total",
          width: 12,
          align: "right",
          formatter: (cost: number) => Formatter.currency(cost)
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Pending": ColorSystem.codes.yellow,
              "Shipped": ColorSystem.codes.cyan,
              "Delivered": ColorSystem.codes.brightGreen,
              "Cancelled": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Summary
    const totalCost = orders.reduce((sum, o) => sum + o.totalCost, 0);
    const totalItems = orders.reduce((sum, o) => sum + o.items, 0);
    const pending = orders.filter(o => o.status === "Pending").length;
    const shipped = orders.filter(o => o.status === "Shipped").length;

    BoxRenderer.render(
      [
        `📦 Total Orders: ${ColorSystem.colorize(String(orders.length), ColorSystem.codes.cyan)}`,
        `📊 Total Items: ${ColorSystem.colorize(Formatter.number(totalItems), ColorSystem.codes.yellow)}`,
        `💰 Total Cost: ${ColorSystem.colorize(Formatter.currency(totalCost), ColorSystem.codes.green)}`,
        `⏳ Pending: ${ColorSystem.colorize(String(pending), ColorSystem.codes.yellow)}`,
        `🚚 Shipped: ${ColorSystem.colorize(String(shipped), ColorSystem.codes.cyan)}`,
      ],
      {
        title: "📋 Vendor Order Summary",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Vendor orders displayed");
  }

  // ========================================================================
  // SECURITY
  // ========================================================================

  private async viewSecurity() {
    this.logger.info("Loading security data...");

    const spinner = new Spinner({ message: "Accessing security logs..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Security data loaded");

    const incidents = this.db.getSecurityIncidents();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightRed));
    console.log(ColorSystem.colorize(` SECURITY & LOSS PREVENTION (${incidents.length} Recent Incidents)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightRed));
    console.log("");

    TableRenderer.render(
      incidents,
      [
        { key: "incidentId", label: "ID", width: 6, align: "right" },
        {
          key: "timestamp",
          label: "Date/Time",
          width: 18,
          formatter: (date: Date) => date.toLocaleString()
        },
        { key: "type", label: "Type", width: 18 },
        { key: "description", label: "Description", width: 32 },
        { key: "employeeReporting", label: "Reported By", width: 18 },
        {
          key: "resolved",
          label: "Status",
          width: 10,
          formatter: (resolved: boolean) =>
            ColorSystem.colorize(resolved ? "Resolved" : "Open", resolved ? ColorSystem.codes.green : ColorSystem.codes.red)
        },
        {
          key: "estimatedLoss",
          label: "Loss",
          width: 10,
          align: "right",
          formatter: (loss: number) => loss > 0 ? ColorSystem.colorize(Formatter.currency(loss), ColorSystem.codes.red) : "-"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Incident types
    const types = ["Theft", "Dispute", "Suspicious Activity", "Emergency", "Other"];
    console.log(ColorSystem.colorize("🔒 Incidents by Type:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      types.map(type => ({
        label: type,
        value: incidents.filter(i => i.type === type).length
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.red,
      }
    );

    console.log("");

    // Summary
    const totalLoss = incidents.reduce((sum, i) => sum + i.estimatedLoss, 0);
    const resolved = incidents.filter(i => i.resolved).length;
    const open = incidents.filter(i => !i.resolved).length;

    BoxRenderer.render(
      [
        `📊 Total Incidents: ${ColorSystem.colorize(String(incidents.length), ColorSystem.codes.cyan)}`,
        `✅ Resolved: ${ColorSystem.colorize(String(resolved), ColorSystem.codes.green)}`,
        `⚠️  Open: ${ColorSystem.colorize(String(open), open > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
        `💸 Estimated Loss: ${ColorSystem.colorize(Formatter.currency(totalLoss), totalLoss > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
        `🎯 Resolution Rate: ${ColorSystem.colorize(`${incidents.length > 0 ? ((resolved / incidents.length) * 100).toFixed(1) : 0}%`, ColorSystem.codes.yellow)}`,
      ],
      {
        title: "🔒 Security Summary",
        style: "double",
        color: ColorSystem.codes.red,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Security data displayed");
  }

  // ========================================================================
  // ANALYTICS
  // ========================================================================

  private async viewAnalytics() {
    this.logger.info("Generating sales analytics...");

    const spinner = new Spinner({ message: "Analyzing performance data..." });
    spinner.start();
    await sleep(1300);
    spinner.succeed("Analytics ready");

    const metrics = this.db.getBusinessMetrics();
    const empMetrics = this.db.getEmployeeMetrics();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" SALES ANALYTICS & PERFORMANCE METRICS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    // Revenue breakdown
    console.log(ColorSystem.colorize("💰 Revenue Analysis:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Store Sales", value: metrics.totalRevenue },
        { label: "Fuel Revenue", value: metrics.fuelRevenue },
        { label: "Inventory Value", value: metrics.inventoryValue },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    // Performance metrics
    console.log(ColorSystem.colorize("📊 Key Performance Indicators:", ColorSystem.codes.bright));
    console.log("");

    const revenueProgress = new ProgressBar({
      total: 20000,
      width: 60,
      showValue: true,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Daily Revenue Target ($20,000):", ColorSystem.codes.dim));
    revenueProgress.update(metrics.totalDailyRevenue);
    revenueProgress.complete();
    console.log("");

    const loyaltyProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Loyalty Card Usage:", ColorSystem.codes.dim));
    loyaltyProgress.update(metrics.loyaltyRate);
    loyaltyProgress.complete();
    console.log("");

    const marginProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    const profitMargin = metrics.inventoryRetailValue > 0
      ? ((metrics.potentialProfit / metrics.inventoryRetailValue) * 100)
      : 0;

    console.log(ColorSystem.colorize("  Profit Margin:", ColorSystem.codes.dim));
    marginProgress.update(profitMargin);
    marginProgress.complete();
    console.log("");

    // Summary
    BoxRenderer.render(
      [
        `💰 Total Daily Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.totalDailyRevenue), ColorSystem.codes.brightGreen)}`,
        `📊 Avg Transaction: ${ColorSystem.colorize(Formatter.currency(metrics.avgTransactionValue), ColorSystem.codes.cyan)}`,
        `⛽ Fuel Gallons Sold: ${ColorSystem.colorize(Formatter.number(metrics.totalGallonsSold), ColorSystem.codes.yellow)}`,
        `🎯 Loyalty Usage: ${ColorSystem.colorize(`${metrics.loyaltyRate.toFixed(1)}%`, ColorSystem.codes.magenta)}`,
        `📈 Profit Margin: ${ColorSystem.colorize(`${profitMargin.toFixed(1)}%`, ColorSystem.codes.green)}`,
        `👥 Labor Cost: ${ColorSystem.colorize(Formatter.currency(empMetrics.totalPayroll), ColorSystem.codes.red)}`,
      ],
      {
        title: "📊 Performance Dashboard",
        style: "double",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");

    // Efficiency gains
    console.log(ColorSystem.colorize("🚀 Operational Improvements with GenesisTrace:", ColorSystem.codes.bright));
    console.log("");

    const gains = [
      { metric: "Transaction Processing Speed", improvement: 47 },
      { metric: "Inventory Accuracy", improvement: 38 },
      { metric: "Employee Scheduling Efficiency", improvement: 52 },
      { metric: "Loss Prevention", improvement: 29 },
      { metric: "Customer Service Response", improvement: 63 },
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
  // NEW TRANSACTION
  // ========================================================================

  private async createNewTransaction() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" NEW POS TRANSACTION", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    this.logger.info("Starting new POS transaction...");

    try {
      // Select cashier
      const employees = this.db.getEmployees().filter(e =>
        e.role === "Cashier" || e.role === "Manager" || e.role === "Assistant Manager"
      );

      const cashier = await InteractivePrompts.select(
        "Select Cashier:",
        employees.map(e => ({ label: `${e.name} (${e.role})`, value: e.name }))
      );

      // Add items
      const items: Array<{ productId: number; productName: string; quantity: number; price: number }> = [];
      let addingItems = true;

      while (addingItems) {
        const inventory = this.db.getInventory().filter(p => p.quantity > 0);

        if (items.length > 0) {
          console.log("");
          console.log(ColorSystem.colorize("Current Items:", ColorSystem.codes.bright));
          items.forEach((item, idx) => {
            console.log(`  ${idx + 1}. ${item.productName} x${item.quantity} - ${Formatter.currency(item.price * item.quantity)}`);
          });
          console.log("");
        }

        const product = await InteractivePrompts.select(
          "Select Product:",
          [
            ...inventory.map(p => ({
              label: `${p.name} - ${Formatter.currency(p.retailPrice)} (${p.quantity} in stock)`,
              value: String(p.id)
            })),
            { label: "✅ Finish & Checkout", value: "done" }
          ]
        );

        if (product === "done") {
          if (items.length === 0) {
            this.logger.error("No items in transaction");
            continue;
          }
          addingItems = false;
          break;
        }

        const productId = parseInt(product, 10);
        const selectedProduct = this.db.getProductById(productId);

        if (!selectedProduct) {
          this.logger.error("Product not found");
          continue;
        }

        const quantityStr = await InteractivePrompts.input(`Quantity for ${selectedProduct.name}:`);
        const quantity = parseInt(quantityStr, 10);

        if (isNaN(quantity) || quantity <= 0) {
          this.logger.error("Invalid quantity");
          continue;
        }

        if (quantity > selectedProduct.quantity) {
          this.logger.error(`Only ${selectedProduct.quantity} units available`);
          continue;
        }

        items.push({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity,
          price: selectedProduct.retailPrice
        });

        this.logger.success(`Added ${quantity}x ${selectedProduct.name}`);
      }

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const taxRate = 0.0895; // Oklahoma City sales tax
      const tax = subtotal * taxRate;
      const total = subtotal + tax;

      // Select payment method
      const paymentMethod = await InteractivePrompts.select(
        "Payment Method:",
        [
          { label: "💵 Cash", value: "Cash" },
          { label: "💳 Credit Card", value: "Credit" },
          { label: "💳 Debit Card", value: "Debit" },
          { label: "🎫 EBT/SNAP", value: "EBT" },
          { label: "📱 Mobile Payment", value: "Mobile" },
        ]
      ) as "Cash" | "Credit" | "Debit" | "EBT" | "Mobile";

      // Loyalty card
      const loyaltyCardUsed = await InteractivePrompts.confirm("Loyalty card scanned?");

      // Show transaction summary
      console.log("");
      BoxRenderer.render(
        [
          `Cashier: ${cashier}`,
          `Items: ${items.length}`,
          ``,
          ...items.map(item => `  ${item.productName} x${item.quantity} @ ${Formatter.currency(item.price)} = ${Formatter.currency(item.price * item.quantity)}`),
          ``,
          `Subtotal: ${Formatter.currency(subtotal)}`,
          `Tax (8.95%): ${Formatter.currency(tax)}`,
          `${ColorSystem.colorize(`Total: ${Formatter.currency(total)}`, ColorSystem.codes.brightGreen)}`,
          ``,
          `Payment: ${paymentMethod}`,
          `Loyalty Card: ${loyaltyCardUsed ? "Yes" : "No"}`,
        ],
        {
          title: "💳 Transaction Summary",
          style: "double",
          color: ColorSystem.codes.cyan,
          padding: 1,
        }
      );
      console.log("");

      const confirm = await InteractivePrompts.confirm("Complete transaction?");

      if (confirm) {
        const spinner = new Spinner({ message: "Processing transaction..." });
        spinner.start();
        await sleep(1000);

        // Create transaction
        const newTransaction = this.db.addTransaction({
          timestamp: new Date(),
          cashier,
          items,
          subtotal,
          tax,
          total,
          paymentMethod,
          loyaltyCardUsed
        });

        // Update inventory
        items.forEach(item => {
          this.db.updateInventory(item.productId, -item.quantity);
        });

        spinner.succeed(`Transaction #${newTransaction.transactionId} completed!`);
        this.logger.success(`Transaction processed: ${Formatter.currency(total)}`);

        console.log("");
        BoxRenderer.render(
          [
            `🎉 Transaction #${newTransaction.transactionId} Complete!`,
            ``,
            `Total: ${ColorSystem.colorize(Formatter.currency(total), ColorSystem.codes.brightGreen)}`,
            `Payment: ${paymentMethod}`,
            ``,
            `Thank you for shopping at Quick Stop!`,
            loyaltyCardUsed ? `✨ Loyalty points added to account` : ``,
          ],
          {
            title: "✅ Transaction Complete",
            style: "double",
            color: ColorSystem.codes.brightGreen,
            padding: 1,
          }
        );
        console.log("");
      } else {
        this.logger.info("Transaction cancelled");
      }
    } catch (error) {
      this.logger.error("Error processing transaction", { error });
    }
  }

  // ========================================================================
  // DAILY OPERATIONS SIMULATION
  // ========================================================================

  private async runDailySimulation() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" DAILY OPERATIONS SIMULATION - 24-HOUR CYCLE", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    this.logger.info("Starting daily operations simulation...");
    console.log("");

    // Morning Rush (6 AM - 9 AM)
    console.log(ColorSystem.colorize("☀️  Phase 1: Morning Rush (6:00 AM - 9:00 AM)", ColorSystem.codes.brightCyan));
    const morningSpinner = new Spinner({
      message: "Opening store, starting coffee machines...",
      frames: ["◐", "◓", "◑", "◒"],
      interval: 100
    });
    morningSpinner.start();
    await sleep(800);
    morningSpinner.update("Processing breakfast orders and fuel customers...");
    await sleep(900);
    morningSpinner.update("Peak transaction period - multiple cashiers active...");
    await sleep(700);
    morningSpinner.succeed("Morning rush completed - 47 transactions processed");
    console.log("");

    // Midday Operations (9 AM - 5 PM)
    console.log(ColorSystem.colorize("🌤️  Phase 2: Midday Operations (9:00 AM - 5:00 PM)", ColorSystem.codes.brightGreen));
    const middayProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Regular customer traffic and inventory restocking...");
    for (let i = 0; i <= 35; i += 5) {
      middayProgress.update(i);
      await sleep(150);
    }
    this.logger.info("Lunch rush - hot food sales peak...");
    for (let i = 35; i <= 70; i += 5) {
      middayProgress.update(i);
      await sleep(150);
    }
    this.logger.info("Vendor deliveries and inventory updates...");
    for (let i = 70; i <= 100; i += 5) {
      middayProgress.update(i);
      await sleep(150);
    }
    middayProgress.complete();
    this.logger.success("Midday operations complete - 98 transactions processed");
    console.log("");

    // Evening Shift (5 PM - 11 PM)
    console.log(ColorSystem.colorize("🌆 Phase 3: Evening Shift (5:00 PM - 11:00 PM)", ColorSystem.codes.brightMagenta));
    const eveningSpinner = new Spinner({
      message: "After-work rush - fuel and snacks...",
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 80
    });
    eveningSpinner.start();
    await sleep(700);
    eveningSpinner.update("Dinner time - hot food preparation...");
    await sleep(800);
    eveningSpinner.update("Evening customer service and cleaning...");
    await sleep(600);
    eveningSpinner.succeed("Evening shift completed - 62 transactions processed");
    console.log("");

    // Overnight Operations (11 PM - 6 AM)
    console.log(ColorSystem.colorize("🌙 Phase 4: Overnight Operations (11:00 PM - 6:00 AM)", ColorSystem.codes.brightBlue));
    const overnightSpinner = new Spinner({
      message: "Security monitoring and late-night customers...",
      frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"],
      interval: 90
    });
    overnightSpinner.start();
    await sleep(900);
    overnightSpinner.update("Inventory counts and shelf restocking...");
    await sleep(1000);
    overnightSpinner.update("Floor cleaning and maintenance tasks...");
    await sleep(800);
    overnightSpinner.succeed("Overnight operations complete - 28 transactions processed");
    console.log("");

    // Daily Summary
    console.log(ColorSystem.colorize("📊 Daily Operations Summary:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { shift: "Morning Rush", hours: "6 AM - 9 AM", transactions: 47, revenue: "$1,247.35", efficiency: "96%" },
        { shift: "Midday Operations", hours: "9 AM - 5 PM", transactions: 98, revenue: "$2,458.72", efficiency: "94%" },
        { shift: "Evening Shift", hours: "5 PM - 11 PM", transactions: 62, revenue: "$1,683.91", efficiency: "95%" },
        { shift: "Overnight Operations", hours: "11 PM - 6 AM", transactions: 28, revenue: "$742.18", efficiency: "92%" },
      ],
      [
        { key: "shift", label: "Shift Period", width: 22 },
        { key: "hours", label: "Hours", width: 16 },
        { key: "transactions", label: "Trans", width: 10, align: "right" },
        {
          key: "revenue",
          label: "Revenue",
          width: 14,
          align: "right",
          formatter: (rev: string) => ColorSystem.colorize(rev, ColorSystem.codes.brightGreen)
        },
        { key: "efficiency", label: "Efficiency", width: 12, align: "right" },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Total Transactions: ${ColorSystem.colorize("235", ColorSystem.codes.brightCyan)}`,
        `💰 Store Revenue: ${ColorSystem.colorize("$6,132.16", ColorSystem.codes.brightGreen)}`,
        `⛽ Fuel Revenue: ${ColorSystem.colorize("$13,253.94", ColorSystem.codes.cyan)}`,
        `📊 Combined Daily Revenue: ${ColorSystem.colorize("$19,386.10", ColorSystem.codes.brightYellow)}`,
        `🎯 Operational Efficiency: ${ColorSystem.colorize("94.75%", ColorSystem.codes.green)}`,
        `👥 Employee Hours: ${ColorSystem.colorize("40 hours", ColorSystem.codes.magenta)}`,
        `🔒 Security Incidents: ${ColorSystem.colorize("0", ColorSystem.codes.brightGreen)}`,
        `📈 Customer Satisfaction: ${ColorSystem.colorize("97.8%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🏢 24-Hour Operations Metrics",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Daily operations simulation completed successfully");
  }

  // ========================================================================
  // MAIN RUN LOOP
  // ========================================================================

  async run() {
    this.showBanner();

    this.logger.info("Quick Stop Operations Platform initialized");
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
          case "transactions":
            await this.viewTransactions();
            break;
          case "employees":
            await this.viewEmployees();
            break;
          case "shifts":
            await this.viewShifts();
            break;
          case "fuel":
            await this.viewFuel();
            break;
          case "vendors":
            await this.viewVendors();
            break;
          case "security":
            await this.viewSecurity();
            break;
          case "analytics":
            await this.viewAnalytics();
            break;
          case "new-transaction":
            await this.createNewTransaction();
            break;
          case "simulation":
            await this.runDailySimulation();
            break;
          case "exit":
            this.running = false;
            console.log("");
            this.logger.info("Shutting down operations platform...");
            console.log("");
            BoxRenderer.render(
              [
                "Thank you for using Quick Stop Operations Platform!",
                "",
                "⚡ Your neighborhood convenience store. Open 24/7.",
                "",
                "Visit us at: 2401 N Classen Blvd, Oklahoma City, OK 73106",
                "Call us: (405) 555-STOP (7867)",
              ],
              {
                title: "👋 Goodbye!",
                style: "double",
                color: ColorSystem.codes.brightCyan,
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
          this.logger.info("Operations platform interrupted by user");
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
  const cli = new QuickStopCLI();
  await cli.run();
}
