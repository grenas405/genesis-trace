# 🎨 Console Styler

A comprehensive, professional terminal logging and formatting library for Deno applications. Zero external dependencies - uses only Deno native APIs!

## ✨ Features

- **🎯 Multiple Log Levels** - debug, info, success, warning, error, critical
- **🎨 Rich Theming** - Built-in themes (default, minimal, neon, dracula) or create your own
- **📊 Visual Components** - Tables, charts, progress bars, boxes, banners
- **🔌 Plugin Architecture** - File logging, JSON logging, remote logging, Slack integration
- **🚀 Framework Adapters** - Oak, Hono, Express middleware (optional)
- **🌈 Smart Color Detection** - Auto-detects terminal capabilities (basic, 256-color, true color)
- **📝 TypeScript First** - Full type safety and IntelliSense support
- **🎭 Child Loggers** - Namespace-based logging for different modules
- **💾 Log History** - Built-in log history with filtering and export
- **⚡ Performance** - Efficient and lightweight
- **🛠️ Highly Configurable** - Customize every aspect of logging

## 📦 Installation

```bash
# Add to your deno.json imports
{
  "imports": {
    "@grenas405/console-styler": "jsr:@grenas405/console-styler"
  }
}
```

Or import directly:

```typescript
import { Logger } from "jsr:@grenas405/console-styler";
```

## 🚀 Quick Start

```typescript
import { Logger } from "@grenas405/console-styler";

const logger = new Logger();

logger.info("Application started");
logger.success("Database connected");
logger.warning("High memory usage");
logger.error("Failed to load file");
```

## 📚 Core Features

### Basic Logging

```typescript
import { Logger } from "@grenas405/console-styler";

const logger = new Logger();

// Log levels
logger.debug("Debug information");
logger.info("General information");
logger.success("Operation succeeded");
logger.warning("Potential issue");
logger.error("Error occurred");
logger.critical("Critical system failure");
```

### Logging with Metadata

```typescript
logger.info("User logged in", {
  userId: "12345",
  username: "alice",
  ip: "192.168.1.100"
});

logger.error("Database connection failed", {
  host: "db.example.com",
  port: 5432,
  error: "Connection timeout",
  retryAttempt: 3
});
```

### Child Loggers (Namespaces)

```typescript
const apiLogger = logger.child("api");
const dbLogger = logger.child("database");

apiLogger.info("Handling request");  // Output: [timestamp] [api] Handling request
dbLogger.info("Query executed");     // Output: [timestamp] [database] Query executed
```

### Custom Configuration

```typescript
import { Logger, ConfigBuilder } from "@grenas405/console-styler";

const logger = new Logger(
  new ConfigBuilder()
    .timestampFormat("YYYY-MM-DD HH:mm:ss.SSS")
    .logLevel("info")
    .colorMode("enabled")
    .enableHistory(true)
    .maxHistorySize(500)
    .build()
);
```

### Theming

```typescript
import { Logger, ConfigBuilder } from "@grenas405/console-styler";
import { neonTheme, draculaTheme } from "@grenas405/console-styler/themes";

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .build()
);

logger.success("Using neon theme!");
```

### Box Rendering

```typescript
import { BoxRenderer } from "@grenas405/console-styler/components";

// Simple message box
BoxRenderer.message("Operation successful!", "success");
BoxRenderer.message("Warning: High memory usage", "warning");

// Custom box
BoxRenderer.render(
  ["Multiple lines", "in a box", "with styling"],
  {
    style: "double",
    title: "My Box",
    color: "\x1b[36m", // Cyan
    padding: 2
  }
);
```

### Table Rendering

```typescript
import { TableRenderer } from "@grenas405/console-styler/components";

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", active: true },
  { id: 2, name: "Bob", email: "bob@example.com", active: false }
];

TableRenderer.render(users, [
  { key: "id", label: "ID", width: 5 },
  { key: "name", label: "Name", width: 20 },
  { key: "email", label: "Email", width: 25 },
  {
    key: "active",
    label: "Status",
    width: 10,
    formatter: (val) => val ? "✅ Active" : "❌ Inactive"
  }
]);
```

### Progress Indicators

```typescript
import { ProgressBar, Spinner } from "@grenas405/console-styler/components";

// Progress Bar
const progress = new ProgressBar({ total: 100 });
for (let i = 0; i <= 100; i += 10) {
  progress.update(i);
  await new Promise(r => setTimeout(r, 100));
}
progress.complete();

// Spinner
const spinner = new Spinner({ message: "Loading..." });
spinner.start();
await someAsyncOperation();
spinner.succeed("Done!");
```

### Charts

```typescript
import { ChartRenderer } from "@grenas405/console-styler/components";

const data = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 250 },
  { label: "Mar", value: 180 }
];

ChartRenderer.barChart(data, {
  width: 50,
  showValues: true,
  color: "\x1b[36m"
});
```

### Banners

```typescript
import { BannerRenderer } from "@grenas405/console-styler/components";

BannerRenderer.render({
  title: "MY APPLICATION",
  subtitle: "Version 1.0.0",
  author: "Your Name",
  style: "double"
});
```

## 🎨 Color System

### Basic Colors

```typescript
import { ColorSystem } from "@grenas405/console-styler/core";

console.log(ColorSystem.colorize("Red text", ColorSystem.codes.red));
console.log(ColorSystem.colorize("Green text", ColorSystem.codes.green));
console.log(ColorSystem.colorize("Bright cyan", ColorSystem.codes.brightCyan));
```

### RGB & Hex Colors

```typescript
// RGB colors
console.log(ColorSystem.rgb(255, 100, 50) + "Custom RGB color" + ColorSystem.codes.reset);

// Hex colors
console.log(ColorSystem.hexToRgb("#FF6B35") + "Hex color" + ColorSystem.codes.reset);
```

### Color Gradients

```typescript
const gradient = ColorSystem.createGradient([255, 0, 0], [0, 0, 255], 50);
for (const color of gradient) {
  process.stdout.write(`${color}█${ColorSystem.codes.reset}`);
}
```

### Terminal Capability Detection

```typescript
const support = ColorSystem.detectColorSupport(); // "none" | "basic" | "256" | "truecolor"
const has256 = ColorSystem.supports256Color();
const hasTrueColor = ColorSystem.supportsTrueColor();
```

## 🔌 Plugins

### File Logger Plugin

```typescript
import { Logger } from "@grenas405/console-styler";
import { FileLoggerPlugin } from "@grenas405/console-styler/plugins";

const logger = new Logger();
logger.use(new FileLoggerPlugin({
  filepath: "./logs/app.log",
  format: "text", // or "json"
  maxSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 5
}));
```

### JSON Logger Plugin

```typescript
import { JsonLoggerPlugin } from "@grenas405/console-styler/plugins";

logger.use(new JsonLoggerPlugin({
  filepath: "./logs/app.json"
}));
```

### Custom Plugins

```typescript
import type { Plugin, LogEntry } from "@grenas405/console-styler";

class MyPlugin implements Plugin {
  name = "my-plugin";
  version = "1.0.0";

  async onInit() {
    console.log("Plugin initialized");
  }

  async onLog(entry: LogEntry) {
    // Process log entry
    console.log("Logged:", entry.message);
  }

  async onShutdown() {
    console.log("Plugin shutting down");
  }
}

logger.use(new MyPlugin());
```

## 🛠️ Formatters

Built-in formatters for common data types:

```typescript
import { Formatter } from "@grenas405/console-styler/core";

Formatter.bytes(1234567890);          // "1.15 GB"
Formatter.duration(125432);            // "2m 5s"
Formatter.number(1234567);             // "1,234,567"
Formatter.currency(1234.56);           // "$1,234.56"
Formatter.percentage(0.8542);          // "85.42%"
Formatter.relativeTime(date);          // "2 hours ago"
Formatter.timestamp(new Date());       // "14:30:45"
```

## 📊 Advanced Usage

### Log History

```typescript
const logger = new Logger(
  new ConfigBuilder().enableHistory(true).build()
);

logger.info("Message 1");
logger.error("Message 2");

// Get all logs
const history = logger.getHistory();

// Filter logs
const errors = logger.getHistory({ level: "error" });
const recent = logger.getHistory({ since: new Date(Date.now() - 3600000) });

// Export logs
await logger.exportLogs("./logs/export.json");
```

### Custom Themes

```typescript
import type { Theme } from "@grenas405/console-styler";

const myTheme: Theme = {
  name: "my-theme",
  colors: {
    primary: "\x1b[34m",
    secondary: "\x1b[36m",
    success: "\x1b[32m",
    warning: "\x1b[33m",
    error: "\x1b[31m",
    info: "\x1b[36m",
    debug: "\x1b[90m",
    critical: "\x1b[91m\x1b[1m",
    muted: "\x1b[90m",
    accent: "\x1b[96m"
  },
  symbols: {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
    debug: "🔍",
    critical: "🚨",
    bullet: "•",
    arrow: "→",
    check: "✓",
    cross: "✗"
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
    teeBottom: "┴"
  }
};

const logger = new Logger(
  new ConfigBuilder().theme(myTheme).build()
);
```

## 🎯 Framework Integration (Optional)

Note: Framework adapters require the respective frameworks to be installed.

### Oak Middleware

```typescript
import { Application } from "https://deno.land/x/oak/mod.ts";
import { oakLogger } from "@grenas405/console-styler/adapters";

const app = new Application();
app.use(oakLogger({ skipPaths: ["/health"] }));
```

### Hono Middleware

```typescript
import { Hono } from "https://deno.land/x/hono/mod.ts";
import { honoLogger } from "@grenas405/console-styler/adapters";

const app = new Hono();
app.use("*", honoLogger());
```

## 📖 Examples

Check out the `examples/` directory for more examples:

- `examples/basic.ts` - Basic logging examples
- `examples/comprehensive.ts` - Comprehensive demo of all features
- `examples/remote-logger.ts` - Remote logging setup

Run examples:

```bash
deno run --allow-all examples/comprehensive.ts
```

## 🧪 Testing

```bash
deno test --allow-all
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [GitHub Repository](https://github.com/yourname/console-styler)
- [Documentation](https://github.com/yourname/console-styler/docs)
- [Issues](https://github.com/yourname/console-styler/issues)

## 💡 Tips

1. **Performance**: Disable history in production for better performance
2. **Colors**: Use `colorMode: "disabled"` when piping output to files
3. **Log Levels**: Set appropriate log levels for different environments
4. **Plugins**: Keep plugin logic lightweight to avoid blocking the main thread
5. **Namespaces**: Use child loggers to organize logs by module

## 🎓 Philosophy

Console Styler is designed with these principles:

- **Zero dependencies**: Only Deno native APIs
- **Type safety**: Full TypeScript support
- **Performance**: Efficient and lightweight
- **Flexibility**: Highly configurable
- **Beauty**: Professional-looking terminal output

---

Made with ❤️ for the Deno community
