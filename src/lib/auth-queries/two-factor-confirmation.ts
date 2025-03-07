import { db } from "@/lib/db";

export async function getTwoFactorConfirmationByUserId(userId: number) {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: {
        userId,
      },
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
}

export async function deleteTwoFactorConfirmationById(confirmationId: number) {
  return db.twoFactorConfirmation.delete({
    where: {
      id: confirmationId,
    },
  });
}

export async function createTwoFactorConfirmationToken(userId: number) {
  return db.twoFactorConfirmation.create({
    data: {
      userId,
    },
  });
}
