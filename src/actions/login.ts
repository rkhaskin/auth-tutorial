"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/lib/auth-queries";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password } = validatedFields.data;

  // do not allow users to sign without email verification
  const existingUser = await getUserByEmail(email);
  // users signed in with oauth should not have password in my db and have no business logging in with credentials
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email does not exist" };
  }

  // if used does not have verified email
  if (!existingUser.emailVerified) {
    // generate a new token
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentails" };
        default:
          return { error: "Something went wrong!" };
      }
    }

    throw error;
  }

  return { success: "Email sent!" };
};
