import { Prisma } from "@prisma/client";

/** Isolamento para submissão de quiz (reduz duplicação de XP com pedidos paralelos). */
export const QUIZ_SUBMIT_ISOLATION = Prisma.TransactionIsolationLevel.Serializable;

type TxRunner = {
  $transaction: <R>(
    fn: (tx: Prisma.TransactionClient) => Promise<R>,
    options?: {
      isolationLevel?: Prisma.TransactionIsolationLevel;
      maxWait?: number;
      timeout?: number;
    },
  ) => Promise<R>;
};

/**
 * Transação serializável com log simples em falha P2034 (conflito / serialização).
 */
export async function runSerializableTransaction<T>(
  prisma: TxRunner,
  fn: (tx: Prisma.TransactionClient) => Promise<T>,
  logLabel = "serializable_tx",
): Promise<T> {
  try {
    return await prisma.$transaction(fn, {
      isolationLevel: QUIZ_SUBMIT_ISOLATION,
      maxWait: 5000,
      timeout: 10000,
    });
  } catch (e) {
    const code = e && typeof e === "object" && "code" in e ? String((e as { code?: string }).code) : "";
    if (code === "P2034") {
      console.warn(
        `[${logLabel}] Transação serializável abortada (concorrência); pode repetir a submissão com segurança.`,
      );
    }
    throw e;
  }
}
