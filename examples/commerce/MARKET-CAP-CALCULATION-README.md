# Market Capitalization Calculation Guide

A comprehensive educational guide explaining how market capitalization is calculated using the GenesisTrace library.

## Overview

This interactive guide demonstrates:

- **What is Market Capitalization?** - Complete definition and importance
- **Calculation Formula** - Step-by-step breakdown of the math
- **Real Examples** - Live calculations with major tech companies (Apple, Microsoft, Alphabet, Tesla)
- **Market Cap Categories** - Mega-cap, Large-cap, Mid-cap, Small-cap, and Micro-cap classifications
- **Why It Matters** - Practical applications for investors and analysts
- **Common Misconceptions** - Debunking myths about market cap
- **Market Cap vs Enterprise Value** - Understanding the difference
- **Code Examples** - TypeScript implementations you can use

## Quick Start

Run the interactive guide:

```bash
deno run --allow-env --allow-read examples/commerce/market-cap-calculation-guide.ts
```

## What You'll Learn

### The Formula

```
Market Cap = Outstanding Shares × Current Share Price
```

### Example Calculation

**Apple Inc. (AAPL)**
- Outstanding shares: 15,441 million shares
- Current price: $228.52
- **Market Cap**: 15,441M × $228.52 = **$3.53 trillion**

### Market Cap Categories

| Category  | Range          | Risk Level | Examples                    |
|-----------|----------------|------------|----------------------------|
| Mega-Cap  | $200B+         | Lower      | Apple, Microsoft, Amazon   |
| Large-Cap | $10B - $200B   | Moderate   | Starbucks, Adobe, Nike     |
| Mid-Cap   | $2B - $10B     | Moderate-High | Etsy, Zoom, DocuSign   |
| Small-Cap | $300M - $2B    | Higher     | Regional banks             |
| Micro-Cap | Under $300M    | Highest    | Startups, niche businesses |

## Features Demonstrated

### GenesisTrace Components Used

1. **BoxRenderer** - Styled information boxes with titles and borders
2. **TableRenderer** - Professional data tables with custom columns
3. **ChartRenderer** - Visual bar charts comparing market caps
4. **ColorSystem** - Rich color highlighting for different categories
5. **Spinner** - Loading animations
6. **Logger** - Structured logging with themes

### Color-Coded Output

- 🟢 **Green** - Mega-cap companies ($200B+)
- 🟡 **Yellow** - Mid-cap companies ($2B-$10B)
- 🔵 **Cyan** - Small-cap companies ($300M-$2B)
- 🔴 **Red** - Important warnings and misconceptions

## Key Concepts Covered

### 1. Understanding Outstanding Shares

Outstanding shares are the total number of shares currently held by all shareholders, including:
- Institutional investors
- Retail investors
- Company insiders

**NOT included:**
- Treasury shares (buybacks)
- Unissued authorized shares

### 2. Market Cap vs Enterprise Value

**Market Cap** = Equity value only

**Enterprise Value (EV)** = Market Cap + Total Debt - Cash
- Use EV for comparing companies with different debt levels
- Better for M&A valuations
- Reflects total acquisition cost

### 3. Why Market Cap Matters

- **Portfolio Diversification** - Mix different cap sizes for balanced risk
- **Index Eligibility** - S&P 500 requires minimum market cap
- **Investment Strategy** - Some funds target specific cap ranges
- **Liquidity** - Larger caps typically have better liquidity
- **Risk Assessment** - Correlates with company maturity

## Practical Applications

### For Investors

```typescript
// Calculate market cap for any stock
function calculateMarketCap(
  outstandingShares: number,  // in millions
  sharePrice: number
): number {
  return (outstandingShares * sharePrice) / 1000;  // returns billions
}

// Categorize by market cap
function categorizeMarketCap(marketCapBillions: number): string {
  if (marketCapBillions >= 200) return "Mega-Cap";
  if (marketCapBillions >= 10) return "Large-Cap";
  if (marketCapBillions >= 2) return "Mid-Cap";
  if (marketCapBillions >= 0.3) return "Small-Cap";
  return "Micro-Cap";
}
```

### Portfolio Allocation Example

```
Conservative Portfolio:
  60% Large-cap (stability)
  30% Mid-cap (moderate growth)
  10% Small-cap (high growth potential)

Aggressive Portfolio:
  30% Large-cap
  40% Mid-cap
  30% Small-cap
```

## Common Misconceptions Debunked

❌ **MYTH**: Higher market cap = better investment
✅ **REALITY**: Market cap indicates size, not quality

❌ **MYTH**: Market cap = company's actual value
✅ **REALITY**: It's market perception, which can be wrong

❌ **MYTH**: Market cap = enterprise value
✅ **REALITY**: EV includes debt and excludes cash

❌ **MYTH**: Market cap can't change quickly
✅ **REALITY**: Can swing billions during volatile periods

❌ **MYTH**: All shares count in market cap
✅ **REALITY**: Only outstanding shares (not treasury shares)

## Data Sources

Where to find market cap data:
- **Yahoo Finance** - Free real-time data
- **SEC EDGAR** - Official 10-K/10-Q filings
- **Bloomberg Terminal** - Professional data
- **Company IR pages** - Investor relations websites

## Related Examples

- `mag7-evaluation.ts` - Advanced stock analysis using market cap
- `ai-cloud-market-report.ts` - Market cap in sector analysis

## Educational Use

Perfect for:
- 📚 Finance students learning valuation
- 💼 New investors understanding stock metrics
- 📊 Analysts building screening tools
- 🎓 Anyone wanting to understand market capitalization

## Implementation Notes

The guide uses:
- **Neon theme** for high visibility
- **Async animations** for better UX
- **Real company data** from Q4 2024
- **Interactive tables** with color coding
- **Step-by-step calculations** with explanations

## Next Steps

After completing this guide:

1. Practice calculating market cap for your portfolio stocks
2. Use market cap as initial screening metric
3. Combine with other metrics (P/E, EV, revenue) for analysis
4. Monitor market cap changes over time
5. Build your own screening tools using the code examples

## Technical Details

**Dependencies**: None (uses GenesisTrace only)

**Requirements**:
- Deno runtime
- Terminal with color support
- Read permissions for theme loading

**Performance**: Lightweight, runs in < 1 second

## Contributing

Ideas for improvements:
- Add historical market cap tracking
- Include more international examples
- Add sector-specific market cap analysis
- Create interactive calculator mode

## License

MIT License - Part of the GenesisTrace project

---

**Made with GenesisTrace** - Professional terminal logging and UI library for Deno
