// themes/dracula.ts
import { Theme } from "./theme-interface.ts";
import { ColorSystem } from "../core/colors.ts";

export const draculaTheme: Theme = {
  name: "dracula",
  colors: {
    primary: ColorSystem.hex("#bd93f9"), // Purple
    secondary: ColorSystem.hex("#8be9fd"), // Cyan
    success: ColorSystem.hex("#50fa7b"), // Green
    warning: ColorSystem.hex("#ffb86c"), // Orange
    error: ColorSystem.hex("#ff5555"), // Red
    info: ColorSystem.hex("#8be9fd"), // Cyan
    debug: ColorSystem.hex("#6272a4"), // Gray/Blue
    critical: ColorSystem.hex("#ff5555") + "\x1b[1m",
    muted: ColorSystem.hex("#6272a4"),
    accent: ColorSystem.hex("#f1fa8c"), // Yellow
  },
  symbols: {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ⓘ",
    debug: "⊙",
    critical: "⚠",
    bullet: "▪",
    arrow: "➜",
    check: "✓",
    cross: "✗",
  },
  boxDrawing: {
    topLeft: "╭",
    topRight: "╮",
    bottomLeft: "╰",
    bottomRight: "╯",
    horizontal: "─",
    vertical: "│",
    cross: "┼",
    teeLeft: "├",
    teeRight: "┤",
    teeTop: "┬",
    teeBottom: "┴",
  },
};
