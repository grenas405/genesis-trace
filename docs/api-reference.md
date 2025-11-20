# API Reference

Complete API documentation for GenesisTrace.

## Table of Contents

- [Core Classes](#core-classes)
- [Visual Components](#visual-components)
- [Interfaces](#interfaces)
- [Types](#types)
- [Utilities](#utilities)

## Core Classes

### Logger

Main logging class with structured logging, child loggers, and history.

```typescript
class Logger {
  constructor(config?: StylerConfig, namespace?: string);

  // Log methods
  debug(message: string, metadata?: Record<string, any>): void;
  info(message: string, metadata?: Record<string, any>): void;
  success(message: string, metadata?: Record<string, any>): void;
  warning(message: string, metadata?: Record<string, any>): void;
  error(message: string, metadata?: Record<string, any>): void;
  critical(message: string, metadata?: Record<string, any>): void;

  // Child loggers
  child(namespace: string, overrides?: Partial<StylerConfig>): Logger;

  // Plugin management
  use(plugin: Plugin): void;

  // Configuration
  configure(config: Partial<StylerConfig>): void;

  // History
  getHistory(filter?: HistoryFilter): LogEntry[];
  clearHistory(): void;
  exportLogs(filepath: string): Promise<void>;

  // Lifecycle
  shutdown(): Promise<void>;
}
```

**Constructor Parameters:**

- `config` (optional): Logger configuration (see `StylerConfig`)
- `namespace` (optional): Namespace for child logger

**Log Methods:**
All log methods accept:

- `message` (required): The log message string
- `metadata` (optional): Structured data to attach to the log entry

**Child Loggers:**

- `child(namespace, overrides?)`: Create a namespaced child logger
  - `namespace`: String identifier (e.g., "api", "database")
  - `overrides`: Optional config overrides for this child

**Plugin Management:**

- `use(plugin)`: Register a plugin at runtime

**Configuration:**

- `configure(config)`: Update logger configuration after creation

**History:**

- `getHistory(filter?)`: Retrieve log history with optional filtering
  - `filter.level`: Filter by log level
  - `filter.since`: Filter by timestamp (Date)
- `clearHistory()`: Clear all history
- `exportLogs(filepath)`: Export history to JSON file

**Lifecycle:**

- `shutdown()`: Gracefully shutdown logger and all plugins

---

### ConfigBuilder

Fluent builder for logger configuration.

```typescript
class ConfigBuilder {
  colorMode(mode: "auto" | "enabled" | "disabled"): this;
  emojiMode(mode: "auto" | "enabled" | "disabled"): this;
  unicodeMode(mode: "auto" | "enabled" | "disabled"): this;
  timestampFormat(format: string): this;
  dateFormat(format: string): this;
  indentSize(size: number): this;
  maxLineWidth(width: number): this;
  logLevel(level: LogLevel): this;
  enableHistory(enable: boolean): this;
  maxHistorySize(size: number): this;
  theme(theme: Theme): this;
  plugin(plugin: Plugin): this;
  output(output: LogOutput): this;
  build(): StylerConfig;
}
```

**Methods:**

- `colorMode(mode)`: Set color mode ("auto", "enabled", "disabled")
- `emojiMode(mode)`: Set emoji mode ("auto", "enabled", "disabled")
- `unicodeMode(mode)`: Set unicode mode ("auto", "enabled", "disabled")
- `timestampFormat(format)`: Set timestamp format string
- `dateFormat(format)`: Set date format string
- `indentSize(size)`: Set indentation size in spaces
- `maxLineWidth(width)`: Set maximum line width
- `logLevel(level)`: Set minimum log level
- `enableHistory(enable)`: Enable/disable log history
- `maxHistorySize(size)`: Set maximum history size
- `theme(theme)`: Set theme
- `plugin(plugin)`: Add a plugin
- `output(output)`: Add an output destination
- `build()`: Build and return the configuration

**Example:**

```typescript
const config = new ConfigBuilder()
  .theme(neonTheme)
  .logLevel("info")
  .enableHistory(true)
  .maxHistorySize(500)
  .build();
```

---

### ColorSystem

Advanced color system with RGB, gradients, and terminal detection.

```typescript
class ColorSystem {
  // ANSI color codes
  static codes: {
    // Reset and modifiers
    reset: string;
    bold: string;
    dim: string;
    italic: string;
    underline: string;
    strikethrough: string;
    blink: string;
    reverse: string;
    hidden: string;

    // Standard colors
    black: string;
    red: string;
    green: string;
    yellow: string;
    blue: string;
    magenta: string;
    cyan: string;
    white: string;
    gray: string;

    // Bright colors
    brightRed: string;
    brightGreen: string;
    brightYellow: string;
    brightBlue: string;
    brightMagenta: string;
    brightCyan: string;
    brightWhite: string;

    // Background colors
    bgBlack: string;
    bgRed: string;
    bgGreen: string;
    bgYellow: string;
    bgBlue: string;
    bgMagenta: string;
    bgCyan: string;
    bgWhite: string;

    // Semantic colors
    success: string;
    error: string;
    warning: string;
    info: string;
    critical: string;
    accent: string;
    muted: string;
  };

  // True color (24-bit RGB)
  static rgb(r: number, g: number, b: number): string;
  static rgbBg(r: number, g: number, b: number): string;
  static hexToRgb(hex: string): string;
  static hexToRgbBg(hex: string): string;

  // 256-color palette
  static color256(code: number): string;
  static bgColor256(code: number): string;

  // Gradients
  static createGradient(
    start: [number, number, number],
    end: [number, number, number],
    steps: number,
  ): string[];

  // Terminal detection
  static detectColorSupport(): "none" | "basic" | "256" | "truecolor";
}
```

**Color Methods:**

- `rgb(r, g, b)`: Create 24-bit RGB foreground color (0-255 per channel)
- `rgbBg(r, g, b)`: Create 24-bit RGB background color
- `hexToRgb(hex)`: Convert hex color to RGB foreground (e.g., "#FF6B35")
- `hexToRgbBg(hex)`: Convert hex color to RGB background
- `color256(code)`: Use 256-color palette (0-255)
- `bgColor256(code)`: Use 256-color palette for background

**Gradient Methods:**

- `createGradient(start, end, steps)`: Create color gradient
  - `start`: Starting RGB color [r, g, b]
  - `end`: Ending RGB color [r, g, b]
  - `steps`: Number of intermediate colors
  - Returns: Array of ANSI color codes

**Detection:**

- `detectColorSupport()`: Detect terminal color capabilities
  - Returns: "none", "basic" (16 colors), "256", or "truecolor"

---

### Formatter

Utility formatters for common use cases.

```typescript
class Formatter {
  static bytes(bytes: number, decimals?: number): string;
  static duration(ms: number): string;
  static number(num: number): string;
  static currency(amount: number, currency?: string): string;
  static percentage(value: number, decimals?: number): string;
  static relativeTime(date: Date): string;
}
```

**Methods:**

- `bytes(bytes, decimals?)`: Format bytes with units (KB, MB, GB)
  - Example: `bytes(1234567)` → "1.18 MB"
- `duration(ms)`: Format milliseconds as human-readable duration
  - Example: `duration(125432)` → "2m 5s"
- `number(num)`: Format number with thousand separators
  - Example: `number(1234567)` → "1,234,567"
- `currency(amount, currency?)`: Format as currency
  - Example: `currency(1234.56)` → "$1,234.56"
- `percentage(value, decimals?)`: Format as percentage
  - Example: `percentage(0.8542)` → "85.42%"
- `relativeTime(date)`: Format as relative time
  - Example: `relativeTime(new Date(Date.now() - 3600000))` → "1 hour ago"

---

### ConsoleStyler

High-level console output with sections and request logging.

```typescript
class ConsoleStyler {
  static renderBanner(options: BannerOptions): void;
  static logSection(title: string, colorName?: string, style?: string): void;
  static logRequest(
    method: string,
    path: string,
    status: number,
    duration: number,
    size?: number,
  ): void;
}
```

**Methods:**

- `renderBanner(options)`: Render enterprise-grade startup banner
- `logSection(title, colorName?, style?)`: Log section header
- `logRequest(method, path, status, duration, size?)`: Log HTTP request

---

## Visual Components

### TableRenderer

```typescript
class TableRenderer {
  static render(data: any[], columns?: TableColumn[]): void;
  static renderKeyValue(items: Array<{ label: string; value: string }>): void;
}
```

**Types:**

```typescript
interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "right" | "center";
  format?: (value: any) => string;
}

interface TableOptions {
  border?: boolean;
  padding?: number;
}
```

---

### BoxRenderer

```typescript
class BoxRenderer {
  static render(content: string | string[], options?: BoxOptions): void;
  static message(message: string, type: "info" | "success" | "warning" | "error"): void;
}
```

**Types:**

```typescript
interface BoxOptions {
  style?: "single" | "double" | "rounded" | "bold";
  padding?: number;
  title?: string;
  align?: "left" | "center" | "right";
}

type BoxStyle = "single" | "double" | "rounded" | "bold";
```

---

### ProgressBar

```typescript
class ProgressBar {
  constructor(options: ProgressBarOptions);
  update(current: number): void;
  complete(message?: string): void;
}
```

**Types:**

```typescript
interface ProgressBarOptions {
  total: number;
  width?: number;
  label?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  completeChar?: string;
  incompleteChar?: string;
}
```

---

### Spinner

```typescript
class Spinner {
  constructor(options: SpinnerOptions);
  start(): void;
  update(message: string): void;
  succeed(message?: string): void;
  fail(message?: string): void;
  warn(message?: string): void;
  info(message?: string): void;
  stop(): void;
}
```

**Types:**

```typescript
interface SpinnerOptions {
  message?: string;
  style?: "dots" | "line" | "star" | "arrow" | "box" | "circle" | "bounce" | "pulse";
}
```

---

### ChartRenderer

```typescript
class ChartRenderer {
  static barChart(data: ChartData[], options?: ChartOptions): void;
}
```

**Types:**

```typescript
interface ChartData {
  label: string;
  value: number;
}

interface ChartOptions {
  width?: number;
  showValues?: boolean;
  color?: string;
  colors?: string[];
  title?: string;
  unit?: string;
}
```

---

### BannerRenderer

```typescript
class BannerRenderer {
  static render(options: BannerOptions): void;
}
```

**Types:**

```typescript
interface BannerOptions {
  title: string;
  subtitle?: string;
  version?: string;
  author?: string;
  style?: "single" | "double" | "bold";
}
```

---

### InteractivePrompts

```typescript
class InteractivePrompts {
  static input(prompt: string, defaultValue?: string): Promise<string>;
  static confirm(prompt: string, defaultValue?: boolean): Promise<boolean>;
  static select(prompt: string, options: string[]): Promise<string>;
}
```

**Methods:**

- `input(prompt, defaultValue?)`: Text input prompt
- `confirm(prompt, defaultValue?)`: Yes/no confirmation
- `select(prompt, options)`: Selection menu

---

## Interfaces

### ILogger

Logging abstraction interface for dependency injection.

```typescript
interface ILogger {
  logInfo(message: string, metadata?: Record<string, unknown>): void;
  logSuccess(message: string, metadata?: Record<string, unknown>): void;
  logWarning(message: string, metadata?: Record<string, unknown>): void;
  logError(message: string, metadata?: Record<string, unknown>): void;
  logDebug(message: string, metadata?: Record<string, unknown>): void;
  logCritical(message: string, metadata?: Record<string, unknown>): void;
  logRequest(
    method: string,
    path: string,
    status: number,
    duration: number,
    size?: number,
  ): void;
  logSection(title: string, colorName?: string, style?: string): void;
}
```

**Implementations:**

- `ConsoleStylerLogger`: Production implementation
- `defaultLogger`: Singleton instance

---

### Plugin

```typescript
interface Plugin {
  name: string;
  version: string;
  onInit?(config: StylerConfig): void | Promise<void>;
  onLog?(entry: LogEntry): void | Promise<void>;
  onShutdown?(): void | Promise<void>;
  extendMethods?(): Record<string, Function>;
}
```

---

### Theme

```typescript
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    debug: string;
    critical: string;
    muted: string;
    accent: string;
  };
  symbols: {
    success: string;
    error: string;
    warning: string;
    info: string;
    debug: string;
    critical: string;
    bullet: string;
    arrow: string;
    check: string;
    cross: string;
  };
  boxDrawing: {
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
  };
}
```

---

## Types

### LogLevel

```typescript
type LogLevel = "debug" | "info" | "success" | "warning" | "error" | "critical";
```

**Hierarchy** (from lowest to highest priority):

1. `debug` - Detailed debugging information
2. `info` - General informational messages
3. `success` - Successful operation completion
4. `warning` - Warning messages
5. `error` - Error conditions
6. `critical` - Critical failures

---

### LogEntry

```typescript
interface LogEntry {
  timestamp: Date;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  category?: string;
  requestId?: string;
  namespace?: string;
}
```

---

### StylerConfig

```typescript
interface StylerConfig {
  // Output modes
  colorMode: "auto" | "enabled" | "disabled";
  emojiMode: "auto" | "enabled" | "disabled";
  unicodeMode: "auto" | "enabled" | "disabled";

  // Formatting
  timestampFormat: string;
  dateFormat: string;
  indentSize: number;
  maxLineWidth: number;

  // Behavior
  logLevel: LogLevel;
  enableHistory: boolean;
  maxHistorySize: number;

  // Output targets
  outputs: LogOutput[];

  // Theme
  theme: Theme;

  // Plugins
  plugins: Plugin[];
}
```

---

### LogOutput

```typescript
interface LogOutput {
  type: "console" | "file" | "remote" | "custom";
  minLevel?: LogLevel;
  formatter?: (entry: LogEntry) => string;
}
```

---

## Utilities

### TerminalDetector

```typescript
class TerminalDetector {
  static detectColorSupport(): "none" | "basic" | "256" | "truecolor";
  static supportsUnicode(): boolean;
  static supportsEmoji(): boolean;
  static getTerminalWidth(): number;
  static getTerminalHeight(): number;
}
```

**Methods:**

- `detectColorSupport()`: Detect color capabilities
- `supportsUnicode()`: Check if terminal supports Unicode
- `supportsEmoji()`: Check if terminal supports emoji
- `getTerminalWidth()`: Get terminal width in columns
- `getTerminalHeight()`: Get terminal height in rows

---

## Built-in Plugins

### FileLoggerPlugin

```typescript
class FileLoggerPlugin implements Plugin {
  constructor(options: FileLoggerOptions);
}

interface FileLoggerOptions {
  filepath: string;
  format?: "text" | "json";
  append?: boolean;
  minLevel?: LogLevel;
  maxFileSize?: number;
  rotate?: boolean;
}
```

---

### JsonLoggerPlugin

```typescript
class JsonLoggerPlugin implements Plugin {
  constructor(options: JsonLoggerOptions);
}

interface JsonLoggerOptions {
  filepath: string;
  pretty?: boolean;
  includeMetadata?: boolean;
  minLevel?: LogLevel;
}
```

---

### RemoteLoggerPlugin

```typescript
class RemoteLoggerPlugin implements Plugin {
  constructor(options: RemoteLoggerOptions);
}

interface RemoteLoggerOptions {
  endpoint: string;
  method?: string;
  headers?: Record<string, string>;
  batchSize?: number;
  flushInterval?: number;
  minLevel?: LogLevel;
  retries?: number;
  timeout?: number;
}
```

---

### SlackLoggerPlugin

```typescript
class SlackLoggerPlugin implements Plugin {
  constructor(options: SlackLoggerOptions);
}

interface SlackLoggerOptions {
  webhookUrl: string;
  channel?: string;
  username?: string;
  iconEmoji?: string;
  minLevel?: LogLevel;
  includeMetadata?: boolean;
  mentionOnCritical?: string;
}
```

---

## Format Helpers

Re-exported from Formatter for convenience:

```typescript
export function formatBytes(bytes: number, decimals?: number): string;
export function formatDuration(ms: number): string;
export function formatNumber(num: number): string;
export function formatCurrency(amount: number, currency?: string): string;
export function formatPercentage(value: number, decimals?: number): string;
export function formatRelativeTime(date: Date): string;
```

---

[Back to Main README](../README.md)
