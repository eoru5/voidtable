"use client";

import {
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { View } from "~/types/types";
import { useTable } from "~/hooks/use-table";
import {
  PencilIcon,
  TableCellsIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Button from "../button";

export default function ViewItem({
  view,
  selected,
  link,
  canDelete,
}: {
  view: View;
  selected: boolean;
  link: string;
  canDelete: boolean;
}) {
  const [renaming, setRenaming] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateView, deleteView } = useTable();

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);

  if (!selected) {
    return (
      <Link
        className="flex w-full cursor-pointer items-center gap-2 rounded-sm bg-zinc-800 px-2 py-1 transition duration-150 hover:bg-black/15"
        href={link}
      >
        <TableCellsIcon className="text-primary-600 size-5 shrink-0" />
        <div className="grow-0 truncate">{view.name}</div>
      </Link>
    );
  }

  return (
    <Menu>
      <MenuButton>
        <div className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-sm bg-purple-600 px-2 py-1 transition duration-150 hover:bg-purple-900">
          <div className="flex items-center gap-2 overflow-hidden">
            <TableCellsIcon className="size-5 shrink-0" />
            {renaming ? (
              <div
                className="mr-2 h-full text-sm font-light"
                onClick={(e) => e.stopPropagation()}
              >
                <Input
                  ref={inputRef}
                  defaultValue={view.name}
                  className="w-full"
                  onBlur={(e) => {
                    updateView.mutate({ id: view.id, name: e.target.value });
                    setRenaming(false);
                  }}
                />
              </div>
            ) : (
              <div className="grow-0 truncate">{view.name}</div>
            )}
          </div>
          <ChevronDownIcon className="size-4 shrink-0 stroke-3 text-white/50" />
        </div>
      </MenuButton>

      <MenuItems
        anchor="bottom start"
        transition
        className="z-20 mt-1 flex min-w-[250px] origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
      >
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
            variant="error"
            disabled={!canDelete}
            onClick={(e) => {
              e.preventDefault();
              deleteView.mutate({ id: view.id });
            }}
            className="flex items-center justify-between gap-2"
            size="sm"
          >
            {canDelete ? "Delete view" : "Can't delete last view"}
            <TrashIcon className="size-4" />
          </Button>
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
