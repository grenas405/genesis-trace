# XDG Base Directory Specification Compliance Guide

A comprehensive guide to implementing XDG Base Directory Specification compliance in Deno applications using GenesisTrace.

## Table of Contents

- [Introduction](#introduction)
- [What is XDG?](#what-is-xdg)
- [Why XDG Compliance Matters](#why-xdg-compliance-matters)
- [XDG Environment Variables](#xdg-environment-variables)
- [Implementation Guide](#implementation-guide)
- [Directory Usage Guidelines](#directory-usage-guidelines)
- [GenesisTrace Integration](#genesistrace-integration)
- [Best Practices](#best-practices)
- [Common Pitfalls](#common-pitfalls)
- [Examples](#examples)
- [Resources](#resources)

## Introduction

The XDG Base Directory Specification is a standard published by freedesktop.org that defines where applications should store user-specific files on Linux and Unix systems. This guide demonstrates how to implement XDG compliance in Deno applications using GenesisTrace.

**Specification Version:** 0.8.0
**Official Documentation:** https://specifications.freedesktop.org/basedir/0.6/

## What is XDG?

XDG (X Desktop Group, now freedesktop.org) established the Base Directory Specification to solve the problem of applications cluttering users' home directories with dotfiles and configuration directories.

### The Problem Before XDG

Before XDG, applications would create files directly in `$HOME`:

```
$HOME/
├── .myapp/
├── .anotherapp/
├── .yetanotherapp/
├── .myapprc
├── .anotherapprc
└── ... hundreds of dotfiles
```

### The XDG Solution

With XDG, files are organized into standard directories:

```
$HOME/
├── .config/          # Configuration files
│   ├── myapp/
│   └── anotherapp/
├── .local/
│   ├── share/        # Application data
│   │   ├── myapp/
│   │   └── anotherapp/
│   └── state/        # Logs, history, state
│       ├── myapp/
│       └── anotherapp/
└── .cache/           # Non-essential cached data
    ├── myapp/
    └── anotherapp/
```

## Why XDG Compliance Matters

### 1. User Experience

- **Organization**: Users can easily find and manage application files
- **Backup**: Users know exactly which directories to backup (config and data)
- **Cleanup**: Users can safely delete cache directories to free space

### 2. System Integration

- **Package Managers**: System packages can install default configs to `/etc/xdg`
- **Multi-User**: Different users can have independent configurations
- **Portability**: Configurations can be easily shared across systems

### 3. Professional Standards

- **Industry Standard**: Firefox 147+ now supports XDG (as of November 2025)
- **Best Practice**: Expected by Linux/Unix users and administrators
- **Ecosystem**: Integrates well with backup tools, sync utilities, and dotfile managers

## XDG Environment Variables

### Primary Variables (User-Specific)

| Variable | Purpose | Default | When to Use |
|----------|---------|---------|-------------|
| `$XDG_DATA_HOME` | User-specific data files | `$HOME/.local/share` | Application data, databases, saved games, user-generated content |
| `$XDG_CONFIG_HOME` | User-specific configuration | `$HOME/.config` | Settings, preferences, configuration files |
| `$XDG_CACHE_HOME` | Non-essential cached data | `$HOME/.cache` | Thumbnails, download cache, temporary files |
| `$XDG_STATE_HOME` | Application state data | `$HOME/.local/state` | Logs, history files, recently-used lists, undo history |
| `$XDG_RUNTIME_DIR` | Runtime files | *No default* | Sockets, named pipes, runtime locks (must be set by system) |

### Secondary Variables (System-Wide)

| Variable | Purpose | Default |
|----------|---------|---------|
| `$XDG_DATA_DIRS` | System data search paths | `/usr/local/share/:/usr/share/` |
| `$XDG_CONFIG_DIRS` | System config search paths | `/etc/xdg` |

### Environment Variable Details

#### XDG_DATA_HOME

**Purpose:** Store application data that users create or manage

**Examples:**
- Databases: `$XDG_DATA_HOME/myapp/database.db`
- User content: `$XDG_DATA_HOME/myapp/documents/`
- Saved games: `$XDG_DATA_HOME/mygame/saves/`
- Plugins: `$XDG_DATA_HOME/myapp/plugins/`

**Characteristics:**
- Important data that should be backed up
- Should persist across cache clears
- User expects this data to be preserved

#### XDG_CONFIG_HOME

**Purpose:** Store configuration files and user preferences

**Examples:**
- JSON config: `$XDG_CONFIG_HOME/myapp/config.json`
- TOML settings: `$XDG_CONFIG_HOME/myapp/settings.toml`
- YAML preferences: `$XDG_CONFIG_HOME/myapp/preferences.yml`

**Characteristics:**
- Small text files
- Should be backed up
- Often version controlled by users
- Portable across systems

#### XDG_CACHE_HOME

**Purpose:** Store non-essential cached data that can be regenerated

**Examples:**
- Thumbnails: `$XDG_CACHE_HOME/myapp/thumbnails/`
- HTTP cache: `$XDG_CACHE_HOME/myapp/http-cache/`
- Compiled assets: `$XDG_CACHE_HOME/myapp/compiled/`

**Characteristics:**
- Can be safely deleted without data loss
- Should not be backed up
- Application should handle missing cache gracefully

#### XDG_STATE_HOME

**Purpose:** Store state data that should persist but isn't configuration

**Examples:**
- Log files: `$XDG_STATE_HOME/myapp/app.log`
- Command history: `$XDG_STATE_HOME/myapp/history`
- Recently used: `$XDG_STATE_HOME/myapp/recent.json`
- Undo data: `$XDG_STATE_HOME/myapp/undo/`

**Characteristics:**
- Larger than config files
- May grow over time
- User may want to backup
- Application-specific state information

#### XDG_RUNTIME_DIR

**Purpose:** Runtime files that only exist while application is running

**Examples:**
- Unix sockets: `$XDG_RUNTIME_DIR/myapp/app.sock`
- PID files: `$XDG_RUNTIME_DIR/myapp/app.pid`
- Runtime locks: `$XDG_RUNTIME_DIR/myapp/locks/`

**Characteristics:**
- Only set by the system (not by users)
- Owned by the user with permissions 0700
- Cleaned on logout or reboot
- May not be available on all systems

## Implementation Guide

### Step 1: Detect XDG Directories

```typescript
function getXDGDirectories() {
  const home = Deno.env.get("HOME");
  if (!home) {
    throw new Error("HOME environment variable is not set");
  }

  return {
    // User-specific directories
    dataHome: Deno.env.get("XDG_DATA_HOME") || `${home}/.local/share`,
    configHome: Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`,
    cacheHome: Deno.env.get("XDG_CACHE_HOME") || `${home}/.cache`,
    stateHome: Deno.env.get("XDG_STATE_HOME") || `${home}/.local/state`,
    runtimeDir: Deno.env.get("XDG_RUNTIME_DIR"), // May be undefined

    // System-wide search paths
    dataDirs: (Deno.env.get("XDG_DATA_DIRS") || "/usr/local/share/:/usr/share/")
      .split(":")
      .filter(dir => dir.length > 0),

    configDirs: (Deno.env.get("XDG_CONFIG_DIRS") || "/etc/xdg")
      .split(":")
      .filter(dir => dir.length > 0),
  };
}
```

### Step 2: Create Application-Specific Paths

```typescript
class XDGPaths {
  private appName: string;
  private xdg: XDGDirectories;

  constructor(appName: string) {
    this.appName = appName;
    this.xdg = getXDGDirectories();
  }

  get dataDir(): string {
    return `${this.xdg.dataHome}/${this.appName}`;
  }

  get configDir(): string {
    return `${this.xdg.configHome}/${this.appName}`;
  }

  get cacheDir(): string {
    return `${this.xdg.cacheHome}/${this.appName}`;
  }

  get stateDir(): string {
    return `${this.xdg.stateHome}/${this.appName}`;
  }

  get runtimeDir(): string | undefined {
    return this.xdg.runtimeDir
      ? `${this.xdg.runtimeDir}/${this.appName}`
      : undefined;
  }
}
```

### Step 3: Ensure Directories Exist

According to the XDG specification, directories should be created with mode `0700`:

```typescript
async ensureDirectories(): Promise<void> {
  const dirs = [
    this.dataDir,
    this.configDir,
    this.cacheDir,
    this.stateDir,
  ];

  if (this.runtimeDir) {
    dirs.push(this.runtimeDir);
  }

  for (const dir of dirs) {
    try {
      await Deno.mkdir(dir, { recursive: true, mode: 0o700 });
    } catch (error) {
      if (!(error instanceof Deno.errors.AlreadyExists)) {
        throw error;
      }
    }
  }
}
```

### Step 4: Implement File Search

The XDG specification requires searching directories in priority order:

```typescript
async findFile(
  filename: string,
  searchType: "config" | "data" = "config"
): Promise<string | undefined> {
  // Build search paths in priority order (user directory first)
  const searchPaths = searchType === "config"
    ? [this.configDir, ...this.xdg.configDirs.map(d => `${d}/${this.appName}`)]
    : [this.dataDir, ...this.xdg.dataDirs.map(d => `${d}/${this.appName}`)];

  for (const basePath of searchPaths) {
    const fullPath = `${basePath}/${filename}`;
    try {
      const stat = await Deno.stat(fullPath);
      if (stat.isFile) {
        return fullPath; // Return first match
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
      // Continue searching
    }
  }

  return undefined; // File not found in any directory
}
```

### Step 5: Write Files to Correct Locations

Always write to user-specific directories:

```typescript
// Write configuration
async writeConfig(config: unknown): Promise<void> {
  const configPath = `${this.configDir}/config.json`;
  await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
}

// Write data
async writeData(filename: string, data: string): Promise<void> {
  const dataPath = `${this.dataDir}/${filename}`;
  await Deno.writeTextFile(dataPath, data);
}

// Write cache
async writeCache(filename: string, data: string): Promise<void> {
  const cachePath = `${this.cacheDir}/${filename}`;
  await Deno.writeTextFile(cachePath, data);
}

// Write log (state)
async writeLog(message: string): Promise<void> {
  const logPath = `${this.stateDir}/app.log`;
  await Deno.writeTextFile(logPath, message, { append: true });
}
```

## Directory Usage Guidelines

### What Goes Where?

| File Type | Directory | Rationale |
|-----------|-----------|-----------|
| `config.json`, `settings.toml` | `XDG_CONFIG_HOME` | User preferences and settings |
| `database.db`, `saves.json` | `XDG_DATA_HOME` | Important user data |
| `thumbnails/`, `http-cache/` | `XDG_CACHE_HOME` | Can be regenerated |
| `app.log`, `history.json` | `XDG_STATE_HOME` | Application state and logs |
| `app.sock`, `app.pid` | `XDG_RUNTIME_DIR` | Runtime-only files |

### Decision Tree

```
Is this file...

├─ Created during runtime and deleted on exit?
│  └─ Use XDG_RUNTIME_DIR (if available)
│
├─ A log file, history, or state data?
│  └─ Use XDG_STATE_HOME
│
├─ User preferences or settings?
│  └─ Use XDG_CONFIG_HOME
│
├─ Important user data?
│  └─ Use XDG_DATA_HOME
│
└─ Can be safely deleted and regenerated?
   └─ Use XDG_CACHE_HOME
```

## GenesisTrace Integration

### XDG-Compliant Logging

GenesisTrace can be easily integrated with XDG directories:

```typescript
import { ConfigBuilder, FileLoggerPlugin, Logger } from "jsr:@pedromdominguez/genesis-trace";

const xdgPaths = new XDGPaths("myapp");
await xdgPaths.ensureDirectories();

const logger = new Logger(
  new ConfigBuilder()
    .logLevel("info")
    .plugin(
      new FileLoggerPlugin({
        // Logs go to XDG_STATE_HOME
        filepath: xdgPaths.getStatePath("app.log"),
        format: "text",
        append: true,
      })
    )
    .build()
);

logger.info("Application started");
logger.success("XDG-compliant logging initialized");
```

### Configuration Management

Store GenesisTrace configuration in XDG_CONFIG_HOME:

```typescript
// Load config from XDG-compliant location
async function loadConfig(xdgPaths: XDGPaths) {
  const configPath = await xdgPaths.findFile("config.json", "config");

  if (configPath) {
    const content = await Deno.readTextFile(configPath);
    return JSON.parse(content);
  }

  // Use defaults and save to user config
  const defaultConfig = {
    theme: "neon",
    logLevel: "info",
    enableColors: true,
  };

  await Deno.writeTextFile(
    xdgPaths.getConfigPath("config.json"),
    JSON.stringify(defaultConfig, null, 2)
  );

  return defaultConfig;
}
```

### Cache Management

Store non-essential cached data:

```typescript
// Cache processed data
async function cacheProcessedData(xdgPaths: XDGPaths, data: unknown) {
  const cachePath = xdgPaths.getCachePath("processed-data.json");
  await Deno.writeTextFile(cachePath, JSON.stringify(data));
}

// Clear cache when needed
async function clearCache(xdgPaths: XDGPaths) {
  try {
    for await (const entry of Deno.readDir(xdgPaths.cacheDir)) {
      const path = `${xdgPaths.cacheDir}/${entry.name}`;
      if (entry.isFile) {
        await Deno.remove(path);
      }
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }
}
```

## Best Practices

### 1. Always Check Environment Variables First

```typescript
// Good: Respects user's XDG configuration
const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;

// Bad: Hardcoded path ignores XDG
const configHome = `${home}/.config`;
```

### 2. Provide Proper Fallbacks

```typescript
// Good: Complete fallback chain
const home = Deno.env.get("HOME");
if (!home) {
  throw new Error("HOME environment variable is not set");
}
const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;

// Bad: No fallback
const configHome = Deno.env.get("XDG_CONFIG_HOME"); // May be undefined!
```

### 3. Create Directories with Secure Permissions

```typescript
// Good: Mode 0700 as per specification
await Deno.mkdir(dir, { recursive: true, mode: 0o700 });

// Bad: Default permissions (may be too permissive)
await Deno.mkdir(dir, { recursive: true });
```

### 4. Handle Missing Directories Gracefully

```typescript
// Good: Skip inaccessible directories
for (const basePath of searchPaths) {
  try {
    const stat = await Deno.stat(fullPath);
    if (stat.isFile) return fullPath;
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error; // Re-throw unexpected errors
    }
    // Continue to next directory
  }
}

// Bad: Crash on first missing directory
const stat = await Deno.stat(fullPath); // Throws if not found
```

### 5. Search in Priority Order

```typescript
// Good: User directory first, then system directories
const searchPaths = [
  this.configDir,
  ...this.xdg.configDirs.map(d => `${d}/${this.appName}`)
];

// Bad: Random order or system directories first
const searchPaths = [
  ...this.xdg.configDirs.map(d => `${d}/${this.appName}`),
  this.configDir // Should be first!
];
```

### 6. Don't Hardcode XDG Paths

```typescript
// Good: Use environment variables
const dataHome = Deno.env.get("XDG_DATA_HOME") || `${home}/.local/share`;

// Bad: Hardcoded assumption
const dataHome = `${home}/.local/share`; // Ignores XDG_DATA_HOME!
```

### 7. Handle XDG_RUNTIME_DIR Absence

```typescript
// Good: Check if runtime directory is available
const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
if (runtimeDir) {
  const socketPath = `${runtimeDir}/myapp/app.sock`;
  // Use socket
} else {
  // Fall back to alternative (e.g., state directory)
  const socketPath = `${stateDir}/app.sock`;
}

// Bad: Assume it's always set
const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR"); // May be undefined!
const socketPath = `${runtimeDir}/myapp/app.sock`; // Crash!
```

### 8. Use Appropriate Directories for File Types

```typescript
// Good: Files in correct directories
await Deno.writeTextFile(
  xdgPaths.getConfigPath("config.json"),  // Config
  config
);
await Deno.writeTextFile(
  xdgPaths.getStatePath("app.log"),       // Logs
  logEntry
);
await Deno.writeTextFile(
  xdgPaths.getCachePath("thumbnail.png"), // Cache
  thumbnail
);

// Bad: Everything in config directory
await Deno.writeTextFile(
  xdgPaths.getConfigPath("app.log"),      // Wrong!
  logEntry
);
```

### 9. Support System-Wide Defaults

```typescript
// Good: Search both user and system directories
const configPath = await xdgPaths.findFile("config.json", "config");

// Bad: Only check user directory
const configPath = `${xdgPaths.configDir}/config.json`;
const exists = await Deno.stat(configPath).catch(() => null);
```

### 10. Document XDG Compliance

```typescript
// Good: Clear documentation
/**
 * Application paths following XDG Base Directory Specification
 *
 * Configuration: $XDG_CONFIG_HOME/myapp/
 * Data: $XDG_DATA_HOME/myapp/
 * Cache: $XDG_CACHE_HOME/myapp/
 * State: $XDG_STATE_HOME/myapp/
 * Runtime: $XDG_RUNTIME_DIR/myapp/ (if available)
 */
```

## Common Pitfalls

### 1. Mixing Different File Types

❌ **Wrong:**
```typescript
// Everything in config directory
const configDir = `${xdgConfigHome}/myapp`;
await Deno.writeTextFile(`${configDir}/config.json`, config);
await Deno.writeTextFile(`${configDir}/app.log`, log);        // Wrong!
await Deno.writeTextFile(`${configDir}/cache.json`, cache);   // Wrong!
```

✅ **Correct:**
```typescript
// Files in appropriate directories
await Deno.writeTextFile(xdgPaths.getConfigPath("config.json"), config);
await Deno.writeTextFile(xdgPaths.getStatePath("app.log"), log);
await Deno.writeTextFile(xdgPaths.getCachePath("cache.json"), cache);
```

### 2. Ignoring Environment Variables

❌ **Wrong:**
```typescript
const configDir = `${home}/.config/myapp`;  // Hardcoded
```

✅ **Correct:**
```typescript
const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
const configDir = `${configHome}/myapp`;
```

### 3. Not Handling XDG_RUNTIME_DIR Absence

❌ **Wrong:**
```typescript
const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
const socketPath = `${runtimeDir}/myapp/app.sock`;  // May be undefined!
```

✅ **Correct:**
```typescript
const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
if (runtimeDir) {
  const socketPath = `${runtimeDir}/myapp/app.sock`;
} else {
  // Fallback or skip socket creation
}
```

### 4. Creating Directories with Wrong Permissions

❌ **Wrong:**
```typescript
await Deno.mkdir(dir, { recursive: true });  // Default permissions
```

✅ **Correct:**
```typescript
await Deno.mkdir(dir, { recursive: true, mode: 0o700 });
```

### 5. Not Searching System Directories

❌ **Wrong:**
```typescript
// Only check user directory
const configPath = `${xdgPaths.configDir}/config.json`;
```

✅ **Correct:**
```typescript
// Search user + system directories
const configPath = await xdgPaths.findFile("config.json", "config");
```

## Examples

### Example 1: Basic XDG Application

```typescript
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

async function main() {
  const xdgPaths = new XDGPaths("myapp");
  await xdgPaths.ensureDirectories();

  // Load or create configuration
  let config;
  const configPath = await xdgPaths.findFile("config.json", "config");

  if (configPath) {
    config = JSON.parse(await Deno.readTextFile(configPath));
  } else {
    config = { theme: "default", version: "1.0.0" };
    await Deno.writeTextFile(
      xdgPaths.getConfigPath("config.json"),
      JSON.stringify(config, null, 2)
    );
  }

  console.log("Config loaded:", config);
}

await main();
```

### Example 2: XDG-Compliant Logging

```typescript
import { ConfigBuilder, FileLoggerPlugin, Logger } from "jsr:@pedromdominguez/genesis-trace";
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

const xdgPaths = new XDGPaths("myapp");
await xdgPaths.ensureDirectories();

const logger = new Logger(
  new ConfigBuilder()
    .plugin(
      new FileLoggerPlugin({
        filepath: xdgPaths.getStatePath("app.log"),
        format: "text",
        append: true,
      })
    )
    .build()
);

logger.info("Application started");
logger.success("XDG-compliant logging active");
```

### Example 3: Cache Management

```typescript
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

async function cacheData(key: string, data: unknown) {
  const xdgPaths = new XDGPaths("myapp");
  await xdgPaths.ensureDirectories();

  const cachePath = xdgPaths.getCachePath(`${key}.json`);
  await Deno.writeTextFile(cachePath, JSON.stringify(data));
}

async function loadCache(key: string): Promise<unknown | null> {
  const xdgPaths = new XDGPaths("myapp");
  const cachePath = xdgPaths.getCachePath(`${key}.json`);

  try {
    const content = await Deno.readTextFile(cachePath);
    return JSON.parse(content);
  } catch {
    return null;
  }
}

async function clearAllCache() {
  const xdgPaths = new XDGPaths("myapp");
  await xdgPaths.clearCache();
}
```

### Example 4: Full Application with XDG

```typescript
import { ConfigBuilder, Logger, neonTheme } from "jsr:@pedromdominguez/genesis-trace";
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

class XDGCompliantApp {
  private xdgPaths: XDGPaths;
  private logger: Logger;
  private config: any;

  constructor(appName: string) {
    this.xdgPaths = new XDGPaths(appName);
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .build()
    );
  }

  async initialize() {
    // Ensure XDG directories exist
    await this.xdgPaths.ensureDirectories();
    this.logger.success("XDG directories initialized");

    // Load configuration
    await this.loadConfig();
    this.logger.success("Configuration loaded");

    // Setup logging
    await this.setupLogging();
    this.logger.success("Logging configured");
  }

  private async loadConfig() {
    const configPath = await this.xdgPaths.findFile("config.json", "config");

    if (configPath) {
      const content = await Deno.readTextFile(configPath);
      this.config = JSON.parse(content);
    } else {
      this.config = {
        theme: "neon",
        logLevel: "info",
      };

      await Deno.writeTextFile(
        this.xdgPaths.getConfigPath("config.json"),
        JSON.stringify(this.config, null, 2)
      );
    }
  }

  private async setupLogging() {
    const logPath = this.xdgPaths.getStatePath("app.log");

    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel(this.config.logLevel)
        .plugin(
          new FileLoggerPlugin({
            filepath: logPath,
            format: "text",
            append: true,
          })
        )
        .build()
    );
  }

  async run() {
    this.logger.info("Application running");
    // Application logic here
  }

  async shutdown() {
    this.logger.info("Application shutting down");
    await this.logger.shutdown();
  }
}

// Usage
const app = new XDGCompliantApp("myapp");
await app.initialize();
await app.run();
await app.shutdown();
```

## Resources

### Official Documentation

- [XDG Base Directory Specification](https://specifications.freedesktop.org/basedir/0.6/)
- [XDG User Directories](https://specifications.freedesktop.org/basedir-spec/latest/)
- [freedesktop.org Specifications](https://www.freedesktop.org/wiki/Specifications/)

### Implementation References

- [XDG Base Directory - ArchWiki](https://wiki.archlinux.org/title/XDG_Base_Directory)
- [XDGBaseDirectorySpecification - Debian Wiki](https://wiki.debian.org/XDGBaseDirectorySpecification)
- [Understanding XDG - Alchemists](https://alchemists.io/articles/xdg_base_directory_specification)

### Language-Specific Implementations

- [adrg/xdg (Go)](https://github.com/adrg/xdg)
- [bkuhlmann/xdg (Ruby)](https://github.com/bkuhlmann/xdg)
- [dirs-dev crates (Rust)](https://github.com/dirs-dev)

### Recent News

- [Firefox 147 Will Support XDG Base Directory Specification](https://www.phoronix.com/news/Firefox-147-XDG-Base-Directory) - November 2025

### Tools and Utilities

- [xdg-utils](https://www.freedesktop.org/wiki/Software/xdg-utils/) - Command-line tools for XDG
- [chezmoi](https://www.chezmoi.io/) - Dotfile manager with XDG support
- [home-manager](https://github.com/nix-community/home-manager) - Nix-based configuration manager

## Running the Example

To run the comprehensive XDG compliance demonstration:

```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-compliance-guide.ts
```

This will:
1. Detect your XDG environment
2. Create XDG-compliant directories
3. Write files to appropriate locations
4. Demonstrate file search across directories
5. Show GenesisTrace integration
6. Display best practices and guidelines

## Conclusion

XDG Base Directory Specification compliance is essential for professional Linux/Unix applications. By following this guide and using the provided `XDGPaths` utility, you can ensure your Deno applications integrate seamlessly with user environments and system standards.

GenesisTrace makes XDG compliance straightforward by providing flexible configuration and file logging plugins that work naturally with XDG directories.

---

**Made with ❤️ for the Deno and Linux/Unix communities**

**GenesisTrace:** Professional Terminal Logging & Formatting
**License:** MIT
**Author:** Pedro M. Dominguez ([@grenas405](https://github.com/grenas405))
