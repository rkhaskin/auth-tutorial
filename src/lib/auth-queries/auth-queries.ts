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

export async function createUser(
  name: string,
  email: string,
  password: string
) {
  return db.user.create({
    data: {
      name,
      email,
      password,
    },
  });
}

export async function updateUserVerifiedEmail(userId: number, email: string) {
  await db.user.update({
    where: { id: userId },
    data: {
      emailVerified: new Date(),
      email,
    },
  });
}

export async function updateUserPassword(userId: number, password: string) {
  await db.user.update({
    where: { id: userId },
    data: {
      password,
    },
  });
}
