import styled from "@emotion/styled";
import { TableCell, useTheme } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { Cell, flexRender } from "@tanstack/react-table";
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

export const ScrollTableCell = observer(
  <TData extends object>({ cell }: { cell: Cell<TData, unknown> }) => {
    const widthMeasurementRef =
      useRef<HTMLDivElement>() as React.MutableRefObject<HTMLDivElement>;

    const theme = useTheme();
    const store = useScrollTableStore();

    const colDef = cell.column.columnDef;

    useEffect(() => {
      store.registerColumnWidth(
        cell.column.id,
        widthMeasurementRef.current.getBoundingClientRect().width +
          Number.parseInt(theme.spacing(4), 10)
      );
    });

    return (
      <TableCell
        key={cell.id}
        role="gridcell"
        style={{
          display: "flex",
          flexGrow: colDef.growIfSpaceAvailable !== false ? 1 : 0,
          flexDirection: colDef.alignment === "right" ? "row-reverse" : "row",
          width: store.pixelWidthsByColumnIds[cell.column.id] ?? colDef.size,
          maxWidth: colDef.maxSize,
          transition: cell.row.index > 10 ? "width 500ms" : undefined,
        }}
        component="div"
      >
        <WidthLimitingWrapper>
          <ShowEllipsisIfTooWideWrapper>
            <ContentWrapper ref={widthMeasurementRef}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </ContentWrapper>
          </ShowEllipsisIfTooWideWrapper>
        </WidthLimitingWrapper>
      </TableCell>
    );
  }
);
