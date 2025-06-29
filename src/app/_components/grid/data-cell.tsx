import { useEffect, useState } from "react";
import type { Column, Getter, Row, Table } from "@tanstack/react-table";
import { useTable } from "~/hooks/use-table";
import type { Row as GridRow } from "~/types/types";
import type { CellType } from "@prisma/client";
import clsx from "clsx";
import { Input } from "@headlessui/react";

const NUMERIC = /^[-+]?\d*\.?\d*$/;

export const variants = {
  darker: "bg-yellow-200 ",
  dark: "bg-yellow-100",
  default: "bg-zinc-800",
};

export default function TableCell({
  getValue,
  row,
  column,
  table,
  types,
  variant = "default",
}: {
  getValue: Getter<unknown>;
  row: Row<GridRow>;
  column: Column<GridRow, unknown>;
  table: Table<GridRow>;
  types: Record<string, CellType>;
  variant?: keyof typeof variants;
}) {
  const { updateCell } = useTable();

  const initialValue = row.original[`f${column.id}`] ? getValue() : "";

  const [value, setValue] = useState(initialValue);

  const onBlur = async () => {
    if (value === null) return;

    const columnId = column.id;

    try {
      const cell = await updateCell.mutateAsync({
        value: value as string,
        rowId: Number(row.original.id),
        columnId: Number(columnId),
      });

      table.options.meta?.updateData(row.index, column.id, cell?.value);
    } catch (error) {
      console.log("Error occured, resetting value ", error);
      setValue(initialValue);
    }
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Input
      className={clsx("h-full w-full px-4 py-1", variants[variant])}
      value={value as string}
      onChange={(e) => {
        if (
          (types[column.id] === "Number" &&
            (e.target.value === "" || NUMERIC.test(e.target.value))) ||
          types[column.id] === "Text"
        ) {
          setValue(e.target.value);
        }
      }}
      onBlur={onBlur}
    />
  );
}
