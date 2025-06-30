import { createContext, useContext } from "react";
import type { api } from "~/trpc/react";
import type { Column, Table, View } from "~/types/types";

type TableContextParams = {
  table: Table;
  views: View[];
  allColumns: Column[];
  createView: ReturnType<typeof api.view.create.useMutation>;
  deleteView: ReturnType<typeof api.view.delete.useMutation>;
  updateView: ReturnType<typeof api.view.update.useMutation>;
  createColumn: ReturnType<typeof api.column.create.useMutation>;
  deleteColumn: ReturnType<typeof api.column.delete.useMutation>;
  renameColumn: ReturnType<typeof api.column.rename.useMutation>;
  createRow: ReturnType<typeof api.row.create.useMutation>;
  deleteRow: ReturnType<typeof api.row.delete.useMutation>;
  updateCell: ReturnType<typeof api.cell.update.useMutation>;
};

export const TableContext = createContext<TableContextParams | null>(null);

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableContext");
  }
  return context;
};
