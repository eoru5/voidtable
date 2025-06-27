import { redirect } from "next/navigation";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { SessionProvider } from "next-auth/react";
import type { ViewProps } from "./layout";
import Project from "~/app/_components/project/project";
import { Suspense } from "react";
import LoadingIcon from "~/app/_components/loading-icon";

export default async function Page({ params }: ViewProps) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { projectId, tableId, viewId } = await params;

  return (
    <SessionProvider session={session}>
      <HydrateClient>
        <Suspense
          fallback={
            <div className="h-screen">
              <LoadingIcon />
            </div>
          }
        >
          <Project projectId={projectId} tableId={tableId} viewId={viewId} />
        </Suspense>
      </HydrateClient>
    </SessionProvider>
  );
}
