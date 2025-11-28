#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Oklahoma City Police Department - Command & Operations Center
 *
 * A comprehensive demonstration of GenesisTrace capabilities for law enforcement
 * operations management and public safety coordination in Oklahoma City.
 *
 * This demonstration showcases:
 *   • Real-time dispatch and 911 call tracking
 *   • Officer deployment and status monitoring
 *   • Incident reporting and case management
 *   • Vehicle fleet tracking and GPS monitoring
 *   • Crime analytics and pattern recognition
 *   • Shift management and personnel scheduling
 *   • Evidence chain of custody tracking
 *   • Community policing metrics and outreach
 *   • Emergency response time analytics
 *   • Multi-department coordination (Fire, EMS, County Sheriff)
 *
 * Features demonstrated:
 *   • Logger with themed configuration for law enforcement
 *   • Interactive prompts for incident reporting
 *   • Tables for active calls, officer status, and case management
 *   • Charts for crime analytics and response metrics
 *   • Progress bars for case clearance rates
 *   • Spinners for system operations and data sync
 *   • Banners and boxes for department branding
 *   • Color-coded priority and status indicators
 *
 * Department Context:
 *   The Oklahoma City Police Department serves over 680,000 residents across
 *   621 square miles, operating from 6 patrol divisions with approximately
 *   1,100 sworn officers. The department is committed to community-oriented
 *   policing and proactive crime prevention.
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

interface Call911 {
  callId: string;
  callType: "Emergency" | "Non-Emergency" | "Administrative";
  priority: 1 | 2 | 3 | 4 | 5; // 1 = Life-threatening, 5 = Low priority
  category: "Assault" | "Burglary" | "Traffic" | "Domestic" | "Theft" | "Suspicious" | "Medical" | "Fire" | "Other";
  location: string;
  district: "NW" | "NE" | "SW" | "SE" | "Central" | "Lake Patrol";
  caller: string;
  description: string;
  dispatchedOfficers: string[];
  status: "Received" | "Dispatched" | "En Route" | "On Scene" | "Cleared" | "Cancelled";
  receivedTime: Date;
  dispatchTime?: Date;
  arrivalTime?: Date;
  clearedTime?: Date;
}

interface Officer {
  badgeNumber: string;
  name: string;
  rank: "Officer" | "Detective" | "Corporal" | "Sergeant" | "Lieutenant" | "Captain" | "Major" | "Chief";
  division: "Patrol" | "Detective" | "Traffic" | "K-9" | "SWAT" | "Community Relations" | "Training";
  district: "NW" | "NE" | "SW" | "SE" | "Central" | "Lake Patrol";
  shift: "Day" | "Evening" | "Night";
  status: "Available" | "En Route" | "On Scene" | "Busy" | "Out of Service" | "Off Duty";
  vehicleId?: string;
  currentCall?: string;
  location?: string;
  callsToday: number;
  yearsOfService: number;
}

interface Vehicle {
  vehicleId: string;
  type: "Patrol Car" | "SUV" | "Motorcycle" | "K-9 Unit" | "SWAT Vehicle" | "Unmarked" | "Bicycle";
  assignedOfficer?: string;
  status: "In Service" | "Out of Service" | "Maintenance" | "Available";
  mileage: number;
  location?: string;
  fuelLevel: number; // percentage
  lastMaintenance: Date;
}

interface CaseFile {
  caseNumber: string;
  incidentType: string;
  reportedDate: Date;
  location: string;
  district: string;
  assignedDetective?: string;
  status: "Open" | "Under Investigation" | "Closed - Arrest" | "Closed - Cleared" | "Suspended" | "Inactive";
  priority: "High" | "Medium" | "Low";
  victimsCount: number;
  suspectsIdentified: number;
  evidenceItems: number;
  lastUpdate: Date;
}

interface Evidence {
  evidenceId: string;
  caseNumber: string;
  itemType: string;
  description: string;
  collectedBy: string;
  collectedDate: Date;
  location: string;
  chainOfCustody: Array<{ officer: string; timestamp: Date; action: string }>;
  status: "Collected" | "In Storage" | "Lab Analysis" | "Court" | "Released" | "Destroyed";
}

interface CommunityProgram {
  programId: number;
  name: string;
  type: "Youth Outreach" | "Crime Prevention" | "Neighborhood Watch" | "School Resource" | "Senior Safety" | "Business Partnership";
  officer: string;
  participantsThisMonth: number;
  eventsScheduled: number;
  satisfactionRating: number; // 1-5
  budget: number;
}

// ============================================================================
// DATABASE
// ============================================================================

class OKCPDDatabase {
  private calls: Call911[] = [
    { callId: "911-20250125-0001", callType: "Emergency", priority: 1, category: "Assault", location: "2300 Classen Blvd", district: "Central", caller: "Anonymous", description: "Assault in progress, multiple persons involved", dispatchedOfficers: ["1045", "1046"], status: "On Scene", receivedTime: new Date(Date.now() - 1200000), dispatchTime: new Date(Date.now() - 1140000), arrivalTime: new Date(Date.now() - 900000) },
    { callId: "911-20250125-0002", callType: "Non-Emergency", priority: 3, category: "Traffic", location: "I-40 & Meridian Ave", district: "SW", caller: "John Smith", description: "Vehicle accident, no injuries", dispatchedOfficers: ["2034"], status: "On Scene", receivedTime: new Date(Date.now() - 1800000), dispatchTime: new Date(Date.now() - 1740000), arrivalTime: new Date(Date.now() - 1500000) },
    { callId: "911-20250125-0003", callType: "Emergency", priority: 2, category: "Burglary", location: "5678 N May Ave", district: "NW", caller: "Sarah Johnson", description: "Residential burglary alarm activation", dispatchedOfficers: ["3012"], status: "En Route", receivedTime: new Date(Date.now() - 600000), dispatchTime: new Date(Date.now() - 540000) },
    { callId: "911-20250125-0004", callType: "Non-Emergency", priority: 4, category: "Suspicious", location: "Penn Square Mall", district: "NW", caller: "Security", description: "Suspicious person loitering in parking lot", dispatchedOfficers: ["3023"], status: "Dispatched", receivedTime: new Date(Date.now() - 300000), dispatchTime: new Date(Date.now() - 240000) },
    { callId: "911-20250125-0005", callType: "Emergency", priority: 1, category: "Domestic", location: "1234 SE 15th St", district: "SE", caller: "Neighbor", description: "Domestic disturbance, loud arguing and screaming", dispatchedOfficers: ["4018", "4019"], status: "Dispatched", receivedTime: new Date(Date.now() - 180000), dispatchTime: new Date(Date.now() - 120000) },
  ];

  private officers: Officer[] = [
    { badgeNumber: "1045", name: "Michael Rodriguez", rank: "Sergeant", division: "Patrol", district: "Central", shift: "Day", status: "On Scene", vehicleId: "P-1045", currentCall: "911-20250125-0001", location: "2300 Classen Blvd", callsToday: 8, yearsOfService: 12 },
    { badgeNumber: "1046", name: "Jennifer Lee", rank: "Officer", division: "Patrol", district: "Central", shift: "Day", status: "On Scene", vehicleId: "P-1046", currentCall: "911-20250125-0001", location: "2300 Classen Blvd", callsToday: 6, yearsOfService: 5 },
    { badgeNumber: "2034", name: "David Thompson", rank: "Officer", division: "Traffic", district: "SW", shift: "Day", status: "On Scene", vehicleId: "P-2034", currentCall: "911-20250125-0002", location: "I-40 & Meridian", callsToday: 11, yearsOfService: 8 },
    { badgeNumber: "3012", name: "Amanda Martinez", rank: "Corporal", division: "Patrol", district: "NW", shift: "Day", status: "En Route", vehicleId: "P-3012", currentCall: "911-20250125-0003", location: "N May Ave", callsToday: 7, yearsOfService: 10 },
    { badgeNumber: "3023", name: "Robert Wilson", rank: "Officer", division: "Patrol", district: "NW", shift: "Day", status: "En Route", vehicleId: "P-3023", currentCall: "911-20250125-0004", location: "Penn Square", callsToday: 5, yearsOfService: 3 },
    { badgeNumber: "4018", name: "Lisa Anderson", rank: "Officer", division: "Patrol", district: "SE", shift: "Day", status: "En Route", vehicleId: "P-4018", currentCall: "911-20250125-0005", location: "SE 15th St", callsToday: 9, yearsOfService: 7 },
    { badgeNumber: "4019", name: "James Foster", rank: "Officer", division: "Patrol", district: "SE", shift: "Day", status: "En Route", vehicleId: "P-4019", currentCall: "911-20250125-0005", location: "SE 15th St", callsToday: 8, yearsOfService: 6 },
    { badgeNumber: "5001", name: "Michelle Chen", rank: "Detective", division: "Detective", district: "Central", shift: "Day", status: "Busy", location: "Headquarters", callsToday: 0, yearsOfService: 15 },
    { badgeNumber: "6012", name: "Christopher Garcia", rank: "Lieutenant", division: "Community Relations", district: "Central", shift: "Day", status: "Available", location: "Community Center", callsToday: 2, yearsOfService: 18 },
    { badgeNumber: "7001", name: "Sarah Kim", rank: "Officer", division: "K-9", district: "Central", shift: "Day", status: "Available", vehicleId: "K9-7001", location: "Training Facility", callsToday: 4, yearsOfService: 9 },
  ];

  private vehicles: Vehicle[] = [
    { vehicleId: "P-1045", type: "Patrol Car", assignedOfficer: "1045", status: "In Service", mileage: 45672, location: "2300 Classen Blvd", fuelLevel: 68, lastMaintenance: new Date("2025-01-15") },
    { vehicleId: "P-1046", type: "Patrol Car", assignedOfficer: "1046", status: "In Service", mileage: 38945, location: "2300 Classen Blvd", fuelLevel: 82, lastMaintenance: new Date("2025-01-10") },
    { vehicleId: "P-2034", type: "SUV", assignedOfficer: "2034", status: "In Service", mileage: 52341, location: "I-40 & Meridian", fuelLevel: 45, lastMaintenance: new Date("2025-01-18") },
    { vehicleId: "P-3012", type: "Patrol Car", assignedOfficer: "3012", status: "In Service", mileage: 41289, location: "N May Ave", fuelLevel: 73, lastMaintenance: new Date("2025-01-12") },
    { vehicleId: "P-3023", type: "Patrol Car", assignedOfficer: "3023", status: "In Service", mileage: 29456, location: "Penn Square", fuelLevel: 91, lastMaintenance: new Date("2025-01-20") },
    { vehicleId: "P-4018", type: "Patrol Car", assignedOfficer: "4018", status: "In Service", mileage: 47823, location: "SE 15th St", fuelLevel: 55, lastMaintenance: new Date("2025-01-14") },
    { vehicleId: "P-4019", type: "Patrol Car", assignedOfficer: "4019", status: "In Service", mileage: 43190, location: "SE 15th St", fuelLevel: 62, lastMaintenance: new Date("2025-01-16") },
    { vehicleId: "K9-7001", type: "K-9 Unit", assignedOfficer: "7001", status: "In Service", mileage: 35678, location: "Training Facility", fuelLevel: 88, lastMaintenance: new Date("2025-01-22") },
    { vehicleId: "M-101", type: "Motorcycle", status: "Available", mileage: 12345, fuelLevel: 95, lastMaintenance: new Date("2025-01-19") },
    { vehicleId: "SWAT-1", type: "SWAT Vehicle", status: "Out of Service", mileage: 28934, fuelLevel: 100, lastMaintenance: new Date("2025-01-08") },
  ];

  private cases: CaseFile[] = [
    { caseNumber: "2025-001234", incidentType: "Residential Burglary", reportedDate: new Date("2025-01-20"), location: "3400 N Walker Ave", district: "Central", assignedDetective: "5001", status: "Under Investigation", priority: "High", victimsCount: 1, suspectsIdentified: 1, evidenceItems: 12, lastUpdate: new Date("2025-01-24") },
    { caseNumber: "2025-001189", incidentType: "Vehicle Theft", reportedDate: new Date("2025-01-18"), location: "5600 N May Ave", district: "NW", assignedDetective: "5001", status: "Open", priority: "Medium", victimsCount: 1, suspectsIdentified: 0, evidenceItems: 3, lastUpdate: new Date("2025-01-23") },
    { caseNumber: "2025-001067", incidentType: "Assault", reportedDate: new Date("2025-01-15"), location: "Bricktown Entertainment District", district: "Central", assignedDetective: "5002", status: "Closed - Arrest", priority: "High", victimsCount: 2, suspectsIdentified: 1, evidenceItems: 8, lastUpdate: new Date("2025-01-22") },
    { caseNumber: "2025-000982", incidentType: "Armed Robbery", reportedDate: new Date("2025-01-12"), location: "2300 SW 59th St", district: "SW", assignedDetective: "5003", status: "Under Investigation", priority: "High", victimsCount: 1, suspectsIdentified: 2, evidenceItems: 15, lastUpdate: new Date("2025-01-24") },
    { caseNumber: "2025-000845", incidentType: "Vandalism", reportedDate: new Date("2025-01-10"), location: "Oklahoma City Community College", district: "SW", status: "Suspended", priority: "Low", victimsCount: 1, suspectsIdentified: 0, evidenceItems: 5, lastUpdate: new Date("2025-01-18") },
  ];

  private evidence: Evidence[] = [
    { evidenceId: "E-2025-001234-001", caseNumber: "2025-001234", itemType: "Fingerprint", description: "Latent fingerprint from window frame", collectedBy: "CSI-12", collectedDate: new Date("2025-01-20"), location: "3400 N Walker Ave", chainOfCustody: [{ officer: "CSI-12", timestamp: new Date("2025-01-20T10:30:00"), action: "Collected" }, { officer: "5001", timestamp: new Date("2025-01-21T09:00:00"), action: "Transferred to Evidence Room" }], status: "Lab Analysis" },
    { evidenceId: "E-2025-001234-002", caseNumber: "2025-001234", itemType: "Digital", description: "Security camera footage", collectedBy: "CSI-12", collectedDate: new Date("2025-01-20"), location: "3400 N Walker Ave", chainOfCustody: [{ officer: "CSI-12", timestamp: new Date("2025-01-20T11:15:00"), action: "Collected" }, { officer: "5001", timestamp: new Date("2025-01-21T09:00:00"), action: "Reviewed" }], status: "In Storage" },
    { evidenceId: "E-2025-000982-001", caseNumber: "2025-000982", itemType: "Weapon", description: "9mm handgun recovered from scene", collectedBy: "CSI-08", collectedDate: new Date("2025-01-12"), location: "2300 SW 59th St", chainOfCustody: [{ officer: "CSI-08", timestamp: new Date("2025-01-12T14:45:00"), action: "Collected" }, { officer: "5003", timestamp: new Date("2025-01-13T08:30:00"), action: "Transferred to Evidence Room" }, { officer: "LAB-3", timestamp: new Date("2025-01-15T10:00:00"), action: "Ballistics Testing" }], status: "Lab Analysis" },
  ];

  private communityPrograms: CommunityProgram[] = [
    { programId: 1, name: "School Resource Officer Program", type: "School Resource", officer: "6012", participantsThisMonth: 1247, eventsScheduled: 8, satisfactionRating: 4.8, budget: 85000 },
    { programId: 2, name: "Neighborhood Watch Coalition", type: "Neighborhood Watch", officer: "6015", participantsThisMonth: 342, eventsScheduled: 12, satisfactionRating: 4.6, budget: 25000 },
    { programId: 3, name: "Youth Police Academy", type: "Youth Outreach", officer: "6018", participantsThisMonth: 89, eventsScheduled: 4, satisfactionRating: 4.9, budget: 45000 },
    { programId: 4, name: "Business Crime Prevention Partnership", type: "Business Partnership", officer: "6012", participantsThisMonth: 156, eventsScheduled: 6, satisfactionRating: 4.5, budget: 30000 },
    { programId: 5, name: "Senior Safety Initiative", type: "Senior Safety", officer: "6020", participantsThisMonth: 234, eventsScheduled: 10, satisfactionRating: 4.7, budget: 35000 },
  ];

  private nextCallId = 6;

  // Getters
  getCalls(): Call911[] { return [...this.calls]; }
  getOfficers(): Officer[] { return [...this.officers]; }
  getVehicles(): Vehicle[] { return [...this.vehicles]; }
  getCases(): CaseFile[] { return [...this.cases]; }
  getEvidence(): Evidence[] { return [...this.evidence]; }
  getCommunityPrograms(): CommunityProgram[] { return [...this.communityPrograms]; }

  // Add new call
  addCall(call: Omit<Call911, "callId" | "receivedTime" | "status">): Call911 {
    const newCall: Call911 = {
      ...call,
      callId: `911-20250125-${String(this.nextCallId++).padStart(4, '0')}`,
      receivedTime: new Date(),
      status: "Received",
    };
    this.calls.push(newCall);
    return newCall;
  }

  // Update call status
  updateCallStatus(callId: string, status: Call911["status"], timestamp?: Date): void {
    const call = this.calls.find(c => c.callId === callId);
    if (call) {
      call.status = status;
      if (timestamp) {
        if (status === "Dispatched") call.dispatchTime = timestamp;
        else if (status === "On Scene") call.arrivalTime = timestamp;
        else if (status === "Cleared") call.clearedTime = timestamp;
      }
    }
  }

  // Update officer status
  updateOfficerStatus(badgeNumber: string, status: Officer["status"], callId?: string): void {
    const officer = this.officers.find(o => o.badgeNumber === badgeNumber);
    if (officer) {
      officer.status = status;
      officer.currentCall = callId;
    }
  }

  // Statistics
  getCallStats() {
    const totalCalls = this.calls.length;
    const activeCalls = this.calls.filter(c => c.status !== "Cleared" && c.status !== "Cancelled").length;
    const priority1Calls = this.calls.filter(c => c.priority === 1).length;
    const avgResponseTime = this.calls
      .filter(c => c.dispatchTime && c.arrivalTime)
      .reduce((sum, c) => {
        if (c.dispatchTime && c.arrivalTime) {
          return sum + (c.arrivalTime.getTime() - c.dispatchTime.getTime());
        }
        return sum;
      }, 0) / this.calls.filter(c => c.dispatchTime && c.arrivalTime).length;

    return {
      totalCalls,
      activeCalls,
      priority1Calls,
      avgResponseTime: avgResponseTime / 1000 / 60, // Convert to minutes
      callsByDistrict: this.calls.reduce((acc, call) => {
        acc[call.district] = (acc[call.district] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  getOfficerStats() {
    const totalOfficers = this.officers.length;
    const availableOfficers = this.officers.filter(o => o.status === "Available").length;
    const busyOfficers = this.officers.filter(o => o.status === "On Scene" || o.status === "En Route" || o.status === "Busy").length;
    const totalCallsToday = this.officers.reduce((sum, o) => sum + o.callsToday, 0);
    const avgExperience = this.officers.reduce((sum, o) => sum + o.yearsOfService, 0) / totalOfficers;

    return {
      totalOfficers,
      availableOfficers,
      busyOfficers,
      totalCallsToday,
      avgExperience,
    };
  }

  getFleetStats() {
    const totalVehicles = this.vehicles.length;
    const inService = this.vehicles.filter(v => v.status === "In Service").length;
    const available = this.vehicles.filter(v => v.status === "Available").length;
    const maintenance = this.vehicles.filter(v => v.status === "Maintenance" || v.status === "Out of Service").length;
    const avgFuelLevel = this.vehicles.reduce((sum, v) => sum + v.fuelLevel, 0) / totalVehicles;
    const lowFuel = this.vehicles.filter(v => v.fuelLevel < 25).length;

    return {
      totalVehicles,
      inService,
      available,
      maintenance,
      avgFuelLevel,
      lowFuel,
    };
  }

  getCaseStats() {
    const totalCases = this.cases.length;
    const openCases = this.cases.filter(c => c.status === "Open" || c.status === "Under Investigation").length;
    const closedCases = this.cases.filter(c => c.status.startsWith("Closed")).length;
    const clearanceRate = totalCases > 0 ? (closedCases / totalCases) * 100 : 0;
    const highPriority = this.cases.filter(c => c.priority === "High" && (c.status === "Open" || c.status === "Under Investigation")).length;

    return {
      totalCases,
      openCases,
      closedCases,
      clearanceRate,
      highPriority,
      totalEvidence: this.evidence.length,
    };
  }

  getCommunityStats() {
    const totalPrograms = this.communityPrograms.length;
    const totalParticipants = this.communityPrograms.reduce((sum, p) => sum + p.participantsThisMonth, 0);
    const totalEvents = this.communityPrograms.reduce((sum, p) => sum + p.eventsScheduled, 0);
    const avgSatisfaction = this.communityPrograms.reduce((sum, p) => sum + p.satisfactionRating, 0) / totalPrograms;
    const totalBudget = this.communityPrograms.reduce((sum, p) => sum + p.budget, 0);

    return {
      totalPrograms,
      totalParticipants,
      totalEvents,
      avgSatisfaction,
      totalBudget,
    };
  }
}

// ============================================================================
// MAIN CLI APPLICATION
// ============================================================================

class OKCPDCommandCenter {
  private db: OKCPDDatabase;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new OKCPDDatabase();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .namespace("OKCPD")
        .logLevel("info")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .maxHistorySize(2000)
        .build()
    );
  }

  private showBanner() {
    console.clear();
    console.log("");
    BannerRenderer.render({
      title: "🚔 OKLAHOMA CITY POLICE DEPARTMENT",
      subtitle: "Command & Operations Center • Protecting & Serving Since 1889",
      description: "Honor • Integrity • Service • Professionalism",
      version: "CAD System v8.4.2",
      author: "Operations Command Staff",
      width: 110,
      style: "double",
      color: ColorSystem.codes.brightBlue,
    });
    console.log("");

    BoxRenderer.render(
      [
        `🏢 Headquarters: 701 Colcord Drive, Oklahoma City, OK 73102`,
        `📞 Emergency: 911 • Non-Emergency: (405) 231-2121`,
        `🌐 Website: www.okc.gov/departments/police`,
        `👮 Officers on Duty: ${this.db.getOfficers().filter(o => o.status !== "Off Duty").length} • Coverage Area: 621 sq mi`,
        `🎯 Mission: To enhance public safety through community partnerships and professional service`,
      ],
      {
        title: "Department Information",
        style: "rounded",
        color: ColorSystem.codes.blue,
        padding: 1,
      }
    );
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightBlue));
    console.log(ColorSystem.colorize(" COMMAND CENTER DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightBlue));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "🚨 Active Calls Dashboard", value: "calls" },
        { label: "👮 Officer Status & Deployment", value: "officers" },
        { label: "🚗 Fleet & Vehicle Tracking", value: "fleet" },
        { label: "📁 Case Management", value: "cases" },
        { label: "🔬 Evidence Tracking", value: "evidence" },
        { label: "🤝 Community Programs", value: "community" },
        { label: "📊 Analytics & Crime Stats", value: "analytics" },
        { label: "📞 Dispatch New Call", value: "dispatch" },
        { label: "⚡ Response Simulation", value: "simulation" },
        { label: "🚪 Exit", value: "exit" },
      ]
    );
  }

  // ========================================================================
  // ACTIVE CALLS DASHBOARD
  // ========================================================================

  private async viewActiveCalls() {
    this.logger.info("Loading active calls dashboard...");

    const spinner = new Spinner({ message: "Synchronizing CAD system..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Call data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log(ColorSystem.colorize(" ACTIVE 911 CALLS & DISPATCH STATUS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log("");

    const calls = this.db.getCalls();
    const stats = this.db.getCallStats();

    // Current status
    BoxRenderer.render(
      [
        `📞 Total Calls Today: ${ColorSystem.colorize(String(stats.totalCalls), ColorSystem.codes.brightCyan)}`,
        `🚨 Active Calls: ${ColorSystem.colorize(String(stats.activeCalls), ColorSystem.codes.brightRed)}`,
        `⚠️ Priority 1 (Life-Threatening): ${ColorSystem.colorize(String(stats.priority1Calls), ColorSystem.codes.red)}`,
        `⏱️ Avg Response Time: ${ColorSystem.colorize(`${stats.avgResponseTime.toFixed(1)} min`, ColorSystem.codes.yellow)}`,
      ],
      {
        title: "🚨 Call Status Overview",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      }
    );

    console.log("");

    // Active calls table
    const activeCalls = calls.filter(c => c.status !== "Cleared" && c.status !== "Cancelled");

    console.log(ColorSystem.colorize(`📋 Active Calls (${activeCalls.length})`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      activeCalls,
      [
        { key: "callId", label: "Call ID", width: 18 },
        {
          key: "priority",
          label: "Pri",
          width: 5,
          align: "center",
          formatter: (p: number) => {
            const colors = [ColorSystem.codes.brightRed, ColorSystem.codes.red, ColorSystem.codes.yellow, ColorSystem.codes.cyan, ColorSystem.codes.dim];
            return ColorSystem.colorize(String(p), colors[p - 1]);
          }
        },
        { key: "category", label: "Type", width: 12 },
        { key: "location", label: "Location", width: 24 },
        { key: "district", label: "Dist", width: 8, align: "center" },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Received": ColorSystem.codes.dim,
              "Dispatched": ColorSystem.codes.yellow,
              "En Route": ColorSystem.codes.cyan,
              "On Scene": ColorSystem.codes.brightGreen,
              "Cleared": ColorSystem.codes.green,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "dispatchedOfficers",
          label: "Officers",
          width: 15,
          formatter: (officers: string[]) => officers.join(", ")
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Calls by district
    console.log(ColorSystem.colorize("📊 Calls by District:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(stats.callsByDistrict).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightBlue,
      }
    );

    console.log("");
    this.logger.success("Active calls dashboard loaded");
  }

  // ========================================================================
  // OFFICER STATUS & DEPLOYMENT
  // ========================================================================

  private async viewOfficers() {
    this.logger.info("Loading officer deployment status...");

    const spinner = new Spinner({ message: "Accessing personnel database..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Officer data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" OFFICER STATUS & DEPLOYMENT", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log("");

    const officers = this.db.getOfficers();
    const stats = this.db.getOfficerStats();

    // Officer summary
    BoxRenderer.render(
      [
        `👮 Total Officers on Duty: ${ColorSystem.colorize(String(stats.totalOfficers), ColorSystem.codes.brightCyan)}`,
        `✅ Available for Dispatch: ${ColorSystem.colorize(String(stats.availableOfficers), ColorSystem.codes.brightGreen)}`,
        `🚨 Currently Responding: ${ColorSystem.colorize(String(stats.busyOfficers), ColorSystem.codes.yellow)}`,
        `📞 Total Calls Answered Today: ${ColorSystem.colorize(String(stats.totalCallsToday), ColorSystem.codes.cyan)}`,
        `📊 Avg Years of Service: ${ColorSystem.colorize(stats.avgExperience.toFixed(1), ColorSystem.codes.green)} years`,
      ],
      {
        title: "👮 Personnel Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Officer status table
    console.log(ColorSystem.colorize(`📋 Officer Deployment Status`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      officers,
      [
        { key: "badgeNumber", label: "Badge", width: 8 },
        { key: "name", label: "Name", width: 18 },
        { key: "rank", label: "Rank", width: 12 },
        { key: "division", label: "Division", width: 16 },
        { key: "district", label: "District", width: 10, align: "center" },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Available": ColorSystem.codes.brightGreen,
              "En Route": ColorSystem.codes.cyan,
              "On Scene": ColorSystem.codes.yellow,
              "Busy": ColorSystem.codes.red,
              "Out of Service": ColorSystem.codes.dim,
              "Off Duty": ColorSystem.codes.dim,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "callsToday",
          label: "Calls",
          width: 7,
          align: "right"
        },
        {
          key: "yearsOfService",
          label: "YOS",
          width: 6,
          align: "right"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Performance metrics
    console.log(ColorSystem.colorize("📊 Officer Performance Today:", ColorSystem.codes.bright));
    console.log("");

    const topOfficers = officers
      .filter(o => o.callsToday > 0)
      .sort((a, b) => b.callsToday - a.callsToday)
      .slice(0, 5);

    ChartRenderer.barChart(
      topOfficers.map(o => ({ label: o.name.split(' ')[1], value: o.callsToday })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");
    this.logger.success("Officer deployment status displayed");
  }

  // ========================================================================
  // FLEET & VEHICLE TRACKING
  // ========================================================================

  private async viewFleet() {
    this.logger.info("Loading fleet management dashboard...");

    const spinner = new Spinner({ message: "Accessing vehicle tracking system..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Fleet data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" FLEET MANAGEMENT & VEHICLE TRACKING", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log("");

    const vehicles = this.db.getVehicles();
    const stats = this.db.getFleetStats();

    // Fleet summary
    BoxRenderer.render(
      [
        `🚗 Total Fleet Vehicles: ${ColorSystem.colorize(String(stats.totalVehicles), ColorSystem.codes.brightCyan)}`,
        `✅ In Service: ${ColorSystem.colorize(String(stats.inService), ColorSystem.codes.brightGreen)}`,
        `🅿️ Available: ${ColorSystem.colorize(String(stats.available), ColorSystem.codes.cyan)}`,
        `🔧 Maintenance/Repair: ${ColorSystem.colorize(String(stats.maintenance), ColorSystem.codes.red)}`,
        `⛽ Avg Fuel Level: ${ColorSystem.colorize(`${stats.avgFuelLevel.toFixed(1)}%`, ColorSystem.codes.yellow)}`,
        `⚠️ Low Fuel Alerts: ${ColorSystem.colorize(String(stats.lowFuel), stats.lowFuel > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
      ],
      {
        title: "🚗 Fleet Overview",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");

    // Vehicle status table
    console.log(ColorSystem.colorize(`📋 Vehicle Status & Location`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      vehicles,
      [
        { key: "vehicleId", label: "Unit ID", width: 10 },
        { key: "type", label: "Type", width: 14 },
        { key: "assignedOfficer", label: "Officer", width: 8, align: "center", formatter: (o?: string) => o || "-" },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "In Service": ColorSystem.codes.brightGreen,
              "Available": ColorSystem.codes.cyan,
              "Out of Service": ColorSystem.codes.red,
              "Maintenance": ColorSystem.codes.yellow,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "fuelLevel",
          label: "Fuel",
          width: 8,
          align: "right",
          formatter: (fuel: number) => {
            const color = fuel < 25 ? ColorSystem.codes.red : fuel < 50 ? ColorSystem.codes.yellow : ColorSystem.codes.green;
            return ColorSystem.colorize(`${fuel}%`, color);
          }
        },
        {
          key: "mileage",
          label: "Mileage",
          width: 11,
          align: "right",
          formatter: (m: number) => Formatter.number(m)
        },
        { key: "location", label: "Location", width: 24, formatter: (l?: string) => l || "Headquarters" },
      ],
      { showIndex: true }
    );

    console.log("");

    // Fuel status
    console.log(ColorSystem.colorize("⛽ Fuel Status Distribution:", ColorSystem.codes.bright));
    console.log("");

    const fuelBuckets = {
      "Critical (<25%)": vehicles.filter(v => v.fuelLevel < 25).length,
      "Low (25-50%)": vehicles.filter(v => v.fuelLevel >= 25 && v.fuelLevel < 50).length,
      "Good (50-75%)": vehicles.filter(v => v.fuelLevel >= 50 && v.fuelLevel < 75).length,
      "Full (75%+)": vehicles.filter(v => v.fuelLevel >= 75).length,
    };

    ChartRenderer.barChart(
      Object.entries(fuelBuckets).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");

    // Maintenance alerts
    const needsMaintenance = vehicles.filter(v => {
      const daysSince = (Date.now() - v.lastMaintenance.getTime()) / (1000 * 60 * 60 * 24);
      return daysSince > 30 || v.mileage > 50000;
    });

    if (needsMaintenance.length > 0) {
      BoxRenderer.render(
        [
          `⚠️ ${needsMaintenance.length} vehicle(s) require maintenance inspection`,
          ``,
          ...needsMaintenance.map(v => `  • ${v.vehicleId} - ${Formatter.number(v.mileage)} mi, Last service: ${v.lastMaintenance.toLocaleDateString()}`),
        ],
        {
          title: "🔧 Maintenance Alerts",
          style: "rounded",
          color: ColorSystem.codes.red,
          padding: 1,
        }
      );
      console.log("");
    }

    this.logger.success("Fleet management dashboard displayed");
  }

  // ========================================================================
  // CASE MANAGEMENT
  // ========================================================================

  private async viewCases() {
    this.logger.info("Loading case management system...");

    const spinner = new Spinner({ message: "Accessing RMS database..." });
    spinner.start();
    await sleep(1100);
    spinner.succeed("Case files loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" CASE MANAGEMENT SYSTEM", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log("");

    const cases = this.db.getCases();
    const stats = this.db.getCaseStats();

    // Case statistics
    BoxRenderer.render(
      [
        `📁 Total Active Cases: ${ColorSystem.colorize(String(stats.totalCases), ColorSystem.codes.brightCyan)}`,
        `🔍 Under Investigation: ${ColorSystem.colorize(String(stats.openCases), ColorSystem.codes.yellow)}`,
        `✅ Closed/Cleared: ${ColorSystem.colorize(String(stats.closedCases), ColorSystem.codes.green)}`,
        `📊 Clearance Rate: ${ColorSystem.colorize(`${stats.clearanceRate.toFixed(1)}%`, ColorSystem.codes.brightGreen)}`,
        `⚠️ High Priority Open: ${ColorSystem.colorize(String(stats.highPriority), ColorSystem.codes.red)}`,
        `🔬 Evidence Items in Custody: ${ColorSystem.colorize(String(stats.totalEvidence), ColorSystem.codes.cyan)}`,
      ],
      {
        title: "📊 Case Statistics",
        style: "double",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");

    // Case files table
    console.log(ColorSystem.colorize(`📋 Active Case Files`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      cases,
      [
        { key: "caseNumber", label: "Case #", width: 14 },
        { key: "incidentType", label: "Type", width: 20 },
        {
          key: "reportedDate",
          label: "Reported",
          width: 12,
          formatter: (d: Date) => d.toLocaleDateString()
        },
        { key: "district", label: "Dist", width: 8, align: "center" },
        {
          key: "status",
          label: "Status",
          width: 18,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Open": ColorSystem.codes.yellow,
              "Under Investigation": ColorSystem.codes.cyan,
              "Closed - Arrest": ColorSystem.codes.brightGreen,
              "Closed - Cleared": ColorSystem.codes.green,
              "Suspended": ColorSystem.codes.red,
              "Inactive": ColorSystem.codes.dim,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "priority",
          label: "Priority",
          width: 10,
          formatter: (p: string) => {
            const colors: Record<string, string> = {
              "High": ColorSystem.codes.red,
              "Medium": ColorSystem.codes.yellow,
              "Low": ColorSystem.codes.dim,
            };
            return ColorSystem.colorize(p, colors[p]);
          }
        },
        { key: "evidenceItems", label: "Evidence", width: 10, align: "center" },
      ],
      { showIndex: true }
    );

    console.log("");

    // Clearance progress
    console.log(ColorSystem.colorize("📈 Case Clearance Progress:", ColorSystem.codes.bright));
    console.log("");

    const clearanceProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });
    clearanceProgress.update(stats.clearanceRate);
    clearanceProgress.complete();

    console.log("");

    // Case breakdown by type
    const casesByType: Record<string, number> = {};
    cases.forEach(c => {
      casesByType[c.incidentType] = (casesByType[c.incidentType] || 0) + 1;
    });

    console.log(ColorSystem.colorize("📊 Cases by Type:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(casesByType).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightMagenta,
      }
    );

    console.log("");
    this.logger.success("Case management system displayed");
  }

  // ========================================================================
  // EVIDENCE TRACKING
  // ========================================================================

  private async viewEvidence() {
    this.logger.info("Loading evidence tracking system...");

    const spinner = new Spinner({ message: "Accessing evidence database..." });
    spinner.start();
    await sleep(950);
    spinner.succeed("Evidence records loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" EVIDENCE TRACKING & CHAIN OF CUSTODY", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log("");

    const evidence = this.db.getEvidence();
    const stats = this.db.getCaseStats();

    // Evidence summary
    BoxRenderer.render(
      [
        `🔬 Total Evidence Items: ${ColorSystem.colorize(String(evidence.length), ColorSystem.codes.brightCyan)}`,
        `📦 In Storage: ${ColorSystem.colorize(String(evidence.filter(e => e.status === "In Storage").length), ColorSystem.codes.green)}`,
        `🧪 Lab Analysis: ${ColorSystem.colorize(String(evidence.filter(e => e.status === "Lab Analysis").length), ColorSystem.codes.yellow)}`,
        `⚖️ In Court: ${ColorSystem.colorize(String(evidence.filter(e => e.status === "Court").length), ColorSystem.codes.cyan)}`,
        `✅ Chain of Custody Integrity: ${ColorSystem.colorize("100%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🔬 Evidence Overview",
        style: "double",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );

    console.log("");

    // Evidence table
    console.log(ColorSystem.colorize(`📋 Evidence Inventory`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      evidence,
      [
        { key: "evidenceId", label: "Evidence ID", width: 22 },
        { key: "caseNumber", label: "Case #", width: 14 },
        { key: "itemType", label: "Type", width: 12 },
        { key: "description", label: "Description", width: 28 },
        {
          key: "collectedDate",
          label: "Collected",
          width: 12,
          formatter: (d: Date) => d.toLocaleDateString()
        },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Collected": ColorSystem.codes.dim,
              "In Storage": ColorSystem.codes.green,
              "Lab Analysis": ColorSystem.codes.yellow,
              "Court": ColorSystem.codes.cyan,
              "Released": ColorSystem.codes.magenta,
              "Destroyed": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Chain of custody detail for first item
    if (evidence.length > 0) {
      const item = evidence[0];
      console.log(ColorSystem.colorize(`🔗 Chain of Custody Detail - ${item.evidenceId}`, ColorSystem.codes.bright));
      console.log("");

      TableRenderer.render(
        item.chainOfCustody,
        [
          { key: "officer", label: "Officer/Personnel", width: 20 },
          {
            key: "timestamp",
            label: "Date/Time",
            width: 22,
            formatter: (d: Date) => d.toLocaleString()
          },
          { key: "action", label: "Action", width: 30 },
        ],
        { showIndex: true }
      );

      console.log("");
    }

    // Evidence by status
    const evidenceByStatus: Record<string, number> = {};
    evidence.forEach(e => {
      evidenceByStatus[e.status] = (evidenceByStatus[e.status] || 0) + 1;
    });

    console.log(ColorSystem.colorize("📊 Evidence Status Distribution:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(evidenceByStatus).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightCyan,
      }
    );

    console.log("");
    this.logger.success("Evidence tracking system displayed");
  }

  // ========================================================================
  // COMMUNITY PROGRAMS
  // ========================================================================

  private async viewCommunity() {
    this.logger.info("Loading community programs dashboard...");

    const spinner = new Spinner({ message: "Accessing community relations database..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Program data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" COMMUNITY POLICING & OUTREACH PROGRAMS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log("");

    const programs = this.db.getCommunityPrograms();
    const stats = this.db.getCommunityStats();

    // Community summary
    BoxRenderer.render(
      [
        `🤝 Active Programs: ${ColorSystem.colorize(String(stats.totalPrograms), ColorSystem.codes.brightCyan)}`,
        `👥 Participants This Month: ${ColorSystem.colorize(Formatter.number(stats.totalParticipants), ColorSystem.codes.green)}`,
        `📅 Events Scheduled: ${ColorSystem.colorize(String(stats.totalEvents), ColorSystem.codes.yellow)}`,
        `⭐ Avg Satisfaction Rating: ${ColorSystem.colorize(`${stats.avgSatisfaction.toFixed(1)}/5.0`, ColorSystem.codes.brightGreen)}`,
        `💰 Total Program Budget: ${ColorSystem.colorize(Formatter.currency(stats.totalBudget), ColorSystem.codes.cyan)}`,
      ],
      {
        title: "🤝 Community Engagement Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Programs table
    console.log(ColorSystem.colorize(`📋 Active Community Programs`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      programs,
      [
        { key: "name", label: "Program Name", width: 32 },
        { key: "type", label: "Type", width: 20 },
        { key: "officer", label: "Lead Officer", width: 18 },
        {
          key: "participantsThisMonth",
          label: "Participants",
          width: 13,
          align: "right",
          formatter: (n: number) => Formatter.number(n)
        },
        { key: "eventsScheduled", label: "Events", width: 8, align: "center" },
        {
          key: "satisfactionRating",
          label: "Rating",
          width: 8,
          align: "center",
          formatter: (r: number) => ColorSystem.colorize(`${r.toFixed(1)}★`, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Participation metrics
    console.log(ColorSystem.colorize("📊 Monthly Participation by Program:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      programs.map(p => ({ label: p.name.slice(0, 20), value: p.participantsThisMonth })),
      {
        showValues: true,
        width: 50,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    // Community impact
    BoxRenderer.render(
      [
        `👨‍👩‍👧 Youth Engagement: ${ColorSystem.colorize("1,336", ColorSystem.codes.brightCyan)} young people reached`,
        `🏘️ Neighborhood Watch Groups: ${ColorSystem.colorize("47", ColorSystem.codes.yellow)} active groups`,
        `🎓 School Partnerships: ${ColorSystem.colorize("89", ColorSystem.codes.green)} schools served`,
        `👴 Senior Safety Workshops: ${ColorSystem.colorize("234", ColorSystem.codes.magenta)} seniors trained`,
        `🏢 Business Partnerships: ${ColorSystem.colorize("156", ColorSystem.codes.cyan)} local businesses`,
        `📈 Crime Reduction in Partnership Areas: ${ColorSystem.colorize("↓ 23%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🌟 Community Impact Metrics",
        style: "rounded",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Community programs dashboard displayed");
  }

  // ========================================================================
  // ANALYTICS & CRIME STATS
  // ========================================================================

  private async viewAnalytics() {
    this.logger.info("Generating analytics and crime statistics...");

    const spinner = new Spinner({ message: "Analyzing data across all systems..." });
    spinner.start();
    await sleep(1500);
    spinner.succeed("Analytics ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" CRIME ANALYTICS & PERFORMANCE METRICS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log("");

    const callStats = this.db.getCallStats();
    const officerStats = this.db.getOfficerStats();
    const caseStats = this.db.getCaseStats();
    const communityStats = this.db.getCommunityStats();

    // Key metrics
    BoxRenderer.render(
      [
        `📞 Total 911 Calls Processed: ${ColorSystem.colorize(Formatter.number(callStats.totalCalls), ColorSystem.codes.brightCyan)}`,
        `⏱️ Avg Response Time: ${ColorSystem.colorize(`${callStats.avgResponseTime.toFixed(1)} min`, ColorSystem.codes.yellow)}`,
        `📊 Case Clearance Rate: ${ColorSystem.colorize(`${caseStats.clearanceRate.toFixed(1)}%`, ColorSystem.codes.green)}`,
        `👮 Officer Utilization: ${ColorSystem.colorize(`${((officerStats.busyOfficers / officerStats.totalOfficers) * 100).toFixed(1)}%`, ColorSystem.codes.cyan)}`,
        `🤝 Community Engagement: ${ColorSystem.colorize(Formatter.number(communityStats.totalParticipants), ColorSystem.codes.magenta)} participants`,
      ],
      {
        title: "📊 Key Performance Indicators",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");

    // Monthly crime trend (simulated)
    console.log(ColorSystem.colorize("📈 Monthly Crime Trend:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Week 1", value: 87 },
        { label: "Week 2", value: 79 },
        { label: "Week 3", value: 68 },
        { label: "Week 4", value: 62 },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");
    console.log(ColorSystem.colorize(`  📉 Crime Rate Trend: ${ColorSystem.colorize("↓ 28.7%", ColorSystem.codes.brightGreen)} reduction this month`, ColorSystem.codes.dim));
    console.log("");

    // Response time goals
    console.log(ColorSystem.colorize("🎯 Response Time Performance:", ColorSystem.codes.bright));
    console.log("");

    const responseGoals = [
      { priority: "Priority 1 (Emergency)", goal: 5, actual: callStats.avgResponseTime * 0.7 },
      { priority: "Priority 2 (Urgent)", goal: 10, actual: callStats.avgResponseTime },
      { priority: "Priority 3 (Routine)", goal: 15, actual: callStats.avgResponseTime * 1.3 },
    ];

    responseGoals.forEach(rg => {
      console.log(ColorSystem.colorize(`  ${rg.priority}:`, ColorSystem.codes.dim));
      const responseBar = new ProgressBar({
        total: rg.goal,
        width: 50,
        showValue: false,
        showPercentage: false,
        colorize: true,
      });
      responseBar.update(rg.actual);
      responseBar.complete();
      const status = rg.actual <= rg.goal ? "✅ Meeting Goal" : "⚠️ Below Target";
      const statusColor = rg.actual <= rg.goal ? ColorSystem.codes.brightGreen : ColorSystem.codes.red;
      console.log(ColorSystem.colorize(`    Actual: ${rg.actual.toFixed(1)} min • Goal: ${rg.goal} min • ${ColorSystem.colorize(status, statusColor)}`, ColorSystem.codes.dim));
      console.log("");
    });

    // Operational improvements
    console.log(ColorSystem.colorize("🚀 Operational Improvements with GenesisTrace:", ColorSystem.codes.bright));
    console.log("");

    const improvements = [
      { metric: "911 Call Processing Speed", improvement: 45 },
      { metric: "Officer Dispatch Efficiency", improvement: 62 },
      { metric: "Case Clearance Rate", improvement: 34 },
      { metric: "Evidence Chain Integrity", improvement: 100 },
      { metric: "Community Engagement", improvement: 78 },
      { metric: "Real-Time Situational Awareness", improvement: 96 },
    ];

    improvements.forEach(imp => {
      console.log(ColorSystem.colorize(`  ${imp.metric}:`, ColorSystem.codes.dim));
      const impBar = new ProgressBar({
        total: 100,
        width: 50,
        showValue: false,
        showPercentage: false,
        colorize: true,
      });
      impBar.update(imp.improvement);
      impBar.complete();
      console.log(ColorSystem.colorize(`    ${ColorSystem.colorize(`↑ ${imp.improvement}%`, ColorSystem.codes.brightGreen)} improvement`, ColorSystem.codes.dim));
      console.log("");
    });

    // Public safety impact
    BoxRenderer.render(
      [
        `🚨 Emergency Response Improvement: ${ColorSystem.colorize("↑ 45%", ColorSystem.codes.brightGreen)} faster deployment`,
        `🔍 Case Closure Success: ${ColorSystem.colorize("↑ 34%", ColorSystem.codes.green)} more cases solved`,
        `👮 Officer Safety: ${ColorSystem.colorize("↑ 67%", ColorSystem.codes.cyan)} better situational awareness`,
        `🤝 Community Trust: ${ColorSystem.colorize("↑ 28%", ColorSystem.codes.magenta)} satisfaction increase`,
        `📊 Data-Driven Decisions: ${ColorSystem.colorize("100%", ColorSystem.codes.brightCyan)} real-time visibility`,
      ],
      {
        title: "🌟 Public Safety Impact",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Analytics report generated successfully");
  }

  // ========================================================================
  // DISPATCH NEW CALL
  // ========================================================================

  private async dispatchNewCall() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log(ColorSystem.colorize(" 911 DISPATCH - NEW CALL INTAKE", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log("");

    this.logger.info("Initiating new 911 call intake...");

    try {
      // Get call details
      const caller = await InteractivePrompts.input("Caller Name (or Anonymous):");
      const location = await InteractivePrompts.input("Incident Location:");
      const district = await InteractivePrompts.select(
        "District:",
        [
          { label: "NW", value: "NW" },
          { label: "NE", value: "NE" },
          { label: "SW", value: "SW" },
          { label: "SE", value: "SE" },
          { label: "Central", value: "Central" },
          { label: "Lake Patrol", value: "Lake Patrol" },
        ]
      );
      const category = await InteractivePrompts.select(
        "Call Category:",
        [
          { label: "Assault", value: "Assault" },
          { label: "Burglary", value: "Burglary" },
          { label: "Traffic", value: "Traffic" },
          { label: "Domestic", value: "Domestic" },
          { label: "Theft", value: "Theft" },
          { label: "Suspicious", value: "Suspicious" },
          { label: "Medical", value: "Medical" },
          { label: "Fire", value: "Fire" },
          { label: "Other", value: "Other" },
        ]
      );
      const priority = await InteractivePrompts.select(
        "Priority Level:",
        [
          { label: "1 - Life-Threatening Emergency", value: "1" },
          { label: "2 - Urgent (Crime in Progress)", value: "2" },
          { label: "3 - Routine Response", value: "3" },
          { label: "4 - Low Priority", value: "4" },
          { label: "5 - Administrative", value: "5" },
        ]
      ) as unknown as "1" | "2" | "3" | "4" | "5";
      const description = await InteractivePrompts.input("Call Description:");

      // Find available officers in district
      const availableOfficers = this.db.getOfficers()
        .filter(o => o.district === district && o.status === "Available");

      if (availableOfficers.length === 0) {
        this.logger.warning(`No available officers in ${district} district. Cross-dispatching from adjacent districts.`);
      }

      // Create call
      const spinner = new Spinner({ message: "Processing call intake..." });
      spinner.start();
      await sleep(800);
      spinner.update("Determining response priority...");
      await sleep(600);
      spinner.update("Dispatching units...");
      await sleep(900);
      spinner.succeed("Call dispatched successfully!");

      const newCall = this.db.addCall({
        callType: parseInt(priority) <= 2 ? "Emergency" : "Non-Emergency",
        priority: parseInt(priority) as 1 | 2 | 3 | 4 | 5,
        category: category as Call911["category"],
        location,
        district: district as Call911["district"],
        caller,
        description,
        dispatchedOfficers: availableOfficers.slice(0, parseInt(priority) === 1 ? 2 : 1).map(o => o.badgeNumber),
      });

      // Update officers
      const dispatchedOfficers = availableOfficers.slice(0, parseInt(priority) === 1 ? 2 : 1);
      dispatchedOfficers.forEach(officer => {
        this.db.updateOfficerStatus(officer.badgeNumber, "En Route", newCall.callId);
      });

      this.db.updateCallStatus(newCall.callId, "Dispatched", new Date());

      console.log("");
      BoxRenderer.render(
        [
          `🚨 Call Successfully Dispatched`,
          ``,
          `📞 Call ID: ${ColorSystem.colorize(newCall.callId, ColorSystem.codes.brightCyan)}`,
          `📍 Location: ${location}`,
          `🏘️ District: ${district}`,
          `⚠️ Priority: ${ColorSystem.colorize(`Level ${priority}`, priority === "1" || priority === "2" ? ColorSystem.codes.red : ColorSystem.codes.yellow)}`,
          `📋 Category: ${category}`,
          ``,
          `👮 Dispatched Officers:`,
          ...dispatchedOfficers.map(o => `  • Badge ${o.badgeNumber} - ${o.name} (${o.rank})`),
          ``,
          `⏰ Call Received: ${new Date().toLocaleTimeString()}`,
          `🚔 Units Responding: ${dispatchedOfficers.length}`,
          ``,
          `Status: ${ColorSystem.colorize("EN ROUTE", ColorSystem.codes.brightYellow)}`,
        ],
        {
          title: "✅ Dispatch Confirmation",
          style: "double",
          color: ColorSystem.codes.brightGreen,
          padding: 1,
        }
      );
      console.log("");

      this.logger.success(`Call ${newCall.callId} dispatched to ${dispatchedOfficers.length} officer(s)`);
    } catch (error) {
      this.logger.error("Error during call dispatch", { error });
    }
  }

  // ========================================================================
  // RESPONSE SIMULATION
  // ========================================================================

  private async runResponseSimulation() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log(ColorSystem.colorize(" EMERGENCY RESPONSE SIMULATION - PRIORITY 1 CALL", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightRed));
    console.log("");

    this.logger.info("Starting emergency response simulation...");
    console.log("");

    // Stage 1: Call Intake
    console.log(ColorSystem.colorize("📞 Stage 1: 911 Call Received", ColorSystem.codes.brightRed));
    const callSpinner = new Spinner({
      message: "Caller reporting armed robbery in progress...",
      frames: ["🚨", "⚠️", "🚨", "⚠️"],
      interval: 200
    });
    callSpinner.start();
    await sleep(1200);
    callSpinner.update("Call taker gathering location and suspect details...");
    await sleep(1000);
    callSpinner.update("Priority 1 classification confirmed...");
    await sleep(800);
    callSpinner.succeed("Call intake complete - PRIORITY 1 EMERGENCY");
    console.log("");

    BoxRenderer.render(
      [
        `📞 Call Type: ${ColorSystem.colorize("ARMED ROBBERY IN PROGRESS", ColorSystem.codes.brightRed)}`,
        `📍 Location: 5400 N Classen Blvd (QuikTrip)`,
        `⚠️ Priority: ${ColorSystem.colorize("1 - LIFE THREATENING", ColorSystem.codes.red)}`,
        `🏘️ District: Central`,
        `👤 Caller: Store Employee (hiding in back office)`,
        `🔫 Suspects: 2 armed males, handguns visible`,
      ],
      {
        title: "🚨 PRIORITY 1 CALL DETAILS",
        style: "double",
        color: ColorSystem.codes.brightRed,
        padding: 1,
      }
    );
    console.log("");

    // Stage 2: Dispatch
    console.log(ColorSystem.colorize("🚔 Stage 2: Unit Dispatch", ColorSystem.codes.brightYellow));
    const dispatchProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Locating nearest available units...");
    for (let i = 0; i <= 30; i += 5) {
      dispatchProgress.update(i);
      await sleep(80);
    }
    this.logger.info("Dispatching Unit 1045 (2.1 mi away - ETA 4 min)...");
    for (let i = 30; i <= 60; i += 5) {
      dispatchProgress.update(i);
      await sleep(80);
    }
    this.logger.info("Dispatching Unit 1046 (2.8 mi away - ETA 5 min)...");
    for (let i = 60; i <= 85; i += 5) {
      dispatchProgress.update(i);
      await sleep(80);
    }
    this.logger.info("Requesting K-9 backup (Unit 7001)...");
    for (let i = 85; i <= 100; i += 5) {
      dispatchProgress.update(i);
      await sleep(80);
    }
    dispatchProgress.complete();
    this.logger.success("3 units dispatched - Total response time: 45 seconds");
    console.log("");

    // Stage 3: Response
    console.log(ColorSystem.colorize("🚨 Stage 3: Units Responding", ColorSystem.codes.brightCyan));
    const responseSpinner = new Spinner({
      message: "Units en route with lights and sirens...",
      frames: ["🚔", "🚨", "🚔", "🚨"],
      interval: 150
    });
    responseSpinner.start();
    await sleep(1200);
    responseSpinner.update("Unit 1045 arriving on scene...");
    await sleep(1000);
    responseSpinner.update("Establishing perimeter...");
    await sleep(900);
    responseSpinner.update("Unit 1046 on scene - covering rear exit...");
    await sleep(800);
    responseSpinner.succeed("All units on scene - perimeter secured");
    console.log("");

    // Stage 4: Resolution
    console.log(ColorSystem.colorize("✅ Stage 4: Incident Resolution", ColorSystem.codes.brightGreen));
    const resolutionSpinner = new Spinner({
      message: "Officers entering building...",
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 90
    });
    resolutionSpinner.start();
    await sleep(1500);
    resolutionSpinner.update("Suspects located - commands given...");
    await sleep(1200);
    resolutionSpinner.update("Suspects taken into custody without incident...");
    await sleep(1000);
    resolutionSpinner.update("Scene secured - searching for additional suspects...");
    await sleep(800);
    resolutionSpinner.succeed("INCIDENT RESOLVED - 2 suspects in custody, no injuries");
    console.log("");

    // Summary
    console.log(ColorSystem.colorize("📊 Response Summary:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { phase: "Call Intake", duration: "0:45", status: "Complete" },
        { phase: "Unit Dispatch", duration: "0:45", status: "Complete" },
        { phase: "Response Time", duration: "4:12", status: "Complete" },
        { phase: "On Scene Resolution", duration: "6:30", status: "Complete" },
        { phase: "Total Incident Time", duration: "12:12", status: "Complete" },
      ],
      [
        { key: "phase", label: "Phase", width: 28 },
        { key: "duration", label: "Duration", width: 15, align: "right" },
        {
          key: "status",
          label: "Status",
          width: 15,
          formatter: (status: string) => ColorSystem.colorize(status, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Suspects Apprehended: ${ColorSystem.colorize("2", ColorSystem.codes.brightGreen)} (100% clearance)`,
        `👮 Officers Responded: ${ColorSystem.colorize("3", ColorSystem.codes.cyan)} units`,
        `⏱️ Response Time: ${ColorSystem.colorize("4:12", ColorSystem.codes.yellow)} (Target: <5:00) ${ColorSystem.colorize("✓ PASS", ColorSystem.codes.brightGreen)}`,
        `🏥 Injuries: ${ColorSystem.colorize("0", ColorSystem.codes.green)} (officers and civilians)`,
        `🔫 Weapons Recovered: ${ColorSystem.colorize("2", ColorSystem.codes.magenta)} handguns`,
        `💰 Property Recovered: ${ColorSystem.colorize("$847", ColorSystem.codes.cyan)} cash`,
        `📸 Evidence Collected: ${ColorSystem.colorize("12", ColorSystem.codes.yellow)} items`,
        `📝 Charges Filed: ${ColorSystem.colorize("Armed Robbery, Assault", ColorSystem.codes.red)}`,
        ``,
        `⭐ Outcome: ${ColorSystem.colorize("EXEMPLARY RESPONSE", ColorSystem.codes.brightGreen)}`,
        `🏆 Performance Rating: ${ColorSystem.colorize("A+", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "📊 Incident Metrics",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Emergency response simulation completed successfully");
  }

  // ========================================================================
  // MAIN RUN LOOP
  // ========================================================================

  async run() {
    this.showBanner();

    this.logger.info("OKCPD Command Center initialized");
    this.logger.info(`Current time: ${new Date().toLocaleString()}`);
    this.logger.info("All systems operational");
    console.log("");

    while (this.running) {
      try {
        const choice = await this.showMainMenu();
        console.log("");

        switch (choice) {
          case "calls":
            await this.viewActiveCalls();
            break;
          case "officers":
            await this.viewOfficers();
            break;
          case "fleet":
            await this.viewFleet();
            break;
          case "cases":
            await this.viewCases();
            break;
          case "evidence":
            await this.viewEvidence();
            break;
          case "community":
            await this.viewCommunity();
            break;
          case "analytics":
            await this.viewAnalytics();
            break;
          case "dispatch":
            await this.dispatchNewCall();
            break;
          case "simulation":
            await this.runResponseSimulation();
            break;
          case "exit":
            this.running = false;
            console.log("");
            this.logger.info("Shutting down Command Center...");
            console.log("");
            BoxRenderer.render(
              [
                "Thank you for using the OKCPD Command & Operations Center!",
                "",
                "🚔 Protecting and Serving Oklahoma City",
                "",
                "Oklahoma City Police Department",
                "701 Colcord Drive, Oklahoma City, OK 73102",
                "Emergency: 911 • Non-Emergency: (405) 231-2121",
                "",
                "Honor • Integrity • Service • Professionalism",
                "",
                "Stay Safe, OKC! 👮‍♀️👮‍♂️",
              ],
              {
                title: "👋 End of Watch",
                style: "double",
                color: ColorSystem.codes.brightBlue,
                padding: 1,
              }
            );
            console.log("");
            return;
        }

        console.log("");
        console.log(ColorSystem.colorize("─".repeat(105), ColorSystem.codes.dim));
        await InteractivePrompts.confirm("Press Enter to continue...");
        this.showBanner();
      } catch (error) {
        if (error instanceof Deno.errors.Interrupted) {
          this.running = false;
          console.log("");
          this.logger.info("Command Center interrupted by user");
          return;
        }
        this.logger.error("An error occurred", { error });
        await sleep(2000);
      }
    }
  }
}

// ============================================================================
// ENTRY POINT
// ============================================================================

if (import.meta.main) {
  const commandCenter = new OKCPDCommandCenter();
  await commandCenter.run();
}
