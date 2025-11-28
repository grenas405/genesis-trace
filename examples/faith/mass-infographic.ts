#!/usr/bin/env -S deno run --allow-env

/**
 * Catholic Mass Infographic
 *
 * A GenesisTrace visualization of the four major movements of the Holy Mass,
 * highlighting liturgical colors, prayer postures, and key ritual moments.
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConsoleStyler,
  Formatter,
  TableRenderer,
} from "../../mod.ts";

const CatholicColors = {
  purple: ColorSystem.hexToRgb("#5B2C6F"), // penitential preparation
  gold: ColorSystem.hexToRgb("#F7C948"), // glory of the Eucharist
  white: ColorSystem.hexToRgb("#F5F7FA"), // purity and solemn feasts
  red: ColorSystem.hexToRgb("#B91C1C"), // Holy Spirit and mission
  green: ColorSystem.hexToRgb("#2F855A"), // growth in Ordinary Time
  blue: ColorSystem.hexToRgb("#1D4ED8"), // Marian devotion
};

type MassPart = {
  name: string;
  icon: string;
  focus: string;
  theme: string;
  scripture: string;
  posture: string;
  sacredSign: string;
  grace: string;
  keyMoments: string[];
  color: string;
  liturgicalTone: string;
  duration: number;
};

const massParts: MassPart[] = [
  {
    name: "Introductory Rites",
    icon: "🕯️",
    focus: "We gather, invoke the Trinity, and ask for mercy.",
    theme: "Gather & Prepare",
    scripture: "Psalm 122:1 • \"Let us go to the house of the Lord.\"",
    posture: "Standing",
    sacredSign: "Sign of the Cross & veneration of the altar",
    grace: "Unity of the assembly and contrite hearts",
    keyMoments: [
      "Entrance Chant & Procession",
      "Sign of the Cross and Greeting",
      "Penitential Act & Kyrie",
      "Gloria (outside Advent/Lent)",
      "Collect (Opening Prayer)",
    ],
    color: CatholicColors.purple,
    liturgicalTone: "Purple • Humble preparation",
    duration: 8,
  },
  {
    name: "Liturgy of the Word",
    icon: "📖",
    focus: "God speaks through Scripture; the faithful respond in faith.",
    theme: "Listen & Respond",
    scripture: "Nehemiah 8:8 • \"They read from the book of the law of God.\"",
    posture: "Sitting (readings) • Standing (Gospel & Creed)",
    sacredSign: "Book of the Gospels raised in procession",
    grace: "Faith comes from hearing the Word proclaimed",
    keyMoments: [
      "First Reading",
      "Responsorial Psalm",
      "Second Reading",
      "Gospel Acclamation & Gospel",
      "Homily",
      "Creed & Prayer of the Faithful",
    ],
    color: CatholicColors.green,
    liturgicalTone: "Green • Growth in discipleship",
    duration: 25,
  },
  {
    name: "Liturgy of the Eucharist",
    icon: "🕊️",
    focus: "Bread and wine become the Body and Blood of Christ.",
    theme: "Offer & Receive",
    scripture: "Luke 22:19-20 • The Last Supper narrative",
    posture: "Sitting, then standing and kneeling in adoration",
    sacredSign: "Altar, paten, chalice, and incense",
    grace: "Communion with Christ’s sacrifice made present",
    keyMoments: [
      "Preparation of the Gifts",
      "Eucharistic Prayer",
      "Sanctus & Mystery of Faith",
      "Lord's Prayer & Sign of Peace",
      "Lamb of God",
      "Holy Communion",
    ],
    color: CatholicColors.gold,
    liturgicalTone: "Gold/White • Glory of the Eucharist",
    duration: 30,
  },
  {
    name: "Concluding Rites",
    icon: "🌍",
    focus: "The community is blessed and sent to evangelize.",
    theme: "Commission & Witness",
    scripture: "Matthew 28:19-20 • \"Go and make disciples.\"",
    posture: "Standing and processing out",
    sacredSign: "Blessing, final Sign of the Cross, recessional",
    grace: "Missionary zeal fueled by the Eucharist",
    keyMoments: [
      "Brief announcements",
      "Blessing",
      "Dismissal",
      "Recessional hymn or chant",
    ],
    color: CatholicColors.red,
    liturgicalTone: "Red • Spirit-driven mission",
    duration: 5,
  },
];

const totalMinutes = massParts.reduce((sum, part) => sum + part.duration, 0);

console.clear();
console.log("\n");

BannerRenderer.render({
  title: "✟ THE HOLY MASS ✟",
  subtitle: "Visual Infographic of Sacred Movements",
  description: "GenesisTrace liturgical visualization • Introductory Rites → Dismissal",
  width: 96,
  author: "GenesisTrace Liturgical Studio",
  color: CatholicColors.gold,
});
console.log("\n");

ConsoleStyler.logBrand(
  "Catholic liturgical colors anchor each movement of the Mass.",
  "#b5651d",
  {
    palette: ["purple", "green", "white/gold", "red"],
    invitation: "Pray with the Church’s rhythm",
  },
);
console.log("\n");

ConsoleStyler.logSection("Liturgical Color Palette", "brightYellow", "double");
renderColorPalette();

ConsoleStyler.logSection("Sacred Flow of the Mass", "brightMagenta", "heavy");
renderFlow(massParts);

ConsoleStyler.logSection("Part-by-Part Infographic", "brightCyan");
massParts.forEach((part) => renderPartDetail(part));

ConsoleStyler.logSection("Participation Snapshot", "brightGreen");
renderParticipationTable(massParts);

BoxRenderer.render(
  [
    ColorSystem.colorize("Preparation:", CatholicColors.purple) +
      " Arrive early, recollect, offer intentions.",
    ColorSystem.colorize("Listening:", CatholicColors.green) +
      " Let the Word cut into daily life; respond from the heart.",
    ColorSystem.colorize("Eucharistic amazement:", CatholicColors.gold) +
      " Gaze upon the altar with reverence, kneel in adoration.",
    ColorSystem.colorize("Mission:", CatholicColors.red) +
      " Carry Christ into workplaces, families, and neighborhoods.",
    "",
    `${ColorSystem.colorize("Tip:", CatholicColors.blue)} Bring a missal or follow parish worship aids.`,
  ],
  {
    title: "Living the Mass Beyond the Walls",
    style: "rounded",
    color: CatholicColors.blue,
    maxWidth: 96,
    padding: 1,
  },
);

console.log("\n" + ColorSystem.colorize(`Total estimated duration: ${totalMinutes} minutes`, CatholicColors.white));
console.log(
  ColorSystem.colorize("Ad Majorem Dei Gloriam • Go forth in peace!", CatholicColors.gold),
);

function renderColorPalette() {
  BoxRenderer.render(
    [
      `${ColorSystem.colorize("Purple", CatholicColors.purple)} — Advent, Lent, repentance`,
      `${ColorSystem.colorize("Green", CatholicColors.green)} — Ordinary Time, growth, hope`,
      `${ColorSystem.colorize("White / Gold", CatholicColors.white)} — Easter, Christmas, solemnities`,
      `${ColorSystem.colorize("Red", CatholicColors.red)} — Spirit, martyrs, sending forth`,
      `${ColorSystem.colorize("Blue", CatholicColors.blue)} — Marian devotion and heavenly trust`,
    ],
    {
      style: "double",
      color: CatholicColors.gold,
      padding: 1,
      maxWidth: 88,
      title: "Liturgical Hues",
    },
  );
  console.log();
}

function renderFlow(parts: MassPart[]) {
  const maxName = Math.max(...parts.map((part) => part.name.length));
  const maxDuration = Math.max(...parts.map((part) => part.duration));
  parts.forEach((part) => {
    const paddedName = Formatter.pad(`${part.icon} ${part.name}`, maxName + 4);
    const proportion = Math.max(6, Math.round((part.duration / maxDuration) * 34));
    const bar = ColorSystem.colorize("█".repeat(proportion), part.color);
    const minutes = Formatter.pad(`${part.duration} min`, 7);
    console.log(`${ColorSystem.colorize(paddedName, part.color)}${bar} ${minutes} ${part.theme}`);
  });
  console.log(
    ColorSystem.colorize(`Sacred rhythm across ~${totalMinutes} minutes`, CatholicColors.blue),
  );
  console.log();
}

function renderPartDetail(part: MassPart) {
  const lines = [
    `${ColorSystem.colorize("Focus:", part.color)} ${part.focus}`,
    `${ColorSystem.colorize("Theme:", CatholicColors.white)} ${part.theme}`,
    "",
    ColorSystem.colorize("Key Moments:", CatholicColors.gold),
    ...part.keyMoments.map((moment) => `  • ${moment}`),
    "",
    `${ColorSystem.colorize("Scripture Echo:", CatholicColors.green)} ${part.scripture}`,
    `${ColorSystem.colorize("Posture:", CatholicColors.blue)} ${part.posture}`,
    `${ColorSystem.colorize("Sacred Sign:", CatholicColors.white)} ${part.sacredSign}`,
    `${ColorSystem.colorize("Grace:", CatholicColors.red)} ${part.grace}`,
  ];

  BoxRenderer.render(lines, {
    title: `${part.icon} ${part.name}`,
    style: "bold",
    color: part.color,
    maxWidth: 96,
    padding: 1,
    margin: 1,
  });
  console.log();
}

function renderParticipationTable(parts: MassPart[]) {
  TableRenderer.render(
    parts.map((part) => ({
      part: part.name,
      movement: part.theme,
      posture: part.posture,
      color: ColorSystem.colorize(part.liturgicalTone, part.color),
    })),
    [
      { key: "part", label: "Mass Part", width: 22 },
      { key: "movement", label: "Spiritual Movement", width: 24 },
      { key: "posture", label: "Prayer Posture", width: 26 },
      { key: "color", label: "Liturgical Tone", width: 24 },
    ],
    { showIndex: true },
  );
  console.log();
}
