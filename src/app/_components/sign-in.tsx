"use client";

import { Field, Input, Label } from "@headlessui/react";
import signInAction from "../_actions/sign-in-action";
import clsx from "clsx";
import Link from "next/link";
import { toast } from "./toast";
import GoogleSignInButton from "./google-sign-in-button";
import { useRouter } from "next/navigation";
import NameLogo from "./name-logo";
import Button from "./button";
import { useState, type FormEvent } from "react";

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      await signInAction("credentials", {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        redirect: false,
      });
      router.push("/");
    } catch (e) {
      console.log(e);
      toast.error({
        title: "Invalid credentials",
        description: "Either your email or password was incorrect.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center p-3">
      <NameLogo />

      <h1 className="my-8 text-4xl font-semibold">Sign in</h1>

      <div className="flex flex-col">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              className="mt-1 w-full rounded-md border-none bg-zinc-800 px-4 py-2 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
            />
          </Field>

          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              className="mt-1 w-full rounded-md border-none bg-zinc-800 px-4 py-2 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
            />
          </Field>

          <Button type="submit" disabled={loading}>
            Sign in
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-300">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary-400 inline text-purple-400 transition duration-200 hover:text-purple-500"
          >
            Sign up
          </Link>
        </div>

        <div
          className={clsx(
            "flex items-center py-4 text-sm text-zinc-400",
            "before:me-3 before:flex-1 before:border-t before:border-zinc-600",
            "after:ms-3 after:flex-1 after:border-t after:border-zinc-600",
          )}
        >
          or
        </div>

        <GoogleSignInButton />
      </div>
    </div>
  );
}
