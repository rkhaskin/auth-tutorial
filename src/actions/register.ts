"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import * as z from "zod";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth-queries";

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

  await db.user.create({
    data: {
      name,
      email,
      password: passwordHashed,
    },
  });

  // TODO send verification token email
  return { success: "User created successfully" };
};
