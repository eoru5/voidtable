import { useEffect, useState } from "react";
import { type CellType } from "@prisma/client";
import clsx from "clsx";
import { Input } from "@headlessui/react";
import { toast } from "../toast";

const NUMERIC = /^[-+]?\d*\.?\d*$/;

export const variants = {
  selectedResult: "bg-purple-900",
  searchResult: "bg-purple-600",
  default: "bg-zinc-800",
};

const validateValue = (value: string, type: CellType) => {
  switch (type) {
    case "Text":
      return true;
    case "Number":
      return value === "" || NUMERIC.test(value);
  }
};

export default function DataCell({
  initialValue,
  updateValue,
  type,
  variant = "default",
}: {
  initialValue: string | null;
  updateValue: (value: string) => Promise<void>;
  type: CellType;
  variant?: keyof typeof variants;
}) {
  const [value, setValue] = useState(initialValue);

  const onBlur = async () => {
    if (value === null) return;

    try {
      await updateValue(value);
    } catch {
      toast.error({
        title: "Error occured",
        description: "Cell has been reset",
      });
      setValue(initialValue);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className={clsx(
        "h-full w-full px-4 py-1 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none",
        variants[variant],
      )}
      value={value ?? ""}
      onChange={(e) => {
        if (validateValue(e.target.value, type)) {
          setValue(e.target.value);
        }
      }}
      onBlur={onBlur}
    />
  );
}
