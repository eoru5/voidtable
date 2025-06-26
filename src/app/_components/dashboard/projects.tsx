"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import ProjectCard from "./project-card";
import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "../button";

export default function Projects() {
  const utils = api.useUtils();
  const router = useRouter();

  const [projects] = api.project.getAll.useSuspenseQuery();

  const createProject = api.project.create.useMutation({
    onSuccess: async (project) => {
      router.push(`/${project.id}`);
      await utils.project.getAll.invalidate();
    },
  });

  const deleteProject = api.project.delete.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  const renameProject = api.project.rename.useMutation({
    onSuccess: async () => {
      await utils.project.getAll.invalidate();
    },
  });

  return (
    <div className="flex grow flex-col gap-10">
      <h1 className="text-3xl font-bold">Your Projects</h1>

      <div>
        <Button
          onClick={() => createProject.mutate({ name: "Untitled Project" })}
          className="flex items-center justify-center gap-1"
        >
          <PlusIcon className="size-5" />
          Create
        </Button>
      </div>

      <div className="flex flex-wrap gap-6">
        {projects.map((project) => (
          <ProjectCard
            name={project.name}
            id={project.id}
            key={project.id}
            renameProject={(name) =>
              renameProject.mutate({ id: project.id, name })
            }
            deleteProject={() => deleteProject.mutate({ id: project.id })}
          />
        ))}
      </div>
    </div>
  );
}
