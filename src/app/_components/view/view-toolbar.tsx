"use client";

import type { SortingState } from "@tanstack/react-table";
import ViewNavbarFilter from "./view-navbar-filter";
import ViewNavbarHideFields from "./view-navbar-hide-fields";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import ToolbarSearch from "./toolbar-search";
import ToolbarSort from "./toolbar-sort";
import type { Sort } from "~/types/types";

export default function ViewToolbar() {
  const { columns } = useTable();
  const { view, search, setSearch } = useView();

  return (
    <div className="flex items-center justify-between gap-2 border-b-1 border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-light">
      <div className="flex items-center gap-2">
        {/* <ViewNavbarHideFields />
        <ViewNavbarFilter /> */}
        <ToolbarSort />
      </div>

      <ToolbarSearch />
    </div>
  );
}
