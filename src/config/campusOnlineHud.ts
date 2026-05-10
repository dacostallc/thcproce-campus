/**
 * Histórico: o HUD já usava `NEXT_PUBLIC_SHOW_ONLINE_COUNT` para só mostrar
 * número com “multi-presença”. A contagem no campus usa o canal Realtime
 * `campus-presence` (`useCampusPresence` + `HUD`); sem chaves ou canal, o texto
 * cai em “Campus vivo” sem número.
 *
 * Mantido apenas para código legado; não é mais usado pelo HUD.
 */

export function isCampusShowOnlineCount(): boolean {
  return process.env.NEXT_PUBLIC_SHOW_ONLINE_COUNT === "true";
}
