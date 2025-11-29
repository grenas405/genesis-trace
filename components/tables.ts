// components/tables.ts
import { ColorSystem } from "../core/colors.ts";
import { Formatter } from "../core/formatter.ts";
import { Theme } from "../core/config.ts";
import { defaultTheme } from "../themes/default.ts";

type ColumnFormatter = (
  value: any,
  row?: Record<string, any>,
  rowIndex?: number,
) => string;

export interface TableColumn {
  key: string;
  label: string;
  width?: number;
  align?: "left" | "center" | "right";
  formatter?: ColumnFormatter;
  /** @deprecated Use `formatter` to avoid confusion with `format` helpers elsewhere */
  format?: ColumnFormatter;
}

interface ResolvedColumn {
  key: string;
  label: string;
  width?: number;
  align: "left" | "center" | "right";
  formatter?: ColumnFormatter;
}

export interface TableOptions {
  maxWidth?: number;
  minWidth?: number;
  showIndex?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  theme?: Theme;
  colorize?: boolean;
  padding?: number;
  wrapCells?: boolean;
  rowLimit?: number;
  rowSeparators?: boolean;
  zebraStripes?: boolean;
  uppercaseHeaders?: boolean;
  truncateIndicator?: string;
  emptyStateMessage?: string;
  fallbackValue?: string;
}

export interface TableRenderResult {
  lines: string[];
  metrics: {
    columnWidths: number[];
    rowCount: number;
    displayedRows: number;
    truncatedRows: number;
  };
}

interface ResolvedTableTheme {
  border: Theme["boxDrawing"];
  colors: {
    border?: string;
    headerText?: string;
    headerSeparator?: string;
    rowSeparator?: string;
    rowText?: string;
    zebra?: string;
    overflow?: string;
  };
}

export class TableRenderer {
  /**
   * Render table
   */
  static render(
    data: Record<string, any>[],
    columns?: TableColumn[],
    options: TableOptions = {},
  ): TableRenderResult {
    const result = this.toLines(data, columns, options);
    result.lines.forEach((line) => console.log(line));
    return result;
  }

  /**
   * Build table as string lines without writing to stdout.
   * Useful for testing or piping into other renderers.
   */
  static toLines(
    data: Record<string, any>[],
    columns?: TableColumn[],
    options: TableOptions = {},
  ): TableRenderResult {
    const {
      maxWidth,
      minWidth = 40,
      showIndex = false,
      sortBy,
      sortOrder = "asc",
      colorize = true,
      padding = 0,
      wrapCells = false,
      rowLimit,
      rowSeparators = false,
      zebraStripes = true,
      uppercaseHeaders = false,
      truncateIndicator = "…",
      emptyStateMessage = "No data to display",
      fallbackValue = "",
    } = options;

    if (!data || data.length === 0) {
      const message = colorize
        ? ColorSystem.colorize(emptyStateMessage, ColorSystem.codes.dim)
        : emptyStateMessage;
      return {
        lines: [message],
        metrics: {
          columnWidths: [],
          rowCount: 0,
          displayedRows: 0,
          truncatedRows: 0,
        },
      };
    }

    const resolvedTheme = this.resolveTheme(options.theme);
    const resolvedMaxWidth = this.resolveMaxWidth(maxWidth);
    const sanitizedPadding = Math.max(0, Math.floor(padding));

    // Process data
    let processedData = [...data];

    // Sort if needed
    if (sortBy) {
      processedData.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
        return sortOrder === "desc" ? -comparison : comparison;
      });
    }

    // Determine columns
    // Add index column if needed
    if (showIndex) {
      processedData = processedData.map((row, i) => ({ "#": i + 1, ...row }));
    }

    const resolvedColumns = this.resolveColumns(
      processedData,
      columns,
      showIndex,
    );
    const formattedRows = this.formatRows(
      processedData,
      resolvedColumns,
      fallbackValue,
    );
    const columnWidths = this.calculateColumnWidths(
      resolvedColumns,
      formattedRows,
      resolvedMaxWidth,
      minWidth,
      sanitizedPadding,
    );

    const lines: string[] = [];
    lines.push(
      this.drawBorder(
        columnWidths,
        resolvedTheme,
        "top",
        colorize,
      ),
    );

    lines.push(
      this.drawHeaderRow(
        resolvedColumns,
        columnWidths,
        colorize,
        resolvedTheme,
        sanitizedPadding,
        uppercaseHeaders,
      ),
    );

    lines.push(
      this.drawBorder(
        columnWidths,
        resolvedTheme,
        "header",
        colorize,
      ),
    );

    const rowsToRender = typeof rowLimit === "number"
      ? formattedRows.slice(0, Math.max(rowLimit, 0))
      : formattedRows;
    const truncatedRows = Math.max(0, formattedRows.length - rowsToRender.length);

    rowsToRender.forEach((rowValues, index) => {
      const rowLines = this.drawDataRow(
        rowValues,
        resolvedColumns,
        columnWidths,
        index,
        colorize,
        resolvedTheme,
        sanitizedPadding,
        wrapCells,
        zebraStripes,
      );
      lines.push(...rowLines);

      if (rowSeparators && index < rowsToRender.length - 1) {
        lines.push(
          this.drawBorder(
            columnWidths,
            resolvedTheme,
            "row",
            colorize,
          ),
        );
      }
    });

    if (truncatedRows > 0) {
      const message = `${truncateIndicator} ${truncatedRows} more row${truncatedRows === 1 ? "" : "s"} ${truncateIndicator}`;
      const overflowRow = this.buildOverflowRow(
        message,
        columnWidths,
        colorize,
        resolvedTheme,
      );
      lines.push(...overflowRow);
    }

    lines.push(
      this.drawBorder(
        columnWidths,
        resolvedTheme,
        "bottom",
        colorize,
      ),
    );

    return {
      lines,
      metrics: {
        columnWidths,
        rowCount: processedData.length,
        displayedRows: rowsToRender.length,
        truncatedRows,
      },
    };
  }

  private static drawHeaderRow(
    columns: ResolvedColumn[],
    widths: number[],
    colorize: boolean,
    theme: ResolvedTableTheme,
    padding: number,
    uppercaseHeaders: boolean,
  ): string {
    const cells = columns.map((column, i) => {
      const label = uppercaseHeaders ? column.label.toUpperCase() : column.label;
      const innerWidth = Math.max(1, widths[i] - padding * 2);
      const cell = Formatter.tableCell(label, innerWidth, "center");
      return `${" ".repeat(padding)}${cell}${" ".repeat(padding)}`;
    });
    const row = cells.join(` ${theme.border.vertical} `);
    const fullRow = `${theme.border.vertical} ${row} ${theme.border.vertical}`;
    return this.applyColor(fullRow, theme.colors.headerText, colorize);
  }

  private static drawDataRow(
    rowValues: string[],
    columns: ResolvedColumn[],
    widths: number[],
    index: number,
    colorize: boolean,
    theme: ResolvedTableTheme,
    padding: number,
    wrapCells: boolean,
    zebraStripes: boolean,
  ): string[] {
    const cellLines: string[][] = rowValues.map((value, i) => {
      const innerWidth = Math.max(1, widths[i] - padding * 2);
      if (!wrapCells) {
        const cell = Formatter.tableCell(value, innerWidth, columns[i].align);
        return [`${" ".repeat(padding)}${cell}${" ".repeat(padding)}`];
      }

      const wrapped = Formatter.wrap(value, innerWidth);
      if (wrapped.length === 0) wrapped.push("");
      return wrapped.map((segment) => {
        const cell = Formatter.tableCell(segment, innerWidth, columns[i].align);
        return `${" ".repeat(padding)}${cell}${" ".repeat(padding)}`;
      });
    });

    const maxLines = Math.max(...cellLines.map((lines) => lines.length));
    const rowLines: string[] = [];

    for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
      const rowSegment = cellLines.map((lines) => lines[lineIndex] ?? lines[lines.length - 1] ?? "");
      const rowStr = rowSegment.join(` ${theme.border.vertical} `);
      const fullRow = `${theme.border.vertical} ${rowStr} ${theme.border.vertical}`;
      const zebraColor = zebraStripes && index % 2 === 1 ? theme.colors.zebra : theme.colors.rowText;
      rowLines.push(this.applyColor(fullRow, zebraColor, colorize));
    }

    return rowLines;
  }

  /**
   * Simple key-value table
   */
  static renderKeyValue(
    data: Array<{ label: string; value: any }>,
    options: { colorize?: boolean; theme?: Theme; padding?: number } = {},
  ): void {
    if (!data || data.length === 0) return;

    const { colorize = true, theme, padding = 1 } = options;
    const resolvedTheme = this.resolveTheme(theme);
    const safePadding = Math.max(0, Math.floor(padding));
    const labelWidth = Math.max(...data.map((d) => ColorSystem.visibleLength(d.label)));
    const valueWidth = Math.max(...data.map((d) => ColorSystem.visibleLength(String(d.value))));
    const widths = [labelWidth + safePadding * 2, valueWidth + safePadding * 2];

    const lines = [
      this.drawBorder(widths, resolvedTheme, "top", colorize),
      ...data.map((item) => {
        const labelCell = Formatter.tableCell(item.label, Math.max(1, labelWidth), "left");
        const valueCell = Formatter.tableCell(String(item.value), Math.max(1, valueWidth), "left");
        const labelContent = `${" ".repeat(safePadding)}${labelCell}${" ".repeat(safePadding)}`;
        const valueContent = `${" ".repeat(safePadding)}${valueCell}${" ".repeat(safePadding)}`;
        const row = `${resolvedTheme.border.vertical} ${labelContent} ${resolvedTheme.border.vertical} ${valueContent} ${resolvedTheme.border.vertical}`;
        return this.applyColor(row, resolvedTheme.colors.rowText, colorize);
      }),
      this.drawBorder(widths, resolvedTheme, "bottom", colorize),
    ];

    lines.forEach((line) => console.log(line));
  }

  private static resolveColumns(
    data: Record<string, any>[],
    columns: TableColumn[] | undefined,
    showIndex: boolean,
  ): ResolvedColumn[] {
    if (!columns || columns.length === 0) {
      const keys = Object.keys(data[0]);
      return keys.map((key) => {
        const align = this.isNumericColumn(data, key) ? "right" : "left";
        return {
          key,
          label: key,
          align,
        };
      });
    }

    const hasExplicitIndex = columns.some((column) => column.key === "#");
    const mapped = columns.map<ResolvedColumn>((column) => ({
      key: column.key,
      label: column.label ?? column.key,
      width: column.width,
      align: column.align ?? (this.isNumericColumn(data, column.key) ? "right" : "left"),
      formatter: column.formatter ?? column.format,
    }));

    if (showIndex && !hasExplicitIndex) {
      return [{ key: "#", label: "#", align: "right" }, ...mapped];
    }

    return mapped;
  }

  private static formatRows(
    data: Record<string, any>[],
    columns: ResolvedColumn[],
    fallbackValue: string,
  ): string[][] {
    return data.map((row, rowIndex) =>
      columns.map((column) => {
        const rawValue = row[column.key];
        const safeValue = rawValue ?? fallbackValue;
        if (column.formatter) {
          return column.formatter(safeValue, row, rowIndex);
        }
        return String(safeValue);
      })
    );
  }

  private static calculateColumnWidths(
    columns: ResolvedColumn[],
    rows: string[][],
    maxWidth: number,
    minWidth: number,
    padding: number,
  ): number[] {
    const columnCount = Math.max(columns.length, 1);
    const safeMinWidth = Math.max(3, minWidth);
    const maxAutoWidth = Math.max(
      safeMinWidth,
      Math.floor(maxWidth / columnCount),
    );

    return columns.map((column, columnIndex) => {
      if (column.width) {
        return Math.max(column.width, padding * 2 + 1);
      }

      const labelWidth = ColorSystem.visibleLength(column.label);
      const valueWidths = rows.map((row) =>
        ColorSystem.visibleLength(row[columnIndex] ?? "")
      );
      const contentWidth = Math.max(labelWidth, ...valueWidths, 3);
      const paddedWidth = contentWidth + padding * 2;
      return Math.min(Math.max(paddedWidth, safeMinWidth), maxAutoWidth);
    });
  }

  private static resolveTheme(theme?: Theme): ResolvedTableTheme {
    const appliedTheme = theme ?? defaultTheme;
    return {
      border: appliedTheme.boxDrawing,
      colors: {
        border: appliedTheme.colors.muted,
        headerText: appliedTheme.colors.primary,
        headerSeparator: appliedTheme.colors.secondary,
        rowSeparator: appliedTheme.colors.muted,
        rowText: appliedTheme.colors.secondary,
        zebra: ColorSystem.codes.dim,
        overflow: appliedTheme.colors.accent,
      },
    };
  }

  private static drawBorder(
    widths: number[],
    theme: ResolvedTableTheme,
    type: "top" | "header" | "row" | "bottom",
    colorize: boolean,
  ): string {
    const { border } = theme;

    const left = (() => {
      switch (type) {
        case "top":
          return border.topLeft;
        case "bottom":
          return border.bottomLeft;
        default:
          return border.teeLeft;
      }
    })();

    const right = (() => {
      switch (type) {
        case "top":
          return border.topRight;
        case "bottom":
          return border.bottomRight;
        default:
          return border.teeRight;
      }
    })();

    const join = (() => {
      switch (type) {
        case "top":
          return border.teeTop;
        case "bottom":
          return border.teeBottom;
        default:
          return border.cross;
      }
    })();

    const line = widths
      .map((w) => border.horizontal.repeat(w))
      .join(`${border.horizontal}${join}${border.horizontal}`);

    const composed = `${left}${border.horizontal}${line}${border.horizontal}${right}`;
    const color =
      type === "header"
        ? theme.colors.headerSeparator
        : type === "row"
          ? theme.colors.rowSeparator ?? theme.colors.border
          : theme.colors.border;

    return this.applyColor(composed, color, colorize);
  }

  private static buildOverflowRow(
    message: string,
    widths: number[],
    colorize: boolean,
    theme: ResolvedTableTheme,
  ): string[] {
    const fullWidth = widths.reduce((sum, width) => sum + width, 0) + (widths.length - 1) * 3 + 4;
    const innerWidth = fullWidth - 4;
    const truncated = Formatter.truncate(message, innerWidth);
    const padded = Formatter.pad(truncated, innerWidth, "center");
    const row = `${theme.border.vertical} ${padded} ${theme.border.vertical}`;
    return [this.applyColor(row, theme.colors.overflow, colorize)];
  }

  private static applyColor(
    text: string,
    color: string | undefined,
    colorize: boolean,
  ): string {
    if (!colorize || !color) return text;
    return `${color}${text}${ColorSystem.codes.reset}`;
  }

  private static resolveMaxWidth(maxWidth?: number): number {
    if (typeof maxWidth === "number" && maxWidth > 0) {
      return maxWidth;
    }

    try {
      if (
        typeof Deno !== "undefined" &&
        typeof Deno.consoleSize === "function"
      ) {
        const { columns } = Deno.consoleSize();
        if (columns > 0) {
          return Math.max(40, Math.min(columns - 4, 240));
        }
      }
    } catch {
      // Ignore console size errors and fall back to default width
    }

    return 120;
  }

  private static isNumericColumn(
    data: Record<string, any>[],
    key: string,
  ): boolean {
    return data.every((row) => {
      const value = row[key];
      return (
        typeof value === "number" ||
        value === undefined ||
        value === null ||
        value === ""
      );
    });
  }
}
