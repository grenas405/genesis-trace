#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Mexican Convenience Store Operations - Comprehensive Guide
 *
 * An in-depth explanation of how Mexican convenience stores (tiendas) operate,
 * demonstrating authentic business practices, cultural considerations, and
 * operational workflows using the GenesisTrace library.
 *
 * This guide covers:
 *   • Business model and community role
 *   • Product categories and supplier relationships
 *   • Daily operational workflows
 *   • Customer service practices
 *   • Financial management
 *   • Cultural significance and trust-based systems
 *   • Family business dynamics
 *   • Regulatory compliance
 *   • Technology integration
 *   • Growth strategies
 *
 * Cultural Context:
 *   Mexican convenience stores are more than retail spaces - they are community
 *   anchors that provide essential goods, financial services, social connection,
 *   and cultural continuity for Hispanic communities, especially in areas with
 *   limited access to traditional banking or large supermarkets.
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
// MAIN PRESENTATION FUNCTION
// ============================================================================

const runPresentation = async () => {
  console.clear();
  console.log("");

  const logger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build()
  );

  // ==========================================================================
  // SECTION 1: INTRODUCTION
  // ==========================================================================

  BannerRenderer.render({
    title: "MEXICAN CONVENIENCE STORES",
    subtitle: "La Tienda de la Esquina • The Neighborhood Store",
    description: "A Comprehensive Guide to Tienda Operations & Cultural Significance",
    version: "Educational Guide",
    author: "Genesis Trace Library",
    width: 100,
    style: "double",
    color: ColorSystem.codes.brightGreen,
  });
  console.log("");

  BoxRenderer.render(
    [
      "Welcome to this comprehensive guide on Mexican convenience store operations.",
      "",
      "Mexican convenience stores (tiendas) represent a unique business model that",
      "combines retail operations, financial services, and community support systems.",
      "",
      "This presentation will walk you through:",
      "  • The business model and operational structure",
      "  • Product categories and supplier networks",
      "  • Daily workflows and customer service practices",
      "  • Cultural significance and community role",
      "  • Financial management and growth strategies",
    ],
    {
      title: "📚 Introduction",
      style: "rounded",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
      margin: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 2: BUSINESS MODEL OVERVIEW
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightYellow));
  console.log(ColorSystem.colorize(" SECTION 1: BUSINESS MODEL & CORE STRUCTURE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightYellow));
  console.log("");

  logger.info("Loading business model analysis...");
  const spinner1 = new Spinner({ message: "Analyzing tienda business structures..." });
  spinner1.start();
  await sleep(1000);
  spinner1.succeed("Business model data ready");
  console.log("");

  BoxRenderer.render(
    [
      "🏪 THE MEXICAN CONVENIENCE STORE BUSINESS MODEL",
      "",
      "Mexican tiendas serve multiple critical functions:",
      "",
      "1️⃣  RETAIL OPERATIONS",
      "   • Authentic Mexican products (imported from Mexico)",
      "   • Fresh produce, meats, and daily necessities",
      "   • Hot food preparation (tacos, tamales, tortas)",
      "   • Beverages and snacks",
      "",
      "2️⃣  FINANCIAL SERVICES",
      "   • Money transfers (Western Union, MoneyGram)",
      "   • Bill payment services",
      "   • Phone card sales (calling cards for Mexico)",
      "   • Check cashing (for unbanked customers)",
      "",
      "3️⃣  COMMUNITY HUB",
      "   • Information sharing (jobs, housing, services)",
      "   • Language support (Spanish-speaking environment)",
      "   • Cultural gathering space",
      "   • Trusted advisor for newcomers",
      "",
      "4️⃣  ANCILLARY SERVICES",
      "   • Gas station (often combined)",
      "   • Laundromat",
      "   • Tax preparation (seasonal)",
      "   • Notary services",
    ],
    {
      title: "🎯 Core Business Functions",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    }
  );
  console.log("");

  // Business model breakdown chart
  console.log(ColorSystem.colorize("  Revenue Distribution by Category:", ColorSystem.codes.bright));
  console.log("");

  ChartRenderer.barChart(
    [
      { label: "Grocery & Products", value: 35 },
      { label: "Hot Food Sales", value: 18 },
      { label: "Gas Station", value: 28 },
      { label: "Money Transfers", value: 8 },
      { label: "Bill Pay & Services", value: 6 },
      { label: "Other Services", value: 5 },
    ],
    {
      width: 50,
      showValues: true,
      color: ColorSystem.codes.brightYellow,
      title: "Revenue Mix (%)",
    }
  );
  console.log("");

  BoxRenderer.render(
    [
      "💡 KEY INSIGHT: Multi-Revenue Stream Strategy",
      "",
      "Successful Mexican convenience stores don't rely on a single income source.",
      "The combination of retail, food service, fuel, and financial services creates",
      "a resilient business model that serves community needs while maintaining",
      "profitability through volume and diversity.",
      "",
      "Typical Store Profile:",
      "  • Size: 2,000-4,000 sq ft retail space",
      "  • Hours: Often 24/7 or 6 AM - 11 PM daily",
      "  • Staff: 4-8 employees (often family members)",
      "  • Daily customers: 200-500 depending on location",
      "  • Average transaction: $8-15",
    ],
    {
      title: "💼 Business Intelligence",
      style: "single",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 3: PRODUCT CATEGORIES & INVENTORY
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  console.log(ColorSystem.colorize(" SECTION 2: PRODUCT CATEGORIES & INVENTORY MANAGEMENT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  console.log("");

  logger.info("Analyzing product categories and inventory systems...");
  const spinner2 = new Spinner({ message: "Loading product database..." });
  spinner2.start();
  await sleep(1200);
  spinner2.succeed("Product categories loaded");
  console.log("");

  const productCategories = [
    {
      category: "Bebidas (Beverages)",
      examples: "Jarritos, Mexican Coke, Jumex, Topo Chico, Horchata",
      suppliers: "Novamex, Arca Continental, Grupo Modelo",
      margin: "30-40%",
      turnover: "Daily",
      importance: "Very High",
    },
    {
      category: "Botanas (Snacks)",
      examples: "Takis, Sabritas, Cacahuates, Chicharrones",
      suppliers: "Barcel, PepsiCo México, Local producers",
      margin: "35-45%",
      turnover: "2-3 days",
      importance: "Very High",
    },
    {
      category: "Tortillería",
      examples: "Corn tortillas, Flour tortillas, Tostadas",
      suppliers: "Local tortillerías (daily delivery)",
      margin: "40-50%",
      turnover: "Daily",
      importance: "Critical",
    },
    {
      category: "Carnicería (Meat)",
      examples: "Carne asada, Pastor, Chorizo, Tripas",
      suppliers: "Regional meat distributors",
      margin: "25-35%",
      turnover: "1-2 days",
      importance: "High",
    },
    {
      category: "Comida Caliente",
      examples: "Tacos, Tamales, Tortas, Burritos",
      suppliers: "Made in-house",
      margin: "55-70%",
      turnover: "Same day",
      importance: "Very High",
    },
    {
      category: "Abarrotes (Dry Goods)",
      examples: "Beans, Rice, Chiles, Sauces (La Costeña, Herdez)",
      suppliers: "Regional distributors, direct imports",
      margin: "25-35%",
      turnover: "Weekly",
      importance: "High",
    },
    {
      category: "Dulcería (Candy)",
      examples: "Mazapán, Pulparindo, Paletas, Lucas",
      suppliers: "De La Rosa, Ricolino, Vero",
      margin: "40-55%",
      turnover: "Weekly",
      importance: "Medium",
    },
    {
      category: "Productos de Limpieza",
      examples: "Cleaning supplies, Personal care",
      suppliers: "Regional distributors",
      margin: "20-30%",
      turnover: "Monthly",
      importance: "Medium",
    },
  ];

  TableRenderer.render(
    productCategories,
    [
      { key: "category", label: "Product Category", width: 22 },
      { key: "examples", label: "Popular Items", width: 32 },
      { key: "margin", label: "Margin", width: 10, align: "center" },
      { key: "turnover", label: "Turnover", width: 12, align: "center" },
      {
        key: "importance",
        label: "Business Importance",
        width: 18,
        formatter: (imp: string) => {
          if (imp === "Critical" || imp === "Very High") {
            return ColorSystem.colorize(imp, ColorSystem.codes.brightGreen);
          }
          if (imp === "High") return ColorSystem.colorize(imp, ColorSystem.codes.green);
          return ColorSystem.colorize(imp, ColorSystem.codes.yellow);
        },
      },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "🎯 INVENTORY MANAGEMENT STRATEGY",
      "",
      "Mexican tiendas use a unique inventory approach:",
      "",
      "High-Frequency, Low-Stock Model:",
      "  • Keep minimal inventory of perishables",
      "  • Daily deliveries from local suppliers (tortillas, produce, meat)",
      "  • Weekly restocks for dry goods and beverages",
      "  • Just-in-time approach reduces waste and capital requirements",
      "",
      "Supplier Relationship Management:",
      "  • Build strong personal relationships with suppliers",
      "  • Flexible payment terms (often 7-30 day net terms)",
      "  • Volume discounts through purchasing cooperatives",
      "  • Local Mexican suppliers for authentic products",
      "",
      "Product Selection Philosophy:",
      "  • Focus on authentic Mexican brands",
      "  • Carry products from customers' home regions in Mexico",
      "  • Balance between nostalgia items and practical necessities",
      "  • Adapt inventory based on customer requests",
    ],
    {
      title: "📦 Inventory Philosophy",
      style: "double",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 4: DAILY OPERATIONS WORKFLOW
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightMagenta));
  console.log(ColorSystem.colorize(" SECTION 3: DAILY OPERATIONS WORKFLOW", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightMagenta));
  console.log("");

  logger.info("Simulating typical daily operations cycle...");
  console.log("");

  const dailyTasks = [
    { time: "5:00 AM", task: "Store Opening & Cash Register Setup", responsible: "Owner/Manager", duration: 30 },
    { time: "5:30 AM", task: "Receive Tortilla Delivery (Fresh Daily)", responsible: "Staff", duration: 15 },
    { time: "5:45 AM", task: "Prepare Coffee & Hot Food Station", responsible: "Cook", duration: 45 },
    { time: "6:00 AM", task: "Morning Rush Begins (Construction Workers)", responsible: "Cashier", duration: 180 },
    { time: "8:00 AM", task: "Receive Bread/Bakery Delivery", responsible: "Staff", duration: 20 },
    { time: "9:00 AM", task: "Meat Delivery & Refrigeration", responsible: "Staff", duration: 30 },
    { time: "10:00 AM", task: "Stock Shelves & Organize Inventory", responsible: "Staff", duration: 120 },
    { time: "11:00 AM", task: "Lunch Prep - Tacos, Tortas, Tamales", responsible: "Cook", duration: 60 },
    { time: "12:00 PM", task: "Lunch Rush (Peak Sales Period)", responsible: "All Hands", duration: 120 },
    { time: "2:00 PM", task: "Afternoon Lull - Cleaning & Restocking", responsible: "Staff", duration: 180 },
    { time: "5:00 PM", task: "Evening Rush (After Work Crowd)", responsible: "Cashier", duration: 180 },
    { time: "8:00 PM", task: "Dinner Service Wind Down", responsible: "Cook", duration: 60 },
    { time: "9:00 PM", task: "Evening Cleaning & Floor Mopping", responsible: "Staff", duration: 60 },
    { time: "10:00 PM", task: "Cash Register Reconciliation", responsible: "Manager", duration: 30 },
    { time: "10:30 PM", task: "Store Closing (or Night Shift Begins)", responsible: "Owner/Manager", duration: 30 },
  ];

  TableRenderer.render(
    dailyTasks,
    [
      { key: "time", label: "Time", width: 12 },
      { key: "task", label: "Operational Task", width: 42 },
      { key: "responsible", label: "Responsible", width: 18 },
      {
        key: "duration",
        label: "Duration (min)",
        width: 14,
        align: "right",
        formatter: (dur: number) => `${dur} min`,
      },
    ],
    { showIndex: false }
  );
  console.log("");

  logger.info("Simulating morning operations...");

  const morningProgress = new ProgressBar({
    total: 100,
    width: 70,
    colorize: true,
    showValue: true,
    showPercentage: true,
  });

  console.log(ColorSystem.colorize("  Morning Setup & Rush (5 AM - 9 AM):", ColorSystem.codes.bright));
  for (let i = 0; i <= 100; i += 10) {
    morningProgress.update(i);
    await sleep(150);
  }
  morningProgress.complete();
  console.log("");

  BoxRenderer.render(
    [
      "⏰ OPERATIONAL TIME MANAGEMENT",
      "",
      "Peak Hours (High Traffic):",
      "  • 6:00 AM - 9:00 AM: Morning commuters, construction workers",
      "  • 12:00 PM - 2:00 PM: Lunch rush (hot food sales peak)",
      "  • 5:00 PM - 8:00 PM: After-work customers, dinner service",
      "",
      "Quiet Hours (Restocking & Maintenance):",
      "  • 9:00 AM - 11:00 AM: Stock shelves, clean, receive deliveries",
      "  • 2:00 PM - 5:00 PM: Deep cleaning, prep for dinner",
      "  • After 9:00 PM: Reconciliation, closing procedures",
      "",
      "Critical Daily Tasks:",
      "  ✓ Fresh tortilla delivery (must be first thing AM)",
      "  ✓ Hot food preparation (2-3 times per day)",
      "  ✓ Cash register reconciliation (end of shift)",
      "  ✓ Inventory spot checks (ongoing)",
      "  ✓ Customer service (continuous priority)",
    ],
    {
      title: "⏱️  Daily Operations Rhythm",
      style: "rounded",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 5: CUSTOMER SERVICE & CULTURAL PRACTICES
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightGreen));
  console.log(ColorSystem.colorize(" SECTION 4: CUSTOMER SERVICE & CULTURAL PRACTICES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightGreen));
  console.log("");

  logger.info("Examining cultural service practices...");
  const spinner3 = new Spinner({ message: "Loading cultural business practices..." });
  spinner3.start();
  await sleep(1100);
  spinner3.succeed("Cultural practices data ready");
  console.log("");

  BoxRenderer.render(
    [
      "🤝 THE TRUST-BASED CUSTOMER RELATIONSHIP",
      "",
      "Mexican tiendas operate on principles of personal relationships and trust:",
      "",
      "1. FIADO (Store Credit System)",
      "   • Regular customers can buy on credit (tab/running balance)",
      "   • Tracked in a notebook or ledger ('la libreta')",
      "   • Payment expected weekly or bi-weekly (payday)",
      "   • Based on personal trust and community standing",
      "   • Typical limits: $50-$200 depending on customer history",
      "",
      "2. PERSONALISMO (Personal Service)",
      "   • Know customers by name and family connections",
      "   • Remember preferences and usual purchases",
      "   • Provide advice on products and recipes",
      "   • Help with translation or form filling",
      "   • Act as informal community advisor",
      "",
      "3. CONFIANZA (Trust & Familiarity)",
      "   • Store becomes a social gathering place",
      "   • Customers share personal news and challenges",
      "   • Store owner may help with crisis situations",
      "   • Extended family atmosphere",
      "",
      "4. SPANISH LANGUAGE PRIORITY",
      "   • Primary language of business",
      "   • Signage in Spanish",
      "   • Staff must be bilingual (Spanish/English)",
      "   • Creates safe, comfortable environment for Spanish speakers",
    ],
    {
      title: "🎭 Cultural Service Model",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    }
  );
  console.log("");

  const customerServiceMetrics = [
    {
      practice: "Greeting Every Customer",
      importance: "Critical",
      frequency: "Every Transaction",
      culturalNote: "'Buenos días/tardes' is expected",
    },
    {
      practice: "Offering Fiado Credit",
      importance: "High",
      frequency: "As Needed",
      culturalNote: "Builds loyalty and community trust",
    },
    {
      practice: "Recipe Advice",
      importance: "Medium",
      frequency: "Often",
      culturalNote: "Helps customers use unfamiliar products",
    },
    {
      practice: "Extended Conversations",
      importance: "High",
      frequency: "Daily",
      culturalNote: "Building relationships, not just transactions",
    },
    {
      practice: "Flexible Pricing for Regulars",
      importance: "Low-Medium",
      frequency: "Occasional",
      culturalNote: "Small discounts for loyal customers",
    },
    {
      practice: "Allowing Taste Testing",
      importance: "Medium",
      frequency: "Often",
      culturalNote: "Builds trust in product quality",
    },
  ];

  TableRenderer.render(
    customerServiceMetrics,
    [
      { key: "practice", label: "Customer Service Practice", width: 26 },
      {
        key: "importance",
        label: "Importance",
        width: 12,
        formatter: (imp: string) => {
          if (imp === "Critical") return ColorSystem.colorize(imp, ColorSystem.codes.brightRed);
          if (imp === "High") return ColorSystem.colorize(imp, ColorSystem.codes.brightYellow);
          return ColorSystem.colorize(imp, ColorSystem.codes.cyan);
        },
      },
      { key: "frequency", label: "Frequency", width: 16 },
      { key: "culturalNote", label: "Cultural Significance", width: 38 },
    ],
    { showIndex: true }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 6: FINANCIAL MANAGEMENT
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightYellow));
  console.log(ColorSystem.colorize(" SECTION 5: FINANCIAL MANAGEMENT & PROFITABILITY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightYellow));
  console.log("");

  logger.info("Analyzing financial operations...");
  const spinner4 = new Spinner({ message: "Calculating financial metrics..." });
  spinner4.start();
  await sleep(1000);
  spinner4.succeed("Financial analysis complete");
  console.log("");

  // Sample Financial Breakdown
  const monthlyFinancials = [
    {
      category: "Gross Revenue",
      amount: 85000,
      percentage: 100,
      type: "Income",
    },
    {
      category: "Cost of Goods Sold (COGS)",
      amount: -55250,
      percentage: 65,
      type: "Expense",
    },
    {
      category: "Gross Profit",
      amount: 29750,
      percentage: 35,
      type: "Income",
    },
    {
      category: "Labor Costs (Including Owner)",
      amount: -12750,
      percentage: 15,
      type: "Expense",
    },
    {
      category: "Rent & Utilities",
      amount: -6800,
      percentage: 8,
      type: "Expense",
    },
    {
      category: "Insurance & Licenses",
      amount: -1700,
      percentage: 2,
      type: "Expense",
    },
    {
      category: "Equipment & Maintenance",
      amount: -1275,
      percentage: 1.5,
      type: "Expense",
    },
    {
      category: "Marketing & Misc",
      amount: -850,
      percentage: 1,
      type: "Expense",
    },
    {
      category: "Net Profit (Monthly)",
      amount: 6375,
      percentage: 7.5,
      type: "Income",
    },
  ];

  TableRenderer.render(
    monthlyFinancials,
    [
      { key: "category", label: "Financial Category", width: 32 },
      {
        key: "amount",
        label: "Amount",
        width: 16,
        align: "right",
        formatter: (amt: number) => {
          const color = amt >= 0 ? ColorSystem.codes.brightGreen : ColorSystem.codes.brightRed;
          return ColorSystem.colorize(Formatter.currency(Math.abs(amt)), color);
        },
      },
      {
        key: "percentage",
        label: "% of Revenue",
        width: 14,
        align: "right",
        formatter: (pct: number) => `${pct.toFixed(1)}%`,
      },
      {
        key: "type",
        label: "Type",
        width: 10,
        formatter: (type: string) => {
          return type === "Income"
            ? ColorSystem.colorize(type, ColorSystem.codes.green)
            : ColorSystem.colorize(type, ColorSystem.codes.red);
        },
      },
    ],
    { showIndex: false }
  );
  console.log("");

  BoxRenderer.render(
    [
      "💰 FINANCIAL MANAGEMENT PRINCIPLES",
      "",
      "Cash Flow Management:",
      "  • Daily cash reconciliation is critical",
      "  • Separate cash drawer tracking by shift",
      "  • Bank deposits 2-3 times per week",
      "  • Keep minimal cash on premises (security)",
      "",
      "Profit Margins by Category:",
      "  • Hot food: 55-70% (highest margin)",
      "  • Beverages & snacks: 30-45%",
      "  • Produce & perishables: 25-35%",
      "  • Services (money transfer): 5-10% commission",
      "",
      "Capital Requirements:",
      "  • Initial inventory: $15,000-$25,000",
      "  • Equipment: $20,000-$40,000",
      "  • Working capital: $10,000-$15,000",
      "  • Total startup: $60,000-$100,000",
      "",
      "Profitability Timeline:",
      "  • Break-even: Typically 8-14 months",
      "  • Target net margin: 7-12%",
      "  • Owner compensation: Often through profit distribution",
      "",
      "Financial Challenges:",
      "  ⚠️  Managing fiado credit (bad debt risk)",
      "  ⚠️  Cash-heavy business (theft/loss risk)",
      "  ⚠️  Seasonal fluctuations in immigrant communities",
      "  ⚠️  Competition from large chains",
    ],
    {
      title: "💵 Financial Strategy",
      style: "double",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    }
  );
  console.log("");

  // Revenue distribution
  console.log(ColorSystem.colorize("  Monthly Revenue Distribution:", ColorSystem.codes.bright));
  console.log("");

  ChartRenderer.barChart(
    [
      { label: "Grocery Products", value: 29750 },
      { label: "Hot Food", value: 15300 },
      { label: "Gas Station", value: 23800 },
      { label: "Money Transfers", value: 6800 },
      { label: "Bill Pay Services", value: 5100 },
      { label: "Other Services", value: 4250 },
    ],
    {
      width: 50,
      showValues: true,
      color: ColorSystem.codes.brightGreen,
      title: "Revenue Sources ($)",
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 7: SUPPLIER RELATIONSHIPS & PROCUREMENT
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightMagenta));
  console.log(ColorSystem.colorize(" SECTION 6: SUPPLIER RELATIONSHIPS & PROCUREMENT", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightMagenta));
  console.log("");

  logger.info("Examining supplier networks...");
  const spinner5 = new Spinner({ message: "Mapping supply chain relationships..." });
  spinner5.start();
  await sleep(1100);
  spinner5.succeed("Supplier network mapped");
  console.log("");

  const supplierTypes = [
    {
      supplierType: "Local Tortillería",
      products: "Fresh tortillas, chips",
      deliveryFreq: "Daily",
      paymentTerms: "Weekly/COD",
      relationship: "Critical - Personal",
      culturalNote: "Often family or community connection",
    },
    {
      supplierType: "Regional Meat Distributor",
      products: "Fresh meats, deli items",
      deliveryFreq: "2-3x per week",
      paymentTerms: "Net 7-14 days",
      relationship: "Important",
      culturalNote: "Quality and reliability essential",
    },
    {
      supplierType: "Mexican Import Distributor",
      products: "Authentic Mexican brands",
      deliveryFreq: "Weekly",
      paymentTerms: "Net 30 days",
      relationship: "Strategic",
      culturalNote: "Access to authentic products",
    },
    {
      supplierType: "Produce Wholesaler",
      products: "Vegetables, fruits, herbs",
      deliveryFreq: "3x per week",
      paymentTerms: "COD or Net 7",
      relationship: "Important",
      culturalNote: "Freshness is paramount",
    },
    {
      supplierType: "Beverage Distributors",
      products: "Sodas, beers, juices",
      deliveryFreq: "Weekly",
      paymentTerms: "Net 14-30 days",
      relationship: "High Volume",
      culturalNote: "Major brands (Coca-Cola, Grupo Modelo)",
    },
    {
      supplierType: "Dry Goods Wholesaler",
      products: "Beans, rice, canned goods",
      deliveryFreq: "Bi-weekly",
      paymentTerms: "Net 30 days",
      relationship: "Standard",
      culturalNote: "Bulk purchasing for better margins",
    },
    {
      supplierType: "Bakery (Panadería)",
      products: "Pan dulce, bolillos",
      deliveryFreq: "Daily or 3x week",
      paymentTerms: "Weekly",
      relationship: "Cultural Essential",
      culturalNote: "Fresh Mexican baked goods",
    },
  ];

  TableRenderer.render(
    supplierTypes,
    [
      { key: "supplierType", label: "Supplier Type", width: 24 },
      { key: "products", label: "Products", width: 24 },
      { key: "deliveryFreq", label: "Delivery", width: 12, align: "center" },
      { key: "paymentTerms", label: "Payment", width: 14 },
      { key: "relationship", label: "Importance", width: 14 },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "🤝 SUPPLIER RELATIONSHIP MANAGEMENT",
      "",
      "Building Strong Supplier Partnerships:",
      "",
      "1. PERSONAL RELATIONSHIPS",
      "   • Face-to-face meetings with sales reps",
      "   • Develop trust through consistent ordering",
      "   • Negotiate favorable payment terms (30-60 days)",
      "   • Volume commitments for better pricing",
      "",
      "2. QUALITY CONTROL",
      "   • Inspect deliveries upon arrival",
      "   • Check expiration dates on all perishables",
      "   • Verify quantities and pricing",
      "   • Return damaged or incorrect items immediately",
      "",
      "3. PAYMENT DISCIPLINE",
      "   • Pay invoices on time to maintain good terms",
      "   • Negotiate extended terms as business grows",
      "   • Use credit strategically to manage cash flow",
      "   • Build credit history for better financing",
      "",
      "4. DIVERSIFICATION",
      "   • Don't rely on single supplier for critical items",
      "   • Have backup sources for key products",
      "   • Balance between large distributors and local suppliers",
      "   • Explore direct imports from Mexico for specialty items",
      "",
      "5. CULTURAL CONSIDERATIONS",
      "   • Work with suppliers who understand Hispanic market",
      "   • Prefer Spanish-speaking sales representatives",
      "   • Participate in Hispanic business associations",
      "   • Attend trade shows focused on Latino products",
    ],
    {
      title: "📦 Supply Chain Strategy",
      style: "double",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 8: TECHNOLOGY & MODERNIZATION
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightBlue));
  console.log(ColorSystem.colorize(" SECTION 7: TECHNOLOGY INTEGRATION & MODERNIZATION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightBlue));
  console.log("");

  logger.info("Analyzing technology adoption...");
  const spinner6 = new Spinner({ message: "Reviewing digital transformation..." });
  spinner6.start();
  await sleep(1000);
  spinner6.succeed("Technology analysis complete");
  console.log("");

  const technologySystems = [
    {
      system: "Point of Sale (POS)",
      priority: "Critical",
      cost: "$1,500-$5,000",
      features: "Sales tracking, inventory, reports",
      adoption: "85%",
      recommendation: "Essential for modern operations",
    },
    {
      system: "Inventory Management",
      priority: "High",
      cost: "$500-$2,000/year",
      features: "Auto-reordering, stock alerts, analytics",
      adoption: "60%",
      recommendation: "Highly recommended",
    },
    {
      system: "Security Cameras",
      priority: "Critical",
      cost: "$2,000-$8,000",
      features: "24/7 monitoring, remote access, DVR",
      adoption: "90%",
      recommendation: "Essential for safety",
    },
    {
      system: "Money Transfer Terminal",
      priority: "High",
      cost: "$500 + commission",
      features: "Western Union, MoneyGram integration",
      adoption: "75%",
      recommendation: "Important revenue source",
    },
    {
      system: "Digital Menu Boards",
      priority: "Medium",
      cost: "$1,000-$3,000",
      features: "Dynamic pricing, easy updates",
      adoption: "40%",
      recommendation: "Nice to have",
    },
    {
      system: "Online Ordering",
      priority: "Growing",
      cost: "$500-$1,500/year",
      features: "Web/app orders, delivery integration",
      adoption: "25%",
      recommendation: "Future consideration",
    },
    {
      system: "Accounting Software",
      priority: "High",
      cost: "$300-$600/year",
      features: "QuickBooks, expense tracking",
      adoption: "70%",
      recommendation: "Recommended",
    },
  ];

  TableRenderer.render(
    technologySystems,
    [
      { key: "system", label: "Technology System", width: 22 },
      {
        key: "priority",
        label: "Priority",
        width: 10,
        formatter: (pri: string) => {
          if (pri === "Critical") return ColorSystem.colorize(pri, ColorSystem.codes.brightRed);
          if (pri === "High") return ColorSystem.colorize(pri, ColorSystem.codes.brightYellow);
          return ColorSystem.colorize(pri, ColorSystem.codes.cyan);
        },
      },
      { key: "cost", label: "Investment", width: 16 },
      { key: "adoption", label: "Adoption", width: 10, align: "center" },
      { key: "recommendation", label: "Recommendation", width: 26 },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "💻 DIGITAL TRANSFORMATION ROADMAP",
      "",
      "Phase 1: Essential Systems (Year 1)",
      "  ✓ Modern POS system with inventory tracking",
      "  ✓ Security camera system",
      "  ✓ Money transfer terminal setup",
      "  ✓ Basic accounting software (QuickBooks)",
      "  Investment: ~$5,000-$10,000",
      "",
      "Phase 2: Optimization (Year 2-3)",
      "  ✓ Advanced inventory management software",
      "  ✓ Customer loyalty program (digital cards)",
      "  ✓ Digital signage and menu boards",
      "  ✓ Employee scheduling software",
      "  Investment: ~$3,000-$5,000",
      "",
      "Phase 3: Growth & Expansion (Year 3+)",
      "  ✓ Online ordering platform",
      "  ✓ Mobile app development",
      "  ✓ Delivery service integration (DoorDash, Uber Eats)",
      "  ✓ Social media marketing automation",
      "  Investment: ~$5,000-$10,000",
      "",
      "Key Success Factors:",
      "  • Train staff thoroughly on new systems",
      "  • Choose Spanish-language compatible systems",
      "  • Ensure systems integrate with each other",
      "  • Start simple and add complexity gradually",
      "  • Prioritize customer-facing improvements",
    ],
    {
      title: "🚀 Technology Adoption Strategy",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 9: REGULATORY COMPLIANCE & LEGAL
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightRed));
  console.log(ColorSystem.colorize(" SECTION 8: REGULATORY COMPLIANCE & LEGAL REQUIREMENTS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightRed));
  console.log("");

  logger.info("Loading regulatory requirements...");
  const spinner7 = new Spinner({ message: "Compiling compliance checklist..." });
  spinner7.start();
  await sleep(1100);
  spinner7.succeed("Compliance requirements loaded");
  console.log("");

  const complianceRequirements = [
    {
      requirement: "Business License",
      authority: "City/County",
      frequency: "Annual",
      cost: "$100-$500",
      criticality: "Critical",
      notes: "Required to operate legally",
    },
    {
      requirement: "Food Service Permit",
      authority: "Health Department",
      frequency: "Annual",
      cost: "$200-$800",
      criticality: "Critical",
      notes: "If selling hot food",
    },
    {
      requirement: "Sales Tax Permit",
      authority: "State Revenue Dept",
      frequency: "One-time",
      cost: "$0-$50",
      criticality: "Critical",
      notes: "Collect and remit sales tax",
    },
    {
      requirement: "EIN (Employer ID)",
      authority: "IRS",
      frequency: "One-time",
      cost: "Free",
      criticality: "Critical",
      notes: "For tax purposes and hiring",
    },
    {
      requirement: "Alcohol License",
      authority: "State ABC Board",
      frequency: "Annual",
      cost: "$500-$3,000",
      criticality: "High",
      notes: "If selling beer/wine",
    },
    {
      requirement: "Fire Safety Inspection",
      authority: "Fire Department",
      frequency: "Annual",
      cost: "$100-$300",
      criticality: "High",
      notes: "Safety compliance",
    },
    {
      requirement: "Workers Compensation",
      authority: "State Insurance",
      frequency: "Annual",
      cost: "Varies",
      criticality: "Critical",
      notes: "If you have employees",
    },
    {
      requirement: "Money Transfer License",
      authority: "State Banking Dept",
      frequency: "Annual",
      cost: "$1,000-$5,000",
      criticality: "High",
      notes: "To offer Western Union, etc.",
    },
    {
      requirement: "Health Inspections",
      authority: "Health Department",
      frequency: "2-4x per year",
      cost: "Included",
      criticality: "Critical",
      notes: "Surprise visits possible",
    },
  ];

  TableRenderer.render(
    complianceRequirements,
    [
      { key: "requirement", label: "License/Permit", width: 24 },
      { key: "authority", label: "Authority", width: 18 },
      { key: "frequency", label: "Frequency", width: 12, align: "center" },
      { key: "cost", label: "Cost", width: 12, align: "right" },
      {
        key: "criticality",
        label: "Criticality",
        width: 12,
        formatter: (crit: string) => {
          return crit === "Critical"
            ? ColorSystem.colorize(crit, ColorSystem.codes.brightRed)
            : ColorSystem.colorize(crit, ColorSystem.codes.yellow);
        },
      },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "⚖️  LEGAL & COMPLIANCE BEST PRACTICES",
      "",
      "Documentation Requirements:",
      "  • Keep all licenses posted and visible",
      "  • Maintain records for 7+ years (receipts, invoices)",
      "  • Document employee training (food safety, etc.)",
      "  • Keep health inspection reports on file",
      "",
      "Employment Compliance:",
      "  • Verify work eligibility (I-9 forms)",
      "  • Comply with minimum wage laws",
      "  • Provide workers compensation insurance",
      "  • Follow labor law posting requirements",
      "  • Track hours for overtime compliance",
      "",
      "Food Safety:",
      "  • All food handlers must be certified",
      "  • Maintain proper food storage temperatures",
      "  • Follow FIFO (First In, First Out) rotation",
      "  • Keep cleaning logs and temperature logs",
      "  • Have procedures for health emergencies",
      "",
      "Financial Compliance:",
      "  • File quarterly sales tax returns",
      "  • Pay estimated income taxes quarterly",
      "  • Issue W-2s to employees annually",
      "  • Issue 1099s to contractors",
      "  • Maintain separate business bank accounts",
      "",
      "Common Violations to Avoid:",
      "  ⚠️  Selling alcohol without proper license",
      "  ⚠️  Not collecting/remitting sales tax",
      "  ⚠️  Food safety violations (temp, cleanliness)",
      "  ⚠️  Improper employee classification",
      "  ⚠️  Expired licenses or permits",
    ],
    {
      title: "📋 Compliance Checklist",
      style: "double",
      color: ColorSystem.codes.brightRed,
      padding: 1,
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 10: GROWTH STRATEGIES
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightGreen));
  console.log(ColorSystem.colorize(" SECTION 9: GROWTH STRATEGIES & SCALING", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightGreen));
  console.log("");

  logger.info("Analyzing growth opportunities...");
  const spinner8 = new Spinner({ message: "Developing growth strategy..." });
  spinner8.start();
  await sleep(1200);
  spinner8.succeed("Growth plan ready");
  console.log("");

  const growthStrategies = [
    {
      strategy: "Expand Hot Food Menu",
      timeframe: "6-12 months",
      investment: "$5,000-$15,000",
      expectedROI: "25-40%",
      difficulty: "Medium",
      impact: "High - increases margins and foot traffic",
    },
    {
      strategy: "Add Gas Station",
      timeframe: "1-2 years",
      investment: "$200,000-$500,000",
      expectedROI: "15-25%",
      difficulty: "High",
      impact: "Very High - major revenue driver",
    },
    {
      strategy: "Catering Services",
      timeframe: "3-6 months",
      investment: "$2,000-$5,000",
      expectedROI: "30-50%",
      difficulty: "Low",
      impact: "Medium - additional revenue stream",
    },
    {
      strategy: "Second Location",
      timeframe: "2-3 years",
      investment: "$100,000-$200,000",
      expectedROI: "20-35%",
      difficulty: "High",
      impact: "Very High - scale the model",
    },
    {
      strategy: "Online Ordering/Delivery",
      timeframe: "6-12 months",
      investment: "$3,000-$8,000",
      expectedROI: "15-30%",
      difficulty: "Medium",
      impact: "Medium - reach new customers",
    },
    {
      strategy: "Taquería/Restaurant Section",
      timeframe: "1-2 years",
      investment: "$30,000-$80,000",
      expectedROI: "25-45%",
      difficulty: "High",
      impact: "High - premium pricing",
    },
    {
      strategy: "Loyalty/Rewards Program",
      timeframe: "3-6 months",
      investment: "$1,000-$3,000",
      expectedROI: "10-20%",
      difficulty: "Low",
      impact: "Medium - customer retention",
    },
  ];

  TableRenderer.render(
    growthStrategies,
    [
      { key: "strategy", label: "Growth Strategy", width: 26 },
      { key: "timeframe", label: "Timeline", width: 14, align: "center" },
      { key: "investment", label: "Investment", width: 18 },
      { key: "expectedROI", label: "ROI", width: 12, align: "center" },
      {
        key: "difficulty",
        label: "Difficulty",
        width: 12,
        formatter: (diff: string) => {
          if (diff === "High") return ColorSystem.colorize(diff, ColorSystem.codes.red);
          if (diff === "Medium") return ColorSystem.colorize(diff, ColorSystem.codes.yellow);
          return ColorSystem.colorize(diff, ColorSystem.codes.green);
        },
      },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "📈 SCALING YOUR TIENDA BUSINESS",
      "",
      "Phase 1: Optimize Current Operations (Year 1)",
      "  • Perfect your hot food offerings",
      "  • Build strong customer relationships",
      "  • Establish reliable supplier network",
      "  • Implement technology systems (POS, inventory)",
      "  • Build cash reserves for expansion",
      "",
      "Phase 2: Add High-Margin Services (Year 2)",
      "  • Expand prepared food menu",
      "  • Add catering services",
      "  • Implement loyalty program",
      "  • Consider adding beer/wine sales",
      "  • Optimize inventory and reduce waste",
      "",
      "Phase 3: Major Expansion (Year 3+)",
      "  • Add gas station (if feasible)",
      "  • Open second location",
      "  • Develop full-service restaurant section",
      "  • Explore franchising opportunities",
      "",
      "Critical Success Factors:",
      "  ✓ Maintain quality as you grow",
      "  ✓ Don't overextend financially",
      "  ✓ Keep family/cultural values central",
      "  ✓ Hire and train reliable staff",
      "  ✓ Stay connected to community needs",
      "  ✓ Reinvest profits strategically",
      "",
      "Common Pitfalls to Avoid:",
      "  ⚠️  Growing too fast without solid foundation",
      "  ⚠️  Losing personal touch with customers",
      "  ⚠️  Taking on too much debt",
      "  ⚠️  Neglecting existing business for new ventures",
      "  ⚠️  Compromising quality for volume",
    ],
    {
      title: "🎯 Growth Roadmap",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    }
  );
  console.log("");

  // Growth timeline visualization
  console.log(ColorSystem.colorize("  Growth Investment Timeline:", ColorSystem.codes.bright));
  console.log("");

  ChartRenderer.barChart(
    [
      { label: "Year 1: Foundation", value: 15000 },
      { label: "Year 2: Optimization", value: 35000 },
      { label: "Year 3: Expansion", value: 150000 },
      { label: "Year 4: Scaling", value: 200000 },
      { label: "Year 5: Multi-Location", value: 250000 },
    ],
    {
      width: 55,
      showValues: true,
      color: ColorSystem.codes.brightMagenta,
      title: "Investment Progression ($)",
    }
  );
  console.log("");

  await sleep(2000);

  // ==========================================================================
  // SECTION 11: CONCLUSION & KEY TAKEAWAYS
  // ==========================================================================

  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  console.log(ColorSystem.colorize(" CONCLUSION: KEY INSIGHTS & BEST PRACTICES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("═".repeat(100), ColorSystem.codes.brightCyan));
  console.log("");

  logger.info("Preparing final summary...");
  const spinnerFinal = new Spinner({ message: "Compiling key takeaways..." });
  spinnerFinal.start();
  await sleep(1000);
  spinnerFinal.succeed("Summary complete");
  console.log("");

  BoxRenderer.render(
    [
      "🎓 KEY LESSONS FROM MEXICAN CONVENIENCE STORE OPERATIONS",
      "",
      "1. COMMUNITY IS EVERYTHING",
      "   • Mexican tiendas succeed by becoming community anchors",
      "   • Personal relationships drive loyalty and repeat business",
      "   • Cultural authenticity is non-negotiable",
      "   • Trust-based systems (like fiado) strengthen bonds",
      "",
      "2. DIVERSIFIED REVENUE IS CRITICAL",
      "   • Multiple income streams create business resilience",
      "   • Hot food provides highest margins",
      "   • Services (money transfer, bill pay) add stability",
      "   • Gas stations significantly boost revenue",
      "",
      "3. OPERATIONAL EXCELLENCE MATTERS",
      "   • Fresh products delivered daily build reputation",
      "   • Consistent quality keeps customers returning",
      "   • Efficient inventory management protects cash flow",
      "   • Staff training ensures good service",
      "",
      "4. CULTURAL COMPETENCE DRIVES SUCCESS",
      "   • Understanding customer origins and preferences",
      "   • Stocking products from specific Mexican regions",
      "   • Spanish-language environment creates comfort",
      "   • Respecting cultural business practices (haggling, fiado)",
      "",
      "5. FINANCIAL DISCIPLINE ENABLES GROWTH",
      "   • Daily cash management prevents losses",
      "   • Supplier relationships provide favorable terms",
      "   • Reinvesting profits funds expansion",
      "   • Avoiding excessive debt maintains flexibility",
      "",
      "6. TECHNOLOGY ENHANCES TRADITION",
      "   • Modern POS systems don't replace personal service",
      "   • Security cameras protect business assets",
      "   • Inventory software reduces waste",
      "   • Digital tools amplify cultural strengths",
      "",
      "7. COMPLIANCE PROTECTS THE BUSINESS",
      "   • Proper licensing avoids legal troubles",
      "   • Food safety ensures customer health",
      "   • Employment compliance prevents penalties",
      "   • Insurance protects against disasters",
      "",
      "The Mexican convenience store model proves that small businesses",
      "can thrive by deeply understanding and serving their communities,",
      "offering authentic products, and building trust through personal",
      "relationships. Success comes from balancing tradition with innovation,",
      "cultural authenticity with business efficiency, and profit with",
      "community service.",
    ],
    {
      title: "🏆 Summary & Conclusions",
      style: "double",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    }
  );
  console.log("");

  // Final success metrics
  const successMetrics = [
    { metric: "Customer Retention Rate", target: "85-95%", importance: "Critical" },
    { metric: "Gross Profit Margin", target: "30-40%", importance: "High" },
    { metric: "Net Profit Margin", target: "7-12%", importance: "High" },
    { metric: "Inventory Turnover", target: "15-25x/year", importance: "Medium" },
    { metric: "Break-Even Timeline", target: "8-14 months", importance: "High" },
    { metric: "Customer Satisfaction", target: "90%+", importance: "Critical" },
    { metric: "Employee Retention", target: "80%+ annually", importance: "Medium" },
  ];

  console.log(ColorSystem.colorize("  Key Performance Indicators for Success:", ColorSystem.codes.bright));
  console.log("");

  TableRenderer.render(
    successMetrics,
    [
      { key: "metric", label: "Success Metric", width: 28 },
      { key: "target", label: "Target Range", width: 18, align: "center" },
      {
        key: "importance",
        label: "Importance",
        width: 14,
        formatter: (imp: string) => {
          if (imp === "Critical") return ColorSystem.colorize(imp, ColorSystem.codes.brightRed);
          return ColorSystem.colorize(imp, ColorSystem.codes.yellow);
        },
      },
    ],
    { showIndex: true }
  );
  console.log("");

  BoxRenderer.render(
    [
      "🌟 FINAL THOUGHTS",
      "",
      "Mexican convenience stores represent a unique fusion of:",
      "  • Traditional Mexican commerce practices",
      "  • American small business operations",
      "  • Community social infrastructure",
      "  • Financial service access points",
      "",
      "They succeed not just as businesses, but as cultural institutions",
      "that preserve identity, provide essential services, and create",
      "economic opportunities for Hispanic communities.",
      "",
      "For aspiring tienda owners:",
      "  ✓ Start with passion for serving your community",
      "  ✓ Learn the business thoroughly before opening",
      "  ✓ Build relationships with customers and suppliers",
      "  ✓ Manage finances conservatively",
      "  ✓ Never compromise on quality or authenticity",
      "  ✓ Embrace technology while honoring tradition",
      "",
      "¡Éxito en su tienda! (Success in your store!)",
    ],
    {
      title: "💚 Closing Message",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    }
  );
  console.log("");

  logger.success("Presentation complete! Thank you for learning about tienda operations.");
  console.log("");
  console.log(
    ColorSystem.colorize(
      "  For more information, visit your local tienda and experience the culture firsthand! 🏪\n",
      ColorSystem.codes.brightCyan
    )
  );
};

// ============================================================================
// RUN THE PRESENTATION
// ============================================================================

if (import.meta.main) {
  await runPresentation();
}
