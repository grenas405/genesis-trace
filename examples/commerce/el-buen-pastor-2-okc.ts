#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * El Buen Pastor 2 - Supermercado y Restaurante Mexicano
 * Oklahoma City, Oklahoma 73129
 * Teléfono: (405) 800-4468
 *
 * Sistema de Gestión Operacional GenesisTrace
 *
 * Características demostradas:
 *   - Sistema de punto de venta bilingüe
 *   - Gestión de inventario en tiempo real
 *   - Seguimiento de pedidos de restaurante
 *   - Control de productos frescos y abarrotes
 *   - Dashboard de ventas por departamento
 *   - Alertas de reabastecimiento inteligente
 *   - Análisis de rentabilidad por categoría
 *   - Colores de la bandera mexicana (verde, blanco, rojo)
 */

import {
  BannerRenderer,
  BoxRenderer,
  ChartRenderer,
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

// ============================================================================
// COLORES BANDERA MEXICANA
// ============================================================================

const MEXICAN_COLORS = {
  green: "\x1b[38;2;0;104;71m",      // Verde #006847
  white: "\x1b[97m",                  // Blanco
  red: "\x1b[38;2;206;17;38m",        // Rojo #CE1126
  reset: ColorSystem.codes.reset,
};

// ============================================================================
// ESTRUCTURAS DE DATOS
// ============================================================================

interface ProductoInventario {
  sku: string;
  nombre: string;
  categoria: string;
  stockActual: number;
  unidad: string;
  puntoReorden: number;
  stockOptimo: number;
  costoPorUnidad: number;
  proveedor: string;
  ultimaEntrega: string;
}

interface PlatoRestaurante {
  nombre: string;
  precio: number;
  categoria: string;
  popularidad: number;
  tiempoPrep: number;
}

interface PedidoRestaurante {
  numPedido: string;
  cliente: string;
  platillos: string;
  total: number;
  estado: string;
  mesero: string;
  tiempoEstimado: string;
}

// ============================================================================
// INFORMACIÓN DEL NEGOCIO
// ============================================================================

const negocioInfo = {
  nombre: "El Buen Pastor 2",
  eslogan: "Sabor auténtico mexicano en el corazón de Oklahoma",
  direccion: "Oklahoma City, Oklahoma 73129",
  telefono: "(405) 800-4468",
  horario: "7:00 AM - 10:00 PM (Todos los días)",
  servicios: ["Supermercado", "Restaurante", "Carnicería", "Panadería"],
};

// ============================================================================
// INVENTARIO DE SUPERMERCADO Y RESTAURANTE
// ============================================================================

const inventario: ProductoInventario[] = [
  // Carnes y Proteínas
  { sku: "CAR-001", nombre: "Bistec de Res", categoria: "Carnicería", stockActual: 45, unidad: "lbs", puntoReorden: 30, stockOptimo: 80, costoPorUnidad: 8.50, proveedor: "Distribuidora Del Norte", ultimaEntrega: "2025-11-25" },
  { sku: "CAR-002", nombre: "Pechuga de Pollo", categoria: "Carnicería", stockActual: 62, unidad: "lbs", puntoReorden: 40, stockOptimo: 100, costoPorUnidad: 4.75, proveedor: "Distribuidora Del Norte", ultimaEntrega: "2025-11-25" },
  { sku: "CAR-003", nombre: "Costilla de Puerco", categoria: "Carnicería", stockActual: 28, unidad: "lbs", puntoReorden: 25, stockOptimo: 60, costoPorUnidad: 5.25, proveedor: "Distribuidora Del Norte", ultimaEntrega: "2025-11-24" },
  { sku: "CAR-004", nombre: "Chorizo Casero", categoria: "Carnicería", stockActual: 18, unidad: "lbs", puntoReorden: 15, stockOptimo: 40, costoPorUnidad: 6.80, proveedor: "Producción Interna", ultimaEntrega: "2025-11-26" },
  { sku: "CAR-005", nombre: "Camarón Grande", categoria: "Mariscos", stockActual: 12, unidad: "lbs", puntoReorden: 10, stockOptimo: 30, costoPorUnidad: 14.50, proveedor: "Pacific Seafood", ultimaEntrega: "2025-11-25" },

  // Productos Frescos
  { sku: "VER-001", nombre: "Aguacate Hass", categoria: "Frutas y Verduras", stockActual: 85, unidad: "unidades", puntoReorden: 60, stockOptimo: 150, costoPorUnidad: 1.35, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-26" },
  { sku: "VER-002", nombre: "Tomate Rojo", categoria: "Frutas y Verduras", stockActual: 38, unidad: "lbs", puntoReorden: 30, stockOptimo: 80, costoPorUnidad: 2.10, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-26" },
  { sku: "VER-003", nombre: "Cebolla Blanca", categoria: "Frutas y Verduras", stockActual: 52, unidad: "lbs", puntoReorden: 35, stockOptimo: 90, costoPorUnidad: 1.15, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-26" },
  { sku: "VER-004", nombre: "Chile Jalapeño", categoria: "Frutas y Verduras", stockActual: 22, unidad: "lbs", puntoReorden: 15, stockOptimo: 45, costoPorUnidad: 2.75, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-25" },
  { sku: "VER-005", nombre: "Cilantro Fresco", categoria: "Frutas y Verduras", stockActual: 15, unidad: "manojos", puntoReorden: 12, stockOptimo: 35, costoPorUnidad: 1.25, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-26" },
  { sku: "VER-006", nombre: "Limón Verde", categoria: "Frutas y Verduras", stockActual: 68, unidad: "unidades", puntoReorden: 50, stockOptimo: 120, costoPorUnidad: 0.30, proveedor: "Mercado de Abastos", ultimaEntrega: "2025-11-26" },

  // Tortillas y Pan
  { sku: "TOR-001", nombre: "Tortillas de Maíz", categoria: "Tortillería", stockActual: 280, unidad: "unidades", puntoReorden: 200, stockOptimo: 500, costoPorUnidad: 0.15, proveedor: "Tortillería La Azteca", ultimaEntrega: "2025-11-26" },
  { sku: "TOR-002", nombre: "Tortillas de Harina", categoria: "Tortillería", stockActual: 195, unidad: "unidades", puntoReorden: 150, stockOptimo: 400, costoPorUnidad: 0.22, proveedor: "Tortillería La Azteca", ultimaEntrega: "2025-11-26" },
  { sku: "PAN-001", nombre: "Bolillos", categoria: "Panadería", stockActual: 48, unidad: "unidades", puntoReorden: 35, stockOptimo: 80, costoPorUnidad: 0.55, proveedor: "Panadería San Miguel", ultimaEntrega: "2025-11-26" },
  { sku: "PAN-002", nombre: "Conchas", categoria: "Panadería", stockActual: 36, unidad: "unidades", puntoReorden: 30, stockOptimo: 70, costoPorUnidad: 0.85, proveedor: "Panadería San Miguel", ultimaEntrega: "2025-11-26" },

  // Abarrotes Secos
  { sku: "ABA-001", nombre: "Frijol Negro", categoria: "Abarrotes", stockActual: 28, unidad: "lbs", puntoReorden: 20, stockOptimo: 60, costoPorUnidad: 1.95, proveedor: "Distribuidora Jalisco", ultimaEntrega: "2025-11-22" },
  { sku: "ABA-002", nombre: "Frijol Pinto", categoria: "Abarrotes", stockActual: 42, unidad: "lbs", puntoReorden: 30, stockOptimo: 80, costoPorUnidad: 1.75, proveedor: "Distribuidora Jalisco", ultimaEntrega: "2025-11-22" },
  { sku: "ABA-003", nombre: "Arroz Blanco", categoria: "Abarrotes", stockActual: 55, unidad: "lbs", puntoReorden: 40, stockOptimo: 100, costoPorUnidad: 1.35, proveedor: "Distribuidora Jalisco", ultimaEntrega: "2025-11-22" },
  { sku: "ABA-004", nombre: "Masa Harina", categoria: "Abarrotes", stockActual: 32, unidad: "lbs", puntoReorden: 25, stockOptimo: 70, costoPorUnidad: 2.15, proveedor: "Distribuidora Jalisco", ultimaEntrega: "2025-11-23" },

  // Lácteos
  { sku: "LAC-001", nombre: "Queso Oaxaca", categoria: "Lácteos", stockActual: 18, unidad: "lbs", puntoReorden: 15, stockOptimo: 40, costoPorUnidad: 6.25, proveedor: "Lácteos Guadalajara", ultimaEntrega: "2025-11-25" },
  { sku: "LAC-002", nombre: "Queso Fresco", categoria: "Lácteos", stockActual: 22, unidad: "lbs", puntoReorden: 18, stockOptimo: 45, costoPorUnidad: 5.75, proveedor: "Lácteos Guadalajara", ultimaEntrega: "2025-11-25" },
  { sku: "LAC-003", nombre: "Crema Mexicana", categoria: "Lácteos", stockActual: 14, unidad: "qts", puntoReorden: 10, stockOptimo: 30, costoPorUnidad: 5.95, proveedor: "Lácteos Guadalajara", ultimaEntrega: "2025-11-25" },

  // Bebidas
  { sku: "BEB-001", nombre: "Jarritos Variados", categoria: "Bebidas", stockActual: 96, unidad: "botellas", puntoReorden: 72, stockOptimo: 180, costoPorUnidad: 1.15, proveedor: "Distribuidora de Bebidas", ultimaEntrega: "2025-11-24" },
  { sku: "BEB-002", nombre: "Coca-Cola Mexicana", categoria: "Bebidas", stockActual: 84, unidad: "botellas", puntoReorden: 60, stockOptimo: 150, costoPorUnidad: 1.45, proveedor: "Distribuidora de Bebidas", ultimaEntrega: "2025-11-24" },
  { sku: "BEB-003", nombre: "Horchata (Preparada)", categoria: "Bebidas", stockActual: 8, unidad: "galones", puntoReorden: 5, stockOptimo: 15, costoPorUnidad: 12.50, proveedor: "Producción Interna", ultimaEntrega: "2025-11-26" },
  { sku: "BEB-004", nombre: "Agua de Jamaica", categoria: "Bebidas", stockActual: 6, unidad: "galones", puntoReorden: 4, stockOptimo: 12, costoPorUnidad: 11.75, proveedor: "Producción Interna", ultimaEntrega: "2025-11-26" },
];

// ============================================================================
// MENÚ DEL RESTAURANTE
// ============================================================================

const menuRestaurante: PlatoRestaurante[] = [
  { nombre: "Tacos al Pastor (3)", precio: 11.50, categoria: "Tacos", popularidad: 95, tiempoPrep: 8 },
  { nombre: "Tacos de Bistec (3)", precio: 12.00, categoria: "Tacos", popularidad: 88, tiempoPrep: 8 },
  { nombre: "Enchiladas Verdes", precio: 13.50, categoria: "Platillos", popularidad: 82, tiempoPrep: 15 },
  { nombre: "Mole Poblano", precio: 15.00, categoria: "Platillos", popularidad: 76, tiempoPrep: 18 },
  { nombre: "Caldo de Res", precio: 14.50, categoria: "Caldos", popularidad: 80, tiempoPrep: 20 },
  { nombre: "Pozole Rojo", precio: 13.75, categoria: "Caldos", popularidad: 85, tiempoPrep: 18 },
  { nombre: "Torta Cubana", precio: 12.50, categoria: "Tortas", popularidad: 79, tiempoPrep: 10 },
  { nombre: "Quesadilla de Queso Oaxaca", precio: 10.00, categoria: "Antojitos", popularidad: 90, tiempoPrep: 8 },
  { nombre: "Burrito de Carne Asada", precio: 13.00, categoria: "Burritos", popularidad: 83, tiempoPrep: 12 },
  { nombre: "Camarones a la Diabla", precio: 18.50, categoria: "Mariscos", popularidad: 72, tiempoPrep: 15 },
];

// ============================================================================
// PEDIDOS EN PROCESO
// ============================================================================

const pedidosActivos: PedidoRestaurante[] = [
  { numPedido: "#125", cliente: "Mesa 4", platillos: "2x Tacos al Pastor, 1x Horchata", total: 26.50, estado: "En Preparación", mesero: "María", tiempoEstimado: "5 min" },
  { numPedido: "#126", cliente: "Para Llevar", platillos: "1x Mole Poblano, 1x Arroz", total: 17.00, estado: "Listo para Empacar", mesero: "José", tiempoEstimado: "2 min" },
  { numPedido: "#127", cliente: "Mesa 7", platillos: "3x Pozole Rojo, 2x Jarritos", total: 43.60, estado: "En Cocina", mesero: "Carmen", tiempoEstimado: "12 min" },
  { numPedido: "#128", cliente: "Mesa 2", platillos: "2x Quesadilla, 1x Burrito", total: 33.00, estado: "Servido", mesero: "Roberto", tiempoEstimado: "Completado" },
  { numPedido: "#129", cliente: "Para Llevar", platillos: "1x Camarones a la Diabla, 1x Arroz", total: 21.50, estado: "Pendiente", mesero: "María", tiempoEstimado: "15 min" },
];

// ============================================================================
// FUNCIÓN PRINCIPAL DEL DEMO
// ============================================================================

const runDemo = async () => {
  console.clear();
  console.log("");

  // ===========================================================================
  // 1. BANNER PRINCIPAL CON COLORES MEXICANOS
  // ===========================================================================
  BannerRenderer.render({
    title: "EL BUEN PASTOR 2",
    subtitle: "Supermercado y Restaurante Mexicano • Oklahoma City, OK 73129",
    description: "Sistema de Gestión Operacional • Teléfono: (405) 800-4468",
    version: "v2.1.0",
    author: "GenesisTrace Restaurant & Market Lab",
    width: 100,
    style: "double",
    color: MEXICAN_COLORS.green,
  });
  console.log("");

  // ===========================================================================
  // 2. INFORMACIÓN DEL NEGOCIO
  // ===========================================================================
  BoxRenderer.render(
    [
      `${MEXICAN_COLORS.green}Nombre:${MEXICAN_COLORS.reset} ${negocioInfo.nombre}`,
      `${MEXICAN_COLORS.white}Eslogan:${MEXICAN_COLORS.reset} ${negocioInfo.eslogan}`,
      `${MEXICAN_COLORS.red}Dirección:${MEXICAN_COLORS.reset} ${negocioInfo.direccion}`,
      `${MEXICAN_COLORS.green}Teléfono:${MEXICAN_COLORS.reset} ${negocioInfo.telefono}`,
      `${MEXICAN_COLORS.white}Horario:${MEXICAN_COLORS.reset} ${negocioInfo.horario}`,
      `${MEXICAN_COLORS.red}Servicios:${MEXICAN_COLORS.reset} ${negocioInfo.servicios.join(" • ")}`,
    ],
    {
      title: "Información del Negocio",
      style: "rounded",
      color: MEXICAN_COLORS.green,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 3. LOGGER DEL SISTEMA
  // ===========================================================================
  const sistemaLogger = new Logger(
    new ConfigBuilder()
      .theme(neonTheme)
      .logLevel("info")
      .enableHistory(true)
      .build(),
  );

  sistemaLogger.info("Sistema operacional iniciado", {
    fecha: "2025-11-26",
    turno: "Jornada Completa",
  });
  sistemaLogger.success("Conexión con punto de venta establecida");
  sistemaLogger.debug("Módulos activos: Inventario, Restaurante, Carnicería, Panadería");
  console.log("");

  // ===========================================================================
  // 4. RESUMEN OPERACIONAL DEL DÍA
  // ===========================================================================
  console.log(ColorSystem.colorize("  RESUMEN OPERACIONAL DEL DÍA", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const now = new Date();
  const tempActual = 72;

  BoxRenderer.render(
    [
      `${MEXICAN_COLORS.green}Fecha:${MEXICAN_COLORS.reset} ${Formatter.timestamp(now, "YYYY-MM-DD")} (${now.toLocaleDateString("es-MX", { weekday: "long" })})`,
      `${MEXICAN_COLORS.white}Estado de Operación:${MEXICAN_COLORS.reset} ${ColorSystem.colorize("Abierto", ColorSystem.codes.brightGreen)} • ${negocioInfo.horario}`,
      `${MEXICAN_COLORS.red}Clima:${MEXICAN_COLORS.reset} ${tempActual}°F Soleado • Perfecto para compras`,
      `${MEXICAN_COLORS.green}Especial del Día:${MEXICAN_COLORS.reset} ${ColorSystem.colorize("Pozole Rojo con Tostadas - $13.75", ColorSystem.codes.brightMagenta)}`,
      `${MEXICAN_COLORS.white}Departamentos Activos:${MEXICAN_COLORS.reset} Todos los departamentos operando`,
    ],
    {
      title: "Estado del Negocio",
      style: "rounded",
      color: MEXICAN_COLORS.red,
      padding: 1,
      margin: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 5. INVENTARIO POR CATEGORÍA
  // ===========================================================================
  console.log(ColorSystem.colorize("  INVENTARIO POR DEPARTAMENTO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const categorias = [...new Set(inventario.map((item) => item.categoria))];
  const estadisticasCategorias = categorias.map((cat) => {
    const items = inventario.filter((item) => item.categoria === cat);
    const valorTotal = items.reduce((sum, item) => sum + item.stockActual * item.costoPorUnidad, 0);
    const itemsBajos = items.filter((item) => item.stockActual <= item.puntoReorden).length;
    return {
      categoria: cat,
      cantidadItems: items.length,
      valorTotal,
      itemsBajos,
      estado: itemsBajos > 0 ? "⚠ Requiere Reorden" : "✓ Óptimo",
    };
  });

  TableRenderer.render(
    estadisticasCategorias,
    [
      { key: "categoria", label: "Departamento", width: 22 },
      { key: "cantidadItems", label: "Productos", width: 12, align: "center" },
      { key: "valorTotal", label: "Valor Inv.", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "itemsBajos", label: "Stock Bajo", width: 12, align: "center" },
      { key: "estado", label: "Estado", width: 22 },
    ],
    { showIndex: false },
  );
  console.log("");

  const valorTotalInventario = inventario.reduce((sum, item) => sum + item.stockActual * item.costoPorUnidad, 0);
  sistemaLogger.info("Resumen de inventario generado", {
    departamentos: categorias.length,
    valorTotal: Formatter.currency(valorTotalInventario),
  });

  // ===========================================================================
  // 6. ALERTAS DE STOCK BAJO
  // ===========================================================================
  console.log(ColorSystem.colorize("  ⚠️  ALERTAS DE REABASTECIMIENTO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const itemsBajos = inventario.filter((item) => item.stockActual <= item.puntoReorden);

  if (itemsBajos.length > 0) {
    TableRenderer.render(
      itemsBajos.map((item) => ({
        ...item,
        nivelStock: `${item.stockActual} ${item.unidad}`,
        cantidadReorden: item.stockOptimo - item.stockActual,
        costoReorden: (item.stockOptimo - item.stockActual) * item.costoPorUnidad,
        urgencia: item.stockActual < item.puntoReorden * 0.5 ? "🔴 CRÍTICO" : "🟡 BAJO",
      })),
      [
        { key: "urgencia", label: "Prioridad", width: 12 },
        { key: "nombre", label: "Producto", width: 24 },
        { key: "nivelStock", label: "Stock Actual", width: 14, align: "center" },
        { key: "cantidadReorden", label: "Cant. Orden", width: 12, align: "center" },
        { key: "costoReorden", label: "Costo Est.", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
        { key: "proveedor", label: "Proveedor", width: 22 },
      ],
      { showIndex: true },
    );
    console.log("");

    const costoTotalReorden = itemsBajos.reduce(
      (sum, item) => sum + (item.stockOptimo - item.stockActual) * item.costoPorUnidad,
      0,
    );

    BoxRenderer.render(
      [
        `${MEXICAN_COLORS.red}Productos Requieren Reabastecimiento:${MEXICAN_COLORS.reset} ${itemsBajos.length}`,
        `${MEXICAN_COLORS.white}Costo Estimado de Reorden:${MEXICAN_COLORS.reset} ${Formatter.currency(costoTotalReorden)}`,
        `${MEXICAN_COLORS.green}Acción Requerida:${MEXICAN_COLORS.reset} Contactar proveedores para entrega inmediata`,
      ],
      {
        title: "⚠️ ALERTA DE REABASTECIMIENTO",
        style: "double",
        color: MEXICAN_COLORS.red,
        padding: 1,
      },
    );
    console.log("");
  }

  // ===========================================================================
  // 7. MENÚ DEL RESTAURANTE
  // ===========================================================================
  console.log(ColorSystem.colorize("  MENÚ DEL RESTAURANTE", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────", ColorSystem.codes.dim));
  console.log("");

  TableRenderer.render(
    menuRestaurante.map((plato) => ({
      ...plato,
      precioFormateado: Formatter.currency(plato.precio),
      popularidadDisplay: `${plato.popularidad}%`,
      tiempoPrepDisplay: `${plato.tiempoPrep} min`,
    })),
    [
      { key: "nombre", label: "Platillo", width: 28 },
      { key: "categoria", label: "Categoría", width: 14 },
      { key: "precioFormateado", label: "Precio", width: 12, align: "right" },
      { key: "popularidadDisplay", label: "Popular", width: 10, align: "center" },
      { key: "tiempoPrepDisplay", label: "Tiempo", width: 10, align: "center" },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 8. PEDIDOS EN PROCESO
  // ===========================================================================
  console.log(ColorSystem.colorize("  PEDIDOS EN PROCESO", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────", ColorSystem.codes.dim));
  console.log("");

  TableRenderer.render(
    pedidosActivos.map((pedido) => ({
      ...pedido,
      totalFormateado: Formatter.currency(pedido.total),
      estadoColor: pedido.estado === "Servido"
        ? ColorSystem.colorize(pedido.estado, ColorSystem.codes.brightGreen)
        : pedido.estado === "Listo para Empacar"
        ? ColorSystem.colorize(pedido.estado, ColorSystem.codes.brightYellow)
        : ColorSystem.colorize(pedido.estado, ColorSystem.codes.brightCyan),
    })),
    [
      { key: "numPedido", label: "Pedido", width: 10 },
      { key: "cliente", label: "Cliente", width: 14 },
      { key: "platillos", label: "Platillos", width: 38 },
      { key: "totalFormateado", label: "Total", width: 12, align: "right" },
      { key: "estadoColor", label: "Estado", width: 20 },
      { key: "mesero", label: "Mesero", width: 10 },
      { key: "tiempoEstimado", label: "Tiempo", width: 12, align: "center" },
    ],
    { showIndex: false },
  );
  console.log("");

  // ===========================================================================
  // 9. ANÁLISIS DE VENTAS POR HORA
  // ===========================================================================
  console.log(ColorSystem.colorize("  VENTAS POR HORA - HOY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ─────────────────────", ColorSystem.codes.dim));
  console.log("");

  const ventasPorHora = [
    { label: "7am", value: 280 },
    { label: "8am", value: 420 },
    { label: "9am", value: 580 },
    { label: "10am", value: 650 },
    { label: "11am", value: 720 },
    { label: "12pm", value: 950 },
    { label: "1pm", value: 1080 },
    { label: "2pm", value: 890 },
    { label: "3pm", value: 520 },
    { label: "4pm", value: 480 },
  ];

  ChartRenderer.barChart(ventasPorHora, {
    width: 65,
    showValues: true,
    color: MEXICAN_COLORS.green,
    title: "Ventas en USD",
  });
  console.log("");

  const ventasTotales = ventasPorHora.reduce((sum, hora) => sum + hora.value, 0);
  const promedioVenta = ventasTotales / ventasPorHora.length;

  BoxRenderer.render(
    [
      `${MEXICAN_COLORS.green}Ventas Totales Hoy:${MEXICAN_COLORS.reset} ${Formatter.currency(ventasTotales)}`,
      `${MEXICAN_COLORS.white}Promedio por Hora:${MEXICAN_COLORS.reset} ${Formatter.currency(promedioVenta)}`,
      `${MEXICAN_COLORS.red}Hora Pico:${MEXICAN_COLORS.reset} 1:00 PM - ${Formatter.currency(1080)}`,
      `${MEXICAN_COLORS.green}Proyección Día Completo:${MEXICAN_COLORS.reset} ${Formatter.currency(ventasTotales * 1.5)}`,
    ],
    {
      title: "Análisis de Ventas",
      style: "single",
      color: MEXICAN_COLORS.white,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 10. PROGRESO DE PRODUCCIÓN
  // ===========================================================================
  console.log(ColorSystem.colorize("  PROGRESO DE PRODUCCIÓN DIARIA", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const tareasProduccion = [
    { tarea: "Preparación de Carnes", progreso: 1.0, detalle: "Completado - Listo para servicio" },
    { tarea: "Cocción de Frijoles y Arroz", progreso: 1.0, detalle: "Completado - En calentador" },
    { tarea: "Salsas y Aderezos Frescos", progreso: 0.88, detalle: "Salsa verde en progreso" },
    { tarea: "Tortillas del Día", progreso: 0.75, detalle: "Segundo lote en proceso" },
    { tarea: "Pan Dulce de Panadería", progreso: 0.92, detalle: "Último hornedo enfriándose" },
    { tarea: "Aguas Frescas", progreso: 0.65, detalle: "Preparando Jamaica" },
  ];

  for (const tarea of tareasProduccion) {
    const bar = new ProgressBar({
      total: 100,
      width: 50,
      colorize: true,
      showValue: true,
    });
    bar.update(Math.round(tarea.progreso * 100));
    bar.complete();
    console.log(`${MEXICAN_COLORS.green}${tarea.tarea}${MEXICAN_COLORS.reset} → ${tarea.detalle}`);
    console.log("");
  }

  const progresoGeneral = tareasProduccion.reduce((sum, t) => sum + t.progreso, 0) / tareasProduccion.length;
  sistemaLogger.success(`Producción diaria: ${Formatter.percentage(progresoGeneral, 0)} completo`);

  // ===========================================================================
  // 11. PRODUCTOS MÁS VENDIDOS HOY
  // ===========================================================================
  console.log(ColorSystem.colorize("  PRODUCTOS MÁS VENDIDOS - HOY", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ────────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const productosVendidos = [
    { producto: "Tacos al Pastor (3)", vendidos: 78, ingresos: 897.00, porcentaje: 22.5 },
    { producto: "Pozole Rojo", vendidos: 52, ingresos: 715.00, porcentaje: 18.2 },
    { producto: "Quesadilla de Queso Oaxaca", vendidos: 64, ingresos: 640.00, porcentaje: 16.8 },
    { producto: "Enchiladas Verdes", vendidos: 38, ingresos: 513.00, porcentaje: 13.1 },
    { producto: "Burrito de Carne Asada", vendidos: 42, ingresos: 546.00, porcentaje: 11.4 },
  ];

  TableRenderer.render(
    productosVendidos,
    [
      { key: "producto", label: "Producto", width: 32 },
      { key: "vendidos", label: "Vendidos", width: 12, align: "center" },
      { key: "ingresos", label: "Ingresos", width: 14, align: "right", formatter: (v) => Formatter.currency(v) },
      { key: "porcentaje", label: "% Ventas", width: 12, align: "right", formatter: (v) => `${v.toFixed(1)}%` },
    ],
    { showIndex: true },
  );
  console.log("");

  // ===========================================================================
  // 12. SINCRONIZACIÓN DEL SISTEMA
  // ===========================================================================
  console.log(ColorSystem.colorize("  OPERACIONES DEL SISTEMA", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ───────────────────────", ColorSystem.codes.dim));
  console.log("");

  const spinnerInventario = new Spinner({ message: "Sincronizando inventario con punto de venta..." });
  spinnerInventario.start();
  await sleep(1000);
  spinnerInventario.succeed("Inventario sincronizado exitosamente");

  const spinnerProveedores = new Spinner({ message: "Enviando órdenes de reabastecimiento..." });
  spinnerProveedores.start();
  await sleep(800);
  spinnerProveedores.succeed(`Órdenes enviadas a ${itemsBajos.length > 0 ? "6 proveedores" : "proveedores"}`);

  const spinnerReportes = new Spinner({ message: "Generando reportes de fin de turno..." });
  spinnerReportes.start();
  await sleep(900);
  spinnerReportes.succeed("Reportes disponibles: Ventas, Inventario, Producción");

  console.log("");

  // ===========================================================================
  // 13. RESUMEN FINANCIERO
  // ===========================================================================
  console.log(ColorSystem.colorize("  RESUMEN FINANCIERO DEL DÍA", ColorSystem.codes.bright));
  console.log(ColorSystem.colorize("  ──────────────────────────", ColorSystem.codes.dim));
  console.log("");

  const costosOperativos = ventasTotales * 0.35; // 35% costos de comida y suministros
  const costosPersonal = ventasTotales * 0.28; // 28% costos de personal
  const costosGenerales = 285; // Costos fijos diarios
  const utilidadNeta = ventasTotales - costosOperativos - costosPersonal - costosGenerales;

  const desglosefinanciero = [
    { categoria: "Ingresos Brutos", monto: ventasTotales, porcentaje: 1.0 },
    { categoria: "Costos de Productos", monto: -costosOperativos, porcentaje: costosOperativos / ventasTotales },
    { categoria: "Costos de Personal", monto: -costosPersonal, porcentaje: costosPersonal / ventasTotales },
    { categoria: "Gastos Generales", monto: -costosGenerales, porcentaje: costosGenerales / ventasTotales },
    { categoria: "Utilidad Neta", monto: utilidadNeta, porcentaje: utilidadNeta / ventasTotales },
  ];

  TableRenderer.render(
    desglosefinanciero,
    [
      { key: "categoria", label: "Categoría", width: 28 },
      {
        key: "monto",
        label: "Monto",
        width: 16,
        align: "right",
        formatter: (v) => Formatter.currency(Math.abs(v)),
      },
      {
        key: "porcentaje",
        label: "% de Ingresos",
        width: 16,
        align: "right",
        formatter: (v) => Formatter.percentage(Math.abs(v), 1),
      },
    ],
    { showIndex: false },
  );
  console.log("");

  BoxRenderer.render(
    [
      `${MEXICAN_COLORS.green}Utilidad Neta Diaria:${MEXICAN_COLORS.reset} ${Formatter.currency(utilidadNeta)}`,
      `${MEXICAN_COLORS.white}Margen de Utilidad:${MEXICAN_COLORS.reset} ${Formatter.percentage(utilidadNeta / ventasTotales, 1)}`,
      `${MEXICAN_COLORS.red}Proyección Mensual:${MEXICAN_COLORS.reset} ${Formatter.currency(utilidadNeta * 30)} (30 días)`,
      `${MEXICAN_COLORS.green}Estado Financiero:${MEXICAN_COLORS.reset} ${ColorSystem.colorize("Saludable", ColorSystem.codes.brightGreen)}`,
    ],
    {
      title: "💰 Resumen Financiero",
      style: "double",
      color: MEXICAN_COLORS.green,
      padding: 1,
    },
  );
  console.log("");

  // ===========================================================================
  // 14. CONCLUSIÓN
  // ===========================================================================
  sistemaLogger.success("Demostración del sistema completada", {
    productosInventario: inventario.length,
    alertasBajas: itemsBajos.length,
    ventasHoy: Formatter.currency(ventasTotales),
    utilidadNeta: Formatter.currency(utilidadNeta),
  });

  console.log(
    ColorSystem.colorize(
      `\n  ${MEXICAN_COLORS.green}¡Gracias por visitar El Buen Pastor 2!${MEXICAN_COLORS.reset}`,
      ColorSystem.codes.bright,
    ),
  );
  console.log(
    ColorSystem.colorize(
      `  ${MEXICAN_COLORS.white}Sabor auténtico mexicano • ${negocioInfo.telefono}${MEXICAN_COLORS.reset}\n`,
      ColorSystem.codes.bright,
    ),
  );
};

await runDemo();
