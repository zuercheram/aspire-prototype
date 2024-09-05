import { Box, Chip } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ColumnDefinition } from "./common/scroll-table/ColumnDefinition";
import { ScrollTable } from "./common/scroll-table/ScrollTable";

interface DemoData {
  id: number;
  category: string;
  glass: string | null;
  number: number | null;
  lookup: string | null;
  date: Date | null;
}

const data: DemoData[] = Array.from({ length: 100000 }).map((_, i) => ({
  id: i,
  category: `Category-${i}`,
  glass: `glass-${
    i === 200 ? "aldskjaölsjfölsajföldsajföldsajfölkdjfölkdsajfölkdsajf" : i
  }`,
  number: i % 5 !== 0 ? i * 200.1452 : null,
  date: new Date(Date.now() + 1000 * 60 * 60 * 5 * i),
  lookup: (Math.floor(Math.random() * 2.999) + 1).toString(),
}));

export const ScrollTableDemo = () => {
  const { t } = useTranslation("testEntity");

  const colDefs: ColumnDefinition<DemoData>[] = useMemo(
    () => [
      {
        accessor: (_, index) => index,
        id: "customSorting",
        header: "sort: evens before odds",
        customSortFn: (a: number | undefined, b: number | undefined) => {
          if (a == null && b != null) {
            return 1;
          }
          if (b == null && a != null) {
            return -1;
          }
          if (b == null && a == null) {
            return 0;
          }
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return (a! % 2) - (b! % 2);
        },
      },
      {
        accessor: "category",
        id: "category",
        header: "Custom cell content",
        cell: (row) => (
          <Chip
            sx={{ height: "17px" }}
            color={row.id % 3 === 0 ? "primary" : "default"}
            label={row.category}
          />
        ),
      },
      {
        accessor: "date",
        id: "date1",
        header: "Date",
        contentConfig: {
          type: "date",
        },
      },
      {
        accessor: "date",
        id: "date2",
        header: "Datetime",
        contentConfig: {
          type: "dateTime",
        },
      },
      {
        accessor: "glass",
        id: "glass",
        header: "variable width (id 200)",
      },
      {
        accessor: (_, index) => `${index} filtered by "startswith"`,
        id: "drinkId-customFilter",
        header: "Custom Filter",
        customFilterFn: (row, columnId, filterValue) => {
          const rowValue = row.getValue(columnId) as string;
          return rowValue.startsWith(filterValue);
        },
        maxWidth: 190,
      },
      {
        accessor: "lookup",
        id: "lookup",
        header: "Lookup",
        contentConfig: {
          type: "lookup",
          inputOutputMap: {
            "1": t("lookup.1"),
            "2": t("lookup.2"),
            "3": t("lookup.3"),
          },
        },
      },
      {
        accessor: "number",
        id: "number",
        header: "Number",
        contentConfig: {
          type: "number",
          decimals: 2,
        },
        growIfSpaceAvailable: false,
      },
    ],
    [t]
  );

  return (
    <>
      <Box>
        On this page, you can explore the capabilities of{" "}
        <code>ScrollTable</code>, the basic table component built into the
        template. The headline features of <code>ScrollTable</code> are:
        <ul>
          <li>Fully client-side filtering and sorting - </li>
          <li>
            Virtualization - <code>ScrollTable</code> remains performant even
            with very high row counts (100k in this demo)
          </li>
          <li>
            Automatic column sizing - columns can be configured in maximum size,
            and whether they should grow or not. In addition to that, columns
            determine their own width and expand as needed to fit their content,
            if allowed by their max width. Since we only render visible rows,
            this means that the column widths can change as you scroll. Check
            out the variable width on row id 200 for an example
          </li>
          <li>
            Different column types, including strings, numbers, dates,
            dateTimes, and lookups
          </li>
          <li>
            Optional links on rows - use this to navigate to individual datasets
          </li>
          <li>
            Custom cell contents and easy extension - if none of the built-in
            column types fit your need, just render a custom component, or
            create your own column type!
          </li>
        </ul>
        A few notes about the demo:
        <ul>
          <li>
            Rows with an even ID have a rowLink defined - they behave as links,
            not js redirects. This means you can also middle-click or ctrl+click
            to open in a new tab. rows with an odd ID have no rowLink defined
            and therefore do not react to hover or clicks
          </li>
          <li>
            The Custom Cell Content column showcases rendering a react component
            based on the row contents{" "}
          </li>
        </ul>
      </Box>
      <ScrollTable
        title="Scroll Table Demo"
        columnDefinitions={colDefs}
        data={data ?? []}
        initialSort={{ columnId: "number", direction: "asc" }}
        rowLink={(row) => (row.id % 2 === 0 ? "/" : undefined)}
      />
    </>
  );
};
