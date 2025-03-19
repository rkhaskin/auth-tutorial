"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import {
  getUserByEmail,
  getTwoFactorTokenByEmail,
  deleteTwoFactorTokenById,
  getTwoFactorConfirmationByUserId,
  deleteTwoFactorConfirmationById,
  createTwoFactorConfirmationToken,
} from "@/lib/auth-queries";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorEmail } from "@/lib/mail";
import { postLog } from "@/logger/logWrapper";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  await postLog("actions::login");

  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validatedFields.data;

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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const existingTwoFactorToken = await getTwoFactorTokenByEmail(email);
      if (!existingTwoFactorToken) {
        return { error: "Invalid 2FA code" };
      }

      if (existingTwoFactorToken.token !== code) {
        return { error: "Invalid 2FA code" };
      }

      const hasExpired = new Date(existingTwoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "2FA Code expired" };
      }

      await deleteTwoFactorTokenById(existingTwoFactorToken.id);
      const existingConfirmationToken = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );

      if (existingConfirmationToken) {
        await deleteTwoFactorConfirmationById(existingConfirmationToken.id);
      }

      // create confirmation. It will be found in the auth.signIn and all will be good
      await createTwoFactorConfirmationToken(existingUser.id);
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    postLog("actions::login before calling signIn");
    console.log("aaaaaaaaaaaaa", callbackUrl);
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
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

    // must throw, otherwise will redirect will not happen to DEFAULT_LOGIN_REDIRECT
    throw error;
  }

  return { success: "Email sent!" };
};
