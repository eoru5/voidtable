"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import type { HeaderContext } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useTable } from "~/hooks/use-table";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import type { Column, Row } from "~/types/types";
import ColumnIcon from "../icons/column-icon";

export default function HeaderCell({
  column,
  props,
}: {
  column: Column;
  props: HeaderContext<Row, unknown>;
}) {
  const { deleteColumn, renameColumn } = useTable();

  const [renaming, setRenaming] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
    }
  }, [renaming]);

  return (
    <div className="flex h-full w-full justify-between">
      <div
        className="flex grow cursor-pointer items-center justify-between overflow-hidden py-1 pl-3"
        onClick={!renaming ? props.column.getToggleSortingHandler() : undefined}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <div className="text-neutral-500">
            <ColumnIcon columnType={column.type} />
          </div>
          {renaming ? (
            <div className="flex-1 pr-1 text-sm font-light">
              <input
                ref={inputRef}
                defaultValue={column.name}
                className="w-full"
                onBlur={(e) => {
                  renameColumn.mutate({ id: column.id, name: e.target.value });
                  setRenaming(false);
                }}
              />
            </div>
          ) : (
            <>{column.name}</>
          )}
        </div>
        <div className="text-neutral-600">
          {props.column.getIsSorted() === "asc" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z"
                clipRule="evenodd"
              />
            </svg>
          )}
          {props.column.getIsSorted() === "desc" && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>

      <Menu>
        <MenuButton>
          <EllipsisVerticalIcon className="flex size-4 cursor-pointer items-center py-1 pr-3" />
        </MenuButton>

        <MenuItems
          anchor="bottom start"
          transition
          onClick={(e) => e.preventDefault()}
          className="z-20 mt-1 origin-top-right rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          {/* <MenuItem>
            <RenameButton
              text="Rename Field"
              onClick={() => setRenaming(true)}
            />
          </MenuItem>
          <MenuItem>
            <DeleteButton
              text="Delete Field"
              description={`Are you sure you want to delete ${column.name}?`}
              onClick={() => deleteColumn.mutate({ id: ColumnIcon.id })}
            />
          </MenuItem> */}
        </MenuItems>
      </Menu>
    </div>
  );
}
