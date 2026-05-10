/**
 * Banner «Quase lá» ao aproximar do hotspot — desligado por defeito em produção.
 */
export function isCampusZoneEntryPromptEnabled(): boolean {
  return process.env.NEXT_PUBLIC_CAMPUS_ZONE_ENTRY_PROMPT === "true";
}
