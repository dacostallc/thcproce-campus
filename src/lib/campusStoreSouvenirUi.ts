/**
 * Estado de UI compartilhado entre **Loja** e futuros fluxos para souvenirs.
 * Mantém uma única regra de compra/visualização MOCK (TODO Prisma).
 */

import type { StudentProfile, SouvenirMeta } from "@/lib/studentGamificationStorage";
import { isSouvenirEarnedOrOwned } from "@/lib/campusStoreClient";

export type SouvenirStoreUiHints = {
  costCredits: number | null;
  canPurchaseWithCredits: boolean;
  statusHint?: string;
};

export function getSouvenirStoreUiState(
  profile: StudentProfile,
  meta: Pick<SouvenirMeta, "id" | "costCredits" | "freeAtLevel">
): SouvenirStoreUiHints {
  const sid = meta.id;
  const owned = isSouvenirEarnedOrOwned(profile, sid);

  if (sid === "bone-thcproce" && meta.costCredits === 0) {
    return {
      costCredits: null,
      canPurchaseWithCredits: false,
      statusHint:
        owned || profile.xp > 0
          ? undefined
          : "Obtenha com o primeiro ganho de XP (aula, tour…) — MOCK, sem pagamento."
    };
  }

  if (!owned && meta.freeAtLevel != null && meta.costCredits <= 0) {
    return {
      costCredits: null,
      canPurchaseWithCredits: false,
      statusHint:
        profile.level >= meta.freeAtLevel
          ? "Desbloqueado por nível — sincronização automática offline."
          : `Disponível a partir do nível ${meta.freeAtLevel}.`
    };
  }

  if (!owned && meta.costCredits <= 0) {
    return {
      costCredits: null,
      canPurchaseWithCredits: false,
      statusHint: "Não disponível por créditos."
    };
  }

  return {
    costCredits: meta.costCredits > 0 ? meta.costCredits : null,
    canPurchaseWithCredits: meta.costCredits > 0 && !owned,
    statusHint: meta.costCredits <= 0 ? "Conquistado por nível ou evento MOCK." : undefined
  };
}
