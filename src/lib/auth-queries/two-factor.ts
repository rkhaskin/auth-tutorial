import { db } from "@/lib/db";

export async function getTwoFactorTokenByEmail(email: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findFirst({
      where: {
        email,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}

export async function getTwoFactorTokenByToken(token: string) {
  try {
    const twoFactorToken = await db.twoFactorToken.findUnique({
      where: {
        token,
      },
    });

    return twoFactorToken;
  } catch {
    return null;
  }
}

export async function deleteTwoFactorTokenById(tokenId: number) {
  return db.twoFactorToken.delete({
    where: {
      id: tokenId,
    },
  });
}

export async function createTwoFactorToken(
  email: string,
  token: string,
  expires: Date
) {
  return db.twoFactorToken.create({
    data: {
      email,
      token,
      expires,
    },
  });
}
