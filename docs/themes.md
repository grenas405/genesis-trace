# Theme System

GenesisTrace includes a powerful theme system with 5 built-in professional themes and full customization support.

## Table of Contents
- [Built-in Themes](#built-in-themes)
- [Using Themes](#using-themes)
- [Theme Anatomy](#theme-anatomy)
- [Creating Custom Themes](#creating-custom-themes)
- [Theme Registry](#theme-registry)

## Built-in Themes

GenesisTrace ships with 5 professionally designed themes:

### 1. Default Theme

Balanced, professional colors for general use.

- **Colors**: Blue info, green success, yellow warning, red error
- **Style**: Standard Unicode symbols and box drawing
- **Best For**: General-purpose applications, professional tools
- **Terminal**: Works on all terminals

```typescript
import { defaultTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(defaultTheme).build()
);
```

### 2. Neon Theme

High-contrast, vibrant cyberpunk aesthetic.

- **Colors**: Electric cyan, bright magenta, neon green
- **Style**: Bold, vibrant Unicode symbols
- **Best For**: Dark terminals, high visibility, development
- **Terminal**: Best with true color support

```typescript
import { neonTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(neonTheme).build()
);
```

### 3. Dracula Theme

Popular dark theme with purple accents.

- **Colors**: Purple, pink, and cyan color palette
- **Style**: Based on the famous Dracula color scheme
- **Best For**: Dracula terminal users, dark mode enthusiasts
- **Terminal**: Best with 256-color or true color support

```typescript
import { draculaTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(draculaTheme).build()
);
```

### 4. Minimal Theme

Clean, understated design with minimal color.

- **Colors**: Minimal use of color, focus on content
- **Style**: Simple ASCII symbols, clean lines
- **Best For**: Production servers, log files, minimal aesthetics
- **Terminal**: Works on all terminals

```typescript
import { minimalTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(minimalTheme).build()
);
```

### 5. Red Alert Theme

High-visibility red theme for critical systems.

- **Colors**: Red-focused palette for urgency
- **Style**: Warning symbols, attention-grabbing
- **Best For**: Critical alerts, monitoring systems, incident response
- **Terminal**: Works on all terminals

```typescript
import { redAlertTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(redAlertTheme).build()
);
```

## Using Themes

### Direct Import

Import and use themes directly:

```typescript
import {
  Logger,
  ConfigBuilder,
  neonTheme,
  draculaTheme,
  minimalTheme,
  redAlertTheme,
  defaultTheme,
} from "jsr:@pedromdominguez/genesis-trace";

const logger = new Logger(
  new ConfigBuilder().theme(neonTheme).build()
);
```

### Load by Name

Use the theme registry to load themes dynamically:

```typescript
import { getTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const theme = getTheme("neon");
if (theme) {
  const logger = new Logger(
    new ConfigBuilder().theme(theme).build()
  );
}
```

### List Available Themes

```typescript
import { themes } from "jsr:@pedromdominguez/genesis-trace";

console.log("Available themes:", Object.keys(themes));
// Output: ["default", "neon", "dracula", "minimal", "red-alert"]
```

### Environment-Based Theme Selection

```typescript
import { getTheme, defaultTheme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const env = Deno.env.get("ENV") || "development";

const themeMap: Record<string, string> = {
  development: "neon",
  staging: "dracula",
  production: "minimal",
  incident: "red-alert",
};

const themeName = themeMap[env] || "default";
const theme = getTheme(themeName) || defaultTheme;

const logger = new Logger(
  new ConfigBuilder().theme(theme).build()
);
```

## Theme Anatomy

Each theme consists of three main components:

### Complete Interface

```typescript
interface Theme {
  name: string;
  colors: ThemeColors;
  symbols: ThemeSymbols;
  boxDrawing: BoxDrawingCharacters;
}
```

### 1. Colors

The color palette defines ANSI escape codes for each log level and UI element:

```typescript
interface ThemeColors {
  primary: string;      // Primary brand color
  secondary: string;    // Secondary color
  success: string;      // Success state (typically green)
  warning: string;      // Warning state (typically yellow)
  error: string;        // Error state (typically red)
  info: string;         // Info state (typically cyan/blue)
  debug: string;        // Debug state (typically gray)
  critical: string;     // Critical state (typically bright red)
  muted: string;        // Muted/dim text
  accent: string;       // Accent/highlight color
}
```

**Example:**
```typescript
colors: {
  primary: "\x1b[36m",      // Cyan
  secondary: "\x1b[34m",    // Blue
  success: "\x1b[32m",      // Green
  warning: "\x1b[33m",      // Yellow
  error: "\x1b[31m",        // Red
  info: "\x1b[36m",         // Cyan
  debug: "\x1b[90m",        // Gray
  critical: "\x1b[91m",     // Bright red
  muted: "\x1b[2m",         // Dim
  accent: "\x1b[35m",       // Magenta
}
```

### 2. Symbols

Symbols used for log levels and UI elements:

```typescript
interface ThemeSymbols {
  success: string;      // ✓ or ✔
  error: string;        // ✗ or ✖
  warning: string;      // ⚠ or !
  info: string;         // ℹ or i
  debug: string;        // 🔍 or •
  critical: string;     // 🚨 or !!
  bullet: string;       // • or -
  arrow: string;        // → or >
  check: string;        // ✓
  cross: string;        // ✗
}
```

**Example:**
```typescript
symbols: {
  success: "✓",
  error: "✗",
  warning: "⚠",
  info: "ℹ",
  debug: "•",
  critical: "🚨",
  bullet: "→",
  arrow: "▸",
  check: "✔",
  cross: "✖",
}
```

### 3. Box Drawing Characters

Characters used for tables, boxes, and borders:

```typescript
interface BoxDrawingCharacters {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
  horizontal: string;
  vertical: string;
  cross: string;
  teeLeft: string;
  teeRight: string;
  teeTop: string;
  teeBottom: string;
}
```

**Example (Double Border):**
```typescript
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
}
```

**Example (Single Border):**
```typescript
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
}
```

## Creating Custom Themes

### Basic Custom Theme

```typescript
import { Theme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const myTheme: Theme = {
  name: "my-custom-theme",

  colors: {
    primary: "\x1b[38;2;255;107;53m",     // Orange (RGB)
    secondary: "\x1b[38;2;100;200;255m",  // Sky blue
    success: "\x1b[32m",                   // Green
    warning: "\x1b[33m",                   // Yellow
    error: "\x1b[31m",                     // Red
    info: "\x1b[36m",                      // Cyan
    debug: "\x1b[90m",                     // Gray
    critical: "\x1b[91m",                  // Bright red
    muted: "\x1b[2m",                      // Dim
    accent: "\x1b[35m",                    // Magenta
  },

  symbols: {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
    debug: "•",
    critical: "🚨",
    bullet: "→",
    arrow: "▸",
    check: "✔",
    cross: "✖",
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

// Use the theme
const logger = new Logger(
  new ConfigBuilder().theme(myTheme).build()
);
```

### Advanced: True Color Theme

Create a theme with 24-bit RGB colors:

```typescript
import { Theme, ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const trucolorTheme: Theme = {
  name: "truecolor-theme",

  colors: {
    primary: ColorSystem.rgb(138, 43, 226),    // Blue Violet
    secondary: ColorSystem.rgb(255, 165, 0),   // Orange
    success: ColorSystem.rgb(50, 205, 50),     // Lime Green
    warning: ColorSystem.rgb(255, 215, 0),     // Gold
    error: ColorSystem.rgb(220, 20, 60),       // Crimson
    info: ColorSystem.rgb(0, 191, 255),        // Deep Sky Blue
    debug: ColorSystem.rgb(128, 128, 128),     // Gray
    critical: ColorSystem.rgb(255, 0, 0),      // Red
    muted: "\x1b[2m",                          // Dim
    accent: ColorSystem.rgb(255, 20, 147),     // Deep Pink
  },

  symbols: {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
    debug: "•",
    critical: "🚨",
    bullet: "→",
    arrow: "▸",
    check: "✔",
    cross: "✖",
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
```

### Extending Existing Themes

Build on top of existing themes:

```typescript
import { neonTheme, Theme, Logger, ConfigBuilder } from "jsr:@pedromdominguez/genesis-trace";

const myNeonTheme: Theme = {
  ...neonTheme,
  name: "my-neon-variant",
  colors: {
    ...neonTheme.colors,
    primary: "\x1b[38;2;255;0;255m",  // Override primary color
    accent: "\x1b[38;2;0;255;255m",   // Override accent
  },
};

const logger = new Logger(
  new ConfigBuilder().theme(myNeonTheme).build()
);
```

## Theme Registry

### Registering Custom Themes

Register your custom theme so it can be loaded by name:

```typescript
import { themes } from "jsr:@pedromdominguez/genesis-trace";

// Add to registry
themes["my-theme"] = myCustomTheme;

// Now accessible via getTheme
const theme = getTheme("my-theme");
```

### Dynamic Theme Loading

Load themes from configuration files:

```typescript
import { Logger, ConfigBuilder, getTheme, defaultTheme } from "jsr:@pedromdominguez/genesis-trace";

// Load theme name from config
const config = JSON.parse(await Deno.readTextFile("./config.json"));
const themeName = config.theme || "default";

const theme = getTheme(themeName) || defaultTheme;

const logger = new Logger(
  new ConfigBuilder().theme(theme).build()
);
```

## Best Practices

### 1. Choose Themes Based on Context

```typescript
// Development: High visibility
const devLogger = new Logger(
  new ConfigBuilder().theme(neonTheme).build()
);

// Production: Minimal, professional
const prodLogger = new Logger(
  new ConfigBuilder().theme(minimalTheme).build()
);

// Monitoring: Attention-grabbing
const alertLogger = new Logger(
  new ConfigBuilder().theme(redAlertTheme).build()
);
```

### 2. Test Across Terminals

Test your custom themes on different terminals:
- **macOS Terminal** - 256-color support
- **iTerm2** - True color support
- **VSCode Terminal** - True color support
- **Linux TTY** - Basic 16-color only
- **Windows Terminal** - True color support

### 3. Provide Fallbacks

Always test with `NO_COLOR=1` to ensure readability:

```bash
NO_COLOR=1 deno run --allow-all your-app.ts
```

### 4. Use Semantic Colors

Reference theme colors by semantic meaning:

```typescript
// Good
console.log(`${theme.colors.success}Operation complete${ColorSystem.codes.reset}`);

// Avoid
console.log(`${theme.colors.primary}Operation complete${ColorSystem.codes.reset}`);
```

### 5. Consider Accessibility

- Ensure sufficient contrast for readability
- Don't rely solely on color to convey meaning
- Provide symbols alongside colors
- Test with colorblind simulation tools

## Examples

### Theme Comparison Tool

```typescript
import {
  Logger,
  ConfigBuilder,
  themes,
} from "jsr:@pedromdominguez/genesis-trace";

for (const [name, theme] of Object.entries(themes)) {
  console.log(`\n=== ${name.toUpperCase()} THEME ===`);
  const logger = new Logger(
    new ConfigBuilder().theme(theme).build()
  );

  logger.debug("Debug message");
  logger.info("Info message");
  logger.success("Success message");
  logger.warning("Warning message");
  logger.error("Error message");
  logger.critical("Critical message");
}
```

### User-Selectable Themes

```typescript
import {
  InteractivePrompts,
  themes,
  getTheme,
  Logger,
  ConfigBuilder,
} from "jsr:@pedromdominguez/genesis-trace";

const themeName = await InteractivePrompts.select(
  "Choose a theme:",
  Object.keys(themes)
);

const theme = getTheme(themeName);
const logger = new Logger(
  new ConfigBuilder().theme(theme!).build()
);

logger.success(`Using ${themeName} theme!`);
```

---

[Back to Main README](../README.md)
