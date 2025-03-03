import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth-queries";

type UserCleaned = {
  id: string;
  name: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  email: string;
  emailVerified: Date | null;
  image: string | null;
  password: string;
};

/*
we need this file to walk around Edge compatibility issue with prisma.
we will trigger the middleware from here and not from auth.ts
with prisma we can not use strategy database beacause iot does not work on the Edge.
*/

export default {
  providers: [
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          // pasword will be empty when user has been created through oauth
          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // TODO find a way to not use this hack
            const userCleaned: UserCleaned = {
              id: user.id.toString(),
              name: user.name,
              createdAt: user.createdAt,
              updatedAt: user.updatedAt,
              email: user.email,
              emailVerified: user.emailVerified,
              image: user.image,
              password: user.password,
            };
            return userCleaned;
            //return user;
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
