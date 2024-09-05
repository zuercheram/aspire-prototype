import { CellContext } from "@tanstack/react-table";
import { ColumnDefinition } from "../ColumnDefinition";
import { LookupContentConfig } from "../ContentConfig";

export const getLookupCellRenderer = <TData extends object>(
  colDef: ColumnDefinition<TData>
): ((row: CellContext<TData, unknown>) => unknown) => {
  const contentConfig = colDef.contentConfig as LookupContentConfig;
  const lookupKeys = Object.keys(contentConfig.inputOutputMap);
  return (row) => {
    const value = row.getValue();
    if (value != null && lookupKeys.includes(value as string)) {
      return contentConfig.inputOutputMap[value as string];
    }
    return value;
  };
};
