import { ColumnDef, Row, createColumnHelper } from "@tanstack/react-table";
import { ColumnDefinition } from "./ColumnDefinition";
import { getAlignmentByContentConfig } from "./ContentConfig";
import { getCellRenderer } from "./cell-renderers/getCellRenderer";

export const columnDefinitionToReactTableColumn = <TData extends object>(
  colDefs: ColumnDefinition<TData>[],
  locale?: string
): ColumnDef<TData, object>[] => {
  const columnHelper = createColumnHelper<TData>();
  return colDefs.map((colDef) => {
    const alignment =
      colDef.alignment != null
        ? colDef.alignment
        : getAlignmentByContentConfig(colDef.contentConfig);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return columnHelper.accessor(colDef.accessor as any, {
      header: colDef.header,
      id: colDef.id,
      contentConfig: colDef.contentConfig,
      maxSize: colDef.maxWidth,
      alignment,
      growIfSpaceAvailable: colDef.growIfSpaceAvailable,
      cell: getCellRenderer(colDef, locale),
      ...(colDef.customSortFn != null
        ? {
            sortingFn:
              colDef.customSortFn != null
                ? (rowA: Row<TData>, rowB: Row<TData>, columnId: string) => {
                    const valueA = rowA.getValue(columnId) as never;
                    const valueB = rowB.getValue(columnId) as never;
                    return colDef.customSortFn?.(valueA, valueB) ?? 0;
                  }
                : undefined,
          }
        : {}),
    });
  });
};
