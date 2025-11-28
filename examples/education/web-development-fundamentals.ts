#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Web Development Fundamentals - Educational Presentation
 *
 * An informational and educational presentation demonstrating the core concepts
 * of modern web development using GenesisTrace for beautiful terminal visualization.
 *
 * Topics covered:
 * - How the Web Works (HTTP, Client-Server Model)
 * - Frontend Technologies (HTML, CSS, JavaScript)
 * - Backend Technologies (Servers, Databases, APIs)
 * - Modern Web Development Tools & Practices
 * - Learning Path & Career Roadmap
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

// Clear console and setup
console.clear();

// Initialize logger with neon theme for vibrant educational display
const logger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .build()
);

// =============================================================================
// INTRODUCTION
// =============================================================================

async function showIntroduction() {
  console.log("\n");

  // Display main banner
  BannerRenderer.render({
    title: "WEB DEVELOPMENT FUNDAMENTALS",
    subtitle: "A Comprehensive Educational Guide",
    version: "Learning Edition 2025",
    author: "Powered by GenesisTrace",
    style: "double",
  });

  await delay(1000);

  logger.info("Welcome to Web Development Fundamentals!");
  logger.info("This interactive presentation will guide you through core concepts");

  await delay(500);

  BoxRenderer.render(
    [
      "📚 What You'll Learn:",
      "",
      "• How the Internet and Web Actually Work",
      "• Frontend Development (What Users See)",
      "• Backend Development (What Powers Everything)",
      "• Databases & Data Storage",
      "• Modern Development Tools & Practices",
      "• Your Learning Roadmap to Becoming a Developer",
    ],
    { title: "Course Overview", style: "rounded", padding: 1 }
  );

  await delay(1500);
}

// =============================================================================
// SECTION 1: HOW THE WEB WORKS
// =============================================================================

async function section1_HowWebWorks() {
  console.log("\n");
  logger.success("📡 SECTION 1: How the Web Works");
  console.log("");

  const spinner = new Spinner({
    message: "Loading network concepts...",
    style: "dots",
  });
  spinner.start();
  await delay(1500);
  spinner.succeed("Network concepts loaded!");

  await delay(500);

  // Client-Server Model Table
  logger.info("Understanding the Client-Server Model");
  console.log("");

  TableRenderer.render([
    {
      component: "Client (Browser)",
      role: "Requests Resources",
      examples: "Chrome, Firefox, Safari",
      actions: "Sends HTTP Requests",
    },
    {
      component: "Server",
      role: "Provides Resources",
      examples: "Nginx, Apache, Node.js",
      actions: "Sends HTTP Responses",
    },
    {
      component: "Database",
      role: "Stores Data",
      examples: "PostgreSQL, MongoDB, MySQL",
      actions: "Read/Write Operations",
    },
  ], [
    { key: "component", label: "Component", width: 20 },
    { key: "role", label: "Role", width: 20 },
    { key: "examples", label: "Examples", width: 25 },
    { key: "actions", label: "Key Actions", width: 25 },
  ]);

  await delay(1000);

  // HTTP Request/Response Cycle
  BoxRenderer.render(
    [
      "🔄 The HTTP Request/Response Cycle",
      "",
      "1. User enters URL: www.example.com",
      "2. Browser sends HTTP Request to Server",
      "3. Server processes the request",
      "4. Server queries Database (if needed)",
      "5. Server sends HTTP Response (HTML, CSS, JS)",
      "6. Browser renders the page for the user",
    ],
    { title: "Request Flow", style: "single" }
  );

  await delay(1500);

  // HTTP Status Codes
  logger.info("Common HTTP Status Codes");
  console.log("");

  TableRenderer.render([
    { code: "200", meaning: "OK", description: "Request succeeded" },
    { code: "201", meaning: "Created", description: "Resource created successfully" },
    { code: "400", meaning: "Bad Request", description: "Invalid request syntax" },
    { code: "401", meaning: "Unauthorized", description: "Authentication required" },
    { code: "404", meaning: "Not Found", description: "Resource doesn't exist" },
    { code: "500", meaning: "Server Error", description: "Server encountered an error" },
  ], [
    { key: "code", label: "Code", width: 10, align: "right" },
    { key: "meaning", label: "Meaning", width: 20 },
    { key: "description", label: "Description", width: 40 },
  ]);

  await delay(1500);
}

// =============================================================================
// SECTION 2: FRONTEND DEVELOPMENT
// =============================================================================

async function section2_Frontend() {
  console.log("\n");
  logger.success("🎨 SECTION 2: Frontend Development - What Users See");
  console.log("");

  await delay(500);

  // The Three Pillars
  BoxRenderer.render(
    [
      "The Three Pillars of Frontend Development",
      "",
      "🏗️  HTML (HyperText Markup Language)",
      "   └─ Structure: The skeleton of your webpage",
      "",
      "🎨 CSS (Cascading Style Sheets)",
      "   └─ Presentation: The visual styling and layout",
      "",
      "⚡ JavaScript",
      "   └─ Behavior: The interactive functionality",
    ],
    { title: "Frontend Stack", style: "double" }
  );

  await delay(1500);

  // HTML Elements
  logger.info("Common HTML Elements");
  console.log("");

  TableRenderer.render([
    { tag: "<header>", purpose: "Page/section header", semantic: "Yes" },
    { tag: "<nav>", purpose: "Navigation links", semantic: "Yes" },
    { tag: "<main>", purpose: "Main content", semantic: "Yes" },
    { tag: "<article>", purpose: "Independent content", semantic: "Yes" },
    { tag: "<section>", purpose: "Thematic grouping", semantic: "Yes" },
    { tag: "<footer>", purpose: "Page/section footer", semantic: "Yes" },
    { tag: "<div>", purpose: "Generic container", semantic: "No" },
    { tag: "<span>", purpose: "Inline container", semantic: "No" },
  ], [
    { key: "tag", label: "HTML Tag", width: 15 },
    { key: "purpose", label: "Purpose", width: 30 },
    { key: "semantic", label: "Semantic?", width: 12 },
  ]);

  await delay(1500);

  // CSS Concepts
  logger.info("Essential CSS Concepts");
  console.log("");

  TableRenderer.render([
    { concept: "Box Model", description: "Content, Padding, Border, Margin" },
    { concept: "Flexbox", description: "One-dimensional layout system" },
    { concept: "Grid", description: "Two-dimensional layout system" },
    { concept: "Responsive Design", description: "Adapts to different screen sizes" },
    { concept: "CSS Variables", description: "Reusable custom properties" },
    { concept: "Animations", description: "Transitions and keyframe animations" },
  ], [
    { key: "concept", label: "Concept", width: 20 },
    { key: "description", label: "Description", width: 50 },
  ]);

  await delay(1500);

  // JavaScript Capabilities
  BoxRenderer.render(
    [
      "What JavaScript Can Do:",
      "",
      "• Manipulate the DOM (add/remove/modify elements)",
      "• Handle user events (clicks, scrolls, inputs)",
      "• Make HTTP requests (fetch data from servers)",
      "• Store data locally (localStorage, sessionStorage)",
      "• Validate forms before submission",
      "• Create animations and interactive effects",
      "• Build entire applications (Single Page Apps)",
    ],
    { title: "JavaScript Powers", style: "rounded" }
  );

  await delay(1500);
}

// =============================================================================
// SECTION 3: BACKEND DEVELOPMENT
// =============================================================================

async function section3_Backend() {
  console.log("\n");
  logger.success("⚙️  SECTION 3: Backend Development - Behind the Scenes");
  console.log("");

  await delay(500);

  // Backend Languages Comparison
  logger.info("Popular Backend Languages");
  console.log("");

  TableRenderer.render([
    { language: "JavaScript/TypeScript", runtime: "Node.js, Deno, Bun", strength: "Full-stack JS, huge ecosystem" },
    { language: "Python", runtime: "Django, Flask, FastAPI", strength: "Easy to learn, great for AI/ML" },
    { language: "Java", runtime: "Spring Boot", strength: "Enterprise-grade, type-safe" },
    { language: "Go", runtime: "Native", strength: "Fast, concurrent, simple" },
    { language: "Ruby", runtime: "Ruby on Rails", strength: "Developer happiness, conventions" },
    { language: "PHP", runtime: "Laravel", strength: "Web-focused, hosting everywhere" },
  ], [
    { key: "language", label: "Language", width: 25 },
    { key: "runtime", label: "Popular Frameworks", width: 25 },
    { key: "strength", label: "Key Strength", width: 35 },
  ]);

  await delay(1500);

  // Database Types
  logger.info("Database Types & Use Cases");
  console.log("");

  TableRenderer.render([
    { type: "SQL (Relational)", examples: "PostgreSQL, MySQL, SQLite", useCase: "Structured data with relationships" },
    { type: "NoSQL (Document)", examples: "MongoDB, CouchDB", useCase: "Flexible schemas, JSON-like data" },
    { type: "NoSQL (Key-Value)", examples: "Redis, DynamoDB", useCase: "Caching, session storage, real-time" },
    { type: "NoSQL (Graph)", examples: "Neo4j, ArangoDB", useCase: "Complex relationships, social networks" },
  ], [
    { key: "type", label: "Database Type", width: 22 },
    { key: "examples", label: "Examples", width: 28 },
    { key: "useCase", label: "Best Use Case", width: 35 },
  ]);

  await delay(1500);

  // API Styles
  BoxRenderer.render(
    [
      "API Communication Styles",
      "",
      "🔹 REST (Representational State Transfer)",
      "   └─ Uses HTTP methods (GET, POST, PUT, DELETE)",
      "   └─ Stateless, resource-based URLs",
      "",
      "🔹 GraphQL",
      "   └─ Query exactly what you need",
      "   └─ Single endpoint, flexible queries",
      "",
      "🔹 WebSockets",
      "   └─ Real-time, bidirectional communication",
      "   └─ Chat apps, live updates, gaming",
    ],
    { title: "API Architectures", style: "double" }
  );

  await delay(1500);
}

// =============================================================================
// SECTION 4: MODERN DEVELOPMENT TOOLS
// =============================================================================

async function section4_ModernTools() {
  console.log("\n");
  logger.success("🛠️  SECTION 4: Modern Development Tools & Practices");
  console.log("");

  await delay(500);

  // Essential Tools
  logger.info("Essential Developer Tools");
  console.log("");

  TableRenderer.render([
    { category: "Version Control", tool: "Git + GitHub/GitLab", why: "Track changes, collaborate with teams" },
    { category: "Code Editor", tool: "VS Code, WebStorm", why: "Powerful editing with extensions" },
    { category: "Package Manager", tool: "npm, yarn, pnpm", why: "Manage project dependencies" },
    { category: "Bundler", tool: "Vite, Webpack, Parcel", why: "Bundle and optimize code" },
    { category: "Testing", tool: "Jest, Vitest, Cypress", why: "Ensure code quality" },
    { category: "Linter", tool: "ESLint, Prettier", why: "Enforce code standards" },
    { category: "Deployment", tool: "Vercel, Netlify, AWS", why: "Host your applications" },
  ], [
    { key: "category", label: "Category", width: 18 },
    { key: "tool", label: "Popular Tools", width: 25 },
    { key: "why", label: "Why You Need It", width: 35 },
  ]);

  await delay(1500);

  // Modern Frameworks
  logger.info("Popular Frontend Frameworks");
  console.log("");

  const frameworkData = [
    { label: "React", value: 42 },
    { label: "Vue.js", value: 18 },
    { label: "Angular", value: 15 },
    { label: "Svelte", value: 12 },
    { label: "Solid.js", value: 8 },
    { label: "Other", value: 5 },
  ];

  ChartRenderer.barChart(frameworkData, {
    width: 50,
    showValues: true,
    color: ColorSystem.codes.cyan,
    title: "Framework Popularity 2025 (% of developers)",
  });

  await delay(1500);

  // Development Best Practices
  BoxRenderer.render(
    [
      "💡 Best Practices for Modern Web Development",
      "",
      "✅ Write clean, readable code (others will read it!)",
      "✅ Use version control (commit often, meaningful messages)",
      "✅ Test your code (unit tests, integration tests)",
      "✅ Optimize for performance (lazy loading, caching)",
      "✅ Make it accessible (ARIA labels, keyboard navigation)",
      "✅ Responsive design first (mobile, tablet, desktop)",
      "✅ Security matters (sanitize inputs, use HTTPS)",
      "✅ Document your work (README, code comments)",
      "✅ Keep learning (web dev evolves constantly)",
    ],
    { title: "Best Practices", style: "rounded" }
  );

  await delay(1500);
}

// =============================================================================
// SECTION 5: LEARNING ROADMAP
// =============================================================================

async function section5_LearningRoadmap() {
  console.log("\n");
  logger.success("🚀 SECTION 5: Your Learning Roadmap");
  console.log("");

  await delay(500);

  // Beginner Path
  logger.info("Phase 1: Fundamentals (Months 1-3)");
  console.log("");

  const phase1Progress = new ProgressBar({
    total: 100,
    width: 50,
    label: "Foundation Skills",
    showPercentage: true,
  });

  const phase1Skills = [
    { skill: "HTML Basics", weeks: "Weeks 1-2" },
    { skill: "CSS & Styling", weeks: "Weeks 3-4" },
    { skill: "JavaScript Fundamentals", weeks: "Weeks 5-8" },
    { skill: "DOM Manipulation", weeks: "Weeks 9-10" },
    { skill: "Git & GitHub", weeks: "Weeks 11-12" },
  ];

  TableRenderer.render(phase1Skills, [
    { key: "skill", label: "Skill to Learn", width: 30 },
    { key: "weeks", label: "Timeline", width: 20 },
  ]);

  console.log("");
  for (let i = 0; i <= 100; i += 20) {
    phase1Progress.update(i);
    await delay(200);
  }
  phase1Progress.complete("Foundation complete! ✨");

  await delay(1000);

  // Intermediate Path
  logger.info("Phase 2: Intermediate (Months 4-6)");
  console.log("");

  const phase2Progress = new ProgressBar({
    total: 100,
    width: 50,
    label: "Intermediate Skills",
    showPercentage: true,
  });

  const phase2Skills = [
    { skill: "React or Vue.js", weeks: "Weeks 13-18" },
    { skill: "Backend Basics (Node.js)", weeks: "Weeks 19-22" },
    { skill: "REST APIs", weeks: "Weeks 23-24" },
  ];

  TableRenderer.render(phase2Skills, [
    { key: "skill", label: "Skill to Learn", width: 30 },
    { key: "weeks", label: "Timeline", width: 20 },
  ]);

  console.log("");
  for (let i = 0; i <= 100; i += 33) {
    phase2Progress.update(i);
    await delay(200);
  }
  phase2Progress.complete("Intermediate skills achieved! 🎯");

  await delay(1000);

  // Advanced Path
  logger.info("Phase 3: Advanced (Months 7-12)");
  console.log("");

  const phase3Progress = new ProgressBar({
    total: 100,
    width: 50,
    label: "Advanced Skills",
    showPercentage: true,
  });

  const phase3Skills = [
    { skill: "Databases (SQL & NoSQL)", weeks: "Weeks 25-30" },
    { skill: "Authentication & Security", weeks: "Weeks 31-34" },
    { skill: "Testing & CI/CD", weeks: "Weeks 35-38" },
    { skill: "Cloud Deployment", weeks: "Weeks 39-42" },
    { skill: "Full-Stack Projects", weeks: "Weeks 43-52" },
  ];

  TableRenderer.render(phase3Skills, [
    { key: "skill", label: "Skill to Learn", width: 30 },
    { key: "weeks", label: "Timeline", width: 20 },
  ]);

  console.log("");
  for (let i = 0; i <= 100; i += 20) {
    phase3Progress.update(i);
    await delay(200);
  }
  phase3Progress.complete("Advanced developer ready! 🚀");

  await delay(1500);

  // Time Investment Chart
  logger.info("Time Investment by Learning Area");
  console.log("");

  const timeInvestment = [
    { label: "Frontend (HTML/CSS/JS)", value: 30 },
    { label: "Frameworks (React/Vue)", value: 20 },
    { label: "Backend & APIs", value: 20 },
    { label: "Databases", value: 15 },
    { label: "DevOps & Tools", value: 10 },
    { label: "Projects & Practice", value: 25 },
  ];

  ChartRenderer.barChart(timeInvestment, {
    width: 50,
    showValues: true,
    color: ColorSystem.codes.green,
    title: "Recommended Time Allocation (%)",
  });

  await delay(1500);
}

// =============================================================================
// SECTION 6: PRACTICAL PROJECT IDEAS
// =============================================================================

async function section6_ProjectIdeas() {
  console.log("\n");
  logger.success("💼 SECTION 6: Practical Project Ideas");
  console.log("");

  await delay(500);

  logger.info("Build These Projects to Practice Your Skills");
  console.log("");

  TableRenderer.render([
    { level: "Beginner", project: "Personal Portfolio Website", skills: "HTML, CSS, JavaScript" },
    { level: "Beginner", project: "To-Do List App", skills: "DOM manipulation, localStorage" },
    { level: "Beginner", project: "Calculator", skills: "JavaScript logic, UI design" },
    { level: "Intermediate", project: "Weather App with API", skills: "Fetch API, async/await" },
    { level: "Intermediate", project: "Blog with CMS", skills: "React, Backend, Database" },
    { level: "Intermediate", project: "E-commerce Cart", skills: "State management, routing" },
    { level: "Advanced", project: "Real-time Chat App", skills: "WebSockets, authentication" },
    { level: "Advanced", project: "Social Media Clone", skills: "Full-stack, file uploads, DB" },
    { level: "Advanced", project: "Project Management Tool", skills: "Complex state, teams, APIs" },
  ], [
    { key: "level", label: "Level", width: 15 },
    { key: "project", label: "Project Idea", width: 30 },
    { key: "skills", label: "Skills Practiced", width: 35 },
  ]);

  await delay(1500);

  BoxRenderer.render(
    [
      "🎯 Keys to Successful Project-Based Learning",
      "",
      "1. Start small - Build simple versions first",
      "2. Add features incrementally - Don't overwhelm yourself",
      "3. Deploy your projects - Make them live on the web",
      "4. Get feedback - Share with others, learn from critique",
      "5. Study others' code - GitHub is your learning library",
      "6. Build what interests you - Passion fuels learning",
      "7. Document your journey - Blog posts, README files",
    ],
    { title: "Project Success Tips", style: "double" }
  );

  await delay(1500);
}

// =============================================================================
// SECTION 7: CAREER PATHS & RESOURCES
// =============================================================================

async function section7_CareerAndResources() {
  console.log("\n");
  logger.success("💰 SECTION 7: Career Paths & Resources");
  console.log("");

  await delay(500);

  // Career Paths
  logger.info("Web Development Career Paths");
  console.log("");

  TableRenderer.render([
    { role: "Frontend Developer", focus: "UI/UX, Visual Design", avgSalary: "$80k - $120k" },
    { role: "Backend Developer", focus: "APIs, Databases, Logic", avgSalary: "$85k - $130k" },
    { role: "Full-Stack Developer", focus: "Frontend + Backend", avgSalary: "$90k - $140k" },
    { role: "DevOps Engineer", focus: "Deployment, CI/CD, Cloud", avgSalary: "$95k - $150k" },
    { role: "Mobile Developer", focus: "React Native, Flutter", avgSalary: "$85k - $135k" },
  ], [
    { key: "role", label: "Job Role", width: 25 },
    { key: "focus", label: "Primary Focus", width: 30 },
    { key: "avgSalary", label: "Avg. Salary (US)", width: 20 },
  ]);

  await delay(1500);

  // Learning Resources
  BoxRenderer.render(
    [
      "📚 Recommended Learning Resources",
      "",
      "Free Resources:",
      "• MDN Web Docs (developer.mozilla.org) - Comprehensive reference",
      "• freeCodeCamp (freecodecamp.org) - Interactive courses",
      "• The Odin Project (theodinproject.com) - Full curriculum",
      "• JavaScript.info - In-depth JS guide",
      "",
      "Paid Courses:",
      "• Frontend Masters - Advanced topics",
      "• Udemy - Affordable project-based courses",
      "• Scrimba - Interactive coding tutorials",
      "",
      "Practice Platforms:",
      "• LeetCode, HackerRank - Algorithm practice",
      "• Frontend Mentor - Real-world UI challenges",
      "• CodePen, CodeSandbox - Live coding playground",
    ],
    { title: "Learning Resources", style: "rounded", padding: 1 }
  );

  await delay(1500);

  // Skills Demand Chart
  logger.info("In-Demand Skills for 2025");
  console.log("");

  const skillsDemand = [
    { label: "React/Vue.js", value: 38 },
    { label: "TypeScript", value: 35 },
    { label: "Node.js", value: 30 },
    { label: "Cloud (AWS/Azure)", value: 28 },
    { label: "Docker/K8s", value: 22 },
    { label: "GraphQL", value: 18 },
  ];

  ChartRenderer.barChart(skillsDemand, {
    width: 50,
    showValues: true,
    color: ColorSystem.codes.magenta,
    title: "Job Posting Frequency (% of listings)",
  });

  await delay(1500);
}

// =============================================================================
// CONCLUSION
// =============================================================================

async function showConclusion() {
  console.log("\n");
  logger.success("🎓 Conclusion: Your Web Development Journey Begins!");
  console.log("");

  await delay(500);

  BoxRenderer.render(
    [
      "Key Takeaways",
      "",
      "✨ The web is built on HTML, CSS, and JavaScript",
      "✨ Frontend creates what users see and interact with",
      "✨ Backend powers the logic, data, and security",
      "✨ Modern tools make development faster and better",
      "✨ Continuous learning is essential in web development",
      "✨ Projects are the best way to learn and practice",
      "✨ The web development career is rewarding and in-demand",
      "",
      "Remember: Every expert was once a beginner!",
    ],
    { title: "Summary", style: "double", padding: 1 }
  );

  await delay(1500);

  const spinner = new Spinner({
    message: "Preparing your next steps...",
    style: "dots",
  });
  spinner.start();
  await delay(2000);
  spinner.succeed("Your journey starts now!");

  await delay(500);

  BoxRenderer.message(
    "Start with HTML and CSS today. Build a simple webpage. " +
    "Then add JavaScript. Keep building, keep learning, and never stop growing!",
    "success"
  );

  await delay(1000);

  logger.info("");
  logger.info("🌟 Happy Coding! May your console always be error-free! 🌟");
  logger.info("");

  console.log(ColorSystem.colorize("=".repeat(80), ColorSystem.codes.cyan));
  console.log(
    ColorSystem.colorize(
      "  Thank you for completing this presentation!",
      ColorSystem.codes.bright
    )
  );
  console.log(ColorSystem.colorize("=".repeat(80), ColorSystem.codes.cyan));
  console.log("\n");
}

// =============================================================================
// MAIN EXECUTION
// =============================================================================

async function main() {
  try {
    await showIntroduction();
    await section1_HowWebWorks();
    await section2_Frontend();
    await section3_Backend();
    await section4_ModernTools();
    await section5_LearningRoadmap();
    await section6_ProjectIdeas();
    await section7_CareerAndResources();
    await showConclusion();
  } catch (error) {
    logger.error("An error occurred during the presentation", { error });
  }
}

// Utility function for delays
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run the presentation
if (import.meta.main) {
  main();
}
