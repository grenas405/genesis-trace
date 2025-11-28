#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Stephenson Cancer Center - Clinical Operations & Patient Care Center
 * Oklahoma City, Oklahoma
 *
 * A comprehensive demonstration of GenesisTrace capabilities for oncology
 * clinical operations, treatment coordination, and patient care management.
 *
 * This animation lab showcases:
 *   • Patient treatment journey visualization and milestone tracking
 *   • Radiation therapy planning and delivery monitoring
 *   • Chemotherapy infusion scheduling and administration
 *   • Clinical trial enrollment and protocol management
 *   • Multidisciplinary care team coordination
 *   • Treatment response tracking and outcome analytics
 *   • Patient support services and wellness programs
 *   • Research data collection and analysis
 *   • Medical equipment utilization and scheduling
 *   • Quality metrics and accreditation compliance
 *
 * Features demonstrated:
 *   • Logger with themed configuration for healthcare
 *   • Animated progress bars for treatment sessions
 *   • Spinners for lab results and imaging processing
 *   • Tables for patient schedules and care plans
 *   • Charts for treatment outcomes and research metrics
 *   • Interactive prompts for patient intake workflows
 *   • Color-coded status indicators for clinical priorities
 *   • Real-time dashboard updates for care coordination
 *
 * Medical Context:
 *   The Stephenson Cancer Center is Oklahoma's only National Cancer Institute
 *   (NCI)-designated cancer center, providing comprehensive cancer care,
 *   leading-edge research, and innovative clinical trials. Part of OU Health,
 *   the center serves patients across Oklahoma and the region with advanced
 *   treatment options and multidisciplinary care teams.
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

interface Patient {
  mrn: string; // Medical Record Number
  initials: string; // For privacy (e.g., "J.S.")
  age: number;
  diagnosisCode: string;
  cancerType: string;
  stage: string;
  treatmentPlan: string;
  oncologist: string;
  enrollmentDate: Date;
  nextAppt: Date;
  status: "Active Treatment" | "Monitoring" | "Remission" | "Clinical Trial" | "Palliative Care";
  careTeamSize: number;
}

interface TreatmentSession {
  sessionId: string;
  patientMRN: string;
  treatmentType: "Radiation" | "Chemotherapy" | "Immunotherapy" | "Surgery" | "Clinical Trial";
  scheduledTime: Date;
  duration: number; // minutes
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled" | "Delayed";
  room: string;
  providedBy: string;
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    oxygenSat: number;
  };
  sideEffects?: string[];
}

interface ClinicalTrial {
  trialId: string;
  name: string;
  phase: "Phase I" | "Phase II" | "Phase III" | "Phase IV";
  cancerType: string;
  principalInvestigator: string;
  enrolledPatients: number;
  targetEnrollment: number;
  status: "Recruiting" | "Active" | "Completed" | "Suspended";
  startDate: Date;
  sponsor: string;
}

interface CareTeamMember {
  employeeId: string;
  name: string;
  role: "Medical Oncologist" | "Radiation Oncologist" | "Surgeon" | "Nurse Navigator" |
        "Radiation Therapist" | "Pharmacist" | "Social Worker" | "Dietitian" | "Research Coordinator";
  specialty: string;
  patientsToday: number;
  availability: "Available" | "In Session" | "Lunch" | "Meeting" | "Off Duty";
  certifications: string[];
}

interface LabResult {
  labId: string;
  patientMRN: string;
  testType: "CBC" | "Metabolic Panel" | "Tumor Markers" | "Pathology" | "Genetic Testing";
  orderedDate: Date;
  status: "Pending" | "In Progress" | "Completed" | "Abnormal - Urgent";
  results?: Record<string, string>;
  orderedBy: string;
  criticalFlag: boolean;
}

interface ImagingStudy {
  studyId: string;
  patientMRN: string;
  modality: "CT" | "MRI" | "PET Scan" | "X-Ray" | "Ultrasound";
  bodyPart: string;
  scheduledTime: Date;
  status: "Scheduled" | "In Progress" | "Reading" | "Complete" | "Critical Finding";
  radiologist?: string;
  findings?: string;
}

interface SupportService {
  serviceId: number;
  serviceName: string;
  type: "Support Group" | "Nutrition Counseling" | "Financial Assistance" |
        "Transportation" | "Integrative Medicine" | "Survivorship Program";
  schedule: string;
  facilitator: string;
  enrolledPatients: number;
  capacity: number;
  satisfactionScore: number;
}

interface ResearchMetric {
  metric: string;
  category: "Clinical Outcomes" | "Patient Safety" | "Research Productivity" | "Quality Metrics";
  value: number;
  target: number;
  trend: "improving" | "stable" | "declining";
}

// ============================================================================
// DATABASE
// ============================================================================

class StephensonCancerCenterDB {
  private patients: Patient[] = [
    { mrn: "MRN-2025-001234", initials: "J.S.", age: 58, diagnosisCode: "C50.9", cancerType: "Breast Cancer", stage: "Stage II", treatmentPlan: "AC-T Protocol", oncologist: "Dr. Sarah Chen", enrollmentDate: new Date("2025-01-15"), nextAppt: new Date("2025-01-28"), status: "Active Treatment", careTeamSize: 6 },
    { mrn: "MRN-2025-001189", initials: "M.P.", age: 62, diagnosisCode: "C61", cancerType: "Prostate Cancer", stage: "Stage III", treatmentPlan: "IMRT + Hormone Therapy", oncologist: "Dr. Michael Rodriguez", enrollmentDate: new Date("2025-01-10"), nextAppt: new Date("2025-01-27"), status: "Active Treatment", careTeamSize: 5 },
    { mrn: "MRN-2025-001067", initials: "E.R.", age: 45, diagnosisCode: "C34.9", cancerType: "Lung Cancer", stage: "Stage IV", treatmentPlan: "Pembrolizumab", oncologist: "Dr. Jennifer Williams", enrollmentDate: new Date("2024-12-20"), nextAppt: new Date("2025-01-29"), status: "Clinical Trial", careTeamSize: 8 },
    { mrn: "MRN-2024-008934", initials: "T.K.", age: 67, diagnosisCode: "C18.9", cancerType: "Colorectal Cancer", stage: "Stage I", treatmentPlan: "Surveillance", oncologist: "Dr. Robert Thompson", enrollmentDate: new Date("2024-08-15"), nextAppt: new Date("2025-02-15"), status: "Monitoring", careTeamSize: 3 },
    { mrn: "MRN-2024-007821", initials: "A.M.", age: 71, diagnosisCode: "C25.9", cancerType: "Pancreatic Cancer", stage: "Stage III", treatmentPlan: "FOLFIRINOX", oncologist: "Dr. Sarah Chen", enrollmentDate: new Date("2024-11-05"), nextAppt: new Date("2025-01-30"), status: "Active Treatment", careTeamSize: 7 },
    { mrn: "MRN-2023-004562", initials: "L.H.", age: 52, diagnosisCode: "C50.9", cancerType: "Breast Cancer", stage: "Stage I", treatmentPlan: "Completed", oncologist: "Dr. Jennifer Williams", enrollmentDate: new Date("2023-06-10"), nextAppt: new Date("2025-06-10"), status: "Remission", careTeamSize: 2 },
  ];

  private treatmentSessions: TreatmentSession[] = [
    { sessionId: "RT-20250125-001", patientMRN: "MRN-2025-001189", treatmentType: "Radiation", scheduledTime: new Date("2025-01-25T09:00:00"), duration: 15, status: "In Progress", room: "Linear Accelerator 1", providedBy: "RT-Team A", vitalSigns: { bloodPressure: "128/82", heartRate: 72, temperature: 98.4, oxygenSat: 98 } },
    { sessionId: "CHEMO-20250125-002", patientMRN: "MRN-2025-001234", treatmentType: "Chemotherapy", scheduledTime: new Date("2025-01-25T10:30:00"), duration: 120, status: "Scheduled", room: "Infusion Bay 3", providedBy: "Nurse J. Martinez" },
    { sessionId: "IMMUNO-20250125-003", patientMRN: "MRN-2025-001067", treatmentType: "Immunotherapy", scheduledTime: new Date("2025-01-25T13:00:00"), duration: 90, status: "Scheduled", room: "Infusion Bay 5", providedBy: "Nurse K. Johnson" },
    { sessionId: "CHEMO-20250125-004", patientMRN: "MRN-2024-007821", treatmentType: "Chemotherapy", scheduledTime: new Date("2025-01-25T14:00:00"), duration: 150, status: "Scheduled", room: "Infusion Bay 2", providedBy: "Nurse M. Davis", sideEffects: ["Nausea - mild", "Fatigue"] },
    { sessionId: "RT-20250125-005", patientMRN: "MRN-2025-001189", treatmentType: "Radiation", scheduledTime: new Date("2025-01-25T15:30:00"), duration: 15, status: "Scheduled", room: "Linear Accelerator 2", providedBy: "RT-Team B" },
  ];

  private clinicalTrials: ClinicalTrial[] = [
    { trialId: "NCT-2025-0012", name: "CAR-T Cell Therapy for Advanced Lymphoma", phase: "Phase II", cancerType: "Lymphoma", principalInvestigator: "Dr. Jennifer Williams", enrolledPatients: 8, targetEnrollment: 25, status: "Recruiting", startDate: new Date("2024-09-01"), sponsor: "NCI" },
    { trialId: "NCT-2024-0487", name: "Immunotherapy Combination Study - Melanoma", phase: "Phase III", cancerType: "Melanoma", principalInvestigator: "Dr. Michael Rodriguez", enrolledPatients: 34, targetEnrollment: 50, status: "Active", startDate: new Date("2023-11-15"), sponsor: "Bristol Myers Squibb" },
    { trialId: "NCT-2025-0023", name: "Precision Medicine for Lung Cancer", phase: "Phase I", cancerType: "Lung Cancer", principalInvestigator: "Dr. Sarah Chen", enrolledPatients: 3, targetEnrollment: 15, status: "Recruiting", startDate: new Date("2025-01-10"), sponsor: "OU Health Research" },
  ];

  private careTeam: CareTeamMember[] = [
    { employeeId: "ONC-001", name: "Dr. Sarah Chen", role: "Medical Oncologist", specialty: "Breast & GI Oncology", patientsToday: 12, availability: "In Session", certifications: ["Board Certified - Medical Oncology", "ASCO Member"] },
    { employeeId: "ONC-002", name: "Dr. Michael Rodriguez", role: "Radiation Oncologist", specialty: "Prostate & GU Cancers", patientsToday: 8, availability: "Available", certifications: ["Board Certified - Radiation Oncology", "ASTRO Fellow"] },
    { employeeId: "ONC-003", name: "Dr. Jennifer Williams", role: "Medical Oncologist", specialty: "Thoracic Oncology", patientsToday: 10, availability: "In Session", certifications: ["Board Certified - Medical Oncology", "Clinical Trials Certified"] },
    { employeeId: "NAV-001", name: "Lisa Anderson", role: "Nurse Navigator", specialty: "Breast Cancer Navigation", patientsToday: 15, availability: "Available", certifications: ["OCN Certified", "Patient Navigation Certified"] },
    { employeeId: "RT-001", name: "James Foster", role: "Radiation Therapist", specialty: "IMRT/IGRT", patientsToday: 20, availability: "In Session", certifications: ["ARRT Certified", "Dosimetry Specialist"] },
    { employeeId: "PHARM-001", name: "Patricia Hayes", role: "Pharmacist", specialty: "Oncology Pharmacy", patientsToday: 18, availability: "Available", certifications: ["BCOP Certified", "Chemotherapy Administration"] },
    { employeeId: "SW-001", name: "Marcus Johnson", role: "Social Worker", specialty: "Oncology Social Work", patientsToday: 9, availability: "Meeting", certifications: ["LCSW", "OSW-C Certified"] },
    { employeeId: "RD-001", name: "Amanda Foster", role: "Dietitian", specialty: "Oncology Nutrition", patientsToday: 6, availability: "Available", certifications: ["RD", "CSO Certified"] },
  ];

  private labResults: LabResult[] = [
    { labId: "LAB-20250125-001", patientMRN: "MRN-2025-001234", testType: "CBC", orderedDate: new Date("2025-01-24"), status: "Completed", results: { "WBC": "4.8 K/uL", "Hemoglobin": "11.2 g/dL", "Platelets": "145 K/uL" }, orderedBy: "Dr. Sarah Chen", criticalFlag: false },
    { labId: "LAB-20250125-002", patientMRN: "MRN-2025-001067", testType: "Tumor Markers", orderedDate: new Date("2025-01-24"), status: "In Progress", orderedBy: "Dr. Jennifer Williams", criticalFlag: false },
    { labId: "LAB-20250125-003", patientMRN: "MRN-2024-007821", testType: "Metabolic Panel", orderedDate: new Date("2025-01-25"), status: "Pending", orderedBy: "Dr. Sarah Chen", criticalFlag: false },
    { labId: "LAB-20250125-004", patientMRN: "MRN-2025-001189", testType: "Tumor Markers", orderedDate: new Date("2025-01-23"), status: "Completed", results: { "PSA": "2.4 ng/mL" }, orderedBy: "Dr. Michael Rodriguez", criticalFlag: false },
  ];

  private imagingStudies: ImagingStudy[] = [
    { studyId: "IMG-20250125-001", patientMRN: "MRN-2025-001234", modality: "CT", bodyPart: "Chest/Abdomen/Pelvis", scheduledTime: new Date("2025-01-25T08:00:00"), status: "Complete", radiologist: "Dr. Anderson", findings: "No evidence of metastatic disease" },
    { studyId: "IMG-20250125-002", patientMRN: "MRN-2025-001067", modality: "PET Scan", bodyPart: "Whole Body", scheduledTime: new Date("2025-01-25T11:00:00"), status: "In Progress", radiologist: "Dr. Kim" },
    { studyId: "IMG-20250125-003", patientMRN: "MRN-2024-007821", modality: "MRI", bodyPart: "Abdomen", scheduledTime: new Date("2025-01-25T14:00:00"), status: "Scheduled" },
  ];

  private supportServices: SupportService[] = [
    { serviceId: 1, serviceName: "Breast Cancer Support Group", type: "Support Group", schedule: "Tuesdays 6:00 PM", facilitator: "Lisa Anderson, RN", enrolledPatients: 18, capacity: 25, satisfactionScore: 4.8 },
    { serviceId: 2, serviceName: "Nutrition Counseling", type: "Nutrition Counseling", schedule: "Mon-Fri by appointment", facilitator: "Amanda Foster, RD", enrolledPatients: 42, capacity: 60, satisfactionScore: 4.9 },
    { serviceId: 3, serviceName: "Financial Navigation", type: "Financial Assistance", schedule: "Mon-Fri 9AM-5PM", facilitator: "Marcus Johnson, LCSW", enrolledPatients: 67, capacity: 100, satisfactionScore: 4.7 },
    { serviceId: 4, serviceName: "Survivorship Wellness Program", type: "Survivorship Program", schedule: "Monthly workshops", facilitator: "Dr. Sarah Chen", enrolledPatients: 34, capacity: 50, satisfactionScore: 4.9 },
    { serviceId: 5, serviceName: "Integrative Medicine", type: "Integrative Medicine", schedule: "Thursdays 10AM-3PM", facilitator: "Dr. Patel", enrolledPatients: 23, capacity: 30, satisfactionScore: 4.6 },
  ];

  private researchMetrics: ResearchMetric[] = [
    { metric: "5-Year Survival Rate", category: "Clinical Outcomes", value: 68.5, target: 65, trend: "improving" },
    { metric: "Patient Safety Score", category: "Patient Safety", value: 97.2, target: 95, trend: "stable" },
    { metric: "Clinical Trial Enrollment", category: "Research Productivity", value: 45, target: 50, trend: "improving" },
    { metric: "NCI Accreditation Score", category: "Quality Metrics", value: 98.1, target: 95, trend: "improving" },
    { metric: "Treatment Plan Adherence", category: "Clinical Outcomes", value: 94.3, target: 90, trend: "improving" },
    { metric: "Patient Satisfaction", category: "Quality Metrics", value: 96.7, target: 95, trend: "stable" },
  ];

  // Getters
  getPatients(): Patient[] { return [...this.patients]; }
  getTreatmentSessions(): TreatmentSession[] { return [...this.treatmentSessions]; }
  getClinicalTrials(): ClinicalTrial[] { return [...this.clinicalTrials]; }
  getCareTeam(): CareTeamMember[] { return [...this.careTeam]; }
  getLabResults(): LabResult[] { return [...this.labResults]; }
  getImagingStudies(): ImagingStudy[] { return [...this.imagingStudies]; }
  getSupportServices(): SupportService[] { return [...this.supportServices]; }
  getResearchMetrics(): ResearchMetric[] { return [...this.researchMetrics]; }

  // Statistics
  getPatientStats() {
    const totalPatients = this.patients.length;
    const activePatients = this.patients.filter(p => p.status === "Active Treatment").length;
    const clinicalTrialPatients = this.patients.filter(p => p.status === "Clinical Trial").length;
    const remissionPatients = this.patients.filter(p => p.status === "Remission").length;

    const cancerTypeBreakdown = this.patients.reduce((acc, p) => {
      acc[p.cancerType] = (acc[p.cancerType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPatients,
      activePatients,
      clinicalTrialPatients,
      remissionPatients,
      cancerTypeBreakdown,
    };
  }

  getTreatmentStats() {
    const totalSessions = this.treatmentSessions.length;
    const inProgress = this.treatmentSessions.filter(s => s.status === "In Progress").length;
    const completed = this.treatmentSessions.filter(s => s.status === "Completed").length;
    const scheduled = this.treatmentSessions.filter(s => s.status === "Scheduled").length;

    const treatmentTypeBreakdown = this.treatmentSessions.reduce((acc, s) => {
      acc[s.treatmentType] = (acc[s.treatmentType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSessions,
      inProgress,
      completed,
      scheduled,
      treatmentTypeBreakdown,
    };
  }

  getClinicalTrialStats() {
    const totalTrials = this.clinicalTrials.length;
    const recruiting = this.clinicalTrials.filter(t => t.status === "Recruiting").length;
    const totalEnrolled = this.clinicalTrials.reduce((sum, t) => sum + t.enrolledPatients, 0);
    const enrollmentRate = this.clinicalTrials.reduce((sum, t) =>
      sum + (t.enrolledPatients / t.targetEnrollment), 0) / totalTrials * 100;

    return {
      totalTrials,
      recruiting,
      totalEnrolled,
      enrollmentRate,
    };
  }

  getCareTeamStats() {
    const totalStaff = this.careTeam.length;
    const available = this.careTeam.filter(m => m.availability === "Available").length;
    const inSession = this.careTeam.filter(m => m.availability === "In Session").length;
    const totalPatientContacts = this.careTeam.reduce((sum, m) => sum + m.patientsToday, 0);

    return {
      totalStaff,
      available,
      inSession,
      totalPatientContacts,
    };
  }

  getSupportServiceStats() {
    const totalServices = this.supportServices.length;
    const totalEnrolled = this.supportServices.reduce((sum, s) => sum + s.enrolledPatients, 0);
    const avgSatisfaction = this.supportServices.reduce((sum, s) => sum + s.satisfactionScore, 0) / totalServices;
    const utilizationRate = this.supportServices.reduce((sum, s) =>
      sum + (s.enrolledPatients / s.capacity), 0) / totalServices * 100;

    return {
      totalServices,
      totalEnrolled,
      avgSatisfaction,
      utilizationRate,
    };
  }
}

// ============================================================================
// MAIN CLI APPLICATION
// ============================================================================

class StephensonCancerCenterCLI {
  private db: StephensonCancerCenterDB;
  private logger: Logger;
  private running = true;

  constructor() {
    this.db = new StephensonCancerCenterDB();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .namespace("StephensonCC")
        .logLevel("info")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .maxHistorySize(1000)
        .build()
    );
  }

  private showBanner() {
    console.clear();
    console.log("");
    BannerRenderer.render({
      title: "🏥 STEPHENSON CANCER CENTER",
      subtitle: "OU Health • Oklahoma's Only NCI-Designated Cancer Center",
      description: "Innovation • Compassion • Excellence • Research",
      version: "Clinical Operations System v3.2.1",
      author: "Clinical Operations Team",
      width: 110,
      style: "double",
      color: ColorSystem.codes.brightMagenta,
    });
    console.log("");

    BoxRenderer.render(
      [
        `🏢 Location: 800 NE 10th Street, Oklahoma City, OK 73104`,
        `📞 Main: (405) 271-4022 • Patient Scheduling: (405) 271-8777`,
        `🌐 Website: www.stephensoncancercenter.org`,
        `🎗️ NCI-Designated Since 2012 • AACI Member • CAP Accredited`,
        `🔬 Mission: Advancing cancer care through research, education, and compassionate treatment`,
      ],
      {
        title: "Center Information",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );
    console.log("");
  }

  private async showMainMenu(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" CLINICAL OPERATIONS DASHBOARD", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log("");

    return await InteractivePrompts.select(
      "Select an option:",
      [
        { label: "👥 Patient Census & Care Plans", value: "patients" },
        { label: "💉 Treatment Sessions Today", value: "treatments" },
        { label: "🔬 Clinical Trials & Research", value: "trials" },
        { label: "👨‍⚕️ Care Team Status", value: "careteam" },
        { label: "🧪 Lab Results & Imaging", value: "diagnostics" },
        { label: "🤝 Support Services & Wellness", value: "support" },
        { label: "📊 Outcomes & Quality Metrics", value: "analytics" },
        { label: "⚡ Treatment Animation Lab", value: "animation" },
        { label: "🎗️ Patient Journey Simulation", value: "journey" },
        { label: "🚪 Exit", value: "exit" },
      ]
    );
  }

  // ========================================================================
  // PATIENT CENSUS & CARE PLANS
  // ========================================================================

  private async viewPatients() {
    this.logger.info("Loading patient census...");

    const spinner = new Spinner({ message: "Accessing EMR system..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Patient data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" PATIENT CENSUS & ACTIVE CARE PLANS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log("");

    const patients = this.db.getPatients();
    const stats = this.db.getPatientStats();

    // Patient summary
    BoxRenderer.render(
      [
        `👥 Total Active Patients: ${ColorSystem.colorize(String(stats.totalPatients), ColorSystem.codes.brightCyan)}`,
        `💉 Active Treatment: ${ColorSystem.colorize(String(stats.activePatients), ColorSystem.codes.yellow)}`,
        `🔬 Clinical Trial Participants: ${ColorSystem.colorize(String(stats.clinicalTrialPatients), ColorSystem.codes.magenta)}`,
        `🎗️ In Remission: ${ColorSystem.colorize(String(stats.remissionPatients), ColorSystem.codes.brightGreen)}`,
        `📅 Appointments This Week: ${ColorSystem.colorize("34", ColorSystem.codes.cyan)}`,
      ],
      {
        title: "👥 Patient Census Overview",
        style: "double",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );

    console.log("");

    // Patient table
    console.log(ColorSystem.colorize(`📋 Active Patient Registry`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      patients,
      [
        { key: "mrn", label: "MRN", width: 16 },
        { key: "initials", label: "Patient", width: 8, align: "center" },
        { key: "age", label: "Age", width: 5, align: "center" },
        { key: "cancerType", label: "Cancer Type", width: 18 },
        { key: "stage", label: "Stage", width: 10 },
        { key: "treatmentPlan", label: "Treatment Plan", width: 22 },
        {
          key: "status",
          label: "Status",
          width: 18,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Active Treatment": ColorSystem.codes.yellow,
              "Monitoring": ColorSystem.codes.cyan,
              "Remission": ColorSystem.codes.brightGreen,
              "Clinical Trial": ColorSystem.codes.magenta,
              "Palliative Care": ColorSystem.codes.blue,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Cancer type distribution
    console.log(ColorSystem.colorize("📊 Patient Distribution by Cancer Type:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(stats.cancerTypeBreakdown).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightCyan,
      }
    );

    console.log("");
    this.logger.success("Patient census displayed");
  }

  // ========================================================================
  // TREATMENT SESSIONS TODAY
  // ========================================================================

  private async viewTreatments() {
    this.logger.info("Loading treatment schedule...");

    const spinner = new Spinner({ message: "Synchronizing treatment systems..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Treatment schedule loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" TODAY'S TREATMENT SESSIONS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log("");

    const sessions = this.db.getTreatmentSessions();
    const stats = this.db.getTreatmentStats();

    // Treatment summary
    BoxRenderer.render(
      [
        `💉 Total Sessions Today: ${ColorSystem.colorize(String(stats.totalSessions), ColorSystem.codes.brightCyan)}`,
        `⏳ In Progress: ${ColorSystem.colorize(String(stats.inProgress), ColorSystem.codes.yellow)}`,
        `✅ Completed: ${ColorSystem.colorize(String(stats.completed), ColorSystem.codes.green)}`,
        `📅 Scheduled: ${ColorSystem.colorize(String(stats.scheduled), ColorSystem.codes.cyan)}`,
        `🏥 Infusion Bays Available: ${ColorSystem.colorize("2/8", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "💉 Treatment Status",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");

    // Sessions table
    console.log(ColorSystem.colorize(`📋 Treatment Schedule`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      sessions,
      [
        { key: "sessionId", label: "Session ID", width: 18 },
        { key: "patientMRN", label: "Patient MRN", width: 16 },
        { key: "treatmentType", label: "Treatment", width: 14 },
        {
          key: "scheduledTime",
          label: "Time",
          width: 8,
          formatter: (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        { key: "duration", label: "Duration", width: 10, formatter: (m: number) => `${m} min` },
        {
          key: "status",
          label: "Status",
          width: 14,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Scheduled": ColorSystem.codes.cyan,
              "In Progress": ColorSystem.codes.yellow,
              "Completed": ColorSystem.codes.green,
              "Cancelled": ColorSystem.codes.red,
              "Delayed": ColorSystem.codes.magenta,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        { key: "room", label: "Location", width: 18 },
      ],
      { showIndex: true }
    );

    console.log("");

    // Treatment type breakdown
    console.log(ColorSystem.colorize("📊 Sessions by Treatment Type:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(stats.treatmentTypeBreakdown).map(([label, value]) => ({ label, value })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");
    this.logger.success("Treatment schedule displayed");
  }

  // ========================================================================
  // CLINICAL TRIALS & RESEARCH
  // ========================================================================

  private async viewClinicalTrials() {
    this.logger.info("Loading clinical trials data...");

    const spinner = new Spinner({ message: "Accessing research database..." });
    spinner.start();
    await sleep(1100);
    spinner.succeed("Clinical trials data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" CLINICAL TRIALS & RESEARCH PROGRAMS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log("");

    const trials = this.db.getClinicalTrials();
    const stats = this.db.getClinicalTrialStats();

    // Research summary
    BoxRenderer.render(
      [
        `🔬 Active Clinical Trials: ${ColorSystem.colorize(String(stats.totalTrials), ColorSystem.codes.brightCyan)}`,
        `📢 Currently Recruiting: ${ColorSystem.colorize(String(stats.recruiting), ColorSystem.codes.yellow)}`,
        `👥 Total Enrolled Patients: ${ColorSystem.colorize(String(stats.totalEnrolled), ColorSystem.codes.green)}`,
        `📊 Enrollment Rate: ${ColorSystem.colorize(`${stats.enrollmentRate.toFixed(1)}%`, ColorSystem.codes.brightGreen)}`,
        `🏆 NCI-Designated Center Status: ${ColorSystem.colorize("Active", ColorSystem.codes.brightMagenta)}`,
      ],
      {
        title: "🔬 Research Overview",
        style: "double",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");

    // Trials table
    console.log(ColorSystem.colorize(`📋 Active Clinical Trials`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      trials,
      [
        { key: "trialId", label: "Trial ID", width: 16 },
        { key: "name", label: "Trial Name", width: 32 },
        { key: "phase", label: "Phase", width: 10 },
        { key: "cancerType", label: "Cancer Type", width: 14 },
        {
          key: "enrolledPatients",
          label: "Enrolled",
          width: 10,
          align: "center"
        },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Recruiting": ColorSystem.codes.yellow,
              "Active": ColorSystem.codes.green,
              "Completed": ColorSystem.codes.cyan,
              "Suspended": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Enrollment progress
    console.log(ColorSystem.colorize("📊 Trial Enrollment Progress:", ColorSystem.codes.bright));
    console.log("");

    trials.forEach(trial => {
      const percentage = (trial.enrolledPatients / trial.targetEnrollment) * 100;
      console.log(ColorSystem.colorize(`  ${trial.name}:`, ColorSystem.codes.dim));
      const progBar = new ProgressBar({
        total: 100,
        width: 50,
        showValue: false,
        showPercentage: true,
        colorize: true,
      });
      progBar.update(percentage);
      progBar.complete();
      console.log("");
    });

    this.logger.success("Clinical trials data displayed");
  }

  // ========================================================================
  // CARE TEAM STATUS
  // ========================================================================

  private async viewCareTeam() {
    this.logger.info("Loading care team status...");

    const spinner = new Spinner({ message: "Accessing staff directory..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Care team data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" MULTIDISCIPLINARY CARE TEAM", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightGreen));
    console.log("");

    const team = this.db.getCareTeam();
    const stats = this.db.getCareTeamStats();

    // Team summary
    BoxRenderer.render(
      [
        `👨‍⚕️ Care Team Members On Duty: ${ColorSystem.colorize(String(stats.totalStaff), ColorSystem.codes.brightCyan)}`,
        `✅ Available: ${ColorSystem.colorize(String(stats.available), ColorSystem.codes.brightGreen)}`,
        `💼 In Session: ${ColorSystem.colorize(String(stats.inSession), ColorSystem.codes.yellow)}`,
        `📞 Patient Contacts Today: ${ColorSystem.colorize(String(stats.totalPatientContacts), ColorSystem.codes.cyan)}`,
        `🎓 Board Certified Staff: ${ColorSystem.colorize("100%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "👨‍⚕️ Care Team Overview",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Team table
    console.log(ColorSystem.colorize(`📋 Care Team Directory`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      team,
      [
        { key: "employeeId", label: "ID", width: 10 },
        { key: "name", label: "Name", width: 22 },
        { key: "role", label: "Role", width: 22 },
        { key: "specialty", label: "Specialty", width: 24 },
        {
          key: "availability",
          label: "Status",
          width: 12,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Available": ColorSystem.codes.brightGreen,
              "In Session": ColorSystem.codes.yellow,
              "Lunch": ColorSystem.codes.cyan,
              "Meeting": ColorSystem.codes.magenta,
              "Off Duty": ColorSystem.codes.dim,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        {
          key: "patientsToday",
          label: "Patients",
          width: 10,
          align: "center"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Patient load distribution
    console.log(ColorSystem.colorize("📊 Patient Load Distribution:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      team.map(m => ({ label: m.name.split(' ')[1], value: m.patientsToday })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");
    this.logger.success("Care team status displayed");
  }

  // ========================================================================
  // LAB RESULTS & IMAGING
  // ========================================================================

  private async viewDiagnostics() {
    this.logger.info("Loading diagnostic data...");

    const spinner = new Spinner({ message: "Accessing lab and imaging systems..." });
    spinner.start();
    await sleep(1000);
    spinner.succeed("Diagnostic data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightBlue));
    console.log(ColorSystem.colorize(" LABORATORY & IMAGING STUDIES", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightBlue));
    console.log("");

    const labResults = this.db.getLabResults();
    const imaging = this.db.getImagingStudies();

    // Diagnostics summary
    BoxRenderer.render(
      [
        `🧪 Lab Orders Today: ${ColorSystem.colorize(String(labResults.length), ColorSystem.codes.brightCyan)}`,
        `📸 Imaging Studies Today: ${ColorSystem.colorize(String(imaging.length), ColorSystem.codes.yellow)}`,
        `⏳ Results Pending: ${ColorSystem.colorize(String(labResults.filter(l => l.status === "Pending").length), ColorSystem.codes.cyan)}`,
        `✅ Results Ready: ${ColorSystem.colorize(String(labResults.filter(l => l.status === "Completed").length), ColorSystem.codes.green)}`,
        `⚠️ Critical Flags: ${ColorSystem.colorize(String(labResults.filter(l => l.criticalFlag).length), ColorSystem.codes.red)}`,
      ],
      {
        title: "🧪 Diagnostics Overview",
        style: "double",
        color: ColorSystem.codes.blue,
        padding: 1,
      }
    );

    console.log("");

    // Lab results table
    console.log(ColorSystem.colorize(`🧪 Laboratory Results`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      labResults,
      [
        { key: "labId", label: "Lab ID", width: 18 },
        { key: "patientMRN", label: "Patient MRN", width: 16 },
        { key: "testType", label: "Test Type", width: 18 },
        {
          key: "orderedDate",
          label: "Ordered",
          width: 12,
          formatter: (d: Date) => d.toLocaleDateString()
        },
        {
          key: "status",
          label: "Status",
          width: 16,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Pending": ColorSystem.codes.yellow,
              "In Progress": ColorSystem.codes.cyan,
              "Completed": ColorSystem.codes.green,
              "Abnormal - Urgent": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
        { key: "orderedBy", label: "Ordered By", width: 20 },
      ],
      { showIndex: true }
    );

    console.log("");

    // Imaging studies table
    console.log(ColorSystem.colorize(`📸 Imaging Studies`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      imaging,
      [
        { key: "studyId", label: "Study ID", width: 18 },
        { key: "patientMRN", label: "Patient MRN", width: 16 },
        { key: "modality", label: "Modality", width: 10 },
        { key: "bodyPart", label: "Body Part", width: 22 },
        {
          key: "scheduledTime",
          label: "Time",
          width: 12,
          formatter: (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          key: "status",
          label: "Status",
          width: 16,
          formatter: (status: string) => {
            const colors: Record<string, string> = {
              "Scheduled": ColorSystem.codes.cyan,
              "In Progress": ColorSystem.codes.yellow,
              "Reading": ColorSystem.codes.magenta,
              "Complete": ColorSystem.codes.green,
              "Critical Finding": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(status, colors[status] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");
    this.logger.success("Diagnostic data displayed");
  }

  // ========================================================================
  // SUPPORT SERVICES & WELLNESS
  // ========================================================================

  private async viewSupportServices() {
    this.logger.info("Loading support services data...");

    const spinner = new Spinner({ message: "Accessing wellness programs..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Support services data loaded");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" PATIENT SUPPORT SERVICES & WELLNESS PROGRAMS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log("");

    const services = this.db.getSupportServices();
    const stats = this.db.getSupportServiceStats();

    // Services summary
    BoxRenderer.render(
      [
        `🤝 Active Programs: ${ColorSystem.colorize(String(stats.totalServices), ColorSystem.codes.brightCyan)}`,
        `👥 Enrolled Patients: ${ColorSystem.colorize(String(stats.totalEnrolled), ColorSystem.codes.green)}`,
        `⭐ Avg Satisfaction: ${ColorSystem.colorize(`${stats.avgSatisfaction.toFixed(1)}/5.0`, ColorSystem.codes.brightGreen)}`,
        `📊 Utilization Rate: ${ColorSystem.colorize(`${stats.utilizationRate.toFixed(1)}%`, ColorSystem.codes.yellow)}`,
        `🎗️ Survivorship Program: ${ColorSystem.colorize("Active", ColorSystem.codes.magenta)}`,
      ],
      {
        title: "🤝 Support Services Overview",
        style: "double",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );

    console.log("");

    // Services table
    console.log(ColorSystem.colorize(`📋 Available Support Services`, ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      services,
      [
        { key: "serviceName", label: "Service Name", width: 32 },
        { key: "type", label: "Type", width: 22 },
        { key: "schedule", label: "Schedule", width: 22 },
        {
          key: "enrolledPatients",
          label: "Enrolled",
          width: 10,
          align: "center"
        },
        {
          key: "satisfactionScore",
          label: "Rating",
          width: 10,
          align: "center",
          formatter: (score: number) => ColorSystem.colorize(`${score.toFixed(1)}★`, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Enrollment by service
    console.log(ColorSystem.colorize("📊 Program Enrollment:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      services.map(s => ({ label: s.serviceName.slice(0, 25), value: s.enrolledPatients })),
      {
        showValues: true,
        width: 45,
        color: ColorSystem.codes.brightCyan,
      }
    );

    console.log("");

    // Holistic care impact
    BoxRenderer.render(
      [
        `🍎 Nutrition Counseling: ${ColorSystem.colorize("42", ColorSystem.codes.green)} patients served`,
        `💰 Financial Assistance: ${ColorSystem.colorize("$1.2M", ColorSystem.codes.cyan)} in aid coordinated`,
        `🧘 Integrative Medicine: ${ColorSystem.colorize("23", ColorSystem.codes.magenta)} active participants`,
        `🎗️ Survivorship Care: ${ColorSystem.colorize("34", ColorSystem.codes.yellow)} survivors supported`,
        `🤝 Support Groups: ${ColorSystem.colorize("96%", ColorSystem.codes.brightGreen)} report benefit`,
      ],
      {
        title: "🌟 Holistic Care Impact",
        style: "rounded",
        color: ColorSystem.codes.cyan,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Support services data displayed");
  }

  // ========================================================================
  // OUTCOMES & QUALITY METRICS
  // ========================================================================

  private async viewAnalytics() {
    this.logger.info("Generating outcomes analytics...");

    const spinner = new Spinner({ message: "Analyzing clinical data..." });
    spinner.start();
    await sleep(1400);
    spinner.succeed("Analytics ready");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" CLINICAL OUTCOMES & QUALITY METRICS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightYellow));
    console.log("");

    const metrics = this.db.getResearchMetrics();
    const patientStats = this.db.getPatientStats();
    const trialStats = this.db.getClinicalTrialStats();

    // Key metrics
    BoxRenderer.render(
      [
        `🎯 5-Year Survival Rate: ${ColorSystem.colorize("68.5%", ColorSystem.codes.brightGreen)} (Target: 65%)`,
        `🏥 Patient Safety Score: ${ColorSystem.colorize("97.2%", ColorSystem.codes.green)} (Target: 95%)`,
        `🔬 Clinical Trial Enrollment: ${ColorSystem.colorize(String(trialStats.totalEnrolled), ColorSystem.codes.magenta)} patients`,
        `⭐ NCI Accreditation: ${ColorSystem.colorize("98.1%", ColorSystem.codes.brightCyan)} (Target: 95%)`,
        `💙 Patient Satisfaction: ${ColorSystem.colorize("96.7%", ColorSystem.codes.yellow)} (Target: 95%)`,
      ],
      {
        title: "📊 Key Performance Indicators",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");

    // Metrics progress bars
    console.log(ColorSystem.colorize("📈 Quality Metrics Performance:", ColorSystem.codes.bright));
    console.log("");

    metrics.forEach(metric => {
      const percentage = (metric.value / metric.target) * 100;
      const trendSymbol = metric.trend === "improving" ? "↑" : metric.trend === "stable" ? "→" : "↓";
      const trendColor = metric.trend === "improving" ? ColorSystem.codes.brightGreen :
                         metric.trend === "stable" ? ColorSystem.codes.yellow : ColorSystem.codes.red;

      console.log(ColorSystem.colorize(`  ${metric.metric}:`, ColorSystem.codes.dim));
      const metricBar = new ProgressBar({
        total: metric.target,
        width: 50,
        showValue: false,
        showPercentage: false,
        colorize: true,
      });
      metricBar.update(metric.value);
      metricBar.complete();
      console.log(ColorSystem.colorize(
        `    Current: ${metric.value.toFixed(1)} • Target: ${metric.target} • Trend: ${ColorSystem.colorize(trendSymbol, trendColor)} ${metric.trend}`,
        ColorSystem.codes.dim
      ));
      console.log("");
    });

    // Research productivity
    console.log(ColorSystem.colorize("🔬 Research & Innovation Metrics:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Publications", value: 47 },
        { label: "Clinical Trials", value: 3 },
        { label: "Grant Funding ($M)", value: 12 },
        { label: "New Protocols", value: 8 },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightMagenta,
      }
    );

    console.log("");

    // Excellence recognition
    BoxRenderer.render(
      [
        `🏆 NCI-Designated Cancer Center: ${ColorSystem.colorize("Since 2012", ColorSystem.codes.brightCyan)}`,
        `🎖️ AACI Member: ${ColorSystem.colorize("Active", ColorSystem.codes.green)}`,
        `✅ CAP Laboratory Accreditation: ${ColorSystem.colorize("Current", ColorSystem.codes.yellow)}`,
        `🔬 Top Clinical Trial Site: ${ColorSystem.colorize("Regional Leader", ColorSystem.codes.magenta)}`,
        `💙 Patient-Centered Care Award: ${ColorSystem.colorize("2024 Recipient", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🌟 Excellence & Accreditation",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Analytics report generated successfully");
  }

  // ========================================================================
  // TREATMENT ANIMATION LAB
  // ========================================================================

  private async runTreatmentAnimation() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" TREATMENT ANIMATION LAB - CHEMOTHERAPY INFUSION", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightMagenta));
    console.log("");

    this.logger.info("Starting treatment animation sequence...");
    console.log("");

    // Stage 1: Pre-Treatment Assessment
    console.log(ColorSystem.colorize("🩺 Stage 1: Pre-Treatment Assessment", ColorSystem.codes.brightCyan));
    const assessSpinner = new Spinner({
      message: "Patient checking in...",
      frames: ["💙", "💜", "💙", "💜"],
      interval: 200
    });
    assessSpinner.start();
    await sleep(1000);
    assessSpinner.update("Reviewing vital signs...");
    await sleep(900);
    assessSpinner.update("Checking lab values...");
    await sleep(800);
    assessSpinner.succeed("Pre-treatment assessment complete");
    console.log("");

    BoxRenderer.render(
      [
        `👤 Patient: J.S. (MRN-2025-001234)`,
        `💉 Treatment: AC-T Protocol (Doxorubicin/Cyclophosphamide)`,
        `📊 Vital Signs: ${ColorSystem.colorize("All within normal limits", ColorSystem.codes.brightGreen)}`,
        `🧪 WBC: ${ColorSystem.colorize("4.8 K/uL", ColorSystem.codes.green)} • Platelets: ${ColorSystem.colorize("145 K/uL", ColorSystem.codes.green)}`,
        `✅ Clearance: ${ColorSystem.colorize("APPROVED FOR TREATMENT", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "✅ Pre-Treatment Clearance",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      }
    );
    console.log("");

    // Stage 2: IV Placement & Medication Prep
    console.log(ColorSystem.colorize("💉 Stage 2: IV Access & Medication Preparation", ColorSystem.codes.brightYellow));
    const prepProgress = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Establishing IV access...");
    for (let i = 0; i <= 35; i += 5) {
      prepProgress.update(i);
      await sleep(100);
    }
    this.logger.info("Preparing chemotherapy medications in pharmacy...");
    for (let i = 35; i <= 70; i += 5) {
      prepProgress.update(i);
      await sleep(120);
    }
    this.logger.info("Double-checking medication orders...");
    for (let i = 70; i <= 100; i += 5) {
      prepProgress.update(i);
      await sleep(100);
    }
    prepProgress.complete();
    this.logger.success("IV established, medications prepared");
    console.log("");

    // Stage 3: Infusion Administration
    console.log(ColorSystem.colorize("⏱️ Stage 3: Chemotherapy Infusion", ColorSystem.codes.brightMagenta));
    const infusionSpinner = new Spinner({
      message: "Administering pre-medications...",
      frames: ["💧", "💊", "💉", "🩹"],
      interval: 150
    });
    infusionSpinner.start();
    await sleep(1500);
    infusionSpinner.update("Starting chemotherapy infusion...");
    await sleep(1200);
    infusionSpinner.update("Monitoring patient response...");
    await sleep(1000);
    infusionSpinner.update("Infusion at 50% complete...");
    await sleep(1100);
    infusionSpinner.update("Infusion at 75% complete...");
    await sleep(900);
    infusionSpinner.succeed("Chemotherapy infusion completed successfully");
    console.log("");

    // Infusion monitoring details
    console.log(ColorSystem.colorize("📊 Live Infusion Monitoring:", ColorSystem.codes.bright));
    console.log("");

    const monitoringData = [
      { time: "10:30", bp: "124/78", hr: "68", temp: "98.2°F", status: "Stable" },
      { time: "11:00", bp: "126/80", hr: "72", temp: "98.4°F", status: "Stable" },
      { time: "11:30", bp: "128/82", hr: "70", temp: "98.3°F", status: "Stable" },
      { time: "12:00", bp: "125/79", hr: "69", temp: "98.2°F", status: "Stable" },
    ];

    TableRenderer.render(
      monitoringData,
      [
        { key: "time", label: "Time", width: 8 },
        { key: "bp", label: "BP", width: 10 },
        { key: "hr", label: "HR", width: 6, align: "center" },
        { key: "temp", label: "Temp", width: 10 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (s: string) => ColorSystem.colorize(s, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Stage 4: Post-Treatment Care
    console.log(ColorSystem.colorize("🏥 Stage 4: Post-Treatment Care & Education", ColorSystem.codes.brightBlue));
    const postSpinner = new Spinner({
      message: "Removing IV access...",
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 80
    });
    postSpinner.start();
    await sleep(800);
    postSpinner.update("Providing patient education materials...");
    await sleep(900);
    postSpinner.update("Scheduling next appointment...");
    await sleep(700);
    postSpinner.succeed("Post-treatment care completed");
    console.log("");

    // Summary
    console.log(ColorSystem.colorize("📋 Treatment Session Summary:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { phase: "Pre-Treatment Assessment", duration: "15 min", status: "Complete" },
        { phase: "IV & Medication Prep", duration: "25 min", status: "Complete" },
        { phase: "Chemotherapy Infusion", duration: "90 min", status: "Complete" },
        { phase: "Post-Treatment Care", duration: "10 min", status: "Complete" },
        { phase: "Total Session Time", duration: "140 min", status: "Complete" },
      ],
      [
        { key: "phase", label: "Phase", width: 32 },
        { key: "duration", label: "Duration", width: 15, align: "right" },
        {
          key: "status",
          label: "Status",
          width: 15,
          formatter: (s: string) => ColorSystem.colorize(s, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Treatment Administered: ${ColorSystem.colorize("Doxorubicin 60mg/m² + Cyclophosphamide 600mg/m²", ColorSystem.codes.cyan)}`,
        `🎯 Dose Accuracy: ${ColorSystem.colorize("100%", ColorSystem.codes.brightGreen)} (verified by pharmacist)`,
        `💙 Patient Tolerance: ${ColorSystem.colorize("Excellent", ColorSystem.codes.green)} (no adverse reactions)`,
        `📅 Next Treatment: ${ColorSystem.colorize("February 15, 2025", ColorSystem.codes.yellow)}`,
        `📊 Cycle Progress: ${ColorSystem.colorize("2 of 4 cycles completed", ColorSystem.codes.magenta)}`,
        `🤝 Support Provided: ${ColorSystem.colorize("Nutrition counseling referral, Support group info", ColorSystem.codes.cyan)}`,
        ``,
        `⭐ Outcome: ${ColorSystem.colorize("SUCCESSFUL TREATMENT SESSION", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "📊 Session Outcome",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Treatment animation sequence completed successfully");
  }

  // ========================================================================
  // PATIENT JOURNEY SIMULATION
  // ========================================================================

  private async runPatientJourney() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log(ColorSystem.colorize(" PATIENT JOURNEY SIMULATION - FROM DIAGNOSIS TO REMISSION", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(105), ColorSystem.codes.brightCyan));
    console.log("");

    this.logger.info("Starting comprehensive patient journey simulation...");
    console.log("");

    // Milestone 1: Initial Diagnosis
    console.log(ColorSystem.colorize("🔬 Milestone 1: Initial Diagnosis & Evaluation", ColorSystem.codes.brightMagenta));
    await sleep(500);

    console.log(ColorSystem.colorize("  Diagnostic workup:", ColorSystem.codes.dim));
    const diagnosisProgress = new ProgressBar({
      total: 100,
      width: 70,
      showPercentage: true,
      colorize: true,
    });

    for (let i = 0; i <= 100; i += 10) {
      diagnosisProgress.update(i);
      await sleep(150);
    }
    diagnosisProgress.complete();
    this.logger.success("Diagnosis confirmed: Stage II Breast Cancer");
    console.log("");
    await sleep(800);

    // Milestone 2: Multidisciplinary Tumor Board
    console.log(ColorSystem.colorize("👨‍⚕️ Milestone 2: Multidisciplinary Tumor Board Review", ColorSystem.codes.brightGreen));
    const tumorBoardSpinner = new Spinner({
      message: "Assembling care team (oncology, surgery, radiation, pathology)...",
      frames: ["👨‍⚕️", "👩‍⚕️", "🔬", "💊"],
      interval: 200
    });
    tumorBoardSpinner.start();
    await sleep(1200);
    tumorBoardSpinner.update("Reviewing imaging and pathology...");
    await sleep(1000);
    tumorBoardSpinner.update("Formulating treatment plan...");
    await sleep(1100);
    tumorBoardSpinner.succeed("Treatment plan established: AC-T chemotherapy protocol");
    console.log("");
    await sleep(800);

    // Milestone 3: Treatment Journey
    console.log(ColorSystem.colorize("💉 Milestone 3: Active Treatment Phase (4 months)", ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize("  Treatment cycles:", ColorSystem.codes.dim));
    const treatmentProgress = new ProgressBar({
      total: 100,
      width: 70,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Cycle 1/4 - Doxorubicin + Cyclophosphamide");
    for (let i = 0; i <= 25; i += 5) {
      treatmentProgress.update(i);
      await sleep(200);
    }

    this.logger.info("Cycle 2/4 - Doxorubicin + Cyclophosphamide");
    for (let i = 25; i <= 50; i += 5) {
      treatmentProgress.update(i);
      await sleep(200);
    }

    this.logger.info("Cycle 3/4 - Paclitaxel");
    for (let i = 50; i <= 75; i += 5) {
      treatmentProgress.update(i);
      await sleep(200);
    }

    this.logger.info("Cycle 4/4 - Paclitaxel");
    for (let i = 75; i <= 100; i += 5) {
      treatmentProgress.update(i);
      await sleep(200);
    }
    treatmentProgress.complete();
    this.logger.success("All treatment cycles completed successfully");
    console.log("");
    await sleep(800);

    // Milestone 4: Response Assessment
    console.log(ColorSystem.colorize("📊 Milestone 4: Treatment Response Assessment", ColorSystem.codes.brightBlue));
    const assessmentSpinner = new Spinner({
      message: "Conducting post-treatment imaging...",
      frames: ["📸", "🔬", "📊", "✅"],
      interval: 180
    });
    assessmentSpinner.start();
    await sleep(1300);
    assessmentSpinner.update("Analyzing tumor markers...");
    await sleep(1100);
    assessmentSpinner.update("Evaluating clinical response...");
    await sleep(1000);
    assessmentSpinner.succeed("Complete response achieved - No evidence of disease!");
    console.log("");
    await sleep(1000);

    // Milestone 5: Survivorship Care
    console.log(ColorSystem.colorize("🎗️ Milestone 5: Transition to Survivorship Care", ColorSystem.codes.brightGreen));
    const survivorshipSpinner = new Spinner({
      message: "Creating survivorship care plan...",
      frames: ["📋", "🤝", "💪", "🎗️"],
      interval: 170
    });
    survivorshipSpinner.start();
    await sleep(1000);
    survivorshipSpinner.update("Scheduling follow-up surveillance...");
    await sleep(900);
    survivorshipSpinner.update("Enrolling in wellness programs...");
    await sleep(1100);
    survivorshipSpinner.succeed("Entered remission - Survivorship care initiated");
    console.log("");

    // Journey Summary
    console.log(ColorSystem.colorize("📈 Complete Patient Journey Timeline:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { milestone: "Initial Diagnosis", date: "January 2025", duration: "2 weeks", outcome: "Stage II confirmed" },
        { milestone: "Tumor Board Review", date: "January 2025", duration: "1 week", outcome: "Treatment plan" },
        { milestone: "Chemotherapy", date: "Feb-May 2025", duration: "4 months", outcome: "4 cycles completed" },
        { milestone: "Response Assessment", date: "June 2025", duration: "2 weeks", outcome: "Complete response" },
        { milestone: "Survivorship Care", date: "June 2025 - ongoing", duration: "Lifetime", outcome: "Remission" },
      ],
      [
        { key: "milestone", label: "Milestone", width: 25 },
        { key: "date", label: "Date", width: 20 },
        { key: "duration", label: "Duration", width: 15 },
        {
          key: "outcome",
          label: "Outcome",
          width: 20,
          formatter: (o: string) => ColorSystem.colorize(o, ColorSystem.codes.brightGreen)
        },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `👤 Patient Journey: ${ColorSystem.colorize("Diagnosis to Remission", ColorSystem.codes.brightCyan)}`,
        `📅 Total Journey Duration: ${ColorSystem.colorize("6 months", ColorSystem.codes.yellow)}`,
        `💉 Treatment Cycles Completed: ${ColorSystem.colorize("4 of 4", ColorSystem.codes.green)}`,
        `🎯 Clinical Response: ${ColorSystem.colorize("Complete Response (CR)", ColorSystem.codes.brightGreen)}`,
        `🤝 Care Team Members: ${ColorSystem.colorize("6 specialists", ColorSystem.codes.cyan)}`,
        `📊 Patient Satisfaction: ${ColorSystem.colorize("5.0/5.0", ColorSystem.codes.brightGreen)}`,
        `🎗️ Current Status: ${ColorSystem.colorize("IN REMISSION", ColorSystem.codes.brightMagenta)}`,
        ``,
        `💙 Support Services Utilized:`,
        `  • Nurse Navigation throughout treatment`,
        `  • Nutrition counseling - 8 sessions`,
        `  • Support group - Weekly attendance`,
        `  • Financial assistance - $12,500 coordinated`,
        `  • Integrative medicine - Meditation & acupuncture`,
        ``,
        `🌟 Outcome: ${ColorSystem.colorize("SUCCESSFUL TREATMENT - PATIENT THRIVING", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "💙 Complete Patient Journey Summary",
        style: "double",
        color: ColorSystem.codes.brightCyan,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Patient journey simulation completed - Celebrating survivorship! 🎗️");
  }

  // ========================================================================
  // MAIN RUN LOOP
  // ========================================================================

  async run() {
    this.showBanner();

    this.logger.info("Stephenson Cancer Center Clinical Operations System initialized");
    this.logger.info(`Current time: ${new Date().toLocaleString()}`);
    this.logger.info("All systems operational");
    console.log("");

    while (this.running) {
      try {
        const choice = await this.showMainMenu();
        console.log("");

        switch (choice) {
          case "patients":
            await this.viewPatients();
            break;
          case "treatments":
            await this.viewTreatments();
            break;
          case "trials":
            await this.viewClinicalTrials();
            break;
          case "careteam":
            await this.viewCareTeam();
            break;
          case "diagnostics":
            await this.viewDiagnostics();
            break;
          case "support":
            await this.viewSupportServices();
            break;
          case "analytics":
            await this.viewAnalytics();
            break;
          case "animation":
            await this.runTreatmentAnimation();
            break;
          case "journey":
            await this.runPatientJourney();
            break;
          case "exit":
            this.running = false;
            console.log("");
            this.logger.info("Shutting down Clinical Operations System...");
            console.log("");
            BoxRenderer.render(
              [
                "Thank you for using the Stephenson Cancer Center Clinical Operations System",
                "",
                "🎗️ Fighting Cancer with Innovation, Compassion, and Excellence",
                "",
                "Stephenson Cancer Center",
                "800 NE 10th Street, Oklahoma City, OK 73104",
                "(405) 271-4022 • www.stephensoncancercenter.org",
                "",
                "Oklahoma's Only NCI-Designated Cancer Center",
                "Part of OU Health",
                "",
                "Together, we bring hope and healing. 💙",
              ],
              {
                title: "💙 Thank You",
                style: "double",
                color: ColorSystem.codes.brightMagenta,
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
          this.logger.info("Clinical Operations System interrupted by user");
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
  const cancerCenter = new StephensonCancerCenterCLI();
  await cancerCenter.run();
}
