"use client";

import { useCampusProgressClient } from "@/hooks/useCampusProgressClient";
import { useStudentGamification } from "@/hooks/useStudentGamification";
import { getStudentMissions } from "@/lib/studentMissionsClient";
import { cn } from "@/lib/utils";
import { StudentMissionCard } from "@/components/campus/missions/StudentMissionCard";

type Props = {
  variant?: "default" | "compact";
  className?: string;
  /** Título da secção (ex. página full vs perfil). */
  title?: string;
};

export function StudentMissionsPanel({
  variant = "default",
  className,
  title = "Missões do campus"
}: Props) {
  useStudentGamification();
  useCampusProgressClient();
  const missions = getStudentMissions();
  const compact = variant === "compact";

  return (
    <section className={cn("space-y-3", className)}>
      <div>
        <h2
          className={cn(
            "font-semibold text-white",
            compact ? "text-sm" : "text-base"
          )}
        >
          {title}
        </h2>
        <p className={cn("mt-1 text-white/50", compact ? "text-[10px]" : "text-[11px]")}>
          O progresso mantém-se neste dispositivo até a conta da escola passar a sincronizar estas missões.
        </p>
      </div>
      <ul className="space-y-3">
        {missions.map((m) => (
          <li key={m.id}>
            <StudentMissionCard mission={m} compact={compact} />
          </li>
        ))}
      </ul>
    </section>
  );
}
