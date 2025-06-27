"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import React, { useState } from "react";
import Link from "next/link";
import { useProject } from "~/hooks/use-project";
import {
  ChevronDownIcon,
  PencilIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type { Table } from "~/types/types";
import Button from "../button";
import { TrashIcon } from "@heroicons/react/24/solid";

export default function Tab({
  table,
  selected,
  link,
  canDelete,
}: {
  table: Table;
  selected: boolean;
  link: string;
  canDelete: boolean;
}) {
  const [tableName, setTableName] = useState(table.name);
  const { renameTable, deleteTable } = useProject();
  const [open, setOpen] = useState(false);

  if (!selected) {
    return (
      <Link
        className="cursor-pointer rounded-t-sm px-4 py-2 text-sm text-nowrap text-white transition duration-200 hover:bg-zinc-700 focus:outline-1 focus:outline-white focus:outline-none"
        href={link}
      >
        {table.name}
      </Link>
    );
  }

  return (
    <>
      <Menu>
        <MenuButton>
          <div className="flex cursor-pointer items-center justify-between gap-2 rounded-t-sm bg-purple-600 px-4 py-2 text-sm text-nowrap focus:outline-1 focus:outline-white focus:outline-none">
            {table.name}
            <ChevronDownIcon className="size-4 stroke-3" />
          </div>
        </MenuButton>

        <MenuItems
          anchor="bottom start"
          transition
          className="z-20 mt-2 flex origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm font-light transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <Button
              onClick={() => setOpen(true)}
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
              onClick={() => deleteTable.mutate({ id: table.id })}
              className="flex items-center justify-between gap-2"
              size="sm"
            >
              {canDelete ? "Delete Table" : "Can't delete last table"}
              <TrashIcon className="size-4" />
            </Button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        transition
        className="fixed inset-0 z-20 flex w-screen items-center justify-center bg-black/35 p-4 transition duration-200 ease-out data-closed:opacity-0"
      >
        <DialogPanel className="flex flex-col items-start justify-center gap-4 rounded-lg border-1 border-zinc-600 bg-zinc-900 p-8">
          <DialogTitle className="flex w-full items-center justify-between gap-4 text-2xl font-semibold">
            Change Table Name
            <XMarkIcon
              className="size-6 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </DialogTitle>

          <Input
            value={tableName}
            className="w-full rounded-md border-none bg-zinc-800 px-4 py-2 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
            onChange={(e) => setTableName(e.target.value)}
          />

          <div className="flex w-full items-center justify-end gap-3">
            <Button onClick={() => setOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              disabled={renameTable.isPending}
              size="sm"
              onClick={async () => {
                await renameTable.mutateAsync({
                  id: table.id,
                  name: tableName,
                });
                setOpen(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
