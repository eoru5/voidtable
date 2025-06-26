import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import SignUp from "../_components/sign-up";

export default async function Page() {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }

  return <SignUp />;
}
