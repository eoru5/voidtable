import {
  Input,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import {
  numberFilters,
  textFilters,
  type Column,
  type Filter,
  type FilterType,
} from "~/types/types";
import { getDefaultFilter } from "./toolbar-filter";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../button";

export default function FilterOption({
  filters,
  filterIdx,
  columns,
  setFilters,
}: {
  filters: Filter[];
  filterIdx: number;
  columns: Column[];
  setFilters: (filters: Filter[]) => void;
}) {
  const selectedFilter = filters[filterIdx]!;
  const selectedColumn = columns.find((c) => c.id === selectedFilter.columnId);
  const [selected, setSelected] = useState(selectedColumn);
  const [value, setValue] = useState(selectedFilter.value);

  let filterOpts: readonly FilterType[] = [];
  if (selected) {
    switch (selected.type) {
      case "Text":
        filterOpts = textFilters;
        break;
      case "Number":
        filterOpts = numberFilters;
        break;
    }
  }

  return (
    <div className="flex gap-1 text-sm font-light">
      <Listbox
        value={selected}
        onChange={(value) => {
          if (!value || !filters[filterIdx]) return;

          const filter: Filter = {
            columnId: value.id,
            type: getDefaultFilter(value),
            value: null,
          };

          const newFilters = [...filters];
          newFilters[filterIdx] = filter;

          setFilters(newFilters);
          setSelected(value);
        }}
      >
        <ListboxButton as="div">
          <Button
            variant="outline"
            size="sm"
            className="flex w-full cursor-pointer items-center justify-between gap-1 truncate"
          >
            {selected?.name ?? ""}
            <ChevronDownIcon className="size-5" />
          </Button>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className="z-20 w-[var(--button-width)] rounded-sm border border-zinc-600 bg-zinc-800 p-1 shadow-sm transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0"
        >
          {columns.map((c) => (
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
        value={selectedFilter.type}
        onChange={(value) => {
          const newFilters = [...filters];
          newFilters[filterIdx]!.type = value;
          setFilters(newFilters);
        }}
      >
        <ListboxButton as="div">
          <Button
            variant="outline"
            size="sm"
            className="flex w-full cursor-pointer items-center justify-between gap-1 truncate"
          >
            {selectedFilter.type}
            <ChevronDownIcon className="size-5" />
          </Button>
        </ListboxButton>

        <ListboxOptions
          anchor="bottom"
          transition
          className="z-20 w-[var(--button-width)] rounded-sm border border-zinc-600 bg-zinc-800 p-1 shadow-sm transition duration-100 ease-in [--anchor-gap:var(--spacing-1)] focus:outline-none data-[leave]:data-[closed]:opacity-0"
        >
          {filterOpts.map((f, idx) => (
            <ListboxOption
              key={idx}
              value={f}
              className="cursor-pointer gap-2 rounded-sm px-2 py-1 text-sm font-light transition duration-150 select-none data-[focus]:bg-zinc-700"
            >
              {f}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>

      <Input
        className="rounded-md border-1 border-zinc-600 px-2 py-1 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
        value={value ?? ""}
        onChange={(e) => setValue(e.target.value)}
        onBlur={(e) => {
          const newFilters = [...filters];
          newFilters[filterIdx]!.value = e.target.value;
          setFilters(newFilters);
        }}
        placeholder="Enter a value"
      />

      <Button
        size="sm"
        className="border-none p-1"
        variant="outline"
        onClick={() => {
          const newFilters = [...filters];
          newFilters.splice(filterIdx, 1);
          setFilters(newFilters);
        }}
      >
        <XMarkIcon className="size-5" />
      </Button>
    </div>
  );
}
