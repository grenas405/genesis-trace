# Psychological Guardrails - Quick Start Guide

Get started with cognitive safety features in 5 minutes.

## Installation

```typescript
import {
  ConfigBuilder,
  Logger,
  CognitiveGuardrailsPlugin,
  AdaptivePacingController,
} from "jsr:@pedromdominguez/genesis-trace";
```

## Basic Setup (2 minutes)

### Step 1: Create Guardrails Plugin

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 50 * 60 * 1000,  // 50 minutes
  breakInterval: 25 * 60 * 1000,        // 25 minutes
  enableWarnings: true,
});
```

### Step 2: Add to Logger

```typescript
const logger = new Logger(
  new ConfigBuilder()
    .plugin(guardrails)
    .build()
);
```

### Step 3: Use Normally

```typescript
logger.info("Learning quantum mechanics...");
logger.debug("Processing Schrödinger equation", {
  complexity: 0.85,
  priorKnowledge: 0.6,
});
logger.success("Concept understood!");

// Guardrails monitor automatically in background
```

That's it! You now have basic cognitive protection.

## Advanced Setup (5 minutes)

### Add Adaptive Pacing

```typescript
const pacing = new AdaptivePacingController({
  baseSpeed: 1.0,
  allowAutoAdjust: true,
});

// Use adaptive delays
await sleep(pacing.calculateDelay(1000));

// Update based on comprehension
pacing.updateComprehension({
  progressMade: true,
  complexityScore: 0.7,
});
```

### Complete Example

```typescript
import {
  AnimationLoop,
  ConfigBuilder,
  Logger,
  CognitiveGuardrailsPlugin,
  AdaptivePacingController,
} from "jsr:@pedromdominguez/genesis-trace";

// Setup
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 50 * 60 * 1000,
  breakInterval: 25 * 60 * 1000,
  enableWarnings: true,

  onWarning: (warning) => {
    console.log(`⚠️  ${warning.message}`);
  },
});

const logger = new Logger(
  new ConfigBuilder().plugin(guardrails).build()
);

const pacing = new AdaptivePacingController();

// Learning loop
async function teachTopic(topic: Topic) {
  logger.info(`Learning: ${topic.name}`);

  // Set difficulty
  pacing.updateDifficulty(topic.complexity);

  // Present with adaptive timing
  await presentContent(topic, pacing.calculateDelay(5000));

  // Check understanding
  const understood = await quiz(topic);

  // Update pacing
  pacing.updateComprehension({
    progressMade: understood,
    complexityScore: topic.complexity,
  });

  if (understood) {
    logger.success(`Mastered: ${topic.name}`);
  }
}

// Cleanup
await logger.shutdown(); // Shows session summary
```

## Common Patterns

### Pattern 1: Animation with Guardrails

```typescript
// Track animation usage
const animStart = Date.now();

const loop = new AnimationLoop({ fps: pacing.calculateFPS(30) });
loop.start();

// ... animation code ...

loop.stop();
guardrails.trackAnimation(Date.now() - animStart);
```

### Pattern 2: Progress Tracking

```typescript
for (const lesson of lessons) {
  await teachLesson(lesson);

  pacing.updateComprehension({
    progressMade: true,
    complexityScore: lesson.difficulty,
  });

  // Adaptive spacing
  await sleep(pacing.calculateDelay(2000));
}
```

### Pattern 3: Manual Breaks

```typescript
// User takes break
guardrails.takeBreak();

// Wellness improves, fatigue reduced
```

### Pattern 4: Forced Breaks

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  enableForcedBreaks: true, // Enforce breaks

  onBreakRequired: async (reason) => {
    await pauseLearning();
    await showBreakTimer(5 * 60 * 1000); // 5 min
    await resumeLearning();
  },
});
```

## Monitoring Health

### Get Current Metrics

```typescript
const metrics = guardrails.getMetrics();

console.log(`Wellness: ${metrics.wellnessScore}/100`);
console.log(`Fatigue: ${metrics.fatigueScore}/100`);
console.log(`Engagement: ${(metrics.engagementScore * 100).toFixed(0)}%`);
```

### Display Dashboard

```typescript
import { TableRenderer } from "jsr:@pedromdominguez/genesis-trace";

const metrics = guardrails.getMetrics();

TableRenderer.render([
  { Metric: "Wellness", Value: metrics.wellnessScore },
  { Metric: "Fatigue", Value: metrics.fatigueScore },
  { Metric: "Engagement", Value: metrics.engagementScore * 100 },
], [
  { key: "Metric", label: "Health Metric", width: 20 },
  { key: "Value", label: "Score", width: 10, align: "right" },
]);
```

### Get Pacing State

```typescript
const state = pacing.getState();

console.log(`Current speed: ${state.currentSpeed}x`);
console.log(`Comprehension: ${(state.comprehensionScore * 100).toFixed(0)}%`);
console.log(`Adjustments made: ${state.adjustmentHistory.length}`);
```

## Configuration Examples

### For Different Learning Contexts

#### Intensive Bootcamp

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 90 * 60 * 1000,    // Longer sessions
  breakInterval: 45 * 60 * 1000,         // Less frequent breaks
  maxComplexityScore: 85,                // Higher difficulty
  enableForcedBreaks: true,              // Enforce safety
});
```

#### Casual Learning

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 30 * 60 * 1000,    // Shorter sessions
  breakInterval: 20 * 60 * 1000,         // More breaks
  maxComplexityScore: 65,                // Gentler pace
  enableWarnings: true,
  enableForcedBreaks: false,
});
```

#### Kids/Beginners

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  maxSessionDuration: 20 * 60 * 1000,    // Short sessions
  breakInterval: 15 * 60 * 1000,         // Frequent breaks
  maxComplexityScore: 50,                // Low complexity
  maxInformationDensity: 8,              // Slow pace
  enableForcedBreaks: true,
});

const pacing = new AdaptivePacingController({
  baseSpeed: 0.7,                        // Slower default
  maxSpeed: 1.0,                         // Cap speed
});
```

## Tips & Best Practices

### ✅ Do

- Enable guardrails for all educational content
- Honor break recommendations
- Track progress explicitly
- Monitor wellness scores
- Calibrate pacing from session data

```typescript
// Good: Explicit progress tracking
logger.success("Quiz passed!");
pacing.updateComprehension({ progressMade: true });
```

### ❌ Don't

- Disable warnings in production
- Ignore critical warnings
- Override speed limits excessively
- Skip breaks repeatedly

```typescript
// Bad: Ignoring safety
const guardrails = new CognitiveGuardrailsPlugin({
  enableWarnings: false,  // Don't do this!
  maxSessionDuration: 4 * 60 * 60 * 1000,  // Too long!
});
```

## Testing & Validation

### Test Guardrails

```typescript
// Simulate high load
for (let i = 0; i < 20; i++) {
  logger.info("Complex topic", {
    complexity: 90,
    metadata: { /* lots of data */ },
  });
}

// Should see warnings
const warnings = guardrails.getWarnings();
console.log(`Warnings: ${warnings.length}`); // Should be > 0
```

### Validate Pacing

```typescript
// Test slow down on confusion
pacing.updateComprehension({
  errorOccurred: true,
  repetitionNeeded: true,
});

const state = pacing.getState();
console.log(state.currentSpeed); // Should be < baseSpeed
```

## Troubleshooting

### Problem: Too many warnings

**Solution**: Adjust thresholds

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  maxComplexityScore: 85,        // Higher limit
  maxInformationDensity: 15,     // Allow more
});
```

### Problem: Pacing too slow

**Solution**: Increase base speed or limits

```typescript
const pacing = new AdaptivePacingController({
  baseSpeed: 1.2,      // Faster start
  minSpeed: 0.5,       // Don't slow too much
});
```

### Problem: Breaks too frequent

**Solution**: Increase interval

```typescript
const guardrails = new CognitiveGuardrailsPlugin({
  breakInterval: 45 * 60 * 1000,  // 45 minutes
});
```

## Next Steps

1. **Read Full Documentation**: [psychological-guardrails.md](./psychological-guardrails.md)
2. **Run Demo**: `deno run --allow-all examples/technology/psychological-guardrails-demo.ts`
3. **Integrate into Your App**: See example implementations
4. **Monitor Metrics**: Set up analytics for cognitive health data
5. **Calibrate**: Fine-tune based on your users' learning patterns

## Resources

- [Full Documentation](./psychological-guardrails.md)
- [API Reference](./api-reference.md)
- [Example Demo](../examples/technology/psychological-guardrails-demo.ts)
- [Research Background](./psychological-guardrails.md#research-foundation)

## Support

Questions? Open an issue on GitHub or consult the full documentation.

---

**Remember**: These guardrails are designed to enhance learning, not restrict it. They're based on cognitive science research and aim to optimize long-term retention while protecting mental health.

Happy (safe) learning! 🧠✨
