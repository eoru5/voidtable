import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { auth } from "~/server/auth";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // redirect to base/table/view
  const { projectId } = await params;
  const project = await api.project.get({ id: projectId });

  const table = project?.Table[0];
  const view = table?.View[0];
  if (table && view) {
    redirect(`${projectId}/${table.id}/${view.id}`);
  } else {
    redirect("/");
  }
}
