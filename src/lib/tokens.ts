import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import {
  getVerificationTokenByEmail,
  deleteVerificationTokenById,
  createVerificationToken,
  getPasswordResetTokenByEmail,
  deletePasswordResetTokenById,
  createPasswordResetToken,
  getTwoFactorTokenByEmail,
  deleteTwoFactorTokenById,
  createTwoFactorToken,
} from "@/lib/auth-queries";

export async function generateTwoFactorToken(email: string) {
  // generate 6-digit number token
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  // set token expiration in 1 hour
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await deleteTwoFactorTokenById(existingToken.id);
  }

  return createTwoFactorToken(email, token, expires);
}

export async function generateVerificationToken(email: string) {
  const token = uuidv4();
  // expire in 1 hour: 3600 seconds * 1000 = milliseconds
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // check that we have a verification token already
  const existingToken = await getVerificationTokenByEmail(email);

  // if one found, delete it before generating a new one
  if (existingToken) {
    deleteVerificationTokenById(existingToken.id);
  }

  // create a new token
  const verificationToken = await createVerificationToken(
    email,
    token,
    expires
  );

  return verificationToken;
}

export async function generatePasswordResetToken(email: string) {
  const token = uuidv4();
  // expire in 1 hour: 3600 seconds * 1000 = milliseconds
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // check that we have a password reset token already
  const existingToken = await getPasswordResetTokenByEmail(email);

  // if one found, delete it before generating a new one
  if (existingToken) {
    deletePasswordResetTokenById(existingToken.id);
  }

  // create a new token
  const passwordResetToken = await createPasswordResetToken(
    email,
    token,
    expires
  );

  return passwordResetToken;
}
