import { PrismaClient } from "@prisma/client";

/**
 * Vercel Postgres (Storage) injeta `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` / `POSTGRES_URL`,
 * mas `schema.prisma` lê `DATABASE_URL` e `DIRECT_URL`. Sincroniza só quando estes últimos estão vazios.
 */
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
  /** Sem URL dedicada ao migrator: Prisma exige `directUrl`; usar o mesmo URL evita crash. */
  if (!process.env.DIRECT_URL?.trim() && process.env.DATABASE_URL?.trim()) {
    process.env.DIRECT_URL = process.env.DATABASE_URL;
  }
}

syncDatabaseEnvFromVercelPostgres();

/**
 * Falha cedo com mensagem legível — evita o erro genérico do motor Prisma quando
 * `DATABASE_URL` / `DIRECT_URL` na Vercel estão vazios ou sem esquema `postgresql://`.
 */
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

assertValidPostgresEnvUrl("DATABASE_URL", process.env.DATABASE_URL);
assertValidPostgresEnvUrl("DIRECT_URL", process.env.DIRECT_URL);

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

/**
 * Em ambiente serverless (Vercel) cada cold-start cria uma nova função Node.
 * O padrão de singleton via `globalForPrisma` reutiliza o cliente dentro da
 * mesma instância quente, mas não entre invocações frias.
 *
 * Para o Neon, a URL de DATABASE_URL já aponta para o pooler interno
 * (ep-round-band-*-pooler.*), que gere o pool de conexões via PgBouncer.
 * Não definimos `connection_limit` aqui — o pooler do Neon aceita múltiplas
 * conexões lógicas e as multiplexa para o servidor Postgres real.
 *
 * Se houver erros "too many connections" no Neon Console, acrescente ao
 * DATABASE_URL: `&connection_limit=5` (ajuste conforme o plano Neon).
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
