import { CellContext } from "@tanstack/react-table";
import { ColumnDefinition } from "../ColumnDefinition";
import { NumberContentConfig } from "../ContentConfig";

export const getNumberCellRenderer = <TData extends object>(
  colDef: ColumnDefinition<TData>
): ((row: CellContext<TData, unknown>) => unknown) => {
  const contentConfig = colDef.contentConfig as NumberContentConfig;

  if (contentConfig.decimals != null) {
    return (row) => {
      const value = row.getValue();
      const numberConfig = contentConfig as NumberContentConfig;
      if (typeof value === "number") {
        return value.toFixed(numberConfig.decimals);
      }
      return value;
    };
  }
  return (row) => row.getValue();
};
