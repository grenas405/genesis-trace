#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Old St. Joseph Cathedral - Oklahoma City - Real-Time Dashboard
 *
 * A sacred monitoring system for the historic Old St. Joseph Cathedral in OKC,
 * featuring live tracking of:
 *
 * • Mass attendance and sacramental events
 * • Prayer intentions and devotional activities
 * • Cathedral operations and maintenance
 * • Community outreach and charitable work
 * • Live streaming viewership metrics
 * • Volunteer coordination and scheduling
 * • Donation and stewardship tracking
 * • Liturgical calendar and feast day celebrations
 *
 * Powered by GenesisTrace with Catholic liturgical colors and papal wisdom
 *
 * Color Scheme:
 * - Purple/Violet: Advent, Lent, Penance (liturgical seasons)
 * - Gold: Glory, Divinity, Sacred moments
 * - White: Purity, Joy, Easter, Christmas
 * - Red: Holy Spirit, Martyrs, Pentecost
 * - Green: Ordinary Time, Growth, Hope
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

// ============================================================================
// Catholic Color Palette (Liturgical Colors)
// ============================================================================

const CatholicColors = {
  purple: ColorSystem.hexToRgb("#663399"), // Advent, Lent
  gold: ColorSystem.hexToRgb("#FFD700"), // Divine glory
  white: ColorSystem.hexToRgb("#FFFFFF"), // Purity, Easter, Christmas
  red: ColorSystem.hexToRgb("#DC143C"), // Holy Spirit, Martyrs
  green: ColorSystem.hexToRgb("#228B22"), // Ordinary Time
  blue: ColorSystem.hexToRgb("#4169E1"), // Mary, Heaven
  rose: ColorSystem.hexToRgb("#FF69B4"), // Gaudete, Laetare Sundays
};

// ============================================================================
// Papal Quotes for Inspiration
// ============================================================================

const papalQuotes = [
  {
    quote: "The Eucharist is the heart of the Church.",
    pope: "Pope Benedict XVI",
    theme: "Eucharist",
  },
  {
    quote: "Prayer is the breath of faith, it is its truest expression.",
    pope: "Pope Francis",
    theme: "Prayer",
  },
  {
    quote: "Do not be afraid. Open wide the doors for Christ.",
    pope: "Pope St. John Paul II",
    theme: "Faith",
  },
  {
    quote: "The Church is the family of God in the world.",
    pope: "Pope Francis",
    theme: "Community",
  },
  {
    quote: "Charity is at the heart of the Church's social doctrine.",
    pope: "Pope Benedict XVI",
    theme: "Charity",
  },
  {
    quote: "The Rosary is my favorite prayer. A marvelous prayer!",
    pope: "Pope St. John Paul II",
    theme: "Devotion",
  },
  {
    quote: "Being a Christian is not the result of an ethical choice, but the encounter with Christ.",
    pope: "Pope Benedict XVI",
    theme: "Discipleship",
  },
  {
    quote: "Let us learn to live with kindness, to love everyone, even when they do not love us.",
    pope: "Pope Francis",
    theme: "Love",
  },
  {
    quote: "The Mass is the most perfect form of prayer.",
    pope: "Pope Paul VI",
    theme: "Liturgy",
  },
  {
    quote: "Confession is an act of honesty and courage.",
    pope: "Pope Francis",
    theme: "Reconciliation",
  },
];

// ============================================================================
// Data Models
// ============================================================================

interface MassSchedule {
  id: number;
  time: string;
  type: "Daily Mass" | "Sunday Mass" | "Holy Day" | "Vigil Mass" | "Special Liturgy";
  celebrant: string;
  attendance: number;
  expectedAttendance: number;
  language: "English" | "Spanish" | "Latin";
  musicMinistry: string;
  sacraments: string[];
  livestreamViewers: number;
}

interface Sacrament {
  id: number;
  type: "Baptism" | "Confirmation" | "Matrimony" | "Reconciliation" | "Anointing" | "First Communion";
  participant: string;
  minister: string;
  date: Date;
  status: "Scheduled" | "In Progress" | "Completed";
  familyAttendees: number;
}

interface PrayerIntention {
  id: number;
  type: "Personal" | "Community" | "Global" | "Deceased" | "Healing" | "Thanksgiving";
  submitted: Date;
  source: "In-Person" | "Online" | "Phone" | "Prayer Box";
  status: "Pending" | "Prayed" | "Ongoing";
  anonymous: boolean;
}

interface VolunteerActivity {
  id: number;
  volunteer: string;
  ministry: string;
  role: string;
  hoursThisMonth: number;
  status: "Active" | "Scheduled" | "Completed";
  serviceArea: "Liturgy" | "Education" | "Outreach" | "Maintenance" | "Administration";
}

interface DonationRecord {
  id: number;
  amount: number;
  type: "Offertory" | "Special Collection" | "Building Fund" | "Charity" | "Memorial";
  method: "Cash" | "Check" | "Online" | "Stock";
  anonymous: boolean;
  timestamp: Date;
  designation: string;
}

interface CathedralEvent {
  id: number;
  name: string;
  type: "Liturgy" | "Education" | "Social" | "Outreach" | "Prayer Group";
  startTime: Date;
  endTime: Date;
  location: string;
  participants: number;
  coordinator: string;
  status: "Upcoming" | "In Progress" | "Completed";
}

interface LiveMetrics {
  totalMassAttendance: number;
  totalLivestreamViewers: number;
  activePrayerIntentions: number;
  sacramentsToday: number;
  volunteerHoursThisWeek: number;
  donationsToday: number;
  activeMinistries: number;
  parishFamilies: number;
}

interface Alert {
  id: number;
  type: "info" | "warning" | "celebration" | "urgent";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  liturgicalColor?: string;
}

// ============================================================================
// Real-Time Cathedral Data Engine
// ============================================================================

class CathedralDataEngine {
  private masses: MassSchedule[] = [];
  private sacraments: Sacrament[] = [];
  private prayerIntentions: PrayerIntention[] = [];
  private volunteers: VolunteerActivity[] = [];
  private donations: DonationRecord[] = [];
  private events: CathedralEvent[] = [];
  private alerts: Alert[] = [];
  private nextAlertId = 1;
  private isRunning = false;
  private updateCallbacks: Array<() => void> = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize Mass Schedule
    this.masses = [
      {
        id: 1,
        time: "7:00 AM",
        type: "Daily Mass",
        celebrant: "Fr. Michael O'Brien",
        attendance: 45,
        expectedAttendance: 50,
        language: "English",
        musicMinistry: "Cantor",
        sacraments: [],
        livestreamViewers: 12,
      },
      {
        id: 2,
        time: "12:10 PM",
        type: "Daily Mass",
        celebrant: "Fr. José Ramírez",
        attendance: 78,
        expectedAttendance: 85,
        language: "Spanish",
        musicMinistry: "Cantor",
        sacraments: [],
        livestreamViewers: 34,
      },
      {
        id: 3,
        time: "5:30 PM",
        type: "Vigil Mass",
        celebrant: "Fr. Patrick Walsh",
        attendance: 234,
        expectedAttendance: 250,
        language: "English",
        musicMinistry: "Cathedral Choir",
        sacraments: ["Baptism"],
        livestreamViewers: 89,
      },
      {
        id: 4,
        time: "8:00 AM",
        type: "Sunday Mass",
        celebrant: "Archbishop Paul Coakley",
        attendance: 456,
        expectedAttendance: 475,
        language: "English",
        musicMinistry: "Cathedral Choir & Orchestra",
        sacraments: ["Baptism", "First Communion"],
        livestreamViewers: 234,
      },
      {
        id: 5,
        time: "10:00 AM",
        type: "Sunday Mass",
        celebrant: "Fr. Michael O'Brien",
        attendance: 512,
        expectedAttendance: 525,
        language: "English",
        musicMinistry: "Contemporary Ensemble",
        sacraments: [],
        livestreamViewers: 178,
      },
      {
        id: 6,
        time: "12:00 PM",
        type: "Sunday Mass",
        celebrant: "Fr. José Ramírez",
        attendance: 389,
        expectedAttendance: 400,
        language: "Spanish",
        musicMinistry: "Mariachi Guadalupano",
        sacraments: ["Baptism"],
        livestreamViewers: 267,
      },
    ];

    // Initialize Sacraments
    this.sacraments = [
      {
        id: 1,
        type: "Baptism",
        participant: "Sofia Maria García",
        minister: "Fr. José Ramírez",
        date: new Date(),
        status: "Completed",
        familyAttendees: 24,
      },
      {
        id: 2,
        type: "First Communion",
        participant: "Emma Rose Murphy",
        minister: "Archbishop Coakley",
        date: new Date(),
        status: "In Progress",
        familyAttendees: 18,
      },
      {
        id: 3,
        type: "Reconciliation",
        participant: "Anonymous",
        minister: "Fr. Patrick Walsh",
        date: new Date(),
        status: "In Progress",
        familyAttendees: 0,
      },
      {
        id: 4,
        type: "Matrimony",
        participant: "Michael & Sarah Johnson",
        minister: "Fr. Michael O'Brien",
        date: new Date(Date.now() + 86400000),
        status: "Scheduled",
        familyAttendees: 150,
      },
      {
        id: 5,
        type: "Confirmation",
        participant: "Youth Confirmation Class",
        minister: "Archbishop Coakley",
        date: new Date(Date.now() + 172800000),
        status: "Scheduled",
        familyAttendees: 245,
      },
    ];

    // Initialize Prayer Intentions
    for (let i = 0; i < 45; i++) {
      this.prayerIntentions.push({
        id: i + 1,
        type: ["Personal", "Community", "Global", "Deceased", "Healing", "Thanksgiving"][
          Math.floor(Math.random() * 6)
        ] as PrayerIntention["type"],
        submitted: new Date(Date.now() - Math.random() * 86400000 * 7),
        source: ["In-Person", "Online", "Phone", "Prayer Box"][Math.floor(Math.random() * 4)] as PrayerIntention["source"],
        status: Math.random() > 0.3 ? "Prayed" : "Pending" as PrayerIntention["status"],
        anonymous: Math.random() > 0.4,
      });
    }

    // Initialize Volunteers
    this.volunteers = [
      {
        id: 1,
        volunteer: "Mary Johnson",
        ministry: "Eucharistic Ministers",
        role: "Coordinator",
        hoursThisMonth: 24,
        status: "Active",
        serviceArea: "Liturgy",
      },
      {
        id: 2,
        volunteer: "John Martinez",
        ministry: "St. Vincent de Paul",
        role: "Food Pantry Manager",
        hoursThisMonth: 42,
        status: "Active",
        serviceArea: "Outreach",
      },
      {
        id: 3,
        volunteer: "Sarah O'Connor",
        ministry: "Religious Education",
        role: "CCD Teacher",
        hoursThisMonth: 18,
        status: "Scheduled",
        serviceArea: "Education",
      },
      {
        id: 4,
        volunteer: "David Chen",
        ministry: "Cathedral Choir",
        role: "Tenor Section Leader",
        hoursThisMonth: 16,
        status: "Active",
        serviceArea: "Liturgy",
      },
      {
        id: 5,
        volunteer: "Maria López",
        ministry: "Lectors",
        role: "Lector",
        hoursThisMonth: 8,
        status: "Active",
        serviceArea: "Liturgy",
      },
      {
        id: 6,
        volunteer: "Robert Taylor",
        ministry: "Maintenance Team",
        role: "Facilities Care",
        hoursThisMonth: 32,
        status: "Active",
        serviceArea: "Maintenance",
      },
      {
        id: 7,
        volunteer: "Patricia Williams",
        ministry: "Rosary Prayer Group",
        role: "Leader",
        hoursThisMonth: 12,
        status: "Active",
        serviceArea: "Liturgy",
      },
      {
        id: 8,
        volunteer: "James Murphy",
        ministry: "Knights of Columbus",
        role: "Grand Knight",
        hoursThisMonth: 28,
        status: "Active",
        serviceArea: "Outreach",
      },
    ];

    // Initialize some donations
    for (let i = 0; i < 20; i++) {
      this.donations.push({
        id: i + 1,
        amount: Math.floor(Math.random() * 500) + 10,
        type: ["Offertory", "Special Collection", "Building Fund", "Charity", "Memorial"][
          Math.floor(Math.random() * 5)
        ] as DonationRecord["type"],
        method: ["Cash", "Check", "Online", "Stock"][Math.floor(Math.random() * 4)] as DonationRecord["method"],
        anonymous: Math.random() > 0.6,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7),
        designation: ["General Fund", "Roof Repair", "Food Pantry", "Youth Ministry", "Missionary Work"][
          Math.floor(Math.random() * 5)
        ],
      });
    }

    // Initialize Events
    this.events = [
      {
        id: 1,
        name: "Adoration Hour",
        type: "Prayer Group",
        startTime: new Date(),
        endTime: new Date(Date.now() + 3600000),
        location: "Blessed Sacrament Chapel",
        participants: 23,
        coordinator: "Fr. Patrick Walsh",
        status: "In Progress",
      },
      {
        id: 2,
        name: "RCIA Class",
        type: "Education",
        startTime: new Date(Date.now() + 3600000),
        endTime: new Date(Date.now() + 7200000),
        location: "Parish Hall",
        participants: 18,
        coordinator: "Deacon Robert Anderson",
        status: "Upcoming",
      },
      {
        id: 3,
        name: "Food Pantry Distribution",
        type: "Outreach",
        startTime: new Date(),
        endTime: new Date(Date.now() + 10800000),
        location: "St. Vincent de Paul Center",
        participants: 67,
        coordinator: "John Martinez",
        status: "In Progress",
      },
    ];

    // Add initial alert
    this.addAlert(
      "celebration",
      "Welcome to Old St. Joseph Cathedral dashboard - Where faith meets community!",
      CatholicColors.gold,
    );
  }

  private addAlert(type: Alert["type"], message: string, liturgicalColor?: string) {
    this.alerts.unshift({
      id: this.nextAlertId++,
      type,
      message,
      timestamp: new Date(),
      acknowledged: false,
      liturgicalColor,
    });

    if (this.alerts.length > 15) {
      this.alerts = this.alerts.slice(0, 15);
    }

    this.notifyUpdate();
  }

  private notifyUpdate() {
    this.updateCallbacks.forEach((callback) => callback());
  }

  onUpdate(callback: () => void) {
    this.updateCallbacks.push(callback);
  }

  startRealtimeSimulation() {
    if (this.isRunning) return;
    this.isRunning = true;

    // Simulate new prayer intentions
    setInterval(() => {
      if (Math.random() > 0.6) {
        const types: PrayerIntention["type"][] = ["Personal", "Community", "Global", "Deceased", "Healing", "Thanksgiving"];
        const sources: PrayerIntention["source"][] = ["In-Person", "Online", "Phone", "Prayer Box"];

        this.prayerIntentions.unshift({
          id: this.prayerIntentions.length + 1,
          type: types[Math.floor(Math.random() * types.length)],
          submitted: new Date(),
          source: sources[Math.floor(Math.random() * sources.length)],
          status: "Pending",
          anonymous: Math.random() > 0.5,
        });

        this.addAlert("info", `New prayer intention received - Lifted up to our Lord`, CatholicColors.blue);
        this.notifyUpdate();
      }
    }, 25000);

    // Simulate livestream viewer changes
    setInterval(() => {
      this.masses.forEach((mass) => {
        const change = Math.floor(Math.random() * 10) - 4;
        mass.livestreamViewers = Math.max(0, mass.livestreamViewers + change);
      });
      this.notifyUpdate();
    }, 18000);

    // Simulate donations
    setInterval(() => {
      if (Math.random() > 0.7) {
        const types: DonationRecord["type"][] = ["Offertory", "Special Collection", "Building Fund", "Charity", "Memorial"];
        const methods: DonationRecord["method"][] = ["Cash", "Check", "Online", "Stock"];
        const amount = Math.floor(Math.random() * 500) + 10;

        this.donations.unshift({
          id: this.donations.length + 1,
          amount,
          type: types[Math.floor(Math.random() * types.length)],
          method: methods[Math.floor(Math.random() * methods.length)],
          anonymous: Math.random() > 0.6,
          timestamp: new Date(),
          designation: ["General Fund", "Roof Repair", "Food Pantry", "Youth Ministry"][
            Math.floor(Math.random() * 4)
          ],
        });

        this.addAlert(
          "celebration",
          `New donation received: ${Formatter.currency(amount)} - God bless our generous parish!`,
          CatholicColors.gold,
        );
        this.notifyUpdate();
      }
    }, 30000);

    // Simulate sacramental celebrations
    setInterval(() => {
      if (Math.random() > 0.85) {
        const celebrations = [
          "A soul found reconciliation in the Sacrament of Confession",
          "The Holy Spirit descended upon a new Confirmation candidate",
          "A child received First Holy Communion - The Body of Christ!",
          "New life in Christ through the waters of Baptism",
        ];

        this.addAlert(
          "celebration",
          celebrations[Math.floor(Math.random() * celebrations.length)],
          CatholicColors.white,
        );
      }
    }, 45000);
  }

  stopRealtimeSimulation() {
    this.isRunning = false;
  }

  getMasses(): MassSchedule[] {
    return [...this.masses];
  }

  getSacraments(): Sacrament[] {
    return [...this.sacraments];
  }

  getPrayerIntentions(): PrayerIntention[] {
    return [...this.prayerIntentions].sort((a, b) => b.submitted.getTime() - a.submitted.getTime());
  }

  getVolunteers(): VolunteerActivity[] {
    return [...this.volunteers];
  }

  getDonations(): DonationRecord[] {
    return [...this.donations].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getEvents(): CathedralEvent[] {
    return [...this.events];
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getLiveMetrics(): LiveMetrics {
    const todayDonations = this.donations.filter(
      (d) => d.timestamp.getTime() > Date.now() - 86400000,
    );

    return {
      totalMassAttendance: this.masses.reduce((sum, m) => sum + m.attendance, 0),
      totalLivestreamViewers: this.masses.reduce((sum, m) => sum + m.livestreamViewers, 0),
      activePrayerIntentions: this.prayerIntentions.filter((p) => p.status === "Pending").length,
      sacramentsToday: this.sacraments.filter(
        (s) => s.status === "Completed" || s.status === "In Progress",
      ).length,
      volunteerHoursThisWeek: this.volunteers.reduce((sum, v) => sum + v.hoursThisMonth, 0) / 4,
      donationsToday: todayDonations.reduce((sum, d) => sum + d.amount, 0),
      activeMinistries: new Set(this.volunteers.map((v) => v.ministry)).size,
      parishFamilies: 1247, // Static for now
    };
  }
}

// ============================================================================
// Real-Time Cathedral Dashboard
// ============================================================================

class CathedralDashboard {
  private engine: CathedralDataEngine;
  private logger: Logger;
  private refreshInterval: number | null = null;
  private currentQuoteIndex = 0;

  constructor() {
    this.engine = new CathedralDataEngine();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .logLevel("info")
        .enableHistory(false)
        .build(),
    );
  }

  private getRandomQuote() {
    this.currentQuoteIndex = (this.currentQuoteIndex + 1) % papalQuotes.length;
    return papalQuotes[this.currentQuoteIndex];
  }

  private renderHeader() {
    const now = new Date();
    console.log(ColorSystem.colorize("═".repeat(120), CatholicColors.gold));
    console.log(
      ColorSystem.colorize(
        `  ✟ OLD ST. JOSEPH CATHEDRAL - OKLAHOMA CITY ✟  │  ${now.toLocaleString()}`,
        ColorSystem.codes.bright,
      ),
    );
    console.log(ColorSystem.colorize("═".repeat(120), CatholicColors.gold));

    // Display rotating papal quote
    const quote = this.getRandomQuote();
    console.log("");
    console.log(
      `  ${ColorSystem.colorize(`"${quote.quote}"`, CatholicColors.white)}`,
    );
    console.log(
      `  ${ColorSystem.colorize(`— ${quote.pope}`, CatholicColors.purple)}`,
    );
    console.log("");
  }

  private renderMetricsBar() {
    const metrics = this.engine.getLiveMetrics();

    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.gold));
    const metricsLine = [
      `Mass Attendance: ${ColorSystem.colorize(String(metrics.totalMassAttendance), CatholicColors.white)}`,
      `Livestream: ${ColorSystem.colorize(String(metrics.totalLivestreamViewers), CatholicColors.blue)}`,
      `Prayer Intentions: ${ColorSystem.colorize(String(metrics.activePrayerIntentions), CatholicColors.purple)}`,
      `Donations Today: ${ColorSystem.colorize(Formatter.currency(metrics.donationsToday), CatholicColors.gold)}`,
      `Active Ministries: ${ColorSystem.colorize(String(metrics.activeMinistries), CatholicColors.green)}`,
      `Parish Families: ${ColorSystem.colorize(String(metrics.parishFamilies), CatholicColors.red)}`,
    ].join("  │  ");

    console.log(`  ${metricsLine}`);
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.gold));
  }

  private renderMassSchedule() {
    const masses = this.engine.getMasses();

    console.log("");
    console.log(ColorSystem.colorize("  HOLY MASS SCHEDULE & ATTENDANCE", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      masses.map((m) => ({
        time: m.time,
        type: m.type,
        celebrant: m.celebrant,
        language: m.language,
        attendance: m.attendance,
        expected: m.expectedAttendance,
        livestream: m.livestreamViewers,
        music: m.musicMinistry,
        sacraments: m.sacraments.join(", ") || "—",
      })),
      [
        { key: "time", label: "Time", width: 10 },
        { key: "type", label: "Type", width: 14 },
        { key: "celebrant", label: "Celebrant", width: 20 },
        { key: "language", label: "Lang", width: 8 },
        {
          key: "attendance",
          label: "Present",
          width: 8,
          align: "right",
          formatter: (val: number) => ColorSystem.colorize(String(val), CatholicColors.white),
        },
        { key: "expected", label: "Expected", width: 9, align: "right" },
        {
          key: "livestream",
          label: "Online",
          width: 7,
          align: "right",
          formatter: (val: number) => ColorSystem.colorize(String(val), CatholicColors.blue),
        },
        { key: "music", label: "Music Ministry", width: 22 },
        {
          key: "sacraments",
          label: "Sacraments",
          width: 14,
          formatter: (val: string) =>
            val === "—" ? val : ColorSystem.colorize(val, CatholicColors.gold),
        },
      ],
      { showIndex: false },
    );
  }

  private renderSacraments() {
    const sacraments = this.engine.getSacraments();

    console.log("");
    console.log(ColorSystem.colorize("  SACRAMENTAL LIFE", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      sacraments.map((s) => ({
        type: s.type,
        participant: s.participant,
        minister: s.minister,
        date: s.date.toLocaleDateString(),
        time: s.date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status: s.status,
        family: s.familyAttendees,
      })),
      [
        {
          key: "type",
          label: "Sacrament",
          width: 16,
          formatter: (val: string) => ColorSystem.colorize(val, CatholicColors.purple),
        },
        { key: "participant", label: "Participant(s)", width: 24 },
        { key: "minister", label: "Minister", width: 20 },
        { key: "date", label: "Date", width: 12 },
        { key: "time", label: "Time", width: 10 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (val: string) => {
            if (val === "Completed") return ColorSystem.colorize(val, CatholicColors.green);
            if (val === "In Progress") return ColorSystem.colorize(val, CatholicColors.gold);
            return ColorSystem.colorize(val, CatholicColors.blue);
          },
        },
        { key: "family", label: "Family", width: 7, align: "right" },
      ],
      { showIndex: false },
    );
  }

  private renderPrayerIntentions() {
    const intentions = this.engine.getPrayerIntentions().slice(0, 8);

    console.log("");
    console.log(ColorSystem.colorize("  PRAYER INTENTIONS", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      intentions.map((p) => ({
        type: p.type,
        source: p.source,
        submitted: p.submitted.toLocaleString(),
        status: p.status,
        anonymous: p.anonymous ? "Yes" : "No",
      })),
      [
        {
          key: "type",
          label: "Intention Type",
          width: 16,
          formatter: (val: string) => {
            const colors: Record<string, string> = {
              Personal: CatholicColors.blue,
              Community: CatholicColors.green,
              Global: CatholicColors.purple,
              Deceased: CatholicColors.white,
              Healing: CatholicColors.red,
              Thanksgiving: CatholicColors.gold,
            };
            return ColorSystem.colorize(val, colors[val] || ColorSystem.codes.white);
          },
        },
        { key: "source", label: "Source", width: 12 },
        { key: "submitted", label: "Submitted", width: 22 },
        {
          key: "status",
          label: "Status",
          width: 10,
          formatter: (val: string) =>
            val === "Prayed"
              ? ColorSystem.colorize(val, CatholicColors.green)
              : ColorSystem.colorize(val, CatholicColors.gold),
        },
        { key: "anonymous", label: "Anonymous", width: 10 },
      ],
      { showIndex: false },
    );

    const metrics = this.engine.getLiveMetrics();
    console.log("");
    console.log(
      `  ${ColorSystem.colorize(`Total Active Intentions: ${metrics.activePrayerIntentions}`, CatholicColors.purple)} - ${ColorSystem.colorize("We lift all intentions to our Heavenly Father", ColorSystem.codes.dim)}`,
    );
  }

  private renderVolunteers() {
    const volunteers = this.engine.getVolunteers();

    console.log("");
    console.log(ColorSystem.colorize("  VOLUNTEER MINISTRIES", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      volunteers.map((v) => ({
        volunteer: v.volunteer,
        ministry: v.ministry,
        role: v.role,
        area: v.serviceArea,
        hours: v.hoursThisMonth,
        status: v.status,
      })),
      [
        { key: "volunteer", label: "Volunteer", width: 20 },
        { key: "ministry", label: "Ministry", width: 22 },
        { key: "role", label: "Role", width: 20 },
        {
          key: "area",
          label: "Service Area",
          width: 14,
          formatter: (val: string) => {
            const colors: Record<string, string> = {
              Liturgy: CatholicColors.purple,
              Education: CatholicColors.blue,
              Outreach: CatholicColors.green,
              Maintenance: CatholicColors.gold,
              Administration: CatholicColors.white,
            };
            return ColorSystem.colorize(val, colors[val] || ColorSystem.codes.white);
          },
        },
        {
          key: "hours",
          label: "Hours/Mo",
          width: 9,
          align: "right",
          formatter: (val: number) => ColorSystem.colorize(String(val), CatholicColors.gold),
        },
        {
          key: "status",
          label: "Status",
          width: 10,
          formatter: (val: string) =>
            val === "Active"
              ? ColorSystem.colorize(val, CatholicColors.green)
              : ColorSystem.colorize(val, CatholicColors.blue),
        },
      ],
      { showIndex: false },
    );

    const totalHours = volunteers.reduce((sum, v) => sum + v.hoursThisMonth, 0);
    console.log("");
    console.log(
      `  ${ColorSystem.colorize(`Total Service Hours This Month: ${totalHours}`, CatholicColors.gold)} - ${ColorSystem.colorize("Thank you to our dedicated servants!", ColorSystem.codes.dim)}`,
    );
  }

  private renderDonations() {
    const donations = this.engine.getDonations().slice(0, 6);
    const metrics = this.engine.getLiveMetrics();

    console.log("");
    console.log(ColorSystem.colorize("  STEWARDSHIP & DONATIONS", ColorSystem.codes.bright));
    console.log("");

    console.log(
      `  Today's Donations: ${ColorSystem.colorize(Formatter.currency(metrics.donationsToday), CatholicColors.gold)}`,
    );
    console.log("");

    TableRenderer.render(
      donations.map((d) => ({
        time: d.timestamp.toLocaleTimeString(),
        amount: d.amount,
        type: d.type,
        method: d.method,
        designation: d.designation,
        anonymous: d.anonymous ? "Yes" : "No",
      })),
      [
        { key: "time", label: "Time", width: 12 },
        {
          key: "amount",
          label: "Amount",
          width: 12,
          align: "right",
          formatter: (val: number) => ColorSystem.colorize(Formatter.currency(val), CatholicColors.gold),
        },
        { key: "type", label: "Type", width: 18 },
        { key: "method", label: "Method", width: 10 },
        { key: "designation", label: "Designation", width: 18 },
        { key: "anonymous", label: "Anonymous", width: 10 },
      ],
      { showIndex: false },
    );

    // Donation distribution chart
    const donationsByType: Record<string, number> = {};
    this.engine.getDonations().forEach((d) => {
      donationsByType[d.type] = (donationsByType[d.type] || 0) + d.amount;
    });

    console.log("");
    console.log(ColorSystem.colorize("  DONATION DISTRIBUTION", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      Object.entries(donationsByType)
        .map(([type, amount]) => ({
          label: type,
          value: Math.round(amount),
        }))
        .sort((a, b) => b.value - a.value),
      {
        showValues: true,
        width: 50,
        color: CatholicColors.gold,
      },
    );
  }

  private renderAlerts() {
    const alerts = this.engine.getAlerts().slice(0, 6);

    if (alerts.length === 0) {
      return;
    }

    console.log("");
    console.log(ColorSystem.colorize("  CATHEDRAL NOTIFICATIONS", ColorSystem.codes.bright));
    console.log("");

    alerts.forEach((alert) => {
      const icon =
        alert.type === "urgent"
          ? "✟"
          : alert.type === "celebration"
          ? "✨"
          : alert.type === "warning"
          ? "⚠"
          : "ℹ";
      const color =
        alert.liturgicalColor ||
        (alert.type === "urgent"
          ? CatholicColors.red
          : alert.type === "celebration"
          ? CatholicColors.gold
          : alert.type === "warning"
          ? CatholicColors.purple
          : CatholicColors.blue);
      const time = alert.timestamp.toLocaleTimeString();

      console.log(
        `  ${icon} ${ColorSystem.colorize(time, ColorSystem.codes.dim)} ${ColorSystem.colorize(alert.message, color)}`,
      );
    });
  }

  private renderEvents() {
    const events = this.engine.getEvents();

    console.log("");
    console.log(ColorSystem.colorize("  CATHEDRAL EVENTS & ACTIVITIES", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      events.map((e) => ({
        event: e.name,
        type: e.type,
        location: e.location,
        time: e.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        participants: e.participants,
        coordinator: e.coordinator,
        status: e.status,
      })),
      [
        { key: "event", label: "Event", width: 24 },
        {
          key: "type",
          label: "Type",
          width: 12,
          formatter: (val: string) => {
            const colors: Record<string, string> = {
              Liturgy: CatholicColors.purple,
              Education: CatholicColors.blue,
              Social: CatholicColors.green,
              Outreach: CatholicColors.gold,
              "Prayer Group": CatholicColors.white,
            };
            return ColorSystem.colorize(val, colors[val] || ColorSystem.codes.white);
          },
        },
        { key: "location", label: "Location", width: 24 },
        { key: "time", label: "Time", width: 10 },
        { key: "participants", label: "Attend", width: 7, align: "right" },
        { key: "coordinator", label: "Coordinator", width: 20 },
        {
          key: "status",
          label: "Status",
          width: 12,
          formatter: (val: string) => {
            if (val === "In Progress") return ColorSystem.colorize(val, CatholicColors.gold);
            if (val === "Completed") return ColorSystem.colorize(val, CatholicColors.green);
            return ColorSystem.colorize(val, CatholicColors.blue);
          },
        },
      ],
      { showIndex: false },
    );
  }

  private async renderDashboard() {
    console.clear();
    this.renderHeader();
    this.renderMetricsBar();

    this.renderMassSchedule();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderSacraments();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderPrayerIntentions();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderVolunteers();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderDonations();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderEvents();
    console.log("");
    console.log(ColorSystem.colorize("─".repeat(120), CatholicColors.purple));

    this.renderAlerts();
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(120), CatholicColors.gold));
    console.log(
      ColorSystem.colorize(
        "  Press Ctrl+C to exit  │  Dashboard auto-refreshes every 8 seconds  │  Ad Maiorem Dei Gloriam ✟",
        ColorSystem.codes.dim,
      ),
    );
    console.log(ColorSystem.colorize("═".repeat(120), CatholicColors.gold));
  }

  async start() {
    // Show banner
    console.clear();
    BannerRenderer.render({
      title: "✟ OLD ST. JOSEPH CATHEDRAL ✟",
      subtitle: "Oklahoma City's Historic Catholic Heart - Real-Time Dashboard",
      description:
        "Live tracking of Mass, Sacraments, Prayer Intentions, Ministries & Community Life",
      version: "Cathedral Operations v1.0",
      author: "Archdiocese of Oklahoma City",
      width: 120,
      style: "double",
      color: CatholicColors.gold,
    });

    console.log("");
    BoxRenderer.render(
      [
        "Welcome to Old St. Joseph Cathedral - Oklahoma City's Mother Church",
        "",
        "Founded in 1905, Old St. Joseph Cathedral has been the spiritual home",
        "for generations of faithful Catholics in Oklahoma City. This dashboard",
        "provides real-time monitoring of our sacred ministries:",
        "",
        "  ✟ Holy Mass celebrations and attendance",
        "  ✟ Sacramental life and celebrations",
        "  ✟ Prayer intentions from our community",
        "  ✟ Volunteer ministries and service hours",
        "  ✟ Stewardship and charitable giving",
        "  ✟ Cathedral events and activities",
        "",
        ColorSystem.colorize('"The Eucharist is the heart of the Church."', CatholicColors.purple),
        ColorSystem.colorize("— Pope Benedict XVI", CatholicColors.gold),
        "",
        "Data refreshes automatically to keep you connected with parish life.",
      ],
      {
        title: "Cathedral Overview",
        style: "rounded",
        color: CatholicColors.purple,
        padding: 1,
      },
    );

    console.log("");
    const spinner = new Spinner({
      message: "Initializing cathedral operations system...",
      frames: ["✟", "✝", "†", "✞"],
      interval: 150,
    });
    spinner.start();
    await sleep(2000);
    spinner.succeed("Cathedral systems ready - All glory to God!");

    console.log("");
    this.logger.success("Starting live cathedral dashboard...");
    await sleep(1500);

    // Start real-time simulation
    this.engine.startRealtimeSimulation();

    // Set up auto-refresh (every 8 seconds)
    this.refreshInterval = setInterval(() => {
      this.renderDashboard();
    }, 8000);

    // Initial render
    this.renderDashboard();

    // Setup update listener
    this.engine.onUpdate(() => {
      // Dashboard will refresh on interval
    });
  }

  stop() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    this.engine.stopRealtimeSimulation();
  }
}

// ============================================================================
// Main Application
// ============================================================================

async function main() {
  const dashboard = new CathedralDashboard();

  // Handle graceful shutdown
  const handleShutdown = () => {
    console.log("\n");
    BoxRenderer.render(
      [
        "Closing cathedral dashboard...",
        "",
        ColorSystem.colorize('"May the Lord bless you and keep you."', CatholicColors.white),
        ColorSystem.colorize("— Numbers 6:24", CatholicColors.purple),
        "",
        "Session ended at " + new Date().toLocaleString(),
        "",
        "Thank you for serving Old St. Joseph Cathedral!",
        ColorSystem.colorize("✟ Ad Maiorem Dei Gloriam ✟", CatholicColors.gold),
      ],
      {
        title: "God Bless You",
        style: "double",
        color: CatholicColors.gold,
        padding: 1,
      },
    );
    dashboard.stop();
    Deno.exit(0);
  };

  Deno.addSignalListener("SIGINT", handleShutdown);
  Deno.addSignalListener("SIGTERM", handleShutdown);

  await dashboard.start();
}

// Run the application
if (import.meta.main) {
  await main();
}
