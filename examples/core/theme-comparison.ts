#!/usr/bin/env -S deno run --allow-env

/**
 * Theme Comparison Example
 *
 * Displays all available themes side-by-side to help developers choose
 * the right theme for their application and understand visual differences.
 *
 * Features demonstrated:
 *   • All built-in themes (default, neon, dracula, minimal)
 *   • Consistent logging examples across themes
 *   • Visual comparison of colors and symbols
 *   • Theme customization guidance
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  defaultTheme,
  draculaTheme,
  Logger,
  minimalTheme,
  neonTheme,
  type Theme,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Theme showcase
function showTheme(themeName: string, theme: Theme) {
  console.log(
    ColorSystem.colorize(
      `\n${"═".repeat(70)}\n  ${themeName.toUpperCase()}\n${"═".repeat(70)}`,
      ColorSystem.codes.brightCyan,
    ),
  );

  const logger = new Logger(
    new ConfigBuilder()
      .theme(theme)
      .logLevel("debug")
      .build(),
  );

  console.log("");
  logger.debug("Debug message - for development troubleshooting");
  logger.info("Info message - general information about operations");
  logger.success("Success message - operation completed successfully");
  logger.warning("Warning message - potential issue detected, check logs");
  logger.error("Error message - something went wrong, needs attention");
  logger.critical("Critical message - system-level failure, immediate action required");

  console.log("");
  console.log(ColorSystem.colorize("With metadata:", ColorSystem.codes.dim));
  logger.info("Database connection established", {
    host: "db.example.com",
    port: 5432,
    pool_size: 20,
  });

  logger.error("Authentication failed", {
    user: "admin",
    attempt: 3,
    ip: "192.168.1.100",
  });
}

// Custom theme examples
function showCustomThemeExample() {
  console.log(
    ColorSystem.colorize(
      `\n${"═".repeat(70)}\n  CUSTOM THEME EXAMPLES\n${"═".repeat(70)}`,
      ColorSystem.codes.brightCyan,
    ),
  );

  // Cyberpunk theme
  const cyberpunkTheme: Theme = {
    name: "cyberpunk",
    colors: {
      primary: ColorSystem.hexToRgb("#00F0FF"),
      secondary: ColorSystem.hexToRgb("#7928CA"),
      debug: ColorSystem.hexToRgb("#7928CA"),
      info: ColorSystem.hexToRgb("#00DFD8"),
      success: ColorSystem.hexToRgb("#39FF14"),
      warning: ColorSystem.hexToRgb("#FF006E"),
      error: ColorSystem.hexToRgb("#FF0090"),
      critical: ColorSystem.hexToRgb("#FF0000"),
      muted: ColorSystem.codes.dim,
      accent: ColorSystem.hexToRgb("#00F0FF"),
    },
    symbols: {
      debug: "◆",
      info: "►",
      success: "✓",
      warning: "⚠",
      error: "✗",
      critical: "☢",
      bullet: "•",
      arrow: "→",
      check: "✓",
      cross: "✗",
    },
    boxDrawing: {
      topLeft: "┌",
      topRight: "┐",
      bottomLeft: "└",
      bottomRight: "┘",
      horizontal: "─",
      vertical: "│",
      cross: "┼",
      teeLeft: "├",
      teeRight: "┤",
      teeTop: "┬",
      teeBottom: "┴",
    },
  };

  console.log("\n");
  console.log(ColorSystem.colorize("Cyberpunk Theme:", ColorSystem.codes.bright));
  const cyberpunkLogger = new Logger(
    new ConfigBuilder().theme(cyberpunkTheme).build(),
  );

  cyberpunkLogger.info("System initialization complete");
  cyberpunkLogger.success("Neural link established");
  cyberpunkLogger.warning("Firewall breach detected");
  cyberpunkLogger.error("Connection to mainframe lost");

  // Ocean theme
  const oceanTheme: Theme = {
    name: "ocean",
    colors: {
      primary: ColorSystem.hexToRgb("#0077BE"),
      secondary: ColorSystem.hexToRgb("#00CED1"),
      debug: ColorSystem.hexToRgb("#89CFF0"),
      info: ColorSystem.hexToRgb("#0077BE"),
      success: ColorSystem.hexToRgb("#00CED1"),
      warning: ColorSystem.hexToRgb("#FFD700"),
      error: ColorSystem.hexToRgb("#DC143C"),
      critical: ColorSystem.hexToRgb("#8B0000"),
      muted: ColorSystem.codes.dim,
      accent: ColorSystem.hexToRgb("#1E90FF"),
    },
    symbols: {
      debug: "○",
      info: "◉",
      success: "✓",
      warning: "⚠",
      error: "✗",
      critical: "⚡",
      bullet: "•",
      arrow: "→",
      check: "✓",
      cross: "✗",
    },
    boxDrawing: {
      topLeft: "┌",
      topRight: "┐",
      bottomLeft: "└",
      bottomRight: "┘",
      horizontal: "─",
      vertical: "│",
      cross: "┼",
      teeLeft: "├",
      teeRight: "┤",
      teeTop: "┬",
      teeBottom: "┴",
    },
  };

  console.log("\n");
  console.log(ColorSystem.colorize("Ocean Theme:", ColorSystem.codes.bright));
  const oceanLogger = new Logger(
    new ConfigBuilder().theme(oceanTheme).build(),
  );

  oceanLogger.info("Wave analysis started");
  oceanLogger.success("Depth measurement complete");
  oceanLogger.warning("Storm approaching from northwest");
  oceanLogger.error("Sensor malfunction detected");

  // Sunset theme
  const sunsetTheme: Theme = {
    name: "sunset",
    colors: {
      primary: ColorSystem.hexToRgb("#FF7F50"),
      secondary: ColorSystem.hexToRgb("#FF8C94"),
      debug: ColorSystem.hexToRgb("#FFB347"),
      info: ColorSystem.hexToRgb("#FF7F50"),
      success: ColorSystem.hexToRgb("#98D8C8"),
      warning: ColorSystem.hexToRgb("#FFAB73"),
      error: ColorSystem.hexToRgb("#FF6B6B"),
      critical: ColorSystem.hexToRgb("#C73E1D"),
      muted: ColorSystem.codes.dim,
      accent: ColorSystem.hexToRgb("#FF8C94"),
    },
    symbols: {
      debug: "◇",
      info: "◆",
      success: "✓",
      warning: "▲",
      error: "●",
      critical: "◆",
      bullet: "•",
      arrow: "→",
      check: "✓",
      cross: "✗",
    },
    boxDrawing: {
      topLeft: "┌",
      topRight: "┐",
      bottomLeft: "└",
      bottomRight: "┘",
      horizontal: "─",
      vertical: "│",
      cross: "┼",
      teeLeft: "├",
      teeRight: "┤",
      teeTop: "┬",
      teeBottom: "┴",
    },
  };

  console.log("\n");
  console.log(ColorSystem.colorize("Sunset Theme:", ColorSystem.codes.bright));
  const sunsetLogger = new Logger(
    new ConfigBuilder().theme(sunsetTheme).build(),
  );

  sunsetLogger.info("Evening monitoring activated");
  sunsetLogger.success("Temperature readings normal");
  sunsetLogger.warning("Light levels decreasing");
  sunsetLogger.error("Camera offline");
}

// Theme color palette showcase
function showColorPalettes() {
  console.log(
    ColorSystem.colorize(
      `\n${"═".repeat(70)}\n  COLOR PALETTES\n${"═".repeat(70)}`,
      ColorSystem.codes.brightCyan,
    ),
  );

  const themes = [
    { name: "Default", theme: defaultTheme },
    { name: "Neon", theme: neonTheme },
    { name: "Dracula", theme: draculaTheme },
    { name: "Minimal", theme: minimalTheme },
  ];

  console.log("\n");

  for (const { name, theme } of themes) {
    const colors = theme.colors;
    const symbols = theme.symbols;

    process.stdout.write(ColorSystem.colorize(name.padEnd(12), ColorSystem.codes.bright));

    // Display color squares for each level
    const levels = ["debug", "info", "success", "warning", "error", "critical"];
    for (const level of levels) {
      const color = colors[level as keyof typeof colors];
      const symbol = symbols[level as keyof typeof symbols];
      process.stdout.write(` ${color}${symbol}${ColorSystem.codes.reset}`);
    }

    console.log("");
  }

  console.log("\n");
}

// Comparison table
async function showComparisonTable() {
  console.log(
    ColorSystem.colorize(
      `\n${"═".repeat(70)}\n  THEME CHARACTERISTICS\n${"═".repeat(70)}`,
      ColorSystem.codes.brightCyan,
    ),
  );

  console.log("\n");

  const characteristics = [
    {
      theme: "Default",
      colors: "Standard",
      symbols: "Unicode",
      brightness: "Medium",
      bestFor: "General purpose, production",
    },
    {
      theme: "Neon",
      colors: "Vibrant",
      symbols: "Modern",
      brightness: "High",
      bestFor: "Development, demos, dashboards",
    },
    {
      theme: "Dracula",
      colors: "Dark",
      symbols: "Classic",
      brightness: "Low",
      bestFor: "Dark terminals, night coding",
    },
    {
      theme: "Minimal",
      colors: "Subtle",
      symbols: "Simple",
      brightness: "Low",
      bestFor: "Clean output, CI/CD logs",
    },
  ];

  const { TableRenderer } = await import("../../mod.ts");

  TableRenderer.render(
    characteristics,
    [
      { key: "theme", label: "Theme", width: 12 },
      { key: "colors", label: "Colors", width: 10 },
      { key: "symbols", label: "Symbols", width: 10 },
      { key: "brightness", label: "Brightness", width: 12 },
      { key: "bestFor", label: "Best For", width: 30 },
    ],
  );
}

// Usage recommendations
function showRecommendations() {
  console.log(
    ColorSystem.colorize(
      `\n${"═".repeat(70)}\n  THEME SELECTION GUIDE\n${"═".repeat(70)}`,
      ColorSystem.codes.brightCyan,
    ),
  );

  console.log("\n");

  BoxRenderer.render(
    [
      "Choosing the Right Theme:",
      "",
      "🎯 Default Theme",
      "  • Best for production environments",
      "  • Professional, balanced colors",
      "  • Works well in most terminals",
      "",
      "⚡ Neon Theme",
      "  • Ideal for development and debugging",
      "  • High contrast for quick scanning",
      "  • Great for live dashboards",
      "",
      "🌙 Dracula Theme",
      "  • Perfect for dark terminal backgrounds",
      "  • Easy on the eyes for long sessions",
      "  • Popular with developers",
      "",
      "✨ Minimal Theme",
      "  • Best for CI/CD and automated logs",
      "  • Less visual noise",
      "  • Focuses on content over style",
    ],
    {
      title: "Theme Recommendations",
      style: "rounded",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
    },
  );

  console.log("\n");

  BoxRenderer.render(
    [
      "Creating Custom Themes:",
      "",
      "1. Define colors using hex codes or RGB values",
      "2. Choose symbols that match your aesthetic",
      "3. Test in your target terminal environment",
      "4. Consider accessibility and readability",
      "",
      "Example:",
      "  const myTheme: Theme = {",
      "    name: 'my-theme',",
      "    colors: {",
      "      info: ColorSystem.hexToRgb('#00D9FF'),",
      "      success: ColorSystem.hexToRgb('#00FF9F'),",
      "      // ... other levels",
      "    },",
      "    symbols: { info: '►', success: '✓', ... }",
      "  };",
    ],
    {
      title: "Custom Theme Development",
      style: "single",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
}

// Main demonstration
async function main() {
  console.clear();
  console.log("\n");

  BannerRenderer.render({
    title: "THEME COMPARISON",
    subtitle: "Visual Guide to GenesisTrace Themes",
    description: "Compare built-in themes and learn to create custom themes",
    version: "1.0",
    author: "GenesisTrace",
    style: "double",
    color: ColorSystem.codes.brightMagenta,
  });

  // Show built-in themes
  showTheme("Default Theme", defaultTheme);
  await sleep(500);

  showTheme("Neon Theme", neonTheme);
  await sleep(500);

  showTheme("Dracula Theme", draculaTheme);
  await sleep(500);

  showTheme("Minimal Theme", minimalTheme);
  await sleep(500);

  // Show custom themes
  showCustomThemeExample();
  await sleep(500);

  // Show color palettes
  showColorPalettes();
  await sleep(500);

  // Show comparison table
  showComparisonTable();
  await sleep(500);

  // Show recommendations
  showRecommendations();

  console.log("\n");
}

if (import.meta.main) {
  await main();
}
