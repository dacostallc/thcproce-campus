/**
 * Certificados/coleccionáveis ao fechar 100% das aulas marcadas numa área (local).
 * TODO Prisma: `CourseCompletionCertificate` + verificação servidor.
 */

import { CANNABIS101_AREA_ID } from "@/content/courses";
import { grantBonusInventoryItemIfNeeded } from "@/lib/studentGamificationStorage";

const AREA_COMPLETION_BONUS_ITEM: Partial<Record<string, string>> = {
  [CANNABIS101_AREA_ID]: "p3-cert-cannabis101-complete"
};

/** @returns `true` se o item foi concedido agora. */
export function grantCampusAreaCompletionCollectibleIfNeeded(areaId: string): boolean {
  const itemId = AREA_COMPLETION_BONUS_ITEM[areaId];
  if (!itemId) return false;
  return grantBonusInventoryItemIfNeeded(itemId);
}
