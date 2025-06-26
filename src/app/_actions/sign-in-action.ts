"use server";
import { signIn } from "~/server/auth";

export default async function signInAction(
  provider: string,
  params: Record<string, unknown>,
) {
  await signIn(provider, params);
}
