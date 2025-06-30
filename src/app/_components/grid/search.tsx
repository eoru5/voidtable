"use client";

import { useCallback, useEffect, useRef } from "react";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import { api } from "~/trpc/react";
import type { Row } from "~/types/types";
import PortalIcon from "../icons/portal-icon";
import Button from "../button";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Search({
  data,
  nextCursor,
  scrollToRow,
}: {
  data: Row[];
  nextCursor?: number;
  scrollToRow: (matchFn: (row: Row) => boolean) => void;
}) {
  const {
    view,
    search,
    setSearch,
    searchPos,
    setSearchPos,
    searchResults,
    setSearchResults,
  } = useView();
  const { table } = useTable();

  const utils = api.useUtils();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (search === null) {
      setSearchResults([]);
      setSearchPos(null);
    } else if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [search]);

  const { refetch, isPending } = api.table.search.useQuery(
    { id: table.id, viewId: view.id, search: search ?? "" },
    { enabled: false },
  );

  useEffect(() => {
    if (searchPos !== null && searchResults[searchPos]) {
      const resultRow = searchResults[searchPos];
      if (resultRow) {
        scrollToRow((row) => Number(row.id) === resultRow.rId);
      }
    }
  }, [searchPos, scrollToRow]);

  useEffect(() => {
    if (search) {
      setSearchResults([]);
      refetch()
        .then(({ data }) => {
          // need to use the latest search string
          if (data?.search === search) {
            setSearchPos(0);
            setSearchResults(data.results);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F4" || (e.ctrlKey && e.key === "f")) {
        e.preventDefault();
        if (search !== null) {
          inputRef?.current?.focus();
        } else {
          setSearch("");
        }
      }

      if (e.key === "Escape" && search !== null) {
        e.preventDefault();
        setSearch(null);
      }

      if (
        e.key === "Enter" &&
        search !== "" &&
        searchResults.length > 0 &&
        searchPos !== null
      ) {
        if (e.shiftKey) {
          updateSearchPos(
            (searchPos - 1 + searchResults.length) % searchResults.length,
          );
        } else {
          updateSearchPos((searchPos + 1) % searchResults.length);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [search, inputRef, searchResults, searchPos]);

  // make sure we have the data before actually setting it
  const updateSearchPos = useCallback(
    (pos: number) => {
      const resultRow = searchResults[pos];
      if (!resultRow) return;

      if (resultRow.rIdx > data.length - 1) {
        utils.table.getInfiniteCells
          .fetch({
            id: table.id,
            viewId: view.id,
            limit: resultRow.rIdx - data.length,
            cursor: nextCursor,
          })
          .then((newData) => {
            utils.table.getInfiniteCells.setInfiniteData(
              { id: table.id, viewId: view.id, limit: 50 },
              (oldData) => ({
                pages: [...(oldData?.pages ?? []), newData],
                pageParams: [
                  ...(oldData?.pageParams ?? []),
                  newData.nextCursor ?? null,
                ],
              }),
            );
            setSearchPos(pos);
          })
          .catch((err) => console.log(err));
      } else {
        setSearchPos(pos);
      }
    },
    [
      searchResults,
      data.length,
      nextCursor,
      setSearchPos,
      table,
      view,
      utils.table.getInfiniteCells,
    ],
  );

  if (search === null) {
    return <></>;
  }

  return (
    <div className="absolute top-0 right-0 z-20 mr-4 flex w-full max-w-[300px] flex-col border-1 border-t-0 border-zinc-600 bg-zinc-800 text-sm font-light select-none">
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <input
          className="w-0 flex-1 px-2 py-1 outline-none"
          placeholder="Find in view"
          ref={inputRef}
          value={search ?? ""}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex items-center justify-end gap-2 text-zinc-300">
          {search !== "" &&
            (!isPending ? (
              <div className="flex items-center gap-0.5">
                {searchPos !== null &&
                  (searchResults[searchPos]?.rIdx ?? 0) > data.length - 1 && (
                    <PortalIcon
                      className="size-3.5"
                      animate="always"
                      color="#B0B0B0"
                      secondaryColor="#1A1A1A"
                    />
                  )}
                <div className="max-w-[50px] truncate overflow-hidden text-xs tracking-tight">
                  {searchPos !== null && searchResults.length > 0
                    ? searchPos + 1
                    : 0}{" "}
                  of {searchResults.length}
                </div>
              </div>
            ) : (
              <PortalIcon
                className="size-3.5"
                animate="always"
                color="#B0B0B0"
                secondaryColor="#1A1A1A"
              />
            ))}

          {search !== "" &&
            !isPending &&
            searchResults.length > 0 &&
            searchPos !== null && (
              <div className="flex">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-none rounded-l-sm border-none p-0.5"
                  onClick={() =>
                    updateSearchPos((searchPos + 1) % searchResults.length)
                  }
                >
                  <ChevronDownIcon className="size-4 stroke-2" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-none rounded-r-sm border-none p-0.5"
                  onClick={() =>
                    updateSearchPos(
                      (searchPos - 1 + searchResults.length) %
                        searchResults.length,
                    )
                  }
                >
                  <ChevronUpIcon className="size-4 stroke-2" />
                </Button>
              </div>
            )}

          <Button
            size="sm"
            variant="outline"
            className="rounded-none border-none p-0.5"
            onClick={() => setSearch(null)}
          >
            <XMarkIcon className="size-4 stroke-2" />
          </Button>
        </div>
      </div>
      <div className="bg-zinc-900 px-4 py-2 text-xs font-light text-zinc-300">
        {search !== "" && searchResults.length > 0
          ? `Found ${searchResults.length} cells`
          : "Enter search term above"}
      </div>
    </div>
  );
}
