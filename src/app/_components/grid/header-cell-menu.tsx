"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import { useTable } from "~/hooks/use-table";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Button from "../button";

export default function HeaderCellMenu({
  name,
  columnId,
  renaming,
  setRenaming,
}: {
  name: string;
  columnId: number;
  renaming: boolean;
  setRenaming: (renaming: boolean) => void;
}) {
  const { deleteColumn } = useTable();
  const [deleting, setDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);

  const MenuContent = () => {
    if (deleting) {
      return (
        <MenuItem>
          <div>
            <div>Are you sure you want to delete {name}?</div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button
                onClick={() => deleteColumn.mutate({ id: columnId })}
                size="sm"
                variant="error"
              >
                Delete
              </Button>
            </div>
          </div>
        </MenuItem>
      );
    }

    return (
      <>
        <MenuItem>
          <Button
            onClick={() => setRenaming(true)}
            className="flex items-center justify-between gap-2"
            variant="outline"
            size="sm"
          >
            Rename
            <PencilIcon className="size-4" />
          </Button>
        </MenuItem>
        <MenuItem>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setDeleting(true);
            }}
            className="flex items-center justify-between gap-2"
            variant="error"
            size="sm"
          >
            Delete
            <TrashIcon className="size-4" />
          </Button>
        </MenuItem>
      </>
    );
  };

  return (
    <Menu>
      <MenuButton onClick={() => setRenaming(false)}>
        <EllipsisVerticalIcon className="flex size-5 shrink-0 cursor-pointer text-zinc-400 transition duration-100 hover:text-zinc-300" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        transition
        onClick={(e) => e.preventDefault()}
        className="z-20 flex origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
        <MenuItem>
          <div>{name}</div>
        </MenuItem>

        <MenuContent />
      </MenuItems>
    </Menu>
  );
}
