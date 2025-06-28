"use client";

import React from "react";
import Link from "next/link";
import NameLogo from "../name-logo";
import UserMenu from "../user-menu";

export default function ProjectNavbar({ projectName }: { projectName: string }) {
  return (
    <nav className="z-10 flex w-full justify-center bg-purple-700">
      <div className="flex w-full items-center justify-between p-4">
        <Link href="/">
          <NameLogo text={projectName} size="sm" />
        </Link>

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
