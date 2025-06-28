"use client";

import { api } from "~/trpc/react";
import React, { Suspense } from "react";
import ProjectNavbar from "./project-navbar";
import { useRouter } from "next/navigation";
import { ProjectContext } from "~/hooks/use-project";
import Tabs from "./tabs";
import LoadingIcon from "../loading-icon";
import Table from "../table/table";

export default function Project({
  projectId,
  tableId,
  viewId,
}: {
  projectId: string;
  tableId: string;
  viewId: string;
}) {
  const router = useRouter();
  const utils = api.useUtils();

  const [project] = api.project.get.useSuspenseQuery({ id: projectId });

  const createTable = api.table.create.useMutation({
    onSuccess: async () => {
      await utils.project.get.invalidate();
    },
  });

  const renameTable = api.table.rename.useMutation({
    onSuccess: async () => {
      await utils.project.get.invalidate();
    },
  });

  const deleteTable = api.table.delete.useMutation({
    onSuccess: async () => {
      await utils.project.get.invalidate();
      router.push(`/${projectId}`);
    },
  });

  return (
    <ProjectContext value={{ project, createTable, renameTable, deleteTable }}>
      <div className="flex h-screen w-screen flex-col">
        <ProjectNavbar projectName={project.name} />

        <div className="flex h-full w-full flex-col overflow-auto">
          <Tabs tableId={tableId} />

          <Suspense fallback={<LoadingIcon />}>
            <Table tableId={tableId} viewId={viewId} />
          </Suspense>
        </div>
      </div>
    </ProjectContext>
  );
}
