"use client";

import { Button, Input } from "@headlessui/react";
import { api } from "~/trpc/react";
import { type SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { TableContext, useTable } from "~/hooks/use-table";
import ViewToolbar from "../view/view-toolbar";
import { ViewContext } from "~/hooks/use-view";

export default function View({ viewId }: { viewId: string }) {
  const utils = api.useUtils();

  const { views } = useTable();

  const view = views.find((v) => v.id === viewId)!;

  // null = not searching
  const [search, setSearch] = useState<string | null>(null);

  const update = api.view.update.useMutation({
    onSuccess: async () => {
      await utils.table.getViews.invalidate();
      await utils.table.getCells.invalidate();
    },
  });

  return (
    <ViewContext
      value={{
        view,
        update,
        search,
        setSearch,
      }}
    >
      <div className="flex h-full w-full flex-col overflow-auto">
        <ViewToolbar />
        {/*
        <div className="flex h-full w-full overflow-auto">
           <div className="flex h-full w-[300px] flex-col justify-between border-r-1 border-neutral-300 bg-white px-4 py-4 text-sm font-light">
            <div className="flex flex-col gap-1">
              {views.map((view) => (
                <ViewSidebarButton
                  key={view.id}
                  name={view.name}
                  viewId={view.id}
                  baseId={baseId}
                  selected={view.id === viewId}
                  link={`/${baseId}/${tableId}/${view.id}`}
                  canDelete={views.length > 1}
                />
              ))}
            </div>
            <div>
              <hr className="mb-3 h-0.5 border-neutral-300" />

              <div className="flex cursor-pointer items-center justify-between px-2 py-1">
                Create...
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <Button
                className="flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 transition duration-150 hover:bg-neutral-300"
                onClick={() =>
                  createView.mutate({
                    tableId,
                    name: `View ${views.length + 1}`,
                  })
                }
              >
                <div className="flex items-center gap-2">
                  <div className="text-blue-600"> <Grid /> </div>
                  Grid
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="size-4 text-neutral-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Button>
            </div>
          </div>
          <div className="h-full w-full">
           <Table
            tableId={tableId}
            viewId={viewId}
            fields={fields.filter((f) => !hiddenFields.includes(f.id))}
            createField={(name, type) =>
              createField.mutate({ tableId, name, type })
            }
            createRecord={(numRows, randomData) =>
              createRecord.mutate({ tableId, numRows, randomData })
            }
            sorting={sorting}
            setSorting={setSorting}
            searching={searching}
            setSearching={setSearching}
          /> 
          </div>
        </div>*/}
      </div>
    </ViewContext>
  );
}
