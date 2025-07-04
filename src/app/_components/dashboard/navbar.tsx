"use client";

import React from "react";
import NameLogo from "../name-logo";
import Link from "next/link";
import UserMenu from "../user-menu";

export default function Navbar() {
  return (
    <nav className="z-10 flex w-full justify-center bg-zinc-800">
      <div className="flex w-full max-w-7xl justify-between p-4">
        <Link href="/">
          <NameLogo />
        </Link>

        <div className="flex items-center">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
