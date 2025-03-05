import { v4 as uuidv4 } from "uuid";
import {
  getVerificationTokenByEmail,
  deleteVerificationTokenById,
  createVerificationToken,
} from "@/lib/auth-queries";

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
