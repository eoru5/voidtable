"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  type CellContext,
  type HeaderContext,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import type { InfiniteRows, Order, Row, SearchResult } from "~/types/types";
import DataCell, { type variants } from "./data-cell";
import HeaderCell from "./header-cell";
import IndexCell from "./index-cell";
import type { CellType } from "@prisma/client";
import PortalIcon from "../icons/portal-icon";
import AddRowButton from "./add-row-button";
import AddColumnButton from "./add-column-button";
import Search from "./search";

export default function GridContent({
  initialData,
  fetchingData,
  fetchMoreOnBottomReached,
  nextCursor,
}: {
  initialData?: InfiniteRows;
  fetchingData: boolean;
  fetchMoreOnBottomReached: (
    containerRefElement?: HTMLDivElement | null,
  ) => void;
  nextCursor?: number;
}) {
  const { sorts, columns, setSorts, search, searchPos, searchResults } =
    useView();
  const {
    table: projectTable,
    updateCell,
    createRow,
    createColumn,
  } = useTable();
  const containerRef = useRef(null);

  const [data, setData] = useState<Row[]>([]);

  const columnTypes: Record<number, CellType> = useMemo(
    () => columns.reduce((acc, c) => ({ ...acc, [c.id]: c.type }), {}),
    [columns],
  );

  const getCellVariant = (
    value: string | null,
    rowId: number,
    columnId: number,
    search: string | null,
    searchResult?: SearchResult,
  ): keyof typeof variants => {
    if (
      searchPos !== null &&
      search &&
      searchResults.length > 0 &&
      value?.includes(search)
    ) {
      if (searchResult?.rId === rowId && searchResult?.cId === columnId) {
        return "selectedResult";
      }
      return "searchResult";
    }

    return "default";
  };

  const tableColumns = useMemo(() => {
    const indexColumn = {
      header: "",
      id: "id",
      enableSorting: false,
      cell: (props: CellContext<Row, string>) => (
        <IndexCell index={props.row.index + 1} rowId={props.row.original.id} />
      ),
    };

    const dataColumns = columns.map((c) => ({
      header: (props: HeaderContext<Row, string>) => (
        <HeaderCell props={props} column={c} />
      ),
      accessorKey: `c${c.id}`,
      enableMultiSort: true,
      id: c.id.toString(),
      cell: ({ column, getValue, row, table }: CellContext<Row, string>) => (
        <DataCell
          initialValue={getValue()}
          updateValue={async (value) => {
            const cell = await updateCell.mutateAsync({
              value,
              rowId: row.original.id,
              columnId: Number(column.id),
            });
            table.options.meta?.updateData(row.index, column.id, cell?.value);
          }}
          type={columnTypes[Number(column.id)] ?? "Text"}
          variant={getCellVariant(
            getValue(),
            row.original.id,
            Number(column.id),
            search,
            searchPos === null ? undefined : searchResults[searchPos],
          )}
        />
      ),
    }));

    return [indexColumn, ...dataColumns];
  }, [columns, columnTypes, search, searchResults, searchPos]);

  useEffect(() => {
    if (initialData?.pages) {
      setData(initialData.pages.flatMap((page) => page.rows));
    }
  }, [initialData]);

  const table = useReactTable({
    columns: tableColumns,
    data,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...row,
                [`c${columnId}`]: value,
              };
            } else {
              return row;
            }
          }),
        ),
    },
    isMultiSortEvent: () => true, // always multi sort instead of needing to press shift
    manualSorting: true,
    state: {
      sorting: sorts.map((sort) => ({
        id: sort.columnId.toString(),
        desc: sort.order === "desc",
      })),
    },
    onSortingChange: (sortingUpdater) => {
      const newSortingState =
        typeof sortingUpdater === "function"
          ? sortingUpdater(
              sorts.map((sort) => ({
                id: sort.columnId.toString(),
                desc: sort.order === "desc",
              })),
            )
          : sortingUpdater;
      setSorts(
        newSortingState.map((sort) => ({
          columnId: Number(sort.id),
          order: sort.desc ? "desc" : ("asc" as Order),
        })),
      );
    },
    enableMultiSort: true,
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 35,
    getScrollElement: () => containerRef?.current ?? null,
    measureElement:
      typeof window !== "undefined" && !navigator.userAgent.includes("Firefox")
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 10,
  });

  const scrollToRow = (matchFn: (row: Row) => boolean) => {
    if (!!table.getRowModel().rows.length) {
      const idx = data.findIndex((row) => matchFn(row));
      if (idx !== -1) {
        const virtualItems = rowVirtualizer.getVirtualItems();
        const firstVisible = virtualItems[0]?.index;
        const lastVisible = virtualItems[virtualItems.length - 1]?.index;

        if (idx < (firstVisible ?? -1) || idx > (lastVisible ?? -1)) {
          rowVirtualizer.scrollToIndex?.(idx, { align: "start" });
        }
      }
    }
  };

  useEffect(() => {
    fetchMoreOnBottomReached(containerRef.current);
  }, [fetchMoreOnBottomReached]);

  return (
    <div className="relative h-full w-full overflow-auto bg-zinc-900">
      <Search data={data} nextCursor={nextCursor} scrollToRow={scrollToRow} />
      <div
        className="relative h-full w-full overflow-auto"
        ref={containerRef}
        onScroll={(e) => fetchMoreOnBottomReached(e.currentTarget)}
      >
        <table className="grid">
          <thead className="sticky top-0 z-1 grid text-sm">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="flex w-full">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      width: header.getSize(),
                    }}
                    className="flex border-r-1 border-b-1 border-zinc-600 bg-zinc-800 text-left font-light"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
                <th className="flex">
                  <AddColumnButton
                    createColumn={(name, type) => {
                      createColumn.mutate({
                        tableId: projectTable.id,
                        name,
                        type,
                      });
                    }}
                  />
                </th>
              </tr>
            ))}
          </thead>
          <tbody
            className="relative grid"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]!;
              return (
                <tr
                  data-index={virtualRow.index}
                  ref={(node) => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  className="absolute flex w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                      }}
                      className="flex border-r-1 border-b-1 border-zinc-600 bg-zinc-800 text-sm font-light"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          <tfoot className="grid">
            <tr className="flex">
              <td className="flex border-r-1 border-b-1 border-zinc-600 bg-zinc-800 text-sm font-light">
                <AddRowButton
                  createRow={() =>
                    createRow.mutate({
                      tableId: projectTable.id,
                      amount: 1,
                      randomData: false,
                    })
                  }
                />
              </td>
              <td className="flex border-r-1 border-b-1 border-zinc-600 bg-zinc-800 text-sm font-light">
                <AddRowButton
                  createRow={() =>
                    createRow.mutate({
                      tableId: projectTable.id,
                      amount: 1,
                      randomData: true,
                    })
                  }
                >
                  (random data)
                </AddRowButton>
              </td>
              <td className="flex border-r-1 border-b-1 border-zinc-600 bg-zinc-800 text-sm font-light">
                <AddRowButton
                  createRow={() =>
                    createRow.mutate({
                      tableId: projectTable.id,
                      amount: 100000,
                      randomData: true,
                    })
                  }
                >
                  100k (random data)
                </AddRowButton>
              </td>
            </tr>

            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext(),
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
        {(fetchingData || createRow.isPending || createColumn.isPending) && (
          <div className="my-6 ml-6 flex items-center gap-2">
            <PortalIcon className="size-6" animate="always" />
            Loading data...
          </div>
        )}
      </div>
    </div>
  );
}
