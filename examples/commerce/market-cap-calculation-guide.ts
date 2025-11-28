#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Market Capitalization Calculation Guide
 *
 * A comprehensive educational guide explaining how market capitalization
 * is calculated, what it means, and how to analyze it using GenesisTrace.
 *
 * Topics covered:
 *   - What is market capitalization?
 *   - How to calculate market cap
 *   - Different market cap categories (Mega, Large, Mid, Small, Micro)
 *   - Why market cap matters for investors
 *   - Common misconceptions about market cap
 *   - Real-world examples with calculations
 *   - Market cap vs enterprise value
 *   - Practical applications for portfolio analysis
 */

import {
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

// Initialize logger with neon theme for better visibility
const config = new ConfigBuilder()
  .theme(neonTheme)
  .logLevel("info")
  .build();

const logger = new Logger(config);

// Company data structure for examples
interface Company {
  ticker: string;
  name: string;
  outstandingShares: number; // in millions
  sharePrice: number;
  marketCap?: number; // calculated
  category?: string;
}

// Sample companies for demonstration
const exampleCompanies: Company[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    outstandingShares: 15441, // ~15.4 billion shares
    sharePrice: 228.52,
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    outstandingShares: 7430, // ~7.4 billion shares
    sharePrice: 417.79,
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    outstandingShares: 12350, // ~12.4 billion shares
    sharePrice: 176.48,
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    outstandingShares: 3204, // ~3.2 billion shares
    sharePrice: 352.56,
  },
  {
    ticker: "XYZ",
    name: "Mid Cap Example Corp.",
    outstandingShares: 150, // 150 million shares
    sharePrice: 45.00,
  },
  {
    ticker: "ABC",
    name: "Small Cap Example Inc.",
    outstandingShares: 50, // 50 million shares
    sharePrice: 28.50,
  },
];

/**
 * Calculate market capitalization
 * Formula: Market Cap = Outstanding Shares × Current Share Price
 */
function calculateMarketCap(outstandingShares: number, sharePrice: number): number {
  return (outstandingShares * sharePrice) / 1000; // Convert to billions
}

/**
 * Categorize company by market cap
 */
function categorizeMarketCap(marketCapBillions: number): string {
  if (marketCapBillions >= 200) return "Mega-Cap";
  if (marketCapBillions >= 10) return "Large-Cap";
  if (marketCapBillions >= 2) return "Mid-Cap";
  if (marketCapBillions >= 0.3) return "Small-Cap";
  return "Micro-Cap";
}

/**
 * Format market cap with appropriate units
 */
function formatMarketCap(marketCapBillions: number): string {
  if (marketCapBillions >= 1000) {
    return `$${(marketCapBillions / 1000).toFixed(2)}T`;
  }
  return `$${marketCapBillions.toFixed(2)}B`;
}

/**
 * Calculate and categorize all companies
 */
function processCompanies(companies: Company[]): Company[] {
  return companies.map((company) => {
    const marketCap = calculateMarketCap(
      company.outstandingShares,
      company.sharePrice
    );
    return {
      ...company,
      marketCap,
      category: categorizeMarketCap(marketCap),
    };
  });
}

// Main sections of the guide

function renderIntroduction() {
  console.clear();

  BoxRenderer.render(
    [
      "MARKET CAPITALIZATION: COMPLETE CALCULATION GUIDE",
      "",
      "Learn how to calculate and understand market capitalization,",
      "one of the most important metrics in equity analysis.",
      "",
      "Perfect for: investors, traders, students, and analysts",
    ],
    {
      title: "📊 MARKET CAP GUIDE",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    }
  );
}

function renderWhatIsMarketCap() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("WHAT IS MARKET CAPITALIZATION?", ColorSystem.codes.bright)
  );
  console.log("");

  BoxRenderer.render(
    [
      "Market capitalization (market cap) is the total market value of a",
      "company's outstanding shares of stock.",
      "",
      "It represents what the market believes the company is worth in total.",
      "",
      ColorSystem.colorize("Key Points:", ColorSystem.codes.brightYellow),
      "  • Reflects the company's size in dollar terms",
      "  • Changes constantly as stock price fluctuates",
      "  • Used to categorize companies (mega, large, mid, small cap)",
      "  • Important for index inclusion and portfolio allocation",
      "  • NOT the same as enterprise value or book value",
    ],
    {
      title: "Definition",
      style: "rounded",
      color: ColorSystem.codes.green,
      padding: 1,
    }
  );
}

function renderCalculationFormula() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("THE MARKET CAP CALCULATION FORMULA", ColorSystem.codes.bright)
  );
  console.log("");

  console.log(
    ColorSystem.colorize("  Market Cap = Outstanding Shares × Current Share Price", ColorSystem.codes.brightMagenta)
  );
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("Components Explained:", ColorSystem.codes.brightCyan),
      "",
      "1. OUTSTANDING SHARES",
      "   • Total number of shares currently held by shareholders",
      "   • Includes institutional and retail investors",
      "   • Excludes treasury shares (shares bought back by company)",
      "   • Can change due to stock buybacks, splits, or new issuances",
      "",
      "2. CURRENT SHARE PRICE",
      "   • The latest trading price of one share",
      "   • Changes every second during market hours",
      "   • Determined by supply and demand in the market",
      "   • Reflects investor sentiment and company performance",
      "",
      ColorSystem.colorize("Important:", ColorSystem.codes.yellow),
      "Market cap is a dynamic metric that changes with stock price!",
    ],
    {
      title: "Formula Breakdown",
      style: "single",
      color: ColorSystem.codes.blue,
      padding: 1,
    }
  );
}

function renderStepByStepExample() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("STEP-BY-STEP CALCULATION EXAMPLE", ColorSystem.codes.bright)
  );
  console.log("");

  // Use Apple as example
  const apple = {
    ticker: "AAPL",
    name: "Apple Inc.",
    outstandingShares: 15441, // millions
    sharePrice: 228.52,
  };

  console.log(ColorSystem.colorize("Example: Apple Inc. (AAPL)", ColorSystem.codes.brightCyan));
  console.log("");

  console.log(ColorSystem.colorize("Step 1: Find Outstanding Shares", ColorSystem.codes.yellow));
  console.log(`  Outstanding shares: ${apple.outstandingShares.toLocaleString()} million shares`);
  console.log(`  ${ColorSystem.colorize("Source: Company's 10-K filing or financial websites", ColorSystem.codes.dim)}`);
  console.log("");

  console.log(ColorSystem.colorize("Step 2: Find Current Share Price", ColorSystem.codes.yellow));
  console.log(`  Current price: $${apple.sharePrice.toFixed(2)}`);
  console.log(`  ${ColorSystem.colorize("Source: Stock exchange, real-time market data", ColorSystem.codes.dim)}`);
  console.log("");

  console.log(ColorSystem.colorize("Step 3: Multiply Shares × Price", ColorSystem.codes.yellow));
  console.log(`  ${apple.outstandingShares.toLocaleString()} million × $${apple.sharePrice.toFixed(2)}`);
  console.log("");

  const marketCapMillion = apple.outstandingShares * apple.sharePrice;
  console.log(ColorSystem.colorize("Step 4: Calculate Total", ColorSystem.codes.yellow));
  console.log(`  = ${marketCapMillion.toLocaleString()} million`);
  console.log(`  = $${(marketCapMillion / 1000).toFixed(2)} billion`);
  console.log(`  = $${(marketCapMillion / 1000000).toFixed(2)} trillion`);
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize(`Apple's Market Capitalization: ${formatMarketCap(marketCapMillion / 1000)}`, ColorSystem.codes.brightGreen),
      "",
      `This means the market values Apple at approximately`,
      `${formatMarketCap(marketCapMillion / 1000)} in total.`,
    ],
    {
      title: "Result",
      style: "double",
      color: ColorSystem.codes.green,
      padding: 1,
    }
  );
}

function renderMultipleExamples(companies: Company[]) {
  console.log("\n");
  console.log(
    ColorSystem.colorize("MULTIPLE COMPANY EXAMPLES", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    companies.map((company) => ({
      ticker: ColorSystem.colorize(company.ticker, ColorSystem.codes.brightCyan),
      name: company.name,
      shares: `${company.outstandingShares.toLocaleString()}M`,
      price: `$${company.sharePrice.toFixed(2)}`,
      calculation: `${company.outstandingShares.toLocaleString()}M × $${company.sharePrice.toFixed(2)}`,
      marketCap: ColorSystem.colorize(
        formatMarketCap(company.marketCap!),
        company.marketCap! >= 200 ? ColorSystem.codes.brightGreen : ColorSystem.codes.cyan
      ),
      category: ColorSystem.colorize(
        company.category!,
        company.category === "Mega-Cap"
          ? ColorSystem.codes.brightGreen
          : company.category === "Large-Cap"
          ? ColorSystem.codes.green
          : company.category === "Mid-Cap"
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.cyan
      ),
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "name", label: "Company Name", width: 24 },
      { key: "shares", label: "Shares Out", width: 12, align: "right" },
      { key: "price", label: "Price", width: 10, align: "right" },
      { key: "marketCap", label: "Market Cap", width: 14, align: "right" },
      { key: "category", label: "Category", width: 12, align: "center" },
    ]
  );
}

function renderMarketCapCategories() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("MARKET CAP CATEGORIES & CLASSIFICATIONS", ColorSystem.codes.bright)
  );
  console.log("");

  const categories = [
    {
      category: "Mega-Cap",
      range: "$200B+",
      description: "Largest, most established companies",
      examples: "Apple, Microsoft, Amazon, Alphabet",
      characteristics: "Lower risk, stable, dividend-paying",
      color: ColorSystem.codes.brightGreen,
    },
    {
      category: "Large-Cap",
      range: "$10B - $200B",
      description: "Well-established major corporations",
      examples: "Starbucks, Adobe, Nike, PayPal",
      characteristics: "Moderate risk, proven track record",
      color: ColorSystem.codes.green,
    },
    {
      category: "Mid-Cap",
      range: "$2B - $10B",
      description: "Growing companies with expansion potential",
      examples: "Etsy, Zoom, DocuSign, Snapchat",
      characteristics: "Moderate-high risk, growth focused",
      color: ColorSystem.codes.yellow,
    },
    {
      category: "Small-Cap",
      range: "$300M - $2B",
      description: "Smaller companies with high growth potential",
      examples: "Regional banks, specialty retailers",
      characteristics: "Higher risk, volatile, growth-oriented",
      color: ColorSystem.codes.cyan,
    },
    {
      category: "Micro-Cap",
      range: "Under $300M",
      description: "Very small, often young companies",
      examples: "Startups, niche businesses",
      characteristics: "Highest risk, very volatile, speculative",
      color: ColorSystem.codes.dim,
    },
  ];

  TableRenderer.render(
    categories.map((cat) => ({
      category: ColorSystem.colorize(cat.category, cat.color),
      range: cat.range,
      description: cat.description,
      characteristics: cat.characteristics,
    })),
    [
      { key: "category", label: "Category", width: 14 },
      { key: "range", label: "Range", width: 16 },
      { key: "description", label: "Description", width: 32 },
      { key: "characteristics", label: "Risk/Characteristics", width: 28 },
    ]
  );

  console.log("");
  console.log(
    ColorSystem.colorize(
      "💡 Tip: Diversified portfolios often include a mix of different market cap categories",
      ColorSystem.codes.dim
    )
  );
}

function renderWhyMarketCapMatters() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("WHY MARKET CAP MATTERS FOR INVESTORS", ColorSystem.codes.bright)
  );
  console.log("");

  const reasons = [
    {
      reason: "Portfolio Diversification",
      explanation:
        "Investors allocate funds across different cap sizes to balance risk and growth potential",
      icon: "📊",
    },
    {
      reason: "Index Eligibility",
      explanation:
        "Indices like S&P 500 require minimum market cap thresholds for inclusion",
      icon: "📈",
    },
    {
      reason: "Investment Strategy",
      explanation:
        "Some funds specifically target large-cap (stability) or small-cap (growth) stocks",
      icon: "🎯",
    },
    {
      reason: "Liquidity Assessment",
      explanation:
        "Larger market caps typically mean higher trading volume and easier position exits",
      icon: "💧",
    },
    {
      reason: "Risk Evaluation",
      explanation:
        "Market cap correlates with business maturity and financial stability",
      icon: "⚖️",
    },
    {
      reason: "Relative Valuation",
      explanation:
        "Comparing market caps helps assess company size and competitive positioning",
      icon: "🔍",
    },
  ];

  reasons.forEach((item) => {
    console.log(
      ColorSystem.colorize(
        `${item.icon} ${item.reason}`,
        ColorSystem.codes.brightCyan
      )
    );
    console.log(`   ${item.explanation}`);
    console.log("");
  });
}

function renderCommonMisconceptions() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("COMMON MISCONCEPTIONS ABOUT MARKET CAP", ColorSystem.codes.bright)
  );
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("❌ MYTH #1: Higher market cap = better investment", ColorSystem.codes.red),
      "   Reality: Market cap indicates size, not quality or investment potential.",
      "   A small-cap company might outperform a mega-cap in returns.",
      "",
      ColorSystem.colorize("❌ MYTH #2: Market cap = company's actual value", ColorSystem.codes.red),
      "   Reality: It's the market's perception of value, which can be wrong.",
      "   Consider fundamentals, not just market sentiment.",
      "",
      ColorSystem.colorize("❌ MYTH #3: Market cap = enterprise value", ColorSystem.codes.red),
      "   Reality: Enterprise value includes debt and excludes cash.",
      "   Formula: EV = Market Cap + Debt - Cash",
      "",
      ColorSystem.colorize("❌ MYTH #4: Market cap can't change quickly", ColorSystem.codes.red),
      "   Reality: During volatile periods, market cap can swing billions in hours.",
      "   Example: Tech stocks during earnings announcements.",
      "",
      ColorSystem.colorize("❌ MYTH #5: All shares count in market cap", ColorSystem.codes.red),
      "   Reality: Only outstanding shares count (not authorized or treasury shares).",
      "   Check the latest filings for accurate share counts.",
    ],
    {
      title: "Don't Be Fooled",
      style: "bold",
      color: ColorSystem.codes.yellow,
      padding: 1,
    }
  );
}

function renderMarketCapVsEnterpriseValue() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("MARKET CAP VS ENTERPRISE VALUE", ColorSystem.codes.bright)
  );
  console.log("");

  console.log(ColorSystem.colorize("Market Capitalization:", ColorSystem.codes.cyan));
  console.log("  = Outstanding Shares × Share Price");
  console.log("  = Equity value only");
  console.log("");

  console.log(ColorSystem.colorize("Enterprise Value (EV):", ColorSystem.codes.magenta));
  console.log("  = Market Cap + Total Debt - Cash & Equivalents");
  console.log("  = Total company value (equity + debt)");
  console.log("");

  // Example comparison
  const exampleCompany = {
    name: "Example Corp",
    marketCap: 100, // billions
    totalDebt: 30,
    cash: 10,
  };

  const enterpriseValue = exampleCompany.marketCap + exampleCompany.totalDebt - exampleCompany.cash;

  TableRenderer.render(
    [
      {
        metric: "Market Cap",
        value: `$${exampleCompany.marketCap}B`,
        description: "What equity investors own",
      },
      {
        metric: "+ Total Debt",
        value: `$${exampleCompany.totalDebt}B`,
        description: "Company's borrowings",
      },
      {
        metric: "- Cash",
        value: `$${exampleCompany.cash}B`,
        description: "Liquid assets",
      },
      {
        metric: ColorSystem.colorize("= Enterprise Value", ColorSystem.codes.brightGreen),
        value: ColorSystem.colorize(`$${enterpriseValue}B`, ColorSystem.codes.brightGreen),
        description: "Total value to acquire company",
      },
    ],
    [
      { key: "metric", label: "Component", width: 24 },
      { key: "value", label: "Amount", width: 14, align: "right" },
      { key: "description", label: "Meaning", width: 36 },
    ]
  );

  console.log("");
  console.log(
    ColorSystem.colorize(
      "💡 Use EV when comparing companies with different capital structures (debt levels)",
      ColorSystem.codes.dim
    )
  );
}

function renderPracticalApplications() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("PRACTICAL APPLICATIONS & USE CASES", ColorSystem.codes.bright)
  );
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("1. PORTFOLIO ALLOCATION", ColorSystem.codes.brightYellow),
      "   • Decide what % to allocate to large vs small cap",
      "   • Example: 60% large-cap, 30% mid-cap, 10% small-cap",
      "",
      ColorSystem.colorize("2. COMPETITIVE ANALYSIS", ColorSystem.codes.brightYellow),
      "   • Compare companies in same industry by market cap",
      "   • Identify market leaders vs emerging players",
      "",
      ColorSystem.colorize("3. INDEX TRACKING", ColorSystem.codes.brightYellow),
      "   • Understand which companies dominate indices",
      "   • S&P 500 is market-cap weighted (bigger = more influence)",
      "",
      ColorSystem.colorize("4. MERGER & ACQUISITION VALUATION", ColorSystem.codes.brightYellow),
      "   • Initial reference point for takeover valuations",
      "   • Acquirers typically pay premium above market cap",
      "",
      ColorSystem.colorize("5. RISK ASSESSMENT", ColorSystem.codes.brightYellow),
      "   • Quick gauge of company size and stability",
      "   • Larger caps generally have lower bankruptcy risk",
      "",
      ColorSystem.colorize("6. SCREENING & FILTERING", ColorSystem.codes.brightYellow),
      "   • Filter stocks by market cap for targeted research",
      "   • Many trading platforms offer market cap filters",
    ],
    {
      title: "How Professionals Use Market Cap",
      style: "rounded",
      color: ColorSystem.codes.blue,
      padding: 1,
    }
  );
}

function renderMarketCapChart(companies: Company[]) {
  console.log("\n");
  console.log(
    ColorSystem.colorize("MARKET CAP VISUAL COMPARISON", ColorSystem.codes.bright)
  );
  console.log("");

  const chartData = companies
    .filter((c) => c.marketCap! >= 1) // Show only larger companies for clarity
    .map((company) => ({
      label: company.ticker,
      value: company.marketCap!,
    }))
    .sort((a, b) => b.value - a.value);

  ChartRenderer.barChart(chartData, {
    showValues: true,
    width: 50,
    valueFormatter: (v: number) => formatMarketCap(v),
    title: "Market Capitalization (Billions)",
  });
}

function renderCalculationWorksheet() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("🧮 PRACTICE CALCULATION WORKSHEET", ColorSystem.codes.bright)
  );
  console.log("");

  const exercises = [
    {
      company: "Company A",
      shares: "500 million",
      price: "$50.00",
      answer: "$25B (Mid-Cap)",
    },
    {
      company: "Company B",
      shares: "2,000 million",
      price: "$150.00",
      answer: "$300B (Mega-Cap)",
    },
    {
      company: "Company C",
      shares: "75 million",
      price: "$20.00",
      answer: "$1.5B (Small-Cap)",
    },
  ];

  const practiceLines = ["Try calculating market cap for these examples:", ""];

  exercises.forEach((ex, i) => {
    practiceLines.push(`${i + 1}. ${ex.company}: ${ex.shares} shares × ${ex.price}`);
    practiceLines.push(`   ${ColorSystem.colorize(`Answer: ${ex.answer}`, ColorSystem.codes.dim)}`);
    if (i < exercises.length - 1) {
      practiceLines.push("");
    }
  });

  BoxRenderer.render(
    practiceLines,
    {
      title: "Practice Problems",
      style: "single",
      color: ColorSystem.codes.cyan,
      padding: 1,
    }
  );
}

function renderKeyTakeaways() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("🎓 KEY TAKEAWAYS & SUMMARY", ColorSystem.codes.bright)
  );
  console.log("");

  BoxRenderer.render(
    [
      ColorSystem.colorize("ESSENTIAL POINTS TO REMEMBER:", ColorSystem.codes.brightGreen),
      "",
      "✓ Market Cap = Outstanding Shares × Current Share Price",
      "",
      "✓ Categories range from Micro-Cap (<$300M) to Mega-Cap ($200B+)",
      "",
      "✓ Market cap indicates size, NOT quality or value",
      "",
      "✓ Different from enterprise value (which includes debt)",
      "",
      "✓ Changes constantly as stock price fluctuates",
      "",
      "✓ Important for diversification, indexing, and strategy",
      "",
      "✓ Find data in 10-K filings and financial websites",
      "",
      ColorSystem.colorize("NEXT STEPS:", ColorSystem.codes.brightYellow),
      "",
      "→ Practice calculating market cap for your portfolio",
      "→ Use market cap for initial company size assessment",
      "→ Combine with other metrics (P/E, EV, revenue) for full picture",
      "→ Monitor changes in market cap over time",
    ],
    {
      title: "SUMMARY",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
    }
  );
}

function renderResources() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("📚 ADDITIONAL RESOURCES", ColorSystem.codes.bright)
  );
  console.log("");

  const resources = [
    {
      category: "Data Sources",
      items: [
        "Yahoo Finance - Free real-time market cap data",
        "SEC EDGAR - Official 10-K/10-Q filings",
        "Bloomberg Terminal - Professional data",
        "Company investor relations pages",
      ],
    },
    {
      category: "Related Metrics",
      items: [
        "Enterprise Value (EV)",
        "Price-to-Earnings Ratio (P/E)",
        "Price-to-Sales Ratio (P/S)",
        "Price-to-Book Ratio (P/B)",
      ],
    },
    {
      category: "Further Learning",
      items: [
        "Study capital structure and dilution",
        "Learn about stock splits and their impact",
        "Understand float vs outstanding shares",
        "Research market-cap weighted indices",
      ],
    },
  ];

  resources.forEach((section) => {
    console.log(
      ColorSystem.colorize(section.category + ":", ColorSystem.codes.cyan)
    );
    section.items.forEach((item) => {
      console.log(`  • ${item}`);
    });
    console.log("");
  });
}

function renderCodeExample() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("💻 CODE IMPLEMENTATION EXAMPLE", ColorSystem.codes.bright)
  );
  console.log("");

  const codeSnippet = `
${ColorSystem.colorize("// Market Cap Calculator using GenesisTrace", ColorSystem.codes.dim)}

${ColorSystem.colorize("function", ColorSystem.codes.magenta)} ${ColorSystem.colorize("calculateMarketCap", ColorSystem.codes.yellow)}(
  outstandingShares: ${ColorSystem.colorize("number", ColorSystem.codes.cyan)},
  sharePrice: ${ColorSystem.colorize("number", ColorSystem.codes.cyan)}
): ${ColorSystem.colorize("number", ColorSystem.codes.cyan)} {
  ${ColorSystem.colorize("return", ColorSystem.codes.magenta)} (outstandingShares * sharePrice) / ${ColorSystem.colorize("1000", ColorSystem.codes.green)};
}

${ColorSystem.colorize("// Example usage", ColorSystem.codes.dim)}
${ColorSystem.colorize("const", ColorSystem.codes.magenta)} apple = {
  outstandingShares: ${ColorSystem.colorize("15441", ColorSystem.codes.green)}, ${ColorSystem.colorize("// millions", ColorSystem.codes.dim)}
  sharePrice: ${ColorSystem.colorize("228.52", ColorSystem.codes.green)},
};

${ColorSystem.colorize("const", ColorSystem.codes.magenta)} marketCap = ${ColorSystem.colorize("calculateMarketCap", ColorSystem.codes.yellow)}(
  apple.outstandingShares,
  apple.sharePrice
);

${ColorSystem.colorize("console", ColorSystem.codes.cyan)}.${ColorSystem.colorize("log", ColorSystem.codes.yellow)}(${ColorSystem.colorize("`Market Cap: $", ColorSystem.codes.green)}\${marketCap.toFixed(${ColorSystem.colorize("2", ColorSystem.codes.green)})}B${ColorSystem.colorize("`", ColorSystem.codes.green)});
${ColorSystem.colorize("// Output: Market Cap: $3528.09B", ColorSystem.codes.dim)}
`;

  BoxRenderer.render(
    codeSnippet.split("\n"),
    {
      title: "TypeScript Example",
      style: "rounded",
      color: ColorSystem.codes.blue,
      padding: 1,
    }
  );
}

// Main execution function
async function main() {
  const spinner = new Spinner({
    message: "Preparing Market Cap Calculation Guide...",
    style: "dots",
  });

  spinner.start();
  await new Promise((resolve) => setTimeout(resolve, 1000));
  spinner.succeed("Guide ready!");

  // Calculate market caps for all companies
  const processedCompanies = processCompanies(exampleCompanies);

  // Render all sections
  renderIntroduction();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderWhatIsMarketCap();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderCalculationFormula();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderStepByStepExample();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderMultipleExamples(processedCompanies);
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderMarketCapChart(processedCompanies);
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderMarketCapCategories();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderWhyMarketCapMatters();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderCommonMisconceptions();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderMarketCapVsEnterpriseValue();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderPracticalApplications();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderCalculationWorksheet();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderCodeExample();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderResources();
  await new Promise((resolve) => setTimeout(resolve, 500));

  renderKeyTakeaways();

  console.log("\n");
  logger.success("Market Cap Calculation Guide completed successfully!");
  console.log("");
  console.log(
    ColorSystem.colorize(
      "💡 For more examples, see: examples/technology/mag7-evaluation.ts",
      ColorSystem.codes.dim
    )
  );
  console.log("");
}

// Run the guide
if (import.meta.main) {
  await main();
}
