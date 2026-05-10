/**
 * Rotas públicas `/planos` — valores monetários só com env explícitos (sem inventar preço).
 * @see .env.example `NEXT_PUBLIC_PLAN_PRICE_*`
 */

export function planosPriceVisitante(): string {
  const v = process.env.NEXT_PUBLIC_PLAN_PRICE_VISITANTE?.trim();
  if (v) return v;
  return "Gratuito";
}

export function planosPriceAluno(): string {
  const v = process.env.NEXT_PUBLIC_PLAN_PRICE_ALUNO?.trim();
  if (v) return v;
  return "Consultar acesso";
}

export function planosPricePremium(): string {
  const v = process.env.NEXT_PUBLIC_PLAN_PRICE_PREMIUM?.trim();
  if (v) return v;
  return "Em breve";
}

/** E-mail institucional para consultas sobre planos (opcional por env). */
export function planosContactEmail(): string | null {
  const v = process.env.NEXT_PUBLIC_PLANOS_CONTACT_EMAIL?.trim();
  return v?.length ? v : null;
}
