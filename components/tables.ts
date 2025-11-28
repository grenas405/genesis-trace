// components/tables.ts
import { ColorSystem } from "../core/colors.ts";
import { Formatter } from "../core/formatter.ts";
import { Theme } from "../core/config.ts";

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
  showIndex?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  theme?: Theme;
  colorize?: boolean;
}

export class TableRenderer {
  /**
   * Render table
   */
  static render(
    data: Record<string, any>[],
    columns?: TableColumn[],
    options: TableOptions = {},
  ): void {
    if (data.length === 0) {
      console.log("No data to display");
      return;
    }

    const {
      maxWidth = 120,
      showIndex = false,
      sortBy,
      sortOrder = "asc",
      colorize = true,
    } = options;

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
    const formattedRows = this.formatRows(processedData, resolvedColumns);
    const columnWidths = this.calculateColumnWidths(
      resolvedColumns,
      formattedRows,
      maxWidth,
    );

    // Draw table
    this.drawTopBorder(columnWidths, colorize);
    this.drawHeaderRow(resolvedColumns, columnWidths, colorize);
    this.drawSeparator(columnWidths, colorize);

    formattedRows.forEach((rowValues, index) => {
      this.drawDataRow(
        rowValues,
        resolvedColumns,
        columnWidths,
        index,
        colorize,
      );
    });

    this.drawBottomBorder(columnWidths, colorize);
  }

  private static drawTopBorder(widths: number[], colorize: boolean): void {
    const line = widths.map((w) => "─".repeat(w)).join("─┬─");
    const border = `┌─${line}─┐`;
    console.log(
      colorize ? ColorSystem.colorize(border, ColorSystem.codes.dim) : border,
    );
  }

  private static drawBottomBorder(widths: number[], colorize: boolean): void {
    const line = widths.map((w) => "─".repeat(w)).join("─┴─");
    const border = `└─${line}─┘`;
    console.log(
      colorize ? ColorSystem.colorize(border, ColorSystem.codes.dim) : border,
    );
  }

  private static drawSeparator(widths: number[], colorize: boolean): void {
    const line = widths.map((w) => "─".repeat(w)).join("─┼─");
    const separator = `├─${line}─┤`;
    console.log(
      colorize ? ColorSystem.colorize(separator, ColorSystem.codes.dim) : separator,
    );
  }

  private static drawHeaderRow(
    columns: ResolvedColumn[],
    widths: number[],
    colorize: boolean,
  ): void {
    const cells = columns.map((column, i) =>
      Formatter.tableCell(column.label, widths[i], "center")
    );
    const row = cells.join(" │ ");
    const fullRow = `│ ${row} │`;
    console.log(
      colorize ? ColorSystem.colorize(fullRow, ColorSystem.codes.bright) : fullRow,
    );
  }

  private static drawDataRow(
    rowValues: string[],
    columns: ResolvedColumn[],
    widths: number[],
    index: number,
    colorize: boolean,
  ): void {
    const cells = rowValues.map((value, i) =>
      Formatter.tableCell(value, widths[i], columns[i].align)
    );

    const rowStr = cells.join(" │ ");
    const fullRow = `│ ${rowStr} │`;

    if (colorize && index % 2 === 1) {
      console.log(ColorSystem.colorize(fullRow, ColorSystem.codes.dim));
    } else {
      console.log(fullRow);
    }
  }

  /**
   * Simple key-value table
   */
  static renderKeyValue(
    data: Array<{ label: string; value: any }>,
    options: { colorize?: boolean } = {},
  ): void {
    const { colorize = true } = options;

    const labelWidth = Math.max(...data.map((d) => d.label.length));
    const valueWidth = Math.max(...data.map((d) => String(d.value).length));

    this.drawTopBorder([labelWidth, valueWidth], colorize);

    data.forEach((item, index) => {
      const label = Formatter.pad(item.label, labelWidth);
      const value = Formatter.pad(String(item.value), valueWidth);

      const labelColored = colorize ? ColorSystem.colorize(label, ColorSystem.codes.cyan) : label;
      const valueColored = colorize ? ColorSystem.colorize(value, ColorSystem.codes.bright) : value;

      console.log(`│ ${labelColored} │ ${valueColored} │`);
    });

    this.drawBottomBorder([labelWidth, valueWidth], colorize);
  }

  private static resolveColumns(
    data: Record<string, any>[],
    columns: TableColumn[] | undefined,
    showIndex: boolean,
  ): ResolvedColumn[] {
    if (!columns || columns.length === 0) {
      const keys = Object.keys(data[0]);
      return keys.map((key) => {
        const sampleValue = data[0]?.[key];
        const align: "left" | "center" | "right" =
          key === "#" || typeof sampleValue === "number" ? "right" : "left";
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
      align: column.align ?? "left",
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
  ): string[][] {
    return data.map((row, rowIndex) =>
      columns.map((column) => {
        const rawValue = row[column.key];
        if (column.formatter) {
          return column.formatter(rawValue, row, rowIndex);
        }
        return String(rawValue ?? "");
      })
    );
  }

  private static calculateColumnWidths(
    columns: ResolvedColumn[],
    rows: string[][],
    maxWidth: number,
  ): number[] {
    const columnCount = Math.max(columns.length, 1);
    const maxAutoWidth = Math.max(3, Math.floor(maxWidth / columnCount));

    return columns.map((column, columnIndex) => {
      if (column.width) return column.width;

      const labelWidth = ColorSystem.visibleLength(column.label);
      const valueWidths = rows.map((row) =>
        ColorSystem.visibleLength(row[columnIndex] ?? "")
      );
      const contentWidth = Math.max(labelWidth, ...valueWidths, 3);
      return Math.min(contentWidth, maxAutoWidth);
    });
  }
}
