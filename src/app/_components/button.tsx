import React from "react";
import { twMerge } from "tailwind-merge";
import { Button as HeadlessButton } from "@headlessui/react";

const variants = {
  primary: "bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800",
  outline: "border border-zinc-600 hover:bg-zinc-700",
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
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
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
