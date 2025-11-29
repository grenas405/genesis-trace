#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma Gas & Electric (OG&E) Grid Operations Demo
 *
 * A fully narrated GenesisTrace console showcasing how OG&E operators
 * manage grid reliability, renewable integration, storm restoration,
 * and customer outreach across Oklahoma.
 *
 * Features highlighted:
 *   • Themed logger, banners, and utility-grade tables
 *   • Real-time grid snapshot with load trends and reserve tracking
 *   • Generation fleet analytics plus fuel mix pie chart
 *   • Outage and storm command dashboard with restoration progress
 *   • Field crew deployment viewer and workload insights
 *   • Customer experience, market telemetry, and interactive outage intake
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  InteractivePrompts,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// DATA STRUCTURES
// ============================================================================

interface GridSnapshot {
  systemLoadMW: number;
  availableCapacityMW: number;
  renewableOutputMW: number;
  renewableShare: number;
  frequencyHz: number;
  tieImportsMW: number;
  reliabilityMarginPct: number;
  weatherAlert: string;
  stormCellsTracking: number;
  feedersOnWatch: number;
}

interface GridRegion {
  name: string;
  loadMW: number;
  forecastPeakMW: number;
  reserveMarginPct: number;
  feedersOnline: number;
  status: "Normal" | "Watch" | "Conserve" | "Wind Surge";
  renewableShare: number;
  frequencyDeviation: number;
}

interface GenerationAsset {
  unitId: string;
  facility: string;
  type: string;
  county: string;
  capacityMW: number;
  outputMW: number;
  status: "Online" | "Ramping" | "Reserve" | "Maintenance" | "Discharging";
  fuel: "Natural Gas" | "Dual Fuel" | "Wind" | "Solar" | "Battery";
  heatRate: number;
  emissionsRate: number;
}

type OutageStatus = "Assessing" | "Crew Assigned" | "Repairs Underway" | "Restored";

interface OutageTicket {
  ticketId: string;
  county: string;
  feeder: string;
  cause: string;
  status: OutageStatus;
  customersAffected: number;
  criticalCustomers: string[];
  etaHours: number;
  progress: number;
  reportedAt: Date;
}

interface FieldCrew {
  crewId: string;
  base: string;
  specialty: string;
  status: "Available" | "Dispatched" | "Working" | "Standby" | "Assessing";
  assignment?: string;
  etaMinutes?: number;
  crewLead: string;
  resources: string[];
}

interface CustomerChannel {
  channel: string;
  volume: number;
  ahtSeconds: number;
  satisfaction: number;
}

interface MarketSample {
  hour: string;
  demandMW: number;
  locationalPrice: number;
}

// ============================================================================
// DATA LAYER
// ============================================================================

class OGEDatabase {
  private gridSnapshot: GridSnapshot = {
    systemLoadMW: 3920,
    availableCapacityMW: 5280,
    renewableOutputMW: 1345,
    renewableShare: 0.34,
    frequencyHz: 60.01,
    tieImportsMW: 470,
    reliabilityMarginPct: 0.17,
    weatherAlert: "Severe storms over Canadian, Logan, and Kingfisher counties",
    stormCellsTracking: 3,
    feedersOnWatch: 12,
  };

  private gridRegions: GridRegion[] = [
    {
      name: "Oklahoma City Metro",
      loadMW: 1850,
      forecastPeakMW: 2100,
      reserveMarginPct: 0.15,
      feedersOnline: 487,
      status: "Normal",
      renewableShare: 0.22,
      frequencyDeviation: -0.01,
    },
    {
      name: "Western Plains",
      loadMW: 920,
      forecastPeakMW: 1080,
      reserveMarginPct: 0.18,
      feedersOnline: 312,
      status: "Wind Surge",
      renewableShare: 0.48,
      frequencyDeviation: 0.03,
    },
    {
      name: "Southern Corridor",
      loadMW: 640,
      forecastPeakMW: 780,
      reserveMarginPct: 0.11,
      feedersOnline: 241,
      status: "Watch",
      renewableShare: 0.19,
      frequencyDeviation: -0.05,
    },
    {
      name: "River Valley",
      loadMW: 510,
      forecastPeakMW: 680,
      reserveMarginPct: 0.09,
      feedersOnline: 198,
      status: "Conserve",
      renewableShare: 0.27,
      frequencyDeviation: -0.04,
    },
  ];

  private loadTrend = [3520, 3585, 3650, 3710, 3825, 3895, 3940, 3990, 4075, 4005, 3945, 3920];
  private renewableTrend = [26, 28, 27, 29, 31, 33, 34, 35, 37, 36, 34, 33];

  private generationFleet: GenerationAsset[] = [
    {
      unitId: "RB-01",
      facility: "Redbud Energy Station",
      type: "Combined-Cycle Gas",
      county: "Oklahoma",
      capacityMW: 1230,
      outputMW: 1080,
      status: "Online",
      fuel: "Natural Gas",
      heatRate: 7050,
      emissionsRate: 0.58,
    },
    {
      unitId: "MC-02",
      facility: "McClain Power Plant",
      type: "Gas Turbine",
      county: "Cleveland",
      capacityMW: 520,
      outputMW: 410,
      status: "Ramping",
      fuel: "Natural Gas",
      heatRate: 9750,
      emissionsRate: 0.64,
    },
    {
      unitId: "MK-03",
      facility: "Muskogee Station",
      type: "Coal / Gas",
      county: "Muskogee",
      capacityMW: 650,
      outputMW: 480,
      status: "Online",
      fuel: "Dual Fuel",
      heatRate: 10200,
      emissionsRate: 0.94,
    },
    {
      unitId: "WC-04",
      facility: "North Canadian Wind",
      type: "Wind Farm",
      county: "Harper",
      capacityMW: 450,
      outputMW: 360,
      status: "Online",
      fuel: "Wind",
      heatRate: 0,
      emissionsRate: 0,
    },
    {
      unitId: "SP-05",
      facility: "Mustang Solar + Storage",
      type: "Solar + Battery",
      county: "Canadian",
      capacityMW: 180,
      outputMW: 146,
      status: "Online",
      fuel: "Solar",
      heatRate: 0,
      emissionsRate: 0,
    },
    {
      unitId: "ES-06",
      facility: "Sooner Battery Reserve",
      type: "Grid Battery",
      county: "Logan",
      capacityMW: 200,
      outputMW: 90,
      status: "Discharging",
      fuel: "Battery",
      heatRate: 0,
      emissionsRate: 0,
    },
    {
      unitId: "AR-07",
      facility: "Ardmore Peaker",
      type: "Simple-Cycle Gas",
      county: "Carter",
      capacityMW: 240,
      outputMW: 0,
      status: "Reserve",
      fuel: "Natural Gas",
      heatRate: 10900,
      emissionsRate: 0.71,
    },
  ];

  private outages: OutageTicket[] = [
    {
      ticketId: "OGE-2025-0412",
      county: "Canadian",
      feeder: "YUK-14",
      cause: "Wind Damage",
      status: "Repairs Underway",
      customersAffected: 4200,
      criticalCustomers: ["INTEGRIS Canadian Valley", "City of Yukon Water"],
      etaHours: 3.5,
      progress: 65,
      reportedAt: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      ticketId: "OGE-2025-0413",
      county: "Logan",
      feeder: "GTH-07",
      cause: "Tree Contact",
      status: "Crew Assigned",
      customersAffected: 1180,
      criticalCustomers: ["Guthrie Community Hospital"],
      etaHours: 2.2,
      progress: 35,
      reportedAt: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      ticketId: "OGE-2025-0414",
      county: "Stephens",
      feeder: "DUN-03",
      cause: "Lightning Strike",
      status: "Assessing",
      customersAffected: 620,
      criticalCustomers: [],
      etaHours: 5.1,
      progress: 12,
      reportedAt: new Date(Date.now() - 1000 * 60 * 12),
    },
    {
      ticketId: "OGE-2025-0415",
      county: "Pottawatomie",
      feeder: "SHA-11",
      cause: "Equipment Failure",
      status: "Restored",
      customersAffected: 80,
      criticalCustomers: ["Shawnee Water Plant"],
      etaHours: 0,
      progress: 100,
      reportedAt: new Date(Date.now() - 1000 * 60 * 90),
    },
  ];

  private crews: FieldCrew[] = [
    {
      crewId: "Storm-51",
      base: "Mustang Service Center",
      specialty: "Transmission & Structure",
      status: "Working",
      assignment: "OGE-2025-0412",
      etaMinutes: 90,
      crewLead: "R. Patel",
      resources: ["Bucket Truck", "Breaker Truck"],
    },
    {
      crewId: "Rapid-24",
      base: "Guthrie Operations",
      specialty: "Vegetation & Patrol",
      status: "Dispatched",
      assignment: "OGE-2025-0413",
      etaMinutes: 35,
      crewLead: "K. Torres",
      resources: ["Saw Team", "Light Duty Bucket"],
    },
    {
      crewId: "Grid-09",
      base: "Norman Operations",
      specialty: "Substation & Relay",
      status: "Standby",
      crewLead: "A. Collins",
      resources: ["Relay Technicians"],
    },
    {
      crewId: "Storm-64",
      base: "Duncan Yard",
      specialty: "Distribution Line",
      status: "Assessing",
      assignment: "OGE-2025-0414",
      etaMinutes: 55,
      crewLead: "M. Owens",
      resources: ["Pole Crew", "Mobile Ops Center"],
    },
    {
      crewId: "Mutual-71",
      base: "Wichita Falls (Mutual Aid)",
      specialty: "Transmission",
      status: "Available",
      crewLead: "C. Reynolds",
      resources: ["Transmission Line", "Heavy Crane"],
    },
  ];

  private customerChannels: CustomerChannel[] = [
    { channel: "Call Center", volume: 860, ahtSeconds: 312, satisfaction: 0.91 },
    { channel: "OG&E App", volume: 5120, ahtSeconds: 74, satisfaction: 0.95 },
    { channel: "SMS Outage", volume: 1880, ahtSeconds: 62, satisfaction: 0.89 },
    { channel: "Outage Web Form", volume: 930, ahtSeconds: 96, satisfaction: 0.93 },
  ];

  private marketTelemetry: MarketSample[] = [
    { hour: "HE 08", demandMW: 3720, locationalPrice: 28.5 },
    { hour: "HE 09", demandMW: 3840, locationalPrice: 33.7 },
    { hour: "HE 10", demandMW: 3975, locationalPrice: 39.1 },
    { hour: "HE 11", demandMW: 4050, locationalPrice: 42.6 },
    { hour: "HE 12", demandMW: 3985, locationalPrice: 38.2 },
  ];

  private reliability = {
    saidiMinutes: 56,
    saifi: 1.06,
    cmi: 238_000,
    gridScore: 0.982,
  };

  private contactStats = {
    callServiceLevel: 0.84,
    avgHoldSeconds: 94,
    digitalReportsShare: 0.62,
    socialAlerts: 128,
  };

  private nextTicketSequence = 416;

  getGridSnapshot(): GridSnapshot {
    return { ...this.gridSnapshot };
  }

  getGridRegions(): GridRegion[] {
    return [...this.gridRegions];
  }

  getSystemLoadTrend(): number[] {
    return [...this.loadTrend];
  }

  getRenewableTrend(): number[] {
    return [...this.renewableTrend];
  }

  getGenerationFleet(): GenerationAsset[] {
    return [...this.generationFleet];
  }

  getGenerationStats() {
    const totalCapacity = this.generationFleet.reduce((sum, asset) => sum + asset.capacityMW, 0);
    const totalOutput = this.generationFleet.reduce((sum, asset) => sum + asset.outputMW, 0);
    const renewableOutput = this.generationFleet
      .filter((asset) => asset.fuel === "Wind" || asset.fuel === "Solar" || asset.fuel === "Battery")
      .reduce((sum, asset) => sum + asset.outputMW, 0);

    const avgHeatRate = this.generationFleet
      .filter((asset) => asset.heatRate > 0)
      .reduce((sum, asset) => sum + asset.heatRate, 0) /
      this.generationFleet.filter((asset) => asset.heatRate > 0).length;

    const weightedEmissions = this.generationFleet.reduce((sum, asset) =>
      sum + (asset.emissionsRate * asset.outputMW), 0) / totalOutput;

    return {
      totalCapacity,
      totalOutput,
      renewableOutput,
      availableReserve: totalCapacity - totalOutput,
      avgHeatRate,
      weightedEmissions,
      storageChargePercent: 0.68,
    };
  }

  getGenerationMix(): Record<string, number> {
    return this.generationFleet.reduce((mix, asset) => {
      mix[asset.fuel] = (mix[asset.fuel] || 0) + asset.outputMW;
      return mix;
    }, {} as Record<string, number>);
  }

  getOutages(): OutageTicket[] {
    return [...this.outages];
  }

  getOutageStats() {
    const active = this.outages.filter((o) => o.status !== "Restored");
    const customersImpacted = active.reduce((sum, outage) => sum + outage.customersAffected, 0);
    const criticalCircuits = active.filter((o) => o.criticalCustomers.length > 0).length;
    const averageETA = active.reduce((sum, outage) => sum + outage.etaHours, 0) / Math.max(active.length, 1);

    const causeBreakdown = active.reduce((map, outage) => {
      map[outage.cause] = (map[outage.cause] || 0) + outage.customersAffected;
      return map;
    }, {} as Record<string, number>);

    return {
      activeCount: active.length,
      customersImpacted,
      criticalCircuits,
      averageETA,
      causeBreakdown,
    };
  }

  getCrews(): FieldCrew[] {
    return [...this.crews];
  }

  getCrewStats() {
    const dispatched = this.crews.filter((crew) => crew.status === "Dispatched" || crew.status === "Working").length;
    const available = this.crews.filter((crew) => crew.status === "Available" || crew.status === "Standby").length;
    const coverageRate = dispatched / Math.max(this.crews.length, 1);

    return {
      totalCrews: this.crews.length,
      dispatched,
      available,
      coverageRate,
    };
  }

  getCustomerChannels(): CustomerChannel[] {
    return [...this.customerChannels];
  }

  getCustomerStats() {
    return {
      ...this.contactStats,
      ...this.reliability,
    };
  }

  getMarketTelemetry(): MarketSample[] {
    return [...this.marketTelemetry];
  }

  createOutageTicket(details: {
    county: string;
    feeder: string;
    cause: string;
    customersAffected: number;
    criticalCustomers?: string[];
  }): OutageTicket {
    const ticket: OutageTicket = {
      ticketId: `OGE-2025-${String(this.nextTicketSequence++).padStart(4, "0")}`,
      county: details.county,
      feeder: details.feeder || "Pending Patrol",
      cause: details.cause,
      status: "Assessing",
      customersAffected: details.customersAffected,
      criticalCustomers: details.criticalCustomers ?? [],
      etaHours: 4.5,
      progress: 5,
      reportedAt: new Date(),
    };

    this.outages.unshift(ticket);
    return ticket;
  }
}

// ============================================================================
// CLI
// ============================================================================

class OGEOperationsCLI {
  private db = new OGEDatabase();
  private logger: Logger;
  private running = true;

  constructor() {
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .enableHistory(true)
        .build(),
    );
  }

  async run() {
    this.showBanner();
    while (this.running) {
      const choice = await this.showMainMenu();
      switch (choice) {
        case "⚡ Grid Conditions Dashboard":
          await this.viewGridConditions();
          break;
        case "🏭 Generation Fleet & Fuel Mix":
          await this.viewGenerationFleet();
          break;
        case "🚨 Outage & Storm Command":
          await this.viewOutages();
          break;
        case "👷 Field Crew Deployment":
          await this.viewCrews();
          break;
        case "📞 Customer & Market Metrics":
          await this.viewCustomerAndMarket();
          break;
        case "➕ Simulate Outage Ticket":
          await this.simulateOutageTicket();
          break;
        case "🚪 Exit":
          this.running = false;
          console.log("\nThank you for supporting OG&E customers across Oklahoma.\n");
          break;
      }
    }
  }

  private showBanner() {
    console.clear();
    BannerRenderer.render({
      title: "⚡ OG&E GRID OPERATIONS",
      subtitle: "Oklahoma Gas & Electric • Energy Delivery Command Console",
      description: "Grid telemetry, storm restoration, renewable coordination, and customer care",
      version: "v1.0.0",
      author: "GenesisTrace Operations Lab",
      width: 100,
      style: "double",
      color: ColorSystem.codes.brightCyan,
    });
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" OG&E COMMAND OPTIONS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(80), ColorSystem.codes.brightCyan));
    console.log("");

    return await InteractivePrompts.select(
      "Select a module to open:",
      [
        { label: "⚡ Grid Conditions Dashboard", value: "⚡ Grid Conditions Dashboard" },
        { label: "🏭 Generation Fleet & Fuel Mix", value: "🏭 Generation Fleet & Fuel Mix" },
        { label: "🚨 Outage & Storm Command", value: "🚨 Outage & Storm Command" },
        { label: "👷 Field Crew Deployment", value: "👷 Field Crew Deployment" },
        { label: "📞 Customer & Market Metrics", value: "📞 Customer & Market Metrics" },
        { label: "➕ Simulate Outage Ticket", value: "➕ Simulate Outage Ticket" },
        { label: "🚪 Exit", value: "🚪 Exit" },
      ],
    );
  }

  // ==========================================================================
  // GRID CONDITIONS
  // ==========================================================================

  private async viewGridConditions() {
    this.logger.info("Synchronizing OG&E SCADA feed…");
    const spinner = new Spinner({ message: "Streaming telemetry packets..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Grid telemetry lock established");

    console.log("");
    console.log(ColorSystem.colorize(" OG&E GRID CONDITIONS ", ColorSystem.codes.bright));
    console.log("");

    const snapshot = this.db.getGridSnapshot();

    BoxRenderer.render(
      [
        `⚡ System Load: ${ColorSystem.colorize(`${Formatter.number(snapshot.systemLoadMW)} MW`, ColorSystem.codes.brightCyan)}`,
        `🧮 Available Capacity: ${Formatter.number(snapshot.availableCapacityMW)} MW`,
        `🌿 Renewable Output: ${Formatter.number(snapshot.renewableOutputMW)} MW (${Formatter.percentage(snapshot.renewableShare)})`,
        `🛰️ Interchange Imports: ${Formatter.number(snapshot.tieImportsMW)} MW`,
        `📏 Frequency: ${snapshot.frequencyHz.toFixed(2)} Hz  •  Margin ${Formatter.percentage(snapshot.reliabilityMarginPct)}`,
        `🌩️ Weather: ${snapshot.weatherAlert}`,
        `🛰️ Storm Cells Tracked: ${snapshot.stormCellsTracking}  •  Feeders on Watch: ${snapshot.feedersOnWatch}`,
      ],
      {
        title: "Grid Snapshot",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      },
    );

    console.log("");
    console.log(ColorSystem.colorize("Regional Load & Margins", ColorSystem.codes.bright));
    TableRenderer.render(
      this.db.getGridRegions(),
      [
        { key: "name", label: "Region", width: 24 },
        {
          key: "loadMW",
          label: "Load (MW)",
          width: 12,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "forecastPeakMW",
          label: "Forecast Peak",
          width: 14,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "reserveMarginPct",
          label: "Reserve",
          width: 10,
          align: "right",
          formatter: (value) => Formatter.percentage(value),
        },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status) => {
            const colors: Record<string, string> = {
              "Normal": ColorSystem.codes.green,
              "Watch": ColorSystem.codes.yellow,
              "Conserve": ColorSystem.codes.red,
              "Wind Surge": ColorSystem.codes.brightBlue,
            };
            return ColorSystem.colorize(status, colors[status] ?? ColorSystem.codes.white);
          },
        },
        {
          key: "renewableShare",
          label: "Renewables",
          width: 10,
          align: "right",
          formatter: (value) => Formatter.percentage(value),
        },
      ],
      { showIndex: true },
    );

    console.log("");
    console.log(ColorSystem.colorize("Load Trend (15-min intervals)", ColorSystem.codes.brightBlue));
    const loadTrend = this.db.getSystemLoadTrend();
    ChartRenderer.lineChart(loadTrend, { width: loadTrend.length, height: 8 });
    console.log(
      `${ColorSystem.codes.brightBlue}Renewable % Sparkline:${ColorSystem.codes.reset} ${ChartRenderer.sparkline(this.db.getRenewableTrend())}`,
    );
    console.log("");

    console.log(ColorSystem.colorize("Reliability Margin", ColorSystem.codes.bright));
    const marginBar = new ProgressBar({
      total: 100,
      width: 50,
      showValue: false,
      colorize: true,
      showPercentage: true,
    });
    marginBar.update(Math.round(snapshot.reliabilityMarginPct * 100));
    marginBar.complete();
    console.log("");
  }

  // ==========================================================================
  // GENERATION FLEET
  // ==========================================================================

  private async viewGenerationFleet() {
    this.logger.info("Gathering generation telemetry…");
    const spinner = new Spinner({ message: "Retrieving plant dispatch data..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Generation stack synchronized");

    console.log("");
    console.log(ColorSystem.colorize(" OG&E GENERATION FLEET ", ColorSystem.codes.bright));
    console.log("");

    const stats = this.db.getGenerationStats();

    BoxRenderer.render(
      [
        `⚡ Total Capacity: ${Formatter.number(stats.totalCapacity)} MW`,
        `🔌 Current Output: ${Formatter.number(stats.totalOutput)} MW`,
        `🌿 Renewable On-Line: ${Formatter.number(stats.renewableOutput)} MW`,
        `📦 Reserve Margin: ${Formatter.number(stats.availableReserve)} MW`,
        `🔥 Avg Heat Rate: ${Formatter.number(Math.round(stats.avgHeatRate))} BTU/kWh`,
        `🌫️ Weighted Emissions: ${stats.weightedEmissions.toFixed(2)} tons/MWh`,
        `🔋 Battery State of Charge: ${Formatter.percentage(stats.storageChargePercent)}`,
      ],
      {
        title: "Fleet Snapshot",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      },
    );

    console.log("");
    TableRenderer.render(
      this.db.getGenerationFleet(),
      [
        { key: "facility", label: "Facility", width: 26 },
        { key: "county", label: "County", width: 12 },
        {
          key: "type",
          label: "Technology",
          width: 18,
        },
        {
          key: "capacityMW",
          label: "Capacity",
          width: 10,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "outputMW",
          label: "Output",
          width: 10,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status) => {
            const palette: Record<string, string> = {
              "Online": ColorSystem.codes.brightGreen,
              "Ramping": ColorSystem.codes.yellow,
              "Reserve": ColorSystem.codes.cyan,
              "Maintenance": ColorSystem.codes.red,
              "Discharging": ColorSystem.codes.brightBlue,
            };
            return ColorSystem.colorize(status, palette[status] ?? ColorSystem.codes.white);
          },
        },
      ],
      { showIndex: true },
    );

    console.log("");
    console.log(ColorSystem.colorize("Fuel Mix (by MW output)", ColorSystem.codes.brightBlue));
    const mix = this.db.getGenerationMix();
    ChartRenderer.pieChart(
      Object.entries(mix).map(([label, value]) => ({ label, value })),
    );
    console.log("");
  }

  // ==========================================================================
  // OUTAGE COMMAND
  // ==========================================================================

  private async viewOutages() {
    this.logger.warning("Opening storm command board…");
    const spinner = new Spinner({ message: "Correlating outage management system..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("OMS synchronized");

    console.log("");
    console.log(ColorSystem.colorize(" OG&E OUTAGE & STORM COMMAND ", ColorSystem.codes.bright));
    console.log("");

    const stats = this.db.getOutageStats();

    BoxRenderer.render(
      [
        `🚨 Active Tickets: ${ColorSystem.colorize(String(stats.activeCount), ColorSystem.codes.brightRed)}`,
        `👥 Customers Impacted: ${Formatter.number(stats.customersImpacted)}`,
        `🏥 Critical Circuits: ${stats.criticalCircuits}`,
        `⏱️ Avg Restoration ETA: ${stats.averageETA.toFixed(1)} hrs`,
      ],
      {
        title: "Storm Impact",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      },
    );

    console.log("");
    TableRenderer.render(
      this.db.getOutages(),
      [
        { key: "ticketId", label: "Ticket", width: 14 },
        { key: "county", label: "County", width: 12 },
        { key: "feeder", label: "Feeder", width: 10 },
        {
          key: "customersAffected",
          label: "Customers",
          align: "right",
          width: 12,
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "status",
          label: "Status",
          width: 16,
          formatter: (status) => {
            const palette: Record<string, string> = {
              "Assessing": ColorSystem.codes.yellow,
              "Crew Assigned": ColorSystem.codes.cyan,
              "Repairs Underway": ColorSystem.codes.brightGreen,
              "Restored": ColorSystem.codes.green,
            };
            return ColorSystem.colorize(status, palette[status] ?? ColorSystem.codes.white);
          },
        },
        {
          key: "reportedAt",
          label: "Reported",
          width: 16,
          formatter: (value) => Formatter.relativeTime(value),
        },
      ],
      { showIndex: true, rowLimit: 10 },
    );

    console.log("");
    console.log(ColorSystem.colorize("Restoration Progress", ColorSystem.codes.brightBlue));
    for (const outage of this.db.getOutages().slice(0, 3)) {
      console.log(`${ColorSystem.colorize(outage.ticketId, ColorSystem.codes.bright)} • ${outage.county} County`);
      const bar = new ProgressBar({
        total: 100,
        width: 50,
        showValue: false,
        colorize: true,
      });
      bar.update(outage.progress);
      bar.complete();
    }

    console.log("");
    console.log(ColorSystem.colorize("Customers Impacted by Cause", ColorSystem.codes.brightBlue));
    ChartRenderer.barChart(
      Object.entries(stats.causeBreakdown).map(([label, value]) => ({ label, value })),
      { width: 40, showValues: true, color: ColorSystem.codes.brightRed },
    );
    console.log("");
  }

  // ==========================================================================
  // CREW DEPLOYMENT
  // ==========================================================================

  private async viewCrews() {
    this.logger.info("Loading crew status boards…");
    const spinner = new Spinner({ message: "Syncing with workforce management..." });
    spinner.start();
    await sleep(750);
    spinner.succeed("Crew telemetry available");

    console.log("");
    console.log(ColorSystem.colorize(" OG&E FIELD CREWS ", ColorSystem.codes.bright));
    console.log("");

    const stats = this.db.getCrewStats();

    BoxRenderer.render(
      [
        `👷 Total Crews Tracked: ${stats.totalCrews}`,
        `🚚 Crews Working/Dispatched: ${stats.dispatched}`,
        `🛠️ Available/Standby: ${stats.available}`,
        `📡 Coverage Utilization: ${Formatter.percentage(stats.coverageRate)}`,
      ],
      {
        title: "Deployment Snapshot",
        style: "double",
        color: ColorSystem.codes.brightMagenta,
        padding: 1,
      },
    );

    console.log("");
    TableRenderer.render(
      this.db.getCrews(),
      [
        { key: "crewId", label: "Crew", width: 12 },
        { key: "base", label: "Base", width: 22 },
        { key: "specialty", label: "Specialty", width: 22 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status) => {
            const palette: Record<string, string> = {
              "Available": ColorSystem.codes.green,
              "Dispatched": ColorSystem.codes.cyan,
              "Working": ColorSystem.codes.brightGreen,
              "Standby": ColorSystem.codes.yellow,
              "Assessing": ColorSystem.codes.yellow,
            };
            return ColorSystem.colorize(status, palette[status] ?? ColorSystem.codes.white);
          },
        },
        {
          key: "assignment",
          label: "Assignment",
          width: 16,
          formatter: (value) => value ?? "—",
        },
        {
          key: "etaMinutes",
          label: "ETA (min)",
          width: 10,
          align: "right",
          formatter: (value) => value ? `${value}` : "—",
        },
      ],
      { showIndex: true },
    );

    console.log("");
    console.log(ColorSystem.colorize("Resources per Crew", ColorSystem.codes.brightBlue));
    const resourceCounts = this.db.getCrews().map((crew) => ({ label: crew.crewId, value: crew.resources.length }));
    ChartRenderer.barChart(resourceCounts, { width: 30, showValues: true, color: ColorSystem.codes.brightMagenta });
    console.log("");
  }

  // ==========================================================================
  // CUSTOMER + MARKET
  // ==========================================================================

  private async viewCustomerAndMarket() {
    this.logger.info("Pulling customer operations & market telemetry…");
    const spinner = new Spinner({ message: "Analyzing contact centers..." });
    spinner.start();
    await sleep(820);
    spinner.succeed("Customer metrics streamed");

    console.log("");
    console.log(ColorSystem.colorize(" CUSTOMER EXPERIENCE & MARKET ", ColorSystem.codes.bright));
    console.log("");

    const stats = this.db.getCustomerStats();

    BoxRenderer.render(
      [
        `☎️ Call Center Service Level: ${Formatter.percentage(stats.callServiceLevel)}`,
        `⏳ Avg Hold Time: ${Formatter.number(stats.avgHoldSeconds)} sec`,
        `📱 Digital Reports Share: ${Formatter.percentage(stats.digitalReportsShare)}`,
        `🐦 Social Alerts Managed: ${Formatter.number(stats.socialAlerts)}`,
        `🕒 SAIDI (rolling 12 mo): ${Formatter.number(stats.saidiMinutes)} minutes`,
        `🔁 SAIFI: ${stats.saifi.toFixed(2)} interruptions`,
        `📈 Grid Score (Reliability Index): ${(stats.gridScore * 100).toFixed(1)}%`,
        `👥 Customer Minutes Interrupted: ${Formatter.number(stats.cmi)}`,
      ],
      { title: "Customer & Reliability Health", style: "double", color: ColorSystem.codes.brightBlue, padding: 1 },
    );

    console.log("");
    console.log(ColorSystem.colorize("Customer Channel Volume", ColorSystem.codes.brightBlue));
    TableRenderer.render(
      this.db.getCustomerChannels(),
      [
        { key: "channel", label: "Channel", width: 22 },
        {
          key: "volume",
          label: "Today Volume",
          width: 14,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "ahtSeconds",
          label: "AHT (sec)",
          width: 12,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "satisfaction",
          label: "Satisfaction",
          width: 12,
          align: "right",
          formatter: (value) => Formatter.percentage(value),
        },
      ],
      { showIndex: true },
    );

    console.log("");
    console.log(ColorSystem.colorize("SPP Market Demand & Price (recent hours)", ColorSystem.codes.brightBlue));
    const market = this.db.getMarketTelemetry();
    TableRenderer.render(
      market,
      [
        { key: "hour", label: "Hour Ending", width: 10 },
        {
          key: "demandMW",
          label: "Demand (MW)",
          width: 14,
          align: "right",
          formatter: (value) => Formatter.number(value),
        },
        {
          key: "locationalPrice",
          label: "Price ($/MWh)",
          width: 14,
          align: "right",
          formatter: (value) => value.toFixed(2),
        },
      ],
    );

    console.log("");
    ChartRenderer.lineChart(
      market.map((m) => m.locationalPrice),
      { width: market.length, height: 6 },
    );
    console.log("");
  }

  // ==========================================================================
  // OUTAGE TICKET SIMULATION
  // ==========================================================================

  private async simulateOutageTicket() {
    this.logger.info("Launching outage intake workflow…");
    const county = await InteractivePrompts.input("County or district name:");
    const feeder = await InteractivePrompts.input("Feeder / circuit ID (optional):");
    const cause = await InteractivePrompts.select(
      "Primary cause",
      [
        { label: "Tree Contact / Vegetation", value: "Tree Contact" },
        { label: "Wind Damage", value: "Wind Damage" },
        { label: "Lightning Strike", value: "Lightning Strike" },
        { label: "Equipment Failure", value: "Equipment Failure" },
        { label: "Vehicle Incident", value: "Vehicle Incident" },
      ],
    );
    const customersInput = await InteractivePrompts.input("Estimated customers impacted:");
    const critical = await InteractivePrompts.confirm("Critical facilities affected?", false);
    let criticalList: string[] = [];
    if (critical) {
      const facilities = await InteractivePrompts.input("List facility names (comma separated):");
      criticalList = facilities.split(",").map((f) => f.trim()).filter(Boolean);
    }

    const customers = Number(customersInput.replace(/,/g, "")) || 0;
    const ticket = this.db.createOutageTicket({
      county: county || "Unspecified",
      feeder: feeder || "Pending Patrol",
      cause,
      customersAffected: customers,
      criticalCustomers: criticalList,
    });

    const spinner = new Spinner({ message: "Routing outage to dispatch..." });
    spinner.start();
    await sleep(700);
    spinner.succeed(`Ticket ${ticket.ticketId} opened`);

    this.logger.success("OMS intake completed", {
      ticket: ticket.ticketId,
      county: ticket.county,
      customers: ticket.customersAffected,
      critical: ticket.criticalCustomers.length,
    });

    console.log("");
    BoxRenderer.render(
      [
        `Ticket ${ticket.ticketId} created for ${ticket.county} County`,
        `Estimated customers impacted: ${Formatter.number(ticket.customersAffected)}`,
        ticket.criticalCustomers.length > 0
          ? `Critical sites: ${ticket.criticalCustomers.join(", ")}`
          : "Critical sites: none reported",
        `Initial ETA ${ticket.etaHours.toFixed(1)} hrs • Status ${ticket.status}`,
      ],
      {
        title: "New Outage Intake",
        style: "double",
        color: ColorSystem.codes.brightYellow,
        padding: 1,
      },
    );

    console.log("");
    await InteractivePrompts.confirm("Press Enter to return to the main menu...", true);
  }
}

// ============================================================================
// EXECUTION
// ============================================================================

if (import.meta.main) {
  const cli = new OGEOperationsCLI();
  await cli.run();
}
