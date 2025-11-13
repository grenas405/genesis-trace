# Visual Components

GenesisTrace provides rich terminal UI components for building beautiful CLI applications.

## Table of Contents
- [Tables](#tables)
- [Boxes](#boxes)
- [Progress Indicators](#progress-indicators)
- [Charts](#charts)
- [Banners](#banners)
- [Interactive Prompts](#interactive-prompts)

## Tables

Render data as beautiful ASCII tables with custom columns and formatting.

### Basic Table

Auto-detect columns from object keys:

```typescript
import { TableRenderer } from "jsr:@pedromdominguez/genesis-trace";

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
  { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
  { id: 3, name: "Charlie", email: "charlie@example.com", role: "moderator" },
];

TableRenderer.render(users);
```

Output:
```
┌────┬─────────┬──────────────────────┬───────────┐
│ id │ name    │ email                │ role      │
├────┼─────────┼──────────────────────┼───────────┤
│ 1  │ Alice   │ alice@example.com    │ admin     │
│ 2  │ Bob     │ bob@example.com      │ user      │
│ 3  │ Charlie │ charlie@example.com  │ moderator │
└────┴─────────┴──────────────────────┴───────────┘
```

### Custom Columns

Define specific columns with widths, labels, and alignment:

```typescript
import { TableRenderer } from "jsr:@pedromdominguez/genesis-trace";

TableRenderer.render(users, [
  { key: "id", label: "ID", width: 5, align: "right" },
  { key: "name", label: "Name", width: 20, align: "left" },
  { key: "email", label: "Email Address", width: 30, align: "left" },
  { key: "role", label: "Role", width: 12, align: "center" },
]);
```

**Column Options:**
- `key`: Property name in data objects
- `label`: Column header text
- `width`: Column width in characters (optional)
- `align`: Text alignment - "left" | "right" | "center" (default: "left")

### Key-Value Table

Display configuration or metadata:

```typescript
import { TableRenderer } from "jsr:@pedromdominguez/genesis-trace";

TableRenderer.renderKeyValue([
  { label: "Version", value: "1.0.0" },
  { label: "Environment", value: "production" },
  { label: "Uptime", value: "5d 12h 34m" },
  { label: "Memory Usage", value: "234 MB / 512 MB" },
  { label: "CPU Usage", value: "45%" },
]);
```

Output:
```
┌───────────────┬──────────────────┐
│ Version       │ 1.0.0            │
│ Environment   │ production       │
│ Uptime        │ 5d 12h 34m       │
│ Memory Usage  │ 234 MB / 512 MB  │
│ CPU Usage     │ 45%              │
└───────────────┴──────────────────┘
```

### Advanced Example

```typescript
import { TableRenderer, Formatter } from "jsr:@pedromdominguez/genesis-trace";

const data = [
  { name: "app.ts", size: 12457, modified: new Date() },
  { name: "test.ts", size: 8923, modified: new Date(Date.now() - 86400000) },
];

TableRenderer.render(data, [
  { key: "name", label: "File", width: 20 },
  {
    key: "size",
    label: "Size",
    width: 10,
    align: "right",
    format: (val) => Formatter.bytes(val)
  },
  {
    key: "modified",
    label: "Modified",
    width: 20,
    format: (val) => Formatter.relativeTime(val)
  },
]);
```

## Boxes

Create styled message boxes with various border styles.

### Simple Box

```typescript
import { BoxRenderer } from "jsr:@pedromdominguez/genesis-trace";

BoxRenderer.render("Operation completed successfully!");
```

Output:
```
┌─────────────────────────────────────┐
│ Operation completed successfully!   │
└─────────────────────────────────────┘
```

### Multi-Line Box with Title

```typescript
import { BoxRenderer } from "jsr:@pedromdominguez/genesis-trace";

BoxRenderer.render(
  [
    "Server Status",
    "",
    "Port: 8000",
    "Environment: production",
    "Database: Connected",
    "Cache: Connected",
  ],
  {
    title: "System Information",
    style: "double",
    padding: 2,
    align: "left",
  }
);
```

Output:
```
╔═══════════════════════════════════╗
║     System Information            ║
╠═══════════════════════════════════╣
║                                   ║
║  Server Status                    ║
║                                   ║
║  Port: 8000                       ║
║  Environment: production          ║
║  Database: Connected              ║
║  Cache: Connected                 ║
║                                   ║
╚═══════════════════════════════════╝
```

### Box Styles

Available border styles:

**Single Line (default)**
```typescript
BoxRenderer.render("Message", { style: "single" });
```
```
┌──────────┐
│ Message  │
└──────────┘
```

**Double Line**
```typescript
BoxRenderer.render("Message", { style: "double" });
```
```
╔══════════╗
║ Message  ║
╚══════════╝
```

**Rounded Corners**
```typescript
BoxRenderer.render("Message", { style: "rounded" });
```
```
╭──────────╮
│ Message  │
╰──────────╯
```

**Bold**
```typescript
BoxRenderer.render("Message", { style: "bold" });
```
```
┏━━━━━━━━━━┓
┃ Message  ┃
┗━━━━━━━━━━┛
```

### Semantic Message Boxes

Pre-styled boxes for common message types:

```typescript
import { BoxRenderer } from "jsr:@pedromdominguez/genesis-trace";

BoxRenderer.message("This is an info message", "info");
BoxRenderer.message("Success! Operation completed", "success");
BoxRenderer.message("Warning: Rate limit approaching", "warning");
BoxRenderer.message("Error: Connection failed", "error");
```

## Progress Indicators

Visual feedback for long-running operations.

### Progress Bar

Track progress with percentage and custom labels:

```typescript
import { ProgressBar } from "jsr:@pedromdominguez/genesis-trace";

const progress = new ProgressBar({
  total: 100,
  width: 40,
  label: "Processing files",
  showPercentage: true,
  showValue: true,
});

for (let i = 0; i <= 100; i += 10) {
  progress.update(i);
  await new Promise(resolve => setTimeout(resolve, 200));
}

progress.complete("All files processed!");
```

Output during processing:
```
Processing files: [████████████████░░░░░░░░] 60% (60/100)
```

Output when complete:
```
Processing files: [████████████████████████] 100% (100/100) ✓ All files processed!
```

**Options:**
- `total`: Total number of units (required)
- `width`: Width of the progress bar in characters (default: 40)
- `label`: Label text (optional)
- `showPercentage`: Show percentage (default: true)
- `showValue`: Show current/total values (default: false)
- `completeChar`: Character for completed portion (default: "█")
- `incompleteChar`: Character for incomplete portion (default: "░")

### Spinner

Animated loading indicator:

```typescript
import { Spinner } from "jsr:@pedromdominguez/genesis-trace";

const spinner = new Spinner({
  message: "Loading data...",
  style: "dots",
});

spinner.start();

// Simulate async work
await new Promise(resolve => setTimeout(resolve, 2000));
spinner.update("Processing data...");

await new Promise(resolve => setTimeout(resolve, 1000));

// Success
spinner.succeed("Data loaded successfully!");

// Or failure
// spinner.fail("Failed to load data");

// Or warning
// spinner.warn("Loaded with warnings");

// Or info
// spinner.info("Operation skipped");
```

**Spinner Styles:**

- `dots`: ⠋ ⠙ ⠹ ⠸ ⠼ ⠴ ⠦ ⠧ ⠇ ⠏
- `line`: - \\ | /
- `star`: ✶ ✸ ✹ ✺ ✹ ✷
- `arrow`: ← ↖ ↑ ↗ → ↘ ↓ ↙
- `box`: ◰ ◳ ◲ ◱
- `circle`: ◐ ◓ ◑ ◒
- `bounce`: ⠁ ⠂ ⠄ ⡀ ⢀ ⠠ ⠐ ⠈
- `pulse`: ⣾ ⣽ ⣻ ⢿ ⡿ ⣟ ⣯ ⣷

**Methods:**
- `start()`: Start the spinner animation
- `update(message)`: Update the spinner message
- `succeed(message?)`: Stop with success symbol
- `fail(message?)`: Stop with error symbol
- `warn(message?)`: Stop with warning symbol
- `info(message?)`: Stop with info symbol
- `stop()`: Stop without status symbol

### Multiple Progress Indicators

```typescript
import { Spinner, ProgressBar } from "jsr:@pedromdominguez/genesis-trace";

const spinner = new Spinner({ message: "Initializing..." });
spinner.start();
await new Promise(r => setTimeout(r, 1000));
spinner.succeed("Initialization complete");

const progress = new ProgressBar({ total: 100, label: "Processing" });
for (let i = 0; i <= 100; i += 10) {
  progress.update(i);
  await new Promise(r => setTimeout(r, 100));
}
progress.complete("Done!");
```

## Charts

Render bar charts in your terminal.

### Basic Bar Chart

```typescript
import { ChartRenderer, ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

const salesData = [
  { label: "Jan", value: 120 },
  { label: "Feb", value: 250 },
  { label: "Mar", value: 180 },
  { label: "Apr", value: 300 },
  { label: "May", value: 275 },
  { label: "Jun", value: 420 },
];

ChartRenderer.barChart(salesData, {
  width: 60,
  showValues: true,
  color: ColorSystem.codes.cyan,
  title: "Monthly Sales ($k)",
});
```

Output:
```
Monthly Sales ($k)
Jan ████████████        120
Feb █████████████████████   250
Mar ██████████████      180
Apr █████████████████████████  300
May ████████████████████    275
Jun ██████████████████████████████████  420
```

**Options:**
- `width`: Maximum bar width in characters (default: 50)
- `showValues`: Show values at end of bars (default: true)
- `color`: ANSI color code for bars (default: cyan)
- `title`: Chart title (optional)
- `unit`: Unit to display after values (optional, e.g., "$", "MB")

### Colored Bars

```typescript
import { ChartRenderer, ColorSystem } from "jsr:@pedromdominguez/genesis-trace";

ChartRenderer.barChart(
  [
    { label: "Success", value: 450 },
    { label: "Warnings", value: 120 },
    { label: "Errors", value: 30 },
  ],
  {
    width: 50,
    showValues: true,
    colors: [
      ColorSystem.codes.green,
      ColorSystem.codes.yellow,
      ColorSystem.codes.red,
    ],
  }
);
```

## Banners

Create eye-catching application banners.

### Basic Banner

```typescript
import { BannerRenderer } from "jsr:@pedromdominguez/genesis-trace";

BannerRenderer.render({
  title: "MY APPLICATION",
  subtitle: "Professional CLI Tool v2.0",
  version: "2.0.0",
  author: "Your Name",
  style: "double",
});
```

Output:
```
╔════════════════════════════════════╗
║                                    ║
║         MY APPLICATION             ║
║    Professional CLI Tool v2.0      ║
║                                    ║
╚════════════════════════════════════╝
   Version: 2.0.0
   Author: Your Name
```

**Options:**
- `title`: Main title text (required)
- `subtitle`: Subtitle text (optional)
- `version`: Version string (optional)
- `author`: Author name (optional)
- `style`: Border style - "single" | "double" | "bold" (default: "double")

### Enterprise Banner (ConsoleStyler)

For production applications with rich metadata:

```typescript
import { ConsoleStyler } from "jsr:@pedromdominguez/genesis-trace";

ConsoleStyler.renderBanner({
  title: "DenoGenesis",
  version: "1.0.0",
  buildDate: "2024-01-15",
  environment: "production",
  port: 8000,
  author: "Your Name",
  repository: "https://github.com/yourusername/yourapp",
  description: "Enterprise Application Framework",
  features: ["REST API", "WebSockets", "GraphQL", "Database"],
  database: "PostgreSQL",
  ai: {
    enabled: true,
    models: ["GPT-4", "Claude-3"]
  }
});
```

Output:
```
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║         🚀 DenoGenesis Enterprise Application                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
   Version: 1.0.0
   Build Date: 2024-01-15
   Environment: PRODUCTION
   Port: 8000
   Author: Your Name
   Repository: https://github.com/yourusername/yourapp
   Features: REST API, WebSockets, GraphQL, Database
   Database: PostgreSQL
   AI Models: GPT-4, Claude-3
```

## Interactive Prompts

Create interactive CLI experiences with user input.

### Text Input

```typescript
import { InteractivePrompts } from "jsr:@pedromdominguez/genesis-trace";

const name = await InteractivePrompts.input(
  "What is your name?",
  "Anonymous"  // Default value
);
console.log(`Hello, ${name}!`);
```

Output:
```
What is your name? [Anonymous]: _
```

### Yes/No Confirmation

```typescript
import { InteractivePrompts } from "jsr:@pedromdominguez/genesis-trace";

const confirmed = await InteractivePrompts.confirm(
  "Do you want to continue?",
  true  // Default value
);

if (confirmed) {
  console.log("Proceeding...");
} else {
  console.log("Cancelled.");
}
```

Output:
```
Do you want to continue? [Y/n]: _
```

### Selection Menu

```typescript
import { InteractivePrompts } from "jsr:@pedromdominguez/genesis-trace";

const choice = await InteractivePrompts.select(
  "Choose your deployment environment:",
  ["Development", "Staging", "Production"]
);
console.log(`Deploying to: ${choice}`);
```

Output:
```
Choose your deployment environment:
  1) Development
  2) Staging
  3) Production
Enter number (1-3): _
```

### Complex Interactive Flow

```typescript
import { InteractivePrompts, Spinner, BoxRenderer } from "jsr:@pedromdominguez/genesis-trace";

// Get user input
const projectName = await InteractivePrompts.input("Project name:", "my-app");
const projectType = await InteractivePrompts.select(
  "Project type:",
  ["Web API", "CLI Tool", "Library"]
);
const useTypeScript = await InteractivePrompts.confirm("Use TypeScript?", true);

// Show spinner
const spinner = new Spinner({ message: "Creating project..." });
spinner.start();
await new Promise(r => setTimeout(r, 2000));
spinner.succeed("Project created!");

// Show summary
BoxRenderer.render(
  [
    "Project Configuration",
    "",
    `Name: ${projectName}`,
    `Type: ${projectType}`,
    `TypeScript: ${useTypeScript ? "Yes" : "No"}`,
  ],
  { style: "double", title: "Summary" }
);
```

## Best Practices

### 1. Progress Indicators for Long Operations

Always provide visual feedback:

```typescript
const spinner = new Spinner({ message: "Downloading..." });
spinner.start();

try {
  await longOperation();
  spinner.succeed("Download complete!");
} catch (error) {
  spinner.fail("Download failed!");
  logger.error("Error", { error });
}
```

### 2. Tables for Structured Data

Use tables for lists and structured information:

```typescript
// Good - Easy to scan
TableRenderer.render(users);

// Avoid - Hard to read
users.forEach(u => console.log(`${u.id} ${u.name} ${u.email}`));
```

### 3. Boxes for Important Messages

Highlight critical information:

```typescript
BoxRenderer.message("API Rate Limit: 100 requests remaining", "warning");
```

### 4. Interactive Prompts for User Input

Make CLI tools user-friendly:

```typescript
const confirmed = await InteractivePrompts.confirm("Delete all files?", false);
if (!confirmed) {
  console.log("Cancelled.");
  Deno.exit(0);
}
```

### 5. Combine Components

Build rich CLI experiences:

```typescript
// Banner
BannerRenderer.render({ title: "MY APP", version: "1.0.0" });

// Get input
const env = await InteractivePrompts.select("Environment:", ["dev", "prod"]);

// Process with progress
const progress = new ProgressBar({ total: 100 });
for (let i = 0; i <= 100; i++) {
  progress.update(i);
  await doWork(i);
}
progress.complete();

// Show results
TableRenderer.renderKeyValue([
  { label: "Status", value: "Complete" },
  { label: "Environment", value: env },
]);
```

---

[Back to Main README](../README.md)
