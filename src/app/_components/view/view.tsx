"use client";

import { useEffect, useState } from "react";
import { useTable } from "~/hooks/use-table";
import ViewToolbar from "../view/view-toolbar";
import { ViewContext } from "~/hooks/use-view";
import TableSidebar from "../table/table-sidebar";
import Grid from "../grid/grid";
import type { Filter, SearchResult, Sort } from "~/types/types";

export default function View({ viewId }: { viewId: string }) {
  const { views, updateView, allColumns } = useTable();
  const view = views.find((v) => v.id === viewId)!;

  const [sorts, setSorts] = useState<Sort[]>([]);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [hiddenColumns, setHiddenColumns] = useState<number[]>([]);
  const [search, setSearch] = useState<string | null>(null); // null = not searching
  const [searchPos, setSearchPos] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const refreshView = () => {
    setSorts(view.sorts as Sort[]);
    setFilters(view.filters as Filter[]);
    setHiddenColumns(view.hiddenColumns);
  };

  useEffect(() => refreshView(), [viewId]);

  useEffect(() => {
    updateView.mutate({ id: viewId, filters });
  }, [filters]);

  useEffect(() => {
    updateView.mutate({ id: viewId, sorts });
  }, [sorts]);

  useEffect(() => {
    updateView.mutate({ id: viewId, hiddenColumns });
  }, [hiddenColumns]);

  return (
    <ViewContext
      value={{
        view,
        columns: allColumns.filter((c) => !hiddenColumns.includes(c.id)),
        sorts,
        setSorts,
        filters,
        setFilters,
        hiddenColumns,
        setHiddenColumns,
        search,
        setSearch,
        searchPos,
        setSearchPos,
        searchResults,
        setSearchResults,
      }}
    >
      <div className="flex h-full w-full flex-col overflow-auto">
        <ViewToolbar />

        <div className="flex h-full w-full overflow-auto">
          <TableSidebar />

          <div className="h-full w-full">
            <Grid />
          </div>
        </div>
      </div>
    </ViewContext>
  );
}
