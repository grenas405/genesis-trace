#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Build Pipeline Example (CI/CD Style)
 *
 * Demonstrates a continuous integration/deployment pipeline with multiple stages,
 * parallel execution, dependency checking, and detailed reporting.
 *
 * Features used:
 *   • Multi-stage build process with progress tracking
 *   • Parallel job execution simulation
 *   • Detailed logging with timestamps
 *   • Error handling and recovery
 *   • Summary reports with charts and tables
 *   • Color-coded status indicators
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  draculaTheme,
  Formatter,
  Logger,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Build job types
interface BuildJob {
  name: string;
  duration: number;
  successRate: number;
  dependencies?: string[];
}

interface BuildResult {
  job: string;
  status: "success" | "failed" | "skipped";
  duration: number;
  error?: string;
  warnings: number;
}

interface BuildReport {
  totalDuration: number;
  jobs: BuildResult[];
  overallStatus: "success" | "failed";
}

// Pipeline stages
const PIPELINE_STAGES = {
  prepare: [
    { name: "checkout", duration: 2000, successRate: 0.99 },
    { name: "install-deps", duration: 5000, successRate: 0.95 },
    { name: "setup-env", duration: 1500, successRate: 0.98 },
  ],
  build: [
    { name: "lint", duration: 3000, successRate: 0.90, dependencies: ["install-deps"] },
    { name: "typecheck", duration: 4000, successRate: 0.85, dependencies: ["install-deps"] },
    { name: "compile", duration: 6000, successRate: 0.92, dependencies: ["typecheck"] },
  ],
  test: [
    { name: "unit-tests", duration: 5000, successRate: 0.88, dependencies: ["compile"] },
    { name: "integration-tests", duration: 8000, successRate: 0.80, dependencies: ["compile"] },
    { name: "e2e-tests", duration: 12000, successRate: 0.75, dependencies: ["compile"] },
  ],
  deploy: [
    { name: "build-image", duration: 10000, successRate: 0.95, dependencies: ["compile"] },
    { name: "push-registry", duration: 6000, successRate: 0.93, dependencies: ["build-image"] },
    { name: "deploy-staging", duration: 8000, successRate: 0.90, dependencies: ["push-registry"] },
  ],
};

class BuildPipeline {
  private logger: Logger;
  private results: BuildResult[] = [];
  private failedJobs: Set<string> = new Set();

  constructor() {
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(draculaTheme)
        .logLevel("debug")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .build(),
    );
  }

  private async executeJob(job: BuildJob): Promise<BuildResult> {
    const jobLogger = this.logger.child(job.name);
    const startTime = Date.now();

    // Check dependencies
    if (job.dependencies) {
      for (const dep of job.dependencies) {
        if (this.failedJobs.has(dep)) {
          jobLogger.warning("Skipping job due to failed dependency", { dependency: dep });
          return {
            job: job.name,
            status: "skipped",
            duration: 0,
            warnings: 0,
          };
        }
      }
    }

    jobLogger.info("Starting job", { estimatedDuration: Formatter.duration(job.duration) });

    const spinner = new Spinner({ message: `Running ${job.name}...` });
    spinner.start();

    // Simulate job execution with progress
    const steps = 20;
    const stepDuration = job.duration / steps;
    let warnings = 0;

    for (let i = 0; i < steps; i++) {
      await sleep(stepDuration);

      // Simulate occasional warnings
      if (Math.random() < 0.1) {
        warnings++;
        jobLogger.warning("Job warning", {
          step: i + 1,
          message: "Minor issue detected but continuing...",
        });
      }
    }

    const duration = Date.now() - startTime;
    const success = Math.random() < job.successRate;

    if (success) {
      spinner.succeed(`${job.name} completed`);
      jobLogger.success("Job completed", {
        duration: Formatter.duration(duration),
        warnings,
      });

      return {
        job: job.name,
        status: "success",
        duration,
        warnings,
      };
    } else {
      const error = "Build failed: compilation errors detected";
      spinner.fail(`${job.name} failed`);
      jobLogger.error("Job failed", { error, duration: Formatter.duration(duration) });
      this.failedJobs.add(job.name);

      return {
        job: job.name,
        status: "failed",
        duration,
        error,
        warnings,
      };
    }
  }

  private async executeStage(stageName: string, jobs: BuildJob[]): Promise<void> {
    console.log("\n");
    console.log(
      ColorSystem.colorize(
        `╭${"─".repeat(60)}╮`,
        ColorSystem.codes.brightCyan,
      ),
    );
    console.log(
      ColorSystem.colorize(
        `│ STAGE: ${stageName.toUpperCase().padEnd(53)}│`,
        ColorSystem.codes.brightCyan,
      ),
    );
    console.log(
      ColorSystem.colorize(
        `╰${"─".repeat(60)}╯`,
        ColorSystem.codes.brightCyan,
      ),
    );
    console.log("");

    this.logger.info(`Starting stage: ${stageName}`, { jobCount: jobs.length });

    // Execute jobs sequentially (in a real pipeline, some could be parallel)
    for (const job of jobs) {
      const result = await this.executeJob(job);
      this.results.push(result);

      if (result.status === "failed") {
        BoxRenderer.message(
          `Job '${job.name}' failed: ${result.error}`,
          "error",
        );
      } else if (result.status === "skipped") {
        BoxRenderer.message(
          `Job '${job.name}' skipped due to dependency failure`,
          "warning",
        );
      }

      console.log("");
    }

    const stageResults = this.results.filter((r) => jobs.some((j) => j.name === r.job));
    const failed = stageResults.filter((r) => r.status === "failed").length;
    const skipped = stageResults.filter((r) => r.status === "skipped").length;
    const success = stageResults.filter((r) => r.status === "success").length;

    this.logger.info(`Stage '${stageName}' completed`, {
      success,
      failed,
      skipped,
    });

    if (failed > 0 && stageName !== "test") {
      throw new Error(`Stage '${stageName}' failed with ${failed} job(s)`);
    }
  }

  private generateReport(): BuildReport {
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const hasFailures = this.results.some((r) => r.status === "failed");

    return {
      totalDuration,
      jobs: this.results,
      overallStatus: hasFailures ? "failed" : "success",
    };
  }

  private displayReport(report: BuildReport) {
    console.log("\n");
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" BUILD REPORT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.codes.brightMagenta));
    console.log("\n");

    // Job results table
    TableRenderer.render(
      report.jobs,
      [
        { key: "job", label: "Job", width: 20 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const color = status === "success"
              ? ColorSystem.codes.green
              : status === "failed"
              ? ColorSystem.codes.red
              : ColorSystem.codes.yellow;
            const symbol = status === "success" ? "✓" : status === "failed" ? "✗" : "○";
            return ColorSystem.colorize(`${symbol} ${status}`, color);
          },
        },
        {
          key: "duration",
          label: "Duration",
          width: 12,
          align: "right",
          formatter: (ms: number) => Formatter.duration(ms),
        },
        {
          key: "warnings",
          label: "Warnings",
          width: 10,
          align: "right",
          formatter: (w: number) =>
            w > 0 ? ColorSystem.colorize(String(w), ColorSystem.codes.yellow) : "0",
        },
        { key: "error", label: "Error", width: 20 },
      ],
      { showIndex: true },
    );

    console.log("\n");

    // Summary statistics
    const successful = report.jobs.filter((j) => j.status === "success").length;
    const failed = report.jobs.filter((j) => j.status === "failed").length;
    const skipped = report.jobs.filter((j) => j.status === "skipped").length;
    const totalWarnings = report.jobs.reduce((sum, j) => sum + (j.warnings || 0), 0);

    TableRenderer.renderKeyValue([
      { label: "Total Jobs", value: String(report.jobs.length) },
      {
        label: "Successful",
        value: ColorSystem.colorize(String(successful), ColorSystem.codes.green),
      },
      {
        label: "Failed",
        value: ColorSystem.colorize(String(failed), ColorSystem.codes.red),
      },
      {
        label: "Skipped",
        value: ColorSystem.colorize(String(skipped), ColorSystem.codes.yellow),
      },
      { label: "Total Warnings", value: String(totalWarnings) },
      { label: "Total Duration", value: Formatter.duration(report.totalDuration) },
      { label: "Success Rate", value: `${((successful / report.jobs.length) * 100).toFixed(1)}%` },
    ]);

    console.log("\n");

    // Status chart
    if (failed > 0 || skipped > 0) {
      ChartRenderer.barChart(
        [
          { label: "Successful", value: successful },
          { label: "Failed", value: failed },
          { label: "Skipped", value: skipped },
        ],
        { showValues: true, width: 40 },
      );
      console.log("\n");
    }

    // Final status
    const statusColor = report.overallStatus === "success"
      ? ColorSystem.codes.green
      : ColorSystem.codes.red;
    const statusSymbol = report.overallStatus === "success" ? "✓" : "✗";

    BoxRenderer.render(
      [
        ColorSystem.colorize(
          `${statusSymbol} BUILD ${report.overallStatus.toUpperCase()}`,
          statusColor,
        ),
        "",
        `Completed in ${Formatter.duration(report.totalDuration)}`,
        `${successful}/${report.jobs.length} jobs successful`,
        failed > 0 ? `${failed} jobs failed` : "",
        totalWarnings > 0 ? `${totalWarnings} warnings` : "",
      ].filter(Boolean),
      {
        title: "Pipeline Status",
        style: "double",
        color: statusColor,
        padding: 1,
      },
    );
  }

  async run(): Promise<BuildReport> {
    console.clear();
    console.log("\n");

    BannerRenderer.render({
      title: "CI/CD BUILD PIPELINE",
      subtitle: "Continuous Integration & Deployment",
      description: "Automated build, test, and deployment workflow",
      version: "2.0",
      author: "DevOps Team",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
    });

    console.log("\n");
    this.logger.info("Pipeline started");

    const startTime = Date.now();

    try {
      await this.executeStage("prepare", PIPELINE_STAGES.prepare);
      await this.executeStage("build", PIPELINE_STAGES.build);
      await this.executeStage("test", PIPELINE_STAGES.test);
      await this.executeStage("deploy", PIPELINE_STAGES.deploy);

      this.logger.success("Pipeline completed");
    } catch (error) {
      this.logger.error("Pipeline failed", {
        error: error instanceof Error ? error.message : String(error),
      });
    }

    const report = this.generateReport();
    this.displayReport(report);

    return report;
  }
}

// Main execution
if (import.meta.main) {
  const pipeline = new BuildPipeline();
  const report = await pipeline.run();

  console.log("\n");

  // Exit with appropriate code
  Deno.exit(report.overallStatus === "success" ? 0 : 1);
}
