#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Greenhouse Dispensary Management System - Oklahoma City
 *
 * A comprehensive example demonstrating how GenesisTrace can power
 * a professional cannabis dispensary operations dashboard and management system.
 *
 * Features used:
 *   • Interactive prompts for customer orders
 *   • Real-time product inventory tracking
 *   • Budtender performance monitoring
 *   • Revenue and compliance metrics
 *   • Tables for orders and inventory
 *   • Charts for analytics
 *   • Progress bars for daily limits
 *   • Banners and boxes for dispensary branding
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
interface Product {
  id: number;
  name: string;
  brand: string;
  category: "Flower" | "Concentrate" | "Edible" | "Vape" | "Topical" | "Pre-Roll";
  thcPercent: number;
  cbdPercent: number;
  strain: "Indica" | "Sativa" | "Hybrid";
  quantity: number; // in grams or units
  pricePerUnit: number;
  unit: "gram" | "unit" | "oz";
}

interface Transaction {
  transactionId: number;
  customer: string;
  medicalCard: string;
  products: { productId: number; quantity: number; }[];
  budtender: string;
  status: "Pending" | "In Progress" | "Completed" | "Cancelled";
  total: number;
  timestamp: Date;
  loyaltyPoints: number;
}

interface Budtender {
  id: number;
  name: string;
  status: "Available" | "Busy" | "Break";
  currentTransaction: number | null;
  transactionsToday: number;
  salesTotal: number;
  certificationLevel: "Entry" | "Senior" | "Lead";
}

// Greenhouse Dispensary Database
class GreenhouseDatabase {
  private inventory: Product[] = [
    { id: 1, name: "Wedding Cake", brand: "OKind", category: "Flower", thcPercent: 28.5, cbdPercent: 0.3, strain: "Indica", quantity: 112, pricePerUnit: 12, unit: "gram" },
    { id: 2, name: "Blue Dream", brand: "Craft Cannabis", category: "Flower", thcPercent: 24.2, cbdPercent: 0.5, strain: "Hybrid", quantity: 168, pricePerUnit: 10, unit: "gram" },
    { id: 3, name: "Sour Diesel", brand: "Green Valley", category: "Flower", thcPercent: 26.8, cbdPercent: 0.2, strain: "Sativa", quantity: 84, pricePerUnit: 11, unit: "gram" },
    { id: 4, name: "Live Resin Cart", brand: "Apothecary", category: "Vape", thcPercent: 89.5, cbdPercent: 0.1, strain: "Hybrid", quantity: 45, pricePerUnit: 35, unit: "unit" },
    { id: 5, name: "Gummies - Cherry", brand: "Korova", category: "Edible", thcPercent: 0, cbdPercent: 0, strain: "Hybrid", quantity: 62, pricePerUnit: 25, unit: "unit" },
    { id: 6, name: "Shatter - OG Kush", brand: "Cicada", category: "Concentrate", thcPercent: 92.3, cbdPercent: 0.1, strain: "Indica", quantity: 28, pricePerUnit: 40, unit: "gram" },
    { id: 7, name: "CBD Salve", brand: "Mary's Medicinals", category: "Topical", thcPercent: 0, cbdPercent: 95.0, strain: "Hybrid", quantity: 18, pricePerUnit: 45, unit: "unit" },
    { id: 8, name: "Purple Punch Pre-Roll", brand: "Sublime", category: "Pre-Roll", thcPercent: 22.1, cbdPercent: 0.4, strain: "Indica", quantity: 96, pricePerUnit: 8, unit: "unit" },
    { id: 9, name: "Jack Herer", brand: "Craft Cannabis", category: "Flower", thcPercent: 23.5, cbdPercent: 0.6, strain: "Sativa", quantity: 140, pricePerUnit: 11, unit: "gram" },
    { id: 10, name: "RSO Syringe", brand: "Green Hornet", category: "Concentrate", thcPercent: 85.0, cbdPercent: 1.2, strain: "Hybrid", quantity: 15, pricePerUnit: 60, unit: "unit" },
  ];

  private transactions: Transaction[] = [
    {
      transactionId: 1001,
      customer: "Sarah M.",
      medicalCard: "OK-MM-****1234",
      products: [{ productId: 1, quantity: 7 }, { productId: 8, quantity: 2 }],
      budtender: "Jordan Williams",
      status: "Completed",
      total: 100.00,
      timestamp: new Date(Date.now() - 3600000),
      loyaltyPoints: 10,
    },
    {
      transactionId: 1002,
      customer: "Michael P.",
      medicalCard: "OK-MM-****5678",
      products: [{ productId: 4, quantity: 2 }],
      budtender: "Taylor Martinez",
      status: "In Progress",
      total: 70.00,
      timestamp: new Date(Date.now() - 1800000),
      loyaltyPoints: 7,
    },
    {
      transactionId: 1003,
      customer: "Emily R.",
      medicalCard: "OK-MM-****9012",
      products: [{ productId: 2, quantity: 14 }, { productId: 5, quantity: 1 }],
      budtender: "Jordan Williams",
      status: "Completed",
      total: 165.00,
      timestamp: new Date(Date.now() - 7200000),
      loyaltyPoints: 17,
    },
  ];

  private budtenders: Budtender[] = [
    { id: 1, name: "Jordan Williams", status: "Available", currentTransaction: null, transactionsToday: 12, salesTotal: 1847.50, certificationLevel: "Lead" },
    { id: 2, name: "Taylor Martinez", status: "Busy", currentTransaction: 1002, transactionsToday: 9, salesTotal: 1245.75, certificationLevel: "Senior" },
    { id: 3, name: "Alex Chen", status: "Available", currentTransaction: null, transactionsToday: 8, salesTotal: 1098.25, certificationLevel: "Senior" },
    { id: 4, name: "Casey Johnson", status: "Break", currentTransaction: null, transactionsToday: 6, salesTotal: 892.00, certificationLevel: "Entry" },
  ];

  private nextTransactionId = 1004;

  getInventory(): Product[] {
    return [...this.inventory];
  }

  getTransactions(): Transaction[] {
    return [...this.transactions];
  }

  getBudtenders(): Budtender[] {
    return [...this.budtenders];
  }

  getProductById(id: number): Product | undefined {
    return this.inventory.find(p => p.id === id);
  }

  addTransaction(transaction: Omit<Transaction, "transactionId" | "timestamp">): Transaction {
    const newTransaction: Transaction = {
      ...transaction,
      transactionId: this.nextTransactionId++,
      timestamp: new Date(),
    };
    this.transactions.push(newTransaction);
    return newTransaction;
  }

  updateTransactionStatus(transactionId: number, status: Transaction["status"]): void {
    const transaction = this.transactions.find((t) => t.transactionId === transactionId);
    if (transaction) {
      transaction.status = status;
    }
  }

  reduceInventory(productId: number, quantity: number): boolean {
    const product = this.inventory.find((p) => p.id === productId);
    if (product && product.quantity >= quantity) {
      product.quantity -= quantity;
      return true;
    }
    return false;
  }

  getRevenueStats() {
    const completed = this.transactions.filter(t => t.status === "Completed");
    const totalRevenue = completed.reduce((sum, transaction) => sum + transaction.total, 0);
    const avgTransaction = completed.length > 0 ? totalRevenue / completed.length : 0;
    return {
      totalRevenue,
      completedTransactions: completed.length,
      avgTransaction,
      pendingRevenue: this.transactions.filter(t => t.status !== "Completed" && t.status !== "Cancelled").reduce((sum, t) => sum + t.total, 0),
      totalLoyaltyPoints: completed.reduce((sum, t) => sum + t.loyaltyPoints, 0),
    };
  }

  getCategoryBreakdown() {
    const breakdown: Record<string, { sales: number; revenue: number }> = {};

    this.transactions.filter(t => t.status === "Completed").forEach(transaction => {
      transaction.products.forEach(item => {
        const product = this.getProductById(item.productId);
        if (product) {
          if (!breakdown[product.category]) {
            breakdown[product.category] = { sales: 0, revenue: 0 };
          }
          breakdown[product.category].sales += item.quantity;
          breakdown[product.category].revenue += item.quantity * product.pricePerUnit;
        }
      });
    });

    return breakdown;
  }
}

// Main Greenhouse Dispensary CLI
class GreenhouseDispensaryCLI {
  private db: GreenhouseDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new GreenhouseDatabase();
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
      title: "🌿 THE GREENHOUSE",
      subtitle: "Premium Cannabis Dispensary • Oklahoma City, OK",
      description: "Medical Marijuana Operations Dashboard • Powered by GenesisTrace",
      version: "v3.2.0",
      author: "OMMA Licensed Facility #OMMA-****-0420",
      width: 95,
      style: "double",
      color: ColorSystem.codes.brightGreen,
    });
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" MAIN MENU", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightGreen));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "📊 View Dashboard", value: "📊 View Dashboard" },
        { label: "🌱 Check Product Inventory", value: "🌱 Check Product Inventory" },
        { label: "🛍️ View Transactions", value: "🛍️ View Transactions" },
        { label: "👥 Budtender Status", value: "👥 Budtender Status" },
        { label: "➕ New Customer Order", value: "➕ New Customer Order" },
        { label: "📈 Revenue & Analytics", value: "📈 Revenue & Analytics" },
        { label: "⚖️ Compliance Report", value: "⚖️ Compliance Report" },
        { label: "🚪 Exit", value: "🚪 Exit" },
      ],
    );
  }

  private async viewDashboard() {
    this.logger.info("Loading dispensary dashboard...");

    const spinner = new Spinner({ message: "Fetching real-time data..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Dashboard ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" LIVE OPERATIONS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightCyan));
    console.log("");

    // Current time and dispensary status
    const now = new Date();
    BoxRenderer.render(
      [
        `Current Time: ${now.toLocaleTimeString()}`,
        `Date: ${now.toLocaleDateString()}`,
        `Status: ${ColorSystem.colorize("OPEN", ColorSystem.codes.brightGreen)} (9:00 AM - 9:00 PM)`,
        `Active Budtenders: ${this.db.getBudtenders().filter(b => b.status === "Busy").length}/${this.db.getBudtenders().length}`,
        `Waiting Customers: ${this.db.getTransactions().filter(t => t.status === "Pending").length}`,
      ],
      {
        title: "Dispensary Status",
        style: "rounded",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("");

    // Transaction queue summary
    const transactions = this.db.getTransactions();
    const pending = transactions.filter(t => t.status === "Pending").length;
    const inProgress = transactions.filter(t => t.status === "In Progress").length;
    const completed = transactions.filter(t => t.status === "Completed").length;

    console.log(ColorSystem.colorize("Transaction Queue Overview:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Pending", value: pending },
        { label: "In Progress", value: inProgress },
        { label: "Completed", value: completed },
      ],
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightGreen
      },
    );

    console.log("");

    // Revenue snapshot
    const stats = this.db.getRevenueStats();
    BoxRenderer.render(
      [
        `Today's Revenue: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `Completed Transactions: ${ColorSystem.colorize(String(stats.completedTransactions), ColorSystem.codes.brightCyan)}`,
        `Average Transaction: ${Formatter.currency(stats.avgTransaction)}`,
        `Pending Revenue: ${Formatter.currency(stats.pendingRevenue)}`,
        `Loyalty Points Issued: ${ColorSystem.colorize(String(stats.totalLoyaltyPoints), ColorSystem.codes.brightYellow)}`,
      ],
      {
        title: "💰 Revenue Summary",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    console.log("");

    // Top selling categories
    const categoryBreakdown = this.db.getCategoryBreakdown();
    const topCategories = Object.entries(categoryBreakdown)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 3);

    console.log(ColorSystem.colorize("Top Selling Categories Today:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      topCategories.map(([category, data]) => ({
        label: category,
        value: Math.round(data.revenue),
      })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightMagenta
      },
    );

    this.logger.success("Dashboard loaded successfully");
  }

  private async viewInventory() {
    this.logger.info("Loading product inventory...");

    const spinner = new Spinner({ message: "Checking stock levels..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Inventory loaded");

    const inventory = this.db.getInventory();

    console.log("");
    console.log(ColorSystem.colorize(`Product Inventory (${inventory.length} products):`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      inventory,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "name", label: "Product", width: 20 },
        { key: "brand", label: "Brand", width: 16 },
        { key: "category", label: "Category", width: 11 },
        { key: "strain", label: "Type", width: 7 },
        {
          key: "thcPercent",
          label: "THC%",
          width: 7,
          align: "right",
          formatter: (val: number) => val > 0 ? `${val.toFixed(1)}%` : "-",
        },
        {
          key: "quantity",
          label: "Stock",
          width: 8,
          align: "right",
          formatter: (qty: number) => {
            if (qty < 20) return ColorSystem.colorize(String(qty), ColorSystem.codes.red);
            if (qty < 50) return ColorSystem.colorize(String(qty), ColorSystem.codes.yellow);
            return ColorSystem.colorize(String(qty), ColorSystem.codes.green);
          }
        },
        {
          key: "pricePerUnit",
          label: "Price",
          width: 10,
          align: "right",
          formatter: (price: number) => Formatter.currency(price),
        },
      ],
      { showIndex: false },
    );

    // Low stock warning
    const lowStock = inventory.filter(p => p.quantity < 30);
    if (lowStock.length > 0) {
      console.log("");
      BoxRenderer.render(
        [
          "⚠️  Low Stock Alert - Reorder Needed",
          "",
          ...lowStock.map(p => `${p.name} (${p.brand}): Only ${p.quantity} ${p.unit}(s) remaining`),
        ],
        {
          title: "Inventory Warning",
          style: "bold",
          color: ColorSystem.codes.yellow,
          padding: 1,
        },
      );
    }

    // Category distribution
    console.log("");
    const categoryCount: Record<string, number> = {};
    inventory.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });

    console.log(ColorSystem.colorize("Inventory by Category:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(categoryCount).map(([category, count]) => ({
        label: category,
        value: count,
      })),
      {
        showValues: true,
        width: 30,
        color: ColorSystem.codes.brightGreen
      },
    );

    this.logger.success(`Displayed ${inventory.length} products`);
  }

  private async viewTransactions() {
    this.logger.info("Loading customer transactions...");

    const spinner = new Spinner({ message: "Fetching transaction history..." });
    spinner.start();
    await sleep(700);
    spinner.succeed("Transactions loaded");

    const transactions = this.db.getTransactions();

    console.log("");
    console.log(ColorSystem.colorize(`Customer Transactions (${transactions.length} total):`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      transactions,
      [
        { key: "transactionId", label: "Trans #", width: 8, align: "right" },
        { key: "customer", label: "Customer", width: 14 },
        { key: "medicalCard", label: "Med Card", width: 18 },
        { key: "budtender", label: "Budtender", width: 16 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            if (status === "Completed") return ColorSystem.colorize(status, ColorSystem.codes.green);
            if (status === "In Progress") return ColorSystem.colorize(status, ColorSystem.codes.yellow);
            if (status === "Cancelled") return ColorSystem.colorize(status, ColorSystem.codes.red);
            return ColorSystem.colorize(status, ColorSystem.codes.cyan);
          }
        },
        {
          key: "total",
          label: "Total",
          width: 10,
          align: "right",
          formatter: (price: number) => Formatter.currency(price),
        },
        {
          key: "loyaltyPoints",
          label: "Points",
          width: 7,
          align: "right",
          formatter: (points: number) => ColorSystem.colorize(String(points), ColorSystem.codes.brightYellow),
        },
      ],
      { showIndex: false },
    );

    this.logger.success(`Displayed ${transactions.length} transactions`);
  }

  private async viewBudtenders() {
    this.logger.info("Checking budtender status...");

    const spinner = new Spinner({ message: "Loading staff information..." });
    spinner.start();
    await sleep(600);
    spinner.succeed("Budtender data loaded");

    const budtenders = this.db.getBudtenders();

    console.log("");
    console.log(ColorSystem.colorize("Budtender Status:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      budtenders,
      [
        { key: "name", label: "Budtender", width: 18 },
        {
          key: "certificationLevel",
          label: "Level",
          width: 8,
          formatter: (level: string) => {
            if (level === "Lead") return ColorSystem.colorize(level, ColorSystem.codes.brightYellow);
            if (level === "Senior") return ColorSystem.colorize(level, ColorSystem.codes.brightCyan);
            return ColorSystem.colorize(level, ColorSystem.codes.white);
          }
        },
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
          key: "currentTransaction",
          label: "Current Trans",
          width: 14,
          align: "center",
          formatter: (id: number | null) => id ? `#${id}` : "-",
        },
        {
          key: "transactionsToday",
          label: "Trans Today",
          width: 12,
          align: "right",
        },
        {
          key: "salesTotal",
          label: "Sales Total",
          width: 12,
          align: "right",
          formatter: (amount: number) => Formatter.currency(amount),
        },
      ],
      { showIndex: false },
    );

    console.log("");

    // Budtender performance
    const totalSales = budtenders.reduce((sum, b) => sum + b.salesTotal, 0);
    console.log(ColorSystem.colorize("Sales Performance Today:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      budtenders.map(b => ({
        label: b.name.split(" ")[0],
        value: Math.round(b.salesTotal),
      })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen
      },
    );

    console.log("");
    BoxRenderer.render(
      [
        `Total Sales Today: ${ColorSystem.colorize(Formatter.currency(totalSales), ColorSystem.codes.brightGreen)}`,
        `Average per Budtender: ${Formatter.currency(totalSales / budtenders.length)}`,
        `Available Staff: ${budtenders.filter(b => b.status === "Available").length}/${budtenders.length}`,
        `Total Transactions: ${budtenders.reduce((sum, b) => sum + b.transactionsToday, 0)}`,
      ],
      {
        title: "Team Performance",
        style: "rounded",
        color: ColorSystem.codes.brightBlue,
        padding: 1,
      },
    );

    this.logger.success("Budtender status displayed");
  }

  private async createOrder() {
    console.log("");
    BoxRenderer.render(
      [
        "Create a new customer order.",
        "",
        "Please provide the following information:",
      ],
      {
        title: "➕ New Customer Order",
        style: "rounded",
        color: ColorSystem.codes.green
      },
    );
    console.log("");

    // Customer name
    const customer = await InteractivePrompts.input("Customer Name (First Name + Last Initial):");
    if (!customer) {
      BoxRenderer.message("Customer name is required", "error");
      return;
    }

    // Medical card
    const medicalCard = await InteractivePrompts.input("Medical Card # (OK-MM-****XXXX):");
    if (!medicalCard) {
      BoxRenderer.message("Medical card number is required", "error");
      return;
    }

    // Select budtender
    const availableBudtenders = this.db.getBudtenders().filter(b => b.status === "Available");
    if (availableBudtenders.length === 0) {
      BoxRenderer.message("No budtenders available. Please wait.", "warning");
      return;
    }

    const budtender = await InteractivePrompts.select(
      "Select available budtender:",
      availableBudtenders.map(b => ({
        label: `${b.name} (${b.certificationLevel})`,
        value: b.name,
      })),
    );

    // Product selection (simplified - in real app would be multi-select)
    const inventory = this.db.getInventory();
    console.log("");
    console.log(ColorSystem.colorize("Available Products:", ColorSystem.codes.bright));
    console.log("");

    // Show simplified product list
    inventory.slice(0, 5).forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.brand} (${p.category}) - ${Formatter.currency(p.pricePerUnit)}/${p.unit}`);
    });

    console.log("");
    const productChoice = await InteractivePrompts.input("Enter product ID:");
    const productId = parseInt(productChoice);

    const selectedProduct = this.db.getProductById(productId);
    if (!selectedProduct) {
      BoxRenderer.message("Invalid product ID", "error");
      return;
    }

    const quantityStr = await InteractivePrompts.input(`Quantity (${selectedProduct.unit}s):`);
    const quantity = parseInt(quantityStr);

    if (isNaN(quantity) || quantity <= 0) {
      BoxRenderer.message("Invalid quantity", "error");
      return;
    }

    if (selectedProduct.quantity < quantity) {
      BoxRenderer.message(`Insufficient inventory. Only ${selectedProduct.quantity} ${selectedProduct.unit}(s) available`, "error");
      return;
    }

    const total = selectedProduct.pricePerUnit * quantity;
    const loyaltyPoints = Math.floor(total / 10);

    console.log("");
    BoxRenderer.render(
      [
        `Customer: ${customer}`,
        `Medical Card: ${medicalCard}`,
        `Budtender: ${budtender}`,
        `Product: ${selectedProduct.name} (${selectedProduct.brand})`,
        `Quantity: ${quantity} ${selectedProduct.unit}(s)`,
        `Total: ${Formatter.currency(total)}`,
        `Loyalty Points: ${loyaltyPoints}`,
      ],
      {
        title: "Order Summary",
        style: "single",
        color: ColorSystem.codes.cyan,
      },
    );

    const confirm = await InteractivePrompts.confirm(
      "Complete this transaction?",
      true,
    );

    if (!confirm) {
      BoxRenderer.message("Transaction cancelled", "info");
      return;
    }

    const spinner = new Spinner({ message: "Processing transaction..." });
    spinner.start();
    await sleep(1500);

    const newTransaction = this.db.addTransaction({
      customer,
      medicalCard,
      products: [{ productId, quantity }],
      budtender,
      status: "Completed",
      total,
      loyaltyPoints,
    });

    this.db.reduceInventory(productId, quantity);

    spinner.succeed("Transaction completed successfully!");

    console.log("");
    BoxRenderer.render(
      [
        `Transaction #: ${ColorSystem.colorize(`#${newTransaction.transactionId}`, ColorSystem.codes.brightYellow)}`,
        `Customer: ${newTransaction.customer}`,
        `Total: ${ColorSystem.colorize(Formatter.currency(newTransaction.total), ColorSystem.codes.brightGreen)}`,
        `Loyalty Points Earned: ${ColorSystem.colorize(String(newTransaction.loyaltyPoints), ColorSystem.codes.brightYellow)}`,
        "",
        "Receipt printed. Have a great day!",
      ],
      {
        title: "✅ Transaction Complete",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    this.logger.success(`Completed transaction #${newTransaction.transactionId} for ${customer}`);
  }

  private async viewRevenueAnalytics() {
    this.logger.info("Generating revenue analytics...");

    const spinner = new Spinner({ message: "Calculating metrics..." });
    spinner.start();
    await sleep(1200);
    spinner.succeed("Analytics ready");

    const stats = this.db.getRevenueStats();
    const transactions = this.db.getTransactions();
    const categoryBreakdown = this.db.getCategoryBreakdown();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" REVENUE ANALYTICS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightGreen));
    console.log("");

    // Revenue summary
    BoxRenderer.render(
      [
        `Today's Revenue: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue), ColorSystem.codes.brightGreen)}`,
        `Completed Transactions: ${ColorSystem.colorize(String(stats.completedTransactions), ColorSystem.codes.brightCyan)}`,
        `Average Transaction: ${Formatter.currency(stats.avgTransaction)}`,
        `Pending Revenue: ${Formatter.currency(stats.pendingRevenue)}`,
        "",
        `Projected Daily Total: ${ColorSystem.colorize(Formatter.currency(stats.totalRevenue + stats.pendingRevenue), ColorSystem.codes.brightYellow)}`,
        `Loyalty Points Issued: ${ColorSystem.colorize(String(stats.totalLoyaltyPoints), ColorSystem.codes.brightYellow)}`,
      ],
      {
        title: "💰 Revenue Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    console.log("");

    // Category breakdown
    console.log(ColorSystem.colorize("Revenue by Product Category:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(categoryBreakdown).map(([category, data]) => ({
        label: category,
        value: Math.round(data.revenue),
      })),
      {
        showValues: true,
        width: 45,
        color: ColorSystem.codes.brightGreen
      },
    );

    console.log("");

    // Hourly revenue trend (simulated)
    const hourlyRevenue = [85, 120, 95, 180, 210, 165, 195, 240, 220, 185];
    console.log(ColorSystem.colorize("Hourly Revenue Trend:", ColorSystem.codes.bright));
    console.log(
      `${ColorSystem.codes.brightGreen}${ChartRenderer.sparkline(hourlyRevenue)}${ColorSystem.codes.reset}  ${Formatter.currency(hourlyRevenue[hourlyRevenue.length - 1])} (current hour)`,
    );

    console.log("");

    // Key metrics table
    TableRenderer.render(
      [
        { metric: "Transactions Today", value: transactions.length, target: 50, status: "On Track" },
        { metric: "Avg Transaction Size", value: Math.round(stats.avgTransaction), target: 75, status: "Excellent" },
        { metric: "Customer Satisfaction", value: 97, target: 90, status: "Excellent" },
        { metric: "Inventory Turnover", value: 82, target: 75, status: "Excellent" },
        { metric: "Budtender Efficiency", value: 94, target: 85, status: "Excellent" },
      ],
      [
        { key: "metric", label: "Metric", width: 24 },
        { key: "value", label: "Current", width: 12, align: "right" },
        { key: "target", label: "Target", width: 12, align: "right" },
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

  private async viewComplianceReport() {
    this.logger.info("Generating compliance report...");

    const spinner = new Spinner({ message: "Checking OMMA compliance..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Compliance data ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" OMMA COMPLIANCE REPORT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(75), ColorSystem.codes.brightYellow));
    console.log("");

    BoxRenderer.render(
      [
        `Facility License: ${ColorSystem.colorize("OMMA-DISP-2024-0420", ColorSystem.codes.brightCyan)}`,
        `License Status: ${ColorSystem.colorize("ACTIVE", ColorSystem.codes.brightGreen)}`,
        `Expiration Date: ${ColorSystem.colorize("December 31, 2025", ColorSystem.codes.brightYellow)}`,
        `License Type: Medical Marijuana Dispensary`,
        `Address: 123 N Walker Ave, Oklahoma City, OK 73102`,
      ],
      {
        title: "🏛️ License Information",
        style: "double",
        color: ColorSystem.codes.brightYellow,
        padding: 1,
      },
    );

    console.log("");

    // Daily limits compliance
    console.log(ColorSystem.colorize("Patient Daily Purchase Limits (OMMA Regulations):", ColorSystem.codes.bright));
    console.log("");

    const limits = [
      { category: "Flower", limit: 84, used: 21, unit: "grams" },
      { category: "Concentrates", limit: 28, used: 5, unit: "grams" },
      { category: "Edibles", limit: 2016, used: 450, unit: "mg THC" },
    ];

    limits.forEach(item => {
      const percentage = (item.used / item.limit) * 100;
      console.log(`${item.category} (${item.unit}):`);
      const progress = new ProgressBar({
        total: item.limit,
        width: 50,
        completeChar: "█",
        incompleteChar: "░",
      });

      // Show progress
      for (let i = 0; i <= item.used; i += Math.ceil(item.used / 10)) {
        progress.update(i);
      }
      progress.update(item.used);

      console.log(`  ${item.used}/${item.limit} ${item.unit} (${percentage.toFixed(1)}%)`);
      console.log("");
    });

    // Compliance checklist
    console.log("");
    BoxRenderer.render(
      [
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} All budtenders have valid OMMA badges`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Security cameras operational (24/7 recording)`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Daily Metrc reporting up to date`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Patient verification system functional`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Product testing certificates on file`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Inventory tracking compliant`,
        `${ColorSystem.colorize("✓", ColorSystem.codes.brightGreen)} Exit packaging meets child-resistant requirements`,
        `${ColorSystem.colorize("!", ColorSystem.codes.brightYellow)} Quarterly OMMA inspection due in 14 days`,
      ],
      {
        title: "✅ Compliance Checklist",
        style: "rounded",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    console.log("");

    // Recent audit results
    TableRenderer.render(
      [
        { date: "2025-09-15", inspector: "OMMA Inspector J. Smith", category: "Security", result: "Pass", score: 100 },
        { date: "2025-09-15", inspector: "OMMA Inspector J. Smith", category: "Record Keeping", result: "Pass", score: 98 },
        { date: "2025-09-15", inspector: "OMMA Inspector J. Smith", category: "Product Testing", result: "Pass", score: 100 },
        { date: "2025-09-15", inspector: "OMMA Inspector J. Smith", category: "Inventory Control", result: "Pass", score: 97 },
      ],
      [
        { key: "date", label: "Audit Date", width: 14 },
        { key: "inspector", label: "Inspector", width: 24 },
        { key: "category", label: "Category", width: 18 },
        {
          key: "result",
          label: "Result",
          width: 8,
          formatter: (result: string) => ColorSystem.colorize(result, ColorSystem.codes.brightGreen),
        },
        {
          key: "score",
          label: "Score",
          width: 8,
          align: "right",
          formatter: (score: number) => `${score}%`,
        },
      ],
      { showIndex: false },
    );

    this.logger.success("Compliance report generated");
  }

  async run() {
    this.showBanner();

    BoxRenderer.render(
      [
        "Welcome to The Greenhouse Dispensary Management System!",
        "",
        "Oklahoma's premier medical marijuana dispensary serving patients",
        "with the highest quality cannabis products and professional service.",
        "",
        `Current Time: ${new Date().toLocaleTimeString()}`,
        "OMMA Licensed • Lab Tested • Child-Resistant Packaging",
      ],
      {
        title: "🏁 Welcome",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      },
    );

    console.log("");
    this.logger.info("The Greenhouse Management System initialized");
    await InteractivePrompts.confirm("Press Enter to continue...", true);

    while (this.running) {
      console.log("\n");
      const choice = await this.showMainMenu();

      console.log("");

      switch (choice) {
        case "📊 View Dashboard":
          await this.viewDashboard();
          break;
        case "🌱 Check Product Inventory":
          await this.viewInventory();
          break;
        case "🛍️ View Transactions":
          await this.viewTransactions();
          break;
        case "👥 Budtender Status":
          await this.viewBudtenders();
          break;
        case "➕ New Customer Order":
          await this.createOrder();
          break;
        case "📈 Revenue & Analytics":
          await this.viewRevenueAnalytics();
          break;
        case "⚖️ Compliance Report":
          await this.viewComplianceReport();
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
        "Thank you for using The Greenhouse Management System!",
        "",
        `Session ended at ${new Date().toLocaleTimeString()}`,
        "Stay compliant and have a great day! 🌿",
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
  const cli = new GreenhouseDispensaryCLI();
  await cli.run();
}
