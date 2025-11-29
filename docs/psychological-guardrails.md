# Psychological Guardrails for Accelerated Learning

## Overview

Genesis-trace's psychological guardrails are a comprehensive system designed to protect users from cognitive overload, mental fatigue, and unhealthy learning patterns when using the library's accelerated learning capabilities.

### Why Guardrails Matter

Research shows that while accelerated learning techniques can improve information retention by 30-50%, they also come with risks:

- **Cognitive Overload**: Too much information too quickly overwhelms working memory
- **Attention Fatigue**: Extended focus periods reduce comprehension and retention
- **Visual Strain**: Prolonged animation viewing causes eye fatigue and headaches
- **False Confidence**: Rapid exposure can create illusion of understanding without true comprehension
- **Burnout**: Unsustainable learning pace leads to mental exhaustion

The psychological guardrails system addresses these risks through **active monitoring**, **adaptive pacing**, and **intervention mechanisms**.

## Core Components

### 1. Cognitive Guardrails Plugin

The main plugin that monitors psychological safety metrics.

```typescript
import { CognitiveGuardrailsPlugin } from "./plugins/cognitive-guardrails.ts";
import { ConfigBuilder, Logger } from "./mod.ts";

const guardrails = new CognitiveGuardrailsPlugin({
  // Session limits
  maxSessionDuration: 50 * 60 * 1000,    // 50 minutes (Pomodoro-based)
  breakInterval: 25 * 60 * 1000,          // 25 minutes
  breakDuration: 5 * 60 * 1000,           // 5 minute breaks

  // Cognitive thresholds
  maxComplexityScore: 75,                 // 0-100 scale
  maxInformationDensity: 12,              // items per minute

  // Engagement
  minEngagementThreshold: 0.3,            // 0-1 scale
  maxRepetitionWithoutProgress: 3,

  // Visual health
  maxAnimationDuration: 30 * 60 * 1000,   // 30 minutes

  // Controls
  enableWarnings: true,
  enableForcedBreaks: false,              // Set true for mandatory breaks
  enableAdaptivePacing: true,
});

const logger = new Logger(
  new ConfigBuilder()
    .plugin(guardrails)
    .build()
);
```

### 2. Adaptive Pacing Controller

Dynamically adjusts content delivery speed based on user comprehension.

```typescript
import { AdaptivePacingController } from "./plugins/adaptive-pacing.ts";

const pacing = new AdaptivePacingController({
  baseSpeed: 1.0,                    // Normal speed
  minSpeed: 0.3,                     // Slowest allowed
  maxSpeed: 1.5,                     // Fastest allowed

  adaptationRate: 0.1,               // How quickly to adapt
  compressionThreshold: 0.7,         // Slow down below this
  masteryThreshold: 0.85,            // Speed up above this

  allowAutoAdjust: true,
  showPacingIndicators: true,
});

// Use in your learning application
const delay = pacing.calculateDelay(1000); // Adaptive delay
const fps = pacing.calculateFPS(30);       // Adaptive frame rate
```

## Cognitive Metrics

The system tracks comprehensive cognitive health metrics:

### Session Metrics
- **Session Duration**: Total time in learning mode
- **Time Since Last Break**: Tracks break adherence
- **Total Breaks Taken**: Cumulative break count

### Cognitive Load
- **Complexity Score** (0-100): Current content difficulty
- **Information Density**: Items presented per minute
- **Processing Time**: Average time to process content

### Engagement
- **Engagement Score** (0-1): User interaction quality
- **Repetition Count**: Stuck/confused indicators
- **Progress Indicators**: Success markers

### Health Indicators
- **Fatigue Score** (0-100): Mental tiredness level
- **Overload Risk** (0-100): Cognitive overload probability
- **Wellness Score** (0-100): Overall cognitive health

## Complexity Calculation

Content complexity is calculated using multiple factors:

```typescript
Complexity Score = Message Length (0-30 points)
                 + Metadata Size (0-30 points)
                 + Log Level Intensity (0-20 points)
                 + Namespace Depth (0-20 points)
```

**Example:**
```typescript
logger.info("Simple message");
// Low complexity: ~15/100

logger.error("Database connection failed", {
  host: "db.example.com",
  port: 5432,
  error: new Error("Timeout"),
  stackTrace: "...",
  retryAttempts: 5,
  metadata: { /* ... */ }
});
// High complexity: ~75/100
```

## Warning System

The system issues tiered warnings based on severity:

### Warning Types

1. **cognitive_overload**: Too much information too quickly
2. **fatigue**: Mental tiredness detected
3. **low_engagement**: User disengagement
4. **visual_strain**: Eye strain from animations
5. **session_length**: Excessive session duration

### Severity Levels

- **Low** (ℹ️): Informational, no action needed
- **Medium** (⚠️): Should consider adjusting
- **High** (🚨): Action recommended
- **Critical** (🛑): Immediate action required (can trigger forced breaks)

### Custom Warning Handlers

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  onWarning: (warning) => {
    // Log to analytics
    analytics.track("learning_warning", {
      type: warning.type,
      severity: warning.severity,
      wellnessScore: warning.metrics.wellnessScore,
    });

    // Send notifications
    if (warning.severity === "critical") {
      notifyUser("Take a break to maintain learning quality");
    }
  },

  onBreakRequired: (reason) => {
    // Pause content delivery
    contentPlayer.pause();

    // Show break screen
    showBreakScreen(reason);
  },

  onMetricsUpdate: (metrics) => {
    // Update dashboard
    dashboard.updateMetrics(metrics);
  },
});
```

## Adaptive Pacing

The pacing system automatically adjusts speed based on comprehension signals.

### Comprehension Signals

```typescript
// After presenting content
pacing.updateComprehension({
  timeOnContent: 3000,        // Time spent (ms)
  interactionCount: 4,        // User interactions
  progressMade: true,         // Success indicator
  errorOccurred: false,       // Error/confusion
  repetitionNeeded: false,    // Had to repeat
  complexityScore: 0.7,       // Content difficulty
});
```

### Pacing Logic

```
IF comprehension < 70%:
  → Slow down by up to 10%
  → Reduce information density

ELSE IF comprehension > 85%:
  → Speed up by up to 5%
  → Can handle more complex content

IF difficulty > 70%:
  → Reduce speed by 10%
  → Regardless of comprehension
```

### Manual Override

Users can manually control pacing:

```typescript
// Slow down
pacing.setSpeed(0.5, true); // userOverride = true

// Speed up
pacing.setSpeed(1.5, true);

// Reset to automatic
pacing.reset();
```

## Learning Profile

The system builds a personalized learning profile:

```typescript
interface LearningProfile {
  processingSpeed: number;        // How fast user processes (0-1)
  workingMemoryCapacity: number;  // Memory capacity estimate (0-1)
  priorKnowledge: number;         // Domain familiarity (0-1)
  preferredPace: number;          // User's ideal speed
  attentionSpan: number;          // Attention duration (ms)
}
```

### Profile Calibration

The profile auto-calibrates from session data:

```typescript
pacing.calibrateFromHistory({
  avgComprehension: 0.82,
  avgSpeed: 1.2,
  successRate: 0.85,
});

// Displays updated profile
pacing.displayProfile();
```

### Session Recommendations

Get personalized session structure:

```typescript
const recommendation = pacing.getSessionRecommendation();

console.log(recommendation);
// {
//   sessionDuration: 3000000,      // 50 minutes
//   breakInterval: 1500000,        // 25 minutes
//   startingSpeed: 1.1,            // Slightly faster
//   contentComplexity: "medium"    // Recommended level
// }
```

## Best Practices

### 1. Enable Guardrails for All Learning Content

```typescript
// Always use for educational content
const learningLogger = new Logger(
  new ConfigBuilder()
    .plugin(new CognitiveGuardrailsPlugin())
    .build()
);
```

### 2. Integrate with Animations

```typescript
const animationStart = Date.now();

// Run animation
await runAnimation();

const duration = Date.now() - animationStart;
guardrails.trackAnimation(duration);
```

### 3. Track Progress Explicitly

```typescript
// On successful learning milestone
logger.success("Concept mastered!");

pacing.updateComprehension({
  progressMade: true,
  complexityScore: currentComplexity,
});
```

### 4. Honor Break Recommendations

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  enableForcedBreaks: true, // Enforce breaks

  onBreakRequired: async (reason) => {
    await pauseAllLearning();
    await showBreakTimer();
    await resumeLearning();
  },
});
```

### 5. Monitor Metrics in Production

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  onMetricsUpdate: (metrics) => {
    // Send to analytics
    analytics.track("cognitive_metrics", {
      wellnessScore: metrics.wellnessScore,
      fatigueScore: metrics.fatigueScore,
      engagementScore: metrics.engagementScore,
    });

    // Alert on poor wellness
    if (metrics.wellnessScore < 40) {
      alertAdministrator("User experiencing learning difficulty");
    }
  },
});
```

## Grounding Exercise Infographic

When cognitive guardrails issue repeated warnings or force a break, use grounding exercises before resuming instruction. The infographic below combines detection cues, facilitation language, and UI hooks you can render through the break overlay.

```text
╔════════════════════════════════════════════════════════════════════════╗
║        G R O U N D I N G   E X E R C I S E S   R E S P O N S E          ║
╠════════════════════════════════════════════════════════════════════════╣
║ SIGNALS (metrics)                                                      ║
║ - overloadRisk >= 70      - fatigueScore >= 60                         ║
║ - engagementScore < 0.25  - forced break or panic language             ║
║ - animation duration beyond limit or rapid warning escalation          ║
╠════════════════════════════════════════════════════════════════════════╣
║ FLOW                                                                   ║
║ DETECT -> ACKNOWLEDGE -> GUIDE -> REINTEGRATE                          ║
║ ┌──────────────┐ ┌──────────────────────┐ ┌──────────────────────────┐ ║
║ │ Guardrails   │ │ Explain how pausing  │ │ Lead 1-2 exercises with │ ║
║ │ warning hook │ │ protects cognition   │ │ timers + sensory cues   │ ║
║ └──────────────┘ └──────────────────────┘ └──────────────────────────┘ ║
║                           ↓                                            ║
║ Prompt reflection, reset pacing, resume content intentionally          ║
╚════════════════════════════════════════════════════════════════════════╝
```

```text
╔══════════════════════╦══════════════════════╦══════════════════════════╗
║ 5-4-3-2-1 Senses     ║ Box Breathing 4x4    ║ Micro-Movement Reset     ║
╠══════════════════════╬══════════════════════╬══════════════════════════╣
║ Use: racing thoughts ║ Use: elevated pulse  ║ Use: restlessness, eye   ║
║ or dissociation.     ║ or shallow breathing.║ strain, screen fatigue.  ║
║ UI: mute colors,     ║ UI: pulsating frame  ║ UI: warm gradient plus   ║
║ show large counter.  ║ with looping breath  ║ subtle metronome dots.   ║
║ Script: "Name 5 see, ║ bar.                 ║ Script: "Press feet, roll║
║ 4 touch, 3 hear, 2   ║ Script: "Inhale 4,   ║ shoulders, stretch neck, ║
║ smell, 1 taste."     ║ hold 4, exhale 4,    ║ shake hands."            ║
║ Timing: 60 s tracker ║ hold 4."             ║ Timing: 45 s pulses.     ║
║ Re-entry: ask "What  ║ Timing: 4 cycles     ║ Re-entry: highlight body ║
║ felt real right now?"║ (about 64 s).        ║ check + ask "What changed║
║                      ║ Re-entry: show heart ║ in your body?"           ║
║                      ║ rate dial + readiness║                          ║
║                      ║ prompt.              ║                          ║
╚══════════════════════╩══════════════════════╩══════════════════════════╝
```

Implementation cues:

- Trigger the overlay from `onWarning` when overload or fatigue crosses the listed thresholds, and switch to `onBreakRequired` if a forced pause is active.
- Surface pacing data next to the infographic so users know the system is intentionally slowing content.
- Track completion timestamps for each exercise inside `guardrails.onMetricsUpdate` to prove the intervention happened before resuming the session.

## Research Foundation

These guardrails are based on established cognitive science:

### Cognitive Load Theory (Sweller, 1988)
- Working memory has limited capacity (7±2 items)
- Exceeding capacity reduces learning effectiveness
- **Implementation**: Complexity scoring and information density limits

### Spaced Repetition (Ebbinghaus, 1885)
- Memory retention improves with spaced review
- Cramming leads to rapid forgetting
- **Implementation**: Break intervals and session duration limits

### Attention Restoration Theory (Kaplan & Kaplan, 1989)
- Directed attention is a finite resource
- Restoration requires breaks from focused tasks
- **Implementation**: Mandatory breaks and fatigue monitoring

### Flow State Research (Csikszentmihalyi, 1990)
- Optimal learning occurs in the "flow zone"
- Balance between challenge and skill is crucial
- **Implementation**: Adaptive pacing based on comprehension

### Desirable Difficulty (Bjork, 1994)
- Some difficulty enhances learning
- Too easy or too hard reduces effectiveness
- **Implementation**: Dynamic difficulty adjustment

## Example Implementation

Complete example of a learning application with guardrails:

```typescript
import {
  AnimationLoop,
  ConfigBuilder,
  Logger,
  ProgressBar,
} from "jsr:@pedromdominguez/genesis-trace";
import { CognitiveGuardrailsPlugin } from "./plugins/cognitive-guardrails.ts";
import { AdaptivePacingController } from "./plugins/adaptive-pacing.ts";

// Setup
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 50 * 60 * 1000,
  enableWarnings: true,
  enableAdaptivePacing: true,
});

const logger = new Logger(
  new ConfigBuilder().plugin(guardrails).build()
);

const pacing = new AdaptivePacingController();

// Learning session
async function teachConcept(concept: Concept) {
  logger.info(`Learning: ${concept.name}`);

  // Track difficulty
  pacing.updateDifficulty(concept.complexity);

  // Present content with adaptive timing
  await presentContent(concept, pacing.calculateDelay(5000));

  // Check comprehension
  const understood = await assessUnderstanding(concept);

  // Update pacing
  pacing.updateComprehension({
    progressMade: understood,
    complexityScore: concept.complexity,
    interactionCount: concept.interactions,
  });

  if (understood) {
    logger.success(`Mastered: ${concept.name}`);
  } else {
    logger.warning(`Review needed: ${concept.name}`);
  }
}

// Run course with progress tracking
async function runCourse(concepts: Concept[]) {
  const progress = new ProgressBar({
    total: concepts.length,
    label: "Course Progress",
  });

  for (let i = 0; i < concepts.length; i++) {
    await teachConcept(concepts[i]);
    progress.update(i + 1);

    // Adaptive spacing between concepts
    await sleep(pacing.calculateDelay(2000));
  }

  progress.complete("Course completed!");

  // Show session summary
  await logger.shutdown();
}
```

## Metrics Dashboard

Display real-time cognitive health:

```typescript
function displayWellnessDashboard() {
  const metrics = guardrails.getMetrics();

  console.log(`
╔══════════════════════════════════════╗
║     Cognitive Wellness Dashboard     ║
╠══════════════════════════════════════╣
║                                      ║
║  Wellness Score:  ${getBar(metrics.wellnessScore)}  ║
║  Fatigue Level:   ${getBar(metrics.fatigueScore)}  ║
║  Engagement:      ${getBar(metrics.engagementScore * 100)}  ║
║  Overload Risk:   ${getBar(metrics.overloadRisk)}  ║
║                                      ║
║  Session: ${formatDuration(metrics.sessionDuration)}                   ║
║  Breaks:  ${metrics.totalBreaksTaken}                          ║
║                                      ║
╚══════════════════════════════════════╝
  `);
}
```

## Configuration Reference

### CognitiveGuardrailsOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxSessionDuration` | number | 3000000 (50 min) | Maximum learning session length |
| `breakInterval` | number | 1500000 (25 min) | Time between required breaks |
| `breakDuration` | number | 300000 (5 min) | Length of breaks |
| `maxComplexityScore` | number | 75 | Maximum content complexity (0-100) |
| `maxInformationDensity` | number | 12 | Maximum items per minute |
| `minEngagementThreshold` | number | 0.3 | Minimum acceptable engagement (0-1) |
| `maxRepetitionWithoutProgress` | number | 3 | Max repeated attempts before warning |
| `maxAnimationDuration` | number | 1800000 (30 min) | Maximum animation viewing time |
| `animationFpsLimit` | number | 30 | Maximum animation frame rate |
| `enableWarnings` | boolean | true | Show warning messages |
| `enableForcedBreaks` | boolean | false | Enforce mandatory breaks |
| `enableAdaptivePacing` | boolean | true | Enable automatic pacing adjustment |

### PacingOptions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseSpeed` | number | 1.0 | Initial speed multiplier |
| `minSpeed` | number | 0.3 | Minimum allowed speed |
| `maxSpeed` | number | 1.5 | Maximum allowed speed |
| `adaptationRate` | number | 0.1 | Speed of adaptation (0-1) |
| `compressionThreshold` | number | 0.7 | Slow down below this comprehension |
| `masteryThreshold` | number | 0.85 | Speed up above this comprehension |
| `preferredComplexity` | string | "medium" | Target complexity level |
| `allowAutoAdjust` | boolean | true | Enable auto-adjustment |
| `showPacingIndicators` | boolean | true | Display speed changes |

## Troubleshooting

### Too Many Warnings

If you're getting excessive warnings:

```typescript
// Adjust thresholds
const guardrails = new CognitiveGuardrailsPlugin({
  maxComplexityScore: 85,      // Allow more complexity
  maxInformationDensity: 15,   // Allow faster pace
  minEngagementThreshold: 0.2, // Lower engagement bar
});
```

### Pacing Too Aggressive

```typescript
// Reduce adaptation rate
const pacing = new AdaptivePacingController({
  adaptationRate: 0.05,  // Slower adjustments
  minSpeed: 0.5,         // Don't go too slow
  maxSpeed: 1.2,         // Don't go too fast
});
```

### False Overload Detection

```typescript
// Increase information window
const guardrails = new CognitiveGuardrailsPlugin({
  maxInformationDensity: 20,  // Higher threshold
});

// Or disable for specific sections
guardrails.configure({ enableWarnings: false });
// ... high-density content ...
guardrails.configure({ enableWarnings: true });
```

## Conclusion

Psychological guardrails transform genesis-trace from a powerful visualization tool into a **responsible learning platform**. By monitoring cognitive load, adapting to user needs, and enforcing healthy learning patterns, these systems enable sustained accelerated learning without burnout.

**Remember**: The goal isn't to prevent learning, but to **optimize it for long-term retention and mental health**.

## Further Reading

- [Cognitive Load Theory](https://en.wikipedia.org/wiki/Cognitive_load)
- [Spaced Repetition Systems](https://en.wikipedia.org/wiki/Spaced_repetition)
- [Flow State](https://en.wikipedia.org/wiki/Flow_(psychology))
- [Desirable Difficulty](https://bjorklab.psych.ucla.edu/research/)

---

*Genesis-trace: Accelerated learning with psychological safety built-in.*
