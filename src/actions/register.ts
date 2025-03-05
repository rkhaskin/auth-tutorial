"use server";

import bcrypt from "bcryptjs";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail, createUser } from "@/lib/auth-queries";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, name, password } = validatedFields.data;
  const passwordHashed = await bcrypt.hash(password, 10);

  // check if email already exists
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return {
      error: "Email already in use!",
    };
  }

  await createUser(name, email, passwordHashed);

  // TODO send verification token email
  const { email: verificationTokenEmail, token } =
    await generateVerificationToken(email);
  console.log("bbbbbbbbbbbb", email);
  await sendVerificationEmail(verificationTokenEmail, token);

  return { success: "Confirmation email sent" };
};
