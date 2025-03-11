"use client";

import React, { Suspense, useCallback, useEffect, useState } from "react";
import CardWrapper from "@/components/auth/card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "@/actions/new-verification";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";

export default function NewVerificationForm() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // we have to wrap it in useCallback because we use it in useEffect. Needed to prevent endless loop
  const onSubmit = useCallback(async () => {
    if (!token) {
      setError("Missing token");
      return;
    }

    newVerification(token)
      .then((result) => {
        setSuccess(result?.success);
        setError(result?.error);
      })
      .catch(() => {
        setError("Something went wrong");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      backButtonHref="/auth/login"
      headerLabel="Confirming your verification"
      backButtonLabel="Back to Login"
      showSocial={false}
    >
      <div className="flex w-fill items-center justify-center">
        {!error && !success && <BeatLoader />}
        <Suspense fallback="Loading...">
          <FormSuccess message={success} />
        </Suspense>
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
}
