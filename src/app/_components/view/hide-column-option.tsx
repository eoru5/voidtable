"use client";

import { Switch } from "@headlessui/react";
import type { Column } from "~/types/types";
import ColumnIcon from "../icons/column-icon";

export default function HideColumnOption({
  column,
  hiddenColumns,
  setHiddenColumns,
}: {
  column: Column;
  hiddenColumns: number[];
  setHiddenColumns: (hiddenColumns: number[]) => void;
}) {
  const columnShown = !hiddenColumns.includes(column.id);

  const onChange = () => {
    const newHiddenColumns = [...hiddenColumns];
    if (!columnShown) {
      newHiddenColumns.splice(newHiddenColumns.indexOf(column.id), 1);
    } else {
      newHiddenColumns.push(column.id);
    }
    setHiddenColumns(newHiddenColumns);
  };

  return (
    <div
      className="flex cursor-pointer items-center justify-between gap-1 rounded-md px-2 py-1 transition duration-150 hover:bg-black/15"
      onClick={onChange}
    >
      <div className="flex items-center gap-1">
        <ColumnIcon className="text-white/50" columnType={column.type} />
        {column.name}
      </div>

      <Switch
        checked={columnShown}
        className="group relative flex h-5 w-10 rounded-full bg-zinc-700 p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-purple-600 data-[focus]:outline-1 data-[focus]:outline-white"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none inline-block size-3 translate-x-0 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
        />
      </Switch>
    </div>
  );
}
