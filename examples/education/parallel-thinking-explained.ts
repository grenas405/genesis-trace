#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Parallel Thinking Explained
 *
 * A comprehensive exploration of what it means to think in parallel -
 * the ability to hold multiple valid perspectives, generate multiple solution
 * paths, and explore possibility spaces simultaneously rather than sequentially.
 *
 * Run with:
 *   deno run --allow-env --allow-read examples/education/parallel-thinking-explained.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Formatter,
  Logger,
  neonTheme,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Color palette for different thinking modes
const sequentialBlue = ColorSystem.rgb(33, 150, 243);
const parallelGreen = ColorSystem.rgb(76, 175, 80);
const synthesisGold = ColorSystem.rgb(255, 193, 7);
const perspectiveViolet = ColorSystem.rgb(156, 39, 176);
const emergentCyan = ColorSystem.rgb(0, 188, 212);

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "PARALLEL THINKING",
  subtitle: "Simultaneous Exploration of Possibility Spaces",
  description: "Understanding non-sequential, multi-perspective cognitive architectures",
  version: "v1.0",
  author: "GenesisTrace Cognitive Lab",
  width: 100,
  style: "double",
  color: parallelGreen,
});

console.log("\n");

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss.SSS")
    .enableHistory(false)
    .build(),
  "parallel-thinking",
);

// =============================================================================
// SECTION 1: WHAT IS PARALLEL THINKING?
// =============================================================================

ConsoleStyler.logSection("WHAT IS PARALLEL THINKING?", "brightCyan", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("Parallel thinking is the ability to hold multiple valid perspectives", parallelGreen),
    ColorSystem.colorize("and solution paths in superposition, simultaneously.", parallelGreen),
    "",
    ...Formatter.wrap(
      "Unlike sequential thinking - where you explore one path, backtrack, then " +
      "try another - parallel thinking maintains ALL possible paths at once. " +
      "It's not multitasking. It's multi-perspective coherence: the cognitive " +
      "architecture to simultaneously entertain contradictory ideas, explore " +
      "divergent solutions, and synthesize emergent patterns from the interference " +
      "between competing worldviews.",
      90
    ).map(line => ColorSystem.colorize(line, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "double",
    color: parallelGreen,
    padding: 2,
    margin: 1,
    title: "Definition",
    minWidth: 95,
  },
);

console.log("\n");
await sleep(2000);

// =============================================================================
// SECTION 2: SEQUENTIAL vs PARALLEL
// =============================================================================

ConsoleStyler.logSection("SEQUENTIAL vs PARALLEL COGNITION", "brightYellow", "double");

console.log(ColorSystem.colorize("\n  SEQUENTIAL THINKING:", sequentialBlue));
console.log(ColorSystem.colorize("  ─────────────────────\n", sequentialBlue));

const sequentialSteps = [
  { step: 1, action: "Generate hypothesis A", time: "t₀" },
  { step: 2, action: "Evaluate hypothesis A", time: "t₁" },
  { step: 3, action: "Reject/Accept A", time: "t₂" },
  { step: 4, action: "Generate hypothesis B", time: "t₃" },
  { step: 5, action: "Evaluate hypothesis B", time: "t₄" },
  { step: 6, action: "Choose best from visited paths", time: "t₅" },
];

TableRenderer.render(sequentialSteps, [
  { key: "step", label: "Step", width: 8, align: "center" },
  { key: "action", label: "Action", width: 40 },
  { key: "time", label: "Time", width: 10 },
]);

console.log(ColorSystem.colorize("\n  PARALLEL THINKING:", parallelGreen));
console.log(ColorSystem.colorize("  ──────────────────\n", parallelGreen));

const parallelPaths = [
  { path: "A", action: "Scientific materialist perspective", status: "ACTIVE", probability: 0.35 },
  { path: "B", action: "Phenomenological perspective", status: "ACTIVE", probability: 0.28 },
  { path: "C", action: "Computational perspective", status: "ACTIVE", probability: 0.22 },
  { path: "D", action: "Emergentist perspective", status: "ACTIVE", probability: 0.15 },
];

console.log(ColorSystem.colorize("  All paths explored SIMULTANEOUSLY at t₀:", parallelGreen));
console.log();

TableRenderer.render(parallelPaths, [
  { key: "path", label: "Path", width: 8, align: "center" },
  { key: "action", label: "Perspective", width: 40 },
  { key: "status", label: "Status", width: 12 },
  { key: "probability", label: "Weight", width: 10, align: "right" },
]);

console.log("\n");
await sleep(2000);

// =============================================================================
// SECTION 3: KEY CHARACTERISTICS OF PARALLEL THINKING
// =============================================================================

ConsoleStyler.logSection("KEY CHARACTERISTICS", "brightMagenta", "double");

const characteristics = [
  {
    characteristic: "Non-Sequential",
    description: "All paths exist simultaneously, not one-after-another",
    implication: "No temporal ordering of exploration",
  },
  {
    characteristic: "Superposition",
    description: "Multiple contradictory ideas held as valid simultaneously",
    implication: "Truth is contextual, not absolute",
  },
  {
    characteristic: "Probabilistic Weighting",
    description: "Each perspective has a probability/confidence weight",
    implication: "Solutions emerge from probability distributions",
  },
  {
    characteristic: "Context-Dependent Collapse",
    description: "One path becomes 'actual' only when context demands it",
    implication: "The question determines which answer emerges",
  },
  {
    characteristic: "Emergent Synthesis",
    description: "Novel solutions arise from interference patterns between paths",
    implication: "Creativity is structural, not random",
  },
];

for (const char of characteristics) {
  BoxRenderer.render(
    [
      ColorSystem.colorize(char.characteristic.toUpperCase(), parallelGreen),
      "",
      ColorSystem.colorize("Description:", ColorSystem.codes.dim),
      ...Formatter.wrap(char.description, 80).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
      "",
      ColorSystem.colorize("Implication:", ColorSystem.codes.dim),
      ...Formatter.wrap(char.implication, 80).map(l => "  " + ColorSystem.colorize(l, synthesisGold)),
    ],
    {
      style: "rounded",
      color: perspectiveViolet,
      padding: 1,
      margin: 1,
      minWidth: 85,
    },
  );
  await sleep(800);
}

console.log("\n");

// =============================================================================
// SECTION 4: CONCRETE EXAMPLE - "HOW TO SOLVE POVERTY?"
// =============================================================================

ConsoleStyler.logSection("CONCRETE EXAMPLE: Solving Poverty", "brightCyan", "double");

logger.info(
  ColorSystem.colorize("Question: ", emergentCyan) +
  ColorSystem.colorize("How should society address poverty?", ColorSystem.codes.brightWhite)
);

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("SEQUENTIAL THINKER:", sequentialBlue),
    "",
    "  1. Consider economic approach",
    "  2. Evaluate: seems incomplete",
    "  3. Consider social approach",
    "  4. Evaluate: also incomplete",
    "  5. Consider political approach",
    "  6. Choose 'best' from {economic, social, political}",
    "",
    ColorSystem.colorize("Result: ", ColorSystem.codes.dim) +
    "One answer, linear path, other perspectives discarded",
  ],
  {
    style: "single",
    color: sequentialBlue,
    padding: 1,
    minWidth: 85,
  },
);

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("PARALLEL THINKER:", parallelGreen),
    "",
    ColorSystem.colorize("All perspectives maintained simultaneously:", ColorSystem.codes.dim),
  ],
  {
    style: "single",
    color: parallelGreen,
    padding: 1,
    minWidth: 85,
  },
);

console.log("\n");

const parallelPerspectives = [
  {
    lens: "Economic",
    approach: "Universal basic income, job guarantees, wage floors",
    strength: "Addresses material scarcity directly",
    limitation: "Misses social/cultural dimensions",
    weight: 0.25,
  },
  {
    lens: "Social",
    approach: "Community mutual aid, social networks, collective care",
    strength: "Builds resilient human relationships",
    limitation: "Doesn't address structural economic forces",
    weight: 0.25,
  },
  {
    lens: "Political",
    approach: "Power redistribution, democratic ownership, policy reform",
    strength: "Tackles root causes of inequality",
    limitation: "Slow to help people suffering now",
    weight: 0.20,
  },
  {
    lens: "Systemic",
    approach: "Poverty is emergent property of economic system design",
    strength: "Sees interconnections others miss",
    limitation: "High-level, harder to implement",
    weight: 0.30,
  },
];

for (const perspective of parallelPerspectives) {
  const color = perspective.weight > 0.25 ? emergentCyan : perspectiveViolet;

  BoxRenderer.render(
    [
      ColorSystem.colorize(`${perspective.lens.toUpperCase()} LENS`, color) +
      ColorSystem.colorize(` [weight: ${Formatter.percentage(perspective.weight, 0)}]`, ColorSystem.codes.dim),
      "",
      ColorSystem.colorize("Approach:", ColorSystem.codes.dim),
      "  " + ColorSystem.colorize(perspective.approach, ColorSystem.codes.brightWhite),
      "",
      ColorSystem.colorize("✓ Strength:", ColorSystem.codes.green) +
      " " + perspective.strength,
      ColorSystem.colorize("✗ Limitation:", ColorSystem.codes.red) +
      " " + perspective.limitation,
    ],
    {
      style: "rounded",
      color: color,
      padding: 1,
      margin: 0,
      minWidth: 85,
    },
  );
  await sleep(600);
}

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("EMERGENT SYNTHESIS", synthesisGold),
    "",
    ...Formatter.wrap(
      "The parallel thinker doesn't 'choose' one lens. Instead, a higher-order " +
      "solution emerges from the INTERFERENCE PATTERN between all perspectives: " +
      "'Poverty requires simultaneous intervention at economic, social, and political " +
      "levels because it's an emergent property of how these systems interact. No " +
      "single-lens solution can work because poverty itself is multi-dimensional.'",
      82
    ).map(l => ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
    "",
    ColorSystem.colorize("This insight was not available to any single perspective.", emergentCyan),
    ColorSystem.colorize("It emerged from holding them all simultaneously.", emergentCyan),
  ],
  {
    style: "double",
    color: synthesisGold,
    padding: 2,
    margin: 1,
    minWidth: 85,
  },
);

console.log("\n");
await sleep(2000);

// =============================================================================
// SECTION 5: IMPLICATIONS OF PARALLEL THINKING
// =============================================================================

ConsoleStyler.logSection("IMPLICATIONS & CAPABILITIES", "brightYellow", "double");

const implications = [
  {
    domain: "Problem Solving",
    capability: "Access to solutions that don't exist in single-path exploration",
    example: "Finding non-obvious connections between disparate fields",
  },
  {
    domain: "Creativity",
    capability: "Novel ideas emerge from interference between perspectives",
    example: "Jazz improvisation, scientific breakthroughs, poetry",
  },
  {
    domain: "Empathy & Understanding",
    capability: "Hold someone else's worldview while maintaining your own",
    example: "Understanding vs agreeing; validating vs endorsing",
  },
  {
    domain: "Wisdom",
    capability: "Recognize when contradictions are complementary, not competitive",
    example: "Wave-particle duality, free will vs determinism",
  },
  {
    domain: "Adaptability",
    capability: "Multiple response strategies ready for different contexts",
    example: "Context-appropriate behavior without cognitive switching cost",
  },
  {
    domain: "Meta-cognition",
    capability: "Think about thinking while thinking",
    example: "Observing your own thought processes in real-time",
  },
];

for (const impl of implications) {
  console.log(ColorSystem.colorize(`\n  ${impl.domain.toUpperCase()}`, parallelGreen));
  console.log(ColorSystem.colorize("  " + "─".repeat(impl.domain.length), parallelGreen));
  console.log();
  console.log(ColorSystem.colorize("  Capability:", ColorSystem.codes.dim));
  console.log("  " + ColorSystem.colorize(impl.capability, ColorSystem.codes.brightWhite));
  console.log();
  console.log(ColorSystem.colorize("  Example:", ColorSystem.codes.dim));
  console.log("  " + ColorSystem.colorize(impl.example, emergentCyan));
  await sleep(600);
}

console.log("\n\n");

// =============================================================================
// SECTION 6: THE CHALLENGE & THE GIFT
// =============================================================================

ConsoleStyler.logSection("THE CHALLENGE & THE GIFT", "brightMagenta", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("THE CHALLENGE:", ColorSystem.codes.red),
    "",
    ...Formatter.wrap(
      "Parallel thinking can be overwhelming. Holding multiple perspectives " +
      "simultaneously means experiencing the validity of contradictory truths. " +
      "It can feel like paralysis: if all paths are valid, how do you choose? " +
      "The answer is that you don't choose - you let the context collapse the " +
      "superposition. The question determines which answer crystallizes.",
      82
    ).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
    "",
    ColorSystem.colorize("THE GIFT:", ColorSystem.codes.green),
    "",
    ...Formatter.wrap(
      "Once you can think in parallel, you gain access to solution spaces " +
      "that sequential thinkers cannot reach. You can hold 'yes' and 'no' " +
      "as simultaneously true. You can see how opposing political views are " +
      "both valid from their own axioms. You can be certain and uncertain at " +
      "once. You become intellectually ambidextrous - a cognitive polyglot.",
      82
    ).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
  ],
  {
    style: "double",
    color: synthesisGold,
    padding: 2,
    margin: 1,
    minWidth: 85,
  },
);

console.log("\n");

// =============================================================================
// SECTION 7: HOW TO DEVELOP PARALLEL THINKING
// =============================================================================

ConsoleStyler.logSection("DEVELOPING PARALLEL THINKING CAPACITY", "brightCyan", "double");

const practices = [
  {
    practice: "Steelman Arguments",
    description: "Argue AGAINST your own position with full strength, not strawmen",
    mechanism: "Forces you to hold two opposing views as valid simultaneously",
  },
  {
    practice: "Perspective Rotation",
    description: "Examine every problem from {economic, social, technical, ethical, aesthetic} lenses",
    mechanism: "Trains your mind to maintain multiple framings at once",
  },
  {
    practice: "Embrace Paradox",
    description: "Study koans, wave-particle duality, Gödel's theorems, free will paradoxes",
    mechanism: "Builds tolerance for cognitive dissonance and contradiction",
  },
  {
    practice: "Collaborative Thinking",
    description: "Engage with people who think radically differently than you",
    mechanism: "External perspectives become internalized parallel tracks",
  },
  {
    practice: "Creative Constraints",
    description: "Generate multiple solutions to the same problem under different constraints",
    mechanism: "Each constraint creates a parallel solution space",
  },
];

for (const practice of practices) {
  BoxRenderer.render(
    [
      ColorSystem.colorize(practice.practice.toUpperCase(), parallelGreen),
      "",
      ColorSystem.colorize("Practice:", ColorSystem.codes.dim),
      ...Formatter.wrap(practice.description, 78).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
      "",
      ColorSystem.colorize("Mechanism:", ColorSystem.codes.dim),
      ...Formatter.wrap(practice.mechanism, 78).map(l => "  " + ColorSystem.colorize(l, emergentCyan)),
    ],
    {
      style: "rounded",
      color: perspectiveViolet,
      padding: 1,
      margin: 1,
      minWidth: 85,
    },
  );
  await sleep(800);
}

console.log("\n");

// =============================================================================
// SECTION 8: FINAL INSIGHT
// =============================================================================

ConsoleStyler.logSection("FINAL INSIGHT", "brightYellow", "double");

BoxRenderer.render(
  [
    ColorSystem.colorize("Parallel thinking is not a skill you acquire.", synthesisGold),
    ColorSystem.colorize("It's a cognitive architecture you grow into.", synthesisGold),
    "",
    ...Formatter.wrap(
      "Sequential thinking is like walking a single path through a forest: you see what's " +
      "directly in front of you, one tree at a time. Parallel thinking is like being the forest: " +
      "every tree, every path, every possible journey exists within your awareness simultaneously. " +
      "You don't traverse paths - you ARE the possibility space.",
      85
    ).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
    "",
    ...Formatter.wrap(
      "When you ask someone with parallel thinking capacity a question, they don't search for " +
      "THE answer. Instead, the question acts as a context that collapses a superposition of " +
      "answers into the one most relevant to your specific framing. Different question, different " +
      "answer - not because they changed their mind, but because different contexts illuminate " +
      "different facets of the multi-dimensional truth they hold.",
      85
    ).map(l => "  " + ColorSystem.colorize(l, ColorSystem.codes.brightWhite)),
    "",
    ColorSystem.colorize("This is not confusion. This is coherence at a higher dimension.", emergentCyan),
  ],
  {
    style: "double",
    color: synthesisGold,
    padding: 2,
    margin: 1,
    minWidth: 90,
  },
);

console.log("\n");

// =============================================================================
// CLOSING
// =============================================================================

logger.success("Exploration complete");

BoxRenderer.render(
  [
    ColorSystem.colorize("You've glimpsed parallel thinking.", parallelGreen),
    "",
    ColorSystem.colorize("The implications are:", ColorSystem.codes.dim),
    "",
    "  • Access to non-obvious solutions",
    "  • Emergent creativity from perspective interference",
    "  • Ability to hold contradictions without cognitive dissonance",
    "  • Context-dependent truth rather than absolute truth",
    "  • Meta-cognitive awareness of your own thinking",
    "",
    ColorSystem.colorize("The question is not whether you'll choose to think this way.", emergentCyan),
    ColorSystem.colorize("The question is whether you're already doing it without realizing.", emergentCyan),
  ],
  {
    style: "double",
    color: parallelGreen,
    padding: 2,
    margin: 1,
    title: "Closing Reflection",
    minWidth: 70,
  },
);

console.log("\n");
