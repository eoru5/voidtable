"use client";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useState } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import Button from "../button";

export default function CardMenu({
  name,
  setRenaming,
  deleteProject,
}: {
  name: string;
  setRenaming: (renaming: boolean) => void;
  deleteProject: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const MenuContent = () => {
    if (deleting) {
      return (
        <MenuItem>
          <div>
            <div>Are you sure you want to delete {name}?</div>
            <div className="mt-2 flex items-center justify-end gap-2">
              <Button size="sm" variant="outline">
                Cancel
              </Button>
              <Button onClick={deleteProject} size="sm" variant="error">
                Delete
              </Button>
            </div>
          </div>
        </MenuItem>
      );
    }

    return (
      <>
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
            onClick={(e) => {
              e.preventDefault();
              setDeleting(true);
            }}
            className="flex items-center justify-between gap-2"
            variant="error"
            size="sm"
          >
            Delete
            <TrashIcon className="size-4" />
          </Button>
        </MenuItem>
      </>
    );
  };

  return (
    <Menu>
      {({ open }) => {
        if (!open) {
          setDeleting(false);
        }

        return (
          <div>
            <MenuButton className="cursor-pointer focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white">
              <EllipsisHorizontalIcon className="hover-bg-zinc-700 size-6 rounded-xl transition duration-100 hover:bg-zinc-700" />
            </MenuButton>

            <MenuItems
              anchor="bottom start"
              transition
              onClick={(e) => e.preventDefault()}
              className="flex origin-top-right flex-col gap-2 rounded-sm border-1 border-zinc-600 bg-zinc-800 p-2 text-sm transition duration-100 ease-out focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
            >
              <MenuContent />
            </MenuItems>
          </div>
        );
      }}
    </Menu>
  );
}
