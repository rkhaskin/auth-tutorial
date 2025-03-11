import React, { Suspense } from "react";
import NewVerificationForm from "@/components/auth/new-verification-form";

export default function NewVerificationPage() {
  return (
    <div>
      <Suspense fallback="Loading...">
        <NewVerificationForm />
      </Suspense>
    </div>
  );
}
