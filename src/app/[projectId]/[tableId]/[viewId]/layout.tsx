import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export type ViewProps = {
  params: Promise<{
    projectId: string;
    tableId: string;
    viewId: string;
  }>;
};

export async function generateMetadata({
  params,
}: ViewProps): Promise<Metadata> {
  const { projectId, tableId, viewId } = await params;
  try {
    const { project, table } = await api.project.open({
      id: projectId,
      tableId,
      viewId,
    });
    return {
      title: `${project.name}: ${table.name} - Voidtable`,
    };
  } catch {
    redirect("/");
  }
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
