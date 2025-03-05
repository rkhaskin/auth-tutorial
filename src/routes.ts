/**
 * An array of routes that do not require authentication: public routes
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/new-verification"];

/**
 * An array of routes which require authentication
 * @type {string[]}
 */
export const authRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/error",
  "/auth/reset",
  "/auth/new-password",
];

/**
 * prefix for api authentication routes. Should not be blocked by authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * default redirect after the user is logged in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
