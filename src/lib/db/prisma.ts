import { PrismaClient } from "@prisma/client";

/**
 * Reuse a single PrismaClient across hot serverless invocations on Vercel.
 * Prevents exhausting PostgreSQL connection pools under traffic spikes.
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

globalForPrisma.prisma = prisma;
