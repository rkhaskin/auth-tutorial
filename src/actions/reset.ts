"use server";

import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth-queries";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { fileLogger } from "@/logger/logger";

export async function reset(values: z.infer<typeof ResetSchema>) {
  fileLogger.info("actions::reset");

  const validatedValues = ResetSchema.safeParse(values);

  if (!validatedValues.success) {
    return { error: "Invalid email" };
  }

  const { email } = validatedValues.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(
    existingUser.email
  );
  if (
    !passwordResetToken ||
    !passwordResetToken.email ||
    !passwordResetToken.token
  ) {
    return { error: "Error generating password reset token" };
  }

  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );

  return { success: "Reset email sent" };
}
