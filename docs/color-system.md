# Color System

GenesisTrace includes a sophisticated color system supporting three color modes with automatic terminal detection.

## Table of Contents
- [Color Mode Support](#color-mode-support)
- [16-Color Mode (Basic ANSI)](#16-color-mode-basic-ansi)
- [256-Color Mode](#256-color-mode-extended-palette)
- [24-bit RGB True Color](#24-bit-rgb-true-color)
- [Color Gradients](#color-gradients)
- [Semantic Colors](#semantic-colors)
- [Automatic Degradation](#automatic-degradation)

## Color Mode Support

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

// Detect terminal color capabilities
const support = ColorSystem.detectColorSupport();
// Returns: "none" | "basic" | "256" | "truecolor"

console.log(`Terminal supports: ${support}`);
```

## 16-Color Mode (Basic ANSI)

Universal compatibility - works on all terminals:

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const { codes } = ColorSystem;

// Standard colors (30-37)
console.log(`${codes.red}Error!${codes.reset}`);
console.log(`${codes.green}Success!${codes.reset}`);
console.log(`${codes.yellow}Warning!${codes.reset}`);
console.log(`${codes.cyan}Info${codes.reset}`);

// Bright colors (90-97)
console.log(`${codes.brightRed}Critical Error!${codes.reset}`);
console.log(`${codes.brightGreen}All Systems Go!${codes.reset}`);

// Text modifiers
console.log(`${codes.bold}Bold Text${codes.reset}`);
console.log(`${codes.dim}Dimmed Text${codes.reset}`);
console.log(`${codes.italic}Italic Text${codes.reset}`);
console.log(`${codes.underline}Underlined${codes.reset}`);
console.log(`${codes.strikethrough}Strikethrough${codes.reset}`);

// Background colors (40-47, 100-107)
console.log(`${codes.bgBlue}${codes.white}White on Blue${codes.reset}`);
console.log(`${codes.bgBrightRed}${codes.white}White on Bright Red${codes.reset}`);
```

### Available Basic Colors

**Foreground Colors:**
- Standard: black, red, green, yellow, blue, magenta, cyan, white
- Bright: gray, brightRed, brightGreen, brightYellow, brightBlue, brightMagenta, brightCyan, brightWhite

**Background Colors:**
- Standard: bgBlack, bgRed, bgGreen, bgYellow, bgBlue, bgMagenta, bgCyan, bgWhite
- Bright: bgGray, bgBrightRed, bgBrightGreen, bgBrightYellow, bgBrightBlue, bgBrightMagenta, bgBrightCyan, bgBrightWhite

**Text Modifiers:**
- bold, dim, italic, underline, strikethrough, blink, reverse, hidden

## 256-Color Mode (Extended Palette)

For modern terminals with extended color support:

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

// Use any of 256 colors (0-255)
const color42 = ColorSystem.color256(42);
console.log(`${color42}Custom color${ColorSystem.codes.reset}`);

// Background 256-color
const bgColor = ColorSystem.bgColor256(196);
console.log(`${bgColor}Red background${ColorSystem.codes.reset}`);

// 256-color palette ranges:
// 0-15: Standard ANSI colors
// 16-231: 216 color cube (6x6x6)
// 232-255: Grayscale ramp
```

### 256-Color Palette Structure

The 256-color palette is organized as:

- **Colors 0-15**: Standard 16 ANSI colors
- **Colors 16-231**: 6×6×6 RGB color cube
  - Calculate: `16 + (36 × r) + (6 × g) + b` where r, g, b are 0-5
- **Colors 232-255**: Grayscale from black to white (24 shades)

## 24-bit RGB True Color

For terminals with true color support (16.7 million colors):

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

// RGB colors (r, g, b in range 0-255)
const brandColor = ColorSystem.rgb(255, 107, 53);
console.log(`${brandColor}Brand color text${ColorSystem.codes.reset}`);

// Hex to RGB conversion
const hexColor = ColorSystem.hexToRgb("#FF6B35");
console.log(`${hexColor}Hex color text${ColorSystem.codes.reset}`);

// RGB background
const bgColor = ColorSystem.rgbBg(100, 200, 255);
console.log(`${bgColor}Custom background${ColorSystem.codes.reset}`);

// Hex backgrounds
const hexBg = ColorSystem.hexToRgbBg("#1E1E1E");
console.log(`${hexBg}Dark background${ColorSystem.codes.reset}`);
```

### ANSI Escape Code Format

True color uses the following ANSI escape sequences:
- Foreground: `\x1b[38;2;{r};{g};{b}m`
- Background: `\x1b[48;2;{r};{g};{b}m`

Example: `\x1b[38;2;255;107;53m` = RGB(255, 107, 53) foreground color

## Color Gradients

Create smooth color transitions between two RGB colors:

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

// Create gradient from red to blue (50 steps)
const gradient = ColorSystem.createGradient(
  [255, 0, 0],    // Start: Red RGB
  [0, 0, 255],    // End: Blue RGB
  50              // Number of steps
);

// Render gradient bar
for (const color of gradient) {
  Deno.stdout.writeSync(
    new TextEncoder().encode(`${color}█${ColorSystem.codes.reset}`)
  );
}
console.log();

// Create rainbow gradient
const rainbow = ColorSystem.createGradient([255, 0, 0], [255, 255, 0], 20)
  .concat(ColorSystem.createGradient([255, 255, 0], [0, 255, 0], 20))
  .concat(ColorSystem.createGradient([0, 255, 0], [0, 255, 255], 20))
  .concat(ColorSystem.createGradient([0, 255, 255], [0, 0, 255], 20))
  .concat(ColorSystem.createGradient([0, 0, 255], [255, 0, 255], 20));

// Display rainbow
for (const color of rainbow) {
  Deno.stdout.writeSync(new TextEncoder().encode(`${color}█${ColorSystem.codes.reset}`));
}
console.log();
```

### Gradient Algorithm

The `createGradient` function uses linear interpolation:

```typescript
// For each step i from 0 to steps:
const t = i / (steps - 1);  // Interpolation factor (0 to 1)
const r = Math.round(startR + (endR - startR) * t);
const g = Math.round(startG + (endG - startG) * t);
const b = Math.round(startB + (endB - startB) * t);
```

## Semantic Colors

Use business-context color names for consistent styling:

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const { codes } = ColorSystem;

console.log(`${codes.success}Operation successful${codes.reset}`);
console.log(`${codes.error}Operation failed${codes.reset}`);
console.log(`${codes.warning}Warning message${codes.reset}`);
console.log(`${codes.info}Information${codes.reset}`);
console.log(`${codes.critical}Critical alert${codes.reset}`);
console.log(`${codes.accent}Highlighted text${codes.reset}`);
console.log(`${codes.muted}Less important${codes.reset}`);
```

### Semantic Color Mappings

| Semantic Name | ANSI Code | Color | Use Case |
|---------------|-----------|-------|----------|
| `success` | `\x1b[32m` | Green | Successful operations |
| `error` | `\x1b[31m` | Red | Error conditions |
| `warning` | `\x1b[33m` | Yellow | Warnings |
| `info` | `\x1b[36m` | Cyan | Informational messages |
| `critical` | `\x1b[91m` | Bright Red | Critical failures |
| `accent` | `\x1b[95m` | Bright Magenta | Highlights |
| `muted` | `\x1b[2m` | Dim | Less important text |

## Automatic Degradation

The color system automatically degrades based on terminal capabilities:

1. **True Color Terminal** (COLORTERM=truecolor)
   - Uses 24-bit RGB colors
   - Full 16.7 million color palette

2. **256-Color Terminal** (TERM=xterm-256color)
   - Falls back to closest 256-color match
   - Uses color cube approximation

3. **Basic ANSI Terminal** (TERM=xterm)
   - Falls back to nearest 16-color ANSI
   - Maps to standard color names

4. **No Color Support** (NO_COLOR=1 or TERM=dumb)
   - Strips all color codes
   - Plain text output only

### Terminal Detection Logic

```typescript
// Detection order:
1. Check NO_COLOR environment variable
2. Check COLORTERM for "truecolor" or "24bit"
3. Check TERM for "256color"
4. Check TERM for basic color support
5. Default to "none" if uncertain
```

### Force Color Mode

Override automatic detection:

```typescript
import { ConfigBuilder, Logger } from "jsr:@pedromdominguez/genesis-trace";

// Force colors on (even if terminal doesn't support them)
const logger = new Logger(
  new ConfigBuilder().colorMode("enabled").build()
);

// Force colors off (no ANSI codes)
const plainLogger = new Logger(
  new ConfigBuilder().colorMode("disabled").build()
);

// Auto-detect (default)
const autoLogger = new Logger(
  new ConfigBuilder().colorMode("auto").build()
);
```

## Best Practices

1. **Use Semantic Colors** - Prefer `codes.success` over `codes.green` for better intent
2. **Always Reset** - End colored text with `codes.reset` to avoid color bleeding
3. **Test Degradation** - Test your app with `NO_COLOR=1` to ensure readability
4. **Respect User Preferences** - Honor NO_COLOR environment variable
5. **Gradients for Data Viz** - Use gradients to represent continuous data (temperature, progress)

## Examples

### Progress Bar with Gradient

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const gradient = ColorSystem.createGradient(
  [255, 0, 0],   // Red (0%)
  [0, 255, 0],   // Green (100%)
  100
);

for (let i = 0; i <= 100; i++) {
  const color = gradient[i];
  const bar = "█".repeat(i) + "░".repeat(100 - i);
  console.log(`${color}${bar} ${i}%${ColorSystem.codes.reset}`);
  await new Promise(r => setTimeout(r, 50));
}
```

### Heatmap Visualization

```typescript
import { ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const values = [10, 25, 50, 75, 90, 100];
const gradient = ColorSystem.createGradient([0, 0, 255], [255, 0, 0], 100);

for (const value of values) {
  const color = gradient[value];
  console.log(`${color}Value: ${value}${ColorSystem.codes.reset}`);
}
```

---

[Back to Main README](../README.md)
