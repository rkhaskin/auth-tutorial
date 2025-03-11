import { NewPassswordForm } from "@/components/auth/new-password-form";
import React, { Suspense } from "react";

export default function NewPasswordPage() {
  return (
    <Suspense fallback="Loading...">
      <NewPassswordForm />
    </Suspense>
  );
}
