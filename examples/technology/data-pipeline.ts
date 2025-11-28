#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Data Processing Pipeline Example
 *
 * Demonstrates an ETL (Extract, Transform, Load) pipeline with multiple stages,
 * error handling, retry logic, and progress tracking.
 *
 * Features used:
 *   • Multi-stage progress bars
 *   • Spinners for long-running operations
 *   • Structured logging with metadata
 *   • Tables for data display
 *   • Boxes for status and error messages
 *   • Charts for data visualization
 */

import {
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  FileLoggerPlugin,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulated data types
interface RawRecord {
  id: string;
  timestamp: string;
  value: number;
  status: string;
  metadata: Record<string, unknown>;
}

interface TransformedRecord {
  id: string;
  timestamp: Date;
  value: number;
  category: string;
  valid: boolean;
}

interface PipelineStats {
  extracted: number;
  transformed: number;
  loaded: number;
  errors: number;
  skipped: number;
  duration: number;
}

// Pipeline configuration
interface PipelineConfig {
  batchSize: number;
  maxRetries: number;
  retryDelay: number;
  validationRules: {
    minValue: number;
    maxValue: number;
  };
}

class DataPipeline {
  private logger: Logger;
  private config: PipelineConfig;
  private stats: PipelineStats;

  constructor(config: PipelineConfig) {
    this.config = config;
    this.stats = {
      extracted: 0,
      transformed: 0,
      loaded: 0,
      errors: 0,
      skipped: 0,
      duration: 0,
    };

    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("debug")
        .enableHistory(true)
        .plugin(new FileLoggerPlugin({ filepath: "./logs/data-pipeline.log" }))
        .build(),
    );
  }

  // Stage 1: Extract data from source
  private async extract(recordCount: number): Promise<RawRecord[]> {
    const pipelineLogger = this.logger.child("extract");
    pipelineLogger.info("Starting data extraction", { recordCount });

    const spinner = new Spinner({ message: "Connecting to data source..." });
    spinner.start();
    await sleep(800);
    spinner.update("Establishing secure connection...");
    await sleep(600);
    spinner.succeed("Connected to data source");

    const records: RawRecord[] = [];
    const progress = new ProgressBar({
      total: recordCount,
      width: 50,
      showValue: true,
      colorize: true,
    });

    for (let i = 0; i < recordCount; i++) {
      // Simulate extraction with occasional delays
      if (Math.random() < 0.1) {
        await sleep(50);
      }

      records.push({
        id: `REC-${String(i + 1).padStart(6, "0")}`,
        timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
        value: Math.floor(Math.random() * 1000),
        status: Math.random() > 0.1 ? "active" : "pending",
        metadata: {
          source: "api",
          version: "2.1",
          priority: Math.floor(Math.random() * 5) + 1,
        },
      });

      progress.update(i + 1);
      this.stats.extracted++;
    }

    progress.complete();
    pipelineLogger.success(`Extracted ${records.length} records`);

    return records;
  }

  // Stage 2: Transform and validate data
  private async transform(records: RawRecord[]): Promise<TransformedRecord[]> {
    const pipelineLogger = this.logger.child("transform");
    pipelineLogger.info("Starting data transformation", { count: records.length });

    const transformed: TransformedRecord[] = [];
    const progress = new ProgressBar({
      total: records.length,
      width: 50,
      showValue: true,
      colorize: true,
    });

    for (let i = 0; i < records.length; i++) {
      const record = records[i];

      try {
        // Simulate transformation logic
        const value = record.value;
        const valid = value >= this.config.validationRules.minValue &&
          value <= this.config.validationRules.maxValue;

        if (!valid) {
          pipelineLogger.warning("Record validation failed", {
            id: record.id,
            value,
            reason: "Out of range",
          });
          this.stats.skipped++;
          continue;
        }

        // Categorize data
        let category: string;
        if (value < 300) category = "low";
        else if (value < 700) category = "medium";
        else category = "high";

        transformed.push({
          id: record.id,
          timestamp: new Date(record.timestamp),
          value,
          category,
          valid,
        });

        this.stats.transformed++;
      } catch (error) {
        pipelineLogger.error("Transformation error", {
          id: record.id,
          error: error instanceof Error ? error.message : String(error),
        });
        this.stats.errors++;
      }

      progress.update(i + 1);

      // Simulate processing time
      if (Math.random() < 0.05) {
        await sleep(20);
      }
    }

    progress.complete();
    pipelineLogger.success(`Transformed ${transformed.length} records`);

    return transformed;
  }

  // Stage 3: Load data to destination
  private async load(records: TransformedRecord[]): Promise<void> {
    const pipelineLogger = this.logger.child("load");
    pipelineLogger.info("Starting data load", { count: records.length });

    const spinner = new Spinner({ message: "Connecting to database..." });
    spinner.start();
    await sleep(1000);
    spinner.update("Creating transaction...");
    await sleep(500);
    spinner.succeed("Database connection established");

    const batchCount = Math.ceil(records.length / this.config.batchSize);
    pipelineLogger.info(`Loading in ${batchCount} batches`, {
      batchSize: this.config.batchSize,
    });

    const progress = new ProgressBar({
      total: records.length,
      width: 50,
      showValue: true,
      colorize: true,
    });

    for (let i = 0; i < records.length; i += this.config.batchSize) {
      const batch = records.slice(i, i + this.config.batchSize);
      let retries = 0;
      let success = false;

      while (retries < this.config.maxRetries && !success) {
        try {
          // Simulate database write with occasional failures
          if (Math.random() < 0.05 && retries === 0) {
            throw new Error("Connection timeout");
          }

          await sleep(100 + Math.random() * 100);
          this.stats.loaded += batch.length;
          success = true;
        } catch (error) {
          retries++;
          pipelineLogger.warning("Batch load failed, retrying...", {
            attempt: retries,
            maxRetries: this.config.maxRetries,
            error: error instanceof Error ? error.message : String(error),
          });

          if (retries < this.config.maxRetries) {
            await sleep(this.config.retryDelay);
          } else {
            pipelineLogger.error("Batch load failed after max retries", {
              batchStart: i,
              batchSize: batch.length,
            });
            this.stats.errors += batch.length;
          }
        }
      }

      progress.update(Math.min(i + this.config.batchSize, records.length));
    }

    progress.complete();

    const commitSpinner = new Spinner({ message: "Committing transaction..." });
    commitSpinner.start();
    await sleep(800);
    commitSpinner.succeed("Transaction committed successfully");

    pipelineLogger.success(`Loaded ${this.stats.loaded} records to database`);
  }

  // Run the complete pipeline
  async run(recordCount: number): Promise<PipelineStats> {
    console.clear();
    console.log("\n");

    BoxRenderer.render(
      [
        "ETL Data Processing Pipeline",
        "",
        `Records to process: ${Formatter.number(recordCount)}`,
        `Batch size: ${this.config.batchSize}`,
        `Max retries: ${this.config.maxRetries}`,
        "",
        "Pipeline stages: Extract → Transform → Load",
      ],
      {
        title: "🔄 Pipeline Configuration",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("\n");
    this.logger.info("Pipeline started", { recordCount, config: this.config });

    const startTime = Date.now();

    try {
      // Stage 1: Extract
      console.log(ColorSystem.colorize("STAGE 1: EXTRACT", ColorSystem.codes.bright));
      console.log("");
      const rawRecords = await this.extract(recordCount);
      console.log("\n");

      // Stage 2: Transform
      console.log(ColorSystem.colorize("STAGE 2: TRANSFORM", ColorSystem.codes.bright));
      console.log("");
      const transformedRecords = await this.transform(rawRecords);
      console.log("\n");

      // Stage 3: Load
      console.log(ColorSystem.colorize("STAGE 3: LOAD", ColorSystem.codes.bright));
      console.log("");
      await this.load(transformedRecords);
      console.log("\n");

      this.stats.duration = Date.now() - startTime;

      // Display results
      this.displayResults();
    } catch (error) {
      this.logger.critical("Pipeline failed", {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }

    return this.stats;
  }

  private displayResults() {
    console.log(ColorSystem.colorize("PIPELINE RESULTS", ColorSystem.codes.bright));
    console.log("\n");

    // Statistics table
    TableRenderer.renderKeyValue([
      { label: "Extracted", value: Formatter.number(this.stats.extracted) },
      { label: "Transformed", value: Formatter.number(this.stats.transformed) },
      { label: "Loaded", value: Formatter.number(this.stats.loaded) },
      { label: "Skipped", value: Formatter.number(this.stats.skipped) },
      { label: "Errors", value: Formatter.number(this.stats.errors) },
      { label: "Duration", value: Formatter.duration(this.stats.duration) },
      {
        label: "Throughput",
        value: `${((this.stats.loaded / this.stats.duration) * 1000).toFixed(0)} records/sec`,
      },
    ]);

    console.log("\n");

    // Success rate chart
    const successRate = (this.stats.loaded / this.stats.extracted) * 100;
    ChartRenderer.barChart(
      [
        { label: "Loaded", value: this.stats.loaded },
        { label: "Skipped", value: this.stats.skipped },
        { label: "Errors", value: this.stats.errors },
      ],
      { showValues: true, width: 40 },
    );

    console.log("\n");

    // Final status
    const status = successRate >= 95 ? "success" : successRate >= 80 ? "warning" : "error";
    const statusMessage = successRate >= 95
      ? `✅ Pipeline completed successfully (${successRate.toFixed(1)}% success rate)`
      : successRate >= 80
      ? `⚠️  Pipeline completed with warnings (${successRate.toFixed(1)}% success rate)`
      : `❌ Pipeline completed with errors (${successRate.toFixed(1)}% success rate)`;

    BoxRenderer.message(statusMessage, status);

    console.log("\n");
    this.logger.success("Pipeline execution completed", this.stats);
  }
}

// Main execution
if (import.meta.main) {
  const config: PipelineConfig = {
    batchSize: 50,
    maxRetries: 3,
    retryDelay: 500,
    validationRules: {
      minValue: 0,
      maxValue: 1000,
    },
  };

  const pipeline = new DataPipeline(config);
  await pipeline.run(500);
}
