"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import type { Column, Filter } from "~/types/types";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import clsx from "clsx";
import {
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import FilterOption from "./filter-option";
import Button from "../button";

export const getDefaultFilter = (column: Column) => {
  switch (column.type) {
    case "Number":
      return "<";
    case "Text":
      return "contains";
  }
};

export default function ToolbarFilter() {
  const { columns, updateView } = useTable();
  const { view } = useView();

  const filters = view.filters as Filter[];

  const updateFilters = (filters: Filter[]) => {
    updateView.mutate({ id: view.id, filters });
  };

  const addFilter = () => {
    if (columns.length === 0) return;

    const column = columns[0];
    if (column) {
      const filter: Filter = {
        columnId: column.id,
        type: getDefaultFilter(column),
        value: null,
      };

      updateFilters([...filters, filter]);
    }
  };

  return (
    <Menu>
      <MenuButton>
        <div
          className={clsx(
            "flex cursor-pointer items-center gap-1 rounded-sm px-3 py-1 transition duration-150",
            filters.filter((f) => f.value).length > 0
              ? "bg-purple-600"
              : "hover:bg-zinc-700",
          )}
        >
          <AdjustmentsHorizontalIcon className="size-4 text-white/50" />
          Filter
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className="z-20 mt-1 flex min-w-[300px] origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <div
            className="flex flex-col gap-2 px-2 py-1 font-light"
            onClick={(e) => e.preventDefault()}
          >
            <div>
              {filters.length === 0
                ? "No filer conditions are applied"
                : "In this view, show rows"}
            </div>

            {/* multiple fields can have a sort, so instead change arr by idx not field id */}
            {filters.map((_, idx) => (
              <FilterOption
                key={idx}
                filters={filters}
                filterIdx={idx}
                columns={columns}
                setFilters={updateFilters}
              />
            ))}

            <Button
              className="flex items-center gap-1 border-none p-0 font-light"
              size="sm"
              variant="outline"
              onClick={addFilter}
            >
              <PlusIcon className="size-5" />
              Add condition
            </Button>
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
