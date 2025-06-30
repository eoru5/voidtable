"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTable } from "~/hooks/use-table";
import Button from "../button";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function IndexCell({
  index,
  rowId,
}: {
  index: number;
  rowId: number;
}) {
  const { deleteRow } = useTable();

  return (
    <div className="flex h-full w-full items-center justify-between gap-1">
      <div className="truncate overflow-hidden py-1 pl-4">{index}</div>

      <Menu>
        <MenuButton>
          <div className="py-1 pr-4">
            <ChevronDownIcon className="size-4 cursor-pointer stroke-2 text-zinc-300" />
          </div>
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          transition
          onClick={(e) => e.preventDefault()}
          className="z-20 origin-top-right rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <Button
              onClick={() => deleteRow.mutate({ id: rowId })}
              variant="outline"
              className="flex items-center gap-2"
              size="sm"
            >
              <TrashIcon className="size-4 text-zinc-300" />
              Delete row
            </Button>
          </MenuItem>
        </MenuItems>
      </Menu>
    </div>
  );
}
