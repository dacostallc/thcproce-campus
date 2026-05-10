import type { CampusMapInteractiveTarget } from "@/lib/campusMapAreasInteractive.types";

/** Para admin/debug — resumo estável do destino configurado na área. */
export function summarizeInteractiveTarget(target: CampusMapInteractiveTarget): string {
  switch (target.kind) {
    case "course":
      return `course → ${target.courseId}`;
    case "route":
      return `route → ${target.href}`;
    case "hud_store":
      return `hud → loja`;
    case "hud_mural":
      return `hud → mural`;
    case "campus_mural_feed":
      return "mapa → mural (demo)";
    case "schedule_day":
      return "mapa → programação do dia";
    case "cinema_live_rail":
      return "mapa → cinema / ao vivo";
    case "welcome_intro":
      return "boas-vindas";
    case "none":
      return target.reason?.trim()
        ? `none (${target.reason.trim().slice(0, 80)}${target.reason.length > 80 ? "…" : ""})`
        : "none";
    default:
      return String((target as { kind: string }).kind);
  }
}
