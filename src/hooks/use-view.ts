import { createContext, useContext } from "react";
import type { api } from "~/trpc/react";
import type { View } from "~/types/types";

type ViewContextParams = {
  view: View;
  views: View[];
  createView: ReturnType<typeof api.view.create.useMutation>;
  updateView: ReturnType<typeof api.view.update.useMutation>;
};

export const ViewContext = createContext<ViewContextParams | null>(null);

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewContext");
  }
  return context;
};
