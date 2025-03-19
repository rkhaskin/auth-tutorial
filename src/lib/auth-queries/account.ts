import { db } from "@/lib/db";

export async function getAccountByUserId(userId: number) {
  try {
    const account = await db.account.findFirst({
      where: { userId },
    });

    return account;
  } catch {
    return null;
  }
}
