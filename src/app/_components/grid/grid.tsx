"use client";

import { keepPreviousData } from "@tanstack/react-query";
import { useCallback } from "react";
import { useTable } from "~/hooks/use-table";
import { useView } from "~/hooks/use-view";
import { api } from "~/trpc/react";
import { toast } from "../toast";
import PortalIcon from "../icons/portal-icon";
import { type RowData } from "@tanstack/react-table";
import GridContent from "./grid-content";

export type UpdateData = (
  rowIndex: number,
  columnId: string,
  value: string,
) => void;

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface TableMeta<TData extends RowData> {
    updateData: UpdateData;
  }
}

export default function Grid() {
  const { view } = useView();
  const { table } = useTable();

  const { data, fetchNextPage, isFetching, isPending } =
    api.table.getInfiniteCells.useInfiniteQuery(
      {
        id: table.id,
        viewId: view.id,
        limit: 50,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        refetchOnWindowFocus: false,
        placeholderData: keepPreviousData,
      },
    );

  const nextCursor = data?.pages[data.pages.length - 1]?.nextCursor;

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (!containerRefElement) {
        return;
      }

      const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
      // once the user has scrolled within 500px of the bottom of the table, try fetch more data
      if (
        scrollHeight - scrollTop - clientHeight < 500 &&
        !isFetching &&
        nextCursor
      ) {
        fetchNextPage().catch((err) => {
          if (err instanceof Error) {
            toast.error({
              title: "An error occurred while fetching data",
              description: err.message,
            });
          }
        });
      }
    },
    [fetchNextPage, isFetching, nextCursor],
  );

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <PortalIcon className="size-12" animate="always" />
      </div>
    );
  }

  return (
    <GridContent
      initialData={data}
      fetchingData={isFetching}
      fetchMoreOnBottomReached={fetchMoreOnBottomReached}
      nextCursor={nextCursor}
    />
  );
}
