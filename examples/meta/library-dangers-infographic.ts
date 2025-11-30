#!/usr/bin/env -S deno run --allow-env

/**
 * Meta-Infographic: The Dangers of Information Density
 *
 * This self-referential presentation demonstrates GenesisTrace's ability
 * to relay massive amounts of information at once - while simultaneously
 * warning about the cognitive dangers of such information density.
 *
 * A paradox wrapped in an infographic: using the tool to critique itself.
 *
 * Run with:
 *   deno run --allow-env examples/meta/library-dangers-infographic.ts
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
  redAlertTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
  AnimationLoop,
  PulseAnimation,
  WaveAnimation,
} from "../../mod.ts";

// Color palette for the meta-critique
const DangerColors = {
  critical: ColorSystem.hexToRgb("#DC2626"), // Critical red
  warning: ColorSystem.hexToRgb("#F59E0B"), // Warning amber
  caution: ColorSystem.hexToRgb("#FBBF24"), // Caution yellow
  info: ColorSystem.hexToRgb("#3B82F6"), // Information blue
  overload: ColorSystem.hexToRgb("#7C3AED"), // Cognitive purple
  paradox: ColorSystem.hexToRgb("#EC4899"), // Paradox pink
  irony: ColorSystem.hexToRgb("#14B8A6"), // Ironic teal
  truth: ColorSystem.hexToRgb("#10B981"), // Truth green
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

// =============================================================================
// OPENING: THE PARADOX
// =============================================================================

BannerRenderer.render({
  title: "⚠️  INFORMATION WEAPON SYSTEM  ⚠️",
  subtitle: "A Self-Referential Critique of Dense Information Transfer",
  description:
    "WARNING: This presentation demonstrates dangerous information density capabilities",
  version: "Meta v1.0",
  author: "GenesisTrace Critical Analysis Division",
  width: 100,
  color: DangerColors.critical,
  style: "double",
});

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("🚨 META-WARNING 🚨", DangerColors.critical),
    "",
    ...Formatter.wrap(
      "You are about to experience a demonstration of this library's most dangerous capability: " +
        "the ability to transmit massive amounts of structured information directly into your " +
        "consciousness at speeds far exceeding normal reading comprehension. This very warning " +
        "is part of the demonstration.",
      92,
    ),
    "",
    ColorSystem.colorize(
      "By reading this, you are already experiencing the effect.",
      DangerColors.warning,
    ),
    "",
    ColorSystem.colorize("THE PARADOX:", DangerColors.paradox),
    ...Formatter.wrap(
      "We must use the dangerous tool to explain why the tool is dangerous. " +
        "Like using a nuclear weapon to demonstrate nuclear weapons. The irony is not lost on us.",
      90,
    ).map((l) => "  " + ColorSystem.colorize(l, DangerColors.irony)),
  ],
  {
    title: "⚠️  READ THIS FIRST ⚠️",
    style: "double",
    color: DangerColors.critical,
    maxWidth: 100,
    padding: 2,
  },
);

console.log("\n");
await sleep(2000);

// =============================================================================
// PART 1: INFORMATION BANDWIDTH ANALYSIS
// =============================================================================

ConsoleStyler.logSection(
  "PART 1: INFORMATION BANDWIDTH CAPABILITIES",
  "brightRed",
  "double",
);
console.log();

const logger = new Logger(
  new ConfigBuilder()
    .theme(redAlertTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss.SSS")
    .build(),
);

logger.error(
  "Analyzing information transfer rates... Values exceed safe thresholds",
);
console.log();

const bandwidthData = [
  {
    medium: "Conversation",
    wordsPerMinute: 150,
    conceptsPerMinute: 5,
    cognitiveLoad: "Low",
    retention: "70%",
  },
  {
    medium: "Reading Text",
    wordsPerMinute: 250,
    conceptsPerMinute: 12,
    cognitiveLoad: "Moderate",
    retention: "55%",
  },
  {
    medium: "Structured Tables",
    wordsPerMinute: 400,
    conceptsPerMinute: 35,
    cognitiveLoad: "High",
    retention: "40%",
  },
  {
    medium: "This Library (Basic)",
    wordsPerMinute: 800,
    conceptsPerMinute: 95,
    cognitiveLoad: "Very High",
    retention: "28%",
  },
  {
    medium: "This Library (Full)",
    wordsPerMinute: 1500,
    conceptsPerMinute: 250,
    cognitiveLoad: "DANGEROUS",
    retention: "15%",
  },
];

TableRenderer.render(
  bandwidthData.map((row) => ({
    medium: ColorSystem.colorize(
      row.medium,
      row.medium.includes("This Library")
        ? DangerColors.critical
        : DangerColors.info,
    ),
    wpm: `${row.wordsPerMinute} wpm`,
    cpm: ColorSystem.colorize(
      `${row.conceptsPerMinute} concepts/min`,
      row.conceptsPerMinute > 100 ? DangerColors.critical : DangerColors.info,
    ),
    load: ColorSystem.colorize(
      row.cognitiveLoad,
      row.cognitiveLoad === "DANGEROUS"
        ? DangerColors.critical
        : row.cognitiveLoad === "Very High"
          ? DangerColors.warning
          : DangerColors.info,
    ),
    retention: ColorSystem.colorize(
      row.retention,
      parseInt(row.retention) < 30 ? DangerColors.critical : DangerColors.info,
    ),
  })),
  [
    { key: "medium", label: "Information Medium", width: 28 },
    { key: "wpm", label: "Words/Min", width: 15 },
    { key: "cpm", label: "Concepts/Min", width: 20 },
    { key: "load", label: "Cognitive Load", width: 18 },
    { key: "retention", label: "Retention", width: 12 },
  ],
  { showIndex: true },
);

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("THE BANDWIDTH PROBLEM", DangerColors.warning),
    "",
    ...Formatter.wrap(
      "Human working memory can hold approximately 4-7 'chunks' of information at once " +
        "(Miller's Law). This library enables presenting 50-100 discrete information chunks " +
        "in seconds. Your brain cannot process this. It will try anyway.",
      92,
    ),
    "",
    ColorSystem.colorize("What happens:", DangerColors.critical),
    "",
    "  • Working memory overflow → Information loss",
    "  • Pattern recognition overload → False connections",
    "  • Cognitive fatigue → Reduced critical thinking",
    "  • Information illusion → Feeling of understanding without actual comprehension",
    "",
    ColorSystem.colorize(
      "You are experiencing this RIGHT NOW as you read this warning.",
      DangerColors.paradox,
    ),
  ],
  {
    style: "bold",
    color: DangerColors.warning,
    maxWidth: 98,
    padding: 1,
  },
);

console.log("\n");
await sleep(1500);

// =============================================================================
// PART 2: THE SEVEN DANGERS
// =============================================================================

ConsoleStyler.logSection(
  "PART 2: THE SEVEN COGNITIVE DANGERS",
  "brightYellow",
  "double",
);
console.log();

type CognitiveDanger = {
  name: string;
  icon: string;
  severity: "CRITICAL" | "HIGH" | "MODERATE";
  description: string;
  mechanism: string;
  example: string;
  consequence: string;
  color: string;
};

const dangers: CognitiveDanger[] = [
  {
    name: "Information Overload Paralysis",
    icon: "🧠💥",
    severity: "CRITICAL",
    description:
      "Too much information presented too fast causes decision paralysis and cognitive shutdown",
    mechanism:
      "Prefrontal cortex becomes overwhelmed → Default mode network activates → Passive absorption without processing",
    example:
      "User sees 200 data points in 30 seconds, retains 15%, believes they understand 80%",
    consequence:
      "False confidence, poor decision making, mental exhaustion",
    color: DangerColors.critical,
  },
  {
    name: "Pattern Hallucination",
    icon: "🔮👁️",
    severity: "CRITICAL",
    description:
      "Brain creates false patterns and connections between unrelated data when processing speed exceeds comprehension",
    mechanism:
      "Pattern recognition systems activate in survival mode → Pareidolia at data level → False causation/correlation",
    example:
      "Seeing causation between adjacent table rows that share only visual proximity",
    consequence:
      "Conspiracy thinking, false insights, misguided strategies",
    color: DangerColors.critical,
  },
  {
    name: "Cognitive Authority Bias",
    icon: "📊✨",
    severity: "HIGH",
    description:
      "Highly formatted, structured information appears more authoritative and true regardless of actual validity",
    mechanism:
      "Visual processing centers signal 'professional/legitimate' → Critical thinking reduced → Acceptance without verification",
    example:
      "Believing statistics because they're in a pretty table, not because they're verified",
    consequence:
      "Manipulation vulnerability, propaganda susceptibility",
    color: DangerColors.warning,
  },
  {
    name: "Temporal Compression Delusion",
    icon: "⏰🌀",
    severity: "HIGH",
    description:
      "Dense information creates illusion of deep understanding achieved rapidly",
    mechanism:
      "Information acquisition ≠ Information integration → Memory formation without comprehension → Dunning-Kruger acceleration",
    example:
      "Reading nuclear physics infographic → Feeling like nuclear expert → Actually retained 12% accurately",
    consequence:
      "Overconfidence, poor expertise assessment, knowledge illusion",
    color: DangerColors.warning,
  },
  {
    name: "Attention Hijacking",
    icon: "🎯🔒",
    severity: "HIGH",
    description:
      "Engaging visualizations capture and hold attention beyond user's conscious control",
    mechanism:
      "Novel stimuli + structured patterns + color + movement → Dopamine release → Compulsive attention",
    example:
      "Intending to scan quickly, spending 20 minutes in deep focus without realizing it",
    consequence:
      "Time distortion, opportunity cost, manipulation potential",
    color: DangerColors.warning,
  },
  {
    name: "Narrative Override",
    icon: "📖🎭",
    severity: "MODERATE",
    description:
      "Structured information delivery creates implicit narrative that overrides critical analysis",
    mechanism:
      "Sequential presentation → Narrative formation → Story bias → Acceptance of framing",
    example:
      "Information order creates perceived causation even when explicitly random",
    consequence:
      "Framing manipulation, loss of alternative perspectives",
    color: DangerColors.caution,
  },
  {
    name: "Meta-Cognitive Blindness",
    icon: "🙈🧩",
    severity: "CRITICAL",
    description:
      "Users become unable to recognize they are being affected by these very dangers",
    mechanism:
      "Cognitive load prevents metacognition → Self-monitoring systems offline → Zero awareness of manipulation",
    example:
      "Reading this list without recognizing you're experiencing these effects right now",
    consequence:
      "Complete vulnerability, no defense mechanism, perfect exploitation vector",
    color: DangerColors.paradox,
  },
];

for (const danger of dangers) {
  const severityColor =
    danger.severity === "CRITICAL"
      ? DangerColors.critical
      : danger.severity === "HIGH"
        ? DangerColors.warning
        : DangerColors.caution;

  BoxRenderer.render(
    [
      ColorSystem.colorize(
        `${danger.icon} ${danger.name.toUpperCase()}`,
        danger.color,
      ),
      "",
      ColorSystem.colorize(
        `SEVERITY: ${danger.severity}`,
        severityColor,
      ),
      "",
      ColorSystem.colorize("Description:", ColorSystem.codes.dim),
      ...Formatter.wrap(danger.description, 88).map(
        (l) => "  " + ColorSystem.colorize(l, ColorSystem.codes.white),
      ),
      "",
      ColorSystem.colorize("Mechanism:", ColorSystem.codes.dim),
      ...Formatter.wrap(danger.mechanism, 86).map((l) => "  " + l),
      "",
      ColorSystem.colorize("Example:", ColorSystem.codes.dim),
      ...Formatter.wrap(danger.example, 86).map(
        (l) => "  " + ColorSystem.colorize(l, DangerColors.info),
      ),
      "",
      ColorSystem.colorize("Consequence:", ColorSystem.codes.dim),
      "  " + ColorSystem.colorize(danger.consequence, DangerColors.critical),
    ],
    {
      title: `DANGER ${dangers.indexOf(danger) + 1}/7`,
      style: "double",
      color: danger.color,
      maxWidth: 96,
      padding: 1,
      margin: 1,
    },
  );

  await sleep(600);
}

console.log("\n");

// =============================================================================
// PART 3: REAL-WORLD IMPACT SCENARIOS
// =============================================================================

ConsoleStyler.logSection(
  "PART 3: WEAPONIZATION SCENARIOS",
  "brightMagenta",
  "double",
);
console.log();

BoxRenderer.render(
  [
    ColorSystem.colorize("⚔️  HOW THIS BECOMES A WEAPON ⚔️", DangerColors.critical),
    "",
    ...Formatter.wrap(
      "Information density is not inherently dangerous - a textbook is dense. " +
        "The danger is in RATE + STRUCTURE + ENGAGEMENT. This library optimizes all three. " +
        "Here's how it can be weaponized:",
      92,
    ).map((l) => ColorSystem.colorize(l, ColorSystem.codes.white)),
  ],
  {
    style: "bold",
    color: DangerColors.critical,
    maxWidth: 98,
    padding: 1,
  },
);

console.log();

type WeaponizationScenario = {
  scenario: string;
  target: string;
  method: string;
  outcome: string;
  defense: string;
  likelihood: number;
};

const scenarios: WeaponizationScenario[] = [
  {
    scenario: "Corporate Manipulation Dashboard",
    target: "Board members, executives, decision makers",
    method:
      "Create compelling dashboards with carefully ordered data, strategic color coding, and embedded narratives that lead to predetermined conclusions",
    outcome:
      "Multi-million dollar decisions made based on visualization framing rather than actual analysis",
    defense:
      "Demand raw data access, external audit, time-delayed decisions",
    likelihood: 95,
  },
  {
    scenario: "Political Propaganda Terminal",
    target: "Voters, activists, policy makers",
    method:
      "Deploy rapid-fire infographics with true-but-misleading statistics, pattern-suggesting layouts, and authority-signaling formatting",
    outcome:
      "Belief formation and opinion shifts without critical evaluation, viral spread of curated narratives",
    defense: "Source verification, diversity of information sources, slow thinking",
    likelihood: 88,
  },
  {
    scenario: "Educational Pseudo-Mastery",
    target: "Students, learners, knowledge workers",
    method:
      "Present complex topics in hyper-structured formats creating illusion of understanding without depth",
    outcome:
      "Dunning-Kruger effect at scale, confidence without competence, credential fraud",
    defense: "Testing understanding through creation not consumption, Socratic method",
    likelihood: 92,
  },
  {
    scenario: "Financial Market Manipulation",
    target: "Retail investors, traders",
    method:
      "Real-time market data presented with suggestive patterns, emotional color coding, and narrative-driving layouts",
    outcome:
      "Coordinated trading behavior, pump-and-dump facilitation, herd mentality exploitation",
    defense:
      "Trading algorithms immune to visual manipulation, time delays, independent analysis",
    likelihood: 78,
  },
  {
    scenario: "Healthcare Decision Coercion",
    target: "Patients, families, healthcare proxies",
    method:
      "Medical data visualization emphasizing specific treatment paths through visual hierarchy and emotional design",
    outcome:
      "Consent without full understanding, treatment choices based on presentation not preference",
    defense: "Medical advocates, second opinions, mandated cooling-off periods",
    likelihood: 71,
  },
  {
    scenario: "Intelligence Disinformation",
    target: "Analysts, journalists, researchers",
    method:
      "Leak 'classified' or 'internal' documents in highly structured formats that appear authoritative",
    outcome:
      "False intelligence propagation, narrative control, geopolitical manipulation",
    defense:
      "Multi-source verification, format-blind analysis, adversarial review",
    likelihood: 84,
  },
];

TableRenderer.render(
  scenarios.map((s) => ({
    scenario: ColorSystem.colorize(s.scenario, DangerColors.critical),
    target: s.target,
    likelihood: ColorSystem.colorize(
      `${s.likelihood}%`,
      s.likelihood > 85
        ? DangerColors.critical
        : s.likelihood > 75
          ? DangerColors.warning
          : DangerColors.caution,
    ),
  })),
  [
    { key: "scenario", label: "Attack Vector", width: 35 },
    { key: "target", label: "Target Population", width: 40 },
    { key: "likelihood", label: "Likelihood", width: 15, align: "center" },
  ],
  { showIndex: true },
);

console.log("\n");

for (const scenario of scenarios) {
  BoxRenderer.render(
    [
      ColorSystem.colorize("Target:", ColorSystem.codes.dim),
      "  " + scenario.target,
      "",
      ColorSystem.colorize("Method:", ColorSystem.codes.dim),
      ...Formatter.wrap(scenario.method, 88).map((l) => "  " + l),
      "",
      ColorSystem.colorize("Likely Outcome:", ColorSystem.codes.dim),
      ...Formatter.wrap(scenario.outcome, 88).map(
        (l) => "  " + ColorSystem.colorize(l, DangerColors.warning),
      ),
      "",
      ColorSystem.colorize("Defense Strategy:", ColorSystem.codes.dim),
      ...Formatter.wrap(scenario.defense, 88).map(
        (l) => "  " + ColorSystem.colorize(l, DangerColors.truth),
      ),
      "",
      ColorSystem.colorize(
        `Exploitation Likelihood: ${scenario.likelihood}%`,
        scenario.likelihood > 85
          ? DangerColors.critical
          : DangerColors.warning,
      ),
    ],
    {
      title: scenario.scenario,
      style: "rounded",
      color: DangerColors.critical,
      maxWidth: 96,
      padding: 1,
      margin: 1,
    },
  );

  await sleep(500);
}

console.log("\n");

// =============================================================================
// PART 4: METRICS OF MANIPULATION
// =============================================================================

ConsoleStyler.logSection(
  "PART 4: QUANTIFIED MANIPULATION POTENTIAL",
  "brightCyan",
  "double",
);
console.log();

BoxRenderer.render(
  [
    ColorSystem.colorize(
      "We can measure the manipulation potential of this library.",
      DangerColors.info,
    ),
    "",
    ...Formatter.wrap(
      "By analyzing information density, cognitive load, retention gaps, and authority signaling, " +
        "we can create a 'Manipulation Potential Index' (MPI) for different use cases.",
      90,
    ),
    "",
    ColorSystem.colorize(
      "MPI Formula: (Density × Authority × Engagement) / (Critical_Time × Retention)",
      DangerColors.caution,
    ),
    "",
    "Higher MPI = Greater manipulation potential",
  ],
  {
    style: "rounded",
    color: DangerColors.info,
    maxWidth: 96,
    padding: 1,
  },
);

console.log("\n");

const mpiData = [
  { useCase: "Simple logging", density: 2, authority: 3, engagement: 2, criticalTime: 8, retention: 7, mpi: 1.7 },
  { useCase: "Technical documentation", density: 5, authority: 6, engagement: 4, criticalTime: 7, retention: 6, mpi: 2.9 },
  { useCase: "Data dashboards", density: 8, authority: 8, engagement: 7, criticalTime: 5, retention: 4, mpi: 8.9 },
  { useCase: "This infographic", density: 9, authority: 9, engagement: 9, criticalTime: 3, retention: 2, mpi: 121.5 },
  { useCase: "Malicious propaganda", density: 10, authority: 10, engagement: 10, criticalTime: 1, retention: 1, mpi: 1000 },
];

TableRenderer.render(
  mpiData.map((row) => ({
    useCase: row.useCase,
    density: `${row.density}/10`,
    authority: `${row.authority}/10`,
    engagement: `${row.engagement}/10`,
    criticalTime: `${row.criticalTime}/10`,
    retention: `${row.retention}/10`,
    mpi: ColorSystem.colorize(
      row.mpi.toFixed(1),
      row.mpi > 100
        ? DangerColors.critical
        : row.mpi > 10
          ? DangerColors.warning
          : DangerColors.info,
    ),
  })),
  [
    { key: "useCase", label: "Use Case", width: 25 },
    { key: "density", label: "Density", width: 10 },
    { key: "authority", label: "Authority", width: 12 },
    { key: "engagement", label: "Engage", width: 10 },
    { key: "criticalTime", label: "Crit.Time", width: 12 },
    { key: "retention", label: "Retention", width: 12 },
    { key: "mpi", label: "MPI", width: 10, align: "right" },
  ],
  { showIndex: true },
);

console.log("\n");

console.log(ColorSystem.colorize("  MPI Interpretation:", DangerColors.info));
console.log();
ChartRenderer.barChart(
  [
    { label: "Logging", value: 1.7 },
    { label: "Docs", value: 2.9 },
    { label: "Dashboard", value: 8.9 },
    { label: "Meta-Info", value: 121.5 },
    { label: "Malicious", value: 250 }, // Capped for visibility
  ],
  {
    width: 70,
    showValues: true,
    color: DangerColors.warning,
  },
);

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("🎯 CRITICAL INSIGHT", DangerColors.critical),
    "",
    ...Formatter.wrap(
      "This infographic you're reading RIGHT NOW has an MPI of 121.5 - meaning you are " +
        "approximately 42x more susceptible to manipulation from this content than from " +
        "normal documentation, and 70x more than simple logging.",
      90,
    ),
    "",
    ColorSystem.colorize("Question:", DangerColors.paradox),
    ...Formatter.wrap(
      "Are you processing this information critically, or are you being swept along by " +
        "the engaging format? Can you even tell the difference?",
      88,
    ).map((l) => "  " + ColorSystem.colorize(l, DangerColors.irony)),
  ],
  {
    style: "bold",
    color: DangerColors.paradox,
    maxWidth: 96,
    padding: 1,
  },
);

console.log("\n");
await sleep(2000);

// =============================================================================
// PART 5: DEFENSE MECHANISMS
// =============================================================================

ConsoleStyler.logSection(
  "PART 5: COGNITIVE DEFENSE STRATEGIES",
  "brightGreen",
  "double",
);
console.log();

type DefenseStrategy = {
  name: string;
  icon: string;
  effectiveness: "HIGH" | "MEDIUM" | "LOW";
  description: string;
  implementation: string;
  cost: string;
};

const defenses: DefenseStrategy[] = [
  {
    name: "Temporal Distancing",
    icon: "⏱️",
    effectiveness: "HIGH",
    description:
      "Impose mandatory delay between information consumption and decision/action",
    implementation:
      "24-hour rule: Any decision influenced by dense information must wait 24 hours after last exposure",
    cost: "Time delay, potential opportunity cost",
  },
  {
    name: "Multi-Format Verification",
    icon: "🔄",
    effectiveness: "HIGH",
    description:
      "Require same information in 3+ different formats from independent sources",
    implementation:
      "Raw data access, verbal explanation, independent visualization, written summary",
    cost: "Significant time investment, multiple sources needed",
  },
  {
    name: "Adversarial Review",
    icon: "⚔️",
    effectiveness: "MEDIUM",
    description:
      "Assign someone to argue against conclusions suggested by visualization",
    implementation:
      "Red team analysis, devil's advocate requirement, contrarian perspective mandate",
    cost: "Personnel time, potential conflict, slower decisions",
  },
  {
    name: "Cognitive Load Monitoring",
    icon: "🧠📊",
    effectiveness: "MEDIUM",
    description:
      "Track mental fatigue and stop information consumption at threshold",
    implementation:
      "Self-assessment breaks every 5 minutes, biometric monitoring, forced rest periods",
    cost: "Interruption overhead, requires self-awareness",
  },
  {
    name: "Source Skepticism Protocol",
    icon: "🔍",
    effectiveness: "MEDIUM",
    description:
      "Automatically distrust highly formatted information until verified",
    implementation:
      "Assume manipulation by default, require chain of custody, validate methodology",
    cost: "Cynicism fatigue, relationship damage, slower trust building",
  },
  {
    name: "Reconstruction Testing",
    icon: "🏗️",
    effectiveness: "HIGH",
    description:
      "Test understanding by recreating the information structure from memory",
    implementation:
      "Close the visualization, write summary from memory, compare, repeat until 80% accuracy",
    cost: "Significant time multiplier (3-5x), high effort",
  },
  {
    name: "Emotional Neutralization",
    icon: "🎭",
    effectiveness: "LOW",
    description:
      "Strip emotional content (color, formatting) to reduce engagement manipulation",
    implementation:
      "View in grayscale, use screen readers, print as plain text",
    cost: "Loses legitimate visual aid benefits, accessibility issues",
  },
];

TableRenderer.render(
  defenses.map((d) => ({
    name: ColorSystem.colorize(d.name, DangerColors.truth),
    icon: d.icon,
    effectiveness: ColorSystem.colorize(
      d.effectiveness,
      d.effectiveness === "HIGH"
        ? DangerColors.truth
        : d.effectiveness === "MEDIUM"
          ? DangerColors.caution
          : DangerColors.warning,
    ),
    cost: d.cost,
  })),
  [
    { key: "name", label: "Defense Strategy", width: 30 },
    { key: "icon", label: "Icon", width: 6 },
    { key: "effectiveness", label: "Effectiveness", width: 16 },
    { key: "cost", label: "Implementation Cost", width: 40 },
  ],
  { showIndex: true },
);

console.log("\n");

for (const defense of defenses) {
  BoxRenderer.render(
    [
      ColorSystem.colorize("Description:", ColorSystem.codes.dim),
      ...Formatter.wrap(defense.description, 88).map((l) => "  " + l),
      "",
      ColorSystem.colorize("How to Implement:", ColorSystem.codes.dim),
      ...Formatter.wrap(defense.implementation, 88).map(
        (l) => "  " + ColorSystem.colorize(l, DangerColors.info),
      ),
      "",
      ColorSystem.colorize("Trade-offs:", ColorSystem.codes.dim),
      "  " + ColorSystem.colorize(defense.cost, DangerColors.caution),
      "",
      ColorSystem.colorize(
        `Effectiveness: ${defense.effectiveness}`,
        defense.effectiveness === "HIGH"
          ? DangerColors.truth
          : DangerColors.caution,
      ),
    ],
    {
      title: `${defense.icon} ${defense.name}`,
      style: "rounded",
      color: DangerColors.truth,
      maxWidth: 96,
      padding: 1,
      margin: 1,
    },
  );

  await sleep(400);
}

console.log("\n");

// =============================================================================
// PART 6: THE ETHICAL FRAMEWORK
// =============================================================================

ConsoleStyler.logSection(
  "PART 6: ETHICAL USAGE FRAMEWORK",
  "brightMagenta",
  "double",
);
console.log();

BoxRenderer.render(
  [
    ColorSystem.colorize("WITH GREAT BANDWIDTH COMES GREAT RESPONSIBILITY", DangerColors.truth),
    "",
    ...Formatter.wrap(
      "Tools are neither good nor evil - they are amplifiers of intent. This library " +
        "amplifies information transfer capability by 10-100x. That same amplification " +
        "applies to both education and manipulation, insight and propaganda.",
      92,
    ),
    "",
    ColorSystem.colorize("The ethical question is not whether to use it,", DangerColors.info),
    ColorSystem.colorize("but HOW to use it responsibly.", DangerColors.info),
  ],
  {
    style: "double",
    color: DangerColors.truth,
    maxWidth: 98,
    padding: 1,
  },
);

console.log("\n");

const ethicalPrinciples = [
  {
    principle: "Transparency Principle",
    rule: "Always disclose when using high-density information formats",
    example: "Add disclaimer: 'This uses rapid information transfer techniques'",
    rationale: "Informed consent requires awareness of the medium, not just the message",
  },
  {
    principle: "Cognitive Respect Principle",
    rule: "Provide mechanisms for users to control information pace",
    example: "Offer 'slow mode', pagination, or expandable sections",
    rationale: "Respect user agency over their own cognitive resources",
  },
  {
    principle: "Retention Testing Principle",
    rule: "Include validation that users actually understood, not just consumed",
    example: "Comprehension questions, reconstruction exercises, waiting periods",
    rationale: "Consumption ≠ Comprehension - test the latter, not the former",
  },
  {
    principle: "Source Traceability Principle",
    rule: "Every claim must link to verifiable, primary sources",
    example: "Hyperlinks, citations, data download options, methodology docs",
    rationale: "Pretty formatting should not replace source verification",
  },
  {
    principle: "Anti-Manipulation Principle",
    rule: "Actively work against manipulative uses of formatting",
    example: "Neutral color schemes, balanced layouts, explicit alternatives shown",
    rationale: "Power to inform implies responsibility not to manipulate",
  },
  {
    principle: "Cognitive Load Warning Principle",
    rule: "Warn users when approaching dangerous information density",
    example: "'This section contains 50+ concepts - take breaks every 5 minutes'",
    rationale: "Users cannot self-regulate what they don't know they're experiencing",
  },
];

for (let i = 0; i < ethicalPrinciples.length; i++) {
  const principle = ethicalPrinciples[i];

  BoxRenderer.render(
    [
      ColorSystem.colorize(`PRINCIPLE ${i + 1}: ${principle.principle.toUpperCase()}`, DangerColors.truth),
      "",
      ColorSystem.colorize("Rule:", ColorSystem.codes.dim),
      ...Formatter.wrap(principle.rule, 88).map((l) => "  " + ColorSystem.colorize(l, ColorSystem.codes.white)),
      "",
      ColorSystem.colorize("Example Implementation:", ColorSystem.codes.dim),
      ...Formatter.wrap(principle.example, 88).map((l) => "  " + ColorSystem.colorize(l, DangerColors.info)),
      "",
      ColorSystem.colorize("Rationale:", ColorSystem.codes.dim),
      ...Formatter.wrap(principle.rationale, 88).map((l) => "  " + ColorSystem.colorize(l, DangerColors.caution)),
    ],
    {
      style: "rounded",
      color: DangerColors.truth,
      maxWidth: 96,
      padding: 1,
      margin: 1,
    },
  );

  await sleep(500);
}

console.log("\n");

// =============================================================================
// PART 7: META-AWARENESS MOMENT
// =============================================================================

ConsoleStyler.logSection(
  "PART 7: THE META-MOMENT",
  "brightYellow",
  "double",
);
console.log();

const spinner = new Spinner({
  message: "Analyzing your current cognitive state...",
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 80,
});

spinner.start();
await sleep(2000);
spinner.succeed("Analysis complete");

console.log();

BoxRenderer.render(
  [
    ColorSystem.colorize("🎭 THE PARADOX COMPLETES 🎭", DangerColors.paradox),
    "",
    ...Formatter.wrap(
      "You have just consumed approximately 8,000 words of dense, structured information " +
        "about the dangers of consuming dense, structured information. The irony is intentional.",
      90,
    ),
    "",
    ColorSystem.colorize("META-QUESTIONS:", DangerColors.critical),
    "",
    "1. Did you experience any of the seven dangers while reading about them?",
    "2. Did the engaging format make you less critical of the claims?",
    "3. Can you recall 50% of the specific dangers without scrolling back?",
    "4. Do you feel like you 'understand' this topic despite rapid consumption?",
    "5. Did you notice when you stopped thinking critically and started absorbing?",
    "",
    ColorSystem.colorize("HONEST ASSESSMENT:", DangerColors.truth),
    "",
    ...Formatter.wrap(
      "If you answered YES to question 4 and NO to questions 1, 3, and 5, you have just " +
        "experienced exactly what this entire presentation warned against. You were manipulated " +
        "by the medium while being warned about manipulation by the medium.",
      88,
    ).map((l) => "  " + ColorSystem.colorize(l, DangerColors.warning)),
    "",
    ColorSystem.colorize("This was the demonstration.", DangerColors.paradox),
  ],
  {
    style: "double",
    color: DangerColors.paradox,
    maxWidth: 96,
    padding: 2,
  },
);

console.log("\n");
await sleep(2000);

// =============================================================================
// PART 8: THE NUMBERS
// =============================================================================

ConsoleStyler.logSection(
  "PART 8: QUANTIFIED IMPACT ANALYSIS",
  "brightCyan",
  "double",
);
console.log();

const impactStats = [
  { metric: "Total Word Count", value: "~8,500", danger: "High" },
  { metric: "Distinct Concepts Presented", value: "~180", danger: "Critical" },
  { metric: "Average Reading Time (Typical)", value: "12-15 min", danger: "Moderate" },
  { metric: "Time for Full Comprehension", value: "4-6 hours", danger: "Critical" },
  { metric: "Estimated Retention (Immediate)", value: "18-25%", danger: "High" },
  { metric: "Estimated Retention (1 week)", value: "8-12%", danger: "Critical" },
  { metric: "Tables/Visualizations", value: "15+", danger: "High" },
  { metric: "Color-Coded Elements", value: "200+", danger: "High" },
  { metric: "Decision-Influencing Frames", value: "35+", danger: "Critical" },
  { metric: "Manipulation Potential Index", value: "121.5", danger: "Critical" },
];

TableRenderer.render(
  impactStats.map((stat) => ({
    metric: ColorSystem.colorize(stat.metric, DangerColors.info),
    value: ColorSystem.colorize(
      stat.value,
      stat.danger === "Critical" ? DangerColors.critical : DangerColors.caution,
    ),
    danger: ColorSystem.colorize(
      stat.danger,
      stat.danger === "Critical"
        ? DangerColors.critical
        : stat.danger === "High"
          ? DangerColors.warning
          : DangerColors.caution,
    ),
  })),
  [
    { key: "metric", label: "Metric", width: 40 },
    { key: "value", label: "Value", width: 25 },
    { key: "danger", label: "Danger Level", width: 20 },
  ],
  { showIndex: true },
);

console.log("\n");

BoxRenderer.render(
  [
    ColorSystem.colorize("THE GAP", DangerColors.critical),
    "",
    "Time spent reading: " + ColorSystem.colorize("~12 minutes", DangerColors.caution),
    "Time needed for comprehension: " + ColorSystem.colorize("~5 hours", DangerColors.critical),
    "",
    ColorSystem.colorize("Gap: 25x time deficit", DangerColors.critical),
    "",
    ...Formatter.wrap(
      "This gap - between consumption time and comprehension time - is the exploitation vector. " +
        "You feel informed but are not. You feel you understand but you don't. You feel " +
        "confident in decisions you'd reconsider with proper analysis time.",
      90,
    ).map((l) => ColorSystem.colorize(l, ColorSystem.codes.white)),
    "",
    ColorSystem.colorize("This is where manipulation lives.", DangerColors.paradox),
  ],
  {
    style: "bold",
    color: DangerColors.critical,
    maxWidth: 96,
    padding: 1,
  },
);

console.log("\n");

// =============================================================================
// CONCLUSION: THE CHOICE
// =============================================================================

ConsoleStyler.logSection(
  "CONCLUSION: THE RESPONSIBILITY",
  "brightGreen",
  "double",
);
console.log();

BoxRenderer.render(
  [
    ColorSystem.colorize("🎯 THE FINAL TRUTH 🎯", DangerColors.truth),
    "",
    ...Formatter.wrap(
      "This library is a power tool. Like a chainsaw, an excavator, or a nuclear reactor, " +
        "it can do enormous good or enormous harm depending on who wields it and how.",
      92,
    ),
    "",
    ColorSystem.colorize("GOOD USES:", DangerColors.truth),
    "  • Educational content with comprehension testing",
    "  • Emergency information delivery where speed matters",
    "  • Data visualization for trained professionals",
    "  • Technical documentation with proper structure",
    "  • Accessibility aids for information synthesis",
    "",
    ColorSystem.colorize("DANGEROUS USES:", DangerColors.critical),
    "  • Marketing without disclosure of persuasion techniques",
    "  • Political propaganda disguised as neutral information",
    "  • Financial advice without risk comprehension verification",
    "  • Medical decisions without adequate reflection time",
    "  • Any use that exploits cognitive vulnerabilities",
    "",
    ColorSystem.colorize("THE CHOICE:", DangerColors.paradox),
    "",
    ...Formatter.wrap(
      "You now understand this tool's power and danger. What you choose to build with it " +
        "is a moral decision, not a technical one. The code doesn't care. The ethics are yours.",
      88,
    ).map((l) => "  " + ColorSystem.colorize(l, ColorSystem.codes.white)),
    "",
    ColorSystem.colorize(
      "Build responsibly. Build ethically. Build with respect for human cognition.",
      DangerColors.truth,
    ),
  ],
  {
    style: "double",
    color: DangerColors.truth,
    maxWidth: 100,
    padding: 2,
  },
);

console.log("\n");

// Final warning
BoxRenderer.render(
  [
    ColorSystem.colorize("⚠️  MANDATORY DISCLAIMER  ⚠️", DangerColors.critical),
    "",
    "If you build something with this library:",
    "",
    "✓ Disclose the information density to users",
    "✓ Provide controls for pace and depth",
    "✓ Test for comprehension, not just consumption",
    "✓ Link to primary sources",
    "✓ Build in reflection time before action",
    "✓ Monitor for manipulation patterns",
    "",
    ColorSystem.colorize(
      "Failure to do so makes you responsible for the cognitive harm that results.",
      DangerColors.critical,
    ),
  ],
  {
    style: "double",
    color: DangerColors.critical,
    maxWidth: 90,
    padding: 1,
  },
);

console.log("\n");

// Closing
console.log(
  ColorSystem.colorize(
    "═".repeat(100),
    DangerColors.paradox,
  ),
);
console.log();
console.log(
  ColorSystem.colorize(
    "                    INFORMATION WEAPON SYSTEM DEMONSTRATION COMPLETE",
    DangerColors.info,
  ),
);
console.log();
console.log(
  ColorSystem.colorize(
    "                    You have been warned. You have been equipped.",
    DangerColors.truth,
  ),
);
console.log();
console.log(
  ColorSystem.colorize(
    "                    Use this power wisely.",
    DangerColors.truth,
  ),
);
console.log();
console.log(
  ColorSystem.colorize(
    "═".repeat(100),
    DangerColors.paradox,
  ),
);
console.log("\n");
