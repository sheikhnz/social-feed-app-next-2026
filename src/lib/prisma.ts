import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const DATABASE_URL_MISSING =
  "DATABASE_URL is required for Prisma Client (Supabase pooled URL with ?pgbouncer=true recommended).";

const createPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) {
    throw new Error(DATABASE_URL_MISSING);
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });
};

/**
 * Singleton Prisma client for server/runtime use. Avoid importing from Client Components.
 * Prisma 7 uses the `pg` driver via `@prisma/adapter-pg`; CLI/migrations use `DIRECT_URL` in `prisma.config.ts`.
 */
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
