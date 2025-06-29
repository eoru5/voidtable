import { createContext, useContext } from "react";
import type { View } from "~/types/types";

type ViewContextParams = {
  view: View;
  search: string | null;
  setSearch: (search: string | null) => void;
};

export const ViewContext = createContext<ViewContextParams | null>(null);

export const useView = () => {
  const context = useContext(ViewContext);
  if (!context) {
    throw new Error("useView must be used within a ViewContext");
  }
  return context;
};
