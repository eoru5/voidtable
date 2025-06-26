"use client";

import { Button } from "@headlessui/react";
import GoogleIcon from "./icons/google-icon";
import signInAction from "../_actions/sign-in-action";

export default function GoogleSignInButton() {
  const googleSignIn = async () => {
    await signInAction("google", {
      redirectTo: "/",
    });
  };

  return (
    <Button
      onClick={googleSignIn}
      className="hover:bg-primary-600 flex cursor-pointer items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-zinc-900 transition duration-200 hover:bg-zinc-200"
    >
      <GoogleIcon className="size-6" />
      Sign in with Google
    </Button>
  );
}
