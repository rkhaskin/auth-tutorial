import React from "react";
import Navbar from "@/app/(protected)/_components/navbar";
import { Toaster } from "sonner";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
      <Navbar />
      <Toaster />
      {children}
    </div>
  );
}
