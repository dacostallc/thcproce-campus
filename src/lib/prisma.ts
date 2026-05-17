import { PrismaClient } from "@prisma/client";

function syncDatabaseEnvFromVercelPostgres(): void {
  const pooled =
    process.env.POSTGRES_PRISMA_URL?.trim() || process.env.POSTGRES_URL?.trim();
  const direct =
    process.env.POSTGRES_URL_NON_POOLING?.trim() || process.env.POSTGRES_URL?.trim();

  if (!process.env.DATABASE_URL?.trim() && pooled) {
    process.env.DATABASE_URL = pooled;
  }
  if (!process.env.DIRECT_URL?.trim() && direct) {
    process.env.DIRECT_URL = direct;
  }
  if (!process.env.DIRECT_URL?.trim() && process.env.DATABASE_URL?.trim()) {
    process.env.DIRECT_URL = process.env.DATABASE_URL;
  }
}

function assertValidPostgresEnvUrl(envName: string, raw: string | undefined): void {
  const v = raw?.trim();
  if (!v) {
    throw new Error(
      `[Prisma] ${envName} está vazio. Defina DATABASE_URL/DIRECT_URL OU use Vercel Postgres (variáveis POSTGRES_PRISMA_URL e POSTGRES_URL_NON_POOLING são aceites automaticamente). Local: .env com postgresql://…`
    );
  }
  const scheme = v.split("://")[0]?.toLowerCase();
  if (scheme !== "postgresql" && scheme !== "postgres") {
    throw new Error(
      `[Prisma] ${envName} tem de usar o protocolo postgresql:// ou postgres:// (não use prisma:// aqui). Corrija nas variáveis de ambiente.`
    );
  }
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Module-level cache so initPrismaClient() is O(1) after first call.
let _prismaInstance: PrismaClient | undefined;

function initPrismaClient(): PrismaClient {
  if (_prismaInstance) return _prismaInstance;
  if (globalForPrisma.prisma) {
    _prismaInstance = globalForPrisma.prisma;
    return _prismaInstance;
  }

  syncDatabaseEnvFromVercelPostgres();
  assertValidPostgresEnvUrl("DATABASE_URL", process.env.DATABASE_URL);
  assertValidPostgresEnvUrl("DIRECT_URL", process.env.DIRECT_URL);

  _prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  // In development, cache on globalThis so hot-reload reuses the same connection pool.
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = _prismaInstance;
  }

  return _prismaInstance;
}

// Lazy proxy: PrismaClient is initialized only on first property access (at request
// time), never during Next.js build-time static analysis or page-data collection.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    const client = initPrismaClient();
    const value = (client as unknown as Record<string | symbol, unknown>)[prop];
    return typeof value === "function" ? (value as Function).bind(client) : value;
  },
});
