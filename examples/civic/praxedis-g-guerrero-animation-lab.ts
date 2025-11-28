#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Laboratorio de Animación – Municipio de Praxedis G. Guerrero
 *
 * Una narración visual en español mexicano para las comisarias rurales del Valle de Juárez.
 * Celebra el cuidado del agua, la organización campesina y la educación comunitaria.
 *
 * Incluye:
 *   • Banner ceremonial y bitácora de sistemas municipales
 *   • Tablas de brigadas y cooperativas agro-ambientales
 *   • Barras de progreso para los ejes de agua, educación y salud
 *   • Animación en línea inspirada en los surcos y acequias del municipio
 *   • Mensajería en español claro para audiencias rurales de Chihuahua
 */

import {
  BannerRenderer,
  BoxRenderer,
  ColorSystem,
  ConfigBuilder,
  Formatter,
  Logger,
  neonTheme,
  ProgressBar,
  Spinner,
  TableRenderer,
} from "../../mod.ts";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const encoder = new TextEncoder();

const municipio = {
  nombre: "Municipio de Praxedis G. Guerrero",
  lema: "Voces del Río Bravo y del desierto chihuahuense",
  poblacion: 4928,
  hectareasEnRiego: 1375,
  hogares: 1184,
  cooperativas: [
    "Guardianes del Bravo",
    "Flor de Sotol",
    "Juntas Ejidales Unidas",
  ],
};

console.clear();
console.log("\n");

const tenue = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.dim);
const agua = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightCyan);
const milpa = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightGreen);
const sol = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightYellow);
const maguey = (text: string) => ColorSystem.colorize(text, ColorSystem.codes.brightMagenta);

const apertura = [
  tenue("                ╭────────────────────────────────────────╮"),
  tenue("                │   Relato vivo desde el Valle Bravo   │"),
  tenue("                ╰────────────────────────────────────────╯"),
  "",
  `${milpa("        ✦ Praxedis G. Guerrero • Chihuahua, México ✦")}`,
  `${agua("         Campanas al amanecer, radios y acequias vivas")}`,
  "",
];

for (const line of apertura) {
  console.log(line);
  await sleep(110);
}

BannerRenderer.render({
  title: "Laboratorio de Animación del Campo",
  subtitle: municipio.nombre,
  description: "Relato visual para comités rurales y cabildos comunitarios",
  author: "Coordinación Municipal de Cultura y Fomento Rural",
  version: "MX-2025.04",
  width: 86,
  color: ColorSystem.codes.brightGreen,
});
console.log("\n");

const valleLogger = new Logger(
  new ConfigBuilder()
    .theme(neonTheme)
    .logLevel("debug")
    .timestampFormat("HH:mm:ss")
    .enableHistory(true)
    .maxHistorySize(200)
    .build(),
);

valleLogger.info("Bitácora rural activada", {
  lema: municipio.lema,
  poblacion: Formatter.number(municipio.poblacion, "es-MX"),
  hogares: Formatter.number(municipio.hogares, "es-MX"),
});
valleLogger.debug("Pozo y acequias monitoreadas", {
  pozos: 18,
  acequias: 42,
  hectareasEnRiego: `${Formatter.number(municipio.hectareasEnRiego, "es-MX")} ha`,
});
valleLogger.success("Consejos campesinos sincronizados", {
  cooperativas: municipio.cooperativas,
});
console.log("\n");

console.log(ColorSystem.colorize("◈ Red comunitaria en marcha", ColorSystem.codes.brightWhite));
console.log(tenue("  Encendiendo radios de banda civil y sensores caseros..."));

const enlaceSpinner = new Spinner({
  message: "Encendiendo radios comunitarios...",
  frames: ["🌾   ", " 🌾  ", "  🌾 ", "   🌾", "  🌾 ", " 🌾  " ],
  interval: 140,
});

enlaceSpinner.start();
await sleep(700);
enlaceSpinner.update("Vinculando pluviómetros del ejido La Unión...");
await sleep(700);
enlaceSpinner.update("Compartiendo alertas con promotores de salud...");
await sleep(700);
enlaceSpinner.succeed("Red campesina lista • 24 altavoces y 7 radios");
console.log("\n");

BoxRenderer.render(
  [
    "Nos hablamos con respeto sencillo, sin rodeos ni tecnicismos.",
    "La información baja en camioneta, en bicicleta y vía radio comunitaria.",
    "Celebramos el trabajo de las mujeres que sostienen la vida del municipio.",
    "Lo que se ve aquí se comparte en la plaza y en la escuela telesecundaria.",
  ],
  {
    title: "Acuerdos del Valle",
    style: "rounded",
    color: ColorSystem.codes.brightYellow,
    minWidth: 70,
  },
);
console.log("\n");

console.log(ColorSystem.colorize("◈ Brigadas del agua viva", ColorSystem.codes.brightWhite));
console.log(tenue("  Supervisión de pozos, norias y canales de tierra compactada."));

const brigadasAgua = [
  { zona: "Ejido San Ignacio", pozos: 3, humedad: 0.74, familias: 46, canal: "Canal 5.120" },
  { zona: "La Colorada", pozos: 2, humedad: 0.68, familias: 38, canal: "Canal 4.815" },
  { zona: "Barrio Kilómetro 57", pozos: 4, humedad: 0.71, familias: 53, canal: "Canal 6.300" },
  { zona: "El Faro", pozos: 1, humedad: 0.63, familias: 27, canal: "Canal 3.902" },
];

TableRenderer.render(
  brigadasAgua.map((brigada) => ({
    zona: brigada.zona,
    pozos: Formatter.number(brigada.pozos, "es-MX"),
    humedad: Formatter.percentage(brigada.humedad, 0),
    familias: Formatter.number(brigada.familias, "es-MX"),
    canal: brigada.canal,
  })),
  [
    { key: "zona", label: "Zona comunitaria", width: 26 },
    { key: "pozos", label: "Pozos activos", width: 14, align: "center" },
    { key: "humedad", label: "Humedad", width: 12, align: "right" },
    { key: "familias", label: "Familias", width: 12, align: "right" },
    { key: "canal", label: "Canal de radio", width: 16 },
  ],
  { showIndex: true },
);
console.log("\n");

console.log(ColorSystem.colorize("◈ Cooperativas y cultivos solidarios", ColorSystem.codes.brightWhite));
console.log(tenue("  Datos expresados tal como se comparten en las asambleas."));

const cultivosSolidarios = [
  {
    cultivo: "Alfalfa de temporal",
    hectareas: 210,
    humedad: 0.61,
    cooperativa: "Guardianes del Bravo",
    valor: 1820000,
  },
  {
    cultivo: "Chile medio serrano",
    hectareas: 95,
    humedad: 0.58,
    cooperativa: "Flor de Sotol",
    valor: 1210000,
  },
  {
    cultivo: "Nogal joven",
    hectareas: 145,
    humedad: 0.66,
    cooperativa: "Juntas Ejidales",
    valor: 2040000,
  },
];

TableRenderer.render(
  cultivosSolidarios.map((cultivo) => ({
    cultivo: cultivo.cultivo,
    hectareas: `${Formatter.number(cultivo.hectareas, "es-MX")} ha`,
    humedad: Formatter.percentage(cultivo.humedad, 0),
    cooperativa: cultivo.cooperativa,
    valor: Formatter.currency(cultivo.valor, "MXN", "es-MX"),
  })),
  [
    { key: "cultivo", label: "Cultivo", width: 20 },
    { key: "hectareas", label: "Hectáreas", width: 12, align: "right" },
    { key: "humedad", label: "Humedad", width: 10, align: "right" },
    { key: "cooperativa", label: "Cooperativa", width: 20 },
    { key: "valor", label: "Valor estimado", width: 18, align: "right" },
  ],
  { showIndex: true },
);
console.log("\n");

console.log(ColorSystem.colorize("◈ Ejes vivos del municipio", ColorSystem.codes.brightWhite));
console.log(tenue("  Estado real contado por regidores, maestras y promotores de salud."));

const ejesTransformacion = [
  {
    nombre: "Riego comunitario con goteo",
    descripcion: "Cisterna nueva y válvulas entregadas a las parcelas de La Colorada.",
    avances: [24, 47, 66, 84, 100],
  },
  {
    nombre: "Red de educación campesina",
    descripcion: "Talleres radiales para secundaria a distancia y asesorías bilingües.",
    avances: [18, 41, 65, 100],
  },
  {
    nombre: "Caravana de salud y nutrición",
    descripcion: "Enfermería móvil atendió escuelas, casas ejidales y rancherías.",
    avances: [32, 54, 79, 100],
  },
];

for (const eje of ejesTransformacion) {
  console.log(milpa(`▶ ${eje.nombre}`));
  const bar = new ProgressBar({ total: 100, width: 48 });
  for (const avance of eje.avances) {
    bar.update(avance);
    await sleep(320);
  }
  bar.complete();
  console.log(tenue(`  ${eje.descripcion}`));
  console.log("");
}

console.log(ColorSystem.colorize("◈ Animación de surcos y acequias", ColorSystem.codes.brightWhite));
console.log(tenue("  Visualizamos la ruta del agua que cruza las huertas y potreros."));
console.log("");

const surcoFrames = [
  `${sol("╭────────────╮")} ${milpa("🌱  🌱   🌾  ")} ${agua("💧   ")} ${maguey("🐐")}`,
  `${sol("╭────────────╮")} ${milpa("  🌾   🌱  🌱")} ${agua("  💧  ")} ${maguey("🐐")}`,
  `${sol("╭────────────╮")} ${milpa("🌱🌱    🌾  ")} ${agua("   💧 ")} ${maguey("🐐")}`,
  `${sol("╭────────────╮")} ${milpa("  🌾  🌱🌱  ")} ${agua("    💧")} ${maguey("🐐")}`,
];

for (let i = 0; i < 36; i++) {
  const frame = surcoFrames[i % surcoFrames.length];
  Deno.stdout.writeSync(encoder.encode(`\r${frame}   `));
  await sleep(150);
}
Deno.stdout.writeSync(encoder.encode("\r" + " ".repeat(80) + "\r"));
console.log(tenue("  El agua se cuida entre vecinas; cada gota tiene nombre."));
console.log("\n");

console.log(ColorSystem.colorize("◈ Jornadas comunitarias del día", ColorSystem.codes.brightWhite));

const jornadas = [
  { jornada: "Ruta del Agua Limpia", tramos: "12 km", familias: 320, avance: 0.72 },
  { jornada: "Escuelas al Atardecer", tramos: "5 aulas", familias: 140, avance: 0.64 },
  { jornada: "Visitas de Salud", tramos: "8 comunidades", familias: 260, avance: 0.81 },
];

TableRenderer.render(
  jornadas.map((jornada) => ({
    jornada: jornada.jornada,
    alcance: jornada.tramos,
    familias: Formatter.number(jornada.familias, "es-MX"),
    avance: Formatter.percentage(jornada.avance, 0),
  })),
  [
    { key: "jornada", label: "Jornada", width: 30 },
    { key: "alcance", label: "Alcance", width: 16 },
    { key: "familias", label: "Familias atendidas", width: 18, align: "right" },
    { key: "avance", label: "Avance", width: 10, align: "right" },
  ],
  { showIndex: true },
);
console.log("\n");

BoxRenderer.message(
  "Se comparte en cabildo abierto: Praxedis G. Guerrero sigue unido y vigilante.",
  "success",
);
console.log("\n");

valleLogger.success("Laboratorio municipal concluido", {
  mensaje: "Listo para reproducirse en asambleas y radios rurales",
});

console.log(tenue("Fin del recorrido visual. Se apagan radios, se dejan guardias en el pozo."));
