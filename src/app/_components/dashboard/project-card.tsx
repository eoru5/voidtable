"use client";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../button";
import SyncedInput from "../synced-input";

export default function ProjectCard({
  name,
  id,
  renameProject,
  deleteProject,
}: {
  name: string;
  id: string;
  renameProject: (name: string) => void;
  deleteProject: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const containerClass =
    "flex w-[300px] cursor-pointer justify-between rounded-sm border-1 border-zinc-600 bg-zinc-800 p-5";

  const Container = ({ children }: { children: ReactNode }) =>
    renaming ? (
      <div className={containerClass}>{children}</div>
    ) : (
      <Link href={`/${id}`} className={containerClass}>
        {children}
      </Link>
    );

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      window.getSelection()?.removeAllRanges();
    }
  }, [renaming]);

  return (
    <>
      <Container>
        <div className="flex items-center gap-4">
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-lg bg-purple-500 text-2xl">
            {name[0]}
            {name[1]}
          </div>

          <div>
            {renaming ? (
              <div className="mr-2 mb-2 text-sm">
                <SyncedInput
                  ref={inputRef}
                  className="w-full rounded-none px-0 py-0 focus:outline-offset-2"
                  initialValue={name}
                  updateValue={async (value) => {
                    renameProject(value);
                    setRenaming(false);
                  }}
                />
              </div>
            ) : (
              <div className="mb-2 text-sm">{name}</div>
            )}
            <div className="text-xs font-light text-zinc-300">Project</div>
          </div>
        </div>

        <div>
          <Menu>
            <MenuButton
              onClick={(e) => e.preventDefault()}
              className="cursor-pointer focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white"
            >
              <EllipsisHorizontalIcon className="hover-bg-zinc-700 size-6 rounded-xl transition duration-100 hover:bg-zinc-700" />
            </MenuButton>

            <MenuItems
              anchor="bottom start"
              transition
              onClick={(e) => e.preventDefault()}
              className="flex origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuItem>
                <Button
                  onClick={() => setRenaming(true)}
                  className="flex items-center justify-between gap-2"
                  variant="outline"
                  size="sm"
                >
                  Rename
                  <PencilIcon className="size-4" />
                </Button>
              </MenuItem>
              <MenuItem>
                <Button
                  onClick={() => setOpen(true)}
                  className="flex items-center justify-between gap-2"
                  variant="error"
                  size="sm"
                >
                  Delete
                  <TrashIcon className="size-4" />
                </Button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </Container>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        transition
        className="fixed inset-0 z-20 flex w-screen items-center justify-center bg-black/35 p-4 transition duration-200 ease-out data-closed:opacity-0"
      >
        <DialogPanel className="flex flex-col items-start justify-center gap-4 rounded-lg border-1 border-zinc-600 bg-zinc-900 p-8">
          <DialogTitle className="flex w-full items-center justify-between gap-4 text-2xl font-semibold">
            Delete {name}?
            <XMarkIcon
              className="size-6 cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </DialogTitle>
          <Description className="font-semibold text-gray-300">
            This action is not reversible.
          </Description>
          <div className="flex w-full justify-end gap-2">
            <Button onClick={() => setOpen(false)} variant="outline" size="sm">
              Cancel
            </Button>
            <Button
              onClick={() => {
                deleteProject();
                setDeleting(true);
              }}
              disabled={deleting}
              variant="error"
              size="sm"
            >
              Delete
            </Button>
          </div>
        </DialogPanel>
      </Dialog>
    </>
  );
}
