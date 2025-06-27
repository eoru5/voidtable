import { createContext, useContext } from "react";
import type { api } from "~/trpc/react";
import type { Project } from "~/types/types";

type ProjectContextParams = {
  project: Project;
  renameTable: ReturnType<typeof api.table.rename.useMutation>;
  deleteTable: ReturnType<typeof api.table.delete.useMutation>;
  createTable: ReturnType<typeof api.table.create.useMutation>;
};

export const ProjectContext = createContext<ProjectContextParams | null>(null);

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectContext");
  }
  return context;
};
