import { PlusIcon } from "@heroicons/react/24/outline";
import type { ReactNode } from "react";
import Button from "../button";

export default function AddRowButton({
  createRow,
  children,
}: {
  createRow: () => void;
  children?: ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center justify-start gap-1 rounded-none border-none px-3 py-1"
      onClick={createRow}
    >
      <PlusIcon className="size-4" />
      {children}
    </Button>
  );
}
