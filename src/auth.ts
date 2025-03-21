import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { postLog } from "@/logger/logWrapper";
import {
  //getUserById,
  getTwoFactorConfirmationByUserId,
  deleteTwoFactorConfirmationById,
} from "./lib/auth-queries";

import { getUserById } from "@/lib/sql/auth-dao";
import { UserRole } from "@prisma/client";
import { getAccountByUserId } from "./lib/auth-queries/account";

// declare module "next-auth" {
//   /**
//    * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
//    */
//   interface Session {
//     user: {
//       /** The user's role */
//       role: UserRole;
//       /**
//        * By default, TypeScript merges new interface properties and overwrites existing ones.
//        * In this case, the default session user properties will be overwritten,
//        * with the new ones defined above. To keep the default session user properties,
//        * you need to add them back into the newly declared interface.
//        */
//     } & DefaultSession["user"];
//   }
// }

// signIn and signOut functions can only be used on the server: server component or server actions
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  pages: {
    // if there is an error during sign in, redirect to this page
    signIn: "/auth/login",
    // if there is an erorr not handles by above pages, send it to below page
    error: "/auth/error",
  },
  events: {
    // Sent when an account in a given provider is linked to a user in our userbase.
    // For example, when a user signs up with Twitter or when an existing user links their Google account.

    // update emailVerified
    async linkAccount({ user }) {
      if (!user.id) return;
      await db.user.update({
        where: { id: parseInt(user.id) },
        data: { emailVerified: new Date() },
      });
    },
  },
  // callbacks are invoked regardless whether user uses credentials or oauth to log in
  callbacks: {
    async signIn({ user, account }) {
      await postLog(
        `callbacks auth::signIn::${account?.provider} user = ${JSON.stringify(
          user
        )}`
      );
      if (!user.id) return false;

      // allow oauth sign in without email verification
      if (account?.provider !== "credentials") return true;

      // check if existing user has a verified email
      //const existingUser = await getUserById(parseInt(user.id));
      const existingUser = await getUserById(parseInt(user.id));

      if (!existingUser?.emailVerified) return false;

      if (existingUser.isTwoFactorEnabled) {
        // see if we have 2fa confirmation
        const existingConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id
        );

        if (!existingConfirmation) return false;

        // delete existing 2fa confirmation
        await deleteTwoFactorConfirmationById(existingConfirmation.id);
      }

      return true;
    },
    async session({ token, session }) {
      await postLog("callbacks session");
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOauth = token.isOAuth as boolean;
      }

      return session;
    },
    async jwt({ token }) {
      await postLog("callbacks jwt");

      if (!token.sub) return token;

      const existingUser = await getUserById(parseInt(token.sub));

      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.roleName;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  // with prisma we cannot use "database" session strategy.
  // database strategy: store session data in database
  // jwt strategy: store session data in jwt
  session: { strategy: "jwt" },
  ...authConfig,
});
