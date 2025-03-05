"use server";

import { getUserByEmail, updateUserVerifiedEmail } from "@/lib/auth-queries";
import {
  getVerificationTokenByToken,
  deleteVerificationTokenById,
} from "@/lib/auth-queries";

export async function newVerification(token: string) {
  // get existing token from db
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: "Token does not exist" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return { error: "Token has expired" };
  }

  // validate user
  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "Email does not exist" };
  }

  // set date on verifiedEmail column
  await updateUserVerifiedEmail(existingUser.id, existingToken.email);

  // once emal is verified, delete verification token.
  await deleteVerificationTokenById(existingToken.id);

  return { success: "Email verified" };
}
