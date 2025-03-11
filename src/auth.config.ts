import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/lib/auth-queries";
import { postLog } from "@/logger/logWrapper";

/*
we need this file to walk around Edge compatibility issue with prisma.
we will trigger the middleware from here and not from auth.ts
with prisma we can not use strategy database because it does not work on the Edge.
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
        postLog("auth-config Credentials authorize");

        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // we can use prisma db calls inside providers because this code does bot run on the Edge
          const user = await getUserByEmail(email);
          // pasword will be empty when user has been created through oauth
          if (!user || !user.password) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            // return an object which corresponds to interface User.
            return {
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              image: user.image,
            };
          }
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
