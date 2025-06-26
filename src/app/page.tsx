import { SessionProvider } from "next-auth/react";
import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import Dashboard from "./_components/dashboard/dashboard";

export default async function Page() {
  const session = await auth();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <HydrateClient>
      <SessionProvider>
        <Dashboard />
      </SessionProvider>
    </HydrateClient>
  );
}
