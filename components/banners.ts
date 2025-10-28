// components/banners.ts
import { ColorSystem } from "../core/colors.ts";
import { Formatter } from "../core/formatter.ts";

export interface BannerOptions {
  width?: number;
  padding?: number;
  style?: "standard" | "gradient" | "minimal";
  color?: string;
  accentColor?: string;
}

export class BannerRenderer {
  /**
   * Render ASCII art banner
   */
  static render(text: string, options: BannerOptions = {}): void {
    const { style = "standard", color, width = 80 } = options;

    // For now, simple implementation
    // In production, you'd use a proper ASCII art library
    const lines = this.generateASCII(text);

    lines.forEach((line) => {
      if (color) {
        console.log(ColorSystem.colorize(line, color));
      } else if (style === "gradient") {
        console.log(ColorSystem.gradient(line, [255, 0, 255], [0, 255, 255]));
      } else {
        console.log(line);
      }
    });
  }

  /**
   * Simple ASCII generation (placeholder)
   */
  private static generateASCII(text: string): string[] {
    // This is a simplified version
    // In production, use figlet or similar
    return [
      `╔${"═".repeat(text.length + 2)}╗`,
      `║ ${text} ║`,
      `╚${"═".repeat(text.length + 2)}╝`,
    ];
  }

  /**
   * Render application header
   */
  static header(config: {
    name: string;
    version?: string;
    tagline?: string;
    author?: string;
  }): void {
    const lines: string[] = [];

    lines.push("");
    lines.push(
      ColorSystem.colorize(
        config.name,
        ColorSystem.codes.brightCyan + ColorSystem.codes.bright,
      ),
    );

    if (config.version) {
      lines.push(
        ColorSystem.colorize(`v${config.version}`, ColorSystem.codes.dim),
      );
    }

    if (config.tagline) {
      lines.push("");
      lines.push(config.tagline);
    }

    if (config.author) {
      lines.push("");
      lines.push(
        ColorSystem.colorize(`by ${config.author}`, ColorSystem.codes.dim),
      );
    }

    lines.push("");

    lines.forEach((line) => console.log(line));
  }
}
