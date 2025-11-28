#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma City Cannabis Dispensary - Real-Time Operations Dashboard
 *
 * A sophisticated real-time monitoring and management system for cannabis
 * dispensaries in Oklahoma City, featuring:
 *
 * • Live transaction monitoring with real-time updates
 * • Animated metrics and performance indicators
 * • Interactive sales analytics dashboard
 * • OMMA compliance monitoring
 * • Live inventory tracking with alerts
 * • Real-time budtender performance metrics
 * • Customer flow analytics
 * • Revenue streams visualization
 *
 * Powered by GenesisTrace with animation effects and live data streaming
 */

import {
  AnimationLoop,
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  InteractivePrompts,
  Logger,
  MatrixRainAnimation,
  neonTheme,
  ProgressBar,
  PulseAnimation,
  RainbowAnimation,
  Spinner,
  TableRenderer,
  WaveAnimation,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// Data Models
// ============================================================================

interface Product {
  id: number;
  name: string;
  brand: string;
  category: "Flower" | "Concentrate" | "Edible" | "Vape" | "Topical" | "Pre-Roll";
  thcPercent: number;
  cbdPercent: number;
  strain: "Indica" | "Sativa" | "Hybrid";
  quantity: number;
  pricePerUnit: number;
  unit: "gram" | "unit" | "oz";
  reorderPoint: number;
  supplier: string;
}

interface Transaction {
  id: number;
  customerId: string;
  customerName: string;
  medicalCardId: string;
  products: Array<{ productId: number; quantity: number; price: number }>;
  budtenderId: number;
  budtenderName: string;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: "Cash" | "Debit" | "Credit";
  loyaltyPoints: number;
  timestamp: Date;
  processingTime?: number; // in seconds
}

interface Budtender {
  id: number;
  name: string;
  status: "Available" | "Busy" | "Break" | "Offline";
  currentTransactionId: number | null;
  transactionsToday: number;
  salesTotal: number;
  avgTransactionTime: number; // seconds
  customerRating: number; // 1-5
  certificationLevel: "Entry" | "Senior" | "Lead" | "Master";
  hoursWorked: number;
  shifStartTime: Date;
}

interface DailyMetrics {
  totalRevenue: number;
  totalTransactions: number;
  avgTransactionValue: number;
  customersServed: number;
  peakHour: number;
  inventoryValue: number;
  taxCollected: number;
  loyaltyPointsIssued: number;
  topSellingCategory: string;
  topSellingProduct: string;
}

interface LiveAlert {
  id: number;
  type: "info" | "warning" | "critical" | "success";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// ============================================================================
// Real-Time Data Engine
// ============================================================================

class RealtimeDataEngine {
  private products: Product[] = [];
  private transactions: Transaction[] = [];
  private budtenders: Budtender[] = [];
  private alerts: LiveAlert[] = [];
  private nextTransactionId = 1000;
  private nextAlertId = 1;
  private isRunning = false;
  private updateCallbacks: Array<() => void> = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize products
    this.products = [
      { id: 1, name: "Purple Haze", brand: "OKind Premium", category: "Flower", thcPercent: 28.5, cbdPercent: 0.3, strain: "Sativa", quantity: 156, pricePerUnit: 12, unit: "gram", reorderPoint: 50, supplier: "Green Valley Farms" },
      { id: 2, name: "Blue Dream", brand: "Craft Cannabis Co", category: "Flower", thcPercent: 24.2, cbdPercent: 0.5, strain: "Hybrid", quantity: 203, pricePerUnit: 10, unit: "gram", reorderPoint: 75, supplier: "Oklahoma Organics" },
      { id: 3, name: "OG Kush", brand: "Green Valley", category: "Flower", thcPercent: 26.8, cbdPercent: 0.2, strain: "Indica", quantity: 178, pricePerUnit: 11, unit: "gram", reorderPoint: 60, supplier: "Green Valley Farms" },
      { id: 4, name: "Live Resin Cart", brand: "Apothecary", category: "Vape", thcPercent: 89.5, cbdPercent: 0.1, strain: "Hybrid", quantity: 87, pricePerUnit: 35, unit: "unit", reorderPoint: 30, supplier: "Apothecary Labs" },
      { id: 5, name: "Gummies 10mg", brand: "Korova", category: "Edible", thcPercent: 0, cbdPercent: 0, strain: "Hybrid", quantity: 124, pricePerUnit: 25, unit: "unit", reorderPoint: 40, supplier: "Korova Edibles" },
      { id: 6, name: "Diamond Shatter", brand: "Cicada Labs", category: "Concentrate", thcPercent: 92.3, cbdPercent: 0.1, strain: "Indica", quantity: 45, pricePerUnit: 40, unit: "gram", reorderPoint: 20, supplier: "Cicada Labs" },
      { id: 7, name: "CBD Relief Balm", brand: "Mary's Medicinals", category: "Topical", thcPercent: 0, cbdPercent: 95.0, strain: "Hybrid", quantity: 67, pricePerUnit: 45, unit: "unit", reorderPoint: 25, supplier: "Mary's Medicinals" },
      { id: 8, name: "Sunset Sherbet Pre-Roll", brand: "Sublime", category: "Pre-Roll", thcPercent: 22.1, cbdPercent: 0.4, strain: "Indica", quantity: 145, pricePerUnit: 8, unit: "unit", reorderPoint: 50, supplier: "Sublime Cannabis" },
      { id: 9, name: "Jack Herer", brand: "Craft Cannabis Co", category: "Flower", thcPercent: 23.5, cbdPercent: 0.6, strain: "Sativa", quantity: 189, pricePerUnit: 11, unit: "gram", reorderPoint: 70, supplier: "Oklahoma Organics" },
      { id: 10, name: "RSO Syringe", brand: "Green Hornet", category: "Concentrate", thcPercent: 85.0, cbdPercent: 1.2, strain: "Hybrid", quantity: 34, pricePerUnit: 60, unit: "unit", reorderPoint: 15, supplier: "Green Hornet" },
      { id: 11, name: "Sour Diesel", brand: "OKind Premium", category: "Flower", thcPercent: 25.8, cbdPercent: 0.4, strain: "Sativa", quantity: 167, pricePerUnit: 12, unit: "gram", reorderPoint: 60, supplier: "Green Valley Farms" },
      { id: 12, name: "Distillate Cart", brand: "Sunday Extracts", category: "Vape", thcPercent: 91.2, cbdPercent: 0.2, strain: "Hybrid", quantity: 92, pricePerUnit: 30, unit: "unit", reorderPoint: 35, supplier: "Sunday Extracts" },
    ];

    // Initialize budtenders
    this.budtenders = [
      { id: 1, name: "Jordan Williams", status: "Busy", currentTransactionId: null, transactionsToday: 28, salesTotal: 3456.78, avgTransactionTime: 245, customerRating: 4.9, certificationLevel: "Master", hoursWorked: 6.5, shifStartTime: new Date(Date.now() - 6.5 * 3600000) },
      { id: 2, name: "Taylor Martinez", status: "Available", currentTransactionId: null, transactionsToday: 24, salesTotal: 2987.45, avgTransactionTime: 210, customerRating: 4.8, certificationLevel: "Lead", hoursWorked: 6.5, shifStartTime: new Date(Date.now() - 6.5 * 3600000) },
      { id: 3, name: "Alex Chen", status: "Busy", currentTransactionId: null, transactionsToday: 26, salesTotal: 3124.90, avgTransactionTime: 198, customerRating: 4.9, certificationLevel: "Lead", hoursWorked: 6.5, shifStartTime: new Date(Date.now() - 6.5 * 3600000) },
      { id: 4, name: "Casey Johnson", status: "Available", currentTransactionId: null, transactionsToday: 19, salesTotal: 2345.67, avgTransactionTime: 267, customerRating: 4.6, certificationLevel: "Senior", hoursWorked: 6.5, shifStartTime: new Date(Date.now() - 6.5 * 3600000) },
      { id: 5, name: "Morgan Davis", status: "Break", currentTransactionId: null, transactionsToday: 22, salesTotal: 2678.34, avgTransactionTime: 223, customerRating: 4.7, certificationLevel: "Senior", hoursWorked: 6.5, shifStartTime: new Date(Date.now() - 6.5 * 3600000) },
      { id: 6, name: "Riley Parker", status: "Available", currentTransactionId: null, transactionsToday: 15, salesTotal: 1876.23, avgTransactionTime: 289, customerRating: 4.5, certificationLevel: "Entry", hoursWorked: 4.0, shifStartTime: new Date(Date.now() - 4.0 * 3600000) },
    ];

    // Create some initial completed transactions
    for (let i = 0; i < 15; i++) {
      this.generateRandomTransaction("Completed");
    }
  }

  private generateRandomTransaction(status: Transaction["status"] = "Completed"): Transaction {
    const budtender = this.budtenders[Math.floor(Math.random() * this.budtenders.length)];
    const numProducts = Math.floor(Math.random() * 3) + 1;
    const products: Array<{ productId: number; quantity: number; price: number }> = [];
    let subtotal = 0;

    for (let i = 0; i < numProducts; i++) {
      const product = this.products[Math.floor(Math.random() * this.products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = product.pricePerUnit * quantity;
      products.push({ productId: product.id, quantity, price });
      subtotal += price;
    }

    const tax = subtotal * 0.0925; // Oklahoma sales tax + excise tax
    const total = subtotal + tax;
    const loyaltyPoints = Math.floor(total / 10);

    const transaction: Transaction = {
      id: this.nextTransactionId++,
      customerId: `CUST-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
      customerName: this.generateCustomerName(),
      medicalCardId: `OK-MM-${Math.floor(Math.random() * 100000).toString().padStart(5, "0")}`,
      products,
      budtenderId: budtender.id,
      budtenderName: budtender.name,
      status,
      subtotal,
      tax,
      total,
      paymentMethod: ["Cash", "Debit", "Credit"][Math.floor(Math.random() * 3)] as Transaction["paymentMethod"],
      loyaltyPoints,
      timestamp: new Date(Date.now() - Math.random() * 3600000 * 6),
      processingTime: status === "Completed" ? Math.floor(Math.random() * 300) + 60 : undefined,
    };

    return transaction;
  }

  private generateCustomerName(): string {
    const firstNames = ["Sarah", "Michael", "Emily", "David", "Jessica", "James", "Ashley", "Chris", "Amanda", "John"];
    const lastInitials = ["M", "P", "R", "S", "T", "W", "B", "C", "D", "H"];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastInitials[Math.floor(Math.random() * lastInitials.length)]}.`;
  }

  private addAlert(type: LiveAlert["type"], message: string) {
    this.alerts.unshift({
      id: this.nextAlertId++,
      type,
      message,
      timestamp: new Date(),
      acknowledged: false,
    });

    // Keep only last 20 alerts
    if (this.alerts.length > 20) {
      this.alerts = this.alerts.slice(0, 20);
    }

    this.notifyUpdate();
  }

  private notifyUpdate() {
    this.updateCallbacks.forEach(callback => callback());
  }

  onUpdate(callback: () => void) {
    this.updateCallbacks.push(callback);
  }

  // Simulate real-time activity
  startRealtimeSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Simulate new transactions every 10-30 seconds
    setInterval(() => {
      if (Math.random() > 0.5) {
        const transaction = this.generateRandomTransaction(Math.random() > 0.3 ? "Completed" : "Processing");
        this.transactions.push(transaction);

        if (transaction.status === "Completed") {
          // Update budtender stats
          const budtender = this.budtenders.find(b => b.id === transaction.budtenderId);
          if (budtender) {
            budtender.transactionsToday++;
            budtender.salesTotal += transaction.total;
          }

          // Reduce inventory
          transaction.products.forEach(p => {
            const product = this.products.find(prod => prod.id === p.productId);
            if (product) {
              product.quantity -= p.quantity;
            }
          });

          this.addAlert("success", `Transaction #${transaction.id} completed - ${Formatter.currency(transaction.total)} - ${transaction.budtenderName}`);
        } else {
          this.addAlert("info", `New transaction #${transaction.id} processing - ${transaction.customerName}`);
        }

        this.notifyUpdate();
      }
    }, 15000 + Math.random() * 15000);

    // Simulate budtender status changes
    setInterval(() => {
      const budtender = this.budtenders[Math.floor(Math.random() * this.budtenders.length)];
      const statuses: Budtender["status"][] = ["Available", "Busy", "Break"];
      const newStatus = statuses[Math.floor(Math.random() * statuses.length)];

      if (budtender.status !== newStatus) {
        budtender.status = newStatus;
        this.notifyUpdate();
      }
    }, 20000);

    // Simulate low inventory alerts
    setInterval(() => {
      const lowStockProducts = this.products.filter(p => p.quantity < p.reorderPoint && p.quantity > 0);
      if (lowStockProducts.length > 0) {
        const product = lowStockProducts[Math.floor(Math.random() * lowStockProducts.length)];
        this.addAlert("warning", `Low stock alert: ${product.name} (${product.quantity} ${product.unit}s remaining)`);
      }
    }, 45000);

    // Simulate customer flow metrics
    setInterval(() => {
      const customersWaiting = Math.floor(Math.random() * 5);
      if (customersWaiting > 3) {
        this.addAlert("warning", `${customersWaiting} customers waiting in queue`);
      }
    }, 30000);
  }

  stopRealtimeSimulation() {
    this.isRunning = false;
  }

  getProducts(): Product[] {
    return [...this.products];
  }

  getTransactions(): Transaction[] {
    return [...this.transactions].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getBudtenders(): Budtender[] {
    return [...this.budtenders];
  }

  getAlerts(): LiveAlert[] {
    return [...this.alerts];
  }

  getDailyMetrics(): DailyMetrics {
    const completedTransactions = this.transactions.filter(t => t.status === "Completed");
    const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.total, 0);
    const avgTransactionValue = completedTransactions.length > 0 ? totalRevenue / completedTransactions.length : 0;

    // Calculate category sales
    const categorySales: Record<string, number> = {};
    const productSales: Record<number, number> = {};

    completedTransactions.forEach(t => {
      t.products.forEach(p => {
        const product = this.products.find(prod => prod.id === p.productId);
        if (product) {
          categorySales[product.category] = (categorySales[product.category] || 0) + p.price;
          productSales[p.productId] = (productSales[p.productId] || 0) + p.price;
        }
      });
    });

    const topCategory = Object.entries(categorySales).sort((a, b) => b[1] - a[1])[0];
    const topProductId = Object.entries(productSales).sort((a, b) => b[1] - a[1])[0];
    const topProduct = topProductId ? this.products.find(p => p.id === parseInt(topProductId[0])) : null;

    return {
      totalRevenue,
      totalTransactions: completedTransactions.length,
      avgTransactionValue,
      customersServed: new Set(completedTransactions.map(t => t.customerId)).size,
      peakHour: new Date().getHours(),
      inventoryValue: this.products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0),
      taxCollected: completedTransactions.reduce((sum, t) => sum + t.tax, 0),
      loyaltyPointsIssued: completedTransactions.reduce((sum, t) => sum + t.loyaltyPoints, 0),
      topSellingCategory: topCategory ? topCategory[0] : "N/A",
      topSellingProduct: topProduct ? topProduct.name : "N/A",
    };
  }
}

// ============================================================================
// Real-Time Dashboard
// ============================================================================

class RealtimeDashboard {
  private engine: RealtimeDataEngine;
  private logger: Logger;
  private refreshInterval: number | null = null;
  private currentView: "dashboard" | "transactions" | "inventory" | "budtenders" | "analytics" = "dashboard";

  constructor() {
    this.engine = new RealtimeDataEngine();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .enableHistory(false)
        .build(),
    );
  }

  private renderHeader() {
    const now = new Date();
    console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(`  OKC CANNABIS DISPENSARY - LIVE OPERATIONS DASHBOARD  │  ${now.toLocaleString()}`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  }

  private renderMetricsBar() {
    const metrics = this.engine.getDailyMetrics();
    const budtenders = this.engine.getBudtenders();
    const alerts = this.engine.getAlerts().filter(a => !a.acknowledged);

    console.log("");
    const metricsLine = [
      `Revenue: ${ColorSystem.colorize(Formatter.currency(metrics.totalRevenue), ColorSystem.codes.brightGreen)}`,
      `Transactions: ${ColorSystem.colorize(String(metrics.totalTransactions), ColorSystem.codes.brightCyan)}`,
      `Avg Sale: ${ColorSystem.colorize(Formatter.currency(metrics.avgTransactionValue), ColorSystem.codes.brightYellow)}`,
      `Active Staff: ${budtenders.filter(b => b.status === "Busy" || b.status === "Available").length}/${budtenders.length}`,
      `Alerts: ${alerts.length > 0 ? ColorSystem.colorize(String(alerts.length), ColorSystem.codes.brightRed) : ColorSystem.colorize("0", ColorSystem.codes.green)}`,
    ].join("  │  ");

    console.log(`  ${metricsLine}`);
    console.log("");
  }

  private renderLiveTransactions() {
    const transactions = this.engine.getTransactions().slice(0, 8);

    if (transactions.length === 0) {
      console.log(ColorSystem.colorize("  No recent transactions", ColorSystem.codes.dim));
      return;
    }

    console.log(ColorSystem.colorize("  LIVE TRANSACTION FEED", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      transactions.map(t => ({
        id: `#${t.id}`,
        time: t.timestamp.toLocaleTimeString(),
        customer: t.customerName,
        budtender: t.budtenderName.split(" ")[0],
        items: t.products.length,
        total: t.total,
        status: t.status,
        payment: t.paymentMethod,
      })),
      [
        { key: "id", label: "ID", width: 8, align: "left" },
        { key: "time", label: "Time", width: 11 },
        { key: "customer", label: "Customer", width: 13 },
        { key: "budtender", label: "Staff", width: 10 },
        { key: "items", label: "Items", width: 6, align: "center" },
        {
          key: "total",
          label: "Total",
          width: 10,
          align: "right",
          formatter: (val: number) => Formatter.currency(val),
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (val: string) => {
            if (val === "Completed") return ColorSystem.colorize(val, ColorSystem.codes.brightGreen);
            if (val === "Processing") return ColorSystem.colorize(val, ColorSystem.codes.brightYellow);
            if (val === "Cancelled") return ColorSystem.colorize(val, ColorSystem.codes.red);
            return ColorSystem.colorize(val, ColorSystem.codes.cyan);
          },
        },
        { key: "payment", label: "Payment", width: 8 },
      ],
      { showIndex: false },
    );
  }

  private renderBudtenderStatus() {
    const budtenders = this.engine.getBudtenders();

    console.log("");
    console.log(ColorSystem.colorize("  BUDTENDER STATUS", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      budtenders.map(b => ({
        name: b.name,
        status: b.status,
        level: b.certificationLevel,
        transactions: b.transactionsToday,
        sales: b.salesTotal,
        avgTime: b.avgTransactionTime,
        rating: b.customerRating,
      })),
      [
        { key: "name", label: "Name", width: 18 },
        {
          key: "status",
          label: "Status",
          width: 11,
          formatter: (val: string) => {
            if (val === "Available") return ColorSystem.colorize(val, ColorSystem.codes.brightGreen);
            if (val === "Busy") return ColorSystem.colorize(val, ColorSystem.codes.brightYellow);
            if (val === "Break") return ColorSystem.colorize(val, ColorSystem.codes.cyan);
            return ColorSystem.colorize(val, ColorSystem.codes.dim);
          },
        },
        {
          key: "level",
          label: "Level",
          width: 8,
          formatter: (val: string) => {
            if (val === "Master") return ColorSystem.colorize(val, ColorSystem.codes.brightMagenta);
            if (val === "Lead") return ColorSystem.colorize(val, ColorSystem.codes.brightYellow);
            if (val === "Senior") return ColorSystem.colorize(val, ColorSystem.codes.brightCyan);
            return ColorSystem.colorize(val, ColorSystem.codes.white);
          },
        },
        { key: "transactions", label: "Trans", width: 6, align: "right" },
        {
          key: "sales",
          label: "Sales",
          width: 11,
          align: "right",
          formatter: (val: number) => Formatter.currency(val),
        },
        {
          key: "avgTime",
          label: "Avg Time",
          width: 9,
          align: "right",
          formatter: (val: number) => `${Math.floor(val / 60)}m ${val % 60}s`,
        },
        {
          key: "rating",
          label: "Rating",
          width: 7,
          align: "right",
          formatter: (val: number) => `${val.toFixed(1)} ⭐`,
        },
      ],
      { showIndex: false },
    );
  }

  private renderInventoryStatus() {
    const products = this.engine.getProducts();
    const lowStock = products.filter(p => p.quantity < p.reorderPoint);
    const outOfStock = products.filter(p => p.quantity === 0);

    console.log("");
    console.log(ColorSystem.colorize("  INVENTORY STATUS", ColorSystem.codes.bright));
    console.log("");

    // Summary metrics
    const inventoryValue = products.reduce((sum, p) => sum + (p.quantity * p.pricePerUnit), 0);
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);

    console.log(`  Total Value: ${ColorSystem.colorize(Formatter.currency(inventoryValue), ColorSystem.codes.brightGreen)}  │  Total Items: ${ColorSystem.colorize(String(totalItems), ColorSystem.codes.brightCyan)}  │  Low Stock: ${lowStock.length > 0 ? ColorSystem.colorize(String(lowStock.length), ColorSystem.codes.brightYellow) : ColorSystem.colorize("0", ColorSystem.codes.green)}  │  Out of Stock: ${outOfStock.length > 0 ? ColorSystem.colorize(String(outOfStock.length), ColorSystem.codes.brightRed) : ColorSystem.colorize("0", ColorSystem.codes.green)}`);
    console.log("");

    // Show low stock items if any
    if (lowStock.length > 0) {
      console.log(ColorSystem.colorize("  ⚠️  LOW STOCK ITEMS", ColorSystem.codes.brightYellow));
      console.log("");

      TableRenderer.render(
        lowStock.slice(0, 6).map(p => ({
          name: p.name,
          brand: p.brand,
          category: p.category,
          current: p.quantity,
          reorder: p.reorderPoint,
          unit: p.unit,
          supplier: p.supplier,
        })),
        [
          { key: "name", label: "Product", width: 20 },
          { key: "brand", label: "Brand", width: 15 },
          { key: "category", label: "Category", width: 11 },
          {
            key: "current",
            label: "Stock",
            width: 7,
            align: "right",
            formatter: (val: number) => ColorSystem.colorize(String(val), val === 0 ? ColorSystem.codes.brightRed : ColorSystem.codes.brightYellow),
          },
          { key: "reorder", label: "Reorder", width: 8, align: "right" },
          { key: "unit", label: "Unit", width: 6 },
          { key: "supplier", label: "Supplier", width: 18 },
        ],
        { showIndex: false },
      );
    } else {
      console.log(ColorSystem.colorize("  ✓ All inventory levels optimal", ColorSystem.codes.green));
    }
  }

  private renderLiveAlerts() {
    const alerts = this.engine.getAlerts().slice(0, 5);

    if (alerts.length === 0) {
      return;
    }

    console.log("");
    console.log(ColorSystem.colorize("  LIVE ALERTS", ColorSystem.codes.bright));
    console.log("");

    alerts.forEach(alert => {
      const icon = alert.type === "critical" ? "🚨" : alert.type === "warning" ? "⚠️" : alert.type === "success" ? "✓" : "ℹ️";
      const color = alert.type === "critical" ? ColorSystem.codes.brightRed : alert.type === "warning" ? ColorSystem.codes.brightYellow : alert.type === "success" ? ColorSystem.codes.brightGreen : ColorSystem.codes.brightCyan;
      const time = alert.timestamp.toLocaleTimeString();

      console.log(`  ${icon} ${ColorSystem.colorize(time, ColorSystem.codes.dim)} ${ColorSystem.colorize(alert.message, color)}`);
    });
  }

  private renderCategorySales() {
    const transactions = this.engine.getTransactions().filter(t => t.status === "Completed");
    const products = this.engine.getProducts();

    const categorySales: Record<string, number> = {};

    transactions.forEach(t => {
      t.products.forEach(p => {
        const product = products.find(prod => prod.id === p.productId);
        if (product) {
          categorySales[product.category] = (categorySales[product.category] || 0) + p.price;
        }
      });
    });

    console.log("");
    console.log(ColorSystem.colorize("  SALES BY CATEGORY", ColorSystem.codes.bright));
    console.log("");

    const sortedCategories = Object.entries(categorySales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    if (sortedCategories.length > 0) {
      ChartRenderer.barChart(
        sortedCategories.map(([category, revenue]) => ({
          label: category,
          value: Math.round(revenue),
        })),
        {
          showValues: true,
          width: 45,
          color: ColorSystem.codes.brightGreen,
        },
      );
    }
  }

  private async renderDashboard() {
    console.clear();
    this.renderHeader();
    this.renderMetricsBar();
    console.log(ColorSystem.colorize("─".repeat(100), ColorSystem.codes.dim));

    this.renderLiveTransactions();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(100), ColorSystem.codes.dim));

    this.renderBudtenderStatus();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(100), ColorSystem.codes.dim));

    this.renderInventoryStatus();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(100), ColorSystem.codes.dim));

    this.renderCategorySales();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(100), ColorSystem.codes.dim));

    this.renderLiveAlerts();
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize("  Press Ctrl+C to exit  │  Dashboard auto-refreshes every 5 seconds", ColorSystem.codes.dim));
    console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  }

  async start() {
    // Show banner
    console.clear();
    BannerRenderer.render({
      title: "🌿 REAL-TIME DISPENSARY DASHBOARD",
      subtitle: "Oklahoma City Cannabis Operations Command Center",
      description: "Live monitoring • Analytics • Compliance • Inventory Management",
      version: "v2.0.0",
      author: "OMMA Licensed Facility",
      width: 100,
      style: "double",
      color: ColorSystem.codes.brightGreen,
    });

    console.log("");
    BoxRenderer.render(
      [
        "Welcome to the Real-Time Dispensary Dashboard!",
        "",
        "This dashboard provides live monitoring of:",
        "• Transaction processing and revenue",
        "• Budtender performance metrics",
        "• Inventory levels and alerts",
        "• OMMA compliance status",
        "• Customer flow analytics",
        "",
        "Data updates automatically every 5 seconds.",
      ],
      {
        title: "System Overview",
        style: "rounded",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("");
    const spinner = new Spinner({ message: "Initializing real-time data engine..." });
    spinner.start();
    await sleep(2000);
    spinner.succeed("Real-time data engine started");

    console.log("");
    this.logger.success("Starting live dashboard feed...");
    await sleep(2000);

    // Start real-time simulation
    this.engine.startRealtimeSimulation();

    // Set up auto-refresh
    this.refreshInterval = setInterval(() => {
      this.renderDashboard();
    }, 5000);

    // Initial render
    this.renderDashboard();

    // Setup update listener
    this.engine.onUpdate(() => {
      // Dashboard will refresh on interval
    });
  }

  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.engine.stopRealtimeSimulation();
  }
}

// ============================================================================
// Main Application
// ============================================================================

async function main() {
  const dashboard = new RealtimeDashboard();

  // Handle graceful shutdown
  const handleShutdown = () => {
    console.log("\n");
    BoxRenderer.render(
      [
        "Shutting down real-time dashboard...",
        "",
        "Session ended at " + new Date().toLocaleString(),
        "Thank you for using OKC Dispensary Dashboard!",
      ],
      {
        title: "Goodbye",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      },
    );
    dashboard.stop();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", handleShutdown);
  Deno.addSignalListener("SIGTERM", handleShutdown);

  await dashboard.start();
}

// Run the application
if (import.meta.main) {
  await main();
}
