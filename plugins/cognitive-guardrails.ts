// plugins/cognitive-guardrails.ts
/**
 * Cognitive Guardrails Plugin
 *
 * Implements psychological safety mechanisms for accelerated learning environments.
 * Monitors cognitive load, pacing, and user engagement to prevent mental fatigue
 * and ensure sustainable learning patterns.
 *
 * Research-based thresholds derived from:
 * - Cognitive Load Theory (Sweller, 1988)
 * - Spaced Repetition Research (Ebbinghaus, 1885)
 * - Attention Restoration Theory (Kaplan & Kaplan, 1989)
 * - Flow State Research (Csikszentmihalyi, 1990)
 */

import { LogEntry, Plugin, StylerConfig } from "../core/config.ts";
import { ColorSystem } from "../core/colors.ts";
import { BoxRenderer } from "../components/boxes.ts";

export interface CognitiveGuardrailsOptions {
  // Session management
  maxSessionDuration?: number; // milliseconds (default: 50 minutes - optimal attention span)
  breakInterval?: number; // milliseconds (default: 25 minutes - Pomodoro technique)
  breakDuration?: number; // milliseconds (default: 5-10 minutes)

  // Cognitive load monitoring
  maxComplexityScore?: number; // 0-100 scale (default: 75)
  maxInformationDensity?: number; // items per minute (default: 12)

  // Engagement tracking
  minEngagementThreshold?: number; // 0-1 scale (default: 0.3)
  maxRepetitionWithoutProgress?: number; // (default: 3)

  // Visual strain prevention
  maxAnimationDuration?: number; // milliseconds (default: 30 minutes)
  animationFpsLimit?: number; // frames per second (default: 30)

  // Intervention settings
  enableWarnings?: boolean; // (default: true)
  enableForcedBreaks?: boolean; // (default: false)
  enableAdaptivePacing?: boolean; // (default: true)

  // Customization
  onWarning?: (warning: GuardrailWarning) => void;
  onBreakRequired?: (reason: string) => void;
  onMetricsUpdate?: (metrics: CognitiveMetrics) => void;
}

export interface GuardrailWarning {
  type: "cognitive_overload" | "fatigue" | "low_engagement" | "visual_strain" | "session_length";
  severity: "low" | "medium" | "high" | "critical";
  message: string;
  suggestion: string;
  timestamp: Date;
  metrics: CognitiveMetrics;
}

export interface CognitiveMetrics {
  // Session metrics
  sessionStartTime: Date;
  sessionDuration: number; // milliseconds
  timeSinceLastBreak: number; // milliseconds
  totalBreaksTaken: number;

  // Cognitive load
  currentComplexityScore: number; // 0-100
  informationDensity: number; // items per minute
  averageProcessingTime: number; // milliseconds

  // Engagement
  engagementScore: number; // 0-1
  interactionCount: number;
  repetitionCount: number;
  progressIndicators: number;

  // Visual metrics
  animationTime: number; // total milliseconds in animation
  currentAnimationDuration: number; // current animation duration
  screenRefreshRate: number; // refreshes per second

  // Health indicators
  fatigueScore: number; // 0-100 (higher = more fatigued)
  overloadRisk: number; // 0-100 (higher = higher risk)
  wellnessScore: number; // 0-100 (higher = better)
}

export class CognitiveGuardrailsPlugin implements Plugin {
  name = "cognitive-guardrails";
  version = "1.0.0";

  private options: Required<CognitiveGuardrailsOptions>;
  private metrics: CognitiveMetrics;
  private warnings: GuardrailWarning[] = [];
  private lastComplexityCheck = 0;
  private informationBuffer: Array<{ timestamp: number; complexity: number }> = [];
  private animationStartTime?: number;
  private lastBreakTime: number;

  constructor(options: CognitiveGuardrailsOptions = {}) {
    this.options = {
      maxSessionDuration: options.maxSessionDuration ?? 50 * 60 * 1000, // 50 minutes
      breakInterval: options.breakInterval ?? 25 * 60 * 1000, // 25 minutes
      breakDuration: options.breakDuration ?? 5 * 60 * 1000, // 5 minutes
      maxComplexityScore: options.maxComplexityScore ?? 75,
      maxInformationDensity: options.maxInformationDensity ?? 12,
      minEngagementThreshold: options.minEngagementThreshold ?? 0.3,
      maxRepetitionWithoutProgress: options.maxRepetitionWithoutProgress ?? 3,
      maxAnimationDuration: options.maxAnimationDuration ?? 30 * 60 * 1000, // 30 minutes
      animationFpsLimit: options.animationFpsLimit ?? 30,
      enableWarnings: options.enableWarnings ?? true,
      enableForcedBreaks: options.enableForcedBreaks ?? false,
      enableAdaptivePacing: options.enableAdaptivePacing ?? true,
      onWarning: options.onWarning ?? (() => {}),
      onBreakRequired: options.onBreakRequired ?? (() => {}),
      onMetricsUpdate: options.onMetricsUpdate ?? (() => {}),
    };

    const now = Date.now();
    this.lastBreakTime = now;

    this.metrics = {
      sessionStartTime: new Date(),
      sessionDuration: 0,
      timeSinceLastBreak: 0,
      totalBreaksTaken: 0,
      currentComplexityScore: 0,
      informationDensity: 0,
      averageProcessingTime: 0,
      engagementScore: 1.0,
      interactionCount: 0,
      repetitionCount: 0,
      progressIndicators: 0,
      animationTime: 0,
      currentAnimationDuration: 0,
      screenRefreshRate: 0,
      fatigueScore: 0,
      overloadRisk: 0,
      wellnessScore: 100,
    };
  }

  async onInit(config: StylerConfig): Promise<void> {
    this.displayWelcomeMessage();
    this.startMetricsMonitoring();
  }

  async onLog(entry: LogEntry): Promise<void> {
    this.updateMetrics(entry);
    this.analyzeEntry(entry);
    this.checkGuardrails();
  }

  async onShutdown(): Promise<void> {
    this.displaySessionSummary();
  }

  /**
   * Display welcome message with guardrail information
   */
  private displayWelcomeMessage(): void {
    const messages = [
      "Cognitive Guardrails Active",
      "",
      "This learning session is protected by psychological safety measures:",
      `• Session duration: ${this.formatDuration(this.options.maxSessionDuration)}`,
      `• Break intervals: ${this.formatDuration(this.options.breakInterval)}`,
      "• Cognitive load monitoring enabled",
      "• Adaptive pacing enabled",
      "",
      "Your wellbeing is prioritized. Take breaks when suggested.",
    ];

    BoxRenderer.render(messages, {
      title: "🧠 Psychological Safety",
      style: "rounded",
      padding: 1,
    });
  }

  /**
   * Update cognitive metrics based on log entry
   */
  private updateMetrics(entry: LogEntry): void {
    const now = Date.now();
    const sessionStart = this.metrics.sessionStartTime.getTime();

    // Session metrics
    this.metrics.sessionDuration = now - sessionStart;
    this.metrics.timeSinceLastBreak = now - this.lastBreakTime;

    // Complexity scoring
    const complexity = this.calculateComplexity(entry);
    this.metrics.currentComplexityScore = complexity;

    // Information density (items per minute)
    this.informationBuffer.push({ timestamp: now, complexity });
    this.informationBuffer = this.informationBuffer.filter(
      (item) => now - item.timestamp < 60000 // Keep last minute
    );
    this.metrics.informationDensity = this.informationBuffer.length;

    // Engagement tracking
    this.metrics.interactionCount++;

    // Calculate derived metrics
    this.calculateFatigueScore();
    this.calculateOverloadRisk();
    this.calculateWellnessScore();

    // Notify listeners
    this.options.onMetricsUpdate(this.metrics);
  }

  /**
   * Calculate complexity score for a log entry
   * Based on message length, metadata presence, and log level
   */
  private calculateComplexity(entry: LogEntry): number {
    let score = 0;

    // Message length (0-30 points)
    score += Math.min(30, (entry.message.length / 200) * 30);

    // Metadata complexity (0-30 points)
    if (entry.metadata) {
      const metadataSize = JSON.stringify(entry.metadata).length;
      score += Math.min(30, (metadataSize / 500) * 30);
    }

    // Log level intensity (0-20 points)
    const levelScores: Record<string, number> = {
      debug: 5,
      info: 8,
      success: 10,
      warning: 15,
      error: 18,
      critical: 20,
    };
    score += levelScores[entry.level] || 0;

    // Namespace depth (0-20 points)
    if (entry.namespace) {
      const depth = entry.namespace.split(":").length;
      score += Math.min(20, depth * 5);
    }

    return Math.min(100, score);
  }

  /**
   * Analyze entry for patterns and potential issues
   */
  private analyzeEntry(entry: LogEntry): void {
    // Check for repetitive content
    const recentEntries = this.informationBuffer.slice(-5);
    const similar = recentEntries.filter(
      (item) => Math.abs(item.complexity - this.metrics.currentComplexityScore) < 10
    );

    if (similar.length >= this.options.maxRepetitionWithoutProgress) {
      this.metrics.repetitionCount++;
      this.metrics.engagementScore = Math.max(0, this.metrics.engagementScore - 0.1);
    } else if (entry.level === "success") {
      this.metrics.progressIndicators++;
      this.metrics.engagementScore = Math.min(1, this.metrics.engagementScore + 0.05);
      this.metrics.repetitionCount = 0; // Reset on progress
    }
  }

  /**
   * Calculate fatigue score based on session duration and complexity
   */
  private calculateFatigueScore(): void {
    const durationFactor = this.metrics.sessionDuration / this.options.maxSessionDuration;
    const complexityFactor = this.metrics.currentComplexityScore / 100;
    const densityFactor = this.metrics.informationDensity / this.options.maxInformationDensity;
    const breakFactor = this.metrics.timeSinceLastBreak / this.options.breakInterval;

    this.metrics.fatigueScore = Math.min(100,
      (durationFactor * 40) +
      (complexityFactor * 20) +
      (densityFactor * 20) +
      (breakFactor * 20)
    );
  }

  /**
   * Calculate cognitive overload risk
   */
  private calculateOverloadRisk(): void {
    const complexityRisk = (this.metrics.currentComplexityScore / this.options.maxComplexityScore) * 40;
    const densityRisk = (this.metrics.informationDensity / this.options.maxInformationDensity) * 30;
    const fatigueRisk = (this.metrics.fatigueScore / 100) * 20;
    const engagementRisk = (1 - this.metrics.engagementScore) * 10;

    this.metrics.overloadRisk = Math.min(100,
      complexityRisk + densityRisk + fatigueRisk + engagementRisk
    );
  }

  /**
   * Calculate overall wellness score
   */
  private calculateWellnessScore(): void {
    const fatigueDeduction = this.metrics.fatigueScore * 0.4;
    const overloadDeduction = this.metrics.overloadRisk * 0.3;
    const engagementBonus = this.metrics.engagementScore * 20;
    const breakBonus = this.metrics.totalBreaksTaken * 5;

    this.metrics.wellnessScore = Math.max(0, Math.min(100,
      100 - fatigueDeduction - overloadDeduction + engagementBonus + breakBonus
    ));
  }

  /**
   * Check all guardrail conditions and issue warnings
   */
  private checkGuardrails(): void {
    const now = Date.now();

    // Rate limit checks to every 5 seconds
    if (now - this.lastComplexityCheck < 5000) return;
    this.lastComplexityCheck = now;

    // Check session duration
    if (this.metrics.sessionDuration > this.options.maxSessionDuration) {
      this.issueWarning({
        type: "session_length",
        severity: "critical",
        message: "Maximum learning session duration exceeded",
        suggestion: "Take a 15-30 minute break to consolidate learning and prevent burnout",
      });
    }

    // Check break interval
    if (this.metrics.timeSinceLastBreak > this.options.breakInterval) {
      this.issueWarning({
        type: "fatigue",
        severity: this.metrics.fatigueScore > 70 ? "high" : "medium",
        message: "Break interval reached",
        suggestion: `Take a ${this.formatDuration(this.options.breakDuration)} break`,
      });
    }

    // Check cognitive overload
    if (this.metrics.overloadRisk > 80) {
      this.issueWarning({
        type: "cognitive_overload",
        severity: "high",
        message: "High cognitive overload detected",
        suggestion: "Reduce information density or take a break to process",
      });
    }

    // Check information density
    if (this.metrics.informationDensity > this.options.maxInformationDensity) {
      this.issueWarning({
        type: "cognitive_overload",
        severity: "medium",
        message: "Information density exceeds optimal threshold",
        suggestion: "Slow down pacing to improve retention and understanding",
      });
    }

    // Check engagement
    if (this.metrics.engagementScore < this.options.minEngagementThreshold) {
      this.issueWarning({
        type: "low_engagement",
        severity: "medium",
        message: "Low engagement detected",
        suggestion: "Consider switching topics or taking a break",
      });
    }

    // Check visual strain from animations
    if (this.metrics.animationTime > this.options.maxAnimationDuration) {
      this.issueWarning({
        type: "visual_strain",
        severity: "medium",
        message: "Extended animation viewing detected",
        suggestion: "Rest eyes using 20-20-20 rule: look 20 feet away for 20 seconds",
      });
    }
  }

  /**
   * Issue a guardrail warning
   */
  private issueWarning(warning: Omit<GuardrailWarning, "timestamp" | "metrics">): void {
    const fullWarning: GuardrailWarning = {
      ...warning,
      timestamp: new Date(),
      metrics: { ...this.metrics },
    };

    this.warnings.push(fullWarning);

    if (this.options.enableWarnings) {
      this.displayWarning(fullWarning);
    }

    this.options.onWarning(fullWarning);

    // Trigger forced break if enabled and severity is critical
    if (this.options.enableForcedBreaks && warning.severity === "critical") {
      this.requireBreak(warning.message);
    }
  }

  /**
   * Display warning to user
   */
  private displayWarning(warning: GuardrailWarning): void {
    const severityColors: Record<string, string> = {
      low: ColorSystem.codes.blue,
      medium: ColorSystem.codes.yellow,
      high: ColorSystem.codes.brightRed,
      critical: ColorSystem.codes.red,
    };

    const severityIcons: Record<string, string> = {
      low: "ℹ️",
      medium: "⚠️",
      high: "🚨",
      critical: "🛑",
    };

    const color = severityColors[warning.severity];
    const icon = severityIcons[warning.severity];

    console.log(); // Spacing
    BoxRenderer.render([
      `${icon} ${warning.message}`,
      "",
      `💡 ${warning.suggestion}`,
      "",
      `Wellness Score: ${this.getHealthBar(this.metrics.wellnessScore)}`,
    ], {
      title: `Psychological Guardrail - ${warning.severity.toUpperCase()}`,
      style: "rounded",
    });
    console.log(); // Spacing
  }

  /**
   * Require break (for forced breaks)
   */
  private async requireBreak(reason: string): Promise<void> {
    this.options.onBreakRequired(reason);

    BoxRenderer.render([
      "🛑 Mandatory Break Required",
      "",
      reason,
      "",
      `Duration: ${this.formatDuration(this.options.breakDuration)}`,
      "",
      "Suggested break activities:",
      "• Stand up and stretch",
      "• Look away from screen (20-20-20 rule)",
      "• Hydrate",
      "• Walk around",
      "• Deep breathing exercises",
    ], {
      title: "Health & Safety Break",
      style: "double",
    });

    // Simulate break
    await this.simulateBreak();
  }

  /**
   * Simulate a break period
   */
  private async simulateBreak(): Promise<void> {
    const breakStart = Date.now();
    console.log("\n⏸️  Break timer started...\n");

    // In real implementation, this could be interactive
    await new Promise(resolve => setTimeout(resolve, this.options.breakDuration));

    this.lastBreakTime = Date.now();
    this.metrics.totalBreaksTaken++;
    this.metrics.fatigueScore = Math.max(0, this.metrics.fatigueScore - 30);

    console.log("✅ Break complete! Ready to continue learning.\n");
  }

  /**
   * Record break taken by user
   */
  takeBreak(): void {
    this.lastBreakTime = Date.now();
    this.metrics.totalBreaksTaken++;
    this.metrics.fatigueScore = Math.max(0, this.metrics.fatigueScore - 30);
    this.metrics.wellnessScore = Math.min(100, this.metrics.wellnessScore + 15);

    console.log(ColorSystem.colorize("✅ Break recorded. Wellness improved!", ColorSystem.codes.green));
  }

  /**
   * Track animation usage
   */
  trackAnimation(duration: number): void {
    this.metrics.animationTime += duration;
    this.metrics.currentAnimationDuration = duration;
  }

  /**
   * Get current metrics
   */
  getMetrics(): CognitiveMetrics {
    return { ...this.metrics };
  }

  /**
   * Get warnings history
   */
  getWarnings(filter?: { severity?: string; type?: string }): GuardrailWarning[] {
    let filtered = [...this.warnings];

    if (filter) {
      if (filter.severity) {
        filtered = filtered.filter(w => w.severity === filter.severity);
      }
      if (filter.type) {
        filtered = filtered.filter(w => w.type === filter.type);
      }
    }

    return filtered;
  }

  /**
   * Display session summary
   */
  private displaySessionSummary(): void {
    const duration = this.formatDuration(this.metrics.sessionDuration);
    const avgComplexity = this.informationBuffer.reduce((sum, item) => sum + item.complexity, 0) /
                         Math.max(1, this.informationBuffer.length);

    console.log("\n");
    BoxRenderer.render([
      "Session Summary",
      "",
      `Duration: ${duration}`,
      `Breaks taken: ${this.metrics.totalBreaksTaken}`,
      `Interactions: ${this.metrics.interactionCount}`,
      `Average complexity: ${avgComplexity.toFixed(1)}/100`,
      `Progress indicators: ${this.metrics.progressIndicators}`,
      "",
      `Final Wellness Score: ${this.getHealthBar(this.metrics.wellnessScore)}`,
      `Fatigue Level: ${this.getHealthBar(100 - this.metrics.fatigueScore)}`,
      `Engagement: ${this.getHealthBar(this.metrics.engagementScore * 100)}`,
      "",
      `Total warnings: ${this.warnings.length}`,
      this.getSessionRecommendation(),
    ], {
      title: "🧠 Cognitive Health Report",
      style: "double",
    });
  }

  /**
   * Get session recommendation based on metrics
   */
  private getSessionRecommendation(): string {
    if (this.metrics.wellnessScore > 80) {
      return "✅ Excellent session! Healthy learning patterns maintained.";
    } else if (this.metrics.wellnessScore > 60) {
      return "✓ Good session. Consider more frequent breaks next time.";
    } else if (this.metrics.wellnessScore > 40) {
      return "⚠️  Fair session. Take a longer break before continuing.";
    } else {
      return "🚨 Challenging session. Rest is recommended before learning continues.";
    }
  }

  /**
   * Start background metrics monitoring
   */
  private startMetricsMonitoring(): void {
    // Monitor metrics every 10 seconds
    setInterval(() => {
      this.calculateFatigueScore();
      this.calculateOverloadRisk();
      this.calculateWellnessScore();
    }, 10000);
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    if (minutes > 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }

    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }

  /**
   * Get health bar visualization
   */
  private getHealthBar(score: number): string {
    const normalized = Math.max(0, Math.min(100, score));
    const filled = Math.floor(normalized / 5);
    const empty = 20 - filled;

    let color: string;
    if (normalized >= 70) color = ColorSystem.codes.green;
    else if (normalized >= 40) color = ColorSystem.codes.yellow;
    else color = ColorSystem.codes.red;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    return `${ColorSystem.colorize(bar, color)} ${normalized.toFixed(0)}%`;
  }
}
