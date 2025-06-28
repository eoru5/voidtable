"use client";

import { api } from "~/trpc/react";
import { TableContext } from "~/hooks/use-table";
import View from "../view/view";

export default function Table({
  tableId,
  viewId,
}: {
  tableId: string;
  viewId: string;
}) {
  const utils = api.useUtils();

  const [views] = api.table.getViews.useSuspenseQuery({ id: tableId });
  const [columns] = api.table.getColumns.useSuspenseQuery({ id: tableId });
  const [table] = api.table.get.useSuspenseQuery({ id: tableId });

  const createView = api.view.create.useMutation({
    onSuccess: async () => {
      await utils.table.getViews.invalidate();
    },
  });

  const deleteView = api.view.delete.useMutation({
    onSuccess: async () => {
      await utils.table.getViews.invalidate();
    },
  });

  const createColumn = api.column.create.useMutation({
    onSuccess: async () => {
      await utils.table.getColumns.invalidate();
    },
  });

  const createRow = api.row.create.useMutation({
    onSuccess: async () => {
      await utils.table.getCells.invalidate();
    },
  });

  const updateCell = api.cell.update.useMutation({
    onSuccess: async () => {
      await utils.table.getCells.invalidate();
    },
  });

  return (
    <TableContext
      value={{
        table,
        views,
        columns,
        createView,
        deleteView,
        createColumn,
        createRow,
        updateCell,
      }}
    >
      <View viewId={viewId} />
    </TableContext>
  );
}
