# Console Styler Library: Complete Technical Implementation Guide

**A Deep Dive into Professional Terminal Output Architecture**

---

## Table of Contents

1. [Architectural Philosophy](#architectural-philosophy)
2. [Core Design Principles](#core-design-principles)
3. [System Architecture Overview](#system-architecture-overview)
4. [Component Breakdown](#component-breakdown)
5. [Implementation Details](#implementation-details)
6. [Advanced Features](#advanced-features)
7. [Integration Patterns](#integration-patterns)
8. [Performance Considerations](#performance-considerations)
9. [Best Practices](#best-practices)

---

## Architectural Philosophy

### Unix Philosophy Convergence

The console-styler library embodies the core Unix philosophy principles:

#### **1. Do One Thing Well**
The library has a singular, focused purpose: **professional terminal output formatting**. It doesn't handle file I/O, networking, or business logic—only terminal styling and logging presentation.

```typescript
// ❌ ANTI-PATTERN: Mixing concerns
class Logger {
  logMessage(msg: string) { }
  saveToFile(msg: string) { }  // FILE I/O - separate module
  sendToServer(msg: string) { } // NETWORKING - separate module
}

// ✅ CORRECT: Single responsibility
class ConsoleStyler {
  // Only handles terminal output formatting
  logInfo(message: string): void { }
  logError(message: string): void { }
  formatTable(data: Array<Record<string, any>>): void { }
}
```

#### **2. Composability Through Modularity**
Each component is self-contained and can be used independently:

```typescript
// Core module structure
console-styler/
├── mod.ts              // Main exports
├── core/
│   ├── logger.ts       // Core logging functionality
│   ├── formatter.ts    // Text formatting utilities
│   └── colors.ts       // Color system
├── components/
│   ├── tables.ts       // Table rendering
│   ├── banners.ts      // Banner generation
│   ├── progress.ts     // Progress bars & spinners
│   └── boxes.ts        // Box drawing
├── plugins/
│   ├── file-logger.ts  // Log to file
│   ├── json-logger.ts  // JSON output
│   └── remote-logger.ts // Send logs to remote service
└── themes/
    ├── default.ts      // Default theme
    ├── minimal.ts      // Minimal theme
    └── theme-interface.ts // Theme system
```

#### **3. Text Streams as Universal Interface**
Everything flows as text through standard streams (stdout/stderr):

```typescript
// All output methods ultimately write to stdout/stderr
interface OutputTarget {
  write(data: string): void;
}

class ConsoleStyler {
  private output: OutputTarget = {
    write: (data: string) => {
      // By default, write to stdout
      Deno.stdout.write(new TextEncoder().encode(data));
    }
  };
  
  // Can redirect to any text stream
  setOutputTarget(target: OutputTarget): void {
    this.output = target;
  }
}
```

---

## Core Design Principles

### 1. ANSI Escape Code Foundation

ANSI escape codes are the fundamental building blocks for terminal styling. They're special character sequences that terminals interpret as formatting commands.

#### **Basic Structure**
```typescript
// ANSI escape code anatomy:
// ESC[<parameter>m
// Where ESC = \x1b (hexadecimal 27)

const ANSI_ESCAPE = '\x1b';
const ANSI_CODE = `${ANSI_ESCAPE}[`;

// Example: Red text
// \x1b[31m = Start red text
// \x1b[0m = Reset to default

const redText = `\x1b[31mThis is red\x1b[0m`;
```

#### **Color System Implementation**
```typescript
/**
 * Color code definitions following ANSI 256-color standard
 */
export const colors = {
  // Text modifiers
  reset: '\x1b[0m',      // Reset all attributes
  bright: '\x1b[1m',     // Bold/bright text
  dim: '\x1b[2m',        // Dimmed text
  italic: '\x1b[3m',     // Italic text
  underscore: '\x1b[4m', // Underlined text
  blink: '\x1b[5m',      // Blinking text (rarely used)
  reverse: '\x1b[7m',    // Inverted colors
  hidden: '\x1b[8m',     // Hidden text
  
  // Foreground colors (text)
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  
  // Extended colors (256-color palette)
  rgb: (r: number, g: number, b: number) => 
    `\x1b[38;2;${r};${g};${b}m`,
  bgRgb: (r: number, g: number, b: number) => 
    `\x1b[48;2;${r};${g};${b}m`,
  
  // Semantic colors (business context)
  success: '\x1b[32m',   // Green
  error: '\x1b[31m',     // Red
  warning: '\x1b[33m',   // Yellow
  info: '\x1b[36m',      // Cyan
  critical: '\x1b[91m',  // Bright red
  accent: '\x1b[95m',    // Bright magenta
  gold: '\x1b[93m',      // Bright yellow
} as const;
```

#### **Why This Structure?**
- **Type Safety**: `as const` makes the object immutable and gives us literal types
- **Semantic Naming**: `success`, `error`, `warning` map to business context
- **Extensibility**: RGB functions allow custom colors
- **Performance**: Pre-computed strings avoid runtime concatenation

### 2. Logging Level Hierarchy

```typescript
/**
 * Logging levels from least to most severe
 * Each level has associated visual treatment
 */
export type LogLevel = 
  | 'debug'     // Development/debugging info (gray)
  | 'info'      // General information (cyan)
  | 'success'   // Successful operations (green)
  | 'warning'   // Potential issues (yellow)
  | 'error'     // Error conditions (red)
  | 'critical'; // Critical failures (bright red)

/**
 * Log entry structure with metadata
 */
export interface LogEntry {
  timestamp: Date;           // When the log occurred
  level: LogLevel;          // Severity level
  message: string;          // Primary message
  metadata?: Record<string, any>; // Additional context
  category?: string;        // Logical grouping (e.g., 'database', 'auth')
  requestId?: string;       // Request correlation ID
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  minLevel: LogLevel;       // Minimum level to display
  showTimestamp: boolean;   // Include timestamps
  showMetadata: boolean;    // Display metadata objects
  colorize: boolean;        // Enable color output
  maxHistory: number;       // Log entries to keep in memory
}
```

### 3. Component Architecture

Each major feature is isolated into its own module:

```typescript
/**
 * Table rendering component
 */
export interface TableColumn {
  key: string;              // Data key to display
  label: string;            // Column header
  width?: number;           // Fixed width (or auto-calculate)
  align?: 'left' | 'center' | 'right';
  formatter?: (value: any) => string; // Custom formatting
}

export interface TableConfig {
  columns: TableColumn[];
  data: Array<Record<string, any>>;
  border: 'single' | 'double' | 'rounded' | 'none';
  headerColor?: keyof typeof colors;
  alternateRows?: boolean;  // Zebra striping
}

/**
 * Progress bar component
 */
export interface ProgressBarConfig {
  current: number;          // Current progress value
  total: number;            // Total/target value
  width?: number;           // Bar width in characters
  showPercentage: boolean;  // Display percentage
  showBar: boolean;         // Display visual bar
  colorThresholds?: {       // Color changes at thresholds
    warning: number;        // e.g., 60% turns yellow
    danger: number;         // e.g., 80% turns red
  };
}

/**
 * Banner component
 */
export interface BannerConfig {
  text: string;             // Banner text
  font?: 'standard' | 'doom' | 'slant'; // ASCII art font
  color?: keyof typeof colors;
  border?: boolean;
  padding?: number;
}
```

---

## System Architecture Overview

### High-Level Component Interaction

```
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  (Your business logic makes logging calls)              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│                 ConsoleStyler (Main API)                 │
│  ┌──────────────┬──────────────┬──────────────┐        │
│  │   Logger     │  Formatter   │   Colors     │        │
│  └──────────────┴──────────────┴──────────────┘        │
└─────────────────┬───────────────────────────────────────┘
                  │
         ┌────────┼────────┬────────┬────────┐
         ▼        ▼        ▼        ▼        ▼
    ┌────────┬────────┬────────┬────────┬────────┐
    │ Tables │Banners │Progress│ Boxes  │ Charts │ Components
    └────────┴────────┴────────┴────────┴────────┘
         │        │        │        │        │
         └────────┴────────┴────────┴────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Plugin System   │ (Optional extensions)
              │ ┌──────────────┐ │
              │ │ File Logger  │ │
              │ │ JSON Logger  │ │
              │ │Remote Logger │ │
              │ └──────────────┘ │
              └──────────────────┘
                        │
                        ▼
              ┌──────────────────┐
              │  Output Streams  │
              │  (stdout/stderr) │
              └──────────────────┘
```

### Data Flow Example

```typescript
// 1. Application makes a call
ConsoleStyler.logInfo("Server started", { port: 3000 });

// 2. Logger module processes the call
//    - Creates LogEntry object
//    - Checks log level filtering
//    - Adds timestamp
//    - Stores in history

// 3. Formatter module formats the output
//    - Applies color codes
//    - Formats metadata
//    - Adds icon

// 4. Output is written to stream
//    - stdout.write() for normal logs
//    - stderr.write() for errors

// 5. Optional plugins intercept
//    - File logger saves to disk
//    - Remote logger sends to server
```

---

## Component Breakdown

### 1. Core Module: Logger

The logger is the central orchestrator for all logging operations.

```typescript
// core/logger.ts

import { colors } from './colors.ts';
import type { LogEntry, LogLevel, LoggerConfig } from './types.ts';

/**
 * Main logger class implementing the core logging functionality
 */
export class Logger {
  private config: LoggerConfig;
  private history: LogEntry[] = [];
  private readonly maxHistory = 1000;
  
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: 'info',
      showTimestamp: true,
      showMetadata: true,
      colorize: true,
      maxHistory: 1000,
      ...config
    };
  }
  
  /**
   * Log with specific level
   */
  private log(
    level: LogLevel,
    message: string,
    icon: string,
    metadata?: Record<string, any>
  ): void {
    // Check if level should be logged
    if (!this.shouldLog(level)) return;
    
    // Create log entry
    const entry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      metadata
    };
    
    // Store in history
    this.addToHistory(entry);
    
    // Format and output
    const formatted = this.formatEntry(entry, icon);
    this.write(formatted, level);
  }
  
  /**
   * Level filtering logic
   */
  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = [
      'debug', 'info', 'success', 'warning', 'error', 'critical'
    ];
    
    const currentIndex = levels.indexOf(level);
    const minIndex = levels.indexOf(this.config.minLevel);
    
    return currentIndex >= minIndex;
  }
  
  /**
   * Format log entry for display
   */
  private formatEntry(entry: LogEntry, icon: string): string {
    const parts: string[] = [];
    
    // Timestamp
    if (this.config.showTimestamp) {
      const time = entry.timestamp.toISOString();
      parts.push(`${colors.dim}[${time}]${colors.reset}`);
    }
    
    // Icon and message
    const levelColor = this.getLevelColor(entry.level);
    parts.push(`${levelColor}${icon} ${entry.message}${colors.reset}`);
    
    // Metadata
    if (this.config.showMetadata && entry.metadata) {
      const metaStr = JSON.stringify(entry.metadata, null, 2);
      parts.push(`\n   ${colors.dim}${metaStr}${colors.reset}`);
    }
    
    return parts.join(' ');
  }
  
  /**
   * Get color for log level
   */
  private getLevelColor(level: LogLevel): string {
    const colorMap: Record<LogLevel, string> = {
      debug: colors.dim,
      info: colors.info,
      success: colors.success,
      warning: colors.warning,
      error: colors.error,
      critical: colors.critical
    };
    
    return this.config.colorize ? colorMap[level] : '';
  }
  
  /**
   * Write to appropriate stream
   */
  private write(message: string, level: LogLevel): void {
    const output = message + '\n';
    
    // Errors go to stderr, everything else to stdout
    if (level === 'error' || level === 'critical') {
      Deno.stderr.write(new TextEncoder().encode(output));
    } else {
      Deno.stdout.write(new TextEncoder().encode(output));
    }
  }
  
  /**
   * Add entry to history with size management
   */
  private addToHistory(entry: LogEntry): void {
    this.history.push(entry);
    
    // Maintain maximum history size
    if (this.history.length > this.maxHistory) {
      this.history.shift(); // Remove oldest
    }
  }
  
  // Public API methods
  
  debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', message, '🔍', metadata);
  }
  
  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, 'ℹ️ ', metadata);
  }
  
  success(message: string, metadata?: Record<string, any>): void {
    this.log('success', message, '✅', metadata);
  }
  
  warning(message: string, metadata?: Record<string, any>): void {
    this.log('warning', message, '⚠️ ', metadata);
  }
  
  error(message: string, metadata?: Record<string, any>): void {
    this.log('error', message, '❌', metadata);
  }
  
  critical(message: string, metadata?: Record<string, any>): void {
    this.log('critical', message, '🚨', metadata);
  }
  
  /**
   * Get log history (useful for debugging)
   */
  getHistory(level?: LogLevel): LogEntry[] {
    if (!level) return [...this.history];
    return this.history.filter(entry => entry.level === level);
  }
  
  /**
   * Clear log history
   */
  clearHistory(): void {
    this.history = [];
  }
}
```

#### **Why This Design?**

1. **Separation of Concerns**: Formatting, filtering, and output are separate steps
2. **Memory Management**: Automatic history pruning prevents memory leaks
3. **Stream Awareness**: Errors go to stderr (standard practice)
4. **Configurability**: Behavior can be customized without changing code
5. **Type Safety**: TypeScript ensures valid log levels and configurations

### 2. Core Module: Formatter

Handles text formatting and manipulation.

```typescript
// core/formatter.ts

import { colors } from './colors.ts';

/**
 * Text alignment options
 */
export type Alignment = 'left' | 'center' | 'right';

/**
 * Text formatting utilities
 */
export class Formatter {
  /**
   * Pad string to specific width with alignment
   */
  static pad(
    text: string,
    width: number,
    align: Alignment = 'left',
    fillChar = ' '
  ): string {
    // Remove ANSI codes for accurate length calculation
    const cleanText = this.stripAnsi(text);
    const textLength = cleanText.length;
    
    if (textLength >= width) {
      return text.substring(0, width);
    }
    
    const padding = width - textLength;
    
    switch (align) {
      case 'left':
        return text + fillChar.repeat(padding);
      case 'right':
        return fillChar.repeat(padding) + text;
      case 'center': {
        const leftPad = Math.floor(padding / 2);
        const rightPad = padding - leftPad;
        return fillChar.repeat(leftPad) + text + fillChar.repeat(rightPad);
      }
    }
  }
  
  /**
   * Truncate text to specific width with ellipsis
   */
  static truncate(text: string, maxWidth: number, ellipsis = '...'): string {
    const cleanText = this.stripAnsi(text);
    
    if (cleanText.length <= maxWidth) {
      return text;
    }
    
    const truncateWidth = maxWidth - ellipsis.length;
    return text.substring(0, truncateWidth) + ellipsis;
  }
  
  /**
   * Strip ANSI codes from string for accurate length measurement
   */
  static stripAnsi(text: string): string {
    // Regex to match ANSI escape codes
    const ansiRegex = /\x1b\[[0-9;]*m/g;
    return text.replace(ansiRegex, '');
  }
  
  /**
   * Wrap text to specific width
   */
  static wrap(text: string, width: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      
      if (this.stripAnsi(testLine).length <= width) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
    
    if (currentLine) lines.push(currentLine);
    return lines;
  }
  
  /**
   * Format bytes in human-readable form
   */
  static formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return `${(bytes / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
  }
  
  /**
   * Format duration in human-readable form
   */
  static formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds.toFixed(0)}s`;
    }
    
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}m ${secs}s`;
    }
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  }
  
  /**
   * Format number with thousand separators
   */
  static formatNumber(num: number, locale = 'en-US'): string {
    return num.toLocaleString(locale);
  }
  
  /**
   * Create a horizontal line/separator
   */
  static separator(
    width: number,
    char = '─',
    color?: keyof typeof colors
  ): string {
    const line = char.repeat(width);
    return color ? `${colors[color]}${line}${colors.reset}` : line;
  }
}
```

### 3. Core Module: Colors

The color system with extended capabilities.

```typescript
// core/colors.ts

/**
 * Complete ANSI color code definitions
 */
export const colors = {
  // Reset
  reset: '\x1b[0m',
  
  // Text styles
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  strikethrough: '\x1b[9m',
  
  // Standard foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Bright foreground colors
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  
  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  
  // Bright background colors
  bgBrightRed: '\x1b[101m',
  bgBrightGreen: '\x1b[102m',
  bgBrightYellow: '\x1b[103m',
  bgBrightBlue: '\x1b[104m',
  bgBrightMagenta: '\x1b[105m',
  bgBrightCyan: '\x1b[106m',
  bgBrightWhite: '\x1b[107m',
  
  // Semantic colors (business context)
  success: '\x1b[32m',      // Green
  error: '\x1b[31m',        // Red  
  warning: '\x1b[33m',      // Yellow
  info: '\x1b[36m',         // Cyan
  critical: '\x1b[91m',     // Bright red
  accent: '\x1b[95m',       // Bright magenta
  gold: '\x1b[93m',         // Bright yellow
} as const;

/**
 * RGB color helper (true color support)
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape code for RGB foreground color
 */
export function rgb(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * RGB background color helper
 * @param r - Red component (0-255)
 * @param g - Green component (0-255)
 * @param b - Blue component (0-255)
 * @returns ANSI escape code for RGB background color
 */
export function bgRgb(r: number, g: number, b: number): string {
  return `\x1b[48;2;${r};${g};${b}m`;
}

/**
 * 256-color palette helper
 * @param code - Color code (0-255)
 * @returns ANSI escape code for 256-color foreground
 */
export function color256(code: number): string {
  if (code < 0 || code > 255) {
    throw new Error('Color code must be between 0 and 255');
  }
  return `\x1b[38;5;${code}m`;
}

/**
 * 256-color background palette helper
 * @param code - Color code (0-255)
 * @returns ANSI escape code for 256-color background
 */
export function bgColor256(code: number): string {
  if (code < 0 || code > 255) {
    throw new Error('Color code must be between 0 and 255');
  }
  return `\x1b[48;5;${code}m`;
}

/**
 * Hex to RGB converter
 * @param hex - Hex color string (e.g., '#FF5733' or 'FF5733')
 * @returns RGB values as [r, g, b]
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  if (cleanHex.length !== 6) {
    throw new Error('Invalid hex color format');
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  return [r, g, b];
}

/**
 * Apply multiple styles to text
 * @param text - Text to style
 * @param styles - Array of color keys to apply
 * @returns Styled text with reset at the end
 */
export function styled(text: string, ...styles: Array<keyof typeof colors>): string {
  const codes = styles.map(style => colors[style]).join('');
  return `${codes}${text}${colors.reset}`;
}
```

#### **Advanced Color Usage Examples**

```typescript
// Basic colors
console.log(`${colors.red}Error message${colors.reset}`);

// Combined styles
console.log(`${colors.bright}${colors.blue}Important${colors.reset}`);

// RGB colors (true color)
const customRed = rgb(255, 87, 51);
console.log(`${customRed}Custom color${colors.reset}`);

// Hex colors
const [r, g, b] = hexToRgb('#FF5733');
console.log(`${rgb(r, g, b)}From hex${colors.reset}`);

// Helper function
console.log(styled('Multiple styles', 'bright', 'cyan', 'underscore'));
```

### 4. Core Module: Config

Configuration management and validation.

```typescript
// core/config.ts

import type { LogLevel } from './types.ts';

/**
 * Main configuration interface
 */
export interface ConsoleStylerConfig {
  // Logger settings
  logger: {
    minLevel: LogLevel;
    showTimestamp: boolean;
    showMetadata: boolean;
    colorize: boolean;
    maxHistory: number;
  };
  
  // Output settings
  output: {
    stream: 'stdout' | 'stderr' | 'both';
    encoding: 'utf-8' | 'utf-16';
  };
  
  // Component settings
  components: {
    tables: {
      defaultBorder: 'single' | 'double' | 'rounded' | 'none';
      alternateRows: boolean;
      maxColumnWidth: number;
    };
    progress: {
      defaultWidth: number;
      updateInterval: number; // ms
    };
    banners: {
      defaultFont: 'standard' | 'doom' | 'slant';
      defaultPadding: number;
    };
  };
  
  // Plugin settings
  plugins: {
    enabled: string[];
    config: Record<string, any>;
  };
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: ConsoleStylerConfig = {
  logger: {
    minLevel: 'info',
    showTimestamp: true,
    showMetadata: true,
    colorize: true,
    maxHistory: 1000,
  },
  output: {
    stream: 'stdout',
    encoding: 'utf-8',
  },
  components: {
    tables: {
      defaultBorder: 'single',
      alternateRows: true,
      maxColumnWidth: 50,
    },
    progress: {
      defaultWidth: 40,
      updateInterval: 100,
    },
    banners: {
      defaultFont: 'standard',
      defaultPadding: 2,
    },
  },
  plugins: {
    enabled: [],
    config: {},
  },
};

/**
 * Configuration manager
 */
export class ConfigManager {
  private config: ConsoleStylerConfig;
  
  constructor(userConfig: Partial<ConsoleStylerConfig> = {}) {
    this.config = this.mergeConfig(DEFAULT_CONFIG, userConfig);
  }
  
  /**
   * Deep merge configuration objects
   */
  private mergeConfig(
    defaults: ConsoleStylerConfig,
    user: Partial<ConsoleStylerConfig>
  ): ConsoleStylerConfig {
    return {
      logger: { ...defaults.logger, ...user.logger },
      output: { ...defaults.output, ...user.output },
      components: {
        tables: { ...defaults.components.tables, ...user.components?.tables },
        progress: { ...defaults.components.progress, ...user.components?.progress },
        banners: { ...defaults.components.banners, ...user.components?.banners },
      },
      plugins: { ...defaults.plugins, ...user.plugins },
    };
  }
  
  /**
   * Get full configuration
   */
  getConfig(): ConsoleStylerConfig {
    return { ...this.config };
  }
  
  /**
   * Update configuration
   */
  update(updates: Partial<ConsoleStylerConfig>): void {
    this.config = this.mergeConfig(this.config, updates);
  }
  
  /**
   * Get specific section
   */
  getLogger() {
    return this.config.logger;
  }
  
  getOutput() {
    return this.config.output;
  }
  
  getComponents() {
    return this.config.components;
  }
  
  getPlugins() {
    return this.config.plugins;
  }
}
```

---

## Component Implementations

### Component: Tables

Professional table rendering with extensive customization.

```typescript
// components/tables.ts

import { colors } from '../core/colors.ts';
import { Formatter } from '../core/formatter.ts';
import type { TableColumn } from '../core/types.ts';

/**
 * Border styles for tables
 */
const BORDERS = {
  single: {
    topLeft: '┌',
    topRight: '┐',
    bottomLeft: '└',
    bottomRight: '┘',
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    topT: '┬',
    bottomT: '┴',
    leftT: '├',
    rightT: '┤',
  },
  double: {
    topLeft: '╔',
    topRight: '╗',
    bottomLeft: '╚',
    bottomRight: '╝',
    horizontal: '═',
    vertical: '║',
    cross: '╬',
    topT: '╦',
    bottomT: '╩',
    leftT: '╠',
    rightT: '╣',
  },
  rounded: {
    topLeft: '╭',
    topRight: '╮',
    bottomLeft: '╰',
    bottomRight: '╯',
    horizontal: '─',
    vertical: '│',
    cross: '┼',
    topT: '┬',
    bottomT: '┴',
    leftT: '├',
    rightT: '┤',
  },
} as const;

export type BorderStyle = keyof typeof BORDERS;

/**
 * Table configuration
 */
export interface TableConfig {
  border: BorderStyle;
  alternateRows: boolean;
  headerColor: keyof typeof colors;
  maxColumnWidth?: number;
}

/**
 * Table renderer
 */
export class TableRenderer {
  /**
   * Render a table with the provided data and columns
   */
  static render(
    data: Array<Record<string, any>>,
    columns: TableColumn[],
    config: Partial<TableConfig> = {}
  ): void {
    if (data.length === 0) {
      console.log(`${colors.warning}No data to display${colors.reset}`);
      return;
    }
    
    const fullConfig: TableConfig = {
      border: 'single',
      alternateRows: true,
      headerColor: 'cyan',
      maxColumnWidth: 50,
      ...config,
    };
    
    // Calculate column widths
    const widths = this.calculateWidths(data, columns, fullConfig.maxColumnWidth!);
    
    // Get border characters
    const border = BORDERS[fullConfig.border];
    
    // Render table
    this.renderTopBorder(widths, border);
    this.renderHeader(columns, widths, border, fullConfig.headerColor);
    this.renderHeaderSeparator(widths, border);
    this.renderRows(data, columns, widths, border, fullConfig.alternateRows);
    this.renderBottomBorder(widths, border);
  }
  
  /**
   * Calculate optimal column widths
   */
  private static calculateWidths(
    data: Array<Record<string, any>>,
    columns: TableColumn[],
    maxWidth: number
  ): number[] {
    return columns.map((col, index) => {
      // Start with column label width
      let width = col.label.length;
      
      // Check all data rows
      for (const row of data) {
        const value = row[col.key];
        const formatted = col.formatter 
          ? col.formatter(value) 
          : String(value ?? '');
        const cleanLength = Formatter.stripAnsi(formatted).length;
        width = Math.max(width, cleanLength);
      }
      
      // Apply fixed width if specified, otherwise use max width constraint
      return col.width ?? Math.min(width + 2, maxWidth);
    });
  }
  
  /**
   * Render top border
   */
  private static renderTopBorder(
    widths: number[],
    border: typeof BORDERS.single
  ): void {
    const segments = widths.map(w => border.horizontal.repeat(w + 2));
    const line = border.topLeft + segments.join(border.topT) + border.topRight;
    console.log(`${colors.bright}${line}${colors.reset}`);
  }
  
  /**
   * Render header row
   */
  private static renderHeader(
    columns: TableColumn[],
    widths: number[],
    border: typeof BORDERS.single,
    headerColor: keyof typeof colors
  ): void {
    const cells = columns.map((col, i) => {
      const padded = Formatter.pad(col.label, widths[i], col.align || 'left');
      return `${colors[headerColor]}${padded}${colors.reset}`;
    });
    
    const row = border.vertical + ' ' + cells.join(` ${border.vertical} `) + ' ' + border.vertical;
    console.log(`${colors.bright}${row}${colors.reset}`);
  }
  
  /**
   * Render separator between header and data
   */
  private static renderHeaderSeparator(
    widths: number[],
    border: typeof BORDERS.single
  ): void {
    const segments = widths.map(w => border.horizontal.repeat(w + 2));
    const line = border.leftT + segments.join(border.cross) + border.rightT;
    console.log(`${colors.bright}${line}${colors.reset}`);
  }
  
  /**
   * Render data rows
   */
  private static renderRows(
    data: Array<Record<string, any>>,
    columns: TableColumn[],
    widths: number[],
    border: typeof BORDERS.single,
    alternate: boolean
  ): void {
    data.forEach((row, rowIndex) => {
      const cells = columns.map((col, colIndex) => {
        const value = row[col.key];
        const formatted = col.formatter 
          ? col.formatter(value) 
          : String(value ?? '');
        
        // Truncate if needed
        const truncated = formatted.length > widths[colIndex]
          ? Formatter.truncate(formatted, widths[colIndex])
          : formatted;
        
        return Formatter.pad(truncated, widths[colIndex], col.align || 'left');
      });
      
      // Apply alternate row coloring
      const rowColor = alternate && rowIndex % 2 === 0 ? colors.dim : '';
      const rowContent = border.vertical + ' ' + cells.join(` ${border.vertical} `) + ' ' + border.vertical;
      
      console.log(`${rowColor}${rowContent}${colors.reset}`);
    });
  }
  
  /**
   * Render bottom border
   */
  private static renderBottomBorder(
    widths: number[],
    border: typeof BORDERS.single
  ): void {
    const segments = widths.map(w => border.horizontal.repeat(w + 2));
    const line = border.bottomLeft + segments.join(border.bottomT) + border.bottomRight;
    console.log(`${colors.bright}${line}${colors.reset}`);
  }
}
```

#### **Usage Example**

```typescript
// Example: Display user data in a table
const users = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', status: 'active' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', status: 'inactive' },
  { id: 3, name: 'Carol Williams', email: 'carol@example.com', status: 'active' },
];

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: 5, align: 'right' },
  { key: 'name', label: 'Name', width: 20 },
  { key: 'email', label: 'Email', width: 30 },
  {
    key: 'status',
    label: 'Status',
    width: 10,
    formatter: (value) => {
      return value === 'active' 
        ? `${colors.green}●${colors.reset} Active`
        : `${colors.gray}○${colors.reset} Inactive`;
    },
  },
];

TableRenderer.render(users, columns, {
  border: 'rounded',
  alternateRows: true,
  headerColor: 'cyan',
});

/* Output:
╭───────┬──────────────────────┬────────────────────────────────┬──────────╮
│ ID    │ Name                 │ Email                          │ Status   │
├───────┼──────────────────────┼────────────────────────────────┼──────────┤
│     1 │ Alice Johnson        │ alice@example.com              │ ● Active │
│     2 │ Bob Smith            │ bob@example.com                │ ○ Inactive│
│     3 │ Carol Williams       │ carol@example.com              │ ● Active │
╰───────┴──────────────────────┴────────────────────────────────┴──────────╯
*/
```

### Component: Progress Bars

Dynamic progress indicators with real-time updates.

```typescript
// components/progress.ts

import { colors } from '../core/colors.ts';

/**
 * Progress bar configuration
 */
export interface ProgressConfig {
  current: number;
  total: number;
  width?: number;
  label?: string;
  showPercentage?: boolean;
  showBar?: boolean;
  colorThresholds?: {
    success: number;  // Below this = green
    warning: number;  // Below this = yellow
    danger: number;   // Above this = red
  };
}

/**
 * Progress bar renderer
 */
export class ProgressBar {
  private config: Required<ProgressConfig>;
  private lastOutput = '';
  
  constructor(config: ProgressConfig) {
    this.config = {
      width: 40,
      label: '',
      showPercentage: true,
      showBar: true,
      colorThresholds: {
        success: 60,
        warning: 80,
        danger: 100,
      },
      ...config,
    };
  }
  
  /**
   * Update progress and re-render
   */
  update(current: number): void {
    this.config.current = current;
    this.render();
  }
  
  /**
   * Render the progress bar
   */
  private render(): void {
    const percentage = (this.config.current / this.config.total) * 100;
    const filled = Math.floor((percentage / 100) * this.config.width);
    const empty = this.config.width - filled;
    
    // Determine color based on thresholds
    let barColor: keyof typeof colors;
    if (percentage < this.config.colorThresholds.success) {
      barColor = 'green';
    } else if (percentage < this.config.colorThresholds.warning) {
      barColor = 'yellow';
    } else {
      barColor = 'red';
    }
    
    // Build output
    const parts: string[] = [];
    
    // Label
    if (this.config.label) {
      parts.push(`${colors.bright}${this.config.label}:${colors.reset}`);
    }
    
    // Bar
    if (this.config.showBar) {
      const filledBar = '█'.repeat(filled);
      const emptyBar = '░'.repeat(empty);
      parts.push(`${colors[barColor]}${filledBar}${colors.dim}${emptyBar}${colors.reset}`);
    }
    
    // Percentage
    if (this.config.showPercentage) {
      parts.push(`${percentage.toFixed(1)}%`);
    }
    
    // Progress numbers
    parts.push(`(${this.config.current}/${this.config.total})`);
    
    const output = parts.join(' ');
    
    // Clear previous line and write new one
    this.clearLine();
    Deno.stdout.writeSync(new TextEncoder().encode(output));
    
    this.lastOutput = output;
  }
  
  /**
   * Clear the current line
   */
  private clearLine(): void {
    // Move cursor to start of line and clear it
    Deno.stdout.writeSync(new TextEncoder().encode('\r\x1b[K'));
  }
  
  /**
   * Complete the progress bar and move to next line
   */
  complete(message?: string): void {
    this.update(this.config.total);
    if (message) {
      console.log(` ${colors.success}✓ ${message}${colors.reset}`);
    } else {
      console.log(''); // New line
    }
  }
}

/**
 * Spinner for indeterminate progress
 */
export class Spinner {
  private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  private currentFrame = 0;
  private interval: number | null = null;
  private message: string;
  
  constructor(message = 'Loading...') {
    this.message = message;
  }
  
  /**
   * Start the spinner animation
   */
  start(): void {
    this.interval = setInterval(() => {
      this.render();
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }, 80);
  }
  
  /**
   * Stop the spinner
   */
  stop(finalMessage?: string): void {
    if (this.interval !== null) {
      clearInterval(this.interval);
      this.interval = null;
    }
    
    // Clear the line
    Deno.stdout.writeSync(new TextEncoder().encode('\r\x1b[K'));
    
    if (finalMessage) {
      console.log(`${colors.success}✓ ${finalMessage}${colors.reset}`);
    }
  }
  
  /**
   * Render current frame
   */
  private render(): void {
    const frame = this.frames[this.currentFrame];
    const output = `${colors.cyan}${frame}${colors.reset} ${this.message}`;
    
    Deno.stdout.writeSync(new TextEncoder().encode(`\r${output}`));
  }
  
  /**
   * Update the message while spinning
   */
  updateMessage(message: string): void {
    this.message = message;
  }
}
```

#### **Usage Examples**

```typescript
// Progress bar for file upload
const progressBar = new ProgressBar({
  current: 0,
  total: 100,
  label: 'Uploading',
  showPercentage: true,
  showBar: true,
});

// Simulate upload progress
for (let i = 0; i <= 100; i += 10) {
  await new Promise(resolve => setTimeout(resolve, 200));
  progressBar.update(i);
}

progressBar.complete('Upload complete!');

// Spinner for indeterminate operations
const spinner = new Spinner('Processing data...');
spinner.start();

await someAsyncOperation();

spinner.stop('Processing complete!');
```

### Component: Banners

ASCII art banners for application startup and branding.

```typescript
// components/banners.ts

import { colors } from '../core/colors.ts';

/**
 * Banner fonts (simplified ASCII art)
 */
const FONTS = {
  standard: {
    height: 5,
    chars: {
      'A': ['  ___  ', ' / _ \\ ', '| |_| |', '|  _  |', '|_| |_|'],
      'B': [' _____ ', '|  _  |', '| |_| |', '|  _  |', '|_______|'],
      // ... (would include full alphabet)
    },
  },
  doom: {
    height: 6,
    chars: {
      'A': [' _______ ', '|   _   |', '|  |_|  |', '|       |', '|       |', '|_______|'],
      // ... (would include full alphabet)
    },
  },
} as const;

/**
 * Banner renderer
 */
export class BannerRenderer {
  /**
   * Render a simple text banner with borders
   */
  static simple(
    text: string,
    color: keyof typeof colors = 'cyan'
  ): void {
    const lines = text.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length));
    
    // Top border
    const border = '═'.repeat(maxLength + 4);
    console.log(`${colors[color]}╔${border}╗${colors.reset}`);
    
    // Text lines
    lines.forEach(line => {
      const padded = line.padEnd(maxLength);
      console.log(`${colors[color]}║  ${colors.bright}${padded}${colors.reset}${colors[color]}  ║${colors.reset}`);
    });
    
    // Bottom border
    console.log(`${colors[color]}╚${border}╝${colors.reset}`);
  }
  
  /**
   * Render application startup banner
   */
  static startup(config: {
    name: string;
    version: string;
    tagline?: string;
    color?: keyof typeof colors;
  }): void {
    const color = config.color || 'cyan';
    
    console.log('');
    this.simple(
      `${config.name} v${config.version}\n${config.tagline || ''}`,
      color
    );
    console.log('');
  }
  
  /**
   * Render a boxed message
   */
  static box(
    content: string[],
    title?: string,
    color: keyof typeof colors = 'blue'
  ): void {
    const maxWidth = Math.max(
      title ? title.length : 0,
      ...content.map(line => line.length)
    );
    
    // Top border
    if (title) {
      const titlePadding = Math.floor((maxWidth - title.length) / 2);
      const border = '─'.repeat(maxWidth + 4);
      console.log(`${colors[color]}╭${border}╮${colors.reset}`);
      console.log(
        `${colors[color]}│  ${colors.bright}${' '.repeat(titlePadding)}${title}${' '.repeat(maxWidth - title.length - titlePadding)}${colors.reset}${colors[color]}  │${colors.reset}`
      );
      const separator = '─'.repeat(maxWidth + 4);
      console.log(`${colors[color]}├${separator}┤${colors.reset}`);
    } else {
      const border = '─'.repeat(maxWidth + 4);
      console.log(`${colors[color]}╭${border}╮${colors.reset}`);
    }
    
    // Content
    content.forEach(line => {
      const padded = line.padEnd(maxWidth);
      console.log(`${colors[color]}│  ${colors.reset}${padded}${colors[color]}  │${colors.reset}`);
    });
    
    // Bottom border
    const border = '─'.repeat(maxWidth + 4);
    console.log(`${colors[color]}╰${border}╯${colors.reset}`);
  }
}
```

### Component: Boxes

Draw boxes around content for emphasis.

```typescript
// components/boxes.ts

import { colors } from '../core/colors.ts';
import { Formatter } from '../core/formatter.ts';

export type BoxBorder = 'single' | 'double' | 'rounded' | 'bold';

const BOX_CHARS = {
  single: {
    topLeft: '┌', topRight: '┐', bottomLeft: '└', bottomRight: '┘',
    horizontal: '─', vertical: '│',
  },
  double: {
    topLeft: '╔', topRight: '╗', bottomLeft: '╚', bottomRight: '╝',
    horizontal: '═', vertical: '║',
  },
  rounded: {
    topLeft: '╭', topRight: '╮', bottomLeft: '╰', bottomRight: '╯',
    horizontal: '─', vertical: '│',
  },
  bold: {
    topLeft: '┏', topRight: '┓', bottomLeft: '┗', bottomRight: '┛',
    horizontal: '━', vertical: '┃',
  },
} as const;

/**
 * Box renderer for emphasizing content
 */
export class BoxRenderer {
  /**
   * Draw a box around content
   */
  static draw(
    content: string | string[],
    options: {
      title?: string;
      border?: BoxBorder;
      color?: keyof typeof colors;
      padding?: number;
      width?: number;
    } = {}
  ): void {
    const {
      title,
      border = 'single',
      color = 'cyan',
      padding = 1,
      width,
    } = options;
    
    const lines = Array.isArray(content) ? content : [content];
    const chars = BOX_CHARS[border];
    
    // Calculate box width
    const contentWidth = width || Math.max(
      title ? title.length : 0,
      ...lines.map(l => Formatter.stripAnsi(l).length)
    ) + (padding * 2);
    
    // Top border with optional title
    if (title) {
      const titlePadding = Math.floor((contentWidth - title.length) / 2);
      const leftBorder = chars.horizontal.repeat(titlePadding);
      const rightBorder = chars.horizontal.repeat(contentWidth - title.length - titlePadding);
      console.log(
        `${colors[color]}${chars.topLeft}${leftBorder}${colors.bright} ${title} ${colors.reset}${colors[color]}${rightBorder}${chars.topRight}${colors.reset}`
      );
    } else {
      const topBorder = chars.horizontal.repeat(contentWidth);
      console.log(`${colors[color]}${chars.topLeft}${topBorder}${chars.topRight}${colors.reset}`);
    }
    
    // Content lines
    lines.forEach(line => {
      const cleanLine = Formatter.stripAnsi(line);
      const padded = Formatter.pad(line, contentWidth - (padding * 2), 'left');
      const leftPad = ' '.repeat(padding);
      const rightPad = ' '.repeat(padding);
      console.log(
        `${colors[color]}${chars.vertical}${colors.reset}${leftPad}${padded}${rightPad}${colors[color]}${chars.vertical}${colors.reset}`
      );
    });
    
    // Bottom border
    const bottomBorder = chars.horizontal.repeat(contentWidth);
    console.log(`${colors[color]}${chars.bottomLeft}${bottomBorder}${chars.bottomRight}${colors.reset}`);
  }
}
```

### Component: Charts (ASCII Charts)

Simple ASCII charts for data visualization.

```typescript
// components/charts.ts

import { colors } from '../core/colors.ts';
import { Formatter } from '../core/formatter.ts';

/**
 * Bar chart renderer
 */
export class BarChart {
  /**
   * Render a horizontal bar chart
   */
  static render(
    data: Array<{ label: string; value: number }>,
    options: {
      maxWidth?: number;
      showValues?: boolean;
      color?: keyof typeof colors;
    } = {}
  ): void {
    const {
      maxWidth = 40,
      showValues = true,
      color = 'cyan',
    } = options;
    
    // Find maximum value for scaling
    const maxValue = Math.max(...data.map(d => d.value));
    const labelWidth = Math.max(...data.map(d => d.label.length));
    
    // Render each bar
    data.forEach(item => {
      const barLength = Math.floor((item.value / maxValue) * maxWidth);
      const bar = '█'.repeat(barLength);
      const label = item.label.padEnd(labelWidth);
      const value = showValues ? ` ${item.value}` : '';
      
      console.log(
        `${colors.dim}${label}${colors.reset} ${colors[color]}${bar}${colors.reset}${value}`
      );
    });
  }
}

/**
 * Sparkline renderer (inline mini-charts)
 */
export class Sparkline {
  private static readonly BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];
  
  /**
   * Render a sparkline from data points
   */
  static render(
    data: number[],
    color: keyof typeof colors = 'cyan'
  ): string {
    if (data.length === 0) return '';
    
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    if (range === 0) {
      return this.BARS[4].repeat(data.length); // Middle bar for flat data
    }
    
    const bars = data.map(value => {
      const normalized = (value - min) / range;
      const index = Math.floor(normalized * (this.BARS.length - 1));
      return this.BARS[index];
    });
    
    return `${colors[color]}${bars.join('')}${colors.reset}`;
  }
}
```

---

## Plugin System

### Plugin Interface

```typescript
// plugins/plugin-interface.ts

import type { LogEntry } from '../core/types.ts';

/**
 * Base interface for all plugins
 */
export interface Plugin {
  name: string;
  version: string;
  
  /**
   * Initialize the plugin
   */
  init(config: Record<string, any>): Promise<void> | void;
  
  /**
   * Handle log entries
   */
  onLog(entry: LogEntry): Promise<void> | void;
  
  /**
   * Cleanup resources
   */
  destroy(): Promise<void> | void;
}

/**
 * Plugin manager
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  
  /**
   * Register a plugin
   */
  async register(plugin: Plugin, config: Record<string, any> = {}): Promise<void> {
    await plugin.init(config);
    this.plugins.set(plugin.name, plugin);
  }
  
  /**
   * Unregister a plugin
   */
  async unregister(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin) {
      await plugin.destroy();
      this.plugins.delete(name);
    }
  }
  
  /**
   * Notify all plugins of a log entry
   */
  async notify(entry: LogEntry): Promise<void> {
    const promises = Array.from(this.plugins.values()).map(
      plugin => plugin.onLog(entry)
    );
    await Promise.all(promises);
  }
  
  /**
   * Get all registered plugins
   */
  getPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }
}
```

### File Logger Plugin

```typescript
// plugins/file-logger.ts

import type { Plugin } from './plugin-interface.ts';
import type { LogEntry } from '../core/types.ts';

/**
 * Plugin that writes logs to a file
 */
export class FileLoggerPlugin implements Plugin {
  name = 'file-logger';
  version = '1.0.0';
  
  private filePath: string = '';
  private encoder = new TextEncoder();
  
  async init(config: { filePath: string }): Promise<void> {
    this.filePath = config.filePath;
    
    // Ensure log file exists
    try {
      await Deno.stat(this.filePath);
    } catch {
      // File doesn't exist, create it
      await Deno.writeTextFile(this.filePath, '');
    }
  }
  
  async onLog(entry: LogEntry): Promise<void> {
    const logLine = this.formatEntry(entry);
    
    // Append to file
    const file = await Deno.open(this.filePath, {
      write: true,
      append: true,
    });
    
    await file.write(this.encoder.encode(logLine + '\n'));
    file.close();
  }
  
  private formatEntry(entry: LogEntry): string {
    const parts = [
      entry.timestamp.toISOString(),
      entry.level.toUpperCase(),
      entry.message,
    ];
    
    if (entry.metadata) {
      parts.push(JSON.stringify(entry.metadata));
    }
    
    return parts.join(' | ');
  }
  
  async destroy(): Promise<void> {
    // No cleanup needed
  }
}
```

### JSON Logger Plugin

```typescript
// plugins/json-logger.ts

import type { Plugin } from './plugin-interface.ts';
import type { LogEntry } from '../core/types.ts';

/**
 * Plugin that outputs logs in JSON format
 */
export class JsonLoggerPlugin implements Plugin {
  name = 'json-logger';
  version = '1.0.0';
  
  private filePath: string = '';
  
  async init(config: { filePath: string }): Promise<void> {
    this.filePath = config.filePath;
    
    // Initialize file with empty array
    try {
      await Deno.stat(this.filePath);
    } catch {
      await Deno.writeTextFile(this.filePath, '[]');
    }
  }
  
  async onLog(entry: LogEntry): Promise<void> {
    // Read existing logs
    const content = await Deno.readTextFile(this.filePath);
    const logs = JSON.parse(content);
    
    // Add new entry
    logs.push({
      timestamp: entry.timestamp.toISOString(),
      level: entry.level,
      message: entry.message,
      metadata: entry.metadata,
      category: entry.category,
      requestId: entry.requestId,
    });
    
    // Write back
    await Deno.writeTextFile(
      this.filePath,
      JSON.stringify(logs, null, 2)
    );
  }
  
  async destroy(): Promise<void> {
    // No cleanup needed
  }
}
```

### Remote Logger Plugin

```typescript
// plugins/remote-logger.ts

import type { Plugin } from './plugin-interface.ts';
import type { LogEntry } from '../core/types.ts';

/**
 * Plugin that sends logs to a remote service
 */
export class RemoteLoggerPlugin implements Plugin {
  name = 'remote-logger';
  version = '1.0.0';
  
  private endpoint: string = '';
  private apiKey: string = '';
  private batchSize: number = 10;
  private batch: LogEntry[] = [];
  private flushInterval: number | null = null;
  
  async init(config: {
    endpoint: string;
    apiKey: string;
    batchSize?: number;
    flushIntervalMs?: number;
  }): Promise<void> {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.batchSize = config.batchSize || 10;
    
    // Set up periodic flushing
    if (config.flushIntervalMs) {
      this.flushInterval = setInterval(
        () => this.flush(),
        config.flushIntervalMs
      );
    }
  }
  
  async onLog(entry: LogEntry): Promise<void> {
    this.batch.push(entry);
    
    // Flush if batch is full
    if (this.batch.length >= this.batchSize) {
      await this.flush();
    }
  }
  
  private async flush(): Promise<void> {
    if (this.batch.length === 0) return;
    
    const logs = [...this.batch];
    this.batch = [];
    
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({ logs }),
      });
    } catch (error) {
      // Put logs back if send failed
      this.batch.unshift(...logs);
      console.error('Failed to send logs to remote service:', error);
    }
  }
  
  async destroy(): Promise<void> {
    // Clear flush interval
    if (this.flushInterval !== null) {
      clearInterval(this.flushInterval);
    }
    
    // Flush remaining logs
    await this.flush();
  }
}
```

---

## Complete Implementation Example

Here's how all the components come together:

```typescript
// mod.ts - Main entry point

// Core exports
export { Logger } from './core/logger.ts';
export { Formatter } from './core/formatter.ts';
export { colors, rgb, bgRgb, color256, bgColor256, hexToRgb, styled } from './core/colors.ts';
export { ConfigManager, DEFAULT_CONFIG } from './core/config.ts';
export type { ConsoleStylerConfig } from './core/config.ts';
export type { LogEntry, LogLevel } from './core/types.ts';

// Component exports
export { TableRenderer } from './components/tables.ts';
export type { TableColumn, TableConfig, BorderStyle } from './components/tables.ts';
export { ProgressBar, Spinner } from './components/progress.ts';
export { BannerRenderer } from './components/banners.ts';
export { BoxRenderer } from './components/boxes.ts';
export type { BoxBorder } from './components/boxes.ts';
export { BarChart, Sparkline } from './components/charts.ts';

// Plugin exports
export { PluginManager } from './plugins/plugin-interface.ts';
export type { Plugin } from './plugins/plugin-interface.ts';
export { FileLoggerPlugin } from './plugins/file-logger.ts';
export { JsonLoggerPlugin } from './plugins/json-logger.ts';
export { RemoteLoggerPlugin } from './plugins/remote-logger.ts';

// Main ConsoleStyler class that ties everything together
export class ConsoleStyler {
  private static logger = new Logger();
  private static pluginManager = new PluginManager();
  
  // Logging methods
  static debug(message: string, metadata?: Record<string, any>): void {
    this.logger.debug(message, metadata);
  }
  
  static info(message: string, metadata?: Record<string, any>): void {
    this.logger.info(message, metadata);
  }
  
  static success(message: string, metadata?: Record<string, any>): void {
    this.logger.success(message, metadata);
  }
  
  static warning(message: string, metadata?: Record<string, any>): void {
    this.logger.warning(message, metadata);
  }
  
  static error(message: string, metadata?: Record<string, any>): void {
    this.logger.error(message, metadata);
  }
  
  static critical(message: string, metadata?: Record<string, any>): void {
    this.logger.critical(message, metadata);
  }
  
  // Component methods
  static table(
    data: Array<Record<string, any>>,
    columns: TableColumn[],
    config?: Partial<TableConfig>
  ): void {
    TableRenderer.render(data, columns, config);
  }
  
  static banner(text: string, color?: keyof typeof colors): void {
    BannerRenderer.simple(text, color);
  }
  
  static box(
    content: string | string[],
    options?: Parameters<typeof BoxRenderer.draw>[1]
  ): void {
    BoxRenderer.draw(content, options);
  }
  
  // Plugin management
  static async registerPlugin(plugin: Plugin, config?: Record<string, any>): Promise<void> {
    await this.pluginManager.register(plugin, config);
  }
  
  static async unregisterPlugin(name: string): Promise<void> {
    await this.pluginManager.unregister(name);
  }
}
```

### Usage Example: Complete Application

```typescript
// example-app.ts

import {
  ConsoleStyler,
  colors,
  FileLoggerPlugin,
  type TableColumn,
} from './mod.ts';

// Initialize with file logging plugin
await ConsoleStyler.registerPlugin(
  new FileLoggerPlugin(),
  { filePath: './app.log' }
);

// Startup banner
ConsoleStyler.banner('MY APPLICATION v1.0.0\nProfessional Console Output', 'cyan');

// Log application startup
ConsoleStyler.info('Application starting...', {
  environment: 'production',
  port: 3000,
});

// Display configuration in a box
ConsoleStyler.box([
  'Environment: Production',
  'Port: 3000',
  'Database: PostgreSQL',
  'Cache: Redis',
], 'Configuration', 'green');

// Simulate some operations
ConsoleStyler.info('Connecting to database...');
await new Promise(resolve => setTimeout(resolve, 1000));
ConsoleStyler.success('Database connected');

ConsoleStyler.info('Starting HTTP server...');
await new Promise(resolve => setTimeout(resolve, 500));
ConsoleStyler.success('Server listening on port 3000');

// Display some data in a table
const users = [
  { id: 1, name: 'Alice', status: 'active', lastLogin: '2025-01-15' },
  { id: 2, name: 'Bob', status: 'inactive', lastLogin: '2025-01-10' },
  { id: 3, name: 'Carol', status: 'active', lastLogin: '2025-01-16' },
];

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: 5, align: 'right' },
  { key: 'name', label: 'Name', width: 15 },
  {
    key: 'status',
    label: 'Status',
    width: 12,
    formatter: (val) => {
      return val === 'active'
        ? `${colors.green}● Active${colors.reset}`
        : `${colors.gray}○ Inactive${colors.reset}`;
    },
  },
  { key: 'lastLogin', label: 'Last Login', width: 12 },
];

console.log('\n');
ConsoleStyler.table(users, columns, {
  border: 'rounded',
  alternateRows: true,
  headerColor: 'cyan',
});

// Warning example
ConsoleStyler.warning('High memory usage detected', {
  current: '850MB',
  max: '1GB',
  percentage: 85,
});

// Error example
ConsoleStyler.error('Failed to connect to cache server', {
  host: 'redis.example.com',
  port: 6379,
  error: 'Connection timeout',
});
```

---

## Performance Considerations

### 1. ANSI Code Caching

```typescript
// Cache frequently used color combinations
const colorCache = new Map<string, string>();

function getCachedColor(color: keyof typeof colors): string {
  if (!colorCache.has(color)) {
    colorCache.set(color, colors[color]);
  }
  return colorCache.get(color)!;
}
```

### 2. Batch Output

```typescript
// Instead of multiple console.log calls
console.log(line1);
console.log(line2);
console.log(line3);

// Batch into single call
const output = [line1, line2, line3].join('\n');
console.log(output);
```

### 3. Lazy Evaluation

```typescript
// Only format if log level will be displayed
if (this.shouldLog(level)) {
  const formatted = this.formatEntry(entry);
  this.write(formatted);
}
```

### 4. Stream Buffering

```typescript
// Buffer writes for better performance
class BufferedWriter {
  private buffer: string[] = [];
  private maxSize = 100;
  
  write(data: string): void {
    this.buffer.push(data);
    if (this.buffer.length >= this.maxSize) {
      this.flush();
    }
  }
  
  flush(): void {
    if (this.buffer.length === 0) return;
    const output = this.buffer.join('');
    Deno.stdout.writeSync(new TextEncoder().encode(output));
    this.buffer = [];
  }
}
```

---

## Best Practices

### 1. Consistent Coloring

```typescript
// Define semantic colors and use consistently
const SEMANTIC_COLORS = {
  success: colors.green,
  error: colors.red,
  warning: colors.yellow,
  info: colors.cyan,
  debug: colors.gray,
} as const;

// Always use semantic colors, not raw colors
ConsoleStyler.success('Operation completed'); // ✓ Good
console.log(`${colors.green}Success${colors.reset}`); // ✗ Avoid
```

### 2. Proper Log Levels

```typescript
// Use appropriate log levels
ConsoleStyler.debug('Query executed', { sql, params }); // Development info
ConsoleStyler.info('User logged in', { userId }); // Notable events
ConsoleStyler.success('Deployment complete'); // Successful operations
ConsoleStyler.warning('Cache miss', { key }); // Potential issues
ConsoleStyler.error('API request failed', { error }); // Errors
ConsoleStyler.critical('Database connection lost'); // Critical failures
```

### 3. Structured Metadata

```typescript
// Always include relevant context
ConsoleStyler.error('Payment processing failed', {
  userId: 12345,
  amount: 99.99,
  currency: 'USD',
  paymentMethod: 'credit_card',
  errorCode: 'INSUFFICIENT_FUNDS',
  timestamp: new Date().toISOString(),
});
```

### 4. Table Design

```typescript
// Design tables for scannability
const columns = [
  // Right-align numbers
  { key: 'id', label: 'ID', align: 'right' },
  { key: 'amount', label: 'Amount', align: 'right' },
  
  // Left-align text
  { key: 'name', label: 'Name', align: 'left' },
  
  // Use formatters for complex data
  {
    key: 'timestamp',
    label: 'Time',
    formatter: (val) => new Date(val).toLocaleString(),
  },
];
```

### 5. Progress Indicators

```typescript
// Use progress bars for known durations
const progress = new ProgressBar({ current: 0, total: 100 });
for (let i = 0; i <= 100; i++) {
  progress.update(i);
  await doWork();
}
progress.complete('All tasks completed');

// Use spinners for unknown durations
const spinner = new Spinner('Processing...');
spinner.start();
await unknownDurationTask();
spinner.stop('Processing complete');
```

---

## Conclusion

This console-styler library demonstrates professional terminal output following Unix Philosophy principles:

1. **Do One Thing Well**: Focuses solely on terminal styling and logging
2. **Composability**: Independent, reusable components
3. **Text Streams**: Everything flows through standard streams
4. **Configurability**: Extensive customization without code changes
5. **Extensibility**: Plugin system for additional functionality

The implementation provides a solid foundation for building enterprise-grade CLI applications with professional, readable output that enhances the developer experience.

---

**Next Steps for Implementation:**

1. Create type definitions (`core/types.ts`)
2. Implement core modules (logger, formatter, colors, config)
3. Build components (tables, progress, banners, boxes, charts)
4. Develop plugin system
5. Write comprehensive tests
6. Create documentation and examples
7. Package for distribution (Deno module, npm package)
