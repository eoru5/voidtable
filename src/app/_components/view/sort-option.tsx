import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import type { Column, Order, Sort } from "~/types/types";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../button";
import type { CellType } from "@prisma/client";

const labels: Record<CellType, Record<Order, string>> = {
  Text: {
    desc: "Z → A",
    asc: "A → Z",
  },
  Number: {
    desc: "9 → 1",
    asc: "1 → 9",
  },
};

export default function SortOption({
  sorts,
  setSorts,
  columns,
  selectedColumn,
}: {
  sorts: Sort[];
  setSorts: (sort: Sort[]) => void;
  columns: Column[];
  selectedColumn: Column;
}) {
  const [selected, setSelected] = useState(selectedColumn);

  const selectedSort = sorts.find((s) => s.columnId === selectedColumn.id)!;

  const unsortedColumns = columns.filter((c) =>
    sorts.every((s) => s.columnId !== c.id),
  );

  return (
    <div className="flex gap-1 text-sm">
      <Listbox
        value={selected}
        onChange={(value) => {
          if (!value) return;

          // swap old val with new val
          const newSorts: Sort[] = [
            ...sorts,
            { columnId: value.id, order: "asc" },
          ];

          const idx = sorts.findIndex((s) => s.columnId === selected.id);
          if (idx !== -1) {
            newSorts.splice(idx, 1);
          }

          setSorts(newSorts);
          setSelected(value);
        }}
      >
        <ListboxButton className="w-full" as="div">
          <Button
            className="flex w-full items-center justify-between gap-2 text-nowrap"
            variant="outline"
            size="sm"
          >
            {selected.name}
            <ChevronDownIcon className="size-5" />
          </Button>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className="z-20 w-[var(--button-width)] rounded-sm border border-zinc-600 bg-zinc-800 p-1 shadow-sm transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0"
        >
          {unsortedColumns.map((c) => (
            <ListboxOption
              key={c.id}
              value={c}
              className="cursor-pointer gap-2 rounded-sm px-2 py-1 text-sm font-light transition duration-150 select-none data-[focus]:bg-zinc-700"
            >
              {c.name}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>

      <Listbox
        value={selectedSort.order}
        onChange={(value) => {
          // swap old val with new val
          const newSorts = [...sorts];
          const sort = newSorts.find((s) => s.columnId === selected.id);
          sort!.order = value;
          setSorts(newSorts);
        }}
      >
        <ListboxButton className="w-full" as="div">
          <Button
            className="flex w-full items-center justify-between gap-2 text-nowrap"
            variant="outline"
            size="sm"
          >
            {labels[selected.type][selectedSort.order]}
            <ChevronDownIcon className="size-5" />
          </Button>
        </ListboxButton>
        <ListboxOptions
          anchor="bottom"
          transition
          className="bg-zinc- z-20 w-[var(--button-width)] rounded-sm border border-zinc-600 bg-zinc-800 p-1 shadow-sm transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0"
        >
          <ListboxOption
            value="asc"
            className="cursor-pointer rounded-sm px-2 py-1 text-sm font-light transition duration-150 select-none data-[focus]:bg-zinc-700"
          >
            {labels[selected.type].asc}
          </ListboxOption>

          <ListboxOption
            value="desc"
            className="cursor-pointer rounded-sm px-2 py-1 text-sm font-light transition duration-150 select-none data-[focus]:bg-zinc-700"
          >
            {labels[selected.type].desc}
          </ListboxOption>
        </ListboxOptions>
      </Listbox>

      <Button
        size="sm"
        className="border-none p-1"
        variant="outline"
        onClick={() => {
          const newSorts = [...sorts];
          const index = sorts.findIndex((s) => s.columnId === selected.id);
          newSorts.splice(index, 1);
          setSorts(newSorts);
        }}
      >
        <XMarkIcon className="size-5" />
      </Button>
    </div>
  );
}
