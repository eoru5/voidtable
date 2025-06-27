import React, { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Button as HeadlessButton } from "@headlessui/react";

const variants = {
  primary: "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800",
  outline: "border border-zinc-600 hover:bg-zinc-700",
  error: "bg-rose-600 hover:bg-rose-700 disabled:bg-rose-800",
};

const sizes = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2 text-base font-semibold",
  lg: "px-5 py-3 text-lg font-semibold",
};

export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}) {
  return (
    <HeadlessButton
      className={twMerge(
        "cursor-pointer rounded-md transition duration-200 disabled:cursor-default",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </HeadlessButton>
  );
}
