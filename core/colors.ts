// core/colors.ts
export class ColorSystem {
  // ANSI Color codes
  static readonly codes = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",
    strikethrough: "\x1b[9m",

    // Standard foreground colors
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    gray: "\x1b[90m",

    // Bright foreground colors
    brightRed: "\x1b[91m",
    brightGreen: "\x1b[92m",
    brightYellow: "\x1b[93m",
    brightBlue: "\x1b[94m",
    brightMagenta: "\x1b[95m",
    brightCyan: "\x1b[96m",
    brightWhite: "\x1b[97m",

    // Background colors
    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
  };

  /**
   * Apply color to text
   */
  static colorize(text: string, color: string, enabled = true): string {
    if (!enabled) return text;
    return `${color}${text}${this.codes.reset}`;
  }

  /**
   * Strip ANSI codes from text
   */
  static strip(text: string): string {
    return text.replace(/\x1b\[[0-9;]*m/g, "");
  }

  /**
   * Get visible length of text (excluding ANSI codes)
   */
  static visibleLength(text: string): number {
    return this.strip(text).length;
  }

  /**
   * Create 256-color code
   */
  static color256(code: number): string {
    return `\x1b[38;5;${code}m`;
  }

  /**
   * Create RGB color code (true color)
   */
  static rgb(r: number, g: number, b: number): string {
    return `\x1b[38;2;${r};${g};${b}m`;
  }

  /**
   * Create hex color
   */
  static hex(hex: string): string {
    const match = hex.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
    if (!match) return "";

    const r = parseInt(match[1], 16);
    const g = parseInt(match[2], 16);
    const b = parseInt(match[3], 16);

    return this.rgb(r, g, b);
  }

  /**
   * Create gradient text
   */
  static gradient(
    text: string,
    startColor: [number, number, number],
    endColor: [number, number, number],
  ): string {
    const length = text.length;
    let result = "";

    for (let i = 0; i < length; i++) {
      const ratio = i / (length - 1);
      const r = Math.round(
        startColor[0] + (endColor[0] - startColor[0]) * ratio,
      );
      const g = Math.round(
        startColor[1] + (endColor[1] - startColor[1]) * ratio,
      );
      const b = Math.round(
        startColor[2] + (endColor[2] - startColor[2]) * ratio,
      );

      result += this.rgb(r, g, b) + text[i];
    }

    return result + this.codes.reset;
  }
}
