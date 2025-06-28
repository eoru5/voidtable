"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import { ArrowsUpDownIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import type { Column, Sort } from "~/types/types";
import ColumnIcon from "../icons/column-icon";
import SortOption from "./sort-option";
import Button from "../button";

const ActiveSortOptions = ({
  columns,
  sorts,
  update,
}: {
  columns: Column[];
  sorts: Sort[];
  update: (sorts: Sort[]) => void;
}) => {
  return (
    <MenuItem>
      <div onClick={(e) => e.preventDefault()}>
        <div className="flex flex-col gap-1">
          {columns
            .filter((c) => sorts.some((s) => s.columnId === c.id))
            .map((c) => (
              <SortOption
                key={c.id}
                selectedColumn={c}
                sorts={sorts}
                setSorts={update}
                columns={columns}
              />
            ))}
        </div>

        <Menu>
          <MenuButton>
            <div className="mt-1 flex cursor-pointer items-center gap-1 rounded-sm py-1 text-zinc-300 transition duration-200 hover:text-zinc-100">
              <PlusIcon className="size-5" />
              Add another sort
            </div>
          </MenuButton>

          <MenuItems
            anchor="bottom start"
            transition
            className="z-20 flex origin-top-right flex-col gap-1 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            {columns
              .filter((c) => !sorts.some((s) => s.columnId === c.id))
              .map((c) => (
                <MenuItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center justify-start gap-1 border-none p-1 hover:bg-zinc-700"
                    key={c.id}
                    onClick={() => {
                      // swap old val with new val
                      const newSorts: Sort[] = [
                        ...sorts,
                        { columnId: c.id, order: "asc" },
                      ];
                      update(newSorts);
                    }}
                  >
                    <ColumnIcon
                      columnType={c.type}
                      className="text-neutral-500"
                    />
                    {c.name}
                  </Button>
                </MenuItem>
              ))}
          </MenuItems>
        </Menu>
      </div>
    </MenuItem>
  );
};

const InitialSortOptions = ({
  columns,
  update,
}: {
  columns: Column[];
  update: (sorts: Sort[]) => void;
}) => {
  return (
    <MenuItem>
      <div
        className="flex flex-col gap-1 font-light"
        onClick={(e) => e.preventDefault()}
      >
        {columns.map((c) => (
          <div
            className="flex cursor-pointer items-center gap-1 rounded-sm px-2 py-1 transition duration-100 hover:bg-zinc-700"
            key={c.id}
            onClick={() => update([{ columnId: c.id, order: "asc" }])}
          >
            <ColumnIcon columnType={c.type} className="text-zinc-400" />
            {c.name}
          </div>
        ))}
      </div>
    </MenuItem>
  );
};

export default function ToolbarSort() {
  const { columns } = useTable();
  const { view, update } = useView();

  const sorts = view.sorts as Sort[];

  const updateSorts = (sorts: Sort[]) => {
    update.mutate({ id: view.id, sorts });
  };

  return (
    <Menu>
      <MenuButton>
        <div
          className={clsx(
            "flex cursor-pointer items-center gap-1 rounded-sm px-3 py-1 transition duration-200",
            view.sorts.length > 0 ? "bg-purple-600" : "hover:bg-zinc-700",
          )}
        >
          <ArrowsUpDownIcon className="size-4 stroke-2 text-white/50" />
          Sort
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className="z-20 mt-1 flex min-w-[300px] origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <div
            className="flex flex-col gap-2"
            onClick={(e) => e.preventDefault()}
          >
            <div className="px-1 py-0.5">Sort by</div>
            <hr className="h-px border-zinc-600" />
          </div>
        </MenuItem>

        {sorts.length > 0 ? (
          <ActiveSortOptions
            columns={columns}
            sorts={sorts}
            update={updateSorts}
          />
        ) : (
          <InitialSortOptions columns={columns} update={updateSorts} />
        )}
      </MenuItems>
    </Menu>
  );
}
