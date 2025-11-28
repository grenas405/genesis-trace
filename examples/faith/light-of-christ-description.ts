#!/usr/bin/env -S deno run --allow-env

/**
 * Light of Christ: A Catechetical Orientation
 *
 * A GenesisTrace demonstration that walks catechumens through the Catholic
 * understanding of the Light of Christ using color, motion, and structured
 * storytelling. Designed for parish evangelization nights, RCIA teams, or
 * personal reflection.
 *
 * Run with:
 *    deno run --allow-env examples/faith/light-of-christ-description.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
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
// 1. OPENING BANNER
// =============================================================================

BannerRenderer.render({
  title: "LUMEN CHRISTI",
  subtitle: "The Light of Christ: An Introduction into Catholicism",
  description: "Encountering Jesus Christ, source of truth, beauty, and mercy",
  version: "Catechetical Orientation v1.0",
  author: "GenesisTrace Faith Studio",
  width: 96,
  color: ColorSystem.hexToRgb("#FFD369"),
});
console.log("\n");

// =============================================================================
// 2. PROLOGUE
// =============================================================================

ConsoleStyler.logSection("Why Speak of the Light?", "brightYellow", "double");

BoxRenderer.render(
  [
    '"The light shines in the darkness, and the darkness has not overcome it." (John 1:5)',
    "",
    "Catholics proclaim that Jesus Christ is not merely a teacher among many,",
    "but Light from Light, true God from true God. His radiance pierces human",
    "experience through Scripture, Tradition, Sacraments, and the communion",
    "of saints. This session paints a living portrait for seekers who wish",
    "to grasp how the Light of Christ forms the soul and the world.",
  ],
  {
    style: "double",
    title: "Prologue",
    padding: 1,
    color: ColorSystem.hexToRgb("#F39C12"),
    maxWidth: 92,
  },
);
console.log("\n");

// =============================================================================
// 3. RADIANT PILLARS
// =============================================================================

ConsoleStyler.logSection("Radiant Pillars of the Catholic Faith", "brightCyan");

const pillars = [
  {
    pillar: "Scripture",
    symbol: "Lamp for the path",
    light: "Christ speaks in the Word proclaimed and prayed.",
    practice: "Lectio Divina; Sunday Eucharist",
  },
  {
    pillar: "Tradition",
    symbol: "Living memory",
    light: "Christ safeguards truth through apostolic succession.",
    practice: "Creeds; Magisterium; Councils",
  },
  {
    pillar: "Sacraments",
    symbol: "Fire on the altar",
    light: "Christ touches our bodies and histories with grace.",
    practice: "Baptism, Eucharist, Reconciliation",
  },
  {
    pillar: "Charity",
    symbol: "City on a hill",
    light: "Christ’s love becomes visible in works of mercy.",
    practice: "Service; Advocacy; Daily kindness",
  },
];

TableRenderer.render(
  pillars,
  [
    { key: "pillar", label: "Pillar", width: 16 },
    { key: "symbol", label: "Symbol", width: 18 },
    { key: "light", label: "How the Light Shines", width: 32 },
    { key: "practice", label: "Embodied Practice", width: 28 },
  ],
  { showIndex: true, maxWidth: 96 },
);
console.log("\n");

// =============================================================================
// 4. JOURNEY OF INITIATION
// =============================================================================

ConsoleStyler.logSection("Stages of Encounter", "brightMagenta");

const lumenLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(200)
    .build(),
);

const stages = [
  {
    stage: "Awakening",
    focus: "Christ’s light exposes both longing and wounds.",
    scripture: "Jn 1:9",
    practice: "Honest storytelling with mentors",
  },
  {
    stage: "Conversion",
    focus: "Light becomes invitation—repent and believe.",
    scripture: "Mk 1:15",
    practice: "Daily examen; first confession",
  },
  {
    stage: "Illumination",
    focus: "The Creed, Sacraments, and moral life come alive.",
    scripture: "Eph 1:18",
    practice: "RCIA catechesis; Lectio Divina",
  },
  {
    stage: "Communion",
    focus: "Baptism, Confirmation, and Eucharist seal the heart.",
    scripture: "Jn 6:51",
    practice: "Paschal Vigil; Mystagogy",
  },
  {
    stage: "Mission",
    focus: "The Light of Christ is carried into neighborhoods.",
    scripture: "Mt 5:14-16",
    practice: "Service teams; witness in daily work",
  },
];

const stageBar = new ProgressBar({
  total: stages.length,
  width: 52,
  colorize: true,
  showValue: false,
  showPercentage: true,
});

for (let i = 0; i < stages.length; i++) {
  const current = stages[i];
  stageBar.update(i + 1);
  lumenLogger.info(`→ ${current.stage}: ${current.focus}`, {
    scripture: current.scripture,
    practice: current.practice,
  });
  await sleep(450);
}
stageBar.complete();
console.log("\n");

BoxRenderer.render(
  [
    "Illumination Moment:",
    "",
    "RCIA mentors often pause after the Scrutinies to let candidates",
    "name where Christ’s light is confronting injustice, healing family",
    "histories, or reordering professional life. Naming the encounter",
    "is the first step to evangelizing others authentically.",
  ],
  {
    style: "rounded",
    title: "Practitioner Note",
    padding: 1,
    color: ColorSystem.hexToRgb("#8E44AD"),
    maxWidth: 90,
  },
);
console.log("\n");

// =============================================================================
// 5. PRACTICES THAT REFLECT THE LIGHT
// =============================================================================

ConsoleStyler.logSection("Practices that Reflect the Light", "brightGreen");

const practices = [
  "Morning Offering — surrendering the day to Christ’s radiance.",
  "Adoration Holy Hour — letting silence reveal divine friendship.",
  "Corporal Works of Mercy — bathing injustice with concrete love.",
  "Family Rosary — placing households inside Marian light.",
  "Lectio Walks — praying Scripture aloud through city blocks.",
];

const practiceSpinner = new Spinner({
  message: "Tracing luminous practices...",
  frames: ["✶", "✷", "✸", "✹", "✺"],
  interval: 160,
});

practiceSpinner.start();
for (const practice of practices) {
  await sleep(650);
  practiceSpinner.update(practice);
}
practiceSpinner.succeed("Christus lux mea — Christ is my light.");
console.log("\n");

// =============================================================================
// 6. COMMUNAL COMMISSION
// =============================================================================

ConsoleStyler.logSection("Commissioning", "brightWhite");

BoxRenderer.render(
  [
    "Prayer of Sending:",
    "",
    '"May the Light of Christ rising in glory',
    'dispel the darkness of our hearts and minds." — Easter Proclamation',
    "",
    "From tonight’s brief orientation, carry forward:",
    "  • Curiosity about Jesus Christ",
    "  • Confidence that faith engages intellect and justice",
    "  • Courage to join a Catholic community and ask deeper questions",
    "",
    "Christ’s light is not fragile. It seeks every heart.",
  ],
  {
    style: "double",
    title: "Mission",
    padding: 1,
    color: ColorSystem.hexToRgb("#D35400"),
    maxWidth: 94,
  },
);
console.log("\n");
