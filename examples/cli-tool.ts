#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Interactive CLI Tool Example
 *
 * Demonstrates a complete command-line application with menus, workflows, and user interactions.
 * Features used:
 *   • Interactive prompts (input, confirm, select)
 *   • Structured logging with child loggers
 *   • Tables for data display
 *   • Boxes for important messages
 *   • Progress indicators for long operations
 *   • Banners for application branding
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Formatter,
  InteractivePrompts,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simple user database (in-memory)
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created: Date;
}

class UserDatabase {
  private users: User[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "admin",
      created: new Date("2024-01-15"),
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "user",
      created: new Date("2024-02-20"),
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      role: "user",
      created: new Date("2024-03-10"),
    },
  ];
  private nextId = 4;

  getAll(): User[] {
    return [...this.users];
  }

  getById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  add(user: Omit<User, "id" | "created">): User {
    const newUser: User = {
      ...user,
      id: this.nextId++,
      created: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  delete(id: number): boolean {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return false;
    this.users.splice(index, 1);
    return true;
  }

  update(id: number, updates: Partial<User>): User | undefined {
    const user = this.getById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    return user;
  }
}

// Main CLI application
class UserManagementCLI {
  private db: UserDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new UserDatabase();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .build(),
    );
  }

  private showBanner() {
    console.clear();
    BannerRenderer.render({
      title: "USER MANAGEMENT CLI",
      subtitle: "Interactive Command-Line Application",
      description: "Powered by GenesisTrace • Demo Application",
      version: "1.0.0",
      author: "Demo Team",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
    });
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(60), ColorSystem.codes.cyan));
    console.log(ColorSystem.colorize(" MAIN MENU", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(60), ColorSystem.codes.cyan));
    console.log("");

    return await InteractivePrompts.select(
      "What would you like to do?",
      [
        { label: "List all users", value: "List all users" },
        { label: "Add new user", value: "Add new user" },
        { label: "Update user", value: "Update user" },
        { label: "Delete user", value: "Delete user" },
        { label: "Search users", value: "Search users" },
        { label: "View statistics", value: "View statistics" },
        { label: "Exit application", value: "Exit application" },
      ],
    );
  }

  private async listUsers() {
    this.logger.info("Fetching user list...");

    const spinner = new Spinner({ message: "Loading users..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Users loaded");

    const users = this.db.getAll();

    if (users.length === 0) {
      BoxRenderer.message("No users found in the database", "info");
      return;
    }

    console.log("");
    console.log(ColorSystem.colorize(`Found ${users.length} users:`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      users,
      [
        { key: "id", label: "ID", width: 5, align: "right" },
        { key: "name", label: "Name", width: 20 },
        { key: "email", label: "Email", width: 25 },
        { key: "role", label: "Role", width: 10 },
        {
          key: "created",
          label: "Created",
          width: 12,
          formatter: (date: Date) => Formatter.relativeTime(date),
        },
      ],
      { showIndex: true },
    );

    this.logger.success(`Displayed ${users.length} users`);
  }

  private async addUser() {
    console.log("");
    BoxRenderer.render(
      ["Please provide the following information:", "", "All fields are required."],
      { title: "Add New User", style: "rounded", color: ColorSystem.codes.green },
    );
    console.log("");

    const name = await InteractivePrompts.input("Full Name:");
    if (!name) {
      BoxRenderer.message("Name cannot be empty", "error");
      return;
    }

    const email = await InteractivePrompts.input("Email Address:");
    if (!email || !email.includes("@")) {
      BoxRenderer.message("Invalid email address", "error");
      return;
    }

    const role = await InteractivePrompts.select(
      "Select role:",
      [
        { label: "user", value: "user" },
        { label: "moderator", value: "moderator" },
        { label: "admin", value: "admin" },
      ],
    );

    const confirm = await InteractivePrompts.confirm(
      `Create user '${name}' with email '${email}' as ${role}?`,
      true,
    );

    if (!confirm) {
      BoxRenderer.message("User creation cancelled", "info");
      return;
    }

    const spinner = new Spinner({ message: "Creating user..." });
    spinner.start();
    await sleep(1000);

    const newUser = this.db.add({ name, email, role });

    spinner.succeed("User created successfully!");

    console.log("");
    BoxRenderer.render(
      [
        `User ID: ${newUser.id}`,
        `Name: ${newUser.name}`,
        `Email: ${newUser.email}`,
        `Role: ${newUser.role}`,
        `Created: ${newUser.created.toLocaleString()}`,
      ],
      { title: "New User Details", style: "single", color: ColorSystem.codes.green },
    );

    this.logger.success(`Created user: ${newUser.name} (ID: ${newUser.id})`);
  }

  private async updateUser() {
    const users = this.db.getAll();
    if (users.length === 0) {
      BoxRenderer.message("No users to update", "warning");
      return;
    }

    console.log("");
    const userChoices = users.map((u) => ({
      label: `${u.id} - ${u.name} (${u.email})`,
      value: `${u.id} - ${u.name} (${u.email})`,
    }));
    const selection = await InteractivePrompts.select("Select user to update:", userChoices);

    const userId = parseInt(selection.split(" - ")[0]);
    const user = this.db.getById(userId);

    if (!user) {
      BoxRenderer.message("User not found", "error");
      return;
    }

    console.log("");
    const field = await InteractivePrompts.select(
      "What would you like to update?",
      [
        { label: "Name", value: "Name" },
        { label: "Email", value: "Email" },
        { label: "Role", value: "Role" },
        { label: "Cancel", value: "Cancel" },
      ],
    );

    if (field === "Cancel") {
      return;
    }

    let newValue: string;
    if (field === "Role") {
      newValue = await InteractivePrompts.select("Select new role:", [
        { label: "user", value: "user" },
        { label: "moderator", value: "moderator" },
        { label: "admin", value: "admin" },
      ]);
    } else {
      newValue = await InteractivePrompts.input(`Enter new ${field.toLowerCase()}:`, "");
      if (!newValue) {
        BoxRenderer.message("Value cannot be empty", "error");
        return;
      }
    }

    const spinner = new Spinner({ message: "Updating user..." });
    spinner.start();
    await sleep(800);

    const updates: Partial<User> = {};
    if (field === "Name") updates.name = newValue;
    if (field === "Email") updates.email = newValue;
    if (field === "Role") updates.role = newValue;

    this.db.update(userId, updates);
    spinner.succeed("User updated successfully!");

    this.logger.success(`Updated user ID ${userId}: ${field} = ${newValue}`);
  }

  private async deleteUser() {
    const users = this.db.getAll();
    if (users.length === 0) {
      BoxRenderer.message("No users to delete", "warning");
      return;
    }

    console.log("");
    const userChoices = users.map((u) => ({
      label: `${u.id} - ${u.name} (${u.email})`,
      value: `${u.id} - ${u.name} (${u.email})`,
    }));
    const selection = await InteractivePrompts.select("Select user to delete:", userChoices);

    const userId = parseInt(selection.split(" - ")[0]);
    const user = this.db.getById(userId);

    if (!user) {
      BoxRenderer.message("User not found", "error");
      return;
    }

    console.log("");
    BoxRenderer.render(
      [
        `ID: ${user.id}`,
        `Name: ${user.name}`,
        `Email: ${user.email}`,
        `Role: ${user.role}`,
      ],
      { title: "⚠️ Delete This User?", style: "bold", color: ColorSystem.codes.red },
    );

    const confirm = await InteractivePrompts.confirm(
      "Are you absolutely sure? This action cannot be undone.",
      false,
    );

    if (!confirm) {
      BoxRenderer.message("Deletion cancelled", "info");
      return;
    }

    const spinner = new Spinner({ message: "Deleting user..." });
    spinner.start();
    await sleep(800);

    this.db.delete(userId);
    spinner.succeed("User deleted successfully!");

    this.logger.warning(`Deleted user: ${user.name} (ID: ${userId})`);
  }

  private async searchUsers() {
    console.log("");
    const query = await InteractivePrompts.input("Enter search term (name or email):", "");

    if (!query) {
      return;
    }

    const spinner = new Spinner({ message: "Searching..." });
    spinner.start();
    await sleep(600);

    const results = this.db.getAll().filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase()),
    );

    spinner.succeed(`Found ${results.length} results`);

    if (results.length === 0) {
      BoxRenderer.message(`No users found matching '${query}'`, "info");
      return;
    }

    console.log("");
    TableRenderer.render(
      results,
      [
        { key: "id", label: "ID", width: 5, align: "right" },
        { key: "name", label: "Name", width: 20 },
        { key: "email", label: "Email", width: 25 },
        { key: "role", label: "Role", width: 10 },
      ],
    );
  }

  private async viewStatistics() {
    const spinner = new Spinner({ message: "Calculating statistics..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Statistics ready");

    const users = this.db.getAll();
    const roleCount = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("");
    BoxRenderer.render(
      [
        `Total Users: ${ColorSystem.colorize(String(users.length), ColorSystem.codes.brightCyan)}`,
        `Admins: ${
          ColorSystem.colorize(String(roleCount.admin || 0), ColorSystem.codes.brightMagenta)
        }`,
        `Moderators: ${
          ColorSystem.colorize(String(roleCount.moderator || 0), ColorSystem.codes.brightYellow)
        }`,
        `Regular Users: ${
          ColorSystem.colorize(String(roleCount.user || 0), ColorSystem.codes.brightGreen)
        }`,
        "",
        `Database Size: ${Formatter.bytes(JSON.stringify(users).length)}`,
      ],
      {
        title: "User Statistics",
        style: "double",
        color: ColorSystem.codes.brightBlue,
        padding: 1,
      },
    );
  }

  async run() {
    this.showBanner();

    BoxRenderer.render(
      [
        "Welcome to the User Management CLI!",
        "",
        "This is a demonstration of an interactive command-line application",
        "built with GenesisTrace. Use the menu to manage users.",
      ],
      {
        title: "Welcome",
        style: "rounded",
        color: ColorSystem.codes.green,
        padding: 1,
      },
    );

    console.log("");
    await InteractivePrompts.confirm("Press Enter to continue...", true);

    while (this.running) {
      console.log("\n");
      const choice = await this.showMainMenu();

      console.log("");

      switch (choice) {
        case "List all users":
          await this.listUsers();
          break;
        case "Add new user":
          await this.addUser();
          break;
        case "Update user":
          await this.updateUser();
          break;
        case "Delete user":
          await this.deleteUser();
          break;
        case "Search users":
          await this.searchUsers();
          break;
        case "View statistics":
          await this.viewStatistics();
          break;
        case "Exit application":
          this.running = false;
          continue;
      }

      console.log("");
      await InteractivePrompts.confirm("Press Enter to continue...", true);
    }

    console.log("\n");
    BoxRenderer.message("Thank you for using User Management CLI!", "success");
    console.log("");
    this.logger.info("Application terminated by user");
  }
}

// Main execution
if (import.meta.main) {
  const cli = new UserManagementCLI();
  await cli.run();
}
