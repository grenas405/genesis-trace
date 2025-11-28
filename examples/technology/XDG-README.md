# XDG Base Directory Specification Examples

This directory contains comprehensive examples demonstrating XDG Base Directory Specification compliance in Deno applications using GenesisTrace.

## Overview

The XDG Base Directory Specification (freedesktop.org) defines where applications should store user-specific files on Linux and Unix systems. These examples show how to implement XDG compliance properly in real-world applications.

## Files in This Directory

### 1. XDG-COMPLIANCE-GUIDE.md

**Comprehensive documentation covering:**
- What is XDG and why it matters
- Complete specification details
- All XDG environment variables explained
- Step-by-step implementation guide
- Directory usage guidelines
- GenesisTrace integration examples
- Best practices and common pitfalls
- Real-world examples and code samples
- Resources and references

**Read this first** to understand XDG compliance fundamentals.

### 2. xdg-compliance-guide.ts

**Executable demonstration showing:**
- XDG environment detection
- Directory creation with proper permissions
- File operations in correct locations
- Configuration file search across directories
- GenesisTrace integration with XDG
- Cache management
- Best practices in action

**Features:**
- `getXDGDirectories()` - Detects all XDG directories with proper fallbacks
- `XDGPaths` class - Manages application-specific XDG paths
- Complete working example with visual output
- Reusable utility functions for other projects

**Run the demo:**
```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-compliance-guide.ts
```

**Use in your project:**
```typescript
import { XDGPaths } from "./examples/technology/xdg-compliance-guide.ts";

const xdgPaths = new XDGPaths("your-app-name");
await xdgPaths.ensureDirectories();

// Write configuration
await Deno.writeTextFile(
  xdgPaths.getConfigPath("config.json"),
  JSON.stringify(config)
);

// Load data with search across directories
const dataPath = await xdgPaths.findFile("data.json", "data");
```

### 3. xdg-task-manager.ts

**Real-world application example:**

A fully functional task manager demonstrating proper XDG compliance in a practical application.

**Features:**
- Configuration stored in `XDG_CONFIG_HOME`
- Task database stored in `XDG_DATA_HOME`
- Search index cached in `XDG_CACHE_HOME`
- Application logs in `XDG_STATE_HOME`
- Interactive CLI with full CRUD operations
- GenesisTrace logging integration
- Cache management and rebuilding
- XDG directory inspection

**XDG Directory Usage:**

| Directory | Purpose | Files |
|-----------|---------|-------|
| `XDG_CONFIG_HOME/task-manager/` | User settings | `config.json` |
| `XDG_DATA_HOME/task-manager/` | Task database | `tasks.json` |
| `XDG_CACHE_HOME/task-manager/` | Search index | `search-index.json` |
| `XDG_STATE_HOME/task-manager/` | Application logs | `task-manager.log` |

**Run interactive mode:**
```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-task-manager.ts
```

**Run demo mode:**
```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-task-manager.ts --demo
```

## Quick Start

### 1. Understand XDG Basics

Read the specification summary:
```bash
cat examples/technology/XDG-COMPLIANCE-GUIDE.md
```

### 2. See XDG in Action

Run the compliance guide demo:
```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-compliance-guide.ts
```

This will:
- Detect your XDG environment
- Show all environment variables
- Create application directories
- Write files to correct locations
- Demonstrate file searching
- Show GenesisTrace integration

### 3. Explore a Real Application

Run the task manager:
```bash
deno run --allow-read --allow-write --allow-env examples/technology/xdg-task-manager.ts --demo
```

This demonstrates:
- Configuration management
- Data persistence
- Cache handling
- Logging to state directory
- Complete XDG integration

## XDG Environment Variables

### Primary Variables (User-Specific)

```bash
# User directories (where applications write files)
export XDG_DATA_HOME="$HOME/.local/share"   # Application data
export XDG_CONFIG_HOME="$HOME/.config"      # Configuration files
export XDG_CACHE_HOME="$HOME/.cache"        # Non-essential cache
export XDG_STATE_HOME="$HOME/.local/state"  # Logs, history, state
export XDG_RUNTIME_DIR="/run/user/$(id -u)" # Runtime files (set by system)
```

### Secondary Variables (System-Wide)

```bash
# System directories (where applications search for files)
export XDG_DATA_DIRS="/usr/local/share/:/usr/share/"
export XDG_CONFIG_DIRS="/etc/xdg"
```

## Directory Usage Guidelines

### What Goes Where?

| File Type | Directory | Example Files |
|-----------|-----------|---------------|
| User preferences, settings | `XDG_CONFIG_HOME` | `config.json`, `settings.toml`, `preferences.yml` |
| Application data, databases | `XDG_DATA_HOME` | `database.db`, `saves.json`, `plugins/` |
| Non-essential cached data | `XDG_CACHE_HOME` | `thumbnails/`, `http-cache/`, `compiled/` |
| Logs, history, state | `XDG_STATE_HOME` | `app.log`, `history.json`, `recent.json` |
| Runtime files, sockets | `XDG_RUNTIME_DIR` | `app.sock`, `app.pid`, `locks/` |

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

## Implementation Pattern

Here's the basic pattern used in all examples:

```typescript
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

// 1. Create XDG paths manager for your app
const xdgPaths = new XDGPaths("your-app-name");

// 2. Ensure directories exist (mode 0700)
await xdgPaths.ensureDirectories();

// 3. Write files to appropriate directories

// Configuration file
await Deno.writeTextFile(
  xdgPaths.getConfigPath("config.json"),
  JSON.stringify({ theme: "neon" })
);

// Data file
await Deno.writeTextFile(
  xdgPaths.getDataPath("database.json"),
  JSON.stringify({ users: [] })
);

// Cache file
await Deno.writeTextFile(
  xdgPaths.getCachePath("search-index.json"),
  JSON.stringify({ index: {} })
);

// Log file (state)
await Deno.writeTextFile(
  xdgPaths.getStatePath("app.log"),
  `[${new Date().toISOString()}] App started\n`
);

// 4. Search for files (user directory first, then system)
const configPath = await xdgPaths.findFile("config.json", "config");
if (configPath) {
  const config = JSON.parse(await Deno.readTextFile(configPath));
}

// 5. Clear cache when needed
await xdgPaths.clearCache();
```

## GenesisTrace Integration

### XDG-Compliant Logging

```typescript
import { ConfigBuilder, FileLoggerPlugin, Logger } from "jsr:@pedromdominguez/genesis-trace";
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

const xdgPaths = new XDGPaths("myapp");
await xdgPaths.ensureDirectories();

// Logs go to XDG_STATE_HOME
const logger = new Logger(
  new ConfigBuilder()
    .logLevel("info")
    .plugin(
      new FileLoggerPlugin({
        filepath: xdgPaths.getStatePath("app.log"),
        format: "text",
        append: true,
      })
    )
    .build()
);

logger.info("XDG-compliant logging initialized");
```

### Configuration Management

```typescript
// Load config with fallback to system directories
const configPath = await xdgPaths.findFile("config.json", "config");

if (configPath) {
  const config = JSON.parse(await Deno.readTextFile(configPath));
} else {
  // Create default config in user directory
  const defaultConfig = { theme: "neon", logLevel: "info" };
  await Deno.writeTextFile(
    xdgPaths.getConfigPath("config.json"),
    JSON.stringify(defaultConfig, null, 2)
  );
}
```

## Best Practices

### ✅ DO

1. **Always check environment variables first**
   ```typescript
   const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
   ```

2. **Create directories with mode 0700**
   ```typescript
   await Deno.mkdir(dir, { recursive: true, mode: 0o700 });
   ```

3. **Search in priority order (user → system)**
   ```typescript
   const searchPaths = [userDir, ...systemDirs];
   ```

4. **Handle missing directories gracefully**
   ```typescript
   try {
     const stat = await Deno.stat(path);
   } catch (error) {
     if (error instanceof Deno.errors.NotFound) {
       // Continue searching
     }
   }
   ```

5. **Use appropriate directories for file types**
   - Config → `XDG_CONFIG_HOME`
   - Data → `XDG_DATA_HOME`
   - Cache → `XDG_CACHE_HOME`
   - Logs → `XDG_STATE_HOME`

### ❌ DON'T

1. **Don't hardcode XDG paths**
   ```typescript
   // Bad
   const configDir = `${home}/.config/myapp`;

   // Good
   const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
   const configDir = `${configHome}/myapp`;
   ```

2. **Don't mix file types in one directory**
   ```typescript
   // Bad - everything in config
   await Deno.writeTextFile(`${configDir}/app.log`, log);

   // Good - logs in state directory
   await Deno.writeTextFile(xdgPaths.getStatePath("app.log"), log);
   ```

3. **Don't assume XDG_RUNTIME_DIR is set**
   ```typescript
   // Bad
   const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
   const socketPath = `${runtimeDir}/app.sock`; // May be undefined!

   // Good
   const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");
   if (runtimeDir) {
     const socketPath = `${runtimeDir}/app.sock`;
   }
   ```

## Testing Your XDG Compliance

### 1. Check Environment Variables

```bash
# Show current XDG configuration
deno run --allow-env examples/technology/xdg-compliance-guide.ts | grep "XDG_"
```

### 2. Verify Directory Structure

After running your app:
```bash
# Check config directory
ls -la $XDG_CONFIG_HOME/your-app-name/

# Check data directory
ls -la $XDG_DATA_HOME/your-app-name/

# Check cache directory
ls -la $XDG_CACHE_HOME/your-app-name/

# Check state directory
ls -la $XDG_STATE_HOME/your-app-name/
```

### 3. Test File Search

Verify your app searches in the correct order:
1. User directory (`$XDG_CONFIG_HOME/your-app-name/`)
2. System directories (`/etc/xdg/your-app-name/`)

### 4. Test Cache Clearing

Your app should handle missing cache gracefully:
```bash
# Clear cache
rm -rf $XDG_CACHE_HOME/your-app-name/

# Run app - should recreate cache
deno run --allow-all your-app.ts
```

## Resources

### Official Documentation

- [XDG Base Directory Specification v0.8.0](https://specifications.freedesktop.org/basedir/0.6/)
- [freedesktop.org Specifications](https://www.freedesktop.org/wiki/Specifications/)

### Linux/Unix Documentation

- [ArchWiki: XDG Base Directory](https://wiki.archlinux.org/title/XDG_Base_Directory)
- [Debian Wiki: XDG Base Directory Specification](https://wiki.debian.org/XDGBaseDirectorySpecification)

### Articles & Guides

- [Use the XDG Base Directory Specification!](https://xdgbasedirectoryspecification.com/)
- [Understanding XDG - Alchemists](https://alchemists.io/articles/xdg_base_directory_specification)
- [Linux XDG Comprehensive Guide](https://linuxvox.com/blog/linux-xdg/)

### Recent News

- [Firefox 147 XDG Support](https://www.phoronix.com/news/Firefox-147-XDG-Base-Directory) - November 2025

## Contributing

If you find issues with these examples or want to add more XDG compliance demonstrations, please open an issue or pull request on the GenesisTrace repository.

## License

MIT License - Part of GenesisTrace

**Author:** Pedro M. Dominguez ([@grenas405](https://github.com/grenas405))

---

**GenesisTrace:** Professional Terminal Logging & Formatting for Deno
**Zero Dependencies** | **Full TypeScript** | **Production Ready**
