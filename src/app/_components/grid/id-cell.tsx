"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useTable } from "~/hooks/use-table";

export default function IdCell({
  index,
  rowId,
}: {
  index: number;
  rowId: number;
}) {
  const { deleteRow } = useTable();

  return (
    <div className="flex h-full w-full items-center justify-between gap-2">
      <div className="overflow-hidden px-4 py-1">{index}</div>
      <div>
        <Menu>
          <MenuButton>
            <ChevronDownIcon className="size-5 cursor-pointer px-4 py-1 text-zinc-300" />
          </MenuButton>

          <MenuItems
            anchor="bottom start"
            transition
            onClick={(e) => e.preventDefault()}
            className="z-20 origin-top-right rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              {/* <div
                className="flex cursor-pointer items-center gap-1.5 rounded-sm p-2 text-left hover:bg-neutral-100"
                role="button"
                onClick={() => deleteRecord.mutate({ id: recordId })}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
                Delete record
              </div> */}
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>
    </div>
  );
}
