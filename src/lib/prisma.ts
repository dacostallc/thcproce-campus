import { PrismaClient } from "@prisma/client";

// #region agent log
function agentDebugLog(payload: Record<string, unknown>): void {
  const body = {
    sessionId: "91f9aa",
    timestamp: Date.now(),
    location: "src/lib/prisma.ts",
    ...payload,
  };
  const line = `${JSON.stringify(body)}\n`;
  // #region agent log (file — servidor de ingest nem sempre escreve no workspace)
  try {
    const fs = require("node:fs") as typeof import("node:fs");
    const path = require("node:path") as typeof import("node:path");
    const os = require("node:os") as typeof import("node:os");
    const logFile = path.join(os.homedir(), ".cursor", "plans", "debug-91f9aa.log");
    fs.mkdirSync(path.dirname(logFile), { recursive: true });
    fs.appendFileSync(logFile, line, "utf8");
  } catch {
    /* ignore */
  }
  // #endregion
  fetch("http://127.0.0.1:7921/ingest/fedeaed6-2db0-4def-b356-f5bb89b86d65", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Debug-Session-Id": "91f9aa",
    },
    body: JSON.stringify(body),
  }).catch(() => {});
}
// #endregion

/**
 * Vercel Postgres (Storage) injeta `POSTGRES_PRISMA_URL` / `POSTGRES_URL_NON_POOLING` / `POSTGRES_URL`,
 * mas `schema.prisma` lê `DATABASE_URL` e `DIRECT_URL`. Sincroniza só quando estes últimos estão vazios.
 */
function syncDatabaseEnvFromVercelPostgres(): void {
  const hadDb = Boolean(process.env.DATABASE_URL?.trim());
  const hadDirect = Boolean(process.env.DIRECT_URL?.trim());
  const hasPostgresPrismaUrl = Boolean(process.env.POSTGRES_PRISMA_URL?.trim());
  const hasPostgresUrl = Boolean(process.env.POSTGRES_URL?.trim());
  const hasPostgresUrlNonPooling = Boolean(process.env.POSTGRES_URL_NON_POOLING?.trim());

  const pooled =
    process.env.POSTGRES_PRISMA_URL?.trim() || process.env.POSTGRES_URL?.trim();
  const direct =
    process.env.POSTGRES_URL_NON_POOLING?.trim() || process.env.POSTGRES_URL?.trim();

  // #region agent log
  agentDebugLog({
    message: "syncDatabaseEnvFromVercelPostgres:before",
    hypothesisId: "H1-H5",
    data: {
      hadDb,
      hadDirect,
      hasPostgresPrismaUrl,
      hasPostgresUrl,
      hasPostgresUrlNonPooling,
      pooledResolved: Boolean(pooled),
      directResolved: Boolean(direct),
      nodeEnv: process.env.NODE_ENV,
    },
  });
  // #endregion

  if (!process.env.DATABASE_URL?.trim() && pooled) {
    process.env.DATABASE_URL = pooled;
  }
  if (!process.env.DIRECT_URL?.trim() && direct) {
    process.env.DIRECT_URL = direct;
  }
  /** Sem URL dedicada ao migrator: Prisma exige `directUrl`; usar o mesmo URL evita crash (migrations devem preferir non-pooling quando existir). */
  if (!process.env.DIRECT_URL?.trim() && process.env.DATABASE_URL?.trim()) {
    process.env.DIRECT_URL = process.env.DATABASE_URL;
    // #region agent log
    agentDebugLog({
      message: "syncDatabaseEnvFromVercelPostgres:fallbackDirectEqualsDb",
      hypothesisId: "H1",
      data: { applied: true },
    });
    // #endregion
  }

  // #region agent log
  agentDebugLog({
    message: "syncDatabaseEnvFromVercelPostgres:after",
    hypothesisId: "H1-H5",
    data: {
      filledDb: Boolean(process.env.DATABASE_URL?.trim()),
      filledDirect: Boolean(process.env.DIRECT_URL?.trim()),
    },
  });
  // #endregion
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

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
