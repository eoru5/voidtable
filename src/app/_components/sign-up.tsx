"use client";

import { Field, Input, Label } from "@headlessui/react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "./toast";
import clsx from "clsx";
import GoogleSignInButton from "./google-sign-in-button";
import NameLogo from "./name-logo";
import Button from "./button";
import type { FormEvent } from "react";

export default function SignUp() {
  const router = useRouter();

  const createUser = api.user.create.useMutation({
    onSuccess: () => {
      router.push("/sign-in");
    },
    onError: (e) => {
      let description;
      if (e.data?.zodError) {
        description = Object.values(e.data.zodError.fieldErrors)
          .flat()
          .join(", ");
      } else {
        description = e.message;
      }

      toast.error({
        title: "Error occured",
        description,
      });
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;
    if (password !== confirm) {
      toast.error({
        title: "Error occured",
        description: "Passwords not matching",
      });
    } else {
      await createUser.mutateAsync({
        email,
        password,
      });
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center p-3">
      <NameLogo />

      <h1 className="my-8 text-4xl font-semibold">Sign up</h1>

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

          <Field>
            <Label>Confirm Password</Label>
            <Input
              name="confirm"
              type="password"
              placeholder="Enter your password again"
              className="mt-1 w-full rounded-md border-none bg-zinc-800 px-4 py-2 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none"
            />
          </Field>

          <Button type="submit" disabled={createUser.isPending}>
            Create account
          </Button>
        </form>

        <div className="mt-4 text-center text-sm text-zinc-300">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary-400 inline text-purple-400 transition duration-200 hover:text-purple-500"
          >
            Sign in
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
