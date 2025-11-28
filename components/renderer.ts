// components/renderer.ts
/**
 * Deno-native TUI renderers with optimized double buffering
 * and ANSI escape sequences to eliminate glitching
 */

/**
 * Double-buffered renderer using ANSI escape sequences
 * Only renders changed cells (differential rendering) to minimize writes
 */
export class BufferedRenderer {
  private width: number;
  private height: number;
  private buffer: string[][] = [];
  private previousBuffer: string[][] = [];
  private encoder = new TextEncoder();
  private isSetup = false;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initBuffer();
  }

  private initBuffer(): void {
    this.buffer = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(" "));
    this.previousBuffer = Array(this.height)
      .fill(null)
      .map(() => Array(this.width).fill(" "));
  }

  /**
   * Setup alternate screen buffer and hide cursor
   */
  setup(): void {
    if (this.isSetup) return;

    this.isSetup = true;
    Deno.stdout.writeSync(
      this.encoder.encode(
        "\x1b[?25l" + // Hide cursor
          "\x1b[?1049h" + // Enable alternate screen buffer
          "\x1b[2J" + // Clear screen
          "\x1b[H", // Move to home position
      ),
    );
  }

  /**
   * Only render changed cells (differential rendering)
   * This dramatically reduces terminal writes and eliminates glitching
   */
  render(): void {
    if (!this.isSetup) this.setup();

    let output = "";

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.buffer[y][x] !== this.previousBuffer[y][x]) {
          // Move cursor to position and write char
          output += `\x1b[${y + 1};${x + 1}H${this.buffer[y][x]}`;
          this.previousBuffer[y][x] = this.buffer[y][x];
        }
      }
    }

    if (output) {
      Deno.stdout.writeSync(this.encoder.encode(output));
    }
  }

  /**
   * Write text to buffer at position
   */
  write(x: number, y: number, text: string, color?: string): void {
    const chars = Array.from(text);
    for (let i = 0; i < chars.length && x + i < this.width; i++) {
      if (y >= 0 && y < this.height) {
        this.buffer[y][x + i] = color ? `${color}${chars[i]}\x1b[0m` : chars[i];
      }
    }
  }

  /**
   * Write multiline text to buffer
   */
  writeMultiline(x: number, y: number, lines: string[]): void {
    for (let i = 0; i < lines.length; i++) {
      this.write(x, y + i, lines[i]);
    }
  }

  /**
   * Fill rectangle with character
   */
  fillRect(x: number, y: number, width: number, height: number, char = " ", color?: string): void {
    for (let dy = 0; dy < height; dy++) {
      for (let dx = 0; dx < width; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px >= 0 && px < this.width && py >= 0 && py < this.height) {
          this.buffer[py][px] = color ? `${color}${char}\x1b[0m` : char;
        }
      }
    }
  }

  /**
   * Clear buffer
   */
  clear(): void {
    this.initBuffer();
  }

  /**
   * Restore terminal state
   */
  cleanup(): void {
    if (!this.isSetup) return;

    Deno.stdout.writeSync(
      this.encoder.encode(
        "\x1b[?1049l" + // Disable alternate screen
          "\x1b[?25h", // Show cursor
      ),
    );
    this.isSetup = false;
  }

  /**
   * Get buffer dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }
}

/**
 * Single-pass renderer for simple use cases
 * Builds entire frame as a single string, then writes once
 */
export class SinglePassRenderer {
  private width: number;
  private height: number;
  private encoder = new TextEncoder();
  private isSetup = false;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setup(): void {
    if (this.isSetup) return;

    this.isSetup = true;
    Deno.stdout.writeSync(
      this.encoder.encode(
        "\x1b[?25l" + // Hide cursor
          "\x1b[2J" + // Clear screen
          "\x1b[H", // Move to home
      ),
    );
  }

  render(content: string[][]): void {
    if (!this.isSetup) this.setup();

    // Build entire frame as single string
    let frame = "\x1b[H"; // Move cursor to home

    for (let y = 0; y < Math.min(content.length, this.height); y++) {
      const line = content[y].slice(0, this.width).join("");
      frame += line + (y < this.height - 1 ? "\n" : "");
    }

    // Single write operation
    Deno.stdout.writeSync(this.encoder.encode(frame));
  }

  cleanup(): void {
    if (!this.isSetup) return;

    Deno.stdout.writeSync(this.encoder.encode("\x1b[?25h"));
    this.isSetup = false;
  }
}

/**
 * Line-based renderer for status displays
 * Updates only specific lines instead of the whole screen
 */
export class LineRenderer {
  private lines: Map<number, string> = new Map();
  private encoder = new TextEncoder();
  private isSetup = false;

  setup(): void {
    if (this.isSetup) return;

    this.isSetup = true;
    // Clear once, hide cursor
    Deno.stdout.writeSync(
      this.encoder.encode(
        "\x1b[2J" + // Clear screen
          "\x1b[H" + // Move to home
          "\x1b[?25l", // Hide cursor
      ),
    );
  }

  /**
   * Update a specific line
   */
  updateLine(lineNum: number, content: string): void {
    if (!this.isSetup) this.setup();

    // Move to line, clear it, write content
    const output = `\x1b[${lineNum};1H\x1b[K${content}`;
    Deno.stdout.writeSync(this.encoder.encode(output));

    this.lines.set(lineNum, content);
  }

  /**
   * Update multiple lines at once (batched)
   */
  updateLines(updates: Map<number, string>): void {
    if (!this.isSetup) this.setup();

    let output = "";
    for (const [lineNum, content] of updates.entries()) {
      output += `\x1b[${lineNum};1H\x1b[K${content}`;
      this.lines.set(lineNum, content);
    }

    if (output) {
      Deno.stdout.writeSync(this.encoder.encode(output));
    }
  }

  /**
   * Clear a specific line
   */
  clearLine(lineNum: number): void {
    this.updateLine(lineNum, "");
  }

  /**
   * Clear all lines
   */
  clear(): void {
    if (!this.isSetup) this.setup();

    Deno.stdout.writeSync(this.encoder.encode("\x1b[2J\x1b[H"));
    this.lines.clear();
  }

  cleanup(): void {
    if (!this.isSetup) return;

    Deno.stdout.writeSync(this.encoder.encode("\x1b[?25h"));
    this.isSetup = false;
  }

  /**
   * Get all current line content
   */
  getLines(): Map<number, string> {
    return new Map(this.lines);
  }
}

/**
 * Fixed update loop renderer with vsync-like timing
 * Prevents frame tearing and ensures consistent frame rate
 */
export class FixedUpdateRenderer {
  private running = false;
  private targetFPS: number;
  private frameInterval: number;
  private lastFrameTime = 0;
  private renderCallback?: () => string;
  private encoder = new TextEncoder();
  private isSetup = false;
  private timeoutId?: number;

  constructor(fps: number = 30) {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  setup(): void {
    if (this.isSetup) return;

    this.isSetup = true;
    Deno.stdout.writeSync(
      this.encoder.encode(
        "\x1b[?25l" + // Hide cursor
          "\x1b[2J", // Clear screen
      ),
    );
  }

  setRenderCallback(callback: () => string): void {
    this.renderCallback = callback;
  }

  start(): void {
    if (this.running) return;

    if (!this.isSetup) this.setup();

    this.running = true;
    this.lastFrameTime = performance.now();
    this.loop();
  }

  private loop(): void {
    if (!this.running) return;

    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= this.frameInterval) {
      this.lastFrameTime = now - (elapsed % this.frameInterval);

      if (this.renderCallback) {
        const content = this.renderCallback();
        Deno.stdout.writeSync(this.encoder.encode(`\x1b[H${content}`));
      }
    }

    // Use setTimeout instead of busy waiting
    const nextDelay = Math.max(0, this.frameInterval - (performance.now() - now));
    this.timeoutId = setTimeout(() => this.loop(), nextDelay) as unknown as number;
  }

  stop(): void {
    this.running = false;
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
    }
  }

  cleanup(): void {
    this.stop();
    if (!this.isSetup) return;

    Deno.stdout.writeSync(this.encoder.encode("\x1b[?25h"));
    this.isSetup = false;
  }

  isRunning(): boolean {
    return this.running;
  }
}
