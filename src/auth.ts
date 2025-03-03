import NextAuth, { DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { getUserById } from "./lib/auth-queries";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role */
      role: UserRole;
      /**
       * By default, TypeScript merges new interface properties and overwrites existing ones.
       * In this case, the default session user properties will be overwritten,
       * with the new ones defined above. To keep the default session user properties,
       * you need to add them back into the newly declared interface.
       */
    } & DefaultSession["user"];
  }
}

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
      console.log("aaaaaaaaaaaaaaaaa", user);
      await db.user.update({
        where: { id: parseInt(user.id) },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // async signIn({ user }) {
    //   if (!user.id) return false;
    //   console.log("bbbbbbbbbbbb");
    //   const userId = parseInt(user.id);
    //   const existingUser = await getUserById(userId);

    //   if (!existingUser || !existingUser.emailVerified) {
    //     return false;
    //   }

    //   return true;
    // },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(parseInt(token.sub));

      if (!existingUser) return token;

      token.role = existingUser.roleName;

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
