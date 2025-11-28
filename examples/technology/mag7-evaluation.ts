#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Magnificent 7 Stock Evaluation Dashboard
 *
 * Comprehensive evaluation of the Magnificent 7 tech giants:
 * Apple (AAPL), Microsoft (MSFT), Alphabet (GOOGL), Amazon (AMZN),
 * Meta (META), Nvidia (NVDA), Tesla (TSLA)
 *
 * Features:
 *   - Real-time-style price display with change indicators
 *   - Market cap comparison chart
 *   - P/E ratio analysis
 *   - YTD performance tracking
 *   - Revenue & earnings tables
 *   - Technical sentiment indicators
 *   - Sector-weighted analysis
 */

import {
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  TableRenderer,
} from "../../mod.ts";

// Stock data interface
interface StockData {
  ticker: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number; // in billions
  peRatio: number;
  forwardPE: number;
  ytdReturn: number;
  revenue: number; // TTM in billions
  netIncome: number; // TTM in billions
  eps: number;
  dividend: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  avgVolume: number; // in millions
  sector: string;
  aiExposure: "High" | "Medium" | "Low";

  // Advanced metrics
  revenueGrowth: number; // YoY %
  earningsGrowth: number; // YoY %
  pegRatio: number;
  priceToSales: number;
  priceToBook: number;
  debtToEquity: number;
  currentRatio: number;
  freeCashFlow: number; // TTM in billions
  operatingMargin: number; // %
  roe: number; // Return on Equity %
  roa: number; // Return on Assets %

  // Risk metrics
  maxDrawdown: number; // %
  sharpeRatio: number;
  volatility: number; // Annualized %

  // Analyst data
  analystRating: "Strong Buy" | "Buy" | "Hold" | "Sell";
  priceTarget: number;
  numAnalysts: number;

  // Competitive
  marketShareTrend: "Growing" | "Stable" | "Declining";
  competitiveAdvantage: string;
}

// Latest Mag 7 data (Q4 2024 / November 2025 estimates)
const mag7Data: StockData[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 228.52,
    change: 3.47,
    changePercent: 1.54,
    marketCap: 3450,
    peRatio: 37.2,
    forwardPE: 31.5,
    ytdReturn: 22.8,
    revenue: 391.0,
    netIncome: 100.9,
    eps: 6.14,
    dividend: 0.99,
    beta: 1.24,
    fiftyTwoWeekHigh: 237.49,
    fiftyTwoWeekLow: 164.08,
    avgVolume: 48.5,
    sector: "Technology",
    aiExposure: "Medium",
    revenueGrowth: 2.1,
    earningsGrowth: 10.5,
    pegRatio: 3.54,
    priceToSales: 8.82,
    priceToBook: 50.2,
    debtToEquity: 1.73,
    currentRatio: 1.01,
    freeCashFlow: 99.6,
    operatingMargin: 30.7,
    roe: 147.3,
    roa: 27.8,
    maxDrawdown: -15.2,
    sharpeRatio: 1.82,
    volatility: 24.3,
    analystRating: "Buy",
    priceTarget: 245.00,
    numAnalysts: 48,
    marketShareTrend: "Stable",
    competitiveAdvantage: "Premium brand ecosystem, services revenue",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corp.",
    price: 417.79,
    change: 5.23,
    changePercent: 1.27,
    marketCap: 3100,
    peRatio: 35.8,
    forwardPE: 29.4,
    ytdReturn: 11.2,
    revenue: 245.1,
    netIncome: 88.1,
    eps: 11.67,
    dividend: 3.00,
    beta: 0.89,
    fiftyTwoWeekHigh: 468.35,
    fiftyTwoWeekLow: 362.90,
    avgVolume: 18.2,
    sector: "Technology",
    aiExposure: "High",
    revenueGrowth: 13.4,
    earningsGrowth: 21.7,
    pegRatio: 1.65,
    priceToSales: 12.65,
    priceToBook: 13.2,
    debtToEquity: 0.48,
    currentRatio: 1.77,
    freeCashFlow: 73.8,
    operatingMargin: 43.1,
    roe: 44.8,
    roa: 19.2,
    maxDrawdown: -18.6,
    sharpeRatio: 1.45,
    volatility: 21.8,
    analystRating: "Strong Buy",
    priceTarget: 485.00,
    numAnalysts: 52,
    marketShareTrend: "Growing",
    competitiveAdvantage: "Azure cloud dominance, AI integration leadership",
  },
  {
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 176.48,
    change: 2.89,
    changePercent: 1.66,
    marketCap: 2180,
    peRatio: 24.1,
    forwardPE: 20.8,
    ytdReturn: 26.4,
    revenue: 339.9,
    netIncome: 86.5,
    eps: 7.32,
    dividend: 0.20,
    beta: 1.05,
    fiftyTwoWeekHigh: 191.75,
    fiftyTwoWeekLow: 130.67,
    avgVolume: 22.8,
    sector: "Communication Services",
    aiExposure: "High",
    revenueGrowth: 11.2,
    earningsGrowth: 28.4,
    pegRatio: 0.85,
    priceToSales: 6.41,
    priceToBook: 7.8,
    debtToEquity: 0.11,
    currentRatio: 2.93,
    freeCashFlow: 69.5,
    operatingMargin: 32.4,
    roe: 29.2,
    roa: 17.6,
    maxDrawdown: -22.1,
    sharpeRatio: 1.67,
    volatility: 26.5,
    analystRating: "Strong Buy",
    priceTarget: 195.00,
    numAnalysts: 55,
    marketShareTrend: "Stable",
    competitiveAdvantage: "Search monopoly, YouTube, Gemini AI platform",
  },
  {
    ticker: "AMZN",
    name: "Amazon.com Inc.",
    price: 208.45,
    change: 4.12,
    changePercent: 2.01,
    marketCap: 2200,
    peRatio: 45.2,
    forwardPE: 35.6,
    ytdReturn: 37.1,
    revenue: 604.3,
    netIncome: 44.4,
    eps: 4.61,
    dividend: 0,
    beta: 1.16,
    fiftyTwoWeekHigh: 215.90,
    fiftyTwoWeekLow: 144.05,
    avgVolume: 41.3,
    sector: "Consumer Discretionary",
    aiExposure: "High",
    revenueGrowth: 12.6,
    earningsGrowth: 394.7,
    pegRatio: 0.11,
    priceToSales: 3.64,
    priceToBook: 8.9,
    debtToEquity: 0.57,
    currentRatio: 1.08,
    freeCashFlow: 47.7,
    operatingMargin: 10.7,
    roe: 21.9,
    roa: 6.8,
    maxDrawdown: -19.8,
    sharpeRatio: 1.92,
    volatility: 28.1,
    analystRating: "Strong Buy",
    priceTarget: 230.00,
    numAnalysts: 58,
    marketShareTrend: "Growing",
    competitiveAdvantage: "E-commerce dominance, AWS cloud leader, logistics",
  },
  {
    ticker: "META",
    name: "Meta Platforms Inc.",
    price: 589.34,
    change: 8.76,
    changePercent: 1.51,
    marketCap: 1510,
    peRatio: 27.8,
    forwardPE: 23.2,
    ytdReturn: 66.3,
    revenue: 149.8,
    netIncome: 54.2,
    eps: 21.21,
    dividend: 2.00,
    beta: 1.22,
    fiftyTwoWeekHigh: 602.95,
    fiftyTwoWeekLow: 326.90,
    avgVolume: 12.8,
    sector: "Communication Services",
    aiExposure: "High",
    revenueGrowth: 23.2,
    earningsGrowth: 72.5,
    pegRatio: 0.38,
    priceToSales: 10.08,
    priceToBook: 9.2,
    debtToEquity: 0.00,
    currentRatio: 2.74,
    freeCashFlow: 51.3,
    operatingMargin: 42.8,
    roe: 36.4,
    roa: 22.1,
    maxDrawdown: -24.3,
    sharpeRatio: 2.14,
    volatility: 31.2,
    analystRating: "Strong Buy",
    priceTarget: 650.00,
    numAnalysts: 51,
    marketShareTrend: "Growing",
    competitiveAdvantage: "Social media monopoly, AI ad targeting, Llama AI",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corp.",
    price: 141.95,
    change: 6.34,
    changePercent: 4.68,
    marketCap: 3480,
    peRatio: 65.4,
    forwardPE: 32.1,
    ytdReturn: 186.5,
    revenue: 96.3,
    netIncome: 55.3,
    eps: 2.17,
    dividend: 0.04,
    beta: 1.67,
    fiftyTwoWeekHigh: 152.89,
    fiftyTwoWeekLow: 45.01,
    avgVolume: 298.5,
    sector: "Technology",
    aiExposure: "High",
    revenueGrowth: 125.9,
    earningsGrowth: 168.0,
    pegRatio: 0.39,
    priceToSales: 36.13,
    priceToBook: 56.7,
    debtToEquity: 0.18,
    currentRatio: 3.91,
    freeCashFlow: 44.3,
    operatingMargin: 62.1,
    roe: 123.8,
    roa: 76.4,
    maxDrawdown: -27.5,
    sharpeRatio: 2.56,
    volatility: 45.7,
    analystRating: "Strong Buy",
    priceTarget: 175.00,
    numAnalysts: 62,
    marketShareTrend: "Growing",
    competitiveAdvantage: "AI chip monopoly, CUDA ecosystem, data center",
  },
  {
    ticker: "TSLA",
    name: "Tesla Inc.",
    price: 352.56,
    change: -8.24,
    changePercent: -2.28,
    marketCap: 1130,
    peRatio: 112.5,
    forwardPE: 78.4,
    ytdReturn: 41.8,
    revenue: 96.8,
    netIncome: 12.1,
    eps: 3.13,
    dividend: 0,
    beta: 2.31,
    fiftyTwoWeekHigh: 358.64,
    fiftyTwoWeekLow: 138.80,
    avgVolume: 95.2,
    sector: "Consumer Discretionary",
    aiExposure: "Medium",
    revenueGrowth: 18.8,
    earningsGrowth: -23.2,
    pegRatio: -4.85,
    priceToSales: 11.67,
    priceToBook: 16.4,
    debtToEquity: 0.17,
    currentRatio: 1.84,
    freeCashFlow: 4.2,
    operatingMargin: 9.2,
    roe: 28.9,
    roa: 11.3,
    maxDrawdown: -43.1,
    sharpeRatio: 1.23,
    volatility: 52.8,
    analystRating: "Hold",
    priceTarget: 295.00,
    numAnalysts: 45,
    marketShareTrend: "Declining",
    competitiveAdvantage: "EV brand leader, FSD technology, energy storage",
  },
];

// Initialize logger
const config = new ConfigBuilder()
  .theme(neonTheme)
  .logLevel("info")
  .build();

const logger = new Logger(config);

// Utility functions
function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

function formatChange(change: number, percent: number): string {
  const sign = change >= 0 ? "+" : "";
  const color = change >= 0 ? ColorSystem.codes.green : ColorSystem.codes.red;
  return ColorSystem.colorize(
    `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`,
    color
  );
}

function formatMarketCap(cap: number): string {
  if (cap >= 1000) {
    return `$${(cap / 1000).toFixed(2)}T`;
  }
  return `$${cap.toFixed(0)}B`;
}

function colorByValue(value: number, thresholds: { low: number; high: number }): string {
  if (value <= thresholds.low) {
    return ColorSystem.codes.green;
  } else if (value >= thresholds.high) {
    return ColorSystem.codes.red;
  }
  return ColorSystem.codes.yellow;
}

function getPerformanceColor(ytd: number): string {
  if (ytd >= 50) return ColorSystem.codes.brightGreen;
  if (ytd >= 20) return ColorSystem.codes.green;
  if (ytd >= 0) return ColorSystem.codes.yellow;
  return ColorSystem.codes.red;
}

// Dashboard sections
function renderHeader() {
  const timestamp = new Date().toLocaleString();
  const totalMarketCap = mag7Data.reduce((sum, s) => sum + s.marketCap, 0);

  BoxRenderer.render(
    [
      "MAGNIFICENT 7 STOCK EVALUATION",
      "",
      `Total Combined Market Cap: ${formatMarketCap(totalMarketCap)}`,
      `Last Updated: ${timestamp}`,
      "",
      "AAPL | MSFT | GOOGL | AMZN | META | NVDA | TSLA",
    ],
    {
      title: "MAG 7 DASHBOARD",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    }
  );
}

function renderPriceOverview() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("CURRENT PRICES & DAILY CHANGES", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      price: formatPrice(stock.price),
      change: formatChange(stock.change, stock.changePercent),
      marketCap: formatMarketCap(stock.marketCap),
      volume: `${stock.avgVolume.toFixed(1)}M`,
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "price", label: "Price", width: 12, align: "right" },
      { key: "change", label: "Change", width: 20, align: "right" },
      { key: "marketCap", label: "Market Cap", width: 14, align: "right" },
      { key: "volume", label: "Avg Vol", width: 10, align: "right" },
    ]
  );
}

function renderMarketCapChart() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("MARKET CAPITALIZATION COMPARISON", ColorSystem.codes.bright)
  );
  console.log("");

  const chartData = mag7Data
    .map((stock) => ({
      label: stock.ticker,
      value: stock.marketCap,
    }))
    .sort((a, b) => b.value - a.value);

  ChartRenderer.barChart(chartData, {
    showValues: true,
    width: 50,
    valueFormatter: (v: number) => formatMarketCap(v),
  });
}

function renderValuationMetrics() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("VALUATION METRICS", ColorSystem.codes.bright)
  );
  console.log("");

  const avgPE = mag7Data.reduce((sum, s) => sum + s.peRatio, 0) / mag7Data.length;
  const avgForwardPE = mag7Data.reduce((sum, s) => sum + s.forwardPE, 0) / mag7Data.length;

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      peRatio: ColorSystem.colorize(
        stock.peRatio.toFixed(1),
        colorByValue(stock.peRatio, { low: 25, high: 50 })
      ),
      forwardPE: ColorSystem.colorize(
        stock.forwardPE.toFixed(1),
        colorByValue(stock.forwardPE, { low: 20, high: 40 })
      ),
      eps: `$${stock.eps.toFixed(2)}`,
      dividend: stock.dividend > 0 ? `$${stock.dividend.toFixed(2)}` : "-",
      beta: ColorSystem.colorize(
        stock.beta.toFixed(2),
        stock.beta > 1.5 ? ColorSystem.codes.red : ColorSystem.codes.green
      ),
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "peRatio", label: "P/E", width: 10, align: "right" },
      { key: "forwardPE", label: "Fwd P/E", width: 10, align: "right" },
      { key: "eps", label: "EPS", width: 10, align: "right" },
      { key: "dividend", label: "Dividend", width: 10, align: "right" },
      { key: "beta", label: "Beta", width: 8, align: "right" },
    ]
  );

  console.log("");
  console.log(
    ColorSystem.colorize(
      `Average P/E: ${avgPE.toFixed(1)} | Average Forward P/E: ${avgForwardPE.toFixed(1)}`,
      ColorSystem.codes.dim
    )
  );
}

function renderYTDPerformance() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("YEAR-TO-DATE PERFORMANCE", ColorSystem.codes.bright)
  );
  console.log("");

  const sortedByYTD = [...mag7Data].sort((a, b) => b.ytdReturn - a.ytdReturn);

  sortedByYTD.forEach((stock) => {
    const barLength = Math.min(Math.max(Math.floor(stock.ytdReturn / 4), 1), 50);
    const bar = stock.ytdReturn >= 0 ? "█".repeat(barLength) : "░".repeat(Math.abs(barLength));
    const color = getPerformanceColor(stock.ytdReturn);
    const sign = stock.ytdReturn >= 0 ? "+" : "";

    console.log(
      `${stock.ticker.padEnd(6)} ${ColorSystem.colorize(bar, color)} ${ColorSystem.colorize(
        `${sign}${stock.ytdReturn.toFixed(1)}%`,
        color
      )}`
    );
  });

  const avgYTD = mag7Data.reduce((sum, s) => sum + s.ytdReturn, 0) / mag7Data.length;
  console.log("");
  console.log(
    ColorSystem.colorize(
      `Mag 7 Average YTD Return: +${avgYTD.toFixed(1)}%`,
      ColorSystem.codes.brightGreen
    )
  );
}

function renderRevenueEarnings() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("REVENUE & EARNINGS (TTM)", ColorSystem.codes.bright)
  );
  console.log("");

  const totalRevenue = mag7Data.reduce((sum, s) => sum + s.revenue, 0);
  const totalNetIncome = mag7Data.reduce((sum, s) => sum + s.netIncome, 0);

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      revenue: `$${stock.revenue.toFixed(1)}B`,
      netIncome: `$${stock.netIncome.toFixed(1)}B`,
      profitMargin: ColorSystem.colorize(
        `${((stock.netIncome / stock.revenue) * 100).toFixed(1)}%`,
        (stock.netIncome / stock.revenue) > 0.2
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
      revenueShare: `${((stock.revenue / totalRevenue) * 100).toFixed(1)}%`,
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "revenue", label: "Revenue", width: 12, align: "right" },
      { key: "netIncome", label: "Net Income", width: 12, align: "right" },
      { key: "profitMargin", label: "Margin", width: 10, align: "right" },
      { key: "revenueShare", label: "Rev Share", width: 12, align: "right" },
    ]
  );

  console.log("");
  console.log(
    ColorSystem.colorize(
      `Combined Revenue: $${totalRevenue.toFixed(1)}B | Combined Net Income: $${totalNetIncome.toFixed(1)}B`,
      ColorSystem.codes.dim
    )
  );
}

function render52WeekRange() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("52-WEEK RANGE POSITION", ColorSystem.codes.bright)
  );
  console.log("");

  mag7Data.forEach((stock) => {
    const range = stock.fiftyTwoWeekHigh - stock.fiftyTwoWeekLow;
    const position = ((stock.price - stock.fiftyTwoWeekLow) / range) * 100;
    const barPosition = Math.floor(position / 2);

    let rangeBar = "░".repeat(50);
    rangeBar =
      rangeBar.substring(0, barPosition) +
      ColorSystem.colorize("█", ColorSystem.codes.brightCyan) +
      rangeBar.substring(barPosition + 1);

    const positionColor =
      position > 80
        ? ColorSystem.codes.green
        : position < 20
        ? ColorSystem.codes.red
        : ColorSystem.codes.yellow;

    console.log(
      `${stock.ticker.padEnd(6)} $${stock.fiftyTwoWeekLow.toFixed(0).padStart(4)} ${rangeBar} $${stock.fiftyTwoWeekHigh.toFixed(0).padStart(4)} ${ColorSystem.colorize(
        `${position.toFixed(0)}%`,
        positionColor
      )}`
    );
  });
}

function renderAIExposureAnalysis() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("AI EXPOSURE & SECTOR ANALYSIS", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      sector: stock.sector,
      aiExposure: ColorSystem.colorize(
        stock.aiExposure,
        stock.aiExposure === "High"
          ? ColorSystem.codes.brightGreen
          : stock.aiExposure === "Medium"
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.dim
      ),
      aiPlay: stock.aiExposure === "High"
        ? ColorSystem.colorize("Core AI Play", ColorSystem.codes.brightMagenta)
        : stock.aiExposure === "Medium"
        ? "AI Beneficiary"
        : "Indirect",
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "sector", label: "Sector", width: 24 },
      { key: "aiExposure", label: "AI Exposure", width: 12, align: "center" },
      { key: "aiPlay", label: "Classification", width: 16, align: "center" },
    ]
  );

  const highAI = mag7Data.filter((s) => s.aiExposure === "High");
  const highAIMarketCap = highAI.reduce((sum, s) => sum + s.marketCap, 0);

  console.log("");
  console.log(
    ColorSystem.colorize(
      `High AI Exposure Combined Cap: ${formatMarketCap(highAIMarketCap)} (${highAI.length} stocks)`,
      ColorSystem.codes.dim
    )
  );
}

function renderGrowthMetrics() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("GROWTH ANALYSIS", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      revGrowth: ColorSystem.colorize(
        `${stock.revenueGrowth.toFixed(1)}%`,
        stock.revenueGrowth > 20
          ? ColorSystem.codes.brightGreen
          : stock.revenueGrowth > 10
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
      earningsGrowth: ColorSystem.colorize(
        `${stock.earningsGrowth.toFixed(1)}%`,
        stock.earningsGrowth > 50
          ? ColorSystem.codes.brightGreen
          : stock.earningsGrowth > 0
          ? ColorSystem.codes.green
          : ColorSystem.codes.red
      ),
      pegRatio: stock.pegRatio > 0
        ? ColorSystem.colorize(
            stock.pegRatio.toFixed(2),
            stock.pegRatio < 1
              ? ColorSystem.codes.brightGreen
              : stock.pegRatio < 2
              ? ColorSystem.codes.green
              : ColorSystem.codes.yellow
          )
        : ColorSystem.colorize("N/A", ColorSystem.codes.dim),
      fcf: `$${stock.freeCashFlow.toFixed(1)}B`,
      opMargin: ColorSystem.colorize(
        `${stock.operatingMargin.toFixed(1)}%`,
        stock.operatingMargin > 40
          ? ColorSystem.codes.brightGreen
          : stock.operatingMargin > 20
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "revGrowth", label: "Rev Growth", width: 12, align: "right" },
      { key: "earningsGrowth", label: "EPS Growth", width: 12, align: "right" },
      { key: "pegRatio", label: "PEG", width: 8, align: "right" },
      { key: "fcf", label: "Free CF", width: 12, align: "right" },
      { key: "opMargin", label: "Op Margin", width: 12, align: "right" },
    ]
  );

  const avgRevGrowth = mag7Data.reduce((sum, s) => sum + s.revenueGrowth, 0) / mag7Data.length;
  console.log("");
  console.log(
    ColorSystem.colorize(
      `Average Revenue Growth: ${avgRevGrowth.toFixed(1)}% | High-growth companies (>20%): ${
        mag7Data.filter((s) => s.revenueGrowth > 20).length
      }`,
      ColorSystem.codes.dim
    )
  );
}

function renderAdvancedValuation() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("ADVANCED VALUATION METRICS", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      priceToSales: stock.priceToSales.toFixed(2),
      priceToBook: stock.priceToBook.toFixed(1),
      roe: ColorSystem.colorize(
        `${stock.roe.toFixed(1)}%`,
        stock.roe > 40
          ? ColorSystem.codes.brightGreen
          : stock.roe > 20
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
      roa: ColorSystem.colorize(
        `${stock.roa.toFixed(1)}%`,
        stock.roa > 20
          ? ColorSystem.codes.brightGreen
          : stock.roa > 10
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
      debtToEquity: ColorSystem.colorize(
        stock.debtToEquity.toFixed(2),
        stock.debtToEquity < 0.5
          ? ColorSystem.codes.green
          : stock.debtToEquity < 1.0
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
      currentRatio: ColorSystem.colorize(
        stock.currentRatio.toFixed(2),
        stock.currentRatio > 2
          ? ColorSystem.codes.green
          : stock.currentRatio > 1
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "priceToSales", label: "P/S", width: 8, align: "right" },
      { key: "priceToBook", label: "P/B", width: 8, align: "right" },
      { key: "roe", label: "ROE", width: 10, align: "right" },
      { key: "roa", label: "ROA", width: 10, align: "right" },
      { key: "debtToEquity", label: "D/E", width: 8, align: "right" },
      { key: "currentRatio", label: "Current", width: 8, align: "right" },
    ]
  );
}

function renderRiskAnalysis() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("RISK & VOLATILITY ANALYSIS", ColorSystem.codes.bright)
  );
  console.log("");

  const sortedByRisk = [...mag7Data].sort((a, b) => a.volatility - b.volatility);

  TableRenderer.render(
    sortedByRisk.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      volatility: ColorSystem.colorize(
        `${stock.volatility.toFixed(1)}%`,
        stock.volatility < 25
          ? ColorSystem.codes.green
          : stock.volatility < 35
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
      beta: ColorSystem.colorize(
        stock.beta.toFixed(2),
        stock.beta < 1
          ? ColorSystem.codes.green
          : stock.beta < 1.5
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
      maxDrawdown: ColorSystem.colorize(
        `${stock.maxDrawdown.toFixed(1)}%`,
        stock.maxDrawdown > -20
          ? ColorSystem.codes.green
          : stock.maxDrawdown > -30
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
      sharpeRatio: ColorSystem.colorize(
        stock.sharpeRatio.toFixed(2),
        stock.sharpeRatio > 2
          ? ColorSystem.codes.brightGreen
          : stock.sharpeRatio > 1.5
          ? ColorSystem.codes.green
          : ColorSystem.codes.yellow
      ),
      riskLevel:
        stock.volatility < 25
          ? ColorSystem.colorize("Low", ColorSystem.codes.green)
          : stock.volatility < 35
          ? ColorSystem.colorize("Medium", ColorSystem.codes.yellow)
          : ColorSystem.colorize("High", ColorSystem.codes.red),
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "volatility", label: "Volatility", width: 12, align: "right" },
      { key: "beta", label: "Beta", width: 8, align: "right" },
      { key: "maxDrawdown", label: "Max DD", width: 10, align: "right" },
      { key: "sharpeRatio", label: "Sharpe", width: 10, align: "right" },
      { key: "riskLevel", label: "Risk", width: 10, align: "center" },
    ]
  );

  const avgVolatility = mag7Data.reduce((sum, s) => sum + s.volatility, 0) / mag7Data.length;
  const avgSharpe = mag7Data.reduce((sum, s) => sum + s.sharpeRatio, 0) / mag7Data.length;

  console.log("");
  console.log(
    ColorSystem.colorize(
      `Average Volatility: ${avgVolatility.toFixed(1)}% | Average Sharpe Ratio: ${avgSharpe.toFixed(2)} | Least volatile: ${sortedByRisk[0].ticker}`,
      ColorSystem.codes.dim
    )
  );
}

function renderAnalystConsensus() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("ANALYST CONSENSUS & PRICE TARGETS", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => {
      const upside = ((stock.priceTarget - stock.price) / stock.price) * 100;
      return {
        ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
        currentPrice: `$${stock.price.toFixed(2)}`,
        priceTarget: `$${stock.priceTarget.toFixed(2)}`,
        upside: ColorSystem.colorize(
          `${upside >= 0 ? "+" : ""}${upside.toFixed(1)}%`,
          upside > 15
            ? ColorSystem.codes.brightGreen
            : upside > 5
            ? ColorSystem.codes.green
            : upside > -5
            ? ColorSystem.codes.yellow
            : ColorSystem.codes.red
        ),
        rating: ColorSystem.colorize(
          stock.analystRating,
          stock.analystRating === "Strong Buy"
            ? ColorSystem.codes.brightGreen
            : stock.analystRating === "Buy"
            ? ColorSystem.codes.green
            : stock.analystRating === "Hold"
            ? ColorSystem.codes.yellow
            : ColorSystem.codes.red
        ),
        numAnalysts: `${stock.numAnalysts}`,
      };
    }),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "currentPrice", label: "Current", width: 12, align: "right" },
      { key: "priceTarget", label: "Target", width: 12, align: "right" },
      { key: "upside", label: "Upside", width: 12, align: "right" },
      { key: "rating", label: "Rating", width: 14, align: "center" },
      { key: "numAnalysts", label: "Analysts", width: 10, align: "center" },
    ]
  );

  const strongBuyCount = mag7Data.filter((s) => s.analystRating === "Strong Buy").length;
  const avgUpside =
    mag7Data.reduce((sum, s) => sum + ((s.priceTarget - s.price) / s.price) * 100, 0) /
    mag7Data.length;

  console.log("");
  console.log(
    ColorSystem.colorize(
      `Strong Buy Ratings: ${strongBuyCount}/7 | Average Analyst Upside: ${avgUpside >= 0 ? "+" : ""}${avgUpside.toFixed(1)}%`,
      ColorSystem.codes.dim
    )
  );
}

function renderCompetitivePositioning() {
  console.log("\n");
  console.log(
    ColorSystem.colorize("COMPETITIVE POSITIONING", ColorSystem.codes.bright)
  );
  console.log("");

  TableRenderer.render(
    mag7Data.map((stock) => ({
      ticker: ColorSystem.colorize(stock.ticker, ColorSystem.codes.brightCyan),
      marketShare: ColorSystem.colorize(
        stock.marketShareTrend,
        stock.marketShareTrend === "Growing"
          ? ColorSystem.codes.brightGreen
          : stock.marketShareTrend === "Stable"
          ? ColorSystem.codes.yellow
          : ColorSystem.codes.red
      ),
      advantage: stock.competitiveAdvantage,
    })),
    [
      { key: "ticker", label: "Ticker", width: 8 },
      { key: "marketShare", label: "Market Share", width: 14, align: "center" },
      { key: "advantage", label: "Competitive Advantage", width: 60 },
    ]
  );

  const growingCount = mag7Data.filter((s) => s.marketShareTrend === "Growing").length;
  console.log("");
  console.log(
    ColorSystem.colorize(
      `Companies with growing market share: ${growingCount}/7`,
      ColorSystem.codes.dim
    )
  );
}

function renderPortfolioRecommendations() {
  console.log("\n");

  // Categorize stocks
  const valueGrowth = mag7Data.filter((s) => s.pegRatio > 0 && s.pegRatio < 1);
  const momentumPlays = mag7Data.filter((s) => s.ytdReturn > 50 && s.analystRating === "Strong Buy");
  const dividendPayers = mag7Data.filter((s) => s.dividend > 1);
  const lowRisk = mag7Data.filter((s) => s.volatility < 30 && s.sharpeRatio > 1.5);
  const highGrowth = mag7Data.filter((s) => s.revenueGrowth > 20 && s.earningsGrowth > 30);

  BoxRenderer.render(
    [
      "PORTFOLIO CONSTRUCTION GUIDE",
      "",
      ColorSystem.colorize("VALUE + GROWTH PLAYS (PEG < 1.0)", ColorSystem.codes.brightGreen),
      valueGrowth.map((s) => `  • ${s.ticker}: PEG ${s.pegRatio.toFixed(2)} | ${s.competitiveAdvantage.split(",")[0]}`).join("\n"),
      "",
      ColorSystem.colorize("MOMENTUM LEADERS (YTD >50%, Strong Buy)", ColorSystem.codes.brightMagenta),
      momentumPlays.map((s) => `  • ${s.ticker}: +${s.ytdReturn.toFixed(1)}% YTD | Target $${s.priceTarget}`).join("\n"),
      "",
      ColorSystem.colorize("DIVIDEND INCOME (>$1/share)", ColorSystem.codes.brightCyan),
      dividendPayers.length > 0
        ? dividendPayers.map((s) => `  • ${s.ticker}: $${s.dividend.toFixed(2)}/share | Yield ${((s.dividend * 4 / s.price) * 100).toFixed(2)}%`).join("\n")
        : "  • None meet criteria",
      "",
      ColorSystem.colorize("LOW VOLATILITY CORE (Vol <30%, Sharpe >1.5)", ColorSystem.codes.green),
      lowRisk.map((s) => `  • ${s.ticker}: ${s.volatility.toFixed(1)}% vol | Sharpe ${s.sharpeRatio.toFixed(2)}`).join("\n"),
      "",
      ColorSystem.colorize("HIGH GROWTH AGGRESSIVE (Rev >20%, EPS >30%)", ColorSystem.codes.yellow),
      highGrowth.map((s) => `  • ${s.ticker}: ${s.revenueGrowth.toFixed(0)}% rev / ${s.earningsGrowth.toFixed(0)}% EPS growth`).join("\n"),
    ],
    {
      title: "STRATEGIC ALLOCATION IDEAS",
      style: "double",
      color: ColorSystem.codes.brightBlue,
      padding: 1,
    }
  );
}

function renderInvestmentSummary() {
  console.log("\n");

  // Calculate aggregated metrics
  const totalMarketCap = mag7Data.reduce((sum, s) => sum + s.marketCap, 0);
  const avgPE = mag7Data.reduce((sum, s) => sum + s.peRatio, 0) / mag7Data.length;
  const avgYTD = mag7Data.reduce((sum, s) => sum + s.ytdReturn, 0) / mag7Data.length;
  const topPerformer = [...mag7Data].sort((a, b) => b.ytdReturn - a.ytdReturn)[0];
  const worstPerformer = [...mag7Data].sort((a, b) => a.ytdReturn - b.ytdReturn)[0];
  const cheapestPE = [...mag7Data].sort((a, b) => a.peRatio - b.peRatio)[0];
  const largestCap = [...mag7Data].sort((a, b) => b.marketCap - a.marketCap)[0];

  BoxRenderer.render(
    [
      "INVESTMENT SUMMARY",
      "",
      `Total Market Cap:        ${formatMarketCap(totalMarketCap)}`,
      `Average P/E Ratio:       ${avgPE.toFixed(1)}`,
      `Average YTD Return:      +${avgYTD.toFixed(1)}%`,
      "",
      `Top Performer:           ${topPerformer.ticker} (+${topPerformer.ytdReturn.toFixed(1)}%)`,
      `Lagging Performer:       ${worstPerformer.ticker} (+${worstPerformer.ytdReturn.toFixed(1)}%)`,
      `Best Value (P/E):        ${cheapestPE.ticker} (${cheapestPE.peRatio.toFixed(1)}x)`,
      `Largest by Cap:          ${largestCap.ticker} (${formatMarketCap(largestCap.marketCap)})`,
    ],
    {
      title: "KEY TAKEAWAYS",
      style: "rounded",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    }
  );
}

function renderConclusion() {
  console.log("\n");

  const bullishCount = mag7Data.filter((s) => s.ytdReturn > 30).length;
  const nearHighCount = mag7Data.filter(
    (s) => s.price > s.fiftyTwoWeekHigh * 0.9
  ).length;

  let sentiment: "success" | "warning" | "error";
  let message: string;

  if (bullishCount >= 5 && nearHighCount >= 4) {
    sentiment = "success";
    message =
      "BULLISH - Strong momentum across Mag 7. AI tailwinds continue to drive growth.";
  } else if (bullishCount >= 3) {
    sentiment = "warning";
    message =
      "NEUTRAL - Mixed performance. Selective opportunities exist within the group.";
  } else {
    sentiment = "error";
    message =
      "CAUTIOUS - Consider valuation risks. Monitor macro conditions closely.";
  }

  BoxRenderer.message(message, sentiment);

  console.log("\n");
  console.log(
    ColorSystem.colorize(
      "Disclaimer: This evaluation is for informational purposes only. Not financial advice.",
      ColorSystem.codes.dim
    )
  );
  console.log("");
}

// Main execution
if (import.meta.main) {
  console.clear();

  logger.info("Starting Magnificent 7 Comprehensive Evaluation Dashboard");

  // Core Overview
  renderHeader();
  renderPriceOverview();
  renderMarketCapChart();

  // Valuation Analysis
  renderValuationMetrics();
  renderAdvancedValuation();

  // Performance & Growth
  renderYTDPerformance();
  renderGrowthMetrics();
  renderRevenueEarnings();

  // Risk Assessment
  renderRiskAnalysis();
  render52WeekRange();

  // Strategic Analysis
  renderAIExposureAnalysis();
  renderCompetitivePositioning();
  renderAnalystConsensus();

  // Portfolio Construction
  renderPortfolioRecommendations();
  renderInvestmentSummary();
  renderConclusion();

  logger.success("Comprehensive evaluation complete - All metrics analyzed");
}
