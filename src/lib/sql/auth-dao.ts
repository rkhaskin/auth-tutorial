import { pool } from "@/db/mariadb";
import { User } from "@prisma/client";
import { fileLogger } from "@/logger/logger";

export async function getUserById(userId: number): Promise<User | null> {
  const query = `select id, name, email, email_verified, image, password_hash, role_name, isTwoFactorEnabled, createdAt, updatedAt 
                    from users
                   where id = ?`;
  try {
    const user = await pool.query(query, [userId]);
    if (user.length == 0) {
      return null;
    }
    return {
      name: user[0].name,
      id: user[0].id,
      email: user[0].email,
      emailVerified: user[0].email_verified,
      image: user[0].image,
      password: user[0].password_hash,
      roleName: user[0].role_name,
      isTwoFactorEnabled: user[0].isTwoFactorEnabled,
      createdAt: user[0].createdAt,
      updatedAt: user[0].updatedAt,
    };
  } catch (e) {
    fileLogger.error(e);
    return null;
  }
}
