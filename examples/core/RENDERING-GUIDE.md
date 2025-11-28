# GenesisTrace Rendering Guide

## Eliminating TUI Glitching with Deno-Native Methods

This guide covers the new rendering approaches in GenesisTrace that eliminate screen glitching and tearing using only Deno built-in APIs.

---

## The Problem

Traditional TUI rendering often suffers from:

- **Screen flashing** - Rapid `console.clear()` calls cause visible flicker
- **Tearing** - Partial frame updates create visual artifacts
- **Performance issues** - Too many terminal writes slow down rendering
- **Cursor flickering** - Cursor visibility changes cause distractions

## The Solution

GenesisTrace provides **four rendering strategies** using only Deno-native methods:

1. **BufferedRenderer** - Double buffering with differential rendering
2. **LineRenderer** - Line-based updates for status displays
3. **SinglePassRenderer** - Single-string frame rendering
4. **FixedUpdateRenderer** - Vsync-like timing for animations
5. **AnimationLoop** - Batched rendering for multiple animations

---

## 1. BufferedRenderer (Recommended for Complex UIs)

**Best for:** Games, complex dashboards, particle systems, full-screen UIs

### Features

- ✅ Double buffering (differential rendering)
- ✅ Only updates changed cells
- ✅ Alternate screen buffer support
- ✅ No screen flashing
- ✅ Efficient memory usage

### Usage

```typescript
import { BufferedRenderer, ColorSystem } from "jsr:@genesis-trace/core";

const renderer = new BufferedRenderer(80, 24); // width, height
renderer.setup();

// Write to buffer
renderer.write(10, 5, "Hello, World!", ColorSystem.codes.brightGreen);
renderer.fillRect(5, 3, 20, 10, "█", ColorSystem.codes.cyan);

// Render (only changed cells are written)
renderer.render();

// Cleanup
renderer.cleanup();
```

### Example: Animated Box

```typescript
const renderer = new BufferedRenderer(80, 24);
renderer.setup();

for (let frame = 0; frame < 100; frame++) {
  renderer.clear();

  // Draw box
  renderer.write(10, 5, "╔" + "═".repeat(60) + "╗", ColorSystem.codes.cyan);
  for (let y = 6; y < 15; y++) {
    renderer.write(10, y, "║", ColorSystem.codes.cyan);
    renderer.write(71, y, "║", ColorSystem.codes.cyan);
  }
  renderer.write(10, 15, "╚" + "═".repeat(60) + "╝", ColorSystem.codes.cyan);

  // Animated content
  renderer.write(15, 10, `Frame: ${frame}`, ColorSystem.codes.white);

  // Render changes
  renderer.render();

  await sleep(33); // ~30 FPS
}

renderer.cleanup();
```

**See:** `buffered-renderer-demo.ts` for complete examples

---

## 2. LineRenderer (Best for Status Displays)

**Best for:** Dashboards, log streaming, progress displays, real-time metrics

### Features

- ✅ Update only specific lines
- ✅ Batched line updates
- ✅ Perfect for status displays
- ✅ Minimal terminal writes

### Usage

```typescript
import { LineRenderer, ColorSystem } from "jsr:@genesis-trace/core";

const renderer = new LineRenderer();
renderer.setup();

// Update single line
renderer.updateLine(1, "╔════════════════════════╗");
renderer.updateLine(2, "║  Status Dashboard      ║");
renderer.updateLine(3, "╚════════════════════════╝");

// Update multiple lines at once (batched)
const updates = new Map([
  [5, ColorSystem.colorize("CPU: 45%", ColorSystem.codes.green)],
  [6, ColorSystem.colorize("Memory: 62%", ColorSystem.codes.yellow)],
  [7, ColorSystem.colorize("Status: Running", ColorSystem.codes.brightGreen)]
]);
renderer.updateLines(updates);

// Cleanup
renderer.cleanup();
```

### Example: Real-time Dashboard

```typescript
const renderer = new LineRenderer();
renderer.setup();

// Header (static)
renderer.updateLine(1, "╔═══════════════════════════════╗");
renderer.updateLine(2, "║  REAL-TIME DASHBOARD          ║");
renderer.updateLine(3, "╚═══════════════════════════════╝");

// Update metrics in real-time
setInterval(() => {
  const cpu = (30 + Math.random() * 40).toFixed(1);
  const mem = (50 + Math.random() * 30).toFixed(1);

  renderer.updateLine(5, `CPU Usage: ${cpu}%`);
  renderer.updateLine(6, `Memory: ${mem}%`);
  renderer.updateLine(7, `Time: ${new Date().toISOString()}`);
}, 100);
```

**See:** `line-renderer-demo.ts` for complete examples

---

## 3. SinglePassRenderer (Simple Frame Rendering)

**Best for:** Simple animations, slideshows, frame-by-frame rendering

### Features

- ✅ Builds entire frame as one string
- ✅ Single write operation per frame
- ✅ Simple and straightforward
- ✅ Good for basic animations

### Usage

```typescript
import { SinglePassRenderer } from "jsr:@genesis-trace/core";

const renderer = new SinglePassRenderer(80, 24);
renderer.setup();

// Build frame as 2D array
const frame: string[][] = Array(24).fill(null).map(() =>
  Array(80).fill(" ")
);

// Add content
for (let x = 0; x < 80; x++) {
  frame[5][x] = "═";
}

// Render entire frame at once
renderer.render(frame);

renderer.cleanup();
```

---

## 4. FixedUpdateRenderer (Game Loop Style)

**Best for:** Games, smooth animations, physics simulations

### Features

- ✅ Fixed FPS timing (vsync-like)
- ✅ Consistent frame rate
- ✅ Single render callback
- ✅ No frame drops

### Usage

```typescript
import { FixedUpdateRenderer, ColorSystem } from "jsr:@genesis-trace/core";

const renderer = new FixedUpdateRenderer(30); // 30 FPS

let frame = 0;

renderer.setRenderCallback(() => {
  const output = [
    "\x1b[2J\x1b[H", // Clear and home
    ColorSystem.colorize("Game Loop Demo\n", ColorSystem.codes.bright),
    `Frame: ${frame}\n`,
    `FPS: 30\n`
  ];

  frame++;
  return output.join("");
});

renderer.start();

// Stop after 5 seconds
setTimeout(() => {
  renderer.cleanup();
}, 5000);
```

**See:** `fixed-update-renderer-demo.ts` for complete examples

---

## 5. AnimationLoop with Batched Rendering

**Best for:** Multiple concurrent animations, effects, smooth updates

### Features

- ✅ Batches all animation outputs
- ✅ Single write per frame
- ✅ Callbacks can return strings
- ✅ Precise FPS control

### Updated Usage

```typescript
import { AnimationLoop, RainbowAnimation } from "jsr:@genesis-trace/core";

const loop = new AnimationLoop({ fps: 30, maxFrames: 120 });

const rainbow = new RainbowAnimation("✨ GENESIS TRACE ✨", 0.05);

// Callbacks now return strings for batched rendering
loop.add(() => {
  const text = rainbow.update();
  return `\x1b[5;1H\x1b[K${text}`; // Position cursor + clear line + text
});

loop.add((frame) => {
  return `\x1b[7;1H\x1b[KFrame: ${frame}`;
});

loop.start();
```

### Key Change: Return Strings

Animation callbacks can now **return strings** that will be batched together:

```typescript
// ✅ NEW: Return ANSI-positioned string
loop.add((frame, deltaTime) => {
  const wave = waveAnimation.update(deltaTime);
  return `\x1b[10;1H\x1b[K  ${wave}`; // Move cursor, clear line, write
});

// ✅ ALSO WORKS: Old style (no return)
loop.add((frame, deltaTime) => {
  // Manual Deno.stdout.writeSync still works
  Deno.stdout.writeSync(encoder.encode("\x1b[10;1H..."));
});
```

**All callbacks execute, then outputs are written in one operation!**

---

## ANSI Escape Codes Reference

These codes work natively in Deno with `Deno.stdout.writeSync()`:

| Code | Description |
|------|-------------|
| `\x1b[H` | Move cursor to home (1,1) |
| `\x1b[{row};{col}H` | Move cursor to position |
| `\x1b[2J` | Clear entire screen |
| `\x1b[K` | Clear current line from cursor |
| `\x1b[?25l` | Hide cursor |
| `\x1b[?25h` | Show cursor |
| `\x1b[?1049h` | Enable alternate screen buffer |
| `\x1b[?1049l` | Disable alternate screen buffer |
| `\x1b[0m` | Reset all formatting |

### Example: Positioned Text

```typescript
const encoder = new TextEncoder();

// Move to row 10, column 20 and write text
const output = "\x1b[10;20HHello, World!";
Deno.stdout.writeSync(encoder.encode(output));
```

---

## Performance Comparison

| Renderer | Writes/Frame | Best For | Complexity |
|----------|--------------|----------|------------|
| BufferedRenderer | ~10-50 (changed cells only) | Complex UIs, games | Medium |
| LineRenderer | 1-15 (changed lines only) | Dashboards, logs | Low |
| SinglePassRenderer | 1 (entire frame) | Simple animations | Low |
| FixedUpdateRenderer | 1 (callback output) | Game loops | Low |
| AnimationLoop (batched) | 1 (all callbacks) | Multiple animations | Low |

---

## Best Practices

### 1. Choose the Right Renderer

```typescript
// ✅ Complex UI with many elements
const renderer = new BufferedRenderer(80, 24);

// ✅ Status dashboard
const renderer = new LineRenderer();

// ✅ Simple slideshow
const renderer = new SinglePassRenderer(80, 24);

// ✅ Game loop
const renderer = new FixedUpdateRenderer(60);
```

### 2. Always Cleanup

```typescript
const cleanup = () => {
  renderer.cleanup();
  Deno.exit(0);
};

Deno.addSignalListener("SIGINT", cleanup);
```

### 3. Batch Updates

```typescript
// ❌ BAD: Multiple writes
renderer.updateLine(1, "Line 1");
renderer.updateLine(2, "Line 2");
renderer.updateLine(3, "Line 3");

// ✅ GOOD: Batched update
renderer.updateLines(new Map([
  [1, "Line 1"],
  [2, "Line 2"],
  [3, "Line 3"]
]));
```

### 4. Use Alternate Screen Buffer

```typescript
// Preserves user's terminal content
renderer.setup(); // Enables alternate screen
// ... render content ...
renderer.cleanup(); // Returns to normal screen
```

### 5. Control Frame Rate

```typescript
// For animations, match refresh rate
const loop = new AnimationLoop({
  fps: 30,  // Smooth for most terminals
  maxFrames: 120
});
```

---

## Migration Guide

### Old Approach (Glitchy)

```typescript
// ❌ OLD: Causes glitching
for (let i = 0; i < 100; i++) {
  console.clear();
  console.log("Frame:", i);

  TerminalDetector.clearLine();
  Deno.stdout.writeSync(encoder.encode(`\r${text}`));

  await sleep(33);
}
```

### New Approach (Smooth)

```typescript
// ✅ NEW: Smooth rendering
const renderer = new BufferedRenderer(80, 24);
renderer.setup();

for (let i = 0; i < 100; i++) {
  renderer.clear();
  renderer.write(0, 5, `Frame: ${i}`, ColorSystem.codes.white);
  renderer.render(); // Only changed cells are written

  await sleep(33);
}

renderer.cleanup();
```

---

## Examples

Run the examples to see each renderer in action:

```bash
# Buffered renderer with complex animations
deno run --allow-env examples/core/buffered-renderer-demo.ts

# Line renderer for dashboards
deno run --allow-env examples/core/line-renderer-demo.ts

# Fixed update renderer with game loop
deno run --allow-env examples/core/fixed-update-renderer-demo.ts
```

---

## Technical Details

### Double Buffering

BufferedRenderer maintains two buffers:

1. **Current buffer** - What's being rendered
2. **Previous buffer** - What was last rendered

Only cells that differ are written to the terminal.

### Differential Rendering Algorithm

```typescript
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (buffer[y][x] !== previousBuffer[y][x]) {
      output += `\x1b[${y + 1};${x + 1}H${buffer[y][x]}`;
      previousBuffer[y][x] = buffer[y][x];
    }
  }
}
```

### Batched Write Operations

AnimationLoop collects all callback returns:

```typescript
const outputs: string[] = [];

for (const callback of callbacks) {
  const result = await callback(frame, deltaTime);
  if (typeof result === "string") {
    outputs.push(result);
  }
}

// Single write
Deno.stdout.writeSync(encoder.encode(outputs.join("")));
```

---

## Troubleshooting

### Issue: Colors not showing

**Solution:** Ensure terminal supports ANSI colors

```typescript
import { TerminalDetector } from "jsr:@genesis-trace/core";

if (!TerminalDetector.supportsColor()) {
  console.log("Terminal doesn't support colors");
}
```

### Issue: Cursor still visible

**Solution:** Ensure cleanup is called

```typescript
Deno.addSignalListener("SIGINT", () => {
  renderer.cleanup();
  Deno.exit(0);
});
```

### Issue: Screen size wrong

**Solution:** Get terminal dimensions

```typescript
const { columns, rows } = Deno.consoleSize();
const renderer = new BufferedRenderer(columns, rows);
```

---

## Deno-Native APIs Used

All renderers use **only** Deno built-in methods:

- ✅ `Deno.stdout.writeSync()` - Direct terminal output
- ✅ `TextEncoder` - String to Uint8Array conversion
- ✅ `performance.now()` - High-resolution timing
- ✅ `setTimeout()` - Non-blocking delays
- ✅ `Deno.consoleSize()` - Terminal dimensions
- ✅ `Deno.addSignalListener()` - Cleanup handling

**Zero external dependencies for rendering!**

---

## Further Reading

- [ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)
- [Deno Standard Output API](https://deno.land/api@latest?s=Deno.stdout)
- [Terminal Control Sequences](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)
- [Double Buffering Technique](https://en.wikipedia.org/wiki/Multiple_buffering)

---

## Summary

The new rendering system eliminates TUI glitching by:

1. **Minimizing writes** - Only update what changed
2. **Batching operations** - Combine multiple updates
3. **Using ANSI codes** - Direct cursor control
4. **Alternate buffers** - Separate UI from terminal
5. **Fixed timing** - Consistent frame rates

Choose the right renderer for your use case and enjoy glitch-free TUIs! 🎨
