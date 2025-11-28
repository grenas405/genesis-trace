#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Monero Wallet CLI Setup Guide for Linux
 *
 * A comprehensive, visual guide for setting up Monero wallet CLI on Linux systems.
 * Powered by GenesisTrace for beautiful terminal visualization.
 *
 * Features demonstrated:
 *   - Step-by-step installation instructions
 *   - System requirements verification
 *   - Wallet creation workflow with security emphasis
 *   - Mnemonic seed backup procedures
 *   - Network synchronization visualization
 *   - Security best practices and warnings
 *   - Basic wallet operations overview
 *   - Progress tracking for long operations
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  InteractivePrompts,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// GUIDE DATA STRUCTURES
// ============================================================================

interface SetupStep {
  step: number;
  title: string;
  description: string;
  command?: string;
  warning?: string;
  completed: boolean;
}

interface SystemRequirement {
  component: string;
  minimum: string;
  recommended: string;
  status: "✓" | "⚠" | "✗";
  notes: string;
}

const runGuide = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. MONERO BRANDING & INTRODUCTION
  // ===========================================================================
  BannerRenderer.render({
    title: "MONERO WALLET CLI",
    subtitle: "Privacy-Focused Cryptocurrency • Linux Setup Guide",
    description: "Complete walkthrough for installing and configuring Monero CLI wallet",
    version: "v0.18.3.4",
    author: "Monero Community Guide",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightMagenta,
  });
  console.log("");

  // ===========================================================================
  // 2. SETUP LOGGER
  // ===========================================================================
  const guideLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  guideLogger.info("Monero CLI wallet setup guide initialized");
  guideLogger.success("GenesisTrace visual terminal system active");
  console.log("");

  // ===========================================================================
  // 3. WHAT IS MONERO?
  // ===========================================================================
  console.log(ColorSystem.colorize("  ABOUT MONERO (XMR)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      "Monero is a privacy-focused cryptocurrency that uses advanced cryptographic techniques",
      "to ensure transactions are untraceable and unlinkable. Unlike Bitcoin, Monero provides:",
      "",
      "• Ring Signatures: Hides transaction sender by mixing with decoy signatures",
      "• Stealth Addresses: Creates one-time addresses for each transaction",
      "• RingCT: Conceals transaction amounts using confidential transactions",
      "• Kovri (Future): I2P router for hiding IP addresses",
      "",
      "Default Privacy: All transactions are private by default, no opt-in required.",
      "Fungibility: Every XMR is equal - no 'tainted coins' from transaction history.",
    ],
    {
      title: "🔒 Privacy by Design",
      style: "rounded",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 4. SYSTEM REQUIREMENTS
  // ===========================================================================
  console.log(ColorSystem.colorize("  SYSTEM REQUIREMENTS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────", ColorSystem.codes.dim));
  console.log("");

  const systemReqs: SystemRequirement[] = [
    { component: "OS", minimum: "Linux (any distro)", recommended: "Ubuntu 20.04+, Debian 11+, Fedora 35+", status: "✓", notes: "64-bit system required" },
    { component: "CPU", minimum: "2 cores @ 2GHz", recommended: "4+ cores @ 3GHz", status: "✓", notes: "For blockchain sync" },
    { component: "RAM", minimum: "4 GB", recommended: "8 GB+", status: "✓", notes: "Blockchain requires ~160GB RAM to verify" },
    { component: "Storage", minimum: "150 GB free", recommended: "200 GB+ SSD", status: "⚠", notes: "Blockchain grows ~40GB/year" },
    { component: "Network", minimum: "10 Mbps", recommended: "50 Mbps+", status: "✓", notes: "For initial sync & p2p" },
    { component: "Bandwidth", minimum: "~100 GB/month", recommended: "Unlimited", status: "✓", notes: "Initial sync ~150GB" },
  ];

  TableRenderer.render(
    systemReqs,
    [
      { key: "status", label: "✓", width: 4, align: "center" },
      { key: "component", label: "Component", width: 14 },
      { key: "minimum", label: "Minimum", width: 22 },
      { key: "recommended", label: "Recommended", width: 26 },
      { key: "notes", label: "Notes", width: 26 },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      "⚠️  IMPORTANT: Full node requires downloading entire blockchain (~150GB)",
      "⚠️  Initial sync can take 24-72 hours depending on hardware and network",
      "⚠️  Lightweight wallet option available (connects to remote node)",
    ],
    {
      title: "Storage & Sync Warning",
      style: "single",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    },
  );
  console.log("");

  // Ask user if they want to continue
  const continueSetup = await InteractivePrompts.confirm(
    "Do you want to continue with the setup guide?",
    true,
  );

  if (!continueSetup) {
    guideLogger.warning("Setup guide cancelled by user");
    console.log(ColorSystem.colorize("\n  Setup cancelled. Run again when ready!\n", ColorSystem.codes.brightYellow));
    Deno.exit(0);
  }

  console.log("");

  // ===========================================================================
  // 5. INSTALLATION METHODS
  // ===========================================================================
  console.log(ColorSystem.colorize("  INSTALLATION METHODS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────", ColorSystem.codes.dim));
  console.log("");

  const installMethods = [
    { method: "Official Binaries", difficulty: "Easy", security: "High", time: "5 min", recommended: "✓ Yes" },
    { method: "Package Manager", difficulty: "Easy", security: "Medium", time: "5 min", recommended: "Yes" },
    { method: "Build from Source", difficulty: "Advanced", security: "Highest", time: "60+ min", recommended: "For devs" },
    { method: "Docker Container", difficulty: "Medium", security: "Medium", time: "10 min", recommended: "For testing" },
  ];

  TableRenderer.render(
    installMethods,
    [
      { key: "method", label: "Installation Method", width: 22 },
      { key: "difficulty", label: "Difficulty", width: 12 },
      { key: "security", label: "Security", width: 12 },
      { key: "time", label: "Time", width: 10 },
      { key: "recommended", label: "Recommended", width: 16 },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 6. STEP-BY-STEP: OFFICIAL BINARIES (RECOMMENDED)
  // ===========================================================================
  console.log(ColorSystem.colorize("  METHOD 1: OFFICIAL BINARIES (RECOMMENDED)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const installSteps = [
    {
      step: 1,
      title: "Download Monero CLI",
      description: "Visit getmonero.org and download the Linux 64-bit CLI",
      command: "wget https://downloads.getmonero.org/cli/monero-linux-x64-v0.18.3.4.tar.bz2",
      completed: false,
    },
    {
      step: 2,
      title: "Verify Checksums (CRITICAL)",
      description: "Always verify SHA256 hash to prevent malware",
      command: "sha256sum monero-linux-x64-v0.18.3.4.tar.bz2",
      warning: "Compare hash with official website. DO NOT skip this step!",
      completed: false,
    },
    {
      step: 3,
      title: "Verify GPG Signature (Optional but Recommended)",
      description: "Import Monero signing keys and verify release signature",
      command: "gpg --keyserver hkps://keyserver.ubuntu.com --recv-keys 81AC591FE9C4B65C5806AFC3F0AF4D462A0BDF92",
      completed: false,
    },
    {
      step: 4,
      title: "Extract Archive",
      description: "Extract downloaded archive to /opt or ~/monero",
      command: "tar -xjf monero-linux-x64-v0.18.3.4.tar.bz2",
      completed: false,
    },
    {
      step: 5,
      title: "Move to System Path",
      description: "Move binaries to system path for easy access",
      command: "sudo mv monero-x86_64-linux-gnu-v0.18.3.4 /opt/monero",
      completed: false,
    },
    {
      step: 6,
      title: "Add to PATH",
      description: "Add Monero binaries to system PATH",
      command: "echo 'export PATH=/opt/monero:$PATH' >> ~/.bashrc && source ~/.bashrc",
      completed: false,
    },
    {
      step: 7,
      title: "Verify Installation",
      description: "Check that monero-wallet-cli is accessible",
      command: "monero-wallet-cli --version",
      completed: false,
    },
  ];

  for (const step of installSteps) {
    console.log(ColorSystem.colorize(`  Step ${step.step}: ${step.title}`, ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(`  ${step.description}`, ColorSystem.codes.dim));
    console.log("");

    if (step.command) {
      BoxRenderer.render(
        `$ ${step.command}`,
        {
          style: "single",
          color: ColorSystem.codes.brightGreen,
          padding: 1,
        },
      );
      console.log("");
    }

    if (step.warning) {
      BoxRenderer.render(
        `⚠️  ${step.warning}`,
        {
          style: "single",
          color: ColorSystem.codes.brightRed,
          padding: 1,
        },
      );
      console.log("");
    }
  }

  guideLogger.success("Installation steps outlined - ready for wallet creation");
  console.log("");

  // ===========================================================================
  // 7. ALTERNATIVE: PACKAGE MANAGER
  // ===========================================================================
  console.log(ColorSystem.colorize("  METHOD 2: PACKAGE MANAGER", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const packageCommands = [
    { distro: "Ubuntu/Debian", command: "sudo apt update && sudo apt install monero", notes: "May not be latest version" },
    { distro: "Fedora", command: "sudo dnf install monero", notes: "Check version first" },
    { distro: "Arch Linux", command: "sudo pacman -S monero", notes: "Usually up to date" },
    { distro: "Gentoo", command: "sudo emerge net-p2p/monero", notes: "Compile from source" },
  ];

  TableRenderer.render(
    packageCommands,
    [
      { key: "distro", label: "Distribution", width: 18 },
      { key: "command", label: "Command", width: 46 },
      { key: "notes", label: "Notes", width: 24 },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      "⚠️  Package manager versions may be outdated",
      "⚠️  Official binaries are recommended for latest security patches",
      "✓  Easier to install, automatic updates via system",
    ],
    {
      title: "Package Manager Trade-offs",
      style: "single",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 8. WALLET CREATION WORKFLOW
  // ===========================================================================
  console.log(ColorSystem.colorize("  WALLET CREATION WORKFLOW", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────", ColorSystem.codes.dim));
  console.log("");

  guideLogger.info("Starting wallet creation demonstration");

  const walletSpinner = new Spinner({ message: "Initializing wallet creation process..." });
  walletSpinner.start();
  await sleep(1500);
  walletSpinner.succeed("Wallet creation tool ready");
  console.log("");

  BoxRenderer.render(
    [
      "Step 1: Launch monero-wallet-cli",
      "$ monero-wallet-cli",
      "",
      "Step 2: Choose wallet name",
      "Wallet file name: my-monero-wallet",
      "",
      "Step 3: Choose password",
      "Enter password: ****************** (use strong, unique password)",
      "Confirm password: ******************",
      "",
      "Step 4: Choose language for mnemonic seed",
      "Language: English (or preferred language)",
    ],
    {
      title: "Creating New Wallet",
      style: "double",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    },
  );
  console.log("");

  // Simulate wallet creation progress
  console.log(ColorSystem.colorize("  Generating cryptographic keys...", ColorSystem.codes.brightCyan));
  const keygenProgress = new ProgressBar({
    total: 100,
    width: 60,
    colorize: true,
    showValue: true,
    label: "Key Generation",
  });

  for (let i = 0; i <= 100; i += 20) {
    keygenProgress.update(i);
    await sleep(300);
  }
  keygenProgress.complete();
  console.log("");

  // ===========================================================================
  // 9. MNEMONIC SEED - CRITICAL BACKUP
  // ===========================================================================
  console.log(ColorSystem.colorize("  🔑 MNEMONIC SEED - YOUR WALLET BACKUP", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      "⚠️  CRITICAL: Your 25-word mnemonic seed is the ONLY way to recover your wallet",
      "",
      "Example seed (DO NOT USE THIS - IT'S AN EXAMPLE):",
      "───────────────────────────────────────────────────────────────",
      "veteran puck utmost duties aptitude rugby ammo ultimate nabbing",
      "toffee stellar dexterity acquire asylum feline soprano egotistic",
      "point vibrate orbit sizes nephew waist acquire",
      "───────────────────────────────────────────────────────────────",
      "",
      "✓ Write it down on paper (never digitally)",
      "✓ Store in multiple secure locations (fireproof safe, bank deposit box)",
      "✓ Never share with anyone",
      "✓ Never enter it on any website or app (only official wallet software)",
      "✓ Consider metal backup plates for durability",
    ],
    {
      title: "🔴 CRITICAL: Backup Your Seed NOW",
      style: "double",
      color: ColorSystem.codes.brightRed,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  const backupConfirm = await InteractivePrompts.confirm(
    "Have you securely written down your 25-word mnemonic seed?",
    false,
  );

  if (!backupConfirm) {
    BoxRenderer.render(
      [
        "❌ DO NOT PROCEED until you have backed up your seed phrase!",
        "",
        "Without the seed, you CANNOT recover your wallet if:",
        "• Your computer crashes or is stolen",
        "• You forget your password",
        "• Your hard drive fails",
        "• The wallet file becomes corrupted",
        "",
        "This is NOT optional - it's your ONLY backup method!",
      ],
      {
        title: "⛔ BACKUP REQUIRED",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      },
    );
    console.log("");
    guideLogger.warning("User has not confirmed seed backup - guide paused");
    console.log(ColorSystem.colorize("\n  Please backup your seed before continuing!\n", ColorSystem.codes.brightRed));
    Deno.exit(0);
  }

  guideLogger.success("User confirmed seed backup");
  console.log("");

  // ===========================================================================
  // 10. WALLET ADDRESSES
  // ===========================================================================
  console.log(ColorSystem.colorize("  WALLET ADDRESSES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────", ColorSystem.codes.dim));
  console.log("");

  const addressTypes = [
    {
      type: "Primary Address",
      format: "4... (95 chars)",
      usage: "Main receiving address",
      privacy: "Standard",
      example: "4AdUndXHHZ6cfufTMvppY6JwXNou...",
    },
    {
      type: "Integrated Address",
      format: "8... (106 chars)",
      usage: "Includes payment ID",
      privacy: "Standard",
      example: "8BHq5FXcaYqH9GzrTmWNKhC...",
    },
    {
      type: "Subaddress",
      format: "8... (95 chars)",
      usage: "Better privacy per transaction",
      privacy: "Enhanced",
      example: "8AYdLnQvvVy9JhGAKG9Qv...",
    },
  ];

  TableRenderer.render(
    addressTypes,
    [
      { key: "type", label: "Address Type", width: 20 },
      { key: "format", label: "Format", width: 16 },
      { key: "usage", label: "Usage", width: 26 },
      { key: "privacy", label: "Privacy", width: 12 },
      { key: "example", label: "Example", width: 32 },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      "View your primary address: type 'address' in wallet CLI",
      "Generate subaddress: type 'address new' for enhanced privacy",
      "List all subaddresses: type 'address all'",
      "",
      "💡 TIP: Use different subaddresses for different purposes (exchanges, donations, etc.)",
    ],
    {
      title: "Address Management",
      style: "rounded",
      color: ColorSystem.codes.brightCyan,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 11. BLOCKCHAIN SYNCHRONIZATION
  // ===========================================================================
  console.log(ColorSystem.colorize("  BLOCKCHAIN SYNCHRONIZATION", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      "Two Options for Running Monero Wallet:",
      "",
      "1. FULL NODE (Recommended for Privacy & Network Health)",
      "   • Download entire blockchain (~150GB)",
      "   • Verify all transactions yourself",
      "   • Support Monero network",
      "   • Command: monerod (run daemon first, then wallet)",
      "",
      "2. REMOTE NODE (Lightweight Option)",
      "   • Connect to someone else's node",
      "   • No blockchain download",
      "   • Less privacy (node can see your IP)",
      "   • Command: monero-wallet-cli --daemon-address node.moneroworld.com:18089",
    ],
    {
      title: "Sync Options",
      style: "double",
      color: ColorSystem.codes.brightYellow,
      padding: 1,
    },
  );
  console.log("");

  // Simulate blockchain sync
  console.log(ColorSystem.colorize("  Simulating blockchain synchronization...", ColorSystem.codes.brightCyan));
  console.log("");

  const syncProgress = new ProgressBar({
    total: 100,
    width: 70,
    colorize: true,
    showValue: true,
    label: "Blockchain Sync",
  });

  const syncStages = [
    "Connecting to peers...",
    "Downloading blocks...",
    "Verifying transactions...",
    "Updating wallet...",
    "Sync complete!",
  ];

  for (let i = 0; i <= 100; i += 5) {
    syncProgress.update(i);
    if (i % 20 === 0 && i < 100) {
      const stageIndex = Math.floor(i / 20);
      console.log(`  ${ColorSystem.colorize(syncStages[stageIndex], ColorSystem.codes.dim)}`);
    }
    await sleep(100);
  }
  syncProgress.complete();
  console.log(ColorSystem.colorize(`  ${syncStages[4]}`, ColorSystem.codes.brightGreen));
  console.log("");

  const syncStats = [
    { metric: "Blockchain Height", value: "3,056,234 blocks" },
    { metric: "Time to Sync", value: "24-72 hours (initial)" },
    { metric: "Data Downloaded", value: "~150 GB" },
    { metric: "Network Peers", value: "42 connected" },
    { metric: "Sync Status", value: "✓ Synchronized" },
  ];

  TableRenderer.renderKeyValue(syncStats);
  console.log("");

  // ===========================================================================
  // 12. BASIC WALLET OPERATIONS
  // ===========================================================================
  console.log(ColorSystem.colorize("  BASIC WALLET OPERATIONS", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const walletCommands = [
    { command: "balance", description: "Check your wallet balance (available + locked)", example: "balance" },
    { command: "address", description: "Display your primary receiving address", example: "address" },
    { command: "address new", description: "Generate new subaddress for privacy", example: "address new [label]" },
    { command: "transfer", description: "Send XMR to another address", example: "transfer <address> <amount>" },
    { command: "show_transfers", description: "View transaction history", example: "show_transfers" },
    { command: "seed", description: "Display your 25-word recovery seed", example: "seed (SECURE LOCATION!)" },
    { command: "refresh", description: "Refresh wallet and check for new transactions", example: "refresh" },
    { command: "exit", description: "Save and close wallet safely", example: "exit" },
  ];

  TableRenderer.render(
    walletCommands,
    [
      { key: "command", label: "Command", width: 16 },
      { key: "description", label: "Description", width: 42 },
      { key: "example", label: "Usage Example", width: 32 },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 13. SENDING TRANSACTIONS
  // ===========================================================================
  console.log(ColorSystem.colorize("  SENDING MONERO (XMR)", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────", ColorSystem.codes.dim));
  console.log("");

  BoxRenderer.render(
    [
      "Transaction Command Format:",
      "$ transfer <address> <amount> [payment_id] [priority]",
      "",
      "Example Transaction:",
      "$ transfer 4AdUndXHHZ6cfufTMvppY6JwXNo... 0.5",
      "",
      "Priority Levels:",
      "• default (normal) - Balanced fee and speed",
      "• unimportant - Lower fee, slower confirmation",
      "• elevated - Higher fee, faster confirmation",
      "• priority - Highest fee, fastest confirmation",
      "",
      "⚠️  ALWAYS double-check the address before sending!",
      "⚠️  Monero transactions are IRREVERSIBLE",
    ],
    {
      title: "Sending XMR",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
    },
  );
  console.log("");

  // Transaction fee comparison
  const feeComparison = [
    { priority: "Unimportant", avgFee: "0.00005 XMR", confirmTime: "~20 min", usdEquiv: "$0.008" },
    { priority: "Normal", avgFee: "0.00015 XMR", confirmTime: "~4 min", usdEquiv: "$0.024" },
    { priority: "Elevated", avgFee: "0.00030 XMR", confirmTime: "~2 min", usdEquiv: "$0.048" },
    { priority: "Priority", avgFee: "0.00060 XMR", confirmTime: "~1 min", usdEquiv: "$0.096" },
  ];

  TableRenderer.render(
    feeComparison,
    [
      { key: "priority", label: "Priority", width: 14 },
      { key: "avgFee", label: "Avg Fee (XMR)", width: 16, align: "right" },
      { key: "confirmTime", label: "Confirm Time", width: 14, align: "center" },
      { key: "usdEquiv", label: "USD Equiv", width: 12, align: "right" },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 14. SECURITY BEST PRACTICES
  // ===========================================================================
  console.log(ColorSystem.colorize("  🔒 SECURITY BEST PRACTICES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const securityPractices = [
    {
      category: "Seed Storage",
      practice: "Write seed on paper, store in fireproof safe or bank deposit box",
      importance: "CRITICAL",
      impact: "Loss = Lost funds forever",
    },
    {
      category: "Password",
      practice: "Use strong, unique password (20+ chars, mixed case, numbers, symbols)",
      importance: "CRITICAL",
      impact: "Weak password = Stolen funds",
    },
    {
      category: "Wallet Files",
      practice: "Encrypt wallet files, backup to multiple locations",
      importance: "HIGH",
      impact: "File loss = Recovery via seed",
    },
    {
      category: "Updates",
      practice: "Keep wallet software updated to latest version",
      importance: "HIGH",
      impact: "Security patches, bug fixes",
    },
    {
      category: "Network",
      practice: "Use VPN or Tor for enhanced privacy",
      importance: "MEDIUM",
      impact: "Hides your IP from nodes",
    },
    {
      category: "Phishing",
      practice: "Only download from getmonero.org, verify checksums",
      importance: "CRITICAL",
      impact: "Fake wallets steal your XMR",
    },
    {
      category: "Cold Storage",
      practice: "For large amounts, use offline/cold wallet",
      importance: "HIGH",
      impact: "Maximum security",
    },
    {
      category: "Subaddresses",
      practice: "Use different subaddresses for different purposes",
      importance: "MEDIUM",
      impact: "Better privacy tracking",
    },
  ];

  TableRenderer.render(
    securityPractices,
    [
      {
        key: "importance",
        label: "Priority",
        width: 10,
        formatter: (v) => {
          if (v === "CRITICAL") return `${ColorSystem.codes.brightRed}${v}${ColorSystem.codes.reset}`;
          if (v === "HIGH") return `${ColorSystem.codes.brightYellow}${v}${ColorSystem.codes.reset}`;
          return v;
        },
      },
      { key: "category", label: "Category", width: 14 },
      { key: "practice", label: "Best Practice", width: 48 },
      { key: "impact", label: "Impact", width: 26 },
    ],
    { showIndex: true },
  );
  console.log("");

  BoxRenderer.render(
    [
      "🔴 NEVER store your seed digitally (no photos, no cloud, no text files)",
      "🔴 NEVER share your seed with anyone (support, exchanges, friends)",
      "🔴 NEVER enter seed on websites (only in official wallet software)",
      "🟡 ALWAYS verify addresses character by character before sending",
      "🟡 ALWAYS use strong, unique passwords for each wallet",
      "🟢 DO backup wallet files AND seed phrase",
      "🟢 DO keep software updated to latest version",
      "🟢 DO test recovery process with small amounts first",
    ],
    {
      title: "⚠️  Critical Security Rules",
      style: "double",
      color: ColorSystem.codes.brightRed,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 15. BACKUP PROCEDURES
  // ===========================================================================
  console.log(ColorSystem.colorize("  BACKUP PROCEDURES", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────", ColorSystem.codes.dim));
  console.log("");

  const backupProcedures = [
    { method: "Mnemonic Seed", location: "Paper in safe", frequency: "Once (at creation)", priority: 1, recovery: "Full wallet restoration" },
    { method: "Wallet Files", location: "Encrypted USB + Cloud", frequency: "Weekly", priority: 2, recovery: "Faster access with password" },
    { method: "Private Keys", location: "Separate paper backup", frequency: "Once", priority: 3, recovery: "Advanced recovery option" },
    { method: "Addresses List", location: "Encrypted document", frequency: "When creating new", priority: 4, recovery: "Track subaddresses" },
  ];

  TableRenderer.render(
    backupProcedures,
    [
      { key: "priority", label: "#", width: 4, align: "center" },
      { key: "method", label: "Backup Method", width: 18 },
      { key: "location", label: "Storage Location", width: 24 },
      { key: "frequency", label: "Backup Frequency", width: 20 },
      { key: "recovery", label: "Recovery Purpose", width: 28 },
    ],
    { showIndex: false },
  );
  console.log("");

  // Backup verification simulation
  const backupSpinner = new Spinner({ message: "Verifying backup procedures..." });
  backupSpinner.start();
  await sleep(1200);
  backupSpinner.succeed("Backup checklist verified");
  console.log("");

  // ===========================================================================
  // 16. COMMON ISSUES & TROUBLESHOOTING
  // ===========================================================================
  console.log(ColorSystem.colorize("  COMMON ISSUES & TROUBLESHOOTING", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const troubleshooting = [
    {
      issue: "Wallet won't sync",
      solution: "Check internet connection, try different remote node, or wait for monerod to sync",
      severity: "Medium",
    },
    {
      issue: "Forgot password",
      solution: "Restore wallet from 25-word seed phrase (this is why seed backup is critical!)",
      severity: "High",
    },
    {
      issue: "Balance shows 0",
      solution: "Wallet still syncing, use 'refresh' command or wait for full sync",
      severity: "Low",
    },
    {
      issue: "Transaction pending",
      solution: "Wait for confirmations (~2 min per block), check mempool status",
      severity: "Low",
    },
    {
      issue: "Corrupted wallet file",
      solution: "Restore from seed phrase into new wallet file",
      severity: "High",
    },
    {
      issue: "Can't connect to daemon",
      solution: "Ensure monerod is running, check firewall settings, or use remote node",
      severity: "Medium",
    },
  ];

  TableRenderer.render(
    troubleshooting,
    [
      {
        key: "severity",
        label: "Severity",
        width: 10,
        formatter: (v) => {
          if (v === "High") return `${ColorSystem.codes.brightRed}${v}${ColorSystem.codes.reset}`;
          if (v === "Medium") return `${ColorSystem.codes.brightYellow}${v}${ColorSystem.codes.reset}`;
          return `${ColorSystem.codes.brightGreen}${v}${ColorSystem.codes.reset}`;
        },
      },
      { key: "issue", label: "Common Issue", width: 24 },
      { key: "solution", label: "Solution", width: 58 },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 17. RESOURCES & COMMUNITY
  // ===========================================================================
  console.log(ColorSystem.colorize("  RESOURCES & COMMUNITY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────", ColorSystem.codes.dim));
  console.log("");

  const resources = [
    { resource: "Official Website", url: "getmonero.org", description: "Downloads, documentation, guides" },
    { resource: "Reddit Community", url: "reddit.com/r/Monero", description: "Active community support" },
    { resource: "Monero Stack Exchange", url: "monero.stackexchange.com", description: "Technical Q&A" },
    { resource: "GitHub Repository", url: "github.com/monero-project/monero", description: "Source code, issues, PRs" },
    { resource: "Moneropedia", url: "getmonero.org/resources/moneropedia", description: "Monero terminology guide" },
    { resource: "User Guides", url: "getmonero.org/resources/user-guides", description: "Step-by-step tutorials" },
  ];

  TableRenderer.render(
    resources,
    [
      { key: "resource", label: "Resource", width: 24 },
      { key: "url", label: "URL", width: 36 },
      { key: "description", label: "Description", width: 32 },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 18. SETUP COMPLETION SUMMARY
  // ===========================================================================
  console.log(ColorSystem.colorize("  SETUP COMPLETION SUMMARY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const completionChecklist = [
    { task: "System requirements verified", status: "✓ Complete" },
    { task: "Monero CLI wallet installed", status: "✓ Complete" },
    { task: "Wallet created with password", status: "✓ Complete" },
    { task: "25-word seed backed up securely", status: "⚠️  User responsibility" },
    { task: "Blockchain synced (or remote node)", status: "⏳ In progress" },
    { task: "Primary address obtained", status: "✓ Complete" },
    { task: "Security practices reviewed", status: "✓ Complete" },
    { task: "Backup procedures documented", status: "✓ Complete" },
  ];

  TableRenderer.render(
    completionChecklist,
    [
      { key: "task", label: "Task", width: 42 },
      { key: "status", label: "Status", width: 24 },
    ],
    { showIndex: true },
  );
  console.log("");

  BoxRenderer.render(
    [
      "🎉 Congratulations! You've completed the Monero CLI wallet setup guide.",
      "",
      "Next Steps:",
      "1. ✓ Ensure your seed phrase is securely backed up (paper + safe)",
      "2. ⏳ Wait for blockchain to fully sync (if running full node)",
      "3. 💰 Get your first XMR from an exchange or P2P",
      "4. 🔒 Practice sending small amounts to test",
      "5. 📚 Join the community and keep learning",
      "",
      "Remember: Privacy is your right. Monero is your tool. 🔐",
    ],
    {
      title: "✅ Setup Complete",
      style: "double",
      color: ColorSystem.codes.brightGreen,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  guideLogger.success("Monero wallet setup guide completed successfully", {
    sectionsComplete: 18,
    securityWarnings: 5,
    checklistItems: completionChecklist.length,
  });

  console.log(ColorSystem.colorize("\n  Thank you for choosing Monero. Privacy matters! 🔒\n", ColorSystem.codes.brightMagenta));
};

await runGuide();
