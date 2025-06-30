"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import clsx from "clsx";
import { EyeSlashIcon } from "@heroicons/react/24/outline";
import HideColumnOption from "./hide-column-option";
import { useView } from "~/hooks/use-view";
import { useTable } from "~/hooks/use-table";

export default function ToolbarHideColumns() {
  const { allColumns: columns } = useTable();
  const { hiddenColumns, setHiddenColumns } = useView();

  return (
    <Menu>
      <MenuButton>
        <div
          className={clsx(
            "flex cursor-pointer items-center gap-1 rounded-sm px-3 py-1 transition duration-150",
            hiddenColumns.length > 0 ? "bg-purple-600" : "hover:bg-zinc-700",
          )}
        >
          <EyeSlashIcon className="size-4" />
          {hiddenColumns.length > 0
            ? `${hiddenColumns.length} hidden field${hiddenColumns.length > 1 ? "s" : ""}`
            : "Hide Fields"}
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className="z-20 mt-1 flex min-w-[300px] origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <div
            className="flex flex-col gap-1 font-light"
            onClick={(e) => e.preventDefault()}
          >
            {columns.map((c) => (
              <HideColumnOption
                key={c.id}
                column={c}
                hiddenColumns={hiddenColumns}
                setHiddenColumns={setHiddenColumns}
              />
            ))}
          </div>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
