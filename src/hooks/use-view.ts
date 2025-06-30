import { createContext, useContext } from "react";
import type { Column, Filter, SearchResult, Sort, View } from "~/types/types";

type ViewContextParams = {
  view: View;
  columns: Column[];
  sorts: Sort[];
  setSorts: (sorts: Sort[]) => void;
  filters: Filter[];
  setFilters: (filters: Filter[]) => void;
  hiddenColumns: number[];
  setHiddenColumns: (hiddenColumns: number[]) => void;
  search: string | null;
  setSearch: (search: string | null) => void;
  searchPos: number | null;
  setSearchPos: (searchPos: number | null) => void;
  searchResults: SearchResult[];
  setSearchResults: (searchResults: SearchResult[]) => void;
};

export const ViewContext = createContext<ViewContextParams | null>(null);

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewContext");
  }
  return context;
};
