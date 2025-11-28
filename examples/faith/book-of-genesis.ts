#!/usr/bin/env -S deno run --allow-env

/**
 * The Book of Genesis - First Book of the Catholic Bible
 *
 * A comprehensive GenesisTrace demonstration walking through the major
 * narratives of Genesis, from Creation to the death of Joseph in Egypt.
 *
 * Features:
 *   - Animated creation sequence (7 days)
 *   - Progressive revelation of the Patriarchs
 *   - Tables of genealogies and covenants
 *   - Boxes with key Scripture passages
 *   - Spinner animations for dramatic moments
 *   - Color gradients for divine interventions
 *
 * Run with:
 *    deno run --allow-env examples/faith/book-of-genesis.ts
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
  ColorSystem,
  ConfigBuilder,
  ConsoleStyler,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

console.clear();
console.log("\n");

// =============================================================================
// 1. GENESIS BANNER - "IN THE BEGINNING"
// =============================================================================

BannerRenderer.render({
  title: "GENESIS",
  subtitle: "Βερεσιτ - In the Beginning",
  description: "The First Book of Moses - Foundation of Sacred Scripture",
  version: "liber-primus",
  author: "GenesisTrace Sacred Scripture Studio",
  width: 98,
  color: ColorSystem.hexToRgb("#4B0082"), // Deep indigo - primordial mystery
});
console.log("\n");

// =============================================================================
// 2. INTRODUCTION TO GENESIS
// =============================================================================

ConsoleStyler.logSection("The Book of Origins", "brightCyan", "double");

BoxRenderer.render(
  [
    "Genesis (Greek: Γένεσις, 'origin' or 'birth')",
    "Hebrew: בְּרֵאשִׁית (Bereshit, 'In the beginning')",
    "",
    "The first book of the Torah and the Christian Bible,",
    "Genesis reveals the origin of the cosmos, humanity, sin,",
    "and God's covenant relationship with His chosen people.",
    "",
    "From the creation of light to the death of Joseph in Egypt,",
    "Genesis spans approximately 2,300 years of salvation history.",
  ],
  {
    style: "double",
    title: "Liber Genesis",
    padding: 1,
    color: ColorSystem.hexToRgb("#6A5ACD"), // Slate blue
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 3. THE SEVEN DAYS OF CREATION (Genesis 1:1-2:3)
// =============================================================================

ConsoleStyler.logSection("The Seven Days of Creation", "brightYellow");

const creationLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

BoxRenderer.render(
  [
    '"In the beginning, God created the heavens and the earth.',
    "The earth was without form and void, and darkness was over",
    "the face of the deep. And the Spirit of God was hovering",
    'over the face of the waters." - Genesis 1:1-2',
  ],
  {
    style: "double",
    title: "Bereshit - In the Beginning",
    padding: 1,
    color: ColorSystem.hexToRgb("#000080"), // Navy - primordial darkness
    maxWidth: 94,
  },
);
console.log("\n");

const creationDays = [
  {
    day: "Day 1",
    hebrew: "Yom Echad",
    created: "Light separated from darkness",
    word: '"Let there be light"',
    result: "Day and Night",
  },
  {
    day: "Day 2",
    hebrew: "Yom Sheni",
    created: "Sky (firmament) separating waters",
    word: '"Let there be an expanse"',
    result: "Heaven and waters divided",
  },
  {
    day: "Day 3",
    hebrew: "Yom Shlishi",
    created: "Dry land, seas, and vegetation",
    word: '"Let the earth sprout vegetation"',
    result: "Land, seas, plants, trees",
  },
  {
    day: "Day 4",
    hebrew: "Yom Revi'i",
    created: "Sun, moon, and stars",
    word: '"Let there be lights in the expanse"',
    result: "Seasons, days, years",
  },
  {
    day: "Day 5",
    hebrew: "Yom Chamishi",
    created: "Fish and birds",
    word: '"Let the waters swarm with living creatures"',
    result: "Sea creatures and birds",
  },
  {
    day: "Day 6",
    hebrew: "Yom Shishi",
    created: "Land animals and humanity",
    word: '"Let us make man in our image"',
    result: "Animals, Adam and Eve",
  },
  {
    day: "Day 7",
    hebrew: "Yom Shevi'i",
    created: "God rested and blessed the Sabbath",
    word: "God hallowed the seventh day",
    result: "Holy Sabbath",
  },
];

const creationSpinner = new Spinner({
  message: "God speaks creation into being...",
  frames: ["✦", "✧", "✦", "✧"],
  interval: 150,
});

creationSpinner.start();
await sleep(800);

const creationBar = new ProgressBar({
  total: creationDays.length,
  width: 50,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

console.log("The Seven Days of Creation:\n");

for (let i = 0; i < creationDays.length; i++) {
  const day = creationDays[i];
  creationSpinner.update(`${day.day}: ${day.created}`);
  creationBar.update(i + 1);
  creationLogger.info(`${day.day} - ${day.result}`, {
    hebrew: day.hebrew,
    divine_word: day.word,
  });
  await sleep(600);
}

creationSpinner.succeed("And God saw that it was very good");
creationBar.complete();
console.log("\n");

TableRenderer.render(
  creationDays,
  [
    { key: "day", label: "Day", width: 10 },
    { key: "hebrew", label: "Hebrew", width: 14 },
    { key: "created", label: "Created", width: 30 },
    { key: "result", label: "Result", width: 28 },
  ],
  { showIndex: false },
);
console.log("\n");

// =============================================================================
// 4. THE CREATION OF HUMANITY (Genesis 1:26-27, 2:7)
// =============================================================================

ConsoleStyler.logSection("Imago Dei - The Image of God", "brightMagenta");

BoxRenderer.render(
  [
    '"Then God said, \'Let us make man in our image, after our likeness.\'',
    "So God created man in his own image,",
    "in the image of God he created him;",
    'male and female he created them." - Genesis 1:26-27',
    "",
    '"Then the LORD God formed the man of dust from the ground',
    "and breathed into his nostrils the breath of life,",
    'and the man became a living creature." - Genesis 2:7',
  ],
  {
    style: "double",
    title: "The Crown of Creation",
    padding: 1,
    color: ColorSystem.hexToRgb("#FF1493"), // Deep pink - divine breath
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 5. THE FALL (Genesis 3)
// =============================================================================

ConsoleStyler.logSection("The Fall of Humanity", "brightRed");

const fallLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

BoxRenderer.render(
  [
    "The serpent, more crafty than any beast of the field,",
    'tempted Eve: "Did God actually say...?"',
    "",
    "Eve ate of the forbidden fruit and gave some to Adam.",
    "Their eyes were opened, and they knew they were naked.",
    "",
    "God pronounced judgment: pain in childbirth, toil in work,",
    "and death as the consequence of disobedience.",
    "",
    'Yet God promised a Redeemer: "He shall bruise your head" (Gen 3:15)',
  ],
  {
    style: "double",
    title: "Original Sin - The Protoevangelium",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"), // Dark red - sin and judgment
    maxWidth: 94,
  },
);
console.log("\n");

const fallSpinner = new Spinner({
  message: "The serpent approaches...",
  frames: ["~", "≈", "~", "≈"],
  interval: 200,
});

fallSpinner.start();
await sleep(800);
fallSpinner.update("Eve is tempted...");
await sleep(800);
fallSpinner.update("Adam joins in the transgression...");
await sleep(800);
fallSpinner.update("Their eyes are opened to good and evil...");
await sleep(800);
fallSpinner.fail("Sin enters the world");
console.log("\n");

// =============================================================================
// 6. CAIN AND ABEL (Genesis 4:1-16)
// =============================================================================

ConsoleStyler.logSection("Cain and Abel", "brightYellow");

BoxRenderer.render(
  [
    "Cain, a tiller of the ground, brought an offering of fruit.",
    "Abel, a keeper of sheep, brought the firstborn of his flock.",
    "",
    "The LORD had regard for Abel and his offering,",
    "but for Cain and his offering he had no regard.",
    "",
    'Cain, consumed with anger, killed his brother.',
    'God asked, "Where is Abel your brother?"',
    'Cain replied, "Am I my brother\'s keeper?"',
    "",
    "Cain was cursed to wander the earth as a fugitive.",
  ],
  {
    style: "double",
    title: "The First Murder",
    padding: 1,
    color: ColorSystem.hexToRgb("#DC143C"), // Crimson - blood of Abel
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 7. NOAH AND THE FLOOD (Genesis 6-9)
// =============================================================================

ConsoleStyler.logSection("Noah and the Great Flood", "brightBlue");

const noahLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

BoxRenderer.render(
  [
    '"The LORD saw that the wickedness of man was great in the earth,',
    "and that every intention of the thoughts of his heart",
    'was only evil continually." - Genesis 6:5',
    "",
    '"But Noah found favor in the eyes of the LORD."',
    "",
    "God commanded Noah to build an ark of gopher wood,",
    "to save his family and two of every living creature",
    "from the flood that would destroy the earth.",
  ],
  {
    style: "double",
    title: "The Righteous Man",
    padding: 1,
    color: ColorSystem.hexToRgb("#1E90FF"), // Dodger blue - waters of judgment
    maxWidth: 94,
  },
);
console.log("\n");

const floodEvents = [
  { event: "God commands Noah to build the ark", reference: "Genesis 6:13-14" },
  { event: "Noah enters the ark with his family", reference: "Genesis 7:7" },
  { event: "The fountains of the deep burst forth", reference: "Genesis 7:11" },
  { event: "The waters prevail 150 days", reference: "Genesis 7:24" },
  { event: "The ark rests on Mount Ararat", reference: "Genesis 8:4" },
  { event: "Noah sends out a raven and a dove", reference: "Genesis 8:7-8" },
  { event: "The dove returns with an olive leaf", reference: "Genesis 8:11" },
  { event: "Noah and his family leave the ark", reference: "Genesis 8:18" },
  { event: "God establishes a covenant with Noah", reference: "Genesis 9:9" },
  { event: "The rainbow as a sign of the covenant", reference: "Genesis 9:13" },
];

const floodSpinner = new Spinner({
  message: "The floodwaters rise...",
  frames: ["≈≈≈", "~~~", "≈≈≈", "~~~"],
  interval: 200,
});

floodSpinner.start();
await sleep(600);

const floodBar = new ProgressBar({
  total: floodEvents.length,
  width: 48,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

for (let i = 0; i < floodEvents.length; i++) {
  const event = floodEvents[i];
  floodSpinner.update(event.event);
  floodBar.update(i + 1);
  noahLogger.info(event.event, { reference: event.reference });
  await sleep(500);
}

floodSpinner.succeed("God establishes His covenant with creation");
floodBar.complete();
console.log("\n");

BoxRenderer.render(
  [
    '"I establish my covenant with you, that never again shall',
    "all flesh be cut off by the waters of the flood,",
    'and never again shall there be a flood to destroy the earth."',
    "",
    '"I have set my bow in the cloud, and it shall be a sign',
    'of the covenant between me and the earth." - Genesis 9:11, 13',
  ],
  {
    style: "double",
    title: "The Noahic Covenant",
    padding: 1,
    color: ColorSystem.hexToRgb("#00CED1"), // Dark turquoise - rainbow
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 8. THE TOWER OF BABEL (Genesis 11:1-9)
// =============================================================================

ConsoleStyler.logSection("The Tower of Babel", "brightWhite");

BoxRenderer.render(
  [
    "Now the whole earth had one language and the same words.",
    "",
    'The people said, "Come, let us build ourselves a city',
    "and a tower with its top in the heavens, and let us make",
    'a name for ourselves, lest we be dispersed."',
    "",
    'The LORD said, "Behold, they are one people, and they have',
    "all one language, and this is only the beginning of what they will do.",
    'Come, let us go down and confuse their language."',
    "",
    "So the LORD dispersed them over the face of all the earth.",
  ],
  {
    style: "double",
    title: "Human Pride and Divine Judgment",
    padding: 1,
    color: ColorSystem.hexToRgb("#A9A9A9"), // Dark gray - confusion
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 9. THE PATRIARCHS - ABRAHAM, ISAAC, JACOB, JOSEPH
// =============================================================================

ConsoleStyler.logSection("The Patriarchs", "brightGreen");

const patriarchs = [
  {
    name: "Abraham",
    hebrew: "אַבְרָהָם (Avraham)",
    meaning: "Father of many nations",
    covenant: "God promises land, descendants, and blessing to all nations",
    keyEvent: "The sacrifice of Isaac (Genesis 22)",
    reference: "Genesis 12-25",
  },
  {
    name: "Isaac",
    hebrew: "יִצְחָק (Yitzhak)",
    meaning: "He laughs",
    covenant: "Reaffirmation of Abrahamic covenant",
    keyEvent: "Marriage to Rebekah, birth of Jacob and Esau",
    reference: "Genesis 21-35",
  },
  {
    name: "Jacob",
    hebrew: "יַעֲקֹב (Ya'akov)",
    meaning: "He grasps the heel / supplanter",
    covenant: "Renamed Israel after wrestling with God",
    keyEvent: "Jacob's ladder, wrestling with the angel",
    reference: "Genesis 25-50",
  },
  {
    name: "Joseph",
    hebrew: "יוֹסֵף (Yosef)",
    meaning: "He will add",
    covenant: "Preserves Israel in Egypt during famine",
    keyEvent: "Sold into slavery, becomes Pharaoh's vizier",
    reference: "Genesis 37-50",
  },
];

TableRenderer.render(
  patriarchs,
  [
    { key: "name", label: "Patriarch", width: 10 },
    { key: "hebrew", label: "Hebrew", width: 18 },
    { key: "covenant", label: "Covenant/Role", width: 38 },
    { key: "keyEvent", label: "Key Event", width: 26 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 10. ABRAHAM - THE CALL AND THE COVENANT (Genesis 12, 15, 17)
// =============================================================================

ConsoleStyler.logSection("Abraham - Father of Faith", "brightCyan");

BoxRenderer.render(
  [
    '"Now the LORD said to Abram, \'Go from your country',
    "and your kindred and your father's house to the land",
    "that I will show you. And I will make of you a great nation,",
    "and I will bless you and make your name great,",
    'so that you will be a blessing.\'" - Genesis 12:1-2',
    "",
    '"Look toward heaven, and number the stars, if you are able',
    'to number them... So shall your offspring be." - Genesis 15:5',
    "",
    "Abraham believed the LORD, and He counted it to him as righteousness.",
  ],
  {
    style: "double",
    title: "The Abrahamic Covenant",
    padding: 1,
    color: ColorSystem.hexToRgb("#DAA520"), // Goldenrod - promise
    maxWidth: 94,
  },
);
console.log("\n");

const abrahamSpinner = new Spinner({
  message: "Abraham journeys to Canaan...",
  frames: ["→", "↗", "↑", "↖", "←", "↙", "↓", "↘"],
  interval: 150,
});

abrahamSpinner.start();
await sleep(700);
abrahamSpinner.update("God appears to Abraham in a vision...");
await sleep(700);
abrahamSpinner.update("Abraham counts the stars...");
await sleep(700);
abrahamSpinner.update("God establishes His covenant...");
await sleep(700);
abrahamSpinner.succeed("Abraham is called the friend of God");
console.log("\n");

// =============================================================================
// 11. THE BINDING OF ISAAC (Genesis 22) - THE AKEDAH
// =============================================================================

ConsoleStyler.logSection("The Akedah - Binding of Isaac", "brightRed");

BoxRenderer.render(
  [
    '"After these things God tested Abraham and said to him,',
    '"Abraham!" And he said, "Here I am."',
    "",
    'He said, "Take your son, your only son Isaac, whom you love,',
    "and go to the land of Moriah, and offer him there as a",
    'burnt offering on one of the mountains of which I shall tell you."',
    "",
    "Abraham rose early in the morning, saddled his donkey,",
    "and took two of his young men with him, and his son Isaac.",
  ],
  {
    style: "double",
    title: "The Supreme Test of Faith",
    padding: 1,
    color: ColorSystem.hexToRgb("#8B0000"), // Dark red - sacrifice
    maxWidth: 94,
  },
);
console.log("\n");

const akedahSpinner = new Spinner({
  message: "Abraham prepares the altar...",
  frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"],
  interval: 180,
});

akedahSpinner.start();
await sleep(700);
akedahSpinner.update("Isaac asks, 'Where is the lamb?'");
await sleep(700);
akedahSpinner.update("Abraham binds Isaac upon the altar...");
await sleep(700);
akedahSpinner.update("The angel of the LORD calls from heaven...");
await sleep(700);
akedahSpinner.succeed('"Abraham! Do not lay your hand on the boy!"');
console.log("\n");

BoxRenderer.render(
  [
    '"Abraham lifted up his eyes and looked, and behold,',
    "behind him was a ram, caught in a thicket by his horns.",
    'And Abraham went and took the ram and offered it up as',
    'a burnt offering instead of his son." - Genesis 22:13',
    "",
    '"By myself I have sworn, declares the LORD, because you have done this',
    "and have not withheld your son, your only son, I will surely bless you,",
    'and I will surely multiply your offspring as the stars of heaven."',
  ],
  {
    style: "double",
    title: "God Provides - Yahweh Yireh",
    padding: 1,
    color: ColorSystem.hexToRgb("#FFD700"), // Gold - divine provision
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 12. JACOB'S LADDER (Genesis 28:10-22)
// =============================================================================

ConsoleStyler.logSection("Jacob's Ladder", "brightMagenta");

BoxRenderer.render(
  [
    "Jacob left Beersheba and went toward Haran.",
    "He came to a certain place and stayed there that night,",
    "because the sun had set. Taking one of the stones of the place,",
    "he put it under his head and lay down in that place to sleep.",
    "",
    '"And he dreamed, and behold, there was a ladder set up on the earth,',
    "and the top of it reached to heaven. And behold, the angels of God",
    'were ascending and descending on it!" - Genesis 28:12',
  ],
  {
    style: "double",
    title: "The Gate of Heaven",
    padding: 1,
    color: ColorSystem.hexToRgb("#BA55D3"), // Medium orchid - heavenly vision
    maxWidth: 94,
  },
);
console.log("\n");

const ladderFrames = [
  "     |",
  "    =|=",
  "   ==|==",
  "  ===|===",
  " ====|====",
  "=====|=====",
  " ====|====",
  "  ===|===",
  "   ==|==",
  "    =|=",
];

console.log("Angels ascending and descending:\n");
for (let i = 0; i < 20; i++) {
  const frame = ladderFrames[i % ladderFrames.length];
  const coloredFrame = ColorSystem.colorize(frame, ColorSystem.codes.brightMagenta);
  Deno.stdout.writeSync(encoder.encode(`\r${coloredFrame}`));
  await sleep(180);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(40) + "\r"));
console.log(
  ColorSystem.colorize(
    '"How awesome is this place! This is none other than the house of God."',
    ColorSystem.codes.brightWhite,
  ),
);
console.log("\n");

// =============================================================================
// 13. JACOB WRESTLES WITH GOD (Genesis 32:22-32)
// =============================================================================

ConsoleStyler.logSection("Jacob Wrestles with the Angel", "brightYellow");

BoxRenderer.render(
  [
    "Jacob was left alone. And a man wrestled with him until the breaking of the day.",
    "",
    'When the man saw that he did not prevail against Jacob, he said,',
    '"Let me go, for the day has broken."',
    "",
    'But Jacob said, "I will not let you go unless you bless me."',
    "",
    'And he said to him, "What is your name?" And he said, "Jacob."',
    "",
    'Then he said, "Your name shall no longer be called Jacob, but Israel,',
    'for you have striven with God and with men, and have prevailed."',
  ],
  {
    style: "double",
    title: "Israel - He Who Strives with God",
    padding: 1,
    color: ColorSystem.hexToRgb("#FF8C00"), // Dark orange - struggle
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 14. JOSEPH - FROM SLAVERY TO SECOND IN EGYPT (Genesis 37-50)
// =============================================================================

ConsoleStyler.logSection("Joseph - Savior of Israel", "brightBlue");

const josephLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

BoxRenderer.render(
  [
    "Joseph, the beloved son of Jacob, was sold into slavery",
    "by his jealous brothers for twenty shekels of silver.",
    "",
    "He was taken to Egypt, where he served in Potiphar's house,",
    "was falsely accused and imprisoned, yet remained faithful to God.",
    "",
    "Through divine wisdom, Joseph interpreted Pharaoh's dreams",
    "and was elevated to second-in-command over all Egypt,",
    "saving the nation from famine and reuniting with his family.",
  ],
  {
    style: "double",
    title: "From the Pit to the Palace",
    padding: 1,
    color: ColorSystem.hexToRgb("#4169E1"), // Royal blue - Pharaoh's court
    maxWidth: 94,
  },
);
console.log("\n");

const josephEvents = [
  { event: "Joseph dreams of sheaves and stars bowing to him", ref: "Gen 37:5-11" },
  { event: "His brothers sell him into slavery", ref: "Gen 37:28" },
  { event: "Joseph serves in Potiphar's house", ref: "Gen 39:1-6" },
  { event: "Joseph resists Potiphar's wife", ref: "Gen 39:7-20" },
  { event: "Joseph imprisoned, interprets dreams", ref: "Gen 40:1-23" },
  { event: "Joseph interprets Pharaoh's dreams", ref: "Gen 41:1-36" },
  { event: "Joseph becomes vizier of Egypt", ref: "Gen 41:37-45" },
  { event: "Joseph's brothers come to Egypt for grain", ref: "Gen 42:1-8" },
  { event: "Joseph reveals himself to his brothers", ref: "Gen 45:1-15" },
  { event: "Jacob and his family settle in Goshen", ref: "Gen 46:28-34" },
];

const josephSpinner = new Spinner({
  message: "Joseph's journey unfolds...",
  frames: ["◐", "◓", "◑", "◒"],
  interval: 150,
});

josephSpinner.start();

const josephBar = new ProgressBar({
  total: josephEvents.length,
  width: 48,
  showValue: false,
  showPercentage: true,
  colorize: true,
});

for (let i = 0; i < josephEvents.length; i++) {
  const event = josephEvents[i];
  josephSpinner.update(event.event);
  josephBar.update(i + 1);
  josephLogger.info(event.event, { reference: event.ref });
  await sleep(550);
}

josephSpinner.succeed("God's providence preserves Israel");
josephBar.complete();
console.log("\n");

BoxRenderer.render(
  [
    '"As for you, you meant evil against me,',
    "but God meant it for good, to bring it about that",
    'many people should be kept alive, as they are today." - Genesis 50:20',
    "",
    "Joseph forgave his brothers and saw God's hand",
    "in all the suffering and triumph of his life.",
  ],
  {
    style: "double",
    title: "Divine Providence",
    padding: 1,
    color: ColorSystem.hexToRgb("#20B2AA"), // Light sea green - reconciliation
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 15. THE COVENANTS OF GENESIS
// =============================================================================

ConsoleStyler.logSection("The Covenants of Genesis", "brightWhite");

const covenants = [
  {
    covenant: "Edenic",
    reference: "Genesis 2:15-17",
    parties: "God and Adam",
    sign: "Tree of Life",
    promise: "Life in obedience, death in disobedience",
  },
  {
    covenant: "Adamic",
    reference: "Genesis 3:15",
    parties: "God and humanity",
    sign: "Protoevangelium",
    promise: "A Redeemer will crush the serpent's head",
  },
  {
    covenant: "Noahic",
    reference: "Genesis 9:8-17",
    parties: "God and all creation",
    sign: "Rainbow",
    promise: "Never again will flood destroy the earth",
  },
  {
    covenant: "Abrahamic",
    reference: "Genesis 12, 15, 17",
    parties: "God and Abraham",
    sign: "Circumcision",
    promise: "Land, descendants, blessing to all nations",
  },
];

TableRenderer.render(
  covenants,
  [
    { key: "covenant", label: "Covenant", width: 12 },
    { key: "reference", label: "Reference", width: 18 },
    { key: "parties", label: "Parties", width: 18 },
    { key: "sign", label: "Sign", width: 16 },
    { key: "promise", label: "Promise", width: 28 },
  ],
  { showIndex: true },
);
console.log("\n");

// =============================================================================
// 16. KEY THEMES OF GENESIS
// =============================================================================

ConsoleStyler.logSection("Key Themes of Genesis", "brightGreen");

const themes = [
  { label: "Creation and Order", value: 10 },
  { label: "Fall and Sin", value: 9 },
  { label: "Promise and Covenant", value: 10 },
  { label: "Faith and Obedience", value: 9 },
  { label: "Providence and Sovereignty", value: 9 },
  { label: "Blessing and Curse", value: 8 },
  { label: "Election and Calling", value: 8 },
  { label: "Family and Lineage", value: 7 },
];

ChartRenderer.barChart(
  themes,
  {
    showValues: true,
    width: 45,
    color: ColorSystem.hexToRgb("#228B22"),
  },
);
console.log("\n");

// =============================================================================
// 17. THE GENEALOGY FROM ADAM TO JOSEPH
// =============================================================================

ConsoleStyler.logSection("The Genealogy - From Adam to Joseph", "brightCyan");

const genealogy = [
  { generation: "1", name: "Adam", meaning: "Man, humanity", lifespan: "930 years" },
  { generation: "2", name: "Seth", meaning: "Appointed", lifespan: "912 years" },
  { generation: "10", name: "Noah", meaning: "Rest", lifespan: "950 years" },
  { generation: "20", name: "Abraham", meaning: "Father of many", lifespan: "175 years" },
  { generation: "21", name: "Isaac", meaning: "Laughter", lifespan: "180 years" },
  { generation: "22", name: "Jacob/Israel", meaning: "Supplanter/Strives with God", lifespan: "147 years" },
  { generation: "23", name: "Joseph", meaning: "He will add", lifespan: "110 years" },
];

TableRenderer.render(
  genealogy,
  [
    { key: "generation", label: "Gen", width: 6 },
    { key: "name", label: "Name", width: 18 },
    { key: "meaning", label: "Meaning", width: 28 },
    { key: "lifespan", label: "Lifespan", width: 14 },
  ],
  { showIndex: false },
);
console.log("\n");

// =============================================================================
// 18. THE CONCLUSION OF GENESIS
// =============================================================================

ConsoleStyler.logSection("The End of Genesis", "brightMagenta");

BoxRenderer.render(
  [
    "Genesis concludes with the death of Joseph in Egypt.",
    "",
    '"Joseph said to his brothers, "I am about to die,',
    "but God will visit you and bring you up out of this land",
    "to the land that he swore to Abraham, to Isaac,",
    'and to Jacob." - Genesis 50:24',
    "",
    "Joseph lived 110 years and was embalmed and placed in a coffin in Egypt.",
    "His bones would later be carried to the Promised Land by Moses.",
    "",
    "Thus ends the first book of the Torah and Sacred Scripture.",
  ],
  {
    style: "double",
    title: "Joseph's Death and Promise",
    padding: 1,
    color: ColorSystem.hexToRgb("#9370DB"), // Medium purple - transition
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 19. THEOLOGICAL REFLECTION
// =============================================================================

ConsoleStyler.logSection("Theological Reflection", "brightYellow");

BoxRenderer.render(
  [
    "Genesis reveals the foundation of salvation history:",
    "",
    "• Creation from nothing by the Word of God",
    "• The dignity and fall of humanity",
    "• God's faithful covenant despite human sin",
    "• The election of Israel as a light to the nations",
    "• The promise of a Redeemer to crush evil",
    "",
    "Genesis prepares for the Exodus, the Law, the Prophets,",
    "and ultimately, the Incarnation of the Word made flesh.",
  ],
  {
    style: "double",
    title: "From Genesis to Revelation",
    padding: 1,
    color: ColorSystem.hexToRgb("#FFD700"), // Gold - sacred truth
    maxWidth: 94,
  },
);
console.log("\n");

// =============================================================================
// 20. CLOSING BENEDICTION
// =============================================================================

ConsoleStyler.logGradient(
  "Bereshit - In the Beginning",
  [75, 0, 130], // Indigo
  [255, 215, 0], // Gold
  50,
);
console.log("\n");

const finalLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("info")
    .timestampFormat("HH:mm:ss")
    .build(),
);

finalLogger.success("The Book of Genesis - Liber Primus - Complete");
console.log("\n");

BoxRenderer.render(
  [
    "Glory to the Father, and to the Son, and to the Holy Spirit,",
    "as it was in the beginning, is now, and ever shall be,",
    "world without end. Amen.",
  ],
  {
    style: "double",
    title: "Gloria Patri",
    padding: 1,
    color: ColorSystem.hexToRgb("#4B0082"),
    maxWidth: 94,
  },
);
console.log("\n");
