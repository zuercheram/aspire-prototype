import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  useReactTable,
  SortingState,
  getFilteredRowModel,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import { FixedSizeList } from "react-window";
import {
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import Search from "@mui/icons-material/Search";
import Clear from "@mui/icons-material/Clear";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ScrollTableCell } from "./ScrollTableCell";
import {
  ScrollTableStoreContextProvider,
  useScrollTableStore,
} from "./ScrollTableStoreContextProvider";
import { ScrollHeaderCell } from "./ScrollHeaderCell";
import { DebouncedTextField } from "./DebouncedTextField";
import { useFilters } from "./filters";
import { ColumnDefinition } from "./ColumnDefinition";
import { columnDefinitionToReactTableColumn } from "./columnDefinitionToReactTableColumn";

interface Props<TData extends object> {
  columnDefinitions: ColumnDefinition<TData>[];
  data: TData[];
  rowLink?: (row: TData) => string | undefined | null;
  initialSort?: { columnId: keyof TData & string; direction: "asc" | "desc" };
  title?: string;
  loading?: boolean;
}

const ScrollTableInternal = observer(
  <TData extends object>({
    columnDefinitions,
    data,
    rowLink,
    title,
    initialSort,
    loading,
  }: Props<TData>) => {
    const defaultColumn = useMemo(
      () => ({
        sortDescFirst: false,
      }),
      []
    );

    const { t, i18n } = useTranslation();
    const theme = useTheme();

    // if we get a large amount of data, initially rendering the list could
    // make the UI unresponsive for some time, even with row virtualization.
    // We can avoid/minimize this by starting with an empty list
    // and transitioning in the actual data after the first render
    // using an effect
    const [dataToUse, setDataToUse] = useState<TData[]>([]);
    const [isInitialRenderPending, startInitialRenderTransition] =
      useTransition();

    useEffect(() => {
      startInitialRenderTransition(() => {
        setDataToUse(data);
      });
    }, [data]);

    const columns = useMemo(
      () =>
        columnDefinitionToReactTableColumn(columnDefinitions, i18n.language),
      [columnDefinitions, i18n.language]
    );

    const [sorting, setSorting] = useState<SortingState>(
      initialSort
        ? [{ id: initialSort.columnId, desc: initialSort.direction === "desc" }]
        : []
    );
    const [globalFilter, setGlobalFilter] = useState<string>("");

    const globalFilterFn = useFilters<TData>(columnDefinitions, i18n.language);

    const tableInstance = useReactTable<TData>({
      columns,
      data: dataToUse,
      defaultColumn,
      state: {
        sorting,
        globalFilter,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      // react-table will disable filtering by default unless a string or number
      // value is present in first row. For filtering to work on all column types
      // including dates, we need to force filtering on.
      getColumnCanGlobalFilter: () => true,
      globalFilterFn,
      enableGlobalFilter: true,
    });

    const rows = tableInstance.getRowModel().rows;

    const RenderRow = React.useCallback(
      ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const row = rows[index];
        const resolvedRowLink = rowLink?.(row.original);
        return (
          <TableRow
            key={row.id}
            component={resolvedRowLink != null ? Link : Box}
            style={style}
            to={resolvedRowLink ?? ""}
            sx={
              resolvedRowLink != null
                ? {
                    display: "flex",
                    cursor: "pointer",
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: theme.palette.grey[100],
                    },
                  }
                : {
                    display: "flex",
                  }
            }
          >
            {row.getAllCells().map((cell) => (
              <ScrollTableCell key={cell.id} cell={cell} />
            ))}
          </TableRow>
        );
      },
      [rowLink, rows, theme.palette.grey]
    );

    // Handle table width
    const bodyWrapperRef = useRef<HTMLDivElement>();
    const [tableWidth, setTableWidth] = useState(0);

    const resizeRef = useRef<HTMLDivElement>(null);

    const updateSize = useCallback(() => {
      setTableWidth(bodyWrapperRef.current?.clientWidth ?? 0);
    }, []);

    // instead of observing window resizes, we observe size changes of a div containing the table
    // that way, we can also catch the internal layout of the page changing, such as a sidebar
    // opening or closing
    useEffect(() => {
      const resizeRefInternal = resizeRef.current;
      const resizeObserver = new ResizeObserver(updateSize);
      if (resizeRefInternal != null) {
        resizeObserver.observe(resizeRefInternal);
      }
      updateSize();

      return () => {
        if (resizeRefInternal != null) {
          resizeObserver.unobserve(resizeRefInternal);
        }
      };
    }, [updateSize]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const listRef = useRef<any>();

    const onScroll = useCallback(() => {
      const scrollTarget =
        window.scrollY - (bodyWrapperRef.current?.offsetTop ?? 0);
      listRef.current?.scrollTo(scrollTarget);
    }, []);

    // in order to fake an infinite scrolling effect, we measure the scroll of the window
    // and pass it to the virtualized list, which will then render the elements that should
    // be visible
    useEffect(() => {
      window.addEventListener("scroll", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll);
      };
    }, [onScroll]);

    // Get an instance of the store so we can use the total width of all columns in styling
    const store = useScrollTableStore();

    return (
      <Box pb={4} role="grid">
        <Box display="flex" alignItems={"center"} flexWrap={"wrap"}>
          <Typography variant="h5" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <DebouncedTextField
            label={t("UI.search")}
            variant="standard"
            margin="none"
            value={globalFilter}
            onChange={setGlobalFilter}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box sx={{ opacity: globalFilter !== "" ? 1 : 0 }}>
                    <IconButton
                      size="small"
                      onClick={() => setGlobalFilter("")}
                    >
                      <Clear />
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
          ></DebouncedTextField>
        </Box>
        <div ref={resizeRef}>
          <TableHead
            component="div"
            style={{
              position: "sticky",
              top: `${
                Number.parseInt(
                  (theme.mixins.toolbar.minHeight ?? 0).toString(),
                  10
                ) + 8
              }px`,
              backgroundColor: "white",
              zIndex: 10,
            }}
          >
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow
                component="div"
                key={headerGroup.id}
                style={{
                  display: "flex",
                  width: Math.max(tableWidth, store.totalWidth),
                }}
              >
                {headerGroup.headers.map((header) => (
                  <ScrollHeaderCell
                    header={header}
                    key={header.id}
                    sortDirection={
                      header.column.getIsSorted() === false
                        ? undefined
                        : (header.column.getIsSorted() as "asc" | "desc")
                    }
                  />
                ))}
              </TableRow>
            ))}
          </TableHead>
          <Box ref={bodyWrapperRef}>
            {isInitialRenderPending || loading ? (
              <Box
                p={4}
                width="100%"
                display="flex"
                alignItems={"center"}
                flexDirection={"column"}
              >
                <CircularProgress />
                <Typography
                  sx={{ padding: theme.spacing(2) }}
                  variant="caption"
                >
                  {t("UI.loading")}
                </Typography>
              </Box>
            ) : (
              <TableBody component="div">
                <FixedSizeList
                  height={Math.min(53.016 * rows.length, window.innerHeight)}
                  itemCount={rows.length}
                  itemSize={53}
                  width={Math.max(tableWidth, store.totalWidth)}
                  style={{ height: "100% !important" }}
                  ref={listRef}
                  overscanCount={3}
                >
                  {RenderRow}
                </FixedSizeList>
              </TableBody>
            )}
          </Box>
        </div>
      </Box>
    );
  }
);

export const ScrollTable = <TData extends object>(props: Props<TData>) => (
  <ScrollTableStoreContextProvider>
    <ScrollTableInternal {...props} />
  </ScrollTableStoreContextProvider>
);
