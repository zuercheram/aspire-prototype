import styled from "@emotion/styled";
import { TableCell, Theme, useTheme } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import { Header, SortDirection, flexRender } from "@tanstack/react-table";
import { useScrollTableStore } from "./ScrollTableStoreContextProvider";

const ShowEllipsisIfTooWideWrapper = styled.span`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const WidthLimitingWrapper = styled.span`
  display: flex;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  display: inline;
`;

const sortIconWidth = 24;

export const withTransientProps = {
  shouldForwardProp: (propName: string) =>
    propName !== "theme" && !propName.startsWith("$"),
};

const SortIcon = styled(
  ArrowDownward,
  withTransientProps
)<{
  $sortDirection?: "asc" | "desc";
  theme: Theme;
}>(
  ({ theme, $sortDirection }) => `
  transition: opacity ${theme.transitions.duration.standard}ms, transform ${
    theme.transitions.duration.standard
  }ms ${theme.transitions.duration.standard}ms;
  opacity: ${$sortDirection != null ? 1 : 0};
  transform: ${$sortDirection === "desc" ? "rotate(180deg)" : "rotate(0deg)"}
`
);

const TableHeaderCell = styled(
  TableCell,
  withTransientProps
)<{
  $canBeSorted: boolean;
}>(
  ({ $canBeSorted }) => `
  cursor: ${$canBeSorted ? "pointer" : "default"}
`
);

export const ScrollHeaderCell = observer(
  <TData extends object>({
    header,
    sortDirection,
  }: {
    header: Header<TData, unknown>;
    sortDirection?: SortDirection;
  }) => {
    const widthMeasurementRef =
      useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

    const theme = useTheme();

    const store = useScrollTableStore();

    useEffect(() => {
      store.registerColumnWidth(
        header.id,
        widthMeasurementRef.current.getBoundingClientRect().width +
          Number.parseInt(theme.spacing(4), 10) +
          sortIconWidth +
          2 // add a bit more space so we don't get ellipses too early
      );
    });

    const columnDef = header.column.columnDef;

    return (
      <TableHeaderCell
        key={header.id}
        role="columnheader"
        style={{
          display: "flex",
          flexGrow: columnDef.growIfSpaceAvailable !== false ? 1 : 0,
          width:
            store.pixelWidthsByColumnIds[header.column.id] ?? columnDef.size,
          flexDirection:
            columnDef.contentConfig?.type === "number" ? "row-reverse" : "row",
          transition: "width 500ms",
          maxWidth: columnDef.maxSize,
        }}
        component="div"
        onClick={header.column.getToggleSortingHandler()}
        $canBeSorted={header.column.getCanSort()}
      >
        <WidthLimitingWrapper>
          <ShowEllipsisIfTooWideWrapper>
            <ContentWrapper ref={widthMeasurementRef}>
              {flexRender(header.column.columnDef.header, header.getContext())}
            </ContentWrapper>
          </ShowEllipsisIfTooWideWrapper>
        </WidthLimitingWrapper>
        <SortIcon $sortDirection={sortDirection} theme={theme} />
      </TableHeaderCell>
    );
  }
);
