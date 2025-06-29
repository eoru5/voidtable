"use client";

import React, { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Link from "next/link";
import { useProject } from "~/hooks/use-project";
import { ChevronDownIcon, PencilIcon } from "@heroicons/react/24/outline";
import type { Table } from "~/types/types";
import Button from "../button";
import { TrashIcon } from "@heroicons/react/24/solid";

const LinkTab = ({ link, children }: { link: string; children: ReactNode }) => {
  return (
    <Link
      className="cursor-pointer rounded-t-sm px-4 py-2 text-sm text-nowrap transition duration-200 hover:bg-black/15 focus:outline-1 focus:outline-white focus:outline-none"
      href={link}
    >
      {children}
    </Link>
  );
};

const MenuTab = ({
  table,
  canDelete,
}: {
  table: Table;
  canDelete: boolean;
}) => {
  const { renameTable, deleteTable } = useProject();
  const inputRef = useRef<HTMLInputElement>(null);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      window.getSelection()?.removeAllRanges();
    }
  }, [renaming]);

  const MenuContent = () => {
    const [tableName, setTableName] = useState(table.name);

    if (renaming) {
      return (
        <MenuItem>
          {({ close }) => (
            <div onClick={(e) => e.preventDefault()}>
              <Input
                ref={inputRef}
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full rounded-md border-none bg-zinc-800 px-2 py-1 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
              />
              <div className="mt-1 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={close}>
                  Cancel
                </Button>

                <Button
                  onClick={() => {
                    renameTable.mutate({
                      id: table.id,
                      name: tableName,
                    });
                    close();
                  }}
                  size="sm"
                >
                  Save
                </Button>
              </div>
            </div>
          )}
        </MenuItem>
      );
    } else if (deleting) {
      return (
        <MenuItem>
          {({ close }) => (
            <div onClick={(e) => e.preventDefault()}>
              <div>Are you sure you want to delete {table.name}?</div>
              <div className="mt-1 flex items-center justify-end gap-2">
                <Button size="sm" variant="outline" onClick={close}>
                  Cancel
                </Button>
                <Button
                  variant="error"
                  disabled={deleteTable.isPending}
                  onClick={() => {
                    deleteTable.mutate({ id: table.id });
                    close();
                  }}
                  className="flex items-center justify-between gap-1"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </div>
          )}
        </MenuItem>
      );
    }

    return (
      <>
        <MenuItem>
          <Button
            onClick={(e) => {
              e.preventDefault();
              setRenaming(true);
            }}
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
              setDeleting(true);
            }}
            className="flex items-center justify-between gap-2"
            size="sm"
          >
            {canDelete ? "Delete Table" : "Can't delete last table"}
            <TrashIcon className="size-4" />
          </Button>
        </MenuItem>
      </>
    );
  };

  return (
    <Menu>
      {({ open }) => {
        if (!open) {
          setRenaming(false);
          setDeleting(false);
        }

        return (
          <div>
            <MenuButton>
              <div className="flex cursor-pointer items-center justify-between gap-2 rounded-t-sm bg-zinc-800 px-4 py-2 text-sm text-nowrap focus:outline-1 focus:outline-white focus:outline-none">
                {table.name}
                <ChevronDownIcon className="size-4 stroke-3" />
              </div>
            </MenuButton>

            <MenuItems
              anchor="bottom start"
              transition
              className="z-20 mt-2 flex origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm font-light transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuContent />
            </MenuItems>
          </div>
        );
      }}
    </Menu>
  );
};

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
  if (selected) {
    return <MenuTab table={table} canDelete={canDelete} />;
  }
  return <LinkTab link={link}>{table.name}</LinkTab>;
}
