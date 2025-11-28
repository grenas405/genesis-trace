#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * La Tiendita - Tienda de Conveniencia en Oklahoma City
 *
 * Una demostración completa de las capacidades de GenesisTrace para una
 * tienda de conveniencia que sirve a la comunidad mexicana en Oklahoma City, OK.
 *
 * Esta plataforma empresarial muestra:
 *   • Gestión de inventario en tiempo real (productos mexicanos)
 *   • Sistema de punto de venta (caja registradora)
 *   • Administración de empleados y turnos
 *   • Análisis de ventas e ingresos
 *   • Pedidos a proveedores y cadena de suministro
 *   • Venta de gasolina (bombas de combustible)
 *   • Prevención de pérdidas y seguridad
 *   • Programa de lealtad de clientes
 *   • Tablero de operaciones interactivo
 *   • Reportes de cumplimiento normativo
 *
 * Características demostradas:
 *   • Logger con configuración temática
 *   • Prompts interactivos para transacciones
 *   • Tablas para inventario y seguimiento de ventas
 *   • Gráficas para análisis y métricas de rendimiento
 *   • Barras de progreso para procesos operacionales
 *   • Indicadores giratorios para estados de carga
 *   • Banners y cajas para marca
 *   • Indicadores de estado con código de colores
 *
 * Contexto del Negocio:
 *   La Tiendita sirve a la comunidad hispana de Oklahoma City con productos
 *   mexicanos auténticos, servicio 24/7, precios justos, y atención familiar.
 *   Enfoque en calidad, servicio comunitario, y productos del hogar.
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
// ESTRUCTURAS DE DATOS
// ============================================================================

interface Producto {
  id: number;
  nombre: string;
  categoria: "Bebidas" | "Botanas" | "Tortillería" | "Comida Caliente" | "Abarrotes" | "Dulces" | "Otros";
  marca: string;
  codigo: string;
  cantidad: number;
  costoUnitario: number;
  precioVenta: number;
  puntoReorden: number;
  proveedor: string;
}

interface Transaccion {
  transaccionId: number;
  fecha: Date;
  cajero: string;
  articulos: Array<{ productoId: number; nombreProducto: string; cantidad: number; precio: number }>;
  subtotal: number;
  impuesto: number;
  total: number;
  metodoPago: "Efectivo" | "Tarjeta Crédito" | "Tarjeta Débito" | "EBT" | "Móvil";
  tarjetaLealtad: boolean;
}

interface Empleado {
  id: number;
  nombre: string;
  puesto: "Gerente" | "Subgerente" | "Cajero" | "Almacenista" | "Turno Noche";
  tarifaPorHora: number;
  horasTrabajadas: number;
  preferenciasTurno: "Mañana" | "Tarde" | "Noche" | "Flexible";
  estado: "Activo" | "Fuera de Servicio" | "En Descanso";
}

interface Turno {
  turnoId: number;
  empleadoId: number;
  nombreEmpleado: string;
  fecha: Date;
  horaInicio: string;
  horaFin: string;
  duracion: number;
  puesto: string;
  estado: "Programado" | "En Progreso" | "Completado" | "Cancelado";
}

interface BombaCombustible {
  bombaId: number;
  tipo: "Regular" | "Plus" | "Premium" | "Diésel";
  precioPorGalon: number;
  galonesVendidosHoy: number;
  ingresoHoy: number;
  estado: "Activa" | "Fuera de Servicio" | "Mantenimiento";
}

interface PedidoProveedor {
  pedidoId: number;
  proveedor: string;
  categoria: string;
  articulos: number;
  fechaPedido: Date;
  entregaEsperada: Date;
  costoTotal: number;
  estado: "Pendiente" | "Enviado" | "Entregado" | "Cancelado";
}

interface IncidenteSeguridad {
  incidenteId: number;
  fecha: Date;
  tipo: "Robo" | "Disputa" | "Actividad Sospechosa" | "Emergencia" | "Otro";
  descripcion: string;
  empleadoReporta: string;
  resuelto: boolean;
  perdidaEstimada: number;
}

// ============================================================================
// BASE DE DATOS
// ============================================================================

class BaseDatosLaTiendita {
  private inventario: Producto[] = [
    { id: 1, nombre: "Coca-Cola 600ml", categoria: "Bebidas", marca: "Coca-Cola", codigo: "BEB-CC600", cantidad: 156, costoUnitario: 0.85, precioVenta: 2.49, puntoReorden: 50, proveedor: "Embotelladora Coca-Cola" },
    { id: 2, nombre: "Jarritos Tamarindo", categoria: "Bebidas", marca: "Jarritos", codigo: "BEB-JT370", cantidad: 124, costoUnitario: 0.75, precioVenta: 1.99, puntoReorden: 40, proveedor: "Novamex" },
    { id: 3, nombre: "Jumex Guayaba", categoria: "Bebidas", marca: "Jumex", codigo: "BEB-JG500", cantidad: 98, costoUnitario: 0.80, precioVenta: 2.29, puntoReorden: 35, proveedor: "Jugos del Valle" },
    { id: 4, nombre: "Agua Mineral Topo Chico", categoria: "Bebidas", marca: "Topo Chico", codigo: "BEB-TC355", cantidad: 187, costoUnitario: 0.65, precioVenta: 1.79, puntoReorden: 60, proveedor: "Embotelladora Arca" },
    { id: 5, nombre: "Corona Extra", categoria: "Bebidas", marca: "Corona", codigo: "BEB-CE355", cantidad: 72, costoUnitario: 1.25, precioVenta: 2.99, puntoReorden: 30, proveedor: "Grupo Modelo" },
    { id: 6, nombre: "Sabritas Original", categoria: "Botanas", marca: "Sabritas", codigo: "BOT-SO60", cantidad: 145, costoUnitario: 0.95, precioVenta: 2.49, puntoReorden: 50, proveedor: "PepsiCo México" },
    { id: 7, nombre: "Takis Fuego", categoria: "Botanas", marca: "Takis", codigo: "BOT-TF90", cantidad: 132, costoUnitario: 1.15, precioVenta: 2.99, puntoReorden: 45, proveedor: "Barcel" },
    { id: 8, nombre: "Cacahuates Japoneses", categoria: "Botanas", marca: "Nishikawa", codigo: "BOT-CJ100", cantidad: 88, costoUnitario: 0.85, precioVenta: 2.29, puntoReorden: 30, proveedor: "Distribuidora Nishikawa" },
    { id: 9, nombre: "Tortillas de Maíz (kg)", categoria: "Tortillería", marca: "La Tiendita", codigo: "TOR-TM1K", cantidad: 45, costoUnitario: 1.50, precioVenta: 3.99, puntoReorden: 15, proveedor: "Tortillería El Ranchero" },
    { id: 10, nombre: "Tortillas de Harina (paq)", categoria: "Tortillería", marca: "La Tiendita", codigo: "TOR-TH500", cantidad: 38, costoUnitario: 1.25, precioVenta: 3.49, puntoReorden: 12, proveedor: "Tortillería El Ranchero" },
    { id: 11, nombre: "Tacos al Pastor", categoria: "Comida Caliente", marca: "La Tiendita", codigo: "COM-TAP3", cantidad: 32, costoUnitario: 2.25, precioVenta: 5.99, puntoReorden: 10, proveedor: "Productos Frescos" },
    { id: 12, nombre: "Tamales de Puerco", categoria: "Comida Caliente", marca: "La Tiendita", codigo: "COM-TP2", cantidad: 28, costoUnitario: 1.50, precioVenta: 3.99, puntoReorden: 10, proveedor: "Productos Frescos" },
    { id: 13, nombre: "Frijoles Refritos La Costeña", categoria: "Abarrotes", marca: "La Costeña", codigo: "ABA-FR560", cantidad: 76, costoUnitario: 1.10, precioVenta: 2.79, puntoReorden: 25, proveedor: "La Costeña" },
    { id: 14, nombre: "Chiles Jalapeños Herdez", categoria: "Abarrotes", marca: "Herdez", codigo: "ABA-CJ380", cantidad: 64, costoUnitario: 0.95, precioVenta: 2.49, puntoReorden: 20, proveedor: "Herdez" },
    { id: 15, nombre: "Arroz Morelos", categoria: "Abarrotes", marca: "Morelos", codigo: "ABA-AM1K", cantidad: 42, costoUnitario: 1.80, precioVenta: 4.49, puntoReorden: 15, proveedor: "Arroz Morelos" },
    { id: 16, nombre: "Mazapán De La Rosa", categoria: "Dulces", marca: "De La Rosa", codigo: "DUL-MDR30", cantidad: 178, costoUnitario: 0.35, precioVenta: 0.99, puntoReorden: 60, proveedor: "Dulcería De La Rosa" },
    { id: 17, nombre: "Paleta Payaso", categoria: "Dulces", marca: "Ricolino", codigo: "DUL-PP25", cantidad: 165, costoUnitario: 0.40, precioVenta: 1.19, puntoReorden: 55, proveedor: "Ricolino" },
    { id: 18, nombre: "Pulparindo", categoria: "Dulces", marca: "De La Rosa", codigo: "DUL-PUL15", cantidad: 142, costoUnitario: 0.25, precioVenta: 0.79, puntoReorden: 50, proveedor: "Dulcería De La Rosa" },
  ];

  private transacciones: Transaccion[] = [
    {
      transaccionId: 20001,
      fecha: new Date("2025-11-28T09:15:23"),
      cajero: "María González",
      articulos: [
        { productoId: 9, nombreProducto: "Tortillas de Maíz (kg)", cantidad: 2, precio: 3.99 },
        { productoId: 13, nombreProducto: "Frijoles Refritos La Costeña", cantidad: 2, precio: 2.79 }
      ],
      subtotal: 13.56,
      impuesto: 1.21,
      total: 14.77,
      metodoPago: "Efectivo",
      tarjetaLealtad: true
    },
    {
      transaccionId: 20002,
      fecha: new Date("2025-11-28T10:32:45"),
      cajero: "Juan Ramírez",
      articulos: [
        { productoId: 2, nombreProducto: "Jarritos Tamarindo", cantidad: 3, precio: 1.99 },
        { productoId: 7, nombreProducto: "Takis Fuego", cantidad: 1, precio: 2.99 }
      ],
      subtotal: 8.96,
      impuesto: 0.80,
      total: 9.76,
      metodoPago: "Tarjeta Débito",
      tarjetaLealtad: false
    },
    {
      transaccionId: 20003,
      fecha: new Date("2025-11-28T11:05:12"),
      cajero: "María González",
      articulos: [
        { productoId: 11, nombreProducto: "Tacos al Pastor", cantidad: 2, precio: 5.99 },
        { productoId: 4, nombreProducto: "Agua Mineral Topo Chico", cantidad: 2, precio: 1.79 }
      ],
      subtotal: 15.56,
      impuesto: 1.39,
      total: 16.95,
      metodoPago: "Efectivo",
      tarjetaLealtad: true
    },
    {
      transaccionId: 20004,
      fecha: new Date("2025-11-28T11:45:30"),
      cajero: "Carlos López",
      articulos: [
        { productoId: 16, nombreProducto: "Mazapán De La Rosa", cantidad: 5, precio: 0.99 },
        { productoId: 17, nombreProducto: "Paleta Payaso", cantidad: 3, precio: 1.19 }
      ],
      subtotal: 8.52,
      impuesto: 0.76,
      total: 9.28,
      metodoPago: "Efectivo",
      tarjetaLealtad: false
    },
  ];

  private empleados: Empleado[] = [
    { id: 1, nombre: "Roberto Sánchez", puesto: "Gerente", tarifaPorHora: 22.50, horasTrabajadas: 44, preferenciasTurno: "Mañana", estado: "Activo" },
    { id: 2, nombre: "María González", puesto: "Subgerente", tarifaPorHora: 18.00, horasTrabajadas: 40, preferenciasTurno: "Tarde", estado: "Activo" },
    { id: 3, nombre: "Juan Ramírez", puesto: "Cajero", tarifaPorHora: 14.50, horasTrabajadas: 36, preferenciasTurno: "Mañana", estado: "En Descanso" },
    { id: 4, nombre: "Carmen Flores", puesto: "Cajero", tarifaPorHora: 14.50, horasTrabajadas: 32, preferenciasTurno: "Tarde", estado: "Fuera de Servicio" },
    { id: 5, nombre: "Carlos López", puesto: "Almacenista", tarifaPorHora: 15.00, horasTrabajadas: 40, preferenciasTurno: "Noche", estado: "Activo" },
    { id: 6, nombre: "Rosa Hernández", puesto: "Turno Noche", tarifaPorHora: 16.50, horasTrabajadas: 40, preferenciasTurno: "Noche", estado: "Fuera de Servicio" },
  ];

  private turnos: Turno[] = [
    { turnoId: 1, empleadoId: 1, nombreEmpleado: "Roberto Sánchez", fecha: new Date("2025-11-28"), horaInicio: "06:00", horaFin: "14:00", duracion: 8, puesto: "Gerente", estado: "En Progreso" },
    { turnoId: 2, empleadoId: 3, nombreEmpleado: "Juan Ramírez", fecha: new Date("2025-11-28"), horaInicio: "07:00", horaFin: "15:00", duracion: 8, puesto: "Cajero", estado: "En Progreso" },
    { turnoId: 3, empleadoId: 2, nombreEmpleado: "María González", fecha: new Date("2025-11-28"), horaInicio: "14:00", horaFin: "22:00", duracion: 8, puesto: "Subgerente", estado: "Programado" },
    { turnoId: 4, empleadoId: 4, nombreEmpleado: "Carmen Flores", fecha: new Date("2025-11-28"), horaInicio: "15:00", horaFin: "23:00", duracion: 8, puesto: "Cajero", estado: "Programado" },
    { turnoId: 5, empleadoId: 6, nombreEmpleado: "Rosa Hernández", fecha: new Date("2025-11-28"), horaInicio: "22:00", horaFin: "06:00", duracion: 8, puesto: "Turno Noche", estado: "Programado" },
  ];

  private bombasCombustible: BombaCombustible[] = [
    { bombaId: 1, tipo: "Regular", precioPorGalon: 2.89, galonesVendidosHoy: 1156, ingresoHoy: 3340.84, estado: "Activa" },
    { bombaId: 2, tipo: "Regular", precioPorGalon: 2.89, galonesVendidosHoy: 1089, ingresoHoy: 3147.21, estado: "Activa" },
    { bombaId: 3, tipo: "Plus", precioPorGalon: 3.19, galonesVendidosHoy: 534, ingresoHoy: 1703.46, estado: "Activa" },
    { bombaId: 4, tipo: "Premium", precioPorGalon: 3.49, galonesVendidosHoy: 389, ingresoHoy: 1357.61, estado: "Activa" },
    { bombaId: 5, tipo: "Diésel", precioPorGalon: 3.29, galonesVendidosHoy: 867, ingresoHoy: 2852.43, estado: "Activa" },
    { bombaId: 6, tipo: "Regular", precioPorGalon: 2.89, galonesVendidosHoy: 0, ingresoHoy: 0, estado: "Mantenimiento" },
  ];

  private pedidosProveedores: PedidoProveedor[] = [
    {
      pedidoId: 6001,
      proveedor: "Novamex (Jarritos)",
      categoria: "Bebidas",
      articulos: 200,
      fechaPedido: new Date("2025-11-26"),
      entregaEsperada: new Date("2025-11-29"),
      costoTotal: 385.00,
      estado: "Enviado"
    },
    {
      pedidoId: 6002,
      proveedor: "PepsiCo México",
      categoria: "Botanas",
      articulos: 160,
      fechaPedido: new Date("2025-11-27"),
      entregaEsperada: new Date("2025-11-30"),
      costoTotal: 295.50,
      estado: "Pendiente"
    },
    {
      pedidoId: 6003,
      proveedor: "Tortillería El Ranchero",
      categoria: "Tortillería",
      articulos: 80,
      fechaPedido: new Date("2025-11-27"),
      entregaEsperada: new Date("2025-11-29"),
      costoTotal: 185.75,
      estado: "Enviado"
    },
  ];

  private incidentesSeguridad: IncidenteSeguridad[] = [
    {
      incidenteId: 4001,
      fecha: new Date("2025-11-27T16:23:00"),
      tipo: "Robo",
      descripcion: "Cliente salió sin pagar bebida",
      empleadoReporta: "María González",
      resuelto: true,
      perdidaEstimada: 1.99
    },
    {
      incidenteId: 4002,
      fecha: new Date("2025-11-27T23:15:00"),
      tipo: "Actividad Sospechosa",
      descripcion: "Persona merodeando en estacionamiento",
      empleadoReporta: "Rosa Hernández",
      resuelto: true,
      perdidaEstimada: 0
    },
  ];

  private siguienteTransaccionId = 20005;
  private siguientePedidoId = 6004;
  private siguienteIncidenteId = 4003;

  // Métodos de acceso
  obtenerInventario(): Producto[] { return [...this.inventario]; }
  obtenerTransacciones(): Transaccion[] { return [...this.transacciones]; }
  obtenerEmpleados(): Empleado[] { return [...this.empleados]; }
  obtenerTurnos(): Turno[] { return [...this.turnos]; }
  obtenerBombasCombustible(): BombaCombustible[] { return [...this.bombasCombustible]; }
  obtenerPedidosProveedores(): PedidoProveedor[] { return [...this.pedidosProveedores]; }
  obtenerIncidentesSeguridad(): IncidenteSeguridad[] { return [...this.incidentesSeguridad]; }

  // Agregar transacción
  agregarTransaccion(transaccion: Omit<Transaccion, "transaccionId">): Transaccion {
    const nuevaTransaccion: Transaccion = { ...transaccion, transaccionId: this.siguienteTransaccionId++ };
    this.transacciones.push(nuevaTransaccion);
    return nuevaTransaccion;
  }

  // Obtener producto por ID
  obtenerProductoPorId(id: number): Producto | undefined {
    return this.inventario.find(p => p.id === id);
  }

  // Actualizar inventario
  actualizarInventario(productoId: number, cambio: number): boolean {
    const producto = this.inventario.find(p => p.id === productoId);
    if (producto) {
      producto.cantidad += cambio;
      return true;
    }
    return false;
  }

  // Métricas del negocio
  obtenerMetricasNegocio() {
    const ingresoTotal = this.transacciones.reduce((sum, t) => sum + t.total, 0);
    const totalTransacciones = this.transacciones.length;
    const valorPromedioTransaccion = totalTransacciones > 0 ? ingresoTotal / totalTransacciones : 0;

    const valorInventario = this.inventario.reduce((sum, p) => sum + (p.cantidad * p.costoUnitario), 0);
    const valorVentaInventario = this.inventario.reduce((sum, p) => sum + (p.cantidad * p.precioVenta), 0);
    const gananciaPotencial = valorVentaInventario - valorInventario;

    const ingresoCombustible = this.bombasCombustible.reduce((sum, p) => sum + p.ingresoHoy, 0);
    const totalGalonesVendidos = this.bombasCombustible.reduce((sum, p) => sum + p.galonesVendidosHoy, 0);

    const bajoStock = this.inventario.filter(p => p.cantidad <= p.puntoReorden).length;

    const transaccionesLealtad = this.transacciones.filter(t => t.tarjetaLealtad).length;
    const tasaLealtad = totalTransacciones > 0 ? (transaccionesLealtad / totalTransacciones) * 100 : 0;

    return {
      ingresoTotal,
      totalTransacciones,
      valorPromedioTransaccion,
      valorInventario,
      valorVentaInventario,
      gananciaPotencial,
      ingresoCombustible,
      totalGalonesVendidos,
      bajoStock,
      tasaLealtad,
      ingresoTotalDiario: ingresoTotal + ingresoCombustible,
    };
  }

  // Métricas de empleados
  obtenerMetricasEmpleados() {
    const horasTotales = this.empleados.reduce((sum, e) => sum + e.horasTrabajadas, 0);
    const nominaTotal = this.empleados.reduce((sum, e) => sum + (e.horasTrabajadas * e.tarifaPorHora), 0);
    const tarifaPromedioHora = this.empleados.length > 0
      ? this.empleados.reduce((sum, e) => sum + e.tarifaPorHora, 0) / this.empleados.length
      : 0;

    const empleadosActivos = this.empleados.filter(e => e.estado === "Activo").length;

    return {
      totalEmpleados: this.empleados.length,
      empleadosActivos,
      horasTotales,
      nominaTotal,
      tarifaPromedioHora,
    };
  }

  // Agregar pedido proveedor
  agregarPedidoProveedor(pedido: Omit<PedidoProveedor, "pedidoId">): PedidoProveedor {
    const nuevoPedido: PedidoProveedor = { ...pedido, pedidoId: this.siguientePedidoId++ };
    this.pedidosProveedores.push(nuevoPedido);
    return nuevoPedido;
  }

  // Agregar incidente de seguridad
  agregarIncidenteSeguridad(incidente: Omit<IncidenteSeguridad, "incidenteId">): IncidenteSeguridad {
    const nuevoIncidente: IncidenteSeguridad = { ...incidente, incidenteId: this.siguienteIncidenteId++ };
    this.incidentesSeguridad.push(nuevoIncidente);
    return nuevoIncidente;
  }
}

// ============================================================================
// APLICACIÓN CLI PRINCIPAL
// ============================================================================

class LaTienditaCLI {
  private bd: BaseDatosLaTiendita;
  private logger: Logger;
  private ejecutando = true;

  constructor() {
    this.bd = new BaseDatosLaTiendita();
    this.logger = new Logger(
      new ConfigBuilder()
        .theme(neonTheme)
        .namespace("LaTiendita")
        .logLevel("info")
        .timestampFormat("HH:mm:ss")
        .enableHistory(true)
        .maxHistorySize(1000)
        .build()
    );
  }

  private mostrarBanner() {
    console.clear();
    console.log("");
    BannerRenderer.render({
      title: "🏪 LA TIENDITA",
      subtitle: "Plataforma de Operaciones Empresariales • Oklahoma City, OK",
      description: "Punto de Venta • Inventario • Gasolina • Servicio 24/7",
      version: "v2.5.1",
      author: "Equipo de Operaciones La Tiendita",
      width: 100,
      style: "double",
      color: ColorSystem.codes.brightGreen,
    });
    console.log("");

    BoxRenderer.render(
      [
        `📍 Ubicación: 2615 SW 29th St, Oklahoma City, OK 73119`,
        `📞 Teléfono: (405) 555-TIEN (8436)`,
        `🌐 Email: operaciones@latiendita-okc.com`,
        `⏰ Horario: Abierto 24 Horas • 7 Días a la Semana`,
      ],
      {
        title: "Información de la Tienda",
        style: "rounded",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );
    console.log("");
  }

  private async mostrarMenuPrincipal(): Promise<string> {
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" MENÚ PRINCIPAL DE OPERACIONES", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    return await InteractivePrompts.select(
      "Seleccione una opción:",
      [
        { label: "📊 Tablero Ejecutivo", value: "tablero" },
        { label: "📦 Gestión de Inventario", value: "inventario" },
        { label: "💳 Transacciones de Caja", value: "transacciones" },
        { label: "👥 Administración de Empleados", value: "empleados" },
        { label: "📅 Programación de Turnos", value: "turnos" },
        { label: "⛽ Operaciones de Gasolina", value: "gasolina" },
        { label: "📋 Pedidos a Proveedores", value: "proveedores" },
        { label: "🔒 Seguridad y Prevención", value: "seguridad" },
        { label: "📈 Análisis de Ventas", value: "analisis" },
        { label: "➕ Nueva Venta", value: "nueva-venta" },
        { label: "⚡ Simulación de Operación Diaria", value: "simulacion" },
        { label: "🚪 Salir", value: "salir" },
      ]
    );
  }

  // ========================================================================
  // TABLERO EJECUTIVO
  // ========================================================================

  private async verTablero() {
    this.logger.info("Cargando tablero ejecutivo...");

    const spinner = new Spinner({ message: "Recopilando datos operacionales en tiempo real..." });
    spinner.start();
    await sleep(1200);
    spinner.succeed("Tablero listo");

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" TABLERO EJECUTIVO - LA TIENDITA", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    const ahora = new Date();
    const metricas = this.bd.obtenerMetricasNegocio();
    const metricasEmp = this.bd.obtenerMetricasEmpleados();

    BoxRenderer.render(
      [
        `📅 Fecha: ${ahora.toLocaleDateString()} ${ahora.toLocaleTimeString()}`,
        `🏢 Estado de la Tienda: ${ColorSystem.colorize("ABIERTA 24/7", ColorSystem.codes.brightGreen)}`,
        `👥 Empleados en Sitio: ${ColorSystem.colorize(`${metricasEmp.empleadosActivos}/${metricasEmp.totalEmpleados}`, ColorSystem.codes.brightCyan)}`,
        `⛽ Bombas Activas: ${ColorSystem.colorize("5/6", ColorSystem.codes.brightYellow)}`,
        `💰 Ingresos de Hoy: ${ColorSystem.colorize(Formatter.currency(metricas.ingresoTotalDiario), ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🏢 Estado Actual",
        style: "double",
        color: ColorSystem.codes.brightGreen,
        padding: 1,
      }
    );

    console.log("");

    // Desglose de ingresos
    BoxRenderer.render(
      [
        `💳 Ventas de Tienda: ${ColorSystem.colorize(Formatter.currency(metricas.ingresoTotal), ColorSystem.codes.brightGreen)}`,
        `⛽ Ingresos de Gasolina: ${ColorSystem.colorize(Formatter.currency(metricas.ingresoCombustible), ColorSystem.codes.cyan)}`,
        `📊 Total de Transacciones: ${ColorSystem.colorize(String(metricas.totalTransacciones), ColorSystem.codes.yellow)}`,
        `💵 Promedio por Venta: ${Formatter.currency(metricas.valorPromedioTransaccion)}`,
        `🎯 Uso de Tarjeta Lealtad: ${ColorSystem.colorize(`${metricas.tasaLealtad.toFixed(1)}%`, ColorSystem.codes.magenta)}`,
      ],
      {
        title: "💰 Resumen de Ingresos",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");

    // Ventas de gasolina por bomba
    const bombas = this.bd.obtenerBombasCombustible().filter(b => b.estado === "Activa");
    console.log(ColorSystem.colorize("⛽ Ventas de Gasolina por Bomba:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      bombas.map(b => ({ label: `Bomba ${b.bombaId} (${b.tipo})`, value: b.galonesVendidosHoy })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");

    // Alertas de inventario
    BoxRenderer.render(
      [
        `📦 Valor Total Inventario: ${ColorSystem.colorize(Formatter.currency(metricas.valorInventario), ColorSystem.codes.cyan)}`,
        `💎 Valor de Venta: ${ColorSystem.colorize(Formatter.currency(metricas.valorVentaInventario), ColorSystem.codes.green)}`,
        `📈 Ganancia Potencial: ${ColorSystem.colorize(Formatter.currency(metricas.gananciaPotencial), ColorSystem.codes.brightGreen)}`,
        `⚠️  Productos con Poco Stock: ${ColorSystem.colorize(String(metricas.bajoStock), metricas.bajoStock > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
      ],
      {
        title: "📦 Salud del Inventario",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Tablero ejecutivo mostrado exitosamente");
  }

  // ========================================================================
  // INVENTARIO
  // ========================================================================

  private async verInventario() {
    this.logger.info("Cargando datos de inventario...");

    const spinner = new Spinner({ message: "Escaneando base de datos de inventario..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Inventario cargado");

    const inventario = this.bd.obtenerInventario();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(` GESTIÓN DE INVENTARIO (${inventario.length} Productos)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    TableRenderer.render(
      inventario,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "nombre", label: "Nombre del Producto", width: 26 },
        { key: "categoria", label: "Categoría", width: 14 },
        { key: "codigo", label: "Código", width: 11 },
        {
          key: "cantidad",
          label: "Stock",
          width: 8,
          align: "right",
          formatter: (cant: number) => {
            const cantStr = String(cant);
            if (cant < 30) return ColorSystem.colorize(cantStr, ColorSystem.codes.red);
            if (cant < 60) return ColorSystem.colorize(cantStr, ColorSystem.codes.yellow);
            return ColorSystem.colorize(cantStr, ColorSystem.codes.green);
          }
        },
        {
          key: "costoUnitario",
          label: "Costo",
          width: 9,
          align: "right",
          formatter: (costo: number) => Formatter.currency(costo)
        },
        {
          key: "precioVenta",
          label: "Venta",
          width: 9,
          align: "right",
          formatter: (precio: number) => Formatter.currency(precio)
        },
        {
          key: "puntoReorden",
          label: "Reorden",
          width: 8,
          align: "right"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Alertas de bajo stock
    const bajoStock = inventario.filter(p => p.cantidad <= p.puntoReorden);
    if (bajoStock.length > 0) {
      console.log(ColorSystem.colorize("⚠️  ALERTAS DE BAJO STOCK - SE NECESITA REORDEN:", ColorSystem.codes.red));
      bajoStock.forEach(p => {
        console.log(
          ColorSystem.colorize(
            `   • ${p.nombre} (${p.codigo}): ${p.cantidad} unidades (reordenar en ${p.puntoReorden})`,
            ColorSystem.codes.yellow
          )
        );
      });
      console.log("");
    }

    // Desglose por categoría
    const categorias = ["Bebidas", "Botanas", "Tortillería", "Comida Caliente", "Abarrotes", "Dulces", "Otros"];
    console.log(ColorSystem.colorize("📊 Inventario por Categoría:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      categorias.map(cat => ({
        label: cat,
        value: inventario.filter(p => p.categoria === cat).reduce((sum, p) => sum + p.cantidad, 0)
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightMagenta,
      }
    );

    console.log("");

    // Resumen
    const valorTotal = inventario.reduce((sum, p) => sum + (p.cantidad * p.costoUnitario), 0);
    const valorVenta = inventario.reduce((sum, p) => sum + (p.cantidad * p.precioVenta), 0);
    const unidadesTotales = inventario.reduce((sum, p) => sum + p.cantidad, 0);

    BoxRenderer.render(
      [
        `Total de Unidades: ${ColorSystem.colorize(Formatter.number(unidadesTotales), ColorSystem.codes.brightCyan)}`,
        `Costo de Inventario: ${ColorSystem.colorize(Formatter.currency(valorTotal), ColorSystem.codes.yellow)}`,
        `Valor de Venta: ${ColorSystem.colorize(Formatter.currency(valorVenta), ColorSystem.codes.brightGreen)}`,
        `Margen Potencial: ${ColorSystem.colorize(Formatter.currency(valorVenta - valorTotal), ColorSystem.codes.green)}`,
        `Productos con Bajo Stock: ${ColorSystem.colorize(String(bajoStock.length), bajoStock.length > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
      ],
      {
        title: "📊 Resumen de Inventario",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Análisis de inventario completo");
  }

  // ========================================================================
  // TRANSACCIONES
  // ========================================================================

  private async verTransacciones() {
    this.logger.info("Cargando historial de transacciones...");

    const spinner = new Spinner({ message: "Recuperando transacciones de caja..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Transacciones cargadas");

    const transacciones = this.bd.obtenerTransacciones();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log(ColorSystem.colorize(` TRANSACCIONES DE CAJA (${transacciones.length} Hoy)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightBlue));
    console.log("");

    TableRenderer.render(
      transacciones,
      [
        { key: "transaccionId", label: "Trans #", width: 8, align: "right" },
        {
          key: "fecha",
          label: "Hora",
          width: 10,
          formatter: (fecha: Date) => fecha.toLocaleTimeString()
        },
        { key: "cajero", label: "Cajero", width: 18 },
        {
          key: "articulos",
          label: "Arts",
          width: 6,
          align: "center",
          formatter: (arts: Array<unknown>) => String(arts.length)
        },
        {
          key: "subtotal",
          label: "Subtotal",
          width: 10,
          align: "right",
          formatter: (amt: number) => Formatter.currency(amt)
        },
        {
          key: "impuesto",
          label: "Imp",
          width: 8,
          align: "right",
          formatter: (amt: number) => Formatter.currency(amt)
        },
        {
          key: "total",
          label: "Total",
          width: 10,
          align: "right",
          formatter: (amt: number) => ColorSystem.colorize(Formatter.currency(amt), ColorSystem.codes.brightGreen)
        },
        {
          key: "metodoPago",
          label: "Pago",
          width: 14,
          formatter: (metodo: string) => {
            const colores: Record<string, string> = {
              "Efectivo": ColorSystem.codes.green,
              "Tarjeta Crédito": ColorSystem.codes.cyan,
              "Tarjeta Débito": ColorSystem.codes.blue,
              "EBT": ColorSystem.codes.yellow,
              "Móvil": ColorSystem.codes.magenta,
            };
            return ColorSystem.colorize(metodo, colores[metodo] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Distribución de métodos de pago
    const metodosPago = ["Efectivo", "Tarjeta Crédito", "Tarjeta Débito", "EBT", "Móvil"];
    console.log(ColorSystem.colorize("💳 Distribución de Métodos de Pago:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      metodosPago.map(metodo => ({
        label: metodo,
        value: transacciones.filter(t => t.metodoPago === metodo).length
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.brightBlue,
      }
    );

    console.log("");

    // Resumen
    const ingresoTotal = transacciones.reduce((sum, t) => sum + t.total, 0);
    const impuestoTotal = transacciones.reduce((sum, t) => sum + t.impuesto, 0);
    const promedioTransaccion = transacciones.length > 0 ? ingresoTotal / transacciones.length : 0;
    const conteoLealtad = transacciones.filter(t => t.tarjetaLealtad).length;

    BoxRenderer.render(
      [
        `💰 Ingreso Total: ${ColorSystem.colorize(Formatter.currency(ingresoTotal), ColorSystem.codes.brightGreen)}`,
        `📊 Transacciones: ${ColorSystem.colorize(String(transacciones.length), ColorSystem.codes.cyan)}`,
        `💵 Promedio por Venta: ${Formatter.currency(promedioTransaccion)}`,
        `🏛️  Impuestos Cobrados: ${Formatter.currency(impuestoTotal)}`,
        `🎯 Uso de Lealtad: ${ColorSystem.colorize(`${conteoLealtad}/${transacciones.length}`, ColorSystem.codes.magenta)} (${transacciones.length > 0 ? ((conteoLealtad / transacciones.length) * 100).toFixed(1) : 0}%)`,
      ],
      {
        title: "💳 Resumen de Transacciones",
        style: "rounded",
        color: ColorSystem.codes.blue,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Historial de transacciones mostrado");
  }

  // ========================================================================
  // EMPLEADOS
  // ========================================================================

  private async verEmpleados() {
    this.logger.info("Cargando datos de empleados...");

    const spinner = new Spinner({ message: "Accediendo a base de datos de recursos humanos..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Datos de empleados cargados");

    const empleados = this.bd.obtenerEmpleados();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(` ADMINISTRACIÓN DE EMPLEADOS (${empleados.length} Miembros del Personal)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    TableRenderer.render(
      empleados,
      [
        { key: "id", label: "ID", width: 4, align: "right" },
        { key: "nombre", label: "Nombre del Empleado", width: 20 },
        { key: "puesto", label: "Puesto", width: 16 },
        {
          key: "tarifaPorHora",
          label: "Tarifa/Hora",
          width: 12,
          align: "right",
          formatter: (tarifa: number) => Formatter.currency(tarifa)
        },
        {
          key: "horasTrabajadas",
          label: "Horas",
          width: 8,
          align: "right"
        },
        { key: "preferenciasTurno", label: "Turno Pref", width: 12 },
        {
          key: "estado",
          label: "Estado",
          width: 18,
          formatter: (estado: string) => {
            const colores: Record<string, string> = {
              "Activo": ColorSystem.codes.brightGreen,
              "Fuera de Servicio": ColorSystem.codes.yellow,
              "En Descanso": ColorSystem.codes.cyan,
            };
            return ColorSystem.colorize(estado, colores[estado] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Desglose de nómina
    console.log(ColorSystem.colorize("💰 Desglose de Nómina Semanal:", ColorSystem.codes.bright));
    console.log("");

    const nomina = empleados.map(e => ({
      label: e.nombre,
      value: e.horasTrabajadas * e.tarifaPorHora
    }));

    ChartRenderer.barChart(nomina, {
      showValues: true,
      width: 40,
      color: ColorSystem.codes.brightGreen,
    });

    console.log("");

    // Resumen
    const horasTotales = empleados.reduce((sum, e) => sum + e.horasTrabajadas, 0);
    const nominaTotal = empleados.reduce((sum, e) => sum + (e.horasTrabajadas * e.tarifaPorHora), 0);
    const tarifaPromedioHora = empleados.length > 0
      ? empleados.reduce((sum, e) => sum + e.tarifaPorHora, 0) / empleados.length
      : 0;
    const conteoActivos = empleados.filter(e => e.estado === "Activo").length;

    BoxRenderer.render(
      [
        `👥 Total de Empleados: ${ColorSystem.colorize(String(empleados.length), ColorSystem.codes.cyan)}`,
        `✅ Actualmente Activos: ${ColorSystem.colorize(String(conteoActivos), ColorSystem.codes.brightGreen)}`,
        `⏰ Total de Horas: ${ColorSystem.colorize(Formatter.number(horasTotales), ColorSystem.codes.yellow)}`,
        `💵 Nómina Semanal: ${ColorSystem.colorize(Formatter.currency(nominaTotal), ColorSystem.codes.brightGreen)}`,
        `📊 Tarifa Promedio por Hora: ${Formatter.currency(tarifaPromedioHora)}`,
      ],
      {
        title: "👥 Resumen de Empleados",
        style: "double",
        color: ColorSystem.codes.green,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Datos de empleados mostrados");
  }

  // ========================================================================
  // TURNOS
  // ========================================================================

  private async verTurnos() {
    this.logger.info("Cargando programación de turnos...");

    const spinner = new Spinner({ message: "Recuperando datos de programación..." });
    spinner.start();
    await sleep(800);
    spinner.succeed("Programación de turnos cargada");

    const turnos = this.bd.obtenerTurnos();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(` PROGRAMACIÓN DE TURNOS (${turnos.length} Turnos Hoy)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    TableRenderer.render(
      turnos,
      [
        { key: "turnoId", label: "Turno", width: 6, align: "center" },
        { key: "nombreEmpleado", label: "Empleado", width: 20 },
        { key: "puesto", label: "Puesto", width: 16 },
        { key: "horaInicio", label: "Inicio", width: 10, align: "center" },
        { key: "horaFin", label: "Fin", width: 10, align: "center" },
        {
          key: "duracion",
          label: "Horas",
          width: 8,
          align: "right"
        },
        {
          key: "estado",
          label: "Estado",
          width: 14,
          formatter: (estado: string) => {
            const colores: Record<string, string> = {
              "Programado": ColorSystem.codes.yellow,
              "En Progreso": ColorSystem.codes.brightGreen,
              "Completado": ColorSystem.codes.green,
              "Cancelado": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(estado, colores[estado] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Línea de tiempo de cobertura de 24 horas
    console.log(ColorSystem.colorize("📅 Línea de Tiempo de Cobertura 24 Horas:", ColorSystem.codes.bright));
    console.log("");
    console.log(ColorSystem.colorize("  00:00 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 24:00", ColorSystem.codes.dim));

    turnos.forEach(turno => {
      const inicio = parseInt(turno.horaInicio.split(":")[0]);
      const fin = parseInt(turno.horaFin.split(":")[0]);
      const espacios = " ".repeat(inicio * 2);
      const barras = "█".repeat((fin > inicio ? fin - inicio : 24 - inicio + fin) * 2);
      console.log(ColorSystem.colorize(`  ${espacios}${barras}`, ColorSystem.codes.brightCyan) + ColorSystem.colorize(` ${turno.nombreEmpleado} (${turno.puesto})`, ColorSystem.codes.dim));
    });

    console.log("");

    // Resumen
    const enProgreso = turnos.filter(t => t.estado === "En Progreso").length;
    const programados = turnos.filter(t => t.estado === "Programado").length;
    const horasTotales = turnos.reduce((sum, t) => sum + t.duracion, 0);

    BoxRenderer.render(
      [
        `📅 Total de Turnos Hoy: ${ColorSystem.colorize(String(turnos.length), ColorSystem.codes.cyan)}`,
        `🟢 En Progreso: ${ColorSystem.colorize(String(enProgreso), ColorSystem.codes.brightGreen)}`,
        `🟡 Programados: ${ColorSystem.colorize(String(programados), ColorSystem.codes.yellow)}`,
        `⏰ Total Horas de Cobertura: ${ColorSystem.colorize(String(horasTotales), ColorSystem.codes.brightCyan)}`,
        `✅ Cobertura 24/7: ${ColorSystem.colorize("ACTIVA", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "📅 Resumen de Turnos",
        style: "rounded",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Programación de turnos mostrada");
  }

  // ========================================================================
  // GASOLINA
  // ========================================================================

  private async verGasolina() {
    this.logger.info("Cargando operaciones de gasolina...");

    const spinner = new Spinner({ message: "Sincronizando con sistema de gestión de combustible..." });
    spinner.start();
    await sleep(950);
    spinner.succeed("Datos de gasolina cargados");

    const bombas = this.bd.obtenerBombasCombustible();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(` OPERACIONES DE GASOLINA (${bombas.length} Bombas)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    TableRenderer.render(
      bombas,
      [
        { key: "bombaId", label: "Bomba", width: 6, align: "center" },
        { key: "tipo", label: "Tipo", width: 12 },
        {
          key: "precioPorGalon",
          label: "Precio/Gal",
          width: 12,
          align: "right",
          formatter: (precio: number) => Formatter.currency(precio)
        },
        {
          key: "galonesVendidosHoy",
          label: "Galones Vendidos",
          width: 16,
          align: "right",
          formatter: (gal: number) => Formatter.number(gal)
        },
        {
          key: "ingresoHoy",
          label: "Ingreso",
          width: 14,
          align: "right",
          formatter: (ing: number) => ColorSystem.colorize(Formatter.currency(ing), ColorSystem.codes.brightGreen)
        },
        {
          key: "estado",
          label: "Estado",
          width: 18,
          formatter: (estado: string) => {
            const colores: Record<string, string> = {
              "Activa": ColorSystem.codes.brightGreen,
              "Fuera de Servicio": ColorSystem.codes.red,
              "Mantenimiento": ColorSystem.codes.yellow,
            };
            return ColorSystem.colorize(estado, colores[estado] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: false }
    );

    console.log("");

    // Ventas por tipo de gasolina
    const tipos = ["Regular", "Plus", "Premium", "Diésel"];
    console.log(ColorSystem.colorize("⛽ Ventas por Tipo de Gasolina:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      tipos.map(tipo => ({
        label: tipo,
        value: bombas.filter(b => b.tipo === tipo && b.estado === "Activa").reduce((sum, b) => sum + b.ingresoHoy, 0)
      })),
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightYellow,
      }
    );

    console.log("");

    // Resumen
    const bombasActivas = bombas.filter(b => b.estado === "Activa").length;
    const galonesTotales = bombas.reduce((sum, b) => sum + b.galonesVendidosHoy, 0);
    const ingresoTotal = bombas.reduce((sum, b) => sum + b.ingresoHoy, 0);
    const precioPromedioPorGalon = galonesTotales > 0 ? ingresoTotal / galonesTotales : 0;

    BoxRenderer.render(
      [
        `⛽ Bombas Activas: ${ColorSystem.colorize(`${bombasActivas}/${bombas.length}`, ColorSystem.codes.brightGreen)}`,
        `🛢️  Total de Galones Vendidos: ${ColorSystem.colorize(Formatter.number(galonesTotales), ColorSystem.codes.cyan)}`,
        `💰 Ingreso de Gasolina: ${ColorSystem.colorize(Formatter.currency(ingresoTotal), ColorSystem.codes.brightGreen)}`,
        `📊 Precio Promedio/Galón: ${Formatter.currency(precioPromedioPorGalon)}`,
        `📈 Utilización de Bombas: ${ColorSystem.colorize(`${((bombasActivas / bombas.length) * 100).toFixed(1)}%`, ColorSystem.codes.yellow)}`,
      ],
      {
        title: "⛽ Resumen de Operaciones de Gasolina",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Operaciones de gasolina mostradas");
  }

  // ========================================================================
  // PROVEEDORES
  // ========================================================================

  private async verProveedores() {
    this.logger.info("Cargando pedidos a proveedores...");

    const spinner = new Spinner({ message: "Recuperando datos de cadena de suministro..." });
    spinner.start();
    await sleep(850);
    spinner.succeed("Pedidos a proveedores cargados");

    const pedidos = this.bd.obtenerPedidosProveedores();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(` PEDIDOS A PROVEEDORES (${pedidos.length} Pedidos Activos)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    TableRenderer.render(
      pedidos,
      [
        { key: "pedidoId", label: "Pedido #", width: 9, align: "right" },
        { key: "proveedor", label: "Proveedor", width: 24 },
        { key: "categoria", label: "Categoría", width: 12 },
        {
          key: "articulos",
          label: "Arts",
          width: 8,
          align: "right"
        },
        {
          key: "fechaPedido",
          label: "Pedido",
          width: 12,
          formatter: (fecha: Date) => fecha.toLocaleDateString()
        },
        {
          key: "entregaEsperada",
          label: "Entrega",
          width: 12,
          formatter: (fecha: Date) => fecha.toLocaleDateString()
        },
        {
          key: "costoTotal",
          label: "Total",
          width: 12,
          align: "right",
          formatter: (costo: number) => Formatter.currency(costo)
        },
        {
          key: "estado",
          label: "Estado",
          width: 12,
          formatter: (estado: string) => {
            const colores: Record<string, string> = {
              "Pendiente": ColorSystem.codes.yellow,
              "Enviado": ColorSystem.codes.cyan,
              "Entregado": ColorSystem.codes.brightGreen,
              "Cancelado": ColorSystem.codes.red,
            };
            return ColorSystem.colorize(estado, colores[estado] || ColorSystem.codes.white);
          }
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Resumen
    const costoTotal = pedidos.reduce((sum, p) => sum + p.costoTotal, 0);
    const articulosTotales = pedidos.reduce((sum, p) => sum + p.articulos, 0);
    const pendientes = pedidos.filter(p => p.estado === "Pendiente").length;
    const enviados = pedidos.filter(p => p.estado === "Enviado").length;

    BoxRenderer.render(
      [
        `📦 Total de Pedidos: ${ColorSystem.colorize(String(pedidos.length), ColorSystem.codes.cyan)}`,
        `📊 Total de Artículos: ${ColorSystem.colorize(Formatter.number(articulosTotales), ColorSystem.codes.yellow)}`,
        `💰 Costo Total: ${ColorSystem.colorize(Formatter.currency(costoTotal), ColorSystem.codes.green)}`,
        `⏳ Pendientes: ${ColorSystem.colorize(String(pendientes), ColorSystem.codes.yellow)}`,
        `🚚 Enviados: ${ColorSystem.colorize(String(enviados), ColorSystem.codes.cyan)}`,
      ],
      {
        title: "📋 Resumen de Pedidos a Proveedores",
        style: "rounded",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Pedidos a proveedores mostrados");
  }

  // ========================================================================
  // SEGURIDAD
  // ========================================================================

  private async verSeguridad() {
    this.logger.info("Cargando datos de seguridad...");

    const spinner = new Spinner({ message: "Accediendo a registros de seguridad..." });
    spinner.start();
    await sleep(900);
    spinner.succeed("Datos de seguridad cargados");

    const incidentes = this.bd.obtenerIncidentesSeguridad();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightRed));
    console.log(ColorSystem.colorize(` SEGURIDAD Y PREVENCIÓN DE PÉRDIDAS (${incidentes.length} Incidentes Recientes)`, ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightRed));
    console.log("");

    TableRenderer.render(
      incidentes,
      [
        { key: "incidenteId", label: "ID", width: 6, align: "right" },
        {
          key: "fecha",
          label: "Fecha/Hora",
          width: 18,
          formatter: (fecha: Date) => fecha.toLocaleString()
        },
        { key: "tipo", label: "Tipo", width: 20 },
        { key: "descripcion", label: "Descripción", width: 32 },
        { key: "empleadoReporta", label: "Reportado Por", width: 18 },
        {
          key: "resuelto",
          label: "Estado",
          width: 10,
          formatter: (resuelto: boolean) =>
            ColorSystem.colorize(resuelto ? "Resuelto" : "Abierto", resuelto ? ColorSystem.codes.green : ColorSystem.codes.red)
        },
        {
          key: "perdidaEstimada",
          label: "Pérdida",
          width: 10,
          align: "right",
          formatter: (perdida: number) => perdida > 0 ? ColorSystem.colorize(Formatter.currency(perdida), ColorSystem.codes.red) : "-"
        },
      ],
      { showIndex: true }
    );

    console.log("");

    // Tipos de incidentes
    const tipos = ["Robo", "Disputa", "Actividad Sospechosa", "Emergencia", "Otro"];
    console.log(ColorSystem.colorize("🔒 Incidentes por Tipo:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      tipos.map(tipo => ({
        label: tipo,
        value: incidentes.filter(i => i.tipo === tipo).length
      })),
      {
        showValues: true,
        width: 35,
        color: ColorSystem.codes.red,
      }
    );

    console.log("");

    // Resumen
    const perdidaTotal = incidentes.reduce((sum, i) => sum + i.perdidaEstimada, 0);
    const resueltos = incidentes.filter(i => i.resuelto).length;
    const abiertos = incidentes.filter(i => !i.resuelto).length;

    BoxRenderer.render(
      [
        `📊 Total de Incidentes: ${ColorSystem.colorize(String(incidentes.length), ColorSystem.codes.cyan)}`,
        `✅ Resueltos: ${ColorSystem.colorize(String(resueltos), ColorSystem.codes.green)}`,
        `⚠️  Abiertos: ${ColorSystem.colorize(String(abiertos), abiertos > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
        `💸 Pérdida Estimada: ${ColorSystem.colorize(Formatter.currency(perdidaTotal), perdidaTotal > 0 ? ColorSystem.codes.red : ColorSystem.codes.green)}`,
        `🎯 Tasa de Resolución: ${ColorSystem.colorize(`${incidentes.length > 0 ? ((resueltos / incidentes.length) * 100).toFixed(1) : 0}%`, ColorSystem.codes.yellow)}`,
      ],
      {
        title: "🔒 Resumen de Seguridad",
        style: "double",
        color: ColorSystem.codes.red,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Datos de seguridad mostrados");
  }

  // ========================================================================
  // ANÁLISIS
  // ========================================================================

  private async verAnalisis() {
    this.logger.info("Generando análisis de ventas...");

    const spinner = new Spinner({ message: "Analizando datos de rendimiento..." });
    spinner.start();
    await sleep(1300);
    spinner.succeed("Análisis listo");

    const metricas = this.bd.obtenerMetricasNegocio();
    const metricasEmp = this.bd.obtenerMetricasEmpleados();

    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log(ColorSystem.colorize(" ANÁLISIS DE VENTAS Y MÉTRICAS DE RENDIMIENTO", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightMagenta));
    console.log("");

    // Análisis de ingresos
    console.log(ColorSystem.colorize("💰 Análisis de Ingresos:", ColorSystem.codes.bright));
    console.log("");

    ChartRenderer.barChart(
      [
        { label: "Ventas de Tienda", value: metricas.ingresoTotal },
        { label: "Ingresos de Gasolina", value: metricas.ingresoCombustible },
        { label: "Valor de Inventario", value: metricas.valorInventario },
      ],
      {
        showValues: true,
        width: 40,
        color: ColorSystem.codes.brightGreen,
      }
    );

    console.log("");

    // Métricas de rendimiento
    console.log(ColorSystem.colorize("📊 Indicadores Clave de Rendimiento:", ColorSystem.codes.bright));
    console.log("");

    const progresoIngresos = new ProgressBar({
      total: 20000,
      width: 60,
      showValue: true,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Meta de Ingresos Diarios ($20,000):", ColorSystem.codes.dim));
    progresoIngresos.update(metricas.ingresoTotalDiario);
    progresoIngresos.complete();
    console.log("");

    const progresoLealtad = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    console.log(ColorSystem.colorize("  Uso de Tarjeta de Lealtad:", ColorSystem.codes.dim));
    progresoLealtad.update(metricas.tasaLealtad);
    progresoLealtad.complete();
    console.log("");

    const progresoMargen = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    const margenGanancia = metricas.valorVentaInventario > 0
      ? ((metricas.gananciaPotencial / metricas.valorVentaInventario) * 100)
      : 0;

    console.log(ColorSystem.colorize("  Margen de Ganancia:", ColorSystem.codes.dim));
    progresoMargen.update(margenGanancia);
    progresoMargen.complete();
    console.log("");

    // Resumen
    BoxRenderer.render(
      [
        `💰 Ingreso Diario Total: ${ColorSystem.colorize(Formatter.currency(metricas.ingresoTotalDiario), ColorSystem.codes.brightGreen)}`,
        `📊 Promedio por Transacción: ${ColorSystem.colorize(Formatter.currency(metricas.valorPromedioTransaccion), ColorSystem.codes.cyan)}`,
        `⛽ Galones de Gasolina Vendidos: ${ColorSystem.colorize(Formatter.number(metricas.totalGalonesVendidos), ColorSystem.codes.yellow)}`,
        `🎯 Uso de Lealtad: ${ColorSystem.colorize(`${metricas.tasaLealtad.toFixed(1)}%`, ColorSystem.codes.magenta)}`,
        `📈 Margen de Ganancia: ${ColorSystem.colorize(`${margenGanancia.toFixed(1)}%`, ColorSystem.codes.green)}`,
        `👥 Costo Laboral: ${ColorSystem.colorize(Formatter.currency(metricasEmp.nominaTotal), ColorSystem.codes.red)}`,
      ],
      {
        title: "📊 Tablero de Rendimiento",
        style: "double",
        color: ColorSystem.codes.magenta,
        padding: 1,
      }
    );

    console.log("");

    // Mejoras de eficiencia
    console.log(ColorSystem.colorize("🚀 Mejoras Operacionales con GenesisTrace:", ColorSystem.codes.bright));
    console.log("");

    const mejoras = [
      { metrica: "Velocidad de Procesamiento de Ventas", mejora: 45 },
      { metrica: "Precisión del Inventario", mejora: 41 },
      { metrica: "Eficiencia de Programación de Empleados", mejora: 54 },
      { metrica: "Prevención de Pérdidas", mejora: 32 },
      { metrica: "Respuesta de Servicio al Cliente", mejora: 67 },
    ];

    mejoras.forEach(mejora => {
      console.log(ColorSystem.colorize(`  ${mejora.metrica}:`, ColorSystem.codes.dim));
      const barraMejora = new ProgressBar({
        total: 100,
        width: 50,
        showValue: false,
        showPercentage: false,
        colorize: true,
      });
      barraMejora.update(mejora.mejora);
      barraMejora.complete();
      console.log(ColorSystem.colorize(`    ${ColorSystem.colorize(`↑ ${mejora.mejora}%`, ColorSystem.codes.brightGreen)} mejora`, ColorSystem.codes.dim));
      console.log("");
    });

    this.logger.success("Reporte de análisis generado exitosamente");
  }

  // ========================================================================
  // NUEVA VENTA
  // ========================================================================

  private async crearNuevaVenta() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log(ColorSystem.colorize(" NUEVA VENTA DE CAJA", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightGreen));
    console.log("");

    this.logger.info("Iniciando nueva venta de caja...");

    try {
      // Seleccionar cajero
      const empleados = this.bd.obtenerEmpleados().filter(e =>
        e.puesto === "Cajero" || e.puesto === "Gerente" || e.puesto === "Subgerente"
      );

      const cajero = await InteractivePrompts.select(
        "Seleccione Cajero:",
        empleados.map(e => ({ label: `${e.nombre} (${e.puesto})`, value: e.nombre }))
      );

      // Agregar artículos
      const articulos: Array<{ productoId: number; nombreProducto: string; cantidad: number; precio: number }> = [];
      let agregandoArticulos = true;

      while (agregandoArticulos) {
        const inventario = this.bd.obtenerInventario().filter(p => p.cantidad > 0);

        if (articulos.length > 0) {
          console.log("");
          console.log(ColorSystem.colorize("Artículos Actuales:", ColorSystem.codes.bright));
          articulos.forEach((articulo, idx) => {
            console.log(`  ${idx + 1}. ${articulo.nombreProducto} x${articulo.cantidad} - ${Formatter.currency(articulo.precio * articulo.cantidad)}`);
          });
          console.log("");
        }

        const producto = await InteractivePrompts.select(
          "Seleccione Producto:",
          [
            ...inventario.map(p => ({
              label: `${p.nombre} - ${Formatter.currency(p.precioVenta)} (${p.cantidad} en stock)`,
              value: String(p.id)
            })),
            { label: "✅ Finalizar y Cobrar", value: "finalizar" }
          ]
        );

        if (producto === "finalizar") {
          if (articulos.length === 0) {
            this.logger.error("No hay artículos en la venta");
            continue;
          }
          agregandoArticulos = false;
          break;
        }

        const productoId = parseInt(producto, 10);
        const productoSeleccionado = this.bd.obtenerProductoPorId(productoId);

        if (!productoSeleccionado) {
          this.logger.error("Producto no encontrado");
          continue;
        }

        const cantidadStr = await InteractivePrompts.input(`Cantidad para ${productoSeleccionado.nombre}:`);
        const cantidad = parseInt(cantidadStr, 10);

        if (isNaN(cantidad) || cantidad <= 0) {
          this.logger.error("Cantidad inválida");
          continue;
        }

        if (cantidad > productoSeleccionado.cantidad) {
          this.logger.error(`Solo hay ${productoSeleccionado.cantidad} unidades disponibles`);
          continue;
        }

        articulos.push({
          productoId: productoSeleccionado.id,
          nombreProducto: productoSeleccionado.nombre,
          cantidad,
          precio: productoSeleccionado.precioVenta
        });

        this.logger.success(`Agregado ${cantidad}x ${productoSeleccionado.nombre}`);
      }

      // Calcular totales
      const subtotal = articulos.reduce((sum, articulo) => sum + (articulo.precio * articulo.cantidad), 0);
      const tasaImpuesto = 0.0895; // Impuesto de ventas de Oklahoma City
      const impuesto = subtotal * tasaImpuesto;
      const total = subtotal + impuesto;

      // Seleccionar método de pago
      const metodoPago = await InteractivePrompts.select(
        "Método de Pago:",
        [
          { label: "💵 Efectivo", value: "Efectivo" },
          { label: "💳 Tarjeta de Crédito", value: "Tarjeta Crédito" },
          { label: "💳 Tarjeta de Débito", value: "Tarjeta Débito" },
          { label: "🎫 EBT/SNAP", value: "EBT" },
          { label: "📱 Pago Móvil", value: "Móvil" },
        ]
      ) as "Efectivo" | "Tarjeta Crédito" | "Tarjeta Débito" | "EBT" | "Móvil";

      // Tarjeta de lealtad
      const tarjetaLealtad = await InteractivePrompts.confirm("¿Tarjeta de lealtad escaneada?");

      // Mostrar resumen de transacción
      console.log("");
      BoxRenderer.render(
        [
          `Cajero: ${cajero}`,
          `Artículos: ${articulos.length}`,
          ``,
          ...articulos.map(articulo => `  ${articulo.nombreProducto} x${articulo.cantidad} @ ${Formatter.currency(articulo.precio)} = ${Formatter.currency(articulo.precio * articulo.cantidad)}`),
          ``,
          `Subtotal: ${Formatter.currency(subtotal)}`,
          `Impuesto (8.95%): ${Formatter.currency(impuesto)}`,
          `${ColorSystem.colorize(`Total: ${Formatter.currency(total)}`, ColorSystem.codes.brightGreen)}`,
          ``,
          `Pago: ${metodoPago}`,
          `Tarjeta de Lealtad: ${tarjetaLealtad ? "Sí" : "No"}`,
        ],
        {
          title: "💳 Resumen de Transacción",
          style: "double",
          color: ColorSystem.codes.cyan,
          padding: 1,
        }
      );
      console.log("");

      const confirmar = await InteractivePrompts.confirm("¿Completar transacción?");

      if (confirmar) {
        const spinner = new Spinner({ message: "Procesando transacción..." });
        spinner.start();
        await sleep(1000);

        // Crear transacción
        const nuevaTransaccion = this.bd.agregarTransaccion({
          fecha: new Date(),
          cajero,
          articulos,
          subtotal,
          impuesto,
          total,
          metodoPago,
          tarjetaLealtad
        });

        // Actualizar inventario
        articulos.forEach(articulo => {
          this.bd.actualizarInventario(articulo.productoId, -articulo.cantidad);
        });

        spinner.succeed(`¡Transacción #${nuevaTransaccion.transaccionId} completada!`);
        this.logger.success(`Transacción procesada: ${Formatter.currency(total)}`);

        console.log("");
        BoxRenderer.render(
          [
            `🎉 ¡Transacción #${nuevaTransaccion.transaccionId} Completa!`,
            ``,
            `Total: ${ColorSystem.colorize(Formatter.currency(total), ColorSystem.codes.brightGreen)}`,
            `Pago: ${metodoPago}`,
            ``,
            `¡Gracias por su compra en La Tiendita!`,
            tarjetaLealtad ? `✨ Puntos de lealtad agregados a su cuenta` : ``,
          ],
          {
            title: "✅ Transacción Completa",
            style: "double",
            color: ColorSystem.codes.brightGreen,
            padding: 1,
          }
        );
        console.log("");
      } else {
        this.logger.info("Transacción cancelada");
      }
    } catch (error) {
      this.logger.error("Error al procesar transacción", { error });
    }
  }

  // ========================================================================
  // SIMULACIÓN DIARIA
  // ========================================================================

  private async ejecutarSimulacionDiaria() {
    console.log("");
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log(ColorSystem.colorize(" SIMULACIÓN DE OPERACIÓN DIARIA - CICLO DE 24 HORAS", ColorSystem.codes.bright));
    console.log(ColorSystem.colorize("═".repeat(90), ColorSystem.codes.brightYellow));
    console.log("");

    this.logger.info("Iniciando simulación de operación diaria...");
    console.log("");

    // Hora pico de la mañana (6 AM - 9 AM)
    console.log(ColorSystem.colorize("☀️  Fase 1: Hora Pico de la Mañana (6:00 AM - 9:00 AM)", ColorSystem.codes.brightCyan));
    const spinnerManana = new Spinner({
      message: "Abriendo tienda, iniciando máquinas de café...",
      frames: ["◐", "◓", "◑", "◒"],
      interval: 100
    });
    spinnerManana.start();
    await sleep(800);
    spinnerManana.update("Procesando pedidos de desayuno y clientes de gasolina...");
    await sleep(900);
    spinnerManana.update("Período pico de transacciones - múltiples cajeros activos...");
    await sleep(700);
    spinnerManana.succeed("Hora pico de la mañana completada - 52 transacciones procesadas");
    console.log("");

    // Operaciones del mediodía (9 AM - 5 PM)
    console.log(ColorSystem.colorize("🌤️  Fase 2: Operaciones del Mediodía (9:00 AM - 5:00 PM)", ColorSystem.codes.brightGreen));
    const progresoMediadia = new ProgressBar({
      total: 100,
      width: 60,
      showValue: false,
      showPercentage: true,
      colorize: true,
    });

    this.logger.info("Tráfico regular de clientes y reabastecimiento de inventario...");
    for (let i = 0; i <= 35; i += 5) {
      progresoMediadia.update(i);
      await sleep(150);
    }
    this.logger.info("Hora pico de almuerzo - pico de ventas de comida caliente...");
    for (let i = 35; i <= 70; i += 5) {
      progresoMediadia.update(i);
      await sleep(150);
    }
    this.logger.info("Entregas de proveedores y actualizaciones de inventario...");
    for (let i = 70; i <= 100; i += 5) {
      progresoMediadia.update(i);
      await sleep(150);
    }
    progresoMediadia.complete();
    this.logger.success("Operaciones del mediodía completadas - 104 transacciones procesadas");
    console.log("");

    // Turno vespertino (5 PM - 11 PM)
    console.log(ColorSystem.colorize("🌆 Fase 3: Turno Vespertino (5:00 PM - 11:00 PM)", ColorSystem.codes.brightMagenta));
    const spinnerVespertino = new Spinner({
      message: "Hora pico después del trabajo - gasolina y botanas...",
      frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"],
      interval: 80
    });
    spinnerVespertino.start();
    await sleep(700);
    spinnerVespertino.update("Hora de cena - preparación de comida caliente...");
    await sleep(800);
    spinnerVespertino.update("Servicio al cliente vespertino y limpieza...");
    await sleep(600);
    spinnerVespertino.succeed("Turno vespertino completado - 68 transacciones procesadas");
    console.log("");

    // Operaciones nocturnas (11 PM - 6 AM)
    console.log(ColorSystem.colorize("🌙 Fase 4: Operaciones Nocturnas (11:00 PM - 6:00 AM)", ColorSystem.codes.brightBlue));
    const spinnerNocturno = new Spinner({
      message: "Monitoreo de seguridad y clientes de madrugada...",
      frames: ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█", "▇", "▆", "▅", "▄", "▃", "▂"],
      interval: 90
    });
    spinnerNocturno.start();
    await sleep(900);
    spinnerNocturno.update("Conteo de inventario y reabastecimiento de estantes...");
    await sleep(1000);
    spinnerNocturno.update("Limpieza de pisos y tareas de mantenimiento...");
    await sleep(800);
    spinnerNocturno.succeed("Operaciones nocturnas completadas - 31 transacciones procesadas");
    console.log("");

    // Resumen diario
    console.log(ColorSystem.colorize("📊 Resumen de Operaciones Diarias:", ColorSystem.codes.bright));
    console.log("");

    TableRenderer.render(
      [
        { turno: "Hora Pico Mañana", horas: "6 AM - 9 AM", transacciones: 52, ingreso: "$1,342.65", eficiencia: "97%" },
        { turno: "Operaciones Mediodía", horas: "9 AM - 5 PM", transacciones: 104, ingreso: "$2,678.43", eficiencia: "95%" },
        { turno: "Turno Vespertino", horas: "5 PM - 11 PM", transacciones: 68, ingreso: "$1,845.28", eficiencia: "96%" },
        { turno: "Operaciones Nocturnas", horas: "11 PM - 6 AM", transacciones: 31, ingreso: "$823.47", eficiencia: "93%" },
      ],
      [
        { key: "turno", label: "Período de Turno", width: 22 },
        { key: "horas", label: "Horas", width: 16 },
        { key: "transacciones", label: "Trans", width: 10, align: "right" },
        {
          key: "ingreso",
          label: "Ingreso",
          width: 14,
          align: "right",
          formatter: (ing: string) => ColorSystem.colorize(ing, ColorSystem.codes.brightGreen)
        },
        { key: "eficiencia", label: "Eficiencia", width: 12, align: "right" },
      ],
      { showIndex: true }
    );

    console.log("");

    BoxRenderer.render(
      [
        `✅ Total de Transacciones: ${ColorSystem.colorize("255", ColorSystem.codes.brightCyan)}`,
        `💰 Ingresos de Tienda: ${ColorSystem.colorize("$6,689.83", ColorSystem.codes.brightGreen)}`,
        `⛽ Ingresos de Gasolina: ${ColorSystem.colorize("$12,401.55", ColorSystem.codes.cyan)}`,
        `📊 Ingresos Diarios Combinados: ${ColorSystem.colorize("$19,091.38", ColorSystem.codes.brightYellow)}`,
        `🎯 Eficiencia Operacional: ${ColorSystem.colorize("95.25%", ColorSystem.codes.green)}`,
        `👥 Horas de Empleados: ${ColorSystem.colorize("40 horas", ColorSystem.codes.magenta)}`,
        `🔒 Incidentes de Seguridad: ${ColorSystem.colorize("0", ColorSystem.codes.brightGreen)}`,
        `📈 Satisfacción del Cliente: ${ColorSystem.colorize("98.5%", ColorSystem.codes.brightGreen)}`,
      ],
      {
        title: "🏢 Métricas de Operaciones de 24 Horas",
        style: "double",
        color: ColorSystem.codes.yellow,
        padding: 1,
      }
    );

    console.log("");
    this.logger.success("Simulación de operación diaria completada exitosamente");
  }

  // ========================================================================
  // BUCLE DE EJECUCIÓN PRINCIPAL
  // ========================================================================

  async ejecutar() {
    this.mostrarBanner();

    this.logger.info("Plataforma de Operaciones La Tiendita inicializada");
    this.logger.info(`Hora actual: ${new Date().toLocaleString()}`);
    console.log("");

    while (this.ejecutando) {
      try {
        const opcion = await this.mostrarMenuPrincipal();
        console.log("");

        switch (opcion) {
          case "tablero":
            await this.verTablero();
            break;
          case "inventario":
            await this.verInventario();
            break;
          case "transacciones":
            await this.verTransacciones();
            break;
          case "empleados":
            await this.verEmpleados();
            break;
          case "turnos":
            await this.verTurnos();
            break;
          case "gasolina":
            await this.verGasolina();
            break;
          case "proveedores":
            await this.verProveedores();
            break;
          case "seguridad":
            await this.verSeguridad();
            break;
          case "analisis":
            await this.verAnalisis();
            break;
          case "nueva-venta":
            await this.crearNuevaVenta();
            break;
          case "simulacion":
            await this.ejecutarSimulacionDiaria();
            break;
          case "salir":
            this.ejecutando = false;
            console.log("");
            this.logger.info("Cerrando plataforma de operaciones...");
            console.log("");
            BoxRenderer.render(
              [
                "¡Gracias por usar la Plataforma de Operaciones La Tiendita!",
                "",
                "🏪 Su tienda de barrio. Abierta 24/7.",
                "",
                "Visítenos en: 2615 SW 29th St, Oklahoma City, OK 73119",
                "Llámenos: (405) 555-TIEN (8436)",
              ],
              {
                title: "👋 ¡Hasta Luego!",
                style: "double",
                color: ColorSystem.codes.brightGreen,
                padding: 1,
              }
            );
            console.log("");
            return;
        }

        console.log("");
        console.log(ColorSystem.colorize("─".repeat(90), ColorSystem.codes.dim));
        await InteractivePrompts.confirm("Presione Enter para continuar...");
        this.mostrarBanner();
      } catch (error) {
        if (error instanceof Deno.errors.Interrupted) {
          this.ejecutando = false;
          console.log("");
          this.logger.info("Plataforma de operaciones interrumpida por el usuario");
          return;
        }
        this.logger.error("Ocurrió un error", { error });
        await sleep(2000);
      }
    }
  }
}

// ============================================================================
// PUNTO DE ENTRADA
// ============================================================================

if (import.meta.main) {
  const cli = new LaTienditaCLI();
  await cli.ejecutar();
}
