#!/usr/bin/env -S deno run --allow-env

/**
 * HTML + CSS + JS Complete Guide
 *
 * Teaches foundational and advanced browser concepts using the GenesisTrace
 * visual toolkit. Renders sections for markup, styling, scripting, and a
 * project-based learning path with charts, boxes, and progress indicators.
 *
 * Run with:
 *    deno run --allow-env examples/education/html-css-js-guide.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConsoleStyler,
  Logger,
  ProgressBar,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.clear();
console.log("\n");

const guideLogger = new Logger();
guideLogger.info("Frontend guide booted", {
  stack: "HTML+CSS+JS",
  version: "2024.Q4",
  intent: "teach",
});
console.log("");

BannerRenderer.render({
  title: "🧭  FRONTEND FIELD GUIDE",
  subtitle: "HTML • CSS • JavaScript",
  description: "GenesisTrace walkthrough of structure, style, and scripting",
  version: "complete",
  author: "@genesis-trace",
  width: 100,
  color: ColorSystem.hexToRgb("#FF8E53"),
});
console.log("\n");

ConsoleStyler.logSection("🏗  HTML FOUNDATIONS", "brightMagenta", "double");

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Semantic mindset${ColorSystem.codes.reset}`,
    "• Each document needs identity (<html>, <head>, <body>).",
    "• Headings map content hierarchy (h1-h6).",
    "• Landmarks (<header>, <main>, <nav>, <footer>) drive accessibility.",
    "• Forms stay declarative: label inputs, group fieldsets, validate at the edge.",
    "",
    `${ColorSystem.codes.bright}Focus on meaning${ColorSystem.codes.reset}`,
    "- Describe intent first, styling second.",
    "- Use aria-* only when native semantics fail.",
    "- Keep documents small, composable, and linkable.",
  ],
  {
    title: "Markup commandments",
    style: "rounded",
    color: ColorSystem.hexToRgb("#A18CD1"),
    maxWidth: 96,
  },
);
console.log("");

const htmlElements = [
  {
    element: "<header>",
    purpose: "Brand + page identity",
    habits: "Exactly one primary header per view",
  },
  {
    element: "<main>",
    purpose: "Unique document content",
    habits: "Skip on iframes/widgets; use sectioning inside",
  },
  {
    element: "<section>",
    purpose: "Theme grouping",
    habits: "Start with heading + optional aria-label",
  },
  {
    element: "<article>",
    purpose: "Portable snippet (post/card)",
    habits: "Should make sense when syndicated",
  },
  {
    element: "<figure>",
    purpose: "Media + caption",
    habits: "Pair with figcaption for context",
  },
];

TableRenderer.render(
  htmlElements,
  [
    { key: "element", label: "Element", width: 14 },
    { key: "purpose", label: "Purpose", width: 26 },
    { key: "habits", label: "Authoring Habit", width: 46 },
  ],
  { showIndex: true },
);
console.log("");

ConsoleStyler.logSection("🎨 CSS SYSTEMS", "brightCyan");

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Layer intent${ColorSystem.codes.reset}`,
    "1. Tokens (color, spacing, type scale).",
    "2. Components (buttons, cards).",
    "3. Patterns (grids, layout regions).",
    "4. Utilities (state toggles).",
    "",
    `${ColorSystem.codes.bright}Modern stack${ColorSystem.codes.reset}`,
    "• Use logical properties (margin-inline) for RTL freedom.",
    "• Prefer custom properties over preprocessor variables.",
    "• Combine clamp() with min()/max() for fluid scaling.",
  ],
  {
    title: "Styling doctrine",
    style: "double",
    color: ColorSystem.hexToRgb("#5DE0E6"),
    maxWidth: 96,
  },
);
console.log("");

const cssLayouts = [
  {
    layout: "Flexbox",
    sweetSpot: "Row/column alignment, nav bars",
    cue: "Think 1-D axis",
  },
  {
    layout: "Grid",
    sweetSpot: "Dashboards, two-dimensional placements",
    cue: "Named areas & repeat() reduce CSS",
  },
  {
    layout: "Flow + clamp",
    sweetSpot: "Fluid type & cards",
    cue: "No breakpoints for simple scaling",
  },
  {
    layout: "Container queries",
    sweetSpot: "Component-driven responsive",
    cue: "Break ties based on parent width",
  },
  {
    layout: "Cascade layers",
    sweetSpot: "Control specificity",
    cue: "@layer tokens, components, utilities",
  },
];

TableRenderer.render(
  cssLayouts,
  [
    { key: "layout", label: "System", width: 18 },
    { key: "sweetSpot", label: "Best Use", width: 40 },
    { key: "cue", label: "Mental Cue", width: 30 },
  ],
);
console.log("");

ChartRenderer.barChart(
  [
    { label: "Semantics", value: 25 },
    { label: "Layout", value: 30 },
    { label: "Design tokens", value: 15 },
    { label: "Motion", value: 10 },
    { label: "Accessibility", value: 20 },
  ],
  {
    color: ColorSystem.hexToRgb("#64E8DE"),
    width: 50,
    showValues: true,
  },
);
console.log(`${ColorSystem.codes.dim}Tip:${ColorSystem.codes.reset} allocate effort by signal, not hype.`);
console.log("");

ConsoleStyler.logSection("⚡ JAVASCRIPT RHYTHM", "brightYellow");

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Mindset${ColorSystem.codes.reset}`,
    "• Enhance documents, don\'t recreate them.",
    "• Think data flow: state → render → events.",
    "• Guard asynchronous paths with explicit states (idle, loading, error).",
    "",
    `${ColorSystem.codes.bright}API focus${ColorSystem.codes.reset}`,
    "- DOM: querySelector, classList, dataset for wiring.",
    "- Fetch: await fetch(url).then(r => r.json()).",
    "- Storage: localStorage/sessionStorage for light caching.",
    "- Modules: import/export keep files purposeful.",
  ],
  {
    title: "Scripting essentials",
    style: "rounded",
    color: ColorSystem.hexToRgb("#F9D423"),
    maxWidth: 96,
  },
);
console.log("");

const jsPatterns = [
  {
    concept: "Components",
    why: "Group template + style + behavior",
    practice: "Return markup strings or DOM nodes",
  },
  {
    concept: "State machines",
    why: "Prevent impossible transitions",
    practice: "idle → loading → success/error",
  },
  {
    concept: "Events",
    why: "Bubble actions and isolate listeners",
    practice: "element.addEventListener('click', handler)",
  },
  {
    concept: "Async pipelines",
    why: "Compose fetch, transform, render",
    practice: "await load() | map() | hydrate()",
  },
  {
    concept: "Testing",
    why: "Guard utilities + DOM transforms",
    practice: "Deno.test + assertSnapshot",
  },
];

TableRenderer.render(
  jsPatterns,
  [
    { key: "concept", label: "Pattern", width: 16 },
    { key: "why", label: "Why it matters", width: 36 },
    { key: "practice", label: "Practice", width: 36 },
  ],
);
console.log("");

ConsoleStyler.logSection("🛠  PROJECT LEARNING PATH", "brightGreen");

const learningStages = [
  {
    label: "Week 1",
    story: "Structure personal landing page",
    color: [93, 224, 230] as [number, number, number],
  },
  {
    label: "Week 2",
    story: "Build responsive article layout",
    color: [76, 201, 240] as [number, number, number],
  },
  {
    label: "Week 3",
    story: "Enhance UI with CSS variables + animations",
    color: [255, 177, 66] as [number, number, number],
  },
  {
    label: "Week 4",
    story: "Ship JS-powered dashboard (fetch + charts)",
    color: [255, 94, 98] as [number, number, number],
  },
  {
    label: "Week 5",
    story: "Refactor into component modules, add tests",
    color: [186, 85, 211] as [number, number, number],
  },
];

const stageProgress = new ProgressBar({ total: learningStages.length, width: 50, colorize: true });
for (let i = 0; i < learningStages.length; i++) {
  stageProgress.update(i + 1);
  const stage = learningStages[i];
  ConsoleStyler.logRGB(stage.label, stage.color[0], stage.color[1], stage.color[2], "◆", {
    deliverable: stage.story,
  });
  await sleep(200);
}
stageProgress.complete();
console.log("");

const projectRoadmap = [
  {
    project: "Personal site",
    html: "Semantic layout, metadata",
    css: "Flexbox nav, fluid type scale",
    js: "Scroll spy + theme toggle",
  },
  {
    project: "Portfolio grid",
    html: "Reusable cards, accessible filters",
    css: "CSS Grid, container queries",
    js: "Dynamic filtering, history state",
  },
  {
    project: "Content platform",
    html: "Article templates, forms",
    css: "Design tokens, dark mode",
    js: "Remote data + optimistic UI",
  },
];

TableRenderer.render(
  projectRoadmap,
  [
    { key: "project", label: "Project", width: 18 },
    { key: "html", label: "HTML Goals", width: 26 },
    { key: "css", label: "CSS Goals", width: 26 },
    { key: "js", label: "JS Goals", width: 26 },
  ],
  { showIndex: true },
);
console.log("");

BoxRenderer.render(
  [
    `${ColorSystem.codes.bright}Daily habits${ColorSystem.codes.reset}`,
    "• 30m building, 20m reading specs/docs, 10m journaling.",
    "• Screenshot every milestone, narrate decisions.",
    "• Audit accessibility weekly: keyboard, reduced motion, high contrast.",
    "• Use GenesisTrace logs to capture study telemetry for retros.",
  ],
  {
    title: "Execution cadence",
    style: "bold",
    color: ColorSystem.hexToRgb("#FF7EB3"),
    maxWidth: 96,
  },
);
console.log("");

guideLogger.success("Guide rendered", { sections: 6, artifacts: "tables+charts+progress" });
await guideLogger.shutdown();
