"use client";
import { Input } from "@headlessui/react";
import {
  useState,
  useEffect,
  type ChangeEvent,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from "react";
import { twMerge } from "tailwind-merge";

export default function SyncedInput({
  initialValue,
  updateValue,
  className = "",
  ref,
  ...props
}: {
  initialValue: string | undefined;
  updateValue: (value: string) => Promise<void>;
  className?: string;
  ref?: Ref<HTMLInputElement>;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onBlur = async () => {
    if (value === undefined) return;

    try {
      await updateValue(value);
      setValue(value);
    } catch {
      setValue(initialValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  return (
    <Input
      ref={ref}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      className={twMerge(
        "w-full rounded-md border-none bg-zinc-800 px-4 py-2 focus:outline-2 focus:-outline-offset-2 focus:outline-zinc-600 focus:not-data-focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
