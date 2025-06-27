"use client";

import { Button, Input } from "@headlessui/react";
import { api } from "~/trpc/react";
import { type SortingState } from "@tanstack/react-table";
import { useState, useEffect } from "react";

export default function View({
  tableId,
  viewId,
}: {
  tableId: string;
  viewId: string;
}) {
  return <div>hi!</div>;
  // const utils = api.useUtils();

  // const [views] = api.table.getViews.useSuspenseQuery({ tableId });
  // const [columns] = api.table.getColumns.useSuspenseQuery({ tableId });

  // const createView = api.view.create.useMutation({
  //   onSuccess: async () => {
  //     await utils.table.getViews.invalidate();
  //   },
  // });

  // const updateView = api.view.update.useMutation({
  //   onSuccess: async () => {
  //     await utils.table.getCells.invalidate();
  //   },
  // });

  // const [sorting, setSorting] = useState<SortingState>([]);
  // const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // const [loaded, setLoaded] = useState(false);
  // const [hiddenFields, setHiddenFields] = useState<number[]>([]);
  // const [searching, setSearching] = useState(false);

  // const handleUpdateView = () => {
  //   const currentView = views.find((v) => v.id === viewId)!;
  //   setSorting((currentView.sort as { id: string; desc: boolean }[]) ?? []);
  //   setColumnFilters((currentView.filters as ColumnFiltersState) ?? []);
  //   setHiddenFields(currentView.hiddenFields ?? []);
  //   setLoaded(true);
  // };

  // useEffect(() => updateView(), [viewId]);

  // useEffect(() => {
  //   // save new filter configs to db
  //   if (loaded) updateFilter.mutate({ id: viewId, filters: columnFilters });
  // }, [columnFilters]);

  // useEffect(() => {
  //   // save new sort configs to db
  //   if (loaded) updateSort.mutate({ id: viewId, sort: sorting });
  // }, [sorting]);

  // useEffect(() => {
  //   if (loaded) updateHiddenFields.mutate({ id: viewId, hiddenFields });
  // }, [hiddenFields]);

  // return (
  //   <div className="flex h-full w-full flex-col overflow-auto">
  //     <ViewNavbar
  //       sorting={sorting}
  //       setSorting={setSorting}
  //       fields={columns}
  //       columnFilters={columnFilters}
  //       setColumnFilters={setColumnFilters}
  //       hiddenFields={hiddenFields}
  //       setHiddenFields={setHiddenFields}
  //       searching={searching}
  //       setSearching={setSearching}
  //     />
  //     <div className="flex h-full w-full overflow-auto">
  //       <div className="flex h-full w-[300px] flex-col justify-between border-r-1 border-neutral-300 bg-white px-4 py-4 text-sm font-light">
  //         <div className="flex flex-col gap-1">
  //           <div className="mb-3 flex items-center gap-1">
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 20 20"
  //               fill="currentColor"
  //               className="size-6 pb-2 text-neutral-400"
  //             >
  //               <path
  //                 fillRule="evenodd"
  //                 d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
  //                 clipRule="evenodd"
  //               />
  //             </svg>
  //             <Input
  //               className="border-b-1 border-neutral-300 pb-2 transition duration-200 data-[focus]:border-blue-700 data-[focus]:outline-none"
  //               placeholder="Find a view"
  //             />
  //           </div>

  //           {views.map((view) => (
  //             <ViewSidebarButton
  //               key={view.id}
  //               name={view.name}
  //               viewId={view.id}
  //               baseId={baseId}
  //               selected={view.id === viewId}
  //               link={`/${baseId}/${tableId}/${view.id}`}
  //               canDelete={views.length > 1}
  //             />
  //           ))}
  //         </div>
  //         <div>
  //           <hr className="mb-3 h-0.5 border-neutral-300" />

  //           <div className="flex cursor-pointer items-center justify-between px-2 py-1">
  //             Create...
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               viewBox="0 0 20 20"
  //               fill="currentColor"
  //               className="size-5"
  //             >
  //               <path
  //                 fillRule="evenodd"
  //                 d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
  //                 clipRule="evenodd"
  //               />
  //             </svg>
  //           </div>

  //           <Button
  //             className="flex w-full cursor-pointer items-center justify-between rounded-sm px-3 py-2 transition duration-150 hover:bg-neutral-300"
  //             onClick={() =>
  //               createView.mutate({
  //                 tableId,
  //                 name: `View ${views.length + 1}`,
  //               })
  //             }
  //           >
  //             <div className="flex items-center gap-2">
  //               <div className="text-blue-600">
  //                 <Grid />
  //               </div>
  //               Grid
  //             </div>
  //             <svg
  //               xmlns="http://www.w3.org/2000/svg"
  //               fill="none"
  //               viewBox="0 0 24 24"
  //               strokeWidth={2}
  //               stroke="currentColor"
  //               className="size-4 text-neutral-500"
  //             >
  //               <path
  //                 strokeLinecap="round"
  //                 strokeLinejoin="round"
  //                 d="M12 4.5v15m7.5-7.5h-15"
  //               />
  //             </svg>
  //           </Button>
  //         </div>
  //       </div>
  //       <div className="h-full w-full">
  //         <Table
  //           tableId={tableId}
  //           viewId={viewId}
  //           fields={columns.filter((f) => !hiddenFields.includes(f.id))}
  //           createField={(name, type) =>
  //             createColumn.mutate({ tableId, name, type })
  //           }
  //           createRecord={(numRows, randomData) =>
  //             createRecord.mutate({ tableId, numRows, randomData })
  //           }
  //           sorting={sorting}
  //           setSorting={setSorting}
  //           searching={searching}
  //           setSearching={setSearching}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
}
