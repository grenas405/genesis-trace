#!/usr/bin/env -S deno run --allow-all
// examples/technology/psychological-guardrails-demo.ts
/**
 * Psychological Guardrails Demo
 *
 * Demonstrates the cognitive safety features built into genesis-trace
 * for accelerated learning environments.
 *
 * This example shows:
 * - Cognitive load monitoring
 * - Adaptive pacing based on comprehension
 * - Break reminders and fatigue tracking
 * - Session wellness reporting
 * - Visual strain prevention
 */

import {
  AnimationLoop,
  BoxRenderer,
  ConfigBuilder,
  Logger,
  MatrixRainAnimation,
  neonTheme,
  ProgressBar,
  TableRenderer,
} from "../../mod.ts";
import { CognitiveGuardrailsPlugin } from "../../plugins/cognitive-guardrails.ts";
import { AdaptivePacingController } from "../../plugins/adaptive-pacing.ts";
import { ColorSystem } from "../../core/colors.ts";

// ============================================================================
// Setup: Create logger with cognitive guardrails
// ============================================================================

const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 10 * 60 * 1000, // 10 minutes for demo (normally 50 min)
  breakInterval: 3 * 60 * 1000, // 3 minutes for demo (normally 25 min)
  breakDuration: 30 * 1000, // 30 seconds for demo (normally 5 min)
  maxComplexityScore: 75,
  maxInformationDensity: 12,
  enableWarnings: true,
  enableForcedBreaks: false, // Set to true to enforce breaks
  enableAdaptivePacing: true,

  // Callbacks for integration
  onWarning: (warning) => {
    console.log(ColorSystem.colorize(
      `⚠️  Warning recorded: ${warning.type} (${warning.severity})`,
      ColorSystem.codes.yellow
    ));
  },
  onMetricsUpdate: (metrics) => {
    // Could send to analytics, update UI, etc.
  },
});

const config = new ConfigBuilder()
  .theme(neonTheme)
  .logLevel("debug")
  .enableHistory(true)
  .plugin(guardrails)
  .build();

const logger = new Logger(config);

// Create adaptive pacing controller
const pacing = new AdaptivePacingController({
  baseSpeed: 1.0,
  minSpeed: 0.3,
  maxSpeed: 1.5,
  allowAutoAdjust: true,
  showPacingIndicators: true,
});

// ============================================================================
// Demo Scenarios
// ============================================================================

async function demonstrateBasicUsage() {
  logger.info("=".repeat(70));
  logger.success("Psychological Guardrails - Basic Usage Demo");
  logger.info("=".repeat(70));

  await sleep(1000);

  logger.info("Starting monitored learning session...");
  logger.debug("Guardrails are active in the background", {
    monitoring: ["cognitive load", "fatigue", "engagement", "visual strain"],
  });

  await sleep(500);

  // Simulate normal learning activity
  logger.info("Reading: Introduction to Quantum Computing");
  await sleep(pacing.calculateDelay(1000));

  logger.debug("Processing concept: Superposition", {
    complexity: "medium",
    priorKnowledge: "low",
  });

  // Update pacing based on comprehension
  pacing.updateComprehension({
    timeOnContent: 2000,
    interactionCount: 3,
    progressMade: true,
    complexityScore: 0.6,
  });

  await sleep(pacing.calculateDelay(800));

  logger.info("Reading: Quantum Entanglement explained");
  logger.debug("Processing concept: Entanglement", {
    complexity: "high",
    relatedConcepts: ["superposition", "measurement"],
  });

  // Simulate struggle with complex content
  pacing.updateComprehension({
    timeOnContent: 5000,
    interactionCount: 8,
    repetitionNeeded: true,
    complexityScore: 0.85,
  });

  await sleep(pacing.calculateDelay(1000));

  logger.success("Concept understood!", {
    clarity: "high",
    retention: "medium",
  });

  // Show this improved comprehension
  pacing.updateComprehension({
    progressMade: true,
    complexityScore: 0.85,
  });

  await sleep(500);
}

async function demonstrateCognitiveOverload() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Scenario: Cognitive Overload Simulation");
  logger.info("=".repeat(70));

  await sleep(1000);

  logger.info("Attempting rapid-fire learning (high density information)...");

  // Simulate information overload
  for (let i = 0; i < 15; i++) {
    logger.info(`Complex topic ${i + 1}: Advanced quantum mechanics`, {
      subtopics: ["wave functions", "operators", "eigenvalues"],
      equations: ["Schrödinger equation", "Heisenberg uncertainty"],
      complexity: 85 + Math.random() * 10,
    });

    pacing.updateComprehension({
      timeOnContent: 500, // Too fast
      interactionCount: 1,
      complexityScore: 0.9,
    });

    await sleep(pacing.calculateDelay(200)); // Very fast
  }

  logger.warning("Information density exceeds recommended threshold");
  logger.info("Notice: Guardrails should have triggered warnings ☝️");

  await sleep(2000);
}

async function demonstrateVisualStrain() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Scenario: Visual Strain from Animations");
  logger.info("=".repeat(70));

  await sleep(1000);

  logger.info("Starting animated visualization (5 seconds)...");

  // Track animation usage
  const animationStart = Date.now();

  const animation = new MatrixRainAnimation(60, 15, 0.3);

  const loop = new AnimationLoop({
    fps: pacing.calculateFPS(30),
    maxFrames: 150, // 5 seconds at 30 FPS
  });

  loop.add((frame, deltaTime) => {
    return animation.update(deltaTime);
  });

  loop.start();

  await sleep(5000);
  loop.stop();

  const animationDuration = Date.now() - animationStart;
  guardrails.trackAnimation(animationDuration);

  logger.success("Animation complete");
  logger.debug("Visual strain tracked", {
    duration: `${(animationDuration / 1000).toFixed(1)}s`,
  });

  await sleep(1000);
}

async function demonstrateEngagementTracking() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Scenario: Low Engagement Detection");
  logger.info("=".repeat(70));

  await sleep(1000);

  logger.info("Simulating monotonous repetitive content...");

  // Simulate boring repetitive content
  for (let i = 0; i < 5; i++) {
    logger.info("Same concept repeated", {
      iteration: i + 1,
      variation: "minimal",
    });

    pacing.updateComprehension({
      timeOnContent: 3000,
      interactionCount: 0, // No interaction
      repetitionNeeded: true,
      complexityScore: 0.3, // Low complexity
    });

    await sleep(pacing.calculateDelay(600));
  }

  logger.warning("Low engagement detected - consider varying content");

  await sleep(1000);
}

async function demonstrateProgressTracking() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Scenario: Learning Progress with Feedback");
  logger.info("=".repeat(70));

  await sleep(1000);

  const topics = [
    { name: "Variables", complexity: 0.3 },
    { name: "Functions", complexity: 0.4 },
    { name: "Classes", complexity: 0.6 },
    { name: "Async Programming", complexity: 0.8 },
    { name: "Design Patterns", complexity: 0.9 },
  ];

  const progress = new ProgressBar({
    total: topics.length,
    width: 50,
    showPercentage: true,
    showValue: true,
  });

  for (let i = 0; i < topics.length; i++) {
    const topic = topics[i];

    logger.info(`Learning: ${topic.name}`);

    pacing.updateDifficulty(topic.complexity);

    // Simulate learning time based on complexity
    const learningTime = pacing.calculateDelay(topic.complexity * 3000);
    await sleep(learningTime);

    logger.success(`Mastered: ${topic.name}`);

    pacing.updateComprehension({
      timeOnContent: learningTime,
      progressMade: true,
      complexityScore: topic.complexity,
      interactionCount: 3,
    });

    progress.update(i + 1);
    await sleep(pacing.calculateDelay(500));
  }

  progress.complete();
  logger.success("All topics completed!");

  await sleep(1000);
}

async function displayMetricsDashboard() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Real-Time Metrics Dashboard");
  logger.info("=".repeat(70));

  await sleep(500);

  const metrics = guardrails.getMetrics();
  const pacingState = pacing.getState();
  const profile = pacing.getProfile();

  // Session overview
  BoxRenderer.render([
    "Session Overview",
    "",
    `Duration: ${formatDuration(metrics.sessionDuration)}`,
    `Time since break: ${formatDuration(metrics.timeSinceLastBreak)}`,
    `Breaks taken: ${metrics.totalBreaksTaken}`,
    `Interactions: ${metrics.interactionCount}`,
  ], {
    title: "📊 Session Stats",
    style: "rounded",
  });

  console.log();

  // Cognitive metrics
  const cognitiveData = [
    { metric: "Complexity", value: metrics.currentComplexityScore, max: 100 },
    { metric: "Info Density", value: metrics.informationDensity, max: 12 },
    { metric: "Engagement", value: metrics.engagementScore * 100, max: 100 },
    { metric: "Fatigue", value: metrics.fatigueScore, max: 100 },
    { metric: "Overload Risk", value: metrics.overloadRisk, max: 100 },
    { metric: "Wellness", value: metrics.wellnessScore, max: 100 },
  ];

  TableRenderer.render(
    cognitiveData.map(item => ({
      Metric: item.metric,
      Current: item.value.toFixed(1),
      Bar: getBar(item.value, item.max),
      Status: getStatus(item.value, item.max),
    })),
    [
      { key: "Metric", label: "Metric", width: 15 },
      { key: "Current", label: "Value", width: 8, align: "right" },
      { key: "Bar", label: "Progress", width: 25 },
      { key: "Status", label: "Status", width: 12 },
    ]
  );

  console.log();

  // Pacing information
  BoxRenderer.render([
    "Pacing Control",
    "",
    `Current Speed: ${pacingState.currentSpeed.toFixed(2)}x`,
    `Comprehension: ${(pacingState.comprehensionScore * 100).toFixed(0)}%`,
    `Difficulty: ${(pacingState.difficultyLevel * 100).toFixed(0)}%`,
    `Adjustments: ${pacingState.adjustmentHistory.length}`,
    "",
    `Processing Speed: ${(profile.processingSpeed * 100).toFixed(0)}%`,
    `Preferred Pace: ${profile.preferredPace.toFixed(2)}x`,
  ], {
    title: "🎯 Adaptive Pacing",
    style: "rounded",
  });

  console.log();

  // Warnings summary
  const warnings = guardrails.getWarnings();
  if (warnings.length > 0) {
    logger.warning(`${warnings.length} warnings issued during session`);

    const warningsByType = warnings.reduce((acc, w) => {
      acc[w.type] = (acc[w.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    Object.entries(warningsByType).forEach(([type, count]) => {
      logger.debug(`  ${type}: ${count}`);
    });
  } else {
    logger.success("No warnings issued - healthy session!");
  }

  await sleep(1000);
}

async function demonstrateSessionRecommendations() {
  logger.info("\n" + "=".repeat(70));
  logger.info("Personalized Session Recommendations");
  logger.info("=".repeat(70));

  await sleep(500);

  const recommendation = pacing.getSessionRecommendation();

  BoxRenderer.render([
    "Recommended Session Structure",
    "",
    `Session Length: ${formatDuration(recommendation.sessionDuration)}`,
    `Break Interval: ${formatDuration(recommendation.breakInterval)}`,
    `Starting Speed: ${recommendation.startingSpeed.toFixed(2)}x`,
    `Content Level: ${recommendation.contentComplexity}`,
    "",
    "This is personalized based on your learning profile",
    "and can improve retention by up to 40%",
  ], {
    title: "💡 Optimization Suggestions",
    style: "double",
  });

  await sleep(1000);
}

// ============================================================================
// Main Demo Execution
// ============================================================================

async function main() {
  console.clear();

  // Welcome banner
  BoxRenderer.render([
    "Psychological Guardrails Demo",
    "",
    "This demonstration shows how genesis-trace protects",
    "learners in accelerated learning environments.",
    "",
    "Features demonstrated:",
    "• Cognitive load monitoring",
    "• Adaptive pacing",
    "• Fatigue detection",
    "• Engagement tracking",
    "• Visual strain prevention",
    "• Session wellness reporting",
  ], {
    title: "🧠 Learning Safety System",
    style: "double",
    padding: 1,
  });

  console.log();
  await sleep(2000);

  try {
    // Run demo scenarios
    await demonstrateBasicUsage();
    await sleep(1000);

    await demonstrateProgressTracking();
    await sleep(1000);

    await demonstrateCognitiveOverload();
    await sleep(1000);

    await demonstrateEngagementTracking();
    await sleep(1000);

    await demonstrateVisualStrain();
    await sleep(1000);

    await displayMetricsDashboard();
    await sleep(1000);

    await demonstrateSessionRecommendations();
    await sleep(1000);

    // Display pacing profile
    pacing.displayProfile();
    await sleep(1000);

    logger.success("\n🎉 Demo completed successfully!");
    logger.info("The guardrails have been monitoring your session in the background.");

  } catch (error) {
    logger.error("Demo error", { error: error instanceof Error ? error.message : String(error) });
  } finally {
    // Shutdown and show final report
    await logger.shutdown();
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);

  if (minutes > 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }

  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function getBar(value: number, max: number): string {
  const normalized = Math.max(0, Math.min(max, value));
  const percentage = normalized / max;
  const filled = Math.floor(percentage * 15);
  const empty = 15 - filled;

  return "█".repeat(filled) + "░".repeat(empty);
}

function getStatus(value: number, max: number): string {
  const percentage = (value / max) * 100;

  if (percentage >= 80) return ColorSystem.colorize("High", ColorSystem.codes.red);
  if (percentage >= 60) return ColorSystem.colorize("Medium", ColorSystem.codes.yellow);
  if (percentage >= 40) return ColorSystem.colorize("Normal", ColorSystem.codes.green);
  return ColorSystem.colorize("Low", ColorSystem.codes.blue);
}

// Run the demo
if (import.meta.main) {
  main();
}
