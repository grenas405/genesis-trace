// components/charts.ts
import { ColorSystem } from "../core/colors.ts";
import { Formatter } from "../core/formatter.ts";

export interface ChartData {
  label: string;
  value: number;
}

export interface ChartOptions {
  width?: number;
  height?: number;
  showValues?: boolean;
  showLabels?: boolean;
  colorize?: boolean;
  color?: string;
}

export class ChartRenderer {
  /**
   * Render bar chart
   */
  static barChart(data: ChartData[], options: ChartOptions = {}): void {
    const {
      width,
      showValues = true,
      showLabels = true,
      colorize = true,
      color = ColorSystem.codes.blue,
    } = options;

    if (data.length === 0) {
      console.log("No data to display");
      return;
    }

    const resolvedWidth = this.resolveAvailableWidth(width);
    const maxValue = Math.max(...data.map((d) => d.value));
    const labelLengths = showLabels
      ? data.map((d) => ColorSystem.visibleLength(d.label))
      : [];
    const maxLabelLength = labelLengths.length > 0 ? Math.max(...labelLengths) : 0;
    const valueColumnWidth = showValues
      ? Math.max(...data.map((d) => ColorSystem.visibleLength(String(d.value))))
      : 0;
    const minBarWidth = 1;
    const reservedForValues = showValues ? valueColumnWidth + 1 : 0;
    const remainingAfterValue = Math.max(
      minBarWidth,
      resolvedWidth - reservedForValues,
    );
    const preferredLabelWidth = showLabels
      ? Math.min(
        maxLabelLength,
        Math.max(5, Math.floor(resolvedWidth * 0.35)),
      )
      : 0;
    const maxAllowedLabelWidth = showLabels
      ? Math.max(0, remainingAfterValue - minBarWidth - 1)
      : 0;
    const labelColumnWidth = showLabels && maxAllowedLabelWidth > 0
      ? Math.max(1, Math.min(preferredLabelWidth, maxAllowedLabelWidth))
      : 0;
    const hasLabelColumn = showLabels && labelColumnWidth > 0;
    const barWidth = Math.max(
      minBarWidth,
      remainingAfterValue - (hasLabelColumn ? labelColumnWidth + 1 : 0),
    );

    data.forEach((item) => {
      const ratio = maxValue === 0 ? 0 : item.value / maxValue;
      const barLength = Math.round(ratio * barWidth);
      const filledSegment = barLength > 0 ? "█".repeat(barLength) : "";
      const coloredSegment = colorize && filledSegment
        ? ColorSystem.colorize(filledSegment, color)
        : filledSegment;
      const bar = Formatter.pad(coloredSegment, barWidth);
      const parts: string[] = [];

      if (hasLabelColumn) {
        const truncatedLabel = Formatter.truncate(item.label, labelColumnWidth);
        parts.push(Formatter.pad(truncatedLabel, labelColumnWidth));
      }

      parts.push(bar);

      if (showValues) {
        const valueText = Formatter.pad(String(item.value), valueColumnWidth, "right");
        parts.push(valueText);
      }

      console.log(parts.join(" "));
    });
  }

  /**
   * Render sparkline
   */
  static sparkline(data: number[]): string {
    if (data.length === 0) return "";

    const chars = ["▁", "▂", "▃", "▄", "▅", "▆", "▇", "█"];
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;

    if (range === 0) return chars[0].repeat(data.length);

    return data.map((value) => {
      const normalized = (value - min) / range;
      const index = Math.floor(normalized * (chars.length - 1));
      return chars[index];
    }).join("");
  }

  /**
   * Render line chart (simple ASCII)
   */
  static lineChart(data: number[], options: ChartOptions = {}): void {
    const {
      width = data.length,
      height = 10,
      colorize = true,
    } = options;

    if (data.length === 0) {
      console.log("No data to display");
      return;
    }

    const requestedWidth = typeof width === "number" && width > 0 ? width : data.length;
    const resolvedWidth = this.resolveAvailableWidth(requestedWidth, 2);
    const widthToUse = Math.max(1, Math.min(resolvedWidth, requestedWidth, data.length));
    const series = data.length === widthToUse ? data : this.downsampleSeries(data, widthToUse);

    const max = Math.max(...series);
    const min = Math.min(...series);
    const range = max - min;

    // Create grid
    const grid: string[][] = Array(height).fill(null)
      .map(() => Array(widthToUse).fill(" "));

    // Plot points
    series.forEach((value, x) => {
      const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
      const y = Math.round((1 - normalizedValue) * (height - 1));

      grid[y][x] = "●";

      // Connect with lines
      if (x > 0) {
        const prevValue = series[x - 1];
        const prevNormalized = range === 0 ? 0.5 : (prevValue - min) / range;
        const prevY = Math.round((1 - prevNormalized) * (height - 1));

        const startY = Math.min(y, prevY);
        const endY = Math.max(y, prevY);

        for (let i = startY; i <= endY; i++) {
          if (grid[i][x] === " ") {
            grid[i][x] = "│";
          }
        }
      }
    });

    // Draw grid
    grid.forEach((row, i) => {
      const line = row.join("");
      if (colorize) {
        console.log(ColorSystem.colorize(line, ColorSystem.codes.cyan));
      } else {
        console.log(line);
      }
    });

    // Draw axis
    const axis = "└" + "─".repeat(widthToUse) + "┘";
    console.log(axis);
  }

  /**
   * Render pie chart (ASCII)
   */
  static pieChart(data: ChartData[], options: ChartOptions = {}): void {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    const slices = ["○", "◔", "◑", "◕", "●"];

    data.forEach((item) => {
      const percentage = (item.value / total) * 100;
      const sliceIndex = Math.floor((percentage / 100) * (slices.length - 1));
      const slice = slices[sliceIndex];

      console.log(
        `${slice} ${Formatter.pad(Formatter.truncate(item.label, 20), 20)} ${percentage.toFixed(1)}% (${item.value})`,
      );
    });
  }

  private static resolveAvailableWidth(width?: number, padding = 0): number {
    const consoleWidth = Math.max(10, this.getConsoleWidth() - padding);
    if (typeof width === "number" && width > 0) {
      return Math.max(1, Math.min(width, consoleWidth));
    }
    return consoleWidth;
  }

  private static getConsoleWidth(): number {
    try {
      if (
        typeof Deno !== "undefined" &&
        typeof Deno.consoleSize === "function"
      ) {
        const { columns } = Deno.consoleSize();
        if (columns > 0) {
          return Math.max(40, Math.min(columns - 2, 240));
        }
      }
    } catch {
      // Ignore console size errors and fall back to default width
    }

    return 100;
  }

  private static downsampleSeries(data: number[], targetLength: number): number[] {
    if (targetLength >= data.length) {
      return [...data];
    }

    const step = data.length / targetLength;
    return Array.from({ length: targetLength }, (_, i) => {
      const index = Math.min(data.length - 1, Math.floor(i * step));
      return data[index];
    });
  }
}
