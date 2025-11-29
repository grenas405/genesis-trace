// components/animation.ts
import { ColorSystem } from "../core/colors.ts";
import { TerminalDetector } from "../utils/terminal.ts";

/**
 * Animation frame callback
 * Can optionally return a string to be rendered
 */
export type AnimationCallback = (frame: number, deltaTime: number) => void | string | Promise<void | string>;

/**
 * Animation loop options
 */
export interface AnimationLoopOptions {
  fps?: number;
  maxFrames?: number;
  autoStart?: boolean;
}

/**
 * Real-time animation loop with precise FPS control
 */
export class AnimationLoop {
  private running = false;
  private frame = 0;
  private lastTime = 0;
  private deltaTime = 0;
  private callbacks: AnimationCallback[] = [];
  private frameInterval: number;
  private maxFrames?: number;
  private rafId?: number;

  constructor(private options: AnimationLoopOptions = {}) {
    const fps = options.fps || 60;
    this.frameInterval = 1000 / fps;
    this.maxFrames = options.maxFrames;

    if (options.autoStart) {
      this.start();
    }
  }

  /**
   * Add animation callback
   */
  add(callback: AnimationCallback): void {
    this.callbacks.push(callback);
  }

  /**
   * Remove animation callback
   */
  remove(callback: AnimationCallback): void {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }

  /**
   * Start animation loop
   */
  start(): void {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.frame = 0;

    TerminalDetector.hideCursor();
    this.loop();
  }

  /**
   * Stop animation loop
   */
  stop(): void {
    if (!this.running) return;

    this.running = false;
    if (this.rafId !== undefined) {
      clearTimeout(this.rafId);
    }

    TerminalDetector.showCursor();
  }

  /**
   * Main animation loop with batched rendering
   * Collects all callback outputs and writes them in a single operation
   */
  private async loop(): Promise<void> {
    if (!this.running) return;

    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= this.frameInterval) {
      this.deltaTime = elapsed / 1000;
      this.lastTime = currentTime - (elapsed % this.frameInterval);

      // Collect all outputs first (batching)
      const outputs: string[] = [];

      for (const callback of this.callbacks) {
        const result = await callback(this.frame, this.deltaTime);
        if (typeof result === "string" && result.length > 0) {
          outputs.push(result);
        }
      }

      // Single batched write operation to prevent glitching
      if (outputs.length > 0) {
        const encoder = new TextEncoder();
        const batchedOutput = outputs.join("");
        Deno.stdout.writeSync(encoder.encode(batchedOutput));
      }

      this.frame++;

      // Check max frames
      if (this.maxFrames !== undefined && this.frame >= this.maxFrames) {
        this.stop();
        return;
      }
    }

    // Use setTimeout with calculated delay instead of busy-waiting
    const nextDelay = Math.max(0, this.frameInterval - (performance.now() - currentTime));
    this.rafId = setTimeout(() => this.loop(), nextDelay) as unknown as number;
  }

  /**
   * Get current frame number
   */
  getFrame(): number {
    return this.frame;
  }

  /**
   * Check if running
   */
  isRunning(): boolean {
    return this.running;
  }
}

/**
 * Animation effect options
 */
export interface AnimationEffectOptions {
  duration?: number;
  loop?: boolean;
  easing?: (t: number) => number;
}

/**
 * Easing functions
 */
export const Easing = {
  linear: (t: number): number => t,
  easeInQuad: (t: number): number => t * t,
  easeOutQuad: (t: number): number => t * (2 - t),
  easeInOutQuad: (t: number): number => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number): number => t * t * t,
  easeOutCubic: (t: number): number => (--t) * t * t + 1,
  easeInOutCubic: (t: number): number => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInSine: (t: number): number => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t: number): number => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t: number): number => -(Math.cos(Math.PI * t) - 1) / 2,
  elastic: (t: number): number =>
    Math.sin(-13 * (t + 1) * Math.PI / 2) * Math.pow(2, -10 * t) + 1,
  bounce: (t: number): number => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  },
};

/**
 * Text fade animation
 */
export class FadeAnimation {
  private startTime = 0;
  private progress = 0;

  constructor(
    private text: string,
    private options: AnimationEffectOptions = {},
  ) {
    this.options.duration = options.duration || 1000;
    this.options.easing = options.easing || Easing.linear;
  }

  /**
   * Update animation
   */
  update(time: number): string {
    if (this.startTime === 0) {
      this.startTime = time;
    }

    const elapsed = time - this.startTime;
    this.progress = Math.min(1, elapsed / this.options.duration!);
    const eased = this.options.easing!(this.progress);

    const opacity = Math.round(eased * 100);
    const color = ColorSystem.rgb(opacity * 2.55, opacity * 2.55, opacity * 2.55);

    return ColorSystem.colorize(this.text, color);
  }

  /**
   * Check if complete
   */
  isComplete(): boolean {
    return this.progress >= 1;
  }

  /**
   * Reset animation
   */
  reset(): void {
    this.startTime = 0;
    this.progress = 0;
  }
}

/**
 * Rainbow text animation
 */
export class RainbowAnimation {
  private offset = 0;

  constructor(
    private text: string,
    private speed = 0.1,
  ) {}

  /**
   * Update animation
   */
  update(): string {
    const colors: string[] = [];

    for (let i = 0; i < this.text.length; i++) {
      const hue = (this.offset + i * 10) % 360;
      const color = this.hslToRgb(hue, 100, 50);
      colors.push(ColorSystem.colorize(this.text[i], ColorSystem.rgb(color[0], color[1], color[2])));
    }

    this.offset += this.speed * 360;
    if (this.offset >= 360) this.offset = 0;

    return colors.join("");
  }

  /**
   * Convert HSL to RGB
   */
  private hslToRgb(h: number, s: number, l: number): [number, number, number] {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (h < 60) {
      r = c; g = x; b = 0;
    } else if (h < 120) {
      r = x; g = c; b = 0;
    } else if (h < 180) {
      r = 0; g = c; b = x;
    } else if (h < 240) {
      r = 0; g = x; b = c;
    } else if (h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255),
    ];
  }
}

/**
 * Pulse animation
 */
export class PulseAnimation {
  private time = 0;

  constructor(
    private text: string,
    private color: string,
    private speed = 2,
    private minIntensity = 0.3,
  ) {}

  /**
   * Update animation
   */
  update(deltaTime: number): string {
    this.time += deltaTime;
    const intensity = (Math.sin(this.time * this.speed) + 1) / 2;
    const adjustedIntensity = this.minIntensity + intensity * (1 - this.minIntensity);

    // Parse RGB from color code if needed
    const r = Math.round(adjustedIntensity * 255);
    const g = Math.round(adjustedIntensity * 255);
    const b = Math.round(adjustedIntensity * 255);

    return ColorSystem.colorize(this.text, ColorSystem.rgb(r, g, b));
  }
}

/**
 * Wave animation
 */
export class WaveAnimation {
  private offset = 0;
  private chars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];

  constructor(
    private width = 20,
    private speed = 0.5,
    private color?: string,
  ) {}

  /**
   * Update animation
   */
  update(deltaTime: number): string {
    this.offset += deltaTime * this.speed;

    const wave: string[] = [];
    for (let i = 0; i < this.width; i++) {
      const value = Math.sin(this.offset + i * 0.5);
      const index = Math.floor(((value + 1) / 2) * (this.chars.length - 1));
      wave.push(this.chars[index]);
    }

    const waveStr = wave.join("");
    return this.color ? ColorSystem.colorize(waveStr, this.color) : waveStr;
  }
}

/**
 * Particle system
 */
export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  char: string;
  color?: string;
}

export class ParticleSystem {
  private particles: Particle[] = [];

  constructor(
    private width: number,
    private height: number,
  ) {}

  /**
   * Emit particle
   */
  emit(x: number, y: number, options: Partial<Particle> = {}): void {
    const particle: Particle = {
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 1,
      char: "*",
      ...options,
    };

    this.particles.push(particle);
  }

  /**
   * Update particles
   */
  update(deltaTime: number): void {
    this.particles = this.particles.filter((p) => {
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.life += deltaTime;

      // Apply gravity
      p.vy += 9.8 * deltaTime * 0.1;

      return p.life < p.maxLife &&
             p.x >= 0 && p.x < this.width &&
             p.y >= 0 && p.y < this.height;
    });
  }

  /**
   * Render particles to buffer
   */
  render(): string {
    const buffer: string[][] = Array(this.height).fill(null).map(() =>
      Array(this.width).fill(" ")
    );

    for (const p of this.particles) {
      const x = Math.floor(p.x);
      const y = Math.floor(p.y);

      if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
        const char = p.color
          ? ColorSystem.colorize(p.char, p.color)
          : p.char;
        buffer[y][x] = char;
      }
    }

    return buffer.map(row => row.join("")).join("\n");
  }

  /**
   * Get particle count
   */
  count(): number {
    return this.particles.length;
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }
}

/**
 * Loading bar animation
 */
export class LoadingBarAnimation {
  private progress = 0;
  private direction = 1;

  constructor(
    private width = 20,
    private style: "fill" | "bounce" | "wave" = "fill",
    private char = "█",
    private color?: string,
  ) {}

  /**
   * Update animation
   */
  update(deltaTime: number): string {
    const speed = 0.5;

    if (this.style === "fill") {
      this.progress += deltaTime * speed;
      if (this.progress > 1) this.progress = 0;

      const filled = Math.floor(this.progress * this.width);
      const bar = this.char.repeat(filled) + "░".repeat(this.width - filled);
      return this.color ? ColorSystem.colorize(bar, this.color) : bar;

    } else if (this.style === "bounce") {
      this.progress += deltaTime * speed * this.direction;

      if (this.progress >= 1) {
        this.progress = 1;
        this.direction = -1;
      } else if (this.progress <= 0) {
        this.progress = 0;
        this.direction = 1;
      }

      const pos = Math.floor(this.progress * (this.width - 1));
      const bar = "░".repeat(pos) + this.char + "░".repeat(this.width - pos - 1);
      return this.color ? ColorSystem.colorize(bar, this.color) : bar;

    } else { // wave
      this.progress += deltaTime * speed;
      const bar: string[] = [];

      for (let i = 0; i < this.width; i++) {
        const value = Math.sin(this.progress * 2 + i * 0.3);
        const intensity = (value + 1) / 2;
        bar.push(intensity > 0.5 ? this.char : "░");
      }

      const result = bar.join("");
      return this.color ? ColorSystem.colorize(result, this.color) : result;
    }
  }
}

/**
 * Matrix rain effect
 */
export class MatrixRainAnimation {
  private columns: { y: number; speed: number; chars: string[] }[] = [];
  private chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン01";

  constructor(
    private width: number,
    private height: number,
    private density = 0.3,
  ) {
    this.initialize();
  }

  /**
   * Initialize columns
   */
  private initialize(): void {
    const numColumns = Math.floor(this.width * this.density);

    for (let i = 0; i < numColumns; i++) {
      this.columns.push({
        y: Math.random() * this.height,
        speed: 0.5 + Math.random() * 1.5,
        chars: [],
      });
    }
  }

  /**
   * Update animation
   */
  update(deltaTime: number): string {
    const buffer: string[][] = Array(this.height).fill(null).map(() =>
      Array(this.width).fill(" ")
    );

    for (const col of this.columns) {
      col.y += col.speed * deltaTime * 10;

      if (col.y > this.height + 10) {
        col.y = -10;
        col.chars = [];
      }

      // Add new char
      if (col.chars.length < 15) {
        const char = this.chars[Math.floor(Math.random() * this.chars.length)];
        col.chars.unshift(char);
      } else {
        col.chars.pop();
      }

      // Render column
      const x = Math.floor(Math.random() * this.width);
      for (let i = 0; i < col.chars.length; i++) {
        const y = Math.floor(col.y - i);
        if (y >= 0 && y < this.height && x < this.width) {
          const intensity = 1 - (i / col.chars.length);
          const green = Math.floor(intensity * 255);
          const color = ColorSystem.rgb(0, green, 0);
          buffer[y][x] = ColorSystem.colorize(col.chars[i], color);
        }
      }
    }

    return buffer.map(row => row.join("")).join("\n");
  }
}
