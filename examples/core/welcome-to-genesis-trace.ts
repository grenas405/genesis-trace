// examples/core/welcome-to-genesis-trace.ts
// Welcome experience that showcases GenesisTrace primitives working together.

import denoConfig from "../../deno.json" assert { type: "json" };
import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const version = typeof denoConfig.version === "string" ? denoConfig.version : "1.x";
  const config = new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .build();

  const logger = new Logger(config);

  BannerRenderer.render({
    title: "WELCOME TO GENESISTRACE",
    subtitle: "Zero-dependency terminal logging + UI toolkit",
    description: "Logging • UI • Animations • Plugins • Themes",
    version: `v${version}`,
    author: "GenesisTrace Maintainers",
    width: 96,
    style: "bold",
    color: ColorSystem.codes.magenta,
  });

  logger.success("GenesisTrace boot sequence initiated.");
  logger.info("neon theme applied • structured logging online.");
  logger.info("Zero dependencies detected • running pure Deno APIs.");

  const spinner = new Spinner({ message: "Calibrating console components..." });
  spinner.start();
  await delay(600);
  spinner.update("Loading renderers and animations...");
  await delay(600);
  spinner.succeed("GenesisTrace runtime warmed up.");

  console.log();

  const bootstrap = new ProgressBar({ total: 100, width: 36, showValue: false });
  for (const step of [15, 45, 70, 90, 100]) {
    bootstrap.update(step);
    await delay(200);
  }
  bootstrap.complete();
  console.log();

  TableRenderer.render([
    {
      capability: "Structured logging",
      highlight: "Logger • child contexts • metadata history",
    },
    {
      capability: "Visual components",
      highlight: "Tables • boxes • charts • prompts",
    },
    {
      capability: "Animations + progress",
      highlight: "Spinners • progress bars • wave/rainbow loops",
    },
    {
      capability: "Themes + colors",
      highlight: "Truecolor gradients • neon + dracula themes",
    },
    {
      capability: "Plugins",
      highlight: "File, JSON, remote, and Slack log sinks",
    },
  ], [
    { key: "capability", label: "Capability" },
    { key: "highlight", label: "What you unlock" },
  ]);

  console.log();

  BoxRenderer.render([
    "deno add jsr:@pedromdominguez/genesis-trace",
    'import { Logger } from "jsr:@pedromdominguez/genesis-trace";',
    "const logger = new Logger();",
    'logger.success("GenesisTrace ready!");',
  ], {
    title: "Quickstart",
    style: "rounded",
    color: ColorSystem.codes.green,
    minWidth: 68,
  });

  console.log();

  BoxRenderer.render([
    "CLI tooling • POS consoles • dashboards • data pipelines",
    "CI/CD automation • operations control rooms • education labs",
    "If it lives in a terminal, GenesisTrace can render it beautifully.",
  ], {
    title: "What you can build",
    style: "double",
    color: ColorSystem.codes.cyan,
    minWidth: 72,
  });

  console.log();

  BoxRenderer.message("You are ready to trace everything with GenesisTrace.", "success");
  logger.success("Welcome complete • happy tracing!");

  console.log(
    ColorSystem.colorize(
      "\nTip: run `deno run -A examples/core/welcome-to-genesis-trace.ts` to replay this experience.",
      ColorSystem.codes.yellow,
    ),
  );
}

if (import.meta.main) {
  await main();
}
