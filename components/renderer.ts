// components/renderer.ts
/**
 * Deno-native TUI renderers with optimized double buffering
 * and ANSI escape sequences to eliminate glitching
 */

export interface TerminalRendererOptions {
  useAlternateScreen?: boolean;
  hideCursor?: boolean;
  clearOnSetup?: boolean;
  suppressBrokenPipeErrors?: boolean;
}

export abstract class TerminalRendererBase {
  protected readonly encoder: TextEncoder = new TextEncoder();
  protected isSetup = false;
  protected readonly options: Required<TerminalRendererOptions>;

  protected constructor(options: TerminalRendererOptions = {}) {
    this.options = {
      useAlternateScreen: options.useAlternateScreen ?? true,
      hideCursor: options.hideCursor ?? true,
      clearOnSetup: options.clearOnSetup ?? true,
      suppressBrokenPipeErrors: options.suppressBrokenPipeErrors ?? true,
    };
  }

  protected ensureSetup(): void {
    if (this.isSetup) return;

    const sequences: string[] = [];
    if (this.options.hideCursor) sequences.push("\x1b[?25l");
    if (this.options.useAlternateScreen) sequences.push("\x1b[?1049h");
    if (this.options.clearOnSetup) sequences.push("\x1b[2J");
    sequences.push("\x1b[H");
    this.writeRaw(sequences.join(""));
    this.isSetup = true;
  }

  protected teardown(): void {
    if (!this.isSetup) return;

    const sequences: string[] = [];
    if (this.options.useAlternateScreen) sequences.push("\x1b[?1049l");
    if (this.options.hideCursor) sequences.push("\x1b[?25h");
    this.writeRaw(sequences.join(""));
    this.isSetup = false;
  }

  protected writeRaw(content: string): void {
    if (!content) return;
    try {
      Deno.stdout.writeSync(this.encoder.encode(content));
    } catch (error) {
      if (
        this.options.suppressBrokenPipeErrors &&
        error instanceof Deno.errors.BrokenPipe
      ) {
        this.isSetup = false;
        return;
      }
      throw error;
    }
  }
}

export interface BufferedRendererOptions extends TerminalRendererOptions {
  backgroundChar?: string;
}

export interface RenderStats {
  frame: number;
  cellsChanged: number;
  forced: boolean;
}

/**
 * Double-buffered renderer using ANSI escape sequences
 * Only renders changed cells (differential rendering) to minimize writes
 */
export class BufferedRenderer extends TerminalRendererBase {
  private width: number;
  private height: number;
  private buffer: string[][] = [];
  private previousBuffer: string[][] = [];
  private framesRendered = 0;
  private needsFullRender = true;
  private backgroundChar: string;

  constructor(width: number, height: number, options: BufferedRendererOptions = {}) {
    super(options);
    this.width = width;
    this.height = height;
    this.backgroundChar = options.backgroundChar ?? " ";
    this.initBuffer();
  }

  private initBuffer(fillChar = this.backgroundChar): void {
    this.buffer = Array.from({ length: this.height }, () =>
      Array(this.width).fill(fillChar)
    );
    this.previousBuffer = Array.from({ length: this.height }, () =>
      Array(this.width).fill(fillChar)
    );
    this.needsFullRender = true;
  }

  /**
   * Setup alternate screen buffer and hide cursor
   */
  setup(): void {
    this.ensureSetup();
  }

  /**
   * Only render changed cells (differential rendering)
   * This dramatically reduces terminal writes and eliminates glitching
   */
  render(force = false): RenderStats {
    this.ensureSetup();

    const requireFullRender = force || this.needsFullRender;
    if (requireFullRender) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.previousBuffer[y][x] = "";
        }
      }
      this.needsFullRender = false;
    }

    let output = "";
    let cellsChanged = 0;

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.buffer[y][x] !== this.previousBuffer[y][x]) {
          output += `\x1b[${y + 1};${x + 1}H${this.buffer[y][x]}`;
          this.previousBuffer[y][x] = this.buffer[y][x];
          cellsChanged++;
        }
      }
    }

    if (output) {
      this.writeRaw(output);
    }

    this.framesRendered++;
    return {
      frame: this.framesRendered,
      cellsChanged,
      forced: requireFullRender,
    };
  }

  /**
   * Run a full frame (mutation + render) atomically.
   */
  async withFrame(
    draw: (renderer: this) => void | Promise<void>,
    options: { force?: boolean } = {},
  ): Promise<RenderStats> {
    await draw(this);
    return this.render(options.force ?? false);
  }

  /**
   * Write text to buffer at position
   */
  write(x: number, y: number, text: string, color?: string): void {
    const chars = Array.from(text);
    for (let i = 0; i < chars.length; i++) {
      const px = x + i;
      if (y < 0 || y >= this.height || px < 0 || px >= this.width) continue;
      this.buffer[y][px] = color ? `${color}${chars[i]}\x1b[0m` : chars[i];
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
   * Resize buffer while optionally preserving content
   */
  resize(width: number, height: number, preserve = true): void {
    if (width === this.width && height === this.height) return;

    const newBuffer = Array.from({ length: height }, () =>
      Array(width).fill(this.backgroundChar)
    );
    const newPrevious = Array.from({ length: height }, () =>
      Array(width).fill(this.backgroundChar)
    );

    if (preserve) {
      const copyHeight = Math.min(height, this.height);
      const copyWidth = Math.min(width, this.width);
      for (let y = 0; y < copyHeight; y++) {
        for (let x = 0; x < copyWidth; x++) {
          newBuffer[y][x] = this.buffer[y][x];
          newPrevious[y][x] = this.previousBuffer[y][x];
        }
      }
    }

    this.width = width;
    this.height = height;
    this.buffer = newBuffer;
    this.previousBuffer = newPrevious;
    this.needsFullRender = true;
  }

  /**
   * Force renderer to redraw entire buffer on next render call
   */
  forceFullRender(): void {
    this.needsFullRender = true;
  }

  /**
   * Restore terminal state
   */
  cleanup(): void {
    this.teardown();
  }

  /**
   * Get buffer dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Get current frame counter
   */
  getFrameCount(): number {
    return this.framesRendered;
  }
}

/**
 * Single-pass renderer for simple use cases
 * Builds entire frame as a single string, then writes once
 */
export class SinglePassRenderer extends TerminalRendererBase {
  private width: number;
  private height: number;

  constructor(width: number, height: number, options: TerminalRendererOptions = {}) {
    super({
      useAlternateScreen: options.useAlternateScreen ?? false,
      hideCursor: options.hideCursor ?? true,
      clearOnSetup: options.clearOnSetup ?? true,
      suppressBrokenPipeErrors: options.suppressBrokenPipeErrors ?? true,
    });
    this.width = width;
    this.height = height;
  }

  setup(): void {
    this.ensureSetup();
  }

  render(content: string[][]): void {
    this.ensureSetup();

    let frame = "\x1b[H";
    const height = Math.min(content.length, this.height);

    for (let y = 0; y < height; y++) {
      const line = content[y].slice(0, this.width).join("");
      frame += line;
      if (y < height - 1) frame += "\n";
    }

    this.writeRaw(frame);
  }

  renderLines(lines: string[]): void {
    const matrix = lines.map((line) => [line]);
    this.render(matrix);
  }

  setViewport(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  getViewport(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  cleanup(): void {
    this.teardown();
  }
}

/**
 * Line-based renderer for status displays
 * Updates only specific lines instead of the whole screen
 */
export class LineRenderer extends TerminalRendererBase {
  private lines: Map<number, string> = new Map();

  constructor(options: TerminalRendererOptions = {}) {
    super({
      useAlternateScreen: options.useAlternateScreen ?? false,
      hideCursor: options.hideCursor ?? true,
      clearOnSetup: options.clearOnSetup ?? false,
      suppressBrokenPipeErrors: options.suppressBrokenPipeErrors ?? true,
    });
  }

  setup(): void {
    if (this.isSetup) return;
    this.ensureSetup();
    this.writeRaw("\x1b[2J\x1b[H");
  }

  /**
   * Update a specific line
   */
  updateLine(lineNum: number, content: string): void {
    if (!this.isSetup) this.setup();
    const sanitizedLine = Math.max(1, lineNum);
    const output = `\x1b[${sanitizedLine};1H\x1b[K${content}`;
    this.writeRaw(output);
    this.lines.set(sanitizedLine, content);
  }

  /**
   * Update multiple lines at once (batched)
   */
  updateLines(updates: Map<number, string> | Iterable<[number, string]>): void {
    if (!this.isSetup) this.setup();

    let output = "";
    for (const [lineNum, content] of updates) {
      const sanitizedLine = Math.max(1, lineNum);
      output += `\x1b[${sanitizedLine};1H\x1b[K${content}`;
      this.lines.set(sanitizedLine, content);
    }

    if (output) {
      this.writeRaw(output);
    }
  }

  /**
   * Clear a specific line
   */
  clearLine(lineNum: number): void {
    const sanitizedLine = Math.max(1, lineNum);
    this.updateLine(sanitizedLine, "");
    this.lines.delete(sanitizedLine);
  }

  /**
   * Clear all lines
   */
  clear(): void {
    if (!this.isSetup) this.setup();
    this.writeRaw("\x1b[2J\x1b[H");
    this.lines.clear();
  }

  cleanup(): void {
    this.teardown();
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
export class FixedUpdateRenderer extends TerminalRendererBase {
  private running = false;
  private targetFPS: number;
  private frameInterval: number;
  private lastFrameTime = 0;
  private renderCallback?: () => string | string[];
  private timeoutId?: number;
  private framesRendered = 0;

  constructor(fps: number = 30, options: TerminalRendererOptions = {}) {
    super({
      useAlternateScreen: options.useAlternateScreen ?? false,
      hideCursor: options.hideCursor ?? true,
      clearOnSetup: options.clearOnSetup ?? true,
      suppressBrokenPipeErrors: options.suppressBrokenPipeErrors ?? true,
    });
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  setup(): void {
    this.ensureSetup();
  }

  setRenderCallback(callback: () => string | string[]): void {
    this.renderCallback = callback;
  }

  setFPS(fps: number): void {
    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;
  }

  start(): void {
    if (this.running) return;

    this.ensureSetup();
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
        const normalized = Array.isArray(content) ? content.join("\n") : content;
        this.writeRaw(`\x1b[H${normalized}`);
        this.framesRendered++;
      }
    }

    const nextDelay = Math.max(0, this.frameInterval - (performance.now() - now));
    this.timeoutId = setTimeout(() => this.loop(), nextDelay) as unknown as number;
  }

  stop(): void {
    this.running = false;
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
    }
  }

  cleanup(): void {
    this.stop();
    this.teardown();
  }

  isRunning(): boolean {
    return this.running;
  }

  getFrameCount(): number {
    return this.framesRendered;
  }
}
