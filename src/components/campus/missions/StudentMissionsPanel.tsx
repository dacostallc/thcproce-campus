"use client";

import { CampusGuidedMissionsPanel } from "@/components/campus/missions/CampusGuidedMissionsPanel";
import { CampusMissionsPhase2Panel } from "@/components/campus/missions/CampusMissionsPhase2Panel";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "default" | "compact" | "profile-summary";
  className?: string;
  /** Título da secção (ex. página full vs perfil vs HUD). */
  title?: string;
};

/**
 * Painel de missões do campus — orientação persistente (servidor) + Fase 2 (localStorage).
 */
export function StudentMissionsPanel({
  variant = "default",
  className,
  title = "Missões do campus"
}: Props) {
  return (
    <div className={cn("space-y-4", className)}>
      <CampusGuidedMissionsPanel variant={variant} />
      <CampusMissionsPhase2Panel variant={variant} title={title} />
    </div>
  );
}
