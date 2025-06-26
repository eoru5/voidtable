import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";
import type { ViewProps } from "./layout";

export default async function Page({ params }: ViewProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { projectId, tableId, viewId } = await params;

  return (
    <SessionProvider session={session}>
      <HydrateClient>
        hihi
        {/* <Base baseId={baseId} tableId={tableId} viewId={viewId} /> */}
      </HydrateClient>
    </SessionProvider>
  );
}
