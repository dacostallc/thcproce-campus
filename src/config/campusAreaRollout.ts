/**
 * Slugs em construção: lista separada por vírgula em NEXT_PUBLIC_CAMPUS_AREAS_CONSTRUCTION
 * (ex.: industria,laboratorio). Vazio = nenhuma.
 */
export function isCampusAreaConstruction(areaId: string): boolean {
  const raw =
    typeof process.env.NEXT_PUBLIC_CAMPUS_AREAS_CONSTRUCTION === "string"
      ? process.env.NEXT_PUBLIC_CAMPUS_AREAS_CONSTRUCTION.trim()
      : "";
  if (!raw) return false;
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .includes(areaId);
}
