#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Error Handling & Recovery Example
 *
 * Demonstrates robust error handling patterns, graceful degradation,
 * retry logic, and recovery strategies using Console Styler.
 *
 * Features demonstrated:
 *   • Try-catch patterns with structured logging
 *   • Retry mechanisms with exponential backoff
 *   • Graceful degradation when services fail
 *   • Error aggregation and reporting
 *   • Circuit breaker pattern
 *   • Recovery procedures
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
} from "../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// ERROR TYPES AND UTILITIES
// ============================================================================

class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// ============================================================================
// RETRY WITH EXPONENTIAL BACKOFF
// ============================================================================

async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions,
  logger: Logger,
  operationName: string,
): Promise<T> {
  let lastError: Error | undefined;
  let delay = options.initialDelay;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      logger.debug(`Attempt ${attempt}/${options.maxAttempts} for ${operationName}`);

      const result = await operation();

      if (attempt > 1) {
        logger.success(`${operationName} succeeded after ${attempt} attempts`);
      }

      return result;
    } catch (error) {
      lastError = error as Error;

      logger.warning(`${operationName} failed`, {
        attempt,
        maxAttempts: options.maxAttempts,
        error: lastError.message,
        nextRetryIn: attempt < options.maxAttempts ? Formatter.duration(delay) : "N/A",
      });

      if (attempt < options.maxAttempts) {
        const spinner = new Spinner({
          message: `Retrying in ${Formatter.duration(delay)}...`,
        });
        spinner.start();
        await sleep(delay);
        spinner.stop();

        // Exponential backoff
        delay = Math.min(delay * options.backoffMultiplier, options.maxDelay);
      }
    }
  }

  throw new Error(`${operationName} failed after ${options.maxAttempts} attempts: ${lastError?.message}`);
}

// ============================================================================
// CIRCUIT BREAKER PATTERN
// ============================================================================

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  constructor(
    private threshold: number,
    private timeout: number,
    private logger: Logger,
  ) {}

  async execute<T>(operation: () => Promise<T>, operationName: string): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.logger.info(`Circuit breaker entering half-open state for ${operationName}`);
        this.state = "half-open";
      } else {
        throw new Error(`Circuit breaker is open for ${operationName}`);
      }
    }

    try {
      const result = await operation();

      if (this.state === "half-open") {
        this.logger.success(`Circuit breaker closed for ${operationName}`);
        this.state = "closed";
        this.failures = 0;
      }

      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();

      if (this.failures >= this.threshold) {
        this.logger.error(`Circuit breaker opened for ${operationName}`, {
          failures: this.failures,
          threshold: this.threshold,
        });
        this.state = "open";
      }

      throw error;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      lastFailureTime: this.lastFailureTime,
    };
  }

  reset() {
    this.state = "closed";
    this.failures = 0;
    this.lastFailureTime = 0;
  }
}

// ============================================================================
// SIMULATED OPERATIONS (with failures)
// ============================================================================

class UnreliableService {
  private callCount = 0;

  async fetchData(failureRate = 0.3): Promise<{ data: string }> {
    this.callCount++;
    await sleep(500 + Math.random() * 500);

    if (Math.random() < failureRate) {
      if (Math.random() < 0.5) {
        throw new NetworkError("Connection refused");
      } else {
        throw new TimeoutError("Request timeout");
      }
    }

    return { data: `Result from call ${this.callCount}` };
  }

  async validateInput(input: string): Promise<boolean> {
    await sleep(200);

    if (input.length < 5) {
      throw new ValidationError("Input too short");
    }

    if (!/^[a-zA-Z0-9]+$/.test(input)) {
      throw new ValidationError("Input contains invalid characters");
    }

    return true;
  }

  async processWithTimeout(timeoutMs: number): Promise<string> {
    const processingTime = Math.random() * 2000;

    await sleep(processingTime);

    if (processingTime > timeoutMs) {
      throw new TimeoutError(`Processing exceeded ${timeoutMs}ms`);
    }

    return "Processing complete";
  }
}

// ============================================================================
// ERROR RECOVERY DEMONSTRATIONS
// ============================================================================

async function demonstrateRetryLogic(logger: Logger) {
  console.log(ColorSystem.colorize("\n1. RETRY WITH EXPONENTIAL BACKOFF", ColorSystem.codes.bright));
  console.log("");

  const service = new UnreliableService();

  const retryOptions: RetryOptions = {
    maxAttempts: 5,
    initialDelay: 500,
    maxDelay: 5000,
    backoffMultiplier: 2,
  };

  try {
    const spinner = new Spinner({ message: "Fetching data with retry logic..." });
    spinner.start();

    const result = await retryWithBackoff(
      () => service.fetchData(0.6), // 60% failure rate
      retryOptions,
      logger,
      "fetchData",
    );

    spinner.succeed("Data fetched successfully");
    logger.success("Operation completed", { result: result.data });
  } catch (error) {
    logger.critical("Operation failed completely", {
      error: error instanceof Error ? error.message : String(error),
    });

    BoxRenderer.message(
      `Failed to fetch data after ${retryOptions.maxAttempts} attempts`,
      "error",
    );
  }
}

async function demonstrateCircuitBreaker(logger: Logger) {
  console.log(ColorSystem.colorize("\n2. CIRCUIT BREAKER PATTERN", ColorSystem.codes.bright));
  console.log("");

  const service = new UnreliableService();
  const circuitBreaker = new CircuitBreaker(3, 5000, logger);

  const progress = new ProgressBar({
    total: 10,
    width: 50,
    label: "API calls",
    showValue: true,
  });

  const results: Array<{ attempt: number; status: string; state: string }> = [];

  for (let i = 1; i <= 10; i++) {
    try {
      await circuitBreaker.execute(
        () => service.fetchData(0.5), // 50% failure rate
        "fetchData",
      );

      const state = circuitBreaker.getState();
      results.push({ attempt: i, status: "success", state: state.state });
      logger.info(`Call ${i} succeeded`, { circuitState: state.state });
    } catch (error) {
      const state = circuitBreaker.getState();
      results.push({ attempt: i, status: "failed", state: state.state });
      logger.error(`Call ${i} failed`, {
        error: error instanceof Error ? error.message : String(error),
        circuitState: state.state,
      });
    }

    progress.update(i);
    await sleep(300);
  }

  progress.complete();

  console.log("\n");
  TableRenderer.render(
    results,
    [
      { key: "attempt", label: "Attempt", width: 10, align: "center" },
      {
        key: "status",
        label: "Status",
        width: 12,
        formatter: (status: string) =>
          status === "success"
            ? ColorSystem.colorize("✓ Success", ColorSystem.codes.green)
            : ColorSystem.colorize("✗ Failed", ColorSystem.codes.red),
      },
      {
        key: "state",
        label: "Circuit State",
        width: 15,
        formatter: (state: string) => {
          const color = state === "closed"
            ? ColorSystem.codes.green
            : state === "open"
            ? ColorSystem.codes.red
            : ColorSystem.codes.yellow;
          return ColorSystem.colorize(state, color);
        },
      },
    ],
  );
}

async function demonstrateGracefulDegradation(logger: Logger) {
  console.log(ColorSystem.colorize("\n3. GRACEFUL DEGRADATION", ColorSystem.codes.bright));
  console.log("");

  const service = new UnreliableService();

  async function fetchWithFallback(): Promise<string> {
    try {
      logger.info("Attempting primary data source...");
      const spinner = new Spinner({ message: "Connecting to primary source..." });
      spinner.start();

      const result = await service.fetchData(0.8); // High failure rate
      spinner.succeed("Primary source successful");
      return result.data;
    } catch (primaryError) {
      logger.warning("Primary source failed, trying cache...", {
        error: primaryError instanceof Error ? primaryError.message : String(primaryError),
      });

      try {
        await sleep(300);
        // Simulate cache hit (90% success)
        if (Math.random() < 0.9) {
          logger.success("Cache hit");
          return "Cached data (slightly outdated)";
        }
        throw new Error("Cache miss");
      } catch (cacheError) {
        logger.warning("Cache failed, using default data", {
          error: cacheError instanceof Error ? cacheError.message : String(cacheError),
        });

        // Fallback to default
        return "Default/fallback data";
      }
    }
  }

  const result = await fetchWithFallback();

  BoxRenderer.render(
    ["Graceful Degradation Result:", "", result],
    {
      title: "Final Result",
      style: "rounded",
      color: ColorSystem.codes.green,
    },
  );
}

async function demonstrateErrorAggregation(logger: Logger) {
  console.log(ColorSystem.colorize("\n4. ERROR AGGREGATION & REPORTING", ColorSystem.codes.bright));
  console.log("");

  const errorStats = new Map<string, number>();
  const service = new UnreliableService();

  const progress = new ProgressBar({
    total: 20,
    width: 50,
    label: "Processing items",
    showValue: true,
  });

  for (let i = 0; i < 20; i++) {
    try {
      await service.fetchData(0.4);
    } catch (error) {
      const errorType = error instanceof Error ? error.name : "Unknown";
      errorStats.set(errorType, (errorStats.get(errorType) || 0) + 1);
      logger.error(`Item ${i + 1} failed`, {
        errorType,
        message: error instanceof Error ? error.message : String(error),
      });
    }

    progress.update(i + 1);
    await sleep(100);
  }

  progress.complete();

  console.log("\n");
  console.log(ColorSystem.colorize("Error Summary:", ColorSystem.codes.bright));
  console.log("");

  if (errorStats.size > 0) {
    const chartData = Array.from(errorStats.entries()).map(([label, value]) => ({
      label,
      value,
    }));

    ChartRenderer.barChart(chartData, { showValues: true, width: 40 });

    console.log("\n");
    const totalErrors = Array.from(errorStats.values()).reduce((sum, count) => sum + count, 0);
    BoxRenderer.render(
      [
        `Total Errors: ${totalErrors}`,
        `Error Types: ${errorStats.size}`,
        `Success Rate: ${((20 - totalErrors) / 20 * 100).toFixed(1)}%`,
      ],
      {
        title: "Error Statistics",
        style: "single",
        color: ColorSystem.codes.yellow,
      },
    );
  } else {
    BoxRenderer.message("No errors encountered!", "success");
  }
}

// ============================================================================
// MAIN DEMONSTRATION
// ============================================================================

async function main() {
  console.clear();
  console.log("\n");

  BoxRenderer.render(
    [
      "Error Handling & Recovery Patterns",
      "",
      "This example demonstrates:",
      "  1. Retry logic with exponential backoff",
      "  2. Circuit breaker pattern",
      "  3. Graceful degradation with fallbacks",
      "  4. Error aggregation and reporting",
    ],
    {
      title: "🛡️ Error Handling Demo",
      style: "double",
      color: ColorSystem.codes.brightMagenta,
      padding: 1,
    },
  );

  const logger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("debug")
      .enableHistory(true)
      .plugin(new FileLoggerPlugin({ filepath: "./logs/error-handling.log" }))
      .build(),
  );

  await demonstrateRetryLogic(logger);
  await sleep(1000);

  await demonstrateCircuitBreaker(logger);
  await sleep(1000);

  await demonstrateGracefulDegradation(logger);
  await sleep(1000);

  await demonstrateErrorAggregation(logger);

  console.log("\n");
  BoxRenderer.message(
    "Error handling demonstration complete! Check logs for detailed information.",
    "success",
  );
  console.log("\n");

  await logger.shutdown();
}

if (import.meta.main) {
  await main();
}
