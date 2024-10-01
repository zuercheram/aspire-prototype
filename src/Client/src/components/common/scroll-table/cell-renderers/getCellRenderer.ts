import { CellContext } from "@tanstack/react-table";
import { ColumnDefinition } from "../ColumnDefinition";
import { getNumberCellRenderer } from "./getNumberCellRenderer";
import { getLookupCellRenderer } from "./getLookupCellRenderer";

export const getCellRenderer = <TData extends object>(
  colDef: ColumnDefinition<TData>,
  locale?: string
): ((row: CellContext<TData, unknown>) => unknown) => {
  if (colDef.cell != null) {
    return (row) => colDef.cell?.(row.row.original);
  }
  if (colDef.contentConfig?.type === "number") {
    return getNumberCellRenderer(colDef);
  }
  if (colDef.contentConfig?.type === "lookup") {
    return getLookupCellRenderer(colDef);
  }
  if (colDef.contentConfig?.type === "date") {
    return (row) => {
      const date = row.getValue() as Date;
      return date?.toLocaleDateString(locale) ?? "";
    };
  }
  if (colDef.contentConfig?.type === "dateTime") {
    return (row) => {
      const date = row.getValue() as Date;
      return date?.toLocaleString(locale) ?? "";
    };
  }
  return (row: CellContext<TData, unknown>) => row.getValue();
};
