#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * El Buen Pastor 2 - Real-Time Point of Sale System
 * Oklahoma City, Oklahoma 73129
 * Teléfono: (405) 800-4468
 *
 * Sistema POS en Tiempo Real GenesisTrace
 *
 * Características:
 *   - Interfaz bilingüe (Español/English)
 *   - Sistema de punto de venta con mouse
 *   - Catálogo de productos del restaurante y supermercado
 *   - Carrito de compras en tiempo real
 *   - Procesamiento de pagos múltiples métodos
 *   - Generación de recibos
 *   - Control de inventario integrado
 *   - Colores de la bandera mexicana (verde, blanco, rojo)
 *   - Cálculo automático de impuestos
 *   - Descuentos y promociones
 */

import {
  POSApplication,
  ProductCatalog,
} from "../../pos/mod.ts";

// ============================================================================
// CONFIGURACIÓN DEL NEGOCIO
// ============================================================================

const STORE_CONFIG = {
  name: "El Buen Pastor 2",
  slogan: "Sabor Auténtico Mexicano",
  address: "Oklahoma City, OK 73129",
  phone: "(405) 800-4468",
  taxRate: 0.0875, // 8.75% Oklahoma tax rate
  language: "es", // "es" para español, "en" para inglés
};

// ============================================================================
// CREACIÓN DEL CATÁLOGO DE PRODUCTOS
// ============================================================================

const catalog = new ProductCatalog();

// ============================================================================
// CATEGORÍAS DEL RESTAURANTE Y SUPERMERCADO
// ============================================================================

// Categorías del Restaurante
catalog.addCategory({
  id: "tacos",
  name: "🌮 Tacos",
  description: "Tacos auténticos mexicanos",
});

catalog.addCategory({
  id: "platillos",
  name: "🍽️ Platillos",
  description: "Platillos tradicionales mexicanos",
});

catalog.addCategory({
  id: "caldos",
  name: "🍲 Caldos y Sopas",
  description: "Caldos y sopas caseras",
});

catalog.addCategory({
  id: "antojitos",
  name: "🫔 Antojitos",
  description: "Antojitos mexicanos",
});

catalog.addCategory({
  id: "tortas",
  name: "🥖 Tortas",
  description: "Tortas mexicanas",
});

catalog.addCategory({
  id: "burritos",
  name: "🌯 Burritos",
  description: "Burritos estilo mexicano",
});

catalog.addCategory({
  id: "mariscos",
  name: "🦐 Mariscos",
  description: "Platillos de mariscos frescos",
});

catalog.addCategory({
  id: "bebidas",
  name: "🥤 Bebidas",
  description: "Bebidas mexicanas y refrescos",
});

catalog.addCategory({
  id: "postres",
  name: "🍮 Postres",
  description: "Postres tradicionales",
});

// Categorías del Supermercado
catalog.addCategory({
  id: "carniceria",
  name: "🥩 Carnicería",
  description: "Carnes frescas y embutidos",
});

catalog.addCategory({
  id: "frutas-verduras",
  name: "🥑 Frutas y Verduras",
  description: "Productos frescos",
});

catalog.addCategory({
  id: "panaderia",
  name: "🍞 Panadería",
  description: "Pan dulce y bolillos",
});

catalog.addCategory({
  id: "abarrotes",
  name: "🌾 Abarrotes",
  description: "Granos, frijoles, arroz",
});

catalog.addCategory({
  id: "lacteos",
  name: "🧀 Lácteos",
  description: "Quesos y cremas",
});

// ============================================================================
// PRODUCTOS DEL RESTAURANTE - TACOS
// ============================================================================

catalog.addProduct({
  id: "taco-pastor",
  name: "Tacos al Pastor (3)",
  description: "Carne marinada con piña y cilantro",
  price: 11.50,
  category: "tacos",
  sku: "TAC-001",
  stock: 50,
});

catalog.addProduct({
  id: "taco-bistec",
  name: "Tacos de Bistec (3)",
  description: "Carne asada con cebolla y cilantro",
  price: 12.00,
  category: "tacos",
  sku: "TAC-002",
  stock: 50,
});

catalog.addProduct({
  id: "taco-carnitas",
  name: "Tacos de Carnitas (3)",
  description: "Puerco estilo Michoacán",
  price: 11.00,
  category: "tacos",
  sku: "TAC-003",
  stock: 50,
});

catalog.addProduct({
  id: "taco-barbacoa",
  name: "Tacos de Barbacoa (3)",
  description: "Barbacoa de res tradicional",
  price: 13.00,
  category: "tacos",
  sku: "TAC-004",
  stock: 40,
});

catalog.addProduct({
  id: "taco-pollo",
  name: "Tacos de Pollo (3)",
  description: "Pollo asado con especias",
  price: 10.50,
  category: "tacos",
  sku: "TAC-005",
  stock: 50,
});

catalog.addProduct({
  id: "taco-lengua",
  name: "Tacos de Lengua (3)",
  description: "Lengua de res en salsa verde",
  price: 13.50,
  category: "tacos",
  sku: "TAC-006",
  stock: 30,
});

// ============================================================================
// PLATILLOS TRADICIONALES
// ============================================================================

catalog.addProduct({
  id: "enchiladas-verdes",
  name: "Enchiladas Verdes",
  description: "Con pollo, salsa verde y crema",
  price: 13.50,
  category: "platillos",
  sku: "PLA-001",
  stock: 40,
});

catalog.addProduct({
  id: "mole-poblano",
  name: "Mole Poblano",
  description: "Pollo en mole con arroz y frijoles",
  price: 15.00,
  category: "platillos",
  sku: "PLA-002",
  stock: 35,
});

catalog.addProduct({
  id: "chile-relleno",
  name: "Chiles Rellenos",
  description: "Chile poblano relleno de queso",
  price: 14.00,
  category: "platillos",
  sku: "PLA-003",
  stock: 30,
});

catalog.addProduct({
  id: "fajitas-res",
  name: "Fajitas de Res",
  description: "Con pimientos, cebolla y tortillas",
  price: 16.50,
  category: "platillos",
  sku: "PLA-004",
  stock: 40,
});

catalog.addProduct({
  id: "tamales",
  name: "Tamales (3 piezas)",
  description: "Pollo en salsa verde o roja",
  price: 9.50,
  category: "platillos",
  sku: "PLA-005",
  stock: 60,
});

catalog.addProduct({
  id: "milanesa",
  name: "Milanesa de Res",
  description: "Con arroz, frijoles y ensalada",
  price: 14.50,
  category: "platillos",
  sku: "PLA-006",
  stock: 35,
});

// ============================================================================
// CALDOS Y SOPAS
// ============================================================================

catalog.addProduct({
  id: "caldo-res",
  name: "Caldo de Res",
  description: "Con verduras frescas y arroz",
  price: 14.50,
  category: "caldos",
  sku: "CAL-001",
  stock: 40,
});

catalog.addProduct({
  id: "pozole-rojo",
  name: "Pozole Rojo",
  description: "Con tostadas y lechuga",
  price: 13.75,
  category: "caldos",
  sku: "CAL-002",
  stock: 40,
});

catalog.addProduct({
  id: "menudo",
  name: "Menudo",
  description: "Tradicional con maíz y especias",
  price: 15.00,
  category: "caldos",
  sku: "CAL-003",
  stock: 30,
});

catalog.addProduct({
  id: "sopa-tortilla",
  name: "Sopa de Tortilla",
  description: "Con aguacate, queso y crema",
  price: 11.00,
  category: "caldos",
  sku: "CAL-004",
  stock: 40,
});

catalog.addProduct({
  id: "birria",
  name: "Birria de Res",
  description: "Con consomé y tortillas",
  price: 16.00,
  category: "caldos",
  sku: "CAL-005",
  stock: 35,
});

// ============================================================================
// ANTOJITOS
// ============================================================================

catalog.addProduct({
  id: "quesadilla-oaxaca",
  name: "Quesadilla Queso Oaxaca",
  description: "Con queso Oaxaca auténtico",
  price: 10.00,
  category: "antojitos",
  sku: "ANT-001",
  stock: 50,
});

catalog.addProduct({
  id: "quesadilla-champinon",
  name: "Quesadilla de Champiñones",
  description: "Con queso y champiñones",
  price: 11.50,
  category: "antojitos",
  sku: "ANT-002",
  stock: 40,
});

catalog.addProduct({
  id: "sopes",
  name: "Sopes (3 piezas)",
  description: "Con frijoles, carne y lechuga",
  price: 12.00,
  category: "antojitos",
  sku: "ANT-003",
  stock: 40,
});

catalog.addProduct({
  id: "gorditas",
  name: "Gorditas (3 piezas)",
  description: "Rellenas de chicharrón o picadillo",
  price: 11.50,
  category: "antojitos",
  sku: "ANT-004",
  stock: 40,
});

catalog.addProduct({
  id: "tostadas",
  name: "Tostadas (3 piezas)",
  description: "Con frijoles, pollo y lechuga",
  price: 10.50,
  category: "antojitos",
  sku: "ANT-005",
  stock: 50,
});

// ============================================================================
// TORTAS
// ============================================================================

catalog.addProduct({
  id: "torta-cubana",
  name: "Torta Cubana",
  description: "Con jamón, salchicha, milanesa y huevo",
  price: 12.50,
  category: "tortas",
  sku: "TOR-001",
  stock: 35,
});

catalog.addProduct({
  id: "torta-pastor",
  name: "Torta al Pastor",
  description: "Con carne al pastor y piña",
  price: 11.00,
  category: "tortas",
  sku: "TOR-002",
  stock: 40,
});

catalog.addProduct({
  id: "torta-milanesa",
  name: "Torta de Milanesa",
  description: "Con milanesa de res o pollo",
  price: 11.50,
  category: "tortas",
  sku: "TOR-003",
  stock: 40,
});

catalog.addProduct({
  id: "torta-ahogada",
  name: "Torta Ahogada",
  description: "Estilo Jalisco con salsa picante",
  price: 12.00,
  category: "tortas",
  sku: "TOR-004",
  stock: 30,
});

// ============================================================================
// BURRITOS
// ============================================================================

catalog.addProduct({
  id: "burrito-asada",
  name: "Burrito de Carne Asada",
  description: "Con frijoles, arroz y guacamole",
  price: 13.00,
  category: "burritos",
  sku: "BUR-001",
  stock: 40,
});

catalog.addProduct({
  id: "burrito-pollo",
  name: "Burrito de Pollo",
  description: "Con frijoles y arroz",
  price: 12.00,
  category: "burritos",
  sku: "BUR-002",
  stock: 40,
});

catalog.addProduct({
  id: "burrito-chile-verde",
  name: "Burrito Chile Verde",
  description: "Puerco en salsa verde",
  price: 13.50,
  category: "burritos",
  sku: "BUR-003",
  stock: 35,
});

catalog.addProduct({
  id: "burrito-vegetariano",
  name: "Burrito Vegetariano",
  description: "Con frijoles, arroz y vegetales",
  price: 11.00,
  category: "burritos",
  sku: "BUR-004",
  stock: 40,
});

// ============================================================================
// MARISCOS
// ============================================================================

catalog.addProduct({
  id: "camarones-diabla",
  name: "Camarones a la Diabla",
  description: "En salsa picante con arroz",
  price: 18.50,
  category: "mariscos",
  sku: "MAR-001",
  stock: 25,
});

catalog.addProduct({
  id: "camarones-mojo-ajo",
  name: "Camarones al Mojo de Ajo",
  description: "Con arroz y ensalada",
  price: 18.00,
  category: "mariscos",
  sku: "MAR-002",
  stock: 25,
});

catalog.addProduct({
  id: "ceviche-camaron",
  name: "Ceviche de Camarón",
  description: "Con tostadas y aguacate",
  price: 16.50,
  category: "mariscos",
  sku: "MAR-003",
  stock: 30,
});

catalog.addProduct({
  id: "mojarra-frita",
  name: "Mojarra Frita",
  description: "Con arroz y ensalada",
  price: 17.50,
  category: "mariscos",
  sku: "MAR-004",
  stock: 20,
});

catalog.addProduct({
  id: "coctel-camaron",
  name: "Coctel de Camarón",
  description: "Con aguacate y galletas",
  price: 15.50,
  category: "mariscos",
  sku: "MAR-005",
  stock: 30,
});

// ============================================================================
// BEBIDAS
// ============================================================================

catalog.addProduct({
  id: "horchata",
  name: "Horchata (32 oz)",
  description: "Agua fresca de arroz",
  price: 4.50,
  category: "bebidas",
  sku: "BEB-001",
  stock: 100,
});

catalog.addProduct({
  id: "jamaica",
  name: "Jamaica (32 oz)",
  description: "Agua de jamaica",
  price: 4.50,
  category: "bebidas",
  sku: "BEB-002",
  stock: 100,
});

catalog.addProduct({
  id: "tamarindo",
  name: "Tamarindo (32 oz)",
  description: "Agua de tamarindo",
  price: 4.50,
  category: "bebidas",
  sku: "BEB-003",
  stock: 100,
});

catalog.addProduct({
  id: "jarritos",
  name: "Jarritos",
  description: "Varios sabores",
  price: 2.50,
  category: "bebidas",
  sku: "BEB-004",
  stock: 150,
});

catalog.addProduct({
  id: "coca-mexicana",
  name: "Coca-Cola Mexicana",
  description: "Con azúcar de caña",
  price: 3.00,
  category: "bebidas",
  sku: "BEB-005",
  stock: 120,
});

catalog.addProduct({
  id: "cafe",
  name: "Café",
  description: "Café mexicano",
  price: 2.50,
  category: "bebidas",
  sku: "BEB-006",
  stock: 200,
});

catalog.addProduct({
  id: "cafe-leche",
  name: "Café con Leche",
  description: "Café con leche caliente",
  price: 3.50,
  category: "bebidas",
  sku: "BEB-007",
  stock: 200,
});

// ============================================================================
// POSTRES
// ============================================================================

catalog.addProduct({
  id: "flan",
  name: "Flan Casero",
  description: "Flan de vainilla tradicional",
  price: 5.00,
  category: "postres",
  sku: "POS-001",
  stock: 40,
});

catalog.addProduct({
  id: "tres-leches",
  name: "Pastel Tres Leches",
  description: "Pastel empapado en tres leches",
  price: 6.00,
  category: "postres",
  sku: "POS-002",
  stock: 30,
});

catalog.addProduct({
  id: "churros",
  name: "Churros (4 piezas)",
  description: "Con azúcar y canela",
  price: 5.50,
  category: "postres",
  sku: "POS-003",
  stock: 50,
});

catalog.addProduct({
  id: "arroz-leche",
  name: "Arroz con Leche",
  description: "Tradicional con canela",
  price: 4.50,
  category: "postres",
  sku: "POS-004",
  stock: 40,
});

// ============================================================================
// SUPERMERCADO - CARNICERÍA
// ============================================================================

catalog.addProduct({
  id: "bistec-res",
  name: "Bistec de Res (por lb)",
  description: "Carne fresca de res",
  price: 8.50,
  category: "carniceria",
  sku: "CAR-001",
  stock: 100,
});

catalog.addProduct({
  id: "pechuga-pollo",
  name: "Pechuga de Pollo (por lb)",
  description: "Pechuga fresca sin hueso",
  price: 4.75,
  category: "carniceria",
  sku: "CAR-002",
  stock: 120,
});

catalog.addProduct({
  id: "chorizo-casero",
  name: "Chorizo Casero (por lb)",
  description: "Chorizo fresco hecho en casa",
  price: 6.80,
  category: "carniceria",
  sku: "CAR-003",
  stock: 80,
});

catalog.addProduct({
  id: "costilla-puerco",
  name: "Costilla de Puerco (por lb)",
  description: "Para carnitas o asada",
  price: 5.25,
  category: "carniceria",
  sku: "CAR-004",
  stock: 90,
});

catalog.addProduct({
  id: "camaron-grande",
  name: "Camarón Grande (por lb)",
  description: "Camarón fresco del Pacífico",
  price: 14.50,
  category: "carniceria",
  sku: "CAR-005",
  stock: 50,
});

// ============================================================================
// FRUTAS Y VERDURAS
// ============================================================================

catalog.addProduct({
  id: "aguacate-hass",
  name: "Aguacate Hass",
  description: "Por unidad",
  price: 1.35,
  category: "frutas-verduras",
  sku: "VER-001",
  stock: 200,
});

catalog.addProduct({
  id: "tomate-rojo",
  name: "Tomate Rojo (por lb)",
  description: "Tomates frescos",
  price: 2.10,
  category: "frutas-verduras",
  sku: "VER-002",
  stock: 150,
});

catalog.addProduct({
  id: "cebolla-blanca",
  name: "Cebolla Blanca (por lb)",
  description: "Cebolla fresca",
  price: 1.15,
  category: "frutas-verduras",
  sku: "VER-003",
  stock: 180,
});

catalog.addProduct({
  id: "chile-jalapeno",
  name: "Chile Jalapeño (por lb)",
  description: "Chiles frescos",
  price: 2.75,
  category: "frutas-verduras",
  sku: "VER-004",
  stock: 100,
});

catalog.addProduct({
  id: "cilantro",
  name: "Cilantro (manojo)",
  description: "Cilantro fresco",
  price: 1.25,
  category: "frutas-verduras",
  sku: "VER-005",
  stock: 120,
});

catalog.addProduct({
  id: "limon-verde",
  name: "Limón Verde (por lb)",
  description: "Limones frescos",
  price: 1.50,
  category: "frutas-verduras",
  sku: "VER-006",
  stock: 150,
});

// ============================================================================
// PANADERÍA
// ============================================================================

catalog.addProduct({
  id: "bolillos",
  name: "Bolillos (6 piezas)",
  description: "Pan fresco del día",
  price: 3.00,
  category: "panaderia",
  sku: "PAN-001",
  stock: 100,
});

catalog.addProduct({
  id: "conchas",
  name: "Conchas (4 piezas)",
  description: "Pan dulce tradicional",
  price: 4.00,
  category: "panaderia",
  sku: "PAN-002",
  stock: 80,
});

catalog.addProduct({
  id: "pan-muerto",
  name: "Pan de Muerto",
  description: "Pan tradicional",
  price: 5.50,
  category: "panaderia",
  sku: "PAN-003",
  stock: 60,
});

catalog.addProduct({
  id: "orejas",
  name: "Orejas (4 piezas)",
  description: "Pan dulce de hojaldre",
  price: 4.50,
  category: "panaderia",
  sku: "PAN-004",
  stock: 70,
});

// ============================================================================
// ABARROTES
// ============================================================================

catalog.addProduct({
  id: "frijol-negro",
  name: "Frijol Negro (2 lb)",
  description: "Bolsa de 2 libras",
  price: 3.90,
  category: "abarrotes",
  sku: "ABA-001",
  stock: 150,
});

catalog.addProduct({
  id: "frijol-pinto",
  name: "Frijol Pinto (2 lb)",
  description: "Bolsa de 2 libras",
  price: 3.50,
  category: "abarrotes",
  sku: "ABA-002",
  stock: 180,
});

catalog.addProduct({
  id: "arroz-blanco",
  name: "Arroz Blanco (2 lb)",
  description: "Bolsa de 2 libras",
  price: 2.70,
  category: "abarrotes",
  sku: "ABA-003",
  stock: 200,
});

catalog.addProduct({
  id: "masa-harina",
  name: "Masa Harina (2 lb)",
  description: "Para tortillas",
  price: 4.30,
  category: "abarrotes",
  sku: "ABA-004",
  stock: 120,
});

// ============================================================================
// LÁCTEOS
// ============================================================================

catalog.addProduct({
  id: "queso-oaxaca",
  name: "Queso Oaxaca (por lb)",
  description: "Queso para quesadillas",
  price: 6.25,
  category: "lacteos",
  sku: "LAC-001",
  stock: 80,
});

catalog.addProduct({
  id: "queso-fresco",
  name: "Queso Fresco (por lb)",
  description: "Queso fresco mexicano",
  price: 5.75,
  category: "lacteos",
  sku: "LAC-002",
  stock: 90,
});

catalog.addProduct({
  id: "crema-mexicana",
  name: "Crema Mexicana (16 oz)",
  description: "Crema fresca",
  price: 5.95,
  category: "lacteos",
  sku: "LAC-003",
  stock: 100,
});

// ============================================================================
// INICIAR APLICACIÓN POS
// ============================================================================

async function main() {
  console.clear();
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                      ║");
  console.log("║               EL BUEN PASTOR 2 - SISTEMA POS                        ║");
  console.log("║          Supermercado y Restaurante Mexicano                        ║");
  console.log("║                                                                      ║");
  console.log("║                Oklahoma City, Oklahoma 73129                        ║");
  console.log("║                   Teléfono: (405) 800-4468                          ║");
  console.log("║                                                                      ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");
  console.log("\n");
  console.log("  🌮 Sistema de Punto de Venta en Tiempo Real");
  console.log("  🇲🇽 Interfaz Bilingüe (Español/English)");
  console.log("  💰 Procesamiento de Pagos Múltiples");
  console.log("  📊 Control de Inventario Integrado");
  console.log("  🧾 Generación Automática de Recibos");
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log("\n");
  console.log("Catálogo del Sistema:");
  console.log("  • Restaurante:");
  console.log("    - Tacos (6 variedades)");
  console.log("    - Platillos Tradicionales (6 opciones)");
  console.log("    - Caldos y Sopas (5 tipos)");
  console.log("    - Antojitos (5 opciones)");
  console.log("    - Tortas (4 variedades)");
  console.log("    - Burritos (4 tipos)");
  console.log("    - Mariscos (5 platillos)");
  console.log("    - Bebidas (7 opciones)");
  console.log("    - Postres (4 tipos)");
  console.log("\n");
  console.log("  • Supermercado:");
  console.log("    - Carnicería (5 productos)");
  console.log("    - Frutas y Verduras (6 productos)");
  console.log("    - Panadería (4 productos)");
  console.log("    - Abarrotes (4 productos)");
  console.log("    - Lácteos (3 productos)");
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log("\n");
  console.log("Características del POS:");
  console.log("  ✓ Interfaz con soporte de mouse (click para interactuar)");
  console.log("  ✓ Navegación por categorías y productos");
  console.log("  ✓ Carrito de compras con totales en tiempo real");
  console.log("  ✓ Cálculo automático de impuestos (8.75% Oklahoma)");
  console.log("  ✓ Múltiples métodos de pago (Efectivo, Tarjeta, Móvil)");
  console.log("  ✓ Recibos detallados con logo del negocio");
  console.log("  ✓ Control de inventario en tiempo real");
  console.log("\n");
  console.log("Controles:");
  console.log("  • Click en categorías para ver productos");
  console.log("  • Click en productos para agregar al carrito");
  console.log("  • Navegue entre pantallas con el menú superior");
  console.log("  • Presione 'Q' para salir del sistema");
  console.log("\n");
  console.log("═══════════════════════════════════════════════════════════════════════");
  console.log("\n");
  console.log("  Presione cualquier tecla para iniciar el sistema POS...\n");

  // Esperar a que el usuario presione una tecla
  Deno.stdin.setRaw(true);
  const buffer = new Uint8Array(1);
  await Deno.stdin.read(buffer);
  Deno.stdin.setRaw(false);

  // Crear y iniciar la aplicación POS
  const pos = new POSApplication({
    storeName: `${STORE_CONFIG.name} • ${STORE_CONFIG.slogan}`,
    taxRate: STORE_CONFIG.taxRate,
    catalog,
  });

  // Iniciar el sistema
  await pos.start();

  // Mensaje de despedida
  console.log("\n");
  console.log("╔══════════════════════════════════════════════════════════════════════╗");
  console.log("║                                                                      ║");
  console.log("║        ¡Gracias por usar El Buen Pastor 2 Sistema POS!             ║");
  console.log("║                                                                      ║");
  console.log("║              Sabor Auténtico Mexicano en Oklahoma                   ║");
  console.log("║                    (405) 800-4468                                   ║");
  console.log("║                                                                      ║");
  console.log("╚══════════════════════════════════════════════════════════════════════╝");
  console.log("\n");
  console.log("  Las transacciones han sido guardadas.");
  console.log("  Los reportes están disponibles para análisis.\n");
}

// Ejecutar si es el módulo principal
if (import.meta.main) {
  await main();
}
