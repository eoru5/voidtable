import { createContext, useContext } from "react";
import type { api } from "~/trpc/react";
import type { Table } from "~/types/types";

type TableContextParams = {
  table: Table;
  createColumm: ReturnType<typeof api.column.create.useMutation>;
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
