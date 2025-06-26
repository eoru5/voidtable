import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
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
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { projectId, tableId, viewId } = await params;
  const { project, table } = await api.project.open({
    id: projectId,
    tableId,
    viewId,
  });

  return {
    title: `${project.name}: ${table.name} - Voidtable`,
  };
}

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
