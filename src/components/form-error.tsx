"use client";

import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";

interface FormErrorProps {
  message?: string;
}

export default function FormError({ message }: FormErrorProps) {
  const searchParams = useSearchParams();
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use by different provider"
      : "";

  const msg = message || urlError;
  if (!msg) return null;

  return (
    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{msg}</p>
    </div>
  );
}
