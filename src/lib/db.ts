import { PrismaClient } from "@prisma/client";

// this is needed for development mode. Because of NextJS hot reload.
// Whenever I sava a file, "new PrismaCleint()" will run, reinitializing, creating a warning about too many prisma clients

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// When hot reload fires on the next save, it will check if the prisma client has been set and use it, if it has been.
// The reason we srore it in globalThis, is because global is not affected by hot reload
export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ["query"] });

// for that reason, when we are not in production, store prisma client in a global object.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/* if not for development, this would be goof for prod:
export const db = new PrismaClient()
*/
