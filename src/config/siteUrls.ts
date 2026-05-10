/**
 * Rotas canónicas do campus (evitar hardcode da escola legada em /escola).
 */
export const CAMPUS_HOME_PATH = "/campus" as const;

/** Checkout Lodger ou página de planos quando não há URL absoluta configurada. */
export function lodgerCheckoutHref(): string {
  const u = process.env.NEXT_PUBLIC_LODGER_CHECKOUT?.trim();
  if (u) return u;
  return "/planos";
}

export function isAbsoluteHttpUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
