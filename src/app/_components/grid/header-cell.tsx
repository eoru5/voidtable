"use client";

import type { HeaderContext } from "@tanstack/react-table";
import { useEffect, useRef, useState } from "react";
import { useTable } from "~/hooks/use-table";
import type { Column, Row } from "~/types/types";
import ColumnIcon from "../icons/column-icon";
import HeaderCellMenu from "./header-cell-menu";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";

export default function HeaderCell({
  column,
  props,
}: {
  column: Column;
  props: HeaderContext<Row, unknown>;
}) {
  const { renameColumn } = useTable();

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
        className="flex w-full cursor-pointer items-center justify-between overflow-hidden py-1 pl-3"
        onClick={!renaming ? props.column.getToggleSortingHandler() : undefined}
      >
        <div className="flex items-center gap-1 overflow-hidden">
          <ColumnIcon
            columnType={column.type}
            className="shrink-0 text-zinc-500"
          />
          {renaming ? (
            <input
              ref={inputRef}
              defaultValue={column.name}
              className="w-full rounded-md border-none bg-zinc-800 pr-1 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
              onBlur={(e) => {
                renameColumn.mutate({ id: column.id, name: e.target.value });
                setRenaming(false);
              }}
            />
          ) : (
            <div className="grow-0 truncate">{column.name}</div>
          )}
        </div>
        {props.column.getIsSorted() === "asc" && (
          <ChevronUpIcon className="size-5 shrink-0 text-zinc-500" />
        )}
        {props.column.getIsSorted() === "desc" && (
          <ChevronDownIcon className="size-5 shrink-0 text-zinc-500" />
        )}
      </div>

      <HeaderCellMenu
        name={column.name}
        columnId={column.id}
        renaming={renaming}
        setRenaming={setRenaming}
      />
    </div>
  );
}
