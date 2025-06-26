"use client";

import React from "react";
import Image from "next/image";
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuSeparator,
} from "@headlessui/react";
import { useSession } from "next-auth/react";
import NameLogo from "../name-logo";
import signOutAction from "~/app/_actions/sign-out-action";
import {
  ArrowLeftStartOnRectangleIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="z-10 flex w-full justify-center bg-zinc-800">
      <div className="flex w-full max-w-7xl justify-between p-4">
        <Link className="cursor-pointer" href="/">
          <NameLogo />
        </Link>

        <div className="flex items-center gap-6">
          <Menu>
            <MenuButton className="cursor-pointer focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="User Avatar"
                  className="cursor-pointer rounded-full"
                  width={32}
                  height={32}
                />
              ) : (
                <UserCircleIcon className="size-8 fill-zinc-700 stroke-1 text-zinc-400" />
              )}
            </MenuButton>

            <MenuItems
              anchor="bottom end"
              transition
              className="z-20 mt-2 origin-top-right rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              {session?.user?.name && (
                <MenuItem>
                  <div className="p-2">{session.user.name}</div>
                </MenuItem>
              )}
              {session?.user?.email && (
                <MenuItem>
                  <div className="p-2">{session.user.email}</div>
                </MenuItem>
              )}
              <MenuSeparator className="my-3 h-px bg-zinc-600" />
              <MenuItem>
                <Button
                  className="flex w-full cursor-pointer items-center justify-between gap-1 rounded-sm px-2 py-1 text-left data-[focus]:bg-zinc-600"
                  onClick={signOutAction}
                >
                  Sign out
                  <ArrowLeftStartOnRectangleIcon className="size-4 stroke-2 text-zinc-300" />
                </Button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
    </nav>
  );
}
