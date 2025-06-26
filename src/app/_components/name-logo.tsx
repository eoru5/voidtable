"use client";

import PortalIcon from "./icons/portal-icon";

export default function NameLogo() {
  return (
    <div className="group flex items-center justify-center gap-1">
      <PortalIcon className="size-7" animate="hover" />
      <div className="text-2xl font-semibold select-none">Voidtable</div>
    </div>
  );
}
