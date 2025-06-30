"use client";

import { useTable } from "~/hooks/use-table";
import { useProject } from "~/hooks/use-project";
import ViewItem from "./view-item";
import { useView } from "~/hooks/use-view";
import { TableCellsIcon } from "@heroicons/react/24/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "../button";

export default function TableSidebar() {
  const { project } = useProject();
  const { table, views, createView } = useTable();
  const { view } = useView();

  return (
    <div className="flex h-full w-full max-w-2xs flex-col justify-between border-r-1 border-zinc-600 bg-zinc-800 p-2 text-sm font-light">
      <div className="flex flex-col gap-2 overflow-scroll">
        {views.map((v) => (
          <ViewItem
            key={v.id}
            view={v}
            selected={v.id === view.id}
            link={`/${project.id}/${table.id}/${v.id}`}
            canDelete={views.length > 1}
          />
        ))}
      </div>

      <div>
        <hr className="mb-3 h-0.5 border-zinc-600" />

        <Button
          variant="outline"
          size="sm"
          className="flex w-full items-center justify-between px-3 py-2"
          onClick={() =>
            createView.mutate({
              tableId: table.id,
              name: `View ${views.length + 1}`,
            })
          }
        >
          <div className="flex items-center gap-2">
            <TableCellsIcon className="size-5 text-purple-400" />
            View
          </div>
          <PlusIcon className="size-4 stroke-2 text-zinc-600" />
        </Button>
      </div>
    </div>
  );
}
