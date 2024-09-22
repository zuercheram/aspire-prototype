import "@tanstack/react-table";
import { ContentConfig } from "./components/common/scroll-table/ContentConfig";

declare module "@tanstack/react-table" {
  export interface ColumnDefBase<TData extends RowData, TValue = unknown>
    extends ColumnDefExtensions<TData, TValue> {
    contentConfig?: ContentConfig;
    growIfSpaceAvailable?: boolean;
    alignment?: "right" | "left";
  }
}
