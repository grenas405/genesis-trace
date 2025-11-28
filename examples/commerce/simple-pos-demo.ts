#!/usr/bin/env -S deno run --allow-env --allow-read --allow-write

/**
 * Simple POS System Demo
 *
 * A stable, straightforward Point of Sale implementation using GenesisTrace
 * without complex mouse interactions that may cause glitches.
 *
 * Features:
 * - Keyboard-driven interface (no mouse to reduce glitches)
 * - Product selection by number
 * - Shopping cart management
 * - Receipt generation
 * - Transaction totaling with tax
 *
 * Unix Philosophy:
 * - Simple text-based interface
 * - Clear, predictable flow
 * - Composable operations
 *
 * Controls:
 * - Number keys (1-9): Select product/action
 * - V: View cart
 * - C: Checkout
 * - N: New transaction
 * - Q: Quit
 */

import { ColorSystem, GenesisTrace, Logger } from "../../mod.ts";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  sku: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

class SimplePOS {
  private trace: GenesisTrace;
  private logger: Logger;
  private cart: CartItem[] = [];
  private products: Product[] = [];
  private taxRate = 0.08;
  private storeName = "GenesisTrace Coffee Shop";
  private screen: "menu" | "cart" | "checkout" | "receipt" = "menu";
  private lastReceiptId = "";

  constructor() {
    this.trace = new GenesisTrace({
      appName: "simple-pos",
      version: "1.0.0",
      traceDir: ".genesis-trace",
    });

    this.logger = new Logger({
      appName: "simple-pos",
      logLevel: "info",
      enableColors: true,
      enableTimestamp: true,
    });

    this.initializeProducts();
  }

  private initializeProducts(): void {
    this.products = [
      { id: "1", name: "Espresso", price: 2.50, category: "Coffee", sku: "COF-001" },
      { id: "2", name: "Americano", price: 3.00, category: "Coffee", sku: "COF-002" },
      { id: "3", name: "Latte", price: 4.50, category: "Coffee", sku: "COF-003" },
      { id: "4", name: "Cappuccino", price: 4.50, category: "Coffee", sku: "COF-004" },
      { id: "5", name: "Cold Brew", price: 4.00, category: "Coffee", sku: "COF-005" },
      { id: "6", name: "Croissant", price: 3.50, category: "Pastry", sku: "PAS-001" },
      { id: "7", name: "Blueberry Muffin", price: 3.00, category: "Pastry", sku: "PAS-002" },
      { id: "8", name: "Turkey Sandwich", price: 7.50, category: "Food", sku: "SAN-001" },
      { id: "9", name: "Veggie Wrap", price: 6.50, category: "Food", sku: "SAN-002" },
    ];
  }

  private formatCurrency(amount: number): string {
    return `$${amount.toFixed(2)}`;
  }

  private calculateSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  private calculateTax(subtotal: number): number {
    return subtotal * this.taxRate;
  }

  private calculateTotal(): number {
    const subtotal = this.calculateSubtotal();
    return subtotal + this.calculateTax(subtotal);
  }

  private addToCart(productId: string): void {
    const product = this.products.find((p) => p.id === productId);
    if (!product) return;

    const existing = this.cart.find((item) => item.product.id === productId);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1 });
    }

    this.logger.info(`Added ${product.name} to cart`);
    this.trace.logEvent("add_to_cart", { product: product.name, price: product.price });
  }

  private clearScreen(): void {
    console.clear();
  }

  private printHeader(): void {
    const header = [
      "╔════════════════════════════════════════════════════════════════╗",
      "║                                                                ║",
      `║  ${this.storeName.padEnd(60)}  ║`,
      "║                                                                ║",
      "╚════════════════════════════════════════════════════════════════╝",
    ];

    header.forEach((line) => console.log(ColorSystem.color(line, ColorSystem.codes.brightCyan)));
    console.log();
  }

  private renderMenu(): void {
    this.clearScreen();
    this.printHeader();

    console.log(ColorSystem.color("PRODUCT MENU", ColorSystem.codes.brightYellow));
    console.log(ColorSystem.color("═".repeat(64), ColorSystem.codes.dim));
    console.log();

    // Group by category
    const categories = [...new Set(this.products.map((p) => p.category))];

    for (const category of categories) {
      console.log(ColorSystem.color(`  ${category}:`, ColorSystem.codes.brightGreen));
      const items = this.products.filter((p) => p.category === category);

      for (const item of items) {
        const line = `    [${item.id}] ${item.name.padEnd(20)} ${this.formatCurrency(item.price)}`;
        console.log(line);
      }
      console.log();
    }

    console.log(ColorSystem.color("─".repeat(64), ColorSystem.codes.dim));
    console.log();
    console.log("Controls:");
    console.log("  [1-9] - Add item to cart");
    console.log("  [V]   - View cart");
    console.log("  [C]   - Checkout");
    console.log("  [Q]   - Quit");
    console.log();

    // Show cart summary
    const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (itemCount > 0) {
      console.log(ColorSystem.color(
        `Cart: ${itemCount} item(s) | Total: ${this.formatCurrency(this.calculateTotal())}`,
        ColorSystem.codes.brightMagenta,
      ));
    }
  }

  private renderCart(): void {
    this.clearScreen();
    this.printHeader();

    console.log(ColorSystem.color("SHOPPING CART", ColorSystem.codes.brightYellow));
    console.log(ColorSystem.color("═".repeat(64), ColorSystem.codes.dim));
    console.log();

    if (this.cart.length === 0) {
      console.log("  Cart is empty");
      console.log();
    } else {
      console.log("  Item                    Qty    Price      Subtotal");
      console.log(ColorSystem.color("  ─".repeat(31), ColorSystem.codes.dim));

      for (const item of this.cart) {
        const subtotal = item.product.price * item.quantity;
        const line = `  ${item.product.name.padEnd(24)}${item.quantity.toString().padStart(3)}    ${
          this.formatCurrency(item.product.price).padStart(7)
        }    ${this.formatCurrency(subtotal).padStart(7)}`;
        console.log(line);
      }

      console.log();
      console.log(ColorSystem.color("  ─".repeat(31), ColorSystem.codes.dim));

      const subtotal = this.calculateSubtotal();
      const tax = this.calculateTax(subtotal);
      const total = this.calculateTotal();

      console.log(`  ${"Subtotal:".padEnd(44)}${this.formatCurrency(subtotal).padStart(10)}`);
      console.log(`  ${"Tax (8%):".padEnd(44)}${this.formatCurrency(tax).padStart(10)}`);
      console.log(ColorSystem.color(
        `  ${"TOTAL:".padEnd(44)}${this.formatCurrency(total).padStart(10)}`,
        ColorSystem.codes.brightGreen,
      ));
    }

    console.log();
    console.log(ColorSystem.color("─".repeat(64), ColorSystem.codes.dim));
    console.log();
    console.log("Controls:");
    console.log("  [C] - Checkout");
    console.log("  [M] - Back to menu");
    console.log("  [Q] - Quit");
    console.log();
  }

  private renderCheckout(): void {
    this.clearScreen();
    this.printHeader();

    console.log(ColorSystem.color("CHECKOUT", ColorSystem.codes.brightYellow));
    console.log(ColorSystem.color("═".repeat(64), ColorSystem.codes.dim));
    console.log();

    const total = this.calculateTotal();
    console.log(
      `  Total Due: ${
        ColorSystem.color(this.formatCurrency(total), ColorSystem.codes.brightGreen)
      }`,
    );
    console.log();
    console.log("  Payment Method:");
    console.log("    [1] Cash");
    console.log("    [2] Credit Card");
    console.log("    [3] Debit Card");
    console.log();
    console.log(ColorSystem.color("─".repeat(64), ColorSystem.codes.dim));
    console.log();
    console.log("Controls:");
    console.log("  [1-3] - Select payment method");
    console.log("  [M]   - Back to menu");
    console.log("  [Q]   - Quit");
    console.log();
  }

  private renderReceipt(paymentMethod: string): void {
    this.clearScreen();
    this.printHeader();

    const receiptId = `TX${Date.now().toString().slice(-8)}`;
    this.lastReceiptId = receiptId;

    console.log(ColorSystem.color("RECEIPT", ColorSystem.codes.brightYellow));
    console.log(ColorSystem.color("═".repeat(64), ColorSystem.codes.dim));
    console.log();
    console.log(`  Transaction ID: ${receiptId}`);
    console.log(`  Date: ${new Date().toLocaleString()}`);
    console.log(`  Payment: ${paymentMethod}`);
    console.log();
    console.log(ColorSystem.color("  ─".repeat(31), ColorSystem.codes.dim));
    console.log();

    for (const item of this.cart) {
      const subtotal = item.product.price * item.quantity;
      console.log(
        `  ${item.quantity}x ${item.product.name.padEnd(30)}${
          this.formatCurrency(subtotal).padStart(10)
        }`,
      );
    }

    console.log();
    console.log(ColorSystem.color("  ─".repeat(31), ColorSystem.codes.dim));

    const subtotal = this.calculateSubtotal();
    const tax = this.calculateTax(subtotal);
    const total = this.calculateTotal();

    console.log(`  ${"Subtotal:".padEnd(44)}${this.formatCurrency(subtotal).padStart(10)}`);
    console.log(`  ${"Tax (8%):".padEnd(44)}${this.formatCurrency(tax).padStart(10)}`);
    console.log(ColorSystem.color(
      `  ${"TOTAL:".padEnd(44)}${this.formatCurrency(total).padStart(10)}`,
      ColorSystem.codes.brightGreen,
    ));

    console.log();
    console.log(ColorSystem.color("  ═".repeat(31), ColorSystem.codes.dim));
    console.log();
    console.log(ColorSystem.color("  Thank you for your business!", ColorSystem.codes.brightCyan));
    console.log();
    console.log(ColorSystem.color("─".repeat(64), ColorSystem.codes.dim));
    console.log();
    console.log("Controls:");
    console.log("  [N] - New transaction");
    console.log("  [Q] - Quit");
    console.log();

    // Log transaction
    this.trace.logEvent("transaction_completed", {
      receiptId,
      total,
      items: this.cart.length,
      paymentMethod,
    });

    this.logger.info(`Transaction completed: ${receiptId} - ${this.formatCurrency(total)}`);
  }

  private processCheckout(paymentMethod: string): void {
    this.renderReceipt(paymentMethod);
    this.screen = "receipt";
  }

  private newTransaction(): void {
    this.cart = [];
    this.screen = "menu";
    this.renderMenu();
  }

  async start(): Promise<void> {
    this.clearScreen();
    this.renderMenu();

    // Enable raw mode for keyboard input
    Deno.stdin.setRaw(true);

    const buffer = new Uint8Array(1);

    try {
      while (true) {
        const n = await Deno.stdin.read(buffer);
        if (n === null) break;

        const char = String.fromCharCode(buffer[0]).toLowerCase();

        // Global quit
        if (char === "q" || buffer[0] === 3) { // 'q' or Ctrl+C
          break;
        }

        switch (this.screen) {
          case "menu":
            if (char >= "1" && char <= "9") {
              this.addToCart(char);
              this.renderMenu();
            } else if (char === "v") {
              this.screen = "cart";
              this.renderCart();
            } else if (char === "c" && this.cart.length > 0) {
              this.screen = "checkout";
              this.renderCheckout();
            }
            break;

          case "cart":
            if (char === "c" && this.cart.length > 0) {
              this.screen = "checkout";
              this.renderCheckout();
            } else if (char === "m") {
              this.screen = "menu";
              this.renderMenu();
            }
            break;

          case "checkout":
            if (char === "1") {
              this.processCheckout("Cash");
            } else if (char === "2") {
              this.processCheckout("Credit Card");
            } else if (char === "3") {
              this.processCheckout("Debit Card");
            } else if (char === "m") {
              this.screen = "menu";
              this.renderMenu();
            }
            break;

          case "receipt":
            if (char === "n") {
              this.newTransaction();
            }
            break;
        }
      }
    } finally {
      Deno.stdin.setRaw(false);
      this.clearScreen();
      console.log("\nThank you for using GenesisTrace POS!");
      console.log("Transaction logs saved to .genesis-trace/\n");
    }
  }
}

// Main entry point
if (import.meta.main) {
  const pos = new SimplePOS();
  await pos.start();
}
