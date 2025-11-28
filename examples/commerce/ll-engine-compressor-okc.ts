#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write --allow-net

/**
 * ══════════════════════════════════════════════════════════════════════════════
 * L & L Engine & Compressor Service - Enterprise Operations Platform
 * ══════════════════════════════════════════════════════════════════════════════
 *
 * Business Profile:
 *   Company: L & L Engine & Compressor Service
 *   Location: 3605 S. Byers Ave, Oklahoma City, OK 73129
 *   Phone: 405-631-9746
 *   Industry: Building Materials Supplier & Industrial Equipment Services
 *   Services: Engine repair, compressor maintenance, parts sales, equipment rental
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ENTERPRISE PLATFORM FEATURES:
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Systems Demonstrated:
 *   1. Inventory Management - Parts & building materials tracking
 *   2. Service Department - Engine & compressor repair workflow
 *   3. Customer Relationship Management (CRM)
 *   4. Work Order System - Job tracking from quote to completion
 *   5. Equipment Rental Management
 *   6. Purchase Order & Vendor Management
 *   7. Real-Time Analytics Dashboard
 *   8. Technician Scheduling & Dispatch
 *
 * Features:
 *   • Multi-location inventory tracking
 *   • Automated reorder point alerts
 *   • Service ticket lifecycle management
 *   • Customer equipment history tracking
 *   • Labor time tracking & billing
 *   • Parts usage & cost tracking
 *   • Vendor management & procurement
 *   • Real-time performance metrics
 *   • Technician productivity monitoring
 *   • Rental equipment availability tracking
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  FileLoggerPlugin,
  Formatter,
  InteractivePrompts,
  Logger,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS - L & L Domain Models
// ═══════════════════════════════════════════════════════════════════════════════

interface Customer {
  id: string;
  name: string;
  type: "commercial" | "residential" | "contractor" | "industrial";
  phone: string;
  email?: string;
  address: string;
  since: Date;
  creditLimit: number;
  currentBalance: number;
  notes?: string;
}

interface InventoryItem {
  sku: string;
  name: string;
  category: "engine-parts" | "compressor-parts" | "building-materials" | "tools" | "supplies" | "rental-equipment";
  quantity: number;
  unit: string;
  cost: number;
  price: number;
  reorderPoint: number;
  reorderQuantity: number;
  supplier: string;
  location: string;
  lastRestocked: Date;
}

interface ServiceTicket {
  id: string;
  customerId: string;
  customerName: string;
  equipmentType: "engine" | "compressor" | "generator" | "hvac" | "other";
  equipmentMake?: string;
  equipmentModel?: string;
  equipmentSerial?: string;
  problemDescription: string;
  status: "pending" | "diagnosed" | "quoted" | "approved" | "in-progress" | "completed" | "invoiced" | "closed";
  priority: "low" | "normal" | "high" | "emergency";
  assignedTech?: string;
  createdDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  estimatedCost: number;
  actualCost: number;
  laborHours: number;
  partsUsed: Array<{ sku: string; name: string; quantity: number; cost: number }>;
  diagnosis?: string;
  workPerformed?: string;
}

interface WorkOrder {
  id: string;
  ticketId: string;
  technicianId: string;
  technicianName: string;
  startTime: Date;
  endTime?: Date;
  laborHours: number;
  status: "active" | "paused" | "completed";
  notes: string[];
}

interface Technician {
  id: string;
  name: string;
  specialization: string[];
  certifications: string[];
  hourlyRate: number;
  activeTickets: number;
  completedToday: number;
  hoursToday: number;
  status: "available" | "busy" | "break" | "off-duty";
}

interface RentalEquipment {
  id: string;
  name: string;
  category: string;
  dailyRate: number;
  weeklyRate: number;
  status: "available" | "rented" | "maintenance" | "retired";
  condition: "excellent" | "good" | "fair" | "needs-repair";
  lastService: Date;
  nextService: Date;
  currentRental?: {
    customerId: string;
    customerName: string;
    startDate: Date;
    expectedReturn: Date;
    totalCharge: number;
  };
}

interface PurchaseOrder {
  id: string;
  vendorId: string;
  vendorName: string;
  orderDate: Date;
  expectedDelivery: Date;
  status: "pending" | "ordered" | "shipped" | "received" | "cancelled";
  items: Array<{ sku: string; name: string; quantity: number; cost: number }>;
  total: number;
  receivedBy?: string;
  receivedDate?: Date;
}

// ═══════════════════════════════════════════════════════════════════════════════
// THEME - L & L Brand Colors
// ═══════════════════════════════════════════════════════════════════════════════

const llTheme = {
  name: "ll-engine",
  colors: {
    primary: ColorSystem.rgb(41, 128, 185),      // Professional Blue
    secondary: ColorSystem.rgb(52, 73, 94),      // Dark Slate
    success: ColorSystem.rgb(46, 204, 113),      // Green
    warning: ColorSystem.rgb(243, 156, 18),      // Orange
    error: ColorSystem.rgb(231, 76, 60),         // Red
    info: ColorSystem.rgb(52, 152, 219),         // Light Blue
    debug: ColorSystem.rgb(149, 165, 166),       // Gray
    critical: ColorSystem.rgb(192, 57, 43),      // Dark Red
    muted: ColorSystem.rgb(127, 140, 141),       // Muted gray
    accent: ColorSystem.rgb(155, 89, 182),       // Purple accent
  },
  symbols: {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
    debug: "●",
    critical: "⛔",
    bullet: "•",
    arrow: "→",
    check: "✓",
    cross: "✗",
  },
  boxDrawing: {
    topLeft: "╔",
    topRight: "╗",
    bottomLeft: "╚",
    bottomRight: "╝",
    horizontal: "═",
    vertical: "║",
    cross: "╬",
    teeLeft: "╠",
    teeRight: "╣",
    teeTop: "╦",
    teeBottom: "╩",
  },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DATA GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

function generateCustomers(): Customer[] {
  return [
    {
      id: "CUST-001",
      name: "Metro Construction LLC",
      type: "commercial",
      phone: "405-555-0101",
      email: "contact@metroconstruction.com",
      address: "1200 Industrial Pkwy, OKC, OK 73128",
      since: new Date(2020, 3, 15),
      creditLimit: 25000,
      currentBalance: 3450.50,
    },
    {
      id: "CUST-002",
      name: "Oklahoma Gas & Oil Services",
      type: "industrial",
      phone: "405-555-0202",
      email: "procurement@okgas.com",
      address: "4500 Energy Way, OKC, OK 73102",
      since: new Date(2018, 8, 1),
      creditLimit: 50000,
      currentBalance: 12890.00,
    },
    {
      id: "CUST-003",
      name: "John Peterson",
      type: "residential",
      phone: "405-555-0303",
      address: "789 Maple Drive, OKC, OK 73120",
      since: new Date(2022, 5, 10),
      creditLimit: 5000,
      currentBalance: 0,
    },
    {
      id: "CUST-004",
      name: "City HVAC & Mechanical",
      type: "contractor",
      phone: "405-555-0404",
      email: "service@cityhvac.com",
      address: "2300 Service Rd, OKC, OK 73135",
      since: new Date(2019, 11, 20),
      creditLimit: 15000,
      currentBalance: 4250.75,
    },
    {
      id: "CUST-005",
      name: "Devon Energy - Facilities",
      type: "industrial",
      phone: "405-555-0505",
      email: "facilities@devonenergy.com",
      address: "333 W Sheridan Ave, OKC, OK 73102",
      since: new Date(2017, 2, 5),
      creditLimit: 75000,
      currentBalance: 18500.00,
    },
  ];
}

function generateInventory(): InventoryItem[] {
  return [
    // Engine Parts
    { sku: "ENG-P001", name: "Engine Oil Filter", category: "engine-parts", quantity: 45, unit: "ea", cost: 8.50, price: 17.99, reorderPoint: 20, reorderQuantity: 50, supplier: "ACME Parts", location: "Warehouse", lastRestocked: new Date(Date.now() - 15 * 86400000) },
    { sku: "ENG-P002", name: "Spark Plug Set (8pc)", category: "engine-parts", quantity: 12, unit: "set", cost: 24.00, price: 49.99, reorderPoint: 15, reorderQuantity: 30, supplier: "ACME Parts", location: "Warehouse", lastRestocked: new Date(Date.now() - 30 * 86400000) },
    { sku: "ENG-P003", name: "Air Filter", category: "engine-parts", quantity: 28, unit: "ea", cost: 12.00, price: 24.99, reorderPoint: 15, reorderQuantity: 40, supplier: "ACME Parts", location: "Warehouse", lastRestocked: new Date(Date.now() - 20 * 86400000) },
    { sku: "ENG-P004", name: "Fuel Pump", category: "engine-parts", quantity: 8, unit: "ea", cost: 85.00, price: 175.00, reorderPoint: 5, reorderQuantity: 10, supplier: "Engine Supply Co", location: "Warehouse", lastRestocked: new Date(Date.now() - 45 * 86400000) },
    { sku: "ENG-P005", name: "Gasket Set", category: "engine-parts", quantity: 6, unit: "set", cost: 45.00, price: 95.00, reorderPoint: 10, reorderQuantity: 20, supplier: "Engine Supply Co", location: "Warehouse", lastRestocked: new Date(Date.now() - 60 * 86400000) },

    // Compressor Parts
    { sku: "CMP-P001", name: "Compressor Oil (5qt)", category: "compressor-parts", quantity: 32, unit: "jug", cost: 28.00, price: 59.99, reorderPoint: 15, reorderQuantity: 30, supplier: "Industrial Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 10 * 86400000) },
    { sku: "CMP-P002", name: "Pressure Switch", category: "compressor-parts", quantity: 8, unit: "ea", cost: 35.00, price: 74.99, reorderPoint: 8, reorderQuantity: 15, supplier: "Industrial Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 25 * 86400000) },
    { sku: "CMP-P003", name: "Air Compressor Belt", category: "compressor-parts", quantity: 15, unit: "ea", cost: 18.00, price: 38.99, reorderPoint: 10, reorderQuantity: 25, supplier: "Industrial Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 18 * 86400000) },
    { sku: "CMP-P004", name: "Check Valve", category: "compressor-parts", quantity: 5, unit: "ea", cost: 22.00, price: 47.99, reorderPoint: 8, reorderQuantity: 15, supplier: "Industrial Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 40 * 86400000) },
    { sku: "CMP-P005", name: "Intake Filter", category: "compressor-parts", quantity: 18, unit: "ea", cost: 14.00, price: 29.99, reorderPoint: 12, reorderQuantity: 30, supplier: "Industrial Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 22 * 86400000) },

    // Building Materials
    { sku: "BLD-M001", name: "2x4 Lumber (8ft)", category: "building-materials", quantity: 150, unit: "ea", cost: 4.50, price: 8.99, reorderPoint: 50, reorderQuantity: 200, supplier: "Lumber Depot", location: "Yard", lastRestocked: new Date(Date.now() - 7 * 86400000) },
    { sku: "BLD-M002", name: "Plywood 4x8 (1/2in)", category: "building-materials", quantity: 45, unit: "sheet", cost: 28.00, price: 54.99, reorderPoint: 20, reorderQuantity: 50, supplier: "Lumber Depot", location: "Yard", lastRestocked: new Date(Date.now() - 12 * 86400000) },
    { sku: "BLD-M003", name: "Concrete Mix (80lb)", category: "building-materials", quantity: 88, unit: "bag", cost: 5.50, price: 10.99, reorderPoint: 40, reorderQuantity: 100, supplier: "Builder Supply", location: "Yard", lastRestocked: new Date(Date.now() - 5 * 86400000) },
    { sku: "BLD-M004", name: "Roofing Shingles (Bundle)", category: "building-materials", quantity: 28, unit: "bundle", cost: 32.00, price: 64.99, reorderPoint: 15, reorderQuantity: 40, supplier: "Roofing Supply", location: "Yard", lastRestocked: new Date(Date.now() - 20 * 86400000) },
    { sku: "BLD-M005", name: "PVC Pipe 2in (10ft)", category: "building-materials", quantity: 65, unit: "ea", cost: 8.00, price: 16.99, reorderPoint: 30, reorderQuantity: 75, supplier: "Plumbing Supply", location: "Warehouse", lastRestocked: new Date(Date.now() - 14 * 86400000) },

    // Supplies
    { sku: "SUP-001", name: "Shop Rags (Box)", category: "supplies", quantity: 22, unit: "box", cost: 12.00, price: 24.99, reorderPoint: 10, reorderQuantity: 25, supplier: "Janitorial Supply", location: "Shop", lastRestocked: new Date(Date.now() - 8 * 86400000) },
    { sku: "SUP-002", name: "Safety Gloves (Pairs)", category: "supplies", quantity: 48, unit: "pair", cost: 3.50, price: 7.99, reorderPoint: 25, reorderQuantity: 60, supplier: "Safety Supply", location: "Shop", lastRestocked: new Date(Date.now() - 10 * 86400000) },
    { sku: "SUP-003", name: "WD-40 (16oz)", category: "supplies", quantity: 34, unit: "can", cost: 5.00, price: 10.99, reorderPoint: 20, reorderQuantity: 40, supplier: "Maintenance Supply", location: "Shop", lastRestocked: new Date(Date.now() - 16 * 86400000) },
  ];
}

function generateServiceTickets(): ServiceTicket[] {
  return [
    {
      id: "TKT-2024-001",
      customerId: "CUST-002",
      customerName: "Oklahoma Gas & Oil Services",
      equipmentType: "compressor",
      equipmentMake: "Ingersoll Rand",
      equipmentModel: "2475N7.5-P",
      equipmentSerial: "SN-882934",
      problemDescription: "Compressor not building pressure, unusual noise from pump",
      status: "in-progress",
      priority: "high",
      assignedTech: "TECH-001",
      createdDate: new Date(Date.now() - 2 * 86400000),
      scheduledDate: new Date(Date.now() - 1 * 86400000),
      estimatedCost: 450.00,
      actualCost: 385.50,
      laborHours: 3.5,
      partsUsed: [
        { sku: "CMP-P004", name: "Check Valve", quantity: 1, cost: 22.00 },
        { sku: "CMP-P002", name: "Pressure Switch", quantity: 1, cost: 35.00 },
      ],
      diagnosis: "Failed check valve preventing pressure buildup. Pressure switch also showing wear.",
      workPerformed: "Replaced check valve and pressure switch. Tested system under load for 30 minutes.",
    },
    {
      id: "TKT-2024-002",
      customerId: "CUST-001",
      customerName: "Metro Construction LLC",
      equipmentType: "engine",
      equipmentMake: "Honda",
      equipmentModel: "GX390",
      equipmentSerial: "GCAAA-1234567",
      problemDescription: "Engine running rough, black smoke from exhaust",
      status: "completed",
      priority: "normal",
      assignedTech: "TECH-002",
      createdDate: new Date(Date.now() - 5 * 86400000),
      scheduledDate: new Date(Date.now() - 4 * 86400000),
      completedDate: new Date(Date.now() - 3 * 86400000),
      estimatedCost: 320.00,
      actualCost: 298.75,
      laborHours: 2.5,
      partsUsed: [
        { sku: "ENG-P002", name: "Spark Plug Set (8pc)", quantity: 1, cost: 24.00 },
        { sku: "ENG-P003", name: "Air Filter", quantity: 1, cost: 12.00 },
      ],
      diagnosis: "Fouled spark plugs and clogged air filter causing rich fuel mixture",
      workPerformed: "Replaced all spark plugs and air filter. Adjusted carburetor. Engine runs smooth.",
    },
    {
      id: "TKT-2024-003",
      customerId: "CUST-005",
      customerName: "Devon Energy - Facilities",
      equipmentType: "generator",
      equipmentMake: "Generac",
      equipmentModel: "RG02724ANAX",
      equipmentSerial: "GEN-445821",
      problemDescription: "Emergency generator failed to start during weekly test",
      status: "quoted",
      priority: "emergency",
      assignedTech: "TECH-003",
      createdDate: new Date(),
      scheduledDate: new Date(Date.now() + 86400000),
      estimatedCost: 850.00,
      actualCost: 0,
      laborHours: 0,
      partsUsed: [],
      diagnosis: "Initial inspection suggests fuel system issue or dead battery",
    },
    {
      id: "TKT-2024-004",
      customerId: "CUST-003",
      customerName: "John Peterson",
      equipmentType: "compressor",
      equipmentMake: "Craftsman",
      equipmentModel: "919.165230",
      problemDescription: "Compressor tank pressure gauge not reading correctly",
      status: "pending",
      priority: "low",
      createdDate: new Date(Date.now() - 1 * 86400000),
      estimatedCost: 120.00,
      actualCost: 0,
      laborHours: 0,
      partsUsed: [],
    },
    {
      id: "TKT-2024-005",
      customerId: "CUST-004",
      customerName: "City HVAC & Mechanical",
      equipmentType: "compressor",
      equipmentMake: "Campbell Hausfeld",
      equipmentModel: "HL5402",
      equipmentSerial: "CH-778234",
      problemDescription: "Oil leak from compressor pump, performance degraded",
      status: "diagnosed",
      priority: "normal",
      assignedTech: "TECH-001",
      createdDate: new Date(Date.now() - 3 * 86400000),
      estimatedCost: 380.00,
      actualCost: 0,
      laborHours: 0,
      partsUsed: [],
      diagnosis: "Worn piston rings causing oil consumption and leak. Requires rebuild or replacement.",
    },
  ];
}

function generateTechnicians(): Technician[] {
  return [
    {
      id: "TECH-001",
      name: "Mike Rodriguez",
      specialization: ["compressors", "engines", "diagnostics"],
      certifications: ["ASE Master Technician", "EPA 608 Universal", "Compressor Specialist"],
      hourlyRate: 85.00,
      activeTickets: 2,
      completedToday: 1,
      hoursToday: 6.5,
      status: "busy",
    },
    {
      id: "TECH-002",
      name: "Sarah Williams",
      specialization: ["engines", "small-equipment", "generators"],
      certifications: ["ASE Certified", "Small Engine Specialist"],
      hourlyRate: 75.00,
      activeTickets: 1,
      completedToday: 2,
      hoursToday: 7.0,
      status: "busy",
    },
    {
      id: "TECH-003",
      name: "David Chen",
      specialization: ["generators", "industrial-equipment", "hvac"],
      certifications: ["Master Electrician", "Generator Service Professional", "HVAC Excellence"],
      hourlyRate: 95.00,
      activeTickets: 0,
      completedToday: 0,
      hoursToday: 2.5,
      status: "available",
    },
    {
      id: "TECH-004",
      name: "James Thompson",
      specialization: ["engines", "compressors", "welding"],
      certifications: ["ASE Certified", "Certified Welder"],
      hourlyRate: 80.00,
      activeTickets: 1,
      completedToday: 1,
      hoursToday: 5.0,
      status: "break",
    },
  ];
}

function generateRentalEquipment(): RentalEquipment[] {
  return [
    {
      id: "RENT-001",
      name: "Air Compressor 5HP 60gal",
      category: "compressors",
      dailyRate: 45.00,
      weeklyRate: 200.00,
      status: "rented",
      condition: "good",
      lastService: new Date(Date.now() - 30 * 86400000),
      nextService: new Date(Date.now() + 60 * 86400000),
      currentRental: {
        customerId: "CUST-001",
        customerName: "Metro Construction LLC",
        startDate: new Date(Date.now() - 3 * 86400000),
        expectedReturn: new Date(Date.now() + 4 * 86400000),
        totalCharge: 200.00,
      },
    },
    {
      id: "RENT-002",
      name: "Gas Generator 7500W",
      category: "generators",
      dailyRate: 65.00,
      weeklyRate: 295.00,
      status: "available",
      condition: "excellent",
      lastService: new Date(Date.now() - 15 * 86400000),
      nextService: new Date(Date.now() + 75 * 86400000),
    },
    {
      id: "RENT-003",
      name: "Pressure Washer 3500PSI",
      category: "equipment",
      dailyRate: 55.00,
      weeklyRate: 250.00,
      status: "available",
      condition: "good",
      lastService: new Date(Date.now() - 20 * 86400000),
      nextService: new Date(Date.now() + 70 * 86400000),
    },
    {
      id: "RENT-004",
      name: "Welder 220V MIG",
      category: "tools",
      dailyRate: 75.00,
      weeklyRate: 350.00,
      status: "maintenance",
      condition: "fair",
      lastService: new Date(Date.now() - 5 * 86400000),
      nextService: new Date(Date.now() + 5 * 86400000),
    },
    {
      id: "RENT-005",
      name: "Concrete Mixer 9cu-ft",
      category: "equipment",
      dailyRate: 50.00,
      weeklyRate: 225.00,
      status: "rented",
      condition: "good",
      lastService: new Date(Date.now() - 25 * 86400000),
      nextService: new Date(Date.now() + 65 * 86400000),
      currentRental: {
        customerId: "CUST-003",
        customerName: "John Peterson",
        startDate: new Date(Date.now() - 2 * 86400000),
        expectedReturn: new Date(Date.now() + 2 * 86400000),
        totalCharge: 100.00,
      },
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// L & L OPERATIONS PLATFORM CLASS
// ═══════════════════════════════════════════════════════════════════════════════

class LLEngineCompressorPlatform {
  private logger: Logger;
  private inventoryLogger: Logger;
  private serviceLogger: Logger;
  private crmLogger: Logger;
  private rentalLogger: Logger;

  constructor() {
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(llTheme)
        .logLevel("info")
        .enableHistory(true)
        .timestampFormat("HH:mm:ss")
        .plugin(new FileLoggerPlugin({
          filepath: "./logs/ll-engine-compressor.log",
          maxSize: 10 * 1024 * 1024,
          maxFiles: 5,
        }))
        .build(),
    );

    this.inventoryLogger = this.logger.child("inventory");
    this.serviceLogger = this.logger.child("service");
    this.crmLogger = this.logger.child("crm");
    this.rentalLogger = this.logger.child("rental");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 1: INVENTORY MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async runInventoryManagement(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 1: INVENTORY MANAGEMENT & PROCUREMENT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.inventoryLogger.info("Loading inventory data...");

    const inventory = generateInventory();

    const loadSpinner = new Spinner({ message: "Scanning inventory systems..." });
    loadSpinner.start();
    await sleep(1000);
    loadSpinner.update("Analyzing stock levels...");
    await sleep(800);
    loadSpinner.succeed("Inventory loaded");

    console.log("\n");
    console.log(ColorSystem.colorize("CURRENT INVENTORY STATUS:", ColorSystem.codes.bright));
    console.log("");

    // Category breakdown
    const categories = ["engine-parts", "compressor-parts", "building-materials", "supplies"];
    for (const category of categories) {
      const items = inventory.filter((i) => i.category === category);
      const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.cost), 0);
      const lowStock = items.filter((i) => i.quantity <= i.reorderPoint).length;

      console.log(
        ColorSystem.colorize(
          `${category.toUpperCase().replace(/-/g, " ")}: `,
          ColorSystem.codes.brightCyan,
        ) +
          `${items.length} items, ` +
          `Value: ${Formatter.currency(totalValue)}` +
          (lowStock > 0 ? ColorSystem.colorize(` (${lowStock} low stock)`, ColorSystem.codes.yellow) : ""),
      );
    }

    console.log("\n");

    // Show low stock items
    const lowStockItems = inventory.filter((i) => i.quantity <= i.reorderPoint);

    if (lowStockItems.length > 0) {
      this.inventoryLogger.warning(`${lowStockItems.length} items need reordering`);

      BoxRenderer.message(
        `⚠️  ${lowStockItems.length} items below reorder point`,
        "warning",
      );

      console.log("\n");
      console.log(ColorSystem.colorize("LOW STOCK ALERTS:", ColorSystem.codes.bright));
      console.log("");

      TableRenderer.render(
        lowStockItems.map((item) => ({
          sku: item.sku,
          name: item.name,
          current: item.quantity,
          reorder: item.reorderPoint,
          needed: item.reorderQuantity,
          supplier: item.supplier,
          cost: Formatter.currency(item.cost * item.reorderQuantity),
        })),
        [
          { key: "sku", label: "SKU", width: 12 },
          { key: "name", label: "Item", width: 22 },
          { key: "current", label: "Current", width: 8, align: "right" },
          { key: "reorder", label: "Min", width: 6, align: "right" },
          { key: "needed", label: "Order", width: 6, align: "right" },
          { key: "supplier", label: "Supplier", width: 18 },
          { key: "cost", label: "Cost", width: 12, align: "right" },
        ],
      );

      const totalReorderCost = lowStockItems.reduce(
        (sum, i) => sum + (i.cost * i.reorderQuantity),
        0,
      );

      console.log("");
      this.inventoryLogger.info(`Total reorder cost: ${Formatter.currency(totalReorderCost)}`);
    } else {
      BoxRenderer.message("✓ All inventory levels are adequate", "success");
    }

    // Show top selling items
    console.log("\n");
    console.log(ColorSystem.colorize("TOP INVENTORY ITEMS BY VALUE:", ColorSystem.codes.bright));
    console.log("");

    const topItems = [...inventory]
      .sort((a, b) => (b.quantity * b.cost) - (a.quantity * a.cost))
      .slice(0, 8);

    ChartRenderer.barChart(
      topItems.map((i) => ({
        label: i.name.substring(0, 18),
        value: Math.round(i.quantity * i.cost),
      })),
      { title: "Inventory Value ($)", showValues: true, width: 40 },
    );

    console.log("\n");
    const totalInventoryValue = inventory.reduce((sum, i) => sum + (i.quantity * i.cost), 0);
    this.inventoryLogger.success(`Total inventory value: ${Formatter.currency(totalInventoryValue)}`);
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 2: SERVICE DEPARTMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async runServiceDepartment(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 2: SERVICE DEPARTMENT - TICKET MANAGEMENT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.serviceLogger.info("Loading service tickets...");

    const tickets = generateServiceTickets();

    const loadSpinner = new Spinner({ message: "Loading service tickets..." });
    loadSpinner.start();
    await sleep(800);
    loadSpinner.succeed(`${tickets.length} tickets loaded`);

    console.log("\n");
    console.log(ColorSystem.colorize("ACTIVE SERVICE TICKETS:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      tickets.map((t) => ({
        id: t.id,
        customer: t.customerName.substring(0, 22),
        equipment: `${t.equipmentType} - ${t.equipmentMake || "N/A"}`,
        priority: t.priority.toUpperCase(),
        status: t.status,
        tech: t.assignedTech || "Unassigned",
        hours: t.laborHours > 0 ? t.laborHours.toFixed(1) : "-",
        cost: Formatter.currency(t.actualCost || t.estimatedCost),
      })),
      [
        { key: "id", label: "Ticket", width: 13 },
        { key: "customer", label: "Customer", width: 22 },
        { key: "equipment", label: "Equipment", width: 22 },
        {
          key: "priority",
          label: "Priority",
          width: 10,
          formatter: (v: string) => {
            const color = v === "EMERGENCY"
              ? ColorSystem.codes.red
              : v === "HIGH"
              ? ColorSystem.codes.yellow
              : ColorSystem.codes.green;
            return ColorSystem.colorize(v, color);
          },
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (v: string) => {
            const color = v === "completed"
              ? ColorSystem.codes.green
              : v === "in-progress"
              ? ColorSystem.codes.cyan
              : ColorSystem.codes.yellow;
            return ColorSystem.colorize(v, color);
          },
        },
        { key: "tech", label: "Technician", width: 12 },
        { key: "hours", label: "Hours", width: 7, align: "right" },
        { key: "cost", label: "Est. Cost", width: 12, align: "right" },
      ],
    );

    // Status breakdown
    console.log("\n");
    console.log(ColorSystem.colorize("SERVICE METRICS:", ColorSystem.codes.bright));
    console.log("");

    const statusCounts: Record<string, number> = {};
    tickets.forEach((t) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });

    ChartRenderer.barChart(
      Object.entries(statusCounts).map(([label, value]) => ({ label, value })),
      { title: "Tickets by Status", showValues: true, width: 35 },
    );

    const totalRevenue = tickets.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost), 0);
    const totalHours = tickets.reduce((sum, t) => sum + t.laborHours, 0);
    const avgTicketValue = totalRevenue / tickets.length;

    console.log("\n");
    TableRenderer.renderKeyValue([
      { label: "Total Service Tickets", value: tickets.length.toString() },
      { label: "Total Labor Hours", value: totalHours.toFixed(1) },
      { label: "Total Revenue", value: Formatter.currency(totalRevenue) },
      { label: "Avg Ticket Value", value: Formatter.currency(avgTicketValue) },
      { label: "Completion Rate", value: `${((statusCounts.completed || 0) / tickets.length * 100).toFixed(1)}%` },
    ]);

    console.log("");
    this.serviceLogger.success("Service department status updated");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 3: CUSTOMER RELATIONSHIP MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async runCRM(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 3: CUSTOMER RELATIONSHIP MANAGEMENT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.crmLogger.info("Loading customer database...");

    const customers = generateCustomers();

    const loadSpinner = new Spinner({ message: "Loading customer data..." });
    loadSpinner.start();
    await sleep(800);
    loadSpinner.succeed(`${customers.length} customers loaded`);

    console.log("\n");
    console.log(ColorSystem.colorize("CUSTOMER OVERVIEW:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      customers.map((c) => ({
        id: c.id,
        name: c.name,
        type: c.type,
        since: c.since.getFullYear().toString(),
        credit: Formatter.currency(c.creditLimit),
        balance: Formatter.currency(c.currentBalance),
        available: Formatter.currency(c.creditLimit - c.currentBalance),
        utilization: `${((c.currentBalance / c.creditLimit) * 100).toFixed(0)}%`,
      })),
      [
        { key: "id", label: "ID", width: 10 },
        { key: "name", label: "Customer", width: 25 },
        { key: "type", label: "Type", width: 12 },
        { key: "since", label: "Since", width: 7 },
        { key: "credit", label: "Credit", width: 12, align: "right" },
        { key: "balance", label: "Balance", width: 12, align: "right" },
        { key: "available", label: "Available", width: 12, align: "right" },
        {
          key: "utilization",
          label: "Usage",
          width: 8,
          align: "right",
          formatter: (v: string) => {
            const pct = parseInt(v);
            const color = pct > 80 ? ColorSystem.codes.red : pct > 50 ? ColorSystem.codes.yellow : ColorSystem.codes.green;
            return ColorSystem.colorize(v, color);
          },
        },
      ],
    );

    // Customer type breakdown
    console.log("\n");
    console.log(ColorSystem.colorize("CUSTOMER DISTRIBUTION:", ColorSystem.codes.bright));
    console.log("");

    const typeCounts: Record<string, number> = {};
    customers.forEach((c) => {
      typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
    });

    ChartRenderer.barChart(
      Object.entries(typeCounts).map(([label, value]) => ({ label, value })),
      { showValues: true, width: 30 },
    );

    const totalCredit = customers.reduce((sum, c) => sum + c.creditLimit, 0);
    const totalBalance = customers.reduce((sum, c) => sum + c.currentBalance, 0);

    console.log("\n");
    this.crmLogger.success("Customer data reviewed");

    TableRenderer.renderKeyValue([
      { label: "Total Customers", value: customers.length.toString() },
      { label: "Total Credit Extended", value: Formatter.currency(totalCredit) },
      { label: "Total Outstanding Balance", value: Formatter.currency(totalBalance) },
      { label: "Credit Utilization", value: `${((totalBalance / totalCredit) * 100).toFixed(1)}%` },
    ]);

    console.log("");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 4: TECHNICIAN MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async runTechnicianManagement(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 4: TECHNICIAN SCHEDULING & PRODUCTIVITY", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.serviceLogger.info("Loading technician data...");

    const technicians = generateTechnicians();

    const loadSpinner = new Spinner({ message: "Analyzing technician schedules..." });
    loadSpinner.start();
    await sleep(800);
    loadSpinner.succeed("Technician data loaded");

    console.log("\n");
    console.log(ColorSystem.colorize("TECHNICIAN STATUS:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      technicians.map((t) => ({
        name: t.name,
        specialization: t.specialization.slice(0, 2).join(", "),
        status: t.status,
        active: t.activeTickets,
        completed: t.completedToday,
        hours: t.hoursToday.toFixed(1),
        rate: Formatter.currency(t.hourlyRate),
        revenue: Formatter.currency(t.hoursToday * t.hourlyRate),
      })),
      [
        { key: "name", label: "Technician", width: 18 },
        { key: "specialization", label: "Specialization", width: 22 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (v: string) => {
            const color = v === "available"
              ? ColorSystem.codes.green
              : v === "busy"
              ? ColorSystem.codes.yellow
              : ColorSystem.codes.dim;
            return ColorSystem.colorize(v, color);
          },
        },
        { key: "active", label: "Active", width: 7, align: "right" },
        { key: "completed", label: "Done", width: 6, align: "right" },
        { key: "hours", label: "Hours", width: 7, align: "right" },
        { key: "rate", label: "Rate", width: 10, align: "right" },
        { key: "revenue", label: "Revenue", width: 12, align: "right" },
      ],
    );

    console.log("\n");
    console.log(ColorSystem.colorize("PRODUCTIVITY METRICS:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      technicians.map((t) => ({
        label: t.name.split(" ")[0],
        value: Math.round(t.hoursToday * t.hourlyRate),
      })),
      { title: "Revenue Generated Today ($)", showValues: true, width: 40 },
    );

    const totalHours = technicians.reduce((sum, t) => sum + t.hoursToday, 0);
    const totalRevenue = technicians.reduce((sum, t) => sum + (t.hoursToday * t.hourlyRate), 0);
    const totalCompleted = technicians.reduce((sum, t) => sum + t.completedToday, 0);

    console.log("\n");
    TableRenderer.renderKeyValue([
      { label: "Total Tech Hours Today", value: totalHours.toFixed(1) },
      { label: "Total Labor Revenue", value: Formatter.currency(totalRevenue) },
      { label: "Jobs Completed Today", value: totalCompleted.toString() },
      { label: "Avg Hours per Tech", value: (totalHours / technicians.length).toFixed(1) },
      { label: "Avg Revenue per Tech", value: Formatter.currency(totalRevenue / technicians.length) },
    ]);

    console.log("");
    this.serviceLogger.success("Technician productivity analyzed");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 5: EQUIPMENT RENTAL MANAGEMENT
  // ─────────────────────────────────────────────────────────────────────────────

  async runRentalManagement(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 5: EQUIPMENT RENTAL MANAGEMENT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.rentalLogger.info("Loading rental equipment data...");

    const equipment = generateRentalEquipment();

    const loadSpinner = new Spinner({ message: "Checking rental status..." });
    loadSpinner.start();
    await sleep(800);
    loadSpinner.succeed("Rental equipment loaded");

    console.log("\n");
    console.log(ColorSystem.colorize("RENTAL EQUIPMENT INVENTORY:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      equipment.map((e) => ({
        id: e.id,
        name: e.name,
        category: e.category,
        status: e.status,
        condition: e.condition,
        daily: Formatter.currency(e.dailyRate),
        weekly: Formatter.currency(e.weeklyRate),
        rented: e.currentRental
          ? e.currentRental.customerName.substring(0, 20)
          : "-",
      })),
      [
        { key: "id", label: "ID", width: 10 },
        { key: "name", label: "Equipment", width: 24 },
        { key: "category", label: "Category", width: 12 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (v: string) => {
            const color = v === "available"
              ? ColorSystem.codes.green
              : v === "rented"
              ? ColorSystem.codes.cyan
              : v === "maintenance"
              ? ColorSystem.codes.yellow
              : ColorSystem.codes.red;
            return ColorSystem.colorize(v, color);
          },
        },
        {
          key: "condition",
          label: "Condition",
          width: 12,
          formatter: (v: string) => {
            const color = v === "excellent"
              ? ColorSystem.codes.green
              : v === "good"
              ? ColorSystem.codes.cyan
              : ColorSystem.codes.yellow;
            return ColorSystem.colorize(v, color);
          },
        },
        { key: "daily", label: "Daily", width: 10, align: "right" },
        { key: "weekly", label: "Weekly", width: 10, align: "right" },
        { key: "rented", label: "Rented To", width: 20 },
      ],
    );

    // Status breakdown
    console.log("\n");
    console.log(ColorSystem.colorize("RENTAL METRICS:", ColorSystem.codes.bright));
    console.log("");

    const statusCounts: Record<string, number> = {};
    equipment.forEach((e) => {
      statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
    });

    ChartRenderer.barChart(
      Object.entries(statusCounts).map(([label, value]) => ({ label, value })),
      { showValues: true, width: 30 },
    );

    const activeRentals = equipment.filter((e) => e.currentRental);
    const currentRevenue = activeRentals.reduce((sum, e) => sum + (e.currentRental?.totalCharge || 0), 0);
    const utilization = (activeRentals.length / equipment.length) * 100;

    console.log("\n");
    TableRenderer.renderKeyValue([
      { label: "Total Rental Units", value: equipment.length.toString() },
      { label: "Available", value: statusCounts.available?.toString() || "0" },
      { label: "Currently Rented", value: activeRentals.length.toString() },
      { label: "In Maintenance", value: statusCounts.maintenance?.toString() || "0" },
      { label: "Utilization Rate", value: `${utilization.toFixed(1)}%` },
      { label: "Active Rental Revenue", value: Formatter.currency(currentRevenue) },
    ]);

    console.log("");

    // Show active rentals
    if (activeRentals.length > 0) {
      console.log("\n");
      console.log(ColorSystem.colorize("ACTIVE RENTALS:", ColorSystem.codes.bright));
      console.log("");

      TableRenderer.render(
        activeRentals.map((e) => ({
          equipment: e.name,
          customer: e.currentRental!.customerName,
          started: e.currentRental!.startDate.toLocaleDateString(),
          returns: e.currentRental!.expectedReturn.toLocaleDateString(),
          charge: Formatter.currency(e.currentRental!.totalCharge),
        })),
        [
          { key: "equipment", label: "Equipment", width: 24 },
          { key: "customer", label: "Customer", width: 25 },
          { key: "started", label: "Start Date", width: 12 },
          { key: "returns", label: "Return Date", width: 12 },
          { key: "charge", label: "Charge", width: 12, align: "right" },
        ],
      );
      console.log("");
    }

    this.rentalLogger.success("Rental equipment status updated");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // SYSTEM 6: BUSINESS ANALYTICS DASHBOARD
  // ─────────────────────────────────────────────────────────────────────────────

  async runAnalyticsDashboard(): Promise<void> {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  SYSTEM 6: BUSINESS ANALYTICS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    this.logger.info("Generating business analytics...");

    const analyzeSpinner = new Spinner({ message: "Analyzing business metrics..." });
    analyzeSpinner.start();
    await sleep(1200);
    analyzeSpinner.succeed("Analytics ready");

    console.log("\n");
    console.log(ColorSystem.colorize("DAILY BUSINESS SUMMARY:", ColorSystem.codes.bright));
    console.log("");

    // Simulated daily metrics
    const metrics = {
      salesRevenue: 3450.75,
      serviceRevenue: 2890.50,
      rentalRevenue: 450.00,
      partsRevenue: 1280.25,
      totalRevenue: 8071.50,
      costOfGoods: 3250.00,
      laborCost: 1850.00,
      grossProfit: 2971.50,
      transactions: 28,
      newCustomers: 2,
      serviceTickets: 7,
      inventoryValue: 45680.00,
    };

    TableRenderer.renderKeyValue([
      { label: "Total Revenue", value: Formatter.currency(metrics.totalRevenue) },
      { label: "  • Parts & Materials", value: Formatter.currency(metrics.salesRevenue) },
      { label: "  • Service Labor", value: Formatter.currency(metrics.serviceRevenue) },
      { label: "  • Equipment Rental", value: Formatter.currency(metrics.rentalRevenue) },
      { label: "  • Parts Sales", value: Formatter.currency(metrics.partsRevenue) },
      { label: "", value: "" },
      { label: "Cost of Goods Sold", value: Formatter.currency(metrics.costOfGoods) },
      { label: "Labor Costs", value: Formatter.currency(metrics.laborCost) },
      { label: "Gross Profit", value: ColorSystem.colorize(Formatter.currency(metrics.grossProfit), ColorSystem.codes.brightGreen) },
      { label: "Gross Margin", value: `${((metrics.grossProfit / metrics.totalRevenue) * 100).toFixed(1)}%` },
      { label: "", value: "" },
      { label: "Transactions Today", value: metrics.transactions.toString() },
      { label: "Service Tickets", value: metrics.serviceTickets.toString() },
      { label: "New Customers", value: metrics.newCustomers.toString() },
      { label: "Inventory Value", value: Formatter.currency(metrics.inventoryValue) },
    ]);

    console.log("\n");
    console.log(ColorSystem.colorize("REVENUE BREAKDOWN:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Parts/Materials", value: Math.round(metrics.salesRevenue) },
        { label: "Service Labor", value: Math.round(metrics.serviceRevenue) },
        { label: "Rental Income", value: Math.round(metrics.rentalRevenue) },
        { label: "Parts Sales", value: Math.round(metrics.partsRevenue) },
      ],
      { title: "Revenue by Category ($)", showValues: true, width: 40 },
    );

    console.log("\n");

    BoxRenderer.render(
      [
        "L & L Engine & Compressor Service",
        "3605 S. Byers Ave, Oklahoma City, OK 73129",
        "Phone: 405-631-9746",
        "",
        `Daily Revenue: ${Formatter.currency(metrics.totalRevenue)}`,
        `Gross Profit: ${Formatter.currency(metrics.grossProfit)} (${((metrics.grossProfit / metrics.totalRevenue) * 100).toFixed(1)}%)`,
        `Active Service Tickets: ${metrics.serviceTickets}`,
        "",
        "Systems Online: ✓ Inventory ✓ Service ✓ CRM ✓ Rental ✓ Analytics",
      ],
      {
        title: "📊 DAILY PERFORMANCE SUMMARY",
        style: "double",
        color: ColorSystem.rgb(41, 128, 185),
        padding: 1,
      },
    );

    console.log("");
    this.logger.success("Analytics dashboard updated");
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // MAIN EXECUTION
  // ─────────────────────────────────────────────────────────────────────────────

  async run(): Promise<void> {
    console.clear();

    // Display branded banner
    BannerRenderer.render({
      title: "L & L ENGINE & COMPRESSOR",
      subtitle: "Enterprise Operations Platform",
      version: "3605 S. Byers Ave, OKC, OK • 405-631-9746",
      style: "block",
    });

    this.logger.info("Platform initialized - All systems online");

    console.log("\n");
    BoxRenderer.render(
      [
        "Building Materials Supplier & Industrial Equipment Services",
        "",
        "This enterprise platform demonstrates:",
        "  • Inventory Management & Procurement",
        "  • Service Department Operations",
        "  • Customer Relationship Management",
        "  • Technician Scheduling & Productivity",
        "  • Equipment Rental Management",
        "  • Real-Time Business Analytics",
        "",
        "Powered by GenesisTrace - Zero-dependency logging framework",
      ],
      {
        title: "🏗️ ENTERPRISE DEMO",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("\n");
    await sleep(1500);

    // Run all system demonstrations
    await this.runInventoryManagement();
    await sleep(1000);

    await this.runServiceDepartment();
    await sleep(1000);

    await this.runCRM();
    await sleep(1000);

    await this.runTechnicianManagement();
    await sleep(1000);

    await this.runRentalManagement();
    await sleep(1000);

    await this.runAnalyticsDashboard();

    // Final summary
    console.log("\n\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log(ColorSystem.colorize("  DEMONSTRATION COMPLETE", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.rgb(41, 128, 185)));
    console.log("\n");

    BoxRenderer.render(
      [
        "L & L Engine & Compressor Service - Enterprise Platform Demo",
        "",
        "Systems Demonstrated:",
        "  ✓ Inventory Management & Procurement",
        "  ✓ Service Department - Ticket Management",
        "  ✓ Customer Relationship Management (CRM)",
        "  ✓ Technician Scheduling & Productivity",
        "  ✓ Equipment Rental Management",
        "  ✓ Real-Time Business Analytics Dashboard",
        "",
        "Key Features:",
        "  • Multi-location inventory tracking",
        "  • Service ticket lifecycle management",
        "  • Customer credit & balance monitoring",
        "  • Technician productivity metrics",
        "  • Rental equipment utilization tracking",
        "  • Real-time revenue & profit analysis",
        "",
        "ALL FEATURES PROVIDED BY A SINGLE IMPORT:",
        '  import { ... } from "genesis-trace"',
        "",
        "─────────────────────────────────────────────────────",
        "",
        "Benefits for L & L:",
        "  • Unified operations platform",
        "  • Real-time business insights",
        "  • Improved inventory management",
        "  • Enhanced customer service",
        "  • Optimized technician scheduling",
        "  • Maximized rental revenue",
        "",
        "Next Steps:",
        "  • Customize to specific business needs",
        "  • Integrate with existing systems",
        "  • Deploy to production environment",
        "  • Train staff on platform usage",
      ],
      {
        title: "🏆 ENTERPRISE PLATFORM SUMMARY",
        style: "double",
        color: ColorSystem.rgb(41, 128, 185),
        padding: 1,
      },
    );

    console.log("\n");
    this.logger.success("Platform demonstration complete");

    console.log("\n");
    console.log(ColorSystem.colorize("For inquiries contact:", ColorSystem.codes.dim));
    console.log(ColorSystem.colorize("L & L Engine & Compressor Service", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("3605 S. Byers Ave, Oklahoma City, OK 73129", ColorSystem.codes.dim));
    console.log(ColorSystem.colorize("Phone: 405-631-9746", ColorSystem.codes.dim));
    console.log("\n");

    // Graceful shutdown
    await this.logger.shutdown();
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════════

if (import.meta.main) {
  const platform = new LLEngineCompressorPlatform();
  await platform.run();
}
