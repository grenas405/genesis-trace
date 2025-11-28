#!/usr/bin/env -S deno run --allow-env --allow-read

/**
 * Supreme Kitchen Exhaust Cleaning – Edmond, Oklahoma
 *
 * A comprehensive GenesisTrace demonstration for the field operations team at
 * 16404 Friar Court, Edmond, OK 73013. The script showcases:
 *   • Brand-forward banner and mission briefing
 *   • Appointment handler that triages, dispatches, and progresses work orders
 *   • Real-time crew telemetry table with live refresh cycles
 *   • Progress bar driven service timeline to highlight GenesisTrace live output
 *   • Spinners and formatted call-outs for compliance-grade storytelling
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  ProgressBar,
  Spinner,
  TableRenderer,
  neonTheme,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type AppointmentStatus =
  | "Scheduled"
  | "Dispatched"
  | "En Route"
  | "On Site"
  | "Cleaning"
  | "Quality Check"
  | "Completed";

type PriorityWindow = "Rapid Response" | "Preventive Maintenance" | "Compliance Audit";

interface Appointment {
  id: string;
  kitchen: string;
  location: string;
  window: string;
  service: string;
  hoodCount: number;
  crew: string;
  priority: PriorityWindow;
  status: AppointmentStatus;
  contact: string;
}

interface CrewTelemetry {
  crew: string;
  area: string;
  currentJob: string;
  nextMilestone: string;
  etaMinutes: number;
  progress: number;
  staticPressure: number;
  airflow: number;
  greaseLoad: number;
  status:
    | "Staged"
    | "Transit"
    | "Roof Inspection"
    | "Degreasing"
    | "QA / Photos";
}

const blockGauge = (value: number, width = 10): string => {
  const normalized = Math.max(0, Math.min(100, value));
  const filled = Math.round((normalized / 100) * width);
  return `[${"█".repeat(filled)}${"░".repeat(width - filled)}] ${normalized.toFixed(0)}%`;
};

class AppointmentCoordinator {
  constructor(private readonly logger: Logger, private readonly appointments: Appointment[]) {}

  private statusColor(status: AppointmentStatus): string {
    const palette: Record<AppointmentStatus, string> = {
      Scheduled: ColorSystem.codes.brightBlue,
      Dispatched: ColorSystem.codes.brightCyan,
      "En Route": ColorSystem.codes.brightYellow,
      "On Site": ColorSystem.codes.brightMagenta,
      Cleaning: ColorSystem.codes.brightGreen,
      "Quality Check": ColorSystem.codes.brightWhite,
      Completed: ColorSystem.codes.dim,
    };
    return ColorSystem.colorize(status, palette[status]);
  }

  private priorityChip(priority: PriorityWindow): string {
    const palette: Record<PriorityWindow, string> = {
      "Rapid Response": ColorSystem.codes.red,
      "Preventive Maintenance": ColorSystem.codes.brightGreen,
      "Compliance Audit": ColorSystem.codes.brightYellow,
    };
    return ColorSystem.colorize(priority, palette[priority]);
  }

  private metrics() {
    const active = this.appointments.filter((appt) => appt.status !== "Completed");
    const rapid = active.filter((appt) => appt.priority === "Rapid Response").length;
    const cleaning = active.filter((appt) => appt.status === "Cleaning").length;
    const pending = active.filter((appt) => appt.status === "Scheduled").length;
    const hoodTotal = active.reduce((sum, appt) => sum + appt.hoodCount, 0);
    const avgHoods = hoodTotal / (active.length || 1);

    return {
      total: active.length,
      rapid,
      cleaning,
      pending,
      hoodTotal,
      avgHoods,
    };
  }

  renderOverview() {
    const stats = this.metrics();
    BoxRenderer.render(
      [
        `Open Work Orders: ${ColorSystem.colorize(String(stats.total), ColorSystem.codes.brightCyan)} | Rapid Response: ${
          ColorSystem.colorize(String(stats.rapid), ColorSystem.codes.red)
        }`,
        `Systems Active: ${ColorSystem.colorize(String(stats.cleaning), ColorSystem.codes.brightGreen)} · Pending Dispatch: ${
          ColorSystem.colorize(String(stats.pending), ColorSystem.codes.brightYellow)
        }`,
        `Hood Volume In-Progress: ${Formatter.number(stats.hoodTotal)} • Avg/System: ${
          Formatter.number(stats.avgHoods, { minimumFractionDigits: 1 })
        }`,
        `Compliance Rhythm: ${
          ColorSystem.colorize("NFPA 96 protocols verified across all live jobs", ColorSystem.codes.brightWhite)
        }`,
      ],
      {
        title: "Supreme Dispatch Snapshot",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
        margin: 1,
      },
    );
  }

  renderScheduleTable() {
    console.log(ColorSystem.colorize("  SAME-DAY APPOINTMENT HANDLER", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("  ───────────────────────────", ColorSystem.codes.dim));
    console.log("");

    TableRenderer.render(
      this.appointments.map((appt) => ({
        ticket: appt.id,
        client: `${appt.kitchen}\n${ColorSystem.colorize(appt.location, ColorSystem.codes.dim)}`,
        window: appt.window,
        service: `${appt.service}\n${this.priorityChip(appt.priority)}`,
        crew: `${appt.crew}\n${appt.contact}`,
        status: this.statusColor(appt.status),
        scope: `${appt.hoodCount} hoods`,
      })),
      [
        { key: "ticket", label: "Ticket", width: 10 },
        { key: "client", label: "Kitchen / Location", width: 32 },
        { key: "window", label: "Window", width: 18 },
        { key: "service", label: "Service", width: 28 },
        { key: "crew", label: "Assigned Crew", width: 26 },
        { key: "status", label: "Status", width: 14 },
        { key: "scope", label: "Scope", width: 10, align: "center" },
      ],
      { showIndex: false },
    );
    console.log("");
  }

  async ingestUrgentRequest() {
    const spinner = new Spinner({ message: "Listening for fire marshal escalation..." });
    spinner.start();
    await sleep(800);
    spinner.update("Verifying grease load photos from Paseo District rooftop...");
    await sleep(800);
    spinner.update("Checking crew capacity and access badges...");
    await sleep(600);
    spinner.succeed("Rapid response window confirmed for Paseo Social Club");

    const urgentJob: Appointment = {
      id: "OKC-2074",
      kitchen: "Paseo Social Club",
      location: "627 NW 28th St, Oklahoma City, OK 73103",
      window: "3:00 PM – 5:30 PM",
      service: "Emergency fan degrease & duct polish",
      hoodCount: 3,
      crew: "Skyline Rapid 2",
      priority: "Rapid Response",
      status: "Dispatched",
      contact: "Everly James • 405-555-0190",
    };

    this.appointments.unshift(urgentJob);
    this.logger.warning("Emergency job inserted", {
      ticket: urgentJob.id,
      crew: urgentJob.crew,
      serviceWindow: urgentJob.window,
    });

    BoxRenderer.render(
      [
        `Client: ${urgentJob.kitchen} • ${urgentJob.location}`,
        `Scope: ${urgentJob.service} (${urgentJob.hoodCount} hoods)`,
        `Crew Assigned: ${urgentJob.crew} | Contact: ${urgentJob.contact}`,
        `Window: ${urgentJob.window}`,
      ],
      { title: "New Rapid Response Ticket", style: "rounded", color: ColorSystem.codes.red, padding: 1, margin: 1 },
    );

    console.log(ColorSystem.colorize("  UPDATED DISPATCH BOARD", ColorSystem.codes.bright));
    console.log("");
    this.renderScheduleTable();
  }

  private advanceStatus(id: string, status: AppointmentStatus, note: string) {
    const appointment = this.appointments.find((appt) => appt.id === id);
    if (!appointment) return;
    appointment.status = status;
    this.logger.info(note, {
      ticket: appointment.id,
      crew: appointment.crew,
      status,
    });
  }

  async runLiveTimeline(id: string) {
    const appointment = this.appointments.find((appt) => appt.id === id);
    if (!appointment) return;

    console.log(ColorSystem.colorize("  REAL-TIME SERVICE TIMELINE", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize(`  ${appointment.kitchen} • ${appointment.window}`, ColorSystem.codes.dim));
    console.log("");

    const phases = [
      { status: "Dispatched", units: 12, note: "Crew rolling from Edmond HQ" },
      { status: "En Route", units: 14, note: "Cross-checking access with facilities" },
      { status: "On Site", units: 10, note: "Roof access confirmed, lock-out/tag-out in place" },
      { status: "Cleaning", units: 26, note: "Hood, duct, and fan degreasing underway" },
      { status: "Quality Check", units: 16, note: "Photos captured, airflow verified" },
      { status: "Completed", units: 6, note: "Signed off by client" },
    ] as const;

    const totalUnits = phases.reduce((sum, item) => sum + item.units, 0);
    const bar = new ProgressBar({ total: totalUnits, width: 60, showValue: false, showPercentage: true });
    let progress = 0;

    for (const phase of phases) {
      this.advanceStatus(id, phase.status, phase.note);
      for (let i = 0; i < phase.units; i++) {
        progress += 1;
        bar.update(progress);
        await sleep(45);
      }
    }

    bar.complete();
    console.log("");

    BoxRenderer.render(
      [
        `Final Photos: ${ColorSystem.colorize("Uploaded to client portal", ColorSystem.codes.brightGreen)}`,
        `Airflow Baseline: ${Formatter.number(6800)} CFM • Static Pressure: ${Formatter.number(1.4)}" w.g.`,
        `Debrief: ${ColorSystem.colorize("All dampers reset, kitchen reopened on time", ColorSystem.codes.brightCyan)}`,
      ],
      { title: `${appointment.kitchen} Wrap-Up`, style: "classic", padding: 1 },
    );
  }
}

class RealTimeFleetTracker {
  constructor(private readonly logger: Logger, private readonly telemetry: CrewTelemetry[]) {}

  private statusBadge(status: CrewTelemetry["status"]) {
    const palette: Record<CrewTelemetry["status"], string> = {
      Staged: ColorSystem.codes.brightBlue,
      Transit: ColorSystem.codes.brightYellow,
      "Roof Inspection": ColorSystem.codes.brightMagenta,
      Degreasing: ColorSystem.codes.brightGreen,
      "QA / Photos": ColorSystem.codes.brightWhite,
    };
    return ColorSystem.colorize(status, palette[status]);
  }

  private refreshSensors() {
    this.telemetry.forEach((crew) => {
      crew.progress = Math.min(100, crew.progress + Math.random() * 16);
      crew.greaseLoad = Math.max(8, Math.min(92, crew.greaseLoad + (Math.random() - 0.4) * 10));
      crew.staticPressure = parseFloat((crew.staticPressure + (Math.random() - 0.5) * 0.3).toFixed(1));
      crew.airflow = Math.max(3600, crew.airflow + (Math.random() - 0.4) * 220);
      crew.etaMinutes = Math.max(4, crew.etaMinutes - Math.round(Math.random() * 4));

      if (crew.progress > 85) {
        crew.status = "QA / Photos";
      } else if (crew.progress > 60) {
        crew.status = "Degreasing";
      } else if (crew.progress > 35) {
        crew.status = "Roof Inspection";
      } else if (crew.progress > 10) {
        crew.status = "Transit";
      }
    });
  }

  private renderCycle(iteration: number) {
    console.log(ColorSystem.colorize(`  REAL-TIME CREW TELEMETRY • Refresh ${iteration + 1}`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      this.telemetry.map((crew) => ({
        crew: crew.crew,
        mission: `${crew.currentJob}\n${ColorSystem.colorize(crew.area, ColorSystem.codes.dim)}`,
        eta: `${crew.etaMinutes}m`,
        airflow: `${Formatter.number(Math.round(crew.airflow))} cfm`,
        pressure: `${crew.staticPressure.toFixed(1)}"`,
        grease: blockGauge(crew.greaseLoad),
        progress: blockGauge(crew.progress),
        status: this.statusBadge(crew.status),
        milestone: crew.nextMilestone,
      })),
      [
        { key: "crew", label: "Crew", width: 18 },
        { key: "mission", label: "Mission", width: 32 },
        { key: "eta", label: "ETA", width: 8, align: "center" },
        { key: "airflow", label: "Airflow", width: 12 },
        { key: "pressure", label: "Static P", width: 12 },
        { key: "grease", label: "Grease Load", width: 16 },
        { key: "progress", label: "Completion", width: 16 },
        { key: "status", label: "Status", width: 16 },
        { key: "milestone", label: "Next Milestone", width: 26 },
      ],
    );
    console.log("");
  }

  async stream(iterations: number) {
    for (let i = 0; i < iterations; i++) {
      this.refreshSensors();
      this.renderCycle(i);
      this.logger.debug("Telemetry refresh complete", { cycle: i + 1 });
      if (i < iterations - 1) {
        await sleep(650);
      }
    }
  }
}

async function runDemo() {
  console.clear();
  console.log("");

  BannerRenderer.render({
    title: "SUPREME KITCHEN EXHAUST CLEANING",
    subtitle: "Precision hood, duct, and rooftop fan specialists",
    description: "Command center • 16404 Friar Court • Edmond, OK 73013 • 24/7 rapid response",
    width: 96,
    style: "double",
    color: ColorSystem.codes.brightCyan,
    author: "GenesisTrace Real-Time Operations Deck",
  });
  console.log("");

  const logger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("debug")
      .enableHistory(true)
      .build(),
  );

  logger.success("Dispatch console initialized", {
    teamsOnline: 4,
    complianceLinks: ["NFPA 96", "OMMA", "City of Edmond"],
  });

  BoxRenderer.render(
    [
      `Headquarters: ${ColorSystem.colorize("16404 Friar Court, Edmond, OK 73013", ColorSystem.codes.brightCyan)}`,
      `Coverage: OKC Metro • Edmond • Moore • Yukon • Piedmont`,
      `Hotline: ${ColorSystem.colorize("405-555-0114", ColorSystem.codes.brightYellow)} · Target Dispatch Time: < 12 minutes`,
      `Technologies: GenesisTrace telemetry • Thermal imaging • Live soot load sensors`,
      `Guarantee: ${ColorSystem.colorize("Certified grease-free exhaust with next-morning readiness", ColorSystem.codes.brightGreen)}`,
    ],
    {
      title: "Mission Briefing",
      style: "rounded",
      padding: 1,
      margin: 1,
      color: ColorSystem.codes.brightCyan,
    },
  );

  const coordinator = new AppointmentCoordinator(logger, [
    {
      id: "OKC-2045",
      kitchen: "Valor Steakhouse",
      location: "1101 W Memorial Rd, Oklahoma City, OK 73114",
      window: "4:30 AM – 7:00 AM",
      service: "Full exhaust degrease + rooftop fan polish",
      hoodCount: 4,
      crew: "Skyline 3",
      priority: "Rapid Response",
      status: "Scheduled",
      contact: "Marla Bright • 405-555-0188",
    },
    {
      id: "EDM-1182",
      kitchen: "Summit Middle School",
      location: "1703 NW 150th St, Edmond, OK 73013",
      window: "6:00 AM – 9:00 AM",
      service: "Preventive maintenance & filter rotation",
      hoodCount: 6,
      crew: "Metro 1",
      priority: "Preventive Maintenance",
      status: "Dispatched",
      contact: "District Ops • 405-555-0175",
    },
    {
      id: "OKC-2051",
      kitchen: "Frontier Food Hall",
      location: "300 W 1st St, Edmond, OK 73003",
      window: "10:00 PM – 1:00 AM",
      service: "Multi-tenant hood inspection",
      hoodCount: 8,
      crew: "Frontier 4",
      priority: "Compliance Audit",
      status: "On Site",
      contact: "Night Manager • 405-555-0143",
    },
    {
      id: "HFD-7712",
      kitchen: "Heritage Hills Hotel",
      location: "1215 N Hudson Ave, Oklahoma City, OK 73103",
      window: "1:00 AM – 4:00 AM",
      service: "Duct scraping + fan balancing",
      hoodCount: 5,
      crew: "Roofline 5",
      priority: "Preventive Maintenance",
      status: "Cleaning",
      contact: "Chief Engineer • 405-555-0152",
    },
    {
      id: "OKC-1990",
      kitchen: "Bricktown Arena Concessions",
      location: "100 W Reno Ave, Oklahoma City, OK 73102",
      window: "2:30 AM – 6:00 AM",
      service: "Arena wide duct drop Blitz",
      hoodCount: 12,
      crew: "Arena Strike Team",
      priority: "Compliance Audit",
      status: "Quality Check",
      contact: "ASM Ops • 405-555-0101",
    },
  ]);

  coordinator.renderOverview();
  coordinator.renderScheduleTable();
  await coordinator.ingestUrgentRequest();

  const telemetry = new RealTimeFleetTracker(logger, [
    {
      crew: "Skyline 3",
      area: "Memorial Rd → Broadway Extension",
      currentJob: "Valor Steakhouse fan polishing",
      nextMilestone: "Setup rooftop containment",
      etaMinutes: 14,
      progress: 22,
      staticPressure: 1.3,
      airflow: 5200,
      greaseLoad: 44,
      status: "Transit",
    },
    {
      crew: "Metro 1",
      area: "Edmond Schools Corridor",
      currentJob: "Summit Middle - filter rotation",
      nextMilestone: "Kitchen sign-off with facilities",
      etaMinutes: 6,
      progress: 48,
      staticPressure: 1.1,
      airflow: 6100,
      greaseLoad: 38,
      status: "Roof Inspection",
    },
    {
      crew: "Roofline 5",
      area: "Midtown • 10th Street",
      currentJob: "Heritage Hills duct scraping",
      nextMilestone: "Thermal imaging sweep",
      etaMinutes: 18,
      progress: 67,
      staticPressure: 1.6,
      airflow: 4800,
      greaseLoad: 57,
      status: "Degreasing",
    },
    {
      crew: "Arena Strike Team",
      area: "Bricktown Arena",
      currentJob: "Concessions QA photos",
      nextMilestone: "Upload signed NFPA 96 log",
      etaMinutes: 11,
      progress: 82,
      staticPressure: 1.2,
      airflow: 7500,
      greaseLoad: 33,
      status: "QA / Photos",
    },
  ]);

  await telemetry.stream(3);
  await coordinator.runLiveTimeline("HFD-7712");

  console.log(ColorSystem.colorize("  WEEKLY PRODUCTION LOAD", ColorSystem.codes.bright));
  console.log("");
  ChartRenderer.barChart(
    [
      { label: "Mon", value: 8 },
      { label: "Tue", value: 11 },
      { label: "Wed", value: 13 },
      { label: "Thu", value: 12 },
      { label: "Fri", value: 14 },
      { label: "Sat", value: 6 },
    ],
    {
      width: 52,
      color: ColorSystem.codes.brightCyan,
      showValues: true,
      title: "Completed Systems Per Day",
    },
  );
  console.log("");

  logger.success("Supreme Kitchen Exhaust Cleaning demo completed", {
    demo: "supreme-kitchen-exhaust-cleaning.ts",
    crews: 4,
    jobsTracked: 6,
  });
}

if (import.meta.main) {
  runDemo().catch((error) => {
    console.error("Demo failed", error);
  });
}
