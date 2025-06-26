export type NumberFilter = "<" | ">";

export type TextFilter =
  | "is"
  | "contains"
  | "does not contain"
  | "is empty"
  | "is not empty";

export type FilterType = NumberFilter | TextFilter;

export type Filter = {
  columnId: number;
  type: FilterType;
  value?: string;
};

export type Sort = {
  columnId: number;
  order: "asc" | "desc";
};
