import SignIn from "../_components/sign-in";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return <SignIn />;
}
