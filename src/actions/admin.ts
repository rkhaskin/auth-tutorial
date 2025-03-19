"use server";

import { currentUserRole } from "@/lib/current-user";
import { UserRole } from "@prisma/client";

export async function admin() {
  const role = await currentUserRole();

  if (role === UserRole.Admin) {
    return { success: "Allowed" };
  }

  return { error: "Forbidden" };
}
