/**
 * An array of routes that do not require authentication: public routes
 * @type {string[]}
 */
export const publicRoutes = ["/"];

/**
 * An array of routes which require authentication
 * @type {string[]}
 */
export const authRoutes = ["/auth/login", "/auth/register", "/auth/error"];

/**
 * prefix for api authentication routes. Should not be blocked by authentication
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * default redirect after the user is logged in
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
