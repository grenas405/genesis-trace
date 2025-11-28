#!/usr/bin/env -S deno run --allow-env

/**
 * ASCII Art Gallery - Pure ASCII Art Demonstration
 *
 * A showcase of ASCII art rendered with GenesisTrace's BoxRenderer
 * and ColorSystem. Nothing but art.
 *
 * Run with:
 *    deno run --allow-env examples/core/ascii-art-gallery.ts
 */

import { BoxRenderer, ColorSystem } from "../../mod.ts";

console.clear();
console.log("\n");

// ============================================================================
// GALLERY TITLE
// ============================================================================

const titleArt = [
  "    ___   _____ ______________   ___    ____  ______",
  "   /   | / ___// ____/  _/  _/  /   |  / __ \\/_  __/",
  "  / /| | \\__ \\/ /    / / / /   / /| | / /_/ / / /   ",
  " / ___ |___/ / /____/ /_/ /   / ___ |/ _, _/ / /    ",
  "/_/  |_/____/\\____/___/___/  /_/  |_/_/ |_| /_/     ",
  "                                                     ",
  "         G  A  L  L  E  R  Y                        ",
];

BoxRenderer.render(titleArt, {
  style: "double",
  padding: 1,
  color: ColorSystem.hexToRgb("#FFD700"),
  align: "center",
  maxWidth: 60,
});

console.log("\n");

// ============================================================================
// THE MOON
// ============================================================================

const moon = [
  "            _..._            ",
  "          .:::::::.          ",
  "         :::::::::::         ",
  "         :::::::::::         ",
  "         `:::::::::'         ",
  "           `':::''           ",
];

BoxRenderer.render(moon, {
  style: "rounded",
  title: "Luna",
  padding: 1,
  color: ColorSystem.hexToRgb("#C0C0C0"),
  align: "center",
  maxWidth: 40,
});

console.log("\n");

// ============================================================================
// MOUNTAIN LANDSCAPE
// ============================================================================

const mountains = [
  "                    /\\                    ",
  "                   /  \\                   ",
  "                  /    \\                  ",
  "        /\\       /      \\       /\\        ",
  "       /  \\     /        \\     /  \\       ",
  "      /    \\   /          \\   /    \\      ",
  "     /      \\ /            \\ /      \\     ",
  "____/        V              V        \\____",
  "================================================",
  "    ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~  ~    ",
];

BoxRenderer.render(mountains, {
  style: "single",
  title: "Sierra Nevada",
  padding: 1,
  color: ColorSystem.hexToRgb("#228B22"),
  align: "center",
  maxWidth: 54,
});

console.log("\n");

// ============================================================================
// OWL
// ============================================================================

const owl = [
  "   ,_,   ",
  "  (O,O)  ",
  "  (   )  ",
  "  -\"-\"-  ",
];

BoxRenderer.render(owl, {
  style: "rounded",
  title: "Noctua",
  padding: 1,
  color: ColorSystem.hexToRgb("#8B4513"),
  align: "center",
  maxWidth: 20,
});

console.log("\n");

// ============================================================================
// CASTLE
// ============================================================================

const castle = [
  "                 T~~                    ",
  "                 |                      ",
  "                /\"\\                     ",
  "        T~~    |'| T~~                  ",
  "    T~~ |      |'| |                    ",
  "    |  /\"\\     |'|/\"\\                   ",
  "   /\"\\ |'| T~~ |'||'|                   ",
  "   |'| |'| |  /\"\\ |'|                   ",
  "   |'| |'|/\"\\ |'| |'|                   ",
  "   |'|__|'||'||'|_|'|                   ",
  "___|'|__|'||'||'|_|'|___                ",
];

BoxRenderer.render(castle, {
  style: "bold",
  title: "Citadel",
  padding: 1,
  color: ColorSystem.hexToRgb("#708090"),
  align: "center",
  maxWidth: 50,
});

console.log("\n");

// ============================================================================
// SHIP
// ============================================================================

const ship = [
  "                                        ",
  "              ~         ~               ",
  "        _______|_______|_______         ",
  "        \\                     /         ",
  "         \\___________________/          ",
  "      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^      ",
];

BoxRenderer.render(ship, {
  style: "single",
  title: "Odyssey",
  padding: 1,
  color: ColorSystem.hexToRgb("#4169E1"),
  align: "center",
  maxWidth: 50,
});

console.log("\n");

// ============================================================================
// CAT
// ============================================================================

const cat = [
  "    /\\_____/\\    ",
  "   /  o   o  \\   ",
  "  ( ==  ^  == )  ",
  "   )         (   ",
  "  (           )  ",
  " ( (  )   (  ) ) ",
  "(__(__)___(__)__)",
];

BoxRenderer.render(cat, {
  style: "rounded",
  title: "Felis",
  padding: 1,
  color: ColorSystem.hexToRgb("#FF6347"),
  align: "center",
  maxWidth: 28,
});

console.log("\n");

// ============================================================================
// ROSE
// ============================================================================

const rose = [
  "       _              ",
  "      (@)             ",
  "     ,;'\\`.           ",
  "    ,;' ` \\`.         ",
  "  ,;'  `   `\\.        ",
  " ;'   `  '   `;       ",
  " `:.______.;'         ",
  "       ||             ",
  "       ||             ",
  "      /||\\            ",
  "     / || \\           ",
];

BoxRenderer.render(rose, {
  style: "rounded",
  title: "Rosa",
  padding: 1,
  color: ColorSystem.hexToRgb("#FF1493"),
  align: "center",
  maxWidth: 32,
});

console.log("\n");

// ============================================================================
// TREE
// ============================================================================

const tree = [
  "        ###        ",
  "       #o###       ",
  "     #####o###     ",
  "    #o#\\#|#/###    ",
  "     ###\\|/#o#     ",
  "      # }|{  #     ",
  "        }|{        ",
  "        }|{        ",
  "   ^^^^^^^^^^^^    ",
];

BoxRenderer.render(tree, {
  style: "single",
  title: "Arbor",
  padding: 1,
  color: ColorSystem.hexToRgb("#006400"),
  align: "center",
  maxWidth: 30,
});

console.log("\n");

// ============================================================================
// DRAGON
// ============================================================================

const dragon = [
  "                          ______________                ",
  "                   ,===:'.,            `-._             ",
  "                        `:.`---.__         `-._         ",
  "                          `:.     `--.         `.       ",
  "                            \\.        `.         `.     ",
  "                    (,,(,    \\.         `.   ____,-`.   ",
  "                 (,'     `/   \\.   ,--.___`.'\\'       \\ ",
  "             ,  ,'  ,--.  `,   \\.;'         `'         \\",
  "           `{D, {    \\  :    \\;                        \\",
  "             V,'    /  /    //                          ",
  "             j;;    /  ,' ,-//.    ,---.      ,         ",
  "             \\;'   /  ,' /  _  \\  /  _  \\   ,'/         ",
  "                   \\   `'  / \\  `'  / \\  `.' /          ",
  "                    `.___,'   `.__,'   `googol           ",
];

BoxRenderer.render(dragon, {
  style: "bold",
  title: "Draco",
  padding: 1,
  color: ColorSystem.hexToRgb("#DC143C"),
  align: "center",
  maxWidth: 66,
});

console.log("\n");

// ============================================================================
// COFFEE CUP
// ============================================================================

const coffee = [
  "        ) )     ",
  "       ( (      ",
  "        ) )     ",
  "     .-------.  ",
  "    |         | ",
  "    |         |]",
  "     `-------'  ",
];

BoxRenderer.render(coffee, {
  style: "rounded",
  title: "Caffeina",
  padding: 1,
  color: ColorSystem.hexToRgb("#8B4513"),
  align: "center",
  maxWidth: 26,
});

console.log("\n");

// ============================================================================
// FISH
// ============================================================================

const fish = [
  "       /`-._      ",
  "      /_,.._`:-   ",
  "  ,.-'  ,   `-:..-)",
  " : o ):';      _  {",
  "  `-._ `'__,.-'\\`-'}",
  "      `\\\\  \\,.-'`   ",
];

BoxRenderer.render(fish, {
  style: "single",
  title: "Pisces",
  padding: 1,
  color: ColorSystem.hexToRgb("#00CED1"),
  align: "center",
  maxWidth: 30,
});

console.log("\n");

// ============================================================================
// HOURGLASS
// ============================================================================

const hourglass = [
  "   _____   ",
  "  |     |  ",
  "  |     |  ",
  "   \\   /   ",
  "    \\ /    ",
  "     X     ",
  "    / \\    ",
  "   /   \\   ",
  "  |     |  ",
  "  |_____|  ",
];

BoxRenderer.render(hourglass, {
  style: "double",
  title: "Tempus",
  padding: 1,
  color: ColorSystem.hexToRgb("#DAA520"),
  align: "center",
  maxWidth: 22,
});

console.log("\n");

// ============================================================================
// SKULL
// ============================================================================

const skull = [
  "      ___       ",
  "     /   \\      ",
  "    | o o |     ",
  "    |  ^  |     ",
  "    | \\_/ |     ",
  "     \\___/      ",
  "     /| |\\      ",
];

BoxRenderer.render(skull, {
  style: "bold",
  title: "Memento Mori",
  padding: 1,
  color: ColorSystem.hexToRgb("#F5F5DC"),
  align: "center",
  maxWidth: 26,
});

console.log("\n");

// ============================================================================
// KEYBOARD
// ============================================================================

const keyboard = [
  ",---,---,---,---,---,---,---,---,---,---,---,---,---,-------,",
  "| ~ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 0 | - | = | <--   |",
  "|---'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-----|",
  "| ->| | Q | W | E | R | T | Y | U | I | O | P | [ | ] |  \\  |",
  "|-----',--',--',--',--',--',--',--',--',--',--',--',--'-----|",
  "| Caps | A | S | D | F | G | H | J | K | L | ; | ' |  Enter |",
  "|------'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'-,-'--------|",
  "| Shift  | Z | X | C | V | B | N | M | , | . | / |   Shift  |",
  "|------,-',--'--,'---'---'---'---'---'---'-,-'---',--,------|",
  "| Ctrl |  | Alt |                         | Alt  |  | Ctrl |",
  "'------'  '-----'-------------------------'------'  '------'",
];

BoxRenderer.render(keyboard, {
  style: "minimal",
  title: "QWERTY",
  padding: 1,
  color: ColorSystem.hexToRgb("#808080"),
  align: "center",
  maxWidth: 70,
});

console.log("\n");

// ============================================================================
// FINALE
// ============================================================================

const finale = [
  "  _____   _   _   _____  ",
  " |  ___| | | | \\ | | |   __ \\  ",
  " | |__   | | |  \\| | | | | | ",
  " |  __|  | | | . ` | | | | | ",
  " | |     | | | |\\  | | |_| | ",
  " |_|     |_| |_| \\_|  \\___/  ",
];

BoxRenderer.render(finale, {
  style: "double",
  padding: 1,
  color: ColorSystem.hexToRgb("#9370DB"),
  align: "center",
  maxWidth: 40,
});

console.log("\n");
