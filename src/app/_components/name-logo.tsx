"use client";

import clsx from "clsx";
import PortalIcon from "./icons/portal-icon";

const sizes = {
  sm: {
    icon: "size-6",
    text: "text-xl font-semibold",
  },
  md: {
    icon: "size-7",
    text: "text-2xl font-semibold",
  },
  lg: {
    icon: "size-9",
    text: "text-3xl font-bold",
  },
};

export default function NameLogo({
  text = "Voidtable",
  size = "md",
}: {
  text?: string;
  size?: keyof typeof sizes;
}) {
  return (
    <div className="group flex items-center justify-center gap-2">
      <PortalIcon className={sizes[size].icon} animate="hover" />
      <div className={clsx(sizes[size].text, "select-none")}>{text}</div>
    </div>
  );
}
