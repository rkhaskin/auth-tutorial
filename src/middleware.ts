import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { postLog } from "./logger/logWrapper";

// we cannot use auth from auth.ts as we use PrismaAdapter, which cannot be user in Edge
// extract auth middleware from auth.config.ts
const { auth } = NextAuth(authConfig);

import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";

// this auth is the one destructured from auth.config.js
export default auth((req) => {
  if (req.nextUrl.pathname.startsWith("/api/log")) {
    return NextResponse.next();
  }

  async function log(msg: string) {
    await postLog(msg);
  }

  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  log(`middleware::auth nextUrl = ${nextUrl}`);
  log(`middleware::auth req = ${req.body}`);

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  log(
    `middleware:auth - isLoggedIn ${isLoggedIn}; isApiAuthRoute ${isApiAuthRoute}, isPublicRoutes ${isPublicRoutes}, isAuthRoute ${isAuthRoute}`
  );
  /*
    order is important. Always put api/auth first
  */
  if (isApiAuthRoute) return NextResponse.next();

  if (isAuthRoute) {
    if (isLoggedIn) {
      // need to pass nextUrl as a secong arg, so absolute url is build
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }
  if (!isLoggedIn && !isPublicRoutes) {
    // keep indicator of where I came from: http://localhost:3000/auth/login?%2Fsettings-client=
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallBackUrl = encodeURIComponent(callbackUrl);

    return NextResponse.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallBackUrl}`, nextUrl)
    );
  }

  // returning null, means allow access
  return NextResponse.next();
});

// copied from https://clerk.com/docs/references/nextjs/clerk-middleware
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
