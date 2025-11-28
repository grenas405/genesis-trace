#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * The Art of Thinking Clearly - Animation Lab
 *
 * An interactive demonstration of all 99 cognitive biases and thinking errors
 * from Rolf Dobelli's "The Art of Thinking Clearly" audiobook.
 * Each error includes a simple analogy to explain why it's a thinking trap.
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

// =============================================================================
// WELCOME BANNER
// =============================================================================

BannerRenderer.render({
  title: "THE ART OF THINKING CLEARLY",
  subtitle: "99 Cognitive Biases & Thinking Errors",
  description: "Animated exploration of mental traps that cloud our judgment",
  version: "Rolf Dobelli • 2013",
  author: "GenesisTrace Animation Lab",
  width: 96,
  color: ColorSystem.codes.brightCyan,
});
console.log("\n");

// =============================================================================
// LOGGER INITIALIZATION
// =============================================================================

const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(500)
    .build(),
);

logger.info("Beginning journey through cognitive biases");
console.log("\n");

// =============================================================================
// THE 99 THINKING ERRORS
// =============================================================================

const thinkingErrors = [
  {
    number: 1,
    name: "Survivorship Bias",
    analogy: "Looking at successful businesses is like only studying lottery winners - you miss all the failures",
    category: "Selection Biases",
  },
  {
    number: 2,
    name: "Swimmer's Body Illusion",
    analogy: "Thinking swimming creates perfect bodies is like thinking universities make people smart - they select for it",
    category: "Selection Biases",
  },
  {
    number: 3,
    name: "Clustering Illusion",
    analogy: "Seeing patterns in random data is like finding animals in clouds - your brain creates meaning from noise",
    category: "Pattern Recognition Errors",
  },
  {
    number: 4,
    name: "Social Proof",
    analogy: "Following the crowd is like lemmings jumping off a cliff - popularity doesn't equal correctness",
    category: "Social Influence",
  },
  {
    number: 5,
    name: "Sunk Cost Fallacy",
    analogy: "Continuing a bad movie because you paid is like digging a hole deeper because you already started",
    category: "Decision-Making Errors",
  },
  {
    number: 6,
    name: "Reciprocity",
    analogy: "Feeling obligated after free samples is like a spider's web - small gifts trap you into bigger commitments",
    category: "Social Influence",
  },
  {
    number: 7,
    name: "Confirmation Bias",
    analogy: "Only reading news that agrees with you is like having a mirror that only shows your good side",
    category: "Information Processing",
  },
  {
    number: 8,
    name: "Authority Bias",
    analogy: "Believing doctors about everything is like trusting a plumber's advice on brain surgery",
    category: "Social Influence",
  },
  {
    number: 9,
    name: "Contrast Effect",
    analogy: "A $100 watch seems cheap after seeing a $10,000 one - like room temperature water feels hot after ice",
    category: "Perception Errors",
  },
  {
    number: 10,
    name: "Availability Bias",
    analogy: "Fearing plane crashes over car accidents is like being scared of sharks but not stairs",
    category: "Information Processing",
  },
  {
    number: 11,
    name: "It'll-Get-Worse-Before-It-Gets-Better Fallacy",
    analogy: "Believing pain means progress is like thinking a deeper hole gets you out faster",
    category: "Decision-Making Errors",
  },
  {
    number: 12,
    name: "Story Bias",
    analogy: "Needing narratives for data is like needing bedtime stories to fall asleep - comforting but not necessary",
    category: "Pattern Recognition Errors",
  },
  {
    number: 13,
    name: "Hindsight Bias",
    analogy: "Saying 'I knew it' after the fact is like claiming you predicted rain while holding an umbrella",
    category: "Memory Errors",
  },
  {
    number: 14,
    name: "Overconfidence Effect",
    analogy: "Being sure you're right is like a bad driver rating themselves as excellent",
    category: "Self-Assessment Errors",
  },
  {
    number: 15,
    name: "Chauffeur Knowledge",
    analogy: "Memorizing facts without understanding is like a GPS knowing routes but not geography",
    category: "Knowledge Errors",
  },
  {
    number: 16,
    name: "Illusion of Control",
    analogy: "Thinking you can control dice by how you throw them is like rain dancing to end a drought",
    category: "Control Illusions",
  },
  {
    number: 17,
    name: "Incentive Super-Response Tendency",
    analogy: "People gaming metrics is like students studying only what's on the test",
    category: "Behavioral Economics",
  },
  {
    number: 18,
    name: "Regression to the Mean",
    analogy: "Extreme performance normalizing is like tall parents having shorter kids - nature balances",
    category: "Statistical Errors",
  },
  {
    number: 19,
    name: "Outcome Bias",
    analogy: "Judging decisions by results is like calling drunk driving smart if you arrive safely",
    category: "Decision-Making Errors",
  },
  {
    number: 20,
    name: "Paradox of Choice",
    analogy: "Too many options paralyze you like standing in a huge buffet unable to choose",
    category: "Decision-Making Errors",
  },
  {
    number: 21,
    name: "Liking Bias",
    analogy: "Buying from attractive salespeople is like judging a book by its beautiful cover",
    category: "Social Influence",
  },
  {
    number: 22,
    name: "Endowment Effect",
    analogy: "Overvaluing what you own is like thinking your baby is the cutest - ownership clouds judgment",
    category: "Value Perception",
  },
  {
    number: 23,
    name: "Coincidence",
    analogy: "Seeing meaning in random events is like thinking the universe planned your parking spot",
    category: "Pattern Recognition Errors",
  },
  {
    number: 24,
    name: "Groupthink",
    analogy: "Teams avoiding dissent is like everyone agreeing the emperor has clothes",
    category: "Group Dynamics",
  },
  {
    number: 25,
    name: "Neglect of Probability",
    analogy: "Ignoring likelihood is like fearing lightning but not obesity - drama beats statistics",
    category: "Risk Assessment",
  },
  {
    number: 26,
    name: "Scarcity Error",
    analogy: "Wanting limited items more is like children fighting over the last cookie regardless of hunger",
    category: "Value Perception",
  },
  {
    number: 27,
    name: "Base-Rate Neglect",
    analogy: "Ignoring overall statistics is like diagnosing rare diseases without checking common ones first",
    category: "Statistical Errors",
  },
  {
    number: 28,
    name: "Gambler's Fallacy",
    analogy: "Thinking luck is 'due' is like expecting heads after five tails - coins have no memory",
    category: "Probability Errors",
  },
  {
    number: 29,
    name: "Anchor",
    analogy: "First numbers stick like an anchor - asking $1M makes $500K seem reasonable",
    category: "Decision-Making Errors",
  },
  {
    number: 30,
    name: "Induction",
    analogy: "Assuming the future matches the past is like expecting the sun to rise because it always has - usually right, sometimes catastrophic",
    category: "Reasoning Errors",
  },
  {
    number: 31,
    name: "Loss Aversion",
    analogy: "Fearing losses more than valuing gains is like crying over $10 lost but shrugging at $10 found",
    category: "Risk Assessment",
  },
  {
    number: 32,
    name: "Social Loafing",
    analogy: "Working less in groups is like rowing where your effort is invisible - nobody notices slacking",
    category: "Group Dynamics",
  },
  {
    number: 33,
    name: "Exponential Growth",
    analogy: "Underestimating compound effects is like the chessboard rice doubling story - starts small, ends huge",
    category: "Mathematical Errors",
  },
  {
    number: 34,
    name: "Winner's Curse",
    analogy: "Winning auctions means overpaying - like being the highest bidder on a $3 bill",
    category: "Behavioral Economics",
  },
  {
    number: 35,
    name: "Fundamental Attribution Error",
    analogy: "Blaming character over situation is like thinking homeless people are lazy, not unlucky",
    category: "Social Psychology",
  },
  {
    number: 36,
    name: "False Causality",
    analogy: "Correlation isn't causation is like blaming ice cream for shark attacks - both happen in summer",
    category: "Reasoning Errors",
  },
  {
    number: 37,
    name: "Halo Effect",
    analogy: "One good trait creates positive assumptions like thinking attractive people are also smart and kind",
    category: "Perception Errors",
  },
  {
    number: 38,
    name: "Alternative Paths",
    analogy: "Ignoring what could have happened is like a lottery winner claiming skill, not luck",
    category: "Reasoning Errors",
  },
  {
    number: 39,
    name: "Forecast Illusion",
    analogy: "Trusting predictions is like believing weather forecasts for next year - complexity defeats accuracy",
    category: "Prediction Errors",
  },
  {
    number: 40,
    name: "Conjunction Fallacy",
    analogy: "Specific stories seem more likely than general ones like 'bank teller who does yoga' vs 'bank teller'",
    category: "Probability Errors",
  },
  {
    number: 41,
    name: "Framing",
    analogy: "How information is presented matters like '90% survival rate' sounds better than '10% die'",
    category: "Perception Errors",
  },
  {
    number: 42,
    name: "Action Bias",
    analogy: "Doing something feels better than doing nothing like goalies diving vs standing still on penalties",
    category: "Behavioral Economics",
  },
  {
    number: 43,
    name: "Omission Bias",
    analogy: "Inaction feels safer than action like not vaccinating seems less risky than vaccinating",
    category: "Decision-Making Errors",
  },
  {
    number: 44,
    name: "Self-Serving Bias",
    analogy: "Taking credit, deflecting blame is like athletes thanking God for wins but not losses",
    category: "Self-Assessment Errors",
  },
  {
    number: 45,
    name: "Hedonic Treadmill",
    analogy: "Happiness returns to baseline like getting used to a new car - joy fades, you want more",
    category: "Psychology of Happiness",
  },
  {
    number: 46,
    name: "Self-Selection Bias",
    analogy: "Voluntary responses skew results like restaurant reviews - angry or delighted people write them",
    category: "Selection Biases",
  },
  {
    number: 47,
    name: "Association Bias",
    analogy: "Linking messengers with messages is like hating weather forecasters for predicting rain",
    category: "Perception Errors",
  },
  {
    number: 48,
    name: "Beginner's Luck",
    analogy: "Early success misleads like winning your first poker game - variance, not skill",
    category: "Statistical Errors",
  },
  {
    number: 49,
    name: "Cognitive Dissonance",
    analogy: "Holding contradictory beliefs creates discomfort like smoking while knowing it kills you",
    category: "Self-Assessment Errors",
  },
  {
    number: 50,
    name: "Hyperbolic Discounting",
    analogy: "Preferring now over later is like choosing $50 today over $100 next month - impatience costs",
    category: "Time Perception",
  },
  {
    number: 51,
    name: "Because Justification",
    analogy: "Any reason works like 'Can I cut in line because I need to copy' - 'because' triggers compliance",
    category: "Social Influence",
  },
  {
    number: 52,
    name: "Decision Fatigue",
    analogy: "Decisions drain willpower like a battery - judges grant more parole after lunch",
    category: "Decision-Making Errors",
  },
  {
    number: 53,
    name: "Contagion Bias",
    analogy: "Disgust transfers illogically like refusing a sterile bedpan as a bowl - contamination fear",
    category: "Perception Errors",
  },
  {
    number: 54,
    name: "Average",
    analogy: "Averages mislead like average wealth in a room with a billionaire - meaningless for most",
    category: "Statistical Errors",
  },
  {
    number: 55,
    name: "Motivation Crowding",
    analogy: "External rewards kill intrinsic motivation like paying kids to read - fun becomes work",
    category: "Behavioral Economics",
  },
  {
    number: 56,
    name: "Twaddle Tendency",
    analogy: "Talking without knowledge is like a peacock's tail - impressive display, no substance",
    category: "Communication Errors",
  },
  {
    number: 57,
    name: "Will Rogers Phenomenon",
    analogy: "Moving items between groups changes both averages like a C student switching schools improves both",
    category: "Statistical Errors",
  },
  {
    number: 58,
    name: "Information Bias",
    analogy: "Seeking irrelevant info is like researching napkin brands before a party - more isn't better",
    category: "Information Processing",
  },
  {
    number: 59,
    name: "Effort Justification",
    analogy: "Valuing things we worked for is like fraternity hazing - suffering creates attachment",
    category: "Value Perception",
  },
  {
    number: 60,
    name: "Law of Small Numbers",
    analogy: "Trusting tiny samples is like judging a restaurant on one meal - insufficient data",
    category: "Statistical Errors",
  },
  {
    number: 61,
    name: "Expectations",
    analogy: "Expectations shape experience like expensive wine tasting better - mind over matter",
    category: "Perception Errors",
  },
  {
    number: 62,
    name: "Simple Logic",
    analogy: "Complex problems need complex solutions fallacy - like assuming expensive medicine works better",
    category: "Reasoning Errors",
  },
  {
    number: 63,
    name: "Forer Effect",
    analogy: "Generic statements feel personal like horoscopes - vague fits everyone",
    category: "Self-Assessment Errors",
  },
  {
    number: 64,
    name: "Volunteer's Folly",
    analogy: "Helping creates dependency like feeding stray cats - kindness perpetuates problems",
    category: "Unintended Consequences",
  },
  {
    number: 65,
    name: "Affect Heuristic",
    analogy: "Emotions guide decisions like choosing stocks based on company names you like",
    category: "Decision-Making Errors",
  },
  {
    number: 66,
    name: "Introspection Illusion",
    analogy: "Trusting self-knowledge is like asking fish about water - blind to our biases",
    category: "Self-Assessment Errors",
  },
  {
    number: 67,
    name: "Inability to Close Doors",
    analogy: "Keeping options open paralyzes like dating multiple people - commitment avoidance costs",
    category: "Decision-Making Errors",
  },
  {
    number: 68,
    name: "Neomania",
    analogy: "Overvaluing new things is like discarding old tools that work for shiny new ones",
    category: "Value Perception",
  },
  {
    number: 69,
    name: "Sleeper Effect",
    analogy: "Forgetting the source but remembering the message is like celebrity endorsements working long-term",
    category: "Memory Errors",
  },
  {
    number: 70,
    name: "Alternative Blindness",
    analogy: "Comparing to nothing is like accepting a job without considering unemployment",
    category: "Decision-Making Errors",
  },
  {
    number: 71,
    name: "Social Comparison Bias",
    analogy: "Comparing to others breeds misery like envying neighbors' highlight reels on social media",
    category: "Social Psychology",
  },
  {
    number: 72,
    name: "Primacy and Recency Effects",
    analogy: "Remembering first and last is like recalling a book's beginning and end, not the middle",
    category: "Memory Errors",
  },
  {
    number: 73,
    name: "Not-Invented-Here Syndrome",
    analogy: "Rejecting external ideas is like reinventing the wheel because you didn't design it",
    category: "Group Dynamics",
  },
  {
    number: 74,
    name: "Black Swan",
    analogy: "Ignoring rare events is like building on a flood plain - improbable isn't impossible",
    category: "Risk Assessment",
  },
  {
    number: 75,
    name: "Domain Dependence",
    analogy: "Expertise doesn't transfer like a chess master being bad at business strategy",
    category: "Knowledge Errors",
  },
  {
    number: 76,
    name: "False-Consensus Effect",
    analogy: "Assuming others agree is like thinking everyone shares your taste in music",
    category: "Social Psychology",
  },
  {
    number: 77,
    name: "Falsification of History",
    analogy: "Rewriting the past is like editing childhood photos - memory reconstructs, not recalls",
    category: "Memory Errors",
  },
  {
    number: 78,
    name: "In-Group Out-Group Bias",
    analogy: "Favoring your tribe is like sports fans excusing their team's fouls but not opponents'",
    category: "Social Psychology",
  },
  {
    number: 79,
    name: "Ambiguity Aversion",
    analogy: "Preferring known risks is like choosing a 50% death rate over unknown odds",
    category: "Risk Assessment",
  },
  {
    number: 80,
    name: "Default Effect",
    analogy: "Sticking with presets is like keeping factory phone settings - inertia beats optimization",
    category: "Decision-Making Errors",
  },
  {
    number: 81,
    name: "Fear of Regret",
    analogy: "Avoiding potential regret is like not asking someone out to avoid rejection",
    category: "Emotional Reasoning",
  },
  {
    number: 82,
    name: "Salience Effect",
    analogy: "Noticing the unusual is like seeing only red cars after buying one - attention bias",
    category: "Perception Errors",
  },
  {
    number: 83,
    name: "House-Money Effect",
    analogy: "Risking winnings more is like gamblers betting 'house money' - mental accounting fallacy",
    category: "Behavioral Economics",
  },
  {
    number: 84,
    name: "Procrastination",
    analogy: "Delaying is like kicking the can down the road - future you pays the price",
    category: "Time Perception",
  },
  {
    number: 85,
    name: "Envy",
    analogy: "Wanting others' success is like crabs pulling each other down in a bucket",
    category: "Emotional Reasoning",
  },
  {
    number: 86,
    name: "Personification",
    analogy: "Attributing intentions to objects is like blaming your car for breaking down",
    category: "Perception Errors",
  },
  {
    number: 87,
    name: "Illusion of Attention",
    analogy: "Missing obvious things is like the invisible gorilla experiment - focus creates blindness",
    category: "Perception Errors",
  },
  {
    number: 88,
    name: "Strategic Misrepresentation",
    analogy: "Underestimating projects is like contractors lowballing bids - optimism gets the contract",
    category: "Planning Errors",
  },
  {
    number: 89,
    name: "Overthinking",
    analogy: "Analysis paralysis is like a centipede thinking about walking - consciousness disrupts flow",
    category: "Decision-Making Errors",
  },
  {
    number: 90,
    name: "Planning Fallacy",
    analogy: "Underestimating time needed is like every home renovation taking twice as long",
    category: "Planning Errors",
  },
  {
    number: 91,
    name: "Deformation Professionnelle",
    analogy: "Seeing everything through your profession is like a surgeon seeing all problems as needing surgery",
    category: "Perception Errors",
  },
  {
    number: 92,
    name: "Zeigarnik Effect",
    analogy: "Unfinished tasks nag you like cliffhangers in TV shows - incompleteness demands attention",
    category: "Memory Errors",
  },
  {
    number: 93,
    name: "Illusion of Skill",
    analogy: "Attributing luck to skill is like fund managers claiming genius during bull markets",
    category: "Self-Assessment Errors",
  },
  {
    number: 94,
    name: "Feature-Positive Effect",
    analogy: "Noticing presence over absence is like seeing stars but not the darkness between them",
    category: "Perception Errors",
  },
  {
    number: 95,
    name: "Cherry Picking",
    analogy: "Selecting favorable data is like highlighting only wins in your resume, hiding losses",
    category: "Information Processing",
  },
  {
    number: 96,
    name: "Fallacy of the Single Cause",
    analogy: "Seeking one explanation is like blaming the Titanic sinking on the iceberg alone",
    category: "Reasoning Errors",
  },
  {
    number: 97,
    name: "Intent to Treat Error",
    analogy: "Ignoring dropouts skews results like only counting students who finished the course",
    category: "Statistical Errors",
  },
  {
    number: 98,
    name: "News Illusion",
    analogy: "Consuming news for understanding is like eating candy for nutrition - empty calories",
    category: "Information Processing",
  },
  {
    number: 99,
    name: "Circle of Competence",
    analogy: "Straying from expertise is like a fish trying to climb a tree - stay in your domain",
    category: "Knowledge Errors",
  },
];

// =============================================================================
// CATEGORY GROUPING
// =============================================================================

console.log(ColorSystem.colorize("Organizing 99 Thinking Errors by Category", ColorSystem.codes.bright));
console.log("\n");

const categorySpinner = new Spinner({
  message: "Categorizing cognitive biases...",
  frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
  interval: 80,
});

categorySpinner.start();
await sleep(1500);
categorySpinner.succeed(`Organized into ${new Set(thinkingErrors.map(e => e.category)).size} distinct categories`);
console.log("\n");

// =============================================================================
// ANIMATED EXPLORATION OF ERRORS
// =============================================================================

console.log(ColorSystem.colorize("Exploring Select Thinking Errors", ColorSystem.codes.bright));
console.log("\n");

// Sample a few errors for detailed animation
const featuredErrors = [
  thinkingErrors[0],  // Survivorship Bias
  thinkingErrors[4],  // Sunk Cost Fallacy
  thinkingErrors[6],  // Confirmation Bias
  thinkingErrors[30], // Loss Aversion
  thinkingErrors[36], // Halo Effect
  thinkingErrors[73], // Black Swan
  thinkingErrors[97], // News Illusion
];

for (const error of featuredErrors) {
  const spinner = new Spinner({
    message: `${error.number}. ${error.name}`,
    frames: ["◰", "◳", "◲", "◱"],
    interval: 100,
  });

  spinner.start();
  await sleep(800);
  spinner.succeed(`${error.number}. ${error.name}`);

  BoxRenderer.render(error.analogy, {
    padding: 1,
    style: "single",
  });

  logger.debug(`Category: ${error.category}`, {
    errorNumber: error.number,
    name: error.name,
  });

  console.log("\n");
  await sleep(300);
}

// =============================================================================
// PROGRESS THROUGH ALL CATEGORIES
// =============================================================================

console.log(ColorSystem.colorize("Processing All 99 Thinking Errors", ColorSystem.codes.bright));
console.log("\n");

const categories = [...new Set(thinkingErrors.map(e => e.category))];

for (const category of categories) {
  const categoryErrors = thinkingErrors.filter(e => e.category === category);
  const categoryBar = new ProgressBar({
    total: categoryErrors.length,
    width: 50,
    showValue: true,
    showPercentage: true,
    colorize: true,
  });

  console.log(ColorSystem.colorize(`\n${category} (${categoryErrors.length} errors)`, ColorSystem.codes.brightMagenta));

  for (let i = 0; i < categoryErrors.length; i++) {
    categoryBar.update(i + 1);
    await sleep(50);
  }

  categoryBar.complete();
  logger.info(`Completed ${category}`, {
    errorCount: categoryErrors.length,
    examples: categoryErrors.slice(0, 2).map(e => e.name),
  });
}

console.log("\n");

// =============================================================================
// THINKING ERROR WAVE VISUALIZATION
// =============================================================================

console.log(ColorSystem.colorize("Cognitive Bias Density Visualization", ColorSystem.codes.bright));
console.log("\n");

const waveFrames = [
  "▁▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁",
  "▁▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂",
  "▂▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃",
  "▃▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄",
  "▄▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅",
  "▅▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆",
  "▆▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇",
  "▇██▇▆▅▄▃▂▁▁▂▃▄▅▆▇█",
];

const encoder = new TextEncoder();
for (let i = 0; i < 24; i++) {
  const frame = waveFrames[i % waveFrames.length];
  const coloredFrame = ColorSystem.colorize(frame, ColorSystem.codes.brightYellow);
  Deno.stdout.writeSync(encoder.encode(`\r${coloredFrame} Mapping bias landscape...`));
  await sleep(90);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(60) + "\r"));
console.log(ColorSystem.colorize("99 thinking errors mapped across human cognition", ColorSystem.codes.dim));
console.log("\n");

// =============================================================================
// SUMMARY TABLE BY CATEGORY
// =============================================================================

console.log(ColorSystem.colorize("Summary by Category", ColorSystem.codes.bright));
console.log("\n");

const categoryStats = categories.map(category => {
  const errors = thinkingErrors.filter(e => e.category === category);
  return {
    category,
    count: errors.length,
    percentage: ((errors.length / 99) * 100).toFixed(1) + "%",
    examples: errors.slice(0, 2).map(e => e.name).join(", "),
  };
}).sort((a, b) => b.count - a.count);

TableRenderer.render(
  categoryStats,
  [
    { key: "category", label: "Category", width: 28 },
    { key: "count", label: "Count", width: 8, align: "right" },
    { key: "percentage", label: "% of Total", width: 12, align: "right" },
    { key: "examples", label: "Examples", width: 36 },
  ],
  { showIndex: true },
);

console.log("\n");

// =============================================================================
// KEY INSIGHTS
// =============================================================================

BoxRenderer.render(
  [
    "The human mind is a pattern-seeking, story-telling machine.",
    "These 99 errors aren't bugs - they're features that helped our ancestors survive.",
    "Modern complexity exposes these ancient shortcuts as systematic flaws.",
    "Awareness is the first step; complete immunity is impossible.",
    "Think clearly by recognizing when these patterns hijack your judgment.",
  ].join("\n\n"),
  {
    title: "Key Insights from The Art of Thinking Clearly",
    padding: 2,
    style: "double",
  },
);

console.log("\n");

// =============================================================================
// TOP 10 MOST IMPACTFUL THINKING ERRORS
// =============================================================================

console.log(ColorSystem.colorize("Top 10 Most Impactful Thinking Errors", ColorSystem.codes.bright));
console.log("\n");

const topTen = [
  thinkingErrors[0],  // Survivorship Bias
  thinkingErrors[4],  // Sunk Cost Fallacy
  thinkingErrors[6],  // Confirmation Bias
  thinkingErrors[9],  // Availability Bias
  thinkingErrors[12], // Hindsight Bias
  thinkingErrors[30], // Loss Aversion
  thinkingErrors[35], // False Causality
  thinkingErrors[36], // Halo Effect
  thinkingErrors[49], // Hyperbolic Discounting
  thinkingErrors[73], // Black Swan
];

TableRenderer.render(
  topTen.map(error => ({
    number: error.number,
    name: error.name,
    analogy: error.analogy.length > 70 ? error.analogy.substring(0, 67) + "..." : error.analogy,
  })),
  [
    { key: "number", label: "#", width: 4, align: "right" },
    { key: "name", label: "Thinking Error", width: 30 },
    { key: "analogy", label: "Simple Analogy", width: 56 },
  ],
  { showIndex: false },
);

console.log("\n");

// =============================================================================
// COMPLETION
// =============================================================================

logger.success("Journey through 99 thinking errors complete");
logger.info("Remember: Knowing about biases doesn't make you immune to them");
logger.info("Regular reflection and external perspectives are your best defenses");

console.log("\n");

BoxRenderer.render(
  [
    "You've now explored all 99 cognitive biases from 'The Art of Thinking Clearly'.",
    "",
    "Each error represents a systematic way our minds shortcut reality.",
    "Use this knowledge not as armor, but as a mirror - to see yourself more clearly.",
    "",
    "The wise person knows they are prone to all 99 errors.",
    "The fool thinks they've mastered them.",
  ].join("\n"),
  {
    title: "Final Reflection",
    padding: 2,
    style: "double",
  },
);

console.log("\n");
