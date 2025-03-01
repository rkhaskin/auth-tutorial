import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserById(userId: number) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
