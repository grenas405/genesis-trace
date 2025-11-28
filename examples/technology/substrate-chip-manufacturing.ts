#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Substrate Chip Manufacturing Simulation
 *
 * A demonstration of how Substrate, Inc. - the Peter Thiel-backed semiconductor
 * startup challenging ASML and TSMC - might use GenesisTrace for their revolutionary
 * X-ray lithography chip manufacturing process.
 *
 * Substrate uses proprietary particle accelerators as light sources for X-ray-based
 * lithography, achieving similar resolutions to ASML's $400M EUV machines at half the cost.
 *
 * Features demonstrated:
 *   - Particle accelerator operations monitoring
 *   - X-ray lithography process tracking
 *   - Wafer fabrication pipeline stages
 *   - Quality control and yield metrics
 *   - Real-time cleanroom telemetry
 *   - Production dashboard visualization
 *
 * @author Substrate, Inc. (Simulation)
 * @since 2025
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  draculaTheme,
  FileLoggerPlugin,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

interface WaferBatch {
  id: string;
  diameter: number; // mm
  material: string;
  targetNode: string; // e.g., "3nm", "5nm"
  quantity: number;
  status: "queued" | "processing" | "completed" | "failed";
}

interface AcceleratorTelemetry {
  beamCurrent: number; // mA
  beamEnergy: number; // MeV
  vacuumPressure: number; // torr
  temperature: number; // K
  magnetAlignment: number; // %
  xrayIntensity: number; // photons/s
}

interface LithographyMetrics {
  resolution: number; // nm
  alignmentAccuracy: number; // nm
  defectDensity: number; // defects/cm^2
  throughput: number; // wafers/hour
  criticalDimension: number; // nm
  overlayAccuracy: number; // nm
}

interface FabricationStats {
  wafersProcessed: number;
  yield: number;
  defectRate: number;
  cycleTime: number; // hours
  particleCount: number; // per cubic foot
  uptime: number; // %
}

// =============================================================================
// SUBSTRATE CHIP FABRICATION SYSTEM
// =============================================================================

class SubstrateFabSystem {
  private logger: Logger;
  private acceleratorLogger: Logger;
  private lithographyLogger: Logger;
  private qualityLogger: Logger;
  private stats: FabricationStats;

  constructor() {
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("debug")
        .enableHistory(true)
        .plugin(new FileLoggerPlugin({ filepath: "./logs/substrate-fab.log" }))
        .build(),
    );

    this.acceleratorLogger = this.logger.child("accelerator");
    this.lithographyLogger = this.logger.child("lithography");
    this.qualityLogger = this.logger.child("quality");

    this.stats = {
      wafersProcessed: 0,
      yield: 0,
      defectRate: 0,
      cycleTime: 0,
      particleCount: 0,
      uptime: 0,
    };
  }

  // ---------------------------------------------------------------------------
  // PARTICLE ACCELERATOR OPERATIONS
  // ---------------------------------------------------------------------------

  async initializeAccelerator(): Promise<AcceleratorTelemetry> {
    console.log(ColorSystem.colorize("\nPARTICLE ACCELERATOR INITIALIZATION", ColorSystem.codes.bright));
    console.log("");

    const spinner = new Spinner({ message: "Evacuating beam chamber..." });
    spinner.start();

    // Vacuum pump sequence
    await sleep(800);
    spinner.update("Achieving ultra-high vacuum (10^-11 torr)...");
    await sleep(600);
    spinner.update("Initializing superconducting magnets...");
    await sleep(700);
    spinner.update("Cooling magnet assemblies to 4.2K...");
    await sleep(900);
    spinner.update("Aligning electron injection system...");
    await sleep(500);
    spinner.succeed("Particle accelerator online");

    const telemetry: AcceleratorTelemetry = {
      beamCurrent: 245.8,
      beamEnergy: 3.2,
      vacuumPressure: 1.2e-11,
      temperature: 4.2,
      magnetAlignment: 99.97,
      xrayIntensity: 2.4e18,
    };

    this.acceleratorLogger.success("Accelerator initialization complete", {
      beamCurrent: `${telemetry.beamCurrent} mA`,
      beamEnergy: `${telemetry.beamEnergy} GeV`,
      xrayIntensity: `${telemetry.xrayIntensity.toExponential(2)} photons/s`,
    });

    // Display accelerator telemetry
    console.log("");
    TableRenderer.renderKeyValue([
      { label: "Beam Current", value: `${telemetry.beamCurrent} mA` },
      { label: "Beam Energy", value: `${telemetry.beamEnergy} GeV` },
      { label: "Vacuum Pressure", value: `${telemetry.vacuumPressure.toExponential(2)} torr` },
      { label: "Magnet Temperature", value: `${telemetry.temperature} K` },
      { label: "Magnet Alignment", value: `${telemetry.magnetAlignment}%` },
      { label: "X-ray Intensity", value: `${telemetry.xrayIntensity.toExponential(2)} photons/s` },
    ]);

    return telemetry;
  }

  // ---------------------------------------------------------------------------
  // X-RAY LITHOGRAPHY PROCESS
  // ---------------------------------------------------------------------------

  async runLithographySequence(batch: WaferBatch): Promise<LithographyMetrics> {
    console.log(ColorSystem.colorize("\nX-RAY LITHOGRAPHY SEQUENCE", ColorSystem.codes.bright));
    console.log("");

    this.lithographyLogger.info("Starting lithography for batch", {
      batchId: batch.id,
      targetNode: batch.targetNode,
      wafers: batch.quantity,
    });

    const stages = [
      { name: "Photoresist Coating", duration: 400 },
      { name: "Soft Bake (90C)", duration: 350 },
      { name: "Mask Alignment", duration: 600 },
      { name: "X-ray Exposure", duration: 800 },
      { name: "Post-Exposure Bake", duration: 300 },
      { name: "Development", duration: 450 },
      { name: "Hard Bake (120C)", duration: 400 },
      { name: "Metrology Inspection", duration: 500 },
    ];

    const totalSteps = stages.length * batch.quantity;
    const progress = new ProgressBar({
      total: totalSteps,
      width: 50,
      showValue: true,
      colorize: true,
    });

    let currentStep = 0;

    for (let wafer = 0; wafer < batch.quantity; wafer++) {
      for (const stage of stages) {
        progress.update(currentStep + 1, `Wafer ${wafer + 1}/${batch.quantity}: ${stage.name}`);
        await sleep(stage.duration / 10); // Accelerated for demo

        if (stage.name === "Mask Alignment") {
          this.lithographyLogger.debug("Alignment achieved", {
            wafer: wafer + 1,
            overlayError: `${(Math.random() * 0.8 + 0.1).toFixed(2)} nm`,
          });
        }

        if (stage.name === "X-ray Exposure") {
          this.lithographyLogger.debug("Exposure complete", {
            wafer: wafer + 1,
            dose: `${(Math.random() * 10 + 45).toFixed(1)} mJ/cm^2`,
            focus: `${(Math.random() * 2 - 1).toFixed(2)} nm`,
          });
        }

        currentStep++;
      }

      this.stats.wafersProcessed++;
    }

    progress.complete();

    const metrics: LithographyMetrics = {
      resolution: 3.0 + Math.random() * 0.5,
      alignmentAccuracy: 0.15 + Math.random() * 0.1,
      defectDensity: 0.05 + Math.random() * 0.03,
      throughput: 18 + Math.random() * 4,
      criticalDimension: 3.0 + Math.random() * 0.2,
      overlayAccuracy: 0.8 + Math.random() * 0.3,
    };

    this.lithographyLogger.success("Lithography sequence complete", {
      batchId: batch.id,
      resolution: `${metrics.resolution.toFixed(2)} nm`,
      yield: "98.2%",
    });

    return metrics;
  }

  // ---------------------------------------------------------------------------
  // WAFER FABRICATION PIPELINE
  // ---------------------------------------------------------------------------

  async runFabricationPipeline(batches: WaferBatch[]): Promise<void> {
    console.log(ColorSystem.colorize("\nWAFER FABRICATION PIPELINE", ColorSystem.codes.bright));
    console.log("");

    // Display batch queue
    TableRenderer.render(
      batches.map((b) => ({
        id: b.id,
        diameter: `${b.diameter}mm`,
        material: b.material,
        node: b.targetNode,
        quantity: b.quantity,
        status: b.status,
      })),
      [
        { key: "id", label: "Batch ID", width: 14 },
        { key: "diameter", label: "Diameter", width: 10, align: "center" },
        { key: "material", label: "Material", width: 12 },
        { key: "node", label: "Node", width: 8, align: "center" },
        { key: "quantity", label: "Qty", width: 6, align: "right" },
        { key: "status", label: "Status", width: 12, align: "center" },
      ],
      { showIndex: true },
    );

    console.log("");

    const fabricationStages = [
      "Wafer Cleaning",
      "Oxide Deposition",
      "X-ray Lithography",
      "Etching",
      "Ion Implantation",
      "Metallization",
      "Chemical-Mechanical Polish",
      "Final Inspection",
    ];

    for (const batch of batches) {
      batch.status = "processing";

      BoxRenderer.render(
        [
          `Processing Batch: ${batch.id}`,
          "",
          `Target Node: ${batch.targetNode}`,
          `Wafer Count: ${batch.quantity}`,
          `Material: ${batch.material} (${batch.diameter}mm)`,
        ],
        {
          style: "rounded",
          color: ColorSystem.codes.brightCyan,
          padding: 1,
        },
      );

      console.log("");

      for (let i = 0; i < fabricationStages.length; i++) {
        const stage = fabricationStages[i];
        const spinner = new Spinner({ message: `${stage}...` });
        spinner.start();
        await sleep(300 + Math.random() * 200);

        // Simulate occasional warnings
        if (Math.random() < 0.15) {
          this.logger.warning(`Minor deviation in ${stage}`, {
            batch: batch.id,
            deviation: `${(Math.random() * 2).toFixed(2)}%`,
          });
        }

        spinner.succeed(`${stage} complete`);
      }

      batch.status = "completed";
      console.log("");
    }
  }

  // ---------------------------------------------------------------------------
  // QUALITY CONTROL & YIELD ANALYSIS
  // ---------------------------------------------------------------------------

  displayQualityMetrics(metrics: LithographyMetrics): void {
    console.log(ColorSystem.colorize("\nQUALITY CONTROL METRICS", ColorSystem.codes.bright));
    console.log("");

    const qualityData = [
      {
        metric: "Resolution",
        target: "3.0 nm",
        actual: `${metrics.resolution.toFixed(2)} nm`,
        status: metrics.resolution <= 3.5 ? "PASS" : "FAIL",
      },
      {
        metric: "Alignment Accuracy",
        target: "< 0.25 nm",
        actual: `${metrics.alignmentAccuracy.toFixed(3)} nm`,
        status: metrics.alignmentAccuracy < 0.25 ? "PASS" : "FAIL",
      },
      {
        metric: "Defect Density",
        target: "< 0.1/cm^2",
        actual: `${metrics.defectDensity.toFixed(3)}/cm^2`,
        status: metrics.defectDensity < 0.1 ? "PASS" : "FAIL",
      },
      {
        metric: "Throughput",
        target: "> 15 wph",
        actual: `${metrics.throughput.toFixed(1)} wph`,
        status: metrics.throughput > 15 ? "PASS" : "FAIL",
      },
      {
        metric: "Critical Dimension",
        target: "3.0 nm +/- 5%",
        actual: `${metrics.criticalDimension.toFixed(2)} nm`,
        status: Math.abs(metrics.criticalDimension - 3.0) / 3.0 < 0.05 ? "PASS" : "WARN",
      },
      {
        metric: "Overlay Accuracy",
        target: "< 1.0 nm",
        actual: `${metrics.overlayAccuracy.toFixed(2)} nm`,
        status: metrics.overlayAccuracy < 1.0 ? "PASS" : "WARN",
      },
    ];

    TableRenderer.render(
      qualityData,
      [
        { key: "metric", label: "Metric", width: 20 },
        { key: "target", label: "Target", width: 14, align: "center" },
        { key: "actual", label: "Actual", width: 14, align: "center" },
        {
          key: "status",
          label: "Status",
          width: 10,
          align: "center",
          formatter: (v) =>
            v === "PASS"
              ? ColorSystem.colorize(v, ColorSystem.codes.brightGreen)
              : v === "WARN"
              ? ColorSystem.colorize(v, ColorSystem.codes.brightYellow)
              : ColorSystem.colorize(v, ColorSystem.codes.brightRed),
        },
      ],
      { showIndex: false },
    );

    console.log("");

    // Yield breakdown chart
    const yieldData = [
      { label: "Good Dies", value: 94.2 },
      { label: "Edge Defects", value: 2.8 },
      { label: "Pattern Defects", value: 1.5 },
      { label: "Particle Contamination", value: 0.9 },
      { label: "Other", value: 0.6 },
    ];

    console.log(ColorSystem.colorize("Yield Breakdown (%)", ColorSystem.codes.dim));
    ChartRenderer.barChart(yieldData, {
      showValues: true,
      width: 40,
      color: ColorSystem.codes.brightGreen,
    });
  }

  // ---------------------------------------------------------------------------
  // CLEANROOM TELEMETRY
  // ---------------------------------------------------------------------------

  displayCleanroomStatus(): void {
    console.log(ColorSystem.colorize("\nCLEANROOM TELEMETRY", ColorSystem.codes.bright));
    console.log("");

    const particleCounts = [12, 14, 11, 13, 15, 12, 10, 11, 13, 14, 12, 11];
    const temperature = [22.1, 22.0, 22.1, 22.0, 21.9, 22.0, 22.1, 22.0, 22.1, 22.0, 21.9, 22.0];
    const humidity = [45.2, 45.0, 44.8, 45.1, 45.3, 45.0, 44.9, 45.1, 45.2, 45.0, 44.8, 45.1];

    console.log(
      `${ColorSystem.codes.brightBlue}Particle Count (0.1um):${ColorSystem.codes.reset} ${
        ChartRenderer.sparkline(particleCounts)
      }  [ISO Class 1]`,
    );
    console.log(
      `${ColorSystem.codes.brightBlue}Temperature (C):${ColorSystem.codes.reset}       ${
        ChartRenderer.sparkline(temperature.map((t) => t * 10))
      }  [22.0 +/- 0.1]`,
    );
    console.log(
      `${ColorSystem.codes.brightBlue}Humidity (% RH):${ColorSystem.codes.reset}        ${
        ChartRenderer.sparkline(humidity.map((h) => h * 10))
      }  [45.0 +/- 0.5]`,
    );

    console.log("");

    BoxRenderer.render(
      [
        "Cleanroom Status: OPTIMAL",
        "",
        `ISO Class: 1 (< 10 particles/m^3 @ 0.1um)`,
        `Pressure: +15 Pa (positive cascade)`,
        `Air Changes: 600/hour`,
        `Vibration: < 0.5 um/s RMS`,
      ],
      {
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
        title: "FAB-1 Environment",
      },
    );
  }

  // ---------------------------------------------------------------------------
  // PRODUCTION DASHBOARD
  // ---------------------------------------------------------------------------

  displayProductionDashboard(): void {
    console.log(ColorSystem.colorize("\nPRODUCTION DASHBOARD", ColorSystem.codes.bright));
    console.log("");

    // Daily production metrics
    const dailyProduction = [
      { shift: "Night (00:00-08:00)", wafers: 142, yield: 97.8, uptime: 99.2 },
      { shift: "Morning (08:00-16:00)", wafers: 156, yield: 98.1, uptime: 99.5 },
      { shift: "Evening (16:00-24:00)", wafers: 148, yield: 97.5, uptime: 98.8 },
    ];

    TableRenderer.render(
      dailyProduction.map((s) => ({
        shift: s.shift,
        wafers: Formatter.number(s.wafers),
        yield: `${s.yield}%`,
        uptime: `${s.uptime}%`,
      })),
      [
        { key: "shift", label: "Shift", width: 24 },
        { key: "wafers", label: "Wafers Out", width: 12, align: "right" },
        { key: "yield", label: "Yield", width: 10, align: "center" },
        { key: "uptime", label: "Uptime", width: 10, align: "center" },
      ],
      { showIndex: false },
    );

    console.log("");

    // Tool utilization chart
    const toolUtilization = [
      { label: "Accelerator #1", value: 94 },
      { label: "Accelerator #2", value: 91 },
      { label: "Lithography #1", value: 88 },
      { label: "Lithography #2", value: 92 },
      { label: "Metrology", value: 78 },
      { label: "Deposition", value: 85 },
    ];

    console.log(ColorSystem.colorize("Tool Utilization (%)", ColorSystem.codes.dim));
    ChartRenderer.barChart(toolUtilization, {
      showValues: true,
      width: 35,
      color: ColorSystem.codes.brightCyan,
    });
  }

  // ---------------------------------------------------------------------------
  // COMPETITIVE ANALYSIS
  // ---------------------------------------------------------------------------

  displayCompetitiveAdvantage(): void {
    console.log(ColorSystem.colorize("\nSUBSTRATE vs. ASML COMPARISON", ColorSystem.codes.bright));
    console.log("");

    const comparison = [
      { metric: "System Cost", substrate: "$200M", asml: "$400M", advantage: "50% lower" },
      { metric: "Resolution", substrate: "3nm", asml: "3nm", advantage: "Parity" },
      { metric: "Throughput", substrate: "20 wph", asml: "18 wph", advantage: "11% higher" },
      { metric: "Footprint", substrate: "800 m^2", asml: "1200 m^2", advantage: "33% smaller" },
      { metric: "Power Consumption", substrate: "1.2 MW", asml: "1.8 MW", advantage: "33% lower" },
      { metric: "Lead Time", substrate: "12 months", asml: "24 months", advantage: "50% faster" },
    ];

    TableRenderer.render(
      comparison,
      [
        { key: "metric", label: "Metric", width: 18 },
        { key: "substrate", label: "Substrate", width: 12, align: "center" },
        { key: "asml", label: "ASML EUV", width: 12, align: "center" },
        {
          key: "advantage",
          label: "Advantage",
          width: 14,
          align: "center",
          formatter: (v) =>
            v === "Parity"
              ? ColorSystem.colorize(v, ColorSystem.codes.yellow)
              : ColorSystem.colorize(v, ColorSystem.codes.brightGreen),
        },
      ],
      { showIndex: false },
    );

    console.log("");

    BoxRenderer.render(
      [
        "Substrate's X-ray lithography technology enables:",
        "",
        "  - Domestic chip production on American soil",
        "  - Reduced dependence on East Asian supply chains",
        "  - Lower barriers to entry for new fab facilities",
        "  - Strategic national security advantages",
        "",
        "Target: First chips by 2028",
      ],
      {
        style: "double",
        color: ColorSystem.codes.brightMagenta,
        padding: 1,
        title: "Strategic Impact",
      },
    );
  }

  // ---------------------------------------------------------------------------
  // MAIN EXECUTION
  // ---------------------------------------------------------------------------

  async run(): Promise<void> {
    console.clear();
    console.log("\n");

    // Mission banner
    BannerRenderer.render({
      title: "SUBSTRATE CHIP MANUFACTURING",
      subtitle: "X-ray Lithography Fabrication System",
      description: "Revolutionary semiconductor production powered by particle accelerators",
      version: "v2028-alpha",
      author: "Substrate, Inc. | San Francisco, CA",
      width: 90,
      color: ColorSystem.codes.brightCyan,
    });

    console.log("");

    BoxRenderer.render(
      [
        "Substrate is building the future of American chipmaking.",
        "",
        "Founded by James and Oliver Proud, backed by:",
        "  - Founders Fund (Peter Thiel)",
        "  - In-Q-Tel (U.S. Intelligence)",
        "  - General Catalyst",
        "",
        `Valuation: $1B | Funding: $100M`,
      ],
      {
        style: "rounded",
        color: ColorSystem.codes.brightYellow,
        padding: 1,
        title: "About Substrate",
      },
    );

    // Initialize systems
    const telemetry = await this.initializeAccelerator();

    // Prepare wafer batches
    const batches: WaferBatch[] = [
      { id: "SUB-2025-001", diameter: 300, material: "Silicon", targetNode: "3nm", quantity: 25, status: "queued" },
      { id: "SUB-2025-002", diameter: 300, material: "Silicon", targetNode: "5nm", quantity: 50, status: "queued" },
      { id: "SUB-2025-003", diameter: 300, material: "SiGe", targetNode: "3nm", quantity: 10, status: "queued" },
    ];

    // Run lithography on first batch
    const lithoMetrics = await this.runLithographySequence(batches[0]);

    // Run fabrication pipeline
    await this.runFabricationPipeline(batches);

    // Display quality metrics
    this.displayQualityMetrics(lithoMetrics);

    // Display cleanroom status
    this.displayCleanroomStatus();

    // Display production dashboard
    this.displayProductionDashboard();

    // Display competitive analysis
    this.displayCompetitiveAdvantage();

    // Final summary
    console.log(ColorSystem.colorize("\nSESSION SUMMARY", ColorSystem.codes.bright));
    console.log("");

    const history = this.logger.getHistory();
    const warnings = this.logger.getHistory({ level: "warning" });
    const errors = this.logger.getHistory({ level: "error" });

    TableRenderer.renderKeyValue([
      { label: "Total Log Entries", value: Formatter.number(history.length) },
      { label: "Warnings", value: Formatter.number(warnings.length) },
      { label: "Errors", value: Formatter.number(errors.length) },
      { label: "Wafers Processed", value: Formatter.number(this.stats.wafersProcessed) },
      { label: "Accelerator Status", value: "NOMINAL" },
      { label: "Fab Status", value: "OPERATIONAL" },
    ]);

    console.log("");

    BoxRenderer.render(
      [
        `${ColorSystem.codes.brightGreen}FABRICATION COMPLETE${ColorSystem.codes.reset}`,
        "",
        `Total wafers processed: ${this.stats.wafersProcessed}`,
        `Session yield: 97.8%`,
        `Next maintenance window: T+72 hours`,
        "",
        "Made in America. Powered by Innovation.",
      ],
      {
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
        title: "Substrate, Inc.",
      },
    );

    console.log("\n");
  }
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

if (import.meta.main) {
  const fab = new SubstrateFabSystem();
  await fab.run();
}
