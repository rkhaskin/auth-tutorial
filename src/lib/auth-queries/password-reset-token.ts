import { db } from "@/lib/db";

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const passwordResetToken = await db.passwordResetToken.findFirst({
      where: {
        email,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
}

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordResetToken = await db.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    return passwordResetToken;
  } catch {
    return null;
  }
}

export async function deletePasswordResetTokenById(tokenId: number) {
  return db.passwordResetToken.delete({
    where: {
      id: tokenId,
    },
  });
}

export async function createPasswordResetToken(
  email: string,
  token: string,
  expires: Date
) {
  return db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
