#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

// examples/technology/xdg-compliance-guide.ts
// ================================================================================
// XDG Base Directory Specification Compliance Guide
// A comprehensive demonstration of implementing XDG compliance in Deno applications
// ================================================================================

import {
  BoxRenderer,
  ConfigBuilder,
  FileLoggerPlugin,
  Logger,
  neonTheme,
  TableRenderer,
} from "../../mod.ts";

/**
 * XDG Base Directory Specification Implementation
 *
 * This module provides utilities for XDG-compliant directory management
 * following the freedesktop.org XDG Base Directory Specification v0.8.0
 *
 * Specification: https://specifications.freedesktop.org/basedir/0.6/
 */

interface XDGDirectories {
  dataHome: string;
  configHome: string;
  cacheHome: string;
  stateHome: string;
  runtimeDir?: string;
  dataDirs: string[];
  configDirs: string[];
}

/**
 * Get XDG-compliant directories for the current user
 *
 * Returns an object containing all XDG base directories with proper fallbacks
 * according to the specification.
 */
function getXDGDirectories(): XDGDirectories {
  const home = Deno.env.get("HOME");
  if (!home) {
    throw new Error("HOME environment variable is not set");
  }

  // User-specific directories (where applications write files)
  const dataHome = Deno.env.get("XDG_DATA_HOME") || `${home}/.local/share`;
  const configHome = Deno.env.get("XDG_CONFIG_HOME") || `${home}/.config`;
  const cacheHome = Deno.env.get("XDG_CACHE_HOME") || `${home}/.cache`;

  // XDG State (for logs, history, recent files, etc.)
  // Not in original spec but added in newer versions
  const stateHome = Deno.env.get("XDG_STATE_HOME") || `${home}/.local/state`;

  // Runtime directory (sockets, named pipes, etc.)
  const runtimeDir = Deno.env.get("XDG_RUNTIME_DIR");

  // System-wide directories (where applications search for files)
  const dataDirs = (Deno.env.get("XDG_DATA_DIRS") || "/usr/local/share/:/usr/share/")
    .split(":")
    .filter((dir) => dir.length > 0);

  const configDirs = (Deno.env.get("XDG_CONFIG_DIRS") || "/etc/xdg")
    .split(":")
    .filter((dir) => dir.length > 0);

  return {
    dataHome,
    configHome,
    cacheHome,
    stateHome,
    runtimeDir,
    dataDirs,
    configDirs,
  };
}

/**
 * XDGPaths: Application-specific XDG directory manager
 *
 * Manages XDG-compliant paths for a specific application, ensuring
 * all files are stored in appropriate XDG directories.
 */
class XDGPaths {
  private appName: string;
  private xdg: XDGDirectories;

  constructor(appName: string) {
    this.appName = appName;
    this.xdg = getXDGDirectories();
  }

  /**
   * Get application-specific data directory
   * Use for: Application data files, databases, saved games, etc.
   */
  get dataDir(): string {
    return `${this.xdg.dataHome}/${this.appName}`;
  }

  /**
   * Get application-specific config directory
   * Use for: Configuration files, settings, preferences
   */
  get configDir(): string {
    return `${this.xdg.configHome}/${this.appName}`;
  }

  /**
   * Get application-specific cache directory
   * Use for: Non-essential cached data, thumbnails, temporary files
   */
  get cacheDir(): string {
    return `${this.xdg.cacheHome}/${this.appName}`;
  }

  /**
   * Get application-specific state directory
   * Use for: Logs, history, recently used files, undo history
   */
  get stateDir(): string {
    return `${this.xdg.stateHome}/${this.appName}`;
  }

  /**
   * Get application-specific runtime directory
   * Use for: Sockets, named pipes, runtime locks
   * Note: This directory is only available if XDG_RUNTIME_DIR is set
   */
  get runtimeDir(): string | undefined {
    return this.xdg.runtimeDir ? `${this.xdg.runtimeDir}/${this.appName}` : undefined;
  }

  /**
   * Get all search paths for data files (user + system)
   * Returns paths in priority order (user directory first)
   */
  get dataSearchPaths(): string[] {
    return [
      this.dataDir,
      ...this.xdg.dataDirs.map((dir) => `${dir}/${this.appName}`),
    ];
  }

  /**
   * Get all search paths for config files (user + system)
   * Returns paths in priority order (user directory first)
   */
  get configSearchPaths(): string[] {
    return [
      this.configDir,
      ...this.xdg.configDirs.map((dir) => `${dir}/${this.appName}`),
    ];
  }

  /**
   * Ensure all application directories exist
   * Creates directories with secure permissions (0700)
   */
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

  /**
   * Find a file in search paths
   * Searches through all config or data directories in priority order
   *
   * @param filename - Name of file to find
   * @param searchType - Whether to search in 'config' or 'data' directories
   * @returns Full path to file if found, undefined otherwise
   */
  async findFile(
    filename: string,
    searchType: "config" | "data" = "config",
  ): Promise<string | undefined> {
    const searchPaths = searchType === "config"
      ? this.configSearchPaths
      : this.dataSearchPaths;

    for (const basePath of searchPaths) {
      const fullPath = `${basePath}/${filename}`;
      try {
        const stat = await Deno.stat(fullPath);
        if (stat.isFile) {
          return fullPath;
        }
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
          throw error;
        }
        // Continue searching if file not found
      }
    }

    return undefined;
  }

  /**
   * Get path for writing a config file
   * Always returns the user-specific config directory path
   */
  getConfigPath(filename: string): string {
    return `${this.configDir}/${filename}`;
  }

  /**
   * Get path for writing a data file
   * Always returns the user-specific data directory path
   */
  getDataPath(filename: string): string {
    return `${this.dataDir}/${filename}`;
  }

  /**
   * Get path for writing a cache file
   * Returns the user-specific cache directory path
   */
  getCachePath(filename: string): string {
    return `${this.cacheDir}/${filename}`;
  }

  /**
   * Get path for writing a state file (logs, history, etc.)
   * Returns the user-specific state directory path
   */
  getStatePath(filename: string): string {
    return `${this.stateDir}/${filename}`;
  }

  /**
   * Get path for runtime file (sockets, locks, etc.)
   * Returns undefined if XDG_RUNTIME_DIR is not set
   */
  getRuntimePath(filename: string): string | undefined {
    return this.runtimeDir ? `${this.runtimeDir}/${filename}` : undefined;
  }

  /**
   * Clear cache directory
   * Removes all files in the application's cache directory
   */
  async clearCache(): Promise<void> {
    try {
      for await (const entry of Deno.readDir(this.cacheDir)) {
        const path = `${this.cacheDir}/${entry.name}`;
        if (entry.isFile) {
          await Deno.remove(path);
        } else if (entry.isDirectory) {
          await Deno.remove(path, { recursive: true });
        }
      }
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) {
        throw error;
      }
    }
  }

  /**
   * Get directory information
   * Returns an object with all XDG paths for the application
   */
  getInfo(): Record<string, string | string[] | undefined> {
    return {
      appName: this.appName,
      dataDir: this.dataDir,
      configDir: this.configDir,
      cacheDir: this.cacheDir,
      stateDir: this.stateDir,
      runtimeDir: this.runtimeDir,
      dataSearchPaths: this.dataSearchPaths,
      configSearchPaths: this.configSearchPaths,
    };
  }
}

/**
 * Example: XDG-Compliant Application Configuration
 */
async function demonstrateXDGCompliance() {
  // Initialize logger with neon theme
  const logger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .build(),
  );

  // Display banner
  BoxRenderer.render(
    [
      "XDG Base Directory Specification",
      "Compliance Guide for Deno Applications",
      "",
      "Specification: freedesktop.org",
      "Version: 0.8.0",
    ],
    {
      title: "GenesisTrace XDG Guide",
      style: "double",
      padding: 1,
    },
  );

  console.log();
  logger.info("Demonstrating XDG Base Directory Specification compliance");
  console.log();

  // Get system XDG directories
  const xdg = getXDGDirectories();

  // Display XDG environment
  logger.success("XDG Environment Detected");
  console.log();

  TableRenderer.renderKeyValue([
    { label: "XDG_DATA_HOME", value: xdg.dataHome },
    { label: "XDG_CONFIG_HOME", value: xdg.configHome },
    { label: "XDG_CACHE_HOME", value: xdg.cacheHome },
    { label: "XDG_STATE_HOME", value: xdg.stateHome },
    { label: "XDG_RUNTIME_DIR", value: xdg.runtimeDir || "(not set)" },
    { label: "XDG_DATA_DIRS", value: xdg.dataDirs.join(":") },
    { label: "XDG_CONFIG_DIRS", value: xdg.configDirs.join(":") },
  ]);

  console.log();

  // Create application-specific XDG paths
  const appPaths = new XDGPaths("genesis-trace-demo");

  logger.info("Creating application-specific XDG directories");
  await appPaths.ensureDirectories();
  logger.success("All XDG directories created successfully");
  console.log();

  // Display application paths
  logger.success("Application XDG Paths");
  console.log();

  TableRenderer.renderKeyValue([
    { label: "Data Directory", value: appPaths.dataDir },
    { label: "Config Directory", value: appPaths.configDir },
    { label: "Cache Directory", value: appPaths.cacheDir },
    { label: "State Directory", value: appPaths.stateDir },
    { label: "Runtime Directory", value: appPaths.runtimeDir || "(not available)" },
  ]);

  console.log();

  // Demonstrate file operations
  logger.info("Writing XDG-compliant files");
  console.log();

  // 1. Write configuration file
  const configPath = appPaths.getConfigPath("app.json");
  const config = {
    version: "1.0.0",
    theme: "neon",
    logLevel: "info",
    features: {
      colors: true,
      animations: true,
      mouseSupport: false,
    },
  };

  await Deno.writeTextFile(configPath, JSON.stringify(config, null, 2));
  logger.success(`Configuration written to: ${configPath}`);

  // 2. Write data file
  const dataPath = appPaths.getDataPath("database.json");
  const data = {
    users: [
      { id: 1, name: "Alice", role: "admin" },
      { id: 2, name: "Bob", role: "user" },
    ],
    createdAt: new Date().toISOString(),
  };

  await Deno.writeTextFile(dataPath, JSON.stringify(data, null, 2));
  logger.success(`Data file written to: ${dataPath}`);

  // 3. Write cache file
  const cachePath = appPaths.getCachePath("thumbnails.json");
  const cache = {
    images: [
      { id: 1, thumbnail: "/cache/thumb1.png", expires: Date.now() + 86400000 },
      { id: 2, thumbnail: "/cache/thumb2.png", expires: Date.now() + 86400000 },
    ],
  };

  await Deno.writeTextFile(cachePath, JSON.stringify(cache, null, 2));
  logger.success(`Cache file written to: ${cachePath}`);

  // 4. Write state file (log)
  const logPath = appPaths.getStatePath("app.log");
  await Deno.writeTextFile(
    logPath,
    `[${new Date().toISOString()}] Application started\n`,
  );
  logger.success(`Log file written to: ${logPath}`);

  console.log();

  // Demonstrate file search
  logger.info("Searching for configuration file");
  const foundConfig = await appPaths.findFile("app.json", "config");
  if (foundConfig) {
    logger.success(`Found configuration at: ${foundConfig}`);
  }

  console.log();

  // Display search paths
  logger.success("Configuration Search Paths (in priority order)");
  console.log();

  const configSearchData = appPaths.configSearchPaths.map((path, index) => ({
    priority: index + 1,
    path: path,
    type: index === 0 ? "User (write)" : "System (read)",
  }));

  TableRenderer.render(configSearchData, [
    { key: "priority", label: "Priority", width: 10, align: "right" },
    { key: "path", label: "Path", width: 50 },
    { key: "type", label: "Type", width: 20 },
  ]);

  console.log();

  // GenesisTrace Integration Example
  logger.info("Integrating GenesisTrace with XDG directories");
  console.log();

  // Create XDG-compliant logger with file plugin
  const xdgLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .plugin(
        new FileLoggerPlugin({
          filepath: appPaths.getStatePath("genesis-trace.log"),
          format: "text",
          append: true,
        }),
      )
      .build(),
  );

  xdgLogger.info("XDG-compliant logging initialized");
  xdgLogger.success("Log files are stored in XDG_STATE_HOME");
  xdgLogger.warning("This follows the XDG Base Directory Specification");

  logger.success(
    `GenesisTrace logs written to: ${appPaths.getStatePath("genesis-trace.log")}`,
  );

  console.log();

  // Best Practices
  BoxRenderer.render(
    [
      "XDG Compliance Best Practices",
      "",
      "1. Configuration files → XDG_CONFIG_HOME",
      "2. Application data → XDG_DATA_HOME",
      "3. Non-essential cache → XDG_CACHE_HOME",
      "4. Logs and history → XDG_STATE_HOME",
      "5. Runtime files (sockets) → XDG_RUNTIME_DIR",
      "",
      "6. Always check environment variables first",
      "7. Fall back to specification defaults",
      "8. Create directories with mode 0700",
      "9. Handle missing directories gracefully",
      "10. Search in priority order (user → system)",
    ],
    {
      title: "Best Practices",
      style: "rounded",
      padding: 1,
    },
  );

  console.log();

  // Directory usage guidelines
  logger.success("Directory Usage Guidelines");
  console.log();

  const guidelines = [
    {
      directory: "XDG_CONFIG_HOME",
      purpose: "User preferences, settings",
      examples: "app.json, config.toml, settings.yml",
    },
    {
      directory: "XDG_DATA_HOME",
      purpose: "Application data, databases",
      examples: "database.db, saves.json, plugins/",
    },
    {
      directory: "XDG_CACHE_HOME",
      purpose: "Non-essential cached data",
      examples: "thumbnails/, http-cache/, temp/",
    },
    {
      directory: "XDG_STATE_HOME",
      purpose: "Logs, history, undo data",
      examples: "app.log, history.json, undo/",
    },
    {
      directory: "XDG_RUNTIME_DIR",
      purpose: "Runtime files, sockets",
      examples: "app.sock, app.pid, locks/",
    },
  ];

  TableRenderer.render(guidelines, [
    { key: "directory", label: "Directory", width: 20 },
    { key: "purpose", label: "Purpose", width: 30 },
    { key: "examples", label: "Examples", width: 35 },
  ]);

  console.log();

  // Cleanup demonstration
  logger.info("Demonstrating cache cleanup");
  await appPaths.clearCache();
  logger.success("Cache directory cleared successfully");

  console.log();

  // Final summary
  BoxRenderer.render(
    [
      "XDG Compliance Summary",
      "",
      "✓ All XDG directories detected",
      "✓ Application directories created",
      "✓ Files written to correct locations",
      "✓ Search paths configured",
      "✓ GenesisTrace integrated with XDG",
      "",
      "Your application is now XDG-compliant!",
    ],
    {
      title: "Success",
      style: "double",
      padding: 1,
    },
  );

  // Shutdown
  await xdgLogger.shutdown();
}

/**
 * Main entry point
 */
if (import.meta.main) {
  try {
    await demonstrateXDGCompliance();
  } catch (error) {
    console.error("Error:", error.message);
    Deno.exit(1);
  }
}

// Export for use in other modules
export { getXDGDirectories, XDGPaths };
