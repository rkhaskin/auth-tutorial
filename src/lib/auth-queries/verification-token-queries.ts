import { db } from "@/lib/db";

export async function getVerificationTokenByEmail(email: string) {
  try {
    const verificationToken = await db.verificationToken.findFirst({
      where: {
        email,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export async function getVerificationTokenByToken(token: string) {
  try {
    const verificationToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    });

    return verificationToken;
  } catch {
    return null;
  }
}

export async function deleteVerificationTokenById(tokenId: number) {
  db.verificationToken.delete({
    where: {
      id: tokenId,
    },
  });
}

export async function createVerificationToken(
  email: string,
  token: string,
  expires: Date
) {
  return db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
