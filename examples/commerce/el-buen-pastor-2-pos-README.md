# El Buen Pastor 2 - Real-Time POS System

Sistema de Punto de Venta en Tiempo Real para El Buen Pastor 2
Supermercado y Restaurante Mexicano

## Información del Negocio

- **Nombre**: El Buen Pastor 2
- **Ubicación**: Oklahoma City, Oklahoma 73129
- **Teléfono**: (405) 800-4468
- **Servicios**: Supermercado y Restaurante Mexicano

## Características del Sistema

### 🎯 Funcionalidades Principales

1. **Interfaz Bilingüe**: Soporte para Español e Inglés
2. **Sistema POS Completo**:
   - Navegación con mouse (TUI interactivo)
   - Carrito de compras en tiempo real
   - Procesamiento de pagos múltiples
   - Generación automática de recibos

3. **Control de Inventario**:
   - Seguimiento de stock en tiempo real
   - Alertas de productos bajos
   - Actualización automática al vender

4. **Cálculo de Impuestos**: 8.75% (tasa de Oklahoma)

5. **Métodos de Pago**:
   - Efectivo (Cash)
   - Tarjeta (Card)
   - Pago Móvil (Mobile)

### 📋 Catálogo de Productos

#### Restaurante (60+ items)

**Tacos (6 variedades)**
- Tacos al Pastor (3) - $11.50
- Tacos de Bistec (3) - $12.00
- Tacos de Carnitas (3) - $11.00
- Tacos de Barbacoa (3) - $13.00
- Tacos de Pollo (3) - $10.50
- Tacos de Lengua (3) - $13.50

**Platillos Tradicionales (6 opciones)**
- Enchiladas Verdes - $13.50
- Mole Poblano - $15.00
- Chiles Rellenos - $14.00
- Fajitas de Res - $16.50
- Tamales (3) - $9.50
- Milanesa de Res - $14.50

**Caldos y Sopas (5 tipos)**
- Caldo de Res - $14.50
- Pozole Rojo - $13.75
- Menudo - $15.00
- Sopa de Tortilla - $11.00
- Birria de Res - $16.00

**Antojitos (5 opciones)**
- Quesadilla Queso Oaxaca - $10.00
- Quesadilla de Champiñones - $11.50
- Sopes (3) - $12.00
- Gorditas (3) - $11.50
- Tostadas (3) - $10.50

**Tortas (4 variedades)**
- Torta Cubana - $12.50
- Torta al Pastor - $11.00
- Torta de Milanesa - $11.50
- Torta Ahogada - $12.00

**Burritos (4 tipos)**
- Burrito de Carne Asada - $13.00
- Burrito de Pollo - $12.00
- Burrito Chile Verde - $13.50
- Burrito Vegetariano - $11.00

**Mariscos (5 platillos)**
- Camarones a la Diabla - $18.50
- Camarones al Mojo de Ajo - $18.00
- Ceviche de Camarón - $16.50
- Mojarra Frita - $17.50
- Coctel de Camarón - $15.50

**Bebidas (7 opciones)**
- Horchata (32 oz) - $4.50
- Jamaica (32 oz) - $4.50
- Tamarindo (32 oz) - $4.50
- Jarritos - $2.50
- Coca-Cola Mexicana - $3.00
- Café - $2.50
- Café con Leche - $3.50

**Postres (4 tipos)**
- Flan Casero - $5.00
- Pastel Tres Leches - $6.00
- Churros (4) - $5.50
- Arroz con Leche - $4.50

#### Supermercado (22+ items)

**Carnicería**
- Bistec de Res (por lb) - $8.50
- Pechuga de Pollo (por lb) - $4.75
- Chorizo Casero (por lb) - $6.80
- Costilla de Puerco (por lb) - $5.25
- Camarón Grande (por lb) - $14.50

**Frutas y Verduras**
- Aguacate Hass (unidad) - $1.35
- Tomate Rojo (por lb) - $2.10
- Cebolla Blanca (por lb) - $1.15
- Chile Jalapeño (por lb) - $2.75
- Cilantro (manojo) - $1.25
- Limón Verde (por lb) - $1.50

**Panadería**
- Bolillos (6 piezas) - $3.00
- Conchas (4 piezas) - $4.00
- Pan de Muerto - $5.50
- Orejas (4 piezas) - $4.50

**Abarrotes**
- Frijol Negro (2 lb) - $3.90
- Frijol Pinto (2 lb) - $3.50
- Arroz Blanco (2 lb) - $2.70
- Masa Harina (2 lb) - $4.30

**Lácteos**
- Queso Oaxaca (por lb) - $6.25
- Queso Fresco (por lb) - $5.75
- Crema Mexicana (16 oz) - $5.95

## Cómo Usar el Sistema

### Instalación

Requiere Deno instalado en el sistema.

```bash
# Verificar instalación de Deno
deno --version

# Si no está instalado, instalar Deno:
curl -fsSL https://deno.land/install.sh | sh
```

### Ejecución

```bash
# Desde el directorio del proyecto
deno run --allow-env --allow-read --allow-write examples/commerce/el-buen-pastor-2-pos.ts

# O simplemente ejecutar directamente (si tiene permisos):
./examples/commerce/el-buen-pastor-2-pos.ts
```

### Controles

#### Mouse
- **Click en categorías**: Ver productos de esa categoría
- **Click en productos**: Agregar producto al carrito
- **Click en [Catalog]**: Ver catálogo de productos
- **Click en [Cart]**: Ver carrito de compras
- **Click en [Payment]**: Procesar pago
- **Click en [Remove]**: Quitar producto del carrito
- **Click en método de pago**: Procesar transacción

#### Teclado
- **Q**: Salir del sistema
- **Ctrl+C**: Salir del sistema (emergencia)

### Flujo de Trabajo

1. **Inicio**: El sistema muestra el catálogo de productos
2. **Seleccionar Categoría**: Click en una categoría (Tacos, Platillos, etc.)
3. **Agregar Productos**: Click en productos para agregarlos al carrito
4. **Ver Carrito**: Click en [Cart] para revisar la orden
5. **Procesar Pago**: Click en [Payment] y seleccionar método
6. **Recibo**: El sistema genera un recibo automáticamente
7. **Nueva Transacción**: Click en [New Transaction] para empezar de nuevo

## Características Técnicas

### Arquitectura

- **Framework**: GenesisTrace POS Extension
- **Lenguaje**: TypeScript/Deno
- **Interfaz**: TUI (Text User Interface) con soporte de mouse
- **Filosofía**: Unix Philosophy - Componentes modulares

### Módulos Utilizados

```typescript
import {
  POSApplication,
  ProductCatalog,
} from "../../pos/mod.ts";
```

### Componentes del Sistema

1. **ProductCatalog**: Gestión de productos y categorías
2. **ShoppingCart**: Carrito de compras con cálculo de totales
3. **PaymentProcessor**: Procesamiento de pagos y transacciones
4. **TUIRenderer**: Renderizado de interfaz de usuario
5. **MouseHandler**: Manejo de eventos del mouse
6. **UIComponents**: Componentes de UI (paneles, botones, tablas)

### Configuración

```typescript
const STORE_CONFIG = {
  name: "El Buen Pastor 2",
  slogan: "Sabor Auténtico Mexicano",
  address: "Oklahoma City, OK 73129",
  phone: "(405) 800-4468",
  taxRate: 0.0875, // 8.75% Oklahoma
  language: "es",
};
```

## Estructura de Datos

### Producto
```typescript
{
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock: number;
}
```

### Categoría
```typescript
{
  id: string;
  name: string;
  description: string;
}
```

### Transacción
```typescript
{
  id: string;
  timestamp: Date;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  payments: Payment[];
  change: number;
}
```

## Reportes y Análisis

El sistema genera automáticamente:

- ✓ Recibos detallados de cada transacción
- ✓ Historial de transacciones
- ✓ Control de inventario
- ✓ Totales por método de pago
- ✓ Análisis de ventas por categoría

## Ventajas del Sistema

1. **Interfaz Intuitiva**: Fácil de usar con mouse
2. **Tiempo Real**: Actualización inmediata de inventario y totales
3. **Portátil**: Funciona en cualquier terminal con Deno
4. **Sin Base de Datos Externa**: Todo en memoria (rápido y simple)
5. **Modular**: Componentes reutilizables y extensibles
6. **Bilingüe**: Preparado para español e inglés

## Soporte

Para soporte técnico o preguntas:
- **Teléfono**: (405) 800-4468
- **Sistema**: GenesisTrace Restaurant & Market Lab

## Licencia

Sistema desarrollado con GenesisTrace Framework
© 2025 El Buen Pastor 2
