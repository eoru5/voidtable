"use client";

import ToolbarSearch from "./toolbar-search";
import ToolbarSort from "./toolbar-sort";
import ToolbarFilter from "./toolbar-filter";
import ToolbarHideColumns from "./toolbar-hide-columns";

export default function ViewToolbar() {
  return (
    <div className="flex items-center justify-between gap-4 border-b-1 border-zinc-600 bg-zinc-800 px-3 py-2 text-sm font-light">
      <div className="flex items-center gap-4">
        <ToolbarHideColumns />
        <ToolbarFilter />
        <ToolbarSort />
      </div>

      <ToolbarSearch />
    </div>
  );
}
