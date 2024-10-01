import { Row } from "@tanstack/react-table";
import { ContentConfig } from "./ContentConfig";

export type ColumnAccessor<TData extends object> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ((row: TData, index: number) => any) | keyof TData;

export interface ColumnDefinition<TData extends object> {
  id: string;
  accessor: ColumnAccessor<TData>;
  header: string;
  contentConfig?: ContentConfig;
  maxWidth?: number;
  growIfSpaceAvailable?: boolean;
  alignment?: "right" | "left";
  cell?: (row: TData) => React.ReactElement;
  customFilterFn?: (
    row: Row<TData>,
    columnId: string,
    filterValue: string
  ) => boolean;
  customSortFn?: (a: never | undefined, b: never | undefined) => number;
}
