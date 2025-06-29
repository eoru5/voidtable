import type { RouterOutputs } from "~/trpc/react";

export const numberFilters = ["<", ">"] as const;
export const textFilters = [
  "is",
  "contains",
  "does not contain",
  "is empty",
  "is not empty",
] as const;

export type NumberFilter = (typeof numberFilters)[number];
export type TextFilter = (typeof textFilters)[number];

export type FilterType = NumberFilter | TextFilter;

export type Filter = {
  columnId: number;
  type: FilterType;
  value: string | null;
};

export type Order = "asc" | "desc";

export type Sort = {
  columnId: number;
  order: Order;
};

export type Project = RouterOutputs["project"]["get"];
export type Table = RouterOutputs["table"]["get"];
export type View = RouterOutputs["view"]["get"];
export type Column = RouterOutputs["column"]["get"];
export type Row = Record<string, string | number>;
export type SearchResults = RouterOutputs["table"]["search"];
