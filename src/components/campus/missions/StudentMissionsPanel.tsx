"use client";

import { CampusMissionsPhase2Panel } from "@/components/campus/missions/CampusMissionsPhase2Panel";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "compact";
  className?: string;
  /** Título da secção (ex. página full vs perfil vs HUD). */
  title?: string;
};

/**
 * Painel de missões do campus — Fase 2 (localStorage, recompensa única por missão).
 * Catálogo MOCK antigo (`studentMissionsMockCatalog`) mantém-se em `lib` para migração futura.
 */
export function StudentMissionsPanel({
  variant = "default",
  className,
  title = "Missões do campus"
}: Props) {
  return <CampusMissionsPhase2Panel variant={variant} className={className} title={title} />;
}
