import { UserRole } from "@prisma/client";

import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOauth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

export type SettingsDao = {
  name: string | undefined;
  isTwoFactorEnabled: boolean | undefined;
  role_name: UserRole | undefined;
  email: string | undefined;
  password_hash: string | undefined;
};
