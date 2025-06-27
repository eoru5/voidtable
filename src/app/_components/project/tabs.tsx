"use client";

import React, { Fragment } from "react";
import Tab from "./tab";
import Button from "../button";
import { useProject } from "~/hooks/use-project";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function Tabs({ tableId }: { tableId: string }) {
  const { project, createTable } = useProject();

  return (
    <div className="flex overflow-scroll bg-black/20 px-4">
      {project.Table.map((table, idx) => (
        <Fragment key={idx}>
          <Tab
            table={table}
            selected={tableId === table.id}
            link={`/${project.id}/${table.id}/${table.View[0]?.id ?? ""}`}
            canDelete={project.Table.length > 1}
          />
          <div className="mx-2 py-2">
            <div className="h-full w-px bg-zinc-600" />
          </div>
        </Fragment>
      ))}

      <Button
        variant="outline"
        className="rounded-t-md rounded-b-none border-none"
        onClick={() =>
          createTable.mutate({
            projectId: project.id,
            name: `Table ${project.Table.length + 1}`,
          })
        }
      >
        <PlusIcon className="size-4 stroke-2" />
      </Button>
    </div>
  );
}
