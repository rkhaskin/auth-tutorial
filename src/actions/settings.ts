"use server";

import * as z from "zod";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/lib/sql/auth-dao";
import { currentUser } from "@/lib/current-user";
import {
  getUserByEmail,
  updateUserSettings,
} from "@/lib/auth-queries/auth-queries";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export async function settings(values: z.infer<typeof SettingsSchema>) {
  const user = await currentUser();

  if (!user || !user.id) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(parseInt(user.id));
  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  if (user.isOauth) {
    // do not allow update for any of the following firlds if user is oauth. These fields are handled by the provider
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }

  // new email must be different from  current
  if (values.email && values.email != user.email) {
    // and it must not exist in db
    const existingEmail = await getUserByEmail(values.email);
    if (existingEmail && existingEmail.id !== parseInt(user.id)) {
      return { error: "Email already in use" };
    }

    // generate new verification token
    const verificationToken = await generateVerificationToken(values.email);

    await sendVerificationEmail(values.email, verificationToken.token);

    return { success: "Verification email sent" };
  }

  if (values.password && values.newPassword && dbUser.password) {
    // compare passwords
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );

    if (!passwordMatch) {
      return { error: "Incorrect password" };
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;

    values.newPassword = undefined;
  }

  try {
    updateUserSettings(parseInt(user.id), values);
    return { success: "Settings updated" };
  } catch {
    return { error: "Settings update failed" };
  }
}
