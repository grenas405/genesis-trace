#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Catholic Church Animation Lab
 *
 * Full console storyline for cathedral media teams building sacred animation
 * sequences. Demonstrates neon logging, cinematic sequencing, spinner moments,
 * and an expansive sparkline wall so creative directors can compare variants
 * for choir dynamics, stained glass illumination, pilgrim telemetry, and more.
 *
 * Run with:
 *   deno run --allow-env --allow-read --allow-write examples/faith/catholic-church-animation-lab.ts
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
  ProgressBar,
  Spinner,
  TableRenderer,
  neonTheme,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface AnimationSequence {
  phase: string;
  lens: string;
  sacrament: string;
  duration: string;
  energy: number;
  cue: string;
}

interface ProductionStation {
  station: string;
  artisans: string;
  deliverable: string;
  status: string;
}

interface SparklineSuite {
  label: string;
  samples: number[];
  color: string;
  description: string;
}

interface PilgrimageSignal {
  name: string;
  data: number[];
  accent: string;
  caption: string;
}

const animationSequences: AnimationSequence[] = [
  {
    phase: "Aurora Processional",
    lens: "Steadicam down nave",
    sacrament: "Entrance Rite",
    duration: "00:45",
    energy: 0.78,
    cue: "Cantor lifts Pentecost antiphon",
  },
  {
    phase: "Eucharistic Orbit",
    lens: "Drone halo around altar",
    sacrament: "Liturgy of the Eucharist",
    duration: "01:20",
    energy: 0.92,
    cue: "Consecration bells ring",
  },
  {
    phase: "Marian Ribbon",
    lens: "Wire-cam across transept",
    sacrament: "Litany of Loreto",
    duration: "00:38",
    energy: 0.68,
    cue: "Assemblies respond Ora pro nobis",
  },
  {
    phase: "Saints Mosaic Burst",
    lens: "Macro glass on stained glass",
    sacrament: "Liturgy of the Word",
    duration: "00:52",
    energy: 0.74,
    cue: "Psalm refrain resolves",
  },
  {
    phase: "Mercy Street Vigil",
    lens: "Handheld over city processions",
    sacrament: "Sending Forth",
    duration: "01:05",
    energy: 0.81,
    cue: "Youth choir flips to gospel cadence",
  },
  {
    phase: "Cosmic Benediction",
    lens: "Star tracker + dome projection",
    sacrament: "Final Blessing",
    duration: "00:57",
    energy: 0.88,
    cue: "Latin dismissal chanted",
  },
];

const productionStations: ProductionStation[] = [
  {
    station: "Rosary Motion Capture",
    artisans: "Sisters of Light",
    deliverable: "Gesture paths for processional choir",
    status: "Rendering",
  },
  {
    station: "Incense Fluid Sim",
    artisans: "Jesuit Fluidics Lab",
    deliverable: "Volumetric incense plumes",
    status: "Color grading",
  },
  {
    station: "Pilgrim Telemetry Deck",
    artisans: "Campus ministry coders",
    deliverable: "Global attendance sparklines",
    status: "Live ingest",
  },
  {
    station: "Stained Glass Spectrometer",
    artisans: "Basilica archivists",
    deliverable: "Spectrum-locked gradients",
    status: "Approved",
  },
  {
    station: "Mission Control",
    artisans: "Cathedral broadcast ops",
    deliverable: "Unity timeline & cues",
    status: "Online",
  },
];

const sparklineSuites: SparklineSuite[] = [
  {
    label: "Choir Resonance",
    samples: [28, 42, 56, 64, 79, 88, 92, 85, 91, 96, 88, 82],
    color: ColorSystem.codes.brightMagenta,
    description: "Soprano/alto mix for Pentecost motif",
  },
  {
    label: "Stained Glass Luminance",
    samples: [14, 18, 26, 33, 41, 58, 75, 68, 52, 37, 25, 19],
    color: ColorSystem.codes.brightYellow,
    description: "Sunrise sweep over nave windows",
  },
  {
    label: "Incense Drift Physics",
    samples: [11, 16, 22, 35, 42, 61, 74, 69, 62, 50, 40, 29],
    color: ColorSystem.codes.brightBlue,
    description: "Ventilation-controlled sensor feed",
  },
  {
    label: "Pilgrim Heartbeats",
    samples: [72, 74, 79, 86, 105, 97, 90, 112, 119, 114, 102, 96],
    color: ColorSystem.codes.brightGreen,
    description: "Wearable monitors during procession",
  },
  {
    label: "Drone Halo Altitude",
    samples: [40, 48, 61, 70, 73, 71, 68, 72, 83, 94, 88, 80],
    color: ColorSystem.codes.cyan,
    description: "Stabilized orbit around baldachin",
  },
  {
    label: "Votive Candle Flicker",
    samples: [5, 8, 6, 12, 11, 14, 10, 9, 15, 13, 11, 7],
    color: ColorSystem.codes.brightRed,
    description: "Macro firelight capture",
  },
  {
    label: "Youth Film Lab Motion",
    samples: [18, 21, 25, 37, 43, 51, 57, 63, 72, 69, 65, 58],
    color: ColorSystem.codes.brightCyan,
    description: "Frame blocking for students",
  },
  {
    label: "Global Rosary Stream",
    samples: [180, 220, 265, 310, 295, 280, 330, 360, 410, 395, 372, 420],
    color: ColorSystem.codes.brightWhite,
    description: "Viewer spikes throughout vigil",
  },
];

const pilgrimageSignals: PilgrimageSignal[] = [
  {
    name: "Camino Norte Field Recordings",
    data: [32, 44, 40, 48, 60, 73, 66, 78, 82, 95, 87, 90],
    accent: ColorSystem.codes.brightGreen,
    caption: "Microphone buses along Northern Spain route",
  },
  {
    name: "Amazon Mission Heartline",
    data: [18, 24, 29, 38, 34, 42, 50, 58, 70, 65, 72, 81],
    accent: ColorSystem.codes.brightBlue,
    caption: "Solar canoe chapel broadcast pulses",
  },
  {
    name: "Rome Nightly Benediction",
    data: [41, 56, 68, 80, 77, 83, 95, 90, 84, 78, 69, 63],
    accent: ColorSystem.codes.brightYellow,
    caption: "Trastevere rooftop lighting cues",
  },
  {
    name: "Digital Mercy Hotline",
    data: [12, 16, 22, 30, 28, 42, 58, 64, 72, 81, 90, 108],
    accent: ColorSystem.codes.brightMagenta,
    caption: "Prayer requests redirected to lab's animation queue",
  },
];

const stageBeats = [
  { label: "Rig Calibration", detail: "Gyro-stabilized dollies align with pew geometry", value: 20 },
  { label: "Liturgy Capture", detail: "Choir mics, lector feeds, and drones sync to SMPTE", value: 48 },
  { label: "Particle Scoring", detail: "Incense, light rays, and cloth simulation baked", value: 72 },
  { label: "Pilgrim Telemetry", detail: "Global requests + attendance update the sparkline wall", value: 88 },
  { label: "Broadcast Ready", detail: "Animation lab streams to every parish studio", value: 100 },
];

const labLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .build(),
);

const movingAverage = (values: number[]): number[] =>
  values.map((value, index, arr) => {
    const window = arr.slice(Math.max(0, index - 1), Math.min(arr.length, index + 2));
    return Math.round(window.reduce((sum, val) => sum + val, 0) / window.length);
  });

const liftedGradient = (values: number[]): number[] => {
  let previous = values[0];
  return values.map((value) => {
    previous = previous * 0.6 + value * 0.4;
    return Math.round(previous);
  });
};

const accentBeats = (values: number[]): number[] =>
  values.map((value, index) => (index % 2 === 0 ? value + 6 : value - 4));

const renderSparklineWall = (suites: SparklineSuite[]) => {
  ConsoleStyler.logSection("Sparkline Animation Wall", "brightYellow", "double");
  suites.forEach((suite) => {
    const base = ChartRenderer.sparkline(suite.samples);
    const smooth = ChartRenderer.sparkline(movingAverage(suite.samples));
    const lift = ChartRenderer.sparkline(liftedGradient(suite.samples));

    console.log(
      `${Formatter.pad(suite.label, 26)} ${
        ColorSystem.colorize(base, suite.color)
      }  ${ColorSystem.colorize(smooth, ColorSystem.codes.dim)}  ${
        ColorSystem.colorize(lift, ColorSystem.codes.brightYellow)
      }  ${suite.description}`,
    );
  });
  console.log("");
};

const renderPilgrimageSignals = (signals: PilgrimageSignal[]) => {
  ConsoleStyler.logSection("Pilgrimage Signal Variant Deck", "brightCyan", "heavy");
  signals.forEach((signal) => {
    const primary = ChartRenderer.sparkline(signal.data);
    const reverse = ChartRenderer.sparkline([...signal.data].reverse());
    const accented = ChartRenderer.sparkline(accentBeats(signal.data));

    console.log(
      `${Formatter.pad(signal.name, 32)} ${
        ColorSystem.colorize(primary, signal.accent)
      } │ ${ColorSystem.colorize(reverse, ColorSystem.codes.brightBlue)} │ ${
        ColorSystem.colorize(accented, ColorSystem.codes.brightWhite)
      }  ${signal.caption}`,
    );
  });
  console.log("");
};

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "CATHOLIC CHURCH ANIMATION LAB",
  subtitle: "Sacred cinematics, pilgrim telemetry, and sparkline choreography",
  description: "GenesisTrace console for cathedral storytellers",
  version: "Animation Lab • V12",
  author: "St. Cecilia Media Atelier",
  width: 110,
  color: ColorSystem.hexToRgb("#d1b287"),
});
console.log("");

BoxRenderer.render(
  [
    "The cathedral media atelier is live. Sacred designers orchestrate drones,",
    "choirs, stained glass macro-lenses, and pilgrim telemetry into a single",
    "liturgical stream. Animation directors need instant sparkline variants to",
    "pair devotion metrics with particle simulations while priests rehearse tonight's vigil.",
    "",
    "This GenesisTrace lab gives them narrative control: neon logging, cinematic",
    "sequencing, spinner beats, progress telemetry, and a towering sparkline wall",
    "where Catholic creativity meets craft.",
  ],
  {
    title: "Studio Briefing",
    style: "rounded",
    padding: 1,
    color: ColorSystem.hexToRgb("#cfa43f"),
    maxWidth: 108,
  },
);
console.log("");

labLogger.info("Initializing basilica animation stack...", {
  location: "St. Cecilia Cathedral",
  batteries: "Dollies, drones, Steadicams charged at 96%",
});
labLogger.debug("Syncing chant BPM with dolly track curves");
labLogger.success("Neon telemetry ✅", { modules: ["Sparkline wall", "Telemetry deck", "Drone orbit"] });
console.log("");

ConsoleStyler.logSection("Cinematic Sequences", "brightMagenta");
TableRenderer.render(
  animationSequences,
  [
    { key: "phase", label: "Phase", width: 24 },
    { key: "lens", label: "Camera Lens", width: 20 },
    { key: "sacrament", label: "Sacrament", width: 20 },
    { key: "duration", label: "Duration", width: 10 },
    {
      key: "energy",
      label: "Energy",
      width: 12,
      formatter: (value: number) => Formatter.percentage(value),
    },
    { key: "cue", label: "Trigger Cue", width: 32 },
  ],
  { showIndex: true, maxWidth: 120 },
);
console.log("");

const rigSpinner = new Spinner({
  message: "Illuminating basilica rig...",
  frames: ["✥", "✺", "✦", "✶", "✸", "✵"],
  interval: 120,
});

rigSpinner.start();
await sleep(800);
rigSpinner.update("Mapping rosary motion capture paths...");
await sleep(800);
rigSpinner.update("Stained glass gradients syncing with drones...");
await sleep(800);
rigSpinner.succeed("Rig locked • Animation lab running hot");
console.log("");

const timelineProgress = new ProgressBar({ total: 100, width: 60 });
stageBeats.forEach((stage) => timelineProgress.update(stage.value));
timelineProgress.complete();
console.log("");
stageBeats.forEach((stage) =>
  console.log(
    `${ColorSystem.colorize("•", ColorSystem.codes.brightYellow)} ${Formatter.pad(stage.label, 18)} ${stage.detail}`,
  )
);
console.log("");

renderSparklineWall(sparklineSuites);
renderPilgrimageSignals(pilgrimageSignals);

ConsoleStyler.logSection("Production Stations", "brightGreen");
TableRenderer.render(
  productionStations,
  [
    { key: "station", label: "Station", width: 26 },
    { key: "artisans", label: "Artisans", width: 24 },
    { key: "deliverable", label: "Deliverable", width: 34 },
    { key: "status", label: "Status", width: 14 },
  ],
  { showIndex: true, maxWidth: 120 },
);
console.log("");

BoxRenderer.render(
  [
    "Deployments:",
    "  ▸ Push sparkline presets to parish media centers via Mission Control",
    "  ▸ Archive tonight's mercy hotline signals for tomorrow's pilgrim decks",
    "  ▸ Invite choir directors to remix the Incense Drift variant that scored best",
    "",
    "Every Catholic studio that plugs into this console inherits the same sparkline-rich",
    "storylines, ensuring processions, vigils, and digital missions stay cinematic.",
  ],
  {
    title: "Next Steps",
    style: "double",
    padding: 1,
    color: ColorSystem.hexToRgb("#8bc6ec"),
    maxWidth: 110,
  },
);
console.log("");
