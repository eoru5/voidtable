"use client";

import { useState } from "react";
import { useTable } from "~/hooks/use-table";
import ViewToolbar from "../view/view-toolbar";
import { ViewContext } from "~/hooks/use-view";
import TableSidebar from "./table-sidebar";
import Grid from "../grid/grid";

export default function View({ viewId }: { viewId: string }) {
  const { views } = useTable();
  const view = views.find((v) => v.id === viewId)!;
  const [search, setSearch] = useState<string | null>(null); // null = not searching

  return (
    <ViewContext
      value={{
        view,
        search,
        setSearch,
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
