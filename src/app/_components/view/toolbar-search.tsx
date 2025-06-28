"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useView } from "~/hooks/use-view";

export default function ToolbarSearch() {
  const { search, setSearch } = useView();

  return (
    <div
      className="cursor-pointer p-1 text-zinc-300 hover:text-zinc-100"
      onClick={() => setSearch(search === null ? "" : null)}
    >
      <MagnifyingGlassIcon className="size-4 stroke-2" />
    </div>
  );
}
