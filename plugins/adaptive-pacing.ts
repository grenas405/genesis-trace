// plugins/adaptive-pacing.ts
/**
 * Adaptive Pacing Controller
 *
 * Dynamically adjusts content delivery speed based on user comprehension,
 * engagement, and cognitive load to optimize learning outcomes.
 *
 * Implements research-based principles:
 * - Zone of Proximal Development (Vygotsky, 1978)
 * - Desirable Difficulty (Bjork, 1994)
 * - Adaptive Learning Systems (VanLehn, 2011)
 */

import { ColorSystem } from "../core/colors.ts";
import { BoxRenderer } from "../components/boxes.ts";

export interface PacingOptions {
  // Base pacing
  baseSpeed?: number; // 0.5 (slow) to 2.0 (fast), default 1.0
  minSpeed?: number; // minimum allowed speed (default: 0.3)
  maxSpeed?: number; // maximum allowed speed (default: 1.5)

  // Adaptation parameters
  adaptationRate?: number; // how quickly to adjust (0-1, default: 0.1)
  compressionThreshold?: number; // when to slow down (default: 0.7)
  masteryThreshold?: number; // when to speed up (default: 0.85)

  // Learning style preferences
  preferredComplexity?: "low" | "medium" | "high"; // default: "medium"
  allowAutoAdjust?: boolean; // enable automatic speed adjustment (default: true)

  // Feedback settings
  showPacingIndicators?: boolean; // display speed changes (default: true)
  collectUserFeedback?: boolean; // ask for pacing feedback (default: false)
}

export interface PacingState {
  currentSpeed: number; // current delivery speed multiplier
  comprehensionScore: number; // estimated comprehension (0-1)
  difficultyLevel: number; // current content difficulty (0-1)
  adjustmentHistory: PacingAdjustment[];
  recommendedSpeed: number; // AI-recommended speed
  userOverride?: number; // user manual override
}

export interface PacingAdjustment {
  timestamp: Date;
  previousSpeed: number;
  newSpeed: number;
  reason: string;
  comprehensionScore: number;
}

export interface LearningProfile {
  processingSpeed: number; // how fast user processes info (0-1)
  workingMemoryCapacity: number; // estimated capacity (0-1)
  priorKnowledge: number; // domain familiarity (0-1)
  preferredPace: number; // user's preferred speed
  attentionSpan: number; // attention duration in ms
}

export class AdaptivePacingController {
  private options: Required<PacingOptions>;
  private state: PacingState;
  private profile: LearningProfile;
  private comprehensionSignals: number[] = [];
  private lastAdjustment = 0;

  constructor(options: PacingOptions = {}) {
    this.options = {
      baseSpeed: options.baseSpeed ?? 1.0,
      minSpeed: options.minSpeed ?? 0.3,
      maxSpeed: options.maxSpeed ?? 1.5,
      adaptationRate: options.adaptationRate ?? 0.1,
      compressionThreshold: options.compressionThreshold ?? 0.7,
      masteryThreshold: options.masteryThreshold ?? 0.85,
      preferredComplexity: options.preferredComplexity ?? "medium",
      allowAutoAdjust: options.allowAutoAdjust ?? true,
      showPacingIndicators: options.showPacingIndicators ?? true,
      collectUserFeedback: options.collectUserFeedback ?? false,
    };

    this.state = {
      currentSpeed: this.options.baseSpeed,
      comprehensionScore: 0.75, // Assume medium comprehension initially
      difficultyLevel: 0.5,
      adjustmentHistory: [],
      recommendedSpeed: this.options.baseSpeed,
    };

    this.profile = {
      processingSpeed: 0.5,
      workingMemoryCapacity: 0.5,
      priorKnowledge: 0.5,
      preferredPace: this.options.baseSpeed,
      attentionSpan: 25 * 60 * 1000, // 25 minutes default
    };
  }

  /**
   * Update comprehension estimate based on signals
   */
  updateComprehension(signals: {
    timeOnContent?: number; // time spent (ms)
    interactionCount?: number; // number of interactions
    progressMade?: boolean; // made progress indicator
    errorOccurred?: boolean; // error or confusion
    repetitionNeeded?: boolean; // needed to repeat
    complexityScore?: number; // content complexity (0-1)
  }): void {
    let comprehension = this.state.comprehensionScore;

    // Time on content (longer time = lower comprehension for same content)
    if (signals.timeOnContent && signals.complexityScore) {
      const expectedTime = signals.complexityScore * 60000; // 1 min per complexity point
      const timeRatio = signals.timeOnContent / expectedTime;

      if (timeRatio > 1.5) {
        comprehension -= 0.1; // Taking too long
      } else if (timeRatio < 0.5) {
        comprehension += 0.05; // Quick comprehension
      }
    }

    // Interaction signals
    if (signals.interactionCount !== undefined) {
      // Moderate interaction is good; too little or too much suggests issues
      if (signals.interactionCount >= 2 && signals.interactionCount <= 5) {
        comprehension += 0.05;
      } else if (signals.interactionCount > 10) {
        comprehension -= 0.1; // Excessive interaction = confusion
      }
    }

    // Direct signals
    if (signals.progressMade) comprehension += 0.15;
    if (signals.errorOccurred) comprehension -= 0.2;
    if (signals.repetitionNeeded) comprehension -= 0.15;

    // Update state
    this.state.comprehensionScore = Math.max(0, Math.min(1, comprehension));
    this.comprehensionSignals.push(this.state.comprehensionScore);

    // Keep last 10 signals
    if (this.comprehensionSignals.length > 10) {
      this.comprehensionSignals.shift();
    }

    // Trigger adaptation check
    this.considerPacingAdjustment();
  }

  /**
   * Update content difficulty
   */
  updateDifficulty(difficulty: number): void {
    this.state.difficultyLevel = Math.max(0, Math.min(1, difficulty));
    this.considerPacingAdjustment();
  }

  /**
   * Consider adjusting pacing based on current state
   */
  private considerPacingAdjustment(): void {
    if (!this.options.allowAutoAdjust) return;

    const now = Date.now();

    // Rate limit adjustments to every 30 seconds
    if (now - this.lastAdjustment < 30000) return;

    const avgComprehension = this.comprehensionSignals.length > 0
      ? this.comprehensionSignals.reduce((a, b) => a + b, 0) / this.comprehensionSignals.length
      : this.state.comprehensionScore;

    let newSpeed = this.state.currentSpeed;
    let reason = "";

    // Slow down if comprehension is low
    if (avgComprehension < this.options.compressionThreshold) {
      const adjustment = (this.options.compressionThreshold - avgComprehension) * this.options.adaptationRate;
      newSpeed = this.state.currentSpeed - adjustment;
      reason = `Comprehension below threshold (${(avgComprehension * 100).toFixed(0)}%)`;
    }
    // Speed up if mastery detected
    else if (avgComprehension > this.options.masteryThreshold) {
      const adjustment = (avgComprehension - this.options.masteryThreshold) * this.options.adaptationRate * 0.5;
      newSpeed = this.state.currentSpeed + adjustment;
      reason = `High comprehension detected (${(avgComprehension * 100).toFixed(0)}%)`;
    }

    // Adjust for difficulty
    if (this.state.difficultyLevel > 0.7) {
      newSpeed *= 0.9; // Slow down for hard content
      reason += reason ? "; High difficulty content" : "High difficulty content";
    }

    // Apply limits
    newSpeed = Math.max(this.options.minSpeed, Math.min(this.options.maxSpeed, newSpeed));

    // Only adjust if significant change
    if (Math.abs(newSpeed - this.state.currentSpeed) > 0.05) {
      this.adjustSpeed(newSpeed, reason);
    }
  }

  /**
   * Manually adjust speed
   */
  setSpeed(speed: number, userOverride = false): void {
    const clampedSpeed = Math.max(this.options.minSpeed, Math.min(this.options.maxSpeed, speed));

    if (userOverride) {
      this.state.userOverride = clampedSpeed;
    }

    this.adjustSpeed(clampedSpeed, userOverride ? "User override" : "Manual adjustment");
  }

  /**
   * Apply speed adjustment
   */
  private adjustSpeed(newSpeed: number, reason: string): void {
    const previousSpeed = this.state.currentSpeed;

    this.state.adjustmentHistory.push({
      timestamp: new Date(),
      previousSpeed,
      newSpeed,
      reason,
      comprehensionScore: this.state.comprehensionScore,
    });

    this.state.currentSpeed = newSpeed;
    this.state.recommendedSpeed = newSpeed;
    this.lastAdjustment = Date.now();

    if (this.options.showPacingIndicators) {
      this.displayPacingChange(previousSpeed, newSpeed, reason);
    }
  }

  /**
   * Display pacing change notification
   */
  private displayPacingChange(oldSpeed: number, newSpeed: number, reason: string): void {
    const direction = newSpeed > oldSpeed ? "↑" : "↓";
    const color = newSpeed > oldSpeed ? ColorSystem.codes.green : ColorSystem.codes.yellow;

    const change = ((newSpeed - oldSpeed) / oldSpeed * 100).toFixed(0);
    const message = ColorSystem.colorize(
      `${direction} Pacing adjusted: ${oldSpeed.toFixed(2)}x → ${newSpeed.toFixed(2)}x (${change > "0" ? "+" : ""}${change}%)`,
      color
    );

    console.log(`\n${message}`);
    console.log(ColorSystem.colorize(`   Reason: ${reason}`, ColorSystem.codes.dim));
    console.log(ColorSystem.colorize(`   Comprehension: ${this.getComprehensionBar()}`, ColorSystem.codes.dim));
    console.log();
  }

  /**
   * Get current speed multiplier
   */
  getSpeed(): number {
    return this.state.userOverride ?? this.state.currentSpeed;
  }

  /**
   * Get pacing state
   */
  getState(): PacingState {
    return { ...this.state };
  }

  /**
   * Calculate optimal delay for animations/content
   */
  calculateDelay(baseDelay: number): number {
    return baseDelay / this.getSpeed();
  }

  /**
   * Calculate optimal FPS for animations
   */
  calculateFPS(baseFPS: number): number {
    const speed = this.getSpeed();

    // Don't exceed 60 FPS, but can reduce for slower pace
    if (speed >= 1.0) {
      return baseFPS;
    } else {
      return Math.max(15, Math.floor(baseFPS * speed)); // Min 15 FPS
    }
  }

  /**
   * Get learning profile
   */
  getProfile(): LearningProfile {
    return { ...this.profile };
  }

  /**
   * Update learning profile based on session data
   */
  updateProfile(updates: Partial<LearningProfile>): void {
    this.profile = { ...this.profile, ...updates };
  }

  /**
   * Calibrate profile from session history
   */
  calibrateFromHistory(sessionData: {
    avgComprehension: number;
    avgSpeed: number;
    successRate: number;
  }): void {
    // Update processing speed estimate
    this.profile.processingSpeed = sessionData.avgSpeed / this.options.baseSpeed;

    // Update working memory from comprehension
    this.profile.workingMemoryCapacity = sessionData.avgComprehension;

    // Update preferred pace
    if (sessionData.successRate > 0.8) {
      this.profile.preferredPace = sessionData.avgSpeed * 1.1; // Can handle faster
    } else if (sessionData.successRate < 0.6) {
      this.profile.preferredPace = sessionData.avgSpeed * 0.9; // Needs slower
    }

    console.log(ColorSystem.colorize("✓ Learning profile calibrated", ColorSystem.codes.green));
    this.displayProfile();
  }

  /**
   * Display current profile
   */
  displayProfile(): void {
    BoxRenderer.render([
      "Learning Profile",
      "",
      `Processing Speed: ${this.getMetricBar(this.profile.processingSpeed)}`,
      `Working Memory: ${this.getMetricBar(this.profile.workingMemoryCapacity)}`,
      `Prior Knowledge: ${this.getMetricBar(this.profile.priorKnowledge)}`,
      `Preferred Pace: ${this.profile.preferredPace.toFixed(2)}x`,
      `Attention Span: ${Math.floor(this.profile.attentionSpan / 60000)} minutes`,
      "",
      `Current Speed: ${this.state.currentSpeed.toFixed(2)}x`,
      `Comprehension: ${this.getComprehensionBar()}`,
    ], {
      title: "🎯 Adaptive Learning Profile",
      style: "rounded",
    });
  }

  /**
   * Get recommendation for optimal session structure
   */
  getSessionRecommendation(): {
    sessionDuration: number;
    breakInterval: number;
    startingSpeed: number;
    contentComplexity: "low" | "medium" | "high";
  } {
    // Adjust session length based on attention span
    const sessionDuration = Math.min(50 * 60 * 1000, this.profile.attentionSpan * 2);
    const breakInterval = this.profile.attentionSpan;

    // Adjust starting speed based on profile
    const startingSpeed = this.profile.preferredPace *
                         (0.7 + this.profile.processingSpeed * 0.3);

    // Recommend complexity based on prior knowledge
    let contentComplexity: "low" | "medium" | "high";
    if (this.profile.priorKnowledge < 0.3) {
      contentComplexity = "low";
    } else if (this.profile.priorKnowledge < 0.7) {
      contentComplexity = "medium";
    } else {
      contentComplexity = "high";
    }

    return {
      sessionDuration,
      breakInterval,
      startingSpeed,
      contentComplexity,
    };
  }

  /**
   * Reset to defaults
   */
  reset(): void {
    this.state.currentSpeed = this.options.baseSpeed;
    this.state.comprehensionScore = 0.75;
    this.state.userOverride = undefined;
    this.comprehensionSignals = [];
  }

  /**
   * Generate comprehension bar
   */
  private getComprehensionBar(): string {
    return this.getMetricBar(this.state.comprehensionScore);
  }

  /**
   * Generate metric bar visualization
   */
  private getMetricBar(value: number): string {
    const normalized = Math.max(0, Math.min(1, value));
    const filled = Math.floor(normalized * 20);
    const empty = 20 - filled;

    let color: string;
    if (normalized >= 0.7) color = ColorSystem.codes.green;
    else if (normalized >= 0.4) color = ColorSystem.codes.yellow;
    else color = ColorSystem.codes.red;

    const bar = "█".repeat(filled) + "░".repeat(empty);
    return `${ColorSystem.colorize(bar, color)} ${(normalized * 100).toFixed(0)}%`;
  }
}
