"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import SyncedInput from "../synced-input";
import CardMenu from "./card-menu";

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
  const [renaming, setRenaming] = useState(false);

  useEffect(() => {
    if (renaming && inputRef.current) {
      inputRef.current.focus();
      window.getSelection()?.removeAllRanges();
    }
  }, [renaming]);

  const Container = ({
    className = "flex w-[300px] cursor-pointer justify-between rounded-sm border-1 border-zinc-600 bg-zinc-800 p-5",
    children,
  }: {
    className?: string;
    children: ReactNode;
  }) =>
    renaming ? (
      <div className={className}>{children}</div>
    ) : (
      <Link href={`/${id}`} className={className}>
        {children}
      </Link>
    );

  return (
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
        <CardMenu
          name={name}
          setRenaming={setRenaming}
          deleteProject={deleteProject}
        />
      </div>
    </Container>
  );
}
