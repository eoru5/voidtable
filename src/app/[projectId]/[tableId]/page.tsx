import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string; tableId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { projectId, tableId } = await params;

  const view = await api.table.getLastView({ id: tableId });
  if (view) {
    redirect(`/${projectId}/${tableId}/${view.id}`);
  } else {
    redirect("/");
  }
}
