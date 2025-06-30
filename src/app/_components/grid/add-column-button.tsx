import { Menu, MenuItems, MenuItem, MenuButton } from "@headlessui/react";

import { useState } from "react";
import Button from "../button";
import { CheckIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CellType } from "@prisma/client";
import clsx from "clsx";

export default function AddColumnButton({
  createColumn,
}: {
  createColumn: (name: string, type: CellType) => void;
}) {
  const [name, setName] = useState("");
  const [selectedType, setSelectedType] = useState<CellType>("Text");

  return (
    <Menu>
      {({ close }) => (
        <div>
          <MenuButton>
            <div className="h-full cursor-pointer border-r-1 border-b-1 border-zinc-600 bg-zinc-800 px-8 py-1 transition duration-150 hover:bg-zinc-600">
              <PlusIcon className="size-4" />
            </div>
          </MenuButton>

          <MenuItems
            anchor="bottom start"
            transition
            className="z-20 flex max-h-[200px] min-w-[200px] origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
          >
            <MenuItem>
              <div onClick={(e) => e.preventDefault()}>
                <input
                  className="rounded-md border-1 border-zinc-600 bg-zinc-800 p-1 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Column name"
                />
              </div>
            </MenuItem>
            <MenuItem>
              <div className="flex h-full grow flex-col gap-1 overflow-scroll rounded-sm border-1 border-zinc-600 p-1">
                {Object.values(CellType).map((type, idx) => (
                  <Button
                    variant="outline"
                    key={idx}
                    size="sm"
                    className={clsx(
                      "flex items-center justify-between text-left",
                      selectedType === type
                        ? "bg-zinc-600"
                        : "hover:bg-zinc-600",
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedType(type);
                    }}
                  >
                    {type}
                    {selectedType === type && (
                      <CheckIcon className="size-4 stroke-2 text-zinc-300" />
                    )}
                  </Button>
                ))}
              </div>
            </MenuItem>

            <MenuItem>
              <div className="flex items-center justify-end gap-1">
                <Button onClick={close} size="sm" variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    createColumn(name, selectedType);
                    close();
                  }}
                  size="sm"
                >
                  Create column
                </Button>
              </div>
            </MenuItem>
          </MenuItems>
        </div>
      )}
    </Menu>
  );
}
