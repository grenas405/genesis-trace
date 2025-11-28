#!/usr/bin/env -S deno run --allow-read --allow-write --allow-env

// examples/technology/xdg-task-manager.ts
// ================================================================================
// XDG-Compliant Task Manager
// A practical example demonstrating XDG compliance in a real-world application
// ================================================================================

import {
  BoxRenderer,
  ConfigBuilder,
  FileLoggerPlugin,
  InteractivePrompts,
  Logger,
  neonTheme,
  Spinner,
  TableRenderer,
} from "../../mod.ts";
import { XDGPaths } from "./technology/xdg-compliance-guide.ts";

/**
 * Task interface
 */
interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in_progress" | "completed";
  createdAt: string;
  completedAt?: string;
  priority: "low" | "medium" | "high";
}

/**
 * Application configuration
 */
interface AppConfig {
  theme: "default" | "neon" | "minimal";
  defaultPriority: "low" | "medium" | "high";
  sortBy: "createdAt" | "priority" | "status";
  showCompleted: boolean;
}

/**
 * XDG-Compliant Task Manager Application
 *
 * Demonstrates proper use of all XDG directories:
 * - XDG_CONFIG_HOME: Application settings and preferences
 * - XDG_DATA_HOME: Task database
 * - XDG_CACHE_HOME: Search index and temporary data
 * - XDG_STATE_HOME: Application logs and history
 */
class TaskManager {
  private xdgPaths: XDGPaths;
  private logger: Logger;
  private config!: AppConfig;
  private tasks: Task[] = [];

  constructor() {
    this.xdgPaths = new XDGPaths("task-manager");

    // Initialize logger
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .build(),
    );
  }

  /**
   * Initialize the application
   */
  async initialize(): Promise<void> {
    const spinner = new Spinner({ message: "Initializing Task Manager..." });
    spinner.start();

    try {
      // Ensure XDG directories exist
      await this.xdgPaths.ensureDirectories();
      spinner.update("XDG directories created");

      // Load configuration from XDG_CONFIG_HOME
      await this.loadConfig();
      spinner.update("Configuration loaded");

      // Setup logging to XDG_STATE_HOME
      await this.setupLogging();
      spinner.update("Logging configured");

      // Load tasks from XDG_DATA_HOME
      await this.loadTasks();
      spinner.update("Tasks loaded");

      // Build search index in XDG_CACHE_HOME
      await this.buildSearchIndex();
      spinner.succeed("Task Manager initialized");

      this.logger.info("Task Manager started", {
        tasksCount: this.tasks.length,
        configPath: this.xdgPaths.configDir,
        dataPath: this.xdgPaths.dataDir,
      });
    } catch (error) {
      spinner.fail("Initialization failed");
      throw error;
    }
  }

  /**
   * Load configuration from XDG_CONFIG_HOME
   * Falls back to system config directories if user config doesn't exist
   */
  private async loadConfig(): Promise<void> {
    // Search for config in user directory first, then system directories
    const configPath = await this.xdgPaths.findFile("config.json", "config");

    if (configPath) {
      this.logger.info(`Loading configuration from: ${configPath}`);
      const content = await Deno.readTextFile(configPath);
      this.config = JSON.parse(content);
    } else {
      // Create default configuration
      this.logger.info("No configuration found, creating default");
      this.config = {
        theme: "neon",
        defaultPriority: "medium",
        sortBy: "createdAt",
        showCompleted: true,
      };

      // Save to user config directory (XDG_CONFIG_HOME)
      const userConfigPath = this.xdgPaths.getConfigPath("config.json");
      await Deno.writeTextFile(
        userConfigPath,
        JSON.stringify(this.config, null, 2),
      );

      this.logger.success(`Configuration saved to: ${userConfigPath}`);
    }
  }

  /**
   * Setup logging to XDG_STATE_HOME
   */
  private async setupLogging(): Promise<void> {
    const logPath = this.xdgPaths.getStatePath("task-manager.log");

    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .plugin(
          new FileLoggerPlugin({
            filepath: logPath,
            format: "text",
            append: true,
          }),
        )
        .build(),
    );

    this.logger.info("Logging initialized", { logPath });
  }

  /**
   * Load tasks from XDG_DATA_HOME
   */
  private async loadTasks(): Promise<void> {
    const tasksPath = this.xdgPaths.getDataPath("tasks.json");

    try {
      const content = await Deno.readTextFile(tasksPath);
      this.tasks = JSON.parse(content);
      this.logger.info(`Loaded ${this.tasks.length} tasks from: ${tasksPath}`);
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        this.logger.info("No existing tasks found, starting fresh");
        this.tasks = [];
      } else {
        throw error;
      }
    }
  }

  /**
   * Save tasks to XDG_DATA_HOME
   */
  private async saveTasks(): Promise<void> {
    const tasksPath = this.xdgPaths.getDataPath("tasks.json");
    await Deno.writeTextFile(
      tasksPath,
      JSON.stringify(this.tasks, null, 2),
    );
    this.logger.info(`Saved ${this.tasks.length} tasks to: ${tasksPath}`);

    // Rebuild search index in cache
    await this.buildSearchIndex();
  }

  /**
   * Build search index in XDG_CACHE_HOME
   * This is cached data that can be safely deleted and regenerated
   */
  private async buildSearchIndex(): Promise<void> {
    const searchIndex = this.tasks.map((task) => ({
      id: task.id,
      title: task.title.toLowerCase(),
      description: task.description.toLowerCase(),
      status: task.status,
      priority: task.priority,
    }));

    const indexPath = this.xdgPaths.getCachePath("search-index.json");
    await Deno.writeTextFile(indexPath, JSON.stringify(searchIndex, null, 2));
    this.logger.debug("Search index built", { indexPath });
  }

  /**
   * Add a new task
   */
  async addTask(
    title: string,
    description: string,
    priority: "low" | "medium" | "high" = "medium",
  ): Promise<Task> {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
      priority,
    };

    this.tasks.push(task);
    await this.saveTasks();

    this.logger.success("Task added", {
      id: task.id,
      title: task.title,
      priority: task.priority,
    });

    return task;
  }

  /**
   * Update task status
   */
  async updateTaskStatus(
    taskId: string,
    status: "pending" | "in_progress" | "completed",
  ): Promise<void> {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task not found: ${taskId}`);
    }

    task.status = status;
    if (status === "completed") {
      task.completedAt = new Date().toISOString();
    }

    await this.saveTasks();

    this.logger.info("Task status updated", {
      id: task.id,
      title: task.title,
      status: task.status,
    });
  }

  /**
   * List all tasks
   */
  listTasks(): void {
    let filteredTasks = this.config.showCompleted
      ? this.tasks
      : this.tasks.filter((t) => t.status !== "completed");

    // Sort tasks
    if (this.config.sortBy === "priority") {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      filteredTasks.sort((a, b) =>
        priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    } else if (this.config.sortBy === "status") {
      const statusOrder = { in_progress: 0, pending: 1, completed: 2 };
      filteredTasks.sort((a, b) =>
        statusOrder[a.status] - statusOrder[b.status]
      );
    } else {
      filteredTasks.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    if (filteredTasks.length === 0) {
      this.logger.info("No tasks to display");
      return;
    }

    console.log();
    TableRenderer.render(
      filteredTasks.map((task) => ({
        id: task.id.slice(0, 8),
        title: task.title,
        status: task.status,
        priority: task.priority,
        created: new Date(task.createdAt).toLocaleDateString(),
      })),
      [
        { key: "id", label: "ID", width: 10 },
        { key: "title", label: "Title", width: 30 },
        { key: "status", label: "Status", width: 15 },
        { key: "priority", label: "Priority", width: 10 },
        { key: "created", label: "Created", width: 15 },
      ],
    );
    console.log();

    this.logger.info(`Displayed ${filteredTasks.length} tasks`);
  }

  /**
   * Show application statistics
   */
  showStats(): void {
    const stats = {
      total: this.tasks.length,
      pending: this.tasks.filter((t) => t.status === "pending").length,
      inProgress: this.tasks.filter((t) => t.status === "in_progress").length,
      completed: this.tasks.filter((t) => t.status === "completed").length,
      highPriority: this.tasks.filter((t) => t.priority === "high").length,
    };

    console.log();
    BoxRenderer.render(
      [
        "Task Manager Statistics",
        "",
        `Total Tasks: ${stats.total}`,
        `Pending: ${stats.pending}`,
        `In Progress: ${stats.inProgress}`,
        `Completed: ${stats.completed}`,
        `High Priority: ${stats.highPriority}`,
      ],
      {
        title: "Statistics",
        style: "double",
        padding: 1,
      },
    );
    console.log();
  }

  /**
   * Show XDG directory information
   */
  showXDGInfo(): void {
    console.log();
    this.logger.success("XDG Directory Layout");
    console.log();

    TableRenderer.renderKeyValue([
      {
        label: "Config",
        value: this.xdgPaths.configDir + " (settings, preferences)",
      },
      {
        label: "Data",
        value: this.xdgPaths.dataDir + " (task database)",
      },
      {
        label: "Cache",
        value: this.xdgPaths.cacheDir + " (search index)",
      },
      {
        label: "State",
        value: this.xdgPaths.stateDir + " (logs, history)",
      },
    ]);
    console.log();

    this.logger.info("Files stored in XDG-compliant directories");
    console.log();

    // List actual files
    this.listXDGFiles();
  }

  /**
   * List files in each XDG directory
   */
  private async listXDGFiles(): Promise<void> {
    const directories = [
      { name: "Config", path: this.xdgPaths.configDir },
      { name: "Data", path: this.xdgPaths.dataDir },
      { name: "Cache", path: this.xdgPaths.cacheDir },
      { name: "State", path: this.xdgPaths.stateDir },
    ];

    const files: Array<{ directory: string; file: string; size: string }> = [];

    for (const dir of directories) {
      try {
        for await (const entry of Deno.readDir(dir.path)) {
          if (entry.isFile) {
            const stat = await Deno.stat(`${dir.path}/${entry.name}`);
            files.push({
              directory: dir.name,
              file: entry.name,
              size: this.formatBytes(stat.size),
            });
          }
        }
      } catch (error) {
        if (!(error instanceof Deno.errors.NotFound)) {
          throw error;
        }
      }
    }

    if (files.length > 0) {
      TableRenderer.render(files, [
        { key: "directory", label: "Directory", width: 15 },
        { key: "file", label: "File", width: 30 },
        { key: "size", label: "Size", width: 15 },
      ]);
      console.log();
    }
  }

  /**
   * Format bytes to human-readable string
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Clear cache (demonstrates cache management)
   */
  async clearCache(): Promise<void> {
    await this.xdgPaths.clearCache();
    this.logger.success("Cache cleared successfully");

    // Rebuild search index
    await this.buildSearchIndex();
    this.logger.info("Search index rebuilt");
  }

  /**
   * Shutdown the application
   */
  async shutdown(): Promise<void> {
    this.logger.info("Task Manager shutting down");
    await this.logger.shutdown();
  }
}

/**
 * Interactive CLI
 */
async function runInteractiveCLI() {
  const taskManager = new TaskManager();
  await taskManager.initialize();

  console.log();
  BoxRenderer.render(
    [
      "XDG-Compliant Task Manager",
      "",
      "A practical example of XDG Base Directory compliance",
      "All data stored in appropriate XDG directories",
    ],
    {
      title: "Welcome",
      style: "double",
      padding: 1,
    },
  );
  console.log();

  let running = true;

  while (running) {
    console.log("\nAvailable commands:");
    console.log("  1. Add task");
    console.log("  2. List tasks");
    console.log("  3. Update task status");
    console.log("  4. Show statistics");
    console.log("  5. Show XDG directory info");
    console.log("  6. Clear cache");
    console.log("  7. Exit");
    console.log();

    const choice = await InteractivePrompts.input("Enter command number", "1");

    try {
      switch (choice) {
        case "1": {
          // Add task
          const title = await InteractivePrompts.input("Task title");
          const description = await InteractivePrompts.input(
            "Task description",
          );
          const priority = await InteractivePrompts.select(
            "Select priority",
            ["low", "medium", "high"],
          );

          await taskManager.addTask(
            title,
            description,
            priority as "low" | "medium" | "high",
          );
          console.log("\n✓ Task added successfully\n");
          break;
        }

        case "2": {
          // List tasks
          taskManager.listTasks();
          break;
        }

        case "3": {
          // Update task status
          taskManager.listTasks();
          const taskId = await InteractivePrompts.input(
            "Enter task ID (first 8 chars)",
          );
          const status = await InteractivePrompts.select("Select new status", [
            "pending",
            "in_progress",
            "completed",
          ]);

          // Find full task ID
          const tasks = JSON.parse(
            await Deno.readTextFile(
              new XDGPaths("task-manager").getDataPath("tasks.json"),
            ),
          );
          const task = tasks.find((t: Task) => t.id.startsWith(taskId));

          if (task) {
            await taskManager.updateTaskStatus(
              task.id,
              status as "pending" | "in_progress" | "completed",
            );
            console.log("\n✓ Task status updated\n");
          } else {
            console.log("\n✗ Task not found\n");
          }
          break;
        }

        case "4": {
          // Show statistics
          taskManager.showStats();
          break;
        }

        case "5": {
          // Show XDG info
          taskManager.showXDGInfo();
          break;
        }

        case "6": {
          // Clear cache
          await taskManager.clearCache();
          console.log("\n✓ Cache cleared and rebuilt\n");
          break;
        }

        case "7": {
          // Exit
          const confirm = await InteractivePrompts.confirm(
            "Are you sure you want to exit?",
          );
          if (confirm) {
            running = false;
          }
          break;
        }

        default:
          console.log("\n✗ Invalid command\n");
      }
    } catch (error) {
      console.error("\n✗ Error:", error.message, "\n");
    }
  }

  await taskManager.shutdown();

  console.log();
  BoxRenderer.render(
    [
      "Thank you for using Task Manager!",
      "",
      "All your data is safely stored in XDG directories:",
      "- Configuration: XDG_CONFIG_HOME/task-manager/",
      "- Tasks: XDG_DATA_HOME/task-manager/",
      "- Logs: XDG_STATE_HOME/task-manager/",
      "- Cache: XDG_CACHE_HOME/task-manager/",
    ],
    {
      title: "Goodbye",
      style: "rounded",
      padding: 1,
    },
  );
  console.log();
}

/**
 * Demo mode (non-interactive)
 */
async function runDemo() {
  const taskManager = new TaskManager();
  await taskManager.initialize();

  console.log();
  BoxRenderer.render(
    [
      "XDG-Compliant Task Manager",
      "Demonstration Mode",
      "",
      "This demo shows XDG compliance in action",
    ],
    {
      title: "Demo",
      style: "double",
      padding: 1,
    },
  );
  console.log();

  // Add sample tasks
  console.log("Adding sample tasks...\n");
  await taskManager.addTask(
    "Implement XDG compliance",
    "Follow the XDG Base Directory Specification",
    "high",
  );
  await taskManager.addTask(
    "Write documentation",
    "Document XDG compliance implementation",
    "medium",
  );
  await taskManager.addTask(
    "Add unit tests",
    "Test XDG directory handling",
    "medium",
  );

  // List tasks
  console.log("Current tasks:");
  taskManager.listTasks();

  // Show statistics
  taskManager.showStats();

  // Show XDG info
  taskManager.showXDGInfo();

  await taskManager.shutdown();
}

/**
 * Main entry point
 */
if (import.meta.main) {
  const args = Deno.args;

  if (args.includes("--demo")) {
    await runDemo();
  } else {
    await runInteractiveCLI();
  }
}

export { TaskManager };
