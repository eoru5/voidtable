import { createContext, useContext } from "react";
import type { api } from "~/trpc/react";
import type { Column, Table, View } from "~/types/types";

type TableContextParams = {
  table: Table;
  views: View[];
  columns: Column[];
  createView: ReturnType<typeof api.view.create.useMutation>;
  deleteView: ReturnType<typeof api.view.delete.useMutation>;
  createColumn: ReturnType<typeof api.column.create.useMutation>;
  createRow: ReturnType<typeof api.row.create.useMutation>;
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
