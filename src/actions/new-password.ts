"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/lib/auth-queries";
import {
  getUserByEmail,
  updateUserPassword,
  deletePasswordResetTokenById,
} from "@/lib/auth-queries";
import { fileLogger } from "@/logger/logger";

export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token: string | null
) {
  fileLogger.info("actions::newPassword");

  if (!token) {
    return { error: "Missing token" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token expired" };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  await updateUserPassword(existingUser.id, passwordHashed);

  await deletePasswordResetTokenById(existingToken.id);

  return { success: "Password updated" };
}
