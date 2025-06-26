"use client";

import type { ReactNode } from "react";
import { toast as sonnerToast } from "sonner";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";

export const toast = {
  default: (toast: Omit<ToastProps, "id">) => {
    return sonnerToast.custom(
      (id) => (
        <Toast id={id} title={toast.title} description={toast.description} />
      ),
      { duration: 4000 },
    );
  },
  error: (toast: Omit<ToastProps, "id">) => {
    return sonnerToast.custom(
      (id) => (
        <Toast
          id={id}
          title={<div className="text-red-700">{toast.title}</div>}
          description={toast.description}
          icon={
            <ExclamationCircleIcon className="size-10 stroke-1 text-red-700" />
          }
        />
      ),
      { duration: 4000 },
    );
  },
  success: (toast: Omit<ToastProps, "id">) => {
    return sonnerToast.custom(
      (id) => (
        <Toast
          id={id}
          title={<div className="text-green-700">{toast.title}</div>}
          description={toast.description}
          icon={<CheckIcon className="size-10 stroke-1 text-green-700" />}
        />
      ),
      { duration: toast.duration },
    );
  },
};

export function Toast(props: ToastProps) {
  const { title, description, id, icon } = props;

  return (
    <div className="flex w-full gap-6 rounded-md bg-white px-6 py-4 shadow-md ring-1 ring-black/5 md:max-w-[364px]">
      <div className="flex flex-1 items-center gap-4">
        {icon}

        <div className="flex w-full flex-col gap-1">
          <div className="text-sm font-semibold text-neutral-900">{title}</div>
          <div className="text-sm text-neutral-600">{description}</div>
        </div>
      </div>
      <div className="flex items-start">
        <button
          className="flex cursor-pointer items-center justify-center gap-1 text-neutral-600 transition duration-200 hover:text-neutral-900"
          onClick={() => sonnerToast.dismiss(id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string | ReactNode;
  description?: string | ReactNode;
  icon?: ReactNode;
  duration?: number;
}
