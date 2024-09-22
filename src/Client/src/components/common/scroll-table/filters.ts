import { FilterFn, filterFns } from "@tanstack/react-table";
import { useState, useEffect, useCallback } from "react";
import { LookupContentConfig, NumberContentConfig } from "./ContentConfig";
import { ColumnDefinition } from "./ColumnDefinition";

export const getNumberFilterFn: <TData extends object>(
  colDef: ColumnDefinition<TData>
) => FilterFn<TData> = (colDef) => (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId);
  if (typeof rowValue === "number") {
    return rowValue
      .toFixed((colDef.contentConfig as NumberContentConfig).decimals)
      .includes(filterValue);
  }
  return false;
};

export const getLookupFilterFn: <TData extends object>(
  coldef: ColumnDefinition<TData>
) => FilterFn<TData> = (colDef) => (row, columnId, filterValue) => {
  const contentConfig = colDef.contentConfig as LookupContentConfig;
  const lookupValue =
    contentConfig.inputOutputMap[row.getValue(columnId) as string];
  return lookupValue.toLowerCase().includes(filterValue.toLowerCase());
};

export const getDateFilterFn: <TData extends object>(
  coldef: ColumnDefinition<TData>,
  locale?: string
) => FilterFn<TData> = (_, locale) => (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId) as Date;
  const rowValueAsString = rowValue.toLocaleDateString(locale);
  return rowValueAsString.toLowerCase().includes(filterValue.toLowerCase());
};

export const getDateTimeFilterFn: <TData extends object>(
  coldef: ColumnDefinition<TData>,
  locale?: string
) => FilterFn<TData> = (_, locale) => (row, columnId, filterValue) => {
  const rowValue = row.getValue(columnId) as Date;
  const rowValueAsString = rowValue.toLocaleString(locale);
  return rowValueAsString.toLowerCase().includes(filterValue.toLowerCase());
};

export const useFilters = <TData extends object>(
  columnDefinitions: ColumnDefinition<TData>[],
  locale?: string
): FilterFn<TData> => {
  const [columnFilterDict, setColumnFilterDict] = useState<
    Record<string, FilterFn<TData>>
  >({});

  useEffect(() => {
    const newColumnFilterDict: Record<string, FilterFn<TData>> = {};
    columnDefinitions.forEach((colDef) => {
      if (
        colDef.contentConfig?.type === "number" &&
        colDef.contentConfig.decimals != null
      ) {
        newColumnFilterDict[colDef.id] = getNumberFilterFn(colDef);
      }
      if (colDef.contentConfig?.type === "lookup") {
        newColumnFilterDict[colDef.id] = getLookupFilterFn(colDef);
      }
      if (colDef.contentConfig?.type === "date") {
        newColumnFilterDict[colDef.id] = getDateFilterFn(colDef, locale);
      }
      if (colDef.contentConfig?.type === "dateTime") {
        newColumnFilterDict[colDef.id] = getDateTimeFilterFn(colDef, locale);
      }
      if (colDef.customFilterFn != null) {
        newColumnFilterDict[colDef.id] = colDef.customFilterFn;
      }
      setColumnFilterDict(newColumnFilterDict);
    });
  }, [columnDefinitions, locale]);

  const globalFilterFn = useCallback<FilterFn<TData>>(
    (row, columnId, filterValue, addMeta) => {
      const trimmedFilterValue = (filterValue as string).trim();
      const customFilter = columnFilterDict[columnId];
      if (customFilter != null) {
        return customFilter(row, columnId, trimmedFilterValue, addMeta);
      }
      return filterFns.includesString(
        row,
        columnId,
        trimmedFilterValue,
        addMeta
      );
    },
    [columnFilterDict]
  );

  return globalFilterFn;
};
